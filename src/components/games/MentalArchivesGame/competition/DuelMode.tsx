// src/components/games/MentalArchivesGame/competition/DuelMode.tsx
// تحدي انقسام الزمكان (1v1) — أدوار متناوبة على نفس الجهاز.
// لماذا متناوب؟ جهاز واحد ولوحة واحدة: التناوب بنفس مجموعة الأسئلة يضمن العدالة دون ازدحام شاشة الجوال،
// وتبقى المنافسة حية عبر أشرطة الزخم والمؤقت لكل دور.
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameLang } from '../../gamesI18n';
import { Num } from '@/components/Num';
import { parseInput } from '@/utils/numberStyle';
import { maskName } from '@/utils/maskName';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import RelicKeypad from '../ui/RelicKeypad';
import ProblemBoard from './ProblemBoard';
import ResultModal from './ResultModal';
import { genSet, useVibrate } from './compMath';

const QN = 5;
const TURN_SEC = 10;
const COLORS = ['#38bdf8', '#f472b6'];

interface S { score: number; correct: number; total: number; time: number; streak: number; best: number; momentum: number }
const blank = (): S => ({ score: 0, correct: 0, total: 0, time: 0, streak: 0, best: 0, momentum: 50 });

export default function DuelMode({ names, level, onExit }: { names: [string, string]; level: 1 | 2 | 3; onExit: () => void }) {
  const { dir, isAr } = useGameLang();
  const reduce = useReducedMotion();
  const vibrate = useVibrate();
  const [round, setRound] = useState(0);
  const [qs, setQs] = useState(() => genSet(QN, level));
  const [turn, setTurn] = useState(0);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(TURN_SEC);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [stats, setStats] = useState<S[]>([blank(), blank()]);
  const [flash, setFlash] = useState<{ p: number; ok: boolean } | null>(null);
  const leftRef = useRef(TURN_SEC);
  const cur = turn % 2;
  const q = qs[Math.floor(turn / 2)];

  const submit = (auto: boolean) => {
    if (locked || done) return;
    setLocked(true);
    const ok = !auto && parseInput(input) === q.answer;
    const spent = TURN_SEC - leftRef.current;
    setStats((prev) => prev.map((s, i) => {
      if (i !== cur) return s;
      const streak = ok ? s.streak + 1 : 0;
      return {
        score: s.score + (ok ? 100 + Math.round(50 * (leftRef.current / TURN_SEC)) : 0),
        correct: s.correct + (ok ? 1 : 0),
        total: s.total + 1,
        time: s.time + spent,
        streak,
        best: Math.max(s.best, streak),
        momentum: Math.max(0, Math.min(100, s.momentum + (ok ? 12 + Math.round(18 * (leftRef.current / TURN_SEC)) : -18))),
      };
    }));
    setFlash({ p: cur, ok });
    vibrate(ok ? 15 : [30, 40, 30]);
    if (ok) { try { confetti({ particleCount: reduce ? 8 : 26, spread: 55, origin: { x: 0.5, y: cur === 0 ? 0.2 : 0.85 }, colors: ['#FBBF24', COLORS[cur]] }); } catch { /* noop */ } }
    window.setTimeout(() => {
      setFlash(null);
      if (turn + 1 >= QN * 2) { setDone(true); return; }
      setTurn((t) => t + 1);
      setInput('');
      leftRef.current = TURN_SEC; setLeft(TURN_SEC);
      setLocked(false);
    }, 750);
  };

  useEffect(() => {
    if (locked || done) return;
    const t = window.setTimeout(() => {
      leftRef.current = Math.max(0, +(leftRef.current - 0.1).toFixed(1));
      setLeft(leftRef.current);
      if (leftRef.current <= 0) submit(true);
    }, 100);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, locked, done, turn]);

  const rematch = () => {
    setQs(genSet(QN, level)); setTurn(0); setInput(''); setStats([blank(), blank()]); setDone(false); setLocked(false);
    leftRef.current = TURN_SEC; setLeft(TURN_SEC); setRound((r) => r + 1);
  };

  const panel = (i: number) => {
    const s = stats[i];
    const active = cur === i && !done;
    return (
      <motion.div key={`p${i}`} animate={{ opacity: active ? 1 : 0.55 }} className="flex-1 rounded-2xl border-2 p-3 backdrop-blur-md bg-white/5"
        style={{ borderColor: active ? COLORS[i] : 'rgba(71,85,105,.6)', boxShadow: active ? `0 0 22px ${COLORS[i]}66` : 'none' }}>
        <div className="flex items-center justify-between">
          <span className="font-black truncate" style={{ color: COLORS[i] }}>{maskName(names[i])}</span>
          <span className="font-mono font-black text-amber-200 text-xl"><Num>{s.score}</Num></span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
          <span>🔥 <Num>{s.streak}</Num></span>
          <span className="font-mono">{active ? <><Num>{left.toFixed(1)}</Num>s</> : '—'}</span>
        </div>
        <div className="mt-1.5 h-2.5 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
          <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS[i]}, #fbbf24)`, transformOrigin: 'left' }} animate={{ scaleX: s.momentum / 100 }} transition={{ duration: reduce ? 0 : 0.5 }} />
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">{isAr ? 'شريط الزخم' : 'Momentum'}</div>
        {flash?.p === i && <div className={`text-center text-sm font-black mt-1 ${flash.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{flash.ok ? (isAr ? '✨ صحيح!' : '✨ Correct!') : (isAr ? 'حاول لاحقاً 💫' : 'Next time 💫')}</div>}
      </motion.div>
    );
  };

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#38bdf8" accent2="#f472b6" />
      <div className="relative z-10 max-w-4xl mx-auto p-3 flex flex-col md:flex-row gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        {panel(0)}
        <div className="md:w-72 flex flex-col items-center gap-2">
          <button onClick={onExit} className="self-start text-xs text-amber-400">{isAr ? '← خروج' : '← Exit'}</button>
          <div className="text-xs text-slate-400">{isAr ? 'السؤال' : 'Q'} <Num>{Math.floor(turn / 2) + 1}/{QN}</Num> · {isAr ? 'الدور' : 'Turn'}: <b style={{ color: COLORS[cur] }}>{maskName(names[cur])}</b></div>
          <ProblemBoard numbers={q.numbers} value={input} glow={COLORS[cur]} />
          <RelicKeypad value={input} onChange={setInput} disabled={locked} reduceMotion={reduce} />
          <button onClick={() => submit(false)} disabled={!input || locked} className="w-full max-w-xs h-12 rounded-2xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 disabled:opacity-50">{isAr ? 'تأكيد' : 'Confirm'}</button>
        </div>
        {panel(1)}
      </div>
      {done && (
        <ResultModal key={round} mode="duel" onRematch={rematch} onExit={onExit}
          a={{ name: names[0], score: stats[0].score, accuracy: stats[0].correct / Math.max(1, stats[0].total), timeSec: stats[0].time, streak: stats[0].best }}
          b={{ name: names[1], score: stats[1].score, accuracy: stats[1].correct / Math.max(1, stats[1].total), timeSec: stats[1].time, streak: stats[1].best }} />
      )}
    </div>
  );
}
