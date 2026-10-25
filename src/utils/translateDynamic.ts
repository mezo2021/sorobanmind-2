type DynamicText = Record<string, any>;

const AR_TO_EN: Record<string, string> = {
  // المهارات (بجميع صيغ الهمزات)
  "طرح باصدقاء 5": "Sub with Friends of 5", "طرح بأصدقاء 5": "Sub with Friends of 5",
  "جمع باصدقاء 5": "Add with Friends of 5", "جمع بأصدقاء 5": "Add with Friends of 5",
  "طرح باصدقاء 10": "Sub with Friends of 10", "طرح بأصدقاء 10": "Sub with Friends of 10",
  "جمع باصدقاء 10": "Add with Friends of 10", "جمع بأصدقاء 10": "Add with Friends of 10",
  "المئات والآلاف": "Hundreds & Thousands",
  "المستكشف": "Explorer", "الصاعد": "Rising Star", "السريع": "Fast",
  "المتفوق": "Top Achiever", "الدقيق": "Precise", "المثابر": "Persistent",
  "الرائد": "Pioneer", "القناص": "Sniper", "المتدفق": "Flow",
  "الحارس": "Guardian", "الفاتح": "Conqueror", "الصامد": "Resilient",
  // أوصاف الأوسمة
  "جرب 20 مهارة": "Tried 20 skills", "تعافى من جلسة علاجية": "Recovered from session",
  "10 مهارات بزمن قياسي": "10 skills in record time", "8 شارات إتقان": "8 mastery badges",
  "5 مهارات بلا خطأ": "5 skills without mistakes", "10 محاولة إجمالية": "10 total attempts",
  "500 إجابة صحيحة": "500 correct answers", "20 إجابة متتالية": "20 consecutive correct",
  "مهارة بدقة 90%": "Skill with 90% accuracy", "10 متتالية في السلاسل": "10 streak in chains",
  "أتم قسم كامل": "Completed a section", "دقة 80% في مهارة مكتملة": "80% accuracy in skill",
  "ميمو": "Mimo", "البطل": "Hero"
};

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
      const key = String(ar).trim();
      if (AR_TO_EN[key]) return AR_TO_EN[key];
    }
    return ar ? String(ar) : "";
  }

  return ar ?? en ?? "";
}