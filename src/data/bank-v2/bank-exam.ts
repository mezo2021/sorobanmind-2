// ═══════════════════════════════════════════════════════════════════
// 🎓 src/data/bank-v2/bank-exam.ts — بنك الامتحانات النهائية
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يبني EXAM_POOL_1 (للصغار، من raw-01 → raw-04)
//   - يبني EXAM_POOL_2 (للكبار، من raw-05 → raw-07)
//   - يوفّر دوال اختيار: buildExam1() · buildExam2()
//
// ✅ حالة جيدة: يستخدم ترقيم L0-L7 و S1-S20 — متوافق مع SRB
//
// 📥 الاعتماديات:
//   - ../bank-raw/raw-01 → raw-07 (RAW_QUESTIONS_XX)
//   - ../bank-raw/types (RawQuestion)
//
// 📤 الصادرات:
//   - ExamQuestion (interface)
//   - EXAM_POOL_1 · EXAM_POOL_2 · EXAM_STATS
//   - buildExam1() · buildExam2()
//
// 🎯 خريطة التحويل (section → skill → level):
//
//   | raw-S | → skill | → level |
//   |-------|---------|---------|
//   | S1    | S3      | L1      |
//   | S2    | S5      | L1      |
//   | S3    | S7      | L1      |
//   | S4    | S9      | L1      |
//   | S5    | S10     | L2      |
//   | S6    | S13     | L3      |
//   | S7    | null    | محذوف   | ← سالبة
//   | S8    | S18     | L6      |
//   | S9    | S19     | L7      |
//   | S10   | S20     | L7      |
//   | S11   | S16     | L4      |
//   | S12   | S16     | L4      |
//   | S13   | S17     | L5      |
//   | S14   | S17     | L5      |
//   | S15   | S18     | L6      |
//   | S16   | null    | محذوف   | ← سالبة
//   | S17   | S19     | L7      |
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: SRB.getAll() مع filter على allowed_phases: ["CE"]
//   الخطوة 2: تحديث buildExam1() و buildExam2() للقراءة من SRB
//   الخطوة 3: استخدام SRB IDs في الامتحانات
//   الخطوة 4: اختبار شامل
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر خريطة sectionToSkill (الامتحانات تعتمد عليها)
//   2. لا تغيّر skillToLevel (متوافق مع المنهج)
//   3. S7 و S16 تبقى null (قرار سابق)
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + خريطة SRB
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-v2/bank-exam.ts
// بنك الامتحانات النهائية
// ═══════════════════════════════════════════════════════════
// EXAM_1 (الصغار): 20 سؤالاً — من raw-01 → raw-04
// EXAM_2 (الكبار): 40 سؤالاً — من raw-05 → raw-07
// ═══════════════════════════════════════════════════════════
// معيار الاختيار: الأسئلة الأطول (عدد الحدود الأكبر)
// لا يشمل: الأعداد السالبة (S7, S16)

// 🔗 SRB-MIGRATION: سيُستبدل بـ SRB.getRawQuestions() أو SRB.getAll()
import { RAW_QUESTIONS_01 } from "../bank-raw/raw-01";
import { RAW_QUESTIONS_02 } from "../bank-raw/raw-02";
import { RAW_QUESTIONS_03 } from "../bank-raw/raw-03";
import { RAW_QUESTIONS_04 } from "../bank-raw/raw-04";
import { RAW_QUESTIONS_05 } from "../bank-raw/raw-05";
import { RAW_QUESTIONS_06 } from "../bank-raw/raw-06";
import { RAW_QUESTIONS_07 } from "../bank-raw/raw-07";
import type { RawQuestion } from "../bank-raw/types";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * سؤال امتحان.
 *
 * 🔗 SRB-MIGRATION: سيصبح SRBQuestion مع allowed_phases: ["CE"]
 */
