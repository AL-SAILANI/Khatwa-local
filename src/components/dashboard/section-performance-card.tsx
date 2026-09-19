"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ModuleHeader } from "@/components/ui/module-header";
import { Link } from "@/i18n/navigation";
import { getRecentAttempts } from "@/lib/firestore/exam-attempts";
import { cn } from "@/lib/utils/cn";
import type { ExamAttempt } from "@/types/exam";
import type { ExamSectionKey } from "@/types/question";

const SECTION_ORDER: ExamSectionKey[] = ["reading", "grammar", "listening", "writingAnalysis"];

interface SectionStat {
  section: ExamSectionKey;
  percent: number | null;
  correct: number;
  total: number;
}

/**
 * Weighted percent-correct per STEP section across the user's recent exam
 * attempts — the latest attempt counts double so a recent change in
 * performance dominates, mirroring `rankWeakTracks` in the study coach.
 */
function aggregateSections(attempts: ExamAttempt[]): SectionStat[] {
  const totals = new Map<ExamSectionKey, { correct: number; total: number }>();

  attempts
    .filter((attempt) => attempt.status === "submitted")
    .slice(0, 10)
    .forEach((attempt, index) => {
      const weight = index === 0 ? 2 : 1;
      for (const result of attempt.sectionResults) {
        const entry = totals.get(result.section) ?? { correct: 0, total: 0 };
        entry.correct += result.correct * weight;
        entry.total += result.total * weight;
        totals.set(result.section, entry);
      }
    });

  return SECTION_ORDER.map((section) => {
    const entry = totals.get(section);
    return {
      section,
      correct: entry?.correct ?? 0,
      total: entry?.total ?? 0,
      percent: entry && entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : null,
    };
  });
}

export function SectionPerformanceCard({ uid }: { uid: string }) {
  const t = useTranslations("dashboard.performance");
  const tTracks = useTranslations("trackNames");
  const [sections, setSections] = useState<SectionStat[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRecentAttempts(uid, 10).then((attempts) => {
      if (!cancelled) setSections(aggregateSections(attempts));
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (sections !== null && sections.every((s) => s.percent === null)) return null;

  return (
    <Card>
      <ModuleHeader
        icon={BarChart3}
        title={t("title")}
        action={
          <Link href="/mock-exams" className="text-xs font-medium text-ink-violet dark:text-primary-400">
            {t("practice")}
          </Link>
        }
      />

      {sections === null ? (
        <div className="mt-4 flex justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {sections.map(({ section, percent, correct, total }) => (
            <div key={section}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{tTracks(section)}</span>
                <span className="text-muted">
                  {percent === null ? t("noData") : `${correct} / ${total} (${percent}%)`}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-none bg-surface-muted">
                <div
                  className={cn(
                    "h-full rounded-none transition-all duration-700",
                    percent === null
                      ? "w-0"
                      : percent >= 80
                        ? "bg-ink-violet"
                        : "bg-ink-violet",
                  )}
                  style={{ width: `${percent ?? 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
