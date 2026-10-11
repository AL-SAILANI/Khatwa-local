"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getSupabase } from "@/lib/supabase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { toAuthUser } from "@/lib/supabase/auth";
import type { AuthUser } from "@/types/user";

const sameUser = (a: AuthUser | null, b: AuthUser | null) =>
  a === b ||
  (a !== null &&
    b !== null &&
    a.uid === b.uid &&
    a.email === b.email &&
    a.displayName === b.displayName &&
    a.photoURL === b.photoURL);

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useSupabaseUsers) {
      const { data } = getSupabase().auth.onAuthStateChange((_event, session) => {
        const next = session?.user ? toAuthUser(session.user) : null;
        // Token refreshes re-emit the same user; keep the reference stable so
        // effects keyed on `user` (profile subscription) don't re-run.
        setUser((prev) => (sameUser(prev, next) ? prev : next));
        setIsLoading(false);
      });
      return () => data.subscription.unsubscribe();
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(
        nextUser && {
          uid: nextUser.uid,
          email: nextUser.email,
          displayName: nextUser.displayName,
          photoURL: nextUser.photoURL,
          createdAt: nextUser.metadata.creationTime,
        },
      );
      setIsLoading(false);
    });
  }, []);

  return { user, isLoading };
}
