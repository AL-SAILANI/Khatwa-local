import { cn } from "@/lib/utils/cn";

/**
 * Original line-art composition for the "adaptive study plan" showcase
 * panel: a month grid with a streak of completed days, a flame badge
 * breaking its top-right corner, and a small days-remaining counter
 * breaking the bottom-left — the same "badge overlapping the card edge"
 * device used in the hero illustration, so the two panels read as one
 * family. No baked-in words, only numerals, so it works unchanged in
 * either locale.
 */
export function StudyPlanIllustration({ className }: { className?: string }) {
  const cell = 26;
  const gap = 6;
  const startX = 56;
  const startY = 96;
  // Which of the 28 cells (7 cols × 4 rows) render as a completed day.
  const filled = new Set([0, 1, 2, 3, 4, 8, 9, 15, 16, 17, 22]);
  const today = 18;

  return (
    <svg viewBox="0 0 400 320" className={className} aria-hidden="true">
      <circle cx="366" cy="30" r="3" className="fill-butter-yellow" />
      <circle cx="24" cy="280" r="3" className="fill-butter-yellow" />

      {/* Calendar card */}
      <g>
        <rect x="40" y="40" width="280" height="220" className="fill-surface stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />

        {/* Window chrome, matching the hero card's language */}
        <circle cx="58" cy="60" r="4" className="fill-ink-violet dark:fill-primary-300" />
        <circle cx="74" cy="60" r="4" className="fill-butter-yellow" />
        <circle cx="90" cy="60" r="4" className="fill-deep-teal" />
        <line x1="112" y1="60" x2="180" y2="60" className="stroke-ink-violet/20 dark:stroke-primary-300/20" strokeWidth="1.5" />

        {Array.from({ length: 28 }).map((_, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          const x = startX + col * (cell + gap);
          const y = startY + row * (cell + gap);
          const isFilled = filled.has(i);
          const isToday = i === today;

          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={cell}
              height={cell}
              className={cn(
                isToday
                  ? "fill-ink-violet stroke-ink-violet dark:fill-primary-300 dark:stroke-primary-300"
                  : isFilled
                    ? "fill-butter-yellow stroke-ink-violet dark:stroke-primary-300"
                    : "fill-none stroke-ink-violet/20 dark:stroke-primary-300/20",
              )}
              strokeWidth="1.5"
            />
          );
        })}
      </g>

      {/* Streak badge, breaking the top-right corner */}
      <g transform="rotate(6 300 60)">
        <rect x="264" y="24" width="72" height="72" className="fill-shadow-black" transform="translate(4,4)" />
        <rect x="264" y="24" width="72" height="72" className="fill-butter-yellow stroke-ink-violet" strokeWidth="1.5" />
        {/* lucide-react's Flame path (already a dependency), scaled from its
            native 24×24 into this badge — safer than a hand-authored curve. */}
        <path
          d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"
          transform="translate(284,26) scale(1.35)"
          fill="none"
          className="stroke-ink-violet"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="300" y="88" textAnchor="middle" className="fill-ink-violet" fontSize="15" fontWeight="700">12</text>
      </g>

      {/* Days-remaining counter, breaking the bottom-left corner */}
      <g>
        <circle cx="56" cy="270" r="30" className="fill-shadow-black" transform="translate(3,3)" />
        <circle cx="56" cy="270" r="30" className="fill-surface stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <text x="56" y="276" textAnchor="middle" className="fill-ink-violet dark:fill-primary-300" fontSize="19" fontWeight="700">24</text>
      </g>
    </svg>
  );
}
