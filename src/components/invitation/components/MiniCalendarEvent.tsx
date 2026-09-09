'use client';

import React from 'react';
import { Calendar as CalendarIcon, Heart, Sparkles } from 'lucide-react';

interface MiniCalendarEventProps {
  weddingDate: string | Date;
  theme: any;
  fonts: any;
}

export const MiniCalendarEvent: React.FC<MiniCalendarEventProps> = ({
  weddingDate,
  theme,
  fonts,
}) => {
  const date = new Date(weddingDate);
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const weddingDay = date.getDate();

  // Days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // First day of month (0: Sunday, 1: Monday, ...)
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const dayHeaders = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Build calendar matrix
  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let day = 1; day <= totalDaysInMonth; day++) {
    daysArray.push(day);
  }

  return (
    <div 
      className="w-full max-w-sm mx-auto p-5 rounded-3xl bg-slate-900/90 border border-gold-500/30 backdrop-blur-xl shadow-2xl space-y-4"
      style={{
        boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 20px -5px ${theme.primary || '#C9A66B'}25`,
      }}
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between border-b border-gold-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-gold-400" />
          </div>
          <div>
            <h4 
              className="text-base font-bold text-amber-100"
              style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
            >
              {monthNames[month]} {year}
            </h4>
            <span className="text-[10px] text-slate-400 tracking-wider uppercase block">
              The Sacred Wedding Month
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/10 border border-gold-500/30">
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span className="text-[10px] font-bold text-gold-300">Save The Date</span>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayHeaders.map((day, idx) => (
          <span 
            key={idx} 
            className={`text-[10px] font-bold py-1 ${idx === 0 ? 'text-rose-400' : 'text-slate-400'}`}
          >
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {daysArray.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }

          const isTheWeddingDay = day === weddingDay;

          return (
            <div key={`day-${day}`} className="h-9 flex items-center justify-center relative">
              {isTheWeddingDay ? (
                <div className="relative w-8 h-8 flex items-center justify-center">
                  {/* Pulsing outer aura ring */}
                  <div 
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: theme.primary || '#C9A66B' }}
                  />
                  {/* Active day circle */}
                  <div 
                    className="relative w-8 h-8 rounded-full flex flex-col items-center justify-center text-slate-950 font-black text-xs shadow-lg border border-white"
                    style={{
                      background: `linear-gradient(135deg, #FFF7D6 0%, ${theme.primary || '#C9A66B'} 100%)`,
                    }}
                  >
                    <span>{day}</span>
                    <Heart className="w-2 h-2 text-rose-600 fill-rose-600 -mt-0.5" />
                  </div>
                </div>
              ) : (
                <span className="text-xs font-medium text-slate-300 hover:text-white transition-colors">
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Tag */}
      <div className="pt-2 border-t border-slate-800 text-center">
        <p className="text-[11px] text-gold-300/90 font-medium">
          ✨ Hari Pernikahan: Tanggal {weddingDay} {monthNames[month]} {year}
        </p>
      </div>
    </div>
  );
};
