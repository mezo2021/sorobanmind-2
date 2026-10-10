// src/components/flash/types.ts

export type FlashOperation = 'basics' | 'multiplication' | 'division';
export type FlashCategoryId = 'basics' | 'div-1' | 'div-2' | 'mult';
export type FlashLayout = 'single' | 'split';
export type RodTint = 'red' | 'emerald' | 'amber' | 'white';

export interface FlashStep {
  id: string;
  // Single layout (basics)
  sorobanValue?: number;
  activeRodIndex?: number;
  highlightBeam?: boolean;
  // Split layout (division/multiplication)
  resultValue?: number;
  dividendValue?: number;
  highlightResult?: number[];    // indices in result abacus → white
  highlightDividend?: number[];  // indices in dividend abacus → white
  // Common
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
  columns: number;              // for single layout
  layout?: FlashLayout;         // 'single' (default) | 'split'
  resultColumns?: number;       // for split
  dividendColumns?: number;     // for split
  steps: FlashStep[];
}

export interface FlashCategory {
  id: FlashCategoryId;
  title: string;
  emoji: string;
  description: string;
  lessons: FlashLesson[];
}