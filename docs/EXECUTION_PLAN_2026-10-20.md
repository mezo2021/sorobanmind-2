📄 الملف الثالث الشامل — docs/EXECUTION_PLAN_2026-10-20.md (rev.3)

هذا الملف يستبدل REPAIR_PLAN_2026-10-20.md وPROBLEMS_2026-10-20.md كلياً.
مع HANDOFF rev.2 + AUDIT rev.2 = 3 ملفات كافية 100%.



1️⃣ تعديل ملف EXECUTION_PLAN_2026-10-20.md (لنجعله rev.4)

افتح الملف وأضف هذه التعديلات في الأقسام المحددة:

· في قسم (م0): استبدل كود الـ YAML القديم بالكود المحصّن الذي أرسلته لك في ردي السابق (الذي يحتوي على فحص الـ Assets).
· في قسم (م2): عند الحديث عن U5، اكتب بجانبها: (موسّع: فحص الدروس التسعة L0 إلى L3).
· في قسم (م3-أ): ألغِ فكرة "حذف 4 ملفات"، واكتب بدلاً منها: (اقرأ ثم قرّر: لا حذف لأي ملف قبل قراءة أول 40 سطراً منه وتأكيد أنه لا يحتوي منطقاً حياً).
· في قسم (م6-ب): اكتب بجانب العنوان: (مؤجلة — يمنع تطبيقها الآن لتجنب المصادر المتوازية).
· في قسم (م7): اكتب بجانب العنوان: (الخيار أ فقط: تعديل نص الرسالة، ويمنع لمس handleReset).


---

# 🎯 خطة التنفيذ الشاملة — SorobanMind v2 (rev.3)

**التاريخ:** 2026-10-20 · **Commit:** `f01eb40`
**الغرض:** خطة تنفيذ كاملة بأكواد جاهزة للصق · بديل كامل عن `REPAIR_PLAN` + `PROBLEMS`
**القواعد:** (1) لا ملفات جديدة في `src/` · (2) لا توسيع أنواع · (3) لا حذف ميزات حقيقية · (4) مصدر واحد للبيانات · (5) لا تخمين · (6) الملفات المحمية لا تُلمس بلا موافقة · (7) CI أخضر قبل أي merge · (8) Revert جاهز.

---

## 📑 الفهرس

1. رسالة للمساعد القادم
2. تصحيحات إلزامية على خطة Claude (H1–H8)
3. التحققات الإلزامية (U1–U6)
4. تنفيذ المراحل (بأكواد جاهزة)
5. قائمة "لا تنفّذ"
6. شبكات الأمان
7. بروتوكول كل تعديل
8. الحد الأدنى الآمن
9. قائمة التتبع
10. رسالة أخيرة

---

## 🌟 1) رسالة للمساعد القادم

صديقي. المشروع **في حالة جيدة**: البناء أخضر · F1 مكتمل · منطق الاختبار مُصلَح · 80% من 80/20. لكن **الخطة الأصلية (REPAIR_PLAN من Claude) فيها ترتيب غير آمن** وبند خاطئ. هذه الوثيقة **تصححها** وتجمع كل الأكواد في مكان واحد.

**اقرأ بالترتيب:**
1. `docs/HANDOFF_2026-10-20.md` (rev.2) — نقطة الدخول
2. `docs/AUDIT_V8_V9_2026-10-20.md` (rev.2) — مرجع الأرقام والمفاتيح
3. **هذا الملف** — التنفيذ الفعلي

**قاعدة صارمة:** لا تعديل بلا 4 خطوات — (أ) ابحث عن كل مستورد (grep ثلاثي) (ب) عدّل · Commit (ج) انتظر CI Build ✅ (د) اختبر يدوياً (Smoke). عند الفشل: Revert.

---

## 🚨 2) التصحيحات الإلزامية على خطة Claude (H1–H8)

