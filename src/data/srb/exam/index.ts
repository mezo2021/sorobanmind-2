// src/data/srb/exam/index.ts
// ✅ Bank B كامل: CE1 · CE2 · PT

import type { SRBQuestion } from "../types";

import { L0_EXAM_QUESTIONS } from "./L0";
import { L1_EXAM_QUESTIONS } from "./L1";
import { L2_EXAM_QUESTIONS } from "./L2";
import { L3_EXAM_QUESTIONS } from "./L3";
import { L4_EXAM_QUESTIONS } from "./L4";
import { L5_EXAM_QUESTIONS } from "./L5";
import { L6_EXAM_QUESTIONS } from "./L6";
import { L7_EXAM_QUESTIONS } from "./L7";

// ═══════════════════════════════════════════════════════════
// 📋 ثوابت CE
// ═══════════════════════════════════════════════════════════

export const EXAM1_QUESTION_COUNT = 20;
export const EXAM2_QUESTION_COUNT = 40;
export const EXAM1_TIME_SEC = 10 * 60;
export const EXAM2_TIME_SEC = 20 * 60;
export const EXAM_PASS_THRESHOLD = 80;
export const EXAM_MAX_ATTEMPTS = 2;
export const EXAM_COOLDOWN_MS = 48 * 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════
// 📋 ثوابت PT
// ═══════════════════════════════════════════════════════════

export const QUESTIONS_PER_LEVEL = 5;
export const POINTS_PER_QUESTION = 5;
export const POINTS_PER_LEVEL = 25;
export const PASS_THRESHOLD = 20;

// ═══════════════════════════════════════════════════════════
// 🏦 Bank B الكامل
// ═══════════════════════════════════════════════════════════

export const ALL_EXAM_QUESTIONS: SRBQuestion[] = [
  ...L0_EXAM_QUESTIONS,
  ...L1_EXAM_QUESTIONS,
  ...L2_EXAM_QUESTIONS,
  ...L3_EXAM_QUESTIONS,
  ...L4_EXAM_QUESTIONS,
  ...L5_EXAM_QUESTIONS,
  ...L6_EXAM_QUESTIONS,
  ...L7_EXAM_QUESTIONS,
];

export const EXAM_BANK_SIZE = ALL_EXAM_QUESTIONS.length;

// ═══════════════════════════════════════════════════════════
// 🔍 الاستعلام
// ═══════════════════════════════════════════════════════════

export function getExamQuestionsByLevel(level: string): SRBQuestion[] {
  return ALL_EXAM_QUESTIONS.filter((q) => q.level === level);
}

export function getExamQuestionsByLevels(levels: string[]): SRBQuestion[] {
  const set = new Set(levels);
  return ALL_EXAM_QUESTIONS.filter((q) => set.has(q.level));
}

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات داخلية
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

function shuffleArray<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function digitCount(value: number): number {
  const abs = Math.abs(value);
  if (abs === 0) return 1;
  return String(abs).length;
}

function pickHardest(
  pool: SRBQuestion[],
  count: number,
  rng: () => number,
): SRBQuestion[] {
  if (pool.length === 0) return [];

  const sorted = [...pool].sort((a, b) => {
    const termDiff = b.operands.length - a.operands.length;
    if (termDiff !== 0) return termDiff;
    const diffDiff = b.difficulty - a.difficulty;
    if (diffDiff !== 0) return diffDiff;
    return digitCount(b.result) - digitCount(a.result);
  });

  const topPool = sorted.slice(0, Math.min(count * 3, sorted.length));
  return shuffleArray(topPool, rng).slice(0, count);
}

function pickLongest(pool: SRBQuestion[], count: number): SRBQuestion[] {
  const sorted = [...pool].sort(
    (a, b) => b.operand_count - a.operand_count,
  );
  return sorted.slice(0, Math.min(count, sorted.length));
}

// ═══════════════════════════════════════════════════════════
// 🎓 بناء CE1 · CE2
// ═══════════════════════════════════════════════════════════

const EXAM1_DISTRIBUTION: Record<string, number> = {
  L0: 3,
  L1: 7,
  L2: 5,
  L3: 5,
};

const EXAM2_DISTRIBUTION: Record<string, number> = {
  L4: 10,
  L5: 10,
  L6: 10,
  L7: 10,
};

export function buildExam1Category(seed = Date.now()): SRBQuestion[] {
  const rng = createRng(seed);
  const questions: SRBQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM1_DISTRIBUTION)) {
    const pool = getExamQuestionsByLevel(levelId);
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffleArray(questions, rng);
}

export function buildExam2Category(seed = Date.now()): SRBQuestion[] {
  const rng = createRng(seed);
  const questions: SRBQuestion[] = [];

  for (const [levelId, count] of Object.entries(EXAM2_DISTRIBUTION)) {
    const pool = getExamQuestionsByLevel(levelId);
    if (pool.length === 0) continue;
    questions.push(...pickHardest(pool, count, rng));
  }

  return shuffleArray(questions, rng);
}

// ═══════════════════════════════════════════════════════════
// 🎯 PT — الأنواع
// ═══════════════════════════════════════════════════════════

export interface PlacementQuestion extends SRBQuestion {
  source: "EX1" | "EX2";
  placementId: string;
}

