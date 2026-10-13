"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Award,
  BarChart3,
  ChevronLeft,
  Clock,
  FileText,
  History,
  ListChecks,
  Lock,
  Percent,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ModuleHeader } from "@/components/ui/module-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getAttemptsByKind } from "@/lib/firestore/exam-attempts";
import {
  MOCK_EXAMS,
  type MockExamDef,
  STEP_SECTION_ORDER,
  STEP_SECTION_QUESTION_COUNTS,
  STEP_SECTION_MINUTES,
  STEP_SECTION_WEIGHTS,
  STEP_TOTAL_MINUTES,
  STEP_TOTAL_QUESTIONS,
} from "@/lib/constants/exam";
import { cn } from "@/lib/utils/cn";
import type { ExamAttempt } from "@/types/exam";

const FREE_TIER_MOCK_EXAM_LIMIT = 1;

const buttonStyles = "inline-flex items-center justify-center gap-2 rounded-none font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const goldButtonStyles = cn(buttonStyles, "btn-glow bg-secondary-500 text-cream-paper hover:bg-secondary-400");

/** Brand performance bar — gold for high scores, navy→yellow otherwise. */
function barClass(percent: number): string {
  return percent >= 80
    ? "bg-ink-violet"
    : "bg-ink-violet";
}

/** Score badge — gold for strong attempts, navy for decent, muted otherwise. */
function scoreBadgeClass(score: number): string {
  if (score >= 80) return "bg-secondary-500 text-cream-paper";
  if (score >= 60) return "bg-butter-yellow text-ink-violet";
  return "bg-surface-muted text-foreground";
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: number | null }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-lg font-bold tabular-nums leading-tight">{value ?? "—"}</div>
        <div className="truncate text-xs text-muted">{label}</div>
      </div>
    </Card>
  );
}

