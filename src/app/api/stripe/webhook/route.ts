import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { getStripeClient } from "@/lib/stripe/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { useSupabaseUsers } from "@/lib/supabase/flags";

async function updateUserPlan(uid: string, patch: { planTier: string; stripeCustomerId?: string | null }) {
  if (useSupabaseUsers) {
    const { error } = await getSupabaseAdmin()
      .from("profiles")
      .update({
        plan_tier: patch.planTier,
        ...(patch.stripeCustomerId ? { stripe_customer_id: patch.stripeCustomerId } : {}),
      })
      .eq("uid", uid);
    // Throwing makes the route 500, so Stripe retries instead of silently dropping the upgrade.
    if (error) throw new Error(`Supabase: ${error.message}`);
    return;
  }
  await adminDb
    .collection("users")
    .doc(uid)
    .update({
      planTier: patch.planTier,
      ...(patch.stripeCustomerId ? { stripeCustomerId: patch.stripeCustomerId } : {}),
      updatedAt: new Date().toISOString(),
    });
}

/** Stripe webhook — keeps `users/{uid}.planTier` in sync with subscription
 * status. Must read the raw body (not `request.json()`) for signature
 * verification, per Stripe's requirements. Configure this endpoint's URL in
 * the Stripe Dashboard once `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
 * are set; until then this 503s harmlessly (Stripe just retries later). */
export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const body = await request.text();
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: `Invalid signature: ${(error as Error).message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const uid = session.metadata?.uid ?? session.client_reference_id;
      const tier = session.metadata?.tier;
      if (uid && tier) {
        const customerId = typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null);
        await updateUserPlan(uid, { planTier: tier, stripeCustomerId: customerId });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const uid = subscription.metadata?.uid;
      if (!uid) break;

      const isActive = subscription.status === "active" || subscription.status === "trialing";
      const tier = isActive ? (subscription.metadata?.tier ?? "pro") : "free";

      await updateUserPlan(uid, { planTier: tier });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