export interface LevelResult {
  levelId: string;
  correct: number;
  total: number;
  points: number;
  percentage: number;
  passed: boolean;
}

export interface PlacementResult {
  recommendedLevel: string;
  totalScore: number;
  passed: boolean;
  levels: LevelResult[];
  weakSkills: string[];
  firstFailedLevel: string | null;
}

const ALL_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"];
const EX1_LEVELS = new Set(["L0", "L1", "L2", "L3"]);

// ═══════════════════════════════════════════════════════════
// 🎯 PT — بناء
// ═══════════════════════════════════════════════════════════

export function buildPlacementTest(seed = Date.now()): PlacementQuestion[] {
  const rng = createRng(seed);
  const questions: PlacementQuestion[] = [];

  for (const levelId of ALL_LEVELS) {
    const pool = getExamQuestionsByLevel(levelId);
    if (pool.length === 0) continue;

    const selected = pickLongest(pool, QUESTIONS_PER_LEVEL);
    const source: "EX1" | "EX2" = EX1_LEVELS.has(levelId) ? "EX1" : "EX2";

    for (const q of selected) {
      questions.push({
        ...q,
        source,
        placementId: `PL-${levelId}-${q.section}-${questions.length + 1}`,
      });
    }
  }

  return shuffleArray(questions, rng);
}

// ═══════════════════════════════════════════════════════════
// 🎯 PT — تقييم
// ═══════════════════════════════════════════════════════════

export function evaluatePlacementTest(
  questions: PlacementQuestion[],
  answers: Map<string, number>,
): PlacementResult {
  const byLevel = new Map<
    string,
    { total: number; correct: number; weakSkills: Set<string> }
  >();

  for (const levelId of ALL_LEVELS) {
    byLevel.set(levelId, { total: 0, correct: 0, weakSkills: new Set() });
  }

  for (const q of questions) {
    const levelData = byLevel.get(q.level);
    if (!levelData) continue;

    levelData.total += 1;
    const userAnswer = answers.get(q.placementId);
    const isCorrect = userAnswer === q.result;

    if (isCorrect) {
      levelData.correct += 1;
    } else {
      levelData.weakSkills.add(q.section);
      try {
        const WEAK_KEY = "soroban_weak_skills_v2";
        const raw = localStorage.getItem(WEAK_KEY);
        const data = raw ? JSON.parse(raw) : {};
        const current = data[q.section] ?? {
          skillId: q.section,
          attempts: 0,
          correct: 0,
          wrong: 0,
          avgTimeMs: 0,
          lastAttempt: 0,
          weaknessScore: 0,
        };
        current.attempts += 1;
        current.wrong += 1;
        current.lastAttempt = Date.now();
        current.weaknessScore = Math.min(
          100,
          (current.wrong / current.attempts) * 60 + 20,
        );
        data[q.section] = current;
        localStorage.setItem(WEAK_KEY, JSON.stringify(data));
      } catch { /* ignore */ }
    }
  }

  const levels: LevelResult[] = [];
  let firstFailedLevel: string | null = null;
  const allWeakSkills = new Set<string>();

  for (const levelId of ALL_LEVELS) {
    const data = byLevel.get(levelId);
    if (!data || data.total === 0) continue;

    const points = data.correct * POINTS_PER_QUESTION;
    const percentage = (points / POINTS_PER_LEVEL) * 100;
    const passed = points >= PASS_THRESHOLD;

    if (!passed && firstFailedLevel === null) {
      firstFailedLevel = levelId;
    }

    for (const skill of data.weakSkills) allWeakSkills.add(skill);

    levels.push({
      levelId,
      correct: data.correct,
      total: data.total,
      points,
      percentage: Math.round(percentage),
      passed,
    });
  }

  const recommendedLevel =
    firstFailedLevel !== null ? firstFailedLevel : "L7";

  const totalPoints = levels.reduce((sum, l) => sum + l.points, 0);
  const totalMax = levels.length * POINTS_PER_LEVEL;
  const totalScore =
    totalMax === 0 ? 0 : Math.round((totalPoints / totalMax) * 100);

  return {
    recommendedLevel,
    totalScore,
    passed: firstFailedLevel !== "L0",
    levels,
    weakSkills: [...allWeakSkills],
    firstFailedLevel,
  };
}

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات مساعدة
// ═══════════════════════════════════════════════════════════

export function canTakePlacementTest(
  lastAttempt: number | null,
  cooldownMs: number = 48 * 60 * 60 * 1000,
): { allowed: boolean; waitMs: number } {
  if (!lastAttempt) return { allowed: true, waitMs: 0 };
  const elapsed = Date.now() - lastAttempt;
  if (elapsed >= cooldownMs) return { allowed: true, waitMs: 0 };
  return { allowed: false, waitMs: cooldownMs - elapsed };
}

export function getLevelName(levelId: string): string {
  const map: Record<string, string> = {
    L0: "التمهيدي",
    L1: "الجمع والطرح",
    L2: "الضرب",
    L3: "القسمة",
    L4: "جمع وطرح متقدم",
    L5: "ضرب وقسمة متقدم",
    L6: "الكسور العشرية",
    L7: "الجذور",
  };
  return map[levelId] ?? levelId;
}