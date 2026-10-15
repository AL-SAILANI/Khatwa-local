import { describe, expect, it } from "vitest";
import { buildStages, stageKeyOf, summarizeStage } from "./exam-stages";
import { STEP_TOTAL_MINUTES } from "@/lib/constants/exam";
import type { ExamSectionKey, Question } from "@/types/question";

const q = (id: string, section: ExamSectionKey): Question => ({
  id,
  section,
  prompt: id,
  options: [],
  correctOptionId: "a",
  explanation: "",
  difficulty: "easy",
  tags: [],
});
const build = (spec: [ExamSectionKey, number][]) =>
  spec.flatMap(([s, n]) =>
    Array.from({ length: n }, (_, i) => q(`${s}${i}`, s)),
  );

describe("exam stages", () => {
  const questions = build([
    ["reading", 40],
    ["grammar", 30],
    ["writingAnalysis", 10],
    ["listening", 20],
  ]);

  it("groups grammar and writing analysis into one stage", () => {
    expect(stageKeyOf("grammar")).toBe("structure");
    expect(stageKeyOf("writingAnalysis")).toBe("structure");
    const stages = buildStages(questions, STEP_TOTAL_MINUTES);
    expect(stages.map((s) => [s.key, s.start, s.count])).toEqual([
      ["reading", 0, 40],
      ["structure", 40, 40],
      ["listening", 80, 20],
    ]);
    expect(stages[1]!.sections).toEqual(["grammar", "writingAnalysis"]);
  });

  it("uses the official minutes for the full exam and shares a short exam by question count", () => {
    expect(
      buildStages(questions, STEP_TOTAL_MINUTES).map((s) => s.minutes),
    ).toEqual([60, 30, 25]);
    const placement = build([
      ["reading", 12],
      ["grammar", 6],
      ["writingAnalysis", 3],
      ["listening", 9],
    ]);
    const minutes = buildStages(placement, 35).map((s) => s.minutes);
    expect(minutes).toEqual([14, 11, 11]);
    expect(minutes.every((m) => m >= 1)).toBe(true);
  });

  it("summarises a stage", () => {
    const stage = buildStages(questions, STEP_TOTAL_MINUTES)[2]!;
    const summary = summarizeStage(
      stage,
      questions,
      { listening0: "a", listening1: "b" },
      new Set(["listening1", "reading0"]),
    );
    expect(summary).toEqual({
      total: 20,
      answered: 2,
      unanswered: 18,
      flagged: 1,
    });
  });
});
