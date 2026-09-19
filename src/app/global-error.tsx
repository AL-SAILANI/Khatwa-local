"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error in root layout:", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-full items-center justify-center bg-background p-6 font-sans text-foreground antialiased">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
            <AlertTriangle className="size-7" />
          </div>
          <h2 className="mt-5 text-xl font-semibold">حدث خطأ ما</h2>
          <p className="mt-2 text-sm text-muted">
            واجه التطبيق مشكلة غير متوقعة. يمكنك المحاولة مرة أخرى.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-none bg-primary-500 px-8 text-base font-semibold text-ink-violet transition-all duration-200 hover:bg-primary-600 active:scale-[0.98]"
          >
            <RefreshCw className="size-4" />
            إعادة المحاولة
          </button>
        </div>
      </body>
    </html>
  );
}
