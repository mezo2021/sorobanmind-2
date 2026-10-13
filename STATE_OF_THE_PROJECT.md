
# 🧮 STATE_OF_THE_PROJECT.md
# التقرير الوصفي الشامل — SorobanMind v2

> **آخر تحديث:** 2026-10-13 (مساءً)
> **Commit:** `6583578`
> **الحالة:** 🟢 صيانة جزئية · البناء أخضر · التذاكر + Sorobania معدّلان
> **الغرض:** وصف محض · كل بند له مصدر
> **المصادر:** Audit v8 · build.log · KEYS_TABLE · STORES_TABLE · GAPS · فحص يدوي · جلسة 2026-10-13

---

## 1. البطاقة التقنية

| البند | القيمة |
|---|---|
| **الاسم** | SorobanMind v2 (أكاديمية السوروبان الدولية) |
| **النوع** | تطبيق تعليمي عربي · React Web |
| **الموضوع** | تعليم السوروبان الياباني (منهج تاكاشي كوجيما) |
| **الفئة** | أطفال (5-12) · كبار (13+) |
| **العمر** | 6 أشهر · ناجٍ من موت سريري × 2 |
| **المسار** | github.com/mezo2021/sorobanmind-2 |
| **النشر** | GitHub Pages · mezo2021.github.io/sorobanmind-2 |
| **Stack** | React 18 · Vite 5 · TypeScript 5.5 · Zustand 4 · Tailwind 3 · Framer Motion 11 · lucide-react |
| **Node** | v20.20.2 |
| **npm** | 10.8.2 |
| **Lockfile** | ❌ غير موجود |
| **`type`** | `"module"` (ESM) |

---

## 2. الأرقام الإجمالية

| المؤشر | القيمة | المصدر |
|---|---:|---|
| ملفات TypeScript/TSX | 172 (+4 من تقسيم Sorobania) | SUMMARY |
| أسطر الكود | ~51,500 | وثائق |
| الاستيرادات | 618 | SUMMARY |
| استدعاءات الدوال | 7,439 | SUMMARY |
| عمليات localStorage | 129 | SUMMARY |
| مفاتيح ثابتة | 49 | SUMMARY |
| مفاتيح ديناميكية | ~80 | GAPS |
| المتاجر (Zustand) | 4 | STORES_TABLE |
| البنوك (أسئلة) | 5 | فحص يدوي |
| مراجع الخصائص | 3,388 | SUMMARY |
| فجوات AST | 80 | GAPS |
| أخطاء نحوية | 0 | SUMMARY |
| وحدات مُحوَّلة (build) | 2,018 | build.log |
| حجم JS رئيسي | 1.70 MB | build.log |
| بعد Gzip | 367.76 KB | build.log |
| build exit code | **0** ✅ | build.exitcode |
| typecheck exit code | `not-configured` | typecheck.exitcode |

---

## 3. بنية المجلدات

```

sorobanmind-2/
├── .github/workflows/
│   ├── deploy.yml         ← النشر
│   ├── audit.yml          ← v6 (قديم)
│   └── audit-v8.yml       ← v8 (يعمل · AST)
│
├── scripts/
│   └── audit-ast.js       ← محلل AST
│
├── public/
│   ├── audio/ · images/ · stories/
│
├── src/
│   ├── App.tsx · types.ts
│   │
│   ├── components/games/
│   │   ├── FlyingAbacus/
│   │   ├── Detective/
│   │   ├── Friends/
│   │   ├── Pirates/        ← 9 ملفات
│   │   ├── Sorobania/      ← 5 ملفات (بعد التقسيم)
│   │   ├── gamesData.ts
│   │   ├── GamesListScreen.tsx
│   │   ├── GameCompanion.tsx
│   │   ├── HighScoreBadge.tsx
│   │   └── highScoreStore.ts
│   │
│   ├── flash/ · soroban2d5/ · avatars/
│   │
│   ├── store/
│   │   ├── progressStore.ts
│   │   ├── masteryBadgesStore.ts
│   │   └── numberStyleStore.ts
│   │
│   ├── hooks/             ← 7
│   ├── screens/           ← 22
│   ├── engine/            ← 5
│   ├── curriculum/ · data/ · utils/ · i18n/
│   └── assets/avatars/
│
└── [40+ ملف .md]

```

---

## 4. المتاجر الأربعة

### 4.1 `progressStore`

| البند | القيمة |
|---|---|
| الملف | `src/store/progressStore.ts` |
| الأسطر | 670 |
| مفتاح persist | `sorobanmind-v2-progress` |
| version | **9** |
| migrations | 7 |
| الثوابت | `TICKET_COST=10` · **`TICKET_XP_CAP=50`** · **`TICKETS_MAX=5`** |

