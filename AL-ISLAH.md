📄 AL-ISLAH.md — النسخة النهائية الكاملة (بعد الدمج)

```markdown
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة المصورة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.
> **القاعدة الثانية:** ✅ الوثيقة **تراكمية** — لا يُحذف سطر إلا بدليل مصور يرفضه.

**آخر تحديث:** 2026-10-04 — نهاية الجلسة 19
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور
**مصادر التحقق:** فحص يدوي (24 دليلًا مصورًا) · تحليل GPT (50 سؤالًا) · تحليل Claude (50 سؤالًا)

---

## 📖 1. الحقيقة الجوهرية — اقرأ أولًا

المشروع **مكتمل ~80%**. عمره 6 أشهر. **يعمل ويستخدمه أطفال**.

### 🔑 التشخيص الجذري (كلمة المطوّر)

> **"تم الاتفاق على عزل كل ما يتعلق بالبنوك تمهيدًا للحذف. لكن ماذا حدث في جلسات لاحقة أثناء تصميم التدريبات؟ تم ربطها بأماكن خطأ نتيجة ضياع الخطة وإهمال المساعد أحيانًا. مما أدى إلى وجود البعض واختفاء البعض من شارات ومفاتيح، وتوجيه للبناء على ما هو قديم بدل التوجيه إلى الأساس الجديد الممهد لحذف القديم كليًا. وهنا ضاع المشروع بين خطة مفقودة وبناء خاطئ."**

### ما حدث فعليًا

```text
1. القرار الصحيح: عزل البنوك القديمة تمهيدًا للحذف
   ↓
2. جلسات لاحقة تصمم الشارات والأنزان
   → تربطها بمصادر قديمة (لأن الأساس الجديد لم يكتمل)
   → المساعد لا يعرف خطة العزل
   → يبني حيث وجد كودًا مشابهًا
   ↓
3. النتيجة (فوضى هجينة):
   ├─ بعض الشارات تعمل (رُبطت بالجديد)
   ├─ بعضها لا يعمل (رُبطت بالقديم المعزول)
   ├─ بعضها مزدوج (رُبط بالاثنين)
   └─ مفاتيح يتيمة (كُتبت من مكان، تُقرأ من آخر)
