import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const PORT = Number(process.env.PORT) || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  (isProduction ? '' : 'mongodb://127.0.0.1:27017/SecondBrain');
export const JWTSECRET =
  process.env.JWT_SECRET || (isProduction ? '' : 'change-me-in-production');
export const SESSION_EXPIRY = process.env.SESSION_EXPIRY || '30m';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const DEMO_USER_ENABLED = process.env.DEMO_USER_ENABLED === 'true';
export const DEMO_USER_USERNAME = process.env.DEMO_USER_USERNAME || 'demo';
export const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'demo12345';

export function validateProductionConfig(): void {
  const missing: string[] = [];

  if (!MONGODB_URI) missing.push('MONGODB_URI');
  if (!JWTSECRET) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    console.error('Missing required environment variables for production:');
    missing.forEach((key) => console.error(`  - ${key}`));
    console.error(
      '\nOn Render: open your service → Environment → add these variables, then redeploy.'
    );
    console.error(
      'MONGODB_URI must be a MongoDB Atlas connection string (mongodb+srv://...), not localhost.'
    );
    process.exit(1);
  }

  if (!FRONTEND_URL || FRONTEND_URL.includes('localhost')) {
    console.warn(
      'Warning: set FRONTEND_URL to your deployed frontend URL so CORS works (e.g. https://your-app.onrender.com).'
    );
  }
}
