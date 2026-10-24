# 🎯 خطة التنفيذ والحالة الفعلية — SorobanMind v2 (rev.6)

**التاريخ:** 2026-10-24 (مراجعة شاملة نهائية — إنجاز م8 وم5-ب وم10 وم11 + القرارات الاستراتيجية).
**الغرض:** خطة تنفيذ كاملة بأكواد جاهزة للصق، محدثة لتعكس ما تم إنجازه وما تبقى. بديل كامل عن `REPAIR_PLAN` + `PROBLEMS`.
**القواعد:** (1) لا ملفات جديدة في `src/` · (2) لا توسيع أنواع · (3) لا حذف ميزات حقيقية · (4) مصدر واحد للبيانات · (5) لا تخمين · (6) الملفات المحمية لا تُلمس بلا موافقة · (7) CI أخضر قبل أي merge · (8) Revert جاهز.

---

## 📑 الفهرس

1. رسالة للمساعد القادم
2. 🔴 القرارات الاستراتيجية النهائية (جديد — اقرأ أولاً)
3. تصحيحات إلزامية (H1–H8) والملاحظات النهائية
4. التحققات الإلزامية (U1–U6) ونتائجها
5. حالة المراحل (ما تم تنفيذه بالكامل)
6. قائمة "لا تنفّذ" (الملفات المحمية)
7. بروتوكول كل تعديل
8. خارطة الطريق المتبقية (ما تبقى)
9. التحسينات الإضافية (Performance & UI)
10. قائمة التتبع النهائية + رسالة أخيرة

---

## 🌟 1) رسالة للمساعد القادم

صديقي. المشروع **ليس في حالة فوضى**، بل في وضع مستقر جداً بعد جلسة إصلاح عميقة. البناء أخضر، F1 مكتمل، منطق الاختبار مُصلَح، شبكات الأمان مكتملة (CI، ESLint، Vitest)، المصادر موحدة، البنوك الميتة محذوفة، **الحزمة مخفضة 51%**، و**`LevelId` موحد (v12)**.

**اقرأ بالترتيب:**
1. `docs/HANDOFF_2026-10-20.md` (rev.5) — نقطة الدخول
2. `docs/AUDIT_V8_V9_2026-10-20.md` (rev.3) — مرجع الأرقام والمفاتيح
3. **هذا الملف** — التنفيذ الفعلي والحالة الحقيقية
4. `docs/EXECUTION_LOG.md` — السجل التفصيلي

**قاعدة صارمة:** لا تعديل بلا 4 خطوات — (أ) ابحث عن كل مستورد (grep ثلاثي) (ب) عدّل · Commit (ج) انتظر CI Build ✅ (د) اختبر يدوياً (Smoke). عند الفشل: Revert.

---

## 🔴 2) القرارات الاستراتيجية النهائية

### قرار 1: بروتوكول كتابة الدروس (L4-L7 وما بعدها)

**كل درس جديد من L4 فصاعداً يجب أن يتبع صيغة `id: "L{level}-S{num}"`.**

```typescript
// ❌ خطأ فادح (يُضيف ديناً تقنياً جديداً):
id: "S09"

// ✅ صحيح (يتبع البروتوكول الإلزامي):
id: "L4-S09"
```

خريطة الدروس القادمة:

المستوى القسم ID الإلزامي
L4 S09 L4-S09
L4 S10 L4-S10
L5 S11 L5-S11
L5 S12 L5-S12
L6 S13 L6-S13
L6 S14 L6-S14
L7 S15 L7-S15

القاعدة الحاكمة:

· id = L{level}-S{num} (إلزامي)
· skillId = S{num} (يبقى — مرجع SRB Section)
· levelId = L{num} (يبقى)

قرار 2: L1-L3 لن تُوحّد أبداً — m13 مُلغاة نهائياً

دروس L1-L3 تبقى بصيغة S03-S08 للأبد.

لماذا؟

