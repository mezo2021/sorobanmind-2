# PHASE_2_EXECUTION.md — عزل البيانات واستقرار التقدم

> الترتيب: **P2-03 ← P2-04 ← P2-05 ← P2-07**، كل بند Commit مستقل. لا تبدأ قبل إغلاق بوابة Phase 1.
> مبني على الأرشيف؛ الخطوة 0 (مطابقة GitHub) إلزامية لكل بند.
> **مجمّد:** `App.tsx`، `utils/storage.ts` (يُستورد منه فقط ولا يُعدَّل)، `progressStore.ts`، `srb-adapter.ts`، SQL.

## تنبيه: تعارض ترقيم الاختبارات بين الوثائق
`UNIFIED_REFERENCE`/`MASTER` يقسمان 17/18/26/18، و`TEST_PLAN` يقسم C21–C40 / C41–C60 / C61–C81 / C82–C99. المجموع 79 في الحالتين. **المعتمد هنا جداول `TEST_PLAN.md`** (فيها نص كل اختبار). وحّد الوثائق قبل التنفيذ.

---

## P2-03 — عزل `srb_progress`

### الحالة الفعلية
- `src/data/srb/progress.ts`: `STORAGE_KEY = "srb_progress"` (L35) **بدون بادئة وضع**. قراءة `loadAllProgress` (L128)، كتابة `saveLevelGrade` (L252)، `clearLevelProgress` (L263)، `clearAllProgress` (L272) كلها `localStorage` مباشرة وتبتلع الأخطاء.
- المفتاح غير مسبوق بـ `cloud:` ← **لا يُمسح عند تبديل الحساب** (`wipeLocalProgress` يحذف `cloud:` فقط).
- `srb-adapter.ts` يستورد من `progress.ts` فقط (لا يُعدَّل). `PracticeScreen` يستخدمه عبر الـ adapter.
- `main.tsx` L85: `ErrorBoundary` فيه `getDerivedStateFromError` ويلتقط أخطاء render عموماً.

### الملفات
مسموح: `src/data/srb/progress.ts`. **`main.tsx`: لا يُلمس** إلا إذا أثبتّ بالتجربة أن خطأ SRB لا يلتقطه الـ ErrorBoundary الحالي (يحتاج موافقتك).

### الخطوات
1. **مطابقة:** تأكد من L35 وأن `srb_progress` لا يُقرأ خارج `progress.ts` (`grep srb_progress src`).
2. **أضف** في أعلى `progress.ts`: `import { getMode } from "@/utils/appMode";` (أو المسار النسبي المستخدم في الملف) وثوابت: `OLD_KEY='srb_progress'`، `MIGRATED_FLAG='soroban_srb_migrated'`.
3. **أضف** دالة `scopedKey(): string | null` ترجع `` `${mode}:srb_progress` `` أو `null` عند `getMode()===null`. استخدم `localStorage` مباشرة (لأن `storage` يبتلع الأخطاء ولا يمكن التحقق منه).
4. **أضف** `migrateSrbProgress(): 'ok'|'blocked'|'conflict'|'corrupted'|'mode-unavailable'`:
   - الوجهة دائماً `local:srb_progress` (بغض النظر عن الوضع الحالي).
   - إذا `soroban_srb_migrated==='1'` ← `ok`. إذا لا مفتاح قديم وقراءة ناجحة (`null`) ← اكتب العلم ← `ok`.
   - اقرأ القديم؛ `JSON.parse` فاشل ← `corrupted` (لا تغيير). الوجهة موجودة ومختلفة ← `conflict` (لا دمج ولا استبدال).
   - اكتب الوجهة ← اقرأها وقارنها بالمصدر ← **فقط حينئذ** اكتب العلم. **لا تحذف** المفتاح القديم (القرار: الإبقاء). أي فشل ← `blocked` والمصدر باقٍ.
5. **عدّل** `loadAllProgress`: استدعِ `migrateSrbProgress()` مرة (متغير module-level)؛ إن لم تكن النتيجة `ok` فاقرأ المفتاح القديم قراءة فقط ومرّر `blocked`؛ وإلا اقرأ `scopedKey()`؛ `null` ← `{}`.
6. **عدّل** `saveLevelGrade` و`clearLevelProgress` و`clearAllProgress`: اكتب/احذف على `scopedKey()` فقط؛ إن كانت الهجرة غير `ok` أو الوضع `null` ← **لا كتابة ولا حذف** (حماية البيانات القديمة).
7. **أبقِ دون تغيير:** `makeLevelKey`, `parseLevelKey`, `hasPassed`, دوال التحليل (L286+)، توقيعات التصدير.

