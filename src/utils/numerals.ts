// src/utils/numberStyle.ts

export type NumberStyle = "arabic" | "latin";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

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

export function formatText(
  text: string,
  style: NumberStyle,
): string {
  return style === "arabic" ? toArabicDigits(text) : toLatinDigits(text);
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