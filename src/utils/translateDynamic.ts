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
  "قسمة مركبة": "Compound Div", "قسمة بسيطة": "Direct Div",
  "قسمة باصدقاء 5": "Div with Friends of 5", "قسمة بأصدقاء 5": "Div with Friends of 5",
  "قسمة باصدقاء 10": "Div with Friends of 10", "قسمة بأصدقاء 10": "Div with Friends of 10",
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

  // --- إضافات الامتحانات (Exam & PlacementTest) ---
  "التمهيدي": "Foundation",
  "الجمع والطرح": "Addition & Subtraction",
  "الضرب": "Multiplication",
  "القسمة": "Division",
  "سلاسل الجمع والطرح": "Add & Sub Chains",
  "ضرب وقسمة متقدم": "Advanced Mul & Div",
  "الكسور العشرية": "Decimals",
  "الجذور": "Roots",
  "جمع": "Addition",
  "طرح": "Subtraction",
  "ضرب": "Multiplication",
  "قسمة": "Division",
  "مختلط": "Mixed",
  "جمع وطرح": "Add & Subtract",
  "أصدقاء 5 (جمع)": "Friends of 5 (Add)",
  "أصدقاء 5 (طرح)": "Friends of 5 (Sub)",
  "أصدقاء 10 (جمع)": "Friends of 10 (Add)",
  "أصدقاء 10 (طرح)": "Friends of 10 (Sub)",

  // --- إضافات شاشة الأنزان (AnzanScreen) ---
  "تلميح": "Hint",
  "تلميح:": "Hint:",
  "يساوي": "equals",
  "زائد": "plus",
  "ناقص": "minus",
  "في": "times",
  "على": "divided by",
  "ماذا": "What",
  "ضع": "Place",
  "ارفع": "Raise",
  "master_addition": "Addition & Subtraction Master",
  "master_multiplication": "Multiplication Master",
  "master_division": "Division Master",
  "master_mixed": "Mixed Master",

  // --- إضافات الجلسة العلاجية والتقارير ---
  "الحل": "Solution",
  "الخطوات": "Steps",
  "حرّك الخرزة": "Move the bead",
  "استخدم صديق 5": "Use friend of 5",
  "استخدم صديق 10": "Use friend of 10",
  "حرّك للأسفل": "Move down",
  "حرّك للأعلى": "Move up",
  "جلسة علاجية": "Remediation Session",
  "لا توجد مهارات ضعيفة": "No weak skills",
  "لا توجد أسئلة كافية": "Not enough questions",
  "ملاحظات التعليم التكيفي": "Adaptive Learning Notes",
  "تحليل الأداء": "Performance Analysis",
  "مهارات تحتاج تقوية": "Skills needing reinforcement",
  "مهارات المستوى تحتاج مراجعة": "Level skills needing review",
  "مهارات من مستويات أخرى تحتاج مراجعة": "Skills from other levels needing review",
  "مراجعة عامة": "General Review",
  "إجمالي الشارات": "Total Badges",
  "التوصية": "Recommendation",
  "دقة منخفضة": "Low accuracy",
  "أعد جلسة على المهارات أعلاه. سيقترح عليك النظام أسئلة علاجية مخصصة تلقائياً.": "Retake a session on the skills above. The system will automatically suggest customized remedial questions.",
  "جلسة مخصصة بدون درجات — تُظهر لك الحل بعد كل سؤال.": "Customized session without grades — shows you the solution after each question.",
  "جلسة قصيرة مخصصة لبناء الثقة — بدون درجات، وتُظهر لك الحل بعد كل سؤال.": "Customized short session to build confidence — no grades, shows the solution after each question.",

  // --- إضافات شاشة التعلم (LearnScreen) ---
  "مقدمة": "Introduction",
  "درس تمهيدي": "Introductory Lesson",
  "مقدمة في السوروبان": "Introduction to the Soroban",
  "مراجعة": "Review",
  "التعرف على المعداد": "Getting to Know the Abacus",
  "الأرقام من 0 إلى 4": "Numbers from 0 to 4",
  "الأرقام من 5 إلى 9": "Numbers from 5 to 9",
  "أصدقاء 5": "Friends of 5",
  "أصدقاء 10": "Friends of 10",
  "القسمة على رقم واحد": "Division by one digit",
  "القسمة على رقمين": "Division by two digits",
  "الضرب (2 × 2)": "Multiplication (2 × 2)",
  "الجمع": "Addition",
  "الطرح": "Subtraction",
  "التعرف على السوروبان": "Introduction to the Soroban",
  "تمثيل الأرقام من 0 إلى 9": "Representing numbers 0 to 9",
  "القيمة المكانية وبناء الأعداد": "Place value and building numbers",
  "الأبطال الصغار": "Young Heroes",
  "سلسل الجمع": "Addition Chains",
  "سلسل الطرح": "Subtraction Chains",
  "سلاسل الجمع": "Addition Chains",
  "سلاسل الطرح": "Subtraction Chains",

  // --- شارات Flash (أسطر badgeLines العربية) ---
  "الأعمدة": "Rods",
  "الخرزات السفلية": "Lower beads",
  "الخرزة العلوية": "Upper bead",
  "العارضة": "Bar",
  "👋 مرحباً": "👋 Hello",
  "صديق 10": "Friend of 10",
  "صديق 5": "Friend of 5",
  "مركبة": "Compound",
  "⬆️⬆️ رفع مزدوج": "⬆️⬆️ Double lift",
  "⬇️⬇️ نزول مزدوج": "⬇️⬇️ Double descent",
  "🗜️ كماشة مغلقة": "🗜️ Closed pinch",
  "✅ الناتج = 13": "✅ Result = 13",
  "✅ الناتج = 18": "✅ Result = 18",
  "✅ الناتج = 19": "✅ Result = 19",
  "✅ الناتج = 22": "✅ Result = 22",
  "✅ الناتج = 25": "✅ Result = 25",
  "✅ الناتج = 26": "✅ Result = 26",
  "✅ الناتج = 27": "✅ Result = 27",
  "✅ الناتج = 279": "✅ Result = 279",
  "✅ الناتج = 102": "✅ Result = 102",
  "✅ الناتج = 144": "✅ Result = 144",
  "✅ الناتج = 168": "✅ Result = 168",
  "✅ الناتج = 242": "✅ Result = 242",
  "✅ الناتج = 529": "✅ Result = 529",
  "✅ الناتج = 54": "✅ Result = 54",
  "✅ الناتج = 759": "✅ Result = 759",
  "✅ الناتج = 96": "✅ Result = 96",
  "✅ الناتج = 11": "✅ Result = 11",
  "✅ الناتج = 2": "✅ Result = 2",
  "✅ الناتج = 44": "✅ Result = 44",
  "✅ الناتج = 6": "✅ Result = 6",

  // 🆕 --- إضافات L0 (بنك A: التدريب والأنزان) ---
  "العداد": "abacus",
  "سفليات": "lower beads",
  "سفلية": "lower bead",
  "العارضة الفاصلة": "bar",
  "الإبهام": "thumb",
  "السبابة": "index finger",
  "حركة القرص": "pinch movement",
  "سبب الاختيار": "Reason for selection",
  "تمثيل الصفر": "Representing zero",
  "عدد مركب": "compound number",
  "عشرات نظيفة": "clean tens",
  "عمود العشرات": "tens column",
  "عمود الآحاد": "units column",

  // 🆕 --- إضافات L0 (بنك B: الامتحان) ---
  "منزلة": "place",
  "رقم العمود من اليمين": "column number from the right",
  "أدنى قيمة": "minimum value",
  "أقصى قيمة": "maximum value",
  "لا شيء مرفوع": "Nothing raised",
  "أين يقع": "Where is located",
};

