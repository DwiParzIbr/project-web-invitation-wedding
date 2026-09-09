'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('weddora_theme') as ThemeMode | null;
    const initialMode = saved || 'dark';
    setMode(initialMode);

    const root = document.documentElement;
    if (initialMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = mode === 'dark' ? 'light' : 'dark';
    setMode(nextMode);
    localStorage.setItem('weddora_theme', nextMode);

    const root = document.documentElement;
    if (nextMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${mode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
