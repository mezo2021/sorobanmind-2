📘 SorobanMind v2 — Master Plan

نسخة مدمجة نهائية · 2026-10-01 (نهاية الجلسة 12)

القاعدة الذهبية: لا نحذف شيئًا إلا ما أُلغي صريحًا. كل شيء آخر يبقى.

ملاحظة الدمج: هذا الملف يدمج Master Plan القديم + SRB الجديد + تحديثات الجلسات 10-12، مع إزالة التكرار والحفاظ على كل المعلومات.

---

🔴 ما أُلغي نهائيًا

العنصر السبب
bank-linked.ts لم يعد له معنى
bank-adapter.ts لم يعد له معنى
data.ts (v1) أرشفة فقط
learnModules.ts أُلغي في الجلسة 8
بنية 20 درسًا استُبدلت بـ 15 درسًا
بنية الجلسة لكل درس استُبدلت بـ الجلسة لكل مستوى
المهارات الـ 20 القديمة (m قديم) استُبدلت بـ 51 m جديدة
src/curriculum/index.ts محذوف (كان 404) — استُبدل بـ srb/curriculum.ts
LEVEL_SKILLS (قديم) استُبدل بـ getModuleName من srb/modules
loadWeakSkills (من bank-v2) استُبدل بـ progressStore.skillProgress

⚠️ تنبيه مهم: البنكان bank-v2/ و bank-raw/ لم يُلغيا — كلاهما موجود ويعمل.
سيُحذفان فقط بعد فك ارتباط الامتحانات الثلاثة (CE1, CE2, PT) بهما، لتخفيف حجم التطبيق (PWA/APK).

---

🟢 ما بقي كما هو (لا يُلمس)

العنصر الحالة
رؤية المشروع ✅
الفئتان العمريتان (5-12 / 13+) ✅
نظام XP ✅
الأسرار السحرية ✅
نظام القفل/الفتح ✅
الشاشات (22) ✅
الملفات الصوتية (22) ✅
الرفقاء (شام · ريان · جود · بانة) ✅
الشارات (🥉🥈🥇) ✅
المحرك الرياضي (sorobanEngine + moves) ✅ مجمَّد
اختبار تحديد المستوى ✅
bank-v2/ + bank-raw/ ✅ موجودان ويعملان — مرتبطان بـ CE1 · CE2 · PT

---

🟡 ما تغيّر (توثيق التحولات)

① المنهج: من 20 درسًا → 15 درسًا

المستوى القديم الجديد
L0 S1, S2 S01, S02
L1 S3-S9 (7 دروس) S03, S04
L2 S10-S12 (3 دروس) S05, S06
L3 S13-S15 (3 دروس) S07, S08
L4 S16 S09, S10
L5 S17 S11, S12
L6 S18 S13, S14
L7 S19, S20 S15
الإجمالي 20 درسًا · 20 m 15 درسًا · 51 m

② المهارات m: من مبسّطة → مفصّلة

· القديم: كل درس = m واحدة رئيسية
· الجديد: كل درس = 2-4 m حسب التقنيات (بسيط · أصدقاء 5 · أصدقاء 10 · مركب)

③ بنية الجلسة: من درس → مستوى

· القديم: تمرّن L0 = 5 أسئلة من S1
· الجديد: تمرّن L0 = 5 أسئلة (سؤال واحد من كل m في المستوى)

المعادلة الرسمية:

```
عدد أسئلة الجلسة = max(عدد m في المستوى، 5)
```

المستوى عدد m عدد الأسئلة
L0 5 5
L1 8 8
L2 8 8
L3 8 8
L4 8 8
L5 8 8
L6 5 5
L7 1 5 (عشوائي من 25)

قاعدة عدم التكرار: لا تكرار داخل الجلسة الواحدة.

④ البنك: من bank-v2 → SRB

العنصر القديم الجديد
الملفات bank-v2/ (4 parts + exams + placement) srb/questions/L{0-7}.ts
الصيغة L1-S3-001 SRB-L1-S03-m1-A001
الوحدة سؤال مستقل سؤال مع تصنيف تقنية (movement)
الرقم ~1800 سؤال 275 سؤالًا

⚠️ SRB أقل عددًا لكن أدق تصنيفًا — كل سؤال له movement محددة.

