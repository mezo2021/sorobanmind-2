// src/components/games/MentalArchivesGame/competition/GhostMode.tsx
// تحدي مرآة الزمن: سباق ضد شبح (رقمك الشخصي / أفضل زمن في لوحة الأبطال / شبح ذكاء اصطناعي).
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useGameLang } from '../../gamesI18n';
import { Num } from '@/components/Num';
import { parseInput } from '@/utils/numberStyle';
import { fastest, getRecords } from '@/utils/leaderboard';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import RelicKeypad from '../ui/RelicKeypad';
import ProblemBoard from './ProblemBoard';
import ResultModal from './ResultModal';
import { genSet, useVibrate } from './compMath';

const N = 8;
const PENALTY = 3;
const AI_PACE = 7;
const PB_KEY = 'sorobanmind-ghost-v1';

export type GhostSource = 'pb' | 'top';

function loadPB(): number[] | null {
  try {
    const raw = JSON.parse(localStorage.getItem(PB_KEY) || 'null');
    return Array.isArray(raw?.splits) && raw.splits.length === N ? raw.splits : null;
  } catch { return null; }
}

function buildGhost(source: GhostSource, isAr: boolean): { splits: number[]; label: string } {
  if (source === 'pb') {
    const pb = loadPB();
    if (pb) return { splits: pb, label: isAr ? '👻 شبح رقمك الشخصي' : '👻 Your personal-best ghost' };
  } else {
    const top = fastest(getRecords(), 1)[0];
    if (top) {
      const per = Math.max(2, top.timeSec / (top.examId === 'exam_10_7' ? 50 : 80));
      return { splits: Array(N).fill(per), label: isAr ? '👻 شبح أسرع بطل في اللوحة' : '👻 Top champion ghost' };
    }
  }
  return { splits: Array(N).fill(AI_PACE), label: isAr ? '👻 شبح الذكاء الاصطناعي' : '👻 AI ghost' };
}

