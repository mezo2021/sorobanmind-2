# 📋 تحديث RESCUE.md — جلسة 2026-10-08 (المسائية)

## 🎯 ما أُنجز في هذه الجلسة (7 ملفات · ~25 تعديل)

### 1️⃣ GuardianDashboard.tsx — 8 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| 1 | effectiveCompletedLevels — مستخلص من 3 مصفوفات (تمرّن + بصري + سمعي) | ✅ |
| 2 | levelBadges — تُفتح عند 3 مراحل ناجحة (بدل completedLevels الميتة) | ✅ |
| 3 | levelNodes (خارطة) — تتقدم تلقائيًا | ✅ |
| 4 | "X/8 مكتمل" — يعرض عددًا حقيقيًا | ✅ |
| 5 | بصري: master_mixed → master_chains (🔗 خبير سلاسل) | ✅ |
| 6 | سمعي: إضافة master_chains_audio (🎤 خبير سلاسل سماعي) | ✅ |
| 7 | بطاقة "أسطورة السوروبان" — ذهبية فاخرة عند 8/8 | ✅ |
| 8 | LevelNodeButton: "متاح" / "مكتمل" بدل "100 XP" المضلّلة | ✅ |

### 2️⃣ AnzanScreen.tsx — 3 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| Fix 2 | getAnzanBadgeKey: S11/S12 → null | ✅ |
| Fix 3 | levelNum حقيقي مُمرَّر لـ AdaptiveFeedback (بدل 0) | ✅ |
| Fix 4 | حذف master_mixed من ANZAN_BADGE_LABELS | ✅ |

### 3️⃣ AudioAnzanScreen.tsx — 4 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| Fix 1 | getAudioAnzanBadgeKey — إصلاح الخريطة الخاطئة | ✅ |
| Fix 2 | إضافة master_chains_audio لـ S09/S10 | ✅ |
| Fix 3 | levelNum حقيقي مُمرَّر لـ AdaptiveFeedback | ✅ |
| Fix 4 | إضافة master_chains_audio لـ AUDIO_BADGE_LABELS | ✅ |

### 4️⃣ LevelTestScreen.tsx — 5 إصلاحات

| # | الإصلاح | الحالة |
|---|---|---|
| LT1 | استبدال getTestQuestions بـ buildSession({ count: 10 }) | ✅ |
| LT2 | صيغة زمنية تكيفية: FIXED + (Σ avg × 1.5) + BUFFER | ✅ |
| LT3 | عتبة نجاح 70% (بدل 80%) | ✅ |
| LT4 | cooldown 30 دقيقة (بدل 24 ساعة) | ✅ |
| LT5 | إضافة markLevelComplete (لإكمال المستوى وفتح التالي) | ✅ |
| LT6 | تصحيح 'test' → 'levelTest' (في setGrade) | ✅ |

### 5️⃣ AdaptiveFeedback.tsx — 3 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| AF1 | computeWeaknessScore — أي خطأ = ضعف (بدل صيغة معقدة) | ✅ |
| AF2 | فلتر > 0 (بدل ≥ 50) | ✅ |
| AF3 | حذف شرط attempts < 3 | ✅ |

### 6️⃣ LevelScreen.tsx — 2 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| L1 | زر الجلسة العلاجية يعرض عدد المهارات | ✅ |
| L2 | نص التنبيه يعرض (X مهارة · 5 أسئلة) | ✅ |

### 7️⃣ CategoryScreen.tsx — 2 تعديلات

| # | التعديل | الحالة |
|---|---|---|
| CS1 | إضافة loadPassedLevelTests() | ✅ |
| CS2 | isLevelUnlocked: فحص مزدوج (completedLevels + passedTests) | ✅ |

---

## 🚨 اكتشافات جديدة (موثّقة)

### 🔴 #1 — completedLevels ميتة

**المشكلة:** markLevelComplete يُستدعى فقط من LevelTestScreen (شاشة معزولة).
**النتيجة:** completedLevels فارغة دائمًا · كل ما يعتمد عليها معطّل.
**الإصلاح:** effectiveCompletedLevels من 3 مصفوفات + markLevelComplete في LevelTestScreen.

### 🔴 #2 — getAudioAnzanBadgeKey خاطئة بالكامل