⑤ التخزين: من مفتاح لكل درس → مفتاح لكل مستوى

· القديم: "L0-S01", "L0-S02", ...
· الجديد: "L0", "L1", ...

بنية srb_progress الجديدة:

```json
{
  "L0": {
    "practice": { "grade": 85, "attempts": 2, "passed": true, "weakSkills": ["L0-S01-m3"] },
    "anzanVisualNormal": {},
    "anzanVisualFlash": {},
    "anzanAudio": {},
    "test": {}
  },
  "L1": {}
}
```

⑥ إعادة هيكلة المنهج (الجلسة 12) ⚡

السبب: خلل تربوي — الضرب (L3) والقسمة (L4) كانا منفصلين، والسلاسل (L2) كانت قبل الضرب.

الترتيب الجديد:

# المستوى الدروس الفئة السبب
L0 التمهيدي S01, S02 🧒 بلا تغيير
L1 الجمع والطرح S03, S04 🧒 بلا تغيير
L2 الضرب S07, S08 🧒 كان L3
L3 القسمة S09, S10 🧒 كان L4
L4 سلاسل الجمع/الطرح S05, S06 🧑 كان L2
L5 ضرب/قسمة متقدم S11, S12 🧑 بلا تغيير
L6 الكسور العشرية S13, S14 🧑 بلا تغيير
L7 الجذور S15 🧑 بلا تغيير

المنطق التربوي:

· الضرب والقسمة متجاوران (للصغار)
· السلاسل تصبح "تطبيق متقدم" للكبار
· لا يُقطع تسلسل التعلم

⑦ بنية src/curriculum/ ⚡

الحالة الفعلية:

```
src/curriculum/
├── types.ts              ✅ موجود
├── lessons/              ✅ موجود
│   └── L0/               ← فقط L0!
│       ├── intro.ts
│       ├── S1.ts
│       ├── S2.ts
│       └── test-pool.ts
```

النقص: دروس L1-L7 مفقودة — تحتاج نقل.

⑧ تعديلات الجلسة 12 (الشاشات والمنطق) ⚡

في useGameStats.ts (Adapter فوق SRB):

· حذف localStorage['sorobanmind-stats']
· قراءة XP/streak من progressStore
· حذف checkBadges (كل 3 ثوانٍ)
· newBadge = null (دائمًا — للتوافق)
· incrementStreak → updateStreak

في GuardianDashboard.tsx (SRB-first):

· XP/streak/level من progressStore
· شارات إنجاز المستوى (8 مشتقة من completedLevels)
· شارات إتقان المهارات (من masteryBadgesStore + getModuleName)
· شارات الأنزان (من progressStore.anzanBadges)
· المهارات الأربع من passedPractice / passedAnzanVisual / passedAnzanAudio / masteryBadges

في AdaptiveFeedback.tsx:

· حذف loadWeakSkills (من bank-v2)
· استخدام useProgressStore.skillProgress
· computeWeaknessScore محليًا
· useMemo للأداء

في AnzanScreen.tsx + AudioAnzanScreen.tsx:

· getAnzanBadgeKey(section) — منح شارات الفئة عند نجاح الجلسة
· AUDIO_BADGE_LABELS (سمعي)
· justEarnedBadges — إشعار شارة جديدة
· wrongModulesRef → wrongSkillsRef: Set<string>
· Union: (أخطاء + بطيئات) → saved weakSkills

في PracticeScreen.tsx:

· wrongModulesRef → wrongSkillsRef: Set<string>
· finalizeSession — Union (أخطاء + بطيئات من buildPerformances())
· زر "🩺 جلسة علاجية مخصصة (N مهارة)" — عند وجود ضعفاء
· AdaptiveFeedback يستقبل levelNum

في sessionBuilder.parseSkillId:

· regex: ^(?:SRB-)?(L[0-7])-(S\d{2})-(m\d{1,2})$ — يقبل الشكلين

في numberStyle.ts:

· الفاصلة العربية ٫ (U+066B)
· parseDecimalInput (جديد)

في arabicNumbers.ts:

· numberToArabicWordsDecimal (جديد)
· numberToArabicWordsDecimalSigned (جديد)

---

🎯 1. الرؤية

SorobanMind = تطبيق تعليمي عربي تفاعلي لتعلّم السوروبان الياباني.

الأهداف:

1. منهج ياباني أصيل (Takashi Kojima)
2. تعليم تكيفي — أسئلة مخصّصة لكل طالب
3. فئتان عمريتان:
   · 🧒 قسم 1 (5-12): L0 → L3
   · 🧑 قسم 2 (13+): L4 → L7

الميزة التنافسية:

· محرك تكيفي حقيقي
· نظام XP للتقدم
· إثراء تفاعلي
· بنك SRB (تصنيف دقيق لكل تقنية)

---

📚 2. المنهج — 8 مستويات · 15 درسًا · 51 m

المستوى الاسم الدروس m القسم الحالة
L0 التمهيدي S01, S02 5 🧒 ✅ مكتمل
L1 الجمع والطرح S03, S04 8 🧒 ✅ مكتمل
L2 الضرب S07, S08 8 🧒 ✅ مكتمل
L3 القسمة S09, S10 8 🧒 ✅ مكتمل
L4 سلاسل الجمع/الطرح S05, S06 8 🧑 ✅ مكتمل
L5 ضرب/قسمة متقدم S11, S12 8 🧑 ✅ مكتمل
L6 الكسور العشرية S13, S14 5 🧑 ✅ مكتمل
L7 الجذور S15 1 🧑 ✅ مكتمل

تفصيل m لكل درس

الدرس الاسم m
S01 تمثيل 0-9 m1 (0-4) · m2 (5-9) · m3 (تثبيت 0-9)
S02 القيمة المكانية m1 (آحاد/عشرات) · m2 (مئات/آلاف)
S03 الجمع m1 (بسيط) · m2 (أصدقاء 5) · m3 (أصدقاء 10) · m4 (مركب)
S04 الطرح نفس البنية
S05 سلاسل الجمع نفس البنية
S06 سلاسل الطرح نفس البنية
S07 ضرب 1×2 نفس البنية
S08 ضرب 2×2 نفس البنية
S09 القسمة ÷1 نفس البنية
S10 القسمة ÷2 نفس البنية
S11 ضرب 2×3 نفس البنية
S12 القسمة المتقدمة نفس البنية
S13 عشري جمع/طرح m1 (بسيط) · m2 (أصدقاء 5و10) · m3 (مركب)
S14 عشري ضرب/قسمة m1 (ضرب) · m2 (قسمة)
S15 الجذور التربيعية m1 (جذر تربيعي)

---

🎲 3. بنية الجلسة

```
📖 تعلّم (شاهد + جرّب)
↓
✏️ تمرّن (5-8 أسئلة — سؤال واحد من كل m في المستوى)
↓ نجاح 70%
🧠 أنزان بصري (عادي + Flash)
↓
🎧 أنزان سمعي
↓
🎓 اختبار المستوى
↓ نجاح 80%
📖 المستوى التالي
```

⚠️ الجلسة على مستوى كامل — عدد الأسئلة = عدد m في المستوى.

قاعدة عدم التكرار: لا تكرار داخل الجلسة الواحدة.

---

🔑 4. نظام ID (SRB)

الصيغة: SRB-L{level}-S{section}-m{module}-A{sequence}

أمثلة:

· SRB-L0-S01-m1-A001
· SRB-L1-S03-m3-A002
· SRB-L5-S11-m4-A005

الجزء المعنى
L0..L7 المستوى (بلا padding)
S01..S15 الدرس (2 أرقام مع padding)
m1..m99 المهارة (بلا padding)
A أساسي
001..999 التسلسل (3 أرقام مع padding)

⚠️ المراحل في allowed_phases — لا في ID.

⚠️ parseSkillId يقبل الشكلين:

```typescript
/^(?:SRB-)?(L[0-7])-(S\d{2})-(m\d{1,2})$/
```

---

🎯 5. نظام المراحل (Phases)

الرمز الاسم يُسجَّل؟
E شاهد ❌
T جرّب ❌
P تمرّن ✅
ANZ-V أنزان بصري عادي ✅
ANZ-F أنزان Flash ✅
ANZ-A أنزان سمعي ✅
X اختبار المستوى ✅
CE امتحان القسم ✅
PT تحديد المستوى ✅
EN الإثراء ❌

---

🔒 6. منطق القفل/الفتح

