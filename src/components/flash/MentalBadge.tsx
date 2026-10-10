// src/components/flash/MentalBadge.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BadgeVariant = 'amber' | 'emerald' | 'red';

interface MentalBadgeProps {
  lines: string[];
  visible: boolean;
  lineDelayMs?: number;
  variant?: BadgeVariant;
}

const BORDER_STYLE: Record<BadgeVariant, string> = {
  amber: 'border-amber-500',
  emerald: 'border-emerald-500',
  red: 'border-red-500',
};

export function MentalBadge({
  lines,
  visible,
  lineDelayMs = 800,
  variant = 'amber',
}: MentalBadgeProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!visible) {
      setVisibleCount(0);
      return;
    }
    setVisibleCount(1);
    const timers: number[] = [];
    for (let i = 1; i < lines.length; i++) {
      const t = window.setTimeout(() => setVisibleCount(i + 1), i * lineDelayMs);
      timers.push(t);
    }
    return () => timers.forEach((t) => clearTimeout(t));
  }, [visible, lines, lineDelayMs]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className={`mx-auto w-fit max-w-[90%] flex flex-col items-center bg-slate-900/95 border-2 ${BORDER_STYLE[variant]} px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md min-w-[180px]`}
        dir="rtl"
      >
        {lines.slice(0, visibleCount).map((line, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`font-bold text-sm tracking-wide whitespace-nowrap ${
              i === 0
                ? 'text-amber-300'
                : i === lines.length - 1
                ? 'text-emerald-400 border-t border-slate-700 pt-1 mt-1'
                : 'text-blue-300'
            }`}
          >
            {line}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default MentalBadge;