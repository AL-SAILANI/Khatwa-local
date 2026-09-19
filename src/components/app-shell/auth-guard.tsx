"use client";

import { useEffect } from "react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useRouter } from "@/i18n/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading } = useUserProfile();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (profile && profile.goal === null) {
      router.replace("/onboarding/goal");
    }
  }, [isLoading, user, profile, router]);

  if (isLoading || !user || (profile && profile.goal === null)) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
