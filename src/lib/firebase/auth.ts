import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updatePassword,
  verifyPasswordResetCode,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  updateProfile,
  type ActionCodeSettings,
} from "firebase/auth";
import { auth, googleProvider } from "./client";
import { createUserProfile, deleteUserData, ensureUserProfile } from "@/lib/firestore/users";
import type { Gender, StudyGoal } from "@/types/user";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import {
  sbChangePassword,
  sbConfirmNewPassword,
  sbDeleteAccount,
  sbLoginWithEmail,
  sbLoginWithGoogle,
  sbLogout,
  sbRegisterWithEmail,
  sbResetPassword,
} from "@/lib/supabase/auth";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  goal: StudyGoal | null;
  age?: number | null;
  gender?: Gender | null;
  avatarEmoji?: string | null;
  examDate?: string | null;
}

export async function registerWithEmail({ name, email, password, goal, age, gender, avatarEmoji, examDate }: RegisterInput) {
  if (useSupabaseUsers) return sbRegisterWithEmail({ name, email, password, goal, age, gender, avatarEmoji, examDate });
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await createUserProfile({ uid: credential.user.uid, name, email, goal, age, gender, avatarEmoji, examDate });
  return credential.user;
}

export async function loginWithEmail(email: string, password: string, rememberMe: boolean) {
  if (useSupabaseUsers) return sbLoginWithEmail(email, password, rememberMe);
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/** Creates a `goal: null` profile on first sign-in; caller should route
 * such users to `/onboarding/goal` (see `useUserProfile`). */
export async function loginWithGoogle() {
  if (useSupabaseUsers) return sbLoginWithGoogle();
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile({
    uid: credential.user.uid,
    name: credential.user.displayName ?? "",
    email: credential.user.email ?? "",
    photoURL: credential.user.photoURL,
  });
  return credential.user;
}

export async function resetPassword(email: string, settings?: ActionCodeSettings) {
  if (useSupabaseUsers) return sbResetPassword(email, settings?.url);
  await sendPasswordResetEmail(auth, email, settings);
}
/** Validates an in-app reset link and returns the email it was issued for. */
export async function verifyPasswordReset(code: string) {
  return verifyPasswordResetCode(auth, code);
}

/** Completes the reset for a link opened inside the app. */
export async function confirmNewPassword(code: string, newPassword: string) {
  if (useSupabaseUsers) return sbConfirmNewPassword(newPassword);
  await confirmPasswordReset(auth, code, newPassword);
}

export async function logout() {
  if (useSupabaseUsers) return sbLogout();
  await signOut(auth);
}

/** Re-authenticating right before a sensitive operation (password change,
 * account deletion) is required by Firebase when the sign-in is "stale" —
 * this always does it rather than trying to detect staleness client-side. */
async function reauthenticate(currentPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error("No signed-in email/password user");
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
}

export async function changePassword(currentPassword: string, newPassword: string) {
  if (useSupabaseUsers) return sbChangePassword(currentPassword, newPassword);
  await reauthenticate(currentPassword);
  if (!auth.currentUser) throw new Error("No signed-in user");
  await updatePassword(auth.currentUser, newPassword);
}

/** Deletes the user's Firestore data — including a cascade-delete of exam
 * attempts, lesson progress, study plans, achievements, and vocab review
 * state (see `deleteUserData`) — then their Auth account. Must run the
 * Firestore cleanup first: once the Auth account is gone, the ID token
 * backing these writes is no longer valid. */
export async function deleteAccount(currentPassword: string) {
  if (useSupabaseUsers) return sbDeleteAccount(currentPassword);
  const user = auth.currentUser;
  if (!user) throw new Error("No signed-in user");

  await reauthenticate(currentPassword);
  await deleteUserData(user.uid);
  await deleteUser(user);
}
