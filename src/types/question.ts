export type ExamSectionKey = "reading" | "grammar" | "listening" | "writingAnalysis";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  section: ExamSectionKey;
  courseId?: string;
  passageId?: string;
  audioUrl?: string;
  /** Shown when `audioUrl` isn't set yet (dev/seed content) so listening
   * questions are still usable before real audio is uploaded via the CMS. */
  transcript?: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

export interface ReadingPassage {
  id: string;
  title: string;
  body: string;
  questionIds: string[];
}
