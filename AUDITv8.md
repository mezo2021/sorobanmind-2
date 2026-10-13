📋 SOROBANMIND — تقرير Audit v8 الشامل الموحّد

المصدر الوحيد للحقيقة: Audit v8 (7 ملفات كاملة)
تاريخ التوليد: 2026-10-13T02:58:48.382Z
الحالة: المرجع النهائي · v5 مهجور
التوزيع: 3 دفعات

---

🔵 الدفعة الأولى — الملخص التنفيذي · البيئة · البناء

---

0. بطاقة التقرير

الحقل القيمة
المستودع mezo2021/sorobanmind-2
الفرع refs/heads/main
Commit 6583578d64da0445e780048bab9856bd725fdb79
Workflow run 38339446584
تاريخ التوليد 2026-10-13T02:58:48.382Z
Node v20.20.2 (LTS)
npm 10.8.2
Lockfile present no 🚨
عدد الملفات المفحوصة 168
عدد ملفات v8 المكوّنة 7
أخطاء التحليل النحوي 0

---

1. المؤشرات التسعة الرسمية

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

---

2. القيود الأربعة المُعلنة رسميًا في v8

هذه القيود جزء من التقرير نفسه — ليست ملاحظاتنا.

# القيد المعنى العملي
1 Static analysis does not prove runtime reachability التحليل الثابت لا يثبت التنفيذ الفعلي
2 Dynamic imports and computed keys may not be fully resolved الاستيرادات الديناميكية والمفاتيح المحسوبة قد لا تُحلّ كليًا
3 Call names are syntactic names, not guaranteed symbol resolution أسماء الاستدعاءات نحوية · ليست ربطًا مؤكدًا بالرمز
4 Detected stores are candidates requiring manual confirmation المتاجر المكتشفة مرشحة · تحتاج تأكيدًا يدويًا

القاعدة المستخلصة:

كل حكم في v8 مشروط بهذه القيود الأربعة.

---

3. تقرير البناء (Build)

3.1 حالة البناء

المؤشر القيمة
Build exit code 0 ✅
تحويل TypeScript أثناء البناء ✅ ناجح
الأمر المنفذ tsc ثم vite build
الوحدات المحوّلة 2,018 وحدة
فحص TypeScript المستقل ❌ غير مُهيّأ
حجم الحزمة الرئيسية ⚠️ 1.70 MB (367.76 KB gzip)

3.2 الملفات الأربعة المُنتَجة

الملف المحتوى النتيجة
typecheck.log No typecheck script found. لا يوجد سكربت فحص مستقل
typecheck.exitcode not-configured الفحص غير مُهيّأ · ليس فشلًا
build.log سجل tsc + vite · 2018 وحدة · تحذير حجم البناء ناجح مع تحذير
build.exitcode 0 العملية انتهت بنجاح

3.3 ماذا تعني هذه النتائج؟

العبارة المعنى الحقيقي
exit code = 0 البناء انتهى دون خطأ يُسقط العملية
2018 modules transformed Vite عالج هذا العدد — لا يعني اختبارًا
No typecheck script found أداة الفحص المستقلة غير موجودة
نجاح البناء لا يساوي نجاح الاختبارات الوظيفية

---

4. تحليل أحجام ملفات الإنتاج

4.1 ملفات Vite

الملف الحجم بعد Gzip
index.html 1.03 KB 0.54 KB
index-C0vvwiGo.css 96.57 KB 15.00 KB
index-BHs5Bta_.js 1,696.03 KB 367.76 KB

4.2 الأصول البصرية الرئيسية

الأصل الحجم
joud2-Bb7Gp_jR.png 388.01 KB
logo-certificate-CE9MnfXr.webp 155.00 KB
bana-DDn2mRzI.png 50.28 KB
sham-CKax4Cgp.png 48.45 KB
sorobana-teaching-pointing-DOo-bNTT.webp 47.05 KB
sorobana-main-B96WcClt.webp 47.03 KB
rayan-BvOAlkN1.png 39.37 KB
logo-header-FshBKY5B.png 32.47 KB

ملاحظة: هذه الأحجام من سجل البناء — لا تتضمن الأصول المحمّلة لاحقًا من مصادر أخرى.

---

5. 🚨 المشكلة التقنية الأبرز — حزمة JavaScript كبيرة

البند القيمة
ملف JS الرئيسي index-BHs5Bta_.js
الحجم الخام 1.70 MB
بعد Gzip 367.76 KB
حد التحذير 500 KB (بعد التصغير)
الحالة ⚠️ تحذير

الاتجاهات الثلاثة المقترحة من Vite

