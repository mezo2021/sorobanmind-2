📋 docs/PLAN_v3_STATUS.md

حالة PLAN_v3 — الفروق والربط مع الخطة الحالية

آخر تحديث: 2026-10-14
الغرض: توثيق الفروق بين PLAN_v3 (2026-10-07) والخطة الحالية (REPAIR_PLAN_INTEGRATED 2026-10-14)
المصادر: ACHIEVEMENTS.md · STATE_OF_THE_PROJECT.md · audit-v8 · audit-v9
القاعدة: الفروق موثقة بأدلة · لا تخمين

---

1. بطاقة PLAN_v3 الأصلية

البند القيمة
التاريخ 2026-10-07
المصدر ACHIEVEMENTS.md · PROJECT_MASTER.md
الأساس تقرير v5
الحالة المُعلنة 92% مكتمل
المراحل P1 → P16
الأولوية الأولى P9 (ربط adaptiveEngine)

---

2. خريطة P1-P16 → الخطوة الحالية

المرحلة PLAN_v3 يقول الحالة الفعلية (2026-10-14) في خطتنا؟
P1 تثبيت نموذج البيانات ✅ مكتمل —
P2 Badge Registry ⏸️ لاحقًا P3 (مدمج)
P3 ربط BADGES الـ8 ⏸️ لاحقًا P3
P4 توحيد Anzan Badges ⏸️ لاحقًا P3
P5 إغلاق mastery duplication ⏸️ «لا تكرار فعلي» P3
P6 تصنيف 35 مفتاح ⏸️ لاحقًا ✅ P0 أنجزه
P7 recordAttempt في CE · PT ⏳ P7
P8 ربط masteryTracker ⏳ تلقائي P3 (مدمج)
P9 نقل adaptiveEngine إلى SRB ⏳ أولوية 1 🟡 تعارض
P10 اختبار Adaptive ⏳ ⏸️ لاحقًا
P11-P16 Badges UI · i18n · Export · Audit ⏸️ P8 · P10

---

3. الفروق الجوهرية منذ 7 أكتوبر

3.1 🟢 ما تقدّم

البند PLAN_v3 (7 أكتوبر) اليوم (14 أكتوبر)
i18n 65% · بلا زر ✅ زر 🌐 · pickLang.ts · Header مربوط
الترجمة الفعلية لم تبدأ ✅ LessonScreen يستخدم useT
P6 (المفاتيح) لاحقًا ✅ منجز في P0
F12 (تصادم WEAK_KEY) غير معروف ✅ لا تصادم
الملفات المحمية غير موثقة ✅ 15 ملفًا محددًا

3.2 🔴 ما تغيّر أو صُحّح

البند PLAN_v3 قال الحقيقة
أسطر الكود 51,500 68,209
الكود الميت ~2,176 سطرًا 9,600 سطرًا (35 ملفًا)
المفاتيح اليتيمة 5 6
adaptiveEngine «يُرحّل» معزول تمامًا — v9 مؤكد
srb-adapter «3 دوال معطوبة» لم تُحدَّد — يحتاج اختبارات
useTranslation «يُستورد فقط من Debug» حيّ في LessonScreen + Header

---

4. 🔴 التعارض: P9 (adaptiveEngine)

PLAN_v3 قال:

P9 — نقل adaptiveEngine إلى SRB · الأولوية 1 · ساعة.

الحقيقة (v9):

· adaptiveEngine.ts — ❌ لا مستورد خارجي.
· problemGenerator.ts — ❌ لا مستورد.
· masteryTracker.ts — يُستورد فقط من adaptiveEngine.
· حلقة مغلقة: bank-raw → bank-v2 → bank-linked → engine.

السؤال الحقيقي:

هل نُفعّل adaptiveEngine أم نُجمّده؟

الجانب ربطه بـSRB تجميده
الفائدة تكيف تعليمي حقيقي استقرار · بلا خطر
الخطر كسر CE · PT · Lessons صفر
الوقت ساعة + اختبارات صفر
الأدلة لا أحد يستورده v9 مؤكد
الحالة الحالية معزول يعمل بلا مشاكل

