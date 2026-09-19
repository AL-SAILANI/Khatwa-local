import type { ExamSectionKey } from "./question";

export interface MockExam {
  id: string;
  title: string;
  totalQuestions: number;
  durationMinutes: number;
  sectionQuestionIds: Record<ExamSectionKey, string[]>;
}

export interface SectionResult {
  section: ExamSectionKey;
  correct: number;
  total: number;
  timeSpentSeconds: number;
}

export interface ExamAttempt {
  id: string;
  userId: string;
  examId: string;
  kind: "placement" | "mock";
  status: "in_progress" | "submitted";
  answers: Record<string, string>;
  flagged: string[];
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  sectionResults: SectionResult[];
  weakSkills: string[];
  newWords: string[];
  recommendations: string[];
}
