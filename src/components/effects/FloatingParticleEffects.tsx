'use client';

import React from 'react';
import { Sparkles, Heart, Moon, Star, Flower2 } from 'lucide-react';

interface FloatingParticleEffectsProps {
  effectType?: 'rose-petals' | 'gold-dust' | 'sparkles' | 'islamic-stars' | 'gunungan-dust' | 'flying-birds' | 'butterfly-glow' | 'cherry-blossoms' | 'golden-hearts' | string;
}

export const FloatingParticleEffects: React.FC<FloatingParticleEffectsProps> = ({ effectType }) => {
  if (!effectType || effectType === 'none') return null;

  if (effectType === 'flying-birds') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes flyBird {
            0% { transform: translateX(-10vw) translateY(20vh) scale(0.6); opacity: 0.8; }
            50% { transform: translateX(50vw) translateY(10vh) scale(1); opacity: 1; }
            100% { transform: translateX(110vw) translateY(25vh) scale(0.7); opacity: 0; }
          }
          .animate-bird-1 { animation: flyBird 12s ease-in-out infinite; top: 15%; animation-delay: 0s; }
          .animate-bird-2 { animation: flyBird 16s ease-in-out infinite; top: 35%; animation-delay: 4s; }
        `}</style>
        <div className="absolute text-slate-200/60 animate-bird-1 font-serif text-lg flex items-center gap-1">
          🕊️ <span className="text-xs italic text-gold-300 font-sans font-semibold">Love Dove</span>
        </div>
        <div className="absolute text-slate-100/70 animate-bird-2 font-serif text-xl flex items-center gap-1">
          🕊️ 🕊️
        </div>
      </div>
    );
  }

  if (effectType === 'butterfly-glow') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatButterfly {
            0% { transform: translateY(100vh) translateX(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(50vh) translateX(30px) rotate(20deg); opacity: 1; }
            100% { transform: translateY(-10vh) translateX(-20px) rotate(-10deg); opacity: 0; }
          }
          .animate-butterfly-1 { animation: floatButterfly 11s ease-in-out infinite; left: 15%; animation-delay: 0s; }
          .animate-butterfly-2 { animation: floatButterfly 14s ease-in-out infinite; left: 65%; animation-delay: 3s; }
        `}</style>
        <div className="absolute text-amber-300/80 animate-butterfly-1 text-base">🦋</div>
        <div className="absolute text-purple-300/80 animate-butterfly-2 text-base">🦋</div>
      </div>
    );
  }

  if (effectType === 'cherry-blossoms') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatSakura {
            0% { transform: translateY(-5vh) rotate(0deg) translateX(0px); opacity: 0.8; }
            50% { transform: translateY(55vh) rotate(180deg) translateX(30px); opacity: 1; }
            100% { transform: translateY(105vh) rotate(360deg) translateX(-15px); opacity: 0; }
          }
          .animate-sakura-1 { animation: floatSakura 9s linear infinite; left: 20%; animation-delay: 0s; }
          .animate-sakura-2 { animation: floatSakura 13s linear infinite; left: 50%; animation-delay: 2s; }
          .animate-sakura-3 { animation: floatSakura 10s linear infinite; left: 80%; animation-delay: 4s; }
        `}</style>
        <div className="absolute text-pink-300/60 animate-sakura-1">🌸</div>
        <div className="absolute text-pink-400/50 animate-sakura-2"><Flower2 className="w-4 h-4 text-pink-300/60" /></div>
        <div className="absolute text-pink-300/60 animate-sakura-3">🌸</div>
      </div>
    );
  }

  if (effectType === 'golden-hearts') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatHearts {
            0% { transform: translateY(100vh) scale(0.6); opacity: 0.7; }
            50% { transform: translateY(45vh) scale(1.1); opacity: 1; }
            100% { transform: translateY(-10vh) scale(0.8); opacity: 0; }
          }
          .animate-heart-1 { animation: floatHearts 8s ease-in-out infinite; left: 25%; animation-delay: 0s; }
          .animate-heart-2 { animation: floatHearts 11s ease-in-out infinite; left: 70%; animation-delay: 3s; }
        `}</style>
        <div className="absolute text-gold-400/70 animate-heart-1"><Heart className="w-5 h-5 fill-gold-400/30" /></div>
        <div className="absolute text-amber-300/60 animate-heart-2"><Heart className="w-4 h-4 fill-amber-300/30" /></div>
      </div>
    );
  }

  if (effectType === 'rose-petals') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatRose {
            0% { transform: translateY(-10%) rotate(0deg) translateX(0px); opacity: 0.8; }
            50% { transform: translateY(50vh) rotate(180deg) translateX(25px); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(-20px); opacity: 0; }
          }
          .animate-rose-1 { animation: floatRose 9s linear infinite; left: 10%; animation-delay: 0s; }
          .animate-rose-2 { animation: floatRose 12s linear infinite; left: 30%; animation-delay: 2s; }
          .animate-rose-3 { animation: floatRose 8s linear infinite; left: 55%; animation-delay: 4s; }
          .animate-rose-4 { animation: floatRose 11s linear infinite; left: 75%; animation-delay: 1s; }
        `}</style>
        <div className="absolute text-rose-300/40 animate-rose-1"><Flower2 className="w-5 h-5" /></div>
        <div className="absolute text-rose-400/30 animate-rose-2"><Flower2 className="w-4 h-4" /></div>
        <div className="absolute text-pink-300/40 animate-rose-3"><Heart className="w-4 h-4 fill-pink-400/20" /></div>
        <div className="absolute text-rose-300/40 animate-rose-4"><Flower2 className="w-6 h-6" /></div>
      </div>
    );
  }

  if (effectType === 'sparkles' || effectType === 'gold-dust' || effectType === 'gunungan-dust') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatDust {
            0% { transform: translateY(100vh) scale(0.6); opacity: 0; }
            50% { opacity: 0.9; }
            100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
          }
          .animate-dust-1 { animation: floatDust 7s ease-in-out infinite; left: 15%; animation-delay: 0s; }
          .animate-dust-2 { animation: floatDust 10s ease-in-out infinite; left: 40%; animation-delay: 3s; }
          .animate-dust-3 { animation: floatDust 8s ease-in-out infinite; left: 65%; animation-delay: 1.5s; }
          .animate-dust-4 { animation: floatDust 11s ease-in-out infinite; left: 85%; animation-delay: 4.5s; }
        `}</style>
        <div className="absolute text-gold-400/60 animate-dust-1"><Sparkles className="w-4 h-4" /></div>
        <div className="absolute text-amber-300/50 animate-dust-2"><Sparkles className="w-3 h-3" /></div>
        <div className="absolute text-gold-300/70 animate-dust-3"><Sparkles className="w-5 h-5" /></div>
        <div className="absolute text-amber-400/60 animate-dust-4"><Sparkles className="w-4 h-4" /></div>
      </div>
    );
  }

  if (effectType === 'islamic-stars') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <style>{`
          @keyframes floatIslamic {
            0% { transform: translateY(-5%) rotate(0deg); opacity: 0.4; }
            50% { transform: translateY(50vh) rotate(180deg); opacity: 0.9; }
            100% { transform: translateY(105vh) rotate(360deg); opacity: 0.2; }
          }
          .animate-islamic-1 { animation: floatIslamic 12s linear infinite; left: 20%; animation-delay: 0s; }
          .animate-islamic-2 { animation: floatIslamic 15s linear infinite; left: 50%; animation-delay: 4s; }
          .animate-islamic-3 { animation: floatIslamic 11s linear infinite; left: 80%; animation-delay: 2s; }
        `}</style>
        <div className="absolute text-emerald-300/40 animate-islamic-1"><Moon className="w-4 h-4" /></div>
        <div className="absolute text-gold-400/50 animate-islamic-2"><Star className="w-4 h-4 fill-gold-400/20" /></div>
        <div className="absolute text-emerald-400/40 animate-islamic-3"><Sparkles className="w-5 h-5" /></div>
      </div>
    );
  }

  return null;
};
