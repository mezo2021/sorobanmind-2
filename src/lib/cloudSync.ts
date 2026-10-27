import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';

// ═══ دالة مساعدة لتنظيف الحالة من الدوال قبل الحفظ ═══
function extractPureState(state: ProgressState) {
  const { 
    setChildName, setCategory, markLevelComplete, markLessonCompleted, 
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
  // 1. إنشاء حساب جديد لولي الأمر
  async registerParent(email: string, password: string, parentName: string, childName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('فشل إنشاء الحساب');

    // حفظ البيانات الأولية في الجدول
    const initialState = extractPureState(useProgressStore.getState());
    const { error: dbError } = await supabase.from('soroban_progress').insert({
      user_id: authData.user.id,
      parent_name: parentName,
      child_name: childName,
      progress_data: initialState,
    });

    if (dbError) throw new Error(dbError.message);
    return authData.user;
  },

  // 2. تسجيل الدخول
  async loginParent(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.user;
  },

  // 3. تسجيل الخروج
  async logoutParent() {
    await supabase.auth.signOut();
  },

  // 4. جلب المستخدم الحالي
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  // 5. حفظ التقدم الحالي في السحابة
  async saveToCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');

    const currentState = useProgressStore.getState();
    const pureData = extractPureState(currentState);

    const { error } = await supabase.from('soroban_progress').update({
      child_name: currentState.childName,
      progress_data: pureData,
      updated_at: new Date().toISOString(),
    }).eq('user_id', user.id);

    if (error) throw new Error(error.message);
    return true;
  },

  // 6. استعادة التقدم من السحابة
  async loadFromCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');

    const { data, error } = await supabase
      .from('soroban_progress')
      .select('progress_data, child_name')
      .eq('user_id', user.id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('لا توجد نسخة احتياطية');

    // دمج البيانات القادمة مع دوال المتجر
    const currentStore = useProgressStore.getState();
    useProgressStore.setState({
      ...currentStore,
      ...(data.progress_data as any),
      childName: data.child_name,
    });

    return true;
  }
};