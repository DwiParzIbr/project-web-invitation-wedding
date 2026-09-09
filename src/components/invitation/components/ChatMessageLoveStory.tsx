'use client';

import React from 'react';
import { Heart, CheckCheck, MessageCircle } from 'lucide-react';
import { LoveStoryItem } from '@/types/wedding';
import { getCleanName } from '@/utils/nameUtils';

interface ChatMessageLoveStoryProps {
  loveStory: LoveStoryItem[];
  invitation: any;
  theme: any;
  fonts: any;
}

export const ChatMessageLoveStory: React.FC<ChatMessageLoveStoryProps> = ({
  loveStory,
  invitation,
  theme,
  fonts,
}) => {
  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);

  return (
    <div 
      className="w-full max-w-sm mx-auto rounded-3xl bg-slate-950 border border-gold-500/30 overflow-hidden shadow-2xl space-y-0"
      style={{
        boxShadow: `0 20px 40px -15px rgba(0,0,0,0.9), 0 0 25px -5px ${theme.primary || '#C9A66B'}20`,
      }}
    >
      {/* Chat App Header Bar */}
      <div 
        className="px-4 py-3 bg-slate-900 border-b border-white/10 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative flex -space-x-2 overflow-hidden">
            <img 
              src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'} 
              alt="Groom"
              className="inline-block h-8 w-8 rounded-full ring-2 ring-gold-400 object-cover"
            />
            <img 
              src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'} 
              alt="Bride"
              className="inline-block h-8 w-8 rounded-full ring-2 ring-rose-400 object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1">
              <span>{groomName} & {brideName}</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </h4>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online • Berkomitmen Selamanya
            </span>
          </div>
        </div>

        <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-gold-400" />
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="p-4 space-y-4 bg-slate-950/80 min-h-[300px]">
        {/* Date / Security Notice Pill */}
        <div className="text-center">
          <span className="text-[9px] uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-white/5 font-mono">
            Kisah Perjalanan Cinta Sejak {loveStory[0]?.year || 'Awal Bertemu'}
          </span>
        </div>

        {loveStory.map((item, idx) => {
          const isRight = idx % 2 !== 0;

          return (
            <div 
              key={idx}
              className={`flex flex-col ${isRight ? 'items-end' : 'items-start'} space-y-1`}
            >
              {/* Year Stamp */}
              <span className="text-[9px] font-mono text-gold-400 px-2 font-bold">
                Tahun {item.year}
              </span>

              {/* Chat Bubble */}
              <div 
                className={`relative max-w-[85%] p-3.5 rounded-2xl text-left shadow-lg ${
                  isRight 
                    ? 'bg-gradient-to-br from-amber-700/80 to-amber-900/90 text-amber-50 rounded-tr-none border border-amber-500/30'
                    : 'bg-slate-900 text-slate-100 rounded-tl-none border border-gold-500/30'
                }`}
              >
                <div className="font-bold text-xs text-gold-300 pb-1 flex items-center justify-between gap-2">
                  <span>{item.title}</span>
                  <span className="text-[9px] text-slate-400 font-normal">
                    {isRight ? brideName : groomName}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {item.description}
                </p>

                {/* Footer of Bubble: Time & Double Checkmark */}
                <div className="flex items-center justify-end gap-1.5 pt-1.5 -mb-1">
                  <span className="text-[9px] text-slate-400">{item.year}</span>
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                </div>

                {/* Heart Reaction Badge */}
                <div 
                  className={`absolute -bottom-2 ${isRight ? '-left-2' : '-right-2'} bg-slate-900 border border-white/10 rounded-full px-1.5 py-0.5 shadow flex items-center gap-0.5 text-[9px] text-rose-300`}
                >
                  <span>❤️</span>
                  <span className="font-bold">1</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Ending Toast */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-[10px] text-gold-300 font-semibold shadow">
            <span>💍 Dan Kisah Abadi Ini Berlanjut di Pelaminan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
