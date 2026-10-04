// src/curriculum/lessons/L0/S01.ts
// 🔢 درس L0-S01: تمثيل الأرقام من 0 إلى 9 وحركة التقريص
// المرجع: Takashi Kojima — The Japanese Abacus: Its Use and Theory
//
// 📐 قواعد الأصابع:
// 1. الإبهام (Thumb): يرفع الخرزات السفلية (1-4) نحو العارضة.
// 2. السبابة (Index): تُنزل/ترفع الخرزة العلوية (5)، وتُصفّر العمود.
// 3. التقريص (Pinch 🤏): الإبهام والسبابة معًا في لحظة واحدة (6-9).
//
// البنية:
//   m1 — الصفر والأرقام من 1 إلى 4 (الإبهام · بلا watchPhase · 5 تمارين).
//   m2 — الرقم 5 (السبابة).
//   m3 — الأرقام من 6 إلى 9 (التقريص).

import type { LessonNode } from "../types";

// ───────── قواميس مساعدة ─────────
const LOW_AR = ["", "خرزة سفلية واحدة", "خرزتان سفليتان", "ثلاث خرزات سفلية", "أربع خرزات سفلية"];
const LOW_EN = ["", "one lower bead", "two lower beads", "three lower beads", "four lower beads"];
const ORD_AR = ["", "الأولى", "الثانية", "الثالثة", "الرابعة"];
const ORD_EN = ["", "first", "second", "third", "fourth"];
const DOTS = ["", "●", "●●", "●●●", "●●●●"];

// ───────── مثال: خرزات سفلية 1-4 ─────────
const lowExample = (n: number) => ({
  id: `S01-m1-E${n + 1}`,
  question: `مثّل الرقم ${n}`,
  questionEn: `Show the number ${n}`,
  discrimination: `الرقم ${n} يحتاج ${LOW_AR[n]}.`,
  discriminationEn: `The number ${n} needs ${LOW_EN[n]}.`,
  rule: n === 1 ? "1 = خرزة سفلية نشيطة." : `${n} = ${LOW_AR[n]} نشيطة.`,
  ruleEn: n === 1 ? "1 = one active lower bead." : `${n} = ${LOW_EN[n]} active.`,
  fingerMovement: `استخدم الإبهام لرفع ${LOW_AR[n]} حتى تلامس العارضة.`,
  fingerMovementEn: `Use your thumb to push ${LOW_EN[n]} up to touch the beam.`,
  steps: [
    `ضع الإبهام تحت الخرزة السفلية ${ORD_AR[n]}.`,
    n === 1 ? "ادفع الخرزة حتى تلامس العارضة." : "ارفع الخرزات معًا حتى تلامس العارضة.",
    `الناتج: ${n}`,
  ],
  stepsEn: [
    `Put your thumb under the ${ORD_EN[n]} lower bead.`,
    n === 1 ? "Push the bead up until it touches the beam." : "Lift the beads together until they touch the beam.",
    `Result: ${n}`,
  ],
  result: n,
  beadVisual: `${DOTS[n]} = ${n}`,
  beadVisualEn: `${DOTS[n]} = ${n}`,
});

// ───────── مثال: تقريص 6-9 ─────────
const pinchExample = (n: number) => {
  const k = n - 5;
  return {
    id: `S01-m3-E${k}`,
    question: `مثّل الرقم ${n}`,
    questionEn: `Show the number ${n}`,
    discrimination: `${n} = الخرزة العلوية + ${LOW_AR[k]}.`,
    discriminationEn: `${n} = the upper bead + ${LOW_EN[k]}.`,
    rule: `${n} = الخرزة العلوية مع ${LOW_AR[k]}.`,
    ruleEn: `${n} = the upper bead with ${LOW_EN[k]}.`,
    fingerMovement: `ضع السبابة على الخرزة العلوية والإبهام تحت الخرزة السفلية ${ORD_AR[k]}، ثم اقرصهما نحو العارضة معًا.`,
    fingerMovementEn: `Put your index finger on the upper bead and your thumb under the ${ORD_EN[k]} lower bead, then pinch them to the beam together.`,
    steps: [
      `الخرزة العلوية + ${LOW_AR[k]}.`,
      `ضع السبابة على الخرزة العلوية والإبهام تحت الخرزة السفلية ${ORD_AR[k]}.`,
      "اقرص الخرزات نحو العارضة في نفس اللحظة حتى تصبح نشيطة.",
      `الناتج: ${n}`,
    ],
    stepsEn: [
      `The upper bead + ${LOW_EN[k]}.`,
      `Put your index finger on the upper bead and your thumb under the ${ORD_EN[k]} lower bead.`,
      "Pinch the beads to the beam at the same moment until they become active.",
      `Result: ${n}`,
    ],
    result: n,
    beadVisual: `العلوية + ${k} = ${n}`,
    beadVisualEn: `Upper + ${k} = ${n}`,
  };
};

