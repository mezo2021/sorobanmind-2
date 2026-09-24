import type { MovementType, Problem } from "../curriculum/types";

/**
 * نوع العملية الحسابية في بنك السوروبان.
 */
export type BankOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "read"
  | "build";

/**
 * مستوى الصعوبة.
 */
export type Difficulty = 1 | 2 | 3 | 4 | 5;

/**
 * الخانات المستخدمة في السؤال.
 */
export type PlaceValue =
  | "units"
  | "tens"
  | "hundreds"
  | "thousands"
  | "decimal";

/**
 * قاعدة السوروبان التي يعتمد عليها السؤال.
 */
export interface SorobanRule {
  /** معرف القاعدة */
  id: string;

  /** اسم القاعدة */
  name: string;

  /** الوصف العربي */
  description: string;

  /** نوع الحركة */
  movement: MovementType;

  /** المهارة التي تنتمي إليها القاعدة */
  skillId: string;
}

/**
 * السؤال الكامل داخل بنك الأسئلة.
 *
 * الهدف من هذا الشكل أن يستطيع النظام لاحقاً معرفة:
 * لماذا أُعطي السؤال؟
 * ما المهارة التي يقيسها؟
 * ما القاعدة التي يختبرها؟
 * كم الزمن المتوقع؟
 * وما نوع الخطأ إذا أخطأ الطفل؟
 */
export interface BankQuestion {
  /** معرف فريد للسؤال */
  id: string;

  /** رقم المستوى */
  levelId: string;

  /** ترتيب السؤال داخل المستوى */
  levelOrder: number;

  /** معرف المهارة */
  skillId: string;

  /** معرف القاعدة */
  ruleId: string;

  /** تصنيف السؤال */
  category: string;

  /** نص السؤال */
  prompt: string;

  /** المعاملات الرقمية */
  operands: number[];

  /** العملية */
  operation: BankOperation;

  /** الإجابة الصحيحة */
  correctAnswer: number;

  /** نوع حركة السوروبان */
  movement: MovementType;

  /** مستوى الصعوبة */
  difficulty: Difficulty;

  /** عدد الخانات */
  digits: number;

  /** الخانات التي يستخدمها السؤال */
  placeValues: PlaceValue[];

  /** هل يوجد حمل */
  hasCarry: boolean;

  /** هل يوجد استلاف */
  hasBorrow: boolean;

  /** الزمن المتوقع بالميلي ثانية */
  expectedTimeMs: number;

  /** الزمن الأقصى المقبول بالميلي ثانية */
  maxTimeMs: number;

  /** شرح الحل */
  explanation: string;

  /** شرح الحركة */
  movementExplanation: string;

  /** المهارة السابقة المطلوبة */
  prerequisites: string[];

  /** كلمات مفتاحية لتحليل الأخطاء */
  tags: string[];

  /** معرف السؤال الأصلي إن كان من البنك الأصلي */
  sourceId?: string;
}

/**
 * نتيجة تحليل سؤال واحد.
 */
export interface QuestionEvaluation {
  /** هل الإجابة صحيحة؟ */
  correct: boolean;

  /** الإجابة التي أدخلها الطفل */
  userAnswer: number;

  /** الإجابة الصحيحة */
  correctAnswer: number;

  /** الزمن بالميلي ثانية */
  timeMs: number;

  /** هل تجاوز الزمن المتوقع */
  tooSlow: boolean;

  /** هل تجاوز الزمن الأقصى */
  timeout: boolean;

  /** نسبة الأداء في الزمن */
  speedRatio: number;

  /** نوع المشكلة المكتشفة */
  issue:
    | "none"
    | "wrong-answer"
    | "slow"
    | "timeout"
    | "wrong-and-slow";
}

/**
 * مولد أرقام شبه عشوائي قابل لإعادة الإنتاج.
 */
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

/**
 * رقم صحيح عشوائي.
 */
function randomInt(
  min: number,
  max: number,
  rng: () => number
): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * خلط مصفوفة.
 */
function shuffle<T>(
  values: T[],
  rng: () => number
): T[] {
  const result = [...values];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(rng() * (index + 1));

    const current = result[index];

    result[index] = result[target];
    result[target] = current;
  }

  return result;
}

/**
 * حساب عدد الخانات.
 */
function getDigits(value: number): number {
  const absolute = Math.abs(Math.trunc(value));

  if (absolute === 0) {
    return 1;
  }

  return String(absolute).length;
}

