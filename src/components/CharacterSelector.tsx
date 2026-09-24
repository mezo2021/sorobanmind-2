// src/components/CharacterSelector.tsx
import React, { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { ImageAvatar } from './avatars/ImageAvatar';
import shamImg from '../assets/avatars/sham.png';
import rayanImg from '../assets/avatars/rayan.png';
import banaImg from '../assets/avatars/bana.png';
import joudImg from '../assets/avatars/joud2.png';
import {
  CharacterType,
  CharacterInfo,
  CHARACTER_STORAGE_KEY,
  VALID_CHARACTERS,
  LEGACY_CHARACTER_MAP,
} from '../types';

interface CharacterOption extends CharacterInfo {
  image: string;
  motionType: 'float' | 'breathe' | 'sway';
}

const CHARACTERS: CharacterOption[] = [
  {
    id: 'sham',
    name: 'شام',
    title: 'البطلة الذكية',
    description: 'تحب التعلّم واكتشاف طرق الحساب الجديدة.',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-500',
    accentColor: 'text-violet-700',
    image: shamImg,
    motionType: 'float',
  },
  {
    id: 'rayan',
    name: 'ريان',
    title: 'البطل السريع',
    description: 'يحب التحديات ويتميز بسرعة التركيز.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    accentColor: 'text-blue-700',
    image: rayanImg,
    motionType: 'breathe',
  },
  {
    id: 'bana',
    name: 'بانة',
    title: 'البطلة الهادئة',
    description: 'تتقدم بخطوات ثابتة وتركيز رائع.',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-500',
    accentColor: 'text-teal-700',
    image: banaImg,
    motionType: 'sway',
  },
  {
    id: 'joud',
    name: 'جود',
    title: 'البطل الذكي',
    description: 'يحب التفكير والتحليل ويتميز بحل المسائل.',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-500',
    accentColor: 'text-indigo-700',
    image: joudImg,
    motionType: 'float',
  },
];

interface CharacterSelectorProps {
  onSelectCharacter?: (character: CharacterType) => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  onSelectCharacter,
}) => {
  const [selected, setSelected] = useState<CharacterType>('sham');

  useEffect(() => {
    const saved = localStorage.getItem(CHARACTER_STORAGE_KEY);

    if (!saved) {
      setSelected('sham');
      return;
    }

    if ((VALID_CHARACTERS as string[]).includes(saved)) {
      setSelected(saved as CharacterType);
      return;
    }

    const migrated = LEGACY_CHARACTER_MAP[saved];
    if (migrated) {
      setSelected(migrated);
      localStorage.setItem(CHARACTER_STORAGE_KEY, migrated);
      return;
    }

    setSelected('sham');
    localStorage.setItem(CHARACTER_STORAGE_KEY, 'sham');
  }, []);

  const handleSelect = (characterId: CharacterType) => {
    setSelected(characterId);
    localStorage.setItem(CHARACTER_STORAGE_KEY, characterId);
    onSelectCharacter?.(characterId);
  };

  return (
    <div dir="rtl" className="w-full max-w-4xl mx-auto p-2 sm:p-4 select-none">
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-xs font-black mb-3">
          <Sparkles className="w-4 h-4" />
          أبطال SorobanMind
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
          اختر بطلك المرافق 🌟
        </h2>

        <p className="text-slate-600 text-sm sm:text-base font-semibold">
          سيشاركك بطلُك رحلة تعلّم السوروبان والحساب الذهني
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {CHARACTERS.map((char) => {
          const isSelected = selected === char.id;

          return (
            <button
              key={char.id}
              type="button"
              onClick={() => handleSelect(char.id)}
              aria-pressed={isSelected}
              aria-label={`اختر ${char.name} - ${char.title}`}
              className={`group relative flex flex-col items-center p-4 sm:p-5 rounded-[2rem] transition-all duration-300 border-4 outline-none ${
                char.bgColor
              } ${
                isSelected
                  ? `${char.borderColor} scale-[1.03] shadow-2xl ring-4 ring-amber-300/50`
                  : 'border-transparent hover:border-white hover:scale-[1.02] opacity-85 hover:opacity-100 shadow-lg'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg z-10">
                  <Check className="w-5 h-5" strokeWidth={3} />
                </div>
              )}

              <div className="mb-3 transition-transform duration-300 group-hover:-translate-y-2">
                <ImageAvatar
                  src={char.image}
                  alt={char.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl"
                  motionType={char.motionType}
                />
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-1">
                {char.name}
              </h3>

              <span className={`text-sm font-black ${char.accentColor}`}>
                {char.title}
              </span>

              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 font-semibold text-center">
                {char.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelector;