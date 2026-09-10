'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ExternalLink, Sparkles, Heart, Quote, ArrowUp } from 'lucide-react';
import { getCleanName } from '@/utils/nameUtils';
import { isLightTheme } from '@/utils/themeUtils';
import { BoardingPassEvent } from '../components/BoardingPassEvent';
import { MiniCalendarEvent } from '../components/MiniCalendarEvent';
import { PolaroidPhotos } from '../components/PolaroidPhotos';
import { ArchMoroccanPhotos } from '../components/ArchMoroccanPhotos';
import { ChatMessageLoveStory } from '../components/ChatMessageLoveStory';
import { MetroRoadmapLoveStory } from '../components/MetroRoadmapLoveStory';
import { FilmStripGallery } from '../components/FilmStripGallery';
import { MasonryGallery } from '../components/MasonryGallery';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface MagazineEditorialLayoutProps {
  invitation: any;
  guestName: string;
  theme: any;
  fonts: any;
  rsvpsList: any[];
  onRsvpSubmit: (e: React.FormEvent) => void;
  rsvpName: string;
  setRsvpName: (name: string) => void;
  rsvpStatus: 'ATTENDING' | 'DECLINED' | 'MAYBE';
  setRsvpStatus: (status: 'ATTENDING' | 'DECLINED' | 'MAYBE') => void;
  rsvpCount: number;
  setRsvpCount: (count: number) => void;
  rsvpMessage: string;
  setRsvpMessage: (msg: string) => void;
  isSubmittingRsvp: boolean;
  rsvpSuccess: boolean;
  youtubeEmbedUrl: string | null;
  activeLightboxIndex: number | null;
  setActiveLightboxIndex: (idx: number | null) => void;
}

