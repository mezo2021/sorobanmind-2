# EXTRA_FIXES_APPENDIX.md — إصلاحات إضافية محتملة (خارج المراحل الأربع)

نُقل E1 إلى Phase 1 (بطاقة 5) وE2 إلى Phase 2 (بطاقة 1). **لا يُنفَّذ شيء من هذا الملف بلا موافقتك.** مرتبة حسب الخطر.

| # | الخطر | الدليل | الإصلاح المقترح (سطر) |
|---|---|---|---|
| E3 | متوسط — رمز خطأ خاطئ عند فشل Rollback | Deferred #3: `adoptUser` يرمي `SESSION_RESTORE_FAILED` بدل `LOCAL_STATE_COMMIT_FAILED` | تبديل الرمز في فرع الاستعادة (`cloudSync.ts` ~L451) |
| E4 | متوسط — فشل استعادة الجلسة يخفي الخطأ الأصلي | Deferred #2 (`restorePreviousSession`) | تمرير الخطأ الأصلي مع رمز الاستعادة |
| E5 | منخفض — `resendOtp` خارج `withAuthLock` | `cloudSync.ts` L683 | لفّه بـ `withAuthLock` |
| E6 | منخفض — `retryPendingAvatar` يبتلع `AUTH_FLOW_BUSY` | Deferred #1 | يُعاد عند `getSession` التالي (قائم فعلاً) ← توثيق فقط |
| E7 | منخفض — رمز ميت | `AVATAR_SYNC_FAILED` غير مستخدم | حذفه من `CloudSyncErrorCode` |
| E8 | معلومة — اختلاط IDs في الدروس (م8) | `AUDIT_V8_V9` «ما تبقى» | جلسة مستقلة؛ قد يؤثر على P2-04 |
| E9 | معلومة — وثائق قديمة كثيرة | `docs/` يحوي وثائق تاريخية متعارضة | اعتبار `docs/md/هام/` المرجع الوحيد |
| E10 | متوسط — `deploy.yml` ينشر دون انتظار CI | `deploy.yml` على `push` بلا `needs` | بعد بطاقة CI: جعل النشر يعتمد على نجاح البناء (قرار تصميم) |