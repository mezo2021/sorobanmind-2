// src/store/masteryBadgesStore.ts
// متجر شارات الإتقان — Zustand + persist
// ═══════════════════════════════════════════════════════════
// - شارة لكل مهارة (S) يُتقنها الطفل بزمن قياسي
// - القياسي: ≤ 50% من answerMs
// - المقبول: ≤ 75% من answerMs
// - البطيء: > 75%
// ═══════════════════════════════════════════════════════════

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export type SpeedClass = "mastery" | "accepted" | "slow";

export interface MasteryBadge {
  /** معرّف المهارة (S3, S5...) */
  skillId: string;
  /** وقت الإتقان (timestamp) */
  masteredAt: number;
  /** أفضل وقت (ms) */
  bestTimeMs: number;
  /** زمن السؤال المعياري (ms) */
  answerMs: number;
  /** نسبة السرعة (bestTimeMs / answerMs) */
  speedRatio: number;
}

interface MasteryBadgesState {
  /** خريطة الشارات: skillId → MasteryBadge */
  badges: Record<string, MasteryBadge>;

  /** أضف شارة (فقط إذا كان الزمن قياسياً) */
  awardBadge: (
    skillId: string,
    timeMs: number,
    answerMs: number,
  ) => boolean;

  /** هل حصل على شارة هذه المهارة؟ */
  hasBadge: (skillId: string) => boolean;

  /** احصل على شارة */
  getBadge: (skillId: string) => MasteryBadge | null;

  /** كل الشارات كقائمة */
  getAllBadges: () => MasteryBadge[];

  /** عدد الشارات */
  count: () => number;

  /** تصفير */
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

/**
 * ✅ تصنيف السرعة وفق الزمن المعياري:
 *   - mastery  (قياسي):  ≤ 50% من answerMs
 *   - accepted (مقبول):  ≤ 75% من answerMs
 *   - slow     (بطيء):   > 75%
 */
export function classifySpeed(
  timeMs: number,
  answerMs: number,
): SpeedClass {
  if (answerMs <= 0) return "accepted";
  const ratio = timeMs / answerMs;
  if (ratio <= 0.5) return "mastery";
  if (ratio <= 0.75) return "accepted";
  return "slow";
}

/**
 * تسمية عربية للتصنيف.
 */
export function speedClassLabel(cls: SpeedClass): string {
  if (cls === "mastery") return "قياسي";
  if (cls === "accepted") return "مقبول";
  return "بطيء";
}

// ═══════════════════════════════════════════════════════════
// المتجر
// ═══════════════════════════════════════════════════════════

export const useMasteryBadgesStore = create<MasteryBadgesState>()(
  persist(
    (set, get) => ({
      badges: {},

      awardBadge: (skillId, timeMs, answerMs) => {
        const cls = classifySpeed(timeMs, answerMs);

        // ❌ لا شارة إلا بزمن قياسي
        if (cls !== "mastery") return false;

        const existing = get().badges[skillId];

        // إذا كانت موجودة — نُحدّث فقط إذا الوقت أفضل
        if (existing) {
          if (timeMs < existing.bestTimeMs) {
            set((state) => ({
              badges: {
                ...state.badges,
                [skillId]: {
                  ...existing,
                  bestTimeMs: timeMs,
                  speedRatio: timeMs / answerMs,
                  masteredAt: Date.now(),
                },
              },
            }));
            return true;
          }
          return false;
        }

        // شارة جديدة
        set((state) => ({
          badges: {
            ...state.badges,
            [skillId]: {
              skillId,
              masteredAt: Date.now(),
              bestTimeMs: timeMs,
              answerMs,
              speedRatio: timeMs / answerMs,
            },
          },
        }));
        return true;
      },

      hasBadge: (skillId) => Boolean(get().badges[skillId]),

      getBadge: (skillId) => get().badges[skillId] ?? null,

      getAllBadges: () =>
        Object.values(get().badges).sort(
          (a, b) => b.masteredAt - a.masteredAt,
        ),

      count: () => Object.keys(get().badges).length,

      reset: () => set({ badges: {} }),
    }),
    {
      name: "soroban_mastery_badges",
      version: 1,
    },
  ),
);

export default useMasteryBadgesStore;