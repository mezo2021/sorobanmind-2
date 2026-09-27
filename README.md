
---

📂 الملف: PROJECT_PLAN.md 


```markdown
# 📘 SorobanMind v2 — Master Plan

> **آخر تحديث:** 2026-09-27 (الجلسة 8 — بناء L0 كاملاً)
> **الحالة:** 🟢 التطبيق يعمل + بنك v2 (~1080) + L0 كامل (دروس + LearnScreen + اختبار)
> **الرابط:** https://mezo2021.github.io/sorobanmind-2
> **المستودع:** https://github.com/mezo2021/sorobanmind-2

---

## 🎯 1. الرؤية

**SorobanMind** = تطبيق تعليمي عربي تفاعلي لتعلّم السوروبان الياباني.

### الأهداف:
1. **منهج ياباني أصيل** (Takashi Kojima)
2. **تعليم تكيفي** — أسئلة مخصّصة لكل طالب
3. **فئتان عمريتان:**
   - 🧒 قسم 1 (5–12): L0 → L3 + إثراء
   - 🧑 قسم 2 (13+): L4 → L7 + إثراء

### الميزة التنافسية:
> **محرك تكيفي حقيقي** يفهم مهارات الطفل، يحدد نقاط ضعفه، ويولّد أسئلة علاجية تلقائياً.

---

## 🧠 2. المنهج — 8 مستويات (L0-L7) + 20 مهارة (S1-S20)

| المستوى | المهارات | المحتوى | القسم |
|---------|----------|---------|-------|
| **L0** | S1, S2 | تعرّف + أرقام 0-9 + قيمة مكانية | 🧒 |
| **L1** | S3-S9 | جمع + طرح + أصدقاء 5 + أصدقاء 10 + مختلط | 🧒 |
| **L2** | S10-S12 | الضرب | 🧒 |
| **L3** | S13-S15 | القسمة | 🧒 |
| **L4** | S16 | جمع/طرح متقدم | 🧑 |
| **L5** | S17 | ضرب/قسمة متقدم | 🧑 |
| **L6** | S18 | كسور عشرية | 🧑 |
| **L7** | S19, S20 | جذور تربيعية + تكعيبية | 🧑 |

### بنية كل مستوى (تسلسل إجباري):

```

📖 تعلّم (قائمة دروس)
↓ إتمام كل الدروس
✏️ تمرّن (5 أسئلة تكيفية من bank-v2)
↓ نجاح 75%
🧠 أنزان بصري (Flash / عادي)
↓ نجاح 75%
🎧 أنزان سمعي (TTS)
↓ نجاح 75%
🎓 اختبار المستوى (10 أسئلة صعبة — 60 ثانية — 80%)
↓ نجاح 80%
📖 المستوى التالي

```

---

## 🔒 3. منطق القفل

| العنصر | يُفتح بعد |
|--------|-----------|
| 🎨 الإثراء | مفتوح دائماً |
| 📖 L0 | مفتوح |
| 📖 تعلّم (قائمة دروس) | مفتوح دائماً (لكن الدروس داخلية متسلسلة) |
| ✏️ تمرّن N | إنهاء **كل دروس** L(N) |
| 🧠 أنزان N بصري | نجاح تمرّن N |
| 🎧 أنزان N سمعي | نجاح بصري N |
| 🎓 اختبار N | نجاح سمعي N |
| 📖 L(N+1) | نجاح اختبار N |
| 🏆 امتحان القسم 1 | إتمام L0-L3 كاملاً + كل الاختبارات |
| 🎓 القسم 2 (L4) | نجاح 80% في امتحان القسم 1 |
| 📝 Placement Test | 48 ساعة بين المحاولات |

### قفل الدروس الداخلية (داخل المستوى):
- أول درس مفتوح
- كل درس يُفتح بعد إتمام **جرب** للدرس السابق
- الحفظ في: `soroban_completed_lessons` (مفتاح localStorage)

---

## 📚 4. بنك الأسئلة

### 📁 البنية:

```

