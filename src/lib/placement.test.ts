import { describe, expect, it } from "vitest";
import {
  PLACEMENT_COUNTS,
  PLACEMENT_TOTAL_QUESTIONS,
  bandFromScore,
  focusSections,
  pickBalanced,
  pickReadingByPassage,
} from "@/lib/placement";
import type { Question } from "@/types/question";

function q(id: string, difficulty: Question["difficulty"], passageId?: string): Question {
  return {
    id,
    section: passageId ? "reading" : "grammar",
    passageId,
    prompt: id,
    options: [{ id: "a", text: "a" }],
    correctOptionId: "a",
    explanation: "",
    difficulty,
    tags: [],
  };
}

// Deterministic rng so assertions are stable.
function seeded(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

describe("placement blueprint", () => {
  it("keeps the official 40/40/20 weights (grammar block = grammar + writing analysis)", () => {
    expect(PLACEMENT_TOTAL_QUESTIONS).toBe(30);
    expect(PLACEMENT_COUNTS.reading / PLACEMENT_TOTAL_QUESTIONS).toBeCloseTo(0.4);
    expect((PLACEMENT_COUNTS.grammar + PLACEMENT_COUNTS.writingAnalysis) / PLACEMENT_TOTAL_QUESTIONS).toBeCloseTo(0.4);
    expect(PLACEMENT_COUNTS.listening / PLACEMENT_TOTAL_QUESTIONS).toBeCloseTo(0.2);
  });
});

describe("pickBalanced", () => {
  const pool = [
    ...Array.from({ length: 20 }, (_, i) => q(`e${i}`, "easy")),
    ...Array.from({ length: 20 }, (_, i) => q(`m${i}`, "medium")),
    ...Array.from({ length: 20 }, (_, i) => q(`h${i}`, "hard")),
  ];

  it("returns the requested count with a 40/40/20 difficulty mix", () => {
    const picked = pickBalanced(pool, 10, seeded());
    expect(picked).toHaveLength(10);
    const count = (d: string) => picked.filter((x) => x.difficulty === d).length;
    expect([count("easy"), count("medium"), count("hard")]).toEqual([4, 4, 2]);
    expect(new Set(picked.map((x) => x.id)).size).toBe(10);
  });

  it("tops up from other difficulties when a bucket is short", () => {
    const small = [q("e1", "easy"), ...Array.from({ length: 8 }, (_, i) => q(`m${i}`, "medium"))];
    const picked = pickBalanced(small, 6, seeded());
    expect(picked).toHaveLength(6);
    expect(new Set(picked.map((x) => x.id)).size).toBe(6);
  });

  it("returns everything when the pool is smaller than the request", () => {
    expect(pickBalanced(pool.slice(0, 3), 10, seeded())).toHaveLength(3);
  });
});

describe("pickReadingByPassage", () => {
  const pool = [
    ...["a", "b", "c", "d", "e"].flatMap((p) =>
      Array.from({ length: 4 }, (_, i) => q(`${p}${i}`, "medium", `passage-${p}`)),
    ),
  ];

  it("keeps passage questions together and hits the target count", () => {
    const picked = pickReadingByPassage(pool, 10, seeded());
    expect(picked).toHaveLength(10);
    const passages = new Set(picked.map((x) => x.passageId));
    expect(passages.size).toBeLessThanOrEqual(3);
  });

  it("does not repeat questions", () => {
    const picked = pickReadingByPassage(pool, 12, seeded(3));
    expect(new Set(picked.map((x) => x.id)).size).toBe(picked.length);
  });
});

describe("bandFromScore", () => {
  it("uses the guide's score bands", () => {
    expect(bandFromScore(0)).toBe("foundation");
    expect(bandFromScore(39)).toBe("foundation");
    expect(bandFromScore(40)).toBe("beginner");
    expect(bandFromScore(59)).toBe("beginner");
    expect(bandFromScore(60)).toBe("intermediate");
    expect(bandFromScore(79)).toBe("intermediate");
    expect(bandFromScore(80)).toBe("advanced");
    expect(bandFromScore(100)).toBe("advanced");
  });
});

describe("focusSections", () => {
  it("orders sections by exam points lost, not raw accuracy", () => {
    const result = focusSections([
      { section: "reading", correct: 6, total: 12, timeSpentSeconds: 0 }, // 50% x 40% = 20 pts
      { section: "listening", correct: 0, total: 6, timeSpentSeconds: 0 }, // 100% x 20% = 20 pts... tie broken below
      { section: "writingAnalysis", correct: 0, total: 3, timeSpentSeconds: 0 }, // 100% x 10% = 10 pts
      { section: "grammar", correct: 9, total: 9, timeSpentSeconds: 0 }, // 0 pts
    ]);
    expect(result.map((r) => r.section)).toEqual(["reading", "listening", "writingAnalysis", "grammar"]);
    expect(result[0]).toMatchObject({ percentCorrect: 50, pointsLost: 20 });
    expect(result[3].pointsLost).toBe(0);
  });

  it("skips sections with no questions", () => {
    expect(focusSections([{ section: "reading", correct: 0, total: 0, timeSpentSeconds: 0 }])).toEqual([]);
  });
});
