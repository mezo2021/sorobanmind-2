```
# 🛡️ AL-ISLAH.md
# وثيقة حماية وإصلاح مشروع SorobanMind v2

> **اقرأ هذا الملف كاملًا قبل أي اقتراح أو تعديل.**
> يوثّق 6 أشهر من العمل + تحقيقات فحص حقيقية بالأدلة المصورة.
> **القاعدة العليا:** ⛔ لا نبدأ من الصفر. لا نعيد البناء. لا نعيد الكتابة.
> **القاعدة الثانية:** ✅ الوثيقة **تراكمية** — لا يُحذف سطر إلا بدليل مصور يرفضه.

**آخر تحديث:** 2026-10-06 — نهاية الجلسة 23
**الحالة:** ✅ البناء أخضر · **27 إصلاحًا مكتملًا** · FIX 7 يعمل · الشهادات مربوطة · الجلسة العلاجية بشرط 70% · بنك SRB exam L0-L3 مكتمل (430 سؤالًا)
**مصادر التحقق:** فحص يدوي (29 دليلًا مصورًا) · تحليل GPT (50 سؤالًا) · تحليل Claude (50 سؤالًا) · جلسات Gemini المكثّفة (جلسة 23)

---

## 📖 1. الحقيقة الجوهرية — اقرأ أولًا

المشروع **مكتمل ~92%**. عمره 6 أشهر. **يعمل ويستخدمه أطفال**.

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
bank-v2/ بنك قديم — سيُقطع ارتباطه ثم يُحذف (لا نقل · ربط SRB مباشرة)
bank-raw/ بنك قديم — سيُقطع ارتباطه ثم يُحذف (لا نقل · ربط SRB مباشرة)
bank-linked.ts · bank-adapter.ts جسور انتقالية — تُلغى تدريجيًا مع كل ربط بـSRB
src/engine/ (5 ملفات) أساس المستقبل — لم يُبنَ بعد
L00-L20 في LevelId بنوك الامتحانات الحالية
37 مفتاح localStorage مرحلة انتقالية
srb_progress سيُفعَّل في P1
Cooldown 24h لاختبار مستوى (X) تشجيع الإعادة السريعة
Cooldown 48h لامتحان قسم + Placement جدية رسمية
soroban_dev_preview وضع مطوّر — تم توثيقه في FIX 7

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

· البنك (275 سؤالًا في A · 430 سؤالًا في exam B)
· المنهج (8 مستويات · 15 درسًا · 51 مهارة)
· الجلسات (sessionBuilder)
· التقييم (practice · anzan · audio)
· التصنيف (L·S·m·A)
· العلاجي (remediation)
· الامتحانات (exams — L0-L3 مكتمل)

progressStore — حالة الطفل:

· بيانات الطفل (name · category)
· التقدم (completedLevels · completedLessons)
· الدرجات (grades)
· الشارات (anzanBadges · masteryBadges)
· XP · streak
· الإعدادات (language · sound · haptics)
· pendingRemediation · remediationHistory (جلسة 22)

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
REMEDIATION_PASS_THRESHOLD 70% RemediationScreen (جلسة 22)
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

✅ تم تطبيق القواعد في:

· ✅ CategoryExamScreen.tsx — N60 (2026-10-05)
· ✅ PlacementTestScreen.tsx — N60-ب (2026-10-05)
· ✅ PracticeScreen.tsx — (سابقًا · قبل الجلسة 20)
· ✅ AnzanScreen.tsx — (سابقًا · قبل الجلسة 20)
· ✅ AudioAnzanScreen.tsx — (سابقًا · قبل الجلسة 20)

⬅️ تبقّى:

· srb/questions/L6.ts — الأسئلة الـ25 (تحتاج تطبيق القاعدة)
· LevelTestScreen — بعد نقل X إلى SRB (P6)

---

🩹 3. أخطاء مؤكدة بالدليل (تراكمي)

✅✅✅ P-1 — مكتملة (الجلسة 20 — 2026-10-05)

الخطأ الدليل الحالة

N42 XP مفقود في 4 شاشات App.tsx:356,583,609,634 ✅ تم
B9 recordPlacementAttempt() ميت progressStore.ts:132,360 · App.tsx:231-236 ✅ تم
B1 reload() = reset() — دالة ميتة progressStore.ts:471-473 ✅ تم
B4 AnzanScreen:469 AND — بينما store يقبل OR progressStore.ts:316 × AnzanScreen.tsx:469 ✅ تم
B5 Number(level.slice(1)) — L00 خطر كامن progressStore.ts:22-27 × AnzanScreen.tsx:470 ✅ تم
N60 العشرية في الامتحانات CategoryExamScreen.tsx:239 ✅ تم
N60-ب العشرية في Placement PlacementTestScreen.tsx:66 ✅ تم

⬅️ B2 (handleEnd) = مقصود — لا يُلمس.

✅✅✅ FIX 7 — وضع المعاينة (مكتمل 2026-10-05)

الملف التعديل الحالة

1 utils/previewMode.ts جديد — أداة موحّدة ✅
2 screens/GuardianDashboard.tsx زر toggle ✅
3 screens/LevelScreen.tsx توسيع 5 فحوصات ✅
4 screens/CategoryScreen.tsx فتح المستويات ✅
5 screens/CategoryExamScreen.tsx تجاوز cooldown + حماية البيانات ✅
6 screens/CertificateScreen.tsx درجات افتراضية 95% ✅
7 screens/KidsCertificateScreen.tsx درجات افتراضية 92% ✅

✅ ربط CertificateScreen (شهادة الكبار — 2026-10-05)

الملف التعديل الحالة

1 App.tsx استيراد CertificateScreen ✅
2 App.tsx case 'certificate' ✅
3 App.tsx category-exam-2.onComplete → 'certificate' ✅
4 App.tsx حذف من getComingSoonTitle ✅
5 App.tsx حذف من ComingSoon ✅

✅✅✅ P2 — إصلاحات سطرية (مكتملة جزئيًا 2026-10-05)

الخطأ الدليل الحالة

~~V4~~ LevelTestScreen يستخدم buildL0Test LevelTestScreen.tsx:8,123 ⏳ (مؤجل لـP6)
~~N19~~ passedLevelTests غير تفاعلي LevelScreen.tsx:133-136 ⏳ مؤجل
N20 soroban_dev_preview مخفي LevelScreen.tsx:220 ✅ حُلّ ضمنيًا بـFIX 7
~~N52~~ exam2Passed + examPassed ميتان HeroDashboard.tsx:111,116,122,145 ⏳ مؤجل
~~N53~~ 5 أنماط لحالة الامتحان متعدد ⏳ مؤجل

✅✅✅ P2 الجديدة — مكتملة (2026-10-05 · الجلسة 22)

الخطأ الدليل الحالة

N62 الجلسة العلاجية بلا تقييم RemediationScreen.tsx:154-175 ✅ تم
N63 الجلسة من الشاشات لا تُحسب PracticeScreen.tsx:446-451 ✅ تم (حلّه N69)
N68 Flash يُعاد بلا نهاية AnzanScreen.tsx ✅ تم
N69 isMandatory مفقود في Practice PracticeScreen.tsx:446-451 ✅ تم
N61 عرض الدرجات في CategoryScreen CategoryScreen.tsx ✅ تم

تفاصيل N62 (فصل الإتمام عن الخروج + 70%):

· completeSession بدل finalizeSession — تُسجّل في remediationHistory وتُزيل pending عند 70%+.
· handleEnd — خروج فقط · لا يُسجّل.
· phase الحقيقي بدل 'practice' المُثبَّت.
· outcome انتقل من PendingRemediation إلى RemediationSession (اختياري — لا migration).
· 4 مواضع setPendingRemediation عُدّلت (إزالة outcome منها).

تفاصيل N68 (قفل الوضع بعد النجاح):

· AnzanScreen — شاشة intro تعرض "✅ أنهيت هذا الوضع" بعد 70%+.
· getFixedBeadSize (السابق getAutoBeadSize) — حجم ثابت 44px لـ3+ أعمدة.
· زر "ابدأ" يختفي · يظهر التبديل للوضع الآخر.

تفاصيل N61 (عرض الدرجات في Category):

· زر "بصري ✓ X٪" — متوسط (عادي + Flash).
· زر "سمعي ✓ X٪" — درجة الأنزان السمعي.
· مطابق لنمط زر "تمرّن ✓ X٪".

✅✅✅ P4 — بنك SRB exam (مكتمل جزئيًا — الجلسة 23 · 2026-10-06)

الخطأ الدليل الحالة

N70 compound-sub مفقود في SRBMovementType src/data/srb/types.ts:73-84 ✅ تم
N71 بناء بنك SRB exam L0 (42 سؤالًا) srb/exam/L0.ts ✅ تم
N72 بناء بنك SRB exam L1 (227 سؤالًا) srb/exam/L1.ts ✅ تم
N73 بناء بنك SRB exam L2 (80 سؤالًا) srb/exam/L2.ts ✅ تم
N74 بناء بنك SRB exam L3 (80 سؤالًا) srb/exam/L3.ts ✅ تم

تفاصيل N70 (compound-sub):

· SRBMovementType كان يفتقد القيمة "compound-sub".
· أُضيفت "compound-sub" و "compound-add" احتياطيًا.
· أثر: جميع أسئلة L3 (S09·m4 و S10·m4) تُبنى بنجاح.

تفاصيل N71 (L0 — 42 سؤالًا):

· S01 (تمثيل 0-9): m1 (0-4) = 8 · m2 (5-9) = 6.
· S02 (القيمة المكانية): m1 (آحاد/عشرات) = 16 · m2 (مئات/آلاف) = 12.
· m3 من S01 محذوف (تثبيت مكرر).

تفاصيل N72 (L1 — 227 سؤالًا):

· S03 (الجمع): m1=46 · m2=19 · m3=22 · m4=30.
· S04 (الطرح): m1=22 · m2=42 · m3=30 · m4=16.

تفاصيل N73 (L2 — 80 سؤالًا):

· S07 (ضرب 1×2): m1=10 · m2=10 · m3=10 · m4=10.
· S08 (ضرب 2×2): m1=10 · m2=10 · m3=10 · m4=10.

تفاصيل N74 (L3 — 80 سؤالًا):

· S09 (قسمة ÷1 · 2÷1): m1=10 (تامة·direct) · m2=10 (تامة·five-friend-sub) · m3=10 (مع باقي·ten-friend-sub) · m4=10 (مع باقي·compound-sub).
· S10 (قسمة ÷2 · 3÷2): m1=10 (تامة·direct) · m2=10 (تامة·five-friend-sub) · m3=10 (تامة·ten-friend-sub) · m4=10 (تامة·compound-sub).

🔴 P3.5 — كود يعمل على مفاتيح ميتة

الملف مستورد من التصنيف

P3.5-1 badgeChecker.ts useGameStats.ts:14 🟡 مستخدم · مصدر مهجور
P3.5-2 useQuests.ts GuardianDashboard.tsx:18,196 🟡 مستخدم · 4 مفاتيح قديمة
P3.5-3 audioAnzanBadges.ts صفر استيراد 🔴 ملف ميت
P3.5-4 skillsChecker.ts صفر استيراد 🔴 ملف ميت
P3.5-5 utils/anzanBadges.ts badgeChecker.ts:3,45,49 🟡 مصدر معزول
~~P3.5-6~~ ~~certificateGenerator.ts~~ مستخدم في 3 ملفات ❌ مرفوض
P3.5-7 bank-v2/index.ts سيُقطع خلال المرحلة 6 🔴
P3.5-8 bank-raw/ سيُقطع خلال المرحلة 6 🔴

🟡 P3 — كود ميت

العنصر المكان

B6 srb_progress يُكتب ولا يُقرأ srb-adapter.ts
~~B7~~ ~~CertificateScreen بلا مستدعٍ~~ ✅ حُلّ — مربوط الآن
B8 شاشتا الشهادات: مصدران Kids: store · Adults: localStorage
V2 recordAttempt() — صفر استدعاء progressStore
N4 setGrade لا تخفّض progressStore
N7 SkillProgress بلا تفاصيل recordAttempt
N21 4 تعريفات للمستويات متعدد

🟣 اكتشافات Claude

العنصر الأثر

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

🟠 P3.6 — مكتشفات جلسة 22 (مؤجلة)

الخطأ الأولوية القرار

N64 تلميح العشرية في العلاجية 🟡 ⏸️ مؤجل · يعمل جزئيًا
N66 العشرية في PT (البنوك القديمة) 🔴 ⏸️ يُحل بـP6

---

❌ 4. ادعاءات مرفوضة بالدليل

الادعاء سبب الرفض

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

العنصر الموقع

1 نوع Attempt curriculum/types.ts
2 دالة createAttempt() engine/masteryTracker.ts
3 دالة recordAttempt() store/progressStore.ts
4 حقول skillProgress progressStore

مفقود:

العنصر الأثر

1 استدعاء recordAttempt skillProgress فارغ
2 استدعاء createAttempt لا Attempt يُنشأ

⬅️ النتيجة: التطبيق "أعمى" — لا يعرف الطفل، لا يكشف ضعفه، لا يتكيّف.

🎯 الحلقة الكاملة

```text
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

