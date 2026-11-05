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
  level2: { accent: '#10b981', accent2: '#0e7490', emoji: '🏛️', placeAr: 'ميزوبوتاميا — خزائن الذاكرة', placeEn: 'Mesopotamia — Memory Vaults', taglineAr: 'خمسةٌ تُنادي صديقها', taglineEn: 'Five calls for its friend' },
  level3: { accent: '#38bdf8', accent2: '#6366f1', emoji: '⛵', placeAr: 'الفينيقيون — موانئ الحساب', placeEn: 'The Phoenicians — Harbors of Math', taglineAr: 'أبحروا بين الأعداد', taglineEn: 'Sail between the numbers' },
  level4: { accent: '#f43f5e', accent2: '#9333ea', emoji: '🗿', placeAr: 'وادي النيل — محراب الأهرام', placeEn: 'Nile Valley — Pyramid Sanctum', taglineAr: 'أسرار العشرة العملاقة', taglineEn: 'Secrets of the giant ten' },
  level5: { accent: '#a855f7', accent2: '#2563eb', emoji: '🔮', placeAr: 'قاعة الأطياف', placeEn: 'Hall of Spectra', taglineAr: 'الطيف الصفري يقترب', taglineEn: 'The Zero Spectrum draws near' },
  level6: { accent: '#22d3ee', accent2: '#0ea5e9', emoji: '⚙️', placeAr: 'ورشة تروس الزمن', placeEn: 'Workshop of Time Gears', taglineAr: 'أدِر العجلة بسرعة', taglineEn: 'Spin the dial fast' },
  level7: { accent: '#eab308', accent2: '#dc2626', emoji: '🌠', placeAr: 'مجرّة العمالقة', placeEn: 'Galaxy of Giants', taglineAr: 'الضرب بخطوة العمالقة', taglineEn: 'Multiply with giant steps' },
  level8: { accent: '#ec4899', accent2: '#f59e0b', emoji: '👑', placeAr: 'عرش الثقب الدودي', placeEn: 'Throne of the Wormhole', taglineAr: 'التحدي الأخير', taglineEn: 'The final challenge' },
};

export const getTheme = (id: string): ChapterTheme => CHAPTER_THEMES[id] ?? DEFAULT;
