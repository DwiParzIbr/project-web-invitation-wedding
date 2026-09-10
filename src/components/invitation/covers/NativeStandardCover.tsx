'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, MailOpen } from 'lucide-react';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeStandardCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
  coverCardBg?: string;
}

export const NativeStandardCover: React.FC<NativeStandardCoverProps> = ({
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
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
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center relative z-20 overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-[#0a0c10]'
    }`}>
      {/* Background Image / Texture with Smooth Vignette */}
      {invitation.coverPhoto && (
        <div
          className="absolute inset-0 bg-cover bg-center filter contrast-105 opacity-25 transform scale-105"
          style={{ backgroundImage: `url(${invitation.coverPhoto})` }}
        />
      )}

      {/* Floating Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-400/40 blur-[1px]"
            style={{
              width: `${(i % 3) * 2 + 2}px`,
              height: `${(i % 3) * 2 + 2}px`,
              top: `${(i * 11) % 90}%`,
              left: `${(i * 19) % 90}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3.5 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Monogram Crest Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-3 z-20"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full border text-[10px] font-mono tracking-[0.25em] uppercase shadow-md backdrop-blur-md ${
          isLight
            ? 'bg-amber-100/70 border-amber-300 text-amber-900'
            : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
        }`}>
          <Crown className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>ROYAL WEDDING INVITATION</span>
        </div>
      </motion.div>

      {/* Main Luxury Envelope Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.05 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl relative z-10 space-y-6 ${
          isLight
            ? 'bg-white/95 border-amber-400/40 text-slate-800 shadow-stone-300/60'
            : 'bg-slate-900/95 border-gold-500/35 text-white shadow-black/80'
        }`}
      >
        {/* Double-line Monogram Seal Crest */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-dashed border-amber-400/60 flex items-center justify-center p-1 relative shadow-inner">
            <div className={`w-full h-full rounded-full border flex items-center justify-center shadow-lg ${
              isLight
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-400/50 text-amber-300'
            }`}>
              <span 
                className="text-xl sm:text-2xl font-black tracking-tighter font-serif"
                style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
              >
                {groomInitial} &amp; {brideInitial}
              </span>
            </div>
          </div>
        </div>

        {/* The Wedding of & Couple Names */}
        <div className="space-y-1 text-center">
          <span 
            className={`text-sm sm:text-base italic block ${
              isLight ? 'text-amber-800' : 'text-amber-300/90'
            }`}
            style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
          >
            The Wedding Celebration of
          </span>
          <h1 
            className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-wider ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>
          <span className={`text-[11px] font-mono tracking-widest block pt-1 uppercase ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {weddingDateStr}
          </span>
        </div>

        {/* Guest Name Plaque */}
        <div className={`p-4 rounded-2xl border text-center space-y-1 ${
          isLight
            ? 'bg-stone-50/80 border-stone-200'
            : 'bg-slate-950/70 border-white/10'
        }`}>
          <span className={`text-[10px] uppercase font-mono tracking-widest block font-bold ${
            isLight ? 'text-amber-800' : 'text-amber-400'
          }`}>
            KEPADA YTH. BAPAK/IBU/SAUDARA/I:
          </span>
          <h2 className={`text-base sm:text-lg font-bold tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {guestName}
          </h2>
          <span className={`text-[10px] block opacity-70 italic font-serif ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            *Mohon maaf apabila ada kesalahan penulisan nama/gelar
          </span>
        </div>

        {/* Action Button: Buka Undangan */}
        <div>
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <MailOpen className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'Membuka Undangan...' : 'Buka Undangan'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
