import { describe, expect, it } from "vitest";
import {
  makeUrlRewriter,
  runCatalogMigration,
  runFilesMigration,
  type ObjectInfo,
  type StorageSource,
  type StorageTarget,
} from "./content";

const SUPA = "https://x.supabase.co";
const fbUrl = (path: string) =>
  `https://firebasestorage.googleapis.com/v0/b/p.appspot.com/o/${encodeURIComponent(path)}?alt=media&token=tok`;

function fakeStorage(objects: ObjectInfo[]) {
  const downloaded: string[] = [];
  const cleaned: string[] = [];
  const source: StorageSource = {
    async *list() {
      for (const o of objects) yield o;
    },
    async download(path) {
      downloaded.push(path);
      return { blob: new Blob([path]), cleanup: async () => void cleaned.push(path) };
    },
  };
  const stored = new Map<string, string | undefined>();
  const state = { failOn: new Set<string>() };
  const target: StorageTarget = {
    async exists(path) {
      return stored.has(path);
    },
    async upload(path, _blob, contentType) {
      if (state.failOn.has(path)) return { error: "413 payload too large" };
      stored.set(path, contentType);
      return {};
    },
  };
  return { source, target, stored, downloaded, cleaned, state };
}

describe("runFilesMigration", () => {
  const objects: ObjectInfo[] = [
    { path: "courses/c1/lessons/u1/video.mp4", size: 100, contentType: "video/mp4" },
    { path: "courses/c1/lessons/u2/درس.pdf", size: 50, contentType: "application/pdf" },
    { path: "courses/c1/lessons/", size: 0 },
    { path: "courses/c1/lessons/u3/empty.mp3", size: 0 },
  ];

  it("dry-run counts and flags renames without touching anything", async () => {
    const f = fakeStorage(objects);
    const report = await runFilesMigration(f.source, null, { apply: false });
    expect(report).toMatchObject({ found: 2, skippedEmpty: 2, renamed: 1, uploaded: 0, bytes: 150 });
    expect(f.downloaded).toHaveLength(0);
  });

  it("uploads with sanitised names and content types, cleaning temp files", async () => {
    const f = fakeStorage(objects);
    const report = await runFilesMigration(f.source, f.target, { apply: true });
    expect(report.uploaded).toBe(2);
    expect(f.stored.get("courses/c1/lessons/u1/video.mp4")).toBe("video/mp4");
    const renamed = [...f.stored.keys()].find((k) => k.endsWith(".pdf") && k !== "courses/c1/lessons/u1/video.mp4")!;
    expect(renamed).toMatch(/^courses\/c1\/lessons\/u2\/file-[0-9a-f]{8}\.pdf$/);
    expect(f.cleaned).toHaveLength(2);
  });

  it("is safe to re-run: existing objects are not downloaded again", async () => {
    const f = fakeStorage(objects);
    await runFilesMigration(f.source, f.target, { apply: true });
    f.downloaded.length = 0;
    const second = await runFilesMigration(f.source, f.target, { apply: true });
    expect(second).toMatchObject({ uploaded: 0, alreadyThere: 2 });
    expect(f.downloaded).toHaveLength(0);
  });

  it("reports failures, still cleans up, and continues", async () => {
    const f = fakeStorage(objects);
    f.state.failOn.add("courses/c1/lessons/u1/video.mp4");
    const report = await runFilesMigration(f.source, f.target, { apply: true });
    expect(report).toMatchObject({ uploaded: 1, failed: 1 });
    expect(report.failures[0]).toMatchObject({ path: "courses/c1/lessons/u1/video.mp4", error: "413 payload too large" });
    expect(f.cleaned).toHaveLength(2);
  });

  it("flags files over the size limit instead of attempting them", async () => {
    const f = fakeStorage(objects);
    const report = await runFilesMigration(f.source, f.target, { apply: true, maxBytes: 60 });
    expect(report.oversize).toEqual([{ path: "courses/c1/lessons/u1/video.mp4", size: 100 }]);
    expect(report.uploaded).toBe(1);
  });

  it("keeps similar-looking names distinct instead of overwriting one with the other", async () => {
    const f = fakeStorage([
      { path: "courses/c1/a b.mp4", size: 1 },
      { path: "courses/c1/a  b.mp4", size: 1 },
    ]);
    const report = await runFilesMigration(f.source, f.target, { apply: true });
    expect(report).toMatchObject({ uploaded: 2, failed: 0 });
    expect(f.stored.size).toBe(2);
  });
});

