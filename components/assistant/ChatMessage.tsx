import clsx from "clsx";
import { Icon } from "@/components/ui/Icon";
import type { RagCitation } from "@/lib/types/ml";

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: RagCitation[];
  usedLlm?: boolean;
}

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={clsx(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-[var(--sidebar-active)] text-white"
            : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
        )}
      >
        <Icon name={isUser ? "hotel" : "assistant"} size={16} />
      </div>

      <div className={clsx("max-w-[75%] space-y-2", isUser && "items-end")}>
        <div
          className={clsx(
            "rounded-xl px-4 py-2.5 text-sm whitespace-pre-wrap",
            isUser
              ? "bg-[var(--sidebar-active)] text-white"
              : "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)]",
          )}
        >
          {message.content}
        </div>

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.citations.map((c, i) => (
              <span
                key={`${c.source}-${i}`}
                className="rounded-full border border-[var(--border)] bg-[var(--card-bg)] px-2 py-0.5 text-xs text-gray-500"
                title={c.doc_type ?? undefined}
              >
                {c.source}
              </span>
            ))}
          </div>
        )}

        {!isUser && message.usedLlm === false && (
          <p className="text-xs text-gray-400">Answered from cached insights (LLM unavailable)</p>
        )}
      </div>
    </div>
  );
}
