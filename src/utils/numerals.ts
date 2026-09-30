// src/utils/numberStyle.ts

export type NumberStyle = "arabic" | "latin";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** ✅ الفاصلة العشرية العربية (U+066B) */
const ARABIC_DECIMAL_SEPARATOR = "٫";

/** ✅ الفاصلة العشرية اللاتينية */
const LATIN_DECIMAL_SEPARATOR = ".";

export function toArabicDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
}

export function toLatinDigits(value: string | number): string {
  return String(value).replace(/[٠-٩]/g, (d) =>
    String(ARABIC_DIGITS.indexOf(d)),
  );
}

export function formatNumber(
  value: string | number,
  style: NumberStyle,
): string {
  return style === "arabic" ? toArabicDigits(value) : String(value);
}

/**
 * ✅ مُحدَّثة: تحوّل الفاصلة العشرية حسب الأسلوب.
 *
 * - "6.3" → "٦٫٣" (عربي)
 * - "٦٫٣" → "6.3" (لاتيني)
 * - "6 × 3" → "٦ × ٣" (لا يتأثر — لا يوجد . بين رقمين)
 * - "√625" → "√٦٢٥" (لا يتأثر)
 * - "84 ÷ 2" → "٨٤ ÷ ٢" (لا يتأثر)
 */
export function formatText(
  text: string,
  style: NumberStyle,
): string {
  if (style === "arabic") {
    // 1) حوّل الأرقام إلى عربية
    const arabized = toArabicDigits(text);
    // 2) حوّل النقطة العشرية (بين رقمين) إلى فاصلة عربية
    return arabized.replace(
      /([٠-٩])\.([٠-٩])/g,
      `$1${ARABIC_DECIMAL_SEPARATOR}$2`,
    );
  }

  // لاتيني: 
  // 1) حوّل الأرقام العربية إلى لاتينية
  // 2) حوّل الفاصلة العربية إلى نقطة لاتينية
  const latinized = toLatinDigits(text);
  return latinized.replace(
    /([0-9])٫([0-9])/g,
    `$1${LATIN_DECIMAL_SEPARATOR}$2`,
  );
}

export function formatPrompt(
  operands: number[],
  operation: "+" | "-" | "×" | "÷",
  style: NumberStyle,
): string {
  if (operands.length === 0) return "";

  const parts: string[] = [];

  operands.forEach((op, i) => {
    if (i === 0) {
      parts.push(formatNumber(op, style));
    } else {
      if (op >= 0) {
        parts.push(`${operation} ${formatNumber(op, style)}`);
      } else {
        const abs = Math.abs(op);
        const subSymbol = style === "arabic" ? "−" : "-";
        parts.push(`${subSymbol} ${formatNumber(abs, style)}`);
      }
    }
  });

  return parts.join(" ");
}

export function isValidInput(
  value: string,
  style: NumberStyle,
): boolean {
  if (style === "arabic") return /^[٠-٩]*$/.test(value);
  return /^[0-9]*$/.test(value);
}

export function parseInput(value: string): number {
  const latin = toLatinDigits(value);
  const num = parseInt(latin, 10);
  return Number.isFinite(num) ? num : 0;
}

/**
 * ✅ جديد: يحوّل نصًا (بفاصلة عربية أو لاتينية) إلى رقم عشري.
 * - "6.3" → 6.3
 * - "٦٫٣" → 6.3
 * - "٦.٣" → 6.3
 */
export function parseDecimalInput(value: string): number {
  const latinized = toLatinDigits(value).replace(/٫/g, ".");
  const num = parseFloat(latinized);
  return Number.isFinite(num) ? num : 0;
}

export function loadNumberStyle(): NumberStyle {
  try {
    const raw = localStorage.getItem("soroban_number_style");
    if (raw === "arabic" || raw === "latin") return raw;
  } catch { /* ignore */ }
  return "arabic";
}

export function saveNumberStyle(style: NumberStyle): void {
  try {
    localStorage.setItem("soroban_number_style", style);
  } catch { /* ignore */ }
}