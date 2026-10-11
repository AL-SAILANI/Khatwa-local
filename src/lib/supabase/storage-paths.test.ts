import { describe, expect, it } from "vitest";
import { firebaseStoragePathFromUrl, publicObjectUrl, safeObjectPath } from "./storage-paths";

describe("safeObjectPath", () => {
  it("leaves already-valid paths untouched (same path as in Firebase)", () => {
    expect(safeObjectPath("courses/c1/lessons/3f2a-b7/lesson-1.mp4")).toBe("courses/c1/lessons/3f2a-b7/lesson-1.mp4");
  });

  it("cleans spaces and punctuation but keeps the extension", () => {
    expect(safeObjectPath("courses/c1/Lesson One (final).PDF")).toMatch(/^courses\/c1\/Lesson-One-final-[0-9a-f]{8}\.pdf$/);
  });

  it("gives Arabic-only names a stable, unique fallback", () => {
    const a = safeObjectPath("courses/c1/درس القواعد.mp4");
    const b = safeObjectPath("courses/c1/درس الاستماع.mp4");
    expect(a).toMatch(/^courses\/c1\/file-[0-9a-f]{8}\.mp4$/);
    expect(a).not.toBe(b);
    expect(safeObjectPath("courses/c1/درس القواعد.mp4")).toBe(a);
  });

  it("only ever emits characters Supabase accepts", () => {
    expect(safeObjectPath("a b/ü:*?\"<>|/x.mp3")).toMatch(/^[A-Za-z0-9._\-/]+$/);
  });
});

describe("urls", () => {
  it("builds an encoded public URL", () => {
    expect(publicObjectUrl("https://x.supabase.co/", "courses/c1/a b.mp4")).toBe(
      "https://x.supabase.co/storage/v1/object/public/course-media/courses/c1/a%20b.mp4",
    );
  });

  it("extracts the object path from Firebase download URLs only", () => {
    expect(
      firebaseStoragePathFromUrl("https://firebasestorage.googleapis.com/v0/b/p.appspot.com/o/courses%2Fc1%2Flessons%2Fu%2Fa.mp4?alt=media&token=t"),
    ).toBe("courses/c1/lessons/u/a.mp4");
    expect(firebaseStoragePathFromUrl("https://storage.googleapis.com/p.appspot.com/courses/c1/a.pdf")).toBe("courses/c1/a.pdf");
    expect(firebaseStoragePathFromUrl("https://youtube.com/watch?v=1")).toBeNull();
    expect(firebaseStoragePathFromUrl("/audio/vocab/word.mp3")).toBeNull();
  });
});
