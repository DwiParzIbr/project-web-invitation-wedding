'use client';

import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus Data',
  itemName,
  description = 'Tindakan ini bersifat permanen dan data yang telah dihapus tidak dapat dikembalikan.',
  isLoading = false,
}: DeleteConfirmModalProps) {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      <div
        className={`relative w-full max-w-md border rounded-3xl p-6 shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 animate-scaleUp space-y-6 ${
          isLight
            ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/20'
            : 'bg-slate-900 border-slate-800 text-slate-100 shadow-rose-950/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect background */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header & Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 dark:text-rose-400 shadow-lg shadow-rose-500/10 group">
              <Trash2 className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <h3 className={`text-lg font-bold font-playfair tracking-wide flex items-center gap-1.5 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>{title}</span>
              </h3>
              <span className="text-[11px] text-rose-500 dark:text-rose-400 font-mono font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Peringatan Keamanan
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className={`p-1.5 rounded-xl transition-colors ${
              isLight
                ? 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Box */}
        <div className={`space-y-3 p-4 rounded-2xl border text-xs ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          {itemName && (
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b pb-2.5 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <span className={`shrink-0 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Target Item:</span>
              <span className="font-bold text-rose-600 dark:text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 font-mono break-all text-[11px] text-right sm:text-left">
                {itemName}
              </span>
            </div>
          )}
          <p className={`leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
