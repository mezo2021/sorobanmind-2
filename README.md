 PROJECT_PLAN.md المحدَّث — مشروع تطبيق 

---

```markdown
# 📘 SorobanMind v2 — Master Plan

> **آخر تحديث:** 2026-09-26 (الجلسة 5 — الشارات + التكيف قيد التنفيذ)
> **الحالة:** 🟢 التطبيق يعمل + 20 مهارة + بنك v2 (~1080) + نمط الأرقام
> **الرابط:** https://mezo2021.github.io/sorobanmind-2
> **المستودع:** https://github.com/mezo2021/sorobanmind-2

---

## 🎯 1. الرؤية

**SorobanMind** = تطبيق تعليمي عربي تفاعلي لتعلّم السوروبان الياباني.

### الأهداف:
1. **منهج ياباني أصيل** (Takashi Kojima)
2. **تعليم تكيفي** — كل طالب يحصل على أسئلة مخصّصة
3. **فئتان عمريتان:**
   - 🧒 **قسم 1** (5–12): L0 → L3 + إثراء
   - 🧑 **قسم 2** (13+): L4 → L7 + إثراء

### الميزة التنافسية:
> **محرك تكيفي حقيقي** يفهم مهارات الطفل، يحدد نقاط ضعفه، ويولّد له أسئلة علاجية تلقائياً، مع مساري تمرّن وأنزان لكل درس.

---

## 🧠 2. المنهج — 8 مستويات (L0-L7) + 20 مهارة (S1-S20)

| المستوى | المهارات | المحتوى | القسم |
|---------|----------|---------|-------|
| **L0** | S1, S2 | تعرّف + أرقام 0-9 + قيمة مكانية | 🧒 (5-12) |
| **L1** | S3-S9 | جمع + طرح + أصدقاء 5 + أصدقاء 10 + مختلط | 🧒 (5-12) |
| **L2** | S10-S12 | الضرب (2×1، 2×2، 3+) | 🧒 (5-12) |
| **L3** | S13-S15 | القسمة (÷1، ÷2، ÷3) | 🧒 (5-12) |
| **L4** | S16 | جمع/طرح متقدم (متعدد + سلاسل) | 🧑 (13+) |
| **L5** | S17 | ضرب/قسمة متقدم | 🧑 (13+) |
| **L6** | S18 | كسور عشرية | 🧑 (13+) |
| **L7** | S19, S20 | جذور تربيعية + تكعيبية | 🧑 (13+) |

### بنية كل مستوى (تسلسل إجباري):

```

📖 تعلّم (القصة + المفهوم + الأمثلة)
↓
💡 جرّب (أمثلة بدون حل)
↓
✏️ تمرّن (5 أسئلة تكيفية من البنك)
↓ نجاح 75%
🧠 أنزان بصري (Flash)
↓ نجاح 75%
🎧 أنزان سمعي (TTS)
↓ نجاح 75%
📖 المستوى التالي

```

---

## 🔒 3. منطق القفل

| العنصر | يُفتح بعد |
|--------|-----------|
| 🎨 الإثراء | مفتوح دائماً |
| 📖 L0 | مفتوح |
| ✏️ تمرّن N | إنهاء درس L(N) |
| 🧠 أنزان N بصري | نجاح تمرّن N |
| 🎧 أنزان N سمعي | نجاح بصري N |
| 📖 L(N+1) | نجاح كل مسارات L(N) |
| 🏆 امتحان القسم 1 | إتمام L0-L3 كاملاً + كل المسارات |
| 🎓 القسم 2 (L4) | نجاح 80% في امتحان القسم 1 |
| 📝 Placement Test | 48 ساعة بين المحاولات |

---

## 📚 4. بنك الأسئلة v2

### 📁 البنية:

```

src/data/
├── bank-v2/                     ← 🆕 البنك الجديد
│   ├── types.ts                 ← QuestionTiming + BankQuestion
│   ├── part-01.ts               ← S1-S9 (~285 سؤال)
│   ├── part-02.ts               ← S10-S15 (150 سؤال)
│   ├── part-03.ts               ← S16-S17 (80 سؤال)
│   ├── part-04.ts               ← S18-S20 (70 سؤال)
│   ├── bank-exam.ts             ← امتحانات 1 و 2 (~350)
│   ├── placement-engine.ts      ← امتحان تحديد المستوى
│   └── index.ts                 ← الواجهة الموحّدة
│
├── bank-raw/                    ← 400 سؤال خام
│   ├── types.ts                 ← S1-S17
│   ├── raw-01 → raw-07.ts       ← البيانات
│   └── index.ts
│
├── bank-linked.ts               ← دمج bank-v2 + bank-raw
├── bank.ts                      ← 🗑️ (مهجور)
├── bank-adapter.ts              ← 🗑️ (مهجور)
└── curriculum.ts                ← 8 مستويات + قسمان

