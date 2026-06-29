# 🧠 Second Brain

A full-stack personal knowledge management application that lets users save, organize, and share useful content from across the web.

🔗 **Live Demo:** https://second-brain-website-mu.vercel.app

---

## ✨ Features

- 🔐 JWT Authentication
- 👤 User Signup & Login
- 🌐 Google OAuth Login
- 🎯 Demo Account Login
- 📚 Save YouTube videos, Tweets, Notes and Links
- 🗑️ Delete saved content
- 🔗 Generate shareable public brain links
- 📋 Share history management
- 📱 Responsive modern UI
- ☁️ Fully deployed on Vercel + Render

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Google OAuth

### Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
second_brain_website
│
├── frontend
│   ├── src
│   ├── public
│   └── vite.config.ts
│
├── backend
│   ├── src
│   ├── package.json
│   └── tsconfig.json
│
└── render.yaml
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/GopichandGuguloth555/second_brain_website.git

cd second_brain_website
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id

DEMO_USER_ENABLED=true

DEMO_USER_USERNAME=demo

DEMO_USER_PASSWORD=demo123
```

Run the backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1

VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the frontend

```bash
npm run dev
```

---

## API Endpoints

### Authentication

```
POST /api/v1/signup

POST /api/v1/login

POST /api/v1/auth/google

POST /api/v1/auth/demo
```

### Content

```
POST /api/v1/createContent

GET /api/v1/viewContent

DELETE /api/v1/deleteContent
```

### Share

```
POST /api/v1/brain/share

GET /api/v1/brain/share/status

GET /api/v1/brain/:sharelink
```

---

## 📸 Screenshots

### Landing Page

![Landing](./assets/landing.png)

### Dashboard

![Dashboard](./assets/dashboard.png)

### Share History

![Share History](./assets/share-history.png)

---

## Future Improvements

- Folder organization
- Tags & Categories
- Search functionality
- Rich text notes
- Password hashing with bcrypt
- Email verification
- Dark/Light theme
- AI-powered content summaries

---

## Author

**Gopichand Guguloth**

GitHub:
https://github.com/GopichandGuguloth555

LinkedIn:
https://www.linkedin.com/in/gopichand-guguloth/

---

## ⭐ Show your support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

