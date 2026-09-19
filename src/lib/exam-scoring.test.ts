import { describe, it, expect } from "vitest";
import { scoreAttempt, levelFromScore } from "@/lib/exam-scoring";
import type { Question } from "@/types/question";

const MOCK_QUESTIONS: Question[] = [
  { id: "q1", section: "reading", prompt: "Reading 1", options: [], correctOptionId: "a", explanation: "", difficulty: "medium", tags: ["vocab"], passageId: "p1" },
  { id: "q2", section: "reading", prompt: "Reading 2", options: [], correctOptionId: "b", explanation: "", difficulty: "medium", tags: ["inference"], passageId: "p1" },
  { id: "q3", section: "grammar", prompt: "Grammar 1", options: [], correctOptionId: "a", explanation: "", difficulty: "easy", tags: ["verbs"] },
  { id: "q4", section: "grammar", prompt: "Grammar 2", options: [], correctOptionId: "c", explanation: "", difficulty: "hard", tags: ["nouns"] },
  { id: "q5", section: "listening", prompt: "Listening 1", options: [], correctOptionId: "b", explanation: "", difficulty: "medium", tags: ["comprehension"], passageId: "p2" },
  { id: "q6", section: "writingAnalysis", prompt: "Writing 1", options: [], correctOptionId: "a", explanation: "", difficulty: "medium", tags: ["structure"] },
];

describe("exam-scoring", () => {
  describe("scoreAttempt", () => {
    it("should calculate perfect score when all answers are correct", () => {
      const answers = {
        q1: "a",
        q2: "b",
        q3: "a",
        q4: "c",
        q5: "b",
        q6: "a",
      };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, {});

      expect(result.score).toBe(100);
      expect(result.sectionResults.every((s) => s.correct === s.total)).toBe(true);
      expect(result.weakSkills).toEqual([]);
    });

    it("should calculate 0 score when all answers are wrong", () => {
      const answers = {
        q1: "b",
        q2: "a",
        q3: "b",
        q4: "a",
        q5: "a",
        q6: "b",
      };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, {});

      expect(result.score).toBe(0);
      expect(result.sectionResults.every((s) => s.correct === 0)).toBe(true);
    });

    it("should calculate weighted score correctly", () => {
      // 2 reading (40% weight), 2 grammar (30%), 1 listening (20%), 1 writing (10%)
      // All reading correct (100% of 40% = 40)
      // 1/2 grammar correct (50% of 30% = 15)
      // 0/1 listening correct (0% of 20% = 0)
      // 1/1 writing correct (100% of 10% = 10)
      // Total = 65
      const answers = {
        q1: "a",
        q2: "b",
        q3: "a",
        q4: "a", // wrong
        q5: "a", // wrong
        q6: "a",
      };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, {});

      expect(result.score).toBe(65);
    });

    it("should track time spent per section", () => {
      const answers = { q1: "a", q2: "b", q3: "a", q4: "c", q5: "b", q6: "a" };
      const timeBySection = { reading: 1200, grammar: 800, listening: 600, writingAnalysis: 400 };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, timeBySection);

      expect(result.sectionResults.find((s) => s.section === "reading")?.timeSpentSeconds).toBe(1200);
      expect(result.sectionResults.find((s) => s.section === "grammar")?.timeSpentSeconds).toBe(800);
      expect(result.sectionResults.find((s) => s.section === "listening")?.timeSpentSeconds).toBe(600);
      expect(result.sectionResults.find((s) => s.section === "writingAnalysis")?.timeSpentSeconds).toBe(400);
    });

    it("should identify weak skills from wrong answers", () => {
      // q3 (grammar, verbs) and q4 (grammar, nouns) wrong
      // q5 (listening, comprehension) wrong
      const answers = {
        q1: "a",
        q2: "b",
        q3: "b", // wrong - verbs
        q4: "a", // wrong - nouns
        q5: "a", // wrong - comprehension
        q6: "a",
      };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, {});

      expect(result.weakSkills).toContain("verbs");
      expect(result.weakSkills).toContain("nouns");
      expect(result.weakSkills).toContain("comprehension");
    });

    it("should limit weak skills to top 3", () => {
      const questionsWithManyTags: Question[] = MOCK_QUESTIONS.map((q, i) => ({
        ...q,
        id: `q${i + 1}`,
        tags: [`tag${i * 3 + 1}`, `tag${i * 3 + 2}`, `tag${i * 3 + 3}`],
      }));

      const answers: Record<string, string> = {};
      questionsWithManyTags.forEach((q) => {
        answers[q.id] = "wrong"; // all wrong
      });

      const result = scoreAttempt(questionsWithManyTags, answers, {});

      expect(result.weakSkills.length).toBeLessThanOrEqual(3);
    });

    it("should handle empty questions array", () => {
      const result = scoreAttempt([], {}, {});

      expect(result.score).toBe(0);
      expect(result.sectionResults).toHaveLength(4);
      expect(result.weakSkills).toEqual([]);
    });

    it("should handle sections with no questions", () => {
      const questions: Question[] = [
        { id: "q1", section: "reading", prompt: "R1", options: [], correctOptionId: "a", explanation: "", difficulty: "medium", tags: ["t1"] },
      ];

      const result = scoreAttempt(questions, { q1: "a" }, {});

      // Only reading has questions, others have 0
      const readingResult = result.sectionResults.find((s) => s.section === "reading");
      const grammarResult = result.sectionResults.find((s) => s.section === "grammar");

      expect(readingResult?.total).toBe(1);
      expect(grammarResult?.total).toBe(0);
      // Score should be 100% of reading weight (40) = 40
      expect(result.score).toBe(40);
    });

    it("should return section results for all 4 STEP sections", () => {
      const answers = { q1: "a", q2: "b", q3: "a", q4: "c", q5: "b", q6: "a" };

      const result = scoreAttempt(MOCK_QUESTIONS, answers, {});

      expect(result.sectionResults).toHaveLength(4);
      const sections = result.sectionResults.map((s) => s.section).sort();
      expect(sections).toEqual(["grammar", "listening", "reading", "writingAnalysis"]);
    });
  });

  describe("levelFromScore", () => {
    it("should return beginner for scores below 50", () => {
      expect(levelFromScore(0)).toBe("beginner");
      expect(levelFromScore(25)).toBe("beginner");
      expect(levelFromScore(49)).toBe("beginner");
    });

    it("should return intermediate for scores 50-74", () => {
      expect(levelFromScore(50)).toBe("intermediate");
      expect(levelFromScore(60)).toBe("intermediate");
      expect(levelFromScore(74)).toBe("intermediate");
    });

    it("should return advanced for scores 75 and above", () => {
      expect(levelFromScore(75)).toBe("advanced");
      expect(levelFromScore(85)).toBe("advanced");
      expect(levelFromScore(100)).toBe("advanced");
    });
  });
});