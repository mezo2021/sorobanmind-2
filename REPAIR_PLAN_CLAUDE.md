🛠️ REPAIR_PLAN_CLAUDE.md

خطة الإصلاح الشاملة v2 — SorobanMind v2

المصدر: Claude · مبنية على تحليل مباشر لـaudit-data.json + MASTER_REPORT.md + audit-v9.txt الكامل
التاريخ: 2026-10-13
HEAD: 6416aa4
الحالة: البناء أخضر · التطبيق منشور ويعمل
الطريقة: تحليل أدلة فعلية · لا نقل من STATE_OF_THE_PROJECT

---

<div dir="rtl">

🧭 الجزء 1 — ما اكتشفه التحليل المباشر

1.1 أخطاء وظيفية حقيقية (لم تكن مرصودة في STATE)

# الاكتشاف الدليل الأثر
F1 🔴 المفاتيح soroban_anzan_stats · soroban_practice_stats · sorobanmind-stats · soroban_exam_result لها قارئ ولا كاتب في كامل المشروع v8: الـ129 عملية تخزين مدرجة؛ لا توجد أي setItem في AnzanScreen ولا PracticeScreen ولا AudioAnzanScreen. القراء: hooks/useQuests.ts (36،84) · utils/badgeChecker.ts (10،19،30) · utils/skillsChecker.ts لوحة ولي الأمر (GuardianDashboard:197 → useQuests): كل المهام من نوع practice/anzan/anzanHighScore/streak/badges/addition/subtraction/multiplication/division تعرض 0 دائماً. الشارات القديمة (useGameStats:50 → getAllEarnedBadges): الأنواع xp · exam_passed · anzan_badge · all_anzan_badges لا تُمنح أبداً
F2 🔴 نظامان للشارات لا يلتقيان AnzanScreen:453 يكتب progressStore.anzanBadges (داخل sorobanmind-v2-progress) بينما badgeChecker يقرأ soroban_anzan_badges عبر loadAnzanBadges() — وsaveAnzanBadges بلا مستدعٍ (v9 §9) شارات الأنزان المكتسبة فعلياً لا تُحتسب في نظام BADGES القديم
F3 🔴 all_anzan_badges غير قابلة للتحقق حتى لو أُصلح التخزين badgeChecker:1034-1042 يشترط master_mixed؛ وgetAnzanBadgeKey يُرجع null للقسمين S11/S12 (إلغاء master_mixed — AnzanScreen:12،101). وواجهة AnzanBadges في utils/anzanBadges.ts تفتقد master_chains الموجودة في progressStore شارة مستحيلة
F4 🟠 مهارة «الاستماع» في skillsChecker تقرأ soroban_anzan_audio_badges التي لا يكتبها أحد (الكاتب الفعلي progressStore.anzanAudioBadges) v9 §9 + skillsChecker:783 (الملف نفسه ميت لكن منطقه سيُعاد استخدامه — انظر المرحلة 4)
F5 🟠 utils/numberStyle.ts (loadNumberStyle/saveNumberStyle) يقرأ/يكتب نصاً خاماً "arabic" على المفتاح soroban_number_style، بينما numberStyleStore (zustand persist) يخزّن JSON {"state":{"style":..},"version":0} على نفس المفتاح v9: numberStyle.ts:2882-2893 مقابل numberStyleStore:471 لا مستدعين حالياً (0 استدعاء للدالتين) فلا ضرر ظاهر؛ لكن أي استدعاء مستقبلي سيُفسد الحالة. وutils/numerals.ts غير مستورد من أي ملف (ليس «مصدراً ثالثاً حيّاً» كما كُتب في STATE)
F6 🟠 useQuests يعيد قراءة localStorage وتحليل JSON لـ4 مفاتيح كل ثانيتين عبر setInterval v9:1226-1245 هدر أداء على الأجهزة الضعيفة + لا فائدة (المفاتيح لا تُكتب أصلاً)
F7 🟠 لا يوجد أي ملف اختبار في المشروع (البحث عن test/spec يعيد 3 ملفات تطبيق فقط) رغم وجود سكربت test:run (vitest) v8 files vitest run يفشل عادةً عند عدم وجود اختبارات؛ والبناء الأخضر لا يغطي أي منطق
F8 🟠 صفر code-splitting: 0 import() ديناميكي · 0 React.lazy · main.tsx → App يستورد 22 شاشة و5 ألعاب بشكل ساكن v8 imports/calls بنوك data/srb (20,564 سطراً؛ منها exam = 12,300) تدخل الحزمة الرئيسية → 1.70 MB
F9 🟡 LevelTestScreen.tsx وPlacementTestScreen.tsx وL0/test-pool.ts تحمل كلمة test؛ وcurriculum/lessons/L0/test-pool.ts غير مستورد من أي ملف v8 reachability مجموعة اختبار L0 غير مستخدمة — تحقق هل L0 يعتمد على srb/exam/L0.ts بديلاً
F10 🟡 soroban_completed_lessons يُكتب من مكانين: App.tsx:351,394 وLessonScreen.tsx:332,658 (عبر LESSON_PROGRESS_KEY) بالإضافة إلى progressStore.completedLessons v8 ثلاث مصادر حقيقة للتقدم → خطر تضارب
F11 🟡 soroban_section2_unlocked: كاتبان (App:537 بنص 'true' · CategoryExamScreen:245 بـJSON.stringify(true)) بلا أي قارئ. soroban_kids_certificate_ready: كاتب بلا قارئ. soroban_placement_result: كاتب (App:234) بلا قارئ v8 KEYS_TABLE + v9 §5 بيانات ميتة تُكتب
F12 🟡 ثلاثة ثوابت باسم WEAK_KEY في ملفات مختلفة (FriendsGame:145، bank-v2/placement-engine:238، data/srb/exam/index.ts:257) وثابت WEAK_SKILLS_KEY في bank-v2/index.ts:319 v8 expr احتمال تصادم مفاتيح (قد يشير اثنان منها إلى soroban_weak_skills_v2). ممنوع حذف أي منها قبل استخراج القيم

