// ═══════════════════════════════════════════════════════════════════
// 🩺 src/data/srb/remediation.ts — منطق الجلسة العلاجية
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - بناء خطة الجلسة العلاجية
//   - تحديد المهارات الضعيفة تلقائيًا
//   - رسائل جاهزة للمستخدم
//
// 📊 القواعد:
//   - تُبنى من weakSkills في progress
//   - لا تُسجّل درجات
//   - تُظهر الحل بعد كل سؤال
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - إلغاء section (الجلسة على مستوى)
//   - استخدام skill IDs بدل SRBModule
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBQuestion,
} from "./types";

import { buildRemediationSession } from "./sessionBuilder";
import { shouldRemediate, getWeakSkills } from "./progress";

// ═══════════════════════════════════════════════════════════
// 📝 الأنواع
// ═══════════════════════════════════════════════════════════

/**
 * خطة الجلسة العلاجية.
 */
export interface RemediationPlan {
  /** هل نبدأ الجلسة؟ */
  shouldStart: boolean;

  /** المستوى */
  level: SRBLevel;

  /** المهارات الضعيفة (skill IDs) */
  weakSkills: string[];

  /** أسئلة الجلسة */
  questions: SRBQuestion[];

  /** سبب التوصية */
  reason: string;

  /** رسالة للمستخدم */
  message: string;
}

// ═══════════════════════════════════════════════════════════
// 🎯 بناء الخطة
// ═══════════════════════════════════════════════════════════

/**
 * بناء خطة الجلسة العلاجية لمستوى معين.
 *
 * @param level - المستوى
 * @param count - عدد الأسئلة (افتراضيًا 5)
 * @returns خطة الجلسة
 *
 * @example
 * const plan = buildRemediationPlan("L0");
 * if (plan.shouldStart) {
 *   // افتح شاشة الجلسة العلاجية
 * }
 */
export function buildRemediationPlan(
  level: SRBLevel,
  count: number = 5,
): RemediationPlan {
  // 1. فحص: هل يحتاج علاج؟
  const check = shouldRemediate(level);

  if (!check.shouldRemediate) {
    return {
      shouldStart: false,
      level,
      weakSkills: [],
      questions: [],
      reason: check.reason,
      message: "لا حاجة لجلسة علاجية — الأداء جيد.",
    };
  }

  // 2. المهارات الضعيفة
  const weakSkills = check.weakSkills.length > 0
    ? check.weakSkills
    : getWeakSkills(level);

  if (weakSkills.length === 0) {
    return {
      shouldStart: false,
      level,
      weakSkills: [],
      questions: [],
      reason: "لا مهارات ضعيفة محددة",
      message: "لا حاجة لجلسة علاجية.",
    };
  }

  // 3. بناء الجلسة
  const session = buildRemediationSession({
    level,
    weakSkills,
    count,
  });

  const shouldStart = session.questions.length > 0;

  return {
    shouldStart,
    level,
    weakSkills,
    questions: session.questions,
    reason: check.reason,
    message: shouldStart
      ? `جلسة علاجية: ${session.questions.length} أسئلة`
      : "لا أسئلة متاحة للعلاج.",
  };
}

// ═══════════════════════════════════════════════════════════
// 📢 رسائل جاهزة
// ═══════════════════════════════════════════════════════════

/**
 * رسالة تفصيلية للعرض.
 */
export function getRemediationMessage(plan: RemediationPlan): string {
  if (!plan.shouldStart) {
    return plan.message;
  }

  return `🩺 ${plan.questions.length} أسئلة — ${plan.weakSkills.length} مهارة ضعيفة`;
}

/**
 * رسالة قصيرة للزر.
 */
export function getRemediationButtonLabel(plan: RemediationPlan): string {
  if (!plan.shouldStart) {
    return "لا حاجة";
  }

  return `🩺 جلسة علاجية (${plan.questions.length})`;
}

/**
 * عنوان الشاشة.
 */
export function getRemediationTitle(): string {
  return "🩺 الجلسة العلاجية";
}

/**
 * وصف الشاشة.
 */
export function getRemediationDescription(): string {
  return "جلسة مخصصة بدون درجات — تُظهر لك الحل بعد كل سؤال.";
}