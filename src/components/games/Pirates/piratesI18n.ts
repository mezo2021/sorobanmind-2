// src/components/games/Pirates/piratesI18n.ts
// 🌐 ترجمة سباق القراصنة (عربي → إنجليزي) — ملف مستقل لا يمسّ gamesI18n.ts
//  • pgt(ar): يترجم نصًا عربيًا (حتى لو كان ناتج محرّك القسمة/الضرب مثل «نأخذ 15 ← …»)
//  • في الوضع العربي يرجع النص كما هو. أي نص غير مغطّى هنا يُمرَّر إلى gt() المركزي.

import { useLangStore } from '@/i18n/useTranslation';
import { gt } from '../gamesI18n';

const TASH = /[\u064B-\u065F\u0670\u0640]/g;
const AR_RE = /[\u0600-\u06FF]/;
// eslint-disable-next-line no-misleading-character-class
const RUN_RE = /[\u0600-\u06FF](?:[\u0600-\u06FF\u064B-\u065F\u0640\s\d،؟!.:؛+\-()×÷=%]*[\u0600-\u06FF!؟.؛)?])?/g;

function normalizeAr(s: string): string {
  return s
    .replace(TASH, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .trim();
}

const DICT: Record<string, string> = {
  '؟': '?',
  'ابدا السباق': 'Start the race',
  'احاد': 'Units',
  'اخترت': 'You picked',
  'استعد!': 'Get ready!',
  'اسرع يا': 'Hurry up,',
  'اسرع يا بطل!': 'Hurry up, champion!',
  'اضرب بسرعه لتبقي امام القراصنه. اصمد 90 ثانيه حتي تصل الي الجزيره!': 'Multiply fast to stay ahead of the pirates. Hold on for 90 seconds until you reach the island!',
  'اعاده السباق': 'Race again',
  'اعاده من البدايه': 'Restart',
  'الاجابات الصحيحه': 'Correct answers',
  'الاخطاء': 'Mistakes',
  'الاف': 'Thou.',
  'الجزيره امامنا!': 'The island is ahead of us!',
  'الخطوه': 'Step',
  'الخطوه التاليه': 'Next step',
  'الخطوه السابقه': 'Previous step',
  'الرقم': 'Number',
  'الريح معنا!': 'The wind is with us!',
  'القراصنه تقدموا... هيا نلحق!': 'The pirates are ahead... let us catch up!',
  'القراصنه خلفنا!': 'The pirates are behind us!',
  'القراصنه يقتربون!': 'The pirates are getting closer!',
  'المستوي': 'Level',
  'المقسوم': 'Dividend',
  'الناتج': 'Result',
  'النقاط': 'Points',
  'الوقت متوقف': 'Time paused',
  'امسكوا بنا!': 'They caught us!',
  'انت اسطوره!': 'You are a legend!',
  'انتهي الوقت! اليك الحل خطوه خطوه.': 'Time is up! Here is the solution step by step.',
  'ايقاف': 'Pause',
  'بطل': 'Champion',
  'تشغيل': 'Play',
  'تشغيل الصوت': 'Sound on',
  'تصحيح المسار': 'Course correction',
  'حاول مجددا': 'Try again',
  'حبل ريان': 'Rayan\'s rope',
  'حبل ريان!': 'Rayan\'s rope!',
  'حمل': 'carry',
  'خذ حبل الانقاذ!': 'Take the rescue rope!',
  'ذهبيه': 'Golden',
  'رجوع': 'Back',
  'رقم قياسي جديد!': 'New record!',
  'سباق القراصنه': 'Pirate Race',
  'سرقوا الكنز... مؤقتا!': 'They stole the treasure... temporarily!',
  'سنستعيده معا. مره اخري؟': 'we will get it back together. Once more?',
  'ضرب': 'Multiplication',
  'ع.الاف': 'Ten-Th.',
  'عشرات': 'Tens',
  'قريب! انظر اين الخطا.': 'Close! Look where the mistake is.',
  'قسمه': 'Division',
  'قطعه ذهبيه': 'gold coins',
  'قطعه للمحاوله': 'coins for the attempt',
  'كتم الصوت': 'Mute',
  'كنت': 'You were',
  'لا باس يا بطل': 'It is okay, champion',
  'لا باس يا بطل! سنستعيد الكنز معا. مره اخري؟': 'It is okay, champion! We will get the treasure back together. Once more?',
  'لا باس! تعلم من الخطوات.': 'It is okay! Learn from the steps.',
  'مئات': 'Hund.',
  'متابعه السباق': 'Resume the race',
  'مدفع ريان!': 'Rayan\'s cannon!',
  'مدفعي!': 'My cannon!',
  'مدفعي! ارجعوا يا قراصنه!': 'My cannon! Go back, pirates!',
  'مدينه الالعاب': 'Game City',
  'مساله ذهبيه! نقاط ×2 وبلا خساره': 'Golden problem! Points ×2 and no loss',
  'نحن في المقدمه!': 'We are in the lead!',
  'هذا الجزء الذي نسيته': 'This is the part you forgot',
  'هنا المنزله خاطئه': 'Here the place is wrong',
  'هنا قدرت الرقم خطا': 'Here you estimated the digit wrongly',
  'هنا قلبت الرقمين': 'Here you swapped the two digits',
  'هنا موضع الخطا': 'Here is where the mistake is',
  'هنا نسيت الصفر': 'Here you forgot the zero',
  'هنا نسيت انزال رقم': 'Here you forgot to bring down a digit',
  'هنا يجب الحمل': 'Here you must carry',
  'هنا يكتب الصفر': 'Here you write the zero',
  'وصلت للجزيره!': 'You reached the island!',
  'وصلت للجزيره! رقم قياسي جديد!': 'You reached the island! New record!',
  'وصلنا للجزيره! احسنت!': 'We reached the island! Well done!',
};

// ── قواعد نصوص المحرّكات (divEngine / mulEngine) — على النص المُطبَّع ──
const ENGINE_RULES: Array<[RegExp, string]> = [
  [/الجزء (\d+) لا يتسع للقاسم (\d+)/g, 'The part $1 does not fit the divisor $2'],
  [/ولا تتخط المنزله/g, 'and do not skip the place'],
  [/منزله رقم القسمه = منزله اخر رقم في الجزء المقسوم/g, 'The place of the quotient digit = the place of the last digit in the part being divided'],
  [/اول رقم في القسمه يكتب في منزله اخر رقم اخذته من المقسوم، لا اعلي/g, 'The first quotient digit is written in the place of the last digit you took from the dividend, not the highest'],
  [/(\d+)×(\d+) اكبر من (\d+)، فلا يصح/g, '$1×$2 is greater than $3, so it is not valid'],
  [/اكبر رقم يصح هو (\d+)/g, 'The largest valid digit is $1'],
  [/بعد الطرح يجب ان يكون الباقي اصغر من (\d+)/g, 'After subtracting, the remainder must be smaller than $1'],
  [/جرب (\d+)×(\d+)/g, 'Try $1×$2'],
  [/نسيت انزال رقم: كل رقم ينزل من المقسوم يعطي رقما في القسمه/g, 'You forgot to bring down a digit: every digit brought down from the dividend gives a digit in the quotient'],
  [/قلبت رقمين: القسمه تكتب من الاعلي منزله الي الادني \((\d+) ثم (\d+)\)/g, 'You swapped two digits: the quotient is written from the highest place to the lowest ($1 then $2)'],
  [/قريب من الصحيح! اعد خطوات القسمه بتان/g, 'Close to correct! Redo the division steps carefully'],
  [/قريب من الصحيح! اعد جمع الاجزاء بتان/g, 'Close to correct! Redo adding the parts carefully'],
  [/احسنت! كل رقم في منزلته الصحيحه/g, 'Well done! Every digit is in its correct place'],
  [/موضع الجزء (\d+)×(\d+) خاطئ: منزله احاده = منزله (\d+) \+ منزله (\d+)/g, 'The position of the part $1×$2 is wrong: its units place = place of $3 + place of $4'],
  [/ناتج رقمين يشغل منزلتين دائما: (\d+)×(\d+) = (\d+)، والصفر يبقي في/g, 'A two-digit product always occupies two places: $1×$2 = $3, and the zero stays in'],
  [/نسيت الحمل: اذا زادت المنزله عن 9 فاحمل 1 الي المنزله التي علي يسارها/g, 'You forgot the carry: if a place goes above 9, carry 1 to the place on its left'],
  [/نسيت الجزء (\d+) × (\d+)\. اضرب كل رقم في كل رقم/g, 'You forgot the part $1 × $2. Multiply every digit by every digit'],
  [/قلبت رقمي الناتج: (\d+)×(\d+) = (\d+) \(العشرات اولا ثم الاحاد\)/g, 'You swapped the product digits: $1×$2 = $3 (the tens first, then the units)'],
  [/احسنت! جمعت الاجزاء في منازلها الصحيحه/g, 'Well done! You added the parts in their correct places'],
  [/ثم انزل الرقم التالي/g, 'then bring down the next digit'],
  [/اكتب (\d+) علي/g, 'write $1 on'],
  [/اكتب (\d+) في/g, 'write $1 in'],
  [/ (\d+) علي /g, ' $1 on '],
  [/(\d+) علي /g, '$1 on '],
  [/ و (\d+) on/g, ' and $1 on'],
  [/ اصغر من /g, ' is smaller than '],
  [/من الناتج/g, 'of the result'],
  [/ناخذ /g, 'Take '],
  [/نطرح /g, 'Subtract '],
  [/يبقي صفر/g, 'zero remains'],
  [/المقسوم الان /g, 'the dividend is now '],
  [/الباقي /g, 'remainder '],
  [/←/g, '→'],
  [/عشرات الالوف/g, 'the ten-thousands'],
  [/الالوف/g, 'the thousands'],
  [/المئات/g, 'the hundreds'],
  [/العشرات/g, 'the tens'],
  [/الاحاد/g, 'the units'],
  [/المنزله (\d+)/g, 'place $1'],
  [/؟/g, '?'],
];


function applyRules(key: string): string | undefined {
  let s = key;
  for (const [re, rep] of ENGINE_RULES) s = s.replace(re, rep);
  return s !== key && !AR_RE.test(s) ? s.replace(/\s+/g, ' ').trim() : undefined;
}

function translate(ar: string): string | undefined {
  const key = normalizeAr(ar);
  const hit = DICT[key];
  if (hit !== undefined) return hit;
  return applyRules(key);
}

export function pgtLang(ar: string, lang: string): string {
  if (lang !== 'en' || !ar || !AR_RE.test(ar)) return ar;
  const whole = translate(ar);
  if (whole !== undefined) return whole;
  let ok = true;
  const out = ar.replace(RUN_RE, (run) => {
    const t = translate(run);
    if (t === undefined) {
      ok = false;
      return run;
    }
    return t;
  });
  return ok ? out : gt(ar); // احتياط: القاموس المركزي
}

/** مترجم القراصنة: يقرأ اللغة الحالية لحظة الاستدعاء */
export function pgt(ar: string): string {
  return pgtLang(ar, useLangStore.getState().lang);
}
