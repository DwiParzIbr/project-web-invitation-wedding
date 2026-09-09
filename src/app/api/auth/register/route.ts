import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, package: packageName } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    const selectedPkg = packageName || 'BASIC';
    let quota = 3;
    if (selectedPkg === 'FREE') quota = 1;
    if (selectedPkg === 'BASIC') quota = 3;
    if (selectedPkg === 'PREMIUM') quota = 10;
    if (selectedPkg === 'LUXURY') quota = 999;

    const user = await db.user.create({
      data: {
        name,
        email,
        password,
        role: 'USER',
        package: selectedPkg,
        maxInvitations: quota,
      },
    });

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

    response.cookies.set('weddora_session', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
