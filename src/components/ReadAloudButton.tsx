import React, { useState } from 'react';
import { speak } from '../utils/ttsService';

interface ReadAloudButtonProps {
  text: string;
  lang: 'ar' | 'en';
}

export default function ReadAloudButton({ text, lang }: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = async () => {
    if (!text) return;
    setIsPlaying(true);
    try {
      await speak(text, lang);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handleSpeak}
      disabled={isPlaying}
      style={{
        padding: '10px 16px',
        backgroundColor: isPlaying ? '#ccc' : '#4F46E5',
        color: 'white',
        borderRadius: '8px',
        border: 'none',
        fontSize: '16px',
        marginTop: '10px'
      }}
    >
      {isPlaying ? '⏳ جاري القراءة...' : '🔊 اقرأ لي'}
    </button>
  );
}