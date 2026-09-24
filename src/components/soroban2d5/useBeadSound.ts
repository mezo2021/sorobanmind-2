// src/components/soroban2d5/useBeadSound.ts
import { useCallback, useEffect, useRef } from 'react';

export function useBeadSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !ctxRef.current) {
      ctxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return () => {
      ctxRef.current?.close();
    };
  }, []);

  const playSound = useCallback((type: 'hit' | 'slide' | 'success' | 'error', intensity = 1) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1.4;
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'hit': {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const filter1 = ctx.createBiquadFilter();

        filter1.type = 'bandpass';
        filter1.frequency.value = 1800 + Math.random() * 400;
        filter1.Q.value = 8;

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(900 + Math.random() * 200, now);
        osc1.frequency.exponentialRampToValueAtTime(150, now + 0.06);

        gain1.gain.setValueAtTime(0.5 * intensity, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc1.connect(filter1);
        filter1.connect(gain1);
        gain1.connect(masterGain);

        osc1.start(now);
        osc1.stop(now + 0.1);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        const filter2 = ctx.createBiquadFilter();

        filter2.type = 'lowpass';
        filter2.frequency.value = 1200;
        filter2.Q.value = 1;

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(280 + Math.random() * 60, now);
        osc2.frequency.exponentialRampToValueAtTime(60, now + 0.1);

        gain2.gain.setValueAtTime(0.35 * intensity, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc2.connect(filter2);
        filter2.connect(gain2);
        gain2.connect(masterGain);

        osc2.start(now);
        osc2.stop(now + 0.15);
        break;
      }

      case 'slide': {
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1200, now);
        noiseFilter.frequency.exponentialRampToValueAtTime(3000, now + 0.06);
        noiseFilter.Q.value = 4;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25 * intensity, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.12);
        break;
      }

      case 'success': {
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * 0.1;

          osc.type = 'sine';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.3 * intensity, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          gain.connect(masterGain);

          osc.start(t);
          osc.stop(t + 0.28);
        });
        break;
      }

      case 'error': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

        gain.gain.setValueAtTime(0.3 * intensity, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 0.32);
        break;
      }
    }
  }, []);

  return playSound;
}