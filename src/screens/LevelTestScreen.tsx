// src/screens/LevelTestScreen.tsx
// اختبار نهاية المستوى — من بنك SRB (phase: X)
// [SURGICAL FIX] — نسبة النجاح 80%، إلغاء الأزرار (المعداد فقط)، شرط النجاح لفتح المستوى التالي، عقوبة 30 دقيقة عند الفشل فقط.
// [LOGIC FIX] — تحديد أعمدة المعداد بناءً على أكبر رقم في السؤال (وليس النتيجة فقط) لدعم الاستلاف.
// [TIME FIX] — حساب الوقت الفعلي للأسئلة × 1.5، ثم التقريب لأعلى دقيقة.

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Clock, CheckCircle2, XCircle, Trophy, Play, RotateCcw } from 'lucide-react';

import { Soroban2D5 } from '@/components/soroban2d5/Soroban2D5';
import { useNumberStyleStore } from '@/store/numberStyleStore';
import { useProgressStore } from '@/store/progressStore';
import { formatNumber } from '@/utils/numberStyle';
import {
  buildSession,
  saveSectionGrade,
  type SRBQuestion,
  type SRBLevel,
  type SRBSection,
} from '@/data/srb-adapter';

// 🌍 i18n
import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';
import { translateDynamic } from '@/utils/translateDynamic';

// ═══════════════════════════════════════════════════════════
// ثوابت
// ═══════════════════════════════════════════════════════════

const PASS_THRESHOLD = 80;                       // نسبة النجاح
const COOLDOWN_MS = 30 * 60 * 1000;              // 30 دقيقة
const QUESTION_COUNT = 10;
const LAST_ATTEMPT_KEY = (levelId: string) =>
  `soroban_level_test_last_attempt_${levelId}`;

// ═══════════════════════════════════════════════════════════
// أدوات
// ═══════════════════════════════════════════════════════════

