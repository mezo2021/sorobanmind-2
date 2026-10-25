// src/screens/WelcomeScreen.tsx
import { motion } from 'framer-motion';
import { Rocket, Brain, Target, BookOpen, Trophy, BarChart3, Sparkles, Grid3X3, Languages } from 'lucide-react';
import logoImg from '@/assets/logo-header.png';
import sorobanaImg from '@/assets/sorobana/sorobana-teaching-pointing.webp';
import { useSorobanaVoice } from '@/hooks/useSorobanaVoice';
import { useSpeech } from '@/hooks/useSpeech';
import { useT } from '@/i18n/useTranslation';
import { useLangStore } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { lang, dir } = useT();
  const setLang = useLangStore((s) => s.setLang);
  const sorobana = useSorobanaVoice();
  const { speak } = useSpeech();

  const FEATURES = [
    { icon: Brain, text: pickLang({ ar: 'أنزان بصري وسماعي', en: 'Visual and Audio Anzan' }, lang) },
    { icon: Target, text: pickLang({ ar: 'تدريب تفاعلي ذكي', en: 'Smart Interactive Training' }, lang) },
    { icon: Sparkles, text: pickLang({ ar: 'تعليم تكيفي حسب مستواك', en: 'Adaptive Learning Based on Your Level' }, lang) },
    { icon: Grid3X3, text: pickLang({ ar: 'سوروبان تفاعلي حر', en: 'Free Interactive Soroban' }, lang) },
    { icon: BookOpen, text: pickLang({ ar: 'منهج ياباني أصيل', en: 'Authentic Japanese Curriculum' }, lang) },
    { icon: Trophy, text: pickLang({ ar: 'شهادة دولية فاخرة', en: 'Premium International Certificate' }, lang) },
    { icon: BarChart3, text: pickLang({ ar: 'لوحة متابعة لولي الأمر', en: 'Guardian Dashboard' }, lang) },
  ];

  const handleToggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const handleCompanionTap = () => {
    if (lang === 'ar') {
      sorobana.speakFiles([
        'https://mezo2021.github.io/sorobanmind-2/audio/welcome-sorobana.mp3',
      ]);
    } else {
      speak("Hello! I am Sorobana, your teacher. Ready to become faster than a calculator?", { lang: 'en-US' });
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative"
    >
      {/* 🆕 زر تبديل اللغة */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-50">
        <button
          type="button"
          onClick={handleToggleLang}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-white shadow-lg backdrop-blur-md"
          aria-label={pickLang({ ar: 'تبديل اللغة', en: 'Switch language' }, lang)}
        >
          <Languages className="w-4 h-4 text-white/80" />
          <span className="text-xs font-bold" dir="ltr">
            <span className={lang === 'ar' ? 'text-emerald-300' : 'text-white/40'}>AR</span>
            <span className="text-white/30"> | </span>
            <span className={lang === 'en' ? 'text-blue-300' : 'text-white/40'}>EN</span>
          </span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 mt-8"
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
        <p className="text-sm text-white/60 font-body">
          {pickLang({ ar: 'أكاديمية السوروبان الدولية', en: 'International Soroban Academy' }, lang)}
        </p>
      </motion.div>

      <div className="w-full max-w-md mb-6">
        <div className={`flex items-center gap-3 ${dir === 'ltr' ? 'flex-row-reverse' : ''}`}>
          <motion.button
            type="button"
            onClick={handleCompanionTap}
            className="shrink-0 focus:outline-none"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label={pickLang({ ar: 'سوروبانا', en: 'Sorobana' }, lang)}
          >
            <img
              src={sorobanaImg}
              alt="Sorobana"
              width={140}
              height={190}
              className="drop-shadow-2xl pointer-events-none"
              draggable={false}
            />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, x: dir === 'rtl' ? -10 : 10 }}
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
                className={`text-sm sm:text-base font-bold leading-relaxed ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                dir={dir}
                style={{ fontFamily: 'Tajawal, Cairo, "Segoe UI", sans-serif' }}
              >
                {pickLang(
                  {
                    ar: 'مرحباً! أنا سوروبانا معلمتكم.\nجاهزين نصير أسرع من الحاسبة!',
                    en: "Hello! I am Sorobana, your teacher.\nReady to become faster than a calculator!"
                  },
                  lang
                ).split('\n').map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx === 0 && <br />}
                  </span>
                ))}
              </p>
              <div
                className="absolute"
                style={{
                  top: '50%',
                  ...(dir === 'rtl' 
                    ? { right: '-9px', borderRight: '2px solid #DAA520', borderTop: '2px solid #DAA520' }
                    : { left: '-9px', borderLeft: '2px solid #DAA520', borderBottom: '2px solid #DAA520' }
                  ),
                  width: '14px',
                  height: '14px',
                  background: '#F5EBD0',
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
          {pickLang({ ar: '✨ ماذا سنفعل معاً؟', en: '✨ What will we do together?' }, lang)}
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
        transition={{ delay: 1.1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="btn-primary w-full max-w-md !py-4 !text-lg"
      >
        <Rocket className={`w-6 h-6 ${dir === 'rtl' ? 'ml-2' : 'mr-2'}`} />
        {pickLang({ ar: 'ابدأ الرحلة', en: 'Start the Journey' }, lang)}
      </motion.button>
    </div>
  );
}

export default WelcomeScreen;