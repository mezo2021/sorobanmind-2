// src/components/games/MentalArchivesGame/data/level3Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_3_DATA: Chapter = {
  id: 'level3',
  titleAr: 'الْمُسْتَوَى الثَّالِثُ: مِيزَانُ الْقَوَافِلِ — تَدْمُر (6 كْيُو)',
  titleEn: 'Level 3: Caravan Balance — Palmyra (6 Kyu)',
  requires: ['level2'],
  next: 'level4',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level3-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى تَدْمُرَ، مَدِينَةِ الْقَوَافِلِ! هَذَا دَفْتَرُ حُمُولَةٍ قَدِيمٍ، لَكِنَّ الطَّيْفَ الصِّفْرِيَّ مَسَحَ الْأَرْقَامَ. لِحُسْنِ الْحَظِّ، لَدَيْنَا الْآنَ (الْكَاكِي) وَ(الْوَارِي) لِإِنْهَاءِ الْعَمَلِ!",
          textEn: "We have arrived at Palmyra, the city of caravans! This is an ancient cargo ledger, but the Zero Spectrum erased the numbers. Luckily, we now have (Kaki) and (Wari) to finish the work!"
        },
        { 
          character: "sorobana", 
          textAr: "بِالضَّبْطِ. فِي هَذَا الْمُسْتَوَى، سَتَتَعَلَّمَانِ الضَّرْبَ وَالْقِسْمَةَ. تَذَكَّرَا: نَضْرِبُ الْعَشَرَاتِ ثُمَّ الْآحَادَ، وَنَقْسِمُ مِنَ الْكَبِيرِ إِلَى الصَّغِيرِ. هَلْ أَنْتُمَا مُسْتَعِدَّانِ؟",
          textEn: "Exactly. In this level, you both will learn multiplication and division. Remember, both of you: multiply tens then units, and divide from largest to smallest. Are you both ready?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level3-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي",
          titleEn: "Example 1: Mitori",
          problem: "3 + 2 + 81 + 8 + 5",
          tipAr: "💡 اِبْدَأْ بِالْعَدَدِ ذِي الْخَانَتَيْنِ (81).",
          tipEn: "💡 Start with the two-digit number (81).",
          ruleTitleAr: "",
          ruleDescAr: "",
          ruleTitleEn: "",
          ruleDescEn: "",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 81.", textEn: "Step 1: Represent 81." },
            { textAr: "الْخُطْوَةُ 2 (+3): لِلْآحَادِ: نُضِيفُ 3 مُبَاشَرَةً ← 84.", textEn: "Step 2 (+3): Units: Add 3 directly → 84." },
            { textAr: "الْخُطْوَةُ 3 (+2): لِلْآحَادِ: نُنْزِلُ 5 وَنَطْرَحُ 3 (صَدِيقُ 5) ← 86.", textEn: "Step 3 (+2): Units: Bring down 5 and subtract 3 (Friend of 5) → 86." },
            { textAr: "الْخُطْوَةُ 4 (+8): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 2 مِنَ الْآحَادِ (صَدِيقُ 10) ← 94.", textEn: "Step 4 (+8): Units: Add 1 to tens and subtract 2 from units (Friend of 10) → 94." },
            { textAr: "الْخُطْوَةُ 5 (+5): لِلْآحَادِ: نُنْزِلُ 5 مُبَاشَرَةً ← 99. النَّتِيجَةُ: 99.", textEn: "Step 5 (+5): Units: Bring down 5 directly → 99. Result: 99." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي",
          titleEn: "Example 2: Mitori",
          problem: "77 + 3 + 8 + 3 + 6",
          tipAr: "💡 اِبْدَأْ بِالْعَدَدِ ذِي الْخَانَتَيْنِ (77).",
          tipEn: "💡 Start with the two-digit number (77).",
          ruleTitleAr: "",
          ruleDescAr: "",
          ruleTitleEn: "",
          ruleDescEn: "",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 77.", textEn: "Step 1: Represent 77." },
            { textAr: "الْخُطْوَةُ 2 (+3): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 7 مِنَ الْآحَادِ (صَدِيقُ 10) ← 80.", textEn: "Step 2 (+3): Units: Add 1 to tens and subtract 7 from units (Friend of 10) → 80." },
            { textAr: "الْخُطْوَةُ 3 (+8): لِلْآحَادِ: نُضِيفُ 8 مُبَاشَرَةً ← 88.", textEn: "Step 3 (+8): Units: Add 8 directly → 88." },
            { textAr: "الْخُطْوَةُ 4 (+3): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 7 مِنَ الْآحَادِ (صَدِيقُ 10) ← 91.", textEn: "Step 4 (+3): Units: Add 1 to tens and subtract 7 from units (Friend of 10) → 91." },
            { textAr: "الْخُطْوَةُ 5 (+6): لِلْآحَادِ: نُضِيفُ 6 مُبَاشَرَةً ← 97. النَّتِيجَةُ: 97.", textEn: "Step 5 (+6): Units: Add 6 directly → 97. Result: 97." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "20 × 2",
          tipAr: "💡 نَضَعُ 20، وَنَبْنِي النَّتِيجَةَ.",
          tipEn: "💡 Place 20, and build the result.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 20.", textEn: "Step 1: Represent 20." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 2 × 2 = 4 ← نَضَعُ 4 فِي خَانَةِ الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 2 × 2 = 4 → Place 4 in tens column." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 0 × 2 = 0 ← نَتْرُكُ خَانَةَ الْآحَادِ فَارِغَةً. النَّتِيجَةُ: 40.", textEn: "Step 3 (Units): 0 × 2 = 0 → Leave units column empty. Result: 40." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "31 × 2",
          tipAr: "💡 اضْرِبِ الْعَشَرَاتِ ثُمَّ الْآحَادَ.",
          tipEn: "💡 Multiply tens then units.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 31.", textEn: "Step 1: Represent 31." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 3 × 2 = 6 ← نَضَعُ 6 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 3 × 2 = 6 → Place 6 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 1 × 2 = 2 ← نَضَعُ 2 فِي الْآحَادِ. النَّتِيجَةُ: 62.", textEn: "Step 3 (Units): 1 × 2 = 2 → Place 2 in units. Result: 62." }
          ]
        },
        {
          titleAr: "مِثَالٌ 5: الْكَاكِي",
          titleEn: "Example 5: Kaki",
          problem: "18 × 2",
          tipAr: "💡 اِنْتَبِهْ لِلْحَمْلِ مِنَ الْآحَادِ لِلْعَشَرَاتِ.",
          tipEn: "💡 Pay attention to carry from units to tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 18.", textEn: "Step 1: Represent 18." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 1 × 2 = 2 ← نَضَعُ 2 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 1 × 2 = 2 → Place 2 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 8 × 2 = 16 ← نَضَعُ 6 فِي الْآحَادِ، وَنُضِيفُ 1 لِلْعَشَرَاتِ (2+1=3). النَّتِيجَةُ: 36.", textEn: "Step 3 (Units): 8 × 2 = 16 → Place 6 in units, and add 1 to tens (2+1=3). Result: 36." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْكَاكِي",
          titleEn: "Example 6: Kaki",
          problem: "38 × 3",
          tipAr: "💡 الْحَمْلُ هُنَا يَصِلُ لِلْمِئَاتِ، رَكِّزْ عِنْدَ إِضَافَةِ 2 لِلْعَشَرَاتِ.",
          tipEn: "💡 The carry here reaches hundreds, focus when adding 2 to tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 38.", textEn: "Step 1: Represent 38." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 3 × 3 = 9 ← نَضَعُ 9 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 3 × 3 = 9 → Place 9 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 8 × 3 = 24 ← نَضَعُ 4 فِي الْآحَادِ، وَنُضِيفُ 2 لِلْعَشَرَاتِ (9+2=11)، فَيَصْعَدُ 1 لِلْمِئَاتِ وَيَبْقَى 1 فِي الْعَشَرَاتِ. النَّتِيجَةُ: 114.", textEn: "Step 3 (Units): 8 × 3 = 24 → Place 4 in units, add 2 to tens (9+2=11), carry 1 to hundreds and leave 1 in tens. Result: 114." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مِثَالٌ 7: الْوَارِي",
          titleEn: "Example 7: Wari",
          problem: "93 ÷ 3",
          tipAr: "💡 اِقْسِمِ الْعَشَرَاتِ ثُمَّ الْآحَادَ (قِسْمَةٌ مُبَاشِرَةٌ).",
          tipEn: "💡 Divide tens then units (direct division).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 93.", textEn: "Step 1: Represent 93." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 9 ÷ 3 = 3 ← نَضَعُ 3 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (3 × 3 = 9) ← 9 - 9 = 0 (يَتَبَقَّى 3).", textEn: "Step 2 (Tens): 9 ÷ 3 = 3 → Place 3 in tens column (of result). Subtract: (3 × 3 = 9) → 9 - 9 = 0 (remains 3)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 3 ÷ 3 = 1 ← نَضَعُ 1 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (1 × 3 = 3) ← 3 - 3 = 0. النَّتِيجَةُ: 31.", textEn: "Step 3 (Units): 3 ÷ 3 = 1 → Place 1 in units column (of result). Subtract: (1 × 3 = 3) → 3 - 3 = 0. Result: 31." }
          ]
        },
        {
          titleAr: "مِثَالٌ 8: الْوَارِي",
          titleEn: "Example 8: Wari",
          problem: "92 ÷ 2",
          tipAr: "💡 إِذَا لَمْ يَقْبَلِ الرَّقْمُ الْقِسْمَةَ، خُذْ رَقْمَيْنِ.",
          tipEn: "💡 If the digit doesn't divide, take two digits.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 92.", textEn: "Step 1: Represent 92." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 9 ÷ 2 = 4 ← نَضَعُ 4 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (4 × 2 = 8) ← 9 - 8 = 1 (يَتَبَقَّى 12).", textEn: "Step 2 (Tens): 9 ÷ 2 = 4 → Place 4 in tens column (of result). Subtract: (4 × 2 = 8) → 9 - 8 = 1 (remains 12)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 12 ÷ 2 = 6 ← نَضَعُ 6 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (6 × 2 = 12) ← 12 - 12 = 0. النَّتِيجَةُ: 46.", textEn: "Step 3 (Units): 12 ÷ 2 = 6 → Place 6 in units column (of result). Subtract: (6 × 2 = 12) → 12 - 12 = 0. Result: 46." }
          ]
        },
        {
          titleAr: "مِثَالٌ 9: الْوَارِي",
          titleEn: "Example 9: Wari",
          problem: "72 ÷ 6",
          tipAr: "💡 الرَّقْمُ 7 أَكْبَرُ مِنْ 6، لَكِنَّهُ لَا يَقْبَلُ الْقِسْمَةَ، فَنَأْخُذُ الْعَشَرَاتِ وَالْآحَادَ.",
          tipEn: "💡 7 > 6, but doesn't divide evenly, so take tens and units.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 72.", textEn: "Step 1: Represent 72." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 7 ÷ 6 = 1 ← نَضَعُ 1 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (1 × 6 = 6) ← 7 - 6 = 1 (يَتَبَقَّى 12).", textEn: "Step 2 (Tens): 7 ÷ 6 = 1 → Place 1 in tens column (of result). Subtract: (1 × 6 = 6) → 7 - 6 = 1 (remains 12)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 12 ÷ 6 = 2 ← نَضَعُ 2 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (2 × 6 = 12) ← 12 - 12 = 0. النَّتِيجَةُ: 12.", textEn: "Step 3 (Units): 12 ÷ 6 = 2 → Place 2 in units column (of result). Subtract: (2 × 6 = 12) → 12 - 12 = 0. Result: 12." }
          ]
        },
        {
          titleAr: "مِثَالٌ 10: الْوَارِي",
          titleEn: "Example 10: Wari",
          problem: "56 ÷ 4",
          tipAr: "💡 5 لَا تَقْبَلُ الْقِسْمَةَ عَلَى 4، نَأْخُذُ رَقْمَيْنِ (56).",
          tipEn: "💡 5 doesn't divide by 4, take two digits (56).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 56.", textEn: "Step 1: Represent 56." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): 5 ÷ 4 = 1 ← نَضَعُ 1 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (1 × 4 = 4) ← 5 - 4 = 1 (يَتَبَقَّى 16).", textEn: "Step 2 (Tens): 5 ÷ 4 = 1 → Place 1 in tens column (of result). Subtract: (1 × 4 = 4) → 5 - 4 = 1 (remains 16)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): 16 ÷ 4 = 4 ← نَضَعُ 4 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (4 × 4 = 16) ← 16 - 16 = 0. النَّتِيجَةُ: 14.", textEn: "Step 3 (Units): 16 ÷ 4 = 4 → Place 4 in units column (of result). Subtract: (4 × 4 = 16) → 16 - 16 = 0. Result: 14." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level3-challenge',
      timePerQuestionMs: 24000, // ضعف الوقت المحاكي
      requiredCorrect: 8, // يحتاج 8 إجابات صحيحة من أصل 10
      questions: [
        { type: "mitori", numbers: [3, 2, 81, 8, 5], answer: 99, tipAr: "تَذَكَّرْ: اِبْدَأْ بِـ 81", tipEn: "Remember: start with 81" },
        { type: "mitori", numbers: [77, 3, 8, 3, 6], answer: 97, tipAr: "تَذَكَّرْ: اِبْدَأْ بِـ 77", tipEn: "Remember: start with 77" },
        { type: "multiplication", numbers: [20, 2], answer: 40, tipAr: "اضْرِبِ الْعَشَرَاتِ ثُمَّ الْآحَادَ", tipEn: "Multiply tens then units" },
        { type: "multiplication", numbers: [31, 2], answer: 62, tipAr: "لَا تَنْسَ الْحَمْلَ", tipEn: "Don't forget the carry" },
        { type: "multiplication", numbers: [18, 2], answer: 36, tipAr: "اِنْتَبِهْ لِلْحَمْلِ فِي الْعَشَرَاتِ", tipEn: "Watch the carry in tens" },
        { type: "multiplication", numbers: [38, 3], answer: 114, tipAr: "تَحَقَّقْ مِنَ الْحَمْلِ", tipEn: "Check the carry" },
        { type: "division", numbers: [93, 3], answer: 31, tipAr: "اِقْسِمِ الْعَشَرَاتِ ثُمَّ الْآحَادَ", tipEn: "Divide tens then units" },
        { type: "division", numbers: [92, 2], answer: 46, tipAr: "خُذْ رَقْمَيْنِ إِنْ لَمْ يَقْبَلِ الرَّقْمُ الْقِسْمَةَ", tipEn: "Take two digits if needed" },
        { type: "division", numbers: [72, 6], answer: 12, tipAr: "7 أَكْبَرُ مِنْ 6 لَكِنْ لَا يَقْبَلُ الْقِسْمَةَ", tipEn: "7 > 6 but doesn't divide" },
        { type: "division", numbers: [56, 4], answer: 14, tipAr: "خُذْ رَقْمَيْنِ (56)", tipEn: "Take two digits (56)" }
      ]
    }
  ]
};