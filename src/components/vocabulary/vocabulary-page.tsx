"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BookMarked } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ReviewSession } from "@/components/vocabulary/review-session";
import { WordBrowser } from "@/components/vocabulary/word-browser";
import { FavoritesSession } from "@/components/vocabulary/favorites-session";
import { CustomSets } from "@/components/vocabulary/custom-sets";
import { cn } from "@/lib/utils/cn";

const TAB_KEYS = ["review", "browse", "favorites", "sets"] as const;

export function VocabularyPage() {
  const t = useTranslations("vocabulary");
  const [tab, setTab] = useState<(typeof TAB_KEYS)[number]>("review");

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6 lg:p-8">
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={BookMarked}
        title={t("pageTitle")}
        description={t("description")}
      />

      <div
        role="tablist"
        aria-label={t("tabs.label")}
        className="flex w-full max-w-full gap-1 overflow-x-auto rounded-none border border-border p-1"
      >
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "shrink-0 rounded-none px-4 py-1.5 text-sm font-medium transition-colors",
              tab === key ? "bg-primary-500 text-ink-violet" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {t(`tabs.${key}`)}
          </button>
        ))}
      </div>

      {tab === "review" ? (
        <ReviewSession />
      ) : tab === "browse" ? (
        <WordBrowser />
      ) : tab === "favorites" ? (
        <FavoritesSession />
      ) : (
        <CustomSets />
      )}
    </div>
  );
}
