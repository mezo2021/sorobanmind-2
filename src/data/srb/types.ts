// ═══════════════════════════════════════════════════════════════════
// 📘 src/data/srb/types.ts — أنواع بنك الأسئلة SRB
// ═══════════════════════════════════════════════════════════════════
//
// الوظيفة:
//   - يُعرِّف كل أنواع SRB
//   - SRBQuestion (السؤال الكامل)
//   - SRBPhase (المراحل)
//   - SRBLevel / SRBSection / SRBModule
//   - SRBStage / SRBMovementType / SRBDifficulty
//
// 🔑 صيغة ID:
//   SRB-L{0-7}-S{01-20}-m{1-99}-{B/A}{001-999}
//
// 📏 القواعد:
//   - m بحرف صغير (m1, m2, ...)
//   - m مرتبط بـ S (إعادة ترقيم في كل درس)
//   - المراحل في allowed_phases (لا في ID)
//
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// 🎯 المستوى (Level)
// ═══════════════════════════════════════════════════════════

export type SRBLevel =
  | "L0" | "L1" | "L2" | "L3"
  | "L4" | "L5" | "L6" | "L7";

// ═══════════════════════════════════════════════════════════
// 📚 الدرس (Section)
// ═══════════════════════════════════════════════════════════

export type SRBSection =
  | "S01" | "S02" | "S03" | "S04" | "S05"
  | "S06" | "S07" | "S08" | "S09" | "S10"
  | "S11" | "S12" | "S13" | "S14" | "S15"
  | "S16" | "S17" | "S18" | "S19" | "S20";

// ═══════════════════════════════════════════════════════════
// 🎯 المهارة (Module)
// ═══════════════════════════════════════════════════════════

export type SRBModule =
  | "m1" | "m2" | "m3" | "m4" | "m5"
  | "m6" | "m7" | "m8" | "m9" | "m10";

// ═══════════════════════════════════════════════════════════
// 🎚️ المرحلة (Phase)
// ═══════════════════════════════════════════════════════════

export type SRBPhase =
  | "E"       // شاهد (Explain) — عرض تفاعلي
  | "T"       // جرّب (Try) — محاولة تعليمية
  | "P"       // تمرّن (Practice) — تقييم
  | "ANZ-V"   // أنزان بصري
  | "ANZ-F"   // أنزان فلاش
  | "ANZ-A"   // أنزان سمعي
  | "X"       // اختبار المستوى
  | "CE"      // امتحان القسم
  | "PT"      // تحديد المستوى
  | "EN";     // الإثراء

// ═══════════════════════════════════════════════════════════
// 📊 المرحلة (Stage)
// ═══════════════════════════════════════════════════════════

export type SRBStage = "basic" | "advanced";
// basic    → L0-L3
// advanced → L4-L7

// ═══════════════════════════════════════════════════════════
// 🔢 الصعوبة (Difficulty)
// ═══════════════════════════════════════════════════════════

export type SRBDifficulty = 1 | 2 | 3 | 4 | 5;

// ═══════════════════════════════════════════════════════════
// 🎯 نوع الحركة (Movement Type)
// ═══════════════════════════════════════════════════════════

export type SRBMovementType =
  | "direct"
  | "five-friend-add"
  | "five-friend-sub"
  | "ten-friend-add"
  | "ten-friend-sub"
  | "carry"
  | "borrow"
  | "mixed";

// ═══════════════════════════════════════════════════════════
// 🔢 نوع العملية (Operation)
// ═══════════════════════════════════════════════════════════

export type SRBOperation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division"
  | "read"
  | "build";

// ═══════════════════════════════════════════════════════════
// 📦 الخانات (Place Value)
// ═══════════════════════════════════════════════════════════

export type SRBPlaceValue =
  | "units"
  | "tens"
  | "hundreds"
  | "thousands"
  | "decimal";

// ═══════════════════════════════════════════════════════════
// 💎 السؤال الكامل (SRBQuestion)
// ═══════════════════════════════════════════════════════════

/**
 * السؤال الكامل في بنك SRB.
 *
 * ⚠️ هذا هو الشكل النهائي للأسئلة في المشروع.
 */
export interface SRBQuestion {
  // ─── الهوية (Identity) ───
  /** المعرّف الفريد: SRB-L0-S01-m1-B001 */
  id: string;

  /** المستوى: L0-L7 */
  level: SRBLevel;

  /** الدرس: S01-S20 */
  section: SRBSection;

  /** المهارة الفرعية: m1-m99 */
  module: SRBModule;

  /** رقم التسلسل (1-999) */
  sequence: number;

  /** الصعوبة: B (أساسي) / A (متقدم) */
  variant: "B" | "A";

  // ─── التصنيف (Classification) ───
  /** المرحلة الأساسية: T / P / X */
  primary_phase: SRBPhase;

  /** المراحل المسموحة: أي مراحل يمكن أن يظهر فيها */
  allowed_phases: SRBPhase[];

  /** المرحلة (Stage): basic (L0-L3) / advanced (L4-L7) */
  stage: SRBStage;

  /** درجة الصعوبة: 1-5 */
  difficulty: SRBDifficulty;

  /** درجة الصعوبة الرقمية (1.0-5.0) — للترتيب الدقيق */
  difficulty_score: number;

