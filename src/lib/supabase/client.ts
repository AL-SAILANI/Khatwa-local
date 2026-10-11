import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Catalog reads (courses, lessons, questions, vocab, achievements) come from
 * Supabase only when this flag is "supabase"; Firebase stays the default. */
export const useSupabaseCatalog = process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }
  // Auth is still Firebase in this phase, so there is no Supabase session to persist.
  client = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
