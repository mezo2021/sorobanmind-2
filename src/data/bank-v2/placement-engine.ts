// ═══════════════════════════════════════════════════════════════════
// 🎓 src/data/bank-v2/placement-engine.ts — محرك تحديد المستوى
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يبني امتحان تحديد المستوى (40 سؤالًا)
//   - يوزّع 5 أسئلة لكل مستوى (L0-L7)
//   - يقيّم الإجابات ويحدد المستوى المناسب
//   - يسجّل المهارات الضعيفة في localStorage
//
// ✅ حالة جيدة: يستخدم ترقيم L0-L7 — متوافق مع SRB
//
// 📥 الاعتماديات:
//   - ./bank-exam (EXAM_POOL_1 + EXAM_POOL_2 + ExamQuestion)
//
// 📤 الصادرات:
//   - PlacementQuestion · LevelResult · PlacementResult
//   - QUESTIONS_PER_LEVEL · POINTS_PER_QUESTION · POINTS_PER_LEVEL · PASS_THRESHOLD
//   - buildPlacementTest() · evaluatePlacementTest()
//   - canTakePlacementTest() · getLevelName()
//
// 🎯 تصميم المحرك:
//
//   المصدر:
//     - EXAM_POOL_1: L0-L3 (4 مستويات)
//     - EXAM_POOL_2: L4-L7 (4 مستويات)
//
//   التوزيع:
//     - 5 أسئلة لكل مستوى = 40 سؤالًا إجمالًا
//     - 5 نقاط لكل سؤال
//     - 25 نقطة لكل مستوى
//     - عتبة النجاح: 20 نقطة (80%)
//
//   الاختيار:
//     - pickLongest() — يختار الأسئلة الأكثر تعقيدًا (termCount أعلى)
//
//   التقييم:
//     - إذا فشل مستوى → firstFailedLevel = هذا المستوى
//     - recommendedLevel = firstFailedLevel
//     - إذا نجح الكل → recommendedLevel = "L7"
//
// 🔗 خطة الاستبدال بـ SRB (المرحلة 5):
//
//   الخطوة 1: إنشاء SRB placement pool:
//      - SRB.getAll() مع filter على allowed_phases: ["PT"]
//   الخطوة 2: تحديث buildPlacementTest() ليقرأ من SRB
//   الخطوة 3: تحديث evalutePlacementTest() ليحفظ في progressStore
//      بدل localStorage مباشرة
//   الخطوة 4: اختبار شامل
//
//   ملاحظة: لا يحتاج تغييرًا كبيرًا — البنية متوافقة مع SRB
//
// ⚠️ قواعد حرجة:
//   1. لا تغيّر QUESTIONS_PER_LEVEL (5) دون مراجعة
//   2. لا تغيّر PASS_THRESHOLD (20 نقطة = 80%)
//   3. لا تغيّر ترقيم L0-L7 (متوافق مع SRB)
//   4. أي تعديل على evaluatePlacementTest() قد يؤثر على تحديد المستوى
//
// آخر تحديث: 2026-09-29
//   - إضافة توثيق شامل + علامات SRB-MIGRATION
//   - لا تغيير في المنطق
//
// ═══════════════════════════════════════════════════════════════════

// src/data/bank-v2/placement-engine.ts
// محرك امتحان تحديد المستوى (Placement Test)

// 🔗 SRB-MIGRATION: سيُستبدل بـ SRB.getPlacementQuestions()
import {
  EXAM_POOL_1,             // 🔗 → SRB.getByPhase("PT", "L0-L3")
  EXAM_POOL_2,             // 🔗 → SRB.getByPhase("PT", "L4-L7")
  type ExamQuestion,       // 🔗 → SRBQuestion
} from "./bank-exam";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع (Types)
// ═══════════════════════════════════════════════════════════

