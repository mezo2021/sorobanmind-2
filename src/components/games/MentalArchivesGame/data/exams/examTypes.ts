// src/components/games/MentalArchivesGame/data/exams/examTypes.ts

export type ExamQuestionType = 'mitori' | 'multiplication' | 'division';

export interface ExamQuestion {
  id: string;
  type: ExamQuestionType;
  numbers: number[];
  answer: number;
  hasSubtraction?: boolean;   // 🆕 P11: لأسئلة 1 كيو (ميتوري مختلط بالطرح)
}

export interface ExamSection {
  titleAr: string;
  titleEn: string;
  questions: ExamQuestion[];
  pointsPerQuestion: number;
}

export interface GradeThreshold {
  score: number;
  grade: string;
}

export interface KyuExamData {
  id: string;
  levelNameAr: string;
  levelNameEn: string;
  timeLimitSeconds: number;
  totalQuestions: number;
  totalMarks: number;
  passingScore: number;
  sections: ExamSection[];
  gradeThresholds?: GradeThreshold[];
  requires: string[];
  requiresExam?: string;
}