export interface ChartSeries {
  name: string;
  values: number[];
}

interface ChartBase {
  title: string;
  /** Printed under the title, for example "Thousand riyals" or "Percent". */
  unit: string;
}

export interface BarChartSpec extends ChartBase {
  kind: "bar";
  orientation: "vertical" | "horizontal";
  /** Segments share one bar instead of standing side by side. */
  stacked?: boolean;
  categories: string[];
  series: ChartSeries[];
  categoryLabel?: string;
  valueLabel?: string;
}

export interface LineChartSpec extends ChartBase {
  kind: "line";
  categories: string[];
  series: ChartSeries[];
  categoryLabel?: string;
  valueLabel?: string;
}

export interface PieChartSpec extends ChartBase {
  kind: "pie";
  slices: { label: string; value: number }[];
}

export interface TableChartSpec extends ChartBase {
  kind: "table";
  columns: string[];
  rows: (string | number)[][];
}

export type ChartSpec =
  | BarChartSpec
  | LineChartSpec
  | PieChartSpec
  | TableChartSpec;
