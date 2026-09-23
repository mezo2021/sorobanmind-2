// src/store/progressStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Attempt,
  Category,
  ExamResult,
  SkillProgress,
} from "../curriculum/types";

/**
 * حالة تقدم التطبيق.
 */
export interface ProgressState {
  // ─── معلومات الطالب ───
  childName: string;
  category: Category | null;         // الفئة المختارة (kids / teens)
  categoryChosenAt: string | null;   // متى اختارها

  // ─── التقدم ───
  skillProgress: Record<string, SkillProgress>;
  levelExams: Record<string, ExamResult>;
  completedLevels: string[];         // معرّفات المستويات المكتملة
  completedEnrichment: string[];     // معرّفات الإثراء المكتملة

  // ─── الإحصاءات ───
  totalXP: number;
  currentStreak: number;
  lastPlayedDate: string | null;

  // ─── الإعدادات ───
  language: "ar" | "en";
  soundEnabled: boolean;
  voiceEnabled: boolean;
  hapticsEnabled: boolean;

  // ─── الأفعال ───
  recordAttempt: (attempt: Attempt) => void;
  setChildName: (name: string) => void;
  setCategory: (category: Category) => void;
  completeLevel: (result: ExamResult, levelId: string) => void;
  completeEnrichment: (enrichmentId: string) => void;
  addXP: (amount: number) => void;
  updateStreak: () => void;
  setLanguage: (lang: "ar" | "en") => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleHaptics: () => void;
  reset: () => void;
}

/**
 * الحالة الابتدائية.
 */
const initialState = {
  childName: "",
  category: null,
  categoryChosenAt: null,
  skillProgress: {},
  levelExams: {},
  completedLevels: [],
  completedEnrichment: [],
  totalXP: 0,
  currentStreak: 0,
  lastPlayedDate: null,
  language: "ar" as const,
  soundEnabled: true,
  voiceEnabled: true,
  hapticsEnabled: true,
};

/**
 * الحصول على تاريخ اليوم بصيغة YYYY-MM-DD.
 */
function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * الحصول على تاريخ الأمس.
 */
function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

/**
 * مخزن تقدم الطفل باستخدام Zustand.
 *
 * persist يحفظ البيانات في localStorage تلقائياً.
 */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * تسجيل محاولة جديدة في مهارة.
       */
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

      /**
       * تعيين اسم الطفل.
       */
      setChildName: (name) => set({ childName: name.trim() }),

      /**
       * تعيين الفئة المختارة.
       */
      setCategory: (category) =>
        set({
          category,
          categoryChosenAt: new Date().toISOString(),
        }),

      /**
       * تسجيل إكمال اختبار مستوى.
       */
      completeLevel: (result, levelId) =>
        set((state) => {
          const wasCompleted = state.completedLevels.includes(levelId);
          return {
            levelExams: {
              ...state.levelExams,
              [result.examId]: result,
            },
            completedLevels: wasCompleted
              ? state.completedLevels
              : [...state.completedLevels, levelId],
          };
        }),

      /**
       * تسجيل إكمال درس إثراء.
       */
      completeEnrichment: (enrichmentId) =>
        set((state) => {
          if (state.completedEnrichment.includes(enrichmentId)) {
            return state;
          }
          return {
            completedEnrichment: [
              ...state.completedEnrichment,
              enrichmentId,
            ],
          };
        }),

      /**
       * إضافة XP.
       */
      addXP: (amount) =>
        set((state) => ({
          totalXP: state.totalXP + Math.max(0, amount),
        })),

      /**
       * تحديث سلسلة اللعب اليومية.
       */
      updateStreak: () => {
        const today = getToday();
        const yesterday = getYesterday();
        const last = get().lastPlayedDate;

        if (last === today) {
          // لعب اليوم بالفعل
          return;
        }

        if (last === yesterday) {
          // استمرارية
          set((state) => ({
            currentStreak: state.currentStreak + 1,
            lastPlayedDate: today,
          }));
        } else {
          // بداية جديدة
          set({ currentStreak: 1, lastPlayedDate: today });
        }
      },

      /**
       * تعيين اللغة.
       */
      setLanguage: (language) => set({ language }),

      /**
       * تبديل الصوت.
       */
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),

      /**
       * تبديل صوت سوروبانا.
       */
      toggleVoice: () =>
        set((state) => ({ voiceEnabled: !state.voiceEnabled })),

      /**
       * تبديل الاهتزاز.
       */
      toggleHaptics: () =>
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

      /**
       * إعادة تعيين كل البيانات.
       */
      reset: () => set(initialState),
    }),
    {
      name: "sorobanmind-v2-progress",
      version: 2, // ⬅️ رفعنا الإصدار لأن البنية تغيرت
      migrate: (persistedState, version) => {
        // عند الانتقال من version 1 إلى 2، نحول البيانات
        if (version === 1 && persistedState) {
          const old = persistedState as Record<string, unknown>;
          return {
            ...initialState,
            childName: (old.childName as string) || "",
            skillProgress: (old.skillProgress as Record<string, SkillProgress>) || {},
            levelExams: (old.levelExams as Record<string, ExamResult>) || {},
          };
        }
        return persistedState as ProgressState;
      },
    },
  ),
);

export default useProgressStore;