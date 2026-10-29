
# 🎪 مدينة الألعاب — Games City

> **آخر تحديث:** 2026-10-13
> **الحالة:** 🟢 البناء أخضر · 5 من 5 ألعاب مكتملة
> **المرجع:** SorobanMind v2 — قسم الألعاب التعليمية
> **⚠️ مصدر الحقيقة:** هذا الملف + STATE_OF_THE_PROJECT.md

---

## 📋 فهرس

1. الرؤية والغرض
2. البنية المعمارية
3. البنية الاقتصادية (XP ↔ التذاكر)
4. الألعاب الخمس
5. المكونات المشتركة (3 معادات)
6. نظام الأصوات والاهتزاز
7. نظام البطل المرافق
8. المعاينة الكاملة (Preview Mode)
9. ملفات الفلاشات التعليمية
10. إضافة لعبة جديدة — دليل خطوة بخطوة
11. قرارات تصميمية محسومة
12. سجل الأخطاء المُصلَحة
13. قيود وحمايات
14. بنية Sorobania

---

## 1️⃣ الرؤية والغرض

### 🎯 الهدف

**مدينة الألعاب** قسم تعليمي ترفيهي في تطبيق SorobanMind يقدّم **5 ألعاب قصيرة** (45-90 ثانية) تربط التعليم بالمتعة، وتستخدم المعداد كمحرك مركزي.

### 📖 الفكرة التربوية

- **Learn-then-Play:** الطفل يجمع XP من الدروس → يشتري تذاكر → يلعب
- **Scarcity:** موارد محدودة → قيمة أعلى للعبة
- **Session Control:** جلسات قصيرة → لا إدمان · لا إرهاق بصري
- **Loop:** درس → XP → تذكرة → لعبة → XP → درس...

### 🎓 المخرجات المتوقعة

- تقوية مفاهيم السوروبان (Subitizing · الأصدقاء · الجدة · العملاق · المربعات · الجذور)
- تحفيز الطفل على إتمام الدروس (XP بوابة للألعاب)
- توفير متنفّس ممتع بعد الجهد الدراسي
- تحضير الطفل للأنزان (الحساب الذهني الخالص)

---

## 2️⃣ البنية المعمارية

### 📁 شجرة المجلدات

```

src/components/games/
├── gamesData.ts                     📋 بيانات الألعاب الخمس
├── GamesListScreen.tsx              📋 قائمة + ماكينة تذاكر
├── GameCompanion.tsx                🎭 البطل داخل الألعاب
├── HighScoreBadge.tsx               🏆 شارة الرقم القياسي
├── highScoreStore.ts                💾 تخزين السجل القياسي (شهري)
│
├── FlyingAbacus/                    🛸 اللعبة 1
│   └── FlyingAbacusGame.tsx
│
├── Detective/                       🔍 اللعبة 2
│   └── DetectiveGame.tsx
│
├── Friends/                         🥋 اللعبة 3
│   ├── FriendsGame.tsx
│   ├── LaserAbacus.tsx
│   └── bank.ts
│
├── Pirates/                         🏴‍☠️ اللعبة 4
│   ├── PirateRaceGame.tsx
│   ├── PirateScene.tsx
│   ├── MultiRodAbacus.tsx
│   ├── SolutionPlayer.tsx
│   ├── mulEngine.ts
│   ├── divEngine.ts
│   ├── quizTypes.ts
│   ├── quizFactory.ts
│   ├── timeModel.ts
│   └── seaSfx.ts
│
└── Sorobania/                       🏝️ اللعبة 5
├── SorobaniaGame.tsx            (منطق · شاشات · export default)
├── sorobaniaData.ts             (ثوابت · أنواع · مراحل · حفظ)
├── sorobaniaSfx.ts              (WebAudio)
├── SorobaniaScenes.tsx          (SVG · احتفالات)
└── SorobaniaUI.tsx              (Hud · بانة · فتيل · دروس)

```

### 🔗 نقاط الدخول

