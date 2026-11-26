// src/lib/cloudSync.ts
import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { resolveDisplayName } from '../utils/resolveDisplayName';
import { getMode } from '../utils/appMode';
import type { User } from '@supabase/supabase-js';
import {
  switchAccount,
  recoverInterruptedSwitch,
  needsAdoption,
  getActiveAccount,
  getVaultStatus,
} from '../utils/accountVault';

export type CloudSyncErrorCode =
  | 'AUTH_FLOW_BUSY'
  | 'AUTH_REQUIRED'
  | 'PROFILE_FETCH_FAILED'
  | 'PROGRESS_FETCH_FAILED'
  | 'LOCAL_STATE_SNAPSHOT_FAILED'
  | 'LOCAL_STATE_COMMIT_FAILED'
  | 'LOCAL_STATE_WIPE_FAILED'
  | 'ADOPTION_FAILED'
  | 'SESSION_RESTORE_FAILED'
  | 'AVATAR_SYNC_FAILED';

export class CloudSyncError extends Error {
  constructor(
    message: string,
    public readonly code: CloudSyncErrorCode,
  ) {
    super(message);
    this.name = 'CloudSyncError';
  }
}

const AUTH_LOCK_NAME = 'soroban-auth-adoption';

let authFlowInProgress = false;

async function withAuthLock<T>(
  task: () => Promise<T>,
): Promise<T> {
  if (
    typeof navigator === 'undefined' ||
    !navigator.locks
  ) {
    throw new CloudSyncError(
      'Authentication lock unavailable',
      'AUTH_FLOW_BUSY',
    );
  }

  if (authFlowInProgress) {
    throw new CloudSyncError(
      'Authentication flow already in progress',
      'AUTH_FLOW_BUSY',
    );
  }

  authFlowInProgress = true;

  try {
    return await navigator.locks.request(
      AUTH_LOCK_NAME,
      async () => task(),
    );
  } finally {
    authFlowInProgress = false;
  }
}

export interface HallOfFameEntry {
  pos: number;
  avatar_id: string | null;
  sequential_number: number | null;
  score: number;
  time_ms: number | null;
  is_me: boolean;
}

export type HallOfFameResult =
  | { success: true; entries: HallOfFameEntry[]; }
  | { success: false; entries: []; error: string; };

export interface MyRankDetails {
  game_id: string;
  period_key: string;
  player_rank: number;
  avatar_id: string | null;
  sequential_number: number | null;
  score: number;
  time_ms: number | null;
}

export type MyRankDetailsResult =
  | { success: true; data: MyRankDetails[] }
  | { success: false; data: []; error: string };

function extractPureState(state: ProgressState) {
  const {
    childName: _childName, parentName: _parentName,
    setChildName, setParentName, setCategory, markLevelComplete, markLessonCompleted,
    markPracticePassed, markAnzanVisualPassed, markAnzanAudioPassed,
    setGrade, getGrades, computeFinalScore, setPendingRemediation,
    clearPendingRemediation, addRemediationSession, setExam1Passed,
    setExam2Passed, recordPlacementAttempt, setAnzanBadge, setAnzanAudioBadge,
    completeEnrichment, recordAttempt, completeLevel, addXP, updateStreak,
    setLanguage, toggleSound, toggleVoice, toggleHaptics, reset,
    buyTicket, consumeTicket, completeMentalChapter, recordMentalExam,
    ...pureData
  } = state;
  return pureData;
}

export interface LocalStateSnapshot {
  progressState: Record<string, unknown>;
  storageEntries: Array<[string, string]>;
}

