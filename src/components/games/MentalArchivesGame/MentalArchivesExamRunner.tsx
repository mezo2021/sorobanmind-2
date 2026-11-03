// src/components/games/MentalArchivesGame/MentalArchivesExamRunner.tsx
import React, { useState, useEffect, useRef } from 'react';
import { KyuExamData } from './data/exams/examTypes';
import { useExamStore } from './data/exams/examStore';
import { Num } from '@/components/Num';
import { useGameLang } from '../gamesI18n';
import { Timer, ArrowRight, CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  examData: KyuExamData;
  mode: 'training' | 'exam';
  onExit: () => void;
}

export default function MentalArchivesExamRunner({ examData, mode, onExit }: Props) {
  const { dir, isAr } = useGameLang();
  const recordResult = useExamStore((s) => s.recordResult);

  // تجميع كل الأسئلة في مصفوفة واحدة للتنقل السلس
  const allQuestions = examData.sections.flatMap((sec, sIdx) => 
    sec.questions.map((q, qIdx) => ({ ...q, sectionIndex: sIdx, points: sec.pointsPerQuestion }))
  );

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(examData.timeLimitSeconds);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ═══ 1. إدارة المؤقت ═══
  useEffect(() => {
    if (mode === 'training' || isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // تصحيح تلقائي عند انتهاء الوقت
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [mode, isFinished]);

  // ═══ 2. إدارة الإدخال ═══
  const handleKeypad = (key: string) => {
    if (isFinished) return;
    const qId = allQuestions[activeIndex].id;
    const currentVal = answers[qId] || '';
    
    if (key === 'back') {
      setAnswers({ ...answers, [qId]: currentVal.slice(0, -1) });
    } else if (key === 'clear') {
      setAnswers({ ...answers, [qId]: '' });
    } else if (key === 'next') {
      if (activeIndex < allQuestions.length - 1) {
        setActiveIndex(activeIndex + 1);
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (key === 'prev') {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
        scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (currentVal.length < 5) {
        setAnswers({ ...answers, [qId]: currentVal + key });
      }
    }
  };

  // ═══ 3. التصحيح والحفظ ═══
  const handleSubmit = () => {
    if (isSubmitting || isFinished) return;
    setIsSubmitting(true);

    let score = 0;
    
    examData.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer && parseInt(userAnswer) === q.answer) {
          score += sec.pointsPerQuestion;
        }
      });
    });

    let grade = undefined;
    let passed = score >= examData.passingScore;

    if (examData.gradeThresholds) {
      for (const th of examData.gradeThresholds) {
        if (score >= th.score) {
          grade = th.grade;
          break;
        }
      }
    }

    recordResult({
      examId: examData.id,
      score,
      totalMarks: examData.totalMarks,
      passed,
      grade,
      mode,
      completedAt: Date.now(),
    });

    setIsFinished(true);
    setIsSubmitting(false);
  };

  // ═══ 4. شاشة النتائج ═══
  if (isFinished) {
    // حساب النتيجة للعرض
    let score = 0;
    examData.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        const userAnswer = answers[q.id];
        if (userAnswer && parseInt(userAnswer) === q.answer) {
          score += sec.pointsPerQuestion;
        }
      });
    });
    let passed = score >= examData.passingScore;

    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center" dir={dir}>
        <div className="max-w-md w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-8 text-center shadow-2xl">
          {passed ? (
            <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-20 h-20 text-rose-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-3xl font-black mb-2">{passed ? (isAr ? 'نجحت!' : 'Passed!') : (isAr ? 'لم تنجح هذه المرة' : 'Not this time')}</h2>
          <p className="text-slate-400 mb-6">{isAr ? 'النتيجة النهائية' : 'Final Score'}</p>

          <div className="text-6xl font-mono font-black text-amber-400 mb-2">
            <Num>{score}</Num>
          </div>
          <p className="text-slate-500 mb-8">/ <Num>{examData.totalMarks}</Num></p>

          {passed && examData.gradeThresholds && (
            <div className="bg-emerald-900/30 border border-emerald-500/50 rounded-xl p-3 mb-8">
              <p className="text-sm text-emerald-300">{isAr ? 'الدرجة المكتسبة:' : 'Grade earned:'}</p>
              <p className="text-xl font-bold text-emerald-400">
                {examData.gradeThresholds.find(th => score >= th.score)?.grade}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={onExit} className="w-full py-4 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              {isAr ? 'العودة للامتحانات' : 'Back to Exams'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ 5. شاشة الامتحان (الأداء) ═══
  const currentQ = allQuestions[activeIndex];
  const progress = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col" dir={dir}>
      {/* الشريط العلوي */}
      <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <button onClick={handleSubmit} className="px-4 py-2 bg-rose-600/20 text-rose-400 rounded-lg text-sm font-bold border border-rose-500/30">
          {isAr ? 'إنهاء' : 'Finish'}
        </button>
        
        {mode === 'exam' && (
          <div className={`flex items-center gap-2 px-3 py-1 rounded-lg font-mono font-bold ${timeLeft < 60 ? 'bg-rose-900/50 text-rose-400 animate-pulse' : 'bg-slate-800 text-amber-400'}`}>
            <Timer className="w-4 h-4" />
            <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
          </div>
        )}

        <div className="text-sm font-bold text-slate-400">
          <Num>{progress}</Num> / <Num>{allQuestions.length}</Num>
        </div>
      </div>

      {/* شبكة الأسئلة */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {allQuestions.map((q, idx) => {
            const isActive = idx === activeIndex;
            const val = answers[q.id];
            const isAnswered = !!val;

            return (
              <div 
                key={q.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'border-amber-400 bg-slate-800 shadow-[0_0_15px_rgba(251,191,36,0.2)]' 
                    : isAnswered 
                      ? 'border-emerald-500/50 bg-slate-900' 
                      : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                <div className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                  <Num>{idx + 1}</Num>
                </div>

                <div className="flex flex-col items-center mt-2 text-xl font-mono font-bold text-slate-200" dir="ltr">
                  {q.numbers.map((num, i) => (
                    <div key={i} className="flex items-center justify-center w-12 relative">
                      <span><Num>{num}</Num></span>
                      {i < q.numbers.length - 1 && <span className="absolute -right-1 text-[10px] text-slate-500">+</span>}
                    </div>
                  ))}
                </div>
                
                <div className="w-full h-px bg-slate-700 my-2"></div>
                
                <div className={`w-full text-center py-1 rounded-lg text-lg font-mono font-bold ${
                  isAnswered ? 'bg-slate-950 text-amber-300' : 'bg-slate-950/50 text-slate-600'
                }`}>
                  {val || '?'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* لوحة المفاتيح */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-3 pb-6 z-20">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-2 mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeypad(num.toString())}
                className="py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-2xl font-bold text-white transition-all active:scale-95"
              >
                <Num>{num}</Num>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button onClick={() => handleKeypad('back')} className="col-span-1 py-3 bg-rose-900/30 text-rose-400 rounded-xl font-bold active:scale-95">⌫</button>
            <button onClick={() => handleKeypad('0')} className="col-span-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-2xl font-bold text-white active:scale-95">0</button>
            <button onClick={() => handleKeypad('prev')} className="col-span-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 font-bold active:scale-95">◀</button>
            <button onClick={() => handleKeypad('next')} className="col-span-1 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-slate-950 font-bold active:scale-95">▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}