// ═══════════════════════════════════════════════════════════════════
// 🏦 src/data/bank-linked.ts — بنك الأسئلة الرئيسي (v1)
// ═══════════════════════════════════════════════════════════════════
//
// ⚠️⚠️⚠️ ملف حرج — قلب نظام البنك ⚠️⚠️⚠️
//
// الوظيفة الحالية:
//   - يولّد 500 سؤال برمجيًا (L01-L07)
//   - يُصدّر البنك + دوال الاستعلام + دوال التقييم
//   - المحرك التكيفي و problemGenerator يعتمدان عليه
//
// 🚨 مشاكل معروفة (ستُحل مع SRB):
//
//   1. الأسئلة مولّدة برمجيًا — ليست محتوى تعليمي حقيقي
//   2. IDs بصيغة قديمة: L01.S01 / L01.R01
//   3. لا تدرج دقيق حسب منهج كوجيما
//   4. كل الأسئلة تُبنى في الذاكرة عند التحميل
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الملف الحالي (bank-linked.ts)
//         ↓ يُستبدل بـ
//   src/data/srb/index.ts + srb-adapter.ts
//
//   خطوات الانتقال:
//     1. بناء src/data/srb/questions/*.ts (الأسئلة الحقيقية)
//     2. بناء src/data/srb/index.ts (SOROBAN_BANK الجديد)
//     3. بناء src/data/srb-adapter.ts (نفس الواجهة الحالية)
//     4. تحديث المستوردين: ../data/bank-linked → ../data/srb-adapter
//     5. اختبار شامل
//     6. حذف bank-linked.ts
//
// 📤 الصادرات (كلها ستُستبدل بنفس الأسماء في SRB):
//
//   الأنواع:
//     - BankOperation
//     - Difficulty
//     - PlaceValue
//     - SorobanRule
//     - BankQuestion          🔗 → SRBQuestion
//     - QuestionEvaluation    🔗 يبقى (أو SRBEvaluation)
//
//   الثوابت:
//     - SOROBAN_BANK          🔗 → SRB.getAll()
//     - BANK_SIZE             🔗 → SRB.size()
//
//   الدوال:
//     - getQuestionById()          🔗 → SRB.getById()
//     - getQuestionsByLevel()      🔗 → SRB.getByLevel()
//     - getQuestionsBySkill()      🔗 → SRB.getBySkill()
//     - getQuestionsByRule()       🔗 → SRB.getByRule()
//     - getQuestionsByMovement()   🔗 → SRB.getByMovement()
//     - bankQuestionToProblem()    🔗 → SRB.toProblem()
//     - evaluateBankAnswer()       🔗 → SRB.evaluate()
//
// ⚠️ قواعد حرجة عند التعديل:
//   1. لا تغيّر أسماء التصديرات (المحرك يعتمد عليها)
//   2. لا تغيّر شكل BankQuestion (المحرك يقرأ حقوله)
//   3. أي تعديل = اختبار فوري + مراجعة المستوردين
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + علامات SRB-MIGRATION
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

import type { MovementType, Problem } from "../curriculum/types";

// ═══════════════════════════════════════════════════════════════════
// 📝 الأنواع (Types) — ستُستبدل بـ SRBQuestion
// ═══════════════════════════════════════════════════════════════════

/**
 * نوع العملية الحسابية في بنك السوروبان.
 *
 * 🔗 SRB-MIGRATION: يبقى كما هو (متوافق مع SRB)
 */
export type BankOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "read"
  | "build";

/**
 * مستوى الصعوبة.
 *
 * 🔗 SRB-MIGRATION: يبقى كما هو
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * الخانات المستخدمة في السؤال.
 *
 * 🔗 SRB-MIGRATION: يبقى كما هو
 */
export type PlaceValue =
  | "units"
  | "tens"
  | "hundreds"
  | "thousands"
  | "decimal";

/**
 * قاعدة السوروبان التي يعتمد عليها السؤال.
 *
 * 🔗 SRB-MIGRATION: يبقى كما هو
 */
export interface SorobanRule {
  id: string;
  name: string;
  description: string;
  movement: MovementType;
  skillId: string;
}

/**
 * السؤال الكامل داخل بنك الأسئلة.
 *
 * 🔗 SRB-MIGRATION: سيصبح SRBQuestion بنفس الشكل
 *    لكن مع IDs بصيغة SRB-L0-S01-B001
 */