```text
70% من الأسئلة → المهارات الضعيفة
30% → مهارات جديدة
```

🎬 دورة كاملة — مثال

السؤال: 8 + 7 = ؟ · الإجابة: 14 · الزمن: 5.8 ث

الخطوة

1 PracticeScreen يحسب: correct=false
2 createAttempt يُنشئ Attempt
3 recordAttempt يُحدّث skillProgress
4 masteryTracker يُحلّل
5 adaptiveEngine يُقرّر
6 PracticeScreen يعرض 6 + 9 = ؟

✅ الفائدة

قبل:

```text
سؤال → إجابة → سؤال عشوائي
```

بعد:

```text
سؤال → قياس → كشف ضعف → علاج → قياس → إتقان → تقدم
```

📌 الخلاصة

البند الوظيفة

1 Attempt Record ماذا حدث؟
2 masteryTracker ماذا تعني؟
3 adaptiveEngine ماذا أعطي الآن؟
4 Practice/Anzan المكان

⬅️ recordAttempt = الحلقة المفقودة.

---

🗺️ 7. خارطة التنفيذ النهائية — 12 مرحلة

✅ المرحلة 0 — الحماية (مكتملة)

· ✅ رفع AL-ISLAH.md
· ✅ Tag: baseline-2026-10-04
· ✅ ZIP احتياطي