export interface ExamQuestion {
  /** معرّف: EX1-S3-001 أو EX2-S16-001 */
  id: string;                  // 🔗 SRB: SRB-L1-S03-M01-B001
  /** المهارة: S1-S20 */
  skillId: string;             // ✅ متوافق
  /** المستوى: L0-L7 */
  levelId: string;             // ✅ متوافق
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
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════

/**
 * حساب عدد الحدود في سؤال.
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
 * ⚠️ الأقسام السالبة (S7, S16) ترجع null — تُحذف من الامتحان.
 *
 * 🔗 SRB-MIGRATION: ستبقى كما هي (المفهوم ثابت)
 */
function sectionToSkill(section: string): string | null {
  const map: Record<string, string | null> = {
    // raw-01 → raw-04
    S1: "S3",       // 🔗 SRB: S03
    S2: "S5",       // 🔗 SRB: S05
    S3: "S7",       // 🔗 SRB: S07
    S4: "S9",       // 🔗 SRB: S09
    S5: "S10",      // 🔗 SRB: S10
    S6: "S13",      // 🔗 SRB: S13
    S7: null,       // 🔗 سالبة — محذوف
    S8: "S18",      // 🔗 SRB: S18
    S9: "S19",      // 🔗 SRB: S19
    S10: "S20",     // 🔗 SRB: S20

    // raw-05 → raw-07
    S11: "S16",     // 🔗 SRB: S16
    S12: "S16",     // 🔗 SRB: S16
    S13: "S17",     // 🔗 SRB: S17
    S14: "S17",     // 🔗 SRB: S17
    S15: "S18",     // 🔗 SRB: S18
    S16: null,      // 🔗 سالبة — محذوف
    S17: "S19",     // 🔗 SRB: S19
  };

  return map[section] ?? null;
}

/**
 * تحديد المستوى من المهارة.
 *
 * ✅ متوافق مع SRB (المنهج نفسه)
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
 *
 * 🔗 SRB-MIGRATION: SRB.toExamQuestion()
 */
function rawToExam(
  raw: RawQuestion,
  prefix: "EX1" | "EX2",
  seq: number,
): ExamQuestion | null {
  const skillId = sectionToSkill(raw.section);
  if (!skillId) return null;

  const levelId = skillToLevel(skillId);
  const termCount = countTerms(raw.question);
  const correctAnswer = parseResult(raw.result);

  return {
    id: `${prefix}-${skillId}-${String(seq).padStart(3, "0")}`,  // 🔗 SRB
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
// 🏗️ بناء البنوك
// 🔗 SRB-MIGRATION: ستُستبدل بقراءة من SRB مباشرة
// ═══════════════════════════════════════════════════════════

function buildExamPool1(): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  let seq = 1;

  [...RAW_QUESTIONS_01].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) { all.push(q); seq += 1; }
  });

  [...RAW_QUESTIONS_02].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) { all.push(q); seq += 1; }
  });

  [...RAW_QUESTIONS_03].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) { all.push(q); seq += 1; }
  });

  [...RAW_QUESTIONS_04].forEach((raw) => {
    const q = rawToExam(raw, "EX1", seq);
    if (q) { all.push(q); seq += 1; }
  });

  return all;
}

function buildExamPool2(): ExamQuestion[] {
  const all: ExamQuestion[] = [];
  let seq = 1;

  [...RAW_QUESTIONS_05].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) { all.push(q); seq += 1; }
  });

  [...RAW_QUESTIONS_06].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) { all.push(q); seq += 1; }
  });

  [...RAW_QUESTIONS_07].forEach((raw) => {
    const q = rawToExam(raw, "EX2", seq);
    if (q) { all.push(q); seq += 1; }
  });

  return all;
}

// ═══════════════════════════════════════════════════════════
// 📤 البنوك النهائية
// 🔗 SRB-MIGRATION: ستُستبدل بـ SRB.getAllExams()
// ═══════════════════════════════════════════════════════════

export const EXAM_POOL_1: readonly ExamQuestion[] = Object.freeze(buildExamPool1());
export const EXAM_POOL_2: readonly ExamQuestion[] = Object.freeze(buildExamPool2());

export const EXAM_STATS = {
  exam1PoolSize: EXAM_POOL_1.length,
  exam2PoolSize: EXAM_POOL_2.length,
} as const;

// ═══════════════════════════════════════════════════════════
// 🎯 دوال الاختيار
// 🔗 SRB-MIGRATION: SRB.buildExam1() · SRB.buildExam2()
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
 * التوزيع: من S3 · S5 · S7 · S9 · S10 · S13 · S18 · S19 · S20
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

    const sorted = [...pool].sort((a, b) => b.termCount - a.termCount);
    const top = sorted.slice(0, Math.min(3, sorted.length));
    selected.push(...top);
  }

  const shuffled = shuffle(selected, rng);
  return shuffled.slice(0, 20);
}

/**
 * اختيار أسئلة الامتحان 2 (40 سؤالاً).
 *
 * التوزيع: من S16 · S17 · S18 · S19
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