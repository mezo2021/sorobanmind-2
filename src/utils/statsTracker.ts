// src/utils/statsTracker.ts
// [F1] كتابة إحصائيات التمرّن والأنزان إلى localStorage
// تُقرأ من useQuests لعرض المهام في لوحة ولي الأمر
//
// المفاتيح المكتوبة:
// - soroban_practice_stats: totalProblems · correctAnswers · byOperation
// - soroban_anzan_stats:    totalRounds · totalCorrect · highScore

const PRACTICE_KEY = 'soroban_practice_stats';
const ANZAN_KEY = 'soroban_anzan_stats';

type NumberMap = Record<string, number>;

const OPERATION_FIELD: Record<string, string> = {
  addition: 'additionProblems',
  subtraction: 'subtractionProblems',
  multiplication: 'multiplicationProblems',
  division: 'divisionProblems',
};

function safeParse(raw: string | null): NumberMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed as NumberMap;
    return {};
  } catch {
    return {};
  }
}

/**
 * يُسجّل نتيجة سؤال تمرّن.
 * @param operation  - "addition" | "subtraction" | "multiplication" | "division" | أي قيمة أخرى
 * @param correct    - هل الإجابة صحيحة؟
 */
export function trackPractice(operation: string, correct: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const stats = safeParse(localStorage.getItem(PRACTICE_KEY));

    stats.totalProblems = (stats.totalProblems ?? 0) + 1;
    stats.correctAnswers = (stats.correctAnswers ?? 0) + (correct ? 1 : 0);

    const field = OPERATION_FIELD[operation];
    if (field) {
      stats[field] = (stats[field] ?? 0) + 1;
    }

    localStorage.setItem(PRACTICE_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}

/**
 * يُسجّل نتيجة سؤال أنزان (بصري أو سمعي).
 * @param correct     - هل الإجابة صحيحة؟
 * @param scoreSoFar  - النقاط الحالية في الجلسة (بعد هذه الإجابة)
 */
export function trackAnzan(correct: boolean, scoreSoFar: number): void {
  if (typeof window === 'undefined') return;
  try {
    const stats = safeParse(localStorage.getItem(ANZAN_KEY));

    stats.totalRounds = (stats.totalRounds ?? 0) + 1;
    stats.totalCorrect = (stats.totalCorrect ?? 0) + (correct ? 1 : 0);
    stats.highScore = Math.max(stats.highScore ?? 0, scoreSoFar);

    localStorage.setItem(ANZAN_KEY, JSON.stringify(stats));
  } catch {
    /* ignore */
  }
}