✅ المرحلة 1 — إصلاحات P-1 (مكتملة 2026-10-05)

· ✅ N42 · B9 · B1 · B4 · B5 · N60 · N60-ب

🟡 المرحلة 2 — توثيق ما يعمل (يوم)

· 2.1 كيف يعمل Practice
· 2.2 كيف يعمل Anzan
· 2.3 كيف يعمل SessionBuilder
· 2.4 كيف يعمل القفل
· 2.5 كيف يعمل LevelTest

✅ المرحلة 3 — وضع المعاينة (FIX 7 — مكتمل 2026-10-05)

· ✅ previewMode.ts + 7 ملفات

🟡 المرحلة 4 — إكمال المنهج (أسبوع)

· 4.1 إعادة بناء S02
· 4.2 ترجمة L0
· 4.3 ترجمة L1
· 4.4 L2 · L3
· 4.5 L4 · L5
· 4.6 L6 · L7

✅ المرحلة 5 — الشهادات (مكتملة 2026-10-05)

· ✅ ربط KidsCertificateScreen
· ✅ ربط CertificateScreen

🟡 المرحلة 6 — ربط SRB exam (أسبوعان · معدّلة 2026-10-06)

🎯 الهدف: قطع ارتباط bank-v2 و bank-raw · ربط كل الامتحانات بـSRB exam.

