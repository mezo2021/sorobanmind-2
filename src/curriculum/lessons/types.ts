// src/curriculum/lessons/types.ts
//
// 📝 التعديل: إضافة flashSvg + storyFlashSvg + الحقول الثنائية *En
// 🎯 الوظيفة: دعم الصور المتحركة + الترجمة الكاملة
// 📅 الجلسة: 14
// ✅ الحالة: قيد الاختبار

// ═══════════════════════════════════════════════════════════
// 🎯 التصنيفات
// ═══════════════════════════════════════════════════════════

export type RuleCategory =
  | "direct" | "small_friends" | "big_friends" | "combined"
  | "read" | "build";

export type DiscriminationStepType = "yes-no" | "value" | "comparison";

// ═══════════════════════════════════════════════════════════
// 📘 أساسي
// ═══════════════════════════════════════════════════════════

export interface BilingualText {
  ar: string;
  en: string;
}

/**
 * نص يقبل الشكلين:
 *  - string (قديم — عربي فقط)
 *  - BilingualText (جديد — عربي + إنجليزي)
 */
export type LocalizableText = string | BilingualText;

export interface IntroPage {
  id: string;
  title: LocalizableText;
  content: LocalizableText;
  imageSvg?: string;
  imageAlt?: LocalizableText;
}

export interface TactileActivity {
  title: string;
  titleEn?: string;
  materials: string[];
  steps: string[];
  goal: string;
  goalEn?: string;
}

export interface RuleTableRow {
  formula: string;
  result: string;
}

// ═══════════════════════════════════════════════════════════
// 📘 الرموز القديمة (للتوافق)
// ═══════════════════════════════════════════════════════════

export type FingerUsed = "thumb" | "index" | "both_pinch" | "left_index";
export type Direction = "up" | "down" | "pinch_in" | "pinch_out";
export type TargetColumn = "units" | "tens" | "hundreds" | "thousands";

export interface LessonStep {
  stepIndex: number;
  instructionText: string;
  instructionTextEn?: string;
  fingerUsed: FingerUsed;
  direction: Direction;
  targetColumn: TargetColumn;
  beadsAffected: number[];
  expectedValueAfter: number;
}

export type TryQuestionType = "read" | "build";

// ═══════════════════════════════════════════════════════════
// 🎬 القصة
// ═══════════════════════════════════════════════════════════

export type StoryAudioSource = number | "welcome" | null;

export interface MiniStoryBlock {
  title: string;
  titleEn?: string;
  emoji: string;
  story: string;
  storyEn?: string;
  storyAudioText: string;
  storyAudioId: StoryAudioSource;
}

// ═══════════════════════════════════════════════════════════
// 📐 القاعدة والشرط
// ═══════════════════════════════════════════════════════════

export interface RuleCase {
  from: number;
  formula: string;
}

export interface RuleBlock {
  formula?: string;
  formulaEn?: string;
  description: string;
  descriptionEn?: string;
  cases?: RuleCase[];
}

export interface ConditionBlock {
  formula: string;
  formulaEn?: string;
  explanation: string;
  explanationEn?: string;
}

// ═══════════════════════════════════════════════════════════
// 🤝 جدول الأصدقاء
// ═══════════════════════════════════════════════════════════

export interface FriendsPair { from: number; to: number; }
export interface FriendsTable { title: string; titleEn?: string; pairs: FriendsPair[]; }

// ═══════════════════════════════════════════════════════════
// 🔍 دليل التمييز
// ═══════════════════════════════════════════════════════════

export interface DiscriminationStep {
  question: string;
  questionEn?: string;
  type: DiscriminationStepType;
  actual?: string | number;
  answer: string;
  answerEn?: string;
  hint?: string;
  hintEn?: string;
  options?: string[];
  optionsEn?: string[];
}

export interface DiscriminationBlock {
  steps: DiscriminationStep[];
  decision: string;
  decisionEn?: string;
}

// ═══════════════════════════════════════════════════════════
// 👁️ المثال — توافق مزدوج
// ═══════════════════════════════════════════════════════════

export interface LessonExample {
  id: string;

  // ─── قديم (L0 legacy) ───
  problemText?: string;
  problemTextEn?: string;
  answer?: number;
  explanation?: string;
  explanationEn?: string;
  ruleCategory?: RuleCategory;

  // ─── جديد (L1+) ───
  question?: string;
  questionEn?: string;
  discrimination?: string;
  discriminationEn?: string;
  rule?: string;
  ruleEn?: string;
  fingerMovement?: string;
  fingerMovementEn?: string;
  result?: number;
  beadVisual?: string;
  beadVisualEn?: string;

  // ─── مشترك — يقبل الشكلين ───
  steps: string[] | LessonStep[];
  stepsEn?: string[];
}

// ═══════════════════════════════════════════════════════════
// ✍️ التمرين — توافق مزدوج
// ═══════════════════════════════════════════════════════════

