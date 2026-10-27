// src/store/progressStore.ts
// [v10] — peakStreak + stats + 7 شارات أنزان (بصري + سمعي) — 2026-10-16
// [v11] — إضافة dailyXP لتتبع نشاط الأسبوع — 2026-10-20
// [v12] — توحيد LevelId من srb-adapter + تحويل passed* إلى LevelId[] — 2026-10-23
// ✅ لا earnedBadges · لا QUESTS · لا BADGES

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Attempt,
  Category,
  ExamResult,
  SkillProgress as BaseSkillProgress,
} from "../curriculum/types";

// ✅ [m8] LevelId نظيف (L0-L7) من srb-adapter
import type { LevelId } from "../data/srb-adapter";

// ═══ امتداد محلي — لا يمس curriculum/types.ts ═══
export interface SkillProgress extends BaseSkillProgress {
  peakStreak?: number;
}

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

// ✅ [m8] LevelId مُستورد من srb-adapter (L0-L7 فقط)
export type { LevelId };

// ✅ 7 شارات أنزان بصري
export interface AnzanBadges {
  master_addition?: boolean;
  master_multiplication?: boolean;
  master_division?: boolean;
  master_chains?: boolean;
  master_advanced?: boolean;    // S11·S12
  master_decimals?: boolean;    // S13·S14
  master_roots?: boolean;       // S15
}

// ✅ 7 شارات أنزان سمعي
export interface AnzanAudioBadges {
  master_addition_audio?: boolean;
  master_multiplication_audio?: boolean;
  master_division_audio?: boolean;
  master_chains_audio?: boolean;
  master_advanced_audio?: boolean;
  master_decimals_audio?: boolean;
  master_roots_audio?: boolean;
}

// ═══ إحصائيات تراكمية (v10) ═══
export interface ProgressStats {
  totalAttempts: number;
  totalCorrect: number;
}

// ═══ درجات الأقسام ═══
export interface LevelGrades {
  practice: number | null;
  anzanVisualNormal: number | null;
  anzanVisualFlash: number | null;
  anzanAudio: number | null;
  levelTest: number | null;
}

export type RemediationPhase =
  | "practice"
  | "anzanVisualNormal"
  | "anzanVisualFlash"
  | "anzanAudio";

export interface PendingRemediation {
  level: LevelId;
  phase: RemediationPhase;
  skills: string[];
  createdAt: number;
}

export interface RemediationSession {
  id: string;
  level: LevelId;
  phase: RemediationPhase;
  skills: string[];
  correct: number;
  total: number;
  completedAt: number;
  outcome?: "passed" | "failed";
}

// ═══ ثوابت التذاكر ═══
export const TICKET_COST = 10;
export const TICKET_XP_CAP = 50;
export const TICKETS_MAX = 5;

// ═══ الحالة الكاملة ═══
export interface ProgressState {
  childName: string;
  parentName: string;
  category: Category | null;
  categoryChosenAt: string | null;
  completedLevels: LevelId[];
  completedLessons: string[];
  passedPractice: LevelId[];
  passedAnzanVisual: LevelId[];
  passedAnzanAudio: LevelId[];
  grades: Record<string, LevelGrades>;
  pendingRemediation: PendingRemediation | null;
  remediationHistory: RemediationSession[];
  exam1Passed: boolean;
  exam2Passed: boolean;
  placementAttempts: number;
  lastPlacementAttempt: number | null;
  skillProgress: Record<string, SkillProgress>;
  levelExams: Record<string, ExamResult>;
  totalXP: number;
  currentStreak: number;
  lastPlayedDate: string | null;
  anzanBadges: AnzanBadges;
  anzanAudioBadges: AnzanAudioBadges;
  completedEnrichment: string[];
  language: "ar" | "en";
  soundEnabled: boolean;
  voiceEnabled: boolean;
  hapticsEnabled: boolean;
  ticketXP: number;
  tickets: number;
  stats: ProgressStats;
  dailyXP: Record<string, number>; // 🆕 v11: سجل النقاط اليومية

  setChildName: (name: string) => void;
  setParentName: (name: string) => void;
  setCategory: (category: Category) => void;
  markLevelComplete: (levelId: LevelId) => void;
  markLessonCompleted: (lessonId: string) => void;
  markPracticePassed: (levelId: LevelId) => void;
  markAnzanVisualPassed: (levelId: LevelId) => void;
  markAnzanAudioPassed: (levelId: LevelId) => void;

  setGrade: (levelKey: string, phase: keyof LevelGrades, grade: number) => void;
  getGrades: (levelKey: string) => LevelGrades;
  computeFinalScore: (levelKey: string) => number | null;

