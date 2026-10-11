// src/components/flash/types.ts

export type FlashOperation = 'basics' | 'multiplication' | 'division' | 'chains';
export type FlashCategoryId = 'basics' | 'chains' | 'div-1' | 'div-2' | 'mult-1' | 'mult-2';
export type FlashLayout = 'single' | 'split';
export type RodTint = 'red' | 'emerald' | 'amber' | 'white';

export interface FlashStep {
  id: string;

  // للقسمة والضرب (معدادان)
  dividendValue?: number;
  resultValue?: number;
  highlightDividend?: number[];
  highlightResult?: number[];
  blurDividend?: number[];

  // للأساسيات والسلاسل (معداد واحد)
  sorobanValue?: number;
  activeRodIndex?: number;
  highlightColumns?: number[];
  highlightBeam?: boolean;
  isFinal?: boolean;

  // مشترك
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
  layout?: FlashLayout;
  resultColumns?: number;
  dividendColumns?: number;
  multiplicand?: number;
  multiplier?: number;
  steps: FlashStep[];
}

export interface FlashCategory {
  id: FlashCategoryId;
  title: string;
  emoji: string;
  description: string;
  lessons: FlashLesson[];
}