 PROJECT_PLAN.md المحدَّث — جاهز .

---

```markdown
# 📘 SorobanMind v2 — Master Plan

> **آخر تحديث:** 2026-09-25 (الجلسة 4 — الشاشات التفاعلية مكتملة)
> **الحالة:** 🟢 التطبيق يعمل + 20 مهارة + بنك v2 (~1080 سؤال)
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
| **L1** | S3-S9 | جمع مباشر + طرح مباشر + أصدقاء 5 + أصدقاء 10 + مختلط | 🧒 (5-12) |
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
├── bank.ts                      ← 🗑️ (مهجور — يحتفظ به للتوافق)
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

العدّاد: تصاعدي + توهج أحمر عند 60%.

---

🏗️ 5. البنية الكاملة

```

src/
├── App.tsx                          ✅ (كل المسارات مربوطة)
├── types.ts                         ✅ (كل الشاشات)
│
├── store/
│   └── progressStore.ts             ✅ (Zustand + persist + WeakSkills)
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
├── screens/                         ✅
│   ├── WelcomeScreen.tsx            ✅
│   ├── RoleSelection.tsx            ✅
│   ├── HeroDashboard.tsx            ✅ (بطاقتان + Placement)
│   ├── GuardianDashboard.tsx        ✅
│   ├── CategoryScreen.tsx           ✅ (4 أزرار لكل مستوى)
│   ├── LevelScreen.tsx              ✅
│   ├── PracticeScreen.tsx           ✅ (bank-v2 تكيفي)
│   ├── AnzanScreen.tsx              ✅ (Flash + Regular)
│   ├── AudioAnzanScreen.tsx         ✅ (TTS)
│   ├── PlacementTestScreen.tsx      ✅ (40 سؤالاً / 20 دقيقة)
│   └── EnrichmentScreen.tsx         ✅ (قديم)
│
└── 🗑️ محذوف:
├── CurriculumScreen.tsx         (حُذف)
├── CategorySelectScreen.tsx     (حُذف)
├── bank-supplement.ts           (حُذف)

```

---

🎯 6. الشاشات التفاعلية — التفاصيل

📖 PracticeScreen (تمرّن):

· 5 أسئلة من bank-v2
· محاولة واحدة
· زر "تحقق" دائم
· انتقال يدوي (زر "التالي")
· تسجيل الضعف (recordWeaknessAttempt)
· 5 XP لكل إجابة صحيحة
· 75% للنجاح

🧠 AnzanScreen (الأنزان البصري):

· وضعان: Flash + Regular
· Flash: الأرقام تظهر واحداً واحداً (3s)
· Regular: السؤال كاملاً
· عدّاد تصاعدي + توهج 60%
· زر تحقق + يدوي
· 5 أسئلة

🎧 AudioAnzanScreen (الأنزان السمعي):

· TTS يقرأ الأرقام
· بدون عرض بصري
· زر "إعادة السمع" (مرة واحدة)
· نفس منطق البصري

📝 PlacementTestScreen:

· 40 سؤالاً من EXAM_POOL_1 + EXAM_POOL_2
· 5 من كل مستوى (L0-L7)
· 20 دقيقة
· 200 نقطة → 100 درجة
· عتبة النجاح: 20/25 لكل مستوى (80%)
· المستوى المُوصى به = أول مستوى رسب فيه

🏆 CategoryExamScreen (قادم):

· 20 سؤالاً للقسم 1 (10 دقائق)
· 40 سؤالاً للقسم 2 (20 دقيقة)
· محاولتان لكل سؤال
· بدون وقت لكل سؤال

---

🎯 7. نظام تتبّع الضعف

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

🎨 8. الإثراء

🧒 قسم 1:

# الشاشة الحالة
1 ✨ أسرار الضرب ✅ جاهز (من v1)
2 🖐️ رياضيات الأصابع ⏳ قادم

🧑 قسم 2:

# الشاشة الحالة
1 🏹 الضرب التقاطعي ✅ جاهز (من v1)

---

🗺️ 9. خارطة الطريق

✅ الجلسة 1 — التأسيس

· محرك السوروبان + i18n + Welcome → Role → Dashboard

✅ الجلسة 2 — البنك التكيفي (700)

· masteryTracker + problemGenerator + adaptiveEngine
· bank-raw (200) + 4 أقسام

✅ الجلسة 3 — توسيع البنك (900)

· 200 سؤال متقدم (Part 1، 2، 3)
· تحديد المنهج: 8 مستويات + 20 مهارة
· تصميم الشاشات

✅ الجلسة 4 — البنية الجديدة (اليوم)

· bank-v2/ كامل (part-01 → 04)
· bank-exam.ts (~350 سؤال)
· placement-engine.ts
· progressStore.ts مُدمَج
· types.ts + App.tsx + HeroDashboard + CategoryScreen + LevelScreen
· PracticeScreen + AnzanScreen + AudioAnzanScreen محدَّثة
· PlacementTestScreen.tsx

🎯 الجلسة 5 — الامتحانات

· CategoryExamScreen.tsx
· تحديث examBank2.ts (40+40)

🎯 الجلسة 6 — الإثراء

· FingersScreen.tsx
· ربط MagicSecrets + CrossMultiplication

🎯 الجلسة 7 — الدروس والمحتوى

· بناء دروس L0-L7 (تعلم + جرب)
· ربط القصص من v1

🎯 الجلسة 8 — لوحة ولي الأمر

· تحديث GuardianDashboard بتقرير الضعف
· رسوم بيانية

🎯 الجلسة 9 — الإكمال

· PWA (offline)
· APK (Google Play)

---

📊 10. الإحصائيات

المقياس القيمة
الملفات المكتملة ~95
الملفات المتبقية ~10
نسبة الإنجاز ~88%
أسئلة البنك ~1080
المستويات 8 (L0-L7)
المهارات 20 (S1-S20)
الأقسام 2 (5-12 / 13+)
الشاشات التفاعلية 4 (Practice + Anzan + Audio + Placement)

---

🔗 11. روابط مهمة

الرابط الوصف
Live Demo التطبيق
GitHub Repo المستودع
Actions سجل البناء

---

📞 12. ملاحظات المطوّر

المطوّر: مصطفى علي أكر (@mezo2021)

المرجع:

· Takashi Kojima
· Japan Soroban Association
· ChatGPT — للتعليم التكيفي

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-09-25 — نهاية الجلسة 4
الحالة: 🟢 التطبيق يعمل + بنك v2 (~1080 سؤال) — 88% مكتمل

</div>
```

--