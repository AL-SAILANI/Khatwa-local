"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Link } from "@/i18n/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { auth } from "@/lib/firebase/client";
import { getPricingTiers, type BillingPeriod, type PaidTier } from "@/lib/stripe/pricing";
import { cn } from "@/lib/utils/cn";

export function PricingPage({ embedded = false }: { embedded?: boolean }) {
  const t = useTranslations("pricing");
  const { user, profile } = useUserProfile();
  const [loadingTier, setLoadingTier] = useState<PaidTier | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");

  const tiers = getPricingTiers(t, t.raw);

  const handleUpgrade = async (tier: PaidTier) => {
    if (!user) return;
    setError(null);
    setLoadingTier(tier);
    try {
      const idToken = await auth.currentUser?.getIdToken();
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, idToken, billingPeriod }),
      });
      if (!response.ok) {
        setError(t("checkoutStartFailed"));
        return;
      }
      const data = await response.json();
      window.location.assign(data.url);
    } catch {
      setError(t("connectionFailed"));
    } finally {
      setLoadingTier(null);
    }
  };

  const Heading = embedded ? "h2" : "h1";

  return (
    <Section id="pricing" className={embedded ? "scroll-mt-24 py-20" : "py-16"} data-anchor>
      <Container className="max-w-5xl">
        <div className="text-center">
          <Heading className="text-3xl font-bold">{t("title")}</Heading>
          <p className="mt-2 text-muted">{t("subtitle")}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={cn("text-base font-semibold", billingPeriod === "monthly" ? "text-ink-violet dark:text-primary-300" : "text-foreground/60")}>
            {t("monthly")}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={billingPeriod === "yearly"}
            aria-label={t("billingToggle")}
            onClick={() => setBillingPeriod((period) => (period === "monthly" ? "yearly" : "monthly"))}
            className={cn(
              "relative h-7 w-14 shrink-0 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
              billingPeriod === "yearly" ? "bg-secondary-500" : "bg-border",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-6 rounded-full border border-border bg-cream-paper transition-all duration-200",
                billingPeriod === "yearly" ? "start-[calc(100%-1.625rem)]" : "start-0.5",
              )}
            />
          </button>
          <span className={cn("text-base font-semibold", billingPeriod === "yearly" ? "text-ink-violet dark:text-primary-300" : "text-foreground/60")}>
            {t("yearly")}
            <span className="ms-1.5 inline-flex items-center gap-1 rounded-none border border-secondary-600 bg-butter-yellow px-2 py-0.5 text-xs font-bold text-ink-violet">
              <Zap className="size-3" />
              {t("save")}
            </span>
          </span>
        </div>

        {error && (
          <p className="mt-6 rounded-xl bg-error/10 p-3 text-center text-sm text-error">{error}</p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((plan) => {
            const isCurrent = profile?.planTier === plan.tier;
            const priceLabel =
              plan.tier !== "free" && billingPeriod === "yearly" ? plan.yearlyPriceLabel : plan.priceLabel;
            return (
              <Card
                key={plan.tier}
                className={cn(
                  "flex flex-col gap-4",
                  plan.tier === "pro" && "border-primary-500 ring-1 ring-primary-500",
                )}
              >
                <div>
                  <h2 className="text-lg font-bold">{plan.name}</h2>
                  <p className="mt-1 text-sm text-muted">{plan.description}</p>
                  <p className="mt-4 text-2xl font-bold">{priceLabel}</p>
                </div>

                <ul className="flex-1 space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-ink-violet dark:text-primary-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.tier === "free" ? (
                  <Button variant="outline" disabled className="w-full">
                    {isCurrent ? t("currentPlan") : t("freeForEveryone")}
                  </Button>
                ) : !user ? (
                  <Button asChild variant={plan.tier === "pro" ? "primary" : "outline"} className="w-full">
                    <Link href="/register">{t("createAccountFirst")}</Link>
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={isCurrent || loadingTier !== null}
                    onClick={() => handleUpgrade(plan.tier as PaidTier)}
                  >
                    {isCurrent ? t("currentPlan") : loadingTier === plan.tier ? t("redirecting") : t("subscribeNow")}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