// ───────── تمرين: سفلية ─────────
const lowTry = (n: number, idx: number) => ({
  id: `S01-m1-T${idx}`,
  question: `مثّل ${n}`,
  questionEn: `Show ${n}`,
  discrimination: n === 0 ? "0 = كل الخرزات نائمة بعيدة عن العارضة." : `${n} = ${LOW_AR[n]} نشيطة.`,
  discriminationEn: n === 0 ? "0 = all beads are asleep, away from the beam." : `${n} = ${LOW_EN[n]} active.`,
  steps:
    n === 0
      ? ["تأكد أن جميع الخرزات نائمة بعيدة عن العارضة.", "الناتج: 0"]
      : ["استخدم الإبهام.", `ارفع ${LOW_AR[n]} حتى تلامس العارضة.`, `الناتج: ${n}`],
  stepsEn:
    n === 0
      ? ["Make sure all beads are asleep, away from the beam.", "Result: 0"]
      : ["Use your thumb.", `Lift ${LOW_EN[n]} until they touch the beam.`, `Result: ${n}`],
  result: n,
});

// ───────── تمرين: تقريص ─────────
const pinchTry = (n: number, idx: number) => {
  const k = n - 5;
  return {
    id: `S01-m3-T${idx}`,
    question: `مثّل ${n}`,
    questionEn: `Show ${n}`,
    discrimination: `${n} = الخرزة العلوية + ${LOW_AR[k]}.`,
    discriminationEn: `${n} = the upper bead + ${LOW_EN[k]}.`,
    steps: [
      "ضع السبابة على الخرزة العلوية.",
      `ضع الإبهام تحت ${LOW_AR[k]}.`,
      "اقرصهما نحو العارضة معًا.",
      `الناتج: ${n}`,
    ],
    stepsEn: [
      "Put your index finger on the upper bead.",
      `Put your thumb under ${LOW_EN[k]}.`,
      "Pinch them to the beam together.",
      `Result: ${n}`,
    ],
    result: n,
  };
};

