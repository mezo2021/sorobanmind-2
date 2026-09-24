// src/data/bank-adapter.ts
// يحوّل الأسئلة الخام (200 + 200 متقدمة) إلى BankQuestion
// للاستخدام في التعليم التكيفي
//
// ⚠️ يعتمد على bank-raw/types.ts الذي يجب أن يحتوي على:
//    SECTIONS.S1 ... SECTIONS.S17

import type {
  BankQuestion,
  BankOperation,
  Difficulty,
} from "./bank";
import type { MovementType } from "../curriculum/types";
import {
  RAW_QUESTIONS,
  SECTIONS,
  isAdvancedSection,
  extractSolutionText,
  type RawQuestion,
  type SectionId,
} from "./bank-raw";

// ═══════════════════════════════════════════════════════════
// خريطة القسم → المستوى (بعد التصحيح)
// ═══════════════════════════════════════════════════════════
//
// التصحيحات:
//   S2 كان L06 → الصحيح L04 (أصدقاء 5)
//   S3 كان L08 → الصحيح L06 (أصدقاء 10)
//   S7 كان L13 → الصحيح L20 (السالبة)
//   S9 كان L18 → الصحيح L18 (ميتوري متقدم)
//   S10 كان L19 → الصحيح L19 (منافسات)

const SECTION_TO_LEVEL: Record<SectionId, string> = {
  // ─── الأقسام الأصلية ───
  [SECTIONS.S1]: "L03",   // جمع/طرح بسيط
  [SECTIONS.S2]: "L04",   // أصدقاء 5
  [SECTIONS.S3]: "L06",   // أصدقاء 10
  [SECTIONS.S4]: "L10",   // قواعد مركبة
  [SECTIONS.S5]: "L15",   // الضرب
  [SECTIONS.S6]: "L16",   // القسمة
  [SECTIONS.S7]: "L20",   // السالبة
  [SECTIONS.S8]: "L17",   // العشرية
  [SECTIONS.S9]: "L18",   // الجذور التربيعية
  [SECTIONS.S10]: "L19",  // الجذور التكعيبية

  // ─── الأقسام المتقدمة ───
  [SECTIONS.S11]: "L10",  // عمليات مختلطة متقدمة
  [SECTIONS.S12]: "L09",  // متعدد الخانات
  [SECTIONS.S13]: "L15",  // ضرب متقدم
  [SECTIONS.S14]: "L16",  // قسمة متقدمة
  [SECTIONS.S15]: "L17",  // عشرية متقدمة
  [SECTIONS.S16]: "L20",  // سالبة متقدمة
  [SECTIONS.S17]: "L18",  // جذور متقدمة
};

// ═══════════════════════════════════════════════════════════
// خريطة القسم → Skill ID
// ═══════════════════════════════════════════════════════════

const SECTION_TO_SKILL: Record<SectionId, string> = {
  [SECTIONS.S1]: "L03.S01",
  [SECTIONS.S2]: "L04.S01",
  [SECTIONS.S3]: "L06.S01",
  [SECTIONS.S4]: "L10.S01",
  [SECTIONS.S5]: "L15.S01",
  [SECTIONS.S6]: "L16.S01",
  [SECTIONS.S7]: "L20.S01",
  [SECTIONS.S8]: "L17.S01",
  [SECTIONS.S9]: "L18.S01",
  [SECTIONS.S10]: "L19.S01",
  [SECTIONS.S11]: "L10.S02",
  [SECTIONS.S12]: "L09.S01",
  [SECTIONS.S13]: "L15.S02",
  [SECTIONS.S14]: "L16.S02",
  [SECTIONS.S15]: "L17.S02",
  [SECTIONS.S16]: "L20.S02",
  [SECTIONS.S17]: "L18.S02",
};

// ═══════════════════════════════════════════════════════════
// خريطة القسم → Rule ID
// ═══════════════════════════════════════════════════════════