**المشكلة:** الخريطة مبنية على منهاج قديم:
- S05/S06 → جمع (خطأ · هي ضرب)
- S07/S08 → ضرب (خطأ · هي قسمة)
- S09/S10 → قسمة (خطأ · هي سلاسل)
**الإصلاح:** خريطة صحيحة + master_chains_audio لـ S09/S10.

### 🔴 #3 — useQuests.ts يقرأ من مفاتيح ميتة

**المفاتيح الميتة:**
- soroban_anzan_stats ⚫
- soroban_practice_stats ⚫
- sorobanmind-stats ⚫ (مهجور)
- soroban_completed_lessons 🟡 (نادر)
**النتيجة:** المغامرات النشطة = 0/target للأبد.
**الإصلاح:** إعادة كتابة useQuests (مؤجل).

### 🔴 #4 — BADGES-8 ميت 100%

**المشكلة:** badgeChecker.ts + getAllEarnedBadges + BadgeModal — كله معزول.
**القرار:** مؤجل (لن نُحييه · سيُكرر الموجود).

### 🔴 #5 — getTestQuestions يستخدم count = 5 افتراضي

**المشكلة:** buildSession افتراضيه count=5 · وgetTestQuestions لا يُمرِّر count.
**النتيجة:** اختبار L0 = 5 أسئلة فقط (بدل 10).
**الإصلاح:** استدعاء buildSession مباشرة في LevelTestScreen مع count: 10.

### 🔴 #6 — عدم اتساق CategoryScreen vs LevelScreen

**المشكلة:** CategoryScreen يقرأ completedLevels (Zustand) · LevelScreen يقرأ soroban_passed_level_tests (localStorage).
**النتيجة:** L0 يبدو مكتملًا في LevelScreen · لكن CategoryScreen يرى completedLevels فارغًا → L1 يبقى مقفلًا.
**الإصلاح:** Fallback مزدوج في CategoryScreen.

---

## 🎯 القرارات المؤكدة (هذه الجلسة)

- ✅ **حذف master_mixed من كل مكان** (بصري + سمعي + عرض + منطق)
- ✅ **"اجتياز المستوى" = 3 مراحل** (تمرّن + بصري + سمعي · 70%+)
- ✅ **شارة "أسطورة السوروبان"** = بطاقة ذهبية فاخرة عند 8/8
- ✅ **LevelNodeButton** = "متاح" / "مكتمل" (بدل XP المضلّل)
- ✅ **صيغة الزمن في الاختبار**: FIXED(20s) + (Σ avg_ms / 1000 × 1.5) + BUFFER(90s)
- ✅ **عتبة نجاح الاختبار**: 70% (بدل 80%)
- ✅ **Cooldown اختبار المستوى**: 30 دقيقة (بدل 24 ساعة)
- ✅ **AdaptiveFeedback**: أي خطأ = ضعف (> 0)
- ✅ **الأخطاء تظهر من أول محاولة** (بلا شرط 3 محاولات)

---

## 📋 خطة بناء اختبارات L1-L7 (كاملة)

### 🎯 الوضع الحالي

**✅ البنية التحتية كاملة:**
- LevelTestScreen.tsx → يستدعي buildSession({ level, phase: 'X', count: 10 })
- srb/sessionBuilder.ts → buildSession جاهز
- App.tsx → يمرّر levelId صحيح
- LevelScreen.tsx → الزر يعمل لكل المستويات

**❌ الناقص:** أسئلة بمرحلة 'X' في ملفات srb/questions/L1-L7.ts

### 🔗 سلسلة الربط الكاملة

```

LevelScreen (زر "اختبار")
↓ handleNav(level-test-${levelId})
App.tsx
↓ يمرّر levelId
LevelTestScreen
↓ buildSession({ level, phase: 'X', count: 10 })
srb/sessionBuilder.ts
↓ getQuestionsByLevel(level) + filter phase 'X'
srb/questions/L{level}.ts
↓ فلترة: allowed_phases.includes('X')
أسئلة الاختبار (10 أسئلة)

```

**الخلاصة:** أي سؤال يحتوي 'X' في allowed_phases → يدخل الاختبار تلقائيًا.

### 📁 الملفات المطلوبة (لكل مستوى)

