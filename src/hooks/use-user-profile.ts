"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "./use-auth-user";
import { subscribeUserProfile } from "@/lib/firestore/users";
import type { UserProfile } from "@/types/user";

interface SubscriptionState {
  uid: string;
  profile: UserProfile | null;
}

export function useUserProfile() {
  const { user, isLoading: isAuthLoading } = useAuthUser();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);

  useEffect(() => {
    if (!user) return;

    return subscribeUserProfile(user.uid, (next) => {
      setSubscription({ uid: user.uid, profile: next });
    });
  }, [user]);

  // Derived at render time rather than mirrored into state: avoids a
  // separate effect just to reset things when `user` changes or logs out,
  // and guards against showing a stale previous user's profile for the
  // one render before the new subscription fires.
  const isForCurrentUser = Boolean(user) && subscription?.uid === user?.uid;
  const profile = isForCurrentUser ? subscription!.profile : null;
  const isProfileLoading = Boolean(user) && !isForCurrentUser;

  return {
    user,
    profile,
    isLoading: isAuthLoading || isProfileLoading,
  };
}