const SECTION_TO_RULE: Record<SectionId, string> = {
  [SECTIONS.S1]: "DIRECT_ADD_SUB",
  [SECTIONS.S2]: "FIVE_FRIEND",
  [SECTIONS.S3]: "TEN_FRIEND",
  [SECTIONS.S4]: "COMBINED_FRIEND",
  [SECTIONS.S5]: "MULTIPLICATION",
  [SECTIONS.S6]: "DIVISION_TRIAL",
  [SECTIONS.S7]: "NEGATIVE_COMPLEMENT",
  [SECTIONS.S8]: "DECIMAL_K_RULE",
  [SECTIONS.S9]: "SQUARE_ROOT",
  [SECTIONS.S10]: "CUBE_ROOT",
  [SECTIONS.S11]: "COMBINED_ADVANCED",
  [SECTIONS.S12]: "MULTI_DIGIT_CHAIN",
  [SECTIONS.S13]: "MULTIPLICATION_ADVANCED",
  [SECTIONS.S14]: "DIVISION_ADVANCED",
  [SECTIONS.S15]: "DECIMAL_K_RULE",
  [SECTIONS.S16]: "NEGATIVE_COMPLEMENT",
  [SECTIONS.S17]: "SQUARE_ROOT_ADVANCED",
};

// ═══════════════════════════════════════════════════════════
// صعوبة القسم
// ═══════════════════════════════════════════════════════════

function sectionToDifficulty(section: SectionId): Difficulty {
  const map: Record<SectionId, Difficulty> = {
    [SECTIONS.S1]: 1,
    [SECTIONS.S2]: 2,
    [SECTIONS.S3]: 3,
    [SECTIONS.S4]: 4,
    [SECTIONS.S5]: 4,
    [SECTIONS.S6]: 4,
    [SECTIONS.S7]: 5,
    [SECTIONS.S8]: 4,
    [SECTIONS.S9]: 5,
    [SECTIONS.S10]: 5,
    [SECTIONS.S11]: 4,
    [SECTIONS.S12]: 5,
    [SECTIONS.S13]: 5,
    [SECTIONS.S14]: 5,
    [SECTIONS.S15]: 5,
    [SECTIONS.S16]: 5,
    [SECTIONS.S17]: 5,
  };
  return map[section] ?? 3;
}

// ═══════════════════════════════════════════════════════════
// استخراج العملية من نص السؤال
// ═══════════════════════════════════════════════════════════

function detectOperation(question: string): BankOperation {
  if (/[√∛]|جذر/.test(question)) return "read";
  if (/÷/.test(question)) return "division";
  if (/[×x]/.test(question)) return "multiplication";

  // إزالة الأقواس وحساب عدد العمليات
  const hasAdd = /\+/.test(question);
  const hasSub = /-|−/.test(question);

  if (hasAdd && hasSub) return "addition"; // سلسلة مختلطة
  if (hasSub) return "subtraction";
  if (hasAdd) return "addition";
  return "addition";
}

// ═══════════════════════════════════════════════════════════
// استخراج الحركة من شرح الحل
// ═══════════════════════════════════════════════════════════

function detectMovement(solution: string): MovementType {
  // ترتيب الأكثر تحديداً أولاً
  if (/\+10\s*-\s*5|−10\s*\+\s*5|-10\s*\+\s*5|\+10\s*\+\s*5/.test(solution)) {
    return "mixed";
  }
  if (/\+\s*10.*-\s*[1-9]|10\s*-\s*[1-9]/.test(solution) && /10/.test(solution)) {
    return "ten-friend-add";
  }
  if (/-\s*10.*\+\s*[1-9]|نطرح\s*10/.test(solution)) {
    return "ten-friend-sub";
  }
  if (/\+\s*5.*-\s*[1-4]|القائد\s*5|الجدة\s*5/.test(solution)) {
    return "five-friend-add";
  }
  if (/-\s*5.*\+\s*[1-4]|نرفع\s*(الخمسة|الجدة|القائد)/.test(solution)) {
    return "five-friend-sub";
  }
  if (/حمل|carry/.test(solution)) return "carry";
  if (/استعار|استلاف|borrow/.test(solution)) return "borrow";
  return "direct";
}

// ═══════════════════════════════════════════════════════════
// تطبيع الأرقام العربية
// ═══════════════════════════════════════════════════════════

function normalizeArabicDigits(text: string): string {
  return text.replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
  );
}

