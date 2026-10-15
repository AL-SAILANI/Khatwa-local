import { describe, expect, it } from "vitest";
import {
  niceMax,
  pieSlices,
  seriesMax,
  ticks,
  wedgePath,
} from "./chart-geometry";

describe("chart geometry", () => {
  it("rounds axis ends up to nice numbers", () => {
    expect(niceMax(48)).toBe(50);
    expect(niceMax(37)).toBe(40);
    expect(niceMax(0.8)).toBe(0.8);
    expect(niceMax(0.75)).toBe(0.8);
    expect(niceMax(100)).toBe(100);
    expect(niceMax(0)).toBe(1);
  });

  it("builds ticks including both ends", () => {
    expect(ticks(50)).toEqual([0, 10, 20, 30, 40, 50]);
    expect(ticks(40)).toEqual([0, 10, 20, 30, 40]);
    expect(ticks(2.5)).toEqual([0, 0.5, 1, 1.5, 2, 2.5]);
  });

  it("computes pie shares that add to a full turn", () => {
    const slices = pieSlices([
      { label: "a", value: 40 },
      { label: "b", value: 60 },
    ]);
    expect(slices[0]!.percent).toBeCloseTo(40);
    expect(slices[1]!.end).toBeCloseTo(Math.PI * 2);
  });

  it("draws a closed wedge, and a full circle for a single slice", () => {
    expect(wedgePath(50, 50, 40, 0, Math.PI / 2)).toMatch(/^M 50 50 L .* Z$/);
    expect(wedgePath(50, 50, 40, 0, Math.PI * 2)).toContain("A 40 40");
  });

  it("finds the series maximum for grouped and stacked bars", () => {
    const series = [{ values: [1, 5, 3] }, { values: [4, 2, 6] }];
    expect(seriesMax(series, false)).toBe(6);
    expect(seriesMax(series, true)).toBe(9);
    expect(seriesMax([], false)).toBe(0);
  });
});
