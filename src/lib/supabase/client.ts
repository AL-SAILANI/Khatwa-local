import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { useSupabaseUsers } from "@/lib/supabase/flags";

export { useSupabaseCatalog, useSupabaseUsers } from "@/lib/supabase/flags";

const REMEMBER_KEY = "khatwa.auth-remember";

/** "Remember me" off keeps the session in sessionStorage (cleared on tab close). */
export function setRememberSession(remember: boolean) {
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  } catch {
    // storage unavailable (private mode): session just won't persist
  }
}

const authStorage = {
  getItem: (key: string) =>
    typeof window === "undefined" ? null : (sessionStorage.getItem(key) ?? localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    const remember = localStorage.getItem(REMEMBER_KEY) !== "0";
    (remember ? localStorage : sessionStorage).setItem(key, value);
    (remember ? sessionStorage : localStorage).removeItem(key);
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
};

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");
  }
  client = createClient(url, anonKey, {
    auth: {
      persistSession: useSupabaseUsers,
      autoRefreshToken: useSupabaseUsers,
      detectSessionInUrl: useSupabaseUsers,
      ...(useSupabaseUsers ? { storage: authStorage } : {}),
    },
  });
  return client;
}
