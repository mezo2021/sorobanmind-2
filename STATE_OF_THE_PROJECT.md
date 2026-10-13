🧮 STATE_OF_THE_PROJECT.md

التقرير الوصفي الشامل — SorobanMind v2

آخر تحديث: 2026-10-13 (مساءً)
Commit: 6416aa4
الحالة: 🟢 البناء أخضر · التذاكر + Sorobania معدّلان · البنكان A و B يعملان
الغرض: وصف محض · كل بند له مصدر
المصادر: Audit v8 (AST) + Audit v9 (Bash) + build.log + KEYS_TABLE + STORES_TABLE + GAPS + RUN_METADATA + فحص يدوي + جلسة 2026-10-13
القاعدة: v8 + v9 = الحقيقة · v5 مهجور

---

<div dir="rtl">

1. البطاقة التقنية

البند القيمة المصدر
الاسم SorobanMind v2 (أكاديمية السوروبان الدولية) README
النوع تطبيق تعليمي عربي · React Web README
الموضوع تعليم السوروبان الياباني (منهج تاكاشي كوجيما) README
الفئة أطفال (5-12) · كبار (13+) README
العمر 6 أشهر · ناجٍ من موت سريري × 2 سياق
المسار github.com/mezo2021/sorobanmind-2 RUN_METADATA
النشر GitHub Pages · mezo2021.github.io/sorobanmind-2 deploy.yml
Stack React 18 · Vite 5 · TypeScript 5.5 · Zustand 4 · Tailwind 3 · Framer Motion 11 · lucide-react package.json
Node v20.20.2 RUN_METADATA
npm 10.8.2 RUN_METADATA
Lockfile ❌ غير موجود · غير مقصود (.gitignore لا يذكره) RUN_METADATA · v9
type "module" (ESM) package.json

---

2. الأرقام الإجمالية

المؤشر القيمة المصدر
ملفات TypeScript/TSX مفحوصة 168 v8 · SUMMARY
ملفات بعد تقسيم Sorobania 172 v8 + 4 جديدة
أسطر الكود ~51,500 وثائق
الاستيرادات 618 v8
استدعاءات الدوال 7,439 v8
عمليات localStorage 129 v8
مفاتيح ثابتة 49 v8 · KEYS_TABLE
مفاتيح ديناميكية 80 v8 · GAPS
المتاجر (Zustand persist) 4 v9 · STORES_TABLE
البنوك (أسئلة) 5 فحص يدوي
مراجع الخصائص 3,388 v8
فجوات AST 80 v8 · GAPS
أخطاء نحوية 0 v8
وحدات مُحوَّلة (build) 2,018 build.log
حجم JS رئيسي 1.70 MB build.log
بعد Gzip 367.76 KB build.log
build exit code 0 ✅ build.exitcode
typecheck exit code not-configured typecheck.exitcode

---

3. بنية المجلدات

