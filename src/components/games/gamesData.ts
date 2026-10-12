// ═══════════════════════════════════════════════════════════════════
// 🆕 src/components/games/gamesData.ts — v5
// ═══════════════════════════════════════════════════════════════════
//
// ما تغيّر عن v4:
//   - anzan-island → sorobania-island
//   - البطلة: sham → bana
//   - العنوان: جزيرة سوروبانيا
//   - status: building → ready
// ═══════════════════════════════════════════════════════════════════

import type { CharacterType } from '../../types';

export type GameId =
  | 'flying-abacus'
  | 'detective'
  | 'friends'
  | 'pirate-race'
  | 'sorobania-island';

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
];

export function getGameById(id: GameId): GameMeta | undefined {
  return GAMES.find((g) => g.id === id);
}