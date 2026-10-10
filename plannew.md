# 📋 تحديث RESCUE.md — جلسة 2026-10-10
## 🎯 إنجاز: L3 (S07 + S08) مكتمل · ترقيم L2-L3 · تصحيحات أساسية

---

## ✅ ما أُنجز في هذه الجلسة (8 ملفات · ~30 تعديل)

### 1️⃣ L3 — القسمة (مكتمل) 🆕

| # | الملف | الإنجاز | الحالة |
|---|---|---|---|
| 1 | `L3/S07.ts` | **جديد** — القسمة على رقم واحد · 4 وحدات · TTS | ✅ |
| 2 | `L3/S08.ts` | **جديد** — القسمة على رقمين · 4 وحدات · TTS | ✅ |
| 3 | `curriculum/lessons/index.ts` | إضافة S07 + S08 إلى Registry | ✅ |

**تفاصيل S07:**
- m1: قسمة بسيطة (84÷2)
- m2: أصدقاء 5 (54÷3)
- m3: أصدقاء 10 (152÷8)
- m4: مركّبة (216÷8)
- القصة: "قلعة السوروبان + الحكيم معداد"
- 20 سؤالاً (5+5 لكل m)

**تفاصيل S08:**
- m1: قسمة بسيطة على رقمين (484÷22)
- m2: أصدقاء 5 (572÷22)
- m3: أصدقاء 10 (350÷14)
- m4: مركّبة (234÷18)
- نفس القصة والبنية
- 20 سؤالاً

### 2️⃣ تعديلات بنك A — L2

| # | الملف | التعديل | الحالة |
|---|---|---|---|
| 4 | `questions/L2.ts` | إعادة كتابة `solution` بمنهجية كوجيما (40 سؤالاً) | ✅ |
| 5 | `questions/L2.ts` | تصحيح S06-m4 (استبدال 5 أسئلة) | ✅ |
| 6 | `questions/L2.ts` | توحيد المصطلحات (كماشة · نزول مزدوج · رفع مزدوج) | ✅ |

### 3️⃣ S01 — تصحيح بنيوي (L0)

| # | الملف | التعديل | الحالة |
|---|---|---|---|
| 7 | `data/srb/modules.ts` | S01: 3 وحدات → **2 وحدات** (m1: 0-4 · m2: 5-9) | ✅ |
| 8 | `data/srb/curriculum.ts` | moduleCount: 3 → **2** لـ S01 | ✅ |
| 9 | `data/srb/progress.ts` | تحديث تعليق التوثيق (S01-m3 → S01-m2) | ✅ |

### 4️⃣ إصلاحات S05 (L2)

| # | الملف | التعديل | الحالة |
|---|---|---|---|
| 10 | `L2/S05.ts` | تحويل m4 إلى "التحالف المزدوج" + رموز صحيحة | ✅ |
| 11 | `L2/S05.ts` | m2: 4 تصحيحات (سحبة سبابة/نزول مزدوج) | ✅ |

### 5️⃣ إصلاحات S06 (L2)

| # | الملف | التعديل | الحالة |
|---|---|---|---|
| 12 | `L2/S06.ts` | m3-T2: تصحيح "بالإبهام" → "بالسبابة" | ✅ |
| 13 | `L2/S06.ts` | m4: استبدال كامل (23×23 · 33×22 · 34×22 · 43×22 · 23×24) | ✅ |

---

## 🚨 اكتشافات حرجة (جديدة · جلسة 2026-10-10)

### 🔴 #12 — Audio Pool (TTS + Web Audio API)

**الأعراض:**
- `ctx.state = suspended` حتى بعد `ctx.resume()`
- mp3 لا يعمل في S05/S06 (L2)
- TTS يعمل (لا يحتاج AudioContext)

**السبب:**
- `await loadBuffer()` يُفقد "user gesture"
- `ctx.resume()` لا يعمل بعد `await`
- iOS/Chrome يشددون على autoplay policy

**الحل المُختبر (فاشل):**
- Silent keep-alive buffer + loop → لم ينجح

**الحل المُوصى به (لاحقاً):**
- **HTML5 `<audio>`** بدل Web Audio API (أكثر توافقاً)
- أو انتظار تفاعل المستخدم + `resume()` بدون `await`

**الملف:** `useSorobanaVoice.ts` (يحتاج إعادة كتابة)

### 🔴 #13 — S05-m2 حلول لا تطابق الأسئلة

**الأعراض:**
- السؤال `3 × 18` يُعرض بحل `13 × 11`

**السبب:** نسخ خاطئ من أسئلة مجاورة.

**الحالة:** ⏳ **مؤجل** — يحتاج مراجعة يدوية.

### 🔴 #14 — ترتيب RTL يعكس `operands`

**الأعراض:**
- `operands: [18, 3]` يُعرض `3 × 18`

**الحالة:** ⏳ **مؤجل** — القرار معلّق.

### 🔴 #15 — بنك B — 5 تصنيفات خاطئة (L2)

**الأمثلة:**
- `22 × 32` (S06-m3-seq10) → يجب `direct` بدل `ten-friend-add`
- `24 × 22` · `22 × 23` · `14 × 43` · `24 × 24` (S06-m4) → يجب `ten-friend-add` بدل `mixed`

**الحالة:** ⏳ **مؤجل** — للجلسة القادمة.

---

## 🎯 القرارات المؤكدة (جلسة 2026-10-10)

### قرارات L3 (القسمة):