src/data/
├── bank-v2/
│   ├── types.ts                 ← QuestionTiming + BankQuestion
│   ├── part-01.ts               ← S1-S9 (~285 سؤال)
│   ├── part-02.ts               ← S10-S15 (150 سؤال)
│   ├── part-03.ts               ← S16-S17 (80 سؤال)
│   ├── part-04.ts               ← S18-S20 (70 سؤال)
│   ├── bank-exam.ts             ← امتحانات 1 و 2
│   ├── placement-engine.ts      ← امتحان تحديد المستوى
│   └── index.ts                 ← الواجهة الموحّدة + امتحانات القسم
│
├── bank-raw/                    ← 400 سؤال خام (يستخدمها تحديد المستوى)
├── bank-linked.ts               ← دمج bank-v2 + bank-raw
├── bank.ts / bank-adapter.ts    ← 🗑️ مهجور
└── curriculum.ts                ← 8 مستويات + قسمان

```

### 📊 التوزيع:

| المصدر | العدد | الاستخدام |
|--------|-------|-----------|
| bank-v2/part-01 → 04 | ~585 | تمرّن + أنزان + امتحانات القسم |
| bank-exam (EXAM_POOL_1+2) | ~350 | امتحان تحديد المستوى |
| bank-raw | 400 | تحديد المستوى (35 سؤالاً) |
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
  maxMs: number;        // الحد الأقصى
}
```

🎯 تصنيف السرعة:

التصنيف القاعدة الشارة
⚡ قياسي ≤ 50% من answerMs 🏅 شارة مهارة
✅ مقبول ≤ 75% من answerMs —
🐢 بطيء 75% من answerMs —

---

🎨 5. نظام نمط الأرقام (عربي / لاتيني)

📁 الملفات:

```
src/
├── utils/numberStyle.ts             ← تحويل الأرقام
├── store/numberStyleStore.ts        ← Zustand Store
├── components/NumberStyleToggle.tsx ← زر التبديل
└── screens/Header.tsx               ← الزر الرئيسي
```

🎯 التطبيق:

· ✅ Header + Practice + Anzan + AudioAnzan + PlacementTest
· ✅ CategoryScreen + LevelScreen + Soroban2D5 + SorobanPlayground
· ✅ CategoryExam + LearnScreen + LessonScreen + IntroductionScreen + LevelTestScreen
· ⏳ قيد التطبيق: GuardianDashboard

---

🏗️ 6. البنية الكاملة

