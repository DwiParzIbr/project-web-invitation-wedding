import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { TemplateGallerySection } from '@/components/home/TemplateGallerySection';
import { PricingSection } from '@/components/home/PricingSection';
import { db } from '@/lib/db';
import {
  Sparkles,
  Crown,
  Heart,
  Palette,
  CheckCircle2,
  Music,
  ArrowRight,
  Check,
  Star,
  ShieldCheck,
  Zap,
  Award,
  Users,
  Eye,
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const categories = await db.category.findMany();
  const templates = await db.template.findMany({
    include: { category: true },
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      {/* ULTRA-LUXURY HERO SECTION */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-amber-500/5 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 border-b border-gold-500/20">
        {/* Ambient Gold Glow Backdrop Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <ScrollReveal direction="up" delay={100}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-gold-500/50 text-gold-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-xl">
                <Crown className="w-4 h-4 text-gold-400" />
                <span>Platform Undangan Digital Mewah No. 1 di Indonesia</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white font-playfair leading-[1.12]">
                Website Undangan <br className="hidden sm:block" />
                <span className="gold-gradient-text">Mewah & Berkelas</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Ciptakan momen pernikahan impian dengan template berkesan royal keraton & modern internasional. Dilengkapi musik MP3 kustom, cover amplop emas, RSVP, Google Maps, dan kado digital langsung dari HP.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <div className="flex items-center justify-center lg:justify-start gap-3 py-1">
                <div className="flex items-center gap-1 text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  5.0 Rating Pasangan Bahagia <span className="text-slate-400 font-normal">(2,400+ Client Terdaftar)</span>
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={500}>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="#templates"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl gold-shimmer-btn text-slate-950 font-extrabold text-sm shadow-2xl shadow-gold-500/30 hover:scale-105 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Lihat 15+ Template Gallery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/demo"
                  target="_blank"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900/90 border-2 border-gold-500/40 text-slate-900 dark:text-slate-100 hover:border-gold-500 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl backdrop-blur-md"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/30" />
                  <span>Demo Undangan Live</span>
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={600}>
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Upload MP3 Musik Kustom</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>Pilihan Kata Mutiara Indah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-500" />
                  <span>RSVP & Digital Gift QRIS</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Phone Showcase Frame with Ambient Gold Glow */}
          <div className="lg:col-span-5 flex justify-center">
            <ScrollReveal direction="zoom" delay={300}>
              <div className="relative w-full max-w-[340px] aspect-[9/19] bg-slate-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-gold-500/60 ambient-gold-glow animate-float-gentle">
                <div className="w-full h-full bg-slate-950 rounded-[38px] overflow-hidden relative flex flex-col border border-slate-800">
                  {/* Top Mockup Header */}
                  <div className="h-9 bg-black/60 px-5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>09:41</span>
                    <span className="text-gold-400 font-bold">WEDDORA VIP</span>
                  </div>

                  {/* Content Mockup Card */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center relative">
                    <div className="space-y-3 pt-6">
                      <span className="text-[10px] uppercase tracking-widest text-gold-400 font-bold block">ROYAL WEDDING INVITATION</span>
                      <h2 className="text-3xl font-bold font-playfair text-white">Andi & Sinta</h2>
                      <p className="text-[11px] text-slate-400 font-mono">Sabtu, 12 Desember 2026</p>
                    </div>

                    <div className="space-y-2.5 p-4 rounded-3xl bg-slate-900/90 border-2 border-gold-500/50 backdrop-blur-xl shadow-2xl">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kepada Yth. Tamu Undangan:</span>
                      <span className="font-bold text-xs text-gold-300 block">Bapak/Ibu/Saudara/i</span>
                      <div className="py-2.5 px-4 gold-metallic-bg rounded-2xl text-slate-950 font-extrabold text-xs shadow-lg tracking-wider">
                        OPEN INVITATION
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 pb-2 flex items-center justify-center gap-1.5 font-semibold">
                      <Music className="w-3.5 h-3.5 text-gold-400 animate-spin" />
                      <span>Autoplay Audio Player Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* TEMPLATE GALLERY MARKETPLACE WITH CATEGORY TABS & LIVE DEMO */}
      <TemplateGallerySection initialTemplates={templates} categories={categories} />

      {/* PRICING & VENDOR PARTNER PACKAGES SECTION */}
      <PricingSection />

      <Footer />
    </div>
  );
}
