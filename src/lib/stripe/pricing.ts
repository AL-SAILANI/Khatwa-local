export type PaidTier = "pro" | "premium";
export type BillingPeriod = "monthly" | "yearly";

export interface PricingTier {
  tier: "free" | PaidTier;
  name: string;
  priceLabel: string;
  yearlyPriceLabel: string;
  description: string;
  features: string[];
  /** Env var name holding this tier's Stripe Price ID — looked up at
   * checkout time, not baked in here, so tiers can be re-priced without a
   * code change. `null` for the free tier, which never hits Stripe. */
  priceEnvVar: "STRIPE_PRICE_ID_PRO" | "STRIPE_PRICE_ID_PREMIUM" | null;
}

const TIER_KEYS = ["free", "pro", "premium"] as const;

/** Static, locale-independent config — safe to import from the server-side
 * checkout route, which only needs the env var lookup, not display copy. */
export const PRICE_ENV_VARS: Record<(typeof TIER_KEYS)[number], PricingTier["priceEnvVar"]> = {
  free: null,
  pro: "STRIPE_PRICE_ID_PRO",
  premium: "STRIPE_PRICE_ID_PREMIUM",
};

/** Yearly billing uses a separate set of Price IDs so Stripe can apply the
 * annual discount automatically. Falls back to the monthly ID when a yearly
 * one isn't configured, so the toggle degrades gracefully. */
export const YEARLY_PRICE_ENV_VARS: Record<PaidTier, "STRIPE_PRICE_ID_PRO_YEARLY" | "STRIPE_PRICE_ID_PREMIUM_YEARLY"> = {
  pro: "STRIPE_PRICE_ID_PRO_YEARLY",
  premium: "STRIPE_PRICE_ID_PREMIUM_YEARLY",
};

/** Display copy (name/price/description/features) lives in
 * `messages/*.json` under `pricing.tiers.*` — built per-locale by the
 * pricing page via `useTranslations`, rather than hardcoded here. */
export function getPricingTiers(
  t: (key: string) => string,
  tRaw: (key: string) => unknown,
): PricingTier[] {
  return TIER_KEYS.map((tier) => ({
    tier,
    name: t(`tiers.${tier}.name`),
    priceLabel: t(`tiers.${tier}.priceLabel`),
    yearlyPriceLabel: t(`tiers.${tier}.yearlyPriceLabel`),
    description: t(`tiers.${tier}.description`),
    features: tRaw(`tiers.${tier}.features`) as string[],
    priceEnvVar: PRICE_ENV_VARS[tier],
  }));
}

/** Validates that `tier` is one of the known paid tiers and looks up its
 * Stripe Price ID env var — used by the checkout route, which has no i18n
 * context and doesn't need display copy. */
export function getPaidTierPriceEnvVar(
  tier: string | undefined,
  billingPeriod: BillingPeriod = "monthly",
): PricingTier["priceEnvVar"] | (typeof YEARLY_PRICE_ENV_VARS)[PaidTier] | undefined {
  if (tier !== "pro" && tier !== "premium") return undefined;
  return billingPeriod === "yearly" ? YEARLY_PRICE_ENV_VARS[tier] : PRICE_ENV_VARS[tier];
}
