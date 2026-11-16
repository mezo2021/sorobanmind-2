# Phase 2 + P2-03 — جدول القرارات النهائية

| # | السؤال (مختصر) | القرار النهائي | السبب المختصر |
|---|----------------|----------------|----------------|
| 1 | توثيق Phase 1 في UNIFIED_REFERENCE | فقرة معتمدة: القفلان + Web Locks، `CloudSyncError`، `applyLocalIdentityVerified`، `AuthModal` محدود، LOCAL WINS، C1–C20؛ الحالة: "مخططة بالكامل، والكود في المرحلة 7"؛ لا SQL | توثيق القرارات قبل الانتقال لـ Phase 2 |
| 2 | نطاق Phase 2 | P2-03 وP2-04 وP2-05 وP2-07 وP2-08 (P2-01/02/06 للمرحلة التالية) | وفق الخطة المعتمدة |
| 3 | فلسفة ترتيب البنود | خريطة التخزين أولاً ← P2-03 ← P2-04 ← P2-05 ← P2-07 ← P2-08 | معرفة حدود المخازن قبل معالجة التحميل السحابي |
| 4 | لماذا لا نبدأ بـ P2-07؟ | يُؤخر إلى ما بعد عزل المخازن | قد يكتب `loadFromCloud` في مساحة غير معزولة |
| 5 | الملفات المتأثرة | `data/srb/progress.ts` (P2-03)، `LessonScreen.tsx` (P2-04)، `MagicSecretsScreen.tsx` (P2-05)، `cloudSync.ts` و`GuardianDashboard.tsx` (P2-07/08) | خريطة أولية قبل فحص كل ملف |
| 6 | الملفات المجمّدة | `App.tsx`, `AppGate.tsx`, `AuthModal.tsx`, `RoleSelection.tsx`, `LocalPinGuard.tsx`, `progressStore.ts`, `storage.ts`؛ فتح التجميد يتطلب مبرراً مكتوباً ونطاقاً وأثراً واختباراً | منع التوسع غير المبرر |
| 7 | اعتماد Phase 2 على Phase 1 | لا يبدأ تنفيذ Phase 2 قبل إغلاق Phase 1 باختبارات C1–C20؛ التخطيط يستمر بالتوازي | تعديل التخزين مع تدفق اعتماد غير مستقر يصعّب التشخيص |
| 8 | الأقفال والحماية لـ Phase 2 | إعادة استخدام أقفال Phase 1؛ إضافة مفهوم Account Transition Barrier؛ وحماية عمليات الاستعادة (قراءة ثم Snapshot ثم موافقة ثم تنفيذ ثم تحقق) | لا أقفال مكررة، وكل عملية تعرف مساحتها |
| 9 | Q1 — `srb_progress` | نقل إلى `local:srb_progress` فقط + علم `soroban_srb_migrated='1'`، مرة واحدة مع Rollback آمن | بيانات قديمة لا يُتحقق من مصدرها فتُنقل للأكثر حماية |
| 10 | Q2 — `lesson_session_*` | حسب الوضع فقط دون `userId` | جلسة مؤقتة، والخلط بين طفلين نادر ومقبول |
| 11 | Q3 — `secrets_best_scores` | عُدّل إلى الخيار (د): عزل حسب الوضع (`local:` / `cloud:`) محلياً بلا Supabase؛ مزامنة Cloud مؤجلة | لا RPC مناسب ولا نفتح جبهة SQL |
| 12 | Q4 — P2-08 | ملغى؛ `handleRestore` (JSON) و`loadFromCloud` موجودان، وكلاهما استبدال كامل لا انتقائي | الانتقائية تخلق تعارضات منطقية |
| 13 | Q5 — نطاق `loadFromCloud` (P2-07) | تأكيد + Snapshot + Rollback، دون Preview أو Schema Validator، تصنيف P2 | الوصول لمستوى أمان `handleRestore` دون ميزات UX جديدة |
| 14 | س1 — موقع Migration | داخل `src/data/srb/progress.ts` وليس `main.tsx` | هو المالك الفعلي للمفتاح وكل القراءات تمر عبره |
| 15 | س2 — ترتيب Migration | قراءة العلم ← قراءة المصدر والوجهة ← نسخ ← تحقق ← كتابة العلم والتحقق ← حذف المصدر أخيراً؛ لا حذف إن فشلت أي خطوة سابقة | الحذف هو الخطوة الوحيدة غير القابلة للتراجع |
| 16 | س2 — QuotaExceeded | يبقى المصدر، لا علم، قراءة قديمة مؤقتة، حظر كل الكتابة والحذف، إعادة محاولة تلقائية عند توفر المساحة | لا بيانات فارغة مضللة ولا كتابة فوق النسخة القديمة |
| 17 | س3 — جلسات الدروس عند Logout | لا مسح إضافي لـ`local:soroban_lesson_session_*` | يتسق مع Q2؛ `wipeLocalProgress` يمسح `cloud:` فقط |
| 18 | س4 — قراءة نتائج Magic Secrets سحابياً | `get_hall_of_fame_v2` غير مناسب؛ لا RPC مثبت؛ لا قراءة مباشرة من `scores` (RLS بلا سياسات) | يخص لوحة الشرف لا أفضل نتيجة لكل `secretId` |
| 19 | قرار P2-05 الاستراتيجي | الخيار (د) Local-only؛ لا Supabase ولا تعديل `progress_data` أو `extractPureState` | لا SQL، ولا تداخل مع P2-07، ويعالج تلوث العزل |
| 20 | س6 — مستدعو `loadFromCloud` | استدعاء وحيد `GuardianDashboard.tsx:316` (`handleCloudLoad`)؛ `cloudSync.ts:359` تعريف فقط | كسر تجميد محدود ومبرر لملف واحد |
| 21 | س7 — موقع نافذة التأكيد | داخل `handleCloudLoad()` في `GuardianDashboard.tsx` قبل الاستدعاء، بنص عربي/إنجليزي عبر `pickLang`؛ الإلغاء لا يغيّر شيئاً | قرار واجهة لا طبقة مزامنة |
| 22 | س8 — Snapshot للاستعادة السحابية | الخيار (ب): `captureCloudRestoreSnapshot` مستقل (حالة Zustand، `cloud:sorobanmind-v2-progress`، `soroban_hero_key`، `soroban_child_name`) | مسؤوليتان مختلفتان، ولا نعيد هيكلة P1 |
| 23 | سلوك `loadFromCloud` المطلوب | يجب أن يحقق استبدالاً كاملاً (لا Shallow Merge) مع Snapshot وRollback | الكود الحالي (`cloudSync.ts:389–392`) يدمج ولا يستبدل |
| 24 | ترتيب تنفيذ Phase 2 | P2-03 ← P2-04 ← P2-05 ← P2-07، كل بند Commit مستقل مع Build واختبار | عزل الأخطاء وتسهيل التشخيص |
| 25 | P2-03 — المفاتيح | `local:srb_progress`، `cloud:srb_progress`، علم `soroban_srb_migrated="1"`، والمصدر القديم `srb_progress` يُنقل ثم يُحذف | عزل Local/Cloud |
| 26 | P2-03 — معرفة الوضع | `getMode()` من `appMode.ts` مباشرة؛ `null` يرمي `SRB_MODE_UNAVAILABLE` ولا يُفترض Local | لا افتراض صامت لمساحة التخزين |
| 27 | P2-03 — سلوك `loadAllProgress()` | التوقيع كما هو؛ Blocked: قراءة المصدر القديم + حظر الكتابة؛ Conflict/Corrupted/ModeUnavailable: رمي `SRB_MIGRATION_CONFLICT` / `SRB_PROGRESS_CORRUPTED` / `SRB_MODE_UNAVAILABLE` | لا `{}` عند أي فشل |
| 28 | P2-03 — دالة الحالة | `getSrbMigrationState()` تعيد `ok / blocked / conflict / corrupted / mode-unavailable` وتفحص قبل الإرجاع | لا تُعاد `ok` لمجرد نجاح محاولة سابقة |
| 29 | P2-03 — الكتابة والحذف | `saveLevelGrade` و`clearLevelProgress` و`clearAllProgress`: `return` مبكر إن لم تكن الحالة `ok` (بلا throw) | حماية البيانات القديمة وكل مسارات التعديل |
| 30 | P2-03 — موضع Migration | دالة داخلية `ensureSrbProgressMigration()` تُستدعى في بداية `loadAllProgress()` | لا قراءة للمفتاح القديم قبل محاولة النقل |
| 31 | P2-03 — تعارض المصدر والوجهة | مختلفان = Conflict دون استبدال؛ متطابقان أو وجهة فقط = اكتمل | لا استبدال تلقائي |
| 32 | P2-03 — نطاق الملفات | `src/data/srb/progress.ts` و`src/main.tsx` (توسيع ErrorBoundary) فقط؛ `srb-adapter.ts` وشاشات SRB وApp/AppGate وغيرها مستبعدة | حصر النطاق |
| 33 | P2-03 — قصور ErrorBoundary | مقبول: يلتقط render فقط، وأخطاء `onClick` و`useEffect` و`async` قد تترك شاشة عالقة | أولوية سلامة البيانات الآن |
| 34 | P2-03 — UX الفشل | مؤجل إلى P3-04 (إظهار الحالة وتوفير Retry/Export/Support) | خارج نطاق Phase 2 |
| 35 | P2-03 — الاختبارات | C21–C37 معتمدة (Migration، Idempotency، Quota، تعارض، تالف، استئناف بعد انقطاع، عزل، توافق المستهلكين) | تغطية كل مسارات الفشل |
| 36 | P2-03 — معايير القبول | سلامة البيانات، العزل، QuotaExceeded، التوافق، الانضباط (Commit مستقل، لا SQL) | بوابة إغلاق التنفيذ |
| 37 | P2-03 — الإغلاق الرسمي | "مغلق تصميمياً" بتاريخ 16 نوفمبر 2026؛ التوقف قبل P2-04 إلى الجلسة القادمة | حسب قرار الجلسة |

