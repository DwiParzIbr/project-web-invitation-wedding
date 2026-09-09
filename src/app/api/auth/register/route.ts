import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Pendaftaran mandiri publik telah dinonaktifkan. Pembuatan akun baru hanya dapat diproses oleh Super Admin & Operator melalui Admin Console.',
    },
    { status: 403 }
  );
}
