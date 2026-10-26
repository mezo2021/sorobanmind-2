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
  "قسمة مركبة": "Compound Div", "قسمة بسيطة": "Direct Div",
  "قسمة باصدقاء 5": "Div with Friends of 5", "قسمة بأصدقاء 5": "Div with Friends of 5",
  "قسمة باصدقاء 10": "Div with Friends of 10", "قسمة بأصدقاء 10": "Div with Friends of 10",
  "تمثيل 0-4": "Representing 0-4", "تمثيل 5-9": "Representing 5-9",
  "المئات والآلاف": "Hundreds & Thousands", "الاحاد والعشرات": "Units & Tens",
  "المستكشف": "Explorer", "الصاعد": "Rising Star", "السريع": "Fast",
  "المتفوق": "Top Achiever", "الدقيق": "Precise", "المثابر": "Persistent",
  "الرائد": "Pioneer", "القناص": "Sniper", "المتدفق": "Flow",
  "الحارس": "Guardian", "الفاتح": "Conqueror", "الصامد": "Resilient",
  "تعافى من جلسة علاجية": "Recovered from session", "أتم قسم كامل": "Completed a section", 
  "ميمو": "Mimo", "البطل": "Hero",
  "التعرّف على السوروبان والأرقام من ٠ إلى ٩ والقيمة المكانية": "Discover the soroban, numbers 0-9, and place value",
  "جمع وطرح بسيط + أصدقاء ٥ + أصدقاء ١٠ + عمليات مركّبة": "Simple addition & subtraction + Friends of 5 + Friends of 10 + compound operations",
  "الضرب المتدرّج (١×٢ · ٢×٢) على السوروبان": "Gradual multiplication (1x2 · 2x2) on the soroban",
  "القسمة المتدرّجة (÷١ · ÷٢) — التقدير والطرح المتتالي": "Gradual division (÷1 · ÷2) — estimation and successive subtraction",
  "سلاسل الجمع والطرح المتعددة الحدود": "Multi-term addition & subtraction chains",
  "الضرب (٢×٣) والقسمة المتقدمة بطرق تاكاشي": "Multiplication (2x3) and advanced division using Takashi methods",
  "العمليات على الأعداد العشرية (جمع · طرح · ضرب · قسمة)": "Operations on decimals (add · sub · mul · div)",
  "الجذور التربيعية الكاملة": "Complete square roots",
  "سر جدول الـ 5": "Secret of the 5 Table", "سر جدول الـ 6": "Secret of the 6 Table",
  "لغز الرقم 7": "The Mystery of 7", "سر جدول الـ 8": "Secret of the 8 Table",
  "سر جدول الـ 9": "Secret of the 9 Table", "سر المضاعفة": "The Doubling Secret",
  "سر أصابع الضرب": "Finger Multiplication Secret", "الضرب في 11": "Multiplication by 11",
  "الضرب في 99": "Multiplication by 99", "الضرب في 999": "Multiplication by 999",
  "أصدقاء المئة (تحت 100)": "Friends of 100 (Under 100)", "الأعداد فوق 100": "Numbers Above 100",
  "الأعداد تحت 1000": "Numbers Under 1000", "الأعداد فوق 1000": "Numbers Above 1000",
  "الأعداد القريبة من 50": "Numbers Near 50", "الأعداد القريبة من 500": "Numbers Near 500",
  "الآحاد: زوجي = 0، فردي = 5": "Units: Even = 0, Odd = 5", "العشرات: نصف الرقم (بدون كسور)": "Tens: Half the number (no fractions)",
  "للأعداد الزوجية فقط": "For even numbers only", "الآحاد: نفس الرقم | العشرات: نصفه": "Units: Same number | Tens: Half of it",
  "الآحاد: اطرح 3 في كل مرة (مع الدوران عند 10)": "Units: Subtract 3 each time (wrap at 10)",
  "العشرات: تتصاعد وتتوقف عند 2 و 4 مرتين": "Tens: Ascends and stops at 2 and 4 twice",
  "الآحاد: اطرح 2 في كل مرة (مع الدوران عند 10)": "Units: Subtract 2 each time (wrap at 10)",
  "العشرات: تتصاعد، وتتوقف عند 4 مرتين": "Tens: Ascends, stops at 4 twice",
  "الآحاد: صديق العدد الكبير (مكمّله إلى 10)": "Units: Friend of the large number (complement to 10)",
  "العشرات: أكمل العدّ إلى 9 | المجموع = 9": "Tens: Complete count to 9 | Sum = 9",
  "للضرب في 4: ضاعف الرقم مرتين": "For ×4: Double the number twice", "للضرب في 8: ضاعف الرقم ثلاث مرات": "For ×8: Double the number three times",
  "الأصابع بالترتيب: الخنصر = 6، البنصر = 7، الوسطى = 8، السبابة = 9، الإبهام = 10": "Fingers in order: Pinky = 6, Ring = 7, Middle = 8, Index = 9, Thumb = 10",
  "نُلمس إصبَعي العددين: الأصابع المتلامسة والأسفل منها = العشرات (جمع × 10) | الأصابع الأعلى = الآحاد (ضرب ببعض)": "Touch the two fingers: Touching and below = Tens (sum × 10) | Above = Units (multiply)",
  "الطرفان كما هما، والوسط حاصل جمع الجيران": "Ends as they are, middle is the sum of neighbors",
  "مع الحمل: إذا كان الجمع > 9 → نحمل للرقم التالي": "With carry: If sum > 9 → carry to next digit",
  "اطرح 1 من الرقم → ثم اطرح الناتج من 99": "Subtract 1 from number → then subtract result from 99",
  "ينفع فقط للأعداد ≤ 99": "Only works for numbers ≤ 99", "اطرح 1 من الرقم → ثم اطرح الناتج من 999": "Subtract 1 from number → then subtract result from 999",
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
  "في مملكة الأصابع، تعيش عائلتان صديقتان: عائلة اليد اليمنى المسؤولة عن الآحاد، وعائلة اليد اليسرى المسؤولة عن العشرات. الإبهام هو الجدة الحنونة قيمتها 5، والأصابع الأربعة أطفال كل واحد قيمته 1. اجتمعوا معاً ليصنعوا كل الأعداد من 0 إلى 99!": "In the kingdom of fingers, two friendly families live: the right-hand family responsible for units, and the left-hand family responsible for tens. The thumb is the kind grandmother worth 5, and the four fingers are children, each worth 1. Together they create all numbers from 0 to 99!",
  "الإبهام = 5 (الجدة) · الأصابع الأخرى = 1 (طفل)": "Thumb = 5 (Grandma) · Other fingers = 1 (Child)",
  "اليد اليمنى = الآحاد · اليد اليسرى = العشرات": "Right hand = Units · Left hand = Tens",
  "اليد اليمنى (الآحاد)": "Right Hand (Units)", "اليد اليسرى (العشرات)": "Left Hand (Tens)",
  "مثل الرقم 1": "Like the number 1", "مثل الرقم 3": "Like the number 3", "مثل الرقم 5 (الجدة)": "Like the number 5 (Grandma)",
  "مثل الرقم 7": "Like the number 7", "مثل الرقم 9": "Like the number 9", "مثل الرقم 10": "Like the number 10",
  "مثل الرقم 27": "Like the number 27", "مثل الرقم 99": "Like the number 99",
  "٥ - ١٢ سنة": "Ages 5 - 12", "١٣+ سنة": "Ages 13+",
  "الامتحان النهائي — القسم الأول": "Final Exam — Section One", "الامتحان النهائي — القسم الثاني": "Final Exam — Section Two",
  "أسرار الضرب": "Multiplication Secrets", "٢٠ سراً لجدول الضرب": "20 secrets for the multiplication table",
  "رياضيات الأصابع": "Finger Math", "تعلّم الأعداد بأصابعك": "Learn numbers with your fingers",
  "الضرب التقاطعي": "Cross Multiplication", "الضرب الفيدي المتقدم": "Advanced Vedic multiplication",
  "التعرّف على السوروبان + الأرقام + القيمة المكانية": "Discover the soroban + numbers + place value",
  "جمع وطرح بسيط + أصدقاء 5 + أصدقاء 10": "Simple add & subtract + Friends of 5 + Friends of 10",
  "الضرب على السوروبان بطريقة تاكاشي": "Multiplication on the soroban using Takashi method",
  "القسمة على السوروبان — التقدير والطرح المتتالي": "Division on the soroban — estimation and successive subtraction",
  "سلاسل الجمع والطرح المتعددة": "Multiple addition and subtraction chains", "الضرب والقسمة بطرق متقدمة": "Advanced multiplication and division methods",
  "العمليات على الأعداد العشرية": "Operations on decimal numbers",
  "التمهيدي": "Foundation", "الجمع والطرح": "Addition & Subtraction", "الضرب": "Multiplication", "القسمة": "Division",
  "سلاسل الجمع والطرح": "Add & Sub Chains", "ضرب وقسمة متقدم": "Advanced Mul & Div", "الكسور العشرية": "Decimals", "الجذور": "Roots",
  "جمع": "Addition", "طرح": "Subtraction", "ضرب": "Multiplication", "قسمة": "Division", "مختلط": "Mixed", "جمع وطرح": "Add & Subtract",
  "أصدقاء 5 (جمع)": "Friends of 5 (Add)", "أصدقاء 5 (طرح)": "Friends of 5 (Sub)", "أصدقاء 10 (جمع)": "Friends of 10 (Add)", "أصدقاء 10 (طرح)": "Friends of 10 (Sub)",
  "تلميح": "Hint", "تلميح:": "Hint:", "يساوي": "equals", "زائد": "plus", "ناقص": "minus", "في": "times", "على": "divided by", "ماذا": "What", "ضع": "Place", "ارفع": "Raise",
  "master_addition": "Addition & Subtraction Master", "master_multiplication": "Multiplication Master", "master_division": "Division Master", "master_mixed": "Mixed Master",
  "الحل": "Solution", "الخطوات": "Steps", "حرّك الخرزة": "Move the bead", "استخدم صديق 5": "Use friend of 5", "استخدم صديق 10": "Use friend of 10",
  "حرّك للأسفل": "Move down", "حرّك للأعلى": "Move up", "جلسة علاجية": "Remediation Session", "لا توجد مهارات ضعيفة": "No weak skills", "لا توجد أسئلة كافية": "Not enough questions",
  "ملاحظات التعليم التكيفي": "Adaptive Learning Notes", "تحليل الأداء": "Performance Analysis", "مهارات تحتاج تقوية": "Skills needing reinforcement",
  "مهارات المستوى تحتاج مراجعة": "Level skills needing review", "مهارات من مستويات أخرى تحتاج مراجعة": "Skills from other levels needing review",
  "مراجعة عامة": "General Review", "إجمالي الشارات": "Total Badges", "التوصية": "Recommendation", "دقة منخفضة": "Low accuracy",
  "أعد جلسة على المهارات أعلاه. سيقترح عليك النظام أسئلة علاجية مخصصة تلقائياً.": "Retake a session on the skills above. The system will automatically suggest customized remedial questions.",
  "جلسة مخصصة بدون درجات — تُظهر لك الحل بعد كل سؤال.": "Customized session without grades — shows you the solution after each question.",
  "جلسة قصيرة مخصصة لبناء الثقة — بدون درجات، وتُظهر لك الحل بعد كل سؤال.": "Customized short session to build confidence — no grades, shows the solution after each question.",
  "مقدمة": "Introduction", "درس تمهيدي": "Introductory Lesson", "مقدمة في السوروبان": "Introduction to the Soroban", "مراجعة": "Review",
  "التعرف على المعداد": "Getting to Know the Abacus", "الأرقام من 0 إلى 4": "Numbers from 0 to 4", "الأرقام من 5 إلى 9": "Numbers from 5 to 9",
  "أصدقاء 5": "Friends of 5", "أصدقاء 10": "Friends of 10", "القسمة على رقم واحد": "Division by one digit", "القسمة على رقمين": "Division by two digits",
  "الضرب (2 × 2)": "Multiplication (2 × 2)", "الجمع": "Addition", "الطرح": "Subtraction", "التعرف على السوروبان": "Introduction to the Soroban",
  "تمثيل الأرقام من 0 إلى 9": "Representing numbers 0 to 9", "القيمة المكانية وبناء الأعداد": "Place value and building numbers",
  "الأبطال الصغار": "Young Heroes", "سلسل الجمع": "Addition Chains", "سلسل الطرح": "Subtraction Chains", "سلاسل الجمع": "Addition Chains", "سلاسل الطرح": "Subtraction Chains",
  "الأعمدة": "Rods", "الخرزات السفلية": "Lower beads", "الخرزة العلوية": "Upper bead", "العارضة": "Bar", "👋 مرحباً": "👋 Hello", "صديق 10": "Friend of 10",
  "صديق 5": "Friend of 5", "مركبة": "Compound", "⬆️⬆️ رفع مزدوج": "⬆️⬆️ Double lift", "⬇️⬇️ نزول مزدوج": "⬇️⬇️ Double descent", "🗜️ كماشة مغلقة": "🗜️ Closed pinch",
  "✅ الناتج = 13": "✅ Result = 13", "✅ الناتج = 18": "✅ Result = 18", "✅ الناتج = 19": "✅ Result = 19", "✅ الناتج = 22": "✅ Result = 22",
  "✅ الناتج = 25": "✅ Result = 25", "✅ الناتج = 26": "✅ Result = 26", "✅ الناتج = 27": "✅ Result = 27", "✅ الناتج = 279": "✅ Result = 279",
  "✅ الناتج = 102": "✅ Result = 102", "✅ الناتج = 144": "✅ Result = 144", "✅ الناتج = 168": "✅ Result = 168", "✅ الناتج = 242": "✅ Result = 242",
  "✅ الناتج = 529": "✅ Result = 529", "✅ الناتج = 54": "✅ Result = 54", "✅ الناتج = 759": "✅ Result = 759", "✅ الناتج = 96": "✅ Result = 96",
  "✅ الناتج = 11": "✅ Result = 11", "✅ الناتج = 2": "✅ Result = 2", "✅ الناتج = 44": "✅ Result = 44", "✅ الناتج = 6": "✅ Result = 6",
  "العداد": "abacus", "سفليات": "lower beads", "سفلية": "lower bead", "العارضة الفاصلة": "bar", "الإبهام": "thumb", "السبابة": "index finger",
  "حركة القرص": "pinch movement", "سبب الاختيار": "Reason for selection", "تمثيل الصفر": "Representing zero", "عدد مركب": "compound number",
  "عشرات نظيفة": "clean tens", "عمود العشرات": "tens column", "عمود الآحاد": "units column", "منزلة": "place", "رقم العمود من اليمين": "column number from the right",
  "أدنى قيمة": "minimum value", "أقصى قيمة": "maximum value", "لا شيء مرفوع": "Nothing raised", "أين يقع": "Where is located",
};

