'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileDeviceFrame } from './MobileDeviceFrame';
import { AiAssistantModal } from './AiAssistantModal';
import { RenderInvitationView } from '@/components/invitation/RenderInvitationView';
import { getCleanName, getInitialLetter, getAudioDurationFromFile, getDurationInSeconds, probeAudioDuration } from '@/utils/nameUtils';
import { DesignSchema, DigitalGiftItem, EventItem, LoveStoryItem } from '@/types/wedding';
import { useTheme } from '@/context/ThemeContext';
import { LIGHT_THEME_PRESETS, DARK_THEME_PRESETS, isLightTheme } from '@/utils/themeUtils';
import {
  Save,
  Globe,
  Sparkles,
  User,
  Palette,
  Crown,
  Mail,
  Layers,
  Music,
  MapPin,
  Gift,
  Eye,
  CheckCircle,
  ArrowLeft,
  Upload,
  Clock,
  Image as ImageIcon,
  Heart,
  Plus,
  Trash2,
  Sun,
  Moon,
  Instagram,
  Video,
  Play,
  Type,
  Camera,
  Film,
  PlayCircle,
  ArrowDownCircle,
  LayoutTemplate,
  Smartphone,
  MailOpen,
  Ticket,
  CalendarDays,
  Compass,
  MessageCircle,
} from 'lucide-react';