  /** هل السؤال في المنهج الرسمي؟ */
  in_curriculum: boolean;

  // ─── السؤال (Question) ───
  /** نص السؤال */
  question: string;

  /** المعاملات الرقمية */
  operands: number[];

  /** العملية */
  operation: SRBOperation;

  /** الإجابة الصحيحة */
  result: number;

  /** عدد خانات النتيجة */
  digit_count_max: number;

  /** عدد الأرقام في السؤال (وليس الجواب) */
  operand_count: number;

  // ─── الحل (Solution) ───
  /** شرح الحل (نظيف) */
  solution: string;

  /** شرح الحركة على السوروبان */
  movement: SRBMovementType;

  /** شرح تفصيلي للحركة */
  movement_explanation?: string;

  /** ملاحظة إضافية (اختياري) */
  note?: string;

  // ─── التوقيت (Timing) ───
  /** الزمن المتوقع [min, max] بالمللي ثانية */
  target_time_ms: [number, number];

  /** عتبة الإتقان: 0.85 (أساسي) / 0.8 (متقدم) */
  mastery_threshold: number;

  // ─── الشجرة (Tree) ───
  /** المتطلب السابق (ID) */
  prerequisite_id: string | null;

  /** السؤال التالي عند النجاح (ID) */
  next_if_success: string | null;

  /** السؤال التالي عند الفشل (ID) */
  next_if_fail: string | null;

  // ─── الأصل (Source) ───
  /** معرّف السؤال في بنك آخر (إن وُجد) */
  original_bank_id: number | null;

  /** القسم الأصلي في بنك آخر */
  original_bank_section: string | null;

  /** ملاحظة التصنيف (مصدر السؤال) */
  classification_note?: string;

  // ─── الميتاداتا (Metadata) ───
  /** كلمات مفتاحية */
  tags: string[];

  /** الخانات المستخدمة */
  place_values: SRBPlaceValue[];

  /** هل يحوي حملًا؟ */
  has_carry: boolean;

  /** هل يحوي استلافًا؟ */
  has_borrow: boolean;
}

// ═══════════════════════════════════════════════════════════
// 📋 أنواع مساعدة (Helper Types)
// ═══════════════════════════════════════════════════════════

/**
 * المواصفات المُختصرة لإنشاء سؤال.
 */
export interface SRBQuestionSpec {
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
  sequence: number;
  variant?: "B" | "A";

  primary_phase: SRBPhase;
  allowed_phases: SRBPhase[];

  question: string;
  operands: number[];
  operation: SRBOperation;
  result: number;
  solution: string;
  movement: SRBMovementType;
  movement_explanation?: string;
  note?: string;

  difficulty: SRBDifficulty;
  difficulty_score?: number;

  /** الزمن المتوقع (ms) — سيُحوَّل إلى [min, max] */
  expected_time_ms: number;

  /** عتبة الإتقان */
  mastery_threshold?: number;

  /** المتطلب السابق */
  prerequisite_id?: string | null;

  /** كلمات مفتاحية */
  tags?: string[];

  /** الأصل */
  original_bank_id?: number | null;
  original_bank_section?: string | null;
  classification_note?: string;
}

/**
 * نتيجة تقييم سؤال.
 */
export interface SRBEvaluation {
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeMs: number;
  expectedTimeMs: number;
  maxTimeMs: number;
  timeRatio: number;   // 0-1+ (وقت مستغرق / وقت متوقع)

  // التقييم
  performance: SRBPerformance;
  issue: SRBIssue;
}

/**
 * التقييم (Performance).
 */
export type SRBPerformance =
  | "EXCELLENT"     // ≤ 40%
  | "GOOD"          // 40-70%
  | "ACCEPTABLE"    // 70-80%
  | "SLOW"          // 80-100%
  | "WRONG";        // خطأ

/**
 * نوع الخطأ (Issue).
 */
export type SRBIssue =
  | "none"              // لا مشكلة
  | "wrong-answer"      // إجابة خاطئة
  | "slow"              // بطيء
  | "wrong-and-slow";   // خطأ وبطيء

// ═══════════════════════════════════════════════════════════
// 🔍 الفلتر (Filter)
// ═══════════════════════════════════════════════════════════

export interface SRBFilter {
  levels?: SRBLevel[];
  sections?: SRBSection[];
  modules?: SRBModule[];
  phases?: SRBPhase[];
  difficulties?: SRBDifficulty[];
  operations?: SRBOperation[];
  movements?: SRBMovementType[];
  stage?: SRBStage;
  in_curriculum?: boolean;
  excludeIds?: string[];
}

// ═══════════════════════════════════════════════════════════
// 📊 سجل الضعف (Weak Skill Record)
// ═══════════════════════════════════════════════════════════

export interface SRBWeakSkillRecord {
  skillId: string;         // SRB-L0-S01-m1
  attempts: number;
  correct: number;
  wrong: number;
  avgTimeMs: number;
  lastAttempt: number;
  weaknessScore: number;   // 0-100
}

// ═══════════════════════════════════════════════════════════
// 🏦 إحصائيات البنك (Bank Stats)
// ═══════════════════════════════════════════════════════════

export interface SRBStats {
  total: number;
  byLevel: Record<SRBLevel, number>;
  bySection: Partial<Record<SRBSection, number>>;
  byStage: Record<SRBStage, number>;
}