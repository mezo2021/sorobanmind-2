// src/curriculum/lessons/L0/S01.ts
import type { LessonNode } from "../types";

export const L0_S01: LessonNode = {
  id: "L0-S01",
  skillId: "S01",
  levelId: "L0",
  order: 2,
  title: { ar: "تمثيل الأرقام من 0 إلى 9", en: "Representing Numbers 0-9" },
  emoji: "🔢",
  tags: ["build", "read", "kids", "L0"],

  story: {
    ar: "في يوم مشمس، وصل ثلاثة أبطال صغار — شام وريان وبانة — إلى بوابة خشبية ضخمة نُقش عليها: قلعة السوروبان، من يدخلها يصبح سيد الأرقام. دقّوا الجرس، فانفتح الباب، وظهر حارس القلعة: رجل خشبي اسمه الإطار. قال مبتسماً: في هذه القلعة تسكن عائلة غريبة — أربعة أطفال نشيطون في الطابق السفلي، كل واحد قيمته واحد. وفوق الجسر تسكن الجدة الحنونة، قيمتها خمسة.",
    en: "In the Castle of Soroban, four children live below the beam, each worth 1. Above the beam lives the kind grandmother, worth 5.",
  },
  storyAudioText: "فِي يَوْمٍ مُشْمِس، وَصَلَ ثَلَاثَةُ أَبْطَالٍ صِغَار — شَام وَرَيَّان وَبَانَة — إِلَى بَوَّابَةٍ خَشَبِيَّةٍ ضَخْمَةٍ نُقِشَ عَلَيْهَا: قَلْعَةُ السُّورُوبَان، مَنْ يَدْخُلْهَا يُصْبِحْ سَيِّدَ الأَرْقَام. دَقُّوا الجَرَس، فَانْفَتَحَ البَاب، وَظَهَرَ حَارِسُ القَلْعَة: رَجُلٌ خَشَبِيٌّ اسْمُهُ الإِطَار. قَالَ مُبْتَسِماً: فِي هَذِهِ القَلْعَةِ تَسْكُنُ عَائِلَةٌ غَرِيبَة — أَرْبَعَةُ أَطْفَالٍ نَشِيطُونَ فِي الطَّابِقِ السُّفْلِيّ، كُلُّ وَاحِدٍ قِيمَتُهُ وَاحِد. وَفَوْقَ الجِسْرِ تَسْكُنُ الجَدَّةُ الحَنُونَة، قِيمَتُهَا خَمْسَة. | In the Castle of Soroban, four children live below the beam, each worth 1. Above the beam lives the kind grandmother, worth 5.",
  storyAudioId: 1,

  modules: [
    {
      id: "m1",
      ruleCategory: "build",
      title: "تمثيل 0-4",
      titleEn: "Representing 0-4",
      emoji: "🧒",
      rule: { 
        description: "لتمثيل 0-4: ارفع من 0 إلى 4 خرزات سفلية بالإبهام نحو العارضة. | To represent 0-4: Lift 0 to 4 lower beads with the thumb toward the bar.",
      },
      condition: { 
        formula: "0 ≤ n ≤ 4 | 0 ≤ n ≤ 4", 
        explanation: "الأطفال الأربعة يكفون لتمثيل الأرقام من 0 إلى 4. | The four children are enough to represent numbers from 0 to 4.",
      },
      discrimination: {
        steps: [{
          question: "هل الرقم المطلوب بين 0 و 4؟ | Is the required number between 0 and 4?",
          type: "yes-no",
          actual: "الرقم من 0 إلى 4 | Number from 0 to 4",
          answer: "نعم → استخدم الأطفال (الخرزات السفلية) | Yes → Use the children (lower beads)",
          hint: "0 = لا خرزات · 1 = خرزة · 2 = خرزتان · 3 = ثلاث · 4 = أربع | 0 = no beads · 1 = 1 bead · 2 = 2 beads · 3 = 3 beads · 4 = 4 beads",
        }],
        decision: "ارفع عددًا من الخرزات السفلية يساوي الرقم! | Lift a number of lower beads equal to the number!",
      },
      watchPhase: {
        examples: [
          { 
            id: "S01-m1-E1", 
            question: "مثّل الرقم 0 | Represent number 0", 
            discrimination: "لا خرزة تلامس العارضة = 0. | No bead touching the bar = 0.", 
            rule: "0 = لا خرزات | 0 = no beads", 
            fingerMovement: "السبابة تُبعد كل الخرزات عن العارضة ⬇️ | Index pushes all beads away from the bar ⬇️", 
            steps: [
              "المعداد مصفّر | Abacus cleared", 
              "الخرزات بعيدة عن العارضة | Beads away from the bar", 
              "الناتج: 0 | Result: 0"
            ], 
            result: 0, 
            beadVisual: "صفر خرزات | Zero beads" 
          },
          { 
            id: "S01-m1-E2", 
            question: "مثّل الرقم 1 | Represent number 1", 
            discrimination: "الأطفال متوفّرون → طفل واحد يكفي. | Children available → One child is enough.", 
            rule: "1 = خرزة سفلية | 1 = one lower bead", 
            fingerMovement: "الإبهام يرفع خرزة سفلية ⬆️ | Thumb lifts one lower bead ⬆️", 
            steps: [
              "ارفع خرزة سفلية بالإبهام ⬆️ | Lift 1 lower bead with thumb ⬆️", 
              "الناتج: 1 | Result: 1"
            ], 
            result: 1, 
            beadVisual: "خرزة سفلية واحدة | 1 lower bead" 
          },
          { 
            id: "S01-m1-E3", 
            question: "مثّل الرقم 2 | Represent number 2", 
            discrimination: "المطلوب 2 → الأطفال متوفّرون. | Required 2 → Children available.", 
            rule: "2 = خرزتان | 2 = two lower beads", 
            fingerMovement: "الإبهام يرفع خرزتين ⬆️ | Thumb lifts two lower beads ⬆️", 
            steps: [
              "ارفع خرزتين بالإبهام ⬆️ | Lift 2 lower beads with thumb ⬆️", 
              "الناتج: 2 | Result: 2"
            ], 
            result: 2, 
            beadVisual: "خرزتان سفليتان | 2 lower beads" 
          },
          { 
            id: "S01-m1-E4", 
            question: "مثّل الرقم 3 | Represent number 3", 
            discrimination: "المطلوب 3 → الأطفال متوفّرون. | Required 3 → Children available.", 
            rule: "3 = ثلاث خرزات | 3 = three lower beads", 
            fingerMovement: "الإبهام يرفع ثلاث خرزات ⬆️ | Thumb lifts three lower beads ⬆️", 
            steps: [
              "ارفع ثلاث خرزات بالإبهام ⬆️ | Lift 3 lower beads with thumb ⬆️", 
              "الناتج: 3 | Result: 3"
            ], 
            result: 3, 
            beadVisual: "ثلاث خرزات | 3 lower beads" 
          },
          { 
            id: "S01-m1-E5", 
            question: "مثّل الرقم 4 | Represent number 4", 
            discrimination: "المطلوب 4 → كل الأطفال. | Required 4 → All children.", 
            rule: "4 = الأربع خرزات | 4 = four lower beads", 
            fingerMovement: "الإبهام يرفع الأربع خرزات ⬆️ | Thumb lifts four lower beads ⬆️", 
            steps: [
              "ارفع الأربع خرزات بالإبهام ⬆️ | Lift 4 lower beads with thumb ⬆️", 
              "الناتج: 4 | Result: 4"
            ], 
            result: 4, 
            beadVisual: "أربع خرزات (العائلة كاملة) | 4 lower beads (full family)" 
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S01-m1-T1", 
            question: "مثّل 2 | Represent 2", 
            discrimination: "2 ≤ 4 | 2 ≤ 4", 
            steps: [
              "ارفع خرزتين بالإبهام ⬆️ | Lift 2 lower beads with thumb ⬆️", 
              "الناتج: 2 | Result: 2"
            ], 
            result: 2 
          },
          { 
            id: "S01-m1-T2", 
            question: "مثّل 4 | Represent 4", 
            discrimination: "4 = كل الأطفال | 4 = all children", 
            steps: [
              "ارفع الأربع خرزات ⬆️ | Lift 4 lower beads ⬆️", 
              "الناتج: 4 | Result: 4"
            ], 
            result: 4 
          },
          { 
            id: "S01-m1-T3", 
            question: "مثّل 1 | Represent 1", 
            discrimination: "1 = طفل | 1 = one child", 
            steps: [
              "ارفع خرزة واحدة ⬆️ | Lift 1 lower bead ⬆️", 
              "الناتج: 1 | Result: 1"
            ], 
            result: 1 
          },
          { 
            id: "S01-m1-T4", 
            question: "مثّل 3 | Represent 3", 
            discrimination: "3 = ثلاثة أطفال | 3 = three children", 
            steps: [
              "ارفع ثلاث خرزات ⬆️ | Lift 3 lower beads ⬆️", 
              "الناتج: 3 | Result: 3"
            ], 
            result: 3 
          },
        ],
      },
    },
    {
      id: "m2",
      ruleCategory: "build",
      title: "تمثيل 5-9",
      titleEn: "Representing 5-9",
      emoji: "👵",
      rule: { 
        formula: "5 + k (حيث k = n − 5) | 5 + k (where k = n − 5)", 
        description: "أنزل الجدة 5 بالسبابة، ثم ارفع الخرزات المتبقية (k) بالإبهام. | Bring down Grandma 5 with index, then lift the remaining beads (k) with thumb.",
      },
      condition: { 
        formula: "5 ≤ n ≤ 9 | 5 ≤ n ≤ 9", 
        explanation: "الجدة 5 + الخرزات المتبقية (k). | Grandma 5 + remaining beads (k).",
      },
      discrimination: {
        steps: [
          { 
            question: "هل الرقم بين 5 و 9؟ | Is the number between 5 and 9?", 
            type: "yes-no", 
            actual: "5 ≤ n ≤ 9 | 5 ≤ n ≤ 9",
            answer: "نعم → الجدة + أطفال | Yes → Grandma + children" 
          },
          { 
            question: "كم طفلاً (k = n − 5)؟ | How many children (k = n − 5)?", 
            type: "value", 
            actual: "k = n − 5 | k = n − 5",
            answer: "ارفع عدد الخرزات المتبقية (k) | Lift the remaining beads (k)", 
            hint: "5=0 · 6=1 · 7=2 · 8=3 · 9=4 | 5=0 · 6=1 · 7=2 · 8=3 · 9=4" 
          },
        ],
        decision: "أنزل 5 بالسبابة ⬇️، ارفع الخرزات المتبقية (k) بالإبهام ⬆️! | Bring down 5 with index ⬇️, lift remaining beads (k) with thumb ⬆️!",
      },
      watchPhase: {
        examples: [
          { 
            id: "S01-m2-E1", 
            question: "مثّل 5 | Represent 5", 
            discrimination: "5 = الجدة وحدها. | 5 = Grandma alone.", 
            rule: "5 = العلوية | 5 = upper bead", 
            fingerMovement: "السبابة تُنزل العلوية ⬇️ | Index brings down upper bead ⬇️", 
            steps: [
              "أنزل العلوية ⬇️ | Bring down upper bead ⬇️", 
              "الناتج: 5 | Result: 5"
            ], 
            result: 5, 
            beadVisual: "العلوية = 5 | Upper bead = 5" 
          },
          { 
            id: "S01-m2-E2", 
            question: "مثّل 6 | Represent 6", 
            discrimination: "6 = 5+1. | 6 = 5+1.", 
            rule: "6 = العلوية + 1 | 6 = upper + 1", 
            fingerMovement: "السبابة 5 ⬇️، الإبهام 1 ⬆️ | Index 5 ⬇️, thumb 1 ⬆️", 
            steps: [
              "أنزل 5 ⬇️ | Bring down 5 ⬇️", 
              "ارفع 1 ⬆️ | Lift 1 ⬆️", 
              "الناتج: 6 | Result: 6"
            ], 
            result: 6, 
            beadVisual: "5+1 = 6 | 5+1 = 6" 
          },
          { 
            id: "S01-m2-E3", 
            question: "مثّل 7 | Represent 7", 
            discrimination: "7 = 5+2. | 7 = 5+2.", 
            rule: "7 = العلوية + 2 | 7 = upper + 2", 
            fingerMovement: "5 ⬇️ ثم 2 ⬆️ | 5 ⬇️ then 2 ⬆️", 
            steps: [
              "أنزل 5 ⬇️ | Bring down 5 ⬇️", 
              "ارفع 2 ⬆️ | Lift 2 ⬆️", 
              "الناتج: 7 | Result: 7"
            ], 
            result: 7, 
            beadVisual: "5+2 = 7 | 5+2 = 7" 
          },
          { 
            id: "S01-m2-E4", 
            question: "مثّل 8 | Represent 8", 
            discrimination: "8 = 5+3. | 8 = 5+3.", 
            rule: "8 = العلوية + 3 | 8 = upper + 3", 
            fingerMovement: "5 ⬇️ ثم 3 ⬆️ | 5 ⬇️ then 3 ⬆️", 
            steps: [
              "أنزل 5 ⬇️ | Bring down 5 ⬇️", 
              "ارفع 3 ⬆️ | Lift 3 ⬆️", 
              "الناتج: 8 | Result: 8"
            ], 
            result: 8, 
            beadVisual: "5+3 = 8 | 5+3 = 8" 
          },
          { 
            id: "S01-m2-E5", 
            question: "مثّل 9 | Represent 9", 
            discrimination: "9 = 5+4. | 9 = 5+4.", 
            rule: "9 = العلوية + 4 | 9 = upper + 4", 
            fingerMovement: "5 ⬇️ ثم 4 ⬆️ | 5 ⬇️ then 4 ⬆️", 
            steps: [
              "أنزل 5 ⬇️ | Bring down 5 ⬇️", 
              "ارفع 4 ⬆️ | Lift 4 ⬆️", 
              "الناتج: 9 | Result: 9"
            ], 
            result: 9, 
            beadVisual: "5+4 = 9 | 5+4 = 9" 
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S01-m2-T1", 
            question: "مثّل 6 | Represent 6", 
            discrimination: "6 = 5+1 | 6 = 5+1", 
            steps: [
              "5 ⬇️ | 5 ⬇️", 
              "1 ⬆️ | 1 ⬆️", 
              "الناتج: 6 | Result: 6"
            ], 
            result: 6 
          },
          { 
            id: "S01-m2-T2", 
            question: "مثّل 8 | Represent 8", 
            discrimination: "8 = 5+3 | 8 = 5+3", 
            steps: [
              "5 ⬇️ | 5 ⬇️", 
              "3 ⬆️ | 3 ⬆️", 
              "الناتج: 8 | Result: 8"
            ], 
            result: 8 
          },
          { 
            id: "S01-m2-T3", 
            question: "مثّل 7 | Represent 7", 
            discrimination: "7 = 5+2 | 7 = 5+2", 
            steps: [
              "5 ⬇️ | 5 ⬇️", 
              "2 ⬆️ | 2 ⬆️", 
              "الناتج: 7 | Result: 7"
            ], 
            result: 7 
          },
          { 
            id: "S01-m2-T4", 
            question: "مثّل 9 | Represent 9", 
            discrimination: "9 = 5+4 | 9 = 5+4", 
            steps: [
              "5 ⬇️ | 5 ⬇️", 
              "4 ⬆️ | 4 ⬆️", 
              "الناتج: 9 | Result: 9"
            ], 
            result: 9 
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت تمثيل الأرقام من 0 إلى 9! | You mastered representing numbers from 0 to 9!",
    encouragement: "🎉 أنت الآن تعرف لغة السوروبان الأولى! | 🎉 You now know the first language of the Soroban!",
    totalExamples: 10,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default L0_S01;