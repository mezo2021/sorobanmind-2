// src/components/competition/OnlineDuelResult.tsx
// شاشة نتيجة التحدي الأونلاين + حفظ المباراة + منح XP (إلا في المعاينة).
import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Sparkles } from 'lucide-react';
import { Num } from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import { addMatch } from '@/utils/duelHistory';
import { isPreviewMode } from '@/utils/previewMode';
import { useProgressStore } from '@/store/progressStore';
import type { DuelMode, DuelResult, RematchStatus } from '@/hooks/useRealtimeDuel';
import { useOnlineT } from './onlineStrings';

type Props = {
  mode?: DuelMode;
  result: DuelResult;
  myName: string;
  oppName: string;
  durationSec: number;
  rematchStatus: RematchStatus;
  oppWantsRematch: boolean;
  opponentPresent: boolean;
  onRematch: () => void;
  onExit: () => void;
};

// 🆕 حساب XP حسب النمط والنتيجة (الحد الأقصى 20)
function calcXP(mode: DuelMode, outcome: 'win' | 'lose' | 'draw'): number {
  if (mode === 'live') {
    if (outcome === 'win') return 20;
    if (outcome === 'draw') return 10;
    return 5;
  }
  // blitz
  if (outcome === 'win') return 12;
  if (outcome === 'draw') return 6;
  return 3;
}

export default function OnlineDuelResult({
  mode = 'live',
  result,
  myName,
  oppName,
  durationSec,
  rematchStatus,
  oppWantsRematch,
  opponentPresent,
  onRematch,
  onExit,
}: Props) {
  const { t, dir, isAr } = useOnlineT(); // 🆕 إضافة isAr
  const reduce = useReducedMotion();
  const savedRef = useRef(false);
  const preview = isPreviewMode();
  const addXP = useProgressStore((s) => s.addXP);

  const xpEarned = calcXP(mode, result.outcome);

  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    addMatch({
      mode,
      myScore: result.myScore,
      opponentScore: result.oppScore,
      result: result.outcome,
      durationSec: Math.round(durationSec),
    });

    // 🆕 منح XP (لا في المعاينة)
    if (!preview) {
      addXP(xpEarned);
    }

    if (result.outcome === 'win') {
      try {
        confetti({
          particleCount: reduce ? 20 : 150,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#FBBF24', '#38bdf8', '#f472b6'],
        });
      } catch {
        /* noop */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, durationSec, reduce, mode]);

  const unavailable = !opponentPresent;
  const rematchLabel = unavailable
    ? t('rematchUnavailable')
    : rematchStatus === 'accepted'
    ? t('rematchStarting')
    : rematchStatus === 'requested'
    ? t('rematchWaiting')
    : oppWantsRematch
    ? t('rematchAccept')
    : t('playAgain');
  const rematchDisabled = unavailable || rematchStatus !== 'idle';

  const title =
    result.outcome === 'win'
      ? t('win')
      : result.outcome === 'lose'
      ? t('lose')
      : t('draw');

  const side = (name: string, score: number, time: number, win: boolean) => (
    <div
      className={`flex-1 rounded-2xl p-3 border ${
        win ? 'border-amber-400 bg-amber-400/10' : 'border-slate-700 bg-white/5'
      }`}
    >
      <div className="text-2xl">{win ? '👑' : '🌟'}</div>
      <div className="font-black truncate">{name}</div>
      <div className="text-3xl font-mono font-black text-amber-200">
        <Num>{score}</Num>
      </div>
      <div className="text-[11px] text-slate-400">
        {t('time')}: <Num>{time.toFixed(1)}</Num>
        {t('sec')}
      </div>
    </div>
  );

  return (
    <div
      className="relative min-h-[100dvh] flex items-center justify-center p-4 text-white overflow-hidden"
      dir={dir}
    >
      <CosmicBackground accent="#22c55e" accent2="#38bdf8" />
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-amber-500/40 bg-slate-900/80 p-5 text-center shadow-[0_0_40px_rgba(56,189,248,0.3)]"
      >
        {preview && (
          <div className="mb-3 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/40 rounded-xl py-1.5">
            {t('preview')}
          </div>
        )}
        <h2 className="text-3xl font-black text-amber-300 mb-1">{title}</h2>
        {result.forfeit && (
          <p className="text-sm text-emerald-300 mb-2">{t('forfeit')}</p>
        )}
        {result.outcome === 'lose' && (
          <p className="text-sm text-slate-300 mb-2">{t('loseMsg')}</p>
        )}

        {/* 🆕 شارة XP المكتسبة (ثنائية اللغة) */}
        {!preview && (
          <div className="inline-flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/40 rounded-full py-1.5 px-4 mb-3 text-sm font-black text-purple-300">
            <Sparkles className="w-4 h-4" />+<Num>{xpEarned}</Num>{' '}
            {t('xpLabel')}
          </div>
        )}

        <div className="flex gap-2 my-4">
          {side(myName, result.myScore, result.myTime, result.outcome === 'win')}
          {side(
            oppName || t('opponent'),
            result.oppScore,
            result.oppTime,
            result.outcome === 'lose'
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRematch}
            disabled={rematchDisabled}
            className={`flex-1 py-3 rounded-2xl font-bold text-slate-950 flex items-center justify-center gap-2 text-sm disabled:opacity-60 ${
              oppWantsRematch && !rematchDisabled
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            <span>{rematchLabel}</span>
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3 rounded-2xl font-bold bg-slate-800 border border-slate-600 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('exit')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}