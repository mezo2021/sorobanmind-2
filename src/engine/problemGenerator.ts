// ═══════════════════════════════════════════════════════════════════
// 🎲 src/engine/problemGenerator.ts — مولّد المسائل والجلسات
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - توليد مسألة واحدة (generateProblem)
//   - توليد جلسة من مهارة (generateSession)
//   - توليد جلسة علاجية لقاعدة (generateRuleSession)
//   - أدوات مساعدة: randomInt · shuffle · createRng
//
// 🚨 ارتباطات حرجة (SRB Migration Points):
//
//   ⚠️⚠️⚠️ الملف يستورد من "../data/bank-linked" ⚠️⚠️⚠️
//
//   📋 ما يُستورد حاليًا:
//     1. SOROBAN_BANK          → يُستبدل بـ SRB.getAll()
//     2. getQuestionsBySkill   → يُستبدل بـ SRB.getBySkill()
//     3. getQuestionsByRule    → يُستبدل بـ SRB.getByRule()
//     4. bankQuestionToProblem → يُستبدل بـ SRB.toProblem()
//     5. type BankQuestion     → يُستبدل بـ SRBQuestion
//
//   🔗 خطة الربط المستقبلي (SRB - المرحلة 5):
//     1. بناء src/data/srb/ كاملًا
//     2. بناء src/data/srb-adapter.ts
//     3. استبدال import من bank-linked → srb-adapter
//     4. اختبار شامل
//     5. حذف bank-linked نهائيًا
//
// 📥 الاعتماديات الأخرى:
//   - ../curriculum/types (العقد الأساسي ✅)
//
// 📤 الصادرات الرئيسية:
//   - randomInt()
//   - shuffle()
//   - generateProblem()
//   - generateSession()
//   - generateRuleSession()
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + علامات SRB-MIGRATION
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

import type {
  Problem,
  ProblemGeneratorSpec
} from "../curriculum/types";

// 🔗 SRB-MIGRATION: هذا الاستيراد سيُستبدل لاحقًا بـ srb-adapter
//    مؤقتًا: bank-linked
//    المستقبل: ../data/srb-adapter
import {
  SOROBAN_BANK,           // 🔗 يُستبدل بـ SRB.getAll()
  getQuestionsBySkill,    // 🔗 يُستبدل بـ SRB.getBySkill()
  getQuestionsByRule,     // 🔗 يُستبدل بـ SRB.getByRule()
  bankQuestionToProblem,  // 🔗 يُستبدل بـ SRB.toProblem()
  type BankQuestion       // 🔗 يُستبدل بـ SRBQuestion
} from "../data/bank-linked";

// ═══════════════════════════════════════════════════════════════════
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════════════

/**
 * مولد عشوائي قابل لإعادة الإنتاج.
 */
function createRng(
  seed?: number
): () => number {
  if (
    seed === undefined ||
    !Number.isFinite(seed)
  ) {
    return Math.random;
  }

  let value =
    Math.trunc(seed) >>> 0;

  return (): number => {
    value += 0x6d2b79f5;

    let t = value;

    t = Math.imul(
      t ^ (t >>> 15),
      t | 1
    );

    t ^= t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61
      );

    return (
      (t ^ (t >>> 14)) >>> 0
    ) / 4294967296;
  };
}

/**
 * توليد رقم صحيح.
 */
export function randomInt(
  min: number,
  max: number,
  rng: () => number = Math.random
): number {
  if (min > max) {
    throw new RangeError(
      "min cannot be greater than max"
    );
  }

  return Math.floor(
    rng() *
      (max - min + 1)
  ) + min;
}

/**
 * خلط آمن.
 */
