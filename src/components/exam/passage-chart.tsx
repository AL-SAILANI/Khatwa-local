import {
  niceMax,
  pieSlices,
  seriesMax,
  ticks,
  wedgePath,
} from "@/lib/chart-geometry";
import { cn } from "@/lib/utils/cn";
import type {
  BarChartSpec,
  ChartSeries,
  ChartSpec,
  LineChartSpec,
  PieChartSpec,
  TableChartSpec,
} from "@/types/chart";

/** Full class names so Tailwind can see them. Order matches the legend. */
const FILL = [
  "fill-violet-500",
  "fill-amber-500",
  "fill-mint-500",
  "fill-deep-teal",
  "fill-secondary-400",
];
const STROKE = [
  "stroke-violet-500",
  "stroke-amber-500",
  "stroke-mint-500",
  "stroke-deep-teal",
  "stroke-secondary-400",
];
const SWATCH = [
  "bg-violet-500",
  "bg-amber-500",
  "bg-mint-500",
  "bg-deep-teal",
  "bg-secondary-400",
];

const W = 640;
const H = 320;

function Legend({ names }: { names: string[] }) {
  return (
    <ul className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
      {names.map((name, i) => (
        <li key={name} className="flex items-center gap-2">
          <span
            className={cn("inline-block size-3", SWATCH[i % SWATCH.length])}
            aria-hidden
          />
          {name}
        </li>
      ))}
    </ul>
  );
}

