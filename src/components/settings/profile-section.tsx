"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Check, Pencil, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input, Label, FieldError } from "@/components/ui/input";
import { AvatarPicker } from "@/components/avatar/avatar-picker";
import { Link } from "@/i18n/navigation";
import { updateUserProfile } from "@/lib/firestore/users";
import { syncPublicProfile } from "@/lib/firestore/public-profiles";
import { cn } from "@/lib/utils/cn";
import type { UserProfile } from "@/types/user";

export function ProfileSection({ profile }: { profile: UserProfile }) {
  const t = useTranslations("settings.profile");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string | null>(profile.avatarEmoji ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(profile.name);
  const [nameError, setNameError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);

  const startEditing = () => {
    setDraft(profile.avatarEmoji ?? null);
    setSaved(false);
    setEditing(true);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(profile.avatarEmoji ?? null);
    setSaved(false);
  };

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await updateUserProfile(profile.uid, { avatarEmoji: draft });
      await syncPublicProfile(profile.uid);
      setSaved(true);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const startEditingName = () => {
    setNameDraft(profile.name);
    setNameError(null);
    setSaved(false);
    setEditingName(true);
  };

  const cancelName = () => {
    setEditingName(false);
    setNameDraft(profile.name);
    setNameError(null);
    setSaved(false);
  };

  const saveName = async () => {
    const trimmed = nameDraft.trim();
    if (trimmed === "") {
      setNameError(t("errors.nameRequired"));
      return;
    }
    if (trimmed.length > 60) {
      setNameError(t("errors.nameTooLong"));
      return;
    }
    if (savingName) return;
    setSavingName(true);
    try {
      await updateUserProfile(profile.uid, { name: trimmed });
      await syncPublicProfile(profile.uid);
      setSaved(true);
      setEditingName(false);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <Card>
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={startEditing}
          aria-label={t("changeAvatar")}
          title={t("changeAvatar")}
          className="group relative shrink-0 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Avatar
            emoji={profile.avatarEmoji}
            photoURL={profile.photoURL}
            name={profile.name}
            className="size-16 text-3xl transition-transform duration-200 group-hover:scale-105"
          />
          <span className="absolute -bottom-1 -end-1 grid size-7 place-items-center rounded-full border border-border bg-surface text-muted transition-colors duration-200 group-hover:border-primary-400 group-hover:text-ink-violet dark:group-hover:text-primary-300 dark:text-primary-300">
            <Camera className="size-3.5" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          {editingName ? (
            <div className="space-y-2">
              <div>
                <Label htmlFor="profileName">{t("nameLabel")}</Label>
                <Input
                  id="profileName"
                  value={nameDraft}
                  maxLength={60}
                  onChange={(e) => {
                    setNameDraft(e.target.value);
                    setNameError(null);
                  }}
                  error={Boolean(nameError)}
                  aria-describedby="profileName-error"
                />
                <FieldError id="profileName-error">{nameError ?? undefined}</FieldError>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={saveName} loading={savingName}>
                  {t("nameSave")}
                </Button>
                <Button variant="ghost" size="sm" onClick={cancelName}>
                  {t("nameCancel")}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="truncate text-lg font-semibold tracking-tight">{profile.name}</span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="px-1.5 text-muted hover:text-ink-violet dark:hover:text-primary-300 dark:text-primary-300"
                  aria-label={t("changeName")}
                  title={t("changeName")}
                  onClick={startEditingName}
                >
                  <Pencil className="size-3.5" />
                </Button>
              </div>
              <div className="mt-0.5 text-sm text-muted" dir="ltr">
                {profile.email}
              </div>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-4 space-y-3 rounded-2xl border border-border bg-surface-muted/40 p-4">
          <div>
            <p className="text-sm font-semibold">{t("avatarLabel")}</p>
            <p className="mt-0.5 text-xs text-muted">{t("avatarHint")}</p>
          </div>
          <AvatarPicker value={draft} onChange={setDraft} />
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={cancel}>
              {t("avatarCancel")}
            </Button>
            <Button size="sm" onClick={save} loading={saving}>
              {t("avatarSave")}
            </Button>
          </div>
        </div>
      )}

      {saved && (
        <p className={cn("mt-3 flex items-center gap-1.5 text-xs font-medium text-success")}>
          <Check className="size-3.5" />
          {editingName ? t("nameSaved") : t("avatarSaved")}
        </p>
      )}

      <div className="mt-4 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted">{t("goalLabel")}</div>
            <div className="font-medium">{profile.goal ?? t("noValue")}</div>
          </div>
          <div>
            <div className="text-muted">{t("planLabel")}</div>
            <div className="font-medium">{profile.planTier === "free" ? t("freePlan") : profile.planTier}</div>
          </div>
        </div>

        <Button variant="warm" size="sm" asChild fullWidth className="mt-4">
          <Link href="/pricing">
            <Sparkles className="size-4" />
            {t("upgradePlan")}
          </Link>
        </Button>
      </div>
    </Card>
  );
}