export interface BankQuestion {
  id: string;                     // 🔗 SRB: SRB-L0-S01-B001
  levelId: string;                // 🔗 SRB: L0, L1, ...
  levelOrder: number;
  skillId: string;                // 🔗 SRB: L0.S01
  ruleId: string;                 // 🔗 SRB: L0.R01
  category: string;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  digits: number;
  placeValues: PlaceValue[];
  hasCarry: boolean;
  hasBorrow: boolean;
  expectedTimeMs: number;
  maxTimeMs: number;
  explanation: string;
  movementExplanation: string;
  prerequisites: string[];
  tags: string[];
  sourceId?: string;
}

/**
 * نتيجة تحليل سؤال واحد.
 *
 * 🔗 SRB-MIGRATION: يبقى كما هو
 */
export interface QuestionEvaluation {
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeMs: number;
  tooSlow: boolean;
  timeout: boolean;
  speedRatio: number;
  issue:
    | "none"
    | "wrong-answer"
    | "slow"
    | "timeout"
    | "wrong-and-slow";
}

// ═══════════════════════════════════════════════════════════════════
// 🛠️ أدوات مساعدة (Helpers)
// ═══════════════════════════════════════════════════════════════════

function createRng(seed: number): () => number {
  let value = seed >>> 0;

  return (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffle<T>(values: T[], rng: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1));
    const current = result[index];
    result[index] = result[target];
    result[target] = current;
  }
  return result;
}

function getDigits(value: number): number {
  const absolute = Math.abs(Math.trunc(value));
  if (absolute === 0) return 1;
  return String(absolute).length;
}

function getPlaceValues(operands: number[], answer: number): PlaceValue[] {
  const values = [...operands, answer];
  const maxDigits = Math.max(...values.map(getDigits));
  if (maxDigits >= 4) return ["units", "tens", "hundreds", "thousands"];
  if (maxDigits === 3) return ["units", "tens", "hundreds"];
  if (maxDigits === 2) return ["units", "tens"];
  return ["units"];
}

function hasAdditionCarry(left: number, right: number): boolean {
  const maxDigits = Math.max(getDigits(left), getDigits(right));
  for (let position = 0; position < maxDigits; position += 1) {
    const divisor = Math.pow(10, position);
    const leftDigit = Math.floor(left / divisor) % 10;
    const rightDigit = Math.floor(right / divisor) % 10;
    if (leftDigit + rightDigit >= 10) return true;
  }
  return false;
}

