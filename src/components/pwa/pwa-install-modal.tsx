"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/use-install-prompt";

const MODAL_DISMISSED_KEY = "khatwa:pwa-modal-dismissed";

/** Auto-show PWA install modal on home page. Appears once per visit
 * (dismissed by localStorage), not on subsequent page navigations. */
export function PWAInstallModal() {
  const t = useTranslations("pwa");
  const { canInstall, promptInstall } = useInstallPrompt();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!canInstall || !dialogRef.current) return;

    // Check if already dismissed this session
    const isDismissed = sessionStorage.getItem(MODAL_DISMISSED_KEY) === "1";
    if (isDismissed) return;

    // Auto-show the modal
    setTimeout(() => {
      dialogRef.current?.showModal();
    }, 500); // Small delay so page transition feels smooth
  }, [canInstall]);

  const handleInstall = async () => {
    await promptInstall();
    dialogRef.current?.close();
    sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
  };

  const handleDismiss = () => {
    dialogRef.current?.close();
    sessionStorage.setItem(MODAL_DISMISSED_KEY, "1");
  };

  if (!canInstall) return null;

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl border border-border bg-surface p-6 backdrop:bg-black/50 sm:max-w-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-butter-yellow text-ink-violet">
            <Download className="size-6" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold">{t("installTitle")}</h2>
            <p className="mt-1 text-sm text-muted">{t("installDescription")}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-none p-1 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
          aria-label={t("dismissAria")}
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="mt-6 flex gap-2">
        <Button variant="secondary" onClick={handleDismiss} className="flex-1">
          {t("dismissButton") || "Later"}
        </Button>
        <Button variant="primary" onClick={handleInstall} className="flex-1">
          {t("installButton")}
        </Button>
      </div>
    </dialog>
  );
}
