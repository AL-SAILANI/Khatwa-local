"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, Eye, Keyboard, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Flashcard, type FlashcardDirection, type FlashcardHandle } from "@/components/vocabulary/flashcard";
import { SessionSummary } from "@/components/vocabulary/session-summary";
import { useUserProfile } from "@/hooks/use-user-profile";
import type { SessionCard } from "@/hooks/use-vocab-queue";
import { getAllLessons } from "@/lib/firestore/courses";
import { awardVocabSessionXp, getReviewStatesForUser, recordReview, toggleBookmark } from "@/lib/firestore/vocabulary";
import { entryById, resolveLinkedLesson, type VocabCurriculum } from "@/lib/vocab-curriculum";
import type { ReviewQuality } from "@/lib/spaced-repetition";
import type { Lesson } from "@/types/course";
import { cn } from "@/lib/utils/cn";

export type SessionContext = "review" | "favorites" | "sets";

interface FlashcardSessionProps {
  cards: SessionCard[];
  context: SessionContext;
  /** Rendered on the summary screen (e.g. "back to sets"). */
  onExit?: () => void;
  /** Vocabulary curriculum — enables each card to point at its home lesson. */
  curriculum?: VocabCurriculum | null;
}

interface SessionStats {
  again: number;
  hard: number;
  easy: number;
}

/** Deterministic ~1/3 production-mode cards so the same word always trains the
 * same direction. */
function directionFor(wordId: string): FlashcardDirection {
  let hash = 0;
  for (let i = 0; i < wordId.length; i++) hash = (hash * 31 + wordId.charCodeAt(i)) >>> 0;
  return hash % 3 === 0 ? "production" : "recognition";
}

const QUALITY_LABELS = {
  0: { key: "again", pill: "againPill", ring: "border-error/30 bg-error/10 text-error-600 dark:text-error-300" },
  3: { key: "hard", pill: "hardPill", ring: "border-warning/30 bg-warning/10 text-warning-600 dark:text-warning-300" },
  5: { key: "easy", pill: "easyPill", ring: "border-success/30 bg-success/10 text-success-600 dark:text-success-300" },
} as const;

