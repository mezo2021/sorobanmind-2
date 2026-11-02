// src/components/games/MentalArchivesGame/data/introData.ts
import { LevelData } from '../gameTypes';

export const INTRO_DATA: LevelData = {
  id: 'intro',
  levelNumber: 0,
  titleAr: 'البداية: شرارة الزمن',
  titleEn: 'The Beginning: Spark of Time',
  timePerQuestionMs: 0,
  requiredCorrect: 0,
  questions: [],
  example: {
    titleAr: '', titleEn: '', problem: '', steps: []
  },
  story: [
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
    }
  ]
};