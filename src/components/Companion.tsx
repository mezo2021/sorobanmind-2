// src/components/Companion.tsx
import React, { useEffect, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { ImageAvatar } from './avatars/ImageAvatar';
import shamImg from '../assets/avatars/sham.png';
import rayanImg from '../assets/avatars/rayan.png';
import banaImg from '../assets/avatars/bana.png';
import joudImg from '../assets/avatars/joud2.png';
import type { CharacterType } from '../types';

interface CompanionProps {
  character?: CharacterType;
  xp?: number;
  /** 'fixed' = الشخصية العائمة (افتراضي) | 'inline' = داخل إطار */
  variant?: 'fixed' | 'inline';
  /** حجم الصورة داخل الإطار (يستخدم مع variant='inline') */
  imageClassName?: string;
}

const CHARACTER_DATA: Record<
  CharacterType,
  { name: string; image: string }
> = {
  sham: { name: 'شام', image: shamImg },
  rayan: { name: 'ريان', image: rayanImg },
  bana: { name: 'بانة', image: banaImg },
  joud: { name: 'جود', image: joudImg },
};

const MOTIVATIONAL_MESSAGES = [
  'أنت رائع! واصل التدريب 🧮',
  'تركيزك يتحسن مع كل تمرين! ⚡',
  'ممتاز! عقلك أصبح أسرع 🚀',
  'يا لك من بطل! إجابة ذكية جداً 💡',
  'خطوة جديدة نحو إتقان الحساب! 🌟',
  'السوروبان يساعدك على بناء عقل قوي! 💪',
  'لا تستعجل… فكّر ثم أجب بثقة! 🧠',
];

export const Companion: React.FC<CompanionProps> = ({
  character = 'sham',
  xp = 0,
  variant = 'fixed',
  imageClassName,
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const data = CHARACTER_DATA[character] ?? CHARACTER_DATA.sham;

  const triggerAnimation = () => {
    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), 800);
  };

  const handleTap = () => {
    const randomIndex = Math.floor(
      Math.random() * MOTIVATIONAL_MESSAGES.length,
    );
    setCurrentMessage(MOTIVATIONAL_MESSAGES[randomIndex]);
    setShowBubble(true);
    triggerAnimation();
  };

  useEffect(() => {
    if (xp <= 0) return;
    setCurrentMessage(`أحسنت! حصلت على +${xp} نقطة خبرة 🎉`);
    setShowBubble(true);
    triggerAnimation();
  }, [xp]);

  useEffect(() => {
    if (!showBubble) return;
    const timer = window.setTimeout(() => setShowBubble(false), 4500);
    return () => window.clearTimeout(timer);
  }, [showBubble]);

  // ═══ الوضع المدمج (داخل الإطار البنفسجي) ═══
  if (variant === 'inline') {
    return (
      <div
        dir="rtl"
        className="w-full h-full flex items-end justify-center select-none"
      >
        <ImageAvatar
          src={data.image}
          alt={data.name}
          className={
            imageClassName ||
            'w-full h-full object-contain object-bottom drop-shadow-2xl'
          }
          motionType="breathe"
        />
      </div>
    );
  }

  // ═══ الوضع العائم (الافتراضي) ═══
  return (
    <div
      dir="rtl"
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
        aria-label={`رفيقك ${data.name}`}
      >
        <div className="absolute -top-2 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <ImageAvatar
          src={data.image}
          alt={data.name}
          className="w-28 h-32 sm:w-32 sm:h-36 drop-shadow-2xl"
          motionType="breathe"
        />
      </button>

      <div className="mt-0.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-white text-[10px] font-black shadow-lg">
        {data.name}
      </div>
    </div>
  );
};

export default Companion;