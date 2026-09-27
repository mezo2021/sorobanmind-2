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
export type TryQuestionType = 'read' | 'build';

// ═══════════════════════════════════════════════════════════
// الخطوات التفاعلية
// ═══════════════════════════════════════════════════════════

export interface LessonStep {
  /** رقم الخطوة (يبدأ من 1) */
  stepIndex: number;
  /** النص الإرشادي */
  instructionText: string;
  /** الإصبع */
  fingerUsed: FingerUsed;
  /** الاتجاه */
  direction: Direction;
  /** العمود */
  targetColumn: TargetColumn;
  /** الخرزات المتأثرة */
  beadsAffected: number[];
  /** القيمة بعد الخطوة */
  expectedValueAfter: number;
}

// ═══════════════════════════════════════════════════════════
// المثال المحلول (يظهر في تاب "شاهد")
// ═══════════════════════════════════════════════════════════

export interface LessonExample {
  /** معرف فريد */
  id: string;
  /** نص المسألة */
  problemText: string;
  /** الإجابة */
  answer: number;
  /** تصنيف القاعدة */
  ruleCategory: RuleCategory;
  /** الخطوات التفاعلية */
  steps: LessonStep[];
  /** الشرح المبسط */
  explanation: string;
}

// ═══════════════════════════════════════════════════════════
// سؤال "جرّب"
// ═══════════════════════════════════════════════════════════

export interface TryQuestion {
  /** معرف فريد */
  id: string;
  /** النوع: اقرأ / مثّل */
  type: TryQuestionType;
  /** نص السؤال */
  prompt: string;
  /** القيمة الصحيحة */
  expectedValue: number;
  /** خطوات الحل (تُعرض بعد محاولتين خاطئتين) */
  steps?: LessonStep[];
  /** شرح مساعد */
  explanation?: string;
}

// ═══════════════════════════════════════════════════════════
// صفحة المقدمة (للدرسي النظري فقط)
// ═══════════════════════════════════════════════════════════

export interface IntroPage {
  /** معرف فريد */
  id: string;
  /** عنوان الصفحة */
  title: string;
  /** المحتوى النصي */
  content: string;
  /** SVG اختياري */
  imageSvg?: string;
  /** وصف الصورة */
  imageAlt?: string;
}

// ═══════════════════════════════════════════════════════════
// النشاط الحسي (Montessori-style)
// ═══════════════════════════════════════════════════════════

export interface TactileActivity {
  /** العنوان */
  title: string;
  /** المواد المطلوبة */
  materials: string[];
  /** الخطوات */
  steps: string[];
  /** الهدف */
  goal: string;
}

// ═══════════════════════════════════════════════════════════
// جدول القاعدة
// ═══════════════════════════════════════════════════════════

export interface RuleTableRow {
  /** الصيغة */
  formula: string;
  /** النتيجة */
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
  // ───── الهوية ─────
  /** معرّف فريد (مثل: "L0-intro" أو "L0-S1") */
  id: string;
  /** معرّف المهارة (S1, S2...) أو null للدروس النظرية */
  skillId: string | null;
  /** معرّف المستوى (L0, L1...) */
  levelId: string;
  /** ترتيب الدرس داخل المستوى (1, 2, 3...) */
  order: number;

  // ───── العنوان ─────
  title: BilingualText;

  // ───── القصة ─────
  story: BilingualText;
  /** معرّف ملف MP3: story-{id}.mp3 — null إن لم يوجد */
  storyAudioId: number | null;

  // ───── المفهوم والقاعدة ─────
  concept: BilingualText;
  rule?: BilingualText;
  ruleTable?: RuleTableRow[];

  // ───── المحتوى التفاعلي ─────
  /** أمثلة محلولة (تعرض في "شاهد") */
  examples: LessonExample[];
  /** أسئلة (تعرض في "جرّب") */
  tryQuestions: TryQuestion[];

  // ───── إضافات ─────
  /** النشاط الحسي (اختياري) */
  tactileActivity?: TactileActivity;
  /** صفحات المقدمة (للدرس النظري فقط) */
  introPages?: IntroPage[];

  // ───── معلومات ─────
  /** الوقت المتوقع بالدقائق */
  estimatedMinutes: number;
  /** XP المكافأة */
  xpReward: number;
  /** هل الدرس نظري (بلا مهارة)؟ */
  isTheoretical?: boolean;
}

// ═══════════════════════════════════════════════════════════
// الدوال المساعدة
// ═══════════════════════════════════════════════════════════

/** الحصول على اسم ملف القصة */
export function getStoryAudioPath(storyAudioId: number | null): string | null {
  if (storyAudioId === null) return null;
  return `https://mezo2021.github.io/sorobanmind-2/audio/stories/story-${storyAudioId}.mp3`;
}

/** هل الدرس له أمثلة؟ */
export function hasExamples(lesson: LessonNode): boolean {
  return lesson.examples.length > 0;
}

/** هل الدرس له أسئلة جرّب؟ */
export function hasTryQuestions(lesson: LessonNode): boolean {
  return lesson.tryQuestions.length > 0;
}

/** هل الدرس نظري بحت (مقدمة)؟ */
export function isPureIntro(lesson: LessonNode): boolean {
  return lesson.isTheoretical === true && !hasExamples(lesson) && !hasTryQuestions(lesson);
}