interface VisualEditorProps {
  initialInvitation: any;
  musicList: any[];
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  initialInvitation,
  musicList,
}) => {
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const isLight = mode === 'light';

  // Active Tab: 'couple' | 'theme' | 'story' | 'photos' | 'music' | 'events' | 'gifts'
  const [activeTab, setActiveTab] = useState<string>('couple');
  const [deviceType, setDeviceType] = useState<'iphone' | 'android' | 'desktop'>('iphone');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Assistant Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Music & Photo Upload States
  const [localMusicList, setLocalMusicList] = useState<any[]>(musicList);
  const [detectedDurations, setDetectedDurations] = React.useState<Record<string, { durationStr: string; totalSeconds: number }>>({});
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Invitation Form State
  const [groomName, setGroomName] = useState(initialInvitation.groomName || 'Andi Pratama, S.T.');
  const [groomParents, setGroomParents] = useState(initialInvitation.groomParents || 'Putra dari Bapak H. Budi Santoso & Ibu Hj. Ani Wijaya');
  const [groomPhoto, setGroomPhoto] = useState(initialInvitation.groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500');
  const [groomInstagram, setGroomInstagram] = useState(initialInvitation.groomInstagram || '@andipratama');
  
  const [brideName, setBrideName] = useState(initialInvitation.brideName || 'Sinta Nurhaliza, S.Ked.');
  const [brideParents, setBrideParents] = useState(initialInvitation.brideParents || 'Putri dari Bapak Dr. H. Rahmad Hidayat & Ibu Hj. Siti Aminah');
  const [bridePhoto, setBridePhoto] = useState(initialInvitation.bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500');
  const [brideInstagram, setBrideInstagram] = useState(initialInvitation.brideInstagram || '@sintanurhaliza');

  const [coverPhoto, setCoverPhoto] = useState(initialInvitation.coverPhoto || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200');
  const [youtubeUrl, setYoutubeUrl] = useState(initialInvitation.youtubeUrl || 'https://www.youtube.com/watch?v=-ARVwU58l7A');
  const [weddingDate, setWeddingDate] = useState(initialInvitation.weddingDate ? new Date(initialInvitation.weddingDate).toISOString().split('T')[0] : '2026-12-12');
  const [quoteText, setQuoteText] = useState(initialInvitation.quoteText || '');
  const [quoteSource, setQuoteSource] = useState(initialInvitation.quoteSource || '');
  const [selectedMusicId, setSelectedMusicId] = useState(initialInvitation.musicId || (musicList[0]?.id || ''));

  // Probe real audio duration for all tracks
  React.useEffect(() => {
    localMusicList.forEach((m) => {
      if (m.audioUrl && (!detectedDurations[m.id] || detectedDurations[m.id].durationStr === '3:30')) {
        probeAudioDuration(m.audioUrl).then((info) => {
          if (info.totalSeconds > 0) {
            setDetectedDurations((prev) => ({
              ...prev,
              [m.id]: info,
            }));
          }
        });
      }
    });
  }, [localMusicList, selectedMusicId]);

  // Love Story & Photo Gallery Lists
  const [loveStory, setLoveStory] = useState<LoveStoryItem[]>(() => {
    try {
      return JSON.parse(initialInvitation.loveStory || '[]');
    } catch {
      return [
        { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat seminar.' },
        { year: '2025', title: 'Acara Lamaran', description: 'Keluarga besar saling melamar.' },
      ];
    }
  });

  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(() => {
    try {
      return JSON.parse(initialInvitation.galleryPhotos || '[]');
    } catch {
      return [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      ];
    }
  });

  // Parse Design Config JSON
  const [designSchema, setDesignSchema] = useState<DesignSchema>(() => {
    try {
      return typeof initialInvitation.designConfig === 'string'
        ? JSON.parse(initialInvitation.designConfig)
        : initialInvitation.designConfig;
    } catch (e) {
      return {
        theme: {
          primary: '#C9A66B',
          secondary: '#E6D3A9',
          background: '#0F172A',
          bgImage: '',
          bgOverlayOpacity: 0.75,
          cardBg: '#1E293B',
          textPrimary: '#F8FAFC',
          textSecondary: '#94A3B8',
          accent: '#D7BA7D',
        },
        fonts: {
          heading: 'Cinzel Decorative',
          body: 'Montserrat',
          accent: 'Great Vibes',
        },
        ornament: 'gold-ornament',
        animation: 'sparkles',
        sections: [
          { id: 'cover', title: 'Cover Undangan', visible: true, order: 1 },
          { id: 'quote', title: 'Ayat / Kutipan', visible: true, order: 2 },
          { id: 'couple', title: 'Mempelai', visible: true, order: 3 },
          { id: 'countdown', title: 'Hitung Mundur', visible: true, order: 4 },
          { id: 'events', title: 'Acara & Peta', visible: true, order: 5 },
          { id: 'story', title: 'Cerita Cinta', visible: true, order: 6 },
          { id: 'gallery', title: 'Galeri Foto', visible: true, order: 7 },
          { id: 'rsvp', title: 'RSVP & Ucapan', visible: true, order: 8 },
          { id: 'gift', title: 'Kado Digital / QRIS', visible: true, order: 9 },
        ],
      };
    }
  });

  // Theme Light/Dark & Preset Tab State
  const isCurrentDesignLight = isLightTheme(designSchema.theme, designSchema);
  const [presetTab, setPresetTab] = useState<'light' | 'dark'>(() => isCurrentDesignLight ? 'light' : 'dark');

  // Events & Gifts State
  const [events, setEvents] = useState<EventItem[]>(() => {
    if (initialInvitation.events && initialInvitation.events.length > 0) {
      return initialInvitation.events;
    }
    return [
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
  });

  const [digitalGifts, setDigitalGifts] = useState<DigitalGiftItem[]>(() => {
    try {
      return JSON.parse(initialInvitation.digitalGifts || '[]');
    } catch {
      return [
        { bankName: 'Bank BCA', accountName: 'Andi Pratama', accountNumber: '8401928371' },
        { bankName: 'Bank Mandiri', accountName: 'Sinta Nurhaliza', accountNumber: '1270009823411' },
        { bankName: 'Alamat Kado Fisik', accountName: 'Andi & Sinta', shippingAddress: 'Jl. M.H. Thamrin No. 1, Menteng, Jakarta Pusat (Penerima: Andi Pratama)' },
      ];
    }
  });

  const currentMusicObj = localMusicList.find((m) => m.id === selectedMusicId) || localMusicList[0];

  const liveInvitationData = {
    ...initialInvitation,
    groomName,
    groomParents,
    groomPhoto,
    groomInstagram,
    brideName,
    brideParents,
    bridePhoto,
    brideInstagram,
    coverPhoto,
    youtubeUrl,
    weddingDate,
    quoteText,
    quoteSource,
    loveStory: JSON.stringify(loveStory),
    galleryPhotos: JSON.stringify(galleryPhotos),
    designConfig: designSchema,
    music: currentMusicObj,
    events,
    digitalGifts: JSON.stringify(digitalGifts),
  };

  React.useEffect(() => {
    if (initialInvitation?.slug && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (!currentPath.endsWith(`/${initialInvitation.slug}`)) {
        window.history.replaceState(null, '', `/editor/${initialInvitation.slug}`);
      }
    }
  }, [initialInvitation?.slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (
        initialInvitation?.isMasterTemplate ||
        String(initialInvitation?.id).startsWith('template-') ||
        initialInvitation?.masterTemplateId
      ) {
        const targetMasterId =
          initialInvitation.masterTemplateId ||
          String(initialInvitation.id).replace(/^template-/, '');

        const masterRes = await fetch('/api/admin/templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: targetMasterId,
            designSchema: designSchema,
            previewImage: coverPhoto,
          }),
        });

        if (masterRes.ok) {
          setSaveSuccess(true);
          router.refresh();
          setTimeout(() => setSaveSuccess(false), 3000);
          return;
        } else {
          const errData = await masterRes.json();
          alert(`Gagal menyimpan template master: ${errData.error || 'Terjadi kesalahan'}`);
          return;
        }
      }

      const res = await fetch(`/api/invitations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: initialInvitation.id,
          groomName,
          groomParents,
          groomPhoto,
          groomInstagram,
          brideName,
          brideParents,
          bridePhoto,
          brideInstagram,
          coverPhoto,
          youtubeUrl,
          weddingDate,
          quoteText,
          quoteSource,
          musicId: selectedMusicId,
          loveStory: loveStory,
          galleryPhotos: galleryPhotos,
          designConfig: designSchema,
          events,
          digitalGifts: digitalGifts,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMusic(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        const musicTitle = file.name.replace(/\.[^/.]+$/, '');
        const realDuration = await getAudioDurationFromFile(file);

        // Save track to database so it gets a valid musicId
        const dbRes = await fetch('/api/admin/music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: musicTitle,
            artist: 'File MP3 Custom',
            audioUrl: data.url,
            duration: realDuration,
            genre: 'Custom Audio',
            isRoyaltyFree: true,
          }),
        });

        const createdTrack = await dbRes.json();
        const finalMusic = createdTrack.id ? createdTrack : {
          id: `custom-${Date.now()}`,
          title: musicTitle,
          artist: 'File MP3 Saya',
          genre: 'Custom Audio',
          duration: realDuration,
          audioUrl: data.url,
        };

        setLocalMusicList([finalMusic, ...localMusicList]);
        setSelectedMusicId(finalMusic.id);
      }
    } catch (err) {
      console.error('Audio Upload Error:', err);
    } finally {
      setIsUploadingMusic(false);
    }
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onSuccess(data.url);
      }
    } catch (err) {
      console.error('Photo Upload Error:', err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setDesignSchema({
          ...designSchema,
          backgroundMediaType: 'video',
          backgroundVideoUrl: data.url,
        });
      }
    } catch (err) {
      console.error('Video Upload Error:', err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col font-sans select-none ${
      isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      {/* Top Main Navigation Bar Header */}
      <header className={`px-4 py-3 border-b flex items-center justify-between shrink-0 z-30 ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold flex items-center gap-1.5">
              <span>{initialInvitation.title || 'Studio Visual Editor'}</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono block">
              {initialInvitation?.isMasterTemplate ? 'Mode Master Template Administrator' : `Slug URL: /${initialInvitation.slug}`}
            </span>
          </div>
        </div>

        {/* CENTER DEVICE PREVIEW SELECTOR TOGGLE BUTTONS */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => setDeviceType('iphone')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              deviceType === 'iphone' ? 'bg-gold-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan iPhone 15 Pro"
          >
            <span>📱 iPhone 15 Pro</span>
          </button>
          <button
            onClick={() => setDeviceType('android')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              deviceType === 'android' ? 'bg-gold-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Android / Samsung"
          >
            <span>📱 Android</span>
          </button>
          <button
            onClick={() => setDeviceType('desktop')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              deviceType === 'desktop' ? 'bg-gold-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
            title="Tampilan Website Mode"
          >
            <span>🖥️ Mode Website</span>
          </button>
          <a
            href={initialInvitation?.isMasterTemplate ? `/demo/${initialInvitation.slug}` : `/${initialInvitation.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-300 hover:text-gold-400 transition-colors flex items-center gap-1 border border-slate-700 hover:border-gold-500/40"
            title="Buka Halaman Live Demo"
          >
            <Globe className="w-3.5 h-3.5 text-gold-400" />
            <span>{initialInvitation?.isMasterTemplate ? `Buka Demo (/demo/${initialInvitation.slug})` : 'Buka Web Demo'}</span>
          </a>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-100 border-slate-200 text-amber-600' : 'bg-slate-800 border-slate-700 text-gold-400'
            }`}
            title="Toggle Light / Dark Mode"
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3 py-1.5 rounded-xl gold-shimmer-btn text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Design Engine</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>{isSaving ? 'Menyimpan...' : saveSuccess ? '✓ Tersimpan!' : initialInvitation.isMasterTemplate ? '👑 Simpan Perubahan Master' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </header>

      {/* MASTER TEMPLATE ADMIN NOTICE BAR */}
      {initialInvitation?.isMasterTemplate && (
        <div className="bg-amber-500/20 border-b border-gold-500/50 px-4 py-2 text-center text-xs font-bold text-gold-300 flex items-center justify-center gap-2 shrink-0">
          <Crown className="w-4 h-4 text-gold-400 shrink-0" />
          <span>MODE ADMIN MASTER TEMPLATE: Perubahan desain yang Anda simpan di sini akan otomatis memperbarui tampilan template asli di seluruh website & halaman demo.</span>
        </div>
      )}

      {/* Main Workspace Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Sidebar Panel */}
        <div className={`w-full md:w-[440px] border-r flex flex-col shrink-0 z-20 transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
        }`}>
          {/* Navigation Control Tabs Header */}
          <div className={`p-2 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <button
              onClick={() => setActiveTab('couple')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'couple' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Pengantin
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'layout' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-gold-400" />
              Interaksi & Layout
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'theme' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Font & Background
            </button>
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'canvas' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-gold-400" />
              Tema & Bentuk
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'story' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Story
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'photos' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Galeri & Video
            </button>
            <button
              onClick={() => setActiveTab('music')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'music' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              Musik MP3
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'events' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Acara
            </button>
            <button
              onClick={() => setActiveTab('gifts')}
              className={`px-3 py-2 rounded-lg font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                activeTab === 'gifts' ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Gift
            </button>
          </div>

          {/* Editor Form Controls Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* TAB: INTERAKSI & PARADIGMA LAYOUT */}
            {activeTab === 'layout' && (
              <div className="space-y-6">
                <div>
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Paradigma Navigasi & Bentuk Komponen
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ubah total model navigasi layar dan bentuk interaksi komponen undangan Anda.
                  </p>
                </div>

                {/* 1. LAYOUT PARADIGM */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <LayoutTemplate className="w-3.5 h-3.5" />
                    1. Model Navigasi Layar (Interaction Paradigm)
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {[
                      {
                        id: 'standard_scroll',
                        title: '📜 Standar Scroll Vertikal',
                        desc: 'Tamu melakukan scroll dari atas ke bawah secara mulus dengan animasi ScrollReveal.',
                      },
                      {
                        id: 'story_slides',
                        title: '📱 Story / Swipe Card (Instagram / TikTok Style)',
                        desc: 'Tampilan layar penuh (100vh) per topik dengan bilah progress bar di atas dan navigasi tap/swipe.',
                      },
                      {
                        id: 'magazine_editorial',
                        title: '📰 Magazine / Editorial Layout (Vogue Style)',
                        desc: 'Layout asimetris bergaya majalah fesyen dengan tipografi tebal, kartu bertumpuk, dan white space elegan.',
                      },
                      {
                        id: 'cinematic_trailer',
                        title: '🎬 Cinematic / Movie Trailer (Netflix Style)',
                        desc: 'Tampilan bioskop layar lebar dengan billboard hero 21:9, pemeran bintang (Cast & Crew), jadwal ala episode rilis, dan tiket premiere VIP.',
                      },
                      {
                        id: '3d_flipbook',
                        title: '📖 Realistic 3D Flipbook / Scrapbook Fisik',
                        desc: 'Buku kenangan fisik dengan fisika membalik halaman 3D, foto polaroid berselotip washi, bunga kering, dan kartu pos RSVP.',
                      },
                      {
                        id: 'horizontal_gallery',
                        title: '🏛️ Horizontal Art Gallery (Exhibition Walk)',
                        desc: 'Pameran seni privat (Vernissage) dengan scroll menyamping horizontal, lampu sorot museum, bingkai kanvas, dan plakat kurator.',
                      },
                      {
                        id: 'isometric_map',
                        title: '🗺️ Our Journey Love Line Map (Peta Jalur Rute Asmara)',
                        desc: 'Peta rute transit neon rose-gold vertikal ala "Our Journey" dengan foto polaroid selang-seling, stasiun cincin bercahaya, dan pin penanda hati.',
                      },
                      {
                        id: 'radial_constellation',
                        title: '🌌 Radial Constellation Hub (Orbit Bintang Interaktif)',
                        desc: 'Dashboard navigasi radial satu layar penuh dengan Inti Gravitasi Cinta di tengah dan 6 nodus satelit interaktif yang mengitari cincin orbit bintang.',
                      },
                      {
                        id: 'metro_express',
                        title: '🚇 The Metro Love Express (Peta Jalur Kereta Asmara)',
                        desc: 'Peta rute transit modern ala MRT / Tokyo Metro dengan 7 stasiun berurutan, rel bercahaya, tiket transit pass, dan indikator rute LED.',
                      },
                    ].map((opt) => {
                      const isSelected = (designSchema.layoutType || 'standard_scroll') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, layoutType: opt.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{opt.title}</span>
                            {isSelected && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold-400 text-slate-950">Aktif</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. COVER & OPENING STYLE */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <MailOpen className="w-3.5 h-3.5" />
                    2. Model Sampul & Pembuka Undangan
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      {
                        id: 'standard',
                        title: '🎴 Sampul Standar',
                        desc: 'Kartu sampul modern klasik dengan tombol Buka Undangan.',
                      },
                      {
                        id: 'wax_seal_envelope',
                        title: '✉️ Amplop Fisik 3D Wax Seal',
                        desc: 'Amplop surat bersegel lilin timbul 3D dengan animasi flap membuka.',
                      },
                      {
                        id: 'gatefold_ribbon',
                        title: '🎀 French Gatefold Ribbon',
                        desc: 'Pintu lipat beludru mewah dengan simpul pita sutra yang dapat diurai tamu.',
                      },
                      {
                        id: 'minimalist_1',
                        title: '🌿 Minimalis 1 (Top/Bottom Editorial)',
                        desc: 'Foto layar penuh tanpa kartu: judul di atas, nama tamu & tombol pill di bawah (ala Dhanty & Andy).',
                      },
                      {
                        id: 'minimalist_2',
                        title: '🌸 Minimalis 2 (Watercolor Floral)',
                        desc: 'Foto layar penuh dengan aksen ornamen sudut bunga cat air & tipografi romantis (ala Wulan & Brian).',
                      },
                      {
                        id: 'minimalist_3',
                        title: '✨ Minimalis 3 (Modern Fine-Line Frame)',
                        desc: 'Foto layar penuh dengan bingkai garis tipis arsitektural, monogram mengambang & frosted pill button.',
                      },
                    ].map((opt) => {
                      const isSelected = (designSchema.coverStyle || 'standard') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, coverStyle: opt.id as any })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-bold text-xs block">{opt.title}</span>
                          <p className="text-[10px] text-slate-400 mt-1 leading-tight">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. FLOATING BOTTOM DOCK NAVIGATION */}
                <div className={`p-4 border rounded-2xl space-y-2 flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <div>
                    <label className="font-bold text-xs text-slate-200 block">
                      Floating Bottom Dock Navigation Bar
                    </label>
                    <p className="text-[10px] text-slate-400">
                      Menu bar melayang di bawah layar [Beranda | Mempelai | Acara | Galeri | Doa].
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDesignSchema({
                      ...designSchema,
                      navigationStyle: designSchema.navigationStyle === 'none' ? 'bottom_dock' : 'none',
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      designSchema.navigationStyle !== 'none'
                        ? 'bg-gold-400 text-slate-950 border-gold-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {designSchema.navigationStyle !== 'none' ? '● Aktif' : '○ Mati'}
                  </button>
                </div>

                {/* 4. EVENT SECTION STYLE */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <Ticket className="w-3.5 h-3.5" />
                    3. Bentuk Jadwal Acara (Event Format)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Kartu Standar', icon: '📋' },
                      { id: 'boarding_pass', label: 'Tiket Boarding Pass', icon: '🎫' },
                      { id: 'mini_calendar', label: 'Mini Calendar Grid', icon: '📅' },
                    ].map((opt) => {
                      const isSelected = (designSchema.eventStyle || 'standard') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, eventStyle: opt.id as any })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400 font-bold'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-base block">{opt.icon}</span>
                          <span className="text-[11px] block mt-1">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. COUPLE PHOTO STYLE */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <User className="w-3.5 h-3.5" />
                    4. Bentuk Bingkai Foto Mempelai
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'circle', label: 'Bawaan / Klasik', icon: '⚪' },
                      { id: 'polaroid', label: 'Polaroid Miring', icon: '📸' },
                      { id: 'arch', label: 'Moroccan Arch', icon: '🕌' },
                    ].map((opt) => {
                      const isSelected = (designSchema.couplePhotoStyle || 'circle') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, couplePhotoStyle: opt.id as any })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400 font-bold'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-base block">{opt.icon}</span>
                          <span className="text-[11px] block mt-1">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. LOVE STORY STYLE */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    5. Gaya Kisah Cinta (Love Story)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'timeline', label: 'Timeline Garis', icon: '⏳' },
                      { id: 'chat_message', label: 'Chat WhatsApp', icon: '💬' },
                      { id: 'metro_map', label: 'Metro Subway', icon: '🚇' },
                    ].map((opt) => {
                      const isSelected = (designSchema.loveStoryStyle || 'timeline') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, loveStoryStyle: opt.id as any })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400 font-bold'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-base block">{opt.icon}</span>
                          <span className="text-[11px] block mt-1">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. GALLERY STYLE */}
                <div className={`p-4 border rounded-2xl space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                  <label className="font-bold flex items-center gap-1.5 text-xs text-gold-400">
                    <Film className="w-3.5 h-3.5" />
                    6. Gaya Galeri Foto
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'grid', label: 'Grid 2 Kolom', icon: '🖼️' },
                      { id: 'film_strip', label: 'Roll Klise 35mm', icon: '🎞️' },
                      { id: 'masonry', label: 'Masonry Pinterest', icon: '📌' },
                    ].map((opt) => {
                      const isSelected = (designSchema.galleryStyle || 'grid') === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDesignSchema({ ...designSchema, galleryStyle: opt.id as any })}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-gold-500/20 border-gold-500 text-gold-300 ring-1 ring-gold-400 font-bold'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700'
                              : 'bg-slate-900 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-base block">{opt.icon}</span>
                          <span className="text-[11px] block mt-1">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 1: COUPLE, INSTAGRAM & DIRECT PHOTO UPLOAD */}
            {activeTab === 'couple' && (
              <div className="space-y-4">
                <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Data Pengantin, Foto & Link Instagram</h3>
                
                {/* CUSTOM PHOTO SHAPE & CROP CONTROLS */}

                {/* Bingkai Foto & Crop Alignment */}
                <div className={`p-3.5 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-bold text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    Bentuk Bingkai Foto & Potong Fokus (Crop)
                  </label>

                  {/* Photo Shape Buttons */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Model Bentuk Bingkai Foto:</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'circle', label: '⭕ Lingkaran' },
                        { id: 'square', label: '🔳 Kotak (Square)' },
                        { id: 'rectangle', label: '📱 Persegi Panjang' },
                        { id: 'arch', label: '🕌 Kubah (Arch)' },
                        { id: 'oval', label: '🥚 Oval' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              photoShape: s.id as any,
                            })
                          }
                          className={`p-2 rounded-xl border text-[10px] font-bold transition-all ${
                            (designSchema.photoShape || 'circle') === s.id
                              ? 'bg-gold-500/20 border-gold-500 text-gold-500 ring-2 ring-gold-500/30'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-600'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crop Focus Alignment */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1.5">Fokus Potongan Foto (Crop):</span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'object-top', label: '⬆️ Fokus Wajah (Top)' },
                        { id: 'object-center', label: '⏺️ Tengah (Center)' },
                        { id: 'object-bottom', label: '⬇️ Bawah (Bottom)' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              photoPosition: pos.id as any,
                            })
                          }
                          className={`p-2 rounded-xl border text-[10px] font-bold transition-all ${
                            (designSchema.photoPosition || 'object-center') === pos.id
                              ? 'bg-gold-500/20 border-gold-500 text-gold-400 ring-2 ring-gold-500/40 font-black scale-102'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-600 hover:border-gold-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Nama Pria (Groom)</label>
                  <input
                    type="text"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Foto Mempelai Pria</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg border overflow-hidden shrink-0 bg-slate-900 border-slate-700">
                      <img
                        src={groomPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'}
                        alt="Groom Preview"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition:
                            (designSchema.photoPosition as string) === 'object-top'
                              ? 'top center'
                              : (designSchema.photoPosition as string) === 'object-bottom'
                              ? 'bottom center'
                              : 'center center',
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={groomPhoto}
                      onChange={(e) => setGroomPhoto(e.target.value)}
                      className={`flex-1 border rounded-xl p-2.5 font-mono text-[11px] focus:border-gold-500 focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, setGroomPhoto)}
                      className="hidden"
                      id="upload-groom-photo"
                    />
                    <label
                      htmlFor="upload-groom-photo"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-gold-500 hover:text-slate-950 text-slate-200 font-bold text-[11px] cursor-pointer flex items-center gap-1 border border-slate-700 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Orang Tua Pria</label>
                  <input
                    type="text"
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-500" /> Username Instagram Pria
                  </label>
                  <input
                    type="text"
                    value={groomInstagram}
                    onChange={(e) => setGroomInstagram(e.target.value)}
                    placeholder="@andipratama"
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800" />

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Nama Wanita (Bride)</label>
                  <input
                    type="text"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Foto Mempelai Wanita</label>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg border overflow-hidden shrink-0 bg-slate-900 border-slate-700">
                      <img
                        src={bridePhoto || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500'}
                        alt="Bride Preview"
                        className="w-full h-full object-cover"
                        style={{
                          objectPosition:
                            (designSchema.photoPosition as string) === 'object-top'
                              ? 'top center'
                              : (designSchema.photoPosition as string) === 'object-bottom'
                              ? 'bottom center'
                              : 'center center',
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={bridePhoto}
                      onChange={(e) => setBridePhoto(e.target.value)}
                      className={`flex-1 border rounded-xl p-2.5 font-mono text-[11px] focus:border-gold-500 focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, setBridePhoto)}
                      className="hidden"
                      id="upload-bride-photo"
                    />
                    <label
                      htmlFor="upload-bride-photo"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-gold-500 hover:text-slate-950 text-slate-200 font-bold text-[11px] cursor-pointer flex items-center gap-1 border border-slate-700 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Orang Tua Wanita</label>
                  <input
                    type="text"
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-500" /> Username Instagram Wanita
                  </label>
                  <input
                    type="text"
                    value={brideInstagram}
                    onChange={(e) => setBrideInstagram(e.target.value)}
                    placeholder="@sintanurhaliza"
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800" />

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Foto Cover Utama</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coverPhoto}
                      onChange={(e) => setCoverPhoto(e.target.value)}
                      className={`flex-1 border rounded-xl p-2.5 font-mono text-[11px] focus:border-gold-500 focus:outline-none ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, setCoverPhoto)}
                      className="hidden"
                      id="upload-cover-photo"
                    />
                    <label
                      htmlFor="upload-cover-photo"
                      className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-gold-500 hover:text-slate-950 text-slate-200 font-bold text-[11px] cursor-pointer flex items-center gap-1 border border-slate-700"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1">Tanggal Pernikahan Utama</label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: FONT & BACKGROUND */}
            {activeTab === 'theme' && (
              <div className="space-y-5">
                <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Pengaturan Font, Siluet & Latar Belakang (Background)</h3>

                {/* PRESET FONT PAIRINGS (PAKET KOMBINASI FONT SINKRON) */}
                <div className={`p-3.5 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Kombinasi Font Sinkron (Font Pairings)
                  </label>

                  <div className="grid grid-cols-1 gap-2">
                    {[
                      {
                        name: '🌹 Classic Romantic',
                        desc: 'Great Vibes (Mempelai) + Montserrat (Teks)',
                        heading: 'Great Vibes',
                        body: 'Montserrat',
                        accent: 'Great Vibes',
                      },
                      {
                        name: '📰 Editorial & Luxury',
                        desc: 'Cinzel (Judul) + Cormorant Garamond (Teks)',
                        heading: 'Cinzel',
                        body: 'Cormorant Garamond',
                        accent: 'Pinyon Script',
                      },
                      {
                        name: '💫 Modern Minimalist',
                        desc: 'Playfair Display (Header) + Lato (Teks)',
                        heading: 'Playfair Display',
                        body: 'Lato',
                        accent: 'Alex Brush',
                      },
                      {
                        name: '👑 Bangsawan Royal',
                        desc: 'Pinyon Script (Mewah) + Bodoni Moda (Formal)',
                        heading: 'Pinyon Script',
                        body: 'Bodoni Moda',
                        accent: 'Pinyon Script',
                      },
                      {
                        name: '✨ Romantic Soft',
                        desc: 'Alex Brush (Script Lembut) + Raleway (Minimalis)',
                        heading: 'Alex Brush',
                        body: 'Raleway',
                        accent: 'Alex Brush',
                      },
                    ].map((pair, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setDesignSchema({
                            ...designSchema,
                            fonts: {
                              heading: pair.heading,
                              body: pair.body,
                              accent: pair.accent,
                            },
                          })
                        }
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          designSchema.fonts?.heading === pair.heading && designSchema.fonts?.body === pair.body
                            ? 'bg-gold-500/20 border-gold-500 text-gold-400'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                        }`}
                      >
                        <div className="font-extrabold text-xs">{pair.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{pair.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* INDIVIDUAL FONT SELECTIONS */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-400 font-semibold text-[11px] mb-1">
                      Font Judul & Nama Mempelai (Heading)
                    </label>
                    <select
                      value={designSchema.fonts?.heading || 'Great Vibes'}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          fonts: {
                            ...designSchema.fonts,
                            heading: e.target.value,
                          },
                        })
                      }
                      className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-gold-500 ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <option value="Great Vibes">✍️ Great Vibes (Script / Kaligrafi Indah)</option>
                      <option value="Pinyon Script">⚜️ Pinyon Script (Script Bangsawan Royal)</option>
                      <option value="Alex Brush">💖 Alex Brush (Script Lembut Romantic)</option>
                      <option value="Playfair Display">✨ Playfair Display (Serif High-End)</option>
                      <option value="Cinzel">👑 Cinzel (Serif Klasik Formal)</option>
                      <option value="Cinzel Decorative">👑 Cinzel Decorative (Royal Calligraphy)</option>
                      <option value="Cormorant Garamond">📜 Cormorant Garamond (Serif Timeless)</option>
                      <option value="Bodoni Moda">🌟 Bodoni Moda (High-Fashion Serif)</option>
                      <option value="Montserrat">Modern Minimalist Montserrat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold text-[11px] mb-1">
                      Font Teks Isi & Informasi (Body Text)
                    </label>
                    <select
                      value={designSchema.fonts?.body || 'Montserrat'}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          fonts: {
                            ...designSchema.fonts,
                            body: e.target.value,
                          },
                        })
                      }
                      className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-slate-200 ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <option value="Montserrat">🔹 Montserrat (Sans-Serif Modern Clean)</option>
                      <option value="Lato">🔹 Lato (Sans-Serif Kasual & Rapi)</option>
                      <option value="Raleway">🔹 Raleway (Sans-Serif Minimalis)</option>
                      <option value="Jost">🔹 Jost (Sans-Serif Kontemporer)</option>
                      <option value="Cormorant Garamond">📜 Cormorant Garamond (Serif Timeless)</option>
                      <option value="Rethink Sans">🔹 Rethink Sans (Sans-Serif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold text-[11px] mb-1">
                      Font Aksentuasi & Pemisah (Accent Script)
                    </label>
                    <select
                      value={designSchema.fonts?.accent || 'Great Vibes'}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          fonts: {
                            ...designSchema.fonts,
                            accent: e.target.value,
                          },
                        })
                      }
                      className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-rose-400 ${
                        isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <option value="Great Vibes">✍️ Great Vibes (Script)</option>
                      <option value="Pinyon Script">⚜️ Pinyon Script (Royal)</option>
                      <option value="Alex Brush">💖 Alex Brush (Soft Script)</option>
                      <option value="MonteCarlo">🖋️ MonteCarlo (Monogram)</option>
                    </select>
                  </div>
                </div>

                {/* ANIMASI BERGERAK LATAR BELAKANG */}
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 mb-1 font-semibold text-[11px]">Pilih Animasi Bergerak Latar Belakang</label>
                  <select
                    value={designSchema.animation || 'sparkles'}
                    onChange={(e) =>
                      setDesignSchema({
                        ...designSchema,
                        animation: e.target.value,
                      })
                    }
                    className={`w-full border rounded-xl p-2.5 focus:border-gold-500 focus:outline-none font-semibold text-gold-500 ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <option value="flying-birds">🕊️ Burung Merpati Terbang (Flying Doves)</option>
                    <option value="butterfly-glow">🦋 Kupu-Kupu Bercahaya (Glowing Butterflies)</option>
                    <option value="cherry-blossoms">🌸 Guguran Bunga Sakura & Melati</option>
                    <option value="golden-hearts">💖 Hati Emas Melayang (Golden Hearts)</option>
                    <option value="sparkles">✨ Sparkles Emas (Kemewahan Gold)</option>
                    <option value="rose-petals">🌹 Kelopak Mawar Falling (Rose Petals)</option>
                    <option value="gold-dust">✨ Debu Emas Melayang (Keraton & Luxury)</option>
                    <option value="islamic-stars">🕌 Bintang & Bulan Arabesque (Islami Syar'i)</option>
                    <option value="none">Off (Tanpa Animasi)</option>
                  </select>
                </div>

                {/* FITUR AUTO SCROLL UNDANGAN */}
                <div className={`p-4 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-gold-500 font-extrabold text-xs flex items-center gap-1.5">
                        <ArrowDownCircle className="w-4 h-4 text-gold-400" />
                        🚀 Fitur Auto Scroll Undangan (Menggulung Otomatis)
                      </label>
                      <p className="text-[10px] text-slate-400">Secara otomatis menggulung layar saat undangan dibuka tanpa perlu disentuh.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={designSchema.enableAutoScroll ?? true}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          enableAutoScroll: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-gold-500 rounded cursor-pointer"
                    />
                  </div>

                  {(designSchema.enableAutoScroll ?? true) && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <label className="block text-slate-400 font-semibold text-[11px]">
                        Kecepatan Auto Scroll (Scrolling Speed)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'slow', name: '🐢 Perlahan' },
                          { id: 'medium', name: '🚗 Standar' },
                          { id: 'fast', name: '⚡ Cepat' },
                        ].map((speed) => (
                          <button
                            key={speed.id}
                            type="button"
                            onClick={() =>
                              setDesignSchema({
                                ...designSchema,
                                autoScrollSpeed: speed.id as any,
                              })
                            }
                            className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                              (designSchema.autoScrollSpeed || 'medium') === speed.id
                                ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                                : isLight
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                            }`}
                          >
                            {speed.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SILUET FOTO PREWEDDING & VIDEO SINEMATIK LATAR BELAKANG */}
                <div className={`p-4 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-gold-500 font-extrabold text-xs flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-gold-400" />
                        Siluet Foto Prewedding & Video Sinematik (Latar Belakang)
                      </label>
                      <p className="text-[10px] text-slate-400">Menampilkan foto prewedding / video MP4 sebagai latar belakang sinematik.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={designSchema.enableBackgroundSilhouette ?? true}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          enableBackgroundSilhouette: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-gold-500 rounded cursor-pointer"
                    />
                  </div>

                  {(designSchema.enableBackgroundSilhouette ?? true) && (
                    <div className="space-y-4 pt-2 border-t border-slate-800/60">
                      {/* Pilihan Mode Media Latar Belakang: Foto vs Video */}
                      <div>
                        <label className="block text-slate-400 font-semibold text-[11px] mb-1.5">
                          Tipe Latar Belakang: Foto Siluet atau Video Sinematik
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800">
                          <button
                            type="button"
                            onClick={() =>
                              setDesignSchema({
                                ...designSchema,
                                backgroundMediaType: 'photo',
                              })
                            }
                            className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                              (designSchema.backgroundMediaType || 'photo') === 'photo'
                                ? 'bg-gold-500 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>📷 Foto Prewedding</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDesignSchema({
                                ...designSchema,
                                backgroundMediaType: 'video',
                              })
                            }
                            className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                              designSchema.backgroundMediaType === 'video'
                                ? 'bg-gold-500 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Film className="w-3.5 h-3.5" />
                            <span>🎥 Video Sinematik</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 font-semibold text-[11px] mb-1">Pilihan Gaya Pencahayaan Siluet / Overlay</label>
                        <select
                          value={designSchema.backgroundSilhouetteStyle || 'full'}
                          onChange={(e: any) =>
                            setDesignSchema({
                              ...designSchema,
                              backgroundSilhouetteStyle: e.target.value,
                            })
                          }
                          className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-gold-400 ${
                            isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                          }`}
                        >
                          <option value="full">🌌 Full Dark Silhouette (Siluet Gelap Klasik - Default)</option>
                          <option value="white-light">⚪ Full White Light Silhouette (Siluet Cerah Terang)</option>
                          <option value="vignette">🌕 Moon Glow Vignette (Sorot Bulan Melingkar)</option>
                          <option value="soft-glow">🌟 Soft Radial Glow (Pendaran Cahaya Lembut)</option>
                        </select>
                      </div>

                      {/* MODE FOTO PREWEDDING */}
                      {(designSchema.backgroundMediaType || 'photo') === 'photo' ? (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-slate-400 font-semibold text-[11px]">
                              Koleksi Pilihan Gambar Latar Belakang & Siluet Prewedding
                            </label>
                            <label
                              htmlFor="silhouette-photo-upload-grid"
                              className="text-[10px] font-bold text-gold-400 hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <Upload className="w-3 h-3 text-gold-400" />
                              <span>Upload Custom</span>
                            </label>
                          </div>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handlePhotoUpload(e, (url) =>
                                setDesignSchema({
                                  ...designSchema,
                                  silhouetteImageUrl: url,
                                })
                              )
                            }
                            className="hidden"
                            id="silhouette-photo-upload-grid"
                          />

                          <div className="grid grid-cols-4 gap-2">
                            {/* 1. Upload Custom Photo Card */}
                            <label
                              htmlFor="silhouette-photo-upload-grid"
                              className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gold-500/60 bg-gold-500/10 hover:bg-gold-500/20 cursor-pointer flex flex-col items-center justify-center p-1 text-center transition-all group shadow-sm"
                              title="Upload foto prewedding sendiri dari HP/laptop"
                            >
                              <Upload className="w-4 h-4 text-gold-400 mb-0.5 group-hover:scale-110 transition-transform" />
                              <span className="text-[9px] font-extrabold text-gold-300 leading-tight">
                                {isUploadingPhoto ? 'Uploading...' : '📤 Upload Foto'}
                              </span>
                            </label>

                            {/* Preset Siluet Background Thumbnails */}
                            {[
                              { name: '🌕 Moonlit Arch', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600' },
                              { name: '🌅 Sunset Prewed', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1600' },
                              { name: '🏛️ Royal Kraton', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600' },
                              { name: '🌿 Emerald Arch', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1600' },
                              { name: '✨ Gold Sparkle', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=1600' },
                              { name: '🌹 Velvet Rose', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600' },
                              { name: '🌌 Onyx Night', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600' },
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setDesignSchema({
                                    ...designSchema,
                                    silhouetteImageUrl: item.url,
                                  })
                                }
                                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                                  ((designSchema as any).silhouetteImageUrl || initialInvitation.coverPhoto) === item.url
                                    ? 'border-gold-500 scale-105 shadow-md ring-2 ring-gold-500/40'
                                    : 'border-slate-800 opacity-70 hover:opacity-100'
                                }`}
                              >
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-0.5 text-[9px] font-bold text-white text-center leading-tight">
                                  {item.name}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* MODE VIDEO PREWEDDING SINEMATIK 9:16 VERTIKAL HANDPHONE */
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <label className="text-gold-400 font-extrabold text-[11px] flex items-center gap-1.5">
                              <Film className="w-4 h-4 text-gold-400" />
                              Format Video Vertikal 9:16 (Layar Smartphone)
                            </label>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold border border-gold-500/30">
                              Ratio 9:16 HP
                            </span>
                          </div>

                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime,video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="background-video-file-upload"
                          />

                          {/* Tombol Upload Video Vertikal 9:16 */}
                          <label
                            htmlFor="background-video-file-upload"
                            className="relative w-full p-3.5 rounded-xl border-2 border-dashed border-gold-500/70 bg-gold-500/10 hover:bg-gold-500/20 cursor-pointer flex items-center justify-center gap-2 text-center transition-all group shadow-md"
                          >
                            <Upload className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-black text-gold-300">
                              {isUploadingVideo ? 'Uploading Video MP4 Vertikal...' : '📱 Upload Video MP4 Vertikal 9:16 (HP/Laptop)'}
                            </span>
                          </label>

                          {/* Live Preview Box Video 9:16 */}
                          {(designSchema as any).backgroundVideoUrl && (
                            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-[9/16] max-h-48 mx-auto shadow-lg group">
                              <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                key={(designSchema as any).backgroundVideoUrl}
                                className="w-full h-full object-cover filter brightness-[0.9]"
                              >
                                <source src={(designSchema as any).backgroundVideoUrl} type="video/mp4" />
                              </video>
                              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-gold-400 text-[9px] font-bold">
                                📱 Preview Video 9:16 Vertikal HP
                              </div>
                            </div>
                          )}

                          {/* Preset Video 9:16 HD */}
                          <div>
                            <label className="block text-slate-400 font-semibold text-[10px] mb-1.5">
                              Pilih Preset Video Vertikal 9:16 Sinematik:
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {[
                                { name: '🎬 Sparkler 9:16', url: 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-sparklers-41484-large.mp4' },
                                { name: '🌅 Sunset Beach 9:16', url: 'https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-on-the-beach-at-sunset-41483-large.mp4' },
                                { name: '🌿 Forest Walk 9:16', url: 'https://assets.mixkit.co/videos/preview/mixkit-couple-walking-hand-in-hand-through-a-forest-41482-large.mp4' },
                                { name: '✨ Golden Dust 9:16', url: 'https://assets.mixkit.co/videos/preview/mixkit-gold-dust-particles-floating-in-the-air-42666-large.mp4' },
                              ].map((vItem, vIdx) => (
                                <button
                                  key={vIdx}
                                  type="button"
                                  onClick={() =>
                                    setDesignSchema({
                                      ...designSchema,
                                      backgroundMediaType: 'video',
                                      backgroundVideoUrl: vItem.url,
                                    })
                                  }
                                  className={`relative aspect-[9/16] rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                                    (designSchema as any).backgroundVideoUrl === vItem.url
                                      ? 'border-gold-500 scale-105 shadow-md ring-2 ring-gold-500/40'
                                      : 'border-slate-800 opacity-70 hover:opacity-100'
                                  }`}
                                >
                                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-1 text-center">
                                    <PlayCircle className="w-5 h-5 text-gold-400 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-extrabold text-white leading-tight">{vItem.name}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-slate-400 font-semibold text-[10px] mb-1">Link Direct URL Video MP4/WebM Vertikal 9:16:</label>
                            <input
                              type="url"
                              value={(designSchema as any).backgroundVideoUrl || ''}
                              onChange={(e) =>
                                setDesignSchema({
                                  ...designSchema,
                                  backgroundMediaType: 'video',
                                  backgroundVideoUrl: e.target.value,
                                })
                              }
                              placeholder="https://domain.com/video-prewedding-9-16.mp4"
                              className={`w-full border rounded-xl p-2 text-xs font-mono text-gold-400 ${
                                isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                          <span>Kejelasan Transparansi Siluet Foto (Default 75%-90%)</span>
                          <span className="font-mono text-gold-400">{Math.round((designSchema.backgroundSilhouetteOpacity ?? 0.85) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="0.95"
                          step="0.05"
                          value={designSchema.backgroundSilhouetteOpacity ?? 0.85}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              backgroundSilhouetteOpacity: parseFloat(e.target.value),
                            })
                          }
                          className="w-full accent-gold-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* TIPOGRAFI WATERMARK LATAR BELAKANG */}
                <div className={`p-4 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-gold-500 font-extrabold text-xs flex items-center gap-1.5">
                        <Type className="w-4 h-4 text-gold-400" />
                        Tipografi Watermark Inisial Latar Belakang
                      </label>
                      <p className="text-[10px] text-slate-400">Menambahkan cetakan inisial huruf raksasa samar (watermark) agar latar belakang tidak kosong.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={designSchema.enableWatermarkTypography ?? true}
                      onChange={(e) =>
                        setDesignSchema({
                          ...designSchema,
                          enableWatermarkTypography: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-gold-500 rounded cursor-pointer"
                    />
                  </div>

                  {(designSchema.enableWatermarkTypography ?? true) && (
                    <div className="pt-2 border-t border-slate-800/60">
                      <label className="block text-slate-400 font-semibold text-[11px] mb-1">Teks Watermark Inisial</label>
                      <input
                        type="text"
                        value={designSchema.watermarkText || `${getInitialLetter(groomName, 'A')} & ${getInitialLetter(brideName, 'S')}`}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            watermarkText: e.target.value,
                          })
                        }
                        placeholder="Contoh: A & S"
                        className={`w-full border rounded-xl p-2.5 font-bold font-mono focus:border-gold-500 focus:outline-none text-gold-400 ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: DEDICATED TEMA & BENTUK ELEMEN TAB (PLACED RIGHT BEFORE STORY) */}
            {activeTab === 'canvas' && (
              <div className="space-y-5">
                <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Pengaturan Tema Warna, Bentuk Cover & Isi Undangan</h3>

                {/* ✉️ PENGATURAN KARTU COVER / SAMPUL UNDANGAN */}
                <div className={`p-4 border rounded-2xl space-y-4 ${
                  isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950 border-gold-500/30'
                }`}>
                  <label className="block text-gold-500 font-extrabold text-xs flex items-center gap-1.5 border-b pb-2 border-slate-800">
                    <Mail className="w-4 h-4 text-gold-400" />
                    ✉️ Pengaturan Bentuk & Warna Cover / Sampul Undangan
                  </label>

                  {/* Warna Background Sampul */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Warna Latar Sampul Cover</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={designSchema.coverCardBgColor || designSchema.theme.cardBg || '#1E293B'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            coverCardBgColor: e.target.value,
                          })
                        }
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={designSchema.coverCardBgColor || designSchema.theme.cardBg || '#1E293B'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            coverCardBgColor: e.target.value,
                          })
                        }
                        className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bentuk Sudut Sampul Cover */}
                  <div className="space-y-2">
                    <label className="block text-slate-400 font-semibold text-[11px]">Bentuk Sudut Sampul (Cover Corner Shape)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rounded', name: '🟢 Soft Rounded' },
                        { id: 'arch', name: '🏛️ Arch Dome' },
                        { id: 'sharp', name: '⏹️ Sharp Vintage' },
                        { id: 'pill', name: '💊 Pill Oval' },
                        { id: 'diamond', name: '🔷 Diamond Cut' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              coverCardCornerShape: shape.id as any,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                            (designSchema.coverCardCornerShape || designSchema.cardCornerShape || 'rounded') === shape.id
                              ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                          }`}
                        >
                          {shape.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gaya Lis Bingkai Cover */}
                  <div className="space-y-2">
                    <label className="block text-slate-400 font-semibold text-[11px]">Gaya Lis Bingkai Sampul (Cover Border Style)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'solid-gold', name: 'Garis Emas Solid' },
                        { id: 'double-gold', name: 'Garis Ganda Emas' },
                        { id: 'dashed-gold', name: 'Garis Putus-Putus' },
                        { id: 'glassmorphism', name: 'Efek Kaca Glassmorphism' },
                        { id: 'soft-glow', name: 'Bayangan Glow Emas' },
                      ].map((border) => (
                        <button
                          key={border.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              coverCardBorderStyle: border.id as any,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                            (designSchema.coverCardBorderStyle || designSchema.cardBorderStyle || 'solid-gold') === border.id
                              ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                          }`}
                        >
                          {border.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 📜 PENGATURAN KARTU ISI UNDANGAN */}
                <div className={`p-4 border rounded-2xl space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-extrabold text-xs flex items-center gap-1.5 border-b pb-2 border-slate-800">
                    <Crown className="w-4 h-4 text-gold-400" />
                    📜 Pengaturan Bentuk & Warna Kartu Isi Undangan
                  </label>

                  {/* Warna Background Kartu Isi */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Background Kartu-Kartu Isi</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={designSchema.canvasCardBgColor || designSchema.theme.cardBg || '#1E293B'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            theme: { ...designSchema.theme, cardBg: e.target.value },
                            canvasCardBgColor: e.target.value,
                          })
                        }
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                      />
                      <input
                        type="text"
                        value={designSchema.canvasCardBgColor || designSchema.theme.cardBg || '#1E293B'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            theme: { ...designSchema.theme, cardBg: e.target.value },
                            canvasCardBgColor: e.target.value,
                          })
                        }
                        className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Bentuk Sudut Kartu Isi */}
                  <div className="space-y-2">
                    <label className="block text-slate-400 font-semibold text-[11px]">Bentuk Sudut Kartu Isi (Content Card Corner Shape)</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'rounded', name: '🟢 Soft Rounded' },
                        { id: 'arch', name: '🏛️ Arch Dome' },
                        { id: 'sharp', name: '⏹️ Sharp Vintage' },
                        { id: 'pill', name: '💊 Pill Oval' },
                        { id: 'diamond', name: '🔷 Diamond Cut' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              cardCornerShape: shape.id as any,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                            (designSchema.cardCornerShape || 'rounded') === shape.id
                              ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                          }`}
                        >
                          {shape.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gaya Lis Bingkai Border Kartu Isi */}
                  <div className="space-y-2">
                    <label className="block text-slate-400 font-semibold text-[11px]">Gaya Lis Bingkai Kartu Isi (Content Card Border Style)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'solid-gold', name: 'Garis Emas Solid' },
                        { id: 'double-gold', name: 'Garis Ganda Emas' },
                        { id: 'dashed-gold', name: 'Garis Putus-Putus' },
                        { id: 'glassmorphism', name: 'Efek Kaca Glassmorphism' },
                        { id: 'soft-glow', name: 'Bayangan Glow Emas' },
                      ].map((border) => (
                        <button
                          key={border.id}
                          type="button"
                          onClick={() =>
                            setDesignSchema({
                              ...designSchema,
                              cardBorderStyle: border.id as any,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                            (designSchema.cardBorderStyle || 'solid-gold') === border.id
                              ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                              : isLight
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                          }`}
                        >
                          {border.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 🎨 PENGATURAN WARNA LATAR UTAMA CANVAS & QUICK PRESETS */}
                <div className={`p-4 border rounded-2xl space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-extrabold text-xs flex items-center gap-1.5 border-b pb-2 border-slate-800">
                    <Palette className="w-4 h-4" />
                    🎨 Pengaturan Warna Latar Utama Canvas & Aksen
                  </label>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Canvas Background Utama</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={designSchema.theme.background || '#0F172A'}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              theme: { ...designSchema.theme, background: e.target.value },
                              canvasBgColor: e.target.value,
                            })
                          }
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={designSchema.theme.background || '#0F172A'}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              theme: { ...designSchema.theme, background: e.target.value },
                              canvasBgColor: e.target.value,
                            })
                          }
                          className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Aksen Emas / Highlight</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={designSchema.theme.accent || '#D7BA7D'}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              theme: { ...designSchema.theme, accent: e.target.value },
                            })
                          }
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={designSchema.theme.accent || '#D7BA7D'}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              theme: { ...designSchema.theme, accent: e.target.value },
                            })
                          }
                          className={`flex-1 p-2.5 rounded-xl border text-xs font-mono font-bold ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SAKELAR 1-KLIK BASE TONE: MODE TERANG VS GELAP */}
                  <div className={`p-3.5 border rounded-2xl space-y-2.5 ${
                    isCurrentDesignLight ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-900/90 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-gold-500 font-extrabold text-xs flex items-center gap-1.5">
                          <Sun className="w-4 h-4 text-amber-500" />
                          ☀️ Nuansa Warna Dasar (Base Tone Aesthetic)
                        </label>
                        <p className="text-[10px] text-slate-400">
                          Pilih suasana tema utama: Terang romantis (favorit calon pengantin wanita) atau Gelap royal.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          const defaultLight = LIGHT_THEME_PRESETS[0]; // Pure White & Royal Gold
                          setDesignSchema({
                            ...designSchema,
                            themeTone: 'light',
                            theme: {
                              ...designSchema.theme,
                              background: defaultLight.bg,
                              cardBg: defaultLight.cardBg,
                              primary: defaultLight.primary,
                              secondary: defaultLight.secondary,
                              accent: defaultLight.accent,
                              textPrimary: defaultLight.textPrimary,
                              textSecondary: defaultLight.textSecondary,
                              isLight: true,
                            },
                            canvasBgColor: defaultLight.bg,
                            canvasCardBgColor: defaultLight.cardBg,
                            coverCardBgColor: defaultLight.cardBg,
                            canvasPatternStyle: defaultLight.pattern,
                            backgroundSilhouetteStyle: defaultLight.silhouetteStyle,
                          });
                          setPresetTab('light');
                        }}
                        className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          isCurrentDesignLight
                            ? 'bg-amber-100 text-amber-950 shadow-md font-black ring-2 ring-amber-400'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>☀️ Nuansa Terang (Light)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultDark = DARK_THEME_PRESETS[0]; // Gold & Onyx
                          setDesignSchema({
                            ...designSchema,
                            themeTone: 'dark',
                            theme: {
                              ...designSchema.theme,
                              background: defaultDark.bg,
                              cardBg: defaultDark.cardBg,
                              primary: defaultDark.primary,
                              secondary: defaultDark.secondary,
                              accent: defaultDark.accent,
                              textPrimary: defaultDark.textPrimary,
                              textSecondary: defaultDark.textSecondary,
                              isLight: false,
                            },
                            canvasBgColor: defaultDark.bg,
                            canvasCardBgColor: defaultDark.cardBg,
                            coverCardBgColor: defaultDark.cardBg,
                            canvasPatternStyle: defaultDark.pattern,
                            backgroundSilhouetteStyle: defaultDark.silhouetteStyle,
                          });
                          setPresetTab('dark');
                        }}
                        className={`py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          !isCurrentDesignLight
                            ? 'bg-slate-800 text-gold-300 shadow-md font-black ring-2 ring-gold-500'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5 text-sky-400" />
                        <span>🌙 Nuansa Gelap (Dark)</span>
                      </button>
                    </div>
                  </div>

                  {/* TABBED QUICK PRESETS: TERANG VS GELAP */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-400 font-bold text-[11px]">
                        Pilihan Quick Presets Kombinasi Warna
                      </label>
                      {/* Sub-tab pills */}
                      <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPresetTab('light')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                            presetTab === 'light'
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          🌸 Terang ({LIGHT_THEME_PRESETS.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetTab('dark')}
                          className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                            presetTab === 'dark'
                              ? 'bg-amber-400 text-slate-950 shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          🌌 Gelap ({DARK_THEME_PRESETS.length})
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(presetTab === 'light' ? LIGHT_THEME_PRESETS : DARK_THEME_PRESETS).map((preset) => {
                        const isPresetActive =
                          (designSchema.theme.background?.toLowerCase() === preset.bg.toLowerCase() ||
                           designSchema.canvasBgColor?.toLowerCase() === preset.bg.toLowerCase()) &&
                          (designSchema.theme.primary?.toLowerCase() === preset.primary.toLowerCase());
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() =>
                              setDesignSchema({
                                ...designSchema,
                                themeTone: preset.silhouetteStyle === 'white-light' ? 'light' : 'dark',
                                theme: {
                                  ...designSchema.theme,
                                  background: preset.bg,
                                  cardBg: preset.cardBg,
                                  primary: preset.primary,
                                  secondary: preset.secondary,
                                  accent: preset.accent,
                                  textPrimary: preset.textPrimary,
                                  textSecondary: preset.textSecondary,
                                  isLight: preset.silhouetteStyle === 'white-light',
                                },
                                canvasBgColor: preset.bg,
                                canvasCardBgColor: preset.cardBg,
                                coverCardBgColor: preset.cardBg,
                                canvasPatternStyle: preset.pattern,
                                backgroundSilhouetteStyle: preset.silhouetteStyle,
                              })
                            }
                            className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-md flex flex-col justify-between gap-1.5 cursor-pointer relative overflow-hidden ${
                              isPresetActive
                                ? 'ring-2 ring-amber-400 border-amber-400 shadow-amber-500/20'
                                : 'border-slate-800/80 hover:border-amber-400/50'
                            }`}
                            style={{
                              backgroundColor: preset.bg === '#FFFFFF' ? '#FBFBFC' : preset.bg,
                              color: preset.textPrimary,
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">
                                {preset.badge}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: preset.primary }} />
                                <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: preset.accent }} />
                              </div>
                            </div>
                            <div>
                              <div className="font-extrabold text-[11px] leading-snug line-clamp-1">{preset.name}</div>
                              <div className="text-[9px] opacity-75 line-clamp-1 leading-tight mt-0.5">{preset.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* PENGATURAN TEKSTUR & PATTERN LATAR CANVAS (CANVAS PATTERN SHAPE) */}
                <div className={`p-4 border rounded-2xl space-y-3 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-extrabold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Pilih Motif & Tekstur Latar Canvas
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'solid', name: '⬛ Solid Polos' },
                      { id: 'radial-glow', name: '💫 Radial Glow' },
                      { id: 'damask', name: '⚜️ Damask Motif' },
                      { id: 'geometric-islamic', name: '🕌 Star Geometric' },
                      { id: 'marble', name: '🏛️ Soft Marble' },
                      { id: 'stars', name: '✨ Constellation' },
                    ].map((pattern) => (
                      <button
                        key={pattern.id}
                        type="button"
                        onClick={() =>
                          setDesignSchema({
                            ...designSchema,
                            canvasPatternStyle: pattern.id as any,
                          })
                        }
                        className={`p-2.5 rounded-xl border text-center font-bold text-[11px] transition-all ${
                          (designSchema.canvasPatternStyle || 'solid') === pattern.id
                            ? 'bg-gold-500 text-slate-950 border-gold-500 shadow-md font-black'
                            : isLight
                            ? 'bg-white border-slate-200 text-slate-700 hover:border-gold-400'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-gold-500/50'
                        }`}
                      >
                        {pattern.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BENTUK FRAME FOTO & MOTIF ORNAMEN HIASAN */}
                <div className={`p-4 border rounded-2xl space-y-4 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-extrabold text-xs flex items-center gap-1.5 border-b pb-2 border-slate-800">
                    <Crown className="w-4 h-4" />
                    👑 Bentuk Frame Foto & Motif Ornamen Hiasan
                  </label>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-400 font-semibold text-[11px] mb-1">Bentuk Frame Foto</label>
                      <select
                        value={designSchema.photoShape || 'circle'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            photoShape: e.target.value as any,
                          })
                        }
                        className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-gold-500 ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <option value="circle">⭕ Lingkaran (Circle)</option>
                        <option value="arch">🏛️ Kubah (Arch Dome)</option>
                        <option value="oval">🥚 Oval Portrait</option>
                        <option value="square">🔲 Kotak Rounded</option>
                        <option value="rectangle">📱 Persegi Panjang</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold text-[11px] mb-1">Motif Ornamen Hiasan</label>
                      <select
                        value={designSchema.ornamentStyle || designSchema.ornament || 'gold-floral'}
                        onChange={(e) =>
                          setDesignSchema({
                            ...designSchema,
                            ornamentStyle: e.target.value as any,
                            ornament: e.target.value,
                          })
                        }
                        className={`w-full border rounded-xl p-2.5 font-bold focus:border-gold-500 focus:outline-none text-gold-500 ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <option value="gold-floral">🌹 Gold Floral Rose</option>
                        <option value="islamic-star">🕌 Islamic Star Geometric</option>
                        <option value="minimalist-line">➖ Minimalist Line Gold</option>
                        <option value="luxury-crown">👑 Luxury Crown Motif</option>
                        <option value="vintage-scroll">📜 Vintage Scroll</option>
                        <option value="none">Off (Tanpa Ornamen)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LOVE STORY */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Timeline Cerita Cinta (Love Story)</h3>
                  <button
                    onClick={() => setLoveStory([...loveStory, { year: '2026', title: 'Judul Cerita', description: 'Deskripsi singkat...' }])}
                    className="px-2.5 py-1 rounded-lg bg-gold-500 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Story
                  </button>
                </div>

                {loveStory.map((story, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl space-y-2 relative ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        placeholder="Tahun"
                        value={story.year}
                        onChange={(e) => {
                          const next = [...loveStory];
                          next[idx].year = e.target.value;
                          setLoveStory(next);
                        }}
                        className={`w-20 border rounded p-1 font-mono text-gold-500 font-bold ${
                          isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                        }`}
                      />
                      <button
                        onClick={() => setLoveStory(loveStory.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Judul Momen"
                      value={story.title}
                      onChange={(e) => {
                        const next = [...loveStory];
                        next[idx].title = e.target.value;
                        setLoveStory(next);
                      }}
                      className={`w-full border rounded p-1.5 font-bold ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />

                    <textarea
                      rows={2}
                      placeholder="Deskripsi cerita..."
                      value={story.description}
                      onChange={(e) => {
                        const next = [...loveStory];
                        next[idx].description = e.target.value;
                        setLoveStory(next);
                      }}
                      className={`w-full border rounded p-1.5 text-xs resize-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: GALLERY PHOTOS & AUTOPLAY YOUTUBE VIDEO PREWEDDING */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Galeri Foto & Video Prewedding YouTube</h3>

                {/* YouTube Prewedding Video URL Input */}
                <div className={`p-3.5 border rounded-2xl space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <label className="block text-gold-500 font-bold text-xs flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-500" />
                    Link Video Prewedding YouTube (Autoplay)
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 font-mono text-[11px] ${
                      isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  />
                  <p className="text-[10px] text-slate-400">
                    Video YouTube akan diputar otomatis secara berulang (loop & autoplay) pada bagian galeri undangan.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <h4 className="font-bold text-xs text-slate-400 uppercase">Foto-Foto Album Prewedding</h4>
                  <button
                    onClick={() => setGalleryPhotos([...galleryPhotos, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'])}
                    className="px-2.5 py-1 rounded-lg bg-gold-500 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Foto
                  </button>
                </div>

                {galleryPhotos.map((url, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 border rounded-xl ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <img src={url} alt={`Photo ${idx}`} className="w-10 h-10 rounded object-cover" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const next = [...galleryPhotos];
                        next[idx] = e.target.value;
                        setGalleryPhotos(next);
                      }}
                      className={`flex-1 border rounded p-1.5 font-mono text-[11px] ${
                        isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                      }`}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handlePhotoUpload(e, (uploadedUrl) => {
                          const next = [...galleryPhotos];
                          next[idx] = uploadedUrl;
                          setGalleryPhotos(next);
                        });
                      }}
                      className="hidden"
                      id={`upload-gallery-${idx}`}
                    />
                    <label
                      htmlFor={`upload-gallery-${idx}`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-200 cursor-pointer"
                      title="Upload Foto Ini"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </label>
                    <button
                      onClick={() => setGalleryPhotos(galleryPhotos.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: UPLOAD MUSIK MP3 */}
            {activeTab === 'music' && (
              <div className="space-y-4">
                <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Upload Musik Pernikahan Kustom (MP3)</h3>
                
                <div className={`p-4 border-2 border-dashed rounded-2xl text-center space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
                }`}>
                  <Upload className="w-6 h-6 text-gold-500 mx-auto" />
                  <span className={`text-xs font-bold block ${isLight ? 'text-slate-900' : 'text-white'}`}>Pilih File Musik MP3 dari Perangkat Anda</span>
                  <input
                    type="file"
                    accept="audio/mp3,audio/*"
                    onChange={handleFileUploadMusic}
                    className="hidden"
                    id="music-upload-input"
                  />
                  <label
                    htmlFor="music-upload-input"
                    className="inline-block px-4 py-2 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-gold-400 shadow-md"
                  >
                    {isUploadingMusic ? 'Uploading Musik...' : 'Browse File MP3'}
                  </label>
                </div>

                {/* MUSIC START TIME / TRIM CONTROL SECTION */}
                {(() => {
                  const selectedTrack = localMusicList.find((m) => m.id === selectedMusicId) || localMusicList[0];
                  const detected = detectedDurations[selectedTrack?.id];
                  const selectedTrackDurationSecs = detected?.totalSeconds || getDurationInSeconds(selectedTrack?.duration);
                  const selectedTrackDurationStr = detected?.durationStr || selectedTrack?.duration || '3:30';
                  const maxSliderVal = Math.max(selectedTrackDurationSecs - 5, 10);
                  const presets = [
                    { label: '0d (Awal)', val: 0 },
                    { label: '15d', val: 15 },
                    { label: '30d (Reff)', val: 30 },
                    { label: '45d', val: 45 },
                    { label: '60d (1 Mnt)', val: 60 },
                    { label: '90d (1.5 Mnt)', val: 90 },
                    { label: '120d (2 Mnt)', val: 120 },
                    { label: '150d (2.5 Mnt)', val: 150 },
                    { label: '180d (3 Mnt)', val: 180 },
                    { label: '210d (3.5 Mnt)', val: 210 },
                    { label: '240d (4 Mnt)', val: 240 },
                  ].filter((p) => p.val < selectedTrackDurationSecs);

                  return (
                    <div className={`p-4 border rounded-2xl space-y-3 ${
                      isLight ? 'bg-amber-50/60 border-amber-200' : 'bg-slate-950 border-gold-500/40 shadow-xl'
                    }`}>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gold-400 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gold-500" />
                          Potong / Atur Detik Mulai Musik (Persisi 1s)
                        </label>
                        <span className="text-xs font-mono font-extrabold text-gold-300 bg-gold-500/20 px-2.5 py-0.5 rounded-md border border-gold-500/40">
                          {Math.floor((designSchema.musicStartTime || 0) / 60).toString().padStart(2, '0')}:
                          {((designSchema.musicStartTime || 0) % 60).toString().padStart(2, '0')} / {selectedTrackDurationStr}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Tentukan detik ke berapa musik <span className="font-bold text-gold-400">"{selectedTrack?.title}"</span> (Durasi Asli Terdeteksi: <span className="font-bold text-emerald-400">{selectedTrackDurationStr}</span>) akan diputar begitu tamu membuka undangan Anda.
                      </p>

                      <div className="space-y-3 pt-1">
                        {/* 1-SECOND STEP SLIDER */}
                        <input
                          type="range"
                          min={0}
                          max={maxSliderVal}
                          step={1}
                          value={Math.min(designSchema.musicStartTime || 0, maxSliderVal)}
                          onChange={(e) =>
                            setDesignSchema({
                              ...designSchema,
                              musicStartTime: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full accent-gold-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                        />

                        {/* DIRECT MANUAL NUMBER INPUT PER SECOND */}
                        <div className="flex items-center justify-between pt-1 pb-1 border-y border-slate-800/60">
                          <span className="text-[11px] text-slate-300 font-bold">Input Detik Manual (Presisi 1 Detik):</span>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={maxSliderVal}
                              value={designSchema.musicStartTime || 0}
                              onChange={(e) => {
                                const val = Math.min(Math.max(0, parseInt(e.target.value) || 0), maxSliderVal);
                                setDesignSchema({
                                  ...designSchema,
                                  musicStartTime: val,
                                });
                              }}
                              className="w-20 border rounded-xl px-2 py-1 font-mono text-xs text-gold-400 bg-slate-900 border-slate-700 font-bold text-center focus:border-gold-500 focus:outline-none"
                            />
                            <span className="text-[11px] text-slate-400 font-mono">Detik</span>
                          </div>
                        </div>

                        {/* Quick Preset Time Buttons */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pilih Preset Waktu Cepat:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {presets.map((preset) => (
                              <button
                                key={preset.val}
                                type="button"
                                onClick={() =>
                                  setDesignSchema({
                                    ...designSchema,
                                    musicStartTime: preset.val,
                                  })
                                }
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  (designSchema.musicStartTime || 0) === preset.val
                                    ? 'bg-gold-500 text-slate-950 font-extrabold shadow-md scale-105'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Pilihan Musik Latar:</span>
                  {Array.from(new Map(localMusicList.map((item) => [item.title, item])).values()).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMusicId(m.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedMusicId === m.id
                          ? 'bg-gold-500/10 border-gold-500 font-bold ring-2 ring-gold-500/30'
                          : isLight
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-gold-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-gold-500/40'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{m.title}</span>
                        {selectedMusicId === m.id && <span className="text-[10px] text-gold-400 font-mono font-bold">✓ Terpilih</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 flex justify-between mt-1">
                        <span>{m.artist} • {m.genre}</span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {detectedDurations[m.id]?.durationStr || m.duration || '3:30'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: ACARA & LOKASI (EVENTS) */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Informasi Rangkaian Acara & Lokasi</h3>
                  <button
                    onClick={() =>
                      setEvents([
                        ...events,
                        {
                          eventType: 'RESEPSI',
                          title: 'Acara Baru',
                          date: weddingDate,
                          startTime: '11:00 WIB',
                          endTime: '15:00 WIB',
                          venueName: 'Nama Gedung / Hotel',
                          address: 'Alamat Lengkap Acara',
                          googleMapsUrl: '',
                        },
                      ])
                    }
                    className="px-2.5 py-1 rounded-lg bg-gold-500 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Acara
                  </button>
                </div>

                {events.map((ev, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 border rounded-2xl space-y-3 relative ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gold-500 text-xs uppercase font-mono">
                        Acara #{idx + 1}: {ev.eventType}
                      </span>
                      {events.length > 1 && (
                        <button
                          onClick={() => setEvents(events.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Judul Acara</label>
                      <input
                        type="text"
                        value={ev.title}
                        onChange={(e) => {
                          const next = [...events];
                          next[idx].title = e.target.value;
                          setEvents(next);
                        }}
                        placeholder="Contoh: Akad Nikah / Resepsi Pernikahan"
                        className={`w-full border rounded-xl p-2 font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Waktu Mulai</label>
                        <input
                          type="text"
                          value={ev.startTime}
                          onChange={(e) => {
                            const next = [...events];
                            next[idx].startTime = e.target.value;
                            setEvents(next);
                          }}
                          placeholder="08:00 WIB"
                          className={`w-full border rounded-xl p-2 font-mono text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Waktu Selesai</label>
                        <input
                          type="text"
                          value={ev.endTime}
                          onChange={(e) => {
                            const next = [...events];
                            next[idx].endTime = e.target.value;
                            setEvents(next);
                          }}
                          placeholder="11:00 WIB / Selesai"
                          className={`w-full border rounded-xl p-2 font-mono text-xs ${
                            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Nama Tempat / Gedung</label>
                      <input
                        type="text"
                        value={ev.venueName}
                        onChange={(e) => {
                          const next = [...events];
                          next[idx].venueName = e.target.value;
                          setEvents(next);
                        }}
                        placeholder="Grand Ballroom Hotel..."
                        className={`w-full border rounded-xl p-2 font-semibold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Alamat Lengkap</label>
                      <textarea
                        rows={2}
                        value={ev.address}
                        onChange={(e) => {
                          const next = [...events];
                          next[idx].address = e.target.value;
                          setEvents(next);
                        }}
                        placeholder="Jl. M.H. Thamrin No. 1..."
                        className={`w-full border rounded-xl p-2 text-xs resize-none ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Tautan Link Google Maps</label>
                      <input
                        type="text"
                        value={ev.googleMapsUrl || ''}
                        onChange={(e) => {
                          const next = [...events];
                          next[idx].googleMapsUrl = e.target.value;
                          setEvents(next);
                        }}
                        placeholder="https://maps.google.com/..."
                        className={`w-full border rounded-xl p-2 font-mono text-[11px] ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: GIFTS & PHYSICAL SHIPPING ADDRESS */}
            {activeTab === 'gifts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>Rekening Kado Digital & Alamat Kado Fisik</h3>
                  <button
                    onClick={() => setDigitalGifts([...digitalGifts, { bankName: 'Bank BCA', accountName: 'Andi Pratama', accountNumber: '1234567890' }])}
                    className="px-2.5 py-1 rounded-lg bg-gold-500 text-slate-950 font-bold text-[11px] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Rekening
                  </button>
                </div>

                {digitalGifts.map((gift, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl space-y-2 relative ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        placeholder="Nama Bank / Kado Fisik"
                        value={gift.bankName}
                        onChange={(e) => {
                          const next = [...digitalGifts];
                          next[idx].bankName = e.target.value;
                          setDigitalGifts(next);
                        }}
                        className={`w-full border rounded p-2 font-bold ${
                          isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
                        }`}
                      />
                      <button
                        onClick={() => setDigitalGifts(digitalGifts.filter((_, i) => i !== idx))}
                        className="text-rose-500 hover:text-rose-400 p-1 ml-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Nomor Rekening / No HP E-Wallet"
                      value={gift.accountNumber || ''}
                      onChange={(e) => {
                        const next = [...digitalGifts];
                        next[idx].accountNumber = e.target.value;
                        setDigitalGifts(next);
                      }}
                      className={`w-full border rounded p-2 text-gold-500 font-mono font-bold text-xs ${
                        isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                      }`}
                    />

                    <textarea
                      rows={2}
                      placeholder="Alamat Pengiriman Kado Fisik (Opsional)..."
                      value={gift.shippingAddress || ''}
                      onChange={(e) => {
                        const next = [...digitalGifts];
                        next[idx].shippingAddress = e.target.value;
                        setDigitalGifts(next);
                      }}
                      className={`w-full border rounded p-2 text-xs resize-none ${
                        isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Mobile Live Device Preview Viewport */}
        <div className={`flex-1 overflow-hidden flex items-center justify-center p-4 transition-colors duration-300 ${
          isLight ? 'bg-slate-200' : 'bg-slate-950'
        }`}>
          <MobileDeviceFrame deviceType={deviceType} onDeviceTypeChange={setDeviceType}>
            <RenderInvitationView invitation={liveInvitationData} isPreview={true} />
          </MobileDeviceFrame>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        currentSchema={designSchema}
        onApplySchema={(newSchema) => setDesignSchema(newSchema)}
        groomName={groomName}
        brideName={brideName}
        onApplyCopywriting={(copy) => {
          setQuoteText(copy.quoteText);
          setQuoteSource(copy.quoteSource);
        }}
      />
    </div>
  );
};
