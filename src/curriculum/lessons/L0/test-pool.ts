// src/screens/LevelTestScreen.tsx
// 🎓 اختبار نهاية المستوى — صعب، 60 ثانية، 80%

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Clock, CheckCircle2, XCircle, Trophy, Play, RotateCcw,
} from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { formatNumber } from '@/utils/numberStyle';
import {
  buildL0Test,
  L0_TEST_TOTAL_SEC,
  L0_TEST_PASS_THRESHOLD,
  L0_TEST_COOLDOWN_MS,
  L0_TEST_STORAGE_KEY,
  L0_TEST_LAST_ATTEMPT_KEY,
  type L0TestQuestion,
} from '@/curriculum/lessons/L0/test-pool';

// ═══════════════════════════════════════════════════════════
// Props
// ═══════════════════════════════════════════════════════════

interface LevelTestScreenProps {
  levelId: string;
  onBack: () => void;
  onPass: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
}

type Phase = 'intro' | 'cooldown' | 'running' | 'result';

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

function getColumns(value: number): number {
  const abs = Math.abs(value);
  if (abs < 10) return 1;
  if (abs < 100) return 2;
  if (abs < 1000) return 3;
  if (abs < 10000) return 4;
  return 6;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimeLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  return `${hrs} ساعة و ${mins} دقيقة`;
}

// ═══════════════════════════════════════════════════════════
// الشاشة
// ═══════════════════════════════════════════════════════════

