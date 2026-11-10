// src/lib/cloudSync.ts
import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { maskName } from '../utils/maskName';
import type { User } from '@supabase/supabase-js'; // 🆕 أُضيف لعزل الحسابات

function extractPureState(state: ProgressState) {
  const {
    setChildName, setParentName, setCategory, markLevelComplete, markLessonCompleted,
    markPracticePassed, markAnzanVisualPassed, markAnzanAudioPassed,
    setGrade, getGrades, computeFinalScore, setPendingRemediation,
    clearPendingRemediation, addRemediationSession, setExam1Passed,
    setExam2Passed, recordPlacementAttempt, setAnzanBadge, setAnzanAudioBadge,
    completeEnrichment, recordAttempt, completeLevel, addXP, updateStreak,
    setLanguage, toggleSound, toggleVoice, toggleHaptics, reset,
    buyTicket, consumeTicket, ...pureData
  } = state;
  return pureData;
}

export interface ParentalConsent {
  childAge: number;
  agreedGuardian: boolean;
  agreedData: boolean;
  agreedPrivacy: boolean;
  timestamp: string;
}

// دالة مساعدة محلية لتحويل الأرقام العربية
const toLatinDigits = (str: string) => {
  return str.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
            .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
};

// ═══════════════════════════════════════════════════════════
// 🆕 عزل الحسابات (لمنع تلوث البيانات بين الأطفال)
// ═══════════════════════════════════════════════════════════
const OWNER_KEY = 'soroban_progress_owner';
const DEVICE_KEYS = [
  'sorobanmind-v2-lang', 'soroban_number_style', 'soroban2d5-theme',
  'soroban_welcome_seen', OWNER_KEY,
];
const OUR_PREFIX = /^(soroban|sorobanmind|srb|sorobania)/;

function wipeLocalProgress() {
  Object.keys(localStorage).forEach((k) => {
    if (OUR_PREFIX.test(k) && !DEVICE_KEYS.includes(k)) localStorage.removeItem(k);
  });
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
    useProgressStore.setState({ ...useProgressStore.getState(), ...(pd as any) });
  }
}

async function adoptUser(user: User): Promise<boolean> {
  const meta = user.user_metadata || {};
  const owner = localStorage.getItem(OWNER_KEY);
  const localName = localStorage.getItem('soroban_child_name');
  const newName: string | undefined = meta.child_name;

  const different = owner
    ? owner !== user.id
    : !!localName && localName !== 'البطل' && !!newName && localName !== newName;

  if (different) {
    wipeLocalProgress();
    try { await pullProgress(user.id); } catch { /* يبقى فارغاً */ }
  }
  localStorage.setItem(OWNER_KEY, user.id);

  if (different) window.setTimeout(() => window.location.reload(), 1200);
  return different;
}
// ═══════════════════════════════════════════════════════════

