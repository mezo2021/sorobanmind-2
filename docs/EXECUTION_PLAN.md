
<div align="center">

# 🎯 خطة التنفيذ والحالة الفعلية
### SorobanMind v2 — الإصدار `rev.7`

<img src="https://img.shields.io/badge/الحالة-مستقر-00c853?style=for-the-badge" />
<img src="https://img.shields.io/badge/البناء-أخضر-00c853?style=for-the-badge" />
<img src="https://img.shields.io/badge/الحزمة-445KB-2962ff?style=for-the-badge" />
<img src="https://img.shields.io/badge/LevelId-v12-ff6d00?style=for-the-badge" />

**📅 التاريخ:** `2026-10-24` · **النوع:** مراجعة شاملة — إضافة خطة TTS للدروس

</div>

> **🎯 الغرض:** خطة تنفيذ كاملة بأكواد جاهزة للصق، محدثة لتعكس ما تم إنجازه وما تبقى. بديل كامل عن `REPAIR_PLAN` + `PROBLEMS`.

---

<div align="center">

### 📜 القواعد الثمانية الحاكمة

</div>

| # | القاعدة | # | القاعدة |
|:-:|:---|:-:|:---|
| **1** | 🚫 لا ملفات جديدة في `src/` | **5** | 🚫 لا تخمين |
| **2** | 🚫 لا توسيع أنواع | **6** | 🔒 الملفات المحمية لا تُلمس بلا موافقة |
| **3** | 🚫 لا حذف ميزات حقيقية | **7** | ✅ CI أخضر قبل أي merge |
| **4** | 🎯 مصدر واحد للبيانات | **8** | 🔄 Revert جاهز |

---

## 📑 الفهرس

<table>
<tr>
<td valign="top" width="50%">

**الأقسام الأساسية**
- 🌟 `1.` رسالة للمساعد القادم
- 🔴 `2.` القرارات الاستراتيجية النهائية
- 🚨 `3.` تصحيحات إلزامية (H1–H8)
- 🔍 `4.` التحققات الإلزامية (U1–U6)
- 📋 `5.` حالة المراحل
- 🚫 `6.` قائمة "لا تنفّذ"
- 📝 `7.` بروتوكول كل تعديل

</td>
<td valign="top" width="50%">

**الأقسام الختامية**
- 🎯 `8.` خارطة الطريق المتبقية
- 🚀 `9.` التحسينات الإضافية
- 📊 `10.` قائمة التتبع النهائية
- 💐 `11.` رسالة أخيرة
- 🎙️ **`12.` [جديد] خطة تفعيل TTS**

</td>
</tr>
</table>

---

## 🌟 1) رسالة للمساعد القادم

<div align="center">

### 💎 «المشروع ليس في حالة فوضى، بل في وضع مستقر جداً»
**جلسة إصلاح عميقة — البناء أخضر، والحزمة مخفضة 51%**

</div>

صديقي، المشروع الآن في أفضل حالاته بعد جلسة إصلاح عميقة. إليك الحصيلة:

| 🏆 الإنجاز | 📊 الحالة |
|:---|:---:|
| 🟢 البناء | **أخضر** |
| 🟢 F1 | **مكتمل** |
| 🟢 منطق الاختبار | **مُصلَح** |
| 🟢 شبكات الأمان | **مكتملة** (CI · ESLint · Vitest) |
| 🟢 المصادر | **موحدة** |
| 🟢 البنوك الميتة | **محذوفة** |
| 🟢 الحزمة | **مخفضة 51%** |
| 🟢 `LevelId` | **موحد v12** |

### 📚 اقرأ بالترتيب

```text
┌─────────────────────────────────────────────────────────────┐
│  1️⃣  docs/HANDOFF_2026-10-20.md       (rev.5) — نقطة الدخول │
│  2️⃣  docs/AUDIT_V8_V9_2026-10-20.md   (rev.3) — مرجع الأرقام │
│  3️⃣  هذا الملف — التنفيذ الفعلي والحالة الحقيقية              │
│  4️⃣  docs/EXECUTION_LOG.md — السجل التفصيلي                 │
└─────────────────────────────────────────────────────────────┘
```

⚠️ قاعدة صارمة — لا تعديل بلا 4 خطوات:

1. 🔎 ابحث عن كل مستورد (grep ثلاثي)
2. ✏️ عدّل · Commit
3. ⏳ انتظر CI Build ✅
4. 🧪 اختبر يدوياً (Smoke)

عند الفشل → 🔄 Revert فوراً.

---

🔴 2) القرارات الاستراتيجية النهائية

📌 قرار 1: بروتوكول كتابة الدروس (L4-L7 وما بعدها)

