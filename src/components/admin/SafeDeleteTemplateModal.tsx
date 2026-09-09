'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Trash2, X, Archive, AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface SafeDeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any | null;
  onSuccess: () => void;
}

export function SafeDeleteTemplateModal({
  isOpen,
  onClose,
  template,
  onSuccess,
}: SafeDeleteTemplateModalProps) {
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [invitationCount, setInvitationCount] = useState<number>(0);
  const [sampleInvitations, setSampleInvitations] = useState<any[]>([]);

  const [deleteMode, setDeleteMode] = useState<'archive' | 'permanent'>('archive');
  const [confirmInput, setConfirmInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && template?.id) {
      setDeleteMode('archive');
      setConfirmInput('');
      setErrorMsg('');
      checkTemplateDependencies(template.id);
    }
  }, [isOpen, template?.id]);

  const checkTemplateDependencies = async (templateId: string) => {
    setLoadingCheck(true);
    try {
      const res = await fetch(`/api/admin/templates?checkId=${templateId}`);
      if (res.ok) {
        const data = await res.json();
        setInvitationCount(data.invitationCount || 0);
        setSampleInvitations(data.sampleInvitations || []);
      }
    } catch (err) {
      console.error('Check template dependency error:', err);
    } finally {
      setLoadingCheck(false);
    }
  };

  if (!isOpen || !template) return null;

  const handleExecuteDelete = async () => {
    if (deleteMode === 'permanent' && confirmInput.trim().toUpperCase() !== 'HAPUS-PERMANEN') {
      setErrorMsg('Ketik "HAPUS-PERMANEN" untuk mengonfirmasi penghapusan dari database.');
      return;
    }

    setIsExecuting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/admin/templates?id=${template.id}&mode=${deleteMode}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message || 'Proses eksekusi berhasil.');
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Gagal mengeksekusi tindakan ini.');
      }
    } catch (err) {
      console.error('Execute delete error:', err);
      setErrorMsg('Terjadi kesalahan koneksi server.');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden space-y-5 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-playfair flex items-center gap-2">
                <span>Pusat Fitur Safe Delete (Hapus Aman Admin)</span>
              </h3>
              <span className="text-[11px] text-amber-400 font-mono font-semibold">
                Sistem Perlindungan Undangan Pengguna Aktif
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isExecuting}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Target Item Details */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={template.previewImage}
              alt={template.name}
              className="w-12 h-10 rounded-lg object-cover border border-slate-700"
            />
            <div>
              <span className="font-bold text-white block">{template.name}</span>
              <span className="text-[11px] text-slate-400 font-mono block">/{template.slug}</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {template.tier || 'PREMIUM'}
          </span>
        </div>

        {/* Diagnostic Status Box */}
        {loadingCheck ? (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center space-y-2 text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-400" />
            <p>Memeriksa keterhubungan undangan pengguna di database...</p>
          </div>
        ) : (
          <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
            invitationCount > 0
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                {invitationCount > 0 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>Status Keterhubungan Database:</span>
              </span>
              <span className="font-mono text-sm px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800">
                {invitationCount} Undangan Aktif
              </span>
            </div>

            {invitationCount > 0 ? (
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ⚠️ Template ini saat ini digunakan oleh <strong>{invitationCount} undangan pengguna aktif</strong>.
                Menghapus secara permanen akan memindahkan undangan tersebut ke template cadangan agar tidak rusak.
              </p>
            ) : (
              <p className="text-[11px] text-slate-300 leading-relaxed">
                ✓ Aman dihapus secara penuh. Tidak ada undangan pengguna aktif yang terhubung dengan template ini.
              </p>
            )}
          </div>
        )}

        {/* Mode Selector Tabs */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Pilih Metode Tindakan Admin:
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeleteMode('archive')}
              className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                deleteMode === 'archive'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Archive className="w-4 h-4" /> 🛡️ Safe Delete (Arsip)
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300">Rekomendasi</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Sembunyikan dari katalog & daftar buat baru. Undangan pengguna aktif tetap 100% lancar.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeleteMode('permanent')}
              className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all ${
                deleteMode === 'permanent'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md ring-1 ring-rose-500'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Trash2 className="w-4 h-4" /> ⚠️ Hapus Permanen
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                Hapus total dari database. Re-assign otomatis undangan aktif ke template cadangan.
              </p>
            </button>
          </div>
        </div>

        {/* Confirmation Code Input for Permanent Mode */}
        {deleteMode === 'permanent' && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2 animate-fadeIn">
            <label className="block text-[11px] font-bold text-rose-300">
              Ketik kode konfirmasi <span className="font-mono underline text-white">HAPUS-PERMANEN</span> di bawah:
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="Ketik HAPUS-PERMANEN"
              className="w-full p-2.5 rounded-xl border border-rose-500/40 bg-slate-950 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isExecuting}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all border border-slate-700"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handleExecuteDelete}
            disabled={isExecuting}
            className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-2 transition-all ${
              deleteMode === 'archive'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            }`}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Eksekusi...</span>
              </>
            ) : deleteMode === 'archive' ? (
              <>
                <Archive className="w-4 h-4" />
                <span>Eksekusi Safe Delete (Arsipkan)</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Hapus Permanen dari Database</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