```
src/
├── App.tsx                          ✅ (كل المسارات + learn-* + level-test-*)
├── types.ts                         ✅
│
├── store/
│   ├── progressStore.ts             ✅ (Zustand + persist)
│   ├── numberStyleStore.ts          ✅
│   └── masteryBadgesStore.ts        ✅
│
├── utils/
│   ├── numberStyle.ts               ✅
│   ├── arabicNumbers.ts             ✅
│   ├── audioAnzanBadges.ts          ✅
│   ├── badgeChecker.ts              ✅
│   ├── certificateGenerator.ts      ✅
│   ├── numerals.ts                  ✅
│   └── skillsChecker.ts             ✅
│
├── curriculum/
│   ├── types.ts                     ✅ (مجمَّد — يستخدمه bank-v2 + engine)
│   └── lessons/                     ✅ 🆕 (المنهج الجديد)
│       ├── types.ts                 ✅ (LessonNode)
│       ├── index.ts                 ✅ (registry)
│       └── L0/
│           ├── intro.ts             ✅ (المقدمة — 7 صفحات)
│           ├── S1.ts                ✅ (تمثيل 0-9)
│           ├── S2.ts                ✅ (القيمة المكانية)
│           └── test-pool.ts         ✅ (30 سؤال اختبار)
│
├── engine/                          ✅ (مجمَّد)
│   ├── sorobanMoves.ts
│   ├── sorobanEngine.ts
│   ├── masteryTracker.ts
│   ├── problemGenerator.ts
│   └── adaptiveEngine.ts
│
├── data/                            ✅
│   ├── bank-v2/                     ✅ (~585 + ~350)
│   ├── bank-raw/                    ✅ (400)
│   ├── bank-linked.ts               ✅
│   ├── curriculum.ts                ✅ (8 مستويات + قسمان)
│   ├── data.ts                      ⚠️ (v1 — غير مربوط)
│   └── learnModules.ts              ⚠️ (v1 — غير مربوط)
│
├── components/
│   ├── NumberStyleToggle.tsx        ✅
│   ├── AdaptiveFeedback.tsx         ✅
│   ├── Companion.tsx                ✅
│   ├── FloatingCompanion.tsx        ✅ (البطل أسفل يمين)
│   ├── SorobanaCompanion.tsx        ✅ (المعلمة)
│   ├── CharacterSelector.tsx        ✅
│   ├── DebugOverlay.tsx             ✅
│   ├── BadgeModal.tsx               ✅
│   ├── avatars/ImageAvatar.tsx      ✅
│   └── soroban2d5/                  ✅
│
├── hooks/
│   ├── useGameStats.ts              ✅
│   ├── useSound.ts                  ✅
│   ├── useConfetti.ts               ✅
│   ├── useCharacterVoice.ts         ✅
│   ├── useSorobanaVoice.ts          ✅ (TTS + MP3)
│   ├── useSpeech.ts                 ✅
│   └── useQuests.ts                 ✅
│
└── screens/                         ✅
    ├── WelcomeScreen.tsx            ✅
    ├── RoleSelection.tsx            ✅
    ├── HeroDashboard.tsx            ✅
    ├── GuardianDashboard.tsx        ✅ (يحتاج تحديث للبنية الجديدة)
    ├── Header.tsx                   ✅
    ├── CategoryScreen.tsx           ✅
    ├── LevelScreen.tsx              ✅ (زر "تعلّم" يعمل + اختبار مضاف)
    ├── PracticeScreen.tsx           ✅
    ├── AnzanScreen.tsx              ✅
    ├── AudioAnzanScreen.tsx         ✅
    ├── PlacementTestScreen.tsx      ✅
    ├── SorobanPlayground.tsx        ✅
    ├── CategoryExamScreen.tsx       ✅
    ├── EnrichmentScreen.tsx         ✅
    ├── LearnScreen.tsx              ✅ 🆕 (قائمة دروس المستوى)
    ├── LessonScreen.tsx             ✅ 🆕 (شاهد + جرب)
    ├── IntroductionScreen.tsx       ✅ 🆕 (المقدمة — 7 صفحات)
    ├── LevelTestScreen.tsx          ✅ 🆕 (اختبار 10 أسئلة)
    ├── MagicSecretsScreen.tsx       ⚠️ (موجود — غير مربوط)
    ├── CrossMultiplicationScreen.tsx ⚠️ (موجود — غير مربوط)
    ├── MultiplicationScreen.tsx     ⚠️ (موجود — غير مربوط)
    ├── DivisionScreen.tsx           ⚠️ (موجود — غير مربوط)
    └── CertificateScreen.tsx        ⚠️ (موجود — غير مربوط)
```

---

🎯 7. الشاشات التفاعلية

📖 LearnScreen (🆕 — قائمة دروس المستوى):

· يعرض دروس L0-L7 (مقدمة + S1 + S2...)
· قفل متسلسل: كل درس يُفتح بعد السابق
· البطل أسفل يمين
· زر تبديل نمط الأرقام
· Props: levelId, onBack, onOpenLesson, playSound

📖 LessonScreen (🆕 — شاشة الدرس):

