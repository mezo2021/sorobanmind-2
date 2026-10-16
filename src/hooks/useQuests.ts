// src/hooks/useQuests.ts
// ✅ 12 إنجازاً نوعياً من progressStore + masteryBadgesStore
// ✅ مرتّب: الأقرب للتحقيق أولاً
// 📅 v10 — 2026-10-16

import { useMemo } from 'react';
import {
  useProgressStore,
  type ProgressStats,
  type SkillProgress,
  type RemediationSession,
} from '../store/progressStore';
import {
  useMasteryBadgesStore,
  type MasteryBadge,
} from '../store/masteryBadgesStore';
import { SRB_SECTIONS } from '../data/srb/curriculum';

// ═══════════════════════════════════════════════════════════
// النوع
// ═══════════════════════════════════════════════════════════

export interface Achievement {
  id: string;
  titleAr: string;
  descriptionAr: string;
  icon: string;
  progress: number;
  target: number;
  earned: boolean;
}

// ═══════════════════════════════════════════════════════════
// دوال مساعدة
// ═══════════════════════════════════════════════════════════

function countConqueredSections(
  skillProgress: Record<string, SkillProgress>,
): number {
  let count = 0;
  for (const section of SRB_SECTIONS) {
    const allMastered = Array.from(
      { length: section.moduleCount },
      (_, i) => `m${i + 1}`,
    ).every((m) => {
      const sp = skillProgress[`${section.level}-${section.id}-${m}`];
      return sp && sp.attempts >= 5 && sp.attempts === sp.correct;
    });
    if (allMastered) count++;
  }
  return count;
}

function countChainGuardians(
  skillProgress: Record<string, SkillProgress>,
): number {
  return Object.values(skillProgress).filter((s) => {
    const parts = s.skillId.split('-');
    if (parts.length !== 3) return false;
    if (parts[1] !== 'S09' && parts[1] !== 'S10') return false;
    return (s.peakStreak ?? 0) >= 15;
  }).length;
}

// ═══════════════════════════════════════════════════════════
// الحساب
// ═══════════════════════════════════════════════════════════

function computeAchievements(
  skillProgress: Record<string, SkillProgress>,
  stats: ProgressStats,
  remediationHistory: RemediationSession[],
  masteryBadges: Record<string, MasteryBadge>,
): Achievement[] {
  const skills = Object.values(skillProgress);
  const badges = Object.values(masteryBadges);

  const remediatedIds = new Set<string>();
  remediationHistory.forEach((r) =>
    r.skills.forEach((id) => remediatedIds.add(id)),
  );

  const raw: Achievement[] = [
    {
      id: 'sniper',
      titleAr: 'القنّاص',
      descriptionAr: 'مهارة بدقة ٩٥٪',
      icon: '🎯',
      progress: skills.filter(
        (s) => s.attempts >= 10 && s.correct / s.attempts >= 0.95,
      ).length,
      target: 1,
      earned: false,
    },
    {
      id: 'flow',
      titleAr: 'المتدفق',
      descriptionAr: '٢٥ إجابة متتالية',
      icon: '🌊',
      progress: skills.filter((s) => (s.peakStreak ?? 0) >= 25).length,
      target: 1,
      earned: false,
    },
    {
      id: 'persistent',
      titleAr: 'المثابر',
      descriptionAr: '١٠٠ محاولة إجمالية',
      icon: '🏋️',
      progress: stats.totalAttempts,
      target: 100,
      earned: false,
    },
    {
      id: 'explorer',
      titleAr: 'المستكشف',
      descriptionAr: 'جرّب ٢٠ مهارة',
      icon: '🧭',
      progress: skills.filter((s) => s.attempts >= 1).length,
      target: 20,
      earned: false,
    },
    {
      id: 'resilient',
      titleAr: 'الصامد',
      descriptionAr: 'تعافى من جلسة علاجية',
      icon: '⛰️',
      progress: badges.filter((b) => remediatedIds.has(b.skillId)).length,
      target: 1,
      earned: false,
    },
    {
      id: 'fast',
      titleAr: 'السريع',
      descriptionAr: '٥ مهارات بزمن قياسي',
      icon: '⚡',
      progress: badges.filter((b) => b.bestTimeMs < 3000).length,
      target: 5,
      earned: false,
    },
    {
      id: 'excellent',
      titleAr: 'المتفوق',
      descriptionAr: '٨ شارات إتقان',
      icon: '🌟',
      progress: badges.length,
      target: 8,
      earned: false,
    },
    {
      id: 'accurate',
      titleAr: 'الدقيق',
      descriptionAr: '٥ مهارات بلا خطأ',
      icon: '🔍',
      progress: skills.filter(
        (s) => s.attempts >= 5 && s.attempts === s.correct,
      ).length,
      target: 5,
      earned: false,
    },
    {
      id: 'rising',
      titleAr: 'الصاعد',
      descriptionAr: 'دقة ٨٥٪ في مهارة مكثفة',
      icon: '🚀',
      progress: skills.filter(
        (s) => s.attempts >= 20 && s.correct / s.attempts >= 0.85,
      ).length,
      target: 1,
      earned: false,
    },
    {
      id: 'guardian',
      titleAr: 'الحارس',
      descriptionAr: '١٥ متتالية في السلاسل',
      icon: '🛡️',
      progress: countChainGuardians(skillProgress),
      target: 1,
      earned: false,
    },
    {
      id: 'conqueror',
      titleAr: 'الفاتح',
      descriptionAr: 'أتم قسم كامل',
      icon: '🎓',
      progress: countConqueredSections(skillProgress),
      target: 1,
      earned: false,
    },
    {
      id: 'pioneer',
      titleAr: 'الرائد',
      descriptionAr: '٥٠٠ إجابة صحيحة',
      icon: '👑',
      progress: stats.totalCorrect,
      target: 500,
      earned: false,
    },
  ];

  const withEarned = raw.map((a) => ({
    ...a,
    earned: a.progress >= a.target,
  }));

  // ترتيب: المحقق أولاً · ثم الأقرب للتحقيق
  return withEarned.sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    const pctA = Math.min(1, a.progress / a.target);
    const pctB = Math.min(1, b.progress / b.target);
    return pctB - pctA;
  });
}

// ═══════════════════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════════════════

export function useQuests(): Achievement[] {
  const skillProgress = useProgressStore((s) => s.skillProgress);
  const stats = useProgressStore((s) => s.stats);
  const remediationHistory = useProgressStore((s) => s.remediationHistory);
  const masteryBadges = useMasteryBadgesStore((s) => s.badges);

  return useMemo(
    () =>
      computeAchievements(
        skillProgress,
        stats,
        remediationHistory,
        masteryBadges,
      ),
    [skillProgress, stats, remediationHistory, masteryBadges],
  );
}

export default useQuests;