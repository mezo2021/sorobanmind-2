// src/hooks/useRealtimeDuel.ts
// قلب الأونلاين: دورة حياة غرفة Supabase Realtime (Broadcast + Presence). المضيف هو المرجع (Host-Authoritative).
import { useCallback, useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { genSet, type CompQuestion } from '@/components/games/MentalArchivesGame/competition/compMath';

export const LIVE_QUESTIONS = 10;
export const LIVE_Q_SECONDS = 15;
export const COUNTDOWN_MS = 3000;
export const GRACE_SECONDS = 15;
const JOIN_TIMEOUT_MS = 6000;

export type DuelPhase = 'connecting' | 'lobby' | 'countdown' | 'playing' | 'waitingOpponent' | 'finished' | 'error';
export type DuelError = 'roomNotFound' | 'roomFull' | 'roomTaken' | 'connection' | null;

export interface FinalStats { score: number; totalTime: number; correct: number }
export interface DuelResult {
  outcome: 'win' | 'lose' | 'draw';
  myScore: number; oppScore: number;
  myTime: number; oppTime: number;
  forfeit: boolean;
}

type Payload =
  | { type: 'ready'; name: string }
  | { type: 'start'; startAt: number; startIn: number; questions: CompQuestion[] }
  | { type: 'answer'; questionIndex: number; correct: boolean; timeSpent: number; score: number }
  | { type: 'finish'; finalScore: number; totalTime: number; correct: number };

export interface RealtimeDuel {
  phase: DuelPhase;
  error: DuelError;
  opponentName: string;
  opponentPresent: boolean;
  myReady: boolean;
  oppReady: boolean;
  questions: CompQuestion[];
  countdownMs: number;
  oppProgress: { answered: number; score: number };
  graceLeft: number | null;
  result: DuelResult | null;
  setReady: () => void;
  sendAnswer: (a: { questionIndex: number; correct: boolean; timeSpent: number; score: number }) => void;
  finishMine: (f: FinalStats) => void;
}

interface Opts { role: 'host' | 'guest'; code: string; myName: string }

const clientId = () => `c-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;

export function useRealtimeDuel({ role, code, myName }: Opts): RealtimeDuel {
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

  const channelRef = useRef<RealtimeChannel | null>(null);
  const idRef = useRef(clientId());
  const startedRef = useRef(false);
  const hadOppRef = useRef(false);
  const phaseRef = useRef<DuelPhase>('connecting');
  phaseRef.current = phase;

  const send = useCallback((payload: Payload) => {
    channelRef.current?.send({ type: 'broadcast', event: 'duel', payload });
  }, []);

  // ── الاتصال بالقناة ──
  useEffect(() => {
    if (channelRef.current) return; // حماية StrictMode من الاشتراك المزدوج
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
        setQuestions(p.questions);
        setStartAt(Date.now() + p.startIn); // نعتمد المدة النسبية لتفادي اختلاف ساعات الأجهزة
        setPhase('countdown');
      } else if (p.type === 'answer') setOppProgress({ answered: p.questionIndex + 1, score: p.score });
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
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, role]);

  // ── المضيف يبدأ عند جاهزية الطرفين ──
  useEffect(() => {
    if (role !== 'host' || phase !== 'lobby' || startedRef.current) return;
    if (myReady && oppReady && opponentPresent) {
      startedRef.current = true;
      const qs = genSet(LIVE_QUESTIONS, 2);
      const at = Date.now() + COUNTDOWN_MS;
      send({ type: 'start', startAt: at, startIn: COUNTDOWN_MS, questions: qs });
      setQuestions(qs); setStartAt(at); setPhase('countdown');
    }
  }, [role, phase, myReady, oppReady, opponentPresent, send]);

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

  // ── انقطاع الخصم: مهلة 15 ث ثم فوز تلقائي ──
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

  // ── النتيجة عند إنهاء الطرفين: الأعلى نقاطاً ثم الأسرع ثم تعادل ──
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

  const sendAnswer = useCallback((a: { questionIndex: number; correct: boolean; timeSpent: number; score: number }) => {
    send({ type: 'answer', ...a });
  }, [send]);

  const finishMine = useCallback((f: FinalStats) => {
    setMyFinal(f);
    send({ type: 'finish', finalScore: f.score, totalTime: f.totalTime, correct: f.correct });
    setPhase((p) => (p === 'finished' ? p : 'waitingOpponent'));
  }, [send]);

  return { phase, error, opponentName, opponentPresent, myReady, oppReady, questions, countdownMs, oppProgress, graceLeft, result, setReady, sendAnswer, finishMine };
}
