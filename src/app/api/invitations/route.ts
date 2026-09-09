import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

const cleanJSONString = (val: any) => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    // Only attempt JSON parsing if string starts with JSON object/array markers
    if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
      return val;
    }
    try {
      let temp = val;
      while (typeof temp === 'string') {
        const parsed = JSON.parse(temp);
        if (typeof parsed === 'object') return JSON.stringify(parsed);
        temp = parsed;
      }
    } catch {
      return val;
    }
  }
  return String(val);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    if (slug) {
      const invitation = await db.invitation.findUnique({
        where: { slug },
        include: {
          music: true,
          events: true,
          rsvps: true,
        },
      });
      return NextResponse.json(invitation);
    }

    if (id) {
      const invitation = await db.invitation.findUnique({
        where: { id },
        include: {
          music: true,
          events: true,
          rsvps: true,
        },
      });
      return NextResponse.json(invitation);
    }

    const invitations = await db.invitation.findMany({
      include: {
        music: true,
        events: true,
      },
    });
    return NextResponse.json(invitations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invitations' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const sessionUserId = cookieStore.get('weddora_session')?.value;

    const body = await request.json();
    const {
      id,
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
      loveStory,
      galleryPhotos,
      musicId,
      designConfig,
      events,
      digitalGifts,
      slug,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invitation ID required' }, { status: 400 });
    }

    let validMusicId = musicId;
    if (musicId) {
      const existingMusic = await db.music.findUnique({ where: { id: musicId } });
      if (!existingMusic) {
        const firstMusic = await db.music.findFirst({ where: { status: 'ACTIVE' } });
        validMusicId = firstMusic?.id || null;
      }
    }

    const updateData: any = {
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
      weddingDate: weddingDate ? new Date(weddingDate) : undefined,
      quoteText,
      quoteSource,
      loveStory: cleanJSONString(loveStory),
      galleryPhotos: cleanJSONString(galleryPhotos),
      musicId: validMusicId,
      designConfig: cleanJSONString(designConfig),
      digitalGifts: cleanJSONString(digitalGifts),
    };

    // Handle slug update & validate uniqueness
    if (slug) {
      const cleanSlug = String(slug)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (cleanSlug) {
        const conflict = await db.invitation.findFirst({
          where: {
            slug: cleanSlug,
            NOT: { id },
          },
        });

        if (conflict) {
          return NextResponse.json(
            { error: `Slug link "/${cleanSlug}" sudah digunakan oleh undangan lain. Silakan gunakan variasi nama lain.` },
            { status: 400 }
          );
        }

        updateData.slug = cleanSlug;
      }
    }

    // If user is logged in, ensure the invitation belongs to active session user (unless it's public demo 'andi-sinta')
    if (sessionUserId) {
      const existing = await db.invitation.findUnique({ where: { id } });
      if (existing && existing.slug !== 'andi-sinta' && existing.userId !== sessionUserId) {
        updateData.userId = sessionUserId;
      }
    }

    const updated = await db.invitation.update({
      where: { id },
      data: updateData,
      include: {
        music: true,
        events: true,
        rsvps: true,
      },
    });

    if (validMusicId && updated.slug !== 'andi-sinta') {
      await db.invitation.updateMany({
        where: { slug: 'andi-sinta' },
        data: { musicId: validMusicId },
      });
    }

    if (events && Array.isArray(events)) {
      await db.event.deleteMany({ where: { invitationId: id } });
      await db.event.createMany({
        data: events.map((ev: any) => ({
          invitationId: id,
          eventType: ev.eventType || 'AKAD',
          title: ev.title || 'Acara',
          date: new Date(ev.date || weddingDate || Date.now()),
          startTime: ev.startTime || '08:00 WIB',
          endTime: ev.endTime || 'Selesai',
          venueName: ev.venueName || 'Lokasi',
          address: ev.address || 'Alamat',
          googleMapsUrl: ev.googleMapsUrl || '',
        })),
      });
    }

    return NextResponse.json({ success: true, invitation: updated });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json({ error: 'Failed to update invitation' }, { status: 500 });
  }
}