const AR_TO_EN: Record<string, string> = {};
Object.entries(RAW_AR_TO_EN).forEach(([key, val]) => {
  AR_TO_EN[normalizeArabic(key)] = val;
});

// دالة الأنماط المتسامحة جداً (لأسئلة الامتحانات والأنزان فقط)
function translatePattern(text: string): string | null {
  let match;

  if (text.startsWith("تلميح:")) return text.replace(/^تلميح\s*:\s*/, "Hint: ");
  if (text.startsWith("الحل:")) return text.replace(/^الحل\s*:\s*/, "Solution: ");
  if (text.startsWith("الخطوات:")) return text.replace(/^الخطوات\s*:\s*/, "Steps: ");

  // أسئلة L0
  match = text.match(/^مثل\s*العدد\s*(\d+)\s*علي\s*العداد$/);
  if (match) return `Represent the number ${match[1]} on the abacus`;
  match = text.match(/^مثل\s*الرقم\s*(\d+)\s*علي\s*العداد$/);
  if (match) return `Represent the number ${match[1]} on the abacus`;

  match = text.match(/^ارفع\s*(\d+)\s*خرزات\s*سفليه$/);
  if (match) return `Raise ${match[1]} lower beads`;
  match = text.match(/^انزل\s*العلويه\s*وارفع\s*(\d+)\s*سفليات$/);
  if (match) return `Lower the upper bead and raise ${match[1]} lower beads`;
  match = text.match(/^انزل\s*العلويه\s*وارفع\s*خرزتين$/);
  if (match) return `Lower the upper bead and raise 2 lower beads`;
  match = text.match(/^ارفع\s*خرزه\s*سفليه\s*واحده$/);
  if (match) return `Raise 1 lower bead`;
  match = text.match(/^انزل\s*الخرزه\s*العلويه$/);
  if (match) return `Lower the upper bead`;

  match = text.match(/^(\d+)\s*سفليه\s*فقط\s*=\s*؟$/);
  if (match) return `Only ${match[1]} lower bead(s) = ?`;
  match = text.match(/^العلويه\s*\+\s*(\d+)\s*سفليه\s*=\s*؟$/);
  if (match) return `Upper bead + ${match[1]} lower bead(s) = ?`;
  match = text.match(/^لا\s*شيء\s*مرفوع\s*=\s*؟$/);
  if (match) return `Nothing raised = ?`;
  match = text.match(/^ادني\s*قيمه\s*في\s*عمود\s*واحد\s*=\s*؟$/);
  if (match) return `Minimum value in one column = ?`;
  match = text.match(/^اقصي\s*قيمه\s*في\s*عمود\s*واحد\s*=\s*؟$/);
  if (match) return `Maximum value in one column = ?`;
  match = text.match(/^كم\s*خرزه\s*سفليه\s*تحتاج\s*لتمثيل\s*(\d+)؟$/);
  if (match) return `How many lower beads do you need to represent ${match[1]}?`;

  match = text.match(/^قيمه\s*الخرزه\s*في\s*منزله\s*(الاحاد|العشرات|المئات|الالاف)\s*=\s*؟$/);
  if (match) {
    const placeMap: Record<string, string> = { "الاحاد": "units", "العشرات": "tens", "المئات": "hundreds", "الالاف": "thousands" };
    return `Value of the bead in the ${placeMap[match[1]]} place = ?`;
  }
  match = text.match(/^(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*الاحاد\s*=\s*؟$/);
  if (match) return `${match[1]} in tens + ${match[2]} in units = ?`;
  match = text.match(/^ما\s*الرقم\s*الذي\s*يمثله:\s*(\d+)\s*عشرات\s*\+\s*(\d+)\s*احاد؟$/);
  if (match) return `What number does this represent: ${match[1]} tens + ${match[2]} units?`;
  match = text.match(/^اين\s*يقع\s*(الاحاد|العشرات|المئات|الالاف)\s*علي\s*العداد؟\s*\(رقم\s*العمود\s*من\s*اليمين\)$/);
  if (match) {
    const placeMap: Record<string, string> = { "الاحاد": "units", "العشرات": "tens", "المئات": "hundreds", "الالاف": "thousands" };
    return `Where is the ${placeMap[match[1]]} located on the abacus? (column number from the right)`;
  }
  match = text.match(/^(\d+)\s*=\s*(\d+)\s*في\s*اي\s*منزله؟\s*\(1=احاد,\s*2=عشرات,\s*3=مئات\)$/);
  if (match) return `${match[1]} = ${match[2]} in which place? (1=units, 2=tens, 3=hundreds)`;
  match = text.match(/^(\d+)\s*في\s*المئات\s*\+\s*(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*الاحاد\s*=\s*؟$/);
  if (match) return `${match[1]} in hundreds + ${match[2]} in tens + ${match[3]} in units = ?`;
  match = text.match(/^كم\s*يساوي\s*(\d+)\s*في\s*العشرات\s*\+\s*(\d+)\s*في\s*المئات؟$/);
  if (match) return `How much is ${match[1]} in tens + ${match[2]} in hundreds?`;

  // الأنماط القديمة
  match = text.match(/^احسب\s*السلسلة\s*:\s*(.*)/); if (match) return `Calculate the chain: ${match[1]}`;
  match = text.match(/^احسب\s*:\s*(.*)/); if (match) return `Calculate: ${match[1]}`;
  match = text.match(/^ماذا\s*:\s*(.*)/); if (match) return `What: ${match[1]}`;
  match = text.match(/^ضع\s*:\s*(.*)/); if (match) return `Place: ${match[1]}`;
  match = text.match(/^ارفع\s*:\s*(.*)/); if (match) return `Raise: ${match[1]}`;
  match = text.match(/^L(\d+)$/); if (match) return `Level ${match[1]}`;

  return null;
}

// 🆕 محرك الاستبدال الذكي لخطوات الحل (مصمم لبنك L0)
function translateSolutionText(text: string): string {
  let result = text;
  result = result
    .replace(/سبب\s*الاختيار:\s*/g, "Reason: ")
    .replace(/تمثيل\s*الصفر/g, "Representing zero")
    .replace(/لا\s*ترفع\s*اي\s*خرزه\s*سفليه/g, "Do not raise any lower beads")
    .replace(/ولا\s*تنزل\s*الخرزه\s*العلويه/g, "and do not lower the upper bead")
    .replace(/جميع\s*الخرزات\s*بعيده\s*عن\s*العارضه\s*الفاصله/g, "All beads are away from the bar")
    .replace(/حركه\s*واحده\s*من\s*الصفر/g, "One movement from zero")
    .replace(/ارفع\s*خرزه\s*سفليه\s*واحده\s*بالابهام/g, "Raise 1 lower bead with the thumb")
    .replace(/نحو\s*العارضه/g, "towards the bar")
    .replace(/الخرزه\s*السفليه\s*الواحده\s*تمثل/g, "1 lower bead represents")
    .replace(/عدد\s*صغير\s*\(1-4\)\s*يرفع\s*بالخرزات\s*السفليه/g, "Small number (1-4) raised with lower beads")
    .replace(/ارفع\s*خرزتين\s*سفليتين\s*معا\s*بالابهام/g, "Raise 2 lower beads together with the thumb")
    .replace(/حركه\s*من\s*الصفر/g, "Movement from zero")
    .replace(/ارفع\s*3\s*خرزات\s*سفليه\s*معا\s*بالابهام/g, "Raise 3 lower beads together with the thumb")
    .replace(/الثلاث\s*خرزات\s*تمثل/g, "The 3 beads represent")
    .replace(/اكبر\s*عدد\s*في\s*الخرزات\s*السفليه\s*\(1-4\)/g, "Largest number in lower beads (1-4)")
    .replace(/ارفع\s*4\s*خرزات\s*سفليه\s*معا\s*بالابهام/g, "Raise 4 lower beads together with the thumb")
    .replace(/حركه\s*العلويه\s*من\s*الصفر/g, "Upper bead movement from zero")
    .replace(/انزل\s*الخرزه\s*العلويه\s*بالسبابه/g, "Lower the upper bead with the index finger")
    .replace(/الخرزه\s*العلويه\s*تمثل/g, "Upper bead represents")
    .replace(/عدد\s*مركب/g, "Compound number")
    .replace(/حركه\s*القرص\s*من\s*الصفر/g, "Pinch movement from zero")
    .replace(/حركه\s*القرص\s*في\s*العمودين/g, "Pinch movement in both columns")
    .replace(/حركه\s*القرص\s*:/g, "Pinch movement: ")
    .replace(/انزل\s*الخرزه\s*العلويه\s*\(5\)/g, "Lower the upper bead (5)")
    .replace(/انزل\s*العلويه\s*\(5\)/g, "Lower the upper bead (5)")
    .replace(/انزل\s*العلويه/g, "Lower the upper bead")
    .replace(/وارفع/g, "and raise")
    .replace(/خرزه\s*سفليه\s*واحده/g, "1 lower bead")
    .replace(/خرزتين\s*سفليتين/g, "2 lower beads")
    .replace(/3\s*خرزات\s*سفليه/g, "3 lower beads")
    .replace(/4\s*خرزات\s*سفليه/g, "4 lower beads")
    .replace(/4\s*سفليات/g, "4 lower beads")
    .replace(/خرزتين/g, "2 beads")
    .replace(/معا/g, "together")
    .replace(/النتيجه/g, "Result:")
    .replace(/عشرات\s*نظيفه\s*\(احاد\s*=\s*0\)/g, "Clean tens (units = 0)")
    .replace(/في\s*عمود\s*العشرات\s*:/g, "In tens column: ")
    .replace(/ارفع\s*4\s*خرزات\s*سفليه\s*بالابهام\s*=\s*40/g, "Raise 4 lower beads with the thumb = 40")
    .replace(/اترك\s*عمود\s*الاحاد\s*فارغا/g, "Leave the units column empty")
    .replace(/عشرات\s*\+\s*احاد\s*بخمسه/g, "Tens + units with five")
    .replace(/في\s*العشرات\s*:\s*ارفع\s*خرزتين\s*سفليتين\s*=\s*20/g, "In tens: Raise 2 lower beads = 20")
    .replace(/في\s*الاحاد\s*:\s*انزل\s*الخرزه\s*العلويه\s*=\s*5/g, "In units: Lower the upper bead = 5")
    .replace(/كل\s*عمود\s*يستخدم\s*حركه\s*القرص/g, "Each column uses pinch movement")
    .replace(/قرص\s*=\s*العلويه\s*\(5\)\s*\+\s*سفليه\s*\(1\)\s*=\s*60/g, "Pinch = upper (5) + lower (1) = 60")
    .replace(/الاحاد\s*:\s*3\s*سفليات\s*=\s*3/g, "Units: 3 lower beads = 3")
    .replace(/احاد\s*مركبه/g, "Compound units")
    .replace(/العشرات\s*:\s*سفليه\s*واحده\s*=\s*10/g, "Tens: 1 lower bead = 10")
    .replace(/الاحاد\s*:\s*قرص\s*=\s*علويه\s*\(5\)\s*\+\s*4\s*سفليات\s*=\s*9/g, "Units: Pinch = upper (5) + 4 lower beads = 9")
    .replace(/مئات\s*نظيفه/g, "Clean hundreds")
    .replace(/في\s*المئات\s*:/g, "In hundreds: ")
    .replace(/ارفع\s*خرزه\s*سفليه\s*واحده\s*=\s*100/g, "Raise 1 lower bead = 100")
    .replace(/ارفع\s*3\s*خرزات\s*سفليه\s*بالابهام\s*=\s*300/g, "Raise 3 lower beads with the thumb = 300")
    .replace(/اترك\s*باقي\s*الاعمده\s*فارغه/g, "Leave the rest of the columns empty")
    .replace(/باقي\s*الاعمده\s*فارغه/g, "The rest of the columns are empty")
    .replace(/يستخدم\s*الخرزه\s*العلويه\s*في\s*المئات/g, "Uses upper bead in hundreds")
    .replace(/انزل\s*الخرزه\s*العلويه\s*بالسبابه\s*=\s*500/g, "Lower the upper bead with the index finger = 500")
    .replace(/الاف\s*نظيفه/g, "Clean thousands")
    .replace(/في\s*الالاف\s*:/g, "In thousands: ")
    .replace(/ارفع\s*خرزه\s*سفليه\s*واحده\s*بالابهام\s*=\s*1000/g, "Raise 1 lower bead with the thumb = 1000")
    .replace(/الاف\s*\+\s*مئات/g, "Thousands + hundreds")
    .replace(/الالاف\s*:\s*ارفع\s*سفليه\s*واحده\s*=\s*1000/g, "Thousands: Raise 1 lower bead = 1000")
    .replace(/المئات\s*:\s*انزل\s*الخرزه\s*العلويه\s*=\s*500/g, "Hundreds: Lower the upper bead = 500")
    .replace(/تثبيت\s*رقم\s*من\s*المجموعه\s*السفليه/g, "Consolidating a number from the lower group")
    .replace(/تثبيت\s*رقم\s*من\s*المجموعه\s*المركبه/g, "Consolidating a compound number")
    .replace(/تثبيت\s*رقم\s*صغير/g, "Consolidating a small number")
    .replace(/تثبيت\s*اكبر\s*عدد\s*في\s*عمود/g, "Consolidating the largest number in a column")
    .replace(/تثبيت\s*الرقم\s*المتوسط/g, "Consolidating the middle number")
    .replace(/ارفع\s*4\s*سفليات/g, "raise 4 lower beads")
    .replace(/اترك\s*السفلي\s*بعيدا/g, "Keep the lower beads away")
    // ترجمة أي كلمات متبقية
    .replace(/عشرات/g, "Tens")
    .replace(/احاد/g, "Units")
    .replace(/مئات/g, "Hundreds")
    .replace(/الاف/g, "Thousands");

  return result;
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

      // 🆕 محرك الاستبدال الذكي (يعمل فقط على خطوات الحل)
      if (field === "solution" || field === "steps") {
        const translatedSol = translateSolutionText(normalizedKey);
        if (translatedSol !== normalizedKey) {
          return translatedSol;
        }
      }

      // Fallback لرموز الخطوات الرياضية
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