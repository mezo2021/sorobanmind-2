// src/components/soroban2d5/Soroban2D5.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, memo } from 'react';
import { useSorobanLogic } from './useSorobanLogic';
import { Rod2D5 } from './Rod2D5';
import { useBeadSound } from './useBeadSound';
import { useBeadHaptics } from './useBeadHaptics';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import type { RodTint } from '@/components/flash/types';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

export type SorobanTheme = 'classic' | 'ocean' | 'barbie';

export interface ThemeStyles {
  icon: string;
  name: string;
  nameEn: string;
  frameBg: string;
  frameGlow: string;
  innerBg: string;
  innerBorder: string;
  rodGradient: string;
  rodGlow: string;
  rodClickGlow: string;
  beadGlassEnabled: boolean;
  beadGap: number;
  beadSizeBoost: number;
  beamBase: string;
  beamSegments: string;
  beamLaser: string;
  upperBeadTint: string;
  lowerBeadTint: string;
  upperBeadGlow: string;
  lowerBeadGlow: string;
  upperDot: string;
  lowerDot: string;
  labelColor: string;
  titleColor: string;
  valueColor: string;
}

export const THEMES: Record<SorobanTheme, ThemeStyles> = {
  classic: {
    icon: '🟤', name: 'الخشبي', nameEn: 'Wooden',
    frameBg: 'linear-gradient(135deg, #8b6f47 0%, #6b4423 50%, #4a2e15 100%)',
    frameGlow: '#C9A227',
    innerBg: 'linear-gradient(180deg, rgba(254,249,240,0.95) 0%, rgba(245,230,200,0.92) 100%)',
    innerBorder: 'rgba(139,111,71,0.4)',
    rodGradient: 'linear-gradient(180deg, #8b6f47 0%, #5a3a1f 50%, #8b6f47 100%)',
    rodGlow: '#C9A227',
    rodClickGlow: '#C9A227',
    beadGlassEnabled: false,
    beadGap: 4,
    beadSizeBoost: 1.12, // 🆕 +12% لخرزات classic
    beamBase: 'linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)',
    beamSegments: '#8b6f47',
    beamLaser: '#C9A227',
    upperBeadTint: 'rgba(139,111,71,0.10)',
    lowerBeadTint: 'rgba(139,111,71,0.10)',
    upperBeadGlow: '#F5D896',
    lowerBeadGlow: '#E8C88A',
    upperDot: '#8b6f47',
    lowerDot: '#c19a6b',
    labelColor: '#8b6f47',
    titleColor: '#8b6f47',
    valueColor: '#C9A227',
  },
  ocean: {
    icon: '🌊', name: 'البحري', nameEn: 'Ocean',
    frameBg: 'linear-gradient(135deg, #0a2540 0%, #1a4d7a 50%, #0d3b66 100%)',
    frameGlow: '#7FDBFF',
    innerBg: 'linear-gradient(180deg, rgba(10,37,64,0.95) 0%, rgba(13,59,102,0.90) 100%)',
    innerBorder: 'rgba(127,219,255,0.35)',
    rodGradient: 'linear-gradient(180deg, #7FDBFF 0%, #0074D9 50%, #7FDBFF 100%)',
    rodGlow: '#7FDBFF',
    rodClickGlow: '#7FDBFF',
    beadGlassEnabled: true,
    beadGap: 12, // 🆕 +2 (كان 10)
    beadSizeBoost: 1,
    beamBase: 'linear-gradient(180deg, #ffffff 0%, #d0e8f5 50%, #ffffff 100%)',
    beamSegments: '#FF4136',
    beamLaser: '#FF4136',
    upperBeadTint: 'rgba(255,215,0,0.45)',
    lowerBeadTint: 'rgba(127,219,255,0.55)',
    upperBeadGlow: '#FFE55C',
    lowerBeadGlow: '#B8ECFF',
    upperDot: '#FFFFFF',
    lowerDot: '#FFFFFF',
    labelColor: '#FFFFFF',
    titleColor: '#FFFFFF',
    valueColor: '#FFFFFF',
  },
  barbie: {
    icon: '❤️', name: 'باربي', nameEn: 'Barbie',
    frameBg: 'linear-gradient(135deg, #4a1942 0%, #c71585 50%, #ff69b4 100%)',
    frameGlow: '#FFFFFF',
    innerBg: 'linear-gradient(180deg, rgba(74,25,66,0.95) 0%, rgba(199,21,133,0.85) 100%)',
    innerBorder: 'rgba(255,105,180,0.35)',
    rodGradient: 'linear-gradient(180deg, #FF69B4 0%, #FFC0CB 50%, #FF69B4 100%)',
    rodGlow: '#FF69B4',
    rodClickGlow: '#FFFFFF',
    beadGlassEnabled: true,
    beadGap: 12, // 🆕 +2 (كان 10)
    beadSizeBoost: 1,
    beamBase: 'linear-gradient(180deg, #ffffff 0%, #ffe0f0 50%, #ffffff 100%)',
    beamSegments: '#FF69B4',
    beamLaser: '#FFFFFF',
    upperBeadTint: 'rgba(255,255,255,0.55)',
    lowerBeadTint: 'rgba(255,105,180,0.55)',
    upperBeadGlow: '#FFFFFF',
    lowerBeadGlow: '#FFB8D8',
    upperDot: '#FFFFFF',
    lowerDot: '#FFFFFF',
    labelColor: '#FFC0CB',
    titleColor: '#FF69B4',
    valueColor: '#FF69B4',
  },
};

