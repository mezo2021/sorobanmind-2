// src/components/games/MentalArchivesGame/ui/TimeDial.tsx
// العجلة الزمنية: اسحب الأرقام أفقياً (transform فقط) ثم "اختم" الرقم.
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Cog } from 'lucide-react';
import Num from '@/components/Num';
import { tUI } from '../gameUI';

const ITEM = 56;
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

type Props = {
  disabled?: boolean;
  reduceMotion?: boolean | null;
  onStamp: (d: string) => void;
  onBack: () => void;
  onClear: () => void;
};

export default function TimeDial({ disabled, reduceMotion, onStamp, onBack, onClear }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [center, setCenter] = useState(0);
  const [sel, setSel] = useState(0);
  const selRef = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    const w = wrapRef.current?.clientWidth || 280;
    const c = w / 2 - ITEM / 2;
    setCenter(c);
    x.set(c - selRef.current * ITEM);
  }, [x]);

  const idxFromX = (v: number) => Math.max(0, Math.min(9, Math.round((center - v) / ITEM)));

  const tick = (i: number) => {
    if (i === selRef.current) return;
    selRef.current = i;
    setSel(i);
    try { navigator.vibrate?.(6); } catch { /* noop */ }
  };

  const snap = (i: number) => {
    animate(x, center - i * ITEM, reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 });
    tick(i);
  };

  return (
    <div className="w-full max-w-xs mx-auto flex flex-col gap-2" dir="ltr">
      <div ref={wrapRef} className="relative h-16 overflow-hidden rounded-2xl bg-stone-950 border border-amber-500/30 shadow-inner">
        <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 border-2 border-amber-400/70 rounded-xl bg-amber-400/10 pointer-events-none z-10" style={{ width: ITEM }} />
        <motion.div
          drag={disabled ? false : 'x'}
          dragConstraints={{ left: center - 9 * ITEM, right: center }}
          dragElastic={0.1}
          style={{ x }}
          onDragStart={() => { dragged.current = true; }}
          onDrag={() => tick(idxFromX(x.get()))}
          onDragEnd={(_, info) => {
            snap(idxFromX(x.get() + info.velocity.x * 0.15));
            window.setTimeout(() => { dragged.current = false; }, 80);
          }}
          className="absolute top-0 left-0 h-full flex items-center cursor-grab active:cursor-grabbing touch-pan-y"
        >
          {DIGITS.map((d) => (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => { if (!dragged.current) snap(d); }}
              style={{ width: ITEM }}
              className={`h-full text-3xl font-mono font-bold select-none ${d === sel ? 'text-amber-200' : 'text-amber-500/40'}`}
            >
              <Num>{d}</Num>
            </button>
          ))}
        </motion.div>
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={disabled} onClick={onClear} className="h-12 w-12 rounded-xl bg-stone-800 border border-stone-600/60 text-stone-300 text-xl">✕</button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onStamp(String(sel))}
          className="flex-1 h-12 rounded-xl bg-gradient-to-b from-amber-300 to-amber-600 text-stone-900 font-extrabold flex items-center justify-center gap-2 border border-amber-100/60 disabled:opacity-50"
        >
          <Cog className="w-5 h-5" /> {tUI('dialStamp')} <Num>{sel}</Num>
        </button>
        <button type="button" disabled={disabled} onClick={onBack} className="h-12 w-12 rounded-xl bg-stone-800 border border-stone-600/60 text-stone-300 text-xl">⌫</button>
      </div>
    </div>
  );
}
