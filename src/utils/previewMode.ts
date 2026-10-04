// src/utils/previewMode.ts
//
// 📝 التعديل: أداة وضع المعاينة
// 🎯 الوظيفة: تفعيل/إيقاف المعاينة دون لمس بيانات الطفل
// 📅 الجلسة: 20

const PREVIEW_KEY = 'soroban_dev_preview';

export function isPreviewMode(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(PREVIEW_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPreviewMode(on: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (on) {
      localStorage.setItem(PREVIEW_KEY, 'true');
    } else {
      localStorage.removeItem(PREVIEW_KEY);
    }
  } catch { /* ignore */ }
}

export function togglePreviewMode(): boolean {
  const next = !isPreviewMode();
  setPreviewMode(next);
  return next;
}