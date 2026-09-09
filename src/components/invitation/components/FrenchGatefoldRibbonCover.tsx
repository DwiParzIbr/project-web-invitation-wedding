'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Crown, ChevronRight } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface FrenchGatefoldRibbonCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const FrenchGatefoldRibbonCover: React.FC<FrenchGatefoldRibbonCoverProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const [isOpening, setIsOpening] = useState(false);

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = groomName.charAt(0).toUpperCase() || 'G';
  const brideInitial = brideName.charAt(0).toUpperCase() || 'B';

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleUntieRibbon = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Sequence: Ribbon unties -> Gate doors swing open -> Trigger onOpen to enter main invitation
    setTimeout(() => {
      onOpen();
    }, 1350);
  };

  const primaryColor = theme?.primary || '#C9A66B';
  const secondaryColor = theme?.secondary || '#E6D3A9';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-[#070a11]'
    }`}>
      {/* Deep Velvet Backdrop with Ambient Lighting */}
      <div className={`absolute inset-0 pointer-events-none ${
        isLight
          ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#EAE2D5]'
          : 'bg-gradient-to-b from-[#05070d] via-[#0a0f1d] to-[#04060a]'
      }`} />
      
      {/* Subtle Starry Gilded Dust */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-20' : 'opacity-25'}`}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(#d4af37 1px, transparent 1px), radial-gradient(#b48e42 0.6px, transparent 0.6px)'
            : 'radial-gradient(#e5c158 1px, transparent 1px), radial-gradient(#ffffff 0.6px, transparent 0.6px)',
          backgroundSize: '36px 36px, 72px 72px',
        }}
      />

      {/* Floating Header Crest */}
      <div className="text-center mb-4 z-20 pointer-events-none space-y-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest uppercase shadow-sm ${
          isLight
            ? 'bg-amber-400/15 border-amber-400/40 text-amber-900'
            : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
        }`}>
          <Crown className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-400'}`} />
          <span>ROYAL WEDDING INVITATION</span>
        </div>
        <h2 
          className={`text-lg sm:text-xl font-medium tracking-[0.2em] uppercase pt-0.5 ${
            isLight ? 'text-slate-800' : 'text-[#f5dfb8] drop-shadow-md'
          }`}
          style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
        >
          {groomName} & {brideName}
        </h2>
      </div>

      {/* ========================================================
          3D GATEFOLD FOLDER CONTAINER
          ======================================================== */}
      <div 
        className={`relative w-full max-w-[340px] sm:max-w-[390px] aspect-[1/1.44] rounded-3xl ${
          isLight
            ? 'shadow-[0_25px_60px_rgba(0,0,0,0.12)]'
            : 'shadow-[0_30px_90px_rgba(0,0,0,0.95)]'
        }`}
        style={{ perspective: '1600px' }}
      >
        {/* ========================================================
            INNER REVEALED INVITATION CARD (INSIDE GATE)
            ======================================================== */}
        <div className={`absolute inset-0 rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-inner overflow-hidden ${
          isLight
            ? 'bg-gradient-to-b from-[#FFFFFF] via-[#FDFBFA] to-[#F7F3EB] border-amber-400/60'
            : 'bg-gradient-to-b from-[#162033] via-[#0f1726] to-[#0a101b] border-amber-400/50'
        }`}>
          {/* Ornate Gold Filigree Inner Border */}
          <div className={`absolute inset-3 rounded-2xl border pointer-events-none ${
            isLight ? 'border-amber-400/35' : 'border-amber-400/25'
          }`} />
          <div className={`absolute inset-4 rounded-xl border border-dashed pointer-events-none ${
            isLight ? 'border-amber-400/25' : 'border-amber-300/15'
          }`} />

          {/* Top Royal Monogram Crest */}
          <div className="pt-2 space-y-1.5 z-10">
            <div className={`w-14 h-14 rounded-full mx-auto border-2 flex flex-col items-center justify-center font-serif font-black text-base shadow-[0_0_20px_rgba(245,158,11,0.25)] ${
              isLight
                ? 'border-amber-500 bg-gradient-to-br from-amber-200/50 via-yellow-100/40 to-white text-amber-900'
                : 'border-amber-400 bg-gradient-to-br from-amber-400/20 via-yellow-500/10 to-transparent text-amber-200'
            }`}>
              <Crown className="w-4 h-4 text-amber-500 -mb-1" />
              <span>{groomInitial}&{brideInitial}</span>
            </div>
            <span 
              className={`text-[10px] uppercase tracking-[0.3em] font-bold block ${
                isLight ? 'text-amber-900' : 'text-amber-300/90'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              The Royal Union
            </span>
          </div>

          {/* Couple Names */}
          <div className="space-y-2 z-10">
            <h1 
              className={`text-2xl sm:text-3xl font-bold tracking-wide leading-tight ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
            >
              {groomName}
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="w-10 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <span className="text-amber-500 font-serif italic text-lg">&</span>
              <span className="w-10 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>
            <h1 
              className={`text-2xl sm:text-3xl font-bold tracking-wide leading-tight ${
                isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
            >
              {brideName}
            </h1>
          </div>

          {/* Wedding Date & Guest Dedication */}
          <div className="w-full space-y-2.5 pb-2 z-10">
            <p className={`text-xs font-mono tracking-widest uppercase ${
              isLight ? 'text-amber-800 font-semibold' : 'text-amber-300'
            }`}>
              {weddingDateStr}
            </p>
            <div className={`px-4 py-2 rounded-xl border backdrop-blur-md ${
              isLight
                ? 'bg-stone-50/90 border-amber-300/50 shadow-sm'
                : 'bg-black/50 border-amber-400/30'
            }`}>
              <span className={`text-[9px] uppercase tracking-wider block font-mono ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>Spesial Mengundang:</span>
              <p className={`text-xs font-bold truncate pt-0.5 ${
                isLight ? 'text-amber-900' : 'text-white'
              }`}>{guestName}</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            LEFT GATEFOLD DOOR (SWINGS LEFT: rotateY)
            ======================================================== */}
        <motion.div
          animate={{
            rotateY: isOpening ? -120 : 0,
          }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className={`absolute inset-y-0 left-0 w-1/2 rounded-l-3xl border-y-2 border-l-2 border-r-0 z-20 overflow-hidden flex flex-col justify-between p-4 ${
            isLight
              ? 'bg-gradient-to-r from-[#FFFFFF] via-[#FAF7F2] to-[#F2EDE2] border-amber-400/60 shadow-[-10px_0_30px_rgba(0,0,0,0.08)]'
              : 'bg-gradient-to-r from-[#182338] via-[#121c2e] to-[#0c1322] border-amber-400/70 shadow-[-15px_0_40px_rgba(0,0,0,0.9)]'
          }`}
          style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
        >
          {/* Laser-Cut Baroque Arch SVG Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 200 300">
            {/* Victorian Baroque Arch Ornament */}
            <path d="M 10,10 L 190,10 L 190,40 C 140,40 100,80 100,140 C 100,200 140,240 190,240 L 190,290 L 10,290 Z" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="140" r="50" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
            {/* Botanical Corner Flourish */}
            <path d="M 20,20 Q 50,20 50,50 M 20,280 Q 50,280 50,250" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </svg>

          {/* Left Door Scalloped Gold Lace Edge (Center Seam) */}
          <div className="absolute right-0 top-0 bottom-0 w-3 border-r-2 border-amber-400 flex flex-col justify-around py-4 opacity-75 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/80 -mr-1" />
            ))}
          </div>

          {/* Left Door Content */}
          <div className="relative z-10 pt-4 pl-1">
            <span className={`text-[8px] font-mono uppercase tracking-[0.25em] block ${
              isLight ? 'text-amber-800 font-bold' : 'text-amber-400/90'
            }`}>
              PERIKATAN SUCI
            </span>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif font-black text-sm mt-1 shadow-md ${
              isLight
                ? 'border-amber-400 bg-amber-100/60 text-amber-900'
                : 'border-amber-400/60 bg-amber-400/10 text-amber-200'
            }`}>
              {groomInitial}
            </div>
          </div>

          <div className="relative z-10 pb-4 pl-1">
            <span className={`text-[8px] font-mono tracking-widest block uppercase ${
              isLight ? 'text-amber-800/80 font-semibold' : 'text-amber-300/70'
            }`}>
              MEMPELAI PRIA
            </span>
            <p 
              className={`text-xs font-bold tracking-wide truncate max-w-[130px] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
            >
              {groomName}
            </p>
          </div>
        </motion.div>

        {/* ========================================================
            RIGHT GATEFOLD DOOR (SWINGS RIGHT: rotateY)
            ======================================================== */}
        <motion.div
          animate={{
            rotateY: isOpening ? 120 : 0,
          }}
          transition={{ duration: 0.95, delay: 0.35, ease: [0.25, 1, 0.5, 1] }}
          className={`absolute inset-y-0 right-0 w-1/2 rounded-r-3xl border-y-2 border-r-2 border-l-0 z-20 overflow-hidden flex flex-col justify-between p-4 items-end text-right ${
            isLight
              ? 'bg-gradient-to-l from-[#FFFFFF] via-[#FAF7F2] to-[#F2EDE2] border-amber-400/60 shadow-[10px_0_30px_rgba(0,0,0,0.08)]'
              : 'bg-gradient-to-l from-[#182338] via-[#121c2e] to-[#0c1322] border-amber-400/70 shadow-[15px_0_40px_rgba(0,0,0,0.9)]'
          }`}
          style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
        >
          {/* Laser-Cut Baroque Arch SVG Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 200 300">
            {/* Victorian Baroque Arch Ornament */}
            <path d="M 190,10 L 10,10 L 10,40 C 60,40 100,80 100,140 C 100,200 60,240 10,240 L 10,290 L 190,290 Z" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="140" r="50" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.6" />
            {/* Botanical Corner Flourish */}
            <path d="M 180,20 Q 150,20 150,50 M 180,280 Q 150,280 150,250" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          </svg>

          {/* Right Door Scalloped Gold Lace Edge (Center Seam) */}
          <div className="absolute left-0 top-0 bottom-0 w-3 border-l-2 border-amber-400 flex flex-col justify-around py-4 opacity-75 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400/80 -ml-1" />
            ))}
          </div>

          {/* Right Door Content */}
          <div className="relative z-10 pt-4 pr-1">
            <span className={`text-[8px] font-mono uppercase tracking-[0.25em] block ${
              isLight ? 'text-amber-800 font-bold' : 'text-amber-400/90'
            }`}>
              JANJI ABADI
            </span>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center font-serif font-black text-sm mt-1 ml-auto shadow-md ${
              isLight
                ? 'border-amber-400 bg-amber-100/60 text-amber-900'
                : 'border-amber-400/60 bg-amber-400/10 text-amber-200'
            }`}>
              {brideInitial}
            </div>
          </div>

          <div className="relative z-10 pb-4 pr-1">
            <span className={`text-[8px] font-mono tracking-widest block uppercase ${
              isLight ? 'text-amber-800/80 font-semibold' : 'text-amber-300/70'
            }`}>
              MEMPELAI WANITA
            </span>
            <p 
              className={`text-xs font-bold tracking-wide truncate max-w-[130px] ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
            >
              {brideName}
            </p>
          </div>
        </motion.div>

        {/* ========================================================
            LUXURY ROYAL GOLD SILK RIBBON BAND & BROOCH
            ======================================================== */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex items-center justify-center">
          {/* Left Ribbon Band Strip (Rich Gilded Gold Satin) */}
          <motion.div
            animate={{
              x: isOpening ? -200 : 0,
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute left-0 w-1/2 h-11 sm:h-12 bg-gradient-to-b from-[#ca8a04] via-[#eab308] to-[#a16207] shadow-[0_8px_25px_rgba(0,0,0,0.8)] border-y-2 border-amber-200/90 flex items-center"
          >
            {/* Satin Specular Highlight */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </motion.div>

          {/* Right Ribbon Band Strip (Rich Gilded Gold Satin) */}
          <motion.div
            animate={{
              x: isOpening ? 200 : 0,
              opacity: isOpening ? 0 : 1,
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute right-0 w-1/2 h-11 sm:h-12 bg-gradient-to-b from-[#ca8a04] via-[#eab308] to-[#a16207] shadow-[0_8px_25px_rgba(0,0,0,0.8)] border-y-2 border-amber-200/90 flex items-center"
          >
            {/* Satin Specular Highlight */}
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </motion.div>

          {/* CENTER GILDED BROOCH MEDALLION & BOW KNOT */}
          <motion.div
            animate={{
              scale: isOpening ? [1, 1.25, 0] : 1,
              opacity: isOpening ? [1, 0.8, 0] : 1,
              rotate: isOpening ? -25 : 0,
            }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            onClick={handleUntieRibbon}
            className="relative pointer-events-auto cursor-pointer group flex flex-col items-center"
          >
            {/* Glowing Golden Aura Behind Brooch */}
            <span className="absolute -inset-5 rounded-full bg-amber-400/40 blur-xl animate-pulse pointer-events-none" />

            {/* Satin Ribbon Bow Wings */}
            <div className="relative flex items-center justify-center">
              {/* Left Bow Loop (Golden Satin) */}
              <div className="w-11 h-8 rounded-full bg-gradient-to-br from-[#fde047] via-[#ca8a04] to-[#78350f] border-2 border-amber-100/90 transform -rotate-25 shadow-xl group-hover:scale-105 transition-transform" />
              
              {/* Center Gilded Royal Brooch Medallion */}
              <div className="relative -mx-2.5 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-700 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-10 group-hover:scale-110 transition-transform">
                <div className={`w-full h-full rounded-full border-2 border-amber-300 flex flex-col items-center justify-center font-serif font-black text-base tracking-wider shadow-inner ${
                  isLight
                    ? 'bg-white text-amber-900'
                    : 'bg-gradient-to-b from-[#182338] via-[#0f1726] to-[#0a101b] text-amber-200'
                }`}>
                  <Crown className="w-4 h-4 text-amber-500 -mb-0.5" />
                  <span className="leading-tight">{groomInitial}&{brideInitial}</span>
                  <span className="w-4 h-0.5 bg-amber-400/60 rounded-full mt-0.5" />
                </div>
              </div>

              {/* Right Bow Loop (Golden Satin) */}
              <div className="w-11 h-8 rounded-full bg-gradient-to-bl from-[#fde047] via-[#ca8a04] to-[#78350f] border-2 border-amber-100/90 transform rotate-25 shadow-xl group-hover:scale-105 transition-transform" />
            </div>

            {/* Ribbon Hanging Tails with Gold Trim */}
            <div className="flex gap-2.5 -mt-1 pointer-events-none">
              <div className="w-4 h-10 bg-gradient-to-b from-[#ca8a04] to-[#78350f] rounded-b transform -rotate-12 border-b-2 border-l-2 border-amber-300/80 shadow-md" />
              <div className="w-4 h-10 bg-gradient-to-b from-[#ca8a04] to-[#78350f] rounded-b transform rotate-12 border-b-2 border-r-2 border-amber-300/80 shadow-md" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Hint */}
      <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        onClick={handleUntieRibbon}
        className="mt-6 flex flex-col items-center gap-1.5 cursor-pointer z-30"
      >
        <button
          type="button"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-slate-950 font-serif font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_25px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>Buka Pintu Undangan</span>
          <ChevronRight className="w-4 h-4 text-slate-950" />
        </button>
        <span className={`text-[10px] font-sans tracking-wide ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Sentuh simpul pita emas untuk menyingkap pintu gerbang
        </span>
      </motion.div>
    </div>
  );
};
