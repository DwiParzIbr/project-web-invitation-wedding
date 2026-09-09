'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import {
  Users,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Crown,
  X,
  Edit,
  Trash2,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Phone,
  Link2,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { getAppDomain } from '@/utils/domain';

export default function AdminClientsPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [appDomain, setAppDomain] = useState('weddora.web.id');

  useEffect(() => {
    setAppDomain(getAppDomain());
  }, []);

  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedClientId, setExpandedClientId] = useState<string | null>(null);

  // Toast Notice
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Modal Add / Edit Client State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [invitationLinkName, setInvitationLinkName] = useState('');
  const [isLinkManuallyEdited, setIsLinkManuallyEdited] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [selectedPackage, setSelectedPackage] = useState<'BASIC' | 'PREMIUM' | 'LUXURY'>('PREMIUM');
  const [role, setRole] = useState<'USER' | 'OPERATOR' | 'ADMIN' | 'DEMO'>('USER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Animated Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'CLIENT' | 'INVITATION'; id: string; name: string; clientId?: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const openAddModal = () => {
    setEditingClient(null);
    setName('');
    setPhone('');
    setInvitationLinkName('');
    setIsLinkManuallyEdited(false);
    setEmail('');
    setPassword('password123');
    setSelectedPackage('PREMIUM');
    setRole('USER');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (client: any) => {
    setEditingClient(client);
    setName(client.name);
    setPhone(client.phone || '');
    setInvitationLinkName('');
    setIsLinkManuallyEdited(false);
    setEmail(client.email);
    setSelectedPackage(client.package || 'PREMIUM');
    const r = client.role === 'CLIENT' ? 'USER' : client.role || 'USER';
    setRole(r);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      if (editingClient) {
        // Edit Mode
        const res = await fetch('/api/admin/clients', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingClient.id,
            name,
            phone,
            email,
            role,
            package: selectedPackage,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Gagal mengubah data client');
          return;
        }

        setClients(clients.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c)));
        showToast(`✓ Client ${name} berhasil diubah!`);
        setIsModalOpen(false);
      } else {
        // Add Mode
        const res = await fetch('/api/admin/clients', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            invitationLinkName,
            email,
            password,
            role,
            package: selectedPackage,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Gagal menambah client baru');
          return;
        }

        setClients([data, ...clients]);
        showToast(`✓ Client baru ${name} berhasil ditambahkan!`);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan jaringan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'CLIENT') {
        const res = await fetch(`/api/admin/clients?id=${deleteTarget.id}`, { method: 'DELETE' });
        if (res.ok) {
          setClients(clients.filter((c) => c.id !== deleteTarget.id));
          showToast(`✓ Client ${deleteTarget.name} beserta seluruh undangannya telah dihapus dari sistem.`);
        }
      } else if (deleteTarget.type === 'INVITATION' && deleteTarget.clientId) {
        const res = await fetch(`/api/admin/clients?invitationId=${deleteTarget.id}`, { method: 'DELETE' });
        if (res.ok) {
          setClients((prev) =>
            prev.map((c) => {
              if (c.id === deleteTarget.clientId) {
                const updatedInvs = (c.invitations || []).filter((inv: any) => inv.id !== deleteTarget.id);
                return { ...c, invitations: updatedInvs, invitationsCount: updatedInvs.length };
              }
              return c;
            })
          );
          showToast(`✓ Undangan "${deleteTarget.name}" berhasil dihapus secara permanen!`);
        }
      }
      setDeleteTarget(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const totalClients = clients.length;
  const premiumClients = clients.filter((c) => c.package === 'PREMIUM' || c.package === 'PREMIUM_AI').length;
  const luxuryClients = clients.filter((c) => c.package === 'LUXURY').length;
  const totalInvitationsCount = clients.reduce((acc, c) => acc + (c.invitationsCount || 0), 0);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      <AdminNavbar />

      {/* Global Toast Notification Bar */}
      {toastNotice && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-emerald-400 text-xs animate-bounce">
          <CheckCircle className="w-4 h-4 text-slate-950" />
          <span>{toastNotice}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <ScrollReveal direction="down" duration={600}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Link href="/admin" className="text-xs text-gold-500 flex items-center gap-1 hover:underline mb-2 font-bold">
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Dashboard
              </Link>
              <h1 className={`text-3xl font-bold font-playfair flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <Users className="w-7 h-7 text-emerald-500" />
                Client & Invitation Management Center
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pengelolaan daftar Client, Opsi Hapus Undangan Client, Paket Perorangan (89k/100k) & Vendor, dan Batas Kuota.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-slate-950 font-bold text-xs shadow-lg hover:from-emerald-300 hover:to-emerald-500 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Client Baru</span>
            </button>
          </div>
        </ScrollReveal>

        {/* Client Counter Cards */}
        <ScrollReveal direction="up" delay={150} duration={700}>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className={`p-6 rounded-2xl border space-y-2 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Client Terdaftar</span>
              <div className={`text-3xl font-extrabold flex items-center justify-between ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <span>{totalClients} Client</span>
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Client Perorangan (89k)</span>
              <div className="text-3xl font-extrabold text-gold-500 flex items-center justify-between">
                <span>{premiumClients} Client</span>
                <Crown className="w-6 h-6 text-gold-500" />
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Client Luxury VIP (100k)</span>
              <div className="text-3xl font-extrabold text-purple-400 flex items-center justify-between">
                <span>{luxuryClients} Client</span>
                <ShieldCheck className="w-6 h-6 text-purple-400" />
              </div>
            </div>

            <div className={`p-6 rounded-2xl border space-y-2 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
              <span className={`text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Total Undangan Client Aktif</span>
              <div className="text-3xl font-extrabold text-blue-400 flex items-center justify-between">
                <span>{totalInvitationsCount} Undangan</span>
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Clients & Invitations Table */}
        <ScrollReveal direction="up" delay={250} duration={800}>
          <div className={`rounded-3xl border overflow-hidden shadow-xl ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'}`}>
            <div className={`p-6 border-b ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h2 className={`text-sm font-bold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Daftar Client, Paket, & Undangan Yang Telah Dibuat
              </h2>
            </div>

          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
              <thead className={`uppercase font-semibold text-[10px] tracking-wider border-b ${
                isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="px-6 py-4">Client / Pengantin</th>
                  <th className="px-6 py-4">Kontak & Email</th>
                  <th className="px-6 py-4">Paket Dipilih</th>
                  <th className="px-6 py-4">Undangan Dibuat</th>
                  <th className="px-6 py-4">Role Akses</th>
                  <th className="px-6 py-4 text-right">Aksi Client</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Memuat daftar client dan undangan dari database...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Belum ada Client terdaftar. Silakan buat client baru.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => {
                    const isExpanded = expandedClientId === client.id;
                    const invList = client.invitations || [];

                    return (
                      <React.Fragment key={client.id}>
                        <tr className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}>
                          <td className={`px-6 py-4 font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            <div className="flex items-center gap-2">
                              <span>{client.name}</span>
                              {invList.length > 0 && (
                                <button
                                  onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                                  className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1 hover:bg-blue-500 hover:text-white transition-all"
                                  title="Lihat / Hapus Undangan Client Ini"
                                >
                                  <span>{invList.length} Undangan</span>
                                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-mono text-xs text-slate-400">{client.email}</div>
                            {client.phone ? (
                              <a
                                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-mono mt-1 font-semibold"
                                title="Chat WhatsApp"
                              >
                                <Phone className="w-3 h-3 text-emerald-500" />
                                <span>{client.phone}</span>
                              </a>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic block mt-0.5">No HP: -</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full font-extrabold border uppercase text-[10px] ${
                              client.package === 'LUXURY'
                                ? isLight ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                : client.package === 'BASIC'
                                ? isLight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-gold-500/20 text-gold-400 border-gold-500/30'
                            }`}>
                              {client.package === 'PREMIUM_AI' ? 'PREMIUM' : client.package || 'BASIC'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-500">
                            {invList.length} / {client.maxInvitations >= 999 ? 'UNLIMITED' : `${client.maxInvitations}`}
                          </td>
                          <td className="px-6 py-4">
                            {client.role === 'ADMIN' && (
                              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${
                                isLight ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              }`}>
                                👑 ADMIN
                              </span>
                            )}
                            {client.role === 'OPERATOR' && (
                              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${
                                isLight ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              }`}>
                                🛠️ OPERATOR
                              </span>
                            )}
                            {(client.role === 'USER' || client.role === 'CLIENT' || !client.role) && (
                              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${
                                isLight ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              }`}>
                                💍 USER
                              </span>
                            )}
                            {client.role === 'DEMO' && (
                              <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] ${
                                isLight ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}>
                                ✨ DEMO
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {invList.length > 0 && (
                                <button
                                  onClick={() => setExpandedClientId(isExpanded ? null : client.id)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 border transition-all ${
                                    isLight
                                      ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white'
                                      : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500 hover:text-white'
                                  }`}
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>{isExpanded ? 'Tutup' : 'Lihat Undangan'}</span>
                                </button>
                              )}
                              <button
                                onClick={() => openEditModal(client)}
                                className={`p-2 rounded-xl border transition-all ${
                                  isLight
                                    ? 'bg-slate-100 text-slate-700 hover:bg-blue-500 hover:text-white border-slate-300'
                                    : 'bg-slate-800 text-slate-300 hover:bg-blue-500 hover:text-white border-slate-700'
                                }`}
                                title="Edit Client"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ type: 'CLIENT', id: client.id, name: client.name })}
                                className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                                title="Hapus Client"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Invitations Sub-table */}
                        {isExpanded && (
                          <tr className={isLight ? 'bg-slate-50' : 'bg-slate-950/80'}>
                            <td colSpan={6} className={`px-8 py-4 border-y ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className={`font-bold text-xs uppercase tracking-wider flex items-center gap-2 ${
                                    isLight ? 'text-amber-700' : 'text-gold-400'
                                  }`}>
                                    <FileText className="w-4 h-4" /> DAFTAR UNDANGAN YANG DIBUAT OLEH {client.name} ({invList.length})
                                  </h4>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {invList.map((inv: any) => (
                                    <div
                                      key={inv.id}
                                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-md transition-all ${
                                        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-slate-200/50' : 'bg-slate-900 border-slate-800 text-white'
                                      }`}
                                    >
                                      <div className="space-y-1 overflow-hidden">
                                        <div className="flex items-center gap-2">
                                          <span className={`font-bold text-xs truncate ${
                                            isLight ? 'text-slate-900' : 'text-white'
                                          }`}>
                                            {inv.title}
                                          </span>
                                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                            isLight
                                              ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                          }`}>
                                            PUBLISHED
                                          </span>
                                        </div>
                                        <a
                                          href={`/${inv.slug}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className={`text-[11px] font-mono hover:underline flex items-center gap-1 truncate ${
                                            isLight ? 'text-amber-600' : 'text-gold-400'
                                          }`}
                                        >
                                          <span>{appDomain}/{inv.slug}</span>
                                          <ExternalLink className="w-3 h-3 shrink-0" />
                                        </a>
                                      </div>

                                      <button
                                        onClick={() =>
                                          setDeleteTarget({
                                            type: 'INVITATION',
                                            id: inv.id,
                                            name: inv.title,
                                            clientId: client.id,
                                          })
                                        }
                                        className={`px-3 py-1.5 rounded-xl border font-bold text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm transition-all ${
                                          isLight
                                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-200'
                                            : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/30'
                                        }`}
                                        title="Hapus Undangan Client Ini secara permanen"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Hapus Undangan</span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </ScrollReveal>
      </main>

      {/* Modal Add / Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-500" />
                {editingClient ? 'Edit Client & Paket' : 'Tambah Client Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Client / Pengantin</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isLinkManuallyEdited && !editingClient) {
                      setInvitationLinkName(e.target.value);
                    }
                  }}
                  placeholder="Andi & Sinta"
                  className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    Nomor WhatsApp / HP Client
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Contoh: 081234567890</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className={`w-full border rounded-xl p-2.5 font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              {!editingClient && (
                <div>
                  <label className={`block mb-1 font-semibold flex items-center justify-between ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
                    <span className="flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-gold-500" />
                      Nama untuk Link Undangan
                    </span>
                    <span className="text-[10px] text-gold-500 font-medium">misal: Fajar dan Putri</span>
                  </label>
                  <input
                    type="text"
                    value={invitationLinkName}
                    onChange={(e) => {
                      setIsLinkManuallyEdited(true);
                      setInvitationLinkName(e.target.value);
                    }}
                    placeholder="misal: Fajar dan Putri"
                    className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  />
                  {invitationLinkName.trim() && (
                    <div className={`mt-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono border flex items-center gap-2 ${
                      isLight ? 'bg-gold-50 border-gold-300 text-amber-900' : 'bg-gold-500/10 border-gold-500/30 text-gold-300'
                    }`}>
                      <span className="text-slate-400 font-sans text-[10px]">Preview Link:</span>
                      <span className="font-bold">
                        {appDomain}/{invitationLinkName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Email Client</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andi@example.com"
                  className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              {!editingClient && (
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Password Awal</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  />
                </div>
              )}

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Pilih Paket Yang Diambil Client:</label>
                <select
                  value={selectedPackage}
                  onChange={(e: any) => setSelectedPackage(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 font-bold text-gold-500 ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'}`}
                >
                  <option value="PREMIUM">Perorangan Premium (Rp 89.000 - Masa Aktif 12 Bulan)</option>
                  <option value="LUXURY">Perorangan Luxury VIP (Rp 100.000 - Masa Aktif Lifetime)</option>
                  <option value="VENDOR_10">Paket 10 Pcs Vendor (Rp 750.000 - 10 Kuota)</option>
                  <option value="VENDOR_25">Paket 25 Pcs Vendor (Rp 1.500.000 - 25 Kuota)</option>
                  <option value="VENDOR_50">Paket 50 Pcs Vendor (Rp 2.250.000 - 50 Kuota)</option>
                </select>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Role Akses Pengguna:</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 font-semibold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                >
                  <option value="USER">💍 USER (Klien Pengantin)</option>
                  <option value="OPERATOR">🛠️ OPERATOR (Staf Operasional)</option>
                  <option value="DEMO">✨ DEMO (Akun Uji Coba)</option>
                  <option value="ADMIN">👑 ADMIN (Super Admin)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
              >
                {isSubmitting ? 'Menyimpan...' : editingClient ? 'Update Data Client' : 'Simpan Client Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modern Animated Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'CLIENT' ? 'Hapus Akun Client' : 'Hapus Undangan Client'}
        itemName={deleteTarget?.name}
        description={
          deleteTarget?.type === 'CLIENT'
            ? 'Apakah Anda yakin ingin menghapus akun Client ini? Seluruh data dan undangan miliknya akan ikut terhapus secara permanen.'
            : 'Apakah Anda yakin ingin menghapus undangan milik client ini secara permanen?'
        }
        isLoading={isDeleting}
      />

      <AdminFooter />
    </div>
  );
}
