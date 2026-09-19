"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

/** Navbar install button, desktop only: from `lg` down the hamburger menu
 * carries its own install entry, and showing both side by side would offer
 * the same action twice on one screen. */
export function PWAInstallButton() {
  const t = useTranslations("pwa");
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <Button
      variant="primary"
      size="sm"
      onClick={promptInstall}
      className="hidden items-center gap-2 lg:flex"
      aria-label={t("installButton")}
    >
      <Download className="size-4" />
      {t("installButton")}
    </Button>
  );
}
