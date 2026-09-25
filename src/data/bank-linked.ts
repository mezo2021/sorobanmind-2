// src/data/bank-linked.ts
// البنك الموحّد — يجمع bank-v2 + bank-raw المحوَّل
// يوفّر طبقة توافق مع المحرك القديم

import {
  SOROBAN_BANK_V2,
  type BankQuestion as BankQuestionV2,
  type BankOperation as BankOperationV2,
} from "./bank-v2";
import { adaptAllRawQuestions } from "./bank-adapter";
import type { Problem, MovementType } from "../curriculum/types";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export type BankOperation = BankOperationV2;
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type PlaceValue =
  | "units"
  | "tens"
  | "hundreds"
  | "thousands"
  | "decimal";

export interface SorobanRule {
  id: string;
  name: string;
  description: string;
  movement: MovementType;
  skillId: string;
}

export interface BankQuestion {
  id: string;
  levelId: string;
  skillId: string;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  expectedTimeMs: number;
  maxTimeMs: number;
  explanation?: string;
  tags?: string[];

  // حقول توافقية
  ruleId: string;
  category: string;
  levelOrder: number;
  digits: number;
  placeValues: PlaceValue[];
  hasCarry: boolean;
  hasBorrow: boolean;
  movementExplanation: string;
  prerequisites: string[];
  sourceId?: string;
}

export interface QuestionEvaluation {
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeMs: number;
  tooSlow: boolean;
  timeout: boolean;
  speedRatio: number;
  issue: "none" | "wrong-answer" | "slow" | "timeout" | "wrong-and-slow";
}

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

function getDigits(value: number): number {
  const abs = Math.abs(Math.trunc(value));
  if (abs === 0) return 1;
  return String(abs).length;
}

function getPlaceValues(operands: number[], answer: number): PlaceValue[] {
  const values = [...operands, answer];
  const maxDigits = Math.max(...values.map(getDigits));
  if (maxDigits >= 4) return ["units", "tens", "hundreds", "thousands"];
  if (maxDigits === 3) return ["units", "tens", "hundreds"];
  if (maxDigits === 2) return ["units", "tens"];
  return ["units"];
}

function hasAdditionCarry(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 + Math.floor(b / d) % 10 >= 10) return true;
  }
  return false;
}

function hasSubtractionBorrow(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 < Math.floor(b / d) % 10) return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════
// تحويل bank-v2 → BankQuestion الموحّد
// ═══════════════════════════════════════════════════════════

function toUnified(q: BankQuestionV2, order: number): BankQuestion {
  const positiveOperands = q.operands.filter((n: number) => n >= 0);
  const negativeOperands = q.operands.filter((n: number) => n < 0);

  return {
    id: q.id,
    levelId: q.levelId,
    skillId: q.skillId,
    prompt: q.prompt,
    operands: q.operands,
    operation: q.operation,
    correctAnswer: q.correctAnswer,
    movement: q.movement,
    difficulty: q.difficulty,
    // ✅ استخدام q.timing بدلاً من الحقول المسطحة
    expectedTimeMs: q.timing.answerMs,
    maxTimeMs: q.timing.maxMs,
    explanation: q.explanation,
    tags: q.tags,

    // حقول مُشتقة
    ruleId: q.skillId,
    category: q.levelId,
    levelOrder: order,
    digits: getDigits(q.correctAnswer),
    placeValues: getPlaceValues(q.operands, q.correctAnswer),
    hasCarry:
      q.operation === "addition" && positiveOperands.length >= 2
        ? hasAdditionCarry(positiveOperands[0] || 0, positiveOperands[1] || 0)
        : false,
    hasBorrow:
      q.operation === "subtraction" && negativeOperands.length > 0
        ? hasSubtractionBorrow(
            positiveOperands[0] || 0,
            Math.abs(negativeOperands[0]) || 0,
          )
        : false,
    movementExplanation: "",
    prerequisites: [],
    sourceId: q.id,
  };
}

// ═══════════════════════════════════════════════════════════
// البنك الموحّد
// ═══════════════════════════════════════════════════════════

const V2_UNIFIED: BankQuestion[] = SOROBAN_BANK_V2.map((q, i) =>
  toUnified(q, i + 1),
);

const RAW_UNIFIED: BankQuestion[] =
  adaptAllRawQuestions() as unknown as BankQuestion[];

export const SOROBAN_BANK: readonly BankQuestion[] = Object.freeze([
  ...V2_UNIFIED,
  ...RAW_UNIFIED,
]);

export const BANK_SIZE = SOROBAN_BANK.length;

export const BANK_STATS = {
  v2: V2_UNIFIED.length,
  raw: RAW_UNIFIED.length,
  total: SOROBAN_BANK.length,
} as const;

// ═══════════════════════════════════════════════════════════
// دوال الاستعلام
// ═══════════════════════════════════════════════════════════

export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK.find((q) => q.id === id);
}

export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.levelId === levelId);
}

export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.skillId === skillId);
}

export function getQuestionsByRule(ruleId: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.ruleId === ruleId);
}

