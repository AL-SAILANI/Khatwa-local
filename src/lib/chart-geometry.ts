/** Pure helpers for the passage chart: scales, ticks and pie arcs. */

/** Rounds a maximum value up to a "nice" axis end (1, 1.5, 2, 2.5, 3, 4, 5, 6, 8 or 10 times a power of ten). */
export function niceMax(max: number): number {
  if (max <= 0) return 1;
  const exponent = Math.floor(Math.log10(max));
  const base = 10 ** exponent;
  for (const step of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) {
    if (max <= step * base) return step * base;
  }
  return 10 * base;
}

const NICE_STEPS = [1, 2, 2.5, 5];

function isNiceStep(step: number): boolean {
  if (step <= 0) return false;
  const base = 10 ** Math.floor(Math.log10(step));
  const lead = Math.round((step / base) * 1000) / 1000;
  return NICE_STEPS.includes(lead);
}

/** Evenly spaced tick values from 0 to `end`, always including both ends; prefers round steps. */
export function ticks(end: number): number[] {
  const count = [5, 4, 6, 3, 8, 10, 2].find((c) => isNiceStep(end / c)) ?? 5;
  const step = end / count;
  return Array.from(
    { length: count + 1 },
    (_, i) => Math.round(step * i * 1000) / 1000,
  );
}

export interface PieSlice {
  label: string;
  value: number;
  percent: number;
  /** Radians, measured clockwise from 12 o'clock. */
  start: number;
  end: number;
}

export function pieSlices(
  slices: { label: string; value: number }[],
): PieSlice[] {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let angle = 0;
  return slices.map((slice) => {
    const share = total === 0 ? 0 : slice.value / total;
    const start = angle;
    angle += share * Math.PI * 2;
    return { ...slice, percent: share * 100, start, end: angle };
  });
}

/** SVG path for one pie wedge centred on (cx, cy). */
export function wedgePath(
  cx: number,
  cy: number,
  r: number,
  start: number,
  end: number,
): string {
  if (end - start >= Math.PI * 2 - 1e-9) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.001} ${cy - r} Z`;
  }
  const point = (a: number) =>
    [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;
  const [x1, y1] = point(start);
  const [x2, y2] = point(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
}

/** Highest total across categories: sums series when stacked, otherwise the largest single value. */
export function seriesMax(
  series: { values: number[] }[],
  stacked: boolean,
): number {
  if (series.length === 0) return 0;
  const length = Math.max(...series.map((s) => s.values.length));
  let max = 0;
  for (let i = 0; i < length; i += 1) {
    const column = series.map((s) => s.values[i] ?? 0);
    max = Math.max(
      max,
      stacked ? column.reduce((a, b) => a + b, 0) : Math.max(...column),
    );
  }
  return max;
}
