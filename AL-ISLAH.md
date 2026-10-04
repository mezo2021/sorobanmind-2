📄 AL-ISLAH.md — النسخة الكاملة التراكمية (بعد إصلاح النقص)

هذه هي النسخة النهائية الشاملة — كل ما وثّقناه بأدلة مصورة، تراكمية، لا حذف إلا بما رُفض صريحًا.

---

```markdown
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة المصورة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.
> **القاعدة الثانية:** ✅ الوثيقة **تراكمية** — لا يُحذف سطر إلا بدليل مصور يرفضه.

**آخر تحديث:** 2026-10-04 — نهاية الفحص الثاني
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور
**مصادر التحقق:** فحص يدوي (screenshots) · تحليل GPT (50 سؤالًا)
**بانتظار:** Claude (استعادة رصيد)

---

## 📖 1. الحقيقة الجوهرية — اقرأ أولًا

المشروع **مكتمل ~80%**. عمره 6 أشهر. **يعمل ويستخدمه أطفال**.

### 🔑 التشخيص الجذري (كلمة المطوّر)

> **"تم الاتفاق على عزل كل ما يتعلق بالبنوك تمهيدًا للحذف. لكن ماذا حدث في جلسات لاحقة أثناء تصميم التدريبات؟ تم ربطها بأماكن خطأ نتيجة ضياع الخطة وإهمال المساعد أحيانًا. مما أدى إلى وجود البعض واختفاء البعض من شارات ومفاتيح، وتوجيه للبناء على ما هو قديم بدل التوجيه إلى الأساس الجديد الممهد لحذف القديم كليًا. وهنا ضاع المشروع بين خطة مفقودة وبناء خاطئ."**

### ما حدث فعليًا:

```

1. القرار الصحيح: عزل البنوك القديمة تمهيدًا للحذف
   ⬇️
2. جلسات لاحقة تصمم الشارات والأنزان
   → تربطها بمصادر قديمة (لأن الأساس الجديد لم يكتمل)
   → المساعد لا يعرف خطة العزل
   → يبني حيث وجد كودًا مشابهًا
   ⬇️
3. النتيجة (فوضى هجينة):
   ├─ بعض الشارات تعمل (رُبطت بالجديد)
   ├─ بعضها لا يعمل (رُبطت بالقديم المعزول)
   ├─ بعضها مزدوج (رُبط بالاثنين)
   └─ مفاتيح يتيمة (كُتبت من مكان، تُقرأ من آخر)

