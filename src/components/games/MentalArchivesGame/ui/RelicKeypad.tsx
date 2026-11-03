// src/components/games/MentalArchivesGame/ui/RelicKeypad.tsx
// لوحة مفاتيح "السوروبان الأثرية" — أحجار/ألواح مضيئة.
import { motion } from 'framer-motion';

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  maxLen?: number;
  reduceMotion?: boolean | null;
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'] as const;

export default function RelicKeypad({ value, onChange, disabled, maxLen = 6, reduceMotion }: Props) {
  const press = (k: (typeof KEYS)[number]) => {
    if (disabled) return;
    try { navigator.vibrate?.(8); } catch { /* noop */ }
    if (k === 'clear') onChange('');
    else if (k === 'back') onChange(value.slice(0, -1));
    else if (value.length < maxLen) onChange(value + k);
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs mx-auto" dir="ltr">
      {KEYS.map((k) => {
        const special = k === 'clear' || k === 'back';
        return (
          <motion.button
            key={k}
            type="button"
            disabled={disabled}
            onClick={() => press(k)}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            aria-label={k}
            className={`h-12 rounded-xl text-2xl font-bold font-mono border shadow-md select-none touch-manipulation disabled:opacity-50 ${
              special
                ? 'bg-gradient-to-b from-stone-700 to-stone-900 border-stone-500/60 text-stone-300'
                : 'bg-gradient-to-b from-amber-200/90 via-amber-300/80 to-amber-600/80 border-amber-100/60 text-stone-900 shadow-amber-500/20'
            }`}
          >
            {k === 'clear' ? '✕' : k === 'back' ? '⌫' : k}
          </motion.button>
        );
      })}
    </div>
  );
}
