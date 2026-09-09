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
      phone: u.phone,
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
    const { name, email, password, phone, invitationLinkName, role, package: pkgTier } = body;

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
        phone: phone ? phone.trim() : null,
        password,
        role: role || 'USER',
        package: userPackage,
        maxInvitations,
      },
    });

    // If invitationLinkName is provided, generate an initial invitation for this client
    if (invitationLinkName && invitationLinkName.trim()) {
      let slug = invitationLinkName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

      if (!slug) {
        slug = `undangan-${Date.now()}`;
      }

      // Ensure slug uniqueness
      const existingSlug = await db.invitation.findUnique({ where: { slug } });
      if (existingSlug) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }

      // Try to find a default template
      const defaultTemplate =
        (await db.template.findFirst({ where: { status: 'PUBLISHED' } })) ||
        (await db.template.findFirst());

      let groomName = 'Andi Pratama';
      let brideName = 'Sinta Nurhaliza';
      const cleanLinkName = invitationLinkName.trim();
      const separators = [' dan ', ' & ', ' and ', ' with '];
      let matched = false;
      for (const sep of separators) {
        if (cleanLinkName.toLowerCase().includes(sep)) {
          const parts = cleanLinkName.split(new RegExp(sep, 'i'));
          if (parts[0]?.trim()) groomName = parts[0].trim();
          if (parts[1]?.trim()) brideName = parts[1].trim();
          matched = true;
          break;
        }
      }
      if (!matched) {
        groomName = cleanLinkName;
      }

      if (defaultTemplate) {
        await db.invitation.create({
          data: {
            userId: newUser.id,
            templateId: defaultTemplate.id,
            title: `Undangan ${cleanLinkName}`,
            slug,
            isPublished: true,
            groomName,
            groomParents: 'Keluarga Mempelai Pria',
            brideName,
            brideParents: 'Keluarga Mempelai Wanita',
            weddingDate: new Date('2026-12-12T08:00:00.000Z'),
            quoteText: 'Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu...',
            quoteSource: 'QS. Ar-Rum: 21',
            designConfig: defaultTemplate.designSchema,
            digitalGifts: JSON.stringify([
              { bankName: 'Bank BCA', accountName: groomName, accountNumber: '8401928371' },
            ]),
          },
        });
      }
    }

    const createdClientWithInvs = await db.user.findUnique({
      where: { id: newUser.id },
      include: {
        invitations: {
          select: { id: true, title: true, slug: true, isPublished: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(
      {
        id: createdClientWithInvs!.id,
        name: createdClientWithInvs!.name,
        email: createdClientWithInvs!.email,
        phone: createdClientWithInvs!.phone,
        role: createdClientWithInvs!.role,
        package: createdClientWithInvs!.package,
        maxInvitations: createdClientWithInvs!.maxInvitations,
        invitations: createdClientWithInvs!.invitations || [],
        invitationsCount: createdClientWithInvs!.invitations?.length || 0,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: error?.message || 'Gagal membuat client baru' }, { status: 500 });
  }
}

// PUT edit an existing client
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, phone, role, package: pkgTier } = body;

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
        phone: phone !== undefined ? (phone ? phone.trim() : null) : undefined,
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
      phone: updatedUser.phone,
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