```

HeroDashboard
├── زر "🎬 الفلاشات التعليمية"   → FlashListScreen
├── زر "🎪 مدينة الألعاب"         → GamesListScreen
└── زر "🎯 امتحان تحديد المستوى"  → PlacementTestScreen

GuardianDashboard
├── زر "👁️ وضع المعاينة"         → soroban_dev_preview
├── زر "💾 حفظ نسخة"            → handleBackup
├── زر "📥 استعادة"             → handleRestore
└── زر "🗑️ تصفير"               → handleReset

```

**لا تعديل على `App.tsx`** — القسم يدير نفسه داخلياً.

---

## 3️⃣ البنية الاقتصادية (XP ↔ التذاكر)

### 💰 رصيدان منفصلان

| الرصيد | الغرض | السقف | المتغير |
|---|---|---|---|
| **totalXP** | التقدم في المستويات | بلا سقف | `totalXP` |
| **ticketXP** | شراء التذاكر | **50** | `ticketXP` |
| **التذاكر** | رصيد اللعب | **5** | `tickets` |

### 🔄 الحلقة الكاملة

```

📚 إجابة صحيحة → +5 XP
├── totalXP = totalXP + 5       (بلا سقف)
└── ticketXP = min(50, ticketXP + 5)
↓
ticketXP ≥ 10 → زر "🎟️ اشترِ تذكرة"
↓
ضغط → ticketXP -= 10 · tickets += 1
↓
دخول مدينة الألعاب → الضغط على لعبة
↓
tickets -= 1 (استهلاك عند الفتح)
↓
اللعب → 45-90 ث → XP مكافأة (2-5)
↓
العودة للدروس

```

### ⚙️ الثوابت (`progressStore.ts`)

```tsx
export const TICKET_COST = 10;       // 10 XP = تذكرة
export const TICKET_XP_CAP = 50;     // سقف ticketXP
export const TICKETS_MAX = 5;        // 5 تذاكر في الجيب
```

📊 معدل الاكتساب

النشاط XP لكل إجابة
PracticeScreen +5
AnzanScreen +5
AudioAnzanScreen +5
الألعاب الخمس +2 إلى +5 (نهاية)

ملاحظة: الدروس لا تُعطي XP لكل إجابة · بل بعد الإتمام.

🔑 دوال المتجر

```tsx
useProgressStore.getState().addXP(5);         // يُحدّث الرصيدين
useProgressStore.getState().buyTicket();       // يخصم 10 من ticketXP
useProgressStore.getState().consumeTicket();   // يخصم 1 من tickets

// Selectors
useProgressStore((s) => s.ticketXP);
useProgressStore((s) => s.tickets);
useProgressStore((s) => s.totalXP);
```

---

4️⃣ الألعاب الخمس — الحالة الفعلية

# اللعبة id المدة البطل الحالة
1 🛸 العداد الطائر flying-abacus 60 ث المختار (default: ريان) ✅
2 🔍 المحقق الرقمي detective 45 ث جود ✅
3 🥋 دوجو السوروبان friends 90 ث شام ✅
4 🏴‍☠️ سباق القراصنة pirate-race 90 ث ريان ✅
5 🏝️ جزيرة سوروبانيا sorobania-island 60 ث بانة ✅

🛸 العداد الطائر — flying-abacus ✅

· المهارة: القراءة البصرية السريعة (Subitizing)
· الآلية: يظهر المعداد لثوانٍ → يختفي → 3 أزرار للإجابة
· منحنى W-Shape:
  · 0-10 ث: أرقام 2-5 · تظهر 1800ms
  · 10-25 ث: أرقام 6-13 · تظهر 1200ms
  · 25-40 ث: أرقام 10-19 · تظهر 900ms
  · 40-50 ث: أرقام 4-7 · تظهر 1500ms
  · 50-60 ث: أرقام 20-44 · تظهر 700ms
· Gold Mode: عند 3 صح متتالي
· Adaptive Engine: خطأان → +35% وقت + نطاق أنصف
· XP: 2-5

🔍 المحقق الرقمي — detective ✅

