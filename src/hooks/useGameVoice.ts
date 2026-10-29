// src/hooks/useGameVoice.ts
// 🎭 صوت شخصيات الألعاب بلغتين — نفس واجهة useCharacterVoice
//  • العربية: تُفوَّض كما هي إلى useCharacterVoice (بلا أي تغيير في الـ pitch/الصوت)
//  • الإنجليزية: الشخصيات الأربع بنفس قيم pitch/rate (VOICE_CONFIG) على أصوات en-US
//
// الواجهة: { speak(text, onDone?), stop(), isSpeaking, isSupported }
// يمكن تمرير نص عربي (يُترجم تلقائيًا عبر gtLang) أو إنجليزي جاهز.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterType } from '../types';
import { useCharacterVoice, VOICE_CONFIG } from './useCharacterVoice';
import { useLangStore } from '@/i18n/useTranslation';
import { gtLang } from '@/components/games/gamesI18n';
import { sanitizeForSpeech } from './useReadAloud';

const EN_FEMALE_HINTS = [
  'female', 'samantha', 'zira', 'victoria', 'karen', 'moira', 'tessa', 'susan',
  'allison', 'ava', 'serena', 'fiona', 'jenny', 'aria', 'google us english',
  'google uk english female',
];
const EN_MALE_HINTS = [
  'male', 'david', 'mark', 'daniel', 'alex', 'fred', 'guy', 'george', 'tom',
  'google uk english male',
];

// تعبير نمطي لاكتشاف مقاطع اللغة العربية (متتالية من الكلمات العربية)
const ARABIC_RUN_RE = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*/g;

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
  // ممنوع "female" داخل "male" (female يحتوي male)
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
      // ملاحظة: تم إزالة window.speechSynthesis.cancel() من هنا 
      // لأننا نستخدم نظام الطابور (Queue) لنطق الجمل المختلطة بالتتابع.

      // نفس قيم الشخصيات العربية (pitch / rate / الجنس)
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
        // الصوت المتاح لا يطابق الجنس → نُضخّم الفرق بالـ pitch (كما في العربية)
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
      
      // وضع اللغة العربية: نطق مباشر (كما كان)
      if (lang !== 'en') {
        arabic.speak(text, onDone);
        return;
      }

      // وضع اللغة الإنجليزية: نقوم بالترجمة أولاً
      const en = gtLang(text, 'en');
      
      // إذا كان النص إنجليزياً خالصاً (بدون أي حروف عربية)، ننطقه مباشرة
      if (!/[\u0600-\u06FF]/.test(en)) {
        speakEn(en, onDone);
        return;
      }

      // الحل الجديد: النص مختلط (إنجليزي + اسم عربي)
      // تقسيم النص إلى مقاطع
      const parts = en.split(ARABIC_RUN_RE);
      
      const chunks = parts
        .map((part) => ({
          text: part.trim(),
          isArabic: /[\u0600-\u06FF]/.test(part),
        }))
        // فلترة المقاطع الفارغة أو التي تحتوي على علامات ترقيم فقط
        .filter((chunk) => /[\p{L}\p{N}]/u.test(chunk.text));

      if (chunks.length === 0) {
        onDone?.();
        return;
      }

      // إلغاء أي نطق سابق قبل بدء الطابور الجديد
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      let currentIndex = 0;
      
      const playNext = () => {
        if (currentIndex >= chunks.length) {
          if (mountedRef.current) setEnSpeaking(false);
          onDone?.();
          return;
        }

        const chunk = chunks[currentIndex];
        currentIndex++;

        if (chunk.isArabic) {
          // المقطع العربي: يستخدم نبرة الشخصية العربية
          arabic.speak(chunk.text, playNext);
        } else {
          // المقطع الإنجليزي: يستخدم نبرة الشخصية الإنجليزية
          speakEn(chunk.text, playNext);
        }
      };

      // بدء تشغيل الطابور
      playNext();
    },
    [arabic.speak, speakEn], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const stop = useCallback(() => {
    arabic.stop();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (mountedRef.current) setEnSpeaking(false);
  }, [arabic.stop]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    speak,
    stop,
    isSpeaking: arabic.isSpeaking || enSpeaking,
    isSupported: arabic.isSupported,
  };
}

export default useGameVoice;
// ✅ [Fix Mixed AR/EN] — تقسيم الجمل المختلطة (إنجليزي + اسم عربي) لضمان نطق الاسم بالصوت العربي والجملة بالإنجليزي، مع الحفاظ على نبرة الشخصية.