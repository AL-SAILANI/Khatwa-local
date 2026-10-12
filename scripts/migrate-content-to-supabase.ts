/**
 * Moves lesson files (Firebase Storage -> Supabase Storage) and the content
 * documents that point at them (courses, lessons, questions, ... Firestore ->
 * Supabase), rewriting every Firebase file URL to its new Supabase URL.
 * Safe by default: without --apply it only reads and reports.
 *
 *   npm run migrate:content                          # dry run
 *   npm run migrate:content -- --apply               # files, then content
 *   npm run migrate:content -- --apply --only=files  # just copy the files
 *   npm run migrate:content -- --max-mb=50           # flag files above your Supabase plan's upload limit
 *
 * Idempotent: files already in Supabase are skipped, content is upserted by id.
 * Run it BEFORE switching the app to NEXT_PUBLIC_USER_BACKEND=supabase, and
 * keep Firebase Storage until you've checked the lessons play.
 *
 * Env (.env.local): FIREBASE_SERVICE_ACCOUNT_KEY, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
 * and for --apply: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Prerequisite: migrations 0001-0004 applied.
 */
import { randomUUID } from "node:crypto";
import { openAsBlob, writeFileSync } from "node:fs";
import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { createClient } from "@supabase/supabase-js";
import { initFirebaseAdmin, readCollection } from "./lib/firebase-admin";
import { COURSE_MEDIA_BUCKET } from "../src/lib/supabase/storage-paths";
import {
  CATALOG_SPECS,
  DEFAULT_PREFIXES,
  makeUrlRewriter,
  runCatalogMigration,
  runFilesMigration,
  type ObjectInfo,
  type StorageSource,
  type StorageTarget,
} from "../src/lib/migration/content";

const args = process.argv.slice(2);
const flag = (name: string) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const flagValue = (name: string) => flag(name)?.split("=")[1];

const apply = Boolean(flag("apply"));
const phases = new Set((flagValue("only") ?? "files,catalog").split(",").map((s) => s.trim()));
const prefixes = flagValue("prefix") ? [flagValue("prefix")!] : DEFAULT_PREFIXES;
const maxMb = flagValue("max-mb") ? Number(flagValue("max-mb")) : undefined;
const reportPath = flagValue("report") ?? "migration-report-content.json";

if ([...phases].some((p) => p !== "files" && p !== "catalog")) {
  console.error("--only accepts: files, catalog");
  process.exit(1);
}
if (maxMb !== undefined && !(maxMb > 0)) {
  console.error("--max-mb must be a positive number");
  process.exit(1);
}

const MIME_BY_EXT: Record<string, string> = {
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".mp3": "audio/mpeg", ".m4a": "audio/mp4", ".wav": "audio/wav", ".ogg": "audio/ogg",
  ".pdf": "application/pdf",
};

function firebaseStorageSource(bucketName: string): { source: StorageSource; fs: ReturnType<typeof getFirestore> } {
  const app = initFirebaseAdmin({ storageBucket: bucketName });
  const bucket = getStorage(app).bucket(bucketName);

  const source: StorageSource = {
    async *list(prefixList) {
      for (const prefix of prefixList) {
        let pageToken: string | undefined;
        do {
          const [files, next] = await bucket.getFiles({ prefix, autoPaginate: false, maxResults: 500, pageToken });
          for (const file of files) {
            yield {
              path: file.name,
              size: Number(file.metadata.size ?? 0),
              contentType: typeof file.metadata.contentType === "string" ? file.metadata.contentType : undefined,
            } satisfies ObjectInfo;
          }
          pageToken = (next as { pageToken?: string } | null)?.pageToken;
        } while (pageToken);
      }
    },

    async download(path) {
      // To disk, not memory: lesson videos can be hundreds of MB.
      const tmp = join(tmpdir(), `khatwa-${randomUUID()}${extname(path)}`);
      await bucket.file(path).download({ destination: tmp });
      return { blob: await openAsBlob(tmp), cleanup: () => rm(tmp, { force: true }) };
    },
  };
  return { source, fs: getFirestore(app) };
}

