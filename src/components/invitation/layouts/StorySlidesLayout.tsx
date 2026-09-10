'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Heart, 
  Calendar, 
  Gift, 
  MessageSquareHeart, 
  Camera, 
  MapPin, 
  ExternalLink, 
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  CreditCard,
  Instagram
} from 'lucide-react';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { TurutMengundangSection } from '../components/TurutMengundangSection';
import { BoardingPassEvent } from '../components/BoardingPassEvent';
import { MiniCalendarEvent } from '../components/MiniCalendarEvent';
import { PolaroidPhotos } from '../components/PolaroidPhotos';
import { ArchMoroccanPhotos } from '../components/ArchMoroccanPhotos';
import { ChatMessageLoveStory } from '../components/ChatMessageLoveStory';
import { MetroRoadmapLoveStory } from '../components/MetroRoadmapLoveStory';
import { FilmStripGallery } from '../components/FilmStripGallery';

interface StorySlidesLayoutProps {
  invitation: any;
  guestName: string;
  theme: any;
  fonts: any;
  isPlayingMusic: boolean;
  toggleMusic: () => void;
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

export const StorySlidesLayout: React.FC<StorySlidesLayoutProps> = ({
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const designSchema = typeof invitation.designConfig === 'object' && invitation.designConfig !== null
    ? invitation.designConfig
    : safeParseJSON(invitation.designConfig, {});
  const showTurutMengundang = designSchema?.turutMengundang?.enabled !== false;
  const totalSlides = showTurutMengundang ? 9 : 8;

  // Gesture tracking refs: Supports SWIPE LEFT/RIGHT, SCREEN TAP, and VERTICAL SCROLL concurrently
  const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isVerticalScrollRef = useRef<boolean>(false);
  const didSwipeRef = useRef<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Reset scroll position to top whenever slide changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentSlide]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // Unified Gesture Handlers (for both Mobile Touch and Desktop Mouse Drag)
  const startGesture = (clientX: number, clientY: number) => {
    gestureStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    isVerticalScrollRef.current = false;
    didSwipeRef.current = false;
  };

  const moveGesture = (clientX: number, clientY: number) => {
    if (!gestureStartRef.current) return;
    const diffY = Math.abs(clientY - gestureStartRef.current.y);
    const diffX = Math.abs(clientX - gestureStartRef.current.x);

    // If movement is predominantly vertical (> 8px and steeper than horizontal), mark as vertical scroll
    if (diffY > 8 && diffY > diffX) {
      isVerticalScrollRef.current = true;
    }
  };

  const endGesture = (clientX: number, clientY: number): boolean => {
    if (!gestureStartRef.current) return false;
    const diffX = gestureStartRef.current.x - clientX;
    const diffY = gestureStartRef.current.y - clientY;
    const duration = Date.now() - gestureStartRef.current.time;
    gestureStartRef.current = null;

    // If user was scrolling vertically, do not treat as horizontal swipe
    if (isVerticalScrollRef.current) return false;

    // Horizontal Swipe Detection:
    // Distance > 35px, more horizontal than vertical, within 700ms
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) && duration < 700) {
      didSwipeRef.current = true;
      if (diffX > 0) {
        handleNext(); // Swiped Left -> Next Slide
      } else {
        handlePrev(); // Swiped Right -> Prev Slide
      }
      return true;
    }
    return false;
  };

  // Touch event hooks
  const handleTouchStart = (e: React.TouchEvent) => {
    startGesture(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    moveGesture(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    endGesture(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };

  // Mouse drag event hooks (for desktop swiping)
  const handleMouseDown = (e: React.MouseEvent) => {
    startGesture(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    moveGesture(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    endGesture(e.clientX, e.clientY);
  };

  const handleScroll = () => {
    isVerticalScrollRef.current = true;
  };

  // Screen Tap Navigation (Left 30% = Prev, Right 70% = Next)
  const handleScreenClick = (e: React.MouseEvent) => {
    // 1. If user just performed a swipe or vertical scroll, ignore tap
    if (didSwipeRef.current || isVerticalScrollRef.current) {
      didSwipeRef.current = false;
      isVerticalScrollRef.current = false;
      return;
    }

    // 2. Ignore if click target is an interactive element (button, link, input, etc.)
    const target = e.target as HTMLElement | null;
    if (
      target &&
      target.closest(
        'button, a, input, textarea, select, [role="button"], iframe, .no-story-tap'
      )
    ) {
      return;
    }

    // 3. Screen Tap: Left 30% = prev, Right 70% = next
    if (!scrollContainerRef.current) return;
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = clickX / rect.width;

    if (ratio < 0.3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 250 : -250,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -250 : 250,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.25, ease: 'easeIn' },
    }),
  };


  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, []);
  const loveStoryList = safeParseJSON(invitation.loveStory, []);
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, []);
  const eventsList = invitation.events || [];
  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = getInitialLetter(invitation.groomName) || 'G';
  const brideInitial = getInitialLetter(invitation.brideName) || 'B';

  return (
    <div className={`relative w-full h-[100dvh] max-w-md mx-auto overflow-hidden select-none flex flex-col justify-between ${
      isLight ? 'bg-[#FAF8F5] text-slate-800' : 'bg-slate-950 text-white'
    }`}>
      {/* Background Image / Blur */}
      <div 
        className={`absolute inset-0 bg-cover bg-center blur-[8px] scale-105 pointer-events-none ${
          isLight ? 'brightness-[0.85] opacity-25' : 'brightness-[0.35]'
        }`}
        style={{
          backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
        }}
      />
      <div className={`absolute inset-0 pointer-events-none z-0 ${
        isLight
          ? 'bg-gradient-to-b from-white/90 via-white/50 to-white/90'
          : 'bg-gradient-to-b from-black/80 via-transparent to-black/90'
      }`} />

      {/* TOP HEADER: Progress Bars & Meta (Fixed at Top) */}
      <div className={`relative z-30 pt-3 px-4 space-y-2 shrink-0 backdrop-blur-md pb-1 border-b ${
        isLight
          ? 'bg-white/90 border-stone-200/80 text-slate-800'
          : 'bg-slate-950/80 border-white/5 text-white'
      }`}>
        {/* Story Progress Bars */}
        <div className="flex gap-1.5 w-full">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 flex-1 rounded-full overflow-hidden cursor-pointer ${
                isLight ? 'bg-stone-300' : 'bg-white/20'
              }`}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
            >
              <div 
                className="h-full transition-all duration-300 rounded-full"
                style={{
                  width: idx <= currentSlide ? '100%' : '0%',
                  backgroundColor: theme.primary || '#C9A66B',
                }}
              />
            </div>
          ))}
        </div>

        {/* Top App Bar with Couple Initials & Music Button */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-gold-400/60 shadow shrink-0">
              <img 
                src={invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=200'} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <span className={`text-xs font-bold block truncate max-w-[220px] ${
                isLight ? 'text-slate-900' : 'text-slate-100'
              }`}>
                {getCleanName(invitation.groomName)} & {getCleanName(invitation.brideName)}
              </span>
              <span className="text-[10px] text-gold-500 font-bold block font-mono">
                Slide {currentSlide + 1} dari {totalSlides}
              </span>
            </div>
          </div>

          <button
            onClick={toggleMusic}
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-gold-400 hover:scale-110 transition-transform shadow shrink-0"
            title={isPlayingMusic ? 'Mute' : 'Play'}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* SLIDE CONTENT VIEWER (BOTH SWIPE LEFT/RIGHT & TAP SCREEN TO NAVIGATE & VERTICAL SCROLL) */}
      <div 
        ref={scrollContainerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onScroll={handleScroll}
        onClick={handleScreenClick}
        className="relative flex-1 z-10 w-full overflow-y-auto overflow-x-hidden p-4 scroll-smooth overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gold-500/40 [&::-webkit-scrollbar-track]:bg-transparent cursor-pointer"
      >
        <AnimatePresence custom={direction} mode="wait">
          {/* SLIDE 0: HERO COVER */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto text-center space-y-4 py-4 min-h-full flex flex-col justify-center"
            >
              <div className="w-64 h-80 mx-auto rounded-3xl overflow-hidden border-2 border-gold-400/50 shadow-2xl relative group">
                <img 
                  src={invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'} 
                  alt="Couple Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                  <span className="text-xs uppercase tracking-widest text-gold-300 font-bold">The Wedding of</span>
                  <h2 
                    className="text-3xl font-bold text-white mt-0.5 drop-shadow"
                    style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
                  >
                    {getCleanName(invitation.groomName)} & {getCleanName(invitation.brideName)}
                  </h2>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl backdrop-blur-md border ${
                isLight
                  ? 'bg-white/90 border-amber-400/40 text-slate-800 shadow-xl'
                  : 'bg-black/60 border-gold-500/30'
              }`}>
                <span className={`text-[10px] block uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Special Invitation For:</span>
                <p className={`text-sm font-bold ${isLight ? 'text-amber-800' : 'text-gold-300'}`}>{guestName}</p>
                <p className={`text-[11px] pt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className={`text-[11px] font-semibold animate-pulse ${isLight ? 'text-amber-700' : 'text-gold-300/80'}`}>
                Ketuk layar atau geser (swipe) kiri/kanan untuk lanjut ➔
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: PROFIL MEMPELAI */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-3 py-2 min-h-full flex flex-col justify-center pb-4"
            >
              <div className="text-center pb-1">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold font-mono">
                  Pasangan Mempelai
                </span>
                <h3 
                  className={`text-xl sm:text-2xl font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}
                  style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                >
                  Groom & Bride
                </h3>
              </div>

              {designSchema?.couplePhotoStyle === 'polaroid' ? (
                <PolaroidPhotos invitation={invitation} theme={theme} fonts={fonts} />
              ) : designSchema?.couplePhotoStyle === 'arch' ? (
                <ArchMoroccanPhotos invitation={invitation} theme={theme} fonts={fonts} />
              ) : (
                <div className="space-y-3 w-full">
                  {/* Groom Card */}
                  <div className={`p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-xl backdrop-blur-md border ${
                    isLight
                      ? 'bg-white/95 border-amber-400/30 shadow-[0_10px_25px_rgba(0,0,0,0.06)]'
                      : 'bg-slate-900/90 border-gold-500/30'
                  }`}>
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-gold-400 shrink-0 shadow-md bg-slate-950">
                      <img 
                        src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'} 
                        alt="Groom" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className={`font-bold text-sm sm:text-base font-serif leading-snug truncate ${
                        isLight ? 'text-amber-900' : 'text-gold-300'
                      }`}>
                        {invitation.groomName}
                      </h4>
                      <span className={`text-[10px] block font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Mempelai Pria</span>
                      <p className={`text-[10px] sm:text-[11px] leading-tight pt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {invitation.groomParents}
                      </p>
                      {invitation.groomInstagram && (
                        <a
                          href={`https://instagram.com/${invitation.groomInstagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-gold-400 hover:underline pt-1 font-mono"
                        >
                          <Instagram className="w-3 h-3" />
                          <span>{invitation.groomInstagram}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Symmetrical Heart Divider */}
                  <div className="flex items-center justify-center gap-3 px-6 py-0.5">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                    <Heart className="w-4 h-4 text-gold-400 fill-gold-400/20" />
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                  </div>

                  {/* Bride Card */}
                  <div className={`p-3.5 sm:p-4 rounded-2xl flex items-center gap-3.5 shadow-xl backdrop-blur-md border ${
                    isLight
                      ? 'bg-white/95 border-rose-400/30 shadow-[0_10px_25px_rgba(0,0,0,0.06)]'
                      : 'bg-slate-900/90 border-rose-500/30'
                  }`}>
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-rose-400 shrink-0 shadow-md bg-slate-950">
                      <img 
                        src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500'} 
                        alt="Bride" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className={`font-bold text-sm sm:text-base font-serif leading-snug truncate ${
                        isLight ? 'text-rose-900' : 'text-rose-300'
                      }`}>
                        {invitation.brideName}
                      </h4>
                      <span className={`text-[10px] block font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Mempelai Wanita</span>
                      <p className={`text-[10px] sm:text-[11px] leading-tight pt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                        {invitation.brideParents}
                      </p>
                      {invitation.brideInstagram && (
                        <a
                          href={`https://instagram.com/${invitation.brideInstagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-rose-300 hover:underline pt-1 font-mono"
                        >
                          <Instagram className="w-3 h-3" />
                          <span>{invitation.brideInstagram}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SLIDE 2: JADWAL ACARA */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-4 py-2 min-h-full flex flex-col justify-start pb-8"
            >
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Jadwal & Lokasi Acara</span>
                <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Save The Date</h3>
              </div>

              {designSchema?.eventStyle === 'boarding_pass' ? (
                <BoardingPassEvent events={eventsList} invitation={invitation} theme={theme} fonts={fonts} />
              ) : designSchema?.eventStyle === 'mini_calendar' ? (
                <div className="space-y-4">
                  <MiniCalendarEvent weddingDate={invitation.weddingDate} theme={theme} fonts={fonts} />
                  {eventsList.map((ev: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-900/90 border border-gold-500/30 rounded-xl text-left space-y-1">
                      <h5 className="font-bold text-xs text-gold-300">{ev.title}</h5>
                      <p className="text-[11px] text-slate-300">{ev.startTime} - {ev.endTime} @ {ev.venueName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {eventsList.map((ev: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-gold-500/30 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gold-300">{ev.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gold-400/20 text-gold-300 font-mono">
                          {ev.startTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200">{ev.venueName}</p>
                      <p className="text-[11px] text-slate-400">{ev.address}</p>
                      {ev.googleMapsUrl && (
                        <a 
                          href={ev.googleMapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:underline pt-1"
                        >
                          <MapPin className="w-3.5 h-3.5" /> Buka Google Maps
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SLIDE 3: GALERI FOTO & VIDEO */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-4 py-2 min-h-full flex flex-col justify-start pb-8"
            >
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Dokumentasi Prewedding</span>
                <h3 className="text-xl font-bold text-white">Galeri & Video</h3>
              </div>

              {/* YouTube Video Autoplay Embed */}
              {youtubeEmbedUrl && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-black">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Prewedding Video"
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Photo Thumbnails */}
              {designSchema?.galleryStyle === 'film_strip' ? (
                <FilmStripGallery 
                  photos={galleryList} 
                  onPhotoClick={(idx) => setActiveLightboxIndex(idx)} 
                  theme={theme} 
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {galleryList.slice(0, 8).map((photo, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveLightboxIndex(idx)}
                      className="aspect-square rounded-xl overflow-hidden border border-gold-500/30 cursor-pointer group shadow no-story-tap"
                    >
                      <img src={photo} alt={`Thumb ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SLIDE 4: LOVE STORY */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-4 py-2 min-h-full flex flex-col justify-start pb-8"
            >
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Perjalanan Kami</span>
                <h3 className="text-xl font-bold text-white">Our Love Story</h3>
              </div>

              {designSchema?.loveStoryStyle === 'chat_message' ? (
                <ChatMessageLoveStory loveStory={loveStoryList} invitation={invitation} theme={theme} fonts={fonts} />
              ) : designSchema?.loveStoryStyle === 'metro_map' ? (
                <MetroRoadmapLoveStory loveStory={loveStoryList} theme={theme} fonts={fonts} />
              ) : (
                <div className="space-y-3">
                  {loveStoryList.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900/90 border border-gold-500/20 text-left">
                      <span className="text-[10px] font-mono text-gold-400 font-bold">Tahun {item.year}</span>
                      <h5 className="font-bold text-xs text-white mt-0.5">{item.title}</h5>
                      <p className="text-[11px] text-slate-300 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* SLIDE 5: DIGITAL GIFTS & RSVP */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-5"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-4 py-2 min-h-full flex flex-col justify-start pb-10"
            >
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">Konfirmasi Kehadiran</span>
                <h3 className="text-xl font-bold text-white">Kirim Doa & RSVP</h3>
              </div>

              {/* RSVP Form */}
              <form onSubmit={onRsvpSubmit} className="p-4 rounded-2xl bg-slate-900/95 border border-gold-500/30 space-y-3 text-left shadow-2xl">
                <div>
                  <label className="text-[10px] uppercase text-slate-400 block font-semibold">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-slate-400 block font-semibold">Kehadiran</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('ATTENDING')}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        rsvpStatus === 'ATTENDING' ? 'bg-gold-500 text-slate-950 border-gold-400' : 'bg-slate-950 text-slate-300 border-white/10'
                      }`}
                    >
                      Hadir
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('DECLINED')}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        rsvpStatus === 'DECLINED' ? 'bg-rose-600 text-white border-rose-500' : 'bg-slate-950 text-slate-300 border-white/10'
                      }`}
                    >
                      Maaf Tidak Hadir
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-slate-400 block font-semibold">Ucapan & Doa</label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="Tuliskan ucapan dan doa terbaik untuk kedua mempelai..."
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/15 text-white focus:outline-none focus:border-gold-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow cursor-pointer"
                >
                  {isSubmittingRsvp ? 'Mengirim...' : 'Kirim Ucapan & Konfirmasi'}
                </button>

                {rsvpSuccess && (
                  <p className="text-xs text-emerald-400 text-center font-bold">
                    ✓ Terima kasih atas doa & konfirmasinya!
                  </p>
                )}
              </form>
            </motion.div>
          )}

          {/* SLIDE 6: KADO DIGITAL & ANGPAU CASHLESS */}
          {currentSlide === 6 && (
            <motion.div
              key="slide-6"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full max-w-sm mx-auto space-y-4 py-2 min-h-full flex flex-col justify-start pb-10"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-[10px] text-gold-400 font-bold tracking-widest uppercase">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Tanda Kasih & Doa</span>
                </div>
                <h3 className="text-xl font-bold text-white">Kado Pernikahan Digital</h3>
                <p className="text-[11px] text-slate-300 px-2 leading-relaxed">
                  Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, dapat melalui rekening berikut:
                </p>
              </div>

              {/* Bank & E-Wallet Cards */}
              <div className="space-y-3">
                {(digitalGiftsList && digitalGiftsList.length > 0 ? digitalGiftsList : [
                  { bankName: 'Bank Central Asia (BCA)', accountNumber: '8820491823', accountName: `${groomName}`, shippingAddress: 'Jl. Melati No. 12, Menteng, Jakarta Pusat (Penerima: Kedua Mempelai)' },
                  { bankName: 'Bank Mandiri', accountNumber: '1370019284712', accountName: `${brideName}` }
                ]).map((gift: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-gold-500/30 space-y-2.5 text-left shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gold-400" />
                        <span className="font-bold text-xs uppercase text-gold-300">
                          {gift.bankName}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                        Cashless Angpao
                      </span>
                    </div>

                    {gift.accountNumber && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Nomor Rekening:</span>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/90 border border-white/10">
                          <span className="font-mono text-sm font-bold text-gold-300 tracking-wider">
                            {gift.accountNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(gift.accountNumber, idx)}
                            className="px-3 py-1 rounded-lg bg-gold-500/20 text-gold-300 text-xs font-bold flex items-center gap-1 hover:bg-gold-500 hover:text-slate-950 transition-all cursor-pointer"
                          >
                            {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-300 block pt-0.5">
                          a.n. <strong className="text-white">{gift.accountName || `${groomName} & ${brideName}`}</strong>
                        </span>
                      </div>
                    )}

                    {gift.shippingAddress && (
                      <div className="space-y-1 pt-2 border-t border-white/10">
                        <span className="text-[10px] uppercase text-slate-400 block font-medium">Alamat Pengiriman Kado Fisik:</span>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-white/10">
                          {gift.shippingAddress}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopy(gift.shippingAddress, idx + 100)}
                          className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gold-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedIndex === (idx + 100) ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIndex === (idx + 100) ? 'Alamat Tersalin!' : 'Salin Alamat Kirim Kado'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 7: TURUT MENGUNDANG */}
          {showTurutMengundang && currentSlide === 7 && (
            <motion.div
              key="slide-turut-mengundang"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full max-w-sm mx-auto space-y-4 my-auto pb-4"
            >
              <TurutMengundangSection
                config={designSchema?.turutMengundang}
                theme={theme}
                fonts={fonts}
                textPrimaryColor={isLight ? '#0f172a' : '#F8FAFC'}
                contentCardBg={isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.9)'}
                contentCardBorderClass={isLight ? 'border border-amber-400/40 shadow-xl' : 'border border-gold-500/30 shadow-2xl'}
                cardBorderRadius="rounded-3xl"
              />
            </motion.div>
          )}

          {/* SLIDE: UCAPAN TERIMA KASIH DENGAN LATAR BELAKANG FOTO PENGANTIN */}
          {currentSlide === (showTurutMengundang ? 8 : 7) && (
            <motion.div
              key="slide-final"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full max-w-sm mx-auto min-h-[520px] flex flex-col justify-between items-center text-center py-6 px-4 rounded-3xl overflow-hidden shadow-2xl border border-gold-500/30 my-auto"
            >
              {/* Dedicated Couple Photo Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter contrast-[1.05] brightness-90 scale-100 transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'})`,
                }}
              />
              {/* Multi-layer atmospheric dark gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/60 z-0" />

              {/* TOP: Monogram Crest */}
              <div className="relative z-10 pt-2 space-y-1.5">
                <div className="w-12 h-12 mx-auto rounded-full border-2 border-gold-400/70 bg-black/50 backdrop-blur-md flex items-center justify-center text-gold-300 font-serif text-lg font-bold shadow-lg">
                  {groomInitial}&{brideInitial}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/30 text-[10px] text-gold-300 font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-gold-400" />
                  <span>Ungkapan Rasa Syukur</span>
                </div>
              </div>

              {/* MIDDLE: Terima Kasih Heading & Heartfelt Message */}
              <div className="relative z-10 my-auto py-3 space-y-3 max-w-xs">
                <h2 
                  className="text-4xl sm:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-gold-300 to-amber-400 drop-shadow-lg"
                  style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                >
                  Terima Kasih
                </h2>
                
                <p className="text-xs text-slate-200 leading-relaxed font-sans drop-shadow-md">
                  Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga, apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu bagi lembaran baru kehidupan kami.
                </p>

                {invitation.quoteText ? (
                  <div className="p-3 rounded-xl bg-black/50 border border-white/15 backdrop-blur-sm shadow-md">
                    <p className="text-[11px] italic text-gold-200/90 leading-relaxed">
                      &ldquo;{invitation.quoteText}&rdquo;
                    </p>
                    {invitation.quoteSource && (
                      <span className="text-[10px] text-slate-400 block mt-1 font-semibold">
                        — {invitation.quoteSource}
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] italic text-amber-200/85 leading-relaxed bg-black/50 p-2.5 rounded-xl border border-white/15 backdrop-blur-sm shadow-md">
                    &ldquo;Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.&rdquo;
                    <span className="block mt-1 font-bold text-[9px] text-slate-300">— QS. Ar-Rum: 21</span>
                  </p>
                )}
              </div>

              {/* BOTTOM: Mempelai & Restart Invitation Button */}
              <div className="relative z-10 pb-2 space-y-3 w-full">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-300 italic font-serif block">
                    Kami yang berbahagia,
                  </span>
                  <h3 
                    className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white drop-shadow-lg font-serif"
                    style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                  >
                    {groomName} & {brideName}
                  </h3>
                  <span className="text-[10px] text-gold-400/90 block font-medium">
                    Beserta Segenap Keluarga Besar
                  </span>
                </div>

                {/* Restart Slide Action */}
                <button
                  type="button"
                  onClick={() => {
                    setDirection(-1);
                    setCurrentSlide(0);
                  }}
                  className="px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-[11px] font-semibold text-white transition-all flex items-center justify-center gap-1.5 mx-auto cursor-pointer shadow-lg active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-300" />
                  <span>Kembali ke Halaman Awal</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM FOOTER: NAV BUTTONS & INDICATOR (Fixed at Bottom) */}
      <div className={`relative z-30 px-4 py-3 pb-5 sm:pb-3 backdrop-blur-md border-t flex items-center justify-between shrink-0 ${
        isLight
          ? 'bg-white/95 border-stone-200/90 text-slate-800 shadow-[0_-5px_15px_rgba(0,0,0,0.06)]'
          : 'bg-slate-950/95 border-white/10 text-white shadow-[0_-5px_15px_rgba(0,0,0,0.5)]'
      }`}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className={`flex items-center gap-1 text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
            currentSlide === 0 
              ? 'opacity-30 cursor-not-allowed border-stone-200' 
              : isLight
              ? 'border-stone-300 text-slate-700 hover:bg-stone-100 active:scale-95'
              : 'border-white/15 text-slate-200 hover:bg-white/10 active:scale-95'
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div 
              key={i} 
              onClick={() => {
                setDirection(i > currentSlide ? 1 : -1);
                setCurrentSlide(i);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentSlide 
                  ? 'w-5 bg-gold-500' 
                  : isLight
                  ? 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className={`flex items-center gap-1 text-xs px-4 py-1.5 rounded-full font-bold transition-colors shadow-lg cursor-pointer ${
            currentSlide === totalSlides - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : 'bg-gold-500 text-slate-950 hover:bg-gold-400 active:scale-95'
          }`}
        >
          Lanjut <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
