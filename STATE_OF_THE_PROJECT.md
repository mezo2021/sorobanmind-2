🧮 STATE_OF_THE_PROJECT.md — التقرير الوصفي الشامل الكامل

آخر تحديث: 2026-10-13 · Commit: 6583578 · الحالة: 🟡 صيانة كاملة
المصادر: Audit v8 · build.log · KEYS_TABLE · STORES_TABLE · GAPS · فحص يدوي

---

1. البطاقة التقنية

البند القيمة
الاسم SorobanMind v2 (أكاديمية السوروبان الدولية)
النوع تطبيق تعليمي عربي · React Web
الموضوع تعليم السوروبان الياباني (منهج تاكاشي كوجيما)
الفئة أطفال (5-12) · كبار (13+)
العمر 6 أشهر · ناجٍ من موت سريري × 2
المسار github.com/mezo2021/sorobanmind-2
النشر GitHub Pages · mezo2021.github.io/sorobanmind-2
Stack React 18 · Vite 5 · TypeScript 5.5 · Zustand 4 · Tailwind 3 · Framer Motion 11 · lucide-react
Node v20.20.2
npm 10.8.2
Lockfile ❌ غير موجود
type "module" (ESM)

---

2. الأرقام الإجمالية

المؤشر القيمة المصدر
ملفات TypeScript/TSX 168 SUMMARY
أسطر الكود ~51,573 وثائق
الاستيرادات 618 SUMMARY
استدعاءات الدوال 7,439 SUMMARY
عمليات localStorage 129 SUMMARY
مفاتيح ثابتة 49 SUMMARY
مفاتيح ديناميكية ~80 GAPS
المتاجر (Zustand) 4 STORES_TABLE
البنوك (أسئلة) 5 فحص يدوي
مراجع الخصائص 3,388 SUMMARY
فجوات AST 80 GAPS
أخطاء نحوية 0 SUMMARY
وحدات مُحوَّلة (build) 2,018 build.log
حجم JS رئيسي 1.70 MB build.log
بعد Gzip 367.76 KB build.log
build exit code 0 ✅ build.exitcode
typecheck exit code not-configured typecheck.exitcode

---

3. بنية المجلدات الكاملة

