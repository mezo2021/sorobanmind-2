// ═══════════════════════════════════════════════════════════════════
// 🆕 src/hooks/useCharacterVoice.ts — v2
// ═══════════════════════════════════════════════════════════════════
//
// ما تغيّر عن v1:
//   1. pitch أكثر تضخيماً (ريان 0.70 · شام 1.40) — لتفريق أوضح
//   2. انتظار تحميل الأصوات (voicesReady) — يحل مشكلة Chrome async
//   3. fallback ذكي: إن لم يجد صوتاً بنفس الجنس · يُضخّم pitch أكثر
//   4. كلمات بحث إضافية للأصوات العربية
//
// ⚠️ الواجهة العامة ثابتة — لا يلمس أي مستخدم.
// ═══════════════════════════════════════════════════════════════════

// src/hooks/useCharacterVoice.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterType } from '../types';

interface VoiceConfig {
  pitch: number;
  rate: number;
  preferGender: 'male' | 'female';
}

// 🆕 pitch مُضخَّم — لتفريق أوضح بين الأبطال
const VOICE_CONFIG: Record<CharacterType, VoiceConfig> = {
  sham: { pitch: 1.40, rate: 0.95, preferGender: 'female' },
  rayan: { pitch: 0.70, rate: 1.15, preferGender: 'male' },
  bana: { pitch: 1.25, rate: 0.90, preferGender: 'female' },
  joud: { pitch: 0.80, rate: 1.05, preferGender: 'male' },
};

// 🆕 كلمات بحث أوسع
const FEMALE_HINTS = [
  'female', 'woman', 'hoda', 'salma', 'zariyah',
  'laila', 'amany', 'amina', 'zeina', 'rana',
  'mariam', 'fatima', 'noor', 'sara',
];

const MALE_HINTS = [
  'male', 'man', 'hamed', 'maged', 'tarik',
  'ali', 'majed', 'naayf', 'khalid', 'omar',
  'ahmed', 'mohammed', 'youssef', 'hassan',
];

export function useCharacterVoice(character: CharacterType) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const mountedRef = useRef(true);

  // ═══ التحقق من الدعم + انتظار تحميل الأصوات ═══
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const checkVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesReady(true);
      }
    };

    // Chrome يحمّل الأصوات بشكل غير متزامن
    checkVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    }

    // احتياط: إعادة الفحص بعد 500ms
    const t = setTimeout(checkVoices, 500);

    return () => {
      mountedRef.current = false;
      clearTimeout(t);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // ═══ إيجاد الصوت المناسب ═══
  const findVoice = useCallback(
    (prefer: 'male' | 'female'): SpeechSynthesisVoice | null => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return null;
      }

      const voices = window.speechSynthesis.getVoices();
      const arabicVoices = voices.filter(
        (v) => v.lang && v.lang.toLowerCase().startsWith('ar'),
      );

      if (arabicVoices.length === 0) return null;

      const hints = prefer === 'female' ? FEMALE_HINTS : MALE_HINTS;

      // 1) بحث في الأصوات العربية بأسماء مطابقة
      const match = arabicVoices.find((v) =>
        hints.some((h) => v.name.toLowerCase().includes(h)),
      );
      if (match) return match;

      // 2) بحث في كل الأصوات (قد يكون الصوت العربي باسم لا نعرفه)
      const allMatch = voices.find(
        (v) =>
          v.lang &&
          v.lang.toLowerCase().startsWith('ar') &&
          hints.some((h) => v.name.toLowerCase().includes(h)),
      );
      if (allMatch) return allMatch;

      // 3) fallback: أول صوت عربي (غالباً أنثوي) — نعتمد على pitch
      return arabicVoices[0];
    },
    [],
  );

  // ═══ نطق النص ═══
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
      if (voice) {
        utterance.voice = voice;

        // 🆕 إن لم يطابق الصوت الجنس المطلوب → نُضخّم الفرق بـ pitch
        const voiceName = voice.name.toLowerCase();
        const hints =
          config.preferGender === 'female' ? FEMALE_HINTS : MALE_HINTS;
        const isGenderMatch = hints.some((h) => voiceName.includes(h));

        if (!isGenderMatch) {
          if (config.preferGender === 'male') {
            // نُريد صوتاً ذكورياً لكن المتاح أنثوي → نُخفض pitch أكثر
            utterance.pitch = Math.max(0.1, config.pitch - 0.15);
          } else {
            // نُريد صوتاً أنثوياً لكن المتاح ذكوري → نرفع pitch أكثر
            utterance.pitch = Math.min(2, config.pitch + 0.15);
          }
        }
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [character, findVoice, voicesReady],
  );

  // ═══ إيقاف النطق ═══
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // ═══ تنظيف عند unmount ═══
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { speak, stop, isSpeaking, isSupported };
}

export default useCharacterVoice;