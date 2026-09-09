'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignSchema, EventItem, DigitalGiftItem, RsvpItem, LoveStoryItem } from '@/types/wedding';
import { FloatingParticleEffects } from '@/components/effects/FloatingParticleEffects';
import { ScrollReveal } from '@/components/effects/ScrollReveal';
import { getCleanName, getInitialLetter } from '@/utils/nameUtils';
import {
  Volume2,
  VolumeX,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Sparkles,
  Copy,
  Check,
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Gift,
  QrCode,
  Crown,
  Flower2,
  Moon,
  X,
  Maximize2,
  Package,
  Instagram,
  Video,
  Play,
  Pause,
  ArrowDownCircle,
} from 'lucide-react';
import { InteractiveWaxSealEnvelope } from './components/InteractiveWaxSealEnvelope';
import { FrenchGatefoldRibbonCover } from './components/FrenchGatefoldRibbonCover';
import { 
  MinimalistCover1, 
  MinimalistCover2, 
  MinimalistCover3 
} from './components/MinimalistCoverLayouts';
import { StandardCoverCard } from './components/StandardCoverCard';
import { BottomDockNav } from './components/BottomDockNav';
import { BoardingPassEvent } from './components/BoardingPassEvent';
import { MiniCalendarEvent } from './components/MiniCalendarEvent';
import { PolaroidPhotos } from './components/PolaroidPhotos';
import { ArchMoroccanPhotos } from './components/ArchMoroccanPhotos';
import { ChatMessageLoveStory } from './components/ChatMessageLoveStory';
import { MetroRoadmapLoveStory } from './components/MetroRoadmapLoveStory';
import { FilmStripGallery } from './components/FilmStripGallery';
import { MasonryGallery } from './components/MasonryGallery';
import { StorySlidesLayout } from './layouts/StorySlidesLayout';
import { MagazineEditorialLayout } from './layouts/MagazineEditorialLayout';
import { CinematicTrailerLayout } from './layouts/CinematicTrailerLayout';
import { RealisticFlipbookLayout } from './layouts/RealisticFlipbookLayout';
import { HorizontalGalleryLayout } from './layouts/HorizontalGalleryLayout';
import { IsometricMiniWorldLayout } from './layouts/IsometricMiniWorldLayout';
import { RadialConstellationLayout } from './layouts/RadialConstellationLayout';
import { MetroLoveExpressLayout } from './layouts/MetroLoveExpressLayout';
import { isLightTheme, isColorLight } from '@/utils/themeUtils';

interface RenderInvitationViewProps {
  invitation: any;
  guestName?: string;
  isPreview?: boolean;
}

