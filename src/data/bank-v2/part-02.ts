// src/data/bank-v2/part-02.ts
// القسم الثاني: L2-L3 (S10-S15)
// S10: الضرب 2 منازل × 1 رقم
// S11: الضرب 2 منازل × 2 منازل
// S12: الضرب 3+ منازل × منازل
// S13: القسمة ÷ رقم واحد
// S14: القسمة ÷ رقمين
// S15: القسمة ÷ 3 أرقام

import {
  makeQuestion,
  type BankQuestion,
  type Difficulty,
} from "./types";

// ═══════════════════════════════════════════════════════════
// S10 — الضرب: 2 منازل × 1 رقم (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS10(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [12, 3], [13, 4], [14, 5], [15, 6], [16, 7],
    [17, 8], [18, 9], [21, 3], [22, 4], [23, 5],
    [24, 6], [25, 7], [26, 8], [27, 9], [31, 4],
    [32, 5], [33, 6], [34, 7], [35, 8], [36, 9],
    [42, 3], [43, 4], [52, 5], [62, 8], [83, 6],
  ];

  return cases.map(([a, b], i) => {
    const answer = a * b;
    return makeQuestion({
      levelId: "L2",
      skillNum: 10,
      seq: i + 1,
      prompt: `${a} × ${b} = ؟`,
      operands: [a, b],
      operation: "multiplication",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 2,
      expectedTimeMs: 15000,
      explanation: `${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b} = ${answer}`,
      tags: ["multiplication", "2x1"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S11 — الضرب: 2 منازل × 2 منازل (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS11(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [12, 11], [12, 12], [13, 11], [14, 12], [15, 13],
    [16, 11], [18, 12], [21, 13], [22, 14], [23, 15],
    [24, 11], [25, 12], [26, 13], [32, 12], [34, 11],
    [36, 15], [42, 21], [44, 22], [46, 31], [52, 12],
    [56, 24], [58, 31], [62, 18], [72, 15], [78, 46],
  ];

  return cases.map(([a, b], i) => {
    const answer = a * b;
    return makeQuestion({
      levelId: "L2",
      skillNum: 11,
      seq: i + 1,
      prompt: `${a} × ${b} = ؟`,
      operands: [a, b],
      operation: "multiplication",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 3,
      expectedTimeMs: 25000,
      explanation: `${Math.floor(a / 10)}0×${b} + ${a % 10}×${b} (بطريقة تاكاشي)`,
      tags: ["multiplication", "2x2"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S12 — الضرب: 3+ منازل × منازل (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS12(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [123, 3], [234, 4], [345, 5], [456, 6], [567, 7],
    [678, 8], [789, 9], [312, 3], [421, 4], [532, 5],
    [643, 6], [754, 7], [865, 8], [976, 9], [364, 59],
    [807, 64], [529, 78], [946, 83], [618, 95], [472, 36],
    [1836, 45], [2947, 38], [4059, 67], [6382, 54], [4821, 356],
  ];

  return cases.map(([a, b], i) => {
    const answer = a * b;
    return makeQuestion({
      levelId: "L2",
      skillNum: 12,
      seq: i + 1,
      prompt: `${a} × ${b} = ؟`,
      operands: [a, b],
      operation: "multiplication",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 4,
      expectedTimeMs: 35000,
      explanation: "توزيع الضرب على المنازل وجمع النواتج الجزئية",
      tags: ["multiplication", "3x1", "advanced"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S13 — القسمة ÷ رقم واحد (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS13(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [84, 4], [96, 3], [92, 4], [88, 8], [75, 5],
    [63, 3], [72, 6], [48, 6], [56, 7], [81, 9],
    [144, 6], [168, 8], [126, 7], [152, 8], [196, 4],
    [225, 5], [252, 6], [312, 4], [357, 7], [432, 8],
    [540, 9], [612, 6], [735, 5], [816, 8], [945, 9],
  ];

  return cases.map(([a, b], i) => {
    const answer = a / b;
    return makeQuestion({
      levelId: "L3",
      skillNum: 13,
      seq: i + 1,
      prompt: `${a} ÷ ${b} = ؟`,
      operands: [a, b],
      operation: "division",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 3,
      expectedTimeMs: 15000,
      explanation: "تقدير الخارج ثم الضرب والطرح المتتالي",
      tags: ["division", "1-digit"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S14 — القسمة ÷ رقمين (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS14(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [3456, 48], [5824, 64], [7138, 83], [4992, 52], [6132, 73],
    [2916, 36], [8544, 96], [5304, 68], [3915, 45], [9216, 96],
    [18768, 48], [34884, 57], [51824, 79], [28944, 36], [67956, 84],
    [43968, 96], [19712, 32], [58955, 65], [76440, 98], [31836, 42],
    [12852, 42], [27648, 64], [35721, 63], [45696, 68], [58320, 81],
  ];

  return cases.map(([a, b], i) => {
    const answer = a / b;
    return makeQuestion({
      levelId: "L3",
      skillNum: 14,
      seq: i + 1,
      prompt: `${a} ÷ ${b} = ؟`,
      operands: [a, b],
      operation: "division",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 4,
      expectedTimeMs: 30000,
      explanation: "قسمة على مقسوم من رقمين — التقدير والتعديل",
      tags: ["division", "2-digit"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// S15 — القسمة ÷ 3 أرقام (25 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS15(): BankQuestion[] {
  const cases: Array<[number, number]> = [
    [147875, 325], [298688, 416], [418600, 575], [583680, 768], [732447, 839],
    [346038, 642], [623348, 914], [268001, 283], [620326, 751], [153573, 497],
    [468000, 1248], [1259712, 2592], [2380560, 3815], [3522090, 4926], [4785656, 5704],
    [2001483, 6831], [3789172, 7459], [5300224, 8192], [3859204, 9367], [5931900, 6084],
    [2252250, 1234], [1789560, 2510], [3604920, 4530], [4140480, 6240], [4914000, 7560],
  ];

  return cases.map(([a, b], i) => {
    const answer = a / b;
    return makeQuestion({
      levelId: "L3",
      skillNum: 15,
      seq: i + 1,
      prompt: `${a} ÷ ${b} = ؟`,
      operands: [a, b],
      operation: "division",
      correctAnswer: answer,
      movement: "mixed",
      difficulty: 5,
      expectedTimeMs: 45000,
      explanation: "قسمة على مقسوم من 3 أرقام — تاكاشي المتقدم",
      tags: ["division", "3-digit", "advanced"],
    });
  });
}

// ═══════════════════════════════════════════════════════════
// التجميع
// ═══════════════════════════════════════════════════════════

export const PART_02: BankQuestion[] = [
  ...buildS10(), // 25
  ...buildS11(), // 25
  ...buildS12(), // 25
  ...buildS13(), // 25
  ...buildS14(), // 25
  ...buildS15(), // 25
];

// المجموع: 150 سؤال