function hasSubtractionBorrow(left: number, right: number): boolean {
  const maxDigits = Math.max(getDigits(left), getDigits(right));
  for (let position = 0; position < maxDigits; position += 1) {
    const divisor = Math.pow(10, position);
    const leftDigit = Math.floor(left / divisor) % 10;
    const rightDigit = Math.floor(right / divisor) % 10;
    if (leftDigit < rightDigit) return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════
// ⚙️ إعدادات المستويات (L01-L07) — بصيغة قديمة
// 🔗 SRB-MIGRATION: ستُستبدل بـ SRB_L0_CONFIG ... SRB_L7_CONFIG
// ═══════════════════════════════════════════════════════════════════

const LEVEL_ONE_CONFIG = {
  levelId: "L01",                    // 🔗 SRB: "L0"
  skillId: "L01.S01",                // 🔗 SRB: "L0.S01"
  ruleId: "L01.R01",                 // 🔗 SRB: "L0.R01"
  category: "الجمع والطرح المباشر",
  movement: "direct" as MovementType,
  expectedTimeMs: 8000,
  maxTimeMs: 12000
};

const LEVEL_TWO_CONFIG = {
  levelId: "L02",                    // 🔗 SRB: "L1"
  skillId: "L02.S01",                // 🔗 SRB: "L1.S01"
  ruleId: "L02.R01",
  category: "أصدقاء العدد 5",
  movement: "five-friend-add" as MovementType,
  expectedTimeMs: 12000,
  maxTimeMs: 18000
};

const LEVEL_THREE_CONFIG = {
  levelId: "L03",                    // 🔗 SRB: "L2"
  skillId: "L03.S01",
  ruleId: "L03.R01",
  category: "أصدقاء العدد 10",
  movement: "ten-friend-add" as MovementType,
  expectedTimeMs: 14000,
  maxTimeMs: 22000
};

const LEVEL_FOUR_CONFIG = {
  levelId: "L04",                    // 🔗 SRB: "L3"
  skillId: "L04.S01",
  ruleId: "L04.R01",
  category: "القواعد المركبة 5 و10",
  movement: "mixed" as MovementType,
  expectedTimeMs: 18000,
  maxTimeMs: 28000
};

const LEVEL_FIVE_CONFIG = {
  levelId: "L05",                    // 🔗 SRB: "L4"
  skillId: "L05.S01",
  ruleId: "L05.R01",
  category: "الأعداد الكبيرة والعشرية",
  movement: "mixed" as MovementType,
  expectedTimeMs: 25000,
  maxTimeMs: 40000
};

const LEVEL_SIX_CONFIG = {
  levelId: "L06",                    // 🔗 SRB: "L5"
  skillId: "L06.S01",
  ruleId: "L06.R01",
  category: "الضرب بالسوروبان",
  movement: "mixed" as MovementType,
  expectedTimeMs: 30000,
  maxTimeMs: 45000
};

const LEVEL_SEVEN_CONFIG = {
  levelId: "L07",                    // 🔗 SRB: "L6/L7"
  skillId: "L07.S01",
  ruleId: "L07.R01",
  category: "القسمة بالسوروبان",
  movement: "mixed" as MovementType,
  expectedTimeMs: 35000,
  maxTimeMs: 50000
};

// ═══════════════════════════════════════════════════════════════════
// 🏗️ دوال إنشاء الأسئلة
// 🔗 SRB-MIGRATION: هذه الدوال ستُحذف عند بناء SRB
//    (لأن SRB سيقرأ من ملفات أسئلة حقيقية، لا توليد برمجي)
// ═══════════════════════════════════════════════════════════════════

function createAdditionQuestion(
  id: string,
  levelOrder: number,
  levelId: string,
  skillId: string,
  ruleId: string,
  category: string,
  movement: MovementType,
  left: number,
  right: number,
  difficulty: Difficulty,
  expectedTimeMs: number,
  maxTimeMs: number,
  explanation: string
): BankQuestion {
  const answer = left + right;
  return {
    id, levelId, levelOrder, skillId, ruleId, category,
    prompt: `${left} + ${right} = ؟`,
    operands: [left, right],
    operation: "addition",
    correctAnswer: answer,
    movement, difficulty,
    digits: getDigits(answer),
    placeValues: getPlaceValues([left, right], answer),
    hasCarry: hasAdditionCarry(left, right),
    hasBorrow: false,
    expectedTimeMs, maxTimeMs, explanation,
    movementExplanation:
      movement === "direct"
        ? "تحريك الخرزات مباشرة دون استخدام مكملات."
        : "استخدام قاعدة المكمل المناسبة ثم متابعة الحركة على المعداد.",
    prerequisites: [],
    tags: [
      category, movement,
      hasAdditionCarry(left, right) ? "carry" : "no-carry"
    ]
  };
}

function createSubtractionQuestion(
  id: string,
  levelOrder: number,
  levelId: string,
  skillId: string,
  ruleId: string,
  category: string,
  movement: MovementType,
  left: number,
  right: number,
  difficulty: Difficulty,
  expectedTimeMs: number,
  maxTimeMs: number,
  explanation: string
): BankQuestion {
  const answer = left - right;
  return {
    id, levelId, levelOrder, skillId, ruleId, category,
    prompt: `${left} - ${right} = ؟`,
    operands: [left, right],
    operation: "subtraction",
    correctAnswer: answer,
    movement, difficulty,
    digits: getDigits(left),
    placeValues: getPlaceValues([left, right], answer),
    hasCarry: false,
    hasBorrow: hasSubtractionBorrow(left, right),
    expectedTimeMs, maxTimeMs, explanation,
    movementExplanation:
      movement === "direct"
        ? "إبعاد الخرزات المطلوبة مباشرة."
        : "استخدام مكمل العدد المناسب ثم إكمال الحركة.",
    prerequisites: [],
    tags: [
      category, movement,
      hasSubtractionBorrow(left, right) ? "borrow" : "no-borrow"
    ]
  };
}

function createMultiplicationQuestion(
  id: string,
  levelOrder: number,
  left: number,
  right: number,
  difficulty: Difficulty,
  rng: () => number
): BankQuestion {
  const answer = left * right;
  return {
    id,
    levelId: LEVEL_SIX_CONFIG.levelId,
    levelOrder,
    skillId: LEVEL_SIX_CONFIG.skillId,
    ruleId: LEVEL_SIX_CONFIG.ruleId,
    category: LEVEL_SIX_CONFIG.category,
    prompt: `${left} × ${right} = ؟`,
    operands: [left, right],
    operation: "multiplication",
    correctAnswer: answer,
    movement: LEVEL_SIX_CONFIG.movement,
    difficulty,
    digits: getDigits(answer),
    placeValues: getPlaceValues([left, right], answer),
    hasCarry: answer >= 10,
    hasBorrow: false,
    expectedTimeMs: LEVEL_SIX_CONFIG.expectedTimeMs,
    maxTimeMs: LEVEL_SIX_CONFIG.maxTimeMs,
    explanation: `نحسب ${left} × ${right} ثم نمثل الناتج على أعمدة السوروبان.`,
    movementExplanation: "تمثيل الناتج الجزئي والمتابعة عبر الخانات.",
    prerequisites: ["L05.S01"],
    tags: [
      LEVEL_SIX_CONFIG.category, "multiplication",
      `factor-${Math.min(left, right)}`,
      `factor-${Math.max(left, right)}`,
      `random-${Math.floor(rng() * 1000)}`
    ]
  };
}

function createDivisionQuestion(
  id: string,
  levelOrder: number,
  divisor: number,
  quotient: number,
  difficulty: Difficulty
): BankQuestion {
  const dividend = divisor * quotient;
  return {
    id,
    levelId: LEVEL_SEVEN_CONFIG.levelId,
    levelOrder,
    skillId: LEVEL_SEVEN_CONFIG.skillId,
    ruleId: LEVEL_SEVEN_CONFIG.ruleId,
    category: LEVEL_SEVEN_CONFIG.category,
    prompt: `${dividend} ÷ ${divisor} = ؟`,
    operands: [dividend, divisor],
    operation: "division",
    correctAnswer: quotient,
    movement: LEVEL_SEVEN_CONFIG.movement,
    difficulty,
    digits: getDigits(dividend),
    placeValues: getPlaceValues([dividend, divisor], quotient),
    hasCarry: false, hasBorrow: false,
    expectedTimeMs: LEVEL_SEVEN_CONFIG.expectedTimeMs,
    maxTimeMs: LEVEL_SEVEN_CONFIG.maxTimeMs,
    explanation: `نقسم ${dividend} على ${divisor} للوصول إلى الناتج ${quotient}.`,
    movementExplanation: "تمثيل الناتج تدريجياً على أعمدة السوروبان.",
    prerequisites: ["L06.S01"],
    tags: [LEVEL_SEVEN_CONFIG.category, "division", `divisor-${divisor}`]
  };
}

// ═══════════════════════════════════════════════════════════════════
// 🏭 دوال التوليد لكل مستوى
// 🔗 SRB-MIGRATION: ستُحذف كلها عند بناء SRB
// ═══════════════════════════════════════════════════════════════════

function generateLevelOne(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const left = randomInt(1, 9, rng);
    const right = randomInt(1, 9, rng);
    const addition = rng() >= 0.5;
    const expression = addition
      ? `${left}+${right}`
      : `${Math.max(left, right)}-${Math.min(left, right)}`;
    if (used.has(expression)) continue;
    used.add(expression);
    if (addition) {
      questions.push(createAdditionQuestion(
        `L01.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_ONE_CONFIG.levelId, LEVEL_ONE_CONFIG.skillId, LEVEL_ONE_CONFIG.ruleId,
        LEVEL_ONE_CONFIG.category, LEVEL_ONE_CONFIG.movement,
        left, right, 1,
        LEVEL_ONE_CONFIG.expectedTimeMs, LEVEL_ONE_CONFIG.maxTimeMs,
        `جمع مباشر للعددين ${left} و${right}.`
      ));
    } else {
      const greater = Math.max(left, right);
      const smaller = Math.min(left, right);
      questions.push(createSubtractionQuestion(
        `L01.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_ONE_CONFIG.levelId, LEVEL_ONE_CONFIG.skillId, LEVEL_ONE_CONFIG.ruleId,
        LEVEL_ONE_CONFIG.category, LEVEL_ONE_CONFIG.movement,
        greater, smaller, 1,
        LEVEL_ONE_CONFIG.expectedTimeMs, LEVEL_ONE_CONFIG.maxTimeMs,
        `طرح مباشر للعدد ${smaller} من ${greater}.`
      ));
    }
  }
  return questions;
}

function generateLevelTwo(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const base = randomInt(1, 4, rng);
    const partner = randomInt(1, 5 - base, rng);
    const expression = `${base}+${partner}`;
    if (used.has(expression)) continue;
    used.add(expression);
    questions.push(createAdditionQuestion(
      `L02.Q${String(questions.length + 1).padStart(3, "0")}`,
      questions.length + 1,
      LEVEL_TWO_CONFIG.levelId, LEVEL_TWO_CONFIG.skillId, LEVEL_TWO_CONFIG.ruleId,
      LEVEL_TWO_CONFIG.category, LEVEL_TWO_CONFIG.movement,
      base, partner, 2,
      LEVEL_TWO_CONFIG.expectedTimeMs, LEVEL_TWO_CONFIG.maxTimeMs,
      `نستخدم مكملات الخمسة للوصول إلى ${base + partner}.`
    ));
  }
  return questions;
}

