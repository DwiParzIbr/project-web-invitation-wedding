'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Train, MapPin, Calendar, Clock, Film, Mail, Gift, 
  Users, Volume2, VolumeX, Sparkles, X, ExternalLink, Heart, Check, Copy,
  Send, RotateCcw, ChevronRight, QrCode, ArrowRight, ShieldCheck, Ticket
} from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface MetroLoveExpressLayoutProps {
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

export const MetroLoveExpressLayout: React.FC<MetroLoveExpressLayoutProps> = ({
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
  // Gate check-in state (false: showing the Smart Transit Pass Card; true: entered metro track)
  const [hasEnteredStation, setHasEnteredStation] = useState(false);
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
      { name: 'Bapak Bupati Bengkulu Tengah', role: 'Tokoh Kehormatan' },
      { name: 'Keluarga Besar Mempelai Pria' },
      { name: 'Keluarga Besar Mempelai Wanita' },
    ];
  }

  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, []);
  const eventsList = invitation.events || [];
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, [
    { bankName: 'Bank Central Asia (BCA)', accountNumber: '8820491823', accountName: 'Andi Pratama' },
    { bankName: 'Bank Mandiri', accountNumber: '1370019284712', accountName: 'Sinta Nurhaliza' },
  ]);

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = groomName.charAt(0).toUpperCase() || 'G';
  const brideInitial = brideName.charAt(0).toUpperCase() || 'B';

  const weddingDateStr = new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z').toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBank(accountNumber);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // Station element refs for smooth auto-scroll along the metro track
  const stationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToStation = (id: string) => {
    const el = stationRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // The 7 Transit Stations along The Metro Love Express
  const stations = [
    {
      id: 'st-01',
      code: 'ST-01',
      type: 'ORIGIN',
      name: 'Stasiun Asmara',
      subtitle: 'Profil Kedua Mempelai',
      lineColor: 'bg-rose-500',
      badgeColor: 'border-rose-400 text-rose-300',
      emoji: '🌸',
    },
    {
      id: 'st-02',
      code: 'ST-02',
      type: 'INTERCHANGE',
      name: 'Stasiun Akad Suci',
      subtitle: 'Akad Nikah & Janji Ijab Qabul',
      lineColor: 'bg-sky-500',
      badgeColor: 'border-sky-400 text-sky-300',
      emoji: '🏛️',
    },
    {
      id: 'st-03',
      code: 'ST-03',
      type: 'GRAND CENTRAL',
      name: 'Stasiun Pesta Raya',
      subtitle: 'Resepsi Pernikahan & Jamuan',
      lineColor: 'bg-amber-500',
      badgeColor: 'border-amber-400 text-amber-300',
      emoji: '🎪',
    },
    {
      id: 'st-04',
      code: 'ST-04',
      type: 'OBSERVATION',
      name: 'Stasiun Kilas Balik',
      subtitle: 'Video & Galeri Foto Kenangan',
      lineColor: 'bg-purple-500',
      badgeColor: 'border-purple-400 text-purple-300',
      emoji: '🎬',
    },
    {
      id: 'st-05',
      code: 'ST-05',
      type: 'VALIDATOR GATE',
      name: 'Stasiun Gerbang Tamu',
      subtitle: 'Validasi Tiket & Form RSVP',
      lineColor: 'bg-emerald-500',
      badgeColor: 'border-emerald-400 text-emerald-300',
      emoji: '📮',
    },
    {
      id: 'st-06',
      code: 'ST-06',
      type: 'TERMINAL KASIH',
      name: 'Stasiun Berkah Kasih',
      subtitle: 'Amplop Digital & Kado Fisik',
      lineColor: 'bg-yellow-500',
      badgeColor: 'border-yellow-400 text-yellow-300',
      emoji: '🎁',
    },
    ...(showTurutMengundang ? [{
      id: 'st-turut',
      code: 'ST-07',
      type: 'HONORARY HUB',
      name: 'Stasiun Kehormatan',
      subtitle: 'Keluarga & Turut Mengundang',
      lineColor: 'bg-cyan-500',
      badgeColor: 'border-cyan-400 text-cyan-300',
      emoji: '👥',
    }] : []),
    {
      id: 'st-07',
      code: showTurutMengundang ? 'ST-08' : 'ST-07',
      type: 'TERMINUS',
      name: 'Stasiun Terima Kasih',
      subtitle: 'Ungkapan Syukur & Epilog',
      lineColor: 'bg-indigo-500',
      badgeColor: 'border-indigo-400 text-indigo-300',
      emoji: '🙏',
    },
  ];

  const handleTapIn = () => {
    setHasEnteredStation(true);
    if (toggleMusic && !isPlayingMusic) {
      toggleMusic();
    }
  };

  return (
    <div className={`relative z-10 w-full min-h-screen select-none flex flex-col font-sans ${
      isLight ? 'bg-[#F9FAFB] text-slate-800' : 'bg-[#070b14] text-white'
    }`}>
      {/* Background Metro Schematic Grid */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${
        isLight
          ? 'bg-gradient-to-b from-[#F9FAFB] via-[#F3F4F6] to-[#E5E7EB]'
          : 'bg-gradient-to-b from-[#050810] via-[#0b101f] to-[#12192d]'
      }`} />
      <div 
        className={`fixed inset-0 pointer-events-none z-0 ${isLight ? 'opacity-10' : 'opacity-20'}`}
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(to right, #00000015 1px, transparent 1px), linear-gradient(to bottom, #00000015 1px, transparent 1px)'
            : 'linear-gradient(to right, #ffffff0d 1px, transparent 1px), linear-gradient(to bottom, #ffffff0d 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* ========================================================
          COVER GATE: SMART TRANSIT PASS CARD (TAMPILAN TIKET AWAL)
          ======================================================== */}
      <AnimatePresence>
        {!hasEnteredStation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050811]/95 backdrop-blur-xl"
          >
            <div className="w-full max-w-sm flex flex-col items-center space-y-6">
              {/* Monogram Crest Top Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono tracking-widest uppercase">
                <Train className="w-3.5 h-3.5 text-amber-400" />
                <span>WEDDORA METRO EXPRESS</span>
              </div>

              {/* The Physical-Digital Transit Pass Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-full aspect-[1.58/1] rounded-3xl bg-gradient-to-br from-slate-900 via-[#10192e] to-[#1c2948] border-2 border-amber-400/80 shadow-[0_25px_60px_rgba(245,158,11,0.25)] p-5 flex flex-col justify-between relative overflow-hidden text-left"
              >
                {/* Chip IC Card Graphic */}
                <div className="absolute top-5 right-5 w-11 h-9 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-[1px] shadow-sm flex items-center justify-center">
                  <div className="w-full h-full rounded-[5px] bg-amber-200/90 border border-amber-500/50 flex flex-col justify-around p-1">
                    <div className="h-[1px] bg-amber-800/40 w-full" />
                    <div className="h-[1px] bg-amber-800/40 w-full" />
                  </div>
                </div>

                {/* Card Top Title */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-300 font-bold">
                      TRANSIT PASS • UNLIMITED LOVE PASS
                    </span>
                  </div>
                  <h3 
                    className="text-lg font-bold text-white pt-1 tracking-wide"
                    style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                  >
                    {groomName} & {brideName}
                  </h3>
                  <span className="text-[9px] text-slate-400 font-mono block">
                    Jalur Asmara • Tokyo & London Transit Edition
                  </span>
                </div>

                {/* Passenger Info & Date */}
                <div className="space-y-1 bg-slate-950/70 p-2.5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between text-[9px] font-mono">
                    <span className="text-slate-400">PENUMPANG VIP:</span>
                    <span className="text-slate-400">TANGGAL BERANGKAT:</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold font-mono">
                    <span className="text-amber-300 truncate max-w-[140px]">{guestName}</span>
                    <span className="text-white">{new Date(invitation.weddingDate || '2026-12-12').toLocaleDateString('id-ID')}</span>
                  </div>
                </div>

                {/* Card Bottom: Barcode Strip */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <div className="font-mono text-[9px] text-slate-400">
                    ID: WME-2026-LOVE
                  </div>
                  {/* Decorative Barcode Lines */}
                  <div className="flex items-center gap-0.5 h-4 opacity-70">
                    {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2].map((w, i) => (
                      <div key={i} style={{ width: `${w}px` }} className="h-full bg-amber-300" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Tap In Action Button */}
              <button
                type="button"
                onClick={handleTapIn}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4" />
                <span>Tap Masuk Peron / Tap In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-slate-400 font-mono text-center">
                Ketuk tombol di atas untuk membuka gerbang peron dan memulai perjalanan cinta.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          STICKY TOP HEADER: IN-CABIN OVERHEAD LED ROUTE STRIP
          ======================================================== */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b shadow-2xl shrink-0 ${
        isLight
          ? 'bg-white/95 border-stone-200 text-slate-800'
          : 'bg-slate-950/90 border-white/10 text-white'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Metro Line Icon */}
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black font-mono shadow-md">
              <Train className="w-4 h-4" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className={`text-[9px] uppercase tracking-[0.2em] font-bold font-mono ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}>
                  THE METRO LOVE EXPRESS
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h1 
                className={`text-xs sm:text-sm font-bold tracking-wide leading-tight truncate max-w-[200px] sm:max-w-none ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
                style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
              >
                {groomName} & {brideName}
              </h1>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline-block text-[10px] font-mono px-2.5 py-1 rounded-full border ${
              isLight
                ? 'text-slate-600 bg-stone-100 border-stone-200'
                : 'text-slate-300 bg-white/5 border-white/10'
            }`}>
              Penumpang: <strong className={isLight ? 'text-amber-800' : 'text-amber-300'}>{guestName}</strong>
            </span>

            {toggleMusic && (
              <button
                onClick={toggleMusic}
                className={`w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow cursor-pointer ${
                  isLight
                    ? 'bg-white text-amber-700 border-amber-300 shadow-sm'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                }`}
                title={isPlayingMusic ? 'Mute Musik' : 'Putar Musik'}
              >
                {isPlayingMusic ? <Volume2 className="w-4 h-4 text-amber-500 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            )}
          </div>
        </div>

        {/* IN-CABIN OVERHEAD LED ROUTE STRIP (Bilah Rute Stasiun) */}
        <div className={`w-full border-t py-2 px-3 overflow-x-auto no-scrollbar ${
          isLight ? 'border-stone-200 bg-stone-50' : 'border-white/5 bg-[#090e1c]'
        }`}>
          <div className="flex items-center gap-1.5 sm:gap-2 max-w-4xl mx-auto justify-start sm:justify-center">
            {stations.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => scrollToStation(st.id)}
                className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-white hover:bg-amber-100/60 border-stone-300 hover:border-amber-400 text-slate-700 hover:text-amber-900'
                    : 'bg-white/5 hover:bg-amber-400/20 border-white/10 hover:border-amber-400/50 text-slate-200 hover:text-amber-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[9px] font-bold flex items-center justify-center font-mono">
                  {st.code}
                </span>
                <span>{st.name.replace('Stasiun ', '')}</span>
                {idx < stations.length - 1 && (
                  <span className={isLight ? 'text-stone-400 pl-0.5' : 'text-slate-600 pl-0.5'}>➔</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ========================================================
          METRO TRACK CANVAS: 7 EXPANSIVE TRANSIT STATIONS
          ======================================================== */}
      <main className="relative z-10 flex-1 w-full max-w-2xl mx-auto px-4 py-8 overflow-visible">
        {/* Intro Signboard */}
        <ScrollReveal direction="fade">
          <div className="text-center pb-8 space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono">
              <Train className="w-3.5 h-3.5 text-amber-400" />
              <span>Peta Rute Kereta Cepat Asmara • {stations.length} Stasiun</span>
            </div>
            <h2 
              className="text-2xl sm:text-3xl font-bold text-white tracking-wide"
              style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
            >
              Peta Transit Jalur Cinta
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
              Kereta melaju menyusuri stasiun kenangan menuju pelabuhan hidup bersama. Silakan ikuti peron demi peron berikut:
            </p>
          </div>
        </ScrollReveal>

        {/* The Vertical Gleaming Subway Track Line */}
        <div className="relative space-y-16 sm:space-y-20 pb-24">
          {/* Double Track Rail Lines */}
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-2.5 bg-gradient-to-b from-amber-400/50 via-amber-300/40 to-amber-500/50 rounded-full pointer-events-none -z-10 shadow-[0_0_20px_rgba(245,158,11,0.35)]" />
          <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0.5 border-r-2 border-dashed border-amber-200/70 pointer-events-none -z-10" />

          {/* ----------------------------------------------------
              STASIUN 01: STASIUN ASMARA (PROFIL KEDUA MEMPELAI)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-01'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center justify-center font-mono">
                    01
                  </span>
                  <span className="text-[11px] uppercase font-bold text-rose-300 tracking-wider font-mono">
                    ST-01 • STASIUN ASMARA (ORIGIN)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-rose-400 font-mono font-bold block">
                      PERON UTAMA • TITIK BERANGKAT
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Profil Kedua Mempelai</h3>
                  </div>
                  <span className="text-2xl">🌸</span>
                </div>

                {/* Couple Profile Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Groom Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                    <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-amber-400 shadow-md">
                      <img src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'} alt="Groom" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">{invitation.groomName}</h4>
                      <span className="text-[10px] text-amber-400 block font-mono">Mempelai Pria</span>
                      <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.groomParents}</p>
                      {invitation.groomInstagram && (
                        <span className="text-[10px] text-sky-400 font-mono block pt-1">{invitation.groomInstagram}</span>
                      )}
                    </div>
                  </div>

                  {/* Bride Card */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                    <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-2 border-rose-400 shadow-md">
                      <img src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'} alt="Bride" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-serif">{invitation.brideName}</h4>
                      <span className="text-[10px] text-rose-400 block font-mono">Mempelai Wanita</span>
                      <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.brideParents}</p>
                      {invitation.brideInstagram && (
                        <span className="text-[10px] text-sky-400 font-mono block pt-1">{invitation.brideInstagram}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sacred Quote */}
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-center space-y-1">
                  <p className="text-xs text-rose-200 font-serif italic">
                    "{invitation.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri agar kamu merasa tenteram bersamanya.'}"
                  </p>
                  <span className="text-[9px] text-rose-400 font-mono block">
                    {invitation.quoteSource || 'QS. Ar-Rum: 21'}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 02: STASIUN AKAD SUCI (INTERCHANGE HUB)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-02'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-black text-[10px] flex items-center justify-center font-mono">
                    02
                  </span>
                  <span className="text-[11px] uppercase font-bold text-sky-300 tracking-wider font-mono">
                    ST-02 • STASIUN AKAD SUCI (INTERCHANGE)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-sky-400 font-mono font-bold block">
                      PERON SAKRAL • JANJI SETIA
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Akad Nikah / Janji Suci</h3>
                  </div>
                  <span className="text-2xl">🏛️</span>
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

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                        {eventsList[0].venueName}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{eventsList[0].address}</p>
                    </div>

                    {eventsList[0].googleMapsUrl && (
                      <div className="pt-2">
                        <a
                          href={eventsList[0].googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-md"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Buka Rute Stasiun Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Jadwal acara akad nikah belum diatur.</p>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 03: STASIUN PESTA RAYA (GRAND CENTRAL)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-03'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono">
                    03
                  </span>
                  <span className="text-[11px] uppercase font-bold text-amber-300 tracking-wider font-mono">
                    ST-03 • STASIUN PESTA RAYA (GRAND CENTRAL)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-amber-400 font-mono font-bold block">
                      PERON UTAMA • PERAYAAN & JAMUAN
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Resepsi Pernikahan</h3>
                  </div>
                  <span className="text-2xl">🎪</span>
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

                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        {(eventsList[1] || eventsList[0]).venueName}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{(eventsList[1] || eventsList[0]).address}</p>
                    </div>

                    {(eventsList[1] || eventsList[0]).googleMapsUrl && (
                      <div className="pt-2">
                        <a
                          href={(eventsList[1] || eventsList[0]).googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 transition-all shadow-md"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Buka Rute Pesta Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 04: STASIUN KILAS BALIK (OBSERVATION DECK)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-04'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center font-mono">
                    04
                  </span>
                  <span className="text-[11px] uppercase font-bold text-purple-300 tracking-wider font-mono">
                    ST-04 • STASIUN KILAS BALIK (OBSERVATION DECK)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-purple-400 font-mono font-bold block">
                      PERON SINEMA • REKAMAN JEJAK
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Video Trailer & Galeri Kenangan</h3>
                  </div>
                  <span className="text-2xl">🎬</span>
                </div>

                {/* YouTube Video Reel */}
                {youtubeEmbedUrl && (
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Metro Love Reel"
                      className="w-full h-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Photo Thumbnails */}
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
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 05: STASIUN GERBANG TAMU (VALIDATOR GATE / RSVP)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-05'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono">
                    05
                  </span>
                  <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider font-mono">
                    ST-05 • STASIUN GERBANG TAMU (VALIDATOR GATE)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-mono font-bold block">
                      VALIDASI TIKET • KONFIRMASI KEHADIRAN
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Buku Tamu RSVP & Doa Restu</h3>
                  </div>
                  <span className="text-2xl">📮</span>
                </div>

                {/* RSVP Form */}
                <form onSubmit={onRsvpSubmit} className="space-y-3 font-sans">
                  <div>
                    <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Nama Penumpang</label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      className={`w-full mt-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-slate-950 border-white/20 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Status Kehadiran</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('ATTENDING')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                          rsvpStatus === 'ATTENDING'
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : isLight
                            ? 'bg-stone-100 text-slate-700 border border-stone-300'
                            : 'bg-slate-950 text-slate-400 border border-white/10'
                        }`}
                      >
                        ✓ Hadir di Peron
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('DECLINED')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                          rsvpStatus === 'DECLINED'
                            ? 'bg-rose-700 text-white font-black'
                            : isLight
                            ? 'bg-stone-100 text-slate-700 border border-stone-300'
                            : 'bg-slate-950 text-slate-400 border border-white/10'
                        }`}
                      >
                        ✕ Tidak Dapat Hadir
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Doa & Ucapan Selamat</label>
                    <textarea
                      rows={3}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder="Tuliskan ucapan dan doa terbaik untuk perjalanan kami..."
                      className={`w-full mt-1 px-3 py-2 text-xs rounded-xl border focus:outline-none focus:border-emerald-500 ${
                        isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-slate-950 border-white/20 text-white'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRsvp ? 'Memvalidasi...' : 'Validasi Tiket & Kirim Doa'}</span>
                  </button>

                  {rsvpSuccess && (
                    <p className="text-xs text-emerald-400 text-center font-bold">
                      ✓ Tiket tervalidasi! Terima kasih atas doa dan konfirmasinya.
                    </p>
                  )}
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 06: STASIUN BERKAH KASIH (TERMINAL KASIH)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-06'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-yellow-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono">
                    06
                  </span>
                  <span className="text-[11px] uppercase font-bold text-yellow-300 tracking-wider font-mono">
                    ST-06 • STASIUN BERKAH KASIH (CASHLESS ANGPAO)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-yellow-400 font-mono font-bold block">
                      PERON TANDA KASIH • REKENING CASHLESS
                    </span>
                    <h3 className="text-xl font-bold text-white font-serif">Kado Pernikahan & Angpau</h3>
                  </div>
                  <span className="text-2xl">🎁</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat menggunakan rekening di bawah ini:
                </p>

                {/* Bank Cards */}
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
            </ScrollReveal>
          </div>

          {/* ----------------------------------------------------
              STASIUN 07: STASIUN KEHORMATAN (TURUT MENGUNDANG)
              ---------------------------------------------------- */}
          {showTurutMengundang && (
            <div 
              ref={(el) => { stationRefs.current['st-turut'] = el; }}
              className="relative flex flex-col items-center"
            >
              <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
                {/* Station Signboard Header */}
                <div className="mb-4 z-20">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 shadow-[0_0_15px_rgba(6,182,212,0.4)] ${
                    isLight ? 'bg-white border-cyan-500 text-slate-900' : 'bg-[#0a1020] border-cyan-400 text-cyan-300'
                  }`}>
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center font-mono">
                      07
                    </span>
                    <span className={`text-[11px] uppercase font-bold tracking-wider font-mono ${isLight ? 'text-cyan-800' : 'text-cyan-300'}`}>
                      ST-07 • STASIUN KEHORMATAN (TURUT MENGUNDANG)
                    </span>
                  </div>
                </div>

                {/* Station Card Content */}
                <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-left space-y-4 border ${
                  isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
                }`}>
                  <div className={`border-b pb-3 flex items-center justify-between ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                    <div>
                      <span className={`text-[9px] uppercase tracking-widest font-mono font-bold block ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                        PERON KEHORMATAN • KELUARGA BESAR
                      </span>
                      <h3 
                        className={`text-xl font-bold pt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}
                        style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                      >
                        {turutConfig?.title?.trim() || 'Turut Mengundang'}
                      </h3>
                    </div>
                    <span className="text-2xl">👥</span>
                  </div>

                  <p className={`text-xs leading-relaxed font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {turutConfig?.subtitle?.trim() || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga atas kehadiran dan doa restu Bapak/Ibu/Saudara/i:'}
                  </p>

                  {/* Honored Guest Cards */}
                  <div className="space-y-2.5">
                    {turutItems.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                          isLight 
                            ? 'bg-stone-50 border border-stone-200/90 hover:border-cyan-400 shadow-xs' 
                            : 'bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 font-mono font-bold text-xs shadow-xs ${
                            isLight 
                              ? 'bg-cyan-100/70 border-cyan-300 text-cyan-800' 
                              : 'bg-cyan-500/15 border-cyan-400/30 text-cyan-400'
                          }`}>
                            ✦
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className={`text-sm font-bold tracking-wide leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {item.name}
                            </h4>
                            {item.role && (
                              <span className={`text-[11px] block mt-0.5 font-medium leading-tight font-mono ${isLight ? 'text-cyan-700' : 'text-cyan-300/90'}`}>
                                {item.role}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold shrink-0 ml-2 ${
                          isLight 
                            ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' 
                            : 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/30'
                        }`}>
                          Tamu Terhormat
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Sign-off inside card */}
                  <div className={`pt-2 text-center border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                    <span className={`text-[10px] tracking-wider uppercase font-semibold font-mono ${isLight ? 'text-cyan-800' : 'text-cyan-400/90'}`}>
                      Beserta Segenap Keluarga Besar Kedua Mempelai
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          )}

          {/* ----------------------------------------------------
              STASIUN AKHIR: STASIUN TERIMA KASIH (FINAL DESTINATION)
              ---------------------------------------------------- */}
          <div 
            ref={(el) => { stationRefs.current['st-07'] = el; }}
            className="relative flex flex-col items-center"
          >
            <ScrollReveal direction="up" distance="30px" className="w-full flex flex-col items-center">
              {/* Station Signboard Header */}
              <div className="mb-4 z-20">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020] border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                  <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center font-mono">
                    {showTurutMengundang ? '08' : '07'}
                  </span>
                  <span className="text-[11px] uppercase font-bold text-indigo-300 tracking-wider font-mono">
                    {showTurutMengundang ? 'ST-08' : 'ST-07'} • STASIUN TERIMA KASIH (TERMINUS)
                  </span>
                </div>
              </div>

              {/* Station Card Content */}
              <div className={`w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-4 border ${
                isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-gradient-to-b from-[#12192e] via-[#0f172a] to-[#0a0f1d] border border-white/15 text-white'
              }`}>
                <div className="w-16 h-16 rounded-full mx-auto bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                  <Heart className="w-8 h-8 text-rose-400 animate-pulse" />
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-mono font-bold block">
                    TUJUAN AKHIR PERJALANAN
                  </span>
                  <h3 
                    className="text-2xl font-bold text-white pt-1"
                    style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                  >
                    Ungkapan Terima Kasih
                  </h3>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-md mx-auto">
                  "Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu untuk perjalanan suci kami."
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

                {/* Action Button: Return to Station Origin */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => scrollToStation('st-01')}
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Naik Kereta Arah Balik (Ke Stasiun 01)</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Metro Footer Sign-off */}
        <ScrollReveal direction="fade">
          <div className="text-center pt-2 pb-12 space-y-2">
            <div className="w-12 h-[2px] bg-amber-400/40 mx-auto" />
            <p className="text-xs text-amber-300/80 font-mono">
              WEDDORA METRO EXPRESS • SERVICE LINE 2026
            </p>
          </div>
        </ScrollReveal>
      </main>

      {/* ========================================================
          BOTTOM DOCK: SATELLITE QUICK-JUMP SELECTOR
          ======================================================== */}
      <footer className="sticky bottom-0 z-40 w-full px-3 py-3 bg-gradient-to-t from-[#050810] via-[#0b101f]/95 to-transparent flex items-center justify-center shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-slate-950/90 border border-white/15 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] overflow-x-auto no-scrollbar max-w-full">
          {stations.map((st) => (
            <button
              key={st.id}
              onClick={() => scrollToStation(st.id)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="text-xs">{st.emoji}</span>
              <span>{st.code}</span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