**الحقول (28):**
`childName · category · categoryChosenAt · completedLevels · completedLessons · passedPractice · passedAnzanVisual · passedAnzanAudio · grades · pendingRemediation · remediationHistory · exam1Passed · exam2Passed · placementAttempts · lastPlacementAttempt · skillProgress · levelExams · totalXP · currentStreak · lastPlayedDate · anzanBadges · anzanAudioBadges · completedEnrichment · language · soundEnabled · voiceEnabled · hapticsEnabled · ticketXP · tickets`

**الإجراءات (30):**
`setChildName · setCategory · markLevelComplete · markLessonCompleted · markPracticePassed · markAnzanVisualPassed · markAnzanAudioPassed · setGrade · getGrades · computeFinalScore · setPendingRemediation · clearPendingRemediation · addRemediationSession · setExam1Passed · setExam2Passed · recordPlacementAttempt · setAnzanBadge · setAnzanAudioBadge · completeEnrichment · recordAttempt · completeLevel · addXP · updateStreak · setLanguage · toggleSound · toggleVoice · toggleHaptics · reset · buyTicket · consumeTicket`

**المستهلكون:** 16 ملفاً

---

### 4.2 `masteryBadgesStore`

| البند | القيمة |
|---|---|
| الملف | `src/store/masteryBadgesStore.ts` |
| الأسطر | 124 |
| مفتاح persist | `soroban_mastery_badges` |
| version | 1 |
| الإجراءات | `awardBadge · hasBadge · getBadge · getAllBadges · count · reset` |
| المستهلكون | 6 |

---

### 4.3 `numberStyleStore`

| البند | القيمة |
|---|---|
| الملف | `src/store/numberStyleStore.ts` |
| الأسطر | 30 |
| مفتاح persist | `NUMBER_STYLE_KEY` (= `soroban_number_style`) |
| الحقول | `style` |
| الإجراءات | `setStyle · toggleStyle` |
| المستهلكون | 15 |

---

### 4.4 `LangState`

| البند | القيمة |
|---|---|
| الملف | `src/i18n/useTranslation.ts` |
| مفتاح persist | `sorobanmind-v2-lang` |
| الحقول | `lang` |
| المستهلكون | `SorobanEngineDebug` (فقط) |

**اكتشاف Audit v8.** الترجمة **ليس معزولة**.

---

## 5. البنوك الخمسة

| البنك | المسار | الحجم | الحالة |
|---|---|---:|---|
| **Bank A** | `srb/questions/` | 275 | ✅ حي |
| **Bank B** | `srb/exam/` | 666 | ✅ مربوط |
| **Bank v2** | `bank-v2/` | 583 | 🟡 معزول |
| **Bank Raw** | `bank-raw/` | ~600 | 🟡 معزول |
| **`data/bank.ts`** | `data/bank.ts` | 1,201 | 🔴 بلا مستهلك |

**⚠️ تحذير:** `data/bank.ts` ≠ `games/Friends/bank.ts` (يعمل).

---

## 6. المفاتيح — الخريطة

### 6.1 المفاتيح الثابتة الحيّة

| المفتاح | الكتابة | القراءة |
|---|---|---|
| `soroban_companion` | HeroDashboard | FloatingCompanion · FlyingAbacus |
| `soroban_child_name` | HeroDashboard · RoleSelection | App · 4 ألعاب |
| `soroban_child_full_name` | CertificateScreen · KidsCertificate | نفسهما |
| `soroban_completed_lessons` | App (×2) | App (×2) |
| `soroban_completed_levels` | App | CategoryExamScreen |
| `soroban_passed_practice` | App | App |
| `soroban_placement_*` | App | CategoryScreen · HeroDashboard |
| `soroban_number_style` | numberStyle · numerals | numberStyle · numerals |

### 6.2 المفاتيح اليتيمة

| المفتاح | القارئ | المشكلة |
|---|---|---|
| `soroban_passed_level_tests` | CategoryScreen:179 · LevelScreen:139 | لا كاتب |
| `soroban_exam_result` | HeroDashboard:163 | لا كاتب |

### 6.3 المفاتيح المكتوبة ديناميكياً

`soroban_exam1_passed` · `soroban_exam2_passed` · `soroban_exam1_score` · `soroban_exam2_score`

### 6.4 المفاتيح الديناميكية (~25)