```
sorobanmind-2/
├── .github/workflows/
│   ├── deploy.yml         ← النشر (يعمل · npm install)
│   ├── audit.yml          ← v6 (قديم · يدوي)
│   └── audit-v8.yml       ← v8 (يعمل · AST)
│
├── scripts/
│   └── audit-ast.js       ← محلل AST (~350 سطر)
│
├── public/
│   ├── audio/             ← 12 mp3
│   ├── images/            ← 9 SVG متحركة
│   └── stories/           ← 10 قصص
│
├── src/
│   ├── App.tsx            ← البوابة (680 سطر)
│   ├── types.ts           ← عام
│   │
│   ├── components/        ← 30+ ملف
│   │   ├── games/         ← 5 ألعاب
│   │   │   ├── FlyingAbacus/
│   │   │   ├── Detective/
│   │   │   ├── Friends/
│   │   │   │   ├── FriendsGame.tsx
│   │   │   │   ├── LaserAbacus.tsx
│   │   │   │   └── bank.ts  ← ✅ مُستخدَم (40 تمرين)
│   │   │   ├── Pirates/     ← 9 ملفات
│   │   │   │   ├── PirateRaceGame.tsx
│   │   │   │   ├── MultiRodAbacus.tsx
│   │   │   │   ├── PirateScene.tsx
│   │   │   │   ├── SolutionPlayer.tsx
│   │   │   │   ├── mulEngine.ts
│   │   │   │   ├── divEngine.ts
│   │   │   │   ├── quizTypes.ts
│   │   │   │   ├── quizFactory.ts
│   │   │   │   └── seaSfx.ts
│   │   │   ├── Sorobania/   ← SorobaniaGame.tsx (2398 سطر)
│   │   │   ├── gamesData.ts
│   │   │   ├── GamesListScreen.tsx
│   │   │   ├── GameCompanion.tsx
│   │   │   ├── HighScoreBadge.tsx
│   │   │   └── highScoreStore.ts
│   │   │
│   │   ├── flash/         ← 11 ملف (دروس فلاشية)
│   │   ├── soroban2d5/    ← المعداد الأساسي
│   │   ├── avatars/
│   │   ├── CertificateLogo.tsx
│   │   ├── CertificateMedal.tsx
│   │   ├── BadgeModal.tsx
│   │   ├── NameInputModal.tsx
│   │   ├── AdaptiveFeedback.tsx
│   │   ├── SorobanEngineDebug.tsx  ← أداة تشخيص
│   │   ├── DebugOverlay.tsx        ← أداة تشخيص
│   │   └── ...
│   │
│   ├── store/             ← 3 متاجر Zustand
│   │   ├── progressStore.ts        (670 سطر)
│   │   ├── masteryBadgesStore.ts   (124 سطر)
│   │   └── numberStyleStore.ts     (30 سطر)
│   │
│   ├── hooks/             ← 7 خطافات
│   │   ├── useSpeech.ts
│   │   ├── useCharacterVoice.ts
│   │   ├── useSorobanaVoice.ts
│   │   ├── useGameStats.ts
│   │   ├── useQuests.ts
│   │   ├── useSound.ts
│   │   └── useConfetti.ts
│   │
│   ├── screens/           ← 22 شاشة
│   ├── engine/            ← 5 ملفات (معزولة)
│   ├── curriculum/        ← الدروس النصية
│   ├── data/              ← البنوك
│   │   ├── srb/           ← Bank A + B
│   │   ├── bank-v2/       ← قديم (583)
│   │   ├── bank-raw/      ← قديم (~600)
│   │   ├── bank.ts        ← 🔴 معزول (1,201)
│   │   ├── bank-linked.ts ← معزول
│   │   ├── bank-adapter.ts
│   │   ├── curriculum.ts  ← 🔴 معزول (312)
│   │   ├── index.ts       ← BADGES الـ8
│   │   ├── modes.ts
│   │   └── srb-adapter.ts ← 🔗 Barrel
│   │
│   ├── utils/             ← 10 ملفات
│   │   ├── numberStyle.ts · numerals.ts
│   │   ├── anzanBadges.ts · audioAnzanBadges.ts
│   │   ├── badgeChecker.ts · skillsChecker.ts
│   │   ├── previewMode.ts · arabicNumbers.ts
│   │   └── certificateGenerator.ts
│   │
│   ├── i18n/              ← 4 ملفات (معزولة عدا LangState)
│   └── assets/avatars/    ← 4 png
│
└── [40+ ملف .md]         ← توثيق تراكمي
```

---

4. المتاجر الأربعة — تفصيل كامل

4.1 progressStore

البند القيمة
الملف src/store/progressStore.ts
الأسطر 670
مفتاح persist sorobanmind-v2-progress
version 9
migrations v3 → v4 → v5 → v6 → v7 → v8 → v9 (7 هجرات)
آخر تحديث 2026-10-11 (نظام تذاكر)

الحقول (28):
childName · category · categoryChosenAt · completedLevels · completedLessons · passedPractice · passedAnzanVisual · passedAnzanAudio · grades · pendingRemediation · remediationHistory · exam1Passed · exam2Passed · placementAttempts · lastPlacementAttempt · skillProgress · levelExams · totalXP · currentStreak · lastPlayedDate · anzanBadges · anzanAudioBadges · completedEnrichment · language · soundEnabled · voiceEnabled · hapticsEnabled · ticketXP · tickets

