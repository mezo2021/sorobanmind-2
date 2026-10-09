// src/screens/LessonScreen.tsx
// 📖 شاشة الدرس — تدعم 3 أنواع:
//   1. نظري (L0-INTRO) → introPages Carousel
//   2. وحدات (S01 · S03 · S04) → module chips + watch/try
//   3. قديم (احتياطي) → examples + tryQuestions
//
// [i18n] كل نصوص المحتوى تمر عبر pickLang (يدعم { ar, en } و "عربي | English")
// [i18n] كل نصوص الواجهة في قاموس UI المحلي ثنائي اللغة
// [i18n] dir يتبع اللغة (RTL/LTR) · المعداد يبقى RTL دائمًا
// [i18n] قصص الصوت mp3 عربية فقط → يُخفى زر "موجز القصة" في الإنجليزية

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, Square, Eye, Hand, ChevronRight, ChevronLeft,
  CheckCircle2, Lightbulb, Sparkles, RotateCcw, Type, Info, HelpCircle,
} from 'lucide-react';

import {
  getLessonById,
  getNextLesson,
  hasModules,
  isPureIntro,
  type LessonNode,
  type LessonExample,
  type LessonExercise,
  type LessonModule,
  type LessonStep,
} from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useProgressStore } from '@/store/progressStore';
import { formatText, formatNumber } from '@/utils/numberStyle';
import { useT } from '@/i18n/useTranslation';
import { pickLang, type Localized } from '@/i18n/pickLang';

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const LESSON_PROGRESS_KEY = 'soroban_completed_lessons';
const LESSON_SESSION_PREFIX = 'soroban_lesson_session_';
const MAX_TRIES = 2;

interface LessonScreenProps {
  lessonId: string;
  onBack: () => void;
  onNext?: (nextLessonId: string) => void;
  onComplete: (lessonId: string) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
}

type Tab = 'watch' | 'try';

interface SessionData {
  solved?: string[];
  attempts?: Record<string, number>;
  activeModuleId?: string | null;
  tryIdx?: number;
  tab?: Tab;
  exampleIdx?: number;
}

// ═══════════════════════════════════════════════════════════
// 🌐 قاموس نصوص الواجهة (ثنائي اللغة)
// ═══════════════════════════════════════════════════════════

const UI = {
  notFound: { ar: 'الدرس غير موجود', en: 'Lesson not found' },
  back: { ar: 'رجوع', en: 'Back' },
  introTag: { ar: 'مقدمة تعريفية', en: 'Introduction' },
  intro: { ar: 'مقدمة', en: 'Intro' },
  prev: { ar: 'السابق', en: 'Previous' },
  next: { ar: 'التالي', en: 'Next' },
  finishIntro: { ar: 'أكملت المقدمة', en: 'Introduction complete' },
  story: { ar: 'القصة', en: 'Story' },
  stop: { ar: 'إيقاف', en: 'Stop' },
  storyBrief: { ar: 'موجز القصة', en: 'Story summary' },
  rule: { ar: 'القاعدة', en: 'Rule' },
  specialCases: { ar: 'الحالات الخاصة', en: 'Special cases' },
  condition: { ar: 'الشرط', en: 'Condition' },
  discTitle: { ar: 'دليل التمييز — كيف أقرر؟', en: 'Decision guide — how do I choose?' },
  concept: { ar: 'المفهوم', en: 'Concept' },
  explainSteps: { ar: 'اشرح لي الخطوات', en: 'Show me the steps' },
  theoretical: {
    ar: 'هذا الدرس نظري — لا يحتوي على أمثلة تفاعلية.',
    en: 'This is a theory lesson — it has no interactive examples.',
  },
  check: { ar: 'تحقق', en: 'Check' },
  clear: { ar: 'مسح', en: 'Clear' },
  cheer: { ar: 'أحسنت! 🌟', en: 'Great job! 🌟' },
  correctMsg: { ar: '✅ أحسنت! إجابة صحيحة', en: '✅ Well done! Correct answer' },
  wrongMsg: { ar: '❌ حاول مرة أخرى', en: '❌ Try again' },
  correctAnswer: { ar: '💡 الإجابة الصحيحة:', en: '💡 The correct answer:' },
  gotIt: { ar: 'فهمت، التالي', en: 'Got it, next' },
  nextLesson: { ar: 'الدرس التالي:', en: 'Next lesson:' },
  watch: { ar: 'شاهد', en: 'Watch' },
  tryTab: { ar: 'جرّب', en: 'Try' },
} as const;

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

