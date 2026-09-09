import { NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const settingsFilePath = path.join(process.cwd(), 'public', 'uploads', 'platform-settings.json');

const defaultSettings = {
  siteName: 'Weddora AI Wedding Builder',
  siteLogo: '/logo.png',
  maintenanceMode: false,
  freeTierLimit: 0, // Free tier eliminated
  aiModelDefault: 'Gemini 3.6 Flash / Weddora AI Engine',
  supportWhatsapp: '6281234567890',
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
