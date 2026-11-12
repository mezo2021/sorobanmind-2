// src/components/LocalPinGuard.tsx
import { useEffect, useState } from 'react';
import {
  LockKeyhole, ShieldCheck, KeyRound, Eye, EyeOff, RefreshCw, AlertTriangle, Copy,
} from 'lucide-react';
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

// ======================================================
// Local Parent PIN Guard
// Local mode only — no Supabase / no Zustand
// ======================================================

const KEYS = {
  pinHash: 'soroban_parent_pin_hash',
  pinSalt: 'soroban_parent_pin_salt',
  recoveryHash: 'soroban_parent_pin_recovery_hash',
  recoverySalt: 'soroban_parent_pin_recovery_salt',
  attempts: 'soroban_parent_pin_attempts',
  lockUntil: 'soroban_parent_pin_lock_until',
} as const;

// Developer emergency code. Intentionally a client-side recovery fallback,
// NOT a secure secret. It only resets the PIN and never touches child data.
const EMERGENCY_CODE = '19871987';

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 5 * 60 * 1000;

type GuardMode =
  | 'setup'
  | 'confirm'
  | 'verify'
  | 'recovery'
  | 'newPin'
  | 'confirmNewPin'
  | 'showRecovery';

interface LocalPinGuardProps {
  onUnlock: () => void;
  onCancel?: () => void;
}

// ======================================================
// Cryptographic helpers
// ======================================================

function randomSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hashValue(value: string, salt: string): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is unavailable');
  }
  const data = new TextEncoder().encode(`${salt}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function createHash(value: string) {
  const salt = randomSalt();
  const hash = await hashValue(value, salt);
  return { salt, hash };
}

function generateRecoveryCode(): string {
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  return String(10000000 + (random[0] % 90000000));
}

function isValidPin(value: string): boolean {
  return /^\d{4}$/.test(value);
}

// ======================================================
// Component
// ======================================================

export default function LocalPinGuard({ onUnlock, onCancel }: LocalPinGuardProps) {
  const { lang, dir } = useT();

  const [mode, setMode] = useState<GuardMode>(() =>
    localStorage.getItem(KEYS.pinHash) && localStorage.getItem(KEYS.pinSalt)
      ? 'verify'
      : 'setup'
  );

  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [recoveryInput, setRecoveryInput] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem(KEYS.attempts) || 0));
  const [lockUntil, setLockUntil] = useState(() => Number(localStorage.getItem(KEYS.lockUntil) || 0));
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const t = (ar: string, en: string) => pickLang({ ar, en }, lang);

  // Lock timer
  useEffect(() => {
    const update = () => {
      const left = Math.max(0, lockUntil - Date.now());
      setRemaining(Math.ceil(left / 1000));
      if (left === 0 && lockUntil > 0) {
        localStorage.removeItem(KEYS.lockUntil);
        localStorage.removeItem(KEYS.attempts);
        setLockUntil(0);
        setAttempts(0);
      }
    };
    update();
    if (!lockUntil) return;
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [lockUntil]);

  function isLocked(): boolean {
    if (Date.now() < lockUntil) {
      setError(t('الحارس مقفل مؤقتاً', 'Guard temporarily locked'));
      return true;
    }
    return false;
  }

  function clearFailures() {
    localStorage.removeItem(KEYS.attempts);
    localStorage.removeItem(KEYS.lockUntil);
    setAttempts(0);
    setLockUntil(0);
    setError('');
  }

  function registerFailure() {
    const next = attempts + 1;
    setAttempts(next);
    localStorage.setItem(KEYS.attempts, String(next));
    if (next >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCK_DURATION;
      localStorage.setItem(KEYS.lockUntil, String(until));
      setLockUntil(until);
      setError(t(
        'ثلاث محاولات خاطئة. تم قفل الحارس لمدة 5 دقائق.',
        'Three failed attempts. Guard locked for 5 minutes.'
      ));
    } else {
      setError(t(
        `رمز غير صحيح. المحاولات المتبقية: ${MAX_ATTEMPTS - next}`,
        `Incorrect code. Attempts remaining: ${MAX_ATTEMPTS - next}`
      ));
    }
  }

  async function saveNewPin(value: string) {
    const pinData = await createHash(value);
    const newRecovery = generateRecoveryCode();
    const recoveryData = await createHash(newRecovery);
    localStorage.setItem(KEYS.pinHash, pinData.hash);
    localStorage.setItem(KEYS.pinSalt, pinData.salt);
    localStorage.setItem(KEYS.recoveryHash, recoveryData.hash);
    localStorage.setItem(KEYS.recoverySalt, recoveryData.salt);
    setRecoveryCode(newRecovery);
    setPin('');
    setFirstPin('');
    clearFailures();
    setMode('showRecovery');
  }

  async function handleSetup() {
    if (busy || isLocked()) return;
    if (!isValidPin(pin)) {
      setError(t('أدخل PIN مكونًا من 4 أرقام.', 'Enter a 4-digit PIN.'));
      return;
    }
    setFirstPin(pin);
    setPin('');
    setError('');
    setMode('confirm');
  }

  async function handleConfirm() {
    if (busy || isLocked()) return;
    if (!isValidPin(pin)) {
      setError(t('أدخل أربعة أرقام.', 'Enter four digits.'));
      return;
    }
    if (pin !== firstPin) {
      setError(t('الرقمان غير متطابقين. أعد المحاولة.', 'PINs do not match. Try again.'));
      setPin('');
      setFirstPin('');
      setMode('setup');
      return;
    }
    setBusy(true);
    try {
      await saveNewPin(pin);
    } catch {
      setError(t('تعذر إنشاء الحماية. تحقق من المتصفح.', 'Could not create protection. Check your browser.'));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify() {
    if (busy || isLocked()) return;
    if (!isValidPin(pin)) {
      setError(t('أدخل PIN مكونًا من 4 أرقام.', 'Enter a 4-digit PIN.'));
      return;
    }
    setBusy(true);
    try {
      const salt = localStorage.getItem(KEYS.pinSalt);
      const savedHash = localStorage.getItem(KEYS.pinHash);
      if (!salt || !savedHash) {
        setMode('setup');
        setPin('');
        return;
      }
      const candidate = await hashValue(pin, salt);
      if (candidate === savedHash) {
        clearFailures();
        onUnlock();
      } else {
        setPin('');
        registerFailure();
      }
    } catch {
      setError(t('حدث خطأ أثناء التحقق.', 'Verification failed.'));
    } finally {
      setBusy(false);
    }
  }

  async function handleRecovery() {
    if (busy || isLocked()) return;
    const value = recoveryInput.trim();
    if (!/^\d{8}$/.test(value)) {
      setError(t('أدخل رمزًا مكونًا من 8 أرقام.', 'Enter an 8-digit code.'));
      return;
    }
    setBusy(true);
    try {
      let authorized = value === EMERGENCY_CODE;
      if (!authorized) {
        const salt = localStorage.getItem(KEYS.recoverySalt);
        const savedHash = localStorage.getItem(KEYS.recoveryHash);
        if (salt && savedHash) {
          const candidate = await hashValue(value, salt);
          authorized = candidate === savedHash;
        }
      }
      if (authorized) {
        clearFailures();
        setRecoveryInput('');
        setPin('');
        setFirstPin('');
        setError('');
        setMode('newPin');
      } else {
        setRecoveryInput('');
        registerFailure();
      }
    } catch {
      setError(t('تعذر التحقق من رمز الاسترداد.', 'Recovery verification failed.'));
    } finally {
      setBusy(false);
    }
  }

  async function handleNewPin() {
    if (busy || isLocked()) return;
    if (!isValidPin(pin)) {
      setError(t('PIN يجب أن يتكون من 4 أرقام.', 'PIN must contain 4 digits.'));
      return;
    }
    setFirstPin(pin);
    setPin('');
    setError('');
    setMode('confirmNewPin');
  }

  async function handleConfirmNewPin() {
    if (busy || isLocked()) return;
    if (!isValidPin(pin)) {
      setError(t('أدخل أربعة أرقام.', 'Enter four digits.'));
      return;
    }
    if (pin !== firstPin) {
      setPin('');
      setFirstPin('');
      setError(t('الرقمان غير متطابقين.', 'PINs do not match.'));
      setMode('newPin');
      return;
    }
    setBusy(true);
    try {
      await saveNewPin(pin);
    } catch {
      setError(t('تعذر حفظ PIN الجديد.', 'Could not save the new PIN.'));
    } finally {
      setBusy(false);
    }
  }

  async function handleRecoverySaved() {
    setRecoveryCode('');
    onUnlock();
  }

  async function copyRecoveryCode() {
    try {
      await navigator.clipboard.writeText(recoveryCode);
    } catch {
      setError(t('تعذر النسخ. اكتب الرمز يدويًا.', 'Copy failed. Write the code manually.'));
    }
  }

  const locked = remaining > 0;

  const title =
    mode === 'setup' ? t('إنشاء PIN', 'Create PIN')
    : mode === 'confirm' ? t('تأكيد PIN', 'Confirm PIN')
    : mode === 'verify' ? t('لوحة ولي الأمر', 'Parent Dashboard')
    : mode === 'recovery' ? t('استرداد الوصول', 'Recover Access')
    : mode === 'newPin' ? t('إنشاء PIN جديد', 'Create New PIN')
    : mode === 'confirmNewPin' ? t('تأكيد PIN الجديد', 'Confirm New PIN')
    : t('رمز الاسترداد', 'Recovery Code');

  const description =
    mode === 'setup' ? t('أنشئ رقمًا سريًا من أربعة أرقام لحماية لوحة ولي الأمر.', 'Create a 4-digit PIN to protect the Parent Dashboard.')
    : mode === 'confirm' ? t('أعد إدخال الرقم السري للتأكيد.', 'Enter your PIN again to confirm.')
    : mode === 'verify' ? t('أدخل الرقم السري للوصول إلى تقارير الطفل.', 'Enter your PIN to access the child progress reports.')
    : mode === 'recovery' ? t('أدخل رمز الاسترداد أو رمز الطوارئ.', 'Enter your recovery code or emergency code.')
    : mode === 'newPin' || mode === 'confirmNewPin' ? t('أنشئ رقمًا سريًا جديدًا.', 'Create a new PIN.')
    : t('احفظ هذا الرمز في مكان آمن. لن يظهر مرة أخرى.', 'Save this code somewhere safe. It will not be shown again.');

  function submit() {
    if (locked || busy) return;
    switch (mode) {
      case 'setup': void handleSetup(); break;
      case 'confirm': void handleConfirm(); break;
      case 'verify': void handleVerify(); break;
      case 'recovery': void handleRecovery(); break;
      case 'newPin': void handleNewPin(); break;
      case 'confirmNewPin': void handleConfirmNewPin(); break;
      case 'showRecovery': void handleRecoverySaved(); break;
    }
  }

  const needsPin =
    mode === 'setup' || mode === 'confirm' || mode === 'verify' ||
    mode === 'newPin' || mode === 'confirmNewPin';

  return (
    <div dir={dir} className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl border border-purple-400/30 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/20 border border-purple-400/30">
          {mode === 'showRecovery'
            ? <KeyRound className="h-8 w-8 text-gold-300" />
            : <ShieldCheck className="h-8 w-8 text-purple-300" />}
        </div>

        <h2 className="mb-2 text-center text-2xl font-extrabold text-white">{title}</h2>
        <p className="mb-6 text-center text-sm leading-relaxed text-white/60">{description}</p>

        {mode === 'showRecovery' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4">
              <div className="mb-3 flex items-center justify-center gap-2 text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-bold">{t('احتفظ بالرمز الآن', 'Save This Code Now')}</span>
              </div>
              <div dir="ltr" className="rounded-xl bg-black/30 p-4 text-center font-mono text-3xl font-extrabold tracking-[0.3em] text-gold-300">
                {recoveryCode}
              </div>
              <button type="button" onClick={() => void copyRecoveryCode()} className="mt-3 w-full rounded-xl bg-white/10 py-3 text-sm font-bold text-white">
                <Copy className="mr-2 inline h-4 w-4" />
                {t('نسخ رمز الاسترداد', 'Copy Recovery Code')}
              </button>
            </div>
            <p className="text-center text-xs text-red-300">
              {t('لن نستطيع إظهار هذا الرمز مرة أخرى بعد المتابعة.', 'This code cannot be displayed again after continuing.')}
            </p>
            <button type="button" onClick={submit} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white">
              {t('حفظت الرمز، متابعة', 'I saved the code, Continue')}
            </button>
          </div>
        ) : (
          <>
            {needsPin && (
              <div className="relative mb-4">
                <input
                  type={showCode ? 'text' : 'password'}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                  disabled={locked || busy}
                  placeholder="••••"
                  className="w-full rounded-xl border border-white/15 bg-black/30 py-4 pl-12 text-center font-mono text-3xl tracking-[0.5em] text-white outline-none focus:border-purple-400"
                  dir="ltr"
                  autoFocus
                />
                <button type="button" onClick={() => setShowCode((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                  {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            )}

            {mode === 'recovery' && (
              <input
                type="password"
                inputMode="numeric"
                autoComplete="off"
                maxLength={8}
                value={recoveryInput}
                onChange={(e) => { setRecoveryInput(e.target.value.replace(/\D/g, '').slice(0, 8)); setError(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
                disabled={locked || busy}
                placeholder="••••••••"
                className="mb-4 w-full rounded-xl border border-white/15 bg-black/30 py-4 text-center font-mono text-2xl tracking-[0.35em] text-white outline-none focus:border-purple-400"
                dir="ltr"
                autoFocus
              />
            )}

            {error && (
              <p className="mb-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-center text-xs text-red-300">{error}</p>
            )}

            {locked && (
              <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-center text-sm text-red-300">
                <LockKeyhole className="mx-auto mb-2 h-5 w-5" />
                {t('الحارس مقفل. حاول بعد:', 'Guard locked. Try again in:')}
                <div className="mt-1 font-mono text-xl font-bold" dir="ltr">
                  {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={locked || busy || (needsPin && pin.length !== 4) || (mode === 'recovery' && recoveryInput.length !== 8)}
              onClick={submit}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white transition disabled:opacity-40"
            >
              {busy ? t('يرجى الانتظار...', 'Please wait...')
                : mode === 'verify' ? t('فتح لوحة ولي الأمر', 'Unlock Dashboard')
                : mode === 'recovery' ? t('التحقق والاسترداد', 'Verify & Recover')
                : t('متابعة', 'Continue')}
            </button>

            {mode === 'verify' && (
              <button type="button" disabled={locked || busy} onClick={() => { setPin(''); setError(''); setMode('recovery'); }} className="mt-3 w-full rounded-xl border border-amber-400/30 bg-amber-500/10 py-3 text-sm font-bold text-amber-200">
                <RefreshCw className="mr-2 inline h-4 w-4" />
                {t('نسيت PIN؟ استرداد الوصول', 'Forgot PIN? Recover Access')}
              </button>
            )}

            {onCancel && mode === 'verify' && (
              <button type="button" onClick={onCancel} className="mt-3 w-full py-2 text-sm text-white/50">
                {t('العودة', 'Go Back')}
              </button>
            )}

            {mode === 'recovery' && (
              <button type="button" onClick={() => { setRecoveryInput(''); setError(''); setMode('verify'); }} className="mt-3 w-full py-2 text-sm text-white/50">
                {t('العودة إلى PIN', 'Back to PIN')}
              </button>
            )}
          </>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30">
          <LockKeyhole className="h-3 w-3" />
          SorobanMind · Local Protection
        </div>
      </div>
    </div>
  );
}