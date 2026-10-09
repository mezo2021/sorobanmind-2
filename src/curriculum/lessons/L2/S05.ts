// src/curriculum/lessons/L2/S05.ts
// ✖️ درس S05: الضرب (1 × 2) — منهجية تاكاشي كوجيما (مطور للأطفال - ثنائي اللغة بالكامل)
// القاعدة الذهبية: ابدأ من المنزلة الكبيرة (العشرات)، ثم انتقل للمنزلة الصغيرة (الآحاد)

import type { LessonNode } from "../types";

export const S05_LESSON: LessonNode = {
  id: "S05",
  skillId: "S05",
  levelId: "L2",
  order: 1,
  title: { ar: "الضرب", en: "Multiplication" },
  emoji: "✖️",
  tags: ["multiplication", "kids", "L2", "left-to-right", "takashi-kojima"],

  modules: [
    // =========================================================================
    // Module 1: Direct Multiplication (الضرب المباشر)
    // =========================================================================
    {
      id: "m1",
      ruleCategory: "direct",
      title: "الضرب المباشر | Direct Multiplication",
      titleEn: "Direct Multiplication",
      emoji: "✨",
      miniStory: {
        title: "حارس الحقل - التوزيع المباشر | The Field Keeper - Direct Distribution",
        emoji: "🌾",
        story: "زرع الفلاح 12 صفاً في كل صف 3 حبات. نضرب العشرات أولاً: 1×3=3 عشرات، ثم الآحاد: 2×3=6 آحاد. الخرزات متوفرة والمجموع 36 مباشرة! | The farmer planted 12 rows × 3 seeds. Multiply tens first: 1×3=3 tens, then units: 2×3=6 units. Beads are ready, result: 36!",
        storyAudioText: "زرع الفلاح اثني عشر صفاً في كل صف ثلاث حبات. اضرب العشرات أولاً: واحد في ثلاثة يساوي ثلاث عشرات. ثم الآحاد: اثنان في ثلاثة يساوي ستة. الناتج ستة وثلاثون. | The farmer planted 12 rows times 3 seeds. Multiply tens first: 1 times 3 equals 3 tens. Then units: 2 times 3 equals 6. Result is 36.",
        storyAudioId: 21,
      },
      rule: {
        description: "القاعدة الذهبية 🌾: ابدأ من المنزلة الكبيرة (العشرات)، ثم انتقل للآحاد — الخرزات متاحة، بلا أصدقاء ولا استعارة! | Golden Rule 🌾: Start big (tens), move small (units) — beads are ready, no friends or borrowing needed!",
      },
      condition: {
        formula: "الخرزات الفارغة ≥ الناتج الجزئي | Empty beads ≥ partial product",
        explanation: "كل ناتج جزئي يمكن تمثيله مباشرة في منزلته دون استعارة! | Every partial product can be set directly in its column without borrowing!",
      },
      discrimination: {
        steps: [
          {
            question: "هل الخرزات في عمود العشرات تكفي لناتج العشرات؟ | Are tens rod beads enough for the tens product?",
            type: "comparison",
            actual: "الخرزات الفارغة ≥ الناتج | Empty beads ≥ product",
            answer: "نعم → أضف مباشرة بالإبهام 👍⬆️ أو كماشة 🗜️ | Yes → Add directly with thumb 👍⬆️ or pinch 🗜️",
            hint: "افحص عمود العشرات أولاً | Check tens column first",
          },
          {
            question: "هل الخرزات في عمود الآحاد تكفي لناتج الآحاد؟ | Are units rod beads enough for the units product?",
            type: "comparison",
            actual: "الخرزات الفارغة ≥ الناتج | Empty beads ≥ product",
            answer: "نعم → أضف مباشرة بالإبهام 👍⬆️ أو كماشة 🗜️ | Yes → Add directly with thumb 👍⬆️ or pinch 🗜️",
            hint: "انتقل لعمود الآحاد ثانياً | Move to units column second",
          },
        ],
        decision: "ضرب مباشر — ابدأ من العشرات ثم الآحاد! | Direct multiplication — Start with tens then units!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m1-E1",
            question: "12 × 3",
            discrimination: "العشرات: 1×3=3 · الآحاد: 2×3=6 | Tens: 1×3=3 · Units: 2×3=6",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 3 في عشرات الناتج بالإبهام 👍⬆️ · ضع 6 في آحاد الناتج بكماشة مغلقة 🗜️ | Set 3 in tens quotient with thumb 👍⬆️ · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 خرزات في العشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 beads in tens with thumb 👍⬆️",
              "الآحاد: 2 × 3 = 6 → ضع 6 خرزات في الآحاد بكماشة مغلقة 🗜️ | Units: 2 × 3 = 6 → Pinch 6 beads in units with closed pinch 🗜️",
              "الناتج النهائي: 36 | Final Result: 36",
            ],
            result: 36,
            beadVisual: "3 عشرات + 6 آحاد = 36 | 3 tens + 6 units = 36",
          },
          {
            id: "S05-m1-E2",
            question: "13 × 2",
            discrimination: "العشرات: 1×2=2 · الآحاد: 3×2=6 | Tens: 1×2=2 · Units: 3×2=6",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 2 في عشرات الناتج بالإبهام 👍⬆️ · ضع 6 في آحاد الناتج بكماشة مغلقة 🗜️ | Set 2 in tens with thumb 👍⬆️ · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 1 × 2 = 2 → ارفع 2 خرزة في العشرات بالإبهام 👍⬆️ | Tens: 1 × 2 = 2 → Lift 2 beads in tens with thumb 👍⬆️",
              "الآحاد: 3 × 2 = 6 → ضع 6 خرزات في الآحاد بكماشة مغلقة 🗜️ | Units: 3 × 2 = 6 → Pinch 6 beads in units with closed pinch 🗜️",
              "الناتج النهائي: 26 | Final Result: 26",
            ],
            result: 26,
            beadVisual: "2 عشرات + 6 آحاد = 26 | 2 tens + 6 units = 26",
          },
          {
            id: "S05-m1-E3",
            question: "21 × 4",
            discrimination: "العشرات: 2×4=8 · الآحاد: 1×4=4 | Tens: 2×4=8 · Units: 1×4=4",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 8 في عشرات الناتج بكماشة مغلقة 🗜️ · ضع 4 في آحاد الناتج بالإبهام 👍⬆️ | Set 8 in tens with closed pinch 🗜️ · Set 4 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 2 × 4 = 8 → ضع 8 خرزات في العشرات بكماشة مغلقة 🗜️ | Tens: 2 × 4 = 8 → Pinch 8 beads in tens with closed pinch 🗜️",
              "الآحاد: 1 × 4 = 4 → ارفع 4 خرزات في الآحاد بالإبهام 👍⬆️ | Units: 1 × 4 = 4 → Lift 4 beads in units with thumb 👍⬆️",
              "الناتج النهائي: 84 | Final Result: 84",
            ],
            result: 84,
            beadVisual: "8 عشرات + 4 آحاد = 84 | 8 tens + 4 units = 84",
          },
          {
            id: "S05-m1-E4",
            question: "32 × 3",
            discrimination: "العشرات: 3×3=9 · الآحاد: 2×3=6 | Tens: 3×3=9 · Units: 2×3=6",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 9 في عشرات الناتج بكماشة مغلقة 🗜️ · ضع 6 في آحاد الناتج بكماشة مغلقة 🗜️ | Set 9 in tens with closed pinch 🗜️ · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 3 × 3 = 9 → ضع 9 خرزات في العشرات بكماشة مغلقة 🗜️ | Tens: 3 × 3 = 9 → Pinch 9 beads in tens with closed pinch 🗜️",
              "الآحاد: 2 × 3 = 6 → ضع 6 خرزات في الآحاد بكماشة مغلقة 🗜️ | Units: 2 × 3 = 6 → Pinch 6 beads in units with closed pinch 🗜️",
              "الناتج النهائي: 96 | Final Result: 96",
            ],
            result: 96,
            beadVisual: "9 عشرات + 6 آحاد = 96 | 9 tens + 6 units = 96",
          },
          {
            id: "S05-m1-E5",
            question: "41 × 2",
            discrimination: "العشرات: 4×2=8 · الآحاد: 1×2=2 | Tens: 4×2=8 · Units: 1×2=2",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 8 في عشرات الناتج بكماشة مغلقة 🗜️ · ضع 2 في آحاد الناتج بالإبهام 👍⬆️ | Set 8 in tens with closed pinch 🗜️ · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 4 × 2 = 8 → ضع 8 خرزات في العشرات بكماشة مغلقة 🗜️ | Tens: 4 × 2 = 8 → Pinch 8 beads in tens with closed pinch 🗜️",
              "الآحاد: 1 × 2 = 2 → ارفع 2 خرزة في الآحاد بالإبهام 👍⬆️ | Units: 1 × 2 = 2 → Lift 2 beads in units with thumb 👍⬆️",
              "الناتج النهائي: 82 | Final Result: 82",
            ],
            result: 82,
            beadVisual: "8 عشرات + 2 آحاد = 82 | 8 tens + 2 units = 82",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S05-m1-T1",
            question: "32 × 3",
            discrimination: "العشرات: 3×3=9 · الآحاد: 2×3=6 | Tens: 3×3=9 · Units: 2×3=6",
            steps: [
              "العشرات: 3 × 3 = 9 → ضع 9 في العشرات بكماشة مغلقة 🗜️ | Tens: 3 × 3 = 9 → Pinch 9 in tens 🗜️",
              "الآحاد: 2 × 3 = 6 → ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Units: 2 × 3 = 6 → Pinch 6 in units 🗜️",
              "الناتج النهائي: 96 | Final Result: 96",
            ],
            result: 96,
          },
          {
            id: "S05-m1-T2",
            question: "41 × 2",
            discrimination: "العشرات: 4×2=8 · الآحاد: 1×2=2 | Tens: 4×2=8 · Units: 1×2=2",
            steps: [
              "العشرات: 4 × 2 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 4 × 2 = 8 → Pinch 8 in tens 🗜️",
              "الآحاد: 1 × 2 = 2 → ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: 1 × 2 = 2 → Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 82 | Final Result: 82",
            ],
            result: 82,
          },
          {
            id: "S05-m1-T3",
            question: "21 × 4",
            discrimination: "العشرات: 2×4=8 · الآحاد: 1×4=4 | Tens: 2×4=8 · Units: 1×4=4",
            steps: [
              "العشرات: 2 × 4 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 2 × 4 = 8 → Pinch 8 in tens 🗜️",
              "الآحاد: 1 × 4 = 4 → ارفع 4 في الآحاد بالإبهام 👍⬆️ | Units: 1 × 4 = 4 → Lift 4 in units with thumb 👍⬆️",
              "الناتج النهائي: 84 | Final Result: 84",
            ],
            result: 84,
          },
          {
            id: "S05-m1-T4",
            question: "13 × 3",
            discrimination: "العشرات: 1×3=3 · الآحاد: 3×3=9 | Tens: 1×3=3 · Units: 3×3=9",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 في العشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 in tens with thumb 👍⬆️",
              "الآحاد: 3 × 3 = 9 → ضع 9 في الآحاد بكماشة مغلقة 🗜️ | Units: 3 × 3 = 9 → Pinch 9 in units 🗜️",
              "الناتج النهائي: 39 | Final Result: 39",
            ],
            result: 39,
          },
          {
            id: "S05-m1-T5",
            question: "23 × 2",
            discrimination: "العشرات: 2×2=4 · الآحاد: 3×2=6 | Tens: 2×2=4 · Units: 3×2=6",
            steps: [
              "العشرات: 2 × 2 = 4 → ارفع 4 في العشرات بالإبهام 👍⬆️ | Tens: 2 × 2 = 4 → Lift 4 in tens with thumb 👍⬆️",
              "الآحاد: 3 × 2 = 6 → ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Units: 3 × 2 = 6 → Pinch 6 in units 🗜️",
              "الناتج النهائي: 46 | Final Result: 46",
            ],
            result: 46,
          },
        ],
      },
    },

    // =========================================================================
    // Module 2: Multiplication with Friends of 5 (الضرب بأصدقاء 5)
    // =========================================================================
    {
      id: "m2",
      ruleCategory: "small_friends",
      title: "الضرب بأصدقاء 5 | Multiplication with Friends of 5",
      titleEn: "Multiplication with Friends of 5",
      emoji: "🤝",
      miniStory: {
        title: "الجدة 5 - الإنقاذ بالنزول المزدوج | Grandma 5 - Rescue with Double Drop",
        emoji: "👵",
        story: "13 × 4: العشرات 1×4=4 عشرات. ثم الآحاد 3×4=12، فنضيف 1 للعشرات (4+1=5) و2 للآحاد. الجدة 5 تقول: +1 = +5 − 4! نفذ نزول مزدوج ⬇️⬇️ بتفعيل 5 بالسبابة وطرد 4 بالإبهام لأسفل! الناتج 52. | 13×4: Tens 1×4=4 tens. Units 3×4=12 → add 1 to tens (4+1=5) & 2 to units. Grandma 5: +1 = +5 − 4! Perform Double Drop ⬇️⬇️ activating 5 with index and pushing 4 down with thumb! Result: 52.",
        storyAudioText: "ثلاثة عشر في أربعة. العشرات: واحد في أربعة يساوي أربع عشرات. الآحاد: ثلاثة في أربعة يساوي اثني عشر، فنضيف واحداً للعشرات. الجدة خمسة تقول: أضف خمسة واطرح أربعة بنزول مزدوج. الناتج اثنان وخمسون. | 13 times 4. Tens: 1 times 4 equals 4 tens. Units: 3 times 4 equals 12, add 1 to tens. Grandma 5 says: add 5 and subtract 4 with Double Drop. Result is 52.",
        storyAudioId: 22,
      },
      rule: {
        description: "أصدقاء 5 👵: عندما لا تكفي الخرزات السفلية لإضافة 1..4، تفعّل 5 بالسبابة ⬇️ وتطرد الصديق بالإبهام ⬇️ بحركة نزول مزدوج ⬇️⬇️! | Friends of 5 👵: When lower beads are insufficient for +1..4, activate 5 with index ⬇️ and push friend down with thumb ⬇️ in a Double Drop ⬇️⬇️!",
        cases: [
          { from: 1, formula: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)" },
          { from: 2, formula: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)" },
          { from: 3, formula: "+3 = +5 − 2 (صديق 3 هو 2) | +3 = +5 − 2 (3's friend is 2)" },
          { from: 4, formula: "+4 = +5 − 1 (صديق 4 هو 1) | +4 = +5 − 1 (4's friend is 1)" },
        ],
      },
      condition: {
        formula: "السفليات غير كافية · خرزة 5 متاحة | Lower beads insufficient · bead 5 available",
        explanation: "عند ازدحام الخرزات السفلية في عمود العشرات، الجدة 5 تتدخل بنزول مزدوج! | When lower beads are crowded in tens column, Grandma 5 steps in with a Double Drop!",
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
            question: "هل الخرزات السفلية غير كافية للإضافة؟ | Are lower beads insufficient for addition?",
            type: "comparison",
            actual: "السفليات < المطلوب | Lower beads < required",
            answer: "نعم → استخدم أصدقاء 5 | Yes → Use Friends of 5",
            hint: "الخرزات السفلية الممتلئة تمنع الإضافة المباشرة | Full lower beads prevent direct addition",
          },
          {
            question: "هل خرزة 5 متاحة للنزول؟ | Is bead 5 available to drop?",
            type: "yes-no",
            actual: "خرزة 5 غير مفعّلة | Bead 5 inactive",
            answer: "نعم → نفّذ نزول مزدوج ⬇️⬇️ | Yes → Perform Double Drop ⬇️⬇️",
            hint: "+n = +5 − (5−n)",
          },
        ],
        decision: "أصدقاء 5 — نزول مزدوج ⬇️⬇️: السبابة تفعّل 5 ⬇️ والإبهام يطرد الصديق ⬇️! | Friends of 5 — Double Drop ⬇️⬇️: Index activates 5 ⬇️ & thumb pushes friend down ⬇️!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m2-E1",
            question: "13 × 4",
            discrimination: "العشرات: 1×4=4 · الآحاد: 3×4=12 → +1 للعشرات | Tens: 1×4=4 · Units: 3×4=12 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "ضع 4 في العشرات بالإبهام 👍⬆️ · نزول مزدوج ⬇️⬇️ على العشرات (سبابة تفعّل 5 ⬇️ + إبهام يطرد 4 ⬇️) · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 4 in tens with thumb 👍⬆️ · Double Drop ⬇️⬇️ on tens (index activates 5 ⬇️ + thumb pushes 4 down ⬇️) · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 4 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 1 × 4 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 3 × 4 = 12 → إضافة 1 للعشرات بأصدقاء 5 (+1 = +5 − 4) بنزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 ⬇️ والإبهام يطرد 4 ⬇️) → العشرات = 5 | Units: 3 × 4 = 12 → Add 1 to tens via Friends of 5 (+1 = +5 − 4) with Double Drop ⬇️⬇️ (index activates 5 ⬇️ & thumb pushes 4 down ⬇️) → Tens = 5",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 52 | Final Result: 52",
            ],
            result: 52,
            beadVisual: "5 عشرات + 2 آحاد = 52 | 5 tens + 2 units = 52",
          },
          {
            id: "S05-m2-E2",
            question: "18 × 3",
            discrimination: "العشرات: 1×3=3 · الآحاد: 8×3=24 → +2 للعشرات | Tens: 1×3=3 · Units: 8×3=24 → +2 to tens",
            rule: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)",
            fingerMovement: "ضع 3 في العشرات بالإبهام 👍⬆️ · نزول مزدوج ⬇️⬇️ على العشرات (سبابة تفعّل 5 ⬇️ + إبهام يطرد 3 ⬇️) · ضع 4 في الآحاد بالإبهام 👍⬆️ | Set 3 in tens with thumb 👍⬆️ · Double Drop ⬇️⬇️ on tens (index activates 5 ⬇️ + thumb pushes 3 down ⬇️) · Set 4 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 عشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 tens with thumb 👍⬆️",
              "الآحاد: 8 × 3 = 24 → إضافة 2 للعشرات بأصدقاء 5 (+2 = +5 − 3) بنزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 ⬇️ والإبهام يطرد 3 ⬇️) → العشرات = 5 | Units: 8 × 3 = 24 → Add 2 to tens (+2 = +5 − 3) with Double Drop ⬇️⬇️ (index activates 5 ⬇️ & thumb pushes 3 down ⬇️) → Tens = 5",
              "الآحاد: ارفع 4 في الآحاد بالإبهام 👍⬆️ | Units: Lift 4 in units with thumb 👍⬆️",
              "الناتج النهائي: 54 | Final Result: 54",
            ],
            result: 54,
            beadVisual: "5 عشرات + 4 آحاد = 54 | 5 tens + 4 units = 54",
          },
          {
            id: "S05-m2-E3",
            question: "26 × 2",
            discrimination: "العشرات: 2×2=4 · الآحاد: 6×2=12 → +1 للعشرات | Tens: 2×2=4 · Units: 6×2=12 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "ضع 4 في العشرات بالإبهام 👍⬆️ · نزول مزدوج ⬇️⬇️ على العشرات (سبابة تفعّل 5 ⬇️ + إبهام يطرد 4 ⬇️) · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 4 in tens with thumb 👍⬆️ · Double Drop ⬇️⬇️ on tens (index activates 5 ⬇️ + thumb pushes 4 down ⬇️) · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 2 × 2 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 2 × 2 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 6 × 2 = 12 → إضافة 1 للعشرات بأصدقاء 5 (+1 = +5 − 4) بنزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 ⬇️ والإبهام يطرد 4 ⬇️) → العشرات = 5 | Units: 6 × 2 = 12 → Add 1 to tens (+1 = +5 − 4) with Double Drop ⬇️⬇️ (index activates 5 ⬇️ & thumb pushes 4 down ⬇️) → Tens = 5",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 52 | Final Result: 52",
            ],
            result: 52,
            beadVisual: "5 عشرات + 2 آحاد = 52 | 5 tens + 2 units = 52",
          },
          {
            id: "S05-m2-E4",
            question: "17 × 4",
            discrimination: "العشرات: 1×4=4 · الآحاد: 7×4=28 → +2 للعشرات | Tens: 1×4=4 · Units: 7×4=28 → +2 to tens",
            rule: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)",
            fingerMovement: "ضع 4 في العشرات بالإبهام 👍⬆️ · نزول مزدوج ⬇️⬇️ على العشرات (سبابة تفعّل 5 ⬇️ + إبهام يطرد 3 ⬇️) · ضع 8 في الآحاد بكماشة مغلقة 🗜️ | Set 4 in tens with thumb 👍⬆️ · Double Drop ⬇️⬇️ on tens (index activates 5 ⬇️ + thumb pushes 3 down ⬇️) · Set 8 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 1 × 4 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 1 × 4 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 7 × 4 = 28 → إضافة 2 للعشرات بأصدقاء 5 (+2 = +5 − 3) بنزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 ⬇️ والإبهام يطرد 3 ⬇️) → العشرات = 6 | Units: 7 × 4 = 28 → Add 2 to tens (+2 = +5 − 3) with Double Drop ⬇️⬇️ (index activates 5 ⬇️ & thumb pushes 3 down ⬇️) → Tens = 6",
              "الآحاد: ضع 8 في الآحاد بكماشة مغلقة 🗜️ | Units: Set 8 in units with closed pinch 🗜️",
              "الناتج النهائي: 68 | Final Result: 68",
            ],
            result: 68,
            beadVisual: "6 عشرات + 8 آحاد = 68 | 6 tens + 8 units = 68",
          },
          {
            id: "S05-m2-E5",
            question: "28 × 2",
            discrimination: "العشرات: 2×2=4 · الآحاد: 8×2=16 → +1 للعشرات | Tens: 2×2=4 · Units: 8×2=16 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "ضع 4 في العشرات بالإبهام 👍⬆️ · نزول مزدوج ⬇️⬇️ على العشرات (سبابة تفعّل 5 ⬇️ + إبهام يطرد 4 ⬇️) · ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Set 4 in tens with thumb 👍⬆️ · Double Drop ⬇️⬇️ on tens (index activates 5 ⬇️ + thumb pushes 4 down ⬇️) · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 2 × 2 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 2 × 2 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 8 × 2 = 16 → إضافة 1 للعشرات بأصدقاء 5 (+1 = +5 − 4) بنزول مزدوج ⬇️⬇️ (السبابة تفعّل 5 ⬇️ والإبهام يطرد 4 ⬇️) → العشرات = 5 | Units: 8 × 2 = 16 → Add 1 to tens (+1 = +5 − 4) with Double Drop ⬇️⬇️ (index activates 5 ⬇️ & thumb pushes 4 down ⬇️) → Tens = 5",
              "الآحاد: ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Units: Set 6 in units with closed pinch 🗜️",
              "الناتج النهائي: 56 | Final Result: 56",
            ],
            result: 56,
            beadVisual: "5 عشرات + 6 آحاد = 56 | 5 tens + 6 units = 56",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S05-m2-T1",
            question: "18 × 3",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 عشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 tens with thumb 👍⬆️",
              "الآحاد: 8 × 3 = 24 → إضافة 2 للعشرات بنزول مزدوج ⬇️⬇️ (+2 = +5 − 3) | Units: 8 × 3 = 24 → Add 2 to tens with Double Drop ⬇️⬇️ (+2 = +5 − 3)",
              "الآحاد: ارفع 4 بالإبهام 👍⬆️ | Units: Lift 4 with thumb 👍⬆️",
              "الناتج النهائي: 54 | Final Result: 54",
            ],
            result: 54,
          },
          {
            id: "S05-m2-T2",
            question: "14 × 4",
            discrimination: "+1 = +5 − 4 | Friends of 5: +1 = +5 − 4",
            steps: [
              "العشرات: 1 × 4 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 1 × 4 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 4 × 4 = 16 → إضافة 1 للعشرات بنزول مزدوج ⬇️⬇️ (+1 = +5 − 4) | Units: 4 × 4 = 16 → Add 1 to tens with Double Drop ⬇️⬇️ (+1 = +5 − 4)",
              "الآحاد: ضع 6 بكماشة مغلقة 🗜️ | Units: Set 6 with closed pinch 🗜️",
              "الناتج النهائي: 56 | Final Result: 56",
            ],
            result: 56,
          },
          {
            id: "S05-m2-T3",
            question: "17 × 3",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 عشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 tens with thumb 👍⬆️",
              "الآحاد: 7 × 3 = 21 → إضافة 2 للعشرات بنزول مزدوج ⬇️⬇️ (+2 = +5 − 3) | Units: 7 × 3 = 21 → Add 2 to tens with Double Drop ⬇️⬇️ (+2 = +5 − 3)",
              "الآحاد: ارفع 1 بالإبهام 👍⬆️ | Units: Lift 1 with thumb 👍⬆️",
              "الناتج النهائي: 51 | Final Result: 51",
            ],
            result: 51,
          },
          {
            id: "S05-m2-T4",
            question: "18 × 4",
            discrimination: "+3 = +5 − 2 | Friends of 5: +3 = +5 − 2",
            steps: [
              "العشرات: 1 × 4 = 4 → ارفع 4 عشرات بالإبهام 👍⬆️ | Tens: 1 × 4 = 4 → Lift 4 tens with thumb 👍⬆️",
              "الآحاد: 8 × 4 = 32 → إضافة 3 للعشرات بنزول مزدوج ⬇️⬇️ (+3 = +5 − 2) | Units: 8 × 4 = 32 → Add 3 to tens with Double Drop ⬇️⬇️ (+3 = +5 − 2)",
              "الآحاد: ارفع 2 بالإبهام 👍⬆️ | Units: Lift 2 with thumb 👍⬆️",
              "الناتج النهائي: 72 | Final Result: 72",
            ],
            result: 72,
          },
          {
            id: "S05-m2-T5",
            question: "19 × 3",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 عشرات بالإبهام 👍⬆️ | Tens: 1 × 3 = 3 → Lift 3 tens with thumb 👍⬆️",
              "الآحاد: 9 × 3 = 27 → إضافة 2 للعشرات بنزول مزدوج ⬇️⬇️ (+2 = +5 − 3) | Units: 9 × 3 = 27 → Add 2 to tens with Double Drop ⬇️⬇️ (+2 = +5 − 3)",
              "الآحاد: ضع 7 بكماشة مغلقة 🗜️ | Units: Set 7 with closed pinch 🗜️",
              "الناتج النهائي: 57 | Final Result: 57",
            ],
            result: 57,
          },
        ],
      },
    },

    // =========================================================================
    // Module 3: Multiplication with Friends of 10 (الضرب بأصدقاء 10)
    // =========================================================================
    {
      id: "m3",
      ruleCategory: "big_friends",
      title: "الضرب بأصدقاء 10 | Multiplication with Friends of 10",
      titleEn: "Multiplication with Friends of 10",
      emoji: "🌟",
      miniStory: {
        title: "العملاق 10 - القفز إلى المئات | Giant 10 - Leap to Hundreds",
        emoji: "🦶",
        story: "34 × 3: العشرات 3×3=9 عشرات. الآحاد 4×3=12: أضف 1 للعشرات (9+1=10) و2 للآحاد. 9+1=10 تسع عشرات زائد عشرة واحدة تساوي عشر عشرات، نطرح المتمّم 9 بالسبابة ⬇️ ونستبدلها بمئة واحدة بالإبهام ⬆️! الناتج 102. | 34×3: Tens 3×3=9 tens. Units 4×3=12 → add 1 to tens (9+1=10) & 2 to units. 9+1=10 tens subtract complement 9 with index ⬇️ and exchange for 1 hundred with thumb ⬆️! Result: 102.",
        storyAudioText: "أربعة وثلاثون في ثلاثة. العشرات: ثلاثة في ثلاثة يساوي تسع عشرات. الآحاد: أربعة في ثلاثة يساوي اثني عشر، فنضيف واحداً للعشرات. تسعة زائد واحد يساوي عشر عشرات، نطرح تسعة ونضيف مئة. الناتج مئة واثنان. | 34 times 3. Tens: 3 times 3 equals 9 tens. Units: 4 times 3 equals 12, add 1 to tens. 9 plus 1 equals 10 tens, subtract 9 and add 1 hundred. Result is 102.",
        storyAudioId: 23,
      },
      rule: {
        description: "أصدقاء 10 🌟: عندما يتجاوز عمود العشرات 9، اطرح المتمّم بالسبابة ⬇️ وأضف 1 لعمود المئات الأيسر بالإبهام 👍⬆️! | Friends of 10 🌟: When tens column exceeds 9, subtract complement with index ⬇️ and add 1 to left hundreds column with thumb 👍⬆️!",
        cases: [
          { from: 1, formula: "+1 = −9 + 10 (صديق 1 هو 9) | +1 = −9 + 10 (1's friend is 9)" },
          { from: 2, formula: "+2 = −8 + 10 (صديق 2 هو 8) | +2 = −8 + 10 (2's friend is 8)" },
          { from: 3, formula: "+3 = −7 + 10 (صديق 3 هو 7) | +3 = −7 + 10 (3's friend is 7)" },
          { from: 4, formula: "+4 = −6 + 10 (صديق 4 هو 6) | +4 = −6 + 10 (4's friend is 6)" },
          { from: 5, formula: "+5 = −5 + 10 (صديق 5 هو 5) | +5 = −5 + 10 (5's friend is 5)" },
          { from: 6, formula: "+6 = −4 + 10 (صديق 6 هو 4) | +6 = −4 + 10 (6's friend is 4)" },
          { from: 7, formula: "+7 = −3 + 10 (صديق 7 هو 3) | +7 = −3 + 10 (7's friend is 3)" },
          { from: 8, formula: "+8 = −2 + 10 (صديق 8 هو 2) | +8 = −2 + 10 (8's friend is 2)" },
          { from: 9, formula: "+9 = −1 + 10 (صديق 9 هو 1) | +9 = −1 + 10 (9's friend is 1)" },
        ],
      },
      condition: {
        formula: "المجموع ≥ 10 | Sum ≥ 10",
        explanation: "المجموع تجاوز 9 — اقفز لعمود المئات الأيسر! | Sum exceeds 9 — leap to the left hundreds column!",
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
            question: "هل المجموع في عمود العشرات يصل إلى 10 أو أكثر؟ | Does tens column sum reach 10 or more?",
            type: "yes-no",
            actual: "المجموع ≥ 10 | Sum ≥ 10",
            answer: "نعم → استخدم أصدقاء 10 | Yes → Use Friends of 10",
            hint: "المجموع يتجاوز سعة العمود الحالية | Sum exceeds current column capacity",
          },
          {
            question: "هل يمكن طرح المتمّم مباشرة؟ | Can we subtract complement directly?",
            type: "yes-no",
            actual: "الخرزات المفعّلة ≥ المتمّم | Active beads ≥ complement",
            answer: "نعم → اطرح المتمّم بالسبابة ⬇️ وأضف 1 للمئات بالإبهام 👍⬆️ | Yes → Subtract complement with index ⬇️ & add 1 to hundreds with thumb 👍⬆️",
            hint: "+n = −k + 10",
          },
        ],
        decision: "أصدقاء 10 — اطرح المتمّم بالسبابة واقفز 1 لعمود المئات بالإبهام! | Friends of 10 — Subtract complement with index & leap 1 bead to hundreds with thumb!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m3-E1",
            question: "34 × 3",
            discrimination: "العشرات: 3×3=9 · الآحاد: 4×3=12 → +1 للعشرات | Tens: 3×3=9 · Units: 4×3=12 → +1 to tens",
            rule: "+1 = −9 + 10 (صديق 1 هو 9) | +1 = −9 + 10 (1's friend is 9)",
            fingerMovement: "ضع 9 في العشرات بكماشة مغلقة 🗜️ · اطرح 9 من العشرات بكماشة مفتوحة (أو سبابة ⬇️) + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 9 in tens with closed pinch 🗜️ · Subtract 9 from tens with open pinch + Add 1 to hundreds with thumb 👍⬆️ · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 3 × 3 = 9 → ضع 9 في العشرات بكماشة مغلقة 🗜️ | Tens: 3 × 3 = 9 → Set 9 in tens with closed pinch 🗜️",
              "الآحاد: 4 × 3 = 12 → إضافة 1 للعشرات بأصدقاء 10 (+1 = −9 + 10): اطرح 9 من العشرات بكماشة مفتوحة، وأضف 1 لعمود المئات بالإبهام 👍⬆️ → العشرات = 0، المئات = 1 | Units: 4 × 3 = 12 → Add 1 to tens (+1 = −9 + 10): Subtract 9 from tens with open pinch, and add 1 to hundreds with thumb 👍⬆️ → Tens = 0, Hundreds = 1",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 0 عشرات + 2 آحاد = 102 | Final Result: 1 hundred + 0 tens + 2 units = 102",
            ],
            result: 102,
            beadVisual: "1 مئة + 0 عشرات + 2 آحاد = 102 | 1 hundred + 0 tens + 2 units = 102",
          },
          {
            id: "S05-m3-E2",
            question: "39 × 3",
            discrimination: "العشرات: 3×3=9 · الآحاد: 9×3=27 → +2 للعشرات | Tens: 3×3=9 · Units: 9×3=27 → +2 to tens",
            rule: "+2 = −8 + 10 (صديق 2 هو 8) | +2 = −8 + 10 (2's friend is 8)",
            fingerMovement: "ضع 9 في العشرات بكماشة مغلقة 🗜️ · اطرح 8 من العشرات بكماشة مفتوحة + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 7 في الآحاد بكماشة مغلقة 🗜️ | Set 9 in tens with closed pinch 🗜️ · Subtract 8 from tens with open pinch + Add 1 to hundreds with thumb 👍⬆️ · Set 7 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 3 × 3 = 9 → ضع 9 في العشرات بكماشة مغلقة 🗜️ | Tens: 3 × 3 = 9 → Set 9 in tens with closed pinch 🗜️",
              "الآحاد: 9 × 3 = 27 → إضافة 2 للعشرات بأصدقاء 10 (+2 = −8 + 10): اطرح 8 من العشرات بكماشة مفتوحة، وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 1، المئات = 1 | Units: 9 × 3 = 27 → Add 2 to tens (+2 = −8 + 10): Subtract 8 from tens with open pinch, and add 1 to hundreds with thumb 👍⬆️ → Tens = 1, Hundreds = 1",
              "الآحاد: ضع 7 في الآحاد بكماشة مغلقة 🗜️ | Units: Set 7 in units with closed pinch 🗜️",
              "الناتج النهائي: 1 مئة + 1 عشرات + 7 آحاد = 117 | Final Result: 1 hundred + 1 tens + 7 units = 117",
            ],
            result: 117,
            beadVisual: "1 مئة + 1 عشرات + 7 آحاد = 117 | 1 hundred + 1 tens + 7 units = 117",
          },
          {
            id: "S05-m3-E3",
            question: "28 × 4",
            discrimination: "العشرات: 2×4=8 · الآحاد: 8×4=32 → +3 للعشرات | Tens: 2×4=8 · Units: 8×4=32 → +3 to tens",
            rule: "+3 = −7 + 10 (صديق 3 هو 7) | +3 = −7 + 10 (3's friend is 7)",
            fingerMovement: "ضع 8 في العشرات بكماشة مغلقة 🗜️ · اطرح 7 من العشرات بكماشة مفتوحة + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 8 in tens with closed pinch 🗜️ · Subtract 7 from tens with open pinch + Add 1 to hundreds with thumb 👍⬆️ · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 2 × 4 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 2 × 4 = 8 → Set 8 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 4 = 32 → إضافة 3 للعشرات بأصدقاء 10 (+3 = −7 + 10): اطرح 7 من العشرات بكماشة مفتوحة، وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 1، المئات = 1 | Units: 8 × 4 = 32 → Add 3 to tens (+3 = −7 + 10): Subtract 7 from tens with open pinch, and add 1 to hundreds with thumb 👍⬆️ → Tens = 1, Hundreds = 1",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 1 عشرات + 2 آحاد = 112 | Final Result: 1 hundred + 1 tens + 2 units = 112",
            ],
            result: 112,
            beadVisual: "1 مئة + 1 عشرات + 2 آحاد = 112 | 1 hundred + 1 tens + 2 units = 112",
          },
          {
            id: "S05-m3-E4",
            question: "17 × 6",
            discrimination: "العشرات: 1×6=6 · الآحاد: 7×6=42 → +4 للعشرات | Tens: 1×6=6 · Units: 7×6=42 → +4 to tens",
            rule: "+4 = −6 + 10 (صديق 4 هو 6) | +4 = −6 + 10 (4's friend is 6)",
            fingerMovement: "ضع 6 في العشرات بكماشة مغلقة 🗜️ · اطرح 6 من العشرات بكماشة مفتوحة + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 6 in tens with closed pinch 🗜️ · Subtract 6 from tens with open pinch + Add 1 to hundreds with thumb 👍⬆️ · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 6 = 6 → ضع 6 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 6 = 6 → Set 6 in tens with closed pinch 🗜️",
              "الآحاد: 7 × 6 = 42 → إضافة 4 للعشرات بأصدقاء 10 (+4 = −6 + 10): اطرح 6 من العشرات بكماشة مفتوحة، وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 0، المئات = 1 | Units: 7 × 6 = 42 → Add 4 to tens (+4 = −6 + 10): Subtract 6 from tens with open pinch, and add 1 to hundreds with thumb 👍⬆️ → Tens = 0, Hundreds = 1",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 0 عشرات + 2 آحاد = 102 | Final Result: 1 hundred + 0 tens + 2 units = 102",
            ],
            result: 102,
            beadVisual: "1 مئة + 0 عشرات + 2 آحاد = 102 | 1 hundred + 0 tens + 2 units = 102",
          },
          {
            id: "S05-m3-E5",
            question: "16 × 7",
            discrimination: "العشرات: 1×7=7 · الآحاد: 6×7=42 → +4 للعشرات | Tens: 1×7=7 · Units: 6×7=42 → +4 to tens",
            rule: "+4 = −6 + 10 (صديق 4 هو 6) | +4 = −6 + 10 (4's friend is 6)",
            fingerMovement: "ضع 7 في العشرات بكماشة مغلقة 🗜️ · اطرح 6 من العشرات بكماشة مفتوحة + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 2 في الآحاد بالإبهام 👍⬆️ | Set 7 in tens with closed pinch 🗜️ · Subtract 6 from tens with open pinch + Add 1 to hundreds with thumb 👍⬆️ · Set 2 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 7 = 7 → ضع 7 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 7 = 7 → Set 7 in tens with closed pinch 🗜️",
              "الآحاد: 6 × 7 = 42 → إضافة 4 للعشرات بأصدقاء 10 (+4 = −6 + 10): اطرح 6 من العشرات بكماشة مفتوحة، وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 1، المئات = 1 | Units: 6 × 7 = 42 → Add 4 to tens (+4 = −6 + 10): Subtract 6 from tens with open pinch, and add 1 to hundreds with thumb 👍⬆️ → Tens = 1, Hundreds = 1",
              "الآحاد: ارفع 2 في الآحاد بالإبهام 👍⬆️ | Units: Lift 2 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 1 عشرات + 2 آحاد = 112 | Final Result: 1 hundred + 1 tens + 2 units = 112",
            ],
            result: 112,
            beadVisual: "1 مئة + 1 عشرات + 2 آحاد = 112 | 1 hundred + 1 tens + 2 units = 112",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S05-m3-T1",
            question: "17 × 6",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "العشرات: 1 × 6 = 6 → ضع 6 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 6 = 6 → Set 6 in tens with closed pinch 🗜️",
              "الآحاد: 7 × 6 = 42 → إضافة 4 للعشرات (+4 = −6 + 10): اطرح 6 بكماشة مفتوحة وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 7 × 6 = 42 → Add 4 to tens (+4 = −6 + 10): Subtract 6 with open pinch & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ارفع 2 بالإبهام 👍⬆️ | Units: Lift 2 with thumb 👍⬆️",
              "الناتج النهائي: 102 | Final Result: 102",
            ],
            result: 102,
          },
          {
            id: "S05-m3-T2",
            question: "18 × 7",
            discrimination: "+5 = −5 + 10 | Friends of 10: +5 = −5 + 10",
            steps: [
              "العشرات: 1 × 7 = 7 → ضع 7 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 7 = 7 → Set 7 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 7 = 56 → إضافة 5 للعشرات (+5 = −5 + 10): ارفع 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 8 × 7 = 56 → Add 5 to tens (+5 = −5 + 10): Lift 5 with index ⬆️ & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ضع 6 بكماشة مغلقة 🗜️ | Units: Set 6 with closed pinch 🗜️",
              "الناتج النهائي: 126 | Final Result: 126",
            ],
            result: 126,
          },
          {
            id: "S05-m3-T3",
            question: "15 × 8",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "العشرات: 1 × 8 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 8 = 8 → Set 8 in tens with closed pinch 🗜️",
              "الآحاد: 5 × 8 = 40 → إضافة 4 للعشرات (+4 = −6 + 10): اطرح 6 بكماشة مفتوحة وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 5 × 8 = 40 → Add 4 to tens (+4 = −6 + 10): Subtract 6 with open pinch & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: 0 | Units: 0",
              "الناتج النهائي: 120 | Final Result: 120",
            ],
            result: 120,
          },
          {
            id: "S05-m3-T4",
            question: "14 × 9",
            discrimination: "+3 = −7 + 10 | Friends of 10: +3 = −7 + 10",
            steps: [
              "العشرات: 1 × 9 = 9 → ضع 9 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 9 = 9 → Set 9 in tens with closed pinch 🗜️",
              "الآحاد: 4 × 9 = 36 → إضافة 3 للعشرات (+3 = −7 + 10): اطرح 7 بكماشة مفتوحة وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 4 × 9 = 36 → Add 3 to tens (+3 = −7 + 10): Subtract 7 with open pinch & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ضع 6 بكماشة مغلقة 🗜️ | Units: Set 6 with closed pinch 🗜️",
              "الناتج النهائي: 126 | Final Result: 126",
            ],
            result: 126,
          },
          {
            id: "S05-m3-T5",
            question: "18 × 6",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "العشرات: 1 × 6 = 6 → ضع 6 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 6 = 6 → Set 6 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 6 = 48 → إضافة 4 للعشرات (+4 = −6 + 10): اطرح 6 بكماشة مفتوحة وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 8 × 6 = 48 → Add 4 to tens (+4 = −6 + 10): Subtract 6 with open pinch & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ضع 8 بكماشة مغلقة 🗜️ | Units: Set 8 with closed pinch 🗜️",
              "الناتج النهائي: 108 | Final Result: 108",
            ],
            result: 108,
          },
        ],
      },
    },

    // =========================================================================
    // Module 4: Compound Multiplication (الضرب المركّب)
    // =========================================================================
    {
      id: "m4",
      ruleCategory: "combined",
      title: "الضرب المركّب | Compound Multiplication",
      titleEn: "Compound Multiplication",
      emoji: "🎯",
      miniStory: {
        title: "التحالف المزدوج - رفع مزدوج وقفزة للمئات | Double Alliance - Double Lift & Leap to Hundreds",
        emoji: "👑",
        story: "18 × 8: العشرات 1×8=8 عشرات. الآحاد 8×8=64، فنضيف 6 للعشرات (8+6=14). الجدة 5 والعملاق 10 يتعاونان: +6 = −5 + 1 + 10! نفذ «رفع مزدوج» ⬆️⬆️ على العشرات (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) ثم ارفع 1 في المئات بالإبهام ⬆️! الناتج 144. | 18×8: Tens 1×8=8 tens. Units 8×8=64 → +6 to tens (8+6=14). Grandma 5 & Giant 10 ally: +6 = −5 + 1 + 10! Perform Double Lift ⬆️⬆️ on tens (cancel 5 with index ⬆️ & add 1 with thumb ⬆️) then lift 1 in hundreds with thumb ⬆️! Result: 144.",
        storyAudioText: "ثمانية عشر في ثمانية. العشرات: واحد في ثمانية يساوي ثماني عشرات. الآحاد: ثمانية في ثمانية يساوي أربعة وستين، فنضيف ستة للعشرات. ثمانية زائد ستة يساوي أربعة عشر. الجدة خمسة والعملاق عشرة يتعاونان: إلغاء خمسة بالسبابة وإضافة واحد بالإبهام بحركة رفع مزدوج، ونضيف مئة. الناتج مئة وأربعة وأربعون. | 18 times 8. Tens: 1 times 8 equals 8 tens. Units: 8 times 8 equals 64, add 6 to tens. 8 plus 6 equals 14. Grandma 5 and Giant 10 cooperate: cancel 5 with index and add 1 with thumb via Double Lift, and add 1 hundred. Result is 144.",
        storyAudioId: 24,
      },
      rule: {
        description: "التحالف المزدوج 👑: عندما تكون 5 مفعّلة والسفليات لا تكفي لطرح المتمّم، نفّذ رفع مزدوج ⬆️⬆️ على العشرات (إلغاء 5 بالسبابة ⬆️ وإضافة المكمل بالإبهام ⬆️)، ثم أضف 1 لعمود المئات بالإبهام 👍⬆️! | Double Alliance 👑: When 5 is active and lower beads are insufficient to subtract complement, perform Double Lift ⬆️⬆️ on tens (cancel 5 with index ⬆️ & add remainder with thumb ⬆️), then add 1 to hundreds with thumb 👍⬆️!",
        cases: [
          { from: 5, formula: "+5 = −5 + 10 (إلغاء 5 بالسبابة ⬆️ والقفز بـ 10 للمئات بالإبهام ⬆️) | +5 = −5 + 10 (Cancel 5 with index ⬆️ and leap 10 to hundreds with thumb ⬆️)" },
          { from: 6, formula: "+6 = −5 + 1 + 10 (رفع مزدوج ⬆️⬆️: إلغاء 5 + إضافة 1، ثم +10 للمئات) | +6 = −5 + 1 + 10 (Double Lift ⬆️⬆️: cancel 5 + add 1, then +10 to hundreds)" },
          { from: 7, formula: "+7 = −5 + 2 + 10 (رفع مزدوج ⬆️⬆️: إلغاء 5 + إضافة 2، ثم +10 للمئات) | +7 = −5 + 2 + 10 (Double Lift ⬆️⬆️: cancel 5 + add 2, then +10 to hundreds)" },
          { from: 8, formula: "+8 = −5 + 3 + 10 (رفع مزدوج ⬆️⬆️: إلغاء 5 + إضافة 3، ثم +10 للمئات) | +8 = −5 + 3 + 10 (Double Lift ⬆️⬆️: cancel 5 + add 3, then +10 to hundreds)" },
          { from: 9, formula: "+9 = −5 + 4 + 10 (رفع مزدوج ⬆️⬆️: إلغاء 5 + إضافة 4، ثم +10 للمئات) | +9 = −5 + 4 + 10 (Double Lift ⬆️⬆️: cancel 5 + add 4, then +10 to hundreds)" },
        ],
      },
      condition: {
        formula: "المجموع ≥ 10 · خرزة 5 مفعّلة · السفليات < المتمّم | Sum ≥ 10 · bead 5 active · lower beads < complement",
        explanation: "الجدة 5 والعملاق 10 يتعاونان معاً: رفع مزدوج على العشرات وقفزة إبهام للمئات! | Grandma 5 and Giant 10 team up: Double Lift on tens and thumb leap to hundreds!",
      },
      discrimination: {
        steps: [
          {
            question: "هل المجموع يصل إلى 10 أو أكثر (نحتاج ترحيل للمئات)؟ | Does sum reach 10 or more (need carrying to hundreds)?",
            type: "yes-no",
            actual: "المجموع ≥ 10 | Sum ≥ 10",
            answer: "نعم → نحتاج ترحيل للمئات | Yes → Need carrying to hundreds",
            hint: "المجموع يتجاوز سعة العمود الحالية | Sum exceeds current column capacity",
          },
          {
            question: "هل الخرزات السفلية < المتمّم المطلوب؟ | Are lower beads < required complement?",
            type: "yes-no",
            actual: "السفليات < المتمّم | Lower beads < complement",
            answer: "نعم → استخدم التحالف المزدوج: رفع مزدوج ⬆️⬆️ +10 للمئات | Yes → Use Dual Alliance: Double Lift ⬆️⬆️ +10 to hundreds",
            hint: "إلغاء 5 بالسبابة ⬆️ + إضافة المكمّل بالإبهام ⬆️ + إضافة 1 للمئات ⬆️",
          },
        ],
        decision: "ضرب مركّب! رفع مزدوج ⬆️⬆️ على العشرات وإضافة 1 لعمود المئات بالإبهام ⬆️! | Compound multiplication! Double Lift ⬆️⬆️ on tens & add 1 to hundreds with thumb ⬆️!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m4-E1",
            question: "19 × 6",
            discrimination: "العشرات: 1×6=6 · الآحاد: 9×6=54 → +5 للعشرات (6+5=11) | Tens: 1×6=6 · Units: 9×6=54 → +5 to tens (6+5=11)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "ضع 6 في العشرات بكماشة مغلقة 🗜️ · إلغاء 5 من العشرات بالسبابة ⬆️ + إضافة 1 للمئات بالإبهام 👍⬆️ · ضع 4 في الآحاد بالإبهام 👍⬆️ | Set 6 in tens with closed pinch 🗜️ · Cancel 5 from tens with index ⬆️ + Add 1 to hundreds with thumb 👍⬆️ · Set 4 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 6 = 6 → ضع 6 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 6 = 6 → Set 6 in tens with closed pinch 🗜️",
              "الآحاد: 9 × 6 = 54 → إضافة 5 للعشرات (6+5=11): ارفع الخرزة الخماسية بالسبابة ⬆️ (إلغاء 5) وأضف 1 لعمود المئات بالإبهام 👍⬆️ → العشرات = 1، المئات = 1 | Units: 9 × 6 = 54 → Add 5 to tens (6+5=11): Lift upper bead 5 with index ⬆️ & add 1 to hundreds with thumb 👍⬆️ → Tens = 1, Hundreds = 1",
              "الآحاد: ارفع 4 في الآحاد بالإبهام 👍⬆️ | Units: Lift 4 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 1 عشرات + 4 آحاد = 114 | Final Result: 1 hundred + 1 tens + 4 units = 114",
            ],
            result: 114,
            beadVisual: "1 مئة + 1 عشرات + 4 آحاد = 114 | 1 hundred + 1 tens + 4 units = 114",
          },
          {
            id: "S05-m4-E2",
            question: "18 × 7",
            discrimination: "العشرات: 1×7=7 · الآحاد: 8×7=56 → +5 للعشرات (7+5=12) | Tens: 1×7=7 · Units: 8×7=56 → +5 to tens (7+5=12)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "ضع 7 في العشرات بكماشة مغلقة 🗜️ · إلغاء 5 من العشرات بالسبابة ⬆️ + إضافة 1 للمئات بالإبهام 👍⬆️ · ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Set 7 in tens with closed pinch 🗜️ · Cancel 5 from tens with index ⬆️ + Add 1 to hundreds with thumb 👍⬆️ · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 1 × 7 = 7 → ضع 7 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 7 = 7 → Set 7 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 7 = 56 → إضافة 5 للعشرات (7+5=12): ارفع 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 2، المئات = 1 | Units: 8 × 7 = 56 → Add 5 to tens (7+5=12): Lift 5 with index ⬆️ & add 1 to hundreds with thumb 👍⬆️ → Tens = 2, Hundreds = 1",
              "الآحاد: ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Units: Set 6 in units with closed pinch 🗜️",
              "الناتج النهائي: 1 مئة + 2 عشرات + 6 آحاد = 126 | Final Result: 1 hundred + 2 tens + 6 units = 126",
            ],
            result: 126,
            beadVisual: "1 مئة + 2 عشرات + 6 آحاد = 126 | 1 hundred + 2 tens + 6 units = 126",
          },
          {
            id: "S05-m4-E3",
            question: "17 × 8",
            discrimination: "العشرات: 1×8=8 · الآحاد: 7×8=56 → +5 للعشرات (8+5=13) | Tens: 1×8=8 · Units: 7×8=56 → +5 to tens (8+5=13)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "ضع 8 في العشرات بكماشة مغلقة 🗜️ · إلغاء 5 من العشرات بالسبابة ⬆️ + إضافة 1 للمئات بالإبهام 👍⬆️ · ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Set 8 in tens with closed pinch 🗜️ · Cancel 5 from tens with index ⬆️ + Add 1 to hundreds with thumb 👍⬆️ · Set 6 in units with closed pinch 🗜️",
            steps: [
              "العشرات: 1 × 8 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 8 = 8 → Set 8 in tens with closed pinch 🗜️",
              "الآحاد: 7 × 8 = 56 → إضافة 5 للعشرات (8+5=13): ارفع 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 3، المئات = 1 | Units: 7 × 8 = 56 → Add 5 to tens (8+5=13): Lift 5 with index ⬆️ & add 1 to hundreds with thumb 👍⬆️ → Tens = 3, Hundreds = 1",
              "الآحاد: ضع 6 في الآحاد بكماشة مغلقة 🗜️ | Units: Set 6 in units with closed pinch 🗜️",
              "الناتج النهائي: 1 مئة + 3 عشرات + 6 آحاد = 136 | Final Result: 1 hundred + 3 tens + 6 units = 136",
            ],
            result: 136,
            beadVisual: "1 مئة + 3 عشرات + 6 آحاد = 136 | 1 hundred + 3 tens + 6 units = 136",
          },
          {
            id: "S05-m4-E4",
            question: "16 × 9",
            discrimination: "العشرات: 1×9=9 · الآحاد: 6×9=54 → +5 للعشرات (9+5=14) | Tens: 1×9=9 · Units: 6×9=54 → +5 to tens (9+5=14)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "ضع 9 في العشرات بكماشة مغلقة 🗜️ · إلغاء 5 من العشرات بالسبابة ⬆️ + إضافة 1 للمئات بالإبهام 👍⬆️ · ضع 4 في الآحاد بالإبهام 👍⬆️ | Set 9 in tens with closed pinch 🗜️ · Cancel 5 from tens with index ⬆️ + Add 1 to hundreds with thumb 👍⬆️ · Set 4 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 9 = 9 → ضع 9 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 9 = 9 → Set 9 in tens with closed pinch 🗜️",
              "الآحاد: 6 × 9 = 54 → إضافة 5 للعشرات (9+5=14): ارفع 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام 👍⬆️ → العشرات = 4، المئات = 1 | Units: 6 × 9 = 54 → Add 5 to tens (9+5=14): Lift 5 with index ⬆️ & add 1 to hundreds with thumb 👍⬆️ → Tens = 4, Hundreds = 1",
              "الآحاد: ارفع 4 في الآحاد بالإبهام 👍⬆️ | Units: Lift 4 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 4 عشرات + 4 آحاد = 144 | Final Result: 1 hundred + 4 tens + 4 units = 144",
            ],
            result: 144,
            beadVisual: "1 مئة + 4 عشرات + 4 آحاد = 144 | 1 hundred + 4 tens + 4 units = 144",
          },
          {
            id: "S05-m4-E5",
            question: "18 × 8",
            discrimination: "العشرات: 1×8=8 · الآحاد: 8×8=64 → +6 للعشرات (8+6=14) | Tens: 1×8=8 · Units: 8×8=64 → +6 to tens (8+6=14)",
            rule: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            fingerMovement: "ضع 8 في العشرات بكماشة مغلقة 🗜️ · رفع مزدوج ⬆️⬆️ على العشرات (سبابة ترفع 5 ⬆️ + إبهام يرفع 1 ⬆️) + أضف 1 للمئات بالإبهام 👍⬆️ · ضع 4 في الآحاد بالإبهام 👍⬆️ | Set 8 in tens with closed pinch 🗜️ · Double Lift ⬆️⬆️ on tens (index lifts 5 ⬆️ + thumb lifts 1 ⬆️) + Add 1 to hundreds with thumb 👍⬆️ · Set 4 in units with thumb 👍⬆️",
            steps: [
              "العشرات: 1 × 8 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 8 = 8 → Set 8 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 8 = 64 → إضافة 6 للعشرات (8+6=14): «رفع مزدوج» ⬆️⬆️ على العشرات (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) ثم إضافة 1 لعمود المئات بالإبهام 👍⬆️ → العشرات = 4، المئات = 1 | Units: 8 × 8 = 64 → Add 6 to tens (8+6=14): «Double Lift» ⬆️⬆️ on tens (cancel 5 with index ⬆️ & add 1 with thumb ⬆️) then add 1 to hundreds with thumb 👍⬆️ → Tens = 4, Hundreds = 1",
              "الآحاد: ارفع 4 في الآحاد بالإبهام 👍⬆️ | Units: Lift 4 in units with thumb 👍⬆️",
              "الناتج النهائي: 1 مئة + 4 عشرات + 4 آحاد = 144 | Final Result: 1 hundred + 4 tens + 4 units = 144",
            ],
            result: 144,
            beadVisual: "1 مئة + 4 عشرات + 4 آحاد = 144 | 1 hundred + 4 tens + 4 units = 144",
          },
        ],
      },
      tryPhase: {
        exercises: [
          {
            id: "S05-m4-T1",
            question: "18 × 8",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "العشرات: 1 × 8 = 8 → ضع 8 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 8 = 8 → Set 8 in tens with closed pinch 🗜️",
              "الآحاد: 8 × 8 = 64 → إضافة 6 للعشرات برفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 8 × 8 = 64 → Add 6 to tens with Double Lift ⬆️⬆️ (cancel 5 with index ⬆️ & add 1 with thumb ⬆️) & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ارفع 4 بالإبهام 👍⬆️ | Units: Lift 4 with thumb 👍⬆️",
              "الناتج النهائي: 144 | Final Result: 144",
            ],
            result: 144,
          },
          {
            id: "S05-m4-T2",
            question: "28 × 8",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "العشرات: 2 × 8 = 16 → ضع 1 مئة بالإبهام 👍⬆️ و6 عشرات بكماشة مغلقة 🗜️ | Tens: 2 × 8 = 16 → Set 1 hundred with thumb 👍⬆️ & 6 tens with closed pinch 🗜️",
              "الآحاد: 8 × 8 = 64 → إضافة 6 للعشرات (6+6=12) برفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) وأضف 1 للمئات بالإبهام 👍⬆️ (المئات = 2) | Units: 8 × 8 = 64 → Add 6 to tens with Double Lift ⬆️⬆️ (cancel 5 & add 1) & add 1 to hundreds with thumb 👍⬆️ (Hundreds = 2)",
              "الآحاد: ارفع 4 بالإبهام 👍⬆️ | Units: Lift 4 with thumb 👍⬆️",
              "الناتج النهائي: 224 | Final Result: 224",
            ],
            result: 224,
          },
          {
            id: "S05-m4-T3",
            question: "29 × 8",
            discrimination: "+7 = −5 + 2 + 10 | Compound: +7 = −5 + 2 + 10",
            steps: [
              "العشرات: 2 × 8 = 16 → ضع 1 مئة بالإبهام 👍⬆️ و6 عشرات بكماشة مغلقة 🗜️ | Tens: 2 × 8 = 16 → Set 1 hundred with thumb 👍⬆️ & 6 tens with closed pinch 🗜️",
              "الآحاد: 9 × 8 = 72 → إضافة 7 للعشرات (6+7=13) برفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة ⬆️ وإضافة 2 بالإبهام ⬆️) وأضف 1 للمئات بالإبهام 👍⬆️ (المئات = 2) | Units: 9 × 8 = 72 → Add 7 to tens with Double Lift ⬆️⬆️ (cancel 5 & add 2) & add 1 to hundreds with thumb 👍⬆️ (Hundreds = 2)",
              "الآحاد: ارفع 2 بالإبهام 👍⬆️ | Units: Lift 2 with thumb 👍⬆️",
              "الناتج النهائي: 232 | Final Result: 232",
            ],
            result: 232,
          },
          {
            id: "S05-m4-T4",
            question: "27 × 9",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "العشرات: 2 × 9 = 18 → ضع 1 مئة بالإبهام 👍⬆️ و8 عشرات بكماشة مغلقة 🗜️ | Tens: 2 × 9 = 18 → Set 1 hundred with thumb 👍⬆️ & 8 tens with closed pinch 🗜️",
              "الآحاد: 7 × 9 = 63 → إضافة 6 للعشرات (8+6=14) برفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) وأضف 1 للمئات بالإبهام 👍⬆️ (المئات = 2) | Units: 7 × 9 = 63 → Add 6 to tens with Double Lift ⬆️⬆️ (cancel 5 & add 1) & add 1 to hundreds with thumb 👍⬆️ (Hundreds = 2)",
              "الآحاد: ارفع 3 بالإبهام 👍⬆️ | Units: Lift 3 with thumb 👍⬆️",
              "الناتج النهائي: 243 | Final Result: 243",
            ],
            result: 243,
          },
          {
            id: "S05-m4-T5",
            question: "19 × 7",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "العشرات: 1 × 7 = 7 → ضع 7 في العشرات بكماشة مغلقة 🗜️ | Tens: 1 × 7 = 7 → Set 7 in tens with closed pinch 🗜️",
              "الآحاد: 9 × 7 = 63 → إضافة 6 للعشرات (7+6=13) برفع مزدوج ⬆️⬆️ (إلغاء 5 بالسبابة ⬆️ وإضافة 1 بالإبهام ⬆️) وأضف 1 للمئات بالإبهام 👍⬆️ | Units: 9 × 7 = 63 → Add 6 to tens with Double Lift ⬆️⬆️ (cancel 5 & add 1) & add 1 to hundreds with thumb 👍⬆️",
              "الآحاد: ارفع 3 بالإبهام 👍⬆️ | Units: Lift 3 with thumb 👍⬆️",
              "الناتج النهائي: 133 | Final Result: 133",
            ],
            result: 133,
          },
        ],
      },
    },
  ],

  outro: {
    summary: "أتقنت الضرب بالمنهجية الصحيحة: من المنزلة الكبيرة إلى المنزلة الصغيرة! | You mastered multiplication the right way: from big place value to small place value!",
    encouragement: "🎉 أنت بطل السوروبان الخارق! | 🎉 You are a Soroban champion!",
    totalExamples: 20,
  },

  estimatedMinutes: 20,
  xpReward: 15,
};

export default S05_LESSON;
