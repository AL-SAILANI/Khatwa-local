import { useSupabaseUsers } from "@/lib/supabase/flags";
import {
  sbGetSkillMastery,
  sbRefreshSkillMastery,
} from "@/lib/supabase/user-data";
import type { MasteryMap } from "@/lib/skill-mastery";

/**
 * Persists the learner's per-skill mastery after an exam or a lesson. Only the
 * Supabase backend stores it; on Firebase the mastery is recomputed on demand.
 * Never throws: a failed refresh must not break submitting an exam.
 */
export async function refreshSkillMastery(uid: string): Promise<void> {
  if (!useSupabaseUsers) return;
  try {
    await sbRefreshSkillMastery(uid);
  } catch {
    // best effort
  }
}

/** Stored mastery, or null when nothing is stored yet (or the backend does not store it). */
export async function getStoredSkillMastery(
  uid: string,
): Promise<MasteryMap | null> {
  if (!useSupabaseUsers) return null;
  try {
    const rows = await sbGetSkillMastery(uid);
    if (rows.length === 0) return null;
    return new Map(
      rows.map((row) => [
        row.skillId,
        { mastery: row.mastery, evidence: row.attempts },
      ]),
    );
  } catch {
    return null;
  }
}
