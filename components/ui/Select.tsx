"use client";

import { SelectHTMLAttributes, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const sizeClass = size === "sm" ? "h-8 pl-3 pr-8 text-sm" : "h-9 pl-3 pr-9 text-sm";
  return (
    <div className={cn("relative inline-block", className)}>
      <select
        className={cn(
          "w-full appearance-none rounded-md border border-input bg-card text-foreground shadow-xs",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass,
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
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}
