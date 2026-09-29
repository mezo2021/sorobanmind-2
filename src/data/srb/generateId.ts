// ═══════════════════════════════════════════════════════════════════
// 🔑 src/data/srb/generateId.ts — توليد وتحليل SRB IDs
// ═══════════════════════════════════════════════════════════════════
//
// الصيغة: SRB-L{0-7}-S{01-20}-m{1-99}-{B/A}{001-999}
//
// أمثلة:
//   SRB-L0-S01-m1-B001
//   SRB-L2-S10-m3-A025
//   SRB-L7-S20-m1-B001
//
// ═══════════════════════════════════════════════════════════════════

import type {
  SRBLevel,
  SRBSection,
  SRBModule,
  SRBQuestion,
} from "./types";

// ═══════════════════════════════════════════════════════════
// 🎯 دالة توليد SRB ID
// ═══════════════════════════════════════════════════════════

/**
 * توليد معرّف SRB كامل.
 *
 * @param level - المستوى (L0-L7)
 * @param section - الدرس (S01-S20)
 * @param module - المهارة (m1-m99)
 * @param variant - الصعوبة (B/A)
 * @param sequence - التسلسل (1-999)
 * @returns SRB ID بصيغة SRB-L0-S01-m1-B001
 */
export function generateSrbId(
  level: SRBLevel,
  section: SRBSection,
  module: SRBModule,
  variant: "B" | "A",
  sequence: number,
): string {
  // التحقق من المدخلات
  if (sequence < 1 || sequence > 999) {
    throw new RangeError(
      `sequence must be between 1 and 999, got ${sequence}`,
    );
  }

  const paddedSeq = String(sequence).padStart(3, "0");

  return `SRB-${level}-${section}-${module}-${variant}${paddedSeq}`;
}

// ═══════════════════════════════════════════════════════════
// 🔍 دالة تحليل SRB ID
// ═══════════════════════════════════════════════════════════

/**
 * أجزاء SRB ID المُحلَّلة.
 */
export interface ParsedSrbId {
  level: SRBLevel;
  section: SRBSection;
  module: SRBModule;
  variant: "B" | "A";
  sequence: number;
}

/**
 * تحليل SRB ID إلى أجزائه.
 *
 * @param id - SRB ID كامل
 * @returns أجزاء ID
 * @throws Error إذا كان ID غير صالح
 */
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

/**
 * التحقق من صحة SRB ID (بدون رمي خطأ).
 */
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

/**
 * استخراج رقم المستوى من SRB ID.
 */
export function getLevelNumber(level: SRBLevel): number {
  return parseInt(level.replace("L", ""), 10);
}

/**
 * استخراج رقم الدرس من SRB ID.
 */
export function getSectionNumber(section: SRBSection): number {
  return parseInt(section.replace("S", ""), 10);
}

/**
 * استخراج رقم المهارة من SRB ID.
 */
export function getModuleNumber(module: SRBModule): number {
  return parseInt(module.replace("m", ""), 10);
}

/**
 * استخراج "skill ID" (المستوى + الدرس + المهارة) من SRB ID.
 *
 * مثال: SRB-L0-S01-m1-B001 → SRB-L0-S01-m1
 */
export function getSkillId(fullId: string): string {
  const parsed = parseSrbId(fullId);
  return `SRB-${parsed.level}-${parsed.section}-${parsed.module}`;
}

/**
 * استخراج "section ID" (المستوى + الدرس) من SRB ID.
 *
 * مثال: SRB-L0-S01-m1-B001 → SRB-L0-S01
 */
export function getSectionId(fullId: string): string {
  const parsed = parseSrbId(fullId);
  return `SRB-${parsed.level}-${parsed.section}`;
}

// ═══════════════════════════════════════════════════════════
// 📊 ترقيم عربي
// ═══════════════════════════════════════════════════════════

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

/**
 * تحويل رقم إلى صيغة عربية.
 *
 * @param num - الرقم
 * @returns الرقم بالأرقام العربية
 */
export function toArabicDigits(num: number): string {
  return String(num)
    .split("")
    .map((char) => {
      const digit = parseInt(char, 10);
      return isNaN(digit) ? char : ARABIC_DIGITS[digit];
    })
    .join("");
}

/**
 * عرض SRB ID بصيغة عربية جميلة.
 *
 * مثال: SRB-L0-S01-m1-B001 → SRB-L٠-S٠١-m١-B٠٠١
 */
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
 * @param spec - المواصفات المختصرة
 * @returns السؤال الكامل
 */
export function makeQuestion(
  spec: import("./types").SRBQuestionSpec,
): SRBQuestion {
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
    mastery_threshold,
    prerequisite_id,
    tags,
    original_bank_id,
    original_bank_section,
    classification_note,
  } = spec;

  // حساب digit_count_max من النتيجة
  const digit_count_max = Math.max(
    1,
    String(Math.abs(Math.trunc(result))).length,
  );

  // حساب operand_count من السؤال
  const operand_count = operands.length;

  // التحقق من target_time_ms = [min, max] حيث max = min × 1.5
  const minMs = expected_time_ms;
  const maxMs = Math.round(minMs * 1.5);

  // حساب stage من level
  const levelNum = getLevelNumber(level);
  const stage = levelNum <= 3 ? "basic" : "advanced";

  // حساب mastery_threshold من variant
  const threshold = mastery_threshold ?? (variant === "B" ? 0.85 : 0.8);

  // حساب difficulty_score من difficulty (إن لم يُحدَّد)
  const diffScore = difficulty_score ?? difficulty * 1.0;

  // توليد ID
  const id = generateSrbId(level, section, module, variant, sequence);

  // حساب place_values من operands + result
  const place_values = computePlaceValues([...operands, result]);

  // حساب has_carry و has_borrow (تقريبي)
  const has_carry = movement.includes("carry") || movement.includes("ten-friend-add");
  const has_borrow = movement.includes("borrow") || movement.includes("ten-friend-sub");

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

/**
 * حساب place_values من قائمة أرقام.
 */
function computePlaceValues(
  values: number[],
): import("./types").SRBPlaceValue[] {
  const maxDigits = Math.max(
    1,
    ...values.map((v) => String(Math.abs(Math.trunc(v))).length),
  );

  if (maxDigits >= 4) return ["units", "tens", "hundreds", "thousands"];
  if (maxDigits === 3) return ["units", "tens", "hundreds"];
  if (maxDigits === 2) return ["units", "tens"];
  return ["units"];
}