**متاجر (4):** مفاتيح persist
**بنوك (3):** `srb_progress` · `soroban_weak_skills_v2` · `soroban_placement_weak_skills`
**Sorobania (1):** `sorobania_progress_v2`
**ألعاب (6):** `soroban_high_scores_v1` · `_month` · `pirate_sound_v1` · `soroban_friends_*` · `soroban_laser_theme_v1`
**دروس (4):** `soroban_lesson_session_*` · `soroban_lesson_progress` · `L0_TEST_*`
**إعدادات (4):** `CHARACTER_STORAGE_KEY` · `NAME_STORAGE_KEY` · `COMPANION_STORAGE_KEY` · `soroban_welcome_seen`
**إثراء (2):** `BEST_SCORES_KEY` · `COMPLETED_KEY`
**شارات (3):** `soroban_anzan_badges` · `soroban_anzan_audio_badges` · `sorobanmind-stats`
**أخرى (3):** `soroban_dev_preview` · `soroban_number_style` (dynamic)

---

## 7. الفجوات الـ80

**النوع الوحيد:** `dynamic-storage-key`
**الأنماط:** ثوابت مستوردة · قوالب نصية · متغيرات محسوبة
**الحكم:** قيود AST · لا أخطاء برمجية.

---

## 8. أكبر 20 ملفاً

| # | الملف | الأسطر |
|:-:|---|---:|
| 1 | `srb/exam/L1.ts` | 4,348 |
| 2 | `srb/exam/L2.ts` | 1,555 |
| 3 | `srb/exam/L3.ts` | 1,553 |
| 4 | `srb/exam/L4.ts` | 1,553 |
| 5 | `LessonScreen.tsx` | 1,382 |
| 6 | `GuardianDashboard.tsx` | 1,373 |
| 7 | `srb/exam/L5.ts` | 1,233 |
| 8 | `data/bank.ts` | 1,201 |
| 9 | `adaptiveEngine.ts` | 1,072 |
| 10 | **`Sorobania/SorobaniaGame.tsx`** | **1,057** ⬅ (كان 2,398) |
| 11 | `AnzanScreen.tsx` | 1,032 |
| 12 | `PirateRaceGame.tsx` | 1,012 |
| 13 | `FriendsGame.tsx` | 906 |
| 14 | `AudioAnzanScreen.tsx` | 900 |
| 15 | `curriculum/L2/S06.ts` | 864 |
| 16 | `FlyingAbacusGame.tsx` | 863 |
| 17 | `CategoryExamScreen.tsx` | 851 |
| 18 | `srb/questions/L2.ts` | 840 |
| 19 | `curriculum/L3/S07.ts` | 815 |
| 20 | `srb/exam/L6.ts` | 779 |

---

## 9. الألعاب الخمس

| # | اللعبة | ID | البطل | الحالة |
|:-:|---|---|---|---|
| 1 | العداد الطائر | `flying-abacus` | المختار | ✅ |
| 2 | المحقق الرقمي | `detective` | جود | ✅ |
| 3 | دوجو السوروبان | `friends` | شام | ✅ |
| 4 | سباق القراصنة | `pirate-race` | ريان | ✅ (جسر القسمة يعمل) |
| 5 | جزيرة سوروبانيا | `sorobania-island` | بانة | ✅ (5 ملفات) |

---

## 10. المنهج — 8 مستويات · 15 درساً · 51 مهارة

| المستوى | الاسم | الدروس | الحالة |
|---|---|---|---|
| L0 | التمهيدي | intro · S01 · S02 | ✅ |
| L1 | الجمع والطرح | S03 · S04 | ✅ |
| L2 | الضرب | S05 · S06 | 🟡 |
| L3 | القسمة | S07 · S08 | 🟡 |
| L4 | سلاسل | S09 · S10 | 🔴 |
| L5 | ضرب وقسمة متقدم | S11 · S12 | 🔴 |
| L6 | الكسور العشرية | S13 · S14 | 🔴 |
| L7 | الجذور | S15 | 🔴 |

---

## 11. الملفات المعزولة

| الملف | الأسطر | الحالة |
|---|---:|---|
| `data/bank.ts` | 1,201 | 🔴 معزول |
| `data/curriculum.ts` | 312 | 🔴 معزول |
| `engine/adaptiveEngine.ts` | 1,072 | 🟡 معزول |
| `engine/problemGenerator.ts` | 446 | 🟡 معزول |
| `engine/masteryTracker.ts` | 418 | 🟡 داخلي |
| `utils/skillsChecker.ts` | 176 | 🔴 معزول |
| `utils/audioAnzanBadges.ts` | 27 | 🔴 معزول |
| `utils/anzanBadges.ts` | 34 | 🟡 يُستورد من `badgeChecker` |
| `DebugOverlay.tsx` | 89 | 🟡 تشخيص |
| `SorobanEngineDebug.tsx` | 217 | 🟡 تشخيص |
| `i18n/ar.ts` · `en.ts` | 622 | 🔴 معزول |

