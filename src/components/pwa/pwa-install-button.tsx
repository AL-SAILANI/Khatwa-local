"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

/** Always-visible install button for PWA. Shows in navbar when app is
 * installable. Persists across pages (unlike the dismissible card). */
export function PWAInstallButton() {
  const t = useTranslations("pwa");
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={promptInstall}
      className="flex items-center gap-2"
      aria-label={t("installButton")}
    >
      <Download className="size-4" />
      <span className="hidden sm:inline">{t("installButton")}</span>
    </Button>
  );
}
