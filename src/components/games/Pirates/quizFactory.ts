// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/quizFactory.ts
// ═══════════════════════════════════════════════════════════════════
//
// نقطة الدخول الوحيدة للّعبة: تختار العملية وتولّد المسألة.
//   0 – 25 ث   : ضرب فقط (إحماء)
//   25 – 55 ث  : قسمة بنسبة 35%
//   55 – 90 ث  : قسمة بنسبة 50% (العاصفة)
// ═══════════════════════════════════════════════════════════════════

import { generateMulProblem, type MulLevel } from './mulEngine';
import { generateDivProblem } from './divEngine';
import { mulToQuiz, type QuizOp, type QuizProblem } from './quizTypes';

export function pickOp(elapsedSec: number, rng: () => number = Math.random): QuizOp {
  if (elapsedSec < 25) return 'mul';
  const pDiv = elapsedSec < 55 ? 0.35 : 0.5;
  return rng() < pDiv ? 'div' : 'mul';
}

export function generateQuiz(op: QuizOp, level: MulLevel, rng: () => number = Math.random): QuizProblem {
  return op === 'div'
    ? generateDivProblem(level, rng)
    : mulToQuiz(generateMulProblem(level, rng));
}
