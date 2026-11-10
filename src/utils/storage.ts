import { getMode } from './appMode';

function getPrefixedKey(key: string): string | null {
  const mode = getMode();
  return mode ? `${mode}:${key}` : null;
}

export const storage = {
  getItem(name: string): string | null {
    const key = getPrefixedKey(name);
    if (!key) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(name: string, value: string): void {
    const key = getPrefixedKey(name);
    if (!key) return;
    try {
      localStorage.setItem(key, value);
    } catch { /* ignore */ }
  },

  removeItem(name: string): void {
    const key = getPrefixedKey(name);
    if (!key) return;
    try {
      localStorage.removeItem(key);
    } catch { /* ignore */ }
  },
};