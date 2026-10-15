"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionView } from "@/components/exam/question-view";
import { LessonNotes } from "@/components/courses/lesson-notes";
import { LessonResources } from "@/components/courses/lesson-resources";
import {
  PracticeRunner,
  type PracticeResult,
} from "@/components/courses/practice-runner";
import { StageArt, Confetti } from "@/components/courses/lesson-art";
import { LessonStepper } from "@/components/courses/lesson-stepper";
import { ScoreRing } from "@/components/courses/score-ring";
import { cn } from "@/lib/utils/cn";
import {
  buildLessonBlocks,
  groupLessonStages,
  MASTERY_THRESHOLD,
  type LessonBlock,
  type LessonStage,
} from "@/lib/lesson-blocks";
import type { Lesson } from "@/types/course";
import type { Question, ReadingPassage } from "@/types/question";

interface LessonPlayerProps {
  lesson: Lesson;
  notes: string;
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  isDone: boolean;
  onComplete: (scorePercent: number | null) => void;
}

function Feedback({
  question,
  selected,
}: {
  question: Question;
  selected?: string;
}) {
  const correct = selected === question.correctOptionId;
  return (
    <Card
      className={cn(
        "mt-3",
        correct
          ? "border-success/30 bg-success/5"
          : "border-error/30 bg-error/5",
      )}
    >
      <div className="flex items-start gap-2 text-sm font-medium">
        {correct ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0 text-error" />
        )}
        <span dir="ltr">{question.explanation}</span>
      </div>
    </Card>
  );
}

function ExitCard({
  questions,
  passages,
  onResult,
  onSkip,
}: {
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  onResult: (score: number, mastered: boolean) => void;
  onSkip: (score: number) => void;
}) {
  const t = useTranslations("courses");
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const score = result
    ? Math.round((result.firstTryCorrect / result.total) * 100)
    : 0;
  const mastered = score >= MASTERY_THRESHOLD;

  if (!result) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">
          {t("exitIntro", { threshold: MASTERY_THRESHOLD })}
        </p>
        <PracticeRunner
          key={attempt}
          questions={questions}
          passages={passages}
          retryMistakes
          onFinish={(res) => {
            setResult(res);
            const pct = Math.round((res.firstTryCorrect / res.total) * 100);
            onResult(pct, pct >= MASTERY_THRESHOLD);
          }}
        />
      </div>
    );
  }

  return (
    <Card className="relative flex flex-col items-center space-y-3 overflow-hidden text-center">
      {mastered && <Confetti />}
      <ScoreRing score={score} mastered={mastered} />
      <p className="text-sm text-muted">
        {mastered
          ? t("masteryReached")
          : t("masteryNotYet", { threshold: MASTERY_THRESHOLD })}
      </p>
      {!mastered && (
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setAttempt((n) => n + 1);
            }}
          >
            <RotateCcw className="size-4" />
            {t("retryExit")}
          </Button>
          <Button variant="outline" onClick={() => onSkip(score)}>
            {t("completeAnyway")}
          </Button>
        </div>
      )}
    </Card>
  );
}

function SummaryCard({ score }: { score: number | null }) {
  const t = useTranslations("courses");
  if (score === null)
    return <p className="text-sm text-muted">{t("summaryPending")}</p>;
  const mastered = score >= MASTERY_THRESHOLD;
  return (
    <Card className="relative flex flex-col items-center space-y-3 overflow-hidden py-6 text-center">
      {mastered && <Confetti />}
      <p className="text-xs text-muted">{t("summaryTitle")}</p>
      <ScoreRing score={score} mastered={mastered} className="size-36" />
      <p className="text-sm font-medium">
        {mastered ? t("summaryMastered") : t("summaryNeedsWork")}
      </p>
    </Card>
  );
}

function BlockBody({
  block,
  passages,
  exitScore,
  onExitResult,
  onExitSkip,
  onGuidedFinish,
}: {
  block: LessonBlock;
  passages: Record<string, ReadingPassage>;
  exitScore: number | null;
  onExitResult: (score: number, mastered: boolean) => void;
  onExitSkip: (score: number) => void;
  onGuidedFinish?: () => void;
}) {
  const t = useTranslations("courses");
  const [guidedDone, setGuidedDone] = useState(false);

  switch (block.kind) {
    case "explain":
    case "strategy":
    case "review":
      return <LessonNotes notes={block.notes} />;
    case "video":
      return <LessonResources resources={block.resources} />;
    case "example":
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted">{t("exampleIntro")}</p>
          <QuestionView
            question={block.question}
            passage={
              block.question.passageId
                ? passages[block.question.passageId]
                : undefined
            }
            selectedOptionId={block.question.correctOptionId}
            onSelect={() => {}}
          />
          <Feedback
            question={block.question}
            selected={block.question.correctOptionId}
          />
        </div>
      );
    case "guided":
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted">{t("guidedIntro")}</p>
          {guidedDone ? (
            <Card className="text-center text-sm font-medium">
              {t("guidedDone")}
            </Card>
          ) : (
            <PracticeRunner
              questions={block.questions}
              passages={passages}
              retryMistakes
              onFinish={() => {
                setGuidedDone(true);
                onGuidedFinish?.();
              }}
            />
          )}
        </div>
      );
    case "exit":
      return (
        <ExitCard
          questions={block.questions}
          passages={passages}
          onResult={onExitResult}
          onSkip={onExitSkip}
        />
      );
    case "summary":
      return <SummaryCard score={exitScore} />;
  }
}

