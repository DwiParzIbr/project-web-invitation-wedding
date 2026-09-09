'use client';

import React from 'react';
import { Film } from 'lucide-react';

interface FilmStripGalleryProps {
  photos: string[];
  onPhotoClick: (index: number) => void;
  theme: any;
}

export const FilmStripGallery: React.FC<FilmStripGalleryProps> = ({
  photos,
  onPhotoClick,
  theme,
}) => {
  // Duplicate array if short to ensure smooth continuous ribbon
  const displayPhotos = photos.length > 0 ? photos : [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
  ];

  return (
    <div className="w-full overflow-hidden py-4 select-none">
      <div className="flex items-center justify-between px-4 pb-2 text-[10px] text-gold-400/80 font-mono">
        <span className="flex items-center gap-1.5 font-bold">
          <Film className="w-3.5 h-3.5" /> 35mm ROLL NEGATIVE FILM
        </span>
        <span>KODAK GOLD 400 • ISO 400</span>
      </div>

      {/* Horizontal Film Strip Ribbon */}
      <div 
        className="w-full bg-[#111111] border-y-4 border-black shadow-2xl py-3 relative overflow-x-auto no-scrollbar"
        style={{
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.9)',
        }}
      >
        {/* Top Sprocket Perforations Row */}
        <div className="flex items-center gap-4 px-2 pb-2 overflow-hidden opacity-60">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={`top-sprocket-${i}`} 
              className="w-3.5 h-2 rounded-[2px] bg-slate-900 border border-white/20 shrink-0" 
            />
          ))}
        </div>

        {/* Frames Ribbon */}
        <div className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory py-1 no-scrollbar">
          {displayPhotos.map((photo, idx) => (
            <div 
              key={idx}
              onClick={() => onPhotoClick(idx)}
              className="relative shrink-0 snap-center w-52 sm:w-60 aspect-[3/2] bg-black p-1.5 rounded border border-white/15 cursor-pointer group shadow-xl hover:border-gold-400 transition-all duration-300"
            >
              {/* Photo Frame */}
              <div className="w-full h-full overflow-hidden rounded-[2px] relative">
                <img 
                  src={photo} 
                  alt={`Film frame ${idx + 1}`}
                  className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-[10px] text-gold-300 font-mono font-bold">Tap to Expand</span>
                </div>
              </div>

              {/* Frame numbering on film edge */}
              <div className="flex items-center justify-between text-[8px] font-mono text-gold-400/90 pt-1 px-1">
                <span>▶ {String(idx + 1).padStart(2, '0')}A</span>
                <span>SAFETY FILM</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sprocket Perforations Row */}
        <div className="flex items-center gap-4 px-2 pt-2 overflow-hidden opacity-60">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={`bottom-sprocket-${i}`} 
              className="w-3.5 h-2 rounded-[2px] bg-slate-900 border border-white/20 shrink-0" 
            />
          ))}
        </div>
      </div>

      <div className="text-center pt-2">
        <span className="text-[10px] text-slate-400 font-sans">
          Geser ke samping untuk melihat roll foto lainnya ⟷
        </span>
      </div>
    </div>
  );
};
