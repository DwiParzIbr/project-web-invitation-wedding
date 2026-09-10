'use client';

import React from 'react';
import { TurutMengundangConfig, ThemeConfig, FontConfig } from '@/types/wedding';
import { Users, Crown, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/effects/ScrollReveal';

interface TurutMengundangSectionProps {
  config?: TurutMengundangConfig;
  theme: ThemeConfig;
  fonts: FontConfig;
  textPrimaryColor?: string;
  contentCardBg?: string;
  contentCardBorderClass?: string;
  cardBorderRadius?: string;
  RenderOrnamentDivider?: React.ComponentType;
}

export const TurutMengundangSection: React.FC<TurutMengundangSectionProps> = ({
  config,
  theme,
  fonts,
  textPrimaryColor = '#F8FAFC',
  contentCardBg = 'rgba(15, 23, 42, 0.75)',
  contentCardBorderClass = 'border border-gold-500/30',
  cardBorderRadius = 'rounded-3xl',
  RenderOrnamentDivider,
}) => {
  // If explicitly disabled, do not render
  if (config?.enabled === false) return null;

  // Extract items or parse from rawText
  let items = config?.items || [];
  if (items.length === 0 && config?.rawText && config.rawText.trim()) {
    items = config.rawText
      .split('\n')
      .map((line) => line.trim().replace(/^[-*•\d.]+\s*/, ''))
      .filter(Boolean)
      .map((name) => ({ name }));
  }

  // If no items at all, supply default sample items
  if (items.length === 0) {
    items = [
      { name: 'Bapak Gubernur Bengkulu', role: 'Tokoh Kehormatan' },
      { name: 'Bapak Bupati', role: 'Tokoh Kehormatan' },
      { name: 'Keluarga Besar Mempelai Pria' },
      { name: 'Keluarga Besar Mempelai Wanita' },
    ];
  }

  const title = config?.title?.trim() || 'Turut Mengundang';
  const subtitle =
    config?.subtitle?.trim() ||
    'Merupakan suatu kehormatan dan kebahagiaan bagi kami sekeluarga atas kehadiran dan doa restu Bapak/Ibu/Saudara/i:';

  return (
    <ScrollReveal direction="up">
      <section className="px-6 max-w-md mx-auto space-y-6 pt-2">
        <div className="text-center space-y-2">
          {RenderOrnamentDivider ? <RenderOrnamentDivider /> : null}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-1"
               style={{ backgroundColor: `${theme.primary}18`, color: theme.primary, border: `1px solid ${theme.primary}35` }}>
            <Users className="w-3 h-3" />
            <span>Keluarga Besar & Kehormatan</span>
          </div>
          <h2
            className="text-2xl font-bold tracking-wide"
            style={{ fontFamily: `'${fonts.heading || 'Cinzel Decorative'}', serif`, color: textPrimaryColor }}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: theme.textSecondary }}>
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`p-6 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden ${cardBorderRadius} ${contentCardBorderClass}`}
          style={{ backgroundColor: contentCardBg }}
        >
          {/* Subtle Ambient Corner Accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-20"
            style={{ backgroundColor: theme.primary }}
          />

          <div className="grid grid-cols-1 gap-3 relative z-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-2xl transition-all duration-200"
                style={{
                  backgroundColor: `${theme.primary}08`,
                  border: `1px solid ${theme.primary}20`,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  <span className="text-xs font-bold leading-none font-serif">✦</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className="font-bold text-xs tracking-wide leading-snug"
                    style={{ color: textPrimaryColor }}
                  >
                    {item.name}
                  </h4>
                  {item.role && (
                    <span
                      className="text-[11px] block mt-0.5 font-medium leading-tight"
                      style={{ color: theme.textSecondary }}
                    >
                      {item.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <span
              className="text-[10px] tracking-wider uppercase font-semibold block"
              style={{ color: `${theme.primary}bb` }}
            >
              Beserta Segenap Keluarga Besar Kedua Mempelai
            </span>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
};
