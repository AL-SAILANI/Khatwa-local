import Image from "next/image";
import type { CourseTrack } from "@/types/course";
import type { LessonStageKey } from "@/lib/lesson-blocks";

/**
 * Flat editorial illustrations for the lesson screens. Everything is drawn
 * with the design tokens (no raw hex) so the art follows the palette:
 * Both `HeroArt` (on a cream tile over the deep-teal banner) and `StageArt`
 * (on a butter-yellow tile) use ink strokes in both themes.
 */

const HERO_STROKE = "stroke-ink-violet";
const TILE_STROKE = "stroke-ink-violet";

function Svg({
  stroke,
  children,
  className,
}: {
  stroke: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 120"
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${stroke} ${className ?? ""}`}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

function ListeningArt() {
  return (
    <>
      <path d="M38 78V66a42 42 0 0 1 84 0v12" />
      <rect x="28" y="72" width="22" height="34" className="fill-butter-yellow" />
      <rect x="110" y="72" width="22" height="34" className="fill-butter-yellow" />
      <path d="M62 52q18-14 36 0M70 62q10-8 20 0" className="stroke-butter-yellow" />
      <circle cx="80" cy="84" r="4" className="fill-orange" />
    </>
  );
}

function ReadingArt() {
  return (
    <>
      <path d="M80 36v68M80 36C66 28 44 28 28 34v66c16-6 38-6 52 4 14-10 36-10 52-4V34c-16-6-38-6-52 2Z" className="fill-white" />
      <path d="M40 50q14-3 28 2M40 64q14-3 28 2M92 52q14-5 28-2M92 66q14-5 28-2" />
      <path d="m124 14 3.5 8 8.5 1-6.5 5.5 2 8.5-7.5-4.5-7.5 4.5 2-8.5L112 23l8.5-1Z" className="fill-butter-yellow" />
    </>
  );
}

function GrammarArt() {
  return (
    <>
      <rect x="22" y="30" width="78" height="60" className="fill-white" />
      <text
        x="61"
        y="72"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        strokeWidth={0}
        className="fill-ink-violet"
      >
        Aa
      </text>
      <path d="M96 100 132 38l12 7-36 62-17 4Z" className="fill-butter-yellow" />
      <path d="m121 56 12 7" />
    </>
  );
}

function WritingArt() {
  return (
    <>
      <rect x="26" y="18" width="70" height="88" className="fill-white" />
      <path d="M38 36h46M38 50h34M38 64h46M38 78h28" />
      <path d="M38 71h46" className="stroke-error" />
      <circle cx="110" cy="74" r="18" className="fill-butter-yellow" />
      <path d="m123 87 18 18" strokeWidth={6} />
      <path d="m102 74 6 6 11-12" />
    </>
  );
}

function VocabularyArt() {
  return (
    <>
      <rect x="44" y="24" width="64" height="76" transform="rotate(-8 76 62)" className="fill-butter-yellow" />
      <rect x="56" y="22" width="64" height="76" transform="rotate(6 88 60)" className="fill-white" />
      <text x="88" y="72" textAnchor="middle" fontSize="34" fontWeight="700" strokeWidth={0} className="fill-ink-violet">
        A
      </text>
      <path d="M72 84h32" />
    </>
  );
}

function TipsArt() {
  return (
    <>
      <path d="M80 18a30 30 0 0 0-16 55c4 3 6 7 6 12h20c0-5 2-9 6-12A30 30 0 0 0 80 18Z" className="fill-butter-yellow" />
      <path d="M70 94h20M72 104h16" />
      <path d="M80 6v6M38 22l5 4M122 22l-5 4M26 52h6M128 52h6" />
    </>
  );
}

function StrategiesArt() {
  return (
    <>
      <circle cx="74" cy="64" r="40" className="fill-white" />
      <circle cx="74" cy="64" r="26" className="fill-butter-yellow" />
      <circle cx="74" cy="64" r="10" className="fill-orange" />
      <path d="M74 64 130 14M118 14h12v12" />
    </>
  );
}

function RevisionArt() {
  return (
    <>
      <path d="M118 46A42 42 0 0 0 44 42M42 74a42 42 0 0 0 74 4" />
      <path d="M46 24v20h20M114 100V80H94" />
      <circle cx="80" cy="60" r="20" className="fill-butter-yellow" />
      <path d="m70 60 7 7 13-14" />
    </>
  );
}

const HERO_ART: Record<CourseTrack, () => React.JSX.Element> = {
  listening: () => <ListeningArt />,
  reading: () => <ReadingArt />,
  grammar: () => <GrammarArt />,
  writingAnalysis: () => <WritingArt />,
  vocabulary: () => <VocabularyArt />,
  tips: () => <TipsArt />,
  strategies: () => <StrategiesArt />,
  revision: () => <RevisionArt />,
};

/** Illustrations supplied as files (public/lessons); the drawn art above is the fallback. */
const HERO_IMAGE: Partial<Record<CourseTrack, string>> = {
  listening: "/lessons/listening.svg",
  reading: "/lessons/reading.svg",
  grammar: "/lessons/grammar.svg",
  writingAnalysis: "/lessons/writing.svg",
  vocabulary: "/lessons/vocabulary.svg",
};

const STAGE_IMAGE: Partial<Record<LessonStageKey, string>> = {
  example: "/lessons/example.svg",
  practice: "/lessons/practice.svg",
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
  const image = HERO_IMAGE[track];
  if (image) return <ArtImage src={image} className={className} />;
  const Art = HERO_ART[track];
  return (
    <Svg stroke={HERO_STROKE} className={className}>
      <Art />
    </Svg>
  );
}

function LearnArt() {
  return (
    <>
      <path d="M80 16a28 28 0 0 0-15 52c4 3 6 6 6 11h18c0-5 2-8 6-11A28 28 0 0 0 80 16Z" className="fill-white" />
      <path d="M71 88h18M73 98h14" />
      <path d="M80 4v6M36 20l5 4M124 20l-5 4M24 48h6M130 48h6" />
      <path d="M72 44q8 8 16 0" />
    </>
  );
}

function ExampleArt() {
  return (
    <>
      <rect x="22" y="20" width="84" height="80" className="fill-white" />
      <path d="M36 40h40M36 54h56M36 68h30" />
      <circle cx="112" cy="84" r="20" className="fill-mint-400" />
      <path d="m102 84 8 8 14-16" />
    </>
  );
}

function PracticeArt() {
  return (
    <>
      <circle cx="68" cy="64" r="42" className="fill-white" />
      <circle cx="68" cy="64" r="28" className="fill-orange" />
      <circle cx="68" cy="64" r="14" className="fill-white" />
      <circle cx="68" cy="64" r="4" className="fill-ink-violet" />
      <path d="m68 64 58-46M112 14l12 4 4 12" />
    </>
  );
}

function WrapArt() {
  return (
    <>
      <path d="M52 18h56v34a28 28 0 0 1-56 0Z" className="fill-white" />
      <path d="M52 28H36a4 4 0 0 0-4 4c0 14 8 24 22 26M108 28h16a4 4 0 0 1 4 4c0 14-8 24-22 26" />
      <path d="M80 80v14M62 104h36M68 94h24" />
      <path d="m80 30 4 8 9 1-6.500 6 2 9-8.500-4.500-8.500 4.500 2-9L67 39l9-1Z" className="fill-butter-yellow" />
    </>
  );
}

const STAGE_ART: Record<LessonStageKey, () => React.JSX.Element> = {
  learn: () => <LearnArt />,
  example: () => <ExampleArt />,
  practice: () => <PracticeArt />,
  wrap: () => <WrapArt />,
};

export function StageArt({
  stage,
  className,
}: {
  stage: LessonStageKey;
  className?: string;
}) {
  const image = STAGE_IMAGE[stage];
  if (image) return <ArtImage src={image} className={className} />;
  const Art = STAGE_ART[stage];
  return (
    <Svg stroke={TILE_STROKE} className={className}>
      <Art />
    </Svg>
  );
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
