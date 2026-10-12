// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/mulEngine.ts
// ═══════════════════════════════════════════════════════════════════
//
// محرّك ضرب السوروبان (طريقة الأجزاء حسب المنازل)
//
// القواعد المطبّقة:
//   1) نضرب من اليسار (الأعلى منزلة) إلى اليمين.
//   2) ناتج ضرب رقمين يشغل دائماً منزلتين: (عشرات | آحاد)
//      ويُكتب صفر إذا كان الناتج من رقم واحد (3×2 = 06).
//   3) منزلة آحاد الناتج = منزلة الرقم الأول + منزلة الرقم الثاني
//      (منزلة الآحاد = 0 · العشرات = 1 · المئات = 2 ...)
//   4) الأجزاء تُجمع على المعداد، وكل منزلة تزيد عن 9 تحمل 1 لليسار.
//
// الخيارات الخاطئة ليست عشوائية: كل خيار يمثّل خطأً حقيقياً يقع فيه
// الطفل، ومعه شرح جاهز يظهر بعد الاختيار.
// ═══════════════════════════════════════════════════════════════════

export type MulLevel = 1 | 2 | 3 | 4;
export type MulErrorKind = 'shift' | 'padding' | 'carry' | 'missed' | 'swap' | 'near';
type Rng = () => number;

export interface MulStep {
  a: number;          // رقم من المضروب
  b: number;          // رقم من المضروب فيه
  onesRod: number;    // منزلة آحاد الناتج (0 = آحاد)
  tensRod: number;    // منزلة عشرات الناتج
  product: number;    // a × b (0..81)
  value: number;      // القيمة الفعلية = product × 10^onesRod
  running: number;    // المجموع التراكمي بعد هذه الخطوة
  text: string;       // شرح الخطوة بالعربية
}

export interface MulOption {
  value: number;
  kind: 'correct' | MulErrorKind;
  why: string;        // يُعرض بعد الاختيار
}

export interface MulProblem {
  id: string;
  level: MulLevel;
  a: number;
  b: number;
  expression: string;
  answer: number;
  steps: MulStep[];
  options: MulOption[];      // 3 خيارات مرتّبة عشوائياً
  correctIndex: number;
  timeSec: number;
}

const LEVELS: Record<MulLevel, { aDigits: number; bDigits: number; time: number }> = {
  1: { aDigits: 1, bDigits: 1, time: 8 },    // جدول الضرب
  2: { aDigits: 2, bDigits: 1, time: 10 },
  3: { aDigits: 3, bDigits: 1, time: 12 },
  4: { aDigits: 2, bDigits: 2, time: 16 },
};

const ROD_NAMES = ['الآحَاد', 'العَشَرَات', 'المِئَات', 'الأُلُوف', 'عَشَرَاتِ الأُلُوف'];
const rodName = (i: number) => ROD_NAMES[i] ?? `المَنْزِلَة ${i + 1}`;

// ═══ مساعدات ═══
const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randNum(rng: Rng, digits: number, allowZero: boolean): number {
  let n = 0;
  for (let i = 0; i < digits; i++) {
    const leading = i === 0;
    let d: number;
    if (leading || digits === 1) d = ri(rng, 2, 9);
    else d = allowZero && rng() < 0.12 ? 0 : ri(rng, 1, 9);
    n = n * 10 + d;
  }
  return n;
}

/** أرقام العدد من اليسار إلى اليمين مع منزلة كل رقم */
function digitsOf(n: number): { d: number; pos: number }[] {
  const s = String(n);
  return [...s].map((ch, i) => ({ d: Number(ch), pos: s.length - 1 - i }));
}

/** رقم الناتج على منزلتين: 6 → "06" */
const pad2 = (p: number) => (p < 10 ? `0${p}` : String(p));

// ═══ تتبّع الحل على المعداد ═══
export function traceMultiplication(a: number, b: number): MulStep[] {
  const steps: MulStep[] = [];
  let running = 0;
  for (const db of digitsOf(b)) {          // من اليسار
    for (const da of digitsOf(a)) {
      if (da.d === 0 || db.d === 0) continue; // الصفر لا يُحرَّك على المعداد
      const product = da.d * db.d;
      const onesRod = da.pos + db.pos;
      const value = product * 10 ** onesRod;
      running += value;
      const t = Math.floor(product / 10);
      const o = product % 10;
      steps.push({
        a: da.d, b: db.d, onesRod, tensRod: onesRod + 1, product, value, running,
        text: `${da.d} × ${db.d} = ${pad2(product)} ← ${t} عَلَى ${rodName(onesRod + 1)} وَ ${o} عَلَى ${rodName(onesRod)}`,
      });
    }
  }
  return steps;
}

/** أرقام العدد منزلةً منزلة (يسار → يمين) لعرضه على معداد متعدد الأعمدة */
export function rodsFromNumber(n: number, rods: number): number[] {
  const s = String(n).padStart(rods, '0');
  return [...s].map(Number);
}

