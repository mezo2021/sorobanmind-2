// src/screens/LevelTestScreen.tsx
// اختبار نهاية المستوى — من بنك SRB (phase: X)
// 📅 آخر تحديث: 2026-10-08 — إصلاح ديناميكي لكل المستويات
// [FIX LT1] — getTestQuestions(levelId) بدل buildL0Test() الثابت
// [FIX LT2] — صيغة زمنية تكيفية: FIXED + (Σ avg × 1.5) + BUFFER
// [FIX LT3] — عتبة نجاح 70% (بدل 80%)
// [FIX LT4] — cooldown 30 دقيقة لكل مستوى (بدل 24 ساعة)

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, CheckCircle2, XCircle, Trophy, Play, RotateCcw } from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useProgressStore } from '@/store/progressStore';
import { formatNumber } from '@/utils/numberStyle';
import {
  getTestQuestions,
  saveSectionGrade,
  type SRBQuestion,
  type SRBLevel,
  type SRBSection,
} from '@/data/srb-adapter';

// ═══════════════════════════════════════════════════════════
// ثوابت
// ═══════════════════════════════════════════════════════════

const PASS_THRESHOLD = 70;                       // 70%
const COOLDOWN_MS = 30 * 60 * 1000;              // 30 دقيقة
const FIXED_SEC = 20;                             // تعليمات + تنقل
const ARAB_FACTOR = 1.5;                          // معامل الطفل العربي
const BUFFER_SEC = 90;                            // احتياط (1.5 دقيقة)
const QUESTION_COUNT = 10;
const PASSED_TESTS_KEY = 'soroban_passed_level_tests';
const LAST_ATTEMPT_KEY = (levelId: string) =>
  `soroban_level_test_last_attempt_${levelId}`;

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
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function formatTimeLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins < 1) return `${secs} ثانية`;
  return `${mins} دقيقة و ${secs} ثانية`;
}

// [FIX LT2] — الصيغة التكيفية
function computeTotalTime(questions: SRBQuestion[]): number {
  const sumAvgMs = questions.reduce(
    (sum, q) => sum + (q.target_time_ms[0] + q.target_time_ms[1]) / 2,
    0,
  );
  return FIXED_SEC + Math.round((sumAvgMs / 1000) * ARAB_FACTOR) + BUFFER_SEC;
}

