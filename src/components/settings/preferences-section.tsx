"use client";

import { useState } from "react";
import { Moon, Sun, Bell, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/components/theme/theme-provider";
import { useUserProfile } from "@/hooks/use-user-profile";
import { updateUserProfile, addFcmToken } from "@/lib/firestore/users";
import { requestPushToken } from "@/lib/firebase/messaging";
import { cn } from "@/lib/utils/cn";

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <Icon className="size-5 shrink-0 text-ink-violet dark:text-primary-300" />
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted">{description}</div>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary-500" : "bg-surface-muted",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
            checked ? "translate-x-0.5" : "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

export function PreferencesSection() {
  const t = useTranslations("settings.preferences");
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useUserProfile();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notificationsEnabled ?? true);

  const handleNotificationsChange = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (!user) return;
    await updateUserProfile(user.uid, { notificationsEnabled: value });
    if (value) {
      const token = await requestPushToken();
      if (token) await addFcmToken(user.uid, token);
    }
  };

  const switchLocale = (nextLocale: "ar" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Card className="divide-y divide-border">
      <ToggleRow
        icon={theme === "dark" ? Sun : Moon}
        label={t("darkMode")}
        description={t("darkModeDescription")}
        checked={theme === "dark"}
        onChange={toggleTheme}
      />

      <ToggleRow
        icon={Bell}
        label={t("notifications")}
        description={t("notificationsDescription")}
        checked={notificationsEnabled}
        onChange={handleNotificationsChange}
      />

      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Globe className="size-5 shrink-0 text-ink-violet dark:text-primary-300" />
          <div className="text-sm font-medium">{t("language")}</div>
        </div>
        <div className="inline-flex rounded-none border border-border p-1" role="radiogroup" aria-label={t("language")}>
          <button
            type="button"
            role="radio"
            aria-checked={locale === "ar"}
            onClick={() => switchLocale("ar")}
            className={cn(
              "rounded-none px-3 py-1 text-xs font-medium",
              locale === "ar" ? "bg-primary-500 text-ink-violet" : "text-foreground/70",
            )}
          >
            العربية
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={locale === "en"}
            onClick={() => switchLocale("en")}
            className={cn(
              "rounded-none px-3 py-1 text-xs font-medium",
              locale === "en" ? "bg-primary-500 text-ink-violet" : "text-foreground/70",
            )}
          >
            English
          </button>
        </div>
      </div>
    </Card>
  );
}
