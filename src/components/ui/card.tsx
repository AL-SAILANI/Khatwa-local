import { cn } from "@/lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Elevation level for consistent depth hierarchy */
  elevation?: "none" | "level1" | "level2" | "level3" | "level4";
  /** Interactive card with hover/focus states */
  interactive?: boolean;
  /** Padding variant */
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  className,
  elevation = "level1",
  interactive = false,
  padding = "md",
  ...props
}: CardProps) {
  // Syllabus defines cards by their 1px border alone — the only shadow in the
  // system is the hard offset behind yellow CTAs, so every level stays flat.
  const elevationClasses = {
    none: "",
    level1: "",
    level2: "",
    level3: "",
    level4: "",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const interactiveClasses = interactive
    ? "transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-hard active:translate-y-0 active:shadow-none cursor-pointer"
    : "";

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface",
        elevationClasses[elevation],
        paddingClasses[padding],
        interactiveClasses,
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-xl font-semibold tracking-tight text-foreground", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-muted leading-relaxed", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-4 flex items-center gap-2", className)} {...props} />
  );
}