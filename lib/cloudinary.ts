import { v2 as cloudinary } from 'cloudinary';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
}

function ensureConfig() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloudinary_url: process.env.CLOUDINARY_URL,
    });
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

/**
 * Upload a Buffer to Cloudinary and return the secure CDN URL.
 * Uses Base64 data URI upload which works reliably in all Serverless / Edge environments.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'chrispoparch',
  filename?: string,
  mimeType: string = 'image/jpeg'
): Promise<string> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing or not configured.');
  }

  ensureConfig();

  const base64Data = `data:${mimeType};base64,${buffer.toString('base64')}`;
  const cleanPublicId = filename ? filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_') : undefined;

  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    public_id: cleanPublicId,
    resource_type: 'auto',
  });

  if (!result || !result.secure_url) {
    throw new Error('Cloudinary upload returned empty response.');
  }

  return result.secure_url;
}

export default cloudinary;
