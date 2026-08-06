const ROLE_PROMPTS: Record<string, string[]> = {
  OWNER: [
    "How is revenue trending this month?",
    "What are the top risks to occupancy next week?",
    "Summarize guest satisfaction across all properties.",
  ],
  REVENUE_MANAGER: [
    "Why is occupancy lower than last week?",
    "Which room types generate the most revenue?",
    "What pricing changes would improve next weekend's revenue?",
  ],
  OPS_MANAGER: [
    "What staffing levels do we need tomorrow?",
    "Are there any anomalies in room turnaround times?",
    "Which departments are understaffed this week?",
  ],
  RESTAURANT_MANAGER: [
    "What's tomorrow's expected breakfast demand?",
    "Which menu items are underperforming?",
    "How much food waste have we had this month?",
  ],
  GUEST_EXPERIENCE_MANAGER: [
    "What are the most common guest complaints this month?",
    "Which guests are at risk of leaving a bad review?",
    "Summarize recent negative reviews by topic.",
  ],
};

const DEFAULT_PROMPTS = [
  "What's our current occupancy forecast?",
  "Summarize this week's key insights.",
];

interface SuggestedPromptsProps {
  role?: string;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ role, onSelect }: SuggestedPromptsProps) {
  const prompts = (role && ROLE_PROMPTS[role]) || DEFAULT_PROMPTS;

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground transition-colors hover:border-[var(--sidebar-active)] hover:text-primary"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