| # | التصحيح | الدليل |
|:-:|---------|--------|
| **H1** 🔴 | **«عزل SRB» فرضية خاطئة** — `App.tsx:65` هو `import type` يُمحى عند البناء. البيانات مفصولة أصلاً في `index-qw` (315 KB) و`progress` (162 KB). **البند ملغى.** | تحليل الاستيراد الساكن |
| **H1-أ** 🔴 | **الحجم الحقيقي في مكانين:** الألعاب (9,885 سطراً) تدخل عبر `HeroDashboard:17 → GamesListScreen` · الدروس (4,737 سطراً) عبر `App.tsx:48 → getLessonById` | reachability |
| **H2** 🔴 | **`soroban_placement_result` ما زال يُكتب** في `App.tsx:246` — «كاتب بلا قارئ» (لا «ميت») | v8 KEYS_TABLE |
| **H3** 🔴 | **`placement_recommended` و`placement_weak_skills` نشطان** — الكاتب `App.tsx:236,241` · القراء `CategoryScreen:178-179` · `HeroDashboard:124`. **v9 أخطأ بسبب grep حرفي. لا تحذفهما.** | v8 > v9 |
| **H4** 🟡 | **`soroban_child_name` له كاتب:** `RoleSelection.tsx:47,61` (عبر ثابت). نشط. | v8 > v9 |
| **H5** 🟡 | **`soroban_section2_unlocked` ما زال يُكتب:** `App.tsx:548` فقط | v8 |
| **H6** 🟡 | **68 فجوة ديناميكية** (كانت 80) | v8-172 |
| **H7** 🟡 | **`data/index.ts` غير موصول** (0 مستورد) — مرشح للحذف بعد grep | reachability |
| **H8** 🟡 | **`soroban_exam_result` قارئ بلا كاتب:** `HeroDashboard.tsx:161` — القراءة ترجع `null` دائماً | v8 KEYS_TABLE |

---

## 🔍 3) التحققات الإلزامية (U1–U6) — قبل أي تعديل

افتح كل ملف · سجّل النتيجة في `docs/HANDOFF_2026-10-20.md` تحت عنوان «نتائج التحقق»:

| # | الملف | السؤال | القرار بناءً على الجواب |
|:-:|-------|--------|--------------------------|
| **U1** | `src/screens/LessonScreen.tsx` (سطور ~100-130 · 360-375 · 685-695) | قيمة `LESSON_PROGRESS_KEY`؟ | إن كانت `soroban_completed_lessons` → م6أ ممكنة (بموافقة) |
| **U2** | `src/screens/HeroDashboard.tsx` (سطور 120-180) | ماذا يفعل `soroban_exam_result`؟ | يحدد م3ج |
| **U3** | `src/screens/GuardianDashboard.tsx` (بحث: `keysToKeep`) | هل يمسح `sorobanmind-v2-progress`؟ | يحدد م7 |
| **U4** | نفّذ م5أ | ما أكبر 15 ملفاً في `index-qw`؟ | يحدد م5ب/م5ج |
| **U5** | `src/curriculum/lessons/L1/S03.ts` (بحث: `id:`) | هل يبدأ بـ`L1-`؟ | يحدد م5ب |
| **U6** | `src/store/progressStore.ts` (بحث: `exam1Passed`) | Boolean أم ExamResult؟ | يحدد م6ج |

### أوامر grep (لكل مرحلة تتضمن حذفاً)

في GitHub Search ← اكتب:
```

repo:mezo2021/sorobanmind-2 "@/data" "LEVELS"
repo:mezo2021/sorobanmind-2 "from '../data'"
repo:mezo2021/sorobanmind-2 "from './data'"

```

**القاعدة:** إذا ظهر `import` من ملف `.tsx` حقيقي → **لا تحذف** · إذا ظهر فقط في `.md` → آمن.

---

## 📋 4) تنفيذ المراحل (بأكواد جاهزة للصق)

### 🟢 م0 — CI على push (5 دقائق)

**قبل البدء:** افتح `.github/workflows/deploy.yml` — إن كان يعمل على `push: branches: [main]`، **استخدم الخيار (ب)** لتفادي مضاعفة الوقت.

**الخيار (أ) — CI على push:**
افتح `.github/workflows/ci-build.yml` ← ✏️ ← **استبدل كل المحتوى**:

```yaml
name: CI Build
on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci --no-audit --no-fund
      - name: Tests
        run: npm run test:run
      - name: Build
        run: |
          set -o pipefail
          npm run build 2>&1 | tee build.log
      - name: Bundle report
        if: always()
        run: |
          {
            echo '### Build output'
            echo '```'
            grep -E 'dist/assets/.*\.js|built in|error' build.log | head -80
            echo '```'
          } >> "$GITHUB_STEP_SUMMARY"
