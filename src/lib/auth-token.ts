import { auth } from "@/lib/firebase/client";
import { getSupabase } from "@/lib/supabase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";

/** Bearer token for our own API routes, from whichever backend signed the user in. */
export async function getAccessToken(): Promise<string | undefined> {
  if (useSupabaseUsers) {
    const { data } = await getSupabase().auth.getSession();
    return data.session?.access_token;
  }
  return auth.currentUser?.getIdToken();
}