export default function GhostMode({ source, level, onExit }: { source: GhostSource; level: 1 | 2 | 3; onExit: () => void }) {
  const { dir, isAr } = useGameLang();
  const reduce = useReducedMotion();
  const vibrate = useVibrate();
  const [round, setRound] = useState(0);
  const [qs, setQs] = useState(() => genSet(N, level));
  const [ghost, setGhost] = useState(() => buildGhost(source, isAr));
  const ghostCum = ghost.splits.reduce<number[]>((a, s) => [...a, (a[a.length - 1] ?? 0) + s], []);
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [splits, setSplits] = useState<number[]>([]);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState(false);
  const [isPB, setIsPB] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const startRef = useRef(performance.now());
  const qStartRef = useRef(0);
  const penaltyRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(280);

  useEffect(() => { if (trackRef.current) setTrackW(trackRef.current.clientWidth); }, []);
  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => setNow((performance.now() - startRef.current) / 1000 + penaltyRef.current), 100);
    return () => window.clearInterval(t);
  }, [done, round]);

  const elapsed = now;
  // موجب = أمامه: نقارن زمن إنهائك لعدد الأسئلة المكتملة بزمن الشبح، ويتناقص حياً إذا تأخرت عن وتيرة الشبح
  const base = idx === 0 ? 0 : (ghostCum[idx - 1] ?? 0) - qStartRef.current;
  const diff = Math.min(base, (ghostCum[Math.min(idx, N - 1)] ?? 0) - elapsed);
  const completedGhost = ghostCum.filter((c) => c <= elapsed).length;
  const prevCum = completedGhost === 0 ? 0 : ghostCum[completedGhost - 1];
  const frac = completedGhost >= N ? 0 : Math.min(1, (elapsed - prevCum) / ghost.splits[completedGhost]);
  const ghostProg = Math.min(1, (completedGhost + frac) / N);
  const playerProg = idx / N;
  const maxX = Math.max(0, trackW - 28);

  const submit = () => {
    if (done || !input) return;
    const t = (performance.now() - startRef.current) / 1000 + penaltyRef.current;
    const good = parseInput(input) === qs[idx].answer;
    if (!good) { penaltyRef.current += PENALTY; setWrongFlash(true); vibrate([30, 40, 30]); window.setTimeout(() => setWrongFlash(false), 500); }
    else vibrate(12);
    const total = t + (good ? 0 : PENALTY);
    const split = total - qStartRef.current;
    qStartRef.current = total;
    const ns = [...splits, split];
    setSplits(ns);
    setInput('');
    if (idx + 1 >= N) {
      const pb = loadPB();
      const pbTotal = pb ? pb.reduce((a, b) => a + b, 0) : Infinity;
      const better = total < pbTotal;
      if (better) { try { localStorage.setItem(PB_KEY, JSON.stringify({ splits: ns, total })); } catch { /* noop */ } }
      setIsPB(better);
      setDone(true);
    } else setIdx(idx + 1);
  };

  const rematch = () => {
    setQs(genSet(N, level)); setGhost(buildGhost(source, isAr)); setIdx(0); setInput(''); setSplits([]); setDone(false); setIsPB(false);
    penaltyRef.current = 0; qStartRef.current = 0; startRef.current = performance.now(); setNow(0); setRound((r) => r + 1);
  };

  const ahead = diff >= 0;
  const diffTxt = `${ahead ? '+' : '-'}${Math.abs(diff).toFixed(1)}s`;

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#8b5cf6" accent2="#22d3ee" />
      <div className="relative z-10 max-w-md mx-auto p-3 flex flex-col items-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="w-full flex justify-between text-xs">
          <button onClick={onExit} className="text-amber-400">{isAr ? '← خروج' : '← Exit'}</button>
          <span className="text-violet-300">{ghost.label}</span>
        </div>

        {/* مسار السباق: الشبح (شفاف) + أنت */}
        <div ref={trackRef} className="relative w-full h-14 rounded-2xl bg-white/5 border border-slate-700/60 backdrop-blur-md overflow-hidden" dir="ltr">
          <div className="absolute inset-x-3 top-1/2 h-px bg-slate-600" />
          <motion.div className="absolute left-1 top-1 text-2xl opacity-45" style={{ filter: 'drop-shadow(0 0 10px #a78bfa)' }} animate={{ x: ghostProg * maxX }} transition={{ duration: 0.15, ease: 'linear' }}>👻</motion.div>
          <motion.div className="absolute left-1 bottom-1 text-2xl" animate={{ x: playerProg * maxX }} transition={{ duration: reduce ? 0 : 0.4 }}>🚀</motion.div>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-mono text-2xl font-black text-amber-200"><Num>{elapsed.toFixed(1)}</Num>s</span>
          <motion.span key={ahead ? 'a' : 'b'} initial={{ scale: reduce ? 1 : 1.3 }} animate={{ scale: 1 }} className={`font-mono text-xl font-black ${ahead ? 'text-emerald-300' : 'text-rose-300'}`}>
            <Num>{diffTxt}</Num> <span className="text-xs font-sans">{ahead ? (isAr ? 'متقدم' : 'ahead') : (isAr ? 'متأخر' : 'behind')}</span>
          </motion.span>
        </div>
        <div className="text-xs text-slate-400">{isAr ? 'السؤال' : 'Q'} <Num>{Math.min(idx + 1, N)}/{N}</Num> · {isAr ? `الخطأ = +${PENALTY}ث` : `Wrong = +${PENALTY}s`}</div>

        <motion.div className="w-full" animate={wrongFlash && !reduce ? { x: [0, -4, 4, -3, 3, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
          <ProblemBoard numbers={qs[Math.min(idx, N - 1)].numbers} value={input} glow={wrongFlash ? '#ef4444' : '#a78bfa'} />
        </motion.div>
        <RelicKeypad value={input} onChange={setInput} disabled={done} reduceMotion={reduce} />
        <button onClick={submit} disabled={!input || done} className="w-full max-w-xs h-12 rounded-2xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950 disabled:opacity-50">{isAr ? 'تأكيد' : 'Confirm'}</button>
      </div>
      {done && (
        <ResultModal key={round} mode="ghost" onRematch={rematch} onExit={onExit}
          data={{ playerTimeSec: splits.reduce((a, b) => a + b, 0), ghostTimeSec: ghostCum[N - 1], deltas: splits.map((s, i) => s - ghost.splits[i]), isPB, ghostLabel: ghost.label }} />
      )}
    </div>
  );
}
