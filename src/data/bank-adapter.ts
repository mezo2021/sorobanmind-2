// src/data/bank-adapter.ts
// يحوّل الأسئلة الخام إلى BankQuestion الجاهزة للتعليم التكيفي

import type {
  BankQuestion,
  BankOperation,
  Difficulty,
} from "./bank";
import type { MovementType } from "../curriculum/types";
import { RAW_QUESTIONS, SECTIONS, type RawQuestion } from "./bank-raw";

// ═══════════════════════════════════════════════════════════
// تصنيف الأقسام إلى مستويات المنهج
// ═══════════════════════════════════════════════════════════
const SECTION_TO_LEVEL: Record<string, string> = {
  [SECTIONS.S1]: "L03",
  [SECTIONS.S2]: "L06",
  [SECTIONS.S3]: "L08",
  [SECTIONS.S4]: "L10",
  [SECTIONS.S5]: "L15",
  [SECTIONS.S6]: "L16",
  [SECTIONS.S7]: "L13",
  [SECTIONS.S8]: "L17",
  [SECTIONS.S9]: "L18",
  [SECTIONS.S10]: "L19",
};

// ═══════════════════════════════════════════════════════════
// تصنيف الأقسام إلى Skill IDs
// ═══════════════════════════════════════════════════════════
const SECTION_TO_SKILL: Record<string, string> = {
  [SECTIONS.S1]: "L03.S01",
  [SECTIONS.S2]: "L06.S01",
  [SECTIONS.S3]: "L08.S01",
  [SECTIONS.S4]: "L10.S01",
  [SECTIONS.S5]: "L15.S01",
  [SECTIONS.S6]: "L16.S01",
  [SECTIONS.S7]: "L13.S01",
  [SECTIONS.S8]: "L17.S01",
  [SECTIONS.S9]: "L18.S01",
  [SECTIONS.S10]: "L19.S01",
};

// ═══════════════════════════════════════════════════════════
// تصنيف الأقسام إلى Rule IDs
// ═══════════════════════════════════════════════════════════
const SECTION_TO_RULE: Record<string, string> = {
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
};

// ═══════════════════════════════════════════════════════════
// استخراج العملية من نص السؤال
// ═══════════════════════════════════════════════════════════
function detectOperation(question: string): BankOperation {
  if (/جذر_تكعيبي|جذر\(/.test(question)) return "read";
  if (/÷/.test(question)) return "division";
  if (/[×x]/.test(question)) return "multiplication";
  if (/-/.test(question) && !/\d\s*-\s*\d+\s*[+×÷]/.test(question)) {
    // إذا كانت العملية الأساسية هي الطرح
    if (!/\+/.test(question)) return "subtraction";
  }
  if (/\+/.test(question)) return "addition";
  return "addition";
}

// ═══════════════════════════════════════════════════════════
// استخراج نوع الحركة من شرح الحل
// ═══════════════════════════════════════════════════════════
function detectMovement(solution: string): MovementType {
  if (/\+10\s*-\s*5|−10\s*\+\s*5|-10\s*\+\s*5/.test(solution)) {
    return "mixed";
  }
  if (/\+10\s*-|10\s*-\s*/.test(solution) && /10/.test(solution)) {
    return "ten-friend-add";
  }
  if (/-10\s*\+|نطرح\s*10/.test(solution)) {
    return "ten-friend-sub";
  }
  if (/\+5\s*-|القائد\s*5/.test(solution)) {
    return "five-friend-add";
  }
  if (/-5\s*\+|نرفع\s*(الخمسة|القائد)/.test(solution)) {
    return "five-friend-sub";
  }
  if (/حمل|carry/.test(solution)) return "carry";
  if (/استعار|استلاف|borrow/.test(solution)) return "borrow";
  return "direct";
}

// ═══════════════════════════════════════════════════════════
// استخراج صعوبة السؤال حسب القسم
// ═══════════════════════════════════════════════════════════
function sectionToDifficulty(section: string): Difficulty {
  if (section === SECTIONS.S1) return 1;
  if (section === SECTIONS.S2) return 2;
  if (section === SECTIONS.S3) return 3;
  if (section === SECTIONS.S4) return 4;
  if (section === SECTIONS.S5) return 4;
  if (section === SECTIONS.S6) return 4;
  if (section === SECTIONS.S7) return 5;
  if (section === SECTIONS.S8) return 4;
  if (section === SECTIONS.S9) return 5;
  if (section === SECTIONS.S10) return 5;
  return 3;
}

// ═══════════════════════════════════════════════════════════
// استخراج المعاملات الرقمية من نص السؤال
// ═══════════════════════════════════════════════════════════
function extractOperands(question: string): number[] {
  // تجاهل الأسئلة الخاصة (الجذور)
  if (/جذر/.test(question)) return [];

  const cleaned = question
    .replace(/[٠-٩]/g, (d) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
    )
    .replace(/[×xX]/g, " × ")
    .replace(/÷/g, " ÷ ");

  const numbers = cleaned.match(/-?\d+\.?\d*/g);
  if (!numbers) return [];

  return numbers.map((n) => parseFloat(n));
}

// ═══════════════════════════════════════════════════════════
// استخراج الإجابة الرقمية من نص النتيجة
// ═══════════════════════════════════════════════════════════
function parseResult(result: string): number {
  const cleaned = result
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[−–—]/g, "-")
    .trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

// ═══════════════════════════════════════════════════════════
// التحويل الرئيسي
// ═══════════════════════════════════════════════════════════
export function adaptRawQuestion(raw: RawQuestion): BankQuestion {
  const levelId = SECTION_TO_LEVEL[raw.section] ?? "L03";
  const skillId = SECTION_TO_SKILL[raw.section] ?? "L03.S01";
  const ruleId = SECTION_TO_RULE[raw.section] ?? "DIRECT_ADD_SUB";
  const movement = detectMovement(raw.solution);
  const operation = detectOperation(raw.question);
  const difficulty = sectionToDifficulty(raw.section);
  const operands = extractOperands(raw.question);
  const answer = parseResult(raw.result);

  return {
    id: `BANK-${String(raw.id).padStart(3, "0")}`,
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
    digits: Math.max(
      1,
      ...operands.map((n) =>
        Math.abs(Math.trunc(n)).toString().length,
      ),
    ),
    placeValues: ["units"],
    hasCarry: /\+10|حمل/.test(raw.solution),
    hasBorrow: /-10|استعار|استلاف/.test(raw.solution),
    expectedTimeMs: raw.targetTime[0],
    maxTimeMs: raw.targetTime[1],
    explanation: raw.solution,
    movementExplanation: raw.solution,
    prerequisites: [],
    tags: [
      `section-${raw.id}`,
      movement,
      `difficulty-${difficulty}`,
    ],
    sourceId: `raw-${raw.id}`,
  };
}

/**
 * تحويل كل الأسئلة الخام.
 */
export function adaptAllRawQuestions(): BankQuestion[] {
  return RAW_QUESTIONS.map(adaptRawQuestion);
}

/**
 * عدد الأسئلة الخام.
 */
export const ADAPTED_BANK_SIZE = RAW_QUESTIONS.length;