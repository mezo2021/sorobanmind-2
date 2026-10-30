// src/utils/ttsService.ts

const MANUAL_CORRECTIONS: Record<string, string> = {
  "السوروبان": "السُّورُوبَان",
  "سوروبان": "سُورُوبَان",
  "نُقش": "نُقِشَ",
  "دقّوا": "دَقُّوا",
  "مبتسماً": "مُبْتَسِمًا",
};

function prepareForTTS(text: string, lang: 'ar' | 'en'): string {
  if (!text) return "";
  let processed = text;
  if (lang === 'ar') {
    processed = processed
      .replace(/—/g, "،")
      .replace(/\s*:\s*/g, ": ")
      .replace(/\s*،\s*/g, "، ")
      .replace(/\s*\.\s*/g, ". ")
      .replace(/\s+/g, " ")
      .trim();
    for (const [wrong, correct] of Object.entries(MANUAL_CORRECTIONS)) {
      processed = processed.replace(new RegExp(wrong, 'g'), correct);
    }
  }
  return processed;
}

export async function speak(text: string, lang: 'ar' | 'en'): Promise<void> {
  const preparedText = prepareForTTS(text, lang);
  const voiceName = lang === 'ar' ? 'ar-SA-HamedNeural' : 'en-US-AriaNeural';

  try {
    // @ts-expect-error: CDN dynamic import
    const module = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@kingdanx/edge-tts-browser@1.0.1/dist/edge-tts-browser.es.js');
    const tts = new module.EdgeTTSBrowser();
    await tts.tts.speak(preparedText, { voice: voiceName, rate: 0.9 });
  } catch (error) {
    console.error("TTS failed, using fallback:", error);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(preparedText);
      utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
}