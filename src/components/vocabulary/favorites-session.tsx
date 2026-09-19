"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardSession } from "@/components/vocabulary/flashcard-session";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getAllVocabWords, getReviewStatesForUser, toggleBookmark } from "@/lib/firestore/vocabulary";
import type { VocabWord } from "@/types/vocabulary";
import { cn } from "@/lib/utils/cn";

export function FavoritesSession() {
  const t = useTranslations("vocabulary");
  const { wordMeaning } = useLocalizedContent();
  const { user } = useUserProfile();
  const [favorites, setFavorites] = useState<VocabWord[] | null>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([getAllVocabWords(), getReviewStatesForUser(user.uid)]).then(([allWords, states]) => {
      const favIds = new Set(states.filter((s) => s.bookmarked).map((s) => s.wordId));
      setFavorites(allWords.filter((w) => favIds.has(w.id)));
    });
  }, [user]);

  const startReview = () => {
    if (!favorites || favorites.length === 0) return;
    setReviewing(true);
  };

  const handleToggleBookmark = async (wordId: string) => {
    if (!user || !favorites) return;
    const wasFavorite = favorites.some((w) => w.id === wordId);
    await toggleBookmark(user.uid, wordId, !wasFavorite);
    setFavorites((prev) =>
      prev ? (wasFavorite ? prev.filter((w) => w.id !== wordId) : [...prev]) : prev,
    );
  };

  if (reviewing && favorites) {
    return (
      <FlashcardSession
        cards={favorites.map((word) => ({ word, isNew: false }))}
        context="favorites"
        onExit={() => setReviewing(false)}
      />
    );
  }

  if (favorites === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={<Star className="size-7" />}
        title={t("favoritesEmpty")}
        description={t("favoritesEmptyDescription")}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Button className="w-full" onClick={startReview}>
        {t("favoritesStartReview", { count: favorites.length })}
      </Button>

      <Card className="divide-y divide-border p-0">
        {favorites.map((word) => (
          <div key={word.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <span className="font-medium" dir="ltr">
                {word.word}
              </span>
              <span className="ms-2 text-sm text-muted">{wordMeaning(word)}</span>
            </div>
            <button type="button" onClick={() => handleToggleBookmark(word.id)} aria-label={t("removeFavorite")}>
              <Star className={cn("size-4 fill-warning text-warning")} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}