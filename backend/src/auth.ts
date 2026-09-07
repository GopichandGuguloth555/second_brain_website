

import jwt from 'jsonwebtoken';
import { userModel } from './db';
import {
  JWTSECRET,
  DEMO_USER_ENABLED,
  DEMO_USER_USERNAME,
  DEMO_USER_PASSWORD,
} from './config';

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


