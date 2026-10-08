// src/curriculum/lessons/L1/S03.ts
// ➕ درس S03: الجمع (مطور للأطفال وفق منهجية تاكاشي كوجيما - ثنائي اللغة)
// 📅 آخر تحديث: 2026-10-08
// [FIX S03-1] — حذف rule.formula من m2 · m3 · m4 (القاعدة الطويلة معقدة على الأطفال)
// ملاحظة: condition.formula تبقى (قصيرة وبسيطة)

import type { LessonNode } from "../types";

export const S03_LESSON: LessonNode = {
  id: "S03",
  skillId: "S03",
  levelId: "L1",
  order: 1,
  title: { ar: "الجمع", en: "Addition" },
  emoji: "➕",
  tags: ["addition", "kids", "L1", "direct", "small_friends", "big_friends", "combined"],

  modules: [
    // =========================================================================
    // Module 1: Direct Addition (الجمع البسيط)
    // =========================================================================
    {
      id: "m1",
      ruleCategory: "direct",
      title: "الجمع البسيط",
      titleEn: "Direct Addition",
      emoji: "✨",
      miniStory: {
        title: "القاعدة الذهبية | The Golden Rule",
        emoji: "🔑",
        story: "قال حارس القلعة: تذكّروا القاعدة الذهبية — عندما تتعاملون مع أعداد كبيرة، ابدؤوا من البيوت الكبيرة قبل الصغيرة. هذا سرّ السرعة في السوروبان! | The castle guard said: Remember the golden rule — when dealing with large numbers, start from the big houses before the small ones. This is the secret of speed in Soroban!",
        storyAudioText: "قال حارس القلعة: تذكروا القاعدة الذهبية — عندما تتعاملون مع أعداد كبيرة، ابدؤوا من البيوت الكبيرة قبل الصغيرة. هذا سر السرعة في السوروبان.",
        storyAudioId: 3,
      },
      rule: {
        description: "لمسة الأصابع السريعة ⚡: نُضيف الخرزات مباشرة نحو العارضة الفاصلة بلمسة واحدة — بلا استعارة ولا أصدقاء! | Quick Finger Touch ⚡: Add beads directly toward the bar with a single touch — no borrowing, no friends needed!",
      },
      condition: {
        formula: "n ≤ 4 · l + n ≤ 4  |  n = 5 والعلوية غير مفعّلة  |  n > 5 والعلوية غير مفعّلة · l + (n−5) ≤ 4",
        explanation: "الخرزات متوفرة أمامك مباشرة في نفس العمود لتنفيذ الجمع السريع! | Beads are directly available in the same rod for quick addition!",
      },
      discrimination: {
        steps: [
          {
            question: "هل الخرزات السفلية المتبقية تكفي للإضافة؟ | Are there enough lower beads remaining to add?",
            type: "comparison",
            actual: "l + n ≤ 4",
            answer: "نعم → جمع بسيط سفلي بالإبهام ⬆️ | Yes → Direct lower addition using thumb ⬆️",
            hint: "عدّ الخرزات السفلية الفارغة في الأسفل | Count the remaining inactive lower beads",
          },
          {
            question: "هل تريد إضافة 5 والخرزة العلوية غير مفعّلة؟ | Want to add 5 and upper bead is inactive?",
            type: "yes-no",
            answer: "نعم → جمع بسيط بالسبابة ⬇️ | Yes → Direct upper addition using index finger ⬇️",
            hint: "إذا كانت الخرزة 5 بعيدة عن العارضة فهي جاهزة! | If bead 5 is far from the bar, it's ready!",
          },
        ],
        decision: "جمع بسيط مباشر — الخرزات متوفرة أمامك مباشرة! | Direct Addition — Beads are directly available in front of you!",
      },
      watchPhase: {
        examples: [
          {
            id: "S03-m1-E1",
            question: "2 + 2",
            discrimination: "لدينا 2 مفعّلة، والمتبقي في الأسفل 2. تكفي تماماً! | 2 active, 2 remaining below. Exactly enough!",
            rule: "جمع مباشر — لا نحتاج أصدقاء! | Direct addition — No friends needed!",
            fingerMovement: "👍 الإبهام يرفع الخرزتين السفليتين نحو العارضة ⬆️ | Thumb lifts 2 lower beads toward the bar ⬆️",
            steps: [
              "البداية: المعداد مصفّر | Start: Abacus cleared (0)",
              "تمثيل 2: ارفع خرزتين سفليتين بالإبهام ⬆️ | Represent 2: Lift 2 lower beads with thumb ⬆️",
              "إضافة 2: ارفع خرزتين إضافيتين بالإبهام ⬆️ | Add 2: Lift 2 more lower beads with thumb ⬆️",
              "الناتج الظاهر: 4 خرزات سفلية تلامس العارضة = 4 | Result: 4 lower beads touch the bar = 4",
            ],
            result: 4,
            beadVisual: "4 خرزات سفلية تلامس العارضة | 4 lower beads touching the bar",
          },
          {
            id: "S03-m1-E2",
            question: "5 + 3",
            discrimination: "العلوية (5) غير مفعّلة، والسفليات فارغة. كلاهما جاهز! | Upper (5) inactive, lower empty. Both ready!",
            rule: "🗜️ حركة الكماشة المغلقة لإضافة 5 و3 معاً | Pinch gesture to add 5 and 3 together",
            fingerMovement: "🗜️ الكماشة المغلقة: السبابة تُنزل 5 ⬇️ والإبهام يرفع 3 سفليات ⬆️ في نفس اللحظة | Pinch: Index brings 5 down ⬇️ & thumb lifts 3 lower beads up ⬆️ simultaneously",
            steps: [
              "تمثيل 5: أنزل الخرزة العلوية بالسبابة ⬇️ | Represent 5: Bring down upper bead with index ⬇️",
              "إضافة 3: ارفع 3 خرزات سفلية بالإبهام ⬆️ | Add 3: Lift 3 lower beads with thumb ⬆️",
              "الناتج الظاهر: الخرزة العلوية (5) + 3 سفليات = 8 | Result: Upper bead (5) + 3 lower beads = 8",
            ],
            result: 8,
            beadVisual: "الخرزة العلوية (5) و3 سفليات = 8 | Upper bead (5) + 3 lower beads = 8",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S03-m1-T1",
            question: "1 + 3",
            discrimination: "1 مفعّلة، المتبقي سفلياً 3 → جمع مباشر! | 1 active, 3 remaining below → Direct addition!",
            steps: [
              "مثّل 1: ارفع خرزة بالإبهام ⬆️ | Represent 1: Lift 1 bead with thumb ⬆️",
              "أضف 3: ارفع 3 خرزات بالإبهام ⬆️ | Add 3: Lift 3 beads with thumb ⬆️",
              "الناتج: 4 | Result: 4",
            ],
            result: 4,
          },
          {
            id: "S03-m1-T2",
            question: "5 + 2",
            discrimination: "5 فارغة والسفليات فارغة → جمع مباشر بالسبابة والإبهام | 5 empty, lower empty → Direct addition with index & thumb",
            steps: [
              "أنزل 5 بالسبابة ⬇️ | Bring down 5 with index ⬇️",
              "ارفع 2 بالإبهام ⬆️ | Lift 2 with thumb ⬆️",
              "الناتج: 7 | Result: 7",
            ],
            result: 7,
          },
          {
            id: "S03-m1-T3",
            question: "3 + 1 + 5",
            discrimination: "جميع الخطوات بسيطة ومباشرة | All steps are direct and simple",
            steps: [
              "مثّل 3 بالإبهام ⬆️ | Represent 3 with thumb ⬆️",
              "أضف 1 بالإبهام ⬆️ | Add 1 with thumb ⬆️",
              "أنزل 5 بالسبابة ⬇️ | Bring down 5 with index ⬇️",
              "الناتج: 9 | Result: 9",
            ],
            result: 9,
          },
          {
            id: "S03-m1-T4",
            question: "2 + 5 + 1",
            discrimination: "رفع 2 ثم تنزيل 5 ثم رفع 1 — كلها حركات مباشرة | Lift 2, bring down 5, lift 1 — all direct movements",
            steps: [
              "ارفع 2 بالإبهام ⬆️ | Lift 2 with thumb ⬆️",
              "أنزل 5 بالسبابة ⬇️ | Bring down 5 with index ⬇️",
              "ارفع 1 بالإبهام ⬆️ | Lift 1 with thumb ⬆️",
              "الناتج: 8 | Result: 8",
            ],
            result: 8,
          },
        ],
      },
    },

    // =========================================================================
    // Module 2: Complements of 5 (الجمع بأصدقاء 5)
    // =========================================================================
    {
      id: "m2",
      ruleCategory: "small_friends",
      title: "الجمع بأصدقاء 5",
      titleEn: "Complements of 5",
      emoji: "🤝",
      miniStory: {
        title: "غرفة الجدة 5 | Grandma 5's Room",
        emoji: "👵",
        story: "وصل الأبطال إلى غرفة الجدة 5. أرادوا إضافة طفل واحد، لكن الساحة ممتلئة! ظهرت الجدة 5 وقالت: لا تقلقوا، أنا أستطيع المساعدة، لكن لي شرط: إذا دخلت أنا (+5)، يجب أن يخرج صديق الرقم الذي تريدونه. | The heroes reached Grandma 5's room. They wanted to add one child, but the yard was full! Grandma 5 appeared and said: Don't worry, I can help, but on one condition: if I come in (+5), your number's friend must leave.",
        storyAudioText: "وصل الأبطال إلى غرفة الجدة خمسة. أرادوا إضافة طفل واحد، لكن الساحة ممتلئة. ظهرت الجدة خمسة وقالت: لا تقلقوا، أنا أستطيع المساعدة، لكن لي شرط: إذا دخلت أنا، يجب أن يخرج صديق الرقم الذي تريدونه.",
        storyAudioId: 4,
      },
      rule: {
        description: "سرّ الجدة 5 👵: عندما تكتظ الساحة السفلية، ننزل الجدة 5 بالسبابة نحو العارضة، ونطرد صديق الرقم للأسفل بعيداً عن العارضة! | Grandma 5's Secret 👵: When the lower yard is full, bring down Grandma 5 with your index finger and push the number's friend down away from the bar!",
        cases: [
          { from: 1, formula: "+1 = +5 − 4" },
          { from: 2, formula: "+2 = +5 − 3" },
          { from: 3, formula: "+3 = +5 − 2" },
          { from: 4, formula: "+4 = +5 − 1" },
        ],
      },
      condition: {
        formula: "c ≤ 4 · n ≤ 4 · c + n ≥ 5",
        explanation: "الخرزات السفلية غير كافية، لكن الجدة 5 جاهزة للتدخل والإنقاذ! | Lower beads are not enough, but Grandma 5 is ready to step in!",
      },
      friendsTable: {
        title: "أصدقاء 5 الصغار | Small Friends of 5",
        pairs: [
          { from: 1, to: 4 },
          { from: 2, to: 3 },
          { from: 3, to: 2 },
          { from: 4, to: 1 },
        ],
      },
      discrimination: {
        steps: [
          {
            question: "هل الخرزات السفلية غير كافية؟ | Are lower beads insufficient?",
            type: "comparison",
            actual: "l < n",
            answer: "نعم → الخرزات السفلية ممتلئة! | Yes → Lower beads are full!",
            hint: "لو كانت كافية لاستخدمنا الجمع البسيط | If they were enough, we'd use direct addition",
          },
          {
            question: "هل الجدة 5 (الخرزة العلوية) غير مفعّلة؟ | Is Grandma 5 (upper bead) available?",
            type: "yes-no",
            answer: "نعم → نطلب مساعدة الجدة 5! | Yes → Ask Grandma 5 for help!",
            hint: "وجود الجدة 5 يسمح بتدفق أصدقائها | Grandma 5 allows using her small friends",
          },
        ],
        decision: "استخدم أصدقاء 5 — أنزل الجدة 5 بالسبابة واطرد الصديق للأسفل! | Use Friends of 5 — Bring down Grandma 5 with index finger and push friend down!",
      },
      watchPhase: {
        examples: [
          {
            id: "S03-m2-E1",
            question: "4 + 1",
            discrimination: "4 مفعّلة، ولا خرزات سفليّة متبقية. 5 فارغة → نستخدم أصدقاء 5 (صديق 1 هو 4) | 4 active, 0 lower beads remaining. 5 is free → Use friends of 5 (1's friend is 4)",
            rule: "+1 = +5 − 4 (صديق 1 الصغير هو 4 | Small friend of 1 is 4)",
            fingerMovement: "👆 السبابة تُنزل الخرزة 5 نحو العارضة ⬇️ وتطرد الـ 4 السفليات بعيداً عن العارضة ⬇️ بحركة سريعة | Index finger brings down 5 ⬇️ and pushes 4 lower beads down ⬇️ in one smooth motion",
            steps: [
              "تمثيل 4: ارفع 4 خرزات سفلية بالإبهام ⬆️ | Represent 4: Lift 4 lower beads with thumb ⬆️",
              "إضافة 1: السبابة تُنزل 5 ⬇️ وتطرد 4 خرزات سفلية للأسفل ⬇️ | Add 1: Index brings down 5 ⬇️ & pushes 4 lower beads down ⬇️",
              "الناتج الظاهر: الخرزة العلوية (5) فقط تلامس العارضة = 5 | Result: Upper bead (5) only touching the bar = 5",
            ],
            result: 5,
            beadVisual: "الخرزة العلوية 5 فقط تلامس العارضة | Upper bead 5 only touching the bar",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S03-m2-T1",
            question: "4 + 3",
            discrimination: "4 مفعّلة، السفلية ممتلئة → صديق 3 هو 2 | 4 active, lower full → 3's friend is 2",
            steps: [
              "مثّل 4 بالإبهام ⬆️ | Represent 4 with thumb ⬆️",
              "أنزل 5 بالسبابة ⬇️ واخصم 2 من الخرزات السفلية للأسفل ⬇️ | Bring down 5 with index ⬇️ & subtract 2 lower beads down ⬇️",
              "الناتج: 7 | Result: 7",
            ],
            result: 7,
          },
          {
            id: "S03-m2-T2",
            question: "3 + 3",
            discrimination: "3 مفعّلة، المتبقي خرزة 1 سفلياً → صديق 3 هو 2 | 3 active, 1 lower bead left → 3's friend is 2",
            steps: [
              "مثّل 3 بالإبهام ⬆️ | Represent 3 with thumb ⬆️",
              "أنزل 5 ⬇️ واطرد 2 بالسبابة ⬇️ بحركة واحدة | Bring down 5 ⬇️ & push 2 down with index ⬇️ in one motion",
              "الناتج: 6 | Result: 6",
            ],
            result: 6,
          },
          {
            id: "S03-m2-T3",
            question: "2 + 4",
            discrimination: "2 مفعّلة، المتبقي 2 لا يكفي لـ 4 → صديق 4 هو 1 | 2 active, 2 left (insufficient for 4) → 4's friend is 1",
            steps: [
              "مثّل 2 بالإبهام ⬆️ | Represent 2 with thumb ⬆️",
              "أنزل 5 ⬇️ واطرد 1 بالسبابة ⬇️ | Bring down 5 ⬇️ & push 1 down with index ⬇️",
              "الناتج: 6 | Result: 6",
            ],
            result: 6,
          },
          {
            id: "S03-m2-T4",
            question: "4 + 2",
            discrimination: "السفليات ممتلئة تماماً → صديق 2 هو 3 | Lower beads completely full → 2's friend is 3",
            steps: [
              "مثّل 4 بالإبهام ⬆️ | Represent 4 with thumb ⬆️",
              "أنزل 5 ⬇️ واطرد 3 بالسبابة ⬇️ | Bring down 5 ⬇️ & push 3 down with index ⬇️",
              "الناتج: 6 | Result: 6",
            ],
            result: 6,
          },
        ],
      },
    },

    // ⏸️ الجزء 2 يبدأ من m3 — أرسل "تابع"
    // =========================================================================
    // Module 3: Complements of 10 (الجمع بأصدقاء 10)
    // =========================================================================
    {
      id: "m3",
      ruleCategory: "big_friends",
      title: "الجمع بأصدقاء 10",
      titleEn: "Complements of 10",
      emoji: "🌟",
      miniStory: {
        title: "ظهور العملاق 10 | Giant 10 Appears",
        emoji: "🦶",
        story: "عندما كبرت الأرقام، لم تعد الجدة 5 تكفي! ظهر عملاق العشرات 10 في العمود الثاني على اليسار. قال: أنا أتدخل عندما يكتظ عمود الآحاد! نادوا عليّ (+10)، وسأطرح متمم الرقم من الآحاد. | As numbers grew larger, Grandma 5 wasn't enough! Giant 10 appeared on the tens rod. He said: I step in when the units rod gets crowded! Call me (+10), and I will subtract the friend from the units.",
        storyAudioText: "عندما كبرت الأرقام، لم تعد الجدة خمسة تكفي. ظهر عملاق العشرات عشرة في العمود الثاني على اليسار. قال: أنا أتدخل عندما يكتظ عمود الآحاد. نادوا عليّ، وسأطرح متمم الرقم من الآحاد.",
        storyAudioId: 6,
      },
      rule: {
        description: "قفزة العملاق 10 🌟: عندما يكتظ بيت الآحاد بالكامل، نطرد صديق الرقم بعيداً عن العارضة بالسبابة، ونوقظ خرزة واحدة في بيت العشرات بالإبهام! | Giant 10's Leap 🌟: When the units rod is full, push the number's friend away from the bar with index, and awaken 1 bead in tens rod with thumb!",
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
        formula: "c + n > 9  ·  إمكانية طرح k مباشرة",
        explanation: "المجموع يتجاوز 9، وتوجد خرزات كافية لطرح صديق 10 مباشرة من الآحاد! | Sum exceeds 9, and active beads are enough to subtract 10's friend directly!",
      },
      friendsTable: {
        title: "أصدقاء 10 الكبار | Big Friends of 10",
        pairs: [
          { from: 1, to: 9 },
          { from: 2, to: 8 },
          { from: 3, to: 7 },
          { from: 4, to: 6 },
          { from: 5, to: 5 },
          { from: 6, to: 4 },
          { from: 7, to: 3 },
          { from: 8, to: 2 },
          { from: 9, to: 1 },
        ],
      },
      discrimination: {
        steps: [
          {
            question: "هل مجموع الخانة يتجاوز 9؟ | Does the column sum exceed 9?",
            type: "comparison",
            actual: "c + n > 9",
            answer: "نعم (عمود الآحاد امتليء!) | Yes (Units rod is overflowing!)",
          },
          {
            question: "هل يمكن طرح صديق 10 مباشرة من الآحاد؟ | Can we subtract 10's friend directly from units?",
            type: "yes-no",
            answer: "نعم (الخرزات المفعّلة تكفي للخصم) | Yes (Active beads are enough to subtract)",
            hint: "خصم مباشر من الآحاد دون الحاجة لاستدعاء الجدة 5 | Direct subtraction from units without using Grandma 5",
          },
        ],
        decision: "استخدم أصدقاء 10 — اخصم الصديق من الآحاد وأضف 1 في العشرات! | Use Friends of 10 — Subtract friend from units and add 1 in tens!",
      },
      watchPhase: {
        examples: [
          {
            id: "S03-m3-E1",
            question: "9 + 1",
            discrimination: "عمود الآحاد ممتلئ بـ 9. صديق 1 لـ 10 هو 9. نخصم 9 من الآحاد وننادي العملاق 10! | Units rod is full with 9. 1's friend is 9. Subtract 9 from units & call Giant 10!",
            rule: "+1 = −9 + 10",
            fingerMovement: "👆 السبابة تخصم 9 من الآحاد (إبعاد كل الخرزات) ⬇️⬆️، و👍 الإبهام يرفع خرزة 1 في العشرات ⬆️ | Index subtracts 9 from units (clearing beads), thumb raises 1 bead in tens rod ⬆️",
            steps: [
              "تمثيل 9: ضع 9 في الآحاد (5 علوية + 4 سفلية) | Represent 9: Set 9 in units (5 upper + 4 lower)",
              "اخصم 9 بالسبابة: ابعد الخرزات عن العارضة ⬇️⬆️ | Subtract 9 with index: Move beads away from bar",
              "ارفع 1 في قضيب العشرات بالإبهام ⬆️ | Lift 1 bead in tens rod with thumb ⬆️",
              "الناتج الظاهر: 1 في العشرات و0 في الآحاد = 10 | Result: 1 in tens and 0 in units = 10",
            ],
            result: 10,
            beadVisual: "1 في العشرات و0 في الآحاد | 1 in tens rod and 0 in units rod",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S03-m3-T1",
            question: "8 + 2",
            discrimination: "8 مفعّلة → لا متسع لـ 2 → صديق 2 هو 8 → اخصم 8 وارفع 10 | 8 active → No room for 2 → 2's friend is 8 → Subtract 8, add 10",
            steps: [
              "مثّل 8 (5 علوية + 3 سفليات) | Represent 8 (5 upper + 3 lower)",
              "اخصم 8 بالسبابة (ارفع 5 ⬆️ وأنزل 3 ⬇️) | Subtract 8 with index (lift 5 ⬆️, lower 3 ⬇️)",
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in tens rod with thumb ⬆️",
              "الناتج: 10 | Result: 10",
            ],
            result: 10,
          },
          {
            id: "S03-m3-T2",
            question: "7 + 5",
            discrimination: "الخرزة 5 مفعّلة في الآحاد → صديق 5 هو 5 → اخصم 5 وارفع 10 | Upper 5 active in units → 5's friend is 5 → Subtract 5, add 10",
            steps: [
              "مثّل 7 (5 علوية + 2 سفليات) | Represent 7 (5 upper + 2 lower)",
              "اخصم 5 (ارفع العلوية بالسبابة ⬆️) | Subtract 5 (lift upper bead with index ⬆️)",
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in tens rod with thumb ⬆️",
              "الناتج: 12 | Result: 12",
            ],
            result: 12,
          },
          {
            id: "S03-m3-T3",
            question: "9 + 6",
            discrimination: "9 تحتوي 4 خرزات سفلية، صديق 6 هو 4 → اخصم 4 سفلياً وارفع 10 | 9 has 4 lower beads, 6's friend is 4 → Subtract 4 lower, add 10",
            steps: [
              "مثّل 9 (5 + 4 سفليات) | Represent 9 (5 + 4 lower)",
              "اخصم 4 من الخرزات السفلية بالسبابة ⬇️ | Subtract 4 lower beads with index ⬇️",
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in tens rod with thumb ⬆️",
              "الناتج: 15 | Result: 15",
            ],
            result: 15,
          },
          {
            id: "S03-m3-T4",
            question: "9 + 4",
            discrimination: "9 ممتلئ، صديق 4 هو 6 → اخصم 6 (5 و1) وارفع 10 | 9 full, 4's friend is 6 → Subtract 6 (5 & 1), add 10",
            steps: [
              "مثّل 9 (5 + 4 سفليات) | Represent 9 (5 + 4 lower)",
              "اخصم 6 (ارفع 5 ⬆️ وأنزل 1 ⬇️) | Subtract 6 (lift 5 ⬆️, lower 1 ⬇️)",
              "ارفع 1 في العشرات بالإبهام ⬆️ | Lift 1 in tens rod with thumb ⬆️",
              "الناتج: 13 | Result: 13",
            ],
            result: 13,
          },
        ],
      },
    },

    // =========================================================================
    // Module 4: Compound Addition (الجمع المركّب)
    // =========================================================================
    {
      id: "m4",
      ruleCategory: "combined",
      title: "الجمع المركّب",
      titleEn: "Compound Addition",
      emoji: "🎯",
      miniStory: {
        title: "العرش المزدوج | The Double Throne",
        emoji: "👑",
        story: "وصل الأبطال إلى العرش المزدوج حيث تلتقي الجدة 5 مع العملاق 10. في بعض المسائل الصعبة، يحتاج الطفل للاتصال بالعملاق 10 والجدة 5 في نفس اللحظة! | The heroes reached the Double Throne where Grandma 5 meets Giant 10. In tricky problems, you need both Giant 10 and Grandma 5 at the exact same time!",
        storyAudioText: "وصل الأبطال إلى العرش المزدوج حيث تلتقي الجدة خمسة مع العملاق عشرة. في بعض المسائل الصعبة، يحتاج الطفل للاتصال بالعملاق عشرة والجدة خمسة في نفس اللحظة.",
        storyAudioId: 8,
      },
      rule: {
        description: "سحر العرش المزدوج 👑: عندما لا تكفي الخرزات السفلية لخصم صديق 10، نرفع الجدة 5 للأعلى ⬆️، نرفع المكمل سفلياً بالإبهام ⬆️، ونطير للعملاق 10 في العشرات ⬆️! | Double Throne Magic 👑: When lower beads aren't enough to subtract 10's friend, lift Grandma 5 up ⬆️, raise the remaining lower beads with thumb ⬆️, and soar to Giant 10 in tens ⬆️!",
        cases: [
          { from: 6, formula: "+6 = −5 + 1 + 10" },
          { from: 7, formula: "+7 = −5 + 2 + 10" },
          { from: 8, formula: "+8 = −5 + 3 + 10" },
          { from: 9, formula: "+9 = −5 + 4 + 10" },
        ],
      },
      condition: {
        formula: "c + n > 9  ·  العلوية 5 مفعّلة  ·  l < k",
        explanation: "المجموع أكبر من 9، والخرزات السفلية المفعّلة لا تكفي لخصم صديق 10 مباشرة، فنستعين بالجدة 5 والعملاق 10 معا! | Sum > 9, active lower beads can't subtract 10's friend directly, so we combine Grandma 5 & Giant 10!",
      },
      discrimination: {
        steps: [
          {
            question: "هل مجموع الخانة يتجاوز 9؟ | Does the column sum exceed 9?",
            type: "yes-no",
            answer: "نعم (نحتاج عمود العشرات) | Yes (We need the tens rod)",
          },
          {
            question: "هل الخرزة 5 مفعّلة في الآحاد ولا تكفي السفليات لخصم الصديق؟ | Is bead 5 active and lower beads insufficient to subtract friend?",
            type: "yes-no",
            answer: "نعم (لا يمكن الخصم المباشر!) | Yes (Direct subtraction impossible!)",
          },
        ],
        decision: "جمع مركّب! ابعد 5 للأعلى ⬆️، ارفع المكمل سفلياً ⬆️، واصعد 10 في العشرات ⬆️! | Compound Addition! Lift 5 up ⬆️, raise remainder below ⬆️, add 10 in tens ⬆️!",
      },
      watchPhase: {
        examples: [
          {
            id: "S03-m4-E1",
            question: "5 + 6",
            discrimination: "5 مفعّلة (0 سفليات). صديق 6 لـ 10 هو 4. لا يمكن طرح 4 مباشرة من الأسفل! → جمع مركّب | 5 active (0 lower). 6's friend is 4. Cannot subtract 4 directly from lower! → Compound",
            rule: "+6 = −5 + 1 + 10",
            fingerMovement: "👆 السبابة ترفع 5 للأعلى ⬆️، 👍 الإبهام يرفع 1 سفلي ⬆️، ثم 👍 الإبهام يرفع 1 في العشرات ⬆️ | Index lifts 5 up ⬆️, thumb lifts 1 lower ⬆️, thumb lifts 1 in tens ⬆️",
            steps: [
              "تمثيل 5: ضع 5 في الآحاد | Represent 5: Set 5 in units rod",
              "ارفع الخرزة 5 بالسبابة للأعلى ⬆️ (إلغاؤها) | Lift bead 5 up with index ⬆️ (cancel it)",
              "ارفع خرزة 1 سفلية بالإبهام ⬆️ | Lift 1 lower bead with thumb ⬆️",
              "ارفع خرزة 1 في العشرات بالإبهام ⬆️ | Lift 1 bead in tens rod with thumb ⬆️",
              "الناتج الظاهر: 1 في العشرات و1 في الآحاد = 11 | Result: 1 in tens and 1 in units = 11",
            ],
            result: 11,
            beadVisual: "1 في العشرات و1 في الآحاد | 1 in tens rod and 1 in units rod",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S03-m4-T1",
            question: "5 + 7",
            discrimination: "5 مفعّلة، صديق 7 هو 3 (غير متوفر سفلياً) → مركّب (−5 + 2 + 10) | 5 active, 7's friend is 3 (not available below) → Compound (−5 + 2 + 10)",
            steps: [
              "مثّل 5 في الآحاد | Represent 5 in units",
              "ارفع 5 بالسبابة ⬆️ (إبعاد) | Lift 5 up with index ⬆️",
              "ارفع 2 بالإبهام ⬆️ | Lift 2 with thumb ⬆️",
              "ارفع 10 في العشرات بالإبهام ⬆️ | Lift 10 in tens rod with thumb ⬆️",
              "الناتج: 12 | Result: 12",
            ],
            result: 12,
          },
          {
            id: "S03-m4-T2",
            question: "7 + 6",
            discrimination: "7 = (5+2)، صديق 6 هو 4 (المتوفر سفلياً 2 فقط) → مركّب | 7 = (5+2), 6's friend is 4 (only 2 lower active) → Compound",
            steps: [
              "مثّل 7 (5 + 2 سفليات) | Represent 7 (5 + 2 lower)",
              "ارفع 5 بالسبابة ⬆️ | Lift 5 up with index ⬆️",
              "ارفع 1 بالإبهام ⬆️ | Lift 1 with thumb ⬆️",
              "ارفع 10 في العشرات بالإبهام ⬆️ | Lift 10 in tens rod with thumb ⬆️",
              "الناتج: 13 | Result: 13",
            ],
            result: 13,
          },
          {
            id: "S03-m4-T3",
            question: "6 + 8",
            discrimination: "6 = (5+1)، صديق 8 هو 2 (المتوفر سفلياً 1 فقط) → مركّب | 6 = (5+1), 8's friend is 2 (only 1 lower active) → Compound",
            steps: [
              "مثّل 6 (5 + 1 سفلي) | Represent 6 (5 + 1 lower)",
              "ارفع 5 بالسبابة ⬆️ | Lift 5 up with index ⬆️",
              "ارفع 3 بالإبهام ⬆️ | Lift 3 with thumb ⬆️",
              "ارفع 10 في العشرات بالإبهام ⬆️ | Lift 10 in tens rod with thumb ⬆️",
              "الناتج: 14 | Result: 14",
            ],
            result: 14,
          },
          {
            id: "S03-m4-T4",
            question: "7 + 7",
            discrimination: "7 = (5+2)، صديق 7 هو 3 (المتوفر سفلياً 2 فقط) → مركّب | 7 = (5+2), 7's friend is 3 (only 2 lower active) → Compound",
            steps: [
              "مثّل 7 (5 + 2 سفليات) | Represent 7 (5 + 2 lower)",
              "ارفع 5 بالسبابة ⬆️ | Lift 5 up with index ⬆️",
              "ارفع 2 بالإبهام ⬆️ | Lift 2 with thumb ⬆️",
              "ارفع 10 في العشرات بالإبهام ⬆️ | Lift 10 in tens rod with thumb ⬆️",
              "الناتج: 14 | Result: 14",
            ],
            result: 14,
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت أنواع الجمع الأربعة على السوروبان: البسيط، أصدقاء 5، أصدقاء 10، والمركّب! | You mastered all 4 addition types on Soroban: Direct, Friends of 5, Friends of 10, and Compound!",
    encouragement: "🎉 أنت بطل الجمع الخارق! حان وقت التمرّن واللعب مع الأرقام. | 🎉 You are a Super Addition Hero! Time to practice and play with numbers.",
    totalExamples: 5,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default S03_LESSON;