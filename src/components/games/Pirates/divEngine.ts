// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/divEngine.ts
// ═══════════════════════════════════════════════════════════════════
//
// محرّك قسمة السوروبان (قسمة طويلة بالمنازل · قسمة تامة بلا باقي)
//
// القواعد المطبّقة:
//   1) نقسم من اليسار (أعلى منزلة). نأخذ من المقسوم أقل عدد من الأرقام
//      يتّسع للقاسم (المقسوم الجزئي).
//   2) رقم القسمة يُكتب في منزلة آخر رقم أُخذ من المقسوم الجزئي.
//   3) رقم القسمة × القاسم يُطرح من المقسوم الجزئي، والباقي أصغر من القاسم.
//   4) نُنزل الرقم التالي. إن لم يتّسع للقاسم نكتب 0 في تلك المنزلة.
//
// الخيارات الخاطئة = أخطاء الأطفال الحقيقية في القسمة:
//   padding (إسقاط الصفر) · shift (منزلة خاطئة) · estimate (تقدير الرقم)
//   bringdown (نسيان إنزال رقم) · swap (قلب رقمين)
//
// يُنتج QuizProblem مباشرة (نفس شكل مسائل الضرب بعد mulToQuiz).
// ═══════════════════════════════════════════════════════════════════

import type { QuizOption, QuizProblem, QuizStep } from './quizTypes';

export type DivLevel = 1 | 2 | 3 | 4;
type Rng = () => number;

const TIME: Record<DivLevel, number> = { 1: 8, 2: 10, 3: 12, 4: 14 };

const ROD_NAMES = ['الآحَاد', 'العَشَرَات', 'المِئَات', 'الأُلُوف', 'عَشَرَاتِ الأُلُوف'];
const rodName = (i: number) => ROD_NAMES[i] ?? `المَنْزِلَة ${i + 1}`;
const pad2 = (p: number) => (p < 10 ? `0${p}` : String(p));
const ri = (rng: Rng, lo: number, hi: number) => lo + Math.floor(rng() * (hi - lo + 1));

function shuffle<T>(arr: T[], rng: Rng): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ═══ تتبّع القسمة ═══
export interface DivTraceStep {
  q: number;          // رقم القسمة في هذه الخطوة (قد يكون 0)
  pos: number;        // منزلته (0 = آحاد)
  partial: number;    // المقسوم الجزئي
  product: number;    // q × القاسم
  remainder: number;  // الباقي بعد الطرح
  running: number;    // القسمة المكتوبة حتى الآن
  text: string;
}

export function traceDivision(a: number, b: number): DivTraceStep[] {
  const s = String(a);
  const out: DivTraceStep[] = [];
  let rem = 0;
  let started = false;
  let running = 0;

  for (let i = 0; i < s.length; i++) {
    const pos = s.length - 1 - i;
    const partial = rem * 10 + Number(s[i]);
    const q = Math.floor(partial / b);

    if (!started && q === 0) { rem = partial; continue; }   // أرقام البداية: نأخذ رقماً آخر
    started = true;

    const product = q * b;
    const remainder = partial - product;
    running += q * 10 ** pos;

    let text: string;
    if (q === 0) {
      text = `${partial} أَصْغَرُ مِنْ ${b} ← اكْتُبْ 0 عَلَى ${rodName(pos)} ثُمَّ أَنْزِلِ الرَّقْمَ التَّالِي`;
    } else {
      const take = out.length === 0 && partial >= 10 ? `نَأْخُذُ ${partial}: ` : '';
      text = `${take}${partial} ÷ ${b} = ${q} ← اكْتُبْ ${q} عَلَى ${rodName(pos)} · ${q}×${b} = ${pad2(product)} · البَاقِي ${remainder}`;
    }
    out.push({ q, pos, partial, product, remainder, running, text });
    rem = remainder;
  }
  return out;
}

/** يركّب عدداً من أرقام القسمة (متتالية) */
const fromDigits = (d: number[]) => (d.length ? Number(d.join('')) : 0);

