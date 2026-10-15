"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionView } from "@/components/exam/question-view";
import { cn } from "@/lib/utils/cn";
import type { Question, ReadingPassage } from "@/types/question";

export interface PracticeResult {
  total: number;
  /** Questions answered correctly on the first try. */
  firstTryCorrect: number;
}

interface PracticeRunnerProps {
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  /** Wrong answers are asked once more at the end (does not change the first-try result). */
  retryMistakes?: boolean;
  onFinish: (result: PracticeResult) => void;
}

const UNKNOWN = "__unknown__";

/** One question per screen: pick, check, see the explanation, continue. */
export function PracticeRunner({
  questions,
  passages,
  retryMistakes = false,
  onFinish,
}: PracticeRunnerProps) {
  const t = useTranslations("courses");
  const [queue, setQueue] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [firstTry, setFirstTry] = useState<Record<string, boolean>>({});

  const question = queue[index];
  if (!question) return null;

  const isCorrect = selected === question.correctOptionId;
  const isRetry = question.id in firstTry;
  const progress = Math.round((index / queue.length) * 100);

  const check = (answer: string) => {
    setSelected(answer);
    setChecked(true);
    const correct = answer === question.correctOptionId;
    if (!isRetry) {
      setFirstTry((prev) => ({ ...prev, [question.id]: correct }));
      if (!correct && retryMistakes) setQueue((prev) => [...prev, question]);
    }
  };

  const next = () => {
    if (index + 1 < queue.length) {
      setIndex(index + 1);
      setSelected(null);
      setChecked(false);
      return;
    }
    onFinish({
      total: questions.length,
      firstTryCorrect: Object.values(firstTry).filter(Boolean).length,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {t("questionOf", { current: index + 1, total: queue.length })}
          </span>
          {isRetry && (
            <span className="font-medium text-amber-700 dark:text-amber-300">
              {t("retryLabel")}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden bg-surface-muted">
          <div
            className="h-full bg-ink-violet transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <QuestionView
        key={`${question.id}-${index}`}
        question={question}
        passage={question.passageId ? passages[question.passageId] : undefined}
        selectedOptionId={
          selected && selected !== UNKNOWN ? selected : undefined
        }
        onSelect={(optionId) => !checked && setSelected(optionId)}
      />

      {checked && (
        <Card
          className={cn(
            isCorrect
              ? "border-success/30 bg-success/5"
              : "border-error/30 bg-error/5",
          )}
        >
          <div className="flex items-start gap-2 text-sm">
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-error" />
            )}
            <div className="space-y-1">
              <p className="font-semibold">
                {isCorrect ? t("correctAnswer") : t("wrongAnswer")}
              </p>
              <p dir="ltr" className="font-medium">
                {question.explanation}
              </p>
              {!isCorrect && retryMistakes && !isRetry && (
                <p className="text-xs text-muted">{t("willReturn")}</p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        {!checked ? (
          <>
            <Button variant="outline" onClick={() => check(UNKNOWN)}>
              {t("dontKnow")}
            </Button>
            <Button
              disabled={!selected}
              onClick={() => selected && check(selected)}
            >
              {t("checkAnswer")}
            </Button>
          </>
        ) : (
          <>
            <span />
            <Button onClick={next}>
              {index + 1 < queue.length
                ? t("nextQuestion")
                : t("finishPractice")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