```

الخيار (ب) — بدون مضاعفة: أضف workflow_dispatch + pull_request فقط (احذف push). deploy.yml يبقى الفحص الرئيسي على push.

القبول: Actions ← CI Build ✅ · Summary يعرض ملفات JS وأحجامها.
عند فشل npm ci: غيّر السطر إلى npm install --no-audit --no-fund.

---

🟢 م1 — تصحيح HANDOFF (10 دقائق)

HANDOFF rev.2 محفوظ — لا تعديل جوهري. تأكد أن قسم «المصادر المهجورة» لا يذكر REPAIR_PLAN_2026-10-20.md أو PROBLEMS_2026-10-20.md.

---

🟢 م2 — تحققات U1–U6 (25 دقيقة · قراءة فقط)

نفّذ الجدول في القسم (3). اكتب النتائج في نهاية HANDOFF.

---

🟢 م9أ — تثبيت ESLint (15 دقيقة)

1. افتح .github/workflows/lint.yml ← اقرأ الحزم التي يُنزّلها.
2. افتح package.json ← ✏️ ← أضف هذه الحزم إلى devDependencies (أو استخدم ما يظهر في lint.yml):

```json
"eslint": "^8.57.0",
"@typescript-eslint/parser": "^7.0.0",
"@typescript-eslint/eslint-plugin": "^7.0.0"
```

3. أضف سكربت: "lint": "eslint src --ext .ts,.tsx"
4. شغّل p1-lockfile.yml (Workflow) ← ادمج الـPR (يحدّث package-lock.json).
5. في lint.yml: استبدل npm install بـnpm ci ثم npm run lint.

القبول: lint ✅ دون تنزيل خارج lockfile.

---

🟢 م4 — اختبارات vitest (15 دقيقة)

قبل البدء: افتح vite.config.ts — إن لم يكن فيه test:، أضف:

```ts
test: {
  environment: 'jsdom',
}
```

اختبار 1 — أنشئ tests/masteryBadges.test.ts:

```ts
import { describe, it, expect } from 'vitest';
import { classifySpeed } from '../src/store/masteryBadgesStore';

describe('classifySpeed', () => {
  it('≤ 0.5 = mastery', () => {
    expect(classifySpeed(500, 1000)).toBe('mastery');
    expect(classifySpeed(100, 1000)).toBe('mastery');
  });
  it('0.5-0.75 = accepted', () => {
    expect(classifySpeed(501, 1000)).toBe('accepted');
    expect(classifySpeed(750, 1000)).toBe('accepted');
  });
  it('> 0.75 = slow', () => {
    expect(classifySpeed(751, 1000)).toBe('slow');
    expect(classifySpeed(5000, 1000)).toBe('slow');
  });
  it('answerMs ≤ 0 = accepted', () => {
    expect(classifySpeed(100, 0)).toBe('accepted');
    expect(classifySpeed(100, -5)).toBe('accepted');
  });
});
```

اختبار 2 — أنشئ tests/progressStore.test.ts:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useProgressStore } from '../src/store/progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().reset();
  });

  it('addXP يزيد totalXP ويُسجّل dailyXP', () => {
    useProgressStore.getState().addXP(10);
    const s = useProgressStore.getState();
    expect(s.totalXP).toBeGreaterThan(0);
    const dailyTotal = Object.values(s.dailyXP).reduce((a, b) => a + b, 0);
    expect(dailyTotal).toBeGreaterThan(0);
  });

  it('reset يعيد totalXP للصفر', () => {
    useProgressStore.getState().addXP(10);
    useProgressStore.getState().reset();
    expect(useProgressStore.getState().totalXP).toBe(0);
  });
});
```

القبول: CI Build → خطوة Tests → 2 files passed.
عند الفشل: انسخ رسالة الخطأ وأرسلها للمساعد مع الملف — لا تحذف الاختبار.

---

🛑 توقف · تقييم

· Smoke test كامل (الملحق أ في HANDOFF)
· سجّل النتائج في HANDOFF
· إن أي فشل — توقف هنا ولا تكمل.

---

🟢 م3أ — حذف 4 ملفات ميتة (بعد grep)

