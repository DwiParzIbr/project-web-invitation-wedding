'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeStorySlidesCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeStorySlidesCover: React.FC<NativeStorySlidesCoverProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const [isOpening, setIsOpening] = useState(false);

  const groomClean = getCleanName(invitation.groomName);
  const brideClean = getCleanName(invitation.brideName);
  const handleGroom = groomClean.toLowerCase().replace(/[^a-z0-9]/g, '');
  const handleBride = brideClean.toLowerCase().replace(/[^a-z0-9]/g, '');

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center relative z-20 overflow-hidden select-none bg-black">
      {/* Background Story Photo with Blur and Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter brightness-[0.4] contrast-110 scale-105"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95 pointer-events-none" />

      {/* Floating Story Heart Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500/30"
            style={{
              bottom: '15%',
              right: `${15 + (i * 12)}%`,
            }}
            animate={{
              y: [-10, -180],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1.2, 0.8],
            }}
            transition={{
              duration: 3 + (i * 0.7),
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.8,
            }}
          >
            <Heart className="w-5 h-5 fill-rose-500" />
          </motion.div>
        ))}
      </div>

      {/* Story Phone Card Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.08 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="w-full max-w-sm h-[92dvh] max-h-[720px] rounded-[36px] border border-white/20 bg-black/60 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 flex flex-col justify-between relative z-10 overflow-hidden"
      >
        {/* Top Story Header Bar */}
        <div className="space-y-3">
          {/* Progress Bar Segments Simulation */}
          <div className="grid grid-cols-4 gap-1.5 w-full">
            <div className="h-1 rounded-full bg-white animate-pulse" />
            <div className="h-1 rounded-full bg-white/40" />
            <div className="h-1 rounded-full bg-white/40" />
            <div className="h-1 rounded-full bg-white/40" />
          </div>

          {/* User Profile Bar */}
          <div className="flex items-center justify-between text-left pt-1">
            <div className="flex items-center gap-2.5">
              {/* Pulsing Colorful Story Avatar Ring */}
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 animate-spin-slow">
                <div className="p-0.5 rounded-full bg-black">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                    <img
                      src={invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=300'}
                      alt="Story Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white tracking-wide">
                    @{handleGroom}_{handleBride}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                </div>
                <span className="text-[10px] text-white/70 block">
                  The Official Wedding Story • {weddingDateStr}
                </span>
              </div>
            </div>

            {/* Live Indicator Badge */}
            <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[9px] font-extrabold tracking-wider flex items-center gap-1 shadow-md shadow-rose-600/40 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>LIVE STORY</span>
            </div>
          </div>
        </div>

        {/* Center Story Visual Focus: Couple Title & Mention Sticker */}
        <div className="space-y-6 my-auto py-4">
          <div className="space-y-2 text-center">
            <span 
              className="text-lg sm:text-xl italic text-rose-300 drop-shadow-md block"
              style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
            >
              Exclusive Wedding Story
            </span>
            <h1 
              className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              {groomClean} &amp; {brideClean}
            </h1>
          </div>

          {/* Guest Mention Interactive Sticker */}
          <div className="max-w-[280px] mx-auto p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-center space-y-1 shadow-xl transform -rotate-1 hover:rotate-0 transition-transform">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[9px] font-mono uppercase font-bold border border-rose-400/30">
              <Sparkles className="w-2.5 h-2.5 text-rose-400" />
              <span>GUEST OF HONOR TAGGED</span>
            </div>
            <p className="text-xs text-white/80 font-mono">Special Story For:</p>
            <h3 className="text-base font-bold text-amber-300 tracking-wide">
              @{guestName}
            </h3>
          </div>
        </div>

        {/* Bottom Story Interactive Tap Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] text-white bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 shadow-[0_10px_30px_rgba(244,63,94,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-white fill-white" />
            <span>{isOpening ? 'MEMBUKA STORY...' : 'TONTON STORY PERNIKAHAN'}</span>
          </button>

          <p className="text-[10px] text-white/60 tracking-wider uppercase font-mono">
            Ketuk layar untuk memulai tayangan interaktif
          </p>
        </div>
      </motion.div>
    </div>
  );
};
