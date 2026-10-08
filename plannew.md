 RESCUE.md.

---

📋 تحديث RESCUE.md — جلسة 2026-10-08 (المسائية)

🎯 ما أُنجز في هذه الجلسة (3 ملفات · 14 تعديل)

1️⃣ GuardianDashboard.tsx — 7 تعديلات

# التعديل الحالة
1 effectiveCompletedLevels — مستخلص من 3 مصفوفات (تمرّن + بصري + سمعي) ✅
2 levelBadges — تُفتح عند 3 مراحل ناجحة (بدل completedLevels الميتة) ✅
3 levelNodes (خارطة) — تتقدم تلقائيًا ✅
4 "X/8 مكتمل" — يعرض عددًا حقيقيًا ✅
5 بصري: master_mixed → master_chains (🔗 خبير سلاسل) ✅
6 سمعي: إضافة master_chains_audio (🎤 خبير سلاسل سماعي) ✅
7 بطاقة "أسطورة السوروبان" — ذهبية فاخرة عند 8/8 ✅
8 LevelNodeButton: "متاح" / "مكتمل" بدل "100 XP" المضلّلة ✅

2️⃣ AnzanScreen.tsx — 3 تعديلات

# التعديل الحالة
Fix 2 getAnzanBadgeKey: S11/S12 → null ✅
Fix 3 levelNum حقيقي مُمرَّر لـ AdaptiveFeedback (بدل 0) ✅
Fix 4 حذف master_mixed من ANZAN_BADGE_LABELS ✅

3️⃣ AudioAnzanScreen.tsx — 4 تعديلات

# التعديل الحالة
Fix 1 getAudioAnzanBadgeKey — إصلاح الخريطة الخاطئة (كانت: S05/S06 → جمع · أصبحت: ضرب) ✅
Fix 2 إضافة master_chains_audio لـ S09/S10 ✅
Fix 3 levelNum حقيقي مُمرَّر لـ AdaptiveFeedback ✅
Fix 4 إضافة master_chains_audio لـ AUDIO_BADGE_LABELS ✅

---

🚨 اكتشافات جديدة (موثّقة لأول مرة)

🔴 #1 — completedLevels ميتة

المشكلة: markLevelComplete يُستدعى من LevelTestScreen فقط — وهي شاشة معزولة في التدفق الحالي. النتيجة: completedLevels فارغة دائمًا · كل ما يعتمد عليها (شارات المستوى · الخارطة · عدّاد "X/8") معطّل.

الإصلاح: effectiveCompletedLevels مشتقة من passedPractice + passedAnzanVisual + passedAnzanAudio.

🔴 #2 — getAudioAnzanBadgeKey كانت خاطئة بالكامل

المشكلة: الخريطة القديمة مبنية على منهاج قديم:

· S05/S06 → جمع (خطأ · هي ضرب)
· S07/S08 → ضرب (خطأ · هي قسمة)
· S09/S10 → قسمة (خطأ · هي سلاسل)

الإصلاح: خريطة جديدة صحيحة تتوافق مع المنهاج الرسمي.

🔴 #3 — useQuests.ts يقرأ من مفاتيح ميتة

المشكلة: يقرأ من 4 مفاتيح لا كاتب لها:

· soroban_anzan_stats ⚫
· soroban_practice_stats ⚫
· sorobanmind-stats ⚫ (مهجور)
· soroban_completed_lessons 🟡 (نادر)

النتيجة: المغامرات النشطة = 0/target للأبد.

الإصلاح: إعادة كتابة useQuests ليقرأ من progressStore مباشرة (مؤجل).

🔴 #4 — BADGES-8 ميت 100%

المشكلة: سلسلة كاملة ميتة — badgeChecker.ts يقرأ مفاتيح لا كاتب لها · getAllEarnedBadges() تُبنى ولا تُعرض · BadgeModal.tsx مكوّن معزول.

القرار: مؤجل — لن نُحييه (سيُكرر الأنظمة الموجودة) · ولن نحذفه الآن (يحتاج جلسة نظيفة).

---

✅ ما تبقّى في الخطة (أولويات)

أولوية 1 — إصلاحات صغيرة ⏳ (جلسة واحدة)

· ✅ ~~Fix 1 (AnzanScreen)~~ — مُنجز
· ✅ ~~Fix 2 (AnzanScreen)~~ — مُنجز
· ✅ ~~Fix 3 (AnzanScreen + AudioAnzanScreen)~~ — مُنجز

