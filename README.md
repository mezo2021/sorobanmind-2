📂 الملف: PROJECT_PLAN.md

```markdown
# 📘 SorobanMind v2 — Master Plan

> **آخر تحديث:** 2026-09-27 (الجلسة 8 — بناء L0 كاملاً + إصلاحات)
> **الحالة:** 🟢 التطبيق يعمل + بنك v2 (~1080) + L0 كامل + أنظمة صوتية تعمل
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

## 🧠 2. المنهج — 8 مستويات + 20 مهارة

| المستوى | المهارات | المحتوى | القسم | الحالة |
|---------|----------|---------|-------|--------|
| **L0** | S1, S2 | تعرّف + أرقام 0-9 + قيمة مكانية | 🧒 | ✅ **مكتمل** |
| **L1** | S3-S9 | جمع + طرح + أصدقاء 5 + أصدقاء 10 | 🧒 | 🔜 التالي |
| **L2** | S10-S12 | الضرب | 🧒 | ⏳ |
| **L3** | S13-S15 | القسمة | 🧒 | ⏳ |
| **L4** | S16 | جمع/طرح متقدم | 🧑 | ⏳ |
| **L5** | S17 | ضرب/قسمة متقدم | 🧑 | ⏳ |
| **L6** | S18 | كسور عشرية | 🧑 | ⏳ |
| **L7** | S19, S20 | جذور | 🧑 | ⏳ |

### بنية كل مستوى:

```

📖 تعلّم (قائمة دروس)
↓ إتمام كل الدروس
✏️ تمرّن (5 أسئلة من bank-v2)
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
| 📖 درس داخل L0 | أول درس مفتوح، الباقي متسلسل |
| ✏️ تمرّن N | إنهاء كل دروس L(N) |
| 🧠 أنزان بصري N | نجاح تمرّن N |
| 🎧 أنزان سمعي N | نجاح بصري N |
| 🎓 اختبار N | نجاح سمعي N |
| 📖 L(N+1) | نجاح اختبار N |
| 🏆 امتحان القسم 1 | إتمام L0-L3 كاملاً |
| 📝 Placement Test | 48 ساعة بين المحاولات |
| 🎓 اختبار L0 | **24 ساعة** بعد الفشل |

---

## 📚 4. بنك الأسئلة

### 📁 البنية:

```

src/data/
├── bank-v2/                     ← البنك الأساسي (~585 + ~350)
│   ├── types.ts
│   ├── part-01.ts (S1-S9)
│   ├── part-02.ts (S10-S15)
│   ├── part-03.ts (S16-S17)
│   ├── part-04.ts (S18-S20)
│   ├── bank-exam.ts
│   ├── placement-engine.ts
│   └── index.ts
│
├── bank-raw/                    ← 400 سؤال (تحديد المستوى)
├── bank-linked.ts               ← دمج
└── curriculum.ts                ← 8 مستويات

```

### 📊 التوزيع:

| المصدر | العدد | الاستخدام |
|--------|-------|-----------|
| bank-v2 | ~585 | تمرّن + أنزان + امتحانات |
| bank-exam | ~350 | امتحان تحديد المستوى |
| bank-raw | 400 | تحديد المستوى (35 سؤالاً) |
| **الإجمالي** | **~1080** | 🎯 |

### 🎯 نظام ID:

| البنك | الصيغة | مثال |
|-------|--------|------|
| bank-v2 | `L{level}-S{skill}-{seq}` | `L1-S3-001` |
| bank-exam | `EX{1-2}-S{skill}-{seq}` | `EX1-S3-001` |
| placement | `PL-L{level}-S{skill}-{seq}` | `PL-L0-S3-001` |
| test-pool | `L{level}-TEST-S{skill}-{seq}` | `L0-TEST-S1-01` |
| example | `L{level}-S{skill}-E{seq}` | `L0-S1-E1` |
| try | `L{level}-S{skill}-T{seq}` | `L0-S1-T1` |

### ⏱️ نظام التوقيت:

```typescript
interface QuestionTiming {
  displayMs?: number;   // للأنزان Flash فقط
  answerMs: number;     // الوقت المعياري
  maxMs: number;        // الحد الأقصى
}
```

🎯 تصنيف السرعة:

التصنيف القاعدة الشارة
⚡ قياسي ≤ 50% من answerMs 🏅 شارة مهارة
✅ مقبول ≤ 75% —
🐢 بطيء 75% —

---

🎨 5. نظام نمط الأرقام