```text
sorobanmind-2/
├── .github/workflows/
│   ├── deploy.yml         ← النشر
│   ├── audit.yml          ← v6 (قديم · grep)
│   ├── audit-v8.yml       ← v8 (AST)
│   └── audit-v9.yml       ← v9 (Bash) 🆕
│
├── scripts/
│   ├── audit-ast.js       ← محلل AST (v8)
│   └── audit-v9.sh        ← محلل Bash (v9) 🆕
│
├── public/
│   ├── audio/ · images/ · stories/
│
├── src/
│   ├── App.tsx · types.ts
│   │
│   ├── components/
│   │   ├── games/
│   │   │   ├── FlyingAbacus/
│   │   │   ├── Detective/
│   │   │   ├── Friends/        ← friends/bank.ts يعمل
│   │   │   ├── Pirates/        ← 9 ملفات
│   │   │   ├── Sorobania/      ← 5 ملفات (بعد التقسيم)
│   │   │   ├── gamesData.ts
│   │   │   ├── GamesListScreen.tsx
│   │   │   ├── GameCompanion.tsx
│   │   │   ├── HighScoreBadge.tsx
│   │   │   └── highScoreStore.ts
│   │   │
│   │   ├── flash/              ← 11 ملفاً
│   │   ├── soroban2d5/         ← Soroban2D5 · Rod2D5
│   │   ├── AdaptiveFeedback.tsx
│   │   ├── BadgeModal.tsx
│   │   ├── FloatingCompanion.tsx
│   │   ├── CharacterSelector.tsx
│   │   ├── NumberStyleToggle.tsx
│   │   ├── DebugOverlay.tsx
│   │   └── SorobanEngineDebug.tsx
│   │
│   ├── store/                  ← 3 متاجر
│   │   ├── progressStore.ts
│   │   ├── masteryBadgesStore.ts
│   │   └── numberStyleStore.ts
│   │
│   ├── i18n/
│   │   ├── ar.ts · en.ts
│   │   ├── index.ts
│   │   └── useTranslation.ts   ← متجر persist رابع (حيّ)
│   │
│   ├── hooks/                  ← 7 ملفات
│   ├── screens/                ← 22 شاشة
│   ├── engine/                 ← 5 ملفات (معزولة)
│   ├── curriculum/
│   ├── data/
│   │   ├── srb/                ← Bank A + Bank B
│   │   ├── bank-v2/ · bank-raw/ · bank-linked.ts
│   │   └── bank.ts (ميت)
│   ├── utils/
│   └── assets/avatars/
│
└── [40+ ملف .md]
```

---

4. المتاجر الأربعة (v9 مُحدَّث)

4.1 progressStore — 🟢 نشط · محمي

البند القيمة
الملف src/store/progressStore.ts
الأسطر 670
مفتاح persist sorobanmind-v2-progress
version 9
migrations 7
الثوابت TICKET_COST=10 · TICKET_XP_CAP=50 · TICKETS_MAX=5
المستهلكون 24 ملفاً (v9)

الحقول (30):
childName · category · categoryChosenAt · completedLevels · completedLessons · passedPractice · passedAnzanVisual · passedAnzanAudio · grades · pendingRemediation · remediationHistory · exam1Passed · exam2Passed · placementAttempts · lastPlacementAttempt · skillProgress · levelExams · totalXP · currentStreak · lastPlayedDate · anzanBadges · anzanAudioBadges · completedEnrichment · language · soundEnabled · voiceEnabled · hapticsEnabled · ticketXP · tickets

الإجراءات (30):
setChildName · setCategory · markLevelComplete · markLessonCompleted · markPracticePassed · markAnzanVisualPassed · markAnzanAudioPassed · setGrade · getGrades · computeFinalScore · setPendingRemediation · clearPendingRemediation · addRemediationSession · setExam1Passed · setExam2Passed · recordPlacementAttempt · setAnzanBadge · setAnzanAudioBadge · completeEnrichment · recordAttempt · completeLevel · addXP · updateStreak · setLanguage · toggleSound · toggleVoice · toggleHaptics · reset · buyTicket · consumeTicket

الملاحظات الحديثة:

```text
// [FIX B1]  removed dead reload() — 2026-10-04
// [FIX B4]  unify AND for visual anzan — 2026-10-04
// [FIX N62] outcome → RemediationSession — 2026-10-05
// [GAMES]   نظام التذاكر — 2026-10-11
// [GAMES-v2] رفع السقف: 20 → 50 · TICKETS_MAX: 1 → 5 — 2026-10-13
```

---

4.2 masteryBadgesStore — 🟢 نشط

البند القيمة
الملف src/store/masteryBadgesStore.ts
الأسطر 123
مفتاح persist soroban_mastery_badges (v9 مؤكد)
version 1
الإجراءات awardBadge · hasBadge · getBadge · getAllBadges · count · reset
المستهلكون 6 ملفات (v9)

منطق المنح:

```ts
function classifySpeed(timeMs, answerMs): SpeedClass {
  if (answerMs <= 0) return "accepted";
  const ratio = timeMs / answerMs;
  if (ratio <= 0.5) return "mastery";
  if (ratio <= 0.75) return "accepted";
  return "slow";
}
```

---

