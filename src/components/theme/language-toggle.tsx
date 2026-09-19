"use client";

import { useLocale } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

const OTHER_LOCALE_LABEL: Record<Locale, string> = {
  ar: "English",
  en: "العربية",
};

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label="Switch language"
      className="inline-flex h-9 items-center gap-1.5 rounded-none border border-border px-3 text-sm font-medium text-foreground/70 transition-colors hover:border-primary-500 hover:text-ink-violet dark:hover:text-primary-300"
    >
      <Languages className="size-4" />
      {OTHER_LOCALE_LABEL[locale]}
    </button>
  );
}
