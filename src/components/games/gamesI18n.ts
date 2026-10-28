/* eslint-disable no-misleading-character-class */
// src/components/games/gamesI18n.ts
// 🌐 ترجمة نصوص الألعاب (عربي → إنجليزي) — قاموس + أنماط
// الاستخدام:  gt('نص عربي')  ← يرجع الإنجليزي عند lang === 'en'، وإلا يرجع النص كما هو.
// ⚠️ العربية لا تتغير إطلاقًا: gt تُرجع المُدخل نفسه في الوضع العربي.

import { useLangStore } from '@/i18n/useTranslation';

const TASH = /[\u064B-\u065F\u0670\u0640]/g;
const AR_RE = /[\u0600-\u06FF]/;
// مقطع عربي: يبدأ بحرف عربي وقد يحوي أرقامًا وعلامات ويُنهى بحرف/علامة
const RUN_RE = /[\u0600-\u06FF](?:[\u0600-\u06FF\u064B-\u065F\u0640\s\d،؟!.:؛+\-()×÷=%]*[\u0600-\u06FF!؟.؛)?])?/g;

/** تطبيع المفتاح: بلا تشكيل، توحيد الألف والياء والتاء المربوطة */
export function normalizeAr(s: string): string {
  return s
    .replace(TASH, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hasArabic(s: string): boolean {
  return AR_RE.test(s);
}

const DICT: Record<string, string> = {
  'ابحث عن القاعده المفقوده..': 'Look for the missing rule..',
  'ابدا التحدي': 'Start the challenge',
  'ابدا التحقيق': 'Start the investigation',
  'ابدا اللعبه': 'Start the game',
  'ابريل': 'Apr',
  'ابعد 4 خرزات سفليه عن المحور!': 'Move 4 lower beads away from the bar!',
  'ابعد خرزتين سفليتين!': 'Move 2 lower beads away!',
  'اترك خرزه سفليه واحده فقط!': 'Leave only one lower bead!',
  'اثنا عشر! خارق!': 'Twelve! Amazing!',
  'اجابه ذكيه جدا!': 'A very smart answer!',
  'اجابه صحيحه!': 'Correct answer!',
  'اجمع': 'collect',
  'احسب السلسله وتاكد من اعمده العشرات!': 'Work out the chain and check the tens rods!',
  'احسنت يا بطل!': 'Well done, champion!',
  'احسنت يا شريكي في التحقيق!': 'Well done, my investigation partner!',
  'احسنت!': 'Well done!',
  'احسنت! اداء رائع!': 'Well done! Great performance!',
  'اخبرني بالقيمه!': 'Tell me the value!',
  'اختر لعبه!': 'Pick a game!',
  'اخصم 3 خرزات سفليه!': 'Subtract 3 lower beads!',
  'اداء تحليلي باهر!': 'A brilliant analytical performance!',
  'اذهب الي دروسك': 'Go to your lessons',
  'ارفع 4 خرزات سفليه مباشره!': 'Lift 4 lower beads directly!',
  'ارفع الخمسه وارفع 4 سفليه! (-5 + 4)': 'Lift the 5 and lift 4 lower beads! (-5 + 4)',
  'ارفع خرزتين سفليتين اضافيتين!': 'Lift 2 more lower beads!',
  'ارفع خرزه سفليه اضافيه!': 'Lift one more lower bead!',
  'استعد للطيران!': 'Get ready to fly!',
  'استعد... انطلق!': 'Get ready... go!',
  'استمتع': 'Enjoy',
  'اسرار الجده 5 والعملاق': 'Secrets of Grandma 5 and Giant',
  'اسرار المربعات والجذور': 'Secrets of squares and roots',
  'اسرع من العاصفه': 'Faster than the storm',
  'اشتر تذكره ب': 'Buy a ticket for',
  'اصدقاء': 'Friends',
  'اضف 5 واطرح صديق 4 وهو 1!': 'Add 5 and subtract the friend of 4, which is 1!',
  'اعاده التحدي': 'Play again',
  'اعاده التحقيق': 'Investigate again',
  'اغسطس': 'Aug',
  'اغلاق الملف (تحقق)': 'Close the file (check)',
  'افتح ملف القضيه، هيا نبحث عن الخطا!': 'Open the case file, let us hunt for the mistake!',
  'اقتربت جدا من حل اللغز!': 'You are very close to solving the puzzle!',
  'اقرا قيمه المعداد بسرعه البرق': 'Read the abacus value at lightning speed',
  'اقرا قيمه المعداد قبل ان يختفي!': 'Read the abacus value before it disappears!',
  'اكتشف الخطا في المعداد واصلح الخرزات لاغلاق القضيه!': 'Find the mistake on the abacus and fix the beads to close the case!',
  'اكتشف الخطا واصلح المعداد': 'Find the mistake and fix the abacus',
  'اكتوبر': 'Oct',
  'الاجابات الصحيحه': 'Correct answers',
  'الان': 'Now',
  'الباحث الذكي': 'Smart Seeker',
  'البطل الصاعد': 'Rising Champion',
  'التدريب يصنع الابطال!': 'Practice makes champions!',
  'التقدم نحو التذكره': 'Progress toward a ticket',
  'الخمسه العلويه مع 3 سفليه تساوي 8!': 'The upper 5 with 3 lower beads equals 8!',
  'الرقم': 'Number',
  'الرقم القياسي': 'Record',
  'العب': 'Play',
  'العداد الطائر': 'Flying Abacus',
  'العوده للالعاب': 'Back to games',
  'القضايا المغلقه': 'Closed cases',
  'اللقب': 'Title',
  'اللقب المكتسب': 'Title earned',
  'المحاوله القادمه!': 'Next attempt!',
  'المحقق الاسطوري': 'The Legendary Detective',
  'المحقق الذكي': 'The Smart Detective',
  'المحقق الرقمي': 'Digital Detective',
  'المحقق المحترف': 'The Professional Detective',
  'المحقق جود جاهز.. استعد لتفكيك الشفره!': 'Detective Joud is ready.. get ready to crack the code!',
  'المحقق جود في الخدمه!': 'Detective Joud at your service!',
  'المره القادمه افضل!': 'Next time will be better!',
  'المعداد غير مصحح بعد!': 'The abacus is not fixed yet!',
  'اليوم': 'Today',
  'امس': 'Yesterday',
  'انا معك، هيا!': 'I am with you, let us go!',
  'انت تتحسن!': 'You are improving!',
  'انت تستطيع، هيا نمهل السرعه قليلا!': 'You can do it, let us slow down a little!',
  'انت ذكي!': 'You are smart!',
  'انت علي الطريق الصحيح!': 'You are on the right track!',
  'انت نجم السوروبان!': 'You are a Soroban star!',
  'انتبه للخرزات...': 'Watch the beads...',
  'انتبه للمعداد!': 'Watch the abacus!',
  'انتهي التحدي!': 'Challenge over!',
  'انتهي التحقيق!': 'Investigation over!',
  'انزل الخمسه العلويه وارفع 3 سفليه!': 'Bring down the upper 5 and lift 3 lower beads!',
  'انطلق بسرعه!': 'Go fast!',
  'انظر بتركيز...': 'Look with focus...',
  'انظر بدقه...': 'Look closely...',
  'اهلا': 'Hello',
  'اهلا بالشريك! لدينا قضايا حسابيه بحاجه للحل!': 'Welcome, partner! We have math cases that need solving!',
  'برافو!': 'Bravo!',
  'برق السوروبان': 'Soroban Lightning',
  'بسيط': 'Simple',
  'بسيطه، ركز!': 'Easy one, focus!',
  'بطل': 'Champion',
  'بطل حقيقي!': 'A true champion!',
  'بلا': 'no',
  'بلا تذاكر': 'no tickets',
  'تاكد من انزال الخرزه العلويه 5!': 'Make sure the upper bead 5 is down!',
  'تحليل عبقري! المعداد مضبوط الان!': 'Genius analysis! The abacus is fixed now!',
  'تذاكرك': 'Your tickets',
  'تذكر قواعد الاصدقاء.. انظر للخرزات!': 'Remember the friends rules.. look at the beads!',
  'تسع قضايا! اداء محترف جدا!': 'Nine cases! A very professional performance!',
  'تعلم': 'Learn',
  'تلميح': 'Hint',
  'تم اغلاق الملف بنجاح!': 'File closed successfully!',
  'تمهل قليلا...': 'Slow down a little...',
  'ثانيه': 'seconds',
  'ثلاث عشره قضيه! انت اسطوره التحقيق!': 'Thirteen cases! You are an investigation legend!',
  'ثلاث قضايا مكشوفه! برافو!': 'Three cases cracked! Bravo!',
  'ثلاثه! السرعه القصوي!': 'Three! Top speed!',
  'ثمانيه عشر! مذهل!': 'Eighteen! Astonishing!',
  'ثمانيه! ممتاز!': 'Eight! Excellent!',
  'جزيره سوروبانيا': 'Sorobania Island',
  'جميع الالعاب مفتوحه': 'All games are unlocked',
  'جيد!': 'Good!',
  'جيد! واصل التدريب!': 'Good! Keep practicing!',
  'حلل المعداد جيدا.. اين الخلل؟': 'Analyze the abacus well.. where is the fault?',
  'خذ نفسا عميقا، انا معك!': 'Take a deep breath, I am with you!',
  'خذ نفسا، ثم حاول!': 'Take a breath, then try!',
  'خمس قضايا مغلقه! انت محقق ذكي!': 'Five cases closed! You are a smart detective!',
  'خمسه عشر! عبقري!': 'Fifteen! Genius!',
  'خمسه وعشرون! لا يوصف!': 'Twenty-five! Indescribable!',
  'خمسه! كفو!': 'Five! Nicely done!',
  'دليل خاطئ! اعد فحص القاعده!': 'Wrong clue! Re-check the rule!',
  'دوجو السوروبان': 'Soroban Dojo',
  'ديسمبر': 'Dec',
  'رائع جدا!': 'Really great!',
  'رائع!': 'Great!',
  'رائع! اداء خارق!': 'Great! Amazing performance!',
  'راقب المعداد جيدا...': 'Watch the abacus closely...',
  'راقب المعداد...': 'Watch the abacus...',
  'راقب بعنايه...': 'Watch carefully...',
  'رجوع': 'Back',
  'رقم قياسي جديد للمحقق!': 'A new record for the detective!',
  'رقم قياسي جديد!': 'New record!',
  'ركز اكثر، انت تقدر!': 'Focus more, you can do it!',
  'ركز جيدا...': 'Focus well...',
  'ركز قليلا!': 'Focus a little!',
  'ركز هنا، هذه المساله في متناولك!': 'Focus here, this problem is within your reach!',
  'سباق القراصنه': 'Pirate Race',
  'سبتمبر': 'Sep',
  'سجل': 'Record',
  'سريع كالبرق!': 'Fast as lightning!',
  'طاقه': 'Energy',
  'طبق صديق 7 ثم اخصم الخمسه!': 'Apply the friend of 7, then subtract the five!',
  'عشره! رائع!': 'Ten! Great!',
  'عشرون! اسطوري!': 'Twenty! Legendary!',
  'عمل جيد!': 'Good work!',
  'عمل رائع!': 'Great work!',
  'فبراير': 'Feb',
  'قاعده': 'Rule',
  'قريب! حاول مره اخري!': 'Close! Try once more!',
  'قضيه': 'cases',
  'قضيه اخري مغلقه بنجاح! ذكي جدا!': 'Another case closed successfully! Very smart!',
  'قيد التطوير': 'Under development',
  'كم تساوي؟': 'What does it equal?',
  'كم عدد الخرزات؟': 'How many beads?',
  'كن الاول!': 'Be the first!',
  'كن منتبها...': 'Stay alert...',
  'كنت': 'You were',
  'لا باس يا بطل، خذ وقتك للتركيز!': 'It is okay, champion, take your time to focus!',
  'لا باس! انتقل للقضيه القادمه!': 'It is okay! Move on to the next case!',
  'لا باس، المحاوله القادمه!': 'It is okay, next attempt!',
  'لا باس، المحققون لا يستسلمون! ركز!': 'It is okay, detectives never give up! Focus!',
  'لا باس، المهم المحاوله!': 'It is okay, trying is what matters!',
  'لا باس، حاول مجددا!': 'It is okay, try again!',
  'لا تستعجل!': 'Do not rush!',
  'لا يوجد رقم قياسي بعد': 'No record yet',
  'لديك تذكره': 'You have a ticket',
  'ما الرقم؟': 'What is the number?',
  'ما القيمه التي رايتها؟': 'What value did you see?',
  'ما الناتج؟': 'What is the result?',
  'ما شاء الله!': 'Wonderful!',
  'ما هذا الرقم؟': 'What is this number?',
  'ما هي القيمه؟': 'What is the value?',
  'مارس': 'Mar',
  'مايو': 'May',
  'محاوله طيبه يا شريكي!': 'A good try, partner!',
  'محاوله طيبه!': 'A good try!',
  'محفظه النقاط': 'Points wallet',
  'محقق متدرب': 'Trainee Detective',
  'مدينه الالعاب': 'Game City',
  'مركب': 'Compound',
  'مستعد للتحدي؟': 'Ready for the challenge?',
  'مستعد؟ انطلق!': 'Ready? Go!',
  'معاينه': 'Preview',
  'ملف القضيه': 'Case file',
  'ممتاز!': 'Excellent!',
  'ممتاز! انت بطل حقيقي!': 'Excellent! You are a true champion!',
  'نجم العداد': 'Abacus Star',
  'نقاط': 'points',
  'نوفمبر': 'Nov',
  'هذه اللعبه ستضاف في الجلسه القادمه': 'This game will be added in the next session',
  'هيا نبدا!': 'Let us start!',
  'هيا نثبت سرعتنا!': 'Let us prove our speed!',
  'هيا نحاول مره اخري!': 'Let us try again!',
  'هيا نري قوتك!': 'Let us see your power!',
  'هيا نلاعب الارقام!': 'Let us play with numbers!',
  'هيا يا بطل!': 'Let us go, champion!',
  'هيا، ركز اكثر!': 'Come on, focus more!',
  'وضع المعاينه الكامله مفعل': 'Full preview mode is on',
  'وعد': 'then come back',
  'يا لك من عبقري!': 'What a genius!',
  'يناير': 'Jan',
  'يوليو': 'Jul',
  'يونيو': 'Jun',
};

const PATTERNS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^صديق (\d+) هو (\d+)! \((.*)\)$/, (m) => `Friend of ${m[1]} is ${m[2]}! (${m[3]})`],
  [/^اطرح (\d+) واضف صديق (\d+) وهو (\d+)!$/, (m) => `Subtract ${m[1]} and add the friend of ${m[2]}, which is ${m[3]}!`],
  [/^اضف (\d+)، اطرح (\d+) واضف (\d+)!$/, (m) => `Add ${m[1]}, subtract ${m[2]} and add ${m[3]}!`],
  [/^اضف (\d+) واطرح (\d+)!$/, (m) => `Add ${m[1]} and subtract ${m[2]}!`],
  [/^اطرح (\d+)، اضف (\d+) واطرح (\d+)!$/, (m) => `Subtract ${m[1]}, add ${m[2]} and subtract ${m[3]}!`],
  [/^منذ (\d+) ايام$/, (m) => `${m[1]} days ago`],
  [/^منذ (\d+) اسابيع$/, (m) => `${m[1]} weeks ago`],
  [/^منذ (\d+) اشهر$/, (m) => `${m[1]} months ago`],
];