الأساس: src/data/srb/exam/ (L0-L3 مكتمل · L4-L7 متبقٍ).

· 6.1 بناء بنك SRB exam لـL4-L7:
· L4.ts — S05 · S06 (سلاسل الجمع والطرح) — ~80
· L5.ts — S11 · S12 (ضرب 2×3 · قسمة متقدمة) — ~40
· L6.ts — S13 · S14 (عشري) — ~25
· L7.ts — S15 (جذور) — ~25

· 6.2 بناء طبقة ثوابت SRB:
· src/data/srb/exam/constants.ts
· EXAM1_TIME_SEC · EXAM2_TIME_SEC
· EXAM_PASS_THRESHOLD (80%)
· EXAM_MAX_ATTEMPTS (2)
· EXAM_COOLDOWN_MS (48h)
· PRACTICE_QUESTION_COUNT (5)
· WEAK_SKILL_RATIO (0.7) · WEAK_SKILL_THRESHOLD (50)
· L0_TEST_COOLDOWN_MS (24h)
· PLACEMENT_COOLDOWN_MS (48h)

· 6.3 بناء طبقة الأدوات:
· src/data/srb/exam/timing.ts — TIMING_PROFILES + adaptTiming + applyAdaptiveSpeed
· src/data/srb/exam/weakness.ts — recordWeaknessAttempt + getWeakSkills
· src/data/srb/exam/classify.ts — classifyAdd + classifySub

· 6.4 بناء محرّكات البناء:
· src/data/srb/exam/examBuilder.ts
· pickHardest() — نفس منطق bank-v2
· EXAM1_DISTRIBUTION — L0:3 · L1:7 · L2:5 · L3:5
· EXAM2_DISTRIBUTION — L4:10 · L5:10 · L6:10 · L7:10
· buildExam1Category()
· buildExam2Category()

· 6.5 ربط CategoryExamScreen:
· استبدال import من '@/data/bank-v2'
· بـ import من '@/data/srb/exam'
· تعديل الحقول: prompt→question · correctAnswer→result
· levelId→level · skillId→section

· 6.6 ربط PlacementTestScreen:
· استبدال import من '@/data/bank-v2/placement-engine'
· بـ import من '@/data/srb/exam/placementEngine'

· 6.7 اختبار parity:
· بناء نفس الامتحان من البنكين (القديم + الجديد)
· مقارنة النتائج
· التأكد أن السلوك متطابق

· 6.8 قطع ارتباط bank-v2 و bank-raw:
· حذف import من كل الشاشات
· إبقاء الملفات في المستودع (للأمان)
· تسجيلها في قائمة "جاهز للحذف" (المرحلة 10)

⚠️ قواعد:
· لا نلمس progressStore.ts
· لا نلمس src/engine/
· لا نلمس srb-adapter.ts
· لا نلمس bank-linked.ts في هذه المرحلة

⏳ المرحلة 7 — Attempt Record (أسبوع) ← الأهم تعليميًا

· 7.1 PracticeScreen
· 7.2 AnzanScreen (V · F)
· 7.3 AudioAnzanScreen
· 7.4 CategoryExamScreen
· 7.5 PlacementTestScreen
· 7.6 اختبار

⏳ المرحلة 8 — masteryTracker (يومان)

· 8.1 isMastered في الشاشات
· 8.2 getMasteryPercentage
· 8.3 diagnoseWeakness
· 8.4 عرض في Guardian

⏳ المرحلة 9 — adaptiveEngine (أسبوع)

· 9.1 ربط problemGenerator بـSRB
· 9.2 ربط adaptiveEngine بـskillProgress
· 9.3 تطبيق 70/30
· 9.4 اختبار

⏳ المرحلة 10 — تنظيف البنوك (يومان)