// ═══════════════════════════════════════════════════════════
// استخراج المعاملات الرقمية
// ═══════════════════════════════════════════════════════════

function extractOperands(question: string): number[] {
  if (/[√∛]/.test(question)) return [];

  const cleaned = normalizeArabicDigits(question)
    .replace(/[×xX]/g, " × ")
    .replace(/÷/g, " ÷ ")
    .replace(/[−–—]/g, "-");

  const numbers = cleaned.match(/-?\d+\.?\d*/g);
  if (!numbers) return [];

  return numbers
    .map((n) => parseFloat(n))
    .filter((n) => Number.isFinite(n));
}

// ═══════════════════════════════════════════════════════════
// استخراج الإجابة الرقمية
// ═══════════════════════════════════════════════════════════

function parseResult(result: string): number {
  const cleaned = normalizeArabicDigits(result)
    .replace(/[−–—]/g, "-")
    .trim();

  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

// ═══════════════════════════════════════════════════════════
// حساب عدد الخانات
// ═══════════════════════════════════════════════════════════

function computeDigits(answer: number, operands: number[]): number {
  const values = [Math.abs(answer), ...operands.map(Math.abs)];
  const maxDigits = Math.max(
    1,
    ...values.map((v) => String(Math.trunc(v)).length),
  );
  return maxDigits;
}

// ═══════════════════════════════════════════════════════════
// استخراج الخانات المستخدمة
// ═══════════════════════════════════════════════════════════

function computePlaceValues(
  answer: number,
  operands: number[],
): BankQuestion["placeValues"] {
  const values = [Math.abs(answer), ...operands.map(Math.abs)];
  const maxDigits = Math.max(
    1,
    ...values.map((v) => String(Math.trunc(v)).length),
  );

  if (maxDigits >= 4) return ["units", "tens", "hundreds", "thousands"];
  if (maxDigits === 3) return ["units", "tens", "hundreds"];
  if (maxDigits === 2) return ["units", "tens"];
  return ["units"];
}

// ═══════════════════════════════════════════════════════════
// التحويل الرئيسي: RawQuestion → BankQuestion
// ═══════════════════════════════════════════════════════════

export function adaptRawQuestion(raw: RawQuestion): BankQuestion {
  const levelId = SECTION_TO_LEVEL[raw.section] ?? "L03";
  const skillId = SECTION_TO_SKILL[raw.section] ?? "L03.S01";
  const ruleId = SECTION_TO_RULE[raw.section] ?? "DIRECT_ADD_SUB";
  const difficulty = sectionToDifficulty(raw.section);

  const solutionText = extractSolutionText(raw);
  const movement = detectMovement(solutionText);
  const operation = detectOperation(raw.question);
  const operands = extractOperands(raw.question);
  const answer = parseResult(raw.result);

  const prefix = isAdvancedSection(raw.section) ? "ADV" : "BANK";
  const id = `${prefix}-${String(raw.id).padStart(3, "0")}`;

  return {
    id,
    levelId,
    levelOrder: raw.id,
    skillId,
    ruleId,
    category: raw.section,
    prompt: raw.question,
    operands,
    operation,
    correctAnswer: answer,
    movement,
    difficulty,
    digits: computeDigits(answer, operands),
    placeValues: computePlaceValues(answer, operands),
    hasCarry: /\+10|حمل/.test(solutionText),
    hasBorrow: /-10|استعار|استلاف/.test(solutionText),
    expectedTimeMs: raw.targetTime[0],
    maxTimeMs: raw.targetTime[1],
    explanation: solutionText,
    movementExplanation: solutionText,
    prerequisites: [],
    tags: [
      `section-${raw.section}`,
      `id-${raw.id}`,
      movement,
      `difficulty-${difficulty}`,
      prefix === "ADV" ? "advanced" : "standard",
    ],
    sourceId: `raw-${prefix}-${raw.id}`,
  };
}

/**
 * تحويل كل الأسئلة الخام.
 */
export function adaptAllRawQuestions(): BankQuestion[] {
  return RAW_QUESTIONS.map(adaptRawQuestion);
}

/**
 * عدد الأسئلة الخام الكلي.
 */
export const ADAPTED_BANK_SIZE = RAW_QUESTIONS.length;