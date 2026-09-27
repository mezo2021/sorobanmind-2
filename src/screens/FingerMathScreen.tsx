// src/screens/FingerMathScreen.tsx
// 🖐️ شاشة رياضيات الأصابع — إثراء

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Volume2, Square, Eye, ChevronRight, ChevronLeft,
  CheckCircle2, Sparkles, Type, Hand,
} from 'lucide-react';

import { FingerMath } from '@/components/FingerMath';
import { FloatingCompanion } from '@/components/FloatingCompanion';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatText, formatNumber } from '@/utils/numberStyle';

// ═══════════════════════════════════════════════════════════
// الثوابت
// ═══════════════════════════════════════════════════════════

const STORY_AUDIO_ID = 0; // story-0.mp3
const MAX_TRIES = 2;
const COMPLETED_KEY = 'soroban_completed_enrichment';

const STORY =
  'في مملكة الأصابع، تعيش عائلتان صديقتان: عائلة اليد اليمنى المسؤولة عن الآحاد، وعائلة اليد اليسرى المسؤولة عن العشرات. الإبهام هو الجدة الحنونة قيمتها 5، والأصابع الأربعة أطفال كل واحد قيمته 1. اجتمعوا معاً ليصنعوا كل الأعداد من 0 إلى 99!';

const CONCEPT = 'الإبهام = 5 (الجدة) · الأصابع الأخرى = 1 (طفل)';
const RULE = 'اليد اليمنى = الآحاد · اليد اليسرى = العشرات';

const EXAMPLES = [
  { value: 1, text: 'مثل الرقم 1' },
  { value: 3, text: 'مثل الرقم 3' },
  { value: 5, text: 'مثل الرقم 5 (الجدة)' },
  { value: 7, text: 'مثل الرقم 7' },
  { value: 9, text: 'مثل الرقم 9' },
  { value: 10, text: 'مثل الرقم 10' },
  { value: 27, text: 'مثل الرقم 27' },
  { value: 99, text: 'مثل الرقم 99' },
];

