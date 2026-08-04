import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-[var(--border)] bg-[var(--card-bg)] shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("flex items-start justify-between p-5 pb-0", className)} {...props} />;
}

export function CardTitle({ className, children }: { className?: string; children: ReactNode }) {
  return <h3 className={clsx("text-sm font-semibold text-[var(--foreground)]", className)}>{children}</h3>;
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("flex items-center justify-end gap-2 border-t border-[var(--border)] px-5 py-3", className)}
      {...props}
    />
  );
}
