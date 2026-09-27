import type { CertificateLevel } from '@/utils/certificateGenerator';

interface CertificateMedalProps {
  level: CertificateLevel;
  size?: number;
}

const LEVEL_CONFIG = {
  gold: {
    outer1: '#FFF59D', outer2: '#FFD700', outer3: '#B8860B',
    inner1: '#FFF8DC', inner2: '#FFD700', inner3: '#DAA520',
    edge: '#8B6914', textColor: '#5D3A1A', number: '1',
  },
  silver: {
    outer1: '#FFFFFF', outer2: '#E0E0E0', outer3: '#909090',
    inner1: '#FFFFFF', inner2: '#C0C0C0', inner3: '#909090',
    edge: '#606060', textColor: '#404040', number: '2',
  },
  bronze: {
    outer1: '#F5D5B0', outer2: '#CD7F32', outer3: '#8B4513',
    inner1: '#F5E6D3', inner2: '#CD7F32', inner3: '#A0522D',
    edge: '#5D3A1A', textColor: '#3D1E0A', number: '3',
  },
  pass: {
    outer1: '#B3D4F5', outer2: '#4A90E2', outer3: '#2C5AA0',
    inner1: '#E3F2FD', inner2: '#4A90E2', inner3: '#2C5AA0',
    edge: '#1A3D7A', textColor: '#FFFFFF', number: '★',
  },
  fail: {
    outer1: '#E5E7EB', outer2: '#9CA3AF', outer3: '#6B7280',
    inner1: '#F3F4F6', inner2: '#9CA3AF', inner3: '#6B7280',
    edge: '#4B5563', textColor: '#374151', number: '—',
  },
} as const;

export default function CertificateMedal({ level, size = 64 }: CertificateMedalProps) {
  const c = LEVEL_CONFIG[level];
  const uid = `medal-${level}`;

  return (
    <svg width={size} height={size} viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={`ميدالية ${level}`}>
      <defs>
        <radialGradient id={`${uid}-outer`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={c.outer1} />
          <stop offset="40%" stopColor={c.outer2} />
          <stop offset="100%" stopColor={c.outer3} />
        </radialGradient>
        <radialGradient id={`${uid}-inner`} cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor={c.inner1} />
          <stop offset="55%" stopColor={c.inner2} />
          <stop offset="100%" stopColor={c.inner3} />
        </radialGradient>
        <linearGradient id={`${uid}-ribbon1`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id={`${uid}-ribbon2`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <linearGradient id={`${uid}-shine`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" />
          <feOffset dx="0" dy="1.5" result="offsetblur" />
          <feComponentTransfer><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g>
        <path d="M 30,18 L 22,72 L 38,72 L 44,20 Z" fill={`url(#${uid}-ribbon1)`} stroke="#3D1470" strokeWidth="0.6" />
        <path d="M 70,18 L 78,72 L 62,72 L 56,20 Z" fill={`url(#${uid}-ribbon2)`} stroke="#7B5D0A" strokeWidth="0.6" />
        <polygon points="50,4 52,10 58,10 53,14 55,20 50,16 45,20 47,14 42,10 48,10" fill="#FFD700" stroke="#8B6914" strokeWidth="0.5" />
      </g>

      <g filter={`url(#${uid}-shadow)`}>
        <circle cx="50" cy="68" r="32" fill={`url(#${uid}-outer)`} />
        <circle cx="50" cy="68" r="32" fill="none" stroke={c.edge} strokeWidth="0.8" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * (360 / 24) * Math.PI) / 180;
          const x = 50 + 29 * Math.cos(angle);
          const y = 68 + 29 * Math.sin(angle);
          return <circle key={`dot-${i}`} cx={x} cy={y} r={i % 3 === 0 ? '1' : '0.55'} fill={c.edge} opacity={i % 3 === 0 ? '0.9' : '0.6'} />;
        })}
        <circle cx="50" cy="68" r="23" fill={`url(#${uid}-inner)`} />
        <circle cx="50" cy="68" r="23" fill="none" stroke={c.edge} strokeWidth="1.2" />
        <ellipse cx="50" cy="56" rx="18" ry="9" fill={`url(#${uid}-shine)`} />
        <text x="50" y="77" textAnchor="middle" fontFamily="serif" fontWeight="900" fontSize="24" fill={c.textColor} stroke={c.edge} strokeWidth="0.4" style={{ filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.35))' }}>{c.number}</text>
        <polygon points="24,68 25.5,71 28.5,71 26,73 27,76 24,74 21,76 22,73 19.5,71 22.5,71" fill={c.edge} opacity="0.75" />
        <polygon points="76,68 77.5,71 80.5,71 78,73 79,76 76,74 73,76 74,73 71.5,71 74.5,71" fill={c.edge} opacity="0.75" />
      </g>
    </svg>
  );
}