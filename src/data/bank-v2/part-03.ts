// src/data/bank-v2/part-03.ts
// القسم الثالث: L4-L5 (S16-S17)
// S16: جمع/طرح متقدم (متعدد الخانات + سلاسل)
// S17: ضرب/قسمة متقدم

import {
  makeQuestion,
  type BankQuestion,
} from "./types";

// ═══════════════════════════════════════════════════════════
// S16 — جمع/طرح متقدم (40 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS16(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  // ─── سلاسل جمع/طرح مركّبة ───
  const chains: Array<{ ops: string; operands: number[]; answer: number }> = [
    { ops: "87 + 48 − 69 + 54", operands: [87, 48, -69, 54], answer: 120 },
    { ops: "94 − 58 + 87 − 39", operands: [94, -58, 87, -39], answer: 84 },
    { ops: "156 + 89 − 97 + 68", operands: [156, 89, -97, 68], answer: 216 },
    { ops: "403 − 178 + 295 − 184", operands: [403, -178, 295, -184], answer: 336 },
    { ops: "789 + 654 − 876 + 321", operands: [789, 654, -876, 321], answer: 888 },
    { ops: "502 − 289 + 647 − 395", operands: [502, -289, 647, -395], answer: 465 },
    { ops: "931 − 564 + 782 − 499", operands: [931, -564, 782, -499], answer: 650 },
    { ops: "674 + 859 − 938 + 415", operands: [674, 859, -938, 415], answer: 1010 },
    { ops: "1000 − 437 − 286 + 514", operands: [1000, -437, -286, 514], answer: 791 },
    { ops: "845 + 377 − 689 − 198", operands: [845, 377, -689, -198], answer: 335 },
    { ops: "298 + 704 − 539 + 862", operands: [298, 704, -539, 862], answer: 1325 },
    { ops: "601 − 347 + 892 − 588", operands: [601, -347, 892, -588], answer: 558 },
    { ops: "478 + 923 − 756 + 189", operands: [478, 923, -756, 189], answer: 834 },
    { ops: "912 − 648 + 375 − 289", operands: [912, -648, 375, -289], answer: 350 },
    { ops: "539 + 864 − 728 + 495", operands: [539, 864, -728, 495], answer: 1170 },
    { ops: "700 − 324 − 189 + 615", operands: [700, -324, -189, 615], answer: 802 },
    { ops: "843 + 679 − 925 + 483", operands: [843, 679, -925, 483], answer: 1080 },
    { ops: "315 − 187 + 942 − 678", operands: [315, -187, 942, -678], answer: 392 },
    { ops: "986 − 497 − 289 + 654", operands: [986, -497, -289, 654], answer: 854 },
    { ops: "762 + 849 − 593 − 488", operands: [762, 849, -593, -488], answer: 530 },
    { ops: "458 + 937 − 684 + 291", operands: [458, 937, -684, 291], answer: 1002 },
    { ops: "1005 − 689 + 472 − 398", operands: [1005, -689, 472, -398], answer: 390 },
    { ops: "824 − 467 + 591 − 288", operands: [824, -467, 591, -288], answer: 660 },
    { ops: "369 + 852 − 471 + 698", operands: [369, 852, -471, 698], answer: 1448 },
    { ops: "915 − 388 − 297 + 542", operands: [915, -388, -297, 542], answer: 772 },
    { ops: "634 + 789 − 923 + 456", operands: [634, 789, -923, 456], answer: 956 },
    { ops: "500 − 186 − 239 + 784", operands: [500, -186, -239, 784], answer: 859 },
    { ops: "873 + 458 − 629 − 384", operands: [873, 458, -629, -384], answer: 318 },
    { ops: "246 + 975 − 483 + 612", operands: [246, 975, -483, 612], answer: 1350 },
    { ops: "704 − 389 + 526 − 418", operands: [704, -389, 526, -418], answer: 423 },
  ];

  chains.forEach((c, i) => {
    questions.push(
      makeQuestion({
        levelId: "L4",
        skillNum: 16,
        seq: i + 1,
        prompt: `${c.ops} = ؟`,
        operands: c.operands,
        operation: "addition",
        correctAnswer: c.answer,
        movement: "mixed",
        difficulty: 4,
        expectedTimeMs: 25000,
        tags: ["advanced", "chain", "multi-digit"],
      }),
    );
  });

  // ─── سلاسل بأرقام كبيرة (أسطر متعددة) ───
  const bigChains: Array<{ ops: string; operands: number[]; answer: number }> = [
    { ops: "482 + 915 + 367 − 284 − 519", operands: [482, 915, 367, -284, -519], answer: 961 },
    { ops: "7891 + 4523 − 3984 + 1605", operands: [7891, 4523, -3984, 1605], answer: 10035 },
    { ops: "6248 − 2895 + 4173 − 1956", operands: [6248, -2895, 4173, -1956], answer: 5570 },
    { ops: "359 + 842 + 617 + 490 − 725", operands: [359, 842, 617, 490, -725], answer: 1583 },
    { ops: "9054 − 3681 + 2497 − 4832", operands: [9054, -3681, 2497, -4832], answer: 3038 },
    { ops: "1284 + 5937 + 8406 − 3719", operands: [1284, 5937, 8406, -3719], answer: 11908 },
    { ops: "7462 − 4891 − 1538 + 6204", operands: [7462, -4891, -1538, 6204], answer: 7237 },
    { ops: "835 + 291 + 746 + 508 + 923", operands: [835, 291, 746, 508, 923], answer: 3303 },
    { ops: "6023 − 3849 + 7156 − 4982", operands: [6023, -3849, 7156, -4982], answer: 4348 },
    { ops: "4819 + 6372 + 1905 − 8246", operands: [4819, 6372, 1905, -8246], answer: 4850 },
  ];

  bigChains.forEach((c, i) => {
    questions.push(
      makeQuestion({
        levelId: "L4",
        skillNum: 16,
        seq: 31 + i,
        prompt: `${c.ops} = ؟`,
        operands: c.operands,
        operation: "addition",
        correctAnswer: c.answer,
        movement: "mixed",
        difficulty: 5,
        expectedTimeMs: 35000,
        tags: ["advanced", "big-chain", "4-digit"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// S17 — ضرب/قسمة متقدم (40 سؤال)
// ═══════════════════════════════════════════════════════════
function buildS17(): BankQuestion[] {
  const questions: BankQuestion[] = [];

  // ─── ضرب متقدم (20) ───
  const advancedMul: Array<[number, number]> = [
    [382, 415], [649, 287], [805, 739], [927, 564], [418, 906],
    [753, 628], [591, 843], [836, 379], [274, 952], [609, 481],
    [4821, 356], [7093, 284], [5614, 697], [8342, 419], [9158, 732],
    [3267, 845], [6409, 528], [1895, 963], [7523, 174], [4086, 639],
  ];

  advancedMul.forEach(([a, b], i) => {
    questions.push(
      makeQuestion({
        levelId: "L5",
        skillNum: 17,
        seq: i + 1,
        prompt: `${a} × ${b} = ؟`,
        operands: [a, b],
        operation: "multiplication",
        correctAnswer: a * b,
        movement: "mixed",
        difficulty: 5,
        expectedTimeMs: 45000,
        explanation: "ضرب متقدم بطريقة تاكاشي — توزيع على المنازل",
        tags: ["advanced-mul"],
      }),
    );
  });

  // ─── قسمة متقدمة (20) ───
  const advancedDiv: Array<[number, number]> = [
    [732447, 839], [346038, 642], [623348, 914], [268001, 283], [620326, 751],
    [153573, 497], [468000, 1248], [1259712, 2592], [2380560, 3815], [3522090, 4926],
    [4785656, 5704], [2001483, 6831], [3789172, 7459], [5300224, 8192], [3859204, 9367],
    [5931900, 6084], [2252250, 1234], [1789560, 2510], [3604920, 4530], [4140480, 6240],
  ];

  advancedDiv.forEach(([a, b], i) => {
    questions.push(
      makeQuestion({
        levelId: "L5",
        skillNum: 17,
        seq: 21 + i,
        prompt: `${a} ÷ ${b} = ؟`,
        operands: [a, b],
        operation: "division",
        correctAnswer: a / b,
        movement: "mixed",
        difficulty: 5,
        expectedTimeMs: 45000,
        explanation: "قسمة متقدمة — تقدير الخارج والتراجع",
        tags: ["advanced-div"],
      }),
    );
  });

  return questions;
}

// ═══════════════════════════════════════════════════════════
// التجميع
// ═══════════════════════════════════════════════════════════

export const PART_03: BankQuestion[] = [
  ...buildS16(), // 40
  ...buildS17(), // 40
];

// المجموع: 80 سؤال