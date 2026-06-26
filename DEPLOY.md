# Deploy Second Brain to Render

## Quick fix (backend failing now)

Your logs show MongoDB connecting to `127.0.0.1:27017`. On Render that always fails.

1. Open **Render** → your backend service → **Environment**
2. **Delete** `MONGODB_URI` if it is `mongodb://127.0.0.1:27017/SecondBrain`
3. Add a real **MongoDB Atlas** URI (see below)
4. Set the other required variables
5. **Manual Deploy** → Deploy latest commit

---

## 1. MongoDB Atlas (free database)

1. Create a cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Database Access** → Add user (save username + password)
3. **Network Access** → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. **Database** → Connect → Drivers → copy connection string:

```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/SecondBrain?retryWrites=true&w=majority
```

Replace `USERNAME`, `PASSWORD`, and cluster host. URL-encode special characters in the password.

---

## 2. Backend on Render

| Setting | Value |
|---------|--------|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |
| Health Check Path | `/api/v1/health` |

### Environment variables (backend)

| Key | Required | Example |
|-----|----------|---------|
| `MONGODB_URI` | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/SecondBrain?retryWrites=true&w=majority` |
| `JWT_SECRET` | **Yes** | long random string (Render can auto-generate) |
| `FRONTEND_URL` | **Yes** | `https://second-brain-web.onrender.com` |
| `NODE_ENV` | Yes | `production` |
| `DEMO_USER_ENABLED` | No | `false` for production |
| `GOOGLE_CLIENT_ID` | No | your Google OAuth client ID |

`PORT` is set automatically by Render. Do **not** use localhost for `MONGODB_URI`.

---

## 3. Frontend on Render (static site)

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

### Environment variables (frontend — set before build)

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-BACKEND.onrender.com/api/v1` |
| `VITE_GOOGLE_CLIENT_ID` | same as backend `GOOGLE_CLIENT_ID` (optional) |

After the frontend URL is live, update backend `FRONTEND_URL` to match (for CORS).

---

## 4. Using render.yaml (optional)

This repo includes `render.yaml` at the root. In Render:

1. **New** → **Blueprint**
2. Connect your GitHub repo
3. Set `MONGODB_URI`, `FRONTEND_URL`, and `VITE_API_BASE_URL` when prompted
4. Deploy

---

## 5. Google login (optional)

1. [Google Cloud Console](https://console.cloud.google.com/) → APIs → Credentials → OAuth client
2. Authorized JavaScript origins: your frontend URL
3. Set `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend)

---

## Verify deployment

- Backend health: `https://YOUR-BACKEND.onrender.com/api/v1/health` → `{"status":"ok",...}`
- Frontend loads and login/signup works
- If CORS errors: ensure `FRONTEND_URL` on backend exactly matches the frontend URL (no trailing slash)