function lookup(key: string): string | undefined {
  const hit = DICT[key];
  if (hit !== undefined) return hit;
  for (const [re, fn] of PATTERNS) {
    const m = key.match(re);
    if (m) return fn(m);
  }
  return undefined;
}

/** يترجم نصًا عربيًا (كاملًا أو مقاطع داخله) إلى الإنجليزية؛ وإلا يرجع الأصل */
export function gtLang(ar: string, lang: string): string {
  if (lang !== 'en' || !ar || !AR_RE.test(ar)) return ar;
  const whole = lookup(normalizeAr(ar));
  if (whole !== undefined) return whole;
  let allOk = true;
  const out = ar.replace(RUN_RE, (run) => {
    const t = lookup(normalizeAr(run));
    if (t === undefined) {
      allOk = false;
      return run;
    }
    return t;
  });
  return allOk ? out : ar;
}

/** المترجم الافتراضي: يقرأ اللغة الحالية لحظة الاستدعاء */
export function gt(ar: string): string {
  return gtLang(ar, useLangStore.getState().lang);
}

/** اشتراك المكوّن في اللغة (يعيد الرسم عند التبديل) */
export function useGameLang() {
  const lang = useLangStore((s) => s.lang);
  return { lang, dir: (lang === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr', isAr: lang === 'ar' };
}
