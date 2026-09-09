import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('weddora_session')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        package: true,
        maxInvitations: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
