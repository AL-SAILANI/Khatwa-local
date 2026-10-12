import {
  achievementToRow,
  courseToRow,
  lessonToRow,
  mockExamToRow,
  passageToRow,
  questionToRow,
  vocabWordToRow,
} from "../supabase/catalog-rows";
import { firebaseStoragePathFromUrl, publicObjectUrl, safeObjectPath } from "../supabase/storage-paths";
import type { MigrationSource, MigrationTarget } from "./run";

type Doc = Record<string, unknown>;

// ---------- files: Firebase Storage -> Supabase Storage ----------

export interface ObjectInfo {
  path: string;
  size: number;
  contentType?: string;
}

export interface StorageSource {
  list(prefixes: string[]): AsyncIterable<ObjectInfo>;
  /** Downloads to a temp location; call `cleanup` when done with the blob. */
  download(path: string): Promise<{ blob: Blob; cleanup: () => Promise<void> }>;
}

export interface StorageTarget {
  exists(path: string): Promise<boolean>;
  upload(path: string, blob: Blob, contentType?: string): Promise<{ error?: string }>;
}

export interface FilesReport {
  found: number;
  uploaded: number;
  alreadyThere: number;
  skippedEmpty: number;
  /** Paths changed because Supabase rejects the original name (e.g. Arabic). */
  renamed: number;
  failed: number;
  bytes: number;
  /** Larger than --max-mb: would be rejected by the Supabase plan limit. */
  oversize: { path: string; size: number }[];
  failures: { path: string; error: string }[];
}

export const DEFAULT_PREFIXES = ["courses/", "mock-exams/"];

export async function runFilesMigration(
  source: StorageSource,
  target: StorageTarget | null,
  options: { apply: boolean; prefixes?: string[]; maxBytes?: number },
  log: (line: string) => void = () => {},
): Promise<FilesReport> {
  if (options.apply && !target) throw new Error("apply mode needs a target");
  const report: FilesReport = { found: 0, uploaded: 0, alreadyThere: 0, skippedEmpty: 0, renamed: 0, failed: 0, bytes: 0, oversize: [], failures: [] };
  const claimed = new Map<string, string>();

  for await (const object of source.list(options.prefixes ?? DEFAULT_PREFIXES)) {
    if (object.path.endsWith("/") || object.size === 0) {
      report.skippedEmpty++;
      continue;
    }
    report.found++;
    report.bytes += object.size;

    const newPath = safeObjectPath(object.path);
    if (newPath !== object.path) report.renamed++;

    const owner = claimed.get(newPath);
    if (owner !== undefined && owner !== object.path) {
      report.failed++;
      report.failures.push({ path: object.path, error: `name collision with ${owner} after sanitising` });
      continue;
    }
    claimed.set(newPath, object.path);

    if (options.maxBytes !== undefined && object.size > options.maxBytes) {
      report.oversize.push({ path: object.path, size: object.size });
      continue;
    }
    if (!options.apply) continue;

    try {
      if (await target!.exists(newPath)) {
        report.alreadyThere++;
        continue;
      }
      const { blob, cleanup } = await source.download(object.path);
      try {
        const result = await target!.upload(newPath, blob, object.contentType);
        if (result.error) throw new Error(result.error);
        report.uploaded++;
        log(`uploaded ${newPath}`);
      } finally {
        await cleanup();
      }
    } catch (error) {
      report.failed++;
      report.failures.push({ path: object.path, error: error instanceof Error ? error.message : String(error) });
    }
  }
  return report;
}

// ---------- URL rewriting ----------

export interface UrlRewriter {
  (url: string): Promise<string>;
  /** Firebase URLs we left alone because the file is not in Supabase. */
  missing: string[];
}

/** Maps Firebase Storage URLs to Supabase public URLs. Stateless: the new URL
 * depends only on the old object path. With `exists` set, URLs whose file is
 * not (yet) in Supabase are kept as-is rather than pointed at a 404. */
export function makeUrlRewriter(supabaseUrl: string, exists: ((path: string) => Promise<boolean>) | null): UrlRewriter {
  const cache = new Map<string, string>();
  const missing: string[] = [];
  const rewrite = (async (url: string) => {
    const cached = cache.get(url);
    if (cached !== undefined) return cached;

    const path = firebaseStoragePathFromUrl(url);
    let result = url;
    if (path) {
      const newPath = safeObjectPath(path);
      if (!exists || (await exists(newPath))) result = publicObjectUrl(supabaseUrl, newPath);
      else missing.push(url);
    }
    cache.set(url, result);
    return result;
  }) as UrlRewriter;
  rewrite.missing = missing;
  return rewrite;
}

// ---------- catalog documents: Firestore -> Supabase ----------

