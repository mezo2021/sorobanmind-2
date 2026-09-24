import {
  SOROBAN_BANK,
  evaluateBankAnswer,
  type BankQuestion,
  type QuestionEvaluation
} from "../data/bank-linked";

import {
  createProgress,
  updateProgress,
  getAccuracy,
  getMasteryPercentage,
  diagnoseWeakness,
  type SkillWeakness
} from "./masteryTracker";

import type {
  Attempt,
  SkillProgress,
  Skill,
  CurriculumLevel
} from "../curriculum/types";

/**
 * إجابة واحدة في اختبار تحديد المستوى.
 */
export interface PlacementAnswer {
  /** معرف السؤال */
  questionId: string;

  /** إجابة الطفل */
  answer: number;

  /** الزمن بالميلي ثانية */
  timeMs: number;
}

/**
 * نتيجة مستوى واحد.
 */
export interface PlacementLevelResult {
  /** معرف المستوى */
  levelId: string;

  /** عدد الأسئلة */
  total: number;

  /** عدد الصحيح */
  correct: number;

  /** الدقة */
  accuracy: number;

  /** متوسط الزمن */
  averageTimeMs: number;

  /** هل المستوى متقن */
  passed: boolean;
}

/**
 * نتيجة تحديد المستوى.
 */
export interface PlacementResult {
  /** المستوى المقترح */
  recommendedLevelId: string;

  /** النتائج التفصيلية */
  levels: PlacementLevelResult[];

  /** المهارات الضعيفة */
  weakSkills: string[];

  /** القواعد الضعيفة */
  weakRules: string[];

  /** الأسئلة التي تحتاج علاجاً */
  remediationQuestionIds: string[];
}

/**
 * سجل خطأ تعليمي.
 */
export interface LearningError {
  /** معرف السؤال */
  questionId: string;

  /** المهارة */
  skillId: string;

  /** القاعدة */
  ruleId: string;

  /** الحركة */
  movement: string;

  /** نوع العملية */
  operation: string;

  /** الإجابة التي أدخلها الطفل */
  userAnswer: number;

  /** الإجابة الصحيحة */
  correctAnswer: number;

  /** الزمن */
  timeMs: number;

  /** نوع المشكلة */
  issue: QuestionEvaluation["issue"];
}

/**
 * توصية تعليمية.
 */
export interface AdaptiveRecommendation {
  /** معرف السؤال */
  questionId: string;

  /** سبب اختياره */
  reason:
    | "skill-gap"
    | "rule-gap"
    | "movement-gap"
    | "slow-skill"
    | "retry";

  /** أولوية */
  priority: number;

  /** المهارة */
  skillId: string;

  /** القاعدة */
  ruleId: string;
}

/**
 * نتيجة تحديث الأداء.
 */
export interface AdaptiveUpdate {
  /** التقدم الجديد */
  progress: SkillProgress;

  /** نسبة الإتقان */
  masteryPercentage: number;

  /** سبب الضعف */
  weakness: SkillWeakness;

  /** هل المهارة أصبحت متقنة */
  mastered: boolean;
}

/**
 * سحب عشوائي من مصفوفة.
 */
function randomSample<T>(
  values: T[],
  count: number,
  rng: () => number
): T[] {
  if (values.length === 0) {
    return [];
  }

  const copy = [...values];

  for (
    let index = copy.length - 1;
    index > 0;
    index -= 1
  ) {
    const target =
      Math.floor(
        rng() *
          (index + 1)
      );

    [
      copy[index],
      copy[target]
    ] = [
      copy[target],
      copy[index]
    ];
  }

  return copy.slice(
    0,
    Math.min(
      count,
      copy.length
    )
  );
}

/**
 * مولد عشوائي بسيط.
 */
function createRng(
  seed = 20260924
): () => number {
  let value =
    seed >>> 0;

  return (): number => {
    value += 0x6d2b79f5;

    let t = value;

    t = Math.imul(
      t ^ (t >>> 15),
      t | 1
    );

    t ^= t +
      Math.imul(
        t ^ (t >>> 7),
        t | 61
      );

    return (
      (t ^ (t >>> 14)) >>> 0
    ) / 4294967296;
  };
}

/**
 * استخراج رقم المستوى من L01 / L02 ...
 */
