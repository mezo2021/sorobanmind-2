// src/screens/WelcomeScreen.tsx
import { motion } from 'framer-motion';
import { Rocket, Brain, Target, BookOpen, Trophy, BarChart3 } from 'lucide-react';
import logoImg from '@/assets/logo-header.png';
import sorobanaImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';

const FEATURES = [
  { icon: Brain, text: 'أنزان بصري وسماعي' },
  { icon: Target, text: 'تدريب تفاعلي ذكي' },
  { icon: BookOpen, text: 'منهج ياباني أصيل' },
  { icon: Trophy, text: 'شهادة دولية فاخرة' },
  { icon: BarChart3, text: 'لوحة متابعة لولي الأمر' },
];

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const sorobana = useSorobanaVoice();

  const handleCompanionTap = () => {
    sorobana.speakFiles([
      'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
    ]);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <img
          src={logoImg}
          alt="SorobanMind"
          width={90}
          height={90}
          className="mx-auto mb-3 drop-shadow-2xl"
        />
        <h1 className="text-3xl sm:text-4xl font-black font-display shimmer-text mb-1">
          SorobanMind
        </h1>
        <p className="text-sm text-white/60 font-body">أكاديمية السوروبان الدولية</p>
      </motion.div>

      <div className="w-full max-w-md mb-6">
        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            onClick={handleCompanionTap}
            className="shrink-0 focus:outline-none"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="سوروبانا"
          >
            <img
              src={sorobanaImg}
              alt="سوروبانا"
              width={140}
              height={190}
              className="drop-shadow-2xl pointer-events-none"
              draggable={false}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 relative"
          >
            <div
              className="relative px-4 py-3 rounded-2xl shadow-2xl border-2"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F5EBD0 100%)',
                borderColor: '#DAA520',
                color: '#5D3A1A',
              }}
            >
              <p
                className="text-sm sm:text-base font-bold leading-relaxed text-right"
                dir="rtl"
                style={{ fontFamily: 'Tajawal, Cairo, "Segoe UI", sans-serif' }}
              >
                مرحباً! أنا سوروبانا معلمتكم.
                <br />
                جاهزين نصير أسرع من الحاسبة!
              </p>
              <div
                className="absolute"
                style={{
                  top: '50%',
                  right: '-9px',
                  width: '14px',
                  height: '14px',
                  background: '#F5EBD0',
                  borderRight: '2px solid #DAA520',
                  borderTop: '2px solid #DAA520',
                  transform: 'translateY(-50%) rotate(45deg)',
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5 w-full max-w-md mb-6"
      >
        <p className="text-sm font-bold text-gold-300 mb-3 text-center">
          ✨ ماذا سنفعل معاً؟
        </p>
        <div className="space-y-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <Icon className="w-5 h-5 text-gold-400 shrink-0" />
                <span className="text-sm text-white/85 font-body">{f.text}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="btn-primary w-full max-w-md !py-4 !text-lg"
      >
        <Rocket className="w-6 h-6" />
        ابدأ الرحلة
      </motion.button>
    </div>
  );
}

export default WelcomeScreen;