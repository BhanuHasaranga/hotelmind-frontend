import { FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const isRetrievalOnly = !isUser && message.usedLlm === false;

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-primary",
        )}
      >
        <Icon name={isUser ? "hotel" : isRetrievalOnly ? "search" : "assistant"} size={16} />
      </div>

      <div className={cn("max-w-[75%] space-y-2", isUser && "items-end")}>
        {isRetrievalOnly ? (
          <div className="rounded-xl border border-dashed border-mock-foreground/30 bg-mock/40 px-4 py-3 text-sm text-foreground">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-mock-foreground">
              <FileSearch className="h-3.5 w-3.5" />
              Retrieved sources (AI generation unavailable)
            </div>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        ) : (
          <div
            className={cn(
              "whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm",
              isUser ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground",
            )}
          >
            {message.content}
          </div>
        )}

        {!isUser && message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.citations.map((c, i) => (
              <span
                key={`${c.source}-${i}`}
                className="rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
                title={c.doc_type ?? undefined}
              >
                {c.source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
