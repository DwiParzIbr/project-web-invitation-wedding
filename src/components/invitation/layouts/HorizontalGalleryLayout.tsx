'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, Volume2, VolumeX, MapPin, Calendar, Clock, 
  Sparkles, ExternalLink, ChevronRight, ChevronLeft, Award, Eye,
  Heart, RotateCcw
} from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface HorizontalGalleryLayoutProps {
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

export const HorizontalGalleryLayout: React.FC<HorizontalGalleryLayoutProps> = ({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isLight = isLightTheme(theme);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeWing, setActiveWing] = useState(0);

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
  const loveStoryList = safeParseJSON(invitation.loveStory, []);
  const eventsList = invitation.events || [];

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const weddingDateStr = new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const designSchema = typeof invitation.designConfig === 'object' && invitation.designConfig !== null
    ? invitation.designConfig
    : safeParseJSON(invitation.designConfig, {});
  const showTurutMengundang = designSchema?.turutMengundang?.enabled !== false;
  const turutConfig = designSchema?.turutMengundang;
  let turutItems: Array<{ name: string; role?: string }> = turutConfig?.items || [];
  if (turutItems.length === 0 && turutConfig?.rawText && turutConfig.rawText.trim()) {
    turutItems = turutConfig.rawText
      .split('\n')
      .map((line: string) => line.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter(Boolean)
      .map((name: string) => ({ name }));
  }
  if (turutItems.length === 0) {
    turutItems = [
      { name: 'Bapak Gubernur Bengkulu', role: 'Tokoh Kehormatan' },
      { name: 'Bapak Bupati', role: 'Tokoh Kehormatan' },
      { name: 'Keluarga Besar Mempelai Pria' },
      { name: 'Keluarga Besar Mempelai Wanita' },
    ];
  }

  const wings = [
    { id: 0, title: 'Entrance', label: 'Vestibule' },
    { id: 1, title: 'Wing A', label: 'Portraits' },
    { id: 2, title: 'Wing B', label: 'Rendezvous' },
    { id: 3, title: 'Wing C', label: 'Sacred Hall' },
    { id: 4, title: 'Wing D', label: 'Archives' },
    { id: 5, title: 'Wing E', label: 'Guestbook' },
    ...(showTurutMengundang ? [{ id: 6, title: 'Wing F', label: 'Honored' }] : []),
    { id: showTurutMengundang ? 7 : 6, title: showTurutMengundang ? 'Wing G' : 'Wing F', label: 'Gratitude' },
  ];

  // Convert desktop vertical mouse wheel to horizontal scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // If user is scrolling, translate vertical delta to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Track horizontal scroll progress & active wing
  const handleScroll = () => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const current = el.scrollLeft;
    const progress = maxScroll > 0 ? (current / maxScroll) * 100 : 0;
    setScrollProgress(progress);

    const wingIndex = Math.min(wings.length - 1, Math.floor((current / (maxScroll || 1)) * wings.length));
    setActiveWing(wingIndex);
  };

  const scrollToWing = (index: number) => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const target = (index / (wings.length - 1)) * maxScroll;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <div className={`relative z-10 w-full h-[100dvh] font-serif select-none overflow-hidden flex flex-col justify-between ${
      isLight ? 'bg-[#F8F9FA] text-slate-800' : 'bg-[#121417] text-slate-100'
    }`}>
      {/* Museum Ambient Wall Texture & Spotlights Background */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-10' : 'opacity-25'}`}
        style={{
          backgroundImage: isLight 
            ? 'radial-gradient(#000000 0.75px, transparent 0.75px)' 
            : 'radial-gradient(#ffffff 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px',
        }}
      />
      {/* Polished Parquet Gallery Floor Reflection */}
      <div className={`absolute bottom-0 inset-x-0 h-28 pointer-events-none z-0 ${
        isLight
          ? 'bg-gradient-to-t from-stone-200/60 via-stone-100/30 to-transparent'
          : 'bg-gradient-to-t from-black/80 via-black/40 to-transparent'
      }`} />

      {/* ========================================================
          TOP GALLERY MASTHEAD & VERNISSAGE BANNER
          ======================================================== */}
      <header className={`relative z-20 w-full px-6 py-3 border-b flex items-center justify-between backdrop-blur-md shrink-0 ${
        isLight
          ? 'border-stone-200 bg-white/90 text-slate-800'
          : 'border-white/10 bg-black/40 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse" />
          <div className="text-left">
            <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500 font-sans font-bold block">
              MUSEUM D'AMOUR • PRIVATE VERNISSAGE
            </span>
            <span className={`text-xs font-bold tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {groomName} & {brideName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`hidden sm:flex items-center gap-2 text-[10px] font-mono border-x px-3 ${
            isLight ? 'text-slate-500 border-stone-200' : 'text-slate-400 border-white/10'
          }`}>
            <span>EXHIBITION CATALOGUE #2026</span>
          </div>
          {toggleMusic && (
            <button
              onClick={toggleMusic}
              className={`w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition-transform shadow cursor-pointer ${
                isLight
                  ? 'bg-white text-gold-600 border-amber-300'
                  : 'bg-slate-900/80 border-gold-500/30 text-gold-400'
              }`}
              title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          )}
        </div>
      </header>

      {/* ========================================================
          HORIZONTAL EXHIBITION WALKWAY (CONTINUOUS SIDE-SCROLLING)
          ======================================================== */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-10 w-full flex-1 flex items-center overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar px-6 sm:px-12 gap-8 sm:gap-16 cursor-grab active:cursor-grabbing"
      >
        {/* ========================================================
            ZONE 0: ATRIUM ENTRANCE (GRAND HERO & WELCOME PLAQUE)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="shrink-0 w-[90vw] sm:w-[460px] h-[82vh] snap-center flex flex-col justify-center text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-500 font-sans font-bold block">
              GRAND ATRIUM • EXHIBITION OPENING
            </span>
            <h1 
              className={`text-4xl sm:text-5xl font-black uppercase tracking-tight drop-shadow-md leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              The Union
            </h1>
            <p className="text-sm text-gold-500 italic">
              "A Retrospective of Two Souls Becoming One Masterpiece"
            </p>
          </div>

          {/* Curatorial Guest Pass Plaque */}
          <div className={`p-5 rounded-xl backdrop-blur-md shadow-2xl space-y-2 border ${
            isLight
              ? 'bg-white/95 border-amber-400/40 text-slate-800 shadow-[0_15px_35px_rgba(0,0,0,0.06)]'
              : 'bg-slate-900/90 border-gold-500/30'
          }`}>
            <span className={`text-[9px] uppercase tracking-widest block font-sans font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              VERNISSAGE GUEST ADMISSION
            </span>
            <h3 className={`text-base font-bold ${isLight ? 'text-amber-900' : 'text-white'}`}>{guestName}</h3>
            <p className={`text-xs leading-relaxed font-sans pt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Anda dengan penuh hormat diundang untuk melangkahkan kaki menyusuri lorong kenangan dan merayakan pengikatan janji suci pernikahan kami.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gold-500 font-sans animate-pulse justify-center">
            <span>Scroll mouse atau geser ke kanan untuk melihat karya ➔</span>
          </div>
        </motion.section>

        {/* ========================================================
            ZONE 1: WING A - THE PORTRAITURE (GROOM & BRIDE FRAMED)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-[92vw] sm:w-[720px] h-[82vh] snap-center flex flex-col justify-center"
        >
          <div className="text-left mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">WING A</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">The Portraiture</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 items-center">
            {/* Groom Masterpiece Frame */}
            <div className="space-y-3">
              <div className="relative p-2.5 bg-gradient-to-tr from-amber-700 via-amber-200 to-amber-900 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
                {/* Spotlight Beam Simulation */}
                <div className="absolute -top-12 inset-x-0 h-16 bg-radial from-amber-200/20 to-transparent pointer-events-none blur-sm" />
                <div className="aspect-[3/4] rounded overflow-hidden border-2 border-black bg-stone-900">
                  <img 
                    src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'} 
                    alt="Groom Portrait" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                </div>
              </div>

              {/* Museum Brass Placard */}
              <div className="p-3 bg-gradient-to-r from-amber-950/90 via-black to-amber-950/90 border border-gold-500/40 rounded shadow-md text-left space-y-0.5">
                <h4 className="text-xs font-bold text-amber-200 font-serif leading-tight">{invitation.groomName}</h4>
                <p className="text-[9px] text-gold-400/90 font-mono">The Groom • Oil & Love on Canvas</p>
                <p className="text-[9px] text-slate-300 font-sans pt-0.5 leading-snug">Putra dari: {invitation.groomParents}</p>
              </div>
            </div>

            {/* Bride Masterpiece Frame */}
            <div className="space-y-3">
              <div className="relative p-2.5 bg-gradient-to-tr from-rose-700 via-amber-200 to-rose-900 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
                {/* Spotlight Beam Simulation */}
                <div className="absolute -top-12 inset-x-0 h-16 bg-radial from-rose-200/20 to-transparent pointer-events-none blur-sm" />
                <div className="aspect-[3/4] rounded overflow-hidden border-2 border-black bg-stone-900">
                  <img 
                    src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'} 
                    alt="Bride Portrait" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter contrast-105"
                  />
                </div>
              </div>

              {/* Museum Brass Placard */}
              <div className="p-3 bg-gradient-to-r from-amber-950/90 via-black to-amber-950/90 border border-gold-500/40 rounded shadow-md text-left space-y-0.5">
                <h4 className="text-xs font-bold text-amber-200 font-serif leading-tight">{invitation.brideName}</h4>
                <p className="text-[9px] text-rose-300/90 font-mono">The Bride • Oil & Grace on Canvas</p>
                <p className="text-[9px] text-slate-300 font-sans pt-0.5 leading-snug">Putri dari: {invitation.brideParents}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ========================================================
            ZONE 2: WING B - THE RENDEZVOUS (LOVE STORY EXHIBITS)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-[90vw] sm:w-[680px] h-[82vh] snap-center flex flex-col justify-center"
        >
          <div className="text-left mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">WING B</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">The Rendezvous (Milestones)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {loveStoryList.slice(0, 3).map((item: any, idx: number) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-slate-900/90 border border-gold-500/30 text-left space-y-3 shadow-xl hover:border-gold-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 font-mono text-[10px]">
                    <span className="text-gold-400 font-bold">EXHIBIT #{idx + 1}</span>
                    <span className="text-slate-400">{item.year}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white font-serif">{item.title}</h4>
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[9px] text-gold-400/70 font-mono uppercase">Archive Collection</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ========================================================
            ZONE 3: WING C - THE SACRED HALL (ITINERARY SCHEDULING)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-[90vw] sm:w-[650px] h-[82vh] snap-center flex flex-col justify-center"
        >
          <div className="text-left mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">WING C</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">The Sacred Hall (Schedule)</h2>
          </div>

          <div className="space-y-4">
            {eventsList.map((ev: any, idx: number) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-slate-900/90 border border-gold-500/40 text-left space-y-2 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-gold-300 px-2 py-0.5 rounded bg-gold-400/20">
                      ACT {idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-white">{ev.title}</h3>
                  </div>
                  <span className="text-xs font-mono text-gold-400">{ev.startTime} - {ev.endTime} WIB</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 font-sans">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                    {ev.venueName}
                  </p>
                  <p className="text-slate-400 pl-5.5">{ev.address}</p>
                </div>

                {ev.googleMapsUrl && (
                  <div className="pt-2">
                    <a
                      href={ev.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:underline font-sans font-bold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Petunjuk Arah Galeri (Google Maps)
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* ========================================================
            ZONE 4: WING D - VISUAL ARCHIVES (VIDEO & MASTERPIECE PHOTOS)
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-[92vw] sm:w-[750px] h-[82vh] snap-center flex flex-col justify-center"
        >
          <div className="text-left mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">WING D</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">Visual Archives & Cinema</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Projected Film Display */}
            {youtubeEmbedUrl ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-black">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Exhibition Film"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="w-full aspect-video rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-center p-4">
                <span className="text-xs text-slate-400 font-mono">Cinematography Installation</span>
              </div>
            )}

            {/* Framed Photo Gallery Grid */}
            <div className="grid grid-cols-2 gap-2">
              {galleryList.slice(0, 4).map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gold-500/30 cursor-pointer group shadow-lg"
                >
                  <img 
                    src={photo} 
                    alt={`Archive ${idx}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ========================================================
            ZONE 5: WING E - THE CURATOR'S GUESTBOOK & RSVP
            ======================================================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 w-[88vw] sm:w-[500px] h-[82vh] snap-center flex flex-col justify-center"
        >
          <div className="text-left mb-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">WING E</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">The Vernissage Guestbook</h2>
          </div>

          <form onSubmit={onRsvpSubmit} className="p-6 rounded-2xl bg-slate-900/95 border border-gold-500/40 text-left space-y-3 font-sans shadow-2xl">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">
                Nama Tamu (Guest Registry)
              </label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs rounded-lg bg-slate-950 border border-white/20 text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">
                Konfirmasi Kehadiran
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('ATTENDING')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    rsvpStatus === 'ATTENDING'
                      ? 'bg-gold-400 text-slate-950 shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-white/10'
                  }`}
                >
                  ✓ Hadir di Pameran
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus('DECLINED')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    rsvpStatus === 'DECLINED'
                      ? 'bg-rose-800 text-white shadow-lg'
                      : 'bg-slate-950 text-slate-400 border border-white/10'
                  }`}
                >
                  ✕ Tidak Hadir
                </button>
              </div>
            </div>

            <div>
              <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Pesan Kuratorial / Doa Restu
              </label>
              <textarea
                rows={3}
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                placeholder="Tuliskan ulasan dan ucapan selamat untuk karya cinta kedua mempelai..."
                className={`w-full mt-1 px-3 py-2 text-xs rounded-lg border focus:outline-none focus:border-gold-500 ${
                  isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-slate-950 border-white/20 text-white'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest text-slate-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
            >
              {isSubmittingRsvp ? 'Mencatat...' : 'Tandatangani Buku Tamu'}
            </button>

            {rsvpSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-bold font-serif">
                ✓ Terima kasih, pesan Anda telah tercatat di arsip pameran!
              </p>
            )}
          </form>
        </motion.section>

        {/* ========================================================
            ZONE 6: WING F - SALA DI ONORE (TURUT MENGUNDANG)
            ======================================================== */}
        {showTurutMengundang && (
          <motion.section 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0 w-[88vw] sm:w-[500px] h-[82vh] snap-center flex flex-col justify-center"
          >
            {/* Museum Wing Header */}
            <div className="text-left mb-3">
              <div className="flex items-center justify-between border-b pb-1.5 mb-1.5 border-white/10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">
                  WING F
                </span>
                <span className="text-[10px] font-mono tracking-widest text-gold-400/80 uppercase">
                  SALA DI ONORE
                </span>
              </div>
              <h2 
                className={`text-xl sm:text-2xl font-bold uppercase tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
                style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
              >
                {turutConfig?.title?.trim() || 'Turut Mengundang'}
              </h2>
              <p className={`text-[11px] font-serif italic mt-0.5 leading-relaxed line-clamp-2 ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {turutConfig?.subtitle?.trim() || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga atas kehadiran dan doa restu Bapak/Ibu/Saudara/i:'}
              </p>
            </div>

            {/* Museum Exhibition Benefactors Registry Plaque */}
            <div className={`p-5 rounded-2xl border text-left space-y-3.5 shadow-2xl overflow-y-auto max-h-[62vh] no-scrollbar ${
              isLight 
                ? 'bg-white/95 border-amber-400/40 text-slate-800 shadow-stone-300/40' 
                : 'bg-slate-900/95 border-gold-500/40 text-white shadow-black/80'
            }`}>
              {/* Museum Gallery Badge */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-gold-400 font-bold">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>REGISTRO DEI BENEFATTORI • HONOR ROLL</span>
                </div>
                <span className="text-[9px] font-mono opacity-50 uppercase">
                  Nº {turutItems.length} NOMINATI
                </span>
              </div>

              {/* Patron Cards List */}
              <div className="space-y-2">
                {turutItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                      isLight
                        ? 'bg-stone-50/80 border-stone-200/90 hover:border-gold-500/60 shadow-xs'
                        : 'bg-slate-950/70 border-white/10 hover:border-gold-400/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 font-serif font-bold text-xs ${
                        isLight
                          ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                          : 'bg-gold-500/15 border-gold-400/30 text-gold-400'
                      }`}>
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 
                          className={`text-xs sm:text-sm font-bold tracking-wide leading-snug truncate ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                          style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                        >
                          {item.name}
                        </h4>
                        {item.role && (
                          <span className={`text-[10px] block font-mono uppercase tracking-wider ${
                            isLight ? 'text-amber-800' : 'text-gold-400/90'
                          }`}>
                            {item.role}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold shrink-0 ml-2 ${
                      isLight
                        ? 'bg-amber-100/80 text-amber-900 border border-amber-200'
                        : 'bg-gold-500/10 text-gold-300 border border-gold-500/30'
                    }`}>
                      Onorevole
                    </span>
                  </div>
                ))}
              </div>

              {/* Gallery Curatorial Footer */}
              <div className={`pt-2.5 text-center border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                <span className={`text-[9px] font-mono uppercase tracking-[0.2em] font-bold block ${
                  isLight ? 'text-amber-900' : 'text-gold-400'
                }`}>
                  Beserta Segenap Keluarga Besar Kedua Mempelai
                </span>
                <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest block pt-0.5">
                  Archivio Ufficiale delle Famiglie • Grand Vernissage
                </span>
              </div>
            </div>
          </motion.section>
        )}

        {/* ========================================================
            FINAL ZONE: L'ÉPILOGUE DE L'AMOUR (UNGKAPAN TERIMA KASIH)
            ======================================================== */}
        <motion.section
          className="w-[90vw] sm:w-[500px] shrink-0 h-full flex flex-col justify-center px-4 overflow-y-auto no-scrollbar"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="space-y-4 my-auto">
            <div className="border-b pb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-sans font-bold">
                {showTurutMengundang ? 'WING G' : 'WING F'}
              </span>
              <span className="text-[10px] font-mono opacity-60">SALA DI RINGRAZIAMENTO</span>
            </div>

            {/* Museum Exhibition Epilogue Plaque */}
            <div className={`p-6 sm:p-7 rounded-3xl backdrop-blur-md space-y-5 text-center shadow-2xl relative overflow-hidden border ${
              isLight
                ? 'bg-white/95 border-stone-200 text-slate-800 shadow-stone-200/50'
                : 'bg-gradient-to-b from-[#1c1f24] via-[#16181c] to-[#0f1114] border-white/15 text-white shadow-black/80'
            }`}>
              {/* Subtle ambient spotlight */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: theme.primary || '#C9A66B' }}
              />

              <div className="w-14 h-14 rounded-full mx-auto border-2 border-gold-400/50 bg-gold-500/10 flex items-center justify-center text-gold-400 shadow-lg">
                <Heart className="w-6 h-6 text-rose-400 animate-pulse fill-rose-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-gold-400 font-mono font-bold block">
                  EPILOGUE & WORDS OF GRATITUDE
                </span>
                <h2 
                  className={`text-2xl sm:text-3xl font-bold tracking-wide pt-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                  style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                >
                  Ungkapan Terima Kasih
                </h2>
              </div>

              <p className={`text-xs max-w-sm mx-auto leading-relaxed font-serif italic ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                &ldquo;Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga, atas kehadiran serta doa restu Bapak/Ibu/Saudara/i yang telah mengiringi pameran cinta kami menuju pelabuhan hidup bersama.&rdquo;
              </p>

              {/* Curatorial Sign-off Plaque */}
              <div className={`p-4 rounded-2xl border space-y-1.5 font-serif ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-black/40 border-white/10'
              }`}>
                <span className="text-[10px] uppercase tracking-widest text-gold-500 block font-mono font-semibold">
                  Kami Yang Berbahagia,
                </span>
                <h3 
                  className={`text-lg font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}
                  style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                >
                  {groomName} & {brideName}
                </h3>
                <span className={`text-[11px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Beserta Segenap Keluarga Besar Kedua Mempelai
                </span>
              </div>

              {/* Navigation button back to start */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToWing(0)}
                  className="w-full py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-widest font-bold bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kembali ke Pintu Masuk (Entrance)</span>
                </button>
              </div>

              <span className={`text-[9px] uppercase tracking-[0.25em] font-mono block pt-1 opacity-50 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Exposition Permanente • Museum D&apos;Amour
              </span>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ========================================================
          BOTTOM FLOATING SCRUBBER & WING JUMPER
          ======================================================== */}
      <footer className={`relative z-20 w-full px-6 py-3 border-t backdrop-blur-md flex items-center justify-between shrink-0 ${
        isLight ? 'bg-white/95 border-stone-200 text-slate-800' : 'bg-black/60 border-white/10 text-white'
      }`}>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {wings.map((w, idx) => (
            <button
              key={w.id}
              onClick={() => scrollToWing(idx)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                activeWing === idx
                  ? 'bg-gold-500 text-slate-950 font-bold shadow'
                  : isLight
                  ? 'bg-stone-100 text-slate-600 hover:text-slate-900'
                  : 'bg-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {w.title}: {w.label}
            </button>
          ))}
        </div>

        {/* Linear Progress Bar Indicator */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-slate-400 pl-4">
          <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold-400 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          <span>{Math.round(scrollProgress)}%</span>
        </div>
      </footer>
    </div>
  );
};