function levelNumber(
  levelId: string
): number {
  const match =
    /^L(\d+)$/i.exec(
      levelId
    );

  if (!match) {
    return 0;
  }

  return Number(
    match[1]
  );
}

/**
 * إنشاء اختبار تحديد المستوى.
 *
 * مهم:
 * السحب عشوائي،
 * لكنه موزون حتى لا يهيمن مستوى واحد على الاختبار.
 */
export function createPlacementTest(
  bank: readonly BankQuestion[] = SOROBAN_BANK,
  questionCount = 30,
  seed = Date.now()
): BankQuestion[] {
  if (
    questionCount <= 0 ||
    !Number.isInteger(
      questionCount
    )
  ) {
    throw new RangeError(
      "questionCount must be a positive integer."
    );
  }

  const rng =
    createRng(seed);

  const levelMap =
    new Map<
      string,
      BankQuestion[]
    >();

  for (const question of bank) {
    const existing =
      levelMap.get(
        question.levelId
      );

    if (existing) {
      existing.push(question);
    } else {
      levelMap.set(
        question.levelId,
        [question]
      );
    }
  }

  const levels =
    [...levelMap.keys()]
      .sort(
        (a, b) =>
          levelNumber(a) -
          levelNumber(b)
      );

  if (levels.length === 0) {
    return [];
  }

  const result: BankQuestion[] =
    [];

  const basePerLevel =
    Math.floor(
      questionCount /
        levels.length
    );

  let remainder =
    questionCount %
    levels.length;

  for (const levelId of levels) {
    const levelQuestions =
      levelMap.get(
        levelId
      ) ?? [];

    const requested =
      basePerLevel +
      (remainder > 0
        ? 1
        : 0);

    if (remainder > 0) {
      remainder -= 1;
    }

    result.push(
      ...randomSample(
        levelQuestions,
        requested,
        rng
      )
    );
  }

  if (
    result.length <
    questionCount
  ) {
    const selectedIds =
      new Set(
        result.map(
          question =>
            question.id
        )
      );

    const remaining =
      bank.filter(
        question =>
          !selectedIds.has(
            question.id
          )
      );

    result.push(
      ...randomSample(
        remaining,
        questionCount -
          result.length,
        rng
      )
    );
  }

  return randomSample(
    result,
    Math.min(
      questionCount,
      result.length
    ),
    rng
  );
}

/**
 * تقييم اختبار تحديد المستوى.
 */
export function evaluatePlacementTest(
  questions: readonly BankQuestion[],
  answers: readonly PlacementAnswer[],
  levels?: readonly CurriculumLevel[]
): PlacementResult {
  const answerMap =
    new Map(
      answers.map(
        answer => [
          answer.questionId,
          answer
        ]
      )
    );

  const grouped =
    new Map<
      string,
      {
        total: number;
        correct: number;
        time: number;
      }
    >();

  const weakSkills =
    new Set<string>();

  const weakRules =
    new Set<string>();

  const errors: LearningError[] =
    [];

  for (const question of questions) {
    const answer =
      answerMap.get(
        question.id
      );

    if (!answer) {
      const current =
        grouped.get(
          question.levelId
        ) ?? {
          total: 0,
          correct: 0,
          time: 0
        };

      current.total += 1;

      grouped.set(
        question.levelId,
        current
      );

      weakSkills.add(
        question.skillId
      );

      weakRules.add(
        question.ruleId
      );

      errors.push({
        questionId:
          question.id,
        skillId:
          question.skillId,
        ruleId:
          question.ruleId,
        movement:
          question.movement,
        operation:
          question.operation,
        userAnswer:
          Number.NaN,
        correctAnswer:
          question.correctAnswer,
        timeMs:
          question.maxTimeMs,
        issue:
          "timeout"
      });

      continue;
    }

    const evaluation =
      evaluateBankAnswer(
        question,
        answer.answer,
        answer.timeMs
      );

    const current =
      grouped.get(
        question.levelId
      ) ?? {
        total: 0,
        correct: 0,
        time: 0
      };

    current.total += 1;

    if (evaluation.correct) {
      current.correct += 1;
    }

    current.time +=
      answer.timeMs;

    grouped.set(
      question.levelId,
      current
    );

    if (!evaluation.correct) {
      weakSkills.add(
        question.skillId
      );

      weakRules.add(
        question.ruleId
      );

      errors.push({
        questionId:
          question.id,
        skillId:
          question.skillId,
        ruleId:
          question.ruleId,
        movement:
          question.movement,
        operation:
          question.operation,
        userAnswer:
          answer.answer,
        correctAnswer:
          question.correctAnswer,
        timeMs:
          answer.timeMs,
        issue:
          evaluation.issue
      });
    } else if (
      evaluation.tooSlow
    ) {
      weakSkills.add(
        question.skillId
      );
    }
  }

  const levelResults =
    [...grouped.entries()]
      .map(
        ([levelId, data]) => {
          const accuracy =
            data.total === 0
              ? 0
              : data.correct /
                data.total;

          const averageTime =
            data.total === 0
              ? 0
              : data.time /
                data.total;

          const levelDefinition =
            levels?.find(
              level =>
                level.id ===
                levelId
            );

          const passingScore =
            levelDefinition
              ?.exam
              .passingScore ??
            75;

          const passed =
            accuracy * 100 >=
            passingScore;

          return {
            levelId,
            total:
              data.total,
            correct:
              data.correct,
            accuracy,
            averageTimeMs:
              averageTime,
            passed
          };
        }
      )
      .sort(
        (a, b) =>
          levelNumber(a.levelId) -
          levelNumber(b.levelId)
      );

  let recommendedLevelId =
    levelResults[0]
      ?.levelId ?? "L01";

  for (
    const result of levelResults
  ) {
    if (result.passed) {
      recommendedLevelId =
        result.levelId;
    }
  }

  const remediationQuestionIds =
    selectRemediationQuestions(
      errors,
      SOROBAN_BANK,
      10
    ).map(
      recommendation =>
        recommendation.questionId
    );

  return {
    recommendedLevelId,
    levels:
      levelResults,
    weakSkills:
      [...weakSkills],
    weakRules:
      [...weakRules],
    remediationQuestionIds
  };
}