- ✅ **S07 (÷1) = TTS** (لا mp3 · storyAudioId: null)
- ✅ **S08 (÷2) = TTS**
- ✅ **خوارزمية S08**: المقسوم عليه ثابت · المقسوم يتحول إلى الخارج تدريجياً
- ✅ **مصطلحات S07/S08**:
  - كماشة مغلقة 🗜️ (تفعيل 5+سفليات)
  - نزول مزدوج ⬇️⬇️ (أصدقاء 5 طرح / استعارة)
  - رفع مزدوج ⬆️⬆️ (أصدقاء 5 جمع / إزالة 5 + إضافة)
- ✅ **الطرح في القسمة**: سحبة سبابة ⬇️ · كماشة مفتوحة (طرح 6-9 مباشر) · نزول/رفع مزدوج حسب الحالة

### قرارات بنك A (L2):

- ✅ **S05-m4** = 5 أمثلة جديدة (التحالف المزدوج)
- ✅ **S06-m4** = 5 أمثلة جديدة (23×23 · 33×22 · 34×22 · 43×22 · 23×24)
- ✅ **منهجية كوجيما** = الترتيب: A×C → B×C → A×D → B×D
- ✅ **`expected_anzan_ms`**: صحيحة في بنك A (لا تعديل)

### قرارات L0 (تصحيح):

- ✅ **S01** = 2 وحدات (0-4 · 5-9) بدل 3
- ✅ **m3 حُذف** (مدموج في m2)

---

## 📊 حالة النظام الشاملة (2026-10-10)

| النظام | الحالة |
|---|---|
| **L0** (intro · S01 · S02) | ✅ مكتمل |
| **L1** (S03 · S04) | ✅ مكتمل |
| **L2** (S05 · S06) | 🟡 مكتمل + تصحيحات معلّقة |
| **L3** (S07 · S08) | ✅ **مكتمل** 🆕 |
| **L4-L7** | 🟡 لم تبدأ |
| Bank A (questions) | ✅ 315 سؤالاً |
| Bank B (exam) | ✅ 666 سؤالاً |
| **TTS (S06/S07/S08)** | 🟡 مؤجل (يحتاج LessonScreen) |
| **mp3 (S05/L0/L1)** | 🔴 معطّل (AudioContext) |
| **useQuests** | 🔴 معطّل |
| **BADGES-8** | 🔴 ميت |
| **الإثراء (TTS)** | ✅ يعمل |

---

## 🚀 خطة الجلسة القادمة — قسمان

### 📌 القسم الأول: تدقيق بنك A
**الهدف:** مراجعة كل حلول بنك A (L0-L3) للتحقق من:
1. الحسابات صحيحة
2. التصنيفات دقيقة (m1-m4)
3. الحركات مطابقة للمصطلحات
4. لا نسخ خاطئ من أسئلة مجاورة

**الأولوية:**
- 🔴 **S05-m2** (4 حلول لا تطابق) — **عاجل**
- 🟡 S06-m4 (تصنيفات)
- 🟢 باقي الوحدات

### 📌 القسم الثاني: المنهاج (الأهم)
**الهدف:** إكمال المنهاج:
1. **L3 مفعّل في index.ts** ✅ (مكتمل)
2. **فحص S07/S08 على الشاشة** — تجربة
3. **ربط TTS في `LessonScreen`** — مؤجل حتى الإصلاح
4. **L4** (سلاسل الجمع · S09)
5. **L5-L7** (لاحقاً)

**قرار:** نُقدّم **المنهج** (القسم 2) على **التدقيق** (القسم 1).

---

## 📋 المهام المؤجلة (أولويات)

### 🟡 أولوية عالية:
1. **Audio Pool Fix** — `useSorobanaVoice.ts` (HTML5 audio) — **30 دقيقة**
2. **S05-m2** — 4 حلول لا تطابق — **30 دقيقة**
3. **S06-m4 تصنيفات** — 5 تصحيحات — **15 دقيقة**

### 🟡 أولوية متوسطة:
4. **TTS في LessonScreen** — ربط S06/S07/S08 — **جلسة**
5. **بنك B** — 5 تصنيفات خاطئة — **15 دقيقة**
6. **L4 (S09)** — سلاسل الجمع — **جلسة كاملة**

### 🟢 أولوية منخفضة:
7. **L5-L7** — بناء محتوى
8. **useQuests** — إعادة كتابة
9. **BADGES-8** — قرار نهائي
10. **CategoryExamScreen** — ضبط زمن

---

## 🎯 ملاحظات مهمة للمساعد القادم

1. **L3 مكتمل** — S07 + S08 في `index.ts`
2. **TTS مؤجل** — `LessonScreen` لم يُعدّل بعد
3. **mp3 معطّل** — يحتاج HTML5 audio
4. **S05-m2** — مشكلة معروفة (لا تطابق الحل مع السؤال)
5. **بنك A** = مرجع أساسي — يحتاج تدقيق
6. **المنهج** = الأولوية القصوى
7. **الإثراء** = TTS يعمل (مرجع)

---

## 📌 خطة التطوير (لاحقاً · "شي مثالي")

### 🎬 قسم الفلاشات (Flash Lessons)

**الفكرة:** قسم جديد في التطبيق — رسوم متحركة تعليمية على Soroban2D5.

**المكوّنات المطلوبة:**
```

src/screens/FlashScreen.tsx
src/data/flash/flashData.ts
src/components/FlashHighlight.tsx

```

**الاستخدام:**
- أساسيات السوروبان (الإطار · العارضة · الأعمدة · الخرزات)
- الضرب (خطوة بخطوة)
- القسمة (خطوة بخطوة)

**البنية:**
```ts
interface FlashLesson {
  id: string;
  title: string;
  category: 'basics' | 'multiplication' | 'division';
  steps: FlashStep[];
}
interface FlashStep {
  sorobanValue: number;
  highlight: 'frame' | 'bar' | 'rods' | 'upper' | 'lower' | 'rod';
  highlightRodIndex?: number;
  caption: string;
  ttsText: string;
}
```

