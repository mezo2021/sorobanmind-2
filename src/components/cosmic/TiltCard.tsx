// src/components/cosmic/TiltCard.tsx
// بطاقة زجاجية بميل ثلاثي الأبعاد + حدود متوهجة. تُعطَّل الحركة مع reduced-motion.
import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  glow?: string;
  pulse?: boolean;
  className?: string;
};

export default function TiltCard({ children, onClick, disabled, glow = '#f59e0b', pulse, className = '' }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const move = (e: React.PointerEvent) => {
    if (reduce || disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const leave = () => { mx.set(0); my.set(0); };

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        onClick={disabled ? undefined : onClick}
        whileTap={disabled || reduce ? undefined : { scale: 0.98 }}
        style={{
          rotateX: reduce ? 0 : rx,
          rotateY: reduce ? 0 : ry,
          transformStyle: 'preserve-3d',
          borderColor: disabled ? 'rgba(51,65,85,0.8)' : `${glow}99`,
          boxShadow: disabled ? 'none' : `0 0 22px ${glow}33, inset 0 0 18px ${glow}14`,
        }}
        className={`relative rounded-2xl border-2 backdrop-blur-md bg-white/5 ${disabled ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      >
        {pulse && !disabled && !reduce && (
          <motion.span
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: `0 0 28px 4px ${glow}` }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        {children}
      </motion.div>
    </div>
  );
}
