// src/components/games/MentalArchivesGame/Level1Game.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { LEVEL_1_DATA } from './level1Data';

type GamePhase = 'story' | 'example' | 'challenge' | 'failed' | 'success';

export default function Level1Game({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<GamePhase>('story');
  const [storyIndex, setStoryIndex] = useState(0);
  
  // حالة التحدي
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(LEVEL_1_DATA.timePerQuestionMs);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  // 1. إدارة مؤقت التحدي
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'challenge' && feedback === 'none') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            handleAnswer(false); // انتهى الوقت
            return LEVEL_1_DATA.timePerQuestionMs;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [phase, currentQIndex, feedback]);

  // 2. التحقق من الإجابة
  const handleAnswer = (isCorrect: boolean) => {
    const q = LEVEL_1_DATA.questions[currentQIndex];
    // التحقق الفعلي (إذا لم يكن انتهاء وقت)
    const actualCorrect = !isCorrect ? false : parseInt(userInput) === q.answer;

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setTimeout(() => {
        if (currentQIndex < LEVEL_1_DATA.questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          setUserInput('');
          setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
          setFeedback('none');
        } else {
          // نهاية التحدي
          if (correctCount + 1 >= LEVEL_1_DATA.requiredCorrect) {
            setPhase('success');
          } else {
            setPhase('failed');
          }
        }
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        // الانتقال للسؤال التالي حتى لو أخطأ
        if (currentQIndex < LEVEL_1_DATA.questions.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          setUserInput('');
          setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
          setFeedback('none');
        } else {
          setPhase(correctCount >= LEVEL_1_DATA.requiredCorrect ? 'success' : 'failed');
        }
      }, 1500);
    }
  };

  const handleRetry = () => {
    setFailedAttempts(prev => prev + 1);
    if (failedAttempts + 1 >= 3) {
      // هنا نظهر رسالة الفشل النهائية
    } else {
      setCurrentQIndex(0);
      setCorrectCount(0);
      setUserInput('');
      setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
      setFeedback('none');
      setPhase('challenge');
    }
  };

  // ================= الواجهات (UI) =================

  // واجهة القصة
  if (phase === 'story') {
    const currentLine = LEVEL_1_DATA.story[storyIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
        <div className="max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <p className="text-xl leading-relaxed mb-6">
            <span className="text-cyan-400 font-bold ml-2">{currentLine.character}:</span>
            {currentLine.text}
          </p>
          <button 
            onClick={() => {
              if (storyIndex < LEVEL_1_DATA.story.length - 1) setStoryIndex(s => s + 1);
              else setPhase('example');
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-lg transition-all"
          >
            متابعة
          </button>
        </div>
      </div>
    );
  }

  // واجهة المثال المحلول
  if (phase === 'example') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
        <div className="max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{LEVEL_1_DATA.example.title}</h2>
          <div className="text-4xl text-center font-mono bg-slate-900 py-4 rounded-xl mb-6">
            {LEVEL_1_DATA.example.problem}
          </div>
          <ul className="space-y-4 mb-8">
            {LEVEL_1_DATA.example.steps.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="bg-cyan-900 text-cyan-300 rounded-full w-6 h-6 flex items-center justify-center text-sm ml-3 mt-1">
                  {idx + 1}
                </span>
                <span className="text-lg text-slate-300">{step}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setPhase('challenge')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg transition-all"
          >
            أنا مستعد للتحدي
          </button>
        </div>
      </div>
    );
  }

  // واجهة الفشل بعد 3 محاولات
  if (phase === 'failed' && failedAttempts >= 3) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
        <div className="max-w-md bg-slate-800 p-8 rounded-2xl text-center border-t-4 border-amber-500">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">تحتاج إلى مزيد من السرعة!</h2>
          <p className="text-slate-300 mb-8">تحتاج إلى مزيد من السرعة للامتحان، تدرب جيداً لتكون جاهزاً.</p>
          <div className="flex gap-4">
            <button onClick={() => setPhase('example')} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl">مراجعة الشرح</button>
            <button onClick={() => { setFailedAttempts(0); setCurrentQIndex(0); setCorrectCount(0); setPhase('challenge'); }} className="flex-1 py-3 bg-cyan-600 rounded-xl">تحدي جديد</button>
          </div>
        </div>
      </div>
    );
  }

  // واجهة النجاح
  if (phase === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">عبرت البوابة بنجاح!</h2>
          <p className="text-slate-300 mb-8">لقد أعدت ربط سجلات إبلا وماري.</p>
          <button onClick={onComplete} className="px-8 py-3 bg-emerald-600 rounded-xl font-bold">المستوى التالي</button>
        </div>
      </div>
    );
  }

  // واجهة التحدي (الأسئلة)
  const currentQ = LEVEL_1_DATA.questions[currentQIndex];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6" dir="rtl">
      {/* شريط الحالة العلوي */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <div className="text-xl font-bold">السؤال {currentQIndex + 1} / {LEVEL_1_DATA.questions.length}</div>
        <div className={`text-2xl font-mono px-4 py-2 rounded-lg ${timeLeft < 3000 ? 'bg-red-900 text-red-300 animate-pulse' : 'bg-slate-800'}`}>
          {(timeLeft / 1000).toFixed(1)}s
        </div>
      </div>

      {/* شريط التقدم للمؤقت */}
      <div className="w-full max-w-2xl h-2 bg-slate-800 rounded-full mb-8 overflow-hidden">
        <div 
          className={`h-full transition-all duration-100 ${timeLeft < 3000 ? 'bg-red-500' : 'bg-cyan-500'}`}
          style={{ width: `${(timeLeft / LEVEL_1_DATA.timePerQuestionMs) * 100}%` }}
        ></div>
      </div>

      {/* السؤال */}
      <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-2xl text-center mb-8 border border-slate-700">
        <div className="flex flex-col items-center gap-2 text-4xl font-mono mb-6">
          {currentQ.numbers.map((num, i) => (
            <div key={i} className="flex items-center gap-4">
              <span>{num}</span>
              {i < currentQ.numbers.length - 1 && <span className="text-cyan-600 text-2xl">+</span>}
            </div>
          ))}
        </div>
        
        <div className="h-px w-3/4 bg-slate-600 mx-auto mb-6"></div>
        
        {/* إدخال الإجابة */}
        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={feedback !== 'none'}
          className={`w-40 mx-auto text-center text-4xl font-bold bg-slate-900 border-2 rounded-xl p-4 outline-none transition-colors
            ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400' : 
              feedback === 'wrong' ? 'border-red-500 text-red-400' : 'border-slate-600 focus:border-cyan-500'}`}
          placeholder="؟"
        />
      </div>

      <button 
        onClick={() => handleAnswer(true)}
        disabled={!userInput || feedback !== 'none'}
        className="w-full max-w-xs py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 rounded-xl font-bold text-xl transition-all"
      >
        تأكيد الإجابة
      </button>
    </div>
  );
}