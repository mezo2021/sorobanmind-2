// src/components/competition/OnlineDuelLobby.tsx
// مدخل التحدي الأونلاين: إنشاء/انضمام → غرفة الانتظار → اللعب → النتيجة.
import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Copy, Share2 } from 'lucide-react';
import { Num } from '@/components/Num';
import CosmicBackground from '@/components/cosmic/CosmicBackground';
import TiltCard from '@/components/cosmic/TiltCard';
import { useProgressStore } from '@/store/progressStore';
import { maskName } from '@/utils/maskName';
import { generateRoomCode, isValidRoomCode, normalizeRoomCode } from '@/utils/roomCode';
import { getStats } from '@/utils/duelHistory';
import { isPreviewMode } from '@/utils/previewMode';
import { useRealtimeDuel, type DuelMode } from '@/hooks/useRealtimeDuel';
import OnlineGhostAsync from './OnlineGhostAsync';
import OnlineDuelGame from './OnlineDuelGame';
import OnlineDuelResult from './OnlineDuelResult';
import { useOnlineT } from './onlineStrings';

type Session = { role: 'host' | 'guest'; code: string; mode: DuelMode };

function Room({ session, myName, onLeave, onAgain }: { session: Session; myName: string; onLeave: () => void; onAgain: () => void }) {
  const { t, dir } = useOnlineT();
  const duel = useRealtimeDuel({ role: session.role, code: session.code, myName, mode: session.mode });
  const [copied, setCopied] = useState(false);
  const startRef = useRef(Date.now());

  const shareMsg = `${t('shareText')}${session.code}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(session.code); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };
  const whatsapp = () => window.open(`https://wa.me/?text=${encodeURIComponent(shareMsg)}`, '_blank', 'noopener');

  if (duel.phase === 'error') {
    const msg = duel.error === 'roomNotFound' ? t('errNotFound') : duel.error === 'roomFull' ? t('errFull') : duel.error === 'roomTaken' ? t('errTaken') : t('errConn');
    return (
      <div className="relative min-h-[100dvh] flex items-center justify-center p-4 text-white" dir={dir}>
        <CosmicBackground />
        <div className="relative z-10 text-center bg-slate-900/80 border border-rose-500/40 rounded-3xl p-6 max-w-sm">
          <div className="text-4xl mb-2">⚠️</div>
          <p className="mb-4">{msg}</p>
          <button onClick={onLeave} className="px-6 py-3 rounded-2xl bg-slate-800 border border-slate-600 font-bold">{t('back')}</button>
        </div>
      </div>
    );
  }

  if (duel.phase === 'finished' && duel.result) {
    return <OnlineDuelResult mode={duel.config.mode} result={duel.result} myName={myName} oppName={duel.opponentName} durationSec={(Date.now() - startRef.current) / 1000} onAgain={onAgain} onExit={onLeave} />;
  }

  if (duel.phase === 'countdown' || duel.phase === 'playing' || duel.phase === 'waitingOpponent') {
    return <OnlineDuelGame duel={duel} myName={myName} />;
  }

  // غرفة الانتظار
  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#22c55e" accent2="#38bdf8" />
      <div className="relative z-10 max-w-md mx-auto p-4">
        <button onClick={onLeave} className="mb-4 text-amber-400 font-bold flex items-center gap-2"><ArrowRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />{t('back')}</button>
        <div className="text-center bg-white/5 border border-amber-500/40 rounded-3xl p-5 backdrop-blur-md shadow-[0_0_30px_rgba(251,191,36,0.2)]">
          <p className="text-xs text-slate-400">{t('roomCode')}</p>
          <div className="text-6xl font-black font-mono text-amber-300 my-2 tracking-widest" dir="ltr"><Num>{session.code}</Num></div>
          <div className="flex gap-2 justify-center">
            <button onClick={copy} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-600 text-sm font-bold"><Copy className="w-4 h-4" />{copied ? t('copied') : t('copy')}</button>
            <button onClick={whatsapp} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-sm font-bold"><Share2 className="w-4 h-4" />{t('whatsapp')}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[{ n: myName, rdy: duel.myReady, me: true }, { n: duel.opponentName, rdy: duel.oppReady, me: false }].map((p, i) => (
            <div key={i} className={`rounded-2xl border p-3 text-center ${p.rdy ? 'border-emerald-400 bg-emerald-400/10' : 'border-slate-700 bg-white/5'}`}>
              <div className="text-xs text-slate-400">{p.me ? t('you') : t('opponent')}</div>
              <div className="font-black truncate min-h-[1.5rem]">{p.n || (p.me ? '' : '…')}</div>
              <div className="text-xs mt-1">{p.rdy ? '✅' : '⏳'}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          {duel.phase === 'connecting' ? (
            <p className="text-slate-300 animate-pulse">{t('connecting')}</p>
          ) : !duel.opponentPresent ? (
            <p className="text-slate-300 animate-pulse">{t('waitingOpp')}</p>
          ) : !duel.myReady ? (
            <motion.button whileTap={{ scale: 0.96 }} onClick={duel.setReady} className="w-full h-14 rounded-2xl font-black text-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.5)]">{t('ready')}</motion.button>
          ) : (
            <p className="text-amber-200">{duel.oppReady ? t('oppReady') : t('waitingReady')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnlineDuelLobby({ onBack }: { onBack: () => void }) {
  const { t, dir } = useOnlineT();
  const childName = useProgressStore((s) => s.childName);
  const myName = useMemo(() => maskName(childName || 'Player'), [childName]);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<'menu' | 'join' | 'ghost'>('menu');
  const [code, setCode] = useState('');
  const [round, setRound] = useState(0);
  const stats = getStats();
  const preview = isPreviewMode();

  if (mode === 'ghost') return <OnlineGhostAsync onBack={() => setMode('menu')} />;

  if (session) {
    return (
      <Room key={`${session.code}-${round}`} session={session} myName={myName}
        onLeave={() => { setSession(null); setMode('menu'); setCode(''); }}
        onAgain={() => { setSession(null); setMode('menu'); setCode(''); setRound((r) => r + 1); }} />
    );
  }

  return (
    <div className="relative min-h-[100dvh] text-white overflow-hidden" dir={dir}>
      <CosmicBackground accent="#22c55e" accent2="#38bdf8" />
      <div className="relative z-10 max-w-md mx-auto p-4">
        <button onClick={onBack} className="mb-4 text-amber-400 font-bold flex items-center gap-2"><ArrowRight className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />{t('back')}</button>
        {preview && <div className="mb-3 text-xs bg-amber-500/15 text-amber-300 border border-amber-500/40 rounded-xl py-1.5 text-center">{t('preview')}</div>}
        <h1 className="text-3xl font-black text-emerald-300 mb-1 drop-shadow-[0_0_14px_rgba(52,211,153,0.5)]">🌐 {t('title')}</h1>
        <p className="text-slate-400 text-sm mb-4">{t('subtitle')}</p>

        <div className="rounded-2xl bg-white/5 border border-slate-700/60 p-3 mb-4 flex justify-around text-center backdrop-blur-md">
          <div><div className="text-2xl font-black text-emerald-300"><Num>{stats.win}</Num></div><div className="text-[11px] text-slate-400">{t('wins')}</div></div>
          <div><div className="text-2xl font-black text-rose-300"><Num>{stats.lose}</Num></div><div className="text-[11px] text-slate-400">{t('losses')}</div></div>
          <div><div className="text-2xl font-black text-amber-300"><Num>{stats.draw}</Num></div><div className="text-[11px] text-slate-400">{t('draws')}</div></div>
        </div>

        {mode === 'menu' ? (
          <div className="space-y-3">
            <TiltCard glow="#22c55e" pulse onClick={() => setSession({ role: 'host', code: generateRoomCode(), mode: 'live' })} className="p-4">
              <div className="flex items-center gap-3"><span className="text-3xl">🏠</span><h3 className="font-black text-lg text-emerald-300">{t('createLive')}</h3></div>
            </TiltCard>
            <TiltCard glow="#f59e0b" pulse onClick={() => setSession({ role: 'host', code: generateRoomCode(), mode: 'blitz' })} className="p-4">
              <div className="flex items-center gap-3"><span className="text-3xl">⚡</span><h3 className="font-black text-lg text-amber-300">{t('createBlitz')}</h3></div>
            </TiltCard>
            <TiltCard glow="#38bdf8" pulse onClick={() => setMode('join')} className="p-4">
              <div className="flex items-center gap-3"><span className="text-3xl">🔑</span><h3 className="font-black text-lg text-sky-300">{t('join')}</h3></div>
            </TiltCard>
            <TiltCard glow="#8b5cf6" pulse onClick={() => setMode('ghost')} className="p-4">
              <div className="flex items-center gap-3"><span className="text-3xl">👻</span><h3 className="font-black text-lg text-violet-300">{t('ghostAsync')}</h3></div>
            </TiltCard>
          </div>
        ) : (
          <div className="rounded-3xl bg-white/5 border border-sky-500/40 p-4 backdrop-blur-md">
            <p className="text-sm text-slate-300 mb-2">{t('enterCode')}</p>
            <input value={code} onChange={(e) => setCode(normalizeRoomCode(e.target.value))} inputMode="numeric" maxLength={4} dir="ltr"
              className="w-full text-center text-4xl font-mono font-black tracking-[0.5em] bg-slate-950/80 border border-sky-500/40 rounded-2xl py-3 text-sky-200" aria-label={t('roomCode')} />
            <button disabled={!isValidRoomCode(code)} onClick={() => setSession({ role: 'guest', code, mode: 'live' })}
              className="mt-3 w-full h-12 rounded-2xl font-extrabold bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 disabled:opacity-50">{t('joinBtn')}</button>
            <button onClick={() => setMode('menu')} className="mt-2 w-full text-sm text-slate-400">{t('back')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
