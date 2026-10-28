# 🧮 SorobanMind v2 — المرجع الوصفي الشامل

### International Soroban Academy

> **آخر تحديث:** 2026-10-28 (rev.6)
> **الحالة:** 🟢 البناء أخضر · Supabase متصل · L0-L4 مكتمل · TTS يعمل
> **الغرض:** هذا الملف هو المرجع الوصفي الوحيد للمشروع. يصف الحالة الفعلية الحالية بدقة، دون الاعتماد على أي توثيق قديم.

---

## 🌟 الفكرة في سطر

تطبيق تعليمي عربي (React 18 + TypeScript) لتعليم السوروبان الياباني (منهج تاكاشي كوجيما) للأطفال (5-12) والكبار (13+)، بترجمة كاملة (عربي/إنجليزي)، وصوت (TTS + MP3)، مع مزامنة سحابية آمنة (Supabase).

- **الموقع:** `mezo2021.github.io/sorobanmind-2`
- **المستودع:** `github.com/mezo2021/sorobanmind-2`
- **المطوّر:** مصطفى علي أكر (@mezo2021)

---

## 🏆 الإنجازات الحالية (2026-10-28)

| # | الإنجاز | الحالة |
|---|---|---|
| 1 | **المنهاج L0-L4 مكتمل** (نصوص + ترجمة + TTS + MP3 لبعض الدروس) | ✅ |
| 2 | **قسم تمرن (Practice)** مترجم ar/en لجميع المستويات | ✅ |
| 3 | **الأنزان البصري (عادي + فلاش)** مترجم ar/en | ✅ |
| 4 | **الأنزان السمعي** مترجم ar/en | ✅ |
| 5 | **الامتحانات (Category Exams + Placement Test)** مترجمة ar/en | ✅ |
| 6 | **الفلاش التعليمي** مترجم ar/en | ✅ |
| 7 | **التكامل السحابي (Supabase)** + Auth + RLS | ✅ |
| 8 | **نظام المصادقة** (تسجيل/دخول) + قفل الشاشات | ✅ |
| 9 | **المزامنة اليدوية** (حفظ/استعادة) في لوحة ولي الأمر | ✅ |
| 10 | **الحزمة مخفضة 51%** (911 KB → 445 KB) | ✅ |
| 11 | **ترجمة الألعاب (5 ألعاب)** | ⏳ قيد التنفيذ (Claude) |

---

## 📚 حالة المنهاج الحقيقية

| Level | العنوان | الدروس | الحالة |
|---|---|---|---|
| **L0** | التمهيدي | intro · S01 · S02 | ✅ مكتمل (TTS + MP3) |
| **L1** | جمع وطرح | S03 · S04 | ✅ مكتمل (TTS + MP3) |
| **L2** | ضرب | S05 · S06 | ✅ مكتمل (TTS + MP3) |
| **L3** | قسمة | S07 · S08 | ✅ مكتمل (TTS) |
| **L4** | سلاسل جمع وطرح | S09 · S10 | ✅ مكتمل (TTS) |
| **L5** | ضرب وقسمة متقدم | S11 · S12 | ⏳ متبقٍ |
| **L6** | الأعداد العشرية | S13 · S14 | ⏳ متبقٍ |
| **L7** | الجذور التربيعية | S15 | ⏳ متبقٍ |

**ملاحظة:** المستويات L5-L7 تحتاج كتابة + ترجمة + TTS عربي/إنجليزي.

---

## 🎯 الأقسام التفاعلية (جاهزة 100%)

| القسم | الترجمة ar | الترجمة en | الحالة |
|---|---|---|---|
| تمرن (Practice) | ✅ | ✅ | L0-L7 |
| الأنزان البصري العادي | ✅ | ✅ | L0-L7 |
| الأنزان البصري الفلاش | ✅ | ✅ | L0-L7 |
| الأنزان السمعي | ✅ | ✅ | L0-L7 |
| امتحان القسم (Category Exam) | ✅ | ✅ | L0-L7 |
| تحديد المستوى (Placement) | ✅ | ✅ | L0-L7 |
| الفلاش التعليمي | ✅ | ✅ | L0-L7 |

---

## 🏗️ Tech Stack

| المكوّن | التقنية |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5.5 |
| Styling | Tailwind CSS 3 |
| Animation | framer-motion 11 |
| Icons | lucide-react |
| State Management | Zustand 4 + persist |
| Backend / Auth | Supabase (PostgreSQL + RLS) |
| TTS | Web Speech API (`useCharacterVoice`) |
| MP3 | Sorobana Voice (`useSorobanaVoice`) |
| Deployment | GitHub Pages |

---

## 🔐 نظام المصادقة (Authentication)

### البنية
- **`src/lib/supabase.ts`:** إعداد عميل Supabase.
- **`src/lib/cloudSync.ts`:** دوال التسجيل، الدخول، الخروج، الحفظ، الاستعادة.
- **`src/components/AuthModal.tsx`:** واجهة تسجيل/دخول.
- **جدول `soroban_progress`:** عمودان فقط (`user_id`, `progress_data`).