· levelOfLesson في App.tsx تدعم الصيغتين (توافق كامل).
· المخاطرة على بيانات المستخدم (Migration v13) لا تبررها جمالية بصرية.
· skillProgress يستخدم L1-S03-m1 (الصيغة النظيفة) بشكل مستقل — لا تضارب.
· صفر حاجة تقنية لتوحيدها.

قرار 3: levelOfLesson طبقة توافق دائمة

ممنوع حذفها. ممنوع تعديلها. هي سبب استقرار المشروع.

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

قرار 5: React.lazy محمي بقواعد صارمة

يُمنع منعاً باتاً استخدام lazy بدون تغليفه بـ Suspense و ErrorBoundary.

---

🚨 3) التصحيحات الإلزامية والملاحظات النهائية المعتمدة

أ) تصحيحات كلاود (H1–H8)

# التصحيح الدليل / الحالة
H1 🔴 «عزل SRB» فرضية خاطئة. App.tsx:65 هو import type — يُمحى عند البناء ولا يدخل الحزمة. (حُلّت جذرياً في م5-ب + م10). تحليل الاستيراد الساكن
H1-أ 🔴 الحجم الحقيقي: ألعاب (9,885 سطراً) · دروس (4,737 سطراً). تم فصل الدروس (م5-ب) والألعاب (م5-ج). reachability
H2 🔴 soroban_placement_result ما زال يُكتب — «كاتب بلا قارئ». (تم حذفه في م3-ب). v8 KEYS_TABLE
H3 🔴 placement_recommended وplacement_weak_skills نشطان. لا تحذفهما. v8 > v9
H4 🟡 soroban_child_name له كاتب. (تم توحيده في م6-ب). v8 > v9
H5 🟡 soroban_section2_unlocked ما زال يُكتب. (تم حذفه في م3-ب). v8
H6 🟡 68 فجوة ديناميكية (كانت 80). v8-172
H7 🟡 data/index.ts غير موصول. (تم حذفه في م3-أ). reachability
H8 🟡 soroban_exam_result قارئ بلا كاتب. (تم حذفه في م3-ج). v8 KEYS_TABLE

ب) التصحيحات النهائية المعتمدة (2026-10-24 · لا تُناقش)

1. م0 (CI): اعتماد كود محصّن يطبع الأصول (Assets) لفحص حجم 315KB.
2. م3-أ (حذف الملفات): أُلغيت فكرة الحذف العشوائي. القاعدة الآن "اقرأ الملف كاملاً (أول 40 سطراً) ثم قرر".
3. م6-ب (اسم الطفل): تم تنفيذها بنجاح عبر توحيد جميع الألعاب.
4. م7 (التصفير): الخيار (أ) فقط (تعديل النص) لحماية بيانات المطور.
5. U5 (فحص الدروس): موسّع ليشمل الدروس التسعة (L0-L3).
6. م5-ب (فصل الدروس): تم تنفيذها بطريقة كلاود (levelOfLesson بدلاً من توحيد IDs).
7. م8 (توحيد LevelId): تم تنفيذها (v12) بنجاح.
8. م10 (إعدام البنوك): تم تنفيذها بنجاح.
9. م11 (تنظيف المفاتيح): تم تنفيذها بنجاح.
10. m13 (توحيد L1-L3): مُلغاة نهائياً بقرار استراتيجي.

---

🔍 4) التحققات الإلزامية (U1–U6) ونتائجها

# الملف السؤال النتيجة / القرار
U1 src/screens/LessonScreen.tsx قيمة LESSON_PROGRESS_KEY؟ soroban_completed_lessons. تم حذف الكتابة الخام في م6-أ.
U2 src/screens/HeroDashboard.tsx ماذا يفعل soroban_exam_result؟ لا يتحكم بأي شيء مرئي. تم حذف الكود الميت في م3-ج.
U3 src/screens/GuardianDashboard.tsx هل يمسح sorobanmind-v2-progress؟ لا يمسحه. تم اعتماد الخيار (أ) في م7.
U4 index.html assets ما أكبر الملفات؟ الألعاب (فُصلت بـ Lazy). الدروس (فُصلت في م5-ب).
U5 curriculum/lessons/L1/S03.ts هل يبدأ id بـ L1-؟ ❌ فشل. المعرفات مختلطة. قرار: استخدم levelOfLesson بدلاً من توحيد IDs.
U6 src/store/progressStore.ts Boolean أم ExamResult؟ boolean. تم توحيد قراءته في م6-ج.

