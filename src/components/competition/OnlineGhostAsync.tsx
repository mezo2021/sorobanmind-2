// src/components/competition/OnlineGhostAsync.tsx
// شبح غير متزامن: سجّل جولتك → كود للمشاركة → صديقك يسابق شبحك لاحقاً (بلا Realtime).
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Copy, Share2, Sparkles } from 'lucide-react';
import { Num } from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import TiltCard from '@/components/cosmic/TiltCard';
import RelicKeypad from '@/components/games/MentalArchivesGame/ui/RelicKeypad';
import ProblemBoard from '@/components/games/MentalArchivesGame/competition/ProblemBoard';
import { genSet } from '@/components/games/MentalArchivesGame/competition/compMath';
import { useProgressStore } from '@/store/progressStore';
import { maskName } from '@/utils/maskName';
import { parseInput } from '@/utils/numberStyle';
import { addMatch } from '@/utils/duelHistory';
import { isPreviewMode } from '@/utils/previewMode';
import { GHOST_Q_SECONDS, decodeGhost, encodeGhost, ghostScore, ghostTotalSec, type GhostData } from '@/utils/ghostCode';
import { useOnlineT } from './onlineStrings';

const N = 10;
interface Run { data: GhostData; score: number; totalSec: number }

function Play({ questions, ghost, myName, onDone }: { questions: number[][]; ghost: GhostData | null; myName: string; onDone: (r: Run) => void }) {
  const { t, dir } = useOnlineT();
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(GHOST_Q_SECONDS);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const times = useRef<number[]>([]);
  const gains = useRef<number[]>([]);
  const qStart = useRef(performance.now());
  const t0 = useRef(performance.now());
  const done = useRef(false);

  const submit = (auto: boolean) => {
    if (locked || done.current) return;
    setLocked(true);
    const spent = Math.min(GHOST_Q_SECONDS * 1000, Math.round(performance.now() - qStart.current));
    const answer = questions[idx].reduce((a, b) => a + b, 0);
    const ok = !auto && input !== '' && parseInput(input) === answer;
    const gain = ok ? 100 + Math.round(50 * (1 - spent / (GHOST_Q_SECONDS * 1000))) : 0;
    times.current.push(spent); gains.current.push(gain);
    setScore((s) => s + gain);
    window.setTimeout(() => {
      if (idx + 1 >= questions.length) {
        done.current = true;
        const data: GhostData = { v: 1, n: myName, q: questions, t: times.current, g: gains.current };
        onDone({ data, score: ghostScore(data), totalSec: ghostTotalSec(data) });
        return;
      }
      setIdx(idx + 1); setInput(''); setLeft(GHOST_Q_SECONDS); setLocked(false);
      qStart.current = performance.now();
    }, 400);
  };

  useEffect(() => {
    if (locked || done.current) return;
    const timer = window.setInterval(() => {
      const rem = GHOST_Q_SECONDS - (performance.now() - qStart.current) / 1000;
      setLeft(Math.max(0, rem));
      setElapsed((performance.now() - t0.current) / 1000);
      if (rem <= 0) { window.clearInterval(timer); submit(true); }
    }, 100);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, idx]);

  let gAnswered = 0, gScore = 0, cum = 0;
  if (ghost) ghost.t.forEach((ms, i) => { cum += ms / 1000; if (cum <= elapsed) { gAnswered = i + 1; gScore += ghost.g[i]; } });

  const bar = (label: string, n: number, pts: number, color: string) => (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-0.5"><span className="font-bold truncate" style={{ color }}>{label}</span><span className="font-mono text-amber-200"><Num>{pts}</Num></span></div>
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
        <motion.div className="h-full rounded-full" style={{ background: color, transformOrigin: 'left' }} animate={{ scaleX: n / questions.length }} transition={{ duration: reduce ? 0 : 0.4 }} />
      </div>
    </div>
  );

  return (
    <div className="relative z-10 max-w-md mx-auto p-3 flex flex-col items-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]" dir={dir}>
      <div className="w-full rounded-2xl bg-white/5 border border-slate-700/60 p-2 backdrop-blur-md space-y-1.5">
        {bar(`${t('you')} · ${myName}`, locked ? idx + 1 : idx, score, '#38bdf8')}
        {ghost && bar(`👻 ${t('ghostOf')} ${ghost.n}`, gAnswered, gScore, '#a78bfa')}
      </div>
      <div className="w-full flex justify-between text-xs text-slate-400">
        <span>{t('question')} <Num>{idx + 1}/{questions.length}</Num></span>
        <span className={`font-mono ${left < 5 ? 'text-rose-300' : 'text-amber-200'}`}><Num>{left.toFixed(1)}</Num>{t('sec')}</span>
      </div>
      <ProblemBoard numbers={questions[idx]} value={input} glow="#a78bfa" />
      <RelicKeypad value={input} onChange={setInput} disabled={locked} reduceMotion={reduce} />
      <button onClick={() => submit(false)} disabled={!input || locked} className="w-full max-w-xs h-12 rounded-2xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950 disabled:opacity-50">{t('confirm')}</button>
    </div>
  );
}

