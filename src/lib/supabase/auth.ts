import type { User } from "@supabase/supabase-js";
import { getSupabase, setRememberSession } from "@/lib/supabase/client";
import { FlowAuthError } from "@/lib/supabase/auth-error";
import { routing } from "@/i18n/routing";
import type { AuthUser, Gender, StudyGoal } from "@/types/user";

const auth = () => getSupabase().auth;

export function toAuthUser(user: User): AuthUser {
  const meta = user.user_metadata ?? {};
  return {
    uid: user.id,
    email: user.email ?? null,
    displayName: meta.name ?? meta.full_name ?? null,
    photoURL: meta.photo_url ?? meta.avatar_url ?? meta.picture ?? null,
    createdAt: user.created_at,
  };
}

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

/** The profile row is created by the `handle_new_user` trigger from this metadata. */
export async function sbRegisterWithEmail({ name, email, password, goal, age, gender, avatarEmoji, examDate }: RegisterInput) {
  const { data, error } = await auth().signUp({
    email,
    password,
    options: { data: { name, goal, age, gender, avatar_emoji: avatarEmoji, exam_date: examDate } },
  });
  if (error) throw error;
  if (!data.session) throw new FlowAuthError("email_confirmation_required");
  return toAuthUser(data.user!);
}

export async function sbLoginWithEmail(email: string, password: string, rememberMe: boolean) {
  setRememberSession(rememberMe);
  const { data, error } = await auth().signInWithPassword({ email, password });
  if (error) throw error;
  return toAuthUser(data.user);
}

/** Redirects the browser to Google; the returned promise never settles so
 * callers don't navigate before the redirect happens. */
export async function sbLoginWithGoogle(): Promise<never> {
  setRememberSession(true);
  const first = window.location.pathname.split("/")[1] ?? "";
  const prefix = (routing.locales as readonly string[]).includes(first) ? `/${first}` : "";
  const { error } = await auth().signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${prefix}/dashboard` },
  });
  if (error) throw error;
  return new Promise<never>(() => {});
}

export async function sbResetPassword(email: string, redirectTo?: string) {
  const { error } = await auth().resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

/** True once the page was opened from a recovery link (a session exists). */
export async function sbWaitForRecoverySession(timeoutMs = 3000): Promise<boolean> {
  const { data } = await auth().getSession();
  if (data.session) return true;
  return new Promise<boolean>((resolve) => {
    const timer = setTimeout(() => {
      sub.subscription.unsubscribe();
      resolve(false);
    }, timeoutMs);
    const { data: sub } = auth().onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        clearTimeout(timer);
        sub.subscription.unsubscribe();
        resolve(true);
      }
    });
  });
}

export async function sbConfirmNewPassword(newPassword: string) {
  const { error } = await auth().updateUser({ password: newPassword });
  if (error) throw error;
  await auth().signOut({ scope: "local" });
}

export async function sbLogout() {
  const { error } = await auth().signOut();
  if (error) throw error;
}

async function reauthenticate(currentPassword: string) {
  const { data } = await auth().getSession();
  const email = data.session?.user.email;
  if (!email) throw new Error("No signed-in email/password user");
  const { error } = await auth().signInWithPassword({ email, password: currentPassword });
  if (error) throw error;
}

export async function sbChangePassword(currentPassword: string, newPassword: string) {
  await reauthenticate(currentPassword);
  const { error } = await auth().updateUser({ password: newPassword });
  if (error) throw error;
}

/** Every per-user table cascades from auth.users, so deleting the auth user
 * (via the `delete_my_account` RPC) removes all of the user's data. */
export async function sbDeleteAccount(currentPassword: string) {
  await reauthenticate(currentPassword);
  const { error } = await getSupabase().rpc("delete_my_account");
  if (error) throw error;
  await auth().signOut({ scope: "local" });
}
