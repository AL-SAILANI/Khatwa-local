import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { adminAuth } from "@/lib/firebase/admin";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { getStripeClient } from "@/lib/stripe/server";
import { getPaidTierPriceEnvVar, type BillingPeriod, type PaidTier } from "@/lib/stripe/pricing";

/** Creates a Stripe Checkout session for the signed-in user to subscribe to
 * `pro` or `premium`. The client sends its Firebase ID token rather than a
 * bare uid, so a request can't be forged to upgrade someone else's account.
 * Returns 503 (not 500) when Stripe isn't configured yet — this is the
 * expected state until the project owner adds their own Stripe keys, not a
 * server error. Error strings here are for logs/devtools, not shown to the
 * user directly — the pricing page always renders its own localized
 * fallback message instead, since this route has no request-locale context. */
export async function POST(request: Request) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: "Subscriptions are not enabled yet — no Stripe account is connected." }, { status: 503 });
  }

  const { tier, idToken, billingPeriod } = (await request.json()) as {
    tier?: PaidTier;
    idToken?: string;
    billingPeriod?: BillingPeriod;
  };
  if (!idToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const period = billingPeriod === "yearly" ? "yearly" : "monthly";
  const priceEnvVar = getPaidTierPriceEnvVar(tier, period);
  if (!priceEnvVar) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId = process.env[priceEnvVar];
  if (!priceId) {
    return NextResponse.json({ error: `Price ID not configured for this plan (${priceEnvVar}).` }, { status: 503 });
  }

  let identity: { uid: string; email?: string };
  try {
    if (useSupabaseUsers) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.auth.getUser(idToken);
      if (error || !data.user) throw error ?? new Error("no user");
      identity = { uid: data.user.id, email: data.user.email };
    } else {
      const decoded = await adminAuth.verifyIdToken(idToken);
      identity = { uid: decoded.uid, email: decoded.email };
    }
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: identity.uid,
    customer_email: identity.email,
    metadata: { uid: identity.uid, tier: tier as PaidTier, billingPeriod: period },
    subscription_data: { metadata: { uid: identity.uid, tier: tier as PaidTier, billingPeriod: period } },
    success_url: `${siteUrl}/settings?checkout=success`,
    cancel_url: `${siteUrl}/pricing?checkout=canceled`,
  });

  return NextResponse.json({ url: session.url });
}
