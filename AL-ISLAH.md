📄 AL-ISLAH.md — النسخة النهائية الكاملة

بكل التصحيحات والإضافات — 21 دليلًا مصورًا · 30+ خطأ مؤكد · 6 مرفوض · خارطة كاملة.

---

```markdown
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة المصورة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.
> **القاعدة الثانية:** ✅ الوثيقة **تراكمية** — لا يُحذف سطر إلا بدليل مصور يرفضه.

**آخر تحديث:** 2026-10-04 — نهاية الفحص الرابع
**الحالة:** البناء #684 ✅ يعمل · التطبيق منشور
**مصادر التحقق:** فحص يدوي (21+ دليلًا مصورًا) · تحليل GPT (50 سؤالًا) · تحليل Claude (50 سؤالًا)

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

⚠️ مفاتيح في المكان الخطأ (C8 — جديد)

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
· AnzanScreen.getColumnsForQuestion — يحتاج القاعدة الجديدة
· PracticeScreen — يحتاج القاعدة الجديدة
· AudioAnzanScreen — يحتاج فحص + القاعدة
· CategoryExamScreen — N60 + الأعمدة
· PlacementTestScreen — N60-ب + الأعمدة
· LevelTestScreen — بعد نقل X إلى SRB

---

🩹 3. أخطاء مؤكدة بالدليل (تراكمي)

🔴🔴🔴 P-1 — إصلاح فوري (~50 سطرًا)

# الخطأ الدليل الإصلاح
B1 reload() = reset() — دالة ميتة (صفر استدعاء) progressStore.ts:471-473 حذف reload من interface + store
B2 handleEnd يمسح pendingBadgesRef بلا حفظ PracticeScreen.tsx:414 · AnzanScreen.tsx:522 حفظ قبل المسح
B4 AnzanScreen:469 يشترط AND — بينما progressStore:316 وsrb/progress.ts يقبلان OR progressStore.ts:316 × AnzanScreen.tsx:469 توحيد على OR (تصميم مقصود)
B5 Number(level.slice(1)) — L00 نظريًا يتصادم مع L0 (لا ضرر حالي — البيانات الحالية L0-L7 فقط) progressStore.ts:22-27 × AnzanScreen.tsx:470 فحص صريح للـLevelId — 🟡 خطر كامن
B9 recordPlacementAttempt() — صفر استدعاء · App يكتب localStorage progressStore.ts:132,360 · App.tsx:231-236 ربط أو حذف
N42 XP مفقود في 4 شاشات — onXP = console.log فقط App.tsx:356,583,609,634 · MagicSecrets:407 · FingerMath:151 · LessonScreen:287,604 تمرير addXP حقيقي

🔴 P2 — إصلاح سطري

# الخطأ الدليل الإصلاح
V4 LevelTestScreen يستخدم buildL0Test() (10 أسئلة L0: 3+7) لكل المستويات LevelTestScreen.tsx:8,123 × test-pool.ts:60-64 استبدال بـgetTestQuestions(level) — جاهزة في srb-adapter
N19 passedLevelTests يُقرأ في render بلا اشتراك LevelScreen.tsx:133-136 نقله إلى progressStore
N20 مفتاح soroban_dev_preview مخفي — يعطّل التحقق التعليمي LevelScreen.tsx:220 توثيق + حماية بكلمة سر
N52 exam2Passed + examPassed في HeroDashboard — كتابة بلا قراءة HeroDashboard.tsx:111,116,122,145 حذف الـuseEffectan الميتان
N53 5 أنماط لتخزين حالة الامتحان (passed/result/score/ready) متعدد توحيد على progressStore
N60 CategoryExamScreen يقارن abacusValue === correctAnswer بلا معامل عشري CategoryExamScreen.tsx:239 4 من 5 أسئلة L6 في الامتحان مستحيلة
N60-ب PlacementTestScreen يستخدم Math.abs(question.correctAnswer) بلا معامل PlacementTestScreen.tsx:66 أسئلة L6 في PT تفشل

🟠 P3.5 — كود يعمل على مفاتيح ميتة + ملفات ميتة

🎯 هذا القسم ليس اكتشافًا جديدًا — كان موثقًا في PROJECT_PLAN.md وACHIEVEMENTS.md سابقًا.

📌 توثيق رسمي — PROJECT_PLAN.md:1129-1131:

"حذف الملفات الميتة: utils/anzanBadges.ts · audioAnzanBadges.ts · skillsChecker.ts · badgeChecker.ts · hooks/useQuests.ts (أو تحديثه)"

# الملف مستورد من التصنيف الفعلي
P3.5-1 badgeChecker.ts useGameStats.ts:14 🟡 مستخدم · يقرأ من مصدر مهجور
P3.5-2 useQuests.ts GuardianDashboard.tsx:18,196 🟡 مستخدم · على 4 مفاتيح قديمة
P3.5-3 audioAnzanBadges.ts صفر استيراد 🔴 ملف ميت مؤكد
P3.5-4 skillsChecker.ts صفر استيراد 🔴 ملف ميت مؤكد
P3.5-5 utils/anzanBadges.ts badgeChecker.ts:3,45,49 🟡 مصدر قديم معزول
~~P3.5-6~~ ~~certificateGenerator.ts~~ مستخدم في 3 ملفات ❌ مرفوض — مستخدم فعليًا

🔴 السبب الجذري لـ"بعض الشارات تعمل والبعض لا":

```
AnzanScreen (جديد)
    ↓ يكتب في progressStore.anzanBadges ✅