```

⚠️ ليست فوضى عشوائية — بل أثر خطة عزل نصف مُنفّذة.

المساعدون السابقون (بما فيهم GPT وClaude وأنا) زادوا الفوضى لأنهم لم يروا الخطة. هذه الوثيقة موجودة لمنع ذلك.

---

🎯 2. مقصود ومحمي (لا يُلمس)

قرارات تصميم مقصودة

العنصر السبب
bank-v2/ · bank-raw/ حوض انتقالي — يُنقل لـSRB ثم يُحذف
bank-linked.ts · bank-adapter.ts جسور انتقالية
src/engine/ (5 ملفات) أساس المستقبل — لم يُبنَ بعد
L00-L20 في LevelId بنوك الامتحانات الحالية
37 مفتاح localStorage مرحلة انتقالية
srb_progress سيُفعَّل في P1
Cooldown 24h لاختبار مستوى (X) تشجيع الإعادة السريعة
Cooldown 48h لامتحان قسم + Placement جدية رسمية
soroban_dev_preview وضع مطوّر — يحتاج توثيقًا (N20)

🧠 src/engine/ — أساس المستقبل (5 ملفات)

الملفات:

1. adaptiveEngine.ts — محرك التقييم التكيفي
2. masteryTracker.ts — تتبع الإتقان
3. problemGenerator.ts — مولّد المسائل
4. sorobanEngine.ts — المحرك الرياضي (مجمّد)
5. sorobanMoves.ts — قواعد الحركات (مجمّد)

الحالة: أساس جديد سيُبنى بعد اكتمال SRB.
الاستخدام الحالي: جزئي/داخلي فقط (masteryTracker مستخدم من adaptiveEngine:71 · sorobanMoves مستخدم من sorobanEngine:15 + SorobanEngineDebug:18).
لا يمس التدريبات أو الأنزان.

💾 معمارية التخزين — الفصل بين SRB و progressStore

SRB — المحتوى والتقييم:

· البنك (275 سؤالًا)
· المنهج (8 مستويات · 15 درسًا · 51 مهارة)
· الجلسات (sessionBuilder)
· التقييم (practice · anzan · audio)
· التصنيف (L·S·m·A)
· العلاجي (remediation)
· الامتحانات (exams — قيد التطوير)

progressStore — حالة الطفل:

· بيانات الطفل (name · category)
· التقدم (completedLevels · completedLessons)
· الدرجات (grades)
· الشارات (anzanBadges · masteryBadges)
· XP · streak
· الإعدادات (language · sound · haptics)

قاعدة الفصل: كلاهما يبقى دائمًا — لا حذف · لا استبدال · لا إعادة بناء.
التوزيع النهائي: يُحسم في P1.

⚠️ مفاتيح في المكان الخطأ (C8)

بعض المفاتيح كان يجب أن تكون داخل progressStore لكنها كُتبت في localStorage:

· soroban_kids_certificate_ready
· soroban_section2_unlocked
· soroban_placement_last_attempt
· soroban_placement_recommended
· soroban_placement_weak_skills
· soroban_placement_result

السبب: عدم فهم المساعد للأمر — أضاف في المكان الخطأ.

ثوابت مؤكدة

الثابت القيمة الملف
L0_TEST_COOLDOWN_MS 24 ساعة test-pool.ts:68
EXAM_COOLDOWN_MS 48 ساعة bank-v2/index.ts:559 · srb-adapter.ts:359
PLACEMENT_COOLDOWN_MS 48 ساعة types.ts:334
EXAM_PASS_THRESHOLD 80% متعدد
PRACTICE_PASS_THRESHOLD 70% متعدد
EXAM_MAX_ATTEMPTS 2 bank-v2/index.ts:558
الوزن النهائي 70+10+5+5+10 progressStore:computeFinalScore

ملفات مجمّدة

· curriculum/types.ts — 14 مستوردًا
· sorobanEngine.ts · sorobanMoves.ts — المنطق الرياضي
· دوال srb-adapter.ts — جاهزة، لا تُعاد كتابتها
· progressStore.ts — يبقى دائمًا (تعديلات محدودة جدًا)
· certificateGenerator.ts — مستخدم من 3 ملفات

📐 قواعد العشرية النهائية

قاعدة 1 — تحديد الحالة:

· إذا result % 1 === 0 → عدد صحيح → عرض كما هو.
· إذا result % 1 !== 0 → عشري → عرض برقمين بعد الفاصلة.

قاعدة 2 — العرض:

· صحيح: 4 → يُعرض 4
· عشري: 3.8 → يُعرض 3.80

قاعدة 3 — الإدخال:

· صحيح: 4 → يُدخل 4
· عشري: 3.80 → يُدخل 380
· عشري: 0.48 → يُدخل 48 (الصفر البادئ لا يُدخل)

قاعدة 4 — الأعمدة:

· صحيح: عدد خانات الناتج
· عشري: عدد خانات الجزء الصحيح + 2

قاعدة 5 — المقارنة:

```ts
const factor = result % 1 !== 0 ? 100 : 1;
const targetValue = Math.round(result * factor);
const isCorrect = abacusValue === targetValue;
```

قاعدة 6 — القسمة:

· كل أسئلة القسمة بدون باقٍ.
· إذا الناتج صحيح → يُعرض صحيحًا.
· إذا الناتج عشري → يُعرض برقمين.

المواقع التي تحتاج تعديلًا (P4 — بعد تصحيح البنوك):

· srb/questions/L6.ts — الأسئلة الـ25
· AnzanScreen.getColumnsForQuestion
· PracticeScreen
· AudioAnzanScreen
· CategoryExamScreen — N60 + الأعمدة
· PlacementTestScreen — N60-ب + الأعمدة
· LevelTestScreen — بعد نقل X إلى SRB

---

🩹 3. أخطاء مؤكدة بالدليل (تراكمي)

🔴🔴🔴 P-1 — إصلاح فوري (~50 سطرًا)

# الخطأ الدليل الإصلاح
B1 reload() = reset() — دالة ميتة progressStore.ts:471-473 حذف reload
B4 AnzanScreen:469 AND — بينما store يقبل OR progressStore.ts:316 × AnzanScreen.tsx:469 توحيد على AND + متوسط
B5 Number(level.slice(1)) — L00 خطر كامن progressStore.ts:22-27 × AnzanScreen.tsx:470 فحص صريح
B9 recordPlacementAttempt() ميت progressStore.ts:132,360 · App.tsx:231-236 ربط أو حذف
N42 XP مفقود في 4 شاشات App.tsx:356,583,609,634 تمرير addXP
N60 العشرية في الامتحانات CategoryExamScreen.tsx:239 دالة عشرية مشتركة
N60-ب العشرية في Placement PlacementTestScreen.tsx:66 نفس الدالة

⬅️ B2 (handleEnd) = مقصود — لا يُلمس.

🔴 P2 — إصلاح سطري

# الخطأ الدليل الإصلاح
V4 LevelTestScreen يستخدم buildL0Test() LevelTestScreen.tsx:8,123 getTestQuestions(level)
N19 passedLevelTests غير تفاعلي LevelScreen.tsx:133-136 نقله إلى store
N20 soroban_dev_preview مخفي LevelScreen.tsx:220 توثيق + حماية
N52 exam2Passed + examPassed ميتان HeroDashboard.tsx:111,116,122,145 حذف الـuseEffectan
N53 5 أنماط لحالة الامتحان متعدد توحيد

🟠 P3.5 — كود يعمل على مفاتيح ميتة

# الملف مستورد من التصنيف
P3.5-1 badgeChecker.ts useGameStats.ts:14 🟡 مستخدم · مصدر مهجور
P3.5-2 useQuests.ts GuardianDashboard.tsx:18,196 🟡 مستخدم · 4 مفاتيح قديمة
P3.5-3 audioAnzanBadges.ts صفر استيراد 🔴 ملف ميت
P3.5-4 skillsChecker.ts صفر استيراد 🔴 ملف ميت
P3.5-5 utils/anzanBadges.ts badgeChecker.ts:3,45,49 🟡 مصدر معزول
~~P3.5-6~~ ~~certificateGenerator.ts~~ مستخدم في 3 ملفات ❌ مرفوض

🟡 P3 — كود ميت

# العنصر المكان
B6 srb_progress يُكتب ولا يُقرأ srb-adapter.ts
B7 CertificateScreen بلا مستدعٍ App.tsx:397-405
B8 شاشتا الشهادات: مصدران Kids: store · Adults: localStorage
V2 recordAttempt() — صفر استدعاء progressStore
N4 setGrade لا تخفّض progressStore
N7 SkillProgress بلا تفاصيل recordAttempt
N21 4 تعريفات للمستويات متعدد

🟣 اكتشافات Claude

# العنصر الأثر
B3 masteryTracker مستخدم من adaptiveEngine:71 استخدام داخلي
C1 37 مفتاحًا (لا 35) تصحيح
C4 4 مفاتيح يتيمة تصحيح
C5 مفتاحان بنفس المعنى تكرار
C7 لا migration بين المفاتيح ترحيل محدود
D6 attemptLog.ts في S15 (غير مرفوع) إضافة مرتقبة
E1 bank-exam = 370 سؤالًا (لا 400) تصحيح
E5 srb/exams/ في S15 إضافة مرتقبة
F5 LessonId = string تصلب ضعيف
I2 vitest مُعدّ بنية جاهزة
N55 AnzanBadges × 3 مكرر
N56 loadAudioAnzanBadges() × 2 منسوخ

---

❌ 4. ادعاءات مرفوضة بالدليل

# الادعاء سبب الرفض
B3-قديم saveSectionGrade S03 فقط srb-adapter.ts:332-345 يتجاهل section
N11 تعارض cooldown تصميم مقصود: 24h × 48h
N36 العشريات معطوبة screenshot يُظهر التلميح
N36-1 مثال التلميح لا يطابق السؤال تصميم تربوي
N51 HeroDashboard يقرأ exam1 الشهادات في CategoryScreen
H5 L00 تصادم فعلي البيانات الحالية L0-L7 فقط
P3.5-6 certificateGenerator غير مربوط مستخدم في 3 ملفات

---

🚫 5. قواعد لأي مساعد قادم

يُمنع منعًا مطلقًا

1. ❌ إعادة بناء من الصفر
2. ❌ حذف البنوك القديمة قبل النقل
3. ❌ حذف L00-L20 قبل Migration
4. ❌ إعادة كتابة المحرك التكيفي
5. ❌ توحيد التخزين قبل نقل الامتحانات
6. ❌ اعتبار adaptiveEngine "ميتًا"
7. ❌ إضافة نظام تخزين رابع
8. ❌ حزمة تعديلات دفعة واحدة
9. ❌ اعتبار README/PROJECT_MASTER "مصدر الحالة"
10. ❌ إعادة كتابة دوال srb-adapter.ts
11. ❌ حذف سطر من الوثيقة بدون دليل مصور
12. ❌ إصلاحات بنيوية دون قراءة القسم 2
13. ❌ حذف badgeChecker · useQuests قبل إعادة الكتابة
14. ❌ حذف/استبدال/إعادة بناء progressStore.ts

يُطلب من كل مساعد

1. ✅ اقرأ الملف كاملًا
2. ✅ اسأل "هل هذا مقصود؟"
3. ✅ اطلب screenshot لأي ادعاء UI
4. ✅ إصلاح جراحي
5. ✅ ملف واحد — ثم اختبار
6. ✅ نسخة احتياطية
7. ✅ أضف — لا تحذف

---

🔗 6. Attempt Record — الحلقة المفقودة

ما هو؟

سجل محاولة واحدة · سطر لكل إجابة.

مثال: طفل في L1-S03-m2 حل 7+8=؟ وأجاب 14 خلال 6.2 ثانية:

```json
{
  "attemptId": "A-000184",
  "timestamp": 1760000000000,
  "level": "L1",
  "section": "S03",
  "skill": "S03-m2",
  "questionId": "L1-S03-m2-017",
  "phase": "P",
  "correct": false,
  "timeMs": 6200
}
```

⚠️ الحالة الحالية — الفجوة

موجود في المشروع:

# العنصر الموقع
1 نوع Attempt curriculum/types.ts
2 دالة createAttempt() engine/masteryTracker.ts
3 دالة recordAttempt() store/progressStore.ts
4 حقول skillProgress progressStore

مفقود:

# العنصر الأثر
1 استدعاء recordAttempt skillProgress فارغ
2 استدعاء createAttempt لا Attempt يُنشأ

⬅️ النتيجة: التطبيق "أعمى" — لا يعرف الطفل، لا يكشف ضعفه، لا يتكيّف.

🎯 الحلقة الكاملة

```
1. الطفل يحل سؤالًا
        ↓
