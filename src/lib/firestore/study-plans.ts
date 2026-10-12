import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { updateUserProfile } from "@/lib/firestore/users";
import type { StudyPlan } from "@/types/gamification";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { sbCreateStudyPlan, sbGetActiveStudyPlan, sbMarkPlanDayComplete } from "@/lib/supabase/user-data";

const plansCollection = collection(db, "studyPlans");

export async function getActiveStudyPlan(uid: string): Promise<StudyPlan | null> {
  if (useSupabaseUsers) return sbGetActiveStudyPlan(uid);
  const q = query(
    plansCollection,
    where("userId", "==", uid),
    orderBy("startedAt", "desc"),
    limit(1),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  return { id: docSnap.id, ...docSnap.data() } as StudyPlan;
}

export async function createStudyPlan(plan: Omit<StudyPlan, "id">) {
  const planId = useSupabaseUsers ? await sbCreateStudyPlan(plan) : (await addDoc(plansCollection, plan)).id;
  await updateUserProfile(plan.userId, { activeStudyPlanId: planId });
  return planId;
}

export function completionPercentOf(plan: StudyPlan): number {
  if (plan.weeklySchedule.length === 0) return 0;
  const completed = plan.weeklySchedule.filter((day) => day.completed).length;
  return Math.round((completed / plan.weeklySchedule.length) * 100);
}

/**
 * Firestore can't patch a single array element by index, so this reads the
 * plan, flips the day in memory, and writes the whole `weeklySchedule` array
 * back. Fine at this array size (max 30 entries); switch to a subcollection
 * if that ever changes.
 */
export async function markPlanDayComplete(planId: string, dayIndex: number) {
  if (useSupabaseUsers) return sbMarkPlanDayComplete(planId, dayIndex);
  const planRef = doc(db, "studyPlans", planId);
  const snapshot = await getDoc(planRef);
  if (!snapshot.exists()) return;

  const plan = snapshot.data() as StudyPlan;
  const weeklySchedule = plan.weeklySchedule.map((day) =>
    day.dayIndex === dayIndex ? { ...day, completed: true } : day,
  );

  await updateDoc(planRef, { weeklySchedule });
}
