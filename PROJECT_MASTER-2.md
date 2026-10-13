📋 PROJECT_MASTER-2.md — الإصدار الجديد (v10.0)



<div dir="rtl">

🔵 الجزء الرابع — نتائج الفحص الشامل (v8 + v9)

34. نتائج الفحص — ملخص v8 + v9

34.1 بطاقة الفحص

البند القيمة
الأداة GitHub Actions · Node 20 · Bash
تاريخ v8 2026-10-13
تاريخ v9 2026-10-13
Commit 6416aa4a0562e24f15ec1c62649557c115995045
المستودع mezo2021/sorobanmind-2
الوضع Read-only · لا يعدّل src/

34.2 المؤشرات التسعة (v8)

# المؤشر القيمة
1 Source files scanned 168
2 Imports found 618
3 Call expressions found 7,439
4 Static storage-key operations 49
5 Storage operations total 129
6 Store/persistence candidates 8
7 Key/property references 3,388
8 Gaps requiring review 80
9 Errors/diagnostics 0

34.3 القيود الأربعة المُعلنة رسميًا

1. Static analysis does not prove runtime reachability.
2. Dynamic imports and computed keys may not be fully resolved.
3. Call names are syntactic names, not guaranteed symbol resolution.
4. Detected stores are candidates requiring manual confirmation.

القاعدة: كل حكم في v8 مشروط بهذه القيود الأربعة.

34.4 تقرير البناء

المؤشر القيمة
Build exit code 0 ✅
تحويل TypeScript ✅ ناجح
الأمر tsc ثم vite build
الوحدات المحوّلة 2,018 وحدة
حجم الحزمة 1.70 MB (367.76 KB gzip) ⚠️
فحص TypeScript المستقل ❌ غير مُهيّأ

34.5 الملفات المُنتَجة

الملف الحجم بعد Gzip
index.html 1.03 KB 0.54 KB
index-C0vvwiGo.css 96.57 KB 15.00 KB
index-BHs5Bta_.js 1,696.03 KB 367.76 KB

34.6 تسعة مجالات غير مختبرة

1. ❌ الفحص المستقل لـ TypeScript.
2. ❌ الاختبارات الوظيفية.
3. ❌ صحة المحتوى التعليمي والأسئلة.
4. ❌ نظام التكيف وتتبع الإتقان.
5. ❌ حفظ التقدم بعد إعادة التحميل.
6. ❌ الامتحانات ودرجات النجاح.
7. ❌ الواجهة على الهواتف والأجهزة.
8. ❌ الأداء الفعلي أثناء الاستخدام.
9. ❌ النشر على GitHub Pages.

---

35. نتائج الفحص — البنوك والمحركات

35.1 خريطة البنوك (v9 — خريطة استيراد مؤكدة)

```text
bank-raw/ (~600 سؤال — 7 ملفات)
        ↓
bank-v2/ (583 سؤال — 4 parts + امتحانات)
        ↓
bank-linked.ts ← يجمع v2 + raw
        ↓
engine/adaptiveEngine.ts + engine/problemGenerator.ts
        ↓
❌ لا أحد يستوردهم
        ↓
حلقة معزولة تمامًا
```

35.2 المستوردون الفعليون

البنك المستورد
bank-v2 bank-linked.ts:60 فقط
bank-raw bank-v2/bank-exam.ts · bank-adapter.ts:65
bank-linked engine/adaptiveEngine.ts:62 · engine/problemGenerator.ts:59
bank-adapter bank-linked.ts:63
srb-adapter 5 شاشات + App.tsx:53

35.3 المحرك — الحالة القاطعة

الملف مستورد من
adaptiveEngine.ts ❌ لا أحد خارجيًا
masteryTracker.ts فقط adaptiveEngine.ts
problemGenerator.ts ❌ لا أحد
sorobanEngine.ts فقط SorobanEngineDebug.tsx
sorobanMoves.ts sorobanEngine.ts + SorobanEngineDebug.tsx

35.4 البنوك القادمة — Bank A · Bank B

البند Bank A Bank B
المسار srb/questions/ srb/exam/
الحجم 275 سؤالًا 666 سؤالًا
variant A B
primary_phase P CE
allowed_phases E · T · P · ANZ-V · ANZ-F · ANZ-A · X CE · PT · X
anzan_time_ms 0 0
solution شرح تربوي غني معادلة مباشرة
الحالة ✅ يعمل ✅ مربوط

