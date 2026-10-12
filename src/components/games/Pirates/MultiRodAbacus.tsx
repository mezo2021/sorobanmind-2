// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/MultiRodAbacus.tsx  (v2)
// ═══════════════════════════════════════════════════════════════════
//
// معداد متعدد الأعمدة للعرض (الجسر التعليمي)
//
// التخطيط (viewBox 320 × 306) من الأعلى إلى الأسفل:
//   ┌ قراءة الأرقام فوق كل عمود (الصفر البادئ باهت · المتغيّر مضيء)
//   ├ إطار المعداد (الخرزات + شعاع الليزر على الأعمدة المستعملة)
//   ├ أسماء المنازل (آحاد · عشرات · مئات ...)
//   ├ شرائح "+2" "+8" تحت كل عمود: ما يُكتب في هذه الخطوة
//   └ قوس يجمع الشرائح + ناتج الخطوة "4×7 = 28"
//
// لا شيء يُرسم فوق الخرزات (كان الإجمالي والقوس يغطّيانها في v1).
// ═══════════════════════════════════════════════════════════════════

import React from 'react';
import { motion } from 'framer-motion';

export interface RodChip {
  rod: number;      // فهرس العمود من اليسار
  text: string;     // "+2"
  dim?: boolean;    // صفر مكتوب (قاعدة المنزلتين)
}

interface MultiRodAbacusProps {
  digits: number[];            // أرقام الناتج (يسار → يمين)
  activeRods?: number[];       // الأعمدة المضاءة (فهرس من اليسار)
  unitRodIndex?: number;
  columns?: number;
  chips?: RodChip[];
  arcText?: string;            // "4×7 = 28"
  changedRods?: number[];      // أعمدة تغيّر رقمها في هذه الخطوة
  carryRods?: number[];        // أعمدة وصلها حمل
}

const LABELS = ['ع.آلاف', 'آلاف', 'مئات', 'عشرات', 'آحاد'];
const TOP = 34;                // إزاحة الإطار تحت صف الأرقام