القرار الموصى به:

تجميد آمن الآن · قرار منفصل للإعادة.

الأسباب:

1. v9 أثبت العزل القاطع.
2. ربطه = إضافة كود · خطر.
3. تجميده = لا فعل · لا خطر.
4. يمكن ربطه لاحقًا بعد إنجاز P3 (F1-F4).
5. ADR موثق يحفظ القرار.

الإجراء: يُنشأ docs/decisions/ADR-engine-status.md.

---

5. الربط مع الخطة الحالية (REPAIR_PLAN_INTEGRATED)

ما يتوافق تمامًا

PLAN_v3 REPAIR_PLAN_INTEGRATED
P6 (تصنيف المفاتيح) P0 ✅
P7 (recordAttempt في CE · PT) P7
P8 (masteryTracker) P3
P11 (Badges UI) P3
P13-P14 (i18n) P10

ما يختلف

البند PLAN_v3 REPAIR_PLAN_INTEGRATED
P9 ربط adaptiveEngine تجميد + ADR
ترتيب البداية P9 (ربط المحرك) P3 (إصلاح F1-F4)
حذف الكود الميت P16 (أخيرًا) P2 (مبكرًا)
الترجمة P13-P14 P10 (اختياري)

---

6. ما يستحق الاحتفاظ من PLAN_v3

# العنصر السبب
1 16 قاعدة ذهبية مبادئ التطوير
2 سجل الجلسات خريطة تاريخية
3 Bank A vs B (فلسفة) توثيق معماري
4 توزيع Bank B جدول دقيق
5 جدول تطور النسبة قياس التقدم

---

7. ما يحتاج تحديثًا في الوثائق

الوثيقة التحديث
PROJECT_MASTER.md 119 ملفًا → 168+ · 51K → 68K سطرًا
AL-ISLAH-V2.md 5 يتيمة → 6 · 2,176 → 9,600 سطر ميت
ACHIEVEMENTS.md إضافة جلسات 25-26 (14 أكتوبر)
PLAN_v3.md ترقيم P9 (تجميد لا ربط)

---

8. الحقائق المحدّثة

# الحقيقة المصدر
1 Bank A = 275 سؤالًا v8 · مؤكد
2 Bank B = 666 سؤالًا v8 · مؤكد
3 الكود الميت = 9,600 سطرًا Claude reachability
4 المفاتيح اليتيمة = 6 v9
5 adaptiveEngine = معزول v9
6 useTranslation = حيّ v9
7 numberStyle = 3 مصادر v9
8 لا Lockfile v9
9 لا typecheck script v9
10 0 اختبارات v9

---

9. الأولويات الفورية (14 أكتوبر)

# المهمة الأولوية المصدر
1 إصلاح F1-F4 (لوحة ولي الأمر) 🔴 Claude
2 حذف الكود الميت (35 ملفًا) 🟠 Claude
3 إكمال i18n 🟠 PLAN_v3
4 F10 (مصدر واحد للدروس) 🟠 Claude
5 recordAttempt في CE · PT 🟡 PLAN_v3 P7
6 تجميد adaptiveEngine 🟡 Claude + ADR
7 حذف الملفات الميتة (4 ملفات) 🟢 P0

---

10. الخلاصة في 3 أسطر

1. PLAN_v3 بني على v5 — أرقامه تحتاج تحديثًا.
2. P9 تغيّر — من «ربط» إلى «تجميد + ADR».
3. الأولويات تغيّرت — F1-F4 أولًا لا P9.

---

آخر تحديث: 2026-10-14
المرجع: REPAIR_PLAN_INTEGRATED.md
الحالة: وثيقة حالة مؤقتة · تُراجع بعد P3

---

📌 المهمة الآن

أنشئ الملف في GitHub:

```
1. github.com/mezo2021/sorobanmind-2
2. Add file ▼ → Create new file
3. الاسم: docs/PLAN_v3_STATUS.md
4. الصق المحتوى
5. Commit changes
```

هذا الملف سيصبح مرجعًا عند أي التباس بين الخطتين. 🌹