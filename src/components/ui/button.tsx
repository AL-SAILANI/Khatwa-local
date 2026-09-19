import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import React from "react";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-none font-semibold",
    "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary-400 text-secondary-600 border border-secondary-600 shadow-hard hover:bg-primary-500 active:shadow-none active:translate-x-px active:translate-y-px",
        warm: "bg-primary-100/90 text-ink-violet dark:bg-primary-950/60 dark:text-primary-200 border border-primary-200/80 dark:border-primary-800/60 hover:bg-primary-200/90",
        secondary:
          "bg-surface text-foreground border border-border/90 hover:bg-surface-muted hover:border-primary-400/50",
        outline:
          "border-2 border-border bg-transparent text-foreground hover:border-primary-500 hover:text-ink-violet hover:bg-primary-50/50 dark:hover:bg-primary-950/30 dark:hover:text-primary-200",
        ghost: "bg-transparent text-foreground hover:bg-surface-muted hover:text-foreground",
        dark:
          "bg-secondary-600 text-cream-paper hover:bg-secondary-500 dark:bg-cream-paper dark:text-ink-violet dark:hover:bg-cream-paper/90",
        destructive:
          "bg-error text-white hover:bg-error/90",
        success:
          "bg-success text-white hover:bg-success/90",
      },
      size: {
        xs: "h-8 px-3 text-xs gap-1.5",
        sm: "h-9 px-4 text-sm gap-2",
        md: "h-11 px-6 text-sm gap-2",
        lg: "h-13 px-8 text-base gap-2.5",
        xl: "h-14 px-10 text-lg gap-3",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  // When using asChild, ensure children is a single valid React element
  const child = asChild
    ? React.Children.only(children)
    : children;

  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        aria-busy={loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {child}
      </Slot>
    );
  }

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin size-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {child}
    </button>
  );
}