4.3 numberStyleStore — 🟢 نشط

البند القيمة
الملف src/store/numberStyleStore.ts
الأسطر 29
المفتاح NUMBER_STYLE_KEY = soroban_number_style
الإجراءات setStyle · toggleStyle
المستهلكون 15 ملفاً (v9)

⚠️ تحذير — 3 مصادر لنفس المفتاح (v9):

# الملف قراءة كتابة
1 store/numberStyleStore.ts ✅ ✅
2 utils/numberStyle.ts:73,81 ✅ ✅
3 utils/numerals.ts:117,125 ✅ ✅

numerals.ts يبدأ بـ// src/utils/numberStyle.ts → نسخة مكررة.

---

4.4 LangState (useTranslation) — 🟢 حيّ · عكس v5

البند القيمة
الملف src/i18n/useTranslation.ts
الأسطر 41
مفتاح persist sorobanmind-v2-lang (صريح)
الحقول lang
الإجراءات setLang
المستهلكون 3 ملفات (v9): LessonScreen.tsx:38 · Header.tsx:12 · SorobanEngineDebug.tsx:4

v5 قال: ميت (يُستورد فقط من SorobanEngineDebug).
v9 أثبت: حيّ — مُستورد في شاشتين رئيسيتين.
النتيجة: نظام الترجمة نشط فعلًا · الجاهزية أعلى من 65%.

---

5. البنوك الخمسة

البنك المسار الحجم variant primary_phase الحالة
Bank A srb/questions/ 275 A P ✅ حيّ · 5 مستوردين
Bank B srb/exam/ 666 B CE ✅ مربوط (جلسة 24)
Bank v2 bank-v2/ 583 — — 🟡 معزول (bank-linked فقط)
Bank Raw bank-raw/ ~600 — — 🟡 معزول
data/bank.ts data/bank.ts 1,201 — — 🔴 بلا مستهلك

توزيع Bank B:

L0 L1 L2 L3 L4 L5 L6 L7 المجموع
42 227 80 80 80 80 50 27 666

⚠️ تحذير: data/bank.ts ≠ games/Friends/bank.ts (الأخير يعمل).

حلقة البنوك القديمة (v9 مؤكدة):

```text
bank-raw/ → bank-v2/ → bank-linked → engine/adaptiveEngine + engine/problemGenerator
                                             ↓
                                    ❌ لا أحد يستوردهم
                                             ↓
                                    حلقة معزولة تمامًا
```

---

6. المفاتيح — الخريطة الكاملة (v8 + v9)

6.1 المفاتيح الثابتة — 49 عملية · 20 مفتاح فريد

المفتاح الكتابة القراءة الحالة
soroban_companion HeroDashboard:151,154,173 FloatingCompanion:42 · FlyingAbacus:192 ✅
soroban_child_name (ديناميكي — RoleSelection) 7 ملفات ✅
soroban_child_full_name Certificate:75 · KidsCert:92 Certificate:47,63 · KidsCert:69,80 ✅
soroban_completed_lessons App:351,394 App:347,390 ✅
soroban_completed_levels App:219 CategoryExamScreen:239 ✅
soroban_passed_practice App:624 App:620 ✅
soroban_placement_weak_skills App:224 CategoryScreen:188 ✅
soroban_placement_recommended App:229 CategoryScreen:189 · HeroDashboard:126 ✅
soroban_number_style 3 مصادر 3 مصادر ⚠️
soroban_high_scores_v1 highScoreStore highScoreStore 🆕
soroban_high_scores_month highScoreStore highScoreStore 🆕
soroban_anzan_stats AnzanScreen skillsChecker · useQuests ✅
soroban_practice_stats PracticeScreen skillsChecker · useQuests ✅
soroban_dev_preview previewMode:22 LearnScreen:81 · previewMode:12 ✅
soroban_weak_skills_v2 bank-v2/placement-engine:257 bank-v2/index:319 ✅
sorobanmind-stats (progressStore?) badgeChecker · useQuests 🟡
srb_progress srb/progress:252,263 srb/progress:130 ✅
sorobanmind-v2-lang useTranslation useTranslation 🆕
soroban_mastery_badges masteryBadgesStore masteryBadgesStore 🆕
soroban_anzan_badges progressStore.setAnzanBadge utils/anzanBadges 🟡
soroban_anzan_audio_badges progressStore.setAnzanAudioBadge utils/audioAnzanBadges 🟡