const THEME_STORAGE_KEY = 'soroban2d5-theme';

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
  sm: { beadSize: 34, gap: 10, framePaddingY: 14, framePaddingX: 6,  innerPaddingY: 12, innerPaddingX: 4, height: 360, topPadding: 34, bottomPadding: 10, titleSize: 'text-base', valueSize: 'text-2xl' },
  md: { beadSize: 44, gap: 14, framePaddingY: 18, framePaddingX: 8,  innerPaddingY: 14, innerPaddingX: 5, height: 420, topPadding: 40, bottomPadding: 12, titleSize: 'text-lg',   valueSize: 'text-3xl' },
  lg: { beadSize: 56, gap: 20, framePaddingY: 26, framePaddingX: 12, innerPaddingY: 18, innerPaddingX: 8, height: 500, topPadding: 48, bottomPadding: 14, titleSize: 'text-2xl',  valueSize: 'text-5xl' },
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

const FLASH_BEAD_SIZE_BY_COLUMNS: Record<number, number> = {
  1: 40, 2: 36, 3: 30, 4: 26, 5: 23, 6: 21, 7: 19, 8: 18, 9: 17,
};

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
function formatByStyle(value: number, style: 'arabic' | 'latin'): string {
  const str = String(value);
  if (style === 'arabic') {
    return str.replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
  }
  return str;
}

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

