"use client";

import { useTranslations } from "next-intl";
import { Download, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

export function InstallAppSection() {
  const t = useTranslations("settings.installApp");
  const tPwa = useTranslations("pwa");
  const { canInstall, isIOS, isStandalone, promptInstall } = useInstallPrompt();

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
        <Smartphone className="size-5" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{t("title")}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{t("description")}</p>
      </div>

      {/* "Installed" must key off `isStandalone`, not `!canInstall`: the latter
          is also false on iOS, after a dismissal, and on browsers with no
          install support, which used to tell those users the app was already
          installed when it wasn't. */}
      {isStandalone ? (
        <span className="shrink-0 rounded-none bg-surface-muted px-3 py-1 text-xs font-medium text-foreground/70">
          {t("installed")}
        </span>
      ) : canInstall ? (
        <Button variant="primary" size="sm" className="shrink-0" onClick={promptInstall}>
          <Download className="size-4" aria-hidden="true" />
          {t("install")}
        </Button>
      ) : isIOS ? (
        <span className="shrink-0 text-end text-xs leading-relaxed text-muted">
          {tPwa("iosStep1")}
          <br />
          {tPwa("iosStep2")}
        </span>
      ) : null}
    </Card>
  );
}
