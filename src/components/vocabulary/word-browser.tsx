"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ListPlus, Plus, Search, SearchX, Star, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { useUserProfile } from "@/hooks/use-user-profile";
import {
  addWordToSet,
  createVocabSet,
  getAllVocabWords,
  getReviewStatesForUser,
  getVocabSetsForUser,
  removeWordFromSet,
  toggleBookmark,
} from "@/lib/firestore/vocabulary";
import { PronounceButton } from "@/components/vocabulary/pronounce-button";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { vocabAudioUrl } from "@/lib/vocab-audio";
import type { VocabReviewState, VocabSet, VocabWord } from "@/types/vocabulary";

export function WordBrowser() {
  const t = useTranslations("vocabulary");
  const { wordMeaning } = useLocalizedContent();
  const { user } = useUserProfile();
  const [words, setWords] = useState<VocabWord[] | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [reviewStates, setReviewStates] = useState<Map<string, VocabReviewState>>(new Map());
  const [now, setNow] = useState(0);
  const [sets, setSets] = useState<VocabSet[] | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const [newSetName, setNewSetName] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "easy" | "medium" | "hard">("all");

  useEffect(() => {
    getAllVocabWords().then(setWords);
  }, []);

  useEffect(() => {
    if (!user) return;
    getReviewStatesForUser(user.uid).then((states) => {
      setBookmarked(new Set(states.filter((s) => s.bookmarked).map((s) => s.wordId)));
      setReviewStates(new Map(states.map((s) => [s.wordId, s])));
      setNow(Date.now());
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    getVocabSetsForUser(user.uid).then(setSets);
  }, [user]);

  const filtered = useMemo(() => {
    if (!words) return [];
    const term = search.trim().toLowerCase();
    let list = words;
    if (levelFilter !== "all") list = list.filter((w) => w.level === levelFilter);
    if (!term) return list;
    return list.filter(
      (w) =>
        w.word.toLowerCase().includes(term) ||
        w.meaningAr.includes(term) ||
        (w.meaningEn?.toLowerCase().includes(term) ?? false),
    );
  }, [words, search, levelFilter]);

  const levelLabel = (level?: "easy" | "medium" | "hard") =>
    level === "easy" ? t("easy") : level === "medium" ? t("medium") : level === "hard" ? t("hard") : null;

  const statusFor = (wordId: string) => {
    const state = reviewStates.get(wordId);
    if (!state) return { label: t("statusNew"), className: "bg-surface-muted text-muted" };
    const days = Math.ceil((new Date(state.dueAt).getTime() - now) / 86_400_000);
    if (days <= 0) return { label: t("statusDue"), className: "bg-error/10 text-error-600 dark:text-error-300" };
    return { label: t("statusNext", { days }), className: "bg-success/10 text-success-600 dark:text-success-300" };
  };

  const handleToggleBookmark = async (wordId: string) => {
    if (!user) return;
    const nextValue = !bookmarked.has(wordId);
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (nextValue) next.add(wordId);
      else next.delete(wordId);
      return next;
    });
    await toggleBookmark(user.uid, wordId, nextValue);
  };

  const toggleWordInSet = async (setId: string, wordId: string) => {
    const set = sets?.find((s) => s.id === setId);
    if (!set) return;
    const isMember = set.wordIds.includes(wordId);
    setSets((prev) =>
      prev
        ? prev.map((s) =>
            s.id === setId
              ? {
                  ...s,
                  wordIds: isMember
                    ? s.wordIds.filter((w) => w !== wordId)
                    : [...s.wordIds, wordId],
                }
              : s,
          )
        : prev,
    );
    if (isMember) await removeWordFromSet(setId, wordId);
    else await addWordToSet(setId, wordId);
  };

  const handleCreateSet = async (wordId: string) => {
    if (!user || !newSetName.trim()) return;
    const name = newSetName.trim();
    const id = await createVocabSet(user.uid, name);
    await addWordToSet(id, wordId);
    setSets((prev) =>
      prev
        ? [
            { id, userId: user.uid, name, wordIds: [wordId], createdAt: new Date().toISOString() },
            ...prev,
          ]
        : [{ id, userId: user.uid, name, wordIds: [wordId], createdAt: new Date().toISOString() }],
    );
    setNewSetName("");
    setOpenMenuFor(null);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ps-9"
        />
      </div>

      <div className="flex gap-2" role="radiogroup" aria-label={t("filterLabel")}>
        {(["all", "easy", "medium", "hard"] as const).map((level) => (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={levelFilter === level}
            onClick={() => setLevelFilter(level)}
            className={cn(
              "rounded-none border px-3 py-1 text-sm transition-colors",
              levelFilter === level
                ? "border-primary-500 bg-primary-500 text-ink-violet"
                : "border-border hover:bg-surface-muted",
            )}
          >
            {level === "all" ? t("levelAll") : t(level)}
          </button>
        ))}
      </div>

      {words === null ? (
        <div className="flex justify-center py-8">
          <div className="size-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-12 text-center">
          <SearchX className="size-10 text-muted" />
          <div>
            <p className="text-sm font-semibold">{t("browseNoResults")}</p>
            <p className="mt-1 text-xs text-muted">{t("browseNoResultsHint")}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setSearch(""); setLevelFilter("all"); }}>
            {t("browseClearFilters")}
          </Button>
        </Card>
      ) : (
        <Card className="divide-y divide-border p-0">
          {filtered.map((word) => (
            <div key={word.id} className="flex items-center justify-between gap-4 p-4">
              <div>
                <span className="font-medium" dir="ltr">
                  {word.word}
                </span>
                <span className="ms-2 text-sm text-muted">{wordMeaning(word)}</span>
                {(() => {
                  const status = statusFor(word.id);
                  return (
                    <span
                      className={cn("ms-2 rounded-none px-2 py-0.5 text-xs font-medium", status.className)}
                      dir="ltr"
                    >
                      {status.label}
                    </span>
                  );
                })()}
                {word.level && (
                  <span
                    className={cn(
                      "ms-2 rounded-none px-2 py-0.5 text-xs font-medium",
                      word.level === "easy" && "bg-success/10 text-success-600 dark:text-success-300",
                      word.level === "medium" && "bg-warning/10 text-warning-600 dark:text-warning-300",
                      word.level === "hard" && "bg-error/10 text-error-600 dark:text-error-300",
                    )}
                    dir="ltr"
                  >
                    {levelLabel(word.level)}
                  </span>
                )}
              </div>
              <div className="relative flex shrink-0 items-center gap-1">
                <PronounceButton text={word.word} label={t("pronounceWord")} size="sm" audioSrc={vocabAudioUrl(word.word)} />
                <button
                  type="button"
                  onClick={() => setOpenMenuFor(openMenuFor === word.id ? null : word.id)}
                  aria-label={t("addToSet")}
                  aria-expanded={openMenuFor === word.id}
                  className="rounded-lg p-1.5 transition-colors hover:bg-surface-muted"
                >
                  {openMenuFor === word.id ? (
                    <X className="size-4 text-ink-violet dark:text-primary-300" />
                  ) : (
                    <ListPlus className="size-4 text-muted" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleBookmark(word.id)}
                  aria-label={bookmarked.has(word.id) ? t("removeBookmark") : t("bookmarkWord")}
                  aria-pressed={bookmarked.has(word.id)}
                  className="rounded-lg p-1.5 transition-colors hover:bg-surface-muted"
                >
                  <Star
                    className={cn(
                      "size-4",
                      bookmarked.has(word.id)
                        ? "fill-warning text-warning-600 dark:text-warning-400"
                        : "text-muted",
                    )}
                  />
                </button>

                {openMenuFor === word.id && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      aria-hidden="true"
                      onClick={() => setOpenMenuFor(null)}
                    />
                    <div className="absolute end-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface p-3">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted">{t("addToSet")}</p>

                        {sets === null ? (
                          <div className="flex justify-center py-3">
                            <div className="size-4 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
                          </div>
                        ) : sets.length === 0 ? (
                          <p className="text-xs text-muted">{t("addToSetEmpty")}</p>
                        ) : (
                          <ul className="max-h-40 space-y-1 overflow-y-auto">
                            {sets.map((set) => {
                              const isMember = set.wordIds.includes(word.id);
                              return (
                                <li key={set.id}>
                                  <button
                                    type="button"
                                    onClick={() => toggleWordInSet(set.id, word.id)}
                                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-start text-sm hover:bg-surface-muted"
                                  >
                                    <span className="truncate">{set.name}</span>
                                    {isMember ? (
                                      <Check className="size-4 shrink-0 text-ink-violet dark:text-primary-300" />
                                    ) : (
                                      <Plus className="size-4 shrink-0 text-muted" />
                                    )}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}

                        <div className="flex items-center gap-2 border-t border-border pt-2">
                          <Input
                            value={newSetName}
                            onChange={(e) => setNewSetName(e.target.value)}
                            placeholder={t("setsNamePlaceholder")}
                            className="h-9 px-3"
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleCreateSet(word.id)}
                            disabled={!newSetName.trim()}
                          >
                            {t("setsCreateButton")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
