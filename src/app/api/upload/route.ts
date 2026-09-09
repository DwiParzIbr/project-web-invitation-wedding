import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    let folder = (formData.get('folder') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Auto detect video mime type or extension
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name);
    const isAudio = file.type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name);

    if (!folder) {
      if (isVideo) folder = 'videos';
      else if (isAudio) folder = 'music';
      else folder = 'photos';
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and create unique name
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedFilename}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${filename}`;

    return NextResponse.json({
      url: publicUrl,
      name: file.name,
      size: file.size,
      folder,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Upload file gagal' }, { status: 500 });
  }
}
