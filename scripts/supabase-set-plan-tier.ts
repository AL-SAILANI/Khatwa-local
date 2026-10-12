/**
 * Sets a user's plan tier directly (admin grants, comp credits, fixes) without
 * touching Stripe. Supabase counterpart of scripts/set-plan-tier.ts.
 *
 *   node --env-file=.env.local --import tsx scripts/supabase-set-plan-tier.ts someone@example.com premium
 *   node --env-file=.env.local --import tsx scripts/supabase-set-plan-tier.ts someone@example.com premium --revoke
 *
 * `--revoke` resets the tier to `free`.
 */
import { createClient } from "@supabase/supabase-js";

const VALID_TIERS = ["free", "pro", "premium"] as const;
type Tier = (typeof VALID_TIERS)[number];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");
  const tier = (revoke ? "free" : (process.argv[3] ?? "free")) as Tier;

  if (!email) {
    console.error("Usage: supabase-set-plan-tier.ts <email> <free|pro|premium> [--revoke]");
    process.exit(1);
  }
  if (!VALID_TIERS.includes(tier)) {
    console.error(`Invalid tier: ${tier}. Must be one of ${VALID_TIERS.join(", ")}.`);
    process.exit(1);
  }

  const { data, error } = await supabase.from("profiles").update({ plan_tier: tier }).eq("email", email).select("uid");
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    console.error(`No profile found for ${email}.`);
    process.exit(1);
  }
  console.log(`Set ${email} (${data[0]!.uid}) to ${tier}.`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