· 10.1 التأكد أن كل مسار يعمل
· 10.2 حذف bank-v2 · bank-raw · bank-linked
· 10.3 تنظيف L00-L20

⏳ المرحلة 11 — تنظيف عام (أسبوع)

· 11.1 حذف audioAnzanBadges · skillsChecker
· 11.2 إعادة كتابة badgeChecker
· 11.3 إعادة كتابة useQuests
· 11.4 توحيد AnzanBadges
· 11.5 تنظيف مفاتيح ميتة

⏳ المرحلة 12 — الإصدار (أسبوع)

· 12.1 PWA
· 12.2 اختبار شامل
· 12.3 مشاركة

---

📊 8. الجدول الزمني

المرحلة الوقت الحالة
0 — الحماية يوم ✅
1 — إصلاحات P-1 يومان ✅
2 — توثيق يوم 🟡 جزئيًا
3 — وضع المعاينة يوم ✅
4 — المنهج أسبوع 🟡
5 — الشهادات يوم ✅
22 — إصلاحات P2 (N62·N63·N68·N69·N61) يوم ✅
23 — بنك SRB exam L0-L3 (430 سؤالًا) + N70 (compound-sub) 3 أيام ✅
6 (معدّلة) — ربط SRB exam + قطع bank-v2 · bank-raw أسبوعان 🟡 (L0-L3 ✅ · L4-L7 ⏳)
7 — Attempt Record أسبوع ⏳
8 — masteryTracker يومان ⏳
9 — adaptiveEngine أسبوع ⏳
10 — تنظيف البنوك يومان ⏳
11 — تنظيف عام أسبوع ⏳
12 — الإصدار أسبوع ⏳
المجموع المتبقي ~3 أسابيع

⬅️ تقدّمنا: 6 مراحل مكتملة · 3 أسابيع متبقية.

---

📋 9. جدول المسؤوليات

العنصر المصدر الحالي الهدف المرحلة
Practice SRB SRB ✅ جاهز
Anzan V · F · A SRB SRB ✅ جاهز
Level Test (X) buildL0Test SRB-X 6
CE1 bank-v2 srb/exam 6
CE2 bank-v2 srb/exam 6
PT bank-raw srb/exam 6
Attempt Record ❌ progressStore 7
Mastery ❌ masteryTracker 8
Adaptive ❌ adaptiveEngine 9
Certificates ✅ مرتبط progressStore ✅ 5
Badges ميتة progressStore 11
L4-L7 غير موجودة curriculum + srb/exam 6

---

✅ 10. القرارات المؤكدة

القرار الحالة

1 B4 — الأنزان البصري = AND + متوسط حسابي ✅ مُنفّذ
2 B2 — handleEnd = مقصود ✅
3 زر "فتح الكل" = وضع معاينة منفصل ✅ مُنفّذ
4 الشهادات = تُربط بـprogressStore ✅ مُنفّذ
5 البنوك = تُقطع ارتباطها ثم تُحذف ✅ مُحدَّث (جلسة 23)
6 Attempt Record = يُفعَّل في المرحلة 7 ⏳ التالي
7 adaptiveEngine = يُفعَّل في المرحلة 9 ⏳
8 المرافقين = يُبقيان ✅
9 الجلسة العلاجية = 70% للإتقان ✅ مُنفّذ (N62)
10 قفل الوضع بعد النجاح = نعم ✅ مُنفّذ (N68)
11 isMandatory={true} في كل الشاشات ✅ مُنفّذ (N69)
12 عرض الدرجات في CategoryScreen ✅ مُنفّذ (N61)
13 compound-sub في SRBMovementType ✅ مُنفّذ (N70 · جلسة 23)
14 قسمة ÷1 (2÷1) · ÷2 (3÷2) — التمييز بالباقي ✅ مُنفّذ (جلسة 23)
15 m3 من S01 محذوف · m3 من S09 = "قسمة بأصدقاء 10 مع باقي" ✅ مُنفّذ (جلسة 23)

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
19 قسم Attempt Record كامل · خارطة 12 مرحلة · جدول المسؤوليات · 8 قرارات مؤكدة · الجدول الزمني · B4 مصحّح · B2 مصنّف مقصود · P-1 محدّث
20 ✅ تنفيذ 7 إصلاحات P-1 · ✅ FIX 7 — وضع المعاينة (7 ملفات) · ✅ ربط CertificateScreen (5 تعديلات) · رفع النسبة 85% → 88%
21 ✅ N62 (فصل الإتمام + 70%) · ✅ N63 (العلاجية من الشاشات) · ✅ N68 (قفل الوضع) · ✅ N69 (isMandatory) · ✅ N61 (عرض الدرجات) · رفع النسبة 88% → 90% · 5 مراحل مكتملة
22 تحديث الملف الشامل · تسجيل 15 إصلاحًا · القرارات الجديدة (9-12) · إحصائيات محدّثة
23 ✅ N70 (compound-sub في SRBMovementType) · ✅ N71-N74 (بنك SRB exam L0-L3 — 430 سؤالًا) · ✅ تعديل الخطة: قطع bank-v2 · bank-raw ثم الحذف · ✅ إضافة قسم GEMINI_PLAYBOOK كمرجع · رفع النسبة 90% → 92% · 6 مراحل مكتملة