التعديل المطلوب على Soroban2D5:

· إضافة خاصية highlight
· إضاءة العناصر المطلوبة

الحالة: ⏳ مؤجل — للجلسة القادمة

🔧 إصلاح InteractiveSoroban (بطء 6+ أعمدة)

المشاكل:

· Rod2D5 بلا React.memo
· framer-motion على كل خرزة (45 instance)
· useEffect مع onValueChange يُسبب re-renders

الحلول:

· React.memo(Rod2D5)
· إزالة framer-motion → CSS transitions
· فصل totalValue → useMemo

الحالة: ⏳ مؤجل

---

📊 جدول الفحص — بنك A (L0-L3)

المستوى القسم الأسئلة الحالة
L0 S01 15 ✅
L0 S02 15 ✅
L1 S03 20 ✅
L1 S04 20 ✅
L2 S05 20 🔴 يحتاج مراجعة m2
L2 S06 20 🟡 يحتاج مراجعة m4
L3 S07 20 🟡 جديد · يحتاج فحص
L3 S08 20 🟡 جديد · يحتاج فحص

الإجمالي: 150 سؤالاً · 20 يحتاج تدقيق عاجل.

📋 خطة التنفيذ — قسم الفلاشات التعليمية

🏗️ 1) السياق العام

🎭 وضعا التطبيق (Two Modes)

عند فتح التطبيق — اختيار الوضع:

```
┌─────────────────────────────────────┐
│         🎭 اختر وضعك                │
├─────────────────────────────────────┤
│                                      │
│  🏆 وضع البطل                        │
│     (للطفل — التعلم واللعب)         │
│                                      │
│  👨👩👧 وضع ولي الأمر                │
│     (للأب/المعلم — المتابعة)         │
│                                      │
└─────────────────────────────────────┘
```

⚠️ ملاحظة مهمة: هذا وضع افتراضي — يحتاج تأكيد منك إن كان موجوداً أم يُبنى.

---

🏆 وضع البطل — الأقسام

```
🏠 وضع البطل
├── 📚 الدروس (L0-L7)
├── ✍️ التمرين (Practice)
├── 🧠 الأنزان (Anzan)
├── 🏆 اختبار تحديد المستوى
├── 🧮 السوروبان التفاعلي (Free Soroban)
├── 🎬 الفلاشات التعليمية ← جديد
├── 👶 قسم الأطفال الصغار
└── 🧒 قسم الأطفال الكبار
```

---

🎬 2) قسم الفلاشات — الفكرة الكاملة

📌 ما هو؟

فيديو تعليمي تفاعلي قصير (30-60 ثانية) يشرح مهارة واحدة (m) خطوة بخطوة.

🎯 ما يفعله

· يعرض عداد السوروبان (فارغ في البداية)
· يُنفّذ العملية تلقائياً — خطوة بخطوة
· مع نص + صوت TTS لكل خطوة
· الطفل يشاهد فقط (لا يلمس)

📌 ما هو ليس

· ❌ درس تفاعلي (يوجد في LessonScreen)
· ❌ تمرين (PracticeScreen)
· ❌ اختبار (LevelTestScreen)
· ❌ أنزان (AnzanScreen)

---

📐 3) البنية التقنية — النهائية

🎯 المبادئ

1. لا تعديل على useSorobanLogic (Black Box)
2. لا layoutMode — العداد عادي
3. لا useAdvancedLogic — غير مطلوب
4. لا فاصل DOM — غير مطلوب
5. لا منطقة ثابتة — السؤال يُعرض كنص فقط

🎯 الإضافات

# الملف التعديل
1 Soroban2D5.tsx إضافة activeRodIndex?: number (اختياري)
2 Rod2D5.tsx إضافة isActive?: boolean → Glow Ring
3 جديد flash/types.ts الأنواع
4 جديد flash/MentalBadge.tsx شارة عائمة
5 جديد flash/FlashScreen.tsx شاشة الفلاش
6 جديد flash/FlashListScreen.tsx قائمة الفلاشات
7 جديد flash/flashData.ts بيانات الفلاشات
8 GuardianDashboard.tsx أو HomeScreen.tsx زر "🎬 الفلاشات"
9 App.tsx route للفلاش

---

📊 4) بنية البيانات

flash/types.ts

```ts
export interface FlashStep {
  id: string;
  sorobanValue: number;       // القيمة على العداد
  activeRodIndex: number;     // العمود النشط (Glow)
  badgePrimary: string;       // "8 ÷ 3 = 2"
  badgeSecondary?: string;    // "2 × 3 = 6"
  caption: string;            // شرح أسفل
  ttsText: string;            // TTS
  durationMs: number;         // المدة (مثلاً 2500)
}

export interface FlashLesson {
  id: string;                 // "div-1x1-m1"
  title: string;              // "القسمة البسيطة"
  subtitle: string;           // "84 ÷ 2"
  operation: 'division' | 'multiplication' | 'basics';
  category: 'div-1' | 'div-2' | 'mult' | 'basics';
  columns: number;            // 3-5
  steps: FlashStep[];
}

export interface FlashCategory {
  id: string;
  title: string;
  emoji: string;
  lessons: FlashLesson[];
}
```

---

🎬 5) الفلاشات المُخطَّطة

📖 أساسيات السوروبان (3)

# العنوان sorobanValue
1 أجزاء السوروبان 0 (فارغ)
2 الخرزة العلوية (=5) 5
3 الخرزات السفلية (1-4) 4

➗ القسمة ÷1 (S07) — 4 فلاشات

