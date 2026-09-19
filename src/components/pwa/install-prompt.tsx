"use client";

import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

/** Dismissible "install app" card driven by the native `beforeinstallprompt`
 *  event. SSR-safe: all browser APIs are touched inside the hook only, and
 *  the card stays hidden until the browser reports the app is installable.
 *  Dismissal is remembered in localStorage so it doesn't re-appear on every
 *  page navigation. */
export function InstallPrompt() {
  const t = useTranslations("pwa");
  const { canInstall, promptInstall, dismiss } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4" role="region" aria-live="polite">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          <Download className="size-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{t("installTitle")}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{t("installDescription")}</p>
        </div>

        <Button variant="primary" size="sm" className="shrink-0" onClick={promptInstall}>
          {t("installButton")}
        </Button>

        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-none p-1.5 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          aria-label={t("dismissAria")}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}