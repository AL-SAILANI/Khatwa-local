"use client";

import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NightShiftToggle } from "@/components/theme/night-shift-toggle";
import { LanguageToggle } from "@/components/theme/language-toggle";
import { UserMenu } from "@/components/app-shell/user-menu";
import { useUserProfile } from "@/hooks/use-user-profile";

/** Rendered once in the `(app)` layout, so every app page gets it — not
 * passed a `streak` prop from each page, which is how it ended up only on
 * the dashboard before. */
export function Topbar() {
  const t = useTranslations("topbar");
  const { profile } = useUserProfile();
  const streak = profile?.streak ?? 0;

  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
        <Flame className="size-4 shrink-0 fill-current" />
        <span className="truncate">{t("streakDay", { count: streak })}</span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        <LanguageToggle />
        <NightShiftToggle />
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
