// src/data/bank-linked.ts
// يربط bank.ts (500 برمجي) + bank-raw/ (200 من الكتاب) = 700 سؤال

import { SOROBAN_BANK as PROGRAMMATIC_BANK } from "./bank";
import { adaptAllRawQuestions } from "./bank-adapter";
import type { BankQuestion } from "./bank";

// ═══════════════════════════════════════════════════════════
// إعادة تصدير الأنواع والدوال المساعدة من bank.ts
// ═══════════════════════════════════════════════════════════
export type {
  BankQuestion,
  BankOperation,
  Difficulty,
  PlaceValue,
  SorobanRule,
  QuestionEvaluation,
} from "./bank";

export {
  bankQuestionToProblem,
  evaluateBankAnswer,
} from "./bank";

// ═══════════════════════════════════════════════════════════
// الأسئلة الحقيقية من الكتاب (200 سؤال مصنّف)
// ═══════════════════════════════════════════════════════════
const RAW_BANK: BankQuestion[] = adaptAllRawQuestions();

// ═══════════════════════════════════════════════════════════
// البنك الكامل — الأولوية للأسئلة الحقيقية
// ═══════════════════════════════════════════════════════════
export const SOROBAN_BANK: readonly BankQuestion[] = Object.freeze([
  ...RAW_BANK,
  ...PROGRAMMATIC_BANK,
]);

export const BANK_SIZE = SOROBAN_BANK.length;

// ═══════════════════════════════════════════════════════════
// Getters تعمل على البنك الكامل
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