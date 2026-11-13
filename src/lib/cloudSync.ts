// src/lib/cloudSync.ts
import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { resolveDisplayName } from '../utils/resolveDisplayName';
import { getMode } from '../utils/appMode';
import type { User } from '@supabase/supabase-js';

function extractPureState(state: ProgressState) {
  const {
    // استبعاد الأسماء الشخصية (حماية الخصوصية)
    childName: _childName,
    parentName: _parentName,
    
    // استبعاد الدوال
    setChildName, setParentName, setCategory, markLevelComplete, markLessonCompleted,
    markPracticePassed, markAnzanVisualPassed, markAnzanAudioPassed,
    setGrade, getGrades, computeFinalScore, setPendingRemediation,
    clearPendingRemediation, addRemediationSession, setExam1Passed,
    setExam2Passed, recordPlacementAttempt, setAnzanBadge, setAnzanAudioBadge,
    completeEnrichment, recordAttempt, completeLevel, addXP, updateStreak,
    setLanguage, toggleSound, toggleVoice, toggleHaptics, reset,
    buyTicket, consumeTicket,
    completeMentalChapter, recordMentalExam,
    ...pureData
  } = state;
  return pureData;
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

const OWNER_KEY = 'soroban_progress_owner';
const DEVICE_KEYS = [
  'sorobanmind-v2-lang', 'soroban_number_style', 'soroban2d5-theme',
  'soroban_welcome_seen', OWNER_KEY,
];
const OUR_PREFIX = /^(soroban|sorobanmind|srb|sorobania)/;

// 🔒 حماية عمليات المزامنة: لا تعمل إلا في وضع Cloud
function requireCloudMode(): void {
  if (getMode() !== 'cloud') {
    throw new Error('Cloud operation blocked: app is not in Cloud mode.');
  }
}

function wipeLocalProgress() {
  // 🔒 لا تسمح بمسح التقدم إلا عند العمل في وضع Cloud
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

async function pullProgress(userId: string) {
  const { data } = await supabase
    .from('soroban_progress')
    .select('progress_data')
    .eq('user_id', userId)
    .maybeSingle();
  const pd = data?.progress_data as Record<string, unknown> | null | undefined;
  if (pd && Object.keys(pd).length > 0) {
    // تنظيف الأسماء القادمة من السحابة (حماية الخصوصية)
    const { childName: _c, parentName: _p, ...safePd } = pd as any;
    useProgressStore.setState({ ...useProgressStore.getState(), ...safePd });
    applyLocalIdentity(); // إعادة تطبيق هوية البطل
  }
}

function applyLocalIdentity() {
  const key = localStorage.getItem('soroban_hero_key');
  // قراءة اللغة من التخزين المحلي (لأننا خارج مكونات React)
  const lang = (localStorage.getItem('sorobanmind-v2-lang') as 'ar' | 'en') || 'ar';
  const display = key ? resolveDisplayName(key, lang) : '';
  if (display) {
    useProgressStore.getState().setChildName(display);
  }
}

async function adoptUser(user: User): Promise<boolean> {
  requireCloudMode();

  const owner = localStorage.getItem(OWNER_KEY);
  const localName = localStorage.getItem('soroban_child_name');
  const different = owner ? owner !== user.id : !!localName && localName !== 'البطل';

  if (different) {
    wipeLocalProgress();
    try { await pullProgress(user.id); } catch { /* ignore */ }
  }
  localStorage.setItem(OWNER_KEY, user.id);
  applyLocalIdentity();
  if (different) window.setTimeout(() => window.location.reload(), 1200);
  return different;
}

export const cloudSync = {
  // ✅ الآن يستقبل 3 أرجومنتات فقط
  async registerParent(
    email: string,
    password: string,
    consent: ParentalConsent,
  ) {
    requireCloudMode();

    if (!consent || !consent.agreedGuardian || !consent.agreedPrivacy) {
      throw new Error('يجب الموافقة على الأهلية وسياسة الخصوصية.');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
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
    if (data.user.identities && data.user.identities.length === 0) {
      throw new Error('User already registered');
    }

    return { user: data.user, session: data.session };
  },

  async verifyOtp(email: string, token: string, type: 'signup' | 'recovery') {
    requireCloudMode();

    const cleanToken = toLatinDigits(token.trim());
    const { data, error } = await supabase.auth.verifyOtp({
      email, token: cleanToken, type,
    });
    if (error) throw new Error(error.message);

    if (data.session) {
      await adoptUser(data.session.user);
      if (type === 'signup') {
        try {
          await supabase.from('soroban_progress').upsert({
            user_id: data.session.user.id, progress_data: {},
          }, { onConflict: 'user_id' });
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
    // في الوضع السحابي: حاول حفظ التقدم قبل الخروج (إلا إذا force=true)
    if (!force && getMode() === 'cloud') {
      try {
        await this.saveToCloud();
      } catch (error) {
        console.error('[cloudSync] Save before logout failed:', error);
        return false;
      }
    }

    // تنظيف جلسة Supabase (يُسمح به حتى في الوضع المحلي لتنظيف جلسات قديمة)
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[cloudSync] Logout failed:', error);
      return false;
    }

    return true;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) applyLocalIdentity();
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
    const { data, error } = await supabase.from('soroban_progress').select('progress_data').eq('user_id', user.id).single();
    if (error) throw new Error(error.message);
    if (!data || !data.progress_data) throw new Error('No backup found');
    
    // تنظيف الأسماء القادمة من السحابة (حماية الخصوصية)
    const pd = data.progress_data as any;
    const { childName: _c, parentName: _p, ...safePd } = pd;
    
    useProgressStore.setState({ ...useProgressStore.getState(), ...safePd });
    
    // إعادة تطبيق هوية البطل بعد الدمج (لمنع اختفاء الاسم)
    applyLocalIdentity();
    
    return true;
  },

  async submitScore(gameId: string, score: number, timeMs: number | null = null) {
    try {
      requireCloudMode();

      const { error } = await supabase.rpc('submit_score', {
        p_game_id: gameId, p_score: score, p_time_ms: timeMs,
      });
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
      
      const { error } = await supabase.rpc('set_my_avatar', {
        p_avatar_id: avatarId,
      });
      
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

  async setLeaderboardVisibility(isVisible: boolean): Promise<boolean> {
    try {
      requireCloudMode();
      
      const { error } = await supabase.rpc('set_my_leaderboard_visibility', {
        p_visible: isVisible,
      });
      
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
};