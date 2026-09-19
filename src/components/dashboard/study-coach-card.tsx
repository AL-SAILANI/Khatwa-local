"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { Link } from "@/i18n/navigation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getRecentAttempts } from "@/lib/firestore/exam-attempts";
import { getCourses, getLessonsForCourse } from "@/lib/firestore/courses";
import { getAllUserProgress } from "@/lib/firestore/lesson-progress";
import { rankWeakTracks, recommendNextLessons, type LessonRecommendation } from "@/lib/study-coach";

export function StudyCoachCard({ uid }: { uid: string }) {
  const t = useTranslations("dashboard.studyCoach");
  const tTracks = useTranslations("trackNames");
  const { lessonTitle } = useLocalizedContent();
  const [recommendations, setRecommendations] = useState<LessonRecommendation[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [attempts, courses, progress] = await Promise.all([
        getRecentAttempts(uid, 5),
        getCourses(),
        getAllUserProgress(uid),
      ]);

      const lessonsByCourseId: Record<string, Awaited<ReturnType<typeof getLessonsForCourse>>> = {};
      await Promise.all(
        courses.map(async (course) => {
          lessonsByCourseId[course.id] = await getLessonsForCourse(course.id);
        }),
      );

      if (cancelled) return;
      const weakTracks = rankWeakTracks(attempts);
      setRecommendations(recommendNextLessons(weakTracks, courses, lessonsByCourseId, progress));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (recommendations !== null && recommendations.length === 0) return null;

  return (
    <Card>
      <ModuleHeader icon={Sparkles} title={t("title")} />

      {recommendations === null ? (
        <div className="mt-4 flex justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {recommendations.map(({ course, lesson, reason }) => (
            <li key={lesson.id} className="py-3">
              <Link
                href={`/courses/${course.id}/${lesson.id}`}
                className="group flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lessonTitle(lesson)}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {reason.kind === "weakness"
                      ? t("weaknessReason", {
                          track: tTracks(reason.track),
                          percent: Math.round(reason.percentCorrect * 100),
                        })
                      : t("defaultReason")}
                  </p>
                </div>
                <ArrowLeft className="size-4 shrink-0 text-ink-violet transition-transform rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 dark:text-primary-400" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