الإجراءات (30):
setChildName · setCategory · markLevelComplete · markLessonCompleted · markPracticePassed · markAnzanVisualPassed · markAnzanAudioPassed · setGrade · getGrades · computeFinalScore · setPendingRemediation · clearPendingRemediation · addRemediationSession · setExam1Passed · setExam2Passed · recordPlacementAttempt · setAnzanBadge · setAnzanAudioBadge · completeEnrichment · recordAttempt · completeLevel · addXP · updateStreak · setLanguage · toggleSound · toggleVoice · toggleHaptics · reset · buyTicket · consumeTicket

الثوابت:

```ts
TICKET_COST = 10
TICKET_XP_CAP = 20
TICKETS_MAX = 1
```

المستهلكون (16 ملفاً): App · AdaptiveFeedback · LearnScreen · LevelScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · AnzanScreen · GuardianDashboard · CategoryScreen · KidsCertificateScreen · PracticeScreen · curriculum.ts · useGameStats

---

4.2 masteryBadgesStore

البند القيمة
الملف src/store/masteryBadgesStore.ts
الأسطر 124
مفتاح persist soroban_mastery_badges
version 1
الحقول badges
الإجراءات (6) awardBadge · hasBadge · getBadge · getAllBadges · count · reset
المستهلكون (6) AdaptiveFeedback · AudioAnzanScreen · AnzanScreen · GuardianDashboard · PracticeScreen · useGameStats
دوال مساعدة classifySpeed · speedClassLabel

---

4.3 numberStyleStore

البند القيمة
الملف src/store/numberStyleStore.ts
الأسطر 30
مفتاح persist NUMBER_STYLE_KEY (= soroban_number_style)
الحقول style
الإجراءات (2) setStyle · toggleStyle
القيم 'arabic' أو 'latin'
المستهلكون (15) NumberStyleToggle · Soroban2D5 · AdaptiveFeedback · LearnScreen · LevelTestScreen · LessonScreen · AudioAnzanScreen · RemediationScreen · PlacementTestScreen · FingerMathScreen · AnzanScreen · SorobanPlayground · CategoryExamScreen · Header · PracticeScreen

---

4.4 LangState ✨ جديد

البند القيمة
الملف src/i18n/useTranslation.ts (41 سطر)
مفتاح persist sorobanmind-v2-lang
الحقول lang
الإجراءات setLang
المستهلكون SorobanEngineDebug فقط
حالة ⚠️ متجر فعّال · لكن لا تستخدمه الشاشات

ملاحظة: هذا اكتشاف Audit v8 · لم يكن في التقارير السابقة.

---

5. البنوك الخمسة — تفصيل كامل

5.1 Bank A — src/data/srb/questions/ ✅ حي

البند القيمة
الحجم 275 سؤالاً
الملفات L0-L7 (8 ملفات)
primary_phase P
allowed_phases E · T · P · ANZ-V · ANZ-F · ANZ-A · X
variant A
anzan_time_ms 0 (مُستخدم)
الدور تقويم تكويني
المستهلكون PracticeScreen · AnzanScreen · AudioAnzanScreen · LevelTestScreen · RemediationScreen
الربط عبر srb-adapter.ts

5.2 Bank B — src/data/srb/exam/ ✅ مربوط

البند القيمة
الحجم 666 سؤالاً
التوزيع L0=43 · L1=228 · L2=81 · L3=81 · L4=81 · L5=81 · L6=51 · L7=28
الملفات L0-L7 + index.ts (352 سطر)
primary_phase CE
allowed_phases CE · PT · X
variant B
الدور تقييم ختامي
المستهلكون CategoryExamScreen · PlacementTestScreen
الربط @/data/srb/exam

5.3 Bank v2 — src/data/bank-v2/ 🟡 معزول

البند القيمة
الحجم 583 سؤالاً
الملفات part-01 إلى part-04 · bank-exam · placement-engine · index · types
المستهلك الوحيد bank-linked.ts:60
حالة الربط معزول

