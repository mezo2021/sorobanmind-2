// src/store/progressStore.ts
// متجر التقدّم المُدمَج — Zustand + persist + localStorage

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Attempt,
  Category,
  ExamResult,
  SkillProgress,
} from "../curriculum/types";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export type LevelId =
  | "L0" | "L1" | "L2" | "L3"
  | "L4" | "L5" | "L6" | "L7";

export interface AnzanBadges {
  master_addition?: boolean;
  master_multiplication?: boolean;
  master_division?: boolean;
  master_mixed?: boolean;
}

export interface AnzanAudioBadges {
  master_addition_audio?: boolean;
  master_multiplication_audio?: boolean;
  master_division_audio?: boolean;
}

export interface ProgressState {
  // ─── معلومات الطالب ───
  childName: string;
  category: Category | null;
  categoryChosenAt: string | null;

  // ─── المستويات (L0-L7) ───
  completedLevels: LevelId[];

  // ─── المسارات ───
  passedPractice: number[];        // 0-7
  passedAnzanVisual: number[];     // 0-7
  passedAnzanAudio: number[];      // 0-7

  // ─── الامتحانات ───
  exam1Passed: boolean;
  exam2Passed: boolean;
  placementAttempts: number;
  lastPlacementAttempt: number | null;

  // ─── التكيفي ───
  skillProgress: Record<string, SkillProgress>;
  levelExams: Record<string, ExamResult>;

  // ─── الإحصاءات ───
  totalXP: number;
  currentStreak: number;
  lastPlayedDate: string | null;

  // ─── الشارات ───
  anzanBadges: AnzanBadges;
  anzanAudioBadges: AnzanAudioBadges;
  completedEnrichment: string[];

  // ─── الإعدادات ───
  language: "ar" | "en";
  soundEnabled: boolean;
  voiceEnabled: boolean;
  hapticsEnabled: boolean;

  // ─── الأفعال ───
  setChildName: (name: string) => void;
  setCategory: (category: Category) => void;
  markLevelComplete: (levelId: LevelId) => void;
  markPracticePassed: (num: number) => void;
  markAnzanVisualPassed: (num: number) => void;
  markAnzanAudioPassed: (num: number) => void;
  setExam1Passed: (passed: boolean) => void;
  setExam2Passed: (passed: boolean) => void;
  recordPlacementAttempt: () => void;
  setAnzanBadge: (key: keyof AnzanBadges, value: boolean) => void;
  setAnzanAudioBadge: (key: keyof AnzanAudioBadges, value: boolean) => void;
  completeEnrichment: (enrichmentId: string) => void;
  recordAttempt: (attempt: Attempt) => void;
  completeLevel: (result: ExamResult, levelId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  setLanguage: (lang: "ar" | "en") => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleHaptics: () => void;
  reset: () => void;
  reload: () => void;
}

// ═══════════════════════════════════════════════════════════
// الحالة الابتدائية
// ═══════════════════════════════════════════════════════════

const initialState = {
  childName: "",
  category: null as Category | null,
  categoryChosenAt: null as string | null,
  completedLevels: [] as LevelId[],
  passedPractice: [] as number[],
  passedAnzanVisual: [] as number[],
  passedAnzanAudio: [] as number[],
  exam1Passed: false,
  exam2Passed: false,
  placementAttempts: 0,
  lastPlacementAttempt: null as number | null,
  skillProgress: {} as Record<string, SkillProgress>,
  levelExams: {} as Record<string, ExamResult>,
  totalXP: 0,
  currentStreak: 0,
  lastPlayedDate: null as string | null,
  anzanBadges: {} as AnzanBadges,
  anzanAudioBadges: {} as AnzanAudioBadges,
  completedEnrichment: [] as string[],
  language: "ar" as const,
  soundEnabled: true,
  voiceEnabled: true,
  hapticsEnabled: true,
};

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function uniqueNums(arr: number[]): number[] {
  return Array.from(new Set(arr));
}

function uniqueLevels(arr: LevelId[]): LevelId[] {
  return Array.from(new Set(arr));
}

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

// ═══════════════════════════════════════════════════════════
// المتجر
// ═══════════════════════════════════════════════════════════

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setChildName: (name) => set({ childName: name.trim() }),

      setCategory: (category) =>
        set({
          category,
          categoryChosenAt: new Date().toISOString(),
        }),

