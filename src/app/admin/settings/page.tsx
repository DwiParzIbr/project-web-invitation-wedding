'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { Settings, ArrowLeft, Save, CheckCircle, Sliders, Shield, CreditCard, MessageSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminSettingsPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [siteName, setSiteName] = useState('Weddora Wedding Platform');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiModelDefault, setAiModelDefault] = useState('Weddora Smart Designer Engine');
  const [supportWhatsapp, setSupportWhatsapp] = useState('6282278765076');
  const [qrisMerchantName, setQrisMerchantName] = useState('WEDDORA DIGITAL INVITATION');
  const [midtransClientKey, setMidtransClientKey] = useState('SB-Mid-client-XXXXXX');
  const [midtransServerKey, setMidtransServerKey] = useState('SB-Mid-server-XXXXXX');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string>('ADMIN');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.role) setCurrentUserRole(data.user.role);
      })
      .catch(() => {});

    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.siteName) setSiteName(data.siteName);
          if (typeof data.maintenanceMode === 'boolean') setMaintenanceMode(data.maintenanceMode);
          if (data.aiModelDefault) setAiModelDefault(data.aiModelDefault);
          if (data.supportWhatsapp) setSupportWhatsapp(data.supportWhatsapp);
          if (data.qrisMerchantName) setQrisMerchantName(data.qrisMerchantName);
          if (data.midtransClientKey) setMidtransClientKey(data.midtransClientKey);
          if (data.midtransServerKey) setMidtransServerKey(data.midtransServerKey);
        }
      })
      .catch((err) => console.error('Failed to load settings:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          maintenanceMode,
          aiModelDefault,
          supportWhatsapp,
          qrisMerchantName,
          midtransClientKey,
          midtransServerKey,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <ScrollReveal direction="down" duration={600}>
          <div className="space-y-1">
            <Link href="/admin" className="text-xs text-gold-500 flex items-center gap-1 hover:underline mb-2 font-bold">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Dashboard
            </Link>
            <h1 className={`text-3xl font-bold font-playfair flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Settings className="w-7 h-7 text-purple-400" />
              Platform Settings & Configuration
            </h1>
            <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Pengaturan global sistem, asisten tata letak dan desain, gerbang pembayaran Midtrans/QRIS, dan layanan bantuan WhatsApp.
            </p>
          </div>
        </ScrollReveal>

        {currentUserRole === 'OPERATOR' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-3">
            <Shield className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold block">Akses Terbatas: Operator Read-Only</span>
              <span>Anda login sebagai Staf Operator. Konfigurasi payment gateway, API keys, dan parameter sistem hanya dapat diubah oleh Super Admin.</span>
            </div>
          </div>
        )}

        <ScrollReveal direction="up" delay={200} duration={800}>
          <form onSubmit={handleSaveSettings} className={`rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl text-xs ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">Memuat konfigurasi platform dari server...</div>
          ) : (
            <>
              {/* General Platform Settings */}
              <div className="space-y-4">
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
                  isLight ? 'text-slate-900 border-slate-200' : 'text-white border-slate-800'
                }`}>
                  <Sliders className="w-4 h-4 text-gold-400" /> 1. Pengaturan Umum Platform
                </h2>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Brand Platform</label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-gold-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div>
                    <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>Mode Maintenance Sistem</span>
                    <span className="text-[11px] text-slate-400">Aktifkan untuk membatasi akses publik sementara waktu.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-4 py-1.5 rounded-full font-bold transition-colors ${
                      maintenanceMode
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {maintenanceMode ? 'Aktif (Maintenance)' : 'Non-Aktif (Normal)'}
                  </button>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Smart Design Engine</label>
                  <input
                    type="text"
                    value={aiModelDefault}
                    onChange={(e) => setAiModelDefault(e.target.value)}
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-gold-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>

              {/* Payment Gateway & Support Settings */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-3 ${
                  isLight ? 'text-slate-900 border-slate-200' : 'text-white border-slate-800'
                }`}>
                  <CreditCard className="w-4 h-4 text-emerald-400" /> 2. Integrasi Pembayaran & Bantuan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nomor WhatsApp Support (Format: 628...)</label>
                    <input
                      type="text"
                      value={supportWhatsapp}
                      onChange={(e) => setSupportWhatsapp(e.target.value)}
                      className={`w-full border rounded-xl p-3 font-mono focus:outline-none focus:border-gold-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Merchant QRIS Standard</label>
                    <input
                      type="text"
                      value={qrisMerchantName}
                      onChange={(e) => setQrisMerchantName(e.target.value)}
                      className={`w-full border rounded-xl p-3 focus:outline-none focus:border-gold-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Midtrans Client Key</label>
                    <input
                      type="text"
                      value={midtransClientKey}
                      onChange={(e) => setMidtransClientKey(e.target.value)}
                      className={`w-full border rounded-xl p-3 font-mono text-[11px] focus:outline-none focus:border-gold-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Midtrans Server Key</label>
                    <input
                      type="password"
                      value={midtransServerKey}
                      onChange={(e) => setMidtransServerKey(e.target.value)}
                      className={`w-full border rounded-xl p-3 font-mono text-[11px] focus:outline-none focus:border-gold-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {savedSuccess ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> ✓ Pengaturan platform berhasil disimpan secara permanen!
                  </span>
                ) : (
                  <span className="text-slate-500">Perubahan konfigurasi akan langsung aktif pada seluruh sistem.</span>
                )}

                <button
                  type="submit"
                  disabled={isSaving || currentUserRole === 'OPERATOR'}
                  className={`px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all ${
                    currentUserRole === 'OPERATOR'
                      ? 'bg-slate-400 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-purple-500/20'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{currentUserRole === 'OPERATOR' ? 'Akses Terbatas (Read-Only)' : isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Platform'}</span>
                </button>
              </div>
            </>
          )}
        </form>
        </ScrollReveal>
      </main>

      <AdminFooter />
    </div>
  );
}
