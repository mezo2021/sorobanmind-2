// src/curriculum/lessons/types.ts

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

export interface IntroPage {
  id: string;
  title: string;
  content: string;
  imageSvg?: string;
  imageAlt?: string;
}

export interface TactileActivity {
  title: string;
  materials: string[];
  steps: string[];
  goal: string;
}

export interface RuleTableRow {
  formula: string;
  result: string;
}

// ═══════════════════════════════════════════════════════════
// 📘 الرموز القديمة (للتوافق مع intro.ts و LessonScreen القديمة)
// ═══════════════════════════════════════════════════════════

export type FingerUsed = "thumb" | "index" | "both_pinch" | "left_index";
export type Direction = "up" | "down" | "pinch_in" | "pinch_out";
export type TargetColumn = "units" | "tens" | "hundreds" | "thousands";

export interface LessonStep {
  stepIndex: number;
  instructionText: string;
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
  emoji: string;
  story: string;
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
  description: string;
  cases?: RuleCase[];
}

export interface ConditionBlock {
  formula: string;
  explanation: string;
}

// ═══════════════════════════════════════════════════════════
// 🤝 جدول الأصدقاء
// ═══════════════════════════════════════════════════════════

export interface FriendsPair { from: number; to: number; }
export interface FriendsTable { title: string; pairs: FriendsPair[]; }

// ═══════════════════════════════════════════════════════════
// 🔍 دليل التمييز
// ═══════════════════════════════════════════════════════════

export interface DiscriminationStep {
  question: string;
  type: DiscriminationStepType;
  actual?: string | number;
  answer: string;
  hint?: string;
}

export interface DiscriminationBlock {
  steps: DiscriminationStep[];
  decision: string;
}

// ═══════════════════════════════════════════════════════════
// 👁️ المثال — توافق مزدوج
// ═══════════════════════════════════════════════════════════

export interface LessonExample {
  id: string;

  // ─── قديم (L0 legacy) ───
  problemText?: string;
  answer?: number;
  explanation?: string;
  ruleCategory?: RuleCategory;

  // ─── جديد (L1+) ───
  question?: string;
  discrimination?: string;
  rule?: string;
  fingerMovement?: string;
  result?: number;
  beadVisual?: string;

  // ─── مشترك — يقبل الشكلين ───
  steps: string[] | LessonStep[];
}

// ═══════════════════════════════════════════════════════════
// ✍️ التمرين — توافق مزدوج
// ═══════════════════════════════════════════════════════════

export interface LessonExercise {
  id: string;
  // جديد
  question?: string;
  discrimination?: string;
  result?: number;
  // قديم (توافق TryQuestion)
  type?: TryQuestionType;
  prompt?: string;
  expectedValue?: number;
  explanation?: string;
  // مشترك
  steps?: string[] | LessonStep[];
}

/** اسم قديم للتوافق مع الاستيرادات الحالية */
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
  miniStory?: MiniStoryBlock;  // ← optional (L0 لا يستخدمه)
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
  encouragement: string;
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
  title: BilingualText;  // ← دائمًا {ar, en}
  emoji?: string;

  // ─── القصة (L0 — الشكل القديم) ───
  story?: BilingualText;
  storyAudioId?: StoryAudioSource;

  // ─── البنية القديمة (L0-INTRO) ───
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