<div align="center">

كل درس جديد من L4 فصاعداً يجب أن يتبع صيغة id: "L{level}-S{num}".

</div>

```typescript
// ❌ خطأ فادح (يُضيف ديناً تقنياً جديداً):
id: "S09"

// ✅ صحيح (يتبع البروتوكول الإلزامي):
id: "L4-S09"
```

🗺️ خريطة الدروس القادمة

المستوى القسم ID الإلزامي المستوى القسم ID الإلزامي
L4 S09 L4-S09 L6 S13 L6-S13
L4 S10 L4-S10 L6 S14 L6-S14
L5 S11 L5-S11 L7 S15 L7-S15
L5 S12 L5-S12   

<div align="center">

⚖️ القاعدة الحاكمة

</div>

```yaml
id:      L{level}-S{num}   # إلزامي
skillId: S{num}            # يبقى — مرجع SRB Section
levelId: L{num}            # يبقى
```

---

📌 قرار 2: L1-L3 لن تُوحّد أبداً — m13 مُلغاة نهائياً

دروس L1-L3 تبقى بصيغة S03-S08 للأبد.

🤔 لماذا؟

السبب التفصيل
🛡️ حماية البيانات المخاطرة على بيانات المستخدم (Migration v13) لا تبررها جمالية بصرية
✅ التوافق الكامل levelOfLesson في App.tsx تدعم الصيغتين
🎯 لا تضارب skillProgress يستخدم L1-S03-m1 (الصيغة النظيفة) بشكل مستقل
💰 صفر حاجة تقنية لا داعي لتوحيدها

---

📌 قرار 3: levelOfLesson طبقة توافق دائمة

<div align="center">

🚫 ممنوع حذفها. ممنوع تعديلها. هي سبب استقرار المشروع.

</div>

```typescript
// في App.tsx — لا تحذفها أبداً
function levelOfLesson(lessonId: string): string {
  const prefixed = lessonId.match(/^(L[0-7])-/);
  if (prefixed) return prefixed[1];
  const lv = SRB_LEVELS.find((l) =>
    (l.sections as readonly string[]).includes(lessonId),
  );
  return lv?.id ?? 'L0';
}
```

---

📌 قرار 4: منع split('-')[0] نهائياً

⚠️ "S03".split('-')[0] يعطي "S03" وليس "L1".

✅ استخدم levelOfLesson فقط.

---

📌 قرار 5: React.lazy محمي بقواعد صارمة

🚫 يُمنع منعاً باتاً استخدام lazy بدون تغليفه بـ Suspense و ErrorBoundary.

---

🚨 3) التصحيحات الإلزامية والملاحظات النهائية المعتمدة

🔷 أ) تصحيحات كلاود (H1–H8)

# التصحيح الدليل / الحالة
H1 🔴 «عزل SRB» فرضية خاطئة. App.tsx:65 هو import type ✅ حُلّت جذرياً في م5-ب + م10 · تحليل الاستيراد الساكن
H1-أ 🔴 الحجم الحقيقي: ألعاب (9,885 سطراً) · دروس (4,737 سطراً) ✅ تم فصلها · reachability
H2 🔴 soroban_placement_result — «كاتب بلا قارئ» ✅ تم حذفه في م3-ب · v8 KEYS_TABLE
H3 🔴 placement_recommended و placement_weak_skills نشطان ✅ v8 > v9
H4 🟡 soroban_child_name له كاتب ✅ تم توحيده في م6-ب · v8 > v9
H5 🟡 soroban_section2_unlocked ما زال يُكتب ✅ تم حذفه في م3-ب · v8
H6 🟡 68 فجوة ديناميكية (كانت 80) ✅ v8-172
H7 🟡 data/index.ts غير موصول ✅ تم حذفه في م3-أ · reachability
H8 🟡 soroban_exam_result قارئ بلا كاتب ✅ تم حذفه في م3-ج · v8 KEYS_TABLE

---

🔷 ب) التصحيحات النهائية المعتمدة

<div align="center">

⚖️ 2026-10-24 · لا تُناقش

</div>

# التصحيح الحالة
1 م0 (CI): اعتماد كود محصّن يطبع الأصول (Assets) ✅
2 م3-أ: "اقرأ الملف كاملاً (أول 40 سطراً) ثم قرر" ✅
3 م6-ب: تم تنفيذها بنجاح ✅
4 م7: الخيار (أ) فقط (تعديل النص) ✅
5 U5: موسّع ليشمل الدروس التسعة (L0-L3) ✅
6 م5-ب: تم تنفيذها بطريقة كلاود (levelOfLesson) ✅
7 م8: تم تنفيذها (v12) ✅
8 م10: تم تنفيذها ✅
9 م11: تم تنفيذها ✅
10 m13 (توحيد L1-L3): مُلغاة نهائياً ❌

