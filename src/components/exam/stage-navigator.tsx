import { Flag } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StageNavigatorProps {
  /** Index of the stage's first question in the whole exam. */
  start: number;
  count: number;
  currentIndex: number;
  answeredIndexes: Set<number>;
  flaggedIndexes: Set<number>;
  onJump: (index: number) => void;
  size?: "sm" | "md";
}

/** Question grid for the current stage only; earlier stages are closed for good. */
export function StageNavigator({
  start,
  count,
  currentIndex,
  answeredIndexes,
  flaggedIndexes,
  onJump,
  size = "sm",
}: StageNavigatorProps) {
  return (
    <div
      className={cn(
        "grid gap-1.5",
        size === "sm"
          ? "grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(3rem,1fr))]",
      )}
    >
      {Array.from({ length: count }, (_, i) => {
        const index = start + i;
        const isCurrent = index === currentIndex;
        const isAnswered = answeredIndexes.has(index);
        const isFlagged = flaggedIndexes.has(index);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onJump(index)}
            aria-current={isCurrent ? "true" : undefined}
            aria-label={`${i + 1}`}
            className={cn(
              "relative flex items-center justify-center rounded-md border font-semibold tabular-nums transition-colors",
              size === "sm" ? "h-9 text-xs" : "h-12 text-sm",
              isCurrent && "border-primary-500 bg-primary-500 text-ink-violet",
              !isCurrent &&
                isAnswered &&
                "border-primary-400 bg-primary-100 text-ink-violet dark:border-primary-500/40 dark:bg-primary-500/20 dark:text-primary-200",
              !isCurrent &&
                !isAnswered &&
                "border-border text-foreground/60 hover:border-primary-500",
            )}
          >
            {i + 1}
            {isFlagged && (
              <Flag className="absolute -top-1 -end-1 size-3 fill-warning text-warning" />
            )}
          </button>
        );
      })}
    </div>
  );
}