توزيع Bank B:

L0 L1 L2 L3 L4 L5 L6 L7 المجموع
42 227 80 80 80 80 50 27 666

---

36. نتائج الفحص — المتاجر الأربعة

36.1 المتاجر المؤكدة (v9)

# المتجر المفتاح نسخة المستهلكون الحالة
1 useTranslation sorobanmind-v2-lang - LessonScreen · Header · SorobanEngineDebug ✅ حيّ
2 masteryBadgesStore soroban_mastery_badges 1 6 ملفات ✅ نشط
3 numberStyleStore soroban_number_style - 15 ملفًا ✅ نشط
4 progressStore sorobanmind-v2-progress 5 24 ملفًا ✅ نشط · محمي

36.2 🚨 اكتشاف حاسم — useTranslation حَيّ

v5 قال: ميت (يُستورد فقط من SorobanEngineDebug).
v9 يثبت:

```
src/screens/LessonScreen.tsx:38    → import { useT } from '@/i18n/useTranslation';
src/screens/Header.tsx:12          → import { useT, useLangStore } from "@/i18n/useTranslation";
```

النتيجة: نظام الترجمة نشط فعلًا · الجاهزية أعلى من 65%.

36.3 خريطة المستوردين

progressStore — 24 مستوردًا:

· الشاشات (14): LearnScreen · LevelScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · AnzanScreen · GuardianDashboard · HeroDashboard · CategoryScreen · KidsCertificateScreen · PracticeScreen · App (مرتين).
· المكونات (5): FriendsGame · GamesListScreen · DetectiveGame · FlyingAbacusGame · PirateRaceGame · SorobaniaGame · AdaptiveFeedback.
· Hooks + Data (3): curriculum.ts · useGameStats.ts.

masteryBadgesStore — 6 مستوردين:

· AdaptiveFeedback · AudioAnzanScreen · AnzanScreen · GuardianDashboard · PracticeScreen · useGameStats.

numberStyleStore — 15 مستوردًا:

· NumberStyleToggle · Soroban2D5 · AdaptiveFeedback · LearnScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · PlacementTestScreen · FingerMathScreen · AnzanScreen · SorobanPlayground · CategoryExamScreen · Header · PracticeScreen.

useTranslation — 3 مستوردين:

· SorobanEngineDebug · LessonScreen · Header.

---

37. نتائج الفحص — المفاتيح والتخزين

37.1 التوزيع الإجمالي

النوع العدد
مفاتيح ثابتة 49
مفاتيح ديناميكية 80
الإجمالي 129

37.2 تصنيف المفاتيح النهائي

✅ نشطة كاملة (قارئ + كاتب) — 20 مفتاحًا

# المفتاح
1 soroban_completed_levels
2 soroban_completed_lessons
3 soroban_passed_practice
4 soroban_placement_weak_skills
5 soroban_placement_recommended
6 soroban_child_full_name
7 soroban_companion
8 soroban_number_style
9 soroban_high_scores_v1 🆕
10 soroban_high_scores_month 🆕
11 soroban_anzan_stats
12 soroban_practice_stats
13 soroban_dev_preview
14 soroban_weak_skills_v2
15 sorobanmind-stats
16 srb_progress
17 sorobanmind-v2-lang
18 soroban_mastery_badges
19 soroban_anzan_badges
20 soroban_anzan_audio_badges

🟡 ديناميكية — 80 مفتاحًا

النمط المكتشف في CategoryExamScreen.tsx:

```ts
// كتابة (السطور 231-233)
localStorage.setItem(`${cfg.storageKey}_passed`, ...);
localStorage.setItem(`${cfg.storageKey}_score`, ...);
localStorage.setItem(`${cfg.storageKey}_last_attempt`, ...);

// قراءة (السطر 149)
localStorage.getItem(`${cfg.storageKey}_last_attempt`);
```

النتيجة: 6 مفاتيح محلولة · 74 مفاتيح تحتاج بحثًا.

🔴 يتيمة — 6 مفاتيح

# المفتاح النوع
1 soroban_passed_level_tests يُقرأ · لا كاتب
2 soroban_exam_result يُقرأ · لا كاتب
3 soroban_kids_certificate_ready يُكتب · لا قارئ
4 soroban_section2_unlocked يُكتب مرتين بصيغتين مختلفتين
5 soroban_placement_result ميت تمامًا
6 soroban_placement_last_attempt ميت تمامًا

