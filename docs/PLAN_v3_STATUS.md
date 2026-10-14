خطة الإصلاح 80/20 — النسخة النهائية

الأساس

البند القرار
الحقيقة v8 + v9 (لا v5/v6/v10)
البيئة Chrome · GitHub web editor فقط
المحرك مجمّد — لا لمس
الهدف إعادة رفع نظيف · لا إضافات
القيد لا ملفات جديدة في src/
المنهج ملف واحد · اختبار · ثم التالي
الأولوية وظيفي → أداء → تنظيف → SRB

---

الترتيب (10 خطوات · ~6 ساعات)

# الخطوة الوقت الأثر الحالة
0 ✅ CI Build (منجزة) — بوابة ✅
1 Lockfile 5 د ثبات بناء ⬜
2 ضغط joud2.png 10 د −290 KB ⬜
3 Lazy للشاشات 25 د JS أصغر ⬜
4 F1 (لوحة ولي الأمر) 60 د 9 مهام ⬜
5 recordAttempt CE/PT 30 د مهارات ⬜
6 حذف 5 ملفات ميتة 15 د نظافة ⬜
7 توحيد section2_unlocked 10 د إزالة تعارض ⬜
8 إصلاح srb-adapter (3 دوال) 45 د SRB يعمل ⬜
9 عزل SRB من الحزمة 20 د JS < 900KB ⬜
10 توثيق + Tag 15 د نقطة عودة ⬜

المجموع: ~3.5 ساعات عمل + وقت المراجعة

---

تفاصيل كل خطوة

الخطوة 1 — Lockfile (5 دقائق)

لماذا: بناء حتمي · حماية supply-chain · أفضل ممارسة CI.

كيف:

1. Add file → Create new file → .github/workflows/p1-lockfile.yml
2. الصق:

```yaml
name: P1 Lockfile
on: workflow_dispatch
permissions:
  contents: write
  pull-requests: write
jobs:
  lock:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install --package-lock-only --no-audit --no-fund
      - uses: peter-evans/create-pull-request@v6
        with:
          branch: p1/lockfile
          title: "chore: add package-lock.json"
          add-paths: package-lock.json
```

3. Commit changes على main
4. Actions → P1 Lockfile → Run workflow
5. Pull requests → Merge

معيار النجاح: package-lock.json في الجذر.

التراجع: Revert PR.

---

الخطوة 2 — ضغط joud2.png (10 دقائق)

لماذا: 388 KB → ~100 KB · أسرع تحميل · لا كود.

كيف:

1. Add file → Create new file → .github/workflows/p2-images.yml
2. الصق:

```yaml
name: P2 Compress Images
on: workflow_dispatch
permissions:
  contents: write
  pull-requests: write
jobs:
  images:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: sudo apt-get update && sudo apt-get install -y pngquant
      - run: find public src -name '*.png' -size +60k -print0 | xargs -0 -I{} pngquant --quality=70-90 --skip-if-larger --force --ext .png {}
      - uses: peter-evans/create-pull-request@v6
        with:
          branch: p2/compress-images
          title: "perf: compress large PNGs"
          add-paths: |
            public
            src
```

3. شغّل ← راجع Files changed ← تحقق بصري من joud2.png
4. إذا سليمة: Merge

معيار النجاح: joud2.png ≈ 100 KB · الصورة غير مشوّهة.

التراجع: أغلق PR إن كانت مشوّهة.

---

الخطوة 3 — Lazy للشاشات (25 دقيقة)

لماذا: 1.7 MB → أصغر · تحميل أسرع.

كيف:

1. أنشئ scripts/lazyify.cjs (سكربت يحوّل الاستيرادات)
2. أنشئ .github/workflows/p3-lazy.yml
3. شغّل ← راجع Summary ← Merge

استثناء إلزامي: Header (مكوّن دائم — لا lazy).

معيار النجاح: JS الرئيسي < 1.2 MB.

التراجع: Revert · اختبر الجوال.

---

الخطوة 4 — F1 لوحة ولي الأمر (60 دقيقة)

لماذا: 9 مهام تعرض 0 · 3 شارات لا تُمنح · أعلى أثر وظيفي.

القيد: لا ملف جديد · لا نوع جديد · لا لمس progressStore · لا لمس الشاشات الثلاث.

الملفات المسموح بها:

· src/hooks/useQuests.ts
· src/utils/badgeChecker.ts
· src/screens/HeroDashboard.tsx (السطر 163 فقط)
· src/hooks/useGameStats.ts (عند الضرورة)

الخطوات الفرعية:

· 4أ — تشخيص: أرسل الملفات · شخّص · انتظر الموافقة
· 4ب — قرار: المصادر الحقيقية؟ المهام التي لا مصدر لها؟
· 4ج — تنفيذ: ملف واحد · PR
· 4د — قبول: CI ✅ · اختبار يدوي · Merge

معيار النجاح:

· لوحة ولي الأمر لا تنهار
· المهام المربوطة تتحرك
· لا مهمة تعرض 0 ثابتًا

التراجع: Revert PR.

