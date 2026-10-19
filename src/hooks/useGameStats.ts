// src/hooks/useGameStats.ts
// ✅ SRB Adapter فوق progressStore
// ✅ بلا earnedBadges — لا badgeChecker · لا BADGES
// 📅 v10 — 2026-10-16
// 🔧 تعديل جراحي: حساب المستوى بناءً على درجة الاختبار (80%) بدلاً من المصفوفة الملوثة

import { useCallback, useEffect, useMemo } from 'react'; // أضفنا useMemo
import type { GameStats } from '../types';

import { useProgressStore } from '../store/progressStore';

export function useGameStats() {
  const totalXP = useProgressStore((s) => s.totalXP);
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const soundEnabled = useProgressStore((s) => s.soundEnabled);
  
  // 1️⃣ التعديل الأول: بدلاً من قراءة طول المصفوفة الملوثة، نقرأ درجات المستويات
  const grades = useProgressStore((s) => s.grades);

  const addXPStore = useProgressStore((s) => s.addXP);
  const updateStreakStore = useProgressStore((s) => s.updateStreak);
  const toggleSoundStore = useProgressStore((s) => s.toggleSound);
  const resetStore = useProgressStore((s) => s.reset);

  useEffect(() => {
    updateStreakStore();
  }, [updateStreakStore]);

  // 2️⃣ التعديل الثاني: نحسب عدد المستويات التي درجة اختبارها 80 أو أكثر
  const passedLevelsCount = useMemo(() => {
    const levelIds = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
    return levelIds.filter((id) => {
      const g = grades[id];
      return g && g.levelTest !== null && g.levelTest >= 80;
    }).length;
  }, [grades]);

  // 3️⃣ التعديل الثالث: نستخدم العدد الجديد (مع وضع سقف 7 لمنع ظهور L8)
  const level = Math.min(passedLevelsCount, 7);

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