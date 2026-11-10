import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { isAuthenticated } from '@/lib/auth';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: 'Unauthorized: Admin session expired. Please refresh and log in again.' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get('file') as File | null;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload.' }, { status: 400 });
    }

    const useCloudinary = isCloudinaryConfigured();
    const uploadedUrls: string[] = [];

    // On Vercel / serverless production, Cloudinary is required because local filesystem is read-only
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    if (!useCloudinary && isServerless) {
      return NextResponse.json(
        {
          error: 'Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not set on Vercel. Please add them in Vercel Project Settings > Environment Variables.',
        },
        { status: 500 }
      );
    }

    let uploadsDir = '';
    if (!useCloudinary) {
      uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    for (const file of files) {
      if (!file || typeof file === 'string' || !file.name) continue;

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const originalExt = path.extname(file.name).toLowerCase() || '.jpg';
      const cleanName = path.basename(file.name, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${Date.now()}-${cleanName}`;
      const mimeType = file.type || (originalExt === '.webp' ? 'image/webp' : 'image/jpeg');

      if (useCloudinary) {
        // Upload directly to Cloudinary CDN
        const cloudUrl = await uploadToCloudinary(
          buffer,
          'chrispoparch',
          `${uniqueFileName}${originalExt}`,
          mimeType
        );
        uploadedUrls.push(cloudUrl);
      } else {
        // Local fallback for local development
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
    console.error('Upload handler error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An unexpected error occurred during photo upload.',
      },
      { status: 500 }
    );
  }
}