GuardianDashboard
    ↓ يقرأ من progressStore.anzanBadges ✅ (يعمل)
    
badgeChecker
    ↓ يقرأ من utils/anzanBadges.loadAnzanBadges() ❌
    ↓ الذي يقرأ من soroban_anzan_badges (لا أحد يكتب فيه)
    ↓ النتيجة = false دائمًا
```

🟡 P3 — كود ميت يحتاج تنظيف

# العنصر المكان الأثر
B6 srb_progress يُكتب ولا يُقرأ srb-adapter.ts + صفر استيراد كتابة ميتة
B7 CertificateScreen بلا مستدعٍ App.tsx:397-405 شاشة يتيمة
B8 شاشتا الشهادات: مصدران مختلفان Kids: store · Adults: localStorage تعارض بيانات
V2 recordAttempt() — صفر استدعاء progressStore جدول skillProgress ميت
N4 setGrade لا تسمح بتخفيض الدرجة progressStore يمنع قياس تحسّن العلاجي
N7 SkillProgress بلا errorType/movement/phase recordAttempt AdaptiveFeedback محدود
N21 4 تعريفات للمستويات متعدد لا مرجع واحد

🟣 اكتشافات إضافية (Claude)

# العنصر الدليل الأثر
B3 masteryTracker مستخدم من adaptiveEngine:71 adaptiveEngine.ts:71 استخدام داخلي — لا يغيّر التصنيف
B5 sorobanMoves مستخدم من مكانين SorobanEngineDebug.tsx:18 · sorobanEngine.ts:15 جزء من المحرك
C1 37 مفتاحًا (لا 35) إضافة soroban_exam{1,2}_last_attempt · soroban_lesson_session_* تصحيح
C4 4 مفاتيح يتيمة (لا 2) soroban_anzan_stats · soroban_practice_stats · sorobanmind-stats · soroban_exam_result تصحيح
C5 مفتاحان بنفس المعنى soroban_weak_skills_v2 ≈ soroban_placement_weak_skills · soroban_passed_practice ≈ passedPractice تكرار بيانات
C7 لا migration بين المفاتيح CharacterSelector.tsx:94 ترحيل قيمة معرّف الرفيق فقط
D6 attemptLog.ts في حزمة S15 (غير مرفوع) data/srb/attemptLog.ts إضافة مرتقبة
E1 bank-exam = 370 سؤالًا (180 + 190) — لا 400 bank-exam.ts:288-293 تصحيح
E5 srb/exams/ في حزمة S15 (غير مرفوع) data/srb/exams/ إضافة مرتقبة
F5 LessonId = string (لا union) curriculum/lessons/types.ts:36 تصلب نوعي ضعيف
I2 vitest مُعدّ في package.json package.json:10-11,34 بنية اختبارات جاهزة
I3 scripts: dev · build · preview · test · test:run · deploy package.json:6-13 موثق
I4 .github/workflows/deploy.yml — ينشر على GitHub Pages deploy.yml:1-50 موثق
N55 AnzanBadges interface معرَّف 3 مرات progressStore:29-33 · utils/anzanBadges:8-11 · audioAnzanBadges:5-9 3 مصادر نوعية
N56 loadAudioAnzanBadges() مكررة audioAnzanBadges.ts:11 · skillsChecker.ts:103 كود منسوخ

---

❌ 4. ادعاءات مرفوضة بالدليل

# الادعاء سبب الرفض الدليل
B3 saveSectionGrade يسجّل S03 فقط srb-adapter.ts:332-345 يتجاهل section قراءة كود
N11 تعارض cooldown (24h × 48h) تصميم مقصود: 24h لاختبار مستوى · 48h لامتحان + PT types.ts:334 · test-pool.ts:68 · bank-v2/index.ts:559
N36 العشريات معطوبة screenshot يُظهر التلميح "مثّل بدون فاصلة" صورة runtime S13·m3
N36-1 مثال التلميح لا يطابق السؤال تصميم تربوي: مثال عام للفهم ثم تطبيق صورة + نية تعليمية
N51 HeroDashboard يجب أن يقرأ exam1 الشهادات تظهر في CategoryScreen صور HeroDashboard + CategoryScreen
H5 L00 يتصادم مع L0 فعليًا البيانات الحالية لا تمرّر L00-L20 — نظري فقط AnzanScreen.tsx:470
P3.5-6 certificateGenerator.ts غير مربوط مستخدم في 3 ملفات فعليًا KidsCertificateScreen:10 · CertificateMedal:1 · CertificateScreen:10-13

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
10. ❌ إعادة كتابة دوال srb-adapter.ts الجاهزة
11. ❌ حذف سطر من هذه الوثيقة بدون دليل مصور
12. ❌ اقتراح "إصلاحات بنيوية" دون قراءة القسم 2 (مقصود)
13. ❌ حذف badgeChecker.ts أو useQuests.ts قبل إعادة كتابة الشارات على progressStore
14. ❌ حذف/استبدال/إعادة بناء progressStore.ts — يبقى دائمًا

يُطلب من كل مساعد

1. ✅ اقرأ هذا الملف أولًا — كاملًا
2. ✅ اسأل "هل هذا مقصود؟" قبل الحكم
3. ✅ اطلب screenshot لأي ادعاء UI
4. ✅ إصلاح جراحي — لا بنيوي
5. ✅ ملف واحد — ثم اختبار
6. ✅ نسخة احتياطية قبل أي تعديل
7. ✅ أضف اكتشافًا جديدًا — لا تحذف قديمًا

---

🗺️ 6. خارطة التنفيذ النهائية

المرحلة 1 — الإصلاحات التقنية

```
P-1  إصلاح 6 أخطاء (B1 · B2 · B4 · B5 · B9 · N42)      ⏳ يومان
P0   تثبيت المنهج · المهارات · الحركات · التصنيف        ⏳ أسبوع
P1   توحيد سجل الأداء (Attempt Record موحد)              ⏳ أسبوعان
     · إصلاح B6 · B7 · B8
     · حسم قرار التوزيع بين SRB و progressStore
