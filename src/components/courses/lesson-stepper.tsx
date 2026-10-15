import { Check, Eye, Flag, Lightbulb, Target, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LessonStageKey } from "@/lib/lesson-blocks";

const ICONS: Record<LessonStageKey, LucideIcon> = {
  learn: Lightbulb,
  example: Eye,
  practice: Target,
  wrap: Flag,
};

/** Labelled progress path for the lesson stages: done, current, upcoming. */
export function LessonStepper({
  stages,
  current,
  labelOf,
  ariaLabel,
}: {
  stages: LessonStageKey[];
  current: number;
  labelOf: (key: LessonStageKey) => string;
  ariaLabel: string;
}) {
  return (
    <ol aria-label={ariaLabel} className="flex items-start">
      {stages.map((key, i) => {
        const Icon = ICONS[key];
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={key}
            aria-current={active ? "step" : undefined}
            className="flex flex-1 flex-col items-center gap-1.5"
          >
            <div className="flex w-full items-center">
              {i > 0 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 transition-colors duration-500",
                    i <= current ? "bg-deep-teal" : "bg-border/30",
                  )}
                />
              )}
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                  done && "border-deep-teal bg-deep-teal text-cream-paper",
                  active &&
                    "scale-110 border-ink-violet bg-butter-yellow text-ink-violet shadow-hard",
                  !done && !active && "border-border/40 bg-surface text-muted",
                )}
              >
                {done ? (
                  <Check className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </span>
              {i < stages.length - 1 && (
                <span
                  className={cn(
                    "h-0.5 flex-1 transition-colors duration-500",
                    i < current ? "bg-deep-teal" : "bg-border/30",
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-center text-[11px] leading-tight sm:text-xs",
                active ? "font-bold" : "text-muted",
              )}
            >
              {labelOf(key)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
