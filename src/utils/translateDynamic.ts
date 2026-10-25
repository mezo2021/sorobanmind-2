type DynamicText = Record<string, any>;

// قاموس ترجمة للنصوص القادمة من البيانات (لأنها لا تحتوي على حقل En)
const AR_TO_EN: Record<string, string> = {
  // أسماء الأوسمة
  "المستكشف": "Explorer", "الصاعد": "Rising Star", "السريع": "Fast",
  "المتفوق": "Top Achiever", "الدقيق": "Precise", "المثابر": "Persistent",
  "الرائد": "Pioneer", "القناص": "Sniper", "المتدفق": "Flow",
  "الحارس": "Guardian", "الفاتح": "Conqueror", "الصامد": "Resilient",
  // وصف الأوسمة
  "جرب 20 مهارة": "Tried 20 skills", "تعافى من جلسة علاجية": "Recovered from session",
  "10 مهارات بزمن قياسي": "10 skills in record time", "8 شارات إتقان": "8 mastery badges",
  "5 مهارات بلا خطأ": "5 skills without mistakes", "10 محاولة إجمالية": "10 total attempts",
  "500 إجابة صحيحة": "500 correct answers", "20 إجابة متتالية": "20 consecutive correct",
  "مهارة بدقة 90%": "Skill with 90% accuracy", "10 متتالية في السلاسل": "10 streak in chains",
  "أتم قسم كامل": "Completed a section", "دقة 80% في مهارة مكتملة": "80% accuracy in skill",
  // المهارات والدروس
  "ضرب بأصدقاء 5": "Mul with Friends of 5", "ضرب بأصدقاء 10": "Mul with Friends of 10",
  "ضرب مركب": "Compound Mul", "ضرب بسيط": "Direct Mul",
  "طرح باصدقاء 5": "Sub with Friends of 5", "طرح مركب": "Compound Sub", "طرح بسيط": "Direct Sub",
  "جمع باصدقاء 5": "Add with Friends of 5", "جمع باصدقاء 10": "Add with Friends of 10",
  "جمع مركب": "Compound Add", "جمع بسيط": "Direct Add",
  "تمثيل 0-4": "Representing 0-4", "تمثيل 5-9": "Representing 5-9",
  "المئات والآلاف": "Hundreds & Thousands", "الآحاد والعشرات": "Units & Tens",
  // أسماء
  "ميمو": "Mimo", "البطل": "Hero"
};

export function translateDynamic(
  item: DynamicText | null | undefined,
  lang: string,
  field: string
): string {
  if (!item) return "";

  const ar = item[`${field}Ar`] ?? item[`${field}AR`];
  const en = item[`${field}En`] ?? item[`${field}EN`];

  if (lang === "en") {
    if (en) return String(en);
    // إذا لم يوجد En، نبحث في القاموس
    if (ar && AR_TO_EN[ar]) return AR_TO_EN[ar];
    return ar ? String(ar) : "";
  }

  return ar ?? en ?? "";
}