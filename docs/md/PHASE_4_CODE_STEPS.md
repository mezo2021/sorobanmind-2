# PHASE_4_CODE_STEPS.md — ورقة عمل الكود: التنظيف والتوافق منخفض الخطورة

> يُقرأ مع `PHASE_4_EXECUTION.md`. الترتيب: **P3-01 ← P3-02 ← P3-03**. لا تبدأ قبل إغلاق بوابة Phase 3.
> **تعديل كود فعلي في بند واحد فقط (P3-02).** P3-01 توثيق، وP3-03 فحص (بلا SQL قبل موافقتك الصريحة).
> مجمّد: `App.tsx`، `utils/storage.ts`، SQL/Supabase.
> ترقيم الاختبارات: المعتمد جداول `TEST_PLAN.md` (يتعارض مع MASTER/UNIFIED — وحّد الوثائق قبل التنفيذ).

---

## P3-01 — مفتاح الثيم ← **بلا تعديل كود**

**نتيجة البحث في `src` (طابقها على GitHub بـ Search):**

| المفتاح | الكتابة | القراءة |
|---|---|---|
| `soroban_theme_key` | `ProfileScreen.tsx` L139 فقط | لا قارئ |
| `soroban2d5-theme` | `Soroban2D5.tsx` L236 | `Soroban2D5.tsx` L229 (+ قوائم الأجهزة في `cloudSync.ts` L223 و`GuardianDashboard.tsx` L108) |

القيم مختلفة النطاق (`theme_cosmic…` مقابل `classic/ocean/barbie`) ← **إعدادان مستقلان**.

**الإجراءات:**
1. **أبقِ** `ProfileScreen.tsx` و`Soroban2D5.tsx` و`cloudSync.ts` و`GuardianDashboard.tsx` **دون تغيير**.
2. **لا Migration، لا حذف، لا علم ترحيل.** زر الحفظ في Profile يبقى (يحفظ `hero_key`/`child_name` أيضاً).
3. إن ظهر في GitHub قارئ آخر لـ `soroban_theme_key` ← **توقف** وأعد التقييم (قد يتغير القرار).
4. وثّق النتيجة في `PROJECT_CONTROL.md` وسجل التنفيذ: «P3-01: لا تغيير؛ المفتاحان مستقلان (مسار C146b الثاني)».

**ملاحظة وظيفية مستقلة (لا تُنفَّذ هنا — تحتاج بنداً جديداً وموافقتك):** `ProfileScreen` يبدأ دائماً بـ`'theme_cosmic'` (لا `initialData` تُمرَّر من `HeroDashboard`) ولا يقرأ `soroban_theme_key` ← الثيم المحفوظ لا يُطبَّق في أي شاشة.

**Commit:** لا Commit كود. (توثيق فقط إن حدّثت `PROJECT_CONTROL.md`.)
**الاختبارات:** C146 فحص الاستخدامات (يُسجَّل PASS بعد تأكيدك على GitHub) • C147–C149 N/A (لا Migration) • C150 زر الحفظ باقٍ • C146b = المسار الثاني. الباقي `NOT RUN`.

---

## P3-02 — `src/screens/HeroDashboard.tsx` ← **تعديل كود مطلوب (ملف واحد)**

**مطابقة GitHub قبل التنفيذ (إلزامي):**
- `src/types.ts` ~L125: `LEGACY_CHARACTER_MAP: Partial<Record<string, CharacterType>>` تتضمن `aya: 'joud'`، والملف بلا `import` (لا خطر اعتماد دائري).
- `HeroDashboard.tsx` L11: `import type { Screen, CharacterType } from '@/types';` ← **استيراد أنواع فقط**.
- `HeroDashboard.tsx` L135–140: الخريطة المحلية (بدون `aya`).
- تأثير `soroban_companion` L187–201.
- `CharacterSelector.tsx` L18 يستورد `LEGACY_CHARACTER_MAP` من `@/types`.
إن اختلف أي بند ← **توقف** وراجع التصميم.

