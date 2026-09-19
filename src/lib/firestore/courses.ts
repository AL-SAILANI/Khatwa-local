import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Course, Lesson } from "@/types/course";

const coursesCollection = collection(db, "courses");

export async function getCourses(): Promise<Course[]> {
  const q = query(coursesCollection, orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Course);
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const snapshot = await getDoc(doc(coursesCollection, courseId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Course) : null;
}

export async function getLessonsForCourse(courseId: string): Promise<Lesson[]> {
  const q = query(collection(db, "lessons"), where("courseId", "==", courseId), orderBy("order"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Lesson);
}

/** Every lesson across every course — used by the study-path builder to
 * assemble a cross-skill daily sequence. */
export async function getAllLessons(): Promise<Lesson[]> {
  const snapshot = await getDocs(query(collection(db, "lessons"), orderBy("order")));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as Lesson);
}

export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const snapshot = await getDoc(doc(db, "lessons", lessonId));
  return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Lesson) : null;
}

/** Admin-only writes — enforced by firestore.rules, not by this function. */
export async function createCourse(course: Omit<Course, "id">) {
  const docRef = await addDoc(coursesCollection, course);
  return docRef.id;
}

export async function createLesson(lesson: Omit<Lesson, "id">) {
  const docRef = await addDoc(collection(db, "lessons"), lesson);
  return docRef.id;
}
