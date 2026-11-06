// src/components/competition/OnlineDuelResult.tsx
// شاشة نتيجة التحدي الأونلاين + حفظ المباراة في sorobanmind-duels-v1 (إلا في المعاينة).
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Home } from 'lucide-react';
import { Num } from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import { addMatch } from '@/utils/duelHistory';
import { isPreviewMode } from '@/utils/previewMode';
import type { DuelMode, DuelResult } from '@/hooks/useRealtimeDuel';
import { useOnlineT } from './onlineStrings';

type Props = { mode?: DuelMode; result: DuelResult; myName: string; oppName: string; durationSec: number; onAgain: () => void; onExit: () => void };

export default function OnlineDuelResult({ mode = 'live', result, myName, oppName, durationSec, onAgain, onExit }: Props) {
  const { t, dir } = useOnlineT();
  const reduce = useReducedMotion();
  const savedRef = useRef(false);
  const preview = isPreviewMode();

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addMatch({ mode, myScore: result.myScore, opponentScore: result.oppScore, result: result.outcome, durationSec: Math.round(durationSec) });
    if (result.outcome === 'win') {
      try { confetti({ particleCount: reduce ? 20 : 150, spread: 90, origin: { y: 0.55 }, colors: ['#FBBF24', '#38bdf8', '#f472b6'] }); } catch { /* noop */ }
    }
  }, [result, durationSec, reduce, mode]);

  const title = result.outcome === 'win' ? t('win') : result.outcome === 'lose' ? t('lose') : t('draw');
  const side = (name: string, score: number, time: number, win: boolean) => (
    <div className={`flex-1 rounded-2xl p-3 border ${win ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 bg-white/5'}`}>
      <div className="text-2xl">{win ? '👑' : '🌟'}</div>
      <div className="font-black truncate">{name}</div>
      <div className="text-3xl font-mono font-black text-amber-200"><Num>{score}</Num></div>
      <div className="text-[11px] text-slate-400">{t('time')}: <Num>{time.toFixed(1)}</Num>{t('sec')}</div>
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center p-4 text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#22c55e" accent2="#38bdf8" />
      <motion.div initial={{ scale: 0.85, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/80 p-5 text-center shadow-[0_0_40px_rgba(56,189,248,0.3)]">
        {preview && <div className="mb-3 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/40 rounded-xl py-1.5">{t('preview')}</div>}
        <h2 className="text-3xl font-black text-amber-300 mb-1">{title}</h2>
        {result.forfeit && <p className="text-sm text-emerald-300 mb-2">{t('forfeit')}</p>}
        {result.outcome === 'lose' && <p className="text-sm text-slate-300 mb-2">{t('loseMsg')}</p>}
        <div className="flex gap-2 my-4">
          {side(myName, result.myScore, result.myTime, result.outcome === 'win')}
          {side(oppName || t('opponent'), result.oppScore, result.oppTime, result.outcome === 'lose')}
        </div>
        <div className="flex gap-2">
          <button onClick={onAgain} className="flex-1 py-3 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4" />{t('playAgain')}</button>
          <button onClick={onExit} className="flex-1 py-3 rounded-2xl font-bold bg-slate-800 border border-slate-600 flex items-center justify-center gap-2"><Home className="w-4 h-4" />{t('exit')}</button>
        </div>
      </motion.div>
    </div>
  );
}