export const RenderInvitationView: React.FC<RenderInvitationViewProps> = ({
  invitation,
  guestName = 'Bapak/Ibu/Saudara/i',
  isPreview = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showQrisModal, setShowQrisModal] = useState<string | null>(null);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // RSVP Form State
  const [rsvpsList, setRsvpsList] = useState<RsvpItem[]>(invitation.rsvps || []);
  const [rsvpName, setRsvpName] = useState(guestName !== 'Bapak/Ibu/Saudara/i' ? guestName : '');
  const [rsvpStatus, setRsvpStatus] = useState<'ATTENDING' | 'DECLINED' | 'MAYBE'>('ATTENDING');
  const [rsvpCount, setRsvpCount] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const safeParseJSON = (data: any, fallback: any) => {
    if (!data) return fallback;
    let parsed = data;
    try {
      while (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed || fallback;
    } catch {
      return fallback;
    }
  };

  // Parse Schema
  const designSchema: DesignSchema = safeParseJSON(invitation.designConfig, {});

  const animationEffect = designSchema?.animation || 'sparkles';
  const cardStyleClass = (designSchema as any)?.cardStyle || 'rounded-3xl border-gold';

  // Auto Scroll Engine State
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<'slow' | 'medium' | 'fast'>(
    (designSchema?.autoScrollSpeed as any) || 'medium'
  );
  const animFrameIdRef = useRef<number | null>(null);

  // Scroll Progress Percentage State (0 - 100%) for Circular Indicator
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsAutoScrolling(false);
  };

  const theme = designSchema?.theme || {
    primary: '#C9A66B',
    secondary: '#E6D3A9',
    background: '#0F172A',
    bgImage: '',
    cardBg: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    accent: '#D7BA7D',
  };

  const isLight = isLightTheme(theme, designSchema);

  // Smart Adaptive Text Color Helper
  // Automatically detects if the color is dark (like dark grey / navy / black #1E293B / #0F172A)
  // and converts dark colors on dark background to Crisp Pure White (#FFFFFF), and vice versa for Light Mode!
  const getAdaptiveTextColor = (rawColor?: string) => {
    if (isLight) {
      if (rawColor && !isColorLight(rawColor)) return rawColor;
      return '#1E293B'; // Crisp dark text for light mode
    }

    if (!rawColor) return '#F8FAFC';
    const hex = rawColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      // If brightness is dark (< 170), force Crisp White (#FFFFFF)
      if (brightness < 170) {
        return '#FFFFFF';
      }
    }
    return rawColor;
  };

  const textPrimaryColor = getAdaptiveTextColor(theme.textPrimary);

  const fonts = designSchema?.fonts || {
    heading: 'Great Vibes',
    body: 'Montserrat',
    accent: 'Great Vibes',
  };

  // Helper for Card Corner Shape Class
  const getCardCornerClass = (shape?: string) => {
    switch (shape) {
      case 'arch':
        return 'rounded-t-[3.5rem] rounded-b-3xl';
      case 'sharp':
        return 'rounded-none';
      case 'pill':
        return 'rounded-[3rem]';
      case 'diamond':
        return 'rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-2xl rounded-br-2xl';
      case 'rounded':
      default:
        return 'rounded-3xl';
    }
  };

  // Helper for Card Border Style Class
  const getCardBorderClass = (style?: string) => {
    switch (style) {
      case 'double-gold':
        return 'border-4 border-double border-amber-500/60 shadow-2xl';
      case 'dashed-gold':
        return 'border-2 border-dashed border-amber-500/50 shadow-xl';
      case 'glassmorphism':
        return 'backdrop-blur-md bg-slate-900/40 border border-white/20 shadow-2xl shadow-amber-500/10';
      case 'soft-glow':
        return 'border border-amber-400/60 shadow-[0_0_25px_rgba(212,175,55,0.3)]';
      case 'solid-gold':
      default:
        return 'border border-amber-500/40 shadow-xl';
    }
  };

  // Canvas Pattern Overlay Helper
  const getCanvasPatternOverlay = (pattern?: string) => {
    switch (pattern) {
      case 'radial-glow':
        return 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900/40 to-transparent';
      case 'damask':
        return 'bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-25';
      case 'geometric-islamic':
        return 'bg-[radial-gradient(#f59e0b_1.5px,transparent_1.5px)] [background-size:28px_28px] opacity-30';
      case 'marble':
        return 'bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.15),transparent_75%)]';
      case 'stars':
        return 'bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-20';
      case 'solid':
      default:
        return '';
    }
  };

  const coverCardCornerClass = getCardCornerClass(designSchema?.coverCardCornerShape || designSchema?.cardCornerShape);
  const coverCardBorderClass = getCardBorderClass(designSchema?.coverCardBorderStyle || designSchema?.cardBorderStyle);
  const coverCardBg = designSchema?.coverCardBgColor || theme.cardBg || (isLight ? '#FFFFFF' : '#1E293B');

  const contentCardCornerClass = getCardCornerClass(designSchema?.cardCornerShape);
  const contentCardBorderClass = getCardBorderClass(designSchema?.cardBorderStyle);
  const contentCardBg = designSchema?.canvasCardBgColor || theme.cardBg || (isLight ? '#FFFFFF' : '#1E293B');

  const canvasPatternOverlay = getCanvasPatternOverlay(designSchema?.canvasPatternStyle);

  // Render Ornamental Divider Helper
  const RenderOrnamentDivider = ({ style, color }: { style?: string; color?: string }) => {
    const activeStyle = style || designSchema?.ornamentStyle || designSchema?.ornament || 'gold-floral';
    const activeColor = color || theme.primary || '#C9A66B';

    if (activeStyle === 'none') return null;

    switch (activeStyle) {
      case 'islamic-star':
        return (
          <div className="flex items-center justify-center gap-3 my-2 opacity-90">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-current" style={{ color: activeColor }} />
            <span className="text-xs font-mono" style={{ color: activeColor }}>🕌 ۞ 🕌</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-current" style={{ color: activeColor }} />
          </div>
        );
      case 'minimalist-line':
        return (
          <div className="flex items-center justify-center gap-2 my-2 opacity-80">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-current" style={{ color: activeColor }} />
            <div className="w-1.5 h-1.5 rotate-45 border" style={{ borderColor: activeColor }} />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-current" style={{ color: activeColor }} />
          </div>
        );
      case 'luxury-crown':
        return (
          <div className="flex items-center justify-center gap-3 my-2 opacity-90">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-current" style={{ color: activeColor }} />
            <Crown className="w-4 h-4" style={{ color: activeColor }} />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-current" style={{ color: activeColor }} />
          </div>
        );
      case 'vintage-scroll':
        return (
          <div className="flex items-center justify-center gap-2 my-2 opacity-90">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-current" style={{ color: activeColor }} />
            <span className="text-xs font-serif italic" style={{ color: activeColor }}>❧ ❦ ☙</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-current" style={{ color: activeColor }} />
          </div>
        );
      case 'gold-floral':
      default:
        return (
          <div className="flex items-center justify-center gap-2.5 my-2 opacity-90">
            <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-current" style={{ color: activeColor }} />
            <Sparkles className="w-4 h-4" style={{ color: activeColor }} />
            <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-current" style={{ color: activeColor }} />
          </div>
        );
    }
  };

  // Synchronized Photo Frame Shape & Crop Alignment Helper
  const getPhotoFrameStyles = (shape?: string) => {
    switch (shape) {
      case 'square':
        return {
          container: 'w-28 h-28 rounded-2xl',
          image: 'rounded-xl',
        };
      case 'rectangle':
        return {
          container: 'w-28 h-36 rounded-2xl',
          image: 'rounded-xl',
        };
      case 'arch':
        return {
          container: 'w-28 h-36 rounded-t-full rounded-b-2xl',
          image: 'rounded-t-full rounded-b-xl',
        };
      case 'oval':
        return {
          container: 'w-28 h-36 rounded-[50%]',
          image: 'rounded-[50%]',
        };
      case 'circle':
      default:
        return {
          container: 'w-28 h-28 rounded-full',
          image: 'rounded-full',
        };
    }
  };

  const frameStyle = getPhotoFrameStyles(designSchema?.photoShape);

  const getObjectPositionStyle = (pos?: string): React.CSSProperties => {
    if (pos === 'object-top') return { objectFit: 'cover', objectPosition: 'top center' };
    if (pos === 'object-bottom') return { objectFit: 'cover', objectPosition: 'bottom center' };
    return { objectFit: 'cover', objectPosition: 'center center' };
  };

  const eventsList: EventItem[] = (invitation.events && invitation.events.length > 0)
    ? invitation.events
    : [
        {
          eventType: 'AKAD',
          title: 'Akad Nikah',
          date: '2026-12-12',
          startTime: '08:00 WIB',
          endTime: '10:00 WIB',
          venueName: 'Grand Ballroom Hotel Indonesia Kempinski',
          address: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat',
          googleMapsUrl: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
        },
        {
          eventType: 'RESEPSI',
          title: 'Resepsi Pernikahan',
          date: '2026-12-12',
          startTime: '11:00 WIB',
          endTime: '15:00 WIB',
          venueName: 'Grand Ballroom Hotel Indonesia Kempinski',
          address: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat',
          googleMapsUrl: 'https://maps.google.com/?q=Hotel+Indonesia+Kempinski+Jakarta',
        },
      ];
  
  const giftsList: DigitalGiftItem[] = safeParseJSON(invitation.digitalGifts, []);
  const galleryList: string[] = safeParseJSON(invitation.galleryPhotos, [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
  ]);
  const loveStoryList: LoveStoryItem[] = safeParseJSON(invitation.loveStory, [
    { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat seminar kampus.' },
    { year: '2025', title: 'Acara Lamaran', description: 'Keluarga besar saling melamar.' },
  ]);

  // Lightbox Navigation Handlers
  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null || galleryList.length === 0) return;
    setActiveLightboxIndex((prev) => (prev! === 0 ? galleryList.length - 1 : prev! - 1));
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex === null || galleryList.length === 0) return;
    setActiveLightboxIndex((prev) => (prev! === galleryList.length - 1 ? 0 : prev! + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrevPhoto();
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'Escape') setActiveLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, galleryList]);

  // Parse YouTube Embed Link
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      const videoId = match[2];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&modestbranding=1`;
    }
    return null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(invitation.youtubeUrl);

  const getInstagramUrl = (handle?: string) => {
    if (!handle) return '#';
    const clean = handle.replace('@', '').trim();
    if (clean.startsWith('http')) return clean;
    return `https://instagram.com/${clean}`;
  };

  // Countdown timer calculation
  const targetDate = new Date(invitation.weddingDate || '2026-12-12').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Reliable Audio control with fallback
  const getAudioSourceUrl = () => {
    return (
      invitation.music?.audioUrl ||
      'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    );
  };

  // Live song update when user picks a different song in Visual Editor preview or adjusts music start time
  useEffect(() => {
    const audioUrl = getAudioSourceUrl();
    const startTime = designSchema?.musicStartTime || 0;
    if (audioRef.current) {
      const currentSrc = audioRef.current.src;
      const isSame = currentSrc === audioUrl || currentSrc.endsWith(audioUrl);
      if (!isSame) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        if (startTime > 0) audioRef.current.currentTime = startTime;
        audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
      } else if (startTime > 0 && Math.abs(audioRef.current.currentTime - startTime) > 2) {
        audioRef.current.currentTime = startTime;
      }
    } else if (isOpen) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
      if (startTime > 0) audioRef.current.currentTime = startTime;
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }
  }, [invitation.music?.audioUrl, invitation.music?.id, designSchema?.musicStartTime]);

  // 60FPS Smooth Auto-scroll Engine using requestAnimationFrame
  useEffect(() => {
    if (!isAutoScrolling || !isOpen) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    let speedPx = 1.0;
    if (scrollSpeed === 'slow') speedPx = 0.6;
    if (scrollSpeed === 'fast') speedPx = 1.8;

    const scrollStep = () => {
      const currentScroll = window.scrollY || window.pageYOffset;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScroll >= maxScroll - 4) {
        setIsAutoScrolling(false);
        return;
      }

      window.scrollBy(0, speedPx);
      animFrameIdRef.current = requestAnimationFrame(scrollStep);
    };

    animFrameIdRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAutoScrolling, isOpen, scrollSpeed]);

  // Pause Auto Scroll when user manually interacts (wheel / touchstart)
  useEffect(() => {
    if (!isAutoScrolling) return;

    const handleUserInteraction = () => {
      setIsAutoScrolling(false);
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isAutoScrolling]);

  const handleOpenInvitation = () => {
    setIsOpen(true);
    setIsAutoScrolling(true);
    const audioUrl = getAudioSourceUrl();
    const startTime = designSchema?.musicStartTime || 0;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    } else if (audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
    }

    if (startTime > 0 && audioRef.current.currentTime < 1) {
      audioRef.current.currentTime = startTime;
    }

    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlayingMusic(true);
        })
        .catch((err) => {
          console.warn('Initial play error, retrying playback:', err);
          if (audioRef.current) {
            audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
          }
        });
    }
  };

  const toggleMusic = () => {
    const audioUrl = getAudioSourceUrl();
    const startTime = designSchema?.musicStartTime || 0;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.loop = true;
      audioRef.current.preload = 'auto';
    }

    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      if (startTime > 0 && audioRef.current.currentTime < 1) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current
        .play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {});
    }
  };

  const handleCopyBank = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    setIsSubmittingRsvp(true);

    try {
      if (!isPreview) {
        await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            invitationId: invitation.id,
            guestName: rsvpName,
            status: rsvpStatus,
            guestCount: rsvpCount,
            message: rsvpMessage,
          }),
        });
      }

      setRsvpsList([
        {
          guestName: rsvpName,
          status: rsvpStatus,
          guestCount: rsvpCount,
          message: rsvpMessage,
          createdAt: new Date().toISOString(),
        },
        ...rsvpsList,
      ]);

      setRsvpSuccess(true);
      setRsvpMessage('');
      setTimeout(() => setRsvpSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const getCoverCardBorderRadius = () => {
    if (designSchema?.coverCardCornerShape) {
      return coverCardCornerClass;
    }
    return getCardBorderRadius();
  };

  const getCardBorderRadius = () => {
    if (designSchema?.cardCornerShape) {
      return contentCardCornerClass;
    }
    if (cardStyleClass.includes('islamic-dome')) return 'rounded-t-[80px] rounded-b-3xl';
    if (cardStyleClass.includes('rounded-full-top')) return 'rounded-t-full rounded-b-3xl';
    if (cardStyleClass.includes('traditional-arch')) return 'rounded-t-[60px] rounded-b-2xl';
    if (cardStyleClass.includes('sharp-minimal')) return 'rounded-lg';
    return 'rounded-3xl';
  };

  const backgroundSilhouettePhoto = (designSchema as any)?.silhouetteImageUrl || invitation.coverPhoto || theme.bgImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600';
  const silhouetteStyle = designSchema?.backgroundSilhouetteStyle || 'full';

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden text-slate-100 bg-cover bg-center bg-fixed transition-colors duration-500"
      style={{
        backgroundColor: theme.background || '#0F172A',
        backgroundImage: theme.bgImage ? `url(${theme.bgImage})` : undefined,
        fontFamily: `'${fonts.body || 'Montserrat'}', sans-serif`,
      }}
    >
      {/* Base Background Overlay */}
      {theme.bgImage && (
        <div
          className="absolute inset-0 bg-slate-950/75 pointer-events-none z-0 backdrop-blur-[2px]"
          style={{ opacity: theme.bgOverlayOpacity ?? 0.75 }}
        />
      )}

      {/* Dynamic Canvas Background Pattern Texture Overlay */}
      {canvasPatternOverlay && (
        <div className={`fixed inset-0 pointer-events-none z-0 ${canvasPatternOverlay}`} />
      )}

      {/* DYNAMIC PREWEDDING BACKGROUND SILHOUETTE OVERLAY */}
      {(designSchema?.enableBackgroundSilhouette ?? true) && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Background Video Media (MP4 / WebM) vs Background Photo */}
          {designSchema?.backgroundMediaType === 'video' && (designSchema as any)?.backgroundVideoUrl ? (
            <video
              autoPlay
              loop={designSchema?.enableBackgroundVideoLoop ?? true}
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 filter brightness-[0.95] contrast-[1.05]"
              style={{
                opacity: designSchema?.backgroundSilhouetteOpacity ?? 0.85,
              }}
            >
              <source src={(designSchema as any)?.backgroundVideoUrl} type="video/mp4" />
            </video>
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-[0.9] contrast-[1.1]"
              style={{
                backgroundImage: `url(${backgroundSilhouettePhoto})`,
                opacity: designSchema?.backgroundSilhouetteOpacity ?? 0.85,
              }}
            />
          )}

          {/* Full Dark Silhouette (Default) */}
          {(silhouetteStyle === 'full' || !silhouetteStyle) && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.92) 100%)`,
              }}
            />
          )}

          {/* Full White Light Silhouette */}
          {silhouetteStyle === 'white-light' && (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, rgba(255,255,255,0.88) 0%, rgba(248,250,252,0.7) 50%, rgba(255,255,255,0.92) 100%)`,
              }}
            />
          )}

          {/* Moon Glow Vignette Spotlight Gradient Overlay */}
          {silhouetteStyle === 'vignette' && (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 35%, transparent 10%, rgba(15,23,42,0.5) 50%, ${theme.background || '#0F172A'} 95%)`,
              }}
            />
          )}

          {/* Soft Glow Radial Overlay */}
          {silhouetteStyle === 'soft-glow' && (
            <div
              className="absolute inset-0 backdrop-blur-[1px]"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(201,166,107,0.1) 0%, rgba(15,23,42,0.7) 80%)`,
              }}
            />
          )}

          {/* Linear Edge Dark/Light Vignette Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: silhouetteStyle === 'white-light'
                ? `linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, transparent 25%, transparent 75%, rgba(255,255,255,0.9) 100%)`
                : `linear-gradient(to bottom, rgba(15,23,42,0.7) 0%, transparent 25%, transparent 75%, rgba(15,23,42,0.85) 100%)`,
            }}
          />
        </div>
      )}

      {/* DECORATIVE BACKGROUND WATERMARK TYPOGRAPHY LAYER (SUBTLE & NON-CLUTTERED) */}
      {(designSchema?.enableWatermarkTypography ?? true) && (
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden select-none">
          <span
            className="text-[14rem] sm:text-[20rem] font-bold tracking-tighter opacity-[0.035] transform -rotate-12 whitespace-nowrap animate-floatGentle drop-shadow-sm"
            style={{
              fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive`,
              color: theme.primary || '#C9A66B',
            }}
          >
            {designSchema?.watermarkText || `${getInitialLetter(invitation.groomName, 'A')} & ${getInitialLetter(invitation.brideName, 'S')}`}
          </span>
        </div>
      )}

      {/* Floating Interactive Animations */}
      <FloatingParticleEffects effectType={animationEffect as any} />

      {/* Floating Action Controls (Auto Scroll Ring, Back-to-Top & Music) - Only for standard scroll */}
      {isOpen && (!designSchema?.layoutType || designSchema?.layoutType === 'standard_scroll') && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2">
          {/* Floating Auto Scroll Button with Circular Progress Ring Indicator */}
          <div className="relative w-12 h-12 flex items-center justify-center group">
            {/* SVG Circular Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-md" viewBox="0 0 48 48">
              {/* Background Track Circle */}
              <circle
                cx="24"
                cy="24"
                r="21"
                className="stroke-slate-800/90"
                strokeWidth="3.5"
                fill="none"
              />
              {/* Animated Active Progress Fill Circle */}
              <circle
                cx="24"
                cy="24"
                r="21"
                style={{
                  stroke: theme.primary || '#C9A66B',
                  strokeDasharray: 132,
                  strokeDashoffset: 132 - (132 * scrollProgress) / 100,
                  transition: 'stroke-dashoffset 150ms linear',
                }}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Inner Circular Toggle Button */}
            <button
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`w-9 h-9 rounded-full bg-slate-900/95 shadow-2xl backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform z-10 cursor-pointer ${
                isAutoScrolling ? 'ring-2 ring-gold-400/50' : ''
              }`}
              title={isAutoScrolling ? 'Hentikan Auto Scroll' : 'Mulai Auto Scroll'}
            >
              {isAutoScrolling ? (
                <Pause className="w-4 h-4 text-gold-400 animate-pulse fill-gold-400/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gold-400 group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>

          {/* Back to Top Button (Scroll to Top) - Only appears when scrolling has started */}
          <AnimatePresence>
            {(isAutoScrolling || scrollProgress > 3) && (
              <motion.button
                key="back-to-top"
                initial={{ opacity: 0, scale: 0.5, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                onClick={scrollToTop}
                className="w-9 h-9 rounded-full bg-slate-900/90 text-slate-300 border border-gold-500/30 shadow-xl backdrop-blur-md flex items-center justify-center hover:scale-110 hover:text-gold-400 transition-all cursor-pointer"
                title="Kembali ke Paling Atas"
              >
                <ChevronUp className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Floating Music Control Button */}
          <button
            onClick={toggleMusic}
            className="w-9 h-9 rounded-full bg-slate-900/90 text-gold-400 border border-gold-500/40 shadow-xl backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
            title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4 text-gold-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      )}

      {/* COVER ENVELOPE WITH WAX SEAL OR STANDARD CARD */}
      {!isOpen ? (
        designSchema?.coverStyle === 'wax_seal_envelope' ? (
          <InteractiveWaxSealEnvelope
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            designSchema={designSchema}
          />
        ) : designSchema?.coverStyle === 'gatefold_ribbon' ? (
          <FrenchGatefoldRibbonCover
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            designSchema={designSchema}
          />
        ) : designSchema?.coverStyle === 'minimalist_1' ? (
          <MinimalistCover1
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            designSchema={designSchema}
          />
        ) : designSchema?.coverStyle === 'minimalist_2' ? (
          <MinimalistCover2
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            designSchema={designSchema}
          />
        ) : designSchema?.coverStyle === 'minimalist_3' ? (
          <MinimalistCover3
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            designSchema={designSchema}
          />
        ) : (
          <StandardCoverCard
            invitation={invitation}
            guestName={guestName}
            onOpen={handleOpenInvitation}
            theme={theme}
            fonts={fonts}
            coverCardBg={coverCardBg}
            designSchema={designSchema}
          />
        )
      ) : designSchema?.layoutType === 'story_slides' ? (
        <StorySlidesLayout
          invitation={invitation}
          guestName={guestName}
          theme={theme}
          fonts={fonts}
          isPlayingMusic={isPlayingMusic}
          toggleMusic={toggleMusic}
          rsvpsList={rsvpsList}
          onRsvpSubmit={handleSubmitRsvp}
          rsvpName={rsvpName}
          setRsvpName={setRsvpName}
          rsvpStatus={rsvpStatus}
          setRsvpStatus={setRsvpStatus}
          rsvpCount={rsvpCount}
          setRsvpCount={setRsvpCount}
          rsvpMessage={rsvpMessage}
          setRsvpMessage={setRsvpMessage}
          isSubmittingRsvp={isSubmittingRsvp}
          rsvpSuccess={rsvpSuccess}
          youtubeEmbedUrl={youtubeEmbedUrl}
          activeLightboxIndex={activeLightboxIndex}
          setActiveLightboxIndex={setActiveLightboxIndex}
        />
      ) : designSchema?.layoutType === 'magazine_editorial' ? (
        <div className="relative z-10">
          <MagazineEditorialLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === 'cinematic_trailer' ? (
        <div className="relative z-10">
          <CinematicTrailerLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === '3d_flipbook' ? (
        <div className="relative z-10">
          <RealisticFlipbookLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === 'horizontal_gallery' ? (
        <div className="relative z-10">
          <HorizontalGalleryLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === 'isometric_map' ? (
        <div className="relative z-10">
          <IsometricMiniWorldLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === 'radial_constellation' ? (
        <div className="relative z-10">
          <RadialConstellationLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : designSchema?.layoutType === 'metro_express' ? (
        <div className="relative z-10">
          <MetroLoveExpressLayout
            invitation={invitation}
            guestName={guestName}
            theme={theme}
            fonts={fonts}
            isPlayingMusic={isPlayingMusic}
            toggleMusic={toggleMusic}
            rsvpsList={rsvpsList}
            onRsvpSubmit={handleSubmitRsvp}
            rsvpName={rsvpName}
            setRsvpName={setRsvpName}
            rsvpStatus={rsvpStatus}
            setRsvpStatus={setRsvpStatus}
            rsvpCount={rsvpCount}
            setRsvpCount={setRsvpCount}
            rsvpMessage={rsvpMessage}
            setRsvpMessage={setRsvpMessage}
            isSubmittingRsvp={isSubmittingRsvp}
            rsvpSuccess={rsvpSuccess}
            youtubeEmbedUrl={youtubeEmbedUrl}
            activeLightboxIndex={activeLightboxIndex}
            setActiveLightboxIndex={setActiveLightboxIndex}
          />
        </div>
      ) : (
        /* MAIN INVITATION WEBPAGE CONTENT WITH SCROLL REVEAL ANIMATIONS */
        <div className="space-y-20 pb-28 animate-fadeIn relative z-10">
          {/* HERO SECTION */}
          <section id="section-hero" className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="space-y-6 z-10 max-w-md">
              <span
                className="text-3xl sm:text-4xl italic block text-gold-300 font-normal drop-shadow-md"
                style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}
              >
                The Wedding of
              </span>

              {/* Glowing Couple Photo Frame with Matching Border Radius */}
              <div className={`${frameStyle.container} mx-auto p-1.5 bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 shadow-2xl shadow-gold-500/20 relative group overflow-hidden`}>
                <div className={`w-full h-full overflow-hidden border-2 border-slate-900 bg-slate-950 ${frameStyle.image}`}>
                  <img
                    src={invitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'}
                    alt="Couple Hero"
                    className={`w-full h-full group-hover:scale-105 transition-transform duration-700 ${frameStyle.image}`}
                    style={getObjectPositionStyle(designSchema?.photoPosition)}
                  />
                </div>
              </div>

              <h1
                className="text-3xl sm:text-5xl font-bold tracking-wide leading-snug drop-shadow-xl"
                style={{
                  fontFamily: `'${fonts.heading || 'Great Vibes'}', cursive, serif`,
                  color: textPrimaryColor,
                  textShadow: '0 4px 16px rgba(0,0,0,0.95), 0 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                {getCleanName(invitation.groomName)}
                <span className="block text-2xl font-normal my-1 text-rose-300 italic" style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}>&</span>
                {getCleanName(invitation.brideName)}
              </h1>

              <p
                className="text-xs sm:text-sm font-bold tracking-wide text-slate-200 drop-shadow"
                style={{ fontFamily: `'${fonts.body || 'Montserrat'}', sans-serif` }}
              >
                {new Date(invitation.weddingDate).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="absolute bottom-6 animate-bounce text-slate-400">
              <ChevronDown className="w-6 h-6" />
            </div>
          </section>

          {/* QUOTE SECTION */}
          {invitation.quoteText && (
            <ScrollReveal direction="up">
              <section className="px-6 max-w-md mx-auto text-center space-y-3">
                <div
                  className={`p-6 space-y-3 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                  style={{ backgroundColor: contentCardBg }}
                >
                  <Sparkles className="w-5 h-5 mx-auto" style={{ color: theme.primary }} />
                  <p className="italic text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                    "{invitation.quoteText}"
                  </p>
                  {invitation.quoteSource && (
                    <span className="font-bold text-[11px] block" style={{ color: theme.primary }}>
                      — {invitation.quoteSource}
                    </span>
                  )}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* COUPLE PROFILES SECTION WITH MATCHING PHOTO FRAME SHAPES */}
          <section id="section-couple" className="px-6 max-w-md mx-auto space-y-8 text-center">
            <ScrollReveal direction="up">
              <div className="space-y-2">
                <RenderOrnamentDivider />
                <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                  Mempelai Pernikahan
                </h2>
                <p className="text-xs" style={{ color: theme.textSecondary }}>
                  Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                </p>
              </div>
            </ScrollReveal>

            {designSchema?.couplePhotoStyle === 'polaroid' ? (
              <PolaroidPhotos invitation={invitation} theme={theme} fonts={fonts} />
            ) : designSchema?.couplePhotoStyle === 'arch' ? (
              <ArchMoroccanPhotos invitation={invitation} theme={theme} fonts={fonts} />
            ) : (
              <div className="space-y-8">
                {/* Groom Card */}
                <ScrollReveal direction="left" delay={150}>
                  <div
                    className={`p-6 space-y-4 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                    style={{ backgroundColor: contentCardBg }}
                  >
                    <div className={`${frameStyle.container} mx-auto p-1 bg-gradient-to-tr from-gold-500 via-gold-300 to-gold-100 shadow-xl overflow-hidden relative`}>
                      <img
                        src={invitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'}
                        alt={invitation.groomName}
                        className={`w-full h-full ${frameStyle.image}`}
                        style={getObjectPositionStyle(designSchema?.photoPosition)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', cursive, serif`, color: theme.primary }}>
                        {invitation.groomName}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary, fontFamily: `'${fonts.body || 'Montserrat'}', sans-serif` }}>
                        {invitation.groomParents}
                      </p>

                      {/* Instagram Logo Button below parents info matching theme color */}
                      {invitation.groomInstagram && (
                        <div className="pt-2 flex justify-center">
                          <a
                            href={getInstagramUrl(invitation.groomInstagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full border transition-all hover:scale-110 shadow-md inline-flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}15`, borderColor: `${theme.primary}60`, color: theme.primary }}
                            title={`Instagram ${invitation.groomName}`}
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>

                <div className="text-3xl font-normal italic text-rose-300" style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive` }}>&</div>

                {/* Bride Card */}
                <ScrollReveal direction="right" delay={250}>
                  <div
                    className={`p-6 space-y-4 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                    style={{ backgroundColor: contentCardBg }}
                  >
                    <div className={`${frameStyle.container} mx-auto p-1 bg-gradient-to-tr from-gold-500 via-gold-300 to-gold-100 shadow-xl overflow-hidden relative`}>
                      <img
                        src={invitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500'}
                        alt={invitation.brideName}
                        className={`w-full h-full ${frameStyle.image}`}
                        style={getObjectPositionStyle(designSchema?.photoPosition)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-2xl sm:text-3xl font-bold tracking-wide" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', cursive, serif`, color: theme.primary }}>
                        {invitation.brideName}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary, fontFamily: `'${fonts.body || 'Montserrat'}', sans-serif` }}>
                        {invitation.brideParents}
                      </p>

                      {/* Instagram Logo Button below parents info matching theme color */}
                      {invitation.brideInstagram && (
                        <div className="pt-2 flex justify-center">
                          <a
                            href={getInstagramUrl(invitation.brideInstagram)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full border transition-all hover:scale-110 shadow-md inline-flex items-center justify-center"
                            style={{ backgroundColor: `${theme.primary}15`, borderColor: `${theme.primary}60`, color: theme.primary }}
                            title={`Instagram ${invitation.brideName}`}
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}
          </section>

          {/* COUNTDOWN TIMER SECTION */}
          <ScrollReveal direction="zoom">
            <section className="px-6 max-w-md mx-auto text-center space-y-6">
              <div className="space-y-1">
                <RenderOrnamentDivider />
                <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                  Hitung Mundur Acara
                </h2>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Menuju Hari Bahagia Pernikahan Kami</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Hari', value: timeLeft.days },
                  { label: 'Jam', value: timeLeft.hours },
                  { label: 'Menit', value: timeLeft.minutes },
                  { label: 'Detik', value: timeLeft.seconds },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 text-center backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                    style={{ backgroundColor: contentCardBg }}
                  >
                    <span className="text-xl sm:text-2xl font-bold font-mono block" style={{ color: theme.primary }}>
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] uppercase font-medium block" style={{ color: theme.textSecondary }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </ScrollReveal>

          {/* EVENTS & LOCATION SECTION */}
          <section id="section-events" className="px-6 max-w-md mx-auto space-y-6">
            <ScrollReveal direction="up">
              <div className="text-center space-y-1">
                <RenderOrnamentDivider />
                <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                  Rangkaian Acara & Lokasi
                </h2>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Insya Allah Acara Akan Diselenggarakan Pada:</p>
              </div>
            </ScrollReveal>

            {designSchema?.eventStyle === 'boarding_pass' ? (
              <BoardingPassEvent events={eventsList} invitation={invitation} theme={theme} fonts={fonts} />
            ) : designSchema?.eventStyle === 'mini_calendar' ? (
              <div className="space-y-6">
                <MiniCalendarEvent weddingDate={invitation.weddingDate} theme={theme} fonts={fonts} />
                <div className="space-y-4">
                  {eventsList.map((event, idx) => (
                    <div
                      key={idx}
                      className={`p-4 space-y-2 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                      style={{ backgroundColor: contentCardBg }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase font-mono px-2.5 py-0.5 rounded bg-slate-900/60" style={{ color: theme.primary }}>
                          {event.title}
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: theme.textSecondary }}>{event.startTime} - {event.endTime}</span>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: textPrimaryColor }}>{event.venueName}</p>
                      <p className="text-[11px]" style={{ color: theme.textSecondary }}>{event.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {eventsList.map((event, idx) => (
                  <ScrollReveal key={idx} direction="up" delay={idx * 150}>
                    <div
                      className={`p-6 space-y-4 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                      style={{ backgroundColor: contentCardBg }}
                    >
                      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${theme.primary}20` }}>
                        <span className="font-bold text-xs uppercase font-mono px-3 py-1 rounded-full bg-slate-900/60" style={{ color: theme.primary }}>
                          {event.title}
                        </span>
                        <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2.5">
                          <Clock className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
                          <div>
                            <span className="font-bold block" style={{ color: textPrimaryColor }}>
                              {event.startTime} - {event.endTime}
                            </span>
                            <span className="text-[11px]" style={{ color: theme.textSecondary }}>
                              {new Date(event.date).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 pt-2">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
                          <div>
                            <span className="font-bold block" style={{ color: textPrimaryColor }}>
                              {event.venueName}
                            </span>
                            <span className="text-[11px] leading-relaxed block" style={{ color: theme.textSecondary }}>
                              {event.address}
                            </span>
                          </div>
                        </div>
                      </div>

                      {event.googleMapsUrl && (
                        <a
                          href={event.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-slate-950 transition-all shadow-md mt-2"
                          style={{ backgroundColor: theme.primary }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Buka Lokasi Google Maps</span>
                        </a>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>

          {/* LOVE STORY TIMELINE SECTION */}
          {loveStoryList.length > 0 && (
            <section className="px-6 max-w-md mx-auto space-y-6">
              <ScrollReveal direction="up">
                <div className="text-center space-y-1">
                  <RenderOrnamentDivider />
                  <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                    Cerita Cinta Kami
                  </h2>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Jejak Perjalanan Cinta Kami</p>
                </div>
              </ScrollReveal>

              {designSchema?.loveStoryStyle === 'chat_message' ? (
                <ChatMessageLoveStory loveStory={loveStoryList} invitation={invitation} theme={theme} fonts={fonts} />
              ) : designSchema?.loveStoryStyle === 'metro_map' ? (
                <MetroRoadmapLoveStory loveStory={loveStoryList} theme={theme} fonts={fonts} />
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gold-500/20">
                  {loveStoryList.map((story, idx) => (
                    <ScrollReveal key={idx} direction="up" delay={idx * 150}>
                      <div className="flex items-start gap-4 relative pl-2">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border-2 flex items-center justify-center shrink-0 z-10" style={{ borderColor: theme.primary }}>
                          <Heart className="w-4 h-4 fill-gold-400/20" style={{ color: theme.primary }} />
                        </div>
                        <div
                          className={`p-4 ${getCardBorderRadius()} flex-1 space-y-1 backdrop-blur-md ${contentCardBorderClass}`}
                          style={{ backgroundColor: contentCardBg }}
                        >
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-gold-400 inline-block">
                            {story.year}
                          </span>
                          <h4 className="font-bold text-xs" style={{ color: textPrimaryColor }}>{story.title}</h4>
                          <p className="text-[11px] leading-relaxed" style={{ color: theme.textSecondary }}>{story.description}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* GALLERY ALBUM & AUTOPLAY YOUTUBE VIDEO PREWEDDING SECTION */}
          {(galleryList.length > 0 || youtubeEmbedUrl) && (
            <section id="section-gallery" className="px-6 max-w-md mx-auto space-y-6">
              <ScrollReveal direction="up">
                <div className="text-center space-y-1">
                  <RenderOrnamentDivider />
                  <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                    Galeri Foto & Video Prewedding
                  </h2>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Momen Indah Kebersamaan Kami</p>
                </div>
              </ScrollReveal>

              {/* YouTube Autoplay Video Embed */}
              {youtubeEmbedUrl && (
                <ScrollReveal direction="zoom">
                  <div className="w-full aspect-video rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-black relative group">
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Prewedding Video"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </ScrollReveal>
              )}

              {/* Photo Gallery: Film Strip, Masonry, or Classic Grid */}
              {designSchema?.galleryStyle === 'film_strip' ? (
                <FilmStripGallery
                  photos={galleryList}
                  onPhotoClick={(idx) => setActiveLightboxIndex(idx)}
                  theme={theme}
                />
              ) : designSchema?.galleryStyle === 'masonry' ? (
                <MasonryGallery
                  photos={galleryList}
                  onPhotoClick={(idx) => setActiveLightboxIndex(idx)}
                  theme={theme}
                />
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {galleryList.map((photoUrl, idx) => (
                    <ScrollReveal key={idx} direction="zoom" delay={idx * 100}>
                      <div
                        onClick={() => setActiveLightboxIndex(idx)}
                        className="aspect-square rounded-2xl overflow-hidden border border-gold-500/30 cursor-pointer group relative shadow-lg"
                      >
                        <img
                          src={photoUrl}
                          alt={`Galeri ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* RSVP FORM & GUEST MESSAGES */}
          <section id="section-rsvp" className="px-6 max-w-md mx-auto space-y-6">
            <ScrollReveal direction="up">
              <div className="text-center space-y-1">
                <RenderOrnamentDivider />
                <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                  RSVP & Doa Restu
                </h2>
                <p className="text-xs" style={{ color: theme.textSecondary }}>Konfirmasi Kehadiran & Kirimkan Doa Restu Anda</p>
              </div>

              <div
                className={`p-6 space-y-4 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                style={{ backgroundColor: contentCardBg }}
              >
                <form onSubmit={handleSubmitRsvp} className="space-y-4 text-xs">
                  {rsvpSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold">
                      ✓ Konfirmasi Kehadiran & Doa Berhasil Terkirim!
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-[11px]" style={{ color: theme.textSecondary }}>Nama Tamu Undangan</label>
                    <input
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full bg-slate-950/80 border rounded-xl p-3 text-white focus:outline-none"
                      style={{ borderColor: `${theme.primary}40` }}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-[11px]" style={{ color: theme.textSecondary }}>Konfirmasi Kehadiran</label>
                    <select
                      value={rsvpStatus}
                      onChange={(e: any) => setRsvpStatus(e.target.value)}
                      className="w-full bg-slate-950/80 border rounded-xl p-3 text-white focus:outline-none"
                      style={{ borderColor: `${theme.primary}40` }}
                    >
                      <option value="ATTENDING">Ya, Saya Akan Hadir</option>
                      <option value="DECLINED">Maaf, Tidak Bisa Hadir</option>
                      <option value="MAYBE">Masih Ragu-ragu</option>
                    </select>
                  </div>

                  {rsvpStatus === 'ATTENDING' && (
                    <div>
                      <label className="block mb-1 text-[11px]" style={{ color: theme.textSecondary }}>Jumlah Tamu Hadir</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={rsvpCount}
                        onChange={(e) => setRsvpCount(parseInt(e.target.value) || 1)}
                        className="w-full bg-slate-950/80 border rounded-xl p-3 text-white focus:outline-none font-mono"
                        style={{ borderColor: `${theme.primary}40` }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 text-[11px]" style={{ color: theme.textSecondary }}>Ucapan & Doa Restu</label>
                    <textarea
                      rows={3}
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                      className="w-full bg-slate-950/80 border rounded-xl p-3 text-white focus:outline-none text-xs resize-none"
                      style={{ borderColor: `${theme.primary}40` }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingRsvp}
                    className="w-full py-3.5 rounded-xl font-bold text-xs text-slate-950 transition-all shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingRsvp ? 'Sending...' : 'Kirim Konfirmasi & Doa'}</span>
                  </button>
                </form>

                {/* Wishes List */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ucapan & Doa Tamu ({rsvpsList.length})
                  </h3>
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {rsvpsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span style={{ color: theme.primary }}>{item.guestName}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                            {item.status === 'ATTENDING' ? 'Hadir' : 'Absen'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{item.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* DIGITAL GIFTS & QRIS SECTION */}
          {giftsList.length > 0 && (
            <ScrollReveal direction="up">
              <section className="px-6 max-w-md mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <RenderOrnamentDivider />
                  <h2 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.heading || 'Great Vibes'}', serif`, color: textPrimaryColor }}>
                    Kado Digital & Angpau
                  </h2>
                  <p className="text-xs" style={{ color: theme.textSecondary }}>Doa Restu Anda Adalah Karunia Terindah Bagi Kami</p>
                </div>

                <div className="space-y-4">
                  {giftsList.map((gift, idx) => (
                    <div
                      key={idx}
                      className={`p-5 space-y-3 backdrop-blur-md ${getCardBorderRadius()} ${contentCardBorderClass}`}
                      style={{ backgroundColor: contentCardBg }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs uppercase" style={{ color: theme.primary }}>
                          {gift.bankName}
                        </span>
                        <Gift className="w-4 h-4" style={{ color: theme.primary }} />
                      </div>

                      {gift.accountNumber && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase text-slate-400 block">Nomor Rekening:</span>
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                            <span className="font-mono text-sm font-bold text-gold-400">{gift.accountNumber}</span>
                            <button
                              onClick={() => handleCopyBank(gift.accountNumber!, idx)}
                              className="px-3 py-1 rounded-lg bg-gold-500/20 text-gold-300 text-xs font-bold flex items-center gap-1 hover:bg-gold-500 hover:text-slate-950 transition-all"
                            >
                              {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
                            </button>
                          </div>
                          <span className="text-[11px] block pt-1" style={{ color: theme.textSecondary }}>
                            a.n. {gift.accountName}
                          </span>
                        </div>
                      )}

                      {gift.shippingAddress && (
                        <div className="space-y-1 pt-1 border-t border-slate-800">
                          <span className="text-[10px] uppercase text-slate-400 block">Alamat Pengiriman Kado Fisik:</span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                            {gift.shippingAddress}
                          </p>
                          <button
                            onClick={() => handleCopyBank(gift.shippingAddress!, idx + 100)}
                            className="w-full mt-2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-gold-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                          >
                            {copiedIndex === (idx + 100) ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedIndex === (idx + 100) ? 'Alamat Tersalin!' : 'Salin Alamat Fisik'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}

          {/* FOOTER THANK YOU */}
          <ScrollReveal direction="fade">
            <footer className="text-center space-y-3 px-6 pt-10 border-t border-slate-800/80 max-w-md mx-auto">
              <h3 className="text-2xl font-bold" style={{ fontFamily: `'${fonts.accent || 'Great Vibes'}', cursive`, color: theme.primary }}>
                Terima Kasih
              </h3>
              <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: theme.textSecondary }}>
                Merupakan Suatu Kehormatan & Kebahagiaan Bagi Kami Apabila Bapak/Ibu/Saudara/i Berkenan Hadir dan Memberikan Doa Restu.
              </p>
              <div className="pt-4 text-[10px] text-slate-600 font-mono">
                Powered by Weddora AI VIP • Wedding Invitation
              </div>
            </footer>
          </ScrollReveal>

          {/* FLOATING BOTTOM DOCK NAVIGATION */}
          {designSchema?.navigationStyle !== 'none' && (
            <BottomDockNav theme={theme} />
          )}
        </div>
      )}

      {/* FULL-SCREEN IMAGE LIGHTBOX CAROUSEL MODAL WITH PREV / NEXT */}
      {activeLightboxIndex !== null && galleryList[activeLightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Top Bar with Counter & Close */}
          <div className="w-full max-w-4xl flex items-center justify-between z-50 pt-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs font-mono font-bold text-gold-400 px-3 py-1.5 rounded-full bg-slate-900/80 border border-gold-500/30">
              Foto {activeLightboxIndex + 1} dari {galleryList.length}
            </span>
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2.5 rounded-full bg-slate-900/90 text-white hover:bg-gold-500 hover:text-slate-950 transition-colors border border-slate-700 shadow-2xl"
              title="Tutup (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Photo Display with Navigation Arrows */}
          <div className="relative flex-1 w-full max-w-4xl flex items-center justify-center py-4" onClick={(e) => e.stopPropagation()}>
            {/* Prev Arrow */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-4 z-50 p-3 rounded-full bg-slate-900/80 text-gold-400 hover:bg-gold-500 hover:text-slate-950 transition-all border border-gold-500/40 shadow-2xl hover:scale-110"
              title="Foto Sebelumnya (Kiri)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo Image */}
            <img
              src={galleryList[activeLightboxIndex]}
              alt={`Galeri ${activeLightboxIndex + 1}`}
              className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl object-contain border-2 border-gold-500/40 transition-all duration-300"
            />

            {/* Next Arrow */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-4 z-50 p-3 rounded-full bg-slate-900/80 text-gold-400 hover:bg-gold-500 hover:text-slate-950 transition-all border border-gold-500/40 shadow-2xl hover:scale-110"
              title="Foto Selanjutnya (Kanan)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Bar */}
          <div className="w-full max-w-md overflow-x-auto flex items-center justify-center gap-2 pb-2 z-50" onClick={(e) => e.stopPropagation()}>
            {galleryList.map((photoUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLightboxIndex(idx)}
                className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeLightboxIndex === idx ? 'border-gold-500 scale-110 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={photoUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
