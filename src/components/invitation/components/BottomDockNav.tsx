'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Home, Heart, Calendar, Camera, MessageSquareHeart } from 'lucide-react';
import { isLightTheme } from '@/utils/themeUtils';

interface BottomDockNavProps {
  theme: any;
}

export const BottomDockNav: React.FC<BottomDockNavProps> = ({ theme }) => {
  const isLight = isLightTheme(theme);
  const [activeSection, setActiveSection] = useState('hero');
  const isManualScrollingRef = useRef(false);
  const manualTimerRef = useRef<NodeJS.Timeout | null>(null);

  const navItems = [
    { id: 'hero', label: 'Beranda', icon: Home },
    { id: 'couple', label: 'Mempelai', icon: Heart },
    { id: 'events', label: 'Acara', icon: Calendar },
    { id: 'gallery', label: 'Galeri', icon: Camera },
    { id: 'rsvp', label: 'Doa & RSVP', icon: MessageSquareHeart },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // If user recently clicked a nav button, lock active state during smooth scroll
      if (isManualScrollingRef.current) return;

      const sections = ['hero', 'couple', 'events', 'gallery', 'rsvp'];
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // 1. If scrolled near top of page (within 120px), highlight Beranda immediately
      if (scrollY < 120) {
        setActiveSection('hero');
        return;
      }

      // 2. If scrolled near bottom of page (within 60px), highlight RSVP immediately
      const isNearBottom = 
        viewportHeight + scrollY >= (document.documentElement.scrollHeight - 60);
      if (isNearBottom) {
        setActiveSection('rsvp');
        return;
      }

      // 3. Instant detection using active reading viewport center line (42% of height)
      const centerLine = viewportHeight * 0.42;
      let bestSection = 'hero';
      let minDistanceToCenter = Infinity;

      for (const sectionId of sections) {
        const el = document.getElementById(`section-${sectionId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If section spans across the viewport center line, it is active with 0 delay
          if (rect.top <= centerLine && rect.bottom >= centerLine) {
            bestSection = sectionId;
            minDistanceToCenter = 0;
            break;
          }

          // Otherwise, find section whose midpoint is closest to the center line
          const sectionCenter = (rect.top + rect.bottom) / 2;
          const dist = Math.abs(sectionCenter - centerLine);
          if (dist < minDistanceToCenter) {
            minDistanceToCenter = dist;
            bestSection = sectionId;
          }
        }
      }

      setActiveSection(bestSection);
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    };
  }, []);

  const scrollTo = (id: string) => {
    // 1. Set active state INSTANTLY on pointerdown/click (0ms delay)
    setActiveSection(id);
    isManualScrollingRef.current = true;

    // 2. Smooth scroll to target section
    const el = document.getElementById(`section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 3. Release scroll lock after smooth scroll settles
    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 600);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-none">
      <nav 
        className={`pointer-events-auto backdrop-blur-xl border rounded-full py-1.5 px-2.5 shadow-2xl flex items-center justify-around ${
          isLight
            ? 'bg-white/90 border-stone-200/90 ring-1 ring-black/5'
            : 'bg-slate-950/90 border-gold-500/30 ring-1 ring-white/10'
        }`}
        style={{
          boxShadow: isLight
            ? `0 10px 25px -5px rgba(0,0,0,0.1), 0 0 15px -3px ${theme.primary || '#C9A66B'}25`
            : `0 10px 30px -5px rgba(0,0,0,0.85), 0 0 15px -3px ${theme.primary || '#C9A66B'}35`,
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onPointerDown={() => scrollTo(item.id)}
              onClick={() => scrollTo(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-full cursor-pointer active:scale-95 group select-none ${
                isLight ? 'hover:bg-stone-100/80' : 'hover:bg-white/10'
              }`}
              title={item.label}
            >
              {/* INSTANT ACTIVE PILL (ZERO DELAY, NO SLIDING LAG) */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    backgroundColor: `${theme.primary || '#C9A66B'}25`,
                    border: `1.5px solid ${theme.primary || '#C9A66B'}90`,
                    boxShadow: `0 0 12px ${theme.primary || '#C9A66B'}40`,
                  }}
                />
              )}
              <Icon 
                className={`w-4 h-4 relative z-10 ${
                  isActive
                    ? 'scale-110 drop-shadow'
                    : isLight
                    ? 'text-slate-500 group-hover:text-slate-900'
                    : 'text-slate-400 group-hover:text-slate-100'
                }`}
                style={{
                  color: isActive ? theme.primary || '#C9A66B' : undefined,
                }}
              />
              <span 
                className={`text-[9px] mt-0.5 tracking-wider relative z-10 ${
                  isActive
                    ? 'font-bold'
                    : isLight
                    ? 'font-medium text-slate-500 group-hover:text-slate-900'
                    : 'font-medium text-slate-400 group-hover:text-slate-100'
                }`}
                style={{
                  color: isActive ? theme.primary || '#C9A66B' : undefined,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
