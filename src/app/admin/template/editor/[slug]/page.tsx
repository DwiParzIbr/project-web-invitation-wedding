import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { getTemplateCouple } from '@/data/templateCouples';
import { getCleanName } from '@/utils/nameUtils';

interface AdminTemplateEditorPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

export default async function AdminTemplateEditorPage({
  params,
}: AdminTemplateEditorPageProps) {
  // Find template by slug or id
  const template = await db.template.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
    include: {
      category: true,
    },
  });

  if (!template) {
    return notFound();
  }

  // Get active music list
  const musicList = await db.music.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });

  const couple = getTemplateCouple(template.slug);

  // Parse existing master design schema
  let parsedDesignSchema: any = template.designSchema;
  try {
    if (typeof parsedDesignSchema === 'string') {
      parsedDesignSchema = JSON.parse(parsedDesignSchema);
    }
  } catch (e) {
    parsedDesignSchema = template.designSchema;
  }

  // Create mock invitation object configured specifically for Admin Master Template mode
  const mockMasterInvitation: any = {
    id: `template-${template.id}`,
    masterTemplateId: template.id,
    isMasterTemplate: true,
    slug: template.slug,
    title: `[MASTER TEMPLATE] ${template.name}`,
    isPublished: true,
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
    quoteText: 'Dan di antara tanda-tanda (kebesaran-Nya) ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri...',
    quoteSource: 'QS. Ar-Rum: 21',
    musicId: musicList[0]?.id,
    loveStory: JSON.stringify([
      { year: '2021', title: 'Pertemuan Pertama', description: 'Pertama kali bertemu saat menghadiri acara profesional.' },
      { year: '2023', title: 'Momen Berkomitmen', description: 'Memutuskan untuk melangkah bersama.' },
      { year: '2026', title: 'Hari Pernikahan', description: `Resepsi pernikahan bertema ${template.name}.` },
    ]),
    galleryPhotos: JSON.stringify([
      template.previewImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800',
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
    ],
    designConfig: parsedDesignSchema,
  };

  return (
    <VisualEditor
      initialInvitation={mockMasterInvitation}
      musicList={musicList}
    />
  );
}