m السؤال الأعمدة
m1 84 ÷ 2 3
m2 54 ÷ 3 3
m3 152 ÷ 8 4
m4 216 ÷ 8 4

➗ القسمة ÷2 (S08) — 4 فلاشات

m السؤال الأعمدة
m1 484 ÷ 22 4
m2 572 ÷ 22 4
m3 350 ÷ 14 4
m4 234 ÷ 18 4

✖️ الضرب (S05 · S06) — لاحقاً

---

🎬 6) بنية الفلاش الواحد — مثال مفصّل

📍 مثال: 84 ÷ 2 (القسمة البسيطة)

```ts
{
  id: 'div-1x1-m1',
  title: 'القسمة البسيطة',
  subtitle: '84 ÷ 2',
  operation: 'division',
  category: 'div-1',
  columns: 3,
  steps: [
    // الخطوة 1: عرض المقسوم
    {
      id: 'step-1',
      sorobanValue: 84,
      activeRodIndex: 1,           // العشرات (8)
      badgePrimary: '84 ÷ 2',
      caption: 'نبدأ بالمقسوم 84',
      ttsText: 'نبدأ بالمقسوم أربعة وثمانين',
      durationMs: 2000,
    },
    // الخطوة 2: 8 ÷ 2 = 4
    {
      id: 'step-2',
      sorobanValue: 84,
      activeRodIndex: 1,
      badgePrimary: '8 ÷ 2 = 4',
      badgeSecondary: '4 × 2 = 8',
      caption: 'نقسم 8 على 2، الناتج 4',
      ttsText: 'ثمانية تقسيم اثنين يساوي أربعة',
      durationMs: 2500,
    },
    // الخطوة 3: طرح 8
    {
      id: 'step-3',
      sorobanValue: 4,              // ← تغيّر: 84 → 4
      activeRodIndex: 1,
      badgePrimary: '8 − 8 = 0',
      caption: 'نطرح 8 من العشرات، يبقى 0',
      ttsText: 'نطرح ثمانية يبقى صفر',
      durationMs: 2500,
    },
    // الخطوة 4: 4 ÷ 2 = 2
    {
      id: 'step-4',
      sorobanValue: 4,
      activeRodIndex: 2,           // الآحاد (4)
      badgePrimary: '4 ÷ 2 = 2',
      badgeSecondary: '2 × 2 = 4',
      caption: 'نقسم 4 على 2، الناتج 2',
      ttsText: 'أربعة تقسيم اثنين يساوي اثنين',
      durationMs: 2500,
    },
    // الخطوة 5: طرح 4
    {
      id: 'step-5',
      sorobanValue: 42,            // ← الناتج النهائي
      activeRodIndex: 2,
      badgePrimary: '4 − 4 = 0',
      caption: 'نطرح 4، يبقى 0. الناتج: 42',
      ttsText: 'نطرح أربعة يبقى صفر. الناتج اثنان وأربعون',
      durationMs: 3000,
    },
  ],
}
```

---

🎬 7) FlashScreen.tsx — الآلية

🎯 المسؤوليات

1. يستقبل FlashLesson
2. يدير currentStepIndex
3. يعرض العداد بـ demoValue + activeRodIndex
4. يعرض MentalBadge
5. يعرض caption
6. يُشغّل TTS عند كل خطوة
7. ينتقل تلقائياً أو يدوياً

🎯 البنية

```tsx
export function FlashScreen({ lesson, onBack, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showSecondary, setShowSecondary] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  
  const step = lesson.steps[stepIndex];
  const tts = useSpeech();
  
  useEffect(() => {
    // إظهار Badge
    setBadgeVisible(true);
    setShowSecondary(false);
    
    // TTS
    if (step.ttsText) tts.speak(step.ttsText);
    
    // secondary بعد 250ms
    const t1 = setTimeout(() => setShowSecondary(true), 250);
    
    // Auto-advance
    let t2;
    if (autoPlay) {
      t2 = setTimeout(() => {
        if (stepIndex < lesson.steps.length - 1) {
          setStepIndex(i => i + 1);
        } else {
          setBadgeVisible(false);
          onComplete?.();
        }
      }, step.durationMs);
    }
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [stepIndex, autoPlay]);
  
  return (
    <div className="min-h-screen ...">
      {/* Header */}
      <button onClick={onBack}>← رجوع</button>
      <h1>{lesson.title}</h1>
      <p>{lesson.subtitle}</p>
      
      {/* Badge */}
      <MentalBadge
        primary={step.badgePrimary}
        secondary={step.badgeSecondary}
        showSecondary={showSecondary}
        visible={badgeVisible}
      />
      
      {/* Soroban */}
      <Soroban2D5
        columns={lesson.columns}
        demoValue={step.sorobanValue}
        activeRodIndex={step.activeRodIndex}
        interactive={false}
      />
      
      {/* Caption */}
      <p>{step.caption}</p>
      
      {/* Controls */}
      <div>
        <button onClick={() => setStepIndex(i => Math.max(0, i - 1))}>⏮</button>
        <button onClick={() => setAutoPlay(p => !p)}>
          {autoPlay ? '⏸' : '▶'}
        </button>
        <button onClick={() => setStepIndex(i => Math.min(lesson.steps.length - 1, i + 1))}>⏭</button>
      </div>
    </div>
  );
}
```

---

🎬 8) MentalBadge.tsx