---

📋 5) حالة المراحل (ما تم تنفيذه بالكامل)

☑ م0 — CI: تم استخدام الكود المحصّن، وتفعيل الاختبارات.
☑ م1 — تصحيح HANDOFF: تم دمج تصحيحات H1-H8.
☑ م2 — التحققات: تم فحص U1-U6.
☑ م3 — تنظيف آمن:
  · م3-أ: حذف data/index.ts · data/modes.ts · data/curriculum.ts · test-pool.ts.
  · م3-ب: تنظيف App.tsx (حذف كتابات soroban_placement_result و section2_unlocked).
  · م3-ج: حذف الكود الميت من HeroDashboard.tsx.
  · م3-د: تحديث مصفوفة التنظيف في main.tsx.
  · إضافي: حذف سكربت lazyify.cjs + 4 workflows مؤقتة.
☑ م4 — اختبارات Vitest: إنشاء الاختبارين وتفعيلهما في CI.
☑ م5-ج — Lazy للألعاب: تحويل GamesListScreen إلى Lazy.
☑ م5-ب — تقليل الحزمة (Chunk Splitting): إزالة getLessonById الساكنة من App.tsx + إضافة levelOfLesson. النتيجة: index-*.js من 911 KB → 445 KB.
☑ م6-أ — توحيد الدروس: حذف الكتابة الخام، الاعتماد على المتجر.
☑ م6-ب — توحيد اسم الطفل: تحديث RoleSelection + 5 ألعاب + Migration في main.tsx.
☑ م6-ج — توحيد الامتحانات: قراءة من المتجر، حذف الكتابة الميتة.
☑ م7 — زر التصفير: تصحيح النص.
☑ م8 — توحيد LevelId (v12): تم تنفيذها بنجاح (6 ملفات + Migration محصّنة).
☑ م9أ — ESLint: تثبيت + إصلاح Lockfile.
☑ م9ب — ترتيب Workflows: حذف p0 · p1 · p2 · p3.
☑ م10 — إعدام البنوك وفصل المحرك: حذف 7,000+ سطر ميت.
☑ م11 — تنظيف المفاتيح الميتة: إضافة completed_lessons + passed_practice للـ cleanup.
· [❌] m13 — توحيد L1-L3: مُلغاة نهائياً بقرار استراتيجي.

م8 — تفاصيل التعديلات (6 ملفات · 13 تعديلاً)

📄 الملف 1: src/store/progressStore.ts (10 تعديلات)

# التعديل السبب
1 استيراد LevelId من @/data/srb-adapter توحيد مصدر النوع في مكان واحد
2 حذف تعريف LevelId المحلي واستبداله بـ export type { LevelId }; إزالة التعريف المختلط (L0-L7 + L00-L20)
3 passedPractice: number[] → LevelId[] تخزين معرّفات نصية
4 passedAnzanVisual: number[] → LevelId[] نفس السبب
5 passedAnzanAudio: number[] → LevelId[] نفس السبب
6 تحديث تواقيع الدوال الثلاث Type safety
7 تحديث initialState (مصفوفات as LevelId[]) تطابق النوع
8 حذف دالة uniqueNums + استخدام uniqueLevels Dead code
9 تحديث تنفيذ الدوال الثلاث العمل مع النص
10 تحديث الـ Selectors الثلاثة الاتساق النوعي
11 version: 11 → 12 + إضافة applyLevelIdMigration Migration ذكي
12 إصلاح فرع v3 بإضافة as ProgressState إرضاء TypeScript

