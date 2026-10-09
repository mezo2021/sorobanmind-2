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
      title: "الضرب المباشر",
      titleEn: "Direct Multiplication",
      emoji: "✨",
      miniStory: {
        title: "حارس الحقل | The Field Keeper",
        emoji: "🌾",
        story: "زرع الفلاح 12 صفاً في كل صف 3 حبات. نضرب العشرات أولاً: 1×3=3 عشرات، ثم الآحاد: 2×3=6 آحاد. الخرزات متوفرة والمجموع 36 مباشرة! | The farmer planted 12 rows × 3 seeds. Multiply tens first: 1×3=3 tens, then units: 2×3=6 units. Beads are ready, result: 36!",
        storyAudioText: "زرع الفلاح اثني عشر صفاً في كل صف ثلاث حبات. اضرب العشرات أولاً: واحد في ثلاثة يساوي ثلاث عشرات. ثم الآحاد: اثنان في ثلاثة يساوي ستة. الناتج ستة وثلاثون.",
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
            answer: "نعم → أضف مباشرة بالإبهام ⬆️ | Yes → Add directly with thumb ⬆️",
            hint: "افحص عمود العشرات أولاً | Check tens column first",
          },
          {
            question: "هل الخرزات في عمود الآحاد تكفي لناتج الآحاد؟ | Are units rod beads enough for the units product?",
            type: "comparison",
            actual: "الخرزات الفارغة ≥ الناتج | Empty beads ≥ product",
            answer: "نعم → أضف مباشرة بالإبهام ⬆️ | Yes → Add directly with thumb ⬆️",
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
            fingerMovement: "👍 ضع 3 في العشرات ⬆️ ثم 6 في الآحاد ⬆️ | Thumb sets 3 in tens ⬆️ then 6 in units ⬆️",
            steps: [
              "العشرات: 1 × 3 = 3 → ارفع 3 خرزات في العشرات بالإبهام ⬆️ | Tens: 1 × 3 = 3 → Lift 3 beads in tens with thumb ⬆️",
              "الآحاد: 2 × 3 = 6 → ارفع 6 خرزات في الآحاد بالإبهام/السبابة ⬆️ | Units: 2 × 3 = 6 → Lift 6 beads in units with thumb/index ⬆️",
              "الناتج الظاهر: 3 عشرات + 6 آحاد = 36 | Result: 3 tens + 6 units = 36",
            ],
            result: 36,
            beadVisual: "3 عشرات + 6 آحاد = 36 | 3 tens + 6 units = 36",
          },
          {
            id: "S05-m1-E2",
            question: "13 × 2",
            discrimination: "العشرات: 1×2=2 · الآحاد: 3×2=6 | Tens: 1×2=2 · Units: 3×2=6",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 2 في العشرات ⬆️ ثم 6 في الآحاد ⬆️ | Set 2 in tens ⬆️ then 6 in units ⬆️",
            steps: [
              "العشرات: 1 × 2 = 2 → ضع 2 في العشرات بالإبهام ⬆️ | Tens: 1 × 2 = 2 → Set 2 in tens with thumb ⬆️",
              "الآحاد: 3 × 2 = 6 → ضع 6 في الآحاد ⬆️ | Units: 3 × 2 = 6 → Set 6 in units ⬆️",
              "الناتج الظاهر: 2 عشرات + 6 آحاد = 26 | Result: 2 tens + 6 units = 26",
            ],
            result: 26,
            beadVisual: "2 عشرات + 6 آحاد = 26 | 2 tens + 6 units = 26",
          },
          {
            id: "S05-m1-E3",
            question: "21 × 4",
            discrimination: "العشرات: 2×4=8 · الآحاد: 1×4=4 | Tens: 2×4=8 · Units: 1×4=4",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 8 في العشرات ⬆️ ثم 4 في الآحاد ⬆️ | Set 8 in tens ⬆️ then 4 in units ⬆️",
            steps: [
              "العشرات: 2 × 4 = 8 → ضع 8 في العشرات ⬆️ | Tens: 2 × 4 = 8 → Set 8 in tens ⬆️",
              "الآحاد: 1 × 4 = 4 → ضع 4 في الآحاد ⬆️ | Units: 1 × 4 = 4 → Set 4 in units ⬆️",
              "الناتج الظاهر: 8 عشرات + 4 آحاد = 84 | Result: 8 tens + 4 units = 84",
            ],
            result: 84,
            beadVisual: "8 عشرات + 4 آحاد = 84 | 8 tens + 4 units = 84",
          },
          {
            id: "S05-m1-E4",
            question: "32 × 3",
            discrimination: "العشرات: 3×3=9 · الآحاد: 2×3=6 | Tens: 3×3=9 · Units: 2×3=6",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 9 في العشرات ⬆️ ثم 6 في الآحاد ⬆️ | Set 9 in tens ⬆️ then 6 in units ⬆️",
            steps: [
              "العشرات: 3 × 3 = 9 → ضع 9 في العشرات ⬆️ | Tens: 3 × 3 = 9 → Set 9 in tens ⬆️",
              "الآحاد: 2 × 3 = 6 → ضع 6 في الآحاد ⬆️ | Units: 2 × 3 = 6 → Set 6 in units ⬆️",
              "الناتج الظاهر: 9 عشرات + 6 آحاد = 96 | Result: 9 tens + 6 units = 96",
            ],
            result: 96,
            beadVisual: "9 عشرات + 6 آحاد = 96 | 9 tens + 6 units = 96",
          },
          {
            id: "S05-m1-E5",
            question: "41 × 2",
            discrimination: "العشرات: 4×2=8 · الآحاد: 1×2=2 | Tens: 4×2=8 · Units: 1×2=2",
            rule: "ابدأ من العشرات ثم الآحاد | Start with tens then units",
            fingerMovement: "ضع 8 في العشرات ⬆️ ثم 2 في الآحاد ⬆️ | Set 8 in tens ⬆️ then 2 in units ⬆️",
            steps: [
              "العشرات: 4 × 2 = 8 → ضع 8 في العشرات ⬆️ | Tens: 4 × 2 = 8 → Set 8 in tens ⬆️",
              "الآحاد: 1 × 2 = 2 → ضع 2 في الآحاد ⬆️ | Units: 1 × 2 = 2 → Set 2 in units ⬆️",
              "الناتج الظاهر: 8 عشرات + 2 آحاد = 82 | Result: 8 tens + 2 units = 82",
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
            question: "3 × 32",
            discrimination: "العشرات: 3×3=9 · الآحاد: 3×2=6 | Tens: 3×3=9 · Units: 3×2=6",
            steps: [
              "3 × 3 = 9 → العشرات = 9 | 3 × 3 = 9 → Tens = 9",
              "3 × 2 = 6 → الآحاد = 6 | 3 × 2 = 6 → Units = 6",
              "الناتج: 96 | Result: 96",
            ],
            result: 96,
          },
          {
            id: "S05-m1-T2",
            question: "2 × 41",
            discrimination: "العشرات: 2×4=8 · الآحاد: 2×1=2 | Tens: 2×4=8 · Units: 2×1=2",
            steps: [
              "2 × 4 = 8 → العشرات = 8 | 2 × 4 = 8 → Tens = 8",
              "2 × 1 = 2 → الآحاد = 2 | 2 × 1 = 2 → Units = 2",
              "الناتج: 82 | Result: 82",
            ],
            result: 82,
          },
          {
            id: "S05-m1-T3",
            question: "4 × 21",
            discrimination: "العشرات: 4×2=8 · الآحاد: 4×1=4 | Tens: 4×2=8 · Units: 4×1=4",
            steps: [
              "4 × 2 = 8 → العشرات = 8 | 4 × 2 = 8 → Tens = 8",
              "4 × 1 = 4 → الآحاد = 4 | 4 × 1 = 4 → Units = 4",
              "الناتج: 84 | Result: 84",
            ],
            result: 84,
          },
          {
            id: "S05-m1-T4",
            question: "3 × 13",
            discrimination: "العشرات: 3×1=3 · الآحاد: 3×3=9 | Tens: 3×1=3 · Units: 3×3=9",
            steps: [
              "3 × 1 = 3 → العشرات = 3 | 3 × 1 = 3 → Tens = 3",
              "3 × 3 = 9 → الآحاد = 9 | 3 × 3 = 9 → Units = 9",
              "الناتج: 39 | Result: 39",
            ],
            result: 39,
          },
          {
            id: "S05-m1-T5",
            question: "2 × 23",
            discrimination: "العشرات: 2×2=4 · الآحاد: 2×3=6 | Tens: 2×2=4 · Units: 2×3=6",
            steps: [
              "2 × 2 = 4 → العشرات = 4 | 2 × 2 = 4 → Tens = 4",
              "2 × 3 = 6 → الآحاد = 6 | 2 × 3 = 6 → Units = 6",
              "الناتج: 46 | Result: 46",
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
      title: "الضرب بأصدقاء 5",
      titleEn: "Multiplication with Friends of 5",
      emoji: "🤝",
      miniStory: {
        title: "الجدة 5 | Grandma 5",
        emoji: "👵",
        story: "13 × 4: العشرات 1×4=4 عشرات. ثم الآحاد 3×4=12، فنضيف 1 للعشرات (4+1=5) و2 للآحاد. الجدة 5 تقول: +1 = +5 − 4! الناتج 52. | 13×4: Tens 1×4=4 tens. Units 3×4=12 → add 1 to tens (4+1=5) & 2 to units. Grandma 5: +1 = +5 − 4! Result: 52.",
        storyAudioText: "ثلاثة عشر في أربعة. العشرات: واحد في أربعة يساوي أربع عشرات. الآحاد: ثلاثة في أربعة يساوي اثني عشر، فنضيف واحداً للعشرات. الجدة خمسة تقول: أضف خمسة واطرح أربعة. الناتج اثنان وخمسون.",
        storyAudioId: 22,
      },
      rule: {
        description: "أصدقاء 5 👵: عندما لا تكفي الخرزات السفلية لإضافة 1..4، أضف 5 بالسبابة ⬇️ واطرد الصديق بالإبهام ⬇️! | Friends of 5 👵: When lower beads are insufficient for +1..4, add 5 with index ⬇️ and push friend down with thumb ⬇️!",
        cases: [
          { from: 1, formula: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)" },
          { from: 2, formula: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)" },
          { from: 3, formula: "+3 = +5 − 2 (صديق 3 هو 2) | +3 = +5 − 2 (3's friend is 2)" },
          { from: 4, formula: "+4 = +5 − 1 (صديق 4 هو 1) | +4 = +5 − 1 (4's friend is 1)" },
        ],
      },
      condition: {
        formula: "السفليات غير كافية · خرزة 5 متاحة | Lower beads insufficient · bead 5 available",
        explanation: "عند ازدحام الخرزات السفلية في عمود العشرات، الجدة 5 تتدخل للإنقاذ! | When lower beads are crowded in tens column, Grandma 5 steps in to help!",
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
            question: "هل خرزة 5 متاحة؟ | Is bead 5 available?",
            type: "yes-no",
            actual: "خرزة 5 غير مفعّلة | Bead 5 inactive",
            answer: "نعم → أضف 5 واطرح الصديق ⬇️ | Yes → Add 5 and subtract friend ⬇️",
            hint: "+n = +5 − (5−n)",
          },
        ],
        decision: "أصدقاء 5 — أضف 5 بالسبابة ⬇️ واطرد الصديق بالإبهام ⬇️! | Friends of 5 — Add 5 with index ⬇️ and push friend down with thumb ⬇️!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m2-E1",
            question: "13 × 4",
            discrimination: "العشرات 1×4=4. الآحاد 3×4=12 → +1 للعشرات | Tens 1×4=4. Units 3×4=12 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "أنزل 5 بالسبابة ⬇️ واطرد 4 بالإبهام ⬇️ | Bring down 5 with index ⬇️ & push 4 down with thumb ⬇️",
            steps: [
              "1 × 4 = 4 → ضع 4 عشرات بالإبهام ⬆️ | 1 × 4 = 4 → Set 4 tens with thumb ⬆️",
              "3 × 4 = 12 → أضف 1 للعشرات بأصدقاء 5 (+5−4) ⬇️ | 3 × 4 = 12 → Add 1 to tens via Friends of 5 (+5−4) ⬇️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 5 عشرات + 2 آحاد = 52 | Result: 5 tens + 2 units = 52",
            ],
            result: 52,
            beadVisual: "5 عشرات + 2 آحاد = 52 | 5 tens + 2 units = 52",
          },
          {
            id: "S05-m2-E2",
            question: "18 × 3",
            discrimination: "العشرات 1×3=3. الآحاد 8×3=24 → +2 للعشرات | Tens 1×3=3. Units 8×3=24 → +2 to tens",
            rule: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)",
            fingerMovement: "أنزل 5 بالسبابة ⬇️ واطرد 3 بالإبهام ⬇️ | Bring down 5 with index ⬇️ & push 3 down with thumb ⬇️",
            steps: [
              "1 × 3 = 3 → ضع 3 عشرات بالإبهام ⬆️ | 1 × 3 = 3 → Set 3 tens with thumb ⬆️",
              "8 × 3 = 24 → أضف 2 للعشرات بأصدقاء 5 (+5−3) ⬇️ | 8 × 3 = 24 → Add 2 to tens (+5−3) ⬇️",
              "أضف 4 للآحاد بالإبهام ⬆️ | Add 4 to units with thumb ⬆️",
              "الناتج الظاهر: 5 عشرات + 4 آحاد = 54 | Result: 5 tens + 4 units = 54",
            ],
            result: 54,
            beadVisual: "5 عشرات + 4 آحاد = 54 | 5 tens + 4 units = 54",
          },
          {
            id: "S05-m2-E3",
            question: "26 × 2",
            discrimination: "العشرات 2×2=4. الآحاد 6×2=12 → +1 للعشرات | Tens 2×2=4. Units 6×2=12 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "أنزل 5 بالسبابة ⬇️ واطرد 4 بالإبهام ⬇️ | Bring down 5 with index ⬇️ & push 4 down with thumb ⬇️",
            steps: [
              "2 × 2 = 4 → ضع 4 عشرات بالإبهام ⬆️ | 2 × 2 = 4 → Set 4 tens with thumb ⬆️",
              "6 × 2 = 12 → أضف 1 للعشرات بأصدقاء 5 (+5−4) ⬇️ | 6 × 2 = 12 → Add 1 to tens (+5−4) ⬇️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 5 عشرات + 2 آحاد = 52 | Result: 5 tens + 2 units = 52",
            ],
            result: 52,
            beadVisual: "5 عشرات + 2 آحاد = 52 | 5 tens + 2 units = 52",
          },
          {
            id: "S05-m2-E4",
            question: "17 × 4",
            discrimination: "العشرات 1×4=4. الآحاد 7×4=28 → +2 للعشرات | Tens 1×4=4. Units 7×4=28 → +2 to tens",
            rule: "+2 = +5 − 3 (صديق 2 هو 3) | +2 = +5 − 3 (2's friend is 3)",
            fingerMovement: "أنزل 5 بالسبابة ⬇️ واطرد 3 بالإبهام ⬇️ | Bring down 5 with index ⬇️ & push 3 down with thumb ⬇️",
            steps: [
              "1 × 4 = 4 → ضع 4 عشرات بالإبهام ⬆️ | 1 × 4 = 4 → Set 4 tens with thumb ⬆️",
              "7 × 4 = 28 → أضف 2 للعشرات بأصدقاء 5 (+5−3) ⬇️ | 7 × 4 = 28 → Add 2 to tens (+5−3) ⬇️",
              "أضف 8 للآحاد بالإبهام/السبابة 🗜️ | Add 8 to units with pinch 🗜️",
              "الناتج الظاهر: 6 عشرات + 8 آحاد = 68 | Result: 6 tens + 8 units = 68",
            ],
            result: 68,
            beadVisual: "6 عشرات + 8 آحاد = 68 | 6 tens + 8 units = 68",
          },
          {
            id: "S05-m2-E5",
            question: "28 × 2",
            discrimination: "العشرات 2×2=4. الآحاد 8×2=16 → +1 للعشرات | Tens 2×2=4. Units 8×2=16 → +1 to tens",
            rule: "+1 = +5 − 4 (صديق 1 هو 4) | +1 = +5 − 4 (1's friend is 4)",
            fingerMovement: "أنزل 5 بالسبابة ⬇️ واطرد 4 بالإبهام ⬇️ | Bring down 5 with index ⬇️ & push 4 down with thumb ⬇️",
            steps: [
              "2 × 2 = 4 → ضع 4 عشرات بالإبهام ⬆️ | 2 × 2 = 4 → Set 4 tens with thumb ⬆️",
              "8 × 2 = 16 → أضف 1 للعشرات بأصدقاء 5 (+5−4) ⬇️ | 8 × 2 = 16 → Add 1 to tens (+5−4) ⬇️",
              "أضف 6 للآحاد (5+1) 🗜️ | Add 6 to units (5+1) 🗜️",
              "الناتج الظاهر: 5 عشرات + 6 آحاد = 56 | Result: 5 tens + 6 units = 56",
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
            question: "3 × 18",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "3 × 1 = 3 → 3 عشرات | 3 × 1 = 3 → 3 tens",
              "3 × 8 = 24 → +2 عشرات بأصدقاء 5 (+5−3) | 3 × 8 = 24 → +2 tens (+5−3)",
              "+4 آحاد | +4 units",
              "الناتج: 54 | Result: 54",
            ],
            result: 54,
          },
          {
            id: "S05-m2-T2",
            question: "4 × 14",
            discrimination: "+1 = +5 − 4 | Friends of 5: +1 = +5 − 4",
            steps: [
              "4 × 1 = 4 → 4 عشرات | 4 × 1 = 4 → 4 tens",
              "4 × 4 = 16 → +1 عشرات بأصدقاء 5 (+5−4) | 4 × 4 = 16 → +1 tens (+5−4)",
              "+6 آحاد | +6 units",
              "الناتج: 56 | Result: 56",
            ],
            result: 56,
          },
          {
            id: "S05-m2-T3",
            question: "3 × 17",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "3 × 1 = 3 → 3 عشرات | 3 × 1 = 3 → 3 tens",
              "3 × 7 = 21 → +2 عشرات بأصدقاء 5 (+5−3) | 3 × 7 = 21 → +2 tens (+5−3)",
              "+1 آحاد | +1 units",
              "الناتج: 51 | Result: 51",
            ],
            result: 51,
          },
          {
            id: "S05-m2-T4",
            question: "4 × 18",
            discrimination: "+3 = +5 − 2 | Friends of 5: +3 = +5 − 2",
            steps: [
              "4 × 1 = 4 → 4 عشرات | 4 × 1 = 4 → 4 tens",
              "4 × 8 = 32 → +3 عشرات بأصدقاء 5 (+5−2) | 4 × 8 = 32 → +3 tens (+5−2)",
              "+2 آحاد | +2 units",
              "الناتج: 72 | Result: 72",
            ],
            result: 72,
          },
          {
            id: "S05-m2-T5",
            question: "3 × 19",
            discrimination: "+2 = +5 − 3 | Friends of 5: +2 = +5 − 3",
            steps: [
              "3 × 1 = 3 → 3 عشرات | 3 × 1 = 3 → 3 tens",
              "3 × 9 = 27 → +2 عشرات بأصدقاء 5 (+5−3) | 3 × 9 = 27 → +2 tens (+5−3)",
              "+7 آحاد | +7 units",
              "الناتج: 57 | Result: 57",
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
      title: "الضرب بأصدقاء 10",
      titleEn: "Multiplication with Friends of 10",
      emoji: "🌟",
      miniStory: {
        title: "العملاق 10 | Giant 10",
        emoji: "🦶",
        story: "34 × 3: العشرات 3×3=9 عشرات. الآحاد 4×3=12: أضف 1 للعشرات (9+1=10) و2 للآحاد. 9+1=10 تسع عشرات زائد عشرة واحدة تساوي عشر عشرات، نستبدلها بمئة! الناتج 102. | 34×3: Tens 3×3=9 tens. Units 4×3=12 → add 1 to tens (9+1=10) & 2 to units. 9+1=10 tens exchange for 100! Result: 102.",
        storyAudioText: "أربعة وثلاثون في ثلاثة. العشرات: ثلاثة في ثلاثة يساوي تسع عشرات. الآحاد: أربعة في ثلاثة يساوي اثني عشر، فنضيف واحداً للعشرات. تسعة زائد واحد يساوي عشر عشرات، نستبدلها بمئة. الناتج مئة واثنان.",
        storyAudioId: 23,
      },
      rule: {
        description: "أصدقاء 10 🌟: عندما يتجاوز العمود 9، اطرح متمّم العدد بالسبابة ⬇️ وأضف 1 للعمود الأيسر (المئات) بالإبهام ⬆️! | Friends of 10 🌟: When column exceeds 9, subtract complement with index ⬇️ and add 1 to left column (hundreds) with thumb ⬆️!",
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
            question: "هل المجموع في العمود يصل إلى 10 أو أكثر؟ | Does column sum reach 10 or more?",
            type: "yes-no",
            actual: "المجموع ≥ 10 | Sum ≥ 10",
            answer: "نعم → استخدم أصدقاء 10 | Yes → Use Friends of 10",
            hint: "المجموع يتجاوز سعة العمود الحالية | Sum exceeds current column capacity",
          },
          {
            question: "هل يمكن طرح المتمّم مباشرة؟ | Can we subtract complement directly?",
            type: "yes-no",
            actual: "الخرزات المفعّلة ≥ المتمّم | Active beads ≥ complement",
            answer: "نعم → اطرح المتمّم وأضف 1 يساراً | Yes → Subtract complement and add 1 left",
            hint: "+n = −k + 10",
          },
        ],
        decision: "أصدقاء 10 — اطرح المتمّم واقفز 1 للعمود الأيسر! | Friends of 10 — Subtract complement and leap 1 bead to left column!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m3-E1",
            question: "34 × 3",
            discrimination: "العشرات 3×3=9. الآحاد 4×3=12 → +1 للعشرات | Tens 3×3=9. Units 4×3=12 → +1 to tens",
            rule: "+1 = −9 + 10 (صديق 1 هو 9) | +1 = −9 + 10 (1's friend is 9)",
            fingerMovement: "اطرح 9 بالسبابة ⬇️ وأضف 1 للمئات بالإبهام ⬆️ | Subtract 9 with index ⬇️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "3 × 3 = 9 → 9 عشرات بالإبهام/السبابة 🗜️ | 3 × 3 = 9 → 9 tens with pinch 🗜️",
              "4 × 3 = 12 → +1 عشرات (−9+10) ⬇️⬆️ | 4 × 3 = 12 → +1 tens (−9+10) ⬇️⬆️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 0 عشرات + 2 آحاد = 102 | Result: 1 hundred + 0 tens + 2 units = 102",
            ],
            result: 102,
            beadVisual: "1 مئة + 0 عشرات + 2 آحاد = 102 | 1 hundred + 0 tens + 2 units = 102",
          },
          {
            id: "S05-m3-E2",
            question: "39 × 3",
            discrimination: "العشرات 3×3=9. الآحاد 9×3=27 → +2 للعشرات | Tens 3×3=9. Units 9×3=27 → +2 to tens",
            rule: "+2 = −8 + 10 (صديق 2 هو 8) | +2 = −8 + 10 (2's friend is 8)",
            fingerMovement: "اطرح 8 بالسبابة ⬇️ وأضف 1 للمئات بالإبهام ⬆️ | Subtract 8 with index ⬇️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "3 × 3 = 9 → 9 عشرات 🗜️ | 3 × 3 = 9 → 9 tens 🗜️",
              "9 × 3 = 27 → +2 عشرات (−8+10) ⬇️⬆️ | 9 × 3 = 27 → +2 tens (−8+10) ⬇️⬆️",
              "أضف 7 للآحاد 🗜️ | Add 7 to units 🗜️",
              "الناتج الظاهر: 1 مئة + 1 عشرات + 7 آحاد = 117 | Result: 1 hundred + 1 tens + 7 units = 117",
            ],
            result: 117,
            beadVisual: "1 مئة + 1 عشرات + 7 آحاد = 117 | 1 hundred + 1 tens + 7 units = 117",
          },
          {
            id: "S05-m3-E3",
            question: "28 × 4",
            discrimination: "العشرات 2×4=8. الآحاد 8×4=32 → +3 للعشرات | Tens 2×4=8. Units 8×4=32 → +3 to tens",
            rule: "+3 = −7 + 10 (صديق 3 هو 7) | +3 = −7 + 10 (3's friend is 7)",
            fingerMovement: "اطرح 7 بالسبابة ⬇️ وأضف 1 للمئات بالإبهام ⬆️ | Subtract 7 with index ⬇️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "2 × 4 = 8 → 8 عشرات 🗜️ | 2 × 4 = 8 → 8 tens 🗜️",
              "8 × 4 = 32 → +3 عشرات (−7+10) ⬇️⬆️ | 8 × 4 = 32 → +3 tens (−7+10) ⬇️⬆️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 1 عشرات + 2 آحاد = 112 | Result: 1 hundred + 1 tens + 2 units = 112",
            ],
            result: 112,
            beadVisual: "1 مئة + 1 عشرات + 2 آحاد = 112 | 1 hundred + 1 tens + 2 units = 112",
          },
          {
            id: "S05-m3-E4",
            question: "17 × 6",
            discrimination: "العشرات 1×6=6. الآحاد 7×6=42 → +4 للعشرات | Tens 1×6=6. Units 7×6=42 → +4 to tens",
            rule: "+4 = −6 + 10 (صديق 4 هو 6) | +4 = −6 + 10 (4's friend is 6)",
            fingerMovement: "اطرح 6 بالسبابة ⬇️ وأضف 1 للمئات بالإبهام ⬆️ | Subtract 6 with index ⬇️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 6 = 6 → 6 عشرات 🗜️ | 1 × 6 = 6 → 6 tens 🗜️",
              "7 × 6 = 42 → +4 عشرات (−6+10) ⬇️⬆️ | 7 × 6 = 42 → +4 tens (−6+10) ⬇️⬆️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 0 عشرات + 2 آحاد = 102 | Result: 1 hundred + 0 tens + 2 units = 102",
            ],
            result: 102,
            beadVisual: "1 مئة + 0 عشرات + 2 آحاد = 102 | 1 hundred + 0 tens + 2 units = 102",
          },
          {
            id: "S05-m3-E5",
            question: "16 × 7",
            discrimination: "العشرات 1×7=7. الآحاد 6×7=42 → +4 للعشرات | Tens 1×7=7. Units 6×7=42 → +4 to tens",
            rule: "+4 = −6 + 10 (صديق 4 هو 6) | +4 = −6 + 10 (4's friend is 6)",
            fingerMovement: "اطرح 6 بالسبابة ⬇️ وأضف 1 للمئات بالإبهام ⬆️ | Subtract 6 with index ⬇️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 7 = 7 → 7 عشرات 🗜️ | 1 × 7 = 7 → 7 tens 🗜️",
              "6 × 7 = 42 → +4 عشرات (−6+10) ⬇️⬆️ | 6 × 7 = 42 → +4 tens (−6+10) ⬇️⬆️",
              "أضف 2 للآحاد بالإبهام ⬆️ | Add 2 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 1 عشرات + 2 آحاد = 112 | Result: 1 hundred + 1 tens + 2 units = 112",
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
            question: "6 × 17",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "6 × 1 = 6 → 6 عشرات | 6 × 1 = 6 → 6 tens",
              "6 × 7 = 42 → +4 عشرات (−6+10) | 6 × 7 = 42 → +4 tens (−6+10)",
              "+2 آحاد | +2 units",
              "الناتج: 102 | Result: 102",
            ],
            result: 102,
          },
          {
            id: "S05-m3-T2",
            question: "7 × 18",
            discrimination: "+5 = −5 + 10 | Friends of 10: +5 = −5 + 10",
            steps: [
              "7 × 1 = 7 → 7 عشرات | 7 × 1 = 7 → 7 tens",
              "7 × 8 = 56 → +5 عشرات (−5+10) | 7 × 8 = 56 → +5 tens (−5+10)",
              "+6 آحاد | +6 units",
              "الناتج: 126 | Result: 126",
            ],
            result: 126,
          },
          {
            id: "S05-m3-T3",
            question: "8 × 15",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "8 × 1 = 8 → 8 عشرات | 8 × 1 = 8 → 8 tens",
              "8 × 5 = 40 → +4 عشرات (−6+10) | 8 × 5 = 40 → +4 tens (−6+10)",
              "+0 آحاد | +0 units",
              "الناتج: 120 | Result: 120",
            ],
            result: 120,
          },
          {
            id: "S05-m3-T4",
            question: "9 × 14",
            discrimination: "+3 = −7 + 10 | Friends of 10: +3 = −7 + 10",
            steps: [
              "9 × 1 = 9 → 9 عشرات | 9 × 1 = 9 → 9 tens",
              "9 × 4 = 36 → +3 عشرات (−7+10) | 9 × 4 = 36 → +3 tens (−7+10)",
              "+6 آحاد | +6 units",
              "الناتج: 126 | Result: 126",
            ],
            result: 126,
          },
          {
            id: "S05-m3-T5",
            question: "6 × 18",
            discrimination: "+4 = −6 + 10 | Friends of 10: +4 = −6 + 10",
            steps: [
              "6 × 1 = 6 → 6 عشرات | 6 × 1 = 6 → 6 tens",
              "6 × 8 = 48 → +4 عشرات (−6+10) | 6 × 8 = 48 → +4 tens (−6+10)",
              "+8 آحاد | +8 units",
              "الناتج: 108 | Result: 108",
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
      title: "الضرب المركّب",
      titleEn: "Compound Multiplication",
      emoji: "🎯",
      miniStory: {
        title: "التحالف المزدوج | The Double Alliance",
        emoji: "👑",
        story: "18 × 8: العشرات 1×8=8 عشرات. الآحاد 8×8=64، فنضيف 6 للعشرات (8+6=14). الجدة 5 والعملاق 10 يتعاونان: −5+1+10! أزل 5، أضف 1، وأضف 1 للمئات. الناتج 144. | 18×8: Tens 1×8=8 tens. Units 8×8=64 → +6 to tens (8+6=14). Grandma 5 & Giant 10 ally: −5+1+10! Remove 5, add 1, add 1 to hundreds. Result: 144.",
        storyAudioText: "ثمانية عشر في ثمانية. العشرات: واحد في ثمانية يساوي ثماني عشرات. الآحاد: ثمانية في ثمانية يساوي أربعة وستين، فنضيف ستة للعشرات. ثمانية زائد ستة يساوي أربعة عشر. الجدة خمسة والعملاق عشرة يتعاونان: نطرح خمسة ونضيف واحداً وعشرة. الناتج مئة وأربعة وأربعون.",
        storyAudioId: 24,
      },
      rule: {
        description: "التحالف المزدوج 👑: عندما لا تكفي السفليات لطرح المتمّم، أزل 5 بالسبابة ⬆️، أضف المكمل بالإبهام ⬆️، وأضف 1 للمئات ⬆️! | Double Alliance 👑: When lower beads can't subtract the complement, remove 5 with index ⬆️, add remainder with thumb ⬆️, and add 1 to hundreds ⬆️!",
        cases: [
          { from: 5, formula: "+5 = −5 + 10 (إلغاء 5 والقفز بـ 10 للمئات) | +5 = −5 + 10 (Cancel 5 and leap 10 to hundreds)" },
          { from: 6, formula: "+6 = −5 + 1 + 10 (أزل 5، أضف 1، أضف 10 للمئات) | +6 = −5 + 1 + 10 (Remove 5, add 1, add 10 to hundreds)" },
          { from: 7, formula: "+7 = −5 + 2 + 10 (أزل 5، أضف 2، أضف 10 للمئات) | +7 = −5 + 2 + 10 (Remove 5, add 2, add 10 to hundreds)" },
          { from: 8, formula: "+8 = −5 + 3 + 10 (أزل 5، أضف 3، أضف 10 للمئات) | +8 = −5 + 3 + 10 (Remove 5, add 3, add 10 to hundreds)" },
          { from: 9, formula: "+9 = −5 + 4 + 10 (أزل 5، أضف 4، أضف 10 للمئات) | +9 = −5 + 4 + 10 (Remove 5, add 4, add 10 to hundreds)" },
        ],
      },
      condition: {
        formula: "المجموع ≥ 10 · خرزة 5 مفعّلة · السفليات < المتمّم | Sum ≥ 10 · bead 5 active · lower beads < complement",
        explanation: "الجدة 5 والعملاق 10 يتعاونان معاً لإنجاز الترحيل المركّب! | Grandma 5 and Giant 10 team up for compound carrying!",
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
            question: "هل الخرزات السفلية < المتمّم؟ | Are lower beads < required complement?",
            type: "yes-no",
            actual: "السفليات < المتمّم | Lower beads < complement",
            answer: "نعم → استخدم −5 + (n−5) + 10 | Yes → Use −5 + (n−5) + 10",
            hint: "أزل 5، أضف المكمّل، وأضف 1 للمئات | Remove 5, add remainder, add 1 to hundreds",
          },
        ],
        decision: "ضرب مركّب! أزل 5، أضف المكمّل، أضف 10! | Compound multiplication! Remove 5, add remainder, add 10!",
      },
      watchPhase: {
        examples: [
          {
            id: "S05-m4-E1",
            question: "19 × 6",
            discrimination: "العشرات 1×6=6. الآحاد 9×6=54 → +5 للعشرات (6+5=11) | Tens 1×6=6. Units 9×6=54 → +5 to tens (6+5=11)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "أزل 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام ⬆️ | Remove 5 with index ⬆️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 6 = 6 → 6 عشرات 🗜️ | 1 × 6 = 6 → 6 tens 🗜️",
              "9 × 6 = 54 → +5 عشرات (6+5=11) → أزل 5، أضف 1 للمئات ⬆️ | 9 × 6 = 54 → +5 tens (6+5=11) → Remove 5, add 1 to hundreds ⬆️",
              "أضف 4 للآحاد بالإبهام ⬆️ | Add 4 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 1 عشرات + 4 آحاد = 114 | Result: 1 hundred + 1 tens + 4 units = 114",
            ],
            result: 114,
            beadVisual: "1 مئة + 1 عشرات + 4 آحاد = 114 | 1 hundred + 1 tens + 4 units = 114",
          },
          {
            id: "S05-m4-E2",
            question: "18 × 7",
            discrimination: "العشرات 1×7=7. الآحاد 8×7=56 → +5 للعشرات (7+5=12) | Tens 1×7=7. Units 8×7=56 → +5 to tens (7+5=12)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "أزل 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام ⬆️ | Remove 5 with index ⬆️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 7 = 7 → 7 عشرات 🗜️ | 1 × 7 = 7 → 7 tens 🗜️",
              "8 × 7 = 56 → +5 عشرات (7+5=12) → أزل 5، أضف 1 للمئات ⬆️ | 8 × 7 = 56 → +5 tens (7+5=12) → Remove 5, add 1 to hundreds ⬆️",
              "أضف 6 للآحاد 🗜️ | Add 6 to units 🗜️",
              "الناتج الظاهر: 1 مئة + 2 عشرات + 6 آحاد = 126 | Result: 1 hundred + 2 tens + 6 units = 126",
            ],
            result: 126,
            beadVisual: "1 مئة + 2 عشرات + 6 آحاد = 126 | 1 hundred + 2 tens + 6 units = 126",
          },
          {
            id: "S05-m4-E3",
            question: "17 × 8",
            discrimination: "العشرات 1×8=8. الآحاد 7×8=56 → +5 للعشرات (8+5=13) | Tens 1×8=8. Units 7×8=56 → +5 to tens (8+5=13)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "أزل 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام ⬆️ | Remove 5 with index ⬆️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 8 = 8 → 8 عشرات 🗜️ | 1 × 8 = 8 → 8 tens 🗜️",
              "7 × 8 = 56 → +5 عشرات (8+5=13) → أزل 5، أضف 1 للمئات ⬆️ | 7 × 8 = 56 → +5 tens (8+5=13) → Remove 5, add 1 to hundreds ⬆️",
              "أضف 6 للآحاد 🗜️ | Add 6 to units 🗜️",
              "الناتج الظاهر: 1 مئة + 3 عشرات + 6 آحاد = 136 | Result: 1 hundred + 3 tens + 6 units = 136",
            ],
            result: 136,
            beadVisual: "1 مئة + 3 عشرات + 6 آحاد = 136 | 1 hundred + 3 tens + 6 units = 136",
          },
          {
            id: "S05-m4-E4",
            question: "16 × 9",
            discrimination: "العشرات 1×9=9. الآحاد 6×9=54 → +5 للعشرات (9+5=14) | Tens 1×9=9. Units 6×9=54 → +5 to tens (9+5=14)",
            rule: "+5 = −5 + 10 | Compound: +5 = −5 + 10",
            fingerMovement: "أزل 5 بالسبابة ⬆️ وأضف 1 للمئات بالإبهام ⬆️ | Remove 5 with index ⬆️ & add 1 to hundreds with thumb ⬆️",
            steps: [
              "1 × 9 = 9 → 9 عشرات 🗜️ | 1 × 9 = 9 → 9 tens 🗜️",
              "6 × 9 = 54 → +5 عشرات (9+5=14) → أزل 5، أضف 1 للمئات ⬆️ | 6 × 9 = 54 → +5 tens (9+5=14) → Remove 5, add 1 to hundreds ⬆️",
              "أضف 4 للآحاد بالإبهام ⬆️ | Add 4 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 4 عشرات + 4 آحاد = 144 | Result: 1 hundred + 4 tens + 4 units = 144",
            ],
            result: 144,
            beadVisual: "1 مئة + 4 عشرات + 4 آحاد = 144 | 1 hundred + 4 tens + 4 units = 144",
          },
          {
            id: "S05-m4-E5",
            question: "18 × 8",
            discrimination: "العشرات 1×8=8. الآحاد 8×8=64 → +6 للعشرات (8+6=14) | Tens 1×8=8. Units 8×8=64 → +6 to tens (8+6=14)",
            rule: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            fingerMovement: "أزل 5 بالسبابة ⬆️، أضف 1 بالإبهام ⬆️، وأضف 1 للمئات ⬆️ | Remove 5 with index ⬆️, add 1 with thumb ⬆️, add 1 to hundreds ⬆️",
            steps: [
              "1 × 8 = 8 → 8 عشرات 🗜️ | 1 × 8 = 8 → 8 tens 🗜️",
              "8 × 8 = 64 → +6 عشرات (8+6=14) → أزل 5، أضف 1، وأضف 1 للمئات ⬆️ | 8 × 8 = 64 → +6 tens (8+6=14) → Remove 5, add 1, add 1 to hundreds ⬆️",
              "أضف 4 للآحاد بالإبهام ⬆️ | Add 4 to units with thumb ⬆️",
              "الناتج الظاهر: 1 مئة + 4 عشرات + 4 آحاد = 144 | Result: 1 hundred + 4 tens + 4 units = 144",
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
            question: "8 × 18",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "8 × 1 = 8 → 8 عشرات | 8 × 1 = 8 → 8 tens",
              "8 × 8 = 64 → +6 عشرات (8+6=14) | 8 × 8 = 64 → +6 tens (8+6=14)",
              "أزل 5، أضف 1، أضف 1 للمئات | Remove 5, add 1, add 1 to hundreds",
              "+4 آحاد | +4 units",
              "الناتج: 144 | Result: 144",
            ],
            result: 144,
          },
          {
            id: "S05-m4-T2",
            question: "8 × 28",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "8 × 2 = 16 → 1 مئة + 6 عشرات | 8 × 2 = 16 → 1 hundred + 6 tens",
              "8 × 8 = 64 → +6 عشرات (6+6=12) | 8 × 8 = 64 → +6 tens (6+6=12)",
              "أزل 5، أضف 1، أضف 1 للمئات (2 مئات) | Remove 5, add 1, add 1 to hundreds (2 hundreds)",
              "+4 آحاد | +4 units",
              "الناتج: 224 | Result: 224",
            ],
            result: 224,
          },
          {
            id: "S05-m4-T3",
            question: "8 × 29",
            discrimination: "+7 = −5 + 2 + 10 | Compound: +7 = −5 + 2 + 10",
            steps: [
              "8 × 2 = 16 → 1 مئة + 6 عشرات | 8 × 2 = 16 → 1 hundred + 6 tens",
              "8 × 9 = 72 → +7 عشرات (6+7=13) | 8 × 9 = 72 → +7 tens (6+7=13)",
              "أزل 5، أضف 2، أضف 1 للمئات (2 مئات) | Remove 5, add 2, add 1 to hundreds (2 hundreds)",
              "+2 آحاد | +2 units",
              "الناتج: 232 | Result: 232",
            ],
            result: 232,
          },
          {
            id: "S05-m4-T4",
            question: "9 × 27",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "9 × 2 = 18 → 1 مئة + 8 عشرات | 9 × 2 = 18 → 1 hundred + 8 tens",
              "9 × 7 = 63 → +6 عشرات (8+6=14) | 9 × 7 = 63 → +6 tens (8+6=14)",
              "أزل 5، أضف 1، أضف 1 للمئات (2 مئات) | Remove 5, add 1, add 1 to hundreds (2 hundreds)",
              "+3 آحاد | +3 units",
              "الناتج: 243 | Result: 243",
            ],
            result: 243,
          },
          {
            id: "S05-m4-T5",
            question: "7 × 19",
            discrimination: "+6 = −5 + 1 + 10 | Compound: +6 = −5 + 1 + 10",
            steps: [
              "7 × 1 = 7 → 7 عشرات | 7 × 1 = 7 → 7 tens",
              "7 × 9 = 63 → +6 عشرات (7+6=13) | 7 × 9 = 63 → +6 tens (7+6=13)",
              "أزل 5، أضف 1، أضف 1 للمئات | Remove 5, add 1, add 1 to hundreds",
              "+3 آحاد | +3 units",
              "الناتج: 133 | Result: 133",
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