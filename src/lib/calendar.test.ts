import { describe, it, expect, vi } from "vitest";
import {
  getWeekActiveDays,
  getStudiedDaysInCurrentMonth,
  getStudiedDaysInMonth,
  getRunEndingOn,
  toDateKey,
} from "@/lib/calendar";

describe("calendar utilities", () => {
  describe("toDateKey", () => {
    it("should format date as YYYY-MM-DD", () => {
      const date = new Date("2025-01-15T10:30:00Z");
      expect(toDateKey(date)).toBe("2025-01-15");
    });

    it("should handle different dates", () => {
      expect(toDateKey(new Date("2024-12-25T00:00:00Z"))).toBe("2024-12-25");
      expect(toDateKey(new Date("2025-06-05T23:59:59Z"))).toBe("2025-06-05");
    });
  });

  describe("getWeekActiveDays", () => {
    it("should return 7 booleans for the week", () => {
      const result = getWeekActiveDays([]);
      expect(result).toHaveLength(7);
      expect(result.every((v) => v === false)).toBe(true);
    });

    it("should mark days as active when present in recentActivityDays", () => {
      // Mock current date to a known Sunday
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-12T12:00:00Z")); // Sunday

      const activityDays = ["2025-01-12", "2025-01-14", "2025-01-16"]; // Sun, Tue, Thu
      const result = getWeekActiveDays(activityDays);

      expect(result[0]).toBe(true);  // Sunday
      expect(result[1]).toBe(false); // Monday
      expect(result[2]).toBe(true);  // Tuesday
      expect(result[3]).toBe(false); // Wednesday
      expect(result[4]).toBe(true);  // Thursday
      expect(result[5]).toBe(false); // Friday
      expect(result[6]).toBe(false); // Saturday

      vi.useRealTimers();
    });

    it("should handle activity days from previous week", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-12T12:00:00Z")); // Sunday

      const activityDays = ["2025-01-05", "2025-01-06"]; // Previous week
      const result = getWeekActiveDays(activityDays);

      expect(result.every((v) => v === false)).toBe(true);

      vi.useRealTimers();
    });

    it("should handle empty activity days", () => {
      const result = getWeekActiveDays([]);
      expect(result).toEqual([false, false, false, false, false, false, false]);
    });

    it("should handle activity days in future", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-12T12:00:00Z"));

      const activityDays = ["2025-01-20"]; // Next week
      const result = getWeekActiveDays(activityDays);

      expect(result.every((v) => v === false)).toBe(true);

      vi.useRealTimers();
    });
  });

  describe("getStudiedDaysInCurrentMonth", () => {
    it("should return day numbers for current month", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const activityDays = ["2025-01-01", "2025-01-10", "2025-01-20", "2024-12-25", "2025-02-01"];
      const result = getStudiedDaysInCurrentMonth(activityDays);

      expect(result).toEqual([1, 10, 20]);
      expect(result).not.toContain(25); // December 25th filtered out
      // February 1st is filtered out (different month), January 1st is included

      vi.useRealTimers();
    });

    it("should return empty array for no activity days", () => {
      const result = getStudiedDaysInCurrentMonth([]);
      expect(result).toEqual([]);
    });

    it("should handle activity days only from other months", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const activityDays = ["2024-12-25", "2025-02-01"];
      const result = getStudiedDaysInCurrentMonth(activityDays);

      expect(result).toEqual([]);

      vi.useRealTimers();
    });

    it("should return sorted unique day numbers", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const activityDays = ["2025-01-20", "2025-01-01", "2025-01-10", "2025-01-10"]; // duplicate
      const result = getStudiedDaysInCurrentMonth(activityDays);

      expect(result).toEqual([1, 10, 20]); // sorted and deduplicated

      vi.useRealTimers();
    });

    it("should handle month boundaries correctly", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-02-28T12:00:00Z")); // February 28

      const activityDays = ["2025-02-28", "2025-02-01", "2025-01-31"];
      const result = getStudiedDaysInCurrentMonth(activityDays);

      expect(result).toEqual([1, 28]);

      vi.useRealTimers();
    });
  });

  describe("getStudiedDaysInMonth", () => {
    it("should return day numbers for an arbitrary month", () => {
      const activityDays = ["2025-03-05", "2025-03-20", "2025-04-01"];
      const result = getStudiedDaysInMonth(activityDays, 2025, 2); // March (0-indexed)

      expect(result).toEqual([5, 20]);
    });

    it("should return empty array when month has no activity", () => {
      const result = getStudiedDaysInMonth(["2025-01-01"], 2025, 5);
      expect(result).toEqual([]);
    });
  });

  describe("getRunEndingOn", () => {
    it("should return 0 for a non-studied day", () => {
      const activityDays = ["2025-01-05", "2025-01-07"];
      expect(getRunEndingOn(activityDays, 2025, 0, 6)).toBe(0);
    });

    it("should count consecutive days ending on the given day", () => {
      const activityDays = ["2025-01-05", "2025-01-06", "2025-01-07", "2025-01-09"];
      expect(getRunEndingOn(activityDays, 2025, 0, 7)).toBe(3);
      expect(getRunEndingOn(activityDays, 2025, 0, 5)).toBe(1);
      expect(getRunEndingOn(activityDays, 2025, 0, 9)).toBe(1);
    });

    it("should run across month boundaries", () => {
      const activityDays = ["2025-01-30", "2025-01-31", "2025-02-01"];
      // Feb 1 counts the run that started on Jan 30
      expect(getRunEndingOn(activityDays, 2025, 1, 1)).toBe(3);
      // Jan 31 counts Jan 30-31
      expect(getRunEndingOn(activityDays, 2025, 0, 31)).toBe(2);
    });
  });
});