### الاختبارات C21–C40 (`TEST_PLAN.md`) — كلها NOT RUN
نفّذ على Local ثم Cloud: C21–C22 اكتشاف، C23–C25 نسخ/تحقق/علم، C26–C27 فشل كتابة/قراءة (محاكاة `localStorage.setItem` يرمي)، C28 تالف، C29 تعارض، C30–C31 إعادة/تكرار، C32 Cloud، C33 `mode-unavailable`، C34–C37 الحالات، C38 بقاء القديم، C39 منع الكتابة عند الفشل، C40 `git diff` لا يمس `srb-adapter.ts`.
وسيلة: vitest بمحاكاة `localStorage`؛ الهاتف للتحقق اليدوي من C23/C32 فقط.

### Commit/تراجع
`P2-03: isolate srb_progress per mode` ← `npm run build` ← الاختبارات. `git revert`؛ المفتاح القديم باقٍ لذا التراجع آمن.

---

## P2-04 — عزل جلسات الدروس

### الحالة الفعلية (`src/screens/LessonScreen.tsx`)
- `LESSON_SESSION_PREFIX='soroban_lesson_session_'` (L46)، `loadSession` L141، `saveSession` L150، `clearSession` L156 — كلها `localStorage` بلا وضع.
- تأثير استعادة L314–352 (تبعية `[lessonId]`) وتأثير حفظ L370–381 (تبعية فيها `sessionLoaded`). **ثغرة مؤكدة:** `sessionLoaded` لا يعود `false` عند تغيّر الدرس، فيُنفَّذ الحفظ في نفس الدورة بحالة الدرس القديم تحت `lessonId` الجديد ← حاجة `loadedLessonId`.
- `clearSession` يُستدعى عند الإكمال L429 وL772.

### الخطوات
1. **أضف** `import { getMode } from '@/utils/appMode';`.
2. **استبدل** الثابت: `const sessionKey = (id: string) => { const m = getMode(); return m ? \`${m}:soroban_lesson_session_${id}\` : null; };` (بلا `userId`).
3. **عدّل** `loadSession/saveSession/clearSession`: إن كان المفتاح `null` ← `{}` / لا كتابة / لا حذف. لا Migration للمفاتيح القديمة (تُترك وتُتجاهل).
4. **أضف** حالة `const [loadedLessonId, setLoadedLessonId] = useState<string|null>(null);`
5. **في تأثير الاستعادة (L314):** إن `lessonId` فارغ ← `setLoadedLessonId(null)`؛ وإلا بعد `setSessionLoaded(true)` أضف `setLoadedLessonId(lessonId)`.
6. **في تأثير الحفظ (L370):** غيّر الشرط إلى `if (!sessionLoaded || !lesson || loadedLessonId !== lessonId) return;` وأضف `loadedLessonId` للتبعيات.
7. **عند الدرس المكتمل (L316–321):** أبقِ المنطق (يعتمد `completedLessons`)، ولا تستعد `session.solved` لدرس مكتمل حتى لو فشل `clearSession`.
8. **لا تضف** `completed:true` إلى `SessionData`، ولا Web Locks، ولا Versioning. التبويبات: Last-Write-Wins.
9. **أبقِ** `GuardianDashboard`/Logout بلا مسح لجلسات Local.

### الاختبارات C41–C60 — NOT RUN
C41–C43 عزل الوضعين، C44 `mode=null`، C45–C48 تغيّر الدرس/`loadedLessonId`، C49 مفاتيح قديمة، C50–C51 Logout/wipe لا يمسّ Local، C52–C56 الإكمال، C57 استقلال الوضعين، C58 تبويبان (LWW مقبول)، C59 تحديث الصفحة، C60 نطاق `git diff`.
> C51 ملاحظة: `wipeLocalProgress` يحذف `cloud:*` فقط، فلن يحذف مفاتيح Local.

Commit: `P2-04: isolate lesson sessions by mode` ← build ← اختبار. تراجع بـ `git revert`.

---

## P2-05 — أفضل نتائج لعبة الأسرار

