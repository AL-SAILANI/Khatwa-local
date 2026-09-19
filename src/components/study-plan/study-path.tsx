"use client";

import { useTranslations } from "next-intl";
import { CalendarRange, Check, ChevronLeft, GraduationCap, Lock, Play } from "lucide-react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useStudyPath } from "@/hooks/use-study-path";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { difficultyOf } from "@/lib/study-plan-generator";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ModuleHeader } from "@/components/ui/module-header";
import { EmptyState, LoadingState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils/cn";
import type { Course } from "@/types/course";

type LessonStatus = "done" | "current" | "locked";

function TrackBadge({ course, auxLabel }: { course: Course | undefined; auxLabel: string | null }) {
  if (!course) return null;
  return (
    <span className="rounded-md bg-surface-muted px-1.5 py-0.5 text-xs font-medium text-foreground/70">
      {auxLabel ?? course.track}
    </span>
  );
}

export function StudyPath() {
  const t = useTranslations("studyPlan");
  const trackNames = useTranslations("trackNames");
  const emptyT = useTranslations("emptyState");
  const { user } = useUserProfile();
  const {
    plan,
    lessonById,
    courseById,
    orderedLessonIds,
    currentLessonId,
    completedCount,
    totalCount,
    loading,
  } = useStudyPath(user?.uid);
  const { lessonTitle } = useLocalizedContent();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingState size="lg" />
      </div>
    );
  }

  if (!plan || totalCount === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl p-6 lg:p-8">
        <EmptyState
          icon={<GraduationCap className="size-8" />}
          title={emptyT("noStudyPlan.title")}
          description={emptyT("noStudyPlan.description")}
          action={{ label: emptyT("noStudyPlan.action"), href: "/study-plan/new" }}
        />
      </div>
    );
  }

  const currentIndex = currentLessonId ? orderedLessonIds.indexOf(currentLessonId) : orderedLessonIds.length;
  const statusOf = (lessonId: string): LessonStatus => {
    const index = orderedLessonIds.indexOf(lessonId);
    if (index === -1) return "locked";
    if (index < currentIndex) return "done";
    if (index === currentIndex) return "current";
    return "locked";
  };

  const currentLesson = currentLessonId ? lessonById.get(currentLessonId) : undefined;
  const isComplete = currentLessonId === null && totalCount > 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={CalendarRange}
        title={t("pathTitle")}
        description={t("pathDescription")}
      />

      <Card className="space-y-4 p-6">
        <ModuleHeader
          icon={CalendarRange}
          title={t("planMeta", { days: plan.durationDays })}
          description={t("progressLabel", { completed: completedCount, total: totalCount })}
          action={<span className="text-sm font-bold text-ink-violet dark:text-primary-400">{progress}%</span>}
        />

        <div className="h-2 w-full overflow-hidden rounded-none bg-surface-muted">
          <div
            className="h-full rounded-none bg-ink-violet transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isComplete ? (
          <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success-600 dark:text-success-300">
            <Check className="size-4.5" />
            {t("pathComplete")}
          </p>
        ) : currentLesson ? (
          <Link
            href={`/courses/${currentLesson.courseId}/${currentLesson.id}`}
            className="group flex items-center justify-between gap-3 rounded-xl border border-primary-500/40 bg-primary-50 p-4 transition-colors hover:border-primary-500 dark:bg-primary-500/10"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-ink-violet">
                <Play className="size-3.5 fill-current" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-ink-violet/80 dark:text-primary-300">{t("continuePath")}</p>
                <p className="truncate text-sm font-semibold">{lessonTitle(currentLesson)}</p>
              </div>
            </div>
            <ChevronLeft className="size-4 shrink-0 transition-transform rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 text-ink-violet dark:text-primary-400" />
          </Link>
        ) : null}
      </Card>

      <ol className="relative space-y-3">
        {orderedLessonIds.map((lessonId, lessonIndex) => {
          const lesson = lessonById.get(lessonId);
          if (!lesson) return null;
          const status = statusOf(lessonId);
          const course = courseById.get(lesson.courseId);
          const difficulty = difficultyOf(lesson);
          const auxLabel =
            course?.track === "tips" || course?.track === "strategies" || course?.track === "revision"
              ? trackNames(course.track)
              : null;
          const isLast = lessonIndex === orderedLessonIds.length - 1;

          const content = (
            <div className="flex w-full items-center justify-between gap-3 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
                    status === "done" && "bg-success/15 text-success-600 dark:text-success-300",
                    status === "current" && "bg-primary-500 text-ink-violet",
                    status === "locked" && "bg-surface-muted text-foreground/70",
                  )}
                >
                  {status === "done" ? (
                    <Check className="size-3.5" />
                  ) : status === "locked" ? (
                    <Lock className="size-3.5" />
                  ) : (
                    <Play className="size-3 fill-current" />
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      status === "locked" && "text-muted",
                    )}
                  >
                    {lessonTitle(lesson)}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <TrackBadge course={course} auxLabel={auxLabel} />
                    {difficulty && (
                      <span
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-xs font-medium",
                          difficulty === "easy" && "bg-success/10 text-success-600 dark:text-success-300",
                          difficulty === "medium" && "bg-warning/10 text-warning-600 dark:text-warning-300",
                          difficulty === "hard" && "bg-error/10 text-error-600 dark:text-error-300",
                        )}
                      >
                        {t(`difficulty.${difficulty}`)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {status !== "locked" && (
                <ChevronLeft className="size-4 shrink-0 text-muted rtl:rotate-180" />
              )}
            </div>
          );

          return (
            <li key={lessonId} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                    status === "done" && "border-success/40 bg-success/10 text-success-600 dark:text-success-300",
                    status === "current" && "border-primary-500 bg-primary-500 text-ink-violet",
                    status === "locked" && "border-border bg-surface-muted text-foreground/70",
                  )}
                >
                  {status === "done" ? <Check className="size-4" /> : status === "locked" ? <Lock className="size-3.5" /> : lessonIndex + 1}
                </span>
                {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>

              <div className="min-w-0 flex-1 pb-2">
                {status === "locked" ? (
                  <div className="rounded-xl border border-border bg-surface/40">
                    {content}
                  </div>
                ) : (
                  <Link
                    href={`/courses/${lesson.courseId}/${lesson.id}`}
                    className="block rounded-xl border border-border bg-surface transition-colors hover:border-primary-500"
                  >
                    {content}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
