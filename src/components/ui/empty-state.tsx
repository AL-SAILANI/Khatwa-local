"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "outline" | "ghost";
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-center text-center py-12", className)}>
      {icon && (
        <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-butter-yellow text-ink-violet mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-semibold transition-all duration-200 focus-visible:outline-none",
                "h-13 px-8 text-base",
                action.variant === "primary"
                  ? "bg-butter-yellow text-ink-violet border border-secondary-600 shadow-hard hover:bg-primary-500"
                  : action.variant === "outline"
                  ? "border-2 border-border bg-transparent text-foreground hover:border-primary-500 hover:text-ink-violet hover:bg-primary-50 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
                  : "bg-transparent text-foreground hover:bg-surface-muted",
              )}
            >
              {action.label}
            </Link>
          ) : (
            <Button
              variant={action.variant ?? "primary"}
              size="lg"
              className="mt-6"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </>
      )}
    </Card>
  );
}

/** Pre-configured empty states for common scenarios */
export function createEmptyStates(t: ReturnType<typeof useTranslations>) {
  return {
    noTests: {
      title: t("noTests.title"),
      description: t("noTests.description"),
      action: { label: t("noTests.action"), href: "/placement-test" },
    },
    noCourses: {
      title: t("noCourses.title"),
      description: t("noCourses.description"),
      action: { label: t("noCourses.action"), href: "/courses" },
    },
    noVocabulary: {
      title: t("noVocabulary.title"),
      description: t("noVocabulary.description"),
      action: { label: t("noVocabulary.action"), href: "/vocabulary" },
    },
    noAchievements: {
      title: t("noAchievements.title"),
      description: t("noAchievements.description"),
      action: { label: t("noAchievements.action"), href: "/achievements" },
    },
    noLeaderboardData: {
      title: t("noLeaderboardData.title"),
      description: t("noLeaderboardData.description"),
    },
    noExamHistory: {
      title: t("noExamHistory.title"),
      description: t("noExamHistory.description"),
      action: { label: t("noExamHistory.action"), href: "/mock-exams" },
    },
    noStudyPlan: {
      title: t("noStudyPlan.title"),
      description: t("noStudyPlan.description"),
      action: { label: t("noStudyPlan.action"), href: "/study-plan/new" },
    },
    generic: {
      title: t("generic.title"),
      description: t("generic.description"),
    },
  };
}

export function LoadingState({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div className={cn("flex items-center justify-center py-8", className)}>
      <div className={cn("animate-spin rounded-full border-2 border-primary-500 border-t-transparent", sizes[size])} />
    </div>
  );
}

export function Skeleton({ className, lines = 3, variant = "text" }: { className?: string; lines?: number; variant?: "text" | "card" | "avatar" }) {
  if (variant === "avatar") {
    return (
      <div className={cn("animate-pulse rounded-full bg-surface-muted", className)} />
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("animate-pulse rounded-2xl bg-surface-muted p-6", className)}>
        <div className="h-6 w-3/4 bg-surface-muted rounded mb-4" />
        <div className="h-4 w-1/2 bg-surface-muted rounded" />
        <div className="h-4 w-3/4 bg-surface-muted rounded mt-2" />
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-surface-muted rounded" style={{ width: i === lines - 1 ? "60%" : "100%" }} />
      ))}
    </div>
  );
}