'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, CheckCircle2, Check, Sparkles, Building2, HeartHandshake } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export function PricingSection() {
  const [pricingType, setPricingType] = useState<'single' | 'vendor'>('single');

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        <ScrollReveal direction="up">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-extrabold border border-gold-500/30 shadow-sm">
              <Crown className="w-4 h-4 text-gold-500" />
              <span>Pilihan Paket Perorangan & Mitra Vendor</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white font-playfair leading-tight">
              Harga Transparan untuk Pasangan & Mitra WO / EO / Fotografer
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Pilih Paket Perorangan untuk 1 undangan atau sewa Paket Mitra Kuota (10 Pcs, 25 Pcs, 50 Pcs) untuk bisnis usaha Anda.
            </p>

            {/* TAB TOGGLE SWITCHER */}
            <div className="inline-flex p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl gap-2 mt-4 relative">
              <button
                onClick={() => setPricingType('single')}
                className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  pricingType === 'single'
                    ? 'gold-metallic-bg text-slate-950 shadow-lg font-black scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-gold-500 hover:scale-102'
                }`}
              >
                <Crown className="w-4 h-4" />
                <span>Paket Perorangan (1 Undangan)</span>
              </button>

              <button
                onClick={() => setPricingType('vendor')}
                className={`px-5 py-3 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  pricingType === 'vendor'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg font-black scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-purple-400 hover:scale-102'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Paket Mitra (WO / EO / Fotografer) 🚀</span>
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* ================= VIEW 1: PAKET PERORANGAN (1 UNDANGAN) ================= */}
        {pricingType === 'single' && (
          <div className="space-y-12 animate-fadeIn">
            {/* EQUAL UNIFORM SIZED CARDS GRID WITH LIGHT & DARK MODE SUPPORT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Premium Single Plan (89k) */}
              <ScrollReveal direction="up" delay={100}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-gold-500/60 dark:border-gold-500/70 shadow-xl space-y-6 flex flex-col justify-between relative z-10 h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:border-gold-500 hover:shadow-gold-500/30 hover:shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400 text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-gold-500/30 transition-colors">
                        PAKET PREMIUM (1 UNDANGAN)
                      </span>
                      <span className="text-xs font-bold text-gold-600 dark:text-gold-400">89k</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-playfair group-hover:text-gold-600 dark:group-hover:text-gold-300 transition-colors">
                      Premium Studio
                    </h3>
                    <div className="text-4xl font-black text-gold-600 dark:text-gold-400 group-hover:scale-105 origin-left transition-transform duration-300">
                      Rp 89.000 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ 1 undangan</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Pilihan favorit pasangan untuk website undangan digital elegan lengkap dengan studio visual.
                    </p>

                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-gold-300"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 group-hover:scale-110 transition-transform" /> Fitur Auto Scroll Layar Otomatis</li>
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-gold-300"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0 group-hover:scale-110 transition-transform" /> Weddora Visual Design Studio</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Siluet Prewedding HD (8 Preset BG)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Tipografi Watermark Inisial Pengantin</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Upload File Musik MP3 Kustom Bebas</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Amplop Digital (Rekening Bank & Hadiah)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Masa Aktif Website 12 Bulan</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Timeline Cerita Cinta (Love Story)</li>
                    </ul>
                  </div>
                  <Link
                    href="/register?package=PREMIUM"
                    className="w-full py-4 rounded-2xl gold-shimmer-btn text-slate-950 font-black text-xs text-center block shadow-xl transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-gold-500/50"
                  >
                    Pilih Paket Premium (Rp 89rb)
                  </Link>
                </div>
              </ScrollReveal>

              {/* Luxury VIP Single Plan (100k) */}
              <ScrollReveal direction="zoom" delay={200}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/70 shadow-xl space-y-6 flex flex-col justify-between relative z-10 h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:border-purple-500 hover:shadow-purple-500/40">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>PALING POPULER</span>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-purple-500/30 transition-colors">
                        PAKET LUXURY VIP (1 UNDANGAN)
                      </span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">100k</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-playfair group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      Luxury Royal VIP
                    </h3>
                    <div className="text-4xl font-black text-purple-600 dark:text-purple-400 group-hover:scale-105 origin-left transition-transform duration-300">
                      Rp 100.000 <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ 1 undangan</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Tingkat kemewahan tertinggi tanpa batasan, aktif selamanya, & fitur VIP eksklusif.
                    </p>

                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-purple-300"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 group-hover:scale-110 transition-transform" /> Masa Aktif Selamanya (Lifetime)</li>
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-purple-300"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 group-hover:scale-110 transition-transform" /> Auto Scroll Ring Indicator 60FPS</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> YouTube Autoplay Video Prewedding HD</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Floating Particle Effects VIP Eksklusif</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> 5 Custom Photo Frame Shapes</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> E-Guestbook QR Code Check-in Tamu</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Tanpa Watermark (White-label Brand)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Support Prioritas VIP Manager 24/7</li>
                    </ul>
                  </div>
                  <Link
                    href="/register?package=LUXURY"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs text-center block transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-purple-500/50 shadow-md"
                  >
                    Pilih Paket Luxury VIP (Rp 100rb)
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* COMPARISON MATRIX TABLE FOR PERORANGAN PACKAGES */}
            <div className="pt-8 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-playfair">
                  Perbandingan Fitur Perorangan (Premium vs Luxury)
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-6 py-4">Fasilitas & Fitur Utama</th>
                        <th className="px-6 py-4 text-center text-gold-600 dark:text-gold-400 font-extrabold">Premium (89rb) ⭐</th>
                        <th className="px-6 py-4 text-center text-purple-600 dark:text-purple-400 font-extrabold">Luxury VIP (100rb) 👑</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Masa Aktif Website Undangan</td>
                        <td className="px-6 py-4 text-center font-bold text-gold-600 dark:text-gold-400">12 Bulan</td>
                        <td className="px-6 py-4 text-center font-extrabold text-purple-600 dark:text-purple-400">Selamanya (Lifetime)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Fitur Auto Scroll & Ring Progress Indicator</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Weddora Visual Design Studio Engine</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Siluet Prewedding HD + Preset Latar Belakang</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Upload File Musik MP3 Kustom Bebas</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">YouTube Autoplay Video Prewedding HD</td>
                        <td className="px-6 py-4 text-center text-slate-400">—</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">E-Guestbook QR Code Check-in Tamu VIP</td>
                        <td className="px-6 py-4 text-center text-slate-400">—</td>
                        <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-emerald-500 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: PAKET MITRA VENDOR ================= */}
        {pricingType === 'vendor' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-900/10 via-purple-900/30 to-indigo-900/10 dark:from-purple-900/40 dark:via-slate-900 dark:to-indigo-900/40 p-6 rounded-3xl border border-purple-500/30 text-center max-w-4xl mx-auto space-y-2 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-500/30">
                <HeartHandshake className="w-4 h-4 text-purple-500" />
                <span>Program Kemitraan Khusus Vendor Wedding</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-playfair">Sewa / Beli Paket Kuota Massal Untuk Usaha Anda</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Solusi hemat untuk Wedding Organizer (WO), Event Organizer (EO), & Fotografer Prewedding. Beli paket kuota massal, atur sendiri harga jual ke klien Anda, dan kelola puluhan undangan dari 1 Dashboard Vendor.
              </p>
            </div>

            {/* 3 EQUAL UNIFORM SIZED VENDOR CARDS WITH DYNAMIC LIGHT & DARK MODE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
              {/* Paket 10 Pcs (Total Rp750.000) */}
              <ScrollReveal direction="up" delay={100}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 shadow-lg h-full relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-blue-500/30 transition-colors">
                        PAKET 10 PCS
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">10 Undangan</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-playfair group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      Paket 10 Pcs
                    </h3>
                    <div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:scale-105 origin-left transition-transform">
                        Total Rp 750.000
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold block mt-1">Rp 75.000 / pcs • Hemat 25% (Base tier)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Cocok untuk fotografer freelance atau WO skala pemula yang butuh kuota awal.</p>

                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" /> Kuota 10 Pcs Website Undangan Digital</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Bebas Pilih Template Premium & Luxury</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Masa Aktif Kuota 1 Tahun</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Dashboard Multi-Client Vendor</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Fitur Auto Scroll & MP3 Autoplay</li>
                    </ul>
                  </div>
                  <Link
                    href="/register?package=VENDOR_10"
                    className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-extrabold text-xs text-center block transition-all duration-300 group-hover:bg-purple-600 group-hover:scale-[1.03] shadow-md"
                  >
                    Beli Paket 10 Pcs (750rb)
                  </Link>
                </div>
              </ScrollReveal>

              {/* Paket 25 Pcs (Total Rp1.500.000) */}
              <ScrollReveal direction="zoom" delay={200}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/70 shadow-xl space-y-6 flex flex-col justify-between relative z-10 h-full transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:border-purple-500 hover:shadow-purple-500/40">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>PALING POPULER</span>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-purple-500/30 transition-colors">
                        PAKET 25 PCS (WO/EO)
                      </span>
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">25 Undangan</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-playfair group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                      Paket 25 Pcs
                    </h3>
                    <div>
                      <div className="text-3xl font-black text-purple-600 dark:text-purple-400 group-hover:scale-105 origin-left transition-transform">
                        Total Rp 1.500.000
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">Rp 60.000 / pcs • Hemat 40% (Turun Rp 15.000/pcs)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">Paket paling laris untuk Wedding Organizer & Studio Foto profesional.</p>

                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-purple-300"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 group-hover:scale-110 transition-transform" /> Kuota 25 Pcs Website Undangan Digital</li>
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-purple-300"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 group-hover:scale-110 transition-transform" /> White-Label (Bisa Pasang Logo WO/EO)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Masa Aktif Kuota 2 Tahun</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Akses Semua Template VIP & Auto Scroll</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Support Pembuatan Template Kustom</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" /> Prioritas Tim Technical Support 24/7</li>
                    </ul>
                  </div>
                  <Link
                    href="/register?package=VENDOR_25"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs text-center block transition-all duration-300 group-hover:scale-[1.04] group-hover:shadow-purple-500/50 shadow-xl"
                  >
                    Beli Paket 25 Pcs (1.500rb)
                  </Link>
                </div>
              </ScrollReveal>

              {/* Paket 50 Pcs (Total Rp2.250.000) */}
              <ScrollReveal direction="up" delay={300}>
                <div className="group p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between transition-all duration-500 hover:-translate-y-3 hover:scale-[1.04] hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/30 shadow-lg h-full relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-indigo-500/30 transition-colors">
                        PAKET 50 PCS
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">50 Undangan</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white font-playfair group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      Paket 50 Pcs
                    </h3>
                    <div>
                      <div className="text-3xl font-black text-slate-900 dark:text-white group-hover:scale-105 origin-left transition-transform">
                        Total Rp 2.250.000
                      </div>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-500 font-bold block mt-1">Rp 45.000 / pcs • Hemat 55% (Turun Rp 15.000/pcs)</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Untuk agency besar, grup venue studio, & vendor pernikahan beromzet tinggi.</p>

                    <ul className="space-y-3 text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" /> Kuota 50 Pcs Website Undangan Digital VIP</li>
                      <li className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" /> Masa Aktif Kuota Selamanya (Lifetime)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Custom Subdomain Brand WO/EO Anda</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Multi-User Team Access (5 Akun Staf)</li>
                      <li className="flex items-center gap-2.5 font-medium"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Account VIP Manager</li>
                    </ul>
                  </div>
                  <Link
                    href="/register?package=VENDOR_50"
                    className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs text-center block transition-all duration-300 group-hover:scale-[1.03] shadow-md"
                  >
                    Beli Paket 50 Pcs (2.250rb)
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* TABEL PERBANDINGAN TIER HARGA PAKETAN VENDOR */}
            <ScrollReveal direction="up" delay={200}>
              <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
                <div className="p-5 bg-gradient-to-r from-purple-900/10 via-purple-900/20 to-indigo-900/10 dark:from-purple-900/30 dark:to-indigo-900/30 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-playfair">
                      Matriks Perbandingan Skema Harga Paket Vendor
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Makin besar kuota paket yang Anda ambil, semakin hemat biaya unit per website undangan.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    TIER RESELLER
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3.5">Paket</th>
                        <th className="px-6 py-3.5">Total Harga</th>
                        <th className="px-6 py-3.5">Harga / Pcs</th>
                        <th className="px-6 py-3.5">Diskon / Hemat</th>
                        <th className="px-6 py-3.5">Selisih Unit Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          Paket 10 Pcs
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Rp 750.000</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Rp 75.000 / pcs</td>
                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">Hemat 25%</td>
                        <td className="px-6 py-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">Base tier</td>
                      </tr>
                      <tr className="bg-purple-500/5 hover:bg-purple-500/10 transition-colors">
                        <td className="px-6 py-4 font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          Paket 25 Pcs <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">POPULER</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-purple-700 dark:text-purple-300">Rp 1.500.000</td>
                        <td className="px-6 py-4 text-purple-900 dark:text-purple-200 font-semibold">Rp 60.000 / pcs</td>
                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">Hemat 40%</td>
                        <td className="px-6 py-4 font-bold text-purple-600 dark:text-purple-400 text-[11px]">Turun Rp 15.000/pcs</td>
                      </tr>
                      <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          Paket 50 Pcs
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">Rp 2.250.000</td>
                        <td className="px-6 py-4 text-slate-700 dark:text-slate-300">Rp 45.000 / pcs</td>
                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold">Hemat 55%</td>
                        <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">Turun Rp 15.000/pcs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </section>
  );
}
