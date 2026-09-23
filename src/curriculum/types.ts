// src/curriculum/types.ts

/**
 * نوع الحركة الحسابية المطلوبة على السوروبان.
 */
export type MovementType =
  | "direct"
  | "five-friend-add"
  | "five-friend-sub"
  | "ten-friend-add"
  | "ten-friend-sub"
  | "carry"
  | "borrow"
  | "mixed";

/**
 * نوع المسألة التي يمكن لمحرك التوليد إنتاجها.
 */
export type ProblemGeneratorType =
  | "numbers"
  | "build-soroban"
  | "read-soroban"
  | "add-subtract";

/**
 * مواصفات مولد المسائل.
 */
export interface ProblemGeneratorSpec {
  type: ProblemGeneratorType;
  constraints: ProblemGeneratorConstraints;
}

/**
 * القيود المستخدمة عند توليد المسائل.
 */
export interface ProblemGeneratorConstraints {
  min?: number;
  max?: number;
  digits?: number;
  movement?: MovementType;
  difficulty?: number;
  seed?: number;
  allowedMovements?: MovementType[];
  termsCount?: number;
}

/**
 * مثال محلول يوضح طريقة التفكير والحركة.
 */
export interface WorkedExample {
  operands: number[];
  operation: string;
  steps: string[];
  answer: number;
}

/**
 * خطأ شائع يقع فيه الطفل.
 */
export interface CommonMistake {
  wrongAnswer: string;
  whyWrong: string;
  correctMovement: string;
}

/**
 * معيار إتقان المهارة.
 */
export interface MasteryCriteria {
  minCorrect: number;
  accuracy: number;
  maxTimePerProblem: number;
  consecutiveCorrect: number;
}

/**
 * مهارة تعليمية كاملة داخل المنهج.
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  movementType: MovementType;
  mastery: MasteryCriteria;
  generator: ProblemGeneratorSpec;
  content: {
    goal: string;
    knowledge: string;
    rule: string;
    childExplanation: string;
    fingerMovement: string;
    examples: WorkedExample[];
    commonMistakes: CommonMistake[];
  };
}

/**
 * اختبار نهاية المستوى.
 */
export interface LevelExam {
  id: string;
  durationSec: number;
  problemsCount: number;
  passingScore: number;
  generator: ProblemGeneratorSpec;
}

/**
 * مستوى كامل في المنهج.
 */
export interface CurriculumLevel {
  id: string;
  number: number;
  name: string;
  arabicName: string;
  prerequisites: string[];
  skills: Skill[];
  exam: LevelExam;
  metadata: {
    estimatedHours: number;
    targetAge: [number, number];
    japanAlignment?: string;
    isBonus?: boolean;
  };
}

/**
 * مسألة يولدها المحرك.
 */
export interface Problem {
  operands: number[];
  operations: string[];
  movement: MovementType;
  expectedAnswer: number;
  difficulty: number;
  steps: SolveStep[];
}

/**
 * خطوة واحدة في حل المسألة على السوروبان.
 *
 * النصوص مترجمة عبر i18n: descriptionKey + descriptionParams.
 */
export interface SolveStep {
  rod: number;
  action:
    | "add-lower"
    | "sub-lower"
    | "add-upper"
    | "sub-upper"
    | "carry"
    | "borrow"
    | "read";
  count: number;
  rule: MovementType;
  descriptionKey: string;
  descriptionParams: Record<string, string | number>;
}

/**
 * حالة عمود واحد على السوروبان.
 */
export interface RodState {
  upper: 0 | 1;
  lower: 0 | 1 | 2 | 3 | 4;
}

/**
 * حالة السوروبان الكاملة.
 */
export type SorobanState = RodState[];

/**
 * سجل تقدم الطفل في مهارة محددة.
 */
export interface SkillProgress {
  skillId: string;
  attempts: number;
  correct: number;
  consecutiveCorrect: number;
  avgTimeMs: number;
  masteredAt?: string;
}

/**
 * محاولة واحدة من الطفل.
 */
export interface Attempt {
  skillId: string;
  correct: boolean;
  timeMs: number;
  timestamp: number;
}

/**
 * نتيجة اختبار مستوى.
 */
export interface ExamResult {
  examId: string;
  problemsCount: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  completedAt: string;
}

export type SkillId = string;