· المهارة: قراءة المعداد · اكتشاف الأخطاء
· الآلية: يُعرض حساب + معداد بقيمة خاطئة → الطفل يُعدّل
· البنك: 40 تمرين قسمة
· البطل: جود
· الميزات:
  · شرح خطأ نوعي (استلاف · صفر مفقود · قلب · إزاحة)
  · تكيف ذكي · تخطّي بعد 3 أخطاء
· XP: 2-5

🥋 دوجو السوروبان — friends ✅

· المهارة: قواعد أصدقاء 5 و 10
· الآلية: معداد SVG تفاعلي + محرك خطوة-بخطوة
· البنك: 40 تمرين
· البطل: شام
· الميزات:
  · محرك كشف الخطأ
  · وميض أحمر + اهتزاز
  · إرجاع تلقائي 0.85 ث
  · أشباح زرقاء + أسهم
  · نجوم 1-3 · سلسلة كومبو · تكيف
  · أحزمة 5 مستويات
· XP: 2-5

🏴‍☠️ سباق القراصنة — pirate-race ✅

· المهارة: الضرب والقسمة (كوجيما)
· الآلية: مسائل + 3 خيارات · شريط فجوة 0-100%
· البطل: ريان
· الميزات:
  · mulEngine.ts · divEngine.ts
  · SolutionPlayer.tsx — جسر تعليمي (معدادان للقسمة)
  · شريط الفجوة: صح +6 · خطأ −12 · مهلة −15
  · 3 حالات جوية
  · المشهد SVG: أمواج · سفينتان · جزيرة
  · رمية حبل ريان (gap < 30)
· XP: 2-5

🏝️ جزيرة سوروبانيا — sorobania-island ✅

· المهارة: المربعات (1-25 + منتهية بـ5) والجذور التربيعية
· الآلية:
  · المرحلة 1: مربعات · 3 خيارات · 10 ث
  · المرحلة 2: جذور · كيبورد رقمي · 15 ث
· البطل: بانة
· البنية: 5 ملفات
· الميزات:
  · 4 مشاعل = 4 حيوات
  · 8 مناطق على الخريطة
  · كل 3 صح → إشعال مشعل
  · 10 إجابات صحيحة → فتح الجذور
  · درسان (سرّ الخمسات · طريقة الأزواج)
  · رقم قياسي: أطول سلسلة + أسرع متوسط
· XP: 2-4
· الحفظ: sorobania_progress_v2

---

5️⃣ المكونات المشتركة (3 معادات)

# المكون الاستخدام الأعمدة التفاعل
1 Soroban2D5.tsx الدروس · التمارين · الفلاشات · المحقق · العداد الطائر N ✅
2 Friends/LaserAbacus.tsx دوجو السوروبان 2 ✅ + ليزر
3 Pirates/MultiRodAbacus.tsx سباق القراصنة 5 ❌ للعرض
4 Pirates/MultiRodAbacus.tsx v2 القراصنة (عرض + title + ألوان) 3-5 ❌ للعرض

القرار: التوحيد مؤجَّل.

---

6️⃣ نظام الأصوات والاهتزاز

🔊 TTS

```tsx
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
const { speak, stop, isSpeaking, isSupported } = useCharacterVoice('sham');
speak('نص مشكّل');
```

نبرة كل بطل:

البطل pitch rate gender
شام 1.40 0.95 female
ريان 0.70 1.15 male
بانة 1.25 0.90 female
جود 0.80 1.05 male

📢 طبقات الكلام

اللحظة متى
بدء اللعبة user gesture
Gold Mode عند التفعيل
5 صح متتالي عند التفعيل
خطأ عند الخطأ
نهاية اللعبة عند النهاية

قاعدة: TTS في لحظات محددة · البطل يصمت أثناء التفكير.

📳 الاهتزاز

الحالة النمط
صح 30
خطأ [0, 40, 40, 40]
Gold [0, 20, 20, 20, 20, 60]
بدء 50
نهاية [0, 40, 40, 40, 40, 80]

🎵 أصوات القراصنة (seaSfx.ts)

