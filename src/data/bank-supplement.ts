// src/data/bank-supplement.ts
// بنك تكميلي — يملأ الفراغات في بنك bank.ts دون تعديله
// يضيف: طرح أصدقاء 5، طرح أصدقاء 10، عمليات مركبة، سلاسل كبيرة، جذور

import type {
  BankQuestion,
  BankOperation,
  Difficulty,
  PlaceValue,
} from "./bank";
import type { MovementType } from "../curriculum/types";

// ═══════════════════════════════════════════════════════════
// الأدوات المساعدة (مستقلة عن bank.ts)
// ═══════════════════════════════════════════════════════════

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

/**
 * حساب الحمل في سلسلة جمع.
 */
function chainHasCarry(operands: number[]): boolean {
  const total = operands.reduce((sum, n) => sum + n, 0);
  return total >= 10;
}

/**
 * حساب الاستلاف في سلسلة طرح.
 */
function chainHasBorrow(operands: number[]): boolean {
  let current = operands[0];
  for (let i = 1; i < operands.length; i += 1) {
    if (operands[i] < 0 && current < Math.abs(operands[i])) return true;
    current += operands[i];
  }
  return false;
}

// ═══════════════════════════════════════════════════════════
// مصنّع عام لسؤال من البنك التكميلي
// ═══════════════════════════════════════════════════════════

interface SupplementQuestionParams {
  id: string;
  levelId: string;
  levelOrder: number;
  skillId: string;
  ruleId: string;
  category: string;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  expectedTimeMs: number;
  maxTimeMs: number;
  explanation: string;
  tags?: string[];
}

function createSupplementQuestion(
  params: SupplementQuestionParams,
): BankQuestion {
  const {
    id,
    levelId,
    levelOrder,
    skillId,
    ruleId,
    category,
    prompt,
    operands,
    operation,
    correctAnswer,
    movement,
    difficulty,
    expectedTimeMs,
    maxTimeMs,
    explanation,
    tags = [],
  } = params;

  return {
    id,
    levelId,
    levelOrder,
    skillId,
    ruleId,
    category,
    prompt,
    operands,
    operation,
    correctAnswer,
    movement,
    difficulty,
    digits: getDigits(correctAnswer),
    placeValues: getPlaceValues(operands, correctAnswer),
    hasCarry: chainHasCarry(operands.filter((n) => n >= 0)),
    hasBorrow: chainHasBorrow(operands),
    expectedTimeMs,
    maxTimeMs,
    explanation,
    movementExplanation:
      movement === "direct"
        ? "تحريك الخرزات مباشرة."
        : "استخدام قاعدة المكمل المناسبة.",
    prerequisites: [],
    tags: [category, movement, ...tags],
    sourceId: `supplement-${levelOrder}`,
  };
}

// ═══════════════════════════════════════════════════════════
// 1) L05 — أصدقاء 5 — طرح (30 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_FIVE_CONFIG = {
  levelId: "L05",
  skillId: "L05.S01",
  ruleId: "L05.R01",
  category: "مكملات الخمسة — طرح",
  movement: "five-friend-sub" as MovementType,
  expectedTimeMs: 12000,
  maxTimeMs: 18000,
};