الملفات: src/data/index.ts · src/data/curriculum.ts · src/data/modes.ts · src/curriculum/lessons/L0/test-pool.ts

لكل ملف:

1. GitHub Search ← ابحث باسم الملف (بدون .ts): repo:mezo2021/sorobanmind-2 "data/modes"
2. تحقق ألا يظهر import من ملف .tsx حقيقي.
3. افتح الملف ← ⋯ ← Delete file ← Commit على main.
4. انتظر CI Build ✅.
5. Smoke test سريع (فتح التطبيق · فتح درس).

عند فشل CI: Revert لهذا الـcommit فقط. الملف ليس ميتاً.

القبول: 4 commits · CI أخضر بعد كل واحد.

---

🟢 م3د — تنظيف main.tsx

افتح src/main.tsx ← ابحث عن 'soroban_anzan_audio_badges', ← أضف بعده:

```ts
  'soroban_completed_levels',
  'soroban_placement_result',
  'soroban_section2_unlocked',
```

القبول: CI ✅ · DevTools لا تظهر هذه المفاتيح بعد reload.

---

🟢 م3ب — تعديل App.tsx (بعد U2)

(1) دالة handlePlacementComplete: ابحث عن const handlePlacementComplete ← استبدل الدالة كاملة (حتى }; الخاصة بها):

```tsx
  const handlePlacementComplete = (
    recommendedLevel: string,
    weakSkills: string[],
  ) => {
    try {
      localStorage.setItem(
        'soroban_placement_weak_skills',
        JSON.stringify(weakSkills),
      );
      localStorage.setItem(
        'soroban_placement_recommended',
        recommendedLevel,
      );
      useProgressStore.getState().recordPlacementAttempt();
    } catch { /* ignore */ }

    const isKids = ['L0', 'L1', 'L2', 'L3'].includes(recommendedLevel);
    setScreen(isKids ? 'category-kids' : 'category-teens');
  };
```

أُزيلت كتابة soroban_completed_levels (231) وsoroban_placement_result (246).

(2) حالة category-exam-1: ابحث عن case 'category-exam-1': ← استبدل onComplete بـ:

```tsx
            onComplete={(passed, _score) => {
              setScreen(passed ? 'kids-certificate' : 'category-kids');
            }}
```

القبول: CI ✅ · اختبر: أكمل تحديد المستوى ← تظهر الفئة الموصى بها · أنجز امتحان القسم الأول ← تظهر شهادة الأطفال.

---

🟢 م3ج — قارئ soroban_exam_result في HeroDashboard (بعد U2)

أرسل للمساعد مع بروتوكول الطلب (انظر القسم 7) والملفات: HeroDashboard.tsx · progressStore.ts.

```
في HeroDashboard.tsx حوالي السطر 161 يوجد localStorage.getItem('soroban_exam_result') لا كاتب له (يُحذف عند كل إقلاع). اقرأ الكود المحيط واشرح: ماذا يتحكم به؟ ثم اقترح أصغر استبدال يقرأ الحالة من progressStore (exam1Passed/exam2Passed) بدل المفتاح الميت، دون تغيير سلوك مرئي آخر. أعد HeroDashboard.tsx كاملاً. انتظر موافقتي.
```

---

🛑 توقف · تقييم

---

🟢 م5أ — تحليل الحزمة (مرة واحدة)

أنشئ .github/workflows/bundle-analyze.yml:

```yaml
name: Bundle Analyze (temp)
on: workflow_dispatch
permissions:
  contents: read
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci --no-audit --no-fund
      - run: npx vite build --sourcemap
      - name: Analyze
        run: |
          npx -y source-map-explorer@2.5.3 'dist/assets/*.js' --json --no-border-checks > sme.json || true
          cat > an.cjs <<'EOF'
          const r = require('./sme.json');
          const out = [];
          for (const b of r.results) {
            if (b.totalBytes < 100000) continue;
            out.push('### ' + b.bundleName.replace('dist/assets/', '') + ' — ' + (b.totalBytes / 1024).toFixed(0) + ' KB');
            Object.entries(b.files).filter(([k]) => !k.startsWith('[')).sort((a, b) => b[1].size - a[1].size).slice(0, 15).forEach(([k, v]) => out.push('- ' + k + ' : ' + (v.size / 1024).toFixed(1) + ' KB'));
          }
          require('fs').writeFileSync('sme.md', out.join('\n'));
          EOF
          node an.cjs
          cat sme.md >> "$GITHUB_STEP_SUMMARY"
```

