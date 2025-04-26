import { NEXT_PUBLIC_REFRESH_TOKEN_KEY } from '@/constants/settings';
import { NextResponse } from 'next/server';

export async function POST(_request: Request) {
  try {
    // Create a response that will clear the refresh_token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set(NEXT_PUBLIC_REFRESH_TOKEN_KEY, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0)
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
