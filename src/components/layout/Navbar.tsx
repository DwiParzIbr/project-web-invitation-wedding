'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Menu, X, Heart, Palette, ChevronRight, User, LogIn, LogOut, Sun, Moon, ShieldCheck, Crown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getRandomDemoUrl } from '@/utils/demoUtils';

export const Navbar = () => {
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
  };

  const isLight = mode === 'light';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
      isLight ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-800 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Royal Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-300 p-0.5 shadow-lg shadow-gold-500/20 group-hover:scale-105 transition-transform overflow-hidden bg-white dark:bg-slate-950 flex items-center justify-center">
            <img src="/logo.png" alt="Weddora Logo" className="w-full h-full object-contain p-0.5 rounded-[10px]" />
          </div>
          <div className="flex flex-col">
            <span className={`font-playfair text-xl font-bold tracking-tight flex items-center gap-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Weddora <span className="text-gold-500 text-xs px-2 py-0.5 rounded-full bg-gold-400/10 border border-gold-400/30 font-sans font-medium">VIP</span>
            </span>
            <span className={`text-[10px] font-sans tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Website Invitation</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-8 text-sm font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          <Link href="/#templates" className="hover:text-gold-500 transition-colors flex items-center gap-1">
            <Palette className="w-4 h-4 text-gold-500" />
            Template Gallery
          </Link>

          {!user && (
            <>
              <Link href="/#pricing" className="hover:text-gold-500 transition-colors">
                Harga & Paket
              </Link>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  const targetUrl = getRandomDemoUrl();
                  window.open(targetUrl, '_blank');
                }}
                className="hover:text-gold-500 transition-colors text-amber-500 font-semibold flex items-center gap-1 cursor-pointer"
                title="Buka Demo Undangan Acak"
              >
                <Heart className="w-4 h-4 fill-amber-400/20" />
                <span>Demo Undangan</span>
              </a>
            </>
          )}

          {user && (
            <Link href="/dashboard" className="hover:text-gold-500 transition-colors flex items-center gap-1">
              <User className="w-4 h-4 text-gold-500" />
              Dashboard Client
            </Link>
          )}

          {(user?.role === 'ADMIN' || user?.role === 'OPERATOR') && (
            <Link href="/admin" className="hover:text-amber-500 transition-colors text-xs text-amber-500 font-bold bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> {user?.role === 'OPERATOR' ? 'Operator Panel' : 'Admin Panel'}
            </Link>
          )}
        </nav>

        {/* Desktop Controls (Theme Switcher + Auth) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-bold ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <>
                <Moon className="w-4 h-4 text-purple-600" />
                <span>Mode Gelap</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Mode Terang</span>
              </>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className={`font-bold text-xs block ${isLight ? 'text-slate-900' : 'text-white'}`}>{user.name}</span>
                <span className="text-[10px] text-gold-500 font-mono font-bold uppercase flex items-center gap-0.5 justify-end">
                  <Crown className="w-3 h-3 text-gold-500" />
                  <span>{user.role} VIP</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 rounded-xl border transition-colors ${
                  isLight ? 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 border-slate-300' : 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border-slate-700'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold rounded-xl text-slate-950 gold-metallic-bg hover:scale-105 shadow-md shadow-gold-500/20 transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk Akun</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg ${isLight ? 'bg-slate-100 text-purple-600' : 'bg-slate-800 text-amber-400'}`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-lg ${isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-3 text-xs font-semibold ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
        }`}>
          <Link
            href="/#templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 hover:text-gold-500"
          >
            Template Gallery
          </Link>

          {!user && (
            <>
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 hover:text-gold-500"
              >
                Harga & Paket
              </Link>
              <a
                href="/demo"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  const targetUrl = getRandomDemoUrl();
                  window.open(targetUrl, '_blank');
                }}
                className="block py-2 text-amber-500 cursor-pointer flex items-center gap-1.5"
              >
                <Heart className="w-4 h-4 fill-amber-400/20" />
                <span>Demo Undangan Live</span>
              </a>
            </>
          )}

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-gold-500"
              >
                Dashboard Client ({user.name})
              </Link>
              {(user.role === 'ADMIN' || user.role === 'OPERATOR') && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-purple-500"
                >
                  {user.role === 'OPERATOR' ? 'Operator Panel' : 'Admin Panel'}
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 text-center font-bold rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 block"
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <div className="pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 text-center font-bold rounded-xl bg-gold-500 text-slate-950 flex items-center justify-center gap-2 shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Akun</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
