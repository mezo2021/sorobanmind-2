// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/quizTypes.ts
// ═══════════════════════════════════════════════════════════════════
//
// الأنواع المشتركة بين محرّك الضرب ومحرّك القسمة.
// اللعبة تتعامل مع QuizProblem فقط، ولا تعرف أيّ محرّك أنتجه.
// ═══════════════════════════════════════════════════════════════════

import type { MulProblem } from './mulEngine';

export type QuizOp = 'mul' | 'div';

/** شريحة تحت عمود: ما يُكتب أو يُطرح في هذه الخطوة */
export interface AuxChip { rod: number; text: string; dim?: boolean }

/** المعداد الثاني (المقسوم) في القسمة */
export interface AuxView {
  value: number;       // قيمة المقسوم المعروضة بعد الخطوة
  rods: number[];      // الأعمدة المضاءة (0 = آحاد)
  chips: AuxChip[];
  arcText?: string;
}

export type StepPhase = 'partial' | 'divide' | 'subtract' | 'zero';

/** خطوة عرض على المعداد (الجسر التعليمي) */
export interface QuizStep {
  text: string;        // شرح الخطوة كاملاً
  formula?: string;    // صيغة قصيرة للقائمة: "4 × 7 = 28"
  running: number;     // قيمة المعداد الرئيسي (الناتج) بعد الخطوة
  rods: number[];      // الأعمدة المضاءة، مرقّمة من اليمين (0 = آحاد)
  arc?: number;        // (للتوافق) الناتج الجزئي
  arcText?: string;    // نص تحت المعداد الرئيسي: "4×7 = 28"
  add?: { rod: number; digit: number }[];  // ما يُكتب على كل منزلة (0 = آحاد)
  phase?: StepPhase;   // نوع الخطوة (للقسمة: divide ثم subtract)
  aux?: AuxView;       // معداد المقسوم (القسمة فقط)
  tbl?: [number, number];  // الجدول المطلوب تذكّره (لنموذج الزمن)
  big?: boolean;       // مقسوم جزئي من رقمين (لنموذج الزمن)
}

/** سبب الخطأ + موضعه (يمرّره اللعب للجسر التعليمي) */
export interface ReviewInfo {
  kind: string;                 // نوع الخطأ أو 'timeout'
  why: string;
  wrongValue: number | null;
  stepIndex?: number;
}

export interface QuizOption {
  value: number;
  kind: string;      // 'correct' | 'shift' | 'padding' | 'carry' | 'missed' | 'swap' | 'estimate' | 'bringdown' | 'near'
  why: string;
  stepIndex?: number;
}

export interface QuizProblem {
  id: string;
  op: QuizOp;
  symbol: '×' | '÷';
  level: 1 | 2 | 3 | 4;
  a: number;
  b: number;
  answer: number;
  steps: QuizStep[];
  options: QuizOption[];
  correctIndex: number;
  timeSec: number;
}

/** يحوّل مسألة mulEngine إلى الشكل المشترك (بلا لمس المحرّك) */
export function mulToQuiz(p: MulProblem): QuizProblem {
  return {
    id: p.id,
    op: 'mul',
    symbol: '×',
    level: p.level,
    a: p.a,
    b: p.b,
    answer: p.answer,
    steps: p.steps.map((s) => ({
      text: s.text,
      formula: `${s.a} × ${s.b} = ${s.product}`,
      running: s.running,
      rods: [s.onesRod, s.tensRod],
      arc: s.product,
      phase: 'partial' as const,
      tbl: [s.a, s.b] as [number, number],
      arcText: `${s.a}×${s.b} = ${s.product < 10 ? '0' : ''}${s.product}`,
      // ناتج رقمين يشغل منزلتين دائماً (العشرات ثم الآحاد) · الصفر يُكتب
      add: [
        { rod: s.tensRod, digit: Math.floor(s.product / 10) },
        { rod: s.onesRod, digit: s.product % 10 },
      ],
    })),
    options: p.options,
    correctIndex: p.correctIndex,
    timeSec: p.timeSec,
  };
}

/**
 * المنازل التي يصلها «حمل» عند إضافة أرقام جديدة (فهرس من اليسار).
 * prevDigits: أرقام المعداد قبل الخطوة (يسار → يمين).
 */
export function carriesFor(prevDigits: number[], adds: { rod: number; digit: number }[]): number[] {
  const n = prevDigits.length;
  const sums = [...prevDigits];
  for (const a of adds) {
    const i = n - 1 - a.rod;
    if (i >= 0) sums[i] += a.digit;
  }
  const out: number[] = [];
  for (let i = n - 1; i > 0; i--) {
    if (sums[i] >= 10) {
      sums[i] -= 10;
      sums[i - 1] += 1;
      out.push(i - 1);
    }
  }
  return out;
}
