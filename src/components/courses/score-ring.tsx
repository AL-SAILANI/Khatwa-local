"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

const RADIUS = 44;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Circular score that fills in on mount; teal once mastered, orange otherwise. */
export function ScoreRing({
  score,
  mastered,
  className,
}: {
  score: number;
  mastered: boolean;
  className?: string;
}) {
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div
      className={cn("relative size-32", className)}
      role="img"
      aria-label={`${score}%`}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="9"
          className="stroke-border/15"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - filled / 100)}
          className={cn(
            "transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none",
            mastered ? "stroke-deep-teal" : "stroke-orange",
          )}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold tabular-nums">
        {score}%
      </span>
    </div>
  );
}
