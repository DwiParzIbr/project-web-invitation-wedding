'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, Calendar, MapPin } from 'lucide-react';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';

interface InteractiveWaxSealEnvelopeProps {
  invitation: any;
  guestName: string;
  onOpen: () => void;
  theme: any;
  fonts: any;
  designSchema?: any;
}

export const InteractiveWaxSealEnvelope: React.FC<InteractiveWaxSealEnvelopeProps> = ({
  invitation,
  guestName,
  onOpen,
  theme,
  fonts,
  designSchema,
}) => {
  const isLight = isLightTheme(theme, designSchema);
  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  const groomInitial = getInitialLetter(invitation.groomName, 'B');
  const brideInitial = getInitialLetter(invitation.brideName, 'C');

  const handleSealClick = () => {
    if (isOpening || isOpened) return;
    setIsOpening(true);

    // Sequence timing:
    // 0.0s - 0.6s: Wax seal lifts & top flap flips up 180° in 3D
    // 0.4s - 1.4s: Card slides up smoothly from pocket
    // 1.6s: Trigger onOpen() to transition into full invitation view
    setTimeout(() => {
      setIsOpened(true);
      onOpen();
    }, 1600);
  };

  const primaryColor = theme?.primary || '#C9A66B';
  const secondaryColor = theme?.secondary || '#E6D3A9';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden select-none transition-colors duration-500 ${
      isLight ? 'bg-[#FAF8F5]' : 'bg-slate-950'
    }`}>
      {/* Dynamic atmospheric radial backdrop */}
      <div
        className="absolute inset-0 blur-3xl pointer-events-none"
        style={{
          opacity: isLight ? 0.2 : 0.3,
          background: `radial-gradient(circle at 50% 45%, ${primaryColor}55 0%, transparent 65%)`,
        }}
      />
      <div 
        className={`absolute inset-0 [background-size:24px_24px] pointer-events-none ${
          isLight 
            ? 'bg-[radial-gradient(#d4af37_1.2px,transparent_1.2px)] opacity-20' 
            : 'bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] opacity-40'
        }`} 
      />

      {/* Top Header Typography */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-6 z-10 max-w-md px-4"
      >
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border mb-2 shadow-sm ${
          isLight
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-900'
            : 'bg-gold-500/10 border-gold-500/20 text-gold-300'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-gold-400'}`} />
          <span
            className="text-[10px] uppercase tracking-[0.25em] font-bold"
            style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
          >
            Exclusive Wedding Invitation
          </span>
        </div>
        <h1
          className={`text-2xl sm:text-3xl font-bold tracking-wide ${
            isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
          }`}
          style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
        >
          {getCleanName(invitation.groomName)} & {getCleanName(invitation.brideName)}
        </h1>
      </motion.div>

      {/* 3D Envelope Master Container */}
      <div className="relative w-full max-w-[360px] sm:max-w-[390px] perspective-[1400px] z-20 flex flex-col items-center">
        <motion.div
          className={`relative w-full aspect-[4/3] rounded-2xl overflow-visible ${
            isLight
              ? 'shadow-[0_25px_60px_rgba(0,0,0,0.12)]'
              : 'shadow-[0_30px_70px_rgba(0,0,0,0.85)]'
          }`}
          animate={isOpening ? { scale: 1.04, y: -10 } : { scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* ========================================================
              LAYER 1: ENVELOPE BACK WALL & INTERIOR CAVITY LINING
              ======================================================== */}
          <div
            className="absolute inset-0 rounded-2xl border overflow-hidden"
            style={{
              borderColor: isLight ? 'rgba(212, 175, 55, 0.4)' : 'rgba(201, 166, 107, 0.4)',
              background: isLight 
                ? 'linear-gradient(160deg, #FBF9F5 0%, #F5EFE6 50%, #ECE4D6 100%)'
                : 'linear-gradient(160deg, #18130e 0%, #241c14 50%, #15110c 100%)',
              boxShadow: isLight
                ? 'inset 0 0 25px rgba(180,160,130,0.25)'
                : 'inset 0 0 30px rgba(0,0,0,0.9)',
            }}
          >
            {/* Elegant Luxury Damask / Silk Lining pattern inside envelope */}
            <div
              className={`absolute inset-0 ${isLight ? 'opacity-25' : 'opacity-15'}`}
              style={{
                backgroundImage: `radial-gradient(${primaryColor} 1.2px, transparent 1.2px)`,
                backgroundSize: '12px 12px',
              }}
            />
            {/* Golden ambient cavity glow */}
            <div
              className="absolute top-0 left-1/4 right-1/4 h-24 blur-xl opacity-20"
              style={{ background: primaryColor }}
            />
          </div>

          {/* ========================================================
              LAYER 2: THE INVITATION CARD (SLIDES UP ON OPEN)
              NOTE: Strictly opacity: 0 while closed to guarantee ZERO text leakage!
              ======================================================== */}
          <motion.div
            className={`absolute left-4 right-4 top-3 rounded-xl p-5 shadow-2xl flex flex-col items-center justify-between text-center border-2 z-10 overflow-hidden ${
              isLight ? 'border-amber-400/60' : 'border-gold-400/50'
            }`}
            style={{
              background: isLight
                ? 'linear-gradient(145deg, #FFFFFF 0%, #FAF8F5 100%)'
                : 'linear-gradient(145deg, #2b2117 0%, #1c150e 100%)',
              boxShadow: isLight
                ? '0 20px 40px rgba(0,0,0,0.12), inset 0 0 20px rgba(255,255,255,0.8)'
                : '0 20px 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(201,166,107,0.1)',
            }}
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={
              isOpening
                ? { y: -145, opacity: 1, scale: 1.02 }
                : { y: 20, opacity: 0, scale: 0.95 }
            }
            transition={{
              duration: 1.2,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Fine Ornamental Corner Borders on the Card */}
            <div className={`absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 ${isLight ? 'border-amber-500/70' : 'border-gold-400/70'}`} />
            <div className={`absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 ${isLight ? 'border-amber-500/70' : 'border-gold-400/70'}`} />
            <div className={`absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 ${isLight ? 'border-amber-500/70' : 'border-gold-400/70'}`} />
            <div className={`absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 ${isLight ? 'border-amber-500/70' : 'border-gold-400/70'}`} />

            {/* Card Content */}
            <div className={`w-full space-y-1 pt-1 border-b pb-2 ${isLight ? 'border-amber-300/40' : 'border-gold-500/20'}`}>
              <span
                className={`text-[9px] uppercase tracking-[0.25em] font-bold block ${
                  isLight ? 'text-amber-800' : 'text-gold-400'
                }`}
                style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
              >
                The Wedding Of
              </span>
              <h3
                className={`text-lg sm:text-xl font-bold leading-tight ${
                  isLight ? 'text-slate-900' : 'text-amber-100'
                }`}
                style={{ fontFamily: `'${fonts?.accent || 'Great Vibes'}', cursive` }}
              >
                {getCleanName(invitation.groomName)} & {getCleanName(invitation.brideName)}
              </h3>
            </div>

            {/* Photo / Monogram Badge in Card Center */}
            <div className="my-2">
              <div className="w-14 h-14 rounded-full mx-auto overflow-hidden border-2 border-gold-400/60 shadow-lg relative p-0.5 bg-gradient-to-tr from-gold-500 to-amber-200">
                <img
                  src={
                    invitation.coverPhoto ||
                    'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
                  }
                  alt="Couple"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className={`flex items-center justify-center gap-1.5 text-[11px] font-semibold mt-2 ${
                isLight ? 'text-amber-900' : 'text-gold-300'
              }`}>
                <Calendar className={`w-3 h-3 ${isLight ? 'text-amber-600' : 'text-gold-400'}`} />
                <span>
                  {new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Recipient Badge on Card */}
            <div className={`w-full rounded-lg py-1.5 px-3 border ${
              isLight ? 'bg-stone-100 border-amber-300/40' : 'bg-black/50 border-gold-500/20'
            }`}>
              <span className={`text-[9px] block uppercase tracking-wider ${
                isLight ? 'text-slate-500 font-semibold' : 'text-slate-400'
              }`}>
                Special Invitation For:
              </span>
              <p className={`text-xs font-bold truncate ${
                isLight ? 'text-amber-900' : 'text-gold-300'
              }`}>{guestName}</p>
            </div>
          </motion.div>

          {/* ========================================================
              LAYER 3: ENVELOPE FRONT POCKET (100% OPAQUE, ZERO LEAK)
              Completely covers bottom 58% of the envelope with solid fill
              and authentic paper fold lines
              ======================================================== */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
            {/* SVG Seamless Front Pocket:
                Left flap, Right flap, and Bottom flap combined with zero subpixel gaps */}
            <svg
              className="w-full h-full absolute inset-0"
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Pocket Gradients */}
                <linearGradient id="pocketBase" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isLight ? "#FCF9F2" : "#281f16"} />
                  <stop offset="50%" stopColor={isLight ? "#F3EAD9" : "#1e1811"} />
                  <stop offset="100%" stopColor={isLight ? "#E6DAC4" : "#14100b"} />
                </linearGradient>
                <linearGradient id="leftFoldGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor={isLight ? "#FAF5EA" : "#2c2219"} />
                  <stop offset="100%" stopColor={isLight ? "#EAE0CE" : "#1b150f"} />
                </linearGradient>
                <linearGradient id="rightFoldGrad" x1="100%" y1="50%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor={isLight ? "#FAF5EA" : "#2c2219"} />
                  <stop offset="100%" stopColor={isLight ? "#EAE0CE" : "#1b150f"} />
                </linearGradient>
                <linearGradient id="bottomFoldGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                  <stop offset="0%" stopColor={isLight ? "#E5D7BE" : "#16110c"} />
                  <stop offset="100%" stopColor={isLight ? "#F7EFE2" : "#2a2118"} />
                </linearGradient>
              </defs>

              {/* 1. Solid Pocket Base (Completely blocks card behind from y=120 to 300) */}
              <polygon
                points="0,110 200,195 400,110 400,300 0,300"
                fill="url(#pocketBase)"
              />

              {/* 2. Left Flap Triangle with subtle shadow */}
              <polygon
                points="0,0 0,300 200,195"
                fill="url(#leftFoldGrad)"
                opacity="0.95"
              />
              <line
                x1="0"
                y1="300"
                x2="200"
                y2="195"
                stroke={isLight ? "rgba(180,140,70,0.35)" : "rgba(201,166,107,0.25)"}
                strokeWidth="1.2"
              />

              {/* 3. Right Flap Triangle with subtle shadow */}
              <polygon
                points="400,0 400,300 200,195"
                fill="url(#rightFoldGrad)"
                opacity="0.95"
              />
              <line
                x1="400"
                y1="300"
                x2="200"
                y2="195"
                stroke={isLight ? "rgba(180,140,70,0.35)" : "rgba(201,166,107,0.25)"}
                strokeWidth="1.2"
              />

              {/* 4. Bottom Center Flap Triangle folding up */}
              <polygon
                points="0,300 200,195 400,300"
                fill="url(#bottomFoldGrad)"
              />
              <line
                x1="0"
                y1="300"
                x2="200"
                y2="195"
                stroke={isLight ? "rgba(180,140,70,0.45)" : "rgba(201,166,107,0.35)"}
                strokeWidth="1.5"
              />
              <line
                x1="400"
                y1="300"
                x2="200"
                y2="195"
                stroke={isLight ? "rgba(180,140,70,0.45)" : "rgba(201,166,107,0.35)"}
                strokeWidth="1.5"
              />

              {/* Outer Golden Border Rim */}
              <rect
                x="1"
                y="1"
                width="398"
                height="298"
                rx="16"
                fill="none"
                stroke={isLight ? "rgba(180,140,70,0.4)" : "rgba(201,166,107,0.3)"}
                strokeWidth="1.5"
              />
            </svg>

            {/* Gold Embossed Pocket Emblem at the Bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-50">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold-400" />
              <Heart className="w-3 h-3 text-gold-400 fill-gold-400/40" />
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
          </div>

          {/* ========================================================
              LAYER 4: TOP TRIANGULAR FLAP (FOLDS OPEN UPWARDS 180°)
              When closed, reaches y=58% (generously overlapping the bottom pocket)
              ======================================================== */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[60%] z-30 origin-top overflow-visible"
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={
              isOpening
                ? { rotateX: 180, zIndex: 5 }
                : { rotateX: 0, zIndex: 30 }
            }
            transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front Side of Top Triangular Flap */}
            <div
              className="w-full h-full relative"
              style={{
                filter: isLight ? 'drop-shadow(0 8px 14px rgba(0,0,0,0.15))' : 'drop-shadow(0 10px 18px rgba(0,0,0,0.75))',
              }}
            >
              <svg
                className="w-full h-full"
                viewBox="0 0 400 180"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor={isLight ? "#FDFBF7" : "#382c1f"} />
                    <stop offset="60%" stopColor={isLight ? "#F4ECD9" : "#2b2117"} />
                    <stop offset="100%" stopColor={isLight ? "#E5D7BE" : "#1f1710"} />
                  </linearGradient>
                </defs>

                {/* Main Triangle Flap */}
                <polygon
                  points="0,0 400,0 200,180"
                  fill="url(#topFlapGrad)"
                />

                {/* Elegant Double Gold Trim Lines along the Flap V-edge */}
                <polyline
                  points="0,0 200,180 400,0"
                  fill="none"
                  stroke="rgba(201,166,107,0.6)"
                  strokeWidth="1.5"
                />
                <polyline
                  points="12,0 200,168 388,0"
                  fill="none"
                  stroke="rgba(201,166,107,0.3)"
                  strokeWidth="0.8"
                  strokeDasharray="4 3"
                />
              </svg>
            </div>
          </motion.div>

          {/* ========================================================
              LAYER 5: 3D REALISTIC WAX SEAL BUTTON
              Centered precisely at the tip of the triangular flap (y ~ 57%)
              ======================================================== */}
          <div className="absolute top-[57%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            <motion.button
              type="button"
              onClick={handleSealClick}
              disabled={isOpening}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={
                isOpening
                  ? { scale: [1, 1.25, 0], opacity: [1, 1, 0] }
                  : { scale: [1, 1.03, 1] }
              }
              transition={
                isOpening
                  ? { duration: 0.5, ease: 'easeIn' }
                  : { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
              }
              className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.85)] flex items-center justify-center cursor-pointer group focus:outline-none"
              title="Ketuk segel lilin untuk membuka"
            >
              {/* Pulsing Golden Aura Ring Inviting Tap */}
              {!isOpening && (
                <span className="absolute -inset-2 rounded-full border border-gold-400/40 animate-ping opacity-40 pointer-events-none" />
              )}

              {/* Realistic Melted Wax Contour (Organic SVG shape with irregular melted lobes) */}
              <svg
                className="w-full h-full absolute inset-0 drop-shadow-lg"
                viewBox="0 0 100 100"
              >
                <defs>
                  <radialGradient id="waxBaseGrad" cx="35%" cy="32%" r="65%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="45%" stopColor="#991b1b" />
                    <stop offset="85%" stopColor="#7f1d1d" />
                    <stop offset="100%" stopColor="#450a0a" />
                  </radialGradient>
                  <linearGradient id="waxRimLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,220,150,0.5)" />
                    <stop offset="50%" stopColor="rgba(180,30,30,0.3)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
                  </linearGradient>
                </defs>

                {/* Irregular Melted Wax Organic Border */}
                <path
                  d="M50,4 C62,3 74,7 82,16 C90,25 96,38 95,50 C94,62 89,74 80,82 C71,90 59,96 48,95 C36,94 24,90 16,81 C8,72 3,60 4,48 C5,36 10,24 19,16 C28,8 39,4 50,4 Z"
                  fill="url(#waxBaseGrad)"
                  stroke="url(#waxRimLight)"
                  strokeWidth="1.5"
                />

                {/* Inner Embossed Ring Ridge */}
                <circle
                  cx="50"
                  cy="50"
                  r="34"
                  fill="none"
                  stroke="rgba(253,230,138,0.5)"
                  strokeWidth="1.2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="31"
                  fill="none"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth="1"
                />
              </svg>

              {/* Monogram Content Inside Stamped Center */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                <span
                  className="text-amber-100 font-extrabold text-base tracking-widest drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]"
                  style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                >
                  {groomInitial}&{brideInitial}
                </span>
                <Heart className="w-2.5 h-2.5 text-amber-200 fill-amber-200 drop-shadow mt-0.5" />
              </div>

              {/* Specular Liquid Wax Glare Reflection */}
              <div className="absolute top-2.5 left-3.5 w-4 h-2 rounded-full bg-white/40 blur-[1px] rotate-[-35deg] pointer-events-none" />
            </motion.button>
          </div>
        </motion.div>

        {/* ========================================================
            RECIPIENT CALLIGRAPHIC CARD & ACTION BUTTON
            ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-6 text-center space-y-3.5 w-full"
        >
          {/* Guest Name Calligraphic Plaque */}
          <div className={`p-3.5 rounded-2xl border backdrop-blur-md max-w-xs mx-auto shadow-xl ${
            isLight
              ? 'bg-white/95 border-amber-300/60 shadow-[0_10px_30px_rgba(0,0,0,0.08)]'
              : 'bg-slate-900/80 border-gold-500/30'
          }`}>
            <span className={`text-[10px] uppercase tracking-widest block font-semibold ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Kepada Yth. Tamu Undangan:
            </span>
            <p className={`text-sm sm:text-base font-bold mt-0.5 truncate ${
              isLight ? 'text-amber-900' : 'text-gold-300'
            }`}>
              {guestName}
            </p>
          </div>

          {/* Golden Shimmer CTA Button */}
          <button
            type="button"
            onClick={handleSealClick}
            disabled={isOpening}
            className="w-full max-w-xs py-3.5 rounded-full font-black text-xs tracking-wider text-slate-950 shadow-2xl flex items-center justify-center gap-2 mx-auto hover:brightness-110 active:scale-95 transition-all border border-gold-300 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor} 0%, ${primaryColor} 50%, #D4AF37 100%)`,
              boxShadow: isLight ? '0 10px 25px rgba(201,166,107,0.25)' : '0 10px 25px rgba(201,166,107,0.3)',
            }}
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>{isOpening ? 'MEMBUKA AMPLOP...' : 'BUKA AMPLOP BERSEGEL'}</span>
          </button>
        </motion.div>
      </div>

      {/* Gentle Subtitle Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-6 text-[11px] tracking-wide text-center z-10 ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}
      >
        Sentuh segel lilin untuk membuka kartu undangan & memutar musik
      </motion.p>
    </div>
  );
};