# الحل الأثر
1 تقسيم التحميل بـimport() الديناميكي تحميل الشاشات عند الحاجة
2 تقسيم الحزم بـbuild.rollupOptions.output.manualChunks فصل المكتبات
3 تعديل build.chunkSizeWarningLimit ⚠️ يخفي التحذير فقط · لا يقلل الحجم

التوصية الرسمية: ابدأ بتحليل محتويات الحزمة · ثم قسّم الشاشات والميزات غير اللازمة عند الفتح.
لا تعدّل حد التحذير لمجرد إخفائه.

---

6. ما لم يُثبت بعد (9 مجالات غير مختبرة)

من ملفات v8 — لم يُثبت اختبارها:

1. ❌ الفحص المستقل المخصص لـ TypeScript
2. ❌ الاختبارات الوظيفية
3. ❌ صحة المحتوى التعليمي والأسئلة
4. ❌ نظام التكيف وتتبع الإتقان
5. ❌ حفظ التقدم بعد إعادة التحميل
6. ❌ الامتحانات ودرجات النجاح
7. ❌ الواجهة على الهواتف والأجهزة المختلفة
8. ❌ الأداء الفعلي أثناء استخدام الطفل
9. ❌ النشر على GitHub Pages

---

7. بنية v8 — الملفات السبعة

# الملف النوع ما يقدمه
1 التقرير الأصلي (نص) تحليل عام 168 ملف · 618 استيراد · 7439 استدعاء
2 Build & Typecheck تقرير بناء tsc + vite · 2018 وحدة · 1.70 MB
3 GAPS.md 80 فجوة كل الفجوات ديناميكية
4 KEYS_TABLE.md 49 مفتاح ثابت محلول
5 RUN_METADATA.md بيئة Node 20 · npm 10 · لا lockfile
6 STORES_TABLE.md 8 مرشحين 4 متاجر Zustand
7 SUMMARY.md غلاف 9 مؤشرات · 4 قيود

---

8. البيانات التقنية للبيئة

البند القيمة الحكم
Node v20.20.2 ✅ LTS محدّث
npm 10.8.2 ✅ حديث
Branch main ✅ رئيسي
Commit SHA كامل (40 حرفًا) ✅ موثق
Lockfile no 🔴 غائب

🚨 خطر غياب Lockfile

البُعد التأثير
حتمية البناء 🔴 كل بناء قد يثبّت إصدارات مختلفة
الأمان 🔴 عرضة لـsupply-chain attacks
قابلية التكرار 🔴 «يعمل عندي» لا يعني «يعمل عندك»
CI/CD 🟡 GitHub Actions بلا ضمان
التعاون 🔴 فريقان قد يبنيان بإصدارات مختلفة
الأرشفة 🔴 لا استرجاع دقيق لحالة البناء السابقة

---

— خريطة المفاتيح · الفجوات · المتاجر

---

9. عمليات التخزين — الصورة الكاملة

9.1 التوزيع الإجمالي

النوع العدد
مفاتيح ثابتة (Static) 49
مفاتيح ديناميكية (Dynamic) 80
الإجمالي 129 ✅

مطابقة صريحة: KEYS_TABLE (49) + GAPS (80) = SUMMARY (129)

---

10. المفاتيح الثابتة — 49 عملية

10.1 توزيعها حسب العملية

العملية العدد
read (getItem) 29
write (setItem) 19
removeItem 0
المجموع 49

10.2 المفاتيح الفريدة (20 مفتاحًا)

# المفتاح قراءة كتابة حذف
1 soroban_completed_levels ✅ ✅ ❌
2 soroban_completed_lessons ✅ ✅ ❌
3 soroban_passed_practice ✅ ✅ ❌
4 soroban_placement_weak_skills ✅ ✅ ❌
5 soroban_placement_recommended ✅ ✅ ❌
6 soroban_placement_result ❌ ✅ ❌
7 soroban_child_name ✅ ❌ ❌
8 soroban_child_full_name ✅ ✅ ❌
9 soroban_companion ✅ ✅ ❌
10 soroban_number_style ✅ ✅ ❌
11 soroban_section2_unlocked ❌ ✅ ❌
12 soroban_kids_certificate_ready ❌ ✅ ❌
13 soroban_passed_level_tests ✅ ❌ ❌
14 soroban_exam_result ✅ ❌ ❌
15 soroban_exam1_passed ✅ ❌ ❌
16 soroban_exam2_passed ✅ ❌ ❌
17 soroban_exam1_score ✅ ❌ ❌
18 soroban_exam2_score ✅ ❌ ❌
19 soroban_dev_preview ✅ ❌ ❌
20 soroban_companion (تكرار في HeroDashboard) ✅ ✅ ❌

10.3 التوزيع حسب الملف

