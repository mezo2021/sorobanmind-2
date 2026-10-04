📄 AL-ISLAH.md — النسخة التراكمية الشاملة

كل ما وثّقناه بأدلة مصورة. لا حذف إلا بما رُفض صريحًا.

---

```markdown
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.

**آخر تحديث:** 2026-10-04
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور
**مصادر التحقق:** فحص يدوي (screenshots) · تحليل GPT (50 سؤالًا)
**بانتظار:** Claude (استعادة رصيد)

---

## 📖 1. الحقيقة الجوهرية — اقرأ أولًا

المشروع **مكتمل ~80%**. عمره 6 أشهر. **يعمل ويستخدمه أطفال**.

**ما حدث فعلًا (التشخيص الجذري):**
```

1. عزل البنوك القديمة (قرار سليم — تمهيد للحذف)
   ⬇️
2. جلسات لاحقة تصمم الشارات/الأنزان
   → تربطها بمصادر قديمة (لأن الأساس الجديد لم يكتمل)
   → المساعد لا يعرف خطة العزل
   ⬇️
3. الفوضى:
   ├─ بعض الشارات تعمل (رُبطت بالجديد)
   ├─ بعضها لا يعمل (رُبطت بالقديم المعزول)
   ├─ بعضها مزدوج (رُبط بالاثنين)
   └─ بعض المفاتيح يتيمة