2. Attempt Record يُنشأ
        ↓
3. recordAttempt يحفظه في skillProgress
        ↓
4. masteryTracker يحلّل
        ↓
5. adaptiveEngine يختار السؤال التالي
        ↓
   (يعود إلى 1)
```

🔧 التصميم في التمارين (3 أسطر)

داخل PracticeScreen — بعد كل إجابة:

```ts
const isCorrect = userAnswer === currentQ.result;
const timeMs = Date.now() - questionStartTime;

const attempt = {
  skillId: currentQ.skillId,
  questionId: currentQ.id,
  phase: "P",
  correct: isCorrect,
  timeMs,
  timestamp: Date.now(),
};

useProgressStore.getState().recordAttempt(attempt);
```

⬅️ نفس المنطق في:

· PracticeScreen.tsx — phase: "P"
· AnzanScreen.tsx — phase: "ANZ-V" / "ANZ-F"
· AudioAnzanScreen.tsx — phase: "ANZ-A"
· CategoryExamScreen.tsx — phase: "CE"
· PlacementTestScreen.tsx — phase: "PT"

📊 ربط masteryTracker — مثال

بعد 10 محاولات لـS03-m2:

الحقل القيمة
attempts 10
correct 8
accuracy 80%
avgTimeMs 4.8 ث
consecutiveCorrect 4

recordAttempt يحسب تلقائيًا (الكود موجود).

🧠 تفعيل adaptiveEngine

بعد أن يصبح skillProgress مليئًا:

المهارة الدقة التصنيف
S03-m1 95% قوي
S03-m2 58% ضعيف
S03-m3 82% جيد

القاعدة:

```
70% من الأسئلة → المهارات الضعيفة
30% → مهارات جديدة
```

🎬 دورة كاملة — مثال

السؤال: 8 + 7 = ؟ · الإجابة: 14 · الزمن: 5.8 ث

# الخطوة
1 PracticeScreen يحسب: correct=false
2 createAttempt يُنشئ Attempt
3 recordAttempt يُحدّث skillProgress
4 masteryTracker يُحلّل
5 adaptiveEngine يُقرّر
6 PracticeScreen يعرض 6 + 9 = ؟

✅ الفائدة

قبل:

```
سؤال → إجابة → سؤال عشوائي
```

بعد:

```
سؤال → قياس → كشف ضعف → علاج → قياس → إتقان → تقدم
```

📌 الخلاصة

# البند الوظيفة
1 Attempt Record ماذا حدث؟
2 masteryTracker ماذا تعني؟
3 adaptiveEngine ماذا أعطي الآن؟
4 Practice/Anzan المكان

⬅️ recordAttempt = الحلقة المفقودة.

---

🗺️ 7. خارطة التنفيذ النهائية — 12 مرحلة

المرحلة 0 — الحماية (يوم واحد)

# الخطوة
0.1 رفع AL-ISLAH.md
0.2 Tag: baseline-2026-10-04
0.3 ZIP احتياطي

المرحلة 1 — إصلاحات صغيرة (يومان)

# الإصلاح
1.1 N42 — XP مفقود
1.2 B1 — حذف reload()
1.3 B4 — توحيد الأنزان البصري (AND + متوسط)
1.4 B5 — فحص LevelId
1.5 B9 — recordPlacementAttempt
1.6 N60 · N60-ب — دالة عشرية مشتركة

المرحلة 2 — توثيق ما يعمل (يوم واحد)

# التوثيق
2.1 كيف يعمل Practice
2.2 كيف يعمل Anzan
2.3 كيف يعمل SessionBuilder
2.4 كيف يعمل القفل
2.5 كيف يعمل LevelTest

المرحلة 3 — حل زر "فتح الكل" (يوم)

# الخطوة
3.1 فصل "وضع المعاينة"
3.2 حالة preview مؤقتة
3.3 الخروج يرجع الحالة
3.4 اختبار

المرحلة 4 — إكمال المنهج (أسبوع)

# المهمة
4.1 إعادة بناء S02
4.2 ترجمة L0
4.3 ترجمة L1
4.4 L2 · L3
4.5 L4 · L5
4.6 L6 · L7

المرحلة 5 — الشهادات (يوم)

# الخطوة
5.1 ربط CertificateScreen
5.2 ربط KidsCertificateScreen
5.3 اختبار النتيجة التراكمية

المرحلة 6 — srb/exams/ (أسبوعان)

# الخطوة
6.1 إنشاء src/data/srb/exams/
6.2 CE1 — انتقاء من bank-v2
6.3 CE2 — نفس العملية
6.4 PT — من bank-raw
6.5 ربط CategoryExamScreen
6.6 ربط PlacementTestScreen
6.7 اختبار parity

المرحلة 7 — Attempt Record (أسبوع)

# الخطوة
7.1 PracticeScreen
7.2 AnzanScreen (V · F)
7.3 AudioAnzanScreen
7.4 CategoryExamScreen
7.5 PlacementTestScreen
7.6 اختبار

المرحلة 8 — masteryTracker (يومان)

# الخطوة
8.1 isMastered في الشاشات
8.2 getMasteryPercentage
8.3 diagnoseWeakness
8.4 عرض في Guardian

المرحلة 9 — adaptiveEngine (أسبوع)

# الخطوة
9.1 ربط problemGenerator بـSRB
9.2 ربط adaptiveEngine بـskillProgress
9.3 تطبيق 70/30
9.4 اختبار

المرحلة 10 — تنظيف البنوك (يومان)

# الخطوة
10.1 التأكد أن كل مسار يعمل
10.2 حذف bank-v2 · bank-raw · bank-linked
10.3 تنظيف L00-L20

المرحلة 11 — تنظيف عام (أسبوع)

# الخطوة
11.1 حذف audioAnzanBadges · skillsChecker
11.2 إعادة كتابة badgeChecker
11.3 إعادة كتابة useQuests
11.4 توحيد AnzanBadges
11.5 تنظيف مفاتيح ميتة

المرحلة 12 — الإصدار (أسبوع)

# الخطوة
12.1 PWA
12.2 اختبار شامل
12.3 مشاركة

---

📊 8. الجدول الزمني

المرحلة الوقت
0 — الحماية يوم
1 — إصلاحات يومان
2 — توثيق يوم
3 — فتح الكل يوم
4 — المنهج أسبوع
5 — الشهادات يوم
6 — srb/exams أسبوعان
7 — Attempt Record أسبوع
8 — masteryTracker يومان
9 — adaptiveEngine أسبوع
10 — تنظيف البنوك يومان
11 — تنظيف عام أسبوع
12 — الإصدار أسبوع
المجموع ~7 أسابيع

⬅️ مع عملك ليل نهار — أقرب لـ 4-5 أسابيع.

---

📋 9. جدول المسؤوليات

العنصر المصدر الحالي الهدف المرحلة
Practice SRB SRB ✅ جاهز
Anzan V · F · A SRB SRB ✅ جاهز
Level Test (X) buildL0Test SRB-X 6
CE1 bank-v2 srb/exams/CE1 6
CE2 bank-v2 srb/exams/CE2 6
PT bank-raw srb/exams/PT 6
Attempt Record ❌ progressStore 7
Mastery ❌ masteryTracker 8
Adaptive ❌ adaptiveEngine 9
Certificates غير مربوط progressStore 5
Badges ميتة progressStore 11
L2-L7 غير موجودة curriculum 4

---

✅ 10. القرارات المؤكدة

# القرار الحالة
1 B4 — الأنزان البصري = AND + متوسط حسابي ✅
2 B2 — handleEnd = مقصود ✅
3 زر "فتح الكل" = وضع معاينة منفصل ✅
4 الشهادات = تُربط بـprogressStore ✅
5 البنوك = تُنقل بعد المنهج ✅
6 Attempt Record = يُفعَّل في المرحلة 7 ✅
7 adaptiveEngine = يُفعَّل في المرحلة 9 ✅
8 المرافقين = يُبقيان ✅

---

📌 11. القاعدة الأخيرة

README ليس مصدرًا للحالة.
PROJECT_MASTER ليس مصدرًا للحالة.
الكود الفعلي هو الحقيقة — بالأدلة المصورة.
هذه الوثيقة تراكمية — لا تُحذف.

---

📝 12. سجل التعديلات

الجلسة الإضافة
15 الشهادات · النتيجة الموزونة · 3 SVG · فشل S01
16 إنشاء AL-ISLAH.md · 15 خطأ مؤكد · 5 مرفوض · السبب الجذري
16 (متابعة) تأكيد P3.5 · القاعدتان 11-12
17 إغلاق P3.5 · رفض P3.5-6 · N55 · N56 · القاعدة 13
18 استقبال Claude · تصحيحات B3 · B5 · C1 · C4 · E1 · H5 · N60 · N60-ب · D6 · E5 · I2 · F5 · I3 · I4 · C5 · C7 · القاعدة 14
19 قسم Attempt Record كامل · خارطة 12 مرحلة · جدول المسؤوليات · 8 قرارات مؤكدة · الجدول الزمني · B4 مصحّح (AND + متوسط) · B2 مصنّف مقصود · P-1 محدّث

---

📋 13. سجل الأدلة المصورة

# العنصر الدليل
1 reload=reset progressStore.ts:471-473
2 handleEnd PracticeScreen.tsx:414 · AnzanScreen.tsx:522
3 OR×AND progressStore.ts:316 × AnzanScreen.tsx:469
4 L00 يظهر progressStore.ts:22-27
5 buildL0Test 10 أسئلة test-pool.ts:60-64
6-7 exam2Passed · examPassed HeroDashboard.tsx:111,116,122,145
8 EXAM_KEY badgeChecker.ts:5-6
9-10 Cooldowns test-pool.ts:68 · bank-v2/index.ts:559 · types.ts:334
11 recordPlacementAttempt progressStore.ts:132,360
12 onXP = console.log App.tsx:356,583,609,634
13 srb_progress يُكتب PracticeScreen.tsx:344-347
14 Placement path App.tsx:194-236
15-16 useQuests · badgeChecker useQuests.ts:6-9 · badgeChecker.ts:4-6
17-18 المستوردون useGameStats.ts:14 · GuardianDashboard.tsx:18,196
19-20 توثيق سابق ACHIEVEMENTS.md:128-129 · PROJECT_PLAN.md:547,703-704,720,1063,1153
21 N55 · badgeChecker مهجور progressStore:29-33 · utils/anzanBadges:8-11 · audioAnzanBadges:5-9 · badgeChecker:3,45,49
22-23 N60 · N60-ب CategoryExamScreen.tsx:239 · PlacementTestScreen.tsx:66
24 بطاقة d:2 لـL6 srb/questions/L6.ts — 25 سؤالًا

---

📊 14. الإحصائيات النهائية

الفئة العدد
أخطاء مؤكدة P-1 7 (مع N60)
أخطاء مؤكدة P2 5
أخطاء مؤكدة P3.5 5
كود ميت P3 7
اكتشافات Claude 12
مجموع مؤكد 36
مرفوض بالدليل 7
ملفات ميتة 2
مصادر معزولة 2
مكررات نوعية 2
أدلة مصورة 24
مفاتيح localStorage 37
بنك bank-v2 583 سؤالًا
bank-exam 370 سؤالًا
مفاتيح يتيمة 4
مراحل التنفيذ 12
الجدول الزمني ~7 أسابيع

---

آخر مراجعة: @mezo2021 — 2026-10-04
هذه الوثيقة تراكمية — كل إضافة تُحفظ، كل حذف يحتاج دليلًا مصورًا.

مصادر التحقق:

· GPT (50 سؤالًا — 2026-10-04)
· Claude (50 سؤالًا — 2026-10-04)
· فحص يدوي (24 دليلًا مصورًا)

```

---

## ✅ ملخص ما تم دمجه

| # | الإضافة |
|---|---|
| 1 | القسم 6 — Attempt Record كامل (بتفصيل + أمثلة + دورة حياة) |
| 2 | القسم 7 — خارطة 12 مرحلة (بدل 3 مراحل سابقة) |
| 3 | القسم 8 — الجدول الزمني المحدّث |
| 4 | القسم 9 — جدول المسؤوليات (من يخدم ماذا) |
| 5 | القسم 10 — 8 قرارات مؤكدة |
| 6 | B4 — مصحّح: AND + متوسط حسابي (بدل OR) |
| 7 | B2 — مصنّف: مقصود (حُذف من الأخطاء) |
| 8 | N60 · N60-ب — منقولان إلى P-1 |
| 9 | إحصائيات محدّثة: 36 خطأ مؤكد · 12 مرحلة · 7 أسابيع |
| 10 | سجل التعديلات — جلسة 19 |
| 11 | P-1 محدّث — 7 إصلاحات بدل 6 |

---

**الوثيقة الآن شاملة ~100%.**