الملف عدد العمليات
src/App.tsx 12
src/screens/HeroDashboard.tsx 8
src/screens/CertificateScreen.tsx 5
src/screens/CategoryScreen.tsx 5
src/utils/numberStyle.ts + numerals.ts 4
src/screens/CategoryExamScreen.tsx 3
src/screens/KidsCertificateScreen.tsx 3
src/components/games/FlyingAbacus/FlyingAbacusGame.tsx 2
12 ملفًا آخر 1 لكل منها

10.4 التفاصيل الكاملة بـ(الموقع · العملية · المفتاح)

src/App.tsx

السطر العملية المفتاح
219 write soroban_completed_levels
224 write soroban_placement_weak_skills
229 write soroban_placement_recommended
234 write soroban_placement_result
347 read soroban_completed_lessons
351 write soroban_completed_lessons
390 read soroban_completed_lessons
394 write soroban_completed_lessons
502 read soroban_child_name
537 write soroban_section2_unlocked
620 read soroban_passed_practice
624 write soroban_passed_practice

src/components/FloatingCompanion.tsx

السطر العملية المفتاح
42 read soroban_companion

src/components/games/Detective/DetectiveGame.tsx

السطر العملية المفتاح
127 read soroban_child_name

src/components/games/FlyingAbacus/FlyingAbacusGame.tsx

السطر العملية المفتاح
160 read soroban_child_name
192 read soroban_companion

src/components/games/Friends/FriendsGame.tsx

السطر العملية المفتاح
135 read soroban_child_name

src/components/games/Pirates/PirateRaceGame.tsx

السطر العملية المفتاح
94 read soroban_child_name

src/components/games/Sorobania/SorobaniaGame.tsx

السطر العملية المفتاح
158 read soroban_child_name

src/screens/CategoryExamScreen.tsx

السطر العملية المفتاح
239 read soroban_completed_levels
245 write soroban_section2_unlocked
246 write soroban_kids_certificate_ready

src/screens/CategoryScreen.tsx

السطر العملية المفتاح
179 read soroban_passed_level_tests
188 read soroban_placement_weak_skills
189 read soroban_placement_recommended
190 read soroban_exam1_passed
191 read soroban_exam2_passed

src/screens/CertificateScreen.tsx

السطر العملية المفتاح
47 read soroban_child_full_name
54 read soroban_exam1_score
59 read soroban_exam2_score
63 read soroban_child_full_name
75 write soroban_child_full_name

src/screens/HeroDashboard.tsx

السطر العملية المفتاح
126 read soroban_placement_recommended
135 read soroban_exam2_passed
146 read soroban_companion
151 write soroban_companion
154 write soroban_companion
159 read soroban_child_name
163 read soroban_exam_result
173 write soroban_companion

src/screens/KidsCertificateScreen.tsx

السطر العملية المفتاح
69 read soroban_child_full_name
80 read soroban_child_full_name
92 write soroban_child_full_name

src/screens/LearnScreen.tsx

السطر العملية المفتاح
81 read soroban_dev_preview

src/screens/LevelScreen.tsx

السطر العملية المفتاح
139 read soroban_passed_level_tests

src/utils/numberStyle.ts

السطر العملية المفتاح
73 read soroban_number_style
81 write soroban_number_style

src/utils/numerals.ts

السطر العملية المفتاح
117 read soroban_number_style
125 write soroban_number_style

10.5 المفاتيح «اليتيمة» حسب v8

المفتاح الحالة الفعلية في v8
soroban_passed_level_tests يُقرأ فقط (CategoryScreen:179 · LevelScreen:139)
soroban_exam_result يُقرأ فقط (HeroDashboard:163)
soroban_kids_certificate_ready يُكتب فقط (CategoryExamScreen:246)
soroban_section2_unlocked يُكتب فقط · لا قراءة ثابتة
soroban_placement_result يُكتب فقط (App.tsx:234) — قراءته ديناميكية

عدد اليتيمة الفعلي: 5 مفاتيح

---

11. المفاتيح الديناميكية — الفجوات الـ80

11.1 التصنيف

النوع العدد
dynamic-storage-key 80
parse errors 0
script errors 0
الإجمالي 80

النتيجة الحاسمة: كل الفجوات الـ80 من نوع واحد = مفتاح تخزين ديناميكي.

11.2 التوزيع حسب الملف (25 ملفًا)