6.2 المفاتيح الديناميكية — 80

النمط المكتشف (v9) في CategoryExamScreen.tsx:

```ts
// كتابة (231-233)
localStorage.setItem(`${cfg.storageKey}_passed`, ...);
localStorage.setItem(`${cfg.storageKey}_score`, ...);
localStorage.setItem(`${cfg.storageKey}_last_attempt`, ...);

// قراءة (149)
localStorage.getItem(`${cfg.storageKey}_last_attempt`);
```

النتيجة: 6 مفاتيح من أصل 80 محلولة · 74 متبقية.

توزيعها حسب الملف:

# الملف عدد
1 highScoreStore.ts 8
2 LessonScreen.tsx 8
3 SorobaniaGame.tsx 6
4 FriendsGame.tsx 6
5 srb/progress.ts 4
6 CategoryExamScreen.tsx 4
7 LevelTestScreen.tsx 4
8 CharacterSelector.tsx 4
9 bank-v2/index.ts 3
10 previewMode.ts 3
11 skillsChecker.ts 3
12 RoleSelection.tsx 3
13 GuardianDashboard.tsx 3
14 badgeChecker.ts 3
15-23 9 ملفات 2 لكل واحد

6.3 المفاتيح اليتيمة — 6 (v9 مصحّح)

# المفتاح القارئ الكاتب النوع
1 soroban_passed_level_tests CategoryScreen:179 · LevelScreen:139 ❌ يتيم كتابة
2 soroban_exam_result HeroDashboard:163 ❌ يتيم كتابة
3 soroban_kids_certificate_ready ❌ CategoryExamScreen:246 يتيم قراءة
4 soroban_section2_unlocked ❌ App:537 · CategoryExamScreen:245 يتيم قراءة
5 soroban_placement_result ❌ ❌ ميت تمامًا
6 soroban_placement_last_attempt ❌ ❌ ميت تمامًا

⚠️ تعارض مكتشف: soroban_section2_unlocked يُكتب بصيغتين مختلفتين:

· App:537: 'true' (string)
· CategoryExamScreen:245: JSON.stringify(true) (string JSON)

---

7. الفجوات الـ80

البند القيمة
النوع dynamic-storage-key (كلها)
parse errors 0
script errors 0
الأنماط ثوابت مستوردة · قوالب نصية ${} · متغيرات محسوبة
الحكم قيود AST · ليست أخطاء برمجية

خطوات المتابعة اليدوية (v8):

1. تتبع المفاتيح الديناميكية.
2. تأكيد المتاجر المستوردة من الشاشات النشطة.
3. متابعة الاستيرادات لتمييز القديم عن النشط.
4. الإقرار بأن AST لا يثبت القراءة/الكتابة الفعلية.

---

8. أكبر 20 ملفاً

# الملف الأسطر
1 srb/exam/L1.ts 4,348
2 srb/exam/L2.ts 1,555
3 srb/exam/L3.ts 1,553
4 srb/exam/L4.ts 1,553
5 LessonScreen.tsx 1,382
6 GuardianDashboard.tsx 1,373
7 srb/exam/L5.ts 1,233
8 data/bank.ts 1,201 🔴
9 engine/adaptiveEngine.ts 1,072
10 Sorobania/SorobaniaGame.tsx 1,057 (كان 2,398)
11 AnzanScreen.tsx 1,032
12 PirateRaceGame.tsx 1,012
13 FriendsGame.tsx 906
14 AudioAnzanScreen.tsx 900
15 curriculum/L2/S06.ts 864
16 FlyingAbacusGame.tsx 863
17 CategoryExamScreen.tsx 851
18 srb/questions/L2.ts 840
19 curriculum/L3/S07.ts 815
20 srb/exam/L6.ts 779

