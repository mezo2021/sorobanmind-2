// src/utils/maskName.ts
// قاعدة الأسماء: childName ثلاثي دائماً → "الأول.ثاني[0].ثالث[0]"
export function maskName(fullName: string): string {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length < 3) return fullName; // احتياطي (لا يحدث فعلياً)
  const [first, second, third] = parts;
  return `${first}.${second[0]}.${third[0]}`;
}
