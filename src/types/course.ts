export type CourseTrack =
  | "grammar"
  | "reading"
  | "listening"
  | "writingAnalysis"
  | "vocabulary"
  | "tips"
  | "strategies"
  | "revision";

export interface Course {
  id: string;
  track: CourseTrack;
  title: string;
  description: string;
  order: number;
  lessonCount: number;
  estimatedMinutes: number;
  coverImage?: string;
}

export interface LessonResource {
  type: "video" | "pdf" | "audio";
  url: string;
  title: string;
  durationSeconds?: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  resources: LessonResource[];
  notes: string;
  questionIds: string[];
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  quizScore: number | null;
  lastPosition: number;
  updatedAt: string;
}