const MultiRodAbacus: React.FC<MultiRodAbacusProps> = ({
  digits = [0, 0, 0, 0, 0],
  activeRods = [],
  unitRodIndex = 4,
  columns = 5,
  chips = [],
  arcText,
  changedRods = [],
  carryRods = [],
}) => {
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

  // ─── القوس + الناتج ───
  const chipXs = chips.map((c) => rodX(c.rod));
  const hasArc = !!arcText && chips.length > 0;
  const arcMin = chipXs.length ? Math.min(...chipXs) : 0;
  const arcMax = chipXs.length ? Math.max(...chipXs) : 0;
  const pillW = arcText ? Math.max(64, arcText.length * 6.6 + 18) : 0;
  const pillCx = Math.min(316 - pillW / 2, Math.max(pillW / 2 + 4, (arcMin + arcMax) / 2));

  return (
    <div className="w-full flex items-center justify-center select-none">
      <svg viewBox="0 0 320 306" className="w-full h-auto max-w-[320px] drop-shadow-2xl" style={{ overflow: 'visible' }}>
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
                  x={x - 17} y={12} width={34} height={28} rx={9}
                  fill="#f59e0b" fillOpacity={0.18}
                  stroke="#fbbf24" strokeOpacity={0.75} strokeWidth={1.5}
                />
              )}
              <motion.text
                key={`${i}-${d}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                x={x} y={34}
                textAnchor="middle"
                fontSize={22} fontWeight={900} fontFamily="monospace"
                fill={changed ? '#fde68a' : dim ? '#334155' : active ? '#7dd3fc' : '#cbd5e1'}
              >
                {d}
              </motion.text>
              {carryRods.includes(i) && (
                <g>
                  <rect x={x - 17} y={0} width={34} height={11} rx={5.5} fill="#b45309" />
                  <text x={x} y={8.6} textAnchor="middle" fontSize={7.5} fontWeight={800} fill="#fef3c7">
                    حمل 1
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ═══ الإطار والخرزات ═══ */}
        <g transform={`translate(0, ${TOP})`}>
          <rect x="14" y="10" width="292" height="182" rx="12" fill="url(#woodFrame)" stroke="#92400e" strokeWidth="3" />
          <rect x="24" y="20" width="272" height="162" rx="8" fill="#090d16" fillOpacity="0.85" />

          <rect x="20" y="84" width="280" height="6" rx="2" fill="url(#beamGrad)" stroke="#b45309" strokeWidth="1" />

          {Array.from({ length: columns }).map((_, i) => {
            const x = rodX(i);
            const isActiveRod = activeRods.includes(i);
            const isUnitRod = unitRodIndex === i;
            const digit = digits[i] ?? 0;
            const hasUpper = digit >= 5;
            const lowerVal = digit % 5;
            const upperY = hasUpper ? 64 : 36;

            const beadFill = isActiveRod ? '#075985' : '#1e293b';
            const beadStroke = isActiveRod ? '#7dd3fc' : '#334155';

            return (
              <g key={i} opacity={isActiveRod ? 1 : 0.55} style={{ transition: 'opacity 0.2s ease' }}>
                <line x1={x} y1="26" x2={x} y2="178" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                {isUnitRod && <circle cx={x} cy="87" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />}
                {isActiveRod && (
                  <motion.line
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    x1={x} y1="26" x2={x} y2="178"
                    stroke="#38bdf8" strokeWidth="5" strokeLinecap="round"
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
                  <rect x={x - 14} y="3" width="28" height="3" rx="1.5" fill={isActiveRod ? '#bae6fd' : '#475569'} pointerEvents="none" />
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
                      <rect x={x - 14} y="3" width="28" height="3" rx="1.5" fill={isActiveRod ? '#bae6fd' : '#475569'} pointerEvents="none" />
                    </motion.g>
                  );
                })}

                <text
                  x={x} y="206" textAnchor="middle"
                  fill={isActiveRod ? '#38bdf8' : '#94a3b8'}
                  fontSize="10" fontWeight="bold"
                >
                  {labels[i]}
                </text>
              </g>
            );
          })}
        </g>

        {/* ═══ ما يُكتب في هذه الخطوة: شرائح تحت الأعمدة ═══ */}
        {chips.map((c) => {
          const x = rodX(c.rod);
          return (
            <motion.g
              key={`chip-${c.rod}-${c.text}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <rect
                x={x - 17} y={250} width={34} height={18} rx={9}
                fill={c.dim ? '#1e293b' : '#0c4a6e'}
                stroke={c.dim ? '#475569' : '#38bdf8'} strokeWidth={1.5}
              />
              <text
                x={x} y={263} textAnchor="middle"
                fontSize={12} fontWeight={900} fontFamily="monospace"
                fill={c.dim ? '#94a3b8' : '#e0f2fe'}
              >
                {c.text}
              </text>
            </motion.g>
          );
        })}

        {/* قوس يجمع الشرائح + ناتج الخطوة */}
        {hasArc && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {chips.length > 1 ? (
              <path
                d={`M ${arcMin} 272 Q ${(arcMin + arcMax) / 2} 283 ${arcMax} 272`}
                fill="none" stroke="#38bdf8" strokeWidth={2} strokeLinecap="round"
              />
            ) : (
              <line x1={arcMin} y1={270} x2={arcMin} y2={284} stroke="#38bdf8" strokeWidth={2} strokeLinecap="round" />
            )}
            <rect
              x={pillCx - pillW / 2} y={284} width={pillW} height={18} rx={9}
              fill="#075985" stroke="#38bdf8" strokeWidth={1.5}
            />
            <text
              x={pillCx} y={296.5} textAnchor="middle"
              fontSize={11} fontWeight={900} fontFamily="monospace" fill="#e0f2fe"
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
