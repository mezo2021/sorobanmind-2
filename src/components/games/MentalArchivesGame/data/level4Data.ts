// src/components/games/MentalArchivesGame/data/level4Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_4_DATA: Chapter = {
  id: 'level4',
  titleAr: 'الْمُسْتَوَى الرَّابِعُ: جِسْرُ الْخَرَزِ — الصِّينُ وَالْيَابَانُ (5 كْيُو)',
  titleEn: 'Level 4: Bridge of Beads — China & Japan (5 Kyu)',
  requires: ['level3'],
  next: 'level5',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level4-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "هَذَا هُوَ الْجِسْرُ الَّذِي عَبَرَتْهُ أَدَوَاتُ الْعَدِّ مِنَ الصِّينِ إِلَى الْيَابَانِ! الطَّيْفُ الصِّفْرِيُّ أَرْبَكَ أَرْقَامَ التِّجَارَةِ الْكَبِيرَةِ هُنَا.",
          textEn: "This is the bridge that counting tools crossed from China to Japan! The Zero Spectrum has confused the numbers of the great trade here."
        },
        { 
          character: "sorobana", 
          textAr: "بِالضَّبْطِ. فِي مُسْتَوَى 5 كْيُو، سَيَتَّسِعُ الْمِيتُورِي لِيَشْمَلَ الْمِئَاتَ. أَمَّا الْكَاكِي وَالْوَارِي فَسَيَبْقَيَانِ كَمَا هُمَا، لَكِنَّ الْمُهِمَّةَ الْآنَ هِيَ السُّرْعَةُ لِتُوَفِّرَا وَقْتًا لِلْمِيتُورِي. هَلْ أَنْتُمَا مُسْتَعِدَّانِ لِتَحْطِيمِ حَاجِزِ الْمِئَة؟",
          textEn: "Exactly. In the 5 Kyu level, Mitori will expand to include hundreds. Kaki and Wari will remain the same, but the task now is speed to save time for Mitori. Are you both ready to break the hundred barrier?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level4-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي",
          titleEn: "Example 1: Mitori",
          problem: "89 + 91 + 7 + 1 + 96",
          tipAr: "💡 اِبْدَأْ بِالْعَدَدِ ذِي الْخَانَتَيْنِ، وَانْتَبِهْ لِلِانْتِقَالِ إِلَى الْمِئَاتِ.",
          tipEn: "💡 Start with the two-digit number, and watch the transition to hundreds.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 89.", textEn: "Step 1: Represent 89." },
            { textAr: "الْخُطْوَةُ 2 (+91): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ. وَلِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 9 مِنَ الْآحَادِ (صَدِيقُ 10) ← 180.", textEn: "Step 2 (+91): Tens: Add 1 to hundreds and subtract 1 from tens. Units: Add 1 to tens and subtract 9 from units (Friend of 10) → 180." },
            { textAr: "الْخُطْوَةُ 3 (+7): لِلْآحَادِ: نُضِيفُ 7 مُبَاشَرَةً ← 187.", textEn: "Step 3 (+7): Units: Add 7 directly → 187." },
            { textAr: "الْخُطْوَةُ 4 (+1): لِلْآحَادِ: نُضِيفُ 1 مُبَاشَرَةً ← 188.", textEn: "Step 4 (+1): Units: Add 1 directly → 188." },
            { textAr: "الْخُطْوَةُ 5 (+96): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ. وَلِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 4 مِنَ الْآحَادِ (صَدِيقُ 10) ← 284. النَّتِيجَةُ: 284.", textEn: "Step 5 (+96): Tens: Add 1 to hundreds and subtract 1 from tens. Units: Add 1 to tens and subtract 4 from units (Friend of 10) → 284. Result: 284." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي",
          titleEn: "Example 2: Mitori",
          problem: "25 + 5 + 99 + 93 + 7",
          tipAr: "💡 اِجْمَعِ الْأَرْقَامَ الصَّغِيرَةَ مَعًا ذِهْنِيًّا لِتَسْهِيلِ الْوُصُولِ لِلْمِئَاتِ.",
          tipEn: "💡 Mentally group small numbers together to ease the transition to hundreds.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 25.", textEn: "Step 1: Represent 25." },
            { textAr: "الْخُطْوَةُ 2 (+5): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 5 مِنَ الْآحَادِ (صَدِيقُ 10) ← 30.", textEn: "Step 2 (+5): Units: Add 1 to tens and subtract 5 from units (Friend of 10) → 30." },
            { textAr: "الْخُطْوَةُ 3 (+99): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ. وَلِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 1 مِنَ الْآحَادِ (صَدِيقُ 10) ← 129.", textEn: "Step 3 (+99): Tens: Add 1 to hundreds and subtract 1 from tens. Units: Add 1 to tens and subtract 1 from units (Friend of 10) → 129." },
            { textAr: "الْخُطْوَةُ 4 (+93): لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ. وَلِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 7 مِنَ الْآحَادِ (صَدِيقُ 10) ← 222.", textEn: "Step 4 (+93): Tens: Add 1 to hundreds and subtract 1 from tens. Units: Add 1 to tens and subtract 7 from units (Friend of 10) → 222." },
            { textAr: "الْخُطْوَةُ 5 (+7): لِلْآحَادِ: نُضِيفُ 7 مُبَاشَرَةً ← 229. النَّتِيجَةُ: 229.", textEn: "Step 5 (+7): Units: Add 7 directly → 229. Result: 229." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "91 × 8",
          tipAr: "💡 اضْرِبِ الْعَشَرَاتِ، ثُمَّ الْآحَادَ، وَلَا تَنْسَ الْحَمْلَ.",
          tipEn: "💡 Multiply tens, then units, and don't forget the carry.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 91 عَلَى الْيَسَارِ.", textEn: "Step 1: Represent 91 on the left." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 9 × 8 = 72، نَضَعُ 7 فِي الْمِئَاتِ وَ2 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 9 × 8 = 72, place 7 in hundreds and 2 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 1 × 8 = 8، نَضَعُ 8 فِي الْآحَادِ. النَّتِيجَةُ: 728.", textEn: "Step 3 (Units): 1 × 8 = 8, place 8 in units. Result: 728." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "95 × 9",
          tipAr: "💡 الْحَمْلُ هُنَا كَبِيرٌ، رَكِّزْ عِنْدَ إِضَافَةِ 4 لِلْعَشَرَاتِ.",
          tipEn: "💡 The carry here is large, focus when adding 4 to tens.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 95 عَلَى الْيَسَارِ.", textEn: "Step 1: Represent 95 on the left." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 9 × 9 = 81، نَضَعُ 8 فِي الْمِئَاتِ وَ1 فِي الْعَشَرَاتِ.", textEn: "Step 2 (Tens): 9 × 9 = 81, place 8 in hundreds and 1 in tens." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): 5 × 9 = 45، نُضِيفُ 4 لِلْعَشَرَاتِ (1 + 4 = 5)، وَنَضَعُ 5 فِي الْآحَادِ. النَّتِيجَةُ: 855.", textEn: "Step 3 (Units): 5 × 9 = 45, add 4 to tens (1 + 4 = 5), and place 5 in units. Result: 855." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مِثَالٌ 5: الْوَارِي",
          titleEn: "Example 5: Wari",
          problem: "679 ÷ 7",
          tipAr: "💡 6 أَصْغَرُ مِنْ 7، لِذَا نَأْخُذُ رَقْمَيْنِ (67).",
          tipEn: "💡 6 is smaller than 7, so we take two digits (67).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 679 عَلَى الْيَمِينِ.", textEn: "Step 1: Represent 679 on the right." },
            { textAr: "الْخُطْوَةُ 2 (67 ÷ 7 = 9): نَضَعُ 9 فِي عَشَرَاتِ النَّاتِجِ. وَنَطْرَحُ (9 × 7 = 63) مِنَ الْـ 67 ← يَتَبَقَّى 49.", textEn: "Step 2 (67 ÷ 7 = 9): Place 9 in tens of result. Subtract (9 × 7 = 63) from 67 → remains 49." },
            { textAr: "الْخُطْوَةُ 3 (49 ÷ 7 = 7): نَضَعُ 7 فِي آحَادِ النَّاتِجِ. وَنَطْرَحُ (7 × 7 = 49) مِنَ الْـ 49 ← يَتَبَقَّى 0. النَّتِيجَةُ: 97.", textEn: "Step 3 (49 ÷ 7 = 7): Place 7 in units of result. Subtract (7 × 7 = 49) from 49 → remains 0. Result: 97." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْوَارِي",
          titleEn: "Example 6: Wari",
          problem: "552 ÷ 8",
          tipAr: "💡 5 أَصْغَرُ مِنْ 8، لِذَا نَأْخُذُ رَقْمَيْنِ (55).",
          tipEn: "💡 5 is smaller than 8, so we take two digits (55).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 552 عَلَى الْيَمِينِ.", textEn: "Step 1: Represent 552 on the right." },
            { textAr: "الْخُطْوَةُ 2 (55 ÷ 8 = 6): نَضَعُ 6 فِي عَشَرَاتِ النَّاتِجِ. وَنَطْرَحُ (6 × 8 = 48) مِنَ الْـ 55 ← يَتَبَقَّى 72.", textEn: "Step 2 (55 ÷ 8 = 6): Place 6 in tens of result. Subtract (6 × 8 = 48) from 55 → remains 72." },
            { textAr: "الْخُطْوَةُ 3 (72 ÷ 8 = 9): نَضَعُ 9 فِي آحَادِ النَّاتِجِ. وَنَطْرَحُ (9 × 8 = 72) مِنَ الْـ 72 ← يَتَبَقَّى 0. النَّتِيجَةُ: 69.", textEn: "Step 3 (72 ÷ 8 = 9): Place 9 in units of result. Subtract (9 × 8 = 72) from 72 → remains 0. Result: 69." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level4-challenge',
      timePerQuestionMs: 24000, // ضعف الوقت المحاكي
      requiredCorrect: 5, // 5 إجابات صحيحة من أصل 6
      questions: [
        { type: "mitori", numbers: [89, 91, 7, 1, 96], answer: 284, tipAr: "اِبْدَأْ بِالْعَدَدِ ذِي الْخَانَتَيْنِ", tipEn: "Start with the two-digit number" },
        { type: "mitori", numbers: [25, 5, 99, 93, 7], answer: 229, tipAr: "اِجْمَعِ الْأَرْقَامَ الصَّغِيرَةَ مَعًا", tipEn: "Group small numbers together" },
        { type: "multiplication", numbers: [91, 8], answer: 728, tipAr: "لَا تَنْسَ الْحَمْلَ", tipEn: "Don't forget the carry" },
        { type: "multiplication", numbers: [95, 9], answer: 855, tipAr: "الْحَمْلُ كَبِيرٌ، رَكِّزْ", tipEn: "Large carry, focus" },
        { type: "division", numbers: [679, 7], answer: 97, tipAr: "6 أَصْغَرُ مِنْ 7، خُذْ رَقْمَيْنِ", tipEn: "6 < 7, take two digits" },
        { type: "division", numbers: [552, 8], answer: 69, tipAr: "5 أَصْغَرُ مِنْ 8، خُذْ رَقْمَيْنِ", tipEn: "5 < 8, take two digits" }
      ]
    }
  ]
};