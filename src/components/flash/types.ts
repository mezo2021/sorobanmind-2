// src/components/flash/types.ts
// 🎬 أنواع الفلاشات التعليمية

export type FlashOperation = 'basics' | 'multiplication' | 'division';

export type FlashCategoryId = 'basics' | 'div-1' | 'div-2' | 'mult';

export interface FlashStep {
  /** معرّف فريد للخطوة */
  id: string;

  /** القيمة المعروضة على العداد */
  sorobanValue: number;

  /** العمود النشط (للـ Glow Ring) — 0 = أعلى منزلة · -1 = لا Glow */
  activeRodIndex: number;

  /** الشارة الأساسية (مثلاً "8 ÷ 2 = 4") */
  badgePrimary: string;

  /** الشارة الثانوية (تظهر بعد 250ms — مثلاً "4 × 2 = 8") */
  badgeSecondary?: string;

  /** الشرح أسفل العداد */
  caption: string;

  /** النص المُسموع (TTS) */
  ttsText: string;

  /** مدة العرض الكلية (بالملي ثانية) */
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