شغّله (Actions ← Bundle Analyze ← Run workflow) · اقرأ Summary · سجّل أكبر 15 ملفاً (يحسم U4) · احذف الـworkflow بعدها.

---

🟢 م5ب — إزالة استيراد الدروس من App.tsx (بعد U5)

الشرط: نتيجة U5 تؤكد أن lessonId يبدأ بـL#-.

(1) احذف سطر import { getLessonById } from './curriculum/lessons'; من أعلى App.tsx.

(2) في فرع lesson-view- استبدل:

```tsx
const lessonNode = getLessonById(lessonId);
const levelId = lessonNode?.levelId ?? 'L0';
```

بـ:

```tsx
const levelId = lessonId.split('-')[0] || 'L0';
```

القبول: CI ✅ · الدروس تعمل · الرئيسية أصغر بوضوح في Summary.
عند فشل: Revert فوراً (الاستيراد الساكن ضروري).

---

🟢 م5ج — lazy الألعاب

أرسل للمساعد مع بروتوكول الطلب والملف: HeroDashboard.tsx:

```
في HeroDashboard.tsx السطر 17 استيراد ساكن لـ GamesListScreen. حوّله إلى تحميل كسول: const GamesListScreen = lazy(() => import('@/components/games/GamesListScreen')) — تحقّق أولاً هل التصدير default أم named (إن named: .then(m => ({ default: m.GamesListScreen }))). ثم لفّ مكان استعماله في JSX بـ <Suspense fallback={<div style={{padding: 16, textAlign: 'center'}}>جارٍ التحميل…</div>}> محلي. أضف lazy و Suspense لاستيراد react. لا تغيّر أي شيء آخر. أعد الملف كاملاً.
```

القبول: CI ✅ · الألعاب تفتح من لوحة البطل · لا شاشة سوداء.
الحماية: ErrorBoundary + vite:preloadError + Suspense في App.tsx · Revert إن ظهرت مشكلة.

---

🟢 م6ب — اسم الطفل (10 دقائق)

