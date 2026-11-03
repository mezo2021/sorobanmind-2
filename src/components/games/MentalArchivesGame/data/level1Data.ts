// src/components/games/MentalArchivesGame/data/level1Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_1_DATA: Chapter = {
  id: 'level1',
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  requires: ['intro'],
  next: 'level2',
  scenes: [
    // 1. مشهد القصة
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
    // 2. مشهد الأمثلة
    {
      kind: 'example',
      id: 'level1-examples',
      examples: [
        // 1️⃣ المثال 1: الجمع المباشر
        {
          titleAr: "مثال 1",
          titleEn: "Example 1",
          problem: "1 + 2 + 1",
          ruleTitleAr: "الْقَاعِدَةُ الْأُولَى: الْجَمْعُ الْمُبَاشِرُ",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: إِنْ وَجَدْتَ مَكَاناً، حَرِّكْ مُبَاشَرَةً.",
          ruleTitleEn: "Rule 1: Direct Addition",
          ruleDescEn: "Golden Rule: If there is space, move directly.",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 1 (1): Lift one lower bead towards the bar." },
            { textAr: "الْخُطْوَةُ 2 (+2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 2 (+2): Lift two lower beads towards the bar." },
            { textAr: "الْخُطْوَةُ 3 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 3 (+1): Lift one lower bead towards the bar." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 4.", textEn: "Final result: 4." }
          ]
        },
        // 2️⃣ المثال 2: أصدقاء 5 (المتمم)
        {
          titleAr: "مثال 2",
          titleEn: "Example 2",
          problem: "2 + 3 + 1",
          ruleTitleAr: "الْقَاعِدَةُ الثَّانِيَةُ: أَصْدِقَاءُ 5 (الْمُتَمِّمُ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: أَضِفْ 5، وَاطْرَحِ (الْمُتَمِّمَ). جَدْوَلُ الْمُتَمِّمَاتِ: (مُتَمِّمُ 1 هُوَ 4) - (مُتَمِّمُ 2 هُوَ 3) - (مُتَمِّمُ 3 هُوَ 2) - (مُتَمِّمُ 4 هُوَ 1).",
          ruleTitleEn: "Rule 2: Friends of 5 (Small Friend)",
          ruleDescEn: "Golden Rule: Add 5, subtract the complement. Complements: (Complement of 1 is 4) - (Complement of 2 is 3) - (Complement of 3 is 2) - (Complement of 4 is 1).",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 2): نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 1 (2): Lift two lower beads towards the bar." },
            { textAr: "الْخُطْوَةُ 2 (+3): نُنْزِلُ الْخَرَزَةَ الْعِلْوِيَّةَ بَاتِّجَاهِ الْعَارِضَةِ (+5)، وَنُبْعِدُ 2 خَرَزَتَيْنِ سُفْلِيَّتَيْنِ عَنِ الْعَارِضَةِ (لِأَنَّ مُتَمِّمَ 3 هُوَ 2).", textEn: "Step 2 (+3): Bring down the upper bead towards the bar (+5), and move two lower beads away from the bar (Friend of 3 is 2)." },
            { textAr: "الْخُطْوَةُ 3 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 3 (+1): Lift one lower bead towards the bar." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 6.", textEn: "Final result: 6." }
          ]
        },
        // 3️⃣ المثال 3: أصدقاء 10 (المكمل)
        {
          titleAr: "مثال 3",
          titleEn: "Example 3",
          problem: "7 + 1 + 2",
          ruleTitleAr: "الْقَاعِدَةُ الثَّالِثَةُ: أَصْدِقَاءُ 10 (الْمُكَمِّلُ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: أَضِفْ 10، وَاطْرَحِ (الْمُكَمِّلَ). جَدْوَلُ الْمُكَمِّلَاتِ: (مُكَمِّلُ 1 هُوَ 9) - (مُكَمِّلُ 2 هُوَ 8) - (مُكَمِّلُ 3 هُوَ 7) - (مُكَمِّلُ 4 هُوَ 6) - (مُكَمِّلُ 5 هُوَ 5) - (مُكَمِّلُ 6 هُوَ 4) - (مُكَمِّلُ 7 هُوَ 3) - (مُكَمِّلُ 8 هُوَ 2) - (مُكَمِّلُ 9 هُوَ 1).",
          ruleTitleEn: "Rule 3: Friends of 10 (Big Friend)",
          ruleDescEn: "Golden Rule: Add 10, subtract the complement. Complements: (Complement of 1 is 9) - (Complement of 2 is 8) - ... - (Complement of 9 is 1).",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 7): نُنْزِلُ الْعِلْوِيَّةَ بَاتِّجَاهِ الْعَارِضَةِ، وَنَرْفَعُ 2 خَرَزَتَيْنِ سُفْلِيَّتَيْنِ.", textEn: "Step 1 (7): Bring down the upper bead, and lift two lower beads." },
            { textAr: "الْخُطْوَةُ 2 (+1): نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 2 (+1): Lift one lower bead towards the bar." },
            { textAr: "الْخُطْوَةُ 3 (+2): نَرْفَعُ خَرَزَةَ عَشَرَاتٍ بَاتِّجَاهِ الْعَارِضَةِ (+10)، وَنُبْعِدُ الْخَرَزَةَ الْعِلْوِيَّةَ وَ 3 خَرَزَاتٍ سُفْلِيَّةٍ عَنِ الْعَارِضَةِ (لِأَنَّ مُكَمِّلَ 2 هُوَ 8).", textEn: "Step 3 (+2): Lift a ten bead (+10), move the upper bead and 3 lower beads away from the bar (Friend of 2 is 8)." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 10.", textEn: "Final result: 10." }
          ]
        },
        // 4️⃣ المثال 4: الجمع المركب
        {
          titleAr: "مثال 4",
          titleEn: "Example 4",
          problem: "3 + 2 + 7",
          ruleTitleAr: "الْقَاعِدَةُ الرَّابِعَةُ: الْجَمْعُ الْمُرَكَّبُ (قَاعِدَتُكَ الْمُمَيَّزَةُ)",
          ruleDescAr: "الْقَاعِدَةُ الذَّهَبِيَّةُ: +10 - 5 + مُتَمِّمُ الْمُكَمِّلِ. (إِذَا لَمْ تَسْتَطِعْ طَرْحَ الْمُكَمِّلِ، اسْتَخْدِمْ مُتَمِّمَهُ).",
          ruleTitleEn: "Rule 4: Combined Addition (Your Special Rule)",
          ruleDescEn: "Golden Rule: +10 - 5 + Complement of the Complement. (If you can't subtract the Big Friend, use its Small Friend).",
          steps: [
            { textAr: "الْخُطْوَةُ 1 (الرَّقْمُ 3): نَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ بَاتِّجَاهِ الْعَارِضَةِ.", textEn: "Step 1 (3): Lift three lower beads towards the bar." },
            { textAr: "الْخُطْوَةُ 2 (+2): نُنْزِلُ الْعِلْوِيَّةَ (+5)، وَنُبْعِدُ 3 خَرَزَاتٍ سُفْلِيَّةٍ (-3) (مُتَمِّمُ 2 هُوَ 3).", textEn: "Step 2 (+2): Bring down upper bead (+5), move three lower beads away (-3) (Friend of 2 is 3)." },
            { textAr: "الْخُطْوَةُ 3 (+7): نَرْفَعُ خَرَزَةَ عَشَرَاتٍ (+10)، نَرْفَعُ الْعِلْوِيَّةَ لِلْأَعْلَى (-5)، وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (+2) (مُكَمِّلُ 7 هُوَ 3، وَمُتَمِّمُ 3 هُوَ 2).", textEn: "Step 3 (+7): Lift a ten bead (+10), move upper bead up (-5), lift two lower beads (+2) (Friend of 7 is 3, Friend of 3 is 2)." },
            { textAr: "النَّتِيجَةُ النِّهَائِيَّة: 12.", textEn: "Final result: 12." }
          ]
        }
      ]
    },
    // 3. مشهد التحدي
    {
      kind: 'challenge',
      id: 'level1-challenge',
      timePerQuestionMs: 15000,
      requiredCorrect: 3,
      questions: [
        { type: "direct", numbers: [5, 2, 1], answer: 8 },
        { type: "complement5", numbers: [4, 1, 2], answer: 7 },
        { type: "complement10", numbers: [8, 1, 2], answer: 11 },
        { type: "combined", numbers: [6, 9, 8], answer: 23 } // 👈 تم التعديل هنا
      ]
    }
  ]
};