function StageBody({
  stage,
  passages,
  exitScore,
  onExitResult,
  onExitSkip,
}: {
  stage: LessonStage;
  passages: Record<string, ReadingPassage>;
  exitScore: number | null;
  onExitResult: (score: number, mastered: boolean) => void;
  onExitSkip: (score: number) => void;
}) {
  const hasGuided = stage.blocks.some((b) => b.kind === "guided");
  const [guidedFinished, setGuidedFinished] = useState(!hasGuided);

  return (
    <div className="space-y-5">
      {stage.blocks.map((block, i) => {
        if (block.kind === "exit" && !guidedFinished) return null;
        return (
          <BlockBody
            key={`${block.kind}-${i}`}
            block={block}
            passages={passages}
            exitScore={exitScore}
            onExitResult={onExitResult}
            onExitSkip={onExitSkip}
            onGuidedFinish={() => setGuidedFinished(true)}
          />
        );
      })}
    </div>
  );
}

/** Step-by-step lesson: explain cards, example, guided practice, technique, exit card, review, summary. */
export function LessonPlayer({
  lesson,
  notes,
  questions,
  passages,
  isDone,
  onComplete,
}: LessonPlayerProps) {
  const t = useTranslations("courses");
  const blocks = useMemo(
    () => buildLessonBlocks({ ...lesson, notes }, questions),
    [lesson, notes, questions],
  );
  const stages = useMemo(() => groupLessonStages(blocks), [blocks]);
  const [step, setStep] = useState(0);
  const [exitPassed, setExitPassed] = useState(false);
  const [exitScore, setExitScore] = useState<number | null>(null);

  if (blocks.length === 0) {
    return isDone ? null : (
      <Button size="lg" className="w-full" onClick={() => onComplete(null)}>
        {t("finishLesson")}
      </Button>
    );
  }
  const stage = stages[Math.min(step, stages.length - 1)]!;
  const isLast = step >= stages.length - 1;
  const hasExit = blocks.some((b) => b.kind === "exit");
  const exitGate =
    stage.blocks.some((b) => b.kind === "exit") && !exitPassed && !isDone;

  return (
    <div className="space-y-4">
      <LessonStepper
        stages={stages.map((x) => x.key)}
        current={step}
        labelOf={(key) => t(`stage.${key}`)}
        ariaLabel={t("lessonSteps")}
      />

      <div className="flex items-center gap-4 border border-border/20 bg-surface p-3">
        <div className="h-16 w-24 shrink-0 bg-butter-yellow p-1.5 shadow-hard">
          <StageArt stage={stage.key} className="size-full" />
        </div>
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs text-muted">
            {t("stepOf", { current: step + 1, total: stages.length })}
          </p>
          <h2 className="text-lg font-bold leading-tight">
            {t(`stage.${stage.key}`)}
          </h2>
          <p className="text-sm text-muted">{t(`stageHint.${stage.key}`)}</p>
        </div>
      </div>

      <StageBody
        key={step}
        stage={stage}
        passages={passages}
        exitScore={exitScore}
        onExitResult={(score, mastered) => {
          setExitScore(score);
          if (mastered) {
            setExitPassed(true);
            onComplete(score);
          }
        }}
        onExitSkip={(score) => {
          setExitScore(score);
          setExitPassed(true);
          onComplete(score);
        }}
      />

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ChevronRight className="size-4 rtl:rotate-180" />
          {t("stepBack")}
        </Button>
        {!isLast ? (
          <Button disabled={exitGate} onClick={() => setStep((s) => s + 1)}>
            {t("stepNext")}
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Button>
        ) : (
          !hasExit &&
          !isDone && (
            <Button onClick={() => onComplete(null)}>
              {t("finishLesson")}
            </Button>
          )
        )}
      </div>
    </div>
  );
}
