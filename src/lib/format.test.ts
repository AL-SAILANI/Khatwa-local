import { describe, it, expect, vi } from "vitest";
import { formatRelativeTime, getWeekdayLabels, getMonthYearLabel } from "@/lib/format";

describe("format utilities", () => {
  describe("formatRelativeTime", () => {
    it("should return null for null input", () => {
      expect(formatRelativeTime(null, "ar")).toBeNull();
      expect(formatRelativeTime(null, "en")).toBeNull();
    });

    it("should format future dates correctly", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const future = new Date("2025-01-16T12:00:00Z").toISOString();
      const result = formatRelativeTime(future, "en");

      // Intl.RelativeTimeFormat uses "tomorrow" for 1 day future
      expect(result).toBe("tomorrow");

      vi.useRealTimers();
    });

    it("should format past dates correctly", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const past = new Date("2025-01-14T12:00:00Z").toISOString();
      const result = formatRelativeTime(past, "en");

      // Intl.RelativeTimeFormat uses "yesterday" for 1 day past
      expect(result).toBe("yesterday");

      vi.useRealTimers();
    });

    it("should handle minutes for recent times", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const recent = new Date("2025-01-15T11:55:00Z").toISOString(); // 5 minutes ago
      const result = formatRelativeTime(recent, "en");

      expect(result).toContain("minute");

      vi.useRealTimers();
    });

    it("should handle hours", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const past = new Date("2025-01-15T09:00:00Z").toISOString(); // 3 hours ago
      const result = formatRelativeTime(past, "en");

      expect(result).toContain("hour");

      vi.useRealTimers();
    });

    it("should work with Arabic locale", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const past = new Date("2025-01-14T12:00:00Z").toISOString();
      const result = formatRelativeTime(past, "ar");

      // Arabic relative time format
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");

      vi.useRealTimers();
    });

    it("should handle years", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));

      const past = new Date("2020-01-15T12:00:00Z").toISOString(); // 5 years ago
      const result = formatRelativeTime(past, "en");

      expect(result).toContain("year");

      vi.useRealTimers();
    });
  });

  describe("getWeekdayLabels", () => {
    it("should return 7 labels", () => {
      const labels = getWeekdayLabels("en");
      expect(labels).toHaveLength(7);
    });

    it("should return Arabic labels for Arabic locale", () => {
      const labels = getWeekdayLabels("ar");
      expect(labels).toHaveLength(7);
      // Arabic weekday labels should be in Arabic
      expect(labels[0]).toMatch(/[\u0600-\u06FF]/); // Arabic Unicode range
    });

    it("should return English labels for English locale", () => {
      const labels = getWeekdayLabels("en");
      expect(labels[0]).toMatch(/^(Sun|Mon|Tue|Wed|Thu|Fri|Sat)$/);
    });

    it("should start with Sunday", () => {
      const labelsEn = getWeekdayLabels("en");
      expect(labelsEn[0].toLowerCase()).toContain("sun");

      const labelsAr = getWeekdayLabels("ar");
      // Arabic Sunday is "الأحد"
      expect(labelsAr[0]).toContain("أحد");
    });
  });

  describe("getMonthYearLabel", () => {
    it("should format month and year for Arabic", () => {
      const date = new Date("2025-01-15");
      const result = getMonthYearLabel("ar", date);
      expect(result).toContain("2025");
      expect(result).toMatch(/[\u0600-\u06FF]/); // Arabic characters
    });

    it("should format month and year for English", () => {
      const date = new Date("2025-01-15");
      const result = getMonthYearLabel("en", date);
      expect(result).toContain("January");
      expect(result).toContain("2025");
    });

    it("should handle different months", () => {
      const date = new Date("2025-12-25");
      const result = getMonthYearLabel("en", date);
      expect(result).toContain("December");
      expect(result).toContain("2025");
    });
  });
});