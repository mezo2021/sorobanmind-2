// src/components/soroban2d5/Soroban2D5.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSorobanLogic } from './useSorobanLogic';
import { Rod2D5 } from './Rod2D5';
import { useBeadSound } from './useBeadSound';
import { useBeadHaptics } from './useBeadHaptics';

interface Soroban2D5Props {
  columns?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  interactive?: boolean;
  demoValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  autoBeadSize?: boolean;
}

function useResponsiveSize() {
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>(() => {
    if (typeof window === 'undefined') return 'md';
    const w = window.innerWidth;
    if (w < 480) return 'sm';
    if (w < 768) return 'md';
    return 'lg';
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) setSize('sm');
      else if (w < 768) setSize('md');
      else setSize('lg');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

const SIZE_CONFIG = {
  sm: {
    beadSize: 34,
    gap: 10,
    framePadding: 14,
    innerPadding: 12,
    height: 380,
    topPadding: 34,
    bottomPadding: 10,
    titleSize: 'text-base',
    valueSize: 'text-2xl',
  },
  md: {
    beadSize: 44,
    gap: 14,
    framePadding: 18,
    innerPadding: 14,
    height: 440,
    topPadding: 40,
    bottomPadding: 12,
    titleSize: 'text-lg',
    valueSize: 'text-3xl',
  },
  lg: {
    beadSize: 56,
    gap: 20,
    framePadding: 26,
    innerPadding: 18,
    height: 520,
    topPadding: 48,
    bottomPadding: 14,
    titleSize: 'text-2xl',
    valueSize: 'text-5xl',
  },
};

function getAutoBeadSize(columns: number): number {
  if (columns <= 2) return 44;
  if (columns === 3) return 38;
  if (columns === 4) return 32;
  if (columns === 5) return 28;
  return 24;
}

export function Soroban2D5({
  columns = 4,
  initialValue = 0,
  onValueChange,
  showValue = true,
  interactive = true,
  demoValue,
  size = 'auto',
  autoBeadSize = false,
}: Soroban2D5Props) {
  const {
    columns: colStates,
    totalValue,
    toggleUpper,
    setLower,
    resetColumn,
    resetAll,
    setValue,
  } = useSorobanLogic(columns);

  const playSound = useBeadSound();
  const vibrate = useBeadHaptics();

  const responsiveSize = useResponsiveSize();
  const finalSize = size === 'auto' ? responsiveSize : size;
  const cfg = SIZE_CONFIG[finalSize];

  const visibleColumns = (() => {
    if (finalSize === 'sm' && columns > 4) {
      return Math.min(4, columns);
    }
    return columns;
  })();

  const displayedStates = colStates.slice(-visibleColumns);
  const displayOffset = columns - visibleColumns;

  const effectiveBeadSize = autoBeadSize
    ? getAutoBeadSize(displayedStates.length)
    : cfg.beadSize;

  const effectiveHeight = autoBeadSize
    ? Math.round(cfg.height * (effectiveBeadSize / cfg.beadSize))
    : cfg.height;

  useEffect(() => {
    if (initialValue > 0) setValue(initialValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (demoValue !== undefined) setValue(demoValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoValue]);

  useEffect(() => {
    onValueChange?.(totalValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalValue]);

  const handleResetAll = () => {
    playSound('slide');
    vibrate('medium');
    resetAll();
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-5">
      <h3 className={`${cfg.titleSize} font-bold text-amber-900`}>
        🧮 عداد السوروبان
      </h3>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative rounded-2xl sm:rounded-3xl"
        style={{
          padding: cfg.framePadding,
          background:
            'linear-gradient(135deg, #8b6f47 0%, #6b4423 50%, #4a2e15 100%)',
          boxShadow:
            'inset 0 4px 12px rgba(255,200,150,0.15), inset 0 -6px 16px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.25)',
          border: '2px solid rgba(0,0,0,0.25)',
          maxWidth: '100%',
        }}
      >
        <div
          className="relative rounded-xl sm:rounded-2xl"
          style={{
            padding: cfg.innerPadding,
            background: 'linear-gradient(180deg, #fef9f0 0%, #f5e6c8 100%)',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.15)',
            overflow: 'visible',
          }}
        >
          <div
            className="flex flex-row-reverse items-center justify-center"
            style={{
              gap: cfg.gap,
              paddingTop: cfg.topPadding,
              paddingBottom: cfg.bottomPadding,
            }}
            dir="rtl"
          >
            {displayedStates.map((state, idx) => {
              const originalIdx = idx + displayOffset;
              const displayOrder = columns - 1 - originalIdx;
              return (
                <Rod2D5
                  key={originalIdx}
                  state={state}
                  columnIndex={originalIdx}
                  displayOrder={displayOrder}
                  onToggleUpper={() => interactive && toggleUpper(originalIdx)}
                  onSetLower={(count) => interactive && setLower(originalIdx, count)}
                  onReset={() => interactive && resetColumn(originalIdx)}
                  height={effectiveHeight}
                  beadSize={effectiveBeadSize}
                />
              );
            })}
          </div>

          {displayOffset > 0 && (
            <p className="text-center text-[10px] text-amber-700 mt-1 font-body">
              ✨ يتم عرض {visibleColumns} أعمدة (من أصل {columns})
            </p>
          )}
        </div>

        {interactive && (
          <div className="flex justify-center gap-2 mt-3 sm:mt-4">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold shadow-lg backdrop-blur-sm transition text-xs sm:text-sm"
            >
              ↺ إعادة الكل
            </button>
          </div>
        )}
      </motion.div>

      {showValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={totalValue}
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`${cfg.valueSize} font-black text-amber-900 tabular-nums`}
            style={{
              fontFamily: 'monospace',
              textShadow: '0 4px 8px rgba(139,111,71,0.3)',
            }}
          >
            {totalValue.toLocaleString('ar-EG')}
          </motion.div>
        </AnimatePresence>
      )}

      <p className="text-[10px] sm:text-sm text-amber-700 text-center max-w-md px-2">
        💡 اضغط على الخرزة لتفعيلها. الخرزة العلوية = <strong>5</strong>،
        السفلية = <strong>1</strong>.
      </p>
    </div>
  );
}

export default Soroban2D5;