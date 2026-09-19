import "server-only";
import Stripe from "stripe";

let stripeClient: Stripe | null | undefined;

/** `undefined` means "not checked yet", `null` means "checked, no key set".
 * Returns `null` instead of throwing so routes can respond with a clean
 * "not configured" message rather than a 500 when `STRIPE_SECRET_KEY` is
 * absent — the expected state until the project owner adds their own Stripe
 * account. */
export function getStripeClient(): Stripe | null {
  if (stripeClient !== undefined) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  stripeClient = secretKey ? new Stripe(secretKey) : null;
  return stripeClient;
}