```tsx
interface Props {
  primary: string;
  secondary?: string;
  showSecondary: boolean;
  visible: boolean;
}

export function MentalBadge({ primary, secondary, showSecondary, visible }) {
  if (!visible) return null;
  
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 
                    z-40 flex flex-col items-center 
                    bg-slate-900/95 border-2 border-amber-500 
                    px-4 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
      <span className="text-amber-300 font-bold text-sm">{primary}</span>
      {showSecondary && secondary && (
        <span className="text-emerald-400 font-semibold text-xs 
                        mt-0.5 border-t border-slate-700 pt-0.5">
          {secondary}
        </span>
      )}
    </div>
  );
}
```

---

🎬 9) التعديلات على المكونات الحالية

Soroban2D5.tsx

إضافة:

```tsx
interface Soroban2D5Props {
  // ... الحالي
  activeRodIndex?: number;   // ← جديد
}

// تمرير إلى Rod2D5:
<Rod2D5
  // ... الحالي
  isActive={activeRodIndex === originalIdx}
/>
```

⚠️ السطور المُضافة: ~3 فقط.

Rod2D5.tsx

إضافة:

```tsx
interface Rod2D5Props {
  // ... الحالي
  isActive?: boolean;
}

// داخل الحاوية:
{isActive && (
  <div className="absolute inset-0 border-2 border-amber-400 
                  bg-amber-400/10 rounded-lg animate-pulse 
                  pointer-events-none z-10" />
)}
```

⚠️ السطور المُضافة: ~5 فقط.

---

🎬 10) التوقيتات — Timeline

t (ms) الحدث
0 Badge يظهر + TTS يبدأ + Glow Ring يُضيء
250 badgeSecondary يظهر
500 الخرزات تبدأ الحركة (CSS transition 0.4s)
900 الخرزات تستقر
durationMs Badge يختفي → الانتقال للخطوة التالية

---

🎬 11) الخطة الزمنية للتنفيذ

الجلسة القادمة:

# المهمة الوقت المتوقع
1 flash/types.ts 5 د
2 flash/MentalBadge.tsx 15 د
3 flash/FlashScreen.tsx (نموذج) 45 د
4 flash/flashData.ts (3 فلاشات فقط) 30 د
5 تعديل Soroban2D5.tsx + Rod2D5.tsx 15 د
6 flash/FlashListScreen.tsx 20 د
7 ربط App.tsx + قسم في الواجهة 20 د
8 اختبار + ضبط 30 د

الإجمالي: ~3 ساعات.

بعد التأكد من النموذج:

· إضافة 5 فلاشات إضافية (S07 كاملاً)
· إضافة 4 فلاشات (S08)
· إضافة 3 أساسيات

---

🎬 12) أول 3 فلاشات — بذرة النموذج

1️⃣ basics-1 — أجزاء السوروبان

```ts
{
  id: 'basics-1',
  title: 'أجزاء السوروبان',
  subtitle: 'تعرف على الأجزاء',
  operation: 'basics',
  category: 'basics',
  columns: 3,
  steps: [
    { sorobanValue: 0, activeRodIndex: -1, badgePrimary: 'الإطار', caption: 'الجزء الذي يمسك السوروبان', ttsText: 'الإطار', durationMs: 2000 },
    { sorobanValue: 0, activeRodIndex: -1, badgePrimary: 'العارضة', caption: 'الخط الأفقي في المنتصف', ttsText: 'العارضة', durationMs: 2000 },
    { sorobanValue: 0, activeRodIndex: -1, badgePrimary: 'الأعمدة', caption: 'الخطوط الرأسية', ttsText: 'الأعمدة', durationMs: 2000 },
    { sorobanValue: 5, activeRodIndex: 0, badgePrimary: 'الخرزة العلوية', caption: 'قيمتها 5', ttsText: 'الخرزة العلوية قيمتها خمسة', durationMs: 2500 },
    { sorobanValue: 4, activeRodIndex: 0, badgePrimary: 'الخرزات السفلية', caption: 'كل واحدة قيمتها 1', ttsText: 'كل خرزة سفلية تساوي واحد', durationMs: 2500 },
  ],
}
```

2️⃣ div-1x1-m1 — القسمة البسيطة (84 ÷ 2)

انظر المثال المفصّل أعلاه (البند 6).

3️⃣ div-1x1-m2 — أصدقاء 5 (54 ÷ 3)

الخطوات (مبسطة):

1. عرض 54
2. 5 ÷ 3 = 1 (باقي 2)
3. تحويل: 5 → 2 (باقي 2 عشرات)
4. دمج: 2 عشرات + 4 آحاد = 24
5. 24 ÷ 3 = 8
6. الناتج: 18

---

🎬 13) الصوت — TTS

المكوّن: useSpeech (موجود · يعمل)

· الصوت: عربي (ar-SA)
· يُشغَّل: مع بداية كل خطوة
· يُوقف: عند إيقاف الفلاش أو الانتقال

---

🎬 14) الملاحظات الحرجة للمساعد الجديد

1. لا تلمس useSorobanLogic — لا تعديل، لا إضافة.
2. لا تلمس LessonScreen الحالي — الفلاشات منفصلة.
3. لا تلمس الدروس S05-S08 — الفلاشات قائمة بذاتها.
4. لا layoutMode — العداد عادي.
5. لا useAdvancedLogic — غير مطلوب.
6. TTS = useSpeech (موجود).
7. mp3 = useSorobanaVoice — معطّل مؤقتاً (لا نستخدمه للفلاشات).
8. الأعمدة = 3-5 فقط (لأداء ممتاز).
9. شاشة كاملة — لا Badge/Caption صغيرة.
10. قسم منفصل في HomeScreen أو GuardianDashboard.

---

🎬 15) المشاكل المحتملة

