// src/i18n/pickLang.ts
// يختار النص المناسب للغة من 3 صيغ:
//   1) { ar, en }                  ← الصيغة الأنظف (المستهدفة)
//   2) "عربي | English"            ← صيغة L1 الحالية
//   3) "نص بلغة واحدة"            ← يُعاد كما هو
//
// دالة نقية (بلا store ولا React) — استخدمها مع: const { lang } = useT();

import type { Language } from "./index";

export type Localized =
  | string
  | { ar?: string; en?: string }
  | null
  | undefined;

const SEP = " | ";
const ARABIC_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[A-Za-z]/;

export function pickLang(value: Localized, lang: Language): string {
  if (value === null || value === undefined) return "";

  // الصيغة 1: كائن { ar, en } — مع رجوع للغة الأخرى إن غابت الترجمة
  if (typeof value === "object") {
    const primary = lang === "en" ? value.en : value.ar;
    const fallback = lang === "en" ? value.ar : value.en;
    return primary || fallback || "";
  }

  // الصيغة 2: "عربي | English" — لا نقسم إلا عند تحقق الشرط بدقة:
  // الجزء الأول فيه عربي، والثاني لاتيني بلا عربي، ولا فاصل ثانٍ.
  const idx = value.indexOf(SEP);
  if (idx !== -1) {
    const first = value.slice(0, idx).trim();
    const second = value.slice(idx + SEP.length).trim();
    const isBilingual =
      ARABIC_RE.test(first) &&
      !ARABIC_RE.test(second) &&
      LATIN_RE.test(second) &&
      !second.includes(SEP);
    if (isBilingual) return lang === "en" ? second : first;
  }

  // الصيغة 3: نص بلغة واحدة
  return value;
}