العنصر يُفتح بعد
🎨 الإثراء مفتوح دائمًا
📖 L0 مفتوح
📖 دروس L0 (S01, S02) متسلسلة
✏️ تمرّن L0 إتمام آخر "جرّب" في كل دروس L0
🧠 أنزان بصري L0 إتمام آخر "جرّب" في L0
🎧 أنزان سمعي L0 إتمام آخر "جرّب" في L0
🎓 اختبار L0 إتمام آخر "جرّب" في L0
📖 L1 نجاح اختبار L0
🏆 امتحان القسم 1 إتمام L0-L3 كاملًا
🎓 القسم 2 (L4) نجاح امتحان القسم 1
🔒 سر سحري 50 XP (السر الأول مجاني)

---

💰 7. نظام XP

المصدر XP
إتمام درس +10
إتمام دروس إثراء +20
إجابة صحيحة +5
إتمام اختبار +20
إتمام امتحان قسم +50
إتمام سر (تمرين) +2 × score

الاستخدام التكلفة
🔒 فتح سر سحري 50 XP

التخزين: progressStore.totalXP → sorobanmind-v2-progress (بعد الجلسة 12).

---

✨ 8. الأسرار السحرية

· 🎁 السر الأول (5) — مجاني للجميع.
· 🔒 الأسرار 2-16 — 50 XP لكل سر.
· ✅ بعد الفتح → يبقى مفتوحًا للأبد.

التخزين:

· soroban_unlocked_secrets = [5, 6, 7, ...]
· soroban_xp = الرصيد الحالي

---

🎓 9. نظام التقييم

لكل سؤال:

· target_time_ms: [min, max] (مع العداد)
· anzan_time_ms: [min, max] (للأنزان)

التقييم = timeMs ÷ answerMs:

النسبة التقييم الشارة
≤ 40% 🥇 ممتاز ذهبية
40-70% 🥈 جيد فضية
70-80% 🥉 مقبول برونزية
80-100% ⚠️ بطيء —
خطأ ❌ خطأ —

🏅 العلامة النهائية للمستوى

· 70% اختبار المستوى (X)
· 30% متوسط 4 عناصر:
  · ✏️ تمرّن (P)
  · 🧠 أنزان بصري عادي (ANZ-V)
  · ⚡ أنزان Flash (ANZ-F)
  · 🎧 أنزان سمعي (ANZ-A)

التوزيع الداخلي للـ 30%: مؤجل.

⚠️ التقييم يُحسب على المستوى الكامل (متوسط مرجّح للجلسة)، لا على درس منفرد.

---

🧠 10. القاعدة الذهبية للتصنيف

الجمع (c + n)

الحالة الشرط التقنية
بسيط c+n ≤ 9 مباشر
أصدقاء 5 c ≤ 4، n ≤ 4، c+n ≥ 5 +n = +5 - (5-n)
أصدقاء 10 c+n > 9، l ≥ k (k=10-n) +n = -k + 10
مركب c+n > 9، l < k +n = -5 + (5-k) + 10

الطرح (c - n)

الحالة الشرط التقنية
بسيط c ≥ n مباشر
أصدقاء 5 c < n، العلوية مفعّلة -n = -5 + (5-n)
أصدقاء 10 c < n، العلوية معطّلة، c+k ≤ 4 -n = -10 + k
مركب c < n، c+k > 4 -n = -10 + 5 - (5-k)

⚠️ فرق جوهري:

· الجمع المركب: l < k (خرزات مفعّلة غير كافية).
· الطرح المركب: c+k > 4 (خرزات فارغة غير كافية).
· قاعدتان مختلفتان — خطأ شائع.

---

📂 11. بنية SRB

```
src/data/srb/
├── types.ts              ✅ سليم (مع anzan_time_ms)
├── generateId.ts         ✅ سليم (makeQuestion يقبل expected_anzan_ms)
├── curriculum.ts         ✅ محدَّث (15 درسًا · ترتيب الجلسة 12)
├── modules.ts            ✅ محدَّث (51 m · ترتيب الجلسة 12)
├── index.ts              ✅ يستورد 8 ملفات
├── sessionBuilder.ts     ✅ على مستوى كامل + parseSkillId مرن
├── progress.ts           ✅ تخزين على مستوى
├── remediation.ts        ✅ بلا section · weakModules
├── srb-adapter.ts        ✅ (خارج srb/)
└── questions/
    ├── L0.ts             ✅ (25 سؤالًا)
    ├── L1.ts             ✅ (40 سؤالًا)
    ├── L2.ts             ✅ (40 سؤالًا — الضرب، كان L3)
    ├── L3.ts             ✅ (40 سؤالًا — القسمة، كان L4)
    ├── L4.ts             ✅ (40 سؤالًا — السلاسل، كان L2)
    ├── L5.ts             ✅ (40 سؤالًا)
    ├── L6.ts             ✅ (25 سؤالًا)
    └── L7.ts             ✅ (25 سؤالًا)
```