function generateFiveFriendSub(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    // القيمة الأولية من 5 إلى 9
    const left = randomInt(5, 9, rng);
    // الرقم المطروح من 1 إلى 4
    const right = randomInt(1, 4, rng);

    const expression = `${left}-${right}`;
    if (used.has(expression)) continue;
    used.add(expression);

    const answer = left - right;
    const complement = 5 - right;

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L05-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_FIVE_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_FIVE_CONFIG.skillId,
        ruleId: LEVEL_FIVE_CONFIG.ruleId,
        category: LEVEL_FIVE_CONFIG.category,
        prompt: `${left} − ${right} = ؟`,
        operands: [left, -right],
        operation: "subtraction",
        correctAnswer: answer,
        movement: LEVEL_FIVE_CONFIG.movement,
        difficulty: 2,
        expectedTimeMs: LEVEL_FIVE_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_FIVE_CONFIG.maxTimeMs,
        explanation: `${left} − ${right}: نرفع الجدة 5 (−5) ثم نضيف صديق ${right} وهو ${complement} (+${complement}).`,
        tags: ["supplement", "five-friend", "subtraction"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// 2) L07 — أصدقاء 10 — طرح (30 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_SEVEN_CONFIG = {
  levelId: "L07",
  skillId: "L07.S01",
  ruleId: "L07.R01",
  category: "مكملات العشرة — طرح",
  movement: "ten-friend-sub" as MovementType,
  expectedTimeMs: 14000,
  maxTimeMs: 22000,
};

function generateTenFriendSub(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    // القيمة الأولية من 11 إلى 18
    const left = randomInt(11, 18, rng);
    // الرقم المطروح بحيث الناتج أقل من 10
    const right = randomInt(left - 9, 9, rng);

    if (right < 1 || right > 9) continue;

    const expression = `${left}-${right}`;
    if (used.has(expression)) continue;
    used.add(expression);

    const answer = left - right;
    const complement = 10 - right;

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L07-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_SEVEN_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_SEVEN_CONFIG.skillId,
        ruleId: LEVEL_SEVEN_CONFIG.ruleId,
        category: LEVEL_SEVEN_CONFIG.category,
        prompt: `${left} − ${right} = ؟`,
        operands: [left, -right],
        operation: "subtraction",
        correctAnswer: answer,
        movement: LEVEL_SEVEN_CONFIG.movement,
        difficulty: 3,
        expectedTimeMs: LEVEL_SEVEN_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_SEVEN_CONFIG.maxTimeMs,
        explanation: `${left} − ${right}: نطرح 10 (−10) ثم نضيف صديق ${right} وهو ${complement} (+${complement}).`,
        tags: ["supplement", "ten-friend", "subtraction"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// 3) L10 — عمليات مركبة (40 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_TEN_CONFIG = {
  levelId: "L10",
  skillId: "L10.S01",
  ruleId: "L10.R01",
  category: "العمليات المختلطة",
  movement: "mixed" as MovementType,
  expectedTimeMs: 18000,
  maxTimeMs: 28000,
};

function generateMixedOperations(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const kind = questions.length % 4; // تنويع: + - × ÷

    let operands: number[] = [];
    let prompt = "";
    let answer = 0;
    let operation: BankOperation = "addition";
    let difficulty: Difficulty = 4;

    if (kind === 0) {
      // جمع سلسلة
      const a = randomInt(15, 80, rng);
      const b = randomInt(10, 60, rng);
      const c = randomInt(10, 50, rng);
      operands = [a, b, c];
      prompt = `${a} + ${b} + ${c} = ؟`;
      answer = a + b + c;
      operation = "addition";
    } else if (kind === 1) {
      // طرح سلسلة
      const a = randomInt(100, 300, rng);
      const b = randomInt(20, 60, rng);
      const c = randomInt(10, 50, rng);
      operands = [a, -b, -c];
      prompt = `${a} − ${b} − ${c} = ؟`;
      answer = a - b - c;
      operation = "subtraction";
    } else if (kind === 2) {
      // ضرب + جمع
      const a = randomInt(3, 12, rng);
      const b = randomInt(3, 9, rng);
      const c = randomInt(5, 40, rng);
      operands = [a, b, c];
      prompt = `(${a} × ${b}) + ${c} = ؟`;
      answer = a * b + c;
      operation = "multiplication";
    } else {
      // جمع + طرح مركّب
      const a = randomInt(50, 200, rng);
      const b = randomInt(10, 80, rng);
      const c = randomInt(20, 90, rng);
      operands = [a, b, -c];
      prompt = `${a} + ${b} − ${c} = ؟`;
      answer = a + b - c;
      operation = "addition";
    }

    const expression = prompt;
    if (used.has(expression)) continue;
    used.add(expression);

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L10-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_TEN_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_TEN_CONFIG.skillId,
        ruleId: LEVEL_TEN_CONFIG.ruleId,
        category: LEVEL_TEN_CONFIG.category,
        prompt,
        operands,
        operation,
        correctAnswer: answer,
        movement: LEVEL_TEN_CONFIG.movement,
        difficulty,
        expectedTimeMs: LEVEL_TEN_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_TEN_CONFIG.maxTimeMs,
        explanation: `الحل يتطلب تطبيق قواعد متعددة على السوروبان. الناتج: ${answer}.`,
        tags: ["supplement", "mixed"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// 4) L08 + L09 — سلاسل كبيرة (40 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_EIGHT_CONFIG = {
  levelId: "L08",
  skillId: "L08.S01",
  ruleId: "L08.R01",
  category: "الجمع متعدد الخانات",
  movement: "mixed" as MovementType,
  expectedTimeMs: 25000,
  maxTimeMs: 40000,
};

function generateBigChains(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const termsCount = randomInt(4, 6, rng);
    const operands: number[] = [];
    let current = randomInt(500, 3000, rng);

    operands.push(current);

    const pieces: string[] = [`${current}`];

    for (let i = 1; i < termsCount; i += 1) {
      const isAddition = rng() >= 0.4;
      const value = randomInt(50, 800, rng);

      if (isAddition) {
        operands.push(value);
        current += value;
        pieces.push(`+ ${value}`);
      } else {
        operands.push(-value);
        current -= value;
        pieces.push(`− ${value}`);
      }
    }

    const prompt = `${pieces.join(" ")} = ؟`;
    if (used.has(prompt)) continue;
    used.add(prompt);

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L08-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_EIGHT_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_EIGHT_CONFIG.skillId,
        ruleId: LEVEL_EIGHT_CONFIG.ruleId,
        category: LEVEL_EIGHT_CONFIG.category,
        prompt,
        operands,
        operation: "addition",
        correctAnswer: current,
        movement: LEVEL_EIGHT_CONFIG.movement,
        difficulty: 4,
        expectedTimeMs: LEVEL_EIGHT_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_EIGHT_CONFIG.maxTimeMs,
        explanation: `سلسلة من ${termsCount} عمليات — الناتج النهائي: ${current}.`,
        tags: ["supplement", "chain", "multi-digit"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// 5) L18 — جذور تربيعية (20 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_EIGHTEEN_CONFIG = {
  levelId: "L18",
  skillId: "L18.S01",
  ruleId: "L18.R01",
  category: "الحساب المنظّم — ميتوري",
  movement: "mixed" as MovementType,
  expectedTimeMs: 35000,
  maxTimeMs: 50000,
};

function generateSquareRoots(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<number>();

  while (questions.length < count) {
    // جذر تربيعي صحيح من 11 إلى 99
    const root = randomInt(11, 99, rng);
    const square = root * root;

    if (used.has(square)) continue;
    used.add(square);

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L18-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_EIGHTEEN_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_EIGHTEEN_CONFIG.skillId,
        ruleId: LEVEL_EIGHTEEN_CONFIG.ruleId,
        category: LEVEL_EIGHTEEN_CONFIG.category,
        prompt: `√${square} = ؟`,
        operands: [square],
        operation: "read",
        correctAnswer: root,
        movement: LEVEL_EIGHTEEN_CONFIG.movement,
        difficulty: 5,
        expectedTimeMs: LEVEL_EIGHTEEN_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_EIGHTEEN_CONFIG.maxTimeMs,
        explanation: `الجذر التربيعي لـ ${square} هو ${root} (لأن ${root}² = ${square}).`,
        tags: ["supplement", "square-root", "advanced"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// 6) L19 — جذور تكعيبية (20 سؤالاً)
// ═══════════════════════════════════════════════════════════

const LEVEL_NINETEEN_CONFIG = {
  levelId: "L19",
  skillId: "L19.S01",
  ruleId: "L19.R01",
  category: "المنافسات",
  movement: "mixed" as MovementType,
  expectedTimeMs: 40000,
  maxTimeMs: 60000,
};

function generateCubeRoots(
  count: number,
  rng: () => number,
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<number>();

  while (questions.length < count) {
    // جذر تكعيبي صحيح من 5 إلى 30
    const root = randomInt(5, 30, rng);
    const cube = root * root * root;

    if (used.has(cube)) continue;
    used.add(cube);

    questions.push(
      createSupplementQuestion({
        id: `SUPP-L19-Q${String(questions.length + 1).padStart(3, "0")}`,
        levelId: LEVEL_NINETEEN_CONFIG.levelId,
        levelOrder: questions.length + 1,
        skillId: LEVEL_NINETEEN_CONFIG.skillId,
        ruleId: LEVEL_NINETEEN_CONFIG.ruleId,
        category: LEVEL_NINETEEN_CONFIG.category,
        prompt: `∛${cube} = ؟`,
        operands: [cube],
        operation: "read",
        correctAnswer: root,
        movement: LEVEL_NINETEEN_CONFIG.movement,
        difficulty: 5,
        expectedTimeMs: LEVEL_NINETEEN_CONFIG.expectedTimeMs,
        maxTimeMs: LEVEL_NINETEEN_CONFIG.maxTimeMs,
        explanation: `الجذر التكعيبي لـ ${cube} هو ${root} (لأن ${root}³ = ${cube}).`,
        tags: ["supplement", "cube-root", "advanced"],
      }),
    );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════
// البناء الرئيسي
// ═══════════════════════════════════════════════════════════

/**
 * بناء البنك التكميلي.
 *
 * التوزيع:
 * L05 = 30
 * L07 = 30
 * L10 = 40
 * L08 = 40
 * L18 = 20
 * L19 = 20
 *
 * المجموع = 180 سؤالاً.
 */
function buildSupplement(seed = 20260925): BankQuestion[] {
  const rng = createRng(seed);

  const all: BankQuestion[] = [
    ...generateFiveFriendSub(30, rng),
    ...generateTenFriendSub(30, rng),
    ...generateMixedOperations(40, rng),
    ...generateBigChains(40, rng),
    ...generateSquareRoots(20, rng),
    ...generateCubeRoots(20, rng),
  ];

  if (all.length !== 180) {
    throw new Error(
      `Supplement bank must contain exactly 180 questions. Current: ${all.length}`,
    );
  }

  return shuffle(all, rng);
}

/**
 * البنك التكميلي الرئيسي.
 */
export const SUPPLEMENT_BANK: readonly BankQuestion[] =
  Object.freeze(buildSupplement());

/**
 * عدد أسئلة البنك التكميلي.
 */
export const SUPPLEMENT_BANK_SIZE = SUPPLEMENT_BANK.length;