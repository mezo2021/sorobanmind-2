// src/data/bank-v2/part-01.ts
// القسم الأول: L0-L1 (S1-S9)
// S1: تمثيل 0-9
// S2: القيمة المكانية
// S3: الجمع المباشر
// S4: الطرح المباشر
// S5: أصدقاء 5 — جمع
// S6: أصدقاء 5 — طرح
// S7: أصدقاء 10 — جمع
// S8: أصدقاء 10 — طرح
// S9: جمع/طرح مختلط

import {
  makeQuestion,
  createRng,
  randInt,
  hasCarry,
  hasBorrow,
  complementTo10,
  classifyAdd,
  classifySub,
  type BankQuestion,
  type Difficulty,
} from "./types";

// ═══════════════════════════════════════════════════════════
// S1 — تمثيل الأرقام 0-9 (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS1(): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const rng = createRng(1001);

  // أسئلة التمثيل: أي رقم يمثل هذا؟
  const reps: Array<{ prompt: string; answer: number }> = [
    { prompt: "العلوية فقط = ؟", answer: 5 },
    { prompt: "العلوية + 1 سفلية = ؟", answer: 6 },
    { prompt: "العلوية + 2 سفلية = ؟", answer: 7 },
    { prompt: "العلوية + 3 سفلية = ؟", answer: 8 },
    { prompt: "العلوية + 4 سفلية = ؟", answer: 9 },
    { prompt: "1 سفلية فقط = ؟", answer: 1 },
    { prompt: "2 سفلية فقط = ؟", answer: 2 },
    { prompt: "3 سفلية فقط = ؟", answer: 3 },
    { prompt: "4 سفلية فقط = ؟", answer: 4 },
    { prompt: "لا شيء مرفوع = ؟", answer: 0 },
    { prompt: "قيمة الخرزة العلوية = ؟", answer: 5 },
    { prompt: "قيمة الخرزة السفلية = ؟", answer: 1 },
    { prompt: "أقصى قيمة في عمود واحد = ؟", answer: 9 },
    { prompt: "أدنى قيمة في عمود واحد = ؟", answer: 0 },
  ];

  reps.forEach((r, i) => {
    questions.push(
      makeQuestion({
        levelId: "L0",
        skillNum: 1,
        seq: i + 1,
        prompt: r.prompt,
        operands: [r.answer],
        operation: "read",
        correctAnswer: r.answer,
        movement: "direct",
        difficulty: 1,
        expectedTimeMs: 5000,
        tags: ["representation", "0-9"],
      }),
    );
  });

  // أسئلة "مثّل الرقم X"
  for (let n = 0; n <= 9; n += 1) {
    questions.push(
      makeQuestion({
        levelId: "L0",
        skillNum: 1,
        seq: 20 + n,
        prompt: `مثّل الرقم ${n} على العداد`,
        operands: [n],
        operation: "build",
        correctAnswer: n,
        movement: "direct",
        difficulty: 1,
        expectedTimeMs: 6000,
        tags: ["representation", "build"],
      }),
    );
  }

  // سؤال إضافي
  questions.push(
    makeQuestion({
      levelId: "L0",
      skillNum: 1,
      seq: 30,
      prompt: "كم خرزة سفلية تحتاج لتمثيل 3؟",
      operands: [3],
      operation: "read",
      correctAnswer: 3,
      movement: "direct",
      difficulty: 1,
      expectedTimeMs: 5000,
      tags: ["representation", "lower-beads"],
    }),
  );

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S2 — القيمة المكانية (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS2(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  // أسئلة قيم المنازل
  const placeQuestions: Array<{ prompt: string; answer: number }> = [
    { prompt: "قيمة الخرزة في منزلة الآحاد = ؟", answer: 1 },
    { prompt: "قيمة الخرزة في منزلة العشرات = ؟", answer: 10 },
    { prompt: "قيمة الخرزة في منزلة المئات = ؟", answer: 100 },
    { prompt: "قيمة الخرزة في منزلة الآلاف = ؟", answer: 1000 },
    { prompt: "1 في العشرات + 0 في الآحاد = ؟", answer: 10 },
    { prompt: "2 في العشرات + 5 في الآحاد = ؟", answer: 25 },
    { prompt: "4 في العشرات + 7 في الآحاد = ؟", answer: 47 },
    { prompt: "1 في المئات = ؟", answer: 100 },
    { prompt: "1 في المئات + 3 في العشرات + 4 في الآحاد = ؟", answer: 134 },
    { prompt: "أين يقع الآحاد على العداد؟ (رقم العمود من اليمين)", answer: 1 },
    { prompt: "أين يقع العشرات؟ (رقم العمود من اليمين)", answer: 2 },
    { prompt: "أين يقع المئات؟ (رقم العمود من اليمين)", answer: 3 },
    { prompt: "أين يقع الآلاف؟ (رقم العمود من اليمين)", answer: 4 },
    { prompt: "50 = 5 في أي منزلة؟ (1=آحاد, 2=عشرات, 3=مئات)", answer: 2 },
    { prompt: "300 = 3 في أي منزلة؟ (1=آحاد, 2=عشرات, 3=مئات)", answer: 3 },
    { prompt: "ما الرقم الذي يمثله: 3 عشرات + 0 آحاد؟", answer: 30 },
    { prompt: "ما الرقم الذي يمثله: 5 عشرات + 5 آحاد؟", answer: 55 },
    { prompt: "ما الرقم الذي يمثله: 2 مئات + 1 عشرات + 3 آحاد؟", answer: 213 },
    { prompt: "ما الرقم الذي يمثله: 9 مئات + 9 عشرات + 9 آحاد؟", answer: 999 },
    { prompt: "كم يساوي 1 في العشرات + 1 في المئات؟", answer: 110 },
  ];

  placeQuestions.forEach((q, i) => {
    questions.push(
      makeQuestion({
        levelId: "L0",
        skillNum: 2,
        seq: i + 1,
        prompt: q.prompt,
        operands: [q.answer],
        operation: "read",
        correctAnswer: q.answer,
        movement: "direct",
        difficulty: 2,
        expectedTimeMs: 7000,
        tags: ["place-value"],
      }),
    );
  });

  // أسئلة "مثّل الرقم"
  const buildNumbers = [10, 12, 21, 34, 47, 55, 100, 123];
  buildNumbers.forEach((n, i) => {
    questions.push(
      makeQuestion({
        levelId: "L0",
        skillNum: 2,
        seq: 30 + i,
        prompt: `مثّل الرقم ${n} على العداد`,
        operands: [n],
        operation: "build",
        correctAnswer: n,
        movement: "direct",
        difficulty: 2,
        expectedTimeMs: 10000,
        tags: ["place-value", "build"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S3 — الجمع المباشر (30 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS3(): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const rng = createRng(1003);
  const used = new Set<string>();

  // جمع مباشر: (c%5) + d <= 4
  const cases: Array<[number, number]> = [
    [1, 1], [1, 2], [1, 3], [2, 1], [2, 2],
    [3, 1], [5, 1], [5, 2], [5, 3], [5, 4],
    [6, 1], [6, 2], [6, 3], [7, 1], [7, 2],
    [8, 1], [12, 1], [12, 2], [13, 1], [14, 2],
    [21, 1], [22, 2], [23, 1], [31, 3], [32, 2],
    [41, 2], [51, 1], [52, 2], [61, 3], [100, 5],
  ];

  cases.forEach(([a, b], i) => {
    const key = `${a}+${b}`;
    if (used.has(key)) return;
    used.add(key);

    const answer = a + b;
    const movement = classifyAdd(a, b);

    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 3,
        seq: i + 1,
        prompt: `${a} + ${b} = ؟`,
        operands: [a, b],
        operation: "addition",
        correctAnswer: answer,
        movement,
        difficulty: 1,
        expectedTimeMs: 5000,
        tags: ["direct-add", hasCarry(a, b) ? "carry" : "no-carry"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S4 — الطرح المباشر (30 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS4(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  const cases: Array<[number, number]> = [
    [3, 1], [4, 1], [4, 2], [5, 1], [5, 2], [5, 3], [5, 4],
    [6, 1], [7, 2], [8, 3], [9, 4], [9, 2],
    [13, 1], [14, 2], [15, 3], [16, 1], [18, 2],
    [22, 1], [23, 2], [25, 3], [31, 1], [33, 2],
    [42, 1], [44, 2], [55, 4], [67, 2], [78, 3],
    [100, 1], [150, 50], [200, 100],
  ];

  cases.forEach(([a, b], i) => {
    const answer = a - b;
    if (answer < 0) return;
    const movement = classifySub(a, b);

    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 4,
        seq: i + 1,
        prompt: `${a} − ${b} = ؟`,
        operands: [a, -b],
        operation: "subtraction",
        correctAnswer: answer,
        movement,
        difficulty: 1,
        expectedTimeMs: 5000,
        tags: ["direct-sub", hasBorrow(a, b) ? "borrow" : "no-borrow"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S5 — أصدقاء 5 — جمع (35 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS5(): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const rng = createRng(1005);

  // أصدقاء 5: current < 5، d >= 1، current + d >= 5، current + d <= 9
  const validCombos: Array<[number, number]> = [
    [1, 4], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4],
    [4, 1], [4, 2], [4, 3], [4, 4],
    [11, 4], [12, 3], [13, 2], [14, 1],
    [21, 3], [22, 2], [23, 1], [24, 1],
    [31, 2], [32, 1], [33, 2], [34, 1],
    [41, 3], [42, 2], [43, 1], [44, 1],
    [100, 4], [101, 3], [102, 2], [103, 1],
    [110, 4], [111, 3], [120, 2], [130, 1],
    [5, 4], // 5+4 = 9, five-friend-add
  ];

  validCombos.forEach(([a, b], i) => {
    if (i >= 35) return;
    const answer = a + b;
    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 5,
        seq: i + 1,
        prompt: `${a} + ${b} = ؟`,
        operands: [a, b],
        operation: "addition",
        correctAnswer: answer,
        movement: "five-friend-add",
        difficulty: 2,
        expectedTimeMs: 8000,
        explanation: `+${b} = +5 − ${5 - b}`,
        tags: ["five-friend-add"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S6 — أصدقاء 5 — طرح (35 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS6(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  const cases: Array<[number, number]> = [
    [5, 1], [5, 2], [5, 3], [5, 4],
    [6, 2], [6, 3], [6, 4],
    [7, 3], [7, 4], [8, 4],
    [15, 1], [15, 2], [16, 2], [17, 3], [18, 4],
    [25, 1], [25, 2], [26, 3], [27, 4],
    [35, 2], [35, 3], [36, 4],
    [45, 1], [45, 2], [46, 3], [47, 4],
    [105, 1], [106, 2], [107, 3], [108, 4],
    [115, 2], [116, 3], [125, 4],
    [205, 1], [206, 2], [207, 3],
  ];

  cases.forEach(([a, b], i) => {
    if (i >= 35) return;
    const answer = a - b;
    if (answer < 0) return;
    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 6,
        seq: i + 1,
        prompt: `${a} − ${b} = ؟`,
        operands: [a, -b],
        operation: "subtraction",
        correctAnswer: answer,
        movement: "five-friend-sub",
        difficulty: 2,
        expectedTimeMs: 8000,
        explanation: `−${b} = −5 + ${5 - b}`,
        tags: ["five-friend-sub"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S7 — أصدقاء 10 — جمع (35 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS7(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  const cases: Array<[number, number]> = [
    [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9],
    [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9],
    [7, 3], [7, 4], [7, 5], [7, 6], [7, 7], [7, 8], [7, 9],
    [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9],
    [5, 5], [5, 6], [5, 7], [5, 8], [5, 9],
  ];

  cases.forEach(([a, b], i) => {
    const answer = a + b;
    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 7,
        seq: i + 1,
        prompt: `${a} + ${b} = ؟`,
        operands: [a, b],
        operation: "addition",
        correctAnswer: answer,
        movement: "ten-friend-add",
        difficulty: 3,
        expectedTimeMs: 8000,
        explanation: `+${b} = +10 − ${complementTo10(b)}`,
        tags: ["ten-friend-add"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S8 — أصدقاء 10 — طرح (35 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS8(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  const cases: Array<[number, number]> = [
    [10, 1], [10, 2], [10, 3], [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9],
    [11, 2], [11, 3], [11, 4], [11, 5], [11, 6], [11, 7], [11, 8], [11, 9],
    [12, 3], [12, 4], [12, 5], [12, 6], [12, 7], [12, 8], [12, 9],
    [13, 4], [13, 5], [13, 6], [13, 7], [13, 8], [13, 9],
    [14, 5], [14, 6], [14, 7], [14, 8], [14, 9],
  ];

  cases.forEach(([a, b], i) => {
    const answer = a - b;
    if (answer < 0) return;
    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 8,
        seq: i + 1,
        prompt: `${a} − ${b} = ؟`,
        operands: [a, -b],
        operation: "subtraction",
        correctAnswer: answer,
        movement: "ten-friend-sub",
        difficulty: 3,
        expectedTimeMs: 8000,
        explanation: `−${b} = −10 + ${complementTo10(b)}`,
        tags: ["ten-friend-sub"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S9 — جمع/طرح مختلط (30 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS9(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  const chains: Array<{ ops: string; operands: number[]; answer: number }> = [
    { ops: "2 + 2 + 5", operands: [2, 2, 5], answer: 9 },
    { ops: "3 + 4 + 2", operands: [3, 4, 2], answer: 9 },
    { ops: "5 + 4 − 2", operands: [5, 4, -2], answer: 7 },
    { ops: "7 + 3 − 5", operands: [7, 3, -5], answer: 5 },
    { ops: "8 − 5 + 3", operands: [8, -5, 3], answer: 6 },
    { ops: "9 − 4 − 2", operands: [9, -4, -2], answer: 3 },
    { ops: "4 + 5 + 2", operands: [4, 5, 2], answer: 11 },
    { ops: "12 + 4 − 3", operands: [12, 4, -3], answer: 13 },
    { ops: "15 − 4 + 2", operands: [15, -4, 2], answer: 13 },
    { ops: "18 − 9 + 5", operands: [18, -9, 5], answer: 14 },
    { ops: "20 − 5 − 5", operands: [20, -5, -5], answer: 10 },
    { ops: "25 + 3 − 8", operands: [25, 3, -8], answer: 20 },
    { ops: "3 + 4 + 5 − 2", operands: [3, 4, 5, -2], answer: 10 },
    { ops: "7 + 3 + 4 − 5", operands: [7, 3, 4, -5], answer: 9 },
    { ops: "9 + 2 + 4 − 5", operands: [9, 2, 4, -5], answer: 10 },
    { ops: "12 + 8 − 5 − 3", operands: [12, 8, -5, -3], answer: 12 },
    { ops: "15 − 5 + 8 − 3", operands: [15, -5, 8, -3], answer: 15 },
    { ops: "20 − 8 + 5 − 2", operands: [20, -8, 5, -2], answer: 15 },
    { ops: "25 + 5 − 10 + 3", operands: [25, 5, -10, 3], answer: 23 },
    { ops: "30 − 10 − 5 + 2", operands: [30, -10, -5, 2], answer: 17 },
    { ops: "50 + 20 − 15 + 5", operands: [50, 20, -15, 5], answer: 60 },
    { ops: "100 − 30 + 20 − 10", operands: [100, -30, 20, -10], answer: 80 },
    { ops: "5 + 6 + 7 − 8", operands: [5, 6, 7, -8], answer: 10 },
    { ops: "8 + 9 − 7 + 4", operands: [8, 9, -7, 4], answer: 14 },
    { ops: "7 + 8 + 5 − 6", operands: [7, 8, 5, -6], answer: 14 },
    { ops: "9 + 6 + 3 − 8", operands: [9, 6, 3, -8], answer: 10 },
    { ops: "13 + 7 − 5 + 4", operands: [13, 7, -5, 4], answer: 19 },
    { ops: "24 + 6 − 15 + 10", operands: [24, 6, -15, 10], answer: 25 },
    { ops: "35 + 5 − 20 + 15", operands: [35, 5, -20, 15], answer: 35 },
    { ops: "45 − 15 + 5 − 10", operands: [45, -15, 5, -10], answer: 25 },
  ];

  chains.forEach((c, i) => {
    questions.push(
      makeQuestion({
        levelId: "L1",
        skillNum: 9,
        seq: i + 1,
        prompt: `${c.ops} = ؟`,
        operands: c.operands,
        operation: "addition",
        correctAnswer: c.answer,
        movement: "mixed",
        difficulty: 3,
        expectedTimeMs: 12000,
        tags: ["mixed", "chain"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// التجميع
// ═══════════════════════════════════════════════════════════

export const PART_01: BankQuestion[] = [
  ...buildS1(),  // 31
  ...buildS2(),  // 28
  ...buildS3(),  // 30
  ...buildS4(),  // ~28
  ...buildS5(),  // 35
  ...buildS6(),  // 35
  ...buildS7(),  // 35
  ...buildS8(),  // ~33
  ...buildS9(),  // 30
];