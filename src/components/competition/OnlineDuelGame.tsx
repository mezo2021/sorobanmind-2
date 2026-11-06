// src/components/competition/OnlineDuelGame.tsx
// شاشة اللعب: عدّ تنازلي 3-2-1 متزامن، عدد الأسئلة والوقت يُقرأ من الإعدادات.
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Num } from '@/components/Num';
import { parseInput } from '@/utils/numberStyle';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import RelicKeypad from '@/components/games/MentalArchivesGame/ui/RelicKeypad';
import ProblemBoard from '@/components/games/MentalArchivesGame/competition/ProblemBoard';
import { LIVE_QUESTIONS, LIVE_Q_SECONDS, type RealtimeDuel } from '@/hooks/useRealtimeDuel';
import { useOnlineT } from './onlineStrings';

type Props = { duel: RealtimeDuel; myName: string };

export default function OnlineDuelGame({ duel, myName }: Props) {
  const { t, dir } = useOnlineT();
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [left, setLeft] = useState(LIVE_Q_SECONDS);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [locked, setLocked] = useState(false);
  const [answered, setAnswered] = useState(0);
  const qStartRef = useRef(0);
  const totalRef = useRef(0);
  const doneRef = useRef(false);
  const playing = duel.phase === 'playing';

  // بداية السؤال الأول عند انتهاء العدّ
  useEffect(() => { if (playing) qStartRef.current = performance.now(); }, [playing]);

  const submit = (auto: boolean) => {
    if (!playing || locked || doneRef.current) return;
    setLocked(true);
    const q = duel.questions[idx];
    const spentMs = Math.min(LIVE_Q_SECONDS * 1000, performance.now() - qStartRef.current);
    const ok = !auto && input !== '' && parseInput(input) === q.answer;
    const gain = ok ? 100 + Math.round(50 * (1 - spentMs / (LIVE_Q_SECONDS * 1000))) : 0;
    const newScore = score + gain;
    const newCorrect = correct + (ok ? 1 : 0);
    totalRef.current += spentMs / 1000;
    setScore(newScore); setCorrect(newCorrect); setAnswered(idx + 1);
    duel.sendAnswer({ questionIndex: idx, correct: ok, timeSpent: Math.round(spentMs), score: newScore });

    // ⏱️ تأخير ثانيتين (2000 مللي ثانية) قبل الانتقال للسؤال التالي
    window.setTimeout(() => {
      if (idx + 1 >= LIVE_QUESTIONS) {
        doneRef.current = true;
        duel.finishMine({ score: newScore, totalTime: +totalRef.current.toFixed(2), correct: newCorrect });
        return;
      }
      setIdx(idx + 1); setInput(''); setLeft(LIVE_Q_SECONDS); setLocked(false);
      qStartRef.current = performance.now();
    }, 2000); 
  };

  useEffect(() => {
    if (!playing || locked || doneRef.current) return;
    const timer = window.setInterval(() => {
      const rem = LIVE_Q_SECONDS - (performance.now() - qStartRef.current) / 1000;
      setLeft(Math.max(0, rem));
      if (rem <= 0) { window.clearInterval(timer); submit(true); }
    }, 100);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, locked, idx]);

  const bar = (label: string, answered: number, pts: number, color: string) => (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-0.5"><span className="font-bold truncate" style={{ color }}>{label}</span><span className="font-mono text-amber-200"><Num>{pts}</Num></span></div>
      <div className="h-2.5 rounded-full bg-slate-800 overflow-hidden" dir="ltr">
        <motion.div className="h-full rounded-full" style={{ background: color, transformOrigin: 'left' }} animate={{ scaleX: answered / LIVE_QUESTIONS }} transition={{ duration: reduce ? 0 : 0.4 }} />
      </div>
    </div>
  );

  const secs = Math.max(1, Math.ceil(duel.countdownMs / 1000));

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#38bdf8" accent2="#f472b6" />
      <div className="relative z-10 max-w-md mx-auto p-3 flex flex-col items-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="w-full rounded-2xl bg-white/5 border border-slate-700/60 p-2 backdrop-blur-md space-y-1.5">
          {bar(`${t('you')} · ${myName}`, answered, score, '#38bdf8')}
          {bar(`${t('opponent')} · ${duel.opponentName}`, duel.oppProgress.answered, duel.oppProgress.score, '#f472b6')}
        </div>

        {duel.graceLeft !== null && (
          <div className="w-full text-center text-xs bg-rose-500/15 border border-rose-500/40 text-rose-200 rounded-xl py-1.5">
            {t('oppLeft')} <Num>{duel.graceLeft}</Num>{t('sec')}
          </div>
        )}

        {duel.phase === 'countdown' && (
          <div className="flex-1 flex flex-col items-center justify-center py-16">
            <p className="text-slate-300 mb-4">{t('getReady')}</p>
            <AnimatePresence mode="wait">
              <motion.div key={secs} initial={{ scale: reduce ? 1 : 2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="text-8xl font-black text-amber-300 drop-shadow-[0_0_24px_rgba(251,191,36,0.7)]"><Num>{secs}</Num></motion.div>
            </AnimatePresence>
          </div>
        )}

        {playing && !doneRef.current && duel.questions[idx] && (
          <>
            <div className="w-full flex justify-between text-xs text-slate-400">
              <span>{t('question')} <Num>{idx + 1}/{LIVE_QUESTIONS}</Num></span>
              <span className={`font-mono ${left < 5 ? 'text-rose-300' : 'text-amber-200'}`}><Num>{left.toFixed(1)}</Num>{t('sec')}</span>
            </div>
            <ProblemBoard numbers={duel.questions[idx].numbers} value={input} />
            <RelicKeypad value={input} onChange={setInput} disabled={locked} reduceMotion={reduce} />
            <button onClick={() => submit(false)} disabled={!input || locked} className="w-full max-w-xs h-12 rounded-2xl font-extrabold bg-gradient-to-r from-amber-600 to-amber-400 text-slate-950 disabled:opacity-50">{t('confirm')}</button>
          </>
        )}

        {duel.phase === 'waitingOpponent' && (
          <div className="py-12 text-center">
            <div className="text-5xl mb-3 animate-pulse">⏳</div>
            <p className="font-bold text-amber-200">{t('waitFinish')}</p>
            <p className="text-sm text-slate-400 mt-2">{t('score')}: <Num>{score}</Num> · <Num>{correct}</Num>/<Num>{LIVE_QUESTIONS}</Num> {t('correctShort')}</p>
          </div>
        )}
      </div>
    </div>
  );
}