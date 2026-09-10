'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Film, Ticket, Star, Sparkles } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeCinematicTrailerCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeCinematicTrailerCover: React.FC<NativeCinematicTrailerCoverProps> = ({
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

  const weddingDate = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z');
  const releaseYear = weddingDate.getFullYear();

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center relative z-20 overflow-hidden select-none bg-[#090A0C]">
      {/* Cinematic Poster Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter contrast-125 brightness-[0.35] scale-105"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'})`,
        }}
      />

      {/* Top Red & Amber Ambient Spotlight Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#E50914]/25 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Main Movie Poster Teaser Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.94 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.06 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-[32px] border border-white/20 bg-gradient-to-b from-[#1c1d24]/95 via-[#131418]/95 to-[#0b0c0e]/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-white relative z-10 space-y-6 overflow-hidden"
      >
        {/* Top Cinema Classification Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[9px] font-mono tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <Film className="w-3.5 h-3.5 text-[#E50914]" />
            <span>WEDDORA PICTURES</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-white font-bold">13+</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-white/10 text-white font-bold">4K HDR</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-[#E50914]/20 text-[#E50914] font-bold">PREMIERE</span>
          </div>
        </div>

        {/* Movie Title & Star Billing */}
        <div className="space-y-2 text-center py-2">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block">
            THE WORLD GALA PREMIERE • {releaseYear}
          </span>
          <h1 
            className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_4px_16px_rgba(229,9,20,0.6)]"
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>
          <span className="text-xs font-serif italic text-slate-300 block">
            &ldquo;A Grand Motion Picture of Eternal Romance &amp; Lifelong Devotion&rdquo;
          </span>
        </div>

        {/* VIP Premiere Admission Ticket Stub */}
        <div className="p-4 rounded-2xl border border-white/15 bg-black/60 text-left space-y-2 relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E50914]/20 text-[#E50914] text-[9px] font-mono font-bold uppercase border border-[#E50914]/30">
              <Ticket className="w-3 h-3" />
              <span>VIP PREMIERE PASS</span>
            </div>
            <span className="text-[9px] font-mono text-slate-400">ROW A • SEAT 01</span>
          </div>

          <div>
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
              ADMIT ONE GUEST OF HONOR:
            </span>
            <h3 className="text-base font-bold text-amber-400 font-serif pt-0.5">
              {guestName}
            </h3>
          </div>
        </div>

        {/* Big Action Button: Play Premiere */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.25em] text-white bg-gradient-to-r from-[#E50914] via-[#b80710] to-[#E50914] hover:from-[#ff1f2d] hover:to-[#E50914] shadow-[0_10px_30px_rgba(229,9,20,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Play className="w-4 h-4 text-white fill-white" />
            <span>{isOpening ? 'MEMUTAR PREMIERE...' : 'PLAY TRAILER / ADMIT ONE'}</span>
          </button>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Press to start Dolby sound &amp; enter VIP cinema
          </span>
        </div>
      </motion.div>
    </div>
  );
};
