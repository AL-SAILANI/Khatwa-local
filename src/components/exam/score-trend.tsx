"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAttemptsByKind } from "@/lib/firestore/exam-attempts";
import type { ExamAttempt } from "@/types/exam";

const WIDTH = 560;
const HEIGHT = 140;
const PAD_X = 24;
const PAD_TOP = 18;
const PAD_BOTTOM = 30;

interface ScoreTrendProps {
  uid: string;
  kind: ExamAttempt["kind"];
  currentScore: number;
}

export function ScoreTrend({ uid, kind, currentScore }: ScoreTrendProps) {
  const t = useTranslations("exam.results");
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  useEffect(() => {
    let cancelled = false;
    getAttemptsByKind(uid, kind, 10).then((loaded) => {
      if (!cancelled) setAttempts(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [uid, kind]);

  const scores = [...attempts].reverse().map((attempt) => attempt.score ?? 0);
  if (scores.length === 0) return null;

  const allScores = [...scores, currentScore];
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);
  const range = Math.max(maxScore - minScore, 10);

  const toY = (score: number) => PAD_TOP + (1 - (score - minScore) / range) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
  const toX = (index: number, length: number) =>
    length === 1 ? WIDTH / 2 : PAD_X + (index / (length - 1)) * (WIDTH - PAD_X * 2);

  const points = scores.map((score, index) => [toX(index, scores.length), toY(score)] as const);
  const polyline = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = points.length > 0 ? `M ${PAD_X} ${HEIGHT - PAD_BOTTOM} L ${polyline.replaceAll(" ", " L ")} L ${toX(scores.length - 1, scores.length)} ${HEIGHT - PAD_BOTTOM} Z` : "";

  const currentX = toX(scores.length, scores.length + 1);
  const currentY = toY(currentScore);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <TrendingUp className="size-4 text-ink-violet dark:text-primary-300" />
          {t("scoreTrend")}
        </h2>
        <span className="text-xs text-muted">
          {t("attemptCount", { count: scores.length + 1 })}
        </span>
      </div>

      <div className="mt-3">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={t("scoreTrend")}>
          {area && <path d={area} fill="url(#trend-gradient)" />}
          {polyline && (
            <polyline
              points={polyline}
              fill="none"
              stroke="var(--color-primary-500)"
              style={{ stroke: "var(--color-primary-500)" }}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {points.map(([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="3.5" fill="var(--color-primary-500)" style={{ fill: "var(--color-primary-500)" }} />
          ))}

          <circle
            cx={currentX}
            cy={currentY}
            r="5"
            fill="var(--color-secondary-500)"
            stroke="var(--color-background)"
            style={{ fill: "var(--color-secondary-500)", stroke: "var(--color-background)" }}
            strokeWidth="2"
          />
          <text x={currentX} y={currentY - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="var(--color-primary-800)">
            {currentScore}
          </text>

          <text x={PAD_X} y={HEIGHT - 8} fontSize="11" fill="currentColor" opacity="0.6">
            {minScore}
          </text>
          <text x={toX(scores.length, scores.length + 1)} y={HEIGHT - 8} fontSize="11" fill="currentColor" opacity="0.6">
            {maxScore}
          </text>

          <defs>
            <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.25" style={{ stopColor: "var(--color-primary-500)" }} />
              <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" style={{ stopColor: "var(--color-primary-500)" }} />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
}
