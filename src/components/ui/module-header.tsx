import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ModuleHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  /** Secondary text under the title (label, meta, …). */
  description?: string;
  /** Extra content rendered on the opposite side of the header. */
  action?: React.ReactNode;
}

/**
 * Uniform header for modules inside cards: a navy-gradient icon tile + title
 * block, matching the app's one icon language. Use for every in-page module
 * so the dashboard feels like one family.
 */
export function ModuleHeader({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...props
}: ModuleHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          <Icon className="size-4.5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{title}</h3>
          {description && <p className="truncate text-xs text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}