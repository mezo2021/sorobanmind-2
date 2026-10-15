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

function useViewportDimensions() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}

function getAutoBeadSize(columns: number, viewportWidth: number): number {
  if (columns <= 2) return 52;
  if (columns <= 3) return 46;
  if (columns <= 4) return 38;
  if (columns <= 5) return 32;
  if (columns <= 6) return 28;
  // للأعمدة 7 وما فوق: حجم ديناميكي مريح مع التمرير الأفقي
  const calculated = Math.round(viewportWidth * 0.085);
  return Math.min(36, Math.max(26, calculated));
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
  autoBeadSize = true,
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

  const { width: vw, height: vh } = useViewportDimensions();
  const [isRotated, setIsRotated] = useState(false);

  // 🎯 حساب الارتفاع الديناميكي (clamp بين 260px و 380px)
  const dynamicHeight = Math.min(380, Math.max(260, Math.round(vh * 0.38)));

  // 🎯 حساب حجم الخرزة والارتفاع الفعلي
  const effectiveBeadSize = autoBeadSize
    ? getAutoBeadSize(columns, vw)
    : 38;

  const effectiveHeight = Math.max(250, dynamicHeight);

  // 🎯 الفجوة الديناميكية حسب عدد الأعمدة
  const dynamicGap = columns > 6 ? 8 : columns > 4 ? 10 : 14;

  useEffect(() => {
    if (initialValue > 0) setValue(initialValue);
  }, []);

  useEffect(() => {
    if (demoValue !== undefined) setValue(demoValue);
  }, [demoValue]);

  useEffect(() => {
    onValueChange?.(totalValue);
  }, [totalValue]);

  const handleResetAll = () => {
    playSound('slide');
    vibrate('medium');
    resetAll();
  };

  const toggleRotation = () => {
    playSound('click');
    vibrate('light');
    setIsRotated((prev) => !prev);
  };

  const shouldShowValue = revealValue || (!interactive && showValue);

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-4 select-none">
      {!hideTitle && (
        <h3 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-2">
          🧮 عداد السوروبان
        </h3>
      )}

      {/* 🎯 إظهار تلميح السحب للأعمدة 7+ */}
      {columns >= 7 && (
        <p className="text-[11px] text-amber-700 font-medium animate-pulse">
          ← اسحب أفقيًا لرؤية بقية الأعمدة →
        </p>
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isRotated ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative rounded-2xl sm:rounded-3xl max-w-full"
        style={{
          padding: '12px',
          background: 'linear-gradient(135deg, #8b6f47 0%, #6b4423 50%, #4a2e15 100%)',
          boxShadow: 'inset 0 4px 12px rgba(255,200,150,0.15), inset 0 -6px 16px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.3)',
          border: '2px solid rgba(0,0,0,0.25)',
        }}
      >
        <div
          className="relative rounded-xl sm:rounded-2xl overflow-x-auto max-w-full scrollbar-thin"
          style={{
            padding: '10px 14px',
            background: 'linear-gradient(180deg, #fef9f0 0%, #f5e6c8 100%)',
            boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="flex flex-row-reverse items-center justify-center min-w-max"
            style={{ gap: dynamicGap, paddingTop: '28px', paddingBottom: '10px' }}
            dir="rtl"
          >
            {colStates.map((state, originalIdx) => {
              const displayOrder = columns - 1 - originalIdx;
              const isHighlighted = highlightColumns?.includes(originalIdx) ?? false;
              const isDim = dimColumns?.includes(originalIdx) ?? false;
              const finalTint: RodTint | undefined = isHighlighted ? 'white' : rodTint;

              return (
                <div
                  key={originalIdx}
                  style={{
                    transform: isRotated ? 'rotate(-90deg)' : 'none',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <Rod2D5
                    state={state}
                    columnIndex={originalIdx}
                    displayOrder={displayOrder}
                    totalColumns={columns}
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
                </div>
              );
            })}
          </div>
        </div>

        {/* 🎯 الأزرار التفاعلية (إعادة الكل + أزرار التحكم) */}
        {interactive && (
          <div className="flex justify-center items-center gap-2 mt-2 sm:mt-3">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold shadow-md backdrop-blur-sm transition text-xs sm:text-sm"
            >
              ↺ إعادة الكل
            </button>

            <button
              type="button"
              onClick={toggleRotation}
              title="تدوير المعداد"
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold shadow-md backdrop-blur-sm transition text-xs"
            >
              ↻
            </button>
          </div>
        )}
      </motion.div>

      {shouldShowValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${totalValue}-${numberStyle}`}
            initial={{ scale: 0.6, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-2xl sm:text-3xl font-black text-amber-900 tabular-nums"
            style={{ fontFamily: 'monospace', textShadow: '0 2px 4px rgba(139,111,71,0.2)' }}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {formatByStyle(totalValue, numberStyle)}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Soroban2D5;
