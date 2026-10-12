// ═══════════════════════════════════════════════════════════════════
// 🏴‍☠️ src/components/games/Pirates/seaSfx.ts
// ═══════════════════════════════════════════════════════════════════
//
// مولّد أصوات بحرية بالـ WebAudio · بلا ملفات mp3
//
// الأصوات:
//   - موج دائم (ضوضاء بيضاء مُفلترة · lowpass 400Hz)
//   - رعد (sawtooth ينزل 60 → 20 Hz)
//   - بوق نجاح (330 → 440 → 554 Hz)
//   - بوق فشل (180 → 110 Hz)
//   - اهتزاز لمسي
//
// الإصلاحات على نسخة جيميني:
//   1. إضافة export default seaSfx (للتوافق مع كلا نمطي الاستيراد)
//   2. إضافة getter isSupported (لفحص دعم المتصفح)
// ═══════════════════════════════════════════════════════════════════

class SeaAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private isMuted: boolean = false;

  // ═══ فحص دعم المتصفح ═══
  public get isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    );
  }

  // ═══ تهيئة السياق الصوتي وبدء تشغيل ضوضاء الموج ═══
  public init(): void {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.startWaveSound();
    } catch {
      // تجاهل أخطاء الصلاحيات قبل التفاعل
    }
  }

  // ═══ إنشاء وبدء ضوضاء بيضاء مفلترة للموج الدائم ═══
  private startWaveSound(): void {
    if (this.noiseNode || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(
        1,
        bufferSize,
        this.ctx.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      const gain = this.ctx.createGain();
      gain.gain.value = this.isMuted ? 0 : 0.05;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();

      this.noiseNode = noise;
      this.noiseGain = gain;
    } catch {
      // تجاهل الأخطاء
    }
  }

  // ═══ تشغيل صوت الرعد ═══
  public playThunder(): void {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 1.5);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.5);
    } catch {
      // تجاهل الأخطاء
    }
  }

  // ═══ تشغيل صوت البوق (نجاح أو فشل) ═══
  public playTrumpet(success: boolean): void {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';

      if (success) {
        // 3 نغمات صاعدة: 330 → 440 → 554 Hz
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(440, now + 0.15);
        osc.frequency.setValueAtTime(554, now + 0.3);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // نغمة هابطة من 180 إلى 110 Hz خلال 0.4 ث
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.4);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // تجاهل الأخطاء
    }
  }

  // ═══ تشغيل الاهتزاز اللمسي ═══
  public vibrate(pattern: number | number[]): void {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch {
      // تجاهل الاهتزاز غير المدعوم
    }
  }

  // ═══ كتم أو إلغاء كتم الأصوات ═══
  public setMute(muted: boolean): void {
    try {
      this.isMuted = muted;
      if (this.noiseGain && this.ctx) {
        this.noiseGain.gain.setValueAtTime(
          muted ? 0 : 0.05,
          this.ctx.currentTime,
        );
      }
    } catch {
      // تجاهل الأخطاء
    }
  }

  // ═══ تنظيف وتحرير الموارد الصوتية ═══
  public dispose(): void {
    try {
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
        this.ctx = null;
      }
      this.noiseGain = null;
    } catch {
      // تجاهل الأخطاء
    }
  }
}

export const seaSfx = new SeaAudioEngine();
export default seaSfx;