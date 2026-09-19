"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { BookOpen, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PronounceButton } from "@/components/vocabulary/pronounce-button";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { vocabAudioUrl, vocabExampleAudioUrl } from "@/lib/vocab-audio";
import type { Lesson } from "@/types/course";
import type { VocabWord } from "@/types/vocabulary";
import { cn } from "@/lib/utils/cn";

export type FlashcardDirection = "recognition" | "production";

export interface FlashcardHandle {
  flip: () => void;
}

interface FlashcardProps {
  word: VocabWord;
  /** recognition: word → meaning. production: meaning → recall the word
   * (generation effect — Slamecka & Graf, 1978). */
  direction: FlashcardDirection;
  bookmarked?: boolean;
  onToggleBookmark?: (wordId: string) => void;
  /** Home lesson this word is anchored to in the vocabulary curriculum. */
  linkedLesson?: Lesson | null;
}

const LEVEL_STYLES = {
  easy: "bg-success/10 text-success-600 dark:text-success-300",
  medium: "bg-warning/10 text-warning-600 dark:text-warning-300",
  hard: "bg-error/10 text-error-600 dark:text-error-300",
} as const;

export const Flashcard = forwardRef<FlashcardHandle, FlashcardProps>(
  function Flashcard({ word, direction, bookmarked, onToggleBookmark, linkedLesson }, ref) {
    const t = useTranslations("vocabulary");
    const { wordMeaning, lessonTitle } = useLocalizedContent();
    const [isFlipped, setIsFlipped] = useState(false);

    useImperativeHandle(ref, () => ({ flip: () => setIsFlipped((f) => !f) }));

    return (
    // `dir="ltr"` on the whole card, not just the word/example lines: this
    // is always an English-vocabulary card, so its geometry (badge in the
    // corner, star on the other corner, lesson link at the bottom) should
    // stay physically fixed across languages the way Anki/Quizlet/Duolingo
    // keep a card's layout stable — not have those `start-`/`end-` badges
    // swap sides under `dir="rtl"` while the pinned-LTR word doesn't move,
    // which is what produced the mismatched card the Arabic UI showed.
    <div
      dir="ltr"
      onClick={() => setIsFlipped((f) => !f)}
      className="relative min-h-64 w-full cursor-pointer select-none [-webkit-tap-highlight-color:transparent] [perspective:1000px]"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsFlipped((f) => !f);
        }}
        aria-label={isFlipped ? t("flipBackAria") : t("flipAria")}
        className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-20 focus:rounded-lg focus:bg-background focus:px-2.5 focus:py-1 focus:text-xs focus:font-medium focus:text-ink-violet focus:ring-2 focus:ring-primary-500 dark:focus:text-primary-300 dark:text-primary-300"
      >
        {isFlipped ? t("flipBackAria") : t("flipAria")}
      </button>
      {onToggleBookmark && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(word.id);
          }}
          aria-label={t("bookmarkWord")}
          className="absolute end-3 top-3 z-10 rounded-lg p-1.5 transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
        >
          <Star className={cn("size-5", bookmarked ? "fill-warning text-warning" : "text-muted/60")} />
        </button>
      )}

      {word.level && (
        <span
          className={cn(
            "absolute start-3 top-3 z-10 rounded-none px-2.5 py-0.5 text-xs font-semibold",
            LEVEL_STYLES[word.level],
          )}
        >
          {word.level === "easy" ? t("easy") : word.level === "medium" ? t("medium") : t("hard")}
        </span>
      )}

      <motion.div
        className="relative min-h-64 w-full [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border p-6 [backface-visibility:hidden]",
            direction === "production"
              ? "border-secondary-400/40 bg-surface dark:border-secondary-400/30"
              : "border-border bg-surface",
          )}
        >
          <span
            className={cn(
              "text-xs",
              direction === "production"
                ? "font-medium text-secondary-700 dark:text-secondary-300"
                : "text-muted",
            )}
          >
            {direction === "production" ? t("recallPrompt") : t("flipHint")}
          </span>

          {direction === "production" ? (
            <span className="text-center text-2xl font-bold leading-snug text-ink-violet dark:text-primary-100">
              {wordMeaning(word)}
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{word.word}</span>
              <PronounceButton text={word.word} label={t("pronounceWord")} audioSrc={vocabAudioUrl(word.word)} />
            </div>
          )}

          {linkedLesson && (
            <Link
              href={`/courses/${linkedLesson.courseId}/${linkedLesson.id}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 start-3 inline-flex max-w-[calc(100%-6rem)] items-center gap-1.5 rounded-none bg-surface-muted px-3 py-1 text-xs font-medium text-muted transition-colors hover:bg-primary-50 hover:text-ink-violet dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
            >
              <BookOpen className="size-3.5 shrink-0" />
              <span className="truncate">{t("fromLesson", { title: lessonTitle(linkedLesson) })}</span>
            </Link>
          )}
        </div>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-secondary-600/20 bg-butter-yellow p-6 text-center [backface-visibility:hidden]"
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Was `text-white` / `text-secondary-300` (light lavender) on
              butter-yellow — both near-invisible (~1.1:1 contrast), a
              leftover from before the palette swap when this face's
              background was dark. Butter-yellow is a light accent now, so
              it needs the same dark ink-violet text every other yellow
              surface in the app already uses. */}
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-ink-violet">{word.word}</span>
            <PronounceButton
              text={word.word}
              label={t("pronounceWord")}
              // This face's background stays butter-yellow in both themes,
              // so the icon needs an explicit dark: override too — without
              // it, PronounceButton's own `dark:text-primary-300` default
              // (assumed against a dark page) would show pale yellow on
              // yellow.
              className="text-ink-violet/70 hover:text-ink-violet dark:text-ink-violet/70 dark:hover:text-ink-violet"
            />
          </div>
          <span className="text-xl font-bold text-secondary-700">{wordMeaning(word)}</span>
          <p className="flex items-center gap-2 text-sm text-ink-violet/80">
            {word.example}
            <PronounceButton
              text={word.example}
              label={t("pronounceExample")}
              size="sm"
              audioSrc={vocabExampleAudioUrl(word.word)}
              className="text-ink-violet/60 hover:text-ink-violet dark:text-ink-violet/60 dark:hover:text-ink-violet"
            />
          </p>
        </div>
      </motion.div>
    </div>
  );
  },
);