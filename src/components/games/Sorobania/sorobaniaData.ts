// ═══════════════════════════════════════════════════════════════════
// src/components/games/Sorobania/sorobaniaData.ts
// 🗂️ بيانات اللعبة — لا يحتوي واجهة ولا React
// ═══════════════════════════════════════════════════════════════════
// الدور: كل ما هو "معلومة" وليس "شكلاً":
//   • الثوابت (معرّفات الألعاب، الوقت، عدد المشاعل، حدّ فتح الجذور)
//   • الأنواع (Question · StageDef · Progress · Run · Result ...)
//   • أدوات صغيرة (shuffle · rnd · getLocalChildName)
//   • المراحل الثماني STAGES وقواعد الفتح والقفل
//   • توليد الأسئلة والمشتّتات (buildDeck)
//   • حفظ/تحميل التقدّم من localStorage
//
// يستورده: SorobaniaGame · SorobaniaScenes · SorobaniaUI
// يعتمد على: لا شيء (عدا النوع CharacterType)
//
// متى تعدّله؟ لإضافة مرحلة · تغيير أرقام الأسئلة · تعديل زمن/حيوات.
// ═══════════════════════════════════════════════════════════════════

import type { CharacterType } from '@/types';
import { useProgressStore } from '@/store/progressStore';

// ═══════════════════════════════════════════════════════════════════
// ثوابت
// ═══════════════════════════════════════════════════════════════════

export const GAME_ID = 'sorobania-island'; // رقم قياسي: أطول سلسلة
export const SPEED_GAME_ID = 'sorobania-island-speed'; // رقم قياسي: نقاط السرعة
export const HERO_ID: CharacterType = 'bana';
export const PROGRESS_KEY = 'sorobania_progress_v2';
export const LEGACY_KEY = 'sorobania_progress_v1';
export const MUTE_KEY = 'sorobania_muted';
export const QUESTIONS_PER_STAGE = 8;
export const MAX_TORCHES = 4;
export const ROOTS_UNLOCK_AT = 10;
export const SQUARE_TIME = 10;
export const ROOT_TIME = 15;

export const CHEERS = ['أحسنت!', 'ممتاز!', 'عبقري!', 'رائع جداً!', 'مذهل!'];
export const OOPS = ['لا بأس، انظر للجواب وتعلّم!', 'قريب! ركّز في السؤال القادم.', 'كل بطل يخطئ، أكمل!'];

// ═══════════════════════════════════════════════════════════════════
// أنواع
// ═══════════════════════════════════════════════════════════════════

export type Track = 'squares' | 'roots';
export type LessonId = 'five' | 'pairs';
export type Screen = 'map' | 'lesson' | 'play' | 'win' | 'lose';
export type Feedback = 'right' | 'wrong' | 'timeout' | null;

export interface SquareQ {
  kind: 'squares';
  id: string;
  num: number;
  ans: number;
  options: number[];
}

export interface RootQ {
  kind: 'roots';
  id: string;
  val: number;
  ans: number;
  pair1: string;
  pair2: string;
}

export type Question = SquareQ | RootQ;

export interface StageDef {
  id: string;
  track: Track;
  symbol: string;
  name: string;
  blurb: string;
  pool: number[]; // للمربعات: الأعداد · للجذور: الإجابات (الجذور)
  node: { x: number; y: number };
  sky: [string, string, string];
  accent: string;
  lesson?: LessonId;
}

export interface Progress {
  squaresCorrect: number;
  stars: Record<string, number>;
  seen: Record<string, boolean>;
  bestStreak: number;
  bestSpeedSec: number | null;
}

export interface Run {
  stage: StageDef;
  deck: Question[];
  index: number;
  torches: number;
  mistakes: number;
  correct: number;
  times: number[];
  feedback: Feedback;
  picked: number | null;
  input: string;
  relit: boolean;
}

export interface Result {
  won: boolean;
  stageId: string;
  stars: number;
  correct: number;
  total: number;
  avgSec: number | null;
  speedPts: number;
  newSpeed: boolean;
  newStreak: boolean;
  streakBest: number;
  unlockedStage: StageDef | null;
  rootsUnlocked: boolean;
}

export interface BurstState {
  key: number;
  colors: string[];
  count: number;
  radius: number;
}

