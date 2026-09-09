'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, LogIn, Lock, Mail, UserCheck, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setErrorMsg(data.error || 'Gagal masuk. Periksa email & password.');
        return;
      }

      if (data.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClientLogin = () => {
    setEmail('andi@example.com');
    setPassword('userpassword');
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@weddora.com');
    setPassword('adminpassword');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className={`w-full max-w-md border rounded-3xl p-8 shadow-2xl space-y-6 transition-colors duration-300 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/30 text-gold-500 mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className={`text-2xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Masuk Akun Weddora
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Masuk untuk mengelola website undangan pernikahan digital Anda.
            </p>
          </div>

          {/* Quick Demo Shortcuts */}
          <div className={`p-3 rounded-2xl border space-y-2 text-xs ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <span className={`font-bold uppercase block text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Akses Cepat Demo:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoClientLogin}
                className={`py-2 px-2.5 rounded-xl border font-semibold text-[11px] flex items-center justify-center gap-1.5 ${
                  isLight ? 'bg-white hover:bg-slate-100 text-gold-600 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-gold-400 border-slate-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" /> Masuk Demo Client
              </button>
              <button
                type="button"
                onClick={handleDemoAdminLogin}
                className={`py-2 px-2.5 rounded-xl border font-semibold text-[11px] flex items-center justify-center gap-1.5 ${
                  isLight ? 'bg-white hover:bg-slate-100 text-purple-600 border-slate-200' : 'bg-slate-900 hover:bg-slate-800 text-purple-400 border-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Masuk Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 text-center font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className={`block mb-1 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Email Client / Admin</label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-slate-950 font-bold text-xs shadow-lg hover:from-gold-200 hover:to-gold-400 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Memproses Masuk...' : 'Masuk Sekarang'}</span>
            </button>
          </form>

          <div className={`text-center text-xs pt-2 border-t ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}>
            <span>Belum memiliki akun client? </span>
            <Link href="/register" className="text-gold-500 font-bold hover:underline">
              Daftar Paket Sekarang &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
