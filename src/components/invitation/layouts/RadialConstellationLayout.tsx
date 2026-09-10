'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MapPin, Sparkles, Film, Mail, Gift, 
  Volume2, VolumeX, X, ExternalLink, Heart, Check, Copy,
  RotateCw, RotateCcw, Compass, ChevronRight, Play, Calendar, Clock
} from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { TurutMengundangSection } from '../components/TurutMengundangSection';

interface RadialConstellationLayoutProps {
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

type NodeId = 'couple' | 'ceremony' | 'reception' | 'cinema' | 'rsvp' | 'gifts' | null;

export const RadialConstellationLayout: React.FC<RadialConstellationLayoutProps> = ({
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
  const [activeNode, setActiveNode] = useState<NodeId>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Live countdown state to wedding day
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const weddingDate = useMemo(() => new Date(invitation.weddingDate || '2026-12-12T08:00:00.000Z'), [invitation.weddingDate]);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = weddingDate.getTime() - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

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

  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, []);
  const eventsList = invitation.events || [];
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, [
    { bankName: 'Bank Central Asia (BCA)', accountNumber: '8820491823', accountHolder: 'Nicholas Hartanto' },
    { bankName: 'Bank Mandiri', accountNumber: '1370019284712', accountHolder: 'Yolanda Pricilla' },
  ]);

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const groomInitial = groomName.charAt(0).toUpperCase() || 'G';
  const brideInitial = brideName.charAt(0).toUpperCase() || 'B';

