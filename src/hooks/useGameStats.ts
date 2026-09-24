// src/hooks/useGameStats.ts
import { useState, useCallback, useEffect } from 'react';
import type { GameStats } from '../types';
import { BADGES } from '../data';
import { isBadgeEarned } from '../utils/badgeChecker';

const STORAGE_KEY = 'sorobanmind-stats';
const LAST_VISIT_KEY = 'soroban_last_visit';

const DEFAULT_STATS: GameStats = {
  xp: 0,
  streak: 0,
  level: 1,
  soundEnabled: true,
  earnedBadges: [],
};

export function useGameStats() {
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          xp: typeof parsed.xp === 'number' ? parsed.xp : DEFAULT_STATS.xp,
          streak: typeof parsed.streak === 'number' ? parsed.streak : DEFAULT_STATS.streak,
          level: typeof parsed.level === 'number' ? parsed.level : DEFAULT_STATS.level,
          soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : DEFAULT_STATS.soundEnabled,
          earnedBadges: Array.isArray(parsed.earnedBadges) ? parsed.earnedBadges : DEFAULT_STATS.earnedBadges,
        };
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_STATS;
  });

  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY);

    if (lastVisit !== today) {
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const todayDate = new Date(today);
        const diffDays = Math.floor(
          (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (diffDays === 1) {
          setStats((prev) => ({ ...prev, streak: prev.streak + 1 }));
        } else if (diffDays > 1) {
          setStats((prev) => ({ ...prev, streak: 1 }));
        }
      } else {
        setStats((prev) => ({ ...prev, streak: 1 }));
      }

      localStorage.setItem(LAST_VISIT_KEY, today);
    }
  }, []);

  const checkBadges = useCallback(() => {
    setStats((prev) => {
      const earned = [...prev.earnedBadges];
      let justEarnedId: string | null = null;

      for (const badge of BADGES) {
        if (isBadgeEarned(badge) && !earned.includes(badge.id)) {
          earned.push(badge.id);
          justEarnedId = badge.id;
        }
      }

      if (justEarnedId) {
        setNewBadge(justEarnedId);
        return { ...prev, earnedBadges: earned };
      }

      return prev;
    });
  }, []);

  useEffect(() => {
    checkBadges();

    const handleStorage = (e: StorageEvent) => {
      const keysToWatch = [
        'soroban-completed-lessons',
        'soroban_exam_result',
        'soroban_anzan_badges',
      ];
      if (e.key && keysToWatch.includes(e.key)) {
        checkBadges();
      }
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(checkBadges, 3000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [checkBadges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      /* ignore */
    }
  }, [stats]);

  const addXP = useCallback(
    (amount: number) => {
      setStats((prev) => {
        const newXp = prev.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return {
          ...prev,
          xp: newXp,
          level: newLevel,
        };
      });
      setTimeout(checkBadges, 100);
    },
    [checkBadges],
  );

  const clearNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  const toggleSound = useCallback(() => {
    setStats((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const incrementStreak = useCallback(() => {
    setStats((prev) => ({ ...prev, streak: prev.streak + 1 }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_VISIT_KEY);
  }, []);

  return {
    stats,
    addXP,
    toggleSound,
    incrementStreak,
    newBadge,
    clearNewBadge,
    resetStats,
  };
}

export default useGameStats;