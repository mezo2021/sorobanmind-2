// src/components/games/MentalArchivesGame/data/introData.ts
import { Chapter } from '../gameFlowTypes';

export const INTRO_DATA: Chapter = {
  id: 'intro',
  titleAr: 'البداية: شرارة الزمن',
  titleEn: 'The Beginning: Spark of Time',
  requires: [], 
  next: 'level1',
  scenes: [
    {
      kind: 'dialogue',
      id: 'intro-scene-1',
      lines: [
        { 
          character: "jud", 
          textAr: "فِي لَيْلَةٍ هَادِئَةٍ، دَاخِلَ شُقَّةٍ صَغِيرَةٍ عَلَى سَاحِلِ مَرْسِين، كُنَّا نُرَاجِعُ حِسَابَاتِنَا عَلَى سُورُوبَانٍ خَشَبِيٍّ أَمَامَ جِهَازٍ لَوْحِيٍّ. فَجْأَةً، أَضَاءَ الْجِهَازُ بِوَمِيضٍ أَزْرَق، وَبَدَأَتِ الْخَرَزَاتُ تَلْمَعُ وَتَنْزَلِقُ وَحْدَهَا!",
          textEn: "On a quiet night, inside a small apartment on the coast of Mersin, we were reviewing our calculations on a wooden soroban in front of a tablet. Suddenly, the device flashed with a blue glow, and the beads began to shine and slide on their own!"
        },
        { 
          character: "aseel", 
          textAr: "جُود، انْظُرْ! هَذِهِ لَيْسَتْ أَدَاةً عَادِيَّة. هُنَاكَ دَوَائِرُ مِنَ الضَّوْءِ تَتَشَكَّلُ فِي الْهَوَاء، وَكَأَنَّهَا بَوَّابَة!",
          textEn: "Joud, look! This is not an ordinary tool. There are circles of light forming in the air, as if it is a portal!"
        },
        { 
          character: "sorobana", 
          textAr: "أَهْلاً بِكُمَا. أَنَا سُورُوبَانَا، مِنْ أَرْشِيفِ سُورِيَا الرَّقْمِيِّ عَامَ 2125. أَصَابَ نِظَامَنَا خَلَلٌ أَسْمَيْنَاهُ (الطَّيْفُ الصِّفْرِيُّ). إِنَّهُ يَمْحُو الصِّلَاتِ بَيْنَ سِجِلَّاتِ التَّارِيخ. إِذَا اخْتَفَتِ الصِّلَات، لَنْ يَعْرِفَ أَطْفَالُ الْمُسْتَقْبَلِ كَيْفَ تَطَوَّرَتِ الْأَرْقَام.",
          textEn: "Welcome, both of you. I am Sorobana, from the Syrian Digital Archive of the year 2125. A glitch we named (the Zero Spectrum) has struck our system. It erases the links between the records of history. If the connections disappear, the children of the future will not know how numbers evolved."
        },
        { 
          character: "jud", 
          textAr: "كَيْفَ يُمْكِنُنَا مُسَاعَدَتُكِ؟",
          textEn: "How can we help you?"
        },
        { 
          character: "sorobana", 
          textAr: "عَبْرَ (بَوَّابَةِ الثَّقْبِ الدُّودِيِّ)، سَتُسَافِرَانِ إِلَى الْعُصُورِ لِإِعَادَةِ رَبْطِ السِّجِلَّات. ابْدَآ مِنْ إِبْلَا وَمَارِي، أَقْدَمِ السِّجِلَّات. وَتَذَكَّرَا: الْمِعْدَادُ الَّذِي فِي يَدَيْكُمَا هُوَ أَدَاةٌ تَعْلِيمِيَّةٌ مُسْتَقْبَلِيَّة، لَيْسَ أَدَاةً أَثَرِيَّةً مِنْ ذَلِكَ الْعَصْر.",
          textEn: "Through the (Wormhole Gate), you will travel across the ages to reconnect the records. Start with Ebla and Mari, the oldest of records. And remember: the abacus in your hands is a future educational tool, not an ancient artifact from that era."
        },
        { 
          character: "jud", 
          textAr: "وَهَذَا الطَّيْفُ الصِّفْرِيُّ... هَلْ نُحَارِبُهُ؟",
          textEn: "And this Zero Spectrum... do we fight it?"
        },
        { 
          character: "sorobana", 
          textAr: "لَا. الْخَلَلُ يُصْلَحُ، وَلَا يُحَارَبُ. فِي كُلِّ عَصْر، سَتَتَعَلَّمَانِ قَاعِدَةً جَدِيدَةً مِنْ قَوَاعِدِ (الْأَنْزَانِ الذِّهْنِيّ). هَلْ أَنْتُمَا مُسْتَعِدَّان؟",
          textEn: "No. A glitch is mended, not fought. In every era, you will learn a new rule from the rules of (Mental Anzan). Are you both ready?"
        },
        { 
          character: "aseel", 
          textAr: "أَرَى نَمَطاً فِي الْأَرْقَامِ الْمُتَسَاقِطَة! جُود، الْبَوَّابَةُ تَفْتَحُ عَلَى أَقْدَمِ السِّجِلَّات. لِنَبْدَأ!",
          textEn: "I see a pattern in the falling numbers! Joud, the gate opens onto the oldest records. Let us begin!"
        }
      ]
    }
  ]
};