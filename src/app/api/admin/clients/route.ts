import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all clients/users with their invitations
export async function GET() {
  try {
    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitations: {
          select: { id: true, title: true, slug: true, isPublished: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      package: u.package,
      maxInvitations: u.maxInvitations,
      createdAt: u.createdAt,
      invitations: u.invitations,
      invitationsCount: u.invitations.length,
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

// POST create a new client/user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role, package: pkgTier } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, Email, dan Password wajib diisi' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar di sistem' }, { status: 400 });
    }

    const userPackage = pkgTier || 'PREMIUM';
    let maxInvitations = 10;
    if (userPackage === 'BASIC') maxInvitations = 3;
    if (userPackage === 'LUXURY') maxInvitations = 999;

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password,
        role: role || 'CLIENT',
        package: userPackage,
        maxInvitations,
      },
      include: {
        invitations: {
          select: { id: true, title: true, slug: true, isPublished: true, createdAt: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        package: newUser.package,
        maxInvitations: newUser.maxInvitations,
        invitations: newUser.invitations || [],
        invitationsCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
  }
}

// PUT edit an existing client
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, role, package: pkgTier } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userPackage = pkgTier || 'PREMIUM';
    let maxInvitations = 10;
    if (userPackage === 'BASIC') maxInvitations = 3;
    if (userPackage === 'LUXURY') maxInvitations = 999;

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        package: userPackage,
        maxInvitations,
      },
      include: {
        invitations: {
          select: { id: true, title: true, slug: true, isPublished: true, createdAt: true },
        },
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      package: updatedUser.package,
      maxInvitations: updatedUser.maxInvitations,
      invitations: updatedUser.invitations || [],
      invitationsCount: updatedUser.invitations.length,
    });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 });
  }
}

// DELETE client OR individual client invitation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const invitationId = searchParams.get('invitationId');

    if (invitationId) {
      // Delete specific client invitation
      await db.rsvp.deleteMany({ where: { invitationId } });
      await db.invitation.delete({ where: { id: invitationId } });
      return NextResponse.json({ success: true, message: 'Undangan client berhasil dihapus' });
    }

    if (id) {
      // Delete client user and all invitations
      const userInvitations = await db.invitation.findMany({ where: { userId: id }, select: { id: true } });
      const invitationIds = userInvitations.map((inv) => inv.id);

      await db.rsvp.deleteMany({ where: { invitationId: { in: invitationIds } } });
      await db.invitation.deleteMany({ where: { userId: id } });
      await db.user.delete({ where: { id } });

      return NextResponse.json({ success: true, message: 'Client dan seluruh undangannya berhasil dihapus' });
    }

    return NextResponse.json({ error: 'Parameter id atau invitationId wajib disertakan' }, { status: 400 });
  } catch (error) {
    console.error('Error in DELETE:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
