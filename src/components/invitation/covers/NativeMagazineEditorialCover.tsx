'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface NativeMagazineEditorialCoverProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme?: any;
  fonts?: any;
  designSchema?: any;
}

export const NativeMagazineEditorialCover: React.FC<NativeMagazineEditorialCoverProps> = ({
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
      isLight ? 'bg-[#F9F7F2]' : 'bg-[#08090C]'
    }`}>
      {/* Background Cover Shoot with High Contrast */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter contrast-110 opacity-30 transform scale-100"
        style={{
          backgroundImage: `url(${invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />
      <div className={`absolute inset-0 pointer-events-none ${
        isLight
          ? 'bg-gradient-to-b from-[#F9F7F2]/90 via-[#F9F7F2]/40 to-[#F9F7F2]/95'
          : 'bg-gradient-to-b from-[#08090C]/90 via-[#08090C]/50 to-[#08090C]/95'
      }`} />

      {/* Main Magazine Cover Container */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 1.05 : 1,
          y: isOpening ? -20 : 0,
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-3xl border shadow-2xl relative z-10 flex flex-col justify-between space-y-6 ${
          isLight
            ? 'bg-white/95 border-stone-200 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
            : 'bg-[#0e1117]/95 border-white/15 text-white shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
        }`}
      >
        {/* Editorial Masthead Header */}
        <div className="border-b pb-4 space-y-2 text-center">
          <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.3em] opacity-60">
            <span>VOL. XII • SPECIAL ISSUE</span>
            <span>{weddingDateStr}</span>
            <span>EXCLUSIVE</span>
          </div>

          <h1 
            className={`text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none pt-1 ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
          >
            WEDDORA
          </h1>
          <span className="text-[10px] font-mono tracking-[0.35em] text-amber-500 uppercase block font-bold">
            THE WEDDING ISSUE • EDITION 2026
          </span>
        </div>

        {/* Center Magazine Headlines */}
        <div className="space-y-4 py-2 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold block">
              COVER STORY &amp; CELEBRATION
            </span>
            <h2 
              className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-tight leading-snug ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              {groomClean} &amp; {brideClean}
            </h2>
            <p className={`text-xs italic leading-relaxed font-serif ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              &ldquo;An extraordinary union of eternal love, timeless promises, and a grand chapter of life.&rdquo;
            </p>
          </div>

          {/* Magazine Side-Teasers */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-1 font-mono ${
            isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/50 border-white/10'
          }`}>
            <div className="flex items-center justify-between text-[9px] text-amber-500 uppercase font-bold">
              <span>SPECIAL VIP ACCESS</span>
              <span>COMPLIMENTARY COPY</span>
            </div>
            <p className={`text-[11px] font-sans ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              Didedikasikan khusus untuk Pembaca Kehormatan:
            </p>
            <h4 className="text-sm font-bold text-amber-400 font-serif">
              {guestName}
            </h4>
          </div>
        </div>

        {/* Bottom Barcode & Action Button */}
        <div className="space-y-4 pt-2">
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className={`w-full py-3.5 sm:py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-lg ${
              isLight
                ? 'bg-slate-950 text-white hover:bg-slate-800'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-slate-950 font-black hover:from-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isOpening ? 'MEMBUKA EDISI...' : 'READ ISSUE • BUKA MAJALAH'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Magazine Barcode Line */}
          <div className="flex items-center justify-between opacity-60 border-t border-dashed border-stone-300 dark:border-white/20 pt-3">
            <div className="h-6 w-32 bg-[repeating-linear-gradient(90deg,#888,#888_2px,transparent_2px,transparent_4px)]" />
            <span className="text-[8px] font-mono tracking-widest uppercase">
              ISSN-2026-VIP-{guestName.replace(/\s+/g, '').slice(0, 6).toUpperCase()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
