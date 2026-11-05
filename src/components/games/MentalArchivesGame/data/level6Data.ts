// src/components/games/MentalArchivesGame/data/level6Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_6_DATA: Chapter = {
  id: 'level6',
  titleAr: 'الْمُسْتَوَى السَّادِسُ: قَلْبُ الْأَرْقَامِ — دِمَشْق (3 كْيُو)',
  titleEn: 'Level 6: Heart of Numbers — Damascus (3 Kyu)',
  requires: ['level5'],
  next: 'level7',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level6-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى دِمَشْقَ، قَلْبِ سُورِيَا! هُنَا أَكْبَرُ أَرْشِيفٍ رَقْمِيٍّ. الطَّيْفُ الصِّفْرِيُّ أَضَافَ خَانَةً ثَالِثَةً لِلْأَرْقَامِ، وَزَادَ فِي صُعُوبَةِ الْأَصْفَارِ!",
          textEn: "We have arrived in Damascus, the heart of Syria! Here is the largest digital archive. The Zero Spectrum has added a third digit to the numbers, and increased the difficulty of the zeros!"
        },
        { 
          character: "sorobana", 
          textAr: "أَحْسَنْتُمَا. فِي 3 كْيُو، سَيَصِيرُ الْمِيتُورِي خَمْسَةَ صُفُوفٍ مِنْ ثَلَاثِ خَانَاتٍ. وَالضَّرْبُ سَيَشْمَلُ ثَلَاثَ خَانَاتٍ فِي خَانَةٍ، وَالْقِسْمَةُ سَتُنْتِجُ ثَلَاثَ خَانَاتٍ. انْتَبِهَا لِلْأَصْفَارِ جَيِّدًا! هَلْ أَنْتُمَا مُسْتَعِدَّانِ؟",
          textEn: "Well done. In 3 Kyu, Mitori will become five rows of three digits. Multiplication will include three digits by one digit, and division will yield three digits. Watch the zeros carefully! Are you both ready?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level6-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي",
          titleEn: "Example 1: Mitori",
          problem: "125 + 346 + 782 + 419 + 237",
          tipAr: "💡 خَمْسَةُ صُفُوفٍ مِنْ ثَلَاثِ خَانَاتٍ. اِحْمِلْ لِلْمِئَاتِ وَالْآلَافِ.",
          tipEn: "💡 Five rows of three digits. Carry to hundreds and thousands.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 125.", textEn: "Step 1: Represent 125." },
            { textAr: "الْخُطْوَةُ 2 (+346): لِلْمِئَاتِ: نُضِيفُ 3 ← 425. لِلْعَشَرَاتِ: نُضِيفُ 4 ← (النَّاتِجُ الْمُؤَقَّتُ: 465). لِلْآحَادِ: نُضِيفُ 6 ← 471.", textEn: "Step 2 (+346): Hundreds: Add 3 → 425. Tens: Add 4 → (Intermediate: 465). Units: Add 6 → 471." },
            { textAr: "الْخُطْوَةُ 3 (+782): لِلْمِئَاتِ: نُضِيفُ 1 لِلْآلَافِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْمِئَاتِ ← 1171. لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 1251). لِلْآحَادِ: نُضِيفُ 2 ← 1253.", textEn: "Step 3 (+782): Hundreds: Add 1 to thousands (carry) and subtract 3 from hundreds → 1171. Tens: Add 1 to hundreds (carry) and subtract 2 from tens → (Intermediate: 1251). Units: Add 2 → 1253." },
{ textAr: "الْخُطْوَةُ 4 (+419): لِلْمِئَاتِ: نُضِيفُ 4 ← 1653. لِلْعَشَرَاتِ: نُضِيفُ 1 ← (النَّاتِجُ الْمُؤَقَّتُ: 1663). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْآحَادِ ← 1672.", textEn: "Step 4 (+419): Hundreds: Add 4 → 1653. Tens: Add 1 → (Intermediate: 1663). Units: Add 1 to tens (carry) and subtract 1 from units → 1672." },
{ textAr: "الْخُطْوَةُ 5 (+237): لِلْمِئَاتِ: نُضِيفُ 2 ← 1872. لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 7 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 1902). لِلْآحَادِ: نُضِيفُ 7 ← 1909. النَّتِيجَةُ: 1909.", textEn: "Step 5 (+237): Hundreds: Add 2 → 1872. Tens: Add 1 to hundreds (carry) and subtract 7 from tens → (Intermediate: 1902). Units: Add 7 → 1909. Result: 1909." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي",
          titleEn: "Example 2: Mitori",
          problem: "506 + 283 + 749 + 102 + 835",
          tipAr: "💡 اِنْتَبِهْ لِلصِّفْرِ عِنْدَ جَمْعِ الْعَشَرَاتِ.",
          tipEn: "💡 Watch the zero when adding tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 506.", textEn: "Step 1: Represent 506." },
            { textAr: "الْخُطْوَةُ 2 (+283): لِلْمِئَاتِ: نُضِيفُ 2 ← 706. لِلْعَشَرَاتِ: نُضِيفُ 8 ← (النَّاتِجُ الْمُؤَقَّتُ: 786). لِلْآحَادِ: نُضِيفُ 3 ← 789.", textEn: "Step 2 (+283): Hundreds: Add 2 → 706. Tens: Add 8 → (Intermediate: 786). Units: Add 3 → 789." },
            { textAr: "الْخُطْوَةُ 3 (+749): لِلْمِئَاتِ: نُضِيفُ 1 لِلْآلَافِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْمِئَاتِ ← 1489. لِلْعَشَرَاتِ: نُضِيفُ 4 ← (النَّاتِجُ الْمُؤَقَّتُ: 1529). لِلْآحَادِ: نُضِيفُ 9 ← 1538.", textEn: "Step 3 (+749): Hundreds: Add 1 to thousands (carry) and subtract 3 from hundreds → 1489. Tens: Add 4 → (Intermediate: 1529). Units: Add 9 → 1538." },
            { textAr: "الْخُطْوَةُ 4 (+102): لِلْمِئَاتِ: نُضِيفُ 1 ← 1638. لِلْعَشَرَاتِ: نُضِيفُ 0 ← (النَّاتِجُ الْمُؤَقَّتُ: 1638). لِلْآحَادِ: نُضِيفُ 2 ← 1640.", textEn: "Step 4 (+102): Hundreds: Add 1 → 1638. Tens: Add 0 → (Intermediate: 1638). Units: Add 2 → 1640." },
            { textAr: "الْخُطْوَةُ 5 (+835): لِلْمِئَاتِ: نُضِيفُ 8 ← 2440. لِلْعَشَرَاتِ: نُضِيفُ 3 ← (النَّاتِجُ الْمُؤَقَّتُ: 2470). لِلْآحَادِ: نُضِيفُ 5 ← 2475. النَّتِيجَةُ: 2475.", textEn: "Step 5 (+835): Hundreds: Add 8 → 2440. Tens: Add 3 → (Intermediate: 2470). Units: Add 5 → 2475. Result: 2475." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "234 × 3",
          tipAr: "💡 نَضْرِبُ الْمِئَاتِ، ثُمَّ الْعَشَرَاتِ، ثُمَّ الْآحَادَ.",
          tipEn: "💡 Multiply hundreds, then tens, then units.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 234.", textEn: "Step 1: Represent 234." },
            { textAr: "الْخُطْوَةُ 2 (لِلْمِئَاتِ): 2 × 3 = 6 ← نَضَعُ 6 فِي الْمِئَاتِ.", textEn: "Step 2 (Hundreds): 2 × 3 = 6 → Place 6 in hundreds." },
            { textAr: "الْخُطْوَةُ 3 (لِلْعَشَرَاتِ): 3 × 3 = 9 ← نَضَعُ 9 فِي الْعَشَرَاتِ.", textEn: "Step 3 (Tens): 3 × 3 = 9 → Place 9 in tens." },
            { textAr: "الْخُطْوَةُ 4 (لِلْآحَادِ): 4 × 3 = 12 ← نُضِيفُ 1 لِلْعَشَرَاتِ (9+1=10، فَيَصْعَدُ 1 لِلْمِئَاتِ وَيَبْقَى 0 فِي الْعَشَرَاتِ)، وَنَضَعُ 2 فِي الْآحَادِ. النَّتِيجَةُ: 702.", textEn: "Step 4 (Units): 4 × 3 = 12 → Add 1 to tens (9+1=10, carry 1 to hundreds leaving 0 in tens), and place 2 in units. Result: 702." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "506 × 8",
          tipAr: "💡 اِحْذَرْ مِنْ ضَيَاعِ الصِّفْرِ فِي الْعَشَرَاتِ.",
          tipEn: "💡 Be careful not to lose the zero in tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 506.", textEn: "Step 1: Represent 506." },
            { textAr: "الْخُطْوَةُ 2 (لِلْمِئَاتِ): 5 × 8 = 40 ← نَضَعُ 4 فِي الْآلَافِ، وَ 0 فِي الْمِئَاتِ.", textEn: "Step 2 (Hundreds): 5 × 8 = 40 → Place 4 in thousands, and 0 in hundreds." },
            { textAr: "الْخُطْوَةُ 3 (لِلْعَشَرَاتِ): 0 × 8 = 0 ← نَتْرُكُ خَانَةَ الْعَشَرَاتِ فَارِغَةً.", textEn: "Step 3 (Tens): 0 × 8 = 0 → Leave the tens column empty." },
            { textAr: "الْخُطْوَةُ 4 (لِلْآحَادِ): 6 × 8 = 48 ← نُضِيفُ 4 لِلْعَشَرَاتِ، وَنَضَعُ 8 فِي الْآحَادِ. النَّتِيجَةُ: 4048.", textEn: "Step 4 (Units): 6 × 8 = 48 → Add 4 to tens, and place 8 in units. Result: 4048." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مِثَالٌ 5: الْوَارِي",
          titleEn: "Example 5: Wari",
          problem: "1218 ÷ 3",
          tipAr: "💡 الصِّفْرُ فِي مُنْتَصَفِ النَّاتِجِ مُهِمٌّ جِدًّا.",
          tipEn: "💡 The zero in the middle of the result is very important.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 1218.", textEn: "Step 1: Represent 1218." },
            { textAr: "الْخُطْوَةُ 2 (الْآلَافُ): 12 ÷ 3 = 4 ← نَضَعُ 4 فِي خَانَةِ الْمِئَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (4 × 3 = 12) ← 12 - 12 = 0 (يَتَبَقَّى 18).", textEn: "Step 2 (Thousands): 12 ÷ 3 = 4 → Place 4 in hundreds column (of result). Subtract: (4 × 3 = 12) → 12 - 12 = 0 (remains 18)." },
            { textAr: "الْخُطْوَةُ 3 (الْعَشَرَاتُ): 1 لَا تَقْبَلُ الْقِسْمَةَ عَلَى 3 ← نَضَعُ 0 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). (يَتَبَقَّى 18 كَمَا هُوَ).", textEn: "Step 3 (Tens): 1 doesn't divide by 3 → Place 0 in tens column (of result). (Remains 18 as is)." },
            { textAr: "الْخُطْوَةُ 4 (الْآحَادُ): 18 ÷ 3 = 6 ← نَضَعُ 6 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (6 × 3 = 18) ← 18 - 18 = 0. النَّتِيجَةُ: 406.", textEn: "Step 4 (Units): 18 ÷ 3 = 6 → Place 6 in units column (of result). Subtract: (6 × 3 = 18) → 18 - 18 = 0. Result: 406." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْوَارِي",
          titleEn: "Example 6: Wari",
          problem: "724 ÷ 2",
          tipAr: "💡 اقْسِمِ الْمِئَاتِ، ثُمَّ الْعَشَرَاتِ، ثُمَّ الْآحَادَ.",
          tipEn: "💡 Divide hundreds, then tens, then units.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 724.", textEn: "Step 1: Represent 724." },
            { textAr: "الْخُطْوَةُ 2 (الْمِئَاتُ): 7 ÷ 2 = 3 ← نَضَعُ 3 فِي خَانَةِ الْمِئَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (3 × 2 = 6) ← 7 - 6 = 1 (يَتَبَقَّى 124).", textEn: "Step 2 (Hundreds): 7 ÷ 2 = 3 → Place 3 in hundreds column (of result). Subtract: (3 × 2 = 6) → 7 - 6 = 1 (remains 124)." },
            { textAr: "الْخُطْوَةُ 3 (الْعَشَرَاتُ): 12 ÷ 2 = 6 ← نَضَعُ 6 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (6 × 2 = 12) ← 12 - 12 = 0 (يَتَبَقَّى 4).", textEn: "Step 3 (Tens): 12 ÷ 2 = 6 → Place 6 in tens column (of result). Subtract: (6 × 2 = 12) → 12 - 12 = 0 (remains 4)." },
            { textAr: "الْخُطْوَةُ 4 (الْآحَادُ): 4 ÷ 2 = 2 ← نَضَعُ 2 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (2 × 2 = 4) ← 4 - 4 = 0. النَّتِيجَةُ: 362.", textEn: "Step 4 (Units): 4 ÷ 2 = 2 → Place 2 in units column (of result). Subtract: (2 × 2 = 4) → 4 - 4 = 0. Result: 362." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level6-challenge',
      timePerQuestionMs: 24000, // ضعف الوقت المحاكي
      requiredCorrect: 5, // 5 إجابات صحيحة من أصل 6
      questions: [
        { type: "mitori", numbers: [125, 346, 782, 419, 237], answer: 1909, tipAr: "اِحْمِلْ لِلْمِئَاتِ وَالْآلَافِ", tipEn: "Carry to hundreds and thousands" },
        { type: "mitori", numbers: [506, 283, 749, 102, 835], answer: 2475, tipAr: "اِنْتَبِهْ لِلصِّفْرِ", tipEn: "Watch the zero" },
        { type: "multiplication", numbers: [234, 3], answer: 702, tipAr: "اضْرِبِ الْمِئَاتِ ثُمَّ الْعَشَرَاتِ", tipEn: "Multiply hundreds then tens" },
        { type: "multiplication", numbers: [506, 8], answer: 4048, tipAr: "اِحْذَرْ مِنْ ضَيَاعِ الصِّفْرِ", tipEn: "Don't lose the zero" },
        { type: "division", numbers: [1218, 3], answer: 406, tipAr: "الصِّفْرُ فِي الْمُنْتَصَفِ مُهِمٌّ", tipEn: "The zero in the middle is important" },
        { type: "division", numbers: [724, 2], answer: 362, tipAr: "اقْسِمْ مِنَ الْكَبِيرِ لِلصَّغِيرِ", tipEn: "Divide from largest to smallest" }
      ]
    }
  ]
};