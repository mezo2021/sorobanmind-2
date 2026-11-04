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
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 1 (1): Lift one lower bead." },
            { textAr: "الْخُطْوَةُ 2 (+5): نُنْزِلُ الْخَرَزَةَ الْعِلْوِيَّةَ.", textEn: "Step 2 (+5): Bring down the upper bead." },
            { textAr: "الْخُطْوَةُ 3 (+2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 3 (+2): Lift two lower beads." },
            { textAr: "الْخُطْوَةُ 4 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً.", textEn: "Step 4 (+1): Lift one lower bead." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 9.", textEn: "Final result: 9." }
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
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 1): نَرْفَعُ خَرَزَةً.", textEn: "Step 1 (1): Lift one lower bead." },
            { textAr: "الْخُطْوَةُ 2 (+2): نَرْفَعُ خَرَزَتَيْنِ.", textEn: "Step 2 (+2): Lift two lower beads." },
            { textAr: "الْخُطْوَةُ 3 (+4): نُنْزِلُ الْعِلْوِيَّةَ (+5)، وَنُبْعِدُ خَرَزَةً (-1).", textEn: "Step 3 (+4): Bring down upper bead (+5), move one lower bead away (-1)." },
            { textAr: "الْخُطْوَةُ 4 (+1): نَرْفَعُ خَرَزَةً. النَّتِيجَةُ النِّهَائِيَّة: 8.", textEn: "Step 4 (+1): Lift one lower bead. Final result: 8." }
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
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 7): نُنْزِلُ الْعِلْوِيَّةَ، وَنَرْفَعُ 2 سُفْلِيَّتَيْنِ.", textEn: "Step 1 (7): Bring down upper bead, lift two lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+1): نَرْفَعُ خَرَزَةً (النَّاتِجُ 8).", textEn: "Step 2 (+1): Lift one lower bead (result 8)." },
            { textAr: "الْخُطْوَةُ 3 (+2): نَرْفَعُ خَرَزَةً فِي الْعَشَرَاتِ (+10)، وَنُبْعِدُ الْعِلْوِيَّةَ وَ 3 سُفْلِيَّاتٍ (-8). النَّاتِجُ 10.", textEn: "Step 3 (+2): Lift a ten bead (+10), move upper bead and 3 lower beads away (-8). Result 10." },
            { textAr: "الْخُطْوَةُ 4 (+3): نَرْفَعُ 3 سُفْلِيَّاتٍ (النَّاتِجُ 13).", textEn: "Step 4 (+3): Lift three lower beads (result 13)." },
            { textAr: "الْخُطْوَةُ 5 (+2): نَرْفَعُ خَرَزَتَيْنِ. النَّتِيجَةُ النِّهَائِيَّة: 15.", textEn: "Step 5 (+2): Lift two lower beads. Final result: 15." }
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
            { textAr: "الْخُطْوَةُ 1 (9): نُنْزِلُ الْعِلْوِيَّةَ وَنَرْفَعُ 4 سُفْلِيَّاتٍ.", textEn: "Step 1 (9): Bring down upper bead, lift four lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+5): نَرْفَعُ عَشَرَةً (+10)، وَنُبْعِدُ الْعِلْوِيَّةَ (-5). النَّاتِجُ 14.", textEn: "Step 2 (+5): Lift ten (+10), move upper bead away (-5). Result 14." },
            { textAr: "الْخُطْوَةُ 3 (+3): نَرْفَعُ 3 سُفْلِيَّاتٍ (النَّاتِجُ 17).", textEn: "Step 3 (+3): Lift three lower beads (result 17)." },
            { textAr: "الْخُطْوَةُ 4 (+1): نَرْفَعُ خَرَزَةً (النَّاتِجُ 18).", textEn: "Step 4 (+1): Lift one lower bead (result 18)." },
            { textAr: "الْخُطْوَةُ 5 (+6): نَرْفَعُ عَشَرَةً (+10)، نُبْعِدُ الْعِلْوِيَّةَ (-5)، وَنَرْفَعُ خَرَزَةً (+1). النَّتِيجَةُ النِّهَائِيَّة: 24.", textEn: "Step 5 (+6): Lift ten (+10), move upper bead away (-5), lift one lower bead (+1). Final result: 24." }
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