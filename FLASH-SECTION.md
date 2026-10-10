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
الحالة: 🟢 البناء أخضر · الفلاش يعمل · التمرين يعمل
المرجع: RESCUE.md + هذا الملف

```