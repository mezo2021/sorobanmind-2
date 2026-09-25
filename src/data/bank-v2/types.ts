// src/data/bank-v2/types.ts
import type { MovementType } from "../../curriculum/types";

export type BankOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "build"
  | "read";

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface QuestionTiming {
  displayMs?: number;
  answerMs: number;
  maxMs: number;
}

export interface BankQuestion {
  id: string;
  levelId: string;
  skillId: string;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  timing: QuestionTiming;
  explanation?: string;
  tags?: string[];
}

export function makeId(levelId: string, skillNum: number, seq: number): string {
  return `${levelId}-S${skillNum}-${String(seq).padStart(3, "0")}`;
}

export function makeQuestion(params: {
  levelId: string;
  skillNum: number;
  seq: number;
  prompt: string;
  operands: number[];
  operation: BankOperation;
  correctAnswer: number;
  movement: MovementType;
  difficulty: Difficulty;
  expectedTimeMs?: number;
  timing?: Partial<QuestionTiming>;
  explanation?: string;
  tags?: string[];
}): BankQuestion {
  const id = makeId(params.levelId, params.skillNum, params.seq);

  let timing: QuestionTiming;

  if (params.timing) {
    const answerMs = params.timing.answerMs ?? params.expectedTimeMs ?? 8000;
    const maxMs = params.timing.maxMs ?? Math.round(answerMs * 1.5);
    timing = {
      displayMs: params.timing.displayMs,
      answerMs,
      maxMs,
    };
  } else {
    const defaultTiming = getDefaultTiming(params.skillNum, params.difficulty);
    timing = defaultTiming;

    if (params.expectedTimeMs) {
      timing = {
        ...timing,
        answerMs: params.expectedTimeMs,
        maxMs: Math.round(params.expectedTimeMs * 1.5),
      };
    }
  }

  return {
    id,
    levelId: params.levelId,
    skillId: `S${params.skillNum}`,
    prompt: params.prompt,
    operands: params.operands,
    operation: params.operation,
    correctAnswer: params.correctAnswer,
    movement: params.movement,
    difficulty: params.difficulty,
    timing,
    explanation: params.explanation,
    tags: params.tags,
  };
}

interface TimingProfile {
  answerMs: [number, number, number, number, number];
  displayMs: number;
}

const TIMING_PROFILES: Record<number, TimingProfile> = {
  1: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 3000 },
  2: { answerMs: [7000, 6000, 5500, 5000, 4500], displayMs: 3000 },
  3: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 2000 },
  4: { answerMs: [5000, 4500, 4000, 3500, 3000], displayMs: 2000 },
  5: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  6: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  7: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  8: { answerMs: [8000, 7000, 6000, 5500, 5000], displayMs: 2000 },
  9: { answerMs: [12000, 11000, 10000, 9000, 8000], displayMs: 2500 },
  10: { answerMs: [15000, 14000, 13000, 12000, 11000], displayMs: 3000 },
  11: { answerMs: [25000, 23000, 21000, 19000, 17000], displayMs: 3000 },
  12: { answerMs: [35000, 33000, 30000, 28000, 25000], displayMs: 4000 },
  13: { answerMs: [15000, 14000, 13000, 12000, 11000], displayMs: 3500 },
  14: { answerMs: [30000, 28000, 26000, 24000, 22000], displayMs: 3500 },
  15: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 4000 },
  16: { answerMs: [25000, 23000, 21000, 19000, 17000], displayMs: 3000 },
  17: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 4000 },
  18: { answerMs: [30000, 28000, 26000, 24000, 22000], displayMs: 4000 },
  19: { answerMs: [35000, 33000, 31000, 29000, 27000], displayMs: 5000 },
  20: { answerMs: [45000, 42000, 40000, 38000, 35000], displayMs: 5000 },
};

export function getDefaultTiming(
  skillNum: number,
  difficulty: Difficulty,
): QuestionTiming {
  const profile = TIMING_PROFILES[skillNum] ?? TIMING_PROFILES[3];
  const answerMs = profile.answerMs[difficulty - 1];

  return {
    displayMs: profile.displayMs,
    answerMs,
    maxMs: Math.round(answerMs * 1.5),
  };
}

export function adaptTiming(
  timing: QuestionTiming,
  context: "practice" | "anzan-visual" | "anzan-audio" | "exam",
): QuestionTiming {
  switch (context) {
    case "practice":
      return {
        ...timing,
        answerMs: Math.round(timing.answerMs * 1.2),
        maxMs: Math.round(timing.maxMs * 1.3),
      };
    case "anzan-visual":
      return {
        displayMs: timing.displayMs ?? 2000,
        answerMs: Math.round(timing.answerMs * 0.8),
        maxMs: Math.round(timing.answerMs * 0.8 * 1.2),
      };
    case "anzan-audio":
      return {
        displayMs: Math.round((timing.displayMs ?? 2000) * 0.7),
        answerMs: Math.round(timing.answerMs * 0.8),
        maxMs: Math.round(timing.answerMs * 0.8 * 1.2),
      };
    case "exam":
    default:
      return timing;
  }
}

export function applyAdaptiveSpeed(
  timing: QuestionTiming,
  correctStreak: number,
): QuestionTiming {
  const reductionSteps = Math.floor(correctStreak / 5);
  const reductionFactor = Math.max(0.5, 1 - reductionSteps * 0.05);

  return {
    displayMs: timing.displayMs
      ? Math.round(timing.displayMs * reductionFactor)
      : undefined,
    answerMs: Math.round(timing.answerMs * reductionFactor),
    maxMs: Math.round(timing.maxMs * reductionFactor),
  };
}

export function createRng(seed: number): () => number {
  let value = seed >>> 0;
  return (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getDigits(value: number): number {
  const abs = Math.abs(Math.trunc(value));
  if (abs === 0) return 1;
  return String(abs).length;
}

export function hasCarry(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 + Math.floor(b / d) % 10 >= 10) return true;
  }
  return false;
}

export function hasBorrow(a: number, b: number): boolean {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  for (let p = 0; p < maxDigits; p += 1) {
    const d = Math.pow(10, p);
    if (Math.floor(a / d) % 10 < Math.floor(b / d) % 10) return true;
  }
  return false;
}

export function complementTo5(d: number): number {
  return 5 - d;
}

export function complementTo10(d: number): number {
  return 10 - d;
}

export function classifyAdd(current: number, delta: number): MovementType {
  const lower = current % 5;
  const hasUpper = current >= 5;

  if (delta >= 5) {
    return current + delta < 10 ? "five-friend-add" : "ten-friend-add";
  }
  if (lower + delta <= 4) return "direct";
  if (!hasUpper && current + delta < 10) return "five-friend-add";
  return "ten-friend-add";
}

export function classifySub(current: number, delta: number): MovementType {
  const lower = current % 5;
  const hasUpper = current >= 5;

  if (delta < 5 && lower >= delta) return "direct";
  if (delta < 5 && hasUpper) return "five-friend-sub";
  return "ten-friend-sub";
}