import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase/admin";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { useSupabaseUsers } from "@/lib/supabase/flags";

interface ReminderTarget {
  tokens: string[];
  recentDays: string[];
  saveTokens: (tokens: string[]) => Promise<unknown>;
}

async function loadReminderTargets(): Promise<ReminderTarget[]> {
  if (useSupabaseUsers) {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("profiles")
      .select("uid, fcm_tokens, recent_activity_days")
      .eq("notifications_enabled", true);
    if (error) throw new Error(`Supabase: ${error.message}`);
    return (data ?? []).map((row) => ({
      tokens: row.fcm_tokens ?? [],
      recentDays: row.recent_activity_days ?? [],
      saveTokens: async (tokens) => supabase.from("profiles").update({ fcm_tokens: tokens }).eq("uid", row.uid),
    }));
  }

  const snapshot = await adminDb.collection("users").where("notificationsEnabled", "==", true).get();
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      tokens: data.fcmTokens ?? [],
      recentDays: data.recentActivityDays ?? [],
      saveTokens: (tokens) => docSnap.ref.update({ fcmTokens: tokens }),
    };
  });
}

/**
 * Daily streak-reminder push, triggered by a Vercel Cron job (see
 * `vercel.json`) instead of a Firebase Cloud Function — Cloud Functions
 * require the paid Blaze plan, while a scheduled HTTP call plus the Admin
 * SDK works entirely on Firestore's and Vercel's free tiers. Mirrors the
 * logic that used to live in `functions/src/notifications.ts`.
 *
 * Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on cron
 * invocations when that env var is set on the project, so checking it here
 * is enough to keep this endpoint from being triggered publicly.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const targets = await loadReminderTargets();
  const today = new Date().toISOString().slice(0, 10);

  let usersNotified = 0;
  await Promise.all(
    targets.map(async ({ tokens, recentDays, saveTokens }) => {
      if (tokens.length === 0 || recentDays.includes(today)) return;

      const response = await adminMessaging.sendEachForMulticast({
        tokens,
        notification: {
          title: "لا تكسر سلسلتك في خطوة!",
          body: "لم تدرس اليوم بعد — راجع بطاقة مفردات أو حل سؤالين للحفاظ على سلسلتك.",
        },
        webpush: { fcmOptions: { link: "/ar/dashboard" } },
      });
      usersNotified++;

      const liveTokens = tokens.filter((_, i) => response.responses[i]?.success);
      if (liveTokens.length !== tokens.length) {
        await saveTokens(liveTokens);
      }
    }),
  );

  return NextResponse.json({ ok: true, usersNotified });
}
