// src/i18n/pickLang.ts  (v2)
// يختار النص المناسب للغة من 3 صيغ:
//   1) { ar, en }                  ← الصيغة الأنظف (المستهدفة)
//   2) "عربي | English"            ← صيغة L1 الحالية (يدعم الفاصل داخل الأقواس)
//   3) "نص بلغة واحدة"            ← يُعاد كما هو
//
// دالة نقية (بلا store ولا React) — استخدمها مع: const { lang } = useT();
//
// v2: معالجة الفاصل داخل الأقواس، مثل:
//   "+1 = +5 − 4 (صديق 1 الصغير هو 4 | Small friend of 1 is 4)"

import type { Language } from "./index";

export type Localized =
  | string
  | { ar?: string; en?: string }
  | null
  | undefined;

const SEP = " | ";
const ARABIC_RE = /[\u0600-\u06FF]/;
const LATIN_RE = /[A-Za-z]/;

/** زوج صالح: الأول عربي، والثاني لاتيني بلا عربي ولا فاصل. */
function isBilingualPair(first: string, second: string): boolean {
  return (
    ARABIC_RE.test(first) &&
    !ARABIC_RE.test(second) &&
    LATIN_RE.test(second) &&
    !second.includes(SEP)
  );
}

/** أقرب '(' غير مغلقة قبل الموضع idx، أو -1 */
function findOpenParenBefore(s: string, idx: number): number {
  let bal = 0;
  for (let j = idx - 1; j >= 0; j--) {
    if (s[j] === ")") bal++;
    else if (s[j] === "(") {
      if (bal === 0) return j;
      bal--;
    }
  }
  return -1;
}

/** أقرب ')' تُغلق القوس المفتوح بعد الموضع from، أو -1 */
function findCloseParenAfter(s: string, from: number): number {
  let bal = 0;
  for (let j = from; j < s.length; j++) {
    if (s[j] === "(") bal++;
    else if (s[j] === ")") {
      if (bal === 0) return j;
      bal--;
    }
  }
  return -1;
}

export function pickLang(value: Localized, lang: Language): string {
  if (value === null || value === undefined) return "";

  // الصيغة 1: كائن { ar, en } — مع رجوع للغة الأخرى إن غابت الترجمة
  if (typeof value === "object") {
    const primary = lang === "en" ? value.en : value.ar;
    const fallback = lang === "en" ? value.ar : value.en;
    return primary || fallback || "";
  }

  // الصيغة 2: "عربي | English"
  if (!value.includes(SEP)) return value;

  // ابحث عن أول فاصل على مستوى الأقواس 0 (أعلى مستوى)،
  // وتذكّر أول فاصل داخل أقواس كاحتياطي.
  let depth = 0;
  let topIdx = -1;
  let innerIdx = -1;
  for (let i = 0; i < value.length; i++) {
    const ch = value[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (value.startsWith(SEP, i)) {
      if (depth === 0) {
        topIdx = i;
        break;
      }
      if (innerIdx === -1) innerIdx = i;
    }
  }

  // (أ) فاصل على أعلى مستوى
  if (topIdx !== -1) {
    const first = value.slice(0, topIdx).trim();
    const second = value.slice(topIdx + SEP.length).trim();
    if (isBilingualPair(first, second)) {
      return lang === "en" ? second : first;
    }
    return value;
  }

  // (ب) فاصل داخل أقواس فقط: نُبقي ما قبل القوس وما بعده كما هو
  if (innerIdx !== -1) {
    const open = findOpenParenBefore(value, innerIdx);
    const close = findCloseParenAfter(value, innerIdx + SEP.length);
    if (open !== -1 && close !== -1) {
      const arPart = value.slice(open + 1, innerIdx).trim();
      const enPart = value.slice(innerIdx + SEP.length, close).trim();
      if (isBilingualPair(arPart, enPart)) {
        return (
          value.slice(0, open + 1) +
          (lang === "en" ? enPart : arPart) +
          value.slice(close)
        );
      }
    }
  }

  // الصيغة 3: نص بلغة واحدة
  return value;
}
