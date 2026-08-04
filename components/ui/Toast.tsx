import clsx from "clsx";
import { Icon, type IconName } from "./Icon";

export type ToastVariant = "success" | "warning" | "danger" | "info";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-fg)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-fg)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info-fg)]",
};

const VARIANT_ICON: Record<ToastVariant, IconName> = {
  success: "check",
  warning: "alert",
  danger: "alert",
  info: "insight",
};

interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const variant = toast.variant ?? "info";
  return (
    <div
      role="status"
      className={clsx(
        "flex w-80 items-start gap-3 rounded-lg border border-[var(--border)] p-4 shadow-lg",
        VARIANT_CLASSES[variant]
      )}
    >
      <Icon name={VARIANT_ICON[variant]} size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-xs opacity-90">{toast.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-md p-0.5 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
      >
        <Icon name="close" size={14} />
      </button>
    </div>
  );
}