---

📋 13. سجل الأدلة المصورة

العنصر الدليل

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
25 FIX 7 + P-1 منفّذة الجلسة 20 — 2026-10-05 (بناء أخضر)
26 N62 · N68 · N69 · N61 منفّذة الجلسات 21-22 — 2026-10-05 (بناء أخضر)
27 الجلسة العلاجية تعرض النتيجة Screenshot — شاشة done
28 قفل الوضع بعد النجاح Screenshot — AnzanScreen بعد Flash 100%
29 عرض الدرجات في Category Screenshot — "بصري ✓ ٩٠٪ · سمعي ✓ ٨٠٪"
30 compound-sub في SRBMovementType types.ts:73-84 (جلسة 23)
31 بنك SRB exam L0 (42 سؤالًا) srb/exam/L0.ts (جلسة 23)
32 بنك SRB exam L1 (227 سؤالًا) srb/exam/L1.ts (جلسة 23)
33 بنك SRB exam L2 (80 سؤالًا) srb/exam/L2.ts (جلسة 23)
34 بنك SRB exam L3 (80 سؤالًا) srb/exam/L3.ts (جلسة 23)

---

📊 14. الإحصائيات النهائية

الفئة العدد
✅ إصلاحات P-1 مكتملة 7
✅ FIX 7 ملفات معدّلة 7
✅ تعديلات ربط الشهادة 5
✅ إصلاحات P2 مكتملة (N62·N63·N68·N69·N61) 5
✅ إصلاحات P4 مكتملة (N70·N71·N72·N73·N74) 5
✅ إجمالي الإصلاحات المنفّذة 29 تعديل
⏳ أخطاء P2 متبقية 4 (V4 · N19 · N52 · N53)
⏳ أخطاء P3.5 متبقية 7
⏳ كود ميت P3 متبقٍ 6
⏳ P3.6 مؤجلة 2 (N64 · N66)
اكتشافات Claude 12
مجموع مؤكد 41
مرفوض بالدليل 7
ملفات ميتة 2 (audioAnzanBadges · skillsChecker)
مصادر معزولة 2 (utils/anzanBadges · srb_progress)
مكررات نوعية 2 (N55 · N56)
أدلة مصورة 34
مفاتيح localStorage 37
بنك bank-v2 583 سؤالًا
bank-exam 370 سؤالًا
بنك SRB exam L0-L3 430 سؤالًا
مفاتيح يتيمة 4
مراحل مكتملة 6/12 (0 · 1 · 3 · 5 + إصلاحات P2 + إصلاحات P4)
مراحل متبقية 6
الجدول المتبقي ~3 أسابيع

---

📖 15. مرجع بناء بنك SRB-B (GEMINI_PLAYBOOK)

الغرض: تحويل بنك الأسئلة القديم إلى بنك B موحّد.
المصدر: src/data/bank-v2/part-01.ts → part-04.ts (قديم · للتوجيه فقط).
الهدف: src/data/srb/exam/L0.ts → L7.ts.

15.1 القاعدة الذهبية

Gemini ينسى · لذا كل رسالة يجب أن تكون مكتفية بذاتها.
لا مرجع سابق · لا "كما قلنا" · لا "استمر".
كل رسالة = تعليمات كاملة + ملف كامل + مطلوب محدد.

15.2 القالب الثابت — يُنسخ في كل رسالة

```
مهمة: ولّد 10 أسئلة لبنك امتحان في مهارة واحدة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 المهارة المطلوبة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

· level: "[L0-L7]"
· section: "[S01-S15]"
· module: "[m1-m4]"
· المهارة: [وصف مختصر]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 القاعدة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[شرح الطريقة + الشرط المميّز]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 مثال توضيحي (لا تكرره)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[مثال كامل مع خطوات المعداد]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔢 المطلوب
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

10 أسئلة جديدة · لا تكرر المثال.

⚠️ شرط إضافي:
لا تكرر أي ناتج نهائي (result) في الأسئلة العشرة.
كل النواتج يجب أن تكون فريدة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 صيغة الإخراج
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SRB_L[X]_S[XX]_m[X] = [
makeQuestion({
  level: "...",
  section: "...",
  module: "...",
  sequence: 1,
  variant: "B",
  primary_phase: "CE",
  allowed_phases: ["CE", "PT", "X"],
  question: "...",
  operands: [...],
  operation: "...",
  result: ...,
  solution: "...",
  movement: "...",
  difficulty: ...,
  expected_time_ms: ...,
  expected_anzan_ms: 0,
  tags: [...],
}),
// ... حتى sequence: 10
];

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ القواعد الحرجة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. لا تستخدم id — sequence من 1 إلى 10.
2. variant = "B" · primary_phase = "CE".
3. allowed_phases = ["CE", "PT", "X"].
4. expected_anzan_ms = 0.
5. movement مطابق للوحدة (m1→direct · m2→five-friend ...).
6. لا تكرار في result.
7. tags يحوي "L[Level]" و "movement".
8. solution يشرح: الحساب + موضع القضيب + القاعدة + النتيجة.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

جاهز؟ ابدأ التوليد مباشرة.
```