---

9. الألعاب الخمس

# اللعبة ID البطل الحالة
1 العداد الطائر flying-abacus المختار ✅
2 المحقق الرقمي detective جود ✅
3 دوجو السوروبان friends شام ✅
4 سباق القراصنة pirate-race ريان ✅
5 جزيرة سوروبانيا sorobania-island بانة ✅ (5 ملفات)

Sorobania — بعد التقسيم:

الملف الأسطر
SorobaniaGame.tsx 1,057
SorobaniaScenes.tsx 608
SorobaniaUI.tsx 407
sorobaniaData.ts 377
sorobaniaSfx.ts 133

---

10. المنهج — 8 مستويات · 15 درساً · 51 مهارة

المستوى الاسم الدروس الحالة
L0 التمهيدي intro · S01 · S02 ✅ (L0 + L1 فقط)
L1 الجمع والطرح S03 · S04 ✅
L2 الضرب S05 · S06 🟡
L3 القسمة S07 · S08 🟡
L4 سلاسل S09 · S10 🔴
L5 ضرب وقسمة متقدم S11 · S12 🔴
L6 الكسور العشرية S13 · S14 🔴
L7 الجذور S15 🔴

حالة الدروس الفعلية:

· ✅ curriculum/lessons/L0/: intro · S01 · S02 · test-pool
· ✅ curriculum/lessons/L1/: S03 · S04
· 🔴 curriculum/lessons/L2-L7/: لم تُبنَ

---

11. الملفات المعزولة (v9 مُحدَّث)

الملف الأسطر الحالة
engine/adaptiveEngine.ts 1,072 🟡 معزول تمامًا (v9)
engine/problemGenerator.ts 446 🟡 معزول تمامًا (v9)
engine/masteryTracker.ts 418 🟡 داخلي (يُستخدم من adaptiveEngine)
engine/sorobanEngine.ts 249 🔒 مجمّد (يُستدعى من Debug فقط)
engine/sorobanMoves.ts 250 🔒 مجمّد
data/bank.ts 1,201 🔴 ميت (v8)
data/curriculum.ts 312 🔴 ميت (v8)
utils/skillsChecker.ts 176 🔴 ميت (v8)
utils/audioAnzanBadges.ts 27 🔴 ميت — saveAudioAnzanBadges لا يُستدعى (v9)
utils/anzanBadges.ts 34 🟡 يُستورد من badgeChecker · saveAnzanBadges لا يُستدعى (v9)
utils/numerals.ts 126 🔴 نسخة مكررة (v8+v9)
utils/previewMode.ts 32 🟡 أداة تطوير (نشطة)
utils/badgeChecker.ts 112 🟡 يُستورد من useGameStats:14
DebugOverlay.tsx 89 🟡 تشخيص
SorobanEngineDebug.tsx 217 🟡 تشخيص
i18n/ar.ts 311 🟡 موجود · يُستورد من i18n/index.ts