  setPendingRemediation: (p: Omit<PendingRemediation, "createdAt">) => void;
  clearPendingRemediation: () => void;
  addRemediationSession: (s: Omit<RemediationSession, "id" | "completedAt">) => void;

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

  buyTicket: () => void;
  consumeTicket: () => void;
}

// ═══════════════════════════════════════════════════════════
// الحالة الابتدائية
// ═══════════════════════════════════════════════════════════

const EMPTY_GRADES: LevelGrades = {
  practice: null,
  anzanVisualNormal: null,
  anzanVisualFlash: null,
  anzanAudio: null,
  levelTest: null,
};

const initialState = {
  childName: "",
  parentName: "",
  category: null as Category | null,
  categoryChosenAt: null as string | null,
  completedLevels: [] as LevelId[],
  completedLessons: [] as string[],
  passedPractice: [] as LevelId[],
  passedAnzanVisual: [] as LevelId[],
  passedAnzanAudio: [] as LevelId[],
  grades: {} as Record<string, LevelGrades>,
  pendingRemediation: null as PendingRemediation | null,
  remediationHistory: [] as RemediationSession[],
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
  ticketXP: 0,
  tickets: 0,
  stats: { totalAttempts: 0, totalCorrect: 0 } as ProgressStats,
  dailyXP: {} as Record<string, number>, // 🆕 v11
};

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function uniqueLevels(arr: LevelId[]): LevelId[] {
  return Array.from(new Set(arr));
}

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

