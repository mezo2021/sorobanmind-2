// src/components/games/MentalArchivesGame/data/level1Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_1_DATA: Chapter = {
  id: 'level1',
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  requires: ['intro'],
  next: 'level2',
  scenes: [
    // 1. مشهد القصة (الحوار الأصلي)
    {
      kind: 'dialogue',
      id: 'level1-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا! هَذِهِ أَلْوَاحُ إِبْلَا الطِّينِيَّة. الطَّيْفُ الصِّفْرِيُّ يَمْسَحُ الْأَرْقَامَ الَّتِي تَرْبِطُ السِّجِلَّات!",
          textEn: "We have arrived! These are the clay tablets of Ebla. The Zero Spectrum is wiping the numbers that connect the records!"
        },
        { 
          character: "jud", 
          textAr: "الْأَرْقَامُ مَوْجُودَة، لَكِنَّ الْمَجَامِيعَ غَيْرُ مُتَّصِلَة. سَنُصْلِحُهَا بِالْعَدِّ الذِّهْنِيِّ!",
          textEn: "The numbers are there, but the sums are disconnected. We will fix them with mental calculation!"
        }
      ]
    },
    // 2. مشهد الأمثلة (يحتوي على القاعدة العامة + الأمثلة الأربعة)
    {
      kind: 'example',
      id: 'level1-examples',
      // 👇 القاعدة العامة كفقرة نصية
      ruleAr: "الْقَاعِدَةُ الذَّهَبِيَّة: جَرِّبْ الْمُبَاشَرَ أَوَّلاً، فَإِنْ ضَاقَ الْأَسْفَلُ فَاسْتَعِنْ بِالْمُتَمِّمِ (5)، وَإِنْ امْتَلَأَ الْعَمُودُ أَوْ تَجَاوَزَتِ التِّسْعَة فَاسْتَعِنْ بِالْمُكَمِّلِ (10). وَإِنْ عَجَزْتَ عَنِ الطَّرْحِ، فَطَبِّقْ الْقَاعِدَةَ الْمُرَكَّبَة: (+10 - 5 + مُتَمِّمِ الْمُكَمِّل).",
      ruleEn: "GOLDEN RULE: Try direct addition first. If the lower beads are full, use Complement 5. If the column is full or exceeds Nine, use Complement 10. If you can't subtract, apply the Combined Rule: (+10 - 5 + the complement of the complement).",
      examples: [
        {
          titleAr: "مِثَال 1: الْجَمْعُ الْمُبَاشِر",
          titleEn: "Example 1: Direct Addition",
          problem: "5 + 2 + 1 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 5): نُنْزِلُ الْخَرَزَةَ الْعِلْوِيَّةَ لِتُلَامِسَ الْعَارِضَةَ.", textEn: "Step 1 (5): Bring down the upper bead to touch the bar." },
            { textAr: "الْخُطْوَةُ 2 (إِضَافَةُ 2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 2 (+2): Lift two lower beads." },
            { textAr: "الْخُطْوَةُ 3 (إِضَافَةُ 1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 3 (+1): Lift one lower bead." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 8.", textEn: "Final result: 8." }
          ]
        },
        {
          titleAr: "مِثَال 2: قَاعِدَةُ الْمُتَمِّم (صَدِيقُ 5)",
          titleEn: "Example 2: Complement 5",
          problem: "4 + 2 + 1 + 2 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 4): نَرْفَعُ 4 خَرَزَاتٍ سُفْلِيَّةٍ.", textEn: "Step 1 (4): Lift four lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+2): الْخَرَزَاتُ السُّفْلِيَّةُ مُمْتَلِئَة. نَسْتَخْدِمُ الْمُتَمِّم: نُنْزِلُ الْعِلْوِيَّةَ (5) وَنُبْعِدُ 3 خَرَزَاتٍ سُفْلِيَّةٍ.", textEn: "Step 2 (+2): Lower beads are full. Use Complement 5: Bring down upper bead (5) and move three lower beads away." },
            { textAr: "الْخُطْوَةُ 3 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 3 (+1): Lift one lower bead." },
            { textAr: "الْخُطْوَةُ 4 (+2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 4 (+2): Lift two lower beads." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 9.", textEn: "Final result: 9." }
          ]
        },
        {
          titleAr: "مِثَال 3: قَاعِدَةُ الْمُكَمِّل (صَدِيقُ 10)",
          titleEn: "Example 3: Complement 10",
          problem: "7 + 1 + 2 + 3 + 2 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 7): نُنْزِلُ الْعِلْوِيَّةَ وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 1 (7): Bring down upper bead and lift two lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً (النَّاتِجُ 8).", textEn: "Step 2 (+1): Lift one lower bead (result 8)." },
            { textAr: "الْخُطْوَةُ 3 (+2): نَسْتَخْدِمُ الْمُكَمِّل: نَرْفَعُ خَرَزَةً فِي الْعَشَرَاتِ وَنُصَفِّرُ الْآحَادَ.", textEn: "Step 3 (+2): Use Complement 10: Lift a bead in the tens column and clear the units." },
            { textAr: "الْخُطْوَةُ 4 (+3): نَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ (النَّاتِجُ 13).", textEn: "Step 4 (+3): Lift three lower beads (result 13)." },
            { textAr: "الْخُطْوَةُ 5 (+2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ. النَّتِيجَةُ النِّهَائِيَّة: 15.", textEn: "Step 5 (+2): Lift two lower beads. Final result: 15." }
          ]
        },
        {
          titleAr: "مِثَال 4: الْجَمْعُ الْمُرَكَّبُ (الْقَاعِدَةُ الذَّهَبِيَّة)",
          titleEn: "Example 4: Combined Rule",
          problem: "3 + 2 + 7 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 3): نَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ.", textEn: "Step 1 (3): Lift three lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+2): نَسْتَخْدِمُ الْمُتَمِّم: نُنْزِلُ الْعِلْوِيَّةَ (5) وَنُبْعِدُ 3 خَرَزَاتٍ سُفْلِيَّةٍ (النَّاتِجُ 5).", textEn: "Step 2 (+2): Use Complement 5: Bring down upper bead (5) and move three lower beads away (result 5)." },
            { textAr: "الْخُطْوَةُ 3 (+7): نَسْتَخْدِمُ الْقَاعِدَةَ الذَّهَبِيَّة (+10 - 5 + 2): نَرْفَعُ خَرَزَةً فِي الْعَشَرَاتِ، نَرْفَعُ الْعِلْوِيَّةَ لِلْأَعْلَى، وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 3 (+7): Use the Golden Rule (+10 - 5 + 2): Lift a ten bead, lift the upper bead, and lift two lower beads." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 12.", textEn: "Final result: 12." }
          ]
        }
      ]
    },
    // 3. مشهد التحدي (التمارين الأربعة)
    {
      kind: 'challenge',
      id: 'level1-challenge',
      timePerQuestionMs: 15000,
      requiredCorrect: 3,
      questions: [
        { type: "direct", numbers: [5, 1, 3], answer: 9 },
        { type: "complement5", numbers: [4, 2, 1, 2], answer: 9 },
        { type: "complement10", numbers: [1, 2, 8, 5, 4], answer: 20 },
        { type: "mitori", numbers: [5, 8, 7], answer: 20 }
      ]
    }
  ]
};