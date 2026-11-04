// src/components/games/MentalArchivesGame/data/level3Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_3_DATA: Chapter = {
  id: 'level3',
  titleAr: 'المستوى الثالث: ميزان القوافل — تدمر (6 كيو)',
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
          textAr: "وَصَلْنَا إِلَى تَدْمُر، مَدِينَةِ الْقَوَافِل! هَذَا دَفْتَرُ حُمُولَةٍ قَدِيم، لَكِنَّ الطَّيْفَ الصِّفْرِيَّ مَسَحَ الْأَرْقَامَ. لِحُسْنِ الْحَظّ، لَدَيْنَا الآنَ (الْكاكِي) وَ(الْوَارِي) لِإِنْهَاءِ الْعَمَل!",
          textEn: "We have arrived at Palmyra, the city of caravans! This is an ancient cargo ledger, but the Zero Spectrum erased the numbers. Luckily, we now have (Kaki) and (Wari) to finish the work!"
        },
        { 
          character: "sorobana", 
          textAr: "بِالضَّبْط. فِي هَذَا الْمُسْتَوَى، سَتَتَعَلَّمُ الضَّرْبَ وَالْقِسْمَةَ. تَذَكَّرْ: نَضْرِبُ الْعَشَرَاتِ ثُمَّ الْآحَاد، وَنَقْسِمُ مِنَ الْكَبِيرِ لِلصَّغِير. هَلْ أَنْتُمَا مُسْتَعِدَّان؟",
          textEn: "Exactly. In this level, you will learn multiplication and division. Remember: multiply tens then units, and divide from largest to smallest. Are you ready?"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level3-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري) ═══
        {
          titleAr: "مثال 1: الميتوري",
          titleEn: "Example 1: Mitori",
          problem: "3 + 2 + 81 + 8 + 5",
          tipAr: "💡 ابدأ بالعدد ذي الخانتين (81).",
          tipEn: "💡 Start with the two-digit number (81).",
          ruleTitleAr: "",
          ruleDescAr: "",
          ruleTitleEn: "",
          ruleDescEn: "",
          steps: [
            { textAr: "البداية (تمثيل 81): العشرات: ننزل الخرزة العلوية (50) ونرفع 3 خرزات سفلية (30). الآحاد: نرفع خرزة سفلية واحدة لتمثيل الرقم 1. (المعداد يقرأ 81).", textEn: "Start (Represent 81): Tens: Bring down the upper bead (50) and lift 3 lower beads (30). Units: Lift one lower bead to represent 1. (Abacus reads 81)." },
            { textAr: "الخطوة 1 (+ 3): لدينا 1 في الآحاد. القاعدة: الجمع المباشر. الحركة: نرفع 3 خرزات سفلية إضافية. (المعداد يقرأ 84).", textEn: "Step 1 (+ 3): We have 1 in units. Rule: Direct addition. Move: Lift 3 additional lower beads. (Abacus reads 84)." },
            { textAr: "الخطوة 2 (+ 2): لدينا 4 في الآحاد. لا يوجد مكان. القاعدة: أصدقاء 5 (متمم 2 هو 3). الحركة: ننزل الخرزة العلوية (+5)، وننزل 3 خرزات سفلية (-3). (المعداد يقرأ 86).", textEn: "Step 2 (+ 2): We have 4 in units. No space. Rule: Friends of 5 (complement of 2 is 3). Move: Bring down upper bead (+5), and bring down 3 lower beads (-3). (Abacus reads 86)." },
            { textAr: "الخطوة 3 (+ 8): لدينا 6 في الآحاد. سيتجاوز nine. القاعدة: أصدقاء 10 (مكمل 8 هو 2). الحركة: نرفع خرزة في العشرات (+10)، وننزل 2 من الآحاد (-2). (المعداد يقرأ 94).", textEn: "Step 3 (+ 8): We have 6 in units. Will exceed ten. Rule: Friends of 10 (complement of 8 is 2). Move: Lift a bead in tens (+10), and bring down 2 from units (-2). (Abacus reads 94)." },
            { textAr: "الخطوة 4 (+ 5): لدينا 4 في الآحاد. القاعدة: الجمع المباشر. الحركة: ننزل الخرزة العلوية (قيمتها 5). (المعداد يقرأ 99). النتيجة: 99.", textEn: "Step 4 (+ 5): We have 4 in units. Rule: Direct addition. Move: Bring down the upper bead (value 5). (Abacus reads 99). Result: 99." }
          ]
        },
        {
          titleAr: "مثال 2: الميتوري",
          titleEn: "Example 2: Mitori",
          problem: "77 + 3 + 8 + 3 + 6",
          tipAr: "💡 ابدأ بالعدد ذي الخانتين (77).",
          tipEn: "💡 Start with the two-digit number (77).",
          ruleTitleAr: "",
          ruleDescAr: "",
          ruleTitleEn: "",
          ruleDescEn: "",
          steps: [
            { textAr: "البداية (تمثيل 77): العشرات (7): ننزل العلوية (50) ونرفع خرزتين سفلية (20). الآحاد (7): ننزل العلوية (5) ونرفع خرزتين سفلية (2). (المعداد يقرأ 77).", textEn: "Start (Represent 77): Tens (7): Bring down upper (50) and lift 2 lower (20). Units (7): Bring down upper (5) and lift 2 lower (2). (Abacus reads 77)." },
            { textAr: "الخطوة 1 (+ 3): لدينا 7 في الآحاد. القاعدة: أصدقاء 10 (مكمل 3 هو 7). الحركة: نضيف خرزة في العشرات (تصبح 8). نملك 7 في الآحاد، نطرح 7 مباشرة (نرفع العلوية، وننزل السفليتين). (المعداد يقرأ 80).", textEn: "Step 1 (+ 3): We have 7 in units. Rule: Friends of 10 (complement of 3 is 7). Move: Add a bead in tens (becomes 8). We have 7 in units, subtract 7 directly (lift upper, lower 2 lower). (Abacus reads 80)." },
            { textAr: "الخطوة 2 (+ 8): خانة الآحاد فارغة. القاعدة: الجمع المباشر. الحركة: ننزل العلوية (5) ونرفع 3 سفلية. (المعداد يقرأ 88).", textEn: "Step 2 (+ 8): Units column is empty. Rule: Direct addition. Move: Bring down upper (5) and lift 3 lower. (Abacus reads 88)." },
            { textAr: "الخطوة 3 (+ 3): لدينا 8 في الآحاد. القاعدة: أصدقاء 10 (مكمل 3 هو 7). الحركة: نضيف في العشرات (تصبح 9). ونطرح 7 من الآحاد (نرفع العلوية، وننزل سفليتين، ليتبقى واحدة). (المعداد يقرأ 91).", textEn: "Step 3 (+ 3): We have 8 in units. Rule: Friends of 10 (complement of 3 is 7). Move: Add in tens (becomes 9). Subtract 7 from units (lift upper, lower 2 lower, leaving one). (Abacus reads 91)." },
            { textAr: "الخطوة 4 (+ 6): لدينا 1 في الآحاد. القاعدة: الجمع المباشر! الحركة: ننزل العلوية (5) ونرفع سفلية واحدة (1). فيصبح لدينا (5+2)=7. (المعداد يقرأ 97). النتيجة: 97.", textEn: "Step 4 (+ 6): We have 1 in units. Rule: Direct addition! Move: Bring down upper (5) and lift one lower (1). Becomes (5+2)=7. (Abacus reads 97). Result: 97." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي) ═══
        {
          titleAr: "مثال 3: الكاكي",
          titleEn: "Example 3: Kaki",
          problem: "2 × 41",
          tipAr: "💡 نضع 41 على اليسار، ونبني النتيجة على اليمين.",
          tipEn: "💡 Place 41 on the left, build the result on the right.",
          steps: [
            { textAr: "التمثيل: نضع 41 على يسار المعداد.", textEn: "Represent: Place 41 on the left abacus." },
            { textAr: "الخطوة 1: نضرب العشرات: 2 × 4 = 8. نضع 8 في خانة العشرات على اليمين.", textEn: "Step 1: Multiply tens: 2 × 4 = 8. Place 8 in the tens column on the right." },
            { textAr: "الخطوة 2: نضرب الآحاد: 2 × 1 = 2. نضع 2 في خانة الآحاد على اليمين.", textEn: "Step 2: Multiply units: 2 × 1 = 2. Place 2 in the units column on the right." },
            { textAr: "النتيجة: 82.", textEn: "Result: 82." }
          ]
        },
        {
          titleAr: "مثال 4: الكاكي",
          titleEn: "Example 4: Kaki",
          problem: "7 × 22",
          tipAr: "💡 اضرب العشرات أولاً، ثم الآحاد مع الحمل.",
          tipEn: "💡 Multiply tens first, then units with carry.",
          steps: [
            { textAr: "التمثيل: نضع 22 على يسار المعداد.", textEn: "Represent: Place 22 on the left abacus." },
            { textAr: "الخطوة 1: نضرب العشرات: 7 × 2 = 14. نضع 1 في المئات، و 4 في العشرات على اليمين.", textEn: "Step 1: Multiply tens: 7 × 2 = 14. Place 1 in hundreds, 4 in tens on the right." },
            { textAr: "الخطوة 2: نضرب الآحاد: 7 × 2 = 14. نضيف 1 للعشرات (فتصبح 5)، ونضع 4 في الآحاد.", textEn: "Step 2: Multiply units: 7 × 2 = 14. Add 1 to tens (becomes 5), place 4 in units." },
            { textAr: "النتيجة: 154.", textEn: "Result: 154." }
          ]
        },
        {
          titleAr: "مثال 5: الكاكي",
          titleEn: "Example 5: Kaki",
          problem: "8 × 15",
          tipAr: "💡 انتبه للحمل عند جمع العشرات.",
          tipEn: "💡 Pay attention to carry when adding tens.",
          steps: [
            { textAr: "التمثيل: نضع 15 على يسار المعداد.", textEn: "Represent: Place 15 on the left abacus." },
            { textAr: "الخطوة 1: نضرب العشرات: 8 × 1 = 8. نضع 8 في العشرات على اليمين.", textEn: "Step 1: Multiply tens: 8 × 1 = 8. Place 8 in tens on the right." },
            { textAr: "الخطوة 2: نضرب الآحاد: 8 × 5 = 40. نضيف 4 للعشرات. (8 + 4 = 12). نرفع 1 للمئات، ونترك 2 في العشرات. الآحاد صفر.", textEn: "Step 2: Multiply units: 8 × 5 = 40. Add 4 to tens. (8 + 4 = 12). Lift 1 to hundreds, leave 2 in tens. Units are zero." },
            { textAr: "النتيجة: 120.", textEn: "Result: 120." }
          ]
        },
        {
          titleAr: "مثال 6: الكاكي",
          titleEn: "Example 6: Kaki",
          problem: "8 × 28",
          tipAr: "💡 تحقق من الحمل في خانة العشرات.",
          tipEn: "💡 Check the carry in the tens column.",
          steps: [
            { textAr: "التمثيل: نضع 28 على يسار المعداد.", textEn: "Represent: Place 28 on the left abacus." },
            { textAr: "الخطوة 1: نضرب العشرات: 8 × 2 = 16. نضع 1 في المئات، و 6 في العشرات.", textEn: "Step 1: Multiply tens: 8 × 2 = 16. Place 1 in hundreds, 6 in tens." },
            { textAr: "الخطوة 2: نضرب الآحاد: 8 × 8 = 64. نضيف 6 للعشرات (6 + 6 = 12). نضيف 1 للمئات، ونترك 2 في العشرات. ثم نضع 4 في الآحاد.", textEn: "Step 2: Multiply units: 8 × 8 = 64. Add 6 to tens (6 + 6 = 12). Add 1 to hundreds, leave 2 in tens. Place 4 in units." },
            { textAr: "النتيجة: 224.", textEn: "Result: 224." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري) ═══
        {
          titleAr: "مثال 7: الواري",
          titleEn: "Example 7: Wari",
          problem: "837 ÷ 3",
          tipAr: "💡 اقسم من اليسار لليمين، واطرح من المقسوم.",
          tipEn: "💡 Divide left to right, subtract from dividend.",
          steps: [
            { textAr: "التمثيل: نضع 837 على يمين المعداد.", textEn: "Represent: Place 837 on the right abacus." },
            { textAr: "الخطوة 1 (المئات): 8 ÷ 3 = 2. نضع 2 في مئات الناتج على اليسار. نطرح (2 × 3 = 6) من الـ 8. يتبقى 237.", textEn: "Step 1 (Hundreds): 8 ÷ 3 = 2. Place 2 in hundreds of result on left. Subtract (2×3=6) from 8. Remains 237." },
            { textAr: "الخطوة 2 (العشرات): نأخذ رقمين (23) ÷ 3 = 7. نضع 7 في عشرات الناتج. نطرح (7 × 3 = 21) من الـ 23. يتبقى 27.", textEn: "Step 2 (Tens): Take two digits (23) ÷ 3 = 7. Place 7 in tens of result. Subtract (7×3=21) from 23. Remains 27." },
            { textAr: "الخطوة 3 (الآحاد): 27 ÷ 3 = 9. نضع 9 في آحاد الناتج. نطرح (9 × 3 = 27) من الـ 27. يتبقى 0.", textEn: "Step 3 (Units): 27 ÷ 3 = 9. Place 9 in units of result. Subtract (9×3=27) from 27. Remains 0." },
            { textAr: "النتيجة: 279.", textEn: "Result: 279." }
          ]
        },
        {
          titleAr: "مثال 8: الواري",
          titleEn: "Example 8: Wari",
          problem: "54 ÷ 3",
          tipAr: "💡 إذا كان الرقم الأول أصغر، ابدأ بالعشرات.",
          tipEn: "💡 If first digit is smaller, start with tens.",
          steps: [
            { textAr: "التمثيل: نضع 54 على يمين المعداد.", textEn: "Represent: Place 54 on the right abacus." },
            { textAr: "الخطوة 1 (العشرات): 5 ÷ 3 = 1. نضع 1 في عشرات الناتج على اليسار. نطرح (1 × 3 = 3) من الـ 5. يتبقى 24.", textEn: "Step 1 (Tens): 5 ÷ 3 = 1. Place 1 in tens of result on left. Subtract (1×3=3) from 5. Remains 24." },
            { textAr: "الخطوة 2 (الآحاد): 24 ÷ 3 = 8. نضع 8 في آحاد الناتج. نطرح (8 × 3 = 24) من الـ 24. يتبقى 0.", textEn: "Step 2 (Units): 24 ÷ 3 = 8. Place 8 in units of result. Subtract (8×3=24) from 24. Remains 0." },
            { textAr: "النتيجة: 18.", textEn: "Result: 18." }
          ]
        },
        {
          titleAr: "مثال 9: الواري",
          titleEn: "Example 9: Wari",
          problem: "152 ÷ 8",
          tipAr: "💡 الرقم 1 أصغر من 8، لذا نأخذ رقمين (15).",
          tipEn: "💡 1 is smaller than 8, so take two digits (15).",
          steps: [
            { textAr: "التمثيل: نضع 152 على يمين المعداد.", textEn: "Represent: Place 152 on the right abacus." },
            { textAr: "الخطوة 1 (المئات): 1 أصغر من 8، لذا نأخذ رقمين (15) ÷ 8 = 1. نضع 1 في عشرات الناتج. نطرح (1 × 8 = 8) من الـ 15. يتبقى 72.", textEn: "Step 1 (Hundreds): 1 is smaller than 8, so take two digits (15) ÷ 8 = 1. Place 1 in tens of result. Subtract (1×8=8) from 15. Remains 72." },
            { textAr: "الخطوة 2 (الآحاد): 72 ÷ 8 = 9. نضع 9 في آحاد الناتج. نطرح (9 × 8 = 72) من الـ 72. يتبقى 0.", textEn: "Step 2 (Units): 72 ÷ 8 = 9. Place 9 in units of result. Subtract (9×8=72) from 72. Remains 0." },
            { textAr: "النتيجة: 19.", textEn: "Result: 19." }
          ]
        },
        {
          titleAr: "مثال 10: الواري",
          titleEn: "Example 10: Wari",
          problem: "216 ÷ 8",
          tipAr: "💡 الرقم 2 أصغر من 8، لذا نأخذ رقمين (21).",
          tipEn: "💡 2 is smaller than 8, so take two digits (21).",
          steps: [
            { textAr: "التمثيل: نضع 216 على يمين المعداد.", textEn: "Represent: Place 216 on the right abacus." },
            { textAr: "الخطوة 1 (المئات): 2 أصغر من 8، لذا نأخذ رقمين (21) ÷ 8 = 2. نضع 2 في عشرات الناتج. نطرح (2 × 8 = 16) من الـ 21. يتبقى 56.", textEn: "Step 1 (Hundreds): 2 is smaller than 8, so take two digits (21) ÷ 8 = 2. Place 2 in tens of result. Subtract (2×8=16) from 21. Remains 56." },
            { textAr: "الخطوة 2 (الآحاد): 56 ÷ 8 = 7. نضع 7 في آحاد الناتج. نطرح (7 × 8 = 56) من الـ 56. يتبقى 0.", textEn: "Step 2 (Units): 56 ÷ 8 = 7. Place 7 in units of result. Subtract (7×8=56) from 56. Remains 0." },
            { textAr: "النتيجة: 27.", textEn: "Result: 27." }
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
        { type: "mitori", numbers: [3, 2, 81, 8, 5], answer: 99, tipAr: "تذكر: ابدأ بـ 81", tipEn: "Remember: start with 81" },
        { type: "mitori", numbers: [77, 3, 8, 3, 6], answer: 97, tipAr: "تذكر: ابدأ بـ 77", tipEn: "Remember: start with 77" },
        { type: "multiplication", numbers: [2, 41], answer: 82, tipAr: "اضرب العشرات ثم الآحاد", tipEn: "Multiply tens then units" },
        { type: "multiplication", numbers: [7, 22], answer: 154, tipAr: "لا تنسَ الحمل", tipEn: "Don't forget the carry" },
        { type: "multiplication", numbers: [8, 15], answer: 120, tipAr: "انتبه للحمل في العشرات", tipEn: "Watch the carry in tens" },
        { type: "multiplication", numbers: [8, 28], answer: 224, tipAr: "تحقق من الحمل", tipEn: "Check the carry" },
        { type: "division", numbers: [837, 3], answer: 279, tipAr: "اقسم من اليسار لليمين", tipEn: "Divide left to right" },
        { type: "division", numbers: [54, 3], answer: 18, tipAr: "ابدأ بالعشرات", tipEn: "Start with tens" },
        { type: "division", numbers: [152, 8], answer: 19, tipAr: "1 أصغر من 8، خذ رقمين", tipEn: "1 < 8, take two digits" },
        { type: "division", numbers: [216, 8], answer: 27, tipAr: "2 أصغر من 8، خذ رقمين", tipEn: "2 < 8, take two digits" }
      ]
    }
  ]
};