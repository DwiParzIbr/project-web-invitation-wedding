import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all active music tracks
export async function GET() {
  try {
    const musicList = await db.music.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(musicList);
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch music' }, { status: 500 });
  }
}

// POST create a new music track and persist in database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, artist, audioUrl, duration, genre, isRoyaltyFree } = body;

    if (!audioUrl) {
      return NextResponse.json({ error: 'Audio URL is required' }, { status: 400 });
    }

    const music = await db.music.create({
      data: {
        title: title || 'Lagu Pernikahan',
        artist: artist || 'Custom Artist',
        audioUrl,
        duration: duration || '3:30',
        genre: genre || 'Acoustic',
        isRoyaltyFree: isRoyaltyFree ?? true,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(music, { status: 201 });
  } catch (error) {
    console.error('Error creating music track:', error);
    return NextResponse.json({ error: 'Failed to create music track' }, { status: 500 });
  }
}

// DELETE a music track by id
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Music ID is required' }, { status: 400 });
    }

    await db.music.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting music track:', error);
    return NextResponse.json({ error: 'Failed to delete music track' }, { status: 500 });
  }
}
