import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useSupabaseUsers } from "@/lib/supabase/flags";
import { sbGetAdminStats } from "@/lib/supabase/user-data";

export interface AdminStats {
  totalUsers: number;
  totalExamAttempts: number;
  totalCourses: number;
  totalQuestions: number;
}

/** Uses Firestore's server-side count aggregation (no document downloads),
 * so this stays cheap regardless of collection size. */
export async function getAdminStats(): Promise<AdminStats> {
  if (useSupabaseUsers) return sbGetAdminStats();
  const [users, examAttempts, courses, questions] = await Promise.all([
    getCountFromServer(collection(db, "users")),
    getCountFromServer(collection(db, "examAttempts")),
    getCountFromServer(collection(db, "courses")),
    getCountFromServer(collection(db, "questions")),
  ]);

  return {
    totalUsers: users.data().count,
    totalExamAttempts: examAttempts.data().count,
    totalCourses: courses.data().count,
    totalQuestions: questions.data().count,
  };
}