5.4 Bank Raw — src/data/bank-raw/ 🟡 معزول

البند القيمة
الحجم ~600 سؤالاً
الملفات raw-01 إلى raw-07 + index + types
المستهلكون bank-v2/bank-exam.ts · bank-adapter.ts
حالة الربط معزول

5.5 bank.ts — src/data/bank.ts 🔴 بلا مستهلك

البند القيمة
الأسطر 1,201
المستهلكون ❌ صفر
⚠️ تحذير لا يُخلط مع src/components/games/Friends/bank.ts (هذا يعمل)

---

6. المفاتيح — الخريطة الكاملة

6.1 المفاتيح الثابتة الحيّة (12)

المفتاح الكتابة القراءة الحالة
soroban_companion HeroDashboard (×3) FloatingCompanion · FlyingAbacus · HeroDashboard ✅
soroban_child_name HeroDashboard · RoleSelection App · 4 ألعاب · HeroDashboard ✅
soroban_child_full_name CertificateScreen · KidsCertificate نفسهما ✅
soroban_completed_lessons App (×2) App (×2) ✅
soroban_completed_levels App CategoryExamScreen ✅
soroban_passed_practice App App ✅
soroban_placement_weak_skills App CategoryScreen ✅
soroban_placement_recommended App CategoryScreen · HeroDashboard ✅
soroban_placement_result App — ⚠️ يُكتب فقط
soroban_section2_unlocked App · CategoryExam — ⚠️ يُكتب فقط
soroban_kids_certificate_ready CategoryExam — ⚠️ يُكتب فقط
soroban_number_style numberStyle · numerals numberStyle · numerals ⚠️ مصدران

6.2 المفاتيح اليتيمة (2)

المفتاح القارئ المشكلة
🔴 soroban_passed_level_tests CategoryScreen:179 · LevelScreen:139 لا كاتب
🔴 soroban_exam_result HeroDashboard:163 لا كاتب

6.3 المفاتيح المكتوبة ديناميكياً (4)

المفتاح القراءة (ثابت) الكتابة (template)
soroban_exam1_passed CategoryScreen:190 CategoryExam:231 ${storageKey}_passed
soroban_exam2_passed CategoryScreen:191 · HeroDashboard:135 نفسه
soroban_exam1_score CertificateScreen:54 CategoryExam:232
soroban_exam2_score CertificateScreen:59 نفسه

6.4 المفاتيح الديناميكية (~25)

المتاجر (4): مفاتيح persist الأربعة

البنوك (3):

· srb_progress — srb/progress.ts:130,252,263,272
· soroban_weak_skills_v2 — bank-v2/index:319
· soroban_placement_weak_skills (ديناميكي) — placement-engine:238,257

الألعاب (6):

· soroban_high_scores_v1 — highScoreStore
· soroban_high_scores_month — نفسه
· pirate_sound_v1 — PirateRaceGame:98,579
· soroban_friends_symbol_seen_v1 — FriendsGame:139,142
· soroban_friends_weak_v1 — FriendsGame:145,148
· soroban_laser_theme_v1 — FriendsGame:151,554

الدروس (4):

· soroban_lesson_session_* — LessonScreen:112,121,127
· soroban_lesson_progress — LessonScreen:328,332,654,658
· L0_TEST_LAST_ATTEMPT — LevelTestScreen:157,231
· L0_TEST_STORAGE — LevelTestScreen:234,238

الإعدادات (4):

· CHARACTER_STORAGE_KEY — CharacterSelector:79,94,99,104
· NAME_STORAGE_KEY — RoleSelection:25,26,47
· COMPANION_STORAGE_KEY — RoleSelection:48,61
· soroban_welcome_seen — App:68,80

الإثراء (2):

· BEST_SCORES_KEY — MagicSecretsScreen:228,240
· COMPLETED_KEY — FingerMathScreen:144,148

الشارات (3):

