import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ExamResult {
  examId: string;
  score: number;
  totalMarks: number;
  passed: boolean;
  grade?: string;
  mode: 'training' | 'exam';
  completedAt: number;
}

interface ExamState {
  results: Record<string, ExamResult[]>;
  bestScores: Record<string, ExamResult>;
  recordResult: (result: ExamResult) => void;
  getBestScore: (examId: string) => ExamResult | null;
  isExamPassed: (examId: string) => boolean;
  resetProgress: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      results: {},
      bestScores: {},
      
      recordResult: (result) => set((state) => {
        const existing = state.results[result.examId] || [];
        const best = state.bestScores[result.examId];
        const shouldUpdateBest = result.mode === 'exam' && (!best || result.score > best.score);
        
        return {
          results: {
            ...state.results,
            [result.examId]: [...existing, result].slice(-20),
          },
          bestScores: shouldUpdateBest
            ? { ...state.bestScores, [result.examId]: result }
            : state.bestScores,
        };
      }),
      
      getBestScore: (examId) => get().bestScores[examId] || null,
      isExamPassed: (examId) => get().bestScores[examId]?.passed || false,
      resetProgress: () => set({ results: {}, bestScores: {} }),
    }),
    { name: 'mental_archives_exams_v1' }
  )
);