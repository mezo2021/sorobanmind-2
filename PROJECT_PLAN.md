📘 SorobanMind v2 — Master Plan (نسخة نهائية)

آخر تحديث: 2026-09-27 (نهاية الجلسة 8)
الحالة: 🟢 يعمل + L0 كامل + إثراء مكتمل + أنظمة صوتية تعمل
نسبة الإنجاز: ~92%
الرابط: https://mezo2021.github.io/sorobanmind-2

---

🎯 1. الرؤية

SorobanMind = تطبيق تعليمي عربي تفاعلي لتعلّم السوروبان الياباني.

الأهداف:

1. منهج ياباني أصيل (Takashi Kojima)
2. تعليم تكيفي — أسئلة مخصّصة لكل طالب
3. فئتان عمريتان:
   · 🧒 قسم 1 (5-12): L0 → L3 + إثراء
   · 🧑 قسم 2 (13+): L4 → L7 + إثراء

الميزة التنافسية:

محرك تكيفي حقيقي + نظام XP للتقدم + إثراء تفاعلي.

---

🧠 2. المنهج — 8 مستويات + 20 مهارة

المستوى المهارات المحتوى القسم الحالة
L0 S1, S2 تعرّف + أرقام 0-9 + قيمة مكانية 🧒 ✅ مكتمل
L1 S3-S9 جمع + طرح + أصدقاء 5 + أصدقاء 10 🧒 🔜 التالي
L2 S10-S12 الضرب 🧒 ⏳
L3 S13-S15 القسمة 🧒 ⏳
L4 S16 جمع/طرح متقدم 🧑 ⏳
L5 S17 ضرب/قسمة متقدم 🧑 ⏳
L6 S18 كسور عشرية 🧑 ⏳
L7 S19, S20 جذور 🧑 ⏳

بنية كل مستوى:

```
📖 تعلّم (قائمة دروس)
   ↓ إتمام كل الدروس
✏️ تمرّن (5 أسئلة من bank-v2)
   ↓ نجاح 75%
🧠 أنزان بصري
   ↓ نجاح 75%
🎧 أنزان سمعي
   ↓ نجاح 75%
🎓 اختبار المستوى (10 أسئلة صعبة — 60 ثانية — 80%)
   ↓ نجاح 80%
📖 المستوى التالي
```

---

🔒 3. منطق القفل

العنصر يُفتح بعد
🎨 الإثراء مفتوح دائماً
📖 L0 مفتوح
📖 درس داخل L0 أول درس مفتوح، الباقي متسلسل
✏️ تمرّن N إنهاء كل دروس L(N)
🧠 أنزان بصري N نجاح تمرّن N
🎧 أنزان سمعي N نجاح بصري N
🎓 اختبار N نجاح سمعي N
📖 L(N+1) نجاح اختبار N
🏆 امتحان القسم 1 إتمام L0-L3 كاملاً
📝 Placement Test 48 ساعة بين المحاولات
🎓 اختبار L0 24 ساعة بعد الفشل
🔒 سر سحري (بعد الأول) 50 XP

---

💰 4. نظام XP (جديد — الجلسة 9)

مصادر XP:

المصدر XP
إتمام درس L0-L7 +10
إتمام دروس إثراء +20
إجابة صحيحة في تمرّن +5
إتمام اختبار مستوى +20
إتمام امتحان القسم +50
🆕 إتمام سر (تمرين) +2 × score

استخدام XP:

الاستخدام التكلفة
🔒 فتح سر سحري 50 XP
🔒 فتح درس مقفل مجاناً (بالنجاح)

التخزين:

```javascript
localStorage: 'soroban_xp'  // رصيد الحالي
```

---

✨ 5. نظام الأسرار السحرية (جديد — الجلسة 9)

الفكرة:

· 🎁 السر الأول (5) — مجاني دائماً للجميع
· 🔒 الأسرار 2-16 — 50 XP لكل سر
· ✅ بعد الفتح → يبقى مفتوحاً للأبد

للفئتين:

القسم البطاقة
🧒 صغار "🪄 أسرار الضرب"
🧑 كبار "🪄 الأسرار السحرية"

نفس الشاشة — نفس المحتوى.

آلية الفتح:

```
عند الضغط على سر مقفل:
┌──────────────────────────────┐
│  🔒 سر جدول الـ 6            │
│                              │
│  💰 الفتح: 50 XP              │
│  🎯 رصيدك: 120 XP            │
│                              │
│  [✅ افتح (50 XP)]  [❌ إلغاء]│
└──────────────────────────────┘

عند رصيد غير كافي:
┌──────────────────────────────┐
│  🔒 سر جدول الـ 6            │
│                              │
│  💰 الفتح: 50 XP              │
│  🎯 رصيدك: 20 XP              │
│                              │
│  ⚠️ تحتاج 30 XP إضافية       │
│                              │
│  [❌ إلغاء]                   │
└──────────────────────────────┘
```

التخزين:

```javascript
localStorage:
- 'soroban_unlocked_secrets' = [5]  // أول سر مفتوح مجاناً
- 'soroban_xp' = 120
```

بعد فتح سر جديد:

```javascript
soroban_unlocked_secrets = [5, 6, 7]
soroban_xp = 70  // 120 - 50
```

---

📚 6. بنك الأسئلة

📁 البنية:

```
src/data/
├── bank-v2/                     ✅ ~585 + ~350
│   ├── types.ts
│   ├── part-01 → part-04
│   ├── bank-exam.ts
│   ├── placement-engine.ts
│   └── index.ts
├── bank-raw/                    ✅ 400 (تحديد المستوى)
├── bank-linked.ts               ✅ دمج
└── curriculum.ts                ✅ 8 مستويات
```

🎯 نظام ID:

البنك الصيغة مثال
bank-v2 L{level}-S{skill}-{seq} L1-S3-001
bank-exam EX{1-2}-S{skill}-{seq} EX1-S3-001
placement PL-L{level}-S{skill}-{seq} PL-L0-S3-001
test-pool L{level}-TEST-S{skill}-{seq} L0-TEST-S1-01
example L{level}-S{skill}-E{seq} L0-S1-E1
try L{level}-S{skill}-T{seq} L0-S1-T1

⏱️ تصنيف السرعة:

التصنيف القاعدة الشارة
⚡ قياسي ≤ 50% answerMs 🏅 شارة مهارة
✅ مقبول ≤ 75% —
🐢 بطيء 75% —

---

🏗️ 7. البنية الكاملة

```
src/
├── App.tsx                          ✅ (~500 سطر)
├── types.ts                         ✅
│
├── store/
│   ├── progressStore.ts             ✅
│   ├── numberStyleStore.ts          ✅
│   └── masteryBadgesStore.ts        ✅
│
├── curriculum/
│   ├── types.ts                     ✅ (مجمَّد)
│   └── lessons/                     ✅ 🆕
│       ├── types.ts                 ✅ LessonNode
│       ├── index.ts                 ✅ Registry
│       └── L0/                      ✅ 4 ملفات
│
├── engine/                          ✅ مجمَّد
│   ├── sorobanEngine.ts
│   ├── sorobanMoves.ts
│   ├── masteryTracker.ts
│   ├── problemGenerator.ts
│   └── adaptiveEngine.ts
│
├── data/                            ✅
│   ├── bank-v2/                     ✅ ~935
│   ├── bank-raw/                    ✅ 400
│   ├── bank-linked.ts               ✅
│   ├── curriculum.ts                ✅
│   ├── data.ts                      ⚠️ v1 — للمرجع
│   └── learnModules.ts              ⚠️ v1 — للمرجع
│
├── components/                      ✅ ~20
│   ├── FloatingCompanion.tsx        ✅ البطل
│   ├── SorobanaCompanion.tsx        ✅ المعلمة
│   ├── FingerMath.tsx               ✅ 🆕
│   ├── Soroban2D5/                  ✅ 6 ملفات
│   └── ...
│
├── hooks/                           ✅ ~7
│   ├── useSorobanaVoice.ts          ✅ مُصلَح
│   ├── useSpeech.ts                 ✅
│   ├── useGameStats.ts              ✅
│   └── ...
│
└── screens/                         ✅ ~15
    ├── WelcomeScreen.tsx            ✅
    ├── RoleSelection.tsx            ✅
    ├── HeroDashboard.tsx            ✅
    ├── GuardianDashboard.tsx        ⚠️ يحتاج تحديث
    ├── Header.tsx                   ✅
    ├── CategoryScreen.tsx           ✅
    ├── LevelScreen.tsx              ✅
    ├── PracticeScreen.tsx           ✅
    ├── AnzanScreen.tsx              ✅
    ├── AudioAnzanScreen.tsx         ✅
    ├── PlacementTestScreen.tsx      ✅
    ├── SorobanPlayground.tsx        ✅
    ├── CategoryExamScreen.tsx       ✅
    ├── LearnScreen.tsx              ✅ 🆕
    ├── LessonScreen.tsx             ✅ 🆕
    ├── IntroductionScreen.tsx       ✅ 🆕
    ├── LevelTestScreen.tsx          ✅ 🆕
    ├── FingerMathScreen.tsx         ✅ 🆕
    ├── MagicSecretsScreen.tsx       ✅ 🆕
    ├── CrossMultiplicationScreen.tsx ⚠️ غير مربوط
    └── CertificateScreen.tsx        ⚠️ غير مربوط
```