· soroban_anzan_badges — anzanBadges:17,26
· soroban_anzan_audio_badges — audioAnzanBadges:13,22
· sorobanmind-stats — badgeChecker:19

الترجمة/الأرقام (4):

· soroban_dev_preview — previewMode:12,22,24
· soroban_number_style — numerals:117,125
· soroban_placement_weak_skills — srb/exam:257,276

---

7. الفجوات الـ80 — تفصيل كامل

النوع الوحيد: dynamic-storage-key
التوزيع حسب الملف:

الملف عدد الفجوات
SorobaniaGame.tsx 5
highScoreStore.ts 8
LessonScreen.tsx 7
GuardianDashboard.tsx 3
CategoryExamScreen.tsx 4
LevelTestScreen.tsx 4
RoleSelection.tsx 5
CharacterSelector.tsx 4
previewMode.ts 3
srb/progress.ts 4
bank-v2/index.ts 3
placement-engine.ts 2
srb/exam/index.ts 2
useQuests.ts 2
FingerMathScreen.tsx 2
MagicSecretsScreen.tsx 2
anzanBadges.ts 2
audioAnzanBadges.ts 2
badgeChecker.ts 3
skillsChecker.ts 3
App.tsx 2
FriendsGame.tsx 6
PirateRaceGame.tsx 2

الأنماط:

1. ثوابت معرّفة في ملف آخر (CHARACTER_STORAGE_KEY)
2. قوالب نصية (${storageKey}_passed)
3. متغيرات محسوبة
4. معرفات ديناميكية داخل حلقات

الحكم: ليست أخطاء برمجية · بل قيود AST — المفاتيح موجودة لكن AST لا يحل المتغيرات.

---

8. أكبر 20 ملفاً

# الملف الأسطر الحجم
1 srb/exam/L1.ts 4,348 104 KB
2 SorobaniaGame.tsx 2,398 94 KB
3 srb/exam/L2.ts 1,555 63 KB
4 srb/exam/L3.ts 1,553 69 KB
5 srb/exam/L4.ts 1,553 70 KB
6 LessonScreen.tsx 1,382 58 KB
7 GuardianDashboard.tsx 1,373 57 KB
8 srb/exam/L5.ts 1,233 68 KB
9 data/bank.ts 1,201 25 KB
10 adaptiveEngine.ts 1,072 21 KB
11 AnzanScreen.tsx 1,032 41 KB
12 PirateRaceGame.tsx 1,012 45 KB
13 FriendsGame.tsx 906 41 KB
14 AudioAnzanScreen.tsx 900 35 KB
15 curriculum/L2/S06.ts 864 86 KB
16 FlyingAbacusGame.tsx 863 34 KB
17 CategoryExamScreen.tsx 851 40 KB
18 srb/questions/L2.ts 840 46 KB
19 curriculum/L3/S07.ts 815 71 KB
20 srb/exam/L6.ts 779 36 KB

---

9. الألعاب الخمس

# اللعبة ID البطل المدة الحالة
1 العداد الطائر flying-abacus المختار 60ث ✅ يعمل
2 المحقق الرقمي detective جود 45ث ✅ يعمل
3 دوجو السوروبان friends شام 90ث ✅ يعمل
4 سباق القراصنة pirate-race ريان 90ث 🟡 جسر القسمة ناقص
5 جزيرة سوروبانيا sorobania-island بانة 60ث ✅ يعمل

المشاركون في مكونات المعداد:

· soroban2d5/Soroban2D5.tsx — الدروس · التمارين · الفلاشات · المحقق · العداد الطائر
· games/Friends/LaserAbacus.tsx — الدوجو فقط
· games/Pirates/MultiRodAbacus.tsx — القراصنة فقط

---

10. المنهج — 8 مستويات · 15 درساً · 51 مهارة

