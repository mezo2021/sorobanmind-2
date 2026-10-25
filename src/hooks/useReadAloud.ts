// src/hooks/useReadAloud.ts
// 🎙️ قراءة النصوص بصوت جهاز المتصفح (TTS) — بلا مكتبات خارجية
// - يبحث عن صوت نسائي (عربي/إنجليزي) وإلا يستخدم الصوت الافتراضي للغة
// - ينظّف النص من الإيموجي والأسهم والنقاط والرموز المزعجة قبل النطق
// - يوقف الصوت فورًا عند الضغط مرة ثانية، وعند مغادرة الشاشة (cleanup)

import { useCallback, useEffect, useRef, useState } from 'react';
import { toLatinDigits } from '@/utils/numberStyle';

export type ReadLang = 'ar' | 'en';

// ═══════════════════════════════════════════════════════════
// 🧹 تنظيف النص قبل النطق
// ═══════════════════════════════════════════════════════════

const WORDS = {
  ar: { plus: ' زائد ', minus: ' ناقص ', times: ' ضرب ', div: ' قسمة ', eq: ' يساوي ' },
  en: { plus: ' plus ', minus: ' minus ', times: ' times ', div: ' divided by ', eq: ' equals ' },
} as const;

let EMOJI_RE: RegExp | null = null;
try {
  // يمنع خطأ البناء على أهداف TS القديمة (لا property escapes ثابتة)
  // eslint-disable-next-line no-misleading-character-class
  EMOJI_RE = new RegExp(
    '[\\p{Extended_Pictographic}\\p{Emoji_Presentation}\\u200D\\uFE0E\\uFE0F\\u20E3\\u{1F1E6}-\\u{1F1FF}\\u{1F3FB}-\\u{1F3FF}]',
    'gu',
  );
} catch {
  // eslint-disable-next-line no-misleading-character-class
  EMOJI_RE = /[\u2190-\u21FF\u2300-\u23FF\u2600-\u27BF\u2900-\u29FF\u2B00-\u2BFF\uFE0E\uFE0F\u200D\u20E3]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g;
}

// أسهم وأشكال هندسية وعلامات تعداد
const ARROWS_RE = /[\u2190-\u21FF\u27F0-\u27FF\u2900-\u297F\u2B00-\u2BFF\u25A0-\u25FF]/g;
const BULLETS_RE = /[•●○◦▪▫‣⁃∙·]/g;

export function sanitizeForSpeech(raw: string, lang: ReadLang): string {
  if (!raw) return '';
  const w = WORDS[lang];
  let t = toLatinDigits(raw);

  // الإيموجي والأسهم والنقاط
  if (EMOJI_RE) t = t.replace(EMOJI_RE, ' ');
  t = t.replace(ARROWS_RE, ' ').replace(BULLETS_RE, ' ');

  // الرموز الرياضية → كلمات منطوقة
  t = t
    .replace(/\+/g, w.plus)
    .replace(/[×✖xX](?=\s*\d)/g, (m, off: number, s: string) => (/\d\s*$/.test(s.slice(0, off)) ? w.times : m))
    .replace(/[÷]/g, w.div)
    // إصلاح: نطق "ناقص" فقط إذا كانت الشرطة بين رقمين (عملية حسابية)
    .replace(/(\d)\s*[−–—-]\s*(\d)/g, `$1${w.minus}$2`)
    // إصلاح: استبدال الشرطات بين الكلمات بفاصلة للوقفة
    .replace(/\s+[−–—-]\s+/g, ' ، ')
    .replace(/=/g, w.eq);

  // رموز مزعجة أخرى تُحذف
  // eslint-disable-next-line no-useless-escape
  t = t.replace(/[≤≥≠≈<>|~^*#_`\\/{}\[\]()«»"“”]/g, ' ');

  // أسطر جديدة → وقفة، ثم ضغط المسافات
  t = t
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => (/[.!?؟:،,;…]$/.test(l) ? l : l + '.'))
    .join(' ');

  return t.replace(/\s+/g, ' ').replace(/\s+([.,!?؟،:;])/g, '$1').trim();
}

/** هل النص صالح للنطق بهذه اللغة؟ (يمنع قراءة العربي بصوت إنجليزي) */
export function isSpeakableIn(text: string, lang: ReadLang): boolean {
  if (!text) return false;
  const ar = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const la = (text.match(/[A-Za-z]/g) || []).length;
  return lang === 'ar' ? ar > 0 : la > 0 && la >= ar;
}

// ═══════════════════════════════════════════════════════════
// 👩 اختيار صوت نسائي
// ═══════════════════════════════════════════════════════════

const FEMALE_HINTS: Record<ReadLang, string[]> = {
  ar: ['hala', 'zariyah', 'female', 'laila', 'salma', 'amira', 'mariam', 'noura'],
  en: ['samantha', 'zira', 'victoria', 'female', 'karen', 'moira', 'tessa', 'susan', 'allison', 'ava', 'serena', 'fiona', 'google us english', 'google uk english female'],
};
const MALE_HINTS = ['maged', 'majed', 'tarik', 'naayf', 'hamed', 'male', 'david', 'mark', 'daniel', 'alex', 'fred'];

export function pickFemaleVoice(
  voices: SpeechSynthesisVoice[],
  lang: ReadLang,
): SpeechSynthesisVoice | null {
  const code = lang === 'ar' ? 'ar' : 'en';
  const pool = voices.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(code));
  if (pool.length === 0) return null;

  const name = (v: SpeechSynthesisVoice) => v.name.toLowerCase();
  const isMale = (v: SpeechSynthesisVoice) => MALE_HINTS.some((h) => name(v).includes(h) && !name(v).includes('female'));

  for (const hint of FEMALE_HINTS[lang]) {
    const hit = pool.find((v) => name(v).includes(hint) && !isMale(v));
    if (hit) return hit;
  }
  // لا صوت نسائي معروف → الافتراضي للغة (تفضيل ar-SA / en-US)
  const preferred = lang === 'ar' ? 'ar-sa' : 'en-us';
  return (
    pool.find((v) => v.lang.toLowerCase().replace('_', '-') === preferred && !isMale(v)) ||
    pool.find((v) => v.default && !isMale(v)) ||
    pool.find((v) => !isMale(v)) ||
    pool[0]
  );
}