export function FlashcardSession({ cards: initialCards, context, onExit, curriculum }: FlashcardSessionProps) {
  const t = useTranslations("vocabulary");
  const { user } = useUserProfile();
  const [queue, setQueue] = useState<SessionCard[]>(() => [...initialCards].sort(() => Math.random() - 0.5));
  const [index, setIndex] = useState(0);
  const [stats, setStats] = useState<SessionStats>({ again: 0, hard: 0, easy: 0 });
  const [feedback, setFeedback] = useState<{ quality: ReviewQuality; intervalDays: number } | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [xpEarned, setXpEarned] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const requeuedRef = useRef<Set<string>>(new Set());
  const xpPaidRef = useRef(false);
  const busyRef = useRef(false);
  const flashcardRef = useRef<FlashcardHandle>(null);

  const initialNewCount = useMemo(() => initialCards.filter((c) => c.isNew).length, [initialCards]);
  const initialTotal = useMemo(() => initialCards.length, [initialCards]);

  const isDone = index >= queue.length;
  const currentCard = isDone ? null : queue[index];
  const reviewed = Math.min(index, queue.length);

  const linkedLesson =
    currentCard && curriculum
      ? (() => {
          const entry = entryById(curriculum, currentCard.word.id);
          return entry ? resolveLinkedLesson(entry, lessons) : null;
        })()
      : null;

  useEffect(() => {
    if (!user) return;
    getReviewStatesForUser(user.uid).then((states) => {
      setBookmarked(new Set(states.filter((s) => s.bookmarked).map((s) => s.wordId)));
    });
  }, [user]);

  useEffect(() => {
    getAllLessons().then(setLessons);
  }, []);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 1500);
    return () => clearTimeout(timer);
  }, [feedback]);

  const toggleCardBookmark = useCallback(
    async (wordId: string) => {
      if (!user) return;
      const next = !bookmarked.has(wordId);
      setBookmarked((prev) => {
        const updated = new Set(prev);
        if (next) updated.add(wordId);
        else updated.delete(wordId);
        return updated;
      });
      await toggleBookmark(user.uid, wordId, next);
    },
    [user, bookmarked],
  );

  const answer = useCallback(
    async (quality: ReviewQuality) => {
      if (!user || isDone || busyRef.current) return;
      busyRef.current = true;
      const card = queue[index];
      if (!card) {
        busyRef.current = false;
        return;
      }

      setStats((prev) => ({
        ...prev,
        [quality === 0 ? "again" : quality === 3 ? "hard" : "easy"]: prev[
          quality === 0 ? "again" : quality === 3 ? "hard" : "easy"
        ] + 1,
      }));

      const requeued = quality === 0 && !requeuedRef.current.has(card.word.id);
      if (requeued) {
        requeuedRef.current.add(card.word.id);
        setQueue((q) => [...q, card]);
      }

      const newIndex = index + 1;
      const finalLength = queue.length + (requeued ? 1 : 0);
      setIndex(newIndex);

      const finished = newIndex >= finalLength;
      if (finished && !xpPaidRef.current) {
        xpPaidRef.current = true;
        const xp = Math.min(newIndex, 10);
        setXpEarned(xp);
      }

      busyRef.current = false;

      // Persist in the background — never block advancing to the next card.
      void recordReview(user.uid, card.word.id, quality).then((next) => {
        setFeedback({ quality, intervalDays: next.intervalDays });
      });
      if (finished) void awardVocabSessionXp(user.uid, Math.min(newIndex, 10));
    },
    [user, isDone, queue, index],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "1") answer(0);
      else if (e.key === "2") answer(3);
      else if (e.key === "3") answer(5);
      else if (e.key.toLowerCase() === "f") flashcardRef.current?.flip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  if (isDone) {
    return (
      <SessionSummary
        context={context}
        stats={stats}
        total={initialTotal}
        newCount={initialNewCount}
        xpEarned={xpEarned}
        onExit={onExit}
      />
    );
  }

  const remaining = queue.length - index;
  const progress = Math.round((reviewed / Math.max(queue.length, 1)) * 100);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative size-10">
            <svg
                viewBox="0 0 36 36"
                className="size-10 -rotate-90"
                role="progressbar"
                aria-label={t("sessionProgress")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="4" className="stroke-border" />
              <circle
                cx="18"
                cy="18"
                r="15.5"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progress * 0.87} 100`}
                className="stroke-ink-violet dark:stroke-primary-300"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">{progress}%</span>
          </div>
          <div>
            <div className="text-sm font-semibold">{t("remainingCounter", { remaining, total: queue.length })}</div>
            <div className="text-xs text-muted">{t("spacedLine")}</div>
          </div>
        </div>

        {currentCard && (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-none px-3 py-1 text-xs font-medium",
              directionFor(currentCard.word.id) === "production"
                ? "bg-secondary-100 text-cream-paper dark:bg-secondary-500/15 dark:text-secondary-300"
                : "bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300",
            )}
          >
            {directionFor(currentCard.word.id) === "production" ? (
              <>
                <PenLine className="size-3.5" />
                {t("modeRecall")}
              </>
            ) : (
              <>
                <Eye className="size-3.5" />
                {t("modeRecognize")}
              </>
            )}
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard?.word.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {currentCard && (
            <Flashcard
              ref={flashcardRef}
              word={currentCard.word}
              direction={directionFor(currentCard.word.id)}
              bookmarked={bookmarked.has(currentCard.word.id)}
              onToggleBookmark={toggleCardBookmark}
              linkedLesson={linkedLesson}
            />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium",
              QUALITY_LABELS[feedback.quality].ring,
            )}
          >
            <CalendarClock className="size-4" />
            {feedback.intervalDays <= 0
              ? t("nextReviewSoon")
              : feedback.intervalDays === 1
                ? t("nextReviewTomorrow")
                : t("nextReviewInDays", { days: feedback.intervalDays })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 sm:gap-3">
        <Button variant="outline" onClick={() => answer(0)} className="border-error/30 text-error-600 hover:border-error dark:text-error-300">
          <kbd className="rounded-md border border-current/30 bg-black/5 px-1.5 text-xs opacity-80 dark:bg-white/10">{t("key1")}</kbd>
          {t("dontKnow")}
        </Button>
        <Button variant="outline" onClick={() => answer(3)} className="border-warning/30 text-warning-600 hover:border-warning dark:text-warning-300">
          <kbd className="rounded-md border border-current/30 bg-black/5 px-1.5 text-xs opacity-80 dark:bg-white/10">{t("key2")}</kbd>
          {t("hard")}
        </Button>
        <Button variant="outline" onClick={() => answer(5)} className="border-success/30 text-success-600 hover:border-success dark:text-success-300">
          <kbd className="rounded-md border border-current/30 bg-black/5 px-1.5 text-xs opacity-80 dark:bg-white/10">{t("key3")}</kbd>
          {t("easy")}
        </Button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Keyboard className="size-3.5 text-ink-violet dark:text-primary-300" />
          {t("keyboardHint")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border bg-surface-muted px-1.5 text-xs text-foreground">{t("keyFlip")}</kbd>
            {t("flipShortcut")}
          </span>
          <span className="text-muted/60">·</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border bg-surface-muted px-1.5 text-xs text-foreground">{t("key1")}</kbd>
            {t("dontKnow")}
          </span>
          <span className="text-muted/60">·</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border bg-surface-muted px-1.5 text-xs text-foreground">{t("key2")}</kbd>
            {t("hard")}
          </span>
          <span className="text-muted/60">·</span>
          <span className="inline-flex items-center gap-1.5">
            <kbd className="rounded-md border border-border bg-surface-muted px-1.5 text-xs text-foreground">{t("key3")}</kbd>
            {t("easy")}
          </span>
        </div>
      </div>
    </div>
  );
}