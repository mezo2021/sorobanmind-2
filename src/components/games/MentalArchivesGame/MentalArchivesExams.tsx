// src/components/games/MentalArchivesGame/MentalArchivesExams.tsx
import React, { useState } from 'react';
import { useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { Num } from '@/components/Num';
import { ArrowRight, Lock, Play, Timer, GraduationCap, BookOpen } from 'lucide-react';

// 👇 استيراد شاشة الامتحان وبيانات الامتحان الأول
import MentalArchivesExamRunner from './MentalArchivesExamRunner';
import { EXAM_10_7 } from './data/exams/exam10_7';
// 👇 استيراد نوع ChapterId لحل مشكلة TypeScript
import { ChapterId } from './gameFlowTypes';

interface ExamMeta {
  id: string;
  nameAr: string;
  nameEn: string;
  questions: number;
  marks: number;
  minutes: number;
  requiresChapter?: ChapterId[]; // 👈 تم تعديل النوع هنا
  requiresExamPass?: string;
}

const EXAMS: ExamMeta[] = [
  { id: 'exam_10_7', nameAr: '10-7 كيو (ورقة مشتركة)', nameEn: '10-7 Kyu (Combined)', questions: 50, marks: 500, minutes: 12, requiresChapter: ['level1', 'level2'] },
  { id: 'exam_6', nameAr: '6 كيو', nameEn: '6 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_10_7' },
  { id: 'exam_5', nameAr: '5 كيو', nameEn: '5 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_6' },
  { id: 'exam_4', nameAr: '4 كيو', nameEn: '4 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_5' },
  { id: 'exam_3', nameAr: '3 كيو', nameEn: '3 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_4' },
  { id: 'exam_2', nameAr: '2 كيو', nameEn: '2 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_3' },
  { id: 'exam_1', nameAr: '1 كيو', nameEn: '1 Kyu', questions: 80, marks: 500, minutes: 12, requiresExamPass: 'exam_2' },
];

export default function MentalArchivesExams({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [mode, setMode] = useState<'training' | 'exam'>('exam');
  
  // 👇 حالة جديدة لتشغيل الامتحان
  const [isRunning, setIsRunning] = useState(false);

  const progress = useProgressStore((s) => s.mentalArchivesProgress);
  const examResults = useProgressStore((s) => s.mentalArchivesExams);

  const isExamUnlocked = (exam: ExamMeta): boolean => {
    if (exam.requiresChapter) return exam.requiresChapter.every(ch => !!progress[ch]);
    if (exam.requiresExamPass) return examResults[exam.requiresExamPass]?.passed || false;
    return false;
  };

  const selectedExam = EXAMS.find(e => e.id === selectedExamId) || null;

  // 👇 إذا كنا داخل الامتحان، نعرض شاشة الامتحان
  if (isRunning && selectedExamId === 'exam_10_7') {
    return (
      <MentalArchivesExamRunner 
        examData={EXAM_10_7} 
        mode={mode} 
        onExit={() => { setIsRunning(false); setSelectedExamId(null); }} 
      />
    );
  }

  // ═══ 1. قائمة الامتحانات ═══
  if (!selectedExamId) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6" dir={dir}>
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition">
            <span className={isAr ? 'ml-2' : 'mr-2 rotate-180'}>←</span>
            {isAr ? 'العودة للخريطة' : 'Back to Map'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-10 h-10 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-black text-emerald-400">{isAr ? 'قسم الامتحانات (كيو)' : 'Kyu Exams'}</h1>
              <p className="text-sm text-slate-400 mt-1">{isAr ? 'محاكاة رسمية لامتحانات نيشورين' : 'Official Nishuren simulation'}</p>
            </div>
          </div>

          <p className="text-xs text-amber-200/80 bg-amber-950/30 border border-amber-500/30 p-3 rounded-xl mb-6">
            {isAr ? '💡 للحصول على درجة الكيو، يجب حل الامتحان بوضع "امتحان" والحصول على 400/500 أو أكثر. وضع "تدريب" لا يفتح الامتحان التالي.' : '💡 To earn the Kyu grade, solve in "Exam" mode with 400/500+. "Training" mode does not unlock the next exam.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {EXAMS.map((exam) => {
              const unlocked = isExamUnlocked(exam);
              const best = examResults[exam.id] || null;
              return (
                <div 
                  key={exam.id} 
                  onClick={() => unlocked && setSelectedExamId(exam.id)}
                  className={`p-5 rounded-2xl border-2 transition-all ${unlocked ? 'border-emerald-500/50 bg-slate-900 hover:bg-slate-800 hover:border-emerald-400 cursor-pointer shadow-lg' : 'border-slate-800 bg-slate-900/50 opacity-60 cursor-not-allowed'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-amber-200">{isAr ? exam.nameAr : exam.nameEn}</h3>
                    {!unlocked && <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>{exam.questions} {isAr ? 'سؤال' : 'Q'} · {exam.marks} {isAr ? 'علامة' : 'marks'}</p>
                    <p className="flex items-center gap-1"><Timer className="w-3 h-3" /> {exam.minutes} {isAr ? 'دقيقة' : 'min'}</p>
                  </div>
                  {best && (
                    <div className="mt-3 text-xs">
                      <span className={best.passed ? 'text-emerald-400' : 'text-rose-400'}>
                        {isAr ? 'أفضل نتيجة' : 'Best'}: <Num>{best.score}</Num>/{best.totalMarks} {best.grade && `(${best.grade})`}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ 2. إعداد الامتحان المحدد ═══
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6" dir={dir}>
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setSelectedExamId(null)} className="mb-8 text-amber-400 font-bold flex items-center gap-2 hover:text-amber-300 transition">
          <span className={isAr ? 'ml-2' : 'mr-2 rotate-180'}>←</span>
          {isAr ? 'العودة لقائمة الامتحانات' : 'Back to Exams'}
        </button>

        <div className="bg-slate-900 border-2 border-emerald-500/50 p-6 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-black text-amber-300 mb-2">{isAr ? selectedExam?.nameAr : selectedExam?.nameEn}</h2>
          <p className="text-sm text-slate-400 mb-6">{isAr ? 'محاكاة رسمية كاملة' : 'Full official simulation'}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-950 p-3 rounded-xl text-center"><p className="text-xs text-slate-500">{isAr ? 'الأسئلة' : 'Questions'}</p><p className="text-xl font-bold text-emerald-300"><Num>{selectedExam?.questions}</Num></p></div>
            <div className="bg-slate-950 p-3 rounded-xl text-center"><p className="text-xs text-slate-500">{isAr ? 'العلامات' : 'Marks'}</p><p className="text-xl font-bold text-emerald-300"><Num>{selectedExam?.marks}</Num></p></div>
            <div className="bg-slate-950 p-3 rounded-xl text-center"><p className="text-xs text-slate-500">{isAr ? 'الوقت' : 'Time'}</p><p className="text-xl font-bold text-emerald-300"><Num>{selectedExam?.minutes}</Num>m</p></div>
            <div className="bg-slate-950 p-3 rounded-xl text-center"><p className="text-xs text-slate-500">{isAr ? 'النجاح' : 'Pass'}</p><p className="text-xl font-bold text-emerald-300">400</p></div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-bold text-slate-300 mb-3">{isAr ? 'اختر الوضع:' : 'Choose mode:'}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setMode('training')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'training' ? 'border-slate-400 bg-slate-700/50' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}>
                <BookOpen className="w-6 h-6 text-slate-300" />
                <span className="font-bold">{isAr ? 'تدريب' : 'Training'}</span>
                <span className="text-[10px] text-slate-400 text-center">{isAr ? 'بلا مؤقت · لا يفتح التالي' : 'No timer · no unlock'}</span>
              </button>
              <button onClick={() => setMode('exam')} className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${mode === 'exam' ? 'border-emerald-500 bg-emerald-900/40' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800'}`}>
                <Timer className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-emerald-300">{isAr ? 'امتحان' : 'Exam'}</span>
                <span className="text-[10px] text-emerald-400/80 text-center">{isAr ? 'بمؤقت · يفتح التالي' : 'With timer · unlocks next'}</span>
              </button>
            </div>
          </div>

          <button onClick={() => setIsRunning(true)} className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-xl shadow-lg flex items-center justify-center gap-2">
            <Play className="w-6 h-6" />
            {isAr ? 'ابدأ' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}