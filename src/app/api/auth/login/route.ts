import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        package: user.package,
        maxInvitations: user.maxInvitations,
      },
    });

    // Set cookie
    response.cookies.set('weddora_session', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
