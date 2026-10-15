import { describe, expect, it } from "vitest";
import { buildDailySession } from "./session-engine";
import { computeSkillMastery, skillsOfLesson } from "./skill-mastery";
import { SAMPLE_LESSONS } from "@/data/sample-courses";
import { getStaticQuestion } from "@/lib/tag-lesson-map";
import type { ExamAttempt } from "@/types/exam";
import type { Lesson, LessonProgress } from "@/types/course";
import type { MasteryMap } from "./skill-mastery";

const lesson = (id: string, order: number): Lesson => ({
  id,
  courseId: "c",
  title: id,
  order,
  resources: [],
  notes: "",
  questionIds: [],
});
const progress = (
  lessonId: string,
  quizScore: number | null,
  completed = true,
): LessonProgress => ({
  userId: "u",
  lessonId,
  courseId: "c",
  completed,
  quizScore,
  lastPosition: 0,
  updatedAt: "2026-10-01T00:00:00Z",
});
const lessons = [lesson("a", 0), lesson("b", 1), lesson("c", 2)];
const skillsMap: Record<string, string[]> = {
  a: ["gr-comparison"],
  b: ["gr-present-perfect"],
  c: ["gr-articles"],
};
const run = (
  mastery: MasteryMap,
  extra: Partial<Parameters<typeof buildDailySession>[0]> = {},
) =>
  buildDailySession({
    lessons,
    progress: [],
    mastery,
    skillsOfLesson: (l) => skillsMap[l.id] ?? [],
    dueWords: 0,
    ...extra,
  });

describe("daily session engine", () => {
  it("prefers the weakest high-frequency skill", () => {
    const mastery: MasteryMap = new Map([
      ["gr-comparison", { mastery: 0.9, evidence: 10 }],
      ["gr-present-perfect", { mastery: 0.3, evidence: 10 }],
      ["gr-past-simple", { mastery: 0.8, evidence: 10 }],
      ["gr-articles", { mastery: 0.6, evidence: 10 }],
    ]);
    const session = run(mastery);
    expect(session.lesson?.lesson.id).toBe("b");
    expect(session.lesson?.reason).toBe("weak");
  });

  it("damps a skill whose prerequisite is not ready", () => {
    const mastery: MasteryMap = new Map([
      ["gr-present-perfect", { mastery: 0.3, evidence: 10 }],
      ["gr-past-simple", { mastery: 0.2, evidence: 10 }],
      ["gr-articles", { mastery: 0.6, evidence: 10 }],
      ["gr-comparison", { mastery: 0.9, evidence: 10 }],
    ]);
    expect(run(mastery).lesson?.lesson.id).toBe("c");
  });

  it("skips completed lessons and mastered skills", () => {
    const mastery: MasteryMap = new Map([
      ["gr-present-perfect", { mastery: 0.95, evidence: 10 }],
    ]);
    const session = run(mastery, { progress: [progress("a", 100)] });
    expect(session.lesson?.lesson.id).not.toBe("a");
    expect(session.lesson?.lesson.id).not.toBe("b");
  });

  it("falls back to the first open lesson when nothing has a priority", () => {
    const mastery: MasteryMap = new Map([
      ["gr-comparison", { mastery: 0.9, evidence: 9 }],
      ["gr-present-perfect", { mastery: 0.9, evidence: 9 }],
      ["gr-articles", { mastery: 0.9, evidence: 9 }],
    ]);
    expect(run(mastery).lesson?.lesson.id).toBe("a");
  });

  it("offers a retry for the lowest exit-card score below mastery and adds up the minutes", () => {
    const session = run(new Map(), {
      dueWords: 12,
      progress: [progress("a", 60), progress("b", 40), progress("c", 90)],
    });
    expect(session.retry?.lesson.id).toBe("b");
    expect(session.retry?.score).toBe(40);
    expect(session.minutes).toBe(5 + 8);
  });

  it("returns an empty lesson slot when everything is complete", () => {
    const session = run(new Map(), {
      progress: lessons.map((l) => progress(l.id, 100)),
    });
    expect(session.lesson).toBeNull();
    expect(session.retry).toBeNull();
  });
});

describe("skill mastery estimate", () => {
  const question = getStaticQuestion("lp-grammar-10-1")!;
  const attempt = (answers: Record<string, string>): ExamAttempt => ({
    id: "x",
    userId: "u",
    examId: "e",
    kind: "mock",
    status: "submitted",
    answers,
    flagged: [],
    startedAt: "",
    submittedAt: "",
    score: null,
    sectionResults: [],
    weakSkills: [],
    newWords: [],
    recommendations: [],
  });
  const base = {
    progress: [],
    lessonById: new Map<string, Lesson>(),
    getQuestion: getStaticQuestion,
  };

  it("rises with correct answers and falls with wrong ones", () => {
    const right = computeSkillMastery({
      ...base,
      attempts: [attempt({ [question.id]: question.correctOptionId })],
    });
    const wrong = computeSkillMastery({
      ...base,
      attempts: [attempt({ [question.id]: "zzz" })],
    });
    expect(right.get("gr-comparison")!.mastery).toBeGreaterThan(0.5);
    expect(wrong.get("gr-comparison")!.mastery).toBeLessThan(0.5);
  });

  it("uses lesson exit-card scores and resolves lesson skills", () => {
    const grammar1 = SAMPLE_LESSONS.find((l) => l.id === "lesson-grammar-10")!;
    expect(skillsOfLesson(grammar1, getStaticQuestion)).toContain(
      "gr-comparison",
    );
    const map = computeSkillMastery({
      attempts: [],
      progress: [progress(grammar1.id, 100)],
      lessonById: new Map([[grammar1.id, grammar1]]),
      getQuestion: getStaticQuestion,
    });
    expect(map.get("gr-comparison")!.mastery).toBeGreaterThan(0.7);
  });

  it("leaves skills without evidence out of the map", () => {
    expect(computeSkillMastery({ ...base, attempts: [] }).size).toBe(0);
  });
});
