// src/curriculum/lessons/L4/S10.ts
// 🔗 درس S10: سلاسل الطرح — L4
// ✅ id بصيغة L4-S10
// ✅ محتوى مطابق 100% لبنك الأسئلة L4_QUESTIONS
// ✅ ثنائي اللغة (AR/EN) 100%
// ✅ TTS عبر storyAudioText — لا MP3

import type { LessonNode } from "../types";

export const S10_LESSON: LessonNode = {
  id: "L4-S10",
  skillId: "S10",
  levelId: "L4",
  order: 2,
  title: { ar: "سلاسل الطرح", en: "Subtraction Chains" },
  emoji: "🔻",
  tags: ["subtraction", "chains", "kids", "L4", "direct", "five-friend", "ten-friend", "mixed"],

  modules: [
    // ═══════════════════════════════════════════════════════════
    // m1 — الطرح البسيط (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m1",
      ruleCategory: "direct",
      title: "الطرح البسيط (سلاسل)",
      titleEn: "Direct Subtraction Chains",
      emoji: "🚂",
      miniStory: {
        title: "قطار الأرقام يفقد عربات | The Number Train Loses Carriages",
        emoji: "🚂",
        story: "قال قَائِدُ القِطَار: يا أبطال، سَنُنْزِلُ عَرَبَةً في كُلِّ مَحَطَّة! اِبْدَأْ من العَرَبَاتِ الكبيرة (العَشَرَات) قَبْلَ الصَّغِيرَة (الآحَاد). | The train conductor said: Heroes, we drop a carriage at each station! Start with the large carriages (tens) before the small ones (units).",
        storyAudioText: "قَالَ قَائِدُ القِطَار: يَا أَبْطَال، سَنُنْزِلُ عَرَبَةً فِي كُلِّ مَحَطَّة. اِبْدَأْ مِنَ العَرَبَاتِ الكَبِيرَة، العَشَرَات، قَبْلَ الصَّغِيرَة، الآحَاد. | The train conductor said: Heroes, we drop a carriage at each station. Start with the large carriages, tens, before the small ones, units.",
        storyAudioId: null,
      },
      rule: {
        description: "َالقاعدة الذهبية 🚂: اِطْرَحْ الحُدود بالتَّرتيبِ، واِبْدَأْ من المنزلة الكبرى (العشرات) ثم الصغرى (الآحاد) — الخرزات متاحة، بلا أصدقاء ولا استعارة! | Golden Rule 🚂: Subtract terms in order, starting from the highest place (tens) then the lowest (units) — beads are ready, no friends or borrowing needed!",
      },
      condition: {
        formula: "جميع الطروح مباشرة | All subtractions direct",
        explanation: "كل الخرزات المطلوبة مفعّلة ومتاحة أمامك مباشرة! | All needed beads are active and available directly!",
      },
      discrimination: {
        steps: [
          {
            question: "هل تبدأ من العشرات قبل الآحاد عند طرح أعداد مركبة؟ | Do you start with tens before units when subtracting composite numbers?",
            type: "yes-no",
            actual: "القاعدة الذهبية | Golden Rule",
            answer: "نعم → من اليسار (العشرات) إلى اليمين (الآحاد) | Yes → Left (tens) to right (units)",
            hint: "تاكاشي كوجيما: المنزلة الكبرى أولاً | Takashi Kojima: highest place first",
          },
          {
            question: "هل الخرزات المطلوب طرحها مفعّلة في كل عمود؟ | Are the beads to subtract active in each column?",
            type: "yes-no",
            actual: "الخرزات المفعّلة ≥ المطلوب | Active beads ≥ required",
            answer: "نعم → اطرح مباشرة بالسبابة ⬇️ أو الإبهام ⬇️ | Yes → Subtract directly with index ⬇️ or thumb ⬇️",
            hint: "لا حاجة للجدة 5 أو العملاق 10 | No need for Grandma 5 or Giant 10",
          },
        ],
        decision: "طرح بسيط مباشر — ابدأ من العشرات ثم الآحاد! | Direct subtraction — start with tens then units!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S10-m1-E1",
            question: "9 - 5 - 2 - 1",
            discrimination: "-5 · -2 · -1 — كلها على الآحاد مباشرة. | -5 · -2 · -1 — all direct on units.",
            rule: "طرح بسيط — الخرزات كافية. | Simple subtraction — enough beads.",
            fingerMovement: "السبابة ترفع العلوية -5 ⬆️ · السبابة تُبعد -2 ⬇️ · السبابة تُبعد -1 ⬇️. | Index lifts upper -5 ⬆️ · index pushes -2 down ⬇️ · index pushes -1 down ⬇️.",
            steps: [
              "ابدأ: مثّل 9 (5 + 4) | Start: 9 (5 + 4)",
              "اطرح 5: ارفع العلوية بالسبابة → 4 | Subtract 5: lift upper with index → 4",
              "اطرح 2: أبعد خرزتين سفليتين → 2 | Subtract 2: push 2 lower down → 2",
              "اطرح 1: أبعد خرزة واحدة → 1 | Subtract 1: push 1 down → 1",
              "الناتج: 1 | Result: 1",
            ],
            result: 1,
            beadVisual: "1 خرزة سفلية = 1 | 1 lower bead = 1",
          },
          {
            id: "L4-S10-m1-E2",
            question: "9 - 2 - 2 - 5",
            discrimination: "-2 · -2 · -5 — كلها مباشرة. | -2 · -2 · -5 — all direct.",
            rule: "طرح بسيط مباشر. | Direct simple subtraction.",
            fingerMovement: "الإبهام يُبعد -2 ⬇️ · الإبهام يُبعد -2 ⬇️ · السبابة ترفع العلوية -5 ⬆️. | Thumb pushes -2 down ⬇️ · thumb pushes -2 down ⬇️ · index lifts upper -5 ⬆️.",
            steps: [
              "ابدأ: مثّل 9 (5 + 4) | Start: 9 (5 + 4)",
              "اطرح 2: أبعد خرزتين → 7 | Subtract 2: push 2 down → 7",
              "اطرح 2: أبعد خرزتين → 5 | Subtract 2: push 2 down → 5",
              "اطرح 5: ارفع العلوية بالسبابة → 0 | Subtract 5: lift upper with index → 0",
              "الناتج: 0 | Result: 0",
            ],
            result: 0,
            beadVisual: "المعداد مصفّر = 0 | Abacus cleared = 0",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S10-m1-T1",
            question: "48 - 10 - 20 - 5",
            discrimination: "-10 · -20 (عشرات) · -5 (آحاد). | -10 · -20 (tens) · -5 (units).",
            steps: [
              "ابدأ: مثّل 48 | Start: 48",
              "اطرح 10: عشرات -1 → 38 | Subtract 10: tens -1 → 38",
              "اطرح 20: عشرات -2 → 18 | Subtract 20: tens -2 → 18",
              "اطرح 5: آحاد -5 → 13 | Subtract 5: units -5 → 13",
              "الناتج: 13 | Result: 13",
            ],
            result: 13,
          },
          {
            id: "L4-S10-m1-T2",
            question: "9 - 1 - 3 - 5",
            discrimination: "-1 · -3 · -5 — مباشرة. | -1 · -3 · -5 — direct.",
            steps: [
              "ابدأ: مثّل 9 | Start: 9",
              "اطرح 1: → 8 | Subtract 1: → 8",
              "اطرح 3: → 5 | Subtract 3: → 5",
              "اطرح 5: → 0 | Subtract 5: → 0",
              "الناتج: 0 | Result: 0",
            ],
            result: 0,
          },
          {
            id: "L4-S10-m1-T3",
            question: "39 - 15 - 12 - 2",
            discrimination: "-15 · -12 · -2 — مباشرة. | -15 · -12 · -2 — direct.",
            steps: [
              "ابدأ: مثّل 39 | Start: 39",
              "اطرح 15: عشرات -1، آحاد -5 → 24 | Subtract 15: tens -1, units -5 → 24",
              "اطرح 12: عشرات -1، آحاد -2 → 12 | Subtract 12: tens -1, units -2 → 12",
              "اطرح 2: آحاد -2 → 10 | Subtract 2: units -2 → 10",
              "الناتج: 10 | Result: 10",
            ],
            result: 10,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m2 — الطرح بأصدقاء 5 (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m2",
      ruleCategory: "small_friends",
      title: "الطرح بأصدقاء 5 (سلاسل)",
      titleEn: "Complements of 5 Subtraction Chains",
      emoji: "👵",
      miniStory: {
        title: "الجدة 5 ترحل | Grandma 5 Departs",
        emoji: "👵",
        story: "ُعندما لا تكفي السِّفْلِيَّاتُ المُفَعَّلَةُ للطرح، تُرْفَع الجدَّةُ 5 بِالسَّبَّابَةِ ⬆️ وَيُضَافُ المُكَمِّلَ بالإبهام ⬆️ — صُعُودٌ مُزْدَوَج. ⬆️⬆️! | When active lower beads are insufficient for subtraction, lift Grandma 5 with index ⬆️ and add remainder with thumb ⬆️ — Double Lift ⬆️⬆️!",
        storyAudioText: "عِنْدَمَا لَا تَكْفِي السَّفْلِيَّاتُ المُفَعَّلَةُ لِلطَّرْح، تَرْفَعُ الجَدَّةُ خَمْسَة بِالسَّبَّابَةِ وَتُضِيفُ المُكَمِّلَ بِالإِبْهَام، صُعُودٌ مُزْدَوَج. | When active lower beads are insufficient for subtraction, lift Grandma 5 with index and add remainder with thumb, Double Lift.",
        storyAudioId: null,
      },
      rule: {
        description: "أصدقاء 5 👵: عندما لا تكفي السَّفْلِيَّاتُ المُفَعَّلَةُ، اِرْفَعْ 5 بِالسَّبَّابَةِ ⬆️ وَأَضِفْ المُكَمِّلَ بِالإِبْهَام ⬆️ (صُعُودٌ مُزْدَوَج. ⬆️⬆️). | Friends of 5 👵: When active lower beads insufficient, lift 5 with index ⬆️ and add remainder with thumb ⬆️ (Double Lift ⬆️⬆️).",
        cases: [
          { from: 1, formula: "-1 = -5 + 4" },
          { from: 2, formula: "-2 = -5 + 3" },
          { from: 3, formula: "-3 = -5 + 2" },
          { from: 4, formula: "-4 = -5 + 1" },
        ],
      },
        explanation: "عند ازدحام السفليات، الجدة 5 تتدخل بنزول مزدوج! | When lower beads are crowded, Grandma 5 steps in with a Double Drop!",
},
friendsTable: {
        title: "أصدقاء 5 الصغار | Small Friends of 5",
        pairs: [
          { from: 1, to: 4 }, { from: 2, to: 3 },
          { from: 3, to: 2 }, { from: 4, to: 1 },
        ],
      },
      discrimination: {
        steps: [
          {
            question: "هل السفليات المفعّلة غير كافية للطرح؟ | Are active lower beads insufficient for subtraction?",
            type: "comparison",
            actual: "السفليات المفعّلة < المطلوب | Active lower beads < required",
            answer: "نعم → استخدم أصدقاء 5 | Yes → Use Friends of 5",
            hint: "السفليات المفعّلة قليلة | Active lower beads scarce",
          },
          {
            question: "هل الجدة 5 مفعّلة؟ | Is bead 5 active?",
            type: "yes-no",
            actual: "5 مفعّلة | 5 active",
            answer: "نعم → صعود مزدوج ⬆️⬆️ | Yes → Double Lift ⬆️⬆️",
            hint: "-n = -5 + (5-n)",
          },
        ],
        decision: "أصدقاء 5 — صعود مزدوج ⬆️⬆️! | Friends of 5 — Double Lift ⬆️⬆️!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S10-m2-E1",
            question: "5 - 1 - 2 - 1",
            discrimination: "-1 في الخطوة الأولى يستخدم أصدقاء 5 (-1 = -5 + 4). | -1 in first step uses Friends of 5 (-1 = -5 + 4).",
            rule: "-1 = -5 + 4",
            fingerMovement: "صعود مزدوج ⬆️⬆️ (سبابة ترفع 5 ⬆️ وإبهام يرفع 4 ⬆️) · ثم -2 سفليات · ثم -1 سفليات. | Double Lift ⬆️⬆️ (index lifts 5 ⬆️ & thumb lifts 4 ⬆️) · then -2 lower · then -1 lower.",
            steps: [
              "ابدأ: مثّل 5 (العلوية فقط) | Start: 5 (upper only)",
              "اطرح 1: صعود مزدوج ⬆️⬆️ (السبابة ترفع 5 والإبهام يرفع 4) → 4 | Subtract 1: Double Lift ⬆️⬆️ (index 5 + thumb 4) → 4",
              "اطرح 2: أبعد خرزتين سفليتين → 2 | Subtract 2: push 2 lower down → 2",
              "اطرح 1: أبعد خرزة واحدة → 1 | Subtract 1: push 1 down → 1",
              "الناتج: 1 | Result: 1",
            ],
            result: 1,
            beadVisual: "1 خرزة سفلية = 1 | 1 lower bead = 1",
          },
          {
            id: "L4-S10-m2-E2",
            question: "6 - 2 - 1 - 1",
            discrimination: "-2 في الخطوة الأولى (-2 = -5 + 3). | -2 in first step (-2 = -5 + 3).",
            rule: "-2 = -5 + 3",
            fingerMovement: "صعود مزدوج ⬆️⬆️ (سبابة 5 + إبهام 3) · ثم -1 · ثم -1. | Double Lift ⬆️⬆️ (index 5 + thumb 3) · then -1 · then -1.",
            steps: [
              "ابدأ: مثّل 6 (5 + 1) | Start: 6 (5 + 1)",
              "اطرح 2: صعود مزدوج ⬆️⬆️ (5 + 3) → 4 | Subtract 2: Double Lift ⬆️⬆️ → 4",
              "اطرح 1: → 3 | Subtract 1: → 3",
              "اطرح 1: → 2 | Subtract 1: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
            beadVisual: "2 خرزتان سفليتان = 2 | 2 lower beads = 2",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S10-m2-T1",
            question: "7 - 3 - 2 - 1",
            discrimination: "-3 في الخطوة الأولى (-3 = -5 + 2). | -3 in first step (-3 = -5 + 2).",
            steps: [
              "ابدأ: مثّل 7 (5 + 2) | Start: 7 (5 + 2)",
              "اطرح 3: صعود مزدوج ⬆️⬆️ (5 + 2) → 4 | Subtract 3: Double Lift ⬆️⬆️ → 4",
              "اطرح 2: → 2 | Subtract 2: → 2",
              "اطرح 1: → 1 | Subtract 1: → 1",
              "الناتج: 1 | Result: 1",
            ],
            result: 1,
          },
          {
            id: "L4-S10-m2-T2",
            question: "8 - 4 - 1 - 1",
            discrimination: "-4 في الخطوة الأولى (-4 = -5 + 1). | -4 in first step (-4 = -5 + 1).",
            steps: [
              "ابدأ: مثّل 8 (5 + 3) | Start: 8 (5 + 3)",
              "اطرح 4: صعود مزدوج ⬆️⬆️ (5 + 1) → 4 | Subtract 4: Double Lift ⬆️⬆️ → 4",
              "اطرح 1: → 3 | Subtract 1: → 3",
              "اطرح 1: → 2 | Subtract 1: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
          },
          {
            id: "L4-S10-m2-T3",
            question: "15 - 1 - 2 - 1",
            discrimination: "-1 على 5 بالآحاد (-1 = -5 + 4). | -1 on 5 in units (-1 = -5 + 4).",
            steps: [
              "ابدأ: مثّل 15 (1 عشرات + 5 آحاد) | Start: 15 (1 tens + 5 units)",
              "اطرح 1: صعود مزدوج على الآحاد ⬆️⬆️ → 14 | Subtract 1: Double Lift on units ⬆️⬆️ → 14",
              "اطرح 2: → 12 | Subtract 2: → 12",
              "اطرح 1: → 11 | Subtract 1: → 11",
              "الناتج: 11 | Result: 11",
            ],
            result: 11,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m3 — الطرح بأصدقاء 10 (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m3",
      ruleCategory: "big_friends",
      title: "الطرح بأصدقاء 10 (سلاسل)",
      titleEn: "Complements of 10 Subtraction Chains",
      emoji: "🦶",
      miniStory: {
        title: "العملاق 10 يستعير | Giant 10 Borrows",
        emoji: "🦶",
        story: "عندما يكون الآحَادُ فَارِغاً وَالطَّرْحُ يَسْتَدْعِي اسْتِعَارَة، يَسْتَدْعِي العِمْلَاقَ 10! أَنْزِلْ وَاحِداً من العشرات بِالسَّبَّابَةِ ⬇️ وأضف المكمّل في الآحاد بالإبهام ⬆️. | When units are empty and subtraction requires borrowing, Giant 10 arrives! بِالسَّبَّابَةِ Subtract 1 from tens with index ⬇️ and add remainder to units with thumb ⬆️.",
        storyAudioText: "عِنْدَمَا يَكُونُ الآحَادُ فَارِغاً وَالطَّرْحُ يَسْتَدْعِي اسْتِعَارَة، يَسْتَدْعِي العِمْلَاقَ عَشَرَة. أَنْزِلْ وَاحِداً مِنَ العَشَرَاتِ بِالسَّبَّابَةِ وَأَضِفِ المُكَمِّلَ فِي الآحَادِ بِالإِبْهَام. | When units are empty and subtraction requires borrowing, Giant 10 arrives. Subtract 1 from tens with index and add remainder to units with thumb.",
        storyAudioId: null,
      },
      rule: {
        description: "أصدقاء 10 🦶: عندما لا تكفي ِالآحَادُ، اِطْرَحْ 1 من العَشَراتِ بِالسَّبَّابَةِ ⬇️ وَأَضِفْ المُكَمِّلَ للآحاد بالإبهام ⬆️. | Friends of 10 🦶: When units are insufficient, subtract 1 from tens with index ⬇️ and add remainder to units with thumb ⬆️.",
        cases: [
          { from: 1, formula: "-1 = -10 + 9" },
          { from: 2, formula: "-2 = -10 + 8" },
          { from: 3, formula: "-3 = -10 + 7" },
          { from: 4, formula: "-4 = -10 + 6" },
          { from: 5, formula: "-5 = -10 + 5" },
          { from: 6, formula: "-6 = -10 + 4" },
          { from: 7, formula: "-7 = -10 + 3" },
          { from: 8, formula: "-8 = -10 + 2" },
          { from: 9, formula: "-9 = -10 + 1" },
        ],
      },
      condition: {
        formula: "الآحاد < المطلوب | Units < required",
        explanation: "الآحاد لا تكفي — اِقْتَرِضْ من العشرات! | Units insufficient — borrow from tens!",
      },
      friendsTable: {
        title: "أصدقاء 10 الكبار | Big Friends of 10",
        pairs: [
          { from: 1, to: 9 }, { from: 2, to: 8 }, { from: 3, to: 7 },
          { from: 4, to: 6 }, { from: 5, to: 5 }, { from: 6, to: 4 },
          { from: 7, to: 3 }, { from: 8, to: 2 }, { from: 9, to: 1 },
        ],
      },
      discrimination: {
        steps: [
          {
            question: "هل الآحاد أقل من المطلوب للطرح؟ | Are units less than required for subtraction?",
            type: "yes-no",
            actual: "الآحاد < المطلوب | Units < required",
            answer: "نعم → استخدم أصدقاء 10 | Yes → Use Friends of 10",
            hint: "الآحاد فارغ | Units empty",
          },
          {
            question: "هل يمكن أخذ 1 من العشرات؟ | Can we take 1 from tens?",
            type: "yes-no",
            actual: "العشرات ≥ 1 | Tens ≥ 1",
            answer: "نعم → أنزل 1 من العشرات ⬇️ + المكمّل للآحاد ⬆️ | Yes → subtract 1 from tens ⬇️ + remainder to units ⬆️",
            hint: "-n = -10 + k",
          },
        ],
        decision: "أصدقاء 10 — اقترض من العشرات وأضف المكمّل! | Friends of 10 — borrow from tens & add remainder!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S10-m3-E1",
            question: "10 - 1 - 2 - 5",
            discrimination: "-1 على الآحاد الفارغ يستدعي أصدقاء 10 (-1 = -10 + 9). | -1 on empty units requires Friends of 10 (-1 = -10 + 9).",
            rule: "-1 = -10 + 9",
            fingerMovement: "أنزل 1 من العشرات بالسبابة ⬇️ + أضف 9 للآحاد بالإبهام ⬆️ · ثم -2 · ثم -5. | Subtract 1 from tens with index ⬇️ + add 9 to units with thumb ⬆️ · then -2 · then -5.",
            steps: [
              "ابدأ: مثّل 10 (1 عشرات + 0 آحاد) | Start: 10 (1 tens + 0 units)",
              "اطرح 1: -1 من العشرات + 9 للآحاد → 9 | Subtract 1: -1 tens + 9 units → 9",
              "اطرح 2: → 7 | Subtract 2: → 7",
              "اطرح 5: → 2 | Subtract 5: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
            beadVisual: "2 خرزتان سفليتان = 2 | 2 lower beads = 2",
          },
          {
            id: "L4-S10-m3-E2",
            question: "10 - 2 - 5 - 1",
            discrimination: "-2 على الآحاد الفارغ (-2 = -10 + 8). | -2 on empty units (-2 = -10 + 8).",
            rule: "-2 = -10 + 8",
            fingerMovement: "أنزل 1 من العشرات ⬇️ + أضف 8 للآحاد ⬆️ · ثم -5 · ثم -1. | Subtract 1 from tens ⬇️ + add 8 to units ⬆️ · then -5 · then -1.",
            steps: [
              "ابدأ: مثّل 10 | Start: 10",
              "اطرح 2: -1 عشرات + 8 آحاد → 8 | Subtract 2: -1 tens + 8 units → 8",
              "اطرح 5: → 3 | Subtract 5: → 3",
              "اطرح 1: → 2 | Subtract 1: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
            beadVisual: "2 خرزتان سفليتان = 2 | 2 lower beads = 2",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S10-m3-T1",
            question: "10 - 3 - 1 - 5",
            discrimination: "-3 على الآحاد الفارغ (-3 = -10 + 7). | -3 on empty units (-3 = -10 + 7).",
            steps: [
              "ابدأ: مثّل 10 | Start: 10",
              "اطرح 3: -1 عشرات + 7 آحاد → 7 | Subtract 3: -1 tens + 7 units → 7",
              "اطرح 1: → 6 | Subtract 1: → 6",
              "اطرح 5: → 1 | Subtract 5: → 1",
              "الناتج: 1 | Result: 1",
            ],
            result: 1,
          },
          {
            id: "L4-S10-m3-T2",
            question: "10 - 4 - 5 - 1",
            discrimination: "-4 على الآحاد الفارغ (-4 = -10 + 6). | -4 on empty units (-4 = -10 + 6).",
            steps: [
              "ابدأ: مثّل 10 | Start: 10",
              "اطرح 4: -1 عشرات + 6 آحاد → 6 | Subtract 4: -1 tens + 6 units → 6",
              "اطرح 5: → 1 | Subtract 5: → 1",
              "اطرح 1: → 0 | Subtract 1: → 0",
              "الناتج: 0 | Result: 0",
            ],
            result: 0,
          },
          {
            id: "L4-S10-m3-T3",
            question: "12 - 5 - 1 - 1",
            discrimination: "-5 على 2 بالآحاد (-5 = -10 + 5). | -5 on 2 in units (-5 = -10 + 5).",
            steps: [
              "ابدأ: مثّل 12 (1 عشرات + 2 آحاد) | Start: 12 (1 tens + 2 units)",
              "اطرح 5: -1 عشرات + 5 آحاد → 7 | Subtract 5: -1 tens + 5 units → 7",
              "اطرح 1: → 6 | Subtract 1: → 6",
              "اطرح 1: → 5 | Subtract 1: → 5",
              "الناتج: 5 | Result: 5",
            ],
            result: 5,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m4 — الطرح المركّب (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m4",
      ruleCategory: "combined",
      title: "الطرح المركّب (سلاسل)",
      titleEn: "Compound Subtraction Chains",
      emoji: "👑",
      miniStory: {
        title: "التنسيق الثلاثي للطرح | The Triple Subtraction Alliance",
        emoji: "👑",
        story: "أَحْيَاناً تَحْتَاجُ الجَدَّةَ 5 والعِمْلَاقَ 10 لِلطَّرْحِ معاً! العِمْلَاقُ يُقْتَرِضُ من العَشَرَات، وَالجَدَّةُ تُعِيدُ تَرْتِيبَ الآحَاد. | Sometimes you need Grandma 5 and Giant 10 to subtract together! Giant borrows from tens, and Grandma rearranges units.",
        storyAudioText: "أَحْيَاناً تَحْتَاجُ الجَدَّةَ خَمْسَة وَالعِمْلَاقُ عَشَرَة لِلطَّرْحِ مَعاً. العِمْلَاقُ يُقْتَرِضُ مِنَ العَشَرَات، وَالجَدَّةُ تُعِيدُ تَرْتِيبَ الآحَاد. | Sometimes you need Grandma 5 and Giant 10 to subtract together. Giant borrows from tens, and Grandma rearranges units.",
        storyAudioId: null,
      },
      rule: {
        description: "المركّب 👑: عندما لا تكفي الآحاد، اِقْتَرِضْ 10 من العشَراتِ ⬇️، ثم أَضِفْ المُكَمِّلَ (مع تفعيل 5 أو ِطرحها) بالآحاد! | Compound 👑: When units insufficient, borrow 10 from tens ⬇️, then add remainder (activating or removing 5) to units!",
        cases: [
          { from: 6, formula: "-6 = -10 + 5 - 1" },
          { from: 7, formula: "-7 = -10 + 5 - 2" },
          { from: 8, formula: "-8 = -10 + 5 - 3" },
          { from: 9, formula: "-9 = -10 + 5 - 4" },
        ],
      },
      condition: {
        formula: "الآحاد < المطلوب · 5 مُفَعَّلَة أو نَحْتَاجُهَا | Units < required · bead 5 active or needed",
        explanation: "العِمْلاقُ 10 يَقْتَرَضُ، والجدَّة 5 تُسَاعِد ِفي الآحاد! | Giant 10 borrows, and Grandma 5 helps in units!",
      },
      discrimination: {
        steps: [
          {
            question: "هل الآحادُ أقلُّ من المطلوب للطَرْح؟ | Are units less than required?",
            type: "yes-no",
            actual: "الآحاد < المطلوب | Units < required",
            answer: "ِنعم → نحتاج الاستعارة من العَشَرات | Yes → Need borrowing from tens",
            hint: "الآحادُ لا تكفي | Units insufficient",
          },
          {
            question: "هل نحتاج تفعيل 5 أو إلغاؤها في الآحاد بعد الاستعارة؟ | Do we need to activate or cancel 5 in units after borrowing?",
            type: "yes-no",
            actual: "5 جزء من المكمّل | 5 is part of remainder",
            answer: "نعم → استعارة 10 + تعديل 5 + المكمّل | Yes → borrow 10 + adjust 5 + remainder",
            hint: "-n = -10 + 5 - (5-n) أو -n = -10 + 5 + (n-5)",
          },
        ],
        decision: "طرح مركّب — اقترض من العشرات وأعد ترتيب الآحاد! | Compound — borrow from tens & rearrange units!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S10-m4-E1",
            question: "13 - 6 - 2 - 1",
            discrimination: "-6 على 3 بالآحاد (-6 = -10 + 5 - 1). | -6 on 3 in units (-6 = -10 + 5 - 1).",
            rule: "-6 = -10 + 5 - 1",
            fingerMovement: "أنزل 1 من العشرات ⬇️ + أنزل 5 بالآحاد ⬇️ + أبعد 1 ⬇️ · ثم -2 · ثم -1. | Subtract 1 from tens ⬇️ + set 5 in units ⬇️ + push 1 down ⬇️ · then -2 · then -1.",
            steps: [
              "ابدأ: مثّل 13 (1 عشرات + 3 آحاد) | Start: 13 (1 tens + 3 units)",
              "اطرح 6: -1 عشرات + 5 - 1 بالآحاد → 7 | Subtract 6: -1 tens + 5 - 1 in units → 7",
              "اطرح 2: → 5 | Subtract 2: → 5",
              "اطرح 1: → 4 | Subtract 1: → 4",
              "الناتج: 4 | Result: 4",
            ],
            result: 4,
            beadVisual: "4 خرزات سفلية = 4 | 4 lower beads = 4",
          },
          {
            id: "L4-S10-m4-E2",
            question: "12 - 6 - 1 - 1",
            discrimination: "-6 على 2 بالآحاد (-6 = -10 + 5 - 1). | -6 on 2 in units (-6 = -10 + 5 - 1).",
            rule: "-6 = -10 + 5 - 1",
            fingerMovement: "أنزل 1 من العشرات ⬇️ + 5 - 1 بالآحاد ⬇️⬇️ · ثم -1 · ثم -1. | Subtract 1 tens ⬇️ + 5 - 1 units ⬇️⬇️ · then -1 · then -1.",
            steps: [
              "ابدأ: مثّل 12 (1 عشرات + 2 آحاد) | Start: 12 (1 tens + 2 units)",
              "اطرح 6: -1 عشرات + 5 - 1 بالآحاد → 6 | Subtract 6: -1 tens + 5 - 1 in units → 6",
              "اطرح 1: → 5 | Subtract 1: → 5",
              "اطرح 1: → 4 | Subtract 1: → 4",
              "الناتج: 4 | Result: 4",
            ],
            result: 4,
            beadVisual: "4 خرزات سفلية = 4 | 4 lower beads = 4",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S10-m4-T1",
            question: "11 - 6 - 2 - 1",
            discrimination: "-6 على 1 بالآحاد (-6 = -10 + 5 - 1). | -6 on 1 in units (-6 = -10 + 5 - 1).",
            steps: [
              "ابدأ: مثّل 11 (1 عشرات + 1 آحاد) | Start: 11 (1 tens + 1 unit)",
              "اطرح 6: -1 عشرات + 5 - 1 بالآحاد → 5 | Subtract 6: -1 tens + 5 - 1 in units → 5",
              "اطرح 2: → 3 | Subtract 2: → 3",
              "اطرح 1: → 2 | Subtract 1: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
          },
          {
            id: "L4-S10-m4-T2",
            question: "13 - 7 - 1 - 1",
            discrimination: "-7 على 3 بالآحاد (-7 = -10 + 5 - 2). | -7 on 3 in units (-7 = -10 + 5 - 2).",
            steps: [
              "ابدأ: مثّل 13 | Start: 13",
              "اطرح 7: -1 عشرات + 5 - 2 بالآحاد → 6 | Subtract 7: -1 tens + 5 - 2 in units → 6",
              "اطرح 1: → 5 | Subtract 1: → 5",
              "اطرح 1: → 4 | Subtract 1: → 4",
              "الناتج: 4 | Result: 4",
            ],
            result: 4,
          },
          {
            id: "L4-S10-m4-T3",
            question: "12 - 7 - 2 - 1",
            discrimination: "-7 على 2 بالآحاد (-7 = -10 + 5 - 2). | -7 on 2 in units (-7 = -10 + 5 - 2).",
            steps: [
              "ابدأ: مثّل 12 | Start: 12",
              "اطرح 7: -1 عشرات + 5 - 2 بالآحاد → 5 | Subtract 7: -1 tens + 5 - 2 in units → 5",
              "اطرح 2: → 3 | Subtract 2: → 3",
              "اطرح 1: → 2 | Subtract 1: → 2",
              "الناتج: 2 | Result: 2",
            ],
            result: 2,
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت سلاسل الطرح! | You mastered subtraction chains!",
    encouragement: "🎉 أنت الآن تطرح عدة أرقام بسرعة السوروبان! | 🎉 You now subtract multiple numbers with Soroban speed!",
    totalExamples: 8,
  },

  estimatedMinutes: 20,
  xpReward: 15,
};

export default S10_LESSON;