### آلية العمل
1. **عند فتح التطبيق:** `RoleSelection` تفحص حالة المستخدم.
2. **غير مسجل:** تفتح `AuthModal` تلقائياً.
3. **الشاشات مقفلة:** طبقة `Screens Locked` تمنع الوصول قبل التحقق.
4. **التسجيل:** إيميل + باسورد (6+ أحرف إنجليزية وأرقام) + اسم ولي الأمر + اسم الطفل (3 كلمات).
5. **الأسماء:** تُحفظ في `user_metadata` وتُقرأ تلقائياً عند الدخول.
6. **زر الخروج:** يمسح الأسماء فقط (وليس التقدم) ويعيد فتح `AuthModal`.

### الحماية (RLS)
- **3 سياسات:** SELECT / INSERT / UPDATE.
- **الشرط:** `auth.uid() = user_id`.
- **النتيجة:** كل طالب يرى بياناته فقط (على مستوى السيرفر).

---

## ☁️ المزامنة السحابية (Manual Sync)

### الآلية الحالية
- **الحفظ اليدوي:** من `GuardianDashboard` → زر "حفظ في السحابة".
- **الاستعادة اليدوية:** زر "استعادة من السحابة" → يجلب البيانات من Supabase → `window.location.reload()`.
- **الوضع الأوفلاين:** يتم اعتماد `getSession` بدلاً من `getUser` للسماح بالعمل أوفلاين بعد التسجيل الأول (مع التحقق الخفي في الخلفية).

### ما لم يُنفذ بعد
- ⏳ الحفظ التلقائي (Auto-Save) بـ Debounce 3s — مؤجل للمرحلة القادمة.

### ملاحظة الخصوصية
- **`progressStore`:** هو المصدر الوحيد للحقيقة محلياً.
- **Supabase:** خزانة نسخ احتياطي، لا تُستخدم إلا عند الضغط على الأزرار.
- **PWA:** التطبيق ليس PWA حالياً (لا Service Worker) — تحويله إلى PWA مطلوب لاحقاً لعمل الأوفلاين الكامل.

---

## 🎓 الأصول المحمية (قواعد صارمة)

### لا تلمس أبداً
- `src/App.tsx` — `levelOfLesson` (طبقة توافق دائمة).
- `src/i18n/*` — نظام الترجمة.
- `src/screens/Header.tsx`.
- `src/store/numberStyleStore.ts`.
- `src/components/soroban2d5/*` — المحرك الرسومي للمعداد.
- `src/components/flash/*`.
- `src/components/games/*`.
- `src/data/srb/*`.
- `src/engine/*` (Stubs مؤقتة).
- `src/lib/supabase.ts` و `src/lib/cloudSync.ts`.
- `src/components/AuthModal.tsx`.

### قرارات استراتيجية محسومة
1. **`levelOfLesson`:** لا تُحذف، لا تُعدّل.
2. **L1-L3:** تبقى بصيغة `S03-S08` للأبد.
3. **L5-L7:** تُكتب بصيغة `L5-S11`, `L6-S13`, `L7-S15` (إلزامي).
4. **`split('-')[0]`:** ممنوع نهائياً.
5. **`m13` (توحيد L1-L3):** مُلغاة نهائياً.

### بروتوكول التعديل
1. اقرأ الملف كاملاً قبل أي اقتراح.
2. لا تعدل قبل موافقة صريحة.
3. أعد الملف كاملاً (لا أجزاء).
4. انتظر CI أخضر بعد كل تعديل.

---

## 🎙️ نظام الصوت (TTS)

### البنية
- **`useSorobanaVoice`:** لتشغيل ملفات MP3 (قصة المعلمة).
- **`useCharacterVoice(heroId)`:** لتشغيل TTS بأصوات الأبطال الأربعة:
  - شام (pitch 1.40 · أنثوي)
  - ريان (pitch 0.70 · ذكوري)
  - بانة (pitch 1.25 · أنثوي)
  - جود (pitch 0.80 · ذكوري)

### التغطية
- **دروس L0-L4:** TTS عربي وإنجليزي + MP3 لبعض المستويات.
- **دروس L5-L7:** ستُضاف بنفس الطريقة.

---

## 🎮 مدينة الألعاب (قيد الترجمة)

| # | اللعبة | ID | الحالة |
|---|---|---|---|
| 1 | 🛸 العداد الطائر | `flying-abacus` | ⏳ ترجمة |
| 2 | 🔍 المحقق الرقمي | `detective` | ⏳ ترجمة |
| 3 | 🥋 دوجو السوروبان | `friends` | ⏳ ترجمة |
| 4 | 🏴‍☠️ سباق القراصنة | `pirate-race` | ⏳ ترجمة |
| 5 | 🏝️ جزيرة سوروبانيا | `sorobania-island` | ⏳ ترجمة |

- **البطل المرافق:** يُقرأ من `soroban_companion`.
- **الاقتصاد:** `totalXP` (بلا سقف) + `ticketXP` (سقف 50) + تذاكر (سقف 5).
- **المعاينة:** مفتاح `soroban_dev_preview` يفتح كل الألعاب مجاناً.

