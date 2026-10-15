// src/components/soroban2d5/Rod2D5.tsx
import { motion } from 'framer-motion';
import { Bead2D5 } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';
import type { RodTint } from '@/components/flash/types';

export type SorobanTheme = 'ocean-laser' | 'classic-wood' | 'barbie-pink';

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
  height = 330,
  beadSize = 34,
  isActive = false,
  beamHighlight = false,
  tint,
  isDimmed = false,
  theme = 'ocean-laser',
}: Rod2D5Props) {
  const lowerBeads = [0, 1, 2, 3];

  const beadHeight = beadSize * 0.42;
  const gap = 2;
  const step = beadHeight + gap;

  const effectiveHeight = Math.min(330, height);
  const rodHeight = effectiveHeight - 26;
  
  // النسبة 1:4 للعارضة
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

  // تحديد ألوان الخرز حسب الثيم
  let upperColor: 'dark' | 'wood' | 'gold' = 'dark';
  let lowerColor: 'dark' | 'wood' | 'gold' = 'dark';
  let upperActiveFilter = '';
  let lowerActiveFilter = '';

  if (theme === 'classic-wood') {
    upperColor = 'dark';
    lowerColor = 'wood';
  } else if (theme === 'barbie-pink') {
    upperColor = 'dark';
    lowerColor = 'dark';
    upperActiveFilter = 'sepia(1) saturate(6) hue-rotate(300deg) brightness(1.2)'; // ذهبي وردي
    lowerActiveFilter = 'sepia(1) saturate(8) hue-rotate(280deg) brightness(1.1)'; // وردي نيون
  } else {
    // Ocean Laser (الافتراضي)
    upperActiveFilter = 'sepia(1) saturate(5) hue-rotate(-10deg) brightness(1.2)'; // ذهبي شتوي
    lowerActiveFilter = 'sepia(1) saturate(5) hue-rotate(150deg) brightness(1.1)'; // سماوي مائي
  }

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        height: effectiveHeight,
        width: beadSize * 1.3,
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

      {/* Rod line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 5,
          height: rodHeight,
          background: theme === 'classic-wood' 
            ? 'linear-gradient(90deg, #3d2817 0%, #8b6344 50%, #3d2817 100%)'
            : theme === 'barbie-pink'
            ? 'linear-gradient(90deg, #831843 0%, #ec4899 50%, #831843 100%)'
            : 'linear-gradient(90deg, #1e293b 0%, #38bdf8 50%, #1e293b 100%)',
          borderRadius: 3,
          boxShadow: '0 0 6px rgba(0,0,0,0.3)',
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
        }}
      >
        <div style={state.upper === 5 && theme !== 'classic-wood' ? { filter: upperActiveFilter } : {}}>
          <Bead2D5
            color={upperColor}
            active={state.upper === 5}
            position="upper"
            size={beadSize}
            onClick={onToggleUpper}
            animateOffset={false}
          />
        </div>
      </div>

      {/* Beam */}
      {theme === 'classic-wood' ? (
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
      ) : (
        <div
          style={{
            position: 'absolute',
            top: beamY - 4,
            left: -10,
            width: beadSize * 1.3 + 20,
            height: 8,
            background: theme === 'barbie-pink' 
              ? 'linear-gradient(180deg, rgba(255,192,203,0.9) 0%, rgba(219,39,119,0.7) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(200,220,240,0.7) 100%)',
            borderRadius: 4,
            boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 2px 6px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          {/* Laser scanning back and forth */}
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', repeatType: 'reverse' }}
            style={{
              position: 'absolute',
              top: 2,
              left: 0,
              width: '50%',
              height: 4,
              background: theme === 'barbie-pink'
                ? 'linear-gradient(90deg, transparent, #ec4899, #f472b6, #ec4899, transparent)'
                : 'linear-gradient(90deg, transparent, #ef4444, #ff7b7b, #ef4444, transparent)',
              boxShadow: theme === 'barbie-pink' ? '0 0 8px #ec4899, 0 0 15px #db2777' : '0 0 8px #ef4444, 0 0 15px #dc2626',
              borderRadius: 2,
            }}
          />
        </div>
      )}

      {beamHighlight && (
        <div
          className="absolute animate-pulse pointer-events-none z-20"
          style={{
            top: beamY - 8,
            left: -10,
            width: beadSize * 1.3 + 20,
            height: 16,
            borderRadius: 8,
            background: 'rgba(239,68,68,0.35)',
            boxShadow: '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)',
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
            }}
          >
            <div style={isBeadActive && theme !== 'classic-wood' ? { filter: lowerActiveFilter } : {}}>
              <Bead2D5
                color={lowerColor}
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
          </div>
        );
      })}

      {/* Column label */}
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
