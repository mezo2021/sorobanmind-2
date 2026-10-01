// src/curriculum/lessons/types.ts
// أنواع الدروس — تدعم:
//   • الدرس النظري (L0-INTRO): introPages · بلا وحدات
//   • الدرس التفاعلي L0: story على مستوى الدرس + وحدات m بلا miniStory
//   • الدرس التفاعلي L1+: وحدات m مع miniStory لكل وحدة

// ═══════════════════════════════════════════════════════════
// 🎯 التصنيفات
// ═══════════════════════════════════════════════════════════

/** تصنيف القاعدة داخل الوحدة */
export type RuleCategory =
  | "direct"         // بسيط
  | "small_friends"  // أصدقاء 5
  | "big_friends"    // أصدقاء 10
  | "combined"       // مركّب
  | "read"           // اقرأ
  | "build";         // مثّل

/** نوع خطوة التمييز */
export type DiscriminationStepType = "yes-no" | "value" | "comparison";

// ═══════════════════════════════════════════════════════════
// 📘 أساسي: النصوص ثنائية اللغة
// ═══════════════════════════════════════════════════════════

export interface BilingualText {
  ar: string;
  en: string;
}

// ═══════════════════════════════════════════════════════════
// 📘 للدرس النظري (L0-INTRO)
// ═══════════════════════════════════════════════════════════

/** صفحة تعريفية داخل Carousel */
export interface IntroPage {
  id: string;
  title: string;
  content: string;
  imageSvg?: string;
  imageAlt?: string;
}

/** نشاط حسي (Montessori-style) */
export interface TactileActivity {
  title: string;
  materials: string[];
  steps: string[];
  goal: string;
}

/** صف في جدول القاعدة */
export interface RuleTableRow {
  formula: string;
  result: string;
}

// ═══════════════════════════════════════════════════════════
// 🎬 القصة
// ═══════════════════════════════════════════════════════════

/**
 * مصدر صوت القصة:
 *   • number (0-9): ملف story-{n}.mp3
 *   • "welcome": ملف welcome-sorobana.mp3
 *   • null: بلا صوت
 */
export type StoryAudioSource = number | "welcome" | null;

/** قصة مصغّرة (تُستخدم في L1+ داخل كل وحدة) */
export interface MiniStoryBlock {
  title: string;
  emoji: string;
  story: string;
  storyAudioText: string;
  storyAudioId: StoryAudioSource;
}

/** قصة الدرس (تُستخدم في L0 على مستوى الدرس) */
export interface LessonStoryBlock {
  title: string;
  emoji: string;
  story: string;
  storyAudioText: string;
  storyAudioId: StoryAudioSource;
}

// ═══════════════════════════════════════════════════════════
// 📐 القاعدة والشرط
// ═══════════════════════════════════════════════════════════

export interface RuleBlock {
  /** الصيغة الرياضية (اختياري — مثل "+n = +5 − (5 − n)") */
  formula?: string;
  /** الشرح النصي المبسط */
  description: string;
}

export interface ConditionBlock {
  /** الصيغة الرياضية للشرط */
  formula: string;
  /** الشرح المبسط للطفل */
  explanation: string;
}

// ═══════════════════════════════════════════════════════════
// 🤝 جدول الأصدقاء
// ═══════════════════════════════════════════════════════════

export interface FriendsPair {
  from: number;
  to: number;
}

export interface FriendsTable {
  /** عنوان الجدول ("أصدقاء 5" · "أصدقاء 10") */
  title: string;
  /** الأزواج */
  pairs: FriendsPair[];
}

// ═══════════════════════════════════════════════════════════
// 🔍 دليل التمييز
// ═══════════════════════════════════════════════════════════

export interface DiscriminationStep {
  /** نص السؤال */
  question: string;
  /** نوع الإجابة (يوجّه الـ UI) */
  type: DiscriminationStepType;
  /** القيمة الفعلية للعرض (اختياري) */
  actual?: string | number;
  /** الإجابة */
  answer: string;
  /** تلميح تعليمي (اختياري) */
  hint?: string;
}