/**
 * تسجيل محاولة واحدة داخل المحرك التكيفي.
 */
export function processAttempt(
  question: BankQuestion,
  userAnswer: number,
  timeMs: number,
  progress?: SkillProgress
): AdaptiveUpdate {
  const attempt: Attempt = {
    skillId:
      question.skillId,
    correct:
      userAnswer ===
      question.correctAnswer,
    timeMs:
      Math.max(0, timeMs),
    timestamp:
      Date.now()
  };

  const current =
    progress ??
    createProgress(
      question.skillId
    );

  const next =
    updateProgress(
      current,
      attempt
    );

  /**
   * لا نستطيع هنا تحديد mastery
   * من دون Skill definition.
   *
   * لذلك يعاد التشخيص الأساسي
   * عبر progress حتى يتم تمرير Skill
   * في الطبقة الأعلى.
   */
  const percentage =
    next.attempts === 0
      ? 0
      : Math.round(
          getAccuracy(next) *
          100
        );

  return {
    progress: next,
    masteryPercentage:
      percentage,
    weakness:
      !attempt.correct
        ? "accuracy"
        : "streak",
    mastered: false
  };
}

/**
 * إنشاء توصيات علاجية بناءً على الأخطاء.
 */
export function selectRemediationQuestions(
  errors: readonly LearningError[],
  bank: readonly BankQuestion[] = SOROBAN_BANK,
  count = 10
): AdaptiveRecommendation[] {
  if (
    count <= 0 ||
    errors.length === 0
  ) {
    return [];
  }

  const failedSkills =
    new Map<string, number>();

  const failedRules =
    new Map<string, number>();

  const failedMovements =
    new Map<string, number>();

  for (const error of errors) {
    failedSkills.set(
      error.skillId,
      (failedSkills.get(
        error.skillId
      ) ?? 0) + 1
    );

    failedRules.set(
      error.ruleId,
      (failedRules.get(
        error.ruleId
      ) ?? 0) + 1
    );

    failedMovements.set(
      error.movement,
      (failedMovements.get(
        error.movement
      ) ?? 0) + 1
    );
  }

  const candidates =
    bank.map(
      question => {
        const skillScore =
          failedSkills.get(
            question.skillId
          ) ?? 0;

        const ruleScore =
          failedRules.get(
            question.ruleId
          ) ?? 0;

        const movementScore =
          failedMovements.get(
            question.movement
          ) ?? 0;

        const relatedError =
          errors.find(
            error =>
              error.questionId ===
              question.id
          );

        const retryScore =
          relatedError
            ? 5
            : 0;

        const slowScore =
          relatedError &&
          relatedError.issue ===
            "slow"
            ? 3
            : 0;

        const priority =
          skillScore * 10 +
          ruleScore * 7 +
          movementScore * 3 +
          retryScore +
          slowScore;

        let reason:
          AdaptiveRecommendation["reason"];

        if (
          relatedError &&
          relatedError.issue ===
            "slow"
        ) {
          reason =
            "slow-skill";
        } else if (
          relatedError
        ) {
          reason =
            "retry";
        } else if (
          skillScore > 0
        ) {
          reason =
            "skill-gap";
        } else if (
          ruleScore > 0
        ) {
          reason =
            "rule-gap";
        } else {
          reason =
            "movement-gap";
        }

        return {
          questionId:
            question.id,
          reason,
          priority,
          skillId:
            question.skillId,
          ruleId:
            question.ruleId
        };
      }
    );

  return candidates
    .filter(
      candidate =>
        candidate.priority > 0
    )
    .sort(
      (a, b) =>
        b.priority -
        a.priority
    )
    .slice(
      0,
      count
    );
}

