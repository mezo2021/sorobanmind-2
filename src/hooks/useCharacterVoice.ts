// src/hooks/useCharacterVoice.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterType } from '../types';

interface VoiceConfig {
  pitch: number;
  rate: number;
  preferGender: 'male' | 'female';
}

const VOICE_CONFIG: Record<CharacterType, VoiceConfig> = {
  sham: { pitch: 1.25, rate: 0.95, preferGender: 'female' },
  rayan: { pitch: 1.05, rate: 1.10, preferGender: 'male' },
  bana: { pitch: 1.15, rate: 0.90, preferGender: 'female' },
  joud: { pitch: 0.95, rate: 1.00, preferGender: 'male' },
};

const FEMALE_HINTS = ['female', 'woman', 'hoda', 'salma', 'zariyah', 'laila', 'amany', 'amina', 'zeina', 'rana'];
const MALE_HINTS = ['male', 'man', 'hamed', 'maged', 'tarik', 'ali', 'majed', 'naayf'];

export function useCharacterVoice(character: CharacterType) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    setIsSupported(typeof window !== 'undefined' && 'speechSynthesis' in window);
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const findVoice = useCallback(
    (prefer: 'male' | 'female'): SpeechSynthesisVoice | null => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      const arabicVoices = voices.filter((v) => v.lang.startsWith('ar'));
      if (arabicVoices.length === 0) return null;
      const hints = prefer === 'female' ? FEMALE_HINTS : MALE_HINTS;
      const match = arabicVoices.find((v) =>
        hints.some((h) => v.name.toLowerCase().includes(h)),
      );
      return match || arabicVoices[0];
    },
    [],
  );

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onDone?.();
        return;
      }
      window.speechSynthesis.cancel();
      const config = VOICE_CONFIG[character] || VOICE_CONFIG.sham;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.pitch = config.pitch;
      utterance.rate = config.rate;
      utterance.volume = 1;
      const voice = findVoice(config.preferGender);
      if (voice) utterance.voice = voice;
      utterance.onstart = () => {
        if (mountedRef.current) setIsSpeaking(true);
      };
      utterance.onend = () => {
        if (mountedRef.current) setIsSpeaking(false);
        onDone?.();
      };
      utterance.onerror = () => {
        if (mountedRef.current) setIsSpeaking(false);
        onDone?.();
      };
      window.speechSynthesis.speak(utterance);
    },
    [character, findVoice],
  );

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported };
}

export default useCharacterVoice;