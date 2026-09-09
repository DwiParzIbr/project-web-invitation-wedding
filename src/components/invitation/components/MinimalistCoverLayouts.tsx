'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Heart } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface MinimalistCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

// =========================================================================
// 1. MINIMALIST 1: EDITORIAL TOP & BOTTOM (Gaya "DHANTY & ANDY")
// =========================================================================
export const MinimalistCover1: React.FC<MinimalistCoverProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden select-none flex flex-col justify-between items-center transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-black'
    }`}>
      {/* Full-bleed Portrait Cover Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter contrast-105 transform scale-100 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />

      {/* Smooth Vertical Vignette Gradients for High Readability */}
      <div className={`absolute top-0 inset-x-0 h-48 sm:h-60 pointer-events-none z-10 ${
        isLight
          ? 'bg-gradient-to-b from-white/95 via-white/60 to-transparent'
          : 'bg-gradient-to-b from-black/85 via-black/45 to-transparent'
      }`} />
      <div className={`absolute bottom-0 inset-x-0 h-72 sm:h-80 pointer-events-none z-10 ${
        isLight
          ? 'bg-gradient-to-t from-white/95 via-white/70 to-transparent'
          : 'bg-gradient-to-t from-black/95 via-black/60 to-transparent'
      }`} />

      {/* TOP SECTION: TITLES (The Wedding of & Couple Names) */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-20 pt-10 sm:pt-14 px-6 text-center space-y-1"
      >
        <span 
          className={`text-base sm:text-lg italic font-serif block ${
            isLight ? 'text-amber-800' : 'text-amber-200/90 drop-shadow-md'
          }`}
          style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
        >
          The Wedding of
        </span>
        <h1 
          className={`text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-[0.2em] font-serif ${
            isLight ? 'text-slate-900 drop-shadow-none' : 'text-white drop-shadow-lg'
          }`}
          style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
        >
          {groomName} & {brideName}
        </h1>
      </motion.div>

      {/* BOTTOM SECTION: GUEST, PILL BUTTON, & COURTESY NOTE */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative z-20 pb-10 sm:pb-14 px-6 w-full max-w-sm text-center space-y-3.5 flex flex-col items-center"
      >
        <div className="space-y-0.5">
          <span className={`text-xs font-serif italic block ${
            isLight ? 'text-amber-800' : 'text-amber-200/80'
          }`}>
            Dear,
          </span>
          <h2 className={`text-base sm:text-lg font-bold tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
          }`}>
            {guestName}
          </h2>
        </div>

        {/* Elegant Gold/Champagne Rounded Pill Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpen}
          type="button"
          className="px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider text-stone-900 bg-gradient-to-r from-[#e7d5b8] via-[#dfc498] to-[#c9a76d] shadow-[0_10px_25px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer border border-amber-200/50"
        >
          <Mail className="w-4 h-4 text-stone-900" />
          <span>Open Invitation</span>
        </motion.button>

        {/* Polite Courtesy Subtext */}
        <p className={`text-[10px] italic font-sans tracking-wide leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300/80'
        }`}>
          Mohon maaf apabila ada kesalahan pada penulisan nama/gelar
        </p>
      </motion.div>
    </div>
  );
};


// =========================================================================
// 2. MINIMALIST 2: WATERCOLOR FLORAL CORNER (Gaya "Wulan & Brian")
// =========================================================================
export const MinimalistCover2: React.FC<MinimalistCoverProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);

  return (
    <div className={`relative min-h-screen w-full overflow-hidden select-none flex flex-col justify-end items-center transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-[#10151f]'
    }`}>
      {/* Full-bleed Portrait Cover Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter contrast-[1.02]"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />

      {/* Gentle White/Dark Translucent Scrim for High Text Contrast */}
      <div className={`absolute inset-0 pointer-events-none z-10 ${
        isLight
          ? 'bg-gradient-to-t from-white/95 via-white/60 to-transparent'
          : 'bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent'
      }`} />
      <div className={`absolute top-0 inset-x-0 h-40 pointer-events-none z-10 ${
        isLight
          ? 'bg-gradient-to-b from-white/70 to-transparent'
          : 'bg-gradient-to-b from-black/40 to-transparent'
      }`} />

      {/* ========================================================
          WATERCOLOR FLORAL BOTANICAL CORNER ACCENTS (ANIMATED)
          ======================================================== */}
      {/* Top-Left Floral Spray */}
      <div className="absolute top-0 left-0 w-36 sm:w-48 aspect-square pointer-events-none z-20 opacity-90">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <g fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.8">
            <path d="M 10,20 Q 60,30 80,70 Q 50,110 20,80 Z" fill="#3b82f6" fillOpacity="0.45" />
            <path d="M 40,10 Q 90,40 100,90 Q 70,120 30,100 Z" fill="#1d4ed8" fillOpacity="0.5" />
            <path d="M 0,50 Q 40,80 50,130 Q 20,150 0,110 Z" fill="#60a5fa" fillOpacity="0.35" />
          </g>
          {/* Floral Berries */}
          <circle cx="85" cy="55" r="4" fill="#1e3a8a" />
          <circle cx="95" cy="45" r="3.5" fill="#1e3a8a" />
          <circle cx="75" cy="75" r="3" fill="#1e3a8a" />
        </svg>
      </div>

      {/* Top-Right Floral Spray */}
      <div className="absolute top-0 right-0 w-36 sm:w-48 aspect-square pointer-events-none z-20 opacity-90">
        <svg viewBox="0 0 200 200" className="w-full h-full transform scale-x-[-1]">
          <g fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.8">
            <path d="M 10,20 Q 60,30 80,70 Q 50,110 20,80 Z" fill="#3b82f6" fillOpacity="0.45" />
            <path d="M 40,10 Q 90,40 100,90 Q 70,120 30,100 Z" fill="#1d4ed8" fillOpacity="0.5" />
          </g>
          <circle cx="85" cy="55" r="4" fill="#1e3a8a" />
          <circle cx="95" cy="45" r="3.5" fill="#1e3a8a" />
        </svg>
      </div>

      {/* Bottom-Left Animated Watercolor Flower (Bunga Bergerak Sudut Kiri Bawah) */}
      <motion.div 
        animate={{ 
          rotate: [-3, 3, -3],
          y: [0, -6, 0],
          scale: [1, 1.03, 1]
        }}
        transition={{ 
          duration: 5.5, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="absolute -bottom-3 -left-3 w-36 sm:w-48 aspect-square pointer-events-none z-20 opacity-90 origin-bottom-left"
      >
        <svg viewBox="0 0 240 240" className="w-full h-full filter drop-shadow-md">
          {/* Layered Botanical Leaves in Navy / Blue Watercolor */}
          <g fill="none" stroke="#1e3a8a" strokeWidth="1.5">
            <path d="M 20,220 Q 70,165 105,190 Q 65,230 20,220 Z" fill="#2563eb" fillOpacity="0.55" />
            <path d="M 15,175 Q 55,135 95,155 Q 65,195 15,175 Z" fill="#1d4ed8" fillOpacity="0.65" />
            <path d="M 45,145 Q 85,115 115,145 Q 85,175 45,145 Z" fill="#3b82f6" fillOpacity="0.45" />
            <path d="M 5,210 Q 35,160 70,175 Q 45,215 5,210 Z" fill="#60a5fa" fillOpacity="0.4" />
          </g>
          {/* Main Watercolor Rose Bud / Blossom */}
          <circle cx="65" cy="175" r="26" fill="#1e40af" fillOpacity="0.75" />
          <circle cx="60" cy="170" r="18" fill="#1e3a8a" fillOpacity="0.85" />
          <circle cx="58" cy="168" r="10" fill="#2563eb" fillOpacity="0.95" />
          {/* Accent Berries */}
          <circle cx="95" cy="135" r="4" fill="#0f172a" />
          <circle cx="105" cy="145" r="3.5" fill="#0f172a" />
          <circle cx="115" cy="130" r="3" fill="#0f172a" />
          <circle cx="85" cy="125" r="3.5" fill="#1e3a8a" />
        </svg>
      </motion.div>

      {/* Bottom-Right Animated Botanical Bouquet */}
      <motion.div 
        animate={{ 
          rotate: [2, -2.5, 2],
          y: [0, -5, 0],
          scale: [1, 1.02, 1]
        }}
        transition={{ 
          duration: 6.5, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="absolute -bottom-2 -right-2 w-44 sm:w-56 aspect-square pointer-events-none z-20 opacity-95 origin-bottom-right"
      >
        <svg viewBox="0 0 240 240" className="w-full h-full filter drop-shadow-lg">
          {/* Layered Watercolor Leaves */}
          <g fill="none" stroke="#1e3a8a" strokeWidth="1.5">
            <path d="M 220,120 Q 170,140 150,190 Q 180,220 220,190 Z" fill="#2563eb" fillOpacity="0.55" />
            <path d="M 180,100 Q 140,130 130,180 Q 160,200 190,160 Z" fill="#1d4ed8" fillOpacity="0.65" />
            <path d="M 140,150 Q 100,180 110,230 Q 150,230 170,190 Z" fill="#3b82f6" fillOpacity="0.5" />
          </g>
          {/* Main Watercolor Rose Bud */}
          <circle cx="165" cy="165" r="26" fill="#1e40af" fillOpacity="0.75" />
          <circle cx="160" cy="160" r="18" fill="#1e3a8a" fillOpacity="0.85" />
          <circle cx="158" cy="158" r="10" fill="#2563eb" fillOpacity="0.95" />
          <circle cx="130" cy="140" r="4.5" fill="#0f172a" />
          <circle cx="120" cy="150" r="3.5" fill="#0f172a" />
          <circle cx="140" cy="130" r="3" fill="#0f172a" />
        </svg>
      </motion.div>

      {/* ========================================================
          STRICTLY LEFT-ALIGNED TYPOGRAPHY & BUTTON (GAYA WULAN & BRIAN)
          ======================================================== */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-20 pb-12 sm:pb-16 pl-7 pr-6 w-full max-w-md text-left space-y-3.5"
      >
        <div className="space-y-1 text-left">
          <span 
            className={`text-xs sm:text-sm italic font-serif block text-left ${
              isLight ? 'text-amber-800 font-semibold' : 'text-slate-200 drop-shadow-sm'
            }`}
            style={{ fontFamily: `'${fonts?.accent || 'Playfair Display'}', serif` }}
          >
            The Wedding of
          </span>
          <h1 
            className={`text-3xl sm:text-4xl font-bold tracking-tight font-serif leading-tight text-left ${
              isLight ? 'text-slate-900' : 'text-sky-100 drop-shadow-md'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
          >
            {groomName} & {brideName}
          </h1>
        </div>

        <div className="space-y-0.5 pt-1 text-left">
          <span className={`text-xs font-serif block text-left ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Kepada Yth. Bapak/Ibu/Saudara/i
          </span>
          <h3 className={`text-base sm:text-lg font-bold text-left ${
            isLight ? 'text-amber-900' : 'text-sky-100'
          }`}>
            {guestName}
          </h3>
        </div>

        {/* Rounded Pill Button (Rata Kiri Sesuai Desain Gambar) */}
        <div className="flex justify-start pt-1">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpen}
            type="button"
            className={`px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 transition-all cursor-pointer ${
              isLight
                ? 'text-stone-900 bg-gradient-to-r from-[#e7d5b8] via-[#dfc498] to-[#c9a76d] border border-amber-400/50 shadow-[0_10px_25px_rgba(0,0,0,0.12)]'
                : 'text-white bg-[#1e3a5f] hover:bg-[#152943] shadow-[0_10px_25px_rgba(30,58,95,0.45)] border border-sky-400/20'
            }`}
          >
            <Mail className={`w-4 h-4 ${isLight ? 'text-stone-900' : 'text-white'}`} />
            <span>Buka Undangan</span>
          </motion.button>
        </div>

        <p className={`text-[10px] font-sans italic tracking-tight pt-1 text-left leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}>
          Mohon maaf apabila ada kesalahan pada penulisan nama & gelar
        </p>
      </motion.div>
    </div>
  );
};