· موج دائم (ضوضاء بيضاء lowpass 400Hz)
· رعد (sawtooth ينزل 60 → 20 Hz)
· بوق نجاح (330 → 440 → 554 Hz)
· بوق فشل (180 → 110 Hz)

🎶 أصوات Sorobania (sorobaniaSfx.ts)

· click · correct · wrong · tick
· relight · star · fanfare · lose · unlock
· setSoundOn(on) للتحكم

بلا ملفات mp3 — كل شيء مُولَّد.

---

7️⃣ نظام البطل المرافق

🎭 الأبطال الأربعة

البطل الصفة الملف الصوت
شام الذكية sham.png أنثوي · 1.40
ريان السريع rayan.png ذكوري · 0.70
بانة الهادئة bana.png أنثوي · 1.25
جود الذكي joud2.png ذكوري · 0.80

المسار: src/assets/avatars/
البطل المختار: soroban_companion

🎭 توزيع الأبطال

اللعبة البطل
العداد الطائر المختار
المحقق الرقمي جود
دوجو السوروبان شام
سباق القراصنة ريان
جزيرة سوروبانيا بانة

🖼️ حالات المزاج

الحالة الأنيميشن
idle طوفان رأسي · 2.5 ث
thinking ميلان يمين-يسار · 2 ث
excited قفز + تكبير · 0.6 ث
celebrating قفز + تكبير · 0.6 ث
sad انكماش خفيف · 0.6 ث

---

8️⃣ المعاينة الكاملة (Preview Mode)

· المفتاح: soroban_dev_preview
· القيمة: 'true'
· الملف: src/utils/previewMode.ts
· الزر: في GuardianDashboard

عند التفعيل:

· ✅ كل الألعاب مفتوحة
· ❌ لا تذاكر
· ❌ لا استهلاك
· ❌ لا XP

```typescript
import { isPreviewMode } from '@/utils/previewMode';
if (isPreviewMode()) { /* ... */ }
```

---

9️⃣ ملفات الفلاشات التعليمية (مرجع)

الملف الوظيفة
flash/types.ts أنواع FlashStep · FlashLesson
flash/flashData.ts فلاشات القسمة
flash/multData.ts فلاشات الضرب
flash/chainsData.ts السلاسل
flash/FlashScreen.tsx عرض الفلاش
flash/FlashListScreen.tsx قائمة الفلاشات
flash/TwoAbacusSolver.tsx تمرين القسمة
flash/MultSolver.tsx تمرين الضرب
flash/ChainSolver.tsx تمرين السلاسل
flash/MentalBadge.tsx الشارة الذهنية
flash/sorobanDivisionData.ts بنك مسائل القسمة

⚠️ يُستخدم من DetectiveGame.

---

🔟 إضافة لعبة جديدة — دليل

1️⃣ gamesData.ts

```tsx
{
  id: 'new-game-id',
  title: 'اسم اللعبة',
  subtitle: 'وصف',
  icon: '🎮',
  gradient: 'from-color-500 to-color-700',
  recommendHero: 'sham',
  duration: '60 ثانية',
  status: 'ready',
}
```

2️⃣ مجلد جديد

```
src/components/games/NewGame/
└── NewGame.tsx
```

3️⃣ المكوّن

```tsx
export default function NewGame({ onBack }: { onBack: () => void }) {
  return <div dir="rtl">{/* ... */}</div>;
}
```

4️⃣ الربط في GamesListScreen.tsx

```tsx
import { NewGame } from './NewGame/NewGame';

if (active.gameId === 'new-game-id') {
  return <NewGame onBack={() => setActive(null)} />;
}
```

---

1️⃣1️⃣ قرارات تصميمية

✅ ثابتة

1. لا لمس App.tsx
2. لا لمس Soroban2D5 (فقط props)
3. جلسات 45-90 ثانية
4. البطل يصمت أثناء التفكير
5. الرقم القياسي شهري
6. تصفير Guardian يحفظ 11 مفتاحاً
7. امتحان تحديد المستوى = 10 دقائق
8. L7 يُفتح للموصى به
9. Gold Mode — 3 صح · يزول بأول خطأ
10. XP: 2-5 لكل لعبة
11. لا تفريع حسب العمر
12. TICKET_XP_CAP = 50
13. TICKETS_MAX = 5

