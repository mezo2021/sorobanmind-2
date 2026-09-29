// ═══════════════════════════════════════════════════════════════════
// 🩺 src/data/srb/remediation.ts — منطق الجلسة العلاجية
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - بناء خطة الجلسة العلاجية
//   - تحديد المواضيع الضعيفة تلقائيًا
//   - رسائل جاهزة للمستخدم
//
// 📊 القواعد:
//   - تُبنى من weakModules في progress
//   - لا تُسجّل درجات
//   - تُظهر الحل بعد كل سؤال
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBQuestion,
} from "./types";

import { buildRemediationSession } from "./sessionBuilder";
import { shouldRemediate, getWeakModules } from "./progress";

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

  /** الدرس */
  section: SRBSection;

  /** المواضيع الضعيفة */
  weakModules: SRBModule[];

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
 * بناء خطة الجلسة العلاجية لدرس معين.
 *
 * @param level - المستوى
 * @param section - الدرس
 * @param count - عدد الأسئلة (افتراضيًا 5)
 * @returns خطة الجلسة
 *
 * @example
 * const plan = buildRemediationPlan("L0", "S01");
 * if (plan.shouldStart) {
 *   // افتح شاشة الجلسة العلاجية
 * }
 */
export function buildRemediationPlan(
  level: SRBLevel,
  section: SRBSection,
  count: number = 5,
): RemediationPlan {
  // 1. فحص: هل يحتاج علاج؟
  const check = shouldRemediate(level, section);

  if (!check.shouldRemediate) {
    return {
      shouldStart: false,
      level,
      section,
      weakModules: [],
      questions: [],
      reason: check.reason,
      message: "لا حاجة لجلسة علاجية — الأداء جيد.",
    };
  }

  // 2. المواضيع الضعيفة
  const weakModules = check.weakModules.length > 0
    ? check.weakModules
    : getWeakModules(level, section);

  if (weakModules.length === 0) {
    return {
      shouldStart: false,
      level,
      section,
      weakModules: [],
      questions: [],
      reason: "لا مواضيع ضعيفة محددة",
      message: "لا حاجة لجلسة علاجية.",
    };
  }

  // 3. بناء الجلسة
  const session = buildRemediationSession({
    level,
    section,
    weakModules,
    count,
  });

  const shouldStart = session.questions.length > 0;

  return {
    shouldStart,
    level,
    section,
    weakModules,
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

  const modules = plan.weakModules.join(" · ");
  return `🩺 ${plan.questions.length} أسئلة — مواضيع: ${modules}`;
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