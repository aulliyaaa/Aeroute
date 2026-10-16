'use client';

import React, { useState } from 'react';
import { Sparkles, Bot } from 'lucide-react';

export type MascotPose =
  | 'happy'
  | 'circle'
  | 'sad'
  | 'jump'
  | 'maps'
  | 'masker'
  | 'confuse'
  | 'location'

  | 'hero'
  | 'thinking'
  | 'mask'
  | 'flying'
  | 'map'
  | 'ask'
  | 'loc'
  ;

interface MascotAIProps {
  pose?: MascotPose;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  message?: string;
  className?: string;
  showBadge?: boolean;
  altText?: string;
}

export default function MascotAI({
  pose = 'happy',
  size = 'md',
  message,
  className = '',
  showBadge = false,
  altText = 'Aero - AI Mascot',
}: MascotAIProps) {
  const [imageError, setImageError] = useState(false);

  const imageMap: Record<MascotPose, string> = {
    happy: '/mascot/aeroHappy.png',
    circle: '/mascot/aeroCircle.png',
    sad: '/mascot/aeroSad.png',
    jump: '/mascot/aeroJump.png',
    maps: '/mascot/aeroMaps.png',
    masker: '/mascot/aeroMasker.png',
    confuse: '/mascot/aeroBingung.png',
    location: '/mascot/aeroLoc.png',

    hero: '/mascot/aeroHappy.png',
    map: '/mascot/aeroMaps.png',
    mask: '/mascot/aeroMasker.png',
    flying: '/mascot/aeroJump.png',
    thinking: '/mascot/aeroMaps.png',
    ask: '/mascot/aeroBingung.png',
    loc: '/mascot/aeroLoc.png',
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
  };

  const currentSrc = imageMap[pose] || '/mascot/aeroHappy.png';

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} flex-shrink-0 flex items-center justify-center`}>
        {!imageError ? (
          <img
            src={currentSrc}
            alt={altText}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain select-none transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] flex flex-col items-center justify-center text-[#245C49] shadow-sm p-1.5 text-center">
            <Bot className="w-1/2 h-1/2 mb-0.5" />
            <span className="text-[7.5px] font-bold truncate max-w-full">
              {pose}
            </span>
          </div>
        )}

          {showBadge && pose === 'circle' && (
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#245C49] text-white text-[9px] font-black tracking-tighter flex items-center gap-0.5 shadow-sm border border-white">
              <Sparkles className="w-2.5 h-2.5 text-[#CDE5D7]" />
              AI
            </div>
          )}
      </div>

      {message && (
        <div className="relative p-2.5 rounded-2xl bg-[#E8F0EB] border border-[#CDE5D7] text-[#192A24] text-xs font-semibold shadow-sm max-w-xs animate-in fade-in duration-300">
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E8F0EB] border-l border-b border-[#CDE5D7] rotate-45" />
          <div className="relative z-10 leading-snug">{message}</div>
        </div>
      )}
    </div>
  );
}
