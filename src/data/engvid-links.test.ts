import { describe, expect, it } from "vitest";
import { ENGVID_LINKS } from "./engvid-links";
import { SAMPLE_LESSONS } from "./sample-courses";
import { TYPE_LESSONS } from "./type-lessons";

describe("engVid links", () => {
  const lessonIds = new Set(SAMPLE_LESSONS.map((l) => l.id));

  it("point to real grammar lessons", () => {
    for (const id of Object.keys(ENGVID_LINKS)) {
      expect(lessonIds.has(id), id).toBe(true);
      expect(id.startsWith("lesson-grammar-"), id).toBe(true);
    }
  });

  it("are https engvid.com links with a title and provider", () => {
    for (const links of Object.values(ENGVID_LINKS)) {
      for (const l of links) {
        expect(["link", "youtube"]).toContain(l.type);
        expect(l.url).toMatch(/^https:\/\/www\.engvid\.com\/[a-z0-9/-]+\/$/);
        if (l.type === "youtube")
          expect(l.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(l.title.length).toBeGreaterThan(3);
        expect(l.provider).toBe("engVid");
      }
    }
  });

  it("are attached to the lessons and not duplicated", () => {
    const seen = new Set<string>();
    for (const [id, links] of Object.entries(ENGVID_LINKS)) {
      const lesson = SAMPLE_LESSONS.find((l) => l.id === id)!;
      expect(
        lesson.resources.filter(
          (r) => r.type === "link" || r.type === "youtube",
        ),
      ).toHaveLength(links.length);
      for (const l of links) {
        expect(seen.has(l.url), l.url).toBe(false);
        seen.add(l.url);
      }
    }
  });

  it("cover every grammar lesson", () => {
    // Lessons written from the project's own curriculum have no engVid video.
    const own = new Set(TYPE_LESSONS.map((l) => l.id));
    const grammar = SAMPLE_LESSONS.filter(
      (l) => l.courseId === "course-grammar" && !own.has(l.id),
    );
    for (const l of grammar) expect(ENGVID_LINKS[l.id], l.id).toBeDefined();
  });
});