# الملف عدد الفجوات
1 src/components/games/highScoreStore.ts 8
2 src/screens/LessonScreen.tsx 8
3 src/components/games/Sorobania/SorobaniaGame.tsx 6
4 src/components/games/Friends/FriendsGame.tsx 6
5 src/data/srb/progress.ts 4
6 src/screens/CategoryExamScreen.tsx 4
7 src/screens/LevelTestScreen.tsx 4
8 src/components/CharacterSelector.tsx 4
9 src/data/bank-v2/index.ts 3
10 src/utils/previewMode.ts 3
11 src/utils/skillsChecker.ts 3
12 src/screens/RoleSelection.tsx 3
13 src/screens/GuardianDashboard.tsx 3
14 src/utils/badgeChecker.ts 3
15 src/App.tsx 2
16 src/data/bank-v2/placement-engine.ts 2
17 src/data/srb/exam/index.ts 2
18 src/hooks/useQuests.ts 2
19 src/screens/FingerMathScreen.tsx 2
20 src/screens/MagicSecretsScreen.tsx 2
21 src/utils/anzanBadges.ts 2
22 src/utils/audioAnzanBadges.ts 2
23 src/components/games/Pirates/PirateRaceGame.tsx 2
24 src/screens/CategoryExamScreen.tsx (تكرار) —
25 (ملفات متفرقة) —
المجموع  80

11.3 أنواع العمليات الديناميكية

العملية التكرار
getItem الأكثر
setItem كثير
removeItem قليل

11.4 السبب الجذري

· المفاتيح تُبنى من متغيرات.
· أو template literals مثل  `soroban_lesson_${id}` .
· أو تعبيرات محسوبة في وقت التشغيل.
· → فيعجز AST عن حلّها.

11.5 خطوات المتابعة اليدوية (من v8)

1. تتبع المفاتيح الديناميكية والتعبيرات المحسوبة.
2. تأكيد المتاجر التي تستوردها الشاشات النشطة.
3. متابعة الاستيرادات لتمييز القديم عن النشط.
4. الإقرار بأن التحليل الثابت لا يثبت القراءة/الكتابة الفعلية.

---

12. المتاجر — 8 مرشحين

12.1 المتاجر الأربعة المؤكدة

# المتجر الملف مفتاح persist الحالة
1 useTranslation src/i18n/useTranslation.ts:16-17 sorobanmind-v2-lang (صريح) 🟡 متنازع
2 masteryBadgesStore src/store/masteryBadgesStore.ts:60-61 متغير (محتاج بحث) ✅ يعمل
3 numberStyleStore src/store/numberStyleStore.ts:16-17 NUMBER_STYLE_KEY (متغير) ✅ يعمل
4 progressStore src/store/progressStore.ts:247-248 متغير (محتاج بحث) ✅ يعمل · محمي

12.2 تفاصيل كل متجر

(1) useTranslation

```ts
create<LangState>()(
  persist(
    (set) => ({
      lang: "ar",
      setLang: (lang) => set({ lang }),
    }),
    { name: "sorobanmind-v2-lang" },
  ),
)
```

· الحالة: LangState
· الافتراضي: "ar"
· الإجراءات: setLang
· المفتاح: صريح sorobanmind-v2-lang

(2) masteryBadgesStore

```ts
create<MasteryBadgesState>()(
  persist(
    (set, get) => ({
      badges: {},
      awardBadge: (skillId, timeMs, answerMs) => {
        const cls = classifySpeed(timeMs, answerMs);
        if (cls !== "mastery") return false;
        const existing = get().badges[skillId];
        if (existing) {
          if (timeMs < existing.bestTimeMs) { ... }
```

· الحالة: MasteryBadgesState
· البنية: badges: {} (خريطة)
· الإجراء الرئيسي: awardBadge
· منطق القرار: classifySpeed(timeMs, answerMs) = "mastery"
· حماية: يمنع التكرار · يحفظ bestTimeMs

(3) numberStyleStore

```ts
create<NumberStyleState>()(
  persist(
    (set) => ({
      style: DEFAULT_NUMBER_STYLE,
      setStyle: (style) => set({ style }),
      toggleStyle: () => set((state) => ({
        style: state.style === "arabic" ? "latin" : "arabic",
      })),
    }),
    { name: NUMBER_STYLE_KEY },
  ),
)
```

· الحالة: NumberStyleState
· الافتراضي: DEFAULT_NUMBER_STYLE
· الإجراءات: setStyle · toggleStyle
· منطق التبديل: arabic ↔ latin

(4) progressStore

```ts
create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setChildName: (name) => set({ childName: name.trim() }),
      setCategory: (category) => set({ category, categoryChosenAt: ... }),
      markLevelComplete: (levelId) => set((state) => { ... }),
      ...
```

· الحالة: ProgressState
· البنية: ...initialState + 26 action
· الإجراءات: setChildName · setCategory · markLevelComplete · …

12.3 المفاتيح المُدارة عبر persist

المتجر المفتاح مصدر الاسم
useTranslation sorobanmind-v2-lang صريح
masteryBadgesStore مرجّح: soroban_mastery_badges متغير
numberStyleStore NUMBER_STYLE_KEY → soroban_number_style متغير
progressStore مرجّح: sorobanmind-v2-progress متغير

