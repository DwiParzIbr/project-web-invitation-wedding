'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Download,
  FileSpreadsheet,
  Printer,
  Gift,
  Search,
  Filter,
} from 'lucide-react';
import { exportRsvpsToCSV, exportGiftsToCSV, printPDFReport } from '@/utils/exportUtils';

interface RsvpItem {
  id: string;
  guestName: string;
  phone?: string | null;
  status: 'ATTENDING' | 'DECLINED' | 'MAYBE' | string;
  guestCount: number;
  message?: string | null;
  createdAt: string | Date;
}

interface RsvpsClientProps {
  invitationTitle: string;
  rsvps: RsvpItem[];
}

export function RsvpsClient({ invitationTitle, rsvps }: RsvpsClientProps) {
  const [activeTab, setActiveTab] = useState<'rsvp' | 'gifts'>('rsvp');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Sample Digital Gift Transfers
  const sampleGifts = [
    { id: 'g1', senderName: 'Bapak H. Rahmad & Keluarga', bankName: 'Bank BCA', amount: 500000, message: 'Selamat atas pernikahannya, semoga sakinah mawaddah warahmah.', date: '2026-12-10' },
    { id: 'g2', senderName: 'Dr. Andi Pratama & Istri', bankName: 'Bank Mandiri', amount: 1000000, message: 'Selamat Andi & Sinta! Doa terbaik dari kami sekeluarga.', date: '2026-12-11' },
    { id: 'g3', senderName: 'Keluarga Besar Alm. H. Ahmad', bankName: 'GoPay / E-Wallet', amount: 350000, message: 'Barakallahu lakuma wa baraka alaika.', date: '2026-12-11' },
    { id: 'g4', senderName: 'Sahabat SMA / Rian', bankName: 'Bank BCA', amount: 250000, message: 'Lancar-lancar bro Andi & Sinta! Sampai ketemu di resepsi.', date: '2026-12-12' },
  ];

  // Calculations
  const attendingCount = rsvps
    .filter((r) => r.status === 'ATTENDING')
    .reduce((acc, r) => acc + (r.guestCount || 1), 0);
  const declinedCount = rsvps.filter((r) => r.status === 'DECLINED').length;
  const maybeCount = rsvps.filter((r) => r.status === 'MAYBE').length;

  const totalGiftAmount = sampleGifts.reduce((acc, g) => acc + g.amount, 0);

  // Filtered RSVPs
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch = r.guestName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 print:hidden">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-xs text-gold-400 flex items-center gap-1 hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white font-playfair">Rekapitulasi Tamu & Amplop Digital</h1>
          <p className="text-xs text-slate-400">Undangan: <strong className="text-gold-300">{invitationTitle}</strong></p>
        </div>

        {/* EXPORT ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => exportRsvpsToCSV(rsvps, invitationTitle)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-950" />
            <span>Export Excel (.csv)</span>
          </button>

          <button
            onClick={() => printPDFReport()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Cetak / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Report Header for PDF */}
      <div className="hidden print:block space-y-2 border-b-2 border-slate-900 pb-4 text-black">
        <h1 className="text-2xl font-bold">LAPORAN REKAPITULASI RSVP TAMU & AMPLOP DIGITAL</h1>
        <p className="text-xs">Undangan: {invitationTitle} | Dicetak pada: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Counter Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400">Estimasi Tamu Hadir</span>
          <div className="text-2xl font-black text-emerald-400 flex items-center justify-between">
            <span>{attendingCount} Orang</span>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400">Tamu Absen / Tidak Hadir</span>
          <div className="text-2xl font-black text-rose-400 flex items-center justify-between">
            <span>{declinedCount} Orang</span>
            <XCircle className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400">Masih Ragu / Belum Pasti</span>
          <div className="text-2xl font-black text-amber-400 flex items-center justify-between">
            <span>{maybeCount} Orang</span>
            <HelpCircle className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 shadow-lg">
          <span className="text-[11px] font-bold text-slate-400">Total Amplop Digital</span>
          <div className="text-2xl font-black text-gold-400 flex items-center justify-between">
            <span>Rp {totalGiftAmount.toLocaleString('id-ID')}</span>
            <Gift className="w-6 h-6 text-gold-400" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs (RSVP vs Digital Gifts) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('rsvp')}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'rsvp'
                ? 'bg-gold-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Konfirmasi RSVP ({rsvps.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gifts')}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'gifts'
                ? 'bg-gold-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Amplop Digital / Transfer ({sampleGifts.length})</span>
          </button>
        </div>

        {activeTab === 'rsvp' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama tamu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-gold-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-gold-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="ATTENDING">Hadir</option>
              <option value="DECLINED">Absen</option>
              <option value="MAYBE">Masih Ragu</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: RSVP Table */}
      {activeTab === 'rsvp' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl print:bg-white print:border-black print:text-black">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800 print:bg-slate-200 print:text-black">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Nama Tamu</th>
                  <th className="px-6 py-4">Status Kehadiran</th>
                  <th className="px-6 py-4">Jumlah Tamu</th>
                  <th className="px-6 py-4">Pesan / Ucapan Doa</th>
                  <th className="px-6 py-4">Waktu Konfirmasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                {filteredRsvps.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-white print:text-black">{item.guestName}</td>
                    <td className="px-6 py-4">
                      {item.status === 'ATTENDING' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 print:bg-emerald-100 print:text-emerald-800">
                          ✓ Hadir
                        </span>
                      )}
                      {item.status === 'DECLINED' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30 print:bg-rose-100 print:text-rose-800">
                          × Absen
                        </span>
                      )}
                      {item.status === 'MAYBE' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 print:bg-amber-100 print:text-amber-800">
                          ? Masih Ragu
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-300 print:text-black">{item.guestCount} Orang</td>
                    <td className="px-6 py-4 max-w-xs italic text-slate-400 print:text-black">"{item.message || '-'}"</td>
                    <td className="px-6 py-4 text-slate-500 font-mono print:text-black">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Digital Gifts Table */}
      {activeTab === 'gifts' && (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl print:bg-white print:border-black print:text-black">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between print:hidden">
            <h3 className="font-bold text-xs text-gold-400">Rekapitulasi Amplop Cash Gift</h3>
            <button
              onClick={() => exportGiftsToCSV(sampleGifts, invitationTitle)}
              className="px-3 py-1.5 rounded-xl bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-slate-950 font-bold text-xs border border-gold-500/30 flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export Amplop CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800 print:bg-slate-200 print:text-black">
                <tr>
                  <th className="px-6 py-4">No</th>
                  <th className="px-6 py-4">Nama Pengirim</th>
                  <th className="px-6 py-4">Metode Transfer</th>
                  <th className="px-6 py-4">Nominal Hadiah</th>
                  <th className="px-6 py-4">Pesan & Doa Ucapan</th>
                  <th className="px-6 py-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                {sampleGifts.map((g, idx) => (
                  <tr key={g.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-white print:text-black">{g.senderName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30 print:bg-blue-100 print:text-blue-800">
                        {g.bankName}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-gold-400 font-mono print:text-black">
                      Rp {g.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 max-w-xs italic text-slate-400 print:text-black">"{g.message}"</td>
                    <td className="px-6 py-4 text-slate-500 font-mono print:text-black">{g.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
