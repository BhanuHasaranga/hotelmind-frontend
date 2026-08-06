import { Sparkles, CircleCheck, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

type DataSource = "real" | "mock" | "beta";

const CONFIG: Record<DataSource, { label: string; icon: typeof Sparkles; className: string }> = {
  real: {
    label: "Live data",
    icon: CircleCheck,
    className: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  },
  beta: {
    label: "Beta — directional",
    icon: FlaskConical,
    className: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  },
  mock: {
    label: "Simulated preview",
    icon: Sparkles,
    className: "bg-mock text-mock-foreground",
  },
};

interface DataSourceBadgeProps {
  source: DataSource;
  className?: string;
  compact?: boolean;
}

export function DataSourceBadge({ source, className, compact = false }: DataSourceBadgeProps) {
  const { label, icon: IconComponent, className: colorClassName } = CONFIG[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        colorClassName,
        className,
      )}
      title={label}
    >
      <IconComponent className="h-3 w-3" />
      {!compact && label}
    </span>
  );
}
