"use client";

import { useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { usePathname, useRouter } from "@/i18n/navigation";

const hasAuthParams = () =>
  /[#&?](access_token|code|error_description)=/.test(
    window.location.hash + window.location.search,
  );

/**
 * Google sign-in can come back to a page other than `/dashboard` (Supabase
 * falls back to the site URL when the redirect URL is not in its allow list).
 * The session is still created from the URL, so once it is, send the learner
 * on to the dashboard instead of leaving them on the landing page.
 */
export function OAuthReturnHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!useSupabaseUsers || !hasAuthParams()) return;
    if (pathname.startsWith("/dashboard")) return;
    const { data } = getSupabase().auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        data.subscription.unsubscribe();
        router.replace("/dashboard");
      }
    });
    return () => data.subscription.unsubscribe();
  }, [pathname, router]);

  return null;
}
