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

  /** القيود التي يتحرك ضمنها المولد */
  constraints: ProblemGeneratorConstraints;
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

  /** نوع الحركة المطلوبة */
  movement?: MovementType;

  /** درجة الصعوبة */
  difficulty?: number;

  /** بذرة عشوائية لإعادة إنتاج نفس النتائج */
  seed?: number;

  /** أنواع الحركات المسموح بها */
  allowedMovements?: MovementType[];

  /** عدد الحدود في المسألة */
  termsCount?: number;

  /** العمليات الحسابية المسموح بها */
  operations?: Array<"+" | "-" | "×" | "÷">;
}

/**
 * مثال محلول يوضح طريقة التفكير والحركة.
 */
export interface WorkedExample {
  /** الأرقام الداخلة في المثال */
  operands: number[];

  /** العملية المستخدمة */
  operation: string;

  /** خطوات الحل بالتسلسل */
  steps: string[];

  /** الإجابة النهائية */
  answer: number;
}

/**
 * خطأ شائع يقع فيه الطفل.
 */
export interface CommonMistake {
  /** الإجابة الخاطئة التي قد يعطيها الطفل */
  wrongAnswer: string;

  /** سبب الخطأ */
  whyWrong: string;

  /** الحركة الصحيحة المطلوبة */
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

  /** المهارات التي يجب إتقانها مسبقاً */
  prerequisites: string[];

  /** نوع الحركة السوروبانية الأساسية */
  movementType: MovementType;

  /** معايير إتقان المهارة */
  mastery: MasteryCriteria;

  /** مواصفات توليد مسائل المهارة */
  generator: ProblemGeneratorSpec;

  /** المحتوى التعليمي الكامل للمهارة */
  content: {
    /** الهدف التعليمي */
    goal: string;

    /** المعرفة التي يجب اكتسابها */
    knowledge: string;

    /** القاعدة الحسابية أو السوروبانية */
    rule: string;

    /** شرح مبسط للطفل */
    childExplanation: string;

    /** حركة الأصابع المطلوبة */
    fingerMovement: string;

    /** أمثلة محلولة */
    examples: WorkedExample[];

    /** الأخطاء الشائعة */
    commonMistakes: CommonMistake[];
  };
}

/**
 * اختبار نهاية المستوى.
 */
export interface LevelExam {
  /** المعرّف الفريد للاختبار */
  id: string;

  /** مدة الاختبار بالثواني */
  durationSec: number;

  /** عدد المسائل في الاختبار */
  problemsCount: number;

  /** نسبة النجاح المطلوبة من 0 إلى 100 */
  passingScore: number;

  /** مواصفات توليد أسئلة الاختبار */
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
 * المستوى — يمثل كل من L00-L20 + الإثراء E1-E3.
 *
 * يجمع بين:
 * - بنية المنهج والمهارات
 * - معايير الإتقان
 * - المتطلبات السابقة
 * - التصنيف والفئات
 * - المحتوى ثنائي اللغة
 */
export interface CurriculumLevel {
  /** المعرّف الفريد: L00، L15، E1، ... */
  id: string;

  /** الرقم التسلسلي للمستوى */
  number: number;

  /** اسم المستوى */
  name: LocalizedText;

  /** وصف المستوى */
  description: LocalizedText;

  /** المجموعة التي يتبع لها المستوى */
  group: CurriculumGroup | "enrichment";

  /** الفئة المستهدفة */
  category: Category | "both";

  /** المستويات السابقة المطلوبة */
  prerequisites: string[];

  /** مهارات المستوى */
  skills: Skill[];

  /** اختبار نهاية المستوى */
  exam: LevelExam;

