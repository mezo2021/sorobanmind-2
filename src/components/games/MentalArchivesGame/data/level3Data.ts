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
            { textAr: "الْبِدَايَةُ (تَمْثِيلُ 81): الْعَشَرَاتُ: نُنْزِلُ الْخَرَزَةَ الْعُلْوِيَّةَ (50) وَنَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ (30). الْآحَادُ: نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَةً لِتَمْثِيلِ الرَّقْمِ 1. (الْمِعْدَادُ يَقْرَأُ 81).", textEn: "Start (Represent 81): Tens: Bring down the upper bead (50) and lift 3 lower beads (30). Units: Lift one lower bead to represent 1. (Abacus reads 81)." },
            { textAr: "الْخُطْوَةُ 1 (+ 3): لَدَيْنَا 1 فِي الْآحَادِ. الْقَاعِدَةُ: الْجَمْعُ الْمُبَاشِرُ. الْحَرَكَةُ: نَرْفَعُ 3 خَرَزَاتٍ سُفْلِيَّةٍ إِضَافِيَّةٍ. (الْمِعْدَادُ يَقْرَأُ 84).", textEn: "Step 1 (+ 3): We have 1 in units. Rule: Direct addition. Move: Lift 3 additional lower beads. (Abacus reads 84)." },
            { textAr: "الْخُطْوَةُ 2 (+ 2): لَدَيْنَا 4 فِي الْآحَادِ. لَا يُوجَدُ مَكَانٌ. الْقَاعِدَةُ: أَصْدِقَاءُ 5 (مُتَمِّمُ 2 هُوَ 3). الْحَرَكَةُ: نُنْزِلُ الْخَرَزَةَ الْعُلْوِيَّةَ (+5)، وَنُنْزِلُ 3 خَرَزَاتٍ سُفْلِيَّةٍ (-3). (الْمِعْدَادُ يَقْرَأُ 86).", textEn: "Step 2 (+ 2): We have 4 in units. No space. Rule: Friends of 5 (complement of 2 is 3). Move: Bring down upper bead (+5), and bring down 3 lower beads (-3). (Abacus reads 86)." },
            { textAr: "الْخُطْوَةُ 3 (+ 8): لَدَيْنَا 6 فِي الْآحَادِ. سَيَتَجَاوَزُ التِّسْعَةَ. الْقَاعِدَةُ: أَصْدِقَاءُ 10 (مُكَمِّلُ 8 هُوَ 2). الْحَرَكَةُ: نَرْفَعُ خَرَزَةً فِي الْعَشَرَاتِ (+10)، وَنُنْزِلُ 2 مِنَ الْآحَادِ (-2). (الْمِعْدَادُ يَقْرَأُ 94).", textEn: "Step 3 (+ 8): We have 6 in units. Will exceed nine. Rule: Friends of 10 (complement of 8 is 2). Move: Lift a bead in tens (+10), and bring down 2 from units (-2). (Abacus reads 94)." },
            { textAr: "الْخُطْوَةُ 4 (+ 5): لَدَيْنَا 4 فِي الْآحَادِ. الْقَاعِدَةُ: الْجَمْعُ الْمُبَاشِرُ. الْحَرَكَةُ: نُنْزِلُ الْخَرَزَةَ الْعُلْوِيَّةَ (قِيمَتُهَا 5). (الْمِعْدَادُ يَقْرَأُ 99). النَّتِيجَةُ: 99.", textEn: "Step 4 (+ 5): We have 4 in units. Rule: Direct addition. Move: Bring down the upper bead (value 5). (Abacus reads 99). Result: 99." }
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
            { textAr: "الْبِدَايَةُ (تَمْثِيلُ 77): الْعَشَرَاتُ (7): نُنْزِلُ الْعُلْوِيَّةَ (50) وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (20). الْآحَادُ (7): نُنْزِلُ الْعُلْوِيَّةَ (5) وَنَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (2). (الْمِعْدَادُ يَقْرَأُ 77).", textEn: "Start (Represent 77): Tens (7): Bring down upper (50) and lift 2 lower (20). Units (7): Bring down upper (5) and lift 2 lower (2). (Abacus reads 77)." },
            { textAr: "الْخُطْوَةُ 1 (+ 3): لَدَيْنَا 7 فِي الْآحَادِ. الْقَاعِدَةُ: أَصْدِقَاءُ 10 (مُكَمِّلُ 3 هُوَ 7). الْحَرَكَةُ: نُضِيفُ خَرَزَةً فِي الْعَشَرَاتِ (تُصْبِحُ 8). نَمْلِكُ 7 فِي الْآحَادِ، نَطْرَحُ 7 مُبَاشَرَةً (نَرْفَعُ الْعُلْوِيَّةَ، وَنُنْزِلُ السُّفْلِيَّتَيْنِ). (الْمِعْدَادُ يَقْرَأُ 80).", textEn: "Step 1 (+ 3): We have 7 in units. Rule: Friends of 10 (complement of 3 is 7). Move: Add a bead in tens (becomes 8). We have 7 in units, subtract 7 directly (lift upper, lower 2 lower). (Abacus reads 80)." },
            { textAr: "الْخُطْوَةُ 2 (+ 8): خَانَةُ الْآحَادِ فَارِغَةٌ. الْقَاعِدَةُ: الْجَمْعُ الْمُبَاشِرُ. الْحَرَكَةُ: نُنْزِلُ الْعُلْوِيَّةَ (5) وَنَرْفَعُ 3 سُفْلِيَّاتٍ. (الْمِعْدَادُ يَقْرَأُ 88).", textEn: "Step 2 (+ 8): Units column is empty. Rule: Direct addition. Move: Bring down upper (5) and lift 3 lower. (Abacus reads 88)." },
            { textAr: "الْخُطْوَةُ 3 (+ 3): لَدَيْنَا 8 فِي الْآحَادِ. الْقَاعِدَةُ: أَصْدِقَاءُ 10 (مُكَمِّلُ 3 هُوَ 7). الْحَرَكَةُ: نُضِيفُ فِي الْعَشَرَاتِ (تُصْبِحُ 9). وَنَطْرَحُ 7 مِنَ الْآحَادِ (نَرْفَعُ الْعُلْوِيَّةَ، وَنُنْزِلُ سُفْلِيَّتَيْنِ، لِيَتَبَقَّى وَاحِدَةٌ). (الْمِعْدَادُ يَقْرَأُ 91).", textEn: "Step 3 (+ 3): We have 8 in units. Rule: Friends of 10 (complement of 3 is 7). Move: Add in tens (becomes 9). Subtract 7 from units (lift upper, lower 2 lower, leaving one). (Abacus reads 91)." },
            { textAr: "الْخُطْوَةُ 4 (+ 6): لَدَيْنَا 1 فِي الْآحَادِ. الْقَاعِدَةُ: الْجَمْعُ الْمُبَاشِرُ! الْحَرَكَةُ: نُنْزِلُ الْعُلْوِيَّةَ (5) وَنَرْفَعُ سُفْلِيَّةً وَاحِدَةً (1). فَيُصْبِحُ لَدَيْنَا (5+2)=7. (الْمِعْدَادُ يَقْرَأُ 97). النَّتِيجَةُ: 97.", textEn: "Step 4 (+ 6): We have 1 in units. Rule: Direct addition! Move: Bring down upper (5) and lift one lower (1). Becomes (5+2)=7. (Abacus reads 97). Result: 97." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي",
          titleEn: "Example 3: Kaki",
          problem: "20 × 2",
          tipAr: "💡 نَضَعُ 20 عَلَى الْيَسَارِ، وَنَبْنِي النَّتِيجَةَ عَلَى الْيَمِينِ.",
          tipEn: "💡 Place 20 on the left, build the result on the right.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 20 عَلَى يَسَارِ الْمِعْدَادِ.", textEn: "Represent: Place 20 on the left abacus." },
            { textAr: "الْخُطْوَةُ 1: نَضْرِبُ الْعَشَرَاتِ: 2 × 2 = 4. نَضَعُ 4 فِي خَانَةِ الْعَشَرَاتِ عَلَى الْيَمِينِ.", textEn: "Step 1: Multiply tens: 2 × 2 = 4. Place 4 in the tens column on the right." },
            { textAr: "الْخُطْوَةُ 2: نَضْرِبُ الْآحَادَ: 0 × 2 = 0. نَتْرُكُ خَانَةَ الْآحَادِ فَارِغَةً.", textEn: "Step 2: Multiply units: 0 × 2 = 0. Leave the units column empty." },
            { textAr: "النَّتِيجَةُ: 40.", textEn: "Result: 40." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي",
          titleEn: "Example 4: Kaki",
          problem: "31 × 2",
          tipAr: "💡 اضْرِبِ الْعَشَرَاتِ ثُمَّ الْآحَادَ.",
          tipEn: "💡 Multiply tens then units.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 31 عَلَى يَسَارِ الْمِعْدَادِ.", textEn: "Represent: Place 31 on the left abacus." },
            { textAr: "الْخُطْوَةُ 1: نَضْرِبُ الْعَشَرَاتِ: 3 × 2 = 6. نَضَعُ 6 فِي الْعَشَرَاتِ.", textEn: "Step 1: Multiply tens: 3 × 2 = 6. Place 6 in tens." },
            { textAr: "الْخُطْوَةُ 2: نَضْرِبُ الْآحَادَ: 1 × 2 = 2. نَضَعُ 2 فِي الْآحَادِ.", textEn: "Step 2: Multiply units: 1 × 2 = 2. Place 2 in units." },
            { textAr: "النَّتِيجَةُ: 62.", textEn: "Result: 62." }
          ]
        },
        {
          titleAr: "مِثَالٌ 5: الْكَاكِي",
          titleEn: "Example 5: Kaki",
          problem: "18 × 2",
          tipAr: "💡 اِنْتَبِهْ لِلْحَمْلِ مِنَ الْآحَادِ لِلْعَشَرَاتِ.",
          tipEn: "💡 Pay attention to carry from units to tens.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 18 عَلَى يَسَارِ الْمِعْدَادِ.", textEn: "Represent: Place 18 on the left abacus." },
            { textAr: "الْخُطْوَةُ 1: نَضْرِبُ الْعَشَرَاتِ: 1 × 2 = 2. نَضَعُ 2 فِي الْعَشَرَاتِ.", textEn: "Step 1: Multiply tens: 1 × 2 = 2. Place 2 in tens." },
            { textAr: "الْخُطْوَةُ 2: نَضْرِبُ الْآحَادَ: 8 × 2 = 16. نَضَعُ 6 فِي الْآحَادِ، وَنُضِيفُ 1 لِلْعَشَرَاتِ (2 + 1 = 3).", textEn: "Step 2: Multiply units: 8 × 2 = 16. Place 6 in units, add 1 to tens (2 + 1 = 3)." },
            { textAr: "النَّتِيجَةُ: 36.", textEn: "Result: 36." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْكَاكِي",
          titleEn: "Example 6: Kaki",
          problem: "38 × 3",
          tipAr: "💡 اِحْمِلْ إِلَى الْمِئَاتِ عِنْدَمَا يَتَجَاوَزُ الْعَشَرَاتُ التِّسْعَةَ.",
          tipEn: "💡 Carry to hundreds when tens exceed nine.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 38 عَلَى يَسَارِ الْمِعْدَادِ.", textEn: "Represent: Place 38 on the left abacus." },
            { textAr: "الْخُطْوَةُ 1: نَضْرِبُ الْعَشَرَاتِ: 3 × 3 = 9. نَضَعُ 9 فِي الْعَشَرَاتِ.", textEn: "Step 1: Multiply tens: 3 × 3 = 9. Place 9 in tens." },
            { textAr: "الْخُطْوَةُ 2: نَضْرِبُ الْآحَادَ: 8 × 3 = 24. نَضَعُ 4 فِي الْآحَادِ. وَنُضِيفُ 2 لِلْعَشَرَاتِ. (9 + 2 = 11). نَتْرُكُ 1 فِي الْعَشَرَاتِ وَنَرْفَعُ 1 لِلْمِئَاتِ.", textEn: "Step 2: Multiply units: 8 × 3 = 24. Place 4 in units. Add 2 to tens. (9 + 2 = 11). Leave 1 in tens, lift 1 to hundreds." },
            { textAr: "النَّتِيجَةُ: 114.", textEn: "Result: 114." }
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
            { textAr: "التَّمْثِيلُ: نَضَعُ 93 عَلَى يَمِينِ الْمِعْدَادِ.", textEn: "Represent: Place 93 on the right abacus." },
            { textAr: "الْخُطْوَةُ 1 (الْعَشَرَاتُ): 9 ÷ 3 = 3. نَضَعُ 3 فِي عَشَرَاتِ النَّاتِجِ. نَطْرَحُ (3 × 3 = 9). يَتَبَقَّى 3.", textEn: "Step 1 (Tens): 9 ÷ 3 = 3. Place 3 in tens of result. Subtract (3×3=9). Remains 3." },
            { textAr: "الْخُطْوَةُ 2 (الْآحَادُ): 3 ÷ 3 = 1. نَضَعُ 1 فِي آحَادِ النَّاتِجِ. نَطْرَحُ (1 × 3 = 3). يَتَبَقَّى 0.", textEn: "Step 2 (Units): 3 ÷ 3 = 1. Place 1 in units of result. Subtract (1×3=3). Remains 0." },
            { textAr: "النَّتِيجَةُ: 31.", textEn: "Result: 31." }
          ]
        },
        {
          titleAr: "مِثَالٌ 8: الْوَارِي",
          titleEn: "Example 8: Wari",
          problem: "92 ÷ 2",
          tipAr: "💡 إِذَا لَمْ يَقْبَلِ الرَّقْمُ الْقِسْمَةَ، خُذْ رَقْمَيْنِ.",
          tipEn: "💡 If the digit doesn't divide, take two digits.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 92 عَلَى يَمِينِ الْمِعْدَادِ.", textEn: "Represent: Place 92 on the right abacus." },
            { textAr: "الْخُطْوَةُ 1 (الْعَشَرَاتُ): 9 ÷ 2 = 4 (وَالْبَاقِي 1). نَضَعُ 4 فِي عَشَرَاتِ النَّاتِجِ. نَطْرَحُ (4 × 2 = 8) مِنَ الْـ 9. يَتَبَقَّى 12.", textEn: "Step 1 (Tens): 9 ÷ 2 = 4 (remainder 1). Place 4 in tens of result. Subtract (4×2=8) from 9. Remains 12." },
            { textAr: "الْخُطْوَةُ 2 (الْآحَادُ): 12 ÷ 2 = 6. نَضَعُ 6 فِي آحَادِ النَّاتِجِ. نَطْرَحُ (6 × 2 = 12). يَتَبَقَّى 0.", textEn: "Step 2 (Units): 12 ÷ 2 = 6. Place 6 in units of result. Subtract (6×2=12). Remains 0." },
            { textAr: "النَّتِيجَةُ: 46.", textEn: "Result: 46." }
          ]
        },
        {
          titleAr: "مِثَالٌ 9: الْوَارِي",
          titleEn: "Example 9: Wari",
          problem: "72 ÷ 6",
          tipAr: "💡 الرَّقْمُ 7 أَكْبَرُ مِنْ 6، لَكِنَّهُ لَا يَقْبَلُ الْقِسْمَةَ، فَنَأْخُذُ الْعَشَرَاتِ وَالْآحَادَ.",
          tipEn: "💡 7 > 6, but doesn't divide evenly, so take tens and units.",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 72 عَلَى يَمِينِ الْمِعْدَادِ.", textEn: "Represent: Place 72 on the right abacus." },
            { textAr: "الْخُطْوَةُ 1 (الْعَشَرَاتُ): 7 ÷ 6 = 1 (وَالْبَاقِي 1). نَضَعُ 1 فِي عَشَرَاتِ النَّاتِجِ. نَطْرَحُ (1 × 6 = 6) مِنَ الْـ 7. يَتَبَقَّى 12.", textEn: "Step 1 (Tens): 7 ÷ 6 = 1 (remainder 1). Place 1 in tens of result. Subtract (1×6=6) from 7. Remains 12." },
            { textAr: "الْخُطْوَةُ 2 (الْآحَادُ): 12 ÷ 6 = 2. نَضَعُ 2 فِي آحَادِ النَّاتِجِ. نَطْرَحُ (2 × 6 = 12). يَتَبَقَّى 0.", textEn: "Step 2 (Units): 12 ÷ 6 = 2. Place 2 in units of result. Subtract (2×6=12). Remains 0." },
            { textAr: "النَّتِيجَةُ: 12.", textEn: "Result: 12." }
          ]
        },
        {
          titleAr: "مِثَالٌ 10: الْوَارِي",
          titleEn: "Example 10: Wari",
          problem: "56 ÷ 4",
          tipAr: "💡 5 لَا تَقْبَلُ الْقِسْمَةَ عَلَى 4، نَأْخُذُ رَقْمَيْنِ (56).",
          tipEn: "💡 5 doesn't divide by 4, take two digits (56).",
          steps: [
            { textAr: "التَّمْثِيلُ: نَضَعُ 56 عَلَى يَمِينِ الْمِعْدَادِ.", textEn: "Represent: Place 56 on the right abacus." },
            { textAr: "الْخُطْوَةُ 1 (الْعَشَرَاتُ): 5 ÷ 4 = 1 (وَالْبَاقِي 1). نَضَعُ 1 فِي عَشَرَاتِ النَّاتِجِ. نَطْرَحُ (1 × 4 = 4) مِنَ الْـ 5. يَتَبَقَّى 16.", textEn: "Step 1 (Tens): 5 ÷ 4 = 1 (remainder 1). Place 1 in tens of result. Subtract (1×4=4) from 5. Remains 16." },
            { textAr: "الْخُطْوَةُ 2 (الْآحَادُ): 16 ÷ 4 = 4. نَضَعُ 4 فِي آحَادِ النَّاتِجِ. نَطْرَحُ (4 × 4 = 16). يَتَبَقَّى 0.", textEn: "Step 2 (Units): 16 ÷ 4 = 4. Place 4 in units of result. Subtract (4×4=16). Remains 0." },
            { textAr: "النَّتِيجَةُ: 14.", textEn: "Result: 14." }
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