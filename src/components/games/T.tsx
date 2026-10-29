// src/components/games/T.tsx
// 🌐 نص ثنائي اللغة داخل بيانات JSX على مستوى الملف: <T ar="..." en="..." />
// يشترك في اللغة، فيتحدّث فورًا عند التبديل.
import { useLangStore } from '@/i18n/useTranslation';

export function T({ ar, en }: { ar: string; en: string }) {
  const lang = useLangStore((s) => s.lang);
  return <>{lang === 'en' ? en : ar}</>;
}

export default T;
