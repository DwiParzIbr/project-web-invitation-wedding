'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowLeft,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Users,
  Plus,
  Trash2,
  Send,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  Download,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { getAppBaseUrl } from '@/utils/domain';
import { downloadGuestTemplateCSV } from '@/utils/exportUtils';

interface GuestEntry {
  id: string;
  name: string;
  phone: string;
  status: 'BELUM_DIKIRIM' | 'TERKIRIM';
}

function ShareWaContent() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const searchParams = useSearchParams();
  const slugFromParam = searchParams.get('slug');
  
  // Extract groom first name for URL structure (e.g. weddora.com/andi?to=Nama+Tamu)
  const groomFullName = 'Andi Pratama';
  const getGroomFirstName = (fullName: string): string => {
    const clean = fullName.replace(/(H\.|Hj\.|Dr\.|Drs\.|Ir\.|S\.Kom|S\.Pd|M\.Kom|S\.T\.|M\.T\.|S\.E\.|M\.M\.)/gi, '').trim();
    const firstWord = clean.split(/\s+/)[0] || 'andi';
    return firstWord.toLowerCase().replace(/[^a-z0-9]+/g, '');
  };

  const groomPath = slugFromParam || getGroomFirstName(groomFullName);

  const [baseUrl, setBaseUrl] = useState(getAppBaseUrl());

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // Initial Guest List
  const [guests, setGuests] = useState<GuestEntry[]>([
    { id: '1', name: 'Bapak H. Rahmad & Keluarga', phone: '081234567890', status: 'BELUM_DIKIRIM' },
    { id: '2', name: 'Dr. Andi Pratama & Istri', phone: '081987654321', status: 'BELUM_DIKIRIM' },
    { id: '3', name: 'Keluarga Besar Alm. H. Ahmad', phone: '', status: 'BELUM_DIKIRIM' },
    { id: '4', name: 'Sahabat SMA / Rian & Partner', phone: '085211223344', status: 'BELUM_DIKIRIM' },
  ]);

  const [inputSingleName, setInputSingleName] = useState('');
  const [inputSinglePhone, setInputSinglePhone] = useState('');

  const [inputBulkText, setInputBulkText] = useState('');
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  const [styleTheme, setStyleTheme] = useState<'islami' | 'formal' | 'casual'>('islami');
  const [customTemplate, setCustomTemplate] = useState('');
  const [activeGuestId, setActiveGuestId] = useState<string>('1');

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);

  // Helper line parser for Excel / CSV file or text paste
  const parseLineToGuest = (line: string, idx: number): GuestEntry | null => {
    const cleanLine = line.trim().replace(/^"|"$/g, '');
    if (!cleanLine) return null;

    // Skip header row if it contains 'nama' or 'name'
    const lower = cleanLine.toLowerCase();
    if (idx === 0 && (lower.includes('nama') || lower.includes('name'))) {
      return null;
    }

    const parts = cleanLine.split(/[,;\t]/).map((p) => p.trim().replace(/^"|"$/g, ''));
    const name = parts[0];
    if (!name) return null;

    let phone = parts[1] || parts[2] || '';
    // If phone number has no country code, format cleanly
    phone = phone.replace(/[^0-9]/g, '');

    return {
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      phone,
      status: 'BELUM_DIKIRIM',
    };
  };

  // Upload Excel / CSV file handler
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split(/\r?\n/);
      const newItems: GuestEntry[] = [];

      lines.forEach((line, idx) => {
        const item = parseLineToGuest(line, idx);
        if (item) newItems.push(item);
      });

      if (newItems.length > 0) {
        setGuests((prev) => [...prev, ...newItems]);
        setActiveGuestId(newItems[0].id);
        setImportSuccessMsg(`✓ Berhasil mengimpor ${newItems.length} tamu dari file Excel!`);
        setTimeout(() => setImportSuccessMsg(''), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Import bulk text paste handler
  const handleImportBulk = () => {
    if (!inputBulkText.trim()) return;
    const lines = inputBulkText.split('\n');
    const newItems: GuestEntry[] = [];

    lines.forEach((line, idx) => {
      const item = parseLineToGuest(line, idx);
      if (item) newItems.push(item);
    });

    if (newItems.length > 0) {
      setGuests([...guests, ...newItems]);
      setActiveGuestId(newItems[0].id);
      setInputBulkText('');
      setImportSuccessMsg(`✓ Berhasil mengimpor ${newItems.length} tamu dari teks!`);
      setTimeout(() => setImportSuccessMsg(''), 4000);
    }
  };

  // Preset Template Messages with {nama_tamu}
  const getPresetTemplate = (style: 'islami' | 'formal' | 'casual') => {
    switch (style) {
      case 'islami':
        return `Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nKepada Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami ({pria} & {wanita}).\n\nInformasi lengkap mengenai tanggal, waktu, dan lokasi acara dapat diakses melalui link undangan berikut:\n{link_undangan}\n\nMerupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh.`;
      case 'formal':
        return `Dengan memohon rahmat Tuhan Yang Maha Esa, kami mengundang Yth. Bapak/Ibu/Saudara/i *{nama_tamu}*\n\nUntuk hadir dalam acara pernikahan {pria} & {wanita}.\n\nDetail acara dan konfirmasi RSVP dapat diakses pada tautan berikut:\n{link_undangan}\n\nTerima kasih atas perhatian dan doa restunya.`;
      case 'casual':
        return `Halo *{nama_tamu}* ✨\n\nKabar bahagia! Kami mengundang kamu untuk hadir dan menjadi bagian dari hari bahagia pernikahan {pria} & {wanita}.\n\nBuka undangan digital kami di sini ya:\n{link_undangan}\n\nSampai jumpa di hari H! 🎉`;
    }
  };

  const currentTemplate = customTemplate || getPresetTemplate(styleTheme);

  // Active guest selection
  const activeGuest = guests.find((g) => g.id === activeGuestId) || guests[0] || {
    id: 'demo',
    name: 'Bapak H. Rahmad & Keluarga',
    phone: '',
    status: 'BELUM_DIKIRIM',
  };

  // Generate Personalized URL: webdora.com/nama-depan-pengantin?to=Nama+Tamu
  const getGuestLink = (guestName: string) => {
    return `${baseUrl}/${groomPath}?to=${encodeURIComponent(guestName)}`;
  };

  // Generate Personalized WhatsApp Message Text
  const getPersonalizedMessage = (guestName: string) => {
    const link = getGuestLink(guestName);
    return currentTemplate
      .replace(/{nama_tamu}/g, guestName)
      .replace(/{link_undangan}/g, link)
      .replace(/{pria}/g, 'Andi')
      .replace(/{wanita}/g, 'Sinta')
      .replace(/{tanggal}/g, '12 Desember 2026');
  };

  // Generate Direct WhatsApp Send Link (wa.me)
  const getWaShareUrl = (guest: GuestEntry) => {
    const text = getPersonalizedMessage(guest.name);
    let cleanPhone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    if (cleanPhone) {
      return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    }
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  // Add single guest
  const handleAddSingleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSingleName.trim()) return;
    const newGuest: GuestEntry = {
      id: Date.now().toString(),
      name: inputSingleName.trim(),
      phone: inputSinglePhone.trim(),
      status: 'BELUM_DIKIRIM',
    };
    setGuests([...guests, newGuest]);
    setActiveGuestId(newGuest.id);
    setInputSingleName('');
    setInputSinglePhone('');
  };

  // Delete guest
  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  // Mark status as sent
  const handleMarkSent = (id: string) => {
    setGuests(
      guests.map((g) => (g.id === id ? { ...g, status: 'TERKIRIM' } : g))
    );
  };

  // Copy single guest link
  const handleCopyLink = (name: string) => {
    navigator.clipboard.writeText(getGuestLink(name));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Copy single message
  const handleCopyMsg = (name: string) => {
    navigator.clipboard.writeText(getPersonalizedMessage(name));
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  // Copy all guest links in bulk
  const handleCopyAllLinks = () => {
    const allLinksText = guests
      .map((g, i) => `${i + 1}. ${g.name}\n${getGuestLink(g.name)}`)
      .join('\n\n');
    navigator.clipboard.writeText(allLinksText);
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const sentCount = guests.filter((g) => g.status === 'TERKIRIM').length;

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
              isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold font-playfair flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-emerald-500" />
            <span>Personalisasi Undangan & WhatsApp Broadcaster</span>
          </h1>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Generate link undangan khusus nama tamu secara masal & kirim broadcast WhatsApp sekali klik.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-extrabold border border-emerald-500/30 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> VIP Broadcaster Active
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Guest Management & Broadcaster Queue */}
        <div className="lg:col-span-7 space-y-6">
          {/* Guest Stats Counter */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Tamu</span>
              <p className={`text-2xl font-extrabold flex items-center justify-between ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>{guests.length}</span>
                <Users className="w-5 h-5 text-blue-500" />
              </p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sudah Terkirim</span>
              <p className={`text-2xl font-extrabold flex items-center justify-between ${isLight ? 'text-emerald-600' : 'text-emerald-400'}`}>
                <span>{sentCount}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </p>
            </div>
            <div className={`p-4 rounded-2xl border space-y-1 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-[11px] font-bold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Belum Terkirim</span>
              <p className={`text-2xl font-extrabold flex items-center justify-between ${isLight ? 'text-amber-600' : 'text-amber-400'}`}>
                <span>{guests.length - sentCount}</span>
                <Clock className="w-5 h-5 text-amber-500" />
              </p>
            </div>
          </div>

          {/* Form Add Guest */}
          <div className={`p-6 rounded-3xl border space-y-4 shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Tambah Data Tamu Undangan</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBulkOpen(!isBulkOpen)}
                className="text-xs font-bold text-emerald-500 hover:underline flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{isBulkOpen ? 'Mode Tunggal' : 'Upload / Import Excel Massal'}</span>
              </button>
            </div>

            {importSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {!isBulkOpen ? (
              /* MODE SINGLE ENTRY */
              <form onSubmit={handleAddSingleGuest} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  value={inputSingleName}
                  onChange={(e) => setInputSingleName(e.target.value)}
                  placeholder="Nama Tamu Undangan (misal: Bapak H. Budi & Istri)"
                  className={`flex-1 p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <input
                  type="text"
                  value={inputSinglePhone}
                  onChange={(e) => setInputSinglePhone(e.target.value)}
                  placeholder="No WA (opsional: 081234567890)"
                  className={`w-full sm:w-48 p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </form>
            ) : (
              /* MODE UPLOAD EXCEL / BULK TEXT */
              <div className="space-y-4">
                {/* Excel Download Template Bar (Strictly visible ONLY inside Upload Excel mode) */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-4 h-4 text-gold-400" />
                      <span>Template File Excel (.xlsx / .csv)</span>
                    </span>
                    <p className="text-[11px] text-slate-400">Unduh template file Excel untuk diisi data nama dan nomor WhatsApp tamu.</p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadGuestTemplateCSV}
                    className="px-3.5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shrink-0 transition-transform hover:scale-105"
                  >
                    <Download className="w-4 h-4 text-slate-950" />
                    <span>Unduh Template Excel</span>
                  </button>
                </div>

                {/* Upload Excel Dropzone */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-dashed border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400 block">📁 Upload File Excel (.xlsx / .csv / .txt)</span>
                    <span className="text-[11px] text-slate-400 block">Pilih file Excel dari laptop / ponsel Anda untuk di-import otomatis</span>
                  </div>
                  <input
                    type="file"
                    accept=".csv,.txt,.xlsx"
                    onChange={handleExcelFileUpload}
                    className="hidden"
                    id="excel-csv-upload"
                  />
                  <label
                    htmlFor="excel-csv-upload"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer flex items-center justify-center gap-2 shadow-md shrink-0 transition-transform hover:scale-105"
                  >
                    <Upload className="w-4 h-4 text-slate-950" />
                    <span>Upload File Excel</span>
                  </label>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-800"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-500 uppercase font-mono">atau paste teks masal di bawah</span>
                  <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <textarea
                  rows={4}
                  value={inputBulkText}
                  onChange={(e) => setInputBulkText(e.target.value)}
                  placeholder={`Paste daftar nama tamu di sini (satu nama per baris):\nBapak Dr. H. Ahmad, 08123456789\nIbu Sinta Dewi\nKeluarga Besar Alm. Budi, 08198765432`}
                  className={`w-full p-3 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleImportBulk}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Massal dari Teks</span>
                </button>
              </div>
            )}
          </div>

          {/* Guest Broadcaster Table */}
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-slate-200 bg-slate-50/60' : 'border-slate-800'}`}>
              <h3 className="font-bold text-xs flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-500" />
                <span className={isLight ? 'text-slate-900' : 'text-white'}>Daftar Tamu & Link Personalisasi ({guests.length})</span>
              </h3>
              <button
                onClick={handleCopyAllLinks}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] border flex items-center gap-1.5 transition-all ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {copiedAllLinks ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAllLinks ? 'Semua Link Tersalin!' : 'Salin Semua Link Tamu'}</span>
              </button>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-[420px] overflow-y-auto">
              {guests.map((g, idx) => {
                const isSelected = g.id === activeGuest.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setActiveGuestId(g.id)}
                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-emerald-50/90 border-l-4 border-emerald-500'
                          : 'bg-slate-800/80 border-l-4 border-emerald-500'
                        : isLight
                        ? 'hover:bg-slate-50'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>#{idx + 1}</span>
                        <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{g.name}</h4>
                        {g.status === 'TERKIRIM' ? (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                            isLight
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          }`}>
                            ✓ Terkirim
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isLight
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            Belum
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-mono truncate max-w-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {getGuestLink(g.name)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyLink(g.name);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        }`}
                        title="Salin Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={getWaShareUrl(g)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkSent(g.id);
                        }}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </a>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGuest(g.id);
                        }}
                        className={`p-2 rounded-xl border transition-all ${
                          isLight
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-200'
                            : 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/20'
                        }`}
                        title="Hapus Tamu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic WhatsApp Message Preview & Preset Styles */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border space-y-5 shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className="space-y-2">
              <label className={`block text-xs font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                Pilih Gaya Bahasa Teks WhatsApp
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'islami', label: 'Islami Syar’i' },
                  { id: 'formal', label: 'Formal' },
                  { id: 'casual', label: 'Santai / Teman' },
                ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => {
                      setStyleTheme(style.id as any);
                      setCustomTemplate('');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                      styleTheme === style.id && !customTemplate
                        ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md font-black'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Personalized WhatsApp Text Preview */}
            <div className="space-y-3">
              <div className={`flex items-center justify-between border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  <Sparkles className="w-4 h-4" /> Live Preview Teks WhatsApp
                </span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Tamu: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>{activeGuest.name}</strong>
                </span>
              </div>

              <pre className={`p-4 rounded-2xl border text-xs leading-relaxed font-sans whitespace-pre-wrap ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}>
                {getPersonalizedMessage(activeGuest.name)}
              </pre>
            </div>

            {/* Actions for active guest */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleCopyMsg(activeGuest.name)}
                  className={`py-3 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedMsg ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMsg ? 'Tersalin!' : 'Salin Teks Pesan'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyLink(activeGuest.name)}
                  className={`py-3 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'Tersalin!' : 'Salin Link Tamu'}</span>
                </button>
              </div>

              <a
                href={getWaShareUrl(activeGuest)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleMarkSent(activeGuest.id)}
                className="w-full py-3.5 px-4 rounded-2xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Kirim WhatsApp Sekarang ke ({activeGuest.name}) ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ShareWaPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <Navbar />
      <Suspense fallback={<div className="p-10 text-center text-xs text-slate-500">Memuat generator WhatsApp...</div>}>
        <ShareWaContent />
      </Suspense>
      <Footer />
    </div>
  );
}