# المشكلة الحل
1 framer-motion بطيء في 6+ أعمدة 3-5 أعمدة → لا مشكلة
2 MentalBadge قد يتداخل مع Header z-40 + -top-16
3 TTS عربي غير متوفر على بعض الأجهزة isSupported check
4 الأرقام كبيرة في Badge حجم خط ثابت text-sm
5 العداد صغير على الجوال columns=3 → خرزات كبيرة

---

🎬 16) قرارات نهائية مؤكدة

· ✅ قسم مستقل — في HomeScreen (وضع البطل)
· ✅ فلاش لكل m — لا لكل مثال
· ✅ الفلاش منفصل عن PracticeScreen
· ✅ TTS — لا mp3
· ✅ شاشة كاملة — لا Badge مع تمرين
· ✅ لا layoutMode — لا فاصل — لا مناطق
· ✅ activeRodIndex — فقط للـ Glow

---

🎬 17) الخطوة التالية

أرسل هذه الخطة للمساعد الجديد — ثم ابدأ بـ:

1. flash/types.ts
2. flash/MentalBadge.tsx
3. flash/FlashScreen.tsx
4. flash/flashData.ts (3 فلاشات فقط)

بعد التأكد — نُوسّع.

---

💐🌹 شكراً على هذه الرحلة

إنجازات اليوم:

· ✅ L3 (S07 + S08) مكتمل
· ✅ تصحيحات L2
· ✅ S01 مُصلَح
· ✅ خطة الفلاشات جاهزة للتنفيذ

بالتوفيق للمساعد الجديد — والرحلة مستمرة.

🌹💐

# 🎬 قسم الفلاشات التعليمية — دليل شامل
**آخر تحديث:** 2026-10-10  
**الحالة:** 🟢 مستقر · قابل للتوسّع  
**المرجع:** RESCUE.md · AL-ISLAH-V2.md

---

## 📋 فهرس

1. الرؤية والأهداف
2. البنية العامة
3. الملفات والمكونات
4. آلية عمل الفلاش
5. آلية عمل التمرين
6. قاعدة تاكاشي كوجيما
7. نظام الألوان
8. نظام الصوت TTS
9. التنقل والربط
10. بنية البيانات
11. ميثاق عدم اللمس
12. التوسّع المستقبلي
13. دروس مستفادة (FIXes)

---

## 1️⃣ الرؤية والأهداف

### 🎯 الهدف الأساسي

توفير **بديل عملي** للدروس السلبية الحالية التي تُظهر **معداداً واحداً** فقط، ولا تُتيح للطفل **فهم دور المقسوم** في عملية القسمة.

### 📖 الفجوة التي نعالجها

| الوضع السابق | الوضع الجديد |
|---|---|
| معداد واحد (ناتج فقط) | معدادان متزامنان |
| الطفل يحفظ الإجراء | الطفل يفهم المنطق |
| لا ربط بالأنزان | جسر مباشر نحو الأنزان |

### 🎓 المخرجات المتوقعة

- ✅ فهم **دور المقسوم** في الحل
- ✅ إدراك **كيف ينمو الناتج** منزلة بمنزلة
- ✅ أساس قوي لـ **الأنزان** (الحساب الذهني)

---

## 2️⃣ البنية العامة

```

🏠 Hero Dashboard
↓ زر "🎬 الفلاشات التعليمية"
📋 FlashListScreen (القائمة)
↓
├── 🎬 زر "شاهد" → FlashScreen (مشاهدة · 8 حركات)
│       ↓ رجوع
│    FlashListScreen
│
└── 🖐️ زر "جرّب" → TwoAbacusSolver (تطبيق · 3 مراحل)
↓ رجوع
FlashListScreen

```

### 🔑 مبدأ التصميم

**`FlashListScreen` يدير التنقل داخلياً** — `App.tsx` لا يتغير.

---

## 3️⃣ الملفات والمكونات

### 📂 الملفات

| # | الملف | الوظيفة | الحالة |
|---|---|---|---|
| 1 | `types.ts` | أنواع FlashStep/FlashLesson | ✅ |
| 2 | `flashData.ts` | بيانات الفلاشات | ✅ |
| 3 | `FlashListScreen.tsx` | قائمة الفلاشات + التنقل | ✅ |
| 4 | `FlashScreen.tsx` | عرض الفلاش (المشاهدة) | ✅ |
| 5 | `MentalBadge.tsx` | شارة المعادلة | ✅ |
| 6 | `sorobanDivisionData.ts` | بيانات التمارين + الربط | ✅ |
| 7 | `TwoAbacusSolver.tsx` | التمرين التفاعلي | ✅ |
| 8 | `Soroban2D5.tsx` | المعداد | 🟡 معدَّل (props جديدة) |
| 9 | `Rod2D5.tsx` | عمود واحد | 🟡 معدَّل (props جديدة) |

### 🆕 Props الجديدة في Soroban2D5

```tsx
// props اختيارية — default = undefined
rodTint?: 'red' | 'emerald' | 'white' | 'amber';
highlightColumns?: number[];
beamHighlight?: boolean;
hideTitle?: boolean;
activeRodIndex?: number;
```

⚠️ كلها اختيارية — لا تؤثر على الوضع الطبيعي.

---

4️⃣ آلية عمل الفلاش (FlashScreen)

🎬 مثال: 837 ÷ 3 (8 حركات)

# Badge المقسوم الناتج ملاحظة
s1 837 ÷ 3 837 🔴 0 إعداد
s2 8 ÷ 3 = 2 837 🔴 200 🟢 إضافة
s3 8 − 6 = 2 237 200 🔴 طرح
s4 23 ÷ 3 = 7 237 270 🟢 إضافة
s5 23 − 21 = 2 27 270 🔴 طرح
s6 27 ÷ 3 = 9 27 279 🟢 إضافة
s7 27 − 27 = 0 0 279 🔴 طرح
s8 ✅ الناتج = 279 0 279 نتيجة

