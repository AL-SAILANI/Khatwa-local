"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useIsAdmin } from "@/hooks/use-is-admin";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useRouter } from "@/i18n/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("admin");
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const { isAdmin, isLoading: isClaimLoading } = useIsAdmin();
  const router = useRouter();
  const isLoading = isAuthLoading || isClaimLoading;

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
    else if (!isAdmin) router.replace("/dashboard");
  }, [isLoading, user, isAdmin, router]);

  if (isLoading || !user || !isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center" role="status" aria-label={t("loading")}>
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