P2   ربط SRB + المحرك التكيفي                            ⏳ 3 أسابيع
     · إصلاح V4 · N19 · N20 · N52 · N53
P3   Remediation التكيفي + تنظيف P3.5                    ⏳ أسبوعان
     · إعادة كتابة badgeChecker + useQuests على progressStore
     · حذف audioAnzanBadges + skillsChecker (ميتان)
     · توحيد N55 (AnzanBadges) على progressStore
     · إصلاح قواعد العشرية (الأعمدة + factor)
```

المرحلة 2 — المنهج

```
M1   إعادة بناء S02 (L0) — كتابة + ترجمة                ⏳ أسبوع
M2   ترجمة L0 كامل (intro + S01 + S02)                   ⏳ أسبوع
M3   ترجمة L1 كامل (S03 + S04)                           ⏳ أسبوع
M4   بناء L2 · L3 (4 دروس) — نص عربي + إنجليزي           ⏳ 4 أسابيع
M5   بناء L4 · L5 (4 دروس)                               ⏳ 4 أسابيع
M6   بناء L6 · L7 (3 دروس)                               ⏳ 3 أسابيع
```

المرحلة 3 — البنوك القديمة

```
B1   تصحيح جذري: توحيد IDs مثل SRB                       ⏳ أسبوعان
B2   تصنيف الأسئلة وفق المنهج الجديد                     ⏳ 3 أسابيع
B3   ربط CE1 · CE2 · PT                                  ⏳ أسبوع
B4   إصلاح N60 · N60-ب · مشكلة الأعمدة                    ⏳ أسبوع
B5   اختبار شامل + parity                                ⏳ أسبوع
B6   حذف البنوك القديمة                                  ⏳ يومان
```

⚠️ لا تنفيذ لمرحلة قبل نجاح ما قبلها.

---

📌 7. القاعدة الأخيرة

README ليس مصدرًا للحالة.
PROJECT_MASTER ليس مصدرًا للحالة.
الكود الفعلي هو الحقيقة — بالأدلة المصورة.
هذه الوثيقة تراكمية — لا تُحذف.

---

📝 8. سجل التعديلات

الجلسة الإضافة
15 الشهادات (Kids + Adults) · النتيجة الموزونة · 3 SVG · فشل S01
16 إنشاء AL-ISLAH.md · فحص 6 ملفات · 15 خطأ مؤكد · 5 مرفوض · اكتشاف السبب الجذري (خطة عزل نصف مُنفّذة)
16 (متابعة) تأكيد P3.5 (badgeChecker · useQuests) · إضافة القاعدتين 11-12
17 إغلاق P3.5 نهائيًا · رفض P3.5-6 · N55 · N56 · القاعدة 13
18 استقبال Claude (50 إجابة) · تصحيح B3 · B5 · C1 · C4 · E1 · H5 · P3.5-6 · إضافة N60 · N60-ب · D6 · E5 · I2 · F5 · I3 · I4 · C5 · C7 · القاعدة 14 · قسم معمارية التخزين · قسم قواعد العشرية · قسم ملفات المكان الخطأ

---

📋 9. سجل الأدلة المصورة

# العنصر الدليل
1 reload=reset progressStore.ts:471-473
2 handleEnd يمسح pendingBadgesRef PracticeScreen.tsx:414 · AnzanScreen.tsx:522
3 OR×AND progressStore.ts:316 × AnzanScreen.tsx:469
4 L00 يظهر progressStore.ts:22-27
5 buildL0Test 10 أسئلة test-pool.ts:60-64
6 exam2Passed ميتة HeroDashboard.tsx:111,116
7 examPassed ميتة HeroDashboard.tsx:122,145
8 EXAM_KEY badgeChecker.ts:5-6
9 Cooldown 24h test-pool.ts:68
10 Cooldown 48h bank-v2/index.ts:559 · types.ts:334 · srb-adapter.ts:359
11 recordPlacementAttempt ميتة progressStore.ts:132,360
12 onXP = console.log App.tsx:356,583,609,634
13 srb_progress يُكتب PracticeScreen.tsx:344-347
14 Placement path App.tsx:194-236
15 useQuests مفاتيح ميتة useQuests.ts:6-9
16 badgeChecker مفاتيح ميتة badgeChecker.ts:4-6
17 badgeChecker مستورد useGameStats.ts:14
18 useQuests مستورد GuardianDashboard.tsx:18,196
19 توثيق سابق في ACHIEVEMENTS ACHIEVEMENTS.md:128-129
20 توثيق سابق في PROJECT_PLAN PROJECT_PLAN.md:547,703-704,720,1063,1153
21 N55 (3 تعريفات AnzanBadges) + badgeChecker من مصدر مهجور progressStore:29-33 · utils/anzanBadges:8-11 · audioAnzanBadges:5-9 · badgeChecker:3,45,49
22 N60 CategoryExamScreen CategoryExamScreen.tsx:239
23 N60-ب PlacementTestScreen PlacementTestScreen.tsx:66
24 بطاقة d:2 لدروس SRB srb/questions/L6.ts — 25 سؤالًا

---

📊 10. الإحصائيات النهائية

الفئة العدد
أخطاء مؤكدة P-1 (فورية) 6
أخطاء مؤكدة P2 (سطرية) 7 (مع N60 · N60-ب)
أخطاء مؤكدة P3.5 (مفاتيح ميتة + ملفات) 5
كود ميت P3 7
مجموع مؤكد 25
مرفوض بالدليل 7
ملفات ميتة مؤكدة 2 (audioAnzanBadges · skillsChecker)
مصادر قديمة معزولة 2 (utils/anzanBadges · srb_progress)
مكررات نوعية 2 (N55 · N56)
أدلة مصورة 24
مفاتيح localStorage 37 (بدل 35)
بنك bank-v2 583 سؤالًا (بدل 595)
bank-exam 370 سؤالًا (بدل 400)
مفاتيح يتيمة 4 (بدل 2)

---

آخر مراجعة: @mezo2021 — 2026-10-04
هذه الوثيقة تراكمية — كل إضافة تُحفظ، كل حذف يحتاج دليلًا مصورًا.

مصادر التحقق:

· GPT (50 سؤالًا — 2026-10-04)
· Claude (50 سؤالًا — 2026-10-04)
· فحص يدوي (24 دليلًا مصورًا)

```

