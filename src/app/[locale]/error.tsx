"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errorBoundary");
  const router = useRouter();

  useEffect(() => {
    console.error("Unhandled error in route segment:", error);
    if (typeof window !== "undefined" && (window as Window & { __NEXT_ERROR_REPORT?: (e: Error) => void }).__NEXT_ERROR_REPORT) {
      (window as Window & { __NEXT_ERROR_REPORT?: (e: Error) => void }).__NEXT_ERROR_REPORT!(error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center p-8">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="size-7" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        {process.env.NODE_ENV === "development" && error && (
          <details className="mt-4 text-left rounded-xl bg-surface-muted p-4 text-xs font-mono text-error/80">
            <summary className="cursor-pointer font-medium text-foreground mb-2">{t("details")}</summary>
            <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
            {error.stack && <pre className="mt-2 whitespace-pre-wrap break-words text-muted/60">{error.stack}</pre>}
          </details>
        )}
        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={() => unstable_retry()} className="flex-1">
            <RefreshCw className="size-4 mr-2" />
            {t("reload")}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
            <Home className="size-4 mr-2" />
            {t("goHome")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
