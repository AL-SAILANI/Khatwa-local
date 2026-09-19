"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarClock, CalendarPlus, CircleCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { chamferClipPath } from "@/lib/utils/chamfer";
import { updateUserProfile } from "@/lib/firestore/users";
import type { UserProfile } from "@/types/user";

const UNITS = ["days", "hours", "minutes", "seconds"] as const;
type Unit = (typeof UNITS)[number];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalDateString(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export function ExamCountdownCard({ profile }: { profile: UserProfile }) {
  const t = useTranslations("dashboard.examCountdown");
  const locale = useLocale();
  const [now, setNow] = useState<number>(() => Date.now());
  const [picking, setPicking] = useState(false);
  const [pickDate, setPickDate] = useState("");
  const [pickTime, setPickTime] = useState("00:00");

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const examDate = profile.examDate ?? null;
  const examStamp = examDate ? new Date(examDate.includes("T") ? examDate : `${examDate}T00:00:00`).getTime() : null;
  const target = examStamp;
  const diff = target !== null ? Math.max(0, target - now) : 0;
  const passed = target !== null && target <= now;

  const timeLeft: Record<Unit, number> = {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };

  const formattedDate = examStamp
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(examStamp))
    : null;

  const handlePick = async () => {
    if (!pickDate) return;
    try {
      await updateUserProfile(profile.uid, {
        examDate: `${pickDate}T${pickTime || "00:00"}`,
      });
    } finally {
      setPicking(false);
      setPickDate("");
    }
  };

  return (
    // Deep teal is the system's contrast-block colour, the same treatment the
    // landing page's CTA panel uses. This was still `bg-primary-900`, which
    // the palette swap turned from dark terracotta into mustard gold — white
    // text on it sat at roughly 2.3:1.
    <section
      className="relative overflow-hidden bg-deep-teal px-6 py-8 sm:px-8 sm:py-10"
      style={{ clipPath: chamferClipPath(32) }}
    >
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 text-base font-bold text-butter-yellow">
            <CalendarClock className="size-5" />
            {t("eyebrow")}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-cream-paper sm:text-4xl">
            {t("title")}
          </h2>
          {!examDate && <p className="mt-4 text-lg leading-relaxed text-cream-paper/75">{t("subtitle")}</p>}

          {formattedDate && (
            <p className="mt-3 text-sm text-cream-paper/70">
              {t("yourDate", { date: formattedDate })}
            </p>
          )}
        </div>

        {!target ? (
          <div className="flex max-w-md flex-col items-center gap-3 border border-cream-paper/20 bg-cream-paper/10 p-6 text-center sm:flex-row sm:text-start">
            <button
              type="button"
              onClick={() => setPicking((v) => !v)}
              aria-label={t("pickLabel")}
              aria-expanded={picking}
              title={t("pickLabel")}
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center bg-butter-yellow text-ink-violet transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-deep-teal"
            >
              <CalendarPlus className="size-7" />
            </button>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-base leading-relaxed text-cream-paper/75">{t("noDate")}</p>
              {picking && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor="exam-countdown-date">{t("dateLabel")}</label>
                  <input
                    id="exam-countdown-date"
                    type="date"
                    value={pickDate}
                    min={toLocalDateString(new Date())}
                    onChange={(e) => setPickDate(e.target.value)}
                    className="h-11 border border-cream-paper/25 bg-cream-paper/10 px-3 text-sm text-cream-paper outline-none [color-scheme:dark] focus:ring-2 focus:ring-butter-yellow"
                  />
                  <label className="sr-only" htmlFor="exam-countdown-time">{t("timeLabel")}</label>
                  <input
                    id="exam-countdown-time"
                    type="time"
                    value={pickTime}
                    onChange={(e) => setPickTime(e.target.value)}
                    className="h-11 border border-cream-paper/25 bg-cream-paper/10 px-3 text-sm text-cream-paper outline-none [color-scheme:dark] focus:ring-2 focus:ring-butter-yellow"
                  />
                  <button
                    type="button"
                    onClick={handlePick}
                    disabled={!pickDate}
                    className="h-11 bg-butter-yellow px-4 text-sm font-semibold text-ink-violet transition-colors duration-200 hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-butter-yellow disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("pickSave")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : passed ? (
          <div className="flex max-w-md flex-col items-center gap-3 border border-cream-paper/20 bg-cream-paper/10 p-6 text-center sm:flex-row sm:gap-4 sm:text-start">
            <CircleCheck className="size-8 shrink-0 text-butter-yellow" />
            <div>
              <p className="text-base font-semibold leading-relaxed text-cream-paper">{t("passed")}</p>
              {/* Was `/study-plan`, which has no page — only `new` and `path`
                  exist under it, so this 404'd. The label is "Review your
                  path", so `path` is the one it means. */}
              <Link
                href="/study-plan/path"
                className="mt-2 inline-flex items-center bg-butter-yellow px-4 py-1.5 text-sm font-semibold text-ink-violet transition-colors duration-200 hover:bg-primary-500"
              >
                {t("passedCta")}
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="grid w-full max-w-lg grid-cols-4 gap-2 sm:gap-4 lg:shrink-0"
            role="timer"
            aria-label={t("ariaLabel")}
          >
            {UNITS.map((unit) => (
              <div
                key={unit}
                className="min-w-0 border border-cream-paper/20 bg-cream-paper/10 px-1.5 py-4 text-center sm:px-2 sm:py-5"
              >
                <div className="text-xl font-extrabold text-butter-yellow tabular-nums md:text-2xl xl:text-3xl">
                  {pad(timeLeft[unit])}
                </div>
                <div className="mt-1.5 text-[11px] font-semibold text-cream-paper/75 sm:text-sm">
                  {t(`units.${unit}`)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}