"use client";

import { SelectHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Icon } from "./Icon";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  options?: SelectOption[];
  children?: ReactNode;
  size?: "sm" | "md";
}

export function Select({ options, children, size = "md", className, ...props }: SelectProps) {
  const sizeClass = size === "sm" ? "py-1.5 pl-3 pr-8 text-sm" : "py-2 pl-3 pr-9 text-sm";
  return (
    <div className={clsx("relative inline-block", className)}>
      <select
        className={clsx(
          "w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--card-bg)] text-[var(--foreground)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass
        )}
        {...props}
      >
        {options
          ? options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))
          : children}
      </select>
      <Icon
        name="chevronDown"
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
