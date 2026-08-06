import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: IconName;
  accent?: "blue" | "green" | "amber" | "purple";
  trend?: { direction: "up" | "down" | "flat"; label: string };
  className?: string;
}

const ACCENT_MAP = {
  blue: "bg-accent text-primary",
  green: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  amber: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  purple: "bg-mock text-mock-foreground",
};

export function StatCard({ label, value, sub, icon, accent = "blue", trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-xs", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className={cn("rounded-lg p-2", ACCENT_MAP[accent])}>
            <Icon name={icon} size={18} />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend.direction === "up" && "text-[var(--color-success-fg)]",
              trend.direction === "down" && "text-[var(--color-danger-fg)]",
              trend.direction === "flat" && "text-muted-foreground",
            )}
          >
            {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"} {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}