// ═══ الأخطاء الحقيقية → خيارات خاطئة ═══
function buildWrongOptions(b: number, trace: DivTraceStep[], answer: number, rng: Rng): QuizOption[] {
  const cands: QuizOption[] = [];
  const digits = trace.map((t) => t.q);
  const nonZero = trace.map((t, i) => ({ t, i })).filter((x) => x.t.q > 0);

  // 1) إسقاط صفر داخل القسمة
  trace.forEach((t, i) => {
    if (t.q === 0) {
      cands.push({
        value: fromDigits(digits.filter((_, k) => k !== i)),
        kind: 'padding',
        stepIndex: i,
        why: `الجُزْءُ ${t.partial} لَا يَتَّسِعُ لِلقَاسِمِ ${b}: اكْتُبْ 0 فِي ${rodName(t.pos)} وَلَا تَتَخَطَّ المَنْزِلَة.`,
      });
    }
  });

  // 2) رقم في منزلة خاطئة · أو القسمة كلها بإزاحة منزلة
  if (nonZero.length) {
    const { t, i } = nonZero[ri(rng, 0, nonZero.length - 1)];
    const newPos = t.pos === 0 || rng() < 0.5 ? t.pos + 1 : t.pos - 1;
    cands.push({
      value: answer - t.q * 10 ** t.pos + t.q * 10 ** newPos,
      kind: 'shift',
      stepIndex: i,
      why: `مَنْزِلَةُ رَقْمِ القِسْمَةِ = مَنْزِلَةُ آخِرِ رَقْمٍ فِي الجُزْءِ المَقْسُوم (${rodName(t.pos)}).`,
    });
  }
  if (answer * 10 <= 99999) {
    cands.push({
      value: answer * 10,
      kind: 'shift',
      stepIndex: 0,
      why: 'أَوَّلُ رَقْمٍ فِي القِسْمَةِ يُكْتَبُ فِي مَنْزِلَةِ آخِرِ رَقْمٍ أَخَذْتَهُ مِنَ المَقْسُوم، لَا أَعْلَى.',
    });
  }

  // 3) تقدير الرقم (أكبر أو أصغر بواحد)
  if (nonZero.length) {
    const { t, i } = nonZero[ri(rng, 0, nonZero.length - 1)];
    const up = t.q < 9 && rng() < 0.5;
    cands.push({
      value: answer + (up ? 1 : -1) * 10 ** t.pos,
      kind: 'estimate',
      stepIndex: i,
      why: up
        ? `${t.q + 1}×${b} أَكْبَرُ مِنَ ${t.partial}، فَلَا يَصِحُّ. أَكْبَرُ رَقْمٍ يَصِحُّ هُوَ ${t.q}.`
        : `بَعْدَ الطَّرْحِ يَجِبُ أَنْ يَكُونَ البَاقِي أَصْغَرَ مِنَ ${b}. جَرِّبْ ${t.q}×${b} = ${pad2(t.product)}.`,
    });
  }

  // 4) نسيان إنزال رقم
  if (nonZero.length > 1) {
    const { i } = nonZero[ri(rng, 0, nonZero.length - 1)];
    cands.push({
      value: fromDigits(digits.filter((_, k) => k !== i)),
      kind: 'bringdown',
      stepIndex: i,
      why: 'نَسِيتَ إِنْزَالَ رَقْمٍ: كُلُّ رَقْمٍ يُنْزَلُ مِنَ المَقْسُومِ يُعْطِي رَقْماً فِي القِسْمَة.',
    });
  }

  // 5) قلب رقمين متجاورين
  const swapAt = digits
    .map((_, k) => k)
    .filter((k) => k < digits.length - 1 && digits[k] !== digits[k + 1]);
  if (swapAt.length) {
    const k = swapAt[ri(rng, 0, swapAt.length - 1)];
    const d = [...digits];
    [d[k], d[k + 1]] = [d[k + 1], d[k]];
    cands.push({
      value: fromDigits(d),
      kind: 'swap',
      stepIndex: k,
      why: `قَلَبْتَ رَقْمَيْنِ: القِسْمَةُ تُكْتَبُ مِنَ الأَعْلَى مَنْزِلَةً إِلَى الأَدْنَى (${digits[k]} ثُمَّ ${digits[k + 1]}).`,
    });
  }

  // اختيار خيارين: نوعان مختلفان أولاً
  const picked: QuizOption[] = [];
  const seen = new Set<number>([answer]);
  const usedKinds = new Set<string>();
  // الصفر الداخلي هو الدرس الأهم: إن وُجد فهو دائماً أحد الخيارين الخاطئين
  const pool = shuffle(cands, rng)
    .filter((c) => c.value > 0)
    .sort((x, y) => Number(y.kind === 'padding') - Number(x.kind === 'padding'));

  for (const c of pool) {
    if (picked.length < 2 && !seen.has(c.value) && !usedKinds.has(c.kind)) {
      picked.push(c); seen.add(c.value); usedKinds.add(c.kind);
    }
  }
  for (const c of pool) {
    if (picked.length < 2 && !seen.has(c.value)) { picked.push(c); seen.add(c.value); }
  }

  // احتياط: قيم قريبة
  let step = 1;
  while (picked.length < 2) {
    for (const v of [answer + step, answer - step]) {
      if (picked.length < 2 && v > 0 && !seen.has(v)) {
        picked.push({ value: v, kind: 'near', why: 'قَرِيبٌ مِنَ الصَّحِيح! أَعِدْ خُطُوَاتِ القِسْمَةِ بِتَأَنٍّ.' });
        seen.add(v);
      }
    }
    step = step === 1 ? 10 : step * 10;
  }
  return picked;
}

// ═══ توليد مسألة ═══
let counter = 0;

function randQuotient(level: DivLevel, rng: Rng): number {
  switch (level) {
    case 1: return ri(rng, 2, 9);
    case 2: return ri(rng, 1, 9) * 10 + ri(rng, 1, 9);
    case 3: return ri(rng, 1, 9) * 100 + ri(rng, 1, 9) * 10 + ri(rng, 1, 9);
    case 4: return ri(rng, 1, 9) * 100 + ri(rng, 1, 9);      // صفر في المنتصف: 203 · 508 ...
  }
}

export function generateDivProblem(level: DivLevel, rng: Rng = Math.random): QuizProblem {
  const b = ri(rng, 2, 9);
  const answer = randQuotient(level, rng);
  const a = answer * b;

  const trace = traceDivision(a, b);
  const wrong = buildWrongOptions(b, trace, answer, rng);

  const correct: QuizOption = {
    value: answer,
    kind: 'correct',
    why: 'أَحْسَنْتَ! كُلُّ رَقْمٍ فِي مَنْزِلَتِهِ الصَّحِيحَة.',
  };
  const options = shuffle([correct, ...wrong], rng);

  const steps: QuizStep[] = trace.map((t) => ({
    text: t.text,
    formula: t.q === 0 ? `${t.partial} < ${b} ← 0` : `${t.partial} ÷ ${b} = ${t.q}`,
    running: t.running,
    rods: [t.pos],
    arc: t.product,
    arcText: `${t.q}×${b} = ${pad2(t.product)}`,
    add: [{ rod: t.pos, digit: t.q }],
  }));

  return {
    id: `div-${level}-${++counter}`,
    op: 'div',
    symbol: '÷',
    level,
    a, b, answer,
    steps,
    options,
    correctIndex: options.indexOf(correct),
    timeSec: TIME[level],
  };
}
