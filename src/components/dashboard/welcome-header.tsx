"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { useAuthUser } from "@/hooks/use-auth-user";
import { formatRelativeTime } from "@/lib/format";

export function WelcomeHeader({ lastActiveAt }: { lastActiveAt: string | null }) {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const { user } = useAuthUser();
  const firstName = user?.displayName?.split(" ")[0] ?? "";

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const lastActiveLabel =
    formatRelativeTime(lastActiveAt, locale, now) ?? t("notStartedYet");

  return (
    <PageHeader
      eyebrow={t("eyebrow")}
      eyebrowIcon={LayoutDashboard}
      eyebrowTone="gold"
      title={`${t("welcome")} ${firstName}`}
      description={t("lastActive", { time: lastActiveLabel })}
    />
  );
}