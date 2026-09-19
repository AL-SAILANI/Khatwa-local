import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-none px-2.5 py-0.5",
    "text-xs font-medium",
    "transition-colors duration-200",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300",
        secondary:
          "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300",
        success:
          "bg-success/10 text-success dark:bg-success/20",
        warning:
          "bg-warning/10 text-warning dark:bg-warning/20",
        error:
          "bg-error/10 text-error dark:bg-error/20",
        neutral:
          "bg-surface-muted text-muted border border-border",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-surface-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-[11px] gap-1",
        md: "px-2.5 py-0.5 text-xs gap-1.5",
        lg: "px-3 py-1 text-sm gap-2",
      },
      dot: {
        true: "",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", size: "md", dot: false },
  },
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: "primary" | "success" | "warning" | "error";
}

export function Badge({
  className,
  variant,
  size,
  dot,
  dotColor = "primary",
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "size-1.5 rounded-full shrink-0",
            dotColor === "primary" && "bg-primary-500",
            dotColor === "success" && "bg-success",
            dotColor === "warning" && "bg-warning",
            dotColor === "error" && "bg-error",
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}