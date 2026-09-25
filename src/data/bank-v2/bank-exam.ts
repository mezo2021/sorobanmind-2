// src/data/bank-v2/bank-exam.ts
// بنك الامتحانات النهائية
// ═══════════════════════════════════════════════════════════
// EXAM_1 (الصغار): 20 سؤالاً — من raw-01 → raw-04
// EXAM_2 (الكبار): 40 سؤالاً — من raw-05 → raw-07
// ═══════════════════════════════════════════════════════════
// معيار الاختيار: الأسئلة الأطول (عدد الحدود الأكبر)
// لا يشمل: الأعداد السالبة (S7, S16 من raw القديمة)

import { RAW_QUESTIONS_01 } from "../bank-raw/raw-01";
import { RAW_QUESTIONS_02 } from "../bank-raw/raw-02";
import { RAW_QUESTIONS_03 } from "../bank-raw/raw-03";
import { RAW_QUESTIONS_04 } from "../bank-raw/raw-04";
import { RAW_QUESTIONS_05 } from "../bank-raw/raw-05";
import { RAW_QUESTIONS_06 } from "../bank-raw/raw-06";
import { RAW_QUESTIONS_07 } from "../bank-raw/raw-07";
import type { RawQuestion } from "../bank-raw/types";

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

export interface ExamQuestion {
  /** معرّف: EX1-S3-001 أو EX2-S16-001 */
  id: string;
  /** المهارة: S1-S20 */
  skillId: string;
  /** المستوى: L0-L7 */
  levelId: string;
  /** نص السؤال */
  prompt: string;
  /** الإجابة */
  correctAnswer: number;
  /** عدد الحدود (للتشخيص) */
  termCount: number;
  /** شرح الحل */
  explanation: string;
  /** كلمات مفتاحية */
  tags: string[];
}

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * حساب عدد الحدود في سؤال (عمليات + -).
 */
function countTerms(question: string): number {
  const clean = question.replace(/^[−-]/, "");
  const matches = clean.match(/[+\-−]/g);
  return (matches?.length ?? 0) + 1;
}

/**
 * استخراج الإجابة من نص.
 */
function parseResult(result: string): number {
  const clean = result
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[−–—]/g, "-")
    .trim();
  const num = parseFloat(clean);
  return Number.isFinite(num) ? num : 0;
}

/**
 * استخراج العملية.
 */
function detectOperation(q: string): string {
  if (/[√∛]/.test(q)) return "read";
  if (/÷/.test(q)) return "division";
  if (/[×x]/.test(q)) return "multiplication";
  return "addition";
}

/**
 * تحديد المهارة من القسم.
 *
 * ⚠️ ملاحظة: حذفنا S7 و S16 (سالبة) — لن تُستخدم في الامتحانات.
 */
function sectionToSkill(section: string): string | null {
  const map: Record<string, string> = {
    // raw-01 → raw-04
    S1: "S3",  // جمع/طرح مباشر
    S2: "S5",  // أصدقاء 5
    S3: "S7",  // أصدقاء 10
    S4: "S9",  // قواعد مركبة
    S5: "S10", // ضرب
    S6: "S13", // قسمة
    S7: null,  // ❌ سالبة — حُذف
    S8: "S18", // عشرية
    S9: "S19", // جذر تربيعي
    S10: "S20", // جذر تكعيبي

    // raw-05 → raw-07
    S11: "S16", // جمع/طرح مركّب متقدم
    S12: "S16", // متعدد الأرقام
    S13: "S17", // ضرب متقدم
    S14: "S17", // قسمة متقدمة
    S15: "S18", // عشرية متقدمة
    S16: null,  // ❌ سالبة متقدمة — حُذف
    S17: "S19", // جذر متقدم
  };
  return map[section] ?? null;
}

/**
 * تحديد المستوى من المهارة.
 */
function skillToLevel(skillId: string): string {
  const num = parseInt(skillId.replace("S", ""), 10);
  if (num === 1 || num === 2) return "L0";
  if (num >= 3 && num <= 9) return "L1";
  if (num === 10 || num === 11 || num === 12) return "L2";
  if (num === 13 || num === 14 || num === 15) return "L3";
  if (num === 16) return "L4";
  if (num === 17) return "L5";
  if (num === 18) return "L6";
  if (num === 19 || num === 20) return "L7";
  return "L1";
}

/**
 * تحويل RawQuestion → ExamQuestion.
 * يرجع null إذا كان السؤال من قسم محذوف.
 */
