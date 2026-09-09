'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { DeleteConfirmModal } from '@/components/ui/DeleteConfirmModal';
import { Layers, ArrowLeft, Plus, Edit, Trash2, X, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminCategoriesPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal Add / Edit State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Sparkles');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Sparkles');
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // Edit Mode
        const res = await fetch('/api/admin/categories', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingCategory.id,
            name,
            description,
            icon,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setCategories(categories.map((c) => (c.id === editingCategory.id ? updated : c)));
          setIsModalOpen(false);
        }
      } else {
        // Add Mode
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            icon,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setCategories([...categories, created]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Save category error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/categories?id=${deletingCategory.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== deletingCategory.id));
        setDeletingCategory(null);
      }
    } catch (err) {
      console.error('Delete category error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

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
                <Layers className="w-7 h-7 text-purple-400" />
                Category Management ({categories.length})
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Pengelolaan kategori tema template (Modern, Islamic, Luxury, Traditional, dsb.) pada platform Weddora.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Baru</span>
            </button>
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
                    <th className="px-6 py-4">Nama Kategori</th>
                    <th className="px-6 py-4">Slug Identifier</th>
                    <th className="px-6 py-4">Deskripsi</th>
                    <th className="px-6 py-4">Jumlah Template</th>
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Memuat daftar kategori dari database...
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        Belum ada kategori terdaftar. Silakan buat kategori baru.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}>
                        <td className={`px-6 py-4 font-bold text-sm flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>{cat.name}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-gold-500">{cat.slug}</td>
                        <td className="px-6 py-4 text-slate-400">{cat.description || '-'}</td>
                        <td className="px-6 py-4 font-bold text-emerald-400">{cat.templates?.length || 0} Template</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(cat)}
                              className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30"
                              title="Edit Kategori"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                              title="Hapus Kategori"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Modal Add / Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Islamic & Syar'i"
                  className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Deskripsi Kategori</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Koleksi desain bernuansa Islami..."
                  rows={3}
                  className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                {isSubmitting ? 'Menyimpan...' : editingCategory ? 'Update Data Kategori' : 'Simpan Kategori Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modern Animated Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={confirmDeleteCategory}
        title="Hapus Kategori Tema"
        itemName={deletingCategory?.name}
        description="Apakah Anda yakin ingin menghapus Kategori ini? Template dalam kategori ini tetap aman namun kategorinya akan dilepas."
        isLoading={isDeleting}
      />

      <AdminFooter />
    </div>
  );
}
