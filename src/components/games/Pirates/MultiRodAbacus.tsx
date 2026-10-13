// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/MultiRodAbacus.tsx  (v3)
// ═══════════════════════════════════════════════════════════════════
//
// معداد متعدد الأعمدة للعرض (الجسر التعليمي).
//
// الوضعان:
//   • عادي  : معداد واحد كامل العرض (الضرب) · 5 أعمدة
//   • compact: معدادان متجاوران (القسمة: المقسوم 🔴 + الناتج 🟢)
//              نفس الرسم بخطوط وشرائح أكبر في الإحداثيات كي تبقى مقروءة
//              بعد التصغير إلى نصف العرض.
//
// التخطيط من الأعلى للأسفل:
//   قراءة الأرقام فوق الأعمدة ← الإطار والخرزات ← أسماء المنازل
//   ← شرائح "+2" "−1" ← قوس + ناتج الخطوة.
//
// tone: لون الليزر (blue عام · red مقسوم · green ناتج).
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

export interface RodChip {
  rod: number;      // فهرس العمود من اليسار
  text: string;     // "+2" · "−1" · "7"
  dim?: boolean;    // صفر مكتوب (قاعدة المنزلتين)
}

export type AbacusTone = 'blue' | 'red' | 'green';

interface MultiRodAbacusProps {
  digits: number[];            // أرقام المعداد (يسار → يمين)
  activeRods?: number[];       // الأعمدة المضاءة (فهرس من اليسار)
  unitRodIndex?: number;
  columns?: number;
  chips?: RodChip[];
  arcText?: string;
  changedRods?: number[];      // أعمدة تغيّر رقمها في هذه الخطوة
  carryRods?: number[];        // أعمدة وصلها حمل
  tone?: AbacusTone;
  compact?: boolean;
}

const LABELS = ['ع.آلاف', 'آلاف', 'مئات', 'عشرات', 'آحاد'];

const TONES: Record<AbacusTone, {
  actFill: string; actStroke: string; dimFill: string; dimStroke: string;
  glow: string; hi: string; label: string; chipFill: string; chipStroke: string; chipText: string;
}> = {
  blue:  { actFill: '#075985', actStroke: '#7dd3fc', dimFill: '#1e293b', dimStroke: '#334155', glow: '#38bdf8', hi: '#bae6fd', label: '#38bdf8', chipFill: '#0c4a6e', chipStroke: '#38bdf8', chipText: '#e0f2fe' },
  red:   { actFill: '#991b1b', actStroke: '#fca5a5', dimFill: '#450a0a', dimStroke: '#7f1d1d', glow: '#f87171', hi: '#fecaca', label: '#f87171', chipFill: '#7f1d1d', chipStroke: '#f87171', chipText: '#fee2e2' },
  green: { actFill: '#166534', actStroke: '#86efac', dimFill: '#052e16', dimStroke: '#14532d', glow: '#4ade80', hi: '#bbf7d0', label: '#4ade80', chipFill: '#14532d', chipStroke: '#4ade80', chipText: '#dcfce7' },
};

