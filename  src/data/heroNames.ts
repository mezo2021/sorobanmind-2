// src/data/heroNames.ts
export interface HeroName {
  key: string;
  nameAr: string;
  nameEn: string;
  emoji: string;
}

export const HERO_NAMES: HeroName[] = [
  { key: 'falcon',   nameAr: 'الصقر',    nameEn: 'Falcon',   emoji: '🦅' },
  { key: 'eagle',    nameAr: 'النسر',    nameEn: 'Eagle',    emoji: '🪶' },
  { key: 'lion',     nameAr: 'الأسد',    nameEn: 'Lion',     emoji: '🦁' },
  { key: 'tiger',    nameAr: 'النمر',    nameEn: 'Tiger',    emoji: '🐯' },
  { key: 'wolf',     nameAr: 'الذئب',    nameEn: 'Wolf',     emoji: '🐺' },
  { key: 'fox',      nameAr: 'الثعلب',   nameEn: 'Fox',      emoji: '🦊' },
  { key: 'bear',     nameAr: 'الدب',     nameEn: 'Bear',     emoji: '🐻' },
  { key: 'owl',      nameAr: 'البومة',   nameEn: 'Owl',      emoji: '🦉' },
  { key: 'star',     nameAr: 'النجم',    nameEn: 'Star',     emoji: '⭐' },
  { key: 'moon',     nameAr: 'القمر',    nameEn: 'Moon',     emoji: '🌙' },
  { key: 'sun',      nameAr: 'الشمس',    nameEn: 'Sun',      emoji: '☀️' },
  { key: 'comet',    nameAr: 'الشهاب',   nameEn: 'Comet',    emoji: '☄️' },
  { key: 'meteor',   nameAr: 'النيزك',   nameEn: 'Meteor',   emoji: '🌠' },
  { key: 'dragon',   nameAr: 'التنين',   nameEn: 'Dragon',   emoji: '🐉' },
  { key: 'phoenix',  nameAr: 'الفينيق',  nameEn: 'Phoenix',  emoji: '🔥' },
  { key: 'knight',   nameAr: 'الفارس',   nameEn: 'Knight',   emoji: '🛡️' },
  { key: 'ninja',    nameAr: 'النينجا',  nameEn: 'Ninja',    emoji: '🥷' },
  { key: 'wizard',   nameAr: 'الساحر',   nameEn: 'Wizard',   emoji: '🧙' },
  { key: 'rocket',   nameAr: 'الصاروخ',  nameEn: 'Rocket',   emoji: '🚀' },
  { key: 'shield',   nameAr: 'الدرع',    nameEn: 'Shield',   emoji: '🛡️' },
  { key: 'sword',    nameAr: 'السيف',    nameEn: 'Sword',    emoji: '⚔️' },
  { key: 'arrow',    nameAr: 'السهم',    nameEn: 'Arrow',    emoji: '🏹' },
  { key: 'crown',    nameAr: 'التاج',    nameEn: 'Crown',    emoji: '👑' },
  { key: 'gem',      nameAr: 'الجوهرة',  nameEn: 'Gem',      emoji: '💎' },
  { key: 'diamond',  nameAr: 'الماسة',   nameEn: 'Diamond',  emoji: '💎' },
  { key: 'pearl',    nameAr: 'اللؤلؤة',  nameEn: 'Pearl',    emoji: '🦪' },
  { key: 'ocean',    nameAr: 'المحيط',   nameEn: 'Ocean',    emoji: '🌊' },
  { key: 'forest',   nameAr: 'الغابة',   nameEn: 'Forest',   emoji: '🌲' },
  { key: 'mountain', nameAr: 'الجبل',    nameEn: 'Mountain', emoji: '🏔️' },
  { key: 'storm',    nameAr: 'العاصفة',  nameEn: 'Storm',    emoji: '⚡' },
];

export function getHeroName(key: string): HeroName | undefined {
  return HERO_NAMES.find((h) => h.key === key);
}

export function getHeroDisplayName(key: string, lang: 'ar' | 'en' = 'ar'): string {
  const hero = getHeroName(key);
  if (!hero) return lang === 'ar' ? 'بطل' : 'Hero';
  return lang === 'ar' ? hero.nameAr : hero.nameEn;
}