// ═══ الأخطاء الحقيقية → خيارات خاطئة ═══
function buildWrongOptions(a: number, b: number, steps: MulStep[], answer: number, rng: Rng): MulOption[] {
  const candidates: MulOption[] = [];
  const nonZero = steps.filter((s) => s.value > 0);

  // 1) إزاحة جزء منزلة واحدة
  const shiftable = nonZero.filter((s) => s.product >= 10);
  if (shiftable.length) {
    const s = shiftable[ri(rng, 0, shiftable.length - 1)];
    const moved = s.onesRod === 0 || rng() < 0.5 ? s.value * 10 : s.value / 10;
    candidates.push({
      value: answer - s.value + moved,
      kind: 'shift',
      why: `مَوْضِعُ الجُزْءِ ${s.a}×${s.b} خَاطِئ: مَنْزِلَةُ آحَادِهِ = مَنْزِلَةُ ${s.a} + مَنْزِلَةُ ${s.b} = ${rodName(s.onesRod)}.`,
    });
  }

  // 2) نسيان الصفر في ناتج من رقم واحد
  const single = nonZero.filter((s) => s.product < 10);
  if (single.length) {
    const s = single[ri(rng, 0, single.length - 1)];
    candidates.push({
      value: answer - s.value + s.value * 10,
      kind: 'padding',
      why: `نَاتِجُ رَقْمَيْنِ يَشْغَلُ مَنْزِلَتَيْنِ دَائِماً: ${s.a}×${s.b} = ${pad2(s.product)}، وَالصِّفْرُ يَبْقَى فِي ${rodName(s.tensRod)}.`,
    });
  }

  // 3) نسيان الحمل (جمع المنازل بدون ترحيل)
  const rods: number[] = Array(8).fill(0);
  for (const s of steps) {
    rods[s.tensRod] += Math.floor(s.product / 10);
    rods[s.onesRod] += s.product % 10;
  }
  const noCarry = rods.reduce((sum, v, i) => sum + (v % 10) * 10 ** i, 0);
  if (noCarry !== answer) {
    candidates.push({
      value: noCarry,
      kind: 'carry',
      why: 'نَسِيتَ الحَمْل: إِذَا زَادَتِ المَنْزِلَةُ عَنْ 9 فَاحْمِلْ 1 إِلَى المَنْزِلَةِ الَّتِي عَلَى يَسَارِهَا.',
    });
  }

  // 4) نسيان جزء كامل
  if (nonZero.length > 1) {
    const s = nonZero[ri(rng, 0, nonZero.length - 1)];
    candidates.push({
      value: answer - s.value,
      kind: 'missed',
      why: `نَسِيتَ الجُزْءَ ${s.a} × ${s.b}. اضْرِبْ كُلَّ رَقْمٍ فِي كُلِّ رَقْم.`,
    });
  }

  // 5) قلب رقمَي الناتج
  const swappable = nonZero.filter((s) => s.product >= 10 && Math.floor(s.product / 10) !== s.product % 10);
  if (swappable.length) {
    const s = swappable[ri(rng, 0, swappable.length - 1)];
    const sw = (s.product % 10) * 10 + Math.floor(s.product / 10);
    candidates.push({
      value: answer - s.value + sw * 10 ** s.onesRod,
      kind: 'swap',
      why: `قَلَبْتَ رَقْمَيِ النَّاتِجِ: ${s.a}×${s.b} = ${s.product} (العَشَرَاتُ أَوَّلاً ثُمَّ الآحَاد).`,
    });
  }

  // اختيار خيارين فريدين وصالحين
  const picked: MulOption[] = [];
  const seen = new Set<number>([answer]);
  for (const c of shuffle(candidates, rng)) {
    if (c.value > 0 && !seen.has(c.value)) {
      picked.push(c);
      seen.add(c.value);
    }
    if (picked.length === 2) break;
  }

  // احتياط: قيم قريبة إن لم تتوفر أخطاء كافية
  let step = 10;
  while (picked.length < 2) {
    for (const v of [answer + step, answer - step]) {
      if (picked.length < 2 && v > 0 && !seen.has(v)) {
        picked.push({ value: v, kind: 'near', why: 'قَرِيبٌ مِنَ الصَّحِيح! أَعِدْ جَمْعَ الأَجْزَاءِ بِتَأَنٍّ.' });
        seen.add(v);
      }
    }
    step = step === 10 ? 1 : step * 10;
  }
  return picked;
}

// ═══ توليد مسألة ═══
let counter = 0;

export function generateMulProblem(level: MulLevel, rng: Rng = Math.random): MulProblem {
  const cfg = LEVELS[level];
  const allowZero = level >= 3;
  const a = randNum(rng, cfg.aDigits, allowZero);
  const b = randNum(rng, cfg.bDigits, false);

  const steps = traceMultiplication(a, b);
  const answer = a * b;
  const wrong = buildWrongOptions(a, b, steps, answer, rng);

  const correct: MulOption = { value: answer, kind: 'correct', why: 'أَحْسَنْتَ! جَمَعْتَ الأَجْزَاءَ فِي مَنَازِلِهَا الصَّحِيحَة.' };
  const options = shuffle([correct, ...wrong], rng);

  return {
    id: `mul-${level}-${++counter}`,
    level, a, b,
    expression: `${a} × ${b} = ؟`,
    answer, steps, options,
    correctIndex: options.indexOf(correct),
    timeSec: cfg.time,
  };
}

/** وقت المسألة بعد التكيّف: خطأان متتاليان +2 ث · 4 صحيحات متتالية −1 ث (لا أقل من 6) */
export function adaptiveTime(base: number, wrongStreak: number, rightStreak: number): number {
  let t = base;
  if (wrongStreak >= 2) t += 2;
  if (rightStreak >= 4) t -= 1;
  return Math.max(6, t);
}
