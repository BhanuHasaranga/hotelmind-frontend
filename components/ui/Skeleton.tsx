import { HTMLAttributes } from "react";
import clsx from "clsx";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx("animate-pulse rounded-md bg-[var(--border)]", className)}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
