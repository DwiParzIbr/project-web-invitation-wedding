'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Film, Mail, Gift, 
  Users, Volume2, VolumeX, Sparkles, X, ExternalLink, Heart, Check, Copy,
  Send, Compass, ChevronRight, RotateCcw, Train
} from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface IsometricMiniWorldLayoutProps {
  invitation: any;
  guestName: string;
  theme: any;
  fonts: any;
  isPlayingMusic?: boolean;
  toggleMusic?: () => void;
  rsvpsList: any[];
  onRsvpSubmit: (e: React.FormEvent) => void;
  rsvpName: string;
  setRsvpName: (name: string) => void;
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'MAYBE';
  setRsvpStatus: (status: 'ATTENDING' | 'DECLINED' | 'MAYBE') => void;
  rsvpCount: number;
  setRsvpCount: (count: number) => void;
  rsvpMessage: string;
  setRsvpMessage: (msg: string) => void;
  isSubmittingRsvp: boolean;
  rsvpSuccess: boolean;
  youtubeEmbedUrl: string | null;
  activeLightboxIndex: number | null;
  setActiveLightboxIndex: (idx: number | null) => void;
}

type JourneyStationId = 'first_met' | 'ceremony' | 'reception' | 'cinema' | 'rsvp' | 'gifts' | 'wedding_day' | null;