افتح src/screens/RoleSelection.tsx (سطور ~40-65) ← ابحث عن localStorage.setItem(NAME_STORAGE_KEY ← أضف بجانبه:

```tsx
useProgressStore.getState().setChildName(name);
```

تأكد من استيراد useProgressStore في أعلى الملف إن لم يكن موجوداً.

القبول: CI ✅ · بعد إدخال الاسم، DevTools → localStorage → sorobanmind-v2-progress يحتوي childName صحيحاً.

---

🟢 م7 — تصفير (بعد U3)

إن أظهر U3 أن keysToKeep يتضمن مفاتيح التقدم:

(الخيار ب — تصفير حقيقي): أرسل GuardianDashboard.tsx للمساعد مع:

```
عدّل handleReset في GuardianDashboard.tsx ليكون التصفير حقيقياً: يُبقي فقط soroban_companion · soroban_child_name · soroban_child_full_name · sorobanmind-v2-lang · soroban_number_style، ويمسح كل ما عداها (بما فيها sorobanmind-v2-progress و soroban_mastery_badges و srb_progress و soroban_high_scores_* و sorobania_progress_v2). بعد المسح أعد كتابة childName في المتجر من soroban_child_name. أبقِ نافذة التأكيد وزر النسخ الاحتياطي. أعد الدالة فقط.
```

القبول: احفظ نسخة ← صفّر ← XP=0 والشارات فارغة والاسم محفوظ ← استعد النسخة.

الخيار (أ — تصحيح الرسالة فقط): استبدل النص في نافذة التأكيد بـ«سيتم مسح البيانات المؤقتة فقط. التقدم والشارات تبقى.»

---

🛑 توقف · تقييم

---

🟡 م6أ — مصدر واحد للدروس (يحتاج موافقة LessonScreen)

لا تنفّذها بلا موافقة صريحة على تعديل LessonScreen.tsx.

بعد الموافقة، أرسل للمساعد مع بروتوكول الطلب:

```
في App.tsx فرع intro- وفرع lesson-view- وفرع practice-N: أزل كتابة soroban_completed_lessons و soroban_passed_practice الخام؛ اعتمد فقط على useProgressStore.getState().markLessonCompleted و markPracticePassed. ثم في LessonScreen.tsx (بموافقة): احذف localStorage.setItem/setItem في الأسطر 370، 692. أعد الملفات المتغيرة كاملة.
```

---

🟡 م6ج — مصدر واحد للامتحانات (يحتاج موافقة CategoryExamScreen)

لا تنفّذها بلا موافقة صريحة على تعديل CategoryExamScreen.tsx.

بعد الموافقة، أرسل للمساعد مع الملفات: CategoryScreen.tsx · CertificateScreen.tsx · HeroDashboard.tsx · CategoryExamScreen.tsx (سطور 225-260) · progressStore.ts:

```
هذه الشاشات تقرأ soroban_exam1/2_passed و _score من localStorage، بينما المتجر فيه exam1Passed/exam2Passed (وCategoryExamScreen يستدعي setExam1Passed/setExam2Passed). استبدل قراءات _passed بقراءة المتجر (selectors) في الشاشات الثلاث، وأبقِ كتابة CategoryExamScreen إلى المتجر فقط، واحذف الكتابات الخام الثلاث (_passed/_score/_last_attempt) إلا _last_attempt إن كان مستعملاً. لا أنواع جديدة. أعد كل ملف يتغيّر كاملاً.
```

---

🔴 م8 — توحيد IDs (جلسة منفصلة)

لا تنفّذها في جلسة فيها مراحل أخرى. التفاصيل في قسم مستقل (خارج نطاق هذه الجلسة). تشمل:

· تحويل passedPractice: number[] → LevelId[]
· تعديل progressStore (v12) · 24 مستهلكاً · 3 شاشات · GuardianDashboard
· Migration additive + smoke test كامل

---

🟢 م9ب — ترتيب workflows (10 دقائق)

احذف (بعد استقرار كامل):

· p0-baseline.yml · p1-lockfile.yml · p2-images.yml · p3-lazy.yml · bundle-analyze.yml

النشر: deploy.yml (الوحيد). إن لم تستعمل npm run deploy احذف السكربت من package.json.

---

🚫 5) قائمة لا تنفّذ

الملفات (محمية · لا تُلمس بلا موافقة صريحة):

