'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Crown, ChevronRight, Heart } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface StandardCoverCardProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  coverCardBg?: string;
  designSchema?: any;
}

export const StandardCoverCard: React.FC<StandardCoverCardProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  coverCardBg,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const [isOpening, setIsOpening] = useState(false);

  const groomClean = getCleanName(invitation.groomName);
  const brideClean = getCleanName(invitation.brideName);

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Smooth portal opening exit transition before revealing main invitation & starting music
    setTimeout(() => {
      onOpen();
    }, 650);
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center relative z-20 overflow-hidden select-none">
      {/* Ambient Floating Gold Dust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300/40 blur-[1px]"
            style={{
              width: `${(i % 3) * 2 + 2}px`,
              height: `${(i % 3) * 2 + 2}px`,
              top: `${(i * 13) % 90}%`,
              left: `${(i * 17) % 90}%`,
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3.5 + (i % 3) * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Floating Top Monogram Badge */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-2 sm:mb-3 z-20 pointer-events-none"
      >
        <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[9px] sm:text-[10px] font-mono tracking-[0.25em] uppercase shadow-lg backdrop-blur-md ${
          isLight
            ? 'bg-amber-400/15 border-amber-400/40 text-amber-900'
            : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
        }`}>
          <Crown className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>WEDDING INVITATION</span>
        </div>
      </motion.div>

      {/* Main Luxury Envelope Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.94 }}
        animate={
          isOpening
            ? { opacity: 0, scale: 1.08, y: -25, filter: 'blur(8px)' }
            : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
        }
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-[340px] sm:max-w-[370px] p-5 sm:p-6 rounded-3xl backdrop-blur-2xl border-2 relative overflow-hidden flex flex-col items-center space-y-3.5 sm:space-y-4 ${
          isLight
            ? 'border-amber-400/60 shadow-[0_25px_70px_rgba(0,0,0,0.12)]'
            : 'border-amber-400/50 shadow-[0_25px_70px_rgba(0,0,0,0.92)]'
        }`}
        style={{ backgroundColor: coverCardBg || (isLight ? '#FFFFFF' : '#0f172aee') }}
      >
        {/* Laser-Cut Victorian Filigree Corner Ornaments with Gentle Golden Glow */}
        <svg className="absolute top-2.5 left-2.5 w-6 h-6 text-amber-400/70 pointer-events-none drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
          <path d="M 4,4 L 20,4 M 4,4 L 4,20" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute top-2.5 right-2.5 w-6 h-6 text-amber-400/70 pointer-events-none rotate-90 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
          <path d="M 4,4 L 20,4 M 4,4 L 4,20" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-2.5 left-2.5 w-6 h-6 text-amber-400/70 pointer-events-none -rotate-90 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
          <path d="M 4,4 L 20,4 M 4,4 L 4,20" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-2.5 right-2.5 w-6 h-6 text-amber-400/70 pointer-events-none rotate-180 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]" viewBox="0 0 40 40" fill="none" stroke="currentColor">
          <path d="M 4,4 L 20,4 M 4,4 L 4,20" strokeWidth="2.5" />
          <circle cx="8" cy="8" r="2" fill="currentColor" />
        </svg>
        <div className="absolute inset-2 rounded-2xl border border-amber-400/20 pointer-events-none" />

        {/* Breathing Golden Halo Aura Behind Photo Frame */}
        <div className="relative">
          <motion.span
            animate={{ scale: [1, 1.14, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-full bg-gradient-to-tr from-amber-500/40 via-yellow-400/30 to-amber-600/40 blur-xl pointer-events-none"
          />

          {/* Glowing Couple Photo Frame with Double Gold Rings */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto p-1 bg-gradient-to-tr from-amber-600 via-yellow-200 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.4)] overflow-hidden"
          >
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-950 bg-slate-950">
              <img
                src={invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Couple Names (Displayed Only Once Cleanly with Romantic Stagger Animation) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="space-y-1 z-10 w-full px-2"
        >
          <h1
            className={`text-xl sm:text-2xl font-bold tracking-wide leading-tight ${
              isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
            }`}
            style={{
              fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif`,
              textShadow: isLight ? 'none' : '0 4px 14px rgba(0,0,0,0.9)',
            }}
          >
            <span className="block leading-tight">{groomClean}</span>
            <span className="text-amber-500 font-serif italic text-base sm:text-lg my-1 block">&</span>
            <span className="block leading-tight">{brideClean}</span>
          </h1>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-amber-400/60" />
            <p
              className={`text-[10px] sm:text-[11px] font-mono tracking-widest uppercase ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}
              style={{ fontFamily: `'${fonts?.body || 'Montserrat'}', sans-serif` }}
            >
              {weddingDateStr}
            </p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-amber-400/60" />
          </div>
        </motion.div>

        {/* Guest Dedication Card (Clean label without duplicate text) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className={`w-full py-2 px-3 rounded-xl border text-center shadow-inner space-y-0.5 backdrop-blur-md ${
            isLight
              ? 'bg-stone-50/90 border-amber-400/40 text-slate-800'
              : 'bg-slate-950/70 border-amber-400/30'
          }`}
        >
          <span className={`text-[9px] uppercase tracking-wider block font-mono ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>Kepada Yth:</span>
          <h3 className={`font-bold text-xs sm:text-sm truncate ${
            isLight ? 'text-amber-800' : 'text-amber-300'
          }`}>
            {guestName || 'Bapak/Ibu/Saudara/i'}
          </h3>
        </motion.div>

        {/* Gilded 24K Gold CTA Button with Shimmer Light Sweep */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
          className="w-full"
        >
          <motion.button
            type="button"
            onClick={handleOpenClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-full py-3 sm:py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 shadow-[0_10px_25px_rgba(245,158,11,0.4)] cursor-pointer flex items-center justify-center gap-2 border border-amber-200 overflow-hidden"
          >
            {/* Shimmer Light Beam Sweeping Continually Across Button */}
            <motion.div
              animate={{ x: ['-150%', '250%'] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 0.6,
              }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-12 pointer-events-none"
            />

            <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            <span className="relative z-10 font-black">Buka Undangan</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-950 relative z-10" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Footnote */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="pt-2 text-[9px] text-slate-400/80 font-mono tracking-wide"
      >
        <span>Sentuh tombol untuk membuka undangan</span>
      </motion.div>
    </div>
  );
};
