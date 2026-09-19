import { NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb } from "@/lib/firebase/admin";
import { getStripeClient } from "@/lib/stripe/server";

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
        await adminDb
          .collection("users")
          .doc(uid)
          .update({
            planTier: tier,
            stripeCustomerId: session.customer,
            updatedAt: new Date().toISOString(),
          });
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

      await adminDb.collection("users").doc(uid).update({
        planTier: tier,
        updatedAt: new Date().toISOString(),
      });
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
