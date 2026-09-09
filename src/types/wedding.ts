export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  bgImage?: string;
  bgOverlayOpacity?: number;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  isLight?: boolean;
}

export interface FontConfig {
  heading: string;
  body: string;
  accent: string;
}

export interface SectionConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface DesignSchema {
  theme: ThemeConfig;
  fonts: FontConfig;
  ornament: string;
  animation: string;
  themeTone?: 'light' | 'dark';
  canvasPatternStyle?: 'solid' | 'radial-glow' | 'damask' | 'geometric-islamic' | 'marble' | 'stars';
  canvasBgColor?: string;
  canvasCardBgColor?: string;
  coverCardBgColor?: string;
  coverCardCornerShape?: 'rounded' | 'arch' | 'sharp' | 'pill' | 'diamond';
  coverCardBorderStyle?: 'solid-gold' | 'double-gold' | 'dashed-gold' | 'glassmorphism' | 'soft-glow';
  cardCornerShape?: 'rounded' | 'arch' | 'sharp' | 'pill' | 'diamond';
  cardBorderStyle?: 'solid-gold' | 'double-gold' | 'dashed-gold' | 'glassmorphism' | 'soft-glow';
  ornamentStyle?: 'gold-floral' | 'islamic-star' | 'minimalist-line' | 'luxury-crown' | 'vintage-scroll';
  photoShape?: 'circle' | 'square' | 'rectangle' | 'arch' | 'oval';
  photoPosition?: 'object-center' | 'object-top' | 'object-bottom';
  enableBackgroundSilhouette?: boolean;
  backgroundSilhouetteOpacity?: number;
  backgroundSilhouetteStyle?: 'full' | 'white-light' | 'vignette' | 'soft-glow' | 'monochrome';
  silhouetteImageUrl?: string;
  backgroundMediaType?: 'photo' | 'video';
  backgroundVideoUrl?: string;
  enableBackgroundVideoLoop?: boolean;
  enableWatermarkTypography?: boolean;
  watermarkText?: string;
  enableAutoScroll?: boolean;
  autoScrollSpeed?: 'slow' | 'medium' | 'fast';
  musicStartTime?: number; // Offset waktu mulai musik dalam detik (misal: 0, 15, 30, 45, 60, 90)
  
  // Interaction Paradigm & Layout Styles
  layoutType?: 'standard_scroll' | 'story_slides' | 'magazine_editorial' | 'cinematic_trailer' | '3d_flipbook' | 'horizontal_gallery' | 'isometric_map' | 'radial_constellation' | 'metro_express';
  coverStyle?: 'standard' | 'wax_seal_envelope' | 'gatefold_ribbon' | 'minimalist_1' | 'minimalist_2' | 'minimalist_3';
  navigationStyle?: 'bottom_dock' | 'none';
  eventStyle?: 'standard' | 'boarding_pass' | 'mini_calendar';
  couplePhotoStyle?: 'circle' | 'arch' | 'polaroid';
  loveStoryStyle?: 'timeline' | 'chat_message' | 'metro_map';
  galleryStyle?: 'grid' | 'film_strip' | 'masonry';
  visualEffect?: 'none' | 'sparkles' | 'floating_petals' | 'cyber_glow';

  sections: SectionConfig[];
}

export interface LoveStoryItem {
  year: string;
  title: string;
  description: string;
}

export interface DigitalGiftItem {
  bankName: string;
  accountName: string;
  accountNumber?: string;
  qrisUrl?: string;
  shippingAddress?: string;
}

export interface EventItem {
  id?: string;
  eventType: 'AKAD' | 'RESEPSI' | 'SYUKURAN' | string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  address: string;
  googleMapsUrl?: string;
}

export interface RsvpItem {
  id?: string;
  guestName: string;
  status: 'ATTENDING' | 'DECLINED' | 'MAYBE';
  guestCount: number;
  message?: string;
  phone?: string;
  createdAt?: string;
}

export interface MagicDesignScore {
  overall: number;
  typography: number;
  colorHarmony: number;
  spacing: number;
  visualHierarchy: number;
  mobileUx: number;
  recommendations: string[];
}
