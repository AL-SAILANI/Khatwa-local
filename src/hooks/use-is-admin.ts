"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/hooks/use-auth-user";

interface ClaimState {
  uid: string;
  isAdmin: boolean;
}

/** Reads the `admin` custom claim off the current ID token — the only
 * source of truth `firestore.rules`/`storage.rules` trust. Grant it with
 * `npm run set-admin -- someone@example.com` (Admin SDK only). */
export function useIsAdmin() {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const [claim, setClaim] = useState<ClaimState | null>(null);

  useEffect(() => {
    if (!user) return;

    user.getIdTokenResult().then((result) => {
      setClaim({ uid: user.uid, isAdmin: result.claims.admin === true });
    });
  }, [user]);

  const isForCurrentUser = Boolean(user) && claim?.uid === user?.uid;

  return {
    isAdmin: isForCurrentUser ? claim!.isAdmin : false,
    isLoading: isAuthLoading || (Boolean(user) && !isForCurrentUser),
  };
}
