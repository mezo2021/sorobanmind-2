import type {
  Problem,
  ProblemGeneratorSpec
} from "../curriculum/types";

import {
  SOROBAN_BANK,
  getQuestionsBySkill,
  getQuestionsByRule,
  bankQuestionToProblem,
  type BankQuestion
} from "../data/bank-linked";

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

/**
 * فلترة البنك وفق المواصفات.
 */
function filterBank(
  spec: ProblemGeneratorSpec
): BankQuestion[] {
  let questions =
    [...SOROBAN_BANK];

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

/**
 * توليد سؤال واحد.
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

  return bankQuestionToProblem(
    selected
  );
}

/**
 * البحث عن مهارة ضمن البنك.
 */
function getSkillQuestions(
  skillId: string
): BankQuestion[] {
  return getQuestionsBySkill(
    skillId
  );
}

/**
 * توليد جلسة من مهارة محددة.
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

  const selected: BankQuestion[] =
    [];

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
    bankQuestionToProblem
  );
}

/**
 * توليد جلسة علاجية لقاعدة معينة.
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
    getQuestionsByRule(
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
      bankQuestionToProblem(
        shuffled[
          index %
            shuffled.length
        ]
      )
  );
}

/**
 * تحويل النص إلى seed ثابت.
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