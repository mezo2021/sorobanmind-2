// src/components/CharacterSelector.tsx
import React, { useEffect, useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { ImageAvatar } from './avatars/ImageAvatar';

import { useT } from '@/i18n/useTranslation';
import { pickLang } from '@/i18n/pickLang';

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
  nameEn: string;
  titleEn: string;
  descriptionEn: string;
}

const CHARACTERS: CharacterOption[] = [
  {
    id: 'sham',
    name: 'شام',
    nameEn: 'Sham',
    title: 'البطلة الذكية',
    titleEn: 'The Smart Heroine',
    description: 'تحب التعلّم واكتشاف طرق الحساب الجديدة.',
    descriptionEn: 'Loves learning and discovering new calculation methods.',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-500',
    accentColor: 'text-violet-700',
    image: shamImg,
    motionType: 'float',
  },
  {
    id: 'rayan',
    name: 'ريان',
    nameEn: 'Rayan',
    title: 'البطل السريع',
    titleEn: 'The Fast Hero',
    description: 'يحب التحديات ويتميز بسرعة التركيز.',
    descriptionEn: 'Loves challenges and stands out for quick focus.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    accentColor: 'text-blue-700',
    image: rayanImg,
    motionType: 'breathe',
  },
  {
    id: 'bana',
    name: 'بانة',
    nameEn: 'Bana',
    title: 'البطلة الهادئة',
    titleEn: 'The Calm Heroine',
    description: 'تتقدم بخطوات ثابتة وتركيز رائع.',
    descriptionEn: 'Progresses with steady steps and amazing focus.',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-500',
    accentColor: 'text-teal-700',
    image: banaImg,
    motionType: 'sway',
  },
  {
    id: 'joud',
    name: 'جود',
    nameEn: 'Joud',
    title: 'البطل الذكي',
    titleEn: 'The Smart Hero',
    description: 'يحب التفكير والتحليل ويتميز بحل المسائل.',
    descriptionEn: 'Loves thinking and analysis, and excels at solving problems.',
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
  const { lang, dir } = useT();

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
    <div dir={dir} className="w-full max-w-4xl mx-auto p-2 sm:p-4 select-none">
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-xs font-black mb-3">
          <Sparkles className="w-4 h-4" />
          {pickLang({ ar: 'أبطال SorobanMind', en: 'SorobanMind Heroes' }, lang)}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
          {pickLang(
            { ar: 'اختر بطلك المرافق 🌟', en: 'Choose your companion hero 🌟' },
            lang,
          )}
        </h2>

        <p className="text-slate-600 text-sm sm:text-base font-semibold">
          {pickLang(
            {
              ar: 'سيشاركك بطلُك رحلة تعلّم السوروبان والحساب الذهني',
              en: 'Your hero will accompany you on the soroban and mental math learning journey',
            },
            lang,
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {CHARACTERS.map((char) => {
          const isSelected = selected === char.id;

          const localizedName = pickLang(
            { ar: char.name, en: char.nameEn },
            lang,
          );
          const localizedTitle = pickLang(
            { ar: char.title, en: char.titleEn },
            lang,
          );
          const localizedDescription = pickLang(
            { ar: char.description, en: char.descriptionEn },
            lang,
          );

          return (
            <button
              key={char.id}
              type="button"
              onClick={() => handleSelect(char.id)}
              aria-pressed={isSelected}
              aria-label={`${pickLang(
                { ar: 'اختر', en: 'Choose' },
                lang,
              )} ${localizedName} - ${localizedTitle}`}
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
                  alt={localizedName}
                  className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-xl"
                  motionType={char.motionType}
                />
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-1">
                {localizedName}
              </h3>

              <span className={`text-sm font-black ${char.accentColor}`}>
                {localizedTitle}
              </span>

              <p className="mt-2 text-[11px] leading-relaxed text-slate-500 font-semibold text-center">
                {localizedDescription}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CharacterSelector;