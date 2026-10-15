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
import { pickBalanced, pickReadingByPassage } from "@/lib/placement";

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

  /** `override` lets one page launch different exams (e.g. mock exam 1 or 2). */
  const start = async (override?: { examId?: string; bankTag?: string }) => {
    if (!user) return;
    const activeExamId = override?.examId ?? examId;
    const activeBankTag = override?.bankTag ?? bankTag;
    setIsLoading(true);

    const sections = STEP_SECTION_ORDER.map(
      (section) => [section, sectionCounts[section] ?? 0] as [ExamSectionKey, number],
    ).filter(([, count]) => count > 0);
    // Placement draws a difficulty-balanced sample (reading by whole passage);
    // mock exams keep the plain random draw from the dedicated bank.
    const questionsBySections = await Promise.all(
      sections.map(async ([section, count]) => {
        if (kind !== "placement") return getQuestionsBySection(section, count, activeBankTag);
        const pool = await getQuestionsBySection(section, Number.MAX_SAFE_INTEGER, activeBankTag);
        return section === "reading" ? pickReadingByPassage(pool, count) : pickBalanced(pool, count);
      }),
    );
    const questions = questionsBySections.flat();
    const passageIds = questions.map((q) => q.passageId).filter((id): id is string => Boolean(id));
    const passages = await getReadingPassages(passageIds);

    const attemptId = await createExamAttempt({
      userId: user.uid,
      examId: activeExamId,
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

    await submitExamAttempt(user.uid, session.attemptId, { ...result, recommendations, newWords: [], answers: payload.answers, flagged: payload.flagged });

    router.push(`/exam-results/${session.attemptId}`);
  };

  return { isLoading, session, start, submit };
}
