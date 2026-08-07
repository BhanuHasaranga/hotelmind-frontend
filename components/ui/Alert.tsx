import { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm", {
  variants: {
    variant: {
      default: "border-border bg-card text-foreground",
      info: "border-transparent bg-[var(--color-info-bg)] text-[var(--color-info-fg)]",
      warning: "border-transparent bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
      destructive: "border-transparent bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
      mock: "border-dashed border-mock-foreground/30 bg-mock text-mock-foreground",
      // The page-level "Preview module" banner. Uses the soft brand green so a
      // persistent, full-width banner reads calm and on-brand instead of
      // shouting. Note this is NOT a recolor of the `mock` variant: the violet
      // --mock token still marks simulated data everywhere it matters at the
      // point of use (DataSourceBadge, sidebar dots, inline preview cards), and
      // these banners always sit alongside one of those markers.
      preview: "border-dashed border-primary/25 bg-accent text-primary",
    },
  },
  defaultVariants: { variant: "default" },
});

interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Alert({ title, children, icon, variant, className, action }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)} role="alert">
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
        <div className="flex-1">
          {title && <p className="font-medium">{title}</p>}
          {children && <div className={cn("text-sm", title && "mt-1 opacity-90")}>{children}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
