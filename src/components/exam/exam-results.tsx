"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Award, ArrowLeft, Clock, Target, BookMarked, Share2, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { AnswerReview } from "@/components/exam/answer-review";
import { ScoreTrend } from "@/components/exam/score-trend";
import { getExamAttempt } from "@/lib/firestore/exam-attempts";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { suggestLessonForTag } from "@/lib/tag-lesson-map";
import { cn } from "@/lib/utils/cn";
import type { ExamAttempt } from "@/types/exam";

const buttonStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-semibold transition-all duration-200 focus-visible:outline-none";

export function ExamResults({ attemptId }: { attemptId: string }) {
  const t = useTranslations("exam.results");
  const tTracks = useTranslations("trackNames");
  const { user } = useUserProfile();
  const { lessonTitle } = useLocalizedContent();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (!attempt) return;
    const text = t("shareText", { score: attempt.score ?? 0 });
    if (navigator.share) {
      try {
        await navigator.share({ title: t("shareTitle"), text, url: window.location.href });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    getExamAttempt(attemptId).then(setAttempt);
  }, [attemptId]);

  if (!attempt) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const totalCorrect = attempt.sectionResults.reduce((sum, r) => sum + r.correct, 0);
  const totalQuestions = attempt.sectionResults.reduce((sum, r) => sum + r.total, 0);
  const totalSeconds = attempt.sectionResults.reduce((sum, r) => sum + r.timeSpentSeconds, 0);
  const errorRate = totalQuestions > 0 ? Math.round(((totalQuestions - totalCorrect) / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet">
          <Award className="size-6" />
        </div>
        <span className="text-sm text-muted">{t("estimatedScore")}</span>
        <span className="text-5xl font-bold text-ink-violet dark:text-primary-400">{attempt.score}</span>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex items-center gap-3">
          <Clock className="size-5 text-ink-violet dark:text-primary-300" />
          <div>
            <div className="font-bold">{t("timeSpentMinutes", { minutes: Math.round(totalSeconds / 60) })}</div>
            <div className="text-xs text-muted">{t("timeSpent")}</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Target className="size-5 text-ink-violet dark:text-primary-300" />
          <div>
            <div className="font-bold">{errorRate}%</div>
            <div className="text-xs text-muted">{t("errorRate")}</div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">{t("sectionBreakdown")}</h2>
        <div className="mt-4 space-y-4">
          {attempt.sectionResults.map((result) => {
            const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
            const secondsPerQuestion =
              result.total > 0 ? Math.round(result.timeSpentSeconds / result.total) : 0;
            return (
              <div key={result.section}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{tTracks(result.section)}</span>
                  <span className="text-muted">
                    {result.correct} / {result.total} ({percent}%)
                    {secondsPerQuestion > 0 && (
                      <span className="ms-2 text-xs">
                        {t("secondsPerQuestion", { seconds: secondsPerQuestion })}
                      </span>
                    )}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-none bg-surface-muted">
                  <div
                    className="h-full rounded-none bg-ink-violet"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {attempt.weakSkills.length > 0 && (
        <Card>
          <h2 className="font-semibold">{t("weakSkills")}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {attempt.weakSkills.map((skill) => {
              const lesson = suggestLessonForTag(skill);
              if (!lesson) {
                return (
                  <span
                    key={skill}
                    className="rounded-none bg-surface-muted px-3.5 py-1.5 text-sm font-medium text-foreground/80"
                  >
                    {skill}
                  </span>
                );
              }
              return (
                <Link
                  key={`${skill}-${lesson.id}`}
                  href={`/courses/${lesson.courseId}/${lesson.id}`}
                  className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-3.5 py-1.5 text-sm font-medium text-ink-violet transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
                >
                  <BookOpen className="size-4" />
                  {skill} — {lessonTitle(lesson)}
                </Link>
              );
            })}
          </div>
        </Card>
      )}

      <Card>
        <h2 className="font-semibold">{t("recommendations")}</h2>
        <ul className="mt-4 space-y-3">
          {attempt.recommendations.map((rec, index) => (
            <li key={index} className="flex gap-2 text-sm text-foreground/90">
              <span className="text-ink-violet dark:text-primary-300">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </Card>

      <AnswerReview answers={attempt.answers} />

      {user && <ScoreTrend uid={user.uid} kind={attempt.kind} currentScore={attempt.score ?? 0} />}

      <Card>
        <div className="flex items-center gap-2 font-semibold">
          <BookMarked className="size-4 text-ink-violet dark:text-primary-300" />
          {t("newWords")}
        </div>
        {attempt.newWords.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {attempt.newWords.map((word) => (
              <span key={word} className="rounded-none bg-primary-50 px-3 py-1 text-sm text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
                {word}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">{t("newWordsPlaceholder")}</p>
        )}
      </Card>

      {attempt.kind === "placement" ? (
        <Link
          href="/study-plan/new"
          className={cn(
            buttonStyles,
            "w-full h-13 px-8 text-base",
            "border border-secondary-600 bg-butter-yellow text-ink-violet shadow-hard hover:bg-primary-500",
          )}
        >
          {t("createStudyPlan")}
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <Link
          href="/mock-exams"
          className={cn(
            buttonStyles,
            "w-full h-13 px-8 text-base",
            "border-2 border-border bg-transparent text-foreground hover:border-primary-500 hover:text-ink-violet hover:bg-primary-50 dark:hover:bg-primary-500/10",
          )}
        >
          {t("backToMockExams")}
          <ArrowLeft className="size-4 rtl:rotate-180" />
        </Link>
      )}

      <button
        type="button"
        onClick={handleShare}
        className={cn(
          buttonStyles,
          "w-full h-11 px-6 text-sm",
          "bg-surface-muted text-foreground/80 hover:bg-surface-muted/80 hover:text-foreground",
        )}
      >
        <Share2 className="size-4" />
        {copied ? t("copiedScore") : t("shareScore")}
      </button>
    </div>
  );
}