15.3 جدول الدروس → m (المرجع الكامل)

L0 — التمهيدي

Section m1 m2 m3
S01 (تمثيل 0-9) 0-4 5-9 محذوف (تثبيت)
S02 (القيمة المكانية) آحاد/عشرات (11-99) مئات/آلاف (100-9999) —

L1 — الجمع والطرح

Section m1 m2 m3 m4
S03 (الجمع) direct five-friend-add ten-friend-add compound-add
S04 (الطرح) direct five-friend-sub ten-friend-sub compound-sub

L2 — الضرب

Section m1 m2 m3 m4
S07 (ضرب 1×2) direct five-friend-add ten-friend-add compound-add
S08 (ضرب 2×2) direct five-friend-add ten-friend-add compound-add

L3 — القسمة (المرجع المُحدَّث — جلسة 23)

Section m1 m2 m3 m4
S09 (÷1 · 2÷1) direct · تامة five-friend-sub · تامة ten-friend-sub · مع باقي compound-sub · مع باقي
S10 (÷2 · 3÷2) direct · تامة five-friend-sub · تامة ten-friend-sub · تامة compound-sub · تامة

المبدأ التربوي المُعتمد:

· قسمة تامة (باقي = 0): m1 = مباشر · m2 = أصدقاء 5 فقط.
· قسمة مع باقي (باقي > 0): m3 = أصدقاء 10 · m4 = مركّب (5 + 10).
· في S10 (3÷2): يمكن أن تستدعي 10 حتى بدون باقٍ (الخطوة 1 عند آحاد M < آحاد q1·D).

L4 — السلاسل

Section m1 m2 m3 m4
S05 (سلاسل جمع) direct five-friend-add ten-friend-add compound-add
S06 (سلاسل طرح) direct five-friend-sub ten-friend-sub compound-sub

L5 — ضرب وقسمة متقدم

Section m1 m2 m3 m4
S11 (ضرب 2×3) direct five-friend-add ten-friend-add compound-add
S12 (قسمة متقدمة) direct five-friend-sub ten-friend-sub compound-sub

L6 — العشري

Section m1 m2 m3
S13 (عشري جمع/طرح) direct 5+10 compound
S14 (عشري ضرب/قسمة) ضرب قسمة —

L7 — الجذور

Section m1
S15 (الجذور التربيعية) direct

15.4 قواعد التحقق الرياضي

الجمع (S03 · S05)

Input: a + b

```
1. c = a%10 · l = سفليات مفعّلة في الآحاد
2. إذا (c + b) ≤ 4 → m1 (direct)
3. إذا (c + b) ≥ 5 و (c+b) ≤ 9 و b ≤ 4 → m2 (five-friend-add)
   الشرط: العلوية فارغة
4. إذا (c + b) > 9 → تحقق:
   · k = 10 - b
   · إذا (سفليات مفعّلة ≥ k) → m3 (ten-friend-add)
   · إذا (العلوية مفعّلة) و (سفليات < k) → m4 (compound-add)
5. حالات أخرى → غير مصنّف
```

الطرح (S04 · S06)

Input: a - b

```
1. c = a%10 · l = سفليات مفعّلة
2. إذا b ≤ 4 و l ≥ b → m1 (direct)
3. إذا b = 5 و العلوية مفعّلة → m1
4. إذا b > 5 و العلوية مفعّلة و l ≥ b-5 → m1
5. إذا c ≥ b و l < b و العلوية مفعّلة → m2 (five-friend-sub)
6. إذا c < b → تحقق:
   · k = 10 - b
   · إذا (سفليات فارغة ≥ k) → m3 (ten-friend-sub)
   · إذا (سفليات فارغة < k) → m4 (compound-sub)
7. حالات أخرى → غير مصنّف
```

الضرب (S07 · S08 · S11)

```
1. نفّذ الضرب ذهنياً
2. راقب كل عملية جمع جزئية
3. إذا كل الجمع بسيط → m1
4. إذا أي جمع يحتاج صديق 5 → m2
5. إذا أي جمع يحتاج صديق 10 → m3
6. إذا أي جمع يحتاج صديق 5 + صديق 10 → m4
```

القسمة (S09 · S10 · S12)

```
1. نفّذ القسمة ذهنياً
2. راقب كل عملية طرح جزئي
3. إذا كل الطرح بسيط → m1
4. إذا أي طرح يحتاج صديق 5 → m2
5. إذا أي طرح يحتاج صديق 10 → m3
6. إذا أي طرح يحتاج 5 + 10 → m4
```

