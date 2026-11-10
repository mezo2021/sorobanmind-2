// src/utils/appMode.ts
export type AppMode = 'local' | 'cloud';

export function getMode(): AppMode | null {
  try {
    const m = localStorage.getItem('soroban_mode');
    return m === 'local' || m === 'cloud' ? m : null;
  } catch {
    return null;
  }
}

export function setMode(mode: AppMode): void {
  try {
    localStorage.setItem('soroban_mode', mode);
  } catch { /* ignore */ }
}

export function clearMode(): void {
  try {
    localStorage.removeItem('soroban_mode');
  } catch { /* ignore */ }
}