// src/screens/LessonScreen.tsx
// 📖 شاشة الدرس: شاهد (قصة + أمثلة) + جرّب (أسئلة تفاعلية)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, Square, Eye, Hand, ChevronRight, ChevronLeft,
  CheckCircle2, Lightbulb, Sparkles, RotateCcw, Type,
} from 'lucide-react';

import { getLessonById, getNextLesson } from '@/curriculum/lessons';
import type { LessonExample, TryQuestion } from '@/curriculum/lessons';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { SorobanaCompanion } from '@/components/SorobanaCompanion';
import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const LESSON_PROGRESS_KEY = 'soroban_completed_lessons';
const MAX_TRIES = 2;

// ═══════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════

interface LessonScreenProps {
  lessonId: string;
  onBack: () => void;
  onNext?: (nextLessonId: string) => void;
  onComplete: (lessonId: string) => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
}

type Tab = 'watch' | 'try';

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

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
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();
  const isArabic = numberStyle === 'arabic';

  // ─── حالة العرض ───
  const [tab, setTab] = useState<Tab>('watch');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [tryIdx, setTryIdx] = useState(0);
  const [showSteps, setShowSteps] = useState(false);

  // ─── حالة جرب ───
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'reveal'>('idle');
  const [abacusValue, setAbacusValue] = useState(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [choices, setChoices] = useState<number[]>([]);

  // 🆕 حالة تسلسل — لسؤال sequence
  const [sequencePicks, setSequencePicks] = useState<number[]>([]);

  // ─── حالة الصوت ───
  const [isReadingStory, setIsReadingStory] = useState(false);

  // ─── 🆕 فقاعة سوروبانا ───
  const [companionMsg, setCompanionMsg] = useState<string | null>(null);

  const showCompanionMsg = (msg: string, duration = 2200) => {
    setCompanionMsg(msg);
    window.setTimeout(() => setCompanionMsg(null), duration);
  };

  // ─── الحماية: لا درس ───
  if (!lesson) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card p-6 text-center max-w-md">
          <p className="text-white/60 mb-4">الدرس غير موجود</p>
          <button onClick={onBack} className="btn-primary w-full">رجوع</button>
        </div>
      </div>
    );
  }

  const examples = lesson.examples;
  const tryQuestions = lesson.tryQuestions;
  const currentExample: LessonExample | undefined = examples[exampleIdx];
  const currentTry: TryQuestion | undefined = tryQuestions[tryIdx];

  const totalTry = tryQuestions.length;
  const solvedCount = solved.size;
  const allSolved = totalTry > 0 && solvedCount === totalTry;
  const hasTry = totalTry > 0;

  // ─── تبديل التاب ───
  const switchTab = (t: Tab) => {
    playSound('click');
    setTab(t);
    setFeedback('idle');
    setAbacusValue(0);
    setInputValue('');
    setShowSteps(false);
  };

  // ─── تشغيل/إيقاف القصة ───
  const toggleStory = () => {
    if (!lesson.storyAudioId) return;
    if (isReadingStory) {
      sorobana.stop();
      setIsReadingStory(false);
      return;
    }
    sorobana.stop();
    playSound('click');
    setIsReadingStory(true);
    sorobana.speakStory(lesson.storyAudioId, () => {
      setIsReadingStory(false);
    });
  };

  // ─── التنقل في الأمثلة ───
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

  // ─── توليد الخيارات ───
  useEffect(() => {
    if (tab === 'try' && currentTry && currentTry.type === 'read') {
      setChoices(generateChoices(currentTry.expectedValue));
      setInputValue('');
    }
  }, [tab, tryIdx, currentTry?.id]);

  // 🆕 إعادة تعيين تسلسل عند تغيير السؤال
  useEffect(() => {
    setSequencePicks([]);
  }, [tryIdx]);

  // ─── 🆕 تفاعل مشترك مع الإجابة ───
  const reactToAnswer = (isCorrect: boolean, attempt: number) => {
    if (isCorrect) {
      playSound('success');
      sorobana.speakCorrect();
      showCompanionMsg('أحسنت! 🌟');
      setFeedback('correct');
    } else {
      playSound('error');
      sorobana.speakWrong();
      if (attempt >= MAX_TRIES) {
        setFeedback('reveal');
      } else {
        setFeedback('wrong');
      }
    }
  };

  // ─── التحقق (read + compare) ───
  const handleCheckRead = (chosen: number) => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = chosen === currentTry.expectedValue;
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

  // ─── التحقق (build) ───
  const handleCheckBuild = () => {
    if (!currentTry || feedback === 'reveal') return;
    const isCorrect = abacusValue === currentTry.expectedValue;
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

  // 🆕 التحقق (sequence) — يتحقق من كل ضغطة
  const handleSequenceClick = (c: number) => {
    if (!currentTry || !currentTry.choices || feedback === 'reveal') return;
    if (sequencePicks.includes(c)) return;

    const sorted = [...currentTry.choices].sort((a, b) => a - b);
    const nextIndex = sequencePicks.length;

    if (sorted[nextIndex] === c) {
      // الضغطة صحيحة — نُكمل
      const newPicks = [...sequencePicks, c];
      setSequencePicks(newPicks);

      if (newPicks.length === sorted.length) {
        // اكتمل التسلسل بنجاح
        const key = currentTry.id;
        const attempt = (attempts[key] ?? 0) + 1;
        setAttempts((a) => ({ ...a, [key]: attempt }));
        setSolved((s) => new Set(s).add(key));
        reactToAnswer(true, attempt);
        setTimeout(() => advanceTry(), 1100);
      }
    } else {
      // ضغطة خاطئة — تُحسب محاولة
      const key = currentTry.id;
      const attempt = (attempts[key] ?? 0) + 1;
      setAttempts((a) => ({ ...a, [key]: attempt }));
      reactToAnswer(false, attempt);
    }
  };

  const advanceTry = () => {
    setFeedback('idle');
    setAbacusValue(0);
    setInputValue('');
    setSequencePicks([]);
    if (tryIdx + 1 >= totalTry) {
      // آخر سؤال
    } else {
      setTryIdx((i) => i + 1);
    }
  };

  const handleRevealNext = () => {
    if (!currentTry) return;
    setSolved((s) => new Set(s).add(currentTry.id));
    advanceTry();
  };

  // ─── إنهاء الدرس ───
  const handleComplete = () => {
    playSound('levelup');
    sorobana.stop();
    setIsReadingStory(false);
    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes(lessonId)) {
        arr.push(lessonId);
        localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
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
    onBack();
  };

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════

  return (
    <div dir="rtl" className="min-h-screen pb-40">
      {/* ───── Header ───── */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={handleHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="رجوع للقائمة"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              {formatText(lesson.title.ar, numberStyle)}
            </h1>
            <p className="text-[10px] text-white/50 truncate">
              {lesson.skillId ?? 'مقدمة'} · {lesson.levelId}
            </p>
          </div>
          <button
            onClick={() => { playSound('click'); toggleStyle(); }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="تبديل نمط الأرقام"
          >
            <Type className="w-5 h-5 text-white" />
          </button>
        </div>

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
            <Eye className="w-4 h-4" /> شاهد
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
              <Hand className="w-4 h-4" /> جرّب
              {solvedCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/30">
                  {solvedCount}/{totalTry}
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
              key="watch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* القصة */}
              <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-300" />
                    <h3 className="text-sm font-bold text-pink-300">📖 القصة</h3>
                  </div>
                  {lesson.storyAudioId !== null && (
                    <button
                      onClick={toggleStory}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        isReadingStory
                          ? 'bg-red-500/30 border border-red-400/50 text-red-200'
                          : 'bg-rose-500/20 border border-rose-400/40 text-rose-200 hover:bg-rose-500/30'
                      }`}
                    >
                      {isReadingStory ? (
                        <><Square className="w-3.5 h-3.5" /> إيقاف</>
                      ) : (
                        <><Volume2 className="w-3.5 h-3.5" /> موجز القصة</>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-sm text-white/85 font-body leading-relaxed">
                  {formatText(lesson.story.ar, numberStyle)}
                </p>
              </div>

              {/* المفهوم + القاعدة */}
              {(lesson.concept || lesson.rule) && (
                <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                  <h3 className="text-sm font-bold text-gold-300 mb-2">💡 المفهوم</h3>
                  <p className="text-sm text-white/85 font-body leading-relaxed mb-3">
                    {formatText(lesson.concept.ar, numberStyle)}
                  </p>

                  {lesson.rule && (
                    <>
                      <h3 className="text-sm font-bold text-gold-300 mb-1 mt-3">📏 القاعدة</h3>
                      <p className="text-sm text-white/85 font-body leading-relaxed">
                        {formatText(lesson.rule.ar, numberStyle)}
                      </p>
                    </>
                  )}

                  {lesson.ruleTable && lesson.ruleTable.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {lesson.ruleTable.map((row, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 border border-white/10"
                        >
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
                      مثال {formatNumber(exampleIdx + 1, numberStyle)} من{' '}
                      {formatNumber(examples.length, numberStyle)}
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
                    {formatText(currentExample.problemText, numberStyle)}
                  </p>

                  <div className="flex justify-center mb-4">
                    <Soroban2D5
                      key={`ex-${currentExample.id}`}
                      columns={getColumnsForValue(currentExample.answer)}
                      demoValue={currentExample.answer}
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
                      اشرح لي الخطوات
                    </button>
                  )}

                  {showSteps && currentExample.steps.length > 0 && (
                    <div className="space-y-2">
                      {currentExample.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-3 rounded-xl bg-electric-500/10 border border-electric-400/30"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-full bg-electric-500/30 flex items-center justify-center text-xs font-bold text-electric-200 shrink-0">
                              {formatNumber(i + 1, numberStyle)}
                            </span>
                            <p className="text-sm text-white/85 font-body leading-relaxed flex-1">
                              {formatText(step.instructionText, numberStyle)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      <p className="text-xs text-center text-emerald-300 font-bold pt-1">
                        ✨ {formatText(currentExample.explanation, numberStyle)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={prevExample}
                      disabled={exampleIdx === 0}
                      className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      <ChevronRight className="w-4 h-4" /> السابق
                    </button>
                    <button
                      onClick={nextExample}
                      disabled={exampleIdx === examples.length - 1}
                      className="flex-1 py-2.5 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                    >
                      التالي <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {examples.length === 0 && (
                <div className="glass-card p-5 text-center text-white/60 text-sm">
                  هذا الدرس نظري — لا يحتوي على أمثلة تفاعلية.
                </div>
              )}
            </motion.div>
          )}

          {tab === 'try' && currentTry && (
            <motion.div
              key="try"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/70">
                  سؤال {formatNumber(tryIdx + 1, numberStyle)} من{' '}
                  {formatNumber(totalTry, numberStyle)}
                </h3>
                <span className="text-xs text-white/50">
                  محاولة {formatNumber(attempts[currentTry.id] ?? 1, numberStyle)} /{' '}
                  {formatNumber(MAX_TRIES, numberStyle)}
                </span>
              </div>

              <div className="glass-card p-4 sm:p-5 text-center">
                <p className="text-lg font-extrabold font-display text-white mb-4">
                  {formatText(currentTry.prompt, numberStyle)}
                </p>

                {/* ──────── read ──────── */}
                {currentTry.type === 'read' && (
                  <>
                    <div className="flex justify-center mb-4">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTry.expectedValue)}
                        demoValue={currentTry.expectedValue}
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

                {/* ──────── build + build-value ──────── */}
                {(currentTry.type === 'build' || currentTry.type === 'build-value') && (
                  <>
                    <div className="flex justify-center mb-3">
                      <Soroban2D5
                        key={`tr-${currentTry.id}`}
                        columns={getColumnsForValue(currentTry.expectedValue)}
                        initialValue={0}
                        autoBeadSize={true}
                        interactive={feedback !== 'reveal' && feedback !== 'correct'}
                        showValue={true}
                        onValueChange={setAbacusValue}
                      />
                    </div>

                    {feedback !== 'reveal' && feedback !== 'correct' && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={handleCheckBuild}
                          className="btn-primary !py-2.5 !px-6 !text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" /> تحقق
                        </button>
                        <button
                          onClick={() => { playSound('click'); setAbacusValue(0); }}
                          className="btn-ghost !py-2.5 !px-4 !text-sm"
                        >
                          <RotateCcw className="w-4 h-4" /> مسح
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* ──────── 🆕 compare ──────── */}
                {currentTry.type === 'compare' && currentTry.choices && (
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-2">
                    {currentTry.choices.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCheckRead(c)}
                        disabled={feedback === 'correct' || feedback === 'reveal'}
                        className="py-8 rounded-3xl bg-gradient-to-br from-electric-500/20 to-purple-500/20 border-4 border-white/20 text-white font-display font-black text-4xl hover:from-electric-500/30 hover:to-purple-500/30 hover:scale-105 active:scale-95 transition disabled:opacity-40 shadow-xl"
                      >
                        {formatNumber(c, numberStyle)}
                      </button>
                    ))}
                  </div>
                )}

                {/* ──────── 🆕 sequence ──────── */}
                {currentTry.type === 'sequence' && currentTry.choices && (
                  <>
                    <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mt-2">
                      {currentTry.choices.map((c) => {
                        const picked = sequencePicks.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => handleSequenceClick(c)}
                            disabled={
                              picked ||
                              feedback === 'correct' ||
                              feedback === 'reveal'
                            }
                            className={`py-6 rounded-3xl border-4 font-display font-black text-3xl transition shadow-xl ${
                              picked
                                ? 'bg-emerald-500/30 border-emerald-400/60 text-emerald-200 scale-95'
                                : 'bg-gradient-to-br from-gold-400/20 to-amber-500/20 border-white/20 text-white hover:from-gold-400/30 hover:to-amber-500/30 hover:scale-105 active:scale-95'
                            } disabled:opacity-60`}
                          >
                            {formatNumber(c, numberStyle)}
                          </button>
                        );
                      })}
                    </div>
                    {sequencePicks.length > 0 &&
                      sequencePicks.length < (currentTry.choices?.length ?? 0) && (
                        <p className="text-center text-xs text-emerald-300 font-bold mt-3">
                          ✓ اخترت {formatNumber(sequencePicks.length, numberStyle)} — تابع...
                        </p>
                      )}
                  </>
                )}
              </div>

              {feedback === 'correct' && (
                <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-center">
                  <p className="text-sm font-bold text-emerald-200">✅ أحسنت! إجابة صحيحة</p>
                </div>
              )}

              {feedback === 'wrong' && (
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-center">
                  <p className="text-sm font-bold text-amber-200">❌ حاول مرة أخرى</p>
                  <p className="text-[10px] text-amber-200/70 mt-1">
                    آخر محاولة — إن أخطأت، ستُعرض الإجابة
                  </p>
                </div>
              )}

              {feedback === 'reveal' && (
                <div className="p-4 rounded-2xl bg-gold-500/15 border border-gold-400/40">
                  <p className="text-sm font-bold text-gold-300 text-center mb-2">
                    💡 الإجابة الصحيحة: {formatNumber(currentTry.expectedValue, numberStyle)}
                  </p>

                  {currentTry.steps && currentTry.steps.length > 0 && (
                    <div className="space-y-1.5 mt-3">
                      {currentTry.steps.map((s, i) => (
                        <p key={i} className="text-xs text-white/80 font-body">
                          <span className="text-gold-300 font-bold">
                            {formatNumber(i + 1, numberStyle)}.
                          </span>{' '}
                          {formatText(s.instructionText, numberStyle)}
                        </p>
                      ))}
                    </div>
                  )}

                  {currentTry.explanation && (
                    <p className="text-xs text-white/70 text-center mt-2">
                      {formatText(currentTry.explanation, numberStyle)}
                    </p>
                  )}

                  <button
                    onClick={handleRevealNext}
                    className="w-full mt-3 btn-primary !py-2.5 !text-sm"
                  >
                    فهمت، التالي
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
              أكمل {formatNumber(totalTry - solvedCount, numberStyle)} سؤالاً إضافياً لفتح الدرس التالي
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
            {hasTry && !allSolved
              ? `أكمل الأسئلة (${formatNumber(solvedCount, numberStyle)}/${formatNumber(totalTry, numberStyle)})`
              : `أكملت الدرس +${formatNumber(lesson.xpReward, numberStyle)} XP`}
          </button>

          {nextLesson && allSolved && (
            <button
              onClick={handleNextLesson}
              className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              الدرس التالي: {formatText(nextLesson.title.ar, numberStyle)}
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ───── فقاعة سوروبانا ───── */}
      <AnimatePresence>
        {companionMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="fixed z-[70] pointer-events-none"
            style={{
              bottom: 'calc(12rem + 130px)',
              right: '0.75rem',
              maxWidth: '170px',
            }}
          >
            <div
              className="relative px-3 py-2 rounded-2xl shadow-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E9F7EF 100%)',
                borderColor: '#10B981',
                color: '#065F46',
              }}
            >
              <p className="text-xs font-bold text-right" dir="rtl">
                {companionMsg}
              </p>
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
        onClick={() => { if (!isReadingStory) sorobana.speakTeaching(); }}
        mode={tab === 'try' ? 'try' : 'watch'}
      />
    </div>
  );
}

export default LessonScreen;