### الحالة الفعلية (`src/screens/MagicSecretsScreen.tsx`)
`BEST_SCORES_KEY='soroban_secrets_best_scores'` (L239)؛ قراءة في `useEffect` L259–261؛ `saveBestScore` L266–273 يكتب `localStorage` ويعتمد على `bestScores` الـ closure (قد يكون قديماً). `QUESTIONS_PER_EXAM=7` (L32)، `SECRETS` (L117). `doneSecrets` يبدأ `[]` (L253). لا `getMode` ولا Web Locks حالياً.

### الخطوات
1. **أضف** `import { getMode } from '@/utils/appMode';`
2. **أضف** `const scoresKey = () => { const m = getMode(); return m ? \`${m}:soroban_secrets_best_scores\` : null; }` و`MIGRATED_FLAG='soroban_secrets_best_scores_migrated'`.
3. **أضف** `sanitizeScores(raw): Record<number,number>`: يقبل فقط معرفات موجودة في `SECRETS`، وقيماً صحيحة `0 ≤ v ≤ QUESTIONS_PER_EXAM`؛ يرفض الباقي.
4. **أضف** `withScoresLock(fn)`: `navigator.locks.request('soroban-secrets-best-scores', fn)`؛ إن لم تتوفر Web Locks ← **لا ترحيل ولا كتابة** (تستمر اللعبة بالذاكرة).
5. **استبدل** تأثير القراءة (L259): داخل القفل ← إن `scoresKey()===null` تجاوز التخزين؛ **Migration (Local فقط):** اقرأ المفتاح القديم؛ فشل القراءة ← لا علم؛ `null` ← علم ثم نجاح فارغ؛ وإلا ادمج بأعلى نتيجة لكل سر مع `local:` الموجود، تحقق بإعادة القراءة، **ثم** اكتب العلم، أبقِ المفتاح القديم. ثم اقرأ مفتاح الوضع الحالي (Cloud يبدأ مستقلاً ويتجاهل Local).
6. **استبدل** `saveBestScore` (L266): داخل القفل أعد قراءة التخزين، خذ `max`، اكتب، حدّث الحالة. لا مؤشر تحميل. فشل الكتابة ← الحالة تبقى بالذاكرة فقط.
7. **رسالة الترحيل:** مرة واحدة بعد نقل بيانات صالحة، `pickLang({ar,en}, lang)` (المستورد أصلاً).
8. **ممنوع:** Supabase، `userId`، تعديل `extractPureState`/`progress_data`، Versioning. «cloud:» هنا مساحة محلية معزولة فقط.

### الاختبارات C61–C81 — NOT RUN
C61–C64 الأوضاع و`null`، C65–C67 ترحيل Local + أعلى نتيجة، C68–C71 التحقق (0 مقبول؛ خارج النطاق/معرف غير صالح مرفوض)، C72–C76 الفشل والعلم والتكرار، C77–C78 Web Locks، C79 الإشعار مرة واحدة، C80 إعادة التحميل، C81 لا Supabase/userId.
Commit: `P2-05: isolate secrets best scores`. تراجع `git revert` (القديم باقٍ).

---

## P2-07 — إصلاح Shallow Merge في `loadFromCloud`

### الحالة الفعلية
- `cloudSync.ts` `loadFromCloud` (L706–745): `.single()` (غياب الصف يرمي خطأ خام)؛ `!data.progress_data` يرمي، لكن `{}` يمر ثم `setState({...getState(), ...safePd})` = **دمج سطحي** (لا إعادة إلى Defaults).
- `GuardianDashboard.tsx` `handleCloudLoad` (L314): لا تأكيد، لا Snapshot، لا `isRestoring`، ثم `reload` بعد 1200ms. **زر الاستعادة مكرر** (L944 داخل شرط Cloud، وL951 خارجه).
- `createLocalStateSnapshot/restoreLocalStateSnapshot` **غير مُصدَّرين** من `cloudSync.ts`.
- `useProgressStore.getState().reset()` موجود (مستخدم في `wipeLocalProgress`).