· تابان: شاهد / جرّب
· شاهد: قصة + زر "موجز القصة" (MP3) + مفهوم + قاعدة + أمثلة بخطوات
· جرّب: نوعان:
  · read: Soroban يعرض الرقم → الطفل يختار من 4 خيارات
  · build: Soroban تفاعلي → الطفل يحرّك الخرزات → [تحقق]
· محاولتان لكل سؤال (ثم كشف الحل)
· زر "أنهيت الدرس" يتفعل بعد كل "جرب"
· البطل + المعلمة (SorobanaCompanion)
· Props: lessonId, onBack, onNext, onComplete, playSound, onXP

🎬 IntroductionScreen (🆕 — المقدمة):

· 7 صفحات (تمرير عبر [التالي])
· تاريخ المعداد + صورة SVG
· القاعدة الذهبية + الفوائد + الدراسات العلمية
· زر 🏠 Home
· البطل أسفل يمين
· Props: lessonId, onBack, onComplete, playSound

🎓 LevelTestScreen (🆕 — اختبار المستوى):

· 10 أسئلة صعبة (3 من S1 + 7 من S2)
· 60 ثانية فقط
· محاولة واحدة لكل سؤال
· بلا كشف الحل
· بلا بطل / معلمة
· 80% للنجاح
· 24 ساعة بعد الفشل
· Props: levelId, onBack, onPass, playSound

📖 PracticeScreen:

· 5 أسئلة من bank-v2
· محاولة واحدة + زر "تحقق" + "التالي" يدوي
· عدّاد تصاعدي + توهج 70%
· الأعمدة = max(السلسلة، الناتج)
· تسجيل الضعف (recordWeaknessAttempt)
· 5 XP لكل إجابة صحيحة

🧠 AnzanScreen:

· وضعان: Flash + عادي
· Flash: 2 ثانية لكل رقم
· عادي: عرض السؤال كاملاً + TTS
· الأعمدة = max(السلسلة، الناتج)
· 5 أسئلة + AdaptiveFeedback

🎧 AudioAnzanScreen:

· TTS يقرأ الأرقام بالعربية
· بدون عرض بصري
· زر "إعادة السمع" (مرة واحدة)
· 5 أسئلة + AdaptiveFeedback

🎮 SorobanPlayground:

· وضع حر — بلا أسئلة ولا مؤقت
· اختيار الأعمدة: 3 / 6 / 9 / 13
· حجم الخرزات تلقائي
· زر 🏠 + 🔄 + "إعادة الكل"

📝 PlacementTestScreen:

· 35-40 سؤالاً من bank-raw
· 20 دقيقة
· الإجابة على السوروبان
· 5 مستويات × 5 أسئلة
· المستوى المُوصى به = أول مستوى رسب فيه

🏆 CategoryExamScreen:

· Exam 1 (Kids): 20 سؤالاً — 10 دقائق (L0:3, L1:7, L2:5, L3:5)
· Exam 2 (Teens): 40 سؤالاً — 20 دقيقة (10 لكل مستوى)
· محاولتان لكل سؤال (1 / 0.5 نقطة)
· 80% للنجاح + 48 ساعة انتظار
· نجاح Exam 1 → فتح القسم 2

---

🎯 8. نظام تتبّع الضعف

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

القاعدة:

```
weaknessScore = (1 - accuracy) × 60
              + 20 إذا accuracy < 50%
              + 20 إذا avgTimeMs > 15000

عتبة "ضعيف" = 50
نسبة الأسئلة العلاجية = 70%
```

التطبيق:

· recordWeaknessAttempt(skillId, correct, timeMs) — في كل إجابة
· getPracticeQuestions(num) — 70% ضعيف + 30% عادي
· getWeakSkills() — للوحة ولي الأمر

---

🏅 9. نظام الشارات

القاعدة:

· 🏅 قياسي (≤ 50% من answerMs) → شارة فورية
· ✅ مقبول (≤ 75%) → لا شارة
· 🐢 بطيء (> 75%) → لا شارة

التخزين:

```json
// soroban_mastery_badges
{
  "S3": { "masteredAt": 1234567890, "bestTimeMs": 3500 }
}
```

الشارات المستقبلية (⏳):

· 🥉 برونزية: 1 إجابة صحيحة بزمن قياسي
· 🥈 فضية: 3 إجابات متتالية بزمن قياسي
· 🥇 ذهبية: 5 إجابات متتالية بزمن قياسي

---

📊 10. نظام التعليم التكيفي

بعد كل جلسة (تمرّن/أنزان):

```
╔══════════════════════════════════════════╗
║  📊 ملاحظات التعليم التكيفي              ║
╠══════════════════════════════════════════╣
║  ✅ مهارات أتقنتها (بزمن قياسي)          ║
║  👍 مهارات جيدة (زمن مقبول)              ║
║  ⚠️ مهارات تحتاج تقوية                   ║
║  📉 مهارات هذا المستوى (مراجعة)           ║
║  📚 مهارات من مستويات أخرى                ║
╚══════════════════════════════════════════╝
```

ميزات قادمة:

· 🔄 جلسة مراجعة ذكية
· 📊 خريطة ضعف بصرية (heatmap)
· 🎯 توصيات مخصّصة (careless / accuracy / speed / both)
· 📈 مقارنة الطفل بنفسه

---

🎨 11. الإثراء — الحالة

🧒 قسم 1 (5-12):

# الشاشة الحالة
1 🖐️ رياضيات الأصابع (داخل EnrichmentScreen) ⚠️ موجودة — زر لا يعمل
2 ✨ أسرار جدول الضرب (داخل EnrichmentScreen) ⚠️ موجودة — زر لا يعمل
3 🪄 أسرار الضرب السحرية (secrets) ⚠️ MagicSecretsScreen موجود — غير مربوط
4 🎮 ألعاب تعليمية (مربعات + مكعبات) ❌ قادمة

🧑 قسم 2 (13+):

# الشاشة الحالة
1 🏹 الضرب التقاطعي (cross-multiplication) ⚠️ CrossMultiplicationScreen موجود — غير مربوط
2 📐 الضرب (multiplication) ⚠️ MultiplicationScreen موجود — غير مربوط
3 ➗ القسمة (division) ⚠️ DivisionScreen موجود — غير مربوط

📋 المطلوب (قريباً):

· ربط الأزرار الأربعة في App.tsx (استبدال ComingSoonScreen)
· إصلاح زر "أسرار جدول الضرب" داخل EnrichmentScreen

---

📖 12. الدروس والمحتوى

✅ الجديد (الجلسة 8):

```
src/curriculum/lessons/
├── types.ts                 ✅ (LessonNode)
├── index.ts                 ✅ (registry + دوال استعلام)
└── L0/
    ├── intro.ts             ✅ (7 صفحات مقدمة)
    ├── S1.ts                ✅ (10 أمثلة + 10 جرب)
    ├── S2.ts                ✅ (10 أمثلة + 10 جرب)
    └── test-pool.ts         ✅ (30 سؤال صعب — اختبار)
```

📋 المتبقي:

· L1 (7 دروس: S3-S9)
· L2 (3 دروس: S10-S12)
· L3 (3 دروس: S13-S15)
· L4-L7 (5 دروس: S16-S20)

🎵 الأصوات:

· public/audio/stories/story-0.mp3 → story-9.mp3 (10 ملفات)
· تربط بالدروس عبر storyAudioId
· الدروس الجديدة: TTS مؤقت (حتى التسجيل)

⚠️ ملفات v1 (غير مربوطة):

· src/data/data.ts (دروس v1)
· src/data/learnModules.ts (وحدات v1 — 10 دروس)

القرار: نحتفظ بها للمرجع، لكن نستخدم curriculum/lessons/ الجديد.

---

🗺️ 13. خارطة الطريق

✅ الجلسات 1-7 (مكتملة):