```

**النتيجة:** بنية هجينة — نصف جديد، نصف قديم، بلا جسر واضح.

**⚠️ ليست فوضى عشوائية — بل أثر خطة عزل نصف مُنفّذة.**

---

## 🎯 2. مقصود ومحمي (لا يُلمس)

### قرارات تصميم مقصودة:

| العنصر | السبب |
|---|---|
| `bank-v2/` · `bank-raw/` | حوض انتقالي — يُنقل لـSRB لاحقًا |
| `bank-linked.ts` · `bank-adapter.ts` | جسور انتقالية |
| `adaptiveEngine` · `problemGenerator` · `masteryTracker` | معزولة قصديًا — ليست ميتة |
| `L00-L20` في `LevelId` | بنوك الامتحانات الحالية |
| 35 مفتاح localStorage | مرحلة انتقالية |
| `srb_progress` | سيُفعَّل في P1 |
| **Cooldown 24h لاختبار مستوى** | تشجيع الإعادة السريعة |
| **Cooldown 48h لامتحان قسم + Placement** | جدية رسمية |

### ثوابت مؤكدة:
| الثابت | القيمة | الملف |
|---|---|---|
| `L0_TEST_COOLDOWN_MS` | 24 ساعة | test-pool.ts:68 |
| `EXAM_COOLDOWN_MS` | 48 ساعة | bank-v2/index.ts:559 |
| `PLACEMENT_COOLDOWN_MS` | 48 ساعة | types.ts:334 |
| `EXAM_PASS_THRESHOLD` | 80% | متعدد |
| `PRACTICE_PASS_THRESHOLD` | 70% | متعدد |
| الوزن النهائي | 70+10+5+5+10 | progressStore:computeFinalScore |

### ملفات مجمّدة:
- `curriculum/types.ts` — 14 مستوردًا
- `sorobanEngine.ts` · `sorobanMoves.ts` — المنطق الرياضي
- دوال `srb-adapter.ts` — جاهزة، لا تُعاد كتابتها

---

## 🩹 3. أخطاء مؤكدة بالدليل (تراكمي)

### 🔴🔴🔴 P-1 — إصلاح فوري (~40 سطرًا)

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **B1** | `reload()` = `reset()` — دالة ميتة (صفر استدعاء) | progressStore.ts:471-473 | حذف `reload` من interface + store |
| **B2** | `handleEnd` يمسح `pendingBadgesRef` بلا حفظ | PracticeScreen.tsx:414 · AnzanScreen.tsx:522 | حفظ قبل المسح |
| **B4** | `AnzanScreen:469` يشترط AND — بينما `progressStore:316` و`srb/progress.ts` يقبلان OR | progressStore.ts:316 × AnzanScreen.tsx:469 | توحيد على OR (تصميم مقصود) |
| **B5** | `Number(level.slice(1))` — L00 يتصادم مع L0 | progressStore.ts:22-27 × AnzanScreen.tsx:470 | فحص صريح للـLevelId |
| **B9** | `recordPlacementAttempt()` — صفر استدعاء · App.tsx يكتب localStorage مباشرة | progressStore.ts:132,360 · App.tsx:231-236 | ربط الدالة في App أو حذفها |
| **N42** | XP مفقود في 4 شاشات — `onXP = console.log` فقط | App.tsx:356,583,609,634 · MagicSecrets:407 · FingerMath:151 · LessonScreen:287,604 | تمرير `addXP` حقيقي |

### 🔴 P2 — إصلاح سطري

| # | الخطأ | الدليل | الإصلاح |
|---|---|---|---|
| **V4** | LevelTestScreen يستخدم `buildL0Test()` لكل المستويات (10 أسئلة L0 فقط: 3+7) | LevelTestScreen.tsx:8,123 × test-pool.ts:60-64 | استبدال بـ`getTestQuestions(level)` — جاهزة في srb-adapter |
| **N19** | `passedLevelTests` يُقرأ في render بلا اشتراك | LevelScreen.tsx:133-136 | نقله إلى `progressStore` |
| **N20** | مفتاح `soroban_dev_preview` مخفي — يعطّل التحقق التعليمي | LevelScreen.tsx:220 | توثيق + حماية بكلمة سر |
| **N52** | `exam2Passed` + `examPassed` في HeroDashboard — كتابة بلا قراءة | HeroDashboard.tsx:111,116,122,145 | حذف الـuseEffectan الميتان |
| **N53** | 5 أنماط لتخزين حالة الامتحان (passed/result/score/ready) | متعدد | توحيد على progressStore.exam1Passed/exam2Passed |

### 🟡 P3 — كود ميت يحتاج تنظيف

| # | العنصر | المكان | الأثر |
|---|---|---|---|
| **B6** | `srb_progress` يُكتب (`saveSectionGrade`) ولا يُقرأ | srb-adapter.ts + صفر استيراد | كتابة ميتة |
| **B7** | `CertificateScreen` بلا مستدعٍ | App.tsx:397-405 | شاشة يتيمة |
| **B8** | شاشتا الشهادات: مصدران مختلفان | Kids: store · Adults: localStorage | تعارض بيانات |
| **V2** | `recordAttempt()` — صفر استدعاء | progressStore | جدول skillProgress ميت |
| **N4** | `setGrade` لا تسمح بتخفيض الدرجة | progressStore | يمنع قياس تحسّن العلاجي |
| **N7** | `SkillProgress` بلا errorType/movement/phase | recordAttempt | AdaptiveFeedback محدود |

### 🟠 P3.5 — للفحص (بانتظار تحقق)

| # | العنصر | السبب |
|---|---|---|
| **badgeChecker.ts** | يستخدم `sorobanmind-stats` (قديم) + `-` بدل `_` | موثق في PROJECT_PLAN.md:533,703-704 |
| **useQuests.ts** | نفس المشكلة | PROJECT_PLAN.md:703-704,720 |
| **skillsChecker.ts** | مشتبه به | PROJECT_PLAN.md:534 |
| **audioAnzanBadges.ts** | مشتبه به | PROJECT_PLAN.md:532 |

**⚠️ هذه الفئة تحتاج فحصًا قبل التصنيف النهائي.**

---

## ❌ 4. ادعاءات مرفوضة بالدليل

| # | الادعاء | سبب الرفض | الدليل |
|---|---|---|---|
| **B3** | `saveSectionGrade` S03 فقط | `srb-adapter.ts:332-345` يتجاهل section — الجلسة على مستوى كامل | صورة + قراءة كود |
| **N11** | تعارض cooldown (24h × 48h) | تصميم مقصود: 24h لاختبار مستوى · 48h لامتحان قسم وPlacement | types.ts:334 · test-pool.ts:68 · bank-v2/index.ts:559 |
| **N36** | العشريات معطوبة | screenshot يُظهر التلميح "مثّل بدون فاصلة" | صورة runtime S13·m3 |
| **N36-1** | مثال التلميح لا يطابق السؤال | تصميم تربوي: مثال عام للفهم ثم تطبيق | صورة + نية تعليمية |
| **N51** | HeroDashboard يجب أن يقرأ exam1 | الشهادات تظهر في CategoryScreen — تصميم صحيح | صور HeroDashboard + CategoryScreen |

---

## 🚫 5. قواعد لأي مساعد قادم

### يُمنع منعًا مطلقًا
1. ❌ اقتراح "إعادة بناء من الصفر"
2. ❌ حذف البنوك القديمة قبل النقل
3. ❌ حذف `L00-L20` قبل Migration
4. ❌ إعادة كتابة المحرك التكيفي
5. ❌ توحيد التخزين قبل نقل الامتحانات
6. ❌ اعتبار `adaptiveEngine` "ميتًا"
7. ❌ إضافة نظام تخزين رابع
8. ❌ حزمة تعديلات دفعة واحدة
9. ❌ اعتبار README/PROJECT_MASTER "مصدر الحالة"
10. ❌ إعادة كتابة دوال `srb-adapter.ts` الجاهزة
11. ❌ حذف عنصر من هذه الوثيقة دون **دليل مصور** يُثبت رفضه

### يُطلب من كل مساعد
1. ✅ اقرأ هذا الملف أولًا — كاملًا
2. ✅ اسأل "هل هذا مقصود؟" قبل الحكم
3. ✅ اطلب **screenshot** لأي ادعاء UI
4. ✅ إصلاح جراحي — لا بنيوي
5. ✅ ملف واحد — ثم اختبار
6. ✅ نسخة احتياطية قبل أي تعديل
7. ✅ أضف اكتشافًا جديدًا للوثيقة — لا تحذف

---

## 🗺️ 6. خارطة التنفيذ

```

P-1  إصلاح 6 أخطاء (B1 · B2 · B4 · B5 · B9 · N42)   ⏳ يومان
P0   تثبيت المنهج · المهارات · الحركات · التصنيف      ⏳ أسبوع
P1   توحيد سجل الأداء (Attempt Record موحد)           ⏳ أسبوعان
+ إصلاح B6 · B7 · B8
P2   ربط SRB + المحرك التكيفي                         ⏳ 3 أسابيع
+ إصلاح V4 · N19 · N20 · N52 · N53
P3   Remediation التكيفي (إثبات الإتقان)              ⏳ أسبوع
+ تنظيف الكود الميت (P3)
P4   تفعيل getTestQuestions · getPlacementTestQuestions  ⏳ أسبوعان
P5   بناء دروس L2-L7                                  ⏳ أشهر
P6   الترجمة الكاملة (AR + EN)                        ⏳ شهر
P7   الشهادات + Guardian Profile                      ⏳ أسبوعان
P8   Migration + حذف البنوك القديمة                   ⏳ أسبوع

```

---

## 📌 7. القاعدة الأخيرة

> **README ليس مصدرًا للحالة.**
> **PROJECT_MASTER ليس مصدرًا للحالة.**
> **الكود الفعلي هو الحقيقة — بالأدلة المصورة.**
> **هذه الوثيقة تحمي الكود.**

---

## 📝 8. سجل التعديلات

| الجلسة | الإضافة |
|---|---|
| 15 | الشهادات · النتيجة الموزونة · 3 SVG · فشل S01 |
| **16** | **إنشاء AL-ISLAH.md · فحص فعلي (screenshots) · اكتشاف 15 خطأ مؤكد + 5 مرفوض** |

---

## 📋 9. سجل الأدلة المصورة (مرجع)

| # | العنصر | الدليل |
|---|---|---|
| 1 | reload=reset | progressStore.ts:471-473 |
| 2 | handleEnd | PracticeScreen.tsx:414 |
| 3 | OR×AND | progressStore.ts:316 × AnzanScreen.tsx:469 |
| 4 | L00 يظهر | progressStore.ts:22-27 |
| 5 | buildL0Test 10 أسئلة | test-pool.ts:60-64 |
| 6 | exam2Passed ميتة | HeroDashboard.tsx:111,116 |
| 7 | examPassed ميتة | HeroDashboard.tsx:122,145 |
| 8 | EXAM_KEY | badgeChecker.ts:5-6 |
| 9 | Cooldown 24h | test-pool.ts:68 |
| 10 | Cooldown 48h | bank-v2/index.ts:559 · types.ts:334 |
| 11 | recordPlacementAttempt ميتة | progressStore.ts:132,360 |
| 12 | onXP = console.log | App.tsx:356,583,609,634 |
| 13 | srb_progress يُكتب | PracticeScreen.tsx:344-347 |
| 14 | Placement path | App.tsx:194-236 |

---

**آخر مراجعة:** @mezo2021 — 2026-10-04
**الملف قابل للإضافة — لا للحذف إلا بدليل مصور.**
```

---

✅ حالة الوثيقة الآن

القسم الحالة
1. التشخيص الجذري ✅ موثق
2. المقصود ✅ موثق
3. الأخطاء المؤكدة ✅ 15 خطأ
4. المرفوض ✅ 5 ادعاءات
5. القواعد ✅ جاهزة
6. الخارطة ✅ P-1 → P8
7-9 ✅

---
