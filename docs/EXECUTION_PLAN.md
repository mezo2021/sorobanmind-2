# 🎯 خطة التنفيذ والحالة الفعلية — SorobanMind v2 (rev.5)

**التاريخ:** 2026-10-24 (مراجعة شاملة بعد جلسة الإصلاح العميقة وإعدام البنوك)
**الغرض:** خطة تنفيذ كاملة بأكواد جاهزة للصق، محدثة لتعكس ما تم إنجازه وما تبقى. بديل كامل عن `REPAIR_PLAN` + `PROBLEMS`.
**القواعد:** (1) لا ملفات جديدة في `src/` · (2) لا توسيع أنواع · (3) لا حذف ميزات حقيقية · (4) مصدر واحد للبيانات · (5) لا تخمين · (6) الملفات المحمية لا تُلمس بلا موافقة · (7) CI أخضر قبل أي merge · (8) Revert جاهز.

---

## 📑 الفهرس

1. رسالة للمساعد القادم
2. تصحيحات إلزامية (H1–H8) والملاحظات النهائية
3. التحققات الإلزامية (U1–U6) ونتائجها
4. حالة المراحل (ما تم تنفيذه بالكامل)
5. قائمة "لا تنفّذ" (الملفات المحمية)
6. بروتوكول كل تعديل
7. خارطة الطريق المتبقية (ما تبقى)
8. التحسينات الإضافية (Performance & UI)

---

## 🌟 1) رسالة للمساعد القادم

صديقي. المشروع **ليس في حالة فوضى**، بل في وضع مستقر جداً بعد جلسة إصلاح عميقة. البناء أخضر، F1 مكتمل، منطق الاختبار مُصلَح، شبكات الأمان مكتملة (CI، ESLint، Vitest)، والمصادر موحدة، والبنوك الميتة محذوفة.

**اقرأ بالترتيب:**
1. `docs/HANDOFF_2026-10-20.md` (rev.4) — نقطة الدخول
2. `docs/AUDIT_V8_V9_2026-10-20.md` (rev.2) — مرجع الأرقام والمفاتيح
3. **هذا الملف** — التنفيذ الفعلي والحالة الحقيقية
4. `docs/EXECUTION_LOG.md` — السجل التفصيلي

**قاعدة صارمة:** لا تعديل بلا 4 خطوات — (أ) ابحث عن كل مستورد (grep ثلاثي) (ب) عدّل · Commit (ج) انتظر CI Build ✅ (د) اختبر يدوياً (Smoke). عند الفشل: Revert.

---

## 🚨 2) التصحيحات الإلزامية والملاحظات النهائية المعتمدة

هذه التصحيحات **تُلغي بنوداً خاطئة** وتُثبّت قواعد حاكمة لا يجوز تجاوزها:

### أ) تصحيحات كلاود (H1–H8)
| # | التصحيح | الدليل / الحالة |
|:-:|---------|--------|
| **H1** 🔴 | **معالجة تضخم الحزمة:** `App.tsx:65` هو `import type` (لا يدخل الحزمة)، ولكن تم حل المشكلة من جذورها. **تم التنفيذ (م10):** إعدام البنوك الميتة (`bank.ts`, `bank-v2`, `bank-raw`)، وفصل المحرك (`engine`) عن البنوك. | تحليل + م10 |
| **H1-أ** 🔴 | **الحجم الحقيقي في مكانين:** الألعاب (9,885 سطراً) عبر `HeroDashboard:17` · الدروس (4,737 سطراً) عبر `App.tsx:48`. تم تفعيل Lazy للألعاب. | reachability |
| **H2** 🔴 | **`soroban_placement_result` ما زال يُكتب** في `App.tsx:246` — «كاتب بلا قارئ». (تم حذفه في م3-ب). | v8 KEYS_TABLE |
| **H3** 🔴 | **`placement_recommended` و`placement_weak_skills` نشطان.** **لا تحذفهما.** | v8 > v9 |
| **H4** 🟡 | **`soroban_child_name` له كاتب:** `RoleSelection.tsx`. (تم توحيده في م6-ب). | v8 > v9 |
| **H5** 🟡 | **`soroban_section2_unlocked` ما زال يُكتب.** (تم حذفه في م3-ب). | v8 |
| **H6** 🟡 | **68 فجوة ديناميكية** (كانت 80). | v8-172 |
| **H7** 🟡 | **`data/index.ts` غير موصول.** (تم حذفه في م3-أ). | reachability |
| **H8** 🟡 | **`soroban_exam_result` قارئ بلا كاتب.** (تم حذفه في م3-ج). | v8 KEYS_TABLE |

