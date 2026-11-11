import { getHeroDisplayName } from '../data/heroNames';
import { getAvatarDisplayName } from '../data/avatars';

/**
 * دالة موحدة لحل اسم الشخصية سواء كانت من النظام القديم أو الجديد.
 * @param key معرف الشخصية (مثل 'falcon' أو 'rabbit_fast')
 * @returns الاسم العربي، أو نص فارغ إذا لم يتم العثور عليه
 */
export function resolveDisplayName(key: string | null): string {
  if (!key) return '';

  // 1. البحث في القاموس القديم أولاً (للتوافق مع البيانات القديمة)
  const legacyName = getHeroDisplayName(key, 'ar');
  if (legacyName && legacyName !== 'بطل' && legacyName !== 'Hero') {
    return legacyName;
  }

  // 2. البحث في نظام الشخصيات الجديد (بدون رقم تسلسلي)
  const avatarName = getAvatarDisplayName(key, null, 'ar');
  if (avatarName && avatarName !== 'بطل' && avatarName !== 'Hero') {
    return avatarName;
  }

  // 3. إذا لم يتم العثور على الشخصية، نعيد نصاً فارغاً
  return '';
}