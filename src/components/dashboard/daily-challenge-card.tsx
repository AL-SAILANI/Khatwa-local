"use client";

import { useEffect, useState } from "react";
import { Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, BookOpen, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { completeDailyChallenge, getTodayDateString } from "@/lib/firestore/daily-challenge";
import { getQuestionsBySection } from "@/lib/firestore/questions";
import { getRecentAttempts } from "@/lib/firestore/exam-attempts";
import { rankWeakTracks } from "@/lib/study-coach";
import { suggestLessonsForQuestion } from "@/lib/tag-lesson-map";
import { cn } from "@/lib/utils/cn";
import type { Question } from "@/types/question";

const TRACK_TO_SECTION = {
  reading: "reading",
  grammar: "grammar",
  listening: "listening",
  writingAnalysis: "writingAnalysis",
} as const;

const FALLBACK_SECTION = "grammar";

/**
 * Adaptive daily challenge: instead of a fixed translated quiz, it serves one
 * real question pulled from the student's *weakest* STEP section (from their
 * recent exam history), falling back to grammar for brand-new users. Answering
 * correctly grants the usual +30 XP / +10 coins reward.
 */
export function DailyChallengeCard() {
  const t = useTranslations("dashboard.dailyChallenge");
  const tTracks = useTranslations("trackNames");
  const { user, profile } = useUserProfile();
  const { lessonTitle } = useLocalizedContent();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const today = getTodayDateString();
  const alreadyDone = profile?.lastDailyChallengeDate === today || completed;
  const answered = selected !== null;
  const answeredCorrectly = answered && selected === question?.correctOptionId;
  const lessons = question ? suggestLessonsForQuestion(question) : [];

  useEffect(() => {
    if (!user) return;
    const uid = user.uid;
    let cancelled = false;

    async function load() {
      try {
        const attempts = await getRecentAttempts(uid, 5);
        const weakest = rankWeakTracks(attempts)[0];
        const preferredSection =
          weakest && weakest.track in TRACK_TO_SECTION
            ? TRACK_TO_SECTION[weakest.track as keyof typeof TRACK_TO_SECTION]
            : FALLBACK_SECTION;

        let picked: Question | undefined = (await getQuestionsBySection(preferredSection, 8)).find(
          (q) => !q.passageId,
        );
        if (!picked) {
          picked = (await getQuestionsBySection(FALLBACK_SECTION, 8)).find((q) => !q.passageId);
        }
        if (!cancelled) setQuestion(picked ?? null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleClaim = async () => {
    if (!user || alreadyDone || !answeredCorrectly || claiming) return;
    setClaiming(true);
    try {
      await completeDailyChallenge(user.uid, 30);
      setCompleted(true);
      setIsOpen(false);
    } finally {
      setClaiming(false);
    }
  };

  const resetAnswer = () => {
    setSelected(null);
  };

  return (
    <Card className="relative overflow-hidden border-primary-200/80 bg-surface p-5 dark:border-primary-500/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet">
            <Trophy className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-foreground">{t("title")}</h2>
              <span className="rounded-none bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-ink-violet dark:bg-primary-500/20 dark:text-primary-300">
                +30 XP
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted">{t("subtitle")}</p>
          </div>
        </div>

        {alreadyDone ? (
          <span className="inline-flex items-center gap-1.5 rounded-none bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <CheckCircle2 className="size-4" />
            {t("completed")}
          </span>
        ) : (
          <Button
            size="sm"
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-controls="daily-challenge-panel"
            className="gap-1.5"
          >
            {t("start")}
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Button>
        )}
      </div>

      {isOpen && !alreadyDone && (
        <div
          id="daily-challenge-panel"
          className="mt-4 rounded-2xl border border-border bg-surface p-4 animate-in fade-in zoom-in-95 duration-200"
        >
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            </div>
          ) : question ? (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-ink-violet dark:text-primary-300" />
                <span className="text-sm font-semibold">
                  {t("fromSection", { section: tTracks(question.section) })}
                </span>
              </div>

              {question.audioUrl && (
                <audio controls preload="none" className="mt-3 w-full" src={question.audioUrl} />
              )}
              {question.transcript && !question.audioUrl && (
                <p className="mt-3 rounded-xl bg-surface-muted p-3 text-sm leading-relaxed" dir="ltr">
                  {question.transcript}
                </p>
              )}

              <p className="mt-3 text-sm font-medium leading-relaxed text-foreground/90" dir="ltr">
                {question.prompt}
              </p>

              <div className="mt-3 grid gap-2">
                {question.options.map((option) => {
                  const isChosen = selected === option.id;
                  const revealCorrect = answered && option.id === question.correctOptionId;
                  const revealWrong = answered && isChosen && !answeredCorrectly;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelected(option.id)}
                      aria-pressed={isChosen}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5 text-start text-xs font-medium transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
                        revealCorrect && "border-success bg-success/10 text-success font-semibold",
                        revealWrong && "border-error bg-error/10 text-error",
                      )}
                    >
                      <span dir="ltr">{option.text}</span>
                      {revealCorrect && <CheckCircle2 className="size-4 shrink-0 text-success" />}
                      {revealWrong && <XCircle className="size-4 shrink-0 text-error" />}
                    </button>
                  );
                })}
              </div>
              <p role="status" aria-live="polite" className="sr-only">
                {answered
                  ? answeredCorrectly
                    ? t("correctAnswer")
                    : t("incorrectAnswer")
                  : ""}
              </p>

              {answered && (
                <div className="mt-4 space-y-3 border-t border-border pt-3">
                  {question.explanation && (
                    <p className="rounded-xl bg-primary-50 p-3 text-sm leading-relaxed dark:bg-primary-500/10">
                      {question.explanation}
                    </p>
                  )}

                  {answeredCorrectly ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
                        <CheckCircle2 className="size-4" />
                        {t("correctAnswer")}
                      </span>
                      <Button size="sm" onClick={handleClaim} disabled={claiming} className="gap-1.5">
                        <Trophy className="size-4" />
                        {t("claimReward")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-error">
                        <XCircle className="size-4" />
                        {t("incorrectAnswer")}
                      </span>
                      <Button size="sm" variant="outline" disabled={claiming} onClick={resetAnswer} className="gap-1.5">
                        <RotateCcw className="size-3.5" />
                        {t("tryAgain")}
                      </Button>
                    </div>
                  )}

                  {lessons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {lessons.map((lesson) => (
                        <Link
                          key={lesson.id}
                          href={`/courses/${lesson.courseId}/${lesson.id}`}
                          className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-3 py-1 text-xs font-medium text-ink-violet transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20"
                        >
                          <BookOpen className="size-3.5" />
                          {t("studyConceptLink")}: {lessonTitle(lesson)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted">{t("noQuestion")}</p>
          )}
        </div>
      )}
    </Card>
  );
}
