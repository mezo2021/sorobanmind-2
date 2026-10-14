// src/components/soroban2d5/Soroban2D5.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSorobanLogic } from './useSorobanLogic';
import { Rod2D5 } from './Rod2D5';
import { useBeadSound } from './useBeadSound';
import { useBeadHaptics } from './useBeadHaptics';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import type { RodTint } from '@/components/flash/types';

interface Soroban2D5Props {
  columns?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
  showValue?: boolean;
  interactive?: boolean;
  revealValue?: boolean;
  demoValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  autoBeadSize?: boolean;
  activeRodIndex?: number;
  hideTitle?: boolean;
  beamHighlight?: boolean;
  rodTint?: RodTint;
  highlightColumns?: number[];
  dimColumns?: number[];
  hideColumnLabels?: boolean;
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
    gap: 8,
    framePadding: 10,
    innerPadding: 8,
    height: 300,
    topPadding: 24,
    bottomPadding: 8,
    titleSize: 'text-sm',
    valueSize: 'text-xl',
  },
  md: {
    beadSize: 44,
    gap: 12,
    framePadding: 14,
    innerPadding: 10,
    height: 380,
    topPadding: 30,
    bottomPadding: 10,
    titleSize: 'text-base',
    valueSize: 'text-2xl',
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
  if (columns <= 2) return 38;
  if (columns <= 3) return 34;
  if (columns <= 4) return 30;
  if (columns <= 5) return 28;
  if (columns <= 6) return 28;
  if (columns <= 7) return 24;
  if (columns <= 9) return 22;
  if (columns <= 11) return 20;
  return 18;
}

// 🆕 فجوة ديناميكية: تضيق للأعمدة الكثيرة
function getDynamicGap(columns: number, baseGap: number): number {
  if (columns >= 11) return 4;
  if (columns >= 9) return 5;
  if (columns >= 7) return 6;
  return baseGap;
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function formatByStyle(value: number, style: 'arabic' | 'latin'): string {
  const str = String(value);
  if (style === 'arabic') {
    return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
  }
  return str;
}

export function Soroban2D5({
  columns = 4,
  initialValue = 0,
  onValueChange,
  showValue = true,
  interactive = true,
  revealValue = false,
  demoValue,
  size = 'auto',
  autoBeadSize = false,
  activeRodIndex,
  hideTitle = false,
  beamHighlight = false,
  rodTint,
  highlightColumns,
  dimColumns,
  hideColumnLabels = false,
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

  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const responsiveSize = useResponsiveSize();
  const finalSize = size === 'auto' ? responsiveSize : size;
  const cfg = SIZE_CONFIG[finalSize];

  const visibleColumns = (() => {
    if (!autoBeadSize && finalSize === 'sm' && columns > 4) {
      return Math.min(4, columns);
    }
    return columns;
  })();

  const displayedStates = colStates.slice(-visibleColumns);
  const displayOffset = columns - visibleColumns;

  const effectiveBeadSize = autoBeadSize
    ? getAutoBeadSize(displayedStates.length)
    : cfg.beadSize;

  // ✅ Math.max: ارتفاع لا يقل عن cfg.height أبدًا
  const effectiveHeight = autoBeadSize
    ? Math.max(
        cfg.height,
        Math.round(cfg.height * (effectiveBeadSize / cfg.beadSize)),
      )
    : cfg.height;

  // 🆕 فجوة ديناميكية
  const dynamicGap = getDynamicGap(displayedStates.length, cfg.gap);

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

  const shouldShowValue = revealValue || (!interactive && showValue);

  return (
    <div className="w-full flex flex-col items-center gap-3 sm:gap-5">
      {!hideTitle && (
        <h3 className={`${cfg.titleSize} font-bold text-amber-900`}>
          🧮 عداد السوروبان
        </h3>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative rounded-2xl sm:rounded-3xl"
        style={{
          padding: cfg.framePadding,
          background: 'linear-gradient(135deg, #8b6f47 0%, #6b4423 50%, #4a2e15 100%)',
          boxShadow: 'inset 0 4px 12px rgba(255,200,150,0.15), inset 0 -6px 16px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.35), 0 8px 16px rgba(0,0,0,0.25)',
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
              gap: dynamicGap,
              paddingTop: cfg.topPadding,
              paddingBottom: cfg.bottomPadding,
            }}
            dir="rtl"
          >
            {displayedStates.map((state, idx) => {
              const originalIdx = idx + displayOffset;
              const displayOrder = columns - 1 - originalIdx;
              const isHighlighted = highlightColumns?.includes(originalIdx) ?? false;
              const isDim = dimColumns?.includes(originalIdx) ?? false;
              const finalTint: RodTint | undefined = isHighlighted ? 'white' : rodTint;

              return (
                <Rod2D5
                  key={originalIdx}
                  state={state}
                  columnIndex={originalIdx}
                  displayOrder={displayOrder}
                  totalColumns={displayedStates.length}
                  onToggleUpper={() => interactive && toggleUpper(originalIdx)}
                  onSetLower={(count) => interactive && setLower(originalIdx, count)}
                  onReset={() => interactive && resetColumn(originalIdx)}
                  height={effectiveHeight}
                  beadSize={effectiveBeadSize}
                  isActive={activeRodIndex === originalIdx}
                  beamHighlight={beamHighlight}
                  tint={finalTint}
                  isDimmed={isDim}
                />
              );
            })}
          </div>

          {hideColumnLabels && <div className="h-0" />}

          {displayOffset > 0 && (
            <p className="text-center text-[10px] text-amber-700 mt-1 font-body">
              ✨ يتم عرض {formatByStyle(visibleColumns, numberStyle)} أعمدة
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

      {shouldShowValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${totalValue}-${numberStyle}`}
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`${cfg.valueSize} font-black text-amber-900 tabular-nums`}
            style={{ fontFamily: 'monospace', textShadow: '0 4px 8px rgba(139,111,71,0.3)' }}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {formatByStyle(totalValue, numberStyle)}
          </motion.div>
        </AnimatePresence>
      )}

      {interactive && (
        <p className="text-[10px] sm:text-sm text-amber-700 text-center max-w-md px-2">
          💡 اضغط على الخرزة لتفعيلها.
        </p>
      )}
    </div>
  );
}

export default Soroban2D5;