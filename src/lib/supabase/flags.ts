/** Which backend serves login + per-user data. "firebase" (default) or "supabase". */
export const useSupabaseUsers = process.env.NEXT_PUBLIC_USER_BACKEND === "supabase";

/** Catalog content (courses, questions, ...). Following the user backend when
 * that is Supabase, because per-user rows reference catalog ids in the same DB. */
export const useSupabaseCatalog = process.env.NEXT_PUBLIC_DATA_BACKEND === "supabase" || useSupabaseUsers;
