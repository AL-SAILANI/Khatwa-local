"use client";

import { useTranslations } from "next-intl";
import { CalendarRange, Layers, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardSession } from "@/components/vocabulary/flashcard-session";
import { useVocabQueue } from "@/hooks/use-vocab-queue";

export function ReviewSession() {
  const t = useTranslations("vocabulary");
  const { isLoading, cards, newCount, dueCount, curriculum, dayIndex, totalDays, perDay } = useVocabQueue();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="size-7" />}
        title={t("noWordsToReview")}
        description={t("noWordsToReviewDescription")}
      />
    );
  }

  const dayProgress = Math.min(dayIndex + 1, totalDays);

  return (
    <div className="space-y-4">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
            <CalendarRange className="size-4 text-ink-violet dark:text-primary-300" />
            {t("curriculumDay", { day: dayProgress, total: totalDays })}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-2.5 py-1 text-xs font-medium text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
            <Layers className="size-3.5" />
            {t("dailyNewWords", { count: perDay })}
          </span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-none bg-surface-muted">
          <div
            className="h-full rounded-none bg-ink-violet"
            style={{ width: `${Math.round((dayProgress / totalDays) * 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">{t("curriculumNote")}</p>
      </div>

      <div className="mx-auto flex max-w-md items-center justify-center gap-2">
        {dueCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-3 py-1 text-xs font-medium text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
            {t("dueToday", { count: dueCount })}
          </span>
        )}
        {newCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-none bg-secondary-100 px-3 py-1 text-xs font-medium text-cream-paper dark:bg-secondary-500/15 dark:text-secondary-300">
            {t("newWords", { count: newCount })}
          </span>
        )}
      </div>

      <FlashcardSession cards={cards} context="review" curriculum={curriculum} />
    </div>
  );
}