export interface PlacementQuestion extends ExamQuestion {
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

// ═══════════════════════════════════════════════════════════
// 🔢 الثوابت
// ═══════════════════════════════════════════════════════════

export const QUESTIONS_PER_LEVEL = 5;       // 5 أسئلة لكل مستوى
export const POINTS_PER_QUESTION = 5;       // 5 نقاط لكل سؤال
export const POINTS_PER_LEVEL = 25;         // 5 × 5 = 25 نقطة
export const PASS_THRESHOLD = 20;           // 80% من 25 = 20 نقطة

const ALL_LEVELS = ["L0", "L1", "L2", "L3", "L4", "L5", "L6", "L7"];
const EX1_LEVELS = ["L0", "L1", "L2", "L3"];
const EX2_LEVELS = ["L4", "L5", "L6", "L7"];

// ═══════════════════════════════════════════════════════════
// 🛠️ أدوات
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
 * اختيار الأسئلة الأكثر تعقيدًا.
 *
 * 🔗 SRB-MIGRATION: قد تُحدَّث المعايير
 */
function pickLongest(
  pool: ExamQuestion[],
  count: number,
): ExamQuestion[] {
  const sorted = [...pool].sort((a, b) => b.termCount - a.termCount);
  return sorted.slice(0, Math.min(count, sorted.length));
}

// ═══════════════════════════════════════════════════════════
// 🎯 بناء امتحان تحديد المستوى
// 🔗 SRB-MIGRATION: SRB.getPlacementTest()
// ═══════════════════════════════════════════════════════════

export function buildPlacementTest(seed = Date.now()): PlacementQuestion[] {
  const rng = createRng(seed);
  const questions: PlacementQuestion[] = [];

  // المستويات الأساسية (L0-L3)
  for (const levelId of EX1_LEVELS) {
    const pool = EXAM_POOL_1.filter((q) => q.levelId === levelId);
    if (pool.length === 0) continue;

    const selected = pickLongest(pool, QUESTIONS_PER_LEVEL);

    for (const q of selected) {
      questions.push({
        ...q,
        source: "EX1",
        placementId: `PL-${levelId}-${q.skillId}-${questions.length + 1}`,
      });
    }
  }

  // المستويات المتقدمة (L4-L7)
  for (const levelId of EX2_LEVELS) {
    const pool = EXAM_POOL_2.filter((q) => q.levelId === levelId);
    if (pool.length === 0) continue;

    const selected = pickLongest(pool, QUESTIONS_PER_LEVEL);

    for (const q of selected) {
      questions.push({
        ...q,
        source: "EX2",
        placementId: `PL-${levelId}-${q.skillId}-${questions.length + 1}`,
      });
    }
  }

  return shuffle(questions, rng);
}

// ═══════════════════════════════════════════════════════════
// 📊 تقييم امتحان تحديد المستوى
// 🔗 SRB-MIGRATION: SRB.evaluatePlacement()
// ═══════════════════════════════════════════════════════════

export function evaluatePlacementTest(
  questions: PlacementQuestion[],
  answers: Map<string, number>,
): PlacementResult {
  const byLevel = new Map<
    string,
    { total: number; correct: number; weakSkills: Set<string> }
  >();

  // تهيئة جميع المستويات
  for (const levelId of ALL_LEVELS) {
    byLevel.set(levelId, {
      total: 0,
      correct: 0,
      weakSkills: new Set(),
    });
  }

  // معالجة كل سؤال
  for (const q of questions) {
    const levelData = byLevel.get(q.levelId);
    if (!levelData) continue;

    levelData.total += 1;

    const userAnswer = answers.get(q.placementId);
    const isCorrect = userAnswer === q.correctAnswer;

    if (isCorrect) {
      levelData.correct += 1;
    } else {
      levelData.weakSkills.add(q.skillId);

      // 🔗 SRB-MIGRATION: سيُستبدل بـ progressStore.updateWeakSkills()
      //    بدل localStorage مباشرة
      try {
        const WEAK_KEY = "soroban_weak_skills_v2";  // 🔗 SRB: srb_weak_skills
        const raw = localStorage.getItem(WEAK_KEY);
        const data = raw ? JSON.parse(raw) : {};
        const current = data[q.skillId] ?? {
          skillId: q.skillId,
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
        data[q.skillId] = current;
        localStorage.setItem(WEAK_KEY, JSON.stringify(data));
      } catch { /* ignore */ }
    }
  }

  // حساب النتائج لكل مستوى
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

    for (const skill of data.weakSkills) {
      allWeakSkills.add(skill);
    }

    levels.push({
      levelId,
      correct: data.correct,
      total: data.total,
      points,
      percentage: Math.round(percentage),
      passed,
    });
  }

  // المستوى المُوصى به
  let recommendedLevel: string;
  if (firstFailedLevel !== null) {
    recommendedLevel = firstFailedLevel;
  } else {
    recommendedLevel = "L7";
  }

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
// 🔗 SRB-MIGRATION: ستبقى كما هي
// ═══════════════════════════════════════════════════════════

/**
 * هل يمكن للطالب إجراء اختبار تحديد المستوى؟
 *
 * القاعدة: انتظار 48 ساعة بين المحاولات.
 */
export function canTakePlacementTest(
  lastAttempt: number | null,
  cooldownMs: number = 48 * 60 * 60 * 1000,
): { allowed: boolean; waitMs: number } {
  if (!lastAttempt) return { allowed: true, waitMs: 0 };

  const elapsed = Date.now() - lastAttempt;
  if (elapsed >= cooldownMs) return { allowed: true, waitMs: 0 };

  return { allowed: false, waitMs: cooldownMs - elapsed };
}

/**
 * اسم المستوى بالعربية.
 */
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