# PHASE_4_EXECUTION.md — التنظيف والتوافق منخفض الخطورة

> الترتيب: **P3-01 ← P3-02 ← P3-03**. لا تبدأ قبل إغلاق بوابة Phase 3.
> **المجمّد:** `App.tsx`، `utils/storage.ts`. **لا SQL** إلا بموافقتك الصريحة (P3-03).
> **تعارض ترقيم:** `MASTER/UNIFIED`: P3-01=C146–151، P3-02=C152–158، P3-03=C159–170. `TEST_PLAN`: P3-01=C146–150+C146b، P3-02=C151–168+3 فرعية، P3-03=C169–170. **المعتمد هنا `TEST_PLAN.md`**؛ وحّد الوثائق قبل التنفيذ.

---

## P3-01 — مفتاح الثيم

### الحالة الفعلية (نتيجة البحث الشامل في `src`)
| المفتاح | يكتبه | يقرؤه | القيم |
|---|---|---|---|
| `soroban_theme_key` | `ProfileScreen.tsx` L139 فقط | **لا أحد** | `theme_cosmic/candy/ocean/…` (تدرجات التطبيق، L16–23) |
| `soroban2d5-theme` | `Soroban2D5.tsx` L236 (`THEME_STORAGE_KEY` L121) | `Soroban2D5.tsx` L229؛ ويُدرَج في قوائم الأجهزة (`cloudSync` L223، `GuardianDashboard` L108) | مفاتيح `THEMES`: `classic/ocean/barbie` |

الاستنتاج: **إعدادان مختلفان بنطاقي قيم مختلفين**. وأيضاً `ProfileScreen` يبدأ دائماً بـ`theme_cosmic` (لا `initialData` تُمرَّر من `HeroDashboard` L272) فلا يعيد قراءة `soroban_theme_key` ← الثيم المحفوظ لا يُطبَّق في أي مكان.

### القرار وفق المواصفة (البند 4)
المفتاحان مستقلان ← **لا Migration بينهما، لا حذف، ولا تغيير كود**. زر الحفظ يبقى (يحفظ `hero_key`/`child_name`). مفتاح ثيم الأجهزة لا يُلمس.

### الخطوات
1. تحقق (Search في GitHub): `soroban_theme_key` ← كتابة واحدة في `ProfileScreen`؛ `soroban2d5-theme` ← `Soroban2D5.tsx` فقط (+ القوائم). إن ظهر قارئ جديد ← **توقف** وأعد التقييم.
2. **لا Commit كود.** وثّق النتيجة في `PROJECT_CONTROL.md` وسجل التنفيذ.
3. **ملاحظة وظيفية منفصلة (لا تُنفَّذ هنا):** حفظ ثيم لا يُطبَّق = خلل وظيفي مستقل (قراءة المفتاح عند فتح الشاشة وتطبيقه). يحتاج بنداً جديداً بموافقتك.

### الاختبارات (`TEST_PLAN`) — NOT RUN
C146 (فحص الاستخدامات ← نُفذ بالبحث أعلاه، يُسجَّل PASS فقط بعد تأكيدك على GitHub)، C147–C149 **لا تنطبق** (لا Migration) ← تُسجَّل N/A موثقة السبب، C150 زر الحفظ باقٍ ووظيفته، **C146b ← المسار الثاني** (إعدادان مستقلان، لا ترحيل).

---

## P3-02 — توحيد خريطة الشخصيات القديمة

### الحالة الفعلية (الأرشيف — يطابق ما في الوثائق)
- `src/types.ts` L125: `LEGACY_CHARACTER_MAP: Partial<Record<string, CharacterType>>` فيها `fox,owl,rabbit,panda,aya→joud`. الملف **بلا أي `import`** ← لا خطر اعتماد دائري.
- `HeroDashboard.tsx`: L11 `import type { Screen, CharacterType } from '@/types';` (استيراد **أنواع فقط**)؛ L135–140 خريطة محلية بلا `aya`؛ التأثير L187–199:
  ```ts
  } else if (saved && LEGACY_CHARACTER_MAP[saved]) {
    const migrated = LEGACY_CHARACTER_MAP[saved];
    localStorage.setItem('soroban_companion', migrated);
    setCompanion(migrated);
  } else { …'sham'… setShowSelector(true); }
  ```
