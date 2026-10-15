import { describe, expect, it } from "vitest";
import {
  GRAPH_PRACTICE_PASSAGES,
  GRAPH_PRACTICE_QUESTIONS,
} from "./graph-practice";
import { PASSAGE_CHARTS } from "./passage-charts";
import type {
  BarChartSpec,
  LineChartSpec,
  TableChartSpec,
} from "@/types/chart";

const byId = new Map(GRAPH_PRACTICE_QUESTIONS.map((q) => [q.id, q]));
const months: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jul: "July",
  Sep: "September",
  Nov: "November",
};
const full = (m: string | undefined) => months[m ?? ""] ?? m;
const answer = (id: string) => {
  const q = byId.get(id)!;
  return q.options.find((o) => o.id === q.correctOptionId)!.text;
};

describe("graph practice", () => {
  it("gives every passage a chart and links its questions", () => {
    for (const passage of GRAPH_PRACTICE_PASSAGES) {
      expect(PASSAGE_CHARTS[passage.id], passage.id).toBeDefined();
      for (const id of passage.questionIds)
        expect(byId.get(id)?.passageId, id).toBe(passage.id);
    }
    expect(GRAPH_PRACTICE_QUESTIONS).toHaveLength(17);
  });

  it("has well-formed options and every series matches its categories", () => {
    for (const q of GRAPH_PRACTICE_QUESTIONS) {
      expect(new Set(q.options.map((o) => o.text)).size, q.id).toBe(4);
      expect(q.tags, q.id).toContain("graph");
    }
    for (const spec of Object.values(PASSAGE_CHARTS)) {
      if (spec.kind === "bar" || spec.kind === "line") {
        for (const s of spec.series)
          expect(s.values, s.name).toHaveLength(spec.categories.length);
      }
    }
  });

  it("keeps the answer key consistent with the chart data", () => {
    const books = PASSAGE_CHARTS["passage-gp-bookshops"] as BarChartSpec;
    const [noor, corner] = books.series;
    expect(answer("gp-reading-1")).toBe(
      full(books.categories[noor!.values.indexOf(Math.max(...noor!.values))]),
    );
    const overtakes = books.categories.filter(
      (_, i) => corner!.values[i]! > noor!.values[i]!,
    );
    expect(overtakes.map(full)).toEqual([answer("gp-reading-2")]);
    expect(corner!.values[2]! * 1000).toBe(33000);

    const temp = PASSAGE_CHARTS["passage-gp-temperature"] as LineChartSpec;
    const [riyadh, london] = temp.series;
    expect(answer("gp-reading-5")).toBe(
      full(
        temp.categories[london!.values.indexOf(Math.max(...london!.values))],
      ),
    );
    const jul = temp.categories.indexOf("Jul");
    expect(riyadh!.values[jul]! - london!.values[jul]!).toBe(17);
    expect(temp.categories[riyadh!.values.indexOf(31)]).toBe(
      answer("gp-reading-7"),
    );
    expect(riyadh!.values.every((v, i) => v > london!.values[i]!)).toBe(true);

    const table = PASSAGE_CHARTS["passage-gp-cities"] as TableChartSpec;
    for (const [, y2000, y2020, growth] of table.rows) {
      expect(
        Math.round(
          (((y2020 as number) - (y2000 as number)) / (y2000 as number)) * 100,
        ),
      ).toBe(growth);
    }
    const top = [...table.rows].sort(
      (a, b) => (b[3] as number) - (a[3] as number),
    )[0]!;
    expect(top[0]).toBe(answer("gp-reading-12"));

    const act = PASSAGE_CHARTS["passage-gp-activities"] as BarChartSpec;
    const totals = act.categories.map((_, i) =>
      act.series.reduce((sum, s) => sum + s.values[i]!, 0),
    );
    expect(act.categories[totals.indexOf(Math.max(...totals))]).toBe(
      answer("gp-reading-15"),
    );
    const social = act.series.find((s) => s.name === "Social media")!;
    expect(
      act.categories[social.values.indexOf(Math.max(...social.values))],
    ).toBe(answer("gp-reading-16"));
  });
});