```

### 📊 التوزيع:

| المصدر | العدد | الاستخدام |
|--------|-------|-----------|
| bank-v2/part-01 → 04 | ~585 | تمرّن + أنزان |
| bank-exam (EXAM_POOL_1+2) | ~350 | امتحان 1 + 2 |
| bank-raw | 400 | توافق مؤقت |
| **المجموع** | **~1080** | 🎯 |

### 🎯 نظام ID:

| البنك | الصيغة | مثال |
|-------|--------|------|
| bank-v2 | `L{level}-S{skill}-{seq}` | `L1-S3-001` |
| bank-exam 1 | `EX1-S{skill}-{seq}` | `EX1-S3-001` |
| bank-exam 2 | `EX2-S{skill}-{seq}` | `EX2-S16-001` |
| placement | `PL-L{level}-S{skill}-{seq}` | `PL-L0-S3-001` |

### ⏱️ نظام التوقيت (QuestionTiming):

```typescript
interface QuestionTiming {
  displayMs?: number;   // للأنزان فقط (Flash)
  answerMs: number;     // الوقت المعياري
  maxMs: number;        // الحد الأقصى (بعدها = خطأ)
}
```

🎯 تصنيف السرعة (وفق الزمن المعياري):

التصنيف القاعدة الشارة
⚡ قياسي ≤ 50% من answerMs 🏅 شارة مهارة
✅ مقبول ≤ 75% من answerMs —
🐢 بطيء 75% من answerMs —

العدّاد: تصاعدي + توهج أحمر عند 60%.

---

🎨 5. نظام نمط الأرقام (عربي / لاتيني)

📁 الملفات:

```

src/
├── utils/numberStyle.ts             ← 🆕 تحويل الأرقام
├── store/numberStyleStore.ts        ← 🆕 Zustand Store
├── components/NumberStyleToggle.tsx ← 🆕 زر التبديل
└── screens/Header.tsx               ← مُعدَّل (يحتوي الزر)

```

🎯 الحالة:

· ✅ تطبيق على: Header + Practice + Anzan + AudioAnzan + PlacementTest + CategoryScreen + LevelScreen + Soroban2D5
· ⏳ قيد التطبيق: GuardianDashboard + SorobanPlayground

---

🏗️ 6. البنية الكاملة

```

src/
├── App.tsx                          ✅ (كل المسارات + audio-anzan)
├── types.ts                         ✅ (كل الشاشات)
│
├── store/
│   ├── progressStore.ts             ✅ (Zustand + persist)
│   └── numberStyleStore.ts          ✅ (عربي/لاتيني)
│
├── utils/
│   ├── numberStyle.ts               ✅ (تحويل الأرقام)
│   ├── audioAnzanBadges.ts          ✅
│   ├── badgeChecker.ts              ✅
│   ├── certificateGenerator.ts      ✅
│   ├── numerals.ts                  ✅
│   └── skillsChecker.ts             ✅
│
├── curriculum/                      ✅
│   ├── types.ts                     ✅ (مجمَّد)
│   └── levels/                      🟡 (L00-L05 قديمة)
│
├── engine/                          ✅ (مجمَّد)
│   ├── sorobanMoves.ts              ✅
│   ├── sorobanEngine.ts             ✅
│   ├── masteryTracker.ts            ✅
│   ├── problemGenerator.ts          ✅
│   └── adaptiveEngine.ts            ✅
│
├── data/                            ✅
│   ├── bank-v2/                     ✅ (~585 + ~350)
│   ├── bank-raw/                    ✅ (400)
│   ├── bank-linked.ts               ✅
│   ├── curriculum.ts                ✅ (8 مستويات + قسمان)
│   ├── data.ts                      ✅ (v1)
│   └── learnModules.ts              ✅ (v1)
│
├── components/
│   ├── NumberStyleToggle.tsx        ✅ 🆕
│   ├── Companion.tsx                ✅
│   ├── CharacterSelector.tsx        ✅
│   ├── DebugOverlay.tsx             ✅
│   ├── soroban2d5/                  ✅
│   └── ...
│
├── screens/                         ✅
│   ├── WelcomeScreen.tsx            ✅
│   ├── RoleSelection.tsx            ✅
│   ├── HeroDashboard.tsx            ✅
│   ├── GuardianDashboard.tsx        ✅
│   ├── Header.tsx                   ✅ (مُحدَّث: 5 أزرار)
│   ├── CategoryScreen.tsx           ✅ (Header + recommended)
│   ├── LevelScreen.tsx              ✅ (Header)
│   ├── PracticeScreen.tsx           ✅ (bank-v2 + نمط)
│   ├── AnzanScreen.tsx              ✅ (Flash + نمط)
│   ├── AudioAnzanScreen.tsx         ✅ (TTS + نمط)
│   ├── PlacementTestScreen.tsx      ✅ (سوروبان + تنقل + إنهاء)
│   └── EnrichmentScreen.tsx         ✅ (قديم)
│
└── 🗑️ محذوف:
├── CurriculumScreen.tsx         (حُذف)
├── CategorySelectScreen.tsx     (حُذف)
└── bank-supplement.ts           (حُذف)