      markLevelComplete: (levelId) =>
        set((state) => {
          if (state.completedLevels.includes(levelId)) return state;
          return {
            completedLevels: uniqueLevels([...state.completedLevels, levelId]),
          };
        }),

      markPracticePassed: (num) =>
        set((state) => {
          if (state.passedPractice.includes(num)) return state;
          return {
            passedPractice: uniqueNums([...state.passedPractice, num]),
          };
        }),

      markAnzanVisualPassed: (num) =>
        set((state) => {
          if (state.passedAnzanVisual.includes(num)) return state;
          return {
            passedAnzanVisual: uniqueNums([...state.passedAnzanVisual, num]),
          };
        }),

      markAnzanAudioPassed: (num) =>
        set((state) => {
          if (state.passedAnzanAudio.includes(num)) return state;
          return {
            passedAnzanAudio: uniqueNums([...state.passedAnzanAudio, num]),
          };
        }),

      setExam1Passed: (passed) => set({ exam1Passed: passed }),

      setExam2Passed: (passed) => set({ exam2Passed: passed }),

      recordPlacementAttempt: () =>
        set((state) => ({
          lastPlacementAttempt: Date.now(),
          placementAttempts: state.placementAttempts + 1,
        })),

      setAnzanBadge: (key, value) =>
        set((state) => ({
          anzanBadges: { ...state.anzanBadges, [key]: value },
        })),

      setAnzanAudioBadge: (key, value) =>
        set((state) => ({
          anzanAudioBadges: { ...state.anzanAudioBadges, [key]: value },
        })),

      completeEnrichment: (enrichmentId) =>
        set((state) => {
          if (state.completedEnrichment.includes(enrichmentId)) return state;
          return {
            completedEnrichment: uniqueStrings([
              ...state.completedEnrichment,
              enrichmentId,
            ]),
          };
        }),

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

      completeLevel: (result, levelId) =>
        set((state) => {
          const wasCompleted = state.completedLevels.includes(
            levelId as LevelId,
          );
          return {
            levelExams: {
              ...state.levelExams,
              [result.examId]: result,
            },
            completedLevels: wasCompleted
              ? state.completedLevels
              : uniqueLevels([...state.completedLevels, levelId as LevelId]),
          };
        }),

      addXP: (amount) =>
        set((state) => ({
          totalXP: state.totalXP + Math.max(0, amount),
        })),

      updateStreak: () => {
        const today = getToday();
        const yesterday = getYesterday();
        const last = get().lastPlayedDate;

        if (last === today) return;

        if (last === yesterday) {
          set((state) => ({
            currentStreak: state.currentStreak + 1,
            lastPlayedDate: today,
          }));
        } else {
          set({ currentStreak: 1, lastPlayedDate: today });
        }
      },

      setLanguage: (language) => set({ language }),

      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleVoice: () =>
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),

      toggleHaptics: () =>
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

      reset: () => set({ ...initialState }),

      reload: () => set({ ...initialState }),
    }),
    {
      name: "sorobanmind-v2-progress",
      version: 3,
      migrate: (persistedState, version) => {
        const old = (persistedState as Record<string, unknown>) || {};

        // من الإصدار 1 أو 2 → 3
        if (version < 3) {
          return {
            ...initialState,
            childName: (old.childName as string) || "",
            skillProgress:
              (old.skillProgress as Record<string, SkillProgress>) || {},
            levelExams: (old.levelExams as Record<string, ExamResult>) || {},
            totalXP: (old.xp as number) || (old.totalXP as number) || 0,
            currentStreak:
              (old.streak as number) || (old.currentStreak as number) || 0,
            lastPlayedDate: (old.lastPlayedDate as string) || null,
            completedLevels:
              (old.completedLevels as LevelId[]) || [],
          };
        }

        return persistedState as ProgressState;
      },
    },
  ),
);

// ═══════════════════════════════════════════════════════════
// Selectors مساعدة
// ═══════════════════════════════════════════════════════════

export const selectIsLevelComplete =
  (levelId: LevelId) => (state: ProgressState) =>
    state.completedLevels.includes(levelId);

export const selectIsPracticePassed =
  (num: number) => (state: ProgressState) =>
    state.passedPractice.includes(num);

export const selectIsAnzanVisualPassed =
  (num: number) => (state: ProgressState) =>
    state.passedAnzanVisual.includes(num);

export const selectIsAnzanAudioPassed =
  (num: number) => (state: ProgressState) =>
    state.passedAnzanAudio.includes(num);

export default useProgressStore;