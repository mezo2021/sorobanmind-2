// src/components/games/MentalArchivesGame/ui/speechToNumber.ts
// دالة نقية: تحويل نص منطوق (عربي/إنجليزي/أرقام) إلى رقم صحيح غير سالب.

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));

const WORDS: Record<string, number> = {
  // English
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90,
  // Arabic (بعد التطبيع)
  صفر: 0, واحد: 1, احد: 1, اثنان: 2, اثنين: 2, اثنا: 2, اثني: 2, ثلاثه: 3, ثلاث: 3,
  اربعه: 4, اربع: 4, خمسه: 5, خمس: 5, سته: 6, ست: 6, سبعه: 7, سبع: 7, ثمانيه: 8, ثماني: 8,
  ثمان: 8, تسعه: 9, تسع: 9, عشره: 10, عشر: 10, عشرون: 20, عشرين: 20, ثلاثون: 30, ثلاثين: 30,
  اربعون: 40, اربعين: 40, خمسون: 50, خمسين: 50, ستون: 60, ستين: 60, سبعون: 70, سبعين: 70,
  ثمانون: 80, ثمانين: 80, تسعون: 90, تسعين: 90,
};
const HUNDRED = new Set(['hundred', 'مئه', 'مائه', 'ميه', 'مايه']);
const THOUSAND = new Set(['thousand', 'الف', 'الاف']);
const ARABIC_HUNDREDS: Record<string, number> = {
  مئتين: 200, مئتان: 200, مائتين: 200, مائتان: 200, ثلاثمئه: 300, ثلاثمائه: 300,
  اربعمئه: 400, اربعمائه: 400, خمسمئه: 500, خمسمائه: 500, ستمئه: 600, ستمائه: 600,
  سبعمئه: 700, سبعمائه: 700, ثمانمئه: 800, ثمانمائه: 800, تسعمئه: 900, تسعمائه: 900,
};

export function speechToNumber(raw: string): number | null {
  if (!raw) return null;
  const text = norm(raw).replace(/[,،.]/g, ' ');

  const digits = text.replace(/\s+/g, '').match(/^\d{1,7}$/);
  if (digits) return parseInt(digits[0], 10);
  const mixed = text.match(/\d+/);
  if (mixed && !/[a-zا-ي]/.test(text.replace(/\d+/g, ''))) return parseInt(mixed[0], 10);

  let total = 0;
  let current = 0;
  let found = false;
  for (let tok of text.split(/\s+/).filter(Boolean)) {
    if (tok.startsWith('و') && tok.length > 2 && !WORDS[tok] && !ARABIC_HUNDREDS[tok]) tok = tok.slice(1);
    if (WORDS[tok] !== undefined) { current += WORDS[tok]; found = true; }
    else if (ARABIC_HUNDREDS[tok] !== undefined) { current += ARABIC_HUNDREDS[tok]; found = true; }
    else if (HUNDRED.has(tok)) { current = (current || 1) * 100; found = true; }
    else if (THOUSAND.has(tok)) { total += (current || 1) * 1000; current = 0; found = true; }
  }
  return found ? total + current : null;
}
