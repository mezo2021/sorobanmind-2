// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/gamesData.ts — v6
// ═══════════════════════════════════════════════════════════════════

import type { CharacterType } from '../../types';

export type GameId =
  | 'flying-abacus'
  | 'detective'
  | 'friends'
  | 'pirate-race'
  | 'sorobania-island'
  | 'mental-archives'; // 👈 أضفنا اللعبة الجديدة هنا

export type GameStatus = 'ready' | 'building';

export interface GameMeta {
  id: GameId;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  recommendHero: CharacterType;
  duration: string;
  status: GameStatus;
}

export const GAMES: GameMeta[] = [
  {
    id: 'flying-abacus',
    title: 'العداد الطائر',
    subtitle: 'اقرأ قيمة المعداد بسرعة البرق',
    icon: '🛸',
    gradient: 'from-sky-500 to-blue-700',
    recommendHero: 'rayan',
    duration: '60 ثانية',
    status: 'ready',
  },
  {
    id: 'detective',
    title: 'المحقق الرقمي',
    subtitle: 'اكتشف الخطأ وأصلح المعداد',
    icon: '🔍',
    gradient: 'from-violet-500 to-purple-700',
    recommendHero: 'joud',
    duration: '45 ثانية',
    status: 'ready',
  },
  {
    id: 'friends',
    title: 'دوجو السوروبان',
    subtitle: 'أسرار الجدة 5 والعملاق 10',
    icon: '🥋',
    gradient: 'from-emerald-500 to-teal-700',
    recommendHero: 'sham',
    duration: '90 ثانية',
    status: 'ready',
  },
  {
    id: 'pirate-race',
    title: 'سباق القراصنة',
    subtitle: 'أسرع من العاصفة',
    icon: '🏴‍☠️',
    gradient: 'from-rose-500 to-red-700',
    recommendHero: 'rayan',
    duration: '90 ثانية',
    status: 'ready',
  },
  {
    id: 'sorobania-island',
    title: 'جزيرة سوروبانيا',
    subtitle: 'أسرار المربعات والجذور',
    icon: '🏝️',
    gradient: 'from-amber-500 to-orange-700',
    recommendHero: 'bana',
    duration: '60 ثانية',
    status: 'ready',
  },
  {
    id: 'mental-archives',
    title: 'بوابة الثقب الدودي',
    subtitle: 'رحلة الزمن والحساب التخيلي',
    icon: '🌀',
    gradient: 'from-indigo-600 to-purple-800',
    recommendHero: 'joud',
    duration: '60 ثانية',
    status: 'ready',
  }
];

export function getGameById(id: GameId): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}