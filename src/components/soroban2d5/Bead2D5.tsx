// src/components/soroban2d5/Bead2D5.tsx
import { motion } from 'framer-motion';
import { useBeadSound } from './useBeadSound';
import { useBeadHaptics } from './useBeadHaptics';

interface Bead2D5Props {
  color: 'wood' | 'gold' | 'dark' | 'red';
  active: boolean;
  position: 'upper' | 'lower';
  size?: number;
  onClick?: () => void;
  animateOffset?: boolean;
}

const COLORS = {
  wood: {
    light: 'linear-gradient(180deg, #c19a6b 0%, #a67c52 50%, #8b6344 100%)',
    shadow:
      'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -3px 6px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
  },
  gold: {
    light: 'linear-gradient(180deg, #f4d47c 0%, #d4a574 50%, #b8860b 100%)',
    shadow:
      'inset 0 2px 6px rgba(255,240,200,0.6), inset 0 -3px 6px rgba(100,60,0,0.4), 0 4px 10px rgba(184,134,11,0.5)',
  },
  dark: {
    light: 'linear-gradient(180deg, #8b6f47 0%, #5a3a1f 50%, #3d2817 100%)',
    shadow:
      'inset 0 2px 4px rgba(255,200,150,0.2), inset 0 -3px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.4)',
  },
  red: {
    light: 'linear-gradient(180deg, #ff7b7b 0%, #c94040 50%, #8b1a1a 100%)',
    shadow:
      'inset 0 2px 4px rgba(255,200,200,0.4), inset 0 -3px 6px rgba(80,0,0,0.5), 0 4px 10px rgba(200,0,0,0.4)',
  },
};

export function Bead2D5({
  color,
  active,
  position,
  size = 30,
  onClick,
  animateOffset = true,
}: Bead2D5Props) {
  const playSound = useBeadSound();
  const vibrate = useBeadHaptics();

  const handleClick = () => {
    playSound('hit', active ? 0.7 : 1);
    vibrate('light');
    onClick?.();
  };

  const offset = animateOffset
    ? position === 'upper'
      ? active
        ? size * 0.5
        : 0
      : active
      ? -size * 0.6
      : 0
    : 0;

  const { light, shadow } = COLORS[color];

  return (
    <motion.button
      type="button"
      aria-label={`خرزة ${color} ${active ? 'مفعّلة' : 'غير مفعّلة'}`}
      onClick={handleClick}
      initial={false}
      animate={{ y: offset }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.8,
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      style={{
        width: size,
        height: size * 0.42,
        background: light,
        boxShadow: shadow,
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.15)',
        cursor: 'pointer',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '15%',
          left: '20%',
          width: '40%',
          height: '20%',
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.7) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.08,
          height: size * 0.08,
          background:
            'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }}
      />
    </motion.button>
  );
}

export default Bead2D5;