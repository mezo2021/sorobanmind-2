# EXTRA_FIXES_APPENDIX.md — إصلاحات إضافية محتملة (خارج المراحل الأربع)

مصدرها: audit v8/v9/v10 + `docs/md/01_Phase_1_Identity/P1_01_Deferred_Findings.md` + فحص الكود. **لا يُنفَّذ شيء منها بلا موافقتك.** مرتبة حسب الخطر على المستخدم.

| # | الخطر | الدليل | الإصلاح المقترح (سطر) | يلحق بـ |
|---|---|---|---|---|
| E1 | **عالٍ** — تسرب بين الأطفال/الحسابات | v10: مفاتيح بلا بادئة وضع: `sorobania_progress_v2/v1`، `soroban_friends_weak_v1`، `sorobanmind-ghost-v1`، `soroban_companion`. `adoptUser` (L424–426) يحذف `hero_key` و`child_name` فقط، و`wipeLocalProgress` يحذف `cloud:` فقط، و`handleReset` لا يمسحها | إضافتها لقائمة الحذف عند تبديل الحساب الفعلي (`owner && owner !== user.id`) وفي Reset، **أو** عزلها بالبادئة (أكبر). يحتاج قرارك: حذف أم عزل | بعد Phase 2 |
| E2 | متوسط — CI لا يحمي `main` | `ci-build.yml` على `pull_request` فقط؛ `deploy.yml` على `push` | إضافة `push: branches: [main]` إلى `ci-build.yml` (سطران) | أي وقت |
| E3 | متوسط — رمز خطأ خاطئ عند فشل Rollback | Deferred #3: `adoptUser` يرمي `SESSION_RESTORE_FAILED` بدل `LOCAL_STATE_COMMIT_FAILED` | تبديل الرمز في الفرع المعني (سطر) | بعد Phase 1 |
| E4 | متوسط — فشل استعادة الجلسة يخفي الخطأ الأصلي | Deferred #2 (`restorePreviousSession`) | تمرير الخطأ الأصلي مع رمز الاستعادة | بعد Phase 1 |
| E5 | منخفض — `resendOtp` خارج `withAuthLock` | `cloudSync.ts` L683 | لفّه بـ `withAuthLock` | بعد Phase 1 |
| E6 | منخفض — `retryPendingAvatar` يبتلع `AUTH_FLOW_BUSY` بلا إعادة جدولة | Deferred #1 | إعادة المحاولة عند الـ `getSession` التالي (قائم فعلاً) — يكفي توثيقه | توثيق |
| E7 | منخفض — رموز ميتة | `AVATAR_SYNC_FAILED` غير مستخدم (و`AUTH_REQUIRED` سيُستخدم في P2-07) | حذف `AVATAR_SYNC_FAILED` فقط | تنظيف |
| E8 | معلومة — اختلاط IDs في الدروس (م8) | `AUDIT_V8_V9` «ما تبقى»: لم يُحل | جلسة مستقلة؛ قد يؤثر على P2-04 | قبل P2-04 |
| E9 | معلومة — وثائق قديمة كثيرة | `docs/` يحوي وثائق تاريخية تتعارض | اعتبار `docs/md/هام/` المرجع الوحيد؛ لا تحذف بناءً على التقارير القديمة | — |

ملاحظات: audit v8 (109 فجوة) أغلبها مفاتيح ديناميكية معلوماتية. Build/Typecheck في v8 = 0 (ناجح). `main.tsx` L60 و`GuardianDashboard` L634/848–859 تحذف بمفاتيح محسوبة ولم أفحص محتواها؛ تُراجع قبل أي توسيع لقوائم الحذف.