const TRY_QUESTIONS = [
  { value: 4 },
  { value: 6 },
  { value: 8 },
  { value: 13 },
  { value: 42 },
];

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function generateChoices(correct: number): number[] {
  const set = new Set<number>([correct]);
  const candidates = [
    correct - 1, correct + 1, correct - 2, correct + 2,
    correct + 5, correct - 5, correct + 10,
    Math.max(0, correct - 10),
  ].filter((n) => n >= 0 && n !== correct && n <= 99);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  for (const n of shuffled) {
    if (set.size >= 4) break;
    set.add(n);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

// ═══════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════

interface FingerMathScreenProps {
  onBack: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
  onXP?: (amount: number) => void;
}

type Tab = 'watch' | 'try';

// ═══════════════════════════════════════════════════════════
// الشاشة
// ═══════════════════════════════════════════════════════════

export function FingerMathScreen({
  onBack,
  playSound,
  onXP,
}: FingerMathScreenProps) {
  const sorobana = useSorobanaVoice();
  const { style: numberStyle, toggleStyle } = useNumberStyleStore();

  const [tab, setTab] = useState<Tab>('watch');
  const [exampleIdx, setExampleIdx] = useState(0);
  const [tryIdx, setTryIdx] = useState(0);
  const [attempts, setAttempts] = useState<Record<number, number>>({});
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong' | 'reveal'>('idle');
  const [choices, setChoices] = useState<number[]>([]);
  const [isReadingStory, setIsReadingStory] = useState(false);

  const totalTry = TRY_QUESTIONS.length;
  const solvedCount = solved.size;
  const allSolved = solvedCount === totalTry;

  useEffect(() => {
    if (tab === 'try') {
      const q = TRY_QUESTIONS[tryIdx];
      setChoices(generateChoices(q.value));
    }
  }, [tab, tryIdx]);

  const toggleStory = () => {
    if (isReadingStory) {
      sorobana.stop();
      setIsReadingStory(false);
      return;
    }
    sorobana.stop();
    playSound('click');
    setIsReadingStory(true);
    sorobana.speakStory(STORY_AUDIO_ID, () => setIsReadingStory(false));
  };

  const handleAnswer = (chosen: number) => {
    if (feedback === 'reveal') return;
    const q = TRY_QUESTIONS[tryIdx];
    const isCorrect = chosen === q.value;
    const attempt = (attempts[tryIdx] ?? 0) + 1;
    setAttempts((a) => ({ ...a, [tryIdx]: attempt }));

    if (isCorrect) {
      playSound('success');
      sorobana.speakCorrect();
      setFeedback('correct');
      setSolved((s) => new Set(s).add(tryIdx));
      setTimeout(() => {
        setFeedback('idle');
        if (tryIdx + 1 < totalTry) setTryIdx((i) => i + 1);
      }, 1100);
    } else {
      playSound('error');
      sorobana.speakWrong();
      if (attempt >= MAX_TRIES) setFeedback('reveal');
      else setFeedback('wrong');
    }
  };

  const handleReveal = () => {
    setSolved((s) => new Set(s).add(tryIdx));
    setFeedback('idle');
    if (tryIdx + 1 < totalTry) setTryIdx((i) => i + 1);
  };

  const handleComplete = () => {
    playSound('levelup');
    sorobana.stop();
    try {
      const raw = localStorage.getItem(COMPLETED_KEY);
      const arr: string[] = raw ? JSON.parse(raw) : [];
      if (!arr.includes('finger-math')) {
        arr.push('finger-math');
        localStorage.setItem(COMPLETED_KEY, JSON.stringify(arr));
      }
    } catch { /* ignore */ }
    if (onXP) onXP(20);
    onBack();
  };

  const handleHome = () => {
    playSound('click');
    sorobana.stop();
    setIsReadingStory(false);
    onBack();
  };

  const currentExample = EXAMPLES[exampleIdx];
  const currentTry = TRY_QUESTIONS[tryIdx];

  return (
    <div dir="rtl" className="min-h-screen pb-36">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-lg bg-slate-900/70 border-b border-white/10 px-3 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <button
            onClick={handleHome}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
            aria-label="رجوع"
          >
            <Home className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              🖐️ رياضيات الأصابع
            </h1>
            <p className="text-[10px] text-white/50">إثراء · الفئة 5-12</p>
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
            onClick={() => { playSound('click'); setTab('watch'); setFeedback('idle'); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-sm transition ${
              tab === 'watch'
                ? 'bg-gradient-to-l from-purple-500 to-electric-500 text-white shadow-lg'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" /> شاهد
          </button>
          <button
            onClick={() => { playSound('click'); setTab('try'); setFeedback('idle'); }}
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
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-5">
        <AnimatePresence mode="wait">
          {tab === 'watch' && (
            <motion.div
              key="watch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Story */}
              <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-300" />
                    <h3 className="text-sm font-bold text-pink-300">📖 القصة</h3>
                  </div>
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
                </div>
                <p className="text-sm text-white/85 font-body leading-relaxed">
                  {formatText(STORY, numberStyle)}
                </p>
              </div>

              {/* Concept */}
              <div className="glass-card p-4 sm:p-5 bg-gradient-to-br from-gold-400/10 to-gold-600/10 border border-gold-400/30">
                <h3 className="text-sm font-bold text-gold-300 mb-2">💡 المفهوم</h3>
                <p className="text-sm text-white/85 font-body mb-3">
                  {formatText(CONCEPT, numberStyle)}
                </p>
                <h3 className="text-sm font-bold text-gold-300 mb-1">📏 القاعدة</h3>
                <p className="text-sm text-white/85 font-body">
                  {formatText(RULE, numberStyle)}
                </p>
              </div>

              {/* Example */}
              <div className="glass-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white/70">
                    مثال {formatNumber(exampleIdx + 1, numberStyle)} من{' '}
                    {formatNumber(EXAMPLES.length, numberStyle)}
                  </h3>
                  <div className="flex gap-1">
                    {EXAMPLES.map((_, i) => (
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
                  {formatText(currentExample.text, numberStyle)}
                </p>

                <div className="flex justify-center mb-4 overflow-x-auto">
                  <FingerMath value={currentExample.value} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { playSound('click'); if (exampleIdx > 0) setExampleIdx((i) => i - 1); }}
                    disabled={exampleIdx === 0}
                    className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                  >
                    <ChevronRight className="w-4 h-4" /> السابق
                  </button>
                  <button
                    onClick={() => { playSound('click'); if (exampleIdx + 1 < EXAMPLES.length) setExampleIdx((i) => i + 1); }}
                    disabled={exampleIdx === EXAMPLES.length - 1}
                    className="flex-1 py-2.5 rounded-2xl bg-gradient-to-l from-purple-500 to-electric-500 text-white font-bold text-sm disabled:opacity-30 transition flex items-center justify-center gap-1"
                  >
                    التالي <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'try' && currentTry && (
            <motion.div
              key="try"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/70">
                  سؤال {formatNumber(tryIdx + 1, numberStyle)} من{' '}
                  {formatNumber(totalTry, numberStyle)}
                </h3>
                <span className="text-xs text-white/50">
                  محاولة {formatNumber(attempts[tryIdx] ?? 1, numberStyle)} /{' '}
                  {formatNumber(MAX_TRIES, numberStyle)}
                </span>
              </div>

              <div className="glass-card p-4 sm:p-5 text-center">
                <p className="text-lg font-extrabold font-display text-white mb-4">
                  كم يساوي هذا العدد؟
                </p>

                <div className="flex justify-center mb-4 overflow-x-auto">
                  <FingerMath value={currentTry.value} />
                </div>

                {feedback !== 'reveal' && (
                  <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                    {choices.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleAnswer(c)}
                        disabled={feedback === 'correct'}
                        className="py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-display font-black text-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition disabled:opacity-40"
                      >
                        {formatNumber(c, numberStyle)}
                      </button>
                    ))}
                  </div>
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
                </div>
              )}

              {feedback === 'reveal' && (
                <div className="p-4 rounded-2xl bg-gold-500/15 border border-gold-400/40">
                  <p className="text-sm font-bold text-gold-300 text-center mb-2">
                    💡 الإجابة: {formatNumber(currentTry.value, numberStyle)}
                  </p>
                  <button
                    onClick={handleReveal}
                    className="w-full mt-3 btn-primary !py-2.5 !text-sm"
                  >
                    فهمت، التالي
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {TRY_QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition ${
                      solved.has(i)
                        ? 'bg-emerald-500/30 border border-emerald-400/50 text-emerald-200'
                        : i === tryIdx
                          ? 'bg-gold-400/30 border border-gold-400/50 text-gold-200'
                          : 'bg-white/5 border border-white/10 text-white/40'
                    }`}
                  >
                    {solved.has(i) ? '✓' : formatNumber(i + 1, numberStyle)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          {!allSolved && (
            <p className="text-center text-xs text-white/50 mb-2">
              أكمل {formatNumber(totalTry - solvedCount, numberStyle)} سؤالاً إضافياً
            </p>
          )}
          <button
            onClick={handleComplete}
            disabled={!allSolved}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition ${
              !allSolved
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-gradient-to-l from-emerald-500 to-teal-600 text-white'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            {allSolved
              ? 'أكملت الدرس +20 XP'
              : `أكمل الأسئلة (${formatNumber(solvedCount, numberStyle)}/${formatNumber(totalTry, numberStyle)})`}
          </button>
        </div>
      </div>

      <FloatingCompanion playSound={playSound} />
    </div>
  );
}

export default FingerMathScreen;