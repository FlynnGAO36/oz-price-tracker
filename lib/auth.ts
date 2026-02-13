import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-this'
);

const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';

// Verify password
export function verifyPassword(password: string): boolean {
  return password === AUTH_PASSWORD;
}

// Create JWT token
export async function createToken(): Promise<string> {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

// Verify JWT token
export async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

// Set authentication cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Get authentication token
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// Clear authentication cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  return await verifyToken(token);
}
