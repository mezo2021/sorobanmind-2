// src/components/soroban2d5/Soroban2D5.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useSorobanLogic } from './useSorobanLogic';
import { Rod2D5, type SorobanTheme } from './Rod2D5';
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
  theme?: SorobanTheme;
}

// 📐 هوك مراقبة أبعاد الشاشة مع تفعيل Debounce لحماية الأداء ومنع الاستدعاءات المفرطة
function useViewportDimensions() {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 390,
    height: typeof window !== 'undefined' ? window.innerHeight : 844,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return dimensions;
}

function getAutoBeadSize(columns: number, viewportWidth: number): number {
  if (columns <= 2) return 44;
  if (columns <= 3) return 38;
  if (columns <= 4) return 34;
  if (columns <= 5) return 28;
  if (columns <= 6) return 25;
  const calculated = Math.round(viewportWidth * 0.07);
  return Math.min(30, Math.max(20, calculated));
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
  size: _size = 'auto',
  autoBeadSize = true,
  activeRodIndex,
  hideTitle = false,
  beamHighlight = false,
  rodTint,
  highlightColumns,
  dimColumns,
  hideColumnLabels: _hideColumnLabels = false,
  theme: initialTheme = 'ocean-laser',
}: Soroban2D5Props) {
  const {
    columns: colStates,
    totalValue,
    toggleUpper,
    setLower,
    resetAll,
    setValue,
  } = useSorobanLogic(columns);

  const [currentTheme, setCurrentTheme] = useState<SorobanTheme>(initialTheme);
  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';

  const { width: vw, height: vh } = useViewportDimensions();
  const [isRotated, setIsRotated] = useState(false);

  const effectiveBeadSize = autoBeadSize ? getAutoBeadSize(columns, vw) : 32;

  // 🛡️ معالجة القيمة الأولية مرة واحدة فقط بشكل آمن ومحمي
  const isInitializedRef = useRef(false);
  useEffect(() => {
    if (!isInitializedRef.current && initialValue > 0) {
      setValue(initialValue);
      isInitializedRef.current = true;
    }
  }, [initialValue, setValue]);

  // 🛡️ معالجة العرض التوضيحي مع تصفير الحالة بذكاء عند العودة إلى undefined
  useEffect(() => {
    if (demoValue !== undefined) {
      setValue(demoValue);
    } else if (!interactive) {
      setValue(0);
    }
  }, [demoValue, interactive, setValue]);

  // 🛡️ حماية onValueChange واستقرار الإشعار باستخدام useRef
  const onValueChangeRef = useRef(onValueChange);
  useEffect(() => {
    onValueChangeRef.current = onValueChange;
  });

  useEffect(() => {
    onValueChangeRef.current?.(totalValue);
  }, [totalValue]);

  const handleResetAll = () => {
    resetAll();
  };

  const toggleRotation = () => {
    setIsRotated((prev) => !prev);
  };

  const shouldShowValue = revealValue || (!interactive && showValue);

  // 🎨 تخزين الأنماط مؤقتاً لمنع إعادة إنشائها مع كل Render
  const containerStyles = useMemo(() => {
    if (currentTheme === 'classic-wood') {
      return {
        background: '#3d2817',
        border: '3px solid #8b6344',
        boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
      };
    }
    if (currentTheme === 'barbie-pink') {
      return {
        background: 'linear-gradient(135deg, rgba(255,241,242,0.4) 0%, rgba(244,114,182,0.25) 50%, rgba(190,24,93,0.4) 100%)',
        border: '2.5px solid rgba(244,114,182,0.8)',
        boxShadow: '0 0 30px rgba(236,72,153,0.35), inset 0 0 15px rgba(255,255,255,0.7)',
      };
    }
    return {
      background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(14,165,233,0.2) 30%, rgba(3,105,161,0.4) 70%, rgba(255,255,255,0.25) 100%)',
      border: '2.5px solid rgba(186,230,253,0.8)',
      boxShadow: '0 0 30px rgba(56,189,248,0.4), inset 0 0 20px rgba(255,255,255,0.6), 0 10px 25px rgba(0,0,0,0.5)',
    };
  }, [currentTheme]);

  const isSmallColumns = columns <= 4;

  return (
    <div className="w-full flex flex-col items-center gap-1.5 select-none">
      {!hideTitle && (
        <div className="flex items-center justify-between w-full max-w-xs px-2 mb-1">
          <h3 className="text-xs sm:text-sm font-black text-cyan-200 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            {currentTheme === 'ocean-laser' && '🌊 السوروبان الليزري'}
            {currentTheme === 'classic-wood' && '🪵 السوروبان الخشبي'}
            {currentTheme === 'barbie-pink' && '💖 سوروبان باربي'}
          </h3>

          <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-full border border-slate-700/50 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setCurrentTheme('ocean-laser')}
              title="ثيم المحيط والليزر"
              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition ${currentTheme === 'ocean-laser' ? 'bg-cyan-500 scale-110 shadow-[0_0_8px_#06b6d4]' : 'opacity-60'}`}
            >
              🌊
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme('classic-wood')}
              title="الثيم الخشبي الكلاسيكي"
              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition ${currentTheme === 'classic-wood' ? 'bg-amber-700 scale-110 shadow-[0_0_8px_#b45309]' : 'opacity-60'}`}
            >
              🪵
            </button>
            <button
              type="button"
              onClick={() => setCurrentTheme('barbie-pink')}
              title="ثيم باربي الوردي"
              className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center transition ${currentTheme === 'barbie-pink' ? 'bg-pink-500 scale-110 shadow-[0_0_8px_#ec4899]' : 'opacity-60'}`}
            >
              💖
            </button>
          </div>
        </div>
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isRotated ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        className="relative rounded-2xl sm:rounded-3xl max-w-full backdrop-blur-lg"
        style={{
          padding: '6px 8px',
          ...containerStyles,
        }}
      >
        <div
          className={`relative rounded-xl sm:rounded-2xl max-w-full ${isSmallColumns ? 'overflow-hidden' : 'overflow-x-auto scrollbar-none'}`}
          style={{
            padding: '4px 8px',
            background:
              currentTheme === 'classic-wood'
                ? '#2a1a0e'
                : currentTheme === 'barbie-pink'
                ? 'linear-gradient(180deg, rgba(131,24,67,0.5) 0%, rgba(88,28,135,0.6) 100%)'
                : 'linear-gradient(180deg, rgba(12,74,110,0.5) 0%, rgba(8,47,73,0.7) 100%)',
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
          }}
        >
          <div
            className="flex flex-row-reverse items-center justify-center min-w-max mx-auto"
            style={{ gap: columns > 6 ? 4 : columns > 4 ? 6 : 10, paddingTop: '16px', paddingBottom: '4px' }}
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
                    displayOrder={displayOrder}
                    totalColumns={columns}
                    onToggleUpper={() => interactive && toggleUpper(originalIdx)}
                    onSetLower={(count) => interactive && setLower(originalIdx, count)}
                    height={Math.min(330, Math.max(250, Math.round(vh * 0.36)))}
                    beadSize={effectiveBeadSize}
                    isActive={activeRodIndex === originalIdx}
                    beamHighlight={beamHighlight}
                    tint={finalTint}
                    isDimmed={isDim}
                    theme={currentTheme}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {interactive && (
          <div className="flex justify-center items-center gap-2 mt-1.5">
            <button
              type="button"
              onClick={handleResetAll}
              className="px-3 py-0.5 rounded-full bg-cyan-400/20 hover:bg-cyan-400/40 active:scale-95 text-cyan-100 font-extrabold shadow-[0_0_10px_rgba(34,211,238,0.4)] border border-cyan-200/40 backdrop-blur-md transition text-xs"
            >
              💧 إعادة الكل
            </button>

            <button
              type="button"
              onClick={toggleRotation}
              title="تدوير المعداد"
              className="p-0.5 px-2 rounded-full bg-amber-400/20 hover:bg-amber-400/40 active:scale-95 text-amber-200 font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.4)] border border-amber-200/40 backdrop-blur-md transition text-xs"
            >
              ↻
            </button>
          </div>
        )}
      </motion.div>

      {shouldShowValue && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${totalValue}-${numberStyle}`}
            layout
            initial={{ scale: 0.6, opacity: 0, y: 5 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="text-xl sm:text-2xl font-black text-amber-300 tabular-nums drop-shadow-[0_0_12px_rgba(252,211,77,0.9)]"
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
