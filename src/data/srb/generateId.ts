// ═══════════════════════════════════════════════════════════════════
// 🔑 src/data/srb/generateId.ts — توليد وتحليل SRB IDs
// ═══════════════════════════════════════════════════════════════════
//
// 📅 آخر تحديث: 2026-09-30 — الجلسة 10
//   - makeQuestion يستقبل expected_anzan_ms
//   - يحسب anzan_time_ms = [min, max] حيث max = min × 1.5
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBQuestion,
  SRBQuestionSpec,
  SRBPlaceValue,
} from "./types";

// ═══════════════════════════════════════════════════════════
// 🎯 توليد SRB ID
// ═══════════════════════════════════════════════════════════

export function generateSrbId(
  level: SRBLevel,
  section: SRBSection,
  module: SRBModule,
  variant: "B" | "A",
  sequence: number,
): string {
  if (sequence < 1 || sequence > 999) {
    throw new RangeError(
      `sequence must be between 1 and 999, got ${sequence}`,
    );
  }

  const paddedSeq = String(sequence).padStart(3, "0");
  return `SRB-${level}-${section}-${module}-${variant}${paddedSeq}`;
}

// ═══════════════════════════════════════════════════════════
// 🔍 تحليل SRB ID
// ═══════════════════════════════════════════════════════════

export interface ParsedSrbId {
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
  variant: "B" | "A";
  sequence: number;
}

export function parseSrbId(id: string): ParsedSrbId {
  const regex = /^SRB-(L[0-7])-(S\d{2})-(m\d{1,2})-([BA])(\d{3})$/;
  const match = regex.exec(id);

  if (!match) {
    throw new Error(`Invalid SRB ID format: ${id}`);
  }

  const [, level, section, module, variant, seqStr] = match;
  const sequence = parseInt(seqStr, 10);

  if (sequence < 1 || sequence > 999) {
    throw new RangeError(`Invalid sequence in SRB ID: ${sequence}`);
  }

  return {
    level: level as SRBLevel,
    section: section as SRBSection,
    module: module as SRBModule,
    variant: variant as "B" | "A",
    sequence,
  };
}

export function isValidSrbId(id: string): boolean {
  try {
    parseSrbId(id);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// 🛠️ دوال مساعدة
// ═══════════════════════════════════════════════════════════

export function getLevelNumber(level: SRBLevel): number {
  return parseInt(level.replace("L", ""), 10);
}

export function getSectionNumber(section: SRBSection): number {
  return parseInt(section.replace("S", ""), 10);
}

export function getModuleNumber(module: SRBModule): number {
  return parseInt(module.replace("m", ""), 10);
}

/**
 * استخراج skill ID من SRB ID الكامل.
 * مثال: SRB-L0-S01-m1-A001 → SRB-L0-S01-m1
 */
export function getSkillId(fullId: string): string {
  const parsed = parseSrbId(fullId);
  return `SRB-${parsed.level}-${parsed.section}-${parsed.module}`;
}

/**
 * استخراج section ID من SRB ID الكامل.
 * مثال: SRB-L0-S01-m1-A001 → SRB-L0-S01
 */
export function getSectionId(fullId: string): string {
  const parsed = parseSrbId(fullId);
  return `SRB-${parsed.level}-${parsed.section}`;
}

// ═══════════════════════════════════════════════════════════
// 📊 ترقيم عربي
// ═══════════════════════════════════════════════════════════

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toArabicDigits(num: number): string {
  return String(num)
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : ARABIC_DIGITS[digit];
    })
    .join("");
}

export function toArabicSrbId(id: string): string {
  try {
    const parsed = parseSrbId(id);
    const levelNum = getLevelNumber(parsed.level);
    const sectionNum = getSectionNumber(parsed.section);
    const moduleNum = getModuleNumber(parsed.module);
    const seqNum = parsed.sequence;

    return `SRB-L${toArabicDigits(levelNum)}-S${toArabicDigits(sectionNum).padStart(2, "٠")}-m${toArabicDigits(moduleNum)}-${parsed.variant}${toArabicDigits(seqNum).padStart(3, "٠")}`;
  } catch {
    return id;
  }
}

