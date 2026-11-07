// src/lib/cloudSync.ts
// ☁️ نظام المزامنة المبسط (نظام 2)
// [تحديث] إضافة الموافقة الأبوية (COPPA/GDPR) + حفظ الاسم المقنّع + استعادة كلمة المرور

import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';
import { maskName } from '../utils/maskName';

// استخراج البيانات النقية (بدون الدوال) لحفظها في السيرفر
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

export const cloudSync = {
  // ═══ 1. التسجيل (أسماء + موافقة أبوية) ═══
  async registerParent(
    email: string,
    password: string,
    parentName: string,
    childName: string,
    consent: ParentalConsent,
  ) {
    if (!consent) throw new Error('Parental consent is required / الموافقة الأبوية مطلوبة');
    if (!consent.agreedGuardian) throw new Error('You must confirm you are the guardian (18+).');
    if (!consent.agreedData) throw new Error('You must agree to data collection.');
    if (!consent.agreedPrivacy) throw new Error('You must agree to Privacy Policy & ToS.');
    // تحديث: العمر يبدأ من 5 سنوات
    if (!consent.childAge || consent.childAge < 5 || consent.childAge > 18) throw new Error('Invalid child age. Must be between 5 and 18.');

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

    // تحديث المتجر المحلي فوراً (حتى لو لم يتم التفعيل بعد)
    useProgressStore.getState().setParentName(trimmedParent);
    useProgressStore.getState().setChildName(trimmedChild);
    localStorage.setItem('soroban_child_name', trimmedChild);

    // إنشاء صف التقدم في الجدول (إذا لم يكن موجوداً)
    await supabase.from('soroban_progress').upsert({
      user_id: data.user.id,
      progress_data: {},
    }, { onConflict: 'user_id' });

    // نرجع بيانات المستخدم والجلسة (لمعرفة هل يحتاج تفعيل بريد)
    return { user: data.user, session: data.session };
  },

  // ═══ 2. تسجيل الدخول ═══
  async loginParent(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');

    const meta = data.user.user_metadata || {};
    const pName = meta.parent_name || 'ولي الأمر';
    const cName = meta.child_name || 'البطل';
    
    useProgressStore.getState().setParentName(pName);
    useProgressStore.getState().setChildName(cName);
    localStorage.setItem('soroban_child_name', cName);

    return data.user;
  },

  // ═══ 3. تسجيل الخروج ═══
  async logoutParent() {
    await supabase.auth.signOut();
  },

  // ═══ 4. جلب الجلسة (بدون إنترنت) ═══
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

  // ═══ 5. جلب المستخدم الحالي ═══
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

  // ═══ 6. طلب إعادة تعيين كلمة المرور (نسيت كلمة المرور) ═══
  async requestPasswordReset(email: string) {
    // نأخذ رابط الصفحة الحالي (بدون أي بارامترات إضافية) ليعود إليه المستخدم
    const redirectUrl = window.location.href.split('?')[0].split('#')[0]; 
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 7. تحديث كلمة المرور بعد الضغط على الرابط ═══
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 8. حفظ التقدم ═══
  async saveToCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in / يجب تسجيل الدخول');

    const pureData = extractPureState(useProgressStore.getState());
    const { error } = await supabase.from('soroban_progress').upsert({
      user_id: user.id,
      progress_data: pureData,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 9. استعادة التقدم ═══
  async loadFromCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in / يجب تسجيل الدخول');

    const { data, error } = await supabase.from('soroban_progress').select('progress_data').eq('user_id', user.id).single();
    if (error) throw new Error(error.message);
    if (!data || !data.progress_data) throw new Error('No backup found / لا توجد نسخة احتياطية');

    useProgressStore.setState({ ...useProgressStore.getState(), ...(data.progress_data as any) });
    return true;
  },
};