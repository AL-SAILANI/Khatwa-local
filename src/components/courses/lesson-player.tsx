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
import { cn } from "@/lib/utils/cn";
import {
  buildLessonBlocks,
  MASTERY_THRESHOLD,
  scorePercent,
  type LessonBlock,
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
  onMastered,
  onSkip,
}: {
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  onMastered: (score: number) => void;
  onSkip: (score: number) => void;
}) {
  const t = useTranslations("courses");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const score = scorePercent(questions, answers);
  const mastered = score >= MASTERY_THRESHOLD;

  const check = () => {
    setChecked(true);
    if (score >= MASTERY_THRESHOLD) onMastered(score);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted">
        {t("exitIntro", { threshold: MASTERY_THRESHOLD })}
      </p>
      {questions.map((question) => (
        <div key={question.id}>
          <QuestionView
            question={question}
            passage={
              question.passageId ? passages[question.passageId] : undefined
            }
            selectedOptionId={answers[question.id]}
            onSelect={(optionId) =>
              !checked &&
              setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
            }
          />
          {checked && (
            <Feedback question={question} selected={answers[question.id]} />
          )}
        </div>
      ))}

      {!checked ? (
        <Button
          size="lg"
          className="w-full"
          disabled={Object.keys(answers).length < questions.length}
          onClick={check}
        >
          {t("checkAnswers")}
        </Button>
      ) : (
        <Card className="space-y-3 text-center">
          <span className="text-lg font-bold text-ink-violet dark:text-primary-400">
            {score}%
          </span>
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
                  setAnswers({});
                  setChecked(false);
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
      )}
    </div>
  );
}

function BlockBody({
  block,
  passages,
  onExitMastered,
  onExitSkip,
}: {
  block: LessonBlock;
  passages: Record<string, ReadingPassage>;
  onExitMastered: (score: number) => void;
  onExitSkip: (score: number) => void;
}) {
  const t = useTranslations("courses");
  const [guided, setGuided] = useState<Record<string, string>>({});

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
        <div className="space-y-6">
          <p className="text-sm text-muted">{t("guidedIntro")}</p>
          {block.questions.map((question) => (
            <div key={question.id}>
              <QuestionView
                question={question}
                passage={
                  question.passageId ? passages[question.passageId] : undefined
                }
                selectedOptionId={guided[question.id]}
                onSelect={(optionId) =>
                  setGuided((prev) =>
                    prev[question.id]
                      ? prev
                      : { ...prev, [question.id]: optionId },
                  )
                }
              />
              {guided[question.id] && (
                <Feedback question={question} selected={guided[question.id]} />
              )}
            </div>
          ))}
        </div>
      );
    case "exit":
      return (
        <ExitCard
          questions={block.questions}
          passages={passages}
          onMastered={onExitMastered}
          onSkip={onExitSkip}
        />
      );
  }
}

/** Step-by-step lesson: explain, example, guided practice, strategy, exit card, review. */
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
  const [step, setStep] = useState(0);
  const [exitPassed, setExitPassed] = useState(false);

  if (blocks.length === 0) {
    return isDone ? null : (
      <Button size="lg" className="w-full" onClick={() => onComplete(null)}>
        {t("finishLesson")}
      </Button>
    );
  }
  const block = blocks[Math.min(step, blocks.length - 1)]!;
  const isLast = step >= blocks.length - 1;
  const hasExit = blocks.some((b) => b.kind === "exit");
  const exitGate = block.kind === "exit" && !exitPassed && !isDone;

  return (
    <div className="space-y-4">
      <nav
        aria-label={t("lessonSteps")}
        className="flex flex-wrap items-center gap-1.5"
      >
        {blocks.map((b, i) => (
          <button
            key={`${b.kind}-${i}`}
            type="button"
            onClick={() => setStep(i)}
            aria-current={i === step ? "step" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              i === step
                ? "border-ink-violet bg-ink-violet text-white"
                : i < step
                  ? "border-success/40 bg-success/10"
                  : "border-border text-muted",
            )}
          >
            {t(`block.${b.kind}`)}
          </button>
        ))}
      </nav>
      <p className="text-xs text-muted">
        {t("stepOf", { current: step + 1, total: blocks.length })}
      </p>

      <BlockBody
        key={step}
        block={block}
        passages={passages}
        onExitMastered={(score) => {
          setExitPassed(true);
          onComplete(score);
        }}
        onExitSkip={(score) => {
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
