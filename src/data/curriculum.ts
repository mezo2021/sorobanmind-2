// src/data/curriculum.ts

import type {
  Category,
  CurriculumGroup,
  LevelStatus,
  LocalizedText,
} from "../curriculum/types";

import type { LevelId } from "../store/progressStore";

/**
 * وصف مجموعة من المستويات.
 */
export interface CurriculumGroupInfo {
  id: CurriculumGroup;
  titleKey: string;
  descKey: string;
  icon: string;
  gradient: string;
  /** المستويات التي تنتمي لهذه المجموعة */
  levelIds: string[];
}

/**
 * وصف مبسط لمستوى (للعرض فقط — لا يحتوي المحتوى الكامل).
 *
 * المحتوى الكامل في: src/curriculum/levels/level-XX.ts
 */
export interface LevelInfo {
  id: LevelId;
  number: number;
  name: LocalizedText;
  description: LocalizedText;
  group: CurriculumGroup | "enrichment";
  category: Category | "both";
  icon: string;
  gradient: string;
  prerequisites: string[];
  estimatedHours: number;
  targetAge: [number, number];
}

/**
 * كل مجموعات المنهج.
 */
export const CURRICULUM_GROUPS: CurriculumGroupInfo[] = [
  {
    id: "fundamentals",
    titleKey: "curriculum.fundamentals",
    descKey: "curriculum.fundamentals.desc",
    icon: "BookOpen",
    gradient: "from-emerald-500 to-teal-700",
    levelIds: ["L00", "L01", "L02", "L03"],
  },
  {
    id: "japaneseRules",
    titleKey: "curriculum.japaneseRules",
    descKey: "curriculum.japaneseRules.desc",
    icon: "Hand",
    gradient: "from-purple-500 to-violet-700",
    levelIds: ["L04", "L05", "L06", "L07"],
  },
  {
    id: "expansion",
    titleKey: "curriculum.expansion",
    descKey: "curriculum.expansion.desc",
    icon: "TrendingUp",
    gradient: "from-blue-500 to-cyan-700",
    levelIds: ["L08", "L09", "L10"],
  },
  {
    id: "mental",
    titleKey: "curriculum.mental",
    descKey: "curriculum.mental.desc",
    icon: "Brain",
    gradient: "from-indigo-500 to-purple-700",
    levelIds: ["L11", "L12", "L13", "L14"],
  },
  {
    id: "majorOps",
    titleKey: "curriculum.majorOps",
    descKey: "curriculum.majorOps.desc",
    icon: "Calculator",
    gradient: "from-amber-500 to-orange-700",
    levelIds: ["L15", "L16", "L17"],
  },
  {
    id: "mastery",
    titleKey: "curriculum.mastery",
    descKey: "curriculum.mastery.desc",
    icon: "Trophy",
    gradient: "from-yellow-500 to-amber-700",
    levelIds: ["L18", "L19", "L20"],
  },
];

/**
 * فهرس كل المستويات (L00-L20).
 *
 * المحتوى الكامل يُحمّل من: src/curriculum/levels/level-XX.ts
 */
