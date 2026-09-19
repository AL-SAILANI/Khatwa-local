import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { Question, ReadingPassage } from "@/types/question";

interface ReviewScreenProps {
  questions: Question[];
  answers: Record<string, string>;
  flagged: Set<string>;
  passages: Record<string, ReadingPassage>;
  onJump: (index: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export function ReviewScreen({
  questions,
  answers,
  flagged,
  passages,
  onJump,
  onSubmit,
  onBack,
  isSubmitting,
}: ReviewScreenProps) {
  const t = useTranslations("exam.review");
  const tTracks = useTranslations("trackNames");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const unansweredCount = questions.filter((q) => !answers[q.id]).length;

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t("title")}</h2>
        <Badge variant="outline" size="sm" className="gap-1">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="size-3 text-success" />
            {questions.filter((q) => answers[q.id]).length}
          </span>
          <span className="flex items-center gap-1">
            <Circle className="size-3 text-muted" />
            {questions.filter((q) => !answers[q.id]).length}
          </span>
          <span className="flex items-center gap-1">
            <Flag className="size-3 text-warning" />
            {flagged.size}
          </span>
        </Badge>
      </div>

      <p className="mt-1 text-sm text-muted">
        {unansweredCount > 0 ? t("unanswered", { count: unansweredCount }) : t("allAnswered")}
      </p>

      <Card className="mt-6 max-h-[65vh] divide-y divide-border overflow-y-auto p-0">
        {questions.map((question, index) => {
          const isAnswered = Boolean(answers[question.id]);
          const isFlagged = flagged.has(question.id);
          const isExpanded = expandedIndex === index;
          const userAnswer = answers[question.id];
          const passage = question.passageId ? passages[question.passageId] : undefined;

          return (
            <div key={question.id}>
              <div
                className={cn(
                  "flex w-full items-center justify-between gap-4 p-4",
                  isAnswered ? "bg-success/5" : "bg-error/5",
                )}
              >
                <button
                  type="button"
                  onClick={() => onJump(index)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start hover:bg-surface-muted"
                >
                  {isAnswered ? (
                    <CheckCircle2 className="size-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted" />
                  )}
                  <span className="truncate text-sm font-medium">
                    {t("questionLabel", { index: index + 1, section: tTracks(question.section) })}
                  </span>
                  <Badge variant="secondary" size="sm" className="shrink-0">
                    {question.difficulty}
                  </Badge>
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  {isFlagged && <Flag className="size-4 shrink-0 fill-warning text-warning" />}
                  <button
                    type="button"
                    onClick={() => toggleExpand(index)}
                    className="rounded-lg p-1 text-muted transition-colors hover:text-foreground"
                    aria-label={isExpanded ? t("collapse") : t("expand")}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border p-4 bg-surface-muted">
                  <div className="space-y-4">
                    {/* Question prompt */}
                    <div>
                      <h4 className="text-sm font-medium text-muted mb-2">{t("questionPrompt")}</h4>
                      <p className="text-base" dir="ltr">{question.prompt}</p>
                    </div>

                    {/* Passage if exists */}
                    {passage && (
                      <div className="rounded-xl bg-surface p-4 border border-border">
                        <h4 className="text-sm font-medium text-muted mb-2">{t("readingPassage")}</h4>
                        <div className="prose prose-sm max-w-none text-sm" dir="ltr">
                          <p>{passage.body}</p>
                        </div>
                      </div>
                    )}

                    {/* User's answer — shown without revealing correctness */}
                    <div className="rounded-xl p-4 border border-border bg-surface">
                      <h4 className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                        <Circle className="size-3 text-muted" />
                        {t("yourAnswer")}
                      </h4>
                      <p className="font-medium text-foreground">
                        {userAnswer ? t("optionLabel", { option: userAnswer.toUpperCase() }) : t("notAnswered")}
                      </p>
                    </div>

                    {/* Tags */}
                    {question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs text-muted">{t("tags")}:</span>
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="outline" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <div className={cn("mt-6 flex gap-3")}>
        <Button variant="outline" onClick={onBack} className="flex-1">
          {t("backToExam")}
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? t("submitting") : t("submitExam")}
        </Button>
      </div>
    </div>
  );
}