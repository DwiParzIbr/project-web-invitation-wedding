import { ThemeConfig, DesignSchema } from '@/types/wedding';

/**
 * Calculates whether a color hex code is perceived as bright/light.
 * Uses standard ITU-R BT.601 perceived luminance formula.
 */
export function isColorLight(hexColor?: string): boolean {
  if (!hexColor) return false;
  const cleanHex = hexColor.replace('#', '').trim();
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 165;
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 165;
  }
  return false;
}

/**
 * Universally determines whether the active invitation design schema or theme is Light Mode.
 */
export function isLightTheme(theme?: ThemeConfig, designSchema?: DesignSchema): boolean {
  // 1. Explicit user override
  if (designSchema?.themeTone === 'light') return true;
  if (designSchema?.themeTone === 'dark') return false;
  if (theme?.isLight === true) return true;
  if (theme?.isLight === false) return false;

  // 2. Background silhouette style
  if (designSchema?.backgroundSilhouetteStyle === 'white-light') return true;

  // 3. Dynamic luminance evaluation of background & card color
  const bg = theme?.background || designSchema?.canvasBgColor;
  if (bg && isColorLight(bg)) return true;

  const cardBg = theme?.cardBg || designSchema?.canvasCardBgColor;
  if (cardBg && isColorLight(cardBg) && (!bg || bg.toLowerCase() === '#ffffff' || bg.toLowerCase() === '#faf8f5')) {
    return true;
  }

  return false;
}

export interface ThemePreset {
  id: string;
  name: string;
  badge: string;
  bg: string;
  cardBg: string;
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  pattern: 'solid' | 'radial-glow' | 'damask' | 'geometric-islamic' | 'marble' | 'stars';
  silhouetteStyle: 'white-light' | 'full';
  description: string;
}

export const LIGHT_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'pure-white',
    name: 'Pure White & Royal Gold',
    badge: '🤍 Putih Bersih',
    bg: '#FFFFFF',
    cardBg: '#FFFFFF',
    primary: '#C9A66B',
    secondary: '#E6D3A9',
    accent: '#D4AF37',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    pattern: 'marble',
    silhouetteStyle: 'white-light',
    description: 'Kemewahan marmer putih bersih dengan aksen foil emas 24K.',
  },
  {
    id: 'blush-pink',
    name: 'Blush Pink & Rose Gold',
    badge: '🌸 Romantis',
    bg: '#FDF7F8',
    cardBg: '#FFFFFF',
    primary: '#D87D8A',
    secondary: '#FBCFE8',
    accent: '#C9949C',
    textPrimary: '#4A1525',
    textSecondary: '#8C5363',
    pattern: 'radial-glow',
    silhouetteStyle: 'white-light',
    description: 'Nuansa pink lembut dan rose gold yang paling disukai calon pengantin wanita.',
  },
  {
    id: 'sage-green',
    name: 'Sage Green & Warm Ivory',
    badge: '🌿 Botanikal',
    bg: '#F4F6F4',
    cardBg: '#FFFFFF',
    primary: '#5B7B68',
    secondary: '#DCFCE7',
    accent: '#8FA89B',
    textPrimary: '#1B3324',
    textSecondary: '#5A7363',
    pattern: 'marble',
    silhouetteStyle: 'white-light',
    description: 'Hijau sage teduh dengan dasar putih gading untuk pernikahan modern elegan.',
  },
  {
    id: 'champagne-pearl',
    name: 'Champagne & Pearl White',
    badge: '🥂 Champagne',
    bg: '#FAF8F5',
    cardBg: '#FFFFFF',
    primary: '#C9A66B',
    secondary: '#FEF3C7',
    accent: '#DFBE82',
    textPrimary: '#2D2319',
    textSecondary: '#7C6C58',
    pattern: 'marble',
    silhouetteStyle: 'white-light',
    description: 'Warna champagne hangat berpadu kertas katun mutiara premium.',
  },
  {
    id: 'lilac-mist',
    name: 'Lilac & Lavender Mist',
    badge: '💜 Pastel',
    bg: '#F8F6FC',
    cardBg: '#FFFFFF',
    primary: '#8A70A8',
    secondary: '#EDE9FE',
    accent: '#A690BF',
    textPrimary: '#2E1E45',
    textSecondary: '#735F8A',
    pattern: 'radial-glow',
    silhouetteStyle: 'white-light',
    description: 'Nuansa ungu lavender muda yang manis, syahdu, dan memikat hati.',
  },
  {
    id: 'warm-terracotta',
    name: 'Warm Terracotta & Sand',
    badge: '🌾 Boho Chic',
    bg: '#FBF8F4',
    cardBg: '#FFFFFF',
    primary: '#B86B53',
    secondary: '#FFEDD5',
    accent: '#D48D77',
    textPrimary: '#3D1F17',
    textSecondary: '#8C5E50',
    pattern: 'solid',
    silhouetteStyle: 'white-light',
    description: 'Nuansa earthy hangat cerah ala pesta pernikahan rustic / outdoor garden.',
  },
  {
    id: 'sky-blue',
    name: 'Sky Blue & Cloud White',
    badge: '🌊 Segar',
    bg: '#F2F7FA',
    cardBg: '#FFFFFF',
    primary: '#3B82F6',
    secondary: '#DBEAFE',
    accent: '#60A5FA',
    textPrimary: '#1E3A5F',
    textSecondary: '#475569',
    pattern: 'radial-glow',
    silhouetteStyle: 'white-light',
    description: 'Biru langit pastel dengan kesegaran awan putih cerah.',
  },
];

