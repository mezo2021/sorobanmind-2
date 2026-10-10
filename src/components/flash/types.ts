// src/components/flash/types.ts

export type FlashOperation = 'basics' | 'multiplication' | 'division';
export type FlashCategoryId = 'basics' | 'div-1' | 'div-2' | 'mult-1' | 'mult-2';
export type FlashLayout = 'single' | 'split';
export type RodTint = 'red' | 'emerald' | 'amber' | 'white';

export interface FlashStep {
  id: string;

  // ═══ للقسمة والضرب (معدادان) ═══
  dividendValue?: number;        // المضروب / المقسوم (يسار)
  resultValue?: number;          // الناتج (يمين)
  highlightDividend?: number[];  // إضاءة على المضروب/المقسوم
  highlightResult?: number[];    // إضاءة على الناتج
  blurDividend?: number[];       // 🆕 أعمدة مطموسة في المضروب/المقسوم

  // ═══ للأساسيات (معداد واحد) ═══
  sorobanValue?: number;
  activeRodIndex?: number;
  highlightColumns?: number[];
  highlightBeam?: boolean;

  // ═══ مشترك ═══
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

  // للقسمة والضرب
  resultColumns?: number;
  dividendColumns?: number;

  // 🆕 للضرب
  multiplicand?: number;   // المضروب (32)
  multiplier?: number;     // المضروب فيه (11)

  steps: FlashStep[];
}

export interface FlashCategory {
  id: FlashCategoryId;
  title: string;
  emoji: string;
  description: string;
  lessons: FlashLesson[];
}