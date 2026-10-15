import Image from "next/image";
import type { CourseTrack } from "@/types/course";
import type { LessonStageKey } from "@/lib/lesson-blocks";

/**
 * Lesson illustrations live in public/lessons (unDraw, recoloured to the
 * brand teal). One per course track and one per lesson stage.
 */

const HERO_IMAGE: Record<CourseTrack, string> = {
  listening: "/lessons/listening.svg",
  reading: "/lessons/reading.svg",
  grammar: "/lessons/grammar.svg",
  writingAnalysis: "/lessons/writing.svg",
  vocabulary: "/lessons/vocabulary.svg",
  tips: "/lessons/tips.svg",
  strategies: "/lessons/strategies.svg",
  revision: "/lessons/revision.svg",
};

const STAGE_IMAGE: Record<LessonStageKey, string> = {
  learn: "/lessons/learn.svg",
  example: "/lessons/example.svg",
  practice: "/lessons/practice.svg",
  wrap: "/lessons/wrap.svg",
};

function ArtImage({ src, className }: { src: string; className?: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={400}
      height={300}
      unoptimized
      aria-hidden="true"
      className={`object-contain ${className ?? ""}`}
    />
  );
}

export function HeroArt({
  track,
  className,
}: {
  track: CourseTrack;
  className?: string;
}) {
  return <ArtImage src={HERO_IMAGE[track]} className={className} />;
}

export function StageArt({
  stage,
  className,
}: {
  stage: LessonStageKey;
  className?: string;
}) {
  return <ArtImage src={STAGE_IMAGE[stage]} className={className} />;
}

const CONFETTI: { left: string; delay: string; color: string }[] = [
  { left: "6%", delay: "0s", color: "bg-butter-yellow" },
  { left: "16%", delay: "0.15s", color: "bg-deep-teal" },
  { left: "26%", delay: "0.05s", color: "bg-orange" },
  { left: "36%", delay: "0.3s", color: "bg-violet-500" },
  { left: "46%", delay: "0.1s", color: "bg-butter-yellow" },
  { left: "56%", delay: "0.25s", color: "bg-cyan" },
  { left: "66%", delay: "0s", color: "bg-orange" },
  { left: "76%", delay: "0.2s", color: "bg-deep-teal" },
  { left: "86%", delay: "0.1s", color: "bg-butter-yellow" },
  { left: "94%", delay: "0.3s", color: "bg-violet-500" },
];

/** A short, decorative burst; hidden entirely for reduced-motion users. */
export function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden motion-reduce:hidden"
    >
      {CONFETTI.map((piece, i) => (
        <span
          key={i}
          className={`confetti-piece absolute top-0 block h-2.5 w-1.5 ${piece.color}`}
          style={{ left: piece.left, animationDelay: piece.delay }}
        />
      ))}
    </div>
  );
}
