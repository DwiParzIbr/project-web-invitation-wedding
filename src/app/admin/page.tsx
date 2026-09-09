'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Palette,
  Music,
  Users,
  User,
  FileText,
  Layers,
  CreditCard,
  Settings,
  ArrowRight,
  Globe,
  ExternalLink,
  Crown,
  Wrench,
  Sparkles,
  CheckCircle2,
  Activity,
  Plus,
  Lock,
  Heart,
  Eye,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminDashboardPage() {
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [stats, setStats] = useState({
    clientsCount: 0,
    templatesCount: 0,
    invitationsCount: 0,
    musicCount: 0,
  });
  const [roleCounts, setRoleCounts] = useState({
    ADMIN: 1,
    OPERATOR: 1,
    USER: 2,
    DEMO: 2,
    TOTAL: 6,
  });
  const [recentInvitations, setRecentInvitations] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [resUsers, resTemplates, resMusic, resPermissions, resMe] = await Promise.all([
          fetch('/api/admin/clients'),
          fetch('/api/admin/templates'),
          fetch('/api/admin/music'),
          fetch('/api/admin/permissions'),
          fetch('/api/auth/me'),
        ]);

        const users = resUsers.ok ? await resUsers.json() : [];
        const templates = resTemplates.ok ? await resTemplates.json() : [];
        const music = resMusic.ok ? await resMusic.json() : [];
        const permissionsData = resPermissions.ok ? await resPermissions.json() : null;
        const meData = resMe.ok ? await resMe.json() : null;

        if (meData?.user) setCurrentUser(meData.user);

        let invCount = 0;
        const extractedInvs: any[] = [];

        users.forEach((u: any) => {
          if (u.invitations && Array.isArray(u.invitations)) {
            invCount += u.invitations.length;
            u.invitations.forEach((inv: any) => {
              extractedInvs.push({
                ...inv,
                userName: u.name,
                userEmail: u.email,
                userPackage: u.package,
              });
            });
          }
        });

        // Sort recent invitations by createdAt desc
        extractedInvs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentInvitations(extractedInvs.slice(0, 5));

        setStats({
          clientsCount: users.length,
          templatesCount: templates.length,
          invitationsCount: invCount || 1,
          musicCount: music.length,
        });

        if (permissionsData?.counts) {
          setRoleCounts(permissionsData.counts);
        }
      } catch (err) {
        console.error('Error loading dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const isOperator = currentUser?.role === 'OPERATOR';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* 1. EXECUTIVE WELCOME BANNER */}
      <ScrollReveal direction="down" duration={600} className="relative z-20">
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative transition-all z-20 ${
          isLight
            ? 'bg-gradient-to-r from-amber-500/10 via-white to-purple-500/10 border-slate-200'
            : 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-gold-500/30'
        }`}>
          {/* Subtle Background Glow Container with isolated overflow-hidden so dropdown is NOT clipped */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none -z-0">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  isOperator
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
                }`}>
                  {isOperator ? <Wrench className="w-3.5 h-3.5 text-blue-500" /> : <Crown className="w-3.5 h-3.5 text-gold-500" />}
                  <span>{isOperator ? 'Konsol Staf Operasional' : 'Executive Superadmin Center'}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Sistem Operasional Normal</span>
                </span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-extrabold font-playfair tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Selamat Datang, {currentUser?.name || (isOperator ? 'Staf Operator' : 'Super Admin')}!
              </h1>

              <p className={`text-xs max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pusat kendali eksekutif platform undangan pernikahan digital Weddora VIP. Kelola akun pengguna, katalog desain template, pustaka musik MP3, serta pantau undangan yang sedang aktif.
              </p>
            </div>

            {/* Quick Action Pill Buttons & User Profile Icon Button */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 relative">
              <Link
                href="/admin/clients"
                className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all hover:scale-105"
              >
                <Users className="w-4 h-4" />
                <span>Kelola Klien</span>
              </Link>
              <Link
                href="/"
                target="_blank"
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl border font-bold text-xs flex items-center gap-1.5 transition-all hover:scale-105 ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 shadow-sm'
                }`}
              >
                <Globe className="w-4 h-4 text-gold-500" />
                <span>Buka Website Publik</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              {/* Theme Toggle Shortcut (Sesuai Gambar 3) */}
              <button
                onClick={toggleTheme}
                className={`w-10 sm:w-11 h-10 sm:h-11 rounded-full border flex items-center justify-center transition-all hover:scale-105 shadow-sm ${
                  isLight
                    ? 'bg-white hover:bg-slate-50 border-slate-200 text-purple-600'
                    : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-gold-400'
                }`}
                aria-label="Toggle theme"
              >
                {isLight ? <Moon className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" /> : <Sun className="w-4 sm:w-5 h-4 sm:h-5 text-amber-400" />}
              </button>

              {/* User Avatar Circle Icon Button (Sesuai Gambar 3 - Bisa Di-klik) */}
              <div className="relative z-30" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative shadow-md ring-2 cursor-pointer focus:outline-none ${
                    isOperator
                      ? 'ring-blue-500 hover:ring-blue-400'
                      : 'ring-amber-500 dark:ring-gold-500 hover:ring-amber-400 dark:hover:ring-gold-400'
                  }`}
                  aria-label="Buka Menu Profil Admin"
                >
                  {/* Premium High-Res Stylized Avatar Sesuai Gambar 3 */}
                  <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 relative shadow-inner">
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <defs>
                        <linearGradient id="adminAvatarBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#F97316" />
                          <stop offset="1" stopColor="#EA580C" />
                        </linearGradient>
                        <linearGradient id="adminAvatarSkin" x1="14" y1="8" x2="26" y2="21" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#FED7AA" />
                          <stop offset="1" stopColor="#FDBA74" />
                        </linearGradient>
                        <linearGradient id="adminAvatarShirt" x1="8" y1="24" x2="32" y2="40" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#3B82F6" />
                          <stop offset="1" stopColor="#1D4ED8" />
                        </linearGradient>
                      </defs>
                      {/* Base Background Circle */}
                      <circle cx="20" cy="20" r="20" fill="url(#adminAvatarBg)" />
                      {/* Head */}
                      <circle cx="20" cy="14" r="6.5" fill="url(#adminAvatarSkin)" />
                      {/* Torso / Shirt */}
                      <path d="M7 37C7 28.5 12.5 24 20 24C27.5 24 33 28.5 33 37C29.5 39.3 25 40 20 40C15 40 10.5 39.3 7 37Z" fill="url(#adminAvatarShirt)" />
                    </svg>
                  </div>
                  {/* Online Presence Dot */}
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950 shadow-sm pointer-events-none" />
                </button>

                {/* Profile Menu Dropdown */}
                {isProfileMenuOpen && (
                  <div className={`absolute right-0 top-full mt-3 w-72 max-w-[calc(100vw-2.5rem)] rounded-3xl border shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-slideDown ${
                    isLight
                      ? 'bg-white/95 border-slate-200 text-slate-900 shadow-2xl shadow-slate-400/40'
                      : 'bg-slate-950/95 border-gold-500/30 text-white shadow-2xl shadow-black/90'
                  }`}>
                    {/* User Header Info */}
                    <div className={`p-5 border-b ${isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-amber-400 dark:ring-gold-500 shadow-md">
                          <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                            <circle cx="20" cy="20" r="20" fill="url(#adminAvatarBg)" />
                            <circle cx="20" cy="14" r="6.5" fill="url(#adminAvatarSkin)" />
                            <path d="M7 37C7 28.5 12.5 24 20 24C27.5 24 33 28.5 33 37C29.5 39.3 25 40 20 40C15 40 10.5 39.3 7 37Z" fill="url(#adminAvatarShirt)" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-sm block truncate">
                            {currentUser?.name || (isOperator ? 'Staf Operator' : 'Super Admin Weddora')}
                          </span>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {currentUser?.email || (isOperator ? 'operator@weddora.com' : 'admin@weddora.com')}
                          </p>
                          <span className={`inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isOperator
                              ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {isOperator ? '🛠️ Staf Operator' : '👑 Super Admin'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Menu Links */}
                    <div className="p-2.5 space-y-1 text-xs font-semibold">
                      <Link
                        href="/admin/permissions"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-purple-500" />
                          <span>Hak Akses & Role</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-purple-500/20 text-purple-400 uppercase">
                          RBAC
                        </span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center gap-3 transition-all ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Pengaturan Sistem</span>
                      </Link>

                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className={`w-full px-3.5 py-2.5 rounded-2xl flex items-center justify-between transition-all ${
                          isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-slate-900 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-gold-400" />}
                          <span>Mode Tampilan</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isLight ? 'Terang' : 'Gelap'}
                        </span>
                      </button>
                    </div>

                    {/* Logout Option */}
                    <div className={`p-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                      <Link
                        href="/api/auth/logout"
                        className="w-full py-2.5 px-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar Akun Admin</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. TOP 4 KEY METRIC CARDS */}
      <ScrollReveal direction="up" delay={150} duration={700} className="relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Pengguna */}
          <div className={`p-6 rounded-3xl border space-y-3 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 hover:border-emerald-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Total Pengguna
              </span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isLoading ? '...' : stats.clientsCount} <span className="text-sm font-sans font-medium text-slate-400">Akun</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-bold">
              <span>👑 {roleCounts.ADMIN} Admin</span>
              <span>•</span>
              <span>🛠️ {roleCounts.OPERATOR} Operator</span>
              <span>•</span>
              <span>💍 {roleCounts.USER} User</span>
            </div>
          </div>

          {/* Template Aktif */}
          <div className={`p-6 rounded-3xl border space-y-3 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 hover:border-gold-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-gold-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Katalog Template
              </span>
              <div className="p-2.5 rounded-2xl bg-gold-500/10 text-gold-500">
                <Palette className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-gold-500">
              {isLoading ? '...' : stats.templatesCount} <span className="text-sm font-sans font-medium text-slate-400">Tema</span>
            </div>
            <p className="text-[11px] text-gold-600 dark:text-gold-400 font-medium">
              21 Desain Unik (Adat, Modern & Luxury)
            </p>
          </div>

          {/* Undangan Dibuat */}
          <div className={`p-6 rounded-3xl border space-y-3 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 hover:border-blue-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-blue-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Undangan Aktif
              </span>
              <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className={`text-3xl font-extrabold font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {isLoading ? '...' : stats.invitationsCount} <span className="text-sm font-sans font-medium text-slate-400">Kreasi</span>
            </div>
            <p className="text-[11px] text-blue-500 font-medium">
              Live website pengantin terpublikasi
            </p>
          </div>

          {/* Koleksi Musik MP3 */}
          <div className={`p-6 rounded-3xl border space-y-3 shadow-lg transition-all ${
            isLight ? 'bg-white border-slate-200 hover:border-purple-500/50' : 'bg-slate-900/90 border-slate-800 hover:border-purple-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Musik MP3 Kustom
              </span>
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500">
                <Music className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold font-mono text-purple-500">
              {isLoading ? '...' : stats.musicCount} <span className="text-sm font-sans font-medium text-slate-400">Audio</span>
            </div>
            <p className="text-[11px] text-purple-500 font-medium">
              Pustaka MP3 lokal berkualitas tinggi
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. DUAL-SECTION: RECENT LIVE INVITATIONS & ROLE DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Recent Live Invitations */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border shadow-xl space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h2 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                Undangan Pernikahan Terbaru
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftar kreasi website undangan yang baru saja dibuat atau diperbarui klien.
              </p>
            </div>
            <Link
              href="/admin/clients"
              className="text-xs text-gold-500 font-bold hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Memuat data undangan klien terbaru...
              </div>
            ) : recentInvitations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Belum ada undangan yang dibuat oleh klien.
              </div>
            ) : (
              recentInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                      : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4 fill-gold-500/20" />
                    </div>
                    <div className="min-w-0">
                      <h4 className={`font-bold text-xs truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {inv.title || 'Undangan Pernikahan VIP'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        Pemilik: <span className="font-medium text-slate-700 dark:text-slate-300">{inv.userName}</span> • Paket: <span className="font-mono text-gold-500 font-bold">{inv.userPackage}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {inv.isPublished ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                    {inv.slug && (
                      <Link
                        href={`/${inv.slug}`}
                        target="_blank"
                        className={`p-2 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-white hover:bg-slate-200 border-slate-300 text-slate-700'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
                        }`}
                        title="Buka Undangan Live"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-500" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Role Distribution & Platform Security */}
        <div className="lg:col-span-5 space-y-6">
          {/* Role Distribution Card */}
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className={`font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <ShieldCheck className="w-4 h-4 text-purple-500" />
                Distribusi 4 Peran Akun (RBAC)
              </h3>
              <Link href="/admin/permissions" className="text-[11px] text-gold-500 font-bold hover:underline">
                Kelola &rarr;
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                  <Crown className="w-3.5 h-3.5" /> Super Admin
                </span>
                <span className="font-mono font-extrabold">{roleCounts.ADMIN} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <Wrench className="w-3.5 h-3.5" /> Staf Operator
                </span>
                <span className="font-mono font-extrabold">{roleCounts.OPERATOR} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Users className="w-3.5 h-3.5" /> User Klien Resmi
                </span>
                <span className="font-mono font-extrabold">{roleCounts.USER} Akun</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Akun Demo / Trial
                </span>
                <span className="font-mono font-extrabold">{roleCounts.DEMO} Akun</span>
              </div>
            </div>

            {/* Visual Stacked Progress Bar */}
            <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-800">
              <div style={{ width: '20%' }} className="bg-purple-500" title="Admin" />
              <div style={{ width: '20%' }} className="bg-blue-500" title="Operator" />
              <div style={{ width: '35%' }} className="bg-emerald-500" title="User Klien" />
              <div style={{ width: '25%' }} className="bg-amber-500" title="Demo" />
            </div>
          </div>

          {/* System Health Card */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-3 ${
            isLight ? 'bg-gradient-to-br from-white to-emerald-50/30 border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Activity className="w-4 h-4 text-emerald-500" />
                Status Infrastruktur Platform
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% HEALTHY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/10">
                <span className="text-slate-400 block text-[10px]">Database</span>
                <span className="font-bold text-emerald-500">Prisma SQLite Aktif</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/10">
                <span className="text-slate-400 block text-[10px]">Keamanan SSL</span>
                <span className="font-bold text-emerald-500">256-Bit Encrypted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/10">
                <span className="text-slate-400 block text-[10px]">Payment Gateway</span>
                <span className="font-bold text-emerald-500">Midtrans & QRIS</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-500/5 border border-slate-500/10">
                <span className="text-slate-400 block text-[10px]">Pustaka Audio</span>
                <span className="font-bold text-emerald-500">Local Uploads Siap</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. EXECUTIVE MANAGEMENT MODULES (7 MODULE CARDS) */}
      <ScrollReveal direction="up" delay={250} duration={800}>
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              <Layers className="w-4 h-4 text-gold-500" /> Executive Management Modules
            </h2>
            <span className="text-xs text-slate-400 font-mono">7 Modul Terintegrasi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Hak Akses & Role Management */}
            <Link
              href="/admin/permissions"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg relative overflow-hidden ${
                isLight
                  ? 'bg-white border-purple-200 hover:border-purple-500 hover:shadow-purple-500/10'
                  : 'bg-slate-900 border-purple-500/30 hover:border-purple-500 hover:shadow-purple-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                    Modul Baru
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-purple-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Hak Akses & Role Manager
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Pemisahan 4 akun (Super Admin, Operator, User Klien, Demo), matriks wewenang, dan penambahan akun baru.
                </p>
              </div>
            </Link>

            {/* 2. Client Management */}
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

            {/* 3. Template Studio Manager */}
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

            {/* 4. Category Manager */}
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

            {/* 5. Music Library Manager */}
            <Link
              href="/admin/music"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-pink-500' : 'bg-slate-900 border-slate-800 hover:border-pink-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500">
                  <Music className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-pink-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Music Library Manager
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Unggah file audio MP3 baru ke database, putar preview, dan atur daftar lagu.
                </p>
              </div>
            </Link>

            {/* 6. Orders & Revenue */}
            <Link
              href="/admin/orders"
              className={`p-6 border rounded-3xl space-y-4 group transition-all shadow-lg ${
                isLight ? 'bg-white border-slate-200 hover:border-teal-500' : 'bg-slate-900 border-slate-800 hover:border-teal-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <h3 className={`text-lg font-bold group-hover:text-teal-500 transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Orders & Revenue
                </h3>
                <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Pantau transaksi pemesanan paket client dan riwayat pembayaran.
                </p>
              </div>
            </Link>

            {/* 7. Platform Settings */}
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
  );
}
