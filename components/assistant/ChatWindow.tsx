"use client";

import { useRef, useState } from "react";
import { FileSearch, AlertTriangle, RotateCw } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ChatMessage, type ChatMessageData } from "./ChatMessage";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { queryAssistant } from "@/lib/api/ml";

interface ChatWindowProps {
  token: string;
  role?: string;
}

type ChatMode = "generation" | "retrieval-only" | "unknown";

export function ChatWindow({ token, role }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<ChatMode>("unknown");
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState("");
  const sessionIdRef = useRef(crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    setError(null);
    setLastQuery(trimmed);
    const userMessage: ChatMessageData = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPending(true);

    try {
      const result = await queryAssistant(token, trimmed, roleToPersona(role), sessionIdRef.current);
      setMode(result.used_llm ? "generation" : "retrieval-only");
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
      setError(err instanceof Error ? err.message : "The AI service could not be reached.");
    } finally {
      setPending(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      });
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col gap-3">
      {mode === "retrieval-only" && (
        <Alert
          variant="mock"
          icon={<FileSearch className="h-4 w-4" />}
          title="AI-generated answers are disabled in this environment"
        >
          Showing retrieved source documents directly instead of a synthesized answer — the retrieval layer is live
          and grounded in your hotel&apos;s real operational data.
        </Alert>
      )}

      <div className="flex flex-1 flex-col rounded-xl border border-border bg-card shadow-xs">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon name="assistant" size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Ask HotelMind anything</p>
                <p className="mt-1 text-xs text-muted-foreground">
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="spinner" size={14} className="animate-spin" />
                  Thinking…
                </div>
              )}
              {error && (
                <Alert
                  variant="destructive"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  title="Assistant unavailable"
                  action={
                    <Button size="sm" variant="secondary" onClick={() => send(lastQuery)}>
                      <RotateCw className="h-3.5 w-3.5" /> Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              )}
            </>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-border p-4"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about occupancy, pricing, guests, staffing…"
            className="flex-1 rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            disabled={pending}
          />
          <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send message">
            <Icon name="send" size={16} />
          </Button>
        </form>
      </div>
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