---

1.2 تصحيحات لتقرير STATE_OF_THE_PROJECT

البند في STATE الصحيح بحسب الأدلة
«أسطر الكود ~51,500» 68,209 سطراً في 168 ملفاً (v8). (بعد تقسيم Sorobania تقريباً نفس المجموع)
«L2–L7 لم تُبنَ» L0 + L1 + L2 + L3 مبنية ومربوطة في curriculum/lessons/index.ts (intro, S01…S08 = 9 دروس). المفقود: L4–L7 (S09–S15) فقط
المفتاح soroban_anzan_stats/practice_stats ✅ «يكتبها AnzanScreen/PracticeScreen» لا كاتب (F1)
sorobanmind-stats «ميت/🟡» ليس ميتاً: له قارئان نشطان (useQuests · badgeChecker) وهو سبب عطب الشارات والمهام
«soroban_passed_level_tests يتيم كتابةً» غالباً ليس يتيماً: LevelTestScreen:234-238 تكتب عبر ثابت PASSED_TESTS_KEY — نتيجة v9 (grep حرفي) تعجز عن حل الثوابت. يلزم التحقق من قيمة الثابت
«soroban_child_name لا كاتب» الكاتب موجود: RoleSelection.tsx:47 عبر NAME_STORAGE_KEY
«soroban_placement_recommended/weak_skills يتيم» الكاتب موجود: App.tsx:224,229 (v8 ثابت). تعارض v8/v9 سببه حدود grep
«soroban_exam1/2_passed/score لم تُذكر» تُكتب ديناميكياً: ${cfg.storageKey}_passed/_score (CategoryExamScreen:231-233) وتُقرأ في CategoryScreen:190-191 · CertificateScreen:54،59 · HeroDashboard:135 — وتكرّر progressStore.exam1Passed/exam2Passed
soroban_placement_last_attempt «ميت» غير موجود حتى في v8 (لا عملية تخزين تحمله) → ربما أُزيل من الكود؛ يُحذف من الوثائق فقط
numerals.ts «مصدر ثالث حيّ» ميت (0 مستورد)
SorobanEngineDebug/sorobanEngine/sorobanMoves «مجمّدة تُستدعى من Debug» SorobanEngineDebug.tsx نفسه غير مستورد → كامل engine/ (2,439 سطراً) ميت
v8 كمصدر حقيقة v8 مأخوذ على commit 6583578 (SorobaniaGame ما زال 2,398 سطراً)، وv9 على 6416aa4. يجب إعادة تشغيل v8 على HEAD قبل اعتماد أي رقم
«20 ملفاً > 800 سطر» 24 في v8 (≈23 بعد التقسيم)، منها 11 ملف بيانات فقط

