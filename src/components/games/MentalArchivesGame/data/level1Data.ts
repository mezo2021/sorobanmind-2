// src/components/games/MentalArchivesGame/data/level1Data.ts
import { LevelData } from '../gameTypes';

export const LEVEL_1_DATA: LevelData = {
  id: 'level1',
  levelNumber: 1,
  titleAr: 'المستوى الأول: رفوف الذاكرة',
  titleEn: 'Level 1: Memory Shelves',
  timePerQuestionMs: 14400, // 14.4 ثانية
  requiredCorrect: 3,
  
  story: [
    // --- مشهد مرسين (التمهيد) ---
    { 
      character: "jud", 
      textAr: "فِي لَيْلَةٍ هَادِئَةٍ عَلَى سَاحِلِ مَرْسِين، كُنَّا نُرَاجِعُ حِسَابَاتِنَا. فَجْأَةً، بَدَأَتِ الْخَرَزَاتُ فِي الْمِعْدَادِ تَلْمَعُ وَتَنْزَلِقُ وَحْدَهَا!",
      textEn: "On a quiet night on the coast of Mersin, we were reviewing our calculations. Suddenly, the beads on the abacus began to glow and slide on their own!"
    },
    { 
      character: "aseel", 
      textAr: "جُود، انْظُرْ! هَذِهِ لَيْسَتْ أَدَاةً عَادِيَّة. هُنَاكَ دَوَائِرُ مِنَ الضَّوْءِ تَتَشَكَّلُ فِي الْهَوَاء، وَكَأَنَّهَا بَوَّابَة!",
      textEn: "Joud, look! This is not an ordinary tool. There are circles of light forming in the air, as if it is a portal!"
    },
    { 
      character: "sorobana", 
      textAr: "مَرْحَباً بِكُمَا. أَنَا سُورُوبَانَا، مُرْشِدَةٌ أَرْشِيفِيَّةٌ مِنَ الْمُسْتَقْبَل. الطَّيْفُ الصِّفْرِيُّ يَمْحُو الرَّوَابِطَ بَيْنَ السِّجِلَّاتِ الزَّمَنِيَّة. إِذَا اخْتَفَتِ الصِّلَات، لَنْ يَعْرِفَ أَطْفَالُ الْمُسْتَقْبَلِ كَيْفَ تَطَوَّرَتِ الْأَرْقَام.",
      textEn: "Welcome. I am Sorobana, an archive guide from the future. The Zero Spectrum is erasing the links between time records. If the connections disappear, the children of the future will not know how numbers evolved."
    },
    { 
      character: "jud", 
      textAr: "كَيْفَ يُمْكِنُنَا مُسَاعَدَتُكِ؟",
      textEn: "How can we help you?"
    },
    { 
      character: "sorobana", 
      textAr: "عَبْرَ هَذِهِ الْبَوَّابَة، سَتُسَافِرَانِ إِلَى أَقْدَمِ السِّجِلَّات. ابْدَآ مِنْ إِبْلَا وَمَارِي. لَكِنْ تَذَكَّرَا: الْمِعْدَادُ الَّذِي فِي يَدَيْكُمَا هُوَ أَدَاةٌ تَعْلِيمِيَّةٌ مُسْتَقْبَلِيَّة، وَلَيْسَ أَدَاةً أَثَرِيَّةً مِنْ ذَلِكَ الْعَصْر.",
      textEn: "Through this portal, you will travel to the oldest records. Start with Ebla and Mari. But remember: the abacus in your hands is a future educational tool, not an ancient artifact from that era."
    },
    // --- مشهد إبلا ---
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