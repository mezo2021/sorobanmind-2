// src/hooks/useRealtimeDuel.ts
// قلب الأونلاين: دورة حياة غرفة Supabase Realtime (Broadcast + Presence). المضيف هو المرجع (Host-Authoritative).
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { genSet, type CompQuestion } from '@/components/games/MentalArchivesGame/competition/compMath';

export type DuelMode = 'live' | 'blitz';
export interface DuelConfig { mode: DuelMode; questions: number; seconds: number; level: 1 | 2 | 3 }
export const DUEL_CONFIGS: Record<DuelMode, DuelConfig> = {
  live: { mode: 'live', questions: 5, seconds: 20, level: 1 },
  blitz: { mode: 'blitz', questions: 5, seconds: 5, level: 1 },
};
export const COUNTDOWN_MS = 5000;
export const GRACE_SECONDS = 15;
const JOIN_TIMEOUT_MS = 6000;
export const ROOM_TIMEOUT_SECONDS = 5 * 60;

export type DuelPhase = 'connecting' | 'lobby' | 'countdown' | 'playing' | 'waitingOpponent' | 'finished' | 'error';
export type DuelError = 'roomNotFound' | 'roomFull' | 'roomTaken' | 'connection' | 'expired' | null;

export interface FinalStats { score: number; totalTime: number; correct: number }
export interface DuelResult {
  outcome: 'win' | 'lose' | 'draw';
  myScore: number; oppScore: number;
  myTime: number; oppTime: number;
  forfeit: boolean;
}

type Payload =
  | { type: 'ready'; name: string }
  | { type: 'start'; startAt: number; startIn: number; questions: CompQuestion[]; mode?: DuelMode }
  | { type: 'answer'; questionIndex: number; correct: boolean; timeSpent: number; score: number }
  | { type: 'finish'; finalScore: number; totalTime: number; correct: number }
  | { type: 'rematch_request' };

export type RematchStatus = 'idle' | 'requested' | 'accepted';

export interface RealtimeDuel {
  phase: DuelPhase;
  matchId: number;
  rematchStatus: RematchStatus;
  oppWantsRematch: boolean;
  requestRematch: () => void;
  error: DuelError;
  expiresIn: number | null;
  opponentName: string;
  opponentPresent: boolean;
  myReady: boolean;
  oppReady: boolean;
  config: DuelConfig;
  questions: CompQuestion[];
  countdownMs: number;
  oppProgress: { answered: number; score: number };
  graceLeft: number | null;
  result: DuelResult | null;
  setReady: () => void;
  sendAnswer: (a: { questionIndex: number; correct: boolean; timeSpent: number; score: number }) => void;
  finishMine: (f: FinalStats) => void;
}

interface Opts { role: 'host' | 'guest'; code: string; myName: string; mode?: DuelMode }