// RNG + توليد خيارات (للأسئلة من نوع read)
function createRng(seed: number): () => number {
  let value = seed >>> 0;
  return (): number => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateChoices(correct: number, seed: number): number[] {
  const rng = createRng(seed);
  const choices = new Set<number>([correct]);
  let guard = 0;
  while (choices.size < 4 && guard < 60) {
    guard++;
    const delta = Math.floor(rng() * 5) - 2; // -2..+2
    if (delta === 0) continue;
    const candidate = correct + delta;
    if (candidate >= 0 && candidate <= 99999) choices.add(candidate);
  }
  const arr = [...choices];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ═══════════════════════════════════════════════════════════
// الأنواع
// ═══════════════════════════════════════════════════════════

interface LevelTestScreenProps {
  levelId: string;
  onBack: () => void;
  onPass: () => void;
  playSound: (type: 'click' | 'success' | 'error' | 'bead' | 'whoosh' | 'levelup') => void;
}

type Phase = 'intro' | 'cooldown' | 'running' | 'result';

// ═══════════════════════════════════════════════════════════
// المكوّن
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
  const [questions, setQuestions] = useState<SRBQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [abacusValue, setAbacusValue] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [finalPassed, setFinalPassed] = useState(false);
  const [cooldownMs, setCooldownMs] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentQ = questions[currentIdx];

  // خيارات الـ read (memoized لكل سؤال)
  const currentChoices = useMemo(() => {
    if (!currentQ || currentQ.operation !== 'read') return [];
    return generateChoices(currentQ.result, currentQ.id.length + currentIdx * 17);
  }, [currentQ, currentIdx]);

  // ═══ Cooldown check ═══
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_ATTEMPT_KEY(levelId));
      if (raw) {
        const lastTime = parseInt(raw, 10);
        if (!isNaN(lastTime)) {
          const elapsed = Date.now() - lastTime;
          const remaining = COOLDOWN_MS - elapsed;
          if (remaining > 0) {
            setCooldownMs(remaining);
            setPhase('cooldown');
            return;
          }
        }
      }
    } catch { /* ignore */ }
    setPhase('intro');
  }, [levelId]);

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

  // ═══ Start ═══
  const startTest = useCallback(() => {
    const qs = getTestQuestions(levelId as SRBLevel);
    if (qs.length === 0) {
      playSound('error');
      return;
    }
    const sliced = qs.slice(0, QUESTION_COUNT);
    const total = computeTotalTime(sliced);

    setQuestions(sliced);
    setCurrentIdx(0);
    setAnswers(new Map());
    setAbacusValue(0);
    setTotalTime(total);
    setTimeLeft(total);
    setPhase('running');
    playSound('click');
  }, [levelId, playSound]);

  // ═══ Finalize ═══
  const finalizeTest = useCallback((finalAnswers: Map<string, number>) => {
    let correct = 0;
    questions.forEach((q) => {
      const ans = finalAnswers.get(q.id);
      if (ans !== undefined && ans === q.result) correct += 1;
    });
    const score = questions.length === 0
      ? 0
      : Math.round((correct / questions.length) * 100);
    const passed = score >= PASS_THRESHOLD;

    setFinalScore(score);
    setFinalPassed(passed);

    try {
      localStorage.setItem(LAST_ATTEMPT_KEY(levelId), String(Date.now()));

      if (passed) {
        const raw = localStorage.getItem(PASSED_TESTS_KEY);
        const arr: string[] = raw ? JSON.parse(raw) : [];
        if (!arr.includes(levelId)) {
          arr.push(levelId);
          localStorage.setItem(PASSED_TESTS_KEY, JSON.stringify(arr));
        }
      }

      const firstSection = (questions[0]?.section ?? 'S01') as SRBSection;
      saveSectionGrade(
        levelId as SRBLevel,
        firstSection,
        'test',
        score,
        [],
      );

      const store = useProgressStore.getState();
      store.setGrade(levelId, 'levelTest', score);
store.markLevelComplete(levelId as never);
    } catch { /* ignore */ }

    setPhase('result');
    playSound(passed ? 'levelup' : 'whoosh');
  }, [questions, levelId, playSound]);

  // ═══ Timer ═══
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

  const handleChoice = useCallback((chosen: number) => {
    submitAnswer(chosen);
  }, [submitAnswer]);

  const handleCheckBuild = useCallback(() => {
    submitAnswer(abacusValue);
  }, [abacusValue, submitAnswer]);

  const confirmEnd = useCallback(() => {
    setShowEndConfirm(false);
    finalizeTest(answers);
  }, [answers, finalizeTest]);

  // ⏸️ الجزء 2 يبدأ من هنا — أرسل "تابع"
  // ═══ Cooldown ═══
  if (phase === 'cooldown') {
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-extrabold text-white">اختبار {levelId}</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-2 border-amber-400/40"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-300" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-3">انتظر قليلًا</h3>
          <p className="text-sm text-white/70 text-center leading-relaxed mb-4">
            يمكنك إعادة الاختبار بعد ٣٠ دقيقة من المحاولة الأخيرة.
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center">
            <p className="text-xs text-amber-200 mb-1">الوقت المتبقي</p>
            <p className="text-2xl font-black text-amber-100">{formatTimeLeft(cooldownMs)}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ Intro ═══
  if (phase === 'intro') {
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white">اختبار {levelId}</h2>
            <p className="text-sm text-white/50">تحدي نهاية المستوى</p>
          </div>
          <Trophy className="w-6 h-6 text-gold-300" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-xl mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-4">تحدي نهاية المستوى</h3>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">١.</span>
              <p><strong>١٠ أسئلة</strong> من بنك {levelId}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٢.</span>
              <p>الزمن يُحدَّد تلقائيًا حسب صعوبة المستوى</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٣.</span>
              <p><strong>محاولة واحدة</strong> لكل سؤال</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٤.</span>
              <p>عتبة النجاح: <strong>{formatNumber(PASS_THRESHOLD, numberStyle)}٪</strong></p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">٥.</span>
              <p>بعد الفشل: انتظر <strong>٣٠ دقيقة</strong></p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 leading-relaxed">
              💡 تحدي حقيقي: لا يوجد كشف للحل. ركّز جيدًا!
            </p>
          </div>
        </motion.div>

        <button
          onClick={startTest}
          className="btn-primary w-full !py-4 !text-lg"
        >
          <Play className="w-6 h-6" />
          ابدأ الاختبار
        </button>
      </div>
    );
  }

  // ═══ Running ═══
  if (phase === 'running' && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 15;

    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-4 max-w-2xl mx-auto flex flex-col">
        {/* رأس */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <h2 className="text-base font-bold text-white">
              سؤال {formatNumber(currentIdx + 1, numberStyle)} / {formatNumber(questions.length, numberStyle)}
            </h2>
            <p className="text-[10px] text-white/50">
              {currentQ.section}-{currentQ.module} · {currentQ.operation === 'read' ? 'اقرأ' : 'مثّل'}
            </p>
          </div>
          <div className={'flex items-center gap-1.5 px-3 py-2 rounded-xl border ' + (timeWarning ? 'bg-red-500/20 border-red-500/50 animate-pulse' : 'bg-white/5 border-white/10')}>
            <Clock className={'w-4 h-4 ' + (timeWarning ? 'text-red-300' : 'text-amber-300')} />
            <span className={'font-bold font-mono text-sm ' + (timeWarning ? 'text-red-300' : 'text-white')}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* شريط تقدم */}
        <div className="mb-4">
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-400 to-amber-600"
              animate={{ width: progress + '%' }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
          </div>
        </div>

        {/* السؤال */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 sm:p-6 w-full text-center mb-4"
          >
            <p className="text-lg font-extrabold text-white mb-4">{currentQ.question}</p>

            {/* نوع: قراءة — اختيارات */}
            {currentQ.operation === 'read' && (
              <>
                <div className="flex justify-center mb-4">
                  <Soroban2D5
                    key={'read-' + currentQ.id}
                    columns={getColumns(currentQ.result)}
                    demoValue={currentQ.result}
                    interactive={false}
                    showValue={false}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {currentChoices.map((c) => (
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

            {/* نوع: بناء — سوروبان */}
            {(currentQ.operation === 'build' || currentQ.operation === 'read') && currentQ.operation === 'build' && (
              <>
                <div className="flex justify-center mb-3">
                  <Soroban2D5
                    key={'build-' + currentQ.id}
                    columns={getColumns(currentQ.result)}
                    initialValue={0}
                    autoBeadSize={true}
                    interactive={true}
                    showValue={true}
                    onValueChange={setAbacusValue}
                  />
                </div>
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
              </>
            )}
          </motion.div>
        </div>

        {/* زر الإنهاء */}
        <button
          onClick={() => { playSound('click'); setShowEndConfirm(true); }}
          className="w-full py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 font-bold text-xs transition"
        >
          إنهاء الاختبار الآن
        </button>

        {/* Modal تأكيد الإنهاء */}
        <AnimatePresence>
          {showEndConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowEndConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-amber-500/30 text-center"
              >
                <h3 className="text-xl font-extrabold text-white mb-2">إنهاء الاختبار؟</h3>
                <p className="text-sm text-white/60 mb-6">الأسئلة غير المجابة تحتسب صفرًا.</p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmEnd}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold"
                  >
                    نعم، أنهِ
                  </button>
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold"
                  >
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

  // ═══ Result ═══
  if (phase === 'result') {
    const passed = finalPassed;
    return (
      <div dir="rtl" className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 overflow-hidden relative"
        >
          <div className={'absolute -top-24 -right-24 w-64 h-64 blur-3xl ' + (passed ? 'bg-emerald-500/20' : 'bg-amber-500/20')} />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={'w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-2xl mx-auto mb-4 ' + (passed ? 'from-emerald-400 to-teal-600' : 'from-amber-400 to-orange-600')}
            >
              {passed ? <Trophy className="w-12 h-12 text-white" /> : <XCircle className="w-12 h-12 text-white" />}
            </motion.div>

            <h2 className="text-2xl font-extrabold text-white mb-2">
              {passed ? '🎉 اجتزت الاختبار!' : '💪 حاول مرة أخرى'}
            </h2>

            {passed && (
              <p className="text-lg font-bold text-emerald-300 font-display mb-4">
                بدرجة {formatNumber(finalScore, numberStyle)}٪
              </p>
            )}

            <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">النتيجة</p>
              <p className="text-5xl font-black text-white">
                {formatNumber(finalScore, numberStyle)}٪
              </p>
              <p className={'text-sm font-bold mt-2 ' + (passed ? 'text-emerald-300' : 'text-amber-300')}>
                {passed
                  ? '🎓 المستوى التالي مفتوح!'
                  : `تحتاج ${formatNumber(PASS_THRESHOLD, numberStyle)}٪ للنجاح`}
              </p>
            </div>

            {!passed && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
                <p className="text-xs text-amber-200">
                  ⏰ يمكنك إعادة الاختبار بعد ٣٠ دقيقة
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
