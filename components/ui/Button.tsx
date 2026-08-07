import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--primary))]",
        danger: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
        ghost: "text-primary hover:bg-accent",
        // Reserved for genuine AI / premium actions (run a forecast, apply an
        // AI recommendation, executive insight) — never for ordinary CRUD.
        // Brand green fill with a champagne edge so it reads as premium
        // without turning the UI gold-heavy.
        ai: "bg-primary text-primary-foreground shadow-xs ring-1 ring-inset ring-[var(--color-brand-accent)]/60 hover:bg-[var(--color-brand-secondary)] [&_svg]:text-[var(--color-brand-accent)]",
        outline: "border border-border bg-transparent hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-9 px-4 text-sm",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
