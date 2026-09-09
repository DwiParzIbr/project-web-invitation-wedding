import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { RenderInvitationView } from '@/components/invitation/RenderInvitationView';
import { getTemplateCouple } from '@/data/templateCouples';
import { getCleanName } from '@/utils/nameUtils';

interface DemoTemplatePageProps {
  params: {
    slug: string;
  };
  searchParams: {
    to?: string;
  };
}

export const revalidate = 0;

export default async function DemoTemplatePage({
  params,
  searchParams,
}: DemoTemplatePageProps) {
  const template = await db.template.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
  });

  if (!template) {
    return notFound();
  }

  // Get default music track (Westlife - Beautiful in White)
  const defaultMusic = await db.music.findFirst({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  });

  // Get sample couple details for this template
  const couple = getTemplateCouple(template.slug);

  // Parse design config and apply custom watermark text for this specific couple
  let customConfig: any = template.designSchema;
  try {
    if (typeof customConfig === 'string') {
      customConfig = JSON.parse(customConfig);
    }
    if (customConfig && couple.watermarkText) {
      customConfig = {
        ...customConfig,
        watermarkText: couple.watermarkText,
      };
    }
  } catch (e) {
    customConfig = template.designSchema;
  }

  const demoInvitation: any = {
    id: `demo-${template.slug}`,
    slug: template.slug,
    title: `Pernikahan ${getCleanName(couple.groomName)} & ${getCleanName(couple.brideName)}`,
    isPublished: true,
    designConfig: customConfig,
    groomName: couple.groomName,
    groomParents: couple.groomParents,
    groomPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    groomInstagram: couple.groomInstagram,
    brideName: couple.brideName,
    brideParents: couple.brideParents,
    bridePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500',
    brideInstagram: couple.brideInstagram,
    weddingDate: new Date('2026-12-12T08:00:00.000Z'),
    coverPhoto: template.previewImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200',
    youtubeUrl: 'https://www.youtube.com/watch?v=-ARVwU58l7A',
    quoteText: 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    quoteSource: 'QS. Ar-Rum: 21',
    musicId: defaultMusic?.id,
    music: defaultMusic,
    loveStory: JSON.stringify([
      { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat menghadiri seminar profesional di Jakarta.' },
      { year: '2023', title: 'Momen Berkomitmen', description: 'Memutuskan untuk melangkah bersama dalam ikatan persahabatan & kasih sayang.' },
      { year: '2025', title: 'Acara Lamaran', description: 'Momen sakral pertemuan dua keluarga besar melamar calon pengantin.' },
      { year: '2026', title: 'Hari Pernikahan', description: `Akad nikah & resepsi pernikahan bertema ${template.name}.` },
    ]),
    galleryPhotos: JSON.stringify([
      template.previewImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
      'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800',
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    ]),
    digitalGifts: JSON.stringify([
      { bankName: 'Bank BCA', accountName: getCleanName(couple.groomName), accountNumber: '8830192841' },
      { bankName: 'Bank Mandiri', accountName: getCleanName(couple.brideName), accountNumber: '1370019284712' },
    ]),
    events: [
      {
        title: 'Akad Nikah',
        date: new Date('2026-12-12T08:00:00.000Z'),
        startTime: '08:00 WIB',
        endTime: '10:00 WIB',
        venueName: 'Grand Ballroom Hotel Mulia',
        address: 'Jl. Asia Afrika No.6, Gelora, Tanah Abang, Jakarta Pusat',
        googleMapsUrl: 'https://maps.google.com',
      },
      {
        title: 'Resepsi Pernikahan',
        date: new Date('2026-12-12T11:00:00.000Z'),
        startTime: '11:00 WIB',
        endTime: '14:00 WIB',
        venueName: 'Grand Ballroom Hotel Mulia',
        address: 'Jl. Asia Afrika No.6, Gelora, Tanah Abang, Jakarta Pusat',
        googleMapsUrl: 'https://maps.google.com',
      },
    ],
    rsvps: [
      { guestName: 'Budi Santoso & Keluarga', status: 'ATTENDING', guestCount: 2, message: 'Selamat untuk kedua mempelai! Semoga sakinah mawaddah warahmah. Aamiin!' },
      { guestName: 'Rizky & Maya', status: 'ATTENDING', guestCount: 2, message: 'Happy wedding! Lancar terus sampai hari H yaa.' },
    ],
  };

  const guestName = searchParams.to || 'Bapak/Ibu/Saudara/i';

  return (
    <main className="min-h-screen bg-slate-950 flex justify-center relative">
      {/* Floating Quick Demo Switcher on Desktop */}
      <div className="fixed top-4 right-4 z-[9999] hidden sm:flex items-center gap-2">
        <a
          href="/demo"
          className="px-4 py-2 rounded-full bg-slate-900/95 hover:bg-slate-800 text-gold-400 hover:text-gold-300 border border-gold-500/40 text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 transition-all hover:scale-105"
          title="Buka Demo Template Acak Lainnya"
        >
          <span>🎲 Coba Demo Template Lain</span>
        </a>
      </div>

      <div className="w-full max-w-md bg-slate-950 min-h-screen shadow-2xl relative overflow-hidden border-x border-slate-900">
        <RenderInvitationView invitation={demoInvitation} guestName={guestName} />
      </div>
    </main>
  );
}
