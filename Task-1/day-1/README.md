# Auth App - Frontend Only

A complete authentication system using React + localStorage (no backend/database required).

## Project Structure

```
day-1/
└── client/                 # Frontend Only (React + Vite)
    ├── src/
    │   ├── components/
    │   │   ├── AuthCard.jsx
    │   │   ├── InputField.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Home.jsx
    │   ├── services/
    │   │   └── api.js         # All auth logic here
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## How It Works

- **Signup**: Email & password stored in localStorage with bcrypt hashing
- **Login**: Validates credentials against localStorage users
- **JWT**: Generated and validated client-side using jsonwebtoken
- **Persistence**: All data stored in browser localStorage

## Setup

```bash
cd Task-1/day-1/client
npm install
npm run dev
```

The app runs on http://localhost:3000

## Features

- User registration with email/password
- Password hashing with bcrypt
- JWT-based authentication (7-day expiry)
- Protected routes
- Token persistence in localStorage
- Modern UI with Tailwind CSS
- Password strength indicator
- Error/success states

## Tech Stack

- React 18 with Vite
- Tailwind CSS
- React Router DOM
- bcryptjs for password hashing
- jsonwebtoken for JWT
