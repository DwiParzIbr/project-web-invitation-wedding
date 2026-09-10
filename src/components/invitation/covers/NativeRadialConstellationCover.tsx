'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Orbit, Compass } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeRadialConstellationCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeRadialConstellationCover: React.FC<NativeRadialConstellationCoverProps> = ({
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
  const weddingDateStr = weddingDate.toLocaleDateString('id-ID', {
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
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center relative z-20 overflow-hidden select-none bg-[#050811]">
      {/* Deep Space Background with Nebular Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#070b18] to-[#04060d] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Floating Starlight Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-300"
            style={{
              width: `${(i % 3) + 1.5}px`,
              height: `${(i % 3) + 1.5}px`,
              top: `${(i * 17) % 95}%`,
              left: `${(i * 23) % 95}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.8, 1.4, 0.8],
            }}
            transition={{
              duration: 2.5 + (i % 4),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Main Cosmic Portal Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.94 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.08 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-[36px] border border-amber-500/30 bg-gradient-to-b from-[#111728]/95 via-[#0b101f]/95 to-[#050811]/95 backdrop-blur-2xl shadow-[0_25px_65px_rgba(0,0,0,0.95)] text-white relative z-10 space-y-6 overflow-hidden"
      >
        {/* Rotating Concentric Astrological Orbit Rings */}
        <div className="flex flex-col items-center relative py-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 rounded-full border border-dashed border-amber-400/40 flex items-center justify-center p-2 relative"
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full rounded-full border border-amber-400/30 flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center justify-center text-slate-950 font-bold">
                ✦
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Constellation Title & Coordinates */}
        <div className="space-y-1.5 text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block">
            CELESTIAL HARMONY • ORBIT OF LOVE
          </span>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]"
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>
          <span className="text-xs font-serif italic text-slate-300 block">
            {weddingDateStr}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-amber-300/80 block pt-1">
            COORDINATES: RA 18h 36m • DEC +38° 47&apos;
          </span>
        </div>

        {/* Celestial Observer Access Badge */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-black/60 text-left space-y-1">
          <div className="flex items-center justify-between text-[9px] font-mono text-amber-400 uppercase font-bold">
            <span>OBSERVER CLEARANCE</span>
            <span>LEVEL 1 VIP</span>
          </div>
          <span className="text-[11px] text-slate-400 font-sans block">
            Diberikan otoritas kepada Pengamat Kehormatan:
          </span>
          <h3 className="text-base font-bold text-amber-300 font-serif">
            {guestName}
          </h3>
        </div>

        {/* Action Button: Initiate Constellation Hub */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMBUKA ORBIT...' : 'INISIASI ORBIT BINTANG (ENTER)'}</span>
          </button>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Navigasi radial 360° mengitari Inti Gravitasi Cinta
          </span>
        </div>
      </motion.div>
    </div>
  );
};
