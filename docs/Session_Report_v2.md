📘 وثيقة الحالة الشاملة — SorobanMind-2

تاريخ الإغلاق: 14 نوفمبر 2026
الإصدار: v4.0 (React + SQL مكتملان)

---

🎯 الجزء الأول: ملخص تنفيذي

ما بدأنا به:

تطبيق React + Supabase لتعليم السوروبان، بحسابين تجريبيين، بأسماء أطفال حقيقية محفوظة في السحابة، بدون دعم نظام الشخصيات (100 Avatar)، وبثغرات في عزل Local/Cloud.

ما انتهينا إليه:

· ✅ هوية موحدة (100 شخصية) بدون أسماء حقيقية.
· ✅ عزل كامل بين Local/Cloud في كل المتاجر.
· ✅ قاعدة بيانات Supabase جديدة (avatar_id, sequential_number, RLS, v2 functions).
· ✅ لوحات شرف متوافقة مع النظام الجديد (أشباح + إيموجي + #seq).
· ✅ نظام موافقة صريح على الظهور (Toggle في ProfileScreen).
· ✅ Build ناجح.

---

📂 الجزء الثاني: React/UI — التفاصيل الدقيقة

🔐 1. طبقة الحماية (Guardian)

☑ LocalPinGuard.tsx — حارس محلي بثلاث طبقات

· ما تم: PIN 4 أرقام + رمز استرداد 8 أرقام + رمز طوارئ ثابت 19871987.
· الحماية: عدادات محاولات منفصلة (3 محاولات → قفل 5 دقائق).
· لماذا: يمنع الطفل من الوصول إلى لوحة ولي الأمر في الوضع المحلي.

☑ App.tsx — ربط الحارس

· ما تم: handleGuardianBack يُعيد القفل عند الخروج. onParentClick يفتح LocalPinGuard في المحلي.
· لماذا: أمان بلا اختراق برمجي.

☑ GuardianDashboard.tsx — تصفير آمن ونسخ احتياطي

· handleReset mode-aware: يعمل في Local فقط، يحظر Cloud (حتى SQL).
· localProgressKeys: يحذف مفاتيح التقدم فقط (XP، درجات، شهادات، Placement).
· isSafeToExport: قائمة بيضاء صارمة (يمنع sb-*، soroban_parent_*).
· sanitizeProgressSnapshot: يزيل childName/parentName من JSON.
· handleBackup + handleRestore: مع Rollback وconfirm.
· لماذا: منع تسريب جلسة أو اسم حقيقي عبر Backup.

---

🎭 2. نظام الهوية (Avatars)

☑ avatars.ts — 100 شخصية

· ما تم: 30 حيوان + 30 بطل + 20 فضاء + 20 أسطورة.
· getAvatarDisplayName: يقبل sequentialNumber اختيارياً (لدعم المحلي).
· id فريد لكل شخصية (مثل rabbit_fast).

☑ resolveDisplayName.ts — دالة موحدة

· المنطق: بحث أولاً في heroNames (قديم) → ثم avatars (جديد) → ثم ''.
· لماذا: توافق مع بيانات قديمة + دعم شخصيات جديدة.

☑ AppGate.tsx — بوابة دخول موحدة

· hasHero: يتحقق من soroban_hero_key فقط.
· handleHeroSave: يحفظ محلياً فقط (Cloud sync في adoptUser).
· لماذا: فصل واضح بين "اختيار الشخصية" و "المصادقة السحابية".

☑ HeroNamePicker.tsx — واجهة 100 شخصية

· 4 تبويبات: حيوانات / أبطال / فضاء / أساطير.
· يحفظ avatar.id في soroban_hero_key.
· دعم عربي/إنجليزي عبر pickLang.

☑ HeroDashboard.tsx — لوحة البطل

· يعرض إيموجي الشخصية بجانب الاسم.
· زر "الملف الشخصي" مفعّل.
· زر "لوحة ولي الأمر" مربوط بـ LocalPinGuard.

☑ ProfileScreen.tsx — إدارة الهوية

· 100 شخصية في شبكة قابلة للتصفية.
· 8 خلفيات (تدرجات لونية).
· handleSave: يحفظ soroban_hero_key + soroban_child_name + theme_key.
· 🆕 زر "الظهور في لوحة الشرف":
  · يظهر في Cloud Mode فقط.
  · يقرأ الحالة من Supabase عبر getLeaderboardVisibility.
  · يُحدّث عبر setLeaderboardVisibility.
  · يدعم Loading / Saving / Error / Success.

---

🌐 3. طبقة السحابة (CloudSync)

☑ cloudSync.ts — القلب النابض

الحماية الأساسية:

· requireCloudMode(): يمنع كل عمليات Cloud خارج وضع Cloud.
· extractPureState: يستبعد childName + parentName + كل الدوال.
· wipeLocalProgress: محمي بشرط Cloud.

المصادقة:

· registerParent: 3 args فقط (email + password + consent).
· verifyOtp: يتحقق من OTP، ثم يستدعي adoptUser.
· loginParent: تسجيل دخول عادي.
· logoutParent: يحفظ قبل الخروج (إلا إذا force).
· adoptUser: يمسح عند تبديل الحساب + يزامن setMyAvatar.

المزامنة:

· saveToCloud: يستخدم extractPureState.
· loadFromCloud: ينظف الأسماء عند القراءة.
· getSession / getCurrentUser: بدون حارس (للمصادقة فقط).

لوحة الشرف (V2):

· submitScore: يحفظ النتيجة (لا يعتمد على show_on_leaderboard).
· getHallOfFame: يُرجع HallOfFameResult (نجاح/فشل).
· getMyRankDetails: يُرجع MyRankDetailsResult.
· normalizeLeaderboardPeriod: يحول month → YYYY-MM بـ UTC.

الموافقة على الظهور:

· setLeaderboardVisibility: يستدعي RPC set_my_leaderboard_visibility.
· 🆕 getLeaderboardVisibility: يقرأ show_on_leaderboard من public_profiles.

الشخصية السحابية:

· setMyAvatar: يستدعي RPC set_my_avatar (يولّد sequential_number).

---

🏆 4. لوحات الشرف (5 ملفات متوافقة مع V2)

☑ CloudGameLeaderboard.tsx

· يستخدم: cloudSync.getHallOfFame (V2).
· الفصل: loadError (فشل) ≠ scores.length === 0 (فارغ).
· الأشباح: تظهر فقط عند نجاح الاتصال.
· العرض: إيموجي + اسم شخصية + #seq.

☑ HallOfFamePage.tsx

· يجلب: getHallOfFame + getMyRankDetails.
· يمزج: لاعبون حقيقيون + أشباح (حتى 10).
· يعرض: getPlayerIdentity (إيموجي + اسم + #seq).
· عند null: #— بدلاً من #null.

☑ HallOfFameScreen.tsx

· getPlayerDisplayName: يزيل الإيموجي من البداية.
· دائرة اللاعب: تعرض الإيموجي (وليس الحرف).
· المنصة + القائمة + المركز الحالي: كلها متوافقة.

☑ Leaderboard.tsx (الثقب الدودي)

· playerId: مُعرّف ثابت (sb-, ghost-, local-).
· at: 0: للسجلات السحابية.
· إزالة maskName: (لأن السجلات الجديدة لا تحتاج تقنيع).
· أشباح محلية: تُعرض بشخصيات من AVATARS.

☑ RecordTicker.tsx

· فلترة: بـ playerId + examId (بدلاً من name).
· الأشباح: إيموجي + اسم من AVATARS.
· السجلات المحلية: تُعرض بـ maskName للتوافق.

☑ leaderboard.ts (الأدوات)

· playerId: حقل جديد في LeaderRecord.
· getLocalPlayerId(): UUID ثابت (يُنشأ مرة واحدة).
· GHOST_SEEDS: تستخدم AVATARS (بدون أسماء).
· addRecord: يبحث بـ playerId + examId (لا يكرر).
· cleanupLegacyLeaderboard: تنظيف مرة واحدة.

---

🔒 5. عزل Local/Cloud (5 متاجر)

☑ masteryBadgesStore.ts

· createJSONStorage(() => storage): عزل تلقائي.
· النتيجة: local:soroban_mastery_badges / cloud:soroban_mastery_badges.

☑ CategoryExamScreen.tsx

· storage.getItem/setItem: بدل localStorage مباشرة.
· المفاتيح: local:soroban_exam1_score / cloud:....

☑ CategoryScreen.tsx + App.tsx

· Placement: عبر storage.setItem/getItem.
· المفاتيح: local:soroban_placement_* / cloud:....

☑ progressStore.ts + highScoreStore.ts

· createJSONStorage(() => storage): العزل الأساسي.

---

🗄️ الجزء الثالث: قاعدة البيانات (SQL) — التفاصيل

☑ Audit كامل

· الجداول: public_profiles, scores, score_games, soroban_progress.
· الدوال القديمة: handle_new_profile, submit_score, get_hall_of_fame, get_my_rank_details, mask_name.
· RLS: مفعّل، 0 سياسات على public_profiles.
· الحسابان التجريبيان: موجودان (حُذفا لاحقاً).

☑ تنظيف الحساب الهام

```sql
-- الاسم: بطل
-- show_on_leaderboard: false
-- progress_data: {}
```

☑ SQL 1 — إضافة الأعمدة

```sql
ALTER TABLE public_profiles
  ADD COLUMN avatar_id TEXT DEFAULT NULL,
  ADD COLUMN sequential_number BIGINT DEFAULT NULL,
  ALTER COLUMN show_on_leaderboard SET DEFAULT FALSE;

UPDATE public_profiles SET show_on_leaderboard = FALSE;
```

☑ SQL 2 — جدول allowed_avatars

· 100 شخصية (30+30+20+20).
· RLS: SELECT فقط للجميع.
· الصلاحيات: REVOKE ALL ثم GRANT SELECT.

☑ SQL 3 — handle_new_profile الجديد

```sql
INSERT INTO public_profiles (user_id, display_name, show_on_leaderboard, avatar_id, sequential_number)
VALUES (NEW.id, 'بطل', FALSE, NULL, NULL);
-- لا قراءة لـ child_name، لا mask_name
```

☑ SQL 4 — set_my_avatar

· SECURITY DEFINER + search_path = ''.
· يتحقق من: auth.uid() + allowed_avatars.
· الصلاحيات: authenticated فقط.

☑ SQL 5 — RLS Policy

```sql
CREATE POLICY "read_visible_or_own_profile"
ON public_profiles FOR SELECT TO anon, authenticated
USING (
  show_on_leaderboard IS TRUE
  OR ((SELECT auth.uid()) IS NOT NULL AND user_id = (SELECT auth.uid()))
);
```

☑ SQL 6 — دوال V2

· submit_score: يحفظ في all + YYYY-MM (UTC).
· get_hall_of_fame_v2: يُرجع avatar_id + sequential_number (بدل display_name).
· get_my_rank_details_v2: نفس الشيء للاعب الحالي.
· الفلترة: show_on_leaderboard IS TRUE فقط.

☑ SQL 7 — الرقم التسلسلي + الموافقة

· Sequence: public_profiles_sequential_number_seq.
· UNIQUE CONSTRAINT على sequential_number.
· set_my_avatar مُحدّث: يولّد #seq مرة واحدة فقط (COALESCE).
· set_my_leaderboard_visibility: يغيّر الموافقة بأمان.

---

📊 الجزء الرابع: جدول الحالة النهائي

# الملف/الوظيفة الحالة
1 LocalPinGuard ✅
2 App.tsx (ربط الحارس) ✅
3 GuardianDashboard (Reset + Backup) ✅
4 avatars.ts (100) ✅
5 resolveDisplayName ✅
6 AppGate ✅
7 HeroNamePicker ✅
8 HeroDashboard ✅
9 ProfileScreen (+ Toggle) ✅
10 cloudSync.ts (كامل) ✅
11 masteryBadgesStore (عزل) ✅
12 CategoryExamScreen (عزل) ✅
13 CategoryScreen (عزل) ✅
14 CloudGameLeaderboard (V2) ✅
15 HallOfFamePage (V2 + أشباح) ✅
16 HallOfFameScreen (إيموجي) ✅
17 Leaderboard.tsx (playerId) ✅
18 RecordTicker (playerId) ✅
19 leaderboard.ts (AVATARS) ✅
20 SQL 1 (أعمدة) ✅
21 SQL 2 (allowed_avatars) ✅
22 SQL 3 (handle_new_profile) ✅
23 SQL 4 (set_my_avatar) ✅
24 SQL 5 (RLS) ✅
25 SQL 6 (V2 functions) ✅
26 SQL 7 (seq + visibility) ✅
27 Build النهائي ✅

---

⏳ الجزء الخامس: ما تبقى

🔴 اختبارات يدوية مطلوبة

# الاختبار الحالة
1 Local: اختيار شخصية → لعب → حفظ ⏳
2 Local: Reset → التحقق من المسح ⏳
3 Cloud: تسجيل → OTP → لعب → حفظ ⏳
4 Cloud: Toggle الظهور → ظهور في اللوحة ⏳
5 تبديل Local ⇄ Cloud (عزل) ⏳
6 Backup/Restore (Local) ⏳
7 A→B→A (تبديل حساب) ⏳
8 الإيميل الهام (بعد toggle) ⏳
### 🟡 ميزات مؤجلة
| # | الميزة | الحالة |
|---|--------|--------|
| 1 | PWA | ⏳ |
| 2 | main.tsx — cleanLegacyNames | ⏳ (منخفض) |
| 3 | حذف maskName.ts | ⏳ (8 ملفات) |
| 4 | حذف heroNames.ts | ⏳ (توافق) |
| 5 | Migration Local ↔ Cloud (Wizard) | ⏳ (بقرار أمني) |
| 6 | المراجعة القانونية | ⏳ |
| 7 | سياسة خصوصية حقيقية | ⏳ |

**تفاصيل Migration Local ↔ Cloud:**
- **مؤجل بقرار أمني** (منع خلط البيانات).
- **البديل الحالي:** Backup/Restore داخل نفس الوضع فقط.
- **التصميم المقترح:** Migration Wizard يتحقق + ينظف + يستبدل (لا يدمج).
....

🟡 ميزات مؤجلة

# الميزة الحالة
1 PWA (تثبيت على الهاتف) ⏳
2 main.tsx — cleanLegacyNames ⏳ (منخفض)
3 حذف maskName.ts ⏳ (مستورد في 8 ملفات)
4 حذف heroNames.ts ⏳ (توافق)
5 migration Local → Cloud (JSON) ⏳
6 المراجعة القانونية (محام) ⏳
7 صفحة سياسة خصوصية حقيقية ⏳

---

🛡️ الجزء السادس: القيود المعروفة

القيد السبب القرار
maskName في 8 ملفات ألعاب Mental Archives / Online / Relay يبقى للتوافق
heroNames.ts توافق مع resolveDisplayName يبقى
أرقام الأشباح 9000+ ليست هوية عالمية مقصود (داخل اللعبة)
main.tsx migration قد يكتب اسماً مؤقتاً مؤجل
Local → Cloud Migration يحتاج شاشة كاملة مؤجل

---

🎯 الجزء السابع: الخطوة التالية

الخيارات (بالترتيب):

1. الاختبارات اليدوية (أولوية قصوى):

· تأكد من عمل Local Reset + Cloud Toggle + Backup.
· إن نجحت → React + SQL مغلقان رسمياً.

2. PWA (بعد الاختبار):

· vite-plugin-pwa + manifest.json + Service Worker.
· المتطلب قبل النشر.

3. المراجعة القانونية (بعد PWA):

· استشارة محامٍ (COPPA/GDPR).
· سياسة خصوصية حقيقية.

4. اختبار A→B→A (قبل النشر):

· تأكد أن تبديل الحساب لا يخلط البيانات.

---

📌 ملاحظات مهمة للمستقبل

عند العودة مع أي مساعد AI:

1. أرسل له هذه الوثيقة.
2. قل: "اقرأ الجزء السادس (القيود) قبل أي اقتراح".
3. لا تقبل كوداً قبل التحقق من:
   · عدم استخدام maskName في السجلات الجديدة.
   · احترام requireCloudMode.
   · عدم المساس بـ sb-* أو soroban_parent_*.

القاعدة الذهبية:

"ملف واحد → Commit → Build ناجح → الملف التالي"
لا تجمع تعديلات متعددة في Commit واحد.

---

🎓 الوثيقة جاهزة للحفظ كـ SorobanMind_Status_v4.md

أنت الآن في نقطة ممتازة: كل الكود نظيف، البناء ناجح، والتوثيق مكتمل. كل ما يحتاجه المشروع الآن هو الاختبارات اليدوية لضمان الجودة قبل النشر. 💐🚀

هل تريد أن نبدأ بالاختبارات أم لديك سؤال قبل الإغلاق؟