- `CharacterSelector.tsx` L18/L112 يستخدم الخريطة المشتركة (يعمل مع `aya`).

### تنبيه تصميمي (يمنع فشل البناء)
الخريطة المشتركة `Partial<...>` ← `LEGACY_CHARACTER_MAP[saved]` من نوع `CharacterType | undefined`؛ إبقاء `const migrated = …; setCompanion(migrated)` كما هو سيفشل في `tsc` (undefined). لذلك يلزم تضييق النوع كما بالأسفل. وبما أن L11 `import type`، لا يمكن استيراد قيمة منه.

### الملفات
مسموح: `src/screens/HeroDashboard.tsx` فقط. (`types.ts` و`CharacterSelector.tsx` بلا تعديل. لا ملف `characterMap.ts` جديد.)

### الخطوات
0. طابق GitHub: وجود الخريطة المحلية (L135) والمشتركة (types L125) وأن `CharacterSelector` يستوردها.
1. **أضف** تحت L11 سطراً: `import { LEGACY_CHARACTER_MAP } from '@/types';` (أبقِ `import type …` كما هو).
2. **احذف** الكتلة L135–L140 كاملة (`const LEGACY_CHARACTER_MAP: Record<string, CharacterType> = { … };`).
3. **استبدل** في التأثير:
   ```ts
   const saved = localStorage.getItem('soroban_companion');
   const migrated = saved ? LEGACY_CHARACTER_MAP[saved] : undefined;
   if (saved === 'sham' || saved === 'rayan' || saved === 'bana' || saved === 'joud') {
     setCompanion(saved as CharacterType);
   } else if (migrated) {
     localStorage.setItem('soroban_companion', migrated);
     setCompanion(migrated);
   } else {
     localStorage.setItem('soroban_companion', 'sham');
     setCompanion('sham');
     setShowSelector(true);
   }
   ```
   (احتفظ بنفس المتغيرات والمنطق؛ الفرع الأخير = سلوك القيمة غير المعروفة الحالي **دون تغيير**.)
4. **أبقِ دون تغيير:** أنواع الشخصيات، `CharacterSelector`، سلوك الـ fallback إلى `sham`.
5. `npm run build` (tsc) — لا أخطاء أنواع.

### الاختبارات (`TEST_PLAN`) — NOT RUN
C151/C152 فحص الخريطتين (قبل/بعد)، C153–C156 التحويلات `fox/owl/rabbit/panda`، **C157 `aya→joud` في HeroDashboard**، C158 `CharacterSelector` يستخدم المشتركة، C151b اتساق المصادر (لا خريطة ثانية: `grep LEGACY_CHARACTER_MAP src`)، **C152b/C165 قيمة غير معروفة ← `sham` + إظهار الاختيار (سلوك حالي)**، C158b لا اعتماد دائري، C159–C164 تحميل قديم/حديث/إعادة تحميل (يدوي على الهاتف بضبط `soroban_companion` يدوياً عبر أدوات المتصفح إن توفرت وإلا BLOCKED)، C166 لا خريطة محلية، C167 tsc، C168 `git diff` ملف واحد.
Commit: `P3-02: use shared LEGACY_CHARACTER_MAP in HeroDashboard`. تراجع `git revert`.

---

## P3-03 — مراجعة `public.mask_name` (قاعدة البيانات)

### الحالة الفعلية
- الأرشيف **لا يحوي** مجلد `supabase` ولا ملفات SQL/Migrations؛ لا يمكن فحص جانب القاعدة منه.
- بحث `src` و`scripts` و`tests`: **لا** ذكر لـ`mask_name` ولا `rpc('mask_name')`. استدعاءات `.rpc()` الموجودة: `set_my_avatar`، `submit_score`، `set_my_leaderboard_visibility` فقط.
- `mask_name` تظهر في `docs/` فقط (وثائق قديمة تصفها بأنها قديمة/مستخدمة سابقاً في دوال الـ Hall of Fame). `maskName()` في `src/utils/maskName.ts` دالة TypeScript مختلفة **لا تُمس**.