```

**⚠️ ليست فوضى عشوائية — بل أثر خطة عزل نصف مُنفّذة.**

**المساعدون السابقون (بما فيهم GPT وأنا) زادوا الفوضى لأنهم لم يروا الخطة. هذه الوثيقة موجودة لمنع ذلك.**

---

## 🎯 2. مقصود ومحمي (لا يُلمس)

### قرارات تصميم مقصودة:

| العنصر | السبب |
|---|---|
| `bank-v2/` · `bank-raw/` | حوض انتقالي — يُنقل لـSRB ثم يُحذف |
| `bank-linked.ts` · `bank-adapter.ts` | جسور انتقالية |
| `adaptiveEngine` · `problemGenerator` · `masteryTracker` | معزولة قصديًا — **ليست ميتة** |
| `L00-L20` في `LevelId` | بنوك الامتحانات الحالية |
| 35 مفتاح localStorage | مرحلة انتقالية |
| `srb_progress` | سيُفعَّل في P1 |
| **Cooldown 24h لاختبار مستوى (X)** | تشجيع الإعادة السريعة |
| **Cooldown 48h لامتحان قسم + Placement** | جدية رسمية |
| `soroban_dev_preview` | وضع مطوّر — يحتاج توثيقًا (N20) |

### ثوابت مؤكدة:

| الثابت | القيمة | الملف |
|---|---|---|
| `L0_TEST_COOLDOWN_MS` | 24 ساعة | test-pool.ts:68 |
| `EXAM_COOLDOWN_MS` | 48 ساعة | bank-v2/index.ts:559 · srb-adapter.ts:359 |
| `PLACEMENT_COOLDOWN_MS` | 48 ساعة | types.ts:334 |
| `EXAM_PASS_THRESHOLD` | 80% | متعدد |
| `PRACTICE_PASS_THRESHOLD` | 70% | متعدد |
| `EXAM_MAX_ATTEMPTS` | 2 | bank-v2/index.ts:558 |
| الوزن النهائي | 70+10+5+5+10 | progressStore:computeFinalScore |

### ملفات مجمّدة:
- `curriculum/types.ts` — 14 مستوردًا
- `sorobanEngine.ts` · `sorobanMoves.ts` — المنطق الرياضي
- دوال `srb-adapter.ts` — جاهزة، لا تُعاد كتابتها

---

## 🩹 3. أخطاء مؤكدة بالدليل (تراكمي)

### 🔴🔴🔴 P-1 — إصلاح فوري (~50 سطرًا)

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **B1** | `reload()` = `reset()` — دالة ميتة (صفر استدعاء) | progressStore.ts:471-473 | حذف `reload` من interface + store |
| **B2** | `handleEnd` يمسح `pendingBadgesRef` بلا حفظ | PracticeScreen.tsx:414 · AnzanScreen.tsx:522 | حفظ قبل المسح |
| **B4** | `AnzanScreen:469` يشترط AND — بينما `progressStore:316` و`srb/progress.ts` يقبلان OR | progressStore.ts:316 × AnzanScreen.tsx:469 | توحيد على OR (تصميم مقصود) |
| **B5** | `Number(level.slice(1))` — L00 يتصادم مع L0 | progressStore.ts:22-27 × AnzanScreen.tsx:470 | فحص صريح للـLevelId |
| **B9** | `recordPlacementAttempt()` — صفر استدعاء · App يكتب localStorage | progressStore.ts:132,360 · App.tsx:231-236 | ربط أو حذف |
| **N42** | XP مفقود في 4 شاشات — `onXP = console.log` فقط | App.tsx:356,583,609,634 · MagicSecrets:407 · FingerMath:151 · LessonScreen:287,604 | تمرير `addXP` حقيقي |

### 🔴 P2 — إصلاح سطري

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **V4** | LevelTestScreen يستخدم `buildL0Test()` (10 أسئلة L0: 3+7) لكل المستويات | LevelTestScreen.tsx:8,123 × test-pool.ts:60-64 | استبدال بـ`getTestQuestions(level)` — **جاهزة في srb-adapter** |
| **N19** | `passedLevelTests` يُقرأ في render بلا اشتراك | LevelScreen.tsx:133-136 | نقله إلى `progressStore` |
| **N20** | مفتاح `soroban_dev_preview` مخفي — يعطّل التحقق التعليمي | LevelScreen.tsx:220 | توثيق + حماية بكلمة سر |
| **N52** | `exam2Passed` + `examPassed` في HeroDashboard — كتابة بلا قراءة | HeroDashboard.tsx:111,116,122,145 | حذف الـuseEffectan الميتان |
| **N53** | 5 أنماط لتخزين حالة الامتحان | متعدد | توحيد على progressStore |

### 🟠 P3.5 — كود يعمل على مفاتيح ميتة (مُوَثَّق بأدلة)

**🎯 ملاحظة مهمة: هذا القسم ليس اكتشافًا جديدًا — كان موثقًا في `PROJECT_PLAN.md` و`ACHIEVEMENTS.md` سابقًا. المطوّر يعرفه. لكن الإصلاحات لم تُنفّذ بسبب ضياع الأولويات.**

| # | الملف | المشكلة | الدليل |
|---|---|---|---|
| **P3.5-1** | `badgeChecker.ts` | يقرأ `sorobanmind-stats` (README يقول: حُذف) + `soroban_exam_result` (قديم) | badgeChecker.ts:5-6 |
| **P3.5-2** | `useQuests.ts` | يقرأ 4 مفاتيح قديمة: `soroban_anzan_stats` · `soroban_practice_stats` · `sorobanmind-stats` · `soroban_completed_lessons` (بـ `_` صحيح) | useQuests.ts:6-9 |
| **P3.5-3** | `badgeChecker` مستورد | من `useGameStats.ts:14` عبر `getAllEarnedBadges` | useGameStats.ts:14 |
| **P3.5-4** | `useQuests` مستورد | من `GuardianDashboard.tsx:18,196` | GuardianDashboard.tsx:18,196 |
| **P3.5-5** | `skillsChecker.ts` | مشتبه به — يحتاج فحص | PROJECT_PLAN.md:534 |
| **P3.5-6** | `audioAnzanBadges.ts` | مشتبه به — يحتاج فحص | PROJECT_PLAN.md:532 |

**الأثر:** كل دالة تقرأ من مفاتيح ميتة → ترجع `false` → شارة لا تُمنح → الطالب لا يرى تقدمه.

**📌 توثيق سابق (مؤكد):**
- `ACHIEVEMENTS.md:129` — "اكتشاف تعارض `soroban-completed-lessons` × `soroban_completed_lessons`"
- `PROJECT_PLAN.md:547` — "`useQuests.ts` ← يعتمد على مفاتيح قديمة"
- `PROJECT_PLAN.md:703-704` — المفاتيح 27 · 28 (مشكلة)
- `PROJECT_PLAN.md:720` — "إصلاح خطأ `-` × `_` في badgeChecker + useQuests"
- `PROJECT_PLAN.md:1063` — نفس البند مع رمز الساعة ⏳
- `PROJECT_PLAN.md:1153` — "تعارض `soroban-completed-lessons` × `soroban_completed_lessons`"

**✅ تصحيح:** `badgeChecker.ts` و`useQuests.ts` **يستخدمان `soroban_completed_lessons` بـ `_` بشكل صحيح** — التوثيق القديم عن "خطأ `-` × `_`" قد لا ينطبق على الإصدار الحالي. يحتاج تحققًا نهائيًا عند الإصلاح.

### 🟡 P3 — كود ميت يحتاج تنظيف

| # | العنصر | المكان | الأثر |
|---|---|---|---|
| **B6** | `srb_progress` يُكتب (`saveSectionGrade`) ولا يُقرأ | srb-adapter.ts + صفر استيراد | كتابة ميتة |
| **B7** | `CertificateScreen` بلا مستدعٍ | App.tsx:397-405 | شاشة يتيمة |
| **B8** | شاشتا الشهادات: مصدران مختلفان | Kids: store · Adults: localStorage | تعارض بيانات |
| **V2** | `recordAttempt()` — صفر استدعاء | progressStore | جدول skillProgress ميت |
| **N4** | `setGrade` لا تسمح بتخفيض الدرجة | progressStore | يمنع قياس تحسّن العلاجي |
| **N7** | `SkillProgress` بلا errorType/movement/phase | recordAttempt | AdaptiveFeedback محدود |
| **N21** | 4 تعريفات للمستويات | متعدد | لا مرجع واحد |

---

## ❌ 4. ادعاءات مرفوضة بالدليل

| # | الادعاء | سبب الرفض | الدليل |
|---|---|---|---|
| **B3** | `saveSectionGrade` S03 فقط | `srb-adapter.ts:332-345` يتجاهل section — الجلسة على مستوى كامل | قراءة كود |
| **N11** | تعارض cooldown (24h × 48h) | تصميم مقصود: 24h لاختبار مستوى · 48h لامتحان + PT | types.ts:334 · test-pool.ts:68 · bank-v2/index.ts:559 |
| **N36** | العشريات معطوبة | screenshot يُظهر التلميح "مثّل بدون فاصلة" | صورة runtime S13·m3 |
| **N36-1** | مثال التلميح لا يطابق السؤال | تصميم تربوي: مثال عام للفهم ثم تطبيق | صورة + نية تعليمية |
| **N51** | HeroDashboard يجب أن يقرأ exam1 | الشهادات تظهر في CategoryScreen — تصميم صحيح | صور HeroDashboard + CategoryScreen |

---

## 🚫 5. قواعد لأي مساعد قادم

### يُمنع منعًا مطلقًا
1. ❌ إعادة بناء من الصفر
2. ❌ حذف البنوك القديمة قبل النقل
3. ❌ حذف `L00-L20` قبل Migration
4. ❌ إعادة كتابة المحرك التكيفي
5. ❌ توحيد التخزين قبل نقل الامتحانات
6. ❌ اعتبار `adaptiveEngine` "ميتًا"
7. ❌ إضافة نظام تخزين رابع
8. ❌ حزمة تعديلات دفعة واحدة
9. ❌ اعتبار README/PROJECT_MASTER "مصدر الحالة"
10. ❌ إعادة كتابة دوال `srb-adapter.ts` الجاهزة
11. ❌ **حذف سطر من هذه الوثيقة بدون دليل مصور**
12. ❌ **اقتراح "إصلاحات بنيوية" دون قراءة القسم 2 (مقصود)**

### يُطلب من كل مساعد
1. ✅ اقرأ هذا الملف أولًا — كاملًا
2. ✅ اسأل "هل هذا مقصود؟" قبل الحكم
3. ✅ اطلب **screenshot** لأي ادعاء UI
4. ✅ إصلاح جراحي — لا بنيوي
5. ✅ ملف واحد — ثم اختبار
6. ✅ نسخة احتياطية قبل أي تعديل
7. ✅ **أضف اكتشافًا جديدًا — لا تحذف قديمًا**

---

## 🗺️ 6. خارطة التنفيذ

```

