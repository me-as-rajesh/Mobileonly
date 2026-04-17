import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';

// Ensure Firebase Admin is initialized
if (!adminApp) {
  throw new Error("Firebase Admin SDK not initialized");
}

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await auth(adminApp).createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session cookie creation failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to create session' }, { status: 401 });
  }
}

export async function DELETE() {
  const sessionCookie = cookies().get('session')?.value;
  if (sessionCookie) {
    cookies().delete('session');
    try {
      const decodedClaims = await auth(adminApp).verifySessionCookie(sessionCookie);
      await auth(adminApp).revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
      // Ignore errors if the cookie is invalid.
    }
  }
  return NextResponse.json({ success: true });
}
