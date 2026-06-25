import express from 'express';
import jwt from 'jsonwebtoken';
import { userModel, contentModel, linkModel, connectDb } from './db';
import { FRONTEND_URL, PORT, getAllowedOrigins } from './config';
import { userMiddleware } from './middlewares';
import { Random } from './utils';
import { signToken, seedDemoUser, loginDemoUser, verifyGoogleAndLogin } from './auth';
import { DEMO_USER_ENABLED, GOOGLE_CLIENT_ID } from './config';
import cors from "cors";

const app = express();
app.use(express.json());

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
}));

app.get('/api/v1/health', (_req, res) => {
  res.json({ status: 'ok', frontendUrl: FRONTEND_URL });
});

app.get('/api/v1/auth/config', (_req, res) => {
  res.json({
    googleEnabled: Boolean(GOOGLE_CLIENT_ID),
    demoEnabled: DEMO_USER_ENABLED,
    sessionExpiryMinutes: 30,
  });
});

app.post("/api/v1/signup", async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  if (!userName || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    await userModel.create({
      userName,
      password,
      authProvider: 'local',
    });

    res.json({ message: "Signup successful!" });
  } catch {
    res.status(400).json({ message: "User already exists!" });
  }
});

app.post('/api/v1/login', async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const existingUser = await userModel.findOne({ userName, password });

  if (existingUser) {
    const token = signToken(existingUser._id.toString());
    res.json({ token });
    return;
  }

  res.status(403).json({ message: "Invalid Credentials!" });
});

app.post('/api/v1/auth/google', async (req, res) => {
  const credential = req.body.credential;

  if (!credential) {
    res.status(400).json({ message: "Google credential is required" });
    return;
  }

  try {
    const token = await verifyGoogleAndLogin(credential);
    res.json({ token });
  } catch {
    res.status(401).json({ message: "Google authentication failed" });
  }
});

app.post('/api/v1/auth/demo', async (_req, res) => {
  try {
    const token = await loginDemoUser();
    res.json({ token });
  } catch {
    res.status(403).json({ message: "Demo login is not available" });
  }
});

app.post('/api/v1/createContent', userMiddleware, async (req, res) => {
  const type = req.body.type;
  const link = req.body.link;

  await contentModel.create({
    link,
    type,
    title: req.body.title,
    //@ts-ignore
    userId: req.userId,
    tags: []
  });

  res.json({ message: "Content Added Sucessfully!" });
});

app.get('/api/v1/viewContent', userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await contentModel.find({ userId }).populate('userId', 'userName');
  res.json({ content });
});

app.delete("/api/v1/deleteContent", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  if (!contentId) {
    res.status(400).json({ message: "Content ID is required" });
    return;
  }

  try {
    const result = await contentModel.deleteOne({
      _id: contentId,
      // @ts-ignore
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    res.status(200).json({ message: "Content deleted successfully" });
  } catch {
    res.status(500).json({ error: "Deletion failed" });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if (share) {
    const existingLink = await linkModel.findOne({
      //@ts-ignore
      userId: req.userId
    });

    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }

    const hash = Random(17);
    await linkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash: hash
    });

    res.json({ hash });
  } else {
    await linkModel.deleteOne({
      //@ts-ignore
      userId: req.userId
    });

    res.json({ message: "Shareable link is removed!" });
  }
});

app.get("/api/v1/brain/share/status", userMiddleware, async (req, res) => {
  const existingLink = await linkModel.findOne({
    //@ts-ignore
    userId: req.userId
  });

  if (!existingLink) {
    res.json({ shared: false, hash: null, createdAt: null });
    return;
  }

  res.json({
    shared: true,
    hash: existingLink.hash,
    createdAt: existingLink.createdAt
  });
});

app.get("/api/v1/brain/:sharelink", async (req, res) => {
  const hash = req.params.sharelink;

  const link = await linkModel.findOne({ hash });

  if (!link) {
    res.status(404).json({ message: "Invalid or expired share link" });
    return;
  }

  const user = await userModel.findOne({ _id: link.userId });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const content = await contentModel.find({ userId: link.userId });

  res.json({
    userName: user.userName,
    content: content
  });
});

async function start() {
  try {
    await connectDb();
    console.log('Connected to MongoDB');
    await seedDemoUser();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
      if (DEMO_USER_ENABLED) console.log('Demo user enabled');
      if (GOOGLE_CLIENT_ID) console.log('Google login enabled');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