function generateLevelThree(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const left = randomInt(6, 9, rng);
    const right = randomInt(10 - left, 9, rng);
    const expression = `${left}+${right}`;
    if (used.has(expression)) continue;
    used.add(expression);
    questions.push(createAdditionQuestion(
      `L03.Q${String(questions.length + 1).padStart(3, "0")}`,
      questions.length + 1,
      LEVEL_THREE_CONFIG.levelId, LEVEL_THREE_CONFIG.skillId, LEVEL_THREE_CONFIG.ruleId,
      LEVEL_THREE_CONFIG.category, LEVEL_THREE_CONFIG.movement,
      left, right, 3,
      LEVEL_THREE_CONFIG.expectedTimeMs, LEVEL_THREE_CONFIG.maxTimeMs,
      `نستخدم مكمل العدد 10 لأن الجمع يتجاوز العشرة.`
    ));
  }
  return questions;
}

function generateLevelFour(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const left = randomInt(5, 9, rng);
    const right = randomInt(6, 9, rng);
    const expression = `${left}+${right}`;
    if (used.has(expression)) continue;
    used.add(expression);
    questions.push(createAdditionQuestion(
      `L04.Q${String(questions.length + 1).padStart(3, "0")}`,
      questions.length + 1,
      LEVEL_FOUR_CONFIG.levelId, LEVEL_FOUR_CONFIG.skillId, LEVEL_FOUR_CONFIG.ruleId,
      LEVEL_FOUR_CONFIG.category, LEVEL_FOUR_CONFIG.movement,
      left, right, 4,
      LEVEL_FOUR_CONFIG.expectedTimeMs, LEVEL_FOUR_CONFIG.maxTimeMs,
      `تطبيق القاعدة المركبة للجمع ${right}+ عند عدم توفر الحركة المباشرة.`
    ));
  }
  return questions;
}

