// src/components/games/MentalArchivesGame/gameUI.ts
import { useLangStore } from '@/i18n/useTranslation';

export const UI_TEXT = {
  // أزرار عامة
  confirmAnswer: { ar: 'تأكيد الإجابة', en: 'Confirm' },
  next: { ar: 'التالي', en: 'Next' },
  back: { ar: 'رجوع', en: 'Back' },
  retry: { ar: 'تحدي جديد', en: 'Retry' },
  review: { ar: 'مراجعة الشرح', en: 'Review' },
  
  // شاشات الانتقال
  startJourney: { ar: '▶️ اضغط لبدء الرحلة', en: '▶️ Press to Start' },
  skipIntro: { ar: 'تخطي المقدمة', en: 'Skip Intro' },
  continueStory: { ar: 'متابعة الحكاية', en: 'Continue Story' },
  showFullText: { ar: 'عرض النص كاملاً', en: 'Show Full Text' },
  
  // شاشة المثال
  listenToExplanation: { ar: 'اسمع الشرح', en: 'Listen to explanation' },
  stopAudio: { ar: 'إيقاف الصوت', en: 'Stop audio' },
  readyForChallenge: { ar: 'أنا مستعد للتحدي', en: 'Ready for Challenge' },
  
  // شاشة التحدي
  question: { ar: 'السؤال', en: 'Q' },
  digitalTablet: { ar: 'لوح طيني رقمي', en: 'Digital Tablet' },
  archSpeedChallenge: { ar: 'تحدي السرعة الأثرية', en: 'Speed Challenge' },
  
  // رسائل النجاح والفشل
  needMoreSpeed: { ar: 'تحتاج إلى مزيد من السرعة!', en: 'Need More Speed!' },
  needMoreSpeedDesc: { 
    ar: 'تَحْتَاجُ إِلَى مَزِيدٍ مِنَ السُّرْعَةِ لِلِامْتِحَان، تَدَرَّبْ جَيِّداً لِتَكُونَ جَاهِزاً.', 
    en: 'You need more speed for the exam, practice well to be ready.' 
  },
  successMsg: { ar: 'ٍعَبَرْتَ البوابةَ بنجاح!', en: 'Gate Crossed!' },
  returnToGames: { ar: 'العودة لمدينة الألعاب', en: 'Return to Games' },
  
  // عام
  champion: { ar: 'بطل', en: 'Champion' },
  archiveGuide: { ar: 'مرشد زمني', en: 'Archive Guide' },
  correct: { ar: 'إِجَابَةٌ صَحِيحَة!', en: 'Correct answer!' },
  wrong: { ar: 'إِجَابَةٌ خَاطِئَة، حَاوِلْ أَسْرَع.', en: 'Wrong answer, try faster.' },
};

export type UIKey = keyof typeof UI_TEXT;

// دالة الترجمة للواجهات
export function tUI(key: UIKey): string {
  const lang = useLangStore.getState().lang;
  return UI_TEXT[key][lang === 'en' ? 'en' : 'ar'];
}