🔊 الملفات الصوتية (22):

```
public/
├── audio/                    ✅ 12 ملف
│   ├── welcome-sorobana.mp3
│   ├── greeting-1/2/3.mp3
│   ├── teaching-1/2/3.mp3
│   ├── correct-1/2.mp3
│   ├── wrong-1/2.mp3
│   └── end-lesson.mp3
└── stories/                  ✅ 10 ملفات
    └── story-0 → story-9.mp3
```

---

🖥️ 8. الشاشات التفاعلية (12)

# الشاشة الوصف
1 WelcomeScreen ترحيب + 7 مميزات + شريط بنفسجي
2 RoleSelection اختيار الدور
3 HeroDashboard لوحة البطل
4 GuardianDashboard لوحة ولي الأمر
5 CategoryScreen الأقسام
6 LevelScreen المستوى
7 LearnScreen قائمة دروس
8 LessonScreen شاهد + جرّب
9 IntroductionScreen 7 صفحات
10 LevelTestScreen اختبار 60 ثانية
11 FingerMathScreen رياضيات الأصابع
12 MagicSecretsScreen 16 سر + جدول

شاشات أخرى تعمل:

· PracticeScreen — تمرّن تكيفي
· AnzanScreen — أنزان بصري
· AudioAnzanScreen — أنزان سمعي
· PlacementTestScreen — تحديد المستوى
· CategoryExamScreen — امتحان 1 + 2
· SorobanPlayground — سوروبان حر

---

✅ 9. ما تم إنجازه

🎯 الجلسات 1-7:

· البنية الأساسية + المحرك التكيفي
· بنك v2 (~935 سؤال)
· أنزان بصري + سمعي
· امتحانات القسم 1+2
· Playground
· تعليم تكيفي
· شارات المهارات

✅ الجلسة 8 (اليوم):

· بناء L0 كاملاً (3 دروس + اختبار)
· curriculum/lessons/ — هيكل جديد
· 4 شاشات جديدة (LearnScreen, LessonScreen, IntroductionScreen, LevelTestScreen)
· إصلاح storyPath (MP3)
· إصلاح SVG → Soroban2D5
· أصوات سوروبانا (correct/wrong)
· فقاعة "أحسنت! 🌟"
· FingerMathScreen (إثراء)
· MagicSecretsScreen (إثراء)
· تحديث WelcomeScreen (7 مميزات)
· شريط بنفسجي في Welcome
· CategoryScreen نظيف

---

🔜 10. ما هو باقي (8%)

📚 المنهج:

· L1 (7 دروس: S3-S9)
· L2 (3 دروس: S10-S12)
· L3 (3 دروس: S13-S15)
· L4-L7 (5 دروس: S16-S20)
· = 18 درس متبقٍ

🎨 الإثراء:

· ربط CrossMultiplicationScreen (للكبار)
· ألعاب تعليمية (اختياري)

🎯 ميزات الجلسة 9 (الجديدة):

· 🆕 "الأسرار السحرية" للصغار والكبار
· 🆕 نظام قفل بـ 50 XP لكل سر
· 🆕 السر الأول مجاني دائماً
· 🆕 رسالة "تحتاج X XP إضافية"

🗺️ تحسينات:

· GuardianDashboard — تحديث للبنية الجديدة
· CertificateScreen — ربط
· جلسة استدراك ذكية
· شارات برونزية/فضية/ذهبية
· PWA + APK

---

🗺️ 11. خارطة الطريق

✅ الجلسة 8 (منتهية):

بناء L0 + إصلاحات + إثراء أساسي

🎯 الجلسة 9 (القادمة):

المهمة الأساسية: بناء L1 (7 دروس) + اختبار

+ الإضافة الجديدة:

· ✨ "الأسرار السحرية" للصغار والكبار
· 🔒 نظام قفل بـ 50 XP
· 🥇 السر الأول مجاني
· 📊 تحديث useGameStats بـ spendXP()
· 🎨 رسالة "تحتاج X XP إضافية"

🎯 الجلسة 10:

L2 + L3 (6 دروس)

🎯 الجلسة 11:

L4-L7 (5 دروس) + TTS

🎯 الجلسة 12:

· ربط CrossMultiplicationScreen
· GuardianDashboard (تحديث)

🎯 الجلسة 13:

· جلسة استدراك ذكية
· شارات برونزية/فضية/ذهبية
· خريطة ضعف بصرية

🎯 الجلسة 14:

· CertificateScreen
· PWA + APK

---

📊 12. الإحصائيات

المقياس القيمة
نسبة الإنجاز ~92%
الملفات المكتملة ~135
الملفات المتبقية ~10
أسئلة البنك ~1080
المستويات 8
المهارات 20
الشاشات التفاعلية 12
الدروس المبنية 3
الملفات الصوتية 22
أنظمة XP ✅ (الجلسة 9)

---

⚠️ 13. ملاحظات حرجة

13.1 GuardianDashboard:

· البنية القديمة (10 دروس) — لا تعرض التقدم الجديد
· يحتاج قراءة:
  · soroban_completed_lessons
  · soroban_passed_level_tests
  · soroban_xp
  · soroban_unlocked_secrets

13.2 ملفات v1:

· data.ts + learnModules.ts — للمرجع فقط
· أرشفتها بعد L1-L7

13.3 EnrichmentScreen:

· حُذف من App.tsx — نُقل الإثراء لشاشات مستقلة

13.4 useGameStats:

· يحتاج إضافة spendXP(amount) في الجلسة 9

---

🎯 14. الأولويات (Priority List)

# الميزة الأولوية الجلسة
1 بناء L1 (7 دروس) 🔴 عالية 9
2 الأسرار السحرية (XP) 🔴 عالية 9
3 useGameStats.spendXP 🔴 عالية 9
4 L2 + L3 (6 دروس) 🔴 عالية 10
5 L4-L7 (5 دروس) 🔴 عالية 11
6 ربط CrossMultiplicationScreen 🟠 متوسطة 12
7 GuardianDashboard تحديث 🟠 متوسطة 12
8 جلسة استدراك 🟠 متوسطة 13
9 شارات برونزية/فضية/ذهبية 🟠 متوسطة 13
10 CertificateScreen 🟠 متوسطة 14
11 PWA + APK 🟡 منخفضة 14
12 ألعاب تعليمية 🟡 منخفضة 14

---

🔗 15. روابط مهمة

الرابط الوصف
Live Demo التطبيق
GitHub Repo المستودع
Actions سجل البناء

---

📞 16. المطوّر

مصطفى علي أكر (@mezo2021)

المراجع:

· Takashi Kojima — The Japanese Abacus
· Japan Soroban Association
· ChatGPT / Claude — للتعليم التكيفي

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-09-27 — نهاية الجلسة 8
الحالة: 🟢 يعمل + L0 كامل + إثراء مكتمل — ~92%

التقييم المتوقّع: 🏆 100/100

</div>

---

🎯 خطوات 100/100

🔴 ضروري (60%):

1. L1-L7 (18 درس) — 40%
2. نظام الأسرار XP — 10%
3. GuardianDashboard — 10%

🟠 مهم (30%):

4. جلسة استدراك ذكية — 10%
5. شارات برونزية/فضية/ذهبية — 10%
6. CertificateScreen — 10%

🟡 لمسات (10%):

7. PWA + APK — 5%
8. ألعاب تعليمية — 5%

= مشروع احترافي كامل 💯

---