export function getQuestionsByMovement(movement: string): BankQuestion[] {
  return SOROBAN_BANK.filter((q) => q.movement === movement);
}

export function getQuestionsByLevelSkill(
  levelId: string,
  skillId: string,
): BankQuestion[] {
  return SOROBAN_BANK.filter(
    (q) => q.levelId === levelId && q.skillId === skillId,
  );
}

// ═══════════════════════════════════════════════════════════
// تحويل BankQuestion → Problem
// ═══════════════════════════════════════════════════════════

export function bankQuestionToProblem(question: BankQuestion): Problem {
  const operation =
    question.operation === "addition"
      ? "+"
      : question.operation === "subtraction"
        ? "-"
        : question.operation === "multiplication"
          ? "×"
          : question.operation === "division"
            ? "÷"
            : question.operation === "read"
              ? "read"
              : "build";

  return {
    operands: question.operands,
    operation: operation as Problem["operation"],
    movement: question.movement,
    expectedAnswer: question.correctAnswer,
    difficulty: question.difficulty,
    skillId: question.skillId,
    ruleId: question.ruleId,
    question: question.prompt,
    explanation: question.explanation,
    targetTimeMs: question.expectedTimeMs,
    source: question.sourceId,
  };
}

// ═══════════════════════════════════════════════════════════
// تقييم الإجابة
// ═══════════════════════════════════════════════════════════

export function evaluateBankAnswer(
  question: BankQuestion,
  userAnswer: number,
  timeMs: number,
): QuestionEvaluation {
  const correct = userAnswer === question.correctAnswer;
  const safeTime = Math.max(0, timeMs);
  const tooSlow = safeTime > question.expectedTimeMs;
  const timeout = safeTime > question.maxTimeMs;
  const speedRatio =
    question.expectedTimeMs === 0
      ? 1
      : Math.min(2, safeTime / question.expectedTimeMs);

  let issue: QuestionEvaluation["issue"];
  if (correct && timeout) issue = "timeout";
  else if (!correct && timeout) issue = "wrong-and-slow";
  else if (!correct) issue = "wrong-answer";
  else if (tooSlow) issue = "slow";
  else issue = "none";

  return {
    correct,
    userAnswer,
    correctAnswer: question.correctAnswer,
    timeMs: safeTime,
    tooSlow,
    timeout,
    speedRatio,
    issue,
  };
}

// ═══════════════════════════════════════════════════════════
// الفلترة
// ═══════════════════════════════════════════════════════════

export interface BankFilter {
  levelIds?: string[];
  skillIds?: string[];
  ruleIds?: string[];
  movements?: string[];
  difficulties?: number[];
  excludeIds?: string[];
}

export function filterBank(filter: BankFilter): BankQuestion[] {
  let result: BankQuestion[] = [...SOROBAN_BANK];

  if (filter.levelIds?.length) {
    const set = new Set(filter.levelIds);
    result = result.filter((q) => set.has(q.levelId));
  }
  if (filter.skillIds?.length) {
    const set = new Set(filter.skillIds);
    result = result.filter((q) => set.has(q.skillId));
  }
  if (filter.ruleIds?.length) {
    const set = new Set(filter.ruleIds);
    result = result.filter((q) => set.has(q.ruleId));
  }
  if (filter.movements?.length) {
    const set = new Set(filter.movements);
    result = result.filter((q) => set.has(q.movement));
  }
  if (filter.difficulties?.length) {
    const set = new Set(filter.difficulties);
    result = result.filter((q) => set.has(q.difficulty));
  }
  if (filter.excludeIds?.length) {
    const set = new Set(filter.excludeIds);
    result = result.filter((q) => !set.has(q.id));
  }

  return result;
}

export function sampleFromBank(
  filter: BankFilter,
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const pool = filterBank(filter);
  if (pool.length === 0) return [];

  let value = seed >>> 0;
  const rng = (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ═══════════════════════════════════════════════════════════
// دوال مساعدة للشاشات
// ═══════════════════════════════════════════════════════════

export function getSkillsForPracticeNum(num: number): string[] {
  const map: Record<number, string[]> = {
    0: ["S1", "S2"],
    1: ["S3", "S4", "S5", "S6", "S7", "S8", "S9"],
    2: ["S10", "S11", "S12"],
    3: ["S13", "S14", "S15"],
    4: ["S16"],
    5: ["S17"],
    6: ["S18"],
    7: ["S19", "S20"],
  };
  return map[num] ?? [];
}

export function getPracticeQuestions(
  num: number,
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const skills = getSkillsForPracticeNum(num);
  if (skills.length === 0) return [];
  return sampleFromBank({ skillIds: skills }, count, seed);
}

export function getCategoryExamQuestions(
  category: "category-1" | "category-2",
  count: number,
  seed = Date.now(),
): BankQuestion[] {
  const filter: BankFilter =
    category === "category-1"
      ? { levelIds: ["L0", "L1", "L2", "L3"] }
      : { levelIds: ["L4", "L5", "L6", "L7"] };

  return sampleFromBank(filter, count, seed);
}