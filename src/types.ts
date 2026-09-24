// src/types.ts
// v1 types — منفصل تماماً عن curriculum/types.ts (v2)

// ------------------------------------------------------------
// الأدوار والشاشات
// ------------------------------------------------------------
export type Role = 'hero' | 'guardian' | null;

export type Screen =
  | 'role'
  | 'hero-dashboard'
  | 'learn'
  | 'practice'
  | 'anzan'
  | 'quests'
  | 'soroban'
  | 'multiplication'
  | 'secrets'
  | 'cross-multiplication'
  | 'division'
  | 'certificate'
  | 'guardian-dashboard'
  | 'final-exam'
  | 'welcome';

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
// نظام التقدم
// ------------------------------------------------------------
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
  operator: '+' | '-';
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