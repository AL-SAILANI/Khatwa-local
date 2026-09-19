"use client";

import { useTranslations } from "next-intl";
import { useUserProfile } from "@/hooks/use-user-profile";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileSection } from "@/components/settings/profile-section";
import { ExamDateSection } from "@/components/settings/exam-date-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { InstallAppSection } from "@/components/settings/install-app-section";
import { DeleteAccountSection } from "@/components/settings/delete-account-section";

export function SettingsPage() {
  const t = useTranslations("settings");
  const { profile } = useUserProfile();

  if (!profile) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-label={t("loading")}>
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-6 lg:p-8">
      <PageHeader eyebrow={t("eyebrow")} title={t("pageTitle")} />

      <ProfileSection profile={profile} />
      <ExamDateSection profile={profile} />
      <PreferencesSection />
      <InstallAppSection />
      <ChangePasswordForm />
      <DeleteAccountSection />
    </div>
  );
}
