/**
 * Original line-art composition for the "spaced repetition" showcase panel:
 * a fanned stack of flashcards, a due-today count badge, and a review-queue
 * bar showing done / current / upcoming words. A different composition from
 * the hero's single tilted flashcard, but the same drawing vocabulary
 * (window-chrome dots, hard-offset badges, pronounce icon) so the two
 * panels still read as one visual family.
 */
export function VocabularyIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} aria-hidden="true">
      <circle cx="40" cy="40" r="3" className="fill-butter-yellow" />
      <circle cx="360" cy="270" r="3" className="fill-butter-yellow" />

      {/* Back card, most rotated */}
      <g transform="rotate(-10 200 150)">
        <rect x="110" y="80" width="180" height="120" className="fill-surface stroke-ink-violet/50 dark:stroke-primary-300/50" strokeWidth="1.5" />
      </g>

      {/* Middle card */}
      <g transform="rotate(-4 200 150)">
        <rect x="110" y="76" width="180" height="120" className="fill-surface stroke-ink-violet/75 dark:stroke-primary-300/75" strokeWidth="1.5" />
      </g>

      {/* Front card — the active word */}
      <g>
        <rect x="108" y="70" width="184" height="124" className="fill-surface stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <line x1="130" y1="102" x2="220" y2="102" className="stroke-ink-violet dark:stroke-primary-300" strokeWidth="2.5" />
        <line x1="130" y1="120" x2="250" y2="120" className="stroke-ink-violet/50 dark:stroke-primary-300/50" strokeWidth="1.5" />
        <line x1="130" y1="134" x2="230" y2="134" className="stroke-ink-violet/50 dark:stroke-primary-300/50" strokeWidth="1.5" />

        {/* Pronounce icon, same drawing as the hero flashcard */}
        <g transform="translate(228, 158)">
          <path d="M8 -6 l8 -6 v20 l-8 -6 h-8 v-8 z" className="fill-butter-yellow stroke-ink-violet dark:stroke-primary-300" strokeWidth="1" />
          <path d="M20 -8 q6 8 0 16" fill="none" className="stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        </g>
      </g>

      {/* Due-today badge, breaking the front card's top-right corner */}
      <g>
        <rect x="256" y="42" width="56" height="32" className="fill-shadow-black" transform="translate(3,3)" />
        <rect x="256" y="42" width="56" height="32" className="fill-butter-yellow stroke-ink-violet" strokeWidth="1.5" />
        <text x="284" y="64" textAnchor="middle" className="fill-ink-violet" fontSize="15" fontWeight="700">12</text>
      </g>

      {/* Review queue bar: done, current, upcoming */}
      <g>
        {Array.from({ length: 10 }).map((_, i) => {
          const x = 108 + i * 19;
          const state = i < 4 ? "done" : i === 4 ? "current" : "upcoming";
          return (
            <rect
              key={i}
              x={x}
              y={228}
              width="14"
              height="14"
              className={
                state === "done"
                  ? "fill-ink-violet stroke-ink-violet dark:fill-primary-300 dark:stroke-primary-300"
                  : state === "current"
                    ? "fill-butter-yellow stroke-ink-violet dark:stroke-primary-300"
                    : "fill-none stroke-ink-violet/25 dark:stroke-primary-300/25"
              }
              strokeWidth="1.5"
            />
          );
        })}
      </g>
    </svg>
  );
}