/**
 * تحديد الخانات المستخدمة.
 */
function getPlaceValues(
  operands: number[],
  answer: number
): PlaceValue[] {
  const values = [...operands, answer];

  const maxDigits = Math.max(
    ...values.map(getDigits)
  );

  if (maxDigits >= 4) {
    return [
      "units",
      "tens",
      "hundreds",
      "thousands"
    ];
  }

  if (maxDigits === 3) {
    return [
      "units",
      "tens",
      "hundreds"
    ];
  }

  if (maxDigits === 2) {
    return [
      "units",
      "tens"
    ];
  }

  return ["units"];
}

/**
 * اختبار الحمل في الجمع.
 */
function hasAdditionCarry(
  left: number,
  right: number
): boolean {
  const maxDigits = Math.max(
    getDigits(left),
    getDigits(right)
  );

  for (let position = 0; position < maxDigits; position += 1) {
    const divisor = Math.pow(10, position);

    const leftDigit =
      Math.floor(left / divisor) % 10;

    const rightDigit =
      Math.floor(right / divisor) % 10;

    if (leftDigit + rightDigit >= 10) {
      return true;
    }
  }

  return false;
}

/**
 * اختبار الاستلاف في الطرح.
 */
function hasSubtractionBorrow(
  left: number,
  right: number
): boolean {
  const maxDigits = Math.max(
    getDigits(left),
    getDigits(right)
  );

  for (let position = 0; position < maxDigits; position += 1) {
    const divisor = Math.pow(10, position);

    const leftDigit =
      Math.floor(left / divisor) % 10;

    const rightDigit =
      Math.floor(right / divisor) % 10;

    if (leftDigit < rightDigit) {
      return true;
    }
  }

  return false;
}

/**
 * بيانات المستوى الأول.
 */
const LEVEL_ONE_CONFIG = {
  levelId: "L01",
  skillId: "L01.S01",
  ruleId: "L01.R01",
  category: "الجمع والطرح المباشر",
  movement: "direct" as MovementType,
  expectedTimeMs: 8000,
  maxTimeMs: 12000
};

/**
 * بيانات المستوى الثاني.
 */
const LEVEL_TWO_CONFIG = {
  levelId: "L02",
  skillId: "L02.S01",
  ruleId: "L02.R01",
  category: "أصدقاء العدد 5",
  movement: "five-friend-add" as MovementType,
  expectedTimeMs: 12000,
  maxTimeMs: 18000
};

/**
 * بيانات المستوى الثالث.
 */
const LEVEL_THREE_CONFIG = {
  levelId: "L03",
  skillId: "L03.S01",
  ruleId: "L03.R01",
  category: "أصدقاء العدد 10",
  movement: "ten-friend-add" as MovementType,
  expectedTimeMs: 14000,
  maxTimeMs: 22000
};

/**
 * بيانات المستوى الرابع.
 */
const LEVEL_FOUR_CONFIG = {
  levelId: "L04",
  skillId: "L04.S01",
  ruleId: "L04.R01",
  category: "القواعد المركبة 5 و10",
  movement: "mixed" as MovementType,
  expectedTimeMs: 18000,
  maxTimeMs: 28000
};

/**
 * بيانات المستوى الخامس.
 */
const LEVEL_FIVE_CONFIG = {
  levelId: "L05",
  skillId: "L05.S01",
  ruleId: "L05.R01",
  category: "الأعداد الكبيرة والعشرية",
  movement: "mixed" as MovementType,
  expectedTimeMs: 25000,
  maxTimeMs: 40000
};

/**
 * بيانات المستوى السادس.
 */
const LEVEL_SIX_CONFIG = {
  levelId: "L06",
  skillId: "L06.S01",
  ruleId: "L06.R01",
  category: "الضرب بالسوروبان",
  movement: "mixed" as MovementType,
  expectedTimeMs: 30000,
  maxTimeMs: 45000
};

/**
 * بيانات المستوى السابع.
 */
const LEVEL_SEVEN_CONFIG = {
  levelId: "L07",
  skillId: "L07.S01",
  ruleId: "L07.R01",
  category: "القسمة بالسوروبان",
  movement: "mixed" as MovementType,
  expectedTimeMs: 35000,
  maxTimeMs: 50000
};

/**
 * إنشاء سؤال جمع.
 */
