"use client";

import { useTranslations } from "next-intl";
import { CalendarRange, Check, ChevronLeft, Lock, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ModuleHeader } from "@/components/ui/module-header";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useStudyPath } from "@/hooks/use-study-path";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { cn } from "@/lib/utils/cn";

export function StudyPathCard() {
  const t = useTranslations("dashboard.studyPath");
  const { user } = useUserProfile();
  const { plan, lessonById, currentLessonId, completedCount, totalCount, loading } = useStudyPath(user?.uid);
  const { lessonTitle } = useLocalizedContent();

  if (loading) {
    return (
      <Card className="space-y-3 p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
        <div className="h-2 w-full animate-pulse rounded-none bg-surface-muted" />
      </Card>
    );
  }

  if (!plan || totalCount === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-start">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
            <CalendarRange className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">{t("createTitle")}</h3>
            <p className="mt-0.5 text-sm text-muted">{t("createDescription")}</p>
          </div>
        </div>
        <Link href="/study-plan/new">
          <Button variant="outline">{t("create")}</Button>
        </Link>
      </Card>
    );
  }

  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentLesson = currentLessonId ? lessonById.get(currentLessonId) : undefined;
  const isComplete = currentLessonId === null;

  return (
    <Card className="space-y-4 p-6">
      <ModuleHeader
        icon={CalendarRange}
        title={t("title")}
        description={t("progressLabel", { completed: completedCount, total: totalCount })}
        action={
          <Link
            href="/study-plan/path"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-ink-violet dark:text-primary-400"
          >
            {t("viewAll")}
            <ChevronLeft className="size-4 rtl:rotate-180" />
          </Link>
        }
      />

      <div className="h-2 w-full overflow-hidden rounded-none bg-surface-muted">
        <div
          className="h-full rounded-none bg-ink-violet transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isComplete ? (
        <p className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success">
          <Check className="size-4.5" />
          {t("complete")}
        </p>
      ) : currentLesson ? (
        <Link
          href={`/courses/${currentLesson.courseId}/${currentLesson.id}`}
          className={cn(
            "group flex items-center justify-between gap-3 rounded-xl border border-primary-500/40 bg-primary-50 p-4 transition-colors hover:border-primary-500 dark:bg-primary-500/10",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-ink-violet">
              <Play className="size-3.5 fill-current" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted">{t("resume")}</p>
              <p className="truncate text-sm font-semibold">{lessonTitle(currentLesson)}</p>
            </div>
          </div>
          <ChevronLeft className="size-4 shrink-0 text-ink-violet transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1 dark:text-primary-400" />
        </Link>
      ) : (
        <p className="flex items-center gap-2 text-sm text-muted">
          <Lock className="size-4" />
          {t("emptyDay")}
        </p>
      )}
    </Card>
  );
}