describe("makeUrlRewriter", () => {
  it("points Firebase URLs at Supabase and leaves other URLs alone", async () => {
    const rewrite = makeUrlRewriter(SUPA, null);
    expect(await rewrite(fbUrl("courses/c1/lessons/u1/a.mp4"))).toBe(
      `${SUPA}/storage/v1/object/public/course-media/courses/c1/lessons/u1/a.mp4`,
    );
    expect(await rewrite("https://youtube.com/watch?v=1")).toBe("https://youtube.com/watch?v=1");
    expect(await rewrite("/audio/vocab/word.mp3")).toBe("/audio/vocab/word.mp3");
  });

  it("keeps the old URL when the file did not make it to Supabase", async () => {
    const rewrite = makeUrlRewriter(SUPA, async (path) => path.endsWith("ok.mp4"));
    const bad = fbUrl("courses/c1/lessons/u1/gone.mp4");
    expect(await rewrite(fbUrl("courses/c1/lessons/u1/ok.mp4"))).toContain("/course-media/");
    expect(await rewrite(bad)).toBe(bad);
    expect(rewrite.missing).toEqual([bad]);
  });
});

describe("runCatalogMigration", () => {
  const docs: Record<string, { id: string; data: Record<string, unknown> }[]> = {
    courses: [{ id: "c1", data: { track: "grammar", title: "Grammar", description: "d", order: 1, lessonCount: 1, estimatedMinutes: 30, coverImage: fbUrl("courses/c1/cover.png") } }],
    lessons: [
      {
        id: "l1",
        data: {
          courseId: "c1", title: "L1", order: 1, notes: "n", questionIds: ["q1"],
          resources: [
            { type: "video", url: fbUrl("courses/c1/lessons/u1/v.mp4"), title: "v.mp4" },
            { type: "pdf", url: "https://example.com/x.pdf", title: "x.pdf" },
          ],
        },
      },
    ],
    questions: [{ id: "q1", data: { section: "listening", prompt: "?", options: [{ id: "a", text: "A" }], correctOptionId: "a", explanation: "e", difficulty: "easy", tags: [], audioUrl: fbUrl("courses/c1/a.mp3") } }],
  };
  const source = {
    async *readCollection(name: string) {
      for (const d of docs[name] ?? []) yield d;
    },
  };

  function fakeDb() {
    const writes: { table: string; rows: Record<string, unknown>[] }[] = [];
    return { writes, target: { async upsert(table: string, rows: Record<string, unknown>[]) { writes.push({ table, rows }); return {}; } } };
  }

  it("writes rows in foreign-key order with rewritten URLs", async () => {
    const { writes, target } = fakeDb();
    const report = await runCatalogMigration(source, target, { apply: true, rewrite: makeUrlRewriter(SUPA, null) });
    expect(writes.map((w) => w.table)).toEqual(["courses", "lessons", "questions"]);
    expect(writes[0]!.rows[0]).toMatchObject({ id: "c1", cover_image: expect.stringContaining(`${SUPA}/storage/v1/object/public/course-media/courses/c1/cover.png`) });
    const resources = writes[1]!.rows[0]!.resources as { url: string }[];
    expect(resources[0]!.url).toContain("/course-media/courses/c1/lessons/u1/v.mp4");
    expect(resources[1]!.url).toBe("https://example.com/x.pdf");
    expect(writes[2]!.rows[0]).toMatchObject({ audio_url: expect.stringContaining("/course-media/courses/c1/a.mp3") });
    expect(report.collections.lessons).toMatchObject({ read: 1, migrated: 1, urlsRewritten: 1 });
  });

  it("dry-run writes nothing but still reports", async () => {
    const { writes } = fakeDb();
    const report = await runCatalogMigration(source, null, { apply: false, rewrite: makeUrlRewriter(SUPA, null) });
    expect(writes).toHaveLength(0);
    expect(report.collections.courses).toMatchObject({ read: 1, migrated: 1 });
  });

  it("isolates a failing row", async () => {
    const target = { async upsert(_t: string, rows: Record<string, unknown>[]) { return rows.length > 1 || rows[0]!.id === "q1" ? { error: "violates check" } : {}; } };
    const report = await runCatalogMigration(source, target, { apply: true, rewrite: makeUrlRewriter(SUPA, null) });
    expect(report.collections.questions).toMatchObject({ migrated: 0, failed: 1 });
    expect(report.failures[0]).toMatchObject({ collection: "questions", id: "q1" });
  });
});
