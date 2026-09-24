// src/screens/LevelScreen.tsx

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  Hand,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Lightbulb,
  BookOpen,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { useT } from "../i18n/useTranslation";
import { useProgressStore } from "../store/progressStore";
import { getLevelContent } from "../curriculum/levels";
import { Soroban2D5 } from "../components/soroban2d5/Soroban2D5";
import { useSpeech } from "../hooks/useSpeech";
import type { LevelContent, LessonExample } from "../curriculum/levels/types";

type LessonMode = "watch" | "try";

interface Props {
  levelId: string;
  onBack: () => void;
  onComplete?: () => void;
}

export default function LevelScreen({ levelId, onBack, onComplete }: Props) {
  const { t, dir } = useT();
  const content = getLevelContent(levelId);

  const [mode, setMode] = useState<LessonMode>("watch");
  const [exampleIdx, setExampleIdx] = useState(0);
  const [solvedExamples, setSolvedExamples] = useState<number[]>([]);
  const [abacusValue, setAbacusValue] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">(
    "idle",
  );
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const completeEnrichment = useProgressStore((s) => s.completeEnrichment);
  const addXP = useProgressStore((s) => s.addXP);
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  // ═══════════════════════════════════════════════
  // إيقاف الصوت عند الخروج
  // ═══════════════════════════════════════════════
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // ═══════════════════════════════════════════════
  // إعادة تعيين عند تغيير المثال
  // ═══════════════════════════════════════════════
  useEffect(() => {
    setAbacusValue(0);
    setFeedback("idle");
    setAttempts(0);
    setShowAnswer(false);
  }, [exampleIdx]);

  if (!content) {
    return (
      <div
        dir={dir}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">
            المستوى غير موجود: {levelId}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold"
          >
            {t("app.back")}
          </button>
        </div>
      </div>
    );
  }

  const currentEx: LessonExample | undefined = content.examples[exampleIdx];
  const isSolved = solvedExamples.includes(exampleIdx);
  const allSolved = solvedExamples.length === content.examples.length;

  // ═══════════════════════════════════════════════
  // معالجات
  // ═══════════════════════════════════════════════
  const handlePlayAudio = () => {
    if (isReading) {
      stop();
      setIsReading(false);
      return;
    }
    setIsReading(true);
    speak(content.audioTextAr, {
      onEnd: () => setIsReading(false),
    });
  };

  const handleCheck = () => {
    if (!currentEx || feedback !== "idle") return;

    if (abacusValue === currentEx.answer) {
      setFeedback("correct");
      if (!solvedExamples.includes(exampleIdx)) {
        setSolvedExamples([...solvedExamples, exampleIdx]);
      }
      setTimeout(() => {
        if (exampleIdx + 1 < content.examples.length) {
          setExampleIdx(exampleIdx + 1);
          setFeedback("idle");
        }
      }, 1200);
    } else {
      setFeedback("wrong");
      setAttempts(attempts + 1);
      setTimeout(() => setFeedback("idle"), 800);
    }
  };

  const handleNext = () => {
    if (exampleIdx + 1 < content.examples.length) {
      setExampleIdx(exampleIdx + 1);
    }
  };

  const handlePrev = () => {
    if (exampleIdx > 0) {
      setExampleIdx(exampleIdx - 1);
    }
  };

  const handleComplete = () => {
    if (!allSolved) return;
    completeEnrichment(levelId);
    addXP(30);
    setLessonCompleted(true);
    if (onComplete) onComplete();
  };

  // ═══════════════════════════════════════════════
  // تحديد عدد الأعمدة
  // ═══════════════════════════════════════════════
  const getColumnsForValue = (value: number): number => {
    if (value < 10) return 1;
    if (value < 100) return 2;
    if (value < 1000) return 3;
    if (value < 10000) return 4;
    return 5;
  };

  const columns = currentEx
    ? Math.max(2, getColumnsForValue(currentEx.answer))
    : 2;

  // ═══════════════════════════════════════════════
  // الرسم
  // ═══════════════════════════════════════════════
  return (
    <div dir={dir} className="min-h-screen p-4 pb-24">
      <div className="max-w-2xl mx-auto">
        {/* ═══ Header ═══ */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300">
                {content.id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-400 truncate">
              {t(
                `level.${String(content.number).padStart(2, "0")}.title` as Parameters<typeof t>[0],
              )}
            </h1>
          </div>

          {isSupported && (
            <button
              onClick={handlePlayAudio}
              className={`p-2 rounded-full transition shrink-0 ${
                isReading
                  ? "bg-emerald-500/30 border border-emerald-400/50"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {isReading ? (
                <VolumeX className="w-5 h-5 text-emerald-300" />
              ) : (
                <Volume2 className="w-5 h-5 text-white/70" />
              )}
            </button>
          )}
        </div>

        {/* ═══ القاعدة ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-amber-600/10 border border-amber-400/30"
        >
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-300 mb-1">
                {t("learn.rule")}:
              </p>
              <p className="text-sm text-white/90 leading-relaxed">
                {content.ruleAr}
              </p>
            </div>
          </div>

          {content.ruleTable && content.ruleTable.length > 0 && (
            <div className="mt-3 pt-3 border-t border-amber-400/20">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {content.ruleTable.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white/5"
                  >
                    <span className="text-xs font-bold text-amber-300">
                      {row.formula}
                    </span>
                    <span className="text-[10px] text-white/40">=</span>
                    <span className="text-xs font-bold text-emerald-300">
                      {row.result}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ═══ القصة ═══ */}
        {content.storyAr && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-400/30"
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-pink-300 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-pink-300 mb-1">
                  {t("learn.story")}:
                </p>
                <p className="text-sm text-white/80 leading-relaxed">
                  {content.storyAr}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ اختيار الوضع ═══ */}
        <div className="flex gap-2 mb-4 p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => {
              setMode("watch");
              stop();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              mode === "watch"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Eye className="w-4 h-4" />
            {t("learn.watch")}
          </button>
          <button
            onClick={() => {
              setMode("try");
              stop();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
              mode === "try"
                ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <Hand className="w-4 h-4" />
            {t("learn.try")}
          </button>
        </div>

        {/* ═══ المثال الحالي ═══ */}
        {currentEx && (
          <>
            {/* رقم المثال + النقاط */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/50">
                {t("learn.example", {
                  n: exampleIdx + 1,
                  total: content.examples.length,
                })}
              </p>
              <div className="flex gap-1">
                {content.examples.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      solvedExamples.includes(i)
                        ? "bg-emerald-400"
                        : i === exampleIdx
                          ? "bg-amber-400 w-4"
                          : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* نص المسألة */}
            <motion.div
              key={exampleIdx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-5 rounded-3xl bg-white/5 border border-white/10 text-center"
            >
              <p className="text-2xl sm:text-3xl font-black text-white">
                {currentEx.problemText}
              </p>
            </motion.div>

            {/* ═══ السوروبان ═══ */}
            <div className="mb-4 flex justify-center">
              <Soroban2D5
                key={`${exampleIdx}-${mode}`}
                columns={columns}
                autoBeadSize
                interactive={mode === "try" && feedback === "idle" && !isSolved}
                showValue
                demoValue={
                  mode === "watch" ? currentEx.answer : undefined
                }
                onValueChange={setAbacusValue}
              />
            </div>

            {/* ═══ القيمة الحالية ═══ */}
            {mode === "try" && (
              <div className="text-center mb-4">
                <span className="text-sm text-white/50">
                  {t("practice.currentValue")}:{" "}
                </span>
                <span className="text-2xl font-bold text-amber-300">
                  {abacusValue}
                </span>
              </div>
            )}

            {/* ═══ أزرار التحكم ═══ */}
            {mode === "try" && !isSolved && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAbacusValue(0)}
                  disabled={feedback !== "idle"}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-bold flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("learn.clear")}
                </button>
                <button
                  onClick={handleCheck}
                  disabled={feedback !== "idle"}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-l from-purple-600 to-amber-500 font-bold flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {t("learn.check")}
                </button>
              </div>
            )}

            {/* ═══ ردّ الفعل ═══ */}
            <AnimatePresence>
              {feedback === "correct" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="font-bold text-emerald-300">
                    {t("learn.wellDone")}
                  </p>
                </motion.div>
              )}

              {feedback === "wrong" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4 p-4 rounded-2xl bg-red-500/20 border border-red-500 text-center"
                >
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <p className="font-bold text-red-300">
                    {t("learn.tryAgain", {
                      n: attempts,
                      total: 3,
                    })}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ═══ الإجابة (بعد ٣ محاولات) ═══ */}
            {attempts >= 3 && !isSolved && !showAnswer && mode === "try" && (
              <button
                onClick={() => setShowAnswer(true)}
                className="w-full mb-4 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {t("learn.showAnswer")}
              </button>
            )}

            {showAnswer && (
              <div className="mb-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40">
                <p className="text-center text-sm font-bold text-amber-300 mb-2">
                  {t("learn.correctAnswer", { answer: currentEx.answer })}
                </p>
                <p className="text-center text-xs text-white/70 leading-relaxed">
                  {currentEx.explanationAr}
                </p>
                <button
                  onClick={() => {
                    setSolvedExamples([...solvedExamples, exampleIdx]);
                    setShowAnswer(false);
                  }}
                  className="w-full mt-3 py-2 rounded-xl bg-purple-600 text-white font-bold text-sm"
                >
                  {t("app.continue")}
                </button>
              </div>
            )}

            {/* ═══ التنقل ═══ */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handlePrev}
                disabled={exampleIdx === 0}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
                {t("app.previous")}
              </button>
              <button
                onClick={handleNext}
                disabled={exampleIdx === content.examples.length - 1}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-30"
              >
                {t("app.next")}
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ═══ زر الإكمال ═══ */}
        {!lessonCompleted ? (
          <button
            onClick={handleComplete}
            disabled={!allSolved}
            className="w-full py-4 rounded-2xl bg-gradient-to-l from-purple-600 to-amber-500 font-black text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Trophy className="w-6 h-6" />
            {allSolved
              ? `${t("app.finish")} +30 XP`
              : t("learn.moreExamples", {
                  n: content.examples.length - solvedExamples.length,
                })}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-400/40 text-center"
          >
            <Trophy className="w-16 h-16 text-amber-300 mx-auto mb-3" />
            <h2 className="text-xl font-black text-amber-300 mb-2">
              🎉 {t("curriculum.completed")}
            </h2>
            <p className="text-sm text-white/70 mb-4">
              +30 XP
            </p>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold"
            >
              {t("learn.backToLessons")}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}