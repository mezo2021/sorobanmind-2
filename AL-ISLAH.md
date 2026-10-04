
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة المصورة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.
> **القاعدة الثانية:** ✅ الوثيقة **تراكمية** — لا يُحذف سطر إلا بدليل مصور يرفضه.

**آخر تحديث:** 2026-10-04 — نهاية الفحص الثالث  
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور  
**مصادر التحقق:** فحص يدوي (21 دليلًا مصورًا) · تحليل GPT (50 سؤالًا)  
**بانتظار:** Claude (استعادة رصيد)

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
⚠️ ليست فوضى عشوائية — بل أثر خطة عزل نصف مُنفّذة.
المساعدون السابقون (بما فيهم GPT وأنا) زادوا الفوضى لأنهم لم يروا الخطة. هذه الوثيقة موجودة لمنع ذلك.
🎯 2. مقصود ومحمي (لا يُلمس)
قرارات تصميم مقصودة
العنصر
السبب
bank-v2/ · bank-raw/
حوض انتقالي — يُنقل لـSRB ثم يُحذف
bank-linked.ts · bank-adapter.ts
جسور انتقالية
adaptiveEngine · problemGenerator · masteryTracker
معزولة قصديًا — ليست ميتة
L00-L20 في LevelId
بنوك الامتحانات الحالية
35 مفتاح localStorage
مرحلة انتقالية
srb_progress
سيُفعَّل في P1
Cooldown 24h لاختبار مستوى (X)
تشجيع الإعادة السريعة
Cooldown 48h لامتحان قسم + Placement
جدية رسمية
soroban_dev_preview
وضع مطوّر — يحتاج توثيقًا (N20)
ثوابت مؤكدة
الثابت
القيمة
الملف
L0_TEST_COOLDOWN_MS
24 ساعة
test-pool.ts:68
EXAM_COOLDOWN_MS
48 ساعة
bank-v2/index.ts:559 · srb-adapter.ts:359
PLACEMENT_COOLDOWN_MS
48 ساعة
types.ts:334
EXAM_PASS_THRESHOLD
80%
متعدد
PRACTICE_PASS_THRESHOLD
70%
متعدد
EXAM_MAX_ATTEMPTS
2
bank-v2/index.ts:558
الوزن النهائي
70+10+5+5+10
progressStore:computeFinalScore
ملفات مجمّدة
curriculum/types.ts — 14 مستوردًا
sorobanEngine.ts · sorobanMoves.ts — المنطق الرياضي
دوال srb-adapter.ts — جاهزة، لا تُعاد كتابتها
certificateGenerator.ts — مستخدم من 3 ملفات (P3.5-6 مرفوض)
🩹 3. أخطاء مؤكدة بالدليل (تراكمي)
🔴🔴🔴 P-1 — إصلاح فوري (~50 سطرًا)
#
الخطأ
الدليل
الإصلاح
B1
reload() = reset() — دالة ميتة (صفر استدعاء)
progressStore.ts:471-473
حذف reload من interface + store
B2
handleEnd يمسح pendingBadgesRef بلا حفظ
PracticeScreen.tsx:414 · AnzanScreen.tsx:522
حفظ قبل المسح
B4
AnzanScreen:469 يشترط AND — بينما progressStore:316 وsrb/progress.ts يقبلان OR
progressStore.ts:316 × AnzanScreen.tsx:469
توحيد على OR (تصميم مقصود)
B5
Number(level.slice(1)) — L00 يتصادم مع L0
progressStore.ts:22-27 × AnzanScreen.tsx:470
فحص صريح للـLevelId
B9
recordPlacementAttempt() — صفر استدعاء · App يكتب localStorage
progressStore.ts:132,360 · App.tsx:231-236
ربط أو حذف
N42
XP مفقود في 4 شاشات — onXP = console.log فقط
App.tsx:356,583,609,634 · MagicSecrets:407 · FingerMath:151 · LessonScreen:287,604
تمرير addXP حقيقي
🔴 P2 — إصلاح سطري
#
الخطأ
الدليل
الإصلاح
V4
LevelTestScreen يستخدم buildL0Test() (10 أسئلة L0: 3+7) لكل المستويات
LevelTestScreen.tsx:8,123 × test-pool.ts:60-64
استبدال بـgetTestQuestions(level) — جاهزة في srb-adapter
N19
passedLevelTests يُقرأ في render بلا اشتراك
LevelScreen.tsx:133-136
نقله إلى progressStore
N20
مفتاح soroban_dev_preview مخفي — يعطّل التحقق التعليمي
LevelScreen.tsx:220
توثيق + حماية بكلمة سر
N52
exam2Passed + examPassed في HeroDashboard — كتابة بلا قراءة
HeroDashboard.tsx:111,116,122,145
حذف الـuseEffectan الميتان
N53
5 أنماط لتخزين حالة الامتحان (passed/result/score/ready)
متعدد
توحيد على progressStore
🟠 P3.5 — كود يعمل على مفاتيح ميتة + ملفات ميتة
🎯 هذا القسم ليس اكتشافًا جديدًا — كان موثقًا في PROJECT_PLAN.md وACHIEVEMENTS.md سابقًا. المطوّر يعرفه. لكن الإصلاحات لم تُنفّذ بسبب ضياع الأولويات.
📌 توثيق رسمي — PROJECT_PLAN.md:1129-1131
"حذف الملفات الميتة: utils/anzanBadges.ts · audioAnzanBadges.ts · skillsChecker.ts · badgeChecker.ts · hooks/useQuests.ts (أو تحديثه)"
📌 الحالة الفعلية بعد الفحص الكامل
#
الملف
مستورد من
التصنيف الفعلي
P3.5-1
badgeChecker.ts
useGameStats.ts:14
🟡 مستخدم · يقرأ من مصدر مهجور — sorobanmind-stats (محذوف) + soroban_exam_result (قديم) + loadAnzanBadges() (من utils/anzanBadges.ts)
P3.5-2
useQuests.ts
GuardianDashboard.tsx:18,196
🟡 مستخدم · على 4 مفاتيح قديمة — soroban_anzan_stats · soroban_practice_stats · sorobanmind-stats · soroban_completed_lessons (بـ_ صحيح)
P3.5-3
audioAnzanBadges.ts
صفر استيراد
🔴 ملف ميت مؤكد — حذف آمن في P3
P3.5-4
skillsChecker.ts
صفر استيراد
🔴 ملف ميت مؤكد — حذف آمن في P3
P3.5-5
utils/anzanBadges.ts
badgeChecker.ts:3,45,49
🟡 مصدر قديم معزول — يقرأ من soroban_anzan_badges (لا أحد يكتب فيه)
P3.5-6
certificateGenerator.ts
KidsCertificateScreen:10 · CertificateMedal:1 · CertificateScreen:10-13
❌ مرفوض — مستخدم فعليًا في 3 ملفات (P3.5-6 ملغى)
🔴 السبب الجذري لـ"بعض الشارات تعمل والبعض لا"
AnzanScreen (جديد)
↓
يكتب في progressStore.anzanBadges ✅
↓
GuardianDashboard
↓
يقرأ من progressStore.anzanBadges ✅
↓
يعمل

