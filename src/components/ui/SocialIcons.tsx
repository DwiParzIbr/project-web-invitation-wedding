'use client';

import React from 'react';
import {
  formatInstagramUrl,
  formatTiktokUrl,
  formatWhatsappUrl,
  formatMailUrl,
} from '@/utils/social';

export function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.35C9.33 7.35 9 7.42 8.73 7.72C8.45 8.01 7.67 8.75 7.67 10.22C7.67 11.7 8.75 13.12 8.9 13.32C9.05 13.52 11.03 16.57 14.07 17.88C14.79 18.19 15.35 18.38 15.79 18.52C16.52 18.75 17.18 18.72 17.7 18.64C18.28 18.55 19.49 17.9 19.74 17.19C20 16.47 20 15.86 19.92 15.73C19.85 15.61 19.65 15.54 19.35 15.39C19.05 15.24 17.58 14.52 17.3 14.42C17.03 14.32 16.83 14.27 16.63 14.57C16.43 14.87 15.86 15.54 15.68 15.73C15.51 15.93 15.34 15.96 15.04 15.81C14.74 15.66 13.78 15.35 12.65 14.34C11.77 13.55 11.18 12.57 11.01 12.28C10.84 11.98 11 11.82 11.15 11.67C11.28 11.54 11.45 11.32 11.6 11.14C11.75 10.97 11.8 10.85 11.9 10.65C12 10.45 11.95 10.27 11.87 10.12C11.8 9.97 11.2 8.5 10.95 7.9C10.71 7.32 10.46 7.39 10.28 7.39C10.11 7.38 9.91 7.36 9.71 7.36L9.53 7.35Z" />
    </svg>
  );
}

export function MailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

interface SocialIconsRowProps {
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
  email?: string;
  isLight?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SocialIconsRow({
  instagram,
  tiktok,
  whatsapp,
  email,
  isLight = false,
  className = '',
  size = 'md',
}: SocialIconsRowProps) {
  const instagramUrl = formatInstagramUrl(instagram);
  const tiktokUrl = formatTiktokUrl(tiktok);
  const whatsappUrl = formatWhatsappUrl(whatsapp);
  const mailUrl = formatMailUrl(email);

  const dim = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  const iconDim = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

  const baseBtnClass = `relative inline-flex items-center justify-center rounded-xl border transition-all duration-200 active:scale-95 ${dim} ${
    isLight
      ? 'bg-white border-slate-200/90 text-slate-600 shadow-sm hover:shadow'
      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
  }`;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Instagram */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Resmi Weddora VIP"
        title="Kunjungi Instagram Resmi Weddora"
        className={`${baseBtnClass} hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-500 group`}
      >
        <InstagramIcon className={`${iconDim} group-hover:scale-110 transition-transform`} />
      </a>

      {/* TikTok */}
      <a
        href={tiktokUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="TikTok Resmi Weddora VIP"
        title="Kunjungi TikTok Resmi Weddora"
        className={`${baseBtnClass} hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-400 dark:hover:text-cyan-300 group`}
      >
        <TikTokIcon className={`${iconDim} group-hover:scale-110 transition-transform`} />
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Resmi Weddora VIP"
        title="Chat WhatsApp Customer Support VIP"
        className={`${baseBtnClass} hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500 group`}
      >
        <WhatsAppIcon className={`${iconDim} group-hover:scale-110 transition-transform`} />
      </a>

      {/* Mail */}
      <a
        href={mailUrl}
        aria-label="Email Resmi Weddora VIP"
        title="Kirim Email ke Support Weddora"
        className={`${baseBtnClass} hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-500 group`}
      >
        <MailIcon className={`${iconDim} group-hover:scale-110 transition-transform`} />
      </a>
    </div>
  );
}
