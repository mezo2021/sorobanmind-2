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
  dimColumns?: number[];   // 🆕 أعمدة مطموسة
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
  sm: { beadSize: 34, gap: 10, framePadding: 14, innerPadding: 12, height: 380, topPadding: 34, bottomPadding: 10, titleSize: 'text-base', valueSize: 'text-2xl' },
  md: { beadSize: 44, gap: 14, framePadding: 18, innerPadding: 14, height: 440, topPadding: 40, bottomPadding: 12, titleSize: 'text-lg', valueSize: 'text-3xl' },
  lg: { beadSize: 56, gap: 20, framePadding: 26, innerPadding: 18, height: 520, topPadding: 48, bottomPadding: 14, titleSize: 'text-2xl', valueSize: 'text-5xl' },
};

function getAutoBeadSize(columns: number): number {
  if (columns <= 2) return 52;
  if (columns <= 3) return 46;
  if (columns <= 4) return 38;
  if (columns <= 5) return 32;
  if (columns <= 6) return 28;
  if (columns <= 9) return 20;
  return 16;
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
            style={{ gap: cfg.gap, paddingTop: cfg.topPadding, paddingBottom: cfg.bottomPadding }}
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

// src/components/soroban2d5/Rod2D5.tsx
import { Bead2D5 } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';
import type { RodTint } from '@/components/flash/types';

interface Rod2D5Props {
  state: BeadState;
  columnIndex: number;
  displayOrder: number;
  totalColumns?: number;
  onToggleUpper: () => void;
  onSetLower: (count: number) => void;
  onReset: () => void;
  height?: number;
  beadSize?: number;
  isActive?: boolean;
  beamHighlight?: boolean;
  tint?: RodTint;
  isDimmed?: boolean;   // 🆕
}

const COLUMN_LABELS: string[] = [
  'آحاد', 'عشرات', 'مئات', 'آلاف',
  'عشرات الآلاف', 'مئات الآلاف',
  'ملايين', 'عشرات الملايين', 'مئات الملايين',
  'مليارات', 'عشرات المليارات', 'مئات المليارات',
  'تريليونات',
];

// 🎨 CSS filter لتلوين الخرزات فقط — لا يلمس الخلفية
function getBeadFilter(tint?: RodTint): string | undefined {
  switch (tint) {
    case 'red':
      return 'grayscale(1) sepia(1) saturate(8) hue-rotate(-45deg) brightness(0.7)';
    case 'emerald':
      return 'grayscale(1) sepia(1) saturate(6) hue-rotate(75deg) brightness(0.95)';
    case 'white':
      return 'grayscale(1) brightness(2.2)';
    default:
      return undefined;
  }
}

function getLabelFontSize(text: string, isVertical: boolean): number {
  if (!isVertical) return 11;
  const len = text.length;
  if (len >= 14) return 7;
  if (len >= 11) return 8;
  if (len >= 8) return 9;
  return 10;
}

export function Rod2D5({
  state,
  displayOrder,
  totalColumns,
  onToggleUpper,
  onSetLower,
  onReset: _onReset,
  height = 440,
  beadSize = 44,
  isActive = false,
  beamHighlight = false,
  tint,
  isDimmed = false,   // 🆕
}: Rod2D5Props) {
  const lowerBeads = [0, 1, 2, 3];

  const beadHeight = beadSize * 0.42;
  const gap = 2;
  const step = beadHeight + gap;

  const rodHeight = height - 30;
  const beamY = rodHeight / 2;

  const upperBeadTop = 2;
  const upperBeadActive = beamY - beadHeight - 2;

  const lowerAreaTop = beamY + 4;
  const lowerAreaBottom = rodHeight - beadHeight - 2;

  const isVertical = (totalColumns ?? 0) >= 6;

  const labelText =
    COLUMN_LABELS[displayOrder] ?? `عمود ${displayOrder + 1}`;

  const labelFontSize = getLabelFontSize(labelText, isVertical);

  const isWhiteHighlight = tint === 'white';
  const beadFilter = getBeadFilter(tint);

  const wrapperOpacity = isDimmed ? 0.25 : 1;
  const wrapperFilter = isDimmed ? 'grayscale(1)' : 'none';

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        height,
        width: beadSize * 1.3,
        opacity: wrapperOpacity,
        filter: wrapperFilter,
        transition: 'opacity 0.4s, filter 0.4s',
      }}
    >
      {/* Amber glow (basics only) */}
      {isActive && (
        <div
          className="absolute border-2 border-amber-400 bg-amber-400/10 rounded-xl animate-pulse pointer-events-none z-10"
          style={{ inset: -6, boxShadow: '0 0 16px rgba(251,191,36,0.55)' }}
        />
      )}

      {/* ⚪ White highlight ring — ONLY for the changed column */}
      {isWhiteHighlight && (
        <div
          className="absolute rounded-xl pointer-events-none z-20 animate-pulse"
          style={{
            inset: -6,
            border: '2.5px solid rgba(255,255,255,0.95)',
            boxShadow:
              '0 0 24px rgba(255,255,255,1), 0 0 48px rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
      )}

      {/* Rod line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 6,
          height: rodHeight,
          background: 'linear-gradient(90deg, #5a5a5a 0%, #999 50%, #5a5a5a 100%)',
          borderRadius: 3,
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
        }}
      />

      {/* Upper bead */}
      <div
        style={{
          position: 'absolute',
          top: state.upper === 5 ? upperBeadActive : upperBeadTop,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: beadFilter,
        }}
      >
        <Bead2D5
          color="dark"
          active={state.upper === 5}
          position="upper"
          size={beadSize}
          onClick={onToggleUpper}
          animateOffset={false}
        />
      </div>

      {/* Beam */}
      <div
        style={{
          position: 'absolute',
          top: beamY - 3,
          left: -8,
          width: beadSize * 1.3 + 16,
          height: 6,
          background: 'linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)',
          borderRadius: 3,
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }}
      />

      {/* Beam highlight (basics) */}
      {beamHighlight && (
        <div
          className="absolute animate-pulse pointer-events-none z-20"
          style={{
            top: beamY - 8,
            left: -10,
            width: beadSize * 1.3 + 20,
            height: 16,
            borderRadius: 8,
            background: 'rgba(251,191,36,0.45)',
            boxShadow:
              '0 0 20px rgba(251,191,36,0.9), 0 0 40px rgba(251,191,36,0.5)',
          }}
        />
      )}

      {/* Lower beads */}
      {lowerBeads.map((idx) => {
        const isBeadActive = idx < state.lower;
        const topActive = lowerAreaTop + idx * step;
        const topInactive = lowerAreaBottom - (3 - idx) * step;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: isBeadActive ? topActive : topInactive,
              left: '50%',
              transform: 'translateX(-50%)',
              transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: beadFilter,
            }}
          >
            <Bead2D5
              color="wood"
              active={isBeadActive}
              position="lower"
              size={beadSize}
              onClick={() => {
                if (isBeadActive && idx === state.lower - 1) {
                  onSetLower(idx);
                } else {
                  onSetLower(idx + 1);
                }
              }}
              animateOffset={false}
            />
          </div>
        );
      })}

      {/* Column label */}
      <div
        className="absolute text-amber-800 font-bold"
        style={{
          fontSize: labelFontSize,
          bottom: 'calc(100% + 4px)',
          left: '50%',
          transform: 'translateX(-50%)',
          writingMode: isVertical ? 'vertical-rl' : 'horizontal-tb',
          textOrientation: 'mixed',
          lineHeight: 1.05,
          letterSpacing: isVertical ? 0 : 0.3,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
        title={labelText}
      >
        {labelText}
      </div>
    </div>
  );
}

export default Rod2D5;