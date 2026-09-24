// src/hooks/useSound.ts
import { useCallback, useRef } from 'react';

type SoundType = 'click' | 'success' | 'error' | 'levelup' | 'bead' | 'whoosh';

export function useSound(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (!enabled) return null;
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        )();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, [enabled]);

  const play = useCallback(
    (type: SoundType) => {
      const ctx = getCtx();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();

      const playTone = (
        freq: number,
        duration: number,
        delay: number,
        vol: number,
        oscType: OscillatorType = 'sine',
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + delay + duration,
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      switch (type) {
        case 'click':
          playTone(600, 0.08, 0, 0.15, 'triangle');
          break;
        case 'bead':
          playTone(800, 0.06, 0, 0.12, 'square');
          break;
        case 'success':
          playTone(523, 0.12, 0, 0.2, 'sine');
          playTone(659, 0.12, 0.1, 0.2, 'sine');
          playTone(784, 0.2, 0.2, 0.25, 'sine');
          break;
        case 'error':
          playTone(200, 0.15, 0, 0.2, 'sawtooth');
          playTone(150, 0.2, 0.1, 0.2, 'sawtooth');
          break;
        case 'levelup':
          [523, 659, 784, 1047].forEach((f, i) =>
            playTone(f, 0.15, i * 0.08, 0.25, 'sine'),
          );
          break;
        case 'whoosh':
          playTone(400, 0.3, 0, 0.1, 'sine');
          break;
      }
    },
    [getCtx],
  );

  return play;
}

export default useSound;