// =========================================================================
// 3. MINIMALIST 3: MODERN FINE-LINE FRAME & ARCH SILHOUETTE
// =========================================================================
export const MinimalistCover3: React.FC<MinimalistCoverProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = groomName.charAt(0).toUpperCase() || 'G';
  const brideInitial = brideName.charAt(0).toUpperCase() || 'B';

  return (
    <div className={`relative min-h-screen w-full overflow-hidden select-none flex flex-col justify-between items-center p-4 sm:p-6 transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-stone-950'
    }`}>
      {/* Full-bleed Portrait Cover Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter contrast-105"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />

      {/* Vignette Overlay for Readability */}
      <div className={`absolute inset-0 pointer-events-none z-10 ${
        isLight ? 'bg-white/55 backdrop-blur-[1px]' : 'bg-black/45'
      }`} />

      {/* Architectural Fine-Line Inset Frame */}
      <div className={`absolute inset-4 sm:inset-6 rounded-2xl sm:rounded-3xl pointer-events-none z-10 ${
        isLight ? 'border-2 border-amber-600/40 shadow-inner' : 'border border-white/30'
      }`} />

      {/* TOP SECTION: MONOGRAM BADGE */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 pt-8 sm:pt-10 text-center space-y-2"
      >
        <div className={`w-11 h-11 rounded-full mx-auto backdrop-blur-md flex items-center justify-center font-serif text-sm tracking-wider shadow ${
          isLight 
            ? 'border border-amber-500/50 bg-white/80 text-amber-900' 
            : 'border border-white/40 bg-black/30 text-white'
        }`}>
          {groomInitial}&{brideInitial}
        </div>
        <span className={`text-[10px] uppercase tracking-[0.35em] font-bold block font-mono ${
          isLight ? 'text-amber-900' : 'text-white/80'
        }`}>
          THE WEDDING CELEBRATION
        </span>
      </motion.div>

      {/* BOTTOM SECTION: COUPLE NAMES, GUEST, & FROSTED PILL BUTTON */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-20 pb-8 sm:pb-12 px-6 w-full max-w-sm text-center space-y-3.5 flex flex-col items-center"
      >
        <div className="space-y-1">
          <h1 
            className={`text-2xl sm:text-3xl font-serif font-bold tracking-wide leading-tight ${
              isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            {groomName} & {brideName}
          </h1>
        </div>

        <div className={`h-px w-16 ${isLight ? 'bg-amber-500/40' : 'bg-white/40'}`} />

        <div className="space-y-0.5">
          <span className={`text-[11px] font-sans tracking-wide block ${
            isLight ? 'text-slate-600 font-semibold' : 'text-white/80'
          }`}>
            Kepada Yth:
          </span>
          <h3 className={`text-base font-bold tracking-wide ${
            isLight ? 'text-amber-900' : 'text-white drop-shadow'
          }`}>
            {guestName}
          </h3>
        </div>

        {/* Frosted Glass Pill Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpen}
          type="button"
          className={`px-7 py-2.5 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isLight
              ? 'text-stone-900 bg-gradient-to-r from-[#e7d5b8] via-[#dfc498] to-[#c9a76d] border border-amber-400/60 shadow-lg'
              : 'text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 shadow-xl'
          }`}
        >
          <Mail className={`w-4 h-4 ${isLight ? 'text-stone-900' : 'text-white'}`} />
          <span>Buka Undangan</span>
        </motion.button>

        <p className={`text-[9px] italic font-sans tracking-wide ${
          isLight ? 'text-slate-600' : 'text-white/70'
        }`}>
          Mohon maaf apabila ada kesalahan pada penulisan nama/gelar
        </p>
      </motion.div>
    </div>
  );
};