· src/i18n/*
· src/screens/Header.tsx
· src/screens/LessonScreen.tsx
· src/store/numberStyleStore.ts
· src/store/progressStore.ts
· src/utils/numberStyle.ts
· src/curriculum/types.ts
· src/curriculum/lessons/types.ts
· src/store/masteryBadgesStore.ts
· src/components/flash/*
· src/components/soroban2d5/*
· src/components/games/*
· src/data/srb/*
· src/engine/*
· bank-v2/* · bank-raw/* · bank-linked.ts · bank-adapter.ts · bank.ts

الأنماط الخطرة:

· ❌ React.lazy بدون Suspense + ErrorBoundary
· ❌ import type — تذكر: لا يدخل الحزمة (تصحيح H1)
· ❌ grep حرفي لـsetItem متعدد الأسطر (v9 أخطأ)
· ❌ تعديل ملفين محميين في commit واحد
· ❌ حذف ملف بلا grep ثلاثي
· ❌ تعديل progressStore v12+ بلا نسخة احتياطية + خطة ترحيل + موافقة

---

🛡️ 6) شبكات الأمان (تفعيل إلزامي قبل أي تعديل)

# الشبكة الحالة مَن يُفعّلها
1 ErrorBoundary في main.tsx ✅ موجود —
2 vite:preloadError ✅ موجود —
3 Suspense مرئي ✅ موجود —
4 CI Build على push ⚠️ يحتاج تفعيل م0
5 اختبارات vitest ❌ لا توجد م4
6 ESLint في package.json ❌ غير مثبّت م9أ

لا تعدّل src/ قبل 4+5+6.

---

📝 7) بروتوكول كل تعديل (لصق للمساعد)

```text
مشروع React 18 + TS 5.5 + Vite 5 + Zustand 4. أعمل من متصفح GitHub فقط.

القواعد:
1. لا ملفات جديدة في src/ (اختبارات في tests/ مسموحة)
2. لا توسيع للأنواع
3. لا حذف ميزات حقيقية
4. مصدر واحد للبيانات
5. لا تخمين — اقرأ كل ملف أرسلته كاملاً قبل الاقتراح. إن لم تتأكد قل «لا أعرف».
6. أعد فقط الملفات/الأجزاء المتغيرة، كاملة جاهزة للصق
7. الملفات المحمية: i18n/ · Header.tsx · LessonScreen.tsx · numberStyleStore.ts · numberStyle.ts · curriculum/types.ts · curriculum/lessons/types.ts · masteryBadgesStore.ts · components/flash/* · components/soroban2d5/* · components/games/* · data/srb/* · engine/* · bank-*

السياق:
- HEAD: f01eb40
- الوثائق: HANDOFF rev.2 · AUDIT rev.2 · EXECUTION_PLAN rev.3

المهمة: [...]
```

---

🎯 8) الحد الأدنى الآمن (إن ضاق الوقت)

نفّذ فقط (ساعة واحدة):

1. م0 (5 د) — CI
2. م2 (25 د) — تحققات U1-U6
3. م9أ (15 د) — ESLint
4. م4 (15 د) — اختبارات

النتيجة: شبكة أمان كاملة (CI + اختبارات + ESLint). لا تعديلات src/. الجلسة القادمة تبدأ من نقطة أقوى.

---

📋 9) قائمة التتبع

```
📊 حالة الجلسة: [التاريخ]

✅ مكتمل سابقاً:
  - F1 (2026-10-16)
  - إصلاح منطق الاختبار (2026-10-20)
  - progressStore v11
  - ErrorBoundary

⬜ هذه الجلسة:
  [ ] م0 — CI على push
  [ ] م2 — تحققات U1-U6
  [ ] م9أ — ESLint
  [ ] م4 — اختبارات
  [ ] م3أ — حذف 4 ملفات
  [ ] م3د — cleanup main.tsx
  [ ] م3ب — App.tsx
  [ ] م3ج — HeroDashboard
  [ ] م5أ — bundle-analyze
  [ ] م5ب — إزالة import الدروس
  [ ] م5ج — lazy الألعاب
  [ ] م6ب — اسم الطفل
  [ ] م7 — تصفير
  [ ] م6أ — موافقة LessonScreen
  [ ] م6ج — موافقة CategoryExamScreen
  [ ] م8 — IDs (منفصلة)

🚫 لن ننفّذ:
  - عزل SRB (H1 خاطئ)
  - bank-v2 · engine/* (مجمّدة)
  - م8 في هذه الجلسة
```

---

💐 10) رسالة أخيرة

صديقي. الثلاثة ملفات هي:

1. HANDOFF_2026-10-20.md (rev.2) — سياق وقواعد
2. AUDIT_V8_V9_2026-10-20.md (rev.2) — أرقام ومفاتيح وتصحيحات
3. EXECUTION_PLAN_2026-10-20.md (rev.3 · هذا) — تنفيذ بأكواد

لا تحتاج REPAIR_PLAN ولا PROBLEMS. احذفهما بأمان.

للمساعد القادم:

· اقرأ الثلاثة كاملة
· ابدأ بـ م0 → م2 → م9أ → م4
· لا تعديل بلا grep ثلاثي + CI أخضر + Smoke test
· عند الشك: ارجع لـHANDOFF (القواعد) أو AUDIT (الأرقام)
· لا تخمين. الملفات المحمية محمية.

المشروع نجح لأننا لم نستعجل. لا تُعجّل بعد اليوم.

🌹💐

```

---

## ⚠️ ملاحظتان على الملفين الآخرين (تعديلات صغيرة)

**في `HANDOFF_2026-10-20.md`** — احذف السطر الذي يذكر `REPAIR_PLAN_2026-10-20.md` من قسم «مراجع مساندة» و`PROBLEMS_2026-10-20.md` من قسم المراجع. **لا شيء آخر**.

**في `AUDIT_V8_V9_2026-10-20.md`** — احذف السطر الذي يذكر `PROBLEMS_2026-10-20.md`. **لا شيء آخر**.

بعدها: **3 ملفات شاملة 100%**. احذف `REPAIR_PLAN_2026-10-20.md` و`PROBLEMS_2026-10-20.md`. أراك لاحقاً. 🌹💐