'use client';

import React from 'react';
import { Train, Navigation, Heart, MapPin } from 'lucide-react';
import { LoveStoryItem } from '@/types/wedding';

interface MetroRoadmapLoveStoryProps {
  loveStory: LoveStoryItem[];
  theme: any;
  fonts: any;
}

export const MetroRoadmapLoveStory: React.FC<MetroRoadmapLoveStoryProps> = ({
  loveStory,
  theme,
  fonts,
}) => {
  return (
    <div 
      className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-slate-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-5"
      style={{
        boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 20px -5px ${theme.primary || '#C9A66B'}20`,
      }}
    >
      {/* Metro Line Header */}
      <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-400 text-slate-950 flex items-center justify-center font-black">
            <Train className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 font-mono">
                LINE-01
              </span>
              <h4 className="text-xs font-bold text-amber-100 uppercase tracking-wider">
                DESTINY EXPRESS
              </h4>
            </div>
            <span className="text-[9px] text-slate-400">Rute Perjalanan Menuju Bahagia</span>
          </div>
        </div>

        <div className="text-right font-mono text-[10px] text-gold-400">
          <span>NON-STOP</span>
        </div>
      </div>

      {/* Metro Route Map */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-gold-400 before:via-amber-500 before:to-rose-500">
        {loveStory.map((item, idx) => {
          const isLast = idx === loveStory.length - 1;

          return (
            <div key={idx} className="relative group">
              {/* Station Pin / Node Circle */}
              <div 
                className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 z-10 ${
                  isLast 
                    ? 'border-rose-400 bg-rose-500 text-white animate-pulse'
                    : 'border-gold-300 bg-slate-900 text-gold-300'
                }`}
              >
                {isLast ? (
                  <Heart className="w-3 h-3 fill-white" />
                ) : (
                  <span className="text-[9px] font-black font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Station Card Content */}
              <div className="ml-3 p-3.5 rounded-2xl bg-slate-950/70 border border-gold-500/20 hover:border-gold-500/50 transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-400/10">
                    STASIUN {item.year}
                  </span>
                  {isLast && (
                    <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> FINAL TERMINAL
                    </span>
                  )}
                </div>

                <h5 className="text-sm font-bold text-slate-100 pt-0.5">
                  {item.title}
                </h5>

                <p className="text-xs text-slate-300 leading-relaxed pt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
