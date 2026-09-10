'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Eye } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeHorizontalGalleryCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeHorizontalGalleryCover: React.FC<NativeHorizontalGalleryCoverProps> = ({
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
    }, 600);
  };

  return (
    <div className={`min-h-[100dvh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center relative z-20 overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#181A20]' : 'bg-[#0E1013]'
    }`}>
      {/* Background Museum Wall with Gallery Spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 sm:w-[500px] h-64 bg-gradient-to-b from-amber-400/20 to-transparent blur-3xl pointer-events-none" />

      {/* Main Museum Gallery Entrance Plaque */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.05 : 1,
          x: isOpening ? -40 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#21252e]/95 via-[#171a21]/95 to-[#101217]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white relative z-10 space-y-6 overflow-hidden"
      >
        {/* Curatorial Header */}
        <div className="border-b border-white/10 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[9px] uppercase font-bold tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MUSEO D&apos;AMOUR • VERNISSAGE</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            ATRIUM D&apos;INGRESSO
          </span>
        </div>

        {/* Exhibition Title & Monogram */}
        <div className="space-y-2 text-center py-1">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block">
            ESPOSIZIONE PERMANENTE D&apos;ARTE
          </span>
          <h1 
            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(201,166,107,0.4)]"
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            {groomClean} &amp; {brideClean}
          </h1>
          <p className="text-xs font-serif italic text-slate-300 leading-relaxed">
            &ldquo;Koleksi mahakarya cinta abadi, janji sakral, dan perayaan agung dua insan.&rdquo;
          </p>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 block pt-1">
            INAUGURAZIONE: {weddingDateStr.toUpperCase()}
          </span>
        </div>

        {/* Gallery VIP Pass Plaque */}
        <div className="p-4 rounded-2xl border border-amber-500/30 bg-black/50 text-left space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[9px] font-mono text-amber-400 uppercase font-bold">
            <span>BIGLIETTO D&apos;ONORE</span>
            <span>INGRESSO VIP</span>
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Undangan Kehormatan Kuratorial untuk:
          </p>
          <h3 className="text-base font-bold text-amber-300 font-serif">
            {guestName}
          </h3>
        </div>

        {/* Action Button: Entra Nella Mostra */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 shadow-xl shadow-amber-400/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMASUKI PAMERAN...' : 'MASUKI PAMERAN SENI (ENTER)'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Pengalaman galeri seni scroll menyamping (Side-Scrolling Walk)
          </span>
        </div>
      </motion.div>
    </div>
  );
};
