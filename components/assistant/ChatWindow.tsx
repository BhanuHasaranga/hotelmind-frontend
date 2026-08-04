"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useToast } from "@/components/ui/ToastProvider";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { queryAssistant } from "@/lib/api/ml";

interface ChatWindowProps {
  token: string;
  role?: string;
}

export function ChatWindow({ token, role }: ChatWindowProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const sessionIdRef = useRef(crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    const userMessage: ChatMessageData = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    try {
      const result = await queryAssistant(token, trimmed, roleToPersona(role), sessionIdRef.current);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          citations: result.citations,
          usedLlm: result.used_llm,
        },
      ]);
    } catch (err) {
      toast({
        title: "Assistant unavailable",
        description: err instanceof Error ? err.message : "The AI service could not be reached.",
        variant: "danger",
      });
    } finally {
      setPending(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Icon name="assistant" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Ask HotelMind anything</p>
              <p className="mt-1 text-xs text-gray-500">
                Get answers grounded in your hotel&apos;s real operational data.
              </p>
            </div>
            <SuggestedPrompts role={role} onSelect={send} />
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Icon name="spinner" size={14} className="animate-spin" />
                Thinking…
              </div>
            )}
          </>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-[var(--border)] p-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about occupancy, pricing, guests, staffing…"
          className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--sidebar-active)] text-white disabled:opacity-40"
          aria-label="Send message"
        >
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
}

function roleToPersona(role?: string): string {
  switch (role) {
    case "REVENUE_MANAGER":
      return "revenue_manager";
    case "OPS_MANAGER":
      return "ops_manager";
    case "RESTAURANT_MANAGER":
      return "restaurant_manager";
    case "GUEST_EXPERIENCE_MANAGER":
      return "guest_experience_manager";
    default:
      return "hotel_analyst";
  }
}