37.3 🚨 تحذير — soroban_number_style له 3 مصادر

# الملف قراءة كتابة
1 store/numberStyleStore.ts ✅ ✅
2 utils/numberStyle.ts:73,81 ✅ ✅
3 utils/numerals.ts:117,125 ✅ ✅

ملاحظة: numerals.ts يبدأ بـ// src/utils/numberStyle.ts → نسخة مكررة.

---

38. نتائج الفحص — الاستيرادات والخريطة

38.1 خريطة الملفات

المنهج:

· curriculum/types.ts ← 12 مستوردًا (مجمّد).
· curriculum/lessons/types.ts ← 5 مستوردين.
· curriculum/lessons/index.ts ← 4 شاشات.

بنك SRB (مستقل ✅):

· data/srb/ ← 10 ملفات + 16 ملف أسئلة.
· data/srb-adapter.ts ← 5 شاشات.

البنوك القديمة (معزولة):

· data/bank-v2/ ← عبر bank-linked فقط.
· data/bank-raw/ ← عبر bank-v2/bank-exam + bank-adapter.
· data/bank-linked.ts ← engine/adaptiveEngine + engine/problemGenerator.

المحرك (5 ملفات — معزولة):

· استخدام داخلي بين الملفات نفسها.

المتاجر (4):

· progressStore.ts ← 24 مستوردًا.
· masteryBadgesStore.ts ← 6 مستوردين.
· numberStyleStore.ts ← 15 ملفًا.
· useTranslation.ts ← 3 مستوردين.

38.2 المسارات النشطة

القسم المستورد الرئيسي
HeroDashboard FlashListScreen · GamesListScreen · PlacementTestScreen
GuardianDashboard previewMode · النسخ الاحتياطي
الشاشات progressStore · masteryBadgesStore · numberStyleStore
الترجمة LessonScreen · Header

---

39. نتائج الفحص — المشاكل المؤكدة

39.1 حرجة

# المشكلة الملف الأثر
1 recordAttempt مفقود CategoryExamScreen · PlacementTestScreen skillProgress ناقص
2 srb-adapter 3 دوال معطوبة srb-adapter.ts تحتاج إصلاحًا
3 دروس L2-L7 مفقودة curriculum/lessons/ محتوى
4 adaptiveEngine على bank-linked engine/adaptiveEngine.ts ترحيل
5 لا lockfile الجذر 🆕 بناء غير حتمي
6 لا typecheck script package.json 🆕 لا فحص مستقل

39.2 متوسطة

# المشكلة الملف الأثر
7 numberStyle له 3 مصادر 3 ملفات تعارض محتمل
8 soroban_section2_unlocked صيغتان App · CategoryExamScreen تعارض
9 6 مفاتيح يتيمة متنوعة تنظيف
10 فجوة UI (3 شارات) GuardianDashboard مؤجل

39.3 بسيطة

# المشكلة
11 LevelTestScreen يستخدم buildL0Test
12 badgeChecker · useQuests — مفاتيح ميتة
13 SRBModule محدود بـm1-m10
14 LessonScreen لا يقرأ اللغة
15 soroban_placement_last_attempt غير موجود إطلاقًا

39.4 ✅ مُصلَح

· ~~getAnzanBadgeKey خطأ~~ (ملغى · الكود صحيح).
· ~~recordAttempt لا يُستدعى~~ (3 شاشات مُفعَّلة).
· ~~bank-v2 يُستورد من الشاشات~~ (مربوط بـsrb/exam).
· ~~useTranslation ميت~~ (v9 أثبت أنه حيّ).

---

40. نتائج الفحص — أهداف الإصلاح

40.1 الأهداف العشر من v8

# الهدف الأولوية
1 حل مفاتيح التخزين الديناميكية P0
2 رسم اعتماد عكسي للملفات P0
3 توثيق مسارات البنوك P0
4 استخراج واجهات المتاجر P1
5 فصل AST عن العيوب المؤكدة P1
6 فحص بـTypeScript Checker P1
7 تفكيك الملفات الكبيرة P2
8 الاحتفاظ بالبنوك حتى إثبات العزلة P2
9 حفظ نتائج البناء منفصلة P2
10 إصدار تقرير مصنّف P2

