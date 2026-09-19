"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/** The language this button switches *to*, not the current one. */
const OTHER_LOCALE_LABEL: Record<Locale, string> = {
  ar: "English",
  en: "العربية",
};

/** Phone-width form of the same thing. Full words made this button roughly
 * three times the width of the icon buttons beside it, which is a lot of a
 * 375px bar to spend on something used once. */
const OTHER_LOCALE_SHORT: Record<Locale, string> = {
  ar: "EN",
  en: "ع",
};

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const t = useTranslations("theme");
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      // Was a hardcoded English "Switch language", read out to Arabic screen
      // reader users too. Names the destination, since the compact label on
      // phones is only a fragment.
      aria-label={t("switchTo", { lang: OTHER_LOCALE_LABEL[locale] })}
      className="inline-flex h-9 min-w-9 items-center justify-center gap-1.5 rounded-none border border-border px-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary-500 hover:text-ink-violet sm:px-3 dark:hover:text-primary-300"
    >
      <Languages className="size-4 shrink-0" aria-hidden="true" />
      <span className="sm:hidden">{OTHER_LOCALE_SHORT[locale]}</span>
      <span className="hidden sm:inline">{OTHER_LOCALE_LABEL[locale]}</span>
    </button>
  );
}