const AR_TO_EN: Record<string, string> = {};
Object.entries(RAW_AR_TO_EN).forEach(([key, val]) => {
  AR_TO_EN[normalizeArabic(key)] = val;
});

// دالة الأنماط المتسامحة جداً
function translatePattern(text: string): string | null {
  let match;

  // 🆕 ترجمة بادئات التلميح والحل والخطوات
  if (text.startsWith("تلميح:")) {
    return text.replace(/^تلميح\s*:\s*/, "Hint: ");
  }
  if (text.startsWith("الحل:")) {
    return text.replace(/^الحل\s*:\s*/, "Solution: ");
  }
  if (text.startsWith("الخطوات:")) {
    return text.replace(/^الخطوات\s*:\s*/, "Steps: ");
  }

  // ==========================================
  // 🆕 أنماط L0 (البنك A: أسئلة التدريب والأنزان)
  // ==========================================
  // ملاحظة: هذه الأنماط مصممة لتتوافق مع دالة normalizeArabic
  // "مثّل" تصبح "مثل" | "على" تصبح "علي" | "العلوية" تصبح "العلويه"

  // مثل العدد 63 على العداد
  match = text.match(/^مثل\s*العدد\s*(\d+)\s*علي\s*العداد$/);
  if (match) return `Represent the number ${match[1]} on the abacus`;

  // ارفع 3 خرزات سفلية
  match = text.match(/^ارفع\s*(\d+)\s*خرزات\s*سفليه$/);
  if (match) return `Raise ${match[1]} lower beads`;

  // أنزل العلوية وارفع 4 سفليات
  match = text.match(/^انزل\s*العلويه\s*وارفع\s*(\d+)\s*سفليات$/);
  if (match) return `Lower the upper bead and raise ${match[1]} lower beads`;

  // أنزل العلوية وارفع خرزتين
  match = text.match(/^انزل\s*العلويه\s*وارفع\s*خرزتين$/);
  if (match) return `Lower the upper bead and raise 2 lower beads`;

  // ارفع خرزة سفلية واحدة
  match = text.match(/^ارفع\s*خرزه\s*سفليه\s*واحده$/);
  if (match) return `Raise 1 lower bead`;

  // أنزل الخرزة العلوية
  match = text.match(/^انزل\s*الخرزه\s*العلويه$/);
  if (match) return `Lower the upper bead`;

  // ==========================================
  // 🆕 أنماط L0 (البنك B: أسئلة الامتحان)
  // ==========================================
  
  // مثل الرقم 10 على العداد
  match = text.match(/^مثل\s*الرقم\s*(\d+)\s*علي\s*العداد$/);
  if (match) return `Represent the number ${match[1]} on the abacus`;

  // 1 سفلية فقط = ؟
  match = text.match(/^(\d+)\s*سفليه\s*فقط\s*=\s*؟$/);
  if (match) return `Only ${match[1]} lower bead(s) = ?`;

  // العلوية + 3 سفلية = ؟
  match = text.match(/^العلويه\s*\+\s*(\d+)\s*سفليه\s*=\s*؟$/);
  if (match) return `Upper bead + ${match[1]} lower bead(s) = ?`;

  // لا شيء مرفوع = ؟
  match = text.match(/^لا\s*شيء\s*مرفوع\s*=\s*؟$/);
  if (match) return `Nothing raised = ?`;

  // كم خرزة سفلية تحتاج لتمثيل 3؟
  match = text.match(/^كم\s*خرزه\s*سفليه\s*تحتاج\s*لتمثيل\s*(\d+)؟$/);
  if (match) return `How many lower beads do you need to represent ${match[1]}?`;

  // قيمة الخرزة في منزلة الآحاد = ؟
  match = text.match(/^قيمه\s*الخرزه\s*في\s*منزله\s*(الاحاد|العشرات|المئات|الالاف)\s*=\s*؟$/);
  if (match) {
    const placeMap: Record<string, string> = { "الاحاد": "units", "العشرات": "tens", "المئات": "hundreds", "الالاف": "thousands" };
    return `Value of the bead in the ${placeMap[match[1]]} place = ?`;
  }

  // 2 في العشرات + 5 في الآحاد = ؟
  match = text.match(/^(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*الاحاد\s*=\s*؟$/);
  if (match) return `${match[1]} in tens + ${match[2]} in units = ?`;

  // ما الرقم الذي يمثله: 3 عشرات + 0 آحاد؟
  match = text.match(/^ما\s*الرقم\s*الذي\s*يمثله:\s*(\d+)\s*عشرات\s*\+\s*(\d+)\s*احاد؟$/);
  if (match) return `What number does this represent: ${match[1]} tens + ${match[2]} units?`;

  // أين يقع الآحاد على العداد؟ (رقم العمود من اليمين)
  match = text.match(/^اين\s*يقع\s*(الاحاد|العشرات|المئات|الالاف)\s*علي\s*العداد؟\s*\(رقم\s*العمود\s*من\s*اليمين\)$/);
  if (match) {
    const placeMap: Record<string, string> = { "الاحاد": "units", "العشرات": "tens", "المئات": "hundreds", "الالاف": "thousands" };
    return `Where is the ${placeMap[match[1]]} located on the abacus? (column number from the right)`;
  }

  // 50 = 5 في أي منزلة؟ (1=آحاد, 2=عشرات, 3=مئات)
  match = text.match(/^(\d+)\s*=\s*(\d+)\s*في\s*اي\s*منزله؟\s*\(1=احاد,\s*2=عشرات,\s*3=مئات\)$/);
  if (match) return `${match[1]} = ${match[2]} in which place? (1=units, 2=tens, 3=hundreds)`;

  // 1 في المئات + 3 في العشرات + 4 في الآحاد = ؟
  match = text.match(/^(\d+)\s*في\s*المئات\s*\+\s*(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*الاحاد\s*=\s*؟$/);
  if (match) return `${match[1]} in hundreds + ${match[2]} in tens + ${match[3]} in units = ?`;

  // كم يساوي 1 في العشرات + 1 في المئات؟
  match = text.match(/^كم\s*يساوي\s*(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*المئات؟$/);
  if (match) return `How much is ${match[1]} in tens + ${match[2]} in hundreds?`;


  // ==========================================
  // 🆕 أنماط حلول L0 (البنك A: خطوات الحل)
  // ==========================================

  match = text.match(/^سبب\s*الاختيار:\s*تمثيل\s*الصفر\.\s*لا\s*ترفع\s*اي\s*خرزه\s*سفليه،\s*ولا\s*تنزل\s*الخرزه\s*العلويه\.\s*جميع\s*الخرزات\s*بعيده\s*عن\s*العارضه\s*الفاصله\.$/);
  if (match) return `Reason: Representing zero. Do not raise any lower beads, and do not lower the upper bead. All beads are away from the bar.`;

  match = text.match(/^سبب\s*الاختيار:\s*حركه\s*واحده\s*من\s*الصفر\.\s*ارفع\s*خرزه\s*سفليه\s*واحده\s*بالابهام\s*نحو\s*العارضه\.\s*الخرزه\s*السفليه\s*الواحده\s*تمثل\s*1\.$/);
  if (match) return `Reason: One movement from zero. Raise 1 lower bead with the thumb towards the bar. 1 lower bead represents 1.`;

  match = text.match(/^سبب\s*الاختيار:\s*عدد\s*صغير\s*\(1-4\)\s*يرفع\s*بالخرزات\s*السفليه\.\s*ارفع\s*خرزتين\s*سفليتين\s*معا\s*بالابهام\s*نحو\s*العارضه\.$/);
  if (match) return `Reason: Small number (1-4) raised with lower beads. Raise 2 lower beads together with the thumb towards the bar.`;

  match = text.match(/^سبب\s*الاختيار:\s*حركه\s*من\s*الصفر\.\s*ارفع\s*(\d+)\s*خرزات\s*سفليه\s*معا\s*بالابهام\.\s*الثلاث\s*خرزات\s*تمثل\s*(\d+)\.$/);
  if (match) return `Reason: Movement from zero. Raise ${match[1]} lower beads together with the thumb. The ${match[1]} beads represent ${match[2]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*اكبر\s*عدد\s*في\s*الخرزات\s*السفليه\s*\(1-4\)\.\s*ارفع\s*(\d+)\s*خرزات\s*سفليه\s*معا\s*بالابهام\s*نحو\s*العارضه\.$/);
  if (match) return `Reason: Largest number in lower beads (1-4). Raise ${match[1]} lower beads together with the thumb towards the bar.`;

  match = text.match(/^سبب\s*الاختيار:\s*حركه\s*العلويه\s*من\s*الصفر\.\s*انزل\s*الخرزه\s*العلويه\s*بالسبابه\s*نحو\s*العارضه\.\s*الخرزه\s*العلويه\s*تمثل\s*5\.$/);
  if (match) return `Reason: Upper bead movement from zero. Lower the upper bead with the index finger towards the bar. Upper bead represents 5.`;

  match = text.match(/^سبب\s*الاختيار:\s*عدد\s*مركب\s*\(5\+(\d+)\)\.\s*حركه\s*القرص:\s*انزل\s*الخرزه\s*العلويه\s*\(5\)\s*وارفع\s*(\d+)\s*خرزه\s*سفليه\s*\((\d+)\)\s*معا\s*نحو\s*العارضه\.$/);
  if (match) return `Reason: Compound number (5+${match[1]}). Pinch movement: Lower the upper bead (5) and raise ${match[2]} lower bead(s) (${match[3]}) together towards the bar.`;

  match = text.match(/^سبب\s*الاختيار:\s*حركه\s*القرص\s*من\s*الصفر\.\s*انزل\s*الخرزه\s*العلويه\s*\(5\)\s*وارفع\s*(\d+)\s*خرزات\s*سفليه\s*\((\d+)\)\s*معا\.\s*النتيجه\s*5\+(\d+)\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Pinch movement from zero. Lower the upper bead (5) and raise ${match[1]} lower beads (${match[2]}) together. Result: 5+${match[3]} = ${match[4]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*عشرات\s*\+\s*احاد\s*بخمسه\.\s*في\s*العشرات:\s*ارفع\s*خرزتين\s*سفليتين\s*=\s*(\d+)\.\s*في\s*الاحاد:\s*انزل\s*الخرزه\s*العلويه\s*=\s*5\.$/);
  if (match) return `Reason: Tens + units with five. In tens: Raise 2 lower beads = ${match[1]}. In units: Lower the upper bead = 5.`;

  match = text.match(/^سبب\s*الاختيار:\s*كل\s*عمود\s*يستخدم\s*حركه\s*القرص\.\s*العشرات:\s*قرص\s*=\s*العلويه\s*\(5\)\s*\+\s*سفليه\s*\(1\)\s*=\s*(\d+)\.\s*الاحاد:\s*(\d+)\s*سفليات\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Each column uses pinch movement. Tens: Pinch = upper (5) + lower (1) = ${match[1]}. Units: ${match[2]} lower beads = ${match[3]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*احاد\s*مركبه\s*\((\d+)\)\.\s*العشرات:\s*سفليه\s*واحده\s*=\s*(\d+)\.\s*الاحاد:\s*قرص\s*=\s*علويه\s*\(5\)\s*\+\s*(\d+)\s*سفليات\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Compound units (${match[1]}). Tens: 1 lower bead = ${match[2]}. Units: Pinch = upper (5) + ${match[3]} lower beads = ${match[4]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*حركه\s*القرص\s*في\s*العمودين\.\s*العشرات:\s*قرص\s*=\s*5\s*\+\s*(\d+)\s*=\s*(\d+)\.\s*الاحاد:\s*قرص\s*=\s*5\s*\+\s*(\d+)\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Pinch movement in both columns. Tens: Pinch = 5 + ${match[1]} = ${match[2]}. Units: Pinch = 5 + ${match[3]} = ${match[4]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*مئات\s*نظيفه\.\s*في\s*المئات:\s*ارفع\s*خرزه\s*سفليه\s*واحده\s*=\s*(\d+)\.\s*اترك\s*باقي\s*الاعمده\s*فارغه\.$/);
  if (match) return `Reason: Clean hundreds. In hundreds: Raise 1 lower bead = ${match[1]}. Leave the rest of the columns empty.`;

  match = text.match(/^سبب\s*الاختيار:\s*مئات\s*نظيفه\.\s*في\s*المئات:\s*ارفع\s*(\d+)\s*خرزات\s*سفليه\s*بالابهام\s*=\s*(\d+)\.\s*باقي\s*الاعمده\s*فارغه\.$/);
  if (match) return `Reason: Clean hundreds. In hundreds: Raise ${match[1]} lower beads with the thumb = ${match[2]}. The rest of the columns are empty.`;

  match = text.match(/^سبب\s*الاختيار:\s*يستخدم\s*الخرزه\s*العلويه\s*في\s*المئات\.\s*في\s*المئات:\s*انزل\s*الخرزه\s*العلويه\s*بالسبابه\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Uses upper bead in hundreds. In hundreds: Lower the upper bead with the index finger = ${match[1]}.`;

  match = text.match(/^سبب\s*الاختيار:\s*الاف\s*نظيفه\.\s*في\s*الالاف:\s*ارفع\s*خرزه\s*سفليه\s*واحده\s*بالابهام\s*=\s*(\d+)\.\s*باقي\s*الاعمده\s*فارغه\.$/);
  if (match) return `Reason: Clean thousands. In thousands: Raise 1 lower bead with the thumb = ${match[1]}. The rest of the columns are empty.`;

  match = text.match(/^سبب\s*الاختيار:\s*الاف\s*\+\s*مئات\.\s*الالاف:\s*ارفع\s*سفليه\s*واحده\s*=\s*(\d+)\.\s*المئات:\s*انزل\s*الخرزه\s*العلويه\s*=\s*(\d+)\.$/);
  if (match) return `Reason: Thousands + hundreds. Thousands: Raise 1 lower bead = ${match[1]}. Hundreds: Lower the upper bead = ${match[2]}.`;


  // ==========================================
  // الأنماط القديمة السابقة
  // ==========================================
  match = text.match(/^احسب\s*السلسلة\s*:\s*(.*)/);
  if (match) return `Calculate the chain: ${match[1]}`;

  match = text.match(/^احسب\s*:\s*(.*)/);
  if (match) return `Calculate: ${match[1]}`;

  match = text.match(/^ماذا\s*:\s*(.*)/);
  if (match) return `What: ${match[1]}`;

  match = text.match(/^ضع\s*:\s*(.*)/);
  if (match) return `Place: ${match[1]}`;

  match = text.match(/^ارفع\s*:\s*(.*)/);
  if (match) return `Raise: ${match[1]}`;

  match = text.match(/^L(\d+)$/);
  if (match) return `Level ${match[1]}`;

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