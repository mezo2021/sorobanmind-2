// src/components/games/MentalArchivesGame/MentalArchivesGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { LEVEL_1_DATA, GAME_ID, DEFAULT_HERO, ASSETS } from './level1Data';
import { GameCompanion } from '../GameCompanion';
import { useGameVoice } from '@/hooks/useGameVoice';
import { gt, lt } from '../gamesI18n';
import { addScore } from '../highScoreStore';
import { useProgressStore } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import { Play, SkipForward } from 'lucide-react'; // أيقونات للفيديو

type GamePhase = 'intro' | 'story' | 'example' | 'challenge' | 'failed' | 'success';

interface Props {
  onBack: () => void;
  onComplete?: () => void;
}

export default function MentalArchivesGame({ onBack, onComplete }: Props) {
  // نبدأ بمرحلة الفيديو
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [storyIndex, setStoryIndex] = useState(0);
  
  // حالة التحدي
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(LEVEL_1_DATA.timePerQuestionMs);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  
  // الأنظمة المركزية
  const { speak } = useGameVoice(DEFAULT_HERO);
  const childName = useProgressStore((s) => s.childName) || 'البطل';
  const addXP = useProgressStore((s) => s.addXP);
  const recordSaved = useRef(false);

  const heroText = gt(
    phase === 'story' ? LEVEL_1_DATA.story[storyIndex].textAr : 
    phase === 'example' ? LEVEL_1_DATA.example.titleAr :
    phase === 'challenge' ? 'أدخل الإجابة الصحيحة بسرعة!' : ''
  );

  // 1. إدارة مؤقت التحدي
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'challenge' && feedback === 'none') {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 100) {
            handleAnswer(false);
            return LEVEL_1_DATA.timePerQuestionMs;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [phase, currentQIndex, feedback]);

  // 2. إدارة النطق
  useEffect(() => {
    if (phase === 'story') {
      speak(gt(LEVEL_1_DATA.story[storyIndex].textAr));
    } else if (phase === 'challenge' && feedback === 'correct') {
      speak(gt('إجابة صحيحة!'));
    } else if (phase === 'challenge' && feedback === 'wrong') {
      speak(gt('إجابة خاطئة، حاول أسرع.'));
    }
  }, [storyIndex, phase, feedback]);

  // 3. التحقق من الإجابة
  const handleAnswer = (isManualSubmit: boolean) => {
    if (feedback !== 'none') return;
    const q = LEVEL_1_DATA.questions[currentQIndex];
    const actualCorrect = isManualSubmit ? parseInt(userInput) === q.answer : false;

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setTimeout(() => advanceQuestion(), 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => advanceQuestion(), 1500);
    }
  };

  const advanceQuestion = () => {
    if (currentQIndex < LEVEL_1_DATA.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserInput('');
      setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
      setFeedback('none');
    } else {
      const finalCorrect = correctCount + (feedback === 'correct' ? 1 : 0);
      if (finalCorrect >= LEVEL_1_DATA.requiredCorrect) {
        endGame(true, finalCorrect);
      } else {
        setPhase('failed');
      }
    }
  };

  const endGame = (isSuccess: boolean, finalScore: number) => {
    if (recordSaved.current) return;
    recordSaved.current = true;

    addScore(GAME_ID, childName, finalScore, DEFAULT_HERO);
    if (!isPreviewMode()) addXP(isSuccess ? 5 : 2); 
    if (isSuccess) localStorage.setItem('mental_archives_max_level', '2');
    
    setPhase(isSuccess ? 'success' : 'failed');
    speak(gt(isSuccess ? 'عبرت البوابة بنجاح!' : 'تحتاج إلى مزيد من السرعة.'));
  };

  const handleRetry = () => {
    setFailedAttempts(prev => prev + 1);
    if (failedAttempts >= 2) return; 
    setCurrentQIndex(0);
    setCorrectCount(0);
    setUserInput('');
    setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
    setFeedback('none');
    setPhase('challenge');
    recordSaved.current = false;
  };

  // ================= الواجهات (UI) =================
  
  const Header = () => (
    <div className="w-full flex justify-between items-center p-4 absolute top-0 left-0 right-0 z-50">
      <button onClick={onBack} className="text-slate-400 hover:text-white px-4 py-2 bg-slate-800/50 rounded-lg backdrop-blur-sm z-50">
        {lt('رجوع', 'Back')}
      </button>
      {phase === 'challenge' && (
        <div className={`text-xl font-mono px-4 py-2 rounded-lg ${timeLeft < 3000 ? 'bg-red-900 text-red-300 animate-pulse' : 'bg-slate-800/80 text-cyan-400'}`}>
          {(timeLeft / 1000).toFixed(1)}s
        </div>
      )}
    </div>
  );

  // 👇 شاشة الفيديو الافتتاحي 👇
  if (phase === 'intro') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-black text-white" dir="rtl">
        <Header />
        <video 
          src={ASSETS.introVideo} 
          autoPlay 
          playsInline 
          controls
          className="w-full h-full max-h-[100dvh] object-cover"
          onEnded={() => setPhase('story')}
        />
        <button 
          onClick={() => setPhase('story')}
          className="absolute bottom-20 right-6 bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-md transition-all z-50 border border-slate-600"
        >
          <span>{lt('تخطي المقدمة', 'Skip Intro')}</span>
          <SkipForward className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // 👇 شاشة القصة (بالصور الجديدة) 👇
  if (phase === 'story') {
    const currentLine = LEVEL_1_DATA.story[storyIndex];
    const isSorobana = currentLine.character === 'sorobana';
    const isAseel = currentLine.character === 'aseel';

    return (
      <div className="relative flex flex-col items-center justify-end min-h-[100dvh] bg-gradient-to-b from-indigo-950 to-slate-900 text-white p-6 overflow-hidden" dir="rtl">
        <Header />
        
        {/* خلفية ضوئية بسيطة تعطي جواً زمنياً */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

        {/* عرض الشخصيات الثلاثة */}
        <div className="relative w-full max-w-4xl flex justify-center items-end mb-8 z-10">
          {/* أسيل */}
          <img 
            src={ASSETS.aseel} 
            alt="Aseel" 
            className={`w-32 sm:w-48 object-contain transition-all duration-500 ${isAseel ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-50 grayscale-[50%] scale-90'}`} 
          />
          {/* جود */}
          <img 
            src={ASSETS.joud} 
            alt="Joud" 
            className={`w-40 sm:w-56 object-contain transition-all duration-500 z-20 ${!isSorobana && !isAseel ? 'scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-50 grayscale-[50%] scale-90'}`} 
          />
          {/* سوروبانا */}
          <img 
            src={ASSETS.sorobana} 
            alt="Sorobana" 
            className={`w-36 sm:w-52 object-contain transition-all duration-500 ${isSorobana ? 'scale-110 drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'opacity-50 grayscale-[50%] scale-90'}`} 
          />
        </div>

        {/* صندوق الحوار */}
        <div className="relative max-w-2xl bg-slate-800/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-slate-600 w-full z-20 mb-8">
          <p className="text-lg sm:text-xl leading-relaxed mb-6">
            <span className={`font-bold ml-2 ${isSorobana ? 'text-purple-400' : isAseel ? 'text-rose-400' : 'text-cyan-400'}`}>
              {gt(currentLine.character)}:
            </span>
            {heroText}
          </p>
          <button 
            onClick={() => {
              if (storyIndex < LEVEL_1_DATA.story.length - 1) setStoryIndex(s => s + 1);
              else setPhase('example');
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-cyan-900/50"
          >
            {lt('متابعة', 'Continue')}
          </button>
        </div>
      </div>
    );
  }

  // (شاشات المثال، الفشل، النجاح، والتحدي تبقى كما هي، مع إصلاحات الأخطاء)
  if (phase === 'example') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir="rtl">
        <Header />
        <div className="max-w-2xl bg-slate-800 p-8 mt-16 rounded-2xl shadow-2xl border border-slate-700 w-full">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{gt(LEVEL_1_DATA.example.titleAr)}</h2>
          <div className="text-4xl text-center font-mono bg-slate-900 py-4 rounded-xl mb-6" dir="ltr">
            {LEVEL_1_DATA.example.problem}
          </div>
          <ul className="space-y-4 mb-8">
            {LEVEL_1_DATA.example.stepsAr.map((step, idx) => (
              <li key={idx} className="flex items-start">
                <span className="bg-cyan-900 text-cyan-300 rounded-full w-6 h-6 flex items-center justify-center text-sm ml-3 mt-1 shrink-0">
                  {idx + 1}
                </span>
                <span className="text-lg text-slate-300">{gt(step)}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setPhase('challenge')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/50"
          >
            {lt('أنا مستعد للتحدي', 'Ready for Challenge')}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'failed' && failedAttempts >= 2) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir="rtl">
        <Header />
        {/* هنا نستخدم الصورة المخصصة لسوروبانا بدل GameCompanion */}
        <img src={ASSETS.sorobana} alt="Sorobana" className="w-40 mb-4 opacity-80" />
        <div className="max-w-md bg-slate-800 p-8 rounded-2xl text-center border-t-4 border-amber-500 w-full">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{lt('تحتاج إلى مزيد من السرعة!', 'Need More Speed!')}</h2>
          <p className="text-slate-300 mb-8">{gt('تحتاج إلى مزيد من السرعة للامتحان، تدرب جيداً لتكون جاهزاً.')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setPhase('example')} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold">{lt('مراجعة الشرح', 'Review Example')}</button>
            <button onClick={() => { setFailedAttempts(0); handleRetry(); }} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold">{lt('تحدي جديد', 'Retry Challenge')}</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir="rtl">
        <Header />
        <div className="flex gap-4 mb-8">
          <img src={ASSETS.joud} alt="Joud" className="w-32 object-contain animate-bounce" />
          <img src={ASSETS.aseel} alt="Aseel" className="w-32 object-contain animate-bounce delay-100" />
        </div>
        <div className="text-center">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">{lt('عبرت البوابة بنجاح!', 'Gate Crossed Successfully!')}</h2>
          <p className="text-slate-300 mb-8">{gt("لقد أعدت ربط سجلات إبلا وماري.")}</p>
          <button onClick={onBack} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg shadow-emerald-900/50">
            {lt('العودة لمدينة الألعاب', 'Return to Games City')}
          </button>
        </div>
      </div>
    );
  }

  const currentQ = LEVEL_1_DATA.questions[currentQIndex];
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir="rtl">
      <Header />
      
      {/* استخدام GameCompanion هنا فقط للتحدي (بدون text) */}
      <div className="absolute top-20 left-4 z-0 pointer-events-none opacity-50">
        <GameCompanion heroId={DEFAULT_HERO} mood={feedback === 'correct' ? 'excited' : feedback === 'wrong' ? 'sad' : 'thinking'} />
      </div>

      <div className="w-full max-w-2xl flex justify-between items-center mb-8 mt-16 z-10">
        <div className="text-xl font-bold">
          {lt('السؤال', 'Question')} {currentQIndex + 1} / {LEVEL_1_DATA.questions.length}
        </div>
      </div>

      <div className="w-full max-w-2xl h-2 bg-slate-800 rounded-full mb-8 overflow-hidden z-10">
        <div 
          className={`h-full transition-all duration-100 ${timeLeft < 3000 ? 'bg-red-500' : 'bg-cyan-500'}`}
          style={{ width: `${(timeLeft / LEVEL_1_DATA.timePerQuestionMs) * 100}%` }}
        ></div>
      </div>

      <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-2xl text-center mb-8 border border-slate-700 z-10">
        <div className="flex flex-col items-center gap-2 text-4xl font-mono mb-6" dir="ltr">
          {currentQ.numbers.map((num, i) => (
            <div key={i} className="flex items-center gap-4">
              <span>{num}</span>
              {i < currentQ.numbers.length - 1 && <span className="text-cyan-600 text-2xl">+</span>}
            </div>
          ))}
        </div>
        
        <div className="h-px w-3/4 bg-slate-600 mx-auto mb-6"></div>
        
        <input
          type="number"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={feedback !== 'none'}
          className={`w-40 mx-auto text-center text-4xl font-bold bg-slate-900 border-2 rounded-xl p-4 outline-none transition-colors
            ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400' : 
              feedback === 'wrong' ? 'border-red-500 text-red-400' : 'border-slate-600 focus:border-cyan-500 text-white'}`}
          placeholder="؟"
          autoFocus
        />
      </div>

      <button 
        onClick={() => handleAnswer(true)}
        disabled={!userInput || feedback !== 'none'}
        className="w-full max-w-xs py-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 rounded-xl font-bold text-xl transition-all z-10"
      >
        {lt('تأكيد الإجابة', 'Confirm Answer')}
      </button>
    </div>
  );
}