  const handleCopyAccount = (accountNumber: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedBank(accountNumber);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  // The 6 Orbiting Satellites / Constellation Nodes (Arranged radially at 60 degree intervals)
  const nodes = [
    {
      id: 'couple' as NodeId,
      name: 'Gazebo Mempelai',
      shortName: 'Mempelai',
      tagline: 'Profil Kedua Mempelai',
      emoji: '🌸',
      baseAngle: 270, // Top (12 o'clock)
      color: 'from-pink-500 to-rose-600',
      glow: '#f43f5e',
      border: 'border-pink-400',
      icon: Users,
    },
    {
      id: 'ceremony' as NodeId,
      name: 'Kapel Suci Akad',
      shortName: 'Akad',
      tagline: 'Akad Nikah & Janji Suci',
      emoji: '🏛️',
      baseAngle: 330, // Top-Right (02 o'clock)
      color: 'from-sky-500 to-blue-700',
      glow: '#0ea5e9',
      border: 'border-sky-400',
      icon: MapPin,
    },
    {
      id: 'reception' as NodeId,
      name: 'Tenda Pesta Resepsi',
      shortName: 'Resepsi',
      tagline: 'Perayaan & Jamuan Bahagia',
      emoji: '🎪',
      baseAngle: 30, // Bottom-Right (04 o'clock)
      color: 'from-amber-400 to-orange-600',
      glow: '#f59e0b',
      border: 'border-amber-400',
      icon: Sparkles,
    },
    {
      id: 'gifts' as NodeId,
      name: 'Peti Hadiah Kasih',
      shortName: 'Kado',
      tagline: 'Amplop Digital & Kado Fisik',
      emoji: '🎁',
      baseAngle: 90, // Bottom (06 o'clock)
      color: 'from-yellow-400 to-amber-600',
      glow: '#eab308',
      border: 'border-yellow-400',
      icon: Gift,
    },
    {
      id: 'rsvp' as NodeId,
      name: 'Kotak Pos RSVP',
      shortName: 'RSVP',
      tagline: 'Konfirmasi Kehadiran & Doa',
      emoji: '📮',
      baseAngle: 150, // Bottom-Left (08 o'clock)
      color: 'from-emerald-400 to-teal-700',
      glow: '#10b981',
      border: 'border-emerald-400',
      icon: Mail,
    },
    {
      id: 'cinema' as NodeId,
      name: 'Bioskop Kenangan',
      shortName: 'Galeri',
      tagline: 'Video & Galeri Foto',
      emoji: '🎬',
      baseAngle: 210, // Top-Left (10 o'clock)
      color: 'from-purple-500 to-indigo-700',
      glow: '#8b5cf6',
      border: 'border-purple-400',
      icon: Film,
    },
  ];

  const rotateWheel = (delta: number) => {
    setOrbitAngle((prev) => prev + delta);
  };

  return (
    <div className={`relative z-10 w-full h-[100dvh] overflow-hidden select-none flex flex-col justify-between font-sans ${
      isLight ? 'bg-[#F8F6F0] text-slate-800' : 'bg-[#050811] text-white'
    }`}>
      {/* ========================================================
          CELESTIAL BACKGROUND & STARFIELD
          ======================================================== */}
      <div className={`absolute inset-0 pointer-events-none ${
        isLight
          ? 'bg-gradient-to-b from-[#FAF7F2] via-[#F4EFE6] to-[#EBE3D5]'
          : 'bg-gradient-to-b from-[#03060f] via-[#090e21] to-[#150d24]'
      }`} />
      
      {/* Starfield with Dual Density Sparkles */}
      <div 
        className={`absolute inset-0 pointer-events-none ${isLight ? 'opacity-25' : 'opacity-40'}`}
        style={{
          backgroundImage: isLight
            ? 'radial-gradient(#b48e42 1.2px, transparent 1.2px), radial-gradient(#d4af37 0.8px, transparent 0.8px)'
            : 'radial-gradient(#ffffff 1.2px, transparent 1.2px), radial-gradient(#fbbf24 0.8px, transparent 0.8px)',
          backgroundSize: '40px 40px, 80px 80px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Floating Light Glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none ${
        isLight
          ? 'bg-gradient-to-tr from-amber-400/10 via-rose-300/15 to-amber-200/15'
          : 'bg-gradient-to-tr from-amber-500/15 via-purple-500/10 to-blue-500/15'
      }`} />

      {/* ========================================================
          TOP HEADER: CELESTIAL MONOGRAM & HUD
          ======================================================== */}
      <header className={`relative z-30 w-full px-4 sm:px-6 py-2.5 border-b flex items-center justify-between backdrop-blur-xl shrink-0 ${
        isLight
          ? 'border-stone-200 bg-white/90 text-slate-800'
          : 'border-white/10 bg-slate-950/70 text-white'
      }`}>
        <div className="flex items-center gap-3">
          {/* Monogram Crest */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-600 p-[1.5px] shadow-[0_0_12px_rgba(251,191,36,0.4)]">
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              isLight ? 'bg-white' : 'bg-[#0a0f1d]'
            }`}>
              <span 
                className="text-[11px] font-bold text-amber-600 dark:text-amber-300 tracking-tighter"
                style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
              >
                {groomInitial}&{brideInitial}
              </span>
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] uppercase tracking-[0.25em] font-bold font-mono ${
                isLight ? 'text-amber-800' : 'text-amber-300'
              }`}>
                RADIAL CONSTELLATION HUB
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            </div>
            <h1 
              className={`text-xs sm:text-sm font-bold tracking-wide leading-tight truncate max-w-[200px] sm:max-w-none ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
              style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
            >
              {groomName} & {brideName}
            </h1>
          </div>
        </div>

        {/* Right Controls: Guest Callout & Music */}
        <div className="flex items-center gap-2.5">
          <span className={`hidden sm:inline-block text-[10px] font-mono border px-3 py-1 rounded-full ${
            isLight
              ? 'text-slate-600 bg-stone-100 border-stone-200'
              : 'text-slate-300 bg-white/5 border-white/10'
          }`}>
            Tamu: <strong className={isLight ? 'text-amber-800' : 'text-amber-300'}>{guestName}</strong>
          </span>

          {toggleMusic && (
            <button
              onClick={toggleMusic}
              className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 hover:scale-110 active:scale-95 transition-all shadow-[0_0_12px_rgba(251,191,36,0.3)] cursor-pointer"
              title={isPlayingMusic ? 'Mute Musik' : 'Putar Musik'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 text-amber-300 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>
          )}
        </div>
      </header>

      {/* Orbit Dial Helper Banner */}
      <div className="relative z-20 w-full pt-1 text-center pointer-events-none shrink-0">
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/70 border border-amber-400/30 text-[10px] text-amber-200/90 font-mono tracking-tight shadow-md backdrop-blur-sm">
          <span>✨ Sentuh nodus satelit atau putar roda untuk menjelajah</span>
        </span>
      </div>

      {/* ========================================================
          MAIN RADIAL CONSTELLATION DASHBOARD (SINGLE-SCREEN HUB)
          ======================================================== */}
      <main className="relative flex-1 w-full overflow-hidden flex items-center justify-center p-2">
        {/* Radial Stage Container */}
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">

          {/* ========================================================
              CELESTIAL ORBIT RINGS & ASTROLABE (BACKGROUND)
              ======================================================== */}
          {/* Slow-Rotating Outer Celestial Zodiac Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 sm:inset-6 rounded-full border border-amber-400/20 border-dashed pointer-events-none"
          />

          {/* Reverse-Rotating Middle Orbit Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-16 sm:inset-20 rounded-full border border-cyan-400/15 pointer-events-none"
          />

          {/* SVG CONSTELLATION PATHLINES (RAYS CONNECTING CORE TO NODES) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node, i) => {
              const currentAngle = ((node.baseAngle + orbitAngle) * Math.PI) / 180;
              const radius = 42; // Percentage from center (50%)
              const x2 = 50 + radius * Math.cos(currentAngle);
              const y2 = 50 + radius * Math.sin(currentAngle);

              return (
                <g key={node.id}>
                  {/* Glowing Laser Beam Ray from Center to Satellite Node */}
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke={node.glow}
                    strokeWidth="1.5"
                    strokeOpacity="0.45"
                    strokeDasharray="4 6"
                  />
                  {/* Interconnecting Outer Constellation Shield Ring */}
                  {i < nodes.length && (() => {
                    const nextNode = nodes[(i + 1) % nodes.length];
                    const nextAngle = ((nextNode.baseAngle + orbitAngle) * Math.PI) / 180;
                    const nx2 = 50 + radius * Math.cos(nextAngle);
                    const ny2 = 50 + radius * Math.sin(nextAngle);
                    return (
                      <line
                        x1={`${x2}%`}
                        y1={`${y2}%`}
                        x2={`${nx2}%`}
                        y2={`${ny2}%`}
                        stroke="#fbbf24"
                        strokeWidth="1"
                        strokeOpacity="0.25"
                        strokeDasharray="3 5"
                      />
                    );
                  })()}
                </g>
              );
            })}
          </svg>

          {/* ========================================================
              INTI GRAVITASI CINTA (THE CENTRAL CORE PORTAL)
              ======================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center">
            {/* Concentric Golden Gravity Pulse Waves */}
            <div className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-amber-400/40 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-amber-300/20 animate-pulse pointer-events-none" />

            {/* Central Portal Plinth Card */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-b from-[#16213e] via-[#0f172a] to-[#0a0f1d] border-2 border-amber-400/80 shadow-[0_0_35px_rgba(251,191,36,0.35)] p-2 flex flex-col items-center justify-center backdrop-blur-xl"
            >
              {/* Couple Circular Photo Frame */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-amber-300 shadow-md">
                <img 
                  src={invitation.coverPhoto || invitation.groomPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500'} 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Couple Callout */}
              <span 
                className="text-[11px] sm:text-xs font-bold text-amber-200 block pt-1 font-serif leading-tight truncate max-w-[110px]"
                style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
              >
                {groomName} & {brideName}
              </span>

              {/* Live Countdown Pills */}
              <div className="flex items-center gap-1 pt-1 font-mono text-[8px] sm:text-[9px] text-amber-300">
                <span className="px-1 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                  {timeLeft.days}h
                </span>
                <span className="px-1 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                  {timeLeft.hours}j
                </span>
                <span className="px-1 py-0.5 rounded bg-amber-400/20 border border-amber-400/30">
                  {timeLeft.minutes}m
                </span>
              </div>
            </motion.div>

            {/* Orbit Dial Rotation Buttons */}
            <div className="absolute -bottom-8 flex items-center gap-2 z-30">
              <button
                type="button"
                onClick={() => rotateWheel(-60)}
                className={`px-2.5 py-1 rounded-full border text-[10px] font-mono flex items-center gap-1 transition-colors shadow cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-white/90 border-amber-400 text-amber-900 hover:bg-amber-50'
                    : 'bg-slate-900/90 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
                }`}
                title="Putar Kiri (Rotasi Berlawanan Jarum Jam)"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Putar</span>
              </button>
              <button
                type="button"
                onClick={() => rotateWheel(60)}
                className={`px-2.5 py-1 rounded-full border text-[10px] font-mono flex items-center gap-1 transition-colors shadow cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-white/90 border-amber-400 text-amber-900 hover:bg-amber-50'
                    : 'bg-slate-900/90 border-amber-400/40 text-amber-300 hover:bg-amber-400/20'
                }`}
                title="Putar Kanan (Rotasi Searah Jarum Jam)"
              >
                <span>Putar</span>
                <RotateCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ========================================================
              THE 6 ORBITING SATELLITE NODES (RADIAL WAYPOINTS)
              ======================================================== */}
          {nodes.map((node) => {
            const currentAngle = ((node.baseAngle + orbitAngle) * Math.PI) / 180;
            const radius = 42; // percentage from center
            const left = 50 + radius * Math.cos(currentAngle);
            const top = 50 + radius * Math.sin(currentAngle);
            const Icon = node.icon;

            return (
              <motion.div
                key={node.id}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                onClick={() => setActiveNode(node.id)}
              >
                {/* Pulsing Satellite Aura */}
                <span 
                  className="absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none"
                  style={{ backgroundColor: `${node.glow}40` }}
                />

                {/* Satellite Node Badge Card */}
                <motion.div
                  whileHover={{ scale: 1.22, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className={`relative p-2 sm:p-2.5 rounded-2xl bg-gradient-to-tr ${node.color} shadow-[0_8px_25px_rgba(0,0,0,0.85)] border-2 border-white/80 flex items-center justify-center transition-all`}
                  style={{ boxShadow: `0 0 20px ${node.glow}80` }}
                >
                  <span className="text-base sm:text-lg">{node.emoji}</span>
                </motion.div>

                {/* Floating Node Label Pill */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-white/20 backdrop-blur-md whitespace-nowrap shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-[10px] font-bold text-white tracking-wide block">
                    {node.shortName}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* ========================================================
          BOTTOM DOCK: SATELLITE QUICK-JUMP SELECTOR
          ======================================================== */}
      <footer className="relative z-30 w-full px-3 py-2.5 bg-gradient-to-t from-[#03060f] via-[#090e21]/90 to-transparent flex items-center justify-center shrink-0">
        <div className="flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-full bg-slate-950/85 border border-white/15 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.85)] overflow-x-auto no-scrollbar max-w-full">
          {nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => setActiveNode(node.id)}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-amber-400/50 text-[11px] font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="text-xs">{node.emoji}</span>
              <span>{node.shortName}</span>
            </button>
          ))}
        </div>
      </footer>

      {/* ========================================================
          GLASSMORPHISM MODAL POP-UPS UPON CLICKING SATELLITE NODES
          ======================================================== */}
      <AnimatePresence>
        {activeNode && (
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
                  ? 'bg-white/95 border-amber-300/60 shadow-[0_25px_60px_rgba(0,0,0,0.12)] text-slate-800'
                  : 'bg-[#0b101f]/95 border-amber-400/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveNode(null)}
                className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isLight ? 'bg-stone-100 hover:bg-stone-200 text-slate-700' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* MODAL 1: COUPLE GAZABO */}
              {activeNode === 'couple' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block font-mono">
                      🌸 NODUS 01 • GAZEBO MEMPELAI
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Profil Kedua Mempelai
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <ScrollReveal direction="left" distance="20px">
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                        <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-amber-400 shadow-md">
                          <img src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'} alt="Groom" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-serif">{invitation.groomName}</h4>
                          <span className="text-[10px] text-amber-400 block font-mono">Mempelai Pria</span>
                          <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.groomParents}</p>
                        </div>
                      </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" distance="20px">
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-center space-y-2">
                        <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-rose-400 shadow-md">
                          <img src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'} alt="Bride" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-serif">{invitation.brideName}</h4>
                          <span className="text-[10px] text-rose-400 block font-mono">Mempelai Wanita</span>
                          <p className="text-[10px] text-slate-400 pt-1 leading-tight">{invitation.brideParents}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              )}

              {/* MODAL 2: CEREMONY (AKAD) */}
              {activeNode === 'ceremony' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-sky-400 font-bold block font-mono">
                      🏛️ NODUS 02 • KAPEL SUCI AKAD
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Akad Nikah / Janji Suci
                    </h3>
                  </div>

                  {eventsList[0] ? (
                    <ScrollReveal direction="up">
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-sky-400 font-bold">{eventsList[0].title}</span>
                          <span className="text-slate-300">{eventsList[0].startTime} - {eventsList[0].endTime} WIB</span>
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
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-md"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Buka Navigasi Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ) : (
                    <p className="text-xs text-slate-400">Jadwal acara belum diatur.</p>
                  )}
                </div>
              )}

              {/* MODAL 3: RECEPTION (PESTA) */}
              {activeNode === 'reception' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block font-mono">
                      🎪 NODUS 03 • TENDA PESTA RESEPSI
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Resepsi Pernikahan
                    </h3>
                  </div>

                  {eventsList[1] || eventsList[0] ? (
                    <ScrollReveal direction="up">
                      <div className="space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-white/10">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-amber-400 font-bold">{(eventsList[1] || eventsList[0]).title}</span>
                          <span className="text-slate-300">{(eventsList[1] || eventsList[0]).startTime} - {(eventsList[1] || eventsList[0]).endTime} WIB</span>
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
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 transition-all shadow-md"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Buka Rute Pesta Resepsi
                            </a>
                          </div>
                        )}
                      </div>
                    </ScrollReveal>
                  ) : null}
                </div>
              )}

              {/* MODAL 4: CINEMA & GALLERY */}
              {activeNode === 'cinema' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block font-mono">
                      🎬 NODUS 04 • BIOSKOP KENANGAN
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Video & Galeri Kenangan
                    </h3>
                  </div>

                  {youtubeEmbedUrl && (
                    <ScrollReveal direction="zoom">
                      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-lg bg-black">
                        <iframe
                          src={youtubeEmbedUrl}
                          title="Island Cinema"
                          className="w-full h-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      </div>
                    </ScrollReveal>
                  )}

                  <ScrollReveal direction="up">
                    <div className="grid grid-cols-3 gap-2">
                      {galleryList.slice(0, 6).map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() => setActiveLightboxIndex(idx)}
                          className="aspect-square rounded-xl overflow-hidden border border-white/15 cursor-pointer group"
                        >
                          <img src={photo} alt={`Photo ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>
              )}

              {/* MODAL 5: RSVP & POSTBOX */}
              {activeNode === 'rsvp' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block font-mono">
                      📮 NODUS 05 • KOTAK POS DOA & RSVP
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Konfirmasi Kehadiran
                    </h3>
                  </div>

                  <ScrollReveal direction="up">
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
                          placeholder="Tuliskan ucapan dan doa terbaik..."
                          className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-white/20 text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingRsvp}
                        className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg cursor-pointer"
                      >
                        {isSubmittingRsvp ? 'Mengirim...' : 'Kirim Doa & Konfirmasi'}
                      </button>

                      {rsvpSuccess && (
                        <p className="text-xs text-emerald-400 text-center font-bold">
                          ✓ Terima kasih atas doa dan konfirmasinya!
                        </p>
                      )}
                    </form>
                  </ScrollReveal>
                </div>
              )}

              {/* MODAL 6: GIFTS & LOVE COTTAGE */}
              {activeNode === 'gifts' && (
                <div className="space-y-4 pt-1">
                  <div className="border-b border-white/10 pb-2">
                    <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block font-mono">
                      🎁 NODUS 06 • PETI HADIAH KASIH
                    </span>
                    <h3 
                      className="text-xl font-bold text-white"
                      style={{ fontFamily: `'${fonts?.heading || 'Playfair Display'}', serif` }}
                    >
                      Amplop Digital & Rekening
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Doa restu Anda merupakan karunia terindah bagi kami. Namun jika ingin memberikan tanda kasih secara digital, Anda dapat menggunakan rekening di bawah ini:
                  </p>

                  <div className="space-y-2.5">
                    {digitalGiftsList.map((g: any, idx: number) => (
                      <ScrollReveal key={idx} direction="up" delay={idx * 80}>
                        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">{g.bankName}</span>
                            <p className="text-sm font-mono font-bold text-white tracking-wider">{g.accountNumber}</p>
                            <p className="text-[10px] text-slate-400">a.n. {g.accountHolder || g.accountName}</p>
                          </div>
                          <button
                            onClick={() => handleCopyAccount(g.accountNumber)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            {copiedBank === g.accountNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedBank === g.accountNumber ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  <div className="pt-4 text-left">
                    <TurutMengundangSection
                      config={designSchema?.turutMengundang}
                      theme={theme}
                      fonts={fonts}
                      textPrimaryColor="#F8FAFC"
                      contentCardBg="rgba(15, 23, 42, 0.85)"
                      contentCardBorderClass="border border-amber-400/30 shadow-2xl"
                      cardBorderRadius="rounded-2xl"
                    />
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
