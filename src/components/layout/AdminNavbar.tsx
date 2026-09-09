'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Crown,
  LayoutDashboard,
  Users,
  Palette,
  Layers,
  Music,
  ShoppingBag,
  Settings,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Info,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function AdminNavbar() {
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeInfoNotice, setActiveInfoNotice] = useState<string | null>(null);

  const adminNavItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, info: 'Pusat statistik & ringkasan seluruh platform' },
    { label: 'Clients', href: '/admin/clients', icon: Users, info: 'Kelola akun client, upgrade paket perorangan & vendor, & hapus undangan' },
    { label: 'Templates', href: '/admin/templates', icon: Palette, info: 'Kelola katalog template, harga paket 89k/100k & status tayang' },
    { label: 'Categories', href: '/admin/categories', icon: Layers, info: 'Kelola kelompok kategori tema template' },
    { label: 'Music', href: '/admin/music', icon: Music, info: 'Upload file audio MP3 baru ke database & atur lagu' },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, info: 'Riwayat transaksi & rekapitulasi pembayaran paket' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, info: 'Pengaturan global sistem, Midtrans Gateway & WhatsApp' },
  ];

  const handleNavClick = (label: string, info: string) => {
    setActiveInfoNotice(`Modul Aktif: ${label} — ${info}`);
    setTimeout(() => setActiveInfoNotice(null), 4000);
  };

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300 ${
      isLight
        ? 'bg-white/95 border-slate-200 text-slate-900 shadow-md'
        : 'bg-slate-950/95 border-gold-500/30 text-white shadow-2xl'
    }`}>
      {/* Main Admin Console Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Admin Console Brand Logo */}
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl gold-metallic-bg p-0.5 shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
              <img src="/logo.png" alt="Weddora Logo" className="w-full h-full object-contain p-0.5 rounded-[10px]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-lg font-playfair tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  WEDDORA
                </span>
                <span className="px-2 py-0.5 rounded bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/40 text-[9px] font-black tracking-widest uppercase">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className={`text-[9px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Executive Control Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-2xl border transition-colors ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleNavClick(item.label, item.info)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-gold-500 text-slate-950 shadow-md font-extrabold scale-105'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-gold-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Admin Quick Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-gold-500/50'
              }`}
              title={isLight ? 'Ganti ke Mode Gelap (Dark Mode)' : 'Ganti ke Mode Terang (Light Mode)'}
            >
              {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-gold-400" />}
            </button>

            {/* Admin Avatar Badge */}
            <div className={`hidden sm:flex items-center gap-2 pl-2 border-l ${isLight ? 'border-slate-300' : 'border-slate-800'}`}>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold text-xs">
                AD
              </div>
              <div className="text-left leading-tight">
                <span className={`block text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Super Admin</span>
                <span className="block text-[9px] text-emerald-500 font-mono">Full Access</span>
              </div>
            </div>

            {/* Logout Button */}
            <Link
              href="/api/auth/logout"
              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
              title="Keluar dari Admin Console"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Keluar</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gold-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Info Notification Bar when clicked */}
      {activeInfoNotice && (
        <div className="bg-gold-500 text-slate-950 text-xs font-bold px-4 py-2 flex items-center justify-between border-t border-gold-400 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Info className="w-4 h-4 text-slate-950 shrink-0" />
            <span>{activeInfoNotice}</span>
          </div>
          <button onClick={() => setActiveInfoNotice(null)} className="text-slate-950 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-2 ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
        }`}>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavClick(item.label, item.info);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-gold-500 text-slate-950'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-gold-500" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