إجمالي الأسئلة: 275 / 275 (100%) ✅

---

📋 12. بنية ملف المستوى (نموذج)

```typescript
import { makeQuestion } from "../generateId";
import type { SRBQuestion } from "../types";

export const L{n}_QUESTIONS: SRBQuestion[] = [
  makeQuestion({
    level: "L{n}",
    section: "S{XX}",
    module: "m{N}",
    sequence: 1,
    variant: "A",
    primary_phase: "P",
    allowed_phases: ["E", "T", "P", "ANZ-V", "ANZ-F", "ANZ-A", "X"],
    question: "...",
    operands: [...],
    operation: "addition" | "subtraction" | "multiplication" | "division" | "read" | "build",
    result: ...,
    solution: "سبب الاختيار: ... . الناتج ...",
    movement: "direct" | "five-friend-add" | "five-friend-sub" | "ten-friend-add" | "ten-friend-sub" | "mixed",
    difficulty: 2-4,
    expected_time_ms: ...,
    expected_anzan_ms: ...,
    tags: [...],
  }),
];

export default L{n}_QUESTIONS;
```

---

🖥️ 13. الشاشات

# الشاشة الحالة
1 WelcomeScreen ✅
2 RoleSelection ✅
3 HeroDashboard ✅
4 GuardianDashboard ✅ (SRB-first — الجلسة 12)
5 CategoryScreen ✅ (محدَّث — الجلسة 12)
6 LevelScreen ✅ (محدَّث — الجلسة 12)
7 LearnScreen ✅ (محدَّث — الجلسة 12)
8 LessonScreen ✅
9 IntroductionScreen ✅
10 LevelTestScreen ⚠️ يحتاج ربط بـ SRB
11 FingerMathScreen ✅
12 MagicSecretsScreen ✅
13 PracticeScreen ✅ (SRB + زر علاجية + union)
14 AnzanScreen ✅ (SRB + AnzanBadges + union)
15 AudioAnzanScreen ✅ (SRB + AudioAnzanBadges + union)
16 PlacementTestScreen ⚠️ يحتاج ربط
17 CategoryExamScreen ⚠️ يحتاج ربط
18 SorobanPlayground ✅
19 CrossMultiplicationScreen ⚠️ غير مربوط
20 CertificateScreen ⚠️ غير مربوط
21 RemediationScreen ✅ (مربوط بزر في PracticeScreen)
22 Header ✅ (مكوّن)

---

🔊 14. الملفات الصوتية (22)

```
public/
├── audio/                   12 ملف
│   ├── welcome-sorobana.mp3
│   ├── greeting-1/2/3.mp3
│   ├── teaching-1/2/3.mp3
│   ├── correct-1/2.mp3
│   ├── wrong-1/2.mp3
│   └── end-lesson.mp3
└── stories/                 10 ملفات
    └── story-0 → story-9.mp3
```

---

🏗️ 15. البنية الكاملة