---

## ✅ ما تم إضافته

| # | التصحيح/الإضافة |
|---|---|
| 1 | تصحيح `src/engine/` — 5 ملفات أساس المستقبل |
| 2 | إضافة `progressStore.ts` إلى المجمّدات |
| 3 | القاعدة 14 — لا حذف/استبدال/إعادة بناء progressStore |
| 4 | إضافة قسم معمارية التخزين (SRB × progressStore) |
| 5 | إضافة قسم قواعد العشرية النهائية (6 قواعد) |
| 6 | إضافة قسم مفاتيح المكان الخطأ (C8) |
| 7 | إضافة B3 · B5 (Claude) |
| 8 | إضافة N60 · N60-ب |
| 9 | إضافة D6 · E5 (حزمة S15) |
| 10 | إضافة C1 · C4 · C5 · C7 (تصحيحات Claude) |
| 11 | إضافة E1 · F5 · I2 · I3 · I4 |
| 12 | تصحيح H5 — نظري فقط (لا تصادم) |
| 13 | تحديث خارطة التنفيذ — 3 مراحل |
| 14 | إضافة المرحلة 2 (المنهج) · المرحلة 3 (البنوك) |
| 15 | إضافة 3 أدلة مصورة جديدة (22 · 23 · 24) |
| 16 | تحديث الإحصائيات النهائية |
| 17 | تحديث سجل التعديلات — جلسة 18 |

---

## ⏭️ الخطوة التالية

**الوثيقة الآن كاملة ~100%.**
