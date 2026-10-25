type DynamicText = Record<string, any>;

// دالة ذكية لتوحيد النصوص
function normalizeArabic(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // إزالة المسافات الخفية
    .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
    .replace(/[أإآ]/g, "ا")         // توحيد الألف
    .replace(/ة/g, "ه")            // توحيد التاء المربوطة
    .replace(/ى/g, "ي")            // توحيد الألف المقصورة
    .replace(/٪/g, "%")            // تحويل علامة النسبة العربية
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // تحويل الأرقام العربية
    .replace(/\s+/g, " ")          // إزالة المسافات الزائدة
    .trim();
}

// القاموس الثابت
const RAW_AR_TO_EN: Record<string, string> = {
  "ضرب باصدقاء 5": "Mul with Friends of 5", "ضرب بأصدقاء 5": "Mul with Friends of 5",
  "ضرب باصدقاء 10": "Mul with Friends of 10", "ضرب بأصدقاء 10": "Mul with Friends of 10",
  "ضرب مركب": "Compound Mul", "ضرب بسيط": "Direct Mul",
  "طرح باصدقاء 5": "Sub with Friends of 5", "طرح بأصدقاء 5": "Sub with Friends of 5",
  "طرح باصدقاء 10": "Sub with Friends of 10", "طرح بأصدقاء 10": "Sub with Friends of 10",
  "طرح مركب": "Compound Sub", "طرح بسيط": "Direct Sub",
  "جمع باصدقاء 5": "Add with Friends of 5", "جمع بأصدقاء 5": "Add with Friends of 5",
  "جمع باصدقاء 10": "Add with Friends of 10", "جمع بأصدقاء 10": "Add with Friends of 10",
  "جمع مركب": "Compound Add", "جمع بسيط": "Direct Add",
  "تمثيل 0-4": "Representing 0-4", "تمثيل 5-9": "Representing 5-9",
  "المئات والآلاف": "Hundreds & Thousands", "الاحاد والعشرات": "Units & Tens",
  "المستكشف": "Explorer", "الصاعد": "Rising Star", "السريع": "Fast",
  "المتفوق": "Top Achiever", "الدقيق": "Precise", "المثابر": "Persistent",
  "الرائد": "Pioneer", "القناص": "Sniper", "المتدفق": "Flow",
  "الحارس": "Guardian", "الفاتح": "Conqueror", "الصامد": "Resilient",
  "تعافى من جلسة علاجية": "Recovered from session",
  "أتم قسم كامل": "Completed a section", 
  "ميمو": "Mimo", "البطل": "Hero"
};

const AR_TO_EN: Record<string, string> = {};
Object.entries(RAW_AR_TO_EN).forEach(([key, val]) => {
  AR_TO_EN[normalizeArabic(key)] = val;
});

// 🆕 دالة الأنماط المتسامحة جداً (تتجاهل المسافات والترتيب)
function translatePattern(text: string): string | null {
  let match;

  match = text.match(/جرب.*?(\d+).*?مهاره/);
  if (match) return `Tried ${match[1]} skills`;

  match = text.match(/(\d+).*?مهارات.*?بزمن.*?قياسي/);
  if (match) return `${match[1]} skills in record time`;

  match = text.match(/(\d+).*?شارات.*?اتقان/);
  if (match) return `${match[1]} mastery badges`;

  match = text.match(/(\d+).*?مهارات.*?بلا.*?خطا/);
  if (match) return `${match[1]} skills without mistakes`;

  match = text.match(/(\d+).*?محاول.*?اجماليه/);
  if (match) return `${match[1]} total attempts`;

  match = text.match(/(\d+).*?اجاب.*?صحيحه/);
  if (match) return `${match[1]} correct answers`;

  match = text.match(/(\d+).*?اجاب.*?متتاليه/);
  if (match) return `${match[1]} consecutive correct`;

  // مهارة بدقة X%
  match = text.match(/مهاره.*?بدقه.*?(\d+)/);
  if (match) return `Skill with ${match[1]}% accuracy`;
  match = text.match(/(\d+).*?مهاره.*?بدقه/);
  if (match) return `Skill with ${match[1]}% accuracy`;

  match = text.match(/(\d+).*?متتاليه.*?في.*?السلاسل/);
  if (match) return `${match[1]} streak in chains`;

  // 🆕 معالجة الصاعد (دقة X% في مهارة مكتملة) بمرونة تامة
  match = text.match(/دقه.*?(\d+).*?مكتمله/);
  if (match) return `${match[1]}% accuracy in skill`;
  match = text.match(/(\d+).*?دقه.*?مكتمله/);
  if (match) return `${match[1]}% accuracy in skill`;

  return null;
}

export function translateDynamic(
  item: DynamicText | null | undefined,
  lang: string,
  field: string
): string {
  if (!item) return "";

  const ar = item[`${field}Ar`] ?? item[`${field}AR`] ?? item[field];
  const en = item[`${field}En`] ?? item[`${field}EN`];

  if (lang === "en") {
    if (en) return String(en);
    
    if (ar) {
      const normalizedKey = normalizeArabic(String(ar));
      
      if (AR_TO_EN[normalizedKey]) {
        return AR_TO_EN[normalizedKey];
      }
      
      const patternTranslation = translatePattern(normalizedKey);
      if (patternTranslation) {
        return patternTranslation;
      }
    }
    return ar ? String(ar) : "";
  }

  return ar ?? en ?? "";
}