// src/utils/ttsService.ts
// @ts-expect-error
import { EdgeTTSBrowser } from 'https://cdn.jsdelivr.net/npm/@kingdanx/edge-tts-browser@1.0.1/dist/edge-tts-browser.es.js';

// قاموس لتصحيح الكلمات الحرجة (يمكنك التوسع فيه)
const MANUAL_CORRECTIONS: Record<string, string> = {
  "السوروبان": "السُّورُوبَان",
  "سوروبان": "سُورُوبَان",
  "نُقش": "نُقِشَ",
  "دقّوا": "دَقُّوا",
  "مبتسماً": "مُبْتَسِمًا",
};

// دالة تحسين النص قبل إرساله للمحرك
function prepareForTTS(text: string, lang: 'ar' | 'en'): string {
  if (!text) return "";
  let processed = text;
  if (lang === 'ar') {
    // استبدال الرموز المسببة للوقفات الغريبة
    processed = processed
      .replace(/—/g, "،")
      .replace(/\s*:\s*/g, ": ")
      .replace(/\s*،\s*/g, "، ")
      .replace(/\s*\.\s*/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    // تطبيق التصحيحات اليدوية
    for (const [wrong, correct] of Object.entries(MANUAL_CORRECTIONS)) {
      processed = processed.replace(new RegExp(wrong, 'g'), correct);
    }
  }
  return processed;
}

// دالة التشغيل الرئيسية
export async function speak(text: string, lang: 'ar' | 'en'): Promise<void> {
  const preparedText = prepareForTTS(text, lang);
  const voiceName = lang === 'ar' ? 'ar-SA-HamedNeural' : 'en-US-AriaNeural';

  const tts = new EdgeTTSBrowser();
  try {
    await tts.tts.speak(preparedText, { voice: voiceName, rate: 0.9 });
  } catch (error) {
    console.error("TTS failed:", error);
    // في حال فشل Edge TTS، نعود إلى Web Speech API كاحتياط
    fallbackToWebSpeech(preparedText, lang);
  }
}

// دالة احتياطية تعمل بدون إنترنت (أو إذا فشلت المكتبة)
function fallbackToWebSpeech(text: string, lang: 'ar' | 'en') {
  if (!('speechSynthesis' in window)) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}