export const MagazineEditorialLayout: React.FC<MagazineEditorialLayoutProps> = ({
  invitation,
  guestName,
  theme,
  fonts,
  rsvpsList,
  onRsvpSubmit,
  rsvpName,
  setRsvpName,
  rsvpStatus,
  setRsvpStatus,
  rsvpCount,
  setRsvpCount,
  rsvpMessage,
  setRsvpMessage,
  isSubmittingRsvp,
  rsvpSuccess,
  youtubeEmbedUrl,
  setActiveLightboxIndex,
}) => {
  const safeParseJSON = (data: any, fallback: any) => {
    if (!data) return fallback;
    let parsed = data;
    try {
      while (typeof parsed === 'string') parsed = JSON.parse(parsed);
      return parsed || fallback;
    } catch {
      return fallback;
    }
  };

  const designSchema = typeof invitation.designConfig === 'object' && invitation.designConfig !== null
    ? invitation.designConfig
    : safeParseJSON(invitation.designConfig, {});
  const isLight = isLightTheme(theme, designSchema);
  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, []);
  const loveStoryList = safeParseJSON(invitation.loveStory, []);
  const digitalGiftsList = safeParseJSON(invitation.digitalGifts, []);
  const eventsList = invitation.events || [];

  const groomName = getCleanName(invitation.groomName);
  const brideName = getCleanName(invitation.brideName);
  const weddingDateStr = new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const showTurutMengundang = designSchema?.turutMengundang?.enabled !== false;
  const turutConfig = designSchema?.turutMengundang;
  let turutItems: Array<{ name: string; role?: string }> = turutConfig?.items || [];
  if (turutItems.length === 0 && turutConfig?.rawText && turutConfig.rawText.trim()) {
    turutItems = turutConfig.rawText
      .split('\n')
      .map((line: string) => line.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter(Boolean)
      .map((name: string) => ({ name }));
  }
  if (turutItems.length === 0) {
    turutItems = [
      { name: 'Bapak Gubernur Bengkulu', role: 'Tokoh Kehormatan' },
      { name: 'Bapak Bupati', role: 'Tokoh Kehormatan' },
      { name: 'Keluarga Besar Mempelai Pria' },
      { name: 'Keluarga Besar Mempelai Wanita' },
    ];
  }

  return (
    <div className={`relative z-10 w-full min-h-screen font-serif pb-28 space-y-16 max-w-xl mx-auto shadow-2xl border-x ${
      isLight
        ? 'bg-[#FAF8F5] text-slate-800 border-stone-200 shadow-stone-200/50'
        : 'bg-[#0a0c10] text-slate-100 border-white/5'
    }`}>
      {/* EDITORIAL MASTHEAD BANNER */}
      <header className={`border-b px-6 pt-10 pb-4 text-center space-y-2 ${
        isLight
          ? 'border-stone-200 bg-gradient-to-b from-stone-100 to-transparent'
          : 'border-white/15 bg-gradient-to-b from-black to-transparent'
      }`}>
        <div className={`flex items-center justify-between text-[9px] uppercase tracking-[0.3em] font-sans border-b pb-2 font-bold ${
          isLight ? 'text-stone-500 border-stone-200' : 'text-slate-300 border-white/10'
        }`}>
          <span>ISSUE NO. 12</span>
          <span>WEDDING CHRONICLE</span>
          <span>LIMITED EDITION</span>
        </div>

        <h1 
          className={`text-4xl sm:text-6xl font-black uppercase tracking-tighter drop-shadow-sm py-2 leading-none ${
            isLight ? 'text-slate-900' : 'text-white drop-shadow-md'
          }`}
          style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
        >
          {groomName} <span className="text-gold-500 font-light">&</span> {brideName}
        </h1>

        <div className={`flex items-center justify-between text-[10px] uppercase tracking-widest text-gold-500 font-sans border-t pt-2 font-bold ${
          isLight ? 'border-stone-200' : 'border-white/10'
        }`}>
          <span>THE UNION</span>
          <span>INDONESIA</span>
          <span>{weddingDateStr}</span>
        </div>
      </header>

      {/* COVER STORY: ASYMMETRIC OVERLAP HERO */}
      <ScrollReveal direction="zoom" duration={850}>
        <section className="px-6 relative">
          <div className="relative">
            {/* Main Editorial Hero Image */}
            <div className={`w-full aspect-[4/5] rounded-xl overflow-hidden border-2 relative shadow-2xl ${
              isLight ? 'border-stone-200 shadow-stone-300/40' : 'border-white/20'
            }`}>
              <img 
                src={invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200'} 
                alt="Editorial Cover"
                className="w-full h-full object-cover filter contrast-[1.05]"
              />
              <div className={`absolute inset-0 ${
                isLight
                  ? 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
                  : 'bg-gradient-to-t from-black/80 via-transparent to-transparent'
              }`} />
            </div>

            {/* Overlapping Floating Typography Card (High Contrast Opaque Plaque) */}
            <div className={`absolute -bottom-10 -left-2 right-6 p-6 rounded-xl space-y-2 text-left backdrop-blur-xl border shadow-2xl ${
              isLight
                ? 'bg-white/95 border-amber-400/50 shadow-[0_20px_40px_rgba(0,0,0,0.08)]'
                : 'bg-slate-950/95 border-gold-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
            }`}>
              <span className="text-[9px] uppercase tracking-[0.3em] text-gold-500 block font-sans font-bold">
                SPECIAL INVITATION
              </span>
              <h2 className={`text-xl sm:text-2xl font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white drop-shadow'}`}>
                An Eternal Promise of Love, Loyalty & Devotion.
              </h2>
              <p className={`text-xs font-sans ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Kepada Yth. <strong className={`font-semibold ${isLight ? 'text-amber-800' : 'text-gold-300'}`}>{guestName}</strong>
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* QUOTE PULLOUT WITH DROP CAP (FROSTED OPAQUE CARD WITH CRYSTAL-CLEAR TEXT) */}
      <ScrollReveal direction="up" duration={750}>
        <section className="px-6 pt-14 text-left">
          <div className={`p-6 sm:p-7 rounded-2xl backdrop-blur-xl border relative overflow-hidden ${
            isLight
              ? 'bg-white/95 border-amber-400/40 shadow-[0_15px_35px_rgba(0,0,0,0.06)]'
              : 'bg-slate-900/95 border-gold-500/35 shadow-[0_15px_40px_rgba(0,0,0,0.7)]'
          }`}>
            <div className="border-l-3 border-gold-400 pl-4 py-1 space-y-3">
              <p className={`text-sm sm:text-base italic leading-relaxed font-serif ${isLight ? 'text-slate-800' : 'text-white drop-shadow-sm'}`}>
                <span className="text-4xl float-left mr-3 font-black leading-none text-gold-400 font-serif">D</span>
                {invitation.quoteText || 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.'}
              </p>
              <span className="text-[11px] text-gold-500 uppercase tracking-widest font-sans font-bold block">
                — {invitation.quoteSource || 'QS. AR-RUM: 21'}
              </span>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* PROFIL MEMPELAI: ASYMMETRIC EDITORIAL GRID */}
      <section className="px-6 space-y-8">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">CHAPTER I</span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              The Protagonists
            </h3>
          </div>
        </ScrollReveal>

        {designSchema?.couplePhotoStyle === 'polaroid' ? (
          <ScrollReveal direction="up">
            <PolaroidPhotos invitation={invitation} theme={theme} fonts={fonts} />
          </ScrollReveal>
        ) : designSchema?.couplePhotoStyle === 'arch' ? (
          <ScrollReveal direction="up">
            <ArchMoroccanPhotos invitation={invitation} theme={theme} fonts={fonts} />
          </ScrollReveal>
        ) : (
          <div className="space-y-12">
            {/* Groom Editorial Card */}
            <ScrollReveal direction="left" distance="40px">
              <div className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl shadow-xl border ${
                isLight ? 'bg-white/95 border-stone-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.06)]' : 'bg-slate-950/80 border-white/10'
              }`}>
                <div className={`col-span-7 aspect-[3/4] rounded-lg overflow-hidden border shadow-xl ${
                  isLight ? 'border-stone-200' : 'border-white/20'
                }`}>
                  <img src={invitation.groomPhoto} alt="Groom" className="w-full h-full object-cover" />
                </div>
                <div className="col-span-5 text-left space-y-1.5 pl-2">
                  <span className="text-[9px] uppercase tracking-widest text-gold-500 font-sans font-bold block">
                    THE GROOM
                  </span>
                  <h4 className={`text-lg font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{invitation.groomName}</h4>
                  <p className={`text-[11px] font-sans leading-snug ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{invitation.groomParents}</p>
                  {invitation.groomInstagram && (
                    <span className="text-[10px] text-gold-500 font-sans font-mono block pt-1">
                      {invitation.groomInstagram}
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>

            {/* Bride Editorial Card */}
            <ScrollReveal direction="right" distance="40px">
              <div className={`grid grid-cols-12 gap-4 items-center p-4 rounded-2xl shadow-xl border ${
                isLight ? 'bg-white/95 border-stone-200/90 shadow-[0_10px_25px_rgba(0,0,0,0.06)]' : 'bg-slate-950/80 border-white/10'
              }`}>
                <div className="col-span-5 text-right space-y-1.5 pr-2">
                  <span className="text-[9px] uppercase tracking-widest text-rose-500 font-sans font-bold block">
                    THE BRIDE
                  </span>
                  <h4 className={`text-lg font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>{invitation.brideName}</h4>
                  <p className={`text-[11px] font-sans leading-snug ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{invitation.brideParents}</p>
                  {invitation.brideInstagram && (
                    <span className="text-[10px] text-rose-500 font-sans font-mono block pt-1">
                      {invitation.brideInstagram}
                    </span>
                  )}
                </div>
                <div className={`col-span-7 aspect-[3/4] rounded-lg overflow-hidden border shadow-xl ${
                  isLight ? 'border-stone-200' : 'border-white/20'
                }`}>
                  <img src={invitation.bridePhoto} alt="Bride" className="w-full h-full object-cover" />
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </section>

      {/* ITINERARY & ACARA */}
      <section className="px-6 space-y-6">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">CHAPTER II</span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>The Itinerary</h3>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          {designSchema?.eventStyle === 'boarding_pass' ? (
            <BoardingPassEvent events={eventsList} invitation={invitation} theme={theme} fonts={fonts} />
          ) : designSchema?.eventStyle === 'mini_calendar' ? (
            <div className="space-y-4">
              <MiniCalendarEvent weddingDate={invitation.weddingDate} theme={theme} fonts={fonts} />
              <div className="space-y-3">
                {eventsList.map((ev: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-xl text-left shadow-lg border ${isLight ? 'bg-white/95 border-stone-200/90' : 'bg-slate-900/90 border-white/15'}`}>
                    <h5 className={`font-bold text-sm ${isLight ? 'text-amber-800' : 'text-gold-300'}`}>{ev.title}</h5>
                    <p className={`text-xs font-sans mt-1 ${isLight ? 'text-slate-600' : 'text-slate-200'}`}>{ev.startTime} - {ev.endTime} @ {ev.venueName}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {eventsList.map((ev: any, idx: number) => (
                <div key={idx} className={`p-5 rounded-xl text-left space-y-2 shadow-lg border ${isLight ? 'bg-white/95 border-stone-200/90' : 'bg-slate-950/90 border-white/15'}`}>
                  <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                    <h4 className={`font-bold text-base ${isLight ? 'text-amber-800' : 'text-gold-300'}`}>{ev.title}</h4>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${isLight ? 'text-slate-600 bg-stone-100' : 'text-slate-300 bg-white/10'}`}>{ev.startTime}</span>
                  </div>
                  <p className={`text-xs font-bold font-sans ${isLight ? 'text-slate-900' : 'text-white'}`}>{ev.venueName}</p>
                  <p className={`text-xs font-sans leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{ev.address}</p>
                  {ev.googleMapsUrl && (
                    <a 
                      href={ev.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gold-500 font-sans hover:underline pt-2 font-semibold"
                    >
                      <MapPin className="w-3.5 h-3.5" /> Petunjuk Arah Google Maps
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* GALLERY & VIDEO EDITORIAL SPREAD */}
      <section className="px-6 space-y-6">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">CHAPTER III</span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Visual Archives</h3>
          </div>
        </ScrollReveal>

        {/* YouTube Autoplay Video */}
        {youtubeEmbedUrl && (
          <ScrollReveal direction="zoom">
            <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black">
              <iframe
                src={youtubeEmbedUrl}
                title="Prewedding Video"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal direction="up" delay={100}>
          {designSchema?.galleryStyle === 'film_strip' ? (
            <FilmStripGallery photos={galleryList} onPhotoClick={setActiveLightboxIndex} theme={theme} />
          ) : (
            <MasonryGallery photos={galleryList} onPhotoClick={setActiveLightboxIndex} theme={theme} />
          )}
        </ScrollReveal>
      </section>

      {/* LOVE STORY */}
      <section className="px-6 space-y-6">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">CHAPTER IV</span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>The Timeline</h3>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          {designSchema?.loveStoryStyle === 'chat_message' ? (
            <ChatMessageLoveStory loveStory={loveStoryList} invitation={invitation} theme={theme} fonts={fonts} />
          ) : designSchema?.loveStoryStyle === 'metro_map' ? (
            <MetroRoadmapLoveStory loveStory={loveStoryList} theme={theme} fonts={fonts} />
          ) : (
            <div className="space-y-4 text-left font-sans">
              {loveStoryList.map((item: any, idx: number) => (
                <div key={idx} className={`p-4 rounded-xl shadow-md border border-l-4 border-l-gold-500 ${isLight ? 'bg-white/95 border-stone-200/90' : 'bg-slate-950/90 border-white/15'}`}>
                  <span className="text-[10px] font-mono text-gold-500 uppercase font-bold">Anno {item.year}</span>
                  <h5 className={`font-bold text-sm font-serif mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.title}</h5>
                  <p className={`text-xs pt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* RSVP & GUESTBOOK */}
      <section className="px-6 space-y-6">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">FINALE</span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>RSVP & Wishes</h3>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={150}>
          <form onSubmit={onRsvpSubmit} className={`p-6 rounded-2xl space-y-4 text-left font-sans shadow-2xl border ${
            isLight ? 'bg-white/95 border-stone-200/90 text-slate-800' : 'bg-slate-950 border-white/15'
          }`}>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Nama Tamu</label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                className={`w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:border-gold-500 ${
                  isLight ? 'bg-stone-50 border-stone-300 text-slate-900' : 'bg-slate-900 border-white/15 text-white'
                }`}
              />
            </div>

            <div>
              <label className={`text-[10px] uppercase tracking-wider block font-bold ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>Konfirmasi Kehadiran</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('ATTENDING')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    rsvpStatus === 'ATTENDING' 
                      ? 'bg-gold-500 text-slate-950' 
                      : isLight
                      ? 'bg-stone-100 text-slate-700 border border-stone-300'
                      : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus('DECLINED')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    rsvpStatus === 'DECLINED' 
                      ? 'bg-rose-700 text-white' 
                      : isLight
                      ? 'bg-stone-100 text-slate-700 border border-stone-300'
                      : 'bg-slate-900 text-slate-300 border border-white/10'
                  }`}
                >
                  Tidak Hadir
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">Doa & Ucapan</label>
              <textarea
                rows={3}
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                className="w-full mt-1.5 px-3.5 py-2.5 text-xs rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:border-gold-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-950 bg-gold-400 hover:bg-gold-300 transition-colors shadow-lg cursor-pointer"
            >
              {isSubmittingRsvp ? 'Mengirim...' : 'Kirim RSVP & Doa'}
            </button>

            {rsvpSuccess && (
              <p className="text-xs text-emerald-400 text-center font-bold">
                ✓ Konfirmasi kehadiran Anda telah tercatat. Terima kasih!
              </p>
            )}
          </form>
        </ScrollReveal>
      </section>

      {/* ========================================================
          SPECIAL FEATURE: TURUT MENGUNDANG
          ======================================================== */}
      {showTurutMengundang && (
        <section className="px-6 space-y-6">
          <ScrollReveal direction="fade">
            <div className={`text-left border-b pb-3 ${isLight ? 'border-amber-400/40' : 'border-gold-500/30'}`}>
              <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">
                SPECIAL FEATURE
              </span>
              <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                {turutConfig?.title?.trim() || 'Turut Mengundang'}
              </h3>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <div className={`p-6 sm:p-8 rounded-3xl text-left space-y-6 border shadow-2xl relative overflow-hidden ${
              isLight
                ? 'bg-white/95 border-amber-400/40 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
                : 'bg-slate-950/95 border-gold-500/30 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
            }`}>
              {/* Editorial Masthead Bar */}
              <div className={`flex items-center justify-between text-[9px] font-sans uppercase tracking-[0.3em] text-gold-500 border-b pb-3 font-bold ${
                isLight ? 'border-stone-200' : 'border-white/10'
              }`}>
                <span>EDITORIAL ROSTER</span>
                <span>VOL. XII • HONORARY PATRONS</span>
              </div>

              <p className={`text-xs sm:text-sm leading-relaxed italic ${
                isLight ? 'text-slate-600' : 'text-slate-300'
              }`}>
                &ldquo;{turutConfig?.subtitle?.trim() || 'Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga atas kehadiran dan doa restu Bapak/Ibu/Saudara/i:'}&rdquo;
              </p>

              {/* Roster Items with High Fashion Magazine Columns / Border-y */}
              <div className={`divide-y border-y ${
                isLight ? 'divide-stone-200 border-stone-200' : 'divide-white/10 border-white/10'
              }`}>
                {turutItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="py-3.5 flex items-center justify-between gap-4 group transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <span className="text-xs font-mono font-bold text-gold-500/80 tracking-widest shrink-0">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 
                          className={`text-sm sm:text-base font-bold uppercase tracking-wider leading-snug truncate ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                          style={{ fontFamily: `'${fonts?.heading || 'Cinzel'}', serif` }}
                        >
                          {item.name}
                        </h4>
                        {item.role && (
                          <span className={`text-[10px] font-sans uppercase tracking-[0.2em] font-semibold block mt-0.5 ${
                            isLight ? 'text-amber-800' : 'text-gold-400'
                          }`}>
                            {item.role}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <span className={`text-[9px] font-sans uppercase tracking-widest px-2.5 py-1 rounded-full font-bold ${
                        isLight 
                          ? 'bg-stone-100 text-slate-800 border border-stone-200' 
                          : 'bg-white/5 text-gold-300 border border-white/10'
                      }`}>
                        Patron
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sign-off */}
              <div className={`pt-2 text-center border-t ${isLight ? 'border-stone-200' : 'border-white/10'}`}>
                <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-gold-500 font-bold block">
                  Beserta Segenap Keluarga Besar Kedua Mempelai
                </span>
                <span className={`text-[9px] font-sans uppercase tracking-widest block pt-0.5 opacity-50 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Weddora Editorial Society • Edition 2026
                </span>
              </div>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ========================================================
          EPILOGUE & BACK COVER: UCAPAN TERIMA KASIH
          ======================================================== */}
      <section className="px-6 space-y-6">
        <ScrollReveal direction="fade">
          <div className={`text-left border-b pb-3 ${isLight ? 'border-stone-300' : 'border-white/15'}`}>
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold-500 font-sans font-bold block">
              EPILOGUE
            </span>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight drop-shadow-sm ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Words of Gratitude
            </h3>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <div className={`p-6 sm:p-8 rounded-2xl text-center space-y-6 shadow-2xl border relative overflow-hidden font-serif ${
            isLight
              ? 'bg-white border-stone-300 text-slate-800'
              : 'bg-gradient-to-b from-[#131720] via-[#0d1017] to-[#080a0f] border-white/15 text-white'
          }`}>
            {/* Editorial Inner Banner */}
            <div className={`flex items-center justify-between text-[9px] uppercase tracking-[0.25em] font-sans border-b pb-2.5 font-bold ${
              isLight ? 'text-stone-500 border-stone-200' : 'text-slate-400 border-white/10'
            }`}>
              <span>VOL. XII</span>
              <span>SPECIAL EDITION</span>
              <span>THE GRATITUDE</span>
            </div>

            <div className="w-12 h-12 rounded-full mx-auto bg-gold-500/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Heart className="w-6 h-6 text-gold-400 fill-gold-400/20" />
            </div>

            <div className="space-y-1">
              <h2 
                className={`text-2xl sm:text-4xl font-black uppercase tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white drop-shadow-sm'
                }`}
                style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
              >
                Ungkapan Terima Kasih
              </h2>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-gold-500 block font-bold">
                A Heartfelt Thank You Note
              </span>
            </div>

            <p className={`text-xs sm:text-sm max-w-md mx-auto leading-relaxed italic ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              &ldquo;Merupakan suatu kehormatan dan kebahagiaan yang tak terhingga bagi kami sekeluarga, atas kehadiran serta doa restu Bapak/Ibu/Saudara/i yang telah melengkapi lembaran kisah bahagia kami.&rdquo;
            </p>

            {/* Editorial Signature Imprint */}
            <div className={`border-y py-4 space-y-1 ${
              isLight ? 'border-stone-200 bg-stone-50/50' : 'border-white/10 bg-white/[0.02]'
            }`}>
              <span className="text-[10px] uppercase tracking-widest font-sans text-gold-500 block font-bold">
                KAMI YANG BERBAHAGIA,
              </span>
              <h4 
                className={`text-xl sm:text-2xl font-bold tracking-wide uppercase ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
                style={{ fontFamily: `'${fonts.heading || 'Cinzel'}', serif` }}
              >
                {groomName} &amp; {brideName}
              </h4>
              <span className={`text-[11px] block font-sans ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Beserta Segenap Keluarga Besar Kedua Mempelai
              </span>
            </div>

            {/* Back to top button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`w-full py-3 rounded-xl font-sans text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-stone-900 text-white hover:bg-stone-800'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5 text-gold-400" />
                <span>Kembali ke Sampul Majalah (Top)</span>
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <ScrollReveal direction="fade">
        <footer className="text-center pt-8 border-t border-white/10 text-[10px] text-slate-400 font-sans tracking-widest uppercase">
          Published by Weddora Editorial • All Rights Reserved
        </footer>
      </ScrollReveal>
    </div>
  );
};