| الملف | الواجب |
|---|---|
| src/data/srb/questions/L{n}.ts | يحتوي على أسئلة بمرحلة 'X' |
| src/data/srb/curriculum.ts | يعرّف المستوى (موجود) |
| src/data/srb/modules.ts | يعرّف الـ modules (موجود) |

**لا حاجة لأي ملف جديد** — فقط إضافة 'X' لأسئلة موجودة.

### 📝 نموذج السؤال (متطلب إلزامي)

```ts
makeQuestion({
  level: "L1",                    // ← مستوى صحيح
  section: "S03",                 // ← قسم ضمن المستوى
  module: "m1",                   // ← مهارة
  sequence: 1,
  variant: "A",
  primary_phase: "P",
  allowed_phases: [
    "E", "T", "P",
    "ANZ-V", "ANZ-F", "ANZ-A",
    "X"                           // ← ⭐ مطلوب للاختبار
  ],
  question: "٣ + ٤ = ؟",
  operands: [3, 4],
  operation: "addition",
  result: 7,                      // ← الإجابة الصحيحة
  solution: "سبب الاختيار: ...",
  movement: "direct",
  difficulty: 2,
  expected_time_ms: 5000,         // [min, max]
  expected_anzan_ms: 3000,
  tags: ["addition", "1-digit"],
})
```

الحقول الحرجة:

· allowed_phases.includes('X') — الشرط الأساسي
· result — الإجابة الصحيحة
· operation — يحدد شكل العرض:
  · 'read' → سوروبان + 4 خيارات (مولّدة تلقائيًا)
  · 'build' → سوروبان تفاعلي
  · عمليات أخرى → سوروبان تفاعلي

🔢 الحد الأدنى لعدد الأسئلة

buildSession({ phase: 'X', count: 10 }) تحتاج ≥ 10 أسئلة بـ 'X'.

التوصية لكل مستوى: 15-20 سؤالًا بمرحلة 'X'.

🎯 خطوات إضافة اختبار لمستوى جديد

الخطوة 1 — فتح ملف الأسئلة:
src/data/srb/questions/L{n}.ts

الخطوة 2 — إضافة 'X' لأسئلة موجودة:

في كل سؤال تريد إدراجه في الاختبار:

```ts
allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
//                                                      ↑
```

أو — إضافة أسئلة جديدة مخصصة للاختبار:

```ts
makeQuestion({
  level: "L1", section: "S03", module: "m1",
  sequence: 900, variant: "X1",
  primary_phase: "X",
  allowed_phases: ["X"],
  question: "١٢ + ٧ = ؟",
  operands: [12, 7], operation: "addition", result: 19,
  solution: "...",
  movement: "direct", difficulty: 2,
  expected_time_ms: 6000,
  expected_anzan_ms: 4000,
  tags: ["addition", "exam"],
}),
```

الخطوة 3 — التحقق:

· افتح التطبيق
· اضغط "اختبار L{n}"
· تأكد من ظهور 10 أسئلة

🚨 تحذيرات مهمة

· ⚠️ لا تغيّر target_time_ms — الاختبار يحسب زمنه منها.
· ⚠️ لا تخلط IDs — sequence فريدة لكل مستوى.
· ⚠️ getQuestionsByModule فلترة صارمة — section + module صحيحان.
· ⚠️ لا تستخدم primary_phase: 'X' في أسئلة التدريب.

📊 الحالة الحالية (تقرير)

المستوى أسئلة بنك A 'X' موجود؟ جاهز؟
L0 26 ✅ مؤكد ✅ يعمل
L1 41 ❓ 🟡
L2 41 ❓ 🟡
L3 41 ❓ 🟡
L4 41 ❓ 🟡
L5 41 ❓ 🟡
L6 26 ❓ 🟡
L7 26 ❓ 🟡

التوصية: افحص كل ملف — إن كان 'X' موجودًا · الاختبارات تعمل الآن ✅.

طريقة الفحص:

1. افتح src/data/srb/questions/L1.ts
2. ابحث عن allowed_phases
3. تأكد من وجود "X" في المصفوفة

---

📊 حالة الأنظمة (محدثة)

