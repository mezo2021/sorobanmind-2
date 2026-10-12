// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/PirateScene.tsx
// ═══════════════════════════════════════════════════════════════════
//
// مشهد البحر SVG · 360×220
// 3 حالات جوية · سفينتان · جزيرة تنمو · مطر · برق
//
// الإصلاحات عن نسخة جيميني:
//   1. حذف preserveAspectRatio="none" (كان يمدد المشهد)
//   2. الموجة: amplitude في path بدل transform scale
//   3. السفن: فصل transform الوضعي عن motion Sway
//   4. الجزيرة: static transform بدل transformOrigin
//   5. البرق: useMemo لموضع عشوائي
// ═══════════════════════════════════════════════════════════════════

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PirateSceneProps {
  gap: number;              // 0-100
  elapsedSec: number;       // الوقت المنقضي (للجزيرة)
  isLightning: boolean;     // وميض البرق
  weather: 'sunny' | 'rain' | 'storm';  // 3 حالات
}

const PirateScene: React.FC<PirateSceneProps> = ({
  gap,
  elapsedSec,
  isLightning,
  weather,
}) => {
  const isVictory = gap >= 100;

  // ═══ ألوان السماء والبحر ═══
  let skyTop = '#38bdf8';
  let skyBottom = '#bae6fd';
  let seaTop = '#0e7490';
  let seaBottom = '#164e63';

  if (isVictory) {
    skyTop = '#fcd34d';
    skyBottom = '#fed7aa';
    seaTop = '#34d399';
    seaBottom = '#059669';
  } else if (weather === 'rain') {
    skyTop = '#475569';
    skyBottom = '#94a3b8';
    seaTop = '#155e75';
    seaBottom = '#134e4a';
  } else if (weather === 'storm') {
    skyTop = '#1e293b';
    skyBottom = '#475569';
    seaTop = '#0f2e3d';
    seaBottom = '#082f49';
  }

  // ═══ نمو الجزيرة مع الوقت ═══
  const islandScale = Math.min(1, 0.25 + 0.75 * (elapsedSec / 90));

  // ═══ مواقع السفن ═══
  const pirateX = 110 - 1.1 * gap;
  const playerX = 140 + 0.8 * gap;
  const shipScale = 1.1 - 0.4 * (gap / 100);
  const shipYOffset = -0.1 * gap;

  // ═══ تمايل السفن ═══
  const swayAngle = weather === 'storm' ? 6 : weather === 'rain' ? 4 : 1.5;
  const swayDuration = weather === 'storm' ? 1.6 : weather === 'rain' ? 2.0 : 3.2;

  // ═══ المطر ═══
  const rainDropsCount = weather === 'storm' ? 60 : weather === 'rain' ? 18 : 0;
  const rainDrops = Array.from({ length: rainDropsCount });

  // ═══ مضاعف الأمواج ═══
  const waveAmp = weather === 'storm' ? 2.2 : 1.0;
  const waveSpeed = weather === 'storm' ? 0.55 : 1.0;

  // ═══ البرق: موضع عشوائي لكل ظهور ═══
  const lightningX = useMemo(
    () => 40 + Math.random() * 160,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLightning],
  );

  const waves = {
    back:  { base: 112, amp: 8,  period: 90,  dur: 9 },
    mid:   { base: 135, amp: 12, period: 120, dur: 6 },
    front: { base: 165, amp: 15, period: 180, dur: 4 },
  };

  return (
    <div className="w-full h-full relative overflow-hidden rounded-2xl shadow-inner bg-slate-950">
      <svg
        viewBox="0 0 360 220"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>
          <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={seaTop} />
            <stop offset="100%" stopColor={seaBottom} />
          </linearGradient>
        </defs>

        {/* ═══ 1. السماء ═══ */}
        <rect width="360" height="112" fill="url(#skyGrad)" />

        {/* السحب (تختفي في العاصفة) */}
        {weather !== 'storm' && (
          <motion.g
            animate={{ x: [-15, 15, -15] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            opacity={weather === 'sunny' ? 0.5 : 0.25}
            fill="#ffffff"
          >
            <path d="M 40,25 Q 50,15 65,25 Q 80,20 90,30 Q 100,40 40,40 Z" />
            <path d="M 230,20 Q 245,10 260,20 Q 275,15 290,25 Q 305,35 230,35 Z" />
          </motion.g>
        )}

        {/* ═══ 2. البرق (في العاصفة فقط) ═══ */}
        {weather === 'storm' && isLightning && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 0.8, 0] }}
            transition={{ duration: 0.2 }}
          >
            <path
              d={`M ${lightningX},45 L ${lightningX - 8},63 L ${lightningX + 6},71 L ${lightningX - 10},95 L ${lightningX + 4},103 L ${lightningX - 6},125`}
              stroke="#fef9c3"
              strokeWidth="3"
              fill="none"
              filter="drop-shadow(0 0 6px #fef08a)"
            />
          </motion.g>
        )}

        {/* ═══ 3. المطر ═══ */}
        {rainDrops.map((_, i) => {
          const randomX = (i * 23) % 360;
          const randomDelay = (i * 0.03) % 0.5;
          return (
            <motion.line
              key={i}
              x1={randomX}
              y1={0}
              x2={randomX - 3}
              y2={12}
              stroke="#94a3b8"
              strokeWidth="1"
              strokeOpacity="0.7"
              animate={{ y: [0, 220], x: [0, -15] }}
              transition={{
                repeat: Infinity,
                duration: weather === 'storm' ? 0.3 : 0.5,
                delay: randomDelay,
                ease: 'linear',
              }}
            />
          );
        })}

        {/* خط الأفق */}
        <line x1="0" y1="112" x2="360" y2="112" stroke={seaTop} strokeWidth="1.5" />

        {/* ═══ 4. الجزيرة (static transform · تنمو مع الوقت) ═══ */}
        <g transform={`translate(290, 106) scale(${islandScale})`}>
          <path
            d="M 0,0 Q 20,-28 50,-22 Q 70,-34 90,-18 Q 110,-8 120,0 Z"
            fill="#15803d"
          />
          <path
            d="M 50,-22 Q 55,-40 62,-55"
            stroke="#78350f"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 62,-55 Q 50,-65 35,-60 M 62,-55 Q 75,-68 90,-60 M 62,-55 Q 65,-75 62,-80"
            stroke="#22c55e"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {isVictory && (
            <g transform="translate(40, -35)">
              <line x1="0" y1="0" x2="0" y2="20" stroke="#0f172a" strokeWidth="2" />
              <polygon points="0,0 15,6 0,12" fill="#fbbf24" />
            </g>
          )}
        </g>

        {/* ═══ 5. البحر ═══ */}
        <rect x="0" y="112" width="360" height="108" fill="url(#seaGrad)" />

        {/* الموجة الخلفية */}
        <motion.path
          d={`M 0,${waves.back.base} q 22.5,${-waves.back.amp * waveAmp} 45,0 t 45,0 t 45,0 t 45,0 t 45,0 t 45,0 t 45,0 t 45,0 L 720,220 L 0,220 Z`}
          fill="#0284c7"
          opacity="0.5"
          animate={{ x: [0, -90] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: waves.back.dur * waveSpeed,
          }}
        />

        {/* الموجة الوسطى (مستقر السفن) */}
        <motion.path
          d={`M 0,${waves.mid.base} q 30,${-waves.mid.amp * waveAmp} 60,0 t 60,0 t 60,0 t 60,0 t 60,0 t 60,0 L 720,220 L 0,220 Z`}
          fill="#0369a1"
          opacity="0.75"
          animate={{ x: [0, -120] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: waves.mid.dur * waveSpeed,
          }}
        />

        {/* ═══ 6. سفينة القراصنة ═══ */}
        <g transform={`translate(${pirateX}, ${120 + shipYOffset}) scale(${shipScale})`}>
          <motion.g
            animate={{
              rotate: [-swayAngle, swayAngle, -swayAngle],
              y: [-3, 3, -3],
            }}
            transition={{
              repeat: Infinity,
              duration: swayDuration,
              ease: 'easeInOut',
            }}
          >
            <path d="M 4,46 H 76 L 66,62 Q 40,68 14,62 Z" fill="#1c1917" />
            <path d="M 4,46 H 76 L 72,52 H 10 Z" fill="#b91c1c" />
            <path d="M 40,6 V 46" stroke="#451a03" strokeWidth="3" />
            <path d="M 43,9 Q 70,24 63,41 H 43 Z" fill="#111827" />
            <path d="M 37,13 Q 16,26 20,41 H 37 Z" fill="#1f2937" />
            <path d="M 40,2 L 56,6 L 40,10 Z" fill="#030712" />
            <circle cx="46" cy="6" r="1.5" fill="#f8fafc" />
            <path d="M 76,46 L 90,38" stroke="#1c1917" strokeWidth="2.5" fill="none" />
          </motion.g>
        </g>

        {/* ═══ 7. سفينتك ═══ */}
        <g transform={`translate(${playerX}, ${115 + shipYOffset}) scale(${shipScale})`}>
          <motion.g
            animate={{
              rotate: [swayAngle, -swayAngle, swayAngle],
              y: [3, -3, 3],
            }}
            transition={{
              repeat: Infinity,
              duration: swayDuration,
              delay: 0.8,
              ease: 'easeInOut',
            }}
          >
            <path d="M 4,46 H 76 L 66,62 Q 40,68 14,62 Z" fill="#92400e" />
            <path d="M 4,46 H 76 L 72,52 H 10 Z" fill="#fbbf24" />
            <path d="M 40,6 V 46" stroke="#451a03" strokeWidth="3" />
            <path d="M 43,9 Q 70,24 63,41 H 43 Z" fill="#fef3c7" />
            <path d="M 37,13 Q 16,26 20,41 H 37 Z" fill="#fffbeb" />
            <path d="M 40,2 L 56,6 L 40,10 Z" fill="#38bdf8" />
            <path d="M 76,46 L 90,38" stroke="#92400e" strokeWidth="2.5" fill="none" />
          </motion.g>
        </g>

        {/* الموجة الأمامية */}
        <motion.path
          d={`M 0,${waves.front.base} q 45,${-waves.front.amp * waveAmp} 90,0 t 90,0 t 90,0 t 90,0 L 720,220 L 0,220 Z`}
          fill="#0284c7"
          opacity="0.9"
          animate={{ x: [0, -180] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: waves.front.dur * waveSpeed,
          }}
        />
      </svg>
    </div>
  );
};

export default PirateScene;