export const DARK_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'gold-onyx',
    name: 'Gold & Onyx',
    badge: '👑 Royal',
    bg: '#0F172A',
    cardBg: '#1E293B',
    primary: '#C9A66B',
    secondary: '#E6D3A9',
    accent: '#D7BA7D',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    pattern: 'solid',
    silhouetteStyle: 'full',
    description: 'Kemewahan navy gelap abadi berhias emas permata.',
  },
  {
    id: 'royal-maroon',
    name: 'Royal Maroon',
    badge: '🍷 Anggun',
    bg: '#4A0E17',
    cardBg: '#2D080E',
    primary: '#F5D77F',
    secondary: '#FDE68A',
    accent: '#E5C158',
    textPrimary: '#FFF1F2',
    textSecondary: '#FDA4AF',
    pattern: 'damask',
    silhouetteStyle: 'full',
    description: 'Merah marun mewah ningrat kerajaan berpadu emas keagungan.',
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Forest',
    badge: '🌲 Zamrud',
    bg: '#064E3B',
    cardBg: '#022C22',
    primary: '#F5D77F',
    secondary: '#A7F3D0',
    accent: '#34D399',
    textPrimary: '#ECFDF5',
    textSecondary: '#6EE7B7',
    pattern: 'marble',
    silhouetteStyle: 'full',
    description: 'Kemegahan hijau zamrud hutan keraton yang megah.',
  },
  {
    id: 'rose-crimson',
    name: 'Rose Crimson',
    badge: '🌹 Romantis Gelap',
    bg: '#2D121B',
    cardBg: '#4A1D2C',
    primary: '#F472B6',
    secondary: '#FBCFE8',
    accent: '#FB7185',
    textPrimary: '#FFF1F2',
    textSecondary: '#FDA4AF',
    pattern: 'radial-glow',
    silhouetteStyle: 'full',
    description: 'Keintiman mawar crimson malam yang dramatis dan hangat.',
  },
  {
    id: 'sapphire-midnight',
    name: 'Sapphire Blue',
    badge: '🌌 Midnight',
    bg: '#1E3A8A',
    cardBg: '#172554',
    primary: '#93C5FD',
    secondary: '#BFDBFE',
    accent: '#60A5FA',
    textPrimary: '#EFF6FF',
    textSecondary: '#93C5FD',
    pattern: 'stars',
    silhouetteStyle: 'full',
    description: 'Biru safir tengah malam bertabur rasi bintang gemerlap.',
  },
  {
    id: 'dark-velvet',
    name: 'Dark Velvet',
    badge: '🖤 Modern Black',
    bg: '#18181B',
    cardBg: '#27272A',
    primary: '#E4E4E7',
    secondary: '#A1A1AA',
    accent: '#F43F5E',
    textPrimary: '#FAFAFA',
    textSecondary: '#A1A1AA',
    pattern: 'geometric-islamic',
    silhouetteStyle: 'full',
    description: 'Hitam arang beludru modern minimalis berkarakter kuat.',
  },
];