### ب) التصحيحات النهائية المعتمدة (2026-10-21 · لا تُناقش)
1. **م0 (CI):** اعتماد كود محصّن يطبع الأصول (Assets) لفحص حجم 315KB.
2. **م3-أ (حذف الملفات):** أُلغيت فكرة الحذف العشوائي. القاعدة الآن **"اقرأ الملف كاملاً (أول 40 سطراً) ثم قرر"**. لا حذف دون التحقق من عدم وجود منطق حي.
3. **م6-ب (اسم الطفل):** تم تأجيلها سابقاً لتجنب المصادر المتوازية، **ولكن تم تنفيذها بنجاح لاحقاً** في هذه الجلسة عبر توحيد جميع الألعاب.
4. **م7 (التصفير):** الخيار (ب) أُلغي. تم تطبيق **الخيار (أ) فقط** (تعديل نص الرسالة ليكون صادقاً) لحماية بيانات المطور.
5. **U5 (فحص الدروس):** موسّع ليشمل الدروس التسعة (L0-L3).

---

## 🔍 3) التحققات الإلزامية (U1–U6) ونتائجها

تم تنفيذ هذه التحققات بالكامل في جلسة 2026-10-23، وكانت النتائج كالتالي:

| # | الملف | السؤال | النتيجة / القرار |
|:-:|-------|--------|--------------------------|
| **U1** | `src/screens/LessonScreen.tsx` | قيمة `LESSON_PROGRESS_KEY`؟ | `soroban_completed_lessons`. تم حذف الكتابة الخام في م6-أ. |
| **U2** | `src/screens/HeroDashboard.tsx` | ماذا يفعل `soroban_exam_result`؟ | لا يتحكم بأي شيء مرئي. تم حذف الكود الميت في م3-ج. |
| **U3** | `src/screens/GuardianDashboard.tsx` | هل يمسح `sorobanmind-v2-progress`؟ | لا يمسحه (يبقيه في `keysToKeep`). تم اعتماد الخيار (أ) في م7. |
| **U4** | `index.html` assets | ما أكبر الملفات؟ | الألعاب (تم فصلها بـ Lazy). الدروس لا تزال في الحزمة الرئيسية. |
| **U5** | `curriculum/lessons/L1/S03.ts` | هل يبدأ `id` بـ `L1-`؟ | **❌ فشل (موسّع: فحص الدروس التسعة L0 إلى L3).** المعرفات مختلطة (`S03` بدلاً من `L1-S03`). **تم إلغاء م5-ب نهائياً.** |
| **U6** | `src/store/progressStore.ts` | Boolean أم ExamResult؟ | `boolean`. تم توحيد قراءته في م6-ج. |

---

## 📋 4) حالة المراحل (ما تم تنفيذه بالكامل)

تم تنفيذ المراحل التالية بنجاح في جلسة 2026-10-23 و 2026-10-24 (التفاصيل في `EXECUTION_LOG.md`):

- [x] **م0 — CI:** تم استخدام الكود المحصّن، وتفعيل الاختبارات.
- [x] **م1 — تصحيح HANDOFF:** تم دمج تصحيحات H1-H8.
- [x] **م2 — التحققات:** تم فحص U1-U6 واكتشاف اختلاط المعرفات.
- [x] **م3 — تنظيف آمن:** 
  - **م3-أ:** حذف `data/index.ts` · `data/modes.ts` · `data/curriculum.ts` · `test-pool.ts` (بعد القراءة).
  - **م3-ب:** تنظيف `App.tsx` (حذف كتابات `soroban_placement_result` و `section2_unlocked`).
  - **م3-ج:** حذف الكود الميت من `HeroDashboard.tsx`.
  - **م3-د:** تحديث مصفوفة التنظيف في `main.tsx`.
  - **إضافي:** حذف سكربت `lazyify.cjs` الخطير وحذف 4 workflows مؤقتة.
