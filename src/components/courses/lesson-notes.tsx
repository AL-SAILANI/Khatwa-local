import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Clock,
  Compass,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Lessons ship their notes as a single flat string using emoji section
 * markers (📌 ⚡ ⚠️ 🔄 🧭). This component parses that string into the
 * known pedagogical blocks and renders each one as a distinct, styled
 * card — instead of dumping the whole note as one paragraph of text.
 *
 * The section titles are read from the note itself (locale-agnostic), so
 * both the Arabic and English content render with their own headings. If
 * the string doesn't match the expected shape at all it falls back to a
 * plain paragraph.
 */

type SectionMarker = "📌" | "⚡" | "⚠️" | "🔄" | "🧭";

const SECTION_MARKERS: SectionMarker[] = ["📌", "⚡", "⚠️", "🔄", "🧭"];

interface LessonSection {
  marker: SectionMarker | "";
  title: string;
  lines: string[];
}

const SECTION_STYLES: Record<SectionMarker, { icon: LucideIcon; border: string; tint: string; titleColor: string }> = {
  "📌": {
    icon: BookOpen,
    border: "border-primary-200 dark:border-primary-500/30",
    tint: "bg-primary-50/60 dark:bg-primary-500/5",
    titleColor: "text-ink-violet dark:text-primary-300",
  },
  "⚡": {
    icon: Zap,
    border: "border-amber-400/50 dark:border-amber-500/30",
    tint: "bg-amber-50/60 dark:bg-amber-500/5",
    titleColor: "text-amber-900 dark:text-amber-300",
  },
  "⚠️": {
    icon: TriangleAlert,
    border: "border-error/30 dark:border-error/40",
    tint: "bg-error/5 dark:bg-error/10",
    titleColor: "text-error-600 dark:text-error-300",
  },
  "🔄": {
    icon: CalendarClock,
    border: "border-secondary-400/50 dark:border-secondary-500/30",
    tint: "bg-secondary-100/60 dark:bg-secondary-500/10",
    titleColor: "text-secondary-800 dark:text-secondary-300",
  },
  "🧭": {
    icon: Compass,
    border: "border-violet-300 dark:border-violet-500/30",
    tint: "bg-violet-50/60 dark:bg-violet-500/5",
    titleColor: "text-violet-600 dark:text-violet-300",
  },
};

const LATIN_RUN = /([A-Za-z][A-Za-z0-9'’/.-]*(?:\s+[A-Za-z][A-Za-z0-9'’/.-]*)*)/;

/** Highlights English words and phrases inside Arabic text so they stand out. */
function rich(text: string): React.ReactNode[] {
  return text.split(LATIN_RUN).map((part, i) => {
    if (i % 2 === 0) return part;
    const isPhrase = part.trim().split(/\s+/).length <= 4;
    return (
      <bdi
        key={i}
        dir="ltr"
        className={
          isPhrase
            ? "rounded-sm bg-butter-yellow/50 px-1 font-semibold dark:bg-butter-yellow/20"
            : "font-medium"
        }
      >
        {part}
      </bdi>
    );
  });
}

function findMarker(line: string): SectionMarker | "" {
  for (const marker of SECTION_MARKERS) {
    if (line.startsWith(marker)) return marker;
  }
  return "";
}

function parseNotes(notes: string): LessonSection[] {
  const sections: LessonSection[] = [];
  let current: LessonSection | null = null;

  for (const rawLine of notes.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const marker = findMarker(line);
    if (marker) {
      current = { marker, title: line.slice(marker.length).replace(/[:\s]+$/, ""), lines: [] };
      sections.push(current);
      continue;
    }

    if (current) {
      current.lines.push(line);
    } else {
      sections.push({ marker: "", title: "", lines: [line] });
    }
  }

  return sections;
}

function SectionBody({ lines, marker }: { lines: string[]; marker: SectionMarker | "" }) {
  const nodes: React.ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length === 0) return;
    nodes.push(
      <ul key={`ul-${key++}`} className="space-y-2.5">
        {bullets.map((item, index) => {
          const [clue, ...rest] = item.split("←");
          const action = rest.join("←").trim();
          if (action) {
            return (
              <li
                key={index}
                className="space-y-1 border-s-2 border-deep-teal/50 ps-3"
              >
                <p className="text-sm font-semibold leading-relaxed">
                  {rich(clue!.trim())}
                </p>
                <p className="flex items-start gap-1.5 text-sm leading-relaxed text-foreground/90">
                  <ArrowLeft className="mt-1 size-4 shrink-0 text-deep-teal dark:text-mint-400" />
                  <span>{rich(action)}</span>
                </p>
              </li>
            );
          }
          return (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "mt-2 size-1.5 shrink-0 rounded-full",
                  marker === "🧭"
                    ? "bg-violet-500"
                    : marker === "⚠️"
                      ? "bg-error"
                      : "bg-deep-teal dark:bg-mint-400",
                )}
              />
              <span className="text-sm leading-relaxed text-foreground/90">
                {rich(item)}
              </span>
            </li>
          );
        })}
      </ul>,
    );
    bullets = [];
  };

  for (const line of lines) {
    if (line.startsWith("•")) {
      bullets.push(line.replace(/^•\s*/, ""));
      continue;
    }
    flushBullets();

    if (line.startsWith("⏱️")) {
      nodes.push(
        <div
          key={`tip-${key++}`}
          className="flex items-start gap-2.5 rounded-xl border border-amber-400/40 bg-amber-50 p-3 dark:border-amber-500/30 dark:bg-amber-500/10"
        >
          <Clock className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">
            {rich(line.replace(/^⏱️\s*/, ""))}
          </span>
        </div>,
      );
      continue;
    }

    nodes.push(
      <p
        key={`p-${key++}`}
        className={cn(
          "leading-relaxed text-foreground/90",
          marker === "📌" ? "text-base font-medium" : "text-sm",
        )}
      >
        {rich(line)}
      </p>,
    );
  }
  flushBullets();

  return <div className="space-y-3">{nodes}</div>;
}

export function LessonNotes({ notes }: { notes: string }) {
  const sections = parseNotes(notes);
  const structured = sections.some((section) => section.marker !== "");

  if (!structured) {
    return <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">{notes}</p>;
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        if (section.marker === "") {
          return (
            <p key={index} className="text-sm leading-relaxed text-foreground/90">
              {section.lines.join(" ")}
            </p>
          );
        }

        const style = SECTION_STYLES[section.marker];
        const Icon = style.icon;

        return (
          <section
            key={index}
            aria-label={section.title}
            className={cn(
              "lesson-rise overflow-hidden rounded-2xl border border-s-4",
              style.border,
              style.tint,
            )}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <header className="flex items-center gap-2.5 border-b border-border/60 px-4 py-3">
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface shadow-sm">
                <Icon className={cn("size-5", style.titleColor)} />
              </span>
              <h3 className={cn("text-base font-bold", style.titleColor)}>{section.title}</h3>
            </header>
            <div className="px-4 py-4">
              <SectionBody lines={section.lines} marker={section.marker} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
