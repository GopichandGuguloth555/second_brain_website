import dotenv from 'dotenv';

dotenv.config();

/** True on Render, Vercel, or when NODE_ENV is production */
export const isCloudDeploy =
  process.env.NODE_ENV === 'production' ||
  process.env.RENDER === 'true' ||
  Boolean(process.env.RENDER_SERVICE_ID);

export const PORT = Number(process.env.PORT) || 3000;

export function getAllowedOrigins(): string[] {
  return (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);
}

export const FRONTEND_URL = getAllowedOrigins()[0] || 'http://localhost:5173';

export const MONGODB_URI =
  process.env.MONGODB_URI ||
  (isCloudDeploy ? '' : 'mongodb://127.0.0.1:27017/SecondBrain');

export const JWTSECRET =
  process.env.JWT_SECRET || (isCloudDeploy ? '' : 'change-me-in-production');

export const SESSION_EXPIRY = process.env.SESSION_EXPIRY || '30m';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const DEMO_USER_ENABLED = process.env.DEMO_USER_ENABLED === 'true';
export const DEMO_USER_USERNAME = process.env.DEMO_USER_USERNAME || 'demo';
export const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'demo12345';

function isLocalMongoUri(uri: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(uri);
}

export function validateProductionConfig(): void {
  const missing: string[] = [];

  if (!MONGODB_URI) missing.push('MONGODB_URI');
  if (!JWTSECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error('\nRender → your service → Environment → add these, then redeploy.');
    console.error('MONGODB_URI must be MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/SecondBrain');
    process.exit(1);
  }

  if (isLocalMongoUri(MONGODB_URI)) {
    console.error('MONGODB_URI points to localhost — that will not work on Render.');
    console.error('Replace it with your MongoDB Atlas connection string (mongodb+srv://...).');
    console.error('Remove any localhost value from Render Environment variables.');
    process.exit(1);
  }

  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('MONGODB_URI must start with mongodb:// or mongodb+srv://');
    process.exit(1);
  }

  const origins = getAllowedOrigins();
  if (origins.some((url) => url.includes('localhost'))) {
    console.warn(
      'Warning: FRONTEND_URL should be your live frontend URL (e.g. https://your-app.onrender.com).'
    );
  }
}