/**
 * بناء جلسة علاجية من خطأ محدد.
 */
export function buildRemediationSession(
  questionId: string,
  count = 5,
  bank: readonly BankQuestion[] = SOROBAN_BANK
): BankQuestion[] {
  const source =
    bank.find(
      question =>
        question.id ===
        questionId
    );

  if (!source) {
    return [];
  }

  /**
   * نعطي الأولوية:
   * 1. نفس المهارة.
   * 2. نفس القاعدة.
   * 3. نفس الحركة.
   */
  const candidates =
    bank
      .filter(
        question =>
          question.id !==
          source.id
      )
      .map(
        question => {
          let score = 0;

          if (
            question.skillId ===
            source.skillId
          ) {
            score += 100;
          }

          if (
            question.ruleId ===
            source.ruleId
          ) {
            score += 70;
          }

          if (
            question.movement ===
            source.movement
          ) {
            score += 30;
          }

          if (
            Math.abs(
              question.difficulty -
                source.difficulty
            ) <= 1
          ) {
            score += 10;
          }

          return {
            question,
            score
          };
        }
      )
      .filter(
        item =>
          item.score > 0
      )
      .sort(
        (a, b) =>
          b.score -
          a.score
      );

  return candidates
    .slice(
      0,
      count
    )
    .map(
      item =>
        item.question
    );
}

/**
 * تحديد المهارات الأضعف من سجل المحاولات.
 */
export function findWeakSkills(
  attempts: readonly Attempt[]
): string[] {
  const statistics =
    new Map<
      string,
      {
        attempts: number;
        correct: number;
        time: number;
      }
    >();

  for (const attempt of attempts) {
    const current =
      statistics.get(
        attempt.skillId
      ) ?? {
        attempts: 0,
        correct: 0,
        time: 0
      };

    current.attempts += 1;

    if (attempt.correct) {
      current.correct += 1;
    }

    current.time +=
      attempt.timeMs;

    statistics.set(
      attempt.skillId,
      current
    );
  }

  return [...statistics.entries()]
    .map(
      ([skillId, data]) => ({
        skillId,
        accuracy:
          data.attempts === 0
            ? 0
            : data.correct /
              data.attempts,
        averageTime:
          data.attempts === 0
            ? 0
            : data.time /
              data.attempts
      })
    )
    .sort(
      (a, b) =>
        a.accuracy -
        b.accuracy ||
        b.averageTime -
          a.averageTime
    )
    .map(
      item =>
        item.skillId
    );
}

/**
 * إنشاء توصية مباشرة من SkillProgress.
 */
export function diagnoseSkill(
  progress: SkillProgress,
  skill: Skill
): {
  weakness: SkillWeakness;
  masteryPercentage: number;
  mastered: boolean;
} {
  return {
    weakness:
      diagnoseWeakness(
        progress,
        skill
      ),
    masteryPercentage:
      getMasteryPercentage(
        progress,
        skill
      ),
    mastered:
      getMasteryPercentage(
        progress,
        skill
      ) >= 100
  };
}