export function createLocalStateSnapshot(): LocalStateSnapshot {
  try {
    // نسخة مستقلة من حالة Zustand
    const progressState = JSON.parse(
      JSON.stringify(extractPureState(useProgressStore.getState()))
    );

    // حفظ مفاتيح التطبيق والهوية، دون مفاتيح جلسة Supabase
    const storageEntries: Array<[string, string]> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const bareKey = key.startsWith('cloud:')
        ? key.substring(6)
        : key;

      if (
        OUR_PREFIX.test(bareKey) ||
        key === 'soroban_hero_key' ||
        key === 'soroban_child_name' ||
        key === 'soroban_avatar_pending_upload'
      ) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          storageEntries.push([key, value]);
        }
      }
    }

    return { progressState, storageEntries };
  } catch (error) {
    throw new CloudSyncError(
      'Failed to snapshot local state',
      'LOCAL_STATE_SNAPSHOT_FAILED',
    );
  }
}
export function restoreLocalStateSnapshot(snapshot: LocalStateSnapshot): void {
  try {
    const savedKeys = new Set(
      snapshot.storageEntries.map(([key]) => key)
    );

    // حذف مفاتيح التطبيق التي ظهرت بعد أخذ Snapshot
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const bareKey = key.startsWith('cloud:')
        ? key.substring(6)
        : key;

      if (OUR_PREFIX.test(bareKey) && !savedKeys.has(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // استعادة المفاتيح وقيمها السابقة
    snapshot.storageEntries.forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

        // استعادة حالة Zustand
    useProgressStore.setState(snapshot.progressState);

    // إعادة بناء هوية البطل من المفتاح المستعاد
    applyLocalIdentity();
  } catch {
    throw new CloudSyncError(
      'Failed to restore local state',
      'LOCAL_STATE_COMMIT_FAILED',
    );
  }
}

export interface ParentalConsent {
  childAge?: number;
  agreedGuardian: boolean;
  agreedData?: boolean;
  agreedPrivacy: boolean;
  agreedLeaderboard?: boolean;
  timestamp: string;
}

const toLatinDigits = (str: string) => {
  return str.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
            .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
};

function normalizeLeaderboardPeriod(period: string = 'all'): string {
  if (period === 'all') return 'all';
  if (period === 'month') {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(period)) return period;
  throw new Error(`Invalid leaderboard period: ${period}`);
}

const OWNER_KEY = 'soroban_progress_owner';

const MAIN_PROGRESS_KEY = 'cloud:sorobanmind-v2-progress';

function accountNeedsAdoption(userId: string): boolean {
  try {
    const owner = localStorage.getItem(OWNER_KEY);
    return owner !== userId ||
      needsAdoption(localStorage, userId, owner);
  } catch {
    return true;
  }
}

const DEVICE_KEYS = [
  'sorobanmind-v2-lang', 'soroban_number_style', 'soroban2d5-theme',
  'soroban_welcome_seen', OWNER_KEY,
];
const OUR_PREFIX = /^(soroban|sorobanmind|srb|sorobania)/;

function requireCloudMode(): void {
  if (getMode() !== 'cloud') {
    throw new Error('Cloud operation blocked: app is not in Cloud mode.');
  }
}

async function pullProgress(
  userId: string,
): Promise<Record<string, unknown> | null> {
  const { data, error } = await supabase
    .from('soroban_progress')
    .select('progress_data')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new CloudSyncError(
      'Failed to fetch cloud progress',
      'PROGRESS_FETCH_FAILED',
    );
  }

  const pd = data?.progress_data as
    | Record<string, unknown>
    | null
    | undefined;

  if (!pd || Object.keys(pd).length === 0) {
    return null;
  }

  const {
    childName: _childName,
    parentName: _parentName,
    ...safePd
  } = pd;

  return safePd;
}

function applyLocalIdentity() {
  const key = localStorage.getItem('soroban_hero_key');
  const lang = (localStorage.getItem('sorobanmind-v2-lang') as 'ar' | 'en') || 'ar';
  const display = key ? resolveDisplayName(key, lang) : '';
  if (display) {
    try {
      localStorage.setItem('soroban_child_name', display);
    } catch { /* ignore */ }
    useProgressStore.getState().setChildName(display);
  }
}


let retryingAvatar = false;

async function retryPendingAvatar() {
  if (retryingAvatar) return;
  if (getMode() !== 'cloud') return;

  retryingAvatar = true;

  try {
    await withAuthLock(async () => {
      const ownerAtStart = localStorage.getItem(OWNER_KEY);
      const keyAtStart = localStorage.getItem('soroban_hero_key');
      const pendingAtStart = localStorage.getItem(
        'soroban_avatar_pending_upload'
      );

      if (
        !ownerAtStart ||
        !keyAtStart ||
        pendingAtStart !== '1'
      ) {
        return;
      }

      // التأكد من أن الهوية المخزنة تخص حساب Supabase الحالي.
      const { data: { user }, error: userError } =
        await supabase.auth.getUser();

      if (userError || !user || user.id !== ownerAtStart) {
        return;
      }

      const { error } = await supabase.rpc('set_my_avatar', {
        p_avatar_id: keyAtStart,
      });

      if (error) return;

      // التحقق من ثبات الهوية والطلب بعد انتهاء RPC.
      if (
        localStorage.getItem(OWNER_KEY) === ownerAtStart &&
        localStorage.getItem('soroban_hero_key') === keyAtStart &&
        localStorage.getItem('soroban_avatar_pending_upload') === pendingAtStart
      ) {
        localStorage.removeItem('soroban_avatar_pending_upload');
      }
    });
  } catch (error) {
    if (
      error instanceof CloudSyncError &&
      error.code === 'AUTH_FLOW_BUSY'
    ) {
      return;
    }

    // أي فشل آخر: نحتفظ بعلم الانتظار لإعادة المحاولة لاحقاً.
  } finally {
    retryingAvatar = false;
  }
}


async function adoptUser(user: User): Promise<void> {
  requireCloudMode();

  const owner = localStorage.getItem(OWNER_KEY);
  const different = !owner || owner !== user.id;

  const pendingAvatar =
    localStorage.getItem('soroban_avatar_pending_upload') === '1' &&
    (!owner || owner === user.id);

  const pendingHeroKey = pendingAvatar
    ? localStorage.getItem('soroban_hero_key')
    : null;

  const { data: profile, error: profileError } = await supabase
    .from('public_profiles')
    .select('avatar_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    throw new CloudSyncError(
      'Failed to fetch account profile',
      'PROFILE_FETCH_FAILED',
    );
  }

  const cloudProgress = different
    ? await pullProgress(user.id)
    : null;

  const cloudAvatarId: string | null = profile?.avatar_id ?? null;
  const snapshot = createLocalStateSnapshot();

  let previousSlot: string | null = null;
  let switched = false;

  try {
    // تحديد وجود خزنة الحساب الهدف قبل التبديل.
    const hadVault = getVaultStatus(localStorage).vaults.includes(user.id);

    // توافق مع الأجهزة القديمة التي لا تملك vault:slot.
    if (getActiveAccount(localStorage) === null && owner) {
      switchAccount(localStorage, owner);
    }

    previousSlot = getActiveAccount(localStorage);
    switched = switchAccount(localStorage, user.id) === 'swapped';

    if (different || switched) {
      // قراءة تقدم الحساب الهدف قبل reset لأن persist قد يكتب الافتراضيات.
      let restored: Record<string, unknown> | null = null;

      try {
        const raw = localStorage.getItem(MAIN_PROGRESS_KEY);
        const parsed = raw ? JSON.parse(raw) : null;

        if (
          parsed &&
          typeof parsed.state === 'object' &&
          parsed.state !== null
        ) {
          const {
            childName: _childName,
            parentName: _parentName,
            ...rest
          } = parsed.state as Record<string, unknown>;

          restored = rest;
        }
      } catch {
        restored = null;
      }

      useProgressStore.getState().reset();

      // الحساب العائد: الخزنة المحلية لها الأولوية.
      // الحساب الذي لا يملك خزنة: بيانات السحابة هي المصدر.
      const source = (
        hadVault ? (restored ?? cloudProgress) : cloudProgress
      ) as typeof cloudProgress;

      if (source) {
        useProgressStore.setState(source);
      }
    }

    if (different) {
      localStorage.removeItem('soroban_avatar_pending_upload');
      localStorage.removeItem('soroban_hero_key');
      localStorage.removeItem('soroban_child_name');
      if (owner && owner !== user.id) {
  localStorage.removeItem('soroban_child_full_name');
      }
    }

    if (cloudAvatarId) {
      localStorage.setItem('soroban_hero_key', cloudAvatarId);
      localStorage.removeItem('soroban_avatar_pending_upload');
      applyLocalIdentity();
    } else if (pendingAvatar && pendingHeroKey) {
      localStorage.setItem('soroban_hero_key', pendingHeroKey);
      applyLocalIdentity();

      try {
        const { error: avatarError } = await supabase.rpc('set_my_avatar', {
          p_avatar_id: pendingHeroKey,
        });

        if (avatarError) {
          console.warn('تعذرت مزامنة شخصية البطل:', avatarError.message);
        } else {
          localStorage.removeItem('soroban_avatar_pending_upload');
        }
      } catch (err) {
        console.warn('خطأ في مزامنة شخصية البطل:', err);
      }
    } else {
      localStorage.removeItem('soroban_avatar_pending_upload');
      applyLocalIdentity();
    }

    // OWNER_KEY آخر كتابة محلية في مسار الاعتماد.
    localStorage.setItem(OWNER_KEY, user.id);
  } catch (error) {
    try {
      recoverInterruptedSwitch(localStorage);

      if (switched && previousSlot) {
        switchAccount(localStorage, previousSlot);
      }

      restoreLocalStateSnapshot(snapshot);
    } catch {
      throw new CloudSyncError(
        'Failed to restore previous local state',
        'SESSION_RESTORE_FAILED',
      );
    }

    if (error instanceof CloudSyncError) {
      throw error;
    }

    throw new CloudSyncError(
      'Account adoption failed',
      'ADOPTION_FAILED',
    );
  }

  if (different || switched) {
    window.location.reload();
  }
}

