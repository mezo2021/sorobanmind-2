// src/store/masteryBadgesStore.ts
// متجر شارات الإتقان — Zustand + persist

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export type SpeedClass = "mastery" | "accepted" | "slow";

export interface MasteryBadge {
  skillId: string;
  masteredAt: number;
  bestTimeMs: number;
  answerMs: number;
  speedRatio: number;
}

interface MasteryBadgesState {
  badges: Record<string, MasteryBadge>;
  awardBadge: (
    skillId: string,
    timeMs: number,
    answerMs: number,
  ) => boolean;
  hasBadge: (skillId: string) => boolean;
  getBadge: (skillId: string) => MasteryBadge | null;
  getAllBadges: () => MasteryBadge[];
  count: () => number;
  reset: () => void;
}

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

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
        if (cls !== "mastery") return false;

        const existing = get().badges[skillId];

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