// src/components/flash/flashI18n.ts
// 🌐 أدوات ترجمة Flash: شارات الخطوات + نص النطق حسب اللغة
import { translateDynamic } from '@/utils/translateDynamic';
import { sanitizeForSpeech } from '@/hooks/useReadAloud';
import type { FlashStep } from './types';

const AR_RE = /[\u0600-\u06FF]/;
export const FLASH_AR_RATE = 0.7; // كما كان
export const FLASH_EN_RATE = 0.8;

/** يترجم أسطر الشارة (العربية فقط) — الرياضيات الخالصة تبقى كما هي */
export function tBadgeLines(lines: string[], lang: string): string[] {
  if (lang !== 'en') return lines;
  return lines.map((l) =>
    AR_RE.test(l) ? translateDynamic({ text: l }, 'en', 'text') : l,
  );
}

/** نص + لغة + سرعة النطق للخطوة */
export function buildFlashSpeech(
  step: FlashStep,
  lang: string,
): { text: string; lang: string; rate: number } {
  if (lang !== 'en') {
    return { text: step.ttsText, lang: 'ar-SA', rate: FLASH_AR_RATE };
  }
  // الإنجليزية: أسطر الشارة الخالية من العربية (رياضيات + مصطلحات مترجمة)
  const lines = tBadgeLines(step.badgeLines, 'en').filter((l) => !AR_RE.test(l));
  let text = sanitizeForSpeech(lines.join('\n'), 'en');
  if (!text) {
    const cap = translateDynamic(step, 'en', 'caption');
    text = AR_RE.test(cap) ? '' : sanitizeForSpeech(cap.replace(/·/g, ','), 'en');
  }
  return { text, lang: 'en-US', rate: FLASH_EN_RATE };
}