// ═══════════════════════════════════════════════════════════════════
// أدوات صغيرة
// ═══════════════════════════════════════════════════════════════════

export const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);

export const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// رقم شبه عشوائي ثابت (لا يتغير بين إعادات الرسم)
export const rnd = (i: number, k: number): number => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getLocalChildName = (): string => {
  try {
    return useProgressStore.getState().childName?.trim() || 'بطل';
  } catch {
    return 'بطل';
  }
};

// ═══════════════════════════════════════════════════════════════════
// المراحل (مناطق الجزيرة)
// ═══════════════════════════════════════════════════════════════════

export const ROOT_R1 = [10, 12, 15, 16, 20, 21, 25, 28, 30];
export const ROOT_R2 = [32, 35, 39, 40, 43, 45, 50, 54];
export const ROOT_R3 = [58, 60, 63, 65, 70, 72, 80, 85, 90, 99];

export const STAGES: StageDef[] = [
  {
    id: 's1',
    track: 'squares',
    symbol: 'x²',
    name: 'شاطئ الأصداف',
    blurb: 'مربعات الأعداد من 1 إلى 9',
    pool: range(1, 9),
    node: { x: 70, y: 365 },
    sky: ['#2a1b5e', '#d9608a', '#ffb36b'],
    accent: '#ffcf5a',
  },
  {
    id: 's2',
    track: 'squares',
    symbol: 'x²',
    name: 'غابة المشاعل',
    blurb: 'مربعات الأعداد من 10 إلى 15',
    pool: range(10, 15),
    node: { x: 125, y: 300 },
    sky: ['#0f2a3d', '#1f6b64', '#7fd1a1'],
    accent: '#8cf2b4',
  },
  {
    id: 's3',
    track: 'squares',
    symbol: 'x²',
    name: 'الجسر الحجري',
    blurb: 'مربعات الأعداد من 16 إلى 25',
    pool: range(16, 25),
    node: { x: 75, y: 230 },
    sky: ['#1b1440', '#4a3a8f', '#e58fb0'],
    accent: '#ffd166',
  },
  {
    id: 's4',
    track: 'squares',
    symbol: 'x²',
    name: 'بوابة الخمسات',
    blurb: 'الأعداد التي تنتهي بـ 5 — ولها سرّ',
    pool: [15, 25, 35, 45, 55, 65, 75, 85, 95],
    node: { x: 135, y: 165 },
    sky: ['#2d0f3a', '#8a2f6f', '#ff9a5a'],
    accent: '#ffb347',
    lesson: 'five',
  },
  {
    id: 's5',
    track: 'squares',
    symbol: 'x²',
    name: 'قمة المعبد',
    blurb: 'كل المربعات معاً',
    pool: [...range(1, 25), 35, 45, 55, 65, 75, 85, 95],
    node: { x: 185, y: 118 },
    sky: ['#0b0830', '#3b2a8c', '#ff7a59'],
    accent: '#ffe08a',
  },
  {
    id: 'r1',
    track: 'roots',
    symbol: '√',
    name: 'كهف الجذور',
    blurb: 'جذور تربيعية حتى 900',
    pool: ROOT_R1,
    node: { x: 290, y: 340 },
    sky: ['#06202b', '#0e5a6b', '#37d0c0'],
    accent: '#6df0e0',
    lesson: 'pairs',
  },
  {
    id: 'r2',
    track: 'roots',
    symbol: '√',
    name: 'نبع الأزواج',
    blurb: 'جذور من 1024 إلى 2916',
    pool: ROOT_R2,
    node: { x: 245, y: 265 },
    sky: ['#0a1f3d', '#1e5aa8', '#7fb8ff'],
    accent: '#9ad0ff',
  },
  {
    id: 'r3',
    track: 'roots',
    symbol: '√',
    name: 'قلب المعبد',
    blurb: 'الجذور الكبيرة — أصعب مرحلة',
    pool: ROOT_R3,
    node: { x: 300, y: 190 },
    sky: ['#12062e', '#5a1f9e', '#ff6ad5'],
    accent: '#ff9af0',
  },
];

export const nextStageOf = (stage: StageDef): StageDef | null => {
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const next = STAGES[idx + 1];
  return next && next.track === stage.track ? next : null;
};

