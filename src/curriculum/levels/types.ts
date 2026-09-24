// src/curriculum/levels/types.ts

import type { Category, MovementType } from "../types";

/**
 * خطوة تفاعلية واحدة في درس.
 */
export interface LessonStep {
  /** رقم الخطوة */
  stepIndex: number;

  /** النص الإرشادي (يظهر للمستخدم) */
  instructionAr: string;
  instructionEn: string;

  /** الإصبع المستخدم */
  fingerUsed: "thumb" | "index" | "both_pinch" | "left_index";

  /** الاتجاه */
  direction: "up" | "down" | "pinch_in" | "pinch_out";

  /** العمود المستهدف */
  targetColumn: "units" | "tens" | "hundreds" | "thousands";

  /** الخرزات المتأثرة */
  beadsAffected: number[];

  /** القيمة بعد الخطوة */
  expectedValueAfter: number;
}

/**
 * مثال محلول داخل الدرس.
 */
export interface LessonExample {
  /** المعرّف داخل الدرس */
  id: string;

  /** نص المسألة */
  problemText: string;

  /** الإجابة */
  answer: number;

  /** التصنيف (direct, five-friend, ...) */
  ruleCategory: MovementType;

  /** الخطوات التفاعلية */
  steps: LessonStep[];

  /** الشرح المبسط */
  explanationAr: string;
  explanationEn: string;

  /** قصة مصغّرة (اختياري) */
  storyAr?: string;
  storyEn?: string;
}

/**
 * نشاط حسي (Montessori).
 */
export interface TactileActivity {
  titleAr: string;
  titleEn: string;
  materials: string[];
  steps: string[];
  goalAr: string;
  goalEn: string;
}

/**
 * جدول قاعدة.
 */
export interface RuleTableRow {
  formula: string;
  result: string;
}

/**
 * محتوى مستوى كامل.
 */
export interface LevelContent {
  /** معرّف المستوى (يطابق data/curriculum.ts) */
  id: string;

  /** الرقم */
  number: number;

  /** الفئة (kids/teens/both) */
  category: Category | "both";

  /** نوع التفاعل */
  interactionMode: "number-input" | "abacus-representation" | "read-soroban";

  /** الشرح العام */
  conceptAr: string;
  conceptEn: string;

  /** نص صوتي (يُقرأ بـ TTS أو MP3) */
  audioTextAr: string;
  audioTextEn: string;

  /** القاعدة الأساسية */
  ruleAr: string;
  ruleEn: string;

  /** جدول القاعدة (اختياري) */
  ruleTable?: RuleTableRow[];

  /** القصة الكاملة */
  storyAr: string;
  storyEn: string;

  /** النشاط الحسي (اختياري) */
  tactileActivity?: TactileActivity;

  /** الأمثلة */
  examples: LessonExample[];

  /** الوقت المتوقع بالدقائق */
  estimatedMinutes: number;
}