'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, BookOpen, Volume2, VolumeX, 
  Heart, Calendar, MapPin, Sparkles, Send, Stamp, ExternalLink, Play,
  Copy, Check, Gift, RotateCcw, CreditCard
} from 'lucide-react';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface RealisticFlipbookLayoutProps {
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

export const RealisticFlipbookLayout: React.FC<RealisticFlipbookLayoutProps> = ({
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
  const [currentPage, setCurrentPage] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [isFlipping, setIsFlipping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const totalPages = 8; // 0: Cover, 1: Prologue, 2: Couple, 3: Events, 4: Gallery, 5: Postcard RSVP, 6: Wedding Gifts, 7: Thank You & Epilogue

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
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, []);

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = getInitialLetter(invitation.groomName, 'G');
  const brideInitial = getInitialLetter(invitation.brideName, 'B');

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  // Realistis 3D Book Page Flip Animation (Membuka ke depan ke arah pembaca)
  const pageFlipVariants = {
    enter: (dir: 'next' | 'prev') => ({
      // Saat maju ke Halaman Selanjutnya: halaman baru di bawah terungkap dan naik ke permukaan
      // Saat mundur ke Halaman Sebelumnya: halaman terangkat ke depan (+Z) dari kiri lalu mendarat rata
      rotateY: dir === 'next' ? 0 : -95,
      z: dir === 'next' ? 0 : 70,
      scale: dir === 'next' ? 0.97 : 1,
      opacity: dir === 'next' ? 0.75 : 0.85,
      transformOrigin: 'left center',
      filter: dir === 'next' 
        ? 'brightness(0.85) drop-shadow(0px 10px 20px rgba(0,0,0,0.5))' 
        : 'brightness(0.9) drop-shadow(-15px 15px 35px rgba(0,0,0,0.6))',
    }),
    center: {
      rotateY: 0,
      z: 0,
      scale: 1,
      opacity: 1,
      transformOrigin: 'left center',
      filter: 'brightness(1) drop-shadow(0px 15px 30px rgba(0,0,0,0.4))',
      transition: { 
        duration: 0.52, 
        ease: [0.25, 1, 0.35, 1] // smooth natural book turning curve
      },
    },
    exit: (dir: 'next' | 'prev') => ({
      // Saat maju (Next): lembaran aktif terangkat KEDEPAN (+Z 80px) dan mengayun ke kiri melewati punggung buku
      // Saat mundur (Prev): lembaran turun ke bawah tertutup oleh halaman sebelumnya
      rotateY: dir === 'next' ? -100 : 0,
      z: dir === 'next' ? 80 : -30,
      scale: dir === 'next' ? 1.02 : 0.96,
      opacity: dir === 'next' ? 0 : 0.4,
      transformOrigin: 'left center',
      filter: dir === 'next' 
        ? 'brightness(0.7) drop-shadow(-25px 20px 40px rgba(0,0,0,0.8))' 
        : 'brightness(0.6) drop-shadow(0px 5px 15px rgba(0,0,0,0.6))',
      transition: { 
        duration: 0.46, 
        ease: [0.35, 0, 0.45, 1] 
      },
    }),
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 550);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => {
        setIsFlipping(false);
      }, 550);
    }
  };

  // Unified Gesture Tracker: Swipe Kiri, Kanan, Atas, Bawah & Screen Tap
  const gestureStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const didGestureRef = useRef<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);

  const startGesture = (x: number, y: number) => {
    gestureStartRef.current = { x, y, time: Date.now() };
    didGestureRef.current = false;
  };

  const endGesture = (endX: number, endY: number) => {
    if (!gestureStartRef.current) return;
    const diffX = gestureStartRef.current.x - endX;
    const diffY = gestureStartRef.current.y - endY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    const duration = Date.now() - gestureStartRef.current.time;

    // Fast swipe gesture (within 850ms, at least 35px distance)
    if (duration < 850) {
      // 1. Horizontal Swipe (Kiri / Kanan)
      if (absX > 35 && absX >= absY) {
        didGestureRef.current = true;
        if (diffX > 0) {
          goToNextPage(); // Swiped Left -> Buka halaman berikutnya
        } else {
          goToPrevPage(); // Swiped Right -> Balik halaman sebelumnya
        }
      }
      // 2. Vertical Swipe (Atas / Bawah)
      else if (absY > 35 && absY > absX) {
        didGestureRef.current = true;
        if (diffY > 0) {
          goToNextPage(); // Swiped Up -> Buka halaman berikutnya
        } else {
          goToPrevPage(); // Swiped Down -> Balik halaman sebelumnya
        }
      }
    }
    gestureStartRef.current = null;
    isDraggingRef.current = false;
  };

  // Touch Handlers (Mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    startGesture(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!gestureStartRef.current) return;
    endGesture(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  };

  // Mouse Drag Handlers (Desktop Swiping)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    startGesture(e.clientX, e.clientY);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    endGesture(e.clientX, e.clientY);
  };

  // Screen Tap Handler: Klik area kanan layar = Next, area kiri = Prev
  const handleScreenTap = (e: React.MouseEvent) => {
    // Jika baru saja terjadi gestur swipe/drag, abaikan tap
    if (didGestureRef.current) {
      didGestureRef.current = false;
      return;
    }

    // Abaikan jika user mengklik tombol, input, link, form, atau video
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, a, select, iframe, [role="button"], .no-tap-flip')) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    const width = rect.width;

    if (tapX > width * 0.5) {
      goToNextPage();
    } else {
      goToPrevPage();
    }
  };

  // Keyboard navigation (Arrow keys & Space)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleScreenTap}
      className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-between p-3 sm:p-6 select-none overflow-x-hidden font-serif cursor-pointer ${
        isLight ? 'bg-[#EDE7DE] text-[#2c241d]' : 'bg-[#1c1815] text-[#f5ecd8]'
      }`}
    >
      {/* Wooden Desk / Vintage Fabric Background Texture */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-10' : 'opacity-20'}`}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(#b89758 1px, transparent 1px), radial-gradient(#b89758 1px, #EDE7DE 1px)'
            : 'radial-gradient(#d4af37 1px, transparent 1px), radial-gradient(#d4af37 1px, #1c1815 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />
      <div className={`absolute inset-0 pointer-events-none ${
        isLight
          ? 'bg-radial from-transparent via-stone-300/25 to-stone-400/40'
          : 'bg-radial from-transparent via-black/40 to-black/80'
      }`} />

      {/* TOP DESK BAR: TITLE, HINT & MUSIC */}
      <header 
        onClick={(e) => e.stopPropagation()} 
        className={`w-full max-w-lg flex items-center justify-between z-20 pt-2 pb-3 px-2 border-b no-tap-flip ${
          isLight
            ? 'border-stone-300/80 text-stone-700'
            : 'border-amber-900/30 text-amber-200/80'
        }`}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className={`text-[11px] font-mono tracking-widest uppercase font-bold ${
            isLight ? 'text-amber-900' : 'text-amber-300'
          }`}>
            The Wedding Scrapbook
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isLight
              ? 'bg-white/80 text-stone-700 border-stone-300'
              : 'bg-black/40 text-amber-200/60 border-amber-900/30'
          }`}>
            Hal {currentPage + 1} / {totalPages}
          </span>
          {toggleMusic && (
            <button
              onClick={toggleMusic}
              className={`w-7 h-7 rounded-full border flex items-center justify-center hover:scale-110 transition-transform shadow cursor-pointer ${
                isLight
                  ? 'bg-white text-amber-700 border-amber-300'
                  : 'bg-black/60 text-amber-300 border-amber-500/30'
              }`}
              title={isPlayingMusic ? 'Mute' : 'Play Music'}
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          )}
        </div>
      </header>

      {/* GENTLE GESTURE HINT */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="z-20 pt-1 pb-0.5 text-center no-tap-flip pointer-events-none"
      >
        <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[10px] font-mono tracking-tight shadow-sm backdrop-blur-xs ${
          isLight
            ? 'bg-white/80 border-stone-300 text-stone-700'
            : 'bg-black/40 border-amber-500/20 text-amber-300/80'
        }`}>
          <span>👆 Tap layar atau geser (swipe ↔ ↕) untuk membalik buku</span>
        </span>
      </div>

      {/* ========================================================
          3D REALISTIC SCRAPBOOK ALBUM CANVAS
          ======================================================== */}
      <main className="relative z-10 w-full max-w-md my-auto perspective-[1800px] flex items-center justify-center py-2">
        {/* Leather Album Outer Shadow & Spine */}
        <div className="relative w-full aspect-[1/1.42] max-h-[82vh] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-visible">
          {/* Bookmark Ribbon Hanging from Top */}
          <div className="absolute -top-3 right-8 w-5 h-14 bg-gradient-to-b from-rose-800 to-rose-950 rounded-b shadow-md z-30 pointer-events-none flex items-end justify-center pb-1">
            <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[8px] border-b-[#1c1815]" />
          </div>

          {/* Realistic Book Spine (Left side shadow) */}
          <div className="absolute -left-2 top-2 bottom-2 w-4 bg-gradient-to-r from-amber-950 via-[#2e1d11] to-[#1a110a] rounded-l-lg shadow-inner z-20" />

          {/* Animated 3D Page Spread Container with AnimatePresence */}
          <AnimatePresence mode="wait" custom={flipDirection}>
            <motion.div
              key={currentPage}
              custom={flipDirection}
              variants={pageFlipVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
                background: currentPage === 0 
                  ? 'linear-gradient(135deg, #2b1810 0%, #1c0f0a 100%)' 
                  : '#fbf7ee', // Rich Kraft Linen Parchment
                color: currentPage === 0 ? '#f5e6d3' : '#2b2118',
              }}
            >
            {/* Paper Texture Overlay for Inner Pages */}
            {currentPage > 0 && (
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#8b7355 0.75px, transparent 0.75px)',
                  backgroundSize: '8px 8px',
                }}
              />
            )}

            {/* Inner Page Subtle Center Spine Crease Shadow */}
            {currentPage > 0 && (
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none z-10" />
            )}

            {/* Dynamic Page Flip Light Reflection Sheen */}
            {currentPage > 0 && (
              <motion.div
                initial={{ opacity: 0.45, x: '-30%' }}
                animate={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.52, ease: 'easeOut' }}
                className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-r from-transparent via-amber-200/20 to-black/15"
              />
            )}

            {/* ========================================================
                PAGE 0: VINTAGE LEATHER JOURNAL COVER
                ======================================================== */}
            {currentPage === 0 && (
              <div className="relative w-full h-full p-6 sm:p-8 flex flex-col items-center justify-between text-center border-4 border-amber-900/60 rounded-2xl shadow-inner">
                {/* Embossed Gold Border Frame */}
                <div className="absolute inset-3 border-2 border-dashed border-amber-400/40 rounded-xl pointer-events-none" />

                <div className="pt-8 space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.35em] text-amber-400 font-bold block font-mono">
                    MEMORABILIA ALBUM
                  </span>
                  <div className="w-16 h-[1px] bg-amber-400/40 mx-auto" />
                </div>

                {/* Monogram Seal on Leather */}
                <div className="my-auto space-y-4">
                  <div className="w-24 h-24 rounded-full mx-auto p-1 bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-700 shadow-2xl flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-[#20120b] border-2 border-amber-400/60 flex flex-col items-center justify-center">
                      <span 
                        className="text-2xl font-black text-amber-200 tracking-wider drop-shadow"
                        style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                      >
                        {groomInitial}&{brideInitial}
                      </span>
                      <Heart className="w-3 h-3 text-amber-400 fill-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-1 px-4">
                    <h1 
                      className="text-2xl sm:text-3xl font-bold text-amber-100 leading-tight"
                      style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                    >
                      {groomName} & {brideName}
                    </h1>
                    <p className="text-xs text-amber-300/80 italic font-serif">
                      "A story carved in time, bounded with unconditional love."
                    </p>
                  </div>
                </div>

                {/* Guest Callout & Open Invitation Button */}
                <div className="w-full space-y-3 pb-4">
                  <div className="p-3 rounded-xl bg-black/40 border border-amber-400/30 backdrop-blur-sm">
                    <span className="text-[9px] uppercase tracking-widest text-amber-400/80 block font-mono">
                      Khusus Untuk Tamu Terhormat:
                    </span>
                    <p className="text-sm font-bold text-amber-100 truncate">{guestName}</p>
                  </div>

                  <button
                    onClick={goToNextPage}
                    className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Buka Lembaran Buku</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 1: PROLOGUE & PRESSED BOTANICAL FLOWERS
                ======================================================== */}
            {currentPage === 1 && (
              <div className="relative w-full h-full p-6 sm:p-8 flex flex-col justify-between text-left overflow-y-auto no-scrollbar">
                {/* Washi Tape at Top Right */}
                <div className="absolute top-2 right-4 w-16 h-5 bg-amber-200/80 -rotate-6 shadow-sm border-t border-b border-amber-300/60 z-10" />

                <div className="space-y-1 border-b border-stone-300 pb-3">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    CHAPTER I • MUKADIMAH
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Kisah & Doa Kami
                  </h2>
                </div>

                {/* Pressed Flower Graphic Simulation & Sacred Quote */}
                <ScrollReveal direction="up">
                  <div className="my-auto py-4 space-y-4 relative">
                    {/* Subtle botanical leafy illustration background */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none text-stone-900 text-8xl">
                      🌿
                    </div>

                    <div className="p-4 rounded-xl bg-amber-100/50 border-l-4 border-amber-700 space-y-2 shadow-sm">
                      <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed font-serif">
                        "{invitation.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}"
                      </p>
                      <span className="text-[10px] text-amber-800 uppercase tracking-widest font-mono font-bold block">
                        — {invitation.quoteSource || 'QS. AR-RUM: 21'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 leading-relaxed font-serif space-y-2">
                      <p>
                        Salam damai dan penuh cinta. Dengan segala kerendahan hati dan rasa syukur yang mendalam, kami bermaksud mengabadikan lembaran baru kehidupan dalam ikatan pernikahan suci kami.
                      </p>
                      <p className="italic text-stone-800 font-medium">
                        Kehadiran serta doa restu dari Bapak/Ibu/Saudara/i <strong className="underline decoration-amber-500">{guestName}</strong> merupakan tinta terindah dalam buku kenangan ini.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Page Bottom Signature / Hint */}
                <div className="pt-3 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span>Weddora Journal</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>
                    Buka Mempelai ➔
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 2: THE PROTAGONISTS (POLAROID & WASHI TAPE)
                ======================================================== */}
            {currentPage === 2 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-center overflow-y-auto no-scrollbar">
                <div className="border-b border-stone-300 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    CHAPTER II • DUA HATI
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Kedua Mempelai
                  </h2>
                </div>

                <div className="my-auto py-2 space-y-4">
                  {/* Groom Polaroid Card */}
                  <ScrollReveal direction="left" distance="25px">
                    <div className="relative mx-auto w-52 p-2.5 pb-3 bg-white shadow-md rounded border border-stone-200 -rotate-2 hover:rotate-0 transition-transform">
                      {/* Washi Tape Strip */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-amber-200/90 shadow-sm rotate-1 border-t border-b border-amber-300/80 z-10" />
                      <div className="w-full aspect-square rounded overflow-hidden bg-stone-100">
                        <img 
                          src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'} 
                          alt="Groom" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-1.5 text-center">
                        <h4 className="text-sm font-bold text-stone-800 font-serif leading-tight">{invitation.groomName}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-amber-800 block font-mono">Mempelai Pria</span>
                        <p className="text-[9px] text-stone-500 font-sans leading-tight pt-0.5">{invitation.groomParents}</p>
                      </div>
                    </div>
                  </ScrollReveal>

                  {/* Bride Polaroid Card */}
                  <ScrollReveal direction="right" distance="25px">
                    <div className="relative mx-auto w-52 p-2.5 pb-3 bg-white shadow-md rounded border border-stone-200 rotate-2 hover:rotate-0 transition-transform">
                      {/* Washi Tape Strip */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-rose-200/90 shadow-sm -rotate-2 border-t border-b border-rose-300/80 z-10" />
                      <div className="w-full aspect-square rounded overflow-hidden bg-stone-100">
                        <img 
                          src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'} 
                          alt="Bride" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="pt-1.5 text-center">
                        <h4 className="text-sm font-bold text-stone-800 font-serif leading-tight">{invitation.brideName}</h4>
                        <span className="text-[9px] uppercase tracking-widest text-rose-800 block font-mono">Mempelai Wanita</span>
                        <p className="text-[9px] text-stone-500 font-sans leading-tight pt-0.5">{invitation.brideParents}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ Prolog</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>Jadwal Acara ➔</span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 3: VINTAGE BOARDING TICKET STUBS (EVENTS)
                ======================================================== */}
            {currentPage === 3 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-left overflow-y-auto no-scrollbar">
                <div className="border-b border-stone-300 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    CHAPTER III • ITINERARY
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Tiket & Waktu Perayaan
                  </h2>
                </div>

                <div className="my-auto py-2 space-y-3">
                  {eventsList.map((ev: any, idx: number) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 80}>
                      <div 
                        className="relative p-3.5 rounded-lg bg-[#f4ecd8] border border-dashed border-stone-400 shadow-sm space-y-2 text-stone-800 font-mono"
                      >
                        {/* Ticket Stub Corner Notch */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#fbf7ee] border-r border-stone-400" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#fbf7ee] border-l border-stone-400" />

                        <div className="flex items-center justify-between border-b border-stone-300 pb-1.5">
                          <span className="text-xs font-bold uppercase text-amber-900 tracking-wider">
                            PASS #{idx + 1} • {ev.title}
                          </span>
                          <span className="text-[10px] bg-stone-300/80 px-1.5 py-0.5 rounded font-bold">
                            {ev.startTime} WIB
                          </span>
                        </div>

                        <div className="space-y-0.5 text-xs">
                          <p className="font-bold flex items-center gap-1 text-stone-900">
                            <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                            {ev.venueName}
                          </p>
                          <p className="text-[10px] text-stone-600 pl-4.5 font-sans leading-tight">
                            {ev.address}
                          </p>
                        </div>

                        {ev.googleMapsUrl && (
                          <div className="pt-1 text-right">
                            <a
                              href={ev.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-amber-800 hover:underline font-bold"
                            >
                              <ExternalLink className="w-3 h-3" /> Peta Lokasi
                            </a>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ Profil</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>Galeri Kenangan ➔</span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 4: SCRAPBOOK GALLERY & VIDEO REEL
                ======================================================== */}
            {currentPage === 4 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-left overflow-y-auto no-scrollbar">
                <div className="border-b border-stone-300 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    CHAPTER IV • FOTO & REEL
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Galeri Kenangan
                  </h2>
                </div>

                <div className="my-auto py-2 space-y-3">
                  {/* Embedded YouTube video if available */}
                  {youtubeEmbedUrl && (
                    <ScrollReveal direction="zoom">
                      <div className="w-full aspect-video rounded-lg overflow-hidden border border-stone-300 shadow-md bg-black relative group">
                        <iframe
                          src={youtubeEmbedUrl}
                          title="Scrapbook Film"
                          className="w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                    </ScrollReveal>
                  )}

                  {/* Collage of Polaroid Snapshots */}
                  <ScrollReveal direction="up">
                    <div className="grid grid-cols-2 gap-2.5">
                      {galleryList.slice(0, 4).map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveLightboxIndex(idx)}
                          className={`p-1.5 bg-white rounded shadow-sm border border-stone-200 cursor-pointer hover:scale-105 transition-transform ${
                            idx % 2 === 0 ? '-rotate-2' : 'rotate-2'
                          }`}
                        >
                          <div className="aspect-square rounded overflow-hidden bg-stone-100">
                            <img src={photo} alt={`Snap ${idx}`} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[8px] text-stone-400 font-mono block text-center pt-1">
                            Snapshot #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ Jadwal</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>Kartu Pos RSVP ➔</span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 5: VINTAGE POSTCARD RSVP
                ======================================================== */}
            {currentPage === 5 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-left overflow-y-auto no-scrollbar">
                {/* Postcard Stamp at Top Right */}
                <div className="absolute top-4 right-5 w-12 h-14 border-2 border-dashed border-stone-400 rounded p-1 bg-amber-50 text-center flex flex-col items-center justify-between shadow-sm">
                  <span className="text-[7px] font-mono text-stone-400 font-bold">AIR MAIL</span>
                  <Stamp className="w-5 h-5 text-amber-800" />
                  <span className="text-[6px] font-mono text-amber-900 font-bold">POSTAGE</span>
                </div>

                <div className="border-b border-stone-300 pb-2 pr-16">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    FINALE • POSTCARD
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Kartu Pos RSVP
                  </h2>
                </div>

                {/* Postcard Form */}
                <ScrollReveal direction="up">
                  <form onSubmit={onRsvpSubmit} className="my-auto py-2 space-y-3 font-sans">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-600 block font-bold">
                        Nama Pengirim:
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Nama Lengkap Anda"
                        className="w-full mt-0.5 px-3 py-1.5 text-xs rounded bg-white border border-stone-300 text-stone-800 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-600 block font-bold">
                        Konfirmasi Kehadiran:
                      </label>
                      <div className="grid grid-cols-2 gap-2 mt-0.5">
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('ATTENDING')}
                          className={`py-1.5 rounded text-xs font-bold border transition-colors ${
                            rsvpStatus === 'ATTENDING' 
                              ? 'bg-amber-800 text-white border-amber-900 shadow' 
                              : 'bg-white text-stone-700 border-stone-300'
                          }`}
                        >
                          ✓ Hadir
                        </button>
                        <button
                          type="button"
                          onClick={() => setRsvpStatus('DECLINED')}
                          className={`py-1.5 rounded text-xs font-bold border transition-colors ${
                            rsvpStatus === 'DECLINED' 
                              ? 'bg-stone-800 text-white border-stone-900 shadow' 
                              : 'bg-white text-stone-500 border-stone-300'
                          }`}
                        >
                          ✕ Tidak Hadir
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-stone-600 block font-bold">
                        Pesan & Doa Tertulis:
                      </label>
                      <textarea
                        rows={2}
                        value={rsvpMessage}
                        onChange={(e) => setRsvpMessage(e.target.value)}
                        placeholder="Tuliskan doa restu..."
                        className="w-full mt-0.5 px-3 py-1.5 text-xs rounded bg-white border border-stone-300 text-stone-800 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingRsvp}
                      className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingRsvp ? 'Mengirim Kartu...' : 'Kirim Kartu Pos'}</span>
                    </button>

                    {rsvpSuccess && (
                      <p className="text-xs text-emerald-700 text-center font-bold font-serif">
                        ✓ Kartu pos Anda telah terkirim ke buku kenangan kami!
                      </p>
                    )}
                  </form>
                </ScrollReveal>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ Galeri</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>
                    Kado Pernikahan ➔
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 6: VINTAGE POSTAL ENVELOPE & CASHLESS GIFTS
                ======================================================== */}
            {currentPage === 6 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-left overflow-y-auto no-scrollbar">
                {/* Washi Tape Strip at Top Left */}
                <div className="absolute top-2 left-4 w-16 h-4 bg-amber-200/90 rotate-3 shadow-sm border-t border-b border-amber-300/80 z-10" />

                <div className="border-b border-stone-300 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    CHAPTER VI • TANDA KASIH
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Kado & Tanda Kasih
                  </h2>
                </div>

                <div className="my-auto py-2 space-y-3 font-sans">
                  <p className="text-xs text-stone-600 font-serif leading-relaxed italic">
                    Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih secara cashless, dapat melalui rekening berikut:
                  </p>

                  <div className="space-y-2.5">
                    {(digitalGiftsList && digitalGiftsList.length > 0 ? digitalGiftsList : [
                      { bankName: 'Bank Central Asia (BCA)', accountNumber: '8820491823', accountName: `${groomName}`, shippingAddress: 'Jl. Melati No. 12, Menteng, Jakarta Pusat (Penerima: Kedua Mempelai)' },
                      { bankName: 'Bank Mandiri', accountNumber: '1370019284712', accountName: `${brideName}` }
                    ]).map((gift: any, idx: number) => (
                      <ScrollReveal key={idx} direction="up" delay={idx * 80}>
                        <div 
                          className="p-3 rounded-xl bg-[#f4ecd8] border border-stone-300/80 shadow-sm space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-amber-800" />
                              <span className="font-bold text-xs uppercase text-amber-950 font-mono">
                                {gift.bankName}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-200/70 text-amber-900 border border-amber-300">
                              Cashless
                            </span>
                          </div>

                          {gift.accountNumber && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-300 shadow-xs">
                              <span className="font-mono text-xs font-bold text-stone-900 tracking-wider">
                                {gift.accountNumber}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(gift.accountNumber, idx);
                                }}
                                className="px-2.5 py-1 rounded bg-amber-800 text-amber-100 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-900 transition-all cursor-pointer no-tap-flip"
                              >
                                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
                              </button>
                            </div>
                          )}

                          <span className="text-[10px] text-stone-600 block pl-0.5">
                            a.n. <strong className="text-stone-800">{gift.accountName || `${groomName} & ${brideName}`}</strong>
                          </span>

                          {gift.shippingAddress && (
                            <div className="mt-1 pt-1.5 border-t border-stone-300/60 text-[10px] text-stone-600 space-y-1">
                              <span className="font-bold text-amber-900 flex items-center gap-1 font-mono">
                                <Gift className="w-3 h-3 text-amber-800" /> Alamat Kirim Kado Fisik:
                              </span>
                              <p className="font-sans leading-tight bg-white/70 p-1.5 rounded border border-stone-200 text-stone-700">
                                {gift.shippingAddress}
                              </p>
                              <div className="text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(gift.shippingAddress, 999);
                                  }}
                                  className="inline-flex items-center gap-1 text-[9px] text-amber-800 hover:underline font-bold no-tap-flip cursor-pointer"
                                >
                                  {copiedIndex === 999 ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5" />}
                                  <span>{copiedIndex === 999 ? 'Alamat Tersalin' : 'Salin Alamat'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ RSVP</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToNextPage(); }}>
                    Ucapan Terima Kasih ➔
                  </span>
                </div>
              </div>
            )}

            {/* ========================================================
                PAGE 7: EPILOGUE & UCAPAN TERIMA KASIH (SCRAPBOOK PORTRAIT)
                ======================================================== */}
            {currentPage === 7 && (
              <div className="relative w-full h-full p-5 sm:p-6 flex flex-col justify-between text-center overflow-y-auto no-scrollbar">
                {/* Vintage Washi Tape Top Right */}
                <div className="absolute top-2 right-5 w-16 h-5 bg-rose-200/90 -rotate-3 shadow-sm border-t border-b border-rose-300/80 z-10" />

                <div className="border-b border-stone-300 pb-2 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-mono font-bold block">
                    EPILOGUE • UNTAIAN KASIH
                  </span>
                  <h2 
                    className="text-2xl font-bold text-stone-800"
                    style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                  >
                    Terima Kasih
                  </h2>
                </div>

                <div className="my-auto py-2 space-y-3">
                  {/* Polaroid Couple Photo Snapshot */}
                  <div className="relative mx-auto w-40 sm:w-44 p-2 bg-white shadow-md rounded border border-stone-200 -rotate-1 hover:rotate-0 transition-transform">
                    <div className="w-full aspect-[4/3] rounded overflow-hidden bg-stone-100">
                      <img 
                        src={invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'} 
                        alt="Couple" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span 
                      className="text-xs text-amber-900 font-bold block text-center pt-1.5 font-serif"
                      style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
                    >
                      {groomName} & {brideName}
                    </span>
                  </div>

                  {/* Heartfelt Note */}
                  <div className="space-y-1 px-2">
                    <p className="text-xs text-stone-700 leading-relaxed font-serif italic">
                      "Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu untuk lembaran baru kehidupan kami."
                    </p>
                    <p className="text-[10px] text-stone-500 font-serif pt-0.5">
                      Atas segala kebaikan, doa, dan cinta yang telah diberikan, kami haturkan terima kasih yang setulus-tulusnya.
                    </p>
                  </div>

                  {/* Family Sign-off */}
                  <div className="pt-0.5 space-y-0.5 font-serif">
                    <span className="text-[9px] uppercase tracking-widest text-amber-800 block font-mono">
                      Kami Yang Berbahagia,
                    </span>
                    <h3 
                      className="text-sm sm:text-base font-bold text-stone-900"
                      style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                    >
                      {groomName} & {brideName}
                    </h3>
                    <span className="text-[9px] text-stone-500 block">
                      Beserta Segenap Keluarga Besar
                    </span>
                  </div>

                  {/* Button Kembali ke Halaman Sampul */}
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentPage(0);
                      }}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer no-tap-flip"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Kembali ke Halaman Sampul</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-300 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                  <span className="cursor-pointer hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}>⤺ Kado</span>
                  <span className="cursor-pointer text-amber-800 font-bold hover:underline no-tap-flip" onClick={(e) => { e.stopPropagation(); setCurrentPage(0); }}>
                    Tutup Buku ↺
                  </span>
                </div>
              </div>
            )}

            {/* 3D Dynamic Page Curl Corner (Bottom Right) */}
            {currentPage < totalPages - 1 && (
              <motion.div
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotate: [0, -3, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: 'easeInOut' 
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextPage();
                }}
                className="absolute bottom-0 right-0 w-11 h-11 z-30 cursor-pointer group flex items-end justify-end p-0.5 no-tap-flip"
                title="Sentuh atau klik untuk membalik halaman"
              >
                <div className="w-9 h-9 bg-gradient-to-tl from-amber-400/90 via-stone-300/50 to-transparent group-hover:from-amber-500 rounded-tl-2xl shadow-md border-t border-l border-amber-300/80 flex items-center justify-center pl-1.5 pt-1.5 transition-all">
                  <span className="text-[10px] font-mono font-bold text-amber-950">➔</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
      </main>

      {/* ========================================================
          BOTTOM DESK CONTROLS: VINTAGE LEATHER TOOLBAR
          ======================================================== */}
      <footer 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md z-20 pt-3 pb-2 flex items-center justify-between no-tap-flip"
      >
        <button
          type="button"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            currentPage === 0
              ? isLight ? 'opacity-30 border-stone-300 text-stone-400 pointer-events-none' : 'opacity-30 border-stone-700 text-stone-600 pointer-events-none'
              : isLight
              ? 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50 shadow-md cursor-pointer'
              : 'bg-[#2b1f18] text-amber-200 border-amber-900/50 hover:bg-[#38281f] shadow-lg cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span><span className="hidden sm:inline">Halaman </span>Sebelumnya</span>
        </button>

        {/* Page Dot Pips */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                i === currentPage 
                  ? 'w-5 bg-amber-500' 
                  : isLight
                  ? 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  : 'w-1.5 bg-stone-600 hover:bg-stone-400'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            currentPage === totalPages - 1
              ? isLight ? 'opacity-30 border-stone-300 text-stone-400 pointer-events-none' : 'opacity-30 border-stone-700 text-stone-600 pointer-events-none'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 hover:brightness-110 shadow-lg cursor-pointer'
          }`}
        >
          <span><span className="hidden sm:inline">Halaman </span>Selanjutnya</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
