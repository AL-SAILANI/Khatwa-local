/**
 * Grants (or revokes) the admin flag the Supabase RLS policies check via
 * `app_metadata.admin`. app_metadata can only be written with the service
 * role key, so there is no in-app way to become an admin.
 *
 *   node --env-file=.env.local --import tsx scripts/supabase-set-admin.ts someone@example.com
 *   node --env-file=.env.local --import tsx scripts/supabase-set-admin.ts someone@example.com --revoke
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. The user must
 * sign out and back in before the new flag appears in their token.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUserIdByEmail(email: string): Promise<string | null> {
  const { data, error } = await supabase.from("profiles").select("uid").eq("email", email).maybeSingle();
  if (error) throw new Error(error.message);
  return data?.uid ?? null;
}

async function main() {
  const email = process.argv[2];
  const revoke = process.argv.includes("--revoke");
  if (!email) {
    console.error("Usage: supabase-set-admin.ts <email> [--revoke]");
    process.exit(1);
  }

  const uid = await findUserIdByEmail(email);
  if (!uid) {
    console.error(`No profile found for ${email}.`);
    process.exit(1);
  }

  const { error } = await supabase.auth.admin.updateUserById(uid, { app_metadata: { admin: !revoke } });
  if (error) throw new Error(error.message);
  console.log(`${revoke ? "Revoked" : "Granted"} admin for ${email} (${uid}).`);
}

main().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