---

## قرارات ملغاة أو مستبدلة

- P2-08 (استعادة سحابية يدوية) — ملغى.
- مزامنة Cloud لأفضل نتائج Magic Secrets (Q3 الأصلي) — استُبدلت بالخيار (د).
- الخيارات (أ) تأجيل P2-05 كلياً، (ب) التخزين داخل `progress_data`، (ج) RPC جديد — مرفوضة.
- Migration داخل `main.tsx` — مرفوض.
- إعادة استخدام `captureAdoptionSnapshot` أو helper عام `captureStateSnapshot` — مرفوضان.
- استخدام `get_hall_of_fame_v2` لقراءة أفضل نتيجة — مرفوض.
- مسح جلسات الدروس المحلية عند Logout — مرفوض.
- حذف المصدر القديم قبل كتابة العلم — مرفوض.
- افتراض Local عند `getMode() === null` — مرفوض.
- بدء Phase 2 بـ P2-07 — مرفوض.
- تقييد P2-07 بـ40 سطراً — ليس قيداً حاكماً.

## قرارات مؤجلة

- P3-04: UX فشل Migration.
- Migration Wizard لاحقاً.
- Preview وSchema Validator لـ`loadFromCloud`.
- مزامنة Cloud لأفضل نتائج Magic Secrets (مرحلة مستقلة مع RPC وصلاحيات واختبارات).
- تنفيذ Phase 2 حتى إغلاق Phase 1 بـC1–C20.
- كتابة الكود كله إلى المرحلة 7.
- تفكيك P2-04 (الجلسة القادمة) ثم P2-05 وP2-07.
- فتح تجميد `GuardianDashboard.tsx` لـP2-07 فقط بنطاق محدود.