🎮 تحكم المستخدم

· ▶️ ابدأ → user gesture · يُشغّل TTS
· ⏭ التالي → انتقال يدوي · لا auto-advance
· ⏮ السابق → رجوع
· 🔊 إعادة الصوت → يُعيد TTS للخطوة
· 🔄 إعادة → عند النهاية فقط

🔊 نظام الصوت

· TTS Rate: 0.7 (بطيء مفهوم)
· User gesture: ✅ مطلوب أول تشغيل
· onEnd: ✅ يُستخدم للتحقق
· Fallback: 10s (حالة نادرة)

---

5️⃣ آلية عمل التمرين (TwoAbacusSolver)

🖐️ نفس المسألة — 3 مراحل

المرحلة المقسوم الناتج التعليمات
1 837 → 237 0 → 200 8 ÷ 3
2 237 → 27 200 → 270 23 ÷ 3
3 27 → 0 270 → 279 27 ÷ 3

🔄 الفرق عن الفلاش

 الفلاش التمرين
الوحدات 8 حركات 3 مراحل
الطفل يشاهد يُنفّذ
التعديل تلقائي يدوي
التحقق لا ✅ زر
الانتقال يدوي يدوي

🎯 خطوات المرحلة الواحدة

1. الطفل يُعدّل المعدادين
2. يضغط 🔍 تحقق من الإجابة
3. النظام يقارن:
   · ✅ الاثنان صحيحان → "أحسنت" → زر "المرحلة التالية"
   · ⚠️ خطأ في الناتج → "معداد الناتج (🟢) غير صحيح"
   · ⚠️ خطأ في المقسوم → "معداد المقسوم (🔴) غير صحيح"
   · ⚠️ الاثنان → "المعدادان يحتاجان تعديلاً"
4. لا انتقال تلقائي — الطفل يقود

---

6️⃣ قاعدة تاكاشي كوجيما

📐 القاعدة الذهبية

أين يُوضع رقم الناتج؟

الحالة القاعدة مثال
المقسوم ≥ المقسوم عليه فاصل عمود 8 ÷ 3 → 2 في المئات
المقسوم < المقسوم عليه يأخذ رقمين 2 < 3 → نأخذ 23

🎯 تطبيق على 837 ÷ 3

المرحلة المقسوم الجزئي القاعدة العمود المُضيء
1 8 (≥ 3) مباشر المئات
2 23 (2 < 3) يأخذ رقمين العشرات
3 27 (2 < 3) يأخذ رقمين الآحاد

📝 معالجة الأصفار الوسطية

مثال: 525 ÷ 5

· المرحلة 1: 5 ÷ 5 = 1 → 100
· المرحلة 2: 2 < 5 → نضع 0 في العشرات ← مدموج في المرحلة 1
· المرحلة 3: 25 ÷ 5 = 5 → 105

القرار: دمج المرحلة الفارغة في السابقة — لا "خطوة تحقق بلا فعل".

---

7️⃣ نظام الألوان

🎨 الألوان المعتمدة

اللون الرمز الاستخدام النوع
أحمر 🔴 المقسوم (الباقي) خلفية الخرزات
أخضر 🟢 الناتج المتراكم خلفية الخرزات
أبيض ⚪ العمود المُعدَّل الآن حلقة نابضة
ذهبي 🟡 العمود في الأساسيات حلقة نابضة
برتقالي 🟠 highlightBeam (العارضة) وميض

🖌️ التنفيذ التقني

```tsx
// في Rod2D5.tsx
const beadFilter = getBeadFilter(tint);
// red → CSS filter
// emerald → CSS filter
// white → حلقة + نبض

// في Soroban2D5.tsx
<Rod2D5
  tint={isHighlighted ? 'white' : rodTint}
/>
```

⚠️ مهم: اللون يُطبَّق على الخرزات فقط — لا على الخلفية.

---

8️⃣ نظام الصوت TTS

🔊 التقنية

الملف: src/hooks/useSpeech.ts (موجود · يعمل)

```tsx
const { speak, stop, isSpeaking, isSupported } = useSpeech();
```

🎯 التطبيق في FlashScreen

```tsx
const tts = useSpeech();
const ttsRef = useRef(tts);  // ← مرجع ثابت

// قراءة الخطوة
const speakStep = (s) => {
  ttsRef.current.speak(s.ttsText, { rate: 0.7 });
};
```

🔑 دروس مستفادة

# المشكلة الحل
1 TTS لا يعمل في useEffect user gesture
2 الصوت يُقطع عند الانتقال onEnd + fallback 10s
3 تكرار القراءة ttsRef + token
4 Badge يظهر بعد TTS badge reveal 800ms/سطر

---

9️⃣ التنقل والربط

🎯 آلية التنقل

مبدأ: FlashListScreen يدير كل شيء داخلياً.

```tsx
type ActiveView =
  | { kind: 'flash'; lessonId: string }
  | { kind: 'practice'; problemId: string }
  | null;

const [active, setActive] = useState<ActiveView>(null);
```

🔗 جدول الربط

```ts
// في sorobanDivisionData.ts
export const LESSON_TO_PROBLEM: Record<string, string> = {
  'div-1x1-m1': 'prob_1',   // 837 ÷ 3
};

export function getProblemIdForLesson(lessonId: string): string | null {
  return LESSON_TO_PROBLEM[lessonId] ?? null;
}
```

🚫 ما لا يتغير

· ❌ App.tsx — لا تعديل
· ❌ HeroDashboard — لا تعديل (بلا زر إضافي)
· ❌ LessonScreen — لا تعديل

