// src/curriculum/types.ts

/**
 * نوع الحركة الحسابية المطلوبة على السوروبان.
 */
export type MovementType =
  | "direct"
  | "five-friend-add"
  | "five-friend-sub"
  | "ten-friend-add"
  | "ten-friend-sub"
  | "carry"
  | "borrow"
  | "mixed";

/**
 * نوع المسألة التي يمكن لمحرك التوليد إنتاجها.
 */
export type ProblemGeneratorType =
  | "numbers"
  | "build-soroban"
  | "read-soroban"
  | "add-subtract";

/**
 * الفئة المستهدفة.
 */
export type Category = "kids" | "teens";

/**
 * مجموعة المنهج.
 */
export type CurriculumGroup =
  | "fundamentals"
  | "japaneseRules"
  | "expansion"
  | "mental"
  | "majorOps"
  | "mastery";

/**
 * مواصفات مولد المسائل.
 */
export interface ProblemGeneratorSpec {
  /** نوع مولد المسألة */
  type: ProblemGeneratorType;

  /** القيود المستخدمة أثناء التوليد */
  constraints: ProblemGeneratorConstraints;

  /**
   * بذرة عشوائية اختيارية.
   *
   * أبقيناها هنا أيضاً لأن problemGenerator.ts
   * يستخدم spec.seed مباشرة.
   */
  seed?: number;
}

/**
 * القيود المستخدمة عند توليد المسائل.
 */
export interface ProblemGeneratorConstraints {
  /** الحد الأدنى للقيمة */
  min?: number;

  /** الحد الأعلى للقيمة */
  max?: number;

  /** عدد الخانات المطلوبة */
  digits?: number;

  /** نوع حركة واحد محدد */
  movement?: MovementType;

  /** أنواع الحركات المسموح بها */
  allowedMovements?: MovementType[];

  /**
   * اسم بديل مستخدم في problemGenerator.ts
   * لقائمة أنواع الحركات.
   */
  movementTypes?: MovementType[];

  /** درجة صعوبة المسألة */
  difficulty?: number;

  /** بذرة عشوائية لإعادة إنتاج النتائج */
  seed?: number;

  /** عدد الحدود في المسألة */
  termsCount?: number;

  /** العمليات الحسابية المسموح بها */
  operations?: Array<"+" | "-" | "×" | "÷">;

  /** الأرقام المسموح باستخدامها */
  allowedNumbers?: number[];

  /** المهارة المستهدفة */
  skillId?: SkillId;
}

/**
 * مثال محلول يوضح طريقة التفكير والحركة.
 */
export interface WorkedExample {
  /** الأرقام الداخلة في المثال */
  operands: number[];

  /** العملية المستخدمة */
  operation: string;

  /** خطوات الحل */
  steps: string[];

  /** الإجابة النهائية */
  answer: number;
}

/**
 * خطأ شائع يقع فيه الطفل.
 */
export interface CommonMistake {
  /** الإجابة الخاطئة المحتملة */
  wrongAnswer: string;

  /** سبب الخطأ */
  whyWrong: string;

  /** الحركة الصحيحة */
  correctMovement: string;
}

/**
 * معيار إتقان المهارة.
 */
export interface MasteryCriteria {
  /** الحد الأدنى لعدد الإجابات الصحيحة */
  minCorrect: number;

  /** نسبة الدقة المطلوبة من 0 إلى 1 */
  accuracy: number;

  /** أقصى زمن مسموح للمسألة بالميلي ثانية */
  maxTimePerProblem: number;

  /** عدد الإجابات الصحيحة المتتالية المطلوبة */
  consecutiveCorrect: number;
}

/**
 * مهارة تعليمية كاملة داخل المنهج.
 */
export interface Skill {
  /** المعرّف الفريد للمهارة */
  id: string;

  /** اسم المهارة */
  name: string;

  /** وصف المهارة */
  description: string;

  /** المهارات السابقة المطلوبة */
  prerequisites: string[];

  /** نوع الحركة الأساسية */
  movementType: MovementType;

  /** معايير الإتقان */
  mastery: MasteryCriteria;

  /** مواصفات مولد المسائل */
  generator: ProblemGeneratorSpec;

  /** المحتوى التعليمي */
  content: {
    /** الهدف التعليمي */
    goal: string;

    /** المعرفة المطلوبة */
    knowledge: string;

    /** القاعدة */
    rule: string;

    /** الشرح المبسط للطفل */
    childExplanation: string;

    /** حركة الأصابع */
    fingerMovement: string;

    /** الأمثلة المحلولة */
    examples: WorkedExample[];

    /** الأخطاء الشائعة */
    commonMistakes: CommonMistake[];
  };
}

/**
 * اختبار نهاية المستوى.
 */
export interface LevelExam {
  /** معرّف الاختبار */
  id: string;

  /** مدة الاختبار بالثواني */
  durationSec: number;

  /** عدد المسائل */
  problemsCount: number;

  /** نسبة النجاح المطلوبة */
  passingScore: number;

  /** مولد أسئلة الاختبار */
  generator: ProblemGeneratorSpec;
}

/**
 * محتوى ثنائي اللغة.
 */
export interface LocalizedText {
  /** النص العربي */
  ar: string;

  /** النص الإنكليزي */
  en: string;
}

/**
 * المستوى الكامل في المنهج.
 */
export interface CurriculumLevel {
  /** معرّف المستوى */
  id: string;

  /** الرقم التسلسلي */
  number: number;

  /** اسم المستوى */
  name: LocalizedText;

