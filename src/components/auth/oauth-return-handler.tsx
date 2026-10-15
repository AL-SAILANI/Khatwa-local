"use client";

import { useEffect } from "react";
import { getSupabase } from "@/lib/supabase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import {
  OAUTH_PENDING_KEY,
  OAUTH_PENDING_TTL_MS,
} from "@/lib/supabase/oauth-pending";
import { usePathname, useRouter } from "@/i18n/navigation";

const hasAuthParams = () =>
  /[#&?](access_token|code|error_description)=/.test(
    window.location.hash + window.location.search,
  );

function isPending() {
  try {
    const startedAt = Number(sessionStorage.getItem(OAUTH_PENDING_KEY));
    return startedAt > 0 && Date.now() - startedAt < OAUTH_PENDING_TTL_MS;
  } catch {
    return false;
  }
}

function clearPending() {
  try {
    sessionStorage.removeItem(OAUTH_PENDING_KEY);
  } catch {
    // storage unavailable
  }
}

/**
 * Google sign-in can come back to a page other than `/dashboard` (Supabase
 * falls back to the site URL when the redirect URL is not in its allow list).
 * The session is still created, so once it exists, send the learner on to the
 * dashboard. A flag set right before leaving for Google (and the auth params
 * in the URL) tell this apart from an ordinary visit.
 */
export function OAuthReturnHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!useSupabaseUsers) return;
    if (!hasAuthParams() && !isPending()) return;
    if (pathname.startsWith("/dashboard")) {
      clearPending();
      return;
    }

    const auth = getSupabase().auth;
    let done = false;
    const goToDashboard = () => {
      if (done) return;
      done = true;
      clearPending();
      router.replace("/dashboard");
    };

    const { data } = auth.onAuthStateChange((_event, session) => {
      if (session) goToDashboard();
    });
    void auth.getSession().then(({ data: current }) => {
      if (current.session) goToDashboard();
    });
    return () => data.subscription.unsubscribe();
  }, [pathname, router]);

  return null;
}
