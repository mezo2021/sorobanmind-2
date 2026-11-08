// src/lib/cloudSync.ts
import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { maskName } from '../utils/maskName';

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

    // 🆕 تم نقل upsert إلى verifyOtp (لأنه يحتاج جلسة صالحة)
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
      const meta = data.session.user.user_metadata || {};
      useProgressStore.getState().setParentName(meta.parent_name || 'ولي الأمر');
      useProgressStore.getState().setChildName(meta.child_name || 'البطل');
      localStorage.setItem('soroban_child_name', meta.child_name || 'البطل');

      // 🆕 إنشاء صف التقدم الآن (بعد توفر الجلسة)
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
};