import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

const settingsFilePath = path.join(process.cwd(), 'public', 'uploads', 'platform-settings.json');

const defaultSettings = {
  siteName: 'Weddora Wedding Platform',
  siteLogo: '/logo.png',
  maintenanceMode: false,
  freeTierLimit: 0, // Free tier eliminated
  aiModelDefault: 'Weddora Smart Designer Engine',
  supportWhatsapp: '6282278765076',
  supportEmail: 'weddorawebsite@gmail.com',
  socialInstagram: 'https://instagram.com/weddora.id',
  socialTiktok: 'https://tiktok.com/@weddora.id',
  qrisMerchantName: 'WEDDORA DIGITAL INVITATION',
  midtransClientKey: 'SB-Mid-client-XXXXXX',
  midtransServerKey: 'SB-Mid-server-XXXXXX',
};

async function getStoredSettings() {
  try {
    const data = await readFile(settingsFilePath, 'utf-8');
    return { ...defaultSettings, ...JSON.parse(data) };
  } catch {
    return defaultSettings;
  }
}

// GET platform settings
export async function GET() {
  const settings = await getStoredSettings();
  return NextResponse.json(settings);
}

// POST update platform settings
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('weddora_session')?.value;
    if (userId) {
      const user = await db.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (user && user.role === 'OPERATOR') {
        return NextResponse.json(
          { error: 'Akses ditolak: Hanya Super Admin yang berwenang mengubah pengaturan sistem.' },
          { status: 403 }
        );
      }
    }
    const body = await request.json();
    const current = await getStoredSettings();
    const updated = { ...current, ...body };

    const dir = path.dirname(settingsFilePath);
    await mkdir(dir, { recursive: true });
    await writeFile(settingsFilePath, JSON.stringify(updated, null, 2), 'utf-8');

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