---

## 📊 حالة الحزمة (Bundle)

| المؤشر | القيمة |
|---|---|
| `index-*.js` | 445 KB |
| gzip | 135 KB |
| توفير مقارنة بـ 911 KB | 51% |
| الألعاب | Lazy-loaded |
| الدروس | Lazy-loaded |

---

## 🎯 خارطة الطريق المتبقية (مرتبة)

### 🔴 أولوية قصوى
1. **كتابة دروس L5-L7** (L5-S11, L5-S12, L6-S13, L6-S14, L7-S15) + ترجمة + TTS.
2. **تحويل التطبيق إلى PWA** (Service Worker) لعمل الأوفلاين الكامل.

### 🟠 أولوية متوسطة
3. **ترجمة الألعاب (5 ألعاب)** — جارية.
4. **الحفظ التلقائي (Auto-Save)** في Supabase.
5. **ربط `engine` بـ `srb-adapter`** (استبدال Stubs).

### 🟡 أولوية منخفضة
6. مراجعة الملفات المجمدة (`engine/*`).

### ❌ ما لن يُنفذ أبداً
- ❌ `m13` (توحيد L1-L3).
- ❌ Migration v13.
- ❌ تعديل ملفات L1-L3.
- ❌ حذف `levelOfLesson`.
- ❌ `split('-')[0]`.
- ❌ مراجعة `PirateRaceGame` و `Sorobania` (لا تستخدم المعداد).

---

## 🚨 تصحيحات وتنبيهات مهمة

### الادعاءات القديمة التي تم تصحيحها
| # | الادعاء القديم | الواقع الحالي |
|---|---|---|
| 1 | "PWA · Offline-First" | ليس PWA بعد (لا Service Worker) |
| 2 | "Zero server transmissions" | Supabase نشط |
| 3 | "حزمة 1.70 MB" | 445 KB بعد م5-ب |
| 4 | "دروس L2-L7 مفقودة" | L2-L4 مكتملة |
| 5 | "المحرك على bank-linked" | Stubs مؤقتة بعد م10 |

### ملاحظات حرجة
1. **لا تحذف Stubs من `engine/*`** حتى يتم الربط بـ SRB.
2. **البنوك القديمة حُذفت** في م10 (لا تبحث عن `bank.ts`).
3. **`useTranslation` حيّ** (3 مستوردين).
4. **`numberStyleStore`** له 3 مصادر (تحتاج مراجعة لاحقاً).
5. **`useQuests`** قديم (يحتاج مراجعة إذا أُريد استخدامه).
6. **`soroban_number_style`** مفتاح مشترك بين 3 ملفات (تعارض محتمل).

---

## 📁 بنية المشروع

```text
src/
├── App.tsx (~700 سطر · levelOfLesson)
├── main.tsx (ErrorBoundary + Suspense + cleanup)
├── i18n/ (ar · en · useTranslation)
├── curriculum/
│   ├── lessons/L0/ · L1/ · L2/ · L3/ · L4/
│   └── lessons/index.ts
├── engine/ (5 ملفات · Stubs مؤقتة)
├── data/
│   ├── srb/ (النظام الموحد)
│   └── srb-adapter.ts
├── lib/
│   ├── supabase.ts
│   └── cloudSync.ts
├── store/
│   ├── progressStore.ts (v12)
│   ├── masteryBadgesStore.ts
│   └── numberStyleStore.ts
├── hooks/ (useCharacterVoice · useSorobanaVoice · useSpeech...)
├── components/
│   ├── AuthModal.tsx
│   ├── games/ (5 ألعاب · Lazy-loaded)
│   ├── flash/ (11 ملف)
│   └── soroban2d5/ (محمي · memoized)
├── screens/ (22 شاشة)
├── utils/ (translateDynamic · previewMode · numberStyle...)
└── types.ts
```

---

🧪 اختبارات إلزامية بعد كل تعديل

☐ التطبيق يفتح بسرعة.
☐ لوحة البطل تعمل.
☐ المستويات مقفلة بشكل صحيح.
☐ اسم الطفل يظهر في كل مكان.
☐ الأنزان البصري يعمل.
☐ الأنزان السمعي يعمل.
☐ الامتحانات تعمل.
☐ الفلاش يعمل.
☐ زر التصفير يعمل.
☐ Backup / Restore يعمل.
☐ Cloud Save / Load يعمل.
☐ Auth يعمل (تسجيل/دخول/خروج).
☐ CI Build أخضر.

---

👨‍💻 Developer

مصطفى علي أكر (@mezo2021)

---

<div align="center">

🧮 SorobanMind v2

Built with love for children across the Arab world 🌍

Last Updated: 2026-10-28 · Build: 🟢 Passing · Supabase: 🟢 Connected

https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge
https://img.shields.io/badge/Language-Arabic_&_English-blue?style=for-the-badge
https://img.shields.io/badge/Cloud-Supabase-3ecf8e?style=for-the-badge

</div>
```