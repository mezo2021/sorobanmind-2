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
    // 2. مشهد الأمثلة (يحتوي على القاعدة العامة + الأمثلة الأربعة الجديدة)
    {
      kind: 'example',
      id: 'level1-examples',
      ruleAr: "الْقَاعِدَةُ الذَّهَبِيَّة: جَرِّبْ الْمُبَاشَرَ أَوَّلاً، فَإِنْ ضَاقَ الْأَسْفَلُ فَاسْتَعِنْ بِالْمُتَمِّمِ (5)، وَإِنْ امْتَلَأَ الْعَمُودُ أَوْ تَجَاوَزَتِ التِّسْعَة فَاسْتَعِنْ بِالْمُكَمِّلِ (10). وَإِنْ عَجَزْتَ عَنِ الطَّرْحِ، فَطَبِّقْ الْقَاعِدَةَ الْمُرَكَّبَة: (+10 - 5 + مُتَمِّمِ الْمُكَمِّل).",
      ruleEn: "GOLDEN RULE: Try direct addition first. If the lower beads are full, use Complement 5. If the column is full or exceeds Nine, use Complement 10. If you can't subtract, apply the Combined Rule: (+10 - 5 + the complement of the complement).",
      examples: [
        {
          titleAr: "مِثَال 1: الْجَمْعُ الْمُبَاشِر",
          titleEn: "Example 1: Direct Addition",
          problem: "1 + 2 + 1 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 1 (1): Lift one lower bead." },
            { textAr: "الْخُطْوَةُ 2 (إِضَافَةُ 2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 2 (+2): Lift two lower beads." },
            { textAr: "الْخُطْوَةُ 3 (إِضَافَةُ 1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 3 (+1): Lift one lower bead." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 4.", textEn: "Final result: 4." }
          ]
        },
        {
          titleAr: "مِثَال 2: قَاعِدَةُ الْمُتَمِّم (صَدِيقُ 5)",
          titleEn: "Example 2: Complement 5",
          problem: "2 + 3 + 1 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 1 (2): Lift two lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+3): الْخَرَزَاتُ السُّفْلِيَّةُ مُمْتَلِئَة. نَسْتَخْدِمُ الْمُتَمِّم: نُنْزِلُ الْعِلْوِيَّةَ (5) وَنُبْعِدُ 2 خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (النَّاتِجُ 5).", textEn: "Step 2 (+3): Lower beads are full. Use Complement 5: Bring down upper bead (5) and move two lower beads away (result 5)." },
            { textAr: "الْخُطْوَةُ 3 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 3 (+1): Lift one lower bead." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 6.", textEn: "Final result: 6." }
          ]
        },
        {
          titleAr: "مِثَال 3: قَاعِدَةُ الْمُكَمِّل (صَدِيقُ 10)",
          titleEn: "Example 3: Complement 10",
          problem: "8 + 4 + 1 = ؟",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 8): نُنْزِلُ الْعِلْوِيَّةَ وَنَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ.", textEn: "Step 1 (8): Bring down upper bead and lift three lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+4): نَسْتَخْدِمُ الْمُكَمِّل: نَرْفَعُ خَرَزَةً فِي الْعَشَرَاتِ وَنَطْرَحُ 6 مِنَ الْآحَادِ (8-6=2). النَّاتِجُ 12.", textEn: "Step 2 (+4): Use Complement 10: Lift a bead in the tens column and subtract 6 from the units (8-6=2). Result 12." },
            { textAr: "الْخُطْوَةُ 3 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً.", textEn: "Step 3 (+1): Lift one lower bead." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 13.", textEn: "Final result: 13." }
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
    // 3. مشهد التحدي (التمارين الأربعة الجديدة)
    {
      kind: 'challenge',
      id: 'level1-challenge',
      timePerQuestionMs: 15000,
      requiredCorrect: 3,
      questions: [
        { type: "direct", numbers: [5, 2, 1], answer: 8 },
        { type: "complement5", numbers: [4, 1, 2], answer: 7 },
        { type: "complement10", numbers: [7, 5, 2], answer: 14 },
        { type: "mitori", numbers: [6, 9, 8], answer: 23 }
      ]
    }
  ]
};