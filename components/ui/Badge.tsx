type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  danger:  "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  info:    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const STATUS_TO_VARIANT: Record<string, BadgeVariant> = {
  AVAILABLE:   "success",
  CONFIRMED:   "success",
  CHECKED_IN:  "info",
  CHECKED_OUT: "neutral",
  PENDING:     "warning",
  CANCELLED:   "danger",
  NO_SHOW:     "danger",
  OCCUPIED:    "info",
  MAINTENANCE: "warning",
  CLEANING:    "warning",
  OPEN:        "info",
  CLOSED:      "neutral",
};

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export function Badge({ label, variant }: BadgeProps) {
  const v = variant ?? STATUS_TO_VARIANT[label] ?? "neutral";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[v]}`}>
      {label}
    </span>
  );
}