```

---

🎯 7. الشاشات التفاعلية — التفاصيل

📖 PracticeScreen (تمرّن):

· 5 أسئلة من bank-v2
· محاولة واحدة
· زر "تحقق" دائم + زر "التالي" يدوي
· عدّاد تصاعدي + توهج 60%
· تسجيل الضعف (recordWeaknessAttempt)
· 5 XP لكل إجابة صحيحة
· 75% للنجاح
· ✅ يدعم نمط الأرقام

🧠 AnzanScreen (الأنزان البصري):

· وضعان: Flash + Regular
· Flash: الأرقام تظهر واحداً واحداً (3s)
· Regular: السؤال كاملاً
· عدّاد تصاعدي + توهج 60%
· زر تحقق + يدوي
· 5 أسئلة
· ✅ يدعم نمط الأرقام

🎧 AudioAnzanScreen (الأنزان السمعي):

· TTS يقرأ الأرقام (عربي)
· بدون عرض بصري
· زر "إعادة السمع" (مرة واحدة)
· عدّاد تصاعدي + توهج 60%
· ✅ يدعم نمط الأرقام

📝 PlacementTestScreen:

· 40 سؤالاً من EXAM_POOL_1 + EXAM_POOL_2
· 5 من كل مستوى (L0-L7)
· 20 دقيقة
· 200 نقطة → 100 درجة
· عتبة النجاح: 20/25 لكل مستوى (80%)
· المستوى المُوصى به = أول مستوى رسب فيه
· ✅ الإجابة على السوروبان
· ✅ زر "إنهاء" + تأكيد
· ✅ أزرار السابق/تحقق/التالي
· ✅ حجم السوروبان تلقائي (3/6/9)
· ✅ درجة < 7% → يُوصى بـ L0
· ✅ المستويات السابقة تُفتح للمراجعة
· ✅ recommendedLevel badge + border ذهبي

🏆 CategoryExamScreen (قادم):

· 20 سؤالاً للقسم 1 (10 دقائق)
· 40 سؤالاً للقسم 2 (20 دقيقة)
· محاولتان لكل سؤال
· بدون وقت لكل سؤال

---

🎯 8. نظام تتبّع الضعف

📁 في bank-v2/index.ts:

```typescript
interface WeakSkillRecord {
  skillId: string;
  attempts: number;
  correct: number;
  wrong: number;
  avgTimeMs: number;
  lastAttempt: number;
  weaknessScore: number;  // 0-100
}
```

🎯 القاعدة:

```
الضعف يُحسَب:
  - (1 - accuracy) × 60
  - + 20 إذا accuracy < 50%
  - + 20 إذا avgTimeMs > 15000

عتبة "ضعيف" = 50
نسبة الأسئلة العلاجية = 70%
```

🔄 التطبيق:

· recordWeaknessAttempt(skillId, correct, timeMs) — يُستدعى في كل إجابة
· getPracticeQuestions(num) — يُعطي 70% للضعيف + 30% للعادي
· getWeakSkills() — للوحة ولي الأمر

---

🏅 9. نظام الشارات (Mastery Badges)

🎯 الفكرة:

شارة لكل مهارة (S) يُتقنها الطفل بزمن قياسي.

📁 التخزين:

```json
// soroban_mastery_badges
{
  "S3": { "masteredAt": 1234567890, "bestTimeMs": 3500 },
  "S5": { "masteredAt": 1234567890, "bestTimeMs": 4200 }
}
```

🎯 القاعدة:

· 🏅 قياسي (≤ 50% من answerMs) → شارة فورية
· ✅ مقبول (≤ 75%) → لا شارة
· 🐢 بطيء (> 75%) → لا شارة

🎁 العرض:

· 🏆 في نهاية الجلسة
· 📊 في صفحة القسم (زر "ملاحظاتي")
· 👨‍👩‍👧 في صفحة ولي الأمر
· 🎯 في قسم "المغامرات" (قادم)

---

📊 10. نظام التعليم التكيفي (Adaptive Learning)

🎯 المبدأ:

بعد كل جلسة (تمرّن/أنزان)، يُعرَض للطفل:

· ✅ المهارات التي أتقنها (بزمن قياسي)
· ⚠️ المهارات التي تحتاج تقوية
· 💡 التوصيات العلاجية

📋 الشكل:

```
╔══════════════════════════════════════════╗
║  📊 ملاحظات التعليم التكيفي              ║
╠══════════════════════════════════════════╣
║                                          ║
║  ✅ مهارات أتقنتها (بزمن قياسي):         ║
║    🏅 S3 — جمع مباشر                     ║
║    🏅 S5 — أصدقاء 5 جمع                  ║
║                                          ║
║  ⚠️ مهارات تحتاج تقوية:                 ║
║    📌 S4 — طرح مباشر (بطيء)              ║
║    📌 S6 — أصدقاء 5 طرح (دقة منخفضة)    ║
║                                          ║
║  💡 التوصية: أعد جلسة S4 و S6            ║
╚══════════════════════════════════════════╝
```

📁 الملفات المتوقعة:

```
src/
├── store/
│   └── masteryBadgesStore.ts    ← 🆕 شارات المهارات
└── components/
    └── AdaptiveFeedback.tsx     ← 🆕 عرض الملاحظات