النشط فعليًا: games/Friends/bank.ts · games/Pirates/* · data/srb/*

---

12. حجم الحزمة

الأصل الحجم Gzip
index.html 1.03 KB 0.54 KB
index-*.css 96.57 KB 15.00 KB
index-*.js 1,696.03 KB 367.76 KB
joud2-*.png 388.01 KB —
logo-certificate-*.webp 155.00 KB —
bana-*.png 50.28 KB —
sham-*.png 48.45 KB —

⚠️ حد التحذير: 500 KB — الحزمة 3.4× الحد.

---

13. البناء

المؤشر النتيجة
tsc ✅
vite build ✅
build exit code 0
typecheck script ❌ غير موجود
lint script ❌ غير موجود
test script ✅ vitest
test:run script ✅
نشر GitHub Pages ✅
Lockfile ❌ غير موجود

package.json scripts:

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "test": "vitest",
  "test:run": "vitest run",
  "deploy": "npm run build && gh-pages -d dist"
}
```

---

14. خريطة الاستيراد (v9 مؤكدة)

14.1 progressStore — 24 مستورداً

الشاشات (13): LearnScreen · LevelScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · AnzanScreen · GuardianDashboard · HeroDashboard · CategoryScreen · KidsCertificateScreen · PracticeScreen · App

المكونات (6): FriendsGame · GamesListScreen · DetectiveGame · FlyingAbacusGame · PirateRaceGame · SorobaniaGame · AdaptiveFeedback

Hooks + Data (3): curriculum.ts · useGameStats.ts · App

14.2 masteryBadgesStore — 6 مستوردين

AdaptiveFeedback · AudioAnzanScreen · AnzanScreen · GuardianDashboard · PracticeScreen · useGameStats

14.3 numberStyleStore — 15 مستورداً

NumberStyleToggle · Soroban2D5 · AdaptiveFeedback · LearnScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · PlacementTestScreen · FingerMathScreen · AnzanScreen · SorobanPlayground · CategoryExamScreen · Header · PracticeScreen

14.4 useTranslation — 3 مستوردين

SorobanEngineDebug · LessonScreen · Header

14.5 engine — معزول

المستورد من
adaptiveEngine.ts masteryTracker + bank-linked
problemGenerator.ts bank-linked
SorobanEngineDebug.tsx sorobanEngine + sorobanMoves

النتيجة: engine/ معزول تمامًا عن الشاشات النشطة.

14.6 البنوك

البنك المستورد
bank-v2 bank-linked.ts:60
bank-raw bank-v2/bank-exam.ts · bank-adapter.ts:65
bank-linked engine/adaptiveEngine.ts:62 · engine/problemGenerator.ts:59
bank-adapter bank-linked.ts:63
srb-adapter 5 شاشات + App.tsx:53

---

15. المخاطر

🔴 مؤكدة

# الوصف الأولوية
1 soroban_passed_level_tests بلا كاتب 🔴
2 soroban_exam_result بلا كاتب 🔴
3 soroban_placement_result ميت تمامًا 🔴
4 soroban_placement_last_attempt ميت تمامًا 🔴
5 soroban_section2_unlocked صيغتان مختلفتان 🔴
6 soroban_number_style بمصدرين (v9) 🟠
7 data/bank.ts معزول 1,201 سطر 🟠
8 حجم الحزمة 1.70 MB (3.4× الحد) 🟠
9 joud2.png 388 KB 🟠
10 20 ملفاً > 800 سطر 🟡
11 لا Lockfile 🟡
12 لا typecheck script 🟡
13 saveAnzanBadges · saveAudioAnzanBadges معرّفة · لا تُستدعى 🟡
14 engine/ معزول تمامًا 🟡
15 3 أنظمة شارات نشطة + 1 معزول 🟡

🟢 محسومة

· ✅ Bank A + B يعملان
· ✅ recordAttempt في 3 شاشات (Practice · Anzan · AudioAnzan)
· ✅ العشرية في CE1 · CE2 · PT
· ✅ 0 أخطاء نحوية
· ✅ 5 ألعاب تعمل
· ✅ keysToKeep = 11 مفتاحاً
· ✅ useTranslation حيّ (v9 أثبت · v5 قال ميت)
· ✅ getAnzanBadgeKey صحيح (v8 أثبت)

---

16. ما أُنجز في جلسة 2026-10-13

نظام التذاكر (progressStore)

· ✅ TICKET_XP_CAP: 20 → 50
· ✅ TICKETS_MAX: 1 → 5
· ✅ migration v9

Sorobania

· ✅ تقسيم 1 → 5 ملفات
· ✅ sorobania_progress_v2 يُحفظ

GuardianDashboard

· ✅ handleReset: 4 → 11 مفتاحاً
· ✅ handleBackup: بلا فلتر
· ✅ handleRestore: مسح قبل الكتابة

GamesListScreen

· ✅ العنوان: مَحْفَظَةُ النِّقَاط
· ✅ dir="ltr" للأرقام
· ✅ نص توجيهي للطفل

Audit

· ✅ v8 (AST) يعمل · 168 ملفاً
· ✅ v9 (Bash) يعمل · 10 أقسام
· ✅ حل 9 غموض من v8

القائمة النهائية لـkeysToKeep (11 مفتاحاً)

```text
soroban_companion
soroban_child_name
soroban_child_full_name
soroban_high_scores_v1
soroban_high_scores_month
sorobanmind-v2-progress
soroban_mastery_badges
sorobanmind-v2-lang
srb_progress
soroban_number_style
sorobania_progress_v2
```

---

17. ما لم يُنجَز

# العنصر الأولوية
1 الهجرة الكاملة (bank-v2 · raw · linked) 🔴
2 ترحيل adaptiveEngine → SRB 🔴
3 إصلاح srb-adapter (3 دوال) 🔴
4 recordAttempt في CE · PT 🟠
5 دروس L2-L7 🟠
6 توحيد المتاجر 🟠
7 تنظيف المفاتيح اليتيمة (6) 🟠
8 تفكيك الملفات الضخمة 🟡
9 تقليل الحزمة (1.70 MB) 🟡
10 typecheck script 🟡
11 Lockfile 🟡
12 74 مفتاح ديناميكي متبقي 🟡
13 soroban_number_style → مصدر واحد 🟡

---

18. الملفات المرجعية

الملف الحالة
STATE_OF_THE_PROJECT.md ✅ هذا الملف — مصدر الحقيقة الوحيد
PROJECT_MASTER.md 🟡 قديم (2026-10-07) — يحتاج تحديث
FLASH_SECTION.md ✅ محدّث (2026-10-13)
GAMES_SECTION.md ✅ محدّث (2026-10-13)
SESSION_2026-10-13.md ✅ محدّث
ACHIEVEMENTS.md 🟡 تراكمي
README.md ✅
audit-v8 (المخرج الكامل) ✅ معتمد
audit-v9 (المخرج الكامل) ✅ معتمد
~~AL-ISLAH.md~~ 🗄️ مؤرشف
~~AL-ISLAH-V2.md~~ 🗄️ مؤرشف
~~PLAN_v3.md~~ 🗄️ مؤرشف

---

19. ملاحظات ختامية

1. LangState — اكتشاف v9 · الترجمة ليست معزولة (عكس v5).
2. data/bank.ts ≠ games/Friends/bank.ts (الأخير يعمل).
3. بنوك القراصنة — كلها تعمل (mulEngine · divEngine · quizTypes · quizFactory).
4. soroban_number_style — 3 مصادر (v9).
5. sorobanmind-stats — مفتاح ميت.
6. sorobania_progress_v2 — مفتاح حقيقي · يُحفظ الآن.
7. engine/ — معزول تمامًا (v9 مؤكد).
8. soroban_mastery_badges — version 1 (v9).
9. sorobanmind-v2-progress — version 9 · 7 migrations.
10. لا Lockfile — .gitignore لا يذكره → غير مقصود (v9).

---

آخر تحديث: 2026-10-13 (مساءً)
Commit: 6416aa4
الحالة: 🟢 البناء أخضر · جاهز لبناء خطة إصلاح جديدة

</div>

---

✅ ملخص ما تم تعديله

القسم التعديل
البطاقة التقنية إضافة Lockfile: غير موجود + type: module
الأرقام تصحيح 168 → 172 ملفاً بعد تقسيم Sorobania
البنية إضافة audit-v9.yml + scripts/audit-v9.sh
المتاجر إضافة المستهلكين الفعليين (v9) + useTranslation حيّ
المفاتيح تصحيح اليتيمة: 5 → 6 + إضافة الجديدة (high_scores · sorobania)
الفجوات تفصيل توزيعها حسب 23 ملف
المعزولة تأكيد adaptiveEngine وproblemGenerator معزولان تمامًا
البناء إضافة lint غير موجود · Lockfile غير موجود
خريطة الاستيراد أرقام v9 المؤكدة (24 · 6 · 15 · 3)
المخاطر 15 بند (كان 9) + فصل مؤكد/محسوم
ما أُنجز تفصيل جلسة 2026-10-13
ما لم يُنجَز 13 بند (كان 10)

---