import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { RenderInvitationView } from '@/components/invitation/RenderInvitationView';
import { getTemplateCouple } from '@/data/templateCouples';
import { getCleanName } from '@/utils/nameUtils';

interface PublicInvitationPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    to?: string;
    template?: string;
  };
}

export const revalidate = 0;

export default async function PublicInvitationPage({
  params,
  searchParams,
}: PublicInvitationPageProps) {
  let invitation = await db.invitation.findFirst({
    where: {
      OR: [
        { slug: params.slug },
        { id: params.slug },
        { groomName: { contains: params.slug } },
      ],
    },
    include: {
      music: true,
      events: true,
      rsvps: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!invitation || !invitation.isPublished) {
    return notFound();
  }

  let activeInvitation = invitation;

  // Dynamic Template Live Preview Matching with Unique Couple Names & Titles
  if (searchParams.template) {
    const matchedTemplate = await db.template.findFirst({
      where: {
        OR: [
          { slug: searchParams.template },
          { id: searchParams.template },
        ],
      },
    });

    if (matchedTemplate && matchedTemplate.designSchema) {
      const couple = getTemplateCouple(matchedTemplate.slug);

      // Parse design config and apply custom watermark text for this specific couple
      let customConfig: any = matchedTemplate.designSchema;
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
        customConfig = matchedTemplate.designSchema;
      }

      activeInvitation = {
        ...invitation,
        designConfig: customConfig,
        groomName: couple.groomName,
        groomParents: couple.groomParents,
        groomInstagram: couple.groomInstagram,
        brideName: couple.brideName,
        brideParents: couple.brideParents,
        brideInstagram: couple.brideInstagram,
        title: `Pernikahan ${getCleanName(couple.groomName)} & ${getCleanName(couple.brideName)}`,
      };
    }
  }

  const guestName = searchParams.to || 'Bapak/Ibu/Saudara/i';

  return (
    <main className="min-h-screen bg-slate-950 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 min-h-screen shadow-2xl relative overflow-hidden border-x border-slate-900">
        <RenderInvitationView invitation={activeInvitation} guestName={guestName} />
      </div>
    </main>
  );
}
