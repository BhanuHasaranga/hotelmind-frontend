import { EmptyState } from "@/components/ui/EmptyState";

interface TopicsBreakdownProps {
  topics: Record<string, unknown>[];
}

function firstString(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string") return value;
  }
  return "Unlabeled";
}

function firstNumber(row: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "number") return value;
  }
  return 0;
}

export function TopicsBreakdown({ topics }: TopicsBreakdownProps) {
  if (topics.length === 0) {
    return <EmptyState icon="guestExperience" title="No topics yet" description="Topics appear once enough reviews have been analyzed." />;
  }

  const rows = topics
    .map((t) => ({
      label: firstString(t, ["topic", "name", "keyword"]),
      count: firstNumber(t, ["count", "mentions", "frequency"]),
    }))
    .sort((a, b) => b.count - a.count);

  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-[var(--foreground)]">{row.label}</span>
            <span className="text-gray-400">{row.count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-[var(--sidebar-active)]"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