export const isUnlocked = (stage: StageDef, p: Progress): boolean => {
  if (stage.id === 's1') return true;
  if (stage.id === 'r1') return p.squaresCorrect >= ROOTS_UNLOCK_AT;
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const prev = STAGES[idx - 1];
  return !!prev && (p.stars[prev.id] ?? 0) >= 1;
};

export const lockReason = (stage: StageDef, p: Progress): string => {
  if (stage.id === 'r1') {
    return `أجب ${ROOTS_UNLOCK_AT} إجابات صحيحة في المربعات لتفتح الجذور (${Math.min(p.squaresCorrect, ROOTS_UNLOCK_AT)}/${ROOTS_UNLOCK_AT})`;
  }
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const prev = STAGES[idx - 1];
  return prev ? `أنهِ «${prev.name}» أولاً لتفتح هذه المنطقة` : 'منطقة مغلقة';
};

export const suggestStage = (p: Progress): string => {
  const open = STAGES.find((s) => isUnlocked(s, p) && (p.stars[s.id] ?? 0) === 0);
  return open ? open.id : STAGES[STAGES.length - 1].id;
};

// ═══════════════════════════════════════════════════════════════════
// الأسئلة
// ═══════════════════════════════════════════════════════════════════

export const makeSquareOptions = (num: number): number[] => {
  const ans = num * num;
  const cands: number[] = [];
  if (num > 1) cands.push((num - 1) * (num - 1));
  cands.push((num + 1) * (num + 1));
  cands.push(num * 2);
  cands.push(ans + 10, ans - 10);
  cands.push(num * (num + 1), num * (num - 1));
  if (num >= 15 && num % 10 === 5) {
    const t = Math.floor(num / 10);
    cands.push(t * t * 100 + 25, (t + 1) * (t + 1) * 100 + 25, ans - 100, ans + 100);
  }
  cands.push(Number(String(ans).split('').reverse().join('')));

  const unique = Array.from(new Set(cands)).filter((v) => v > 0 && v !== ans);
  const chosen = shuffle(unique).slice(0, 2);
  let filler = 7;
  while (chosen.length < 2) {
    const v = ans + filler;
    if (!chosen.includes(v)) chosen.push(v);
    filler += 7;
  }
  return shuffle([ans, ...chosen]);
};

export const makeRootQuestion = (ans: number, i: number): RootQ => {
  const val = ans * ans;
  const s = String(val);
  return {
    kind: 'roots',
    id: `r-${ans}-${i}`,
    val,
    ans,
    pair1: s.slice(0, -2),
    pair2: s.slice(-2),
  };
};

export const buildDeck = (stage: StageDef): Question[] => {
  const picks: number[] = [];
  let bag: number[] = [];
  while (picks.length < QUESTIONS_PER_STAGE) {
    if (bag.length === 0) {
      bag = shuffle(stage.pool);
      if (picks.length > 0 && bag.length > 1 && bag[0] === picks[picks.length - 1]) {
        bag.push(bag.shift() as number);
      }
    }
    picks.push(bag.shift() as number);
  }
  return picks.map((n, i): Question =>
    stage.track === 'squares'
      ? { kind: 'squares', id: `s-${n}-${i}`, num: n, ans: n * n, options: makeSquareOptions(n) }
      : makeRootQuestion(n, i),
  );
};

// ═══════════════════════════════════════════════════════════════════
// التقدّم المحفوظ
// ═══════════════════════════════════════════════════════════════════

export const freshProgress = (): Progress => ({
  squaresCorrect: 0,
  stars: {},
  seen: {},
  bestStreak: 0,
  bestSpeedSec: null,
});

export const loadProgress = (): Progress => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Progress>;
      return {
        squaresCorrect: Number(p.squaresCorrect) || 0,
        stars: p.stars && typeof p.stars === 'object' ? p.stars : {},
        seen: p.seen && typeof p.seen === 'object' ? p.seen : {},
        bestStreak: Number(p.bestStreak) || 0,
        bestSpeedSec: typeof p.bestSpeedSec === 'number' ? p.bestSpeedSec : null,
      };
    }
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return { ...freshProgress(), squaresCorrect: Number(legacy) || 0 };
  } catch {
    // تجاهل
  }
  return freshProgress();
};