// src/hooks/useGameVoice.ts
// 🎭 صوت شخصيات الألعاب بلغتين — استبدال مباشر لاسم الطفل (100% مضمون)

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CharacterType } from '../types';
import { useCharacterVoice, VOICE_CONFIG } from './useCharacterVoice';
import { useLangStore } from '@/i18n/useTranslation';
import { sanitizeForSpeech } from './useReadAloud';
import { useProgressStore } from '@/store/progressStore'; // <-- أضفنا هذا

// قاموس النطق
const NAME_PRONUNCIATIONS: Record<string, string> = {
  "محمد": "Mohammed", "أحمد": "Ahmed", "محمود": "Mahmoud", "مصطفى": "Mustafa", "عمر": "Omar", "عمرو": "Amr", "علي": "Ali", "حسن": "Hassan", "حسين": "Hussein", "حامد": "Hamed", "حمزة": "Hamza", "خالد": "Khaled", "وليد": "Waleed", "سعيد": "Saeed", "سعد": "Saad", "سلمان": "Salman", "سليمان": "Sulaiman", "يوسف": "Yusuf", "يونس": "Younes", "إبراهيم": "Ibrahim", "اسماعيل": "Ismail", "إسماعيل": "Ismail", "إسحاق": "Ishaq", "يعقوب": "Yacoub", "آدم": "Adam", "نوح": "Noah", "إدريس": "Idris", "أيوب": "Ayyub", "زكريا": "Zakariya", "يحيى": "Yahya", "داود": "Dawood", "طارق": "Tariq", "مازن": "Mazen", "رامي": "Rami", "سامر": "Samer", "سمير": "Samir", "كريم": "Karim", "نبيل": "Nabil", "جمال": "Jamal", "جلال": "Jalal", "فارس": "Fares", "فادي": "Fadi", "فؤاد": "Fuad", "زياد": "Ziad", "رياض": "Riyad", "أنس": "Anas", "أمير": "Amir", "أكرم": "Akram", "باسم": "Bassem", "باسل": "Basil", "بلال": "Bilal", "تامر": "Tamer", "ثامر": "Thamer", "جابر": "Jaber", "حازم": "Hazem", "حكيم": "Hakim", "خليل": "Khalil", "راشد": "Rashid", "رائد": "Raed", "رشيد": "Rashid", "رضا": "Reda", "عادل": "Adel", "عاصم": "Asim", "عمار": "Ammar", "عيسى": "Isa", "غسان": "Ghassan", "قاسم": "Qasim", "قصي": "Qusai", "لؤي": "Luay", "مروان": "Marwan", "منصور": "Mansour", "مهند": "Muhannad", "نادر": "Nader", "ناصر": "Nasser", "نايف": "Naif", "هاشم": "Hashem", "هاني": "Hani", "هيثم": "Haitham", "وائل": "Wael", "وسيم": "Waseem", "يزن": "Yazan", "ياسر": "Yasser", "ياسين": "Yaseen", "بدر": "Badr", "براء": "Baraa", "جواد": "Jawad", "رعد": "Raad", "شادي": "Shadi", "صالح": "Saleh", "صهيب": "Suhaib", "ضياء": "Dia", "عروة": "Urwa", "معاذ": "Muadh", "معتز": "Moataz", "منذر": "Munther", "نواف": "Nawaf",
  "سارة": "Sarah", "ساره": "Sarah", "مريم": "Mariam", "فاطمة": "Fatima", "عائشة": "Aisha", "خديجة": "Khadija", "زينب": "Zainab", "رقية": "Ruqayya", "حفصة": "Hafsa", "آمنة": "Amina", "أمينة": "Amina", "أمل": "Amal", "امل": "Amal", "نور": "Noor", "نورا": "Noura", "نورة": "Noura", "هدى": "Huda", "منى": "Mona", "مي": "Mai", "ريم": "Reem", "رنا": "Rana", "دانا": "Dana", "دينا": "Dina", "لينا": "Lina", "ليلى": "Layla", "ليلا": "Laila", "لمى": "Lama", "لارا": "Lara", "هنا": "Hana", "هناء": "Hanaa", "هبة": "Heba", "حنان": "Hanan", "حنين": "Haneen", "دعاء": "Duaa", "دلال": "Dalal", "جنى": "Jana", "جود": "Joud", "جوري": "Jouri", "جميلة": "Jamila", "حلا": "Hala", "حياة": "Hayat", "رحمة": "Rahma", "رغد": "Raghad", "روان": "Rawan", "روضة": "Rawda", "سلمى": "Salma", "سما": "Sama", "سمية": "Sumaya", "سندس": "Sundus", "شهد": "Shahd", "شذى": "Shatha", "صفاء": "Safa", "ضحى": "Duha", "عبير": "Abeer", "غادة": "Ghada", "غلا": "Ghala", "فرح": "Farah", "فريدة": "Farida", "كارما": "Karma", "لانا": "Lana", "لجين": "Lujain", "لورا": "Laura", "ميس": "Mais", "ميساء": "Maysaa", "ملك": "Malak", "مها": "Maha", "مودة": "Mawadda", "ميار": "Mayar", "نادين": "Nadine", "نادية": "Nadia", "نسرين": "Nisreen", "نسمة": "Nesma", "نهى": "Noha", "هالة": "Hala", "هديل": "Hadeel", "يارا": "Yara", "ياسمين": "Yasmin", "بيان": "Bayan", "تالا": "Tala", "تسنيم": "Tasneem", "تمارا": "Tamara", "جمانة": "Jumana", "حور": "Hoor", "ديمة": "Dima", "ريتاج": "Ritaj", "رزان": "Razan", "رفيف": "Rafeef", "سجى": "Saja", "سلسبيل": "Salsabil", "شام": "Sham", "علا": "Ola", "عهد": "Ahed", "لما": "Lama", "ميرا": "Mira", "نغم": "Nagham", "وتين": "Wateen", "يقين": "Yaqeen",
  "إسلام": "Islam", "رضوان": "Radwan", "جهاد": "Jihad", "إحسان": "Ihsan", "ميزو": "Mezo"
};