export function LevelTestScreen({
  levelId,
  onBack,
  onPass,
  playSound,
}: LevelTestScreenProps) {
  const { style: numberStyle } = useNumberStyleStore();
  const isArabic = numberStyle === 'arabic';

  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<L0TestQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState(L0_TEST_TOTAL_SEC);
  const [abacusValue, setAbacusValue] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalPassed, setFinalPassed] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<((value: number) => void) | null>(null);

  const currentQ = questions[currentIdx];

  // ─── فحص cooldown ───
  useEffect(() => {
    try {
      const raw = localStorage.getItem(L0_TEST_LAST_ATTEMPT_KEY);
      if (raw) {
        const lastTime = parseInt(raw, 10);
        if (!isNaN(lastTime)) {
          const elapsed = Date.now() - lastTime;
          const remaining = L0_TEST_COOLDOWN_MS - elapsed;
          if (remaining > 0) {
            setCooldownMs(remaining);
            setPhase('cooldown');
            return;
          }
        }
      }
    } catch { /* ignore */ }
    setPhase('intro');
  }, []);

  // ─── عدّاد cooldown ───
  useEffect(() => {
    if (phase !== 'cooldown') return;
    const interval = setInterval(() => {
      setCooldownMs((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(interval);
          setPhase('intro');
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ─── بدء الاختبار ───
  const startTest = useCallback(() => {
    const qs = buildL0Test();
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers(new Map());
    setAbacusValue(0);
    setTimeLeft(L0_TEST_TOTAL_SEC);
    setPhase('running');
    playSound('click');
  }, [playSound]);

  // ─── إنهاء الاختبار + حساب النتيجة ───
  const finalizeTest = useCallback((finalAnswers: Map<string, number>) => {
    let correct = 0;
    questions.forEach((q) => {
      const ans = finalAnswers.get(q.id);
      if (ans !== undefined && ans === q.expectedValue) correct += 1;
    });
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= L0_TEST_PASS_THRESHOLD;

    setFinalScore(score);
    setFinalPassed(passed);

    // حفظ
    try {
      localStorage.setItem(L0_TEST_LAST_ATTEMPT_KEY, String(Date.now()));
      if (passed) {
        const raw = localStorage.getItem(L0_TEST_STORAGE_KEY);
        const arr: string[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(levelId)) {
          arr.push(levelId);
          localStorage.setItem(L0_TEST_STORAGE_KEY, JSON.stringify(arr));
        }
        // يُعلَّم المستوى كمكتمل (يفتح L1 في CategoryScreen)
        const rawLvls = localStorage.getItem('soroban_completed_levels');
        const levels: string[] = rawLvls ? JSON.parse(rawLvls) : [];
        if (!levels.includes(levelId)) {
          levels.push(levelId);
          localStorage.setItem('soroban_completed_levels', JSON.stringify(levels));
        }
      }
    } catch { /* ignore */ }

    setPhase('result');
    playSound(passed ? 'levelup' : 'whoosh');
  }, [questions, levelId, playSound]);

  // ─── العدّاد ───
  useEffect(() => {
    if (phase !== 'running') return;
    if (timeLeft <= 0) {
      finalizeTest(answers);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, timeLeft, answers, finalizeTest]);

  // ─── تسجيل إجابة والانتقال ───
  const submitAnswer = useCallback((value: number) => {
    if (!currentQ) return;
    const newAnswers = new Map(answers);
    newAnswers.set(currentQ.id, value);
    setAnswers(newAnswers);
    setAbacusValue(0);
    playSound('click');

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      finalizeTest(newAnswers);
    }
  }, [currentQ, currentIdx, questions, answers, finalizeTest, playSound]);

  // 🛡️ نحفظ المرجع لتجنّب مشاكل closure
  advanceRef.current = submitAnswer;

  // ─── اختيار (read) ───
  const handleChoice = useCallback((chosen: number) => {
    advanceRef.current?.(chosen);
  }, []);

  // ─── تحقق (build) ───
  const handleCheckBuild = useCallback(() => {
    advanceRef.current?.(abacusValue);
  }, [abacusValue]);

  // ─── إنهاء مبكر ───
  const confirmEnd = useCallback(() => {
    setShowEndConfirm(false);
    finalizeTest(answers);
  }, [answers, finalizeTest]);

  // ═══════════════════════════════════════════════════════════
  // Cooldown
  // ═══════════════════════════════════════════════════════════
  if (phase === 'cooldown') {
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { playSound('click'); onBack(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <Home className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-extrabold text-white">اختبار {levelId}</h2>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-2 border-amber-400/40">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-300" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-3">انتظر قليلاً</h3>
          <p className="text-sm text-white/70 text-center leading-relaxed mb-4">
            يمكنك إعادة الاختبار بعد <strong>٢٤ ساعة</strong> من المحاولة الأخيرة.
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center">
            <p className="text-xs text-amber-200 mb-1">الوقت المتبقي</p>
            <p className="text-2xl font-black text-amber-100">{formatTimeLeft(cooldownMs)}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Intro
  // ═══════════════════════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { playSound('click'); onBack(); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white">اختبار {levelId}</h2>
            <p className="text-sm text-white/50">تحدي نهاية المستوى</p>
          </div>
          <Trophy className="w-6 h-6 text-gold-300" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-xl mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-4">تحدي صعب!</h3>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">١.</span>
              <p><strong>{formatNumber(10, numberStyle)} أسئلة صعبة</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٢.</span>
              <p>الزمن الإجمالي: <strong>{formatNumber(60, numberStyle)} ثانية</strong> فقط</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٣.</span>
              <p><strong>محاولة واحدة</strong> لكل سؤال</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٤.</span>
              <p>عتبة النجاح: <strong>{formatNumber(80, numberStyle)}٪</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٥.</span>
              <p>بعد الفشل: انتظر <strong>٢٤ ساعة</strong></p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 leading-relaxed">
              ⚡ <strong>تحدي حقيقي:</strong> لا يوجد كشف للحل. ركّز جيداً!
            </p>
          </div>
        </motion.div>

        <button onClick={startTest} className="btn-primary w-full !py-4 !text-lg">
          <Play className="w-6 h-6" />
          ابدأ الاختبار
        </button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Running
  // ═══════════════════════════════════════════════════════════
  if (phase === 'running' && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 10;

    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-4 max-w-2xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <h2 className="text-base font-bold text-white">
              سؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-[10px] text-white/50">{currentQ.skillId} · {currentQ.type === 'read' ? 'اقرأ' : 'مثّل'}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border ${
            timeWarning ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 border-white/10'
          }`}>
            <Clock className={`w-4 h-4 ${timeWarning ? 'text-red-300' : 'text-amber-300'}`} />
            <span className={`font-bold font-mono text-sm ${timeWarning ? 'text-red-300' : 'text-white'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-600"
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 sm:p-6 w-full text-center mb-4"
          >
            <p className="text-lg font-extrabold text-white mb-4">{currentQ.prompt}</p>

            {currentQ.type === 'read' && (
              <>
                <div className="flex justify-center mb-4">
                  <Soroban2D5
                    key={`read-${currentQ.id}`}
                    columns={getColumns(currentQ.expectedValue)}
                    demoValue={currentQ.expectedValue}
                    interactive={false}
                    showValue={false}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {currentQ.choices?.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleChoice(c)}
                      className="py-4 rounded-2xl bg-white/10 border-2 border-white/20 text-white font-display font-black text-2xl hover:bg-white/20 hover:scale-105 active:scale-95 transition"
                    >
                      {formatNumber(c, numberStyle)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {currentQ.type === 'build' && (
              <>
                <div className="flex justify-center mb-3">
                  <Soroban2D5
                    key={`build-${currentQ.id}`}
                    columns={getColumns(currentQ.expectedValue)}
                    initialValue={0}
                    autoBeadSize={true}
                    interactive={true}
                    showValue={true}
                    onValueChange={setAbacusValue}
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={handleCheckBuild} className="btn-primary !py-2.5 !px-6 !text-sm">
                    <CheckCircle2 className="w-4 h-4" /> تحقق
                  </button>
                  <button onClick={() => { playSound('click'); setAbacusValue(0); }} className="btn-ghost !py-2.5 !px-4 !text-sm">
                    <RotateCcw className="w-4 h-4" /> مسح
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* End early */}
        <button
          onClick={() => { playSound('click'); setShowEndConfirm(true); }}
          className="w-full py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 font-bold text-xs transition"
        >
          إنهاء الاختبار الآن
        </button>

        {/* Modal */}
        <AnimatePresence>
          {showEndConfirm && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowEndConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-amber-500/30 text-center"
              >
                <h3 className="text-xl font-extrabold text-white mb-2">إنهاء الاختبار؟</h3>
                <p className="text-sm text-white/60 mb-6">
                  الأسئلة غير المُجابة تُحتسب صفراً.
                </p>
                <div className="flex gap-3">
                  <button onClick={confirmEnd} className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold">
                    نعم، أنهِ
                  </button>
                  <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold">
                    متابعة
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Result
  // ═══════════════════════════════════════════════════════════
  if (phase === 'result') {
    const passed = finalPassed;
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className={`absolute -top-24 -right-24 w-64 h-64 blur-3xl ${
            passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'
          }`} />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl mx-auto mb-4 ${
                passed ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-orange-600'
              }`}
            >
              {passed ? <Trophy className="w-12 h-12 text-white" /> : <XCircle className="w-12 h-12 text-white" />}
            </motion.div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              {passed ? '🎉 مبروك! نجحت' : '💪 حاول مرة أخرى'}
            </h2>

            <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">النتيجة</p>
              <p className="text-5xl font-black text-white">{formatNumber(finalScore, numberStyle)}٪</p>
              <p className={`text-sm font-bold mt-2 ${passed ? 'text-emerald-300' : 'text-amber-300'}`}>
                {passed ? '🎓 المستوى التالي مفتوح!' : `تحتاج ${formatNumber(80, numberStyle)}٪ للنجاح`}
              </p>
            </div>

            {!passed && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
                <p className="text-xs text-amber-200">
                  ⏰ يمكنك إعادة الاختبار بعد <strong>٢٤ ساعة</strong>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <button
          onClick={() => { playSound('click'); if (passed) onPass(); else onBack(); }}
          className="btn-primary w-full !py-4 !text-lg"
        >
          {passed ? '🎓 تابع الرحلة' : 'العودة'}
        </button>
      </div>
    );
  }

  return null;
}

export default LevelTestScreen;