· الجلسة 1: التأسيس + محرك السوروبان
· الجلسة 2: البنك التكيفي (700)
· الجلسة 3: توسيع البنك (900)
· الجلسة 4: bank-v2 + بنية جديدة
· الجلسة 5: الأنزان + النمط + التكيف
· الجلسة 6: الشارات + Playground
· الجلسة 7: الامتحانات (1 + 2)

✅ الجلسة 8 — بناء L0 كاملاً (اليوم):

· curriculum/lessons/types.ts ✅
· curriculum/lessons/L0/intro.ts ✅
· curriculum/lessons/L0/S1.ts ✅
· curriculum/lessons/L0/S2.ts ✅
· curriculum/lessons/L0/test-pool.ts ✅
· curriculum/lessons/index.ts ✅
· screens/LearnScreen.tsx ✅ (قائمة دروس)
· screens/LessonScreen.tsx ✅ (شاهد + جرب)
· screens/IntroductionScreen.tsx ✅ (7 صفحات)
· screens/LevelTestScreen.tsx ✅ (10 أسئلة)
· تعديل LevelScreen.tsx ✅ (زر "تعلّم" يعمل + اختبار)
· تعديل App.tsx ✅ (routes: learn-, intro-, lesson-view-, level-test-)

🎯 الجلسة 9 — توسيع المنهج:

· بناء L1 كاملاً (7 دروس: S3-S9)
· بناء L2 (3 دروس: S10-S12)
· بناء L3 (3 دروس: S13-S15)
· اختبارات L1-L3

🎯 الجلسة 10 — القسم الثاني:

· بناء L4-L7 (5 دروس: S16-S20)
· اختبارات L4-L7
· TTS مؤقت للدروس بدون MP3

🎯 الجلسة 11 — الإثراء والربط:

· ربط الإثراء الأربعة (secrets + cross-mult + mult + division)
· إصلاح زر "أسرار جدول الضرب"
· ألعاب تعليمية

🎯 الجلسة 12 — التعليم التكيفي المتقدم:

· جلسة مراجعة ذكية
· تشخيص دقيق للأخطاء
· خريطة ضعف بصرية

🎯 الجلسة 13 — الإكمال:

· CertificateScreen (من v1)
· GuardianDashboard — تحديث للبنية الجديدة
· PWA + APK

---

📊 14. الإحصائيات

المقياس القيمة
الملفات المكتملة ~125
الملفات المتبقية ~15
نسبة الإنجاز ~90%
أسئلة البنك ~1080
المستويات 8 (L0-L7)
المهارات 20 (S1-S20)
الأقسام 2 (5-12 / 13+)
الشاشات التفاعلية 10
الدروس المبنية 3 (L0: intro + S1 + S2)

---

🎯 15. الميزات المُنجَزة (الجلسة 8)

✅ بناء L0 كاملاً:

· 3 دروس (مقدمة + S1 + S2)
· 20 مثالاً محلولاً (10 لكل مهارة)
· 20 سؤال "جرب"
· 30 سؤال اختبار صعب
· 7 صفحات مقدمة (تاريخ + صورة SVG + فوائد + دراسات)

✅ شاشات جديدة:

· LearnScreen — قائمة دروس
· LessonScreen — شاهد + جرب
· IntroductionScreen — تمرير 7 صفحات
· LevelTestScreen — اختبار 60 ثانية

✅ تعديلات:

· LevelScreen — زر "تعلّم" يعمل + اختبار مضاف
· App.tsx — 4 routes جديدة
· curriculum/lessons/ — هيكل جديد

✅ المميزات التقنية:

· البطل + المعلمة في كل شاشات الدروس
· زر "موجز القصة" → MP3
· Soroban2D5 تفاعلي لـ "build"
· Soroban2D5 للعرض لـ "read"
· محاولتان لكل سؤال + كشف الحل
· LevelTestScreen: 24 ساعة انتظار

---

⚠️ 16. ملاحظات حرجة

1️⃣ التكامل مع GuardianDashboard:

