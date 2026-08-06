import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium gap-1 border",
  {
    variants: {
      variant: {
        success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)] border-transparent",
        warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)] border-transparent",
        danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)] border-transparent",
        info: "bg-[var(--color-info-bg)] text-[var(--color-info-fg)] border-transparent",
        neutral: "bg-secondary text-secondary-foreground border-transparent",
        mock: "bg-mock text-mock-foreground border-transparent",
        outline: "border-border text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

const STATUS_TO_VARIANT: Record<string, BadgeVariant> = {
  AVAILABLE: "success",
  CONFIRMED: "success",
  CHECKED_IN: "info",
  CHECKED_OUT: "neutral",
  PENDING: "warning",
  CANCELLED: "danger",
  NO_SHOW: "danger",
  OCCUPIED: "info",
  MAINTENANCE: "warning",
  CLEANING: "warning",
  OPEN: "info",
  CLOSED: "neutral",
};

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({ label, variant, className }: BadgeProps) {
  const v = variant ?? STATUS_TO_VARIANT[label] ?? "neutral";
  return <span className={cn(badgeVariants({ variant: v }), className)}>{label}</span>;
}

export { badgeVariants };
export type { BadgeVariant };
