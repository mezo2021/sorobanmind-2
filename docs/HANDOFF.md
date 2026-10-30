# 🧮 SorobanMind v2 — ملف التسليم للمساعد الجديد

**التاريخ:** 2026-10-28 (rev.6 — إنجاز التكامل السحابي، اكتمال L0-L4 و TTS، ترجمة الفلاش).
**الغرض:** تسليم كامل لمشروع قائم — يكمل فيه مساعد جديد بثقة عالية.
**الحالة:** 🟢 البناء أخضر · التطبيق منشور · شبكات الأمان مكتملة · Supabase متصل · دروس L0-L4 مكتملة بالكامل (ترجمة + TTS) · أداء محسّن · بنوك ميتة محذوفة · قرارات استراتيجية محسومة.

---

## 🌟 الفكرة في سطر

تطبيق تعليمي عربي (React 18 + TS 5.5 + Vite 5 + Zustand 4 + Tailwind 3) لتعليم السوروبان الياباني للأطفال (5-12) والكبار (13+). **بدون إعلانات · خصوصية كاملة (localStorage + Supabase Sync).**

- **المستودع:** `github.com/mezo2021/sorobanmind-2`
- **الموقع:** `mezo2021.github.io/sorobanmind-2`
- **المطوّر:** مصطفى علي أكر (@mezo2021)

---

## 📖 قصة المشروع

التطبيق **مات مرتين تقنيًا** وعاد في المرتين. بعد كل عودة: ارتباطات كثيرة انفصلت وأُضيفت ميزات فوق بنية قديمة.
**الآن:** في **الجلسة الثانية للهجرة** — من نظام v1 القديم إلى SRB. التطبيق يعمل ويُستخدم من المطوّر فقط حاليًا.

**الهجرة الحتمية (شبه مكتملة):**

| القديم (تم حذفه في م10 🗑️) | الجديد (المعتمد) |
|---|---|
| `bank-v2/` · `bank-raw/` · `bank-linked` · `bank-adapter.ts` · `bank.ts` | SRB (`src/data/srb/`) |
| منهج 20 درسًا (L00-L20) | 8 مستويات (L0-L7) |
| `examBank` · `bankExam` | Bank A (275) + Bank B (666) |
| منطق متفرق | منطق موحد تحت SRB |
| تخزين محلي فقط (localStorage) | تخزين محلي + سحابي (Supabase) |

---

## 🔴 القرارات الاستراتيجية النهائية (اقرأ هذا أولاً)

### قرار 1: بروتوكول كتابة الدروس (L5-L7 وما بعدها)
**كل درس جديد من L5 فصاعداً يجب أن يتبع صيغة `id: "L{level}-S{num}"`.** (ملاحظة: دروس L0-L4 مكتملة بالفعل ومترجمة).

```typescript
// ❌ خطأ فادح (يُضيف ديناً تقنياً جديداً):
id: "S11"

// ✅ صحيح (يتبع البروتوكول):
id: "L5-S11"
```

خريطة الدروس المتبقية:

المستوى القسم ID الإلزامي
L5 S11 L5-S11
L5 S12 L5-S12
L6 S13 L6-S13
L6 S14 L6-S14
L7 S15 L7-S15

قاعدة إلزامية: skillId يبقى S{num} دائماً (مرجع SRB Section). levelId يبقى L{num}.

قرار 2: L1-L3 لن تُوحّد أبداً

m13 مُلغاة نهائياً. دروس L1-L3 تبقى بصيغة S03-S08 للأبد.
لماذا؟
· levelOfLesson في App.tsx تدعم الصيغتين (توافق كامل).
· المخاطرة على بيانات المستخدم (Migration v13) لا تبررها جمالية بصرية.
· skillProgress يستخدم L1-S03-m1 (الصيغة النظيفة) بشكل مستقل — لا تضارب.

قرار 3: levelOfLesson طبقة توافق دائمة

ممنوع حذفها. ممنوع تعديلها. هي سبب استقرار المشروع وتمكين تقليل الحزمة.