P-1  إصلاح 6 أخطاء (B1 · B2 · B4 · B5 · B9 · N42)   ⏳ يومان
P0   تثبيت المنهج · المهارات · الحركات · التصنيف      ⏳ أسبوع
P1   توحيد سجل الأداء (Attempt Record موحد)           ⏳ أسبوعان
+ إصلاح B6 · B7 · B8
P2   ربط SRB + المحرك التكيفي                         ⏳ 3 أسابيع
+ إصلاح V4 · N19 · N20 · N52 · N53
P3   Remediation التكيفي + تنظيف P3.5                 ⏳ أسبوعان
+ إصلاح badgeChecker · useQuests · skillsChecker · audioAnzanBadges
P4   تفعيل getTestQuestions · getPlacementTestQuestions  ⏳ أسبوعان
P5   بناء دروس L2-L7                                  ⏳ أشهر
P6   الترجمة الكاملة (AR + EN)                        ⏳ شهر
P7   الشهادات + Guardian Profile                      ⏳ أسبوعان
P8   Migration + حذف البنوك القديمة                   ⏳ أسبوع

```

**⚠️ لا تنفيذ لمرحلة قبل نجاح ما قبلها.**

---

## 📌 7. القاعدة الأخيرة

> **README ليس مصدرًا للحالة.**
> **PROJECT_MASTER ليس مصدرًا للحالة.**
> **الكود الفعلي هو الحقيقة — بالأدلة المصورة.**
> **هذه الوثيقة تراكمية — لا تُحذف.**

---

## 📝 8. سجل التعديلات

| الجلسة | الإضافة |
|---|---|
| 15 | الشهادات (Kids + Adults) · النتيجة الموزونة (70+10+5+5+10) · 3 SVG · فشل S01 |
| **16** | إنشاء AL-ISLAH.md · فحص 6 ملفات (progressStore · LevelTestScreen · LevelScreen · AnzanScreen · srb/progress · srb-adapter) · 15 خطأ مؤكد · 5 مرفوض · اكتشاف السبب الجذري (خطة عزل نصف مُنفّذة) |
| **16 (متابعة)** | تأكيد P3.5 (badgeChecker · useQuests) · توثيق أن المشكلة موثقة سابقًا · إضافة القاعدتين 11-12 · إضافة P3.5 بأدلة كاملة |

---

## 📋 9. سجل الأدلة المصورة

| # | العنصر | الدليل |
|---|---|---|
| 1 | reload=reset | progressStore.ts:471-473 |
| 2 | handleEnd يمسح pendingBadgesRef | PracticeScreen.tsx:414 · AnzanScreen.tsx:522 |
| 3 | OR×AND | progressStore.ts:316 × AnzanScreen.tsx:469 |
| 4 | L00 يظهر | progressStore.ts:22-27 |
| 5 | buildL0Test 10 أسئلة | test-pool.ts:60-64 |
| 6 | exam2Passed ميتة | HeroDashboard.tsx:111,116 |
| 7 | examPassed ميتة | HeroDashboard.tsx:122,145 |
| 8 | EXAM_KEY | badgeChecker.ts:5-6 |
| 9 | Cooldown 24h | test-pool.ts:68 |
| 10 | Cooldown 48h | bank-v2/index.ts:559 · types.ts:334 · srb-adapter.ts:359 |
| 11 | recordPlacementAttempt ميتة | progressStore.ts:132,360 |
| 12 | onXP = console.log | App.tsx:356,583,609,634 |
| 13 | srb_progress يُكتب | PracticeScreen.tsx:344-347 |
| 14 | Placement path | App.tsx:194-236 |
| 15 | useQuests مفاتيح ميتة | useQuests.ts:6-9 |
| 16 | badgeChecker مفاتيح ميتة | badgeChecker.ts:4-6 |
| 17 | badgeChecker مستورد | useGameStats.ts:14 |
| 18 | useQuests مستورد | GuardianDashboard.tsx:18,196 |
| 19 | توثيق سابق في ACHIEVEMENTS | ACHIEVEMENTS.md:128-129 |
| 20 | توثيق سابق في PROJECT_PLAN | PROJECT_PLAN.md:547,703-704,720,1063,1153 |

---

**آخر مراجعة:** @mezo2021 — 2026-10-04
**هذه الوثيقة تراكمية — كل إضافة تُحفظ، كل حذف يحتاج دليلًا مصورًا.**
```

---