function createAdditionQuestion(
  id: string,
  levelOrder: number,
  levelId: string,
  skillId: string,
  ruleId: string,
  category: string,
  movement: MovementType,
  left: number,
  right: number,
  difficulty: Difficulty,
  expectedTimeMs: number,
  maxTimeMs: number,
  explanation: string
): BankQuestion {
  const answer = left + right;

  return {
    id,
    levelId,
    levelOrder,
    skillId,
    ruleId,
    category,
    prompt: `${left} + ${right} = ؟`,
    operands: [left, right],
    operation: "addition",
    correctAnswer: answer,
    movement,
    difficulty,
    digits: getDigits(answer),
    placeValues: getPlaceValues(
      [left, right],
      answer
    ),
    hasCarry: hasAdditionCarry(left, right),
    hasBorrow: false,
    expectedTimeMs,
    maxTimeMs,
    explanation,
    movementExplanation:
      movement === "direct"
        ? "تحريك الخرزات مباشرة دون استخدام مكملات."
        : "استخدام قاعدة المكمل المناسبة ثم متابعة الحركة على المعداد.",
    prerequisites: [],
    tags: [
      category,
      movement,
      hasAdditionCarry(left, right)
        ? "carry"
        : "no-carry"
    ]
  };
}

/**
 * إنشاء سؤال طرح.
 */
function createSubtractionQuestion(
  id: string,
  levelOrder: number,
  levelId: string,
  skillId: string,
  ruleId: string,
  category: string,
  movement: MovementType,
  left: number,
  right: number,
  difficulty: Difficulty,
  expectedTimeMs: number,
  maxTimeMs: number,
  explanation: string
): BankQuestion {
  const answer = left - right;

  return {
    id,
    levelId,
    levelOrder,
    skillId,
    ruleId,
    category,
    prompt: `${left} - ${right} = ؟`,
    operands: [left, right],
    operation: "subtraction",
    correctAnswer: answer,
    movement,
    difficulty,
    digits: getDigits(left),
    placeValues: getPlaceValues(
      [left, right],
      answer
    ),
    hasCarry: false,
    hasBorrow: hasSubtractionBorrow(
      left,
      right
    ),
    expectedTimeMs,
    maxTimeMs,
    explanation,
    movementExplanation:
      movement === "direct"
        ? "إبعاد الخرزات المطلوبة مباشرة."
        : "استخدام مكمل العدد المناسب ثم إكمال الحركة.",
    prerequisites: [],
    tags: [
      category,
      movement,
      hasSubtractionBorrow(left, right)
        ? "borrow"
        : "no-borrow"
    ]
  };
}

/**
 * إنشاء سؤال ضرب.
 */
function createMultiplicationQuestion(
  id: string,
  levelOrder: number,
  left: number,
  right: number,
  difficulty: Difficulty,
  rng: () => number
): BankQuestion {
  const answer = left * right;

  return {
    id,
    levelId: LEVEL_SIX_CONFIG.levelId,
    levelOrder,
    skillId: LEVEL_SIX_CONFIG.skillId,
    ruleId: LEVEL_SIX_CONFIG.ruleId,
    category: LEVEL_SIX_CONFIG.category,
    prompt: `${left} × ${right} = ؟`,
    operands: [left, right],
    operation: "multiplication",
    correctAnswer: answer,
    movement: LEVEL_SIX_CONFIG.movement,
    difficulty,
    digits: getDigits(answer),
    placeValues: getPlaceValues(
      [left, right],
      answer
    ),
    hasCarry: answer >= 10,
    hasBorrow: false,
    expectedTimeMs:
      LEVEL_SIX_CONFIG.expectedTimeMs,
    maxTimeMs:
      LEVEL_SIX_CONFIG.maxTimeMs,
    explanation:
      `نحسب ${left} × ${right} ثم نمثل الناتج على أعمدة السوروبان.`,
    movementExplanation:
      "تمثيل الناتج الجزئي والمتابعة عبر الخانات.",
    prerequisites: ["L05.S01"],
    tags: [
      LEVEL_SIX_CONFIG.category,
      "multiplication",
      `factor-${Math.min(left, right)}`,
      `factor-${Math.max(left, right)}`,
      `random-${Math.floor(rng() * 1000)}`
    ]
  };
}

/**
 * إنشاء سؤال قسمة.
 */
