// src/hooks/useSorobanaVoice.ts
import { useCallback, useEffect, useRef, useState } from 'react';

// ✅ المسار الصحيح لـv2
const BASE = 'https://mezo2021.github.io/sorobanmind-2/';

function audioPath(file: string): string {
  return `${BASE}audio/${file}`;
}

function storyPath(id: number): string {
  return `${BASE}audio/stories/story-${id}.mp3`;
}

export const SOROBANA_AUDIO = {
  greetings: [
    audioPath('greeting-1.mp3'),
    audioPath('greeting-2.mp3'),
    audioPath('greeting-3.mp3'),
  ],
  teaching: [
    audioPath('teaching-1.mp3'),
    audioPath('teaching-2.mp3'),
    audioPath('teaching-3.mp3'),
  ],
  correct: [audioPath('correct-1.mp3'), audioPath('correct-2.mp3')],
  wrong: [audioPath('wrong-1.mp3'), audioPath('wrong-2.mp3')],
  endLesson: audioPath('end-lesson.mp3'),
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MAX_DEBUG_LOGS = 40;

// ═══════════════════════════════════════════════
// Web Audio API — Singleton + Buffer Cache
// ═══════════════════════════════════════════════
let sharedAudioContext: AudioContext | null = null;
let globalUnlockInstalled = false;

function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    sharedAudioContext = new Ctor();
  }
  return sharedAudioContext;
}

function installGlobalUnlock() {
  if (globalUnlockInstalled) return;
  if (typeof window === 'undefined') return;
  globalUnlockInstalled = true;

  const unlock = () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {
          /* ignore */
        });
      }
    } catch {
      /* ignore */
    }
  };

  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('touchend', unlock, { passive: true });
  window.addEventListener('mousedown', unlock);
  window.addEventListener('click', unlock);
  window.addEventListener('keydown', unlock);
}

const bufferCache = new Map<string, AudioBuffer>();
const bufferPromises = new Map<string, Promise<AudioBuffer>>();

async function loadBuffer(url: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(url);
  if (cached) return cached;
  const pending = bufferPromises.get(url);
  if (pending) return pending;

  const promise = (async (): Promise<AudioBuffer> => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arr = await res.arrayBuffer();
    const ctx = getAudioContext();
    const buf = await ctx.decodeAudioData(arr.slice(0));
    bufferCache.set(url, buf);
    bufferPromises.delete(url);
    return buf;
  })();

  bufferPromises.set(url, promise);
  try {
    return await promise;
  } catch (err) {
    bufferPromises.delete(url);
    throw err;
  }
}

