'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import {
  ShieldCheck,
  Palette,
  Music,
  Users,
  FileText,
  Layers,
  CreditCard,
  Settings,
  ArrowRight,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminDashboardPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [stats, setStats] = useState({
    clientsCount: 0,
    templatesCount: 0,
    invitationsCount: 0,
    musicCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [resUsers, resTemplates, resMusic] = await Promise.all([
          fetch('/api/admin/clients'),
          fetch('/api/admin/templates'),
          fetch('/api/admin/music'),
        ]);

        const users = resUsers.ok ? await resUsers.json() : [];
        const templates = resTemplates.ok ? await resTemplates.json() : [];
        const music = resMusic.ok ? await resMusic.json() : [];

        let invCount = 0;
        users.forEach((u: any) => {
          if (u.invitations && Array.isArray(u.invitations)) {
            invCount += u.invitations.length;
          }
        });

        setStats({
          clientsCount: users.length,
          templatesCount: templates.length,
          invitationsCount: invCount || 1,
          musicCount: music.length,
        });
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Admin Header */}
        <ScrollReveal direction="down" duration={600}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
            isLight ? 'border-slate-300' : 'border-slate-800'
          }`}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Weddora Superadmin Control Center</span>
              </div>
              <h1 className={`text-3xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Dashboard Overview & Stat Ringkasan
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pusat kendali eksekutif untuk pengelolaan pengguna, template, musik, dan sistem platform.
              </p>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-5 py-3 rounded-2xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-xs shadow-xl flex items-center gap-2 shrink-0 transition-transform hover:scale-105"
            >
              <Globe className="w-4 h-4 text-slate-950" />
              <span>Buka Website Publik</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-950 opacity-80" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Counter Cards */}
        <ScrollReveal direction="up" delay={150} duration={700}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-3xl border space-y-3 shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Total Client Terdaftar</span>
                <Users className="w-5 h-5 text-emerald-500" />
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isLoading ? '...' : stats.clientsCount} Client
              </div>
              <p className="text-[11px] text-emerald-500 font-medium font-mono">Daftar pengguna aktif platform</p>
            </div>

            <div className={`p-6 rounded-3xl border space-y-3 shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Template Aktif Katalog</span>
                <Palette className="w-5 h-5 text-gold-500" />
              </div>
              <div className="text-3xl font-extrabold text-gold-500">
                {isLoading ? '...' : stats.templatesCount} Template
              </div>
              <p className="text-[11px] text-gold-500 font-medium font-mono">Paket Perorangan & Vendor</p>
            </div>

            <div className={`p-6 rounded-3xl border space-y-3 shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Undangan Dibuat</span>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {isLoading ? '...' : stats.invitationsCount} Undangan
              </div>
              <p className="text-[11px] text-blue-500 font-medium font-mono">Total hasil kreasi client</p>
            </div>

            <div className={`p-6 rounded-3xl border space-y-3 shadow-xl transition-colors ${
              isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className={`flex items-center justify-between text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Koleksi Musik MP3</span>
                <Music className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-extrabold text-purple-500">
                {isLoading ? '...' : stats.musicCount} Lagu
              </div>
              <p className="text-[11px] text-purple-500 font-medium font-mono">Pilihan backsound database</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Admin Navigation Quick Modules */}
        <ScrollReveal direction="up" delay={250} duration={800}>
          <div className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              <Layers className="w-4 h-4 text-gold-500" /> Executive Management Modules
            </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/admin/clients"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-emerald-500' : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                  <Users className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-emerald-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Client Management
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Kelola client terdaftar, upgrade paket (Perorangan 89k/100k & Vendor), dan hapus undangan client.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/templates"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-gold-500' : 'bg-slate-900 border-slate-800 hover:border-gold-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-500">
                  <Palette className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-gold-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Template Studio Manager
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Tambah template baru, ubah harga paket, atur status tayang (Published/Draft).
                </p>
              </div>
            </Link>

            <Link
              href="/admin/music"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-purple-500' : 'bg-slate-900 border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500">
                  <Music className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-purple-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Music Library Manager
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Unggah file audio MP3 baru ke database, putar preview, dan hapus lagu.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-blue-500' : 'bg-slate-900 border-slate-800 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                  <Layers className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-blue-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Category Manager
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Kelola kategori kelompok tema template (Modern, Islamic, Luxury, Traditional).
                </p>
              </div>
            </Link>

            <Link
              href="/admin/orders"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-amber-500' : 'bg-slate-900 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-amber-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Orders & Revenue
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Pantau transaksi pemesanan paket client dan riwayat pembayaran.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-slate-400' : 'bg-slate-900 border-slate-800 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl border ${isLight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  <Settings className="w-6 h-6" />
                </div>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-all ${isLight ? 'text-slate-400 group-hover:text-slate-900' : 'text-slate-600 group-hover:text-white'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-gold-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Platform Settings
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Atur konfigurasi global, Midtrans payment gateway, dan WhatsApp support.
                </p>
              </div>
            </Link>
          </div>
        </div>
        </ScrollReveal>
      </main>

      <AdminFooter />
    </div>
  );
}
