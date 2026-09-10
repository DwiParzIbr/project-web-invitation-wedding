'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import {
  Sparkles,
  LogIn,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Phone,
  Crown,
  ShieldCheck,
  Music,
  Star,
  CheckCircle2,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Email atau kata sandi tidak cocok. Silakan periksa kembali.');
        return;
      }

      const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const redirectUrl = searchParams.get('redirect');
      const safeRedirect = redirectUrl && redirectUrl.startsWith('/') ? redirectUrl : null;

      if (data.user?.role === 'ADMIN' || data.user?.role === 'OPERATOR') {
        router.push(safeRedirect || '/admin');
      } else {
        router.push(safeRedirect || '/dashboard');
      }
    } catch (err) {
      setErrorMsg('Terjadi kendala jaringan. Pastikan koneksi internet Anda stabil.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative overflow-hidden ${
      isLight ? 'bg-gradient-to-b from-amber-50/40 via-white to-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Background Luxury Ambient Glow Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-gold-500/10 dark:bg-gold-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-900/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 py-12 md:py-16">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Luxury Brand Showcase (Hidden on small screens, gorgeous on lg+) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-6">
            <ScrollReveal direction="left" duration={700}>
              <div className="space-y-4">
                {/* Crown VIP Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gold-500/15 text-gold-600 dark:text-gold-400 border border-gold-500/30">
                  <Crown className="w-4 h-4 text-gold-500" />
                  <span>Weddora VIP Portal</span>
                </div>

                <h1 className={`text-3xl xl:text-4xl font-extrabold font-playfair leading-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Pintu Masuk Menuju Hari Bahagia Anda
                </h1>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Kelola website undangan pernikahan digital mewah Anda dengan kendali penuh, tata letak estetis, galeri foto sinematik, dan rekapitulasi tamu yang akurat.
                </p>
              </div>

              {/* 3 VIP Feature Cards */}
              <div className="space-y-3 pt-4">
                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="p-2 rounded-xl bg-gold-500/15 text-gold-500 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Desain Royal & Tipografi Indah
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      Pilihan tema modern, klasik, adat nusantara, dan islami dengan sentuhan animasi elegan.
                    </p>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-500 shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Audio MP3 Kustom & Album HD
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      Iringan lagu cinta pilihan dan pemutar audio otomatis yang memanjakan tamu undangan.
                    </p>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                  isLight ? 'bg-white/80 border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
                }`}>
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Keamanan Data & Amplop Digital
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                      Proteksi SSL 256-Bit, konfirmasi RSVP real-time, dan transfer kado instan via QRIS.
                    </p>
                  </div>
                </div>
              </div>

              {/* Endorsement Card */}
              <div className="pt-2">
                <div className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                  isLight ? 'bg-amber-50/60 border-gold-200/60' : 'bg-slate-900/40 border-gold-500/20'
                }`}>
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    Dipercaya oleh 1.500+ pasangan pengantin di seluruh Indonesia.
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Luxury Login Form Card */}
          <div className="lg:col-span-7 flex justify-center">
            <ScrollReveal direction="up" duration={700}>
              <div className={`w-full max-w-md sm:max-w-lg border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-xl relative transition-all duration-300 ${
                isLight
                  ? 'bg-white/95 border-slate-200 shadow-xl shadow-slate-200/50'
                  : 'bg-slate-900/90 border-gold-500/30 shadow-2xl shadow-black/80'
              }`}>
                
                {/* Header Profile Title */}
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl gold-metallic-bg p-0.5 mx-auto shadow-lg shadow-gold-500/20 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-slate-950 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-gold-500" />
                    </div>
                  </div>

                  <div>
                    <h2 className={`text-2xl sm:text-3xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Masuk ke Akun Anda
                    </h2>
                    <p className={`text-xs mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      Masukkan email dan kata sandi akun Weddora Anda.
                    </p>
                  </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  {errorMsg && (
                    <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-center font-medium animate-shake text-xs flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label className={`block mb-1.5 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Alamat Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contoh: nama@email.com"
                        className={`w-full border rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 text-xs transition-all ${
                          isLight
                            ? 'bg-slate-50 hover:bg-white border-slate-300 text-slate-900 focus:bg-white'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-white focus:bg-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        Kata Sandi
                      </label>
                      <a
                        href="https://wa.me/6282278765076?text=Halo%20Admin%20Weddora%20VIP,%20saya%20membutuhkan%20bantuan%20untuk%20reset%20kata%20sandi%20akun%20saya.%20Mohon%20panduannya.%20Terima%20kasih!%20%F0%9F%99%8F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-gold-600 dark:text-gold-400 hover:underline font-medium"
                      >
                        Lupa sandi?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full border rounded-2xl py-3 pl-10 pr-11 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500 text-xs transition-all ${
                          isLight
                            ? 'bg-slate-50 hover:bg-white border-slate-300 text-slate-900 focus:bg-white'
                            : 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-white focus:bg-slate-900'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title={showPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-gold-500 focus:ring-gold-500"
                      />
                      <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Ingat saya di perangkat ini
                      </span>
                    </label>

                    <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>SSL Encrypted</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl gold-metallic-bg text-slate-950 font-extrabold text-xs shadow-xl shadow-gold-500/20 hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Memverifikasi Akun...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Masuk ke Dashboard</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                      </>
                    )}
                  </button>
                </form>

                {/* VIP Support & Registration Notice */}
                <div className={`p-4 rounded-2xl border text-center space-y-2 transition-colors ${
                  isLight
                    ? 'bg-gradient-to-b from-slate-50 to-amber-50/40 border-slate-200'
                    : 'bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800'
                }`}>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Belum memiliki akun? Pendaftaran akun baru ditangani secara eksklusif oleh tim Admin & CS.
                  </p>
                  <a
                    href="https://wa.me/6282278765076?text=Halo%20Admin%20Weddora%20VIP,%0A%0ASaya%20tertarik%20untuk%20mengaktifkan%20akun%20undangan%20pernikahan%20digital%20eksklusif.%20Mohon%20informasi%20langkah%20aktivasi%20dan%20pilihan%20paketnya.%0A%0ATerima%20kasih!%20%F0%9F%99%8F%F0%9F%92%8D%E2%9C%A8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Hubungi WhatsApp Admin untuk Aktivasi</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