const MultiRodAbacus: React.FC<MultiRodAbacusProps> = ({
  digits = [0, 0, 0, 0, 0],
  activeRods = [],
  unitRodIndex,
  columns = 5,
  chips = [],
  arcText,
  changedRods = [],
  carryRods = [],
  tone = 'blue',
  compact = false,
}) => {
  const T = TONES[tone];
  const unitIdx = unitRodIndex ?? columns - 1;

  // مقاسات التخطيط (إحداثيات viewBox عرضها 320)
  const L = compact
    ? { top: 46, digitFont: 34, digitBase: 42, cellY: 8, cellH: 42, cellW: 54, labelFont: 17, chipY: 270, chipW: 60, chipH: 30, chipFont: 22, brY: 304, brCtl: 318, pillY: 320, pillH: 30, pillFont: 19, vbH: 356, carryH: 14, carryFont: 10 }
    : { top: 34, digitFont: 22, digitBase: 34, cellY: 12, cellH: 28, cellW: 34, labelFont: 10, chipY: 250, chipW: 34, chipH: 18, chipFont: 12, brY: 272, brCtl: 283, pillY: 284, pillH: 18, pillFont: 11, vbH: 306, carryH: 11, carryFont: 7.5 };

  const startX = 52;
  const endX = 268;
  const rodSpacing = columns > 1 ? (endX - startX) / (columns - 1) : 0;
  const rodX = (i: number) => startX + i * rodSpacing;

  const labels =
    columns <= 5
      ? LABELS.slice(5 - columns)
      : Array.from({ length: columns }, (_, i) => String(columns - i));

  const firstNonZero = digits.findIndex((d) => d !== 0);
  const beadSpring = { type: 'spring' as const, stiffness: 500, damping: 30 };

  // الشرائح داخل المعداد فقط
  const vis = chips.filter((c) => c.rod >= 0 && c.rod < columns);
  const chipXs = vis.map((c) => rodX(c.rod));
  const hasArc = !!arcText && vis.length > 0;
  const arcMin = chipXs.length ? Math.min(...chipXs) : 0;
  const arcMax = chipXs.length ? Math.max(...chipXs) : 0;
  const pillW = arcText ? Math.max(compact ? 110 : 64, arcText.length * (compact ? 11 : 6.6) + (compact ? 28 : 18)) : 0;
  const pillCx = Math.min(316 - pillW / 2, Math.max(pillW / 2 + 4, (arcMin + arcMax) / 2));

  return (
    <div className="w-full flex items-center justify-center select-none">
      <svg
        viewBox={`0 0 320 ${L.vbH}`}
        className={`w-full h-auto drop-shadow-2xl ${compact ? '' : 'max-w-[320px]'}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="woodFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#572507" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d4a017" />
          </linearGradient>
          <filter id="laser-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ═══ قراءة الأرقام فوق كل عمود ═══ */}
        {Array.from({ length: columns }).map((_, i) => {
          const d = digits[i] ?? 0;
          const dim = firstNonZero === -1 || i < firstNonZero;
          const changed = changedRods.includes(i);
          const active = activeRods.includes(i);
          const x = rodX(i);
          return (
            <g key={`dg-${i}`}>
              {changed && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={x - L.cellW / 2} y={L.cellY + (compact ? 4 : 0)} width={L.cellW} height={L.cellH} rx={9}
                  fill="#f59e0b" fillOpacity={0.18}
                  stroke="#fbbf24" strokeOpacity={0.75} strokeWidth={1.5}
                />
              )}
              <motion.text
                key={`${i}-${d}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                x={x} y={L.digitBase}
                textAnchor="middle"
                fontSize={L.digitFont} fontWeight={900} fontFamily="monospace"
                fill={changed ? '#fde68a' : dim ? '#334155' : active ? T.hi : '#cbd5e1'}
              >
                {d}
              </motion.text>
              {carryRods.includes(i) && (
                <g>
                  <rect x={x - L.cellW / 2} y={0} width={L.cellW} height={L.carryH} rx={L.carryH / 2} fill="#b45309" />
                  <text x={x} y={L.carryH - 2.4} textAnchor="middle" fontSize={L.carryFont} fontWeight={800} fill="#fef3c7">
                    حمل 1
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ═══ الإطار والخرزات ═══ */}
        <g transform={`translate(0, ${L.top})`}>
          <rect x="14" y="10" width="292" height="182" rx="12" fill="url(#woodFrame)" stroke="#92400e" strokeWidth="3" />
          <rect x="24" y="20" width="272" height="162" rx="8" fill="#090d16" fillOpacity="0.85" />
          <rect x="20" y="84" width="280" height="6" rx="2" fill="url(#beamGrad)" stroke="#b45309" strokeWidth="1" />

          {Array.from({ length: columns }).map((_, i) => {
            const x = rodX(i);
            const isActiveRod = activeRods.includes(i);
            const isUnitRod = unitIdx === i;
            const digit = digits[i] ?? 0;
            const hasUpper = digit >= 5;
            const lowerVal = digit % 5;
            const upperY = hasUpper ? 64 : 36;

            const beadFill = isActiveRod ? T.actFill : T.dimFill;
            const beadStroke = isActiveRod ? T.actStroke : T.dimStroke;

            return (
              <g key={i} opacity={isActiveRod ? 1 : 0.62} style={{ transition: 'opacity 0.2s ease' }}>
                <line x1={x} y1="26" x2={x} y2="178" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                {isUnitRod && <circle cx={x} cy="87" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />}
                {isActiveRod && (
                  <motion.line
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    x1={x} y1="26" x2={x} y2="178"
                    stroke={T.glow} strokeWidth="5" strokeLinecap="round"
                    filter="url(#laser-glow)"
                  />
                )}

                {/* الجدة */}
                <motion.g initial={false} animate={{ y: upperY }} transition={beadSpring}>
                  <rect
                    x={x - 21} y="0" width="42" height="18" rx="9"
                    fill={beadFill} stroke={beadStroke}
                    strokeWidth={isActiveRod ? 2 : 1}
                    filter={isActiveRod ? 'url(#laser-glow)' : undefined}
                  />
                  <rect x={x - 14} y="3" width="28" height="3" rx="1.5" fill={isActiveRod ? T.hi : '#64748b'} pointerEvents="none" />
                </motion.g>

                {/* الخرزات السفلية */}
                {[0, 1, 2, 3].map((b) => {
                  const beadY = b < lowerVal ? 90 + b * 18 : 104 + b * 18;
                  return (
                    <motion.g key={b} initial={false} animate={{ y: beadY }} transition={beadSpring}>
                      <rect
                        x={x - 21} y="0" width="42" height="18" rx="9"
                        fill={beadFill} stroke={beadStroke}
                        strokeWidth={isActiveRod ? 2 : 1}
                        filter={isActiveRod ? 'url(#laser-glow)' : undefined}
                      />
                      <rect x={x - 14} y="3" width="28" height="3" rx="1.5" fill={isActiveRod ? T.hi : '#64748b'} pointerEvents="none" />
                    </motion.g>
                  );
                })}

                <text
                  x={x} y="207" textAnchor="middle"
                  fill={isActiveRod ? T.label : '#94a3b8'}
                  fontSize={L.labelFont} fontWeight="bold"
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </g>

        {/* ═══ شرائح الخطوة تحت الأعمدة ═══ */}
        {vis.map((c) => {
          const x = rodX(c.rod);
          return (
            <motion.g
              key={`chip-${c.rod}-${c.text}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <rect
                x={x - L.chipW / 2} y={L.chipY} width={L.chipW} height={L.chipH} rx={L.chipH / 2}
                fill={c.dim ? '#1e293b' : T.chipFill}
                stroke={c.dim ? '#475569' : T.chipStroke} strokeWidth={compact ? 2 : 1.5}
              />
              <text
                x={x} y={L.chipY + L.chipH * 0.72} textAnchor="middle"
                fontSize={L.chipFont} fontWeight={900} fontFamily="monospace"
                fill={c.dim ? '#94a3b8' : T.chipText}
              >
                {c.text}
              </text>
            </motion.g>
          );
        })}

        {/* قوس يجمع الشرائح + ناتج الخطوة */}
        {hasArc && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {vis.length > 1 ? (
              <path
                d={`M ${arcMin} ${L.brY} Q ${(arcMin + arcMax) / 2} ${L.brCtl} ${arcMax} ${L.brY}`}
                fill="none" stroke={T.chipStroke} strokeWidth={compact ? 3 : 2} strokeLinecap="round"
              />
            ) : (
              <line x1={arcMin} y1={L.brY - 2} x2={arcMin} y2={L.pillY} stroke={T.chipStroke} strokeWidth={compact ? 3 : 2} strokeLinecap="round" />
            )}
            <rect
              x={pillCx - pillW / 2} y={L.pillY} width={pillW} height={L.pillH} rx={L.pillH / 2}
              fill={T.chipFill} stroke={T.chipStroke} strokeWidth={compact ? 2 : 1.5}
            />
            <text
              x={pillCx} y={L.pillY + L.pillH * 0.72} textAnchor="middle"
              fontSize={L.pillFont} fontWeight={900} fontFamily="monospace" fill={T.chipText}
            >
              {arcText}
            </text>
          </motion.g>
        )}
      </svg>
    </div>
  );
};

export default MultiRodAbacus;
