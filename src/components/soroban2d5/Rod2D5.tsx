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

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ height, width: beadSize * 1.3 }}
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