12.4 ملاحظة v8 الرسمية

Candidates only; verify imports and runtime usage before classifying a store as active.

---

13. تداخل الملفات مع مفتاح soroban_number_style

3 ملفات تتعامل مع نفس المفتاح:

# الملف العملية
1 src/store/numberStyleStore.ts persist كامل
2 src/utils/numberStyle.ts:73,81 read + write مباشر
3 src/utils/numerals.ts:117,125 read + write مباشر

تحذير v8: تجنّب وجود مصدرين مستقلين للحقيقة إن كان متجر Zustand والملفات تدير المفتاح نفسه.

---
 — البنوك · الكود الميت · التوصيات · الخلاصة

---

14. أكبر 20 ملفًا حسب عدد الأسطر

ملاحظة v8: الترتيب في المصدر السابق لم يكن تنازليًا بالكامل · لا تعتمد عليه كترتيب نهائي.

# الملف الأسطر الحجم (bytes) الملاحظة
1 src/data/srb/exam/L1.ts 4,348 104,631 أكبر ملف · بنك امتحان كثيف
2 src/components/games/Sorobania/SorobaniaGame.tsx 2,398 94,579 لعبة ضخمة · مرشحة للتقسيم
3 src/data/srb/exam/L2.ts 1,555 63,348 بنك امتحان كبير
4 src/data/srb/exam/L3.ts 1,553 69,354 بنك امتحان كبير
5 src/data/srb/exam/L4.ts 1,553 70,766 بنك امتحان كبير
6 src/screens/LessonScreen.tsx 1,382 58,982 شاشة متعددة المسؤوليات
7 src/screens/GuardianDashboard.tsx 1,373 57,898 لوحة ولي الأمر
8 src/data/bank.ts 1,201 25,834 بنك قديم/مركزي
9 src/engine/adaptiveEngine.ts 1,072 21,928 محرك تكيفي · الحجم لا يثبت الاستخدام
10 src/screens/AnzanScreen.tsx 1,032 41,499 شاشة الأنزان المرئي
11 src/components/games/Pirates/PirateRaceGame.tsx 1,012 45,822 لعبة كبيرة
12 src/components/games/Friends/FriendsGame.tsx 906 41,485 لعبة كبيرة
13 src/screens/AudioAnzanScreen.tsx 900 35,898 شاشة الأنزان السمعي
14 src/components/games/FlyingAbacus/FlyingAbacusGame.tsx 863 34,735 لعبة كبيرة
15 src/curriculum/lessons/L2/S06.ts 864 86,374 محتوى تعليمي كبير
16 src/screens/CategoryExamScreen.tsx 851 33,963 امتحانات الفئات
17 src/data/srb/questions/L2.ts 840 46,387 بنك أسئلة التدريب
18 src/curriculum/lessons/L3/S07.ts 815 71,070 درس كبير
19 src/data/srb/exam/L6.ts 779 36,996 بنك امتحان
20 src/data/srb/exam/L5.ts 1,233 68,777 بنك امتحان كبير

ملاحظة: L5.ts (1,233 سطرًا) يجب أن يكون في المرتبة 7-8 · لكن المصدر أعطى ترتيبًا مختلفًا.

---

15. ملفات بلا مستوردين

🚨 نتيجة v8 الصريحة

غير موجود في التقرير قسم يقدم قائمة موثوقة بالملفات التي لا يستوردها أي ملف آخر.

ما يثبته v8

· قسم Imports يسجل الاستيرادات · لكنه لا ينتج تقريرًا عكسيًا شاملاً.
· عدم ظهور مستورد لا يبرر الحذف مباشرة.

الملفات المرشحة للتحقيق فقط (لا للحذف)

الملف سبب الاشتباه
src/engine/adaptiveEngine.ts ملف كبير · لم يُثبت مسار استدعائه
src/engine/problemGenerator.ts محرك توليد أسئلة · لم يُثبت تشغيله
src/engine/masteryTracker.ts منطق تتبع إتقان مستقل
ملفات البنوك الانتقالية لم يُثبت مستهلكوها
ملفات الدروس الفردية لم يُثبت استدعاؤها

الإجراء الصحيح (حسب v8)

1. بناء رسم اعتماد عكسي يحل مسارات TypeScript.
2. فحص نقاط الدخول.
3. فحص الاستيراد الديناميكي.
4. فحص الاختبارات.

---

16. الاستيرادات الدائرية

🚨 نتيجة v8 الصريحة

غير موجود قسم مستقل يثبت دورات A → B → A.

ما يثبته v8

· وجود استيرادات متبادلة في Imports لا يكفي.
· يلزم بناء رسم اعتماد وحساب الدورات.
· حل المسارات النسبية والاختصارات مثل @/.

