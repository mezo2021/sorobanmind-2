import { supabase } from './supabase';
import { useProgressStore, type ProgressState } from '../store/progressStore';

function extractPureState(state: ProgressState) {
  const { 
    setChildName, setParentName, setCategory, markLevelComplete, markLessonCompleted, 
    markPracticePassed, markAnzanVisualPassed, markAnzanAudioPassed, 
    setGrade, getGrades, computeFinalScore, setPendingRemediation, 
    clearPendingRemediation, addRemediationSession, setExam1Passed, 
    setExam2Passed, recordPlacementAttempt, setAnzanBadge, setAnzanAudioBadge, 
    completeEnrichment, recordAttempt, completeLevel, addXP, updateStreak, 
    setLanguage, toggleSound, toggleVoice, toggleHaptics, reset, 
    buyTicket, consumeTicket, setChildrenList, setActiveChild, ...pureData 
  } = state;
  return pureData;
}

export const cloudSync = {
  async registerParent(email: string, password: string, parentName: string, childName: string) {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, password,
      options: { data: { parent_name: parentName, child_name: childName } }
    });
    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('فشل إنشاء الحساب');
    useProgressStore.getState().setParentName(parentName);
    useProgressStore.getState().setChildName(childName);
    return authData.user;
  },
  async loginParent(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data.user;
  },
  async logoutParent() { await supabase.auth.signOut(); },
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  async fetchChildren() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');
    const { data, error } = await supabase.from('soroban_children').select('id, child_name').eq('user_id', user.id);
    if (error) throw new Error(error.message);
    const children = data.map((c) => ({ id: c.id, name: c.child_name }));
    useProgressStore.getState().setChildrenList(children);
    if (children.length > 0 && !useProgressStore.getState().activeChildId) {
      useProgressStore.getState().setActiveChild(children[0].id);
    }
    return children;
  },
  async addChildToCloud(name: string) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');
    const { error } = await supabase.from('soroban_children').insert({
      user_id: user.id, child_name: name, progress_data: {},
    });
    if (error) throw new Error(error.message);
    await this.fetchChildren();
  },
  async saveToCloud() {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('يجب تسجيل الدخول أولاً');
    const state = useProgressStore.getState();
    if (!state.activeChildId) throw new Error('لم يتم اختيار طفل');
    const pureData = extractPureState(state);
    const { error } = await supabase.from('soroban_children').update({
      progress_data: pureData, updated_at: new Date().toISOString(),
    }).eq('id', state.activeChildId);
    if (error) throw new Error(error.message);
    return true;
  },
  async loadFromCloud(childId: string) {
    const { data, error } = await supabase.from('soroban_children').select('progress_data, child_name').eq('id', childId).single();
    if (error) throw new Error(error.message);
    if (!data) throw new Error('لا توجد نسخة احتياطية');
    const currentStore = useProgressStore.getState();
    useProgressStore.setState({
      ...currentStore, ...(data.progress_data as any), childName: data.child_name, activeChildId: childId,
    });
    return true;
  }
};