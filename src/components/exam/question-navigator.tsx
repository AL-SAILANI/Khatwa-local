import { useTranslations } from "next-intl";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ExamSectionKey } from "@/types/question";

interface QuestionNavigatorProps {
  total: number;
  currentIndex: number;
  answeredIndexes: Set<number>;
  flaggedIndexes: Set<number>;
  onJump: (index: number) => void;
  /** The section each question belongs to, in exam order. When provided the
   * palette is grouped under compact section labels exactly like the real
   * STEP UI; otherwise it renders a single ungrouped grid. */
  sections?: ExamSectionKey[];
  /** Sections whose questions are locked — shown dimmed and not clickable.
   * Used once a section has been finished and the next one opened. */
  disabledSections?: Set<ExamSectionKey>;
  /** Collapse the palette to a single row showing only the current
   * question; used to keep the exam screen uncluttered. */
  collapsed?: boolean;
}

export function QuestionNavigator({
  total,
  currentIndex,
  answeredIndexes,
  flaggedIndexes,
  onJump,
  sections,
  disabledSections,
  collapsed = false,
}: QuestionNavigatorProps) {
  const t = useTranslations("trackNames");

  const indexOf = (index: number, disabled = false) => {
    const isCurrent = index === currentIndex;
    const isAnswered = answeredIndexes.has(index);
    const isFlagged = flaggedIndexes.has(index);

    return (
      <button
        key={index}
        type="button"
        onClick={() => (disabled ? undefined : onJump(index))}
        disabled={disabled}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-md border text-[11px] font-semibold transition-colors",
          disabled && "cursor-not-allowed opacity-40",
          !disabled && isCurrent && "border-primary-500 bg-primary-500 text-ink-violet",
          !disabled && !isCurrent && isAnswered && "border-primary-200 bg-primary-50 text-ink-violet dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300",
          !disabled && !isCurrent && !isAnswered && "border-border text-foreground/60 hover:border-primary-500",
        )}
      >
        {index + 1}
        {isFlagged && (
          <Flag className="absolute -top-1 -end-1 size-2.5 fill-warning text-warning" />
        )}
      </button>
    );
  };

  const renderGrid = (fromIndex: number, toIndex: number, disabled = false) => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(2rem,1fr))] gap-1.5">
      {Array.from({ length: toIndex - fromIndex }, (_, i) => indexOf(fromIndex + i, disabled))}
    </div>
  );

  if (collapsed) {
    return (
      <div className="flex items-center justify-center gap-2 px-1">
        {indexOf(Math.max(0, currentIndex - 1))}
        <span className="text-[11px] font-semibold text-muted">
          {currentIndex + 1} / {total}
        </span>
        {indexOf(Math.min(total - 1, currentIndex + 1))}
      </div>
    );
  }

  if (sections && sections.length === total) {
    // Group contiguous runs of the same section, in exam order.
    const groups: { section: ExamSectionKey; start: number; count: number }[] = [];
    sections.forEach((section, i) => {
      const last = groups[groups.length - 1];
      if (last && last.section === section) {
        last.count += 1;
      } else {
        groups.push({ section, start: i, count: 1 });
      }
    });

    return (
      <div className="space-y-2">
        {groups.map((group) => {
          const disabled = Boolean(disabledSections?.has(group.section)) && group.section !== sections[currentIndex];
          return (
            <div key={group.section} className="flex items-stretch gap-3">
              <div className="shrink-0 border-e border-border pe-3 text-[11px] font-bold capitalize text-muted">
                {t(group.section)}
              </div>
              {renderGrid(group.start, group.start + group.count, disabled)}
            </div>
          );
        })}
      </div>
    );
  }

  return renderGrid(0, total);
}