// ═══════════════════════════════════════════════
// Hook
// ═══════════════════════════════════════════════
export function useSorobanaVoice() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !!(
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: unknown })
        .webkitAudioContext
    );
  });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const generationRef = useRef(0);
  const mountedRef = useRef(true);
  const activeSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextTimeoutRef = useRef<number | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const log = useCallback((msg: string) => {
    setDebugLogs((prev) => {
      const next = [...prev, msg];
      return next.length > MAX_DEBUG_LOGS ? next.slice(-MAX_DEBUG_LOGS) : next;
    });
  }, []);

  const clearDebugLogs = useCallback(() => setDebugLogs([]), []);

  const clearTimers = useCallback(() => {
    if (nextTimeoutRef.current !== null) {
      clearTimeout(nextTimeoutRef.current);
      nextTimeoutRef.current = null;
    }
    if (safetyTimeoutRef.current !== null) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  const killActiveSource = useCallback(() => {
    const src = activeSourceRef.current;
    if (src) {
      try {
        src.onended = null;
      } catch {
        /* ignore */
      }
      try {
        src.stop();
      } catch {
        /* ignore */
      }
      try {
        src.disconnect();
      } catch {
        /* ignore */
      }
      activeSourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    installGlobalUnlock();
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      generationRef.current++;
      clearTimers();
      killActiveSource();
    };
  }, [clearTimers, killActiveSource]);

  const stop = useCallback(() => {
    generationRef.current++;
    clearTimers();
    killActiveSource();
    setIsSpeaking(false);
  }, [clearTimers, killActiveSource]);

  const playFiles = useCallback(
    (files: string[], onDone?: () => void) => {
      if (files.length === 0) {
        onDone?.();
        return;
      }
      if (!mountedRef.current) {
        onDone?.();
        return;
      }

      const myGeneration = ++generationRef.current;
      const localQueue = [...files];

      log(`▶ CALL playFiles (${files.length})`);

      clearTimers();
      killActiveSource();
      setIsSpeaking(true);

      const playNext = async () => {
        if (
          myGeneration !== generationRef.current ||
          !mountedRef.current
        )
          return;
        const nextFile = localQueue.shift();
        if (!nextFile) {
          log('🏁 QUEUE empty → onDone');
          setIsSpeaking(false);
          onDone?.();
          return;
        }

        const filename = nextFile.split('/').pop() || nextFile;
        log(`📁 Loading: ${filename}`);

        let buffer: AudioBuffer;
        try {
          buffer = await loadBuffer(nextFile);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log(`❌ load failed: ${msg}`);
          if (
            myGeneration !== generationRef.current ||
            !mountedRef.current
          )
            return;
          nextTimeoutRef.current = window.setTimeout(() => {
            nextTimeoutRef.current = null;
            playNext();
          }, 100);
          return;
        }

        if (
          myGeneration !== generationRef.current ||
          !mountedRef.current
        )
          return;

        log('🍞 Buffer ready');

        const ctx = getAudioContext();
        log(`🔊 ctx.state=${ctx.state}`);
        if (ctx.state === 'suspended') {
          try {
            await ctx.resume();
            log(`🔊 after resume: ${ctx.state}`);
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            log(`❌ resume failed: ${msg}`);
          }
        }

        if (
          myGeneration !== generationRef.current ||
          !mountedRef.current
        )
          return;

        let advanced = false;
        const advance = () => {
          if (advanced) return;
          advanced = true;
          clearTimers();
          if (
            myGeneration !== generationRef.current ||
            !mountedRef.current
          )
            return;
          nextTimeoutRef.current = window.setTimeout(() => {
            nextTimeoutRef.current = null;
            if (
              myGeneration !== generationRef.current ||
              !mountedRef.current
            )
              return;
            playNext();
          }, 200);
        };

        try {
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.onended = () => {
            log('✔ ENDED');
            advance();
          };
          activeSourceRef.current = source;
          source.start(0);
          log('▶ PLAY fired');
          const ms = Math.max(1000, buffer.duration * 1000 + 2000);
          safetyTimeoutRef.current = window.setTimeout(() => {
            safetyTimeoutRef.current = null;
            log('⏱ SAFETY TIMEOUT');
            advance();
          }, ms);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          log(`❌ source error: ${msg}`);
          advance();
        }
      };

      playNext();
    },
    [clearTimers, killActiveSource, log],
  );

  const speak = useCallback(
    (text: string, _mood?: string, onDone?: () => void) => {
      void text;
      onDone?.();
    },
    [],
  );

  const speakLesson = useCallback(
    (onDone?: () => void) => {
      playFiles([pickRandom(SOROBANA_AUDIO.greetings)], onDone);
    },
    [playFiles],
  );

  const speakTeaching = useCallback(
    (onDone?: () => void) => {
      playFiles([pickRandom(SOROBANA_AUDIO.teaching)], onDone);
    },
    [playFiles],
  );

  const speakCorrect = useCallback(
    (onDone?: () => void) => {
      playFiles([pickRandom(SOROBANA_AUDIO.correct)], onDone);
    },
    [playFiles],
  );

  const speakWrong = useCallback(
    (onDone?: () => void) => {
      playFiles([pickRandom(SOROBANA_AUDIO.wrong)], onDone);
    },
    [playFiles],
  );

  const speakEndLesson = useCallback(
    (onDone?: () => void) => {
      playFiles([SOROBANA_AUDIO.endLesson], onDone);
    },
    [playFiles],
  );

  const speakFiles = useCallback(
    (files: string[], onDone?: () => void) => {
      playFiles(files, onDone);
    },
    [playFiles],
  );

  const speakStory = useCallback(
    (id: number, onDone?: () => void) => {
      playFiles([storyPath(id)], onDone);
    },
    [playFiles],
  );

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    speakLesson,
    speakTeaching,
    speakCorrect,
    speakWrong,
    speakEndLesson,
    speakFiles,
    speakStory,
    debugLogs,
    clearDebugLogs,
  };
}

export default useSorobanaVoice;