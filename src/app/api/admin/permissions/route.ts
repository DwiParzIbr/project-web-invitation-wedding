import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Permissions matrix definition
const ROLE_PERMISSIONS_MATRIX = [
  {
    module: 'Admin Overview & Statistik',
    description: 'Melihat ringkasan total pengguna, template, dan undangan',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Manajemen Client & Undangan',
    description: 'Melihat daftar klien, memeriksa undangan & asistensi',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Tambah & Aktivasi Pengguna Baru',
    description: 'Membuat akun pengguna baru dan menetapkan paket',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Kelola Katalog Template & Desain',
    description: 'Menambah, mengubah harga, dan menerbitkan template baru',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Kelola Koleksi Musik MP3',
    description: 'Mengupload dan mengelola pustaka musik kustom',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Rekap Transaksi & Order',
    description: 'Memantau pesanan paket undangan dari klien',
    ADMIN: true,
    OPERATOR: true,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Konfigurasi Sistem & Payment Gateway',
    description: 'Mengatur Midtrans API keys, WhatsApp CS, & maintenance',
    ADMIN: true,
    OPERATOR: false,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Hak Akses & Manajemen Peran (RBAC)',
    description: 'Mengubah role pengguna (Admin, Operator, User, Demo)',
    ADMIN: true,
    OPERATOR: false,
    USER: false,
    DEMO: false,
  },
  {
    module: 'Studio Editor & Personalisasi Undangan',
    description: 'Mengedit teks, foto galeri, mempelai, acara & maps',
    ADMIN: true,
    OPERATOR: true,
    USER: true,
    DEMO: true, // Demo Mode
  },
  {
    module: 'RSVP, Buku Tamu & QRIS Kado',
    description: 'Menerima konfirmasi hadir, ucapan tamu & donasi kado',
    ADMIN: true,
    OPERATOR: true,
    USER: true,
    DEMO: false, // Hanya simulasi di Demo
  },
];

async function getCurrentUser() {
  const cookieStore = cookies();
  const userId = cookieStore.get('weddora_session')?.value;
  if (!userId) return null;
  return db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true },
  });
}

// GET users list, role counts, and permissions matrix
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    const users = await db.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitations: {
          select: { id: true, title: true, slug: true, isPublished: true },
        },
      },
    });

    const counts = {
      ADMIN: users.filter((u) => u.role === 'ADMIN').length,
      OPERATOR: users.filter((u) => u.role === 'OPERATOR').length,
      USER: users.filter((u) => u.role === 'USER' || u.role === 'CLIENT').length,
      DEMO: users.filter((u) => u.role === 'DEMO').length,
      TOTAL: users.length,
    };

    const formattedUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role === 'CLIENT' ? 'USER' : u.role,
      package: u.package,
      maxInvitations: u.maxInvitations,
      invitationsCount: u.invitations.length,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      currentUserRole: currentUser?.role || 'GUEST',
      currentUserId: currentUser?.id,
      counts,
      matrix: ROLE_PERMISSIONS_MATRIX,
      users: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json({ error: 'Failed to fetch permissions data' }, { status: 500 });
  }
}

// POST: Admin creates a new user with specific role
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya Super Admin yang berwenang menambahkan pengguna baru.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, package: pkgTier } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, Email, dan Password wajib diisi' }, { status: 400 });
    }

    const validRoles = ['ADMIN', 'OPERATOR', 'USER', 'DEMO'];
    const targetRole = validRoles.includes(role) ? role : 'USER';

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email sudah terdaftar dalam sistem' }, { status: 400 });
    }

    let maxInvitations = 5;
    if (targetRole === 'ADMIN') maxInvitations = 999;
    else if (targetRole === 'OPERATOR') maxInvitations = 100;
    else if (pkgTier === 'LUXURY') maxInvitations = 999;
    else if (pkgTier === 'BASIC') maxInvitations = 3;

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password,
        role: targetRole,
        package: pkgTier || (targetRole === 'ADMIN' || targetRole === 'OPERATOR' ? 'LUXURY' : 'PREMIUM'),
        maxInvitations,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        package: newUser.package,
        maxInvitations: newUser.maxInvitations,
      },
    });
  } catch (error) {
    console.error('Error creating user via permissions API:', error);
    return NextResponse.json({ error: 'Gagal membuat pengguna' }, { status: 500 });
  }
}

// PUT: Admin updates role or package of a user
export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya Super Admin yang berwenang mengubah hak akses pengguna.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, role, package: pkgTier, password, name } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID diperlukan' }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // Protect root admin from demoting itself if it's the only admin
    if (targetUser.email === 'admin@weddora.com' && role && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Akun Superadmin Utama (admin@weddora.com) tidak dapat diturunkan perannya.' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (role) {
      const validRoles = ['ADMIN', 'OPERATOR', 'USER', 'DEMO'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Peran tidak valid' }, { status: 400 });
      }
      updateData.role = role;
    }
    if (pkgTier) updateData.package = pkgTier;
    if (password && password.trim().length > 0) updateData.password = password;
    if (name) updateData.name = name;

    const updated = await db.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        package: updated.package,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Gagal memperbarui hak akses pengguna' }, { status: 500 });
  }
}

// DELETE: Admin deletes a user
export async function DELETE(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya Super Admin yang berwenang menghapus pengguna.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID diperlukan' }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    if (targetUser.email === 'admin@weddora.com') {
      return NextResponse.json(
        { error: 'Akun Superadmin Utama (admin@weddora.com) tidak dapat dihapus.' },
        { status: 400 }
      );
    }

    // Delete related invitations first
    await db.invitation.deleteMany({ where: { userId: id } });
    await db.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}
