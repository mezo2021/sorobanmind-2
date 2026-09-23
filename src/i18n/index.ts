// src/i18n/index.ts

import { ar } from "./ar";
import { en } from "./en";

export type Language = "ar" | "en";

export const translations = { ar, en };

export type TranslationKey = keyof typeof ar;

/**
 * ترجمة مفتاح مع دعم {placeholders}
 */
export function translate(
  lang: Language,
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const dict = translations[lang];
  let text: string = dict[key] ?? key;

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }

  return text;
}