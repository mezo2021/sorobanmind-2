// src/hooks/useGameVoice.ts
// 🎭 صوت شخصيات الألعاب بلغتين — معالجة الأسماء العربية في وضع الإنجليزي

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterType } from '../types';
import { useCharacterVoice, VOICE_CONFIG } from './useCharacterVoice';
import { useLangStore } from '@/i18n/useTranslation';
import { gtLang } from '@/components/games/gamesI18n';
import { sanitizeForSpeech } from './useReadAloud';

// دالة تحويل الحروف العربية إلى إنجليزية (Transliteration)
const transliterateArabicName = (str: string): string => {
  const map: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'th', 'ع': 'a',
    'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'ه': 'h', 'و': 'o', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ء': '',
  };
  return str.split('').map((c) => map[c] || c).join('');
};

const EN_FEMALE_HINTS = [
  'female', 'samantha', 'zira', 'victoria', 'karen', 'moira', 'tessa', 'susan',
  'allison', 'ava', 'serena', 'fiona', 'jenny', 'aria', 'google us english',
  'google uk english female',
];
const EN_MALE_HINTS = [
  'male', 'david', 'mark', 'daniel', 'alex', 'fred', 'guy', 'george', 'tom',
  'google uk english male',
];

function findEnglishVoice(
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female',
): { voice: SpeechSynthesisVoice | null; matched: boolean } {
  const pool = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith('en'));
  if (pool.length === 0) return { voice: null, matched: false };
  const hints = gender === 'female' ? EN_FEMALE_HINTS : EN_MALE_HINTS;
  const other = gender === 'female' ? EN_MALE_HINTS : EN_FEMALE_HINTS;
  const name = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const us = (v: SpeechSynthesisVoice) => v.lang.toLowerCase().replace('_', '-') === 'en-us';
  const isGender = (v: SpeechSynthesisVoice, hs: string[]) =>
    hs.some((h) => {
      if (h === 'male') return /(^|[^fe])male/.test(name(v)) && !name(v).includes('female');
      return name(v).includes(h);
    });
  const matches = pool.filter((v) => isGender(v, hints) && !isGender(v, other));
  const best = matches.find(us) || matches[0];
  if (best) return { voice: best, matched: true };
  const fallback = pool.find((v) => us(v) && v.default) || pool.find(us) || pool[0];
  return { voice: fallback, matched: false };
}

export function useGameVoice(character: CharacterType) {
  const arabic = useCharacterVoice(character);
  const [enSpeaking, setEnSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => {
      mountedRef.current = false;
      window.speechSynthesis.removeEventListener?.('voiceschanged', load);
    };
  }, []);

  const speakEn = useCallback(
    (text: string, onDone?: () => void) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onDone?.();
        return;
      }
      const clean = sanitizeForSpeech(text, 'en');
      if (!clean) {
        onDone?.();
        return;
      }

      window.speechSynthesis.cancel();

      const config = VOICE_CONFIG[character] || VOICE_CONFIG.sham;
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'en-US';
      u.pitch = config.pitch;
      u.rate = config.rate;
      u.volume = 1;

      if (voicesRef.current.length === 0) voicesRef.current = window.speechSynthesis.getVoices();
      const { voice, matched } = findEnglishVoice(voicesRef.current, config.preferGender);
      if (voice) {
        u.voice = voice;
        if (!matched) {
          u.pitch =
            config.preferGender === 'male'
              ? Math.max(0.1, config.pitch - 0.15)
              : Math.min(2, config.pitch + 0.15);
        }
      }

      u.onstart = () => {
        if (mountedRef.current) setEnSpeaking(true);
      };
      u.onend = () => {
        if (mountedRef.current) setEnSpeaking(false);
        onDone?.();
      };
      u.onerror = () => {
        if (mountedRef.current) setEnSpeaking(false);
        onDone?.();
      };
      window.speechSynthesis.speak(u);
    },
    [character],
  );

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      const lang = useLangStore.getState().lang;

      // النطق باللغة العربية: يمرر النص كما هو
      if (lang !== 'en') {
        arabic.speak(text, onDone);
        return;
      }

      // النطق باللغة الإنجليزية
      // 1. نترجم النص (ستبقى الأسماء العربية كما هي لأن القاموس لا يترجمها)
      const en = gtLang(text, 'en');
      
      // 2. نحول أي حروف عربية متبقية (وهي الأسماء) إلى إنجليزية
      const finalEn = transliterateArabicName(en);

      // 3. ننطق النص النهائي بالصوت الإنجليزي
      speakEn(finalEn, onDone);
    },
    [arabic.speak, speakEn],
  );

  const stop = useCallback(() => {
    arabic.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mountedRef.current) setEnSpeaking(false);
  }, [arabic.stop]);

  return {
    speak,
    stop,
    isSpeaking: arabic.isSpeaking || enSpeaking,
    isSupported: arabic.isSupported,
  };
}

export default useGameVoice;
// ✅ [Fix Mixed AR/EN] — تحويل الأسماء بالكامل إلى إنجليزية لضمان نطقها بسلاسة دون التأثير على باقي الجملة.