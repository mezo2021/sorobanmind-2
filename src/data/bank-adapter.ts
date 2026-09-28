// ═══════════════════════════════════════════════════════════════════
// 🔄 src/data/bank-adapter.ts — محوّل الأسئلة الخام → BankQuestion
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️⚠️⚠️ ملف حرج — الجسر بين bank-raw والمحرك ⚠️⚠️⚠️
//
// الوظيفة الحالية:
//   - يحوّل الأسئلة الخام (bank-raw) → BankQuestion
//   - يستخرج: العملية · الحركة · المعاملات · الإجابة
//   - يستخدم regex لتحليل النصوص العربية
//
// 🚨🚨🚨 مشكلة خطيرة: تعارض أنظمة الترقيم 🚨🚨🚨
//
//   هناك 3 أنظمة ترقيم متصارعة في المشروع:
//
//     | الملف            | مثال        | الوصف             |
//     |------------------|-------------|-------------------|
//     | bank.ts          | L01 ... L07 | نظام قديم (v1)    |
//     | bank-adapter.ts  | L03 ... L20 | نظام خام (هذا)    |
//     | SRB (الوثيقة)    | L0  ... L7  | النظام المستهدف   |
//
//   ⚠️ هذا التعارض هو السبب الجذري لفشل توحيد IDs سابقًا!
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: بناء SRB كاملًا (src/data/srb/)
//   الخطوة 2: تحديث SECTION_TO_LEVEL لتُطابق SRB
//   الخطوة 3: تحديث SECTION_TO_SKILL لتُطابق SRB
//   الخطوة 4: تحديث SECTION_TO_RULE لتُطابق SRB
//   الخطوة 5: اختبار adaptAllRawQuestions()
//   الخطوة 6: حذف bank-adapter.ts (استُبدل بـ srb-adapter)
//
// ⚠️ الاعتماديات الحرجة:
//   - ./bank (BankQuestion, BankOperation, Difficulty)   🔗 → SRB
//   - ./bank-raw (RAW_QUESTIONS, SECTIONS, ...)           🔗 → SRB
//
// ⚠️ قواعد حرجة عند التعديل:
//   1. أي تغيير في SECTION_TO_LEVEL قد يكسر توزيع المستويات
//   2. أي تغيير في detectMovement قد يكسر الحركات
//   3. ابحث عن كل من يستورد adaptRawQuestion قبل التعديل
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + علامات SRB-MIGRATION
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// 🔗 SRB-MIGRATION: هذا الاستيراد سيُستبدل لاحقًا
import type {
  BankQuestion,       // 🔗 → SRBQuestion
  BankOperation,      // 🔗 → SRBOperation (أو يبقى)
  Difficulty,         // 🔗 → SRBDifficulty (أو يبقى)
} from "./bank";       // 🔗 → ../data/srb/types

import type { MovementType } from "../curriculum/types";

// 🔗 SRB-MIGRATION: bank-raw سيُستبدل بـ SRB (نفس الفكرة)
import {
  RAW_QUESTIONS,       // 🔗 → SRB.rawQuestions
  SECTIONS,            // 🔗 → SRB.sections
  isAdvancedSection,   // 🔗 → SRB.isAdvanced()
  extractSolutionText, // 🔗 → SRB.extractSolution()
  type RawQuestion,    // 🔗 → SRBRawQuestion
  type SectionId,      // 🔗 → SRBSectionId
} from "./bank-raw";

// ═══════════════════════════════════════════════════════════════════
// 🗺️ خريطة القسم → المستوى (بصيغة L03-L20 القديمة)
// 🔗 SRB-MIGRATION: ستُعاد كتابتها بصيغة L0-L7
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️ هذه الخريطة تحتوي على ترقيم مختلف عن bank.ts
//    (الذي يستخدم L01-L07).
//
// 🎯 خريطة التحويل المستقبلية (L03-L20 → L0-L7):
//
//    | الحالي | SRB  |
//    |--------|------|
//    | L03    | L1   |
//    | L04    | L1   |
//    | L06    | L1   |
//    | L09    | L1   |
//    | L10    | L1   |
//    | L15    | L2   |
//    | L16    | L3   |
//    | L17    | L6   |
//    | L18    | L7   |
//    | L19    | L7   |
//    | L20    | L4   |

const SECTION_TO_LEVEL: Record<SectionId, string> = {
  // ─── الأقسام الأصلية (10 أقسام) ───
  [SECTIONS.S1]: "L03",   // 🔗 SRB: L1 (جمع/طرح بسيط)
  [SECTIONS.S2]: "L04",   // 🔗 SRB: L1 (أصدقاء 5)
  [SECTIONS.S3]: "L06",   // 🔗 SRB: L1 (أصدقاء 10)
  [SECTIONS.S4]: "L10",   // 🔗 SRB: L1 (قواعد مركبة)
  [SECTIONS.S5]: "L15",   // 🔗 SRB: L2 (الضرب)
  [SECTIONS.S6]: "L16",   // 🔗 SRB: L3 (القسمة)
  [SECTIONS.S7]: "L20",   // 🔗 SRB: L4 (السالبة)
  [SECTIONS.S8]: "L17",   // 🔗 SRB: L6 (العشرية)
  [SECTIONS.S9]: "L18",   // 🔗 SRB: L7 (الجذور التربيعية)
  [SECTIONS.S10]: "L19",  // 🔗 SRB: L7 (الجذور التكعيبية)

  // ─── الأقسام المتقدمة (7 أقسام) ───
  [SECTIONS.S11]: "L10",  // 🔗 SRB: L1 (عمليات مختلطة متقدمة)
  [SECTIONS.S12]: "L09",  // 🔗 SRB: L1 (متعدد الخانات)
  [SECTIONS.S13]: "L15",  // 🔗 SRB: L2 (ضرب متقدم)
  [SECTIONS.S14]: "L16",  // 🔗 SRB: L3 (قسمة متقدمة)
  [SECTIONS.S15]: "L17",  // 🔗 SRB: L6 (عشرية متقدمة)
  [SECTIONS.S16]: "L20",  // 🔗 SRB: L4 (سالبة متقدمة)
  [SECTIONS.S17]: "L18",  // 🔗 SRB: L7 (جذور متقدمة)
};