function generateLevelFive(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const left = randomInt(100, 9999, rng);
    const right = randomInt(10, Math.min(left, 9999), rng);
    const addition = rng() >= 0.5;
    const greater = Math.max(left, right);
    const smaller = Math.min(left, right);
    const expression = addition ? `${left}+${right}` : `${greater}-${smaller}`;
    if (used.has(expression)) continue;
    used.add(expression);
    if (addition) {
      questions.push(createAdditionQuestion(
        `L05.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_FIVE_CONFIG.levelId, LEVEL_FIVE_CONFIG.skillId, LEVEL_FIVE_CONFIG.ruleId,
        LEVEL_FIVE_CONFIG.category, LEVEL_FIVE_CONFIG.movement,
        left, right, 5,
        LEVEL_FIVE_CONFIG.expectedTimeMs, LEVEL_FIVE_CONFIG.maxTimeMs,
        "تطبيق قواعد الجمع عبر عدة خانات مع الحمل عند الحاجة."
      ));
    } else {
      questions.push(createSubtractionQuestion(
        `L05.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_FIVE_CONFIG.levelId, LEVEL_FIVE_CONFIG.skillId, LEVEL_FIVE_CONFIG.ruleId,
        LEVEL_FIVE_CONFIG.category, LEVEL_FIVE_CONFIG.movement,
        greater, smaller, 5,
        LEVEL_FIVE_CONFIG.expectedTimeMs, LEVEL_FIVE_CONFIG.maxTimeMs,
        "تطبيق قواعد الطرح عبر عدة خانات مع الاستلاف عند الحاجة."
      ));
    }
  }
  return questions;
}

function generateLevelSix(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const left = randomInt(2, 99, rng);
    const right = randomInt(2, 9, rng);
    const expression = `${left}*${right}`;
    if (used.has(expression)) continue;
    used.add(expression);
    questions.push(createMultiplicationQuestion(
      `L06.Q${String(questions.length + 1).padStart(3, "0")}`,
      questions.length + 1, left, right, 5, rng
    ));
  }
  return questions;
}