### الحالة المسموحة الآن
**بحث الكود فقط (بلا SQL):** نفّذ في GitHub: `mask_name`، `.rpc(`، `format(`/`EXECUTE` في أي ملف SQL، وفي مجلد `supabase/` إن وُجد. سجّل النتائج.

### جانب القاعدة — BLOCKED حتى موافقتك
فحص: تعريف الدالة الكامل، التوقيع والمعاملات والمرجع، المالك والصلاحيات (GRANT/REVOKE)، `SECURITY DEFINER/INVOKER`، `search_path`، التعليقات، الاعتماديات المسجلة، Views/Materialized Views، Triggers والدوال التابعة، وظائف `pg_cron`، SQL الديناميكي في الدوال وEdge Functions.
**لن أكتب أي استعلام SQL (حتى للقراءة) قبل موافقتك الصريحة** (قاعدة المشروع #5). بعد موافقتك أعطيك استعلامات قراءة فقط لتشغيلها من Supabase Web UI.

### قرار الحذف (مستقبلاً، ليس الآن)
لا يُعد DROP إلا بعد: اكتمال الفحص أعلاه، حفظ التعريف والخصائص كاملة، Migration مستقلة بالتوقيع الدقيق، **بلا CASCADE**، ومعها خطة تراجع تعيد الإنشاء بالتعريف والصلاحيات الأصلية. غياب `pg_depend` وحده ليس دليلاً. ظهور استخدام ← لا حذف وإعادة تصنيف.

### الاختبارات C169–C170 — NOT RUN / BLOCKED
C169 (لا استدعاء ديناميكي عبر Cron) و C170 (لا استدعاء ديناميكي في SQL/Edge Functions): **BLOCKED** حتى الوصول لقاعدة البيانات بإذنك. لا تُسجَّل PASS من بحث الكود وحده.
لا Commit كود. إن أُقرّ الحذف: Migration منفصلة بموافقتك.

---

## بوابة الإغلاق النهائي
P3-01: موثقة (لا تغيير). P3-02: PASS + Build. P3-03: إما مغلقة بقرار موثق بعد فحص القاعدة، أو **مؤجلة موثقة** (`mask_name` تبقى). حدّث `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md`، ثم أعلن إغلاق الخطة.

...
## ملحق — Phase 4
- شرط البدء: إغلاق بوابة Phase 3 ومطابقة الكود الحالي وقاعدة البيانات (الحالة الفعلية في `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md`).
- قرارات محسومة: الترتيب `P3-01 ← P3-02 ← P3-03` (وإبقاء `P3-04` مؤجلاً)؛ منع أي تعديل SQL خارج شروط وضوابط `P3-03` وبعد التحقق من الحالة الفعلية للوظائف والصلاحيات في Supabase.
- قرارات معلّقة (تتطلب موافقة): توحيد ترقيم اختبارات Phase 4 بين `MASTER_REMEDIATION_PLAN.md` و`TEST_PLAN.md`؛ اعتماد أي تعديل SQL في `P3-03` بعد مراجعة مخطط قاعدة البيانات الفعلي.
- بيئة الاختبار: تشغيل `vitest` (`npm run test:run`) عبر GitHub Codespaces أو GitHub Actions + التحقق على بيئة اختبار Supabase معزولة لـ `P3-03`؛ ما لم يُنفَّذ فعلياً = `NOT RUN` أو `BLOCKED` ببديل «مراجعة كود» ولا يُسجَّل `PASS`.
- Commit/تراجع: Commit مستقل لكل بند؛ التراجع عبر `git revert` فقط.

| البند | الملفات | الاختبارات (انظر `TEST_PLAN.md`) |
|---|---|---|
| P3-01 | حسب نطاق الثيمات/التخزين المعتمد في `PHASE_4_EXECUTION.md` | C146–C154 |
| P3-02 | حسب نطاق البند المعتمد في `PHASE_4_EXECUTION.md` | C155–C162 |
| P3-03 | ملفات استدعاء RPC / SQL المعتمد في `PHASE_4_EXECUTION.md` | C163–C170 (+ الفرعية `b`) |
