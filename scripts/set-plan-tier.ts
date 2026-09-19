/**
 * Sets (or revokes) a user's `planTier` directly in Firestore via the Admin
 * SDK — the same elevated path as `set-admin-claim.ts`, used for admin
 * grants, comp credits, or fixing tier data without touching Stripe.
 *
 *   npx tsx scripts/set-plan-tier.ts mohammed.alsilani.7@gmail.com premium
 *   npx tsx scripts/set-plan-tier.ts someone@example.com pro
 *   npx tsx scripts/set-plan-tier.ts someone@example.com free
 *   npx tsx scripts/set-plan-tier.ts someone@example.com premium --revoke
 *
 * `--revoke` clears the tier back to `free`. Run with the env file loaded:
 *   node --env-file=.env.local --import tsx scripts/set-plan-tier.ts ...
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const VALID_TIERS = ["free", "pro", "premium"] as const;
type Tier = (typeof VALID_TIERS)[number];

const app = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) })
  : initializeApp();
const adminAuth = getAuth(app);
const db = getFirestore(app);

async function main() {
  const email = process.argv[2];
  const rawTier = process.argv[3] as Tier | undefined;
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: set-plan-tier.ts <email> <free|pro|premium> [--revoke]");
    process.exit(1);
  }

  const tier: Tier = revoke ? "free" : (rawTier ?? "free");
  if (!VALID_TIERS.includes(tier)) {
    console.error(`Invalid tier: ${rawTier}. Must be one of ${VALID_TIERS.join(", ")}.`);
    process.exit(1);
  }

  const user = await adminAuth.getUserByEmail(email);
  await db.collection("users").doc(user.uid).set(
    { planTier: tier, updatedAt: new Date().toISOString() },
    { merge: true },
  );

  console.log(`Set planTier="${tier}" for ${email} (${user.uid}).`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});