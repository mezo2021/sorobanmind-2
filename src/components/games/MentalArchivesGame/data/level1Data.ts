// src/components/games/MentalArchivesGame/data/level1Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_1_DATA: Chapter = {
  id: 'level1',
  // 🆕 P15: إضافة الموقع (إبلا وماري) ونطاق الكيو
  titleAr: 'المستوى الأول: رفوف الذاكرة — إبلا وماري (10-9 كيو)',
  titleEn: 'Level 1: Memory Shelves — Ebla & Mari (10-9 Kyu)',
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
          // 🆕 P16: إدماج "ماري" في السرد (تجارة بين المدينتين)
          textAr: "وَصَلْنَا! هَذِهِ أَلْوَاحُ إِبْلَا وَمَارِي الطِّينِيَّة. الطَّيْفُ الصِّفْرِيُّ يَمْسَحُ الْأَرْقَامَ الَّتِي تَرْبِطُ سِجِلَّاتِ التِّجَارَةِ بَيْنَ الْمَدِينَتَيْن!",
          textEn: "We have arrived! These are the clay tablets of Ebla and Mari. The Zero Spectrum is wiping the numbers that connect the trade records between the two cities!"
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
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 1.", textEn: "Step 1: Represent 1." },
            { textAr: "الْخُطْوَةُ 2 (+2): لِلْآحَادِ: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ مُبَاشَرَةً ← 3.", textEn: "Step 2 (+2): Units: Lift two lower beads directly → 3." },
            { textAr: "الْخُطْوَةُ 3 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً مُبَاشَرَةً ← 4. النَّتِيجَةُ: 4.", textEn: "Step 3 (+1): Units: Lift one lower bead directly → 4. Result: 4." }
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
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 2.", textEn: "Step 1: Represent 2." },
            { textAr: "الْخُطْوَةُ 2 (+3): لِلْآحَادِ: نُنْزِلُ 5 وَنَطْرَحُ 2 (صَدِيقُ 5) ← 5.", textEn: "Step 2 (+3): Units: Bring down 5 and subtract 2 (Friend of 5) → 5." },
            { textAr: "الْخُطْوَةُ 3 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً مُبَاشَرَةً ← 6. النَّتِيجَةُ: 6.", textEn: "Step 3 (+1): Units: Lift one lower bead directly → 6. Result: 6." }
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
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 7.", textEn: "Step 1: Represent 7." },
            { textAr: "الْخُطْوَةُ 2 (+1): لِلْآحَادِ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً مُبَاشَرَةً ← 8.", textEn: "Step 2 (+1): Units: Lift one lower bead directly → 8." },
            { textAr: "الْخُطْوَةُ 3 (+2): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ وَنَطْرَحُ 8 مِنَ الْآحَادِ (صَدِيقُ 10) ← 10. النَّتِيجَةُ: 10.", textEn: "Step 3 (+2): Units: Add 1 to tens and subtract 8 from units (Friend of 10) → 10. Result: 10." }
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
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 3.", textEn: "Step 1: Represent 3." },
            { textAr: "الْخُطْوَةُ 2 (+2): لِلْآحَادِ: نُنْزِلُ 5 وَنَطْرَحُ 3 (صَدِيقُ 5) ← 5.", textEn: "Step 2 (+2): Units: Bring down 5 and subtract 3 (Friend of 5) → 5." },
            { textAr: "الْخُطْوَةُ 3 (+7): لِلْآحَادِ: نُضِيفُ 1 لِلْعَشَرَاتِ (+10)، نَرْفَعُ الْعِلْوِيَّةَ (-5)، وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (+2) (الْقَاعِدَةُ الْمُرَكَّبَةُ) ← 12. النَّتِيجَةُ: 12.", textEn: "Step 3 (+7): Units: Add 1 to tens (+10), lift the upper bead (-5), and lift two lower beads (+2) (Combined Rule) → 12. Result: 12." }
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
        { type: "combined", numbers: [6, 9, 8], answer: 23 }
      ]
    }
  ]
};