export interface DiscriminationBlock {
  /** خطوات التمييز */
  steps: DiscriminationStep[];
  /** القرار النهائي */
  decision: string;
}

// ═══════════════════════════════════════════════════════════
// 👁️ المثال المحلول (مرحلة E — "شاهد")
// ═══════════════════════════════════════════════════════════

export interface LessonExample {
  /** معرّف فريد */
  id: string;
  /** نص المسألة (مثل "2 + 2" أو "مثّل الرقم 5") */
  question: string;
  /** دليل التمييز — لماذا هذه القاعدة؟ */
  discrimination: string;
  /** القاعدة المطبقة (اختياري) */
  rule?: string;
  /** وصف حركة الأصابع */
  fingerMovement?: string;
  /** خطوات الحل */
  steps: string[];
  /** النتيجة */
  result: number;
  /** وصف بصري للخرزات (اختياري) */
  beadVisual?: string;
}

// ═══════════════════════════════════════════════════════════
// ✍️ التمرين (مرحلة T — "جرّب")
// ═══════════════════════════════════════════════════════════

export interface LessonExercise {
  /** معرّف فريد */
  id: string;
  /** نص المسألة */
  question: string;
  /** دليل التمييز */
  discrimination: string;
  /** خطوات الحل */
  steps: string[];
  /** النتيجة */
  result: number;
}

// ═══════════════════════════════════════════════════════════
// 🧩 الوحدة (m1 · m2 · m3 · m4)
// ═══════════════════════════════════════════════════════════

export interface LessonModule {
  /** معرّف الوحدة ("m1" مثلاً) */
  id: string;

  /** تصنيف القاعدة */
  ruleCategory: RuleCategory;

  /** العنوان العربي */
  title: string;

  /** العنوان الإنكليزي */
  titleEn: string;

  /** رمز تعبيري */
  emoji: string;

  /**
   * قصة مصغّرة (اختيارية).
   * تُستخدم في L1+ حيث لكل قاعدة قصة.
   * L0 يستخدم `LessonNode.story` على مستوى الدرس بدلًا منها.
   */
  miniStory?: MiniStoryBlock;

  /** القاعدة */
  rule: RuleBlock;

  /** شرط الاستخدام */
  condition: ConditionBlock;

  /** جدول الأصدقاء (اختياري — لـ m2 و m3 في الجمع/الطرح) */
  friendsTable?: FriendsTable;

  /** دليل التمييز */
  discrimination: DiscriminationBlock;

  /** مرحلة "شاهد" */
  watchPhase: {
    examples: LessonExample[];
  };

  /** مرحلة "جرّب" */
  tryPhase: {
    exercises: LessonExercise[];
  };
}

// ═══════════════════════════════════════════════════════════
// 🏁 الخاتمة
// ═══════════════════════════════════════════════════════════

export interface LessonOutro {
  /** ملخص شامل */
  summary: string;
  /** كلمة تشجيعية */
  encouragement: string;
  /** إجمالي الأمثلة */
  totalExamples: number;
}

// ═══════════════════════════════════════════════════════════
// 📚 الدرس الكامل (موحّد)
// ═══════════════════════════════════════════════════════════

export interface LessonNode {
  // ───── الهوية ─────
  /** معرّف الدرس ("L0-S01" · "S03"...) */
  id: string;
  /** معرّف المهارة في SRB ("S01" · "S03"...) أو null للدروس النظرية */
  skillId: string | null;
  /** معرّف المستوى ("L0" · "L1"...) */
  levelId: string;
  /** ترتيب الدرس داخل المستوى (1 · 2 · 3...) */
  order: number;