📁 الملفات:

```
src/
├── utils/numberStyle.ts
├── store/numberStyleStore.ts
└── components/NumberStyleToggle.tsx
```

🎯 التطبيق:

· ✅ Header + Practice + Anzan + AudioAnzan + PlacementTest
· ✅ CategoryScreen + LevelScreen + Soroban2D5 + SorobanPlayground
· ✅ CategoryExam + LearnScreen + LessonScreen + IntroductionScreen + LevelTestScreen
· ⏳ GuardianDashboard

---

🏗️ 6. البنية الكاملة (الجلسة 8)

```
src/
├── App.tsx                          ✅ (كل المسارات + learn-* + level-test-*)
├── types.ts                         ✅
│
├── store/
│   ├── progressStore.ts             ✅
│   ├── numberStyleStore.ts          ✅
│   └── masteryBadgesStore.ts        ✅
│
├── utils/
│   ├── numberStyle.ts               ✅
│   ├── arabicNumbers.ts             ✅
│   ├── badgeChecker.ts              ✅
│   ├── certificateGenerator.ts      ✅
│   └── skillsChecker.ts             ✅
│
├── curriculum/
│   ├── types.ts                     ✅ (مجمَّد)
│   └── lessons/                     ✅ 🆕 (المنهج الجديد)
│       ├── types.ts                 ✅ (LessonNode)
│       ├── index.ts                 ✅ (registry)
│       └── L0/
│           ├── intro.ts             ✅ (7 صفحات)
│           ├── S1.ts                ✅ (10 أمثلة + 10 جرب)
│           ├── S2.ts                ✅ (10 أمثلة + 10 جرب)
│           └── test-pool.ts         ✅ (30 سؤال اختبار)
│
├── engine/                          ✅ (مجمَّد)
│   ├── sorobanMoves.ts
│   ├── sorobanEngine.ts
│   ├── masteryTracker.ts
│   ├── problemGenerator.ts
│   └── adaptiveEngine.ts
│
├── data/
│   ├── bank-v2/                     ✅ (~935)
│   ├── bank-raw/                    ✅ (400)
│   ├── bank-linked.ts               ✅
│   ├── curriculum.ts                ✅
│   ├── data.ts                      ⚠️ (v1 — غير مربوط)
│   └── learnModules.ts              ⚠️ (v1 — غير مربوط)
│
├── components/
│   ├── FloatingCompanion.tsx        ✅ (البطل)
│   ├── SorobanaCompanion.tsx        ✅ (المعلمة)
│   ├── CharacterSelector.tsx        ✅
│   ├── Companion.tsx                ✅
│   ├── NumberStyleToggle.tsx        ✅
│   ├── AdaptiveFeedback.tsx         ✅
│   ├── DebugOverlay.tsx             ✅
│   ├── BadgeModal.tsx               ✅
│   ├── avatars/ImageAvatar.tsx      ✅
│   └── soroban2d5/                  ✅ (6 ملفات)
│
├── hooks/
│   ├── useGameStats.ts              ✅
│   ├── useSound.ts                  ✅
│   ├── useConfetti.ts               ✅
│   ├── useCharacterVoice.ts         ✅
│   ├── useSorobanaVoice.ts          ✅ (TTS + MP3 — مُصلَح)
│   ├── useSpeech.ts                 ✅
│   └── useQuests.ts                 ✅
│
└── screens/                         ✅ (18 ملف)
    ├── WelcomeScreen.tsx            ✅ (7 مميزات)
    ├── RoleSelection.tsx            ✅
    ├── HeroDashboard.tsx            ✅
    ├── GuardianDashboard.tsx        ⚠️ (يحتاج تحديث)
    ├── Header.tsx                   ✅
    ├── CategoryScreen.tsx           ✅
    ├── LevelScreen.tsx              ✅ (زر تعلّم + اختبار)
    ├── PracticeScreen.tsx           ✅
    ├── AnzanScreen.tsx              ✅
    ├── AudioAnzanScreen.tsx         ✅
    ├── PlacementTestScreen.tsx      ✅
    ├── SorobanPlayground.tsx        ✅
    ├── CategoryExamScreen.tsx       ✅
    ├── EnrichmentScreen.tsx         ✅
    ├── LearnScreen.tsx              ✅ 🆕 (قائمة دروس)
    ├── LessonScreen.tsx             ✅ 🆕 (شاهد + جرب)
    ├── IntroductionScreen.tsx       ✅ 🆕 (7 صفحات)
    ├── LevelTestScreen.tsx          ✅ 🆕 (10 أسئلة)
    ├── MagicSecretsScreen.tsx       ⚠️ (موجود — غير مربوط)
    ├── CrossMultiplicationScreen.tsx ⚠️ (موجود — غير مربوط)
    ├── MultiplicationScreen.tsx     ⚠️ (موجود — غير مربوط)
    ├── DivisionScreen.tsx           ⚠️ (موجود — غير مربوط)
    └── CertificateScreen.tsx        ⚠️ (موجود — غير مربوط)
```

