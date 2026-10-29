// ═══════════════════════════════════════════════════════════════════
// 🔷 src/components/games/Friends/LaserAbacus.tsx
// ═══════════════════════════════════════════════════════════════════
//
// معداد سوروبان احترافي (SVG)
//   • ترتيب المنازل الصحيح: العشرات على اليسار · الآحاد على اليمين
//   • خرزات معينية الشكل تضيء بليزر أزرق أو أحمر
//   • الجدة (5) فوق العارضة · 4 خرزات سفلية تحتها
//   • لمس (Tap) أو سحب (Swipe) كما على المعداد الحقيقي
//   • أشباح توجيهية للحركة الصحيحة + وميض عند الخطأ
// ═══════════════════════════════════════════════════════════════════

import { useId, useRef } from 'react';
import { motion } from 'framer-motion';
import type { AbacusState } from './bank';
import { gt } from '../gamesI18n';

export type LaserTheme = 'blue' | 'red';
type Rod = 't' | 'o';

// ═══ ألوان الليزر ═══
// active = لون الخرزات المفعّلة · error = وميض الخطأ · guide = شبح التوجيه
const THEMES = {
  blue: { core: '#7dd3fc', glow: '#0ea5e9', deep: '#075985', error: '#f87171', errorDeep: '#991b1b', guide: '#a5f3fc' },
  red:  { core: '#fda4af', glow: '#f43f5e', deep: '#881337', error: '#fde047', errorDeep: '#a16207', guide: '#fecdd3' },
} as const;

// ═══ الهندسة (viewBox 360 × 388) ═══
const VB_W = 360;
const VB_H = 388;
const FRAME = { x: 20, y: 12, w: 320, h: 364 };
const ROD_X: Record<Rod, number> = { t: 90, o: 270 }; // العشرات يسار · الآحاد يمين
const BAR_Y = 130;
const UP_OFF = 48;   // الجدة بعيدة عن العارضة
const UP_ON = 103;   // الجدة ملامسة للعارضة (قيمتها 5)
const lowOn = (i: number) => 157 + (i - 1) * 40;        // الخرزة i نحو العارضة
const lowOff = (i: number) => 338 - (4 - i) * 40;       // الخرزة i بعيدة عن العارضة

function beadPath(cx: number, cy: number): string {
  const hw = 34, hh = 19, ch = 17;
  return `M${cx - hw},${cy} L${cx - ch},${cy - hh} L${cx + ch},${cy - hh} L${cx + hw},${cy} L${cx + ch},${cy + hh} L${cx - ch},${cy + hh} Z`;
}

// ═══ أدوات حالة المعداد (تُستخدم في اللعبة أيضاً) ═══
export function rodValue(s: AbacusState, rod: Rod): number {
  return rod === 't'
    ? (s.tensUpper ? 5 : 0) + s.tensLower
    : (s.onesUpper ? 5 : 0) + s.onesLower;
}

/** عدد الخرزات المختلفة بين حالتين (مقياس القرب من الهدف) */
export function mismatch(a: AbacusState, b: AbacusState): number {
  return (
    (a.tensUpper !== b.tensUpper ? 1 : 0) + Math.abs(a.tensLower - b.tensLower) +
    (a.onesUpper !== b.onesUpper ? 1 : 0) + Math.abs(a.onesLower - b.onesLower)
  );
}

/** مفاتيح الخرزات التي تغيّرت بين حالتين: tU · t1..t4 · oU · o1..o4 */
export function diffBeadKeys(a: AbacusState, b: AbacusState): string[] {
  const keys: string[] = [];
  if (a.tensUpper !== b.tensUpper) keys.push('tU');
  if (a.onesUpper !== b.onesUpper) keys.push('oU');
  const span = (rod: 't' | 'o', x: number, y: number) => {
    for (let i = Math.min(x, y) + 1; i <= Math.max(x, y); i++) keys.push(`${rod}${i}`);
  };
  span('t', a.tensLower, b.tensLower);
  span('o', a.onesLower, b.onesLower);
  return keys;
}

// ═══ المكوّن ═══
interface Props {
  state: AbacusState;
  onChange: (next: AbacusState) => void;
  /** الحالة المطلوبة (لرسم الأشباح الزرقاء) */
  target?: AbacusState | null;
  showGuide?: boolean;
  /** مفاتيح الخرزات المراد وميضها بلون الخطأ */
  errorBeads?: Set<string>;
  locked?: boolean;
  theme?: LaserTheme;
  /** إخفاء التسميات والأرقام (للعرض المصغّر) */
  compact?: boolean;
}

