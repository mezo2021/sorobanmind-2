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
  if (columns <= 2) return 46;
  if (columns <= 3) return 40;
  if (columns <= 4) return 34;
  if (columns <= 5) return 30;
  if (columns <= 6) return 26;
  const calculated = Math.round(viewportWidth * 0.075);
  return Math.min(32, Math.max(22, calculated));
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

  // 🎯 تحديد الارتفاع بدقة: لا يتجاوز 320px إطلاقاً (سقف أقصى 320px)
  const dynamicHeight = Math.min(320, Math.max(250, Math.round(vh * 0.35)));

  const effectiveBeadSize = autoBeadSize
    ? getAutoBeadSize(columns, vw)
    : 34;

  const effectiveHeight = dynamicHeight;
  const dynamicGap = columns > 6 ? 6 : columns > 4 ? 8 : 12;

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
    <div className="w-full flex flex-col items-center gap-1.5 sm:gap-3 select-none">
      {!hideTitle && (
        <h3 className="text-sm sm:text-base font-black text-cyan-200 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] tracking-wide">
          💎 السوروبان الكريستالي 🌊
        </h3>
      )}

      {columns >= 7 && (
        <p className="text-[10px] text-cyan-300 font-bold animate-pulse drop-shadow">
          ← اسحب أفقيًا لرؤية بقية الأعمدة →
        </p>
      )}

      {/* 🎯 العلبة الألماسية الكريستالية (مستوحاة من الصورة) */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isRotated ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative rounded-2xl sm:rounded-3xl max-w-full backdrop-blur-lg"
        style={{
          padding: '8px 10px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(14,165,233,0.2) 30%, rgba(3,105,161,0.4) 70%, rgba(255,255,255,0.25) 100%)',
          boxShadow: '0 0 30px rgba(56,189,248,0.4), inset 0 0 20px rgba(255,255,255,0.6), 0 10px 25px rgba(0,0,0,0.5)',
          border: '2.5px solid rgba(186,230,253,0.75)',
        }}
      >
        {/* 🎯 إطار الانعكاس المائي الداخلي */}
        <div
          className="relative rounded-xl sm:rounded-2xl overflow-x-auto max-w-full scrollbar-none"
          style={{
            padding: '6px 10px',
            background: 'linear-gradient(180deg, rgba(12,74,110,0.5) 0%, rgba(8,47,73,0.7) 100%)',
            boxShadow: 'inset 0 0 15px rgba(56,189,248,0.3), inset 0 2px 5px rgba(255,255,255,0.4)',
          }}
        >
          <div
            className="flex flex-row-reverse items-center justify-center min-w-max"
            style={{ gap: dynamicGap, paddingTop: '18px', paddingBottom: '6px' }}
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

        {/* 🎯 الأزرار الكريستالية المضيئة */}
        {interactive && (
          <div className="flex justify-center items-center gap-2 mt-2">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-4 py-1 rounded-full bg-cyan-400/20 hover:bg-cyan-400/40 active:scale-95 text-cyan-100 font-extrabold shadow-[0_0_10px_rgba(34,211,238,0.5)] border border-cyan-200/50 backdrop-blur-md transition text-xs"
            >
              💧 إعادة الكل
            </button>

            <button
              type="button"
              onClick={toggleRotation}
              title="تدوير المعداد"
              className="p-1 rounded-full bg-amber-400/20 hover:bg-amber-400/40 active:scale-95 text-amber-200 font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.5)] border border-amber-200/50 backdrop-blur-md transition text-xs"
            >
              ↻
            </button>
          </div>
        )}
      </motion.div>

      {/* 🎯 إظهار النتيجة المتوهجة بذهب الشمس */}
      {shouldShowValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${totalValue}-${numberStyle}`}
            initial={{ scale: 0.6, opacity: 0, y: 5 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-2xl sm:text-3xl font-black text-amber-300 tabular-nums drop-shadow-[0_0_12px_rgba(252,211,77,0.9)]"
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
