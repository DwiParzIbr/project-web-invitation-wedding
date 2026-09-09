import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitationId, guestName, status, guestCount, message, phone } = body;

    if (!invitationId || !guestName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const rsvp = await db.rsvp.create({
      data: {
        invitationId,
        guestName,
        status: status || 'ATTENDING',
        guestCount: parseInt(guestCount) || 1,
        message: message || '',
        phone: phone || '',
      },
    });

    return NextResponse.json(rsvp);
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}
