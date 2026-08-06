import { ReactNode } from "react";
import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon = "insight", title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-10 text-center",
        className
      )}
    >
      <span className="rounded-full bg-[var(--color-info-bg)] p-3 text-[var(--color-info-fg)]">
        <Icon name={icon} size={24} />
      </span>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
