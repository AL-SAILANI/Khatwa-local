"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  const t = useTranslations("errorBoundary");
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-md text-center p-8">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-error/10 text-error">
          <AlertTriangle className="size-7" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">{t("title")}</h2>
        <p className="mt-2 text-sm text-muted">{t("description")}</p>
        {error && (
          <details className="mt-4 text-left rounded-xl bg-surface-muted p-4 text-xs font-mono text-error/80">
            <summary className="cursor-pointer font-medium text-foreground mb-2">{t("details")}</summary>
            <pre className="whitespace-pre-wrap break-words">{error.message}</pre>
            {error.stack && <pre className="mt-2 whitespace-pre-wrap break-words text-muted/60">{error.stack}</pre>}
          </details>
        )}
        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={() => window.location.reload()} className="flex-1">
            <RefreshCw className="size-4 mr-2" />
            {t("reload")}
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
            <Home className="size-4 mr-2" />
            {t("goHome")}
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <p className="mt-4 text-xs text-muted">
            {t("devNote")} {error?.name}: {error?.message}
          </p>
        )}
      </Card>
    </div>
  );
}

export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error) => {
        if (typeof window !== "undefined" && (window as Window & { __NEXT_ERROR_REPORT?: (error: Error) => void }).__NEXT_ERROR_REPORT) {
          (window as Window & { __NEXT_ERROR_REPORT?: (error: Error) => void }).__NEXT_ERROR_REPORT!(error);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function ComponentErrorBoundary({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}