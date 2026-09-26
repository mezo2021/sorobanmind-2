// src/components/soroban2d5/Rod2D5.tsx
import { Bead2D5 } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';

interface Rod2D5Props {
  state: BeadState;
  columnIndex: number;
  displayOrder: number;
  /** ✅ عدد الأعمدة الكلي — لتحديد نمط الأسماء */
  totalColumns?: number;
  onToggleUpper: () => void;
  onSetLower: (count: number) => void;
  onReset: () => void;
  height?: number;
  beadSize?: number;
}

// ═══════════════════════════════════════════════════════════
// أسماء المنازل (13 منزلة)
// ═══════════════════════════════════════════════════════════

const COLUMN_LABELS: string[] = [
  'آحاد',
  'عشرات',
  'مئات',
  'آلاف',
  'عشرات الآلاف',
  'مئات الآلاف',
  'ملايين',
  'عشرات الملايين',
  'مئات الملايين',
  'مليارات',
  'عشرات المليارات',
  'مئات المليارات',
  'تريليونات',
];

// ═══════════════════════════════════════════════════════════
// حجم الخط التكيّفي — ✅ مُصغَّر أكثر
// ═══════════════════════════════════════════════════════════

function getLabelFontSize(text: string, isVertical: boolean): number {
  if (!isVertical) return 11; // أفقي (3 أعمدة) — كان 13

  const len = text.length;
  if (len >= 14) return 7;  // كان 9
  if (len >= 11) return 8;  // كان 10
  if (len >= 8) return 9;   // كان 11
  return 10;                // كان 12
}

// ═══════════════════════════════════════════════════════════
// المكوّن
// ═══════════════════════════════════════════════════════════

export function Rod2D5({
  state,
  displayOrder,
  totalColumns,
  onToggleUpper,
  onSetLower,
  onReset: _onReset,
  height = 440,
  beadSize = 44,
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

  // ✅ أسماء عمودية عند 6 أعمدة أو أكثر
  const isVertical = (totalColumns ?? 0) >= 6;

  const labelText =
    COLUMN_LABELS[displayOrder] ??
    `عمود ${displayOrder + 1}`;

  const labelFontSize = getLabelFontSize(labelText, isVertical);

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ height, width: beadSize * 1.3 }}
    >
      {/* ═══ القضيب ═══ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 6,
          height: rodHeight,
          background:
            'linear-gradient(90deg, #5a5a5a 0%, #999 50%, #5a5a5a 100%)',
          borderRadius: 3,
          boxShadow: 'inset 0 0 4px rgba(0,0,0,0.5)',
        }}
      />

      {/* ═══ الخرزة العلوية ═══ */}
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
          color="dark"
          active={state.upper === 5}
          position="upper"
          size={beadSize}
          onClick={onToggleUpper}
          animateOffset={false}
        />
      </div>

      {/* ═══ العارضة الوسطى ═══ */}
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

      {/* ═══ الخرزات السفلية ═══ */}
      {lowerBeads.map((idx) => {
        const isActive = idx < state.lower;
        const topActive = lowerAreaTop + idx * step;
        const topInactive = lowerAreaBottom - (3 - idx) * step;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: isActive ? topActive : topInactive,
              left: '50%',
              transform: 'translateX(-50%)',
              transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <Bead2D5
              color="wood"
              active={isActive}
              position="lower"
              size={beadSize}
              onClick={() => {
                if (isActive && idx === state.lower - 1) {
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

      {/* ═══ اسم المنزلة ═══
          - 3 أعمدة: أفقي (كما كان)
          - 6+ أعمدة: عمودي (writing-mode: vertical-rl)
      */}
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