const clientId = () => `c-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

export function useRealtimeDuel({ role, code, myName, mode = 'live' }: Opts): RealtimeDuel {
  const [config, setConfig] = useState<DuelConfig>(DUEL_CONFIGS[mode]);
  const [phase, setPhase] = useState<DuelPhase>('connecting');
  const [error, setError] = useState<DuelError>(null);
  const [opponentName, setOpponentName] = useState('');
  const [opponentPresent, setOpponentPresent] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [oppReady, setOppReady] = useState(false);
  const [questions, setQuestions] = useState<CompQuestion[]>([]);
  const [startAt, setStartAt] = useState(0);
  const [countdownMs, setCountdownMs] = useState(COUNTDOWN_MS);
  const [oppProgress, setOppProgress] = useState({ answered: 0, score: 0 });
  const [graceLeft, setGraceLeft] = useState<number | null>(null);
  const [myFinal, setMyFinal] = useState<FinalStats | null>(null);
  const [oppFinal, setOppFinal] = useState<FinalStats | null>(null);
  const [result, setResult] = useState<DuelResult | null>(null);
  const [matchId, setMatchId] = useState(0);
  const [myRematch, setMyRematch] = useState(false);
  const [oppRematch, setOppRematch] = useState(false);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const idRef = useRef(clientId());
  const startedRef = useRef(false);
  const hadOppRef = useRef(false);
  const phaseRef = useRef<DuelPhase>('connecting');
  phaseRef.current = phase;

  const beginMatch = useCallback((qs: CompQuestion[], at: number) => {
    setMyFinal(null); setOppFinal(null); setResult(null);
    setOppProgress({ answered: 0, score: 0 });
    setMyRematch(false); setOppRematch(false);
    setGraceLeft(null);
    setCountdownMs(Math.max(0, at - Date.now()));
    setQuestions(qs); setStartAt(at);
    setMatchId((m) => m + 1);
    setPhase('countdown');
  }, []);

  const send = useCallback((payload: Payload) => {
    channelRef.current?.send({ type: 'broadcast', event: 'duel', payload });
  }, []);

  // ── الاتصال بالقناة ──
  useEffect(() => {
    if (channelRef.current) return;
    let joinTimer: number | undefined;
    const channel = supabase.channel(`duel:${code}`, {
      config: { broadcast: { self: false }, presence: { key: idRef.current } },
    });
    channelRef.current = channel;

    const others = () => {
      const st = channel.presenceState() as Record<string, Array<{ role?: string; name?: string }>>;
      return Object.entries(st).filter(([k]) => k !== idRef.current).flatMap(([, v]) => v);
    };

    channel.on('presence', { event: 'sync' }, () => {
      const o = others();
      const has = o.length > 0;
      setOpponentPresent(has);
      if (has) {
        hadOppRef.current = true;
        setOpponentName(o[0].name || '');
        if (role === 'guest' && o.some((x) => x.role === 'host') && phaseRef.current === 'connecting') {
          window.clearTimeout(joinTimer);
          setPhase('lobby');
        }
      } else if (hadOppRef.current && phaseRef.current === 'lobby') {
        setMyReady(false); setOppReady(false);
      }
    });

    channel.on('broadcast', { event: 'duel' }, ({ payload }) => {
      const p = payload as Payload;
      if (p.type === 'ready') { setOppReady(true); if (p.name) setOpponentName(p.name); }
      else if (p.type === 'start') {
        if (p.mode && DUEL_CONFIGS[p.mode]) setConfig(DUEL_CONFIGS[p.mode]);
        beginMatch(p.questions, Date.now() + p.startIn);
      } else if (p.type === 'answer') setOppProgress({ answered: p.questionIndex + 1, score: p.score });
      else if (p.type === 'rematch_request') setOppRematch(true);
      else if (p.type === 'finish') setOppFinal({ score: p.finalScore, totalTime: p.totalTime, correct: p.correct });
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ role, name: myName });
        const o = others();
        if (role === 'host') {
          if (o.some((x) => x.role === 'host')) { setError('roomTaken'); setPhase('error'); return; }
          setPhase('lobby');
        } else {
          if (o.length >= 2) { setError('roomFull'); setPhase('error'); return; }
          joinTimer = window.setTimeout(() => {
            if (phaseRef.current === 'connecting') { setError('roomNotFound'); setPhase('error'); }
          }, JOIN_TIMEOUT_MS);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        if (phaseRef.current === 'connecting') { setError('connection'); setPhase('error'); }
      }
    });

    return () => {
      window.clearTimeout(joinTimer);
      if (channelRef.current === channel) {
        supabase.removeChannel(channel);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, role]);

  // 🆕 تنظيف عند إغلاق التبويب
  useEffect(() => {
    const handleBeforeUnload = () => {
      const ch = channelRef.current;
      if (ch) {
        try { ch.unsubscribe(); } catch { /* noop */ }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 🆕 المهلة التلقائية: تعمل فقط في lobby إذا لم ينضم الخصم بعد
  useEffect(() => {
    // 🆕 المهلة تعمل فقط إذا كنا في lobby والخصم لم ينضم بعد
    if (phase !== 'lobby' || opponentPresent) {
      setExpiresIn(null);
      return;
    }
    
    setExpiresIn(ROOM_TIMEOUT_SECONDS);
    const interval = window.setInterval(() => {
      setExpiresIn(prev => {
        if (prev === null || prev <= 1) {
          window.clearInterval(interval);
          const ch = channelRef.current;
          if (ch) {
            try { supabase.removeChannel(ch); } catch { /* noop */ }
            channelRef.current = null;
          }
          setError('expired');
          setPhase('error');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => window.clearInterval(interval);
  }, [phase, opponentPresent]); // 🆕 إضافة opponentPresent

  // ── المضيف يبدأ عند جاهزية الطرفين ──
  useEffect(() => {
    if (role !== 'host' || phase !== 'lobby' || startedRef.current) return;
    if (myReady && oppReady && opponentPresent) {
      startedRef.current = true;
      const cfg = DUEL_CONFIGS[mode];
      const qs = genSet(cfg.questions, cfg.level);
      const at = Date.now() + COUNTDOWN_MS;
      send({ type: 'start', startAt: at, startIn: COUNTDOWN_MS, questions: qs, mode });
      beginMatch(qs, at);
    }
  }, [role, phase, myReady, oppReady, opponentPresent, send, mode, beginMatch]);

  // ── إعادة اللعب ──
  useEffect(() => {
    if (role !== 'host' || phase !== 'finished' || !myRematch || !oppRematch || !opponentPresent) return;
    const cfg = DUEL_CONFIGS[mode];
    const qs = genSet(cfg.questions, cfg.level);
    const at = Date.now() + COUNTDOWN_MS;
    send({ type: 'start', startAt: at, startIn: COUNTDOWN_MS, questions: qs, mode });
    beginMatch(qs, at);
  }, [role, phase, myRematch, oppRematch, opponentPresent, mode, send, beginMatch]);

  // ── العدّ التنازلي المتزامن ──
  useEffect(() => {
    if (phase !== 'countdown') return;
    const t = window.setInterval(() => {
      const ms = startAt - Date.now();
      setCountdownMs(Math.max(0, ms));
      if (ms <= 0) { window.clearInterval(t); setPhase('playing'); }
    }, 50);
    return () => window.clearInterval(t);
  }, [phase, startAt]);

  // ── انقطاع الخصم ──
  useEffect(() => {
    const live = phase === 'countdown' || phase === 'playing' || phase === 'waitingOpponent';
    if (!live || opponentPresent || oppFinal) { setGraceLeft(null); return; }
    setGraceLeft(GRACE_SECONDS);
    const t = window.setInterval(() => {
      setGraceLeft((g) => {
        if (g === null) return null;
        if (g <= 1) {
          window.clearInterval(t);
          setResult({ outcome: 'win', myScore: myFinal?.score ?? 0, oppScore: oppProgress.score, myTime: myFinal?.totalTime ?? 0, oppTime: 0, forfeit: true });
          setPhase('finished');
          return null;
        }
        return g - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, opponentPresent, oppFinal]);

  // ── النتيجة ──
  useEffect(() => {
    if (!myFinal || !oppFinal || result) return;
    const outcome = myFinal.score !== oppFinal.score
      ? (myFinal.score > oppFinal.score ? 'win' : 'lose')
      : myFinal.totalTime !== oppFinal.totalTime
        ? (myFinal.totalTime < oppFinal.totalTime ? 'win' : 'lose')
        : 'draw';
    setResult({ outcome, myScore: myFinal.score, oppScore: oppFinal.score, myTime: myFinal.totalTime, oppTime: oppFinal.totalTime, forfeit: false });
    setPhase('finished');
  }, [myFinal, oppFinal, result]);

  const setReady = useCallback(() => {
    setMyReady(true);
    send({ type: 'ready', name: myName });
  }, [send, myName]);

  const requestRematch = useCallback(() => {
    if (phaseRef.current !== 'finished') return;
    setMyRematch(true);
    send({ type: 'rematch_request' });
  }, [send]);

  const sendAnswer = useCallback((a: { questionIndex: number; correct: boolean; timeSpent: number; score: number }) => {
    send({ type: 'answer', ...a });
  }, [send]);

  const finishMine = useCallback((f: FinalStats) => {
    setMyFinal(f);
    send({ type: 'finish', finalScore: f.score, totalTime: f.totalTime, correct: f.correct });
    setPhase((p) => (p === 'finished' ? p : 'waitingOpponent'));
  }, [send]);

  const rematchStatus: RematchStatus = myRematch && oppRematch ? 'accepted' : myRematch ? 'requested' : 'idle';
  const oppWantsRematch = oppRematch && !myRematch;

  return { phase, matchId, rematchStatus, oppWantsRematch, requestRematch, error, expiresIn, opponentName, opponentPresent, myReady, oppReady, config, questions, countdownMs, oppProgress, graceLeft, result, setReady, sendAnswer, finishMine };
}