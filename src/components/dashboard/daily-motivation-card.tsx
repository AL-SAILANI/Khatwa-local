"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

const TOTAL = 30;

function dayOfPhrase(now = new Date()) {
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const day = Math.floor(diff / 86_400_000);
  return day % TOTAL;
}

export function DailyMotivationCard() {
  const t = useTranslations("dashboard.dailyMotivation");
  const phrases = t.raw("phrases") as string[];
  const phrase = phrases[dayOfPhrase()] ?? phrases[0] ?? "";

  // The `dark:from-/via-/to-` stops that used to be on this card had no
  // `bg-gradient-to-*` left to activate them, so they painted nothing.
  return (
    <Card className="relative overflow-hidden border-primary-200/60 bg-surface p-6 dark:border-primary-500/20">
      <div className="relative flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet">
          <Quote className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {/* The background stayed `primary-100` in dark mode while the text
                flipped to amber-400 — light-on-light at about 1.6:1. Both now
                shift together. */}
            <span className="inline-flex items-center rounded-none bg-primary-100 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-300">
              {t("label")}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <span
              aria-hidden
              className="select-none font-serif text-4xl font-bold leading-none text-ink-violet/40 dark:text-primary-300/30"
            >
              &ldquo;
            </span>
            <p className="text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
              {phrase}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
