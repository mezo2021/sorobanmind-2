// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/timeModel.ts
// ═══════════════════════════════════════════════════════════════════
//
// زمن المسألة = زمن العمل الذهني المطلوب لخطواتها (لا رقم ثابت للمستوى).
//
//   الزمن = (قراءة + اختيار) + مجموع تكلفة الخطوات  ×  معامل الطفل
//
// تكلفة الخطوات (ثوانٍ):
//   القراءة والاختيار من 3 خيارات ........ 3.0
//   تذكّر ناتج جدول (x × y):
//       أحد العاملين ≤ 2 أو = 5 ......... 1.1   (جداول سهلة)
//       العاملان ≥ 6 ................... 2.0   (جداول صعبة)
//       غير ذلك ........................ 1.5
//   الضرب:  كل جزء بعد الأول يُجمع ....... +1.0
//           كل حمل ........................ +1.0
//   القسمة: تقدير رقم القسمة ............. 1.2 (+0.5 لمقسوم جزئي من رقمين)
//           + تذكّر الجدول (q × القاسم)
//           الطرح ......................... 0.8
//           رقم قسمة = 0 ................. 0.7
//
// معامل الطفل 1.25 · الحد الأدنى 7 ث · الأقصى 22 ث.
// adaptiveTime في mulEngine يضيف +2 بعد خطأين و −1 بعد 4 صحيحات (لا أقل من 6).
// ═══════════════════════════════════════════════════════════════════

import { rodsFromNumber } from './mulEngine';
import { carriesFor, type QuizProblem } from './quizTypes';

const BASE = 3.0;
const CHILD_FACTOR = 1.25;
const MIN_SEC = 7;
const MAX_SEC = 22;

function tableCost(x: number, y: number): number {
  const lo = Math.min(x, y);
  if (lo <= 2 || x === 5 || y === 5) return 1.1;
  if (lo >= 6) return 2.0;
  return 1.5;
}

/** الزمن الخام بالثواني قبل معامل الطفل */
export function rawWorkSeconds(p: QuizProblem): number {
  let t = BASE;
  let prev = 0;

  p.steps.forEach((st, i) => {
    switch (st.phase) {
      case 'partial': {
        if (st.tbl) t += tableCost(st.tbl[0], st.tbl[1]);
        if (i > 0) t += 1.0;
        if (st.add) t += carriesFor(rodsFromNumber(prev, 5), st.add).length * 1.0;
        break;
      }
      case 'divide':
        t += 1.2 + (st.big ? 0.5 : 0) + (st.tbl ? tableCost(st.tbl[0], st.tbl[1]) : 0);
        break;
      case 'subtract':
        t += 0.8;
        break;
      case 'zero':
        t += 0.7;
        break;
      default:
        break;
    }
    prev = st.running;
  });
  return t;
}

export function estimateSeconds(p: QuizProblem): number {
  const s = Math.ceil(rawWorkSeconds(p) * CHILD_FACTOR);
  return Math.max(MIN_SEC, Math.min(MAX_SEC, s));
}