function generateLevelSeven(count: number, rng: () => number): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();
  while (questions.length < count) {
    const divisor = randomInt(2, 25, rng);
    const quotient = randomInt(2, 99, rng);
    const expression = `${divisor}*${quotient}`;
    if (used.has(expression)) continue;
    used.add(expression);
    questions.push(createDivisionQuestion(
      `L07.Q${String(questions.length + 1).padStart(3, "0")}`,
      questions.length + 1, divisor, quotient, 5
    ));
  }
  return questions;
}

// ═══════════════════════════════════════════════════════════════════
// 🏦 بناء البنك — 500 سؤال
// 🔗 SRB-MIGRATION: سيُستبدل بقراءة من ملفات SRB
// ═══════════════════════════════════════════════════════════════════

function buildBank(seed = 20260924): BankQuestion[] {
  const rng = createRng(seed);
  const levels = [
    ...generateLevelOne(70, rng),
    ...generateLevelTwo(70, rng),
    ...generateLevelThree(70, rng),
    ...generateLevelFour(70, rng),
    ...generateLevelFive(100, rng),
    ...generateLevelSix(60, rng),
    ...generateLevelSeven(60, rng)
  ];
  if (levels.length !== 500) {
    throw new Error(
      `SorobanMind bank must contain exactly 500 questions. Current count: ${levels.length}`
    );
  }
  return shuffle(levels, rng);
}

// ═══════════════════════════════════════════════════════════════════
// 📤 الصادرات العامة — كلها ستُستبدل بـ SRB بنفس الأسماء
// ═══════════════════════════════════════════════════════════════════

/**
 * بنك الأسئلة الرئيسي.
 *
 * 🔗 SRB-MIGRATION: سيُستبدل بـ SRB.getAll() أو SRB.questions
 */
export const SOROBAN_BANK: readonly BankQuestion[] =
  Object.freeze(buildBank());

/**
 * عدد الأسئلة.
 *
 * 🔗 SRB-MIGRATION: سيُستبدل بـ SRB.size()
 */
export const BANK_SIZE = SOROBAN_BANK.length;

/**
 * الحصول على سؤال بالمعرف.
 *
 * 🔗 SRB-MIGRATION: SRB.getById(id)
 */
export function getQuestionById(id: string): BankQuestion | undefined {
  return SOROBAN_BANK.find(question => question.id === id);
}

/**
 * الحصول على أسئلة مستوى معين.
 *
 * 🔗 SRB-MIGRATION: SRB.getByLevel(levelId)
 */
export function getQuestionsByLevel(levelId: string): BankQuestion[] {
  return SOROBAN_BANK.filter(question => question.levelId === levelId);
}

/**
 * الحصول على أسئلة مهارة معينة.
 *
 * 🔗 SRB-MIGRATION: SRB.getBySkill(skillId)
 */
export function getQuestionsBySkill(skillId: string): BankQuestion[] {
  return SOROBAN_BANK.filter(question => question.skillId === skillId);
}

/**
 * الحصول على أسئلة قاعدة معينة.
 *
 * 🔗 SRB-MIGRATION: SRB.getByRule(ruleId)
 */
export function getQuestionsByRule(ruleId: string): BankQuestion[] {
  return SOROBAN_BANK.filter(question => question.ruleId === ruleId);
}

/**
 * الحصول على أسئلة حركة معينة.
 *
 * 🔗 SRB-MIGRATION: SRB.getByMovement(movement)
 */
export function getQuestionsByMovement(movement: MovementType): BankQuestion[] {
  return SOROBAN_BANK.filter(question => question.movement === movement);
}

/**
 * تحويل سؤال البنك إلى Problem.
 *
 * 🔗 SRB-MIGRATION: SRB.toProblem(question)
 */
export function bankQuestionToProblem(question: BankQuestion): Problem {
  const operation =
    question.operation === "addition" ? "+" :
    question.operation === "subtraction" ? "-" :
    question.operation === "read" ? "read" : "build";

  return {
    operands: question.operands,
    operation,
    movement: question.movement,
    expectedAnswer: question.correctAnswer,
    difficulty: question.difficulty
  };
}

/**
 * تقييم إجابة الطفل.
 *
 * 🔗 SRB-MIGRATION: SRB.evaluate(question, answer, time)
 */
export function evaluateBankAnswer(
  question: BankQuestion,
  userAnswer: number,
  timeMs: number
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
    correct, userAnswer,
    correctAnswer: question.correctAnswer,
    timeMs: safeTime,
    tooSlow, timeout, speedRatio, issue
  };
}