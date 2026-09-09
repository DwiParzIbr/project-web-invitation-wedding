'use client';

import React from 'react';
import { Plane, Calendar, Clock, MapPin, ExternalLink, QrCode } from 'lucide-react';
import { EventItem } from '@/types/wedding';
import { getCleanName } from '@/utils/nameUtils';

interface BoardingPassEventProps {
  events: EventItem[];
  invitation: any;
  theme: any;
  fonts: any;
}

export const BoardingPassEvent: React.FC<BoardingPassEventProps> = ({
  events,
  invitation,
  theme,
  fonts,
}) => {
  const coupleTitle = `${getCleanName(invitation.groomName)} & ${getCleanName(invitation.brideName)}`;

  return (
    <div className="space-y-6 w-full">
      {events.map((event, idx) => {
        const isAkad = (event.eventType || '').toUpperCase() === 'AKAD';
        const flightNumber = isAkad ? 'WD-AKAD01' : 'WD-RESEP02';
        const flightClass = isAkad ? 'SACRED CLASS' : 'ROYAL CLASS';
        const eventDateStr = new Date(event.date || invitation.weddingDate).toLocaleDateString('id-ID', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

        return (
          <div 
            key={event.id || idx}
            className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-gold-500/40 shadow-2xl overflow-hidden group hover:border-gold-400 transition-all duration-300"
            style={{
              boxShadow: `0 15px 35px -10px rgba(0,0,0,0.8), 0 0 20px -5px ${theme.primary || '#C9A66B'}20`,
            }}
          >
            {/* Top Boarding Header */}
            <div 
              className="px-5 py-3 flex items-center justify-between border-b border-gold-500/20 text-slate-950"
              style={{
                background: `linear-gradient(90deg, ${theme.secondary || '#E6D3A9'} 0%, ${theme.primary || '#C9A66B'} 100%)`,
              }}
            >
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 transform -rotate-45" />
                <span className="text-[11px] font-black tracking-widest uppercase">
                  WEDDORA AIR • BOARDING PASS
                </span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-950 text-gold-300 tracking-wider">
                {flightClass}
              </span>
            </div>

            {/* Main Flight Body */}
            <div className="p-5 space-y-4">
              {/* Route Display */}
              <div className="flex items-center justify-between text-center border-b border-slate-800 pb-3">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-semibold">FROM</span>
                  <span className="text-xl font-black text-amber-200 tracking-tight">SOLO</span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">Single Era</span>
                </div>

                <div className="flex-1 px-4 flex flex-col items-center">
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-widest mb-1">
                    {event.title || (isAkad ? 'Akad Nikah' : 'Resepsi')}
                  </span>
                  <div className="w-full flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full border border-gold-400 bg-gold-400/30" />
                    <div className="flex-1 border-t-2 border-dashed border-gold-400/40 relative">
                      <Plane className="w-3.5 h-3.5 text-gold-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="w-2 h-2 rounded-full border border-gold-400 bg-gold-400" />
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1">One-Way Journey</span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block tracking-wider uppercase font-semibold">TO</span>
                  <span className="text-xl font-black text-amber-200 tracking-tight">ETRNL</span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">Forever Love</span>
                </div>
              </div>

              {/* Flight Details Matrix Grid */}
              <div className="grid grid-cols-3 gap-3 text-left">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">PASSENGER</span>
                  <span className="text-xs font-bold text-slate-100 truncate block mt-0.5">{coupleTitle}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">FLIGHT</span>
                  <span className="text-xs font-bold text-gold-300 block mt-0.5">{flightNumber}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">SEAT</span>
                  <span className="text-xs font-bold text-amber-200 block mt-0.5">VIP-01</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">DATE</span>
                    <span className="text-xs font-bold text-slate-200">{eventDateStr}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider block">TIME (WIB)</span>
                    <span className="text-xs font-bold text-slate-200">{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Venue Destination */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-gold-500/20 text-left space-y-1">
                <div className="flex items-center gap-1.5 text-gold-400">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-bold text-slate-100">{event.venueName}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">{event.address}</p>
                
                {event.googleMapsUrl && (
                  <div className="pt-2 pl-5">
                    <a
                      href={event.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Petunjuk Arah (Google Maps)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Perforation Divider Line with Semi-Circle Cutouts */}
            <div className="relative py-1 flex items-center justify-between">
              {/* Left semi-circle cutout */}
              <div className="w-6 h-6 rounded-full bg-[#0F172A] -ml-3 border-r border-gold-500/40" />
              {/* Dashed perforation cut line */}
              <div className="flex-1 border-t-2 border-dashed border-gold-500/30 mx-2" />
              {/* Right semi-circle cutout */}
              <div className="w-6 h-6 rounded-full bg-[#0F172A] -mr-3 border-l border-gold-500/40" />
            </div>

            {/* Tear-Off Ticket Stub Footer */}
            <div className="p-4 bg-slate-950/90 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow">
                  <QrCode className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">BOARDING PASS STUB</span>
                  <span className="text-[11px] font-mono text-gold-300 block font-bold">INV-{Math.abs(idx + 109283)}</span>
                  <span className="text-[9px] text-emerald-400 font-semibold block">● VALID FOR ENTRY</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest block">GATE</span>
                <span className="text-lg font-black text-amber-200">A-01</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