- [x] **م4 — اختبارات Vitest:** إنشاء الاختبارين وتفعيلهما في CI.
- [x] **م5-ج — Lazy للألعاب:** تحويل `GamesListScreen` إلى Lazy في `HeroDashboard`.
- [x] **م6-أ — توحيد الدروس والتمارين:** حذف الكتابة الخام من `App.tsx` و `LessonScreen`.
- [x] **م6-ب — توحيد اسم الطفل:** تحديث `RoleSelection`، و5 ألعاب، وإضافة Migration في `main.tsx`.
- [x] **م6-ج — توحيد الامتحانات:** قراءة من المتجر في `CategoryScreen`، وحذف الكتابة الميتة من `CategoryExamScreen`.
- [x] **م7 — زر التصفير:** تصحيح النص ليكون صادقاً مع سلوك الكود.
- [x] **م9أ — ESLint:** تثبيت الحزم، تحديث `lint.yml`، وإصلاح Lockfile.
- [x] **م9ب — ترتيب Workflows:** حذف `p0` · `p1` · `p2` · `p3`.
📋 توثيق م8 الكامل (6 ملفات · 13 تعديلاً)

📄 الملف 1: src/store/progressStore.ts (10 تعديلات)

# التعديل السبب
1 استيراد LevelId من @/data/srb-adapter توحيد مصدر النوع في مكان واحد (srb-adapter يُصدّر LevelId = SRBLevel = L0-L7 فقط)
2 حذف تعريف LevelId المحلي واستبداله بـ export type { LevelId }; إزالة التعريف المختلط (L0-L7 + L00-L20) الذي كان يسبب فوضى نوعية
3 passedPractice: number[] → LevelId[] تخزين معرّفات نصية (L0) بدلاً من أرقام (0)
4 passedAnzanVisual: number[] → LevelId[] نفس السبب
5 passedAnzanAudio: number[] → LevelId[] نفس السبب
6 تحديث تواقيع الدوال الثلاث (mark*Passed: (levelId: LevelId)) Type safety — منع تمرير أرقام
7 تحديث initialState (مصفوفات as LevelId[]) تطابق النوع
8 حذف دالة uniqueNums + استخدام uniqueLevels Dead code — لم يبق لها استخدام بعد التعديل
9 تحديث تنفيذ الدوال الثلاث (includes(levelId) + uniqueLevels) العمل مع النص
10 تحديث الـ Selectors الثلاثة ((levelId: LevelId)) الاتساق النوعي
11 version: 11 → 12 + إضافة applyLevelIdMigration Migration ذكي يحوّل البيانات تلقائياً
12 إصلاح فرع v3 بإضافة as ProgressState إرضاء TypeScript (كان الكائن ناقصاً للدوال)

آلية Migration v12 (جوهر العمل):

```typescript
const applyLevelIdMigration = (s: ProgressState): ProgressState => {
  if (version >= 12) return s;  // idempotent
  
  const toLevelId = (n: unknown): LevelId | null => {
    if (typeof n === "string" && /^L[0-7]$/.test(n)) return n as LevelId;
    if (typeof n === "number" && Number.isInteger(n) && n >= 0 && n <= 7)
      return `L${n}` as LevelId;
    return null;  // يرفض L15 و LL0 تلقائياً
  };
  
  const safeMap = (arr) => (Array.isArray(arr) ? arr : [])
    .map(toLevelId).filter((x): x is LevelId => x !== null);
  
  return {
    ...s,
    passedPractice: safeMap(s.passedPractice),
    passedAnzanVisual: safeMap(s.passedAnzanVisual),
    passedAnzanAudio: safeMap(s.passedAnzanAudio),
    completedLevels: ((s.completedLevels as string[]) || [])
      .filter((lv) => /^L[0-7]$/.test(lv)) as LevelId[],
  };
};
```

تطبيقها على كل مسار ترحيل (v3-v11) بدلاً من مسار واحد فقط — لحل ثغرة "v10 لن يمر عبر v12".

---

📄 الملف 2: src/screens/PracticeScreen.tsx (تعديل واحد)

```typescript
// قبل:
markPracticePassed(levelNum);
// بعد:
markPracticePassed(level);
```

السبب: level هو SRBLevel (نصي) — متوافق مباشرة مع LevelId. لا حاجة لـ parseInt سابق.

لا تغيير في منطق اللعبة.

---

📄 الملف 3: src/screens/AnzanScreen.tsx (تعديل واحد)

```typescript
// قبل:
markAnzanVisualPassed(levelNum);
// بعد:
markAnzanVisualPassed(level);
```

---

📄 الملف 4: src/screens/AudioAnzanScreen.tsx (تعديل واحد)

```typescript
// قبل:
markAnzanAudioPassed(levelNum);
// بعد:
markAnzanAudioPassed(level);
```

---

📄 الملف 5: src/screens/CategoryScreen.tsx (4 تعديلات)

استيراد جديد:

```typescript
import type { SRBLevel } from '@/data/srb-adapter';
```

3 تعديلات في .includes():

```typescript
// قبل:
passedPractice.includes(practiceNum)         // practiceNum = number
passedAnzanVisual.includes(anzanNum)         // anzanNum = number
passedAnzanAudio.includes(anzanNum)          // anzanNum = number

// بعد:
passedPractice.includes(`L${practiceNum}` as SRBLevel)
passedAnzanVisual.includes(`L${anzanNum}` as SRBLevel)
passedAnzanAudio.includes(`L${anzanNum}` as SRBLevel)
```

السبب: المتغيرات practiceNum و anzanNum محسوبة كأرقام (data.practiceRange[0] + levelIndex)، لكن المصفوفة تحتوي نصوصاً الآن. التحويل \L${num}`` يحوّل 0→'L0'، 1→'L1'.

لا تغيير في شروط الفتح أو المنطق.

---

📄 الملف 6: src/screens/LevelScreen.tsx (3 تعديلات)

```typescript
// قبل:
passedPractice.includes(level.practiceNum)        // number
passedAnzanVisual.includes(level.anzanNum)        // number
passedAnzanAudio.includes(level.anzanNum)         // number

// بعد:
passedPractice.includes(`L${level.practiceNum}` as LevelId)
passedAnzanVisual.includes(`L${level.anzanNum}` as LevelId)
passedAnzanAudio.includes(`L${level.anzanNum}` as LevelId)
```

السبب: نفس منطق CategoryScreen. LevelId مستورد بالفعل من progressStore.

---

🎯 ملخص الفوائد (للتوثيق)

ما تم حله:

المشكلة قبل بعد
نوع LevelId مختلط (L0-L7 + L00-L20) نظيف (L0-L7 فقط)
تخزين التقدم number[] ([0,1,3]) LevelId[] (['L0','L1','L3'])
تحويلات يدوية parseInt في كل مكان صفر — نصي مباشر
مصادر النوع تعريفان متضاربان مصدر واحد (srb-adapter)
الـ Migration غير آمن (v10→v12 يفشل) آمن لكل النسخ (v3→v12)

ما لم يتغير:

· ❌ منطق فتح/قفل المستويات
· ❌ ترتيب الشاشات
· ❌ الإحصائيات
· ❌ السلوك المرئي
· ❌ أي ملف محمي

الخطوة التالية (بعد التوثيق)

1️⃣ فحص فوري (30 ثانية):

· افتح التطبيق
· DevTools → Application → Local Storage → sorobanmind-v2-progress
· تحقق:
  · version = 12 ✅
  · passedPractice = ['L0','L1','L2'] (نصوص)
  · passedAnzanVisual = ['L0','L1']
  · passedAnzanAudio = ['L0','L1']

إذا كل شيء صحيح → م8 مكتملة 100%.


- [x] **م10 — إعدام البنوك وفصل المحرك:** حذف `bank.ts` و `bank-v2` و `bank-raw` و `bank-linked` و `bank-adapter`، وعزل `engine` (وضع Stubs).
- [ ] **م5-ب — إزالة استيراد الدروس:** **ملغاة** بسبب U5.
- [ ] **م8 — توحيد IDs:** مؤجلة (انظر خارطة الطريق).

---

## 🚫 5) قائمة "لا تنفّذ" (الملفات المحمية)

لا تُلمس هذه الملفات إلا بموافقة صريحة وخطوة بخطوة:
- `src/i18n/*`
- `src/screens/Header.tsx`
- `src/screens/LessonScreen.tsx`
- `src/store/numberStyleStore.ts`
- `src/utils/numberStyle.ts`
- `src/curriculum/types.ts`
- `src/curriculum/lessons/types.ts`
- `src/store/masteryBadgesStore.ts`
- `src/components/flash/*`
- `src/components/soroban2d5/*` (تم لمسه لتحسين الأداء بموافقة).
- `src/components/games/*` (تم لمسها لتوحيد الاسم وحل التوهج بموافقة).
- `src/data/srb/*`
- `src/engine/*` (مفصول حالياً ويعمل بـ Stubs، لا تحذف الـ Stubs).

**الأنماط الخطرة:**
- ❌ `React.lazy` بدون `Suspense` + `ErrorBoundary`.
- ❌ الاعتماد على `grep` حرفي لـ `setItem` متعدد الأسطر.
- ❌ تعديل ملفين محميين في commit واحد.
- ❌ حذف ملف بلا `grep` ثلاثي.
- ❌ تعديل `progressStore` v12+ بلا نسخة احتياطية + خطة ترحيل + موافقة.

