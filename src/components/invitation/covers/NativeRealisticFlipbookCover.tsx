'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Heart } from 'lucide-react';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeRealisticFlipbookCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeRealisticFlipbookCover: React.FC<NativeRealisticFlipbookCoverProps> = ({
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
  const groomInitial = getInitialLetter(invitation.groomName, 'G');
  const brideInitial = getInitialLetter(invitation.brideName, 'B');

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 650);
  };

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center relative z-20 overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#2A231C]' : 'bg-[#15120E]'
    }`}>
      {/* Background Wood Table Texture */}
      <div className="absolute inset-0 bg-radial from-amber-950/20 via-black/80 to-black pointer-events-none" />

      {/* Floating Book Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/30 blur-[1px]"
            style={{
              width: '4px',
              height: '4px',
              top: `${(i * 15) % 85}%`,
              left: `${(i * 22) % 85}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main 3D Hardcover Wedding Book */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, rotateY: 10 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.05 : 1,
          rotateY: isOpening ? -35 : 0,
          x: isOpening ? -30 : 0,
        }}
        transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ transformOrigin: 'left center', perspective: 1200 }}
        className="w-full max-w-sm sm:max-w-md p-7 sm:p-9 rounded-2xl sm:rounded-3xl border-2 border-amber-600/40 bg-gradient-to-br from-[#3b2b1d] via-[#2c1f15] to-[#1e150e] shadow-[20px_25px_60px_rgba(0,0,0,0.95)] text-amber-100 relative z-10 space-y-6 overflow-hidden"
      >
        {/* Left Book Spine Shading Overlay */}
        <div className="absolute left-0 inset-y-0 w-6 sm:w-8 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-20" />
        {/* Book Spine Stitching Line */}
        <div className="absolute left-5 sm:left-7 inset-y-0 w-0.5 border-r border-dashed border-amber-500/30 pointer-events-none z-20" />

        {/* Vintage Brass Corner Protectors */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400/80 pointer-events-none rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400/80 pointer-events-none rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400/80 pointer-events-none rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400/80 pointer-events-none rounded-br-sm" />

        {/* Hanging Satin Ribbon Bookmark */}
        <div className="absolute -top-1 right-12 w-6 h-16 bg-gradient-to-b from-rose-700 to-rose-900 shadow-md transform -rotate-1 z-20 rounded-b-sm border-b-4 border-rose-950" />

        {/* Embossed Leather Monogram Seal */}
        <div className="flex flex-col items-center pt-2">
          <div className="w-16 h-16 rounded-full border-2 border-amber-400/60 bg-gradient-to-br from-amber-600/20 to-amber-950/80 p-1 flex items-center justify-center shadow-inner">
            <span 
              className="text-2xl font-black text-amber-300 font-serif tracking-tight"
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              {groomInitial} &amp; {brideInitial}
            </span>
          </div>
        </div>

        {/* Book Title & Couple Names */}
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block">
            OUR WEDDING KEEPSAKE BOOK
          </span>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-amber-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>
          <span className="text-xs font-serif italic text-amber-300/80 block">
            {weddingDateStr}
          </span>
        </div>

        {/* Brass Guest Name Plaque */}
        <div className="p-3.5 rounded-xl border border-amber-500/40 bg-black/40 text-center space-y-0.5 shadow-inner">
          <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
            BUKU KENANGAN UNTUK TAMU TERHORMAT:
          </span>
          <h3 className="text-base font-bold text-white font-serif">
            {guestName}
          </h3>
        </div>

        {/* Action Button: Open Hardcover Book */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-3.5 sm:py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMBUKA SAMPUL BUKU...' : 'BUKA SAMPUL BUKU (OPEN)'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
