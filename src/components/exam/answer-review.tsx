"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { getQuestionsByIds } from "@/lib/firestore/questions";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { suggestLessonsForQuestion } from "@/lib/tag-lesson-map";
import type { ExamSectionKey, Question } from "@/types/question";

const SECTION_ORDER: ExamSectionKey[] = ["reading", "grammar", "listening", "writingAnalysis"];

interface AnswerReviewProps {
  answers: Record<string, string>;
}

export function AnswerReview({ answers }: AnswerReviewProps) {
  const t = useTranslations("exam.results");
  const tTracks = useTranslations("trackNames");
  const { lessonTitle } = useLocalizedContent();
  const hasAnswers = Object.keys(answers).length > 0;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(hasAnswers);

  useEffect(() => {
    if (!hasAnswers) return;

    let cancelled = false;

    getQuestionsByIds(Object.keys(answers)).then((loaded) => {
      if (!cancelled) {
        setQuestions(loaded);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [answers, hasAnswers]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="size-7 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const groups = SECTION_ORDER.map((section) => ({
    section,
    items: questions.filter((q) => q.section === section),
  })).filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return (
      <Card>
        <h2 className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="size-4 text-ink-violet dark:text-primary-300" />
          {t("reviewTitle")}
        </h2>
        <p className="mt-3 text-sm text-muted">{t("noAnsweredQuestions")}</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 font-semibold">
          <CheckCircle2 className="size-4 text-ink-violet dark:text-primary-300" />
          {t("reviewTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("reviewIntro")}</p>
      </div>

      {groups.map((group) => (
        <div key={group.section}>
          <h3 className="text-sm font-semibold text-muted">{tTracks(group.section)}</h3>
          <div className="mt-3 space-y-4">
            {group.items.map((question) => {
              const userAnswerId = answers[question.id];
              const userOption = question.options.find((o) => o.id === userAnswerId);
              const correctOption = question.options.find((o) => o.id === question.correctOptionId);
              const isCorrect = userAnswerId === question.correctOptionId;
              const lessons = isCorrect ? [] : suggestLessonsForQuestion(question);

              return (
                <div key={question.id} className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed" dir="ltr">
                      {question.prompt}
                    </p>
                    {isCorrect ? (
                      <Badge variant="success" size="sm" className="shrink-0">
                        <CheckCircle2 className="size-3" />
                        {t("correct")}
                      </Badge>
                    ) : (
                      <Badge variant="error" size="sm" className="shrink-0">
                        <XCircle className="size-3" />
                        {t("incorrect")}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div
                      className={cn(
                        "rounded-xl border p-3",
                        isCorrect ? "border-success/30 bg-success/5" : "border-error/30 bg-error/5",
                      )}
                    >
                      <span className="text-xs text-muted">{t("yourAnswer")}</span>
                      <p className={cn("mt-1 text-sm font-medium", isCorrect ? "text-success" : "text-error")}>
                        {userOption ? userOption.text : t("notAnswered")}
                      </p>
                    </div>
                    {!isCorrect && (
                      <div className="rounded-xl border border-success/30 bg-success/5 p-3">
                        <span className="text-xs text-muted">{t("correctAnswer")}</span>
                        <p className="mt-1 text-sm font-medium text-success">{correctOption?.text}</p>
                      </div>
                    )}
                  </div>

                  {!isCorrect && question.explanation && (
                    <p className="mt-3 rounded-xl bg-primary-50 p-3 text-sm leading-relaxed dark:bg-primary-500/10">
                      <span className="mb-1 block text-xs font-medium text-ink-violet dark:text-primary-300">
                        {t("explanation")}
                      </span>
                      {question.explanation}
                    </p>
                  )}

                  {!isCorrect && lessons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${lesson.courseId}/${lesson.id}`}
                          className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-3.5 py-1.5 text-sm font-medium text-ink-violet transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
                        >
                          <BookOpen className="size-4" />
                          {t("studyConcept")}: {lessonTitle(lesson)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  );
}
