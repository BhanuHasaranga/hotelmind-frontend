"use client";

import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600",
  danger:    "bg-red-600 text-white hover:bg-red-700",
  ghost:     "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
}

export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-sm";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