// ✅ حساب الأعمدة بناءً على أكبر رقم في المسألة (النتيجة أو الأرقام الداخلة)
function getColumnsForQuestion(q: SRBQuestion): number {
  const candidates = [Math.abs(q.result), ...q.operands.map((op) => Math.abs(op))];
  const maxAbs = Math.max(...candidates);
  
  if (maxAbs < 10) return 1;           // آحاد
  if (maxAbs < 100) return 2;          // عشرات
  if (maxAbs < 1000) return 3;         // مئات
  if (maxAbs < 10000) return 4;        // آلاف
  return 6;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function formatTimeLeft(ms: number, lang: string): string {
  const totalSec = Math.ceil(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  
  if (mins < 1) {
    return pickLang({ ar: `${secs} ثانية`, en: `${secs} second(s)` }, lang as any);
  }
  return pickLang({ ar: `${mins} دقيقة و ${secs} ثانية`, en: `${mins} minute(s) and ${secs} second(s)` }, lang as any);
}

// ✅ دالة الوقت الجديدة: مجموع الوقت الفعلي للأسئلة × 1.5، مقرباً لأقرب دقيقة
function computeTotalTime(questions: SRBQuestion[]): number {
  // نأخذ الوقت الفعلي لكل سؤال (الحد الأدنى target_time_ms[0])
  const exactSumMs = questions.reduce((sum, q) => sum + q.target_time_ms[0], 0);
  
  // نضرب في 1.5
  const totalSeconds = (exactSumMs * 1.5) / 1000;
  
  // نقرب لأعلى دقيقة (60 ثانية)
  const totalMinutes = Math.ceil(totalSeconds / 60);
  
  return totalMinutes * 60;
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
  const { lang, dir } = useT();
  const { style: numberStyle } = useNumberStyleStore();
  
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
    const result = buildSession({
      level: levelId as SRBLevel,
      phase: 'X',
      count: QUESTION_COUNT,
      seed: Date.now(),
    });
    const qs = result.questions;
    if (qs.length === 0) {
      playSound('error');
      return;
    }
    const total = computeTotalTime(qs);

    setQuestions(qs);
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
      const store = useProgressStore.getState();
      
      // حفظ الدرجة دائماً في المتجر
      store.setGrade(levelId, 'levelTest', score);

      if (passed) {
        // ✅ حالة النجاح: فتح المستوى التالي، وعدم حفظ وقت الانتظار (حتى لا يُعاقب)
        store.markLevelComplete(levelId as any);
      } else {
        // ❌ حالة الفشل: حفظ وقت المحاولة لتبدأ عقوبة الـ 30 دقيقة
        localStorage.setItem(LAST_ATTEMPT_KEY(levelId), String(Date.now()));
      }

      // حفظ الدرجة في SRB (لأغراض التغذية الراجعة) - لا يؤثر على المنطق الأساسي
      const firstSection = (questions[0]?.section ?? 'S01') as SRBSection;
      saveSectionGrade(levelId as SRBLevel, firstSection, 'test', score, []);
      
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

  const handleCheckBuild = useCallback(() => {
    submitAnswer(abacusValue);
  }, [abacusValue, submitAnswer]);

  const confirmEnd = useCallback(() => {
    setShowEndConfirm(false);
    finalizeTest(answers);
  }, [answers, finalizeTest]);

  // ═══ Cooldown ═══
  if (phase === 'cooldown') {
    return (
      <div dir={dir} className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          <h2 className="text-xl font-extrabold text-white">
            {pickLang({ ar: 'اختبار', en: 'Test' }, lang)} {levelId}
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 border-2 border-amber-400/40"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
            <Clock className="w-10 h-10 text-amber-300" />
          </div>
          <h3 className="text-xl font-extrabold text-white text-center mb-3">
            {pickLang({ ar: 'انتظر قليلًا', en: 'Please wait a moment' }, lang)}
          </h3>
          <p className="text-sm text-white/70 text-center leading-relaxed mb-4">
            {pickLang({ ar: 'يمكنك إعادة الاختبار بعد ٣٠ دقيقة من المحاولة الأخيرة.', en: 'You can retake the test after 30 minutes from the last attempt.' }, lang)}
          </p>
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-center">
            <p className="text-xs text-amber-200 mb-1">
              {pickLang({ ar: 'الوقت المتبقي', en: 'Time remaining' }, lang)}
            </p>
            <p className="text-2xl font-black text-amber-100">
              {formatTimeLeft(cooldownMs, lang)}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ═══ Intro ═══
  if (phase === 'intro') {
    return (
      <div dir={dir} className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { playSound('click'); onBack(); }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
          >
            <Home className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold text-white">
              {pickLang({ ar: 'اختبار', en: 'Test' }, lang)} {levelId}
            </h2>
            <p className="text-sm text-white/50">
              {pickLang({ ar: 'تحدي نهاية المستوى', en: 'Level Final Challenge' }, lang)}
            </p>
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
          <h3 className="text-xl font-extrabold text-white text-center mb-4">
            {pickLang({ ar: 'تحدي نهاية المستوى', en: 'Level Final Challenge' }, lang)}
          </h3>
          <div className="space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(1, numberStyle)}.</span>
              <p>
                {pickLang({
                  ar: `١٠ أسئلة من بنك ${levelId}`,
                  en: `10 questions from ${levelId} bank`
                }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(2, numberStyle)}.</span>
              <p>{pickLang({ ar: 'الزمن محسوب بناءً على صعوبة الأسئلة', en: 'Time is calculated based on question difficulty' }, lang)}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(3, numberStyle)}.</span>
              <p>{pickLang({ ar: 'محاولة واحدة لكل سؤال', en: 'One attempt per question' }, lang)}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(4, numberStyle)}.</span>
              <p>
                {pickLang({
                  ar: `عتبة النجاح: ${formatNumber(PASS_THRESHOLD, numberStyle)}٪`,
                  en: `Passing threshold: ${formatNumber(PASS_THRESHOLD, numberStyle)}%`
                }, lang)}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-gold-300 font-bold shrink-0">{formatNumber(5, numberStyle)}.</span>
              <p>{pickLang({ ar: 'بعد الفشل: انتظر ٣٠ دقيقة', en: 'After failing: wait 30 minutes' }, lang)}</p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30">
            <p className="text-xs text-amber-200 leading-relaxed">
              {pickLang({ ar: '💡 تحدي حقيقي: لا يوجد كشف للحل. ركّز جيدًا!', en: '💡 Real challenge: no solution reveal. Focus well!' }, lang)}
            </p>
          </div>
        </motion.div>

        <button
          onClick={startTest}
          className="btn-primary w-full !py-4 !text-lg"
        >
          <Play className="w-6 h-6" />
          {pickLang({ ar: 'ابدأ الاختبار', en: 'Start Test' }, lang)}
        </button>
      </div>
    );
  }

  // ═══ Running ═══
  if (phase === 'running' && currentQ) {
    const progress = ((currentIdx + 1) / questions.length) * 100;
    const timeWarning = timeLeft <= 15;

    return (
      <div dir={dir} className="min-h-screen px-3 sm:px-6 py-4 max-w-2xl mx-auto flex flex-col">
        {/* رأس */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <h2 className="text-base font-bold text-white">
              {pickLang({
                ar: `سؤال ${formatNumber(currentIdx + 1, numberStyle)} / ${formatNumber(questions.length, numberStyle)}`,
                en: `Question ${formatNumber(currentIdx + 1, numberStyle)} / ${formatNumber(questions.length, numberStyle)}`
              }, lang)}
            </h2>
            <p className="text-[10px] text-white/50">
              {translateDynamic({ text: currentQ.section }, lang, 'text')}-{translateDynamic({ text: currentQ.module }, lang, 'text')} · {pickLang({ ar: 'مثّل الإجابة', en: 'Represent the answer' }, lang)}
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

            {/* ✅ واجهة الإجابة الوحيدة: المعداد التفاعلي لجميع الأسئلة */}
            <div className="flex justify-center mb-3" dir={dir}>
              <Soroban2D5
                key={'build-' + currentQ.id}
                columns={getColumnsForQuestion(currentQ)}
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
                <CheckCircle2 className="w-4 h-4" /> {pickLang({ ar: 'تحقق', en: 'Check' }, lang)}
              </button>
              <button
                onClick={() => { playSound('click'); setAbacusValue(0); }}
                className="btn-ghost !py-2.5 !px-4 !text-sm"
              >
                <RotateCcw className="w-4 h-4" /> {pickLang({ ar: 'مسح', en: 'Clear' }, lang)}
              </button>
            </div>
          </motion.div>
        </div>

        {/* زر الإنهاء */}
        <button
          onClick={() => { playSound('click'); setShowEndConfirm(true); }}
          className="w-full py-2.5 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-400/40 text-red-200 font-bold text-xs transition"
        >
          {pickLang({ ar: 'إنهاء الاختبار الآن', en: 'End Test Now' }, lang)}
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
                dir={dir}
              >
                <h3 className="text-xl font-extrabold text-white mb-2">
                  {pickLang({ ar: 'إنهاء الاختبار؟', en: 'End Test?' }, lang)}
                </h3>
                <p className="text-sm text-white/60 mb-6">
                  {pickLang({ ar: 'الأسئلة غير المجابة تحتسب صفرًا.', en: 'Unanswered questions count as zero.' }, lang)}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={confirmEnd}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold"
                  >
                    {pickLang({ ar: 'نعم، أنهِ', en: 'Yes, end it' }, lang)}
                  </button>
                  <button
                    onClick={() => setShowEndConfirm(false)}
                    className="flex-1 py-3 rounded-2xl bg-white/10 text-white font-bold"
                  >
                    {pickLang({ ar: 'متابعة', en: 'Continue' }, lang)}
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
      <div dir={dir} className="min-h-screen px-3 sm:px-6 py-6 max-w-2xl mx-auto">
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
              {passed
                ? pickLang({ ar: '🎉 اجتزت الاختبار!', en: '🎉 You passed the test!' }, lang)
                : pickLang({ ar: '💪 حاول مرة أخرى', en: '💪 Try again' }, lang)}
            </h2>

            {passed && (
              <p className="text-lg font-bold text-emerald-300 font-display mb-4">
                {pickLang({
                  ar: `بدرجة ${formatNumber(finalScore, numberStyle)}٪`,
                  en: `With a score of ${formatNumber(finalScore, numberStyle)}%`
                }, lang)}
              </p>
            )}

            <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/60 mb-1">
                {pickLang({ ar: 'النتيجة', en: 'Score' }, lang)}
              </p>
              <p className="text-5xl font-black text-white">
                {formatNumber(finalScore, numberStyle)}%
              </p>
              <p className={'text-sm font-bold mt-2 ' + (passed ? 'text-emerald-300' : 'text-amber-300')}>
                {passed
                  ? pickLang({ ar: '🎓 المستوى التالي مفتوح!', en: '🎓 Next level unlocked!' }, lang)
                  : pickLang({
                      ar: `تحتاج ${formatNumber(PASS_THRESHOLD, numberStyle)}٪ للنجاح`,
                      en: `You need ${formatNumber(PASS_THRESHOLD, numberStyle)}% to pass`
                    }, lang)}
              </p>
            </div>

            {!passed && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30">
                <p className="text-xs text-amber-200">
                  {pickLang({ ar: '⏰ يمكنك إعادة الاختبار بعد ٣٠ دقيقة', en: '⏰ You can retake the test after 30 minutes' }, lang)}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <button
          onClick={() => { playSound('click'); if (passed) onPass(); else onBack(); }}
          className="btn-primary w-full !py-4 !text-lg"
        >
          {passed
            ? pickLang({ ar: '🎓 تابع الرحلة', en: '🎓 Continue the journey' }, lang)
            : pickLang({ ar: 'العودة', en: 'Back' }, lang)}
        </button>
      </div>
    );
  }

  return null;
}

export default LevelTestScreen;