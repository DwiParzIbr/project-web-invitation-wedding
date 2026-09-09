'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Mail, Phone, Crown, Lock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const Footer = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <footer className={`border-t py-12 transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-gold-500" />
            <span className={`font-playfair font-bold text-lg ${isLight ? 'text-slate-900' : 'text-white'}`}>Weddora AI VIP</span>
          </div>
          <p className="leading-relaxed">
            Platform pembuat website undangan pernikahan digital mewah & berkelas.
          </p>
          <div className="pt-2 flex items-center gap-2 text-[10px] text-emerald-500 font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL 256-Bit Encrypted Security</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>Navigasi Cepat</h4>
          <ul className="space-y-1.5">
            <li><Link href="/#templates" className="hover:text-gold-500">Template Marketplace</Link></li>
            <li><Link href="/#pricing" className="hover:text-gold-500">Harga & Paket</Link></li>
            <li><Link href="/login" className="hover:text-gold-500">Masuk Akun Client</Link></li>
            <li><Link href="/register" className="hover:text-gold-500">Daftar Paket Baru</Link></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>Fasilitas Utama</h4>
          <ul className="space-y-1.5">
            <li><span>Upload Musik MP3 Kustom</span></li>
            <li><span>AI Copywriting & Color Generator</span></li>
            <li><span>Barcode QRIS & Rekening Kado</span></li>
            <li><span>Form RSVP & Rekap Tamu</span></li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className={`font-bold text-xs uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>VIP Priority Support 24/7</h4>
          <p className="leading-relaxed">Tim customer support Weddora VIP siap membantu proses pembuatan undangan hari bahagiamu.</p>
          <div className="flex items-center gap-1.5 text-gold-500 font-bold">
            <Mail className="w-3.5 h-3.5" /> support@weddora.com
          </div>
        </div>
      </div>

      <div className={`mt-8 pt-6 border-t text-center text-[11px] ${
        isLight ? 'border-slate-200 text-slate-500' : 'border-slate-900 text-slate-500'
      }`}>
        <p>© 2026 Weddora AI VIP. All rights reserved. Crafted with ❤️ for your special day.</p>
      </div>
    </footer>
  );
};
