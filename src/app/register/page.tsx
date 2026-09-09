'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, UserPlus, Lock, Mail, User, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function RegisterPage() {
  const router = useRouter();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'FREE' | 'BASIC' | 'PREMIUM' | 'LUXURY'>('PREMIUM');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, package: selectedPackage }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Pendaftaran gagal. Periksa data Anda.');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className={`w-full max-w-lg border rounded-3xl p-8 shadow-2xl space-y-6 transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-500 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className={`text-2xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Daftar Akun Client Weddora
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Pilih paket terbaik untuk website undangan pernikahan Anda.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 text-center font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className={`block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Lengkap Pengantin / Client</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Andi & Sinta"
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Email Aktif</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-gold-500 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border rounded-xl py-2.5 pl-9 pr-10 focus:outline-none focus:border-gold-500 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Package Selector */}
            <div>
              <label className={`block mb-2 font-semibold uppercase text-[10px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Pilih Paket Yang Diinginkan:</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'PREMIUM', name: 'Perorangan Premium', price: 'Rp 89.000', quota: '1 Undangan (12 Bulan)' },
                  { id: 'LUXURY', name: 'Perorangan Luxury VIP', price: 'Rp 100.000', quota: '1 Undangan (Lifetime)' },
                  { id: 'VENDOR_10', name: 'Paket 10 Pcs Vendor', price: 'Rp 750.000', quota: 'WO/EO Starter (Rp 75rb/pcs)' },
                  { id: 'VENDOR_25', name: 'Paket 25 Pcs Vendor', price: 'Rp 1.500.000', quota: 'WO/EO Pro (Rp 60rb/pcs)' },
                  { id: 'VENDOR_50', name: 'Paket 50 Pcs Vendor', price: 'Rp 2.250.000', quota: 'Agency VIP (Rp 45rb/pcs)' },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id as any)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? 'bg-gold-500/10 border-gold-500 text-slate-900 dark:text-white ring-2 ring-gold-500/30'
                        : isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="truncate">{pkg.name}</span>
                      {selectedPackage === pkg.id && <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-gold-600 dark:text-gold-400 font-bold mt-0.5">{pkg.price}</div>
                    <span className="text-[10px] text-slate-500 block mt-1">{pkg.quota}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 font-bold text-xs text-white shadow-lg shadow-purple-500/25 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Mendaftarkan Client...' : 'Daftar Sekarang'}</span>
            </button>
          </form>

          <div className={`text-center text-xs pt-2 border-t ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}>
            <span>Sudah memiliki akun? </span>
            <Link href="/login" className="text-gold-500 font-bold hover:underline">
              Masuk di sini &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
