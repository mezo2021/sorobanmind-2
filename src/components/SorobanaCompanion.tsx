// src/components/SorobanaCompanion.tsx
import mainImg from '@/assets/sorobana/sorobana-main.webp';
import pointingImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

type LessonMode = 'watch' | 'try';
type SorobanaVariant = 'main' | 'pointing';

interface SorobanaCompanionProps {
  isSpeaking: boolean;
  onClick?: () => void;
  mode?: LessonMode;
  variant?: SorobanaVariant;
  sizeOverride?: number;
  offsetBottom?: string;
  clickThrough?: boolean;
}

export function SorobanaCompanion({
  isSpeaking,
  onClick,
  mode = 'watch',
  variant = 'main',
  sizeOverride,
  offsetBottom = '12rem',
  clickThrough = false,
}: SorobanaCompanionProps) {
  const { lang, dir } = useT();

  let size: number;
  if (sizeOverride) {
    size = sizeOverride;
  } else if (mode === 'try') {
    size = 90;
  } else {
    size = 180;
  }

  const img = variant === 'pointing' ? pointingImg : mainImg;
  const animationDuration = isSpeaking ? '0.8s' : '2.2s';

  return (
    <button
      type="button"
      onClick={clickThrough ? undefined : onClick}
      aria-label={pickLang({ ar: 'سوروبانا — المعلمة', en: 'Sorobana — The Teacher' }, lang)}
      dir={dir}
      className="fixed z-[55] select-none focus:outline-none"
      style={{
        bottom: offsetBottom,
        right: '0.25rem',
        padding: 0,
        background: 'transparent',
        border: 'none',
        pointerEvents: clickThrough ? 'none' : 'auto',
        width: size,
        animation: `sorobana-float ${animationDuration} ease-in-out infinite`,
      }}
    >
      <img
        src={img}
        alt={pickLang({ ar: 'سوروبانا', en: 'Sorobana' }, lang)}
        className="w-full pointer-events-none"
        style={{
          objectFit: 'contain',
          objectPosition: 'right bottom',
          filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
        }}
        draggable={false}
      />
    </button>
  );
}

export default SorobanaCompanion;