40.2 الأهداف الأربع من تقرير البناء

# الهدف
1 استكمال الفحص المستقل (typecheck script)
2 تحليل حجم الحزمة (1.70 MB)
3 الاختبارات الوظيفية
4 التحقق من النشر

---

🔵 الجزء الخامس — خطة الإصلاح الجديدة

41. خطة الإصلاح الجديدة — قيد الكتابة

📝 ملاحظة: هذا القسم قيد الكتابة. سيُملأ لاحقًا.

41.1 الفكرة العامة (placeholder)

الخطة الجديدة ترتكز على:

1. نتائج v8 + v9 — التشخيص الفعلي.
2. الأقسام الجديدة — الفلاشات + الألعاب لا تُلمس.
3. المبدأ: لا حذف إلا بعد إثبات العزلة.
4. الأولوية: البنية قبل الميزات.

41.2 المراحل المقترحة (مبدئيًا)

```text
[قيد الكتابة]
```

41.3 القرارات المعلقة

```text
[قيد الكتابة]
```

41.4 الأدوات المقترحة

```text
[قيد الكتابة]
```

41.5 معايير النجاح

```text
[قيد الكتابة]
```

---

➡️ نهاية الجزء الخامس

---

📎 الملاحق

ملحق أ — القواعد الذهبية

أ.1 القواعد الأصلية (1-7)

1. لا حذف إلا ما أُلغي صريحًا.
2. المحرك الرياضي مجمّد (sorobanEngine.ts + sorobanMoves.ts).
3. bank-v2/ + bank-raw/ لا يُحذفان قبل فك ارتباط CE1 · CE2 · PT.
4. curriculum/types.ts مجمَّد — عقد أساسي.
5. SRB هو البنك الوحيد لكل الأسئلة الجديدة.
6. ملف واحد في المرة — ثم اختبار.
7. نسخة احتياطية قبل أي تعديل.

أ.2 القواعد المعتمدة (8-10)

8. رأس موحّد لكل ملف معدّل — يوثّق التعديل · الوظيفة · الجلسة · الحالة.
9. قيد ACHIEVEMENTS.md في نهاية الجلسة فقط.
10. تحديث PROJECT_MASTER.md عند التعديلات البنيوية.

أ.3 قواعد الفلاشات (11-15)

11. ttsRef — مرجع ثابت للـuseSpeech.
12. onEnd — لا انتقال بدون انتهاء الصوت.
13. user gesture — أول تشغيل TTS يحتاج زر "ابدأ".
14. default undefined — كل prop جديدة اختيارية.
15. تشكيل موجَّه — الكلمات المُشكِلة فقط (TTS).

أ.4 قواعد الألعاب (16-20)

16. TICKET_XP_CAP = 50 · TICKETS_MAX = 5.
17. البطل يصمت أثناء التفكير.
18. الرقم القياسي شهري — يُصفَّر تلقائيًا.
19. جلسات 45-90 ثانية — لا إدمان.
20. لا تفريع حسب العمر في اللعبة.

أ.5 القواعد الحرجة (21-26)

21. ❌ حذف سطر من audit-v8/audit-v9 بدون دليل مصور.
22. ❌ إصلاحات بنيوية دون قراءة قسم "مقصود".
23. ❌ إضافة ملف جديد قبل البحث في data/index.ts · hooks/ · components/.
24. ❌ اعتبار "يُستورد" = "يعمل" — يجب أن تُستدعى الدالة فعلًا.
25. ❌ إضافة نظام شارات جديد.
26. ❌ الانتقال إلى IndexedDB أو Backend (مؤجل).

---

ملحق ب — المصادر والمراجع

ب.1 مصادر المنهج

· Takashi Kojima — The Japanese Abacus: Its Use and Theory.
· Japan Soroban Association — المنهج الرسمي.

ب.2 مصادر التقريص (Pinch)

من الكتاب (Kojima, 1954, ص 29):

"Push LOWER beads UP (thumb) and an UPPER bead DOWN (finger) simultaneously. We call this move the pinch."

ب.3 مراجع المشروع