**نشط:** `games/Friends/bank.ts` · `games/Pirates/*` · `data/srb/*`

---

## 12. حجم الحزمة

- **JS:** 1.70 MB · Gzip 367.76 KB
- **CSS:** 96.57 KB · Gzip 15.00 KB
- **أكبر أصل:** `joud2.png` (388 KB)

---

## 13. البناء

| المؤشر | النتيجة |
|---|---|
| `tsc` | ✅ |
| `vite build` | ✅ |
| exit code | 0 |
| `typecheck` script | ❌ غير موجود |
| نشر GitHub Pages | ✅ |

---

## 14. المخاطر

### مؤكدة

| # | الوصف | الأولوية |
|:-:|---|:-:|
| 1 | `soroban_passed_level_tests` بلا كاتب | 🔴 |
| 2 | `soroban_exam_result` بلا كاتب | 🔴 |
| 3 | `soroban_number_style` بمصدرين | 🟠 |
| 4 | `data/bank.ts` معزول 1,201 سطر | 🟠 |
| 5 | حجم الحزمة 1.70 MB | 🟠 |
| 6 | `joud2.png` 388 KB | 🟠 |
| 7 | 20 ملفاً > 800 سطر | 🟡 |
| 8 | لا Lockfile | 🟡 |
| 9 | لا script typecheck | 🟡 |

### محسومة ✅

- Bank A + B يعملان
- `recordAttempt` في 3 شاشات
- العشرية في CE1 · CE2 · PT
- 0 أخطاء نحوية
- 5 ألعاب تعمل
- `keysToKeep` = 11 مفتاحاً

---

## 15. ما أُنجز في جلسة 2026-10-13

### التذاكر
- ✅ `TICKET_XP_CAP: 20 → 50`
- ✅ `TICKETS_MAX: 1 → 5`
- ✅ اختبار الاقتصاد نجح

### Sorobania
- ✅ تقسيم من ملف واحد → **5 ملفات**
- ✅ جسر القسمة + الضرب يعملان

### GuardianDashboard
- ✅ `handleReset` — 4 → **11 مفتاحاً** (يشمل `sorobania_progress_v2`)
- ✅ `handleBackup` — بلا فلتر
- ✅ `handleRestore` — مسح قبل الكتابة

### GamesListScreen
- ✅ العنوان: `مَحْفَظَةُ النِّقَاط: {ticketXP}`
- ✅ `dir="ltr"` للأرقام
- ✅ نص توجيهي للطفل

### Audit v8
- ✅ AST يعمل
- ✅ تقرير كامل

### القائمة النهائية لـ`keysToKeep`

```

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

## 16. ما لم يُنجَز

- ❌ الهجرة الكاملة (bank-v2 · raw · linked)
- ❌ توحيد المتاجر
- ❌ تنظيف المفاتيح اليتيمة
- ❌ تفكيك الملفات الضخمة (>800 سطر)
- ❌ تقليل الحزمة
- ❌ `typecheck` script
- ❌ Lockfile
- ❌ إصلاح `isPreviewMode()` في Sorobania
- ❌ إضافة `dispose()` في `sorobaniaSfx`
- ❌ اسم الطفل صوتياً في 4 ألعاب

---

## 17. الملفات المرجعية

| الملف | الحالة |
|---|---|
| `SESSION_2026-10-13.md` | ✅ محدّث |
| `GAMES_CITY.md` | 🟡 يحتاج مراجعة |
| `MASTER_REFERENCE.md` | 🟡 يحتاج مراجعة |
| `PROJECT_MASTER.md` | 🟡 قديم |
| `ACHIEVEMENTS.md` | 🟡 تراكمي |
| `AL-ISLAH-V2.md` | 🟡 مرجعي |
| `FLASH-SECTION.md` | ✅ |
| `README.md` | ✅ |

---

## 18. ملاحظات

1. `LangState` — اكتشاف Audit v8 · الترجمة **ليست معزولة**
2. `data/bank.ts` ≠ `games/Friends/bank.ts`
3. بنوك القراصنة — كلها تعمل (mulEngine · divEngine · quizTypes · quizFactory)
4. `soroban_number_style` — مصدران (`numerals.ts` + store)
5. `sorobanmind-stats` — مفتاح ميت
6. `sorobania_progress_v2` — مفتاح حقيقي · يُحفظ الآن

---

## ✅ نهاية التقرير