function Soroban2D5Base({
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
  theme: initialTheme = 'classic',
}: Soroban2D5Props) {
  const { lang } = useT();
  const { columns: colStates, totalValue, toggleUpper, setLower, resetColumn, resetAll, setValue } = useSorobanLogic(columns);
  const playSound = useBeadSound();
  const vibrate = useBeadHaptics();
  const numberStyle = useNumberStyleStore((s) => s.style);
  const isArabic = numberStyle === 'arabic';
  const responsiveSize = useResponsiveSize();
  const finalSize = size === 'auto' ? responsiveSize : size;
  const cfg = SIZE_CONFIG[finalSize];

  const isFlashContext =
    rodTint === 'red' || rodTint === 'emerald' || rodTint === 'white';

  const isSmallLayout = !isFlashContext && columns >= 7;

  const [currentTheme, setCurrentTheme] = useState<SorobanTheme>(() => {
    if (typeof window === 'undefined') return initialTheme;
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY) as SorobanTheme | null;
    return saved && THEMES[saved] ? saved : initialTheme;
  });

  useEffect(() => {
    if (isFlashContext || isSmallLayout) return;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    }
  }, [currentTheme, isFlashContext, isSmallLayout]);

  const effectiveTheme: SorobanTheme =
    isFlashContext || isSmallLayout ? 'classic' : currentTheme;
  const ts = THEMES[effectiveTheme];

  const visibleColumns = (() => {
    if (!autoBeadSize && !isSmallLayout && finalSize === 'sm' && columns > 4) {
      return Math.min(4, columns);
    }
    return columns;
  })();

  const displayedStates = colStates.slice(-visibleColumns);
  const displayOffset = columns - visibleColumns;

  // ═══════════════════════════════════════════════════════
  // 🎯 حجم الخرزة
  // ═══════════════════════════════════════════════════════
  const effectiveBeadSize = (() => {
    // Flash: مسار خاص
    if (isFlashContext && autoBeadSize) {
      return FLASH_BEAD_SIZE_BY_COLUMNS[displayedStates.length]
        ?? Math.max(10, Math.floor(150 / displayedStates.length / 1.3));
    }
    // 🆕 7+ أعمدة: تصغير ليتمكن الكل من الدخول
    if (isSmallLayout) {
      return Math.max(16, Math.round(cfg.beadSize * 0.45));
    }
    // 🆕 1-6 أعمدة: لا تصغير — استخدم الحجم الأساسي
    if (autoBeadSize && displayedStates.length <= 6) return cfg.beadSize;
    if (autoBeadSize) return getAutoBeadSize(displayedStates.length);
    // الوضع العادي: طبّق boost الثيم
    return Math.round(cfg.beadSize * ts.beadSizeBoost);
  })();

  const baseHeight = cfg.height;
  const heightFactor = isSmallLayout ? 0.34 : 1;
  const effectiveHeight = Math.round(baseHeight * heightFactor);

  const flashScale = effectiveBeadSize / cfg.beadSize;

  const effectiveGap = isSmallLayout
    ? 3
    : isFlashContext && autoBeadSize
    ? Math.max(3, Math.round(effectiveBeadSize * 0.17))
    : cfg.gap;

  const framePaddingX =
    isFlashContext && autoBeadSize
      ? Math.max(3, Math.round(cfg.framePaddingX * flashScale))
      : cfg.framePaddingX;

  const framePaddingY =
    isFlashContext && autoBeadSize
      ? Math.max(8, Math.round(cfg.framePaddingY * flashScale))
      : cfg.framePaddingY;

  const innerPaddingX =
    isFlashContext && autoBeadSize
      ? Math.max(2, Math.round(cfg.innerPaddingX * flashScale))
      : cfg.innerPaddingX;

  const innerPaddingY =
    isFlashContext && autoBeadSize
      ? Math.max(6, Math.round(cfg.innerPaddingY * flashScale))
      : cfg.innerPaddingY;

  const topPadding =
    isFlashContext && autoBeadSize
      ? Math.max(24, Math.round(cfg.topPadding * flashScale))
      : cfg.topPadding;

  const bottomPadding =
    isFlashContext && autoBeadSize
      ? Math.max(6, Math.round(cfg.bottomPadding * flashScale))
      : cfg.bottomPadding;

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
    <div className="w-full flex flex-col items-center gap-2 relative min-w-0">
      {!isFlashContext && !isSmallLayout && (
        <div className="flex items-center justify-between gap-2 w-full px-1">
          <div className="flex gap-1.5">
            {(['classic', 'ocean', 'barbie'] as SorobanTheme[]).map((t) => {
              const active = currentTheme === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCurrentTheme(t)}
                  aria-label={pickLang({ ar: THEMES[t].name, en: THEMES[t].nameEn }, lang)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: active ? `${THEMES[t].frameGlow}33` : 'rgba(255,255,255,0.06)',
                    border: active ? `2px solid ${THEMES[t].frameGlow}` : '2px solid transparent',
                    boxShadow: active ? `0 0 12px ${THEMES[t].frameGlow}` : 'none',
                    fontSize: 15,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {THEMES[t].icon}
                </button>
              );
            })}
          </div>

          {!hideTitle && (
            <h3
              className={`${cfg.titleSize} font-bold`}
              style={{ color: ts.titleColor, transition: 'color 0.15s' }}
            >
              {currentTheme === 'classic' && pickLang({ ar: '🟤 السوروبان الخشبي', en: '🟤 Wooden Soroban' }, lang)}
              {currentTheme === 'ocean' && pickLang({ ar: '🏄 السوروبان الليزري', en: '🏄 Laser Soroban' }, lang)}
              {currentTheme === 'barbie' && pickLang({ ar: '❤️ سوروبان باربي', en: '❤️ Barbie Soroban' }, lang)}
            </h3>
          )}
        </div>
      )}

      <div className="relative inline-flex max-w-full min-w-0">
        <div
          className="relative rounded-2xl"
          style={{
            paddingTop: framePaddingY,
            paddingBottom: framePaddingY,
            paddingLeft: framePaddingX,
            paddingRight: framePaddingX,
            background: ts.frameBg,
            boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.08), inset 0 -6px 16px rgba(0,0,0,0.4), 0 20px 40px rgba(0,0,0,0.35)',
            border: '2px solid rgba(0,0,0,0.25)',
            maxWidth: '100%',
            transition: 'background 0.15s',
          }}
        >
          <div
            className="relative rounded-xl"
            style={{
              paddingTop: innerPaddingY,
              paddingBottom: innerPaddingY,
              paddingLeft: innerPaddingX,
              paddingRight: innerPaddingX,
              background: ts.innerBg,
              boxShadow: `inset 0 4px 12px rgba(0,0,0,0.2), inset 0 0 30px ${ts.frameGlow}22`,
              border: `1px solid ${ts.innerBorder}`,
              overflow: 'visible',
              transition: 'background 0.15s, border 0.15s',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 rounded-t-xl pointer-events-none"
              style={{
                height: '30%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
              }}
            />

            <div
              className="flex flex-row-reverse items-center justify-center relative"
              style={{
                gap: effectiveGap,
                paddingTop: topPadding,
                paddingBottom: bottomPadding,
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
                    showLabel={!hideColumnLabels}
                    themeStyles={ts}
                    beadGap={ts.beadGap}
                  />
                );
              })}
            </div>

            {displayOffset > 0 && (
              <p className="text-center text-[10px] mt-1" style={{ color: ts.labelColor }}>
                ✨ {formatByStyle(visibleColumns, numberStyle)} {pickLang({ ar: 'أعمدة', en: 'columns' }, lang)}
              </p>
            )}
          </div>

          {interactive && (
            <div className="flex justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="px-4 py-1.5 rounded-full font-bold transition text-xs"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                ↺ {pickLang({ ar: 'إعادة الكل', en: 'Reset All' }, lang)}
              </button>
            </div>
          )}
        </div>
      </div>

      {shouldShowValue && (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${totalValue}-${numberStyle}-${effectiveTheme}`}
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`${cfg.valueSize} font-black tabular-nums`}
            style={{
              fontFamily: 'monospace',
              color: ts.valueColor,
              textShadow: `0 0 15px ${ts.frameGlow}, 0 4px 8px rgba(0,0,0,0.3)`,
            }}
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {formatByStyle(totalValue, numberStyle)}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export const Soroban2D5 = memo(Soroban2D5Base);
export default Soroban2D5;