import fs from 'fs';
import path from 'path';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
let secret = '';
for (let i = 0; i < 32; i++) secret += chars.charAt(Math.floor(Math.random() * chars.length));
console.log('Generated TOTP Secret:', secret);

const envPath = path.join(process.cwd(), '.env.local');

let envContent = '';
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

if (!envContent.includes('PORTFOLIO_TOTP_SECRET=')) {
  fs.appendFileSync(envPath, `\nPORTFOLIO_TOTP_SECRET=${secret}\n`);
  console.log('Added PORTFOLIO_TOTP_SECRET to .env.local');
} else {
  console.log('PORTFOLIO_TOTP_SECRET already exists in .env.local');
}
