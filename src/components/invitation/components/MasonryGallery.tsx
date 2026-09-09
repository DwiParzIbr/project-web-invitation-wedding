'use client';

import React from 'react';

interface MasonryGalleryProps {
  photos: string[];
  onPhotoClick: (index: number) => void;
  theme: any;
}

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  photos,
  onPhotoClick,
  theme,
}) => {
  // Split photos into two asymmetric columns
  const col1: { url: string; originalIndex: number; aspect: string }[] = [];
  const col2: { url: string; originalIndex: number; aspect: string }[] = [];

  const aspects = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[4/3]'];

  photos.forEach((url, idx) => {
    const item = {
      url,
      originalIndex: idx,
      aspect: aspects[idx % aspects.length],
    };
    if (idx % 2 === 0) {
      col1.push(item);
    } else {
      col2.push(item);
    }
  });

  return (
    <div className="grid grid-cols-2 gap-3.5 w-full">
      {/* Column 1 */}
      <div className="flex flex-col gap-3.5">
        {col1.map((item) => (
          <div
            key={item.originalIndex}
            onClick={() => onPhotoClick(item.originalIndex)}
            className={`relative ${item.aspect} w-full rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl cursor-pointer group bg-slate-900`}
          >
            <img 
              src={item.url} 
              alt={`Gallery ${item.originalIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-[10px] text-gold-300 font-medium">Buka Foto</span>
            </div>
          </div>
        ))}
      </div>

      {/* Column 2 (Offset by top padding for staggered asymmetry) */}
      <div className="flex flex-col gap-3.5 pt-6">
        {col2.map((item) => (
          <div
            key={item.originalIndex}
            onClick={() => onPhotoClick(item.originalIndex)}
            className={`relative ${item.aspect} w-full rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl cursor-pointer group bg-slate-900`}
          >
            <img 
              src={item.url} 
              alt={`Gallery ${item.originalIndex + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-[10px] text-gold-300 font-medium">Buka Foto</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
