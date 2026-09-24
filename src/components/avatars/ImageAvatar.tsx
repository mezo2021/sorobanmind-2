// src/components/avatars/ImageAvatar.tsx
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ImageAvatarProps {
  src: string;
  alt: string;
  className?: string;
  animated?: boolean;
  motionType?: 'float' | 'breathe' | 'sway';
}

export const ImageAvatar: React.FC<ImageAvatarProps> = ({
  src,
  alt,
  className = 'w-32 h-32',
  animated = true,
  motionType = 'float',
}) => {
  const ref = useRef<HTMLImageElement>(null);
  // إيقاف الحركة إذا كانت الصورة خارج الشاشة (توفير المعالج)
  const isInView = useInView(ref, { amount: 0.2, once: false });

  const animations = {
    float: {
      animate: { y: [0, -6, 0] },
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    breathe: {
      animate: { scale: [1, 1.04, 1] },
      transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    sway: {
      animate: { rotate: [-2, 2, -2] },
      transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  const config = animations[motionType];
  const shouldAnimate = animated && isInView;

  return (
    <motion.img
      ref={ref}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`object-contain select-none pointer-events-none will-change-transform ${className}`}
      animate={shouldAnimate ? config.animate : undefined}
      transition={config.transition}
      whileHover={animated ? { scale: 1.05 } : undefined}
      draggable={false}
    />
  );
};

export default ImageAvatar;