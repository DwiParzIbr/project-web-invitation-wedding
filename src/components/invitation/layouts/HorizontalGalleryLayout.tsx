'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, Volume2, VolumeX, MapPin, Calendar, Clock, 
  Sparkles, ExternalLink, ChevronRight, ChevronLeft, Award, Eye 
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

  const wings = [
    { id: 0, title: 'Entrance', label: 'Vestibule' },
    { id: 1, title: 'Wing A', label: 'Portraits' },
    { id: 2, title: 'Wing B', label: 'Rendezvous' },
    { id: 3, title: 'Wing C', label: 'Sacred Hall' },
    { id: 4, title: 'Wing D', label: 'Archives' },
    { id: 5, title: 'Wing E', label: 'Guestbook' },
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
