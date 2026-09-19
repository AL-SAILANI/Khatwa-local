"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useUserProfile } from "@/hooks/use-user-profile";
import { getQuestionsBySection, getReadingPassages } from "@/lib/firestore/questions";
import { createExamAttempt, submitExamAttempt } from "@/lib/firestore/exam-attempts";
import { updateUserProfile } from "@/lib/firestore/users";
import { scoreAttempt, levelFromScore } from "@/lib/exam-scoring";
import { generateRecommendations } from "@/lib/recommendations";
import type { ExamSubmitPayload } from "@/components/exam/exam-runner";
import type { ExamSectionKey, Question, ReadingPassage } from "@/types/question";
import { STEP_SECTION_ORDER } from "@/lib/constants/exam";

interface ExamSession {
  attemptId: string;
  questions: Question[];
  passages: Record<string, ReadingPassage>;
}

interface UseExamSessionOptions {
  kind: "placement" | "mock";
  examId: string;
  sectionCounts: Partial<Record<ExamSectionKey, number>>;
  /** Optional tag filter so the mock exam draws only from the dedicated
   * STEP content bank ("step-mock") rather than the mixed seed bank. */
  bankTag?: string;
}

/** Shared "assemble questions → create attempt → run → score → submit →
 * redirect to results" flow behind both the placement test and mock exams —
 * the only real differences between them are how many questions per
 * section to pull and whether a placement result also sets `level`. */
export function useExamSession({ kind, examId, sectionCounts, bankTag }: UseExamSessionOptions) {
  const { user } = useUserProfile();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<ExamSession | null>(null);

  const start = async () => {
    if (!user) return;
    setIsLoading(true);

    const sections = STEP_SECTION_ORDER.map(
      (section) => [section, sectionCounts[section] ?? 0] as [ExamSectionKey, number],
    ).filter(([, count]) => count > 0);
    const questionsBySections = await Promise.all(
      sections.map(([section, count]) => getQuestionsBySection(section, count, bankTag)),
    );
    const questions = questionsBySections.flat();
    const passageIds = questions.map((q) => q.passageId).filter((id): id is string => Boolean(id));
    const passages = await getReadingPassages(passageIds);

    const attemptId = await createExamAttempt({
      userId: user.uid,
      examId,
      kind,
      answers: {},
      flagged: [],
      startedAt: new Date().toISOString(),
    });

    setSession({ attemptId, questions, passages });
    setIsLoading(false);
  };

  const submit = async (payload: ExamSubmitPayload) => {
    if (!user || !session) return;

    const result = scoreAttempt(session.questions, payload.answers, payload.timeBySection);
    const recommendations = generateRecommendations(result.weakSkills);

    // Placement sets the user's level; write it before submitExamAttempt so
    // its internal syncPublicProfile picks up the new level (publicProfiles
    // must mirror users for the Firestore rule to allow the write).
    if (kind === "placement") {
      await updateUserProfile(user.uid, { level: levelFromScore(result.score) });
    }

    await submitExamAttempt(user.uid, session.attemptId, { ...result, recommendations, newWords: [] });

    router.push(`/exam-results/${session.attemptId}`);
  };

  return { isLoading, session, start, submit };
}
