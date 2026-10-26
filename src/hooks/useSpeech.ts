// src/hooks/useSpeech.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechOptions {
  enabled?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeech({
  enabled = true,
  rate = 0.85,
  pitch = 1.1,
  volume = 1,
}: UseSpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(
    (
      text: string,
      options?: {
        rate?: number;
        pitch?: number;
        lang?: string;
        onEnd?: () => void;
      },
    ) => {
      if (!enabled || !isSupported || !text) {
        if (options?.onEnd) options.onEnd();
        return;
      }

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = options?.lang || 'ar-SA';
      
      utterance.lang = targetLang;
      utterance.rate = options?.rate ?? rate;
      utterance.pitch = options?.pitch ?? pitch;
      utterance.volume = volume;

      // اختيار الصوت المناسب حسب اللغة المطلوبة
      const code = targetLang.substring(0, 2).toLowerCase();
      const voice = voices.find((v) => v.lang.toLowerCase().startsWith(code));
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (options?.onEnd) options.onEnd();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [enabled, isSupported, rate, pitch, volume, voices],
  );

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    hasArabicVoice: voices.some((v) => v.lang.startsWith('ar')),
  };
}

export default useSpeech;