**الخطوات:**
1. **أضف** سطراً بعد L11 (أبقِ سطر `import type` كما هو):
```ts
import { LEGACY_CHARACTER_MAP } from '@/types';
```
2. **احذف** الكتلة المحلية كاملة (L135–140):
```ts
const LEGACY_CHARACTER_MAP: Record<string, CharacterType> = {
  fox: 'sham',
  owl: 'bana',
  panda: 'joud',
  rabbit: 'rayan',
};
```
3. **استبدل** الشرط والمتغير داخل التأثير. من:
```ts
    const saved = localStorage.getItem('soroban_companion');
    if (saved === 'sham' || saved === 'rayan' || saved === 'bana' || saved === 'joud') {
      setCompanion(saved as CharacterType);
    } else if (saved && LEGACY_CHARACTER_MAP[saved]) {
      const migrated = LEGACY_CHARACTER_MAP[saved];
      localStorage.setItem('soroban_companion', migrated);
      setCompanion(migrated);
    } else {
```
**إلى:**
```ts
    const saved = localStorage.getItem('soroban_companion');
    // الخريطة المشتركة Partial ← نضيّق النوع لتفادي خطأ tsc (CharacterType | undefined)
    const migrated = saved ? LEGACY_CHARACTER_MAP[saved] : undefined;
    if (saved === 'sham' || saved === 'rayan' || saved === 'bana' || saved === 'joud') {
      setCompanion(saved as CharacterType);
    } else if (migrated) {
      localStorage.setItem('soroban_companion', migrated);
      setCompanion(migrated);
    } else {
```
4. **أبقِ دون تغيير:** فرع القيمة غير المعروفة (`setItem('soroban_companion','sham')` + `setCompanion('sham')` + `setShowSelector(true)`) — **سلوك حالي يُحفظ كما هو** (C152b/C165)، وبقية التأثير (`savedName`)، و`CharacterSelector.tsx`، و`types.ts` (لا تعدّلهما)، ولا تُنشئ `characterMap.ts`.
5. **تحقق بعد التعديل:**
   - `grep -n LEGACY_CHARACTER_MAP src` ← 3 ملفات فقط: `types.ts` (تعريف)، `HeroDashboard.tsx` (استيراد/استخدام)، `CharacterSelector.tsx`؛ ولا `const LEGACY_CHARACTER_MAP` ثانية (C151b/C166).
   - `npm run build` (= `tsc && vite build`) بلا أخطاء أنواع (C167).
   - `git diff` يظهر ملفاً واحداً (C168).

**Commit:** `P3-02: use shared LEGACY_CHARACTER_MAP in HeroDashboard` (ملف واحد).
**التراجع:** `git revert <hash>`؛ لا مساس بالبيانات (القيم المخزنة `soroban_companion` تبقى).
**الاختبارات (`TEST_PLAN`):** C151/C152 • C153–C156 • **C157 `aya→joud` في HeroDashboard** • C158 • C151b • **C152b/C165 غير معروف ← `sham` + إظهار المحدد** • C158b • C159–C164 (يدوي: ضبط قيمة `soroban_companion` قديمة في أدوات المتصفح — إن تعذّر على الهاتف ← `BLOCKED` مع السبب) • C166–C168. الكل `NOT RUN` قبل التنفيذ.

---

## P3-03 — `public.mask_name` ← **بلا كود وبلا SQL الآن**

**فحص كود (مسموح الآن، عبر Search في GitHub):**
1. `mask_name` في كل المستودع.
2. `.rpc(` ← الأسماء المستخدمة حالياً (في الأرشيف): `set_my_avatar`، `submit_score`، `set_my_leaderboard_visibility` فقط.
3. `EXECUTE` / `format(` / `pg_cron` / `cron.schedule` داخل أي ملف `.sql` أو مجلد `supabase/` إن وُجد.
**نتيجة الأرشيف:** `mask_name` لا تظهر في `src`/`scripts`/`tests` — تظهر في `docs/` فقط؛ ولا مجلد `supabase` ولا ملفات SQL في الأرشيف. لا تخلط مع `src/utils/maskName.ts` (TypeScript، لا تُمس).

**جانب قاعدة البيانات = `BLOCKED` حتى موافقتك الصريحة.** لن أكتب أي استعلام (حتى للقراءة) قبلها. المطلوب فحصه لاحقاً من Supabase Web UI: تعريف الدالة وتوقيعها ومرجعها • المالك والصلاحيات • `SECURITY DEFINER/INVOKER` • `search_path` والتعليقات • الاعتماديات • Views/Materialized Views • Triggers والدوال التابعة • `pg_cron` • SQL الديناميكي في الدوال وEdge Functions.

**قاعدة الحذف (مستقبلاً):** لا DROP إلا بعد اكتمال الفحص وحفظ التعريف والخصائص كاملة، Migration مستقلة بالتوقيع الدقيق، **بلا `CASCADE`**، مع خطة تراجع تعيد الإنشاء بالتعريف والصلاحيات الأصلية. غياب `pg_depend` وحده ليس دليلاً. ظهور أي استخدام ← لا حذف وإعادة تصنيف.

**Commit:** لا Commit كود. توثيق النتيجة فقط.
**الاختبارات:** C169/C170 = `BLOCKED` (لا تُسجَّل PASS من بحث الكود وحده).

---

## ⚠️ قرارات معلّقة (موافقتك)
1. P3-01: اعتماد «لا تغيير» (إعدادان مستقلان) وفتح بند منفصل لاحقاً لتطبيق الثيم المحفوظ إن رغبت.
2. P3-03: الإذن بفحص قاعدة البيانات (استعلامات قراءة فقط) — بدونه يبقى البند مؤجلاً.
3. توحيد ترقيم C146–C170 بين `TEST_PLAN` و`MASTER/UNIFIED`.

## بوابة الإغلاق النهائي
P3-01 موثق بلا تغيير • P3-02 بـ Build ناجح واختباراته (أو `BLOCKED` موثقة) • P3-03 إما مغلق بقرار موثق بعد فحص القاعدة أو **مؤجل موثق** (`mask_name` تبقى). حدّث `TEST_PLAN.md` §5 و`PROJECT_CONTROL.md` ثم أعلن إغلاق الخطة.