export const cloudSync = {
  // ═══ 1. التسجيل ═══
  async registerParent(
    email: string,
    password: string,
    parentName: string,
    childName: string,
    consent: ParentalConsent,
  ) {
    if (!consent || !consent.agreedGuardian || !consent.agreedData || !consent.agreedPrivacy) {
      throw new Error('يجب الموافقة على جميع الشروط للمتابعة.');
    }
    if (!consent.childAge || consent.childAge < 5 || consent.childAge > 18) {
      throw new Error('Invalid child age. Must be between 5 and 18.');
    }

    const trimmedParent = parentName.trim();
    const trimmedChild = childName.trim();
    const maskedChild = maskName(trimmedChild);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          parent_name: trimmedParent,
          child_name: trimmedChild,
          child_masked_name: maskedChild,
          child_age: consent.childAge,
          consent_guardian: consent.agreedGuardian,
          consent_data: consent.agreedData,
          consent_privacy: consent.agreedPrivacy,
          consent_timestamp: consent.timestamp,
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Failed to create account');

    // 🆕 فحص البريد المسجل مسبقاً (Supabase يعيد مستخدماً وهمياً بدل خطأ)
    if (data.user.identities && data.user.identities.length === 0) {
      throw new Error('User already registered');
    }

    return { user: data.user, session: data.session };
  },

  // ═══ 2. التحقق من الرمز (OTP) ═══
  async verifyOtp(email: string, token: string, type: 'signup' | 'recovery') {
    const cleanToken = toLatinDigits(token.trim());
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: cleanToken,
      type,
    });

    if (error) throw new Error(error.message);
    
    if (data.session) {
      // 🆕 استدعاء adoptUser قبل كتابة الاسم
      await adoptUser(data.session.user);

      const meta = data.session.user.user_metadata || {};
      useProgressStore.getState().setParentName(meta.parent_name || 'ولي الأمر');
      useProgressStore.getState().setChildName(meta.child_name || 'البطل');
      localStorage.setItem('soroban_child_name', meta.child_name || 'البطل');

      // إنشاء صف التقدم الآن (بعد توفر الجلسة)
      if (type === 'signup') {
        try {
          await supabase.from('soroban_progress').upsert({
            user_id: data.session.user.id,
            progress_data: {},
          }, { onConflict: 'user_id' });
        } catch {
          // نتجاهل الخطأ هنا، saveToCloud سيعيد المحاولة لاحقاً
        }
      }
    }
    
    return data;
  },

  // ═══ 3. تسجيل الدخول ═══
  async loginParent(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');

    // 🆕 استدعاء adoptUser (المقارنة تحتاج الاسم المحلي القديم قبل أن يُكتب الجديد)
    await adoptUser(data.user);

    const meta = data.user.user_metadata || {};
    const pName = meta.parent_name || 'ولي الأمر';
    const cName = meta.child_name || 'البطل';
    
    let maskedName = meta.child_masked_name;
    if (!maskedName) {
      maskedName = maskName(cName);
      await supabase.auth.updateUser({ data: { child_masked_name: maskedName } });
    }

    useProgressStore.getState().setParentName(pName);
    useProgressStore.getState().setChildName(cName);
    localStorage.setItem('soroban_child_name', cName);

    return data.user;
  },

  // ═══ 4. تسجيل الخروج ═══
  async logoutParent(force = false): Promise<boolean> {
    if (!force) {
      try {
        await this.saveToCloud();
      } catch {
        return false;
      }
    }
    await supabase.auth.signOut();
    return true;
  },

  // ═══ 5. جلب الجلسة ═══
  async getSession() {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      const meta = data.session.user.user_metadata || {};
      useProgressStore.getState().setParentName(meta.parent_name || 'ولي الأمر');
      useProgressStore.getState().setChildName(meta.child_name || 'البطل');
      localStorage.setItem('soroban_child_name', meta.child_name || 'البطل');
    }
    return data.session;
  },

  // ═══ 6. جلب المستخدم الحالي ═══
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (data.user) {
      const meta = data.user.user_metadata || {};
      useProgressStore.getState().setParentName(meta.parent_name || 'ولي الأمر');
      useProgressStore.getState().setChildName(meta.child_name || 'البطل');
      localStorage.setItem('soroban_child_name', meta.child_name || 'البطل');
    }
    return data.user;
  },

  // ═══ 7. طلب إعادة تعيين كلمة المرور ═══
  async requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 8. تحديث كلمة المرور ═══
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 9. إعادة إرسال الرمز ═══
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

  // ═══ 10. حفظ واستعادة التقدم ═══
  async saveToCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');

    const pureData = extractPureState(useProgressStore.getState());
    const { error } = await supabase.from('soroban_progress').upsert({
      user_id: user.id,
      progress_data: pureData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);
    return true;
  },

  async loadFromCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase.from('soroban_progress').select('progress_data').eq('user_id', user.id).single();
    if (error) throw new Error(error.message);
    if (!data || !data.progress_data) throw new Error('No backup found');

    useProgressStore.setState({ ...useProgressStore.getState(), ...(data.progress_data as any) });
    return true;
  },

    // ═══ 11. إرسال الدرجة للوحة الشرف (مؤقت للاختبار) ═══
  async submitScore(gameId: string, score: number, timeMs: number | null = null) {
    try {
      const { error } = await supabase.rpc('submit_score', {
        p_game_id: gameId,
        p_score: score,
        p_time_ms: timeMs,
      });
      if (error) {
        alert('🚨 خطأ سوباباسي: ' + error.message);
        return false;
      }
      alert('✅ تم الحفظ في السحابة بنجاح!');
      return true;
    } catch (err) {
      alert('🚨 خطأ في الشبكة: ' + String(err));
      return false;
    }
  },
}; // 👈 هذا القوس ضروري جداً لإغلاق الكائن cloudSync