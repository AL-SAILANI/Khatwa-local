import { getSupabase } from "@/lib/supabase/client";
import { COURSE_MEDIA_BUCKET, safeObjectPath } from "@/lib/supabase/storage-paths";

/** Uploads a lesson resource to the public `course-media` bucket and resolves
 * with its public URL. Mirrors the Firebase path layout; names Supabase would
 * reject (Arabic, spaces) are made safe. supabase-js reports no byte progress,
 * so `onProgress` only fires at start and end. */
export async function sbUploadLessonResource(
  courseId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const path = safeObjectPath(`courses/${courseId}/lessons/${crypto.randomUUID()}/${file.name}`);
  const bucket = getSupabase().storage.from(COURSE_MEDIA_BUCKET);

  onProgress?.(0);
  const { error } = await bucket.upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (error) throw new Error(`Supabase storage: ${error.message}`);
  onProgress?.(100);

  return bucket.getPublicUrl(path).data.publicUrl;
}
