// src/components/soroban2d5/Rod2D5.tsx
import { motion } from 'framer-motion';
import { Bead2D5, BEAD_ASPECT_RATIO } from './Bead2D5';
import type { BeadColorType } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';
import type { RodTint } from '@/components/flash/types';

export type SorobanTheme = 'ocean-laser' | 'classic-wood' | 'barbie-pink';

interface Rod2D5Props {
  state: BeadState;
  displayOrder: number;
  totalColumns?: number;
  onToggleUpper: () => void;
  onSetLower: (count: number) => void;
  height?: number;
  beadSize?: number;
  isActive?: boolean;
  beamHighlight?: boolean;
  tint?: RodTint;
  isDimmed?: boolean;
  theme?: SorobanTheme;
}

const COLUMN_LABELS: string[] = [
  'آحاد', 'عشرات', 'مئات', 'آلاف',
  'عشرات الآلاف', 'مئات الآلاف',
  'ملايين', 'عشرات الملايين', 'مئات الملايين',
  'مليارات', 'عشرات المليارات', 'مئات المليارات',
  'تريليونات',
];

const LOWER_BEADS = [0, 1, 2, 3] as const;
const MAX_EFFECTIVE_HEIGHT = 330;

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
  height = 330,
  beadSize = 34,
  isActive = false,
  beamHighlight = false,
  tint,
  isDimmed = false,
  theme = 'ocean-laser',
}: Rod2D5Props) {
  const beadHeight = beadSize * BEAD_ASPECT_RATIO;
  const wrapperWidth = beadSize * 1.3;
  const gap = 2;
  const step = beadHeight + gap;

  const effectiveHeight = Math.min(height, MAX_EFFECTIVE_HEIGHT);
  const rodHeight = effectiveHeight - 26;
  
  // العارضة عند 25% من ارتفاع العمود (نسبة السوروبان القياسية 1:4)
  const beamY = Math.round(rodHeight * 0.25);

  const upperBeadTop = 2;
  const upperBeadActive = beamY - beadHeight - 2;

  const lowerAreaTop = beamY + 4;
  const lowerAreaBottom = rodHeight - beadHeight - 2;

  const isVertical = (totalColumns ?? 0) >= 6;
  const labelText = COLUMN_LABELS[displayOrder] ?? `عمود ${displayOrder + 1}`;
  const labelFontSize = getLabelFontSize(labelText, isVertical);

  const wrapperOpacity = isDimmed ? 0.25 : 1;
  const wrapperFilter = isDimmed ? 'grayscale(1)' : 'none';

  const isWood = theme === 'classic-wood';
  const isBarbie = theme === 'barbie-pink';

  let upperBeadColor: BeadColorType = 'charcoal';
  let lowerBeadColors: BeadColorType[] = ['charcoal', 'charcoal', 'charcoal', 'charcoal'];

  if (tint) {
    const flashColor: BeadColorType =
      tint === 'emerald' ? 'emerald' : tint === 'red' ? 'red' : 'white';
    upperBeadColor = flashColor;
    lowerBeadColors = [flashColor, flashColor, flashColor, flashColor];
  } else {
    const isUpperActive = state.upper === 5;

    if (isWood) {
      upperBeadColor = isUpperActive ? 'wood' : 'charcoal';
      lowerBeadColors = LOWER_BEADS.map((idx) => (idx < state.lower ? 'wood' : 'charcoal'));
    } else if (isBarbie) {
      // 💖 ثيم باربي: العلوي بنفسجي مضاء، والسفلي أبيض لامع
      upperBeadColor = isUpperActive ? 'purple' : 'charcoal';
      lowerBeadColors = LOWER_BEADS.map((idx) => (idx < state.lower ? 'white' : 'charcoal'));
    } else {
      // 🌊 Ocean Laser (الافتراضي)
      upperBeadColor = isUpperActive ? 'gold' : 'charcoal';
      lowerBeadColors = LOWER_BEADS.map((idx) => (idx < state.lower ? 'cyan' : 'charcoal'));
    }
  }

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        height: effectiveHeight,
        width: wrapperWidth,
        opacity: wrapperOpacity,
        filter: wrapperFilter,
        transition: 'opacity 0.4s, filter 0.4s',
      }}
    >
      {isActive && (
        <div
          className="absolute border-2 border-cyan-400 bg-cyan-400/10 rounded-xl animate-pulse pointer-events-none z-10"
          style={{ inset: -6, boxShadow: '0 0 16px rgba(34,211,238,0.55)' }}
        />
      )}

      {/* عمود السوروبان */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 4,
          height: rodHeight,
          background: isWood
            ? 'linear-gradient(90deg, #3d2817 0%, #8b6344 50%, #3d2817 100%)'
            : isBarbie
            ? 'linear-gradient(90deg, #831843 0%, #ec4899 50%, #831843 100%)'
            : 'linear-gradient(90deg, #1e293b 0%, #38bdf8 50%, #1e293b 100%)',
          borderRadius: 2,
          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
        }}
      />

      {/* الخرزة العلوية */}
      <div
        style={{
          position: 'absolute',
          top: state.upper === 5 ? upperBeadActive : upperBeadTop,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <Bead2D5
          color={upperBeadColor}
          active={state.upper === 5}
          position="upper"
          size={beadSize}
          onClick={onToggleUpper}
          animateOffset={false}
        />
      </div>

      {/* العارضة والليزر */}
      {isWood ? (
        <div
          style={{
            position: 'absolute',
            top: beamY - 2,
            left: -6,
            width: wrapperWidth + 12,
            height: 4,
            background: 'linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: beamY - 2.5,
            left: -8,
            width: wrapperWidth + 16,
            height: 5,
            background: isBarbie
              ? 'linear-gradient(180deg, rgba(255,192,203,0.95) 0%, rgba(219,39,119,0.8) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(200,220,240,0.8) 100%)',
            borderRadius: 2.5,
            boxShadow: '0 0 10px rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.4)',
            overflow: 'hidden',
            border: '0.5px solid rgba(255,255,255,0.9)',
          }}
        >
          <motion.div
            animate={isDimmed ? { x: 0 } : { x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', repeatType: 'reverse' }}
            style={{
              position: 'absolute',
              top: 1,
              left: 0,
              width: '50%',
              height: 3,
              background: isBarbie
                ? 'linear-gradient(90deg, transparent, #ec4899, #f472b6, #ec4899, transparent)'
                : 'linear-gradient(90deg, transparent, #ef4444, #ff7b7b, #ef4444, transparent)',
              boxShadow: isBarbie
                ? '0 0 6px #ec4899, 0 0 12px #db2777'
                : '0 0 6px #ef4444, 0 0 12px #dc2626',
              borderRadius: 1.5,
            }}
          />
        </div>
      )}

      {beamHighlight && (
        <div
          className="absolute animate-pulse pointer-events-none z-20"
          style={{
            top: beamY - 6,
            left: -8,
            width: wrapperWidth + 16,
            height: 12,
            borderRadius: 6,
            background: 'rgba(239,68,68,0.35)',
            boxShadow: '0 0 16px rgba(239,68,68,0.8), 0 0 30px rgba(239,68,68,0.4)',
          }}
        />
      )}

      {/* الخرزات السفلية */}
      {LOWER_BEADS.map((idx) => {
        const isBeadActive = idx < state.lower;
        const topActive = lowerAreaTop + idx * step;
        const topInactive = lowerAreaBottom - (3 - idx) * step;
        const beadColor = lowerBeadColors[idx] ?? 'charcoal';

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: isBeadActive ? topActive : topInactive,
              left: '50%',
              transform: 'translateX(-50%)',
              transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Bead2D5
              color={beadColor}
              active={isBeadActive}
              position="lower"
              size={beadSize}
              onClick={() => {
                if (isBeadActive) {
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

      {/* تسمية العمود */}
      <div
        className="absolute text-cyan-200 font-extrabold drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]"
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
