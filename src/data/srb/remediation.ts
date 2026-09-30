// ═══════════════════════════════════════════════════════════════════
// 🩺 src/data/srb/remediation.ts — منطق الجلسة العلاجية
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - توافق مع الشاشات القديمة (section اختياري + weakModules)
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBSection,
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

  /** @deprecated alias لـ weakSkills — للتوافق */
  weakModules: string[];

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
 * ⚠️ التوقيع يقبل شكلين للتوافق:
 *   - buildRemediationPlan(level)
 *   - buildRemediationPlan(level, count)
 *   - buildRemediationPlan(level, section, count)  ← section يُتجاهل
 */
export function buildRemediationPlan(
  level: SRBLevel,
  sectionOrCount?: SRBSection | number,
  count?: number,
): RemediationPlan {
  // تحديد العدد الفعلي (للتوافق)
  const finalCount =
    typeof sectionOrCount === "number"
      ? sectionOrCount
      : typeof count === "number"
      ? count
      : 5;

  // 1. فحص: هل يحتاج علاج؟
  const check = shouldRemediate(level);

  if (!check.shouldRemediate) {
    return {
      shouldStart: false,
      level,
      weakSkills: [],
      weakModules: [],
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
      weakModules: [],
      questions: [],
      reason: "لا مهارات ضعيفة محددة",
      message: "لا حاجة لجلسة علاجية.",
    };
  }

  // 3. بناء الجلسة
  const session = buildRemediationSession({
    level,
    weakSkills,
    count: finalCount,
  });

  const shouldStart = session.questions.length > 0;

  return {
    shouldStart,
    level,
    weakSkills,
    weakModules: weakSkills,
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

export function getRemediationMessage(plan: RemediationPlan): string {
  if (!plan.shouldStart) {
    return plan.message;
  }
  return `🩺 ${plan.questions.length} أسئلة — ${plan.weakSkills.length} مهارة ضعيفة`;
}

export function getRemediationButtonLabel(plan: RemediationPlan): string {
  if (!plan.shouldStart) {
    return "لا حاجة";
  }
  return `🩺 جلسة علاجية (${plan.questions.length})`;
}

export function getRemediationTitle(): string {
  return "🩺 الجلسة العلاجية";
}

export function getRemediationDescription(): string {
  return "جلسة مخصصة بدون درجات — تُظهر لك الحل بعد كل سؤال.";
}