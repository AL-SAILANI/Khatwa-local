import type { ChartSpec } from "@/types/chart";

/**
 * Charts and tables that belong to reading passages, keyed by passage id.
 * Kept in code (not in the passages table) so no schema change is needed:
 * the database only stores the passage's short introduction.
 */
export const PASSAGE_CHARTS: Record<string, ChartSpec> = {
  "passage-gp-bookshops": {
    kind: "bar",
    orientation: "vertical",
    title: "Monthly sales of two bookshops",
    unit: "Sales in thousand riyals",
    categories: ["Jan", "Feb", "Mar", "Apr", "May"],
    categoryLabel: "Month",
    valueLabel: "Thousand riyals",
    series: [
      { name: "Al-Noor", values: [42, 38, 45, 50, 47] },
      { name: "Reader's Corner", values: [30, 35, 33, 41, 48] },
    ],
  },
  "passage-gp-temperature": {
    kind: "line",
    title: "Average temperature in two cities",
    unit: "Degrees Celsius",
    categories: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"],
    categoryLabel: "Month",
    valueLabel: "°C",
    series: [
      { name: "Riyadh", values: [14, 21, 31, 36, 33, 21] },
      { name: "London", values: [5, 8, 13, 19, 16, 8] },
    ],
  },
  "passage-gp-transport": {
    kind: "pie",
    title: "How students travel to school",
    unit: "Percent of students",
    slices: [
      { label: "Bus", value: 40 },
      { label: "Car", value: 25 },
      { label: "Walking", value: 20 },
      { label: "Bicycle", value: 10 },
      { label: "Other", value: 5 },
    ],
  },
  "passage-gp-cities": {
    kind: "table",
    title: "Population of four cities",
    unit: "Population in thousands",
    columns: ["City", "Population in 2000", "Population in 2020", "Growth (%)"],
    rows: [
      ["Harbour City", 800, 1200, 50],
      ["Green Valley", 450, 540, 20],
      ["Stone Bridge", 600, 960, 60],
      ["Lake Town", 300, 330, 10],
    ],
  },
  "passage-gp-activities": {
    kind: "bar",
    orientation: "horizontal",
    stacked: true,
    title: "How three students spend their week",
    unit: "Hours per week",
    categories: ["Ali", "Sara", "Omar"],
    valueLabel: "Hours per week",
    series: [
      { name: "Study", values: [20, 25, 15] },
      { name: "Sport", values: [5, 8, 10] },
      { name: "Social media", values: [10, 6, 12] },
    ],
  },
};

export function chartForPassage(passageId: string): ChartSpec | undefined {
  return PASSAGE_CHARTS[passageId];
}
