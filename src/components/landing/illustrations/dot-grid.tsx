"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

const COLS = 14;
const ROWS = 4;
const SPACING = 20;
const WIDTH = COLS * SPACING;
const HEIGHT = ROWS * SPACING;

// How far, in viewBox units, a dot reacts to the pointer — about two grid
// cells, so a handful of dots swell at once rather than just the nearest one.
const HOVER_RADIUS = 44;

// Fixed (not random) positions for the larger butter-yellow accent dots, so
// server and client render identically — a few per row, scattered by eye
// rather than by a formula, matching the reference's irregular placement.
const ACCENT_CELLS = new Set(["1,0", "8,0", "3,2", "11,2", "5,3"]);

const DOTS = Array.from({ length: ROWS }).flatMap((_, row) =>
  Array.from({ length: COLS }).map((_, col) => ({
    key: `${col}-${row}`,
    cx: col * SPACING + SPACING / 2,
    cy: row * SPACING + SPACING / 2,
    isAccent: ACCENT_CELLS.has(`${col},${row}`),
  })),
);

/**
 * The scattered dot field Syllabus uses to fill quiet corners — small ink
 * violet dots with a handful of larger butter yellow ones breaking the grid,
 * grown and brightened around the pointer. Purely decorative motion, so it
 * stays `aria-hidden`; nothing here is reachable by keyboard or announced.
 */
export function DotGrid({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const { clientX, clientY } = e;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      setPointer({
        x: ((clientX - rect.left) / rect.width) * WIDTH,
        y: ((clientY - rect.top) / rect.height) * HEIGHT,
      });
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    setPointer(null);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={cn(className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      {/* An invisible full-bleed hit area — individual 1.5px dots are too
          small a target for pointermove to fire reliably over. */}
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="transparent" />

      {DOTS.map(({ key, cx, cy, isAccent }) => {
        const distance = pointer ? Math.hypot(cx - pointer.x, cy - pointer.y) : Infinity;
        const proximity = Math.max(0, 1 - distance / HOVER_RADIUS);
        const baseRadius = isAccent ? 4 : 1.5;
        const radius = baseRadius + proximity * (isAccent ? 2.5 : 2);

        return (
          <circle
            key={key}
            cx={cx}
            cy={cy}
            r={radius}
            className={cn(
              "transition-[r,opacity] duration-150 ease-out",
              isAccent ? "fill-butter-yellow" : "fill-ink-violet dark:fill-primary-300",
            )}
            style={!isAccent ? { opacity: 0.25 + proximity * 0.55 } : undefined}
          />
        );
      })}
    </svg>
  );
}