type Gesture = 'tap' | 'up' | 'down';

export function LaserAbacus({
  state, onChange, target = null, showGuide = false,
  errorBeads, locked = false, theme = 'blue', compact = false,
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const c = THEMES[theme];
  const startY = useRef(0);

  const apply = (rod: Rod, kind: 'U' | number, g: Gesture) => {
    if (locked) return;
    const next: AbacusState = { ...state };
    if (kind === 'U') {
      const cur = rod === 't' ? state.tensUpper : state.onesUpper;
      const val = g === 'tap' ? !cur : g === 'down';
      if (rod === 't') next.tensUpper = val; else next.onesUpper = val;
    } else {
      const cur = rod === 't' ? state.tensLower : state.onesLower;
      const val = g === 'tap' ? (cur === kind ? kind - 1 : kind) : g === 'up' ? kind : kind - 1;
      if (rod === 't') next.tensLower = val; else next.onesLower = val;
    }
    if (mismatch(next, state) === 0) return;
    onChange(next);
  };

  const gestureProps = (rod: Rod, kind: 'U' | number) => ({
    onPointerDown: (e: React.PointerEvent<SVGGElement>) => {
      startY.current = e.clientY;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
    },
    onPointerUp: (e: React.PointerEvent<SVGGElement>) => {
      const dy = e.clientY - startY.current;
      apply(rod, kind, Math.abs(dy) < 12 ? 'tap' : dy < 0 ? 'up' : 'down');
    },
  });

  // ─── رسم خرزة واحدة ───
  const renderBead = (rod: Rod, kind: 'U' | number) => {
    const x = ROD_X[rod];
    const key = `${rod}${kind === 'U' ? 'U' : kind}`;
    const offY = kind === 'U' ? UP_OFF : lowOff(kind);
    const onY = kind === 'U' ? UP_ON : lowOn(kind);

    const active =
      kind === 'U'
        ? rod === 't' ? state.tensUpper : state.onesUpper
        : kind <= (rod === 't' ? state.tensLower : state.onesLower);

    const wantActive =
      target
        ? kind === 'U'
          ? rod === 't' ? target.tensUpper : target.onesUpper
          : kind <= (rod === 't' ? target.tensLower : target.onesLower)
        : active;

    const isError = !!errorBeads?.has(key);
    const needsMove = showGuide && !!target && wantActive !== active;
    const ghostY = wantActive ? onY : offY;
    // اتجاه الحركة: الجدة تنزل للتفعيل · السفلية تصعد للتفعيل
    const arrow = kind === 'U' ? (wantActive ? '▼' : '▲') : (wantActive ? '▲' : '▼');

    const fill = isError ? `url(#${uid}err)` : active ? `url(#${uid}act)` : `url(#${uid}idle)`;
    const stroke = isError ? c.error : active ? c.core : '#64748b';

    return (
      <g key={key}>
        {needsMove && (
          <g transform={`translate(0, ${ghostY - offY})`} pointerEvents="none">
            <motion.path
              d={beadPath(x, offY)}
              fill="none"
              stroke={c.guide}
              strokeWidth={2.5}
              strokeDasharray="6 5"
              strokeLinejoin="round"
              filter={`url(#${uid}glow)`}
              animate={{ opacity: [0.25, 1, 0.25] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.text
              x={x} y={offY + 6} textAnchor="middle" fontSize={18} fill={c.guide}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {arrow}
            </motion.text>
          </g>
        )}

        <motion.g
          initial={false}
          animate={{ y: active ? onY - offY : 0 }}
          transition={{ type: 'spring', stiffness: 560, damping: 32, mass: 0.7 }}
          style={{ cursor: locked ? 'default' : 'pointer' }}
          {...gestureProps(rod, kind)}
        >
          {/* منطقة لمس أوسع من الخرزة */}
          <rect x={x - 44} y={offY - 24} width={88} height={48} fill="transparent" />
          <path
            d={beadPath(x, offY)}
            fill={fill}
            stroke={stroke}
            strokeWidth={active || isError ? 2 : 1.5}
            strokeLinejoin="round"
            filter={active || isError ? `url(#${uid}glow)` : undefined}
          />
          {/* لمعة علوية */}
          <path
            d={`M${x - 20},${offY - 11} L${x - 10},${offY - 16} L${x + 10},${offY - 16}`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={active ? 0.75 : 0.18}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </motion.g>
      </g>
    );
  };

  const rods: Rod[] = ['t', 'o'];

  return (
    <div dir="ltr" className="w-full select-none" style={{ touchAction: 'none' }}>
      {!compact && (
        <div className="grid grid-cols-2 text-center mb-1.5">
          <span className="text-xs font-black text-sky-300/90">{gt('عَشَرَات')}</span>
          <span className="text-xs font-black text-emerald-300/90">{gt('آحَاد')}</span>
        </div>
      )}

      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto" role="img" aria-label={gt('معداد سوروبان')}>
        <defs>
          <linearGradient id={`${uid}act`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.core} />
            <stop offset="45%" stopColor={c.glow} />
            <stop offset="100%" stopColor={c.deep} />
          </linearGradient>
          <linearGradient id={`${uid}err`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.error} />
            <stop offset="100%" stopColor={c.errorDeep} />
          </linearGradient>
          <linearGradient id={`${uid}idle`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`${uid}frame`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id={`${uid}bar`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#d4a017" />
            <stop offset="100%" stopColor="#92620a" />
          </linearGradient>
          <filter id={`${uid}glow`} x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* الإطار */}
        <rect
          x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx={22}
          fill={`url(#${uid}frame)`} stroke="#475569" strokeWidth={3}
        />
        <rect
          x={FRAME.x + 6} y={FRAME.y + 6} width={FRAME.w - 12} height={FRAME.h - 12} rx={17}
          fill="none" stroke="#000" strokeOpacity={0.5} strokeWidth={2}
        />

        {/* الأعمدة + شعاع الليزر على العمود */}
        {rods.map((rod) => {
          const v = rodValue(state, rod);
          const x = ROD_X[rod];
          return (
            <g key={`rod-${rod}`}>
              <line x1={x} y1={FRAME.y + 6} x2={x} y2={FRAME.y + FRAME.h - 6} stroke="#94a3b8" strokeWidth={5} strokeLinecap="round" />
              <line x1={x} y1={FRAME.y + 6} x2={x} y2={FRAME.y + FRAME.h - 6} stroke="#0f172a" strokeWidth={1.5} />
              {v > 0 && (
                <motion.line
                  x1={x} y1={FRAME.y + 10} x2={x} y2={FRAME.y + FRAME.h - 10}
                  stroke={c.glow} strokeWidth={2.5} strokeLinecap="round"
                  filter={`url(#${uid}glow)`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.35, 0.8, 0.35] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
              )}
            </g>
          );
        })}

        {/* العارضة */}
        <rect x={FRAME.x + 4} y={BAR_Y - 6} width={FRAME.w - 8} height={12} fill={`url(#${uid}bar)`} stroke="#78350f" strokeWidth={1} />
        {/* نقطة الآحاد (علامة المنزلة) */}
        <circle cx={ROD_X.o} cy={BAR_Y} r={3.2} fill="#451a03" />
        {/* مسح الليزر على العارضة */}
        <motion.rect
          y={BAR_Y - 1.5} width={46} height={3} rx={1.5}
          fill={c.core} filter={`url(#${uid}glow)`}
          initial={{ x: FRAME.x + 6 }}
          animate={{ x: [FRAME.x + 6, FRAME.x + FRAME.w - 52, FRAME.x + 6] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          opacity={0.9}
          pointerEvents="none"
        />

        {/* الخرزات */}
        {rods.map((rod) => (
          <g key={`beads-${rod}`}>
            {renderBead(rod, 'U')}
            {[1, 2, 3, 4].map((i) => renderBead(rod, i))}
          </g>
        ))}
      </svg>

      {!compact && (
        <div className="grid grid-cols-2 text-center mt-1.5">
          {rods.map((rod) => (
            <div key={`val-${rod}`} className="flex justify-center">
              <span
                className="min-w-[2.5rem] px-3 py-0.5 rounded-lg bg-black/60 border text-xl font-black tabular-nums font-mono"
                style={{ borderColor: `${c.glow}88`, color: c.core, textShadow: `0 0 10px ${c.glow}` }}
              >
                {rodValue(state, rod)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LaserAbacus;
