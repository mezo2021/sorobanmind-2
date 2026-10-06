// ═══════════════════════════════════════════════════════════════════
// 📘 src/data/srb/types.ts — أنواع بنك الأسئلة SRB
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-10-06
//   - إضافة compound-sub إلى SRBMovementType (لقسمة ÷2 المركّبة)
//   - إضافة compound-add إلى SRBMovementType (لسلاسل الجمع المركّبة L4+)
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
  | "S11" | "S12" | "S13" | "S14" | "S15";

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
  | "E"       // شاهد
  | "T"       // جرّب
  | "P"       // تمرّن
  | "ANZ-V"   // أنزان بصري
  | "ANZ-F"   // أنزان فلاش
  | "ANZ-A"   // أنزان سمعي
  | "X"       // اختبار
  | "CE"      // امتحان قسم
  | "PT"      // تحديد المستوى
  | "EN";     // الإثراء

// ═══════════════════════════════════════════════════════════
// 📊 المرحلة (Stage)
// ═══════════════════════════════════════════════════════════

export type SRBStage = "basic" | "advanced";

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
  | "compound-add"
  | "compound-sub"
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

export interface SRBQuestion {
  // ─── الهوية ───
  id: string;
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
  sequence: number;
  variant: "B" | "A";

  // ─── التصنيف ───
  primary_phase: SRBPhase;
  allowed_phases: SRBPhase[];
  stage: SRBStage;
  difficulty: SRBDifficulty;
  difficulty_score: number;
  in_curriculum: boolean;

  // ─── السؤال ───
  question: string;
  operands: number[];
  operation: SRBOperation;
  result: number;
  digit_count_max: number;
  operand_count: number;

  // ─── الحل ───
  solution: string;
  movement: SRBMovementType;
  movement_explanation?: string;
  note?: string;

  // ─── التوقيت ───
  /** الزمن المعياري [min, max] بالمللي ثانية (مع العداد) */
  target_time_ms: [number, number];

  /** 🆕 زمن الأنزان [min, max] بالمللي ثانية (حساب ذهني) */
  anzan_time_ms: [number, number];

  /** عتبة الإتقان */
  mastery_threshold: number;

  // ─── الشجرة ───
  prerequisite_id: string | null;
  next_if_success: string | null;
  next_if_fail: string | null;

  // ─── الأصل ───
  original_bank_id: number | null;
  original_bank_section: string | null;
  classification_note?: string;

  // ─── الميتاداتا ───
  tags: string[];
  place_values: SRBPlaceValue[];
  has_carry: boolean;
  has_borrow: boolean;
}

// ═══════════════════════════════════════════════════════════
// 📋 الأنواع المساعدة
// ═══════════════════════════════════════════════════════════

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

  /** الزمن المعياري (ms) — سيُحوَّل إلى [min, max] */
  expected_time_ms: number;

  /** 🆕 زمن الأنزان (ms) — سيُحوَّل إلى [min, max]. إذا لم يُحدَّد → 60% من المعياري */
  expected_anzan_ms?: number;

  mastery_threshold?: number;
  prerequisite_id?: string | null;
  tags?: string[];
  original_bank_id?: number | null;
  original_bank_section?: string | null;
  classification_note?: string;
}

export interface SRBEvaluation {
  correct: boolean;
  userAnswer: number;
  correctAnswer: number;
  timeMs: number;
  expectedTimeMs: number;
  maxTimeMs: number;
  timeRatio: number;
  performance: SRBPerformance;
  issue: SRBIssue;
}

export type SRBPerformance =
  | "EXCELLENT"
  | "GOOD"
  | "ACCEPTABLE"
  | "SLOW"
  | "WRONG";

export type SRBIssue =
  | "none"
  | "wrong-answer"
  | "slow"
  | "wrong-and-slow";

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

export interface SRBWeakSkillRecord {
  skillId: string;
  attempts: number;
  correct: number;
  wrong: number;
  avgTimeMs: number;
  lastAttempt: number;
  weaknessScore: number;
}

export interface SRBStats {
  total: number;
  byLevel: Record<SRBLevel, number>;
  bySection: Partial<Record<SRBSection, number>>;
  byStage: Record<SRBStage, number>;
}