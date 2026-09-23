// src/store/progressStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Attempt,
  ExamResult,
  SkillProgress,
} from "../curriculum/types";

export interface ProgressState {
  childName: string;
  skillProgress: Record<string, SkillProgress>;
  levelExams: Record<string, ExamResult>;
  recordAttempt: (attempt: Attempt) => void;
  setChildName: (name: string) => void;
  completeLevel: (result: ExamResult) => void;
  reset: () => void;
}

const initialState = {
  childName: "",
  skillProgress: {},
  levelExams: {},
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,
      recordAttempt: (attempt) =>
        set((state) => {
          const existing = state.skillProgress[attempt.skillId] ?? {
            skillId: attempt.skillId,
            attempts: 0,
            correct: 0,
            consecutiveCorrect: 0,
            avgTimeMs: 0,
          };

          const attempts = existing.attempts + 1;
          const correct = existing.correct + (attempt.correct ? 1 : 0);
          const consecutiveCorrect = attempt.correct
            ? existing.consecutiveCorrect + 1
            : 0;
          const avgTimeMs =
            existing.attempts === 0
              ? attempt.timeMs
              : (existing.avgTimeMs * existing.attempts + attempt.timeMs) /
                attempts;

          return {
            skillProgress: {
              ...state.skillProgress,
              [attempt.skillId]: {
                ...existing,
                attempts,
                correct,
                consecutiveCorrect,
                avgTimeMs,
              },
            },
          };
        }),
      setChildName: (name) => set({ childName: name.trim() }),
      completeLevel: (result) =>
        set((state) => ({
          levelExams: { ...state.levelExams, [result.examId]: result },
        })),
      reset: () => set(initialState),
    }),
    { name: "sorobanmind-v2-progress", version: 1 },
  ),
);