/** تقطيع النص إلى مقاطع قصيرة (يتفادى توقف المتصفح في النصوص الطويلة) */
function chunkText(text: string, max = 180): string[] {
  const sentences = text.match(/[^.!?؟]+[.!?؟]*/g) || [text];
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if ((cur + ' ' + s).trim().length > max && cur) {
      chunks.push(cur.trim());
      cur = s;
    } else {
      cur = (cur + ' ' + s).trim();
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

// ═══════════════════════════════════════════════════════════
// 🪝 الهوك
// ═══════════════════════════════════════════════════════════

export function useReadAloud(lang: ReadLang) {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const tokenRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    if (!supported) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => {
      mountedRef.current = false;
      tokenRef.current++;
      window.speechSynthesis.removeEventListener?.('voiceschanged', load);
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    tokenRef.current++;
    window.speechSynthesis.cancel();
    if (mountedRef.current) setSpeakingKey(null);
  }, [supported]);

  const speak = useCallback(
    (rawText: string, key: string) => {
      if (!supported) return;
      const text = sanitizeForSpeech(rawText, lang);
      if (!text) return;

      window.speechSynthesis.cancel();
      const myToken = ++tokenRef.current;
      setSpeakingKey(key);

      if (voicesRef.current.length === 0) voicesRef.current = window.speechSynthesis.getVoices();
      const voice = pickFemaleVoice(voicesRef.current, lang);
      const chunks = chunkText(text);

      const playAt = (i: number) => {
        if (myToken !== tokenRef.current) return;
        if (i >= chunks.length) {
          if (mountedRef.current) setSpeakingKey(null);
          return;
        }
        const u = new SpeechSynthesisUtterance(chunks[i]);
        u.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
        if (voice) u.voice = voice;
        u.rate = lang === 'ar' ? 0.9 : 0.95;
        u.pitch = 1.05;
        u.onend = () => playAt(i + 1);
        u.onerror = () => {
          if (myToken === tokenRef.current && mountedRef.current) setSpeakingKey(null);
        };
        window.speechSynthesis.speak(u);
      };
      playAt(0);
    },
    [supported, lang],
  );

  /** ضغطة أولى تقرأ، ضغطة ثانية على نفس الزر توقف فورًا */
  const toggle = useCallback(
    (rawText: string, key: string) => {
      if (speakingKey === key) {
        stop();
      } else {
        speak(rawText, key);
      }
    },
    [speakingKey, speak, stop],
  );

  return { isSupported: supported, speakingKey, isSpeaking: speakingKey !== null, speak, toggle, stop };
}

export default useReadAloud;