الملف الغرض
README.md نظرة عامة للمستخدمين
PROJECT_MASTER.md هذا الملف — المرجع التقني
FLASH_SECTION.md قسم الفلاشات (مُدمج)
GAMES_SECTION.md قسم الألعاب (مُدمج)
STATE_OF_THE_PROJECT.md مصدر حالة المشروع
REPAIR_PLAN.md خطة الإصلاح (قيد الكتابة)
ACHIEVEMENTS.md سجل الجلسات + التقييم
GEMINI_PLAYBOOK.md دليل بناء Bank B
audit-v8.md الفحص AST
audit-v9.md الفحص Bash
~~AL-ISLAH.md~~ 🗄️ مؤرشف
~~AL-ISLAH-V2.md~~ 🗄️ مؤرشف
~~PLAN_v3.md~~ 🗄️ مؤرشف

ب.4 الروابط

العنصر الرابط
الموقع https://mezo2021.github.io/sorobanmind-2
المستودع https://github.com/mezo2021/sorobanmind-2
Actions https://github.com/mezo2021/sorobanmind-2/actions

ب.5 المطوّر

مصطفى علي أكر (@mezo2021)

---

ملحق ج — سجل التعديلات

التاريخ الحدث
2026-10-07 PROJECT_MASTER.md الإصدار v5 — نهاية الجلسة 24
2026-10-13 (v8) فحص AST شامل — 168 ملف · 9 مؤشرات · 0 أخطاء
2026-10-13 (v9) فحص Bash — 10 أقسام · حل 9 غموض
2026-10-13 قسم الفلاشات التعليمية — مستقر
2026-10-13 مدينة الألعاب — 5 من 5 ألعاب مكتملة
2026-10-13 (v10) إعادة بناء PROJECT_MASTER.md — دمج كل المصادر

---

📌 ملاحظات أخيرة

قبل أي تعديل

1. نسخة احتياطية (Tag).
2. مراجعة هذا الملف كاملًا.
3. اسأل قبل التنفيذ — لا افتراضات.

4 أسئلة قبل أي تعديل

1. ما المصدر الحالي لهذه المعلومة؟
2. لماذا لا يكفي؟
3. ما الملف الذي سيصبح مصدر الحقيقة بعد التعديل؟
4. كيف سنثبت عدم وجود مصدر ثانٍ؟

إذا لم توجد إجابة موثقة → لا يُضاف الكود.

رأس الملف الموحّد (قالب)

```ts
// src/path/to/file.ts
//
// 📝 التعديل: [وصف مختصر]
// 🎯 الوظيفة: [لماذا هذا التعديل]
// 📅 الجلسة: [رقم]
// ✅ الحالة: البناء أخضر
```

مبدأ التعامل

· الكود الفعلي هو الحقيقة — لا الملفات النصية.
· هذا الملف = المرجع الرسمي.
· audit-v8 + audit-v9 = التشخيص الفعلي.
· اسأل قبل التنفيذ.
· الخطة أهم من البناء السريع.

---

<div align="center">

🧮 SorobanMind v2

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-10-13
الحالة: 🟢 البناء أخضر · Bank A و B مكتملان · الفلاشات والألعاب جاهزة

المرجع الأساسي: PROJECT_MASTER.md (هذا الملف)
التشخيص: audit-v8 + audit-v9
الخطة: REPAIR_PLAN.md (قيد الكتابة)

الأرشيف: AL-ISLAH.md · AL-ISLAH-V2.md · PLAN_v3.md — لا تُعتمد

</div>

</div>

---

✅ انتهى PROJECT_MASTER.md — الإصدار v10.0

ملخص ما تم إنجازه

الجزء المحتوى عدد الأقسام
الأول تعريف المشروع 1-7
الثاني الفلاشات التعليمية 8-22
الثالث مدينة الألعاب 23-33
الرابع نتائج v8 + v9 34-40
الخامس خطة الإصلاح (placeholder) 41
الملاحق القواعد · المصادر · السجل أ · ب · ج

---

ما تغيّر عن الإصدار السابق

البند v5 (قديم) v10 (جديد)
الحجم ~1,200 سطر ~2,400 سطر
v5/AL-ISLAH أساس 🗄️ مؤرشف
الفلاشات غير مذكورة ✅ قسم كامل
الألعاب غير مذكورة ✅ قسم كامل
v8+v9 غير مذكورة ✅ قسم كامل
useTranslation «ميت» ✅ حيّ
المتاجر 3 4
المفاتيح 35 129 عملية
الخطط القديمة P1-P16 ⏸️ قيد إعادة الكتابة

</div>

</div>