function createDivisionQuestion(
  id: string,
  levelOrder: number,
  divisor: number,
  quotient: number,
  difficulty: Difficulty
): BankQuestion {
  const dividend = divisor * quotient;

  return {
    id,
    levelId: LEVEL_SEVEN_CONFIG.levelId,
    levelOrder,
    skillId: LEVEL_SEVEN_CONFIG.skillId,
    ruleId: LEVEL_SEVEN_CONFIG.ruleId,
    category: LEVEL_SEVEN_CONFIG.category,
    prompt: `${dividend} ÷ ${divisor} = ؟`,
    operands: [dividend, divisor],
    operation: "division",
    correctAnswer: quotient,
    movement: LEVEL_SEVEN_CONFIG.movement,
    difficulty,
    digits: getDigits(dividend),
    placeValues: getPlaceValues(
      [dividend, divisor],
      quotient
    ),
    hasCarry: false,
    hasBorrow: false,
    expectedTimeMs:
      LEVEL_SEVEN_CONFIG.expectedTimeMs,
    maxTimeMs:
      LEVEL_SEVEN_CONFIG.maxTimeMs,
    explanation:
      `نقسم ${dividend} على ${divisor} للوصول إلى الناتج ${quotient}.`,
    movementExplanation:
      "تمثيل الناتج تدريجياً على أعمدة السوروبان.",
    prerequisites: ["L06.S01"],
    tags: [
      LEVEL_SEVEN_CONFIG.category,
      "division",
      `divisor-${divisor}`
    ]
  };
}

/**
 * توليد المستوى الأول.
 */
