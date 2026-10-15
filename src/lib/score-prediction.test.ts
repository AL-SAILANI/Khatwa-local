import { describe, expect, it } from "vitest";
import { predictScore } from "./score-prediction";
import { SKILLS } from "@/data/skills";
import type { MasteryMap } from "./skill-mastery";

const all = (mastery: number, evidence = 5): MasteryMap =>
  new Map(SKILLS.map((skill) => [skill.id, { mastery, evidence }]));

describe("score prediction", () => {
  it("is 50 for a learner with no evidence and flagged as low confidence", () => {
    const prediction = predictScore(new Map());
    expect(prediction.score).toBe(50);
    expect(prediction.confidence).toBe("low");
  });

  it("follows mastery and respects the section weights", () => {
    expect(predictScore(all(0.9)).score).toBe(90);
    expect(predictScore(all(0.2)).score).toBe(20);

    const readingOnly: MasteryMap = new Map(
      SKILLS.filter((s) => s.section === "reading").map((s) => [
        s.id,
        { mastery: 1, evidence: 5 },
      ]),
    );
    // reading 100%, every other section at the 0.5 prior: 0.4 * 1 + 0.6 * 0.5 = 0.7
    expect(predictScore(readingOnly).score).toBe(70);
  });

  it("reports section scores and gains confidence with enough evidence", () => {
    const prediction = predictScore(all(0.6, 5));
    expect(prediction.bySection.listening).toBe(60);
    expect(prediction.confidence).toBe("ok");
  });
});
