// src/types.ts
// v1 types — يُبنى عليه المنهج الجديد (L0-L7)

// ------------------------------------------------------------
// الأدوار والشاشات
// ------------------------------------------------------------
export type Role = 'hero' | 'guardian' | null;

export type Screen =
  // الشاشات الأساسية
  | 'role'
  | 'welcome'
  | 'hero-dashboard'
  | 'guardian-dashboard'
  // الأقسام
  | 'category-kids'
  | 'category-teens'
  // المستويات (L0-L7)
  | 'lesson-L0'
  | 'lesson-L1'
  | 'lesson-L2'
  | 'lesson-L3'
  | 'lesson-L4'
  | 'lesson-L5'
  | 'lesson-L6'
  | 'lesson-L7'
  // المسارات
  | 'practice-0'
  | 'practice-1'
  | 'practice-2'
  | 'practice-3'
  | 'practice-4'
  | 'practice-5'
  | 'practice-6'
  | 'practice-7'
  | 'anzan-0'
  | 'anzan-1'
  | 'anzan-2'
  | 'anzan-3'
  | 'anzan-4'
  | 'anzan-5'
  | 'anzan-6'
  | 'anzan-7'
  | 'audio-anzan-0'
  | 'audio-anzan-1'
  | 'audio-anzan-2'
  | 'audio-anzan-3'
  | 'audio-anzan-4'
  | 'audio-anzan-5'
 و| 'audio-anzan-6'
| 'audio-anzan-7'
  // الامتحانات
  | 'placement-test'
  | 'category-exam-1'
  | 'category-exam-2'
  | 'certificate'
  // الإثراء
  | 'enrichment-1'
  | 'enrichment-2'
  // شاشات قديمة (للتوافق المؤقت)
  | 'learn'
  | 'practice'
  | 'anzan'
  | 'quests'
  | 'soroban'
  | 'multiplication'
  | 'secrets'
  | 'cross-multiplication'
  | 'division'
  | 'final-exam';

// ------------------------------------------------------------
// الفئات والمستويات
// ------------------------------------------------------------
export type CategoryId = 'kids' | 'teens';

export type LevelId =
  | 'L0' | 'L1' | 'L2' | 'L3'
  | 'L4' | 'L5' | 'L6' | 'L7';

export interface CategoryInfo {
  id: CategoryId;
  titleAr: string;
  titleEn: string;
  ageRange: string;
  description: string;
  gradient: string;
  icon: string;
  levels: LevelId[];
  screen: Screen;
  examScreen: Screen;
  enrichmentScreen: Screen;
  enrichmentTitle: string;
  enrichmentItems: string[];
}

export interface LevelCard {
  id: LevelId;
  number: number;
  titleAr: string;
  titleEn: string;
  description: string;
  icon: string;
  gradient: string;
  category: CategoryId;
}

// ------------------------------------------------------------
// الشخصيات
// ------------------------------------------------------------
export type CharacterType = 'sham' | 'rayan' | 'bana' | 'joud';

export type AvatarId = CharacterType;

export const CHARACTER_STORAGE_KEY = 'soroban_companion';

export const VALID_CHARACTERS: CharacterType[] = [
  'sham',
  'rayan',
  'bana',
  'joud',
];

export const LEGACY_CHARACTER_MAP: Partial<Record<string, CharacterType>> = {
  fox: 'sham',
  owl: 'bana',
  rabbit: 'rayan',
  panda: 'joud',
  aya: 'joud',
};

export interface CharacterInfo {
  id: CharacterType;
  name: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  accentColor: string;
}

// ------------------------------------------------------------
// حالة التعلّم
// ------------------------------------------------------------
export type LearnModuleStatus = 'locked' | 'available' | 'completed';

export type FingerType = 'thumb' | 'index' | 'both_pinch' | 'left_index';

export type MovementDirection = 'up' | 'down' | 'pinch_in' | 'pinch_out';

export type ColumnType = 'units' | 'tens' | 'hundreds' | 'thousands';

export type RuleCategory =
  | 'direct'
  | 'small_friends'
  | 'big_friends'
  | 'combined'
  | 'anzan'
  | 'chain';

// ------------------------------------------------------------
// خطوات الدروس
// ------------------------------------------------------------
export interface LessonStep {
  stepIndex: number;
  instructionText: string;
  fingerUsed: FingerType;
  direction: MovementDirection;
  targetColumn: ColumnType;
  beadsAffected: number[];
  expectedValueAfter: number;
}

export interface DivisionStep {
  stepIndex: number;
  instructionText: string;
  fingerUsed: FingerType;
  direction: MovementDirection;
  targetColumn: ColumnType;
  beadsAffected: number[];
  expectedAbacusState: number[];
}

// ------------------------------------------------------------
// أمثلة الدروس
// ------------------------------------------------------------
export interface LessonExample {
  problemText: string;
  answer: number;
  ruleCategory: RuleCategory;
  steps: LessonStep[];
  explanation: string;
  story?: string;
  storyAudioText?: string;
}

export interface DivisionExample {
  problemText: string;
  answer: number;
  ruleCategory: RuleCategory;
  steps: DivisionStep[];
  explanation: string;
  story?: string;
  storyAudioText?: string;
}

// ------------------------------------------------------------
// نظام القواعد والجداول
// ------------------------------------------------------------
export interface SubRule {
  id: string;
  formula: string;
  formulaAr: string;
  story: string;
  storyAudioText?: string;
}

export interface TableColumn {
  operations: ChainOperation[];
  answer: number;
}

export interface RuleTable {
  id: string;
  titleAr: string;
  rule: string;
  columns: TableColumn[];
}

export interface TactileActivity {
  titleAr: string;
  materials: string[];
  steps: string[];
  goal: string;
}