// ═══════════════════════════════════════════════════════════════════
// 🗺️ خريطة القسم → Skill ID
// 🔗 SRB-MIGRATION: ستُحدَّث لتُطابق SRB (مثل: L0.S01)
// ═══════════════════════════════════════════════════════════════════

const SECTION_TO_SKILL: Record<SectionId, string> = {
  [SECTIONS.S1]: "L03.S01",   // 🔗 SRB: L1.S01
  [SECTIONS.S2]: "L04.S01",   // 🔗 SRB: L1.S02
  [SECTIONS.S3]: "L06.S01",   // 🔗 SRB: L1.S03
  [SECTIONS.S4]: "L10.S01",   // 🔗 SRB: L1.S04
  [SECTIONS.S5]: "L15.S01",   // 🔗 SRB: L2.S01
  [SECTIONS.S6]: "L16.S01",   // 🔗 SRB: L3.S01
  [SECTIONS.S7]: "L20.S01",   // 🔗 SRB: L4.S01
  [SECTIONS.S8]: "L17.S01",   // 🔗 SRB: L6.S01
  [SECTIONS.S9]: "L18.S01",   // 🔗 SRB: L7.S01
  [SECTIONS.S10]: "L19.S01",  // 🔗 SRB: L7.S02
  [SECTIONS.S11]: "L10.S02",
  [SECTIONS.S12]: "L09.S01",
  [SECTIONS.S13]: "L15.S02",
  [SECTIONS.S14]: "L16.S02",
  [SECTIONS.S15]: "L17.S02",
  [SECTIONS.S16]: "L20.S02",
  [SECTIONS.S17]: "L18.S02",
};

// ═══════════════════════════════════════════════════════════════════
// 🗺️ خريطة القسم → Rule ID
// 🔗 SRB-MIGRATION: تبقى كما هي (مفاهيم ثابتة)
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// 🎚️ صعوبة القسم
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// 🔍 دوال التحليل (regex)
// ═══════════════════════════════════════════════════════════════════

/**
 * استخراج العملية من نص السؤال.
 */
function detectOperation(question: string): BankOperation {
  if (/[√∛]|جذر/.test(question)) return "read";
  if (/÷/.test(question)) return "division";
  if (/[×x]/.test(question)) return "multiplication";

  const hasAdd = /\+/.test(question);
  const hasSub = /-|−/.test(question);

  if (hasAdd && hasSub) return "addition";
  if (hasSub) return "subtraction";
  if (hasAdd) return "addition";
  return "addition";
}

/**
 * استخراج الحركة من شرح الحل.
 */
function detectMovement(solution: string): MovementType {
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

/**
 * تطبيع الأرقام العربية.
 */
function normalizeArabicDigits(text: string): string {
  return text.replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d)),
  );
}

/**
 * استخراج المعاملات الرقمية.
 */
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

/**
 * استخراج الإجابة الرقمية.
 */
function parseResult(result: string): number {
  const cleaned = normalizeArabicDigits(result)
    .replace(/[−–—]/g, "-")
    .trim();

  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

/**
 * حساب عدد الخانات.
 */
function computeDigits(answer: number, operands: number[]): number {
  const values = [Math.abs(answer), ...operands.map(Math.abs)];
  const maxDigits = Math.max(
    1,
    ...values.map((v) => String(Math.trunc(v)).length),
  );
  return maxDigits;
}

/**
 * استخراج الخانات المستخدمة.
 */
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

// ═══════════════════════════════════════════════════════════════════
// 🔄 التحويل الرئيسي: RawQuestion → BankQuestion
// ═══════════════════════════════════════════════════════════════════

/**
 * تحويل سؤال خام إلى BankQuestion.
 *
 * 🔗 SRB-MIGRATION: ستصبح adaptSRBQuestion()
 */
export function adaptRawQuestion(raw: RawQuestion): BankQuestion {
  const levelId = SECTION_TO_LEVEL[raw.section] ?? "L03";   // 🔗 SRB
  const skillId = SECTION_TO_SKILL[raw.section] ?? "L03.S01"; // 🔗 SRB
  const ruleId = SECTION_TO_RULE[raw.section] ?? "DIRECT_ADD_SUB";
  const difficulty = sectionToDifficulty(raw.section);

  const solutionText = extractSolutionText(raw);
  const movement = detectMovement(solutionText);
  const operation = detectOperation(raw.question);
  const operands = extractOperands(raw.question);
  const answer = parseResult(raw.result);

  const prefix = isAdvancedSection(raw.section) ? "ADV" : "BANK";
  const id = `${prefix}-${String(raw.id).padStart(3, "0")}`;  // 🔗 SRB

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
 *
 * 🔗 SRB-MIGRATION: ستصبح adaptAllSRBQuestions()
 */
export function adaptAllRawQuestions(): BankQuestion[] {
  return RAW_QUESTIONS.map(adaptRawQuestion);
}

/**
 * عدد الأسئلة الخام الكلي.
 */
export const ADAPTED_BANK_SIZE = RAW_QUESTIONS.length;