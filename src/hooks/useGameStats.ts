// src/hooks/useGameStats.ts
// ✅ SRB Adapter: يقرأ من progressStore + masteryBadgesStore
// ✅ يحافظ على نفس الواجهة القديمة (4 شاشات تعمل بلا تعديل)
// 📅 آخر تحديث: SRB Migration — Phase 2

import { useCallback, useEffect, useMemo } from 'react';
import type { GameStats } from '../types';

// ═══ SRB Stores ═══
import { useProgressStore } from '../store/progressStore';
import { useMasteryBadgesStore } from '../store/masteryBadgesStore';

// ═══ توافق مع BadgeModal (القديم) ═══
import { getAllEarnedBadges } from '../utils/badgeChecker';

// ═══════════════════════════════════════════════════════════
// Hook — Adapter فوق progressStore
// ═══════════════════════════════════════════════════════════

export function useGameStats() {
  // ─── progressStore (SRB — مصدر الحقيقة) ───
  const totalXP = useProgressStore((s) => s.totalXP);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);
  const completedLevels = useProgressStore((s) => s.completedLevels);

  // ─── Actions من progressStore ───
  const addXPStore = useProgressStore((s) => s.addXP);
  const updateStreakStore = useProgressStore((s) => s.updateStreak);
  const toggleSoundStore = useProgressStore((s) => s.toggleSound);
  const resetStore = useProgressStore((s) => s.reset);

  // ─── masteryBadgesStore ───
  const masteryBadges = useMasteryBadgesStore((s) => s.badges);

  // ─── تحديث streak تلقائيًا عند Mount ───
  // (updateStreak آمن — لا يزيد أكثر من مرة واحدة في اليوم)
  useEffect(() => {
    updateStreakStore();
  }, [updateStreakStore]);

  // ─── المستوى مشتق من XP ───
  const level = Math.floor(totalXP / 100) + 1;

  // ─── earnedBadges: مزيج من SRB + القديم (لتوافق BadgeModal) ───
  const earnedBadges: string[] = useMemo(
    () => [
      ...Object.keys(masteryBadges),
      ...(completedLevels as unknown as string[]),
      ...getAllEarnedBadges(),
    ],
    [masteryBadges, completedLevels],
  );

  // ─── stats (نفس الشكل القديم) ───
  const stats: GameStats = {
    xp: totalXP,
    streak: currentStreak,
    level,
    soundEnabled,
    earnedBadges,
  };

  // ─── Actions (wrapper للحفاظ على نفس الواجهة) ───
  const addXP = useCallback(
    (amount: number) => {
      addXPStore(amount);
    },
    [addXPStore],
  );

  const incrementStreak = useCallback(() => {
    updateStreakStore();
  }, [updateStreakStore]);

  const toggleSound = useCallback(() => {
    toggleSoundStore();
  }, [toggleSoundStore]);

  const clearNewBadge = useCallback(() => {
    // no-op في SRB — الشارات تُعرض في GuardianDashboard
  }, []);

  const resetStats = useCallback(() => {
    resetStore();
  }, [resetStore]);

  return {
    stats,
    addXP,
    toggleSound,
    incrementStreak,
    newBadge: null as string | null,
    clearNewBadge,
    resetStats,
  };
}

export default useGameStats;