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
  
  // استخدام محرك الصوت المدمج في المتصفح مباشرة
  if ('speechSynthesis' in window) {
    // إيقاف أي صوت يعمل حالياً
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(preparedText);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.9; // سرعة مناسبة للأطفال
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.error("متصفحك لا يدعم النطق الصوتي");
  }
}
// update