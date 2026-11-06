// src/components/games/MentalArchivesGame/ui/chapterThemes.ts
// هوية بصرية وقصصية لكل مستوى: موقع، لون، شعار، سطر افتتاحي.
export interface ChapterTheme {
  accent: string;
  accent2: string;
  emoji: string;
  placeAr: string;
  placeEn: string;
  taglineAr: string;
  taglineEn: string;
}

const DEFAULT: ChapterTheme = {
  accent: '#6366f1', accent2: '#a855f7', emoji: '🌀',
  placeAr: 'ممر الثقب الدودي', placeEn: 'The Wormhole Passage',
  taglineAr: 'الزمن يناديك…', taglineEn: 'Time is calling you…',
};

export const CHAPTER_THEMES: Record<string, ChapterTheme> = {
  intro: { ...DEFAULT, emoji: '🌌', placeAr: 'بوابة الأرشيف', placeEn: 'The Archive Gate', taglineAr: 'هنا تبدأ الرحلة عبر الزمن', taglineEn: 'Where the journey through time begins' },
  
  level1: { accent: '#f59e0b', accent2: '#b45309', emoji: '🏺', placeAr: 'إبلا ومَاري — ألواح الطين', placeEn: 'Ebla & Mari — Clay Tablets', taglineAr: 'الأرقام تتلاشى… أنقذوها!', taglineEn: 'The numbers are fading… save them!' },
  
  level2: { accent: '#10b981', accent2: '#0e7490', emoji: '🏛️', placeAr: 'أوغاريت — خزائن الأبجدية', placeEn: 'Ugarit — Vaults of the Alphabet', taglineAr: 'خمسةٌ تُنادي صديقها', taglineEn: 'Five calls for its friend' },
  
  level3: { accent: '#38bdf8', accent2: '#6366f1', emoji: '🐪', placeAr: 'تدمر — عقدة طريق الحرير', placeEn: 'Palmyra — Silk Road Node', taglineAr: 'سافروا بين الأعداد', taglineEn: 'Travel between the numbers' },
  
  level4: { accent: '#f43f5e', accent2: '#9333ea', emoji: '🧮', placeAr: 'الصين واليابان — أصل السوروبان', placeEn: 'China & Japan — Soroban Origin', taglineAr: 'إتقان الخانات العشر', taglineEn: 'Mastering the ten columns' },
  
  level5: { accent: '#a855f7', accent2: '#2563eb', emoji: '⚓', placeAr: 'اللاذقية — مرافئ الحساب', placeEn: 'Latakia — Harbors of Math', taglineAr: 'الطيف الصفري يقترب', taglineEn: 'The Zero Spectrum draws near' },
  
  level6: { accent: '#22d3ee', accent2: '#0ea5e9', emoji: '🕌', placeAr: 'دمشق — سوق النحاسين', placeEn: 'Damascus — Copper Market', taglineAr: 'أصفارٌ في قلب الحساب', taglineEn: 'Zeros in the heart of math' },
  
  level7: { accent: '#eab308', accent2: '#dc2626', emoji: '🌐', placeAr: 'شبكة النور — سوريا 2125', placeEn: 'Network of Light — Syria 2125', taglineAr: 'تألّق في شبكة الأرقام', taglineEn: 'Shine in the number network' },
  
  level8: { accent: '#ec4899', accent2: '#f59e0b', emoji: '💜', placeAr: 'القلب — بوابة الثقب الدودي', placeEn: 'The Heart — Wormhole Gate', taglineAr: 'التحدي الأخير', taglineEn: 'The final challenge' },
};

export const getTheme = (id: string): ChapterTheme => CHAPTER_THEMES[id] ?? DEFAULT;