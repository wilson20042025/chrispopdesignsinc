import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const useCloudinary = isCloudinaryConfigured();
    const uploadedUrls: string[] = [];

    let uploadsDir = '';
    if (!useCloudinary) {
      uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      if (!file || typeof file === 'string' || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalExt = path.extname(file.name) || '.jpg';
      const cleanName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${Date.now()}-${cleanName}`;

      if (useCloudinary) {
        // Upload directly to Cloudinary CDN
        const cloudUrl = await uploadToCloudinary(buffer, 'chrispoparch', uniqueFileName);
        uploadedUrls.push(cloudUrl);
      } else {
        // Fallback to local public/uploads for local development
        const localFileName = `${uniqueFileName}${originalExt}`;
        const filePath = path.join(uploadsDir, localFileName);
        await fs.writeFile(filePath, buffer);
        uploadedUrls.push(`/uploads/${localFileName}`);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      storage: useCloudinary ? 'cloudinary' : 'local',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
