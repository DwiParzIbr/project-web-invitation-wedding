'use client';

import React from 'react';
import { Smartphone, Monitor, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  deviceType?: 'iphone' | 'android' | 'desktop';
  onDeviceTypeChange?: (type: 'iphone' | 'android' | 'desktop') => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  deviceType = 'iphone',
  onDeviceTypeChange,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (deviceType === 'desktop') {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl border shadow-2xl transition-colors duration-300">
        {/* Top Desktop Browser Control Bar */}
        <div className={`px-4 py-2.5 flex items-center justify-between border-b text-xs transition-colors ${
          isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className={`px-3 py-1 rounded-lg font-mono text-[11px] border ${
              isLight ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-950 border-slate-800 text-gold-400'
            }`}>
              https://weddora.com/demo/luxury-gold-marble (Mode Fullscreen Website)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeviceTypeChange?.('iphone')}
              className={`px-3 py-1.5 rounded-lg border font-semibold text-xs transition-all flex items-center gap-1.5 ${
                isLight ? 'bg-white border-slate-300 text-slate-800 hover:bg-slate-50' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-gold-500" />
              <span>Ganti ke Mode HP iPhone 15 Pro</span>
            </button>
          </div>
        </div>

        {/* Fullscreen Desktop Website Viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-950 relative [transform:translateZ(0)]">
          <div className="w-full min-h-full">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-full w-full overflow-hidden p-2 select-none">
      {/* Top Device Switcher Toolbar */}
      <div className={`flex items-center justify-between w-full max-w-[380px] mb-2 px-3 py-2 rounded-xl border text-xs shadow-md transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500 text-[11px]">Preview:</span>
          <span className="gold-metallic-bg text-slate-950 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase shadow">
            {deviceType === 'iphone' ? 'iPhone 15 Pro' : 'Android Galaxy'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDeviceTypeChange?.('iphone')}
            className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1 transition-all ${
              deviceType === 'iphone'
                ? 'bg-gold-500/20 border-gold-500 text-gold-600 dark:text-gold-400'
                : isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title="Preview iPhone 15 Pro"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 15</span>
          </button>

          <button
            onClick={() => onDeviceTypeChange?.('desktop')}
            className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] flex items-center gap-1 transition-all ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Preview Mode Website Desktop Fullscreen"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Website</span>
          </button>
        </div>
      </div>

      {/* iPhone 15 Pro Outer Frame */}
      <div className="relative w-[360px] h-[680px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-gold-500/50 shadow-black flex flex-col shrink-0">
        {/* Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2 h-2 rounded-full bg-blue-900/60 animate-pulse" />
        </div>

        {/* Screen Content Wrapper */}
        <div className="w-full h-full bg-slate-950 rounded-[36px] overflow-hidden relative flex flex-col shadow-inner">
          {/* Status Bar */}
          <div className="h-9 w-full bg-black/40 backdrop-blur-sm z-30 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 pointer-events-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-300 rounded-px" />
              </div>
            </div>
          </div>

          {/* Rendered Invitation Website Viewport */}
          <div className="flex-1 overflow-y-auto scrollbar-thin relative [transform:translateZ(0)]">
            {children}
          </div>

          {/* Bottom Home Indicator */}
          <div className="h-5 w-full bg-black/30 backdrop-blur-sm flex items-center justify-center pointer-events-none z-30">
            <div className="w-28 h-1 bg-slate-400/60 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
