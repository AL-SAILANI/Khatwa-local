"use client";

import { ref, uploadBytesResumable, getDownloadURL, type UploadTaskSnapshot } from "firebase/storage";
import { storage } from "./client";

/** Uploads a lesson resource file (video/pdf/audio) to
 * `courses/{courseId}/lessons/{...}` — matches the `storage.rules` path
 * admins are allowed to write to — and resolves with its public download
 * URL once the upload finishes. Takes the courseId only (not a lessonId):
 * the admin form uploads resources before the lesson doc exists, so each
 * upload gets its own random folder instead. */
export function uploadLessonResource(
  courseId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const path = `courses/${courseId}/lessons/${crypto.randomUUID()}/${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        onProgress?.(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      reject,
      async () => {
        resolve(await getDownloadURL(task.snapshot.ref));
      },
    );
  });
}

export function resourceTypeFromFile(file: File): "video" | "pdf" | "audio" | null {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  if (file.type === "application/pdf") return "pdf";
  return null;
}