```
src/
├── App.tsx                          ✅
├── types.ts                         ✅
│
├── store/
│   ├── progressStore.ts             ✅ (المصدر الموحّد للـ XP/streak/الشارات)
│   ├── numberStyleStore.ts          ✅ (يقرأ من soroban_number_style)
│   └── masteryBadgesStore.ts        ✅ (شارات المهارات + soroban_mastery_badges)
│
├── curriculum/
│   ├── types.ts                     ✅ (مجمَّد)
│   └── lessons/
│       └── L0/                      ✅ (intro · S1 · S2 · test-pool)
│       (L1-L7 مفقودة — تحتاج نقل)
│
├── engine/                          ✅ (مجمَّد)
│   ├── sorobanEngine.ts
│   ├── sorobanMoves.ts
│   ├── masteryTracker.ts
│   ├── problemGenerator.ts
│   └── adaptiveEngine.ts
│
├── data/
│   ├── srb/                         ✅ (مكتمل)
│   ├── bank-v2/                     🟡 (موجود · يعمل · للامتحانات)
│   ├── bank-raw/                    🟡 (موجود · يعمل · للـ PT)
│   └── modes.ts                     ✅
│
├── hooks/
│   └── useGameStats.ts              ✅ (Adapter فوق progressStore — الجلسة 12)
│
├── utils/
│   ├── numberStyle.ts               ✅ (فاصلة عربية ٫ + parseDecimalInput)
│   ├── arabicNumbers.ts             ✅ (numberToArabicWordsDecimal)
│   ├── skillsChecker.ts             🟡 (قديم — للتنظيف)
│   ├── anzanBadges.ts               🟡 (قديم — للتنظيف)
│   ├── audioAnzanBadges.ts          🟡 (قديم — للتنظيف)
│   └── badgeChecker.ts              🟡 (قديم — للتنظيف)
│
├── components/                      ✅ ~20
└── screens/                         ✅ ~22
```

---

🔑 16. مفاتيح localStorage

# المفتاح الاستخدام
1 srb_progress تقدّم SRB (درجات + weakSkills)
2 sorobanmind-v2-progress متجر Zustand (XP · streak · completedLevels · passedPractice · anzanBadges · ...)
3 soroban_mastery_badges شارات إتقان المهارات (masteryBadgesStore)
4 soroban_number_style نمط الأرقام (عربية/لاتينية)
5 soroban_unlocked_secrets الأسرار المفتوحة
6 soroban_companion الرفيق المختار
7 soroban_child_name اسم الطفل
8-15 مفاتيح قديمة bank-v2 / bank-raw (تُنظَّف تدريجيًا)

الخطة: توحيد تدريجي في progressStore + srb_progress.

---

✅ 17. ما تم إنجازه

الجلسات 1-9

· البنية الأساسية
· المحرك التكيفي
· 20 شاشة تفاعلية
· 22 ملفًا صوتيًا
· نظام XP
· الأسرار السحرية

الجلسة 10

· ✅ تحديث types.ts (إضافة anzan_time_ms)
· ✅ تحديث generateId.ts
· ✅ تحديث curriculum.ts (15 درسًا)
· ✅ تحديث modules.ts (51 m)
· ✅ تحديث sessionBuilder.ts
· ✅ تحديث progress.ts · remediation.ts · srb-adapter.ts
· ✅ إنشاء L0.ts + L1.ts
· ✅ البناء أخضر

الجلسة 11

· ✅ تدقيق L2.ts · توليد L3-L7
· ✅ إعادة هيكلة L6.ts (40 → 25)
· ✅ تحديث L1.ts (تفاصيل + tags + أزمنة)
· ✅ بنك الأسئلة مكتمل 100% (275 سؤالًا)
· ✅ تحديث srb-adapter.ts (توقيع نظيف)
· ✅ تحديث numberStyle.ts (فاصلة عربية ٫)
· ✅ تحديث arabicNumbers.ts (numberToArabicWordsDecimal)
· ✅ تحديث الشاشات الثلاث (section ديناميكي)
· ✅ البناء أخضر

الجلسة 12 (اليوم) ⚡

المنهج والهيكلة:

· ✅ كشف خلل تربوي في ترتيب المنهج
· ✅ إعادة هيكلة المنهج: L2=الضرب · L3=القسمة · L4=السلاسل
· ✅ تعديل 8 ملفات متزامنًا:
  · L2.ts (ضرب) · L3.ts (قسمة) · L4.ts (سلاسل)
  · curriculum.ts · modules.ts (24 وحدة)
  · LevelScreen.tsx · LearnScreen.tsx · CategoryScreen.tsx

الشاشات والمنطق:

· ✅ إصلاح خطأ SorobanaCompanion (حالة الأحرف)
· ✅ تنويه العشري في running (بدل solution)
· ✅ useGameStats.ts → Adapter SRB (XP/streak من progressStore)
· ✅ GuardianDashboard.tsx → SRB-first (XP/شارات/مهارات)
· ✅ AdaptiveFeedback.tsx → SRB (بدل loadWeakSkills)
· ✅ AnzanScreen + AudioAnzanScreen → setAnzanBadge + justEarnedBadges + AUDIO_BADGE_LABELS
· ✅ sessionBuilder.parseSkillId → يقبل (?:SRB-)?
· ✅ PracticeScreen → wrongSkillsRef: Set<string> + Union في finalizeSession
· ✅ زر "🩺 جلسة علاجية مخصصة (N مهارة)" — يظهر عند وجود ضعفاء
· ✅ RemediationScreen مربوط بزر في PracticeScreen
· ✅ AdaptiveFeedback levelNum — يظهر المهارات بأسمائها (L0-S01-m2 — تمثيل 5)

اختبارات ناجحة:

· ✅ 5/5 · XP · زر (5 مهارات) · RemediationScreen (5 أسئلة)
· ✅ union اكتشف البطيء (3 صح) + الخطأ (2 خطأ) = 5 مهارات
· ✅ RemediationScreen · المواضيع بصيغة L0-S01-m3

اكتشافات:

· ✅ RemediationScreen.tsx موجود
· ✅ CertificateScreen.tsx و GuardianDashboard.tsx موجودان
· ✅ curriculum/index.ts = 404 (محذوف)
· ✅ lessons/: L0 فقط
· ✅ البناء أخضر

---

🚨 18. ملاحظات حرجة

1. bank-v2 و bank-raw: لا تُحذف حتى ينتهي SRB. يحتويان ~1800 سؤال · مرتبطان بـ CE1/CE2/PT.
2. GuardianDashboard: ✅ قراءة من SRB (بعد الجلسة 12).
3. CrossMultiplicationScreen: موجود لكن غير مربوط.
4. CertificateScreen: موجود لكن غير مربوط.
5. المحرك الرياضي: مجمَّد — لا يُلمس.
6. m3 في S01: تثبيت 0-9 (مكرر مقصود).
7. الجلسة العلاجية (remediation.ts): ✅ الملف جاهز · ✅ RemediationScreen.tsx موجود · ✅ مربوط بزر في PracticeScreen (الجلسة 12).
8. LevelTestScreen: يعمل حاليًا بـ 5 أسئلة (غير مُربط بالبنك الكامل).
9. AdaptiveFeedback: ✅ يعرض الأسماء العربية (بعد إصلاح LEVEL_SKILLS).
10. curriculum/index.ts: محذوف (404) — تم استبداله بـ srb/curriculum.ts.
11. الملفات الميتة للتنظيف (anzanBadges.ts · audioAnzanBadges.ts · skillsChecker.ts · badgeChecker.ts): موجودة · لا أحد يستخدمها · للتنظيف لاحقًا.
12. practiceRange / anzanRange في CategoryScreen: لا زالت تعتمد على [0,3] و [4,7].

---

📋 19. المهام المؤجَّلة

🔴 المرحلة 1: إكمال SRB

· ✅ بنك الأسئلة L0-L7 — مكتمل
· ✅ التعليم التكيفي — يعمل
· 🚨 بناء اختبارات المستوى (X phase) — 8 اختبارات
· 🚨 بناء امتحان القسم 1 (CE)
· 🚨 بناء اختبار تحديد المستوى (PT)
· 🚨 فك ارتباط CE1/CE2/PT بالبنكين القديمين ثم حذفهما

🔴 المرحلة 2: ربط الشاشات

· ✅ ربط RemediationScreen بزر في PracticeScreen
· 🚨 ربط LevelTestScreen بـ SRB
· 🚨 ربط PlacementTestScreen (الجديد + القديم)
· 🚨 ربط CategoryExamScreen

🟡 المرحلة 3: الدروس (المحتوى التعليمي)

· 🚨 نقل دروس L1-L7 من التطبيق القديم
· 🚨 نقل درسين إثراء للكبار (خارج المنهج)
· 🚨 إنشاء دروس بأسلوب SRB

🟡 المرحلة 4: منطق القفل والعلامة

· ⏳ تنفيذ القفل الفعلي في الشاشات
· ⏳ فحص "آخر جرّب" قبل فتح الأنشطة
· ⏳ تنفيذ العلامة النهائية (70% + 30%)

🟢 المرحلة 5: التنظيف والربط

