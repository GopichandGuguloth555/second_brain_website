import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { userModel } from './db';
import {
  JWTSECRET,
  SESSION_EXPIRY,
  GOOGLE_CLIENT_ID,
  DEMO_USER_ENABLED,
  DEMO_USER_USERNAME,
  DEMO_USER_PASSWORD,
} from './config';

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, JWTSECRET, { expiresIn: '30m' });
}

export async function seedDemoUser(): Promise<void> {
  if (!DEMO_USER_ENABLED) return;

  const existing = await userModel.findOne({ userName: DEMO_USER_USERNAME });
  if (existing) return;

  await userModel.create({
    userName: DEMO_USER_USERNAME,
    password: DEMO_USER_PASSWORD,
    authProvider: 'demo',
  });

  console.log(`Demo user created: ${DEMO_USER_USERNAME}`);
}

export async function loginDemoUser() {
  if (!DEMO_USER_ENABLED) {
    throw new Error('Demo login is disabled');
  }

  let user = await userModel.findOne({ userName: DEMO_USER_USERNAME });
  if (!user) {
    user = await userModel.create({
      userName: DEMO_USER_USERNAME,
      password: DEMO_USER_PASSWORD,
      authProvider: 'demo',
    });
  }

  return signToken(user._id.toString());
}

export async function verifyGoogleAndLogin(credential: string) {
  if (!googleClient || !GOOGLE_CLIENT_ID) {
    throw new Error('Google login is not configured');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new Error('Invalid Google token');
  }

  let user = await userModel.findOne({ googleId: payload.sub });

  if (!user) {
    const baseName = (payload.email.split('@')[0] ?? 'user').replace(/[^a-zA-Z0-9_]/g, '');
    let userName = baseName || `user_${payload.sub.slice(0, 8)}`;
    let suffix = 1;

    while (await userModel.findOne({ userName })) {
      userName = `${baseName}${suffix}`;
      suffix += 1;
    }

    user = await userModel.create({
      userName,
      email: payload.email,
      googleId: payload.sub,
      authProvider: 'google',
    });
  }

  return signToken(user._id.toString());
}
