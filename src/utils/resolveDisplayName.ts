// src/utils/resolveDisplayName.ts
import { getHeroDisplayName } from '../data/heroNames';
import { getAvatarDisplayName } from '../data/avatars';

/**
 * دالة موحدة لحل اسم الشخصية سواء كانت من النظام القديم أو الجديد.
 * @param key معرف الشخصية (مثل 'falcon' أو 'rabbit_fast')
 * @param lang اللغة المطلوبة ('ar' أو 'en')
 * @returns الاسم المترجم، أو نص فارغ إذا لم يتم العثور عليه
 */
export function resolveDisplayName(key: string | null, lang: 'ar' | 'en' = 'ar'): string {
  if (!key) return '';

  // 1. البحث في القاموس القديم أولاً (للتوافق)
  const legacyName = getHeroDisplayName(key, lang);
  if (legacyName && legacyName !== 'بطل' && legacyName !== 'Hero') {
    return legacyName;
  }

  // 2. البحث في نظام الشخصيات الجديد (بدون رقم تسلسلي)
  const avatarName = getAvatarDisplayName(key, null, lang);
  if (avatarName && avatarName !== 'بطل' && avatarName !== 'Hero') {
    return avatarName;
  }

  // 3. إذا لم يتم العثور على الشخصية، نعيد نصاً فارغاً
  return '';
}