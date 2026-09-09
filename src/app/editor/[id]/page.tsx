import React from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { VisualEditor } from '@/components/editor/VisualEditor';
import { getTemplateCouple } from '@/data/templateCouples';
import { getCleanName } from '@/utils/nameUtils';

interface EditorPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

export default async function EditorPage({ params }: EditorPageProps) {
  // Resolve active logged in user session from cookies
  const cookieStore = cookies();
  const sessionUserId = cookieStore.get('weddora_session')?.value;

  let activeUser = null;
  if (sessionUserId) {
    activeUser = await db.user.findUnique({
      where: { id: sessionUserId },
    });
  }

  if (!activeUser) {
    activeUser = await db.user.findFirst({
      where: { email: 'andi@example.com' },
    });
  }

  if (!activeUser) {
    activeUser = await db.user.findFirst();
  }

  if (!activeUser) {
    return notFound();
  }

  // Fetch music list
  const musicList = await db.music.findMany({
    where: { status: 'ACTIVE' },
  });

  // Check if params.id is a Master Template edit request by Admin (e.g. /editor/template-cly...)
  if (params.id.startsWith('template-')) {
    const rawTemplateId = params.id.replace(/^template-/, '');
    const masterTemplate = await db.template.findFirst({
      where: {
        OR: [{ id: rawTemplateId }, { slug: rawTemplateId }, { id: params.id }, { slug: params.id }],
      },
    });

    if (masterTemplate) {
      const couple = getTemplateCouple(masterTemplate.slug);
      const masterInvitationData: any = {
        id: masterTemplate.id,
        isMasterTemplate: true,
        masterTemplateId: masterTemplate.id,
        templateId: masterTemplate.id,
        title: `[MASTER TEMPLATE ADMIN] ${masterTemplate.name}`,
        slug: masterTemplate.slug,
        groomName: couple.groomName,
        groomParents: couple.groomParents,
        groomInstagram: couple.groomInstagram,
        brideName: couple.brideName,
        brideParents: couple.brideParents,
        brideInstagram: couple.brideInstagram,
        weddingDate: new Date('2026-12-12T08:00:00.000Z'),
        coverPhoto: masterTemplate.previewImage,
        quoteText: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...',
        quoteSource: 'QS. Ar-Rum: 21',
        designConfig: masterTemplate.designSchema,
        events: [],
        digitalGifts: JSON.stringify([
          { bankName: 'Bank BCA', accountName: getCleanName(couple.groomName), accountNumber: '8401928371' },
          { bankName: 'Bank Mandiri', accountName: getCleanName(couple.brideName), accountNumber: '1270009823411' },
        ]),
      };
      return <VisualEditor initialInvitation={masterInvitationData} musicList={musicList} />;
    }
  }

  // Check if params.id is an existing invitation ID or a template ID/slug
  let invitation = await db.invitation.findFirst({
    where: {
      OR: [{ id: params.id }, { slug: params.id }],
    },
    include: {
      events: true,
      music: true,
    },
  });

  if (invitation) {
    // If invitation exists and activeUser is logged in, ensure ownership is assigned to activeUser if it's not the public demo ('andi-sinta')
    if (activeUser && invitation.userId !== activeUser.id && invitation.slug !== 'andi-sinta') {
      invitation = await db.invitation.update({
        where: { id: invitation.id },
        data: { userId: activeUser.id },
        include: {
          events: true,
          music: true,
        },
      });
    }
  } else {
    // If not existing invitation, check if it's a template ID or slug
    const template = await db.template.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!template) {
      return notFound();
    }

    // Get template-specific couple details (with or without titles)
    const couple = getTemplateCouple(template.slug);

    // Create a unique draft invitation slug from template FOR THE ACTIVE LOGGED-IN USER
    const newSlug = `undangan-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    invitation = await db.invitation.create({
      data: {
        userId: activeUser.id,
        templateId: template.id,
        title: `Undangan ${getCleanName(couple.groomName)} & ${getCleanName(couple.brideName)} (${template.name})`,
        slug: newSlug,
        groomName: couple.groomName,
        groomParents: couple.groomParents,
        groomInstagram: couple.groomInstagram,
        brideName: couple.brideName,
        brideParents: couple.brideParents,
        brideInstagram: couple.brideInstagram,
        weddingDate: new Date('2026-12-12T08:00:00.000Z'),
        quoteText: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...',
        quoteSource: 'QS. Ar-Rum: 21',
        designConfig: template.designSchema,
        digitalGifts: JSON.stringify([
          { bankName: 'Bank BCA', accountName: getCleanName(couple.groomName), accountNumber: '8401928371' },
          { bankName: 'Bank Mandiri', accountName: getCleanName(couple.brideName), accountNumber: '1270009823411' },
        ]),
      },
      include: {
        events: true,
        music: true,
      },
    });
  }

  return <VisualEditor initialInvitation={invitation} musicList={musicList} />;
}
