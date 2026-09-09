import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { Users, ArrowLeft, ShieldCheck, User } from 'lucide-react';

export const revalidate = 0;

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: { invitations: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link href="/admin" className="text-xs text-gold-400 flex items-center gap-1 hover:underline mb-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white font-playfair flex items-center gap-2">
              <Users className="w-7 h-7 text-emerald-400" />
              User & Account Management
            </h1>
            <p className="text-xs text-slate-400">Daftar pengguna terdaftar dan hak akses di platform Weddora.</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Nama Pengguna</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role Akses</th>
                  <th className="px-6 py-4">Jumlah Undangan</th>
                  <th className="px-6 py-4">Tanggal Terdaftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-white text-sm">{u.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">{u.email}</td>
                    <td className="px-6 py-4">
                      {u.role === 'ADMIN' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center gap-1 w-max text-[10px]">
                          <ShieldCheck className="w-3 h-3" /> ADMIN
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium flex items-center gap-1 w-max text-[10px]">
                          <User className="w-3 h-3" /> USER
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gold-400">{u.invitations.length} Undangan</td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {new Date(u.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
