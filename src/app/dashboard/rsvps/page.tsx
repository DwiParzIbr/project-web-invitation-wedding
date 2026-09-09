import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/lib/db';
import { RsvpsClient } from './RsvpsClient';

export const revalidate = 0;

export default async function RsvpsDashboardPage() {
  let invitation = await db.invitation.findFirst({
    where: { slug: 'andi-sinta' },
    include: {
      rsvps: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!invitation) {
    invitation = await db.invitation.findFirst({
      include: {
        rsvps: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  const rsvps = invitation?.rsvps || [];
  const title = invitation?.title || 'Pernikahan Andi & Sinta';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <RsvpsClient invitationTitle={title} rsvps={rsvps} />
      <Footer />
    </div>
  );
}
