'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, Activity, ExternalLink } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function AdminFooter() {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <footer className={`border-t text-xs py-6 mt-16 font-sans transition-colors duration-300 ${
      isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-950 border-slate-800/80 text-slate-400'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className={`flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <Crown className="w-4 h-4 text-gold-500" />
            </div>
            <div>
              <span className={`font-extrabold font-playfair tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Weddora Admin Console
              </span>
              <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
                Executive Control & Management Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-emerald-500 font-bold">
              <Activity className="w-3.5 h-3.5" /> Platform Status: Operational
            </span>
            <span className={isLight ? 'text-slate-300' : 'text-slate-700'}>|</span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Environment: Production</span>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
          isLight ? 'text-slate-500' : 'text-slate-500'
        }`}>
          <div>
            &copy; {new Date().getFullYear()} Weddora AI Platform. All rights reserved. Reserved for Authorized Superadmin Users.
          </div>

          <div className={`flex items-center gap-4 font-semibold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
            <Link href="/" target="_blank" className="hover:text-gold-500 flex items-center gap-1 transition-colors">
              <span>Public Website</span>
              <ExternalLink className="w-3 h-3 text-gold-500" />
            </Link>
            <Link href="/admin/settings" className="hover:text-gold-500 transition-colors">
              System Configuration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
