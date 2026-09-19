"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock, Flag, ChevronRight, ChevronLeft, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionNavigator } from "@/components/exam/question-navigator";
import { QuestionView } from "@/components/exam/question-view";
import { ReviewScreen } from "@/components/exam/review-screen";
import { useExamTimer } from "@/hooks/use-exam-timer";
import { STEP_SECTION_MINUTES } from "@/lib/constants/exam";
import { cn } from "@/lib/utils/cn";
import type { ExamSectionKey, Question, ReadingPassage } from "@/types/question";

export interface ExamSubmitPayload {
  answers: Record<string, string>;
  flagged: string[];
  timeBySection: Partial<Record<ExamSectionKey, number>>;
}

interface ExamRunnerProps {
  title: string;
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  durationMinutes: number;
  onSubmit: (payload: ExamSubmitPayload) => Promise<void>;
}

interface SectionRange {
  section: ExamSectionKey;
  start: number;
  count: number;
}

export function ExamRunner({ title, questions, passages, durationMinutes, onSubmit }: ExamRunnerProps) {
  const t = useTranslations("exam");
  const tTrack = useTranslations("trackNames");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<"exam" | "review">("exam");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);

  const timeBySectionRef = useRef<Partial<Record<ExamSectionKey, number>>>({});
  const sectionEnteredAtRef = useRef<number>(Date.now());

  // Contiguous runs of the same section, in exam order.
  const sectionRanges = useMemo<SectionRange[]>(() => {
    const ranges: SectionRange[] = [];
    questions.forEach((q, i) => {
      const last = ranges[ranges.length - 1];
      if (last && last.section === q.section) last.count += 1;
      else ranges.push({ section: q.section, start: i, count: 1 });
    });
    return ranges;
  }, [questions]);

  const currentQuestion = questions[currentIndex];
  const currentSection = currentQuestion?.section;
  const currentSectionIndex = Math.max(
    0,
    sectionRanges.findIndex((r) => r.section === currentSection),
  );
  const isLastSection = currentSectionIndex === sectionRanges.length - 1;
  const isLastOfSection =
    currentIndex === sectionRanges[currentSectionIndex]!.start + sectionRanges[currentSectionIndex]!.count - 1;
  const sectionMinutes = currentSection ? (STEP_SECTION_MINUTES[currentSection] ?? durationMinutes) : durationMinutes;

  const flushElapsedTime = useCallback((section: ExamSectionKey) => {
    const now = Date.now();
    const elapsedSeconds = (now - sectionEnteredAtRef.current) / 1000;
    timeBySectionRef.current[section] = (timeBySectionRef.current[section] ?? 0) + elapsedSeconds;
    sectionEnteredAtRef.current = now;
  }, []);

  /** Jump within the exam. During the timed run navigation is locked to the
   * current section; `force` (review jumps) can go anywhere. */
  const goToIndex = useCallback(
    (index: number, force = false) => {
      const targetQ = questions[index];
      if (!targetQ) return;
      if (!force && currentSection && targetQ.section !== currentSection) return;
      if (currentQuestion) flushElapsedTime(currentQuestion.section);
      setCurrentIndex(index);
      setMode("exam");
    },
    [questions, currentIndex, currentSection, currentQuestion, flushElapsedTime],
  );

  /** Mark the current section done, discard its remaining time and open the
   * next section with a fresh countdown (or move to review for the last). */
  const finishCurrentSection = useCallback(() => {
    if (!currentQuestion) return;
    flushElapsedTime(currentSection ?? "reading");
    const next = sectionRanges[currentSectionIndex + 1];
    if (next) {
      setCurrentIndex(next.start);
      setMode("exam");
    } else {
      setMode("review");
    }
  }, [currentQuestion, currentSection, currentSectionIndex, sectionRanges, flushElapsedTime]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    if (currentQuestion) flushElapsedTime(currentQuestion.section);
    try {
      await onSubmit({
        answers,
        flagged: [...flagged],
        timeBySection: timeBySectionRef.current,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, flagged, currentQuestion, flushElapsedTime, onSubmit]);

  const handleSectionExpire = useCallback(() => {
    if (mode === "review" || isLastSection) {
      void handleSubmit();
    } else {
      finishCurrentSection();
    }
  }, [mode, isLastSection, handleSubmit, finishCurrentSection]);

  const timer = useExamTimer(sectionMinutes, handleSectionExpire, currentSection ?? null);

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (currentQuestion) {
        if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
        else next.add(currentQuestion.id);
      }
      return next;
    });
  };

  const answeredIndexes = new Set(questions.map((q, i) => (answers[q.id] ? i : -1)).filter((i) => i >= 0));
  const flaggedIndexes = new Set(questions.map((q, i) => (flagged.has(q.id) ? i : -1)).filter((i) => i >= 0));

  // Sections other than the current one are locked during the timed run.
  const lockedSections = useMemo(
    () =>
      new Set(
        sectionRanges.filter((r) => r.section !== currentSection).map((r) => r.section),
      ),
    [sectionRanges, currentSection],
  );

  // Guard: if no questions or no current question, render nothing
  if (!questions.length || !currentQuestion) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
        <div className="flex min-w-0 flex-col sm:flex-row sm:items-center sm:gap-3">
          <h1 className="truncate text-sm font-semibold sm:text-base">{title}</h1>
          {mode === "exam" && (
            <span
              className="inline-flex shrink-0 items-center gap-1.5 rounded-none bg-primary-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-ink-violet dark:text-primary-400"
              dir="rtl"
            >
              {t("sectionOfTotal", { current: currentSectionIndex + 1, total: sectionRanges.length })}
              <span className="font-medium" dir={currentSection === "reading" || currentSection === "listening" ? "ltr" : "rtl"}>
                {tTrack(currentSection ?? "reading")}
              </span>
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <span
            className={cn(
              "font-mono text-lg font-bold tabular-nums",
              timer.isRunningLow ? "text-error" : "text-foreground",
            )}
          >
            {timer.label}
          </span>
          {mode === "exam" && (
            <Button size="sm" variant="outline" onClick={() => setMode("review")}>
              {t("reviewAndSubmit")}
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        {mode === "review" ? (
          <ReviewScreen
            questions={questions}
            answers={answers}
            flagged={flagged}
            passages={passages}
            onJump={(index) => goToIndex(index, true)}
            onSubmit={handleSubmit}
            onBack={() => setMode("exam")}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="mx-auto w-full max-w-4xl flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-none bg-primary-500/10 px-3 py-1 text-xs font-semibold text-ink-violet dark:text-primary-400"
                dir={currentQuestion.section === "reading" || currentQuestion.section === "listening" ? "ltr" : "rtl"}
              >
                {tTrack(currentQuestion.section)}
                <span className="inline-flex items-center gap-1 text-ink-violet/70 dark:text-primary-300/70" dir="rtl">
                  <Clock className="size-3" />
                  {t("sectionTime", { minutes: sectionMinutes })}
                </span>
              </span>
              <span className="text-sm font-medium text-muted">
                {t("questionCounter", { current: currentIndex + 1, total: questions.length })}
              </span>
              <button
                type="button"
                onClick={toggleFlag}
                aria-pressed={flagged.has(currentQuestion.id)}
                aria-label={flagged.has(currentQuestion.id) ? t("unflagForReview") : t("flagForReview")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors",
                  flagged.has(currentQuestion.id)
                    ? "text-warning-600 dark:text-warning-400"
                    : "text-muted hover:text-foreground",
                )}
              >
                <Flag className={cn("size-4", flagged.has(currentQuestion.id) && "fill-warning")} />
                {t("flagForReview")}
              </button>
            </div>

            <div className="mt-6">
              <QuestionView
                question={currentQuestion}
                passage={currentQuestion.passageId ? passages[currentQuestion.passageId] : undefined}
                selectedOptionId={answers[currentQuestion.id]}
                onSelect={(optionId) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
                }
              />
            </div>
          </div>
        )}
      </div>

      {mode === "exam" && (
        <footer className="border-t border-border p-4">
          <div className="mx-auto mb-4 flex w-full max-w-4xl items-center justify-end">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPaletteCollapsed((prev) => !prev)}
              aria-expanded={!isPaletteCollapsed}
              className="text-xs text-muted"
            >
              <LayoutGrid className="size-3.5" />
              {isPaletteCollapsed ? t("showPalette") : t("hidePalette")}
            </Button>
          </div>
          <div
            className={cn(
              "mx-auto mb-4 w-full max-w-4xl overflow-x-auto",
              !isPaletteCollapsed && "max-h-56 overflow-y-auto rounded-xl border border-border/60 bg-surface/60 p-2",
              isPaletteCollapsed && "mb-2",
            )}
          >
            <QuestionNavigator
              total={questions.length}
              currentIndex={currentIndex}
              answeredIndexes={answeredIndexes}
              flaggedIndexes={flaggedIndexes}
              sections={questions.map((q) => q.section)}
              disabledSections={lockedSections}
              onJump={goToIndex}
              collapsed={isPaletteCollapsed}
            />
          </div>

          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIndex === sectionRanges[currentSectionIndex]!.start}
              onClick={() => goToIndex(currentIndex - 1)}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
              {t("previous")}
            </Button>

            {isLastOfSection ? (
              <Button size="sm" onClick={finishCurrentSection}>
                {isLastSection ? t("reviewAndSubmit") : t("finishSection")}
                {!isLastSection && <ChevronLeft className="size-4 rtl:rotate-180" />}
              </Button>
            ) : (
              <Button size="sm" onClick={() => goToIndex(currentIndex + 1)}>
                {t("next")}
                <ChevronLeft className="size-4 rtl:rotate-180" />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}