function loadSession(lessonId: string): SessionData {
  try {
    const raw = localStorage.getItem(LESSON_SESSION_PREFIX + lessonId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSession(lessonId: string, data: SessionData): void {
  try {
    localStorage.setItem(LESSON_SESSION_PREFIX + lessonId, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearSession(lessonId: string): void {
  try {
    localStorage.removeItem(LESSON_SESSION_PREFIX + lessonId);
  } catch { /* ignore */ }
}

function getColumnsForValue(value: number): number {
  const abs = Math.abs(value);
  if (abs < 10) return 1;
  if (abs < 100) return 2;
  if (abs < 1000) return 3;
  if (abs < 10000) return 4;
  return 6;
}

function generateChoices(correct: number): number[] {
  const set = new Set<number>([correct]);
  const candidates = [
    correct - 1, correct + 1, correct - 2, correct + 2,
    correct + 5, correct - 5, correct + 10,
    Math.max(0, correct - 10),
  ].filter((n) => n >= 0 && n !== correct);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (set.size >= 4) break;
    set.add(n);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function getStepText(step: string | LessonStep): string {
  if (typeof step === 'string') return step;
  return step.instructionText;
}

function getExampleText(ex: LessonExample): string {
  return ex.problemText ?? ex.question ?? '';
}

function getExampleResult(ex: LessonExample): number {
  return ex.answer ?? ex.result ?? 0;
}

function getExampleExplanation(ex: LessonExample): string {
  return ex.explanation ?? '';
}

function getExerciseText(ex: LessonExercise): string {
  return ex.prompt ?? ex.question ?? '';
}

function getExerciseResult(ex: LessonExercise): number {
  return ex.expectedValue ?? ex.result ?? 0;
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function LessonScreen({
  lessonId,
  onBack,
  onNext,
  onComplete,
  playSound,
  onXP,
}: LessonScreenProps) {
  const lesson = getLessonById(lessonId);
  const nextLesson = getNextLesson(lessonId);
  const sorobana = useSorobanaVoice();
  const tts = useSpeech();
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const markLessonCompleted = useProgressStore((s) => s.markLessonCompleted);

  // 🌐 اللغة
  const { lang, dir, isAr } = useT();
  const p = (v: Localized): string => pickLang(v, lang);
  const PrevIcon = isAr ? ChevronRight : ChevronLeft;
  const NextIcon = isAr ? ChevronLeft : ChevronRight;
  // نص المحتوى مع تنسيق الأرقام
  const pf = (v: Localized): string => formatText(p(v), numberStyle);
  // اسم الوحدة حسب اللغة
  const moduleTitle = (m: LessonModule): string =>
    lang === 'en' ? (m.titleEn || m.title) : m.title;

  // ─── جلسة محفوظة مسبقًا ───
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>('watch');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [tryIdx, setTryIdx] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [showDiscrimination, setShowDiscrimination] = useState(false);

  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'reveal'>('idle');
  const [abacusValue, setAbacusValue] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);

  const [isReadingStory, setIsReadingStory] = useState(false);
  const [isReadingModuleStory, setIsReadingModuleStory] = useState(false);
  const [companionMsg, setCompanionMsg] = useState<string | null>(null);
  const [introPageIdx, setIntroPageIdx] = useState(0);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // ═══ استعادة الجلسة عند تغيير الدرس ═══
  useEffect(() => {
    const session = loadSession(lessonId);

    const isLessonCompleted = useProgressStore
      .getState()
      .completedLessons.includes(lessonId);

    if (isLessonCompleted && lesson) {
      const allQ = hasModules(lesson)
        ? (lesson.modules ?? []).flatMap((m) => m.tryPhase.exercises)
        : (lesson.tryQuestions ?? []);
      setSolved(new Set(allQ.map((q) => q.id)));
    } else {
      setSolved(new Set(session.solved ?? []));
    }

    setAttempts(session.attempts ?? {});
    setTryIdx(session.tryIdx ?? 0);
    setTab(session.tab ?? 'watch');
    setExampleIdx(session.exampleIdx ?? 0);

    if (lesson && hasModules(lesson)) {
      setActiveModuleId(session.activeModuleId ?? lesson.modules![0].id);
    } else {
      setActiveModuleId(null);
    }

    setShowSteps(false);
    setShowDiscrimination(false);
    setFeedback('idle');
    setAbacusValue(0);
    setSessionLoaded(true);

    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // ═══ إيقاف الصوت عند تبديل اللغة ═══
  useEffect(() => {
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ═══ حفظ الجلسة عند كل تغيير ═══
  useEffect(() => {
    if (!sessionLoaded || !lesson) return;
    saveSession(lessonId, {
      solved: Array.from(solved),
      attempts,
      activeModuleId,
      tryIdx,
      tab,
      exampleIdx,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, solved, attempts, activeModuleId, tryIdx, tab, exampleIdx, sessionLoaded]);

  useEffect(() => {
    return () => {
      sorobana.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCompanionMsg = (msg: string, duration = 2200) => {
    setCompanionMsg(msg);
    window.setTimeout(() => setCompanionMsg(null), duration);
  };

  if (!lesson) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">{p(UI.notFound)}</p>
          <button onClick={onBack} className="btn-primary w-full">{p(UI.back)}</button>
        </div>
      </div>
    );
  }
// ═══════════════════════════════════════════════════════════
// 🅰️ النوع 1: درس نظري (L0-INTRO)
// ═══════════════════════════════════════════════════════════

if (isPureIntro(lesson) && lesson.introPages && lesson.introPages.length > 0) {
  const pages = lesson.introPages;
  const currentPage = pages[introPageIdx];
  const isLast = introPageIdx === pages.length - 1;
  const isFirst = introPageIdx === 0;
  const lessonTitleText = p(lesson.title);

  const handleFinishIntro = () => {
    playSound('levelup');
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(lessonId)) {
        arr.push(lessonId);
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
    markLessonCompleted(lessonId);
    clearSession(lessonId);

    if (lesson.xpReward && onXP) onXP(lesson.xpReward);
    onComplete(lessonId);
  };

  const pageLabel = isAr
    ? `صفحة ${formatNumber(introPageIdx + 1, numberStyle)} من ${formatNumber(pages.length, numberStyle)}`
    : `Page ${formatNumber(introPageIdx + 1, numberStyle)} of ${formatNumber(pages.length, numberStyle)}`;

  return (
    <div dir={dir} className="min-h-screen pb-40">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {formatText(lessonTitleText, numberStyle)}
            </h1>
            <p className="text-[10px] text-white/50">{p(UI.introTag)} · {lesson.levelId}</p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 sm:p-8 min-h-[60vh] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-electric-300" />
              <span className="text-xs text-white/50">{pageLabel}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-4 text-center">
              {p(currentPage.title)}
            </h2>

            {currentPage.imageSvg && currentPage.imageSvg !== 'soroban-interactive' && (
              <div className="my-4 p-3 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/${currentPage.imageSvg}.svg`}
                  alt={p(currentPage.imageAlt)}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}

            <p className="text-base text-white/85 font-body leading-loose text-center flex-1 flex items-center justify-center">
              {p(currentPage.content)}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 my-4">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === introPageIdx
                      ? 'w-6 h-2 bg-gold-400'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { playSound('click'); setIntroPageIdx((i) => Math.max(0, i - 1)); }}
                disabled={isFirst}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
              >
                <PrevIcon className="w-4 h-4" /> {p(UI.prev)}
              </button>
              {!isLast ? (
                <button
                  onClick={() => { playSound('click'); setIntroPageIdx((i) => i + 1); }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm transition flex items-center justify-center gap-1"
                >
                  {p(UI.next)} <NextIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishIntro}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {p(UI.finishIntro)} +{formatNumber(lesson.xpReward, numberStyle)} XP
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <FloatingCompanion playSound={playSound} />
      <SorobanaCompanion
        isSpeaking={sorobana.isSpeaking}
        onClick={() => sorobana.speakTeaching()}
        mode="watch"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 🅱️ النوع 2 و 3: درس تفاعلي (وحدات أو قديم)
// ═══════════════════════════════════════════════════════════

const hasMod = hasModules(lesson);
const modules: LessonModule[] = lesson.modules ?? [];
const activeModule = hasMod
  ? modules.find((m) => m.id === activeModuleId) ?? modules[0]
  : null;

const examples: LessonExample[] = hasMod
  ? activeModule?.watchPhase.examples ?? []
  : lesson.examples ?? [];

const tryQuestions: LessonExercise[] = hasMod
  ? activeModule?.tryPhase.exercises ?? []
  : lesson.tryQuestions ?? [];

const allQuestions: LessonExercise[] = hasMod
  ? modules.flatMap((m) => m.tryPhase.exercises)
  : lesson.tryQuestions ?? [];

const currentExample = examples[exampleIdx];
const currentTry = tryQuestions[tryIdx];
const totalTry = tryQuestions.length;

const currentModuleSolved = tryQuestions.filter((q) => solved.has(q.id)).length;
const allSolvedCount = allQuestions.filter((q) => solved.has(q.id)).length;
const allSolved = allQuestions.length > 0 && allSolvedCount === allQuestions.length;

const hasTry = allQuestions.length > 0;
const currentTryExpected = currentTry ? getExerciseResult(currentTry) : 0;
const currentTryAttempts = currentTry ? (attempts[currentTry.id] ?? 1) : 1;

// 🎙️ القصص الصوتية mp3 عربية فقط
const storyText = p(lesson.story);

// [FIX TTS] — دعم MP3 + TTS
const hasLessonMp3 =
  lesson.storyAudioId !== null && lesson.storyAudioId !== undefined;
const hasLessonTTS = !hasLessonMp3 && !!storyText;
const canPlayLessonStory = isAr && (hasLessonMp3 || hasLessonTTS);

const moduleStoryAudioId = activeModule?.miniStory?.storyAudioId;

// [FIX TTS] — دعم MP3 + TTS
const hasModuleMp3 =
  moduleStoryAudioId !== null && moduleStoryAudioId !== undefined;
const moduleStoryText = activeModule?.miniStory?.storyAudioText;
const hasModuleTTS = !hasModuleMp3 && !!moduleStoryText;
const canPlayModuleStory = isAr && (hasModuleMp3 || hasModuleTTS);

const switchModule = (mId: string) => {
  playSound('click');
  sorobana.stop();
  setIsReadingModuleStory(false);
  setActiveModuleId(mId);
  setExampleIdx(0);
  setTryIdx(0);
  setFeedback('idle');
  setShowSteps(false);
  setShowDiscrimination(false);
  setAbacusValue(0);
};

const switchTab = (t: Tab) => {
  playSound('click');
  setTab(t);
  setFeedback('idle');
  setAbacusValue(0);
  setShowSteps(false);
  setShowDiscrimination(false);
};

// [FIX TTS] — دعم MP3 + TTS fallback
const toggleStory = () => {
  const src = lesson.storyAudioId;
  const hasMp3 = src !== null && src !== undefined;
  const hasTTS = !hasMp3 && !!storyText;

  if (!hasMp3 && !hasTTS) return;

  if (isReadingStory) {
    sorobana.stop();
    tts.stop();
    setIsReadingStory(false);
    return;
  }

  sorobana.stop();
  tts.stop();
  playSound('click');
  setIsReadingStory(true);

  if (hasMp3) {
    if (src === 'welcome') {
      sorobana.speakFiles([
        'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
      ]);
      setIsReadingStory(false);
    } else {
      sorobana.speakStory(src, () => setIsReadingStory(false));
    }
  } else {
    // 🔊 TTS — العربية فقط
    const arText = storyText.split(' | ')[0].trim();
    tts.speak(arText, { onEnd: () => setIsReadingStory(false) });
  }
};

// [FIX TTS] — دعم MP3 + TTS fallback
const toggleModuleStory = () => {
  const src = activeModule?.miniStory?.storyAudioId;
  const text = activeModule?.miniStory?.storyAudioText;
  const hasMp3 = src !== null && src !== undefined;
  const hasTTS = !hasMp3 && !!text;

  if (!hasMp3 && !hasTTS) return;

  if (isReadingModuleStory) {
    sorobana.stop();
    tts.stop();
    setIsReadingModuleStory(false);
    return;
  }

  sorobana.stop();
  tts.stop();
  playSound('click');
  setIsReadingModuleStory(true);

  if (hasMp3) {
    if (src === 'welcome') {
      sorobana.speakFiles([
        'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
      ]);
      setIsReadingModuleStory(false);
    } else {
      sorobana.speakStory(src, () => setIsReadingModuleStory(false));
    }
  } else {
    // 🔊 TTS — العربية فقط
    const arText = (text ?? '').split(' | ')[0].trim();
    tts.speak(arText, { onEnd: () => setIsReadingModuleStory(false) });
  }
};

const nextExample = () => {
  if (exampleIdx + 1 >= examples.length) return;
  playSound('click');
  setExampleIdx((i) => i + 1);
  setShowSteps(false);
};
const prevExample = () => {
  if (exampleIdx === 0) return;
  playSound('click');
  setExampleIdx((i) => i - 1);
  setShowSteps(false);
};

useEffect(() => {
  if (tab === 'try' && currentTry && currentTry.type === 'read') {
    setChoices(generateChoices(currentTryExpected));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [tab, tryIdx, activeModuleId, currentTry?.id]);
  const reactToAnswer = (isCorrect: boolean, attempt: number) => {
    if (isCorrect) {
      playSound('success');
      sorobana.speakCorrect();
      showCompanionMsg(p(UI.cheer));
      setFeedback('correct');
    } else {
      playSound('error');
      sorobana.speakWrong();
      setFeedback(attempt >= MAX_TRIES ? 'reveal' : 'wrong');
    }
  };

  const handleCheckRead = (chosen: number) => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = chosen === currentTryExpected;
    const key = currentTry.id;
    const attempt = (attempts[key] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [key]: attempt }));
    if (isCorrect) {
      setSolved((s) => new Set(s).add(key));
      reactToAnswer(true, attempt);
      setTimeout(() => advanceTry(), 1100);
    } else {
      reactToAnswer(false, attempt);
    }
  };
// src/screens/LessonScreen.tsx
// 📖 شاشة الدرس — تدعم 3 أنواع:
//   1. نظري (L0-INTRO) → introPages Carousel
//   2. وحدات (S01 · S03 · S04) → module chips + watch/try
//   3. قديم (احتياطي) → examples + tryQuestions
//
// [i18n] كل نصوص المحتوى تمر عبر pickLang (يدعم { ar, en } و "عربي | English")
// [i18n] كل نصوص الواجهة في قاموس UI المحلي ثنائي اللغة
// [i18n] dir يتبع اللغة (RTL/LTR) · المعداد يبقى RTL دائمًا
// [i18n] قصص الصوت mp3 عربية فقط → يُخفى زر "موجز القصة" في الإنجليزية

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, Square, Eye, Hand, ChevronRight, ChevronLeft,
  CheckCircle2, Lightbulb, Sparkles, RotateCcw, Type, Info, HelpCircle,
} from 'lucide-react';

import {
  getLessonById,
  getNextLesson,
  hasModules,
  isPureIntro,
  type LessonNode,
  type LessonExample,
  type LessonExercise,
  type LessonModule,
  type LessonStep,
} from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useProgressStore } from '@/store/progressStore';
import { formatText, formatNumber } from '@/utils/numberStyle';
import { useT } from '@/i18n/useTranslation';
import { pickLang, type Localized } from '@/i18n/pickLang';

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const LESSON_PROGRESS_KEY = 'soroban_completed_lessons';
const LESSON_SESSION_PREFIX = 'soroban_lesson_session_';
const MAX_TRIES = 2;

interface LessonScreenProps {
  lessonId: string;
  onBack: () => void;
  onNext?: (nextLessonId: string) => void;
  onComplete: (lessonId: string) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
}

type Tab = 'watch' | 'try';

interface SessionData {
  solved?: string[];
  attempts?: Record<string, number>;
  activeModuleId?: string | null;
  tryIdx?: number;
  tab?: Tab;
  exampleIdx?: number;
}

// ═══════════════════════════════════════════════════════════
// 🌐 قاموس نصوص الواجهة (ثنائي اللغة)
// ═══════════════════════════════════════════════════════════

const UI = {
  notFound: { ar: 'الدرس غير موجود', en: 'Lesson not found' },
  back: { ar: 'رجوع', en: 'Back' },
  introTag: { ar: 'مقدمة تعريفية', en: 'Introduction' },
  intro: { ar: 'مقدمة', en: 'Intro' },
  prev: { ar: 'السابق', en: 'Previous' },
  next: { ar: 'التالي', en: 'Next' },
  finishIntro: { ar: 'أكملت المقدمة', en: 'Introduction complete' },
  story: { ar: 'القصة', en: 'Story' },
  stop: { ar: 'إيقاف', en: 'Stop' },
  storyBrief: { ar: 'موجز القصة', en: 'Story summary' },
  rule: { ar: 'القاعدة', en: 'Rule' },
  specialCases: { ar: 'الحالات الخاصة', en: 'Special cases' },
  condition: { ar: 'الشرط', en: 'Condition' },
  discTitle: { ar: 'دليل التمييز — كيف أقرر؟', en: 'Decision guide — how do I choose?' },
  concept: { ar: 'المفهوم', en: 'Concept' },
  explainSteps: { ar: 'اشرح لي الخطوات', en: 'Show me the steps' },
  theoretical: {
    ar: 'هذا الدرس نظري — لا يحتوي على أمثلة تفاعلية.',
    en: 'This is a theory lesson — it has no interactive examples.',
  },
  check: { ar: 'تحقق', en: 'Check' },
  clear: { ar: 'مسح', en: 'Clear' },
  cheer: { ar: 'أحسنت! 🌟', en: 'Great job! 🌟' },
  correctMsg: { ar: '✅ أحسنت! إجابة صحيحة', en: '✅ Well done! Correct answer' },
  wrongMsg: { ar: '❌ حاول مرة أخرى', en: '❌ Try again' },
  correctAnswer: { ar: '💡 الإجابة الصحيحة:', en: '💡 The correct answer:' },
  gotIt: { ar: 'فهمت، التالي', en: 'Got it, next' },
  nextLesson: { ar: 'الدرس التالي:', en: 'Next lesson:' },
  watch: { ar: 'شاهد', en: 'Watch' },
  tryTab: { ar: 'جرّب', en: 'Try' },
} as const;

// ═══════════════════════════════════════════════════════════
// أدوات مساعدة
// ═══════════════════════════════════════════════════════════

function loadSession(lessonId: string): SessionData {
  try {
    const raw = localStorage.getItem(LESSON_SESSION_PREFIX + lessonId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveSession(lessonId: string, data: SessionData): void {
  try {
    localStorage.setItem(LESSON_SESSION_PREFIX + lessonId, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearSession(lessonId: string): void {
  try {
    localStorage.removeItem(LESSON_SESSION_PREFIX + lessonId);
  } catch { /* ignore */ }
}

function getColumnsForValue(value: number): number {
  const abs = Math.abs(value);
  if (abs < 10) return 1;
  if (abs < 100) return 2;
  if (abs < 1000) return 3;
  if (abs < 10000) return 4;
  return 6;
}

function generateChoices(correct: number): number[] {
  const set = new Set<number>([correct]);
  const candidates = [
    correct - 1, correct + 1, correct - 2, correct + 2,
    correct + 5, correct - 5, correct + 10,
    Math.max(0, correct - 10),
  ].filter((n) => n >= 0 && n !== correct);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (set.size >= 4) break;
    set.add(n);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

function getStepText(step: string | LessonStep): string {
  if (typeof step === 'string') return step;
  return step.instructionText;
}

function getExampleText(ex: LessonExample): string {
  return ex.problemText ?? ex.question ?? '';
}

function getExampleResult(ex: LessonExample): number {
  return ex.answer ?? ex.result ?? 0;
}

function getExampleExplanation(ex: LessonExample): string {
  return ex.explanation ?? '';
}

function getExerciseText(ex: LessonExercise): string {
  return ex.prompt ?? ex.question ?? '';
}

function getExerciseResult(ex: LessonExercise): number {
  return ex.expectedValue ?? ex.result ?? 0;
}

// ═══════════════════════════════════════════════════════════
// الشاشة الرئيسية
// ═══════════════════════════════════════════════════════════

export function LessonScreen({
  lessonId,
  onBack,
  onNext,
  onComplete,
  playSound,
  onXP,
}: LessonScreenProps) {
  const lesson = getLessonById(lessonId);
  const nextLesson = getNextLesson(lessonId);
  const sorobana = useSorobanaVoice();
  const tts = useSpeech();
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const markLessonCompleted = useProgressStore((s) => s.markLessonCompleted);

  // 🌐 اللغة
  const { lang, dir, isAr } = useT();
  const p = (v: Localized): string => pickLang(v, lang);
  const PrevIcon = isAr ? ChevronRight : ChevronLeft;
  const NextIcon = isAr ? ChevronLeft : ChevronRight;
  // نص المحتوى مع تنسيق الأرقام
  const pf = (v: Localized): string => formatText(p(v), numberStyle);
  // اسم الوحدة حسب اللغة
  const moduleTitle = (m: LessonModule): string =>
    lang === 'en' ? (m.titleEn || m.title) : m.title;

  // ─── جلسة محفوظة مسبقًا ───
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>('watch');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [tryIdx, setTryIdx] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [showDiscrimination, setShowDiscrimination] = useState(false);

  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'reveal'>('idle');
  const [abacusValue, setAbacusValue] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);

  const [isReadingStory, setIsReadingStory] = useState(false);
  const [isReadingModuleStory, setIsReadingModuleStory] = useState(false);
  const [companionMsg, setCompanionMsg] = useState<string | null>(null);
  const [introPageIdx, setIntroPageIdx] = useState(0);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // ═══ استعادة الجلسة عند تغيير الدرس ═══
  useEffect(() => {
    const session = loadSession(lessonId);

    const isLessonCompleted = useProgressStore
      .getState()
      .completedLessons.includes(lessonId);

    if (isLessonCompleted && lesson) {
      const allQ = hasModules(lesson)
        ? (lesson.modules ?? []).flatMap((m) => m.tryPhase.exercises)
        : (lesson.tryQuestions ?? []);
      setSolved(new Set(allQ.map((q) => q.id)));
    } else {
      setSolved(new Set(session.solved ?? []));
    }

    setAttempts(session.attempts ?? {});
    setTryIdx(session.tryIdx ?? 0);
    setTab(session.tab ?? 'watch');
    setExampleIdx(session.exampleIdx ?? 0);

    if (lesson && hasModules(lesson)) {
      setActiveModuleId(session.activeModuleId ?? lesson.modules![0].id);
    } else {
      setActiveModuleId(null);
    }

    setShowSteps(false);
    setShowDiscrimination(false);
    setFeedback('idle');
    setAbacusValue(0);
    setSessionLoaded(true);

    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // ═══ إيقاف الصوت عند تبديل اللغة ═══
  useEffect(() => {
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ═══ حفظ الجلسة عند كل تغيير ═══
  useEffect(() => {
    if (!sessionLoaded || !lesson) return;
    saveSession(lessonId, {
      solved: Array.from(solved),
      attempts,
      activeModuleId,
      tryIdx,
      tab,
      exampleIdx,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, solved, attempts, activeModuleId, tryIdx, tab, exampleIdx, sessionLoaded]);

  useEffect(() => {
    return () => {
      sorobana.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showCompanionMsg = (msg: string, duration = 2200) => {
    setCompanionMsg(msg);
    window.setTimeout(() => setCompanionMsg(null), duration);
  };

  if (!lesson) {
    return (
      <div dir={dir} className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">{p(UI.notFound)}</p>
          <button onClick={onBack} className="btn-primary w-full">{p(UI.back)}</button>
        </div>
      </div>
    );
  }
// ═══════════════════════════════════════════════════════════
// 🅰️ النوع 1: درس نظري (L0-INTRO)
// ═══════════════════════════════════════════════════════════

if (isPureIntro(lesson) && lesson.introPages && lesson.introPages.length > 0) {
  const pages = lesson.introPages;
  const currentPage = pages[introPageIdx];
  const isLast = introPageIdx === pages.length - 1;
  const isFirst = introPageIdx === 0;
  const lessonTitleText = p(lesson.title);

  const handleFinishIntro = () => {
    playSound('levelup');
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(lessonId)) {
        arr.push(lessonId);
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
    markLessonCompleted(lessonId);
    clearSession(lessonId);

    if (lesson.xpReward && onXP) onXP(lesson.xpReward);
    onComplete(lessonId);
  };

  const pageLabel = isAr
    ? `صفحة ${formatNumber(introPageIdx + 1, numberStyle)} من ${formatNumber(pages.length, numberStyle)}`
    : `Page ${formatNumber(introPageIdx + 1, numberStyle)} of ${formatNumber(pages.length, numberStyle)}`;

  return (
    <div dir={dir} className="min-h-screen pb-40">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {formatText(lessonTitleText, numberStyle)}
            </h1>
            <p className="text-[10px] text-white/50">{p(UI.introTag)} · {lesson.levelId}</p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Page */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 sm:p-8 min-h-[60vh] flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-electric-300" />
              <span className="text-xs text-white/50">{pageLabel}</span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mb-4 text-center">
              {p(currentPage.title)}
            </h2>

            {currentPage.imageSvg && currentPage.imageSvg !== 'soroban-interactive' && (
              <div className="my-4 p-3 rounded-2xl bg-black/20 border border-white/10 overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/${currentPage.imageSvg}.svg`}
                  alt={p(currentPage.imageAlt)}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            )}

            <p className="text-base text-white/85 font-body leading-loose text-center flex-1 flex items-center justify-center">
              {p(currentPage.content)}
            </p>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 my-4">
              {pages.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === introPageIdx
                      ? 'w-6 h-2 bg-gold-400'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { playSound('click'); setIntroPageIdx((i) => Math.max(0, i - 1)); }}
                disabled={isFirst}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
              >
                <PrevIcon className="w-4 h-4" /> {p(UI.prev)}
              </button>
              {!isLast ? (
                <button
                  onClick={() => { playSound('click'); setIntroPageIdx((i) => i + 1); }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm transition flex items-center justify-center gap-1"
                >
                  {p(UI.next)} <NextIcon className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleFinishIntro}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-l from-emerald-500 to-teal-600 text-white font-bold text-sm transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {p(UI.finishIntro)} +{formatNumber(lesson.xpReward, numberStyle)} XP
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <FloatingCompanion playSound={playSound} />
      <SorobanaCompanion
        isSpeaking={sorobana.isSpeaking}
        onClick={() => sorobana.speakTeaching()}
        mode="watch"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 🅱️ النوع 2 و 3: درس تفاعلي (وحدات أو قديم)
// ═══════════════════════════════════════════════════════════

const hasMod = hasModules(lesson);
const modules: LessonModule[] = lesson.modules ?? [];
const activeModule = hasMod
  ? modules.find((m) => m.id === activeModuleId) ?? modules[0]
  : null;

const examples: LessonExample[] = hasMod
  ? activeModule?.watchPhase.examples ?? []
  : lesson.examples ?? [];

const tryQuestions: LessonExercise[] = hasMod
  ? activeModule?.tryPhase.exercises ?? []
  : lesson.tryQuestions ?? [];

const allQuestions: LessonExercise[] = hasMod
  ? modules.flatMap((m) => m.tryPhase.exercises)
  : lesson.tryQuestions ?? [];

const currentExample = examples[exampleIdx];
const currentTry = tryQuestions[tryIdx];
const totalTry = tryQuestions.length;

const currentModuleSolved = tryQuestions.filter((q) => solved.has(q.id)).length;
const allSolvedCount = allQuestions.filter((q) => solved.has(q.id)).length;
const allSolved = allQuestions.length > 0 && allSolvedCount === allQuestions.length;

const hasTry = allQuestions.length > 0;
const currentTryExpected = currentTry ? getExerciseResult(currentTry) : 0;
const currentTryAttempts = currentTry ? (attempts[currentTry.id] ?? 1) : 1;

// 🎙️ القصص الصوتية mp3 عربية فقط
const storyText = p(lesson.story);

// [FIX TTS] — دعم MP3 + TTS
const hasLessonMp3 =
  lesson.storyAudioId !== null && lesson.storyAudioId !== undefined;
const hasLessonTTS = !hasLessonMp3 && !!storyText;
const canPlayLessonStory = isAr && (hasLessonMp3 || hasLessonTTS);

const moduleStoryAudioId = activeModule?.miniStory?.storyAudioId;

// [FIX TTS] — دعم MP3 + TTS
const hasModuleMp3 =
  moduleStoryAudioId !== null && moduleStoryAudioId !== undefined;
const moduleStoryText = activeModule?.miniStory?.storyAudioText;
const hasModuleTTS = !hasModuleMp3 && !!moduleStoryText;
const canPlayModuleStory = isAr && (hasModuleMp3 || hasModuleTTS);

const switchModule = (mId: string) => {
  playSound('click');
  sorobana.stop();
  setIsReadingModuleStory(false);
  setActiveModuleId(mId);
  setExampleIdx(0);
  setTryIdx(0);
  setFeedback('idle');
  setShowSteps(false);
  setShowDiscrimination(false);
  setAbacusValue(0);
};

const switchTab = (t: Tab) => {
  playSound('click');
  setTab(t);
  setFeedback('idle');
  setAbacusValue(0);
  setShowSteps(false);
  setShowDiscrimination(false);
};

// [FIX TTS] — دعم MP3 + TTS fallback
const toggleStory = () => {
  const src = lesson.storyAudioId;
  const hasMp3 = src !== null && src !== undefined;
  const hasTTS = !hasMp3 && !!storyText;

  if (!hasMp3 && !hasTTS) return;

  if (isReadingStory) {
    sorobana.stop();
    tts.stop();
    setIsReadingStory(false);
    return;
  }

  sorobana.stop();
  tts.stop();
  playSound('click');
  setIsReadingStory(true);

  if (hasMp3) {
    if (src === 'welcome') {
      sorobana.speakFiles([
        'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
      ]);
      setIsReadingStory(false);
    } else {
      sorobana.speakStory(src, () => setIsReadingStory(false));
    }
  } else {
    // 🔊 TTS — العربية فقط
    const arText = storyText.split(' | ')[0].trim();
    tts.speak(arText, { onEnd: () => setIsReadingStory(false) });
  }
};

// [FIX TTS] — دعم MP3 + TTS fallback
const toggleModuleStory = () => {
  const src = activeModule?.miniStory?.storyAudioId;
  const text = activeModule?.miniStory?.storyAudioText;
  const hasMp3 = src !== null && src !== undefined;
  const hasTTS = !hasMp3 && !!text;

  if (!hasMp3 && !hasTTS) return;

  if (isReadingModuleStory) {
    sorobana.stop();
    tts.stop();
    setIsReadingModuleStory(false);
    return;
  }

  sorobana.stop();
  tts.stop();
  playSound('click');
  setIsReadingModuleStory(true);

  if (hasMp3) {
    if (src === 'welcome') {
      sorobana.speakFiles([
        'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
      ]);
      setIsReadingModuleStory(false);
    } else {
      sorobana.speakStory(src, () => setIsReadingModuleStory(false));
    }
  } else {
    // 🔊 TTS — العربية فقط
    const arText = text.split(' | ')[0].trim();
    tts.speak(arText, { onEnd: () => setIsReadingModuleStory(false) });
  }
};

const nextExample = () => {
  if (exampleIdx + 1 >= examples.length) return;
  playSound('click');
  setExampleIdx((i) => i + 1);
  setShowSteps(false);
};
const prevExample = () => {
  if (exampleIdx === 0) return;
  playSound('click');
  setExampleIdx((i) => i - 1);
  setShowSteps(false);
};

useEffect(() => {
  if (tab === 'try' && currentTry && currentTry.type === 'read') {
    setChoices(generateChoices(currentTryExpected));
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [tab, tryIdx, activeModuleId, currentTry?.id]);
  const reactToAnswer = (isCorrect: boolean, attempt: number) => {
    if (isCorrect) {
      playSound('success');
      sorobana.speakCorrect();
      showCompanionMsg(p(UI.cheer));
      setFeedback('correct');
    } else {
      playSound('error');
      sorobana.speakWrong();
      setFeedback(attempt >= MAX_TRIES ? 'reveal' : 'wrong');
    }
  };

  const handleCheckRead = (chosen: number) => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = chosen === currentTryExpected;
    const key = currentTry.id;
    const attempt = (attempts[key] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [key]: attempt }));
    if (isCorrect) {
      setSolved((s) => new Set(s).add(key));
      reactToAnswer(true, attempt);
      setTimeout(() => advanceTry(), 1100);
    } else {
      reactToAnswer(false, attempt);
    }
  };

  const handleCheckBuild = () => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = abacusValue === currentTryExpected;
    const key = currentTry.id;
    const attempt = (attempts[key] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [key]: attempt }));
    if (isCorrect) {
      setSolved((s) => new Set(s).add(key));
      reactToAnswer(true, attempt);
      setTimeout(() => advanceTry(), 1100);
    } else {
      reactToAnswer(false, attempt);
    }
  };

  const advanceTry = () => {
    setFeedback('idle');
    setAbacusValue(0);
    if (tryIdx + 1 < totalTry) setTryIdx((i) => i + 1);
  };

  const handleRevealNext = () => {
    if (!currentTry) return;
    setSolved((s) => new Set(s).add(currentTry.id));
    advanceTry();
  };

  const handleComplete = () => {
    playSound('levelup');
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(lessonId)) {
        arr.push(lessonId);
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
    markLessonCompleted(lessonId);
    clearSession(lessonId);

    if (lesson.xpReward && onXP) onXP(lesson.xpReward);
    onComplete(lessonId);
  };

  const handleNextLesson = () => {
    if (!nextLesson || !onNext) return;
    playSound('click');
    onNext(nextLesson.id);
  };

  const handleHome = () => {
    playSound('click');
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    onBack();
  };

  const lessonTitleText = p(lesson.title);
  const nextLessonTitleText = nextLesson ? p(nextLesson.title) : '';

  // 🔤 نصوص ذات معاملات
  const exampleLabel = isAr
    ? `مثال ${formatNumber(exampleIdx + 1, numberStyle)} من ${formatNumber(examples.length, numberStyle)}`
    : `Example ${formatNumber(exampleIdx + 1, numberStyle)} of ${formatNumber(examples.length, numberStyle)}`;
  const questionLabel = isAr
    ? `سؤال ${formatNumber(tryIdx + 1, numberStyle)} من ${formatNumber(totalTry, numberStyle)}`
    : `Question ${formatNumber(tryIdx + 1, numberStyle)} of ${formatNumber(totalTry, numberStyle)}`;
  const attemptLabel = isAr
    ? `محاولة ${formatNumber(currentTryAttempts, numberStyle)} / ${formatNumber(MAX_TRIES, numberStyle)}`
    : `Attempt ${formatNumber(currentTryAttempts, numberStyle)} / ${formatNumber(MAX_TRIES, numberStyle)}`;
  const remainingLabel = isAr
    ? `أكمل ${formatNumber(allQuestions.length - allSolvedCount, numberStyle)} سؤالاً إضافياً لفتح الدرس التالي`
    : `Solve ${formatNumber(allQuestions.length - allSolvedCount, numberStyle)} more question(s) to unlock the next lesson`;
  const finishButtonLabel =
    hasTry && !allSolved
      ? isAr
        ? `أكمل الأسئلة (${formatNumber(allSolvedCount, numberStyle)}/${formatNumber(allQuestions.length, numberStyle)})`
        : `Finish the questions (${formatNumber(allSolvedCount, numberStyle)}/${formatNumber(allQuestions.length, numberStyle)})`
      : isAr
        ? `أكملت الدرس +${formatNumber(lesson.xpReward, numberStyle)} XP`
        : `Lesson complete +${formatNumber(lesson.xpReward, numberStyle)} XP`;

  return (
    <div dir={dir} className="min-h-screen pb-40">
      {/* ───── Header ───── */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={handleHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {formatText(lessonTitleText, numberStyle)}
            </h1>
            <p className="text-[10px] text-white/50 truncate">
              {lesson.skillId ?? p(UI.intro)} · {lesson.levelId}
            </p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Module Chips */}
        {hasMod && modules.length > 1 && (
          <div className="max-w-3xl mx-auto mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {modules.map((m) => {
              const moduleSolved = m.tryPhase.exercises.filter((q) => solved.has(q.id)).length;
              const moduleTotal = m.tryPhase.exercises.length;
              const moduleDone = moduleTotal > 0 && moduleSolved === moduleTotal;
              return (
                <button
                  key={m.id}
                  onClick={() => switchModule(m.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    m.id === activeModule?.id
                      ? 'bg-gold-400/30 border border-gold-400/60 text-gold-200'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.id}</span>
                  <span className="hidden sm:inline">{moduleTitle(m)}</span>
                  {moduleDone && (
                    <span className="text-emerald-300">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-3xl mx-auto mt-3 flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => switchTab('watch')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
              tab === 'watch'
                ? 'bg-gradient-to-l from-purple-500 to-electric-500 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> {p(UI.watch)}
          </button>
          {hasTry && (
            <button
              onClick={() => switchTab('try')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
                tab === 'try'
                  ? 'bg-gradient-to-l from-purple-500 to-electric-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Hand className="w-4 h-4" /> {p(UI.tryTab)}
              {currentModuleSolved > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30">
                  {currentModuleSolved}/{totalTry}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          {tab === 'watch' && (
            <motion.div
              key={`watch-${activeModule?.id ?? 'legacy'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* 🎬 القصة */}
              {lesson.story && (storyText || canPlayLessonStory) && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-300" />
                      <h3 className="text-sm font-bold text-pink-300">📖 {p(UI.story)}</h3>
                    </div>
                    {canPlayLessonStory && (
                      <button
                        onClick={toggleStory}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isReadingStory
                            ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                            : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                        }`}
                      >
                        {isReadingStory ? (
                          <><Square className="w-3.5 h-3.5" /> {p(UI.stop)}</>
                        ) : (
                          <><Volume2 className="w-3.5 h-3.5" /> {p(UI.storyBrief)}</>
                        )}
                      </button>
                    )}
                  </div>
                  {storyText && (
                    <p className="text-sm text-white/85 font-body leading-relaxed">
                      {formatText(storyText, numberStyle)}
                    </p>
                  )}
                </div>
              )}

              {/* 🎬 قصة الوحدة */}
              {hasMod && activeModule?.miniStory && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeModule.miniStory.emoji}</span>
                      <h3 className="text-sm font-bold text-pink-300">
                        📖 {p(activeModule.miniStory.title)}
                      </h3>
                    </div>
                    {canPlayModuleStory && (
                      <button
                        onClick={toggleModuleStory}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isReadingModuleStory
                            ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                            : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                        }`}
                      >
                        {isReadingModuleStory ? (
                          <><Square className="w-3.5 h-3.5" /> {p(UI.stop)}</>
                        ) : (
                          <><Volume2 className="w-3.5 h-3.5" /> {p(UI.storyBrief)}</>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    {pf(activeModule.miniStory.story)}
                  </p>

{sorobana.debugLogs.length > 0 && (
  <details className="mt-3 p-2 rounded-lg bg-black/40 border border-emerald-400/30">
    <summary className="text-[10px] font-bold text-emerald-300 cursor-pointer">
      🐞 Debug ({sorobana.debugLogs.length})
    </summary>
    <div className="mt-2 max-h-48 overflow-y-auto text-[9px] font-mono text-emerald-200 space-y-0.5" dir="ltr">
      {sorobana.debugLogs.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  </details>
)}
                </div>
              )}
              {/* 📐 القاعدة + الشرط */}
              {hasMod && activeModule && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                  <h3 className="text-sm font-bold text-gold-300 mb-2">📐 {p(UI.rule)}</h3>
                  {/* ⚠️ rule.formula مخفية عن الطفل — لا تُعرض على الشاشة.
    السبب: القاعدة الطويلة معقدة على الأطفال (5-12 سنة).
    البيانات محفوظة في ملفات الدروس للاستخدام المستقبلي.
    ملاحظة: condition.formula تبقى معروضة (قصيرة وبسيطة).
    تاريخ الإخفاء: 2026-10-08 */}
                  <p className="text-sm text-white/85 font-body leading-relaxed mb-3">
                    {p(activeModule.rule.description)}
                  </p>

                  {activeModule.rule.cases && activeModule.rule.cases.length > 0 && (
                    <div className="mt-3 mb-3">
                      <p className="text-xs font-bold text-gold-300 mb-2">
                        🎯 {p(UI.specialCases)}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {activeModule.rule.cases.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center gap-1 p-2 rounded-lg bg-white/5 border border-white/10"
                          >
                            <span className="text-[10px] font-bold text-amber-300 font-display">
                              {formatNumber(c.from, numberStyle)}
                            </span>
                            <span className="text-[10px] text-white/40">→</span>
                            <span className="text-xs font-bold text-electric-300 font-display" dir="ltr">
                              {c.formula}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-gold-300 mb-1">🔒 {p(UI.condition)}</h3>
{/* condition.formula مخفية */}
<p className="text-sm text-white/75 font-body leading-relaxed">
  {p(activeModule.condition.explanation)}
</p>

                  {activeModule.friendsTable && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-gold-300 mb-2">
                        🤝 {p(activeModule.friendsTable.title)}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {activeModule.friendsTable.pairs.map((pair, i) => (
                          <div key={i} className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs font-bold text-electric-300 font-display">
                              {formatNumber(pair.from, numberStyle)}
                            </span>
                            <span className="text-[10px] text-white/40">↔</span>
                            <span className="text-xs font-bold text-emerald-300 font-display">
                              {formatNumber(pair.to, numberStyle)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 🔍 دليل التمييز */}
              {hasMod && activeModule && (
                <div className="glass-card p-4 bg-gradient-to-br from-electric-500/10 to-purple-500/10 border border-electric-400/30">
                  <button
                    onClick={() => { playSound('click'); setShowDiscrimination((v) => !v); }}
                    className="w-full flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-electric-300" />
                      <h3 className="text-sm font-bold text-electric-300">
                        🔍 {p(UI.discTitle)}
                      </h3>
                    </div>
                    <ChevronLeft className={`w-4 h-4 text-white/60 transition ${showDiscrimination ? 'rotate-90' : '-rotate-90'}`} />
                  </button>

                  <AnimatePresence>
                    {showDiscrimination && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-3">
                          {activeModule.discrimination.steps.map((s, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-xs font-bold text-white/90 mb-1">
                                {formatNumber(i + 1, numberStyle)}. {p(s.question)}
                              </p>
                              <p className="text-xs text-emerald-300 font-body">
                                ✓ {p(s.answer)}
                              </p>
                              {s.hint && (
                                <p className="text-[10px] text-white/50 italic mt-1">
                                  💡 {p(s.hint)}
                                </p>
                              )}
                            </div>
                          ))}
                          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                            <p className="text-xs text-center font-bold text-emerald-200">
                              ✅ {p(activeModule.discrimination.decision)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* المفهوم + القاعدة (legacy) */}
              {!hasMod && (lesson.concept || lesson.rule) && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                  {lesson.concept && (
                    <>
                      <h3 className="text-sm font-bold text-gold-300 mb-2">💡 {p(UI.concept)}</h3>
                      <p className="text-sm text-white/85 font-body leading-relaxed mb-3">
                        {pf(lesson.concept)}
                      </p>
                    </>
                  )}
                  {lesson.rule && (
                    <>
                      <h3 className="text-sm font-bold text-gold-300 mb-1 mt-3">📏 {p(UI.rule)}</h3>
                      <p className="text-sm text-white/85 font-body leading-relaxed">
                        {pf(lesson.rule)}
                      </p>
                    </>
                  )}
                  {lesson.ruleTable && lesson.ruleTable.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {lesson.ruleTable.map((row, i) => (
                        <div key={i} className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-xs font-bold text-electric-300 font-display">
                            {formatText(row.formula, numberStyle)}
                          </span>
                          <span className="text-[10px] text-white/40">=</span>
                          <span className="text-xs font-bold text-emerald-300 font-display">
                            {formatText(row.result, numberStyle)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* الأمثلة */}
              {currentExample && (
                <div className="glass-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white/70">
                      {exampleLabel}
                    </h3>
                    <div className="flex gap-1">
                      {examples.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i === exampleIdx ? 'bg-gold-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-xl font-extrabold font-display text-white mb-4">
                    {pf(getExampleText(currentExample))}
                  </p>

                  {/* المعداد يبقى RTL دائمًا (ترتيب الأعمدة: آحاد على اليمين) */}
                  <div dir="rtl" className="flex justify-center mb-4">
                    <Soroban2D5
                      key={`ex-${currentExample.id}`}
                      columns={getColumnsForValue(getExampleResult(currentExample))}
                      demoValue={getExampleResult(currentExample)}
                      interactive={false}
                      showValue={true}
                    />
                  </div>

                  {!showSteps && currentExample.steps.length > 0 && (
                    <button
                      onClick={() => { playSound('click'); setShowSteps(true); }}
                      className="w-full btn-primary !py-2.5 !text-sm"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {p(UI.explainSteps)}
                    </button>
                  )}

                  {showSteps && currentExample.steps.length > 0 && (
                    <div className="space-y-2">
                      {currentExample.discrimination && (
                        <p className="text-xs text-electric-300 font-body bg-electric-500/10 p-2 rounded-lg">
                          🔍 {pf(currentExample.discrimination)}
                        </p>
                      )}
                      {currentExample.rule && (
                        <p className="text-xs text-gold-300 font-body bg-gold-500/10 p-2 rounded-lg text-center font-display">
                          📐 {pf(currentExample.rule)}
                        </p>
                      )}
                      {currentExample.fingerMovement && (
                        <p className="text-xs text-purple-300 font-body bg-purple-500/10 p-2 rounded-lg">
                          👆 {pf(currentExample.fingerMovement)}
                        </p>
                      )}
                      {currentExample.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="p-3 rounded-xl bg-electric-500/10 border border-electric-400/30"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-electric-500/30 flex items-center justify-center text-xs font-bold text-electric-200 shrink-0">
                              {formatNumber(i + 1, numberStyle)}
                            </span>
                            <p className="text-sm text-white/85 font-body leading-relaxed flex-1">
                              {pf(getStepText(step))}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {getExampleExplanation(currentExample) && (
                        <p className="text-xs text-center text-emerald-300 font-bold pt-1">
                          ✨ {pf(getExampleExplanation(currentExample))}
                        </p>
                      )}
                      {currentExample.beadVisual && (
                        <p className="text-xs text-center text-white/60 italic">
                          👁️ {pf(currentExample.beadVisual)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={prevExample}
                      disabled={exampleIdx === 0}
                      className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      <PrevIcon className="w-4 h-4" /> {p(UI.prev)}
                    </button>
                    <button
                      onClick={nextExample}
                      disabled={exampleIdx === examples.length - 1}
                      className="flex-1 py-2.5 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      {p(UI.next)} <NextIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {examples.length === 0 && !hasMod && (
                <div className="glass-card p-5 text-center text-white/60 text-sm">
                  {p(UI.theoretical)}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'try' && currentTry && (
            <motion.div
              key={`try-${activeModule?.id ?? 'legacy'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/70">
                  {questionLabel}
                </h3>
                <span className="text-xs text-white/50">
                  {attemptLabel}
                </span>
              </div>

              <div className="glass-card p-4 sm:p-5 text-center">
                <p className="text-lg font-extrabold font-display text-white mb-4">
                  {pf(getExerciseText(currentTry))}
                </p>

                {currentTry.type === 'read' && (
                  <>
                    <div dir="rtl" className="flex justify-center mb-4">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTryExpected)}
                        demoValue={currentTryExpected}
                        interactive={false}
                        showValue={false}
                      />
                    </div>
                    {feedback !== 'reveal' && (
                      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                        {choices.map((c) => (
                          <button
                            key={c}
                            onClick={() => handleCheckRead(c)}
                            disabled={feedback === 'correct'}
                            className="py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-display font-black text-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition disabled:opacity-40"
                          >
                            {formatNumber(c, numberStyle)}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {(currentTry.type === 'build' || (!currentTry.type && currentTryExpected > 0)) && (
                  <>
                    <div dir="rtl" className="flex justify-center mb-3">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTryExpected)}
                        initialValue={0}
                        autoBeadSize={true}
                        interactive={feedback !== 'reveal' && feedback !== 'correct'}
                        showValue={true}
                        onValueChange={setAbacusValue}
                      />
                    </div>
                    {feedback !== 'reveal' && feedback !== 'correct' && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={handleCheckBuild} className="btn-primary !py-2.5 !px-6 !text-sm">
                          <CheckCircle2 className="w-4 h-4" /> {p(UI.check)}
                        </button>
                        <button
                          onClick={() => { playSound('click'); setAbacusValue(0); }}
                          className="btn-ghost !py-2.5 !px-4 !text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> {p(UI.clear)}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {feedback === 'correct' && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center">
                  <p className="text-sm font-bold text-emerald-200">{p(UI.correctMsg)}</p>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center">
                  <p className="text-sm font-bold text-amber-200">{p(UI.wrongMsg)}</p>
                </div>
              )}

              {feedback === 'reveal' && (
                <div className="p-4 rounded-2xl bg-gold-500/15 border border-gold-400/40">
                  <p className="text-sm font-bold text-gold-300 text-center mb-2">
                    {p(UI.correctAnswer)} {formatNumber(currentTryExpected, numberStyle)}
                  </p>
                  {currentTry.steps && currentTry.steps.length > 0 && (
                    <div className="space-y-1.5 mt-3">
                      {currentTry.steps.map((s, i) => (
                        <p key={i} className="text-xs text-white/80 font-body">
                          <span className="text-gold-300 font-bold">
                            {formatNumber(i + 1, numberStyle)}.
                          </span>{' '}
                          {pf(getStepText(s))}
                        </p>
                      ))}
                    </div>
                  )}
                  {currentTry.explanation && (
                    <p className="text-xs text-white/70 text-center mt-2">
                      {pf(currentTry.explanation)}
                    </p>
                  )}
                  <button onClick={handleRevealNext} className="w-full mt-3 btn-primary !py-2.5 !text-sm">
                    {p(UI.gotIt)}
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {tryQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition ${
                      solved.has(q.id)
                        ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-200'
                        : i === tryIdx
                          ? 'bg-gold-400/30 border border-gold-400/50 text-gold-200'
                          : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                  >
                    {solved.has(q.id) ? '✓' : formatNumber(i + 1, numberStyle)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          {!allSolved && hasTry && (
            <p className="text-center text-xs text-white/50 mb-2">
              {remainingLabel}
            </p>
          )}

          <button
            onClick={handleComplete}
            disabled={hasTry && !allSolved}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition ${
              hasTry && !allSolved
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {finishButtonLabel}
          </button>

          {nextLesson && allSolved && (
            <button
              onClick={handleNextLesson}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              {p(UI.nextLesson)} {formatText(nextLessonTitleText, numberStyle)}
              <NextIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* فقاعة سوروبانا */}
      <AnimatePresence>
        {companionMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed z-[70] pointer-events-none"
            style={{ bottom: 'calc(12rem + 130px)', right: '0.75rem', maxWidth: '170px' }}
          >
            <div
              className="relative px-3 py-2 rounded-2xl shadow-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E9F7EF 100%)',
                borderColor: '#10B981',
                color: '#065F46',
              }}
            >
              <p className={`text-xs font-bold ${isAr ? 'text-right' : 'text-left'}`} dir={dir}>{companionMsg}</p>
              <div
                className="absolute"
                style={{
                  bottom: '-8px',
                  right: '20px',
                  width: '12px',
                  height: '12px',
                  background: '#E9F7EF',
                  borderRight: '2px solid #10B981',
                  borderBottom: '2px solid #10B981',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingCompanion playSound={playSound} />
      <SorobanaCompanion
        isSpeaking={sorobana.isSpeaking}
        onClick={() => { if (!isReadingStory && !isReadingModuleStory) sorobana.speakTeaching(); }}
        mode={tab === 'try' ? 'try' : 'watch'}
      />
    </div>
  );
}

export default LessonScreen;
  const handleCheckBuild = () => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = abacusValue === currentTryExpected;
    const key = currentTry.id;
    const attempt = (attempts[key] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [key]: attempt }));
    if (isCorrect) {
      setSolved((s) => new Set(s).add(key));
      reactToAnswer(true, attempt);
      setTimeout(() => advanceTry(), 1100);
    } else {
      reactToAnswer(false, attempt);
    }
  };

  const advanceTry = () => {
    setFeedback('idle');
    setAbacusValue(0);
    if (tryIdx + 1 < totalTry) setTryIdx((i) => i + 1);
  };

  const handleRevealNext = () => {
    if (!currentTry) return;
    setSolved((s) => new Set(s).add(currentTry.id));
    advanceTry();
  };

  const handleComplete = () => {
    playSound('levelup');
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(lessonId)) {
        arr.push(lessonId);
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
    markLessonCompleted(lessonId);
    clearSession(lessonId);

    if (lesson.xpReward && onXP) onXP(lesson.xpReward);
    onComplete(lessonId);
  };

  const handleNextLesson = () => {
    if (!nextLesson || !onNext) return;
    playSound('click');
    onNext(nextLesson.id);
  };

  const handleHome = () => {
    playSound('click');
    sorobana.stop();
    setIsReadingStory(false);
    setIsReadingModuleStory(false);
    onBack();
  };

  const lessonTitleText = p(lesson.title);
  const nextLessonTitleText = nextLesson ? p(nextLesson.title) : '';

  // 🔤 نصوص ذات معاملات
  const exampleLabel = isAr
    ? `مثال ${formatNumber(exampleIdx + 1, numberStyle)} من ${formatNumber(examples.length, numberStyle)}`
    : `Example ${formatNumber(exampleIdx + 1, numberStyle)} of ${formatNumber(examples.length, numberStyle)}`;
  const questionLabel = isAr
    ? `سؤال ${formatNumber(tryIdx + 1, numberStyle)} من ${formatNumber(totalTry, numberStyle)}`
    : `Question ${formatNumber(tryIdx + 1, numberStyle)} of ${formatNumber(totalTry, numberStyle)}`;
  const attemptLabel = isAr
    ? `محاولة ${formatNumber(currentTryAttempts, numberStyle)} / ${formatNumber(MAX_TRIES, numberStyle)}`
    : `Attempt ${formatNumber(currentTryAttempts, numberStyle)} / ${formatNumber(MAX_TRIES, numberStyle)}`;
  const remainingLabel = isAr
    ? `أكمل ${formatNumber(allQuestions.length - allSolvedCount, numberStyle)} سؤالاً إضافياً لفتح الدرس التالي`
    : `Solve ${formatNumber(allQuestions.length - allSolvedCount, numberStyle)} more question(s) to unlock the next lesson`;
  const finishButtonLabel =
    hasTry && !allSolved
      ? isAr
        ? `أكمل الأسئلة (${formatNumber(allSolvedCount, numberStyle)}/${formatNumber(allQuestions.length, numberStyle)})`
        : `Finish the questions (${formatNumber(allSolvedCount, numberStyle)}/${formatNumber(allQuestions.length, numberStyle)})`
      : isAr
        ? `أكملت الدرس +${formatNumber(lesson.xpReward, numberStyle)} XP`
        : `Lesson complete +${formatNumber(lesson.xpReward, numberStyle)} XP`;

  return (
    <div dir={dir} className="min-h-screen pb-40">
      {/* ───── Header ───── */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={handleHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {formatText(lessonTitleText, numberStyle)}
            </h1>
            <p className="text-[10px] text-white/50 truncate">
              {lesson.skillId ?? p(UI.intro)} · {lesson.levelId}
            </p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Module Chips */}
        {hasMod && modules.length > 1 && (
          <div className="max-w-3xl mx-auto mt-3 flex gap-1.5 overflow-x-auto pb-1">
            {modules.map((m) => {
              const moduleSolved = m.tryPhase.exercises.filter((q) => solved.has(q.id)).length;
              const moduleTotal = m.tryPhase.exercises.length;
              const moduleDone = moduleTotal > 0 && moduleSolved === moduleTotal;
              return (
                <button
                  key={m.id}
                  onClick={() => switchModule(m.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    m.id === activeModule?.id
                      ? 'bg-gold-400/30 border border-gold-400/60 text-gold-200'
                      : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.id}</span>
                  <span className="hidden sm:inline">{moduleTitle(m)}</span>
                  {moduleDone && (
                    <span className="text-emerald-300">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-3xl mx-auto mt-3 flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => switchTab('watch')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
              tab === 'watch'
                ? 'bg-gradient-to-l from-purple-500 to-electric-500 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> {p(UI.watch)}
          </button>
          {hasTry && (
            <button
              onClick={() => switchTab('try')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
                tab === 'try'
                  ? 'bg-gradient-to-l from-purple-500 to-electric-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Hand className="w-4 h-4" /> {p(UI.tryTab)}
              {currentModuleSolved > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30">
                  {currentModuleSolved}/{totalTry}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ───── Content ───── */}
      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          {tab === 'watch' && (
            <motion.div
              key={`watch-${activeModule?.id ?? 'legacy'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* 🎬 القصة */}
              {lesson.story && (storyText || canPlayLessonStory) && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-300" />
                      <h3 className="text-sm font-bold text-pink-300">📖 {p(UI.story)}</h3>
                    </div>
                    {canPlayLessonStory && (
                      <button
                        onClick={toggleStory}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isReadingStory
                            ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                            : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                        }`}
                      >
                        {isReadingStory ? (
                          <><Square className="w-3.5 h-3.5" /> {p(UI.stop)}</>
                        ) : (
                          <><Volume2 className="w-3.5 h-3.5" /> {p(UI.storyBrief)}</>
                        )}
                      </button>
                    )}
                  </div>
                  {storyText && (
                    <p className="text-sm text-white/85 font-body leading-relaxed">
                      {formatText(storyText, numberStyle)}
                    </p>
                  )}
                </div>
              )}

              {/* 🎬 قصة الوحدة */}
              {hasMod && activeModule?.miniStory && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{activeModule.miniStory.emoji}</span>
                      <h3 className="text-sm font-bold text-pink-300">
                        📖 {p(activeModule.miniStory.title)}
                      </h3>
                    </div>
                    {canPlayModuleStory && (
                      <button
                        onClick={toggleModuleStory}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          isReadingModuleStory
                            ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                            : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                        }`}
                      >
                        {isReadingModuleStory ? (
                          <><Square className="w-3.5 h-3.5" /> {p(UI.stop)}</>
                        ) : (
                          <><Volume2 className="w-3.5 h-3.5" /> {p(UI.storyBrief)}</>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-white/85 font-body leading-relaxed">
                    {pf(activeModule.miniStory.story)}
                  </p>

{sorobana.debugLogs.length > 0 && (
  <details className="mt-3 p-2 rounded-lg bg-black/40 border border-emerald-400/30">
    <summary className="text-[10px] font-bold text-emerald-300 cursor-pointer">
      🐞 Debug ({sorobana.debugLogs.length})
    </summary>
    <div className="mt-2 max-h-48 overflow-y-auto text-[9px] font-mono text-emerald-200 space-y-0.5" dir="ltr">
      {sorobana.debugLogs.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  </details>
)}
                </div>
              )}
              {/* 📐 القاعدة + الشرط */}
              {hasMod && activeModule && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                  <h3 className="text-sm font-bold text-gold-300 mb-2">📐 {p(UI.rule)}</h3>
                  {/* ⚠️ rule.formula مخفية عن الطفل — لا تُعرض على الشاشة.
    السبب: القاعدة الطويلة معقدة على الأطفال (5-12 سنة).
    البيانات محفوظة في ملفات الدروس للاستخدام المستقبلي.
    ملاحظة: condition.formula تبقى معروضة (قصيرة وبسيطة).
    تاريخ الإخفاء: 2026-10-08 */}
                  <p className="text-sm text-white/85 font-body leading-relaxed mb-3">
                    {p(activeModule.rule.description)}
                  </p>

                  {activeModule.rule.cases && activeModule.rule.cases.length > 0 && (
                    <div className="mt-3 mb-3">
                      <p className="text-xs font-bold text-gold-300 mb-2">
                        🎯 {p(UI.specialCases)}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {activeModule.rule.cases.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center gap-1 p-2 rounded-lg bg-white/5 border border-white/10"
                          >
                            <span className="text-[10px] font-bold text-amber-300 font-display">
                              {formatNumber(c.from, numberStyle)}
                            </span>
                            <span className="text-[10px] text-white/40">→</span>
                            <span className="text-xs font-bold text-electric-300 font-display" dir="ltr">
                              {c.formula}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="text-sm font-bold text-gold-300 mb-1">🔒 {p(UI.condition)}</h3>
{/* condition.formula مخفية */}
<p className="text-sm text-white/75 font-body leading-relaxed">
  {p(activeModule.condition.explanation)}
</p>

                  {activeModule.friendsTable && (
                    <div className="mt-3">
                      <p className="text-xs font-bold text-gold-300 mb-2">
                        🤝 {p(activeModule.friendsTable.title)}
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {activeModule.friendsTable.pairs.map((pair, i) => (
                          <div key={i} className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs font-bold text-electric-300 font-display">
                              {formatNumber(pair.from, numberStyle)}
                            </span>
                            <span className="text-[10px] text-white/40">↔</span>
                            <span className="text-xs font-bold text-emerald-300 font-display">
                              {formatNumber(pair.to, numberStyle)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 🔍 دليل التمييز */}
              {hasMod && activeModule && (
                <div className="glass-card p-4 bg-gradient-to-br from-electric-500/10 to-purple-500/10 border border-electric-400/30">
                  <button
                    onClick={() => { playSound('click'); setShowDiscrimination((v) => !v); }}
                    className="w-full flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-electric-300" />
                      <h3 className="text-sm font-bold text-electric-300">
                        🔍 {p(UI.discTitle)}
                      </h3>
                    </div>
                    <ChevronLeft className={`w-4 h-4 text-white/60 transition ${showDiscrimination ? 'rotate-90' : '-rotate-90'}`} />
                  </button>

                  <AnimatePresence>
                    {showDiscrimination && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 pt-3">
                          {activeModule.discrimination.steps.map((s, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                              <p className="text-xs font-bold text-white/90 mb-1">
                                {formatNumber(i + 1, numberStyle)}. {p(s.question)}
                              </p>
                              <p className="text-xs text-emerald-300 font-body">
                                ✓ {p(s.answer)}
                              </p>
                              {s.hint && (
                                <p className="text-[10px] text-white/50 italic mt-1">
                                  💡 {p(s.hint)}
                                </p>
                              )}
                            </div>
                          ))}
                          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40">
                            <p className="text-xs text-center font-bold text-emerald-200">
                              ✅ {p(activeModule.discrimination.decision)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* المفهوم + القاعدة (legacy) */}
              {!hasMod && (lesson.concept || lesson.rule) && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                  {lesson.concept && (
                    <>
                      <h3 className="text-sm font-bold text-gold-300 mb-2">💡 {p(UI.concept)}</h3>
                      <p className="text-sm text-white/85 font-body leading-relaxed mb-3">
                        {pf(lesson.concept)}
                      </p>
                    </>
                  )}
                  {lesson.rule && (
                    <>
                      <h3 className="text-sm font-bold text-gold-300 mb-1 mt-3">📏 {p(UI.rule)}</h3>
                      <p className="text-sm text-white/85 font-body leading-relaxed">
                        {pf(lesson.rule)}
                      </p>
                    </>
                  )}
                  {lesson.ruleTable && lesson.ruleTable.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {lesson.ruleTable.map((row, i) => (
                        <div key={i} className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10">
                          <span className="text-xs font-bold text-electric-300 font-display">
                            {formatText(row.formula, numberStyle)}
                          </span>
                          <span className="text-[10px] text-white/40">=</span>
                          <span className="text-xs font-bold text-emerald-300 font-display">
                            {formatText(row.result, numberStyle)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* الأمثلة */}
              {currentExample && (
                <div className="glass-card p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white/70">
                      {exampleLabel}
                    </h3>
                    <div className="flex gap-1">
                      {examples.map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i === exampleIdx ? 'bg-gold-400' : 'bg-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-center text-xl font-extrabold font-display text-white mb-4">
                    {pf(getExampleText(currentExample))}
                  </p>

                  {/* المعداد يبقى RTL دائمًا (ترتيب الأعمدة: آحاد على اليمين) */}
                  <div dir="rtl" className="flex justify-center mb-4">
                    <Soroban2D5
                      key={`ex-${currentExample.id}`}
                      columns={getColumnsForValue(getExampleResult(currentExample))}
                      demoValue={getExampleResult(currentExample)}
                      interactive={false}
                      showValue={true}
                    />
                  </div>

                  {!showSteps && currentExample.steps.length > 0 && (
                    <button
                      onClick={() => { playSound('click'); setShowSteps(true); }}
                      className="w-full btn-primary !py-2.5 !text-sm"
                    >
                      <Lightbulb className="w-4 h-4" />
                      {p(UI.explainSteps)}
                    </button>
                  )}

                  {showSteps && currentExample.steps.length > 0 && (
                    <div className="space-y-2">
                      {currentExample.discrimination && (
                        <p className="text-xs text-electric-300 font-body bg-electric-500/10 p-2 rounded-lg">
                          🔍 {pf(currentExample.discrimination)}
                        </p>
                      )}
                      {currentExample.rule && (
                        <p className="text-xs text-gold-300 font-body bg-gold-500/10 p-2 rounded-lg text-center font-display">
                          📐 {pf(currentExample.rule)}
                        </p>
                      )}
                      {currentExample.fingerMovement && (
                        <p className="text-xs text-purple-300 font-body bg-purple-500/10 p-2 rounded-lg">
                          👆 {pf(currentExample.fingerMovement)}
                        </p>
                      )}
                      {currentExample.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isAr ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="p-3 rounded-xl bg-electric-500/10 border border-electric-400/30"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-electric-500/30 flex items-center justify-center text-xs font-bold text-electric-200 shrink-0">
                              {formatNumber(i + 1, numberStyle)}
                            </span>
                            <p className="text-sm text-white/85 font-body leading-relaxed flex-1">
                              {pf(getStepText(step))}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      {getExampleExplanation(currentExample) && (
                        <p className="text-xs text-center text-emerald-300 font-bold pt-1">
                          ✨ {pf(getExampleExplanation(currentExample))}
                        </p>
                      )}
                      {currentExample.beadVisual && (
                        <p className="text-xs text-center text-white/60 italic">
                          👁️ {pf(currentExample.beadVisual)}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={prevExample}
                      disabled={exampleIdx === 0}
                      className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      <PrevIcon className="w-4 h-4" /> {p(UI.prev)}
                    </button>
                    <button
                      onClick={nextExample}
                      disabled={exampleIdx === examples.length - 1}
                      className="flex-1 py-2.5 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      {p(UI.next)} <NextIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {examples.length === 0 && !hasMod && (
                <div className="glass-card p-5 text-center text-white/60 text-sm">
                  {p(UI.theoretical)}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'try' && currentTry && (
            <motion.div
              key={`try-${activeModule?.id ?? 'legacy'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/70">
                  {questionLabel}
                </h3>
                <span className="text-xs text-white/50">
                  {attemptLabel}
                </span>
              </div>

              <div className="glass-card p-4 sm:p-5 text-center">
                <p className="text-lg font-extrabold font-display text-white mb-4">
                  {pf(getExerciseText(currentTry))}
                </p>

                {currentTry.type === 'read' && (
                  <>
                    <div dir="rtl" className="flex justify-center mb-4">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTryExpected)}
                        demoValue={currentTryExpected}
                        interactive={false}
                        showValue={false}
                      />
                    </div>
                    {feedback !== 'reveal' && (
                      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                        {choices.map((c) => (
                          <button
                            key={c}
                            onClick={() => handleCheckRead(c)}
                            disabled={feedback === 'correct'}
                            className="py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-display font-black text-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition disabled:opacity-40"
                          >
                            {formatNumber(c, numberStyle)}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {(currentTry.type === 'build' || (!currentTry.type && currentTryExpected > 0)) && (
                  <>
                    <div dir="rtl" className="flex justify-center mb-3">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTryExpected)}
                        initialValue={0}
                        autoBeadSize={true}
                        interactive={feedback !== 'reveal' && feedback !== 'correct'}
                        showValue={true}
                        onValueChange={setAbacusValue}
                      />
                    </div>
                    {feedback !== 'reveal' && feedback !== 'correct' && (
                      <div className="flex gap-2 justify-center">
                        <button onClick={handleCheckBuild} className="btn-primary !py-2.5 !px-6 !text-sm">
                          <CheckCircle2 className="w-4 h-4" /> {p(UI.check)}
                        </button>
                        <button
                          onClick={() => { playSound('click'); setAbacusValue(0); }}
                          className="btn-ghost !py-2.5 !px-4 !text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> {p(UI.clear)}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {feedback === 'correct' && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center">
                  <p className="text-sm font-bold text-emerald-200">{p(UI.correctMsg)}</p>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center">
                  <p className="text-sm font-bold text-amber-200">{p(UI.wrongMsg)}</p>
                </div>
              )}

              {feedback === 'reveal' && (
                <div className="p-4 rounded-2xl bg-gold-500/15 border border-gold-400/40">
                  <p className="text-sm font-bold text-gold-300 text-center mb-2">
                    {p(UI.correctAnswer)} {formatNumber(currentTryExpected, numberStyle)}
                  </p>
                  {currentTry.steps && currentTry.steps.length > 0 && (
                    <div className="space-y-1.5 mt-3">
                      {currentTry.steps.map((s, i) => (
                        <p key={i} className="text-xs text-white/80 font-body">
                          <span className="text-gold-300 font-bold">
                            {formatNumber(i + 1, numberStyle)}.
                          </span>{' '}
                          {pf(getStepText(s))}
                        </p>
                      ))}
                    </div>
                  )}
                  {currentTry.explanation && (
                    <p className="text-xs text-white/70 text-center mt-2">
                      {pf(currentTry.explanation)}
                    </p>
                  )}
                  <button onClick={handleRevealNext} className="w-full mt-3 btn-primary !py-2.5 !text-sm">
                    {p(UI.gotIt)}
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {tryQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition ${
                      solved.has(q.id)
                        ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-200'
                        : i === tryIdx
                          ? 'bg-gold-400/30 border border-gold-400/50 text-gold-200'
                          : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                  >
                    {solved.has(q.id) ? '✓' : formatNumber(i + 1, numberStyle)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          {!allSolved && hasTry && (
            <p className="text-center text-xs text-white/50 mb-2">
              {remainingLabel}
            </p>
          )}

          <button
            onClick={handleComplete}
            disabled={hasTry && !allSolved}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition ${
              hasTry && !allSolved
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {finishButtonLabel}
          </button>

          {nextLesson && allSolved && (
            <button
              onClick={handleNextLesson}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              {p(UI.nextLesson)} {formatText(nextLessonTitleText, numberStyle)}
              <NextIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* فقاعة سوروبانا */}
      <AnimatePresence>
        {companionMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed z-[70] pointer-events-none"
            style={{ bottom: 'calc(12rem + 130px)', right: '0.75rem', maxWidth: '170px' }}
          >
            <div
              className="relative px-3 py-2 rounded-2xl shadow-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E9F7EF 100%)',
                borderColor: '#10B981',
                color: '#065F46',
              }}
            >
              <p className={`text-xs font-bold ${isAr ? 'text-right' : 'text-left'}`} dir={dir}>{companionMsg}</p>
              <div
                className="absolute"
                style={{
                  bottom: '-8px',
                  right: '20px',
                  width: '12px',
                  height: '12px',
                  background: '#E9F7EF',
                  borderRight: '2px solid #10B981',
                  borderBottom: '2px solid #10B981',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingCompanion playSound={playSound} />
      <SorobanaCompanion
        isSpeaking={sorobana.isSpeaking}
        onClick={() => { if (!isReadingStory && !isReadingModuleStory) sorobana.speakTeaching(); }}
        mode={tab === 'try' ? 'try' : 'watch'}
      />
    </div>
  );
}

export default LessonScreen;