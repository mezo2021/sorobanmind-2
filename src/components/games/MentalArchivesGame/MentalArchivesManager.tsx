// src/components/games/MentalArchivesGame/MentalArchivesManager.tsx
import React, { useState } from 'react';
import MentalArchivesEngine from './MentalArchivesEngine';
import { INTRO_DATA } from './data/introData';
import { LEVEL_1_DATA } from './data/level1Data';
import { Chapter, ChapterId } from './gameFlowTypes';
import { useProgressStore } from '@/store/progressStore';

// تجميع الفصول المتاحة في كائن واحد
const CHAPTERS: Record<ChapterId, Chapter> = {
  intro: INTRO_DATA,
  level1: LEVEL_1_DATA,
} as Record<ChapterId, Chapter>;

export default function MentalArchivesManager({ onBack }: { onBack: () => void }) {
  // الحالة الآن هي "معرف الفصل النشط" بدلاً من رقم المستوى
  const [activeChapterId, setActiveChapterId] = useState<ChapterId | null>(null);
  
  // 👇 استخدام المتجر الموحد (لا يوجد localStorage مباشر هنا)
  const mentalProgress = useProgressStore((s) => s.mentalArchivesProgress);
  const completeMentalChapter = useProgressStore((s) => s.completeMentalChapter);

  const handleComplete = (score: number) => {
    if (activeChapterId) {
      // حفظ التقدم في المتجر الموحد (سيُزامن مع السحابة لاحقاً)
      completeMentalChapter(activeChapterId, score);
      setActiveChapterId(null); // العودة لشاشة الخريطة بعد النجاح
    }
  };

  // ═══ 1. شاشة اختيار المستويات (Level Map) ═══
  if (!activeChapterId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6" dir="rtl">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={onBack} 
            className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition"
          >
            ← العودة لمدينة الألعاب
          </button>
          
          <h1 className="text-3xl font-black text-amber-400 mb-8 drop-shadow-lg">بوابة الثقب الدودي</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.values(CHAPTERS).map((chapter) => {
              const isCompleted = !!mentalProgress[chapter.id];
              const isUnlocked = chapter.requires.every(req => !!mentalProgress[req]);

              return (
                <div 
                  key={chapter.id}
                  onClick={() => isUnlocked && setActiveChapterId(chapter.id)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    isUnlocked 
                      ? 'border-amber-500/50 bg-slate-900 hover:bg-slate-800 hover:border-amber-400 cursor-pointer shadow-lg' 
                      : 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <h2 className="text-xl font-bold mb-3">{chapter.titleAr}</h2>
                  {isCompleted ? (
                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                      ✅ مكتمل (أفضل نتيجة: {mentalProgress[chapter.id]?.bestScore})
                    </span>
                  ) : isUnlocked ? (
                    <span className="text-amber-400 text-sm flex items-center gap-1">
                      ▶️ متاح للعب
                    </span>
                  ) : (
                    <span className="text-slate-500 text-sm flex items-center gap-1">
                      🔒 مغلق
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ 2. شاشة اللعب (المحرك) ═══
  return (
    <MentalArchivesEngine 
      key={activeChapterId} // يضمن إعادة تشغيل المحرك من الصفر عند تغيير الفصل
      chapter={CHAPTERS[activeChapterId]} // 👈 نمرر "chapter" بدلاً من "levelData"
      onComplete={handleComplete} 
      onBack={() => setActiveChapterId(null)} 
    />
  );
}