```typescript
// في App.tsx — لا تحذفها أبداً
function levelOfLesson(lessonId: string): string {
  const prefixed = lessonId.match(/^(L[0-7])-/);
  if (prefixed) return prefixed[1];  // "L0-S01" → "L0" أو "L4-S09" → "L4"
  const lv = SRB_LEVELS.find((l) =>
    (l.sections as readonly string[]).includes(lessonId),
  );
  return lv?.id ?? 'L0';  // "S03" → "L1"
}
```

قرار 4: منع split('-')[0] نهائياً

"S03".split('-')[0] يعطي "S03" وليس "L1". استخدم levelOfLesson فقط.

قرار 5: المصدر الوحيد للحقيقة (progressStore + Supabase)

· المتجر المحلي progressStore هو المحرك الأساسي، ويعمل أوفلاين بعد أول تسجيل.
· Supabase هو خزانة (Cloud Backup) للمزامنة اليدوية (حفظ/استعادة).
· الحفظ التلقائي (Auto-Save) لم يُنفذ بعد (مؤجل).

قرار 6: المصادقة إلزامية (لا زوار)

· التطبيق تعليمي وتقييمي، ولا يعمل بدون بيانات طالب حقيقية.
· يجب تسجيل دخول أول مرة (يتطلب إنترنت).
· بعد التسجيل، يفتح التطبيق أوفلاين عبر getSession بدلاً من getUser.

---

📚 مصادر الحقيقة (ملزمة)

🎯 الأساس (لا يُناقش)
· Audit v8 (AST) — آخر تشغيل: 2026-10-20 · commit f01eb40 · 165 ملفًا · 627 استيرادًا · 0 أخطاء · 45 مفتاحاً ثابتاً · 68 فجوة ديناميكية.
· Audit v9 (Bash) — آخر تشغيل: 2026-10-20 · commit f01eb40 · 10 أقسام.
· v8 + v9 = الحقيقة — تقرير مفصّل في docs/AUDIT_V8_V9_2026-10-20.md.

⚠️ تنبيهات على v9 (من مراجعة Claude)
· v9 يستخدم grep حرفي → يخطئ في setItem المكتوب على عدة أسطر · المرجع للمفاتيح هو v8.
· v9 يخطئ في المفاتيح المكتوبة عبر ثوابت (مثل NAME_STORAGE_KEY).

🗺️ الخطة الحالية
· docs/EXECUTION_PLAN_2026-10-20.md — الخطة النهائية المعتمدة.
· docs/EXECUTION_LOG.md — السجل التفصيلي لكل ما تم تنفيذه.

🔴 مصادر مهجورة صراحةً
· v5 · v6 · PROJECT_MASTER v5 — لا تُعتمد.
· AL-ISLAH.md · AL-ISLAH-V2.md · PLAN_v3.md — أرشيف.
· REPAIR_PLAN_2026-10-20.md · PROBLEMS_2026-10-20.md — تم استبدالهما.

---

🛡️ القواعد الذهبية (لا تفاوض)

1. لا ملفات جديدة في src/ — كل ما نحتاجه موجود (اختبارات في tests/ مسموحة).
2. لا توسيع أنواع (types) — استبدال وتقليل فقط.
3. لا حذف مهام/ميزات حقيقية — فقط الميت المؤكد بـ grep.
4. مصدر واحد لكل بيانات — لا مصادر متوازية.
5. الهجرة = نقل من القديم إلى الجديد (SRB).
6. لا تخمين — اطلب الملف كاملًا واقرأه قبل أي اقتراح.
7. كل تعديل عبر commit مباشر على main — لا دمج إلا بـCI أخضر · التراجع بـRevert.
8. لا تُرجع إلا الملفات/الأجزاء المتغيرة — كاملة جاهزة للصق.
9. لا كود قبل رؤية الملف الحالي — لا تعديل بلا قراءة.
10. قاعدة الـ Lazy: يُمنع منعاً باتاً استخدام React.lazy بدون تغليفه بـ Suspense و ErrorBoundary.
11. الاعتماد على CI: لا انتقال لخطوة جديدة إلا ببناء أخضر ✅.
12. الملفات المحمية (Red Zone): لا تُلمس إلا بموافقة صريحة وخطوة بخطوة.
13. بروتوكول L5-L7: أي درس جديد → id: "L{level}-S{num}" (إلزامي).
14. levelOfLesson محمية: لا تحذفها، لا تعدّلها.
15. m13 مُلغاة: لا تخطط لها، لا تذكرها.

