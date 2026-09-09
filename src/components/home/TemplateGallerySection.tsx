'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Crown, Eye, Palette, Sparkles, ShieldCheck, Feather, Flower2, LayoutGrid, Heart, Minimize2 } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  previewImage: string;
  price: number;
  tier: string;
  description: string | null;
  category: {
    name: string;
    slug: string;
  };
}

interface TemplateGallerySectionProps {
  initialTemplates: TemplateItem[];
  categories: { id: string; name: string; slug: string }[];
}

export function TemplateGallerySection({ initialTemplates, categories }: TemplateGallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryFilterList = [
    { id: 'all', name: 'Semua Template', icon: 'Sparkles' },
    { id: 'luxury', name: 'Luxury & Royal', icon: 'Crown' },
    { id: 'traditional', name: 'Adat & Tradisional', icon: 'Feather' },
    { id: 'floral', name: 'Floral & Botanical', icon: 'Flower2' },
    { id: 'modern', name: 'Modern Minimalis', icon: 'LayoutGrid' },
    { id: 'islamic', name: 'Islami & Syar\'i', icon: 'Heart' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? initialTemplates
    : initialTemplates.filter((t) => t.category.slug === selectedCategory);

  return (
    <section id="templates" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto space-y-10">
        <ScrollReveal direction="up">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs font-extrabold border border-gold-500/30 shadow-sm">
              <Crown className="w-4 h-4 text-gold-400" />
              <span>Gallery Template Mewah Multi-Kategori</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white font-playfair">
              Jelajahi Gallery Template Mewah & Demo Live
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Pilih kategori favoritmu di bawah ini dan klik <strong className="text-gold-500">"Demo Live"</strong> untuk mencoba tampilan undangan secara langsung.
            </p>
          </div>
        </ScrollReveal>

        {/* INTERACTIVE CATEGORY TABS FILTER */}
        <ScrollReveal direction="up" delay={150}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {categoryFilterList.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm ${
                    isActive
                      ? 'gold-metallic-bg text-slate-950 shadow-lg shadow-gold-500/20 scale-105 font-black'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-800 hover:border-gold-400 hover:text-gold-500'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* TEMPLATES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredTemplates.map((tpl, idx) => (
            <ScrollReveal key={tpl.id} direction="up" delay={(idx % 3) * 100}>
              <div className="group rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800/80 overflow-hidden hover:border-gold-500 transition-all flex flex-col shadow-xl hover:shadow-2xl hover:shadow-gold-500/10">
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={tpl.previewImage}
                    alt={tpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[10px] font-bold text-gold-400 border border-gold-500/30 uppercase">
                      {tpl.category.name}
                    </span>
                    <span className="px-3 py-1 rounded-full gold-metallic-bg text-slate-950 text-[10px] font-extrabold uppercase shadow-md">
                      {tpl.tier}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors font-playfair">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-base font-extrabold text-gold-600 dark:text-gold-400">
                        {tpl.tier === 'LUXURY' ? 'Rp 100.000' : 'Rp 89.000'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/demo/${tpl.slug}`}
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gold-500/20 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-500" />
                        <span>Demo Live</span>
                      </Link>

                      <Link
                        href={`/editor/${tpl.id}`}
                        className="px-3.5 py-2 rounded-xl gold-shimmer-btn text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:scale-105"
                      >
                        <Palette className="w-3.5 h-3.5 text-slate-950" />
                        <span>Pilih</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <Sparkles className="w-8 h-8 text-gold-500 mx-auto animate-pulse" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Belum ada template di kategori ini</h4>
            <p className="text-xs text-slate-500">Silakan pilih kategori lainnya untuk melihat koleksi template mewah kami.</p>
          </div>
        )}
      </div>
    </section>
  );
}