---

## 📝 6) بروتوكول كل تعديل (لصق للمساعد)

```text
مشروع React 18 + TS 5.5 + Vite 5 + Zustand 4. أعمل من متصفح GitHub فقط.

القواعد:
1. لا ملفات جديدة في src/ (اختبارات في tests/ مسموحة)
2. لا توسيع للأنواع
3. لا حذف ميزات حقيقية
4. مصدر واحد للبيانات
5. لا تخمين — اقرأ كل ملف أرسلته كاملاً قبل الاقتراح. إن لم تتأكد قل «لا أعرف».
6. أعد فقط الملفات/الأجزاء المتغيرة، كاملة جاهزة للصق
7. الملفات المحمية: i18n/ · Header.tsx · LessonScreen.tsx · numberStyleStore.ts · numberStyle.ts · curriculum/types.ts · curriculum/lessons/types.ts · masteryBadgesStore.ts · components/flash/* · components/soroban2d5/* · components/games/* · data/srb/* · engine/*

السياق:
- HEAD: (أحدث commit)
- الوثائق: HANDOFF rev.4 · AUDIT rev.2 · EXECUTION_PLAN rev.5

المهمة: [...]

🎯 7) خارطة الطريق المتبقية (ما تبقى)

🔴 الأولوية القصوى: م8 — توحيد IDs

هذه المرحلة هي الوحيدة المتبقية من الخطة الأساسية. تتطلب كتابة Migration (v12) للمتجر لتحويل المصفوفات الرقمية (number[]) إلى نصوص (LevelId[]). 
شروط التنفيذ:

· جلسة منفصلة تماماً.
· موافقة صريحة على تعديل progressStore.
· أخذ نسخة احتياطية قبل البدء.
· تحديث 24 مستهلكاً في الكود.
· اختبار شامل بعد كل دفعة.

🟠 الأولوية المتوسطة

1. ربط engine بـ SRB: استبدال الـ Stubs في adaptiveEngine و problemGenerator بـ srb-adapter لتفعيل المحرك التكيفي.
2. ملاحظة هامة حول الألعاب الأخرى: ألعاب (PirateRaceGame, Sorobania) لا تحتوي على مكون Soroban2D5، بل تستخدم مكونات معداد أخرى. لذلك، لا تحتاج إلى تحسينات الأداء الخاصة بـ memo و translateY، ولا تعاني من مشكلة التوهج التي عالجناها في Detective و FlyingAbacus.

🟡 الأولوية المنخفضة

1. تحسين الحزمة بشكل أعمق: بعد إتمام م8، يمكن فصل الدروس بأمان لتقليل الحجم.

---

🚀 8) التحسينات الإضافية (Performance & UI)

تم تنفيذ هذه التحسينات لحل مشاكل "البطء" و"التوهج" التي كانت تزعج المستخدم:

1. تسريع فتح التطبيق (Lazy Loading): تحويل GamesListScreen إلى lazy() مع Suspense في HeroDashboard.
2. حل مشكلة البطء في "الصحن الطائر": عزل المؤقت، إصلاح تسريب الذاكرة، تخفيف الحركات، واستخدام Date.now().
3. تحسين أداء المعداد: تغليف Soroban2D5 و Rod2D5 بـ React.memo، إزالة backdropFilter، واستخدام transform: translateY.
4. إصلاح التوهج المزعج: إزالة rodTint="white" من الألعاب التي كانت تستخدمه بالخطأ.

---

📋 9) قائمة التتبع النهائية

```text
📊 حالة الجلسة: 2026-10-24

✅ مكتمل:
  - م0 إلى م7، م9، م10.
  - شبكات الأمان (CI، ESLint، Vitest).
  - التوحيد الكامل (مصدر واحد للحقيقة).
  - إعدام البنوك وفصل المحرك.
  - تحسينات الأداء والواجهة.

⬜ متبقي:
  - م8 — توحيد IDs (جلسة منفصلة).
  - ربط المحرك المفصول بـ SRB.
```

---

💐 10) رسالة أخيرة

صديقي. المشروع الآن في أفضل حالاته. لقد قمنا بعمل هندسي جبار. 
للمساعد القادم:

· اقرأ الوثائق الثلاثة كاملة.
· لا تلمس الملفات المحمية دون موافقة.
· لا تُعجّل. المشروع نجح لأننا لم نستعجل.