export const CURRICULUM_LEVELS: LevelInfo[] = [
  // ═══ Fundamentals ═══
  {
    id: "L00",
    number: 0,
    name: { ar: "التعرّف على السوروبان", en: "Meet the Soroban" },
    description: {
      ar: "أجزاء السوروبان ووظيفة كل جزء",
      en: "Parts of the soroban and their functions",
    },
    group: "fundamentals",
    category: "both",
    icon: "Info",
    gradient: "from-emerald-500 to-teal-700",
    prerequisites: [],
    estimatedHours: 1,
    targetAge: [5, 99],
  },
  {
    id: "L01",
    number: 1,
    name: { ar: "الأرقام من ٠ إلى ٩", en: "Numbers 0–9" },
    description: {
      ar: "تمثيل وقراءة الأرقام المفردة",
      en: "Represent and read single digits",
    },
    group: "fundamentals",
    category: "both",
    icon: "Hash",
    gradient: "from-emerald-500 to-teal-700",
    prerequisites: ["L00"],
    estimatedHours: 2,
    targetAge: [5, 99],
  },
  {
    id: "L02",
    number: 2,
    name: { ar: "القيمة المكانية", en: "Place Value" },
    description: {
      ar: "الآحاد، العشرات، المئات، الآلاف",
      en: "Units, tens, hundreds, thousands",
    },
    group: "fundamentals",
    category: "both",
    icon: "Layers",
    gradient: "from-emerald-500 to-teal-700",
    prerequisites: ["L01"],
    estimatedHours: 2,
    targetAge: [6, 99],
  },
  {
    id: "L03",
    number: 3,
    name: { ar: "الجمع المباشر", en: "Direct Addition" },
    description: {
      ar: "الجمع دون قواعد — من اليسار لليمين",
      en: "Add without rules — left to right",
    },
    group: "fundamentals",
    category: "both",
    icon: "Plus",
    gradient: "from-emerald-500 to-teal-700",
    prerequisites: ["L02"],
    estimatedHours: 2,
    targetAge: [6, 99],
  },

  // ═══ Japanese Rules ═══
  {
    id: "L04",
    number: 4,
    name: { ar: "مكملات الخمسة — جمع", en: "Friends of 5 — Add" },
    description: {
      ar: "استعن بالخرزة العلوية عند الامتلاء",
      en: "Use the upper bead when full",
    },
    group: "japaneseRules",
    category: "both",
    icon: "Combine",
    gradient: "from-purple-500 to-violet-700",
    prerequisites: ["L03"],
    estimatedHours: 3,
    targetAge: [7, 99],
  },
  {
    id: "L05",
    number: 5,
    name: { ar: "مكملات الخمسة — طرح", en: "Friends of 5 — Sub" },
    description: {
      ar: "اطرح باستخدام الخرزة العلوية",
      en: "Subtract using the upper bead",
    },
    group: "japaneseRules",
    category: "both",
    icon: "Minus",
    gradient: "from-purple-500 to-violet-700",
    prerequisites: ["L04"],
    estimatedHours: 3,
    targetAge: [7, 99],
  },
  {
    id: "L06",
    number: 6,
    name: { ar: "مكملات العشرة — جمع", en: "Friends of 10 — Add" },
    description: {
      ar: "استعن بالعمود التالي عند الامتلاء",
      en: "Carry to the next column when full",
    },
    group: "japaneseRules",
    category: "both",
    icon: "Sigma",
    gradient: "from-purple-500 to-violet-700",
    prerequisites: ["L05"],
    estimatedHours: 3,
    targetAge: [8, 99],
  },
  {
    id: "L07",
    number: 7,
    name: { ar: "مكملات العشرة — طرح", en: "Friends of 10 — Sub" },
    description: {
      ar: "اطرح من العمود التالي عند النقص",
      en: "Borrow from the next column when empty",
    },
    group: "japaneseRules",
    category: "both",
    icon: "Sigma",
    gradient: "from-purple-500 to-violet-700",
    prerequisites: ["L06"],
    estimatedHours: 3,
    targetAge: [8, 99],
  },

  // ═══ Expansion ═══
  {
    id: "L08",
    number: 8,
    name: { ar: "الجمع متعدد الخانات", en: "Multi-digit Addition" },
    description: {
      ar: "من خانتين حتى خمس خانات",
      en: "From two digits to five digits",
    },
    group: "expansion",
    category: "both",
    icon: "Hash",
    gradient: "from-blue-500 to-cyan-700",
    prerequisites: ["L07"],
    estimatedHours: 4,
    targetAge: [9, 99],
  },
  {
    id: "L09",
    number: 9,
    name: { ar: "الطرح متعدد الخانات", en: "Multi-digit Subtraction" },
    description: {
      ar: "مع الاستلاف والقواعد الكاملة",
      en: "With borrowing and full rules",
    },
    group: "expansion",
    category: "both",
    icon: "Minus",
    gradient: "from-blue-500 to-cyan-700",
    prerequisites: ["L08"],
    estimatedHours: 4,
    targetAge: [9, 99],
  },
  {
    id: "L10",
    number: 10,
    name: { ar: "العمليات المختلطة", en: "Mixed Operations" },
    description: {
      ar: "سلاسل جمع وطرح",
      en: "Chains of addition and subtraction",
    },
    group: "expansion",
    category: "both",
    icon: "List",
    gradient: "from-blue-500 to-cyan-700",
    prerequisites: ["L09"],
    estimatedHours: 4,
    targetAge: [10, 99],
  },

  // ═══ Mental ═══
  {
    id: "L11",
    number: 11,
    name: { ar: "التخزين الذهني", en: "Mental Retention" },
    description: {
      ar: "خزّن صورة السوروبان في ذهنك",
      en: "Store the soroban image in your mind",
    },
    group: "mental",
    category: "both",
    icon: "Eye",
    gradient: "from-indigo-500 to-purple-700",
    prerequisites: ["L10"],
    estimatedHours: 3,
    targetAge: [9, 99],
  },
  {
    id: "L12",
    number: 12,
    name: { ar: "الأنزان — البصري", en: "Visual Anzan" },
    description: {
      ar: "شاهد الأرقام بسرعة واحسب ذهنياً",
      en: "See numbers fast and compute mentally",
    },
    group: "mental",
    category: "both",
    icon: "Eye",
    gradient: "from-indigo-500 to-purple-700",
    prerequisites: ["L11"],
    estimatedHours: 4,
    targetAge: [9, 99],
  },
  {
    id: "L13",
    number: 13,
    name: { ar: "الأنزان — السمعي", en: "Audio Anzan" },
    description: {
      ar: "اسمع الأرقام واحسب ذهنياً",
      en: "Hear numbers and compute mentally",
    },
    group: "mental",
    category: "both",
    icon: "Volume2",
    gradient: "from-indigo-500 to-purple-700",
    prerequisites: ["L12"],
    estimatedHours: 4,
    targetAge: [10, 99],
  },
  {
    id: "L14",
    number: 14,
    name: { ar: "الفلاش أنزان", en: "Flash Anzan" },
    description: {
      ar: "سرعة عرض متزايدة — تحدٍّ حقيقي",
      en: "Increasing speed — a real challenge",
    },
    group: "mental",
    category: "both",
    icon: "Zap",
    gradient: "from-indigo-500 to-purple-700",
    prerequisites: ["L13"],
    estimatedHours: 5,
    targetAge: [11, 99],
  },

  // ═══ Major Operations ═══
  {
    id: "L15",
    number: 15,
    name: { ar: "الضرب على السوروبان", en: "Multiplication on Soroban" },
    description: {
      ar: "الضرب بالشبكة والخطوط",
      en: "Grid and line multiplication",
    },
    group: "majorOps",
    category: "both",
    icon: "X",
    gradient: "from-amber-500 to-orange-700",
    prerequisites: ["L14"],
    estimatedHours: 5,
    targetAge: [10, 99],
  },
  {
    id: "L16",
    number: 16,
    name: { ar: "القسمة على السوروبان", en: "Division on Soroban" },
    description: {
      ar: "اقسم، اضرب، اطرح، أنزل",
      en: "Divide, multiply, subtract, bring down",
    },
    group: "majorOps",
    category: "both",
    icon: "Divide",
    gradient: "from-amber-500 to-orange-700",
    prerequisites: ["L15"],
    estimatedHours: 5,
    targetAge: [11, 99],
  },
  {
    id: "L17",
    number: 17,
    name: { ar: "الكسور العشرية", en: "Decimals" },
    description: {
      ar: "المضاعفات والأجزاء العشرية",
      en: "Multiples and decimal parts",
    },
    group: "majorOps",
    category: "both",
    icon: "CircleDot",
    gradient: "from-amber-500 to-orange-700",
    prerequisites: ["L16"],
    estimatedHours: 4,
    targetAge: [11, 99],
  },

  // ═══ Mastery ═══
  {
    id: "L18",
    number: 18,
    name: { ar: "الحساب المنظّم (ميتوري)", en: "Mitori-zan" },
    description: {
      ar: "جمع وطرح عمودي بأرقام متعددة",
      en: "Vertical add/subtract with multiple numbers",
    },
    group: "mastery",
    category: "both",
    icon: "AlignVerticalSpaceAround",
    gradient: "from-yellow-500 to-amber-700",
    prerequisites: ["L17"],
    estimatedHours: 5,
    targetAge: [11, 99],
  },
  {
    id: "L19",
    number: 19,
    name: { ar: "المنافسات", en: "Competition Training" },
    description: {
      ar: "تدريب بأسلوب الاختبارات اليابانية",
      en: "Japanese-style exam practice",
    },
    group: "mastery",
    category: "both",
    icon: "Trophy",
    gradient: "from-yellow-500 to-amber-700",
    prerequisites: ["L18"],
    estimatedHours: 6,
    targetAge: [12, 99],
  },
  {
    id: "L20",
    number: 20,
    name: { ar: "الشهادة الدولية", en: "International Certification" },
    description: {
      ar: "اختبار نهائي + شهادة موثّقة",
      en: "Final exam + official certificate",
    },
    group: "mastery",
    category: "both",
    icon: "Award",
    gradient: "from-yellow-500 to-amber-700",
    prerequisites: ["L19"],
    estimatedHours: 2,
    targetAge: [12, 99],
  },
];