  /** معلومات إضافية عن المستوى */
  metadata: {
    /** عدد الساعات التعليمية التقديرية */
    estimatedHours: number;

    /** الفئة العمرية المستهدفة */
    targetAge: [number, number];

    /** مدى توافق المستوى مع المنهج الياباني */
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
 * الخطوة الواحدة في حل المسألة على السوروبان.
 */
export interface SolveStep {
  /** رقم العمود على السوروبان */
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

  /** عدد الخرزات المتحركة */
  count: number;

  /** قاعدة الحركة المستخدمة */
  rule: MovementType;

  /** مفتاح وصف الحركة */
  descriptionKey: string;

  /** المعاملات المستخدمة في وصف الحركة */
  descriptionParams: Record<string, string | number>;
}

/**
 * مسألة واحدة يولدها المحرك أو تأتي من بنك الأسئلة.
 *
 * ملاحظة مهمة:
 * المسألة الواحدة تحتوي على عملية واحدة فقط،
 * لذلك نستخدم operation وليس operations.
 */
export interface Problem {
  /** المعرّف الفريد للمسألة، إن كان موجوداً */
  id?: string;

  /** المعاملات الداخلة في المسألة، مثل [3, 2] */
  operands: number[];

  /**
   * العملية الفعلية للمسألة.
   *
   * العمليات الحسابية:
   * + الجمع
   * - الطرح
   * × الضرب
   * ÷ القسمة
   *
   * read لقراءة السوروبان
   * build لبناء السوروبان
   */
  operation: "+" | "-" | "×" | "÷" | "read" | "build";

  /** نوع الحركة الحسابية المطلوبة */
  movement: MovementType;

  /** الإجابة الصحيحة المحسوبة مسبقاً */
  expectedAnswer: number;

  /** درجة صعوبة المسألة */
  difficulty: number;

  /** خطوات الحل على السوروبان */
  steps: SolveStep[];

  /** المهارة التي تقيسها المسألة */
  skillId?: SkillId;

  /** قاعدة السوروبان التي تستهدفها المسألة */
  ruleId?: string;

  /** نص السؤال المعروض للطفل */
  question?: string;

  /** شرح تعليمي يظهر عند الخطأ */
  explanation?: string;

  /** الزمن المستهدف لحل المسألة بالميلي ثانية */
  targetTimeMs?: number;

  /** مصدر المسألة داخل بنك الأسئلة */
  source?: string;
}

/**
 * حالة عمود واحد على السوروبان.
 */
export interface RodState {
  /** الخرزة العلوية: إما غير مفعلة أو مفعلة */
  upper: 0 | 1;

  /** عدد الخرزات السفلية المفعلة */
  lower: 0 | 1 | 2 | 3 | 4;
}

/**
 * حالة السوروبان الكاملة.
 *
 * كل عنصر يمثل عموداً واحداً.
 */
export type SorobanState = RodState[];

/**
 * سجل تقدم الطفل في مهارة محددة.
 */
export interface SkillProgress {
  /** معرّف المهارة */
  skillId: string;

  /** عدد المحاولات */
  attempts: number;

  /** عدد الإجابات الصحيحة */
  correct: number;

  /** عدد الإجابات الصحيحة المتتالية */
  consecutiveCorrect: number;

  /** متوسط زمن الإجابة بالميلي ثانية */
  avgTimeMs: number;

  /** وقت الوصول إلى الإتقان */
  masteredAt?: string;
}

/**
 * محاولة واحدة من الطفل.
 */
export interface Attempt {
  /** المهارة التي تم اختبارها */
  skillId: string;

  /** هل كانت الإجابة صحيحة */
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

  /** عدد المسائل في الاختبار */
  problemsCount: number;

  /** عدد الإجابات الصحيحة */
  correctAnswers: number;

  /** النتيجة كنسبة مئوية */
  score: number;

  /** هل نجح الطفل */
  passed: boolean;

  /** وقت إكمال الاختبار */
  completedAt: string;
}

/**
 * معرّف المهارة.
 *
 * استخدام string يسمح بإضافة مستويات ومهارات مستقبلية
 * دون تعديل هذا النوع.
 */
export type SkillId = string;

/**
 * حالة المستوى بالنسبة لتقدم الطالب.
 */
export type LevelStatus =
  | "locked"
  | "available"
  | "inProgress"
  | "completed"
  | "mastered";

/**
 * فهرس مختصر للمستوى مع حالة التقدم.
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

  /** الفئة المستهدفة */
  category: Category | "both";

  /** اسم الأيقونة */
  icon: string;

  /** كلاس اللون */
  color: string;

  /** حالة المستوى */
  status: LevelStatus;

  /** المتطلبات السابقة */
  prerequisites: string[];

  /** عدد الساعات التقديرية */
  estimatedHours: number;

  /** الفئة العمرية المستهدفة */
  targetAge: [number, number];
}