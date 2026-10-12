/** Shared by the browser uploader and the migration script. Pure, no I/O. */

export const COURSE_MEDIA_BUCKET = "course-media";

/** Small deterministic hash (FNV-1a, 32-bit) so names that sanitise to nothing
 * (e.g. Arabic file names) stay unique and stable without node:crypto. */
function shortHash(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

function safeSegment(segment: string): string {
  const extMatch = segment.match(/\.[A-Za-z0-9]{1,8}$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  const stem = ext ? segment.slice(0, -ext.length) : segment;

  const cleaned = stem
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);

  // Segment was already valid: keep it identical so paths stay the same as in Firebase.
  if (cleaned === stem && cleaned !== "") return cleaned + ext;
  // Nothing usable left (all non-ASCII): fall back to a stable hash of the original.
  return (cleaned === "" ? `file-${shortHash(segment)}` : `${cleaned}-${shortHash(segment)}`) + ext;
}

/** Object keys Supabase Storage accepts, derived deterministically from any path. */
export function safeObjectPath(path: string): string {
  return path
    .split("/")
    .filter((segment) => segment !== "")
    .map(safeSegment)
    .join("/");
}

export function publicObjectUrl(supabaseUrl: string, objectPath: string): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encoded = objectPath.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${COURSE_MEDIA_BUCKET}/${encoded}`;
}

/** Object path inside a Firebase Storage download URL, or null for any other URL. */
export function firebaseStoragePathFromUrl(url: string): string | null {
  const download = url.match(/^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/([^?#]+)/);
  if (download) {
    try {
      return decodeURIComponent(download[1]!);
    } catch {
      return null;
    }
  }
  const gcs = url.match(/^https:\/\/storage\.googleapis\.com\/[^/]+\/([^?#]+)/);
  if (gcs) {
    try {
      return decodeURIComponent(gcs[1]!);
    } catch {
      return null;
    }
  }
  return null;
}