❌ مؤجَّلة للنسخة 2

· Hyper-Speed Burst
· تفريع حسب العمر
· توحيد المكونات الثلاثة
· لوحة صدارة عالمية
· الببغاء الثرثار

---

1️⃣2️⃣ سجل الأخطاء المُصلَحة

في progressStore.ts

الخطأ الإصلاح
ticketXP يُصفَّر عند الترقية migration v9
tickets لا تُحفظ migration v9
TICKET_XP_CAP منخفض رُفع إلى 50
TICKETS_MAX = 1 رُفع إلى 5

في GuardianDashboard.tsx

الخطأ الإصلاح
تصفير يفقد السجل 11 مفتاحاً في keysToKeep
handleBackup يُخفي مفاتيح إزالة الفلتر
handleRestore يترك حالة هجينة مسح قبل الكتابة
sorobania_progress_v2 مفقود أُضيف

في GamesListScreen.tsx

الخطأ الإصلاح
العنوان: XP الكلي مَحْفَظَةُ النِّقَاط
الأرقام معكوسة (RTL) dir="ltr"
النص السفلي سلبي "📚 اذهب إلى دروسك"
استهلاك على building فحص game.status

في Sorobania

الخطأ الإصلاح
ملف واحد 2398 سطر قُسّم إلى 5 ملفات
bestStreakRef لا يُصفَّر أُضيف في beginStage

في PirateRaceGame.tsx

الخطأ الإصلاح
isPreview بدل isPreviewMode صُحح
mood="happy" قيمة صحيحة
<HighScoreBadge entry> gameId
useCharacterVoice() بلا وسيط 'rayan'
اسم الطفل 'البطل' readChildName()
عرض خطوة واحدة عند الخطأ كل الخطوات

في useCharacterVoice.ts

الخطأ الإصلاح
كل الأبطال بنفس الصوت pitch متضخم
Chrome لا يحمّل الأصوات voicesReady state

---

1️⃣3️⃣ قيود وحمايات

🔒 محمي

الملف السبب
useSorobanLogic.ts منطق الخرزات
Bead2D5.tsx رسم الخرزة
Soroban2D5.tsx props فقط
App.tsx التنقل
LessonScreen.tsx الدروس
PracticeScreen.tsx التمارين
AnzanScreen.tsx الأنزان

✅ مسموح

· ملفات جديدة في src/components/games/
· props اختيارية في Soroban2D5 · Rod2D5
· تعديل progressStore.ts (إضافة حقول)
· تعديل HeroDashboard.tsx (زر)
· تعديل GamesListScreen.tsx (ربط)
· تعديل gamesData.ts (status)

🧪 اختبار بعد أي تعديل

1. 🎮 SorobanPlayground
2. 📚 LessonScreen
3. ✍️ PracticeScreen
4. 🧠 AnzanScreen
5. 🎬 FlashListScreen
6. 🎪 GamesListScreen

---

1️⃣4️⃣ بنية Sorobania

الملف الأسطر الدور
SorobaniaGame.tsx 1057 منطق · شاشات · export default
SorobaniaScenes.tsx 608 SVG · احتفالات
SorobaniaUI.tsx 407 Hud · بانة · فتيل · دروس
sorobaniaData.ts 377 ثوابت · أنواع · مراحل · حفظ
sorobaniaSfx.ts 133 WebAudio

الربط: GamesListScreen يستورد SorobaniaGame فقط.
الحفظ: sorobania_progress_v2 (11 مفتاحاً في keysToKeep).

---

📌 ملاحظات للمساعد القادم

⚠️ قبل أي عمل

1. اقرأ هذا الملف كاملاً
2. تحقق من وجود الملف على GitHub
3. React Web · لا React Native
4. إذا في شك — اسأل

📚 Stack

