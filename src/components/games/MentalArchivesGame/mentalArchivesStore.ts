// src/components/games/MentalArchivesGame/mentalArchivesStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChapterId } from './gameFlowTypes';

export type MentalGameProgress = Partial<Record<ChapterId, { bestScore: number; at: number }>>;

interface MentalArchivesState {
  progress: MentalGameProgress;
  completeChapter: (id: ChapterId, score: number) => void;
  resetProgress: () => void;
}

export const useMentalArchivesStore = create<MentalArchivesState>()(
  persist(
    (set) => ({
      progress: {},
      
      completeChapter: (id, score) => set((state) => {
        const existing = state.progress[id];
        // نحفظ فقط إذا كانت النتيجة الجديدة أعلى من السابقة
        if (existing && existing.bestScore >= score) return state;
        
        return {
          progress: {
            ...state.progress,
            [id]: { bestScore: score, at: Date.now() }
          }
        };
      }),

      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: 'mental_archives_progress_v1', // 👈 هذا هو المفتاح الذي سنضيفه لـ keysToKeep لاحقاً
    }
  )
);