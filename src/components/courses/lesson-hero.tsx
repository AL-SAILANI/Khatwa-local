import { HeroArt } from "@/components/courses/lesson-art";
import type { CourseTrack } from "@/types/course";

const TRACKS: CourseTrack[] = [
  "grammar",
  "reading",
  "listening",
  "writingAnalysis",
  "vocabulary",
  "tips",
  "strategies",
  "revision",
];

/** Course ids are `course-<track>`; returns null for anything else. */
export function trackOfCourse(courseId: string): CourseTrack | null {
  const track = courseId.replace(/^course-/, "") as CourseTrack;
  return TRACKS.includes(track) ? track : null;
}

/** Lesson title banner: track chip, title and an illustration on deep teal. */
export function LessonHero({
  title,
  track,
  trackLabel,
}: {
  title: string;
  track: CourseTrack | null;
  trackLabel?: string;
}) {
  return (
    <header className="relative flex items-center justify-between gap-4 overflow-hidden bg-deep-teal px-5 py-6 text-cream-paper shadow-hard sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-cream-paper) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div className="relative min-w-0 space-y-3">
        {trackLabel && (
          <span className="inline-block bg-butter-yellow px-2.5 py-1 text-xs font-bold text-ink-violet">
            {trackLabel}
          </span>
        )}
        <h1 className="text-xl font-extrabold leading-snug sm:text-2xl">
          {title}
        </h1>
      </div>
      {track && (
        <div className="relative size-24 shrink-0 rotate-3 bg-cream-paper p-2 shadow-hard sm:size-32">
          <HeroArt track={track} className="size-full" />
        </div>
      )}
    </header>
  );
}
