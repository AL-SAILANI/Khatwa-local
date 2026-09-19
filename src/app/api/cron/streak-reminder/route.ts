import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase/admin";

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

  const snapshot = await adminDb.collection("users").where("notificationsEnabled", "==", true).get();
  const today = new Date().toISOString().slice(0, 10);

  let usersNotified = 0;
  await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();
      const tokens: string[] = data.fcmTokens ?? [];
      const recentDays: string[] = data.recentActivityDays ?? [];
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
        await docSnap.ref.update({ fcmTokens: liveTokens });
      }
    }),
  );

  return NextResponse.json({ ok: true, usersNotified });
}