## اكتشافات وتحذيرات

- `loadFromCloud` الحالي Shallow Merge (`cloudSync.ts:389–392`)، بينما `handleRestore` (`GuardianDashboard.tsx:813–827`) يحذف المفاتيح الغائبة ويستبدل؛ فمقدمة Q4 غير دقيقة.
- لا يوجد RPC لقراءة أفضل نتيجة Magic Secrets؛ والمفتاح محلي فقط (`MagicSecretsScreen.tsx` الأسطر 239 و260 و272) ولا عمليات Cloud عليه.
- بعد P2-05 ستكون `cloud:` للنتائج مساحة محلية معزولة لا تخزيناً سحابياً فعلياً ولا مزامنة بين الأجهزة.
- تصحيح مبرر Q2: `wipeLocalProgress` يمسح `cloud:*` فقط، فجلسات `local:` تبقى؛ والطفل B قد يرى جلسة A (مقبول).
- `progress.ts` الحالي: `loadAllProgress()` تعيد `{}` عند أي فشل، و`saveLevelGrade`/`clearLevelProgress` تبتلعان الأخطاء، و`clearAllProgress()` يحذف المفتاح الأصلي بلا حماية.
- تناقض في المواصفة: Migration إلى `local:` فقط لكن جدول المفاتيح يذكر `cloud:srb_progress` للوضع السحابي.
- `main.tsx` رُفض موقعاً لـMigration لكنه ضمن نطاق P2-03 لتوسيع ErrorBoundary فقط.
- ErrorBoundary لا يلتقط أخطاء `onClick` و`useEffect` و`async`، فقد تظهر شاشة عالقة بلا رسالة.
- `AuthModal.tsx` مجمّد في خطة Phase 2 رغم أن تعديله المحدود مقرر في تنفيذ Phase 1.
- `get_hall_of_fame_v2` (`cloudSync.ts:479`) و`submit_score` (:406) و`get_my_rank_details_v2` (:500) لا تخدم أفضل نتيجة لكل سر؛ و`scores` عليها RLS بلا سياسات قراءة.
- اختلاف مسارات الملفات بين الردود (`src/components/` مقابل `src/screens/` لـ`GuardianDashboard` و`MagicSecretsScreen`)؛ يجب التحقق من المسار الفعلي.
- ترقيم الأسئلة التقنية يقفز من 4 إلى 6 (لا سؤال 5).
- النتائج مبنية على `source.zip` وقد لا تطابق نسخة GitHub حرفياً.
- QuotaExceeded: لا يجوز عرض تقدم فارغ عند فشل النقل؛ ويجب معالجة ابتلاع الأخطاء في دوال `progress.ts` صراحةً.
- `srb-adapter.ts` مؤكد أنه لا يلمس `localStorage` مباشرة.
- `loadFromCloud` مستدعاة من موضع واحد فقط، لكن التأكيد والاستبدال الكامل يتطلبان تعديل ملف مجمّد وطبقة المزامنة معاً.