15.5 قائمة الفحص الـ7

# الفحص كيف؟
1 العدد Ctrl+F على makeQuestion · يُطابق المطلوب
2 variant كل القيم "B" · لا "A"
3 sequence 1 → N · بلا تكرار · بلا فجوات
4 movement يُطابق m (m1=direct · m2=five-friend...)
5 operation يُطابق الدرس (S03=addition · S04=subtraction)
6 imbalanced نسبة m1·m2·m3·m4 منطقية
7 duplicates لا سؤال مكرر · لا result مكرر

علامات خطأ شائعة

العلامة المشكلة
variant: "A" يجب "B"
sequence: 15 في m2 إعادة ترقيم
movement: "direct" في m2 تصنيف خاطئ
عدد ≠ المطلوب ناقص/زائد
expected_anzan_ms: 3000 يجب 0
result مكرر يكسر شرط الفريدة

15.6 قوالب التصحيح

خطأ variant

```
الملف يحتوي variant: "A" في بعض الأسئلة.
القاعدة: كل variant يجب أن يكون "B".
أعد إرسال الملف بعد التصحيح.
```

خطأ ترقيم

```
sequence في m2 يبدأ من 47 (يكمل m1).
القاعدة: كل مجموعة (L,S,m) لها ترقيمها الخاص من 1.
أعد إرسال m2 بـsequence من 1 → N.
```

خطأ تصنيف

```
sequence X: [السؤال] مصنّف m3 · لكنه فعلاً m4.
السبب: [شرح رياضي].
انقله لـm4 وأعد الترقيم.
```

عدد خاطئ

```
العدد المتوقع: N · الموجود: M.
راجع الملف الأصلي · احسب عدد الأسئلة الفعلي.
إذا M < N → أسئلة مفقودة.
إذا M > N → تكرار.
```

result مكرر

```
البواقي (result) مكررة:
· القيمة X ظهرت Y مرات (seq A, B, C)
القاعدة: كل result فريد.
أعد توليد الأسئلة المكررة.
```

15.7 خريطة الملفات النهائية

```
src/data/srb/exam/
├── L0.ts                     ← 42 سؤالًا (S01: 14 · S02: 28)
├── L1.ts                     ← 227 سؤالًا (S03: 117 · S04: 110)
├── L2.ts                     ← 80 سؤالًا (S07: 40 · S08: 40)
├── L3.ts                     ← 80 سؤالًا (S09: 40 · S10: 40)
├── L4.ts                     ← ~80 (S05 · S06)
├── L5.ts                     ← ~40 (S11 · S12)
├── L6.ts                     ← ~25 (S13 · S14)
├── L7.ts                     ← ~25 (S15)
├── types.ts                  ← SRBExamQuestion
├── index.ts                  ← ALL_EXAM_QUESTIONS + دوال
├── constants.ts              ← ثوابت الامتحانات
├── examBuilder.ts            ← buildExam1Category · buildExam2Category
└── placementEngine.ts        ← buildPlacementTest · evaluatePlacementTest
```

15.8 واجهة الاستخدام المستقبلية

```ts
// CE1 — امتحان قسم الصغار
import { getExamQuestionsByLevels } from '@/data/srb/exam';
const ce1 = getExamQuestionsByLevels(['L0', 'L1', 'L2', 'L3']);

// CE2 — امتحان قسم الكبار
const ce2 = getExamQuestionsByLevels(['L4', 'L5', 'L6', 'L7']);

// PT — تحديد المستوى
const pt = ALL_EXAM_QUESTIONS;

// X — اختبار مستوى L3
const x = getExamQuestionsByLevel('L3');
```

15.9 الحالة الحالية (نهاية جلسة 23)

المستوى العدد الحالة
L0 42 ✅
L1 227 ✅
L2 80 ✅
L3 80 ✅
L4 ~80 ⏳ التالي
L5 ~40 ⏳
L6 ~25 ⏳
L7 ~25 ⏳
المجموع ~554 جارٍ

15.10 قواعد ذهبية نهائية

1. كل رسالة لـGemini = كاملة بذاتها.
2. كل ملف من Gemini = يُفحص قبل الحفظ.
3. كل خطأ = يُعاد بقالب تصحيح.
4. كل ملف = يُحفظ منفصلًا.
5. الدمج في النهاية.
6. الرفع لـGitHub = آمن دائمًا.
7. إذا شككت · اقرأ قواعد التحقق (القسم 15.4).

---

آخر مراجعة: @mezo2021 — 2026-10-06
هذه الوثيقة تراكمية — كل إضافة تُحفظ، كل حذف يحتاج دليلًا مصورًا.

مصادر التحقق:

· GPT (50 سؤالًا — 2026-10-04)
· Claude (50 سؤالًا — 2026-10-04)
· فحص يدوي (34 دليلًا مصورًا)
· جلسة 23 — بنك SRB exam L0-L3 (430 سؤالًا)

```

---