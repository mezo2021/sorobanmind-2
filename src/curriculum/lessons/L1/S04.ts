// src/curriculum/lessons/L1/S04.ts
// ➖ درس S04: الطرح

import type { LessonNode } from "../types";

export const S04_LESSON: LessonNode = {
  id: "S04",
  skillId: "S04",
  levelId: "L1",
  order: 2,
  title: { ar: "الطرح", en: "Subtraction" },
  emoji: "➖",
  tags: ["subtraction", "kids", "L1", "direct", "small_friends", "big_friends", "combined"],

  modules: [
    {
      id: "m1",
      ruleCategory: "direct",
      title: "الطرح البسيط",
      titleEn: "Direct Subtraction",
      emoji: "✨",
      miniStory: {
        title: "القاعدة الذهبية | The Golden Rule",
        emoji: "🔑",
        story: "قال حارس القلعة: تذكّروا القاعدة الذهبية — في الجمع والطرح معًا، ابدؤوا من البيوت الكبيرة قبل الصغيرة: العشرات قبل الآحاد. هذا سرّ السرعة في السوروبان! | The castle guard said: Remember the golden rule — in addition and subtraction together, start from the big houses before the small ones: tens before units. This is the secret of speed in Soroban!",
        storyAudioText: "قَالَ حَارِسُ القَلْعَة: تَذَكَّرُوا القَاعِدَةَ الذَّهَبِيَّة — فِي الجَمْعِ وَالطَّرْحِ مَعاً، ابْدَؤُوا مِنَ البُيُوتِ الكَبِيرَةِ قَبْلَ الصَّغِيرَة: العَشَرَاتِ قَبْلَ الآحَاد. هَذَا سِرُّ السُّرْعَةِ فِي السُّورُوبَان!",
        storyAudioId: 3,
      },
      rule: { 
        description: "نُبعد الخرزات مباشرة عن العارضة — بلا استعارة ولا أصدقاء. | Push beads directly away from the bar — no borrowing, no friends needed.",
      },
      condition: { 
        formula: "n ≤ 4 · l ≥ n · n = 5 والعلوية مفعّلة · n > 5 والعلوية مفعّلة · l ≥ n−5 | n ≤ 4 · l ≥ n · n = 5 upper active · n > 5 upper active · l ≥ n−5", 
        explanation: "توجد خرزات مفعّلة ملامسة للعارضة تكفي لإزالة n مباشرة. | There are active beads touching the bar sufficient to remove n directly.",
      },
      discrimination: {
        steps: [
          { 
            question: "هل الخرزات المفعّلة الملامسة للعارضة تكفي لإزالة n مباشرة؟ | Are active beads touching the bar enough to remove n directly?", 
            type: "comparison", 
            actual: "l ≥ n (عند n ≤ 4) أو u=1 و l ≥ n−5 (عند n ≥ 5) | l ≥ n (when n ≤ 4) or u=1 & l ≥ n−5 (when n ≥ 5)", 
            answer: "نعم → طرح بسيط مباشر | Yes → Direct simple subtraction", 
            hint: "انظر إلى الخرزات التي تلامس العارضة فقط | Look only at beads touching the bar",
          },
          { 
            question: "هل الخرزة العلوية مفعّلة عند الحاجة لإزالة 5 أو أكثر؟ | Is upper bead active when needing to remove 5 or more?", 
            type: "yes-no", 
            actual: "العلوية 5 مفعّلة | Upper 5 active",
            answer: "نعم → نتمكن من إزالتها مباشرة | Yes → We can remove it directly", 
            hint: "الخرزة العلوية وحدها تساوي 5 | Upper bead alone equals 5",
          },
        ],
        decision: "طرح بسيط مباشر — الخرزات المطلوبة ملامسة للعارضة أمامك! | Direct simple subtraction — Required beads are touching the bar in front of you!",
      },
      watchPhase: {
        examples: [
          { 
            id: "S04-m1-E1", 
            question: "4 − 2", 
            discrimination: "4 مفعّلة سفلية، والمطلوب إزالته 2. الخرزات كافية! | 4 active lower, required to remove is 2. Beads are sufficient!", 
            rule: "لا نحتاج أصدقاء — الخرزات المطلوبة ملامسة للعارضة | No friends needed — required beads touch the bar", 
            fingerMovement: "السبابة تدفع الخرزتين السفليتين نحو الأسفل ⬇️ (بعيدًا عن العارضة) | Index pushes 2 lower beads down ⬇️ (away from the bar)", 
            steps: [
              "البداية: المعداد مصفّر | Start: Abacus cleared",
              "تمثيل 4: ارفع 4 خرزات سفلية بالإبهام ⬆️ | Represent 4: Lift 4 lower beads with thumb ⬆️",
              "طرح 2: أنزل خرزتين بالسبابة ⬇️ بعيدًا عن العارضة | Subtract 2: Push 2 down with index ⬇️ away from bar",
              "الناتج الظاهر: خرزتان تلامسان العارضة | Result: 2 beads touching the bar"
            ], 
            result: 2, 
            beadVisual: "خرزتان سفليتان تلامسان العارضة | 2 lower beads touching the bar" 
          },
          { 
            id: "S04-m1-E2", 
            question: "9 − 5", 
            discrimination: "9 مفعّلة (5 علوية + 4 سفلية). المطلوب إزالة 5 → الخرزة العلوية وحدها تكفي. | 9 active (5 upper + 4 lower). Required to remove 5 → Upper bead alone is enough.", 
            rule: "نستخدم السبابة لرفع العلوية بعيداً عن العارضة | Use index to lift upper bead away from bar", 
            fingerMovement: "السبابة ترفع الخرزة العلوية نحو الأعلى ⬆️ (بعيدًا عن العارضة) | Index lifts upper bead up ⬆️ (away from bar)", 
            steps: [
              "تمثيل 9: ضع 9 في الآحاد (5 علوية + 4 سفلية) | Represent 9: Set 9 in units (5 upper + 4 lower)", 
              "طرح 5: ارفع العلوية بالسبابة ⬆️ نحو الأعلى | Subtract 5: Lift upper bead with index ⬆️ upwards", 
              "الناتج الظاهر: 4 خرزات سفلية فقط | Result: 4 lower beads only"
            ], 
            result: 4, 
            beadVisual: "4 خرزات سفلية تلامس العارضة | 4 lower beads touching the bar" 
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S04-m1-T1", 
            question: "8 − 3", 
            discrimination: "8 = 5+3. المطلوب 3 → السفليات الثلاث تكفي مباشرة. | 8 = 5+3. Required 3 → 3 lower beads are enough directly.", 
            steps: [
              "مثّل 8 (5 + 3 سفليات) | Represent 8 (5 + 3 lower)", 
              "أنزل 3 سفليات بالسبابة ⬇️ للأسفل | Push 3 lower beads down with index ⬇️", 
              "الناتج: 5 | Result: 5"
            ], 
            result: 5 
          },
          { 
            id: "S04-m1-T2", 
            question: "9 − 8", 
            discrimination: "9 = 5+4. المطلوب 8 → ارفع 5 وأنزل 3 بحركة الكماشة المفتوحة. | 9 = 5+4. Required 8 → Lift 5 and push 3 with open pinch.", 
            steps: [
              "مثّل 9 (5 + 4 سفليات) | Represent 9 (5 + 4 lower)", 
              "🗜️↔️ الكماشة المفتوحة: ارفع العلوية 5 بالسبابة ⬆️ وأنزل 3 سفليات بالإبهام ⬇️ في نفس الوقت (يتباعدان بعيدًا عن العارضة) | Open Pinch: Lift upper 5 with index ⬆️ & push 3 lower beads with thumb ⬇️ simultaneously (moving away from bar)", 
              "الناتج: 1 | Result: 1"
            ], 
            result: 1 
          },
          { 
            id: "S04-m1-T3", 
            question: "7 − 6", 
            discrimination: "7 = 5+2. المطلوب 6 → ارفع 5 وأنزل 1 بحركة الكماشة المفتوحة. | 7 = 5+2. Required 6 → Lift 5 and push 1 with open pinch.", 
            steps: [
              "مثّل 7 (5 + 2 سفليات) | Represent 7 (5 + 2 lower)", 
              "🗜️↔️ الكماشة المفتوحة: ارفع العلوية 5 بالسبابة ⬆️ وأنزل سفليّة واحدة بالإبهام ⬇️ في نفس الوقت | Open Pinch: Lift upper 5 with index ⬆️ & push 1 lower bead with thumb ⬇️ simultaneously", 
              "الناتج: 1 | Result: 1"
            ], 
            result: 1 
          },
          { 
            id: "S04-m1-T4", 
            question: "6 − 5", 
            discrimination: "6 = 5+1. المطلوب 5 → العلوية وحدها تكفي. | 6 = 5+1. Required 5 → Upper bead alone is enough.", 
            steps: [
              "مثّل 6 (5 + 1 سفلي) | Represent 6 (5 + 1 lower)", 
              "ارفع العلوية بالسبابة ⬆️ للأعلى | Lift upper bead with index ⬆️ upwards", 
              "الناتج: 1 | Result: 1"
            ], 
            result: 1 
          },
        ],
      },
    },
    {
      id: "m2",
      ruleCategory: "small_friends",
      title: "الطرح بأصدقاء 5",
      titleEn: "Complements of 5 — Subtraction",
      emoji: "🤝",
      miniStory: {
        title: "الجدة 5 تستريح | Grandma 5 Rests",
        emoji: "👵",
        story: "قالت الجدة 5: أنا أستطيع الطرح أيضاً! عندما تريدون طرح رقم، أصعد أنا لأستريح (−5)، لكن أترك أصدقائي الأطفال يلعبون في الساحة (+ متمم الرقم). | Grandma 5 said: I can subtract too! When you want to subtract a number, I go up to rest (−5), but I leave my child friends playing in the yard (+ number's complement).",
        storyAudioText: "قَالَتِ الجَدَّةُ خَمْسَة: أَنَا أَسْتَطِيعُ الطَّرْحَ أَيْضاً! عِنْدَمَا تُرِيدُونَ طَرْحَ رَقْم، أَصْعَدُ أَنَا لِأَسْتَرِيح، لَكِنْ أَتْرُكُ أَصْدِقَائِي الأَطْفَالَ يَلْعَبُونَ فِي السَّاحَة.",
        storyAudioId: 5,
      },
      rule: {
        formula: "−n = −5 + (5 − n)",
        description: "نرفع العلوية 5 بالسبابة، ونرفع صديق n من الخرزات السفلية بالإبهام. | Lift upper 5 with index, and lift n's friend from lower beads with thumb.",
        cases: [
          { from: 1, formula: "−1 = −5 + 4" },
          { from: 2, formula: "−2 = −5 + 3" },
          { from: 3, formula: "−3 = −5 + 2" },
          { from: 4, formula: "−4 = −5 + 1" },
        ],
      },
      condition: { 
        formula: "c ≥ n · l < n · العلوية مفعّلة | c ≥ n · l < n · upper active", 
        explanation: "العدد المطلوب طرحه متوفّر ضمن القيمة، لكن السفليات المفعّلة لا تكفي — نستعين بالجدة 5. | Number to subtract is within value, but active lower beads are insufficient — we ask Grandma 5 for help.",
      },
      friendsTable: { 
        title: "أصدقاء 5 | Friends of 5", 
        pairs: [{ from: 1, to: 4 }, { from: 2, to: 3 }, { from: 3, to: 2 }, { from: 4, to: 1 }] 
      },
      discrimination: {
        steps: [
          { 
            question: "هل الخرزات السفلية المفعّلة تكفي لطرح n؟ | Are active lower beads enough to subtract n?", 
            type: "comparison", 
            actual: "l < n | l < n", 
            answer: "لا (الخرزات السفلية غير كافية) | No (lower beads insufficient)", 
            hint: "لو كانت كافية، لكان طرحًا بسيطًا | If they were enough, it would be direct subtraction" 
          },
          { 
            question: "هل الخرزة العلوية (5) مفعّلة؟ | Is upper bead (5) active?", 
            type: "yes-no", 
            actual: "العلوية 5 مفعّلة | Upper 5 active",
            answer: "نعم (ملامسة للعارضة) | Yes (touching the bar)", 
            hint: "الجدة 5 جاهزة للاستراحة — نرفعها ونُصعد أصدقائها | Grandma 5 is ready to rest — we lift her and lift her friends" 
          },
        ],
        decision: "استخدم أصدقاء 5 — ارفع الجدة 5 ⬆️ وارفع صديقها ⬆️ بحركة الرفع المزدوج للأعلى! | Use Friends of 5 — Lift Grandma 5 ⬆️ and lift her friend ⬆️ with Double Lift!",
      },
      watchPhase: {
        examples: [
          { 
            id: "S04-m2-E1", 
            question: "5 − 4", 
            discrimination: "5 مفعّلة (العلوية فقط)، لا توجد سفليات. لا يمكن طرح 4 سفليًا → نستخدم أصدقاء 5. | 5 active (upper only), no lower beads. Cannot subtract 4 below → Use Friends of 5.", 
            rule: "−4 = −5 + 1 (صديق 4 هو 1) | −4 = −5 + 1 (4's friend is 1)", 
            fingerMovement: "⬆️⬆️ الرفع المزدوج: السبابة ترفع العلوية (5) للأعلى ⬆️، والإبهام يرفع خرزة سفلية واحدة للأعلى ⬆️ — كلاهما معاً | Double Lift: Index lifts upper (5) up ⬆️, & thumb lifts 1 lower bead up ⬆️ — both together", 
            steps: [
              "تمثيل 5: أنزل الخرزة العلوية بالسبابة ⬇️ | Represent 5: Bring down upper bead with index ⬇️", 
              "طرح 4: ارفع 5 بالسبابة ⬆️ وارفع 1 سفلي بالإبهام ⬆️ بحركة واحدة نحو الأعلى | Subtract 4: Lift 5 with index ⬆️ & lift 1 lower with thumb ⬆️ in one upward motion", 
              "الناتج الظاهر: خرزة سفلية واحدة تلامس العارضة | Result: 1 lower bead touching the bar"
            ], 
            result: 1, 
            beadVisual: "خرزة سفلية واحدة | 1 lower bead" 
          },
          { 
            id: "S04-m2-E2", 
            question: "8 − 4", 
            discrimination: "8 = 5+3. المطلوب 4 → السفليات المفعّلة 3 فقط (< 4) → أصدقاء 5. | 8 = 5+3. Required 4 → Active lower beads are only 3 (< 4) → Friends of 5.", 
            rule: "−4 = −5 + 1 | −4 = −5 + 1", 
            fingerMovement: "⬆️⬆️ الرفع المزدوج: السبابة ترفع 5 للأعلى ⬆️، والإبهام يرفع 1 سفلي للأعلى ⬆️ بحركة واحدة مستمرة | Double Lift: Index lifts 5 up ⬆️, & thumb lifts 1 lower up ⬆️ in one smooth motion", 
            steps: [
              "مثّل 8 (5 + 3 سفليات) | Represent 8 (5 + 3 lower)", 
              "ارفع العلوية بالسبابة ⬆️ وارفع سفليّة واحدة بالإبهام ⬆️ للأعلى معاً | Lift upper with index ⬆️ & lift 1 lower bead with thumb ⬆️ together", 
              "الناتج الظاهر: 4 سفليات | Result: 4 lower beads"
            ], 
            result: 4, 
            beadVisual: "4 خرزات سفلية | 4 lower beads" 
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S04-m2-T1", 
            question: "7 − 3", 
            discrimination: "7 = 5+2. المطلوب 3 → السفليات 2 فقط → صديق 3 هو 2. | 7 = 5+2. Required 3 → lower 2 only → 3's friend is 2.", 
            steps: [
              "مثّل 7 (5 + 2 سفليات) | Represent 7 (5 + 2 lower)", 
              "⬆️⬆️ الرفع المزدوج: ارفع العلوية 5 بالسبابة ⬆️ وارفع 2 سفليات بالإبهام ⬆️ للأعلى معاً | Double Lift: Lift upper 5 with index ⬆️ & lift 2 lower with thumb ⬆️ together", 
              "الناتج: 4 | Result: 4"
            ], 
            result: 4 
          },
          { 
            id: "S04-m2-T2", 
            question: "6 − 2", 
            discrimination: "6 = 5+1. المطلوب 2 → السفليات 1 فقط → صديق 2 هو 3. | 6 = 5+1. Required 2 → lower 1 only → 2's friend is 3.", 
            steps: [
              "مثّل 6 (5 + 1 سفلي) | Represent 6 (5 + 1 lower)", 
              "⬆️⬆️ الرفع المزدوج: ارفع 5 بالسبابة ⬆️ وارفع 3 سفليات بالإبهام ⬆️ للأعلى معاً | Double Lift: Lift 5 with index ⬆️ & lift 3 lower with thumb ⬆️ together", 
              "الناتج: 4 | Result: 4"
            ], 
            result: 4 
          },
          { 
            id: "S04-m2-T3", 
            question: "5 − 2", 
            discrimination: "5 مفعّلة وحدها. المطلوب 2 → لا سفليات → صديق 2 هو 3. | 5 active alone. Required 2 → no lower beads → 2's friend is 3.", 
            steps: [
              "مثّل 5 (العلوية فقط) | Represent 5 (upper only)", 
              "⬆️⬆️ الرفع المزدوج: ارفع 5 بالسبابة ⬆️ وارفع 3 سفليات بالإبهام ⬆️ للأعلى معاً | Double Lift: Lift 5 with index ⬆️ & lift 3 lower with thumb ⬆️ together", 
              "الناتج: 3 | Result: 3"
            ], 
            result: 3 
          },
          { 
            id: "S04-m2-T4", 
            question: "6 − 3", 
            discrimination: "6 = 5+1. المطلوب 3 → السفليات 1 فقط → صديق 3 هو 2. | 6 = 5+1. Required 3 → lower 1 only → 3's friend is 2.", 
            steps: [
              "مثّل 6 (5 + 1 سفلي) | Represent 6 (5 + 1 lower)", 
              "⬆️⬆️ الرفع المزدوج: ارفع 5 بالسبابة ⬆️ وارفع 2 سفليات بالإبهام ⬆️ للأعلى معاً | Double Lift: Lift 5 with index ⬆️ & lift 2 lower with thumb ⬆️ together", 
              "الناتج: 3 | Result: 3"
            ], 
            result: 3 
          },
        ],
      },
    },
    {
      id: "m3",
      ruleCategory: "big_friends",
      title: "الطرح بأصدقاء 10",
      titleEn: "Complements of 10 — Subtraction",
      emoji: "🌟",
      miniStory: {
        title: "العملاق 10 يغادر | Giant 10 Leaves",
        emoji: "🦶",
        story: "قال العملاق 10: أنا أستطيع الطرح! عندما لا تكفي الآحاد، أغادر أنا (−10)، ويدخل مُكَمِّلُ الرَّقَمِ للآحاد. | Giant 10 said: I can subtract! When units are not enough, I leave (−10), and the number's complement enters the units.",
        storyAudioText: "قَالَ العِمْلَاقُ عَشَرَة: أَنَا أَسْتَطِيعُ الطَّرْح! عِنْدَمَا لَا تَكْفِي الآحَاد، أُغَادِرُ أَنَا، وَيَدْخُلُ مُكَمِّلُ الرَّقَمِ لِلْآحَاد.",
        storyAudioId: 7,
      },
      rule: {
        formula: "−n = −10 + k (حيث k = 10 − n) | −n = −10 + k (where k = 10 − n)",
        description: "نُزيل خرزة 1 من العشرات (−10)، ونُضيف k إلى الآحاد مباشرة. | Remove 1 bead from tens (−10), and add k to units directly.",
        cases: [
          { from: 1, formula: "−1 = −10 + 9" },
          { from: 2, formula: "−2 = −10 + 8" },
          { from: 3, formula: "−3 = −10 + 7" },
          { from: 4, formula: "−4 = −10 + 6" },
          { from: 5, formula: "−5 = −10 + 5" },
          { from: 6, formula: "−6 = −10 + 4" },
          { from: 7, formula: "−7 = −10 + 3" },
          { from: 8, formula: "−8 = −10 + 2" },
          { from: 9, formula: "−9 = −10 + 1" },
        ],
      },
      condition: { 
        formula: "c < n · إمكانية إضافة k مباشرة إلى c | c < n · Ability to add k directly to c", 
        explanation: "الآحاد لا تكفي للطرح، لكن إضافة k للآحاد متوفّرة مباشرة (بلا تبديل 5). | Units are insufficient for subtraction, but adding k to units is directly available (no 5 exchange).",
      },
      friendsTable: { 
        title: "أصدقاء 10 | Friends of 10", 
        pairs: [{ from: 1, to: 9 }, { from: 2, to: 8 }, { from: 3, to: 7 }, { from: 4, to: 6 }, { from: 5, to: 5 }, { from: 6, to: 4 }, { from: 7, to: 3 }, { from: 8, to: 2 }, { from: 9, to: 1 }] 
      },
      discrimination: {
        steps: [
          { 
            question: "هل قيمة الآحاد أقل من العدد المطلوب طرحه؟ | Is units value less than the number required to subtract?", 
            type: "comparison", 
            actual: "c < n | c < n", 
            answer: "نعم (الآحاد لا يكفي) | Yes (units insufficient)", 
            hint: "يجب الاستعارة من عمود العشرات | Must borrow from tens rod" 
          },
          { 
            question: "هل يمكن إضافة k مباشرة إلى الآحاد بعد الاستعارة؟ | Can k be added directly to units after borrowing?", 
            type: "yes-no", 
            actual: "الخرزات الفارغة ≥ k | Empty beads ≥ k",
            answer: "نعم (توجد خرزات فارغة كافية) | Yes (sufficient empty beads exist)", 
            hint: "لو احتاج k تبديل 5، يصبح الطرح مركّبًا | If k needed 5 exchange, subtraction becomes compound" 
          },
        ],
        decision: "استخدمْ أصدقاء 10 — أزل عشرات واحدة، وأضف k للآحاد مباشرة! | Use Friends of 10 — Remove one ten, and add k to units directly!",
      },
      watchPhase: {
        examples: [
          { 
            id: "S04-m3-E1", 
            question: "12 − 9", 
            discrimination: "الآحاد = 2، لا يكفي لـ 9. صديق 9 لـ 10 هو 1. نضيف 1 للآحاد. | Units = 2, insufficient for 9. 9's friend to 10 is 1. We add 1 to units.", 
            rule: "−9 = −10 + 1 | −9 = −10 + 1", 
            fingerMovement: "السبابة تدفع خرزة العشرات للأسفل ⬇️ (إزالة 10)، والإبهام يرفع 1 سفلي في الآحاد ⬆️ | Index pushes tens bead down ⬇️ (removing 10), & thumb lifts 1 lower in units ⬆️", 
            steps: [
              "تمثيل 12: 1 عشرات + 2 آحاد | Represent 12: 1 tens + 2 units", 
              "أزل خرزة العشرات بالسبابة ⬇️ (−10) | Remove tens bead with index ⬇️ (−10)", 
              "ارفع 1 سفلي في الآحاد بالإبهام ⬆️ | Lift 1 lower in units with thumb ⬆️", 
              "الناتج الظاهر: 3 في الآحاد | Result: 3 in units"
            ], 
            result: 3, 
            beadVisual: "3 خرزات سفلية في الآحاد | 3 lower beads in units" 
          },
          { 
            id: "S04-m3-E2", 
            question: "15 − 8", 
            discrimination: "الآحاد = 5 (العلوية مفعّلة، بلا سفليات). صديق 8 لـ 10 هو 2. السفليات الفارغة كافية. | Units = 5 (upper active, no lower). 8's friend to 10 is 2. Empty lower beads are enough.", 
            rule: "−8 = −10 + 2 | −8 = −10 + 2", 
            fingerMovement: "أزل عشرات بالسبابة ⬇️، الإبهام يرفع 2 سفلي في الآحاد ⬆️ | Remove tens with index ⬇️, thumb lifts 2 lower in units ⬆️", 
            steps: [
              "تمثيل 15: 1 عشرات + 5 آحاد | Represent 15: 1 tens + 5 units", 
              "أزل خرزة العشرات بالسبابة ⬇️ (−10) | Remove tens bead with index ⬇️ (−10)", 
              "ارفع 2 سفلي في الآحاد بالإبهام ⬆️ | Lift 2 lower in units with thumb ⬆️", 
              "الناتج الظاهر: 7 (5 علوية + 2 سفلية) | Result: 7 (5 upper + 2 lower)"
            ], 
            result: 7, 
            beadVisual: "5 علوية + 2 سفلية = 7 | 5 upper + 2 lower = 7" 
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S04-m3-T1", 
            question: "13 − 9", 
            discrimination: "13 (3 آحاد) − 9 → صديق 9 هو 1 → أضف 1 للآحاد. | 13 (3 units) − 9 → 9's friend is 1 → Add 1 to units.", 
            steps: [
              "مثّل 13 (1 عشرات + 3 آحاد) | Represent 13 (1 tens + 3 units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "ارفع 1 سفلي في الآحاد بالإبهام ⬆️ | Lift 1 lower in units with thumb ⬆️", 
              "الناتج: 4 | Result: 4"
            ], 
            result: 4 
          },
          { 
            id: "S04-m3-T2", 
            question: "15 − 9", 
            discrimination: "15 (5 آحاد، العلوية مفعّلة) − 9 → صديق 9 هو 1 → أضف 1 للآحاد. | 15 (5 units, upper active) − 9 → 9's friend is 1 → Add 1 to units.", 
            steps: [
              "مثّل 15 (1 عشرات + 5 علوية) | Represent 15 (1 tens + 5 upper)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "ارفع 1 سفلي في الآحاد بالإبهام ⬆️ | Lift 1 lower in units with thumb ⬆️", 
              "الناتج: 6 | Result: 6"
            ], 
            result: 6 
          },
          { 
            id: "S04-m3-T3", 
            question: "16 − 9", 
            discrimination: "16 = 5+1 في الآحاد. صديق 9 هو 1 → أضف 1 (توجد 3 سفليات فارغة). | 16 = 5+1 in units. 9's friend is 1 → Add 1 (3 empty lower beads exist).", 
            steps: [
              "مثّل 16 (1 عشرات + 6 في الآحاد) | Represent 16 (1 tens + 6 in units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "ارفع 1 سفلي في الآحاد بالإبهام ⬆️ | Lift 1 lower in units with thumb ⬆️", 
              "الناتج: 7 | Result: 7"
            ], 
            result: 7 
          },
          { 
            id: "S04-m3-T4", 
            question: "17 − 8", 
            discrimination: "17 = 5+2 في الآحاد. صديق 8 هو 2 → أضف 2 سفلي (متوفّرة). | 17 = 5+2 in units. 8's friend is 2 → Add 2 lower (available).", 
            steps: [
              "مثّل 17 (1 عشرات + 7 في الآحاد) | Represent 17 (1 tens + 7 in units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "ارفع 2 سفلي في الآحاد بالإبهام ⬆️ | Lift 2 lower in units with thumb ⬆️", 
              "الناتج: 9 | Result: 9"
            ], 
            result: 9 
          },
        ],
      },
    },
    {
      id: "m4",
      ruleCategory: "combined",
      title: "الطَّرْح المركّب",
      titleEn: "Compound Subtraction",
      emoji: "🎯",
      miniStory: {
        title: "العرش المزدوج | The Double Throne",
        emoji: "👑",
        story: "وَصَلَ الأَبْطَالُ إِلَى الْعَرْشِ الْمُزْدَوَجِ حَيْثُ تَلْتَقِي الْجَدَّةُ 5 مَعَ الْعِمْلَاقِ 10. فِي بَعْضِ مَسَائِلِ الطَّرْحِ الصَّعْبَةِ، يَنْسَحِبُ الْعِمْلَاقُ 10 أَوَّلًا (−10)، ثُمَّ تَتَدَخَّلُ الْجَدَّةُ 5 لِتُسَاعِدَ (+5)، ثُمَّ يَخْرُجُ (مُتَمِّمُ الْمُكَمِّلِ) مِنَ الْخَرَزَاتِ السُّفْلِيَّةِ! | Heroes reached the Double Throne where Grandma 5 meets Giant 10. In some hard subtraction problems, Giant 10 leaves first (−10), then Grandma 5 steps in to help (+5), then the (friend of the complement) comes out from the lower beads!",
storyAudioText: "وَصَلَ الأَبْطَالُ إِلَى العَرْشِ المُزْدَوَجِ حَيْثُ تَلْتَقِي الجَدَّةُ خَمْسَة مَعَ العِمْلَاقِ عَشَرَة. فِي بَعْضِ مَسَائِلِ الطَّرْحِ الصَّعْبَة، يَنْسَحِبُ العِمْلَاقُ عَشَرَة أَوَّلاً، ثُمَّ تَتَدَخَّلُ الجَدَّةُ خَمْسَة لِتُسَاعِد، ثُمَّ يَخْرُجُ مُتَمِّمُ المُكَمِّلِ مِنَ الخَرَزَاتِ السُّفْلِيَّة! | Heroes reached the Double Throne where Grandma five meets Giant ten. In some hard subtraction problems, Giant ten leaves first, then Grandma five steps in to help, then the friend of the complement comes out from the lower beads!",
        storyAudioId: 8,
      },
      rule: {
        formula: "−n = −10 + 5 − (5 − k) (حيث k = 10 − n) | −n = −10 + 5 − (5 − k) (where k = 10 − n)",
        description: "نُزيل عَشْرَة واحدة (−10)، نُنزل العلوية 5 (+5)، ثم نُزيل (5−k) من الخرزات السفلية. | Remove one ten (−10), lower upper 5 (+5), then remove (5−k) from lower beads.",
        cases: [
          { from: 6, formula: "−6 = −10 + 5 − 1" },
          { from: 7, formula: "−7 = −10 + 5 − 2" },
          { from: 8, formula: "−8 = −10 + 5 − 3" },
          { from: 9, formula: "−9 = −10 + 5 − 4" },
        ],
      },
      condition: { 
        formula: "c < n · إضافة k تتطلّب تبديل 5 · l + k > 4 | c < n · Adding k requires 5 exchange · l + k > 4", 
        explanation: "الآحاد لا يكفي، وإضافة k تحتاج تبديل 5 (كماشة) — نستعين بالجدة 5 والعملاق 10 معًا. | Units insufficient, & adding k requires 5 exchange (pinch) — we use Grandma 5 & Giant 10 together.",
      },
      discrimination: {
        steps: [
          { 
            question: "هل الآحاد لا يكفي؟ | Are units insufficient?", 
            type: "yes-no", 
            actual: "الآحاد < المطلوب | Units < Required",
            answer: "نعم (نحتاج الاستعارة من العشرات) | Yes (need borrowing from tens)" 
          },
          { 
            question: "هل إضافة k تتطلّب تبديل 5 (لأن السفليات الفارغة لا تكفي)؟ | Does adding k require 5 exchange (because empty lower beads are insufficient)?", 
            type: "comparison", 
            actual: "l + k > 4 | l + k > 4", 
            answer: "نعم → نستخدم أصدقاء 5 و10 معًا | Yes → Use Friends of 5 & 10 together", 
            hint: "لو كانت تكفي، لكان طرحًا بأصدقاء 10 فقط | If enough, it would be subtraction with Friends of 10 only" 
          },
        ],
        decision: "طرح مركّب! أزل 10 بالسبابة ⬇️، ثم أنزل 5 ⬇️ واخصم الفارق للأسفل ⬇️ بحركة النزول المزدوج! | Compound Subtraction! Remove 10 with index ⬇️, then drop 5 ⬇️ & push difference down ⬇️ with Double Drop!",
      },
      watchPhase: {
        examples: [
          {
            id: "S04-m4-E1",
            question: "14 − 9",
            discrimination: "14 (4 آحاد ممتلئة) − 9. صديق 9 هو 1. لكن l=4، و l+1=5 > 4 → لا يمكن إضافة 1 مباشرة → نستخدم تبديل 5. | 14 (4 full units) − 9. 9's friend is 1. But l=4, & l+1=5 > 4 → Cannot add 1 directly → Use 5 exchange.",
            rule: "−9 = −10 + 5 − 4 | −9 = −10 + 5 − 4",
            fingerMovement: "السبابة تُزيل عشرات ⬇️ (−10)، ثم ⬇️⬇️ النزول المزدوج: السبابة تُنزل العلوية 5 نحو العارضة ⬇️ والإبهام يُزيل 4 سفليات للأسفل ⬇️ معاً | Index removes tens ⬇️ (−10), then ⬇️⬇️ Double Drop: Index drops upper 5 toward bar ⬇️ & thumb removes 4 lower beads down ⬇️ together",
            steps: [
              "تمثيل 14: 1 عشرات + 4 آحاد | Represent 14: 1 tens + 4 units", 
              "أزل خرزة العشرات بالسبابة ⬇️ (−10) | Remove tens bead with index ⬇️ (−10)", 
              "أنزل العلوية 5 ⬇️ وأزل 4 سفليات للأسفل ⬇️ بحركة واحدة مستمرة | Drop upper 5 ⬇️ & remove 4 lower down ⬇️ in one smooth motion", 
              "الناتج الظاهر: 5 علوية فقط | Result: Upper 5 only"
            ],
            result: 5,
            beadVisual: "5 علوية (لا سفليات) = 5 | 5 upper (no lower) = 5",
          },
        ],
      },
      tryPhase: {
        exercises: [
          { 
            id: "S04-m4-T1", 
            question: "13 − 8", 
            discrimination: "13 (3 آحاد) − 8. صديق 8 هو 2. l=3، l+2=5>4 → مركّب. | 13 (3 units) − 8. 8's friend is 2. l=3, l+2=5>4 → Compound.", 
            steps: [
              "مثّل 13 (1 عشرات + 3 آحاد) | Represent 13 (1 tens + 3 units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "⬇️⬇️ النزول المزدوج: أنزل العلوية 5 ⬇️ وأزل 3 سفليات للأسفل ⬇️ بحركة واحدة | Double Drop: Drop upper 5 ⬇️ & remove 3 lower down ⬇️ in one motion", 
              "الناتج: 5 | Result: 5"
            ], 
            result: 5 
          },
          { 
            id: "S04-m4-T2", 
            question: "14 − 7", 
            discrimination: "14 (4 آحاد) − 7. صديق 7 هو 3. l=4، l+3=7>4 → مركّب. | 14 (4 units) − 7. 7's friend is 3. l=4, l+3=7>4 → Compound.", 
            steps: [
              "مثّل 14 (1 عشرات + 4 آحاد) | Represent 14 (1 tens + 4 units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "⬇️⬇️ النزول المزدوج: أنزل العلوية 5 ⬇️ وأزل 2 سفليات للأسفل ⬇️ بحركة واحدة | Double Drop: Drop upper 5 ⬇️ & remove 2 lower down ⬇️ in one motion", 
              "الناتج: 7 | Result: 7"
            ], 
            result: 7 
          },
          { 
            id: "S04-m4-T3", 
            question: "13 − 6", 
            discrimination: "13 (3 آحاد) − 6. صديق 6 هو 4. l=3، l+4=7>4 → مركّب. | 13 (3 units) − 6. 6's friend is 4. l=3, l+4=7>4 → Compound.", 
            steps: [
              "مثّل 13 (1 عشرات + 3 آحاد) | Represent 13 (1 tens + 3 units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "⬇️⬇️ النزول المزدوج: أنزل العلوية 5 ⬇️ وأزل 1 سفلي للأسفل ⬇️ بحركة واحدة | Double Drop: Drop upper 5 ⬇️ & remove 1 lower down ⬇️ in one motion", 
              "الناتج: 7 | Result: 7"
            ], 
            result: 7 
          },
          { 
            id: "S04-m4-T4", 
            question: "12 − 7", 
            discrimination: "12 (2 آحاد) − 7. صديق 7 هو 3. l=2، l+3=5>4 → مركّب. | 12 (2 units) − 7. 7's friend is 3. l=2, l+3=5>4 → Compound.", 
            steps: [
              "مثّل 12 (1 عشرات + 2 آحاد) | Represent 12 (1 tens + 2 units)", 
              "أزل عشرات بالسبابة ⬇️ (−10) | Remove tens with index ⬇️ (−10)", 
              "⬇️⬇️ النزول المزدوج: أنزل العلوية 5 ⬇️ وأزل 2 سفليات للأسفل ⬇️ بحركة واحدة | Double Drop: Drop upper 5 ⬇️ & remove 2 lower down ⬇️ in one motion", 
              "الناتج: 5 | Result: 5"
            ], 
            result: 5 
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت أنواع الطرح الأربعة! تستطيع الآن حلّ أي مسألة طرح على السوروبان: البسيط، أصدقاء 5، أصدقاء 10، والمركّب. | Mastered all 4 subtraction types! You can now solve any subtraction problem on the Soroban: Direct, Friends of 5, Friends of 10, and Compound.",
    encouragement: "🎉 أنت بطل الطرح! حان وقت التمرّن واللعب مع الأرقام. | 🎉 You are a subtraction hero! Time to practice and play with numbers.",
    totalExamples: 4,
  },

  estimatedMinutes: 15,
  xpReward: 10,
};

export default S04_LESSON;