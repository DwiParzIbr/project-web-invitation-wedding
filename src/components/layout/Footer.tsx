'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Mail,
  Phone,
  Crown,
  Lock,
  Palette,
  User,
  Music,
  CreditCard,
  HeartHandshake,
  CheckCircle2,
  Image as ImageIcon,
  MapPin,
  Gift,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { SocialIconsRow } from '@/components/ui/SocialIcons';
import { formatWhatsappUrl, formatMailUrl } from '@/utils/social';

export const Footer = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [settings, setSettings] = useState({
    supportWhatsapp: '6282278765076',
    supportEmail: 'weddorawebsite@gmail.com',
    socialInstagram: 'https://instagram.com/weddora.id',
    socialTiktok: 'https://tiktok.com/@weddora.id',
  });

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSettings({
            supportWhatsapp: data.supportWhatsapp || '6282278765076',
            supportEmail: data.supportEmail || 'weddorawebsite@gmail.com',
            socialInstagram: data.socialInstagram || 'https://instagram.com/weddora.id',
            socialTiktok: data.socialTiktok || 'https://tiktok.com/@weddora.id',
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className={`border-t py-10 md:py-14 transition-colors duration-300 ${
      isLight ? 'bg-slate-50/60 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800/80 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MOBILE VIEW (< md) */}
        <div className="md:hidden space-y-6 text-center">
          {/* Brand Header */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
                <Crown className="w-4 h-4 text-gold-500" />
              </div>
              <span className={`font-playfair font-bold text-xl tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Weddora VIP
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Platform website undangan pernikahan digital mewah & berkelas untuk hari bahagia Anda.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                <Lock className="w-3 h-3" />
                <span>SSL 256-Bit Encrypted</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/25">
                <Crown className="w-3 h-3" />
                <span>VIP Quality</span>
              </span>
            </div>

            {/* Social Media & Contact Quick Channels */}
            <div className="pt-2 flex flex-col items-center">
              <SocialIconsRow
                instagram={settings.socialInstagram}
                tiktok={settings.socialTiktok}
                whatsapp={settings.supportWhatsapp}
                email={settings.supportEmail}
                isLight={isLight}
              />
            </div>
          </div>

          {/* Navigation Pill Card */}
          <div className={`p-4 rounded-2xl border text-xs text-left space-y-3 shadow-sm ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Navigasi Cepat
            </span>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/#templates"
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="truncate">Katalog Template</span>
              </Link>
              <Link
                href="/#pricing"
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="truncate">Harga & Paket</span>
              </Link>
              <Link
                href="/login"
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="truncate">Masuk Akun</span>
              </Link>
              <Link
                href="/demo/luxury-gold-marble"
                target="_blank"
                className={`p-2.5 rounded-xl border flex items-center gap-2 font-medium transition-colors ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="truncate">Demo Live</span>
              </Link>
            </div>
          </div>

          {/* Features Highlights Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 flex items-center gap-1">
              <Music className="w-3 h-3 text-gold-500" /> Musik MP3 Kustom
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-gold-500" /> Galeri Foto & Video
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold-500" /> Peta Google Maps
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 flex items-center gap-1">
              <Gift className="w-3 h-3 text-gold-500" /> Amplop Digital
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 flex items-center gap-1">
              <HeartHandshake className="w-3 h-3 text-gold-500" /> RSVP & Tamu
            </span>
          </div>

          {/* VIP Priority Support Box */}
          <div className={`p-4 rounded-2xl border space-y-2.5 ${
            isLight
              ? 'bg-gradient-to-b from-white to-amber-50/40 border-gold-200/70'
              : 'bg-gradient-to-b from-slate-900 to-slate-950 border-gold-500/20'
          }`}>
            <span className={`font-bold text-xs block ${isLight ? 'text-slate-900' : 'text-white'}`}>
              VIP Priority Customer Support 24/7
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
              Siap melayani aktivasi akun, konsultasi tema, dan asistensi teknis hari bahagia Anda.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <a
                href={formatWhatsappUrl(settings.supportWhatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Support</span>
              </a>
              <a
                href={formatMailUrl(settings.supportEmail)}
                className={`px-4 py-2 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all ${
                  isLight
                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-2 text-[11px] text-slate-400">
            <p>© 2026 Weddora VIP. All rights reserved.</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Exclusive Digital Wedding Platform • Crafted with ❤️</p>
          </div>
        </div>

        {/* DESKTOP VIEW (>= md) */}
        <div className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-10 text-xs">
          {/* Brand & SSL Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold-500 shrink-0" />
              <span className={`font-playfair font-bold text-lg tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Weddora VIP
              </span>
            </div>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
              Platform pembuat website undangan pernikahan digital mewah & berkelas.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
              <Lock className="w-3 h-3 shrink-0" />
              <span>SSL 256-Bit Encrypted Security</span>
            </div>

            {/* Social Media & Contact Quick Channels */}
            <div className="pt-2">
              <SocialIconsRow
                instagram={settings.socialInstagram}
                tiktok={settings.socialTiktok}
                whatsapp={settings.supportWhatsapp}
                email={settings.supportEmail}
                isLight={isLight}
              />
            </div>
          </div>

          {/* Navigasi Cepat */}
          <div className="space-y-2.5">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li><Link href="/#templates" className="hover:text-gold-500 transition-colors">Template Marketplace</Link></li>
              <li><Link href="/#pricing" className="hover:text-gold-500 transition-colors">Harga & Paket</Link></li>
              <li><Link href="/login" className="hover:text-gold-500 transition-colors">Masuk Akun Client</Link></li>
              <li><Link href="/demo" target="_blank" className="hover:text-gold-500 transition-colors">Demo Live Undangan</Link></li>
            </ul>
          </div>

          {/* Fasilitas Utama */}
          <div className="space-y-2.5">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Fasilitas Utama
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold-500" /> Upload Musik MP3 Kustom
              </li>
              <li className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold-500" /> Galeri Foto & Video Prewedding
              </li>
              <li className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold-500" /> Navigasi Peta Google Maps
              </li>
              <li className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold-500" /> Amplop Digital & Kirim Kado
              </li>
              <li className="hover:text-gold-500 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-gold-500" /> Form RSVP & Rekap Tamu
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-2.5">
            <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
              VIP Priority Support 24/7
            </h4>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
              Tim customer support Weddora VIP siap membantu proses aktivasi & pembuatan undangan hari bahagiamu.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <a
                href={formatWhatsappUrl(settings.supportWhatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 transition-all text-xs w-fit"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: +{settings.supportWhatsapp.replace(/[^0-9]/g, '')}</span>
              </a>
              <a
                href={formatMailUrl(settings.supportEmail)}
                className="inline-flex items-center gap-2 text-gold-600 dark:text-gold-400 font-bold bg-gold-500/10 hover:bg-gold-500/20 px-3.5 py-1.5 rounded-xl border border-gold-500/30 transition-all text-xs w-fit"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{settings.supportEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Desktop Copyright */}
        <div className={`hidden md:block mt-10 pt-6 border-t text-center text-[11px] ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'
        }`}>
          <p>© 2026 Weddora VIP. All rights reserved. Crafted with ❤️ for your special day.</p>
        </div>
      </div>
    </footer>
  );
};