  // ───── العنوان ─────
  /** العنوان (يدعم الشكلين: نص ثنائي أو نص بسيط) */
  title: BilingualText | string;
  /** العنوان الإنكليزي (اختياري — إن كان title نصًا بسيطًا) */
  titleEn?: string;
  /** رمز تعبيري */
  emoji?: string;

  // ───── القصة (لـ L0) ─────
  /** 🎬 قصة الدرس (تُعرض في الأعلى — لـ L0) */
  story?: LessonStoryBlock;

  // ───── البنية القديمة (L0-INTRO) ─────
  concept?: BilingualText;
  rule?: BilingualText;
  ruleTable?: RuleTableRow[];
  examples?: LessonExample[];
  tryQuestions?: LessonExercise[];
  introPages?: IntroPage[];
  tactileActivity?: TactileActivity;
  /** هل الدرس نظري بحت (مقدمة)؟ */
  isTheoretical?: boolean;

  // ───── البنية التفاعلية (وحدات m) ─────
  /** الوحدات (m1 · m2 · m3 · m4) — للدروس التفاعلية */
  modules?: LessonModule[];
  /** الخاتمة */
  outro?: LessonOutro;
  /** التصنيفات */
  tags?: string[];

  // ───── مشترك ─────
  /** الوقت المتوقع بالدقائق */
  estimatedMinutes: number;
  /** XP المكافأة */
  xpReward: number;
}

// ═══════════════════════════════════════════════════════════
// 🔧 الدوال المساعدة
// ═══════════════════════════════════════════════════════════

/**
 * الحصول على مسار ملف الصوت.
 * - number: `.../stories/story-{n}.mp3`
 * - "welcome": `.../audio/welcome-sorobana.mp3`
 * - null: null
 */
export function getStoryAudioPath(
  source: StoryAudioSource,
): string | null {
  if (source === null) return null;
  const base = "https://mezo2021.github.io/sorobanmind-2";
  if (source === "welcome") return `${base}/audio/welcome-sorobana.mp3`;
  return `${base}/audio/stories/story-${source}.mp3`;
}

/** هل الدرس يحتوي وحدات؟ */
export function hasModules(lesson: LessonNode): boolean {
  return Array.isArray(lesson.modules) && lesson.modules.length > 0;
}

/** هل الدرس فيه أمثلة؟ */
export function hasExamples(lesson: LessonNode): boolean {
  if (hasModules(lesson)) {
    return lesson.modules!.some((m) => m.watchPhase.examples.length > 0);
  }
  return (lesson.examples?.length ?? 0) > 0;
}

/** هل الدرس فيه تمارين؟ */
export function hasTryQuestions(lesson: LessonNode): boolean {
  if (hasModules(lesson)) {
    return lesson.modules!.some((m) => m.tryPhase.exercises.length > 0);
  }
  return (lesson.tryQuestions?.length ?? 0) > 0;
}

/** هل الدرس نظري بحت (L0-INTRO)؟ */
export function isPureIntro(lesson: LessonNode): boolean {
  return (
    lesson.isTheoretical === true &&
    !hasExamples(lesson) &&
    !hasTryQuestions(lesson)
  );
}

/** عدد الأمثلة الكلي في الدرس */
export function countExamples(lesson: LessonNode): number {
  if (hasModules(lesson)) {
    return lesson.modules!.reduce(
      (s, m) => s + m.watchPhase.examples.length,
      0,
    );
  }
  return lesson.examples?.length ?? 0;
}

/** عدد التمارين الكلي في الدرس */
export function countExercises(lesson: LessonNode): number {
  if (hasModules(lesson)) {
    return lesson.modules!.reduce(
      (s, m) => s + m.tryPhase.exercises.length,
      0,
    );
  }
  return lesson.tryQuestions?.length ?? 0;
}

/** الحصول على وحدة حسب المعرّف */
export function getModule(
  lesson: LessonNode,
  moduleId: string,
): LessonModule | undefined {
  return lesson.modules?.find((m) => m.id === moduleId);
}