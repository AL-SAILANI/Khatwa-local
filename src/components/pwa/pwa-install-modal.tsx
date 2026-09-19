"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

export interface PWAInstallModalHandle {
  open: () => void;
}

/** Install dialog opened on demand from the nav menu. It does not pop up by
 * itself: `InstallPrompt` in the root layout already handles the automatic
 * bottom-card offer, and two self-opening offers for the same action is one
 * too many. Renders nothing when the browser reports the app isn't
 * installable (already installed, or unsupported). */
export const PWAInstallModal = forwardRef<PWAInstallModalHandle>(function PWAInstallModal(_, ref) {
  const t = useTranslations("pwa");
  const { canInstall, promptInstall } = useInstallPrompt();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));

  if (!canInstall) return null;

  const install = async () => {
    await promptInstall();
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        // native <dialog> counts backdrop clicks as clicks on itself
        if (e.target === dialogRef.current) dialogRef.current.close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground backdrop:bg-ink-violet/50"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          <Download className="size-6" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">{t("installTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t("installDescription")}</p>
        </div>

        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label={t("dismissAria")}
          className="shrink-0 rounded-none p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="secondary" onClick={() => dialogRef.current?.close()} className="flex-1">
          {t("dismissButton")}
        </Button>
        <Button variant="primary" onClick={install} className="flex-1">
          {t("installButton")}
        </Button>
      </div>
    </dialog>
  );
});