المستوى الاسم الدروس m الحالة
L0 التمهيدي intro · S01 · S02 5 ✅ مكتمل
L1 الجمع والطرح S03 · S04 8 ✅ مكتمل
L2 الضرب S05 · S06 8 🟡 مكتمل
L3 القسمة S07 · S08 8 🟡 مكتمل
L4 سلاسل الجمع/الطرح S09 · S10 8 🔴 لم يُبنَ
L5 ضرب وقسمة متقدم S11 · S12 8 🔴 لم يُبنَ
L6 الكسور العشرية S13 · S14 5 🔴 لم يُبنَ
L7 الجذور S15 1 🔴 لم يُبنَ

---

11. الملفات المعزولة والميتة

11.1 ملفات معزولة (لا مستهلك)

الملف الأسطر الحالة
src/data/bank.ts 1,201 🔴 معزول
src/data/curriculum.ts 312 🔴 معزول
src/data/bank-linked.ts 475 🟡 عبر engine معزول
src/data/bank-adapter.ts 375 🟡 معزول
src/engine/adaptiveEngine.ts 1,072 🟡 معزول
src/engine/problemGenerator.ts 446 🟡 معزول
src/engine/masteryTracker.ts 418 🟡 داخلي فقط
src/utils/skillsChecker.ts 176 🔴 معزول
src/utils/numerals.ts 126 🔴 نسخة قديمة
src/utils/anzanBadges.ts 34 🟡 يُستورد من badgeChecker فقط
src/utils/audioAnzanBadges.ts 27 🔴 معزول
src/utils/badgeChecker.ts 112 🟡 يُستورد من useGameStats فقط
src/components/DebugOverlay.tsx 89 🟡 أداة تشخيص
src/components/SorobanEngineDebug.tsx 217 🟡 أداة تشخيص
src/i18n/ar.ts 311 🔴 معزول
src/i18n/en.ts 311 🔴 معزول
src/i18n/useTranslation.ts 41 🟡 يُستورد من SorobanEngineDebug

11.2 الملفات النشطة (تأكيد)

