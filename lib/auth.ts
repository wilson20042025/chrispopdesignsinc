import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'chrispop2026';
const COOKIE_NAME = 'chrispop_admin_session';
const SECRET_KEY = process.env.ADMIN_SECRET || 'chrispop-arch-secret-key-2026-secure';

function createToken(): string {
  const payload = `admin:${Date.now()}`;
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;
    const [user, timestamp, signature] = parts;
    if (user !== 'admin') return false;

    // Check expiration (7 days)
    const issueTime = parseInt(timestamp, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - issueTime > maxAge) return false;

    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(`${user}:${timestamp}`).digest('hex');
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return false;
  return verifyToken(sessionCookie.value);
}

export async function login(password: string): Promise<boolean> {
  if (password !== ADMIN_PASSWORD) {
    return false;
  }

  const cookieStore = await cookies();
  const token = createToken();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return true;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