---

الخطوة 5 — recordAttempt في CE + PT (30 دقيقة)

لماذا: مهارات CE/PT لا تُسجَّل · النظام العلاجي معطّل جزئيًا.

كيف:

· استدعاء واحد في كل شاشة (نفس نموذج PracticeScreen)
· داخل handler الإجابة — لا في render
· إضافة السطر فقط — لا إعادة هيكلة

الملفات:

· src/screens/CategoryExamScreen.tsx
· src/screens/PlacementTestScreen.tsx

معيار النجاح: حل امتحان → skillProgress يتحدث.

التراجع: Revert.

---

الخطوة 6 — حذف 5 ملفات ميتة (15 دقيقة)

الملفات (بترتيب آمن):

# الملف الشرط
1 src/utils/numerals.ts 0 مستورد
2 src/components/NumberStyleToggle.tsx 0 مستورد
3 src/utils/skillsChecker.ts 0 مستورد
4 src/utils/audioAnzanBadges.ts 0 مستورد
5 src/utils/anzanBadges.ts بعد F1 · فقط إن لم يُستورد

كيف (لكل ملف):

1. Search → ابحث الاسم بلا امتداد → تأكد 0 import
2. افتح الملف → Delete file → فرع chore/remove-dead → PR
3. CI ✅ → Merge

معيار النجاح: Cannot find module لا يظهر في CI.

التراجع: Revert PR.

لا تُلمس: numberStyle.ts · numberStyleStore.ts · engine/ · bank-*.

---

الخطوة 7 — توحيد section2_unlocked (10 دقائق)

المشكلة:

· App.tsx:537 يكتب 'true'
· CategoryExamScreen.tsx:245 يكتب JSON.stringify(true)

الحل: صيغة واحدة (المقترح: 'true' كما في App).

الملفات: CategoryExamScreen.tsx — سطر واحد.

معيار النجاح: قيمة واحدة في الكود.

---

الخطوة 8 — إصلاح srb-adapter (45 دقيقة)

المشكلة: 3 دوال معطوبة:

· getTestQuestions → يعيد Bank A (خطأ)
· getPlacementTestQuestions → يعيد فارغًا
· getExamQuestions → غير موجودة

الخطوات الفرعية:

· 8أ — تشخيص: قراءة الملف + المستهلكين
· 8ب — قرار: إصلاح أم تجاهل (إن لم تُستدعَ)؟
· 8ج — تنفيذ: دالة واحدة في كل مرة
· 8د — اختبار: CE + PT

معيار النجاح: CE + PT يفتحان بلا خطأ.

---

الخطوة 9 — عزل SRB من الحزمة (20 دقيقة)

المشكلة: App.tsx يستورد srb-adapter ساكنًا → SRB كامل في الحزمة الأولى.

الحل: استيراد ديناميكي داخل الدالة المستخدِمة.

معيار النجاح: JS الرئيسي ≤ 900 KB.

تحذير: بعد lazy (الخطوة 3) — ليس قبلها.

---

الخطوة 10 — توثيق + Tag (15 دقيقة)

الخطوات:

1. تحديث docs/PLAN_v3_STATUS.md (سطر واحد: "أُنجز")
2. git tag v2.0.1 (أو من GitHub Releases)
3. نقطة عودة كاملة

معيار النجاح: Tag موجود · الرجوع ممكن.

---

ما لا نفعله الآن (مستبعد عمدًا)

البند السبب
❌ حذف engine/ مجمّد بقرار
❌ حذف bank-* حلقة مغلقة · سيبقى
❌ ربط adaptiveEngine لا يعمل · لا نعرف جودته
❌ توحيد المتاجر مؤجل
❌ 74 مفتاحًا ديناميكيًا مؤجل
❌ i18n (زر + إكمال) مؤجل
❌ تفكيك الملفات الضخمة مؤجل
❌ L4-L7 دروس محتوى · عمل بشري
❌ اختبارات واسعة لا وقت
❌ section2_unlocked كتابات ميتة خُطوة 7 فقط

---

القواعد المُلتزَم بها (من v10)

# القاعدة
1 لا حذف إلا ما أُلغي صريحًا
2 المحرك الرياضي مجمّد
3 bank-v2/raw لا يُحذفان
4 curriculum/types.ts مجمّد
5 SRB هو البنك الوحيد للأسئلة الجديدة
6 ملف واحد · اختبار
7 نسخة احتياطية قبل أي تعديل
8 رأس موحّد لكل ملف معدّل
24 لا "يُستورد" = "يعمل"
25 لا نظام شارات جديد
26 لا IndexedDB/Backend

---

المكاسب المُتوقَّعة

المقياس قبل بعد
JS الرئيسي 1,703 KB ≤ 900 KB
joud2.png 388 KB ~100 KB
ملفات ميتة 5 0
مهام لوحة ولي الأمر 0/9 ~7/9
Lockfile ❌ ✅
تعارض section2 ✅ ❌
srb-adapter معطوب 3 0
SRB في الحزمة الأولى نعم لا

---
