// src/hooks/useGameStats.ts
// ✅ SRB Adapter فوق progressStore
// ✅ بلا earnedBadges — لا badgeChecker · لا BADGES
// 📅 v10 — 2026-10-16

import { useCallback, useEffect } from 'react';
import type { GameStats } from '../types';

import { useProgressStore } from '../store/progressStore';

export function useGameStats() {
  const totalXP = useProgressStore((s) => s.totalXP);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);

  const addXPStore = useProgressStore((s) => s.addXP);
  const updateStreakStore = useProgressStore((s) => s.updateStreak);
  const toggleSoundStore = useProgressStore((s) => s.toggleSound);
  const resetStore = useProgressStore((s) => s.reset);

  useEffect(() => {
    updateStreakStore();
  }, [updateStreakStore]);

  const level = Math.floor(totalXP / 100) + 1;

  const stats: GameStats = {
    xp: totalXP,
    streak: currentStreak,
    level,
    soundEnabled,
  };

  const addXP = useCallback((amount: number) => addXPStore(amount), [addXPStore]);
  const incrementStreak = useCallback(() => updateStreakStore(), [updateStreakStore]);
  const toggleSound = useCallback(() => toggleSoundStore(), [toggleSoundStore]);
  const clearNewBadge = useCallback(() => {}, []);
  const resetStats = useCallback(() => resetStore(), [resetStore]);

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