"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, BookOpen, BookMarked, Briefcase, Cpu, FlaskConical, FolderPlus, GraduationCap, HeartPulse, Landmark, Leaf, Library, MessagesSquare, PenLine, Sparkles, Trash2, Type, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { FlashcardSession } from "@/components/vocabulary/flashcard-session";
import { PronounceButton } from "@/components/vocabulary/pronounce-button";
import { useLocalizedContent } from "@/hooks/use-localized-content";
import { vocabAudioUrl } from "@/lib/vocab-audio";
import { useUserProfile } from "@/hooks/use-user-profile";
import { THEMATIC_SETS } from "@/data/thematic-sets";
import {
  createVocabSet,
  deleteVocabSet,
  getAllVocabWords,
  getVocabSetsForUser,
} from "@/lib/firestore/vocabulary";
import type { VocabSet, VocabWord } from "@/types/vocabulary";

/** lucide icon lookup keyed by the ThematicSet.icon name. */
const SET_ICONS: Record<string, LucideIcon> = {
  leaf: Leaf,
  "heart-pulse": HeartPulse,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "flask-conical": FlaskConical,
  cpu: Cpu,
  landmark: Landmark,
  "pen-line": PenLine,
  type: Type,
  "messages-square": MessagesSquare,
  "book-marked": BookMarked,
};

function setIcon(iconName: string): LucideIcon {
  return SET_ICONS[iconName] ?? Sparkles;
}

