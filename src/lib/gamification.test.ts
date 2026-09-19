import { describe, it, expect } from "vitest";
import { getLevelProgress, MAX_LEVEL } from "@/lib/gamification";

describe("gamification", () => {
  describe("getLevelProgress", () => {
    it("should return level 1 for 0 XP", () => {
      const result = getLevelProgress(0);
      expect(result.level).toBe(1);
      expect(result.xpIntoLevel).toBe(0);
      expect(result.percentToNextLevel).toBe(0);
    });

    it("should return level 1 for XP below first threshold", () => {
      const result = getLevelProgress(50);
      expect(result.level).toBe(1);
      expect(result.xpIntoLevel).toBe(50);
    });

    it("should return level 2 at 100 XP", () => {
      const result = getLevelProgress(100);
      expect(result.level).toBe(2);
      expect(result.xpIntoLevel).toBe(0);
    });

    it("should return correct level for various XP amounts", () => {
      const testCases = [
        { xp: 0, level: 1 },
        { xp: 99, level: 1 },
        { xp: 100, level: 2 },
        { xp: 249, level: 2 },
        { xp: 250, level: 3 },
        { xp: 449, level: 3 },
        { xp: 450, level: 4 },
        { xp: 699, level: 4 },
        { xp: 700, level: 5 },
        { xp: 999, level: 5 },
        { xp: 1000, level: 6 },
        { xp: 1399, level: 6 },
        { xp: 1400, level: 7 },
        { xp: 1899, level: 7 },
        { xp: 1900, level: 8 },
        { xp: 2499, level: 8 },
        { xp: 2500, level: 9 },
        { xp: 3199, level: 9 },
        { xp: 3200, level: 10 },
        { xp: 5000, level: 10 },
      ];

      testCases.forEach(({ xp, level }) => {
        const result = getLevelProgress(xp);
        expect(result.level).toBe(level);
      });
    });

    it("should calculate xpIntoLevel correctly", () => {
      expect(getLevelProgress(150).xpIntoLevel).toBe(50); // 150 - 100
      expect(getLevelProgress(300).xpIntoLevel).toBe(50); // 300 - 250
      expect(getLevelProgress(500).xpIntoLevel).toBe(50); // 500 - 450
    });

    it("should calculate xpForNextLevel correctly", () => {
      // Level 1 -> 2: 100 - 0 = 100
      expect(getLevelProgress(50).xpForNextLevel).toBe(100);

      // Level 2 -> 3: 250 - 100 = 150
      expect(getLevelProgress(150).xpForNextLevel).toBe(150);

      // Level 3 -> 4: 450 - 250 = 200
      expect(getLevelProgress(300).xpForNextLevel).toBe(200);

      // Max level should have null xpForNextLevel
      expect(getLevelProgress(5000).xpForNextLevel).toBeNull();
    });

    it("should calculate percentToNextLevel correctly", () => {
      // Level 1, 50 XP into level, 100 XP needed: 50%
      expect(getLevelProgress(50).percentToNextLevel).toBe(50);

      // Level 2, 50 XP into level, 150 XP needed: 33%
      expect(getLevelProgress(150).percentToNextLevel).toBe(33);

      // Max level should be 100%
      expect(getLevelProgress(5000).percentToNextLevel).toBe(100);
    });

    it("should handle exact threshold values", () => {
      // Exactly at threshold should be at the next level with 0 xpIntoLevel
      expect(getLevelProgress(100).xpIntoLevel).toBe(0);
      expect(getLevelProgress(250).xpIntoLevel).toBe(0);
      expect(getLevelProgress(450).xpIntoLevel).toBe(0);
    });

    it("should never return level higher than MAX_LEVEL", () => {
      expect(getLevelProgress(10000).level).toBe(MAX_LEVEL);
      expect(getLevelProgress(100000).level).toBe(MAX_LEVEL);
    });

    it("should return correct structure for all levels", () => {
      for (let level = 1; level <= MAX_LEVEL; level++) {
        // Find XP that puts us in this level
        const xp = level === 1 ? 0 : 100 + (level - 2) * 50; // rough estimate
        const result = getLevelProgress(xp);
        expect(result.level).toBeLessThanOrEqual(MAX_LEVEL);
        expect(result.xpIntoLevel).toBeGreaterThanOrEqual(0);
        expect(result.percentToNextLevel).toBeGreaterThanOrEqual(0);
        expect(result.percentToNextLevel).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("MAX_LEVEL", () => {
    it("should be 10", () => {
      expect(MAX_LEVEL).toBe(10);
    });
  });
});