· الخريطة الحالية مبنية على البنية القديمة (10 دروس)
· تحتاج تحديث للبنية الجديدة (8 مستويات + دروس داخلية)
· مفاتيح localStorage: soroban_completed_lessons + soroban_passed_level_tests

2️⃣ الإثراء:

· 4 شاشات موجودة (MagicSecrets, CrossMultiplication, Multiplication, Division)
· غير مربوطة بـ App.tsx
· إصلاح سهل: استبدال ComingSoonScreen بها

3️⃣ ملفات v1:

· data.ts + learnModules.ts
· غير مربوطة — للمرجع فقط
· القرار النهائي: أرشفتها بعد إتمام L1-L7

4️⃣ الدروس الناقصة:

· L1-L7: تحتاج قصص + أمثلة + أسئلة
· S10-S20: قصص جديدة (JSON مبدئي موجود)
· TTS مؤقت للدروس بدون MP3

5️⃣ ملفات curriculum/levels/ القديمة:

· حُذفت في الجلسة 8
· curriculum/types.ts بقي (يستخدمه bank-v2 + engine)

---

❓ 17. أسئلة للمناقشة

س1: ترتيب بناء L1-L7

· أ) نبني L1 كاملاً ثم L2 ثم L3 (تسلسل)
· ب) نبني S3-S9 (L1) في جلسة واحدة
· ج) نبدأ بـ L2 (الضرب) — أكثر متعة

اقتراحي: أ — تسلسل طبيعي.

س2: القصص لـ S10-S20

· أ) نستخدم JSON القصص (موجودة لكن قصيرة)
· ب) نكتب قصصاً جديدة بنفس أسلوب "الجدة 5"
· ج) نستخدم TTS للجميع

اقتراحي: ب — استمرارية الأسلوب.

س3: GuardianDashboard

· أ) نصلحه الآن
· ب) نتركه لبعد L1-L7
· ج) نصممه من جديد

اقتراحي: ب — بعد اكتمال المنهج.

س4: الإثراء

· أ) نربطه الآن (5 دقائق)
· ب) نتركه لبعد L1-L3
· ج) نصلح زر "أسرار جدول الضرب" فقط

اقتراحي: أ — سريع.

---

🔗 18. روابط مهمة

الرابط الوصف
Live Demo التطبيق
GitHub Repo المستودع
Actions سجل البناء

---

📞 19. المطوّر

مصطفى علي أكر (@mezo2021)

المراجع:

· Takashi Kojima — The Japanese Abacus
· Japan Soroban Association
· ChatGPT — للتعليم التكيفي

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-09-27 — نهاية الجلسة 8
الحالة: 🟢 التطبيق يعمل + L0 كامل — ~90% مكتمل

</div>
```

---

📝 ملاحظاتي (اقرأها بتمعّن)

✅ ما تم إنجازه فعلياً:

1. بناء L0 كاملاً — 3 دروس + اختبار
2. 4 شاشات جديدة — LearnScreen + LessonScreen + IntroductionScreen + LevelTestScreen
3. تعديل LevelScreen — زر "تعلّم" يعمل + اختبار مضاف
4. تعديل App.tsx — 4 routes جديدة
5. حذف curriculum/levels/ القديم — نُظّف المشروع

📊 التغييرات الرئيسية عن الملف الأصلي:

البند الأصلي الآن
نسبة الإنجاز 88% 90%
الشاشات التفاعلية 6 10
بنية الدروس curriculum/levels/ (قديم) curriculum/lessons/ (جديد)
L0 غير موجود ✅ كامل
اختبار L0 غير موجود ✅ موجود

⚠️ نقاط تحتاج انتباهك:

1. GuardianDashboard — الخريطة تحتاج تحديث (بسبب البنية الجديدة)
2. الإثراء — 4 شاشات جاهزة لكن غير مربوطة
3. ملفات v1 (data.ts, learnModules.ts) — للمرجع فقط
