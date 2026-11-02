import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LEVEL_1_DATA, GAME_ID, DEFAULT_HERO } from './level1Data';
import { GameCompanion } from '../GameCompanion';
import { HighScoreBadge } from '../HighScoreBadge';
import { addScore, getHighScore, type HighScoreEntry } from '../highScoreStore';
import { useCharacterVoice } from '@/hooks/useCharacterVoice';
import { gt, lt, useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { isPreviewMode } from '@/utils/previewMode';
import { SkipForward, ArrowRight, Play } from 'lucide-react';
import { Num } from '@/components/Num';

import introVideo from './intro.mp4';
import joudImg from './joud.png';
import aseelImg from './aseel.png';
import sorobanaImg from './sorobana.png';

type GamePhase = 'intro' | 'story' | 'example' | 'challenge' | 'failed' | 'success';

export default function MentalArchivesGame({ onBack }: { onBack: () => void }) {
  const { dir, isAr } = useGameLang();
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [storyIndex, setStoryIndex] = useState(0);
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(LEVEL_1_DATA.timePerQuestionMs);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  
  // 👇 أصوات الشخصيات: سوروبانا (شام) - أسيل (بانة) - جود (جود)
  const { speak: speakJoud } = useCharacterVoice('joud');
  const { speak: speakAseel } = useCharacterVoice('bana'); 
  const { speak: speakSorobana } = useCharacterVoice('sham'); 

  const childName = useProgressStore((s) => s.childName) || gt('بطل');
  const addXP = useProgressStore((s) => s.addXP);
  
  const [previousHigh, setPreviousHigh] = useState<HighScoreEntry | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const recordSaved = useRef(false);

  const [heroMood, setHeroMood] = useState<any>('idle');
  const [heroText, setHeroText] = useState('');

  useEffect(() => {
    setPreviousHigh(getHighScore(GAME_ID));
  }, []);

  const getCharacterData = (char: string) => {
    switch (char) {
      case 'jud': return { name: gt('جود'), img: joudImg, color: 'text-cyan-400', speak: speakJoud };
      case 'aseel': return { name: gt('أسيل'), img: aseelImg, color: 'text-rose-400', speak: speakAseel };
      case 'sorobana': return { name: gt('سوروبانا'), img: sorobanaImg, color: 'text-purple-400', speak: speakSorobana };
      default: return { name: '', img: '', color: '', speak: () => {} };
    }
  };

  const currentLine = LEVEL_1_DATA.story[storyIndex];
  const currentCharData = currentLine ? getCharacterData(currentLine.character) : null;

  useEffect(() => {
    if (phase === 'story' && currentCharData) {
      setHeroText(gt(currentLine.textAr));
      currentCharData.speak(gt(currentLine.textAr));
    }
  }, [storyIndex, phase]);

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

  const handleAnswer = (isManualSubmit: boolean) => {
    if (feedback !== 'none') return;
    const q = LEVEL_1_DATA.questions[currentQIndex];
    const actualCorrect = isManualSubmit ? parseInt(userInput) === q.answer : false;

    if (actualCorrect) {
      setFeedback('correct');
      setCorrectCount(prev => prev + 1);
      setHeroMood('celebrating');
      setHeroText(gt('إجابة صحيحة!'));
      speakJoud(gt('إجابة صحيحة!'));
      setTimeout(() => advanceQuestion(), 1200);
    } else {
      setFeedback('wrong');
      setHeroMood('sad');
      setHeroText(gt('إجابة خاطئة، حاول أسرع.'));
      speakJoud(gt('إجابة خاطئة، حاول أسرع.'));
      setTimeout(() => advanceQuestion(), 1500);
    }
  };

  const advanceQuestion = () => {
    if (currentQIndex < LEVEL_1_DATA.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setUserInput('');
      setTimeLeft(LEVEL_1_DATA.timePerQuestionMs);
      setFeedback('none');
      setHeroMood('thinking');
      setHeroText('');
    } else {
      const finalCorrect = correctCount + (feedback === 'correct' ? 1 : 0);
      endGame(finalCorrect >= LEVEL_1_DATA.requiredCorrect, finalCorrect);
    }
  };

  const endGame = (isSuccess: boolean, finalScore: number) => {
    if (recordSaved.current) return;
    recordSaved.current = true;

    const recordResult = addScore(GAME_ID, childName, finalScore, DEFAULT_HERO);
    if (recordResult.isNewRecord) {
      setIsNewRecord(true);
      setPreviousHigh(recordResult.previousTop);
    }
    
    if (!isPreviewMode()) addXP(isSuccess ? 5 : 2);
    if (isSuccess) localStorage.setItem('mental_archives_max_level', '2');

    setPhase(isSuccess ? 'success' : 'failed');
    if (isSuccess) speakJoud(gt('عبرت البوابة بنجاح!'));
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
    setHeroMood('idle');
    setHeroText('');
    recordSaved.current = false;
  };

  // دالة لاختيار البطل المرافق بناءً على المتحدث
  const getCompanionId = () => {
    if (phase === 'story') {
      if (currentLine.character === 'sorobana') return 'sham'; // نستخدم شام كبديل لسوروبانا في الشريط العلوي
      if (currentLine.character === 'aseel') return 'bana';
      return 'joud';
    }
    return DEFAULT_HERO;
  };

  const TopBar = () => (
    <div className="flex items-center justify-between gap-2 p-3 sm:p-4 sticky top-0 z-20 bg-slate-900/85 backdrop-blur-md border-b border-sky-500/20">
      <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition shrink-0">
        <ArrowRight className={`w-6 h-6 text-sky-400 ${isAr ? '' : 'rotate-180'}`} />
      </button>
      
      <div className="flex-1 flex justify-center">
        {/* 👇 البطل المرافق يتغير حسب الشخصية التي تتحدث */}
        <GameCompanion heroId={getCompanionId() as any} mood={heroMood} customText={heroText} />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {phase === 'challenge' && (
          <div className={`px-2.5 py-1.5 rounded-lg border font-bold text-sm flex items-center gap-1 ${timeLeft < 3000 ? 'border-red-500/50 text-red-300' : 'border-cyan-500/30 text-cyan-300'}`}>
            ⏳ <span className="tabular-nums"><Num>{(timeLeft / 1000).toFixed(1)}</Num></span>
          </div>
        )}
      </div>
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white" dir={dir}>
        <video 
          src={introVideo} 
          autoPlay 
          playsInline 
          muted // 👈 أضفنا muted لضمان التشغيل التلقائي في بعض المتصفحات
          controls
          className="w-full h-full max-h-[100dvh] object-cover"
          onEnded={() => setPhase('story')}
        />
        <div className="absolute bottom-20 flex flex-col items-center gap-4 z-50">
          <button 
            onClick={() => setPhase('story')}
            className="bg-slate-800/80 hover:bg-slate-700 text-white px-6 py-3 rounded-full flex items-center gap-2 backdrop-blur-md transition-all border border-slate-600"
          >
            <span>{lt('تخطي المقدمة', 'Skip')}</span>
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'story' && currentCharData) {
    return (
      <div className="relative flex flex-col justify-between min-h-[100dvh] bg-gradient-to-b from-indigo-950 to-slate-900 text-white overflow-hidden" dir={dir}>
        <TopBar />
        
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none"></div>

        <div className="flex-1 relative w-full max-w-4xl mx-auto flex justify-center items-end mb-6 z-10 gap-2 sm:gap-6 pt-24">
          <motion.img 
            src={aseelImg} alt="Aseel" 
            animate={{ scale: currentLine.character === 'aseel' ? 1.1 : 0.9, opacity: currentLine.character === 'aseel' ? 1 : 0.4, filter: currentLine.character === 'aseel' ? 'none' : 'grayscale(80%)' }}
            className="w-24 sm:w-40 object-contain origin-bottom" 
          />
          <motion.img 
            src={joudImg} alt="Joud" 
            animate={{ scale: currentLine.character === 'jud' ? 1.1 : 0.9, opacity: currentLine.character === 'jud' ? 1 : 0.4, filter: currentLine.character === 'jud' ? 'none' : 'grayscale(80%)' }}
            className="w-32 sm:w-48 object-contain origin-bottom z-20" 
          />
          <motion.img 
            src={sorobanaImg} alt="Sorobana" 
            animate={{ scale: currentLine.character === 'sorobana' ? 1.1 : 0.9, opacity: currentLine.character === 'sorobana' ? 1 : 0.4, filter: currentLine.character === 'sorobana' ? 'none' : 'grayscale(80%)' }}
            className="w-28 sm:w-44 object-contain origin-bottom" 
          />
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="relative w-full max-w-2xl mx-auto bg-slate-800/95 backdrop-blur-md p-6 rounded-t-3xl border-t border-slate-600 z-20"
        >
          <p className="text-lg sm:text-xl leading-relaxed mb-6">
            <span className={`font-bold ml-2 ${currentCharData.color}`}>
              {currentCharData.name}:
            </span>
            {gt(currentLine.textAr)}
          </p>
          <button 
            onClick={() => {
              if (storyIndex < LEVEL_1_DATA.story.length - 1) setStoryIndex(s => s + 1);
              else setPhase('example');
            }}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold text-lg transition-all"
          >
            {lt('متابعة', 'Continue')}
          </button>
        </motion.div>
      </div>
    );
  }

  // ... (بقية الواجهات مثال، فشل، نجاح، وتحدي تبقى كما هي)
  if (phase === 'example') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir={dir}>
        <TopBar />
        <div className="max-w-2xl bg-slate-800 p-8 mt-16 rounded-2xl shadow-2xl border border-slate-700 w-full z-10">
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
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-lg transition-all"
          >
            {lt('أنا مستعد للتحدي', 'Ready for Challenge')}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir={dir}>
        <TopBar />
        <div className="text-center z-10 mt-10">
          <div className="text-6xl mb-6">✨</div>
          <h2 className="text-3xl font-bold text-emerald-400 mb-4">{lt('عبرت البوابة بنجاح!', 'Gate Crossed!')}</h2>
          <p className="text-slate-300 mb-8">{gt("لقد أعدت ربط سجلات إبلا وماري.")}</p>
          <button onClick={onBack} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold shadow-lg">
            {lt('العودة لمدينة الألعاب', 'Return to Games')}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'failed' && failedAttempts >= 2) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[100dvh] bg-slate-900 text-white p-6" dir={dir}>
        <TopBar />
        <div className="max-w-md bg-slate-800 p-8 rounded-2xl text-center border-t-4 border-amber-500 w-full z-10 mt-10">
          <h2 className="text-2xl font-bold text-amber-400 mb-4">{lt('تحتاج إلى مزيد من السرعة!', 'Need More Speed!')}</h2>
          <p className="text-slate-300 mb-8">{gt('تحتاج إلى مزيد من السرعة للامتحان، تدرب جيداً لتكون جاهزاً.')}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setPhase('example')} className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold">{lt('مراجعة الشرح', 'Review')}</button>
            <button onClick={() => { setFailedAttempts(0); handleRetry(); }} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-bold">{lt('تحدي جديد', 'Retry')}</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = LEVEL_1_DATA.questions[currentQIndex];
  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-slate-900 text-white" dir={dir}>
      <TopBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 z-10 w-full max-w-md mx-auto">
        <div className="w-full flex justify-between items-center text-sm font-bold text-slate-400">
          <span>{lt('السؤال', 'Q')} {currentQIndex + 1} / {LEVEL_1_DATA.questions.length}</span>
          <span className={`tabular-nums ${timeLeft < 3000 ? 'text-red-400' : 'text-cyan-400'}`}>{(timeLeft / 1000).toFixed(1)}s</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-100 ${timeLeft < 3000 ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${(timeLeft / LEVEL_1_DATA.timePerQuestionMs) * 100}%` }} />
        </div>

        <div className="bg-slate-800 p-8 rounded-3xl shadow-xl w-full text-center border border-slate-700 mt-4">
          <div className="flex flex-col items-center gap-2 text-5xl font-mono mb-8" dir="ltr">
            {currentQ.numbers.map((num, i) => (
              <div key={i} className="flex items-center gap-4">
                <span>{num}</span>
                {i < currentQ.numbers.length - 1 && <span className="text-cyan-600 text-3xl">+</span>}
              </div>
            ))}
          </div>
          
          <div className="h-px w-3/4 bg-slate-600 mx-auto mb-6"></div>
          
          <input
            type="number"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={feedback !== 'none'}
            className={`w-40 mx-auto text-center text-5xl font-bold bg-slate-900 border-2 rounded-xl p-4 outline-none transition-colors
              ${feedback === 'correct' ? 'border-emerald-500 text-emerald-400' : 
                feedback === 'wrong' ? 'border-red-500 text-red-400' : 'border-slate-600 focus:border-cyan-500 text-white'}`}
            placeholder="؟"
            autoFocus
          />
        </div>

        <button 
          onClick={() => handleAnswer(true)}
          disabled={!userInput || feedback !== 'none'}
          className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 rounded-2xl font-bold text-xl transition-all shadow-lg"
        >
          {lt('تأكيد الإجابة', 'Confirm')}
        </button>
      </div>
    </div>
  );
}