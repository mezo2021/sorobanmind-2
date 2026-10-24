// src/curriculum/lessons/L4/S09.ts
// 🔗 درس S09: سلاسل الجمع — L4
// ✅ id بصيغة L4-S09
// ✅ محتوى مطابق 100% لبنك الأسئلة L4_QUESTIONS
// ✅ ثنائي اللغة (AR/EN) 100%
// ✅ TTS عبر storyAudioText — لا MP3

import type { LessonNode } from "../types";

export const S09_LESSON: LessonNode = {
  id: "L4-S09",
  skillId: "S09",
  levelId: "L4",
  order: 1,
  title: { ar: "سلاسل الجمع", en: "Addition Chains" },
  emoji: "🔗",
  tags: ["addition", "chains", "kids", "L4", "direct", "five-friend", "ten-friend", "mixed"],

  modules: [
    // ═══════════════════════════════════════════════════════════
    // m1 — الجمع البسيط (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m1",
      ruleCategory: "direct",
      title: "الجمع البسيط (سلاسل)",
      titleEn: "Direct Addition Chains",
      emoji: "🚂",
      miniStory: {
        title: "قطار الأرقام | The Number Train",
        emoji: "🚂",
        story: "قال قائد القطار: يا أبطال، القطار يسير بسرعة! أضِف كل عربة واحدة تلو الأخرى، وابدأ من العربات الكبيرة (العشرات) قبل الصغيرة (الآحاد). | The train conductor said: Heroes, the train is moving fast! Add each carriage one by one, starting with the large carriages (tens) before the small ones (units).",
        storyAudioText: "قَالَ قَائِدُ القِطَار: يَا أَبْطَال، القِطَارُ يَسِيرُ بِسُرْعَة. أَضِفْ كُلَّ عَرَبَةٍ وَاحِدَةً تِلْوَ الأُخْرَى، وَابْدَأْ مِنَ العَرَبَاتِ الكَبِيرَة، العَشَرَات، قَبْلَ الصَّغِيرَة، الآحَاد. | The train conductor said: Heroes, the train is moving fast. Add each carriage one by one, starting with the large carriages, tens, before the small ones, units.",
        storyAudioId: null,
      },
      rule: {
        description: "القاعدة الذهبية 🚂: أضف الحدود بالترتيب، وابدأ من المنزلة الكبرى (العشرات) ثم الصغرى (الآحاد) — الخرزات متاحة، بلا أصدقاء ولا استعارة! | Golden Rule 🚂: Add terms in order, starting from the highest place (tens) then the lowest (units) — beads are ready, no friends or borrowing needed!",
      },
      condition: {
        formula: "جميع الإضافات مباشرة | All additions direct",
        explanation: "كل الخرزات المطلوبة متوفرة أمامك مباشرة، لا حاجة للأصدقاء! | All needed beads are available directly — no friends needed!",
      },
      discrimination: {
        steps: [
          {
            question: "هل تبدأ من العشرات قبل الآحاد عند إضافة أعداد مركبة؟ | Do you start with tens before units when adding composite numbers?",
            type: "yes-no",
            actual: "القاعدة الذهبية | Golden Rule",
            answer: "نعم → من اليسار (العشرات) إلى اليمين (الآحاد) | Yes → Left (tens) to right (units)",
            hint: "تاكاشي كوجيما: المنزلة الكبرى أولاً | Takashi Kojima: highest place first",
          },
          {
            question: "هل الخرزات المطلوبة متوفرة في كل عمود؟ | Are required beads available in each column?",
            type: "yes-no",
            actual: "الخرزات الفارغة ≥ المطلوب | Empty beads ≥ required",
            answer: "نعم → أضف مباشرة بالإبهام ⬆️ أو السبابة ⬇️ | Yes → Add directly with thumb ⬆️ or index ⬇️",
            hint: "لا حاجة للجدة 5 أو العملاق 10 | No need for Grandma 5 or Giant 10",
          },
        ],
        decision: "جمع بسيط مباشر — ابدأ من العشرات ثم الآحاد! | Direct addition — start with tens then units!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S09-m1-E1",
            question: "1 + 2 + 1 + 5",
            discrimination: "+2 · +1 · +5 — كلها على الآحاد مباشرة. | +2 · +1 · +5 — all direct on units.",
            rule: "جمع بسيط — الخرزات كافية. | Simple addition — enough beads.",
            fingerMovement: "الإبهام يرفع +2 ⬆️ · الإبهام +1 ⬆️ · السبابة تُنزل +5 ⬇️. | Thumb +2 ⬆️ · thumb +1 ⬆️ · index +5 ⬇️.",
            steps: [
              "ابدأ: مثّل 1 (خرزة سفلية) | Start: 1 (one lower bead)",
              "أضف 2: ارفع خرزتين بالإبهام → 3 | Add 2: 2 beads with thumb → 3",
              "أضف 1: ارفع خرزة إضافية → 4 | Add 1: 1 more bead → 4",
              "أضف 5: أنزل العلوية بالسبابة → 9 | Add 5: upper down with index → 9",
              "الناتج: 9 | Result: 9",
            ],
            result: 9,
            beadVisual: "5 + 4 = 9 | 5 + 4 = 9",
          },
          {
            id: "L4-S09-m1-E2",
            question: "2 + 1 + 5 + 1",
            discrimination: "+1 · +5 · +1 — كلها مباشرة. | +1 · +5 · +1 — all direct.",
            rule: "جمع بسيط مباشر. | Direct simple addition.",
            fingerMovement: "الإبهام +1 ⬆️ · السبابة +5 ⬇️ · الإبهام +1 ⬆️. | Thumb +1 ⬆️ · index +5 ⬇️ · thumb +1 ⬆️.",
            steps: [
              "ابدأ: مثّل 2 | Start: represent 2",
              "أضف 1: ارفع خرزة → 3 | Add 1: 1 bead → 3",
              "أضف 5: أنزل العلوية → 8 | Add 5: upper down → 8",
              "أضف 1: ارفع خرزة → 9 | Add 1: 1 bead → 9",
              "الناتج: 9 | Result: 9",
            ],
            result: 9,
            beadVisual: "5 + 4 = 9 | 5 + 4 = 9",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S09-m1-T1",
            question: "12 + 21 + 10 + 5",
            discrimination: "+21 · +10 (عشرات) · +5 (آحاد) — مباشرة. | +21 · +10 (tens) · +5 (units) — direct.",
            steps: [
              "ابدأ: مثّل 12 | Start: represent 12",
              "أضف 21: عشرات +2 → 30 · آحاد +1 → 33 | Add 21: tens +2 → 30 · units +1 → 33",
              "أضف 10: عشرات +1 → 43 | Add 10: tens +1 → 43",
              "أضف 5: آحاد +5 → 48 | Add 5: units +5 → 48",
              "الناتج: 48 | Result: 48",
            ],
            result: 48,
          },
          {
            id: "L4-S09-m1-T2",
            question: "3 + 1 + 5 + 10",
            discrimination: "+1 · +5 (آحاد) · +10 (عشرات). | +1 · +5 (units) · +10 (tens).",
            steps: [
              "ابدأ: مثّل 3 | Start: represent 3",
              "أضف 1: → 4 | Add 1: → 4",
              "أضف 5: → 9 | Add 5: → 9",
              "أضف 10: → 19 | Add 10: → 19",
              "الناتج: 19 | Result: 19",
            ],
            result: 19,
          },
          {
            id: "L4-S09-m1-T3",
            question: "20 + 10 + 5 + 2",
            discrimination: "+10 · +5 · +2. | +10 · +5 · +2.",
            steps: [
              "ابدأ: مثّل 20 | Start: represent 20",
              "أضف 10: → 30 | Add 10: → 30",
              "أضف 5: → 35 | Add 5: → 35",
              "أضف 2: → 37 | Add 2: → 37",
              "الناتج: 37 | Result: 37",
            ],
            result: 37,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m2 — الجمع بأصدقاء 5 (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m2",
      ruleCategory: "small_friends",
      title: "الجمع بأصدقاء 5 (سلاسل)",
      titleEn: "Complements of 5 Chains",
      emoji: "👵",
      miniStory: {
        title: "الجدة 5 في القطار | Grandma 5 on the Train",
        emoji: "👵",
        story: "عندما تمتلئ عربة الآحاد في القطار، تظهر الجدة 5 لتساعد! أضف 5 بالسبابة وأبعد الصديق بالإبهام — نزول مزدوج ⬇️⬇️. | When the units carriage is full, Grandma 5 appears to help! Add 5 with index and push the friend with thumb — double drop ⬇️⬇️.",
        storyAudioText: "عِنْدَمَا تَمْتَلِئُ عَرَبَةُ الآحَادِ فِي القِطَار، تَظْهَرُ الجَدَّةُ خَمْسَة لِتُسَاعِد. أَضِفْ خَمْسَةً بِالسَّبَّابَةِ وَأَبْعِدِ الصَّدِيقَ بِالإِبْهَام، نُزُولٌ مُزْدَوَج. | When the units carriage is full, Grandma 5 appears to help. Add 5 with index and push the friend with thumb — double drop.",
        storyAudioId: null,
      },
      rule: {
        description: "أصدقاء 5 👵: عندما لا تكفي السفليات، فعّل 5 بالسبابة ⬇️ واطرد الصديق بالإبهام ⬇️ (نزول مزدوج ⬇️⬇️). | Friends of 5 👵: When lower beads insufficient, activate 5 with index ⬇️ and push friend with thumb ⬇️ (Double Drop ⬇️⬇️).",
        cases: [
          { from: 1, formula: "+1 = +5 − 4" },
          { from: 2, formula: "+2 = +5 − 3" },
          { from: 3, formula: "+3 = +5 − 2" },
          { from: 4, formula: "+4 = +5 − 1" },
        ],
      },
      condition: {
        formula: "السفليات غير كافية · الجدة 5 متاحة | Lower beads insufficient · bead 5 available",
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
            question: "هل السفليات غير كافية؟ | Are lower beads insufficient?",
            type: "comparison",
            actual: "السفليات < المطلوب | Lower beads < required",
            answer: "نعم → استخدم أصدقاء 5 | Yes → Use Friends of 5",
            hint: "السفليات ممتلئة | Lower beads full",
          },
          {
            question: "هل الجدة 5 متاحة؟ | Is bead 5 available?",
            type: "yes-no",
            actual: "5 غير مفعّلة | 5 inactive",
            answer: "نعم → نزول مزدوج ⬇️⬇️ | Yes → Double Drop ⬇️⬇️",
            hint: "+n = +5 − (5−n)",
          },
        ],
        decision: "أصدقاء 5 — نزول مزدوج ⬇️⬇️! | Friends of 5 — Double Drop ⬇️⬇️!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S09-m2-E1",
            question: "4 + 1 + 2 + 1",
            discrimination: "+1 في الخطوة الأولى يستخدم أصدقاء 5 (+1 = +5 − 4). | +1 in first step uses Friends of 5 (+1 = +5 − 4).",
            rule: "+1 = +5 − 4",
            fingerMovement: "نزول مزدوج ⬇️⬇️ (سبابة 5 + إبهام 4) · ثم +2 سفليات · ثم +1 سفليات. | Double Drop ⬇️⬇️ (index 5 + thumb 4) · then +2 lower · then +1 lower.",
            steps: [
              "ابدأ: مثّل 4 | Start: represent 4",
              "أضف 1: نزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 والإبهام يطرد 4) → 5 | Add 1: Double Drop ⬇️⬇️ (index 5 + thumb 4) → 5",
              "أضف 2: ارفع خرزتين سفليتين → 7 | Add 2: 2 lower beads → 7",
              "أضف 1: ارفع خرزة → 8 | Add 1: 1 bead → 8",
              "الناتج: 8 | Result: 8",
            ],
            result: 8,
            beadVisual: "5 + 3 = 8",
          },
          {
            id: "L4-S09-m2-E2",
            question: "3 + 2 + 1 + 1",
            discrimination: "+2 في الخطوة الأولى (+2 = +5 − 3). | +2 in first step (+2 = +5 − 3).",
            rule: "+2 = +5 − 3",
            fingerMovement: "نزول مزدوج ⬇️⬇️ (سبابة 5 + إبهام 3) · ثم +1 · ثم +1. | Double Drop ⬇️⬇️ (index 5 + thumb 3) · then +1 · then +1.",
            steps: [
              "ابدأ: مثّل 3 | Start: represent 3",
              "أضف 2: نزول مزدوج ⬇️⬇️ (5 + إبعاد 3) → 5 | Add 2: Double Drop ⬇️⬇️ → 5",
              "أضف 1: → 6 | Add 1: → 6",
              "أضف 1: → 7 | Add 1: → 7",
              "الناتج: 7 | Result: 7",
            ],
            result: 7,
            beadVisual: "5 + 2 = 7",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S09-m2-T1",
            question: "2 + 3 + 2 + 1",
            discrimination: "+3 في الخطوة الأولى (+3 = +5 − 2). | +3 in first step (+3 = +5 − 2).",
            steps: [
              "ابدأ: مثّل 2 | Start: represent 2",
              "أضف 3: نزول مزدوج ⬇️⬇️ (5 + إبعاد 2) → 5 | Add 3: Double Drop ⬇️⬇️ → 5",
              "أضف 2: → 7 | Add 2: → 7",
              "أضف 1: → 8 | Add 1: → 8",
              "الناتج: 8 | Result: 8",
            ],
            result: 8,
          },
          {
            id: "L4-S09-m2-T2",
            question: "1 + 4 + 3 + 1",
            discrimination: "+4 في الخطوة الأولى (+4 = +5 − 1). | +4 in first step (+4 = +5 − 1).",
            steps: [
              "ابدأ: مثّل 1 | Start: 1",
              "أضف 4: نزول مزدوج ⬇️⬇️ (5 + إبعاد 1) → 5 | Add 4: Double Drop ⬇️⬇️ → 5",
              "أضف 3: → 8 | Add 3: → 8",
              "أضف 1: → 9 | Add 1: → 9",
              "الناتج: 9 | Result: 9",
            ],
            result: 9,
          },
          {
            id: "L4-S09-m2-T3",
            question: "14 + 3 + 1 + 1",
            discrimination: "+3 على 4 بالآحاد (+3 = +5 − 2). | +3 on 4 in units (+3 = +5 − 2).",
            steps: [
              "ابدأ: مثّل 14 | Start: 14",
              "أضف 3: نزول مزدوج على الآحاد ⬇️⬇️ → 17 | Add 3: Double Drop on units ⬇️⬇️ → 17",
              "أضف 1: → 18 | Add 1: → 18",
              "أضف 1: → 19 | Add 1: → 19",
              "الناتج: 19 | Result: 19",
            ],
            result: 19,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m3 — الجمع بأصدقاء 10 (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m3",
      ruleCategory: "big_friends",
      title: "الجمع بأصدقاء 10 (سلاسل)",
      titleEn: "Complements of 10 Chains",
      emoji: "🦶",
      miniStory: {
        title: "العملاق 10 يفتح عربة جديدة | Giant 10 Opens a New Carriage",
        emoji: "🦶",
        story: "عندما يفيض الآحاد عن 9، ينزل العملاق 10 ويضيف خرزة في العشرات! اطرح الصديق من الآحاد بالسبابة ⬇️ وأضف 1 للعشرات بالإبهام ⬆️. | When units exceed 9, Giant 10 arrives and adds a bead to tens! Subtract friend from units with index ⬇️ and add 1 to tens with thumb ⬆️.",
        storyAudioText: "عِنْدَمَا يَفِيضُ الآحَادُ عَنْ تِسْعَة، يَنْزِلُ العِمْلَاقُ عَشَرَة وَيُضِيفُ خَرَزَةً فِي العَشَرَات. اطْرَحِ الصَّدِيقَ مِنَ الآحَادِ بِالسَّبَّابَةِ وَأَضِفْ وَاحِداً لِلْعَشَرَاتِ بِالإِبْهَام. | When units exceed 9, Giant 10 arrives and adds a bead to tens. Subtract friend from units with index and add 1 to tens with thumb.",
        storyAudioId: null,
      },
      rule: {
        description: "أصدقاء 10 🦶: عندما يتجاوز المجموع 9، اطرح المتمّم بالسبابة ⬇️ وأضف 1 للعشرات بالإبهام ⬆️. | Friends of 10 🦶: When sum exceeds 9, subtract complement with index ⬇️ and add 1 to tens with thumb ⬆️.",
        cases: [
          { from: 1, formula: "+1 = −9 + 10" },
          { from: 2, formula: "+2 = −8 + 10" },
          { from: 3, formula: "+3 = −7 + 10" },
          { from: 4, formula: "+4 = −6 + 10" },
          { from: 5, formula: "+5 = −5 + 10" },
          { from: 6, formula: "+6 = −4 + 10" },
          { from: 7, formula: "+7 = −3 + 10" },
          { from: 8, formula: "+8 = −2 + 10" },
          { from: 9, formula: "+9 = −1 + 10" },
        ],
      },
      condition: {
        formula: "المجموع > 9 | Sum > 9",
        explanation: "تجاوز الآحاد 9 — اقفز للعشرات! | Units exceed 9 — leap to tens!",
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
            question: "هل المجموع في الآحاد يتجاوز 9؟ | Does units sum exceed 9?",
            type: "yes-no",
            actual: "المجموع > 9 | Sum > 9",
            answer: "نعم → استخدم أصدقاء 10 | Yes → Use Friends of 10",
            hint: "الآحاد ممتلئ | Units full",
          },
          {
            question: "هل يمكن طرح المتمّم مباشرة؟ | Can we subtract complement directly?",
            type: "yes-no",
            actual: "الخرزات المفعّلة ≥ المتمّم | Active beads ≥ complement",
            answer: "نعم → اطرح بالسبابة ⬇️ + 1 للعشرات بالإبهام ⬆️ | Yes → subtract with index ⬇️ + 1 to tens with thumb ⬆️",
            hint: "+n = −k + 10",
          },
        ],
        decision: "أصدقاء 10 — اطرح المتمّم واقفز للعشرات! | Friends of 10 — subtract complement & leap to tens!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S09-m3-E1",
            question: "9 + 1 + 5 + 2",
            discrimination: "+1 على 9 يستدعي أصدقاء 10 (+1 = −9 + 10). | +1 on 9 requires Friends of 10 (+1 = −9 + 10).",
            rule: "+1 = −9 + 10",
            fingerMovement: "اطرد 9 بالآحاد ⬇️ + 1 للعشرات بالإبهام ⬆️ · ثم +5 · ثم +2. | Subtract 9 from units ⬇️ + 1 to tens with thumb ⬆️ · then +5 · then +2.",
            steps: [
              "ابدأ: مثّل 9 (5 + 4) | Start: 9 (5 + 4)",
              "أضف 1: اطرح 9 من الآحاد + أضف 1 للعشرات → 10 | Add 1: subtract 9 from units + add 1 to tens → 10",
              "أضف 5: → 15 | Add 5: → 15",
              "أضف 2: → 17 | Add 2: → 17",
              "الناتج: 17 | Result: 17",
            ],
            result: 17,
            beadVisual: "1 عشرات + 7 آحاد = 17",
          },
          {
            id: "L4-S09-m3-E2",
            question: "8 + 2 + 5 + 1",
            discrimination: "+2 على 8 (+2 = −8 + 10). | +2 on 8 (+2 = −8 + 10).",
            rule: "+2 = −8 + 10",
            fingerMovement: "اطرد 8 بالآحاد ⬇️ + 1 للعشرات ⬆️ · +5 · +1. | Subtract 8 from units ⬇️ + 1 to tens ⬆️ · +5 · +1.",
            steps: [
              "ابدأ: مثّل 8 | Start: 8",
              "أضف 2: −8 بالآحاد + 1 للعشرات → 10 | Add 2: −8 units + 1 tens → 10",
              "أضف 5: → 15 | Add 5: → 15",
              "أضف 1: → 16 | Add 1: → 16",
              "الناتج: 16 | Result: 16",
            ],
            result: 16,
            beadVisual: "1 عشرات + 6 آحاد = 16",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S09-m3-T1",
            question: "7 + 3 + 1 + 5",
            discrimination: "+3 على 7 (+3 = −7 + 10). | +3 on 7 (+3 = −7 + 10).",
            steps: [
              "ابدأ: مثّل 7 | Start: 7",
              "أضف 3: −7 + 10 → 10 | Add 3: −7 + 10 → 10",
              "أضف 1: → 11 | Add 1: → 11",
              "أضف 5: → 16 | Add 5: → 16",
              "الناتج: 16 | Result: 16",
            ],
            result: 16,
          },
          {
            id: "L4-S09-m3-T2",
            question: "6 + 4 + 2 + 5",
            discrimination: "+4 على 6 (+4 = −6 + 10). | +4 on 6 (+4 = −6 + 10).",
            steps: [
              "ابدأ: مثّل 6 | Start: 6",
              "أضف 4: −6 + 10 → 10 | Add 4: −6 + 10 → 10",
              "أضف 2: → 12 | Add 2: → 12",
              "أضف 5: → 17 | Add 5: → 17",
              "الناتج: 17 | Result: 17",
            ],
            result: 17,
          },
          {
            id: "L4-S09-m3-T3",
            question: "9 + 6 + 2 + 1",
            discrimination: "+6 على 9 (+6 = −4 + 10). | +6 on 9 (+6 = −4 + 10).",
            steps: [
              "ابدأ: مثّل 9 | Start: 9",
              "أضف 6: −4 + 10 → 15 | Add 6: −4 + 10 → 15",
              "أضف 2: → 17 | Add 2: → 17",
              "أضف 1: → 18 | Add 1: → 18",
              "الناتج: 18 | Result: 18",
            ],
            result: 18,
          },
        ],
      },
    },

    // ═══════════════════════════════════════════════════════════
    // m4 — الجمع المركّب (سلاسل)
    // ═══════════════════════════════════════════════════════════
    {
      id: "m4",
      ruleCategory: "combined",
      title: "الجمع المركّب (سلاسل)",
      titleEn: "Compound Addition Chains",
      emoji: "👑",
      miniStory: {
        title: "التنسيق الثلاثي | The Triple Alliance",
        emoji: "👑",
        story: "أحياناً تحتاج الجدة 5 والعملاق 10 معاً! التنسيق بينهما هو سر البطل الحقيقي — الجدة تتدخل أولاً، ثم العملاق يُكمل المهمة. | Sometimes you need Grandma 5 and Giant 10 together! Coordinating them is the real hero's secret — Grandma steps in first, then Giant completes the mission.",
        storyAudioText: "أَحْيَاناً تَحْتَاجُ الجَدَّةُ خَمْسَة وَالعِمْلَاقُ عَشَرَة مَعاً. التَّنْسِيقُ بَيْنَهُمَا هُوَ سِرُّ البَطَلِ الحَقِيقِيّ، الجَدَّةُ تَتَدَخَّلُ أَوَّلاً، ثُمَّ العِمْلَاقُ يُكْمِلُ المَهَمَّة. | Sometimes you need Grandma 5 and Giant 10 together. Coordinating them is the real hero's secret, Grandma steps in first, then Giant completes the mission.",
        storyAudioId: null,
      },
      rule: {
        description: "المركّب 👑: عندما تكون 5 مفعّلة والسفليات لا تكفي، نفّذ رفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة + إضافة المكمّل بالإبهام) ثم +10 للعشرات! | Compound 👑: When 5 is active and lower beads insufficient, perform Double Lift ⬆️⬆️ (cancel 5 + add remainder) then +10 to tens!",
        cases: [
          { from: 6, formula: "+6 = −5 + 1 + 10" },
          { from: 7, formula: "+7 = −5 + 2 + 10" },
          { from: 8, formula: "+8 = −5 + 3 + 10" },
          { from: 9, formula: "+9 = −5 + 4 + 10" },
        ],
      },
      condition: {
        formula: "المجموع ≥ 10 · 5 مفعّلة · السفليات < المتمّم | Sum ≥ 10 · bead 5 active · lower beads < complement",
        explanation: "الجدة 5 والعملاق 10 يتعاونان: رفع مزدوج + 10 للعشرات! | Grandma 5 & Giant 10 team up: Double Lift + 10 to tens!",
      },
      discrimination: {
        steps: [
          {
            question: "هل المجموع يصل إلى 10 أو أكثر؟ | Does sum reach 10 or more?",
            type: "yes-no",
            actual: "المجموع ≥ 10 | Sum ≥ 10",
            answer: "نعم → نحتاج +10 للعشرات | Yes → Need +10 to tens",
            hint: "الآحاد ممتلئ | Units full",
          },
          {
            question: "هل السفليات < المتمّم المطلوب؟ | Are lower beads < required complement?",
            type: "yes-no",
            actual: "السفليات < المتمّم | Lower beads < complement",
            answer: "نعم → رفع مزدوج ⬆️⬆️ + 10 | Yes → Double Lift ⬆️⬆️ + 10",
            hint: "إلغاء 5 + إضافة المكمّل + 1 للعشرات",
          },
        ],
        decision: "جمع مركّب — رفع مزدوج ⬆️⬆️ + 10! | Compound — Double Lift ⬆️⬆️ + 10!",
      },
      watchPhase: {
        examples: [
          {
            id: "L4-S09-m4-E1",
            question: "7 + 6 + 1 + 1",
            discrimination: "+6 على 7 في الآحاد يستدعي رفع مزدوج + 10. | +6 on 7 in units requires Double Lift + 10.",
            rule: "+6 = −5 + 1 + 10",
            fingerMovement: "رفع مزدوج على الآحاد ⬆️⬆️ (سبابة تلغي 5 + إبهام يضيف 1) + 1 للعشرات ⬆️. | Double Lift on units ⬆️⬆️ (index cancels 5 + thumb adds 1) + 1 to tens ⬆️.",
            steps: [
              "ابدأ: مثّل 7 (5 + 2) | Start: 7 (5 + 2)",
              "أضف 6: رفع مزدوج ⬆️⬆️ (إلغاء 5 + إضافة 1) + 1 للعشرات → 13 | Add 6: Double Lift ⬆️⬆️ (cancel 5 + add 1) + 1 to tens → 13",
              "أضف 1: → 14 | Add 1: → 14",
              "أضف 1: → 15 | Add 1: → 15",
              "الناتج: 15 | Result: 15",
            ],
            result: 15,
            beadVisual: "1 عشرات + 5 آحاد = 15",
          },
          {
            id: "L4-S09-m4-E2",
            question: "8 + 6 + 2 + 1",
            discrimination: "+6 على 8 (+6 = −5 + 1 + 10). | +6 on 8 (+6 = −5 + 1 + 10).",
            rule: "+6 = −5 + 1 + 10",
            fingerMovement: "رفع مزدوج ⬆️⬆️ + 1 للعشرات ⬆️. | Double Lift ⬆️⬆️ + 1 to tens ⬆️.",
            steps: [
              "ابدأ: مثّل 8 (5 + 3) | Start: 8 (5 + 3)",
              "أضف 6: رفع مزدوج (إلغاء 5 + إضافة 1) + 1 للعشرات → 14 | Add 6: Double Lift + 1 to tens → 14",
              "أضف 2: → 16 | Add 2: → 16",
              "أضف 1: → 17 | Add 1: → 17",
              "الناتج: 17 | Result: 17",
            ],
            result: 17,
            beadVisual: "1 عشرات + 7 آحاد = 17",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "L4-S09-m4-T1",
            question: "7 + 7 + 1 + 1",
            discrimination: "+7 على 7 (+7 = −5 + 2 + 10). | +7 on 7 (+7 = −5 + 2 + 10).",
            steps: [
              "ابدأ: مثّل 7 | Start: 7",
              "أضف 7: رفع مزدوج (إلغاء 5 + إضافة 2) + 1 للعشرات → 14 | Add 7: Double Lift + 1 to tens → 14",
              "أضف 1: → 15 | Add 1: → 15",
              "أضف 1: → 16 | Add 1: → 16",
              "الناتج: 16 | Result: 16",
            ],
            result: 16,
          },
          {
            id: "L4-S09-m4-T2",
            question: "6 + 6 + 2 + 1",
            discrimination: "+6 على 6 (+6 = −5 + 1 + 10). | +6 on 6 (+6 = −5 + 1 + 10).",
            steps: [
              "ابدأ: مثّل 6 (5 + 1) | Start: 6 (5 + 1)",
              "أضف 6: رفع مزدوج + 1 للعشرات → 12 | Add 6: Double Lift + 1 to tens → 12",
              "أضف 2: → 14 | Add 2: → 14",
              "أضف 1: → 15 | Add 1: → 15",
              "الناتج: 15 | Result: 15",
            ],
            result: 15,
          },
          {
            id: "L4-S09-m4-T3",
            question: "6 + 7 + 1 + 1",
            discrimination: "+7 على 6 (+7 = −5 + 2 + 10). | +7 on 6 (+7 = −5 + 2 + 10).",
            steps: [
              "ابدأ: مثّل 6 | Start: 6",
              "أضف 7: رفع مزدوج + 1 للعشرات → 13 | Add 7: Double Lift + 1 to tens → 13",
              "أضف 1: → 14 | Add 1: → 14",
              "أضف 1: → 15 | Add 1: → 15",
              "الناتج: 15 | Result: 15",
            ],
            result: 15,
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت سلاسل الجمع! | You mastered addition chains!",
    encouragement: "🎉 أنت الآن تجمع عدة أرقام بسرعة السوروبان! | 🎉 You now add multiple numbers with Soroban speed!",
    totalExamples: 8,
  },

  estimatedMinutes: 20,
  xpReward: 15,
};

export default S09_LESSON;