export default function OnlineGhostAsync({ onBack }: { onBack: () => void }) {
  const { t, dir, isAr } = useOnlineT();
  const reduce = useReducedMotion();
  const childName = useProgressStore((s) => s.childName);
  const myName = maskName(childName || 'Player');
  // 🆕 XP من المتجر
  const addXP = useProgressStore((s) => s.addXP);
  const [earnedXP, setEarnedXP] = useState(0);

  const [view, setView] = useState<'menu' | 'enter' | 'play' | 'record' | 'race'>('menu');
  const [ghost, setGhost] = useState<GhostData | null>(null);
  const [qs, setQs] = useState<number[][]>([]);
  const [run, setRun] = useState<Run | null>(null);
  const [codeIn, setCodeIn] = useState('');
  const [bad, setBad] = useState(false);
  const [copied, setCopied] = useState(false);
  const savedRef = useRef(false);
  const preview = isPreviewMode();

  const startRecord = () => {
    setGhost(null); setQs(genSet(N, 2).map((q) => q.numbers));
    setRun(null); savedRef.current = false; setEarnedXP(0); setView('play');
  };
  const startRace = () => {
    const g = decodeGhost(codeIn);
    if (!g) { setBad(true); return; }
    setBad(false); setGhost(g); setQs(g.q);
    setRun(null); savedRef.current = false; setEarnedXP(0); setView('play');
  };
  const finish = (r: Run) => { setRun(r); setView(ghost ? 'race' : 'record'); };

  const outcome: 'win' | 'lose' | 'draw' | null = run && ghost
    ? (run.score !== ghostScore(ghost) ? (run.score > ghostScore(ghost) ? 'win' : 'lose') : run.totalSec !== ghostTotalSec(ghost) ? (run.totalSec < ghostTotalSec(ghost) ? 'win' : 'lose') : 'draw')
    : null;

  // 🆕 XP: 8 نقاط عند إكمال سباق ضد شبح (لا في المعاينة ولا عند التسجيل)
  useEffect(() => {
    if (view !== 'race' || !run || !ghost || !outcome || savedRef.current) return;
    savedRef.current = true;
    addMatch({ mode: 'ghost', myScore: run.score, opponentScore: ghostScore(ghost), result: outcome, durationSec: Math.round(run.totalSec) });

    if (!preview) {
      addXP(8);
      setEarnedXP(8);
    }

    if (outcome === 'win') { try { confetti({ particleCount: reduce ? 20 : 140, spread: 90, origin: { y: 0.55 } }); } catch { /* noop */ } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, run, ghost, outcome, reduce, preview]);

  const code = run && view === 'record' ? encodeGhost(run.data) : '';
  const shareMsg = `${t('ghostShareText')}${code}`;
  const copy = async () => { try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* noop */ } };

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#8b5cf6" accent2="#22d3ee" />
      {view === 'play' && <Play key={qs.length + (ghost?.n ?? '')} questions={qs} ghost={ghost} myName={myName} onDone={finish} />}
      {view !== 'play' && (
        <div className="relative z-10 max-w-md mx-auto p-4">
          <button onClick={view === 'menu' ? onBack : () => setView('menu')} className="mb-4 text-amber-400 font-bold flex items-center gap-2"><ArrowRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />{t('back')}</button>
          {preview && <div className="mb-3 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/40 rounded-xl py-1.5 text-center">{t('preview')}</div>}
          <h1 className="text-3xl font-black text-violet-300 mb-1">{t('ghostAsync')}</h1>
          <p className="text-slate-400 text-sm mb-4">{t('ghostAsyncSub')}</p>

          {view === 'menu' && (
            <div className="space-y-3">
              <TiltCard glow="#8b5cf6" pulse onClick={startRecord} className="p-4"><div className="flex items-center gap-3"><span className="text-3xl">🎬</span><h3 className="font-black text-lg text-violet-300">{t('recordGhost')}</h3></div></TiltCard>
              <TiltCard glow="#22d3ee" pulse onClick={() => setView('enter')} className="p-4"><div className="flex items-center gap-3"><span className="text-3xl">👻</span><h3 className="font-black text-lg text-cyan-300">{t('enterGhost')}</h3></div></TiltCard>
              <p className="text-[11px] text-slate-500">{t('trainingNote')}</p>
            </div>
          )}

          {view === 'enter' && (
            <div className="rounded-3xl bg-white/5 border border-cyan-500/40 p-4 backdrop-blur-md">
              <p className="text-sm text-slate-300 mb-2">{t('pasteCode')}</p>
              <textarea value={codeIn} onChange={(e) => { setCodeIn(e.target.value); setBad(false); }} rows={3} dir="ltr" className="w-full bg-slate-950/80 border border-cyan-500/40 rounded-2xl p-3 text-xs font-mono text-cyan-100" aria-label={t('ghostCode')} />
              {bad && <p className="text-rose-300 text-sm mt-1">{t('invalidCode')}</p>}
              <button disabled={!codeIn.trim()} onClick={startRace} className="mt-3 w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-violet-500 text-slate-950 disabled:opacity-50">{t('startRace')}</button>
            </div>
          )}

          {view === 'record' && run && (
            <div className="rounded-3xl bg-white/5 border border-violet-500/40 p-4 backdrop-blur-md text-center">
              <h2 className="text-2xl font-black text-amber-300">{t('recorded')}</h2>
              <p className="text-sm text-slate-300 my-2">{t('score')}: <b className="font-mono text-amber-200"><Num>{run.score}</Num></b> · {t('time')}: <b className="font-mono"><Num>{run.totalSec.toFixed(1)}</Num></b>{t('sec')}</p>
              <p className="text-xs text-slate-400 mb-1">{t('shareGhost')}</p>
              <div dir="ltr" className="text-[10px] font-mono break-all bg-slate-950/80 border border-slate-700 rounded-xl p-2 max-h-24 overflow-auto select-all">{code}</div>
              <div className="flex gap-2 justify-center mt-3">
                <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm font-bold"><Copy className="w-4 h-4" />{copied ? t('copied') : t('copy')}</button>
                <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, '_blank', 'noopener')} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-sm font-bold"><Share2 className="w-4 h-4" />{t('whatsapp')}</button>
              </div>
            </div>
          )}

          {view === 'race' && run && ghost && outcome && (
            <div className="rounded-3xl bg-white/5 border border-amber-500/40 p-4 backdrop-blur-md text-center">
              <h2 className="text-2xl font-black text-amber-300 mb-2">{outcome === 'win' ? t('win') : outcome === 'lose' ? t('lose') : t('draw')}</h2>

              {/* 🆕 شارة XP (ثنائية اللغة) */}
              {!preview && earnedXP > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/40 rounded-full py-1.5 px-4 mb-3 text-sm font-black text-purple-300">
                  <Sparkles className="w-4 h-4" />+<Num>{earnedXP}</Num>{' '}
                  {isAr ? 'نقطة' : 'XP'}
                </div>
              )}

              <div className="flex gap-2">
                <div className="flex-1 rounded-2xl border border-sky-400/60 p-3"><div className="font-black truncate">{myName}</div><div className="text-3xl font-mono font-black text-amber-200"><Num>{run.score}</Num></div><div className="text-[11px] text-slate-400"><Num>{run.totalSec.toFixed(1)}</Num>{t('sec')}</div></div>
                <div className="flex-1 rounded-2xl border border-violet-400/60 p-3"><div className="font-black truncate">👻 {ghost.n}</div><div className="text-3xl font-mono font-black text-violet-200"><Num>{ghostScore(ghost)}</Num></div><div className="text-[11px] text-slate-400"><Num>{ghostTotalSec(ghost).toFixed(1)}</Num>{t('sec')}</div></div>
              </div>
              {outcome === 'lose' && <p className="text-sm text-slate-300 mt-3">{t('loseMsg')}</p>}
              <p className="text-[11px] text-slate-500 mt-3">{t('trainingNote')}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setRun(null); savedRef.current = false; setEarnedXP(0); setQs(ghost.q); setView('play'); }} className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">{t('raceAgain')}</button>
                <button onClick={() => setView('menu')} className="flex-1 py-3 rounded-2xl font-bold bg-slate-800 border border-slate-600">{t('exit')}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}