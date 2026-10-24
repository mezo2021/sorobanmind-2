# 📝 سجل التنفيذ الحقيقي (Execution Log) — SorobanMind v2

**الغرض:** توثيق شامل لكل خطوة تم تنفيذها في المشروع. يُستخدم كمرجع فوري (Single Source of Truth) لمعرفة أين توقفنا، وما هي الملفات التي تم تعديلها، وحالة CI، لتسهيل استلام مساعد جديد في حال انقطاع الاتصال.
**المرجع الأساسي:** `docs/EXECUTION_PLAN_2026-10-20.md` (rev.5 المحصنة).
**تاريخ آخر تحديث:** 2026-10-24.
**حالة المشروع:** 🟢 مستقر جداً · البناء أخضر · شبكات الأمان مكتملة · بنوك ميتة محذوفة · حزمة مخفضة · قرارات استراتيجية محسومة.

---

## 🔴 القرارات الاستراتيجية النهائية (اقرأ هذا أولاً)

### قرار 1: بروتوكول كتابة الدروس (L4-L7 وما بعدها)
**كل درس جديد من L4 فصاعداً يجب أن يتبع صيغة `id: "L{level}-S{num}"`.**

```typescript
// ❌ خطأ فادح (يُضيف ديناً تقنياً جديداً):
id: "S09"

// ✅ صحيح (يتبع البروتوكول):
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

قرار 2: L1-L3 لن تُوحّد أبداً

m13 مُلغاة نهائياً. دروس L1-L3 تبقى بصيغة S03-S08 للأبد.

لماذا؟

· levelOfLesson في App.tsx تدعم الصيغتين (توافق كامل).
· المخاطرة على بيانات المستخدم (Migration v13) لا تبررها جمالية بصرية.
· skillProgress يستخدم L1-S03-m1 (الصيغة النظيفة) بشكل مستقل — لا تضارب.

قرار 3: levelOfLesson طبقة توافق دائمة

ممنوع حذفها. ممنوع تعديلها. هي سبب استقرار المشروع.

---

📊 لوحة الحالة السريعة (Status Board)

☑ م0 — تقوية CI.
☑ م1 — تصحيح HANDOFF.
☑ م2 — التحققات (U1–U6).
☑ م3 — تنظيف آمن.
☑ م4 — اختبارات vitest.
☑ م5 — الحزمة (Lazy للألعاب + Lazy للدروس).
☑ م6 — مصدر واحد للحقيقة.
☑ م7 — زر التصفير.
☑ م8 — توحيد LevelId (v12).
☑ م9 — ESLint وترتيب workflows.
☑ م10 — إعدام البنوك وفصل المحرك.
☑ م11 — تنظيف المفاتيح الميتة.
☑ م5-ب — تقليل الحزمة عبر إزالة الاستيراد الساكن للدروس.
· [❌] م13 — مُلغاة نهائياً بقرار استراتيجي.

---

🛡️ القواعد الذهبية لأي مساعد قادم (Strict Protocols)

1. لا كود قبل رؤية الملف: يُمنع إرسال أي كود أو تعديل قبل أن يرسل المطور محتوى الملف الحالي كاملاً.
2. الملفات المحمية (Red Zone): لا تُلمس i18n/ · Header.tsx · numberStyleStore.ts · masteryBadgesStore.ts · soroban2d5/ · flash/ · engine/ (المفصول حالياً) · bank-* إلا بموافقة صريحة وخطوة بخطوة.
3. قاعدة الـ Lazy (React.lazy): يُمنع منعاً باتاً استخدام lazy بدون تغليفه بـ Suspense و ErrorBoundary.
4. الاعتماد على CI: لا يتم الدمج أو الانتقال لخطوة جديدة إلا إذا كان البناء (CI Build) أخضر ✅.
5. اقرأ ثم قرر: لا يتم حذف أي ملف أو مفتاح إلا بعد البحث (Grep) ثلاثي والتأكد من عدم استخدامه.
6. المصدر الواحد: المتجر useProgressStore هو المصدر الوحيد للحقيقة (للنقاط، الدروس، الامتحانات، واسم الطفل).
7. قاعدة الدروس الجديدة: أي درس جديد من L4 فصاعداً → id: "L{level}-S{num}" (بدون استثناء).
8. ممنوع split('-')[0]: مع S03 سيعطي S03 وليس L1. استخدم levelOfLesson فقط.

---

🗂️ السجل التفصيلي (Detailed Log)

[2026-10-23] — المرحلة م0: تقوية CI

· الإجراء: تعديل ci-build.yml ليعمل على pull_request و workflow_dispatch. استخدام npm ci لضمان ثبات الحزم.
· الملفات: .github/workflows/ci-build.yml

[2026-10-23] — المرحلة م2: التحققات (U1-U6)

· النتائج الحاسمة:
  1. اكتشفنا أن معرفات الدروس مختلطة (L0-S01 مقابل S03)، مما ألغى فكرة فصل الدروس (م5-ب) آنذاك.
  2. تأكدنا أن قراءة soroban_exam_result في HeroDashboard ميتة تماماً.
  3. تأكدنا أن زر التصفير القديم كان يحمي التقدم الفعلي.

[2026-10-23] — المرحلة م3: التنظيف الآمن

· حذف الملفات الميتة: data/index.ts · data/modes.ts · data/curriculum.ts · curriculum/lessons/L0/test-pool.ts.
· حذف سكربت خطير: scripts/lazyify.cjs (كان سيعيد شاشة التحميل السوداء).
· حذف Workflows مؤقتة: p0-baseline · p1-lockfile · p2-images · p3-lazy.
· تنظيف App.tsx: حذف الكتابات الميتة في handlePlacementComplete و category-exam-1.
· تنظيف main.tsx: إضافة المفاتيح الميتة إلى مصفوفة التنظيف.

[2026-10-23] — المرحلة م4: اختبارات vitest

· الإجراء: إنشاء tests/masteryBadges.test.ts و tests/progressStore.test.ts وتفعيلهما في CI.

[2026-10-23] — المرحلة م6: التوحيد (Single Source of Truth)

· م6-أ (الدروس والتمارين): حذف الكتابة في soroban_completed_lessons و soroban_passed_practice.
· م6-ب (اسم الطفل): تحديث RoleSelection.tsx و 5 ألعاب. إضافة Migration في main.tsx.
· م6-ج (الامتحانات): توحيد قراءة exam1Passed و exam2Passed من المتجر.

[2026-10-23] — المرحلة م7: تصحيح زر التصفير

· الإجراء: تعديل النص التحذيري ليكون صادقاً مع السلوك الفعلي.

[2026-10-24] — المرحلة م8: توحيد LevelId (v12)

الهدف: إزالة نظام v1 (الأرقام) من progressStore نهائياً.

الملفات المعدلة (6):

# الملف طبيعة التعديل
1 src/store/progressStore.ts تحويل الحقول + Migration v12
2 src/screens/PracticeScreen.tsx markPracticePassed(level)
3 src/screens/AnzanScreen.tsx markAnzanVisualPassed(level)
4 src/screens/AudioAnzanScreen.tsx markAnzanAudioPassed(level)
5 src/screens/CategoryScreen.tsx 3× \L${num}`` + استيراد SRBLevel
6 src/screens/LevelScreen.tsx 3× \L${num}` as LevelId`

آلية Migration v12:

· applyLevelIdMigration تُغلِّف كل مسار ترحيل (v3-v11).
· toLevelId ترفض أي قيمة خارج نطاق L0-L7.
· safeMap تتعامل مع مصفوفات تالفة.
· Version bumped من 11 → 12.

التحقق: ✅ CI أخضر · ✅ نسخة احتياطية · ✅ version: 12 · ✅ passedPractice: ["L0","L1","L2"].

[2026-10-23] — المرحلة م9: ESLint والتنظيف

· الإجراء: تثبيت ESLint في package.json، إنشاء .eslintrc.cjs، تحديث lint.yml. إصلاح package-lock.json عبر PR.

[2026-10-24] — المرحلة م10: إعدام البنوك وفصل المحرك

· بتر المحرك: تعديل adaptiveEngine.ts و problemGenerator.ts لوضع Stubs مؤقتة.
· إعدام البنوك: حذف bank.ts (1,201 سطر) · bank-linked.ts · bank-adapter.ts · bank-v2/ · bank-raw/.
· النتيجة: التخلص من 7,000+ سطر ميت.

[2026-10-24] — المرحلة م11: تنظيف المفاتيح الميتة

· الإجراء: إضافة soroban_completed_lessons و soroban_passed_practice إلى مصفوفة التنظيف في main.tsx.
· التحقق: بحث Grep أكد أنهما ميتان (لا قارئ ولا كاتب).
· النتيجة: مسح تلقائي عند أول تحميل بعد النشر.

[2026-10-24] — المرحلة م5-ب: تقليل الحزمة (Chunk Splitting)

الهدف: إخراج ملفات الدروس (4,737 سطر) من الحزمة الرئيسية.

الحل المتبع (بعد استشارة كلاود):

· الملف المعدل: src/App.tsx فقط.
· الإجراء:
  1. حذف import { getLessonById } from './curriculum/lessons'.
  2. إضافة import { SRB_LEVELS } from './data/srb/curriculum'.
  3. إضافة دالة levelOfLesson(lessonId) تدعم الصيغتين.
  4. استبدال getLessonById في فرع lesson-view- بـ levelOfLesson.

النتيجة المقاسة من CI Build:

· قبل: index-*.js = 911 KB (gzip 248 KB).
· بعد: index-*.js = 445 KB (gzip 135 KB).
· التوفير: 51% من حجم الحزمة الرئيسية.
· Chunks جديدة: LearnScreen (5.23 KB) · LessonScreen (29.49 KB) · IntroductionScreen (4.29 KB).

التحقق:

· ✅ CI أخضر.
· ✅ مسار "الرجوع" يعمل في L0، L1، L2.
· ✅ الدروس تُحمَّل عند فتحها فقط.
· ✅ بيانات المستخدم لم تتأثر (لم نلمس progressStore).

لماذا لم نُوحّد L1-L3 (m13)؟

· قرار استراتيجي: الجمالية لا تبرر المخاطرة على بيانات المستخدم.
· levelOfLesson تحل المشكلة تقنياً بشكل كامل.
· m13 ملغاة نهائياً.

[2026-10-24] — التحقق من اجتياز L2 (دليل عملي)

· الاختبار: أكمل المطور جميع مسارات L2 (تمرين · بصري · سمعي · اختبار).
· النتيجة من النسخة الاحتياطية:
  · version: 12 ✅
  · completedLevels: ["L0","L1","L2"] ✅
  · passedPractice: ["L0","L1","L2"] ✅
  · passedAnzanVisual: ["L0","L1","L2"] ✅
  · passedAnzanAudio: ["L0","L1","L2"] ✅
  · L2.test.grade: 100 ✅
  · totalXP: 938 ✅
  · anzanAudioBadges.master_multiplication_audio: true ✅ (شارة جديدة!)
· الحكم: النظام يعمل 100%. m5-ب و m8 ناجحتان.

---

🚀 التحسينات الإضافية (Performance & UI)

1. تسريع فتح التطبيق (Lazy Loading — م5-ج)

· GamesListScreen في HeroDashboard.tsx → Lazy + Suspense.
· النتيجة: الألعاب (10,000 سطر) لم تعد تُحمّل عند فتح لوحة البطل.

2. حل مشكلة البطء في "الصحن الطائر"

· عزل المؤقت: مكون GameTimer مستقل.
· إصلاح تسريب الذاكرة: addTimeout تحذف المؤقت بعد انتهائه.
· تخفيف الحركات: opacity: 0 بدل scale: 0.
· حساب الوقت: Date.now() بدل state.
· النتيجة: 60 FPS سلس.

3. تحسين أداء المعداد (Soroban2D5 & Rod2D5)

· Soroban2D5: React.memo.
· Rod2D5: React.memo + إزالة backdropFilter + transform: translateY بدل top.

4. إصلاح التوهج في الألعاب

· المشكلة: rodTint="white" ولّد توهجاً أبيض.
· الإجراء: إزالة rodTint="white" من DetectiveGame و FlyingAbacusGame.
· النتيجة: لون خشبي هادئ + حماية الفلاش التعليمي.

---

🎯 خارطة الطريق المتبقية

🔴 أولوية قصوى

1. كتابة دروس L4-L7 بصيغة L{level}-S{num} (حسب البروتوكول أعلاه).
2. ربط engine بـ srb-adapter: استبدال Stubs في adaptiveEngine و problemGenerator.

🟠 أولوية متوسطة

3. مراجعة الألعاب الأخرى (PirateRaceGame, Sorobania): لا تستخدم Soroban2D5 فلا تحتاج تحسينات الأداء.

🟡 أولوية منخفضة

4. مراجعة الملفات المجمّدة (engine/*, bank-*).

---

📌 ملاحظات حرجة للمساعد الجديد

1. progressStore.ts v12: التوسعة مسموحة بموافقة + Migration additive.
2. engine/ مفصول: Stubs مؤقتة. لا تحذفها حتى يتم الربط بـ SRB.
3. البنوك القديمة حُذفت: لا تبحث عن bank.ts أو bank-linked.
4. قبل حذف أي ملف: Grep ثلاثي.
5. قبل أي اقتراح: اطلب الملف كاملاً · اقرأه · لا تخمّن.
6. عند الشك: قل «لا أعرف» واسأل.
7. مصدر واحد للنجاح: grades[levelId].levelTest >= 80.
8. اسم الطفل: يُقرأ من useProgressStore (مُوحّد).
9. نتائج الامتحانات: تُقرأ من المتجر (مُوحّد).
10. زر التصفير: يمسح البيانات المؤقتة فقط (النص مُصحح).
11. المعداد: محمي بـ React.memo + translateY.
12. levelOfLesson: طبقة توافق دائمة — لا تحذفها، لا تعدّلها.
13. L1-L3: تبقى بصيغة S03-S08 للأبد.
14. L4-L7: تُكتب بصيغة L4-S09-L7-S15 (إلزامي).
15. m13: ملغاة نهائياً — لا تذكرها، لا تخطط لها.

---

📊 الإنجازات الرئيسية

الإنجاز قبل بعد
حجم الحزمة الرئيسية 911 KB 445 KB
بنوك ميتة 8,235 سطر 0
م5-ب (فصل الدروس) ❌ ✅
version progressStore 11 12
passedPractice [0,1,2] ['L0','L1','L2']
CI ✅ ✅
اختبارات 0 2
ESLint ❌ ✅

---

آخر تحديث: 2026-10-24
الحالة: 🟢 مستقر · البناء أخضر · المشروع جاهز للمرحلة التالية (L4-L7)

```