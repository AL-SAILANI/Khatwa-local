"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuestionView } from "@/components/exam/question-view";
import type { Question, ReadingPassage } from "@/types/question";

interface LessonQuizProps {
  questions: Question[];
  passages: Record<string, ReadingPassage>;
  onComplete: (scorePercent: number) => void;
}

export function LessonQuiz({ questions, passages, onComplete }: LessonQuizProps) {
  const t = useTranslations("courses");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const scorePercent = useMemo(() => {
    if (questions.length === 0) return 0;
    const correct = questions.filter((q) => answers[q.id] === q.correctOptionId).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const handleCheck = () => {
    setChecked(true);
    onComplete(scorePercent);
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id}>
          <QuestionView
            question={question}
            passage={question.passageId ? passages[question.passageId] : undefined}
            selectedOptionId={answers[question.id]}
            onSelect={(optionId) =>
              !checked && setAnswers((prev) => ({ ...prev, [question.id]: optionId }))
            }
          />
          {checked && (
            <Card
              className={
                answers[question.id] === question.correctOptionId
                  ? "mt-3 border-success/30 bg-success/5"
                  : "mt-3 border-error/30 bg-error/5"
              }
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                {answers[question.id] === question.correctOptionId ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <XCircle className="size-4 text-error" />
                )}
                {question.explanation}
              </div>
            </Card>
          )}
        </div>
      ))}

      {!checked ? (
        <Button
          size="lg"
          className="w-full"
          disabled={Object.keys(answers).length < questions.length}
          onClick={handleCheck}
        >
          {t("checkAnswers")}
        </Button>
      ) : (
        <Card className="text-center">
          <span className="text-lg font-bold text-ink-violet dark:text-primary-400">{scorePercent}%</span>
          <p className="mt-1 text-sm text-muted">{t("quizScoreNote")}</p>
        </Card>
      )}
    </div>
  );
}
