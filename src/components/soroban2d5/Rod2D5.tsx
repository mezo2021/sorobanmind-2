// src/components/soroban2d5/Rod2D5.tsx
import { Bead2D5 } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';

interface Rod2D5Props {
  state: BeadState;
  columnIndex: number;
  displayOrder: number;
  onToggleUpper: () => void;
  onSetLower: (count: number) => void;
  onReset: () => void;
  height?: number;
  beadSize?: number;
}

export function Rod2D5({
  state,
  displayOrder,
  onToggleUpper,
  onSetLower,
  onReset,
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

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ height, width: beadSize * 1.3 }}
    >
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

      <button
        type="button"
        onClick={onReset}
        className="absolute text-amber-700 hover:text-amber-900 underline whitespace-nowrap"
        style={{
          fontSize: 11,
          bottom: 2,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        aria-label="إعادة تصفير العمود"
      >
        ↺ تصفير
      </button>

      <div
        className="absolute text-amber-800 font-bold whitespace-nowrap"
        style={{
          fontSize: 13,
          top: -22,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {['آحاد', 'عشرات', 'مئات', 'آلاف', 'عشرات الآلاف', 'مئات الآلاف'][displayOrder] ||
          `عمود ${displayOrder + 1}`}
      </div>
    </div>
  );
}

export default Rod2D5;