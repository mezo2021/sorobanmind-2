// src/components/games/MentalArchivesGame/data/level2Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_2_DATA: Chapter = {
  id: 'level2',
  // 🆕 P15: إضافة الموقع (أوغاريت) ونطاق الكيو
  titleAr: 'المستوى الثاني: إيقاع العلامات — أوغاريت (8-7 كيو)',
  titleEn: 'Level 2: Rhythm of Signs — Ugarit (8-7 Kyu)',
  requires: ['level1'],
  next: 'level3',
  scenes: [
    {
      kind: 'dialogue',
      id: 'level2-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى أُوغَارِيت! هَذِهِ الْمَكْتَبَةُ تَحْتَوِي عَلَى أَقْدَمِ الْحُرُوفِ الْأَبْجَدِيَّةِ الْمَسْمَارِيَّةِ. لَكِنَّ الطَّيْفَ الصِّفْرِيَّ خَلَطَ بَيْنَ الْحُرُوفِ وَالْأَرْقَامِ!",
          textEn: "We have arrived at Ugarit! This library contains the oldest cuneiform alphabets. But the Zero Spectrum has mixed up the letters and numbers!"
        },
        { 
          character: "jud", 
          textAr: "انْظُرْ إِلَى هَذَا اللَّوْحِ. كُلَّمَا تَجَاوَزَ الْمَجْمُوعُ الْعَشَرَةَ، اخْتَفَتِ الْأَرْقَامُ! نَحْتَاجُ إِلَى الْحَمْلِ إِلَى الْخَانَةِ التَّالِيَةِ.",
          textEn: "Look at this tablet. Whenever the sum exceeds ten, the numbers disappear! We need to carry over to the next column."
        },
        { 
          character: "sorobana", 
          textAr: "أَحْسَنْتُمَا. فِي هَذَا الْمُسْتَوَى، سَنُطَبِّقُ نَفْسَ الْقَوَاعِدِ لَكِنْ مَعَ 4 وَ 5 صُفُوفٍ.",
          textEn: "Well done. In this level, we will apply the same rules but with 4 and 5 rows."
        }
      ]
    },
    {
      kind: 'example',
      id: 'level2-examples',
      examples: [
        {
          titleAr: "مثال 1",
          titleEn: "Example 1",
          problem: "1 + 5 + 2 + 1",
          ruleTitleAr: "الْقَاعِدَةُ الْأُولَى: الْجَمْعُ الْمُبَاشِرُ (4 صُفُوفٍ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: إِنْ وَجَدْتَ مَكَاناً، حَرِّكْ مُبَاشَرَةً.",
          ruleTitleEn: "Rule 1: Direct Addition (4 Rows)",
          ruleDescEn: "Golden Rule: If there is space, move directly.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 1.", textEn: "Step 1: Represent 1." },
            { textAr: "الْخُطْوَةُ 2 (+5): لِلْآحَادِ: نُنْزِلُ الْعِلْوِيَّةَ مُبَاشَرَةً ← 6.", textEn: "Step 2 (+5): Units: Bring down the upper bead directly → 6." },
            { textAr: "الْخُطْوَةُ 3 (+2): لِلْآحَادِ: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ مُبَاشَرَةً ← 8.", textEn: "Step 3 (+2): Units: Lift two lower beads directly → 8." },
            { textAr: "الْخُطْوَةُ 4 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً مُبَاشَرَةً ← 9. النَّتِيجَةُ: 9.", textEn: "Step 4 (+1): Units: Lift one lower bead directly → 9. Result: 9." }
          ]
        },
        {
          titleAr: "مثال 2",
          titleEn: "Example 2",
          problem: "1 + 2 + 4 + 1",
          ruleTitleAr: "الْقَاعِدَةُ الثَّانِيَةُ: أَصْدِقَاءُ 5 (4 صُفُوفٍ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: أَضِفْ 5، وَاطْرَحِ (الْمُتَمِّمَ).",
          ruleTitleEn: "Rule 2: Friends of 5 (4 Rows)",
          ruleDescEn: "Golden Rule: Add 5, subtract the complement.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 1.", textEn: "Step 1: Represent 1." },
            { textAr: "الْخُطْوَةُ 2 (+2): لِلْآحَادِ: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ مُبَاشَرَةً ← 3.", textEn: "Step 2 (+2): Units: Lift two lower beads directly → 3." },
            { textAr: "الْخُطْوَةُ 3 (+4): لِلْآحَادِ: نُنْزِلُ الْعِلْوِيَّةَ وَنَطْرَحُ 1 مِنَ الْآحَادِ (صَدِيقُ 5) ← 7.", textEn: "Step 3 (+4): Units: Bring down the upper bead and subtract 1 from units (Friend of 5) → 7." },
            { textAr: "الْخُطْوَةُ 4 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً ← 8. النَّتِيجَةُ: 8.", textEn: "Step 4 (+1): Units: Lift one lower bead → 8. Result: 8." }
          ]
        },
        {
          titleAr: "مثال 3",
          titleEn: "Example 3",
          problem: "7 + 1 + 2 + 3 + 2",
          ruleTitleAr: "الْقَاعِدَةُ الثَّالِثَةُ: أَصْدِقَاءُ 10 (5 صُفُوفٍ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: أَضِفْ 10، وَاطْرَحِ (الْمُكَمِّلَ).",
          ruleTitleEn: "Rule 3: Friends of 10 (5 Rows)",
          ruleDescEn: "Golden Rule: Add 10, subtract the complement.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 7.", textEn: "Step 1: Represent 7." },
            { textAr: "الْخُطْوَةُ 2 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً ← 8.", textEn: "Step 2 (+1): Units: Lift one lower bead → 8." },
            { textAr: "الْخُطْوَةُ 3 (+2): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 8 مِنَ الْآحَادِ (صَدِيقُ 10) ← 10.", textEn: "Step 3 (+2): Units: Add 1 to tens and subtract 8 from units (Friend of 10) → 10." },
            { textAr: "الْخُطْوَةُ 4 (+3): لِلْآحَادِ: نَرْفَعُ 3 سُفْلِيَّاتٍ ← 13.", textEn: "Step 4 (+3): Units: Lift 3 lower beads → 13." },
            { textAr: "الْخُطْوَةُ 5 (+2): لِلْآحَادِ: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ ← 15. النَّتِيجَةُ: 15.", textEn: "Step 5 (+2): Units: Lift two lower beads → 15. Result: 15." }
          ]
        },
        {
          titleAr: "مثال 4",
          titleEn: "Example 4",
          problem: "9 + 5 + 3 + 1 + 6",
          ruleTitleAr: "الْقَاعِدَةُ الرَّابِعَةُ: الْجَمْعُ الْمُرَكَّبُ (5 صُفُوفٍ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: +10 - 5 + مُتَمِّمُ الْمُكَمِّلِ.",
          ruleTitleEn: "Rule 4: Combined Addition (5 Rows)",
          ruleDescEn: "Golden Rule: +10 - 5 + Complement of the Complement.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 9.", textEn: "Step 1: Represent 9." },
            { textAr: "الْخُطْوَةُ 2 (+5): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 5 مِنَ الْآحَادِ (صَدِيقُ 10) ← 14.", textEn: "Step 2 (+5): Units: Add 1 to tens and subtract 5 from units (Friend of 10) → 14." },
            { textAr: "الْخُطْوَةُ 3 (+3): لِلْآحَادِ: نَرْفَعُ 3 سُفْلِيَّاتٍ ← 17.", textEn: "Step 3 (+3): Units: Lift 3 lower beads → 17." },
            { textAr: "الْخُطْوَةُ 4 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً ← 18.", textEn: "Step 4 (+1): Units: Lift one lower bead → 18." },
            { textAr: "الْخُطْوَةُ 5 (+6): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (+10)، نَرْفَعُ الْعِلْوِيَّةَ (-5)، وَنَرْفَعُ خَرَزَةً سُفْلِيَّةً (+1) (الْقَاعِدَةُ الْمُرَكَّبَةُ) ← 24. النَّتِيجَةُ: 24.", textEn: "Step 5 (+6): Units: Add 1 to tens (+10), lift the upper bead (-5), and lift one lower bead (+1) (Combined Rule) → 24. Result: 24." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level2-challenge',
      timePerQuestionMs: 13200,
      requiredCorrect: 3,
      questions: [
        { type: "direct", numbers: [1, 2, 1, 3], answer: 7 },
        { type: "complement5", numbers: [1, 2, 1, 2], answer: 6 },
        { type: "complement10", numbers: [8, 3, 4, 1, 2], answer: 18 },
        { type: "combined", numbers: [3, 5, 7, 9, 5], answer: 29 }
      ]
    }
  ]
};