--------------------------------

badgeChecker
↓
يقرأ من utils/anzanBadges.loadAnzanBadges() ❌
↓
الذي يقرأ من soroban_anzan_badges
↓
لا أحد يكتب فيه
↓
النتيجة = false دائمًا
⬅️ هذا يُفسّر بدقة وصف المطوّر:
"بعضها يعمل والبعض لا".
📌 توثيق سابق مؤكد
ACHIEVEMENTS.md:128-129 — "تحليل 28 مفتاحًا · اكتشاف تعارض soroban-completed-lessons × soroban_completed_lessons"
PROJECT_PLAN.md:547 — "useQuests.ts ← يعتمد على مفاتيح قديمة"
PROJECT_PLAN.md:703-704 — المفاتيح 27 · 28 (مشكلة)
PROJECT_PLAN.md:720 — "إصلاح خطأ - × _ في badgeChecker + useQuests"
PROJECT_PLAN.md:1063 — نفس البند ⏳ (لم يُنفّذ)
PROJECT_PLAN.md:1153 — تعارض soroban-completed-lessons × soroban_completed_lessons
✅ تصحيح
badgeChecker.ts وuseQuests.ts يستخدمان soroban_completed_lessons بـ _ بشكل صحيح حاليًا — التوثيق القديم عن "خطأ - × _" لا ينطبق على الإصدار الحالي.
⚠️ قرار الحماية
لا يُحذف الآن — ينتظر P3 (بعد إعادة كتابة الشارات على مفاتيح progressStore).
🟡 P3 — كود ميت يحتاج تنظيف
#
العنصر
المكان
الأثر
B6
srb_progress يُكتب (saveSectionGrade) ولا يُقرأ
srb-adapter.ts + صفر استيراد
كتابة ميتة
B7
CertificateScreen بلا مستدعٍ
App.tsx:397-405
شاشة يتيمة
B8
شاشتا الشهادات: مصدران مختلفان
Kids: store · Adults: localStorage
تعارض بيانات
V2
recordAttempt() — صفر استدعاء
progressStore
جدول skillProgress ميت
N4
setGrade لا تسمح بتخفيض الدرجة
progressStore
يمنع قياس تحسّن العلاجي
N7
SkillProgress بلا errorType/movement/phase
recordAttempt
AdaptiveFeedback محدود
N21
4 تعريفات للمستويات
متعدد
لا مرجع واحد
🟣 N55 · N56 — اكتشافات إضافية (تكرارات بنيوية)
#
العنصر
المكان
الأثر
N55
AnzanBadges interface معرَّف 3 مرات
progressStore.ts:29-33 (الجديد ✅) · utils/anzanBadges.ts:8-11 (قديم) · utils/audioAnzanBadges.ts:5-9 (ميت)
3 مصادر نوعية لنفس الشيء
N56
loadAudioAnzanBadges() مكررة
audioAnzanBadges.ts:11 (الأصلية — لكن الملف ميت) · skillsChecker.ts:103 (نسخة — الملف ميت)
كود منسوخ
❌ 4. ادعاءات مرفوضة بالدليل
#
الادعاء
سبب الرفض
الدليل
B3
saveSectionGrade يسجّل S03 فقط
srb-adapter.ts:332-345 يتجاهل section — الجلسة على مستوى كامل
قراءة كود
N11
تعارض cooldown (24h × 48h)
تصميم مقصود: 24h لاختبار مستوى · 48h لامتحان + PT
types.ts:334 · test-pool.ts:68 · bank-v2/index.ts:559
N36
العشريات معطوبة
screenshot يُظهر التلميح "مثّل بدون فاصلة"
صورة runtime S13·m3
N36-1
مثال التلميح لا يطابق السؤال
تصميم تربوي: مثال عام للفهم ثم تطبيق
صورة + نية تعليمية
N51
HeroDashboard يجب أن يقرأ exam1
الشهادات تظهر في CategoryScreen — تصميم صحيح
صور HeroDashboard + CategoryScreen
P3.5-6-قديم
certificateGenerator.ts غير مربوط
مستخدم في 3 ملفات فعليًا
صور: KidsCertificateScreen:10 · CertificateMedal:1 · CertificateScreen:10-13
🚫 5. قواعد لأي مساعد قادم
يُمنع منعًا مطلقًا
❌ إعادة بناء من الصفر
❌ حذف البنوك القديمة قبل النقل
❌ حذف L00-L20 قبل Migration
❌ إعادة كتابة المحرك التكيفي
❌ توحيد التخزين قبل نقل الامتحانات
❌ اعتبار adaptiveEngine "ميتًا"
❌ إضافة نظام تخزين رابع
❌ حزمة تعديلات دفعة واحدة
❌ اعتبار README/PROJECT_MASTER "مصدر الحالة"
❌ إعادة كتابة دوال srb-adapter.ts الجاهزة
❌ حذف سطر من هذه الوثيقة بدون دليل مصور
❌ اقتراح "إصلاحات بنيوية" دون قراءة القسم 2 (مقصود)
❌ حذف badgeChecker.ts أو useQuests.ts قبل إعادة كتابة الشارات على progressStore
يُطلب من كل مساعد
✅ اقرأ هذا الملف أولًا — كاملًا
✅ اسأل "هل هذا مقصود؟" قبل الحكم
✅ اطلب screenshot لأي ادعاء UI
✅ إصلاح جراحي — لا بنيوي
✅ ملف واحد — ثم اختبار
✅ نسخة احتياطية قبل أي تعديل
✅ أضف اكتشافًا جديدًا — لا تحذف قديمًا
🗺️ 6. خارطة التنفيذ
P-1  إصلاح 6 أخطاء (B1 · B2 · B4 · B5 · B9 · N42)   ⏳ يومان