// ------------------------------------------------------------
// وحدات التعلّم
// ------------------------------------------------------------
export type InteractionMode = 'number-input' | 'abacus-representation';

export interface LearnModule {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  status: LearnModuleStatus;
  beads: { upper: number; lower: number };
  value: number;
  concept: string;
  conceptAr: string;
  icon: string;
  audioText: string;
  rule: string;
  ruleAr: string;
  ruleTable?: { formula: string; result: string }[];
  story: string;
  storyAudioText?: string;
  examples: (LessonExample | DivisionExample)[];
  subRules?: SubRule[];
  tables?: RuleTable[];
  tactileActivity?: TactileActivity;
  targetAge?: string;
  requiresAllPrevious?: boolean;
  interactionMode?: InteractionMode;
  maxAttempts?: number;
}

// ------------------------------------------------------------
// المستويات
// ------------------------------------------------------------
export interface LevelNode {
  id: number;
  name: string;
  nameAr: string;
  status: LearnModuleStatus;
  icon: string;
  xpRequired: number;
}

// ------------------------------------------------------------
// نظام التقدم (موسّع للمنهج الجديد)
// ------------------------------------------------------------
export interface UserProgress {
  /** المستويات المفتوحة (L0-L7) */
  unlockedLevels: LevelId[];
  /** المستويات المُنجزة */
  completedLevels: LevelId[];
  /** تمرّن الذي نجح فيه (0-7) */
  passedPractice: number[];
  /** أنزان بصري الذي نجح فيه (0-7) */
  passedAnzanVisual: number[];
  /** أنزان سمعي الذي نجح فيه (0-7) */
  passedAnzanAudio: number[];
  /** هل نجح في امتحان القسم 1؟ */
  categoryExam1Passed: boolean;
  /** هل نجح في امتحان القسم 2؟ */
  categoryExam2Passed: boolean;
  /** آخر محاولة للـ Placement Test (timestamp) */
  lastPlacementAttempt: number | null;
  /** عدد محاولات Placement Test */
  placementAttempts: number;
}

export interface StudentProgress {
  levelId: number;
  correctAnswers: number;
  totalAttempts: number;
  score: number;
  passed: boolean;
  attemptsAllowed: number;
  attemptsUsed: number;
  lastUpdated: number;
}

export interface LevelUnlockRules {
  PASS_THRESHOLD: number;
  MIN_CORRECT: number;
  MAX_ATTEMPTS: number;
}

export const LEVEL_RULES: LevelUnlockRules = {
  PASS_THRESHOLD: 75,
  MIN_CORRECT: 15,
  MAX_ATTEMPTS: 5,
};

// ------------------------------------------------------------
// عتبات النجاح (المنهج الجديد)
// ------------------------------------------------------------
export const PASS_THRESHOLDS = {
  /** تمرّن: 75% */
  PRACTICE: 75,
  /** أنزان بصري: 75% */
  ANZAN_VISUAL: 75,
  /** أنزان سمعي: 75% */
  ANZAN_AUDIO: 75,
  /** امتحان القسم 1: 80% */
  CATEGORY_EXAM_1: 80,
  /** امتحان القسم 2: 80% */
  CATEGORY_EXAM_2: 80,
  /** Placement Test للانتقال للقسم 2: 80% */
  PLACEMENT_TO_TEENS: 80,
  /** Placement Test للبدء من L0: 60% */
  PLACEMENT_TO_KIDS: 60,
} as const;

/** مدة الانتظار قبل إعادة Placement Test (بالمللي ثانية) — 48 ساعة */
export const PLACEMENT_COOLDOWN_MS = 48 * 60 * 60 * 1000;

// ------------------------------------------------------------
// المهام (Quests)
// ------------------------------------------------------------
export type QuestType =
  | 'practice'
  | 'anzan'
  | 'anzanHighScore'
  | 'streak'
  | 'lessons'
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'chain';

export interface Quest {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  xpReward: number;
  progress: number;
  target: number;
  icon: string;
  color: string;
  type: QuestType;
}

// ------------------------------------------------------------
// أسئلة التدريب
// ------------------------------------------------------------
export interface PracticeQuestion {
  question: string;
  answer: number;
  explanation: string;
  type?: RuleCategory;
  steps?: LessonStep[];
  lessonId?: number;
}

// ------------------------------------------------------------
// السلاسل الطويلة
// ------------------------------------------------------------
export interface ChainOperation {
  value: number;
  operator: '+' | '-' | '×' | '÷';
}

export interface ChainExercise {
  id: string;
  operations: ChainOperation[];
  answer: number;
  rows: number;
  digits: 1 | 2 | 3;
  groupAr: string;
  lessonId: number;
  difficulty: number;
}

// ------------------------------------------------------------
// إعدادات الأنزان
// ------------------------------------------------------------
export interface AnzanLevelRules {
  lessonId: number;
  key: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'master';
  operationsCount: number;
  allowSubtract: boolean;
  multiDigit: boolean;
  dominantRule: RuleCategory;
  maxValue: number;
  labelAr: string;
}

// ------------------------------------------------------------
// الشارات والإحصائيات
// ------------------------------------------------------------
export interface Badge {
  id: string;
  nameAr: string;
  xpRequired: number;
  icon: string;
}

export interface GameStats {
  xp: number;
  streak: number;
  level: number;
  soundEnabled: boolean;
  earnedBadges: string[];
}

export interface ProgressData {
  totalProblems: number;
  correctAnswers: number;
  averageSpeed: number;
  lessonsCompleted: number;
  anzanHighScore: number;
  weeklyXP: { day: string; xp: number }[];
}

export type LessonProgress = Record<number, number[]>;