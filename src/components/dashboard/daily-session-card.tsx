"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  BookOpenCheck,
  Clock,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { Link } from "@/i18n/navigation";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { SKILL_BY_ID } from "@/data/skills";
import { getRecentAttempts } from "@/lib/firestore/exam-attempts";
import { getAllLessons } from "@/lib/firestore/courses";
import { getAllUserProgress } from "@/lib/firestore/lesson-progress";
import { getReviewStatesForUser } from "@/lib/firestore/vocabulary";
import { computeSkillMastery, skillsOfLesson } from "@/lib/skill-mastery";
import { buildDailySession, type DailySession } from "@/lib/session-engine";
import { getStaticQuestion } from "@/lib/tag-lesson-map";
import { getStoredSkillMastery } from "@/lib/skill-mastery-store";
import { predictScore, type ScorePrediction } from "@/lib/score-prediction";

function SessionRow({
  icon,
  title,
  detail,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  href: string;
}) {
  return (
    <li>
      <Link href={href} className="group flex items-center gap-3 py-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="mt-0.5 truncate text-xs text-muted">{detail}</p>
        </div>
        <ArrowLeft className="size-4 shrink-0 text-ink-violet transition-transform rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 dark:text-primary-400" />
      </Link>
    </li>
  );
}

/** Today's session: due vocabulary, the best next lesson, and one retry. */
export function DailySessionCard({ uid }: { uid: string }) {
  const t = useTranslations("dashboard.dailySession");
  const locale = useLocale();
  const { lessonTitle } = useLocalizedContent();
  const [session, setSession] = useState<DailySession | null>(null);
  const [prediction, setPrediction] = useState<ScorePrediction | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [attempts, lessons, progress, reviews, stored] = await Promise.all([
        getRecentAttempts(uid, 5),
        getAllLessons(),
        getAllUserProgress(uid),
        getReviewStatesForUser(uid),
        getStoredSkillMastery(uid),
      ]);
      if (cancelled) return;
      const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
      const mastery =
        stored ??
        computeSkillMastery({
          attempts,
          progress,
          lessonById,
          getQuestion: getStaticQuestion,
        });
      setPrediction(predictScore(mastery));
      const now = Date.now();
      const dueWords = reviews.filter(
        (r) => new Date(r.dueAt).getTime() <= now,
      ).length;
      setSession(
        buildDailySession({
          lessons,
          progress,
          mastery,
          skillsOfLesson: (lesson) => skillsOfLesson(lesson, getStaticQuestion),
          dueWords,
        }),
      );
    }
    load().catch(() => {
      if (!cancelled)
        setSession({ dueWords: 0, lesson: null, retry: null, minutes: 0 });
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const skillName = useMemo(
    () => (id: string | null) => {
      const skill = id ? SKILL_BY_ID.get(id) : undefined;
      return skill ? (locale === "ar" ? skill.titleAr : skill.title) : "";
    },
    [locale],
  );

  const isEmpty = session !== null && session.minutes === 0;

  return (
    <Card>
      <ModuleHeader
        icon={Sparkles}
        title={t("title")}
        description={
          session && !isEmpty
            ? t("subtitle", { minutes: session.minutes })
            : undefined
        }
      />

      {prediction && (
        <p className="mt-3 rounded-xl bg-surface-muted px-3 py-2 text-xs text-muted">
          {t("predicted", { score: prediction.score })}
          {prediction.confidence === "low" && <span> {t("predictedLow")}</span>}
        </p>
      )}

      {session === null ? (
        <div className="mt-4 flex justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : isEmpty ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Clock className="size-4" />
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border">
          {session.dueWords > 0 && (
            <SessionRow
              icon={<BookOpenCheck className="size-4.5" />}
              title={t("reviewTitle")}
              detail={t("reviewDetail", { count: session.dueWords })}
              href="/vocabulary"
            />
          )}
          {session.lesson && (
            <SessionRow
              icon={<Sparkles className="size-4.5" />}
              title={lessonTitle(session.lesson.lesson)}
              detail={
                session.lesson.mastery !== null
                  ? t("lessonWeak", {
                      skill: skillName(session.lesson.skillId),
                      percent: Math.round(session.lesson.mastery * 100),
                    })
                  : session.lesson.skillId
                    ? t("lessonNew", {
                        skill: skillName(session.lesson.skillId),
                      })
                    : t("lessonDefault")
              }
              href={`/courses/${session.lesson.lesson.courseId}/${session.lesson.lesson.id}`}
            />
          )}
          {session.retry && (
            <SessionRow
              icon={<RotateCcw className="size-4.5" />}
              title={lessonTitle(session.retry.lesson)}
              detail={t("retryDetail", {
                score: Math.round(session.retry.score),
              })}
              href={`/courses/${session.retry.lesson.courseId}/${session.retry.lesson.id}`}
            />
          )}
        </ul>
      )}
    </Card>
  );
}
