# P2-02 — تنظيف `soroban_child_full_name`

> **الحالة:** ✅ مغلق تصميمياً
> **النطاق:** 3 ملفات — `GuardianDashboard.tsx` + `RoleSelection.tsx` + `cloudSync.ts` (adoptUser فقط)
> **الاختبارات:** C110–C119
> **اكتشاف:** مسار `adoptUser` يحذف `child_name` دون `full_name` (تسريب PII بين الحسابات)

---

## 1. الوضع الحالي

### س: أين يُحذف `soroban_child_name` حالياً؟
**ج:**
- `GuardianDashboard.handleReset` — عبر `localProgressKeys`.
- `RoleSelection.handleLogout` — صراحةً.
- `cloudSync.adoptUser` — **عند اكتشاف حساب مختلف** (السطر 189).

### س: هل `soroban_child_full_name` يُحذف في أي منها؟
**ج:** **لا.** في الثلاثة جميعاً. يُكتب في:
- `CertificateScreen.handleSaveName`
- `KidsCertificateScreen.handleSaveName`

---

## 2. الاكتشاف الجديد — تسريب بين الحسابات

### س: كيف يحدث التسريب؟

| الخطوة | النتيجة |
|---|---|
| طفل A يستخدم شاشة الشهادة | `soroban_child_full_name = "اسم A"` |
| طفل A يسجّل خروج، طفل B يسجّل دخول | `child_name` يُحذف، `full_name` يبقى |
| **طفل B يفتح شاشة الشهادة** | **يرى اسم A في الشهادة!** |

**الأثر:** تسريب PII بين حسابين مختلفين على نفس الجهاز.

---

## 3. القرارات المعتمدة

| # | القرار | المسار |
|---|---|---|
| D5 | حذف `soroban_child_full_name` عند Reset | `GuardianDashboard.handleReset` |
| D6 | حذف `soroban_child_full_name` عند Logout | `RoleSelection.handleLogout` |
| D7 | حذف `soroban_child_full_name` عند تبديل الحساب | `cloudSync.adoptUser` (فقط عند `changed=true`) |

**قيود:**
- **لا حذف** عند إلغاء Logout (المستخدم رفض الخروج بعد فشل الحفظ).
- **لا حذف** عند مجرد فتح/مغادرة شاشة الشهادة.

---

## 4. حالات الفشل

| الحالة | السلوك |
|---|---|
| Local Reset مع وجود الاسم | حذف |
| Reset بدون مفتاح | يكتمل دون خطأ |
| Cloud Reset | لا يحدث (المسار غير متاح) |
| Logout ناجح | حذف |
| Logout مرفوض من المستخدم | لا حذف |
| Logout قسري مؤكد | حذف بعد إتمام المسار |
| تبديل حساب (`adoptUser`, `changed=true`) | حذف |
| `adoptUser` مع الحساب نفسه | لا حذف |

---

## 5. الاختبارات

| # | السيناريو | النتيجة المطلوبة |
|---|---|---|
| C110 | Local Reset مع الاسم | حذف المفتاح |
| C111 | Reset بدون المفتاح | يكتمل دون خطأ |
| C112 | Cloud Reset | لا حذف |
| C113 | Logout ناجح | حذف |
| C114 | Logout مرفوض | بقاء الاسم |
| C115 | Logout قسري مؤكد | حذف بعد إتمام المسار |
| C116 | وجود `child_name` و `full_name` | حذف `full_name` مع الحفاظ على سلوك إعادة بناء اسم البطل |
| C117 | فتح الشهادة بعد Reset/Logout | لا استعادة الاسم القديم |
| C118 | `adoptUser` مع حساب مختلف | حذف `full_name` |
| C119 | `adoptUser` مع الحساب نفسه | بقاء `full_name` |

---

## 6. خارج النطاق

- حذف `soroban_child_name` أو تغيير سياسة اسم البطل.
- حذف بيانات الشهادات.
- تعديل `CertificateScreen` / `KidsCertificateScreen`.
- تعديل `storage.ts` أو `App.tsx`.
- حذف عند فشل تبديل الحساب.

---

## 7. الفحص الإلزامي

| # | الفحص |
|---|---|
| 1 | مطابقة الملفات الثلاثة في GitHub |
| 2 | تحديد `localProgressKeys` بدقة في `GuardianDashboard` |
| 3 | تحديد مسار `handleLogout` (عادي + قسري) |
| 4 | تحديد السطر 189 في `adoptUser` (حذف `child_name`) |
| 5 | التأكد من عدم وجود مسار رابع يحذف `child_name` |