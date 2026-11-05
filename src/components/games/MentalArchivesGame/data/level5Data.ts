// src/components/games/MentalArchivesGame/data/level5Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_5_DATA: Chapter = {
  id: 'level5',
  titleAr: 'الْمُسْتَوَى الْخَامِسُ: إِيقَاعُ الْبَحْرِ — اللَّاذِقِيَّة (4 كْيُو)',
  titleEn: 'Level 5: Rhythm of the Sea — Latakia (4 Kyu)',
  requires: ['level4'],
  next: 'level6',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level5-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى اللَّاذِقِيَّة! أَمْوَاجُ الْبَحْرِ تُشْبِهُ الْأَرْقَامَ الْمُتَدَافِعَةَ. الطَّيْفُ الصِّفْرِيُّ جَعَلَ الْمِيتُورِي أَعْقَدَ، فَكُلُّ صَفٍّ الْآنَ مِنْ خَانَتَيْنِ.",
          textEn: "We have arrived at Latakia! The sea waves resemble rushing numbers. The Zero Spectrum has made Mitori more complex, as every row is now two digits."
        },
        { 
          character: "sorobana", 
          textAr: "أَحْسَنْتُمَا. فِي 4 كْيُو، سَنَكْسِرُ حَاجِزَ الْمِئَاتِ فِي الْمِيتُورِي. الْكَاكِي وَالْوَارِي لَنْ يَتَغَيَّرَا، لَكِنْ عَلَيْكُمَا السُّرْعَةُ فِيهِمَا لِتُوَفِّرَا وَقْتًا لِلْمِيتُورِي. هَلْ أَنْتُمَا مُسْتَعِدَّانِ لِمُوَاجَهَةِ الْأَمْوَاجِ؟",
          textEn: "Well done. In 4 Kyu, we will break the hundreds barrier in Mitori. Kaki and Wari won't change, but you must be fast in them to save time for Mitori. Are you both ready to face the waves?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level5-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي",
          titleEn: "Example 1: Mitori",
          problem: "45 + 67 + 23 + 89 + 12",
          tipAr: "💡 رَكِّزْ عَلَى الْحَمْلِ لِلْعَشَرَاتِ وَالْمِئَاتِ.",
          tipEn: "💡 Focus on carrying to tens and hundreds.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 45.", textEn: "Step 1: Represent 45." },
            { textAr: "الْخُطْوَةُ 2 (+67): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 4 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 105). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْآحَادِ ← 112.", textEn: "Step 2 (+67): Tens: Add 1 to hundreds (carry) and subtract 4 from tens → (Intermediate: 105). Units: Add 1 to tens (carry) and subtract 3 from units → 112." },
            { textAr: "الْخُطْوَةُ 3 (+23): لِلْعَشَرَاتِ: نُضِيفُ 2 مُبَاشَرَةً ← (النَّاتِجُ الْمُؤَقَّتُ: 132). لِلْآحَادِ: نُضِيفُ 3 مُبَاشَرَةً ← 135.", textEn: "Step 3 (+23): Tens: Add 2 directly → (Intermediate: 132). Units: Add 3 directly → 135." },
            { textAr: "الْخُطْوَةُ 4 (+89): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 215). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْآحَادِ ← 224.", textEn: "Step 4 (+89): Tens: Add 1 to hundreds (carry) and subtract 2 from tens → (Intermediate: 215). Units: Add 1 to tens (carry) and subtract 1 from units → 224." },
            { textAr: "الْخُطْوَةُ 5 (+12): لِلْعَشَرَاتِ: نُضِيفُ 1 مُبَاشَرَةً ← (النَّاتِجُ الْمُؤَقَّتُ: 234). لِلْآحَادِ: نُضِيفُ 2 مُبَاشَرَةً ← 236. النَّتِيجَةُ: 236.", textEn: "Step 5 (+12): Tens: Add 1 directly → (Intermediate: 234). Units: Add 2 directly → 236. Result: 236." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي",
          titleEn: "Example 2: Mitori",
          problem: "46 + 72 + 18 + 93 + 57",
          tipAr: "💡 رَاقِبِ الْحَمْلَ لِلْعَشَرَاتِ عِنْدَ جَمْعِ الْآحَادِ الْكَبِيرَةِ.",
          tipEn: "💡 Watch for carrying to tens when adding large units.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 46.", textEn: "Step 1: Represent 46." },
            { textAr: "الْخُطْوَةُ 2 (+72): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 116). لِلْآحَادِ: نُضِيفُ 2 مُبَاشَرَةً ← 118.", textEn: "Step 2 (+72): Tens: Add 1 to hundreds (carry) and subtract 3 from tens → (Intermediate: 116). Units: Add 2 directly → 118." },
            { textAr: "الْخُطْوَةُ 3 (+18): لِلْعَشَرَاتِ: نُضِيفُ 1 مُبَاشَرَةً ← (النَّاتِجُ الْمُؤَقَّتُ: 128). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْآحَادِ ← 136.", textEn: "Step 3 (+18): Tens: Add 1 directly → (Intermediate: 128). Units: Add 1 to tens (carry) and subtract 2 from units → 136." },
            { textAr: "الْخُطْوَةُ 4 (+93): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 226). لِلْآحَادِ: نُضِيفُ 3 مُبَاشَرَةً ← 229.", textEn: "Step 4 (+93): Tens: Add 1 to hundreds (carry) and subtract 1 from tens → (Intermediate: 226). Units: Add 3 directly → 229." },
            { textAr: "الْخُطْوَةُ 5 (+57): لِلْعَشَرَاتِ: نُضِيفُ 5 مُبَاشَرَةً ← (النَّاتِجُ الْمُؤَقَّتُ: 279). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْآحَادِ ← 286. النَّتِيجَةُ: 286.", textEn: "Step 5 (+57): Tens: Add 5 directly → (Intermediate: 279). Units: Add 1 to tens (carry) and subtract 3 from units → 286. Result: 286." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "83 × 7",
          tipAr: "💡 اضْرِبِ الْعَشَرَاتِ أَوَّلًا، ثُمَّ الْآحَادَ، وَانْتَبِهْ لِلْحَمْلِ.",
          tipEn: "💡 Multiply tens first, then units, and watch the carry.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 83.", textEn: "Step 1: Represent 83." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 8 × 7 = 56 ← نَضَعُ 5 فِي الْمِئَاتِ، وَ 6 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 8 × 7 = 56 → Place 5 in hundreds, and 6 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 3 × 7 = 21 ← نُضِيفُ 2 لِلْعَشَرَاتِ (فَتُصْبِحُ 8)، وَنَضَعُ 1 فِي الْآحَادِ. النَّتِيجَةُ: 581.", textEn: "Step 3 (Units): 3 × 7 = 21 → Add 2 to tens (becomes 8), and place 1 in units. Result: 581." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "89 × 6",
          tipAr: "💡 الْحَمْلُ هُنَا يَصِلُ لِلْمِئَاتِ، رَكِّزْ عِنْدَ إِضَافَةِ 5 لِلْعَشَرَاتِ.",
          tipEn: "💡 The carry here reaches hundreds, focus when adding 5 to tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 89.", textEn: "Step 1: Represent 89." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 8 × 6 = 48 ← نَضَعُ 4 فِي الْمِئَاتِ، وَ 8 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 8 × 6 = 48 → Place 4 in hundreds, and 8 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 9 × 6 = 54 ← نُضِيفُ 5 لِلْعَشَرَاتِ (8+5=13)، فَيَصْعَدُ 1 لِلْمِئَاتِ (4+1=5) وَيَبْقَى 3 فِي الْعَشَرَاتِ، وَنَضَعُ 4 فِي الْآحَادِ. النَّتِيجَةُ: 534.", textEn: "Step 3 (Units): 9 × 6 = 54 → Add 5 to tens (8+5=13), carry 1 to hundreds (4+1=5) and leave 3 in tens, and place 4 in units. Result: 534." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مِثَالٌ 5: الْوَارِي",
          titleEn: "Example 5: Wari",
          problem: "392 ÷ 7",
          tipAr: "💡 3 أَصْغَرُ مِنْ 7، لِذَا نَأْخُذُ رَقْمَيْنِ (39).",
          tipEn: "💡 3 is smaller than 7, so we take two digits (39).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 392.", textEn: "Step 1: Represent 392." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 39 ÷ 7 = 5 ← نَضَعُ 5 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: 39 - 35 = 4 (يَتَبَقَّى 42).", textEn: "Step 2 (Tens): 39 ÷ 7 = 5 → Place 5 in tens column (of result). Subtract: 39 - 35 = 4 (remains 42)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 42 ÷ 7 = 6 ← نَضَعُ 6 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: 42 - 42 = 0. النَّتِيجَةُ: 56.", textEn: "Step 3 (Units): 42 ÷ 7 = 6 → Place 6 in units column (of result). Subtract: 42 - 42 = 0. Result: 56." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْوَارِي",
          titleEn: "Example 6: Wari",
          problem: "616 ÷ 8",
          tipAr: "💡 6 أَصْغَرُ مِنْ 8، لِذَا نَأْخُذُ رَقْمَيْنِ (61).",
          tipEn: "💡 6 is smaller than 8, so we take two digits (61).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 616.", textEn: "Step 1: Represent 616." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 61 ÷ 8 = 7 ← نَضَعُ 7 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: 61 - 56 = 5 (يَتَبَقَّى 56).", textEn: "Step 2 (Tens): 61 ÷ 8 = 7 → Place 7 in tens column (of result). Subtract: 61 - 56 = 5 (remains 56)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 56 ÷ 8 = 7 ← نَضَعُ 7 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: 56 - 56 = 0. النَّتِيجَةُ: 77.", textEn: "Step 3 (Units): 56 ÷ 8 = 7 → Place 7 in units column (of result). Subtract: 56 - 56 = 0. Result: 77." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level5-challenge',
      timePerQuestionMs: 24000, // ضعف الوقت المحاكي
      requiredCorrect: 5, // 5 إجابات صحيحة من أصل 6
      questions: [
        { type: "mitori", numbers: [45, 67, 23, 89, 12], answer: 236, tipAr: "رَكِّزْ عَلَى الْحَمْلِ لِلْعَشَرَاتِ وَالْمِئَاتِ", tipEn: "Focus on carrying to tens and hundreds" },
        { type: "mitori", numbers: [46, 72, 18, 93, 57], answer: 286, tipAr: "رَاقِبِ الْحَمْلَ لِلْعَشَرَاتِ", tipEn: "Watch for carrying to tens" },
        { type: "multiplication", numbers: [83, 7], answer: 581, tipAr: "اضْرِبِ الْعَشَرَاتِ ثُمَّ الْآحَادَ", tipEn: "Multiply tens then units" },
        { type: "multiplication", numbers: [89, 6], answer: 534, tipAr: "الْحَمْلُ يَصِلُ لِلْمِئَاتِ، رَكِّزْ", tipEn: "Carry reaches hundreds, focus" },
        { type: "division", numbers: [392, 7], answer: 56, tipAr: "3 أَصْغَرُ مِنْ 7، خُذْ رَقْمَيْنِ", tipEn: "3 < 7, take two digits" },
        { type: "division", numbers: [616, 8], answer: 77, tipAr: "6 أَصْغَرُ مِنْ 8، خُذْ رَقْمَيْنِ", tipEn: "6 < 8, take two digits" }
      ]
    }
  ]
};