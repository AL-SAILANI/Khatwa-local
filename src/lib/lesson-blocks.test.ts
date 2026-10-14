import { describe, expect, it } from "vitest";
import { buildLessonBlocks, scorePercent, splitNotes } from "./lesson-blocks";
import { SAMPLE_LESSONS } from "@/data/sample-courses";
import { SAMPLE_QUESTIONS } from "@/data/sample-questions";
import type { Lesson } from "@/types/course";
import type { Question } from "@/types/question";

const q = (id: string): Question => ({ ...SAMPLE_QUESTIONS[0]!, id });
const lesson = (notes: string): Lesson => ({ id: "l", courseId: "c", title: "t", order: 0, resources: [], notes, questionIds: [] });
const kinds = (n: number) => buildLessonBlocks(lesson("📌 A\n• x\n🧭 B\n• y\n🔄 C\n• z"), Array.from({ length: n }, (_, i) => q(`q${i}`))).map((b) => b.kind);

describe("lesson blocks", () => {
  it("splits notes by marker group", () => {
    const s = splitNotes("📌 Rule\n• a\n⚠️ Trap\n• b\n🧭 Tech\n• c\n🔄 Rev\n• d");
    expect(s.explain).toContain("Trap");
    expect(s.strategy).toBe("🧭 Tech\n• c");
    expect(s.review).toBe("🔄 Rev\n• d");
  });

  it("builds the expected block order by question count", () => {
    expect(kinds(0)).toEqual(["explain", "strategy", "review"]);
    expect(kinds(1)).toEqual(["explain", "strategy", "exit", "review"]);
    expect(kinds(2)).toEqual(["explain", "strategy", "exit", "review"]);
    expect(kinds(3)).toEqual(["explain", "strategy", "example", "exit", "review"]);
    expect(kinds(6)).toEqual(["explain", "strategy", "example", "guided", "exit", "review"]);
  });

  it("never loses or duplicates a question", () => {
    for (const n of [1, 2, 3, 4, 5, 8]) {
      const blocks = buildLessonBlocks(lesson("📌 A"), Array.from({ length: n }, (_, i) => q(`q${i}`)));
      const ids = blocks.flatMap((b) => (b.kind === "example" ? [b.question.id] : b.kind === "guided" || b.kind === "exit" ? b.questions.map((x) => x.id) : []));
      expect(ids.sort()).toEqual(Array.from({ length: n }, (_, i) => `q${i}`).sort());
    }
  });

  it("always has an exit card for every real lesson with questions", () => {
    const byId = new Map(SAMPLE_QUESTIONS.map((x) => [x.id, x]));
    for (const l of SAMPLE_LESSONS) {
      const qs = l.questionIds.map((id) => byId.get(id)).filter((x): x is Question => Boolean(x));
      if (qs.length === 0) continue;
      expect(buildLessonBlocks(l, qs).some((b) => b.kind === "exit"), l.id).toBe(true);
    }
  });

  it("scores answers", () => {
    const a = q("a");
    expect(scorePercent([a], { a: a.correctOptionId })).toBe(100);
    expect(scorePercent([a], {})).toBe(0);
  });
});
