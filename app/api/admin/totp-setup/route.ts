import { NextResponse } from 'next/server';
import * as OTPAuth from 'otpauth';

export async function GET() {
  const secret = process.env.PORTFOLIO_TOTP_SECRET;

  if (!secret) {
    return NextResponse.json({ error: 'PORTFOLIO_TOTP_SECRET is not set in .env.local' }, { status: 500 });
  }

  const totp = new OTPAuth.TOTP({
    issuer: 'Portfolio',
    label: 'Admin',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret)
  });
  
  const otpauth = totp.toString();

  return NextResponse.json({ secret, otpauth });
}