function rawToExam(
  raw: RawQuestion,
  prefix: "EX1" | "EX2",
  seq: number,
): ExamQuestion | null {
  const skillId = sectionToSkill(raw.section);
  if (!skillId) return null; // قسم محذوف

  const levelId = skillToLevel(skillId);
  const termCount = countTerms(raw.question);
  const correctAnswer = parseResult(raw.result);

  return {
    id: `${prefix}-${skillId}-${String(seq).padStart(3, "0")}`,
    skillId,
    levelId,
    prompt: raw.question,
    correctAnswer,
    termCount,
    explanation: raw.solution || raw.note || "",
    tags: [
      `section-${raw.section}`,
      detectOperation(raw.question),
      `terms-${termCount}`,
    ],
  };
}

// ═══════════════════════════════════════════════════════════
// EXAM_1 — من raw-01 → raw-04
// ═══════════════════════════════════════════════════════════

function buildExamPool1(): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  let seq = 1;

  // raw-01: S1, S2, S3
  [...RAW_QUESTIONS_01].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  // raw-02: S4, S5
  [...RAW_QUESTIONS_02].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  // raw-03: S6 (S7 سالبة محذوفة)
  [...RAW_QUESTIONS_03].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  // raw-04: S8, S9, S10
  [...RAW_QUESTIONS_04].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  return all;
}

// ═══════════════════════════════════════════════════════════
// EXAM_2 — من raw-05 → raw-07
// ═══════════════════════════════════════════════════════════

function buildExamPool2(): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  let seq = 1;

  // raw-05: S11, S12
  [...RAW_QUESTIONS_05].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  // raw-06: S13, S14
  [...RAW_QUESTIONS_06].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  // raw-07: S15, S17 (S16 سالبة محذوفة)
  [...RAW_QUESTIONS_07].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) {
      all.push(q);
      seq += 1;
    }
  });

  return all;
}

// ═══════════════════════════════════════════════════════════
// البنوك النهائية
// ═══════════════════════════════════════════════════════════

/** بنك الامتحان 1 */
export const EXAM_POOL_1: readonly ExamQuestion[] = Object.freeze(buildExamPool1());

/** بنك الامتحان 2 */
export const EXAM_POOL_2: readonly ExamQuestion[] = Object.freeze(buildExamPool2());

/** إحصاءات */
export const EXAM_STATS = {
  exam1PoolSize: EXAM_POOL_1.length,
  exam2PoolSize: EXAM_POOL_2.length,
} as const;

// ═══════════════════════════════════════════════════════════
// دوال الاختيار
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

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * اختيار أسئلة الامتحان 1 (20 سؤالاً).
 *
 * من كل مهارة → نختار الأسئلة الأطول (termCount الأعلى).
 * المهارات المستهدفة: S3, S5, S7, S9, S10, S13, S18, S19, S20
 */
export function buildExam1(seed = Date.now()): ExamQuestion[] {
  const rng = createRng(seed);

  const bySkill = new Map<string, ExamQuestion[]>();
  for (const q of EXAM_POOL_1) {
    const arr = bySkill.get(q.skillId) ?? [];
    arr.push(q);
    bySkill.set(q.skillId, arr);
  }

  const selected: ExamQuestion[] = [];
  const targetSkills = [
    "S3", "S5", "S7", "S9",
    "S10", "S13", "S18", "S19", "S20",
  ];

  for (const skill of targetSkills) {
    const pool = bySkill.get(skill) ?? [];
    if (pool.length === 0) continue;

    // ترتيب حسب عدد الحدود (تنازلي) → خذ 3 الأطول
    const sorted = [...pool].sort((a, b) => b.termCount - a.termCount);
    const top = sorted.slice(0, Math.min(3, sorted.length));
    selected.push(...top);
  }

  // خلط → اختر 20
  const shuffled = shuffle(selected, rng);
  return shuffled.slice(0, 20);
}

/**
 * اختيار أسئلة الامتحان 2 (40 سؤالاً).
 *
 * المهارات: S16, S17, S18, S19
 */
export function buildExam2(seed = Date.now()): ExamQuestion[] {
  const rng = createRng(seed);

  const bySkill = new Map<string, ExamQuestion[]>();
  for (const q of EXAM_POOL_2) {
    const arr = bySkill.get(q.skillId) ?? [];
    arr.push(q);
    bySkill.set(q.skillId, arr);
  }

  const selected: ExamQuestion[] = [];
  const targetSkills = ["S16", "S17", "S18", "S19"];

  for (const skill of targetSkills) {
    const pool = bySkill.get(skill) ?? [];
    if (pool.length === 0) continue;

    const sorted = [...pool].sort((a, b) => b.termCount - a.termCount);
    const top = sorted.slice(0, Math.min(10, sorted.length));
    selected.push(...top);
  }

  const shuffled = shuffle(selected, rng);
  return shuffled.slice(0, 40);
}