---

1.3 الكود الميت المؤكد بالوصولية

35 ملفاً · 9,600 سطر غير قابلة للوصول من main.tsx:

العنقود الأسطر الملفات
data/bank-v2/* 2,802 index · bank-exam · part-01…04 · placement-engine · types
engine/* 2,439 adaptiveEngine · problemGenerator · masteryTracker · sorobanEngine · sorobanMoves
data/bank.ts 1,201 (يستورده bank-adapter فقط)
data/bank-raw/* 941 index · raw-01…07 · types
data/bank-linked.ts + bank-adapter.ts 852 
data/curriculum.ts 313 
components/SorobanEngineDebug.tsx 218 
utils/skillsChecker.ts 177 0 مستورد (STATE أصاب)
data/srb/remediation.ts 152 ⚠️ جديد — 0 مستورد؛ RemediationScreen يأخذ buildRemediationPlan من srb-adapter
utils/numerals.ts 127 
components/BadgeModal.tsx 110 ⚠️ جديد — واجهة الشارات القديمة غير موصولة
components/NumberStyleToggle.tsx 93 ⚠️ جديد — 0 مستورد (تحقق أين يغيّر المستخدم نمط الأرقام فعلاً: Header؟)
data/modes.ts 77 ⚠️ جديد
curriculum/lessons/L0/test-pool.ts 70 ⚠️ جديد
utils/audioAnzanBadges.ts 28 

ملاحظة: vite-env.d.ts ambient وليس ميتاً.
ملاحظة: data/index.ts (بيانات v1: LEVELS/QUESTS/BADGES) حيّ عبر useQuests وbadgeChecker.

---

1.4 خريطة الثوابت الديناميكية

كل ما يلي يحتاج استخراج القيمة النصية (خطوة 0.3):

ملفات التخزين وثوابتها:

· App → WELCOME_STORAGE_KEY
· CharacterSelector → CHARACTER_STORAGE_KEY
· RoleSelection → NAME_/COMPANION_STORAGE_KEY
· FriendsGame → SYMBOL_SEEN_KEY, WEAK_KEY, THEME_KEY
· PirateRaceGame → SOUND_KEY
· SorobaniaGame → PROGRESS_KEY, LEGACY_KEY, MUTE_KEY
· highScoreStore → STORAGE_KEY, MONTH_KEY
· bank-v2/index → WEAK_SKILLS_KEY
· bank-v2/placement-engine → WEAK_KEY
· srb/exam/index → WEAK_KEY
· srb/progress → STORAGE_KEY
· LessonScreen → LESSON_SESSION_PREFIX+lessonId, LESSON_PROGRESS_KEY
· LevelTestScreen → LAST_ATTEMPT_KEY(levelId), PASSED_TESTS_KEY
· FingerMathScreen → COMPLETED_KEY
· MagicSecretsScreen → BEST_SCORES_KEY
· previewMode → PREVIEW_KEY
· GuardianDashboard → key (حلقات نسخ/استعادة/تصفير)

---

📏 الجزء 2 — قواعد التنفيذ

1. فرع لكل مرحلة fix/pN-name + وسم pre-pN قبل البدء. دمج بـsquash بعد النجاح.
2. بوابة كل commit: npm run build (exit 0) + npx tsc --noEmit + Smoke يدوي.
3. لا حذف ملف إلا بعد: grep -rn "<basename>" src/ + إعادة تشغيل audit-v8 (الوصولية) + بناء أخضر.
4. أي تغيير في شكل بيانات مستخدم حقيقي = migration additive (اقرأ القديم → اكتب الجديد → لا تحذف) ثم حذف القديم في إصدار لاحق.
5. قبل P3 و P4 صدّر نسخة احتياطية من متصفح تجريبي (handleBackup) واحتفظ بها كـfixture اختبار.
6. بعد كل مرحلة: حدّث STATE_OF_THE_PROJECT.md بالتصحيحات (الجزء 1.2).

---

🅿️ المرحلة 0 — خط الأساس والتحقق

المدة: ساعتان · لا تغيير كود

# الخطوة الإجراء المخرج
0.1 إعادة تشغيل v8 + v9 على HEAD الحالي تشغيل workflows audit-v8 وaudit-v9 على main أرقام موثوقة
0.2 سجل خط الأساس npm run build → سجّل حجم JS/CSS والزمن؛ git rev-parse HEAD جدول baseline
0.3 استخراج قيم كل الثوابت grep -rnE "(_KEY\|STORAGE_KEY\|_PREFIX)\s*=" src/ \| sort وسجّل القيم في docs/KEYS_RESOLVED.md حل 74 مفتاحاً ديناميكياً دفعة واحدة
0.4 حسم التصادمات (F12) قارن قيم WEAK_KEY×3 وWEAK_SKILLS_KEY؛ وقيمة PASSED_TESTS_KEY وLESSON_PROGRESS_KEY وcfg.storageKey جدول تصادم
0.5 تأكيد F1 يدوياً grep -rnE "soroban_anzan_stats\|soroban_practice_stats\|sorobanmind-stats\|soroban_exam_result" src/ + فحص DevTools تأكيد/نفي
0.6 تأكيد سبب test:run npx vitest run محلياً قرار P1.4
0.7 تأكيد مكان تبديل نمط الأرقام ابحث عن toggleStyle/setStyle استدعاءات قرار حذف NumberStyleToggle

معيار القبول: وثيقة docs/KEYS_RESOLVED.md + تأكيد/نفي مكتوب لكل من F1 وF12.

---

🅿️ المرحلة 1 — أدوات البناء والـCI

المدة: 3 ساعات · خطر منخفض

# المهمة التفاصيل القبول
1.1 Lockfile npm install → commit package-lock.json → غيّر deploy.yml إلى npm ci CI أخضر بـnpm ci
1.2 typecheck "typecheck": "tsc --noEmit" exit 0
1.3 lint eslint + @typescript-eslint بقواعد دنيا (no-unused-vars, no-undef, react-hooks/rules-of-hooks) يعمل دون أخطاء
1.4 vitest إن كان 0.6 فاشلاً: test: { passWithNoTests: true, environment: 'jsdom' } مؤقتاً npm run test:run exit 0
1.5 CI موحد ci.yml: install(ci) → typecheck → lint → test:run → build على كل PR؛ أرشف audit.yml القديم PR يفشل عند كسر أي خطوة
1.6 رفع حد التحذير build.chunkSizeWarningLimit: 600 بعد P7 فقط —

---

🅿️ المرحلة 2 — حذف الكود الميت بأمان

المدة: نصف يوم · خطر منخفض · الهدف: إزالة 9,600 سطر و35 ملفاً

الدفعات

الدفعة الملفات تحقق قبل الحذف
2.A عنقود المحرك engine/* (5) + components/SorobanEngineDebug.tsx grep -rn "SorobanEngineDebug\|engine/" src → لا مستورد خارج المجموعة
2.B عنقود البنوك القديمة data/bank-linked.ts · bank-adapter.ts · bank-raw/* · bank-v2/* · data/bank.ts أولاً نفّذ بند 2.F. لا تلمس games/Friends/bank.ts ولا data/srb/*
2.C أدوات ميتة utils/skillsChecker.ts · utils/numerals.ts · utils/audioAnzanBadges.ts · data/curriculum.ts · data/modes.ts grep للأسماء المصدّرة
2.D واجهات غير موصولة components/BadgeModal.tsx · components/NumberStyleToggle.tsx قرار منتج: توصيل أم حذف؟
2.E ملفان مشتبه data/srb/remediation.ts · curriculum/lessons/L0/test-pool.ts قارن remediation.ts بالدوال في srb-adapter.ts
2.F مفاتيح بعد الحذف احذف soroban_weak_skills_v2 فقط إذا أثبتت 0.4 أن srb/exam/index.ts لا يشاركها المفتاح جدول 0.4

معيار القبول: grep الوصولية يعيد 0 ملفاً غير موصول (باستثناء vite-env.d.ts)؛ Smoke كامل.
التراجع: git revert للدفعة.

---

🅿️ المرحلة 3 — إصلاح تدفق الإحصائيات والشارات (F1–F4, F6)

المدة: يوم ونصف · 🔴 الأعلى أثراً

قرار التصميم: مصدر حقيقة واحد = progressStore

لا نُنشئ مفاتيح جديدة، بل نُنهي القراءة من مفاتيح لا تُكتب.

3.1 توسيع progressStore (migration v9 → v10، additive)

```ts
stats: {
  practiceTotal: number; practiceCorrect: number;
  byOp: { add: number; sub: number; mul: number; div: number };
  anzanRounds: number; anzanCorrect: number; anzanHighScore: number;
}
```

· قيم أولية 0 في initialState + migration تضيف stats إن غابت.
· إجراءان جديدان: recordPracticeResult({op, correct}) وrecordAnzanRound({correct, total, score}).
· حدّث GuardianDashboard.keysToKeep (يبقى المفتاح sorobanmind-v2-progress كما هو).

3.2 توصيل الكتّاب (3 نقاط فقط)

الشاشة الموضع الاستدعاء
PracticeScreen.tsx بجوار recordAttempt (≈ 308) recordPracticeResult لكل سؤال
AnzanScreen.tsx بجوار recordAttempt (≈ 403) recordAnzanRound
AudioAnzanScreen.tsx بجوار recordAttempt (≈ 346) recordAnzanRound

· يُستدعى داخل handler الإجابة لا داخل render، مع حماية من التكرار (useRef).

3.3 إعادة كتابة useQuests

· احذف setInterval ومستمع storage؛ استخدم selectors من useProgressStore.

جدول الربط:

نوع المهمة المصدر الجديد
practice stats.practiceTotal
anzan stats.anzanCorrect
anzanHighScore stats.anzanHighScore
streak currentStreak
lessons completedLessons.length
addition/subtraction/multiplication/division stats.byOp.*
badges عدد (anzanBadges) + (anzanAudioBadges) + masteryBadgesStore.count()

3.4 إعادة كتابة badgeChecker

النوع المصدر الجديد
lessons / all_lessons useProgressStore.getState().completedLessons
xp totalXP
exam_passed exam1Passed \|\| exam2Passed
anzan_badge anzanBadges[req.badge]
all_anzan_badges قرار منتج (F3): master_addition ∧ master_multiplication ∧ master_division ∧ master_chains

· حوّلها إلى دوال تأخذ state كمعامل (قابلة للاختبار).

3.5 توحيد الشارات

· احذف utils/anzanBadges.ts وaudioAnzanBadges.ts (بعد 3.4).
· استخدم نوع AnzanBadges من progressStore فقط.

3.6 تنظيف

· احذف المفاتيح الميتة من الشيفرة (sorobanmind-stats · soroban_anzan_stats · soroban_practice_stats · soroban_exam_result · soroban_anzan_badges · soroban_anzan_audio_badges) وأضفها إلى قائمة «مفاتيح قديمة تُحذف عند الإقلاع».

القبول: بعد جلسة تدريب + أنزان: لوحة ولي الأمر تعرض أرقاماً > 0، وشارة xp تُمنح، وexam_passed تُمنح بعد نجاح الامتحان.

---

🅿️ المرحلة 4 — مصدر واحد لكل مفتاح (F10, F11)

المدة: يوم · 🟠

4.1 src/utils/storageKeys.ts

مصدر وحيد لكل أسماء المفاتيح (من KEYS_RESOLVED.md) + makeKey(ns, ...parts) للديناميكية.

4.2 حسم ازدواجية التقدّم (F10)

البيانات المصدر المزدوج الإجراء
الدروس المكتملة soroban_completed_lessons + completedLessons markLessonCompleted الكاتب الوحيد؛ migration union
المستويات المكتملة soroban_completed_levels + completedLevels نفس الإجراء
passed practice soroban_passed_practice + passedPractice نفس الإجراء
exam1/2 soroban_exam{1,2}_passed/score + exam1Passed/2Passed أضف examScores؛ migration
passed level tests PASSED_TESTS_KEY + levelExams/grades.levelTest تحقق (0.4) ثم وحّد
placement soroban_placement_* + lastPlacementAttempt وحّد؛ احذف placement_result
اسم الطفل soroban_child_name (7 قراء) + childName ⚠️ الأخطر: أنشئ getChildName() واحدة

4.3 مفاتيح بلا قارئ

· soroban_section2_unlocked + soroban_kids_certificate_ready: قرار منتج — توصيل أو حذف.
· soroban_placement_result: احذف الكتابة (App:234).

4.4 GuardianDashboard

· اجعل القوائم مشتقة من storageKeys.ts:
  · KEEP_ON_RESET
  · BACKUP_PREFIXES = ['soroban','sorobanmind','srb_','sorobania_']
· أضف المفاتيح الديناميكية (lesson_session:*, *_last_attempt).

4.5 مفتاح نمط الأرقام (F5)

· احذف loadNumberStyle/saveNumberStyle من utils/numberStyle.ts.

القبول: grep -rn "localStorage\." src/ لا يعيد إلا: ملفات المتاجر + storageKeys.ts + أدوات موثقة.
audit-v8 → dynamic-storage-key ≤ 20.

---

🅿️ المرحلة 5 — adapter البنك SRB وتدفق الدرجات

المدة: يوم · 🔴

# الخطوة التفاصيل
5.1 جرد دوال srb-adapter.ts (361 سطراً) getPracticeQuestions · getAnzanQuestions · getAudioAnzanQuestions · buildSession · saveSectionGrade · countModulesInLevel · buildRemediationPlan · getRemediationTitle/Description
5.2 اختبار سلوك لكل دالة (vitest) حالات: L0…L7 × phases · تكرار seed · تصفية usedSet · حدود countPerLevel
5.3 تحديد الثلاث المعطوبة بالاختبار الفاشل سجّلها في docs/SRB_ADAPTER_BUGS.md
5.4 الإصلاح بنمط red→green لكل دالة commit مستقل
5.5 srb/progress.ts (541 سطراً) اختبار saveLevelGrade/makeLevelKey/الحذف
5.6 حسم srb/remediation.ts (انظر 2.E)

القبول: تغطية ≥ 70% لـsrb-adapter وsrb/progress وsessionBuilder.

---

🅿️ المرحلة 6 — الأداء وحجم الحزمة (F8)

المدة: يوم · 🟠
الهدف: JS الأولي ≤ 600 KB (gzip ≤ 180 KB). الحالي: 1,696 KB / 367.8 KB.

# الخطوة الأثر المتوقع
6.1 بعد P2 مباشرة أعد القياس حذف ~9,600 سطر ميت
6.2 React.lazy لكل الشاشات الثقيلة الأكبر
6.3 تحميل بنوك data/srb/exam/L1…L7 وquestions/L1…L7 بـimport() يزيل ~17,000 سطر
6.4 manualChunks: react · framer-motion · lucide-react · zustand · srb-data · curriculum تخزين مؤقت أفضل
6.5 الدروس curriculum/lessons/L2…L3 بتحميل كسول 
6.6 الصور: joud2.png 388 KB → WebP ≤ 70 KB؛ bana/sham/rayan PNG → WebP −450 KB
6.7 lucide-react: تأكد من الاستيراد بالأسماء 
6.8 Error Boundary + fallback لـSuspense 
6.9 قياس: npx vite-bundle-visualizer 
6.10 بعدها فقط: chunkSizeWarningLimit: 600 

القبول: تحميل أولي < 600 KB؛ لا شاشة بيضاء عند التنقل؛ لا ارتداد في الجلسات الصوتية.

---

🅿️ المرحلة 7 — الاختبارات والجودة (F7)

المدة: يومان · تتوازى مع 3–6

الحزمة ما يُختبر أولوية
متجر التقدّم كل migration من v1→v10؛ buyTicket/consumeTicket (TICKET_COST=10 · XP_CAP=50 · MAX=5)؛ computeFinalScore؛ recordAttempt 🔴
masteryBadgesStore classifySpeed حدود 0.5/0.75؛ awardBadge يحدّث أفضل زمن فقط 🔴
badgeChecker/useQuests الجديدان كل أنواع المتطلبات 🔴
srb-adapter/sessionBuilder/progress انظر 5.2 🔴
highScoreStore تدوير الشهر (MONTH_KEY) والمسح 🟠
GuardianDashboard نسخ → تصفير → استعادة (round-trip) 🟠
numberStyle formatNumber/Text/Prompt/parseInput/isValidInput 🟡
دخان واجهات render للشاشات الرئيسية 🟡
E2E اختياري Playwright: مسار طفل 🟡

الخطوات: npm i -D @testing-library/react @testing-library/jest-dom jsdom؛ إعداد setupTests.ts؛ إزالة passWithNoTests بعد أول 20 اختباراً؛ عتبة تغطية ≥ 50%.

---

🅿️ المرحلة 8 — تفكيك الملفات الضخمة

مستمرة · 🟡 — بعد P3–P6.
القاعدة: لا مكوّن UI > 600 سطر · commit لكل ملف.

الملف الأسطر التقسيم المقترح
LessonScreen.tsx 1,382 LessonHeader · StepRenderer · LessonFooter · useLessonSession
GuardianDashboard.tsx 1,373 تبويبات + useBackupRestore + QuestsPanel
AnzanScreen.tsx 1,032 Setup · Round · Result + useAnzanSession
PirateRaceGame.tsx 1,012 
SorobaniaGame.tsx 1,057 استكمال التقسيم
FriendsGame.tsx · AudioAnzanScreen · FlyingAbacusGame · CategoryExamScreen 851–906 نفس النمط
srb/exam/L1.ts (4,348)  قسّمها حسب القسم/المهارة (ملفات ≤ 800)
curriculum/lessons/L2/S05,S06 · L3/S07,S08 (≈ 810–860)  فصل المحتوى عن البنية

---

🅿️ المرحلة 9 — المنهج: L4–L7 (S09–S15)

محتوى · أسابيع

الحالة الفعلية: L0–L3 مبنية (9 دروس) + بنوك SRB موجودة لـL0–L7.
الناقص: دروس L4–L7 فقط.

المستوى الدروس بنك SRB جاهز؟
L4 سلاسل S09 · S10 ✅ questions/L4 + exam/L4
L5 ضرب وقسمة متقدم S11 · S12 ✅
L6 كسور عشرية S13 · S14 ✅
L7 جذور S15 ✅

لكل درس:

1. انسخ بنية L3/S07.ts (LessonNode).
2. أضفه إلى curriculum/lessons/index.ts.
3. اربط المهارات (51).
4. تحقق من data/srb/curriculum.ts.
5. اختبر المسار كاملاً.

افتح المستوى في الواجهة فقط بعد اكتماله (feature flag).

ابدأ بـL4 ثم L5… لا تدمج نصف مستوى.

---

🅿️ المرحلة 10 — i18n والمتاجر (اختياري)

· i18n حيّ لكن جزئي: useT في 3 ملفات فقط.
    قرار: اعتماد العربية فقط وحذف en.ts، أو ترحيل النصوص تدريجياً.
· توحيد المتاجر: highScoreStore وsrb/progress وsorobania_progress_v2 يمكن أن تصبح zustand persist.

---

🗓️ الجدول الزمني والاعتماديات

```text
P0 ─► P1 ─► P2 ─► P3 ─► P4 ─► P5 ─► P6 ─► P8
              └────────► P7 (يتوازى بدءاً من P2) ────────►
P9 (محتوى) يبدأ بعد P6 · P10 اختياري
```

الأسبوع المراحل
1 P0 · P1 · P2 · بداية P3
2 P3 · P4 · بداية P5
3 P5 · P6 · P7
4+ P8 · P9 · P10

---

⏱️ الحد الأدنى الآمن عند ضيق الوقت

1. P0.3–0.5 (أدلة)
2. P3 كاملة (تُصلح لوحة ولي الأمر والشارات — أكبر عطب مرئي)
3. P2.A–C (حذف ميت آمن)
4. P6.2 + P6.6 (lazy للشاشات + ضغط الصور)
5. P1.1–1.2 (lockfile + typecheck)
6. P4.3–4.5

---

✅ قائمة التحقق النهائية (Definition of Done)

☐ npm ci && npm run typecheck && npm run lint && npm run test:run && npm run build كلها exit 0
☐ audit-v8 (على HEAD): unreachable files = 0 · dynamic-storage-key ≤ 20
☐ لا مفتاح بقارئ بلا كاتب أو العكس
☐ لوحة ولي الأمر: المهام تتحرك؛ الشارات تُمنح
☐ JS الأولي ≤ 600 KB · لا تحذير chunk
☐ تغطية ≥ 50% للمتاجر والمنطق
☐ لا مكوّن > 800 سطر
☐ L4 على الأقل مكتمل
☐ تحديث STATE_OF_THE_PROJECT.md بالتصحيحات

---

⚠️ سجل المخاطر

الخطر التخفيف
فقدان تقدّم مستخدمين حاليين (P4) migration additive + اختبار على نسخة backup حقيقية
حذف مفتاح/ملف يبدو ميتاً وهو حيّ 0.4 إلزامية + حذف على دفعات
كسر الشاشات عند lazy/import() Suspense + Error Boundary + اختبار كل مسار
تحوّل srb-adapter إلى async يكسر 5 شاشات غلاف تدريجي (useSrbQuestions hook)
نتائج v9 تعتمد على grep حرفي لا تُبنى قرارات حذف على v9 وحده
التراجع git revert أو git reset --hard pre-pN

---

الملحق A — Smoke Test (بعد كل دفعة)

1. فتح التطبيق من جلسة نظيفة → شاشة الترحيب → اختيار الدور → الاسم → الرفيق.
2. اختيار فئة → فتح L0 → درس intro → S01 → تمرين.
3. L1: درس S03 → Practice → Anzan → AudioAnzan → اختبار مستوى.
4. لوحة ولي الأمر: المهام/الشارات/نسخ احتياطي/استعادة/تصفير.
5. الألعاب الخمس: فتح كل لعبة + شراء تذكرة + رقم قياسي.
6. تبديل نمط الأرقام + اللغة → إعادة تحميل → الإعدادات باقية.
7. DevTools → Application → localStorage: لا أخطاء JSON.

---

الملحق B — أوامر مفيدة

```bash
# جميع ثوابت المفاتيح وقيمها
grep -rnE "(_KEY|STORAGE_KEY|_PREFIX)\s*=" src/ | sort

# من يستورد ملفاً معيناً
grep -rnE "from ['\"][^'\"]*(skillsChecker|numerals)['\"]" src/

# مفاتيح بلا كاتب (تدقيق يدوي سريع)
for k in soroban_anzan_stats soroban_practice_stats sorobanmind-stats soroban_exam_result; do
  echo "== $k"; grep -rn "$k" src/ ; done

# وصولية الملفات من main.tsx
node -e "const d=require('./audit-data.json');/* ابنِ الرسم من d.imports */"
```

---

آخر تحديث: 2026-10-13
النسخة: 2.0 (Claude)
الحالة: جاهز للتنفيذ

</div>