"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const t = useTranslations("theme");
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("toggleTheme")}
      className="inline-flex size-9 items-center justify-center rounded-none border border-border text-foreground/70 transition-colors hover:border-primary-500 hover:text-ink-violet dark:hover:text-primary-300"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
