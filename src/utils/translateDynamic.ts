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

// القاموس الثابت (مدمج فيه كل النصوص)
const RAW_AR_TO_EN: Record<string, string> = {
  // --- الكلمات السابقة ---
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
  "ميمو": "Mimo", "البطل": "Hero",

  // --- أوصاف المستويات (LevelScreen) ---
  "التعرّف على السوروبان والأرقام من ٠ إلى ٩ والقيمة المكانية": "Discover the soroban, numbers 0-9, and place value",
  "جمع وطرح بسيط + أصدقاء ٥ + أصدقاء ١٠ + عمليات مركّبة": "Simple addition & subtraction + Friends of 5 + Friends of 10 + compound operations",
  "الضرب المتدرّج (١×٢ · ٢×٢) على السوروبان": "Gradual multiplication (1x2 · 2x2) on the soroban",
  "القسمة المتدرّجة (÷١ · ÷٢) — التقدير والطرح المتتالي": "Gradual division (÷1 · ÷2) — estimation and successive subtraction",
  "سلاسل الجمع والطرح المتعددة الحدود": "Multi-term addition & subtraction chains",
  "الضرب (٢×٣) والقسمة المتقدمة بطرق تاكاشي": "Multiplication (2x3) and advanced division using Takashi methods",
  "العمليات على الأعداد العشرية (جمع · طرح · ضرب · قسمة)": "Operations on decimals (add · sub · mul · div)",
  "الجذور التربيعية الكاملة": "Complete square roots",

  // --- الأسرار السحرية (العناوين والقواعد) ---
  "سر جدول الـ 5": "Secret of the 5 Table", "سر جدول الـ 6": "Secret of the 6 Table",
  "لغز الرقم 7": "The Mystery of 7", "سر جدول الـ 8": "Secret of the 8 Table",
  "سر جدول الـ 9": "Secret of the 9 Table", "سر المضاعفة": "The Doubling Secret",
  "سر أصابع الضرب": "Finger Multiplication Secret", "الضرب في 11": "Multiplication by 11",
  "الضرب في 99": "Multiplication by 99", "الضرب في 999": "Multiplication by 999",
  "أصدقاء المئة (تحت 100)": "Friends of 100 (Under 100)", "الأعداد فوق 100": "Numbers Above 100",
  "الأعداد تحت 1000": "Numbers Under 1000", "الأعداد فوق 1000": "Numbers Above 1000",
  "الأعداد القريبة من 50": "Numbers Near 50", "الأعداد القريبة من 500": "Numbers Near 500",
  "الآحاد: زوجي = 0، فردي = 5": "Units: Even = 0, Odd = 5",
  "العشرات: نصف الرقم (بدون كسور)": "Tens: Half the number (no fractions)",
  "للأعداد الزوجية فقط": "For even numbers only",
  "الآحاد: نفس الرقم | العشرات: نصفه": "Units: Same number | Tens: Half of it",
  "الآحاد: اطرح 3 في كل مرة (مع الدوران عند 10)": "Units: Subtract 3 each time (wrap at 10)",
  "العشرات: تتصاعد وتتوقف عند 2 و 4 مرتين": "Tens: Ascends and stops at 2 and 4 twice",
  "الآحاد: اطرح 2 في كل مرة (مع الدوران عند 10)": "Units: Subtract 2 each time (wrap at 10)",
  "العشرات: تتصاعد، وتتوقف عند 4 مرتين": "Tens: Ascends, stops at 4 twice",
  "الآحاد: صديق العدد الكبير (مكمّله إلى 10)": "Units: Friend of the large number (complement to 10)",
  "العشرات: أكمل العدّ إلى 9 | المجموع = 9": "Tens: Complete count to 9 | Sum = 9",
  "للضرب في 4: ضاعف الرقم مرتين": "For ×4: Double the number twice",
  "للضرب في 8: ضاعف الرقم ثلاث مرات": "For ×8: Double the number three times",
  "الأصابع بالترتيب: الخنصر = 6، البنصر = 7، الوسطى = 8، السبابة = 9، الإبهام = 10": "Fingers in order: Pinky = 6, Ring = 7, Middle = 8, Index = 9, Thumb = 10",
  "نُلمس إصبَعي العددين: الأصابع المتلامسة والأسفل منها = العشرات (جمع × 10) | الأصابع الأعلى = الآحاد (ضرب ببعض)": "Touch the two fingers: Touching and below = Tens (sum × 10) | Above = Units (multiply)",
  "الطرفان كما هما، والوسط حاصل جمع الجيران": "Ends as they are, middle is the sum of neighbors",
  "مع الحمل: إذا كان الجمع > 9 → نحمل للرقم التالي": "With carry: If sum > 9 → carry to next digit",
  "اطرح 1 من الرقم → ثم اطرح الناتج من 99": "Subtract 1 from number → then subtract result from 99",
  "ينفع فقط للأعداد ≤ 99": "Only works for numbers ≤ 99",
  "اطرح 1 من الرقم → ثم اطرح الناتج من 999": "Subtract 1 from number → then subtract result from 999",
  "نفس فكرة 99 لكن مع 3 منازل": "Same idea as 99 but with 3 digits",
  "١) احسب بُعد كل رقم عن 100 (100 − الرقم)": "1) Calculate distance of each number from 100 (100 − number)",
  "٢) اضرب البُعدين → الجزء الأيمن | ٣) اجمع البُعدين، ثم اطرح مجموعهما من 100 → الجزء الأيسر": "2) Multiply distances → right part | 3) Add distances, subtract sum from 100 → left part",
  "١) اضرب آحاد الرقمين → الجزء الأيمن (منزلتين)": "1) Multiply units → right part (2 digits)",
  "٢) اجمع الآحادين + 100 → الجزء الأيسر | ٣) ادمج الجزئين": "2) Add units + 100 → left part | 3) Combine parts",
  "١) احسب بُعد كل رقم عن 1000 (1000 − الرقم)": "1) Calculate distance of each number from 1000 (1000 − number)",
  "٢) اضرب البُعدين → الجزء الأيمن (3 منازل) | ٣) 1000 − مجموع البُعدين → الجزء الأيسر": "2) Multiply distances → right part (3 digits) | 3) 1000 − sum of distances → left part",
  "١) احسب آحاد الرقمين (الرقم − 1000)": "1) Calculate units of both numbers (number − 1000)",
  "٢) اضرب الآحادين → الجزء الأيمن (3 منازل) | ٣) اجمع الآحادين + 1000 → الجزء الأيسر": "2) Multiply units → right part (3 digits) | 3) Add units + 1000 → left part",
  "١) احسب بُعد كل رقم عن 50 (الرقم − 50)": "1) Calculate distance of each number from 50 (number − 50)",
  "٢) الجزء الأول: 50 + مجموع البُعدين | ٣) الجزء الثاني: حاصل ضرب البُعدين | ٤) (الجزء الأول × 100) ÷ 2 + الجزء الثاني": "2) First part: 50 + sum of distances | 3) Second part: product of distances | 4) (First part × 100) ÷ 2 + Second part",
  "١) احسب بُعد كل رقم عن 500 (الرقم − 500)": "1) Calculate distance of each number from 500 (number − 500)",
  "٢) الجزء الأول: 500 + مجموع البُعدين | ٣) الجزء الثاني: حاصل ضرب البُعدين | ٤) (الجزء الأول × 1000) ÷ 2 + الجزء الثاني": "2) First part: 500 + sum of distances | 3) Second part: product of distances | 4) (First part × 1000) ÷ 2 + Second part",
  "مع الأعداد الفردية استخدم طريقة أخرى!": "With odd numbers, use another method!",

  // --- رياضيات الأصابع (FingerMathScreen) ---
  "في مملكة الأصابع، تعيش عائلتان صديقتان: عائلة اليد اليمنى المسؤولة عن الآحاد، وعائلة اليد اليسرى المسؤولة عن العشرات. الإبهام هو الجدة الحنونة قيمتها 5، والأصابع الأربعة أطفال كل واحد قيمته 1. اجتمعوا معاً ليصنعوا كل الأعداد من 0 إلى 99!": "In the kingdom of fingers, two friendly families live: the right-hand family responsible for units, and the left-hand family responsible for tens. The thumb is the kind grandmother worth 5, and the four fingers are children, each worth 1. Together they create all numbers from 0 to 99!",
  "الإبهام = 5 (الجدة) · الأصابع الأخرى = 1 (طفل)": "Thumb = 5 (Grandma) · Other fingers = 1 (Child)",
  "اليد اليمنى = الآحاد · اليد اليسرى = العشرات": "Right hand = Units · Left hand = Tens",
  "اليد اليمنى (الآحاد)": "Right Hand (Units)",
  "اليد اليسرى (العشرات)": "Left Hand (Tens)",
  "مثل الرقم 1": "Like the number 1",
  "مثل الرقم 3": "Like the number 3",
  "مثل الرقم 5 (الجدة)": "Like the number 5 (Grandma)",
  "مثل الرقم 7": "Like the number 7",
  "مثل الرقم 9": "Like the number 9",
  "مثل الرقم 10": "Like the number 10",
  "مثل الرقم 27": "Like the number 27",
  "مثل الرقم 99": "Like the number 99",

  // --- شاشة الأقسام (CategoryScreen) ---
  "٥ - ١٢ سنة": "Ages 5 - 12",
  "١٣+ سنة": "Ages 13+",
  "الامتحان النهائي — القسم الأول": "Final Exam — Section One",
  "الامتحان النهائي — القسم الثاني": "Final Exam — Section Two",
  
  // الإثراء (Enrichment)
  "أسرار الضرب": "Multiplication Secrets",
  "٢٠ سراً لجدول الضرب": "20 secrets for the multiplication table",
  "رياضيات الأصابع": "Finger Math",
  "تعلّم الأعداد بأصابعك": "Learn numbers with your fingers",
  "الضرب التقاطعي": "Cross Multiplication",
  "الضرب الفيدي المتقدم": "Advanced Vedic multiplication",

  // أوصاف المستويات المصغرة (CategoryScreen Levels Desc)
  "التعرّف على السوروبان + الأرقام + القيمة المكانية": "Discover the soroban + numbers + place value",
  "جمع وطرح بسيط + أصدقاء 5 + أصدقاء 10": "Simple add & subtract + Friends of 5 + Friends of 10",
  "الضرب على السوروبان بطريقة تاكاشي": "Multiplication on the soroban using Takashi method",
  "القسمة على السوروبان — التقدير والطرح المتتالي": "Division on the soroban — estimation and successive subtraction",
  "سلاسل الجمع والطرح المتعددة": "Multiple addition and subtraction chains",
  "الضرب والقسمة بطرق متقدمة": "Advanced multiplication and division methods",
  "العمليات على الأعداد العشرية": "Operations on decimal numbers",

  // 🆕 --- إضافات الامتحانات (Exam & PlacementTest) ---
  // أسماء المستويات
  "التمهيدي": "Foundation",
  "الجمع والطرح": "Addition & Subtraction",
  "الضرب": "Multiplication",
  "القسمة": "Division",
  "سلاسل الجمع والطرح": "Add & Sub Chains",
  "ضرب وقسمة متقدم": "Advanced Mul & Div",
  "الكسور العشرية": "Decimals",
  "الجذور": "Roots",

  // أقسام الأسئلة
  "جمع": "Addition",
  "طرح": "Subtraction",
  "قسمة": "Division",
  "مختلط": "Mixed",
  "جمع وطرح": "Add & Subtract",

  // المهارات الضعيفة
  "طرح بسيط": "Direct Sub",
  "أصدقاء 5 (جمع)": "Friends of 5 (Add)",
  "أصدقاء 5 (طرح)": "Friends of 5 (Sub)",
  "أصدقاء 10 (جمع)": "Friends of 10 (Add)",
  "أصدقاء 10 (طرح)": "Friends of 10 (Sub)",
  "ضرب بسيط": "Direct Mul",
  "قسمة بسيطة": "Direct Div"
};

