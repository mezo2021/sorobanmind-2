// src/curriculum/lessons/L0/S02.ts
// 📖 درس S02: القيمة المكانية وبناء الأعداد (مطور للأطفال وفق منهجية تاكاشي كوجيما - ثنائي اللغة)
// 📅 آخر تحديث: 2026-10-09 — ربط الصوت story-10.mp3

import type { LessonNode } from "../types";

export const L0_S02: LessonNode = {
  id: "L0-S02",
  skillId: "S02",
  levelId: "L0",
  order: 3,
  title: { ar: "القيمة المكانية وبناء الأعداد", en: "Place Value & Building Numbers" },
  emoji: "🏠",
  tags: ["build", "read", "kids", "L0", "place-value"],

  story: {
    ar: "مرحباً بكم يا أبطال الأعداد! هل تعلمون أن المعداد مليء ببيوت ملونة ومجتزأة؟ البيت الأول على اليمين هو بيت الآحاد الصغار، والبيت الثاني هو بيت العشرات الأبطال، ثم المئات والآلاف! تعالوا نتعلم كيف نبني الأعداد كالمحافظين والمهندسين الكبار!",
    en: "Welcome, number heroes! Did you know the abacus is full of colorful houses? The first rod on the right is the Units house, the second is the Tens house, then Hundreds and Thousands! Let's learn how to build numbers like master architects!",
  },
  storyAudioId: 10,

  modules: [
    // =========================================================================
    // Module 1: Units and Tens (الآحاد والعشرات)
    // =========================================================================
    {
      id: "m1",
      ruleCategory: "build",
      title: "الآحاد والعشرات",
      titleEn: "Units and Tens",
      emoji: "🔟",
      rule: {
        description: "بيوت الأرقام 🏡: كل عمود يمثّل بيتاً مجاوراً — بيت الآحاد الصغير على اليمين، وبيت العشرات البطل على يساره مباشرة! | Number Houses 🏡: Each rod is a neighborhood house — the small Units house on the right, and the mighty Tens house right to its left!",
      },
      condition: {
        formula: "n = عشرات × 10 + آحاد",
        explanation: "ابدأ دائماً بتفعيل خرزات بيت العشرات الكبيرة أولاً، ثم انتقل لبيت الآحاد! | Always start by setting beads in the Tens house first, then move to the Units house!",
      },
      discrimination: {
        steps: [
          {
            question: "هل يحتوي العدد على عشرات؟ | Does the number have tens?",
            type: "yes-no",
            answer: "نعم → ارفع الخرزات في العمود الثاني (العشرات) ⬆️ | Yes → Lift beads in the second rod (Tens) ⬆️",
            hint: "بيت العشرات هو العمود الثاني من جهة اليمين | Tens house is the second rod from the right",
          },
          {
            question: "كم عدد الآحاد؟ | How many units?",
            type: "value",
            answer: "مثّل الآحاد في العمود الأول (اليمين) ⬆️⬇️ | Set units in the first rod (Right) ⬆️⬇️",
            hint: "بيت الآحاد هو العمود الأول على اليمين | Units house is the first rod on the right",
          },
        ],
        decision: "ابدأ بالعشرات أولاً، ثم جهّز الآحاد! | Start with Tens first, then build Units!",
      },
      watchPhase: {
        examples: [
          {
            id: "S02-m1-E1",
            question: "مثّل 10 | Build 10",
            discrimination: "10 = 1 في بيت العشرات و0 في بيت الآحاد | 10 = 1 in Tens house and 0 in Units house",
            rule: "رفع خرزة 1 في العشرات وترك الآحاد فارغة | Lift 1 bead in Tens and leave Units empty",
            fingerMovement: "👍 الإبهام يرفع خرزة 1 في عمود العشرات ⬆️ | Thumb lifts 1 bead in Tens rod ⬆️",
            steps: [
              "ارفع 1 في عمود العشرات بالإبهام ⬆️ | Lift 1 in Tens rod with thumb ⬆️",
              "اترك عمود الآحاد فارغاً | Leave Units rod empty",
              "الناتج الظاهر: 10 | Result: 10",
            ],
            result: 10,
            beadVisual: "1 في العشرات و0 في الآحاد = 10 | 1 in Tens and 0 in Units = 10",
          },
          {
            id: "S02-m1-E2",
            question: "مثّل 12 | Build 12",
            discrimination: "12 = 1 عشرات + 2 آحاد | 12 = 1 Tens + 2 Units",
            rule: "بناء 10 ثم إضافة 2 في الآحاد | Build 10 then add 2 in Units",
            fingerMovement: "👍 الإبهام يرفع 1 في العشرات، ثم يرفع 2 في الآحاد ⬆️ | Thumb lifts 1 in Tens, then lifts 2 in Units ⬆️",
            steps: [
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in Tens with thumb ⬆️",
              "ارفع 2 في الآحاد بالإبهام ⬆️ | Lift 2 in Units with thumb ⬆️",
              "الناتج الظاهر: 12 | Result: 12",
            ],
            result: 12,
            beadVisual: "1 في العشرات و2 في الآحاد = 12 | 1 in Tens and 2 in Units = 12",
          },
          {
            id: "S02-m1-E3",
            question: "مثّل 25 | Build 25",
            discrimination: "25 = 2 عشرات + 5 آحاد | 25 = 2 Tens + 5 Units",
            rule: "رفع 2 في العشرات وتنزل الجدة 5 في الآحاد | Lift 2 in Tens and bring down 5 in Units",
            fingerMovement: "👍 الإبهام يرفع 2 في العشرات ⬆️، 👆 والسبابة تُنزل 5 في الآحاد ⬇️ | Thumb lifts 2 in Tens ⬆️, index brings down 5 in Units ⬇️",
            steps: [
              "ارفع خرزتين في العشرات بالإبهام ⬆️ | Lift 2 beads in Tens with thumb ⬆️",
              "أنزل خرزة 5 في الآحاد بالسبابة ⬇️ | Bring down bead 5 in Units with index ⬇️",
              "الناتج الظاهر: 25 | Result: 25",
            ],
            result: 25,
            beadVisual: "2 في العشرات و5 علوية في الآحاد = 25 | 2 in Tens and upper 5 in Units = 25",
          },
          {
            id: "S02-m1-E4",
            question: "مثّل 47 | Build 47",
            discrimination: "47 = 4 عشرات + 7 آحاد (5 علوية + 2 سفلية) | 47 = 4 Tens + 7 Units (5 upper + 2 lower)",
            rule: "رفع 4 في العشرات، ثم الكماشة تُشكل 7 في الآحاد | Lift 4 in Tens, then pinch gesture forms 7 in Units",
            fingerMovement: "👍 الإبهام يرفع 4 في العشرات ⬆️، 🗜️ والكماشة تضع 7 في الآحاد | Thumb lifts 4 in Tens ⬆️, pinch sets 7 in Units",
            steps: [
              "ارفع 4 خرزات في العشرات بالإبهام ⬆️ | Lift 4 beads in Tens with thumb ⬆️",
              "أنزل 5 بالسبابة وارفع 2 بالإبهام في الآحاد 🗜️ | Bring down 5 with index & lift 2 with thumb in Units 🗜️",
              "الناتج الظاهر: 47 | Result: 47",
            ],
            result: 47,
            beadVisual: "4 في العشرات و7 في الآحاد = 47 | 4 in Tens and 7 in Units = 47",
          },
          {
            id: "S02-m1-E5",
            question: "مثّل 99 | Build 99",
            discrimination: "99 = كل عمود ممتلئ بـ 9 | 99 = Every rod filled with 9",
            rule: "ملء بيت العشرات بـ 9 ثم بيت الآحاد بـ 9 | Fill Tens with 9 then Units with 9",
            fingerMovement: "🗜️ كماشة مغلقة في العشرات (5+4) ثم كماشة في الآحاد (5+4) | Pinch in Tens (5+4) then pinch in Units (5+4)",
            steps: [
              "ضع 9 في العشرات (أنزل 5 وارفع 4) 🗜️ | Set 9 in Tens (lower 5 & lift 4) 🗜️",
              "ضع 9 في الآحاد (أنزل 5 وارفع 4) 🗜️ | Set 9 in Units (lower 5 & lift 4) 🗜️",
              "الناتج الظاهر: 99 | Result: 99",
            ],
            result: 99,
            beadVisual: "9 في العشرات و9 في الآحاد = 99 | 9 in Tens and 9 in Units = 99",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S02-m1-T1",
            question: "مثّل 10 | Build 10",
            discrimination: "1 في العشرات و0 في الآحاد | 1 in Tens and 0 in Units",
            steps: [
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in Tens with thumb ⬆️",
              "اترك الآحاد فارغاً | Leave Units empty",
              "الناتج: 10 | Result: 10",
            ],
            result: 10,
          },
          {
            id: "S02-m1-T2",
            question: "مثّل 12 | Build 12",
            discrimination: "1 عشرات + 2 آحاد | 1 Tens + 2 Units",
            steps: [
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in Tens with thumb ⬆️",
              "ارفع 2 في الآحاد بالإبهام ⬆️ | Lift 2 in Units with thumb ⬆️",
              "الناتج: 12 | Result: 12",
            ],
            result: 12,
          },
          {
            id: "S02-m1-T3",
            question: "مثّل 35 | Build 35",
            discrimination: "3 عشرات + 5 آحاد | 3 Tens + 5 Units",
            steps: [
              "ارفع 3 خرزات في العشرات بالإبهام ⬆️ | Lift 3 beads in Tens with thumb ⬆️",
              "أنزل 5 في الآحاد بالسبابة ⬇️ | Bring down 5 in Units with index ⬇️",
              "الناتج: 35 | Result: 35",
            ],
            result: 35,
          },
          {
            id: "S02-m1-T4",
            question: "مثّل 68 | Build 68",
            discrimination: "6 عشرات (5+1) + 8 آحاد (5+3) | 6 Tens (5+1) + 8 Units (5+3)",
            steps: [
              "ضع 6 في العشرات (أنزل 5 وارفع 1) 🗜️ | Set 6 in Tens (lower 5 & lift 1) 🗜️",
              "ضع 8 في الآحاد (أنزل 5 وارفع 3) 🗜️ | Set 8 in Units (lower 5 & lift 3) 🗜️",
              "الناتج: 68 | Result: 68",
            ],
            result: 68,
          },
        ],
      },
    },

    // =========================================================================
    // Module 2: Hundreds and Thousands (المئات والآلاف)
    // =========================================================================
    {
      id: "m2",
      ruleCategory: "build",
      title: "المئات والآلاف",
      titleEn: "Hundreds and Thousands",
      emoji: "💯",
      rule: {
        description: "قلعة المئات وبيت الآلاف 🏰: تتواصل البيوت السعيدة! العمود الثالث هو قلعة المئات 💯، والعمود الرابع هو بيت الآلاف العملاق 🏰! | Hundreds Castle & Thousands House 🏰: The happy houses continue! The 3rd rod is the Hundreds Castle 💯, and the 4th rod is the Giant Thousands House 🏰!",
      },
      condition: {
        formula: "n = آلاف×1000 + مئات×100 + عشرات×10 + آحاد",
        explanation: "ابدأ البناء دائماً من أكبر منزلة على اليسار واصل طريقك نحو اليمين! | Always build from the largest rod on the left and move right!",
      },
      discrimination: {
        steps: [
          {
            question: "ما هي أكبر منزلة في العدد؟ | What is the largest place value in the number?",
            type: "value",
            answer: "ابدأ بتفعيل خرزاتها أولاً من اليسار! | Start by setting its beads first from the left!",
            hint: "آلاف ← مئات ← عشرات ← آحاد | Thousands ← Hundreds ← Tens ← Units",
          },
        ],
        decision: "اقفز إلى أكبر منزلة جهة اليسار ثم انزل درجة بدرجة نحو اليمين! | Jump to the largest rod on the left, then move step-by-step to the right!",
      },
      watchPhase: {
        examples: [
          {
            id: "S02-m2-E1",
            question: "مثّل 100 | Build 100",
            discrimination: "100 = 1 في قلعة المئات و0 في باقي البيوت | 100 = 1 in Hundreds Castle and 0 elsewhere",
            rule: "رفع 1 خرزة سفلية في العمود الثالث (المئات) | Lift 1 lower bead in 3rd rod (Hundreds)",
            fingerMovement: "👍 الإبهام يرفع 1 في عمود المئات ⬆️ | Thumb lifts 1 in Hundreds rod ⬆️",
            steps: [
              "ارفع 1 في عمود المئات بالإبهام ⬆️ | Lift 1 in Hundreds rod with thumb ⬆️",
              "اترك العشرات والآحاد فارغين | Leave Tens and Units empty",
              "الناتج الظاهر: 100 | Result: 100",
            ],
            result: 100,
            beadVisual: "1 في المئات و0 في العشرات و0 في الآحاد = 100 | 1 in Hundreds, 0 in Tens, 0 in Units = 100",
          },
          {
            id: "S02-m2-E2",
            question: "مثّل 134 | Build 134",
            discrimination: "134 = 1 مئات + 3 عشرات + 4 آحاد | 134 = 1 Hundreds + 3 Tens + 4 Units",
            rule: "البناء خطوة بخطوة من اليسار إلى اليمين | Build step by step from left to right",
            fingerMovement: "👍 1 في المئات، 👍 3 في العشرات، 👍 4 في الآحاد | 1 in Hundreds, 3 in Tens, 4 in Units",
            steps: [
              "ارفع 1 في المئات بالإبهام ⬆️ | Lift 1 in Hundreds with thumb ⬆️",
              "ارفع 3 في العشرات بالإبهام ⬆️ | Lift 3 in Tens with thumb ⬆️",
              "ارفع 4 في الآحاد بالإبهام ⬆️ | Lift 4 in Units with thumb ⬆️",
              "الناتج الظاهر: 134 | Result: 134",
            ],
            result: 134,
            beadVisual: "1 مئات، 3 عشرات، 4 آحاد = 134 | 1 Hundreds, 3 Tens, 4 Units = 134",
          },
          {
            id: "S02-m2-E3",
            question: "مثّل 1000 | Build 1000",
            discrimination: "1000 = 1 في بيت الآلاف العملاق | 1000 = 1 in Giant Thousands house",
            rule: "رفع 1 خرزة سفلية في العمود الرابع (الآلاف) | Lift 1 lower bead in 4th rod (Thousands)",
            fingerMovement: "👍 الإبهام يرفع 1 في عمود الآلاف ⬆️ | Thumb lifts 1 in Thousands rod ⬆️",
            steps: [
              "ارفع 1 في عمود الآلاف بالإبهام ⬆️ | Lift 1 in Thousands rod with thumb ⬆️",
              "اترك المئات والعشرات والآحاد فارغة | Leave Hundreds, Tens, and Units empty",
              "الناتج الظاهر: 1000 | Result: 1000",
            ],
            result: 1000,
            beadVisual: "1 آلاف و0 في باقي الأعمدة = 1000 | 1 in Thousands and 0 in other rods = 1000",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S02-m2-T1",
            question: "مثّل 100 | Build 100",
            discrimination: "1 في المئات والباقي صفر | 1 in Hundreds and rest zero",
            steps: [
              "ارفع 1 في عمود المئات بالإبهام ⬆️ | Lift 1 in Hundreds rod with thumb ⬆️",
              "اترك بقية الأعمدة فارغة | Leave other rods empty",
              "الناتج: 100 | Result: 100",
            ],
            result: 100,
          },
          {
            id: "S02-m2-T2",
            question: "مثّل 234 | Build 234",
            discrimination: "2 مئات + 3 عشرات + 4 آحاد | 2 Hundreds + 3 Tens + 4 Units",
            steps: [
              "ارفع 2 في المئات بالإبهام ⬆️ | Lift 2 in Hundreds with thumb ⬆️",
              "ارفع 3 في العشرات بالإبهام ⬆️ | Lift 3 in Tens with thumb ⬆️",
              "ارفع 4 في الآحاد بالإبهام ⬆️ | Lift 4 in Units with thumb ⬆️",
              "الناتج: 234 | Result: 234",
            ],
            result: 234,
          },
          {
            id: "S02-m2-T3",
            question: "مثّل 1500 | Build 1500",
            discrimination: "1 آلاف + 5 مئات | 1 Thousands + 5 Hundreds",
            steps: [
              "ارفع 1 في الآلاف بالإبهام ⬆️ | Lift 1 in Thousands with thumb ⬆️",
              "أنزل 5 في المئات بالسبابة ⬇️ | Bring down 5 in Hundreds with index ⬇️",
              "اترك العشرات والآحاد فارغين | Leave Tens and Units empty",
              "الناتج: 1500 | Result: 1500",
            ],
            result: 1500,
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت القيمة المكانية وبناء الأعداد على السوروبان! تستطيع الآن بناء أي عدد مهما كان كبيراً. | You mastered Place Value and building numbers on the Soroban! Now you can build any big number.",
    encouragement: "🎉 أنت الآن مهندس الأعداد الكبير! حان وقت التحدي. | 🎉 You are now a Master Number Architect! Time for challenges.",
    totalExamples: 8,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default L0_S02;