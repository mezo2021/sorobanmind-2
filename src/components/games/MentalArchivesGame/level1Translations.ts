// src/components/games/MentalArchivesGame/level1Translations.ts
import { useLangStore } from '@/i18n/useTranslation';

// قاموس الترجمة الخاص بهذه اللعبة فقط (معزول عن الملف المركزي)
export const GAME_DICT: Record<string, string> = {
  // --- القصة (Story) ---
  'فِي لَيْلَةٍ هَادِئَةٍ عَلَى سَاحِلِ مَرْسِين، كُنَّا نُرَاجِعُ حِسَابَاتِنَا. فَجْأَةً، بَدَأَتِ الْخَرَزَاتُ فِي الْمِعْدَادِ تَلْمَعُ وَتَنْزَلِقُ وَحْدَهَا!': 'On a quiet night on the coast of Mersin, we were reviewing our calculations. Suddenly, the beads on the abacus began to glow and slide on their own!',
  'جُود، انْظُرْ! هَذِهِ لَيْسَتْ أَدَاةً عَادِيَّة. هُنَاكَ دَوَائِرُ مِنَ الضَّوْءِ تَتَشَكَّلُ فِي الْهَوَاء، وَكَأَنَّهَا بَوَّابَة!': 'Joud, look! This is not an ordinary tool. There are circles of light forming in the air, as if it is a portal!',
  'مَرْحَباً بِكُمَا. أَنَا سُورُوبَانَا، مُرْشِدَةٌ أَرْشِيفِيَّةٌ مِنَ الْمُسْتَقْبَل. الطَّيْفُ الصِّفْرِيُّ يَمْحُو الرَّوَابِطَ بَيْنَ السِّجِلَّاتِ الزَّمَنِيَّة. إِذَا اخْتَفَتِ الصِّلَات، لَنْ يَعْرِفَ أَطْفَالُ الْمُسْتَقْبَلِ كَيْفَ تَطَوَّرَتِ الْأَرْقَام.': 'Welcome. I am Sorobana, an archive guide from the future. The Zero Spectrum is erasing the links between time records. If the connections disappear, the children of the future will not know how numbers evolved.',
  'كَيْفَ يُمْكِنُنَا مُسَاعَدَتُكِ؟': 'How can we help you?',
  'عَبْرَ هَذِهِ الْبَوَّابَة، سَتُسَافِرَانِ إِلَى أَقْدَمِ السِّجِلَّات. ابْدَآ مِنْ إِبْلَا وَمَارِي. لَكِنْ تَذَكَّرَا: الْمِعْدَادُ الَّذِي فِي يَدَيْكُمَا هُوَ أَدَاةٌ تَعْلِيمِيَّةٌ مُسْتَقْبَلِيَّة، وَلَيْسَ أَدَاةً أَثَرِيَّةً مِنْ ذَلِكَ الْعَصْر.': 'Through this portal, you will travel to the oldest records. Start with Ebla and Mari. But remember: the abacus in your hands is a future educational tool, not an ancient artifact from that era.',
  'وَصَلْنَا! هَذِهِ أَلْوَاحُ إِبْلَا الطِّينِيَّة. الطَّيْفُ الصِّفْرِيُّ يَمْسَحُ الْأَرْقَامَ الَّتِي تَرْبِطُ السِّجِلَّات!': 'We have arrived! These are the clay tablets of Ebla. The Zero Spectrum is wiping the numbers that connect the records!',
  'الْأَرْقَامُ مَوْجُودَة، لَكِنَّ الْمَجَامِيعَ غَيْرُ مُتَّصِلَة. سَنُصْلِحُهَا بِالْعَدِّ الذِّهْنِيِّ!': 'The numbers are there, but the sums are disconnected. We will fix them with mental calculation!',

  // --- المثال المحلول (Example) ---
  'الْمَثَلُ الْمَحْلُول (جَمْعٌ مُبَاشِر)': 'Solved Example (Direct Addition)',
  'نُمَثِّلُ الرَّقْمَ 2: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ فِي خَانَةِ الْآحَاد.': 'Represent 2: Lift two lower beads in the units column.',
  'نُضِيفُ 3: لَا تُوجَدُ خَرَزَاتٌ سُفْلِيَّةٌ كَافِيَة، فَنَسْتَخْدِمُ قَاعِدَةَ (الصَّدِيقِ الصَّغِير): نُنْزِلُ الْخَرَزَةَ الْعُلْوِيَّة (+5) وَنُبْعِدُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (-2). الْمَجْمُوعُ أَصْبَحَ 5.': 'Add 3: Not enough lower beads, so we use the (Small Friend) rule: Bring down the upper bead (+5) and move two lower beads away (-2). The sum becomes 5.',
  'نُضِيفُ 1: نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَة.': 'Add 1: Lift one lower bead.',
  'النَّتِيجَةُ النِّهَائِيَّة: 6.': 'Final result: 6.',

  // --- واجهة المستخدم (UI) ---
  'المستوى الأول: رفوف الذاكرة': 'Level 1: Memory Shelves',
  'جود': 'Joud',
  'أسيل': 'Aseel',
  'سوروبانا': 'Sorobana',
  'مرشد زمني': 'Archive Guide',
  'تخطي المقدمة': 'Skip Intro',
  'عرض النص كاملاً': 'Show Full Text',
  'متابعة الحكاية': 'Continue Story',
  'أنا مستعد للتحدي الأثري': 'Ready for Challenge',
  'عبرت البوابة بنجاح!': 'Gate Crossed!',
  'لَقَدْ أَعَدْتَ رَبْطَ سِجِلَّاتِ إِبْلَا وَمَارِي وَحَفِظْتَ التَّارِيخَ مِنَ الطَّيْفِ الصِّفْرِيّ.': 'You have reconnected the records of Ebla and Mari and saved history from the Zero Spectrum.',
  'بطاقة الأثر التاريخي: ألواح إبلا': 'Artifact Card: Ebla Tablets',
  'اكتشفت أزيد من 17 ألف لوح مسماري في إبلا (سورية)، وهي تمثل أقدم أرشيف إداري مكتشف في تاريخ البشرية!': 'Over 17,000 cuneiform tablets were discovered in Ebla (Syria), representing the oldest administrative archive in human history!',
  'العودة لمدينة الألعاب': 'Return to Games',
  'تحتاج إلى مزيد من السرعة!': 'Need More Speed!',
  'تَحْتَاجُ إِلَى مَزِيدٍ مِنَ السُّرْعَةِ لِلِامْتِحَان، تَدَرَّبْ جَيِّداً لِتَكُونَ جَاهِزاً.': 'You need more speed for the exam, practice well to be ready.',
  'مراجعة الشرح': 'Review',
  'تحدي جديد': 'Retry',
  'السؤال': 'Q',
  'تحدي السرعة الأثرية': 'Archaeological Speed Challenge',
  'لوح طيني رقمي': 'Digital Tablet',
  'تأكيد الإجابة': 'Confirm',
  'إِجَابَةٌ صَحِيحَة!': 'Correct answer!',
  'إِجَابَةٌ خَاطِئَة، حَاوِلْ أَسْرَع.': 'Wrong answer, try faster.',
  'عَبَرْتَ الْبَوَّابَةَ بِنَجَاح!': 'You crossed the gate successfully!',
  'بطل': 'Champion',
  'اسمع الشرح': 'Listen to the explanation',
  'إيقاف الصوت': 'Stop audio',
  'توقف الصوت': 'Mute',
  'ابدأ الرحلة': 'Start the Journey',
};

// دالة الترجمة المحلية للعبة
export function tGame(ar: string): string {
  const lang = useLangStore.getState().lang;
  if (lang === 'en') {
    return GAME_DICT[ar] || ar;
  }
  return ar;
}