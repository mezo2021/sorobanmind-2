// src/utils/maskName.ts
// قاعدة الأسماء: الاسم الأول + أول حرف من الكنية/العائلة
export function maskName(fullName: string): string {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  
  // إذا كان الاسم كلمة واحدة فقط
  if (parts.length < 2) return fullName; 

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];

  // النتيجة: الأول.أول حرف من الأخير
  return `${firstName}.${lastName[0]}`;
}