function makeRemediationId(): string {
  return "r-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}

// ═══════════════════════════════════════════════════════════
// المتجر
// ═══════════════════════════════════════════════════════════

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setChildName: (name) => set({ childName: name.trim() }),

      setParentName: (name) => set({ parentName: name.trim() }),

      setCategory: (category) =>
        set({ category, categoryChosenAt: new Date().toISOString() }),

      markLevelComplete: (levelId) =>
        set((state) => {
          if (state.completedLevels.includes(levelId)) return state;
          return { completedLevels: uniqueLevels([...state.completedLevels, levelId]) };
        }),

      markLessonCompleted: (lessonId) =>
        set((state) => {
          if (state.completedLessons.includes(lessonId)) return state;
          return { completedLessons: uniqueStrings([...state.completedLessons, lessonId]) };
        }),

      markPracticePassed: (levelId) =>
        set((state) => {
          if (state.passedPractice.includes(levelId)) return state;
          return { passedPractice: uniqueLevels([...state.passedPractice, levelId]) };
        }),

      markAnzanVisualPassed: (levelId) =>
        set((state) => {
          if (state.passedAnzanVisual.includes(levelId)) return state;
          return { passedAnzanVisual: uniqueLevels([...state.passedAnzanVisual, levelId]) };
        }),

      markAnzanAudioPassed: (levelId) =>
        set((state) => {
          if (state.passedAnzanAudio.includes(levelId)) return state;
          return { passedAnzanAudio: uniqueLevels([...state.passedAnzanAudio, levelId]) };
        }),

      setGrade: (levelKey, phase, grade) =>
        set((state) => {
          const current = state.grades[levelKey] ?? { ...EMPTY_GRADES };
          const prev = current[phase];
          const next = prev === null || grade > prev ? grade : prev;
          return {
            grades: { ...state.grades, [levelKey]: { ...current, [phase]: next } },
          };
        }),

      getGrades: (levelKey) => {
        const g = get().grades[levelKey];
        return g ? { ...g } : { ...EMPTY_GRADES };
      },

      computeFinalScore: (levelKey) => {
        const g = get().grades[levelKey];
        if (!g) return null;
        const {
          levelTest: test,
          practice,
          anzanVisualNormal: vNormal,
          anzanVisualFlash: vFlash,
          anzanAudio: audio,
        } = g;
        if (test === null || practice === null || audio === null) return null;
        if (vNormal === null || vFlash === null) return null;
        const visualWeighted = vNormal * 0.05 + vFlash * 0.05;
        const raw = test * 0.7 + practice * 0.1 + audio * 0.1 + visualWeighted;
        return Math.round(raw);
      },

      setPendingRemediation: (p) =>
        set({ pendingRemediation: { ...p, createdAt: Date.now() } }),

      clearPendingRemediation: () => set({ pendingRemediation: null }),

      addRemediationSession: (s) =>
        set((state) => ({
          remediationHistory: [
            { ...s, id: makeRemediationId(), completedAt: Date.now() },
            ...state.remediationHistory,
          ].slice(0, 100),
        })),

      setExam1Passed: (passed) => set({ exam1Passed: passed }),
      setExam2Passed: (passed) => set({ exam2Passed: passed }),

      recordPlacementAttempt: () =>
        set((state) => ({
          lastPlacementAttempt: Date.now(),
          placementAttempts: state.placementAttempts + 1,
        })),

      setAnzanBadge: (key, value) =>
        set((state) => ({ anzanBadges: { ...state.anzanBadges, [key]: value } })),

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
            peakStreak: 0,
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
          const peakStreak = Math.max(
            existing.peakStreak ?? 0,
            consecutiveCorrect,
          );

          return {
            skillProgress: {
              ...state.skillProgress,
              [attempt.skillId]: {
                ...existing,
                attempts,
                correct,
                consecutiveCorrect,
                avgTimeMs,
                peakStreak,
              },
            },
            stats: {
              totalAttempts: state.stats.totalAttempts + 1,
              totalCorrect:
                state.stats.totalCorrect + (attempt.correct ? 1 : 0),
            },
          };
        }),

      completeLevel: (result, levelId) =>
        set((state) => {
          const wasCompleted = state.completedLevels.includes(
            levelId as LevelId,
          );
          return {
            levelExams: { ...state.levelExams, [result.examId]: result },
            completedLevels: wasCompleted
              ? state.completedLevels
              : uniqueLevels([...state.completedLevels, levelId as LevelId]),
          };
        }),

      addXP: (amount) =>
        set((state) => {
          const safeAmount = Math.max(0, amount);
          const today = getToday();
          
          // 🆕 v11: تحديث سجل النقاط اليومية
          const newDailyXP = { ...(state.dailyXP || {}) };
          newDailyXP[today] = (newDailyXP[today] || 0) + safeAmount;

          // تنظيف السجل للاحتفاظ بآخر 14 يوماً فقط لمنع امتلاء الذاكرة
          const dates = Object.keys(newDailyXP).sort();
          if (dates.length > 14) {
            const toRemove = dates.slice(0, dates.length - 14);
            toRemove.forEach(d => delete newDailyXP[d]);
          }

          return {
            totalXP: state.totalXP + safeAmount,
            ticketXP: Math.min(TICKET_XP_CAP, state.ticketXP + safeAmount),
            dailyXP: newDailyXP,
          };
        }),

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
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
      toggleHaptics: () =>
        set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),

      reset: () => set({ ...initialState }),

      buyTicket: () =>
        set((state) => {
          if (state.tickets >= TICKETS_MAX) return state;
          if (state.ticketXP < TICKET_COST) return state;
          return {
            ticketXP: state.ticketXP - TICKET_COST,
            tickets: state.tickets + 1,
          };
        }),

      consumeTicket: () =>
        set((state) => {
          if (state.tickets <= 0) return state;
          return { tickets: state.tickets - 1 };
        }),
    }),
    {
      name: "sorobanmind-v2-progress",
      version: 12,
      migrate: (persistedState, version) => {
        const old = (persistedState as Record<string, unknown>) || {};

        // ✅ [m8] دالة تُغلّف كل مسار، وتُطبِّق v12 على أي نسخة < 12
        const applyLevelIdMigration = (s: ProgressState): ProgressState => {
          if (version >= 12) return s;

          const toLevelId = (n: unknown): LevelId | null => {
            if (typeof n === "string" && /^L[0-7]$/.test(n)) return n as LevelId;
            if (typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 7)
              return `L${n}` as LevelId;
            return null;
          };

          const safeMap = (arr: unknown): LevelId[] =>
            (Array.isArray(arr) ? arr : [])
              .map(toLevelId)
              .filter((x): x is LevelId => x !== null);

          return {
            ...s,
            passedPractice:    safeMap(s.passedPractice),
            passedAnzanVisual: safeMap(s.passedAnzanVisual),
            passedAnzanAudio:  safeMap(s.passedAnzanAudio),
            completedLevels:   ((s.completedLevels as string[]) || []).filter(
              (lv) => /^L[0-7]$/.test(lv),
            ) as LevelId[],
          };
        };

        if (version < 3) {
          return applyLevelIdMigration({
            ...initialState,
            childName: (old.childName as string) || "",
            skillProgress: (old.skillProgress as Record<string, SkillProgress>) || {},
            levelExams: (old.levelExams as Record<string, ExamResult>) || {},
            totalXP: (old.xp as number) || (old.totalXP as number) || 0,
            currentStreak: (old.streak as number) || (old.currentStreak as number) || 0,
            lastPlayedDate: (old.lastPlayedDate as string) || null,
            completedLevels: (old.completedLevels as LevelId[]) || [],
              completedLessons: [] as string[],
} as ProgressState);
        }

        if (version < 4) {
          return applyLevelIdMigration({
            ...initialState,
            ...old,
            completedLessons: (old.completedLessons as string[]) || [],
          } as ProgressState);
        }

        if (version < 5) {
          return applyLevelIdMigration({
            ...initialState,
            ...old,
            grades: (old.grades as Record<string, LevelGrades>) || {},
            pendingRemediation: (old.pendingRemediation as PendingRemediation | null) || null,
            remediationHistory: (old.remediationHistory as RemediationSession[]) || [],
          } as ProgressState);
        }

        if (version < 6 || version < 7 || version < 8 || version < 9) {
          const oldTotalXP = (old.totalXP as number) || 0;
          const existingTicketXP = (old.ticketXP as number) || 0;
          const existingTickets = (old.tickets as number) || 0;
          return applyLevelIdMigration({
            ...initialState,
            ...old,
            ticketXP: existingTicketXP > 0 ? existingTicketXP : Math.min(TICKET_XP_CAP, oldTotalXP),
            tickets: existingTickets,
          } as ProgressState);
        }

        if (version < 10) {
          const oldSkillProgress = (old.skillProgress as Record<string, SkillProgress>) || {};
          const upgraded: Record<string, SkillProgress> = {};
          for (const [k, v] of Object.entries(oldSkillProgress)) {
            const sp = v as SkillProgress;
            upgraded[k] = { ...sp, peakStreak: sp.peakStreak ?? sp.consecutiveCorrect ?? 0 };
          }
          return applyLevelIdMigration({
            ...initialState,
            ...old,
            skillProgress: upgraded,
            stats: (old.stats as ProgressStats) || { totalAttempts: 0, totalCorrect: 0 },
          } as ProgressState);
        }

        if (version < 11) {
          return applyLevelIdMigration({
            ...initialState,
            ...old,
            dailyXP: (old.dailyXP as Record<string, number>) || {},
          } as ProgressState);
        }

        // المسار الأخير: v11 → v12 (حالة مصطفى)
        return applyLevelIdMigration(persistedState as ProgressState);
      },
    },
  ),
);

