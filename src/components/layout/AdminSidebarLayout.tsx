'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface AdminSidebarLayoutProps {
  children: React.ReactNode;
}

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const pathname = usePathname();
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('admin_sidebar_collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    } catch (_) {}
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('admin_sidebar_collapsed', String(next));
      } catch (_) {}
      return next;
    });
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user);
      })
      .catch(() => {});
  }, []);

  const isOperator = currentUser?.role === 'OPERATOR';

  // Grouped Sidebar Navigation Items
  const navSections = [
    {
      title: 'MENU UTAMA',
      items: [
        {
          label: 'Overview',
          href: '/admin',
          icon: LayoutDashboard,
          badge: null,
          color: 'text-gold-500',
        },
      ],
    },
    {
      title: 'MANAJEMEN KONTEN',
      items: [
        {
          label: 'Client Management',
          href: '/admin/clients',
          icon: Users,
          badge: null,
          color: 'text-emerald-500',
        },
        {
          label: 'Template Studio',
          href: '/admin/templates',
          icon: Palette,
          badge: null,
          color: 'text-amber-500',
        },
        {
          label: 'Kategori Tema',
          href: '/admin/categories',
          icon: Layers,
          badge: null,
          color: 'text-blue-500',
        },
        {
          label: 'Musik Library MP3',
          href: '/admin/music',
          icon: Music,
          badge: null,
          color: 'text-pink-500',
        },
      ],
    },
    {
      title: 'TRANSAKSI & SISTEM',
      items: [
        {
          label: 'Orders & Revenue',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: null,
          color: 'text-teal-500',
        },
        {
          label: 'Platform Settings',
          href: '/admin/settings',
          icon: Settings,
          badge: null,
          color: 'text-slate-400',
        },
        {
          label: 'Hak Akses & Role',
          href: '/admin/permissions',
          icon: ShieldCheck,
          badge: 'Baru',
          color: 'text-purple-500',
        },
      ],
    },
  ];

  const renderNavLinks = (closeMobile = false, isIconOnly = false) => (
    <div className={isIconOnly ? 'space-y-4' : 'space-y-6'}>
      {navSections.map((section, sIdx) => (
        <div key={sIdx} className="space-y-1.5">
          {!isIconOnly ? (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 block">
              {section.title}
            </span>
          ) : sIdx > 0 ? (
            <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/80 mx-1" />
          ) : null}
          <div className={isIconOnly ? 'space-y-2' : 'space-y-1'}>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (isIconOnly) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    className={`flex items-center justify-center w-11 h-11 mx-auto rounded-2xl transition-all relative shrink-0 ${
                      isActive
                        ? 'bg-gold-500 text-slate-950 shadow-md font-extrabold scale-105'
                        : isLight
                        ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-slate-950' : item.color}`} />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (closeMobile) setIsMobileSidebarOpen(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gold-500 text-slate-950 shadow-md font-extrabold scale-[1.02]'
                      : isLight
                      ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      isActive
                        ? 'bg-slate-950 text-gold-400'
                        : 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* DESKTOP FIXED LEFT SIDEBAR (Collapsible to icon-only) */}
      <aside className={`hidden md:flex flex-col h-screen sticky top-0 shrink-0 border-r z-30 transition-all duration-300 ease-in-out overflow-x-hidden select-none ${
        isCollapsed ? 'w-20' : 'w-64 lg:w-72'
      } ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-slate-950 border-gold-500/20 shadow-2xl'
      }`}>
        {/* Brand Header */}
        <div className={`border-b border-slate-200 dark:border-slate-800 flex items-center transition-all ${
          isCollapsed ? 'flex-col justify-center gap-3 p-4' : 'justify-between p-5'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl gold-metallic-bg p-0.5 shadow-lg shadow-gold-500/20 flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950 shrink-0">
              <img src="/logo.png" alt="Weddora Logo" className="w-full h-full object-contain p-0.5 rounded-[12px]" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`font-extrabold text-lg font-playfair tracking-tight truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    WEDDORA
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/40 text-[8px] font-black uppercase tracking-wider">
                    VIP
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {isOperator ? 'Operator Console' : 'Super Admin Console'}
                </p>
              </div>
            )}
          </div>

          {/* Toggle Minimize/Expand Button */}
          <button
            onClick={toggleCollapse}
            className={`p-1.5 rounded-xl border transition-all ${
              isLight
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
            title={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar (Hanya Ikon)'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-gold-500" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${isCollapsed ? 'px-2 py-4' : 'p-4'}`}>
          {renderNavLinks(false, isCollapsed)}
        </div>

        {/* Bottom Sidebar Action Footer */}
        <div className={`p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 ${
          isCollapsed ? 'flex flex-col items-center' : ''
        }`}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`transition-all ${
              isCollapsed
                ? 'w-11 h-11 rounded-2xl border flex items-center justify-center ' +
                  (isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800')
                : 'w-full py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-between ' +
                  (isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800')
            }`}
            title={isLight ? 'Mode Gelap' : 'Mode Terang'}
          >
            {isCollapsed ? (
              isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-gold-400" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {isLight ? <Moon className="w-4 h-4 text-purple-600" /> : <Sun className="w-4 h-4 text-gold-400" />}
                  <span>{isLight ? 'Mode Gelap' : 'Mode Terang'}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Theme</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <Link
            href="/api/auth/logout"
            className={`transition-all shadow-sm ${
              isCollapsed
                ? 'w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center'
                : 'w-full py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center justify-center gap-2'
            }`}
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Keluar Akun</span>}
          </Link>
        </div>
      </aside>

      {/* MOBILE SLIM HEADER (< md) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b backdrop-blur-md z-40 px-4 flex items-center justify-between bg-white/95 dark:bg-slate-950/95 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`p-2 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
            }`}
            title="Buka Sidebar"
          >
            <Menu className="w-5 h-5 text-gold-500" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold font-playfair text-base">WEDDORA</span>
            <span className="px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-500 text-[8px] font-black uppercase">
              ADMIN
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-300 text-purple-600' : 'bg-slate-900 border-slate-800 text-amber-400'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <Link
            href="/api/auth/logout"
            className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* MOBILE SIDEBAR DRAWER (< md) */}
      {isMobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className={`relative w-72 max-w-[80vw] h-full flex flex-col z-10 border-r shadow-2xl animate-slideRight ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
          }`}>
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gold-metallic-bg p-0.5 flex items-center justify-center">
                  <img src="/logo.png" alt="Weddora Logo" className="w-full h-full object-contain p-0.5 rounded-[10px]" />
                </div>
                <span className="font-extrabold text-base font-playfair">WEDDORA VIP</span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4">
              {renderNavLinks(true)}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <Link
                href="/api/auth/logout"
                className="w-full py-2.5 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 font-bold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
