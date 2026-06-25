import dotenv from 'dotenv';

dotenv.config();

export const PORT = Number(process.env.PORT) || 3000;
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/SecondBrain';
export const JWTSECRET = process.env.JWT_SECRET || 'change-me-in-production';
export const SESSION_EXPIRY = process.env.SESSION_EXPIRY || '30m';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const DEMO_USER_ENABLED = process.env.DEMO_USER_ENABLED === 'true';
export const DEMO_USER_USERNAME = process.env.DEMO_USER_USERNAME || 'demo';
export const DEMO_USER_PASSWORD = process.env.DEMO_USER_PASSWORD || 'demo12345';

export function getAllowedOrigins(): string[] {
  return FRONTEND_URL.split(',').map((url) => url.trim()).filter(Boolean);
}
