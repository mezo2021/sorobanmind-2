// src/utils/numerals.ts

export type NumeralStyle = "auto" | "arabic" | "western";

const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toArabicNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) =>
    ARABIC_DIGITS[parseInt(d, 10)]
  );
}

export function toWesternNumerals(value: string): string {
  return value.replace(/[٠-٩]/g, (d) =>
    String(ARABIC_DIGITS.indexOf(d))
  );
}

export function formatNumber(
  value: number | string,
  style: NumeralStyle = "auto",
  userAge?: number,
): string {
  if (style === "arabic") return toArabicNumerals(value);
  if (style === "western") return String(value);

  // auto
  if (userAge !== undefined && userAge >= 13) return String(value);
  return toArabicNumerals(value);
}