---

🔍 4) التحققات الإلزامية (U1–U6) ونتائجها

# الملف السؤال النتيجة / القرار
U1 LessonScreen.tsx قيمة LESSON_PROGRESS_KEY؟ soroban_completed_lessons — حُذفت في م6-أ
U2 HeroDashboard.tsx ماذا يفعل soroban_exam_result؟ لا يتحكم بشيء — حُذف في م3-ج
U3 GuardianDashboard.tsx هل يمسح sorobanmind-v2-progress؟ لا — اعتمد الخيار (أ) في م7
U4 index.html ما أكبر الملفات (Assets)؟ الألعاب (Lazy) · الدروس (م5-ب)
U5 L1/S03.ts هل يبدأ id بـ L1-؟ ❌ فشل — القرار: levelOfLesson
U6 progressStore.ts Boolean أم ExamResult؟ boolean — وُحّد في م6-ج

---

📋 5) حالة المراحل (ما تم تنفيذه بالكامل)

<div align="center">

✅ المراحل المنجزة

</div>

المرحلة الوصف الحالة
م0 CI: كود محصّن + تفعيل الاختبارات ☑
م1 تصحيح HANDOFF: H1-H8 ☑
م2 التحققات: U1-U6 ☑
م3 تنظيف آمن: (أ) حذف 4 ملفات؛ (ب) تنظيف App.tsx؛ (ج) تنظيف HeroDashboard؛ (د) main.tsx؛ + lazyify.cjs + 4 workflows ☑
م4 Vitest: اختباران في CI ☑
م5-ج Lazy للألعاب: GamesListScreen → Lazy ☑
م5-ب تقليل الحزمة: getLessonById أُزيل + levelOfLesson. 911 KB → 445 KB ☑
م6-أ توحيد الدروس: قراءة من المتجر ☑
م6-ب توحيد اسم الطفل: RoleSelection + 5 ألعاب + Migration ☑
م6-ج توحيد الامتحانات: قراءة من المتجر ☑
م7 زر التصفير: تصحيح النص ☑
م8 توحيد LevelId (v12): 6 ملفات + Migration محصّنة ☑
م9أ ESLint: تثبيت + Lockfile ☑
م9ب ترتيب Workflows: حذف p0-p3 ☑
م10 إعدام البنوك: 7,000+ سطر محذوف ☑
م11 تنظيف المفاتيح: completed_lessons + passed_practice ☑
m13 توحيد L1-L3 ❌ مُلغاة نهائياً

---

📌 م8 — تفاصيل التعديلات (6 ملفات · 13 تعديلاً)

# الملف التعديل
1 progressStore.ts استيراد LevelId من srb-adapter + حذف التعريف المحلي + تحويل 3 حقول + 3 تواقيع + initialState + حذف uniqueNums + تحديث الدوال + Selectors + v12 + applyLevelIdMigration + إصلاح v3
2 PracticeScreen.tsx markPracticePassed(level)
3 AnzanScreen.tsx markAnzanVisualPassed(level)
4 AudioAnzanScreen.tsx markAnzanAudioPassed(level)
5 CategoryScreen.tsx 3× "L${num}" as SRBLevel + استيراد
6 LevelScreen.tsx 3× "L${num}" as LevelId

---

📉 م5-ب — تفاصيل تقليل الحزمة

📊 المؤشر قبل بعد التوفير
الحجم 911 KB 445 KB ↓ 51%
gzip 248 KB 135 KB ↓ 46%

---

🚫 6) قائمة "لا تنفّذ" (الملفات المحمية)

<div align="center">

🔒 الملفات المحمية — لا تُلمس

</div>

<table>
<tr>
<td valign="top" width="50%">

