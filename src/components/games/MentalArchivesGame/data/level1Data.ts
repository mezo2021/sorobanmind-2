// src/components/games/MentalArchivesGame/data/level1Data.ts
import { LevelData } from '../gameTypes';

export const LEVEL_1_DATA: LevelData = {
  id: 'level1',
  levelNumber: 1,
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  timePerQuestionMs: 14400, // 14.4 ثانية
  requiredCorrect: 3,
  
  // 👇 فقط مشهد إبلا (المقدمة موجودة في introData)
  story: [
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
  ],
  
  example: {
    titleAr: "الْمَثَلُ الْمَحْلُول (جَمْعٌ مُبَاشِر)",
    titleEn: "Solved Example (Direct Addition)",
    problem: "2 + 3 + 1 = ؟",
    steps: [
      {
        textAr: "نُمَثِّلُ الرَّقْمَ 2: نَرْفَعُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ فِي خَانَةِ الْآحَاد.",
        textEn: "Represent 2: Lift two lower beads in the units column."
      },
      {
        textAr: "نُضِيفُ 3: لَا تُوجَدُ خَرَزَاتٌ سُفْلِيَّةٌ كَافِيَة، فَنَسْتَخْدِمُ قَاعِدَةَ (الصَّدِيقِ الصَّغِير): نُنْزِلُ الْخَرَزَةَ الْعُلْوِيَّة (+5) وَنُبْعِدُ خَرَزَتَيْنِ سُفْلِيَّتَيْنِ (-2). الْمَجْمُوعُ أَصْبَحَ 5.",
        textEn: "Add 3: Not enough lower beads, so we use the (Small Friend) rule: Bring down the upper bead (+5) and move two lower beads away (-2). The sum becomes 5."
      },
      {
        textAr: "نُضِيفُ 1: نَرْفَعُ خَرَزَةً سُفْلِيَّةً وَاحِدَة.",
        textEn: "Add 1: Lift one lower bead."
      },
      {
        textAr: "النَّتِيجَةُ النِّهَائِيَّة: 6.",
        textEn: "Final result: 6."
      }
    ]
  },
  
  questions: [
    { type: "direct", numbers: [3, 2, 4], answer: 9 },
    { type: "direct", numbers: [1, 5, 2], answer: 8 },
    { type: "complement5", numbers: [3, 4, 1], answer: 8 },
    { type: "complement5", numbers: [2, 3, 4], answer: 9 }
  ]
};