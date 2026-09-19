import * as functionsV1 from "firebase-functions/v1";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const db = getFirestore();

/** Runs once a day. Anyone with notifications on, at least one registered
 * push token, and no graded activity yet today gets a streak-reminder push.
 * Stale tokens (uninstalled app, revoked permission) are pruned from the
 * user doc based on the multicast send result. */
export const sendStreakReminders = functionsV1.pubsub
  .schedule("0 18 * * *")
  .timeZone("Asia/Riyadh")
  .onRun(async () => {
    const snapshot = await db.collection("users").where("notificationsEnabled", "==", true).get();
    const today = new Date().toISOString().slice(0, 10);

    await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const tokens: string[] = data.fcmTokens ?? [];
        const recentDays: string[] = data.recentActivityDays ?? [];
        if (tokens.length === 0 || recentDays.includes(today)) return;

        const response = await getMessaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "لا تكسر سلسلتك في خطوة!",
            body: "لم تدرس اليوم بعد — راجع بطاقة مفردات أو حل سؤالين للحفاظ على سلسلتك.",
          },
          webpush: { fcmOptions: { link: "/ar/dashboard" } },
        });

        const liveTokens = tokens.filter((_, i) => response.responses[i].success);
        if (liveTokens.length !== tokens.length) {
          await docSnap.ref.update({ fcmTokens: liveTokens });
        }
      }),
    );
  });