```

---

🎨 11. الإثراء

🧒 قسم 1:

# الشاشة الحالة
1 ✨ أسرار الضرب ✅ جاهز (من v1)
2 🖐️ رياضيات الأصابع ⏳ قادم

🧑 قسم 2:

# الشاشة الحالة
1 🏹 الضرب التقاطعي ✅ جاهز (من v1)

🆕 السوروبان التفاعلي (قادم):

· 🎮 وضع حر — الطفل يلعب
· 🔄 زر تحديث + رجوع
· 🔤 نمط الأرقام (عربي/لاتيني)

---

🗺️ 12. خارطة الطريق

✅ الجلسة 1 — التأسيس

· محرك السوروبان + i18n + Welcome → Role → Dashboard

✅ الجلسة 2 — البنك التكيفي (700)

· masteryTracker + problemGenerator + adaptiveEngine

✅ الجلسة 3 — توسيع البنك (900)

· 200 سؤال متقدم + 8 مستويات + 20 مهارة

✅ الجلسة 4 — البنية الجديدة

· bank-v2 + bank-exam + placement-engine
· progressStore + App + Hero + Category + Level
· Practice + Anzan + Audio + Placement

✅ الجلسة 5 — الأنزان + النمط + التكيف (اليوم)

· Header بأزرار (تحديث/خروج/نمط)
· نظام نمط الأرقام كاملاً
· Soroban2D5 محدَّث
· Practice/Anzan/Audio مع النمط
· Placement Test مع السوروبان + التنقل + الإنهاء
· CategoryScreen + LevelScreen + Header
· Placement Result → فتح المستويات السابقة + weakSkills

🎯 الجلسة 6 — الشارات والملاحظات التكيفية (قيد التنفيذ)

· masteryBadgesStore.ts
· AdaptiveFeedback.tsx
· ربط في Practice + Anzan + Audio
· عرض في GuardianDashboard
· قسم "المغامرات" (Badges)

🎯 الجلسة 7 — الامتحانات

· CategoryExamScreen.tsx
· تحديث examBank2.ts (20+40)

🎯 الجلسة 8 — الإثراء

· FingersScreen.tsx
· SorobanPlayground.tsx
· ربط MagicSecrets + CrossMultiplication

🎯 الجلسة 9 — الدروس والمحتوى

· بناء دروس L0-L7 (تعلّم + جرّب)
· ربط القصص من v1

🎯 الجلسة 10 — الإكمال

· PWA (offline)
· APK (Google Play)

---

📊 13. الإحصائيات

المقياس القيمة
الملفات المكتملة ~100
الملفات المتبقية ~8
نسبة الإنجاز ~90%
أسئلة البنك ~1080
المستويات 8 (L0-L7)
المهارات 20 (S1-S20)
الأقسام 2 (5-12 / 13+)
الشاشات التفاعلية 4 + 2 (محدَّثة)
أنظمة مساعدة 3 (نمط الأرقام + الشارات + التكيف)

---

🔗 14. روابط مهمة

الرابط الوصف
Live Demo التطبيق
GitHub Repo المستودع
Actions سجل البناء

---

📞 15. ملاحظات المطوّر

المطوّر: مصطفى علي أكر (@mezo2021)

المرجع:

· Takashi Kojima
· Japan Soroban Association
· ChatGPT — للتعليم التكيفي

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-09-26 — بداية الجلسة 5
الحالة: 🟢 التطبيق يعمل + بنك v2 (~1080 سؤال) — 90% مكتمل

</div>
```

---