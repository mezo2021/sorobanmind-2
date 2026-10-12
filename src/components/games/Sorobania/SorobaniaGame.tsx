// ═══════════════════════════════════════════════════════════════════
// 🏝️ src/components/games/Sorobania/SorobaniaGame.tsx — v3
// ═══════════════════════════════════════════════════════════════════
//
// 🔧 تعديلات v3 — بقلم المساعد الحالي · 2026-10-13
//   1. bestStreakRef.current = 0 في beginStage
//      (كانت تظهر سلسلة الجولة السابقة في نتيجة الجولة الجديدة)
//   2. ensureTicket تُرجع true مباشرة
//      (GamesListScreen يستهلك التذكرة عند الفتح · لا نكرر)
//   3. حذف استيرادات ميتة:
//      selectHasTicket · isPreviewMode · buyTicket · consumeTicket · ticketPaidRef
//
// ═══════════════════════════════════════════════════════════════════

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, Flame, Lock, RotateCcw, Trophy, Volume2, VolumeX, X } from 'lucide-react';

import { useProgressStore } from '@/store/progressStore';
import { GameCompanion } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import type { CharacterType } from '@/types';

interface SorobaniaGameProps {
  onBack: () => void;
}

// ═══════════════════════════════════════════════════════════════════
// ثوابت
// ═══════════════════════════════════════════════════════════════════

const GAME_ID = 'sorobania-island';
const SPEED_GAME_ID = 'sorobania-island-speed';
const HERO_ID: CharacterType = 'bana';
const PROGRESS_KEY = 'sorobania_progress_v2';
const LEGACY_KEY = 'sorobania_progress_v1';
const MUTE_KEY = 'sorobania_muted';
const QUESTIONS_PER_STAGE = 8;
const MAX_TORCHES = 4;
const ROOTS_UNLOCK_AT = 10;
const SQUARE_TIME = 10;
const ROOT_TIME = 15;

const CHEERS = ['أحسنت!', 'ممتاز!', 'عبقري!', 'رائع جداً!', 'مذهل!'];
const OOPS = ['لا بأس، انظر للجواب وتعلّم!', 'قريب! ركّز في السؤال القادم.', 'كل بطل يخطئ، أكمل!'];

// ═══════════════════════════════════════════════════════════════════
// أنواع
// ═══════════════════════════════════════════════════════════════════

type Track = 'squares' | 'roots';
type LessonId = 'five' | 'pairs';
type Screen = 'map' | 'lesson' | 'play' | 'win' | 'lose';
type Feedback = 'right' | 'wrong' | 'timeout' | null;

interface SquareQ {
  kind: 'squares';
  id: string;
  num: number;
  ans: number;
  options: number[];
}

interface RootQ {
  kind: 'roots';
  id: string;
  val: number;
  ans: number;
  pair1: string;
  pair2: string;
}

type Question = SquareQ | RootQ;

interface StageDef {
  id: string;
  track: Track;
  symbol: string;
  name: string;
  blurb: string;
  pool: number[];
  node: { x: number; y: number };
  sky: [string, string, string];
  accent: string;
  lesson?: LessonId;
}

interface Progress {
  squaresCorrect: number;
  stars: Record<string, number>;
  seen: Record<string, boolean>;
  bestStreak: number;
  bestSpeedSec: number | null;
}

interface Run {
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

interface Result {
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

interface BurstState {
  key: number;
  colors: string[];
  count: number;
  radius: number;
}

// ═══════════════════════════════════════════════════════════════════
// أدوات صغيرة
// ═══════════════════════════════════════════════════════════════════

const range = (a: number, b: number): number[] => Array.from({ length: b - a + 1 }, (_, i) => a + i);

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const rnd = (i: number, k: number): number => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getLocalChildName = (): string => {
  try {
    return localStorage.getItem('soroban_child_name')?.trim() || 'بطل';
  } catch {
    return 'بطل';
  }
};

// ═══════════════════════════════════════════════════════════════════
// الصوت — WebAudio بلا ملفات
// ═══════════════════════════════════════════════════════════════════

let audioCtx: AudioContext | null = null;
let soundOn = true;

const getCtx = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
};

interface ToneOpts {
  type?: OscillatorType;
  vol?: number;
  delay?: number;
  slideTo?: number;
}

const tone = (freq: number, dur: number, o: ToneOpts = {}) => {
  if (!soundOn) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + (o.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);
    const v = o.vol ?? 0.15;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(v, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  } catch {
    // تجاهل أخطاء الصوت
  }
};

const noise = (dur: number, vol: number, delay = 0) => {
  if (!soundOn) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime + delay);
  } catch {
    // تجاهل أخطاء الصوت
  }
};

const sfx = {
  click: () => tone(520, 0.06, { type: 'triangle', vol: 0.08 }),
  correct: (streak: number) => {
    const base = 520 + Math.min(streak, 8) * 28;
    tone(base, 0.12, { type: 'triangle', vol: 0.16 });
    tone(base * 1.25, 0.12, { type: 'triangle', vol: 0.16, delay: 0.09 });
    tone(base * 1.5, 0.22, { type: 'triangle', vol: 0.18, delay: 0.18 });
  },
  wrong: () => {
    tone(220, 0.3, { type: 'sawtooth', vol: 0.11, slideTo: 110 });
    noise(0.35, 0.09, 0.02);
  },
  tick: () => tone(880, 0.05, { type: 'square', vol: 0.05 }),
  relight: () => {
    noise(0.25, 0.07);
    [660, 880, 1175, 1568].forEach((f, i) => tone(f, 0.16, { type: 'sine', vol: 0.14, delay: 0.05 + i * 0.07 }));
  },
  star: (i: number) => {
    tone(700 + i * 180, 0.25, { type: 'triangle', vol: 0.2 });
    tone((700 + i * 180) * 2, 0.3, { type: 'sine', vol: 0.1, delay: 0.05 });
  },
  fanfare: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.18, delay: i * 0.13 }));
    tone(1047, 0.7, { type: 'triangle', vol: 0.2, delay: 0.55 });
    tone(1319, 0.7, { type: 'sine', vol: 0.12, delay: 0.55 });
  },
  lose: () => {
    [392, 330, 262, 196].forEach((f, i) => tone(f, 0.3, { type: 'sine', vol: 0.16, delay: i * 0.2 }));
    noise(0.5, 0.07, 0.6);
  },
  unlock: () => {
    [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.16, delay: i * 0.1 }));
  },
};

// ═══════════════════════════════════════════════════════════════════
// المراحل
// ═══════════════════════════════════════════════════════════════════

const ROOT_R1 = [10, 12, 15, 16, 20, 21, 25, 28, 30];
const ROOT_R2 = [32, 35, 39, 40, 43, 45, 50, 54];
const ROOT_R3 = [58, 60, 63, 65, 70, 72, 80, 85, 90, 99];

