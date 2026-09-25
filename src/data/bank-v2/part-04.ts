// src/data/bank-v2/part-04.ts
// القسم الرابع: L6-L7 (S18-S20)
// S18: الأعداد العشرية
// S19: الجذور التربيعية
// S20: الجذور التكعيبية

import {
  makeQuestion,
  type BankQuestion,
} from "./types";

// ═══════════════════════════════════════════════════════════
// S18 — الأعداد العشرية (20 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS18(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  // ─── جمع/طرح عشري ───
  const addSub: Array<{ ops: string; operands: number[]; answer: number }> = [
    { ops: "48.75 + 39.68 − 25.43", operands: [48.75, 39.68, -25.43], answer: 63.0 },
    { ops: "156.4 − 89.75 + 43.82", operands: [156.4, -89.75, 43.82], answer: 110.47 },
    { ops: "812.7 − 438.95 + 165.48", operands: [812.7, -438.95, 165.48], answer: 539.23 },
    { ops: "98.42 − 57.89 + 13.67 − 24.15", operands: [98.42, -57.89, 13.67, -24.15], answer: 30.05 },
    { ops: "34.5 + 27.8 − 15.6", operands: [34.5, 27.8, -15.6], answer: 46.7 },
  ];

  addSub.forEach((c, i) => {
    questions.push(
      makeQuestion({
        levelId: "L6",
        skillNum: 18,
        seq: i + 1,
        prompt: `${c.ops} = ؟`,
        operands: c.operands,
        operation: "addition",
        correctAnswer: c.answer,
        movement: "mixed",
        difficulty: 4,
        expectedTimeMs: 30000,
        explanation: "محاذاة الفاصلة العشرية ثم الجمع/الطرح",
        tags: ["decimal", "add-sub"],
      }),
    );
  });

  // ─── ضرب عشري ───
  const mul: Array<[number, number]> = [
    [74.8, 3.6], [82.5, 0.47], [9.36, 5.8], [34.56, 1.25],
    [0.825, 6.4], [7.29, 8.5], [1.5, 2.4], [3.14, 2.5],
    [0.7, 0.9], [0.06, 0.8], [0.05, 0.03], [2.4, 0.05],
    [0.45, 0.2], [0.25, 0.6], [1.2, 1.5],
  ];

  mul.forEach(([a, b], i) => {
    const answer = parseFloat((a * b).toFixed(6));
    questions.push(
      makeQuestion({
        levelId: "L6",
        skillNum: 18,
        seq: 6 + i,
        prompt: `${a} × ${b} = ؟`,
        operands: [a, b],
        operation: "multiplication",
        correctAnswer: answer,
        movement: "mixed",
        difficulty: 4,
        expectedTimeMs: 35000,
        explanation: "ضرب عشري — قاعدة عمود البداية (تاكاشي)",
        tags: ["decimal", "multiplication"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S19 — الجذور التربيعية (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS19(): BankQuestion[] {
  const roots: number[] = [
    // من 11 إلى 35
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35,
  ];

  return roots.map((root, i) => {
    const square = root * root;
    return makeQuestion({
      levelId: "L7",
      skillNum: 19,
      seq: i + 1,
      prompt: `√${square} = ؟`,
      operands: [square],
      operation: "read",
      correctAnswer: root,
      movement: "mixed",
      difficulty: 5,
      expectedTimeMs: 35000,
      explanation: `الجذر التربيعي لـ ${square} = ${root} (لأن ${root}² = ${square})`,
      tags: ["sqrt", "square-root"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S20 — الجذور التكعيبية (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS20(): BankQuestion[] {
  const roots: number[] = [
    // من 5 إلى 29
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    25, 26, 27, 28, 29,
  ];

  return roots.map((root, i) => {
    const cube = root * root * root;
    return makeQuestion({
      levelId: "L7",
      skillNum: 20,
      seq: i + 1,
      prompt: `∛${cube} = ؟`,
      operands: [cube],
      operation: "read",
      correctAnswer: root,
      movement: "mixed",
      difficulty: 5,
      expectedTimeMs: 45000,
      explanation: `الجذر التكعيبي لـ ${cube} = ${root} (لأن ${root}³ = ${cube})`,
      tags: ["cbrt", "cube-root"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// التجميع
// ═══════════════════════════════════════════════════════════

export const PART_04: BankQuestion[] = [
  ...buildS18(), // 20
  ...buildS19(), // 25
  ...buildS20(), // 25
];

// المجموع: 70 سؤال