export function MockExamList({
  onStart,
  isLoading,
}: {
  onStart: (exam: MockExamDef) => void;
  isLoading: boolean;
}) {
  const t = useTranslations("mockExams");
  const tSections = useTranslations("trackNames");
  const locale = useLocale();
  const { user, profile } = useUserProfile();
  const [attempts, setAttempts] = useState<ExamAttempt[] | null>(null);
  const [chosenId, setChosenId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getAttemptsByKind(user.uid, "mock", 10).then(setAttempts);
  }, [user]);

  const submitted = (attempts ?? []).filter((a) => a.status === "submitted");
  const submittedCount = submitted.length;
  const takenExamIds = new Set(submitted.map((a) => a.examId));
  // Default to the first exam the learner has not taken yet.
  const defaultExam = MOCK_EXAMS.find((exam) => !takenExamIds.has(exam.id)) ?? MOCK_EXAMS[0]!;
  const selectedExam = MOCK_EXAMS.find((exam) => exam.id === chosenId) ?? defaultExam;
  const examForAttempt = (attempt: ExamAttempt) =>
    MOCK_EXAMS.find((exam) => exam.id === attempt.examId) ?? MOCK_EXAMS[0]!;
  const hitFreeLimit = profile?.planTier === "free" && submittedCount >= FREE_TIER_MOCK_EXAM_LIMIT;

  const scores = submitted.map((a) => a.score ?? 0);
  const bestScore = scores.length > 0 ? Math.max(...scores) : null;
  const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : null;
  const totalCorrect = submitted.reduce(
    (sum, a) => sum + a.sectionResults.reduce((acc, r) => acc + r.correct, 0),
    0,
  );
  const totalQuestions = submitted.reduce(
    (sum, a) => sum + a.sectionResults.reduce((acc, r) => acc + r.total, 0),
    0,
  );
  const errorRate =
    totalQuestions > 0 ? Math.round(((totalQuestions - totalCorrect) / totalQuestions) * 100) : null;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6 lg:p-8">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={History} label={t("attemptsCount")} value={submittedCount} />
        <StatCard icon={Trophy} label={t("bestScore")} value={bestScore} />
        <StatCard icon={BarChart3} label={t("averageScore")} value={averageScore} />
        <StatCard icon={Percent} label={t("errorRate")} value={errorRate} />
      </section>

      <Card className="relative overflow-hidden border-primary-700/50 bg-deep-teal px-6 py-10 text-center text-white sm:px-10">
        <div className="pointer-events-none absolute -end-16 -top-16 size-64 rounded-full bg-secondary-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -start-16 size-64 rounded-full bg-primary-400/20 blur-3xl" />

        <div className="relative">
          <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-secondary-500 text-cream-paper">
            <FileText className="size-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">{t("title")}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-100/80 sm:text-base">
            {t("description", { total: STEP_TOTAL_QUESTIONS, minutes: STEP_TOTAL_MINUTES })}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-primary-100/70">
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="size-4 text-secondary-400" />{" "}
              {t("questionCount", { count: STEP_TOTAL_QUESTIONS })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4 text-secondary-400" />{" "}
              {t("minuteCount", { count: STEP_TOTAL_MINUTES })}
            </span>
          </div>

          <div className="mx-auto mt-8 w-full max-w-md space-y-2.5 text-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary-300">
              {t("distributionTitle")}
            </p>
            {STEP_SECTION_ORDER.map((section) => (
              <div key={section} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm font-medium text-primary-100/90">
                  {tSections(section)}
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-none bg-white/10">
                  <div
                    className={barClass(STEP_SECTION_WEIGHTS[section] * 100)}
                    style={{ width: `${STEP_SECTION_WEIGHTS[section] * 100}%` }}
                  />
                </div>
                <span className="w-32 shrink-0 whitespace-nowrap text-end text-xs tabular-nums text-primary-100/70">
                  {t("sectionCountLabel", { count: STEP_SECTION_QUESTION_COUNTS[section] })} ·{" "}
                  {t("sectionMinutesLabel", { count: STEP_SECTION_MINUTES[section] })}
                </span>
              </div>
            ))}
            <p className="pt-1 text-xs leading-relaxed text-primary-100/60">
              {t("distributionNote", {
                reading: STEP_SECTION_WEIGHTS.reading * 100,
                grammar: STEP_SECTION_WEIGHTS.grammar * 100,
                listening: STEP_SECTION_WEIGHTS.listening * 100,
                writing: STEP_SECTION_WEIGHTS.writingAnalysis * 100,
              })}
            </p>
          </div>

          {MOCK_EXAMS.length > 1 && (
            <div className="mx-auto mt-8 w-full max-w-md" role="radiogroup" aria-label={t("chooseExam")}>
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary-300">{t("chooseExam")}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {MOCK_EXAMS.map((exam) => {
                  const active = exam.id === selectedExam.id;
                  return (
                    <button
                      key={exam.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setChosenId(exam.id)}
                      className={cn(
                        "min-w-28 flex-1 rounded-none border px-3 py-3 text-sm font-semibold transition-colors",
                        active
                          ? "border-secondary-400 bg-white/15 text-white"
                          : "border-white/20 text-primary-100/80 hover:border-secondary-400",
                      )}
                    >
                      {t("examLabel", { number: exam.number })}
                      {takenExamIds.has(exam.id) && (
                        <span className="ms-2 text-xs font-normal text-secondary-300">{t("examTaken")}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col items-center gap-2">
            {hitFreeLimit ? (
              <>
                <Link
                  href="/pricing"
                  className={cn(goldButtonStyles, "h-13 px-8 text-base")}
                >
                  <Lock className="size-4" />
                  {t("upgradeForUnlimited")}
                </Link>
                <p className="text-xs text-primary-100/60">{t("usedFreeAttempt")}</p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onStart(selectedExam)}
                  disabled={isLoading}
                  className={cn(goldButtonStyles, "h-13 px-8 text-base")}
                >
                  {isLoading ? t("preparing") : t("startNewExam")}
                </button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <ModuleHeader
          icon={Award}
          title={t("previousAttempts")}
          action={
            submittedCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-none bg-secondary-100 px-3 py-1 text-xs font-bold text-cream-paper dark:bg-secondary-500/15 dark:text-secondary-300">
                {submittedCount}
              </span>
            ) : undefined
          }
        />
        {attempts === null ? (
          <div className="mt-4 flex justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          </div>
        ) : submitted.length === 0 ? (
          <EmptyState
            icon={<History className="size-7" />}
            title={t("noAttemptsYet")}
            description={t("noAttemptsDescription")}
            className="mt-4"
          />
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {submitted.map((attempt) => {
              const score = attempt.score ?? 0;
              return (
                <li key={attempt.id} className="flex items-center gap-3 py-4">
                  <Link
                    href={`/exam-results/${attempt.id}`}
                    className="group flex min-w-0 flex-1 flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-muted">
                        {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleDateString(locale) : t("noDate")}
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex min-w-12 items-center justify-center rounded-none px-3 py-1 text-sm font-bold tabular-nums",
                            scoreBadgeClass(score),
                          )}
                        >
                          {score}%
                        </span>
                        <ChevronLeft className="size-4 text-muted transition-transform group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" />
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
                      {attempt.sectionResults.map((result) => {
                        const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;
                        return (
                          <div key={result.section} className="min-w-0">
                            <div className="flex items-center justify-between gap-1 text-[11px] text-muted">
                              <span className="truncate">{tSections(result.section)}</span>
                              <span className="tabular-nums">{percent}%</span>
                            </div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-none bg-surface-muted">
                              <div
                                className={cn("h-full rounded-none", barClass(percent))}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Link>

                  {!hitFreeLimit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onStart(examForAttempt(attempt))}
                      disabled={isLoading}
                      aria-label={t("retake")}
                      className="shrink-0 self-center"
                    >
                      <RotateCcw className="size-4" />
                      <span className="hidden sm:inline">{t("retake")}</span>
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}