export const IsometricMiniWorldLayout: React.FC<IsometricMiniWorldLayoutProps> = ({
  invitation,
  guestName,
  theme,
  fonts,
  isPlayingMusic,
  toggleMusic,
  rsvpsList,
  onRsvpSubmit,
  rsvpName,
  setRsvpName,
  rsvpStatus,
  setRsvpStatus,
  rsvpCount,
  setRsvpCount,
  rsvpMessage,
  setRsvpMessage,
  isSubmittingRsvp,
  rsvpSuccess,
  youtubeEmbedUrl,
  setActiveLightboxIndex,
}) => {
  const isLight = isLightTheme(theme);
  // Selected station showing popup information
  const [activeStation, setActiveStation] = useState<JourneyStationId>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const safeParseJSON = (data: any, fallback: any) => {
    if (!data) return fallback;
    let parsed = data;
    try {
      while (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return parsed || fallback;
    } catch {
      return fallback;
    }
  };

  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, []);
  const eventsList = invitation.events || [];
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, [
    { bankName: 'Bank Central Asia (BCA)', accountNumber: '8820491823', accountHolder: 'Andi Pratama' },
    { bankName: 'Bank Mandiri', accountNumber: '1370019284712', accountHolder: 'Sinta Nurhaliza' },
  ]);

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBank(accountNumber);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // 7 Stations along the Glowing Love Line Map
  const journeyStations = [
    {
      id: 'first_met' as JourneyStationId,
      title: 'FIRST MET',
      subtitle: 'Date: April 14, 2021',
      tag: 'Campus Library',
      photo: invitation.groomPhoto || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500',
      side: 'left', // Polaroid on left, text on right
      rotation: '-rotate-3',
      yPos: 110,
    },
    {
      id: 'ceremony' as JourneyStationId,
      title: 'THE VOWS (AKAD)',
      subtitle: `Date: ${weddingDateStr}`,
      tag: eventsList[0]?.venueName || 'Holy Chapel',
      photo: invitation.bridePhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
      side: 'right', // Polaroid on right, text on left
      rotation: 'rotate-2',
      yPos: 330,
    },
    {
      id: 'reception' as JourneyStationId,
      title: 'THE CELEBRATION',
      subtitle: eventsList[1] ? `Time: ${eventsList[1].startTime} WIB` : 'Evening Banquet',
      tag: eventsList[1]?.venueName || 'Grand Ballroom',
      photo: galleryList[0] || 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500',
      side: 'left',
      rotation: '-rotate-2',
      yPos: 550,
    },
    {
      id: 'cinema' as JourneyStationId,
      title: 'SWEET MEMORIES',
      subtitle: 'Prewedding Reel & Photos',
      tag: 'Starlight Garden',
      photo: galleryList[1] || 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500',
      side: 'right',
      rotation: 'rotate-3',
      yPos: 770,
    },
    {
      id: 'rsvp' as JourneyStationId,
      title: 'GUESTBOOK & RSVP',
      subtitle: 'Confirmation & Warm Wishes',
      tag: 'Welcome Lounge',
      photo: galleryList[2] || 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=500',
      side: 'left',
      rotation: '-rotate-2',
      yPos: 990,
    },
    {
      id: 'gifts' as JourneyStationId,
      title: 'LOVE & BLESSINGS',
      subtitle: 'Cashless Gift & Angpau',
      tag: 'Gift Pavilion',
      photo: galleryList[3] || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500',
      side: 'right',
      rotation: 'rotate-2',
      yPos: 1210,
    },
    {
      id: 'wedding_day' as JourneyStationId,
      title: 'WEDDING DAY',
      subtitle: `Date: ${weddingDateStr.toUpperCase()}`,
      tag: 'Forever After',
      photo: invitation.coverPhoto || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500',
      side: 'right',
      rotation: 'rotate-2',
      yPos: 1430,
      isFinale: true, // Uses the large glowing heart map pin!
    },
  ];

  return (
    <div className={`relative z-10 w-full min-h-screen select-none flex flex-col items-center font-sans overflow-x-hidden ${
      isLight ? 'bg-[#FAF8F5] text-slate-800' : 'bg-[#0e131d] text-white'
    }`}>
      {/* Ambient Background with Soft Bokeh */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${
        isLight
          ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#EDE8DF]'
          : 'bg-gradient-to-b from-[#0a0e17] via-[#111723] to-[#182030]'
      }`} />
      
      {/* Glowing Bokeh Orbs in Background */}
      <div className={`fixed top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl pointer-events-none z-0 ${
        isLight ? 'bg-rose-300/20' : 'bg-rose-500/10'
      }`} />
      <div className={`fixed top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none z-0 ${
        isLight ? 'bg-amber-300/20' : 'bg-amber-500/10'
      }`} />

      {/* Floating Header Audio Control */}
      <div className="fixed top-4 right-4 z-40">
        {toggleMusic && (
          <button
            onClick={toggleMusic}
            className={`w-9 h-9 rounded-full border flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer backdrop-blur-md ${
              isLight
                ? 'bg-white/90 text-rose-500 border-rose-300 shadow-md'
                : 'bg-slate-900/80 text-rose-300 border-rose-300/40 shadow-[0_0_15px_rgba(251,113,133,0.3)]'
            }`}
            title={isPlayingMusic ? 'Mute Musik' : 'Putar Musik'}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 text-rose-500 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        )}
      </div>

      {/* ========================================================
          TOP HEADER: "OUR JOURNEY • SARAH & MARK" (ROSE GOLD)
          ======================================================== */}
      <ScrollReveal direction="fade">
        <header className="relative z-10 pt-10 pb-4 text-center px-4">
          <h1 
            className={`text-2xl sm:text-3xl font-light tracking-[0.25em] uppercase leading-tight drop-shadow-md ${
              isLight ? 'text-rose-900' : 'text-[#e8a598]'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
          >
            OUR JOURNEY
          </h1>
          <h2 
            className={`text-lg sm:text-xl font-medium tracking-[0.15em] uppercase pt-1 drop-shadow ${
              isLight ? 'text-rose-800' : 'text-[#f2c4ba]'
            }`}
            style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
          >
            {groomName} & {brideName}
          </h2>

          {/* Route Line Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-[10px] font-mono tracking-widest text-rose-500 uppercase mt-3 shadow-inner">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>LOVE LINE</span>
          </div>

          <p className={`text-[10px] pt-2 font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Ketuk foto atau stasiun untuk membuka informasi rincian acara
          </p>
        </header>
      </ScrollReveal>

      {/* ========================================================
          MAP CANVAS: GLOWING ROSE-GOLD NEON TRANSIT LINE
          ======================================================== */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 pb-28">
        <div className="relative w-full h-[1560px]">

          {/* SVG MAP BACKGROUND: TRANSIT NETWORK LINES & THE GLOWING LOVE LINE */}
          <svg 
            viewBox="0 0 380 1560" 
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              {/* Neon Love Line Glowing Filter */}
              <filter id="neonLoveGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="14" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Glowing Rose Gradient */}
              <linearGradient id="roseLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="30%" stopColor="#fb7185" />
                <stop offset="60%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
            </defs>

            {/* Faint Background Transit Lines (Subtle Metro Subway Grid) */}
            <path d="M 60,60 L 60,1500" stroke="#ffffff10" strokeWidth="1.5" />
            <path d="M 320,60 L 320,1500" stroke="#ffffff10" strokeWidth="1.5" />
            <path d="M 60,330 L 320,330" stroke="#ffffff10" strokeWidth="1.5" />
            <path d="M 60,770 L 320,770" stroke="#ffffff10" strokeWidth="1.5" />
            <path d="M 60,1210 L 320,1210" stroke="#ffffff10" strokeWidth="1.5" />
            <path d="M 60,200 Q 190,400 320,600" fill="none" stroke="#ffffff0a" strokeWidth="2" strokeDasharray="4 6" />
            <path d="M 320,700 Q 190,900 60,1100" fill="none" stroke="#ffffff0a" strokeWidth="2" strokeDasharray="4 6" />

            {/* Faint Subway Icons & Hearts in Background */}
            <circle cx="60" cy="200" r="4" fill="#ffffff18" />
            <circle cx="320" cy="450" r="4" fill="#ffffff18" />
            <circle cx="60" cy="680" r="4" fill="#ffffff18" />
            <circle cx="320" cy="1000" r="4" fill="#ffffff18" />
            <circle cx="60" cy="1350" r="4" fill="#ffffff18" />

            {/* THE GLOWING ROSE-GOLD NEON LOVE LINE (MAIN CONTINUOUS ROUTE) */}
            {/* Outer Deep Glow */}
            <path 
              d="M 190,110 
                 C 190,220 220,240 220,330 
                 C 220,440 180,460 180,550 
                 C 180,660 220,680 220,770 
                 C 220,880 180,900 180,990 
                 C 180,1100 220,1120 220,1210 
                 C 220,1320 200,1360 200,1430" 
              fill="none" 
              stroke="#fb7185" 
              strokeWidth="12" 
              strokeLinecap="round"
              opacity="0.4"
              filter="url(#neonLoveGlow)"
            />

            {/* Main Solid Tube Pipe Line */}
            <path 
              d="M 190,110 
                 C 190,220 220,240 220,330 
                 C 220,440 180,460 180,550 
                 C 180,660 220,680 220,770 
                 C 220,880 180,900 180,990 
                 C 180,1100 220,1120 220,1210 
                 C 220,1320 200,1360 200,1430" 
              fill="none" 
              stroke="url(#roseLineGrad)" 
              strokeWidth="6" 
              strokeLinecap="round"
            />

            {/* Inner White Highlight Shine */}
            <path 
              d="M 190,110 
                 C 190,220 220,240 220,330 
                 C 220,440 180,460 180,550 
                 C 180,660 220,680 220,770 
                 C 220,880 180,900 180,990 
                 C 180,1100 220,1120 220,1210 
                 C 220,1320 200,1360 200,1430" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="2" 
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>

          {/* ========================================================
              THE 7 STATIONS (NODES + POLAROIDS + LABELS)
              ======================================================== */}
          {journeyStations.map((st, idx) => {
            // Node coordinates on the path:
            const isLeft = st.side === 'left';
            const nodeX = idx % 2 === 0 ? 185 : 225; // S-curve node position in pixels
            const nodeY = st.yPos;

            return (
              <div 
                key={st.id}
                style={{ top: `${nodeY - 50}px` }}
                className="absolute inset-x-0 h-32 flex items-center justify-between"
              >
                {/* 1. LEFT COLUMN: POLAROID OR TEXT */}
                <div className="w-[145px] sm:w-[155px] flex items-center justify-center">
                  <ScrollReveal direction="left" distance="25px" duration={700}>
                    {isLeft ? (
                      /* Polaroid Photo Snapshot on Left */
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveStation(st.id)}
                        className={`bg-white p-2 pb-3 rounded-sm shadow-[0_12px_25px_rgba(0,0,0,0.8)] border border-slate-200 cursor-pointer ${st.rotation} transition-transform group`}
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-100 overflow-hidden">
                          <img src={st.photo} alt={st.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-800 font-serif block text-center pt-1.5 font-medium tracking-tight">
                          {st.tag}
                        </span>
                      </motion.div>
                    ) : (
                      /* Text Information on Left */
                      <div 
                        onClick={() => setActiveStation(st.id)}
                        className="text-right space-y-0.5 cursor-pointer pr-2 group"
                      >
                        <h3 className={`text-xs sm:text-sm font-bold tracking-wider leading-tight transition-colors ${
                          isLight ? 'text-rose-900 group-hover:text-rose-700' : 'text-[#f2c4ba] group-hover:text-white'
                        }`}>
                          {st.title}
                        </h3>
                        <span className={`text-[10px] font-mono block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {st.subtitle}
                        </span>
                      </div>
                    )}
                  </ScrollReveal>
                </div>

                {/* 2. CENTER: GLOWING STATION NODE (CONCENTRIC RING OR HEART PIN) */}
                <div 
                  onClick={() => setActiveStation(st.id)}
                  className="relative z-20 flex items-center justify-center cursor-pointer group"
                >
                  <ScrollReveal direction="zoom" duration={600} delay={100}>
                    {st.isFinale ? (
                      /* FINAL STATION: BIG GLOWING HEART TEARDROP MAP PIN! */
                      <motion.div
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative flex flex-col items-center drop-shadow-[0_0_20px_rgba(251,113,133,0.9)]"
                      >
                        {/* Teardrop Pin Body */}
                        <div className="w-12 h-12 rounded-full rounded-br-none -rotate-45 bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-400 border-2 border-white flex items-center justify-center shadow-2xl">
                          <Heart className="w-6 h-6 text-white fill-white rotate-45" />
                        </div>
                      </motion.div>
                    ) : (
                      /* REGULAR STATION: GLOWING DOUBLE CONCENTRIC RING */
                      <motion.div
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative w-8 h-8 rounded-full bg-[#0d1422] border-2 border-[#f472b6] shadow-[0_0_15px_#f472b6] flex items-center justify-center group-hover:border-white transition-colors"
                      >
                        <span className="w-3 h-3 rounded-full bg-[#fb7185] shadow-inner" />
                      </motion.div>
                    )}
                  </ScrollReveal>
                </div>

                {/* 3. RIGHT COLUMN: TEXT OR POLAROID */}
                <div className="w-[145px] sm:w-[155px] flex items-center justify-center">
                  <ScrollReveal direction="right" distance="25px" duration={700}>
                    {!isLeft ? (
                      /* Polaroid Photo Snapshot on Right */
                      <motion.div
                        whileHover={{ scale: 1.08, rotate: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveStation(st.id)}
                        className={`bg-white p-2 pb-3 rounded-sm shadow-[0_12px_25px_rgba(0,0,0,0.8)] border border-slate-200 cursor-pointer ${st.rotation} transition-transform group`}
                      >
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-stone-100 overflow-hidden">
                          <img src={st.photo} alt={st.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] text-slate-800 font-serif block text-center pt-1.5 font-medium tracking-tight">
                          {st.tag}
                        </span>
                      </motion.div>
                    ) : (
                      /* Text Information on Right */
                      <div 
                        onClick={() => setActiveStation(st.id)}
                        className="text-left space-y-0.5 cursor-pointer pl-2 group"
                      >
                        <h3 className={`text-xs sm:text-sm font-bold tracking-wider leading-tight transition-colors ${
                          isLight ? 'text-rose-900 group-hover:text-rose-700' : 'text-[#f2c4ba] group-hover:text-white'
                        }`}>
                          {st.title}
                        </h3>
                        <span className={`text-[10px] font-mono block ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                          {st.subtitle}
                        </span>
                      </div>
                    )}
                  </ScrollReveal>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================
          POPUP INFORMATION MODAL KETIKA PIN / POLAROID DIKLIK
          ======================================================== */}
      <AnimatePresence>
        {activeStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-md border rounded-3xl overflow-hidden p-6 text-left space-y-4 max-h-[88vh] overflow-y-auto no-scrollbar backdrop-blur-xl ${
                isLight
                  ? 'bg-white/95 border-rose-300 shadow-[0_25px_60px_rgba(0,0,0,0.15)] text-slate-800'
                  : 'bg-[#0f172a]/95 border-[#f472b6]/60 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveStation(null)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* POPUP 1: FIRST MET / PROFIL MEMPELAI */}
              {activeStation === 'first_met' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block font-mono">
                      💖 CHAPTER I • FIRST MET
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Profil Kedua Mempelai
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                      <div className="w-18 h-18 rounded-full mx-auto overflow-hidden border-2 border-amber-400 shadow-md">
                        <img src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'} alt="Groom" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif">{invitation.groomName}</h4>
                        <span className="text-[10px] text-amber-400 block font-mono">Mempelai Pria</span>
                        <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.groomParents}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                      <div className="w-18 h-18 rounded-full mx-auto overflow-hidden border-2 border-rose-400 shadow-md">
                        <img src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'} alt="Bride" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-serif">{invitation.brideName}</h4>
                        <span className="text-[10px] text-rose-400 block font-mono">Mempelai Wanita</span>
                        <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.brideParents}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-rose-200/90 font-serif italic text-center pt-1 leading-relaxed">
                    "{invitation.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri agar kamu merasa tenteram bersamanya.'}"
                  </p>
                </div>
              )}

              {/* POPUP 2: THE VOWS / AKAD NIKAH */}
              {activeStation === 'ceremony' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold block font-mono">
                      🏛️ CHAPTER II • THE VOWS
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Akad Nikah / Janji Suci
                    </h3>
                  </div>

                  {eventsList[0] ? (
                    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-sky-400 font-bold">{eventsList[0].title || 'Akad Nikah'}</span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sky-400" />
                          {eventsList[0].startTime} - {eventsList[0].endTime} WIB
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                        {eventsList[0].venueName}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{eventsList[0].address}</p>

                      {eventsList[0].googleMapsUrl && (
                        <div className="pt-2">
                          <a
                            href={eventsList[0].googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-md"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka Petunjuk Arah Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Jadwal acara akad belum diatur.</p>
                  )}
                </div>
              )}

              {/* POPUP 3: THE CELEBRATION / RESEPSI */}
              {activeStation === 'reception' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block font-mono">
                      🎪 CHAPTER III • THE CELEBRATION
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Resepsi Pernikahan & Jamuan
                    </h3>
                  </div>

                  {eventsList[1] || eventsList[0] ? (
                    <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">{(eventsList[1] || eventsList[0]).title || 'Resepsi Pernikahan'}</span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {(eventsList[1] || eventsList[0]).startTime} - {(eventsList[1] || eventsList[0]).endTime} WIB
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        {(eventsList[1] || eventsList[0]).venueName}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{(eventsList[1] || eventsList[0]).address}</p>

                      {(eventsList[1] || eventsList[0]).googleMapsUrl && (
                        <div className="pt-2">
                          <a
                            href={(eventsList[1] || eventsList[0]).googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 transition-all shadow-md"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Buka Rute Venue Google Maps
                          </a>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}

              {/* POPUP 4: SWEET MEMORIES / GALERI & REEL */}
              {activeStation === 'cinema' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block font-mono">
                      🎬 CHAPTER IV • SWEET MEMORIES
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Video Prewedding & Galeri Foto
                    </h3>
                  </div>

                  {youtubeEmbedUrl && (
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black">
                      <iframe
                        src={youtubeEmbedUrl}
                        title="Wedding Cinema"
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    {galleryList.slice(0, 6).map((photo, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveLightboxIndex(idx)}
                        className="aspect-square rounded-xl overflow-hidden border border-white/15 cursor-pointer group shadow-sm"
                      >
                        <img src={photo} alt={`Photo ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POPUP 5: GUESTBOOK & RSVP */}
              {activeStation === 'rsvp' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block font-mono">
                      📮 CHAPTER V • GUESTBOOK & RSVP
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Konfirmasi Kehadiran Tamu
                    </h3>
                  </div>

                  <form onSubmit={onRsvpSubmit} className="space-y-3 font-sans">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">Kehadiran</label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('ATTENDING')}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            rsvpStatus === 'ATTENDING' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-400 border border-white/10'
                          }`}
                        >
                          ✓ Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('DECLINED')}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            rsvpStatus === 'DECLINED' ? 'bg-rose-700 text-white font-black' : 'bg-slate-950 text-slate-400 border border-white/10'
                          }`}
                        >
                          ✕ Tidak Hadir
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">Doa & Ucapan</label>
                      <textarea
                        rows={3}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Tuliskan ucapan dan doa restu terbaik..."
                        className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg cursor-pointer"
                    >
                      {isSubmittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi Kehadiran'}
                    </button>

                    {rsvpSuccess && (
                      <p className="text-xs text-emerald-400 text-center font-bold">
                        ✓ Terima kasih atas doa dan konfirmasinya!
                      </p>
                    )}
                  </form>
                </div>
              )}

              {/* POPUP 6: LOVE & BLESSINGS / KADO DIGITAL */}
              {activeStation === 'gifts' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-yellow-400 font-bold block font-mono">
                      🎁 CHAPTER VI • LOVE & BLESSINGS
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Amplop Digital & Kado Fisik
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat menggunakan rekening di bawah ini:
                  </p>

                  <div className="space-y-2.5">
                    {digitalGiftsList.map((g: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-yellow-400 uppercase font-mono">{g.bankName}</span>
                          <p className="text-sm font-mono font-bold text-white tracking-wider">{g.accountNumber}</p>
                          <p className="text-[10px] text-slate-400">a.n. {g.accountHolder || g.accountName}</p>
                        </div>
                        <button
                          onClick={() => handleCopyAccount(g.accountNumber)}
                          className="px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-400/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          {copiedBank === g.accountNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedBank === g.accountNumber ? 'Tersalin' : 'Salin'}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POPUP 7: WEDDING DAY & UNGKAPAN TERIMA KASIH */}
              {activeStation === 'wedding_day' && (
                <div className="space-y-4 pt-1 text-center">
                  <div className="w-16 h-16 rounded-full mx-auto bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-rose-300">
                    <Heart className="w-8 h-8 text-rose-400 animate-pulse fill-rose-400" />
                  </div>

                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-rose-400 font-bold block font-mono">
                      💖 CHAPTER VII • WEDDING DAY
                    </span>
                    <h3 
                      className="text-xl font-bold text-white pt-1"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Ungkapan Terima Kasih
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-serif italic max-w-sm mx-auto">
                    "Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu untuk lembaran hidup baru kami."
                  </p>

                  <div className="pt-2 font-serif">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 block font-mono">
                      Kami Yang Berbahagia,
                    </span>
                    <h4 className="text-base font-bold text-white pt-0.5">
                      {groomName} & {brideName}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">
                      Beserta Segenap Keluarga Besar
                    </span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveStation(null)}
                      className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest cursor-pointer transition-all"
                    >
                      Tutup Informasi
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
