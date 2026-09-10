'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Plane, Heart, Stamp } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeIsometricMapCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeIsometricMapCover: React.FC<NativeIsometricMapCoverProps> = ({
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
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center relative z-20 overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#0f1b2b]' : 'bg-[#080d16]'
    }`}>
      {/* Background Map Grid & Flight Path Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Main Passport Booklet Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.94 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.06 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-[32px] border-2 border-emerald-500/35 bg-gradient-to-b from-[#132238]/95 via-[#0e1929]/95 to-[#09101c]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white relative z-10 space-y-6 overflow-hidden"
      >
        {/* Passport Header Crest */}
        <div className="flex flex-col items-center space-y-2 border-b border-white/10 pb-4">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-emerald-400/60 flex items-center justify-center bg-emerald-500/10 text-emerald-400 shadow-md">
            <Compass className="w-7 h-7 animate-spin-slow" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-emerald-400 font-bold block">
              LOVE JOURNEY PASSPORT
            </span>
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block">
              FLIGHT &amp; EXPEDITION PASS
            </span>
          </div>
        </div>

        {/* Journey Destination & Couple Names */}
        <div className="space-y-2 text-center py-1">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400">
            <span>ORIGIN: 2 HEARTS</span>
            <span>➔</span>
            <span>DESTINY: FOREVER</span>
          </div>

          <h1 
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white drop-shadow-md"
            style={{ fontFamily: `'${fonts?.heading || 'Plus Jakarta Sans'}', sans-serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>

          {/* Love Visa Approved Stamp */}
          <div className="inline-block px-3 py-1 rounded-md border-2 border-dashed border-rose-500/80 text-rose-400 text-[10px] font-mono font-black uppercase tracking-wider transform -rotate-2 shadow-sm">
            ✓ VISA TO ETERNAL LOVE APPROVED
          </div>
        </div>

        {/* Boarding Ticket Passenger Data */}
        <div className="p-4 rounded-2xl border border-white/10 bg-black/50 text-left space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase">
            <span>PASSENGER NAME</span>
            <span>FLIGHT CLASS</span>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-emerald-300 font-sans">
              {guestName}
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400">
              VIP FIRST CLASS
            </span>
          </div>
          <div className="border-t border-dashed border-white/10 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-400">
            <span>BOARDING DATE: {weddingDateStr.toUpperCase()}</span>
            <span>GATE: 01-LOVE</span>
          </div>
        </div>

        {/* Action Button: Start Journey */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plane className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMBUKA PASPOR...' : 'BUKA PASPOR & MULAI PERJALANAN'}</span>
          </button>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Jelajahi rute garis asmara interaktif Our Journey
          </span>
        </div>
      </motion.div>
    </div>
  );
};
