// src/components/soroban2d5/Rod2D5.tsx
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { Bead2D5 } from './Bead2D5';
import type { BeadState } from './useSorobanLogic';
import type { RodTint } from '@/components/flash/types';
import type { ThemeStyles } from './Soroban2D5';

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
  showLabel?: boolean;
  themeStyles?: ThemeStyles;
  isRotated?: boolean;
}

const COLUMN_LABELS: string[] = [
  'آحاد', 'عشرات', 'مئات', 'آلاف',
  'عشرات الآلاف', 'مئات الآلاف',
  'ملايين', 'عشرات الملايين', 'مئات الملايين',
  'مليارات', 'عشرات المليارات', 'مئات الملايين',
  'تريليونات',
];

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

// ============================================================
// 🌟 غلاف زجاجي موحّد — بلا ظل خارجي، حد داخلي رقيق
// ============================================================
function BeadGlass({
  children,
  isBeadActive,
  tintColor,
  glowColor,
  dotColor,
  isFlashMode,
  enableGlass,
}: {
  children: ReactNode;
  isBeadActive: boolean;
  tintColor: string;
  glowColor: string;
  dotColor: string;
  isFlashMode: boolean;
  enableGlass: boolean;
}) {
  if (isFlashMode) {
    return <>{children}</>;
  }

  if (!enableGlass) {
    return (
      <div style={{ position: 'relative' }}>
        {children}
        {isBeadActive && (
          <div
            className="bead-glow-pulse"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: `radial-gradient(circle at 50% 42%, ${glowColor}ee 0%, ${glowColor}99 45%, ${glowColor}33 78%, transparent 100%)`,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              willChange: 'opacity',
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {children}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: tintColor,
          mixBlendMode: 'color',
          pointerEvents: 'none',
        }}
      />

      {/* زجاج داخلي — بلا ظل خارجي */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.28) 100%)',
          border: '1px solid rgba(255,255,255,0.45)',
          boxShadow:
            'inset 0 1px 3px rgba(255,255,255,0.85), inset 0 -1px 3px rgba(0,0,0,0.12)',
          backdropFilter: 'blur(1.5px)',
          WebkitBackdropFilter: 'blur(1.5px)',
          pointerEvents: 'none',
        }}
      />

      {/* النقطة البيضاء */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 3,
          height: 3,
          borderRadius: '50%',
          background: dotColor,
          boxShadow: `0 0 3px ${dotColor}, 0 0 6px ${dotColor}66`,
          pointerEvents: 'none',
        }}
      />

      {isBeadActive && (
        <div
          className="bead-glow-pulse"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 42%, ${glowColor} 0%, ${glowColor}cc 40%, ${glowColor}66 72%, transparent 100%)`,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
            willChange: 'opacity',
          }}
        />
      )}
    </div>
  );
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
  isDimmed = false,
  showLabel = true,
  themeStyles,
  isRotated = false,
}: Rod2D5Props) {
  const ts: ThemeStyles = themeStyles ?? {
    icon: '', name: '',
    frameBg: '', frameGlow: '#C9A227',
    innerBg: '', innerBorder: '',
    rodGradient: 'linear-gradient(90deg, #5a5a5a 0%, #999 50%, #5a5a5a 100%)',
    rodGlow: '#999',
    rodClickGlow: '#C9A227',
    beadGlassEnabled: false,
    beamBase: 'linear-gradient(180deg, #3d2817 0%, #1a0f08 100%)',
    beamSegments: '#8b6f47',
    beamLaser: '#C9A227',
    upperBeadTint: 'rgba(139,111,71,0.10)',
    lowerBeadTint: 'rgba(139,111,71,0.10)',
    upperBeadGlow: '#F5D896',
    lowerBeadGlow: '#E8C88A',
    upperDot: '#FFFFFF',
    lowerDot: '#FFFFFF',
    labelColor: '#8b6f47',
    titleColor: '#8b6f47',
    valueColor: '#C9A227',
  };

  const lowerBeads = [0, 1, 2, 3];
  const beadHeight = beadSize * 0.42;
  const gap = 4;
  const step = beadHeight + gap;

  const rodHeight = height - 30;
  const beamY = rodHeight * 0.25;

  // 🆕 فجوة متناسبة بين الخرزة والعارضة (8px كحد أدنى)
  const beamGap = Math.max(8, Math.round(beadSize * 0.2));

  const upperBeadTop = 2;
  const upperBeadActive = beamY - beadHeight - beamGap;
  const lowerAreaTop = beamY + 4 + beamGap;
  const lowerAreaBottom = rodHeight - beadHeight - 2;

  const isVertical = (totalColumns ?? 0) >= 6;
  const labelText = COLUMN_LABELS[displayOrder] ?? `عمود ${displayOrder + 1}`;
  const labelFontSize = getLabelFontSize(labelText, isVertical);

  const isWhiteHighlight = tint === 'white';
  const beadFilter = getBeadFilter(tint);
  const isFlashMode = tint === 'red' || tint === 'emerald' || tint === 'white';

  const wrapperOpacity = isDimmed ? 0.25 : 1;
  const wrapperFilter = isDimmed ? 'grayscale(1)' : 'none';

  const [clickGlow, setClickGlow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerGlow = () => {
    setClickGlow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setClickGlow(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleUpperClick = () => {
    triggerGlow();
    onToggleUpper();
  };

  const handleLowerClick = (idx: number, isBeadActive: boolean) => {
    triggerGlow();
    if (isBeadActive) onSetLower(idx);
    else onSetLower(idx + 1);
  };

  const labelTransform = isRotated
    ? 'translateX(-50%) rotate(-90deg)'
    : 'translateX(-50%)';

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
      {clickGlow && !isFlashMode && (
        <div
          className="rod-click-glow"
          style={{
            position: 'absolute',
            inset: -8,
            borderRadius: 16,
            border: `2px solid ${ts.rodClickGlow}`,
            boxShadow: `0 0 20px ${ts.rodClickGlow}, 0 0 40px ${ts.rodClickGlow}88, inset 0 0 20px ${ts.rodClickGlow}44`,
            pointerEvents: 'none',
            zIndex: 20,
            willChange: 'opacity',
          }}
        />
      )}

      {isActive && (
        <div
          className="absolute border-2 rounded-xl animate-pulse pointer-events-none z-10"
          style={{
            inset: -6,
            borderColor: ts.rodGlow,
            background: `${ts.rodGlow}15`,
            boxShadow: `0 0 16px ${ts.rodGlow}aa`,
          }}
        />
      )}

      {isWhiteHighlight && (
        <div
          className="absolute rounded-xl pointer-events-none z-20 animate-pulse"
          style={{
            inset: -6,
            border: '2.5px solid rgba(255,255,255,0.95)',
            boxShadow: '0 0 24px rgba(255,255,255,1), 0 0 48px rgba(255,255,255,0.7)',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 5,
          height: rodHeight,
          background: ts.rodGradient,
          borderRadius: 3,
          boxShadow: `0 0 8px ${ts.rodGlow}66, inset 0 0 4px rgba(0,0,0,0.3)`,
          transition: 'background 0.15s',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: state.upper === 5 ? upperBeadActive : upperBeadTop,
          left: '50%',
          transform: 'translateX(-50%)',
          transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: beadFilter,
          zIndex: 5,
        }}
      >
        <BeadGlass
          isBeadActive={state.upper === 5}
          tintColor={ts.upperBeadTint}
          glowColor={ts.upperBeadGlow}
          dotColor={ts.upperDot}
          isFlashMode={isFlashMode}
          enableGlass={ts.beadGlassEnabled}
        >
          <Bead2D5
            color="dark"
            active={state.upper === 5}
            position="upper"
            size={beadSize}
            onClick={handleUpperClick}
            animateOffset={false}
          />
        </BeadGlass>
      </div>

      <div
        style={{
          position: 'absolute',
          top: beamY - 2,
          left: -8,
          width: beadSize * 1.3 + 16,
          height: 4,
          background: ts.beamBase,
          borderRadius: 2,
          overflow: 'hidden',
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `repeating-linear-gradient(90deg, transparent 0, transparent ${beadSize * 0.4}px, ${ts.beamSegments} ${beadSize * 0.4}px, ${ts.beamSegments} ${beadSize * 0.45}px)`,
            opacity: 0.65,
          }}
        />

        {clickGlow && !isFlashMode && (
          <div
            className="beam-laser-pulse"
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '25%',
              background: `linear-gradient(90deg, transparent 0%, ${ts.beamLaser} 50%, transparent 100%)`,
              boxShadow: `0 0 12px ${ts.beamLaser}, 0 0 20px ${ts.beamLaser}aa`,
              willChange: 'transform',
            }}
          />
        )}
      </div>

      {beamHighlight && (
        <div
          className="absolute animate-pulse pointer-events-none z-20"
          style={{
            top: beamY - 6,
            left: -10,
            width: beadSize * 1.3 + 20,
            height: 12,
            borderRadius: 6,
            background: `${ts.rodGlow}66`,
            boxShadow: `0 0 20px ${ts.rodGlow}, 0 0 40px ${ts.rodGlow}88`,
          }}
        />
      )}

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
              zIndex: 5,
            }}
          >
            <BeadGlass
              isBeadActive={isBeadActive}
              tintColor={ts.lowerBeadTint}
              glowColor={ts.lowerBeadGlow}
              dotColor={ts.lowerDot}
              isFlashMode={isFlashMode}
              enableGlass={ts.beadGlassEnabled}
            >
              <Bead2D5
                color="wood"
                active={isBeadActive}
                position="lower"
                size={beadSize}
                onClick={() => handleLowerClick(idx, isBeadActive)}
                animateOffset={false}
              />
            </BeadGlass>
          </div>
        );
      })}

      {showLabel && (
        <div
          className="absolute font-bold"
          style={{
            fontSize: labelFontSize,
            bottom: 'calc(100% + 4px)',
            left: '50%',
            transform: labelTransform,
            writingMode: isRotated
              ? 'horizontal-tb'
              : isVertical
              ? 'vertical-rl'
              : 'horizontal-tb',
            textOrientation: 'mixed',
            lineHeight: 1.05,
            letterSpacing: isVertical && !isRotated ? 0 : 0.3,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textAlign: 'center',
            color: ts.labelColor,
            transition: 'color 0.15s, transform 0.35s ease',
          }}
          title={labelText}
        >
          {labelText}
        </div>
      )}
    </div>
  );
}

export default Rod2D5;