export interface LessonExercise {
  id: string;
  // جديد
  question?: string;
  questionEn?: string;
  discrimination?: string;
  discriminationEn?: string;
  result?: number;
  // قديم (توافق TryQuestion)
  type?: TryQuestionType;
  prompt?: string;
  promptEn?: string;
  expectedValue?: number;
  explanation?: string;
  explanationEn?: string;
  // مشترك
  steps?: string[] | LessonStep[];
  stepsEn?: string[];
}

/** اسم قديم للتوافق */
export type TryQuestion = LessonExercise;

// ═══════════════════════════════════════════════════════════
// 🧩 الوحدة
// ═══════════════════════════════════════════════════════════

export interface LessonModule {
  id: string;
  ruleCategory: RuleCategory;
  title: string;
  titleEn: string;
  emoji: string;

  // 🎬 صورة متحركة للوحدة
  flashSvg?: string;
  flashAlt?: LocalizableText;

  // 💡 نصيحة للطفل
  kidTip?: LocalizableText;

  miniStory?: MiniStoryBlock;
  rule: RuleBlock;
  condition: ConditionBlock;
  friendsTable?: FriendsTable;
  discrimination: DiscriminationBlock;
  watchPhase: { examples: LessonExample[] };
  tryPhase: { exercises: LessonExercise[] };
}

// ═══════════════════════════════════════════════════════════
// 🏁 الخاتمة
// ═══════════════════════════════════════════════════════════

export interface LessonOutro {
  summary: string;
  summaryEn?: string;
  encouragement: string;
  encouragementEn?: string;
  totalExamples: number;
}

// ═══════════════════════════════════════════════════════════
// 📚 الدرس الكامل
// ═══════════════════════════════════════════════════════════

export interface LessonNode {
  // ─── الهوية ───
  id: string;
  skillId: string | null;
  levelId: string;
  order: number;

  // ─── العنوان ───
  title: BilingualText;
  emoji?: string;

  // ─── القصة ───
  story?: BilingualText;
  storyAudioId?: StoryAudioSource;

  // 🎬 صورة متحركة للقصة
  storyFlashSvg?: string;
  storyFlashAlt?: LocalizableText;

  // ─── البنية القديمة ───
  concept?: BilingualText;
  rule?: BilingualText;
  ruleTable?: RuleTableRow[];
  examples?: LessonExample[];
  tryQuestions?: LessonExercise[];
  introPages?: IntroPage[];
  tactileActivity?: TactileActivity;
  isTheoretical?: boolean;

  // ─── البنية الجديدة (وحدات m) ───
  modules?: LessonModule[];
  outro?: LessonOutro;
  tags?: string[];

  // ─── مشترك ───
  estimatedMinutes: number;
  xpReward: number;
}

// ═══════════════════════════════════════════════════════════
// 🔧 الدوال المساعدة
// ═══════════════════════════════════════════════════════════

export function getStoryAudioPath(source: StoryAudioSource): string | null {
  if (source === null || source === undefined) return null;
  const base = "https://mezo2021.github.io/sorobanmind-2";
  if (source === "welcome") return `${base}/audio/welcome-sorobana.mp3`;
  return `${base}/audio/stories/story-${source}.mp3`;
}

export function hasModules(lesson: LessonNode): boolean {
  return Array.isArray(lesson.modules) && lesson.modules.length > 0;
}

export function hasExamples(lesson: LessonNode): boolean {
  if (hasModules(lesson)) {
    return lesson.modules!.some((m) => m.watchPhase.examples.length > 0);
  }
  return (lesson.examples?.length ?? 0) > 0;
}

export function hasTryQuestions(lesson: LessonNode): boolean {
  if (hasModules(lesson)) {
    return lesson.modules!.some((m) => m.tryPhase.exercises.length > 0);
  }
  return (lesson.tryQuestions?.length ?? 0) > 0;
}

export function isPureIntro(lesson: LessonNode): boolean {
  return lesson.isTheoretical === true && !hasExamples(lesson) && !hasTryQuestions(lesson);
}

export function countExamples(lesson: LessonNode): number {
  if (hasModules(lesson)) {
    return lesson.modules!.reduce((s, m) => s + m.watchPhase.examples.length, 0);
  }
  return lesson.examples?.length ?? 0;
}

export function countExercises(lesson: LessonNode): number {
  if (hasModules(lesson)) {
    return lesson.modules!.reduce((s, m) => s + m.tryPhase.exercises.length, 0);
  }
  return lesson.tryQuestions?.length ?? 0;
}

export function getModule(lesson: LessonNode, moduleId: string): LessonModule | undefined {
  return lesson.modules?.find((m) => m.id === moduleId);
}

/**
 * استخراج نص من قيمة محتملة الثنائية.
 */
export function resolveLocalized(
  value: LocalizableText | undefined,
  lang: "ar" | "en" = "ar",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return lang === "en" ? (value.en || value.ar) : value.ar;
}