· ✅ GuardianDashboard (قراءة SRB)
· 🚨 تنظيف الملفات الميتة (anzanBadges.ts · audioAnzanBadges.ts · skillsChecker.ts · badgeChecker.ts)
· 🚨 تنظيف CategoryScreen (يقرأ من localStorage قديم — dual-write)
· ⏳ CrossMultiplicationScreen
· ⏳ CertificateScreen + الشارات
· ⏳ حذف bank-v2 + bank-raw

🟢 المرحلة 6: النشر

· ⏳ PWA
· ⏳ APK

🟡 مهام متفرقة مؤجَّلة

· 🚨 CategoryScreen يقرأ من localStorage قديم (soroban_passed_practice) — يعمل حاليًا بسبب dual-write من App.tsx
· 🚨 markPracticePassed / markAnzanVisualPassed / markAnzanAudioPassed — غير مستدعاة في الشاشات (تُكتب فقط عبر App.tsx في localStorage)
· 🚨 badgeChecker — يستخدم soroban_anzan_stats (قديم)
· 🚨 تسمية "سبب الاختيار" → "الحل" في بطاقة العرض
· 🚨 زر "فتح الكل" (للمطور) — موجود · يحتاج توثيق

---

🎯 20. خارطة الطريق المُحدَّثة

الجلسة المهمة الحالة
10 SRB + L0 + L1 ✅ مكتمل
11 L2-L7 + تدقيق L1 + إعادة هيكلة L6 ✅ مكتمل
12 إعادة هيكلة المنهج + SRB-first لـ 3 شاشات + union + زر علاجية ✅ مكتمل
13 اختبار Anzan/Audio Badges + تنظيف CategoryScreen ⏳
14 بناء اختبارات المستوى (X) + ربط LevelTestScreen ⏳
15 فك ارتباط CE1/CE2/PT بالبنوك القديمة ⏳
16 نقل الدروس L1-L7 + دروس الإثراء ⏳
17 منطق القفل + العلامة النهائية ⏳
18 GuardianDashboard + CrossMultiplication ⏳
19 CertificateScreen + الشارات ⏳
20 PWA + APK ⏳

---

📊 21. الإحصائيات

المقياس القيمة
المستويات 8
الدروس 15
المهارات m 51
الأسئلة (SRB) 275 / 275 (100%) ✅
بنكين قديمين ~1800 سؤال (موجودان · يعملان · للامتحانات)
الشاشات 22 (20 + Header + RemediationScreen)
الملفات الصوتية 22
الرفقاء 4
نسبة إنجاز SRB ~95% (باقي الاختبارات + الربط)
نسبة إنجاز المشروع ~88%

---

📎 22. روابط

العنصر الرابط
Live Demo https://mezo2021.github.io/sorobanmind-2
المستودع https://github.com/mezo2021/sorobanmind-2
Actions https://github.com/mezo2021/sorobanmind-2/actions

---

📞 23. المطوّر

مصطفى علي أكر (@mezo2021)

المراجع:

· Takashi Kojima — The Japanese Abacus
· Japan Soroban Association

---

<div align="center">

🧮 SorobanMind

صُنع بحب لأطفال العالم العربي 🌍

آخر تحديث: 2026-10-01 — نهاية الجلسة 12

الحالة: 🟢 SRB يعمل · L0-L7 مكتملون · التعليم التكيفي يعمل · البناء أخضر

الخطوة التالية: اختبار Anzan Badges + تنظيف CategoryScreen

</div>

---

🌹 ملخص تعديلات الجلسة 12

البند التغيير
التاريخ 2026-09-30 → 2026-10-01
قسم جديد ⑥ إعادة هيكلة المنهج
قسم جديد ⑦ بنية src/curriculum/
قسم جديد ⑧ تعديلات الجلسة 12 (الشاشات والمنطق)
الجلسة 12 18 إنجازًا جديدًا موثقًا
جدول المنهج (2) محدَّث بالترتيب الجديد
خارطة الطريق 20 جلسة · تحديث 13-20
الملاحظات الحرجة 12 ملاحظة (إضافة 11 و 12)
المهام المؤجَّلة تحديث المرحلة 5 + المهام المتفرقة
الإحصائيات 22 شاشة · 88% إنجاز
الحالة التعليم التكيفي يعمل · union يعمل · زر العلاجية يعمل ✅

---