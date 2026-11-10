// src/data/avatars.ts

export type AvatarCategory = 'animals' | 'heroes' | 'space' | 'mythical';

export interface AvatarData {
  id: string;       // "rabbit_fast"
  emoji: string;    // "🐰"
  nameAr: string;   // "الأرنب السريع"
  nameEn: string;   // "Fast Rabbit"
  category: AvatarCategory;
}

export const AVATARS: AvatarData[] = [
  // ═══════════════════════════════════════════════════════
  // 30 حيواناً
  // ═══════════════════════════════════════════════════════
  { id: 'lion_brave',       emoji: '🦁', nameAr: 'الأسد الشجاع',      nameEn: 'Brave Lion',       category: 'animals' },
  { id: 'tiger_swift',      emoji: '🐯', nameAr: 'النمر السريع',      nameEn: 'Swift Tiger',      category: 'animals' },
  { id: 'leopard_agile',    emoji: '🐆', nameAr: 'الفهد الرشيق',      nameEn: 'Agile Leopard',    category: 'animals' },
  { id: 'fox_smart',        emoji: '🦊', nameAr: 'الثعلب الذكي',      nameEn: 'Smart Fox',        category: 'animals' },
  { id: 'wolf_wise',        emoji: '🐺', nameAr: 'الذئب الحكيم',      nameEn: 'Wise Wolf',        category: 'animals' },
  { id: 'bear_strong',      emoji: '🐻', nameAr: 'الدب القوي',        nameEn: 'Strong Bear',      category: 'animals' },
  { id: 'panda_calm',       emoji: '🐼', nameAr: 'الباندا الهادئ',    nameEn: 'Calm Panda',       category: 'animals' },
  { id: 'koala_cute',       emoji: '🐨', nameAr: 'الكوالا اللطيف',    nameEn: 'Cute Koala',       category: 'animals' },
  { id: 'rabbit_fast',      emoji: '🐰', nameAr: 'الأرنب السريع',     nameEn: 'Fast Rabbit',      category: 'animals' },
  { id: 'hamster_playful',  emoji: '🐹', nameAr: 'الهامستر المرح',    nameEn: 'Playful Hamster',  category: 'animals' },
  { id: 'mouse_little',     emoji: '🐭', nameAr: 'الفأر الصغير',      nameEn: 'Little Mouse',     category: 'animals' },
  { id: 'squirrel_active',  emoji: '🐿️', nameAr: 'السنجاب النشيط',    nameEn: 'Active Squirrel',  category: 'animals' },
  { id: 'hedgehog_brave',   emoji: '🦔', nameAr: 'القنفذ الشجاع',     nameEn: 'Brave Hedgehog',   category: 'animals' },
  { id: 'bat_night',        emoji: '🦇', nameAr: 'الخفاش الليلي',     nameEn: 'Night Bat',        category: 'animals' },
  { id: 'eagle_mighty',     emoji: '🦅', nameAr: 'النسر الجبار',      nameEn: 'Mighty Eagle',     category: 'animals' },
  { id: 'owl_wise',         emoji: '🦉', nameAr: 'البومة الحكيمة',    nameEn: 'Wise Owl',         category: 'animals' },
  { id: 'parrot_playful',   emoji: '🦜', nameAr: 'الببغاء المرح',     nameEn: 'Playful Parrot',   category: 'animals' },
  { id: 'penguin_cute',     emoji: '🐧', nameAr: 'البطريق اللطيف',    nameEn: 'Cute Penguin',     category: 'animals' },
  { id: 'swan_white',       emoji: '🦢', nameAr: 'البجعة البيضاء',    nameEn: 'White Swan',       category: 'animals' },
  { id: 'peacock_beautiful',emoji: '🦚', nameAr: 'الطاووس الجميل',    nameEn: 'Beautiful Peacock',category: 'animals' },
  { id: 'turtle_calm',      emoji: '🐢', nameAr: 'السلحفاة الهادئة',  nameEn: 'Calm Turtle',      category: 'animals' },
  { id: 'snake_clever',     emoji: '🐍', nameAr: 'الأفعى الذكية',     nameEn: 'Clever Snake',     category: 'animals' },
  { id: 'lizard_fast',      emoji: '🦎', nameAr: 'السحلية السريعة',   nameEn: 'Fast Lizard',      category: 'animals' },
  { id: 'crocodile_strong', emoji: '🐊', nameAr: 'التمساح القوي',     nameEn: 'Strong Crocodile', category: 'animals' },
  { id: 'dolphin_playful',  emoji: '🐬', nameAr: 'الدلفين المرح',     nameEn: 'Playful Dolphin',  category: 'animals' },
  { id: 'whale_giant',      emoji: '🐳', nameAr: 'الحوت العملاق',     nameEn: 'Giant Whale',      category: 'animals' },
  { id: 'shark_brave',      emoji: '🦈', nameAr: 'القرش الشجاع',      nameEn: 'Brave Shark',      category: 'animals' },
  { id: 'octopus_smart',    emoji: '🐙', nameAr: 'الأخطبوط الذكي',    nameEn: 'Smart Octopus',    category: 'animals' },
  { id: 'butterfly_beautiful', emoji: '🦋', nameAr: 'الفراشة الجميلة', nameEn: 'Beautiful Butterfly', category: 'animals' },
  { id: 'bee_busy',         emoji: '🐝', nameAr: 'النحلة النشيطة',    nameEn: 'Busy Bee',         category: 'animals' },

  // ═══════════════════════════════════════════════════════
  // 30 بطلاً
  // ═══════════════════════════════════════════════════════
  { id: 'hero_super',       emoji: '🦸‍♂️', nameAr: 'البطل الخارق',     nameEn: 'Superhero',        category: 'heroes' },
  { id: 'heroine_super',    emoji: '🦸‍♀️', nameAr: 'البطلة الخارقة',   nameEn: 'Superheroine',     category: 'heroes' },
  { id: 'ninja_fast',       emoji: '🥷', nameAr: 'النينجا السريع',    nameEn: 'Fast Ninja',       category: 'heroes' },
  { id: 'wizard_wise',      emoji: '🧙‍♂️', nameAr: 'الساحر الحكيم',    nameEn: 'Wise Wizard',      category: 'heroes' },
  { id: 'witch_wise',       emoji: '🧙‍♀️', nameAr: 'الساحرة الحكيمة',  nameEn: 'Wise Witch',       category: 'heroes' },
  { id: 'knight_brave',     emoji: '🤺', nameAr: 'الفارس الشجاع',     nameEn: 'Brave Fencer',     category: 'heroes' },
  { id: 'astronaut_male',   emoji: '👨‍🚀', nameAr: 'رائد الفضاء',      nameEn: 'Astronaut',        category: 'heroes' },
  { id: 'astronaut_female', emoji: '👩‍🚀', nameAr: 'رائدة الفضاء',     nameEn: 'Astronaut Woman',  category: 'heroes' },
  { id: 'detective_male',   emoji: '🕵️‍♂️', nameAr: 'المحقق الذكي',     nameEn: 'Smart Detective',  category: 'heroes' },
  { id: 'detective_female', emoji: '🕵️‍♀️', nameAr: 'المحققة الذكية',   nameEn: 'Smart Detective Woman', category: 'heroes' },
  { id: 'police_brave',     emoji: '👮‍♂️', nameAr: 'الشرطي الشجاع',    nameEn: 'Brave Police',     category: 'heroes' },
  { id: 'firefighter_male', emoji: '👨‍🚒', nameAr: 'رجل الإطفاء',      nameEn: 'Firefighter',      category: 'heroes' },
  { id: 'firefighter_female', emoji: '👩‍🚒', nameAr: 'امرأة الإطفاء',  nameEn: 'Firefighter Woman',category: 'heroes' },
  { id: 'doctor_male',      emoji: '👨‍⚕️', nameAr: 'الطبيب الحكيم',    nameEn: 'Wise Doctor',      category: 'heroes' },
  { id: 'doctor_female',    emoji: '👩‍⚕️', nameAr: 'الطبيبة الحكيمة',  nameEn: 'Wise Doctor Woman',category: 'heroes' },
  { id: 'teacher_male',     emoji: '👨‍🏫', nameAr: 'المعلم الحكيم',    nameEn: 'Wise Teacher',     category: 'heroes' },
  { id: 'teacher_female',   emoji: '👩‍🏫', nameAr: 'المعلمة الحكيمة',  nameEn: 'Wise Teacher Woman', category: 'heroes' },
  { id: 'student_top',      emoji: '🧑‍🎓', nameAr: 'الطالب المتفوق',   nameEn: 'Top Student',      category: 'heroes' },
  { id: 'coder_smart',      emoji: '🧑‍💻', nameAr: 'المبرمج الذكي',    nameEn: 'Smart Coder',      category: 'heroes' },
  { id: 'artist_male',      emoji: '👨‍🎨', nameAr: 'الفنان المبدع',    nameEn: 'Creative Artist',  category: 'heroes' },
  { id: 'artist_female',    emoji: '👩‍🎨', nameAr: 'الفنانة المبدعة',  nameEn: 'Creative Artist Woman', category: 'heroes' },
  { id: 'archer_precise',   emoji: '🏹', nameAr: 'الرامي الدقيق',     nameEn: 'Precise Archer',   category: 'heroes' },
  { id: 'sword_golden',     emoji: '🗡️', nameAr: 'السيف الذهبي',      nameEn: 'Golden Sword',     category: 'heroes' },
  { id: 'shield_strong',    emoji: '🛡️', nameAr: 'الدرع الحصين',      nameEn: 'Strong Shield',    category: 'heroes' },
  { id: 'crown_king',       emoji: '👑', nameAr: 'الملك الحكيم',      nameEn: 'Wise King',        category: 'heroes' },
  { id: 'muscle_strong',    emoji: '💪', nameAr: 'الذراع القوية',     nameEn: 'Strong Arm',       category: 'heroes' },
  { id: 'boxer_fighter',    emoji: '🥊', nameAr: 'الملاكم الشجاع',    nameEn: 'Brave Boxer',      category: 'heroes' },
  { id: 'medal_champion',   emoji: '🏅', nameAr: 'البطل الحاصل على وسام', nameEn: 'Medal Champion', category: 'heroes' },
  { id: 'trophy_winner',    emoji: '🏆', nameAr: 'الفائز بالكأس',     nameEn: 'Trophy Winner',    category: 'heroes' },
  { id: 'star_hero',        emoji: '⭐', nameAr: 'النجم اللامع',      nameEn: 'Shining Star',     category: 'heroes' },

  // ═══════════════════════════════════════════════════════
  // 20 فضائياً / تقنياً
  // ═══════════════════════════════════════════════════════
  { id: 'alien_green',      emoji: '👽', nameAr: 'الفضائي الأخضر',   nameEn: 'Green Alien',      category: 'space' },
  { id: 'creature_glowing', emoji: '👾', nameAr: 'الكائن اللامع',    nameEn: 'Glowing Creature', category: 'space' },
  { id: 'robot_smart',      emoji: '🤖', nameAr: 'الروبوت الذكي',    nameEn: 'Smart Robot',      category: 'space' },
  { id: 'ufo_flying',       emoji: '🛸', nameAr: 'الصحن الطائر',     nameEn: 'Flying Saucer',    category: 'space' },
  { id: 'star_glowing',     emoji: '🌟', nameAr: 'النجم المتوهج',    nameEn: 'Glowing Star',     category: 'space' },
  { id: 'comet_fast',       emoji: '☄️', nameAr: 'الشهاب السريع',    nameEn: 'Fast Comet',       category: 'space' },
  { id: 'planet_ringed',    emoji: '🪐', nameAr: 'الكوكب الحلقي',    nameEn: 'Ringed Planet',    category: 'space' },
  { id: 'moon_bright',      emoji: '🌙', nameAr: 'القمر المضيء',     nameEn: 'Bright Moon',      category: 'space' },
  { id: 'sun_bright',       emoji: '☀️', nameAr: 'الشمس الساطعة',    nameEn: 'Bright Sun',       category: 'space' },
  { id: 'earth_blue',       emoji: '🌍', nameAr: 'الأرض الزرقاء',    nameEn: 'Blue Earth',       category: 'space' },
  { id: 'telescope_magic',  emoji: '🔭', nameAr: 'التلسكوب العجيب',  nameEn: 'Magic Telescope',  category: 'space' },
  { id: 'rocket_fast',      emoji: '🚀', nameAr: 'الصاروخ السريع',   nameEn: 'Fast Rocket',      category: 'space' },
  { id: 'satellite_eye',    emoji: '🛰️', nameAr: 'القمر الصناعي',    nameEn: 'Satellite',        category: 'space' },
  { id: 'battery_power',    emoji: '🔋', nameAr: 'الطاقة الخارقة',   nameEn: 'Super Energy',     category: 'space' },
  { id: 'gem_shining',      emoji: '💎', nameAr: 'الجوهرة اللامعة',  nameEn: 'Shining Gem',      category: 'space' },
  { id: 'bolt_electric',    emoji: '⚡', nameAr: 'الطاقة الكهربائية',nameEn: 'Electric Energy',  category: 'space' },
  { id: 'rainbow_colorful', emoji: '🌈', nameAr: 'قوس قزح',          nameEn: 'Rainbow',          category: 'space' },
  { id: 'sparkles_magic',   emoji: '✨', nameAr: 'السحر اللامع',     nameEn: 'Shining Magic',    category: 'space' },
  { id: 'bulb_idea',        emoji: '💡', nameAr: 'الفكرة الذكية',    nameEn: 'Smart Idea',       category: 'space' },
  { id: 'gear_tech',        emoji: '⚙️', nameAr: 'الترس التقني',     nameEn: 'Tech Gear',        category: 'space' },

  // ═══════════════════════════════════════════════════════
  // 20 مخلوقاً أسطورياً
  // ═══════════════════════════════════════════════════════
  { id: 'unicorn_magic',    emoji: '🦄', nameAr: 'وحيد القرن السحري',nameEn: 'Magic Unicorn',    category: 'mythical' },
  { id: 'dragon_blue',      emoji: '🐲', nameAr: 'التنين الأزرق',    nameEn: 'Blue Dragon',      category: 'mythical' },
  { id: 'mermaid_magic',    emoji: '🧜‍♀️', nameAr: 'حورية البحر',      nameEn: 'Mermaid',          category: 'mythical' },
  { id: 'merman_sea',       emoji: '🧜‍♂️', nameAr: 'ملك البحر',        nameEn: 'Merman',           category: 'mythical' },
  { id: 'genie_male',       emoji: '🧞‍♂️', nameAr: 'الجني السحري',     nameEn: 'Magic Genie',      category: 'mythical' },
  { id: 'genie_female',     emoji: '🧞‍♀️', nameAr: 'الجنية السحرية',   nameEn: 'Magic Genie Woman',category: 'mythical' },
  { id: 'fairy_male',       emoji: '🧚‍♂️', nameAr: 'الجني الطيب',      nameEn: 'Kind Fairy',       category: 'mythical' },
  { id: 'fairy_female',     emoji: '🧚‍♀️', nameAr: 'الجنية الطيبة',    nameEn: 'Kind Fairy Woman', category: 'mythical' },
  { id: 'elf_male',         emoji: '🧝‍♂️', nameAr: 'الفارس الخارق',    nameEn: 'Super Knight',     category: 'mythical' },
  { id: 'elf_female',       emoji: '🧝‍♀️', nameAr: 'الفارسة الخارقة',  nameEn: 'Super Knightess',  category: 'mythical' },
  { id: 'zombie_wise',      emoji: '🧟', nameAr: 'المحارب القديم',   nameEn: 'Old Warrior',      category: 'mythical' },
  { id: 'vampire_brave',    emoji: '🧛', nameAr: 'المصاص الشجاع',    nameEn: 'Brave Vampire',    category: 'mythical' },
  { id: 'dragon_small',     emoji: '🐉', nameAr: 'التنين الأخضر',    nameEn: 'Green Dragon',     category: 'mythical' },
  { id: 'dinosaur_brave',   emoji: '🦖', nameAr: 'الديناصور الشجاع', nameEn: 'Brave Dinosaur',   category: 'mythical' },
  { id: 'dinosaur_long',    emoji: '🦕', nameAr: 'الديناصور الطويل', nameEn: 'Long Dinosaur',    category: 'mythical' },
  { id: 'troll_strong',     emoji: '🧌', nameAr: 'العملاق القوي',    nameEn: 'Strong Troll',     category: 'mythical' },
  { id: 'ghost_friendly',   emoji: '👻', nameAr: 'الشبح الودود',     nameEn: 'Friendly Ghost',   category: 'mythical' },
  { id: 'ogre_power',       emoji: '👹', nameAr: 'الغول القوي',      nameEn: 'Powerful Ogre',    category: 'mythical' },
  { id: 'goblin_clever',    emoji: '👺', nameAr: 'العفريت الذكي',    nameEn: 'Clever Goblin',    category: 'mythical' },
  { id: 'skeleton_brave',   emoji: '💀', nameAr: 'الهيكل الشجاع',    nameEn: 'Brave Skeleton',   category: 'mythical' },
];

// دالة مساعدة: إرجاع اسم الشخصية مع رقمها
export function getAvatarDisplayName(
  avatarId: string,
  sequentialNumber: number,
  lang: 'ar' | 'en' = 'ar',
): string {
  const avatar = AVATARS.find((a) => a.id === avatarId);
  if (!avatar) return lang === 'ar' ? 'بطل' : 'Hero';
  const name = lang === 'ar' ? avatar.nameAr : avatar.nameEn;
  return `${name} ${sequentialNumber}`;
}

// دالة مساعدة: إرجاع الشخصية بالمعرّف
export function getAvatarById(avatarId: string): AvatarData | undefined {
  return AVATARS.find((a) => a.id === avatarId);
}