function Axes({
  max,
  horizontal,
  ml,
  mt,
  pw,
  ph,
}: {
  max: number;
  horizontal: boolean;
  ml: number;
  mt: number;
  pw: number;
  ph: number;
}) {
  return (
    <g className="text-xs">
      {ticks(max).map((value) => {
        const pos = horizontal
          ? ml + (pw * value) / max
          : mt + ph * (1 - value / max);
        return (
          <g key={value}>
            {horizontal ? (
              <>
                <line
                  x1={pos}
                  x2={pos}
                  y1={mt}
                  y2={mt + ph}
                  className="stroke-border"
                />
                <text
                  x={pos}
                  y={mt + ph + 16}
                  textAnchor="middle"
                  className="fill-muted"
                >
                  {value}
                </text>
              </>
            ) : (
              <>
                <line
                  x1={ml}
                  x2={ml + pw}
                  y1={pos}
                  y2={pos}
                  className="stroke-border"
                />
                <text
                  x={ml - 8}
                  y={pos + 4}
                  textAnchor="end"
                  className="fill-muted"
                >
                  {value}
                </text>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

function BarChart({ spec }: { spec: BarChartSpec }) {
  const horizontal = spec.orientation === "horizontal";
  const stacked = Boolean(spec.stacked);
  const max = niceMax(seriesMax(spec.series, stacked));
  const ml = horizontal ? 92 : 56;
  const mt = 16;
  const mr = 16;
  const mb = 60;
  const pw = W - ml - mr;
  const ph = H - mt - mb;
  const count = spec.categories.length;
  const band = (horizontal ? ph : pw) / count;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
      <Axes max={max} horizontal={horizontal} ml={ml} mt={mt} pw={pw} ph={ph} />
      {spec.categories.map((category, i) => {
        const bandStart = (horizontal ? mt : ml) + band * i;
        const label = horizontal ? (
          <text
            x={ml - 8}
            y={bandStart + band / 2 + 4}
            textAnchor="end"
            className="fill-current text-xs"
          >
            {category}
          </text>
        ) : (
          <text
            x={bandStart + band / 2}
            y={mt + ph + 22}
            textAnchor="middle"
            className="fill-current text-xs"
          >
            {category}
          </text>
        );

        let offset = 0;
        const bars = spec.series.map((series, s) => {
          const value = series.values[i] ?? 0;
          const length = ((horizontal ? pw : ph) * value) / max;
          const thickness = stacked
            ? band * 0.55
            : (band * 0.72) / spec.series.length;
          const across = stacked
            ? bandStart + (band - thickness) / 2
            : bandStart + band * 0.14 + thickness * s;
          const along = stacked ? offset : 0;
          if (stacked) offset += length;
          return horizontal ? (
            <rect
              key={series.name}
              x={ml + along}
              y={across}
              width={length}
              height={thickness}
              className={FILL[s % FILL.length]}
            />
          ) : (
            <rect
              key={series.name}
              x={across}
              y={mt + ph - length - along}
              width={thickness}
              height={length}
              className={FILL[s % FILL.length]}
            />
          );
        });
        return (
          <g key={category}>
            {bars}
            {label}
          </g>
        );
      })}
      <line
        x1={ml}
        x2={ml + pw}
        y1={mt + ph}
        y2={mt + ph}
        className="stroke-foreground/40"
      />
      <line
        x1={ml}
        x2={ml}
        y1={mt}
        y2={mt + ph}
        className="stroke-foreground/40"
      />
      {spec.valueLabel && (
        <text
          x={horizontal ? ml + pw / 2 : 14}
          y={horizontal ? H - 8 : mt + ph / 2}
          textAnchor="middle"
          transform={horizontal ? undefined : `rotate(-90 14 ${mt + ph / 2})`}
          className="fill-muted text-xs"
        >
          {spec.valueLabel}
        </text>
      )}
      {spec.categoryLabel && (
        <text
          x={horizontal ? 14 : ml + pw / 2}
          y={horizontal ? mt + ph / 2 : H - 8}
          textAnchor="middle"
          transform={horizontal ? `rotate(-90 14 ${mt + ph / 2})` : undefined}
          className="fill-muted text-xs"
        >
          {spec.categoryLabel}
        </text>
      )}
    </svg>
  );
}

function LineChart({ spec }: { spec: LineChartSpec }) {
  const max = niceMax(seriesMax(spec.series, false));
  const ml = 56;
  const mt = 16;
  const pw = W - ml - 16;
  const ph = H - mt - 60;
  const band = pw / spec.categories.length;
  const x = (i: number) => ml + band * (i + 0.5);
  const y = (value: number) => mt + ph * (1 - value / max);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
      <Axes max={max} horizontal={false} ml={ml} mt={mt} pw={pw} ph={ph} />
      {spec.categories.map((category, i) => (
        <text
          key={category}
          x={x(i)}
          y={mt + ph + 22}
          textAnchor="middle"
          className="fill-current text-xs"
        >
          {category}
        </text>
      ))}
      <line
        x1={ml}
        x2={ml + pw}
        y1={mt + ph}
        y2={mt + ph}
        className="stroke-foreground/40"
      />
      <line
        x1={ml}
        x2={ml}
        y1={mt}
        y2={mt + ph}
        className="stroke-foreground/40"
      />
      {spec.series.map((series: ChartSeries, s) => (
        <g key={series.name}>
          <polyline
            fill="none"
            strokeWidth={3}
            className={STROKE[s % STROKE.length]}
            points={series.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
          />
          {series.values.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={4}
              className={FILL[s % FILL.length]}
            />
          ))}
        </g>
      ))}
      {spec.valueLabel && (
        <text
          x={14}
          y={mt + ph / 2}
          textAnchor="middle"
          transform={`rotate(-90 14 ${mt + ph / 2})`}
          className="fill-muted text-xs"
        >
          {spec.valueLabel}
        </text>
      )}
      {spec.categoryLabel && (
        <text
          x={ml + pw / 2}
          y={H - 8}
          textAnchor="middle"
          className="fill-muted text-xs"
        >
          {spec.categoryLabel}
        </text>
      )}
    </svg>
  );
}

function PieChart({ spec }: { spec: PieChartSpec }) {
  const slices = pieSlices(spec.slices);
  const cx = W / 2;
  const cy = H / 2;
  const r = 120;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
      {slices.map((slice, i) => {
        const mid = (slice.start + slice.end) / 2;
        return (
          <g key={slice.label}>
            <path
              d={wedgePath(cx, cy, r, slice.start, slice.end)}
              className={cn(FILL[i % FILL.length], "stroke-background")}
              strokeWidth={2}
            />
            <text
              x={cx + (r + 26) * Math.sin(mid)}
              y={cy - (r + 26) * Math.cos(mid) + 4}
              textAnchor="middle"
              className="fill-current text-sm font-semibold"
            >
              {Math.round(slice.percent)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ChartTable({ spec }: { spec: TableChartSpec }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {spec.columns.map((column) => (
              <th
                key={column}
                className="border border-border bg-surface-muted px-3 py-2 text-start font-semibold"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {spec.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border border-border px-3 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Plain-text version of the data for screen readers (the visual chart is hidden from them). */
function describe(spec: ChartSpec): string {
  switch (spec.kind) {
    case "bar":
    case "line":
      return spec.series
        .map(
          (s) =>
            `${s.name}: ${spec.categories.map((c, i) => `${c} ${s.values[i]}`).join(", ")}`,
        )
        .join(". ");
    case "pie":
      return spec.slices.map((s) => `${s.label} ${s.value}`).join(", ");
    case "table":
      return "";
  }
}

/**
 * Chart or table for a reading passage (bar, stacked bar, line, pie, table).
 * Data is drawn from the spec only; the numbers are not printed on bars, so the
 * learner has to read values off the axes, as in the real exam.
 */
export function PassageChart({ spec }: { spec: ChartSpec }) {
  const legendNames =
    spec.kind === "pie"
      ? spec.slices.map((s) => s.label)
      : spec.kind === "table"
        ? []
        : spec.series.length > 1 || spec.kind === "line"
          ? spec.series.map((s) => s.name)
          : [];

  return (
    <figure className="border border-border bg-surface p-4" dir="ltr">
      <figcaption className="text-center">
        <span className="block font-semibold">{spec.title}</span>
        <span className="block text-sm text-muted">{spec.unit}</span>
      </figcaption>
      <div
        className="mt-3"
        {...(spec.kind === "table"
          ? {}
          : {
              role: "img",
              "aria-label": `${spec.title}. ${spec.unit}. ${describe(spec)}`,
            })}
      >
        {spec.kind === "bar" && <BarChart spec={spec} />}
        {spec.kind === "line" && <LineChart spec={spec} />}
        {spec.kind === "pie" && <PieChart spec={spec} />}
        {spec.kind === "table" && <ChartTable spec={spec} />}
      </div>
      {legendNames.length > 0 && <Legend names={legendNames} />}
    </figure>
  );
}
