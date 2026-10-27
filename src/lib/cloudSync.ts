// src/lib/cloudSync.ts
// ☁️ نظام المزامنة المبسط (نظام 2)
// - يحفظ الأسماء في user_metadata (لا جداول أطفال)
// - يحفظ التقدم في جدول soroban_progress (عمودان فقط)
// - يزامن localStorage مع المتجر لشاشة البطل

import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';

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

export const cloudSync = {
  // ═══ 1. التسجيل (أسماء في user_metadata) ═══
  async registerParent(email: string, password: string, parentName: string, childName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          parent_name: parentName.trim(),
          child_name: childName.trim(),
        },
      },
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Failed to create account');

    // تحديث المتجر المحلي فوراً
    useProgressStore.getState().setParentName(parentName.trim());
    useProgressStore.getState().setChildName(childName.trim());
    
    // 👇 تحديث الذاكرة المحلية لكي تقرأها شاشة البطل فوراً
    localStorage.setItem('soroban_child_name', childName.trim());

    // إنشاء صف التقدم في الجدول (إذا لم يكن موجوداً)
    await supabase.from('soroban_progress').upsert({
      user_id: data.user.id,
      progress_data: {},
    }, { onConflict: 'user_id' });

    return data.user;
  },

  // ═══ 2. تسجيل الدخول ═══
  async loginParent(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');

    // استرجاع الأسماء من user_metadata
    const meta = data.user.user_metadata || {};
    const pName = meta.parent_name || 'ولي الأمر';
    const cName = meta.child_name || 'البطل';
    
    useProgressStore.getState().setParentName(pName);
    useProgressStore.getState().setChildName(cName);
    
    // 👇 تحديث الذاكرة المحلية لكي تقرأها شاشة البطل
    localStorage.setItem('soroban_child_name', cName);

    return data.user;
  },

  // ═══ 3. تسجيل الخروج ═══
  async logoutParent() {
    await supabase.auth.signOut();
  },

  // ═══ 4. جلب المستخدم الحالي ═══
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const meta = data.user.user_metadata || {};
      const pName = meta.parent_name || 'ولي الأمر';
      const cName = meta.child_name || 'البطل';
      
      useProgressStore.getState().setParentName(pName);
      useProgressStore.getState().setChildName(cName);
      
      // 👇 تحديث الذاكرة المحلية عند التحقق من المستخدم
      localStorage.setItem('soroban_child_name', cName);
    }
    return data.user;
  },

  // ═══ 5. حفظ التقدم في السحابة ═══
  async saveToCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in / يجب تسجيل الدخول');

    const currentState = useProgressStore.getState();
    const pureData = extractPureState(currentState);

    const { error } = await supabase
      .from('soroban_progress')
      .upsert({
        user_id: user.id,
        progress_data: pureData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) throw new Error(error.message);
    return true;
  },

  // ═══ 6. استعادة التقدم من السحابة ═══
  async loadFromCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Must be logged in / يجب تسجيل الدخول');

    const { data, error } = await supabase
      .from('soroban_progress')
      .select('progress_data')
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);
    if (!data || !data.progress_data) throw new Error('No backup found / لا توجد نسخة احتياطية');

    // تحديث المتجر (الحفاظ على الأسماء من user_metadata)
    const currentStore = useProgressStore.getState();
    useProgressStore.setState({
      ...currentStore,
      ...(data.progress_data as any),
    });

    return true;
  },
};