📄 الملف 2: src/screens/PracticeScreen.tsx (تعديل واحد)

```typescript
// قبل:
markPracticePassed(levelNum);
// بعد:
markPracticePassed(level);
```

📄 الملف 3: src/screens/AnzanScreen.tsx (تعديل واحد)

```typescript
// قبل:
markAnzanVisualPassed(levelNum);
// بعد:
markAnzanVisualPassed(level);
```

📄 الملف 4: src/screens/AudioAnzanScreen.tsx (تعديل واحد)

```typescript
// قبل:
markAnzanAudioPassed(levelNum);
// بعد:
markAnzanAudioPassed(level);
```

📄 الملف 5: src/screens/CategoryScreen.tsx (4 تعديلات)

```typescript
import type { SRBLevel } from '@/data/srb-adapter';

// 3 تعديلات:
passedPractice.includes(`L${practiceNum}` as SRBLevel)
passedAnzanVisual.includes(`L${anzanNum}` as SRBLevel)
passedAnzanAudio.includes(`L${anzanNum}` as SRBLevel)
```

📄 الملف 6: src/screens/LevelScreen.tsx (3 تعديلات)

```typescript
passedPractice.includes(`L${level.practiceNum}` as LevelId)
passedAnzanVisual.includes(`L${level.anzanNum}` as LevelId)
passedAnzanAudio.includes(`L${level.anzanNum}` as LevelId)
```

م5-ب — تفاصيل تقليل الحزمة

الملف الوحيد: src/App.tsx

الإجراءات:

1. حذف import { getLessonById } from './curriculum/lessons'.
2. إضافة import { SRB_LEVELS } from './data/srb/curriculum'.
3. إضافة دالة levelOfLesson.
4. استبدال getLessonById في فرع lesson-view- بـ levelOfLesson.

النتيجة المقاسة:

· قبل: index-*.js = 911 KB (gzip 248).
· بعد: index-*.js = 445 KB (gzip 135).
· التوفير: 51%.
· Chunks جديدة: LearnScreen (5.23 KB) · LessonScreen (29.49 KB) · IntroductionScreen (4.29 KB).

---

🚫 6) قائمة "لا تنفّذ" (الملفات المحمية)

