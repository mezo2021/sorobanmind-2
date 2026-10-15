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

  // 🎯 حساب الارتفاع الديناميكي المتناسب مع الجوال (clamp بين 260px و 380px)
  const dynamicHeight = Math.min(380, Math.max(260, Math.round(vh * 0.38)));

  const effectiveBeadSize = autoBeadSize
    ? getAutoBeadSize(columns, vw)
    : 38;

  const effectiveHeight = Math.max(250, dynamicHeight);
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
    playSound('hit');
    vibrate('light');
    setIsRotated((prev) => !prev);
  };

  const shouldShowValue = revealValue || (!interactive && showValue);

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-4 select-none">
      {!hideTitle && (
        <h3 className="text-base sm:text-lg font-extrabold text-cyan-300 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
          🌊 سوروبان الليزر والمحيط ☀️
        </h3>
      )}

      {columns >= 7 && (
        <p className="text-[11px] text-cyan-400 font-medium animate-pulse drop-shadow">
          ← اسحب أفقيًا لرؤية بقية الأعمدة →
        </p>
      )}

      {/* 🎯 إطار الكرستال ومحيط الليزر */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isRotated ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative rounded-2xl sm:rounded-3xl max-w-full backdrop-blur-md"
        style={{
          padding: '12px',
          background: 'linear-gradient(135deg, rgba(14,116,144,0.85) 0%, rgba(3,105,161,0.9) 50%, rgba(15,23,42,0.95) 100%)',
          boxShadow: '0 0 25px rgba(6,182,212,0.4), inset 0 0 15px rgba(255,255,255,0.2)',
          border: '2px solid rgba(56,189,248,0.5)',
        }}
      >
        {/* 🎯 خلفية مياه البحر الشفافة */}
        <div
          className="relative rounded-xl sm:rounded-2xl overflow-x-auto max-w-full scrollbar-thin"
          style={{
            padding: '10px 14px',
            background: 'linear-gradient(180deg, rgba(238,242,255,0.92) 0%, rgba(186,230,253,0.88) 100%)',
            boxShadow: 'inset 0 4px 20px rgba(14,116,144,0.25), 0 0 10px rgba(255,255,255,0.5)',
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

        {/* 🎯 أزرار ليزرية تفاعلية */}
        {interactive && (
          <div className="flex justify-center items-center gap-3 mt-3">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-5 py-1.5 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 active:scale-95 text-cyan-100 font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-300/40 backdrop-blur-sm transition text-xs sm:text-sm"
            >
              🌊 إعادة الكل
            </button>

            <button
              type="button"
              onClick={toggleRotation}
              title="تدوير المعداد"
              className="p-1.5 rounded-full bg-amber-500/30 hover:bg-amber-500/50 active:scale-95 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-amber-300/40 backdrop-blur-sm transition text-xs"
            >
              ↻
            </button>
          </div>
        )}
      </motion.div>

      {/* 🎯 إظهار النتيجة بتوهج الليزر والشمس */}
      {shouldShowValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${totalValue}-${numberStyle}`}
            initial={{ scale: 0.6, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-3xl sm:text-4xl font-black text-amber-300 tabular-nums drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]"
            style={{ fontFamily: 'monospace' }}
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