export function CustomSets() {
  const t = useTranslations("vocabulary");
  const locale = useLocale();
  const { wordMeaning } = useLocalizedContent();
  const { user } = useUserProfile();
  const [sets, setSets] = useState<VocabSet[] | null>(null);
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  /** Key of the open set: a thematic id (`set-…`) or a user set id. */
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([getVocabSetsForUser(user.uid), getAllVocabWords()]).then(([userSets, words]) => {
      setSets(userSets);
      setAllWords(words);
    });
  }, [user]);

  const openTheme = THEMATIC_SETS.find((s) => s.id === openKey) ?? null;
  const openUserSet = sets?.find((s) => s.id === openKey) ?? null;
  const openWordIds = new Set(openTheme?.wordIds ?? openUserSet?.wordIds ?? []);
  const openWords = allWords.filter((w) => openWordIds.has(w.id));
  const openName = openTheme
    ? (locale === "ar" ? openTheme.nameAr : openTheme.nameEn)
    : openUserSet?.name ?? "";

  const handleCreate = async () => {
    if (!user || !name.trim() || creating) return;
    setCreating(true);
    try {
      const id = await createVocabSet(user.uid, name.trim());
      const newSet: VocabSet = {
        id,
        userId: user.uid,
        name: name.trim(),
        wordIds: [],
        createdAt: new Date().toISOString(),
      };
      setSets((prev) => (prev ? [newSet, ...prev] : [newSet]));
      setName("");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (setId: string) => {
    const set = sets?.find((s) => s.id === setId);
    if (!window.confirm(t("setsDeleteConfirm", { name: set?.name ?? "" }))) return;
    await deleteVocabSet(setId);
    setSets((prev) => prev?.filter((s) => s.id !== setId) ?? null);
    if (openKey === setId) setOpenKey(null);
  };

  if (reviewing) {
    return (
      <FlashcardSession
        cards={openWords.map((word) => ({ word, isNew: false }))}
        context="sets"
        onExit={() => setReviewing(false)}
      />
    );
  }

  if (openTheme || openUserSet) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setOpenKey(null)}>
            <ArrowLeft className="size-4 rtl:rotate-180" />
            {t("setsBackToList")}
          </Button>
          {openTheme ? (
            <span className="inline-flex items-center gap-1.5 rounded-none bg-primary-50 px-2.5 py-1 text-xs font-medium text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
              <Sparkles className="size-3.5" />
              {t("setsCuratedBadge")}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => openUserSet && handleDelete(openUserSet.id)}
              aria-label={t("setsDelete")}
              className="rounded-lg p-1.5 transition-colors hover:bg-error/10"
            >
              <Trash2 className="size-4 text-error" />
            </button>
          )}
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            {openTheme && (() => {
              const Icon = setIcon(openTheme.icon);
              return <Icon className="size-5 text-secondary-500" />;
            })()}
            {openName}
          </h2>
          {openTheme && (
            <p className="mt-1 text-sm text-muted">{locale === "ar" ? openTheme.descriptionAr : openTheme.descriptionEn}</p>
          )}
          <p className="mt-1 text-sm text-muted">{t("setsWordCount", { count: openWords.length })}</p>
        </div>

        <Button className="w-full" onClick={() => setReviewing(true)} disabled={openWords.length === 0}>
          {t("setsReviewButton", { count: openWords.length })}
        </Button>

        {openWords.length === 0 ? (
          <Card className="text-center">
            <p className="text-sm text-muted">{t("setsEmptySet")}</p>
          </Card>
        ) : (
          <Card className="divide-y divide-border p-0">
            {openWords.map((word) => (
              <div key={word.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <span className="font-medium" dir="ltr">
                    {word.word}
                  </span>
                  <span className="ms-2 text-sm text-muted">{wordMeaning(word)}</span>
                </div>
                <PronounceButton text={word.word} label={t("pronounceWord")} size="sm" audioSrc={vocabAudioUrl(word.word)} />
              </div>
            ))}
          </Card>
        )}
      </div>
    );
  }

  if (sets === null) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("setsNamePlaceholder")}
        />
        <Button className="w-full" onClick={handleCreate} disabled={!name.trim() || creating} loading={creating}>
          <FolderPlus className="size-4" />
          {t("setsCreateButton")}
        </Button>
      </Card>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <Library className="size-4 text-ink-violet dark:text-primary-300" />
          {t("setsCuratedTitle")}
        </h3>
        <Card className="divide-y divide-border p-0">
          {THEMATIC_SETS.map((set) => {
            const Icon = setIcon(set.icon);
            const count = set.wordIds.filter((id) => allWords.some((w) => w.id === id)).length;
            return (
              <button
                key={set.id}
                type="button"
                onClick={() => setOpenKey(set.id)}
                className="flex w-full items-center gap-3 p-4 text-start hover:bg-surface-muted/60"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-50 text-ink-violet dark:bg-primary-500/10 dark:text-primary-300">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{locale === "ar" ? set.nameAr : set.nameEn}</span>
                  <span className="block truncate text-xs text-muted">
                    {locale === "ar" ? set.descriptionAr : set.descriptionEn}
                  </span>
                </span>
                <span className="ms-2 shrink-0 text-sm text-muted">{t("setsWordCount", { count })}</span>
              </button>
            );
          })}
        </Card>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground/80">
          <BookOpen className="size-4 text-ink-violet dark:text-primary-300" />
          {t("setsMyTitle")}
        </h3>
        {sets.length === 0 ? (
          <EmptyState
            icon={<FolderPlus className="size-7" />}
            title={t("setsEmpty")}
            description={t("setsEmptyDescription")}
          />
        ) : (
          <Card className="divide-y divide-border p-0">
            {sets.map((set) => {
              const count = allWords.filter((w) => set.wordIds.includes(w.id)).length;
              return (
                <div key={set.id} className="flex items-center justify-between gap-4 p-4">
                  <button
                    type="button"
                    onClick={() => setOpenKey(set.id)}
                    className="flex flex-1 items-center gap-2 rounded-lg py-1 text-start hover:text-ink-violet dark:hover:text-primary-300 dark:text-primary-300"
                  >
                    <BookOpen className="size-4 shrink-0 text-muted" />
                    <span className="font-medium">{set.name}</span>
                    <span className="ms-auto text-sm text-muted">{t("setsWordCount", { count })}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(set.id)}
                    aria-label={t("setsDelete")}
                    className="rounded-lg p-1.5 transition-colors hover:bg-error/10"
                  >
                    <Trash2 className="size-4 text-muted hover:text-error" />
                  </button>
                </div>
              );
            })}
          </Card>
        )}
      </section>
    </div>
  );
}