🔒 ملفات محمية (Red Zone)

· i18n/ · screens/Header.tsx · screens/LessonScreen.tsx
· store/numberStyleStore.ts · utils/numberStyle.ts
· curriculum/types.ts · curriculum/lessons/types.ts
· store/masteryBadgesStore.ts
· components/flash/* (11 ملفًا)
· components/soroban2d5/*
· components/games/* (5 ألعاب)
· نظام SRB: data/srb/*
· المحرك التكيفي (مفصول حالياً): engine/* (Stubs في adaptiveEngine و problemGenerator).
· ملفات السحابة: lib/supabase.ts · lib/cloudSync.ts · components/AuthModal.tsx (حساسة جداً).

استثناءات progressStore: تحرّر من الحماية بعد v10 (2026-10-16). التوسعة الإضافية مسموحة بموافقة صريحة + migration additive.

💻 بيئة العمل

· Chrome على الجوال/سطح المكتب (⋮ ← Desktop site).
· GitHub web editor فقط — لا Node · لا Git محلي.
· نمط العمل: main مباشرة — لا فروع · لا PRs (CI يفحص · Revert جاهز).

---

🚨 تصحيحات إلزامية (من مراجعة Claude · 2026-10-20)

التصحيح الدليل

H1 🔴 «عزل SRB» فرضية خاطئة. App.tsx:65 هو import type — يُمحى عند البناء. (حُلّت في م10 + م5-ب).
H1-أ 🔴 الحجم الحقيقي: ألعاب (9,885) · دروس (4,737). v8 reachability.
H2 🔴 soroban_placement_result «كاتب بلا قارئ». (حُذف في م3-ب).
H3 🔴 placement_recommended وplacement_weak_skills نشطان: v8 > v9.
H4 🟡 soroban_child_name له كاتب. نشط. v8 > v9.
H5 🟡 soroban_section2_unlocked ما زال يُكتب. (حُذف في م3-ب).
H6 🟡 الرقم 80 صار 68 فجوة ديناميكية (v8-172).
H7 🟡 data/index.ts غير موصول — (حُذف في م3-أ).
H8 🟡 soroban_exam_result قارئ بلا كاتب. (حُذف في م3-ج).

---

📊 حالة المشروع الحقيقية (محدّثة 2026-10-28)

المراحل المكتملة

المرحلة الحالة الأثر

0 CI Build ✅ بوابة بناء تلقائية.
1 تصحيح HANDOFF ✅ دمج تصحيحات H1-H8.
2 التحققات U1-U6 ✅ اكتشاف اختلاط IDs.
3 تنظيف آمن ✅ حذف 4 ملفات + lazyify.cjs + 4 workflows.
4 Vitest ✅ اختباران يعملان في CI.
5 الأداء (م5-ج) ✅ Lazy للألعاب + تحسينات عميقة.
5-ب تقليل الحزمة ✅ إزالة getLessonById الساكنة → فصل الدروس (445 KB).
6 مصدر واحد (م6) ✅ توحيد الدروس والامتحانات واسم الطفل.
7 زر التصفير ✅ تصحيح النص.
8 توحيد LevelId (م8) ✅ v12 + Migration محصّنة + 6 ملفات.
9 ESLint ✅ تثبيت + إصلاح Lockfile.
10 إعدام البنوك (م10) ✅ حذف 7,000+ سطر ميت.
11 تنظيف المفاتيح (م11) ✅ إضافة completed_lessons + passed_practice للـ cleanup.
14 التكامل السحابي (م14) ✅ Supabase (Auth, CloudSync, RLS).
15 اكتمال المنهاج (م15) ✅ دروس L0-L4 (ترجمة + TTS + MP3).
16 ترجمة الفلاش (م16) ✅ الفلاش التعليمي مترجم بالكامل.
❌ م13 (توحيد L1-L3) ❌ مُلغاة نهائياً بقرار استراتيجي.

حالة الحزمة (Bundle)

· index-*.js = 445 KB (gzip 135 KB).
· Chunks: LearnScreen (5.23 KB) · LessonScreen (29.49 KB) · IntroductionScreen (4.29 KB).
· الألعاب: ملفات منفصلة (Lazy).

حالة progressStore

· version: 12.
· passedPractice, passedAnzanVisual, passedAnzanAudio: ["L0","L1","L2"] (نصوص).
· Migration v12: محصّنة ضد idempotency + ترفض القيم خارج نطاق L0-L7.

---

🌐 التكامل السحابي (Supabase Integration)

البنية الأساسية

· src/lib/supabase.ts: إعداد الاتصال بـ Supabase.
· src/lib/cloudSync.ts: يحتوي على دوال المصادقة والمزامنة.
· الجدول السحابي: soroban_progress (عمودان: user_id, progress_data, updated_at).
· بيانات المستخدم: تُحفظ في user_metadata (إيميل + باسورد + اسم ولي الأمر + اسم الطفل).

الأمان (RLS)

· 3 سياسات (SELECT, INSERT, UPDATE) مبنية على auth.uid() = user_id.
· الخصوصية: كل طالب يرى بياناته فقط.
· التحقق: عبر JWT Token + RLS + فلترة يدوية في cloudSync.ts.

المزامنة اليدوية

· الحفظ: من GuardianDashboard.tsx → cloudSync.saveToCloud() → يرسل الحالة النقية.
· الاستعادة: cloudSync.loadFromCloud() → يجلب البيانات ويحدث المتجر → window.location.reload().
· الحفظ التلقائي (Auto-Save): لم يُنفذ بعد (اختياري — Debounce 3s).

المصادقة (Auth)

· AuthModal.tsx: تسجيل/دخول (إيميل + باسورد + اسم ولي الأمر + اسم الطفل).
· القفل: RoleSelection.tsx يمنع الدخول (Screens Locked) حتى يتم التحقق.
· الخروج: يمسح الأسماء من المتجر والذاكرة، ولا يمسح التقدم.
· المطور: كلمة سر ثابتة mowalid-m للوصول للوحة ولي الأمر.

استراتيجية الوضع الأوفلاين (Offline Mode)

· أول مرة: يتطلب إنترنت (للتسجيل).
· بعد التسجيل: يفتح التطبيق أوفلاين (عبر getSession بدلاً من getUser).
· التحقق الخفي: getUser() في الخلفية (لو فشل بسبب الشبكة → يبقى مفتوح. لو فشل بسبب 401 → يخرج).

الرسائل المعتمدة في AuthModal

1. رسالة الترحيب:
   · AR: "لضمان تجربة تعليمية آمنة، نحتاج اسم الطالب واسم ولي الأمر. بياناتك محمية ولا يراها أحد سواك."
   · EN: "To ensure a safe learning experience, we need the student's name and parent's name. Your data is protected and only visible to you."
2. الرسالة الاستباقية (أوفلاين):
   · AR: "📶 يبدو أنك غير متصل. يرجى الاتصال بالإنترنت لإنشاء حسابك. بعدها، ستعمل جميع الدروس والألعاب بدون إنترنت."
   · EN: "📶 It seems you are offline. Please connect to the internet to create your account. After that, all lessons and games will work offline."
3. رسالة الخطأ (عند الفشل بسبب الشبكة):
   · AR: "❌ لا يوجد اتصال. يرجى التحقق من الشبكة والمحاولة مرة أخرى."
   · EN: "❌ No connection. Please check your network and try again."
4. مؤشر الاتصال:
   · أخضر: "متصل" / "Online" (navigator.onLine === true).
   · أحمر: "غير متصل" / "Offline" (navigator.onLine === false).

---

🎯 خارطة الطريق المتبقية

🔴 الأولوية القصوى:

1. كتابة دروس L5-L7 بصيغة L{level}-S{num} (L5-S11, L5-S12, L6-S13, L6-S14, L7-S15).
2. ترجمة وإضافة TTS لدروس L5-L7 (عربي وإنجليزي) مثل طريقة L3 و L4.

🟠 أولوية متوسطة:

3. ربط engine بـ srb-adapter: استبدال Stubs في adaptiveEngine و problemGenerator.
4. الحفظ التلقائي (Auto-Save) في Supabase (Debounce 3s).
5. ترجمة الألعاب (5 ألعاب) - قيد التنفيذ مع Claude.

🟡 أولوية منخفضة:

6. مراجعة الملفات المجمّدة (engine/*).

❌ ما لن يُنفّذ أبداً:
❌ m13 (توحيد L1-L3).
❌ Migration v13.
❌ تعديل ملفات L1-L3.
❌ حذف levelOfLesson.
❌ مراجعة ألعاب PirateRaceGame و Sorobania (لا تستخدم المعداد).

---

🗂️ بنية المشروع (محدّثة)

```text
src/
├── App.tsx (~700 سطر · levelOfLesson يدعم الصيغتين)
├── main.tsx (ErrorBoundary + Suspense + cleanup + Migration)
├── i18n/
├── curriculum/ 
│   ├── L0 (3 دروس: L0-intro, L0-S01, L0-S02)
│   ├── L1 (2 دروس: S03, S04)
│   ├── L2 (2 دروس: S05, S06)
│   ├── L3 (2 دروس: S07, S08)
│   ├── L4 (2 دروس: L4-S09, L4-S10) ← مكتملة
│   └── L5-L7 (لم تُكتب بعد)
├── engine/ (5 ملفات · Stubs مؤقتة)
├── data/
│   ├── srb/ (النظام الموحّد)
│   └── srb-adapter.ts
├── lib/
│   ├── supabase.ts
│   └── cloudSync.ts
├── store/
│   ├── progressStore.ts (v12)
│   ├── masteryBadgesStore.ts
│   └── numberStyleStore.ts
├── components/
│   ├── AuthModal.tsx (جديد)
│   ├── games/ (5 ألعاب · Lazy-loaded)
│   ├── flash/ (11 ملفًا)
│   └── soroban2d5/ (محمي · memoized)
├── screens/ (22 شاشة)
└── utils/
```

الملفات المحذوفة (تاريخياً)
· 2026-10-15: BadgeModal · NumberStyleToggle · skillsChecker · numerals · SorobanEngineDebug.
· 2026-10-16: badgeChecker · anzanBadges · audioAnzanBadges.
· 2026-10-23: data/index.ts · data/modes.ts · data/curriculum.ts · curriculum/lessons/L0/test-pool.ts · scripts/lazyify.cjs.
· 2026-10-24 (م10): data/bank.ts · data/bank-linked.ts · data/bank-adapter.ts · bank-v2/ · bank-raw/.

Workflows النهائية
· دائمة: ci-build.yml · deploy.yml · lint.yml · audit.yml · audit-v8.yml · audit-v9.yml.
· محذوفة: p0-baseline.yml · p1-lockfile.yml · p2-images.yml · p3-lazy.yml.

---

📌 ملاحظات حرجة للمساعد الجديد

1. progressStore.ts v12: التوسعة الإضافية مسموحة بموافقة صريحة + migration additive.
2. engine/ مفصول: ملفات adaptiveEngine و problemGenerator تعمل بـ Stubs مؤقتة. لا تحذفها حتى يتم الربط بـ SRB.
3. البنوك القديمة حُذفت: لا تبحث عن bank.ts أو bank-linked أو bank-v2.
4. قبل حذف أي ملف: grep ثلاثي + audit.
5. قبل أي اقتراح: اطلب الملف كاملًا · اقرأه · لا تخمّن.
6. إن لم تكن متأكدًا: قل «لا أعرف» واسأل.
7. الرقم 68 من v8 = 68 فجوة ديناميكية طبيعية. ليست عيوباً.
8. useTranslation حيّ (3 مستوردين).
9. نمط العمل: main مباشرة · لا فروع · CI يفحص · Revert جاهز.
10. مصدر واحد للنجاح: grades[levelId].levelTest >= 80.
11. v9 خطأ في grep حرفي → v8 مرجع المفاتيح.
12. تصحيح H1: «عزل SRB» فرضية خاطئة. الحجم في الألعاب والدروس.
13. اسم الطفل: يُقرأ من useProgressStore في كل الألعاب (تم التوحيد).
14. نتائج الامتحانات: تُقرأ من المتجر (تم التوحيد).
15. زر التصفير: يمسح البيانات المؤقتة فقط، والنص مصحح.
16. المعداد Soroban2D5 و Rod2D5: محميان بـ React.memo ومحسّنان للأداء.
17. الفلاش التعليمي: يستخدم ألوان red/emerald/white — لا تلمس Rod2D5 دون مراجعة.
18. levelOfLesson في App.tsx: طبقة توافق دائمة — لا تحذفها، لا تعدّلها.
19. بروتوكول L5-L7: أي درس جديد من L5 فصاعداً → id: "L{level}-S{num}" (إلزامي).
20. m13 مُلغاة: توحيد L1-L3 لن يحدث أبداً.
21. split('-')[0] ممنوع: استخدم levelOfLesson فقط.
22. الحزمة 445 KB: أي إضافة كبيرة قد ترفعها — راقب CI Build Summary.
23. Supabase: جدول soroban_progress (عمودان فقط). الأمان عبر RLS. المزامنة يدوية.
24. Auth: إلزامي للتسجيل. لا زوار. getSession للعمل أوفلاين بعد التسجيل.
25. مؤشر الاتصال: يجب أن يكون في AuthModal (أخضر/أحمر) بناءً على navigator.onLine.
26. رسائل AuthModal: ثنائية اللغة (عربي/إنجليزي) — ترحيب، أوفلاين، خطأ.
27. TTS: مكتمل لـ L0-L4 (عربي/إنجليزي). سيطبق على L5-L7 عند كتابتها.

---

🧪 اختبار يدوي (Smoke Test بعد كل مرحلة)

فحص أساسي (كل مرحلة)
☐ التطبيق يفتح بسرعة (بفضل Lazy).
☐ لوحة البطل تعمل، وقائمة الألعاب تظهر.
☐ المستويات مقفلة بشكل صحيح.
☐ اسم الطفل يظهر في الألعاب واللوحات.
☐ نتائج الامتحانات تُحفظ وتُقرأ.
☐ زر التصفير يعرض النص الجديد.
☐ الأنزان البصري والسمعي يعملان.
☐ المعداد في الاختبارات والدروس يعرض بعمودين.
☐ التوهج اختفى في DetectiveGame و FlyingAbacusGame.
☐ لعبة الصحن الطائر تعمل بسلاسة 60 إطاراً.

فحص م5-ب (تقليل الحزمة)
☐ افتح درساً من L0 → "رجوع" → يعود لقائمة L0.
☐ افتح درس L0-intro → "رجوع" → يعود لقائمة L0.
☐ افتح درس S03 (L1) → "رجوع" → يعود لقائمة L1.
☐ افتح درس S05 (L2) → "رجوع" → يعود لقائمة L2.
☐ CI Build Summary: index-*.js ≈ 445 KB.

فحص م8 (توحيد LevelId)
☐ completedLessons في backup = ["L0-intro","L0-S01","L0-S02","S03",...].
☐ passedPractice = ["L0","L1","L2"] (نصوص وليس أرقام).
☐ version: 12 في sorobanmind-v2-progress.

فحص م14 (Supabase & Auth)
☐ التسجيل يعمل (إيميل + باسورد + اسمين).
☐ الشاشات مقفلة قبل التسجيل.
☐ زر الخروج يمسح الأسماء.
☐ زر المطور يعمل بكلمة السر 19871987.
☐ الحفظ/الاستعادة السحابية يعملان.
☐ مؤشر الاتصال (أخضر/أحمر) يظهر في AuthModal.
☐ التطبيق يفتح أوفلاين بعد أول تسجيل.

---

🎯 رسالة للمساعد الجديد

المشروع الآن ليس في حالة فوضى — بل في وضع مستقر جداً بعد جلسة إصلاح عميقة وتكامل سحابي.

· التطبيق يعمل ✅
· البناء أخضر ✅
· Supabase متصل (Auth + RLS) ✅
· دروس L0-L4 مكتملة (ترجمة + TTS) ✅
· شبكات الأمان مكتملة (CI + ESLint + Vitest) ✅
· progressStore v12 ✅
· مصدر واحد للحقيقة ✅
· أداء محسّن (Lazy + memo + translateY) ✅
· الحزمة مخفضة 51% (445 KB) ✅
· levelOfLesson طبقة توافق دائمة ✅

اقرأ هذا الملف أولاً · ثم AUDIT_V8_V9_2026-10-20.md · ثم EXECUTION_PLAN · ثم EXECUTION_LOG · ثم اسأل المطوّر: «من أين نبدأ؟»

لا تُحرّك سطرًا حتى تقرأ الملف الذي ستُعدّله كاملًا.

---

🚀 التحسينات الإضافية (Performance & UI)

1. تسريع فتح التطبيق (Lazy Loading)
   · GamesListScreen في HeroDashboard.tsx → Lazy + Suspense.
   · النتيجة: الألعاب لم تعد تُحمّل عند فتح لوحة البطل.
2. حل مشكلة البطء في "الصحن الطائر" (FlyingAbacus)
   · عزل المؤقت: مكون GameTimer مستقل.
   · إصلاح تسريب الذاكرة: addTimeout تحذف المؤقت بعد انتهائه.
   · تخفيف الحركات: opacity: 0 بدل scale: 0.
   · حساب الوقت: Date.now() بدل state.
   · النتيجة: 60 FPS سلس.
3. تحسين أداء المعداد (Soroban2D5 & Rod2D5)
   · Soroban2D5: React.memo.
   · Rod2D5: React.memo + إزالة backdropFilter + transform: translateY.
4. إصلاح التوهج في الألعاب
   · إزالة rodTint="white" من DetectiveGame و FlyingAbacusGame.
   · النتيجة: لون خشبي هادئ.
5. تقليل الحزمة 51% (م5-ب)
   · الملف: App.tsx فقط.
   · الإجراء: حذف import { getLessonById } + دالة levelOfLesson.
   · النتيجة: index-*.js من 911 KB → 445 KB.

---

📊 الإنجازات الرئيسية (ملخص)

الإنجاز قبل بعد
حجم الحزمة الرئيسية 911 KB 445 KB
بنوك ميتة 8,235 سطر 0
version progressStore 11 12
passedPractice [0,1,2] ['L0','L1','L2']
CI ✅ ✅
اختبارات 0 2
ESLint ❌ ✅
ملفات ميتة ~20 0
التكامل السحابي ❌ ✅
دروس TTS ❌ ✅ (L0-L4)

---

آخر تحديث: 2026-10-28 (rev.6)
الحالة: 🟢 البناء أخضر · Supabase متصل · L0-L4 مكتملة · شبكات أمان كاملة · حزمة 51% أخف.
التالي: كتابة دروس L5-L7 وترجمتها + إضافة TTS (بروتوكول إلزامي).

```