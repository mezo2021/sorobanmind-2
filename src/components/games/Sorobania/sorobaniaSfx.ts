// ═══════════════════════════════════════════════════════════════════
// src/components/games/Sorobania/sorobaniaSfx.ts
// 🔊 المؤثرات الصوتية — WebAudio بلا ملفات
// ═══════════════════════════════════════════════════════════════════
// الدور: توليد كل أصوات اللعبة برمجياً (صحيح · خطأ · نجمة · فوز ...).
//   • sfx.correct / wrong / tick / relight / star / fanfare / lose / unlock / click
//   • setSoundOn(true|false) لكتم الصوت
//
// يستورده: SorobaniaGame · SorobaniaUI
// يعتمد على: لا شيء (WebAudio فقط)
//
// متى تعدّله؟ لتغيير نغمة أو إضافة مؤثر جديد.
//
// [FIX A3] — dispose() لتنظيف AudioContext عند الخروج — 2026-10-13
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// الصوت — WebAudio بلا ملفات
// ═══════════════════════════════════════════════════════════════════

let audioCtx: AudioContext | null = null;
let soundOn = true;

const getCtx = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') void audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
};

interface ToneOpts {
  type?: OscillatorType;
  vol?: number;
  delay?: number;
  slideTo?: number;
}

const tone = (freq: number, dur: number, o: ToneOpts = {}) => {
  if (!soundOn) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + (o.delay ?? 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = o.type ?? 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur);
    const v = o.vol ?? 0.15;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(v, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  } catch {
    // تجاهل أخطاء الصوت
  }
};

const noise = (dur: number, vol: number, delay = 0) => {
  if (!soundOn) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(ctx.currentTime + delay);
  } catch {
    // تجاهل أخطاء الصوت
  }
};

export const sfx = {
  click: () => tone(520, 0.06, { type: 'triangle', vol: 0.08 }),
  correct: (streak: number) => {
    const base = 520 + Math.min(streak, 8) * 28;
    tone(base, 0.12, { type: 'triangle', vol: 0.16 });
    tone(base * 1.25, 0.12, { type: 'triangle', vol: 0.16, delay: 0.09 });
    tone(base * 1.5, 0.22, { type: 'triangle', vol: 0.18, delay: 0.18 });
  },
  wrong: () => {
    tone(220, 0.3, { type: 'sawtooth', vol: 0.11, slideTo: 110 });
    noise(0.35, 0.09, 0.02);
  },
  tick: () => tone(880, 0.05, { type: 'square', vol: 0.05 }),
  relight: () => {
    noise(0.25, 0.07);
    [660, 880, 1175, 1568].forEach((f, i) => tone(f, 0.16, { type: 'sine', vol: 0.14, delay: 0.05 + i * 0.07 }));
  },
  star: (i: number) => {
    tone(700 + i * 180, 0.25, { type: 'triangle', vol: 0.2 });
    tone((700 + i * 180) * 2, 0.3, { type: 'sine', vol: 0.1, delay: 0.05 });
  },
  fanfare: () => {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.18, delay: i * 0.13 }));
    tone(1047, 0.7, { type: 'triangle', vol: 0.2, delay: 0.55 });
    tone(1319, 0.7, { type: 'sine', vol: 0.12, delay: 0.55 });
  },
  lose: () => {
    [392, 330, 262, 196].forEach((f, i) => tone(f, 0.3, { type: 'sine', vol: 0.16, delay: i * 0.2 }));
    noise(0.5, 0.07, 0.6);
  },
  unlock: () => {
    [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.16, delay: i * 0.1 }));
  },
};

// تشغيل/كتم الصوت من الخارج (المتغيّر الداخلي soundOn لا يُصدَّر مباشرة)
export const setSoundOn = (on: boolean): void => {
  soundOn = on;
};

// تنظيف AudioContext عند الخروج
export const dispose = (): void => {
  try {
    if (audioCtx && audioCtx.state !== 'closed') {
      void audioCtx.close();
      audioCtx = null;
    }
  } catch {
    // تجاهل
  }
};