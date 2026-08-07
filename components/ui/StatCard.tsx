import { Icon, type IconName } from "./Icon";
import { cn } from "@/lib/utils";

/**
 * Accent controls only the small icon chip — the card itself always stays a
 * white/`bg-card` surface. Giving each KPI card its own bright background is a
 * deliberate non-goal: the executive dashboard should read as one calm grid.
 *
 * Accents are named for the role they play, not the color they render, so the
 * palette can change without every call site becoming a lie.
 */
type StatAccent = "brand" | "success" | "warning" | "premium";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: IconName;
  accent?: StatAccent;
  trend?: { direction: "up" | "down" | "flat"; label: string };
  className?: string;
}

const ACCENT_MAP: Record<StatAccent, string> = {
  brand: "bg-accent text-primary",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  // Champagne wash — reserved for executive/premium metrics, used sparingly.
  premium: "bg-[color-mix(in_srgb,var(--color-brand-accent)_16%,transparent)] text-[var(--color-brand-accent)]",
};

export function StatCard({ label, value, sub, icon, accent = "brand", trend, className }: StatCardProps) {
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