const AR_TO_EN: Record<string, string> = {};
Object.entries(RAW_AR_TO_EN).forEach(([key, val]) => {
  AR_TO_EN[normalizeArabic(key)] = val;
});

// دالة الأنماط المتسامحة جداً
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

  match = text.match(/مهاره.*?بدقه.*?(\d+)/);
  if (match) return `Skill with ${match[1]}% accuracy`;
  match = text.match(/(\d+).*?مهاره.*?بدقه/);
  if (match) return `Skill with ${match[1]}% accuracy`;

  match = text.match(/(\d+).*?متتاليه.*?في.*?السلاسل/);
  if (match) return `${match[1]} streak in chains`;

  match = text.match(/(\d+)\s*[٪%].*?مهاره.*?مكتمله/) || text.match(/دقه.*?(\d+)/);
  if (match) {
    const digitsMatch = text.match(/(\d+)/);
    const num = digitsMatch ? digitsMatch[1] : "85";
    return `${num}% accuracy in skill`;
  }

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

      // 🆕 ترجمة الخطوات الرياضية التي تحتوي على أرقام ورموز
      if (field === "steps" || normalizedKey.includes("←") || normalizedKey.includes("→")) {
        return normalizedKey
          .replace(/فردي/g, "odd")
          .replace(/زوجي/g, "even")
          .replace(/نصف/g, "half of")
          .replace(/الرقم/g, "number")
          .replace(/عشرات/g, "Tens")
          .replace(/آحاد/g, "Units")
          .replace(/جزء/g, "part")
          .replace(/الايمن/g, "right")
          .replace(/الايسر/g, "left");
      }
    }
    return ar ? String(ar) : "";
  }

  return ar ?? en ?? "";
}