// ═══════════════════════════════════════════════════════════
// Selectors
// ═══════════════════════════════════════════════════════════

export const selectIsLevelComplete =
  (levelId: LevelId) => (state: ProgressState) =>
    state.completedLevels.includes(levelId);

export const selectIsLessonCompleted =
  (lessonId: string) => (state: ProgressState) =>
    state.completedLessons.includes(lessonId);

export const selectIsPracticePassed =
  (levelId: LevelId) => (state: ProgressState) =>
    state.passedPractice.includes(levelId);

export const selectIsAnzanVisualPassed =
  (levelId: LevelId) => (state: ProgressState) =>
    state.passedAnzanVisual.includes(levelId);

export const selectIsAnzanAudioPassed =
  (levelId: LevelId) => (state: ProgressState) =>
    state.passedAnzanAudio.includes(levelId);

export const selectPendingRemediation = (state: ProgressState) =>
  state.pendingRemediation;

export const selectRecentRemediation =
  (days: number) => (state: ProgressState) => {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return state.remediationHistory.filter((s) => s.completedAt >= cutoff);
  };

export const selectObservationAccuracy = (state: ProgressState): number => {
  const entries = Object.values(state.skillProgress);
  let totalAttempts = 0;
  let totalCorrect = 0;
  for (const s of entries) {
    totalAttempts += s.attempts ?? 0;
    totalCorrect += s.correct ?? 0;
  }
  if (totalAttempts === 0) return 0;
  return Math.min(100, Math.round((totalCorrect / totalAttempts) * 100));
};

export const selectTicketXP = (state: ProgressState) => state.ticketXP;
export const selectTickets = (state: ProgressState) => state.tickets;
export const selectCanBuyTicket = (state: ProgressState) =>
  state.tickets < TICKETS_MAX && state.ticketXP >= TICKET_COST;
export const selectHasTicket = (state: ProgressState) => state.tickets >= 1;
export const selectTicketProgress = (state: ProgressState) =>
  Math.min(100, (state.ticketXP / TICKET_COST) * 100);

// 🆕 v11: Selector لنشاط الأسبوع
export const selectDailyXP = (state: ProgressState) => state.dailyXP;

export default useProgressStore;