interface CatalogSpec {
  collection: string;
  table: string;
  toRow: (doc: Doc & { id: string }) => Record<string, unknown>;
  rewriteUrls?: (doc: Doc, rewrite: (url: string) => Promise<string>) => Promise<Doc>;
}

const asDoc = <T>(d: Doc & { id: string }) => d as unknown as T;

const COURSE_RESOURCE_FIELDS = async (doc: Doc, rewrite: (url: string) => Promise<string>): Promise<Doc> => {
  const resources = Array.isArray(doc.resources)
    ? await Promise.all(
        (doc.resources as Doc[]).map(async (r) => (typeof r?.url === "string" ? { ...r, url: await rewrite(r.url) } : r)),
      )
    : doc.resources;
  return { ...doc, resources };
};

const rewriteField = (field: string) => async (doc: Doc, rewrite: (url: string) => Promise<string>): Promise<Doc> =>
  typeof doc[field] === "string" ? { ...doc, [field]: await rewrite(doc[field] as string) } : doc;

/** Insert order respects foreign keys: courses and passages before the rows that reference them. */
export const CATALOG_SPECS: CatalogSpec[] = [
  { collection: "courses", table: "courses", toRow: (d) => courseToRow(asDoc(d)), rewriteUrls: rewriteField("coverImage") },
  { collection: "readingPassages", table: "reading_passages", toRow: (d) => passageToRow(asDoc(d)) },
  { collection: "lessons", table: "lessons", toRow: (d) => lessonToRow(asDoc(d)), rewriteUrls: COURSE_RESOURCE_FIELDS },
  { collection: "questions", table: "questions", toRow: (d) => questionToRow(asDoc(d)), rewriteUrls: rewriteField("audioUrl") },
  { collection: "mockExams", table: "mock_exams", toRow: (d) => mockExamToRow(asDoc(d)) },
  { collection: "vocabWords", table: "vocab_words", toRow: (d) => vocabWordToRow(asDoc(d)), rewriteUrls: rewriteField("audioUrl") },
  { collection: "achievements", table: "achievements", toRow: (d) => achievementToRow(asDoc(d)) },
];

export interface CatalogCollectionReport {
  read: number;
  migrated: number;
  failed: number;
  urlsRewritten: number;
}

export interface CatalogReport {
  collections: Record<string, CatalogCollectionReport>;
  /** Firebase file URLs left unchanged because the file is not in Supabase. */
  urlsKeptMissingFile: number;
  failures: { collection: string; id: string; error: string }[];
}

export async function runCatalogMigration(
  source: Pick<MigrationSource, "readCollection">,
  target: Pick<MigrationTarget, "upsert"> | null,
  options: { apply: boolean; rewrite: UrlRewriter; only?: ReadonlySet<string>; batchSize?: number },
  log: (line: string) => void = () => {},
): Promise<CatalogReport> {
  if (options.apply && !target) throw new Error("apply mode needs a target");
  const batchSize = options.batchSize ?? 200;
  const report: CatalogReport = { collections: {}, urlsKeptMissingFile: 0, failures: [] };

  for (const spec of CATALOG_SPECS) {
    if (options.only && !options.only.has(spec.collection)) continue;
    const rep: CatalogCollectionReport = { read: 0, migrated: 0, failed: 0, urlsRewritten: 0 };
    report.collections[spec.collection] = rep;

    const counting = async (url: string) => {
      const next = await options.rewrite(url);
      if (next !== url) rep.urlsRewritten++;
      return next;
    };

    const flush = async (rows: Record<string, unknown>[]) => {
      if (rows.length === 0) return;
      if (!options.apply) {
        rep.migrated += rows.length;
        return;
      }
      const batch = await target!.upsert(spec.table, rows, "id");
      if (!batch.error) {
        rep.migrated += rows.length;
        return;
      }
      for (const row of rows) {
        const single = await target!.upsert(spec.table, [row], "id");
        if (single.error) {
          rep.failed++;
          if (report.failures.length < 200) report.failures.push({ collection: spec.collection, id: String(row.id), error: single.error });
        } else rep.migrated++;
      }
    };

    let batch: Record<string, unknown>[] = [];
    for await (const doc of source.readCollection(spec.collection)) {
      rep.read++;
      const rewritten = spec.rewriteUrls ? await spec.rewriteUrls(doc.data, counting) : doc.data;
      batch.push(spec.toRow({ ...rewritten, id: doc.id }));
      if (batch.length >= batchSize) {
        await flush(batch);
        batch = [];
      }
    }
    await flush(batch);
    log(`${spec.collection}: ${rep.migrated}/${rep.read}`);
  }

  report.urlsKeptMissingFile = options.rewrite.missing.length;
  return report;
}