export function shuffle<T>(
  values: T[],
  rng: () => number = Math.random
): T[] {
  const result = [...values];

  for (
    let index = result.length - 1;
    index > 0;
    index -= 1
  ) {
    const target =
      Math.floor(
        rng() *
          (index + 1)
      );

    [
      result[index],
      result[target]
    ] = [
      result[target],
      result[index]
    ];
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════
// 🔍 فلترة البنك
// ═══════════════════════════════════════════════════════════════════

/**
 * فلترة البنك وفق المواصفات.
 *
 * 🔗 SRB-MIGRATION: يعتمد على SOROBAN_BANK من bank-linked
 */
function filterBank(
  spec: ProblemGeneratorSpec
): BankQuestion[] {  // 🔗 SRB
  let questions =
    [...SOROBAN_BANK];  // 🔗 SRB.getAll()

  const constraints =
    spec.constraints;

  if (
    constraints.skillId
  ) {
    questions =
      questions.filter(
        question =>
          question.skillId ===
          constraints.skillId
      );
  }

  if (
    constraints.min !== undefined
  ) {
    questions =
      questions.filter(
        question =>
          question.correctAnswer >=
          constraints.min!
      );
  }

  if (
    constraints.max !== undefined
  ) {
    questions =
      questions.filter(
        question =>
          question.correctAnswer <=
          constraints.max!
      );
  }

  if (
    constraints.allowedNumbers
      ?.length
  ) {
    const allowed =
      new Set(
        constraints.allowedNumbers
      );

    questions =
      questions.filter(
        question =>
          allowed.has(
            question.correctAnswer
          )
      );
  }

  if (
    constraints.difficulty !==
    undefined
  ) {
    questions =
      questions.filter(
        question =>
          question.difficulty ===
          constraints.difficulty
      );
  }

  if (
    constraints.movementTypes
      ?.length
  ) {
    const movements =
      new Set(
        constraints.movementTypes
      );

    questions =
      questions.filter(
        question =>
          movements.has(
            question.movement
          )
      );
  }

  return questions;
}

// ═══════════════════════════════════════════════════════════════════
// 🎯 توليد المسائل
// ═══════════════════════════════════════════════════════════════════

/**
 * توليد سؤال واحد.
 *
 * 🔗 SRB-MIGRATION: يعتمد على SOROBAN_BANK + bankQuestionToProblem
 */
export function generateProblem(
  spec: ProblemGeneratorSpec
): Problem {
  const rng =
    createRng(spec.seed);

  const bank =
    filterBank(spec);

  if (bank.length === 0) {
    throw new Error(
      "No question matches the requested generator constraints."
    );
  }

  const selected =
    bank[
      randomInt(
        0,
        bank.length - 1,
        rng
      )
    ];

  return bankQuestionToProblem(  // 🔗 SRB.toProblem()
    selected
  );
}

/**
 * البحث عن مهارة ضمن البنك.
 *
 * 🔗 SRB-MIGRATION: يعتمد على getQuestionsBySkill
 */
function getSkillQuestions(
  skillId: string
): BankQuestion[] {  // 🔗 SRB
  return getQuestionsBySkill(  // 🔗 SRB.getBySkill()
    skillId
  );
}

/**
 * توليد جلسة من مهارة محددة.
 *
 * 🔗 SRB-MIGRATION: يعتمد على getQuestionsBySkill + bankQuestionToProblem
 */
export function generateSession(
  skillId: string,
  count: number
): Problem[] {
  if (
    count <= 0 ||
    !Number.isInteger(count)
  ) {
    throw new RangeError(
      "count must be a positive integer"
    );
  }

  const questions =
    getSkillQuestions(
      skillId
    );

  if (questions.length === 0) {
    throw new Error(
      `No questions found for skill ${skillId}.`
    );
  }

  const rng =
    createRng(
      hashSkillId(skillId)
    );

  const shuffled =
    shuffle(
      questions,
      rng
    );

  const selected: BankQuestion[] = [];  // 🔗 SRB

  for (
    let index = 0;
    index < count;
    index += 1
  ) {
    selected.push(
      shuffled[
        index %
          shuffled.length
      ]
    );
  }

  return selected.map(
    bankQuestionToProblem  // 🔗 SRB.toProblem()
  );
}

/**
 * توليد جلسة علاجية لقاعدة معينة.
 *
 * 🔗 SRB-MIGRATION: يعتمد على getQuestionsByRule + bankQuestionToProblem
 */
export function generateRuleSession(
  ruleId: string,
  count: number
): Problem[] {
  if (
    count <= 0 ||
    !Number.isInteger(count)
  ) {
    throw new RangeError(
      "count must be a positive integer"
    );
  }

  const questions =
    getQuestionsByRule(  // 🔗 SRB.getByRule()
      ruleId
    );

  if (questions.length === 0) {
    throw new Error(
      `No questions found for rule ${ruleId}.`
    );
  }

  const rng =
    createRng(
      hashSkillId(ruleId)
    );

  const shuffled =
    shuffle(
      questions,
      rng
    );

  return Array.from(
    { length: count },
    (_, index) =>
      bankQuestionToProblem(  // 🔗 SRB.toProblem()
        shuffled[
          index %
            shuffled.length
        ]
      )
  );
}

/**
 * تحويل النص إلى seed ثابت.
 *
 * ✅ لا يعتمد على bank — نظيف
 */
function hashSkillId(
  value: string
): number {
  let hash = 2166136261;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(
      index
    );

    hash =
      Math.imul(
        hash,
        16777619
      );
  }

  return hash >>> 0;
}