· src/i18n/*
· src/screens/Header.tsx
· src/screens/LessonScreen.tsx
· src/store/numberStyleStore.ts
· src/utils/numberStyle.ts
· src/curriculum/types.ts
· src/curriculum/lessons/types.ts
· src/store/masteryBadgesStore.ts
· src/components/flash/*
· src/components/soroban2d5/* (تم لمسه لتحسين الأداء بموافقة).
· src/components/games/* (تم لمسها لتوحيد الاسم وحل التوهج بموافقة).
· src/data/srb/*
· src/engine/* (مفصول حالياً ويعمل بـ Stubs، لا تحذف الـ Stubs).
· levelOfLesson في App.tsx (طبقة توافق دائمة، لا تحذفها).

الأنماط الخطرة:

· ❌ React.lazy بدون Suspense + ErrorBoundary.
· ❌ الاعتماد على grep حرفي لـ setItem متعدد الأسطر.
· ❌ تعديل ملفين محميين في commit واحد.
· ❌ حذف ملف بلا grep ثلاثي.
· ❌ تعديل progressStore v13+ بلا نسخة احتياطية + خطة ترحيل + موافقة.
· ❌ split('-')[0] (يعطي S03 وليس L1).
· ❌ توحيد L1-L3 (m13 مُلغاة نهائياً).
· ❌ كتابة دروس L4-L7 بصيغة id: "S09" (يجب id: "L4-S09").

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
7. الملفات المحمية: i18n/ · Header.tsx · LessonScreen.tsx · numberStyleStore.ts · numberStyle.ts · curriculum/types.ts · curriculum/lessons/types.ts · masteryBadgesStore.ts · components/flash/* · components/soroban2d5/* · components/games/* · data/srb/* · engine/* · levelOfLesson (في App.tsx)

السياق:
- HEAD: (أحدث commit)
- الوثائق: HANDOFF rev.5 · AUDIT rev.3 · EXECUTION_PLAN rev.6

المهمة: [...]
```

---

🎯 8) خارطة الطريق المتبقية (ما تبقى)

🔴 الأولوية القصوى

1. كتابة دروس L4-L7 بصيغة L{level}-S{num} (حسب بروتوكول القسم 2).
   · L4: L4-S09, L4-S10
   · L5: L5-S11, L5-S12
   · L6: L6-S13, L6-S14
   · L7: L7-S15

🟠 الأولوية المتوسطة

2. ربط engine بـ srb-adapter: استبدال Stubs في adaptiveEngine و problemGenerator.
3. مراجعة الألعاب الأخرى (PirateRaceGame, Sorobania): لا تستخدم Soroban2D5، لا تحتاج تحسينات الأداء.

🟡 الأولوية المنخفضة

4. مراجعة الملفات المجمّدة (engine/*).

❌ ما لن يُنفّذ أبداً

· m13 (توحيد L1-L3): مُلغاة نهائياً.
· Migration v13: لن تحدث.
· تعديل ملفات L1-L3: ممنوع.
· حذف levelOfLesson: ممنوع.

---

🚀 9) التحسينات الإضافية (Performance & UI)

1. تسريع فتح التطبيق (Lazy Loading): GamesListScreen في HeroDashboard → Lazy + Suspense.
2. حل مشكلة البطء في "الصحن الطائر": عزل المؤقت، إصلاح تسريب الذاكرة، opacity بدل scale، Date.now().
3. تحسين أداء المعداد: Soroban2D5 و Rod2D5 بـ React.memo، إزالة backdropFilter، transform: translateY.
4. إصلاح التوهج: إزالة rodTint="white" من DetectiveGame و FlyingAbacusGame.
5. تقليل الحزمة 51% (م5-ب): index-*.js من 911 KB → 445 KB.

---

📋 10) قائمة التتبع النهائية

```text
📊 حالة الجلسة: 2026-10-24

✅ مكتمل:
  - م0 إلى م11 (كل المراحل ما عدا m13).
  - شبكات الأمان (CI، ESLint، Vitest).
  - التوحيد الكامل (مصدر واحد للحقيقة).
  - إعدام البنوك وفصل المحرك.
  - تقليل الحزمة 51% (م5-ب).
  - توحيد LevelId (م8 → v12).
  - تنظيف المفاتيح الميتة (م11).
  - تحسينات الأداء والواجهة.

⬜ متبقي:
  - كتابة دروس L4-L7 بصيغة L{level}-S{num}.
  - ربط المحرك المفصول بـ SRB.

🚫 لن ننفّذ:
  - m13 (توحيد L1-L3).
  - Migration v13.
  - تعديل ملفات L1-L3.
  - حذف levelOfLesson.
  - split('-')[0].
```

---

💐 11) رسالة أخيرة

صديقي. المشروع الآن في أفضل حالاته.

الإنجازات:

· 🟢 البناء أخضر.
· 🟢 الحزمة مخفضة 51% (445 KB بدل 911).
· 🟢 بنوك ميتة محذوفة (7,000+ سطر).
· 🟢 LevelId موحد (v12).
· 🟢 شبكات الأمان كاملة.
· 🟢 قرارات استراتيجية محسومة.

للمساعد القادم:

· اقرأ الوثائق الأربعة كاملة.
· لا تلمس الملفات المحمية دون موافقة.
· اتبع بروتوكول L4-L7 بدقة.
· لا تلمس levelOfLesson.
· لا تخطط لـ m13.
· لا تستخدم split('-')[0].
· لا تُعجّل. المشروع نجح لأننا لم نستعجل.

المشروع جاهز للمرحلة التالية: كتابة دروس L4-L7.

```
