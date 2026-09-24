// src/hooks/useQuests.ts
import { useState, useEffect } from 'react';
import { QUESTS } from '../data';
import type { Quest } from '../types';

const COMPLETED_STORAGE_KEY = 'soroban-completed-lessons';
const ANZAN_STORAGE_KEY = 'soroban_anzan_stats';
const PRACTICE_STORAGE_KEY = 'soroban_practice_stats';
const STATS_STORAGE_KEY = 'sorobanmind-stats';

interface AnzanStats {
  highScore: number;
  totalRounds: number;
  totalCorrect: number;
}

interface PracticeStats {
  totalProblems: number;
  correctAnswers: number;
  additionProblems: number;
  subtractionProblems: number;
  multiplicationProblems: number;
  divisionProblems: number;
}

interface StoredStats {
  xp: number;
  streak: number;
  level: number;
  soundEnabled: boolean;
  earnedBadges: string[];
}

function safeRead<T extends object>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return { ...fallback, ...parsed } as T;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function calculateProgress(
  type: string,
  completed: number[],
  anzanStats: AnzanStats,
  practiceStats: PracticeStats,
  stats: StoredStats,
): number {
  switch (type) {
    case 'practice':
      return practiceStats.totalProblems;
    case 'anzan':
      return anzanStats.totalCorrect;
    case 'anzanHighScore':
      return anzanStats.highScore;
    case 'streak':
      return stats.streak;
    case 'lessons':
      return completed.length;
    case 'addition':
      return practiceStats.additionProblems || 0;
    case 'subtraction':
      return practiceStats.subtractionProblems || 0;
    case 'multiplication':
      return practiceStats.multiplicationProblems || 0;
    case 'division':
      return practiceStats.divisionProblems || 0;
    case 'badges':
      return stats.earnedBadges.length;
    default:
      return 0;
  }
}

function computeQuests(): Quest[] {
  const completed: number[] = (() => {
    try {
      const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const anzanStats = safeRead<AnzanStats>(ANZAN_STORAGE_KEY, {
    highScore: 0,
    totalRounds: 0,
    totalCorrect: 0,
  });

  const practiceStats = safeRead<PracticeStats>(PRACTICE_STORAGE_KEY, {
    totalProblems: 0,
    correctAnswers: 0,
    additionProblems: 0,
    subtractionProblems: 0,
    multiplicationProblems: 0,
    divisionProblems: 0,
  });

  const stats = safeRead<StoredStats>(STATS_STORAGE_KEY, {
    xp: 0,
    streak: 0,
    level: 1,
    soundEnabled: true,
    earnedBadges: [],
  });

  return QUESTS.map((quest) => ({
    ...quest,
    progress: calculateProgress(
      quest.type,
      completed,
      anzanStats,
      practiceStats,
      stats,
    ),
  }));
}

export function useQuests() {
  const [quests, setQuests] = useState<Quest[]>(() => computeQuests());

  useEffect(() => {
    const interval = setInterval(() => {
      setQuests(computeQuests());
    }, 2000);

    const handleStorage = () => {
      setQuests(computeQuests());
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return quests;
}

export default useQuests;