لا يمكن تسمية دورة مؤكدة من التقرير الحالي دون اختلاق نتيجة لم ينشرها التقرير.

---

17. خريطة البنوك

المكوّن ما يثبته v8 المستوردون الظاهرون التقييم
bank-v2 bank-linked.ts يستورد ./bank-v2 src/data/bank-linked.ts · ملفات البنك الداخلية مسار قديم أو انتقالي · يحتاج تحديد مستهلكين
bank-raw bank-adapter.ts يستورده · bank-v2/bank-exam.ts يستورد raw-01 إلى raw-07 src/data/bank-adapter.ts · src/data/bank-v2/ مصدر بيانات تعتمد عليه طبقات قديمة
srb ملفات الأسئلة والامتحانات والتقدم والجلسات src/data/srb-adapter.ts · شاشات التدريب والأنزان المسار الأساسي الظاهر للشاشات الحديثة
srb-adapter App.tsx يستورد أنواعًا منه · الشاشات تستورد وظائفه PracticeScreen · AnzanScreen · AudioAnzanScreen · LevelTestScreen · RemediationScreen واجهة الربط بين الشاشات وبيانات SRB

النتيجة الرسمية

توجد طبقات بنوك متوازية.
هذا يستحق توثيقًا دقيقًا · لكنه لا يثبت أن bank-v2 أو bank-raw مهجوران.
لا تحذفهما قبل تتبّع الاستيرادات والاستدعاءات الفعلية.

---

18. المفاتيح الحرجة — تصنيف v8

18.1 مفاتيح ظاهرة تُقرأ وتُكتب

المفتاح مواقع ظاهرة الملاحظة
soroban_completed_lessons App.tsx قراءة وكتابة
soroban_completed_levels App.tsx · CategoryExamScreen.tsx مشترك · راجع توافق الصيغة
soroban_placement_weak_skills App.tsx · CategoryScreen.tsx نتيجة تحديد مستوى
soroban_placement_recommended App.tsx · CategoryScreen.tsx · HeroDashboard.tsx متعدد المستهلكين
soroban_child_name App.tsx · ألعاب · HeroDashboard يُقرأ من عدة أماكن
soroban_child_full_name CertificateScreen.tsx · KidsCertificateScreen.tsx اسم كامل للشهادات
soroban_companion FloatingCompanion.tsx · HeroDashboard.tsx تفضيل الرفيق
soroban_number_style numberStyle.ts · numerals.ts مصدران محتملان للحقيقة

18.2 تحذيرات v8 على المفاتيح المشتركة

وجود المفتاح في أكثر من ملف ليس خطأ تلقائيًا.
التعارض الفعلي يحصل عندما تختلف:

· صيغة البيانات
· قواعد التحديث
· توقيت الكتابة
· تفسير القيمة

المفاتيح التي تحتاج فحصًا:

· soroban_completed_levels — تحقق من صيغة «مكتمل» نفسها.
· soroban_placement_recommended + soroban_placement_weak_skills — اتفاق الكاتب والقارئ على معرفات المهارات.
· soroban_number_style — تجنّب مصدرين مستقلين للحقيقة.
· soroban_child_name + soroban_child_full_name — الفرق المقصود بينهما.

18.3 المفاتيح اليتيمة — تحفظ v8

غير موجود في التقرير تصنيف آلي نهائي.
بعض عمليات التخزين تظهر باسم <dynamic-or-missing>.
لا يمكن استخراج قائمة دقيقة بالمفاتيح اليتيمة.

اليتيمة المرشحة من KEYS_TABLE (بمراجعتنا):

· soroban_passed_level_tests (قراءة فقط)
· soroban_exam_result (قراءة فقط)
· soroban_kids_certificate_ready (كتابة فقط)
· soroban_section2_unlocked (كتابة فقط)
· soroban_placement_result (كتابة فقط)

---

19. تحليل الفجوات الـ80

19.1 الأسئلة السبعة

السؤال النتيجة
هل عدد الفجوات مذكور؟ ✅ نعم: 80
هل تفاصيل كل فجوة معروضة؟ ✅ نعم — في GAPS.md
هل نعرف إن كانت مكررة؟ ❌ لا · لا سجلات فردية
هل هي مشكلات فعلية؟ 🟡 لا يمكن الجزم
هل بعضها قيود AST؟ ✅ نعم · خصوصًا الديناميكية
هل العدد النهائي 80؟ ✅ مطابق في كل الملفات
هل كلها من نوع واحد؟ ✅ نعم: dynamic-storage-key

19.2 الأنماط الخمسة التي تستحق الفحص

