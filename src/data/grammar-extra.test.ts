import { describe, expect, it } from "vitest";
import { GRAMMAR_EXTRA_QUESTIONS } from "@/data/grammar-extra";
import { suggestLessonForTag } from "@/lib/tag-lesson-map";

describe("grammar practice questions", () => {
  it("are well formed", () => {
    expect(GRAMMAR_EXTRA_QUESTIONS).toHaveLength(8);
    for (const q of GRAMMAR_EXTRA_QUESTIONS) {
      expect(q.section).toBe("grammar");
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
      expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
    }
  });

  it("send weak-skill tags to the new lessons", () => {
    expect(suggestLessonForTag("wish", "grammar")?.id).toBe("lesson-grammar-16");
    expect(suggestLessonForTag("used-to", "grammar")?.id).toBe("lesson-grammar-17");
    expect(suggestLessonForTag("question-tags", "grammar")?.id).toBe("lesson-grammar-14");
  });
});
