// src/components/Companion.tsx
import React, { useEffect, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ImageAvatar } from './avatars/ImageAvatar';

import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

import shamImg from '../assets/avatars/sham.png';
import rayanImg from '../assets/avatars/rayan.png';
import banaImg from '../assets/avatars/bana.png';
import joudImg from '../assets/avatars/joud2.png';
import type { CharacterType } from '../types';

interface CompanionProps {
  character?: CharacterType;
  xp?: number;
  /** 'fixed' = floating character (default) | 'inline' = inside a frame */
  variant?: 'fixed' | 'inline';
  /** Image size inside the frame (used with variant='inline') */
  imageClassName?: string;
}

const CHARACTER_DATA: Record<
  CharacterType,
  { name: string; nameEn: string; image: string }
> = {
  sham: { name: 'شام', nameEn: 'Sham', image: shamImg },
  rayan: { name: 'ريان', nameEn: 'Rayan', image: rayanImg },
  bana: { name: 'بانة', nameEn: 'Bana', image: banaImg },
  joud: { name: 'جود', nameEn: 'Joud', image: joudImg },
};

const MOTIVATIONAL_MESSAGES: Array<{ ar: string; en: string }> = [
  { ar: 'أنت رائع! واصل التدريب 🧮', en: "You're amazing! Keep practicing 🧮" },
  { ar: 'تركيزك يتحسن مع كل تمرين! ⚡', en: 'Your focus improves with every practice! ⚡' },
  { ar: 'ممتاز! عقلك أصبح أسرع 🚀', en: 'Excellent! Your brain is getting faster 🚀' },
  { ar: 'يا لك من بطل! إجابة ذكية جداً 💡', en: 'What a hero! Very smart answer 💡' },
  { ar: 'خطوة جديدة نحو إتقان الحساب! 🌟', en: 'A new step toward mastering calculation! 🌟' },
  { ar: 'السوروبان يساعدك على بناء عقل قوي! 💪', en: 'The soroban helps you build a strong mind! 💪' },
  { ar: 'لا تستعجل… فكّر ثم أجب بثقة! 🧠', en: "Don't rush… think, then answer with confidence! 🧠" },
];

export const Companion: React.FC<CompanionProps> = ({
  character = 'sham',
  xp = 0,
  variant = 'fixed',
  imageClassName,
}) => {
  const { lang, dir } = useT();

  const [currentMessage, setCurrentMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const data = CHARACTER_DATA[character] ?? CHARACTER_DATA.sham;

  const localizedName = pickLang({ ar: data.name, en: data.nameEn }, lang);

  const triggerAnimation = () => {
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 800);
  };

  const handleTap = () => {
    const randomIndex = Math.floor(
      Math.random() * MOTIVATIONAL_MESSAGES.length,
    );
    setCurrentMessage(pickLang(MOTIVATIONAL_MESSAGES[randomIndex], lang));
    setShowBubble(true);
    triggerAnimation();
  };

  useEffect(() => {
    if (xp <= 0) return;
    setCurrentMessage(
      pickLang(
        {
          ar: `أحسنت! حصلت على +${xp} نقطة خبرة 🎉`,
          en: `Well done! You earned +${xp} XP 🎉`,
        },
        lang,
      ),
    );
    setShowBubble(true);
    triggerAnimation();
  }, [xp, lang]);

  useEffect(() => {
    if (!showBubble) return;
    const timer = window.setTimeout(() => setShowBubble(false), 4500);
    return () => window.clearTimeout(timer);
  }, [showBubble]);

  // ═══ Inline mode (inside the violet frame) ═══
  if (variant === 'inline') {
    return (
      <div
        dir={dir}
        className="w-full h-full flex items-end justify-center select-none"
      >
        <ImageAvatar
          src={data.image}
          alt={localizedName}
          className={
            imageClassName ||
            'w-full h-full object-contain object-bottom drop-shadow-2xl'
          }
          motionType="breathe"
        />
      </div>
    );
  }

  // ═══ Floating mode (default) ═══
  return (
    <div
      dir={dir}
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end select-none"
    >
      {showBubble && (
        <div className="mb-2 max-w-[245px] sm:max-w-[300px] p-3 sm:p-4 bg-white text-slate-800 rounded-3xl rounded-br-md shadow-2xl border-2 border-violet-200 text-sm sm:text-base font-bold text-right relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2">
            <MessageCircle className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
            <span>{currentMessage}</span>
          </div>
          <div className="absolute -bottom-2 right-5 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[9px] border-t-white" />
        </div>
      )}

      <button
        type="button"
        onClick={handleTap}
        className={`relative group focus:outline-none transition-transform duration-300 active:scale-90 ${
          isAnimating ? 'animate-bounce' : 'hover:scale-110'
        }`}
        aria-label={pickLang(
          { ar: `رفيقك ${localizedName}`, en: `Your companion ${localizedName}` },
          lang,
        )}
      >
        <div className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <ImageAvatar
          src={data.image}
          alt={localizedName}
          className="w-28 h-32 sm:w-32 sm:h-36 drop-shadow-2xl"
          motionType="breathe"
        />
      </button>

      <div className="mt-0.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black shadow-lg">
        {localizedName}
      </div>
    </div>
  );
};

export default Companion;