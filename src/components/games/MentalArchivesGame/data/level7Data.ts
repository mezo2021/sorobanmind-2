// src/components/games/MentalArchivesGame/data/level7Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_7_DATA: Chapter = {
  id: 'level7',
  titleAr: 'الْمُسْتَوَى السَّابِعُ: شَبَكَةُ النُّورِ — الِاتِّصَال (2 كْيُو)',
  titleEn: 'Level 7: Network of Light — Connection (2 Kyu)',
  requires: ['level6'],
  next: 'level8',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level7-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى شَبَكَةِ النُّورِ! هُنَا تَتَّصِلُ كُلُّ السِّجِلَّاتِ الَّتِي أَصْلَحْنَاهَا. الطَّيْفُ الصِّفْرِيُّ زَادَ مِنْ تَعْقِيدِ الْأَرْقَامِ لِيَمْنَعَنَا مِنْ رَبْطِهَا!",
          textEn: "We have arrived at the Network of Light! Here, all the records we've fixed connect. The Zero Spectrum has increased the complexity of the numbers to prevent us from linking them!"
        },
        { 
          character: "sorobana", 
          textAr: "أَحْسَنْتُمَا. فِي 2 كْيُو، سَيَصِيرُ الْمِيتُورِي سَبْعَةَ صُفُوفٍ. وَالضَّرْبُ سَيَصِيرُ خَانَتَيْنِ فِي خَانَتَيْنِ، وَالْقِسْمَةُ سَتَكُونُ عَلَى خَانَتَيْنِ. تَذَكَّرَا: التَّقْدِيرُ هُوَ سِرُّ النَّجَاحِ فِي الْقِسْمَةِ! هَلْ أَنْتُمَا مُسْتَعِدَّانِ لِلِاتِّصَالِ الْأَخِيرِ؟",
          textEn: "Well done. In 2 Kyu, Mitori will become seven rows. Multiplication will become two digits by two digits, and division will be by two digits. Remember: estimation is the secret to success in division! Are you both ready for the final connection?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level7-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي",
          titleEn: "Example 1: Mitori",
          problem: "125 + 432 + 789 + 214 + 567 + 891 + 345",
          tipAr: "💡 سَبْعَةُ صُفُوفٍ. تَرَكَّزْ عَلَى الْحَمْلِ لِلْآلَافِ.",
          tipEn: "💡 Seven rows. Focus on carrying to thousands.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 125.", textEn: "Step 1: Represent 125." },
            { textAr: "الْخُطْوَةُ 2 (+432): لِلْمِئَاتِ: نُضِيفُ 4 ← 525. لِلْعَشَرَاتِ: نُضِيفُ 3 ← (النَّاتِجُ الْمُؤَقَّتُ: 555). لِلْآحَادِ: نُضِيفُ 2 ← 557.", textEn: "Step 2 (+432): Hundreds: Add 4 → 525. Tens: Add 3 → (Intermediate: 555). Units: Add 2 → 557." },
            { textAr: "الْخُطْوَةُ 3 (+789): لِلْمِئَاتِ: نُضِيفُ 1 لِلْآلَافِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْمِئَاتِ ← 1257. لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 1337). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْآحَادِ ← 1346.", textEn: "Step 3 (+789): Hundreds: Add 1 to thousands (carry) and subtract 3 from hundreds → 1257. Tens: Add 1 to hundreds (carry) and subtract 2 from tens → (Intermediate: 1337). Units: Add 1 to tens (carry) and subtract 1 from units → 1346." },
            { textAr: "الْخُطْوَةُ 4 (+214): لِلْمِئَاتِ: نُضِيفُ 2 ← 1546. لِلْعَشَرَاتِ: نُضِيفُ 1 ← (النَّاتِجُ الْمُؤَقَّتُ: 1556). لِلْآحَادِ: نُضِيفُ 4 ← 1560.", textEn: "Step 4 (+214): Hundreds: Add 2 → 1546. Tens: Add 1 → (Intermediate: 1556). Units: Add 4 → 1560." },
            { textAr: "الْخُطْوَةُ 5 (+567): لِلْمِئَاتِ: نُضِيفُ 5 ← 2060. لِلْعَشَرَاتِ: نُضِيفُ 6 ← (النَّاتِجُ الْمُؤَقَّتُ: 2120). لِلْآحَادِ: نُضِيفُ 7 ← 2127.", textEn: "Step 5 (+567): Hundreds: Add 5 → 2060. Tens: Add 6 → (Intermediate: 2120). Units: Add 7 → 2127." },
            { textAr: "الْخُطْوَةُ 6 (+891): لِلْمِئَاتِ: نُضِيفُ 1 لِلْآلَافِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْمِئَاتِ ← 2927. لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 3017). لِلْآحَادِ: نُضِيفُ 1 ← 3018.", textEn: "Step 6 (+891): Hundreds: Add 1 to thousands (carry) and subtract 2 from hundreds → 2927. Tens: Add 1 to hundreds (carry) and subtract 1 from tens → (Intermediate: 3017). Units: Add 1 → 3018." },
            { textAr: "الْخُطْوَةُ 7 (+345): لِلْمِئَاتِ: نُضِيفُ 3 ← 3318. لِلْعَشَرَاتِ: نُضِيفُ 4 ← (النَّاتِجُ الْمُؤَقَّتُ: 3358). لِلْآحَادِ: نُضِيفُ 5 ← 3363. النَّتِيجَةُ: 3363.", textEn: "Step 7 (+345): Hundreds: Add 3 → 3318. Tens: Add 4 → (Intermediate: 3358). Units: Add 5 → 3363. Result: 3363." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي",
          titleEn: "Example 2: Mitori",
          problem: "987 + 654 + 321 + 876 + 543 + 210 + 789",
          tipAr: "💡 اِحْذَرْ مِنْ نِسْيَانِ الصِّفْرِ فِي الصَّفِّ السَّادِسِ.",
          tipEn: "💡 Be careful not to forget the zero in the sixth row.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 987.", textEn: "Step 1: Represent 987." },
            { textAr: "الْخُطْوَةُ 2 (+654): لِلْمِئَاتِ: نُضِيفُ 6 ← 1587. لِلْعَشَرَاتِ: نُضِيفُ 5 ← (النَّاتِجُ الْمُؤَقَّتُ: 1637). لِلْآحَادِ: نُضِيفُ 4 ← 1641.", textEn: "Step 2 (+654): Hundreds: Add 6 → 1587. Tens: Add 5 → (Intermediate: 1637). Units: Add 4 → 1641." },
            { textAr: "الْخُطْوَةُ 3 (+321): لِلْمِئَاتِ: نُضِيفُ 3 ← 1941. لِلْعَشَرَاتِ: نُضِيفُ 2 ← (النَّاتِجُ الْمُؤَقَّتُ: 1961). لِلْآحَادِ: نُضِيفُ 1 ← 1962.", textEn: "Step 3 (+321): Hundreds: Add 3 → 1941. Tens: Add 2 → (Intermediate: 1961). Units: Add 1 → 1962." },
            { textAr: "الْخُطْوَةُ 4 (+876): لِلْمِئَاتِ: نُضِيفُ 8 ← 2762. لِلْعَشَرَاتِ: نُضِيفُ 7 ← (النَّاتِجُ الْمُؤَقَّتُ: 2832). لِلْآحَادِ: نُضِيفُ 6 ← 2838.", textEn: "Step 4 (+876): Hundreds: Add 8 → 2762. Tens: Add 7 → (Intermediate: 2832). Units: Add 6 → 2838." },
            { textAr: "الْخُطْوَةُ 5 (+543): لِلْمِئَاتِ: نُضِيفُ 5 ← 3338. لِلْعَشَرَاتِ: نُضِيفُ 4 ← (النَّاتِجُ الْمُؤَقَّتُ: 3378). لِلْآحَادِ: نُضِيفُ 3 ← 3381.", textEn: "Step 5 (+543): Hundreds: Add 5 → 3338. Tens: Add 4 → (Intermediate: 3378). Units: Add 3 → 3381." },
            { textAr: "الْخُطْوَةُ 6 (+210): لِلْمِئَاتِ: نُضِيفُ 2 ← 3581. لِلْعَشَرَاتِ: نُضِيفُ 1 ← (النَّاتِجُ الْمُؤَقَّتُ: 3591). لِلْآحَادِ: نُضِيفُ 0 (نَتْرُكُهَا كَمَا هِيَ) ← 3591.", textEn: "Step 6 (+210): Hundreds: Add 2 → 3581. Tens: Add 1 → (Intermediate: 3591). Units: Add 0 (leave as is) → 3591." },
            { textAr: "الْخُطْوَةُ 7 (+789): لِلْمِئَاتِ: نُضِيفُ 1 لِلْآلَافِ (حَمْل) وَنَطْرَحُ 3 مِنَ الْمِئَاتِ ← 4291. لِلْعَشَرَاتِ: نُضِيفُ 1 لِلْمِئَاتِ (حَمْل) وَنَطْرَحُ 2 مِنَ الْعَشَرَاتِ ← (النَّاتِجُ الْمُؤَقَّتُ: 4371). لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (حَمْل) وَنَطْرَحُ 1 مِنَ الْآحَادِ ← 4380. النَّتِيجَةُ: 4380.", textEn: "Step 7 (+789): Hundreds: Add 1 to thousands (carry) and subtract 3 from hundreds → 4291. Tens: Add 1 to hundreds (carry) and subtract 2 from tens → (Intermediate: 4371). Units: Add 1 to tens (carry) and subtract 1 from units → 4380. Result: 4380." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "33 × 23",
          tipAr: "💡 اضْرِبْ كُلَّ خَانَةٍ فِي الْخَانَةِ الْمُقَابِلَةِ لَهَا.",
          tipEn: "💡 Multiply each digit by the corresponding digit.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 33.", textEn: "Step 1: Represent 33." },
            { textAr: "الْخُطْوَةُ 2 (عَشَرَاتُ 33 × عَشَرَاتُ 23): 3 × 2 = 6 ← نَضَعُ 6 فِي الْمِئَاتِ.", textEn: "Step 2 (Tens of 33 × Tens of 23): 3 × 2 = 6 → Place 6 in hundreds." },
            { textAr: "الْخُطْوَةُ 3 (عَشَرَاتُ 33 × آحَادُ 23): 3 × 3 = 9 ← نُضِيفُ 9 إِلَى الْعَشَرَاتِ. (النَّاتِجُ الْمُؤَقَّتُ: 690).", textEn: "Step 3 (Tens of 33 × Units of 23): 3 × 3 = 9 → Add 9 to tens. (Intermediate: 690)." },
            { textAr: "الْخُطْوَةُ 4 (آحَادُ 33 × عَشَرَاتُ 23): 3 × 2 = 6 ← نُضِيفُ 6 إِلَى الْعَشَرَاتِ (9+6=15، فَيَصْعَدُ 1 لِلْمِئَاتِ وَيَبْقَى 5 فِي الْعَشَرَاتِ). (النَّاتِجُ الْمُؤَقَّتُ: 750).", textEn: "Step 4 (Units of 33 × Tens of 23): 3 × 2 = 6 → Add 6 to tens (9+6=15, carry 1 to hundreds and leave 5 in tens). (Intermediate: 750)." },
            { textAr: "الْخُطْوَةُ 5 (آحَادُ 33 × آحَادُ 23): 3 × 3 = 9 ← نَضَعُ 9 فِي الْآحَادِ. النَّتِيجَةُ النِّهَائِيَّةُ: 759.", textEn: "Step 5 (Units of 33 × Units of 23): 3 × 3 = 9 → Place 9 in units. Result: 759." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "56 × 71",
          tipAr: "💡 الْحَمْلُ يَصْعَدُ لِلْآلَافِ، تَرَكَّزْ.",
          tipEn: "💡 The carry goes up to thousands, focus.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 56.", textEn: "Step 1: Represent 56." },
            { textAr: "الْخُطْوَةُ 2 (عَشَرَاتُ 56 × عَشَرَاتُ 71): 5 × 7 = 35 ← نَضَعُ 3 فِي الْآلَافِ، وَ 5 فِي الْمِئَاتِ.", textEn: "Step 2 (Tens of 56 × Tens of 71): 5 × 7 = 35 → Place 3 in thousands, and 5 in hundreds." },
            { textAr: "الْخُطْوَةُ 3 (عَشَرَاتُ 56 × آحَادُ 71): 5 × 1 = 5 ← نُضِيفُ 5 إِلَى الْعَشَرَاتِ. (النَّاتِجُ الْمُؤَقَّتُ: 3550).", textEn: "Step 3 (Tens of 56 × Units of 71): 5 × 1 = 5 → Add 5 to tens. (Intermediate: 3550)." },
            { textAr: "الْخُطْوَةُ 4 (آحَادُ 56 × عَشَرَاتُ 71): 6 × 7 = 42 ← نُضِيفُ 4 إِلَى الْمِئَاتِ (5+4=9)، وَنُضِيفُ 2 إِلَى الْعَشَرَاتِ (5+2=7). (النَّاتِجُ الْمُؤَقَّتُ: 3970).", textEn: "Step 4 (Units of 56 × Tens of 71): 6 × 7 = 42 → Add 4 to hundreds (5+4=9), and add 2 to tens (5+2=7). (Intermediate: 3970)." },
            { textAr: "الْخُطْوَةُ 5 (آحَادُ 56 × آحَادُ 71): 6 × 1 = 6 ← نُضِيفُ 6 إِلَى الْآحَادِ. النَّتِيجَةُ النِّهَائِيَّةُ: 3976.", textEn: "Step 5 (Units of 56 × Units of 71): 6 × 1 = 6 → Add 6 to units. Result: 3976." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مِثَالٌ 5: الْوَارِي",
          titleEn: "Example 5: Wari",
          problem: "350 ÷ 14",
          tipAr: "💡 اِسْتَخْدِمِ التَّقْدِيرَ لِمَعْرِفَةِ كَمْ مَرَّةً يَدْخُلُ 14 فِي 35.",
          tipEn: "💡 Use estimation to find how many times 14 fits into 35.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 350.", textEn: "Step 1: Represent 350." },
            { textAr: "الْخُطْوَةُ 2 (تَقْدِيرُ الْعَشَرَاتِ): نَأْخُذُ أَوَّلَ رَقْمَيْنِ (35) لِأَنَّ الْمَقْسُومَ عَلَيْهِ (14) مِنْ خَانَتَيْنِ. نُقَدِّرُ: 35 ÷ 14 = 2 (لِأَنَّ 14 × 2 = 28، وَ 14 × 3 = 42 أَكْبَرُ مِنْ 35). نَضَعُ 2 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ) أَيْ (20). نَطْرَحُ: (20 × 14 = 280) ← 350 - 280 = 70 (يَتَبَقَّى 70).", textEn: "Step 2 (Estimate Tens): Take first two digits (35) because divisor (14) is two digits. Estimate: 35 ÷ 14 = 2 (since 14×2=28, and 14×3=42 > 35). Place 2 in tens column (of result) i.e., 20. Subtract: (20 × 14 = 280) → 350 - 280 = 70 (remains 70)." },
            { textAr: "الْخُطْوَةُ 3 (تَقْدِيرُ الْآحَادِ): نَنْظُرُ لِلْبَاقِي (70). نُقَدِّرُ: 70 ÷ 14 = 5 (لِأَنَّ 14 × 5 = 70). نَضَعُ 5 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (5 × 14 = 70) ← 70 - 70 = 0. النَّتِيجَةُ النِّهَائِيَّةُ: 25.", textEn: "Step 3 (Estimate Units): Look at the remainder (70). Estimate: 70 ÷ 14 = 5 (since 14 × 5 = 70). Place 5 in units column (of result). Subtract: (5 × 14 = 70) → 70 - 70 = 0. Result: 25." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْوَارِي",
          titleEn: "Example 6: Wari",
          problem: "5751 ÷ 71",
          tipAr: "💡 57 أَصْغَرُ مِنْ 71، لِذَا نَأْخُذُ ثَلَاثَةَ أَرْقَامٍ (575).",
          tipEn: "💡 57 is smaller than 71, so we take three digits (575).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 5751.", textEn: "Step 1: Represent 5751." },
            { textAr: "الْخُطْوَةُ 2 (تَقْدِيرُ الْعَشَرَاتِ): 57 أَصْغَرُ مِنْ 71، لِذَا نَأْخُذُ 575. نُقَدِّرُ: 575 ÷ 71 = 8 (لِأَنَّ 71 × 8 = 568، وَ 71 × 9 = 639 أَكْبَرُ مِنْ 575). نَضَعُ 8 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (8 × 71 = 568) ← 575 - 568 = 7 (يَتَبَقَّى 71).", textEn: "Step 2 (Estimate Tens): 57 < 71, so take 575. Estimate: 575 ÷ 71 = 8 (since 71×8=568, and 71×9=639 > 575). Place 8 in tens column. Subtract: (8 × 71 = 568) → 575 - 568 = 7 (remains 71)." },
            { textAr: "الْخُطْوَةُ 3 (تَقْدِيرُ الْآحَادِ): نُقَدِّرُ: 71 ÷ 71 = 1. نَضَعُ 1 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (1 × 71 = 71) ← 71 - 71 = 0. النَّتِيجَةُ النِّهَائِيَّةُ: 81.", textEn: "Step 3 (Estimate Units): Estimate: 71 ÷ 71 = 1. Place 1 in units column. Subtract: (1 × 71 = 71) → 71 - 71 = 0. Result: 81." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level7-challenge',
      timePerQuestionMs: 24000, // ضعف الوقت المحاكي
      requiredCorrect: 5, // 5 إجابات صحيحة من أصل 6
      questions: [
        { type: "mitori", numbers: [125, 432, 789, 214, 567, 891, 345], answer: 3363, tipAr: "سَبْعَةُ صُفُوفٍ. تَرَكَّزْ عَلَى الْحَمْلِ", tipEn: "Seven rows. Focus on carry" },
        { type: "mitori", numbers: [987, 654, 321, 876, 543, 210, 789], answer: 4380, tipAr: "اِحْذَرْ مِنْ نِسْيَانِ الصِّفْرِ", tipEn: "Careful with the zero" },
        { type: "multiplication", numbers: [33, 23], answer: 759, tipAr: "اضْرِبْ كُلَّ خَانَةٍ فِي الْخَانَةِ الْمُقَابِلَةِ", tipEn: "Multiply each digit by the corresponding digit" },
        { type: "multiplication", numbers: [56, 71], answer: 3976, tipAr: "الْحَمْلُ يَصْعَدُ لِلْآلَافِ، تَرَكَّزْ", tipEn: "Carry goes to thousands, focus" },
        { type: "division", numbers: [350, 14], answer: 25, tipAr: "اِسْتَخْدِمِ التَّقْدِيرَ لِمَعْرِفَةِ كَمْ مَرَّةً يَدْخُلُ 14", tipEn: "Use estimation" },
        { type: "division", numbers: [5751, 71], answer: 81, tipAr: "57 أَصْغَرُ مِنْ 71، خُذْ 575", tipEn: "57 < 71, take 575" }
      ]
    }
  ]
};