// ═══════════════════════════════════════════════════════════
// 🎯 Helper: إنشاء سؤال SRB (Spec → Question)
// ═══════════════════════════════════════════════════════════

/**
 * إنشاء سؤال SRB كامل من مواصفات مختصرة.
 *
 * ⚠️ التغيير (2026-09-30):
 *   - يستقبل expected_anzan_ms (اختياري)
 *   - يحسب anzan_time_ms = [min, max] حيث max = min × 1.5
 *   - إذا لم يُحدَّد expected_anzan_ms → 60% من expected_time_ms
 */
export function makeQuestion(spec: SRBQuestionSpec): SRBQuestion {
  const {
    level,
    section,
    module,
    sequence,
    variant = "B",
    primary_phase,
    allowed_phases,
    question,
    operands,
    operation,
    result,
    solution,
    movement,
    movement_explanation,
    note,
    difficulty,
    difficulty_score,
    expected_time_ms,
    expected_anzan_ms,
    mastery_threshold,
    prerequisite_id,
    tags,
    original_bank_id,
    original_bank_section,
    classification_note,
  } = spec;

  // ─── حساب digit_count_max ───
  const digit_count_max = Math.max(
    1,
    String(Math.abs(Math.trunc(result))).length,
  );

  // ─── operand_count ───
  const operand_count = operands.length;

  // ─── target_time_ms = [min, max] حيث max = min × 1.5 ───
  const minMs = expected_time_ms;
  const maxMs = Math.round(minMs * 1.5);

  // ─── 🆕 anzan_time_ms ───
  // إذا لم يُحدَّد expected_anzan_ms → 60% من المعياري
  const anzanMinMs = expected_anzan_ms ?? Math.round(minMs * 0.6);
  const anzanMaxMs = Math.round(anzanMinMs * 1.5);

  // ─── stage من level ───
  const levelNum = getLevelNumber(level);
  const stage = levelNum <= 3 ? "basic" : "advanced";

  // ─── mastery_threshold ───
  const threshold = mastery_threshold ?? (variant === "B" ? 0.85 : 0.8);

  // ─── difficulty_score ───
  const diffScore = difficulty_score ?? difficulty * 1.0;

  // ─── ID ───
  const id = generateSrbId(level, section, module, variant, sequence);

  // ─── place_values ───
  const place_values = computePlaceValues([...operands, result]);

  // ─── has_carry / has_borrow ───
  const has_carry =
    movement.includes("carry") || movement.includes("ten-friend-add");
  const has_borrow =
    movement.includes("borrow") || movement.includes("ten-friend-sub");

  return {
    id,
    level,
    section,
    module,
    sequence,
    variant,
    primary_phase,
    allowed_phases,
    stage,
    difficulty,
    difficulty_score: diffScore,
    in_curriculum: true,
    question,
    operands,
    operation,
    result,
    digit_count_max,
    operand_count,
    solution,
    movement,
    movement_explanation,
    note,
    target_time_ms: [minMs, maxMs],
    anzan_time_ms: [anzanMinMs, anzanMaxMs],
    mastery_threshold: threshold,
    prerequisite_id: prerequisite_id ?? null,
    next_if_success: null,
    next_if_fail: null,
    original_bank_id: original_bank_id ?? null,
    original_bank_section: original_bank_section ?? null,
    classification_note,
    tags: tags ?? [],
    place_values,
    has_carry,
    has_borrow,
  };
}

// ═══════════════════════════════════════════════════════════
// 🛠️ computePlaceValues (داخلية)
// ═══════════════════════════════════════════════════════════

function computePlaceValues(values: number[]): SRBPlaceValue[] {
  const maxDigits = Math.max(
    1,
    ...values.map((v) => String(Math.abs(Math.trunc(v))).length),
  );

  if (maxDigits >= 4) return ["units", "tens", "hundreds", "thousands"];
  if (maxDigits === 3) return ["units", "tens", "hundreds"];
  if (maxDigits === 2) return ["units", "tens"];
  return ["units"];
}