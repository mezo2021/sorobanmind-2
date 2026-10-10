// src/components/flash/types.ts

export type FlashOperation = 'basics' | 'multiplication' | 'division';
export type FlashCategoryId = 'basics' | 'div-1' | 'div-2' | 'mult';

export interface FlashStep {
  id: string;
  sorobanValue: number;
  activeRodIndex: number;
  /** ⭐ جديد — إضاءة العارضة الأفقية */
  highlightBeam?: boolean;
  badgeLines: string[];
  caption: string;
  ttsText: string;
  durationMs: number;
}

export interface FlashLesson {
  id: string;
  title: string;
  subtitle: string;
  operation: FlashOperation;
  category: FlashCategoryId;
  columns: number;
  steps: FlashStep[];
}

export interface FlashCategory {
  id: FlashCategoryId;
  title: string;
  emoji: string;
  description: string;
  lessons: FlashLesson[];
}