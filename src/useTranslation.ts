// src/i18n/useTranslation.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Language,
  type TranslationKey,
  translate,
} from "./index";

interface LangState {
  lang: Language;
  setLang: (l: Language) => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
    }),
    { name: "sorobanmind-v2-lang" },
  ),
);

/**
 * هوك الترجمة الرئيسي.
 */
export function useT() {
  const lang = useLangStore((s) => s.lang);

  return {
    t: (
      key: TranslationKey,
      params?: Record<string, string | number>,
    ) => translate(lang, key, params),
    lang,
    isAr: lang === "ar",
    isEn: lang === "en",
    dir: (lang === "ar" ? "rtl" : "ltr") as "rtl" | "ltr",
  };
}