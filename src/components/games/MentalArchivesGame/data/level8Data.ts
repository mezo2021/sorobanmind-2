// src/components/games/MentalArchivesGame/data/level8Data.ts
import { Chapter } from '../gameFlowTypes';

export const LEVEL_8_DATA: Chapter = {
  id: 'level8',
  titleAr: 'الْمُسْتَوَى الثَّامِنُ: الْقَلْبُ — الْخَاتِمَة (1 كْيُو)',
  titleEn: 'Level 8: The Heart — Finale (1 Kyu)',
  requires: ['level7'],
  next: undefined,
  scenes: [
    {
      kind: 'dialogue',
      id: 'level8-story',
      lines: [
        { 
          character: "aseel", 
          textAr: "وَصَلْنَا إِلَى الْقَلْبِ! هُنَا مَكْمَنُ الطَّيْفِ الصِّفْرِيِّ. لَقَدْ أَضَافَ عَمَلِيَّاتِ الطَّرْحِ فِي الْمِيتُورِي لِيُشَوِّشَ عَلَيْنَا!",
          textEn: "We have arrived at the Heart! Here is the Zero Spectrum's lair. It has added subtraction operations in Mitori to confuse us!"
        },
        { 
          character: "sorobana", 
          textAr: "هَذِهِ هِيَ الْمَعْرَكَةُ الْأَخِيرَةُ. فِي 1 كْيُو، سَنُطَبِّقُ الطَّرْحَ لِأَوَّلِ مَرَّةٍ. وَالضَّرْبُ سَيَكُونُ 3 خَانَاتٍ فِي خَانَتَيْنِ، وَالْقِسْمَةُ سَتُنْتِجُ ثَلَاثَ خَانَاتٍ. أَظْهِرَا كُلَّ مَا تَعَلَّمْتُمَاهُ!",
          textEn: "This is the final battle. In 1 Kyu, we will apply subtraction for the first time. Multiplication will be 3 digits by 2 digits, and division will yield 3 digits. Show everything you've learned!"
        }
      ]
    },
    {
      kind: 'example',
      id: 'level8-examples',
      examples: [
        // ═══ 1. أمثلة الجمع (الميتوري - 10 صفوف) ═══
        {
          titleAr: "مِثَالٌ 1: الْمِيتُورِي (جَمْعٌ فَقَطْ)",
          titleEn: "Example 1: Mitori (Addition Only)",
          problem: "345 + 128 + 765 + 901 + 234 + 567 + 890 + 123 + 456 + 678",
          tipAr: "💡 عَشَرَةُ صُفُوفٍ. تَرَكَّزْ فِي الْحَمْلِ لِلْآلَافِ.",
          tipEn: "💡 Ten rows. Focus on carrying to thousands.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 345.", textEn: "Step 1: Represent 345." },
            { textAr: "الْخُطْوَةُ 2 (+128): لِلْمِئَاتِ: نُضِيفُ 1 ← 445. لِلْعَشَرَاتِ: نُضِيفُ 2 ← (النَّاتِجُ الْمُؤَقَّتُ: 465). لِلْآحَادِ: نُضِيفُ 8 ← 473.", textEn: "Step 2 (+128): Hundreds: Add 1 → 445. Tens: Add 2 → (Intermediate: 465). Units: Add 8 → 473." },
            { textAr: "الْخُطْوَةُ 3 (+765): لِلْمِئَاتِ: نُضِيفُ 7 ← 1173. لِلْعَشَرَاتِ: نُضِيفُ 6 ← (النَّاتِجُ الْمُؤَقَّتُ: 1233). لِلْآحَادِ: نُضِيفُ 5 ← 1238.", textEn: "Step 3 (+765): Hundreds: Add 7 → 1173. Tens: Add 6 → (Intermediate: 1233). Units: Add 5 → 1238." },
            { textAr: "الْخُطْوَةُ 4 (+901): لِلْمِئَاتِ: نُضِيفُ 9 ← 2138. لِلْعَشَرَاتِ: نُضِيفُ 0 ← (النَّاتِجُ الْمُؤَقَّتُ: 2138). لِلْآحَادِ: نُضِيفُ 1 ← 2139.", textEn: "Step 4 (+901): Hundreds: Add 9 → 2138. Tens: Add 0 → (Intermediate: 2138). Units: Add 1 → 2139." },
            { textAr: "الْخُطْوَةُ 5 (+234): لِلْمِئَاتِ: نُضِيفُ 2 ← 2339. لِلْعَشَرَاتِ: نُضِيفُ 3 ← (النَّاتِجُ الْمُؤَقَّتُ: 2369). لِلْآحَادِ: نُضِيفُ 4 ← 2373.", textEn: "Step 5 (+234): Hundreds: Add 2 → 2339. Tens: Add 3 → (Intermediate: 2369). Units: Add 4 → 2373." },
            { textAr: "الْخُطْوَةُ 6 (+567): لِلْمِئَاتِ: نُضِيفُ 5 ← 2873. لِلْعَشَرَاتِ: نُضِيفُ 6 ← (النَّاتِجُ الْمُؤَقَّتُ: 2933). لِلْآحَادِ: نُضِيفُ 7 ← 2940.", textEn: "Step 6 (+567): Hundreds: Add 5 → 2873. Tens: Add 6 → (Intermediate: 2933). Units: Add 7 → 2940." },
            { textAr: "الْخُطْوَةُ 7 (+890): لِلْمِئَاتِ: نُضِيفُ 8 ← 3740. لِلْعَشَرَاتِ: نُضِيفُ 9 ← (النَّاتِجُ الْمُؤَقَّتُ: 3830). لِلْآحَادِ: نُضِيفُ 0 ← 3830.", textEn: "Step 7 (+890): Hundreds: Add 8 → 3740. Tens: Add 9 → (Intermediate: 3830). Units: Add 0 → 3830." },
            { textAr: "الْخُطْوَةُ 8 (+123): لِلْمِئَاتِ: نُضِيفُ 1 ← 3930. لِلْعَشَرَاتِ: نُضِيفُ 2 ← (النَّاتِجُ الْمُؤَقَّتُ: 3950). لِلْآحَادِ: نُضِيفُ 3 ← 3953.", textEn: "Step 8 (+123): Hundreds: Add 1 → 3930. Tens: Add 2 → (Intermediate: 3950). Units: Add 3 → 3953." },
            { textAr: "الْخُطْوَةُ 9 (+456): لِلْمِئَاتِ: نُضِيفُ 4 ← 4353. لِلْعَشَرَاتِ: نُضِيفُ 5 ← (النَّاتِجُ الْمُؤَقَّتُ: 4403). لِلْآحَادِ: نُضِيفُ 6 ← 4409.", textEn: "Step 9 (+456): Hundreds: Add 4 → 4353. Tens: Add 5 → (Intermediate: 4403). Units: Add 6 → 4409." },
            { textAr: "الْخُطْوَةُ 10 (+678): لِلْمِئَاتِ: نُضِيفُ 6 ← 5009. لِلْعَشَرَاتِ: نُضِيفُ 7 ← (النَّاتِجُ الْمُؤَقَّتُ: 5079). لِلْآحَادِ: نُضِيفُ 8 ← 5087. النَّتِيجَةُ: 5087.", textEn: "Step 10 (+678): Hundreds: Add 6 → 5009. Tens: Add 7 → (Intermediate: 5079). Units: Add 8 → 5087. Result: 5087." }
          ]
        },
        {
          titleAr: "مِثَالٌ 2: الْمِيتُورِي (مَعَ الطَّرْحِ)",
          titleEn: "Example 2: Mitori (With Subtraction)",
          problem: "956 + 412 - 235 + 678 - 129 + 543 - 301 + 876 - 492 + 123",
          tipAr: "💡 انْتَبِهْ! الصُّفُوفُ الَّتِي تَبْدَأُ بِإِشَارَةِ سَالِبٍ هِيَ عَمَلِيَّاتُ طَرْحٍ.",
          tipEn: "💡 Watch out! Rows starting with a minus sign are subtraction operations.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 956.", textEn: "Step 1: Represent 956." },
            { textAr: "الْخُطْوَةُ 2 (+412): لِلْمِئَاتِ: نُضِيفُ 4 ← 1356. لِلْعَشَرَاتِ: نُضِيفُ 1 ← (النَّاتِجُ الْمُؤَقَّتُ: 1366). لِلْآحَادِ: نُضِيفُ 2 ← 1368.", textEn: "Step 2 (+412): Hundreds: Add 4 → 1356. Tens: Add 1 → (Intermediate: 1366). Units: Add 2 → 1368." },
            { textAr: "الْخُطْوَةُ 3 (-235): لِلْمِئَاتِ: نَطْرَحُ 2 ← 1168. لِلْعَشَرَاتِ: نَطْرَحُ 3 ← (النَّاتِجُ الْمُؤَقَّتُ: 1138). لِلْآحَادِ: نَطْرَحُ 5 ← 1133.", textEn: "Step 3 (-235): Hundreds: Subtract 2 → 1168. Tens: Subtract 3 → (Intermediate: 1138). Units: Subtract 5 → 1133." },
            { textAr: "الْخُطْوَةُ 4 (+678): لِلْمِئَاتِ: نُضِيفُ 6 ← 1733. لِلْعَشَرَاتِ: نُضِيفُ 7 ← (النَّاتِجُ الْمُؤَقَّتُ: 1803). لِلْآحَادِ: نُضِيفُ 8 ← 1811.", textEn: "Step 4 (+678): Hundreds: Add 6 → 1733. Tens: Add 7 → (Intermediate: 1803). Units: Add 8 → 1811." },
            { textAr: "الْخُطْوَةُ 5 (-129): لِلْمِئَاتِ: نَطْرَحُ 1 ← 1711. لِلْعَشَرَاتِ: نَطْرَحُ 2 ← (النَّاتِجُ الْمُؤَقَّتُ: 1691). لِلْآحَادِ: نَطْرَحُ 9 ← 1682.", textEn: "Step 5 (-129): Hundreds: Subtract 1 → 1711. Tens: Subtract 2 → (Intermediate: 1691). Units: Subtract 9 → 1682." },
            { textAr: "الْخُطْوَةُ 6 (+543): لِلْمِئَاتِ: نُضِيفُ 5 ← 2182. لِلْعَشَرَاتِ: نُضِيفُ 4 ← (النَّاتِجُ الْمُؤَقَّتُ: 2222). لِلْآحَادِ: نُضِيفُ 3 ← 2225.", textEn: "Step 6 (+543): Hundreds: Add 5 → 2182. Tens: Add 4 → (Intermediate: 2222). Units: Add 3 → 2225." },
            { textAr: "الْخُطْوَةُ 7 (-301): لِلْمِئَاتِ: نَطْرَحُ 3 ← 1925. لِلْعَشَرَاتِ: نَطْرَحُ 0 ← (النَّاتِجُ الْمُؤَقَّتُ: 1925). لِلْآحَادِ: نَطْرَحُ 1 ← 1924.", textEn: "Step 7 (-301): Hundreds: Subtract 3 → 1925. Tens: Subtract 0 → (Intermediate: 1925). Units: Subtract 1 → 1924." },
            { textAr: "الْخُطْوَةُ 8 (+876): لِلْمِئَاتِ: نُضِيفُ 8 ← 2724. لِلْعَشَرَاتِ: نُضِيفُ 7 ← (النَّاتِجُ الْمُؤَقَّتُ: 2794). لِلْآحَادِ: نُضِيفُ 6 ← 2800.", textEn: "Step 8 (+876): Hundreds: Add 8 → 2724. Tens: Add 7 → (Intermediate: 2794). Units: Add 6 → 2800." },
            { textAr: "الْخُطْوَةُ 9 (-492): لِلْمِئَاتِ: نَطْرَحُ 4 ← 2400. لِلْعَشَرَاتِ: نَطْرَحُ 9 ← (النَّاتِجُ الْمُؤَقَّتُ: 2310). لِلْآحَادِ: نَطْرَحُ 2 ← 2308.", textEn: "Step 9 (-492): Hundreds: Subtract 4 → 2400. Tens: Subtract 9 → (Intermediate: 2310). Units: Subtract 2 → 2308." },
            { textAr: "الْخُطْوَةُ 10 (+123): لِلْمِئَاتِ: نُضِيفُ 1 ← 2408. لِلْعَشَرَاتِ: نُضِيفُ 2 ← (النَّاتِجُ الْمُؤَقَّتُ: 2428). لِلْآحَادِ: نُضِيفُ 3 ← 2431. النَّتِيجَةُ: 2431.", textEn: "Step 10 (+123): Hundreds: Add 1 → 2408. Tens: Add 2 → (Intermediate: 2428). Units: Add 3 → 2431. Result: 2431." }
          ]
        },
        // ═══ 2. أمثلة الضرب (الكاكي - 5 خانات) ═══
        {
          titleAr: "مِثَالٌ 3: الْكَاكِي (3 خَانَاتٍ × خَانَتَيْنِ)",
          titleEn: "Example 3: Kaki (3 digits × 2 digits)",
          problem: "123 × 45",
          tipAr: "💡 اضْرِبِ 123 فِي 4 (لِلْعَشَرَاتِ)، ثُمَّ فِي 5 (لِلْآحَادِ)، وَاجْمَعْ فِي الْأَمَاكِنِ الصَّحِيحَةِ.",
          tipEn: "💡 Multiply 123 by 4 (tens), then by 5 (units), and add in correct places.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 123.", textEn: "Step 1: Represent 123." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 123 × 4 = 492 ← نَضَعُ 4 فِي الْآلَافِ، 9 فِي الْمِئَاتِ، 2 فِي الْعَشَرَاتِ. (النَّاتِجُ الْمُؤَقَّتُ: 4920).", textEn: "Step 2 (Tens): 123 × 4 = 492 → Place 4 in thousands, 9 in hundreds, 2 in tens. (Intermediate: 4920)." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): نَحْسِبُ 123 × 5 = 615 (فِي الذِّهْنِ). ثُمَّ نُضِيفُ النَّاتِجَ: نُضِيفُ 6 إِلَى الْمِئَاتِ (9+6=15، فَيَصْعَدُ 1 لِلْآلَافِ وَيَبْقَى 5 فِي الْمِئَاتِ). نُضِيفُ 1 إِلَى الْعَشَرَاتِ (2+1=3). نُضِيفُ 5 إِلَى الْآحَادِ. النَّتِيجَةُ: 5535.", textEn: "Step 3 (Units): Calculate 123 × 5 = 615 (mentally). Then add: Add 6 to hundreds (9+6=15, carry 1 to thousands leaving 5 in hundreds). Add 1 to tens (2+1=3). Add 5 to units. Result: 5535." }
          ]
        },
        {
          titleAr: "مِثَالٌ 4: الْكَاكِي (خَانَتَانِ × 3 خَانَاتٍ)",
          titleEn: "Example 4: Kaki (2 digits × 3 digits)",
          problem: "67 × 892",
          tipAr: "💡 اضْرِبْ 892 فِي 6 (لِلْعَشَرَاتِ)، ثُمَّ فِي 7 (لِلْآحَادِ)، وَاجْمَعْ فِي الْأَمَاكِنِ الصَّحِيحَةِ.",
          tipEn: "💡 Multiply 892 by 6 (tens), then by 7 (units), and add in correct places.",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 892.", textEn: "Step 1: Represent 892." },
            { textAr: "الْخُطْوَةُ 2 (لِلْعَشَرَاتِ): 892 × 6 = 5352 ← نَضَعُ 5 فِي عَشَرَاتِ الْآلَافِ، 3 فِي الْآلَافِ، 5 فِي الْمِئَاتِ، 2 فِي الْعَشَرَاتِ. (النَّاتِجُ الْمُؤَقَّتُ: 53520).", textEn: "Step 2 (Tens): 892 × 6 = 5352 → Place 5 in ten-thousands, 3 in thousands, 5 in hundreds, 2 in tens. (Intermediate: 53520)." },
            { textAr: "الْخُطْوَةُ 3 (لِلْآحَادِ): نَحْسِبُ 892 × 7 = 6244 (فِي الذِّهْنِ). ثُمَّ نُضِيفُ النَّاتِجَ: نُضِيفُ 6 إِلَى الْآلَافِ (3+6=9). نُضِيفُ 2 إِلَى الْمِئَاتِ (5+2=7). نُضِيفُ 4 إِلَى الْعَشَرَاتِ (2+4=6). نُضِيفُ 4 إِلَى الْآحَادِ (0+4=4). النَّتِيجَةُ: 59764.", textEn: "Step 3 (Units): Calculate 892 × 7 = 6244 (mentally). Then add: Add 6 to thousands (3+6=9). Add 2 to hundreds (5+2=7). Add 4 to tens (2+4=6). Add 4 to units (0+4=4). Result: 59764." }
          ]
        },
        // ═══ 3. أمثلة القسمة (الواري - 5 خانات) ═══
        {
          titleAr: "مِثَالٌ 5: الْوَارِي (خَانَتَانِ ÷ خَانَتَيْنِ = 3 خَانَاتٍ)",
          titleEn: "Example 5: Wari (2 digits ÷ 2 digits = 3 digits)",
          problem: "34500 ÷ 46",
          tipAr: "💡 نُقَدِّرُ النَّاتِجَ بِأَخْذِ أَوَّلِ ثَلَاثِ أَرْقَامٍ (345).",
          tipEn: "💡 Estimate the result by taking the first three digits (345).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 34500.", textEn: "Step 1: Represent 34500." },
            { textAr: "الْخُطْوَةُ 2 (الْمِئَاتُ): نُقَدِّرُ 345 ÷ 46 = 7. نَضَعُ 7 فِي خَانَةِ الْمِئَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (7 × 46 = 322) ← 345 - 322 = 23 (يَتَبَقَّى 2300).", textEn: "Step 2 (Hundreds): Estimate 345 ÷ 46 = 7. Place 7 in hundreds column (of result). Subtract: (7 × 46 = 322) → 345 - 322 = 23 (remains 2300)." },
            { textAr: "الْخُطْوَةُ 3 (الْعَشَرَاتُ): نُقَدِّرُ 230 ÷ 46 = 5. نَضَعُ 5 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (5 × 46 = 230) ← 230 - 230 = 0 (يَتَبَقَّى 0).", textEn: "Step 3 (Tens): Estimate 230 ÷ 46 = 5. Place 5 in tens column (of result). Subtract: (5 × 46 = 230) → 230 - 230 = 0 (remains 0)." },
            { textAr: "الْخُطْوَةُ 4 (الْآحَادُ): 0 ÷ 46 = 0. نَضَعُ 0 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). النَّتِيجَةُ: 750.", textEn: "Step 4 (Units): 0 ÷ 46 = 0. Place 0 in units column (of result). Result: 750." }
          ]
        },
        {
          titleAr: "مِثَالٌ 6: الْوَارِي (4 خَانَاتٍ ÷ 3 خَانَاتٍ)",
          titleEn: "Example 6: Wari (4 digits ÷ 3 digits)",
          problem: "6090 ÷ 210",
          tipAr: "💡 الْمَقْسُومُ عَلَيْهِ يَنْتَهِي بِصِفْرٍ. نُلْغِي الصِّفْرَ مِنَ الطَّرَفَيْنِ لِلتَّسْهِيلِ (609 ÷ 21).",
          tipEn: "💡 The divisor ends with a zero. Cancel the zero from both sides to simplify (609 ÷ 21).",
          steps: [
            { textAr: "الْخُطْوَةُ 1: نُمَثِّلُ 609 (بَعْدَ إِلْغَاءِ الصِّفْرِ).", textEn: "Step 1: Represent 609 (after cancelling the zero)." },
            { textAr: "الْخُطْوَةُ 2 (الْعَشَرَاتُ): نُقَدِّرُ 60 ÷ 21 = 2. نَضَعُ 2 فِي خَانَةِ الْعَشَرَاتِ (لِلنَّاتِجِ). نَطْرَحُ: (2 × 21 = 42) ← 60 - 42 = 18 (يَتَبَقَّى 189).", textEn: "Step 2 (Tens): Estimate 60 ÷ 21 = 2. Place 2 in tens column (of result). Subtract: (2 × 21 = 42) → 60 - 42 = 18 (remains 189)." },
            { textAr: "الْخُطْوَةُ 3 (الْآحَادُ): نُقَدِّرُ 189 ÷ 21 = 9. نَضَعُ 9 فِي خَانَةِ الْآحَادِ (لِلنَّاتِجِ). نَطْرَحُ: (9 × 21 = 189) ← 189 - 189 = 0. النَّتِيجَةُ: 29.", textEn: "Step 3 (Units): Estimate 189 ÷ 21 = 9. Place 9 in units column (of result). Subtract: (9 × 21 = 189) → 189 - 189 = 0. Result: 29." }
          ]
        }
      ]
    },
    {
      kind: 'challenge',
      id: 'level8-challenge',
      timePerQuestionMs: 24000,
      requiredCorrect: 5,
      questions: [
        { type: "mitori", numbers: [345, 128, 765, 901, 234, 567, 890, 123, 456, 678], answer: 5087, tipAr: "عَشَرَةُ صُفُوفٍ. تَرَكَّزْ فِي الْحَمْلِ", tipEn: "Ten rows. Focus on carry" },
        { type: "mitori", numbers: [956, 412, -235, 678, -129, 543, -301, 876, -492, 123], answer: 2431, tipAr: "الصُّفُوفُ السَّالِبَةُ هِيَ طَرْحٌ", tipEn: "Negative rows are subtraction" },
        { type: "multiplication", numbers: [123, 45], answer: 5535, tipAr: "اضْرِبْ ثُمَّ اجْمَعْ", tipEn: "Multiply then add" },
        { type: "multiplication", numbers: [67, 892], answer: 59764, tipAr: "تَرَكَّزْ فِي حَمْلِ الْآلَافِ", tipEn: "Focus on thousands carry" },
        { type: "division", numbers: [34500, 46], answer: 750, tipAr: "قَدِّرْ 345 ÷ 46", tipEn: "Estimate 345 ÷ 46" },
        { type: "division", numbers: [6090, 210], answer: 29, tipAr: "أَلْغِ الصِّفْرَ (609 ÷ 21)", tipEn: "Cancel the zero (609 ÷ 21)" }
      ]
    }
  ]
};