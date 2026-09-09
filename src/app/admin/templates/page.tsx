'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNavbar } from '@/components/layout/AdminNavbar';
import { AdminFooter } from '@/components/layout/AdminFooter';
import { SafeDeleteTemplateModal } from '@/components/admin/SafeDeleteTemplateModal';
import { Palette, ArrowLeft, Plus, CheckCircle, Edit, Trash2, Upload, X, Eye, ExternalLink } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

export default function AdminTemplatesPage() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('200000');
  const [tier, setTier] = useState<'PREMIUM' | 'LUXURY'>('PREMIUM');
  const [previewImage, setPreviewImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?w=800');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tplRes, catRes] = await Promise.all([
        fetch('/api/admin/templates'),
        fetch('/api/admin/categories'),
      ]);

      if (tplRes.ok) setTemplates(await tplRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch (err) {
      console.error('Failed to load templates or categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingTemplate(null);
    setName('');
    setCategoryId(categories[0]?.id || '');
    setPrice('89000');
    setTier('PREMIUM');
    setPreviewImage('https://images.unsplash.com/photo-1519741497674-611481863552?w=800');
    setDescription('');
    setStatus('PUBLISHED');
    setIsModalOpen(true);
  };

  const openEditModal = (tpl: any) => {
    setEditingTemplate(tpl);
    setName(tpl.name);
    setCategoryId(tpl.categoryId);
    setPrice(tpl.price.toString());
    setTier(tpl.tier || 'PREMIUM');
    setPreviewImage(tpl.previewImage);
    setDescription(tpl.description || '');
    setStatus(tpl.status || 'PUBLISHED');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) setPreviewImage(data.url);
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingTemplate) {
        // Edit Mode
        const res = await fetch('/api/admin/templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTemplate.id,
            name,
            categoryId,
            price,
            tier,
            previewImage,
            description,
            status,
          }),
        });

        if (res.ok) {
          const updated = await res.json();
          setTemplates(templates.map((t) => (t.id === editingTemplate.id ? updated : t)));
          setIsModalOpen(false);
        }
      } else {
        // Add Mode
        const res = await fetch('/api/admin/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            categoryId,
            price,
            tier,
            previewImage,
            description,
            status,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setTemplates([created, ...templates]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Save template error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Safe Delete Modal State
  const [deletingTemplate, setDeletingTemplate] = useState<any | null>(null);

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
                <Palette className="w-7 h-7 text-gold-400" />
                Template Management Center ({templates.length})
              </h1>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Kelola katalog template undangan pernikahan, atur harga paket (89k, 100k), dan ubah status tayang.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/demo/luxury-gold-marble"
                target="_blank"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-purple-200" />
                <span>Buka Demo Web</span>
              </Link>

              <button
                onClick={openAddModal}
                className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Template Baru</span>
              </button>
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
                  <th className="px-6 py-4">Preview Foto</th>
                  <th className="px-6 py-4">Nama Template</th>
                  <th className="px-6 py-4">Kategori</th>
                  <th className="px-6 py-4">Tier & Harga</th>
                  <th className="px-6 py-4">Status Tayang</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Memuat daftar template dari database...
                    </td>
                  </tr>
                ) : templates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      Belum ada template terdaftar.
                    </td>
                  </tr>
                ) : (
                  templates.map((tpl) => (
                    <tr key={tpl.id} className={isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800/50'}>
                      <td className="px-6 py-4">
                        <img src={tpl.previewImage} alt={tpl.name} className="w-16 h-12 rounded-lg object-cover border border-slate-700 shadow-sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold text-sm block ${isLight ? 'text-slate-900' : 'text-white'}`}>{tpl.name}</span>
                        <span className="text-[11px] text-slate-500 font-mono block">{tpl.slug}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gold-500">{tpl.category?.name || 'Umum'}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          Rp {tpl.price ? tpl.price.toLocaleString('id-ID') : '0'}
                        </span>
                        <span className="block text-[10px] text-amber-500 font-mono uppercase font-bold">{tpl.tier || 'BASIC'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          tpl.status === 'ARCHIVED'
                            ? 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            : tpl.status === 'DRAFT'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {tpl.status === 'ARCHIVED' ? '🛡️ ARCHIVED (Safe Delete)' : tpl.status || 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/demo/${tpl.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white transition-all border border-purple-500/30"
                            title={`Preview Live Template ${tpl.name} (/demo/${tpl.slug})`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/template/editor/${tpl.slug}`}
                            className="px-2.5 py-1.5 rounded-xl bg-gold-500/20 text-gold-400 hover:bg-gold-500 hover:text-slate-950 transition-all border border-gold-500/40 text-xs font-bold flex items-center gap-1.5"
                            title={`Edit Desain Master Template ${tpl.name} (Hanya Admin)`}
                          >
                            <Palette className="w-3.5 h-3.5 text-gold-400" />
                            <span>Edit Desain Master</span>
                          </Link>
                          <button
                            onClick={() => openEditModal(tpl)}
                            className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30"
                            title="Edit Data Template"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingTemplate(tpl)}
                            className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                            title="Safe Delete / Hapus Template"
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

      {/* Safe Delete Template Admin Modal */}
      <SafeDeleteTemplateModal
        isOpen={!!deletingTemplate}
        onClose={() => setDeletingTemplate(null)}
        template={deletingTemplate}
        onSuccess={loadData}
      />

      {/* Modal Add / Edit Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`border rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className="font-bold text-base flex items-center gap-2">
                <Palette className="w-5 h-5 text-gold-400" />
                {editingTemplate ? 'Edit Template' : 'Tambah Template Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
              {editingTemplate && (
                <div className="p-3 rounded-2xl bg-gold-500/10 border border-gold-500/30 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-gold-400 block uppercase">Desain Master Template Asli</span>
                  <Link
                    href={`/editor/template-${editingTemplate.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-gold-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:bg-gold-400 shadow-md transition-all"
                  >
                    <Palette className="w-4 h-4 text-slate-950" />
                    <span>Buka Studio Visual Editor (Ubah Desain Master)</span>
                  </Link>
                </div>
              )}
              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Nama Template</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Luxury Gold Marble VIP"
                  className={`w-full border rounded-xl p-2.5 ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Kategori Tema</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-bold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Tier Paket</label>
                  <select
                    value={tier}
                    onChange={(e: any) => {
                      setTier(e.target.value);
                      if (e.target.value === 'PREMIUM') setPrice('89000');
                      if (e.target.value === 'LUXURY') setPrice('100000');
                    }}
                    className={`w-full border rounded-xl p-2.5 font-bold text-gold-500 ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'}`}
                  >
                    <option value="PREMIUM">PREMIUM (Rp 89.000)</option>
                    <option value="LUXURY">LUXURY VIP (Rp 100.000)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Harga (Rp)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Status Tayang</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-semibold ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  >
                    <option value="PUBLISHED">PUBLISHED (Tayang Publik)</option>
                    <option value="DRAFT">DRAFT (Sembunyi / Konsep)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block mb-1 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Preview Foto Cover Template</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="template-preview-upload"
                  />
                  <label
                    htmlFor="template-preview-upload"
                    className="px-3 py-2 rounded-xl bg-gold-500/20 text-gold-400 font-bold border border-gold-500/30 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload Foto'}</span>
                  </label>
                  <input
                    type="text"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    className={`flex-1 border rounded-xl p-2 text-[11px] font-mono ${isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all"
              >
                {isSubmitting ? 'Menyimpan Template...' : editingTemplate ? 'Update Data Template' : 'Simpan Template Baru'}
              </button>
            </form>
          </div>
        </div>
      )}

      <AdminFooter />
    </div>
  );
}