· Framework: React 18 + Vite
· Language: TypeScript
· Styling: Tailwind
· Animation: framer-motion
· Icons: lucide-react
· State: zustand + persist

🔗 المسارات

```typescript
'@/components/soroban2d5/Soroban2D5'
'@/hooks/useCharacterVoice'
'@/store/progressStore'
'@/utils/previewMode'
'@/types'
'@/components/games/GameCompanion'
'@/components/games/HighScoreBadge'
'@/components/games/highScoreStore'
```

🚨 عند الفشل

1. لا تُعِد البناء من الصفر
2. افحص الملفات الفعلية
3. تحقق من أسماء الملفات
4. اسأل قبل التخمين

📖 الملفات المرجعية

· STATE_OF_THE_PROJECT.md — مصدر الحقيقة
· REPAIR_PLAN.md — خطة الإصلاح
· SESSION_2026-10-13.md — سجل الجلسة
· GAMES_CITY.md — هذا الملف

هذا الدليل يلخص كل رحلتنا البرمجية، ويضع القواعد بشكل "سؤال وجواب" لضمان عدم تكرار الأخطاء.

يمكنك نسخ هذا النص بالكامل وحفظه، وإرساله لأي أداة ذكاء اصطناعي قبل أن تطلب منها إنشاء أو تعديل أي لعبة جديدة.

---

📜 الدليل المرجعي لتوحيد نظام الترجمة والنطق (TTS) في مشروع SorobanMind

🛑 القواعد الذهبية (يُمنع منعاً باتاً مخالفتها)

1. لا تقم بتقسيم النطق (Utterance Splitting): لا ترسل جزءاً إنجليزياً وجزءاً عربياً في طلبين منفصلين لمحرك الصوت. محركات الصوت في الجوال (Chrome/Android) تلغي أو تقطع المقطع الثاني.
2. لا تُمرر نصوصاً عربية خام إلى دالة النطق في الوضع الإنجليزي: محرك الصوت الإنجليزي يهلوس ويقرأ الحروف العربية كأنها حروف مقطعة (مثل: "كر بدا اكر").
3. لا تلمس ملف useGameVoice.ts: هذا الملف تم ضبطه بدقة ليكون "المعالج المركزي" للأصوات، وأي تعديل فيه قد يكسر جميع الألعاب.
4. لا تلمس ملف gamesI18n.ts: هو القاموس المركزي، ويجب أن يبقى كما هو.

---

💡 الأسئلة والأجوبة (حالات التطبيق)

❓ السؤال 1: كيف يتعامل ملف الصوت useGameVoice.ts مع الجمل المختلطة (نص إنجليزي + اسم طفل عربي)؟

الجواب:
ملف useGameVoice يمتلك "قاموس نطق" للأسماء الشائعة (مثل: محمد -> Mohammed)، وخوارزمية "تحويل حرفي" (Transliteration) للأسماء غير المعروفة (مثل: ميزو -> Mezo). 
عندما يجد اسماً عربياً في جملة إنجليزية، يقوم بتحويله إلى حروف إنجليزية، ثم ينطق الجملة كاملة كطلب صوتي واحد متصل. (إذا كان الاسم ثلاثياً، يقتطع الاسم الأول فقط لتجنب البهدلة).

❓ السؤال 2: لماذا كانت بعض الألعاب (مثل المحقق والصحن الطائر) تهلوس وتُقطع الأحرف؟

الجواب:
لأن ملفات هذه الألعاب كانت تمرر نصوصاً عربية خام (Raw Arabic) مباشرة إلى دالة speak(). في الوضع الإنجليزي، كان محرك الصوت الإنجليزي يستلم هذه النصوص العربية، فيبدأ بتهجئتها حرفاً حرفاً بشكل مشوه.

❓ السؤال 3: ما هي القاعدة الأساسية التي يجب تطبيقها في كل ملف لعبة (Game.tsx)؟

الجواب:
القاعدة: أي نص عربي سيتم نطقه (speak) أو عرضه في فقاعة الشخصية (setHeroText أو setBanaMsg)، يجب أن يمر إجبارياً عبر دالة الترجمة gt().

