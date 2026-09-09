'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Plus, Check, Volume2, VolumeX, Calendar, Clock, MapPin, 
  Film, Sparkles, Star, Users, ExternalLink, Ticket, ChevronRight, X 
} from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface CinematicTrailerLayoutProps {
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

export const CinematicTrailerLayout: React.FC<CinematicTrailerLayoutProps> = ({
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
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
  const weddingDate = new Date(invitation.weddingDate);

  // Countdown timer calculation
  useEffect(() => {
    const calculateCountdown = () => {
      const difference = +weddingDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [invitation.weddingDate]);

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`The Wedding of ${groomName} & ${brideName}`);
    const details = encodeURIComponent(
      `Pernikahan ${groomName} & ${brideName}.\nKhusus untuk: ${guestName}\nUndangan Online: ${typeof window !== 'undefined' ? window.location.href : ''}`
    );
    const location = encodeURIComponent(eventsList[0]?.venueName || 'Jakarta, Indonesia');
    
    // Format YYYYMMDDTHHMMSSZ
    const startDate = new Date(weddingDate);
    const endDate = new Date(weddingDate);
    endDate.setHours(endDate.getHours() + 4);
    
    const formatTime = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatTime(startDate)}/${formatTime(endDate)}&details=${details}&location=${location}`;
  };

  const handleAddToCalendar = () => {
    setIsAddedToCalendar(true);
    window.open(getGoogleCalendarUrl(), '_blank');
  };

  const isLight = isLightTheme(theme);
  const primaryAccent = theme?.primary || (isLight ? '#C9A66B' : '#E50914');

  return (
    <div className={`relative z-10 w-full min-h-screen overflow-x-hidden font-sans pb-24 ${
      isLight ? 'bg-[#F5F6F8] text-slate-800' : 'bg-[#111315] text-white'
    }`}>
      {/* ========================================================
          1. BILLBOARD HERO: MOVIE PREMIERE BANNER
          ======================================================== */}
      <div className="relative w-full min-h-[90vh] flex flex-col justify-end p-6 sm:p-12 overflow-hidden">
        {/* Cinematic Backdrop Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter contrast-105 brightness-90 transform scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600'})`,
          }}
        />

        {/* Multi-stage Cinematic Vignette Gradients */}
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-t from-[#F5F6F8] via-[#F5F6F8]/60 to-transparent'
            : 'bg-gradient-to-t from-[#111315] via-[#111315]/60 to-transparent'
        }`} />
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-gradient-to-r from-[#F5F6F8]/90 via-[#F5F6F8]/30 to-transparent'
            : 'bg-gradient-to-r from-[#111315]/90 via-[#111315]/30 to-transparent'
        }`} />
        <div className={`absolute top-0 inset-x-0 h-32 ${
          isLight
            ? 'bg-gradient-to-b from-white/60 to-transparent'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`} />

        {/* Top Floating Mini Bar (Logo & Audio) */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            {/* Authentic Netflix Wordmark SVG */}
            <svg
              viewBox="8 15 104 30"
              className="h-6 sm:h-7 w-auto fill-[#E50914] drop-shadow-md"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Netflix"
            >
              <path d="M23.14 41.97c-1.53.27-3.086.35-4.696.564l-4.91-14.385V43.15l-4.374.6V16.26h4.08l5.582 15.593V16.26h4.32zm8.454-15.646l5.743-.08v4.294l-5.743.08v6.387l7.595-.456v4.133l-11.89.94V16.26h11.89v4.294h-7.595zm23.563-5.77H50.7v19.752l-4.294.054V20.553h-4.455V16.26h13.204zm6.978 5.475h5.877v4.294h-5.877v9.742H57.92V16.26h11.997v4.294h-7.783zm14.76 10.278l7.3.376v4.24L72.6 40.36v-24.1h4.294zm10.923 4.91l4.213.322V16.26h-4.213zm23.026-24.958l-5.448 13.07 5.448 14.41-4.83-.778-3.086-7.944-3.14 7.3-4.616-.564 5.528-12.587-4.992-12.91h4.616l2.818 7.22 3.006-7.22z" />
            </svg>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded text-slate-300 border border-white/10">
              ORIGINAL PRODUCTION
            </span>
          </div>

          {toggleMusic && (
            <button
              onClick={toggleMusic}
              className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg cursor-pointer"
              title={isPlayingMusic ? 'Mute' : 'Play Music'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          )}
        </div>

        {/* Hero Title & Movie Badges */}
        <div className="relative z-10 max-w-2xl space-y-4 text-left">
          {/* Netflix Style Meta Badges */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
            <span className="px-1.5 py-0.5 rounded border border-white/30 text-white/90 text-[10px]">
              RATED: L (LOVE)
            </span>
            <span className="text-slate-300">
              {weddingDate.getFullYear()}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-white font-mono text-[10px]">
              ULTRA HD 4K
            </span>
            <span className="px-1.5 py-0.5 rounded border border-gold-400/50 text-gold-300 text-[10px]">
              LIFETIME DURATION
            </span>
          </div>

          {/* Epic Movie Title */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-400 block font-semibold">
              A Romantic Cinematic Release
            </span>
            <h1 
              className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white drop-shadow-2xl leading-none"
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              {groomName} <span className="text-[#E50914]">&</span> {brideName}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 font-medium italic pt-1 drop-shadow">
              "The Beginning of Forever — Two souls, one timeless journey."
            </p>
          </div>

          {/* Personal VIP Guest Callout */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 backdrop-blur-md">
            <Ticket className="w-4 h-4 text-gold-400" />
            <span className="text-xs text-slate-300">
              VIP Reserved Ticket: <strong className="text-white">{guestName}</strong>
            </span>
          </div>

          {/* Action CTA Buttons (Play Trailer & Add to Calendar) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsTrailerModalOpen(true)}
              className="px-6 py-3 rounded-lg bg-white text-black font-extrabold text-sm flex items-center gap-2 hover:bg-white/90 active:scale-95 transition-all shadow-xl cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" /> Putar Trailer
            </button>

            <button
              onClick={handleAddToCalendar}
              className="px-5 py-3 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold text-sm flex items-center gap-2 active:scale-95 transition-all border border-white/20 shadow-lg cursor-pointer"
            >
              {isAddedToCalendar ? <Check className="w-5 h-5 text-emerald-400" /> : <Plus className="w-5 h-5" />}
              {isAddedToCalendar ? 'Tersimpan di Kalender' : 'Tambah ke Kalender'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. THE CAST & CREW: STARRING / LEADING ROLES
          ======================================================== */}
      <section className="px-6 sm:px-12 py-10 space-y-6 text-left max-w-5xl mx-auto">
        <ScrollReveal direction="fade">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-[#E50914]" /> The Cast & Crew
              </h2>
              <p className="text-xs text-slate-400">Para pemeran utama dan produser eksekutif di balik kisah ini</p>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">STAR CREDITS</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Groom Card */}
          <ScrollReveal direction="left" distance="35px">
            <div className={`p-4 rounded-xl flex items-center gap-4 transition-all group shadow-xl border ${
              isLight ? 'bg-white/95 border-stone-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-amber-400/40' : 'bg-zinc-900/90 border-white/10 hover:border-white/25'
            }`}>
              <div className="w-20 h-24 rounded-lg overflow-hidden border border-white/20 shrink-0 relative">
                <img 
                  src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'} 
                  alt="Groom" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[8px] font-bold text-amber-300">
                  LEAD
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-gold-500 font-bold block font-mono">
                  STARRING AS THE GROOM
                </span>
                <h3 className={`text-lg font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>{invitation.groomName}</h3>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Putra dari: {invitation.groomParents}</p>
                {invitation.groomInstagram && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block pt-0.5">
                    {invitation.groomInstagram}
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Bride Card */}
          <ScrollReveal direction="right" distance="35px">
            <div className={`p-4 rounded-xl flex items-center gap-4 transition-all group shadow-xl border ${
              isLight ? 'bg-white/95 border-stone-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.06)] hover:border-rose-400/40' : 'bg-zinc-900/90 border-white/10 hover:border-white/25'
            }`}>
              <div className="w-20 h-24 rounded-lg overflow-hidden border border-white/20 shrink-0 relative">
                <img 
                  src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'} 
                  alt="Bride" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-1 left-1 px-1 rounded bg-black/70 text-[8px] font-bold text-rose-300">
                  LEAD
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-rose-500 font-bold block font-mono">
                  STARRING AS THE BRIDE
                </span>
                <h3 className={`text-lg font-bold leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>{invitation.brideName}</h3>
                <p className={`text-xs leading-snug ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Putri dari: {invitation.brideParents}</p>
                {invitation.brideInstagram && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono block pt-0.5">
                    {invitation.brideInstagram}
                  </span>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ========================================================
          3. EPISODES / ACT BREAKDOWN: JADWAL ACARA
          ======================================================== */}
      <section className="px-6 sm:px-12 py-8 space-y-6 text-left max-w-5xl mx-auto">
        <ScrollReveal direction="fade">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Film className="w-5 h-5 text-[#E50914]" /> Episodes & Premiere Schedule
              </h2>
              <p className="text-xs text-slate-400">Rangkaian babak acara sakral dan perayaan pernikahan</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#E50914]/20 text-[#E50914] font-bold font-mono">
              SEASON 1
            </span>
          </div>
        </ScrollReveal>

        {/* Live Premiere Countdown Bar */}
        <ScrollReveal direction="zoom">
          <div className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 via-black to-zinc-900 border border-white/15 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gold-400 animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                  TAYANG PERDANA DALAM:
                </span>
                <span className="text-xs text-slate-200">
                  {weddingDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <div className={`px-2.5 py-1.5 rounded border text-center min-w-[48px] ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-black border-white/10'
              }`}>
                <span className={`text-lg font-bold block leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{timeLeft.days}</span>
                <span className="text-[8px] text-slate-500 uppercase">Hari</span>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className={`px-2.5 py-1.5 rounded border text-center min-w-[48px] ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-black border-white/10'
              }`}>
                <span className={`text-lg font-bold block leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{timeLeft.hours}</span>
                <span className="text-[8px] text-slate-500 uppercase">Jam</span>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className={`px-2.5 py-1.5 rounded border text-center min-w-[48px] ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-black border-white/10'
              }`}>
                <span className={`text-lg font-bold block leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{timeLeft.minutes}</span>
                <span className="text-[8px] text-slate-500 uppercase">Mnt</span>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className={`px-2.5 py-1.5 rounded border text-center min-w-[48px] ${
                isLight ? 'bg-white border-stone-200 shadow-sm' : 'bg-black border-white/10'
              }`}>
                <span className="text-lg font-bold text-[#E50914] block leading-none">{timeLeft.seconds}</span>
                <span className="text-[8px] text-slate-500 uppercase">Dtk</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Episode List */}
        <ScrollReveal direction="up" delay={150}>
          <div className="space-y-4">
            {eventsList.map((ev: any, idx: number) => (
              <div 
                key={idx}
                className={`p-5 rounded-xl transition-all space-y-3 shadow-lg border ${
                  isLight
                    ? 'bg-white/95 border-stone-200/90 hover:border-amber-400/40 text-slate-800'
                    : 'bg-zinc-900/80 border-white/10 hover:border-white/20 text-white'
                }`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2 ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#E50914] bg-[#E50914]/10 px-2 py-0.5 rounded border border-[#E50914]/30">
                      E{idx + 1}
                    </span>
                    <h3 className={`text-base sm:text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{ev.title}</h3>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    <Clock className="w-3.5 h-3.5 text-gold-500" />
                    <span>{ev.startTime} - {ev.endTime} WIB</span>
                  </div>
                </div>

                <div className={`space-y-1 text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  <p className={`font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    {ev.venueName}
                  </p>
                  <p className={`pl-5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{ev.address}</p>
                </div>

                {ev.googleMapsUrl && (
                  <div className="pt-2">
                    <a
                      href={ev.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        isLight
                          ? 'text-slate-800 bg-stone-100 hover:bg-stone-200 border-stone-300'
                          : 'text-white bg-white/10 hover:bg-white/20 border-white/15'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gold-500" />
                      Buka Rute Bioskop (Google Maps)
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================
          4. HORIZONTAL RAILS: BEHIND THE SCENES & THE CHRONICLES
          ======================================================== */}
      {/* Rail 1: Behind The Scenes (Photo Gallery) */}
      <ScrollReveal direction="up">
        <section className="py-8 space-y-3 text-left">
          <div className="px-6 sm:px-12 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              Behind the Scenes • Gallery Archives
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Geser ➔</span>
          </div>

          <div className="flex gap-3 overflow-x-auto px-6 sm:px-12 pb-4 no-scrollbar scroll-smooth">
            {galleryList.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxIndex(idx)}
                className="relative w-44 sm:w-56 aspect-[16/9] shrink-0 rounded-lg overflow-hidden border border-white/10 group cursor-pointer shadow-lg hover:scale-105 transition-transform"
              >
                <img 
                  src={photo} 
                  alt={`Scene ${idx}`} 
                  className="w-full h-full object-cover filter contrast-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[10px] font-bold text-white flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" /> Scene #{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Rail 2: The Chronicles (Love Story Milestones) */}
      {loveStoryList.length > 0 && (
        <ScrollReveal direction="up" delay={100}>
          <section className="py-6 space-y-3 text-left">
            <div className="px-6 sm:px-12 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                The Chronicles • Story Milestones
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Origins</span>
            </div>

            <div className="flex gap-3 overflow-x-auto px-6 sm:px-12 pb-4 no-scrollbar scroll-smooth">
              {loveStoryList.map((story: any, idx: number) => (
                <div
                  key={idx}
                  className="w-64 sm:w-72 shrink-0 p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2 shadow-lg hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#E50914] font-bold">CHAPTER {idx + 1}</span>
                    <span className="text-slate-400">{story.year}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{story.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {story.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ========================================================
          5. VIP PREMIERE PASS RSVP TICKET
          ======================================================== */}
      <section className="px-6 sm:px-12 py-10 max-w-xl mx-auto text-left space-y-6">
        <ScrollReveal direction="fade">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-[#E50914] font-bold font-mono">
              ADMIT ONE VIP
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Premiere Ticket & RSVP
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Konfirmasi reservasi kursi bioskop & kirim doa untuk kedua mempelai</p>
          </div>
        </ScrollReveal>

        {/* Perforated Cinema Ticket Design */}
        <ScrollReveal direction="zoom" delay={150}>
          <div className={`relative rounded-2xl border-2 p-6 sm:p-8 shadow-2xl overflow-hidden ${
            isLight
              ? 'bg-white border-stone-300 shadow-[0_20px_50px_rgba(0,0,0,0.08)]'
              : 'bg-gradient-to-b from-zinc-900 to-black border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
          }`}>
            {/* Perforation Notches on Left & Right */}
            <div className={`absolute top-1/3 -left-3 w-6 h-6 rounded-full border-r-2 ${
              isLight ? 'bg-[#F5F6F8] border-stone-300' : 'bg-[#111315] border-white/20'
            }`} />
            <div className={`absolute top-1/3 -right-3 w-6 h-6 rounded-full border-l-2 ${
              isLight ? 'bg-[#F5F6F8] border-stone-300' : 'bg-[#111315] border-white/20'
            }`} />

            {/* Ticket Header */}
            <div className={`border-b border-dashed pb-4 mb-4 flex items-center justify-between ${
              isLight ? 'border-stone-300' : 'border-white/20'
            }`}>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#E50914] font-bold font-mono">
                  WEDDORA CINEMA HALL 1
                </span>
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>EXCLUSIVE INVITATION PASS</h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-[9px] text-slate-400 block">SEAT TYPE</span>
                <span className="text-xs font-bold text-emerald-500">VIP GUEST</span>
              </div>
            </div>

            {/* RSVP Form */}
            <form onSubmit={onRsvpSubmit} className="space-y-4">
              <div>
                <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Nama Tamu (Pass Holder)
                </label>
                <input
                  type="text"
                  required
                  value={rsvpName}
                  onChange={(e) => setRsvpName(e.target.value)}
                  className={`w-full mt-1 px-3 py-2.5 text-xs rounded-lg border focus:outline-none focus:border-[#E50914] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-zinc-950 border-white/20 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Status Kehadiran Kursi
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('ATTENDING')}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                      rsvpStatus === 'ATTENDING'
                        ? 'bg-[#E50914] text-white shadow-lg'
                        : isLight
                        ? 'bg-stone-100 text-slate-700 border border-stone-300'
                        : 'bg-zinc-950 text-slate-300 border border-white/10'
                    }`}
                  >
                    ✓ Hadir (Confirm Seat)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('DECLINED')}
                    className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                      rsvpStatus === 'DECLINED'
                        ? 'bg-zinc-800 text-white border border-white/30'
                        : isLight
                        ? 'bg-stone-100 text-slate-700 border border-stone-300'
                        : 'bg-zinc-950 text-slate-400 border border-white/10'
                    }`}
                  >
                    ✕ Tidak Hadir
                  </button>
                </div>
              </div>

              <div>
                <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Ulasan / Pesan & Doa Restu
                </label>
                <textarea
                  rows={3}
                  value={rsvpMessage}
                  onChange={(e) => setRsvpMessage(e.target.value)}
                  placeholder="Tuliskan ulasan dan ucapan selamat untuk film cinta kedua mempelai..."
                  className={`w-full mt-1 px-3 py-2.5 text-xs rounded-lg border focus:outline-none focus:border-[#E50914] ${
                    isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-zinc-950 border-white/20 text-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingRsvp}
                className="w-full py-3.5 rounded-lg font-black text-xs uppercase tracking-widest text-white bg-[#E50914] hover:bg-[#b80710] active:scale-95 transition-all shadow-xl cursor-pointer"
              >
                {isSubmittingRsvp ? 'MEMPROSES TIKET...' : 'CLAIM VIP PREMIERE TICKET'}
              </button>

              {rsvpSuccess && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-bold">
                  ✓ Tiket Premiere Anda Berhasil Dikonfirmasi. Sampai jumpa di bioskop cinta!
                </p>
              )}
            </form>

            {/* Barcode Footer Simulation */}
            <div className="border-t border-dashed border-white/20 pt-4 mt-6 text-center space-y-1">
              <div className="h-8 w-4/5 mx-auto opacity-70 bg-[repeating-linear-gradient(90deg,#fff,#fff_2px,transparent_2px,transparent_5px)]" />
              <span className="text-[9px] font-mono text-slate-500 tracking-widest">
                TKT-{weddingDate.getFullYear()}-VIP-{guestName.replace(/\s+/g, '').toUpperCase().slice(0, 8)}
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================
          MODAL BIOSKOP: PUTAR TRAILER PREWEDDING
          ======================================================== */}
      <AnimatePresence>
        {isTrailerModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header Close */}
              <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/80">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#E50914]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Official Prewedding Trailer • {groomName} & {brideName}
                  </span>
                </div>
                <button
                  onClick={() => setIsTrailerModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player */}
              <div className="w-full aspect-video bg-black flex items-center justify-center">
                {youtubeEmbedUrl ? (
                  <iframe
                    src={`${youtubeEmbedUrl}?autoplay=1`}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <Film className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                    <p className="text-sm font-bold text-slate-300">Teaser Video Segera Tayang</p>
                    <p className="text-xs text-slate-500">Tautan video YouTube belum dikonfigurasi pada template ini.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
