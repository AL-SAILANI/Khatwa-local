"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionView } from "@/components/exam/question-view";
import { ListeningClip } from "@/components/exam/listening-clip";
import { StageBriefing } from "@/components/exam/stage-briefing";
import { StageNavigator } from "@/components/exam/stage-navigator";
import { StageReview } from "@/components/exam/stage-review";
import { useExamTimer } from "@/hooks/use-exam-timer";
import { buildClips, buildStages, summarizeStage } from "@/lib/exam-stages";
import { cn } from "@/lib/utils/cn";
import type {
  ExamSectionKey,
  Question,
  ReadingPassage,
} from "@/types/question";

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

type Phase = "briefing" | "running" | "review";

/**
 * Timed exam in stages (reading, grammar + writing analysis, listening). Each
 * stage opens with a briefing, has its own countdown, and closes for good when
 * finished or when time runs out: the learner cannot go back to it.
 */
export function ExamRunner({
  title,
  questions,
  passages,
  durationMinutes,
  onSubmit,
}: ExamRunnerProps) {
  const t = useTranslations("exam");
  const tStage = useTranslations("exam.stage");
  const tListening = useTranslations("exam.listening");
  const tTrack = useTranslations("trackNames");
  const stages = useMemo(
    () => buildStages(questions, durationMinutes),
    [questions, durationMinutes],
  );

  const [stageIndex, setStageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("briefing");
  const [currentIndex, setCurrentIndex] = useState(stages[0]?.start ?? 0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showList, setShowList] = useState(false);
  const [clipEnded, setClipEnded] = useState(false);

  const timeBySectionRef = useRef<Partial<Record<ExamSectionKey, number>>>({});
  const enteredAtRef = useRef<number>(0);

  const stage = stages[stageIndex];
  const isLastStage = stageIndex === stages.length - 1;
  const currentQuestion: Question | undefined = questions[currentIndex];
  const isListening = stage?.key === "listening";
  const clips = useMemo(
    () =>
      stage && stage.key === "listening" ? buildClips(questions, stage) : [],
    [stage, questions],
  );
  const clipIndex = clips.findIndex(
    (c) => currentIndex >= c.start && currentIndex < c.start + c.count,
  );
  const currentClip = clips[clipIndex];

  const flushElapsedTime = useCallback(
    (section: ExamSectionKey | undefined) => {
      const now = Date.now();
      if (section) {
        timeBySectionRef.current[section] =
          (timeBySectionRef.current[section] ?? 0) +
          (now - enteredAtRef.current) / 1000;
      }
      enteredAtRef.current = now;
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    flushElapsedTime(questions[currentIndex]?.section);
    try {
      await onSubmit({
        answers,
        flagged: [...flagged],
        timeBySection: timeBySectionRef.current,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answers,
    flagged,
    currentIndex,
    questions,
    flushElapsedTime,
    onSubmit,
    isSubmitting,
  ]);

  /** Closes the current stage for good and opens the next one (or submits). */
  const finishStage = useCallback(() => {
    flushElapsedTime(questions[currentIndex]?.section);
    const next = stages[stageIndex + 1];
    if (!next) {
      void handleSubmit();
      return;
    }
    setStageIndex(stageIndex + 1);
    setCurrentIndex(next.start);
    setShowList(false);
    setClipEnded(false);
    setPhase("briefing");
  }, [
    flushElapsedTime,
    questions,
    currentIndex,
    stages,
    stageIndex,
    handleSubmit,
  ]);

  const timer = useExamTimer(
    stage?.minutes ?? durationMinutes,
    finishStage,
    stage?.key ?? null,
    phase !== "briefing",
  );

  const goTo = useCallback(
    (index: number) => {
      if (!stage || index < stage.start || index >= stage.start + stage.count)
        return;
      flushElapsedTime(questions[currentIndex]?.section);
      setCurrentIndex(index);
      setClipEnded(false);
      setPhase("running");
    },
    [stage, flushElapsedTime, questions, currentIndex],
  );

  const toggleFlag = useCallback(() => {
    if (!currentQuestion) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentQuestion.id)) next.delete(currentQuestion.id);
      else next.add(currentQuestion.id);
      return next;
    });
  }, [currentQuestion]);

  // Keyboard: A-D or 1-4 choose an option, N / P move, F flags.
  useEffect(() => {
    if (phase !== "running" || !currentQuestion || !stage || isListening)
      return;
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
        return;
      const optionIndex = /^(?:Key([A-D])|Digit([1-4]))$/.exec(event.code);
      if (optionIndex) {
        const index = optionIndex[1]
          ? optionIndex[1].charCodeAt(0) - 65
          : Number(optionIndex[2]) - 1;
        const option = currentQuestion.options[index];
        if (option)
          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.id }));
      } else if (event.code === "KeyN") goTo(currentIndex + 1);
      else if (event.code === "KeyP") goTo(currentIndex - 1);
      else if (event.code === "KeyF") toggleFlag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    phase,
    currentQuestion,
    stage,
    isListening,
    currentIndex,
    goTo,
    toggleFlag,
  ]);

  const answeredIndexes = useMemo(
    () =>
      new Set(
        questions.map((q, i) => (answers[q.id] ? i : -1)).filter((i) => i >= 0),
      ),
    [questions, answers],
  );
  const flaggedIndexes = useMemo(
    () =>
      new Set(
        questions
          .map((q, i) => (flagged.has(q.id) ? i : -1))
          .filter((i) => i >= 0),
      ),
    [questions, flagged],
  );

  if (!stage || !currentQuestion) return null;

  const summary = summarizeStage(stage, questions, answers, flagged);
  const positionInStage = currentIndex - stage.start + 1;
  const isLastInStage = positionInStage === stage.count;
  const timeShare = Math.max(
    0,
    Math.min(1, timer.remainingSeconds / (stage.minutes * 60)),
  );
  const timeLeftCritical = timer.remainingSeconds <= 60;

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-background">
      <header className="border-b border-border">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold sm:text-lg">{title}</h1>
            <ol
              className="mt-1.5 hidden items-center gap-1.5 sm:flex"
              aria-label={tStage("stages")}
            >
              {stages.map((s, i) => (
                <li
                  key={s.key}
                  aria-current={i === stageIndex ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 border px-3 py-1 text-xs font-semibold",
                    i < stageIndex &&
                      "border-success/40 bg-success/10 text-success-600 dark:text-success-300",
                    i === stageIndex &&
                      "border-primary-500 bg-primary-500 text-ink-violet",
                    i > stageIndex && "border-border text-muted",
                  )}
                >
                  {i < stageIndex ? (
                    <Check className="size-3" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {tStage(`name.${s.key}`)}
                </li>
              ))}
            </ol>
            <p className="mt-0.5 text-xs text-muted sm:hidden">
              {tStage("stageOf", {
                current: stageIndex + 1,
                total: stages.length,
              })}{" "}
              · {tStage(`name.${stage.key}`)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div
              className={cn(
                "flex items-center gap-1.5 border px-3 py-1.5 font-mono text-lg font-bold tabular-nums",
                phase === "briefing"
                  ? "border-border text-muted"
                  : timer.isRunningLow
                    ? "border-error text-error"
                    : "border-border",
                timeLeftCritical && phase !== "briefing" && "animate-pulse",
              )}
              aria-label={tStage("timeLeft")}
              role="timer"
            >
              <Clock className="size-4" />
              {timer.label}
            </div>
            {phase === "running" && !isListening && (
              <Button
                size="md"
                variant="outline"
                onClick={() => setPhase("review")}
              >
                {tStage("endStage")}
              </Button>
            )}
          </div>
        </div>
        <div className="h-1 w-full bg-surface-muted" aria-hidden>
          <div
            className={cn(
              "h-full transition-[width] duration-1000 ease-linear",
              timer.isRunningLow ? "bg-error" : "bg-ink-violet",
            )}
            style={{ width: `${timeShare * 100}%` }}
          />
        </div>
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          phase === "running"
            ? "overflow-hidden"
            : "overflow-y-auto px-4 py-6 sm:px-8",
        )}
      >
        {phase === "briefing" && (
          <StageBriefing
            stage={stage}
            stageNumber={stageIndex + 1}
            stageTotal={stages.length}
            onStart={() => {
              enteredAtRef.current = Date.now();
              setPhase("running");
            }}
          />
        )}

        {phase === "review" && (
          <StageReview
            stage={stage}
            isLastStage={isLastStage}
            currentIndex={currentIndex}
            summary={summary}
            answeredIndexes={answeredIndexes}
            flaggedIndexes={flaggedIndexes}
            onJump={goTo}
            locked={isListening}
            onBack={() => setPhase("running")}
            onFinish={finishStage}
            isSubmitting={isSubmitting}
          />
        )}

        {phase === "running" && isListening && currentClip && (
          <>
            <div className="border-b border-border px-4 py-2.5 sm:px-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-base font-bold tabular-nums sm:text-lg">
                  {tListening("clipOf", {
                    current: clipIndex + 1,
                    total: clips.length,
                  })}
                </span>
                <span className="border border-border px-2.5 py-0.5 text-sm font-semibold text-muted">
                  {tListening("playsOnce")}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-surface-muted" aria-hidden>
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{ width: `${(clipIndex / clips.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <ListeningClip
                key={currentClip.start}
                questions={questions.slice(
                  currentClip.start,
                  currentClip.start + currentClip.count,
                )}
                answers={answers}
                onSelect={(questionId, optionId) =>
                  setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
                }
                onEnded={() => setClipEnded(true)}
              />
            </div>
          </>
        )}

        {phase === "running" && !isListening && (
          <>
            <div className="border-b border-border px-4 py-2.5 sm:px-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="text-base font-bold tabular-nums sm:text-lg">
                  {tStage("questionOf", {
                    current: positionInStage,
                    total: stage.count,
                  })}
                </span>
                {stage.sections.length > 1 && (
                  <span className="border border-border px-2.5 py-0.5 text-sm font-semibold text-muted">
                    {tTrack(currentQuestion.section)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={toggleFlag}
                  aria-pressed={flagged.has(currentQuestion.id)}
                  className={cn(
                    "flex items-center gap-1.5 border px-3 py-1 text-sm font-semibold transition-colors",
                    flagged.has(currentQuestion.id)
                      ? "border-warning bg-warning/10 text-warning-600 dark:text-warning-400"
                      : "border-border text-muted hover:border-primary-500 hover:text-foreground",
                  )}
                >
                  <Flag
                    className={cn(
                      "size-4",
                      flagged.has(currentQuestion.id) && "fill-warning",
                    )}
                  />
                  {flagged.has(currentQuestion.id)
                    ? t("unflagForReview")
                    : t("flagForReview")}
                </button>
                <span className="ms-auto hidden text-xs text-muted xl:inline">
                  {tStage("shortcuts")}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full bg-surface-muted" aria-hidden>
                <div
                  className="h-full bg-primary-500 transition-all"
                  style={{
                    width: `${(summary.answered / stage.count) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="min-h-0 flex-1">
              <QuestionView
                key={currentQuestion.id}
                question={currentQuestion}
                passage={
                  currentQuestion.passageId
                    ? passages[currentQuestion.passageId]
                    : undefined
                }
                selectedOptionId={answers[currentQuestion.id]}
                onSelect={(optionId) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [currentQuestion.id]: optionId,
                  }))
                }
              />
            </div>
          </>
        )}
      </div>

      {phase === "running" && isListening && currentClip && (
        <footer className="border-t border-border bg-surface/60 px-4 py-3 sm:px-8">
          <div className="flex w-full items-center justify-between gap-3">
            <p className="text-sm text-muted sm:text-base">
              {clipEnded ? tListening("noReturn") : tListening("waitEnd")}
            </p>
            <Button
              size="lg"
              disabled={!clipEnded}
              onClick={() =>
                clipIndex === clips.length - 1
                  ? setPhase("review")
                  : goTo(clips[clipIndex + 1]!.start)
              }
            >
              {clipIndex === clips.length - 1
                ? tStage("reviewStage")
                : tListening("nextClip")}
              <ChevronLeft className="size-5 rtl:rotate-180" />
            </Button>
          </div>
        </footer>
      )}

      {phase === "running" && !isListening && (
        <footer className="border-t border-border bg-surface/60 px-4 py-3 sm:px-8">
          {showList && (
            <div className="mb-3 max-h-48 w-full overflow-y-auto border border-border bg-surface/60 p-2">
              <StageNavigator
                start={stage.start}
                count={stage.count}
                currentIndex={currentIndex}
                answeredIndexes={answeredIndexes}
                flaggedIndexes={flaggedIndexes}
                onJump={(index) => {
                  goTo(index);
                  setShowList(false);
                }}
              />
            </div>
          )}
          <div className="flex w-full items-center justify-between gap-3">
            <Button
              variant="outline"
              size="lg"
              disabled={currentIndex === stage.start}
              onClick={() => goTo(currentIndex - 1)}
            >
              <ChevronRight className="size-5 rtl:rotate-180" />
              {t("previous")}
            </Button>

            <Button
              size="lg"
              variant="ghost"
              onClick={() => setShowList((v) => !v)}
              aria-expanded={showList}
              className="text-muted"
            >
              <LayoutGrid className="size-5" />
              <span className="hidden sm:inline">
                {showList ? tStage("hideList") : tStage("showList")}
              </span>
              <span className="tabular-nums">
                ({summary.answered}/{stage.count})
              </span>
            </Button>

            {isLastInStage ? (
              <Button size="lg" onClick={() => setPhase("review")}>
                {tStage("reviewStage")}
                <ChevronLeft className="size-5 rtl:rotate-180" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => goTo(currentIndex + 1)}>
                {t("next")}
                <ChevronLeft className="size-5 rtl:rotate-180" />
              </Button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