🔊 الملفات الصوتية (public/):

```
public/
├── audio/                    ← أصوات سوروبانا (12 ملف)
│   ├── welcome-sorobana.mp3
│   ├── greeting-1/2/3.mp3
│   ├── teaching-1/2/3.mp3
│   ├── correct-1/2.mp3
│   ├── wrong-1/2.mp3
│   └── end-lesson.mp3
│
├── stories/                  ← قصص MP3 (10 ملفات)
│   ├── story-0.mp3 → story-9.mp3
│   └── README.md
│
└── images/
    └── (فارغ حالياً — نستخدم Soroban2D5)
```

---

🎯 7. الشاشات التفاعلية (10)

📖 LearnScreen 🆕

· قائمة دروس المستوى (مقدمة + S1 + S2...)
· قفل متسلسل
· البطل أسفل يمين
· زر تبديل نمط الأرقام
· Props: levelId, onBack, onOpenLesson, playSound

📖 LessonScreen 🆕

· تابان: شاهد / جرّب
· شاهد: قصة (MP3) + مفهوم + قاعدة + أمثلة بخطوات
· جرّب:
  · read: Soroban يعرض الرقم → 4 خيارات
  · build: Soroban تفاعلي → [تحقق]
· محاولتان لكل سؤال
· 🆕 صوت سوروبانا + فقاعة "أحسنت! 🌟"
· Props: lessonId, onBack, onNext, onComplete, playSound, onXP

🎬 IntroductionScreen 🆕

· 7 صفحات تمرير
· 🆕 يستخدم Soroban2D5 بـ 13 عموداً (بدل SVG)
· زر 🏠 Home
· Props: lessonId, onBack, onComplete, playSound

🎓 LevelTestScreen 🆕

· 10 أسئلة صعبة (3 من S1 + 7 من S2)
· 60 ثانية فقط
· محاولة واحدة
· بلا كشف الحل
· 80% للنجاح + 24 ساعة بعد الفشل
· Props: levelId, onBack, onPass, playSound

📖 PracticeScreen

· 5 أسئلة من bank-v2
· عدّاد تصاعدي + توهج 70%
· 5 XP لكل إجابة
· 75% للنجاح

🧠 AnzanScreen

· Flash (2s) + عادي
· TTS في الوضع العادي
· 5 أسئلة + AdaptiveFeedback

🎧 AudioAnzanScreen

· TTS يقرأ الأرقام بالعربية
· بلا عرض بصري
· زر "إعادة السمع" (مرة واحدة)

🎮 SorobanPlayground

· وضع حر — بلا أسئلة
· 3 / 6 / 9 / 13 عمود
· زر 🏠 + 🔄

📝 PlacementTestScreen

· 35-40 سؤالاً من bank-raw
· 20 دقيقة
· الإجابة على السوروبان

🏆 CategoryExamScreen

· Exam 1 (Kids): 20 سؤالاً — 10 دقائق
· Exam 2 (Teens): 40 سؤالاً — 20 دقيقة
· محاولتان لكل سؤال (1 / 0.5 نقطة)
· 80% + 48 ساعة انتظار

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

المفاتيح:

· soroban_weak_skills_v2 — للضعف
· recordWeaknessAttempt(skillId, correct, timeMs)

---

🏅 9. نظام الشارات

القاعدة:

· 🏅 قياسي (≤ 50% answerMs) → شارة فورية
· ✅ مقبول (≤ 75%) → لا شارة

التخزين:

```json
// soroban_mastery_badges
{
  "S3": { "masteredAt": 1234567890, "bestTimeMs": 3500 }
}
```

الشارات المستقبلية (⏳):

· 🥉 برونزية: 1 إجابة قياسية
· 🥈 فضية: 3 متتالية
· 🥇 ذهبية: 5 متتالية

---

📊 10. نظام التعليم التكيفي

بعد كل جلسة:

```
📊 ملاحظات التعليم التكيفي
├── ✅ مهارات أتقنتها (بزمن قياسي)
├── 👍 مهارات جيدة (زمن مقبول)
├── ⚠️ مهارات تحتاج تقوية
├── 📉 مهارات هذا المستوى (مراجعة)
├── 📚 مهارات من مستويات أخرى
└── 💡 التوصية: أعد جلسة على المهارات أعلاه
```

ميزات قادمة (ملاحظات لاحقة):

· 🔗 ربط كل مهارة ضعيفة بتوصية لمراجعة درسها
  · مثال: ضعف في S2 → زر "راجع L0-S2"
  · يستخدم skillId → lesson-view-{level}-{skill}
· 🎯 زر "درس تمكين" — ينتقل لامتحان مصغّر مخصص للضعف
· 🔄 جلسة استدراك تلقائية

---

🎨 11. الإثراء — الحالة

🧒 قسم 1:

# الإثراء الشاشة الحالة
1 🖐️ رياضيات الأصابع EnrichmentScreen ✅ يعمل
2 ✨ أسرار جدول الضرب داخل EnrichmentScreen ⚠️ الزر لا يعمل
3 🪄 أسرار الضرب السحرية secrets ⚠️ MagicSecretsScreen موجود — غير مربوط
4 🎮 ألعاب تعليمية — ❌ قادمة

🧑 قسم 2:

# الإثراء الشاشة الحالة
1 🏹 الضرب التقاطعي cross-multiplication ⚠️ موجود — غير مربوط
2 📐 الضرب multiplication ⚠️ موجود — غير مربوط
3 ➗ القسمة division ⚠️ موجود — غير مربوط

المطلوب:

· ربط 4 شاشات في App.tsx (استبدال ComingSoonScreen)
· إصلاح زر "أسرار جدول الضرب" داخل EnrichmentScreen

---

📖 12. الدروس — الحالة

✅ L0 مكتمل:

```
src/curriculum/lessons/L0/
├── intro.ts             ✅ 7 صفحات
├── S1.ts                ✅ تمثيل 0-9
├── S2.ts                ✅ القيمة المكانية
└── test-pool.ts         ✅ 30 سؤال اختبار
```

الإحصاء:

· 3 دروس
· 20 مثالاً محلولاً
· 20 سؤال "جرب"
· 30 سؤال اختبار
· 7 صفحات مقدمة

🔜 التالي: L1 (7 دروس)

· S3: جمع مباشر
· S4: طرح مباشر
· S5: صديق 5 جمع
· S6: صديق 5 طرح
· S7: صديق 10 جمع
· S8: صديق 10 طرح
· S9: مختلط
· · اختبار L1

🎵 الأصوات:

· story-0.mp3 → story-9.mp3 (10 ملفات)
· تربط بالدروس عبر storyAudioId
· S1: story-1.mp3 | S2: story-2.mp3
· الدروس بدون MP3: TTS مؤقت

⚠️ ملفات v1 (للمرجع):

· data.ts + learnModules.ts — غير مربوطة

---

🗺️ 13. خارطة الطريق

✅ الجلسات 1-7:

· التأسيس + البنك التكيفي + الشارات + الامتحانات

✅ الجلسة 8 — بناء L0 + إصلاحات (اليوم):

· 🆕 curriculum/lessons/ (هيكل جديد)
· 🆕 L0/intro.ts (7 صفحات)
· 🆕 L0/S1.ts + L0/S2.ts
· 🆕 L0/test-pool.ts (30 سؤال)
· 🆕 LearnScreen.tsx
· 🆕 LessonScreen.tsx
· 🆕 IntroductionScreen.tsx
· 🆕 LevelTestScreen.tsx
· 🔧 تعديل LevelScreen.tsx (زر تعلّم + اختبار)
· 🔧 تعديل App.tsx (4 routes جديدة)
· 🐛 إصلاح storyPath في useSorobanaVoice
· 🐛 إصلاح SVG (استبدال بـ Soroban2D5)
· 🆕 إضافة speakCorrect + speakWrong في LessonScreen
· 🆕 فقاعة "أحسنت! 🌟" عند الإجابة الصحيحة
· 🎨 تحديث WelcomeScreen (7 مميزات)

🎯 الجلسة 9 — بناء L1 كاملاً:

· 7 دروس (S3-S9)
· اختبار L1
· تحديث lessons/index.ts

🎯 الجلسة 10 — بناء L2 + L3:

· L2: S10-S12 (3 دروس)
· L3: S13-S15 (3 دروس)
· اختبارات L2-L3

🎯 الجلسة 11 — بناء L4-L7:

· L4: S16
· L5: S17
· L6: S18
· L7: S19-S20
· TTS للجميع

🎯 الجلسة 12 — الإثراء والربط:

· ربط 4 شاشات الإثراء
· إصلاح زر "أسرار جدول الضرب"
· ألعاب تعليمية

🎯 الجلسة 13 — التكيف المتقدم:

· جلسة استدراك ذكية
· ربط كل مهارة ضعيفة بتوصية درسها
· خريطة ضعف بصرية
· شارات برونزية/فضية/ذهبية

🎯 الجلسة 14 — الإكمال:

· CertificateScreen
· GuardianDashboard (تحديث كامل)
· PWA + APK

---

📊 14. الإحصائيات

المقياس القيمة
الملفات المكتملة ~130
الملفات المتبقية ~12
نسبة الإنجاز ~91%
أسئلة البنك ~1080
المستويات 8 (L0-L7)
المهارات 20 (S1-S20)
الأقسام 2 (5-12 / 13+)
الشاشات التفاعلية 10
الدروس المبنية 3 (L0)
الملفات الصوتية 22 (12 + 10)

---

⚠️ 15. ملاحظات حرجة

1️⃣ GuardianDashboard:

· خريطة التقدم مبنية على البنية القديمة (10 دروس)
· تحتاج تحديث للبنية الجديدة:
  · soroban_completed_lessons (دروس داخلية)
  · soroban_passed_level_tests (اختبارات المستوى)
  · 8 مستويات × (مقدمة + مهارات)

2️⃣ الإثراء:

· 4 شاشات جاهزة — غير مربوطة
· إصلاح سريع: استبدال ComingSoonScreen

3️⃣ ملفات v1:

· data.ts + learnModules.ts — للمرجع فقط
· القرار: أرشفتها بعد إتمام L1-L7

4️⃣ الدروس الناقصة:

· L1-L7: تحتاج قصص + أمثلة + أسئلة
· القصص موجودة في JSON (من Claude سابقاً)
· TTS مؤقت للدروس بدون MP3

5️⃣ ربط المهارة بتوصية مراجعة (ميزة لاحقة):

· عند ضعف في S_x → عرض زر "راجع الدرس"
· الرابط: lesson-view-{level}-{skillId}
· مثال: S2 ضعيف → lesson-view-L0-S2
· · اقتراح "امتحان تمكين مصغّر" (10 أسئلة من نفس المهارة)

---

🎯 16. الميزات المُنجَزة (الجلسة 8)

🎬 بنية الدروس الجديدة:

· LessonNode (نوع شامل)
· registry موحّد
· دوال استعلام: getLessonsByLevel, getLessonById, getNextLesson, إلخ.

📱 4 شاشات جديدة:

· LearnScreen (قائمة دروس)
· LessonScreen (شاهد + جرب)
· IntroductionScreen (تمرير صفحات)
· LevelTestScreen (اختبار 60 ثانية)

🐛 إصلاحات:

· storyPath (حذف audio/)
· SVG المعداد (استبدال بـ Soroban2D5)
· أصوات سوروبانا (correct/wrong)
· فقاعة "أحسنت"

🎨 تحديثات بصرية:

· WelcomeScreen (7 مميزات)
· LevelScreen (زر "تعلّم" يعمل + اختبار)

---

🎯 17. المرتقب لاحقاً (Priority List)

# الميزة الأولوية الجلسة
1 بناء L1 (7 دروس) 🔴 عالية 9
2 بناء L2 + L3 🔴 عالية 10
3 بناء L4-L7 🔴 عالية 11
4 ربط الإثراء (4 شاشات) 🟠 متوسطة 12
5 إصلاح زر "أسرار جدول الضرب" 🟠 متوسطة 12
6 GuardianDashboard (تحديث) 🟠 متوسطة 12
7 ربط المهارة بتوصية درسها 🟠 متوسطة 13
8 جلسة استدراك ذكية 🟠 متوسطة 13
9 شارات برونزية/فضية/ذهبية 🟠 متوسطة 13
10 ألعاب تعليمية 🟡 منخفضة 14
11 CertificateScreen 🟠 متوسطة 14
12 PWA + APK 🟡 منخفضة 14

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
الحالة: 🟢 التطبيق يعمل + L0 كامل + أنظمة صوتية تعمل — ~91% مكتمل

</div>
```

---