const STAGES: StageDef[] = [
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

const nextStageOf = (stage: StageDef): StageDef | null => {
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const next = STAGES[idx + 1];
  return next && next.track === stage.track ? next : null;
};

const isUnlocked = (stage: StageDef, p: Progress): boolean => {
  if (stage.id === 's1') return true;
  if (stage.id === 'r1') return p.squaresCorrect >= ROOTS_UNLOCK_AT;
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const prev = STAGES[idx - 1];
  return !!prev && (p.stars[prev.id] ?? 0) >= 1;
};

const lockReason = (stage: StageDef, p: Progress): string => {
  if (stage.id === 'r1') {
    return `أجب ${ROOTS_UNLOCK_AT} إجابات صحيحة في المربعات لتفتح الجذور (${Math.min(p.squaresCorrect, ROOTS_UNLOCK_AT)}/${ROOTS_UNLOCK_AT})`;
  }
  const idx = STAGES.findIndex((s) => s.id === stage.id);
  const prev = STAGES[idx - 1];
  return prev ? `أنهِ «${prev.name}» أولاً لتفتح هذه المنطقة` : 'منطقة مغلقة';
};

const suggestStage = (p: Progress): string => {
  const open = STAGES.find((s) => isUnlocked(s, p) && (p.stars[s.id] ?? 0) === 0);
  return open ? open.id : STAGES[STAGES.length - 1].id;
};

// ═══════════════════════════════════════════════════════════════════
// الأسئلة
// ═══════════════════════════════════════════════════════════════════

const makeSquareOptions = (num: number): number[] => {
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

const makeRootQuestion = (ans: number, i: number): RootQ => {
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

const buildDeck = (stage: StageDef): Question[] => {
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

const freshProgress = (): Progress => ({
  squaresCorrect: 0,
  stars: {},
  seen: {},
  bestStreak: 0,
  bestSpeedSec: null,
});

const loadProgress = (): Progress => {
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

// ═══════════════════════════════════════════════════════════════════
// رسوم SVG
// ═══════════════════════════════════════════════════════════════════

const STONES: Array<{ x: number; y: number }> = [
  { x: 70, y: 468 },
  { x: 125, y: 452 },
  { x: 190, y: 462 },
  { x: 245, y: 438 },
  { x: 215, y: 410 },
  { x: 150, y: 398 },
  { x: 100, y: 376 },
  { x: 145, y: 356 },
  { x: 180, y: 336 },
];

const TORCH_POS: Array<{ x: number; y: number }> = [
  { x: 62, y: 300 },
  { x: 298, y: 300 },
  { x: 30, y: 380 },
  { x: 330, y: 360 },
];

const WAVE_D = `M-40 0 q20 -6 40 0${' t40 0'.repeat(11)}`;

const Palm: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M0 0 Q4 -22 -2 -44" stroke="#5b3a22" strokeWidth="5" fill="none" strokeLinecap="round" />
    <g fill="#2f9e6a">
      <path d="M-2 -44 Q-22 -52 -34 -38 Q-18 -44 -2 -44Z" />
      <path d="M-2 -44 Q18 -56 34 -42 Q16 -46 -2 -44Z" />
      <path d="M-2 -44 Q-12 -62 -26 -64 Q-12 -56 -2 -44Z" />
      <path d="M-2 -44 Q10 -64 24 -64 Q10 -54 -2 -44Z" />
    </g>
  </g>
);

const TorchSvg: React.FC<{ x: number; y: number; lit: boolean; seed: number }> = ({ x, y, lit, seed }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-6} y={4} width={12} height={44} rx={3} fill="#6a5040" />
    <rect x={-6} y={4} width={4} height={44} rx={2} fill="#8a6a54" />
    <path d="M-13 -2 H13 L8 10 H-8 Z" fill={lit ? '#8a5a2a' : '#3a2a22'} />
    {lit ? (
      <>
        <motion.circle
          cx={0}
          cy={-18}
          r={34}
          fill="url(#p-torchGlow)"
          animate={{ opacity: [0.6, 1, 0.7] }}
          transition={{ duration: 1.1 + seed * 0.15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.g
          style={{ originX: 0.5, originY: 1 }}
          animate={{ scaleY: [1, 1.12, 0.94, 1.08, 1], scaleX: [1, 0.94, 1.04, 0.97, 1] }}
          transition={{ duration: 0.9 + seed * 0.13, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M0 -40 C10 -26 12 -14 7 -5 C4 0 -4 0 -7 -5 C-12 -14 -10 -26 0 -40Z" fill="#ff7a1a" />
          <path d="M0 -26 C5 -18 6 -11 3 -6 C1 -3 -1 -3 -3 -6 C-6 -11 -5 -18 0 -26Z" fill="#ffe27a" />
        </motion.g>
      </>
    ) : (
      <motion.circle
        cx={0}
        cy={-6}
        r={5}
        fill="#c9c3d6"
        initial={{ opacity: 0 }}
        animate={{ cy: [-6, -34], opacity: [0.5, 0], r: [4, 9] }}
        transition={{ duration: 2.2 + seed * 0.2, repeat: Infinity, ease: 'easeOut' }}
      />
    )}
  </g>
);

interface PlaySceneProps {
  stage: StageDef;
  pos: number;
  torches: number;
}

const PlayScene: React.FC<PlaySceneProps> = ({ stage, pos, torches }) => {
  const [c1, c2, c3] = stage.sky;
  const glow = Math.min(1, pos / 8);
  const stars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        x: rnd(i, 1) * 360,
        y: rnd(i, 2) * 200,
        r: 0.7 + rnd(i, 3) * 1.3,
        d: 1.6 + rnd(i, 4) * 2,
      })),
    [],
  );
  const lamp = STONES[Math.min(8, pos)];

  return (
    <svg
      viewBox="0 0 360 500"
      preserveAspectRatio="xMidYMax slice"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="مشهد معبد سوروبانيا"
    >
      <defs>
        <linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c1} />
          <stop offset="0.55" stopColor={c2} />
          <stop offset="1" stopColor={c3} />
        </linearGradient>
        <linearGradient id="p-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b3a6b" />
          <stop offset="1" stopColor="#0b1638" />
        </linearGradient>
        <radialGradient id="p-torchGlow">
          <stop offset="0" stopColor="#ffb02e" stopOpacity="0.6" />
          <stop offset="1" stopColor="#ffb02e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p-doorGlow">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="p-lampGlow">
          <stop offset="0" stopColor="#fff1b0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff1b0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="500" fill="url(#p-sky)" />
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#fff"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: s.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <circle cx="300" cy="70" r="36" fill="#fff3c4" opacity="0.12" />
      <circle cx="300" cy="70" r="22" fill="#fff3c4" opacity="0.92" />

      <path d="M0 330 L50 280 L95 318 L150 262 L210 322 L265 276 L320 316 L360 290 L360 350 L0 350 Z" fill="#000" opacity="0.28" />

      <rect y="344" width="360" height="156" fill="url(#p-sea)" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(0 ${372 + i * 34})`}>
          <motion.path
            d={WAVE_D}
            fill="none"
            stroke="#8fc2ff"
            strokeOpacity={0.16 + i * 0.03}
            strokeWidth="2"
            animate={{ x: [0, -40, 0] }}
            transition={{ duration: 6 + i * 1.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      ))}

      <ellipse cx="180" cy="342" rx="132" ry="16" fill="#241a33" />
      <ellipse cx="180" cy="337" rx="124" ry="13" fill="#4a3a5a" />
      <Palm x={92} y={338} s={1} />
      <Palm x={272} y={338} s={0.9} flip />

      <rect x="96" y="326" width="168" height="12" rx="3" fill="#9a7b55" />
      <rect x="124" y="262" width="112" height="64" fill="#c9a97d" />
      <rect x="128" y="262" width="10" height="64" fill="#a98a62" />
      <rect x="222" y="262" width="10" height="64" fill="#a98a62" />
      <rect x="116" y="252" width="128" height="12" rx="2" fill="#7a4b2a" />
      <path d="M132 252 L180 214 L228 252 Z" fill="#8a5a33" />
      <rect x="140" y="268" width="80" height="12" rx="3" fill="#4a2f1a" />
      {range(0, 7).map((i) => (
        <motion.circle
          key={i}
          cx={147 + i * 9.4}
          cy={274}
          r={3.4}
          fill={i < pos ? '#ffd45a' : '#7a5a3a'}
          animate={i < pos ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      ))}
      <path d="M164 326 V304 Q164 290 180 290 Q196 290 196 304 V326 Z" fill="#150b24" />
      <motion.path
        d="M164 326 V304 Q164 290 180 290 Q196 290 196 304 V326 Z"
        fill="#ffd45a"
        animate={{ opacity: 0.1 + glow * 0.9 }}
        transition={{ duration: 0.6 }}
      />
      <motion.circle
        cx="180"
        cy="312"
        r="52"
        fill="url(#p-doorGlow)"
        animate={{ opacity: glow }}
        transition={{ duration: 0.6 }}
      />

      {STONES.slice(0, 8).map((s, i) => {
        const done = i < pos;
        const here = i === pos;
        return (
          <g key={i}>
            <ellipse cx={s.x} cy={s.y + 7} rx={25} ry={10} fill="#000" opacity="0.3" />
            <ellipse cx={s.x} cy={s.y + 3} rx={24} ry={10} fill={done ? '#b5892f' : '#6b5a73'} />
            <ellipse cx={s.x} cy={s.y} rx={24} ry={10} fill={done ? '#ffd45a' : here ? '#e0d0ab' : '#9d8fa8'} />
            {done && (
              <motion.ellipse
                cx={s.x}
                cy={s.y}
                rx={31}
                ry={13}
                fill={stage.accent}
                animate={{ opacity: [0.35, 0.08, 0.35] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <text
              x={s.x}
              y={s.y + 3.5}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill={done ? '#6b4a10' : '#4a3c55'}
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      <rect width="360" height="500" fill="#05030f" opacity={(MAX_TORCHES - torches) * 0.08} />

      {TORCH_POS.map((t, k) => (
        <TorchSvg key={k} x={t.x} y={t.y} lit={k < torches} seed={k} />
      ))}

      <motion.g initial={false} animate={{ x: lamp.x, y: lamp.y - 22 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }}>
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}>
          <circle r="28" fill="url(#p-lampGlow)" />
          <path d="M-9 -2 Q-9 -12 0 -12 Q9 -12 9 -2 L7 9 H-7 Z" fill="#ffd45a" stroke="#b9791f" strokeWidth="1.5" />
          <rect x="-3" y="-17" width="6" height="5" rx="2" fill="#b9791f" />
          <circle cx="-3" cy="-2" r="1.6" fill="#3a2410" />
          <circle cx="3" cy="-2" r="1.6" fill="#3a2410" />
          <path d="M-3 3 Q0 6 3 3" stroke="#3a2410" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </motion.g>
      </motion.g>
    </svg>
  );
};

const starPoints = '12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,18 5.5,22 7.5,14.5 2,9.5 9,9';

const MapScene: React.FC<{
  progress: Progress;
  selectedId: string;
  onSelect: (id: string) => void;
}> = ({ progress, selectedId, onSelect }) => {
  const completed = STAGES.filter((s) => (progress.stars[s.id] ?? 0) > 0).length;
  const rootsOpen = progress.squaresCorrect >= ROOTS_UNLOCK_AT;

  return (
    <svg
      viewBox="0 0 360 470"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="خريطة جزيرة سوروبانيا"
    >
      <defs>
        <linearGradient id="m-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#120d36" />
          <stop offset="0.5" stopColor="#173a73" />
          <stop offset="1" stopColor="#0d5a78" />
        </linearGradient>
        <radialGradient id="m-glow">
          <stop offset="0" stopColor="#ffd45a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffd45a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="m-crystal">
          <stop offset="0" stopColor="#6df0e0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#6df0e0" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="360" height="470" fill="url(#m-bg)" />
      {Array.from({ length: 18 }, (_, i) => (
        <motion.circle
          key={i}
          cx={rnd(i, 11) * 360}
          cy={rnd(i, 12) * 90}
          r={0.8 + rnd(i, 13) * 1.2}
          fill="#fff"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2 + rnd(i, 14) * 2, repeat: Infinity }}
        />
      ))}

      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${430 + i * 14})`}>
          <motion.path
            d={WAVE_D}
            fill="none"
            stroke="#9fd2ff"
            strokeOpacity={0.2}
            strokeWidth="2"
            animate={{ x: [0, -40, 0] }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>
      ))}

      <path
        d="M40 380 C10 300 30 200 70 150 C100 90 150 60 200 55 C270 50 330 90 340 160 C350 240 330 330 300 390 C250 440 100 440 40 380 Z"
        fill="#e9d29a"
        opacity="0.55"
        transform="translate(0 6)"
      />
      <path
        d="M40 380 C10 300 30 200 70 150 C100 90 150 60 200 55 C270 50 330 90 340 160 C350 240 330 330 300 390 C250 440 100 440 40 380 Z"
        fill="#2f6b4f"
      />
      <path
        d="M62 370 C40 300 55 215 88 170 C115 120 155 90 200 85 C255 82 308 112 314 168 C320 235 305 315 280 365 C240 405 112 405 62 370 Z"
        fill="#3f8a5f"
      />

      <g fill="#245c43">
        {[
          [48, 300, 13],
          [38, 262, 10],
          [100, 345, 11],
          [180, 250, 12],
          [200, 300, 10],
          [215, 200, 11],
          [320, 280, 12],
          [255, 345, 10],
          [110, 120, 10],
          [250, 130, 11],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} />
        ))}
      </g>

      <path
        d="M70 365 C70 335 100 325 125 300 C150 275 75 262 75 230 C75 200 120 190 135 165 C145 148 165 140 185 118"
        fill="none"
        stroke="#f3dfae"
        strokeOpacity="0.7"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />
      <path
        d="M290 340 C290 310 260 295 245 265 C230 235 300 225 300 190 C300 170 300 160 300 150"
        fill="none"
        stroke="#bff5ee"
        strokeOpacity={rootsOpen ? 0.75 : 0.3}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="2 10"
      />

      <g transform="translate(180 62)">
        <ellipse cx="0" cy="28" rx="56" ry="8" fill="#000" opacity="0.25" />
        <rect x="-34" y="0" width="68" height="26" fill="#c9a97d" />
        <path d="M-44 0 L0 -36 L44 0 Z" fill="#8a5a33" />
        <rect x="-31" y="4" width="62" height="7" rx="2" fill="#4a2f1a" />
        {range(0, 7).map((i) => (
          <circle key={i} cx={-26 + i * 7.4} cy={7.5} r={2.4} fill={i < completed ? '#ffd45a' : '#7a5a3a'} />
        ))}
        <path d="M-7 26 V20 Q-7 15 0 15 Q7 15 7 20 V26 Z" fill={completed > 0 ? '#ffd45a' : '#150b24'} />
      </g>

      <g transform="translate(300 128)">
        <path d="M-26 22 V2 Q-26 -20 0 -20 Q26 -20 26 2 V22 Z" fill="#1a1236" />
        <g opacity={rootsOpen ? 1 : 0.35}>
          <circle r="32" cy="2" fill="url(#m-crystal)" />
          <path d="M-10 22 L-6 -2 L-2 22 Z" fill="#6df0e0" />
          <path d="M-2 22 L4 -10 L10 22 Z" fill="#9ffaf0" />
          <path d="M8 22 L13 4 L18 22 Z" fill="#6df0e0" />
        </g>
      </g>

      {STAGES.map((s) => {
        const un = isUnlocked(s, progress);
        const st = progress.stars[s.id] ?? 0;
        const sel = s.id === selectedId;
        const { x, y } = s.node;
        return (
          <g key={s.id} onClick={() => onSelect(s.id)} style={{ cursor: 'pointer' }} role="button" aria-label={s.name}>
            {st > 0 && <circle cx={x} cy={y} r={46} fill="url(#m-glow)" opacity="0.6" />}
            {sel && (
              <motion.circle
                cx={x}
                cy={y}
                r={30}
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                animate={{ r: [28, 35, 28], opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
            <circle
              cx={x}
              cy={y}
              r={24}
              fill={un ? (st > 0 ? '#ffcf5a' : '#3a2a6a') : '#2a2a3a'}
              stroke={un ? '#ffe9a8' : '#55556a'}
              strokeWidth="3"
            />
            {un ? (
              <text
                x={x}
                y={y + 7}
                textAnchor="middle"
                fontSize="20"
                fontWeight="900"
                fill={st > 0 ? '#5a3a08' : '#ffe9a8'}
              >
                {s.symbol}
              </text>
            ) : (
              <g transform={`translate(${x} ${y})`}>
                <rect x="-8" y="-2" width="16" height="12" rx="2" fill="#8a8aa0" />
                <path d="M-5 -2 V-6 Q-5 -11 0 -11 Q5 -11 5 -6 V-2" fill="none" stroke="#8a8aa0" strokeWidth="2.5" />
              </g>
            )}
            {st > 0 && (
              <motion.g
                transform={`translate(${x} ${y - 36})`}
                style={{ originX: 0.5, originY: 1 }}
                animate={{ scaleY: [1, 1.15, 0.95, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <path d="M0 -12 C6 -5 7 0 4 4 C2 6 -2 6 -4 4 C-7 0 -6 -5 0 -12Z" fill="#ff7a1a" />
                <path d="M0 -6 C3 -2 3 1 2 3 C1 4 -1 4 -2 3 C-3 1 -3 -2 0 -6Z" fill="#ffe27a" />
              </motion.g>
            )}
            <text
              x={x}
              y={y + 42}
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill="#fff"
              stroke="#10163f"
              strokeWidth="3"
              paintOrder="stroke"
            >
              {s.name}
            </text>
            <g transform={`translate(${x - 21} ${y + 46})`}>
              {[0, 1, 2].map((i) => (
                <polygon
                  key={i}
                  points={starPoints}
                  transform={`translate(${i * 14} 0) scale(0.55)`}
                  fill={i < st ? '#ffd45a' : '#ffffff'}
                  fillOpacity={i < st ? 1 : 0.25}
                />
              ))}
            </g>
            <circle cx={x} cy={y} r={34} fill="transparent" />
          </g>
        );
      })}
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════════
// تأثيرات الاحتفال
// ═══════════════════════════════════════════════════════════════════

const CONFETTI_COLORS = ['#ffd45a', '#ff5d6c', '#7ef0c0', '#7fb8ff', '#ff9af0', '#ffb347'];

const Confetti: React.FC<{ count?: number }> = ({ count = 56 }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: rnd(i, 1) * 100,
        delay: rnd(i, 2) * 0.7,
        dur: 2.2 + rnd(i, 3) * 1.8,
        rot: 360 + rnd(i, 4) * 540,
        w: 6 + rnd(i, 5) * 6,
        h: 8 + rnd(i, 6) * 8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        drift: (rnd(i, 7) - 0.5) * 140,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block rounded-[2px]"
          style={{ left: `${p.left}%`, width: p.w, height: p.h, backgroundColor: p.color }}
          initial={{ y: -30, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: 820, x: p.drift, rotate: p.rot, opacity: [1, 1, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
};

const Burst: React.FC<{ burst: BurstState }> = ({ burst }) => {
  if (burst.key === 0 || burst.count === 0) return null;
  return (
    <div key={burst.key} className="pointer-events-none absolute left-1/2 top-[62%] z-20 h-0 w-0" aria-hidden="true">
      {Array.from({ length: burst.count }, (_, i) => {
        const a = (i / burst.count) * Math.PI * 2 + rnd(i, 9) * 0.6;
        const r = burst.radius * (0.6 + rnd(i, 3) * 0.6);
        return (
          <motion.span
            key={i}
            className="absolute block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: burst.colors[i % burst.colors.length] }}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
            animate={{ x: Math.cos(a) * r, y: Math.sin(a) * r, scale: [0.4, 1.2, 0], opacity: [1, 1, 0] }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

const StarsRow: React.FC<{ earned: number }> = ({ earned }) => (
  <div className="mt-1 flex items-center justify-center gap-2" dir="ltr">
    {[0, 1, 2].map((i) => (
      <motion.svg
        key={i}
        viewBox="0 0 24 24"
        className="h-14 w-14 drop-shadow-[0_4px_10px_rgba(255,200,60,0.55)]"
        initial={{ scale: 0, rotate: -40, opacity: 0 }}
        animate={{ scale: i < earned ? 1 : 0.75, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.4 + i * 0.38 }}
      >
        <polygon
          points={starPoints}
          fill={i < earned ? '#ffd45a' : '#ffffff'}
          fillOpacity={i < earned ? 1 : 0.2}
          stroke={i < earned ? '#b9791f' : '#ffffff'}
          strokeOpacity={i < earned ? 1 : 0.3}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.svg>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════
// مكوّنات الواجهة
// ═══════════════════════════════════════════════════════════════════

const Hud: React.FC<{
  title: string;
  subtitle?: string;
  onBack: () => void;
  muted: boolean;
  onToggleMute: () => void;
  right?: React.ReactNode;
}> = ({ title, subtitle, onBack, muted, onToggleMute, right }) => (
  <div className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-white/10 bg-[#140f33] px-3">
    <button
      type="button"
      aria-label="رجوع"
      onClick={onBack}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:scale-95"
    >
      <ArrowRight className="h-5 w-5" />
    </button>
    <div className="min-w-0 flex-1 text-center leading-tight">
      <div className="truncate text-base font-black text-amber-200">{title}</div>
      {subtitle && <div className="truncate text-xs text-white/60">{subtitle}</div>}
    </div>
    {right}
    <button
      type="button"
      aria-label={muted ? 'تشغيل الصوت' : 'كتم الصوت'}
      onClick={onToggleMute}
      className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:scale-95"
    >
      {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </button>
  </div>
);

const BanaCorner: React.FC<{ excited: boolean; message: string }> = ({ excited, message }) => (
  <div className="pointer-events-none absolute bottom-1 right-1 z-10 flex flex-col items-end gap-1">
    <AnimatePresence mode="popLayout">
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 8, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-[170px] rounded-2xl rounded-br-sm bg-white px-3 py-1.5 text-xs font-extrabold leading-snug text-[#2b1a55] shadow-lg"
      >
        {message}
      </motion.div>
    </AnimatePresence>
    <div className="h-24 w-24 origin-bottom-right scale-90">
      <GameCompanion heroId={HERO_ID} mood={excited ? 'excited' : 'idle'} />
    </div>
  </div>
);

const FuseTimer: React.FC<{ total: number; frozen: boolean; onExpire: () => void }> = ({ total, frozen, onExpire }) => {
  const [remaining, setRemaining] = useState<number>(total);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (frozen) return;
    const t0 = performance.now();
    let fired = false;
    let lastWhole = Math.ceil(total);
    const id = window.setInterval(() => {
      const rem = Math.max(0, total - (performance.now() - t0) / 1000);
      setRemaining(rem);
      const whole = Math.ceil(rem);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (whole > 0 && whole <= 3) sfx.tick();
      }
      if (rem <= 0 && !fired) {
        fired = true;
        window.clearInterval(id);
        expireRef.current();
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [frozen, total]);

  const pct = (remaining / total) * 100;
  const color = pct > 55 ? '#f59e0b' : pct > 28 ? '#ea580c' : '#dc2626';

  return (
    <div className="flex w-full items-center gap-2" role="timer" aria-label="الوقت المتبقي">
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#3a2410]/25">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 100ms linear' }} />
      </div>
      <span className="w-6 text-center text-sm font-black" style={{ color }}>
        {Math.ceil(remaining)}
      </span>
    </div>
  );
};

const Chip: React.FC<{ tone?: 'gold' | 'sky' | 'jade' | 'rose'; children: React.ReactNode }> = ({ tone = 'gold', children }) => {
  const map = {
    gold: 'bg-amber-400/20 border-amber-300/60 text-amber-200',
    sky: 'bg-sky-400/20 border-sky-300/60 text-sky-200',
    jade: 'bg-emerald-400/20 border-emerald-300/60 text-emerald-200',
    rose: 'bg-rose-400/20 border-rose-300/60 text-rose-200',
  } as const;
  return <span className={`inline-block rounded-xl border-2 px-3 py-1 ${map[tone]}`}>{children}</span>;
};

// ═══════════════════════════════════════════════════════════════════
// الدروس
// ═══════════════════════════════════════════════════════════════════

interface LessonStepData {
  title: string;
  body: React.ReactNode;
  quiz?: { prompt: string; options: string[]; correct: number; why: string };
}

const buildLessonSteps = (id: LessonId): LessonStepData[] => {
  if (id === 'five') {
    return [
      {
        title: 'سرّ الأعداد التي تنتهي بـ 5',
        body: (
          <div className="space-y-4 text-center">
            <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-3xl font-black text-amber-200">
              <span>35²</span>
              <span>=</span>
              <Chip tone="gold">3 × 4 = 12</Chip>
              <Chip tone="sky">25</Chip>
              <span>=</span>
              <span>1225</span>
            </div>
            <p className="text-lg font-bold leading-8 text-white/90">
              خذ رقم العشرات (3) واضربه في الرقم الذي يليه (4) فيكون الناتج 12، ثم اكتب 25 بجانبه.
            </p>
          </div>
        ),
      },
      {
        title: 'جرّب بنفسك',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            العشرات في 45 هي 4، والعدد الذي يليها 5. اضربهما ثم ألصق 25.
          </p>
        ),
        quiz: {
          prompt: 'ما قيمة 45² ؟',
          options: ['1625', '2025', '2425'],
          correct: 1,
          why: '4 × 5 = 20، ثم 25 فيكون 2025',
        },
      },
      {
        title: 'مرة أخرى',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            العشرات في 75 هي 7، والعدد الذي يليها 8.
          </p>
        ),
        quiz: {
          prompt: 'ما قيمة 75² ؟',
          options: ['4925', '5625', '6425'],
          correct: 1,
          why: '7 × 8 = 56، ثم 25 فيكون 5625',
        },
      },
      {
        title: 'أصبحت تعرف السرّ!',
        body: (
          <p className="text-center text-lg font-bold leading-8 text-white/90">
            كل عدد ينتهي بـ 5 يمكنك تربيعه في ثانيتين. هيا إلى بوابة الخمسات!
          </p>
        ),
      },
    ];
  }
  return [
    {
      title: 'الخطوة 1: قسّم إلى أزواج',
      body: (
        <div className="space-y-4 text-center">
          <div dir="ltr" className="flex items-center justify-center gap-2 text-3xl font-black text-sky-200">
            <span>√1521</span>
            <span>→</span>
            <Chip tone="sky">15</Chip>
            <span>|</span>
            <Chip tone="gold">21</Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            قسّم العدد إلى أزواج من اليمين. الزوج الأول (15) يعطيك عشرات الجذر: أكبر مربع لا يزيد على 15 هو 9، أي 3². إذن العشرات 3.
          </p>
        </div>
      ),
    },
    {
      title: 'الخطوة 2: انظر إلى الآحاد',
      body: (
        <div className="space-y-3 text-center">
          <p className="text-lg font-bold leading-8 text-white/90">
            آخر رقم في العدد يحدد آحاد الجذر:
          </p>
          <div dir="ltr" className="mx-auto grid max-w-xs grid-cols-2 gap-2 text-xl font-black">
            <Chip tone="gold">ينتهي بـ 1 → 1 أو 9</Chip>
            <Chip tone="sky">ينتهي بـ 4 → 2 أو 8</Chip>
            <Chip tone="jade">ينتهي بـ 6 → 4 أو 6</Chip>
            <Chip tone="rose">ينتهي بـ 9 → 3 أو 7</Chip>
          </div>
          <p className="text-base font-bold text-white/70">وما ينتهي بـ 0 أو 5 فجذره ينتهي بـ 0 أو 5.</p>
        </div>
      ),
      quiz: {
        prompt: '√1521 ينتهي بـ 1. ما الرقم الآخر الذي مربعه ينتهي بـ 1؟',
        options: ['3', '7', '9'],
        correct: 2,
        why: '9 × 9 = 81 وينتهي بـ 1',
      },
    },
    {
      title: 'الخطوة 3: قارن لتختار',
      body: (
        <div className="space-y-3 text-center">
          <div dir="ltr" className="flex flex-wrap items-center justify-center gap-2 text-2xl font-black text-amber-200">
            <Chip tone="gold">3 × 4 = 12</Chip>
            <span>و</span>
            <Chip tone="sky">15</Chip>
          </div>
          <p className="text-lg font-bold leading-8 text-white/90">
            احسب العشرات × العدد الذي يليها (3 × 4 = 12). إن كان الزوج الأول أكبر منه أو يساويه (15 ≥ 12) فاختر الآحاد الأكبر: 39. وإن كان أصغر فاختر الأصغر.
          </p>
        </div>
      ),
    },
    {
      title: 'الآن دورك',
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          √2916 ← الأزواج 29 | 16. العشرات 5 (لأن 25 ≤ 29). الآحاد 4 أو 6. احسب 5 × 6 = 30 وقارن بـ 29.
        </p>
      ),
      quiz: {
        prompt: 'ما قيمة √2916 ؟',
        options: ['54', '56'],
        correct: 0,
        why: '29 أصغر من 30 فنختار الآحاد الأصغر: 54',
      },
    },
    {
      title: 'فككت شفرة الجذور!',
      body: (
        <p className="text-center text-lg font-bold leading-8 text-white/90">
          أزواج، ثم عشرات، ثم آحاد، ثم مقارنة. هيا إلى كهف الجذور!
        </p>
      ),
    },
  ];
};

const LessonScreen: React.FC<{
  lessonId: LessonId;
  finishLabel: string;
  onDone: () => void;
  onBack: () => void;
  muted: boolean;
  onToggleMute: () => void;
}> = ({ lessonId, finishLabel, onDone, onBack, muted, onToggleMute }) => {
  const steps = useMemo(() => buildLessonSteps(lessonId), [lessonId]);
  const [step, setStep] = useState<number>(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [solved, setSolved] = useState<boolean>(false);

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = !cur.quiz || solved;

  const goNext = () => {
    sfx.click();
    if (isLast) {
      onDone();
      return;
    }
    setStep((s) => s + 1);
    setPicked(null);
    setSolved(false);
  };

  const choose = (i: number) => {
    if (solved || !cur.quiz) return;
    setPicked(i);
    if (i === cur.quiz.correct) {
      setSolved(true);
      sfx.correct(3);
    } else {
      sfx.wrong();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-[#1d1546] to-[#0d0926]">
      <Hud
        title={lessonId === 'five' ? 'سرّ الخمسات' : 'طريقة الأزواج'}
        subtitle={`الخطوة ${step + 1} من ${steps.length}`}
        onBack={onBack}
        muted={muted}
        onToggleMute={onToggleMute}
      />
      <div className="flex shrink-0 justify-center gap-2 py-3" aria-hidden="true">
        {steps.map((_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-amber-300' : i < step ? 'w-2 bg-amber-300/70' : 'w-2 bg-white/20'}`} />
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 border-amber-300/30 bg-[#241a5c]/80 p-5 shadow-xl"
        >
          <h2 className="mb-4 text-center text-2xl font-black text-amber-300">{cur.title}</h2>
          {cur.body}

          {cur.quiz && (
            <div className="mt-5 space-y-3">
              <div className="text-center text-xl font-black">{cur.quiz.prompt}</div>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cur.quiz.options.length}, minmax(0, 1fr))` }}>
                {cur.quiz.options.map((opt, i) => {
                  const isRight = solved && i === cur.quiz!.correct;
                  const isWrong = picked === i && i !== cur.quiz!.correct;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      onClick={() => choose(i)}
                      animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                      transition={{ duration: 0.35 }}
                      whileTap={{ scale: 0.95 }}
                      dir="ltr"
                      className={`h-20 rounded-2xl border-b-8 text-3xl font-black ${
                        isRight
                          ? 'border-emerald-800 bg-emerald-500 text-white'
                          : isWrong
                            ? 'border-rose-900 bg-rose-500 text-white'
                            : 'border-[#6b4a26] bg-gradient-to-b from-[#c9a06a] to-[#a67b44] text-[#2b1808]'
                      }`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
              <div className="min-h-[2.5rem] text-center text-base font-extrabold">
                {solved && <span className="text-emerald-300">صحيح! {cur.quiz.why}</span>}
                {!solved && picked !== null && <span className="text-rose-300">ليس تماماً، فكّر وجرّب مرة أخرى</span>}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <div className="shrink-0 px-4 pb-4">
        <button
          type="button"
          disabled={!canNext}
          onClick={goNext}
          className={`h-14 w-full rounded-2xl border-b-8 text-xl font-black transition ${
            canNext
              ? 'border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-[#2b1808] active:translate-y-1 active:border-b-4'
              : 'border-white/10 bg-white/10 text-white/40'
          }`}
        >
          {isLast ? finishLabel : 'التالي'}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// اللعبة
// ═══════════════════════════════════════════════════════════════════

export default function SorobaniaGame({ onBack }: SorobaniaGameProps) {
  const { addXP } = useProgressStore();
  const { speak } = useCharacterVoice(HERO_ID);

  const [screen, setScreen] = useState<Screen>('map');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const progressRef = useRef<Progress>(progress);
  const [selectedId, setSelectedId] = useState<string>(() => suggestStage(progressRef.current));
  const [lesson, setLesson] = useState<{ id: LessonId; stageId: string | null } | null>(null);

  const [run, setRun] = useState<Run | null>(null);
  const runRef = useRef<Run | null>(null);
  const [streak, setStreakState] = useState<number>(0);
  const streakRef = useRef<number>(0);
  const bestStreakRef = useRef<number>(0);
  const [result, setResult] = useState<Result | null>(null);

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [banaMsg, setBanaMsg] = useState<string>('اختر منطقة وابدأ المغامرة!');
  const [burst, setBurst] = useState<BurstState>({ key: 0, colors: ['#ffd45a'], count: 0, radius: 0 });
  const [recordsOpen, setRecordsOpen] = useState<boolean>(false);
  const [streakEntry, setStreakEntry] = useState<HighScoreEntry | null>(null);
  const [speedEntry, setSpeedEntry] = useState<HighScoreEntry | null>(null);
  const [scoreVersion, setScoreVersion] = useState<number>(0);

  const questionStartRef = useRef<number>(0);
  const advanceTimer = useRef<number | null>(null);
  const noticeTimer = useRef<number | null>(null);
  const newStreakFlagRef = useRef<boolean>(false);
  const rootsCrossedRef = useRef<boolean>(false);

  // ─── الصوت ───
  useEffect(() => {
    soundOn = !muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      // تجاهل
    }
  }, [muted]);

  // ─── الأرقام القياسية الحالية ───
  useEffect(() => {
    setStreakEntry(getHighScore(GAME_ID) ?? null);
    setSpeedEntry(getHighScore(SPEED_GAME_ID) ?? null);
  }, []);

  // ─── مساعدات الحالة ───
  const updateProgress = useCallback((fn: (p: Progress) => Progress) => {
    const next = fn(progressRef.current);
    progressRef.current = next;
    setProgress(next);
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    } catch {
      // تجاهل
    }
  }, []);

  const commitRun = useCallback((r: Run | null) => {
    runRef.current = r;
    setRun(r);
  }, []);

  const setStreak = useCallback((n: number) => {
    streakRef.current = n;
    setStreakState(n);
  }, []);

  const showNotice = useCallback((text: string) => {
    setNotice(text);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 2800);
  }, []);

  const clearAdvance = useCallback(() => {
    if (advanceTimer.current) {
      window.clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }, []);

  // حفظ رقم السلسلة القياسي
  const commitStreakRecord = useCallback((): boolean => {
    const best = bestStreakRef.current;
    if (best <= 0) return false;
    const existingValue = getHighScore(GAME_ID)?.value ?? 0;
    if (best <= existingValue) return false;
    const name = getLocalChildName();
    addScore(GAME_ID, name, best, HERO_ID);
    setStreakEntry({ name, value: best, heroId: HERO_ID, date: Date.now() });
    setScoreVersion((v) => v + 1);
    updateProgress((p) => ({ ...p, bestStreak: Math.max(p.bestStreak, best) }));
    return true;
  }, [updateProgress]);

  useEffect(
    () => () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
      commitStreakRecord();
    },
    [commitStreakRecord],
  );

  useEffect(() => {
    if (screen !== 'win' || !result) return;
    const ids = Array.from({ length: result.stars }, (_, i) => window.setTimeout(() => sfx.star(i), 500 + i * 380));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [screen, result]);

  const triggerBurst = (kind: 'right' | 'relight' | 'wrong') => {
    if (kind === 'right') {
      setBurst({ key: Date.now(), colors: ['#ffd45a', '#ffe9a8', '#7ef0c0'], count: 14, radius: 90 });
    } else if (kind === 'relight') {
      setBurst({ key: Date.now(), colors: ['#ff7a1a', '#ffb02e', '#ffe27a', '#fff3c4'], count: 26, radius: 140 });
    } else {
      setBurst({ key: Date.now(), colors: ['#ff5d6c', '#7a1f3a', '#3a2a4a'], count: 12, radius: 70 });
    }
  };

  // ─── التذكرة: تُستهلك في GamesListScreen · لا نكررها هنا ───
  const ensureTicket = (): boolean => {
    return true;
  };

  // ─── نهاية المرحلة ───
  const finishStage = (won: boolean) => {
    const r = runRef.current;
    if (!r) return;
    clearAdvance();
    const stage = r.stage;
    const name = getLocalChildName();
    const stars = won ? (r.mistakes === 0 ? 3 : r.mistakes === 1 ? 2 : 1) : 0;
    const enough = r.times.length >= 4;
    const avgSec = r.times.length > 0 ? r.times.reduce((a, b) => a + b, 0) / r.times.length : null;
    let speedPts = 0;
    let newSpeed = false;
    let unlockedStage: StageDef | null = null;

    if (won) {
      const prevStars = progressRef.current.stars[stage.id] ?? 0;
      updateProgress((p) => ({
        ...p,
        stars: { ...p.stars, [stage.id]: Math.max(p.stars[stage.id] ?? 0, stars) },
        bestSpeedSec:
          avgSec !== null && enough ? Math.min(p.bestSpeedSec ?? 999, Number(avgSec.toFixed(1))) : p.bestSpeedSec,
      }));
      const nxt = nextStageOf(stage);
      if (prevStars === 0 && nxt) unlockedStage = nxt;
      addXP(1 + stars);

      if (avgSec !== null && enough) {
        speedPts = Math.round(100 / Math.max(0.5, avgSec));
        const bestSpeed = getHighScore(SPEED_GAME_ID)?.value ?? 0;
        if (speedPts > bestSpeed) {
          addScore(SPEED_GAME_ID, name, speedPts, HERO_ID);
          newSpeed = true;
          setSpeedEntry({ name, value: speedPts, heroId: HERO_ID, date: Date.now() });
        }
      }
      sfx.fanfare();
      speak(`مبروك يا ${name}! انفتح باب المعبد!`);
      setBanaMsg(stars === 3 ? 'ثلاث نجوم! أنت أسطورة!' : 'انتصار رائع! حاول جمع كل النجوم.');
    } else {
      sfx.lose();
      speak('انطفأت المشاعل، لكنك ستعود أقوى!');
      setBanaMsg('لا بأس! كل محاولة تجعلك أسرع.');
    }

    const newStreak = commitStreakRecord() || newStreakFlagRef.current;
    setScoreVersion((v) => v + 1);
    const rootsUnlocked = rootsCrossedRef.current;
    rootsCrossedRef.current = false;

    setResult({
      won,
      stageId: stage.id,
      stars,
      correct: r.correct,
      total: r.deck.length,
      avgSec,
      speedPts,
      newSpeed,
      newStreak,
      streakBest: bestStreakRef.current,
      unlockedStage,
      rootsUnlocked,
    });
    setScreen(won ? 'win' : 'lose');
  };

  // ─── الانتقال للسؤال التالي ───
  const advance = () => {
    const r = runRef.current;
    if (!r) return;
    if (r.torches <= 0) {
      finishStage(false);
      return;
    }
    if (r.index + 1 >= r.deck.length) {
      finishStage(true);
      return;
    }
    commitRun({ ...r, index: r.index + 1, feedback: null, picked: null, input: '', relit: false });
    questionStartRef.current = Date.now();
  };

  const scheduleAdvance = (ms: number) => {
    clearAdvance();
    advanceTimer.current = window.setTimeout(advance, ms);
  };

  // ─── معالجة الإجابة ───
  const resolve = (kind: 'right' | 'wrong' | 'timeout', picked: number | null) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    const elapsed = (Date.now() - questionStartRef.current) / 1000;
    const name = getLocalChildName();

    if (kind === 'right') {
      const newStreak = streakRef.current + 1;
      setStreak(newStreak);
      if (newStreak > bestStreakRef.current) bestStreakRef.current = newStreak;
      const relight = newStreak % 3 === 0 && r.torches < MAX_TORCHES;

      commitRun({
        ...r,
        feedback: 'right',
        picked,
        correct: r.correct + 1,
        times: [...r.times, elapsed],
        torches: relight ? r.torches + 1 : r.torches,
        relit: relight,
      });

      if (q.kind === 'squares') {
        const before = progressRef.current.squaresCorrect;
        updateProgress((p) => ({ ...p, squaresCorrect: p.squaresCorrect + 1 }));
        if (before < ROOTS_UNLOCK_AT && before + 1 >= ROOTS_UNLOCK_AT) {
          rootsCrossedRef.current = true;
          window.setTimeout(() => {
            sfx.unlock();
            showNotice('🔑 فُتحت أسرار الجذور! ستجدها على الخريطة.');
          }, 500);
        }
      }

      sfx.correct(newStreak);
      if (relight) {
        sfx.relight();
        triggerBurst('relight');
        setBanaMsg('أشعلت مشعلاً جديداً! 🔥');
        speak(`${pick(CHEERS)} أشعلت مشعلاً!`);
      } else {
        triggerBurst('right');
        setBanaMsg(newStreak >= 3 ? `سلسلة ${newStreak}! حسابات خارقة!` : pick(CHEERS));
        if (newStreak % 3 === 0) speak(`${pick(CHEERS)} ${name}!`);
      }
      scheduleAdvance(relight ? 1250 : 850);
      return;
    }

    const hadStreak = streakRef.current;
    if (hadStreak > 0) {
      if (commitStreakRecord()) newStreakFlagRef.current = true;
    }
    setStreak(0);
    commitRun({
      ...r,
      feedback: kind,
      picked,
      torches: Math.max(0, r.torches - 1),
      mistakes: r.mistakes + 1,
      relit: false,
    });
    sfx.wrong();
    triggerBurst('wrong');
    setBanaMsg(kind === 'timeout' ? 'انتهى الوقت! انظر للجواب.' : pick(OOPS));
    if (r.torches - 1 <= 0) speak('آخر مشعل انطفأ!');
    scheduleAdvance(1700);
  };

  const pickOption = (value: number) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    if (q.kind !== 'squares') return;
    resolve(value === q.ans ? 'right' : 'wrong', value);
  };

  const pressDigit = (d: string) => {
    const r = runRef.current;
    if (!r || r.feedback) return;
    const q = r.deck[r.index];
    if (q.kind !== 'roots' || r.input.length >= 2) return;
    const nextInput = r.input + d;
    commitRun({ ...r, input: nextInput });
    if (nextInput.length >= 2) {
      const value = Number(nextInput);
      resolve(value === q.ans ? 'right' : 'wrong', value);
    } else {
      sfx.click();
    }
  };

  const pressBackspace = () => {
    const r = runRef.current;
    if (!r || r.feedback || r.input.length === 0) return;
    commitRun({ ...r, input: r.input.slice(0, -1) });
    sfx.click();
  };

  const clearInput = () => {
    const r = runRef.current;
    if (!r || r.feedback || r.input.length === 0) return;
    commitRun({ ...r, input: '' });
    sfx.click();
  };

  // ─── بدء مرحلة ───
  const beginStage = (stage: StageDef) => {
    if (!ensureTicket()) {
      showNotice('تحتاج إلى تذكرة لدخول المعبد');
      setScreen('map');
      return;
    }
    clearAdvance();
    newStreakFlagRef.current = false;
    rootsCrossedRef.current = false;
    bestStreakRef.current = 0; // 🆕 v3: تصفير السلسلة لكل جولة جديدة
    setResult(null);
    commitRun({
      stage,
      deck: buildDeck(stage),
      index: 0,
      torches: MAX_TORCHES,
      mistakes: 0,
      correct: 0,
      times: [],
      feedback: null,
      picked: null,
      input: '',
      relit: false,
    });
    questionStartRef.current = Date.now();
    setSelectedId(stage.id);
    setScreen('play');
    sfx.click();
    setBanaMsg('٣ إجابات متتالية تُشعل مشعلاً!');
    speak(`أهلاً ${getLocalChildName()}! لنبدأ ${stage.name}`);
  };

  const launchStage = (stageId: string) => {
    const stage = STAGES.find((s) => s.id === stageId);
    if (!stage) return;
    if (!isUnlocked(stage, progressRef.current)) {
      sfx.wrong();
      showNotice(lockReason(stage, progressRef.current));
      return;
    }
    if (stage.lesson && !progressRef.current.seen[stage.lesson]) {
      sfx.click();
      setLesson({ id: stage.lesson, stageId: stage.id });
      setScreen('lesson');
      return;
    }
    beginStage(stage);
  };

  const openLesson = (id: LessonId) => {
    sfx.click();
    setLesson({ id, stageId: null });
    setScreen('lesson');
  };

  const finishLesson = () => {
    if (!lesson) return;
    updateProgress((p) => ({ ...p, seen: { ...p.seen, [lesson.id]: true } }));
    const stage = lesson.stageId ? STAGES.find((s) => s.id === lesson.stageId) : undefined;
    setLesson(null);
    if (stage) beginStage(stage);
    else setScreen('map');
  };

  const toMap = () => {
    clearAdvance();
    commitStreakRecord();
    setStreak(0);
    setSelectedId(suggestStage(progressRef.current));
    setBanaMsg('اختر منطقة وابدأ المغامرة!');
    setScreen('map');
  };

  const handleBack = () => {
    if (screen === 'map') {
      commitStreakRecord();
      onBack();
      return;
    }
    if (screen === 'lesson') {
      setLesson(null);
      setScreen('map');
      return;
    }
    toMap();
  };

  const toggleMute = () => setMuted((m) => !m);

  // ═════════════════════════════════════════════════════════════════
  // العرض
  // ═════════════════════════════════════════════════════════════════

  const totalStars = STAGES.reduce((sum, s) => sum + (progress.stars[s.id] ?? 0), 0);
  const sel = STAGES.find((s) => s.id === selectedId) ?? STAGES[0];
  const selUnlocked = isUnlocked(sel, progress);
  const selStars = progress.stars[sel.id] ?? 0;
  const rootsOpen = progress.squaresCorrect >= ROOTS_UNLOCK_AT;

  const inGame = (screen === 'play' || screen === 'win' || screen === 'lose') && run !== null;
  const q: Question | null = run ? run.deck[run.index] : null;
  const pos = screen === 'win' ? 8 : run ? Math.min(8, run.index + (run.feedback === 'right' ? 1 : 0)) : 0;
  const shake = run?.feedback === 'wrong' || run?.feedback === 'timeout';
  const pips = '●'.repeat(streak % 3) + '○'.repeat(3 - (streak % 3));

  const resultStage = result ? STAGES.find((s) => s.id === result.stageId) ?? null : null;
  const resultNext = resultStage ? nextStageOf(resultStage) : null;
  const canGoNext = !!resultNext && isUnlocked(resultNext, progress);

  return (
    <div dir="rtl" className="fixed inset-0 z-[60] flex select-none justify-center bg-[#07051a] text-white [touch-action:manipulation]">
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-[#140f33]">
        {/* ═══════════ الخريطة ═══════════ */}
        {screen === 'map' && (
          <>
            <Hud
              title="جزيرة سوروبانيا"
              subtitle={`النجوم ${totalStars} من ${STAGES.length * 3}`}
              onBack={handleBack}
              muted={muted}
              onToggleMute={toggleMute}
              right={
                <button
                  type="button"
                  aria-label="الأرقام القياسية"
                  onClick={() => {
                    sfx.click();
                    setRecordsOpen(true);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 active:scale-95"
                >
                  <Trophy className="h-5 w-5" />
                </button>
              }
            />

            <div className="relative min-h-0 flex-[6] overflow-hidden bg-gradient-to-b from-[#120d36] via-[#173a73] to-[#0d5a78]">
              <MapScene
                progress={progress}
                selectedId={selectedId}
                onSelect={(id) => {
                  sfx.click();
                  setSelectedId(id);
                  const st = STAGES.find((s) => s.id === id);
                  if (st && !isUnlocked(st, progressRef.current)) showNotice(lockReason(st, progressRef.current));
                }}
              />
              <BanaCorner excited={totalStars >= 3} message={banaMsg} />
            </div>

            <div className="flex min-h-0 flex-[4] flex-col justify-center gap-2.5 overflow-y-auto bg-gradient-to-b from-[#1d1546] to-[#120c2e] px-4 pb-4 pt-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-2xl font-black text-amber-200">{sel.name}</div>
                  <div className="truncate text-sm font-bold text-white/65">{sel.blurb}</div>
                </div>
                <div className="flex shrink-0 gap-1" dir="ltr" aria-label={`${selStars} من 3 نجوم`}>
                  {[0, 1, 2].map((i) => (
                    <svg key={i} viewBox="0 0 24 24" className="h-8 w-8">
                      <polygon
                        points={starPoints}
                        fill={i < selStars ? '#ffd45a' : '#ffffff'}
                        fillOpacity={i < selStars ? 1 : 0.2}
                      />
                    </svg>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-white/70">
                <span>{rootsOpen ? '🔑 الجذور مفتوحة' : '🔑 مفتاح الجذور'}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-sky-300 to-emerald-300 transition-all"
                    style={{ width: `${Math.min(100, (progress.squaresCorrect / ROOTS_UNLOCK_AT) * 100)}%` }}
                  />
                </div>
                <span dir="ltr">
                  {Math.min(progress.squaresCorrect, ROOTS_UNLOCK_AT)}/{ROOTS_UNLOCK_AT}
                </span>
              </div>

              {selUnlocked ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => launchStage(sel.id)}
                    className="h-16 flex-1 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-2xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                  >
                    {selStars > 0 ? 'العب مرة أخرى' : 'ابدأ المرحلة'}
                  </button>
                  {sel.lesson && (
                    <button
                      type="button"
                      aria-label="الدرس"
                      onClick={() => openLesson(sel.lesson as LessonId)}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] active:translate-y-1 active:border-b-4"
                    >
                      <BookOpen className="h-7 w-7" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex h-16 items-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 px-4 text-sm font-extrabold leading-snug text-white/80">
                  <Lock className="h-6 w-6 shrink-0 text-amber-300" />
                  <span>{lockReason(sel, progress)}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ الدرس ═══════════ */}
        {screen === 'lesson' && lesson && (
          <LessonScreen
            lessonId={lesson.id}
            finishLabel={lesson.stageId ? 'ابدأ المرحلة' : 'العودة للخريطة'}
            onDone={finishLesson}
            onBack={handleBack}
            muted={muted}
            onToggleMute={toggleMute}
          />
        )}

        {/* ═══════════ اللعب والنتيجة ═══════════ */}
        {inGame && run && (
          <>
            <Hud
              title={run.stage.name}
              subtitle={screen === 'play' ? `سؤال ${run.index + 1} من ${run.deck.length}   ${pips}` : undefined}
              onBack={handleBack}
              muted={muted}
              onToggleMute={toggleMute}
              right={
                <div className="flex h-11 items-center gap-1 rounded-xl bg-purple-500/20 px-2.5 text-lg font-black text-purple-200">
                  <Flame className="h-5 w-5 fill-purple-300" />
                  <span dir="ltr">{streak}</span>
                </div>
              }
            />

            {/* المشهد */}
            <div className="relative min-h-0 flex-[6] overflow-hidden">
              <motion.div
                className="absolute inset-0"
                animate={shake ? { x: [0, -12, 12, -9, 9, -4, 0] } : { x: 0 }}
                transition={{ duration: 0.45 }}
              >
                <PlayScene stage={run.stage} pos={pos} torches={run.torches} />

                {screen === 'play' && q && (
                  <div className="absolute inset-x-3 top-2 z-10">
                    <motion.div
                      key={q.id}
                      initial={{ y: -22, opacity: 0, scale: 0.96 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="rounded-3xl border-4 border-[#a8814f] bg-gradient-to-b from-[#f6e7c1] to-[#e8cf9b] px-3 pb-2 pt-1.5 text-center text-[#3a2410] shadow-[0_6px_0_#6b4a26,0_14px_30px_rgba(0,0,0,0.45)]"
                    >
                      <div className="h-5 text-sm font-extrabold">
                        {run.feedback === 'right' ? (
                          <span className="text-emerald-700">صحيح!</span>
                        ) : run.feedback ? (
                          <span className="text-rose-700">الجواب: {q.ans}</span>
                        ) : (
                          <span className="text-[#6b4a26]">
                            {q.kind === 'squares' ? 'ما مربّع هذا العدد؟' : 'ما جذر هذا العدد؟'}
                          </span>
                        )}
                      </div>
                      <div dir="ltr" className="text-5xl font-black leading-tight tracking-wide">
                        {q.kind === 'squares' ? `${q.num}² = ؟` : `√${q.val} = ؟`}
                      </div>
                      {q.kind === 'roots' && (
                        <div dir="ltr" className="mt-0.5 flex items-center justify-center gap-2 text-xl font-black">
                          <span className="rounded-lg bg-[#3a2410]/15 px-2.5">{q.pair1}</span>
                          <span className="text-[#6b4a26]">|</span>
                          <span className="rounded-lg bg-[#3a2410]/15 px-2.5">{q.pair2}</span>
                        </div>
                      )}
                      <div className="mt-1.5">
                        <FuseTimer
                          total={q.kind === 'squares' ? SQUARE_TIME : ROOT_TIME}
                          frozen={run.feedback !== null}
                          onExpire={() => resolve('timeout', null)}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}

                {screen === 'lose' && <div className="absolute inset-0 bg-black/35" />}
              </motion.div>

              {shake && (
                <motion.div
                  key={`flash-${run.index}`}
                  className="pointer-events-none absolute inset-0 z-20 bg-rose-600/35"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                />
              )}
              {run.relit && run.feedback === 'right' && (
                <motion.div
                  key={`relit-${run.index}`}
                  className="pointer-events-none absolute inset-0 z-20 bg-amber-400/30"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}

              <Burst burst={burst} />

              {run.relit && run.feedback === 'right' && (
                <motion.div
                  key={`relit-banner-${run.index}`}
                  className="pointer-events-none absolute inset-x-0 top-[44%] z-20 flex justify-center"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: [0.4, 1.15, 1], opacity: [0, 1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-2xl bg-amber-400 px-5 py-2 text-2xl font-black text-[#3a1f04] shadow-xl">
                    🔥 مشعل جديد!
                  </div>
                </motion.div>
              )}

              {screen === 'win' && result && (
                <>
                  <Confetti />
                  <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="rounded-3xl bg-[#140f33]/70 px-6 py-2 text-center backdrop-blur-sm"
                    >
                      <div className="text-3xl font-black text-amber-300">انفتح باب المعبد!</div>
                      <StarsRow earned={result.stars} />
                    </motion.div>
                  </div>
                </>
              )}

              {screen === 'lose' && (
                <div className="pointer-events-none absolute inset-x-0 top-6 z-20 flex justify-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="rounded-3xl bg-black/55 px-6 py-3 text-center"
                  >
                    <div className="text-3xl font-black text-rose-300">انطفأت المشاعل</div>
                    <div className="mt-1 text-base font-bold text-white/80">أجبت {result?.correct ?? 0} من {run.deck.length} بشكل صحيح</div>
                  </motion.div>
                </div>
              )}

              <BanaCorner excited={streak >= 3 || screen === 'win'} message={banaMsg} />
            </div>

            {/* اللوحة السفلية */}
            <div className="flex min-h-0 flex-[4] flex-col justify-center gap-2 overflow-y-auto bg-gradient-to-b from-[#1d1546] to-[#120c2e] px-3 pb-3 pt-3">
              {screen === 'play' && q && q.kind === 'squares' && (
                <div className="grid grid-cols-3 gap-3">
                  {q.options.map((opt) => {
                    const isAns = opt === q.ans;
                    const isPicked = run.picked === opt;
                    let cls = 'border-[#6b4a26] bg-gradient-to-b from-[#c9a06a] to-[#a67b44] text-[#2b1808]';
                    if (run.feedback) {
                      if (isAns) cls = 'border-emerald-800 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white';
                      else if (isPicked) cls = 'border-rose-900 bg-gradient-to-b from-rose-400 to-rose-600 text-white';
                      else cls = 'border-[#3a2a1a] bg-[#6b5a48]/60 text-white/40';
                    }
                    return (
                      <motion.button
                        key={opt}
                        type="button"
                        disabled={run.feedback !== null}
                        whileTap={{ scale: 0.94, y: 4 }}
                        onClick={() => pickOption(opt)}
                        dir="ltr"
                        className={`h-28 rounded-2xl border-b-8 text-3xl font-black shadow-lg ${cls}`}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {screen === 'play' && q && q.kind === 'roots' && (
                <div className="flex min-h-0 flex-1 flex-col gap-2">
                  <div dir="ltr" className="flex h-14 shrink-0 items-center justify-center gap-3">
                    {[0, 1].map((i) => {
                      const ch = run.input[i] ?? '';
                      const bad = run.feedback && run.feedback !== 'right';
                      return (
                        <div
                          key={i}
                          className={`flex h-14 w-14 items-center justify-center rounded-xl border-4 text-4xl font-black ${
                            run.feedback === 'right'
                              ? 'border-emerald-400 bg-emerald-500/30 text-emerald-200'
                              : bad
                                ? 'border-rose-400 bg-rose-500/30 text-rose-200'
                                : 'border-sky-400/60 bg-[#0e2a55] text-sky-200'
                          }`}
                        >
                          {ch}
                        </div>
                      );
                    })}
                  </div>
                  <div dir="ltr" className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
                      <motion.button
                        key={d}
                        type="button"
                        whileTap={{ scale: 0.93, y: 3 }}
                        disabled={run.feedback !== null}
                        onClick={() => pressDigit(d)}
                        className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] text-2xl font-black"
                      >
                        {d}
                      </motion.button>
                    ))}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      onClick={clearInput}
                      aria-label="مسح"
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-rose-950 bg-gradient-to-b from-rose-500 to-rose-700 text-lg font-black"
                    >
                      مسح
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      disabled={run.feedback !== null}
                      onClick={() => pressDigit('0')}
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] text-2xl font-black"
                    >
                      0
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.93, y: 3 }}
                      onClick={pressBackspace}
                      aria-label="حذف رقم"
                      className="min-h-[2.6rem] rounded-2xl border-b-4 border-[#5a3a0c] bg-gradient-to-b from-amber-500 to-amber-700 text-2xl font-black"
                    >
                      ⌫
                    </motion.button>
                  </div>
                </div>
              )}

              {screen === 'win' && result && (
                <div className="flex flex-col gap-2.5">
                  <div className="grid grid-cols-2 gap-2 text-center text-sm font-extrabold">
                    <div className="rounded-xl bg-white/10 px-2 py-2">
                      صحيحة <span className="text-lg text-emerald-300" dir="ltr">{result.correct}/{result.total}</span>
                    </div>
                    <div className="rounded-xl bg-white/10 px-2 py-2">
                      متوسط الزمن{' '}
                      <span className="text-lg text-amber-300" dir="ltr">
                        {result.avgSec !== null ? `${result.avgSec.toFixed(1)}ث` : '—'}
                      </span>
                    </div>
                  </div>

                  {(result.newStreak || result.newSpeed) && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2, type: 'spring' }}
                      className="rounded-xl border-2 border-amber-300 bg-amber-400/20 px-3 py-1.5 text-center text-sm font-black text-amber-200"
                    >
                      {result.newStreak && <div>🏆 رقم قياسي جديد: أطول سلسلة {result.streakBest}</div>}
                      {result.newSpeed && <div>⚡ رقم قياسي جديد: السرعة {result.speedPts} نقطة</div>}
                    </motion.div>
                  )}

                  {(result.unlockedStage || result.rootsUnlocked) && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1.6 }}
                      className="rounded-xl border-2 border-sky-300/60 bg-sky-400/15 px-3 py-1.5 text-center text-sm font-black text-sky-200"
                    >
                      {result.unlockedStage && <div>🗺️ منطقة جديدة: {result.unlockedStage.name}</div>}
                      {result.rootsUnlocked && <div>🔑 فُتحت أسرار الجذور على الخريطة</div>}
                    </motion.div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => (canGoNext && resultNext ? launchStage(resultNext.id) : toMap())}
                      className="h-14 flex-1 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                    >
                      {canGoNext ? 'المنطقة التالية' : 'الخريطة'}
                    </button>
                    {result.stars < 3 && (
                      <button
                        type="button"
                        aria-label="أعد المرحلة"
                        onClick={() => resultStage && launchStage(resultStage.id)}
                        className="flex h-14 w-14 items-center justify-center rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] active:translate-y-1 active:border-b-4"
                      >
                        <RotateCcw className="h-6 w-6" />
                      </button>
                    )}
                    {canGoNext && (
                      <button
                        type="button"
                        onClick={toMap}
                        className="h-14 rounded-2xl border-b-8 border-[#2c2160] bg-gradient-to-b from-[#6c58c9] to-[#4a3a9a] px-4 text-base font-black active:translate-y-1 active:border-b-4"
                      >
                        الخريطة
                      </button>
                    )}
                  </div>
                </div>
              )}

              {screen === 'lose' && result && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl bg-white/10 px-3 py-2 text-center text-base font-extrabold">
                    أطول سلسلة لك في هذه الجولة <span className="text-amber-300" dir="ltr">{result.streakBest}</span>
                  </div>
                  {result.newStreak && (
                    <div className="rounded-xl border-2 border-amber-300 bg-amber-400/20 px-3 py-1.5 text-center text-sm font-black text-amber-200">
                      🏆 رقم قياسي جديد: أطول سلسلة {result.streakBest}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => resultStage && launchStage(resultStage.id)}
                    className="flex h-16 items-center justify-center gap-2 rounded-2xl border-b-8 border-[#a4620f] bg-gradient-to-b from-amber-300 to-amber-500 text-2xl font-black text-[#2b1808] active:translate-y-1 active:border-b-4"
                  >
                    <RotateCcw className="h-6 w-6" />
                    <span>حاول مجدداً</span>
                  </button>
                  <button
                    type="button"
                    onClick={toMap}
                    className="h-12 rounded-2xl bg-white/10 text-lg font-black active:scale-95"
                  >
                    الخريطة
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════ تنبيه عائم ═══════════ */}
        <AnimatePresence>
          {notice && (
            <motion.div
              key={notice}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="pointer-events-none absolute inset-x-4 top-16 z-50 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black leading-snug text-[#2b1a55] shadow-2xl"
              role="status"
            >
              {notice}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════ الأرقام القياسية ═══════════ */}
        <AnimatePresence>
          {recordsOpen && (
            <motion.div
              className="absolute inset-0 z-50 flex items-end bg-black/65"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRecordsOpen(false)}
            >
              <motion.div
                initial={{ y: 80 }}
                animate={{ y: 0 }}
                exit={{ y: 80 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                className="max-h-[85%] w-full overflow-y-auto rounded-t-3xl bg-[#1d1546] p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xl font-black text-amber-300">
                    <Trophy className="h-6 w-6" />
                    <span>الأرقام القياسية</span>
                  </div>
                  <button
                    type="button"
                    aria-label="إغلاق"
                    onClick={() => setRecordsOpen(false)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 text-sm font-extrabold text-white/70">
                      أطول سلسلة إجابات صحيحة {streakEntry ? `· ${streakEntry.value}` : ''}
                    </div>
                    <HighScoreBadge key={`streak-${scoreVersion}`} gameId={GAME_ID} variant="full" />
                  </div>
                  <div>
                    <div className="mb-1 text-sm font-extrabold text-white/70">
                      نقاط السرعة {speedEntry ? `· ${speedEntry.value}` : ''}
                      {progress.bestSpeedSec !== null ? ` · أسرع متوسط ${progress.bestSpeedSec}ث` : ''}
                    </div>
                    <HighScoreBadge key={`speed-${scoreVersion}`} gameId={SPEED_GAME_ID} variant="full" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}