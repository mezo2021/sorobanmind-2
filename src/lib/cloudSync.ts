// src/lib/cloudSync.ts
import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { resolveDisplayName } from '../utils/resolveDisplayName';
import { getMode } from '../utils/appMode';
import type { User } from '@supabase/supabase-js';

export type CloudSyncErrorCode =
  | 'AUTH_FLOW_BUSY'
  | 'AUTH_REQUIRED'
  | 'PROFILE_FETCH_FAILED'
  | 'PROGRESS_FETCH_FAILED'
  | 'LOCAL_STATE_SNAPSHOT_FAILED'
  | 'LOCAL_STATE_COMMIT_FAILED'
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

interface LocalStateSnapshot {
  progressState: Record<string, unknown>;
  storageEntries: Array<[string, string]>;
}

function createLocalStateSnapshot(): LocalStateSnapshot {
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
function restoreLocalStateSnapshot(snapshot: LocalStateSnapshot): void {
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

function wipeLocalProgress() {
  if (getMode() !== 'cloud') {
    console.warn('wipeLocalProgress blocked: app is not in Cloud mode.');
    return;
  }
  const keysToRemove: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('cloud:')) continue;
      if (DEVICE_KEYS.includes(key)) continue;
      const bareKey = key.substring(6);
      if (OUR_PREFIX.test(bareKey)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  } catch { /* ignore */ }
  useProgressStore.getState().reset();
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
  if (localStorage.getItem('soroban_avatar_pending_upload') !== '1') return;

  const key = localStorage.getItem('soroban_hero_key');
  if (!key) return;

  retryingAvatar = true;
  try {
    const { error } = await supabase.rpc('set_my_avatar', { p_avatar_id: key });
    if (!error) localStorage.removeItem('soroban_avatar_pending_upload');
  } catch {
    // يُعاد المحاولة لاحقاً
  } finally {
    retryingAvatar = false;
  }
}


async function adoptUser(user: User): Promise<boolean> {
  requireCloudMode();

  const owner = localStorage.getItem(OWNER_KEY);
  const different = !owner || owner !== user.id;

  // لا ننقل اختياراً معلّقاً من حساب سحابي سابق إلى حساب آخر.
  const pendingAvatar =
    localStorage.getItem('soroban_avatar_pending_upload') === '1' &&
    (!owner || owner === user.id);

  const pendingHeroKey = pendingAvatar
    ? localStorage.getItem('soroban_hero_key')
    : null;

  // جلب بيانات الحساب قبل لمس الحالة المحلية.
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

  // Snapshot قبل أول تغيير محلي.
  const snapshot = createLocalStateSnapshot();

  try {
    if (different) {
      wipeLocalProgress();

      localStorage.removeItem('soroban_avatar_pending_upload');
      localStorage.removeItem('soroban_hero_key');
      localStorage.removeItem('soroban_child_name');

      if (cloudProgress) {
        useProgressStore.setState(cloudProgress);
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

    // OWNER_KEY آخر خطوة بعد نجاح التغييرات المحلية.
    localStorage.setItem(OWNER_KEY, user.id);
  } catch (error) {
    try {
      restoreLocalStateSnapshot(snapshot);
    } catch {
      throw new CloudSyncError(
        'Failed to restore previous local state',
        'SESSION_RESTORE_FAILED',
      );
    }

    throw new CloudSyncError(
      'Account adoption failed',
      'ADOPTION_FAILED',
    );
  }

  if (different) {
    window.setTimeout(() => window.location.reload(), 1200);
  }

  return different;
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

  async verifyOtp(email: string, token: string, type: 'signup' | 'recovery') {
    requireCloudMode();
    const cleanToken = toLatinDigits(token.trim());
    const { data, error } = await supabase.auth.verifyOtp({ email, token: cleanToken, type });
    if (error) throw new Error(error.message);
    if (data.session) {
      await adoptUser(data.session.user);
      if (type === 'signup') {
        try {
          await supabase.from('soroban_progress').upsert({ user_id: data.session.user.id, progress_data: {} }, { onConflict: 'user_id' });
        } catch { /* ignore */ }
      }
    }
    return data;
  },

  async loginParent(email: string, password: string) {
    requireCloudMode();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');
    await adoptUser(data.user);
    return data.user;
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

  async loadFromCloud() {
    requireCloudMode();

    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('soroban_progress')
      .select('progress_data')
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);
    if (!data || !data.progress_data) {
      throw new Error('No backup found');
    }

    const { data: profile, error: profileError } = await supabase
      .from('public_profiles')
      .select('avatar_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) {
      throw new Error(profileError.message);
    }

    const pd = data.progress_data as any;
    const { childName: _c, parentName: _p, ...safePd } = pd;

    useProgressStore.setState({
      ...useProgressStore.getState(),
      ...safePd,
    });

    if (profile?.avatar_id) {
      localStorage.setItem('soroban_hero_key', profile.avatar_id);
    }

    applyLocalIdentity();

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