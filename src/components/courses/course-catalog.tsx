"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  BookOpen,
  FileText,
  Headphones,
  PenLine,
  BookMarked,
  Lightbulb,
  Clock,
  RotateCcw,
  Search,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { getCourses } from "@/lib/firestore/courses";
import { cn } from "@/lib/utils/cn";
import type { Course, CourseTrack } from "@/types/course";

const TRACK_ICONS: Record<CourseTrack, LucideIcon> = {
  grammar: PenLine,
  reading: BookOpen,
  listening: Headphones,
  writingAnalysis: FileText,
  vocabulary: BookMarked,
  tips: Lightbulb,
  strategies: Clock,
  revision: RotateCcw,
};

const TRACK_ORDER: CourseTrack[] = [
  "grammar",
  "reading",
  "listening",
  "writingAnalysis",
  "vocabulary",
  "tips",
  "strategies",
  "revision",
];

export function CourseCatalog() {
  const t = useTranslations("courses");
  const tTracks = useTranslations("trackNames");
  const { courseTitle, courseDescription } = useLocalizedContent();
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [query, setQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState<CourseTrack | null>(null);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  const filtered = useMemo(() => {
    if (!courses) return null;
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      if (activeTrack && course.track !== activeTrack) return false;
      if (!q) return true;
      const haystack = `${courseTitle(course)} ${courseDescription(course)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [courses, query, activeTrack, courseTitle, courseDescription]);

  const hasFilters = query.trim().length > 0 || activeTrack !== null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6 lg:p-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={BookOpen}
        title={t("pageTitle")}
        description={t("description")}
        actions={
          <label className="relative block sm:w-72">
            <span className="sr-only">{t("searchLabel")}</span>
            <Search className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-none border border-border bg-surface-muted py-2.5 pe-4 ps-9 text-sm outline-none transition-colors placeholder:text-foreground/50 focus:border-primary-500 focus:bg-surface"
            />
          </label>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t("filterByTrack")}>
        <button
          type="button"
          onClick={() => setActiveTrack(null)}
          aria-pressed={activeTrack === null}
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-none border px-4 py-2 text-xs font-semibold transition-colors",
            activeTrack === null
              ? "border-primary-500 bg-primary-500 text-ink-violet"
              : "border-border bg-surface text-muted hover:border-primary-300 hover:text-foreground",
          )}
        >
          {t("allTracks")}
        </button>
        {TRACK_ORDER.map((track) => {
          const Icon = TRACK_ICONS[track];
          const isActive = activeTrack === track;
          return (
            <button
              key={track}
              type="button"
              onClick={() => setActiveTrack(isActive ? null : track)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-none border px-4 py-2 text-xs font-semibold transition-colors",
                isActive
                  ? "border-primary-500 bg-primary-500 text-ink-violet"
                  : "border-border bg-surface text-muted hover:border-primary-300 hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {tTracks(track)}
            </button>
          );
        })}
      </div>

      {courses === null ? (
        <div className="flex justify-center py-12">
          <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : filtered!.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <SearchX className="size-10 text-muted" />
          <p className="text-sm font-semibold">{hasFilters ? t("noResults") : t("noCoursesYet")}</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveTrack(null);
              }}
              className="text-sm font-semibold text-ink-violet hover:underline dark:text-primary-400"
            >
              {t("clearFilters")}
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered!.map((course) => {
            const Icon = TRACK_ICONS[course.track];
            return (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="h-full transition-all hover:-translate-y-1">
                  <div className="inline-flex size-11 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{courseTitle(course)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{courseDescription(course)}</p>
                  <div className="mt-4 text-xs text-muted">
                    {t("lessonSummary", { lessonCount: course.lessonCount, minutes: course.estimatedMinutes })}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
