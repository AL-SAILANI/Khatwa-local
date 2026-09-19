import { describe, expect, it } from "vitest";
import { THEMATIC_SETS } from "@/data/thematic-sets";
import { SAMPLE_VOCAB_WORDS } from "@/data/sample-vocabulary";

describe("thematic sets", () => {
  it("cover every word in the vocabulary bank exactly once", () => {
    const assigned = THEMATIC_SETS.flatMap((s) => s.wordIds);
    expect(new Set(assigned).size).toBe(assigned.length);
    expect(assigned.length).toBe(SAMPLE_VOCAB_WORDS.length);

    const realIds = new Set(SAMPLE_VOCAB_WORDS.map((w) => w.id));
    for (const id of assigned) expect(realIds.has(id)).toBe(true);
    for (const w of SAMPLE_VOCAB_WORDS) expect(assigned).toContain(w.id);
  });

  it("defines unique ids with localized names in both languages", () => {
    const ids = THEMATIC_SETS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of THEMATIC_SETS) {
      expect(s.nameAr.length).toBeGreaterThan(0);
      expect(s.nameEn.length).toBeGreaterThan(0);
      expect(s.descriptionAr.length).toBeGreaterThan(0);
      expect(s.descriptionEn.length).toBeGreaterThan(0);
    }
  });
});