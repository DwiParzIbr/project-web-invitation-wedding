'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import {
  ShieldCheck,
  Crown,
  Wrench,
  User,
  Sparkles,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  Lock,
  Edit2,
  Trash2,
  X,
  ArrowLeft,
  Info,
  KeyRound,
  Users,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminPermissionsPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [currentUserRole, setCurrentUserRole] = useState<string>('ADMIN');
  const [users, setUsers] = useState<any[]>([]);
  const [counts, setCounts] = useState({ ADMIN: 0, OPERATOR: 0, USER: 0, DEMO: 0, TOTAL: 0 });
  const [matrix, setMatrix] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Toast Notice
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Add User Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'OPERATOR' | 'USER' | 'DEMO'>('USER');
  const [newUserPackage, setNewUserPackage] = useState('PREMIUM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete User Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/permissions');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setCounts(data.counts || { ADMIN: 0, OPERATOR: 0, USER: 0, DEMO: 0, TOTAL: 0 });
        setMatrix(data.matrix || []);
        if (data.currentUserRole) setCurrentUserRole(data.currentUserRole);
      }
    } catch (err) {
      console.error('Error loading permissions data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, targetRole: string) => {
    if (currentUserRole === 'OPERATOR') {
      showToast('Akses ditolak: Hanya Super Admin yang berwenang mengubah wewenang pengguna.');
      return;
    }

    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: targetRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Gagal memperbarui peran.');
        return;
      }

      showToast(`Peran pengguna berhasil diubah menjadi ${targetRole}!`);
      loadData();
    } catch (err) {
      showToast('Terjadi kesalahan jaringan.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUserRole === 'OPERATOR') {
      setModalError('Hanya Super Admin yang dapat menambahkan pengguna baru.');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      const res = await fetch('/api/admin/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          package: newUserPackage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || 'Gagal menambahkan pengguna baru.');
        return;
      }

      showToast(`Pengguna ${newUserName} (${newUserRole}) berhasil didaftarkan!`);
      setIsAddModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('password123');
      setNewUserRole('USER');
      loadData();
    } catch (err) {
      setModalError('Terjadi kesalahan jaringan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/permissions?id=${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Gagal menghapus pengguna.');
        return;
      }
      showToast(`Pengguna ${deleteTarget.name} berhasil dihapus.`);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      showToast('Gagal menghapus pengguna.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      selectedRoleFilter === 'ALL' ||
      (selectedRoleFilter === 'USER' && (u.role === 'USER' || u.role === 'CLIENT')) ||
      u.role === selectedRoleFilter;

    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const isOperator = currentUserRole === 'OPERATOR';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      {/* Floating Notification Toast */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce bg-gold-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-gold-400">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>{toastNotice}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Header Breadcrumb & Title */}
        <ScrollReveal direction="down" duration={600}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
            isLight ? 'border-slate-300' : 'border-slate-800'
          }`}>
            <div className="space-y-1">
              <Link href="/admin" className="text-xs text-gold-500 flex items-center gap-1 hover:underline mb-1 w-fit">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Overview
              </Link>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold border border-purple-500/20">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Role-Based Access Control (RBAC)</span>
              </div>
              <h1 className={`text-3xl font-bold font-playfair ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Hak Akses & Manajemen Wewenang
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pemisahan wewenang mutlak antara Superadmin, Operator, Klien User, dan Akun Demo.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Operator Guard Notice if applicable */}
        {isOperator && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-3">
            <Lock className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-bold block">Mode Tinjauan Operator Aktif</span>
              <span>Anda login sebagai staf operator. Halaman ini ditampilkan dalam mode baca (Read-Only). Hanya Super Admin yang berwenang memodifikasi wewenang dan menambah pengguna baru.</span>
            </div>
          </div>
        )}

        {/* 4 Role Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Admin Card */}
          <div className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isLight ? 'bg-white border-purple-200 shadow-md' : 'bg-slate-900/80 border-purple-500/30 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 font-extrabold text-[10px] border border-purple-500/30 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 text-purple-500" />
                SUPER ADMIN
              </span>
              <span className="text-xl font-black text-purple-500 font-mono">{counts.ADMIN}</span>
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Wewenang Tertinggi</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Akses mutlak ke seluruh fitur sistem, Midtrans Gateway, pengaturan platform, penetapan hak akses, dan manajemen operator.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-purple-600 dark:text-purple-400 border-t border-purple-500/15">
              Email: admin@weddora.com
            </div>
          </div>

          {/* Operator Card */}
          <div className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isLight ? 'bg-white border-blue-200 shadow-md' : 'bg-slate-900/80 border-blue-500/30 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-300 font-extrabold text-[10px] border border-blue-500/30 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-blue-500" />
                OPERATOR
              </span>
              <span className="text-xl font-black text-blue-500 font-mono">{counts.OPERATOR}</span>
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Staf Operasional</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Membantu klien pernikahan, meninjau undangan, mengupload musik MP3, mengelola pesanan harian. Tidak dapat mengubah konfigurasi sistem.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-blue-600 dark:text-blue-400 border-t border-blue-500/15">
              Email: operator@weddora.com
            </div>
          </div>

          {/* User Client Card */}
          <div className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isLight ? 'bg-white border-emerald-200 shadow-md' : 'bg-slate-900/80 border-emerald-500/30 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-500" />
                USER KLIEN
              </span>
              <span className="text-xl font-black text-emerald-500 font-mono">{counts.USER}</span>
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Klien Pengantin</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Akses dashboard pribadi, studio editor undangan, manajemen buku tamu & RSVP, QRIS amplop kado, dan penyebaran link undangan.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 border-t border-emerald-500/15">
              Akun Resmi Aktif
            </div>
          </div>

          {/* Demo Account Card */}
          <div className={`p-5 rounded-3xl border space-y-3 transition-all ${
            isLight ? 'bg-white border-amber-200 shadow-md' : 'bg-slate-900/80 border-amber-500/30 shadow-xl'
          }`}>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold text-[10px] border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                AKUN DEMO
              </span>
              <span className="text-xl font-black text-amber-500 font-mono">{counts.DEMO}</span>
            </div>
            <div>
              <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Uji Coba & Simulasi</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Akun untuk calon klien dan presentasi. Menguji coba fitur editor undangan secara aman dengan tanda label "DEMO MODE".
              </p>
            </div>
            <div className="pt-2 text-[10px] font-mono text-amber-600 dark:text-amber-400 border-t border-amber-500/15">
              Email: demo@weddora.com
            </div>
          </div>
        </div>

        {/* Permissions Comparison Matrix */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
            <div>
              <h2 className={`font-bold text-lg flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <ShieldCheck className="w-5 h-5 text-gold-500" />
                Matriks Hak Akses & Perbandingan Fitur
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daftar perincian hak istimewa setiap peran dalam arsitektur sistem Weddora VIP.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase font-semibold text-[10px] tracking-wider border-b ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="px-5 py-3">Modul & Fitur Platform</th>
                  <th className="px-4 py-3 text-center">Super Admin</th>
                  <th className="px-4 py-3 text-center">Operator</th>
                  <th className="px-4 py-3 text-center">User Klien</th>
                  <th className="px-4 py-3 text-center">Akun Demo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-500/5 transition-colors">
                    <td className="px-5 py-3">
                      <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{row.module}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{row.description}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.ADMIN ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.OPERATOR ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.USER ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {row.DEMO ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-500" title="Simulasi Uji Coba">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/20 text-rose-500">
                          <XCircle className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Role Management Table */}
        <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <h2 className={`font-bold text-lg flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Users className="w-5 h-5 text-gold-500" />
                Daftar Pengguna & Penetapan Peran
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih peran untuk mengubah hak akses pengguna secara instan atau hapus akun pengguna yang tidak aktif.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-gold-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className={`p-1 rounded-xl border flex items-center gap-1 text-[11px] ${
                isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
              }`}>
                {(['ALL', 'ADMIN', 'OPERATOR', 'USER', 'DEMO'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      selectedRoleFilter === r
                        ? 'bg-gold-500 text-slate-950 shadow-sm'
                        : isLight
                        ? 'text-slate-700 hover:text-slate-900'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 'ALL' ? 'Semua' : r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase font-semibold text-[10px] tracking-wider border-b ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="px-5 py-3">Nama Pengguna</th>
                  <th className="px-5 py-3">Email Akun</th>
                  <th className="px-5 py-3">Peran Saat Ini</th>
                  <th className="px-5 py-3">Paket VIP</th>
                  <th className="px-5 py-3">Undangan</th>
                  <th className="px-5 py-3 text-right">Ubah Peran / Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Memuat daftar hak akses pengguna...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada pengguna yang cocok dengan pencarian / filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isRootAdmin = u.email === 'admin@weddora.com';
                    return (
                      <tr key={u.id} className="hover:bg-slate-500/5 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {u.name}
                          </div>
                          {isRootAdmin && (
                            <span className="text-[9px] text-amber-500 font-mono font-bold">★ Root Superadmin</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-500 dark:text-slate-400">
                          {u.email}
                        </td>
                        <td className="px-5 py-3.5">
                          {u.role === 'ADMIN' && (
                            <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 font-extrabold text-[10px] border border-purple-500/30 inline-flex items-center gap-1">
                              <Crown className="w-3 h-3 text-purple-500" /> ADMIN
                            </span>
                          )}
                          {u.role === 'OPERATOR' && (
                            <span className="px-2.5 py-1 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-300 font-extrabold text-[10px] border border-blue-500/30 inline-flex items-center gap-1">
                              <Wrench className="w-3 h-3 text-blue-500" /> OPERATOR
                            </span>
                          )}
                          {(u.role === 'USER' || u.role === 'CLIENT') && (
                            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-extrabold text-[10px] border border-emerald-500/30 inline-flex items-center gap-1">
                              <User className="w-3 h-3 text-emerald-500" /> USER
                            </span>
                          )}
                          {u.role === 'DEMO' && (
                            <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300 font-extrabold text-[10px] border border-amber-500/30 inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" /> DEMO
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-gold-500 font-bold text-[11px] uppercase">
                            {u.package}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-700 dark:text-slate-300">
                          {u.invitationsCount} Undangan
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Switcher Dropdown */}
                            <select
                              disabled={isRootAdmin || isOperator}
                              value={u.role === 'CLIENT' ? 'USER' : u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className={`text-[11px] font-bold py-1 px-2 rounded-xl border focus:outline-none focus:border-gold-500 ${
                                isRootAdmin || isOperator
                                  ? 'opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-800'
                                  : isLight
                                  ? 'bg-slate-50 border-slate-300 text-slate-800'
                                  : 'bg-slate-950 border-slate-800 text-slate-200'
                              }`}
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="OPERATOR">OPERATOR</option>
                              <option value="USER">USER</option>
                              <option value="DEMO">DEMO</option>
                            </select>

                            {/* Delete User Button */}
                            {!isRootAdmin && !isOperator && (
                              <button
                                onClick={() => setDeleteTarget(u)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL: Tambah Pengguna Baru (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl space-y-4 animate-scaleUp ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold-500" />
                <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Tambah Pengguna & Tetapkan Role
                </h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso / Staf CS 1"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none focus:border-gold-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Email Akun
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none focus:border-gold-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Password Default
                </label>
                <input
                  type="text"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs focus:outline-none focus:border-gold-500 ${
                    isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Peran / Role
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e: any) => setNewUserRole(e.target.value)}
                    className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-gold-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="USER">USER (Klien)</option>
                    <option value="OPERATOR">OPERATOR (Staf)</option>
                    <option value="DEMO">DEMO (Uji Coba)</option>
                    <option value="ADMIN">ADMIN (Superadmin)</option>
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Paket VIP
                  </label>
                  <select
                    value={newUserPackage}
                    onChange={(e) => setNewUserPackage(e.target.value)}
                    className={`w-full py-2 px-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:border-gold-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  >
                    <option value="BASIC">BASIC (Rp 89.000)</option>
                    <option value="PREMIUM">PREMIUM (Rp 100.000)</option>
                    <option value="LUXURY">LUXURY (Rp 149.000)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border font-bold text-xs ${
                    isLight ? 'border-slate-300 text-slate-700 hover:bg-slate-100' : 'border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Pengguna'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Konfirmasi Hapus Pengguna */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-sm rounded-3xl border p-6 shadow-2xl space-y-4 text-center ${
            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Hapus Pengguna {deleteTarget.name}?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Menghapus akun ini ({deleteTarget.email}) akan menghapus seluruh data undangan yang terkait secara permanen.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className={`px-4 py-2 rounded-xl border text-xs font-bold ${
                  isLight ? 'border-slate-300 text-slate-700' : 'border-slate-800 text-slate-300'
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </div>
  );
}