P0   تثبيت المنهج · المهارات · الحركات · التصنيف      ⏳ أسبوع

P1   توحيد سجل الأداء (Attempt Record موحد)           ⏳ أسبوعان
     · إصلاح B6 · B7 · B8

P2   ربط SRB + المحرك التكيفي                         ⏳ 3 أسابيع
     · إصلاح V4 · N19 · N20 · N52 · N53

P3   Remediation التكيفي + تنظيف P3.5                 ⏳ أسبوعان
     · إعادة كتابة badgeChecker + useQuests على progressStore
     · حذف audioAnzanBadges + skillsChecker (ميتان)
     · توحيد N55 (AnzanBadges) على progressStore

P4   تفعيل getTestQuestions + getPlacementTestQuestions ⏳ أسبوعان

P5   بناء دروس L2-L7                                  ⏳ أشهر

P6   الترجمة الكاملة (AR + EN)                        ⏳ شهر

P7   الشهادات + Guardian Profile                      ⏳ أسبوعان

P8   Migration + حذف البنوك القديمة                   ⏳ أسبوع
⚠️ لا تنفيذ لمرحلة قبل نجاح ما قبلها.
📌 7. القاعدة الأخيرة
README ليس مصدرًا للحالة. PROJECT_MASTER ليس مصدرًا للحالة. الكود الفعلي هو الحقيقة — بالأدلة المصورة. هذه الوثيقة تراكمية — لا تُحذف.
📝 8. سجل التعديلات
الجلسة
الإضافة
15
الشهادات (Kids + Adults) · النتيجة الموزونة (70+10+5+5+10) · 3 SVG · فشل S01
16
إنشاء AL-ISLAH.md · فحص 6 ملفات (progressStore · LevelTestScreen · LevelScreen · AnzanScreen · srb/progress · srb-adapter) · 15 خطأ مؤكد · 5 مرفوض · اكتشاف السبب الجذري (خطة عزل نصف مُنفّذة)
16 (متابعة)
تأكيد P3.5 (badgeChecker · useQuests) · توثيق أن المشكلة موثقة سابقًا · إضافة القاعدتين 11-12
17
إغلاق P3.5 نهائيًا · تأكيد P3.5-3/4 (ملفان ميتان) · رفض P3.5-6 (certificateGenerator مستخدم) · إضافة N55 (3 تعريفات AnzanBadges) · N56 (loadAudioAnzanBadges مكررة) · القاعدة 13 · إضافة دليل مصور رقم 21
📋 9. سجل الأدلة المصورة
#
العنصر
الدليل
1
reload=reset
progressStore.ts:471-473
2
handleEnd يمسح pendingBadgesRef
PracticeScreen.tsx:414 · AnzanScreen.tsx:522
3
OR×AND
progressStore.ts:316 × AnzanScreen.tsx:469
4
L00 يظهر
progressStore.ts:22-27
5
buildL0Test 10 أسئلة
test-pool.ts:60-64
6
exam2Passed ميتة
HeroDashboard.tsx:111,116
7
examPassed ميتة
HeroDashboard.tsx:122,145
8
EXAM_KEY
badgeChecker.ts:5-6
9
Cooldown 24h
test-pool.ts:68
10
Cooldown 48h
bank-v2/index.ts:559 · types.ts:334 · srb-adapter.ts:359
11
recordPlacementAttempt ميتة
progressStore.ts:132,360
12
onXP = console.log
App.tsx:356,583,609,634
13
srb_progress يُكتب
PracticeScreen.tsx:344-347
14
Placement path
App.tsx:194-236
15
useQuests مفاتيح ميتة
useQuests.ts:6-9
16
badgeChecker مفاتيح ميتة
badgeChecker.ts:4-6
17
badgeChecker مستورد
useGameStats.ts:14
18
useQuests مستورد
GuardianDashboard.tsx:18,196
19
توثيق سابق في ACHIEVEMENTS
ACHIEVEMENTS.md:128-129
20
توثيق سابق في PROJECT_PLAN
PROJECT_PLAN.md:547,703-704,720,1063,1153
21
N55 (3 تعريفات AnzanBadges) + badgeChecker من مصدر مهجور
progressStore:29-33 · utils/anzanBadges:8-11 · audioAnzanBadges:5-9 · badgeChecker:3,45,49
📊 10. الإحصائيات النهائية
الفئة
العدد
أخطاء مؤكدة P-1 (فورية)
6
أخطاء مؤكدة P2 (سطرية)
5
أخطاء مؤكدة P3.5 (مفاتيح ميتة + ملفات)
5
كود ميت P3
7
مجموع مؤكد
23
مرفوض بالدليل
6
ملفات ميتة مؤكدة (حذف آمن في P3)
2 (audioAnzanBadges · skillsChecker)
مصادر قديمة معزولة
2 (utils/anzanBadges · srb_progress)
مكررات نوعية
2 (N55 · N56)
أدلة مصورة
21
آخر مراجعة: @mezo2021 — 2026-10-04
هذه الوثيقة تراكمية — كل إضافة تُحفظ، كل حذف يحتاج دليلًا مصورًا.