async function restorePreviousSession(
  previousSession: {
    access_token: string;
    refresh_token: string;
  } | null,
): Promise<void> {
  try {
    if (previousSession) {
      const { error } = await supabase.auth.setSession({
        access_token: previousSession.access_token,
        refresh_token: previousSession.refresh_token,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signOut({
        scope: 'local',
      });

      if (error) throw error;
    }
  } catch {
    throw new CloudSyncError(
      'Failed to restore previous session',
      'SESSION_RESTORE_FAILED',
    );
  }
}

export const cloudSync = {
  async registerParent(email: string, password: string, consent: ParentalConsent) {
    requireCloudMode();
    if (!consent || !consent.agreedGuardian || !consent.agreedPrivacy) {
      throw new Error('يجب الموافقة على الأهلية وسياسة الخصوصية.');
    }
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          consent_guardian: consent.agreedGuardian,
          consent_privacy: consent.agreedPrivacy,
          consent_leaderboard: !!consent.agreedLeaderboard,
          consent_timestamp: consent.timestamp,
        },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Failed to create account');
    if (data.user.identities && data.user.identities.length === 0) throw new Error('User already registered');
    return { user: data.user, session: data.session };
  },

  async verifyOtp(
    email: string,
    token: string,
    type: 'signup' | 'recovery',
  ) {
    requireCloudMode();

    return withAuthLock(async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new CloudSyncError(
          'Failed to read previous session',
          'SESSION_RESTORE_FAILED',
        );
      }

      const previousSession = sessionData.session
        ? {
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
          }
        : null;

      try {
        const cleanToken = toLatinDigits(token.trim());

        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: cleanToken,
          type,
        });

        if (error) throw new Error(error.message);

        if (data.session) {
          await adoptUser(data.session.user);

          if (type === 'signup') {
            try {
              await supabase.from('soroban_progress').upsert(
                {
                  user_id: data.session.user.id,
                  progress_data: {},
                },
                { onConflict: 'user_id', ignoreDuplicates: true },
              );
            } catch {
              // ignore
            }
          }
        }

        return data;
      } catch (error) {
        await restorePreviousSession(previousSession);
        throw error;
      }
    });
  },

  async loginParent(email: string, password: string) {
    requireCloudMode();

    return withAuthLock(async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new CloudSyncError(
          'Failed to read previous session',
          'SESSION_RESTORE_FAILED',
        );
      }

      const previousSession = sessionData.session
        ? {
            access_token: sessionData.session.access_token,
            refresh_token: sessionData.session.refresh_token,
          }
        : null;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('Login failed');

        await adoptUser(data.user);

        return data.user;
      } catch (error) {
        await restorePreviousSession(previousSession);
        throw error;
      }
    });
  },

  async logoutParent(force = false): Promise<boolean> {
    if (!force && getMode() === 'cloud') {
      try { await this.saveToCloud(); } catch (error) {
        console.error('[cloudSync] Save before logout failed:', error);
        return false;
      }
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[cloudSync] Logout failed:', error);
      return false;
    }
    return true;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      const sessionUser = data.session.user;

      if (
        getMode() === 'cloud' &&
        accountNeedsAdoption(sessionUser.id)
      ) {
        // لا نعرض جلسة غير معتمدة أثناء عملية دخول جارية.
        if (authFlowInProgress) {
          return null;
        }

        try {
          await withAuthLock(async () => {
            await adoptUser(sessionUser);
          });
        } catch {
          try {
            await supabase.auth.signOut({ scope: 'local' });
          } catch {
            // فشل الخروج المحلي لا يسمح بإرجاع الجلسة.
          }

          return null;
        }
      }

      applyLocalIdentity();
      void retryPendingAvatar();
    }

    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (data.user) applyLocalIdentity();
    return data.user;
  },

  async requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return true;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return true;
  },

  async resendOtp(email: string, type: 'signup' | 'recovery') {
    if (type === 'signup') {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
    }
    return true;
  },

  async saveToCloud() {
    requireCloudMode();
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');
    const pureData = extractPureState(useProgressStore.getState());
    const { error } = await supabase.from('soroban_progress').upsert({
      user_id: user.id, progress_data: pureData, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
    if (error) throw new Error(error.message);
    return true;
  },

  async loadFromCloud(beforeApply?: () => void) {
    requireCloudMode();

    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');

    // 1. جلب التقدم السحابي
    const { data, error } = await supabase
      .from('soroban_progress')
      .select('progress_data')
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('No backup found');

    const pd: unknown = data.progress_data;

    // {} صالح، أما null والمصفوفات والقيم البدائية فمرفوضة
    if (
      typeof pd !== 'object' ||
      pd === null ||
      Array.isArray(pd)
    ) {
      throw new Error('Invalid cloud backup');
    }

    // 2. جلب الشخصية قبل أي تعديل محلي
    const { data: profile, error: profileError } = await supabase
      .from('public_profiles')
      .select('avatar_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    // 3. أخذ Snapshot من المنسق قبل أول تغيير
    beforeApply?.();

    // 4. Reset ثم تطبيق بيانات السحابة
    const {
      childName: _childName,
      parentName: _parentName,
      ...safePd
    } = pd as Record<string, unknown>;

    useProgressStore.getState().reset();

    useProgressStore.setState(
      safePd as Partial<ProgressState>
    );

    // 5. تحديث هوية الشخصية، وعدم الاحتفاظ بهوية قديمة
    if (profile?.avatar_id) {
      localStorage.setItem(
        'soroban_hero_key',
        profile.avatar_id
      );
    } else {
      localStorage.removeItem('soroban_hero_key');
      localStorage.removeItem('soroban_child_name');
    }

    applyLocalIdentity();

    // 6. التحقق من نجاح حفظ Zustand في مفتاح Cloud
    const rawProgress = localStorage.getItem(
      'cloud:sorobanmind-v2-progress'
    );

    if (!rawProgress) {
      throw new Error('Failed to persist restored progress');
    }

    const persisted = JSON.parse(rawProgress) as {
      state?: unknown;
    };

    const currentState = JSON.parse(
      JSON.stringify(useProgressStore.getState())
    );

    if (
      !persisted.state ||
      JSON.stringify(persisted.state) !==
        JSON.stringify(currentState)
    ) {
      throw new Error('Restored progress persistence mismatch');
    }

    // 7. التحقق من حفظ هوية الشخصية
    const storedChildName =
      localStorage.getItem('soroban_child_name') ?? '';

    if (
      storedChildName !==
      useProgressStore.getState().childName
    ) {
      throw new Error('Failed to persist restored identity');
    }

    return true;
  },

  async submitScore(gameId: string, score: number, timeMs: number | null = null) {
    try {
      requireCloudMode();
      const { error } = await supabase.rpc('submit_score', { p_game_id: gameId, p_score: score, p_time_ms: timeMs });
      if (error) { 
        console.warn('🚨 خطأ سوباباسي أثناء حفظ النقاط:', error.message); 
        return false; 
      }
      return true;
    } catch (err) {
      console.warn('🚨 خطأ في الشبكة أثناء حفظ النقاط:', String(err));
      return false;
    }
  },

  async setMyAvatar(avatarId: string): Promise<boolean> {
    try {
      requireCloudMode();
      const { error } = await supabase.rpc('set_my_avatar', { p_avatar_id: avatarId });
      if (error) { 
        console.warn('🚨 خطأ في حفظ الشخصية السحابية:', error.message); 
        return false; 
      }
      return true;
    } catch (err) {
      console.warn('🚨 خطأ في الشبكة أثناء حفظ الشخصية:', String(err));
      return false;
    }
  },

  async getLeaderboardVisibility(): Promise<boolean> {
    requireCloudMode();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      throw new Error(userError.message);
    }

    if (!userData.user) {
      throw new Error('يجب تسجيل الدخول أولاً.');
    }

    const { data, error } = await supabase
      .from('public_profiles')
      .select('show_on_leaderboard')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data?.show_on_leaderboard === true;
  },

  async setLeaderboardVisibility(isVisible: boolean): Promise<boolean> {
    try {
      requireCloudMode();
      const { error } = await supabase.rpc('set_my_leaderboard_visibility', { p_visible: isVisible });
      if (error) { 
        console.warn('🚨 خطأ في تحديث موافقة الظهور:', error.message); 
        return false; 
      }
      return true;
    } catch (err) {
      console.warn('🚨 خطأ في الشبكة أثناء تحديث الموافقة:', String(err));
      return false;
    }
  },

  async getHallOfFame(gameId: string, period: string = 'all', limit: number = 10): Promise<HallOfFameResult> {
    try {
      requireCloudMode();
      const normalizedPeriod = normalizeLeaderboardPeriod(period);

      const { data, error } = await supabase.rpc('get_hall_of_fame_v2', {
        p_game_id: gameId, p_period: normalizedPeriod, p_limit: limit,
      });

      if (error) {
        console.warn('تعذر جلب لوحة الشرف V2:', error.message);
        return { success: false, entries: [], error: error.message };
      }
      return { success: true, entries: Array.isArray(data) ? (data as HallOfFameEntry[]) : [] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.warn('خطأ أثناء جلب لوحة الشرف:', err);
      return { success: false, entries: [], error: message };
    }
  },

  async getMyRankDetails(gameId: string, period: string = 'all'): Promise<MyRankDetailsResult> {
    try {
      requireCloudMode();
      const normalizedPeriod = normalizeLeaderboardPeriod(period);

      const { data, error } = await supabase.rpc('get_my_rank_details_v2', {
        p_game_id: gameId, p_period: normalizedPeriod,
      });

      if (error) {
        return { success: false, data: [], error: error.message };
      }
      return { success: true, data: Array.isArray(data) ? (data as MyRankDetails[]) : [] };
    } catch (err) {
      return { success: false, data: [], error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
