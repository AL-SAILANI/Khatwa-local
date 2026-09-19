"use client";

import { useEffect } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { useRouter } from "@/i18n/navigation";

/** Like `AuthGuard`, but doesn't require `goal` to be set — used by the
 * onboarding flow itself, which is where `goal` gets set. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
