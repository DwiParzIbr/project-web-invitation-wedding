'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminOrdersPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/admin/clients');
        if (res.ok) {
          const clients = await res.json();
          // Extract orders from clients
          const allOrders: any[] = [];
          clients.forEach((c: any) => {
            if (c.orders && Array.isArray(c.orders)) {
              allOrders.push(...c.orders);
            }
          });
          setOrders(allOrders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <ScrollReveal direction="down" duration={600}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link href="/admin" className="text-xs text-gold-500 flex items-center gap-1 hover:underline mb-2 font-bold">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Dashboard
              </Link>
              <h1 className={`text-3xl font-bold font-playfair flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <CreditCard className="w-7 h-7 text-amber-500" />
                Orders & Transaction Logs ({orders.length})
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Rekapitulasi riwayat transaksi pembelian paket undangan digital Weddora.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={200} duration={800}>
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              <thead className={`uppercase font-semibold text-[10px] tracking-wider border-b ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="px-6 py-4">ID Transaksi</th>
                  <th className="px-6 py-4">Pembeli</th>
                  <th className="px-6 py-4">Paket</th>
                  <th className="px-6 py-4">Nominal</th>
                  <th className="px-6 py-4">Metode</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Memuat daftar transaksi...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                      Belum ada transaksi pembelian paket tercatat.
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}>
                      <td className="px-6 py-4 font-mono text-slate-400">{o.id.slice(0, 8)}</td>
                      <td className={`px-6 py-4 font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{o.user?.name || 'Client'}</td>
                      <td className="px-6 py-4 font-bold text-gold-500">{o.invitation?.title || 'Paket Undangan'}</td>
                      <td className="px-6 py-4 font-bold text-emerald-500">Rp {o.amount ? o.amount.toLocaleString('id-ID') : '0'}</td>
                      <td className="px-6 py-4 font-mono">{o.paymentMethod || 'QRIS / Transfer'}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-500 font-semibold border border-emerald-500/30 text-[10px]">
                          PAID
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </ScrollReveal>
      </main>

      <AdminFooter />
    </div>
  );
}
