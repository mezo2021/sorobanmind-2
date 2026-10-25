// src/utils/arabicNumbers.ts
// تحويل الأرقام إلى كلمات عربية — للأنزان السمعي
// يدعم حتى 999 تريليون + الأعداد العشرية
// 🆕 إضافة دعم اللغة الإنجليزية (lang) لإرجاع الرقم كنص ليقرأه TTS بلكنة إنجليزية.

const UNITS = [
  '', 'واحد', 'اثنان', 'ثلاثة', 'أربعة',
  'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة',
];

const TEENS = [
  'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر',
  'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر',
];

const TENS = [
  '', '', 'عشرون', 'ثلاثون', 'أربعون',
  'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون',
];

const HUNDREDS = [
  '', 'مئة', 'مئتان', 'ثلاثمئة', 'أربعمئة',
  'خمسمئة', 'ستمئة', 'سبعمئة', 'ثمانمئة', 'تسعمئة',
];

// ─── 1-99 ───
function below100(n: number): string {
  if (n === 0) return '';
  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (u === 0) return TENS[t];
  return `${UNITS[u]} و${TENS[t]}`;
}

// ─── 1-999 ───
function below1000(n: number): string {
  if (n === 0) return '';
  if (n < 100) return below100(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (r === 0) return HUNDREDS[h];
  return `${HUNDREDS[h]} و${below100(r)}`;
}

// ─── الآلاف ───
function thousands(n: number): string {
  if (n === 1) return 'ألف';
  if (n === 2) return 'ألفان';
  if (n >= 3 && n <= 10) return `${below1000(n)} آلاف`;
  return `${below1000(n)} ألف`;
}

// ─── الملايين ───
function millions(n: number): string {
  if (n === 1) return 'مليون';
  if (n === 2) return 'مليونان';
  if (n >= 3 && n <= 10) return `${below1000(n)} ملايين`;
  return `${below1000(n)} مليون`;
}

// ─── المليارات ───
function billions(n: number): string {
  if (n === 1) return 'مليار';
  if (n === 2) return 'ملياران';
  if (n >= 3 && n <= 10) return `${below1000(n)} مليارات`;
  return `${below1000(n)} مليار`;
}

// ─── التريليونات ───
function trillions(n: number): string {
  if (n === 1) return 'تريليون';
  if (n === 2) return 'تريليونان';
  if (n >= 3 && n <= 10) return `${below1000(n)} تريليونات`;
  return `${below1000(n)} تريليون`;
}

// ═══════════════════════════════════════════════════════════
// الدالة الرئيسية (للأعداد الصحيحة)
// ═══════════════════════════════════════════════════════════

export function numberToArabicWords(value: number): string {
  if (!Number.isFinite(value)) return '';
  const n = Math.trunc(Math.abs(value));
  if (n === 0) return 'صفر';

  const parts: string[] = [];

  const t = Math.floor(n / 1_000_000_000_000);
  const b = Math.floor((n % 1_000_000_000_000) / 1_000_000_000);
  const m = Math.floor((n % 1_000_000_000) / 1_000_000);
  const k = Math.floor((n % 1_000_000) / 1000);
  const r = n % 1000;

  if (t > 0) parts.push(trillions(t));
  if (b > 0) parts.push(billions(b));
  if (m > 0) parts.push(millions(m));
  if (k > 0) parts.push(thousands(k));
  if (r > 0) parts.push(below1000(r));

  return parts.join(' و');
}

export function numberToArabicWordsSigned(value: number): string {
  if (value < 0) return `ناقص ${numberToArabicWords(Math.abs(value))}`;
  return numberToArabicWords(value);
}

// ═══════════════════════════════════════════════════════════
// دعم الأعداد العشرية + دعم اللغة الإنجليزية (🆕)
// ═══════════════════════════════════════════════════════════

/**
 * يحوّل عددًا (صحيحًا أو عشريًا) إلى كلمات عربية أو إنجليزية.
 * 
 * @param value الرقم
 * @param lang اللغة (افتراضياً 'ar' لضمان التوافق العكسي)
 */
export function numberToArabicWordsDecimal(value: number, lang: 'ar' | 'en' = 'ar'): string {
  if (!Number.isFinite(value)) return '';

  // 🆕 في الوضع الإنجليزي، نرجع الرقم كنص (محرك TTS الإنجليزي يقرأه ببراعة)
  if (lang === 'en') {
    return String(value);
  }

  // رقم صحيح → الدالة القديمة
  if (Number.isInteger(value)) {
    return numberToArabicWords(value);
  }

  const sign = value < 0 ? 'ناقص ' : '';
  const abs = Math.abs(value);
  const str = abs.toString();
  const [intPart, decPart] = str.split('.');

  const intWords = numberToArabicWords(Number(intPart));
  const decWords = numberToArabicWords(Number(decPart));

  return `${sign}${intWords} فاصلة ${decWords}`;
}

/**
 * للاستخدام في السياق الرياضي — يعالج السالب + العشري.
 * 
 * @param value الرقم
 * @param lang اللغة (افتراضياً 'ar')
 */
export function numberToArabicWordsDecimalSigned(value: number, lang: 'ar' | 'en' = 'ar'): string {
  if (lang === 'en') {
    return String(value);
  }

  if (value < 0) {
    return `ناقص ${numberToArabicWordsDecimal(Math.abs(value), lang)}`;
  }
  return numberToArabicWordsDecimal(value, lang);
}

export default numberToArabicWords;