· مثال خاطئ: speak(correctMsg);
· مثال صحيح: speak(gt(correctMsg));
· مثال خاطئ: setHeroText(errorMsg);
· مثال صحيح: setHeroText(gt(errorMsg));

❓ السؤال 4: ماذا لو كان النص يحتوي على متغيرات (أرقام أو أسماء)؟

الجواب:
استخدم دالة lt(ar, en) (التي تأخذ النسختين العربية والإنجليزية).

· مثال صحيح: speak(lt(\مبروك يا ${name}!\`, \`Congratulations ${name}!`))
  *(ملاحظة: دالة useGameVoice` ستتكفل بمعالجة اسم الطفل إذا كان عربياً).*

❓ السؤال 5: هل نضيف gt() للواجهة المرئية الثابتة (مثل أسماء الأزرار والنقاط)؟

الجواب:
نعم، لتوحيد التجربة. أي نص يظهر للمستخدم في واجهة اللعبة يجب أن يمر بـ gt().

· استثناء: الأرقام والإيموجي (مثل ⏳ أو 🎯) لا تحتاج إلى gt().
· استثناء: المكونات التي تحتوي على <T ar="..." en="..." /> لا تحتاج إلى gt() لأنها تترجم نفسها.

❓ السؤال 6: كيف نتعامل مع مصفوفات النصوص (مثل عبارات الهتاف)؟

الجواب:
عند اختيار عبارة عشوائية من المصفوفة، نضع gt() حول دالة الاختيار أو حول المتغير الناتج:

· مثال صحيح 1: const msg = pick(PHRASES); speak(gt(msg));
· مثال صحيح 2: speak(gt(pick(PHRASES)));
· مثال خاطئ: speak(pick(PHRASES));

❓ السؤال 7: كيف نتأكد أننا لم نكسر الوضع العربي (AR)؟

الجواب:
دالة gt() في وضع اللغة العربية (AR) تقوم بإرجاع النص العربي كما هو دون أي تغيير. لذا إحاطة النصوص بـ gt() آمنة تماماً في الوضع العربي، ولن تؤثر على النطق أو العرض العربي إطلاقاً.

❓ السؤال 8: ماذا نفعل بملفات الترجمة المركزية (Data/Constants)؟

الجواب:
نتركها كما هي تماماً. لا نترجم النصوص داخلها يدوياً، بل نتركها نصوصاً عربية خام (Raw Arabic). الترجمة تحدث فقط في ملف اللعبة (UI) وقت العرض أو النطق عبر gt() أو lt().

---

🛠️ قائمة تحقق (Checklist) قبل اعتماد أي لعبة جديدة:

☐ هل كل استدعاءات speak(...) محاطة بـ gt(...) أو lt(...)؟
☐ هل كل استدعاءات setHeroText(...) أو setBanaMsg(...) محاطة بـ gt(...) أو lt(...)؟
☐ هل أسماء المراحل/العناوين في واجهة المستخدم محاطة بـ gt(...)؟
☐ هل دالة readChildName() سليمة وتستخدم المخزن useProgressStore؟
☐ هل استيراد import { gt, lt } from '../gamesI18n'; موجود في أعلى الملف؟
☐ هل لم يتم المساس بمنطق اللعبة الأساسي أو التصميم؟

---

📌 رسالة للأداة الذكية (AI):
"عند العمل على ملف لعبة جديد في هذا المشروع، اقرأ هذا الدليل أولاً. طبّق قاعدة gt() بجراحية شديدة على النصوص التي تُنطق أو تُعرض فقط. لا تعيد كتابة المنطق البرمجي (Logic) للعبة، ولا تعدل ملفات الـ Hooks المركزية (useGameVoice). التزم حرفياً بهذا الدليل لضمان استقرار النظام الصوتي والترجمة في جميع الألعاب."

---

آخر تحديث: 2026-10-13
الحالة: 🟢 البناء أخضر · 5 من 5 ألعاب

```
