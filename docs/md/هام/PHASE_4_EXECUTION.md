# PHASE_4_EXECUTION.md — بطاقات Phase 4

مرتبة حسب الخطر الفعلي. كل تعديل: فرع ← PR ← CI أخضر ← دمج. مجمّد: `App.tsx`، `utils/storage.ts`. **لا SQL بلا موافقتك الصريحة.** لا تبدأ قبل إغلاق بوابة Phase 3. ترقيم الاختبارات المعتمد جداول `TEST_PLAN.md` (يتعارض مع MASTER/UNIFIED في C146–C170).

---

## بطاقة 1 — P3-03: حذف دالة SQL `public.mask_name` (محجوب)

**التغيير:** **لا كود ولا SQL الآن.** المسموح: بحث نصي في GitHub عن `mask_name` و`.rpc(` و`pg_cron`. نتيجة الأرشيف: لا ذكر لـ`mask_name` في `src`/`scripts`/`tests` (توجد في `docs/` فقط)، ولا مجلد `supabase/` ولا ملفات SQL؛ استدعاءات `.rpc()` الحالية: `set_my_avatar`، `submit_score`، `set_my_leaderboard_visibility`. لا تخلط مع `src/utils/maskName.ts` (TypeScript، لا يُمس).
**جانب القاعدة:** BLOCKED حتى موافقتك. لن أكتب أي استعلام (حتى للقراءة) قبلها. بعد الموافقة: تعريف الدالة وتوقيعها، المالك والصلاحيات، `SECURITY DEFINER/INVOKER`، `search_path`، الاعتماديات، Views وTriggers، `pg_cron`، SQL الديناميكي.
**قاعدة الحذف مستقبلاً:** حفظ التعريف والخصائص كاملة، Migration بالتوقيع الدقيق، **بلا `CASCADE`**، خطة تراجع تعيد الإنشاء بالتعريف والصلاحيات الأصلية. ظهور أي استخدام ← لا حذف.
**الاختبار من الهاتف:** لا (BLOCKED). C169–C170 `BLOCKED` ولا تُسجَّل PASS من بحث الكود وحده.
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 5 دقائق (بحث)
**مخاطر:** عالٍ إن حُذفت دالة مستخدمة؛ لذلك لا حذف قبل الفحص والموافقة.
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 2 — P3-02: خريطة الشخصيات القديمة (`aya` تضيع في HeroDashboard)

**الملف:** `src/screens/HeroDashboard.tsx` (ملف واحد؛ لا `types.ts` ولا `CharacterSelector.tsx` ولا ملف `characterMap.ts` جديد).
**الخطر المثبت:** `types.ts` ~L125 فيه `LEGACY_CHARACTER_MAP` مع `aya → joud`، بينما `HeroDashboard` له نسخة محلية (L135–140) بلا `aya` ← قيمة `soroban_companion='aya'` تتحول إلى `sham` وتضيع. `types.ts` بلا أي `import` ← لا اعتماد دائري.
**مطابقة GitHub قبل التنفيذ:** L11 `import type { Screen, CharacterType } from '@/types';` (أنواع فقط)، L135–140 الخريطة المحلية، L187–201 التأثير.

**1) أضف بعد L11 (أبقِ سطر `import type`):**
```ts
import { LEGACY_CHARACTER_MAP } from '@/types';
```
**2) احذف L135–140:**
```ts
const LEGACY_CHARACTER_MAP: Record<string, CharacterType> = {
  fox: 'sham',
  owl: 'bana',
  panda: 'joud',
  rabbit: 'rayan',
};
```
**3) التأثير — قديم:**
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
**جديد:**
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
**أبقِ:** فرع القيمة غير المعروفة (`'sham'` + `setShowSelector(true)`) كما هو (C152b/C165)، `savedName`، أنواع الشخصيات.
**تحقق:** `grep LEGACY_CHARACTER_MAP src` ← `types.ts` (تعريف) و`HeroDashboard.tsx` و`CharacterSelector.tsx` فقط؛ لا `const LEGACY_CHARACTER_MAP` ثانية؛ `git diff` ملف واحد؛ CI أخضر (`tsc`).
**ملاحظة:** حذف `soroban_companion` عند تبديل الحساب (بطاقة E1) يعمل مع هذا الإصلاح (القيمة الغائبة ← `sham` + اختيار).
**الاختبار من الهاتف:** لا (BLOCKED) — مكوّن React؛ CI يتحقق من الأنواع. `NOT RUN` لـ C151–C168.
**Commit message:** `fix(hero): use shared LEGACY_CHARACTER_MAP so aya maps to joud`
**الوقت المتوقع:** 10 دقائق
**مخاطر:** منخفض؛ خطأ `tsc` ممكن إن لم يُضيَّق النوع (الخطوة 3 تعالجه).
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [ ] مغلقة`

---

## بطاقة 3 — P3-01: مفتاح الثيم (لا تغيير)

**التغيير:** **لا كود.** البحث في `src`: `soroban_theme_key` يكتبه `ProfileScreen.tsx` L139 فقط ولا قارئ له؛ `soroban2d5-theme` يكتبه ويقرؤه `Soroban2D5.tsx` (L236/L229)، ويظهر في قوائم الأجهزة (`cloudSync.ts` L223، `GuardianDashboard.tsx` L108). نطاقا القيم مختلفان (`theme_cosmic…` مقابل `classic/ocean/barbie`) ← **إعدادان مستقلان**: لا Migration ولا حذف. زر الحفظ يبقى. طابق ذلك على GitHub (إن ظهر قارئ آخر لـ`soroban_theme_key` ← توقف).
**مسار C146b:** الثاني (مستقلان). C147–C149 غير منطبقة (لا Migration). C146/C150 تُسجَّل بعد تأكيدك على GitHub.
**ملاحظة وظيفية مستقلة (لا تُنفَّذ هنا):** `ProfileScreen` يبدأ دائماً بـ`theme_cosmic` ولا يقرأ `soroban_theme_key` فلا يُطبَّق الثيم المحفوظ. بند جديد بموافقتك إن رغبت.
**الاختبار من الهاتف:** نعم (بحث/قراءة فقط)
**Commit message:** — (لا Commit)
**الوقت المتوقع:** 5 دقائق
**مخاطر:** لا شيء
**الحالة:** `[ ] لم تُنفَّذ  |  [ ] CI أخضر  |  [x] مغلقة (لا تغيير) بعد تأكيد GitHub`

---

**بوابة الإغلاق النهائي:** P3-02 CI أخضر؛ P3-01 موثق بلا تغيير؛ P3-03 إما مغلق بقرار موثق بعد فحص القاعدة بموافقتك أو **مؤجل** (`mask_name` تبقى).
