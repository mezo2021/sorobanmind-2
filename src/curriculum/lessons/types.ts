// src/curriculum/lessons/types.ts
// أنواع دروس المنهاج الجديد (L0-L7)

// ═══════════════════════════════════════════════════════════
// الأنواع الأساسية
// ═══════════════════════════════════════════════════════════

/** الإصبع المستخدم في الحركة */
export type FingerUsed = 'thumb' | 'index' | 'both_pinch' | 'left_index';

/** اتجاه الحركة */
export type Direction = 'up' | 'down' | 'pinch_in' | 'pinch_out';

/** العمود المستهدف */
export type TargetColumn = 'units' | 'tens' | 'hundreds' | 'thousands';

/** تصنيف القاعدة (لتصنيف الأمثلة) */
export type RuleCategory =
  | 'direct'         // مباشر
  | 'small_friends'  // صديق 5
  | 'big_friends'    // صديق 10
  | 'combined'       // مركب
  | 'read'           // اقرأ
  | 'build';         // مثّل

/** نوع سؤال "جرّب" */
export type TryQuestionType =
  | 'read'          // اقرأ الرقم على المعداد
  | 'build'         // مثّل الرقم على المعداد
  | 'build-value'   // ابنِ قيمة رقم داخل عدد
  | 'compare'       // اختر الأكبر / الأصغر
  | 'sequence';     // رتّب تصاعدياً

// ═══════════════════════════════════════════════════════════
// الخطوات التفاعلية
// ═══════════════════════════════════════════════════════════

export interface LessonStep {
  stepIndex: number;
  instructionText: string;
  fingerUsed: FingerUsed;
  direction: Direction;
  targetColumn: TargetColumn;
  beadsAffected: number[];
  expectedValueAfter: number;
}

// ═══════════════════════════════════════════════════════════
// المثال المحلول
// ═══════════════════════════════════════════════════════════

export interface LessonExample {
  id: string;
  problemText: string;
  answer: number;
  ruleCategory: RuleCategory;
  steps: LessonStep[];
  explanation: string;
}

// ═══════════════════════════════════════════════════════════
// سؤال "جرّب"
// ═══════════════════════════════════════════════════════════

export interface TryQuestion {
  id: string;
  type: TryQuestionType;
  prompt: string;
  expectedValue: number;
  steps?: LessonStep[];
  explanation?: string;
  /** 🆕 الأرقام المعروضة كأزرار (لـ compare و sequence) */
  choices?: number[];
}

// ═══════════════════════════════════════════════════════════
// صفحة المقدمة
// ═══════════════════════════════════════════════════════════

export interface IntroPage {
  id: string;
  title: string;
  content: string;
  imageSvg?: string;
  imageAlt?: string;
}

// ═══════════════════════════════════════════════════════════
// النشاط الحسي
// ═══════════════════════════════════════════════════════════

export interface TactileActivity {
  title: string;
  materials: string[];
  steps: string[];
  goal: string;
}

// ═══════════════════════════════════════════════════════════
// جدول القاعدة
// ═══════════════════════════════════════════════════════════

export interface RuleTableRow {
  formula: string;
  result: string;
}

// ═══════════════════════════════════════════════════════════
// نص ثنائي اللغة
// ═══════════════════════════════════════════════════════════

export interface BilingualText {
  ar: string;
  en: string;
}

// ═══════════════════════════════════════════════════════════
// الدرس الكامل
// ═══════════════════════════════════════════════════════════

export interface LessonNode {
  id: string;
  skillId: string | null;
  levelId: string;
  order: number;
  title: BilingualText;
  story: BilingualText;
  storyAudioId: number | null;
  concept: BilingualText;
  rule?: BilingualText;
  ruleTable?: RuleTableRow[];
  examples: LessonExample[];
  tryQuestions: TryQuestion[];
  tactileActivity?: TactileActivity;
  introPages?: IntroPage[];
  estimatedMinutes: number;
  xpReward: number;
  isTheoretical?: boolean;
}

// ═══════════════════════════════════════════════════════════
// الدوال المساعدة
// ═══════════════════════════════════════════════════════════

export function getStoryAudioPath(storyAudioId: number | null): string | null {
  if (storyAudioId === null) return null;
  return `https://mezo2021.github.io/sorobanmind-2/audio/stories/story-${storyAudioId}.mp3`;
}

export function hasExamples(lesson: LessonNode): boolean {
  return lesson.examples.length > 0;
}

export function hasTryQuestions(lesson: LessonNode): boolean {
  return lesson.tryQuestions.length > 0;
}

export function isPureIntro(lesson: LessonNode): boolean {
  return lesson.isTheoretical === true && !hasExamples(lesson) && !hasTryQuestions(lesson);
}