function generateLevelOne(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const left = randomInt(1, 9, rng);
    const right = randomInt(1, 9, rng);

    const addition =
      rng() >= 0.5;

    const expression = addition
      ? `${left}+${right}`
      : `${Math.max(left, right)}-${Math.min(left, right)}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    if (addition) {
      questions.push(
        createAdditionQuestion(
          `L01.Q${String(questions.length + 1).padStart(3, "0")}`,
          questions.length + 1,
          LEVEL_ONE_CONFIG.levelId,
          LEVEL_ONE_CONFIG.skillId,
          LEVEL_ONE_CONFIG.ruleId,
          LEVEL_ONE_CONFIG.category,
          LEVEL_ONE_CONFIG.movement,
          left,
          right,
          1,
          LEVEL_ONE_CONFIG.expectedTimeMs,
          LEVEL_ONE_CONFIG.maxTimeMs,
          `جمع مباشر للعددين ${left} و${right}.`
        )
      );
    } else {
      const greater = Math.max(left, right);
      const smaller = Math.min(left, right);

      questions.push(
        createSubtractionQuestion(
          `L01.Q${String(questions.length + 1).padStart(3, "0")}`,
          questions.length + 1,
          LEVEL_ONE_CONFIG.levelId,
          LEVEL_ONE_CONFIG.skillId,
          LEVEL_ONE_CONFIG.ruleId,
          LEVEL_ONE_CONFIG.category,
          LEVEL_ONE_CONFIG.movement,
          greater,
          smaller,
          1,
          LEVEL_ONE_CONFIG.expectedTimeMs,
          LEVEL_ONE_CONFIG.maxTimeMs,
          `طرح مباشر للعدد ${smaller} من ${greater}.`
        )
      );
    }
  }

  return questions;
}

/**
 * توليد المستوى الثاني: أصدقاء 5.
 */
function generateLevelTwo(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const base = randomInt(1, 4, rng);
    const partner = randomInt(
      1,
      5 - base,
      rng
    );

    const expression =
      `${base}+${partner}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    questions.push(
      createAdditionQuestion(
        `L02.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_TWO_CONFIG.levelId,
        LEVEL_TWO_CONFIG.skillId,
        LEVEL_TWO_CONFIG.ruleId,
        LEVEL_TWO_CONFIG.category,
        LEVEL_TWO_CONFIG.movement,
        base,
        partner,
        2,
        LEVEL_TWO_CONFIG.expectedTimeMs,
        LEVEL_TWO_CONFIG.maxTimeMs,
        `نستخدم مكملات الخمسة للوصول إلى ${base + partner}.`
      )
    );
  }

  return questions;
}

/**
 * توليد المستوى الثالث: أصدقاء 10.
 */
function generateLevelThree(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const left = randomInt(6, 9, rng);
    const right = randomInt(
      10 - left,
      9,
      rng
    );

    const expression =
      `${left}+${right}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    questions.push(
      createAdditionQuestion(
        `L03.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_THREE_CONFIG.levelId,
        LEVEL_THREE_CONFIG.skillId,
        LEVEL_THREE_CONFIG.ruleId,
        LEVEL_THREE_CONFIG.category,
        LEVEL_THREE_CONFIG.movement,
        left,
        right,
        3,
        LEVEL_THREE_CONFIG.expectedTimeMs,
        LEVEL_THREE_CONFIG.maxTimeMs,
        `نستخدم مكمل العدد 10 لأن الجمع يتجاوز العشرة.`
      )
    );
  }

  return questions;
}

/**
 * توليد المستوى الرابع: القواعد المركبة.
 */
function generateLevelFour(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const left = randomInt(5, 9, rng);
    const right = randomInt(6, 9, rng);

    const expression =
      `${left}+${right}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    questions.push(
      createAdditionQuestion(
        `L04.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        LEVEL_FOUR_CONFIG.levelId,
        LEVEL_FOUR_CONFIG.skillId,
        LEVEL_FOUR_CONFIG.ruleId,
        LEVEL_FOUR_CONFIG.category,
        LEVEL_FOUR_CONFIG.movement,
        left,
        right,
        4,
        LEVEL_FOUR_CONFIG.expectedTimeMs,
        LEVEL_FOUR_CONFIG.maxTimeMs,
        `تطبيق القاعدة المركبة للجمع ${right}+ عند عدم توفر الحركة المباشرة.`
      )
    );
  }

  return questions;
}

/**
 * توليد المستوى الخامس.
 */
function generateLevelFive(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const left = randomInt(
      100,
      9999,
      rng
    );

    const right = randomInt(
      10,
      Math.min(left, 9999),
      rng
    );

    const addition =
      rng() >= 0.5;

    const greater = Math.max(
      left,
      right
    );

    const smaller = Math.min(
      left,
      right
    );

    const expression = addition
      ? `${left}+${right}`
      : `${greater}-${smaller}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    if (addition) {
      questions.push(
        createAdditionQuestion(
          `L05.Q${String(questions.length + 1).padStart(3, "0")}`,
          questions.length + 1,
          LEVEL_FIVE_CONFIG.levelId,
          LEVEL_FIVE_CONFIG.skillId,
          LEVEL_FIVE_CONFIG.ruleId,
          LEVEL_FIVE_CONFIG.category,
          LEVEL_FIVE_CONFIG.movement,
          left,
          right,
          5,
          LEVEL_FIVE_CONFIG.expectedTimeMs,
          LEVEL_FIVE_CONFIG.maxTimeMs,
          "تطبيق قواعد الجمع عبر عدة خانات مع الحمل عند الحاجة."
        )
      );
    } else {
      questions.push(
        createSubtractionQuestion(
          `L05.Q${String(questions.length + 1).padStart(3, "0")}`,
          questions.length + 1,
          LEVEL_FIVE_CONFIG.levelId,
          LEVEL_FIVE_CONFIG.skillId,
          LEVEL_FIVE_CONFIG.ruleId,
          LEVEL_FIVE_CONFIG.category,
          LEVEL_FIVE_CONFIG.movement,
          greater,
          smaller,
          5,
          LEVEL_FIVE_CONFIG.expectedTimeMs,
          LEVEL_FIVE_CONFIG.maxTimeMs,
          "تطبيق قواعد الطرح عبر عدة خانات مع الاستلاف عند الحاجة."
        )
      );
    }
  }

  return questions;
}

/**
 * توليد المستوى السادس.
 */
function generateLevelSix(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const left = randomInt(2, 99, rng);
    const right = randomInt(2, 9, rng);

    const expression =
      `${left}*${right}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    questions.push(
      createMultiplicationQuestion(
        `L06.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        left,
        right,
        5,
        rng
      )
    );
  }

  return questions;
}

/**
 * توليد المستوى السابع.
 */
function generateLevelSeven(
  count: number,
  rng: () => number
): BankQuestion[] {
  const questions: BankQuestion[] = [];
  const used = new Set<string>();

  while (questions.length < count) {
    const divisor = randomInt(2, 25, rng);
    const quotient = randomInt(2, 99, rng);

    const expression =
      `${divisor}*${quotient}`;

    if (used.has(expression)) {
      continue;
    }

    used.add(expression);

    questions.push(
      createDivisionQuestion(
        `L07.Q${String(questions.length + 1).padStart(3, "0")}`,
        questions.length + 1,
        divisor,
        quotient,
        5
      )
    );
  }

  return questions;
}

/**
 * بناء بنك SorobanMind.
 *
 * التوزيع:
 * L01 = 70
 * L02 = 70
 * L03 = 70
 * L04 = 70
 * L05 = 100
 * L06 = 60
 * L07 = 60
 *
 * المجموع = 500 سؤال.
 */
function buildBank(seed = 20260924): BankQuestion[] {
  const rng = createRng(seed);

  const levels = [
    ...generateLevelOne(70, rng),
    ...generateLevelTwo(70, rng),
    ...generateLevelThree(70, rng),
    ...generateLevelFour(70, rng),
    ...generateLevelFive(100, rng),
    ...generateLevelSix(60, rng),
    ...generateLevelSeven(60, rng)
  ];

  if (levels.length !== 500) {
    throw new Error(
      `SorobanMind bank must contain exactly 500 questions. Current count: ${levels.length}`
    );
  }

  return shuffle(levels, rng);
}

/**
 * بنك الأسئلة الرئيسي.
 */
export const SOROBAN_BANK: readonly BankQuestion[] =
  Object.freeze(buildBank());

/**
 * عدد الأسئلة.
 */
export const BANK_SIZE =
  SOROBAN_BANK.length;

/**
 * الحصول على سؤال بالمعرف.
 */
export function getQuestionById(
  id: string
): BankQuestion | undefined {
  return SOROBAN_BANK.find(
    question => question.id === id
  );
}

/**
 * الحصول على أسئلة مستوى معين.
 */
export function getQuestionsByLevel(
  levelId: string
): BankQuestion[] {
  return SOROBAN_BANK.filter(
    question => question.levelId === levelId
  );
}

/**
 * الحصول على أسئلة مهارة معينة.
 */
export function getQuestionsBySkill(
  skillId: string
): BankQuestion[] {
  return SOROBAN_BANK.filter(
    question => question.skillId === skillId
  );
}

/**
 * الحصول على أسئلة قاعدة معينة.
 */
export function getQuestionsByRule(
  ruleId: string
): BankQuestion[] {
  return SOROBAN_BANK.filter(
    question => question.ruleId === ruleId
  );
}

/**
 * الحصول على أسئلة حركة معينة.
 */
export function getQuestionsByMovement(
  movement: MovementType
): BankQuestion[] {
  return SOROBAN_BANK.filter(
    question => question.movement === movement
  );
}

/**
 * تحويل سؤال البنك إلى Problem يستخدمه محرك الأسئلة.
 */
export function bankQuestionToProblem(
  question: BankQuestion
): Problem {
  const operation =
    question.operation === "addition"
      ? "+"
      : question.operation === "subtraction"
        ? "-"
        : question.operation === "read"
          ? "read"
          : "build";

  return {
    operands: question.operands,
    operation,
    movement: question.movement,
    expectedAnswer: question.correctAnswer,
    difficulty: question.difficulty
  };
}

/**
 * تقييم إجابة الطفل.
 *
 * هذه الدالة لا تسجل النتيجة في Zustand.
 * هي فقط تختبر:
 * 1. صحة الإجابة.
 * 2. الزمن.
 * 3. هل الطفل بطيء؟
 * 4. هل تجاوز الزمن الأقصى؟
 */
export function evaluateBankAnswer(
  question: BankQuestion,
  userAnswer: number,
  timeMs: number
): QuestionEvaluation {
  const correct =
    userAnswer === question.correctAnswer;

  const safeTime =
    Math.max(0, timeMs);

  const tooSlow =
    safeTime > question.expectedTimeMs;

  const timeout =
    safeTime > question.maxTimeMs;

  const speedRatio =
    question.expectedTimeMs === 0
      ? 1
      : Math.min(
          2,
          safeTime /
            question.expectedTimeMs
        );

  let issue: QuestionEvaluation["issue"];

  if (correct && timeout) {
    issue = "timeout";
  } else if (!correct && timeout) {
    issue = "wrong-and-slow";
  } else if (!correct) {
    issue = "wrong-answer";
  } else if (tooSlow) {
    issue = "slow";
  } else {
    issue = "none";
  }

  return {
    correct,
    userAnswer,
    correctAnswer:
      question.correctAnswer,
    timeMs: safeTime,
    tooSlow,
    timeout,
    speedRatio,
    issue
  };
}