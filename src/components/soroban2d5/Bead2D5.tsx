// src/components/soroban2d5/Bead2D5.tsx
import { motion } from 'framer-motion';

export type BeadColorType = 
  | 'charcoal' // أسود فحمي أنيق (الأساسي غير المفعّل)
  | 'cyan'     // سماوي مائي (المحيط السفلي)
  | 'gold'     // ذهبي شمسي (الشمس العلوي)
  | 'emerald'  // أخضر ناصع (الفلاش - الناتج)
  | 'red'      // أحمر عنابي (الفلاش - المقسوم/المضروب)
  | 'white'    // أبيض مضيء (الفلاش - التحديد)
  | 'barbie'   // وردي نيون (باربي)
  | 'wood';    // خشبي كلاسيكي

interface Bead2D5Props {
  color?: BeadColorType;
  active: boolean;
  position: 'upper' | 'lower';
  size?: number;
  onClick?: () => void;
  animateOffset?: boolean;
}

const COLOR_STYLES: Record<BeadColorType, { light: string; shadow: string }> = {
  charcoal: {
    light: 'linear-gradient(180deg, #4b5563 0%, #1f2937 50%, #111827 100%)',
    shadow: 'inset 0 2px 4px rgba(255,255,255,0.25), inset 0 -3px 6px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.5)',
  },
  cyan: {
    light: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)',
    shadow: 'inset 0 2px 5px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(12,74,110,0.8), 0 0 12px rgba(56,189,248,0.75)',
  },
  gold: {
    light: 'linear-gradient(180deg, #fde047 0%, #eab308 50%, #ca8a04 100%)',
    shadow: 'inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -3px 6px rgba(113,63,18,0.8), 0 0 12px rgba(250,204,21,0.85)',
  },
  emerald: {
    light: 'linear-gradient(180deg, #4ade80 0%, #16a34a 50%, #15803d 100%)',
    shadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(20,83,45,0.8), 0 0 10px rgba(74,222,128,0.7)',
  },
  red: {
    light: 'linear-gradient(180deg, #f87171 0%, #dc2626 50%, #991b1b 100%)',
    shadow: 'inset 0 2px 4px rgba(255,255,255,0.5), inset 0 -3px 6px rgba(69,10,10,0.8), 0 0 10px rgba(239,68,68,0.7)',
  },
  white: {
    light: 'linear-gradient(180deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)',
    shadow: 'inset 0 2px 6px rgba(255,255,255,1), inset 0 -3px 6px rgba(100,116,139,0.5), 0 0 14px rgba(255,255,255,0.9)',
  },
  barbie: {
    light: 'linear-gradient(180deg, #f472b6 0%, #db2777 50%, #9d174d 100%)',
    shadow: 'inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -3px 6px rgba(131,24,67,0.8), 0 0 12px rgba(236,72,153,0.75)',
  },
  wood: {
    light: 'linear-gradient(180deg, #c19a6b 0%, #a67c52 50%, #8b6344 100%)',
    shadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
  },
};

export function Bead2D5({
  color = 'charcoal',
  active,
  position,
  size = 30,
  onClick,
  animateOffset = true,
}: Bead2D5Props) {
  const offset = animateOffset
    ? position === 'upper'
      ? active
        ? size * 0.5
        : 0
      : active
      ? -size * 0.6
      : 0
    : 0;

  const styleConfig = COLOR_STYLES[color] ?? COLOR_STYLES.charcoal;

  return (
    <motion.button
      type="button"
      aria-label={`خرزة ${color} ${active ? 'مفعّلة' : 'غير مفعّلة'}`}
      onClick={onClick}
      initial={false}
      animate={{ y: offset }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.8,
      }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      style={{
        width: size,
        height: size * 0.42,
        background: styleConfig.light,
        boxShadow: styleConfig.shadow,
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.25)',
        cursor: 'pointer',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* لمعة الانعكاس الزجاجي العلوية */}
      <span
        style={{
          position: 'absolute',
          top: '12%',
          left: '20%',
          width: '40%',
          height: '22%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </motion.button>
  );
}

export default Bead2D5;