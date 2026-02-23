# Share Intent + Auto Save App

## Project Structure

```
day-2/
├── android/                 # Android configuration
│   └── AndroidManifest.xml # Share Target configuration
├── server/                 # Backend
│   ├── models/Item.js
│   ├── middleware/authMiddleware.js
│   ├── routes/auth.js
│   ├── server.js
│   └── package.json
└── client/                 # Frontend (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── ShareHandler.jsx
    │   │   ├── ConfirmationCard.jsx
    │   │   └── Toast.jsx
    │   ├── context/AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Home.jsx
    │   │   └── SharePage.jsx
    │   ├── services/api.js
    │   └── App.jsx
    └── package.json
```

## Features

- **Auto-detect** content type (link, image, document, note)
- **Auto-save** shared content to MongoDB
- **Beautiful confirmation** with Framer Motion animations
- **Toast notifications** with success/error states
- **JWT authentication**
- **Category badges** with colors

## Setup

### 1. Backend

```bash
cd day-2/server
npm install
```

Create `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/share-app
JWT_SECRET=your-secret-key
```

Start:
```bash
npm start
```

### 2. Frontend

```bash
cd day-2/client
npm install
npm run dev
```

### 3. Android (Capacitor)

Install Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "ShareApp" com.shareapp.app
npx cap add android
```

Update `android/app/src/main/AndroidManifest.xml` with share intent filters (provided).

Build:
```bash
npm run build
npx cap sync android
npx cap open android
```

## Share Flow

1. User shares from any app (Chrome, WhatsApp, Gallery, etc.)
2. App opens via Share Target intent
3. Content type is auto-detected
4. Content is auto-saved to backend
5. Beautiful confirmation card appears
6. Toast shows "Saved to [Category]"

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| POST | /api/auth/items/save | Save shared item |
| GET | /api/auth/items | Get user items |

## Content Type Detection

| Input | Detected Type | Category |
|-------|---------------|----------|
| https://... | link | Links |
| image/* | image | Images |
| application/pdf | document | Documents |
| text/* | note | Notes |

## Demo Credentials

- Email: demo@example.com
- Password: demo123