### الخطوات
**A — `cloudSync.ts` (`loadFromCloud`):**
1. **استبدل** `.single()` بـ `.maybeSingle()`. صف غائب أو `progress_data === null` ← ارمِ `CloudSyncError('No backup found','PROGRESS_FETCH_FAILED')` **قبل أي تغيير**.
2. اجلب `public_profiles.avatar_id` والتحقق منه **قبل** أي Reset (كما هو).
3. تحقق أن `progress_data` كائن عادي (ليس مصفوفة/نص) وإلا ارمِ خطأ.
4. **استبدل** الدمج بـ: `useProgressStore.getState().reset();` ثم `useProgressStore.setState(safePd);` (`{}` ← Defaults).
5. لا Rollback داخل الدالة؛ ارمِ الخطأ. **لا تمس** `pullProgress` و`adoptUser`.
6. **قرار مطلوب (موافقتك):** تصدير `createLocalStateSnapshot` و`restoreLocalStateSnapshot` (إضافة كلمة `export` فقط). Snapshot الحالي أوسع من المواصفة (كل مفاتيح `OUR_PREFIX` + Zustand) وهو أكثر أماناً.

**B — `GuardianDashboard.tsx`:**
7. **عدّل** `handleCloudLoad`: `window.confirm` (AR/EN) ← إلغاء = لا شيء؛ `isRestoringRef` (`useRef(false)`) + حالة `isRestoring`؛ Snapshot؛ `try { await loadFromCloud() } catch { restoreLocalStateSnapshot }`؛ فشل Rollback ← تحذير صريح؛ لا رسالة نجاح ولا reload عند الفشل؛ `finally` يعيد القفل.
8. **احذف** زر «استعادة من السحابة» المكرر الواقع خارج شرط Cloud (L951–955)، وأبقِ الذي داخل Cloud mode فقط.
9. لا تمس `handleRestore` (JSON) ولا `handleReset`.

### الاختبارات C82–C99 — NOT RUN
C82–C83 تأكيد/إلغاء، C84 Snapshot، C85–C88 `{}`/لا صف/`null`، C89 فشل الملف الشخصي، C90–C91 Reset ثم تطبيق (كائنات متداخلة تُستبدل، `false` و`0` تُحفظ)، C92–C93 Rollback وفشله، C94–C97 `isRestoring`، C98 LOCAL WINS في الدخول العادي، C99 `git diff` لا يمس `progressStore/storage/main.tsx`.
استخدم حساب اختبار فقط.

Commit: `P2-07: replace shallow merge in loadFromCloud`. تراجع `git revert`.

---

## بوابة الإغلاق Phase 2 → 3
C21–C99 كلها PASS أو BLOCKED موثقة، Build ناجح بعد كل Commit، لا فقدان بيانات محلية، لا خلط Local/Cloud، وتحديث `TEST_PLAN.md` §5. غير ذلك لا تبدأ Phase 3.
.....
## ملحق — Phase 2
- شرط البدء: إغلاق بوابة Phase 1 (الحالة الفعلية في `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md`).
- قرارات محسومة: الترتيب `P2-03 ← P2-04 ← P2-05 ← P2-07`؛ عزل التخزين حسب الوضع (`local:` / `cloud:`)؛ الإبقاء على المفاتيح القديمة دون حذف؛ `progress_data = {}` يعيد التقدم إلى Defaults بعد `reset()` بينما غياب الصف أو `progress_data === null` يرفض الاستعادة دون مساس بالبيانات المحلية.
- قرارات معلّقة (تتطلب موافقة): تصدير `createLocalStateSnapshot` و`restoreLocalStateSnapshot` من `cloudSync.ts` في `P2-07`؛ الإبقاء على `main.tsx` دون تعديل في `P2-03` ما لم يثبت خطأ render غير مُلتقَط؛ توحيد ترقيم اختبارات Phase 2 وفق `TEST_PLAN.md`.
- بيئة الاختبار: تشغيل `vitest` (`npm run test:run`) عبر GitHub Codespaces أو GitHub Actions لاختبارات محاكاة `localStorage`؛ ما لم يُنفَّذ فعلياً = `NOT RUN` أو `BLOCKED` ببديل «مراجعة كود» ولا يُسجَّل `PASS`.
- Commit/تراجع: Commit مستقل لكل بند؛ التراجع عبر `git revert` فقط.

| البند | الملفات | الاختبارات (انظر `TEST_PLAN.md`) |
|---|---|---|
| P2-03 | `src/data/srb/progress.ts` | C21–C40 |
| P2-04 | `src/screens/LessonScreen.tsx` | C41–C60 |
| P2-05 | `src/screens/MagicSecretsScreen.tsx` | C61–C81 |
| P2-07 | `src/lib/cloudSync.ts`، `src/screens/GuardianDashboard.tsx` | C82–C99 |