1. مفاتيح تخزين مبنية من متغيرات أو قوالب نصية.
2. أسماء دوال متشابهة لا تشير بالضرورة إلى الرمز نفسه.
3. ملفات تُستورد لكن لا يمكن إثبات تنفيذها في مسار التطبيق.
4. استخدام persist أو إعدادات Zustand لا يكفي وحده لتحديد كل بيانات التخزين.
5. استدعاءات داخلية للدوال قد تُحسب كمراجع حتى لو لم تكن استدعاءات من وحدات أخرى.

19.3 الحكم الرسمي

لا تُعامل الرقم 80 بوصفه 80 عيبًا برمجيًا.
التقرير لا يعرض أدلة كافية لتصنيفها إلى أخطاء مؤكدة أو قيود تحليل أو نتائج متكررة.

---

20. الكود الميت المحتمل

20.1 قائمة المرشحين

المرشح سبب الاشتباه ما يلزم قبل الحكم
src/engine/adaptiveEngine.ts ملف كبير · لا يُثبت مسار استدعائه تتبع المستوردين والرموز المستهلكة
src/engine/problemGenerator.ts وجود محرك لا يثبت تشغيله تتبع استخدامه من نقاط الدخول
src/engine/masteryTracker.ts منطق مستقل البحث عن الاستدعاءات المباشرة وغير المباشرة
src/data/bank-linked.ts طبقة ربط بين بنك قديم وأنواع أحدث تحديد وصول المستهلكين
src/data/bank-v2/* بنك انتقالي فحص الشاشات والخدمات
src/data/bank-raw/* ملفات بيانات خام تحديد ما إذا كانت تغذي الامتحانات
src/utils/anzanBadges.ts تخزين منفصل للشارات تتبع المستوردين والكتّاب
src/utils/audioAnzanBadges.ts تخزين منفصل نفس ما سبق
src/components/DebugOverlay.tsx أدوات تشخيص محتملة التحقق من وجودها في الإنتاج
src/components/SorobanEngineDebug.tsx أداة تشخيص لا تحذفها لمجرد الاسم

20.2 الحكم الرسمي من v8

لا يمكن اعتبار هذه الملفات كودًا ميتًا مؤكدًا.
بعضها قد يكون معزولًا عمدًا أثناء الانتقال إلى SRB.
الدوال والأنواع غير المستعملة — لا يقدم التقرير تحليلًا بمستوى TypeScript Checker.
قسم Call expressions يحصي الاستدعاءات النصية ولا يثبت أن تعريف دالة معينة بلا مستدعٍ.

---

21. الأخطاء النحوية والسكربتية

النوع العدد
Parse errors 0
Script errors 0

النتيجة: لا أخطاء تحليل نحوي في أي ملف من 168.

---

22. التوصيات العشر حسب الأولوية

الأولوية التوصية السبب الأثر
P0 إنشاء تقرير مفاتيح تخزين محلولة عمليات تخزين لا يُعرف مفتاحها كشف التعارضات والبيانات اليتيمة
P0 رسم اعتماد عكسي للملفات والاستيرادات لا يُثبت الملفات غير المستوردة أو الدورات تقليل خطر حذف ملفات لازمة
P0 توثيق مسارات bank-v2 وbank-raw وSRB بنوك وطبقات متوازية منع انقطاع الامتحانات أثناء الترحيل
P1 استخراج واجهات المتاجر الأربعة الحقول والإجراءات غير معروضة متكاملة توثيق تدفق الحالة
P1 فصل نتائج AST عن العيوب المؤكدة 80 لا يثبت 80 مشكلة تقليل الإنذارات الكاذبة
P1 مراجعة المفاتيح المشتركة بين الشاشات بعض النتائج تُقرأ وتُكتب من وحدات متعددة توحيد صيغة البيانات
P1 فحص استدعاءات الرموز بـTypeScript Checker عدّ الاستدعاءات النصية غير موثوق قائمة أدق للدوال والأنواع غير المستخدمة
P2 تفكيك الملفات الأكبر تدريجيًا 1,000–2,000 سطر تحسين قابلية الاختبار والصيانة
P2 الاحتفاظ بالبنوك القديمة حتى إثبات انتهاء الاعتماد الاستيرادات الداخلية لا تثبت عدم الاستخدام ترحيل آمن
P2 حفظ نتائج البناء والفحص منفصلة عن تقرير AST نجاح التحليل النحوي ≠ سلامة البناء تمييز أخطاء البناء عن ملاحظات التحليل

---

23. الأولويات الأربع من تقرير البناء

# الأولوية الإجراء
1 استكمال الفحص المستقل فحص package.json · إضافة سكربت typecheck
2 تحليل حجم الحزمة تحديد الوحدات الثقيلة · import() · manualChunks
3 الاختبارات الوظيفية مسارات الطفل الكاملة
4 التحقق من النشر GitHub Pages · الأصول · الصوت · التوجيه

---

24. المخاطر الحرجة المُعلنة

🔴 خطر 1 — لا lockfile

· كل بناء قد يثبّت إصدارات مختلفة.
· لا استرجاع دقيق لحالة سابقة.
· عرضة لـsupply-chain attacks.

🔴 خطر 2 — حزمة JavaScript كبيرة (1.70 MB)

· أداء ضعيف على الأجهزة الضعيفة.
· تحميل بطيء عند أول زيارة.

🔴 خطر 3 — 80 مفتاحًا ديناميكيًا غير محلول

· لا يمكن معرفة المفاتيح اليتيمة الفعلية.
· لا يمكن كشف التعارضات في التخزين.

🔴 خطر 4 — soroban_number_style له 3 مصادر

· متجر Zustand + ملفان utils.
· خطر تعدد مصادر الحقيقة.

🔴 خطر 5 — ملفات قد تكون ميتة أو حية بلا إثبات

· useTranslation — متجر بـpersist لكن AL-ISLAH يقول «ميت».
· adaptiveEngine · masteryTracker · problemGenerator — لم يُثبت تشغيلها.

🔴 خطر 6 — لا typecheck مستقل

· «0 أخطاء» في v8 = أخطاء AST فقط.
· لا يعني سلامة الأنواع.

---

25. الخلاصة النهائية

25.1 ما يقدمه v8

· جرد واسع للاستيرادات والاستدعاءات والتخزين.
· 9 مؤشرات دقيقة.
· 4 قيود مُعلنة.
· 0 أخطاء نحوية.

25.2 ما لا يحققه v8

· ❌ قائمة مثبتة للملفات غير المستوردة.
· ❌ تحليل الدورات الدائرية.
· ❌ تفاصيل كاملة للمتاجر الثمانية.
· ❌ حل معظم مفاتيح التخزين الديناميكية.
· ❌ ربط AST بربط TypeScript Checker.

25.3 التوصية الحاسمة من v8

لا تحذف ملفات.
لا تغيّر مفاتيح التخزين.
لا تدمج البنوك.
اعتمادًا على هذا التقرير وحده.

الخطوة التالية:

1. تحسين التحليل العكسي للاعتماد.
2. حل مفاتيح التخزين.
3. تتبع الاستدعاءات بين الوحدات.
4. إصدار تقرير ثانٍ يميز صراحةً بين:
   · مؤكد
   · مرشح
   · غير محسوم

---

26. القواعد المستخلصة من v8

🔴 ممنوع

1. حذف ملفات اعتمادًا على AST وحده.
2. تغيير مفاتيح تخزين اعتمادًا على v8 وحده.
3. دمج البنوك قبل توثيق المسارات.
4. اعتبار «مُستورد» = «يعمل».
5. اعتبار «0 أخطاء» = «0 أخطاء أنواع».
6. اعتماد «80 فجوة» = «80 عيبًا».
7. القول بـ«ملف ميت» بلا تتبع استدعاءات.
8. بناء قرار معماري على v8 وحده.

✅ مطلوب

1. حل مفاتيح التخزين الديناميكية.
2. بناء رسم اعتماد عكسي.
3. تتبع الاستدعاءات الفعلية.
4. توثيق مسارات البنوك.
5. فصل AST عن العيوب المؤكدة.
6. إضافة سكربت typecheck.
7. إضافة lockfile.
8. إصدار تقرير مصنّف: مؤكد / مرشح / غير محسوم.

---

27. جدول مصادر v8 السبعة

# الملف النوع الأرقام الأساسية
1 التقرير الأصلي تحليل عام 168 · 618 · 7439
2 Build & Typecheck تقرير بناء 2018 وحدة · 1.70 MB · exit 0
3 GAPS.md 80 فجوة كلها dynamic-storage-key
4 KEYS_TABLE.md 49 مفتاح 29 read · 19 write · 0 remove
5 RUN_METADATA.md بيئة Node 20 · npm 10 · لا lockfile
6 STORES_TABLE.md 8 مرشحين 4 متاجر Zustand
7 SUMMARY.md غلاف 9 مؤشرات · 4 قيود

---

28. القاعدة الذهبية النهائية

v8 هو الحقيقة الموثقة · لكنه حقيقة مشروطة.

· يحصي ما رآه AST.
· لا يثبت ما يجري في runtime.
· يحفظ حدود نفسه في 4 قيود.
· يحذّر من الحذف قبل التحقق.

كل قرار معماري يجب أن يمرّ عبر:

1. v8
2. تحليل يدوي
3. رسم اعتماد عكسي
4. تتبع استدعاءات
5. إصدار تقرير مصنّف

---


