"use client";

import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "primary" | "danger";
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  confirmVariant = "primary",
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-[var(--overlay-bg)]" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={clsx(
          "relative w-full max-w-md rounded-xl bg-[var(--card-bg)] p-5 shadow-xl",
          className
        )}
      >
        {title && <h2 className="text-base font-semibold text-[var(--foreground)]">{title}</h2>}
        {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} size="sm" onClick={onConfirm}>
              {confirmLabel ?? "Confirm"}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
