'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';

interface PolaroidPhotosProps {
  invitation: any;
  theme: any;
  fonts: any;
}

export const PolaroidPhotos: React.FC<PolaroidPhotosProps> = ({
  invitation,
  theme,
  fonts,
}) => {
  const getInstagramUrl = (handle?: string) => {
    if (!handle) return '#';
    const clean = handle.replace('@', '').trim();
    if (clean.startsWith('http')) return clean;
    return `https://instagram.com/${clean}`;
  };

  return (
    <div className="space-y-12 w-full max-w-sm mx-auto">
      {/* GROOM POLAROID (Tilted -3 deg) */}
      <div className="relative group transition-transform duration-300 hover:rotate-0 transform -rotate-2">
        {/* Washi Tape Accent */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/70 border border-amber-200/50 shadow-sm z-20 backdrop-blur-[1px] rotate-[-2deg]"
          style={{
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Polaroid Card Body */}
        <div className="bg-[#FAF7F2] text-slate-900 p-4 pb-6 rounded-lg shadow-2xl border border-[#E8E1D5] space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded bg-slate-200 border border-black/10 relative shadow-inner">
            <img 
              src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'} 
              alt="Groom"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="text-center pt-1 space-y-1">
            <h3 
              className="text-2xl font-bold text-slate-900 tracking-wide"
              style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
            >
              {invitation.groomName}
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-amber-800 font-bold block">
              The Groom
            </span>
            <p className="text-xs text-slate-600 px-2 leading-relaxed font-sans pt-1">
              {invitation.groomParents}
            </p>

            {invitation.groomInstagram && (
              <div className="pt-2">
                <a
                  href={getInstagramUrl(invitation.groomInstagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>{invitation.groomInstagram}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* & Divider */}
      <div className="text-center">
        <span 
          className="text-4xl text-gold-400 italic block drop-shadow-md"
          style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
        >
          &
        </span>
      </div>

      {/* BRIDE POLAROID (Tilted +3 deg) */}
      <div className="relative group transition-transform duration-300 hover:rotate-0 transform rotate-2">
        {/* Washi Tape Accent */}
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-rose-100/70 border border-rose-200/50 shadow-sm z-20 backdrop-blur-[1px] rotate-[2deg]"
          style={{
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
          }}
        />

        {/* Polaroid Card Body */}
        <div className="bg-[#FAF7F2] text-slate-900 p-4 pb-6 rounded-lg shadow-2xl border border-[#E8E1D5] space-y-4">
          <div className="aspect-[4/5] overflow-hidden rounded bg-slate-200 border border-black/10 relative shadow-inner">
            <img 
              src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'} 
              alt="Bride"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="text-center pt-1 space-y-1">
            <h3 
              className="text-2xl font-bold text-slate-900 tracking-wide"
              style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
            >
              {invitation.brideName}
            </h3>
            <span className="text-[10px] uppercase tracking-widest text-rose-800 font-bold block">
              The Bride
            </span>
            <p className="text-xs text-slate-600 px-2 leading-relaxed font-sans pt-1">
              {invitation.brideParents}
            </p>

            {invitation.brideInstagram && (
              <div className="pt-2">
                <a
                  href={getInstagramUrl(invitation.brideInstagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-slate-800 bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-600" />
                  <span>{invitation.brideInstagram}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