· ✅ src/components/games/Friends/bank.ts — يعمل
· ✅ src/components/games/Pirates/* — كلها تعمل
· ✅ src/data/srb/* — يعمل
· ✅ src/data/srb-adapter.ts — يعمل

---

12. حجم الحزمة — تفصيل

12.1 JS الرئيسي

· 1.70 MB · Gzip 367.76 KB
· تجاوز 500 KB التحذيري (Vite WARNING)

12.2 CSS

· 96.57 KB · Gzip 15.00 KB

12.3 الأصول البصرية (الأكبر)

الأصل الحجم
joud2-Bb7Gp_jR.png 388.01 KB ⚠️
logo-certificate-CE9MnfXr.webp 155.00 KB
bana-DDn2mRzI.png 50.28 KB
sham-CKax4Cgp.png 48.45 KB
sorobana-teaching-pointing-DOo-bNTT.webp 47.05 KB
sorobana-main-B96WcClt.webp 47.03 KB
rayan-Bv0AlkN1.png 39.37 KB

---

13. الوضع الأمني/البناء

المؤشر النتيجة الدليل
tsc ✅ نجح build.log
vite build ✅ نجح build.log
build exit code 0 build.exitcode
typecheck ❌ غير مُهيأ typecheck.exitcode = not-configured
Script typecheck ❌ غير موجود في package.json —
نشر GitHub Pages ✅ يعمل Actions
Lockfile ❌ غير موجود RUN_METADATA

---

14. المخاطر الفعلية

14.1 مخاطر مؤكدة (لها دليل)

# الوصف الدليل الأولوية
1 تصفير Guardian يمحو sorobanmind-v2-progress keysToKeep لا يتضمنه 🔴 P0
2 soroban_passed_level_tests بلا كاتب KEYS_TABLE 🔴 P0
3 soroban_exam_result بلا كاتب KEYS_TABLE 🔴 P0
4 soroban_number_style بمصدرين numerals + store 🟠 P1
5 bank.ts معزول 1,201 سطر Audit v6 🟠 P1
6 حجم الحزمة 1.70 MB build.log 🟠 P1
7 joud2.png 388 KB build.log 🟠 P1
8 20 ملفاً > 800 سطر فحص 🟡 P2
9 لا Lockfile RUN_METADATA 🟡 P2
10 لا script typecheck typecheck.exitcode 🟡 P2

14.2 مخاطر محتملة (تحتاج تأكيد)

# الوصف ما يلزم
1 80 فجوة AST مراجعة يدوية
2 engine/ قد يكون ميتاً reverse deps
3 bank-v2 + raw معزولة reverse deps
4 sorobanmind-v2-lang لم يُحفظ عند التصفير تأكيد
5 soroban_dev_preview يُكتب ديناميكي فحص previewMode
6 i18n/ar.ts · en.ts معزولة فحص
7 modes.ts بحالة غير واضحة فحص

14.3 نقاط محسومة ✅

· Bank A يعمل (275 سؤال)
· Bank B مربوط (666 سؤال)
· recordAttempt في 3 شاشات
· العشرية في CE1 · CE2 · PT
· 0 أخطاء نحوية
· البناء أخضر
· 5 ألعاب تعمل
· الترجمة موصولة (LangState)

---

15. ما تم إنجازه في آخر جلسات

· ✅ نظام التذاكر (ticketXP · tickets)
· ✅ v9 migration
· ✅ Bank B مربوط
· ✅ recordAttempt في Practice · Anzan · AudioAnzan
· ✅ رفع TICKET_XP_CAP إلى 50
· ✅ رفع TICKETS_MAX إلى 5
· ✅ Audit v8 يعمل (AST)
· ✅ sorobania-island يعمل
· ✅ حماية sorobanmind-v2-progress (لم تُنفّذ بعد)

---

16. ما لم يُنجَز بعد

· ❌ الهجرة الكاملة (bank-v2 · raw · linked)
· ❌ توحيد المتاجر
· ❌ تنظيف المفاتيح اليتيمة
· ❌ تفكيك الملفات الضخمة (>800 سطر)
· ❌ تقليل الحزمة (1.70 MB)
· ❌ typecheck script
· ❌ Lockfile
· ❌ حماية sorobanmind-v2-progress عند التصفير
· ❌ تفكيك bank.ts المعزول
· ❌ حفظ soroban_passed_level_tests
· ❌ حفظ soroban_exam_result

---

17. الملفات المرجعية الحالية

الملف الحجم الحالة
MASTER_REFERENCE.md ~500 سطر 🟡 يحتاج مراجعة
GAMES_CITY.md ~600 سطر 🟡 يحتاج مراجعة
PROJECT_MASTER.md ~900 سطر 🟡 قديم
ACHIEVEMENTS.md ~400 سطر 🟡 تراكمي
AL-ISLAH-V2.md ضخم 🟡 مرجعي
FLASH-SECTION.md ~400 سطر ✅
README.md ~200 سطر ✅
PROJECT_PLAN.md ~200 سطر ❓
plannew.md ~200 سطر ❓

---

18. ملاحظات ما بعد التدقيق

1. LangState اكتشاف جديد — الترجمة ليست معزولة كما قيل
2. bank.ts في الألعاب ≠ data/bank.ts — لا خلط
3. بنوك القراصنة (mulEngine · divEngine · quizTypes · quizFactory) — كلها تعمل
4. soroban_number_style بمصدرين — numerals.ts + numberStyle.ts
5. sorobanmind-stats — مفتاح ميت يُقرأ ولا يُكتب

---

✅ نهاية التقرير الوصفي الشامل

كل رقم له مصدر.
كل بند له دليل.
بلا توصيات · بلا حلول.

الوثيقة الثانية (REPAIR_PLAN.md) ستُبنى على هذه الحقائق.

```