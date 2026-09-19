"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";
import { listAllUsers, updateUserProfile } from "@/lib/firestore/users";
import type { UserProfile } from "@/types/user";

const TIERS = ["free", "pro", "premium"] as const;

export function AdminUsers() {
  const t = useTranslations("admin.users");
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    listAllUsers(50).then(setUsers);
  }, []);

  const handleTierChange = async (uid: string, tier: (typeof TIERS)[number]) => {
    setUsers((prev) => prev?.map((u) => (u.uid === uid ? { ...u, planTier: tier } : u)) ?? null);
    await updateUserProfile(uid, { planTier: tier });
  };

  return (
    <Container className="max-w-6xl py-8">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted">{t("description")}</p>

      {users === null ? (
        <div className="flex justify-center py-12" role="status" aria-label={t("loading")}>
          <div className="size-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        </div>
      ) : (
        <Card className="mt-6 divide-y divide-border p-0">
          {users.map((user) => (
            <div key={user.uid} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted" dir="ltr">
                  {user.email}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
                <span>{t("xp", { xp: user.xp })}</span>
                <span>{t("testsTaken", { count: user.testsTaken })}</span>
                <div className="inline-flex rounded-none border border-border p-1" role="radiogroup" aria-label={t("tierLabel", { name: user.name })}>
                  {TIERS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      role="radio"
                      aria-checked={user.planTier === tier}
                      onClick={() => handleTierChange(user.uid, tier)}
                      className={cn(
                        "rounded-none px-2.5 py-1 font-medium",
                        user.planTier === tier ? "bg-primary-500 text-ink-violet" : "text-foreground/70",
                      )}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </Container>
  );
}