  /** وصف المستوى */
  description: LocalizedText;

  /** المجموعة */
  group: CurriculumGroup | "enrichment";

  /** الفئة المستهدفة */
  category: Category | "both";

  /** المتطلبات السابقة */
  prerequisites: string[];

  /** مهارات المستوى */
  skills: Skill[];

  /** اختبار المستوى */
  exam: LevelExam;

  /** معلومات إضافية */
  metadata: {
    /** الساعات التقديرية */
    estimatedHours: number;

    /** العمر المستهدف */
    targetAge: [number, number];

    /** التوافق مع المنهج الياباني */
    japanAlignment?: string;

    /** هل المستوى إثرائي */
    isEnrichment?: boolean;
  };

  /** اسم أيقونة Lucide */
  icon: string;

  /** كلاس لون Tailwind */
  color: string;
}

/**
 * خطوة واحدة في حل المسألة على السوروبان.
 */
export interface SolveStep {
  /** رقم العمود */
  rod: number;

  /** نوع الحركة */
  action:
    | "add-lower"
    | "sub-lower"
    | "add-upper"
    | "sub-upper"
    | "carry"
    | "borrow"
    | "read";

  /** عدد الخرزات */
  count: number;

  /** قاعدة الحركة */
  rule: MovementType;

  /** مفتاح وصف الحركة */
  descriptionKey: string;

  /** معاملات وصف الحركة */
  descriptionParams: Record<string, string | number>;
}

/**
 * مسألة واحدة.
 *
 * العملية هنا مفردة لأن كل Problem يمثل سؤالاً واحداً.
 */
export interface Problem {
  /** المعرّف الفريد للمسألة */
  id?: string;

  /** الأرقام الداخلة في المسألة */
  operands: number[];

  /**
   * العملية الفعلية للمسألة.
   *
   * العمليات الحسابية:
   * + جمع
   * - طرح
   * × ضرب
   * ÷ قسمة
   *
   * read قراءة السوروبان
   * build بناء السوروبان
   */
  operation: "+" | "-" | "×" | "÷" | "read" | "build";

  /** نوع الحركة المطلوبة */
  movement: MovementType;

  /** الإجابة الصحيحة */
  expectedAnswer: number;

  /** مستوى الصعوبة */
  difficulty: number;

  /**
   * خطوات الحل.
   *
   * اختيارية لأن بنك الأسئلة الحالي لا يرسلها
   * في كل سؤال، بينما يمكن للمولد إنتاجها لاحقاً.
   */
  steps?: SolveStep[];

  /** المهارة التي يقيسها السؤال */
  skillId?: SkillId;

  /** قاعدة السوروبان المستهدفة */
  ruleId?: string;

  /** نص السؤال */
  question?: string;

  /** الشرح التعليمي */
  explanation?: string;

  /** الزمن المستهدف بالميلي ثانية */
  targetTimeMs?: number;

  /** مصدر السؤال */
  source?: string;
}

/**
 * حالة عمود واحد على السوروبان.
 */
export interface RodState {
  /** الخرزة العلوية */
  upper: 0 | 1;

  /** عدد الخرزات السفلية */
  lower: 0 | 1 | 2 | 3 | 4;
}

/**
 * حالة السوروبان الكاملة.
 */
export type SorobanState = RodState[];

/**
 * سجل تقدم الطفل في مهارة.
 */
export interface SkillProgress {
  /** معرّف المهارة */
  skillId: string;

  /** عدد المحاولات */
  attempts: number;

  /** عدد الإجابات الصحيحة */
  correct: number;

  /** الإجابات الصحيحة المتتالية */
  consecutiveCorrect: number;

  /** متوسط زمن الإجابة */
  avgTimeMs: number;

  /** وقت الوصول إلى الإتقان */
  masteredAt?: string;
}

/**
 * محاولة واحدة.
 */
export interface Attempt {
  /** المهارة المختبرة */
  skillId: string;

  /** هل الإجابة صحيحة */
  correct: boolean;

  /** زمن الإجابة بالميلي ثانية */
  timeMs: number;

  /** وقت تسجيل المحاولة */
  timestamp: number;
}

/**
 * نتيجة اختبار مستوى.
 */
export interface ExamResult {
  /** معرّف الاختبار */
  examId: string;

  /** عدد المسائل */
  problemsCount: number;

  /** عدد الإجابات الصحيحة */
  correctAnswers: number;

  /** النتيجة المئوية */
  score: number;

  /** هل تم اجتياز الاختبار */
  passed: boolean;

  /** وقت الإكمال */
  completedAt: string;
}

/**
 * معرّف المهارة.
 */
export type SkillId = string;

/**
 * حالة المستوى.
 */
export type LevelStatus =
  | "locked"
  | "available"
  | "inProgress"
  | "completed"
  | "mastered";

/**
 * ملخص المستوى مع حالة تقدم الطالب.
 */
export interface LevelSummary {
  /** معرّف المستوى */
  id: string;

  /** رقم المستوى */
  number: number;

  /** اسم المستوى */
  name: LocalizedText;

  /** وصف المستوى */
  description: LocalizedText;

  /** المجموعة */
  group: CurriculumGroup | "enrichment";

  /** الفئة */
  category: Category | "both";

  /** الأيقونة */
  icon: string;

  /** اللون */
  color: string;

  /** حالة المستوى */
  status: LevelStatus;

  /** المتطلبات السابقة */
  prerequisites: string[];

  /** الساعات التقديرية */
  estimatedHours: number;

  /** العمر المستهدف */
  targetAge: [number, number];
}