export const L0_S01: LessonNode = {
  id: "L0-S01",
  skillId: "S01",
  levelId: "L0",
  order: 2,

  title: {
    ar: "تمثيل الأرقام من 0 إلى 9",
    en: "Representing Numbers 0–9",
  },

  emoji: "🔢",
  tags: ["build", "read", "kids", "L0"],

  // ═══════════ القصة ═══════════
  story: {
    ar:
      "مرحباً يا بطل! 🌟\n\n" +
      "اليوم ستتعرّف على صديقين سحريين: إصبعين يحرّكان الخرزات!\n\n" +
      "👍 الإبهام: يرفع الخرزات السفلية، وقيمة كل واحدة 1.\n" +
      "☝️ السبابة: تُنزل الخرزة العلوية، وقيمتها 5.\n\n" +
      "وفي النهاية سنتعلم حركة سحرية اسمها «التقريص»، يعمل فيها الصديقان معاً.\n\n" +
      "تذكّر: الخرزة التي تلامس العارضة هي التي تُحسب. 🌈\n\n" +
      "لا تتعجّل. حرّك كل خرزة بهدوء، وراقب أصابعك بعينيك. ✨",
    en:
      "Hello, little hero! 🌟\n\n" +
      "Today you will meet two magic friends: two fingers that move the beads!\n\n" +
      "👍 The thumb: lifts the lower beads, each worth 1.\n" +
      "☝️ The index finger: lowers the upper bead, worth 5.\n\n" +
      "At the end we will learn a magic move called the Pinch, where both friends work together.\n\n" +
      "Remember: a bead touching the beam is counted. 🌈\n\n" +
      "Take your time. Move each bead gently and watch your fingers with your eyes. ✨",
  },

  storyAudioId: 1,

  // ═══════════ المفهوم ═══════════
  concept: {
    ar:
      "لتمثيل أي رقم من 0 إلى 9 على عمود واحد من السوروبان:\n" +
      "• 0: كل الخرزات نائمة بعيدة عن العارضة.\n" +
      "• 1 إلى 4: نرفع الخرزات السفلية حتى تلامس العارضة بالإبهام.\n" +
      "• 5: ننزل الخرزة العلوية حتى تلامس العارضة بالسبابة.\n" +
      "• 6 إلى 9: نستخدم الإبهام والسبابة معًا في وقت واحد (حركة التقريص): السبابة تُنزل الخرزة العلوية، والإبهام يرفع الخرزات السفلية حتى تلامس العارضة.",
    en:
      "To represent any number from 0 to 9 on one soroban rod:\n" +
      "• 0: All beads are asleep, away from the beam.\n" +
      "• 1 to 4: Push lower beads up to touch the beam with the thumb.\n" +
      "• 5: Pull the upper bead down to touch the beam with the index finger.\n" +
      "• 6 to 9: Use thumb and index finger together (the Pinch): the index finger pulls the upper bead down, while the thumb pushes up the required lower beads to touch the beam.",
  },

  isTheoretical: false,

  examples: [],
  tryQuestions: [],

  modules: [
    // ═══════════════════════════════════════════
    // m1 — الصفر والأرقام من 1 إلى 4
    // ═══════════════════════════════════════════
    {
      id: "m1",
      ruleCategory: "build",
      title: "الصفر والأرقام من 1 إلى 4",
      titleEn: "Zero and Numbers 1–4",
      emoji: "🔵",

      flashSvg: "soroban-numbers-0-4-animated",
      flashAlt: {
        ar: "الإبهام يرفع الخرزات السفلية حتى تلامس العارضة (من 0 إلى 4)",
        en: "The thumb lifts the lower beads to the beam (from 0 to 4)",
      },

      kidTip: {
        ar: "🎮 لعبة: قل رقماً من 0 إلى 4 بصوت عالٍ، ثم اجعل الإبهام يجعل الخرزات نشيطة!",
        en: "🎮 Game: Say a number from 0 to 4 out loud, then let your thumb activate the beads!",
      },

      rule: {
        description:
          "الصفر يعني أن كل الخرزات نائمة بعيدة عن العارضة. ولتمثيل 1 إلى 4، نرفع العدد المطلوب من الخرزات السفلية حتى تلامس العارضة باستخدام الإبهام.",
        descriptionEn:
          "Zero means all beads are asleep, away from the beam. To show 1 to 4, lift the needed lower beads until they touch the beam with your thumb.",
        formula: "0 = كل الخرزات نائمة · 1–4 = الخرزات السفلية النشيطة",
        formulaEn: "0 = all beads asleep · 1–4 = active lower beads",
      },

      condition: {
        formula: "0 ≤ n ≤ 4",
        explanation:
          "إذا كان الرقم بين 0 و 4، نستخدم الخرزات السفلية فقط. قيمة كل خرزة سفلية تلامس العارضة هي 1.",
        explanationEn:
          "If the number is between 0 and 4, we use only the lower beads. Each lower bead touching the beam is worth 1.",
      },

      discrimination: {
        steps: [
          {
            question: "هل الرقم المطلوب من 0 إلى 4؟",
            questionEn: "Is the number from 0 to 4?",
            type: "yes-no",
            options: ["نعم", "لا"],
            optionsEn: ["Yes", "No"],
            answer: "نعم",
            answerEn: "Yes",
            hint: "0 = كل الخرزات نائمة · 1 = خرزة نشيطة · 2 = خرزتان · 3 = ثلاث · 4 = أربع",
            hintEn: "0 = all asleep · 1 = one active · 2 = two · 3 = three · 4 = four",
          },
          {
            question: "أي إصبع ترفع به الخرزات السفلية؟",
            questionEn: "Which finger lifts the lower beads?",
            type: "value",
            options: ["الإبهام", "السبابة"],
            optionsEn: ["Thumb", "Index finger"],
            answer: "الإبهام",
            answerEn: "Thumb",
            hint: "قاعدة كوجيما: رفع الخرزات السفلية يكون دائمًا بالإبهام.",
            hintEn: "Kojima's rule: lower beads are always lifted with the thumb.",
          },
        ],

        decision:
          "لتمثيل 0-4: اجعل العدد المطلوب من الخرزات السفلية يلامس العارضة باستخدام الإبهام.",
        decisionEn:
          "To show 0–4: bring the needed number of lower beads to touch the beam with your thumb.",
      },

      // ❌ watchPhase فارغ — الأسئلة الحسّية في tryPhase
      watchPhase: { examples: [] },

      tryPhase: {
        exercises: [
          lowTry(0, 1),
          lowTry(1, 2),
          lowTry(2, 3),
          lowTry(3, 4),
          lowTry(4, 5),
        ],
      },
    },

    // ═══════════════════════════════════════════
    // m2 — الرقم 5
    // ═══════════════════════════════════════════
    {
      id: "m2",
      ruleCategory: "build",
      title: "الرقم 5",
      titleEn: "Number 5",
      emoji: "⭐",

      flashSvg: "soroban-number-5-animated",
      flashAlt: {
        ar: "السبابة تُنزل الخرزة العلوية حتى تلامس العارضة فيظهر الرقم 5",
        en: "The index finger lowers the upper bead to touch the beam, showing the number 5",
      },

      kidTip: {
        ar: "🎮 لعبة: السبابة تصطاد النجمة! أنزل الخرزة العلوية حتى تلامس العارضة وقل «خمسة!»",
        en: "🎮 Game: Your index finger catches the star! Lower the upper bead to the beam and shout \"Five!\"",
      },

      rule: {
        description:
          "الرقم 5 يُنَشَّط بالخرزة العلوية وحدها. ننزلها حتى تلامس العارضة باستخدام السبابة.",
        descriptionEn:
          "The number 5 is activated by the upper bead alone. Lower it to touch the beam using the index finger.",
        formula: "5 = الخرزة العلوية النشيطة",
        formulaEn: "5 = the active upper bead",
      },

      condition: {
        formula: "n = 5",
        explanation:
          "لتمثيل 5، تبقى الخرزات السفلية نائمة بعيدة عن العارضة، ونستخدم الخرزة العلوية فقط.",
        explanationEn:
          "To show 5, the lower beads stay asleep away from the beam; we use only the upper bead.",
      },

      discrimination: {
        steps: [
          {
            question: "هل الرقم المطلوب هو 5؟",
            questionEn: "Is the number 5?",
            type: "yes-no",
            options: ["نعم", "لا"],
            optionsEn: ["Yes", "No"],
            answer: "نعم",
            answerEn: "Yes",
            hint: "الخرزة العلوية قيمتها 5 وتُحرّك بالسبابة.",
            hintEn: "The upper bead is worth 5 and is moved by the index finger.",
          },
          {
            question: "أي إصبع نستخدم لإنزال الخرزة العلوية؟",
            questionEn: "Which finger lowers the upper bead?",
            type: "value",
            options: ["الإبهام", "السبابة"],
            optionsEn: ["Thumb", "Index finger"],
            answer: "السبابة",
            answerEn: "Index finger",
            hint: "قاعدة كوجيما: تحريك الخرزة العلوية يتم بالسبابة.",
            hintEn: "Kojima's rule: the upper bead is moved by the index finger.",
          },
        ],

        decision:
          "لتمثيل 5: أنزل الخرزة العلوية حتى تلامس العارضة باستخدام السبابة.",
        decisionEn: "To show 5: lower the upper bead to touch the beam with your index finger.",
      },

      watchPhase: {
        examples: [
          {
            id: "S01-m2-E1",
            question: "مثّل الرقم 5",
            questionEn: "Show the number 5",
            discrimination: "الرقم 5 يتطلب الخرزة العلوية وحدها.",
            discriminationEn: "The number 5 needs the upper bead alone.",
            rule: "5 = الخرزة العلوية النشيطة.",
            ruleEn: "5 = the active upper bead.",
            fingerMovement: "استخدم السبابة لدفع الخرزة العلوية حتى تلامس العارضة.",
            fingerMovementEn: "Use your index finger to push the upper bead down until it touches the beam.",
            steps: [
              "تأكد أن الخرزات السفلية نائمة بعيدة عن العارضة.",
              "ضع السبابة فوق الخرزة العلوية.",
              "ادفع الخرزة حتى تلامس العارضة.",
              "الناتج: 5",
            ],
            stepsEn: [
              "Make sure the lower beads are asleep, away from the beam.",
              "Put your index finger on top of the upper bead.",
              "Push the bead down until it touches the beam.",
              "Result: 5",
            ],
            result: 5,
            beadVisual: "الخرزة العلوية النشيطة = 5",
            beadVisualEn: "The active upper bead = 5",
          },
        ],
      },

      tryPhase: {
        exercises: [
          {
            id: "S01-m2-T1",
            question: "مثّل 5",
            questionEn: "Show 5",
            discrimination: "5 = الخرزة العلوية النشيطة.",
            discriminationEn: "5 = the active upper bead.",
            steps: [
              "استخدم السبابة.",
              "أنزل الخرزة العلوية حتى تلامس العارضة.",
              "اترك الخرزات السفلية نائمة.",
              "الناتج: 5",
            ],
            stepsEn: [
              "Use your index finger.",
              "Lower the upper bead to touch the beam.",
              "Leave the lower beads asleep.",
              "Result: 5",
            ],
            result: 5,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════
    // m3 — الأرقام من 6 إلى 9
    // ═══════════════════════════════════════════
    {
      id: "m3",
      ruleCategory: "build",
      title: "الأرقام من 6 إلى 9",
      titleEn: "Numbers 6–9",
      emoji: "🌟",

      flashSvg: "soroban-pinch-animated",
      flashAlt: {
        ar: "التقريص: السبابة والإبهام يتحركان معًا لتشكيل 6 و7 و8 و9",
        en: "The Pinch: index finger and thumb move together to make 6, 7, 8 and 9",
      },

      kidTip: {
        ar: "🎮 لعبة التقريص: اقرص كأنك تلتقط حبة سكر! ثم قل بصوت عالٍ: ستة، سبعة، ثمانية، تسعة.",
        en: "🎮 Pinch game: Pinch as if picking up a sugar grain! Then say out loud: six, seven, eight, nine.",
      },

      rule: {
        description:
          "لتشكيل الأرقام من 6 إلى 9 نستخدم الإبهام والسبابة معًا في وقت واحد (حركة التقريص): السبابة تنزل الخرزة العلوية، والإبهام يرفع الخرزات السفلية اللازمة حتى تلامس العارضة.",
        descriptionEn:
          "To make 6 to 9 we use the thumb and the index finger together (the Pinch): the index finger lowers the upper bead while the thumb lifts the needed lower beads until they touch the beam.",
        formula: "6 = العلوية + خرزة · 7 = العلوية + خرزتان · 8 = العلوية + ثلاث · 9 = العلوية + أربع",
        formulaEn: "6 = upper + one · 7 = upper + two · 8 = upper + three · 9 = upper + four",
      },

      condition: {
        formula: "5 < n ≤ 9",
        explanation:
          "كل رقم من 6 إلى 9 يتكوّن من الخرزة العلوية مع عدد من الخرزات السفلية.",
        explanationEn:
          "Every number from 6 to 9 is made of the upper bead plus some lower beads.",
      },

      discrimination: {
        steps: [
          {
            question: "هل الرقم من 6 إلى 9؟",
            questionEn: "Is the number from 6 to 9?",
            type: "yes-no",
            options: ["نعم", "لا"],
            optionsEn: ["Yes", "No"],
            answer: "نعم",
            answerEn: "Yes",
            hint: "كل رقم من 6 إلى 9 يحتوي على الخرزة العلوية مع خرزات سفلية.",
            hintEn: "Every number from 6 to 9 contains the upper bead with some lower beads.",
          },
          {
            question: "كيف نحرّك الخرزات في حركة واحدة؟",
            questionEn: "How do we move the beads in one motion?",
            type: "value",
            options: ["الإبهام", "السبابة", "الاثنان معًا (تقريص)"],
            optionsEn: ["Thumb", "Index finger", "Both together (Pinch)"],
            answer: "الاثنان معًا (تقريص)",
            answerEn: "Both together (Pinch)",
            hint: "6 = العلوية + خرزة · 7 = العلوية + خرزتان · 8 = العلوية + ثلاث · 9 = العلوية + أربع",
            hintEn: "6 = upper + one · 7 = upper + two · 8 = upper + three · 9 = upper + four",
          },
        ],

        decision:
          "ضع السبابة على الخرزة العلوية والإبهام تحت الخرزات السفلية المطلوبة، ثم اقرصهما نحو العارضة معًا.",
        decisionEn:
          "Put your index finger on the upper bead and your thumb under the needed lower beads, then pinch them to the beam together.",
      },

      watchPhase: {
        examples: [
          pinchExample(6),
          pinchExample(7),
          pinchExample(8),
          pinchExample(9),
        ],
      },

      tryPhase: {
        exercises: [
          pinchTry(6, 1),
          pinchTry(7, 2),
          pinchTry(8, 3),
          pinchTry(9, 4),
        ],
      },
    },
  ],

  // ═══════════ الخاتمة ═══════════
  outro: {
    summary:
      "تعلّمت كيف تمثّل الأرقام من 0 إلى 9 على عمود واحد من السوروبان، وكيف تستخدم الإبهام والسبابة وحركة التقريص.",
    summaryEn:
      "You learned how to show the numbers 0 to 9 on one soroban rod, and how to use your thumb, your index finger and the Pinch.",
    encouragement:
      "🎉 أحسنت! أصبحت تعرف لغة السوروبان الأولى، وأصابعك تعمل باحترافية.",
    encouragementEn:
      "🎉 Well done! You now speak the first language of the soroban, and your fingers work like a pro.",
    totalExamples: 5,
  },

  estimatedMinutes: 8,
  xpReward: 10,
};

export default L0_S01;