async function main() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    console.error("Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in .env.local (e.g. your-project.appspot.com).");
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (apply && (!supabaseUrl || !serviceKey)) {
    console.error("--apply needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  console.log(`Mode: ${apply ? "APPLY (writes to Supabase)" : "dry run (read-only)"}`);
  console.log(`Phases: ${[...phases].join(", ")}   Firebase bucket: ${bucketName}`);
  if (apply) {
    console.log(`Target: ${new URL(supabaseUrl!).host}`);
    if (!flag("yes")) {
      console.log("Starting in 5 seconds - press Ctrl+C to abort (use --yes to skip this pause).");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  const { source, fs } = firebaseStorageSource(bucketName);
  const supabase = apply ? createClient(supabaseUrl!, serviceKey!, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  const bucket = supabase?.storage.from(COURSE_MEDIA_BUCKET);

  const storageTarget: StorageTarget | null = bucket
    ? {
        async exists(path) {
          const { data, error } = await bucket.exists(path);
          if (error) throw new Error(error.message);
          return data;
        },
        async upload(path, blob, contentType) {
          const type = contentType ?? MIME_BY_EXT[extname(path).toLowerCase()];
          const { error } = await bucket.upload(path, blob, { contentType: type, upsert: false });
          return error ? { error: error.message } : {};
        },
      }
    : null;

  const report: Record<string, unknown> = { mode: apply ? "apply" : "dry-run" };
  let failures = 0;

  if (phases.has("files")) {
    const files = await runFilesMigration(source, storageTarget, { apply, prefixes, maxBytes: maxMb ? maxMb * 1024 * 1024 : undefined }, (l) => console.log(`  ${l}`));
    report.files = files;
    failures += files.failed;
    const mb = (files.bytes / 1024 / 1024).toFixed(1);
    console.log(`\nfiles: found ${files.found} (${mb} MB), uploaded ${files.uploaded}, already there ${files.alreadyThere}, renamed ${files.renamed}, failed ${files.failed}`);
    if (files.found === 0) console.log("  No files under " + prefixes.join(", ") + " - nothing was uploaded through the CMS, so there is nothing to copy.");
    if (files.oversize.length) console.log(`  ${files.oversize.length} file(s) exceed --max-mb and were not attempted (see report).`);
  }

  if (phases.has("catalog")) {
    const rewrite = makeUrlRewriter(supabaseUrl ?? "https://<project>.supabase.co", storageTarget ? (p) => storageTarget.exists(p) : null);
    const catalog = await runCatalogMigration(
      { readCollection: (name) => readCollection(fs, name) },
      supabase
        ? {
            async upsert(table, rows, onConflict) {
              const { error } = await supabase.from(table).upsert(rows, { onConflict });
              return error ? { error: error.message } : {};
            },
          }
        : null,
      { apply, rewrite },
      (l) => console.log(`  ${l}`),
    );
    report.catalog = catalog;
    failures += Object.values(catalog.collections).reduce((n, c) => n + c.failed, 0);
    console.log("");
    for (const spec of CATALOG_SPECS) {
      const c = catalog.collections[spec.collection];
      if (c) console.log(`${spec.collection}: read ${c.read}, migrated ${c.migrated}, failed ${c.failed}, file URLs rewritten ${c.urlsRewritten}`);
    }
    if (catalog.urlsKeptMissingFile > 0) {
      console.log(`  ${catalog.urlsKeptMissingFile} file URL(s) still point at Firebase because the file is not in Supabase (see report).`);
    }
  }

  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport written to ${reportPath}.`);
  if (failures > 0) {
    console.error(`${failures} item(s) failed - see the report. Fix and re-run; finished work is not repeated.`);
    process.exit(2);
  }
  if (!apply) console.log("Dry run only. Re-run with --apply to write to Supabase.");
}

main().catch((error) => {
  console.error(`Migration failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