function normalizeArabicName(name: string): string {
  return name.normalize("NFC").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").trim();
}

const NORMALIZED_NAME_PRONUNCIATIONS: Record<string, string> = Object.create(null);
for (const [name, pronunciation] of Object.entries(NAME_PRONUNCIATIONS)) {
  NORMALIZED_NAME_PRONUNCIATIONS[normalizeArabicName(name)] = pronunciation;
}

const FALLBACK_TRANSLITERATION: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "aa", "ٱ": "a", "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "th", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "oo", "ي": "ee", "ى": "a", "ة": "a", "ء": "", "ؤ": "o", "ئ": "e", "پ": "p", "چ": "ch", "گ": "g",
};

function transliterateBlock(block: string): string {
  return Array.from(block).map((char) => {
    if (/\s/.test(char)) return " ";
    return FALLBACK_TRANSLITERATION[normalizeArabicName(char)] ?? char;
  }).join("");
}

const ARABIC_LETTER = "[\\u0621-\\u063A\\u0641-\\u064A\\u066E-\\u06D3\\u0750-\\u077F\\u08A0-\\u08FF][\\u064B-\\u065F\\u0670\\u0640]*";
const ARABIC_NAME_BLOCK = new RegExp(`${ARABIC_LETTER}(?:\\s+${ARABIC_LETTER})*`, "gu");

function extractAndTranslateFirstName(text: string): string {
  return text.replace(ARABIC_NAME_BLOCK, (block) => {
    const words = block.trim().split(/\s+/);
    const firstName = words[0];
    if (!firstName) return block;
    const normalized = normalizeArabicName(firstName);
    const knownName = NORMALIZED_NAME_PRONUNCIATIONS[normalized];
    if (knownName) return knownName;
    return transliterateBlock(block);
  });
}

const EN_FEMALE_HINTS = ['female', 'samantha', 'zira', 'victoria', 'karen', 'moira', 'tessa', 'susan', 'allison', 'ava', 'serena', 'fiona', 'jenny', 'aria', 'google us english', 'google uk english female'];
const EN_MALE_HINTS = ['male', 'david', 'mark', 'daniel', 'alex', 'fred', 'guy', 'george', 'tom', 'google uk english male'];

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
          u.pitch = config.preferGender === 'male' ? Math.max(0.1, config.pitch - 0.15) : Math.min(2, config.pitch + 0.15);
        }
      }

      u.onstart = () => { if (mountedRef.current) setEnSpeaking(true); };
      u.onend = () => { if (mountedRef.current) setEnSpeaking(false); onDone?.(); };
      u.onerror = () => { if (mountedRef.current) setEnSpeaking(false); onDone?.(); };
      window.speechSynthesis.speak(u);
    },
    [character],
  );

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      const lang = useLangStore.getState().lang;

      // المسار العربي: يبقى كما هو تماماً دون أي تغيير
      if (lang !== 'en') {
        arabic.speak(text, onDone);
        return;
      }

      let finalEn = text;

      // 🎯 الخطة النووية: استبدال الاسم مباشرة من المتجر
      const childName = useProgressStore.getState().childName?.trim();
      if (childName) {
        // نأخذ الاسم الأول فقط
        const firstName = childName.split(/\s+/)[0];
        const normalized = normalizeArabicName(firstName);
        const translatedName = NORMALIZED_NAME_PRONUNCIATIONS[normalized] || transliterateBlock(firstName);
        
        // نستبدل الاسم الثلاثي بالكامل بالاسم الأول المترجم
        const escapedName = childName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        finalEn = finalEn.replace(new RegExp(escapedName, 'g'), translatedName);
      }

      // التخلص من أي بقايا عربية أخرى (مثل كلمة "يا بطل" إن وجدت)
      finalEn = extractAndTranslateFirstName(finalEn);

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