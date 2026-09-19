import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small pill above the title — the landing's eyebrow treatment. */
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  eyebrowTone?: "navy" | "gold";
  title: string;
  description?: string;
  /** Extra content rendered beside / above (buttons, filters, …). */
  actions?: React.ReactNode;
}

const eyebrowClass = {
  navy: "border-primary-200 bg-primary-50 text-ink-violet dark:border-primary-700 dark:bg-primary-500/10 dark:text-primary-300",
  // Was `bg-secondary-100 text-cream-paper` — near-white on near-white,
  // invisible in light mode. Same defect fixed on the dashboard and
  // achievements badges; this one is shared by 3 pages (achievements,
  // leaderboard, dashboard welcome header), so fixing it here fixes all 3.
  gold: "border-secondary-300 bg-secondary-100 text-ink-violet dark:border-secondary-500/30 dark:bg-secondary-500/15 dark:text-secondary-200",
} as const;

/**
 * Branded page heading matching the landing's section language: a small
 * eyebrow pill, a bold title and an optional description.
 */
export function PageHeader({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  eyebrowTone = "navy",
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)} {...props}>
      <div className="max-w-2xl">
        {eyebrow && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-none border px-3.5 py-1 text-xs font-semibold",
              eyebrowClass[eyebrowTone],
            )}
          >
            {EyebrowIcon && <EyebrowIcon className="size-4" aria-hidden="true" />}
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}