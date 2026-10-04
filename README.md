## 🧠 هندسة التعليم التكيفي وانتقال البنوك

SorobanMind v2 يستخدم حاليًا **مرحلة انتقال هندسية مقصودة** بين نظام الأسئلة القديم والنظام الموحد الجديد SRB.

### البنوك القديمة ليست جزءًا من المسار الرئيسي

توجد حاليًا البنوك التالية:

```text
src/data/bank-raw/
src/data/bank-v2/
src/data/bank-linked.ts
هذه البنوك أُنشئت أصلًا وفق بنية منهجية أقدم كانت تعتمد على 20 درسًا.
أما المنهج الحالي لـ SorobanMind v2 فقد أعيد تنظيمه وأصبح:
8 مستويات
15 درسًا
51 مهارة
لذلك لن يتم ربط البنوك القديمة مباشرة بالمسار التعليمي الرئيسي الحالي.
🛡️ العزل الانتقالي
البنوك القديمة معزولة حاليًا داخل طبقة التقييم التكيفي الانتقالية:
bank-raw
     ↓
bank-v2
     ↓
bank-linked
     ↓
adaptiveEngine
problemGenerator
بينما المسار الرئيسي الجديد يعمل عبر:
SRB
 ↓
srb-adapter
 ↓
Practice / Anzan / Audio / Level Test
هذا العزل مقصود وليس خللًا معماريًا.
والهدف منه:
حماية المسار التعليمي الجديد من اختلاف تصنيفات البنوك القديمة.
السماح بإعادة تصنيف الأسئلة القديمة وفق المنهج الحالي.
نقل الأسئلة تدريجيًا إلى SRB.
اختبار جودة التصنيف قبل حذف المصدر القديم.
منع تلوث بنك SRB الجديد بأسئلة لم تتم مراجعة تصنيفها.
مهم: adaptiveEngine.ts وproblemGenerator.ts ليسا ملفات ميتة. إنهما حوضان انتقاليان معزولان، وسيتم نقلهما وربطهما بالـSRB بعد اكتمال إعادة تصنيف البيانات.
🎯 الخطة المعتمدة لإعادة بناء التعليم التكيفي
لا يتم حذف أو إعادة كتابة المحرك التكيفي دفعة واحدة.
يتم التنفيذ على مراحل:
المرحلة 1 — تثبيت المنهج الحالي
المرجع الوحيد للمنهج الجديد:
L0 → L7
15 درسًا
51 مهارة
وتصبح جميع التصنيفات الجديدة مبنية على:
Level
Lesson
Skill
Movement
Difficulty
Phase
Target Time
ولا يتم استخدام بنية الـ20 درسًا القديمة في تحديد تقدم الطالب.
المرحلة 2 — توحيد بنك SRB
SRB هو البنك الرئيسي الجديد.
ويستخدم في:
Practice
ANZ-V Normal
ANZ-F Flash
ANZ-A Audio
X Level Test
CE Section Exam
PT Placement Test
Remediation
ويصبح معرف السؤال الموحد:
SRB-L{level}-S{lesson}-m{skill}-{variant}{number}
المرحلة 3 — نقل البنوك القديمة
لا يتم نقل الأسئلة القديمة بصورة آلية فقط.
كل سؤال قديم يخضع لإعادة تصنيف:
Old Question
    ↓
Level
    ↓
Lesson
    ↓
Skill
    ↓
Movement
    ↓
Difficulty
    ↓
Phase
    ↓
Target Time
    ↓
SRB
والأسئلة التي لا تتوافق مع المنهج الحالي يتم:
استبعادها
أو الاحتفاظ بها مؤقتًا للمراجعة.
المرحلة 4 — نقل المحرك التكيفي
بعد استقرار SRB:
adaptiveEngine
problemGenerator
masteryTracker
يتم نقلها تدريجيًا من:
bank-linked
إلى:
srb-adapter
مع الحفاظ على منطقها الرياضي والتكيفي وعدم إعادة كتابته دون سبب.
الهدف:
SRB
 ↓
problemGenerator
 ↓
adaptiveEngine
 ↓
masteryTracker
 ↓
progressStore
📊 نموذج التقييم الموحد
كل محاولة للطالب يجب أن تنتج سجل أداء موحدًا يحتوي على:
Level
Lesson
Skill
Movement
Difficulty
Phase
Question ID
Correct / Wrong
Answer
Time
Target Time
Consecutive Correct
Error Type
Timestamp
ثم يتم تحديث:
Skill Mastery
Accuracy
Average Time
Consecutive Correct
Weakness
Mastery Status
وبذلك يصبح التكييف قائمًا على أداء الطالب الفعلي وليس على نتيجة جلسة منفردة فقط.
🩺 نظام العلاج Remediation
عند اكتشاف ضعف:
Performance
     ↓
Skill Analysis
     ↓
Weak Skill
     ↓
Targeted Remediation
     ↓
Reassessment
     ↓
Mastery Check
ولا تعتبر المهارة متقنة لمجرد إنهاء جلسة علاجية.
يجب إعادة قياس:
Accuracy
Speed
Consecutive Correct
قبل إزالة حالة الضعف.
🧪 نظام التقييم الكامل
المسار التعليمي المستهدف لكل مستوى:
📖 تعلّم
   ↓
✏️ تمرّن
   ≥ 70%
   ↓
🧠 أنزان بصري عادي
   ≥ 70%
   ↓
⚡ Flash Anzan
   ≥ 70%
   ↓
🎧 أنزان سمعي
   ≥ 70%
   ↓
🎓 اختبار المستوى
   ≥ 80%
   ↓
📊 النتيجة التراكمية
   ↓
🏅 الشهادة
   ↓
📖 المستوى التالي
العلامة التراكمية
النتيجة النهائية =
    70% × اختبار المستوى
  + 10% × التمرّن
  +  5% × أنزان بصري عادي
  +  5% × Flash Anzan
  + 10% × أنزان سمعي
مجموع الأوزان:
100%
ولا يتم اعتماد النتيجة النهائية إلا بعد تحقق شروط النجاح الخاصة بكل مرحلة.
🧭 تحديد المستوى Placement Test
تحديد المستوى ليس امتحان نجاح/رسوب عاديًا.
هدفه:
تقدير مستوى الطالب
      +
تحديد المهارات المتقنة
      +
تحديد المهارات الضعيفة
      +
تحديد نقطة البداية المناسبة
وسيتم نقله تدريجيًا من البنوك القديمة إلى:
SRB / PT
بعد إعادة تصنيف بنك تحديد المستوى وفق منهج الـ15 درسًا الحالي.
🏆 امتحانات الأقسام
بعد اكتمال SRB:
CE1
CE2
سيتم بناؤهما داخل:
src/data/srb/exams/
وتصبح الامتحانات معتمدة على نفس تصنيف SRB المستخدم في التعليم والتقييم التكيفي.
👨‍👩‍👧 لوحة ولي الأمر
الهدف النهائي من Dashboard ليس عرض XP فقط.
بل إنشاء ملف تعليمي متكامل للطالب يعرض:
📚 تقدم المنهج
🎯 إتقان كل مهارة
📈 الدقة
⏱️ السرعة
🧠 التصور البصري
⚡ Flash Anzan
🎧 الأداء السمعي
🩺 المهارات الضعيفة
🔄 الجلسات العلاجية
🏆 الشارات
🎓 الاختبارات
📜 الشهادات
📊 تطور الأداء مع الزمن
ويجب أن تعتمد جميع هذه البيانات على مصدر تقدم موحد.
💾 مصدر بيانات الطالب
الهدف المعماري:
                ┌──────────────┐
                │     SRB      │
                │ Unified Bank │
                └──────┬───────┘
                       ↓
              ┌─────────────────┐
              │ Question Engine │
              └────────┬────────┘
                       ↓
       ┌────────────────────────────┐
       │ Practice / Anzan / Tests   │
       └─────────────┬──────────────┘
                     ↓
              ┌──────────────┐
              │ Attempt Log  │
              └──────┬───────┘
                     ↓
            ┌─────────────────┐
            │ Mastery Tracker │
            └────────┬────────┘
                     ↓
            ┌─────────────────┐
            │ Adaptive Engine │
            └────────┬────────┘
                     ↓
              ┌────────────┐
              │ progressStore │
              └──────┬─────┘
                     ↓
             Guardian Dashboard
أما البنوك القديمة فتبقى مؤقتًا خارج هذا المسار:
bank-raw
bank-v2
bank-linked
       ↓
Adaptive Migration Pool
       ↓
إعادة التصنيف
       ↓
SRB
       ↓
بعد اكتمال النقل → حذفها
🌐 الترجمة
التطبيق يعمل على بنية ثنائية اللغة:
العربية ← اللغة الأساسية
English ← اللغة الثانية
ويتم حاليًا نقل الدروس تدريجيًا إلى:
LocalizableText
بحيث لا تكون الترجمة طبقة تجميلية، وإنما جزءًا من نموذج المحتوى نفسه.
الهدف:
Lesson
 ├── Arabic Content
 └── English Content
مع الحفاظ على:
RTL للعربية
LTR للإنجليزية
ودعم النصوص، العناوين، التعليمات، الخيارات، التلميحات، القصص، ورسائل التقييم.
🏗️ خطة الإصلاح والتنفيذ المعتمدة
P0 — تثبيت الأساس
1. تثبيت منهج 15 درسًا.
2. تثبيت 51 مهارة.
3. تثبيت أنواع الحركات.
4. تثبيت تصنيف SRB.
5. عدم حذف البنوك القديمة.
6. إبقاء adaptiveEngine وproblemGenerator معزولين.
P1 — توحيد بيانات الأداء
1. توحيد Attempt Record.
2. ربط Practice.
3. ربط Normal Anzan.
4. ربط Flash Anzan.
5. ربط Audio Anzan.
6. ربط Level Test.
7. تحديث masteryTracker.
8. حفظ الأداء في progressStore.
P2 — نقل التكييف
1. تكييف problemGenerator مع SRB.
2. تكييف adaptiveEngine مع SRB.
3. ربط masteryTracker.
4. اختيار الأسئلة بناءً على نقاط الضعف.
5. إدخال الحركة Difficulty وTarget Time.
6. منع تكرار السؤال داخل الجلسة.
P3 — العلاج
1. اكتشاف الضعف.
2. إنشاء جلسة علاج مستهدفة.
3. تسجيل جميع المحاولات.
4. إعادة التقييم.
5. إثبات Mastery.
6. إعادة العلاج عند عدم تحقق الإتقان.
P4 — الاختبارات
1. SRB-X لاختبار المستوى.
2. SRB-PT لتحديد المستوى.
3. SRB-CE1 لامتحان القسم الأول.
4. SRB-CE2 لامتحان القسم الثاني.
5. توحيد النتائج مع progressStore.
P5 — المنهج
L0 → L7
15 درسًا
51 مهارة

L0-L1
مكتملان ويستمران في الاختبار والتحسين.

L2-L7
يتم بناء الدروس تدريجيًا مع الحفاظ على تصنيف SRB.
P6 — الترجمة
Arabic
English

LocalizableText
     ↓
Lessons
     ↓
Practice
     ↓
Anzan
     ↓
Tests
     ↓
Certificates
P7 — الشهادات ولوحة ولي الأمر
Final Score
     ↓
Certificate
     ↓
Guardian Dashboard
     ↓
Educational Profile
P8 — الهجرة النهائية والتنظيف
بعد التأكد من أن:
SRB
+
Adaptive Engine
+
Mastery Tracker
+
Placement
+
Section Exams
+
Remediation
+
Guardian Dashboard
تعمل بصورة كاملة:
bank-raw
bank-v2
bank-linked
يتم حذفها نهائيًا.
لا يتم حذف أي بنك قديم قبل اكتمال النقل واختبار البديل.
🗺️ خارطة الطريق الحالية
المرحلة
المهمة
الحالة
1
البنية الأساسية + SRB
✅
2
SRB L0-L7
✅
3
منهج 15 درسًا
🟡
4
L0-L1
🟢
5
L2-L7
🟡
6
الترجمة العربية/الإنجليزية
🟡
7
توحيد سجل الأداء
⏳
8
نقل Adaptive Engine إلى SRB
⏳
9
Mastery Tracker
⏳
10
Remediation التكيفي
⏳
11
SRB Level Tests
⏳
12
SRB Placement Test
⏳
13
SRB Section Exams
⏳
14
الشهادات
🟡
15
Guardian Educational Profile
⏳
16
اختبار شامل + Regression Tests
⏳
17
حذف البنوك القديمة بعد نجاح النقل
⏳
18
PWA
⏳
19
APK
⏳
⚠️ قاعدة هندسية أساسية
لا نحذف القديم قبل نجاح البديل.
لا نربط القديم بالمسار الرئيسي أثناء النقل.
لا نعيد كتابة المحرك التكيفي دون حاجة.
لا نعتبر المهارة متقنة بمجرد إنهاء جلسة.
ولا نعتبر README مصدرًا لحالة التطبيق؛ الكود الفعلي هو المرجع.
📁 البنية المستهدفة
src/
├── App.tsx
├── i18n/
│   ├── ar.ts
│   └── en.ts
│
├── curriculum/
│   ├── types.ts
│   └── lessons/
│       ├── L0/
│       ├── L1/
│       ├── L2/
│       ├── L3/
│       ├── L4/
│       ├── L5/
│       ├── L6/
│       └── L7/
│
├── engine/
│   ├── sorobanEngine.ts
│   ├── sorobanMoves.ts
│   ├── masteryTracker.ts
│   ├── problemGenerator.ts
│   └── adaptiveEngine.ts
│
├── data/
│   ├── srb/
│   │   ├── questions/
│   │   ├── exams/
│   │   ├── progress.ts
│   │   ├── remediation.ts
│   │   └── sessionBuilder.ts
│   │
│   ├── srb-adapter.ts
│   │
│   └── legacy/
│       ├── bank-raw/
│       └── bank-v2/
│
├── store/
│   └── progressStore.ts
│
├── screens/
├── components/
├── hooks/
└── utils/
legacy/ هنا تمثل مرحلة انتقالية فقط؛ وعند اكتمال نقل وتصديق جميع البيانات يتم حذفها.
🎯 الهدف النهائي
منهج ياباني أصيل
       ↓
15 درسًا / 51 مهارة
       ↓
SRB موحد
       ↓
Practice + Visual Anzan + Flash + Audio
       ↓
سجل أداء موحد
       ↓
Mastery Tracker
       ↓
Adaptive Engine
       ↓
Remediation
       ↓
Level Test
       ↓
Section Exam
       ↓
Certificate
       ↓
Guardian Educational Profile
هذا هو مسار الإصلاح المعتمد؛ ولا ينبغي تنفيذ مرحلة لاحقة قبل نجاح المرحلة التي قبلها.
📜 المصادر
Takashi Kojima — The Japanese Abacus: Its Use and Theory
Japan Soroban Association
منهج SorobanMind الحالي — 8 مستويات / 15 درسًا / 51 مهارة
👨‍💻 المطوّر
مصطفى علي أكر (@mezo2021)
�

🧮 SorobanMind v2
أكاديمية السوروبان الدولية
صُنع لتقديم تعليم السوروبان الياباني بصورة تفاعلية وتكيفية باللغة العربية والإنجليزية 🌍
�
```
ملاحظة مهمة: البنوك القديمة ليست "ميتة"، والمحرك التكيفي ليس "ميتًا"؛ كلاهما في طبقة انتقال معزولة إلى حين اكتمال نقل وتصنيف البيانات إلى SRB ذي الـ15 درسًا.