"use client";

import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { useTheme } from "./theme-provider";

export function NightShiftToggle() {
  const t = useTranslations("theme");
  const { nightShift, toggleNightShift } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleNightShift}
      aria-label={t("nightShift")}
      aria-pressed={nightShift}
      className="inline-flex size-9 items-center justify-center rounded-none border border-amber-500/50 bg-amber-50/60 text-amber-600 transition-colors hover:border-amber-500 hover:bg-amber-50 dark:border-amber-500/60 dark:bg-amber-500/15 dark:text-amber-400 data-[on=true]:border-amber-500 data-[on=true]:bg-amber-500 data-[on=true]:text-amber-950"
      data-on={nightShift}
    >
      <Eye className="size-4" />
    </button>
  );
}