أولوية 2 — ✅ مُنجز (GuardianDashboard + ZIP)

أولوية 3 — useQuests.ts — إعادة الكتابة 🟡 جديدة

المهمة: إعادة كتابة useQuests ليقرأ من progressStore مباشرة.

المطلوب:

· قراءة passedPractice (لمغامرة "التدريب اليومي")
· قراءة passedAnzanVisual (لمغامرة "متدرب الأنزان")
· قراءة currentStreak (لمغامرة "سلسلة مثالية")
· قراءة masteryBadges (لمغامرات الجمع/الطرح/الضرب/القسمة)

التقدير: 30-60 دقيقة · ملف واحد (useQuests.ts) · + تحديث data/index.ts (نوع Quest.type).

أولوية 4 — دروس L2-L7 (بناء محتوى · أسابيع)

· L2 → S05 · S06 (ضرب)
· L3 → S07 · S08 (قسمة)
· L4 → S09 · S10 (سلاسل)
· L5 → S11 · S12 (متقدم)
· L6 → S13 · S14 (عشري)
· L7 → S15 (جذور)

أولوية 5 — P6 · تصنيف 35 مفتاح localStorage

المهمة: جدول تحليلي (بلا كود): canonical · legacy · orphan.

التقدير: 1-2 ساعة · لا كود.

أولوية 6 — P9 · ترحيل adaptiveEngine

مؤجل — adaptiveEngine صفر مستهلك حالي.

---

📊 حالة الأنظمة (محدثة)

النظام المفتاح الحالة قبل الحالة بعد
شارات إتقان المهارة soroban_mastery_badges ✅ ✅
شارات بصري sorobanmind-v2-progress (anzanBadges) ✅ ✅ + master_chains
شارات سمعي sorobanmind-v2-progress (anzanAudioBadges) 🟡 ✅ + master_chains_audio
شارات المستوى مشتقة (3 مصفوفات) 🔴 ميت ✅ يعمل
أسطورة السوروبان مشتقة (8/8) — ✅ جديدة
خارطة المستويات مشتقة 🔴 ميت ✅ يعمل
BADGES-8 متعدد ⚫ ميت ⚫ ميت (قرار)
المغامرات useQuests 🟡 ⏳ مؤجل

---

🗺️ المنهاج الرسمي (تذكير · لا يتغير)

المستوى الأقسام الفئة
L0 intro · S01 · S02 🧒
L1 S03 · S04 🧒
L2 S05 · S06 🧒
L3 S07 · S08 🧒
L4 S09 · S10 🧑
L5 S11 · S12 🧑
L6 S13 · S14 🧑
L7 S15 🧑

⚠️ قاعدة: S03/S04 = جمع · S05/S06 = ضرب · S07/S08 = قسمة · S09/S10 = سلاسل · S11+ = متقدم.

---

🎯 القرارات المؤكدة (محدثة)

قرارات سابقة (لا تُناقش):

· ❌ تفريق skillId بـ PHASE
· ❌ recordAttempt في CE/PT
· ❌ IndexedDB · Backend · Cloud
· ❌ حذف progressStore.ts
· ❌ master_mixed (بقايا منهاج قديم)
· ❌ إحياء BADGES-8

قرارات جديدة (هذه الجلسة):

· ✅ حذف master_mixed من كل مكان (بصري + سمعي + عرض + منطق)
· ✅ "اجتياز المستوى" = 3 مراحل (تمرّن + بصري + سمعي · 70%+)
· ✅ شارة "أسطورة السوروبان" = بطاقة ذهبية فاخرة عند 8/8
· ✅ LevelNodeButton = "متاح" / "مكتمل" (بدل XP المضلّل)
· ✅ الملفات المُصلَحة = GuardianDashboard · AnzanScreen · AudioAnzanScreen

---

🚀 الخطوة التالية (اقتراح)

الجلسة القادمة — اختر واحدة:

الخيار الوصف التقدير
(أ) useQuests.ts — إعادة الكتابة (المغامرات) 30-60 دقيقة
(ب) P6 — تصنيف 35 مفتاح localStorage 1-2 ساعة
(ج) اختبار شامل — مراجعة سلوك التطبيق بعد الرفع 15 دقيقة