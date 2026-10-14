// src/hooks/useQuests.ts
// [F1] إصلاح مهام لوحة ولي الأمر:
//   - practice · anzan · anzanHighScore · addition/subtraction/multiplication/division → localStorage (يُكتب الآن)
//   - streak → progressStore.currentStreak
//   - lessons → localStorage (soroban_completed_lessons)
//   - badges → progressStore.anzanBadges + anzanAudioBadges + masteryBadgesStore

import { useState, useEffect } from 'react';
import { QUESTS } from '../data';
import type { Quest } from '../types';
import { useProgressStore } from '../store/progressStore';
import { useMasteryBadgesStore } from '../store/masteryBadgesStore';

const COMPLETED_STORAGE_KEY = 'soroban_completed_lessons';
const ANZAN_STORAGE_KEY = 'soroban_anzan_stats';
const PRACTICE_STORAGE_KEY = 'soroban_practice_stats';

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

function readLocalStats() {
  const completed: number[] = (() => {
    try {
      const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const anzan = safeRead<AnzanStats>(ANZAN_STORAGE_KEY, {
    highScore: 0,
    totalRounds: 0,
    totalCorrect: 0,
  });

  const practice = safeRead<PracticeStats>(PRACTICE_STORAGE_KEY, {
    totalProblems: 0,
    correctAnswers: 0,
    additionProblems: 0,
    subtractionProblems: 0,
    multiplicationProblems: 0,
    divisionProblems: 0,
  });

  return { completed, anzan, practice };
}

export function useQuests(): Quest[] {
  const [local, setLocal] = useState(readLocalStats);

  // ✅ من progressStore (reactive)
  const currentStreak = useProgressStore((s) => s.currentStreak);
  const anzanBadges = useProgressStore((s) => s.anzanBadges);
  const anzanAudioBadges = useProgressStore((s) => s.anzanAudioBadges);

  // ✅ من masteryBadgesStore (reactive)
  const masteryCount = useMasteryBadgesStore(
    (s) => Object.keys(s.badges).length,
  );

  // ✅ تحديث دوري خفيف لقراءة localStorage (بعد كل جلسة)
  useEffect(() => {
    const refresh = () => setLocal(readLocalStats());
    const interval = setInterval(refresh, 2000);
    window.addEventListener('storage', refresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const badgesCount =
    Object.values(anzanBadges).filter(Boolean).length +
    Object.values(anzanAudioBadges).filter(Boolean).length +
    masteryCount;

  return QUESTS.map((quest) => {
    let progress = 0;

    switch (quest.type) {
      case 'practice':
        progress = local.practice.totalProblems;
        break;
      case 'anzan':
        progress = local.anzan.totalCorrect;
        break;
      case 'anzanHighScore':
        progress = local.anzan.highScore;
        break;
      case 'streak':
        progress = currentStreak ?? 0;
        break;
      case 'lessons':
        progress = local.completed.length;
        break;
      case 'addition':
        progress = local.practice.additionProblems || 0;
        break;
      case 'subtraction':
        progress = local.practice.subtractionProblems || 0;
        break;
      case 'multiplication':
        progress = local.practice.multiplicationProblems || 0;
        break;
      case 'division':
        progress = local.practice.divisionProblems || 0;
        break;
      case 'badges':
        progress = badgesCount;
        break;
      default:
        progress = 0;
    }

    return { ...quest, progress };
  });
}

export default useQuests;