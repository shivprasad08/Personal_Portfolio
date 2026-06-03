import { NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    const secret = process.env.PORTFOLIO_TOTP_SECRET;

    if (!secret) {
      return NextResponse.json({ success: false, error: 'TOTP secret not configured' }, { status: 500 });
    }

    const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret) });
    const isValid = totp.validate({ token, window: 1 }) !== null;

    if (isValid) {
      // Set admin cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'portfolio_admin_session',
        value: 'true',
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
      });
      return response;
    } else {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
