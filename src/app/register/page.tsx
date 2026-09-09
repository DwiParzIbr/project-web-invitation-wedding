'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Crown, ShieldCheck, Phone, LogIn, ArrowRight, Lock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function RegisterNoticePage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className={`w-full max-w-lg border rounded-3xl p-8 shadow-2xl space-y-6 text-center transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {/* VIP Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-500 mx-auto flex items-center justify-center shadow-lg shadow-gold-500/10">
            <Crown className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gold-500/10 text-gold-600 dark:text-gold-400 border border-gold-500/25">
              <Lock className="w-3 h-3" />
              <span>Pendaftaran Eksklusif Terpusat</span>
            </div>
            <h1 className={`text-2xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Registrasi Dikelola Oleh Admin
            </h1>
            <p className={`text-xs leading-relaxed max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Untuk menjamin kualitas layanan, eksklusivitas domain, dan keamanan data pengantin, pembuatan akun baru dilakukan langsung oleh Super Admin & Tim Support Weddora VIP.
            </p>
          </div>

          {/* Benefits Card */}
          <div className={`p-4 rounded-2xl border text-xs text-left space-y-2 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Layanan VIP Yang Anda Dapatkan
            </span>
            <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Aktivasi akun instan & verifikasi paket aman</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Konsultasi tema, musik, dan desain undangan</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Bimbingan teknis penggunaan studio editor 24/7</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <a
              href="https://wa.me/6282278765076?text=Halo%20Admin%20Weddora%20VIP,%0A%0ASaya%20ingin%20mendaftar%20dan%20mengaktifkan%20akun%20undangan%20pernikahan%20digital%20eksklusif%20di%20Weddora.%0A%0AMohon%20panduan%20langkah%20aktivasi%20serta%20pilihan%20paket%20VIP%20yang%20tersedia.%20Terima%20kasih!%20%F0%9F%99%8F%F0%9F%92%8D%E2%9C%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4" />
              <span>Hubungi WhatsApp Admin untuk Aktivasi Akun</span>
            </a>

            <Link
              href="/login"
              className={`w-full py-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sudah Memiliki Akun? Masuk Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
