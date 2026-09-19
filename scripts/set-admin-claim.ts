/**
 * Grants (or revokes) the `admin` custom claim that firestore.rules and
 * storage.rules check via `request.auth.token.admin`. Custom claims can
 * only be set with the Admin SDK — there is no client-side way to make a
 * user an admin, by design.
 *
 *   npx tsx scripts/set-admin-claim.ts someone@example.com          # grant
 *   npx tsx scripts/set-admin-claim.ts someone@example.com --revoke  # revoke
 *
 * The affected user must sign out and back in (or call
 * `getIdTokenResult(true)`) before the new claim is visible client-side.
 */
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)) })
  : initializeApp();
const adminAuth = getAuth(app);

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: npx tsx scripts/set-admin-claim.ts <email> [--revoke]");
    process.exit(1);
  }

  const user = await adminAuth.getUserByEmail(email);
  await adminAuth.setCustomUserClaims(user.uid, { admin: !revoke });

  console.log(`${revoke ? "Revoked" : "Granted"} admin claim for ${email} (${user.uid}).`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