الزر يظهر تلقائياً في FlashListScreen إذا وُجد ربط.

---

🔟 بنية البيانات

📐 DivisionStep

```ts
interface DivisionStep {
  stepIndex: number;
  instructionTitle: string;      // "قسمة المئات (8 ÷ 3)"
  instructionDetail: string;     // الشرح الكامل
  expectedDividend: number;      // 237
  expectedResult: number;        // 200
  activeDividendRods: number[];  // [0] — الأعمدة المُضاءة
  activeResultRod: number;       // 0
}
```

📐 DivisionProblem

```ts
interface DivisionProblem {
  id: string;              // "prob_1"
  dividend: number;        // 837
  divisor: number;         // 3
  steps: DivisionStep[];
}
```

⚠️ فهارس الأعمدة

مهم جداً:

· 0 = مئات
· 1 = عشرات
· 2 = آحاد

مطابقة مع نظام Soroban2D5.

---

1️⃣1️⃣ ميثاق عدم اللمس

🔒 ممنوع تماماً

الملف السبب
useSorobanLogic.ts 🧠 منطق الخرزات — العمود الفقري
Bead2D5.tsx 🎨 رسم الخرزة
LessonScreen.tsx 📚 الدروس
PracticeScreen.tsx ✍️ التمارين
AnzanScreen.tsx 🧠 الأنزان
PlacementTestScreen.tsx 🎯 اختبار المستوى
RemediationScreen.tsx 🩺 العلاجي
SorobanPlayground.tsx 🎮 الوضع الحر

✅ المسموح

· Props جديدة اختيارية في Soroban2D5 و Rod2D5
· ملفات جديدة كلياً
· جدول الربط في sorobanDivisionData.ts

🛡️ ضمانات

· أي prop جديدة → default = undefined
· لا تُستدعى من الوضع الطبيعي
· اختبار إلزامي على 4 أوضاع بعد أي تعديل:
  · 🎮 Playground · 📚 درس · ✍️ تمرين · 🧠 أنزان

---

1️⃣2️⃣ التوسّع المستقبلي

📋 المسائل المُعدَّة (10 مسائل)

# المسألة القسمة على المراحل
prob_1 837 ÷ 3 3 3
prob_2 428 ÷ 2 2 3
prob_3 639 ÷ 3 3 3
prob_4 963 ÷ 3 3 3
prob_5 525 ÷ 5 5 2
prob_6 749 ÷ 7 7 2
prob_7 848 ÷ 4 4 3
prob_8 936 ÷ 3 3 3
prob_9 618 ÷ 2 2 2
prob_10 484 ÷ 4 4 3

🚀 خطوات التوسّع

1. إضافة مسائل جديدة → في divisionProblems
2. ربطها بفلاشات → في LESSON_TO_PROBLEM
3. القسمة على رقمين (S08) → بنية جديدة (رقم مضاعف)
4. الضرب → نفس النموذج مع تعديل:
   · المقسوم → المضروب (ثابت)
   · الناتج → التراكمي

🎯 أفكار مستقبلية (مؤجلة)

· 🅰️ الطرح المتسلسل (للقسمة على رقمين)
· 🅱️ Ghost Abacus (جسر نحو الأنزان)
· 🅲️ Adaptive Mastery (الانتقال التلقائي بين الأنماط)
· 🅳️ Anzan Metrics (قياس سرعة التفاعل)

---

1️⃣3️⃣ دروس مستفادة (FIXes)

🔴 مشاكل واجهناها وحلولها

# المشكلة الحل الملف
1 TTS لا يعمل في useEffect user gesture + زر "ابدأ" FlashScreen
2 الصوت يُقطع قبل اكتماله onEnd + fallback 10s FlashScreen
3 tts في deps → re-runs ttsRef ثابت FlashScreen
4 Badge يُقطع من الأعلى mx-auto بدل absolute MentalBadge
5 ألوان تغطي الخلفية CSS filter على الخرزات فقط Rod2D5
6 حلقة على كل عمود حلقة فقط عند tint='white' Rod2D5
7 border على كل عمود ملون إزالة border · إبقاء overlay Rod2D5
8 electric-500 غير موجود استبدال بـ violet-700 FlashListScreen

🎓 قواعد ذهبية

1. ttsRef — مرجع ثابت للـ useSpeech
2. onEnd — لا انتقال بدون انتهاء الصوت
3. user gesture — أول تشغيل TTS يحتاج زر
4. default undefined — كل prop جديدة اختيارية
5. one source of truth — مصدر واحد للصوت (handler)

---

📊 حالة النظام الشاملة

النظام الحالة
🎬 الفلاشات (Flash) ✅ يعمل
🖐️ التمرين (TwoAbacus) ✅ يعمل
🔊 TTS ✅ يعمل (user gesture)
🎨 الألوان ✅ دقيقة
🔗 الربط ✅ تلقائي
📚 باقي التطبيق ✅ لا تأثير

---

🎯 الخطوة التالية

للمساعد القادم:

1. اقرأ هذا الملف كاملاً — يفهم البنية في 10 دقائق
2. لا تلمس الملفات المحمية
3. لإضافة فلاش جديد:
   · أضف FlashLesson في flashData.ts
   · أضف DivisionProblem في sorobanDivisionData.ts
   · اربطهما في LESSON_TO_PROBLEM
4. لإضافة مسألة قسمة:
   · أضف خطوة في divisionProblems
   · لا حاجة لتعديل أي مكون

---

آخر تحديث: 2026-10-10 (المسائية)
الحالة: 🟢 البناء أخضر · L0-L3 مكتملة · ~97%
المرجع: RESCUE.md + AL-ISLAH-V2.md + هذا التحديث

```