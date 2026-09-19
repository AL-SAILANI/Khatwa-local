/**
 * Original line-art composition for the hero's right column: an exam
 * question card, a score/analytics panel, and a vocabulary flashcard,
 * layered and breaking each other's edges — Khatwa's own product surfaces,
 * drawn in the flat-outline / selective-yellow-fill style used throughout
 * the theme. No gradients, no blur, no photography.
 *
 * Every stroke and fill is a theme token (`fill-surface`, `stroke-border`,
 * `fill-butter-yellow`, …) so the piece re-themes for dark mode the same
 * way the rest of the page does — nothing here is a hardcoded hex value.
 */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 400"
      className={className}
      aria-hidden="true"
    >
      {/* Scattered accent dots, behind everything */}
      <circle cx="30" cy="40" r="4" className="fill-butter-yellow" />
      <circle cx="450" cy="60" r="4" className="fill-butter-yellow" />
      <circle cx="440" cy="230" r="3" className="fill-butter-yellow" />
      <circle cx="20" cy="360" r="3" className="fill-butter-yellow" />

      {/* Dashed connector from the analytics panel to the question card */}
      <path
        d="M256 110 Q 220 150 190 170"
        fill="none"
        className="stroke-ink-violet/30 dark:stroke-primary-300/30"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <circle cx="190" cy="170" r="2.5" className="fill-ink-violet/60 dark:fill-primary-300/60" />

      {/* Analytics panel — score donut + bar trend, top right */}
      <g>
        <rect x="256" y="16" width="200" height="132" className="fill-surface stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />

        {/* Donut: mostly-complete ring with one yellow segment */}
        <circle cx="308" cy="80" r="30" fill="none" className="stroke-ink-violet/25 dark:stroke-primary-300/25" strokeWidth="10" />
        <circle
          cx="308"
          cy="80"
          r="30"
          fill="none"
          className="stroke-butter-yellow"
          strokeWidth="10"
          strokeDasharray="156.4 188.5"
          strokeDashoffset="-40"
          transform="rotate(-90 308 80)"
        />
        <text x="308" y="85" textAnchor="middle" className="fill-ink-violet dark:fill-primary-300" fontSize="14" fontWeight="700">83%</text>

        {/* Bar trend, one bar highlighted */}
        <rect x="360" y="108" width="10" height="24" className="fill-none stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <rect x="376" y="92" width="10" height="40" className="fill-none stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <rect x="392" y="70" width="10" height="62" className="fill-butter-yellow stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <rect x="408" y="100" width="10" height="32" className="fill-none stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
        <rect x="424" y="86" width="10" height="46" className="fill-none stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />
      </g>

      {/* Exam question card — the main panel */}
      <g>
        <rect x="24" y="96" width="272" height="224" className="fill-surface stroke-ink-violet dark:stroke-primary-300" strokeWidth="1.5" />

        {/* Window chrome dots */}
        <circle cx="42" cy="116" r="4" className="fill-ink-violet dark:fill-primary-300" />
        <circle cx="58" cy="116" r="4" className="fill-butter-yellow" />
        <circle cx="74" cy="116" r="4" className="fill-deep-teal" />
        <line x1="96" y1="116" x2="200" y2="116" className="stroke-ink-violet/20 dark:stroke-primary-300/20" strokeWidth="1.5" />

        {/* Question text lines */}
        <line x1="42" y1="146" x2="270" y2="146" className="stroke-ink-violet dark:stroke-primary-300" strokeWidth="2" />
        <line x1="42" y1="160" x2="220" y2="160" className="stroke-ink-violet/50 dark:stroke-primary-300/50" strokeWidth="2" />

        {/* Answer option rows */}
        {[
          { y: 190, selected: false },
          { y: 224, selected: true },
          { y: 258, selected: false },
        ].map(({ y, selected }) => (
          <g key={y}>
            <line x1="42" y1={y + 22} x2="278" y2={y + 22} className="stroke-ink-violet/15 dark:stroke-primary-300/15" strokeWidth="1" />
            <circle
              cx="52"
              cy={y}
              r="7"
              className={selected ? "fill-butter-yellow stroke-ink-violet dark:stroke-primary-300" : "fill-none stroke-ink-violet/50 dark:stroke-primary-300/50"}
              strokeWidth="1.5"
            />
            <line x1="72" y1={y} x2={selected ? 240 : 210} y2={y} className="stroke-ink-violet/70 dark:stroke-primary-300/70" strokeWidth="2" />
          </g>
        ))}
      </g>

      {/* Vocabulary flashcard, tilted, overlapping the question card's edge */}
      <g transform="rotate(-7 108 348)">
        {/* Hard-offset shadow, the system's one signature shadow, drawn by hand */}
        <rect x="44" y="308" width="150" height="86" className="fill-shadow-black" />
        <rect x="40" y="304" width="150" height="86" className="fill-butter-yellow stroke-ink-violet" strokeWidth="1.5" />
        <line x1="56" y1="330" x2="130" y2="330" className="stroke-ink-violet" strokeWidth="2.5" />
        <line x1="56" y1="346" x2="164" y2="346" className="stroke-ink-violet/60" strokeWidth="1.5" />
        <line x1="56" y1="358" x2="140" y2="358" className="stroke-ink-violet/60" strokeWidth="1.5" />
        {/* Pronounce icon */}
        <path d="M168 372 l8 -6 v20 l-8 -6 h-8 v-8 z" className="fill-ink-violet" />
        <path d="M180 364 q6 8 0 16" fill="none" className="stroke-ink-violet" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
