// ═══════════════════════════════════════════════════════════════════
// src/components/games/Sorobania/SorobaniaScenes.tsx
// 🎨 المشاهد والرسوم — SVG + تأثيرات الاحتفال
// ═══════════════════════════════════════════════════════════════════
// الدور: كل ما يُرسم بالـ SVG أو يحتفل:
//   • PlayScene  : مشهد اللعب (معبد · جسر حجري · بحر · 4 مشاعل · مصباح الروح)
//   • MapScene   : خريطة الجزيرة وعُقد المراحل الثماني
//   • Confetti   : قصاصات الفوز
//   • Burst      : انفجار شرارات عند الإجابة
//   • StarsRow   : النجوم الثلاث المتحركة
//   • starPoints : شكل النجمة (يُستخدم أيضاً في الخريطة)
//
// يستورده: SorobaniaGame
// يعتمد على: sorobaniaData (المراحل والأنواع) · framer-motion
// لا يحتوي أي منطق لعب — يستقبل props فقط.
//
// متى تعدّله؟ لتغيير شكل المعبد أو الخريطة أو الألوان أو التأثيرات.
// ═══════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

import {
  MAX_TORCHES,
  ROOTS_UNLOCK_AT,
  range,
  rnd,
  STAGES,
  isUnlocked,
} from './sorobaniaData';
import type {
  StageDef,
  Progress,
  BurstState,
} from './sorobaniaData';

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

export const PlayScene: React.FC<PlaySceneProps> = ({ stage, pos, torches }) => {
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

      {/* السماء */}
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

      {/* الجبال البعيدة */}
      <path d="M0 330 L50 280 L95 318 L150 262 L210 322 L265 276 L320 316 L360 290 L360 350 L0 350 Z" fill="#000" opacity="0.28" />

      {/* البحر */}
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

      {/* الجزيرة */}
      <ellipse cx="180" cy="342" rx="132" ry="16" fill="#241a33" />
      <ellipse cx="180" cy="337" rx="124" ry="13" fill="#4a3a5a" />
      <Palm x={92} y={338} s={1} />
      <Palm x={272} y={338} s={0.9} flip />

      {/* المعبد */}
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

      {/* الحجارة (الجسر) */}
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

      {/* ظلام يزحف كلما انطفأت مشاعل */}
      <rect width="360" height="500" fill="#05030f" opacity={(MAX_TORCHES - torches) * 0.08} />

      {/* المشاعل = الحيوات */}
      {TORCH_POS.map((t, k) => (
        <TorchSvg key={k} x={t.x} y={t.y} lit={k < torches} seed={k} />
      ))}

      {/* مصباح الروح */}
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

export const starPoints = '12,2 15,9 22,9.5 16.5,14.5 18.5,22 12,18 5.5,22 7.5,14.5 2,9.5 9,9';

export const MapScene: React.FC<{
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

      {/* أمواج */}
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

      {/* الجزيرة */}
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

      {/* أشجار */}
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

      {/* الطرق */}
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

      {/* المعبد */}
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

      {/* كهف البلّور */}
      <g transform="translate(300 128)">
        <path d="M-26 22 V2 Q-26 -20 0 -20 Q26 -20 26 2 V22 Z" fill="#1a1236" />
        <g opacity={rootsOpen ? 1 : 0.35}>
          <circle r="32" cy="2" fill="url(#m-crystal)" />
          <path d="M-10 22 L-6 -2 L-2 22 Z" fill="#6df0e0" />
          <path d="M-2 22 L4 -10 L10 22 Z" fill="#9ffaf0" />
          <path d="M8 22 L13 4 L18 22 Z" fill="#6df0e0" />
        </g>
      </g>

      {/* عُقد المراحل */}
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

export const Confetti: React.FC<{ count?: number }> = ({ count = 56 }) => {
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

export const Burst: React.FC<{ burst: BurstState }> = ({ burst }) => {
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

export const StarsRow: React.FC<{ earned: number }> = ({ earned }) => (
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
