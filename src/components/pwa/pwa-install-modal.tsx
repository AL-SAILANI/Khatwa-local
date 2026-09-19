"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useTranslations } from "next-intl";
import { Download, Plus, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

export interface PWAInstallModalHandle {
  open: () => void;
}

/** Install dialog opened on demand from the nav menu. It does not pop up by
 * itself: `InstallPrompt` in the root layout already handles the automatic
 * bottom-card offer.
 *
 * Two modes, because the platforms differ: Android and desktop get a real
 * install button driven by `beforeinstallprompt`, while iOS — where Safari
 * never fires that event — gets the manual Share-sheet steps instead. */
export const PWAInstallModal = forwardRef<PWAInstallModalHandle>(function PWAInstallModal(_, ref) {
  const t = useTranslations("pwa");
  const { installAvailable, isIOS, promptInstall } = useInstallPrompt();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }));

  if (!installAvailable) return null;

  const close = () => dialogRef.current?.close();

  const install = async () => {
    await promptInstall();
    close();
  };

  const steps = [
    { icon: Share, text: t("iosStep1") },
    { icon: Plus, text: t("iosStep2") },
    { icon: Download, text: t("iosStep3") },
  ];

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        // native <dialog> counts backdrop clicks as clicks on itself
        if (e.target === dialogRef.current) close();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground backdrop:bg-ink-violet/50"
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
          <Download className="size-6" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">{isIOS ? t("iosTitle") : t("installTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {isIOS ? t("iosNote") : t("installDescription")}
          </p>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label={t("dismissAria")}
          className="shrink-0 rounded-none p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {isIOS ? (
        <>
          <ol className="mt-5 space-y-3">
            {steps.map(({ icon: Icon, text }, i) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xs font-bold text-ink-violet dark:text-primary-300">
                  {i + 1}
                </span>
                <Icon className="size-4 shrink-0 text-muted" aria-hidden="true" />
                <span className="text-sm">{text}</span>
              </li>
            ))}
          </ol>

          <Button variant="primary" onClick={close} className="mt-6 w-full">
            {t("iosDone")}
          </Button>
        </>
      ) : (
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" onClick={close} className="flex-1">
            {t("dismissButton")}
          </Button>
          <Button variant="primary" onClick={install} className="flex-1">
            {t("installButton")}
          </Button>
        </div>
      )}
    </dialog>
  );
});