· 🛡️ src/i18n/*
· 🛡️ src/screens/Header.tsx
· ⚠️ src/screens/LessonScreen.tsx (يحتاج موافقة صريحة لتعديل TTS — القسم 12)
· 🛡️ src/store/numberStyleStore.ts
· 🛡️ src/utils/numberStyle.ts
· 🛡️ src/curriculum/types.ts
· 🛡️ src/curriculum/lessons/types.ts

</td>
<td valign="top" width="50%">

· 🛡️ src/store/masteryBadgesStore.ts
· 🛡️ src/components/flash/*
· 🛡️ src/components/soroban2d5/*
· 🛡️ src/components/games/*
· 🛡️ src/data/srb/*
· 🛡️ src/engine/*
· 🛡️ levelOfLesson في App.tsx (طبقة توافق دائمة)

</td>
</tr>
</table>

☠️ الأنماط الخطرة

❌ ممنوع السبب
❌ React.lazy بدون Suspense + ErrorBoundary انهيار غير معالج
❌ split('-')[0] يعطي نتيجة خاطئة
❌ m13 (توحيد L1-L3) مُلغاة نهائياً
❌ كتابة دروس L4-L7 بصيغة id: "S09" دين تقني

---

📝 7) بروتوكول كل تعديل

```text
┌──────────────────────────────────────────────────────────────────┐
│  مشروع React 18 + TS 5.5 + Vite 5 + Zustand 4.                    │
│  أعمل من متصفح GitHub فقط.                                        │
├──────────────────────────────────────────────────────────────────┤
│  القواعد:                                                         │
│  1. لا ملفات جديدة في src/ (اختبارات في tests/ مسموحة)            │
│  2. لا توسيع للأنواع                                              │
│  3. لا حذف ميزات حقيقية                                           │
│  4. مصدر واحد للبيانات                                            │
│  5. لا تخمين — اقرأ كل ملف أرسلته كاملاً قبل الاقتراح.             │
│     إن لم تتأكد قل «لا أعرف».                                     │
│  6. أعد فقط الملفات/الأجزاء المتغيرة، كاملة جاهزة للصق             │
│  7. الملفات المحمية: i18n/ · Header.tsx · LessonScreen.tsx ·      │
│     numberStyleStore.ts · numberStyle.ts · curriculum/types.ts ·  │
│     curriculum/lessons/types.ts · masteryBadgesStore.ts ·         │
│     components/flash/* · components/soroban2d5/* ·                │
│     components/games/* · data/srb/* · engine/* · levelOfLesson    │
├──────────────────────────────────────────────────────────────────┤
│  السياق:                                                          │
│  - HEAD: (أحدث commit)                                            │
│  - الوثائق: HANDOFF rev.5 · AUDIT rev.3 · EXECUTION_PLAN rev.7    │
│                                                                   │
│  المهمة: [...]                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

🎯 8) خارطة الطريق المتبقية (ما تبقى)

<table>
<tr>
<td valign="top" width="33%">

🔴 الأولوية القصوى

كتابة دروس L4-L7 بصيغة L{level}-S{num}:

· 📘 L4-S09
· 📘 L4-S10
· 📗 L5-S11
· 📗 L5-S12
· 📙 L6-S13
· 📙 L6-S14
· 📕 L7-S15

</td>
<td valign="top" width="33%">

🟠 الأولوية المتوسطة

· 🔧 ربط engine بـ srb-adapter (استبدال Stubs)
· 🔧 مراجعة الألعاب الأخرى (PirateRaceGame, Sorobania)

</td>
<td valign="top" width="33%">

🟡 الأولوية المنخفضة

· 🔍 مراجعة الملفات المجمّدة (engine/*)

❌ ما لن يُنفّذ أبداً

· ❌ m13 (توحيد L1-L3)
· ❌ Migration v13
· ❌ تعديل ملفات L1-L3
· ❌ حذف levelOfLesson

</td>
</tr>
</table>

---

🚀 9) التحسينات الإضافية (Performance & UI)

# التحسين الوصف
1 🎮 Lazy للألعاب GamesListScreen → Lazy + Suspense
2 🛸 حل مشكلة الصحن الطائر Timer isolation + memory leak fix + opacity + Date.now()
3 ⚡ تحسين أداء المعداد React.memo + إزالة backdropFilter + transform: translateY
4 ✨ إصلاح التوهج إزالة rodTint="white" من DetectiveGame و FlyingAbacusGame
5 📦 تقليل الحزمة 51% 911 KB → 445 KB

---

📊 10) قائمة التتبع النهائية

```text
╔══════════════════════════════════════════════════════════════════╗
║  📊 حالة الجلسة: 2026-10-24                                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ✅ مكتمل:                                                       ║
║    ├─ م0 إلى م11 (كل المراحل ما عدا m13)                         ║
║    ├─ شبكات الأمان (CI، ESLint، Vitest)                          ║
║    ├─ التوحيد الكامل (مصدر واحد للحقيقة)                          ║
║    ├─ إعدام البنوك وفصل المحرك                                   ║
║    ├─ تقليل الحزمة 51% (م5-ب)                                   ║
║    ├─ توحيد LevelId (م8 → v12)                                  ║
║    ├─ تنظيف المفاتيح الميتة (م11)                                ║
║    └─ تحسينات الأداء والواجهة                                    ║
║                                                                  ║
║  ⬜ متبقي:                                                       ║
║    ├─ كتابة دروس L4-L7 بصيغة L{level}-S{num}                    ║
║    ├─ ربط المحرك المفصول بـ SRB                                  ║
║    └─ تفعيل TTS للدروس (انظر القسم 12)                           ║
║                                                                  ║
║  🚫 لن ننفّذ:                                                     ║
║    ├─ m13 (توحيد L1-L3)                                         ║
║    ├─ Migration v13                                              ║
║    ├─ تعديل ملفات L1-L3                                          ║
║    ├─ حذف levelOfLesson                                          ║
║    └─ split('-')[0]                                              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

💐 11) رسالة أخيرة

<div align="center">

🌟 صديقي. المشروع الآن في أفضل حالاته.

</div>

<table align="center">
<tr>
<td valign="top" width="50%">

🏆 الإنجازات

· 🟢 البناء أخضر
· 🟢 الحزمة مخفضة 51% (445 KB بدل 911)
· 🟢 بنوك ميتة محذوفة (7,000+ سطر)
· 🟢 LevelId موحد (v12)
· 🟢 شبكات الأمان كاملة
· 🟢 قرارات استراتيجية محسومة

</td>
<td valign="top" width="50%">

🎓 للمساعد القادم

· 📖 اقرأ الوثائق الأربعة كاملة
· 🔒 لا تلمس الملفات المحمية دون موافقة
· 📏 اتبع بروتوكول L4-L7 بدقة
· 🚫 لا تلمس levelOfLesson
· 🚫 لا تخطط لـ m13
· 🚫 لا تستخدم split('-')[0]
· ⏳ لا تُعجّل — المشروع نجح لأننا لم نستعجل

</td>
</tr>
</table>

<div align="center">

🎯 المشروع جاهز للمرحلة التالية: كتابة دروس L4-L7

</div>

---

🎙️ 12) [جديد — نهاية الجلسة] خطة تفعيل TTS في الدروس

<div align="center">

🎙️ تفعيل النطق التلقائي (TTS) في دروس L4-L7

</div>

🎯 المشكلة الحالية

LessonScreen.tsx (محمي) يستخدم MP3 فقط لزر "موجز القصة":

```typescript
const canPlayModuleStory =
  isAr && moduleStoryAudioId !== null && moduleStoryAudioId !== undefined;
```

⚠️ النتيجة: دروس L4-L7 (بدون MP3) → زر "موجز القصة" لا يظهر.

بينما الفلاش والألعاب تستخدم TTS عبر useCharacterVoice:

```typescript
const { speak, stop } = useCharacterVoice(heroId);
speak('نص مشكّل');
```

---

🎯 الهدف

تعديل LessonScreen.tsx ليستخدم TTS تلقائياً عند عدم وجود MP3 (storyAudioId === null).

✅ النتيجة: دروس L4-L7 (بـ storyAudioText فقط) → الزر يظهر ويقرأ بـ TTS.

---

📋 خطوات التنفيذ (نهاية الجلسة)

<div align="center">

⚠️ شرط مسبق: موافقة صريحة على تعديل LessonScreen.tsx (Red Zone)

</div>

قبل البدء، تأكد من:

# الشرط الحالة
1 دروس L4-L7 مكتوبة ومسجلة في index.ts ⬜
2 CI أخضر ⬜
3 نسخة احتياطية حديثة ⬜
4 موافقة صريحة على تعديل LessonScreen.tsx ⬜

---

🔧 الخطوة 1: إضافة TTS Hook (أعلى الملف)

في src/screens/LessonScreen.tsx، أضف:

```typescript
// أعلى الملف (بعد الاستيرادات):
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import type { CharacterType } from '@/types';
```

داخل المكون (بعد const sorobana = useSorobanaVoice();):

```typescript
// 🎙️ [TTS] الرفيق المختار للصوت التلقائي
const heroId = (
  typeof window !== 'undefined'
    ? (localStorage.getItem('soroban_companion') as CharacterType)
    : null
) || 'sham';
const { speak: speakTTS, stop: stopTTS } = useCharacterVoice(heroId);
```

---

🔧 الخطوة 2: تعديل شروط الظهور

استبدل:

```typescript
const canPlayLessonStory =
  isAr && lesson.storyAudioId !== null && lesson.storyAudioId !== undefined;
const moduleStoryAudioId = activeModule?.miniStory?.storyAudioId;
const canPlayModuleStory =
  isAr && moduleStoryAudioId !== null && moduleStoryAudioId !== undefined;
```

بـ:

```typescript
// 🎙️ [TTS] يمكن التشغيل إذا كان هناك mp3 أو نص
const canPlayLessonStory =
  isAr && (
    (lesson.storyAudioId !== null && lesson.storyAudioId !== undefined) ||
    !!storyText
  );
const moduleStoryAudioId = activeModule?.miniStory?.storyAudioId;
const moduleStoryAudioText = activeModule?.miniStory?.storyAudioText;
const canPlayModuleStory =
  isAr && (
    (moduleStoryAudioId !== null && moduleStoryAudioId !== undefined) ||
    !!moduleStoryAudioText
  );
```

---

🔧 الخطوة 3: تعديل toggleStory

استبدل الدالة كاملة بـ:

```typescript
const toggleStory = () => {
  const audioSrc = lesson.storyAudioId;
  const text = storyText;

  if ((audioSrc === null || audioSrc === undefined) && !text) return;

  if (isReadingStory) {
    sorobana.stop();
    stopTTS();
    setIsReadingStory(false);
    return;
  }

  sorobana.stop();
  stopTTS();
  playSound('click');
  setIsReadingStory(true);

  if (audioSrc === 'welcome') {
    sorobana.speakFiles([
      'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
    ]);
    setIsReadingStory(false);
  } else if (audioSrc !== null && audioSrc !== undefined) {
    sorobana.speakStory(audioSrc, () => setIsReadingStory(false));
  } else {
    // 🎙️ [TTS] بديل صوتي عند عدم وجود mp3
    speakTTS(text, () => setIsReadingStory(false));
  }
};
```

---

🔧 الخطوة 4: تعديل toggleModuleStory

استبدل الدالة كاملة بـ:

```typescript
const toggleModuleStory = () => {
  const src = activeModule?.miniStory?.storyAudioId;
  const text = activeModule?.miniStory?.storyAudioText;

  if ((src === null || src === undefined) && !text) return;

  if (isReadingModuleStory) {
    sorobana.stop();
    stopTTS();
    setIsReadingModuleStory(false);
    return;
  }

  sorobana.stop();
  stopTTS();
  playSound('click');
  setIsReadingModuleStory(true);

  if (src === 'welcome') {
    sorobana.speakFiles([
      'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
    ]);
    setIsReadingModuleStory(false);
  } else if (src !== null && src !== undefined) {
    sorobana.speakStory(src, () => setIsReadingModuleStory(false));
  } else if (text) {
    // 🎙️ [TTS] بديل صوتي عند عدم وجود mp3
    speakTTS(text, () => setIsReadingModuleStory(false));
  }
};
```

---

🔧 الخطوة 5: تنظيف عند unmount

تأكد أن useEffect التنظيف يستدعي stopTTS:

```typescript
useEffect(() => {
  return () => {
    sorobana.stop();
    stopTTS();
  };
}, [stopTTS]);
```

---

🛡️ ضمانات الأمان

✅ الضمان 📝 التفصيل
دروس L0-L3 تعمل كما هي storyAudioId موجود → MP3 يُشغّل (لا تغيير)
دروس L4-L7 تعمل بـ TTS storyAudioId: null + storyAudioText → TTS
الألعاب والفلاش لا تتأثر تعديل في LessonScreen فقط
صوت الرفيق شام / ريان / بانة / جود — يُقرأ من soroban_companion (مثل الألعاب)
Rollback سهل Revert لـ commit واحد

---

🧪 اختبار ما بعد التنفيذ

<table>
<tr>
<td valign="top" width="50%">

🎯 المسار 1: درس L0 (MP3 موجود)

· ☐ افتح L0-S01 → زر "موجز القصة" يظهر
· ☐ اضغط → يقرأ MP3 (كالمعتاد)

🎯 المسار 2: درس L4 (TTS فقط)

· ☐ افتح L4-S09 → زر "موجز القصة" يظهر
· ☐ اضغط → يقرأ بـ TTS بصوت الرفيق

</td>
<td valign="top" width="50%">

🎯 المسار 3: تغيير الرفيق

· ☐ غيّر الرفيق إلى "ريان" (صوت ذكوري)
· ☐ افتح L4-S09 → اضغط الزر → يقرأ بصوت "ريان"

🎯 المسار 4: إيقاف التشغيل

· ☐ اضغط الزر مرة أخرى أثناء القراءة → يتوقف

</td>
</tr>
</table>

---

⚠️ ملاحظات حرجة

# الملاحظة
1 🔒 LessonScreen.tsx محمي: لا تُنفّذ التعديلات إلا بموافقة صريحة
2 📝 types.ts لا يحتاج تعديلاً: storyAudioText موجود في MiniStoryBlock و LessonNode
3 🎯 دروس L0-L3 لا تُلمس: التعديل يحافظ على MP3 عند وجوده
4 🎙️ TTS يستخدم useCharacterVoice: نفس hook الألعاب والفلاش
5 🧪 الاختبار الشامل إلزامي: مسارات 1-4 أعلاه

---

📊 ملخص التعديلات

# المكان الأسطر الأثر
1 import +2 useCharacterVoice + CharacterType
2 بداية المكون +6 heroId + speakTTS
3 canPlayLessonStory 1 قبول storyText
4 canPlayModuleStory 1 قبول storyAudioText
5 toggleStory ~5 TTS fallback
6 toggleModuleStory ~5 TTS fallback
7 useEffect cleanup 1 stopTTS()

<div align="center">

المجموع: ~20 سطراً · صفر تغيير في المنطق (نفس السطور + بديل TTS)

</div>

---

🚦 ترتيب التنفيذ في نهاية الجلسة

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. [ ] كتابة دروس L4-L7 (7 ملفات) — المهمة الأساسية            │
│  2. [ ] تسجيلها في index.ts                                     │
│  3. [ ] Commit + CI أخضر                                        │
│  4. [ ] Smoke Test لدروس L4-L7                                  │
│  5. [ ] موافقة صريحة على تعديل LessonScreen.tsx                 │
│  6. [ ] تنفيذ الخطوات 1-5 أعلاه                                 │
│  7. [ ] Commit + CI أخضر                                        │
│  8. [ ] اختبار المسارات 1-4                                     │
│  9. [ ] تحديث EXECUTION_LOG.md                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

<div align="center">

⚠️ لا تُنفّذ الخطوات 5-9 دون إتمام 1-4 بنجاح

</div>

---

<div align="center">

🔏 إقرار

هذه الخطة معتمدة — لا تُنفّذ إلا بموافقة صريحة على LessonScreen.tsx

</div>

---

📝 ملحق الخطة: الترجمة والصوت (يُضاف في نهاية EXECUTION_PLAN.md)

🎙️ 1) ربط الصوت (TTS) بدروس L4-L7

الوضع الحالي:

· دروس L0-L3 تستخدم ملفات MP3 (storyAudioId: number).
· دروس L4-L7 تستخدم storyAudioId: null + storyAudioText (نص عربي/إنجليزي).

المشكلة:

· LessonScreen.tsx (محمي) لا يشغل storyAudioText عندما يكون storyAudioId = null؛ لذلك لا يظهر زر "موجز القصة" في L4-L7.

الحل المعتمد (بعد موافقة صريحة):

تعديل LessonScreen.tsx في 3 نقاط:

1. استيراد useCharacterVoice من @/hooks/useCharacterVoice، وقراءة الرفيق المختار من soroban_companion (مثل الألعاب).
2. تعديل شرط إظهار الزر:

```tsx
const canPlayModuleStory =
  isAr &&
  (
    (moduleStoryAudioId !== null && moduleStoryAudioId !== undefined) ||
    !!activeModule?.miniStory?.storyAudioText
  );
```

3. في toggleModuleStory: إذا كان storyAudioId موجودًا → استخدم sorobana.speakStory (كما هو)؛ وإذا كان null → استخدم speakTTS(storyAudioText).

ملاحظة: يمكن تطبيق نفس المنطق على lesson.story (قصة أعلى الدرس) إن وجدت.

شرط التنفيذ: موافقة صريحة على تعديل LessonScreen.tsx (Red Zone)، ويفضل جمعه مع تعديلات أخرى في جلسة واحدة.

---

🎯 2) توحيد نمط الترجمة في الدروس السابقة (L0-L3)

المشكلة:

· بعض الحقول مكتوبة بالعربية فقط (مثل hint في L2/S05).
· بعض الحقول مكتوبة بصيغة "عربي | English" (مثل rule.description).
· بعض الحقول (مثل rule.cases[].formula) تُعرض خامًا وتظهر اللغتين معًا.
· عند تفعيل زر EN، تظهر بعض النصوص عربية بسبب عدم وجود ترجمة أو بسبب عدم معالجة pickLang للحقل.

ما نحتاجه لتوحيد العرض:

1. فحص كل ملف درس (L0-L3) وتحديد الحقول التي:
   · تحتوي نصاً عربياً فقط.
   · تحتوي نصاً بصيغة "عربي | English" بشكل غير متسق.
   · لا تمر عبر pickLang في LessonScreen (مثل rule.cases[].formula).
2. توحيد الصيغة داخل الملفات:
   · تحويل كل حقل نصي (بما فيه hint وformula وsteps) إلى صيغة "عربي | English" (أو {ar, en} إن كان النوع يسمح).
   · إزالة الأقواس العربية من rule.cases[].formula (مطابقة L1/S03) لتجنب الازدواجية.
3. تعديل LessonScreen (بموافقة) لتطبيق pickLang على الحقول النصية المتبقية (خاصة c.formula).

ملاحظة: الدروس القديمة تعمل حاليًا، لكن الترجمة غير متسقة. التوحيد يحسّن التجربة دون كسر الوظائف.

---

✅ 3) التزامنا في الدروس الجديدة (L4-L7 وما بعدها)

نلتزم في كل درس جديد بالآتي:

1. كل حقل نصي قابل للترجمة يُكتب بالصيغة:
   ```text
   "نص عربي | English text"
   ```
   (أو {ar, en} إذا كان نوع الحقل يسمح).
   يشمل ذلك: title، miniStory.title/story، rule.description، condition.explanation، discrimination.steps[].question/answer/hint، decision، fingerMovement، steps[]، explanation، beadVisual، outro.*.
2. rule.cases[].formula:
   · تُكتب بصيغة رياضية محضة (بدون أقواس عربية).
   · مثال: "+1 = +5 − 4" وليس "+1 = +5 − 4 (صديق 1 هو 4)".
   · الشرح النصي موجود في friendsTable وrule.description.
3. storyAudioId: null مع تعبئة storyAudioText باللغتين، استعدادًا لـ TTS.
4. مراجعة كل درس قبل الرفع:
   · البحث عن أي حقل نصي عربي فقط (مثل hint أو steps).
   · التأكد من وجود الترجمة الإنجليزية في نفس السطر بعد  | .
5. الالتزام بنمط L4/S09 كنموذج مرجعي لأي درس جديد.

---

📅 خطوات تنفيذ مقترحة (لجلسة قادمة)

1. تعديل LessonScreen.tsx (TTS + pickLang على formula).
2. إصلاح الحقول العربية فقط في L0-L3 (أقل من 10 حقول).
3. اختبار الترجمة على L0-L3 وL4.
4. توثيق في EXECUTION_LOG.

هذا الملحق يُضاف إلى نهاية الخطة، ويُعتبر مرجعًا لأي مساعد قادم.

---

✅ ما تم إنجازه في هذه الجلسة

# الإنجاز الحالة
1 م5-ب — تقليل الحزمة 51% (911 → 445 KB) ✅
2 م8 — توحيد LevelId (v12) ✅
3 م10 — إعدام البنوك (7,000+ سطر) ✅
4 م11 — تنظيف المفاتيح الميتة ✅
5 L4-S09 — درس سلاسل الجمع ✅
6 L4-S10 — درس سلاسل الطرح ✅
7 تحديث index.ts — تسجيل L4 ✅
8 الترجمة الثنائية — تعمل مثل L1 ✅

---

📋 للجلسة القادمة (L5-L7)

البنية جاهزة تماماً. عند العودة:

1. L5/S11.ts — الضرب 2×3 (من L5_QUESTIONS)
2. L5/S12.ts — القسمة المتقدمة (من L5_QUESTIONS)
3. L6/S13.ts — العشري جمع/طرح
4. L6/S14.ts — العشري ضرب/قسمة
5. L7/S15.ts — الجذور التربيعية

كلها بنفس نمط L4:

· id: "L5-S11" (بروتوكول L{level}-S{num})
· محتوى من Bank A حرفياً
· ترجمة "عربي | English" 100%
· storyAudioId: null + storyAudioText (TTS-ready)
· rule.cases[].formula بدون أقواس عربية

---

🎯 التزامات محفوظة (للمساعد القادم)

1. لا لمس levelOfLesson (طبقة توافق دائمة).
2. لا m13 (توحيد L1-L3 ملغى).
3. لا split('-')[0] (يعطي S03 بدل L1).
4. بروتوكول L4-L7: id: "L{level}-S{num}" إلزامي.
5. Bank A هو المصدر الرسمي للدروس.
6. LessonScreen.tsx محمي — يحتاج موافقة لتفعيل TTS.

---

📌 ملخص ما تم إضافته

# القسم المحتوى
1 الفهرس إضافة البند 12 (TTS)
2 القسم 12 (جديد) خطة تفعيل TTS كاملة
3 قائمة "لا تنفّذ" إضافة تحذير على LessonScreen.tsx
4 خارطة الطريق إضافة TTS كمهمة نهاية الجلسة
5 قائمة التتبع إضافة TTS في "متبقي"
6 العنوان rev.6 → rev.7
7 بروتوكول المساعد تحديث rev.6 → rev.7

<div align="center">

✨ كل المحتوى الأصلي محفوظ + خطة TTS مؤمنة في النهاية ✨

</div>
```