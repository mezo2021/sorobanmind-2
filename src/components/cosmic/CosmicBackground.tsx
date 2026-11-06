// src/components/cosmic/CosmicBackground.tsx
// خلفية كونية دائمة: <CosmicHost> يُركَّب مرة واحدة في الجذر (Manager) ولا يُدمَّر عند تبديل الشاشات.
// أي <CosmicBackground /> داخل الشاشات لا يرسم شيئاً داخل المضيف، بل يمرّر ألوانه فقط (تغيير لون بلا إعادة تركيب).
// خارج المضيف يعمل كما كان (توافق رجعي).
import { ReactNode, createContext, memo, useContext, useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}
function stars(count: number, seed: number, size: number, color: string) {
  const r = rng(seed);
  return Array.from({ length: count }, () => `${Math.floor(r() * 1000) / 10}vw ${Math.floor(r() * 1000) / 10}vh 0 ${size / 2}px ${color}`).join(',');
}

type LayerProps = { accent?: string; accent2?: string; intensity?: number; fixed?: boolean };

const Layer = memo(function Layer({ accent = '#6366f1', accent2 = '#a855f7', intensity = 1, fixed = false }: LayerProps) {
  const reduce = useReducedMotion();
  const layers = useMemo(() => [
    { s: stars(40, 11, 1.2, 'rgba(255,255,255,0.55)'), dur: 160 },
    { s: stars(22, 23, 2, 'rgba(186,230,253,0.65)'), dur: 110 },
    { s: stars(10, 37, 3, 'rgba(253,230,138,0.75)'), dur: 70 },
  ], []);
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} inset-0 overflow-hidden pointer-events-none z-0`} style={{ backgroundColor: '#05060f' }} aria-hidden>
      <div className="absolute inset-0 bg-gradient-to-b from-[#05060f] via-[#0b0b25] to-[#05060f]" />
      <motion.div className="absolute -top-1/4 -left-1/4 w-[80vmax] h-[80vmax] rounded-full" style={{ background: `radial-gradient(circle, ${accent}55, transparent 60%)` }}
        animate={reduce ? { opacity: 0.5 * intensity } : { opacity: [0.35 * intensity, 0.6 * intensity, 0.35 * intensity] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute -bottom-1/3 -right-1/4 w-[70vmax] h-[70vmax] rounded-full" style={{ background: `radial-gradient(circle, ${accent2}55, transparent 60%)` }}
        animate={reduce ? { opacity: 0.45 * intensity } : { opacity: [0.5 * intensity, 0.25 * intensity, 0.5 * intensity] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} />
      {[0, 1].map((k) => layers.map((l, i) => (
        <motion.div key={`${k}-${i}`} className={`absolute left-0 w-px h-px ${k === 0 ? 'top-0' : 'top-[100vh]'}`} style={{ boxShadow: l.s }}
          animate={reduce ? undefined : { y: ['0vh', '-100vh'] }} transition={{ duration: l.dur, repeat: Infinity, ease: 'linear' }} />
      )))}
    </div>
  );
});

interface HostApi { setColors: (a: string, b: string) => void }
const HostCtx = createContext<HostApi | null>(null);

/** يُركَّب مرة واحدة فوق كل الشاشات. الأبناء يظهرون فوق الخلفية. */
export function CosmicHost({ children }: { children: ReactNode }) {
  const [c, setC] = useState({ a: '#6366f1', b: '#a855f7' });
  const api = useMemo<HostApi>(() => ({ setColors: (a, b) => setC((p) => (p.a === a && p.b === b ? p : { a, b })) }), []);
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.backgroundColor;
    el.style.backgroundColor = '#05060f'; // لا وميض أبيض/أسود خلف التطبيق
    return () => { el.style.backgroundColor = prev; };
  }, []);
  return (
    <HostCtx.Provider value={api}>
      <Layer fixed accent={c.a} accent2={c.b} />
      <div className="relative z-[1] min-h-screen">{children}</div>
    </HostCtx.Provider>
  );
}

export default function CosmicBackground(props: LayerProps) {
  const host = useContext(HostCtx);
  const { accent, accent2 } = props;
  useEffect(() => { if (host && accent && accent2) host.setColors(accent, accent2); }, [host, accent, accent2]);
  if (host) return null; // الخلفية الدائمة موجودة بالفعل
  return <Layer {...props} />;
}
