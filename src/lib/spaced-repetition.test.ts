import { describe, it, expect } from "vitest";
import { computeNextReview, NEW_WORD_STATE, retentionRate, type ReviewQuality, type ReviewState } from "@/lib/spaced-repetition";

describe("spaced-repetition (SM-2)", () => {
  describe("computeNextReview", () => {
    it("should set interval to 1 day and reset repetitions for quality 0 (again)", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 10, repetitions: 3 };
      const result = computeNextReview(state, 0);

      expect(result.repetitions).toBe(0);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBe(2.5); // easeFactor unchanged for failed reviews
      expect(result.dueAt).toBeDefined();
    });

    it("should set interval to 1 day and reset repetitions for quality < 3", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 10, repetitions: 3 };
      const result = computeNextReview(state, 0);

      expect(result.repetitions).toBe(0);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBe(2.5); // easeFactor unchanged for failed reviews
      expect(result.dueAt).toBeDefined();
    });

    it("should set interval to 1 day for first successful review (repetitions = 1)", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 0, repetitions: 0 };
      const result = computeNextReview(state, 5);

      expect(result.repetitions).toBe(1);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
      expect(result.dueAt).toBeDefined();
    });

    it("should set interval to 6 days for second successful review (repetitions = 2)", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 1, repetitions: 1 };
      const result = computeNextReview(state, 5);

      expect(result.repetitions).toBe(2);
      expect(result.intervalDays).toBe(6);
      expect(result.dueAt).toBeDefined();
    });

    it("should calculate interval based on easeFactor for subsequent reviews", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 6, repetitions: 2 };
      const result = computeNextReview(state, 5);

      expect(result.repetitions).toBe(3);
      expect(result.intervalDays).toBe(Math.round(6 * 2.5)); // 15
      expect(result.dueAt).toBeDefined();
    });

    it("should not let easeFactor drop below 1.3", () => {
      const state: ReviewState = { easeFactor: 1.3, intervalDays: 10, repetitions: 5 };
      const result = computeNextReview(state, 3); // Hard multiple times

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should increase easeFactor for quality 5 (easy)", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 1, repetitions: 1 };
      const result = computeNextReview(state, 5);

      expect(result.easeFactor).toBeGreaterThan(2.5);
    });

    it("should decrease easeFactor for quality 3 (hard)", () => {
      const state: ReviewState = { easeFactor: 2.5, intervalDays: 1, repetitions: 1 };
      const result = computeNextReview(state, 3);

      expect(result.easeFactor).toBeLessThan(2.5);
    });

    it("should return dueAt as valid ISO string", () => {
      const state = NEW_WORD_STATE;
      const result = computeNextReview(state, 5);

      expect(() => new Date(result.dueAt)).not.toThrow();
      expect(new Date(result.dueAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("should handle NEW_WORD_STATE correctly", () => {
      const result = computeNextReview(NEW_WORD_STATE, 5);

      expect(result.repetitions).toBe(1);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("should handle all quality values", () => {
      const qualities: ReviewQuality[] = [0, 3, 5];
      const state = NEW_WORD_STATE;

      qualities.forEach((quality) => {
        const result = computeNextReview(state, quality);
        expect(result.dueAt).toBeDefined();
        expect(result.repetitions).toBeGreaterThanOrEqual(0);
        expect(result.intervalDays).toBeGreaterThanOrEqual(0);
        expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
      });
    });

    it("should increment lapses on failure and keep it on success", () => {
      const failed = computeNextReview({ easeFactor: 2.5, intervalDays: 6, repetitions: 2 }, 0);
      expect(failed.lapses).toBe(1);
      expect(failed.repetitions).toBe(0);
      expect(failed.intervalDays).toBe(1);

      const again = computeNextReview({ easeFactor: 2.5, intervalDays: 1, repetitions: 0, lapses: 1 }, 0);
      expect(again.lapses).toBe(2);

      const success = computeNextReview({ easeFactor: 2.5, intervalDays: 1, repetitions: 1, lapses: 1 }, 5);
      expect(success.lapses).toBe(1);
    });

    it("retentionRate should be 1 - lapses/reviews and null when empty", () => {
      expect(retentionRate(10, 2)).toBeCloseTo(0.8);
      expect(retentionRate(0, 0)).toBeNull();
    });
  });

  describe("NEW_WORD_STATE", () => {
    it("should have correct default values", () => {
      expect(NEW_WORD_STATE.easeFactor).toBe(2.5);
      expect(NEW_WORD_STATE.intervalDays).toBe(0);
      expect(NEW_WORD_STATE.repetitions).toBe(0);
    });
  });
});