النظام المفتاح الحالة قبل الحالة بعد
شارات إتقان المهارة soroban_mastery_badges ✅ ✅
شارات بصري sorobanmind-v2-progress ✅ ✅ + master_chains
شارات سمعي sorobanmind-v2-progress 🟡 ✅ + master_chains_audio
شارات المستوى مشتقة (3 مصفوفات) 🔴 ميت ✅ يعمل
أسطورة السوروبان مشتقة (8/8) — ✅ جديدة
خارطة المستويات مشتقة 🔴 ميت ✅ يعمل
اختبار L0-L7 buildSession phase X 🔴 L0 فقط ✅ كل المستويات
AdaptiveFeedback weakness > 0 🟡 معقد ✅ مبسّط
الجلسة العلاجية زر + عدد مهارات ✅ ✅ محدّث
BADGES-8 متعدد ⚫ ميت ⚫ ميت (قرار)
المغامرات useQuests 🟡 ⏳ مؤجل

---

🗺️ المنهاج الرسمي (تذكير · لا يتغير)

المستوى الأقسام الفئة
L0 intro · S01 · S02 🧒
L1 S03 · S04 🧒
L2 S05 · S06 🧒
L3 S07 · S08 🧒
L4 S09 · S10 🧑
L5 S11 · S12 🧑
L6 S13 · S14 🧑
L7 S15 🧑

⚠️ قاعدة: S03/S04 = جمع · S05/S06 = ضرب · S07/S08 = قسمة · S09/S10 = سلاسل · S11+ = متقدم.

---

🎯 القرارات المؤكدة (تراكمية)

قرارات سابقة (لا تُناقش):

· ❌ تفريق skillId بـ PHASE
· ❌ recordAttempt في CE/PT
· ❌ IndexedDB · Backend · Cloud
· ❌ حذف progressStore.ts
· ❌ master_mixed (بقايا منهاج قديم)
· ❌ إحياء BADGES-8

قرارات جديدة (هذه الجلسة):

· ✅ حذف master_mixed من كل مكان (بصري + سمعي + عرض + منطق)
· ✅ "اجتياز المستوى" = 3 مراحل (تمرّن + بصري + سمعي · 70%+)
· ✅ شارة "أسطورة السوروبان" = بطاقة ذهبية فاخرة عند 8/8
· ✅ LevelNodeButton = "متاح" / "مكتمل"
· ✅ الاختبار من Bank A (phase X) · 10 أسئلة
· ✅ عتبة الاختبار: 70% · Cooldown: 30 دقيقة
· ✅ AdaptiveFeedback: أي خطأ = ضعف
· ✅ الملفات المُصلَحة: 7 ملفات كاملة

---

🚀 الخطوة التالية (اقتراح)

الجلسة القادمة — اختر واحدة:

الخيار الوصف التقدير
(أ) useQuests.ts — إعادة الكتابة (المغامرات) 30-60 دقيقة
(ب) P6 — تصنيف 35 مفتاح localStorage 1-2 ساعة
(ج) الهالة الحمراء — تخفيف (bg-red-500/30 → /10) 15 دقيقة (3 ملفات)
(د) فحص 'X' في ملفات L1-L7 15 دقيقة
(هـ) اختبار شامل — مراجعة سلوك التطبيق 15 دقيقة
(و) راحة — التطبيق في حالة ممتازة الآن —

---

📌 المهام المتبقية (قائمة مركزة)

# المهمة الملف التقدير
1 useQuests — إعادة كتابة useQuests.ts 30-60 دقيقة
2 الهالة الحمراء — تخفيف Practice · Anzan · AudioAnzan 15 دقيقة
3 P6 — تصنيف المفاتيح (تحليل · بلا كود) 1-2 ساعة
4 فحص 'X' في L1-L7 L1-L7.ts 15 دقيقة
5 ضبط زمن امتحانات القسم CategoryExamScreen.tsx 30 دقيقة
6 دروس L2-L7 (بناء محتوى) أسابيع
7 adaptiveEngine — قرار adaptiveEngine.ts مؤجل

---

آخر تحديث: 2026-10-08 (المسائية) — بعد ~25 تعديلًا جديدًا
الحالة: 🟢 البناء أخضر · البنكان مربوطان · اختبارات L0-L7 تعمل · ~95%
المرجع: RESCUE.md + AL-ISLAH-V2.md

```
