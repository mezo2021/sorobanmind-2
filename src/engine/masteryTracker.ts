هذا الملف هو المسؤول عن الطفل وليس السؤال فقط.
أي أن:
السؤال أخطأ فيه الطفل → نسجل المحاولة → نحسب الدقة والزمن والتتابع → نعرف هل المهارة أتقنت أم لا.
import type {
  Attempt,
  SkillProgress,
  Skill
} from "../curriculum/types";

/**
 * نتيجة تفصيلية لمحاولة الطفل.
 */
export interface AttemptEvaluation {
  /** هل الإجابة صحيحة */
  correct: boolean;

  /** هل الإجابة بطيئة */
  tooSlow: boolean;

  /** هل تجاوز الزمن الأقصى */
  timeout: boolean;

  /** الزمن المستخدم */
  timeMs: number;

  /** دقة المهارة بعد المحاولة */
  accuracy: number;

  /** عدد الإجابات الصحيحة */
  correctCount: number;

  /** عدد المحاولات */
  attempts: number;
}

/**
 * إنشاء سجل مهارة جديد.
 */
export function createProgress(
  skillId: string
): SkillProgress {
  return {
    skillId,
    attempts: 0,
    correct: 0,
    consecutiveCorrect: 0,
    avgTimeMs: 0
  };
}

/**
 * حساب الدقة.
 */
export function getAccuracy(
  progress: SkillProgress
): number {
  if (progress.attempts <= 0) {
    return 0;
  }

  return (
    progress.correct /
    progress.attempts
  );
}

/**
 * تحديث المتوسط الزمني بصورة تراكمية.
 */
function updateAverageTime(
  currentAverage: number,
  attemptsBefore: number,
  newTimeMs: number
): number {
  if (attemptsBefore <= 0) {
    return newTimeMs;
  }

  return (
    (currentAverage * attemptsBefore +
      newTimeMs) /
    (attemptsBefore + 1)
  );
}

/**
 * تحديث تقدم المهارة بعد محاولة.
 */
export function updateProgress(
  progress: SkillProgress,
  attempt: Attempt
): SkillProgress {
  const previousAttempts =
    progress.attempts;

  const nextAttempts =
    previousAttempts + 1;

  const nextCorrect =
    progress.correct +
    (attempt.correct ? 1 : 0);

  const nextConsecutive =
    attempt.correct
      ? progress.consecutiveCorrect + 1
      : 0;

  const nextAverageTime =
    updateAverageTime(
      progress.avgTimeMs,
      previousAttempts,
      attempt.timeMs
    );

  return {
    ...progress,
    attempts: nextAttempts,
    correct: nextCorrect,
    consecutiveCorrect:
      nextConsecutive,
    avgTimeMs: nextAverageTime
  };
}

/**
 * إنشاء Attempt من إجابة الطفل.
 *
 * هنا يتم تحويل:
 * الإجابة + الزمن
 *
 * إلى سجل قابل للتحليل.
 */
export function createAttempt(
  skillId: string,
  userAnswer: number,
  correctAnswer: number,
  timeMs: number
): Attempt {
  return {
    skillId,
    correct:
      userAnswer === correctAnswer,
    timeMs: Math.max(0, timeMs),
    timestamp: Date.now()
  };
}

/**
 * فحص إتقان المهارة.
 *
 * شروط الإتقان كلها يجب أن تتحقق:
 * - عدد صحيح كافٍ
 * - دقة كافية
 * - زمن مناسب
 * - تتابع صحيح
 */
export function isMastered(
  progress: SkillProgress,
  skill: Skill
): boolean {
  if (progress.attempts <= 0) {
    return false;
  }

  const accuracy =
    getAccuracy(progress);

  const mastery =
    skill.mastery;

  const correctEnough =
    progress.correct >=
    mastery.minCorrect;

  const accurateEnough =
    accuracy >=
    mastery.accuracy;

  const fastEnough =
    progress.avgTimeMs <=
    mastery.maxTimePerProblem;

  const consecutiveEnough =
    progress.consecutiveCorrect >=
    mastery.consecutiveCorrect;

  return (
    correctEnough &&
    accurateEnough &&
    fastEnough &&
    consecutiveEnough
  );
}

/**
 * نسبة الإتقان من 0 إلى 100.
 *
 * يتم حساب أربعة محاور:
 * 1. عدد الإجابات الصحيحة.
 * 2. الدقة.
 * 3. الزمن.
 * 4. التتابع.
 */
export function getMasteryPercentage(
  progress: SkillProgress,
  skill: Skill
): number {
  if (progress.attempts <= 0) {
    return 0;
  }

  const mastery =
    skill.mastery;

  const correctRatio =
    mastery.minCorrect <= 0
      ? 1
      : Math.min(
          1,
          progress.correct /
            mastery.minCorrect
        );

  const accuracy =
    getAccuracy(progress);

  const accuracyRatio =
    mastery.accuracy <= 0
      ? 1
      : Math.min(
          1,
          accuracy /
            mastery.accuracy
        );

  const timeRatio =
    progress.avgTimeMs <= 0
      ? 1
      : Math.min(
          1,
          mastery.maxTimePerProblem /
            progress.avgTimeMs
        );

  const streakRatio =
    mastery.consecutiveCorrect <= 0
      ? 1
      : Math.min(
          1,
          progress.consecutiveCorrect /
            mastery.consecutiveCorrect
        );

  const percentage =
    (
      correctRatio +
      accuracyRatio +
      timeRatio +
      streakRatio
    ) /
    4 *
    100;

  return Math.round(
    Math.max(
      0,
      Math.min(100, percentage)
    )
  );
}

/**
 * تحليل المحاولة مقارنة بمعيار المهارة.
 */
export function evaluateAttempt(
  attempt: Attempt,
  skill: Skill
): AttemptEvaluation {
  const progress =
    updateProgress(
      createProgress(
        attempt.skillId
      ),
      attempt
    );

  const tooSlow =
    attempt.timeMs >
    skill.mastery.maxTimePerProblem;

  const timeout =
    attempt.timeMs >
    skill.mastery.maxTimePerProblem;

  return {
    correct: attempt.correct,
    tooSlow,
    timeout,
    timeMs: attempt.timeMs,
    accuracy:
      getAccuracy(progress),
    correctCount:
      progress.correct,
    attempts:
      progress.attempts
  };
}

/**
 * تحديد نوع النقص.
 */
export type SkillWeakness =
  | "accuracy"
  | "speed"
  | "streak"
  | "insufficient-data"
  | "mastered";

/**
 * تحليل سبب عدم إتقان المهارة.
 */
export function diagnoseWeakness(
  progress: SkillProgress,
  skill: Skill
): SkillWeakness {
  if (
    isMastered(
      progress,
      skill
    )
  ) {
    return "mastered";
  }

  if (
    progress.attempts <
    skill.mastery.minCorrect
  ) {
    return "insufficient-data";
  }

  const accuracy =
    getAccuracy(progress);

  if (
    accuracy <
    skill.mastery.accuracy
  ) {
    return "accuracy";
  }

  if (
    progress.avgTimeMs >
    skill.mastery.maxTimePerProblem
  ) {
    return "speed";
  }

  if (
    progress.consecutiveCorrect <
    skill.mastery.consecutiveCorrect
  ) {
    return "streak";
  }

  return "accuracy";
}