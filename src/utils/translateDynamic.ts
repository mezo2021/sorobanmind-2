type DynamicText = Record<string, any>;

// دالة ذكية لتوحيد النصوص (تحذف التشكيل، توحد الهمزات، تحول الأرقام العربية، وتزيل المسافات الزائدة)
function normalizeArabic(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/[\u064B-\u065F]/g, "") // إزالة التشكيل
    .replace(/[أإآ]/g, "ا")         // توحيد الألف
    .replace(/ة/g, "ه")            // توحيد التاء المربوطة
    .replace(/ى/g, "ي")            // توحيد الألف المقصورة
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))) // تحويل الأرقام العربية إلى إنجليزية
    .replace(/\s+/g, " ")          // إزالة المسافات الزائدة
    .trim();
}

// القاموس الشامل (قبل التطبيع)
const RAW_AR_TO_EN: Record<string, string> = {
  // المهارات (الضرب)
  "ضرب باصدقاء 5": "Mul with Friends of 5", 
  "ضرب بأصدقاء 5": "Mul with Friends of 5",
  "ضرب باصدقاء 10": "Mul with Friends of 10", 
  "ضرب بأصدقاء 10": "Mul with Friends of 10",
  "ضرب مركب": "Compound Mul", 
  "ضرب بسيط": "Direct Mul",

  // المهارات (الطرح)
  "طرح باصدقاء 5": "Sub with Friends of 5", 
  "طرح بأصدقاء 5": "Sub with Friends of 5",
  "طرح باصدقاء 10": "Sub with Friends of 10", 
  "طرح بأصدقاء 10": "Sub with Friends of 10",
  "طرح مركب": "Compound Sub", 
  "طرح بسيط": "Direct Sub",

  // المهارات (الجمع)
  "جمع باصدقاء 5": "Add with Friends of 5", 
  "جمع بأصدقاء 5": "Add with Friends of 5",
  "جمع باصدقاء 10": "Add with Friends of 10", 
  "جمع بأصدقاء 10": "Add with Friends of 10",
  "جمع مركب": "Compound Add", 
  "جمع بسيط": "Direct Add",

  // المهارات (الأساسيات)
  "تمثيل 0-4": "Representing 0-4", 
  "تمثيل 5-9": "Representing 5-9",
  "المئات والآلاف": "Hundreds & Thousands", 
  "الاحاد والعشرات": "Units & Tens",
  "الآحاد والعشرات": "Units & Tens",

  // أسماء الأوسمة
  "المستكشف": "Explorer", "الصاعد": "Rising Star", "السريع": "Fast",
  "المتفوق": "Top Achiever", "الدقيق": "Precise", "المثابر": "Persistent",
  "الرائد": "Pioneer", "القناص": "Sniper", "المتدفق": "Flow",
  "الحارس": "Guardian", "الفاتح": "Conqueror", "الصامد": "Resilient",
  
  // أوصاف الأوسمة
  "جرب 20 مهارة": "Tried 20 skills", 
  "تعافى من جلسة علاجية": "Recovered from session",
  "10 مهارات بزمن قياسي": "10 skills in record time", 
  "8 شارات إتقان": "8 mastery badges",
  "5 مهارات بلا خطأ": "5 skills without mistakes", 
  "10 محاولة إجمالية": "10 total attempts",
  "500 إجابة صحيحة": "500 correct answers", 
  "20 إجابة متتالية": "20 consecutive correct",
  "مهارة بدقة 90%": "Skill with 90% accuracy", 
  "10 متتالية في السلاسل": "10 streak in chains",
  "أتم قسم كامل": "Completed a section", 
  "دقة 80% في مهارة مكتملة": "80% accuracy in skill",
  
  // أسماء
  "ميمو": "Mimo", 
  "البطل": "Hero"
};

// بناء القاموس المطبع مسبقاً لضمان التطابق 100%
const AR_TO_EN: Record<string, string> = {};
Object.entries(RAW_AR_TO_EN).forEach(([key, val]) => {
  AR_TO_EN[normalizeArabic(key)] = val;
});

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
      // البحث عن النص بعد تطبيعه
      const normalizedKey = normalizeArabic(String(ar));
      if (AR_TO_EN[normalizedKey]) return AR_TO_EN[normalizedKey];
    }
    return ar ? String(ar) : "";
  }

  return ar ?? en ?? "";
}