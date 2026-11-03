// src/components/games/MentalArchivesGame/ui/SpeechCrystal.tsx
// بلورة النطق الزمني — إدخال صوتي اختياري. تختفي تلقائياً إن لم يدعم الجهاز Web Speech.
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { speechToNumber } from './speechToNumber';
import { tUI } from '../gameUI';

type Props = {
  lang: 'ar' | 'en';
  disabled?: boolean;
  reduceMotion?: boolean | null;
  onStart?: () => void;
  onNumber: (n: number) => void;
};

const getCtor = (): any =>
  typeof window === 'undefined' ? null : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

export default function SpeechCrystal({ lang, disabled, reduceMotion, onStart, onNumber }: Props) {
  const [status, setStatus] = useState<'idle' | 'listening' | 'nohear' | 'denied'>('idle');
  const recRef = useRef<any>(null);
  const timeoutRef = useRef<number | null>(null);
  const supported = !!getCtor();

  const stop = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    try { recRef.current?.abort(); } catch { /* noop */ }
    recRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);
  useEffect(() => { if (disabled) { stop(); setStatus('idle'); } }, [disabled, stop]);

  const start = () => {
    if (status === 'listening') { stop(); setStatus('idle'); return; }
    const Ctor = getCtor();
    if (!Ctor || disabled) return;
    onStart?.();
    try {
      const rec = new Ctor();
      rec.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      rec.onresult = (e: any) => {
        const res = e.results?.[0];
        let num: number | null = null;
        for (let i = 0; res && i < res.length && num === null; i++) num = speechToNumber(res[i].transcript);
        if (num !== null) { onNumber(num); setStatus('idle'); } else setStatus('nohear');
      };
      rec.onerror = (e: any) =>
        setStatus(e?.error === 'not-allowed' || e?.error === 'service-not-allowed' ? 'denied' : 'nohear');
      rec.onend = () => setStatus((s) => (s === 'listening' ? 'nohear' : s));
      recRef.current = rec;
      setStatus('listening');
      rec.start();
      timeoutRef.current = window.setTimeout(() => { stop(); setStatus((s) => (s === 'listening' ? 'nohear' : s)); }, 7000);
    } catch {
      setStatus('denied');
    }
  };

  if (!supported) return null;
  const listening = status === 'listening';
  const label =
    status === 'listening' ? tUI('micListening') : status === 'nohear' ? tUI('micNotHeard') : status === 'denied' ? tUI('micDenied') : tUI('micStart');

  return (
    <div className="flex flex-col items-center gap-1 shrink-0 w-24">
      <button
        type="button"
        onClick={start}
        disabled={disabled || status === 'denied'}
        aria-label={tUI('micStart')}
        className="relative w-16 h-16 flex items-center justify-center disabled:opacity-40"
      >
        {listening && (
          <motion.span
            className="absolute inset-0 rounded-2xl rotate-45 bg-cyan-400"
            animate={reduceMotion ? { opacity: 0.4 } : { scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1.1, repeat: Infinity }}
          />
        )}
        <span className={`absolute inset-2 rounded-xl rotate-45 border-2 bg-gradient-to-br from-cyan-300 via-sky-500 to-violet-600 shadow-lg ${listening ? 'border-white shadow-cyan-400/60' : 'border-cyan-200/60 shadow-cyan-500/30'}`} />
        <Mic className="relative w-6 h-6 text-white drop-shadow" />
      </button>
      <span className="text-[11px] leading-tight text-center text-cyan-200/80 min-h-[28px]">{label}</span>
    </div>
  );
}
