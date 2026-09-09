'use client';

import React from 'react';
import { Instagram } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';

interface ArchMoroccanPhotosProps {
  invitation: any;
  theme: any;
  fonts: any;
}

export const ArchMoroccanPhotos: React.FC<ArchMoroccanPhotosProps> = ({
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
      {/* GROOM ARCH */}
      <div className="space-y-4 text-center">
        <div className="relative mx-auto w-52 h-72 p-2 rounded-t-full rounded-b-2xl bg-gradient-to-b from-gold-400 via-gold-600 to-amber-900 shadow-2xl">
          {/* Inner decorative arch rim */}
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden border-2 border-slate-900 relative group">
            <img 
              src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'} 
              alt="Groom"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Top Arch Pinnacle Ornament */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 border-t-2 border-l-2 border-gold-300 bg-slate-950 shadow-md" />
        </div>

        <div className="space-y-1">
          <h3 
            className="text-2xl font-bold text-amber-100"
            style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
          >
            {invitation.groomName}
          </h3>
          <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold block">
            Mempelai Pria
          </span>
          <p className="text-xs text-slate-300 px-4 leading-relaxed font-sans pt-1">
            {invitation.groomParents}
          </p>

          {invitation.groomInstagram && (
            <div className="pt-2">
              <a
                href={getInstagramUrl(invitation.groomInstagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-gold-300 bg-slate-900 border border-gold-500/30 hover:bg-slate-800 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{invitation.groomInstagram}</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* & Divider */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-500" />
        <span 
          className="text-3xl text-gold-400 italic"
          style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
        >
          with
        </span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-500" />
      </div>

      {/* BRIDE ARCH */}
      <div className="space-y-4 text-center">
        <div className="relative mx-auto w-52 h-72 p-2 rounded-t-full rounded-b-2xl bg-gradient-to-b from-gold-400 via-rose-500 to-amber-900 shadow-2xl">
          {/* Inner decorative arch rim */}
          <div className="w-full h-full rounded-t-full rounded-b-xl overflow-hidden border-2 border-slate-900 relative group">
            <img 
              src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600'} 
              alt="Bride"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Top Arch Pinnacle Ornament */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 border-t-2 border-l-2 border-gold-300 bg-slate-950 shadow-md" />
        </div>

        <div className="space-y-1">
          <h3 
            className="text-2xl font-bold text-amber-100"
            style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
          >
            {invitation.brideName}
          </h3>
          <span className="text-[11px] uppercase tracking-widest text-rose-300 font-semibold block">
            Mempelai Wanita
          </span>
          <p className="text-xs text-slate-300 px-4 leading-relaxed font-sans pt-1">
            {invitation.brideParents}
          </p>

          {invitation.brideInstagram && (
            <div className="pt-2">
              <a
                href={getInstagramUrl(invitation.brideInstagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-300 bg-slate-900 border border-rose-500/30 hover:bg-slate-800 transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>{invitation.brideInstagram}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
