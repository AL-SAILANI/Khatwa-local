"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { getSupabase } from "@/lib/supabase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { useAuthUser } from "@/hooks/use-auth-user";

interface ClaimState {
  uid: string;
  isAdmin: boolean;
}

/** Reads the admin flag off the current session token — the only source of
 * truth the security rules trust. Firebase: the `admin` custom claim
 * (`npm run set-admin`). Supabase: `app_metadata.admin`
 * (`npx tsx scripts/supabase-set-admin.ts`). Both are Admin-API-only. */
export function useIsAdmin() {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const [claim, setClaim] = useState<ClaimState | null>(null);

  useEffect(() => {
    if (!user) return;

    if (useSupabaseUsers) {
      getSupabase()
        .auth.getSession()
        .then(({ data }) => {
          setClaim({ uid: user.uid, isAdmin: data.session?.user.app_metadata?.admin === true });
        });
      return;
    }

    auth.currentUser?.getIdTokenResult().then((result) => {
      setClaim({ uid: user.uid, isAdmin: result.claims.admin === true });
    });
  }, [user]);

  const isForCurrentUser = Boolean(user) && claim?.uid === user?.uid;

  return {
    isAdmin: isForCurrentUser ? claim!.isAdmin : false,
    isLoading: isAuthLoading || (Boolean(user) && !isForCurrentUser),
  };
}