/**
 * الحصول على معلومات مستوى.
 */
export function getLevelInfo(levelId: string): LevelInfo | undefined {
  return CURRICULUM_LEVELS.find((l) => l.id === levelId);
}

/**
 * الحصول على كل المستويات في مجموعة.
 */
export function getLevelsByGroup(group: CurriculumGroup): LevelInfo[] {
  return CURRICULUM_LEVELS.filter((l) => l.group === group);
}

/**
 * الحصول على كل المستويات لفئة معينة.
 */
export function getLevelsByCategory(category: Category): LevelInfo[] {
  return CURRICULUM_LEVELS.filter(
    (l) => l.category === category || l.category === "both",
  );
}

/**
 * حساب حالة مستوى حسب التقدم.
 */
export function computeLevelStatus(
  level: LevelInfo,
  completedLevels: string[],
): LevelStatus {
  if (completedLevels.includes(level.id)) {
    return "completed";
  }
  if (level.prerequisites.length === 0) {
    return "available";
  }
  const allPrerequisitesDone = level.prerequisites.every((p) =>
    completedLevels.includes(p),
  );
  return allPrerequisitesDone ? "available" : "locked";
}

/**
 * عدد المستويات الكلي.
 */
export const TOTAL_LEVELS = CURRICULUM_LEVELS.length;