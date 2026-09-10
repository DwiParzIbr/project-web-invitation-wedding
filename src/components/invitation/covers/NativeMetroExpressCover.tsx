'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Train, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeMetroExpressCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeMetroExpressCover: React.FC<NativeMetroExpressCoverProps> = ({
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
      isLight ? 'bg-[#0f172a]' : 'bg-[#080d1a]'
    }`}>
      {/* Neon Metro Track Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/20 blur-[100px] pointer-events-none" />

      {/* Main Metro Transit Gate Pass Card */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.94 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.06 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-[32px] border-2 border-cyan-500/35 bg-gradient-to-b from-[#11192e]/95 via-[#0c1324]/95 to-[#070c17]/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(6,182,212,0.15)] text-white relative z-10 space-y-6 overflow-hidden"
      >
        {/* Top LED Route Display Signboard */}
        <div className="p-2.5 rounded-xl border border-cyan-400/40 bg-black/70 flex items-center justify-between text-[10px] font-mono shadow-inner">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold tracking-wider">
            <Train className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>METRO LOVE EXPRESS</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[9px]">
            SPECIAL RAPID SERVICE
          </span>
        </div>

        {/* 3D Floating IC Smart Card (Metro Love Pass) */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="p-5 rounded-2xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-600/30 via-slate-900 to-amber-500/20 shadow-xl relative overflow-hidden text-left space-y-3"
        >
          {/* Smart Chip & RFID Contactless Wave */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-400 to-yellow-200 border border-amber-500 shadow-sm flex items-center justify-center">
              <div className="w-6 h-4 border border-amber-700/60 rounded-xs" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-300 font-bold">
              TOUCH &amp; GO IC CARD
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono text-cyan-300/80 uppercase tracking-widest block">
              TRANSIT PASSENGER NAMES
            </span>
            <h2 
              className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white"
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              {groomClean} &amp; {brideClean}
            </h2>
            <span className="text-[10px] font-mono text-amber-400 block pt-0.5">
              SERVICE DATE: {weddingDateStr.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Passenger VIP Transit Pass Info */}
        <div className="p-3.5 rounded-xl border border-white/10 bg-black/50 text-left space-y-1">
          <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">
            PEMEGANG TIKET KOMUTER KEHORMATAN:
          </span>
          <h3 className="text-base font-bold text-white font-sans">
            {guestName}
          </h3>
          <span className="text-[9px] font-mono text-slate-400 block">
            AKSES PENUH: 7 STASIUN CINTA • PERON UTAMA VIP
          </span>
        </div>

        {/* Action Button: Tap-in Ticket */}
        <div className="space-y-3 pt-1">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 shadow-xl shadow-cyan-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMVALIDASI TIKET...' : 'TAP-IN TIKET & MASUK PERON'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>

          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
            Sentuh kartu untuk membuka gerbang tiket stasiun metro
          </span>
        </div>
      </motion.div>
    </div>
  );
};
