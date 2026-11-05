// src/components/games/MentalArchivesGame/competition/RelayMode.tsx
// تحالف الثقوب الدودية: 3 لاعبين، كلٌّ مسؤول عن خانة (آحاد / عشرات / مئات) من ناتج المسألة.
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGameLang } from '../../gamesI18n';
import { Num } from '@/components/Num';
import { maskName } from '@/utils/maskName';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import RelicKeypad from '../ui/RelicKeypad';
import ProblemBoard from './ProblemBoard';
import ResultModal from './ResultModal';
import { genQuestion, useVibrate } from './compMath';

const ROUNDS = 4;
const TURN_SEC = 12;
const COLORS = ['#38bdf8', '#f472b6', '#a78bfa'];
const PLACES = [{ ar: 'الآحاد', en: 'Ones', div: 1 }, { ar: 'العشرات', en: 'Tens', div: 10 }, { ar: 'المئات', en: 'Hundreds', div: 100 }];

export default function RelayMode({ names, onExit }: { names: [string, string, string]; onExit: () => void }) {
  const { dir, isAr } = useGameLang();
  const reduce = useReducedMotion();
  const vibrate = useVibrate();
  const [round, setRound] = useState(0);
  const [qs, setQs] = useState(() => Array.from({ length: ROUNDS }, () => genQuestion(3)));
  const [turn, setTurn] = useState(0);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(TURN_SEC);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [pts, setPts] = useState([0, 0, 0]);
  const [ok, setOk] = useState([0, 0, 0]);
  const [tot, setTot] = useState([0, 0, 0]);
  const [roundOk, setRoundOk] = useState<boolean[]>([]);
  const [roundPts, setRoundPts] = useState<number[]>([]);
  const [sync, setSync] = useState(0);
  const [bonusFlash, setBonusFlash] = useState(false);
  const leftRef = useRef(TURN_SEC);

  const r = Math.floor(turn / 3);
  const p = turn % 3;
  const q = qs[r];
  const expected = Math.floor(q.answer / PLACES[p].div) % 10;

  const submit = (auto: boolean) => {
    if (locked || done) return;
    setLocked(true);
    const good = !auto && input !== '' && parseInt(input, 10) === expected;
    const gain = good ? 100 + Math.round(40 * (leftRef.current / TURN_SEC)) : 0;
    const nPts = [...pts]; nPts[p] += gain;
    setOk((o) => o.map((v, i) => (i === p && good ? v + 1 : v)));
    setTot((t) => t.map((v, i) => (i === p ? v + 1 : v)));
    const nRoundOk = [...roundOk, good];
    const nRoundPts = [...roundPts, gain];
    vibrate(good ? 15 : [30, 40, 30]);
    let finalPts = nPts;
    let nSync = sync;

    if (p === 2) {
      // نهاية الجولة: مضاعف الالتواء الجماعي إذا أصاب الثلاثة
      const all = nRoundOk.slice(-3).every(Boolean);
      if (all) {
        const last3 = nRoundPts.slice(-3);
        finalPts = nPts.map((v, i) => v + Math.round(last3[i] * 0.5)); // ×1.5
        nSync = sync + 1;
        setSync(nSync);
        setBonusFlash(true);
        window.setTimeout(() => setBonusFlash(false), 1400);
        try { confetti({ particleCount: reduce ? 20 : 110, spread: 90, origin: { y: 0.5 }, colors: ['#FBBF24', '#38bdf8', '#f472b6', '#a78bfa'] }); } catch { /* noop */ }
      }
    } else if (good) {
      try { confetti({ particleCount: reduce ? 6 : 18, spread: 45, origin: { y: 0.8 }, colors: [COLORS[p]] }); } catch { /* noop */ }
    }
    setPts(finalPts); setRoundOk(nRoundOk); setRoundPts(nRoundPts);

    window.setTimeout(() => {
      if (turn + 1 >= ROUNDS * 3) { setDone(true); return; }
      setTurn((t) => t + 1);
      setInput('');
      leftRef.current = TURN_SEC; setLeft(TURN_SEC);
      setLocked(false);
    }, p === 2 ? 1300 : 650);
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
    setQs(Array.from({ length: ROUNDS }, () => genQuestion(3)));
    setTurn(0); setInput(''); setPts([0, 0, 0]); setOk([0, 0, 0]); setTot([0, 0, 0]); setRoundOk([]); setRoundPts([]); setSync(0);
    setDone(false); setLocked(false); leftRef.current = TURN_SEC; setLeft(TURN_SEC); setRound((x) => x + 1);
  };

  const total = Math.max(1, pts.reduce((a, b) => a + b, 0));

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#a78bfa" accent2="#38bdf8" />
      <div className="relative z-10 max-w-md mx-auto p-3 flex flex-col items-center gap-2 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="w-full flex justify-between items-center text-xs">
          <button onClick={onExit} className="text-amber-400">{isAr ? '← خروج' : '← Exit'}</button>
          <span className="text-slate-400">{isAr ? 'الجولة' : 'Round'} <Num>{r + 1}/{ROUNDS}</Num></span>
          <span className="font-mono text-amber-200"><Num>{left.toFixed(1)}</Num>s</span>
        </div>

        {/* مخطط المساهمة الحي */}
        <div className="w-full rounded-2xl bg-white/5 border border-slate-700/60 p-2 backdrop-blur-md space-y-1.5">
          {names.map((n, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="w-24 truncate font-bold" style={{ color: COLORS[i] }}>{p === i && !done ? '▶ ' : ''}{maskName(n)}</span>
              <div className="flex-1 h-2.5 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
                <motion.div className="h-full rounded-full" style={{ background: COLORS[i], transformOrigin: 'left' }} animate={{ scaleX: pts[i] / total }} transition={{ duration: reduce ? 0 : 0.5 }} />
              </div>
              <span className="w-9 text-end font-mono"><Num>{Math.round((pts[i] / total) * 100)}</Num>%</span>
            </div>
          ))}
        </div>

        <div className="text-sm text-center">
          <span style={{ color: COLORS[p] }} className="font-black">{maskName(names[p])}</span>
          {' — '}{isAr ? 'خانة' : 'Place'}: <b className="text-amber-300">{isAr ? PLACES[p].ar : PLACES[p].en}</b>
        </div>
        <ProblemBoard numbers={q.numbers} value={input} glow={COLORS[p]} />
        <RelicKeypad value={input} onChange={setInput} disabled={locked} maxLen={1} reduceMotion={reduce} />
        <button onClick={() => submit(false)} disabled={!input || locked} className="w-full max-w-xs h-12 rounded-2xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 disabled:opacity-50">{isAr ? 'تأكيد' : 'Confirm'}</button>

        <motion.div className="h-8 text-center font-black text-fuchsia-300" animate={{ opacity: bonusFlash ? 1 : 0, scale: bonusFlash && !reduce ? [0.8, 1.2, 1] : 1 }}>
          ⚡ {isAr ? 'مضاعف الالتواء ×1.5!' : 'Team Warp ×1.5!'}
        </motion.div>
      </div>
      {done && (
        <ResultModal key={round} mode="relay" onRematch={rematch} onExit={onExit} rounds={ROUNDS} syncRounds={sync} teamScore={pts.reduce((a, b) => a + b, 0)}
          players={names.map((n, i) => ({ name: n, points: pts[i], correct: ok[i], total: tot[i] }))} />
      )}
    </div>
  );
}
